// src/app/api/auth/register/route.ts
// POST /api/auth/register
// ينشئ حساب مستخدم جديد (عميل). يشفّر كلمة المرور قبل حفظها أبداً لا نحفظها كنص عادي

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { registerSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawBody = await req.json();
    // نظّف المدخلات أولاً (نحذف أي مفاتيح $ أو تحتوي نقطة) قبل حتى التحقق من الصحة
    // طبقة حماية إضافية فوق التحقق بـ Zod ضد محاولات حقن NoSQL
    const body = sanitizeInput(rawBody);

    // 1. التحقق من صحة البيانات المُرسلة
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { name, email, password, phone, address } = parsed.data;

    // 2. التأكد أن البريد الإلكتروني غير مستخدم من قبل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { status: "error", message: "هذا البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 }
      );
    }

    // 3. تشفير كلمة المرور (bcrypt) - رقم 10 هو "قوة" التشفير، القياسي والآمن
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. إنشاء المستخدم في قاعدة البيانات
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer", // كل حساب جديد يُنشأ كعميل عادي، الأدمن يُنشأ يدوياً فقط
    });

    // 5. إنشاء توكن دخول مباشرة حتى لا يحتاج المستخدم لتسجيل الدخول يدوياً بعد التسجيل
    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json(
      {
        status: "success",
        message: "تم إنشاء الحساب بنجاح",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
