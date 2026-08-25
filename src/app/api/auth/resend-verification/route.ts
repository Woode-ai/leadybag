// src/app/api/auth/resend-verification/route.ts
// POST /api/auth/resend-verification
// يُستخدم إذا لم يستلم المستخدم البريد الأول، أو انتهت صلاحية الرابط القديم
// يتطلب تسجيل الدخول (نعرف "من" نُرسل له الرمز الجديد من التوكن نفسه)

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    // نمنع إعادة الإرسال أكثر من عدة مرات متتالية - لحماية حصة SMTP من الاستنفاد ومنع إزعاج المستخدم الآخر
    const rateLimit = checkRateLimit(`resend-verification:${currentUser.userId}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: `محاولات كثيرة. حاول مرة أخرى بعد ${Math.ceil((rateLimit.retryAfterSeconds || 0) / 60)} دقيقة`,
        },
        { status: 429 }
      );
    }

    await connectDB();
    const user = await User.findById(currentUser.userId);

    if (!user) {
      return NextResponse.json({ status: "error", message: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        status: "success",
        message: "بريدك الإلكتروني مُفعَّل بالفعل",
        alreadyVerified: true,
      });
    }

    // نولّد رمزاً جديداً في كل مرة (نُبطل أي رابط قديم أُرسل من قبل تلقائياً)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, emailVerificationToken);

    return NextResponse.json({
      status: "success",
      message: "تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
