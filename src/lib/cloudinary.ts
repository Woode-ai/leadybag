// src/lib/cloudinary.ts
// إعداد الاتصال بخدمة Cloudinary (تخزين ومعالجة الصور)
// نستخدمها بدلاً من حفظ الصور على السيرفر مباشرة لأنها أسرع وتدعم:
// الضغط التلقائي، التحويل لـ WebP، والـ CDN (توصيل الصور بسرعة لأي مكان في العالم)

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// دالة تتحقق أن الحساب مُعدّ فعلاً قبل محاولة الرفع
// السبب: أكثر سبب شائع لفشل رفع الصور هو عدم تعبئة هذه المتغيرات الثلاثة في .env.local
// وبدون هذا التحقق، تظهر رسالة خطأ غامضة من مكتبة Cloudinary نفسها بدل رسالة واضحة تشرح المشكلة
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export default cloudinary;

