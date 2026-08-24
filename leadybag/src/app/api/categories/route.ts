// src/app/api/categories/route.ts
// GET  /api/categories  → يعيد كل الأقسام (متاح للجميع، بدون تسجيل دخول)
// POST /api/categories  → يضيف قسماً جديداً (أدمن فقط) - يُستخدم من لوحة التحكم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  try {
    await connectDB();
    // ترتيب الأقسام من الأحدث إلى الأقدم
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: "success", categories });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // فقط الأدمن يمكنه إضافة قسم جديد
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // التأكد أن الـ slug غير مستخدم من قبل
    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "يوجد قسم آخر بنفس الـ slug" },
        { status: 409 }
      );
    }

    const category = await Category.create(parsed.data);
    return NextResponse.json(
      { status: "success", message: "تم إنشاء القسم بنجاح", category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
