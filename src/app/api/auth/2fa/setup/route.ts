// src/app/api/auth/2fa/setup/route.ts
// POST /api/auth/2fa/setup
// يُستدعى عندما يريد الأدمن تفعيل 2FA لأول مرة
// يولّد "سراً" عشوائياً ورمز QR ليمسحه المستخدم بتطبيق مثل Google Authenticator
// ملاحظة: لا نُفعّل 2FA فعلياً هنا بعد - فقط نُنشئ الأداة، والتفعيل الفعلي يتم في /verify
// (هذا يمنع أن يُقفَل الأدمن خارج حسابه إن أخطأ في مسح الرمز)

import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import QRCode from "qrcode";
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
    const user = await User.findById(admin.userId);
    if (!user) {
      return NextResponse.json({ status: "error", message: "المستخدم غير موجود" }, { status: 404 });
    }

    // نولّد سراً جديداً في كل مرة يُستدعى فيها الإعداد (حتى لو أعاد المحاولة)
    const secret = authenticator.generateSecret();
    user.twoFactorSecret = secret;
    await user.save();

    // نبني رابط otpauth:// القياسي الذي تفهمه كل تطبيقات المصادقة (Google Authenticator، Authy، إلخ)
    const otpAuthUrl = authenticator.keyuri(user.email, "leadybag Admin", secret);
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    return NextResponse.json({
      status: "success",
      message: "امسح رمز QR بتطبيق المصادقة، ثم أدخل الكود الظاهر لتفعيل الحماية",
      qrCodeDataUrl, // صورة base64 يمكن عرضها مباشرة في <img src="..."/>
      secret, // نعرضه أيضاً كنص، لمن يفضّل إدخاله يدوياً بدلاً من مسح QR
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
