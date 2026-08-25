// src/app/api/auth/login/route.ts
// POST /api/auth/login
// يتحقق من البريد وكلمة المرور، ويعيد توكن دخول إذا كانت صحيحة

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, password } = parsed.data;

    // نبحث عن المستخدم، ونطلب صراحة حقل "password" لأنه قد يكون مخفياً افتراضياً
    const user = await User.findOne({ email });

    // ملاحظة أمنية: نتعمد إعطاء نفس رسالة الخطأ سواء كان البريد غير موجود
    // أو كلمة المرور خاطئة - حتى لا نساعد أي شخص على تخمين البريد الإلكتروني المسجل
    if (!user) {
      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json({
      status: "success",
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
