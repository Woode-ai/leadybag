// src/middleware.ts
// يعمل هذا الملف تلقائياً على كل طلب يصل للسيرفر، قبل الوصول لأي صفحة أو API
// نضيف هنا "هيدرز أمان" قياسية تحمي الموقع من عدة أنواع هجمات شائعة

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // يمنع المتصفح من "تخمين" نوع الملف (يحمي من بعض هجمات XSS القائمة على تنفيذ ملفات كنصوص برمجية)
  response.headers.set("X-Content-Type-Options", "nosniff");

  // يمنع عرض الموقع داخل <iframe> في موقع آخر (يحمي من هجمات Clickjacking)
  response.headers.set("X-Frame-Options", "DENY");

  // حماية إضافية قديمة لكن لا تزال مفيدة في بعض المتصفحات ضد XSS
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // يتحكم في مقدار المعلومات التي يرسلها المتصفح في هيدر Referer عند الانتقال لموقع آخر
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // يفرض HTTPS فقط لمدة سنة كاملة (يُفعَّل عملياً بعد نشر الموقع بشهادة SSL حقيقية في المرحلة 7)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // يمنع الموقع من استخدام صلاحيات حساسة في المتصفح (كاميرا، ميكروفون، موقع جغرافي) دون داعٍ
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

// نطبّق الـ middleware على كل المسارات ما عدا ملفات Next.js الداخلية والصور الثابتة
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
