// src/lib/rateLimit.ts
// يحد من عدد المحاولات المسموحة من نفس IP خلال فترة زمنية معينة
// نستخدمه على رابط تسجيل الدخول لمنع أي شخص من تجربة آلاف كلمات المرور تلقائياً (Brute Force Attack)
//
// ملاحظة: هذا تخزين "في الذاكرة" (Memory) - يعمل جيداً للتطوير والمشاريع الصغيرة/المتوسطة
// في الإنتاج الكبير مع عدة سيرفرات، يُفضّل استخدام Redis بدلاً من هذا (نفس الفكرة، لكن مشترك بين كل السيرفرات)

interface AttemptRecord {
  count: number;
  firstAttempt: number;
}

const attempts = new Map<string, AttemptRecord>();

const WINDOW_MS = 15 * 60 * 1000; // نافذة زمنية: 15 دقيقة
const MAX_ATTEMPTS = 5; // 5 محاولات كحد أقصى خلال هذه الفترة

export function checkRateLimit(identifier: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record) {
    attempts.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  // إذا انتهت النافذة الزمنية، نبدأ عدّاً جديداً
  if (now - record.firstAttempt > WINDOW_MS) {
    attempts.set(identifier, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true };
}

// تُستدعى بعد نجاح تسجيل الدخول لإعادة تصفير العدّاد (حتى لا يُعاقَب المستخدم الشرعي لاحقاً)
export function resetRateLimit(identifier: string) {
  attempts.delete(identifier);
}

// يستخرج عنوان IP الحقيقي للطلب (يأخذ بعين الاعتبار وجود proxy/CDN أمام السيرفر)
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
