// src/app/api/products/[id]/route.ts
// GET    /api/products/:id  → تفاصيل منتج واحد + منتجات مشابهة (توصيات بسيطة)
// PUT    /api/products/:id  → تعديل منتج (أدمن فقط)
// DELETE /api/products/:id  → حذف منتج (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).populate("categoryId", "name slug");

    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    // توصيات بسيطة: منتجات أخرى من نفس القسم (باستثناء المنتج الحالي)، أحدث 4 منتجات
    const recommendations = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: "success", product, recommendations });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("products"); // نلغي الكاش القديم حتى لا تظهر البيانات القديمة للعملاء

    return NextResponse.json({ status: "success", message: "تم تعديل المنتج بنجاح", product });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("products");

    return NextResponse.json({ status: "success", message: "تم حذف المنتج بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
