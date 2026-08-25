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
