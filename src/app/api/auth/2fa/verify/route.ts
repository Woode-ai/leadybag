// src/app/api/auth/2fa/verify/route.ts
// POST /api/auth/2fa/verify
// بعد أن يمسح الأدمن رمز QR من /setup، يُدخل الكود الظاهر في تطبيقه هنا للتأكيد
// إذا كان صحيحاً، نُفعّل twoFactorEnabled = true فعلياً (من الآن فصاعداً، سيُطلب الكود عند كل دخول)

import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك" },
        { status: 403 }
      );
    }

    await connectDB();
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { status: "error", message: "يجب إدخال الكود" },
        { status: 400 }
      );
    }

    const user = await User.findById(admin.userId).select("+twoFactorSecret");
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { status: "error", message: "يجب إعداد 2FA أولاً عبر /setup" },
        { status: 400 }
      );
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "الكود غير صحيح - تأكد من الوقت الصحيح على جهازك" },
        { status: 401 }
      );
    }

    user.twoFactorEnabled = true;
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "تم تفعيل المصادقة الثنائية بنجاح! سيُطلب منك الكود في كل مرة تسجّل فيها الدخول",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
