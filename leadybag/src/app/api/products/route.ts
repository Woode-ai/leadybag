// src/app/api/products/route.ts
// GET  /api/products  → عرض المنتجات مع دعم البحث والفلاتر والترقيم
//   أمثلة على الاستخدام:
//   /api/products?page=1&limit=12
//   /api/products?category=<categoryId>
//   /api/products?minPrice=100&maxPrice=500
//   /api/products?search=حقيبة
//   /api/products?color=أسود&size=M
//   /api/products?sort=price_asc  (أو price_desc أو newest)
//
// POST /api/products → إضافة منتج جديد (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { escapeRegex } from "@/lib/sanitize";
import { getCached, setCached, getCacheVersion, bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // مفتاح الكاش يشمل كل معايير البحث/الفلترة + رقم الإصدار الحالي
    // بهذا، كل تركيبة فلاتر مختلفة (سعر/قسم/بحث..) لها كاش منفصل تلقائياً
    const version = await getCacheVersion("products");
    const cacheKey = `products:v${version}:${searchParams.toString()}`;

    const cached = await getCached<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, _cached: true });
    }

    await connectDB();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const minRating = searchParams.get("minRating");
    const sort = searchParams.get("sort") || "newest";

    // نبني "فلتر" mongoose تدريجياً حسب ما أُرسل من معايير
    const filter: any = {};

    if (category) filter.categoryId = category;
    if (color) filter.colors = color;
    if (size) filter.sizes = size;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // نهرّب الأحرف الخاصة أولاً لمنع هجمات ReDoS، ثم نبحث في اسم المنتج بالعربية أو الإنجليزية
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { "name.ar": { $regex: safeSearch, $options: "i" } },
        { "name.en": { $regex: safeSearch, $options: "i" } },
      ];
    }

    // ترتيب النتائج
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    let products = await Product.find(filter)
      .populate("categoryId", "name slug") // نجلب اسم القسم بدلاً من الـ id فقط
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    // فلترة التقييم الأدنى (نحسبها بعد الجلب لأنها متوسط وليست حقلاً مباشراً)
    if (minRating) {
      const minRatingNum = Number(minRating);
      products = products.filter((p) => {
        if (p.ratings.length === 0) return false;
        const avg = p.ratings.reduce((sum, r) => sum + r.rating, 0) / p.ratings.length;
        return avg >= minRatingNum;
      });
    }

    const total = await Product.countDocuments(filter);

    const responseBody = {
      status: "success",
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // نخزّن النتيجة لمدة 60 ثانية فقط - وقت كافٍ لتخفيف الضغط، وقصير كفاية حتى لا تظهر بيانات قديمة طويلاً
    await setCached(cacheKey, responseBody, 60);

    return NextResponse.json(responseBody);
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.create({ ...parsed.data, ratings: [] });

    // نلغي كل كاش المنتجات القديم فوراً - وإلا سيرى العملاء بيانات قديمة لا تشمل هذا المنتج الجديد لمدة دقيقة
    await bumpCacheVersion("products");

    return NextResponse.json(
      { status: "success", message: "تم إضافة المنتج بنجاح", product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
