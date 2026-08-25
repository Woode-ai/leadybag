// src/app/api/products/[id]/reviews/route.ts
// POST /api/products/:id/reviews
// يضيف تقييماً (نجوم + تعليق + صور اختيارية) على منتج معين
// يتطلب تسجيل الدخول (أي عميل مسجل يمكنه التقييم)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { ratingSchema } from "@/lib/validation";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لإضافة تقييم" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = ratingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    product.ratings.push({
      userId: currentUser.userId as any,
      rating: parsed.data.rating,
      comment: parsed.data.comment || "",
      images: parsed.data.images || [],
      createdAt: new Date(),
    });

    await product.save();

    return NextResponse.json(
      { status: "success", message: "تم إضافة تقييمك بنجاح", ratings: product.ratings },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
