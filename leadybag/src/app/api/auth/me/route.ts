// src/app/api/auth/me/route.ts
// GET /api/auth/me
// يعيد بيانات المستخدم صاحب التوكن المُرسل في الهيدر
// يُستخدم في الواجهة الأمامية لمعرفة "من المستخدم الحالي؟" بعد إعادة تحميل الصفحة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    await connectDB();
    // نستثني حقل password من النتيجة حتى لو كان مشفراً - لا داعي لإرساله للواجهة الأمامية أبداً
    const user = await User.findById(currentUser.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", user });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
