// src/app/api/upload/route.ts
// POST /api/upload
// يستقبل صورة من لوحة تحكم الأدمن، يرفعها إلى Cloudinary، ويعيد رابطها النهائي
// هذا الرابط هو ما نخزّنه في حقل images داخل المنتج (Product.images)
//
// يجب إرسال الصورة كـ FormData (وليس JSON) مع حقل اسمه "file"

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - رفع الصور للأدمن فقط" },
        { status: 403 }
      );
    }

    // السبب الأشهر لفشل رفع الصور هو نسيان تعبئة بيانات Cloudinary في .env.local
    // نتحقق من هذا صراحة أولاً ونعطي رسالة واضحة، بدل رسالة Cloudinary التقنية المبهمة
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "رفع الصور غير مُفعَّل بعد - أضف CLOUDINARY_CLOUD_NAME و CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET في ملف .env.local (احصل عليها من لوحة تحكم Cloudinary)، ثم أعد تشغيل السيرفر",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { status: "error", message: "لم يتم إرسال أي ملف" },
        { status: 400 }
      );
    }

    // نتأكد أن الملف صورة فعلاً (وليس ملفاً تنفيذياً أو شيئاً خطيراً)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { status: "error", message: "الملف المرفوع يجب أن يكون صورة" },
        { status: 400 }
      );
    }

    // حد أقصى 5 ميجابايت للصورة الواحدة - يمنع رفع ملفات ضخمة عن طريق الخطأ تُبطئ الموقع
    const MAX_SIZE_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { status: "error", message: "حجم الصورة كبير جداً - الحد الأقصى 5 ميجابايت" },
        { status: 400 }
      );
    }

    // نحوّل الملف إلى buffer ثم إلى base64 لنرفعه إلى Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: "leadybag/products", // كل الصور تُنظَّم داخل هذا المجلد في حساب Cloudinary
      transformation: [
        { quality: "auto" }, // ضغط تلقائي ذكي للصورة
        { fetch_format: "auto" }, // يحوّلها تلقائياً لـ WebP في المتصفحات التي تدعمها
      ],
    });

    return NextResponse.json({
      status: "success",
      message: "تم رفع الصورة بنجاح",
      url: uploadResult.secure_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "فشل رفع الصورة", error: error.message },
      { status: 500 }
    );
  }
}
