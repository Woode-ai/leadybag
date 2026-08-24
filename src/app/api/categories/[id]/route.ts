// src/app/api/categories/[id]/route.ts
// GET    /api/categories/:id  → عرض قسم واحد بالتفصيل
// PUT    /api/categories/:id  → تعديل قسم (أدمن فقط)
// DELETE /api/categories/:id  → حذف قسم (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ status: "success", category });
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

    // نسمح بتعديل جزئي (partial) - المستخدم قد يرسل حقلاً واحداً فقط
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(params.id, parsed.data, { new: true });
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("categories");

    return NextResponse.json({ status: "success", message: "تم تعديل القسم بنجاح", category });
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
    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("categories");

    return NextResponse.json({ status: "success", message: "تم حذف القسم بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
