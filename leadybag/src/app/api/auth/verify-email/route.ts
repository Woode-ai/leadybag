// src/app/api/auth/verify-email/route.ts
// GET /api/auth/verify-email?token=xxx
// يُستدعى عند ضغط المستخدم على رابط التفعيل المُرسَل بالبريد
// يتحقق أن الرمز صحيح ولم تنتهِ صلاحيته، ثم يضع emailVerified = true

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "رابط التفعيل غير صحيح" },
        { status: 400 }
      );
    }

    await connectDB();

    // نبحث عن مستخدم يملك هذا الرمز بالضبط، وأن صلاحيته لم تنتهِ بعد
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "رابط التفعيل غير صحيح أو منتهي الصلاحية - اطلب رابطاً جديداً",
        },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "تم تفعيل بريدك الإلكتروني بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
