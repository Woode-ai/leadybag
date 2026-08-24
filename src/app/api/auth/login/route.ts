// src/app/api/auth/login/route.ts
// POST /api/auth/login
// الآن يشمل: حماية من محاولات التخمين المتكرر، قفل الحساب بعد 5 محاولات فاشلة،
// ودعم المصادقة الثنائية (2FA) إن كانت مُفعّلة على الحساب (عادة حسابات الأدمن)

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";

const loginWith2FASchema = loginSchema.extend({
  twoFactorCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const parsed = loginWith2FASchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, password, twoFactorCode } = parsed.data;

    // 1. الحماية من التخمين المتكرر - نحسبها حسب (IP + البريد) معاً
    const clientIp = getClientIp(req);
    const rateLimitKey = `login:${clientIp}:${email}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: `محاولات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(
            (rateLimit.retryAfterSeconds || 0) / 60
          )} دقيقة`,
        },
        { status: 429 }
      );
    }

    // نطلب صراحة twoFactorSecret لأن select: false في النموذج يخفيه افتراضياً
    const user = await User.findOne({ email }).select("+twoFactorSecret");

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 2. التحقق من قفل الحساب (بسبب محاولات فاشلة سابقة كثيرة)
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { status: "error", message: `الحساب مقفل مؤقتاً. حاول بعد ${minutesLeft} دقيقة` },
        { status: 423 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();

      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 3. إذا كان الحساب مُفعَّلاً عليه 2FA (المصادقة الثنائية)
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { status: "2fa_required", message: "يجب إدخال كود المصادقة الثنائية" },
          { status: 200 }
        );
      }

      const isCodeValid = authenticator.verify({
        token: twoFactorCode,
        secret: user.twoFactorSecret as string,
      });

      if (!isCodeValid) {
        return NextResponse.json(
          { status: "error", message: "كود المصادقة الثنائية غير صحيح" },
          { status: 401 }
        );
      }
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    resetRateLimit(rateLimitKey);

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
