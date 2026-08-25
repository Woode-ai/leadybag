// src/lib/sanitize.ts
// حماية من هجمات NoSQL Injection
// الفكرة: MongoDB يستخدم مفاتيح خاصة تبدأ بـ "$" مثل $gt, $ne, $where للتحكم بالاستعلامات
// إذا سمحنا للمستخدم بإرسال جسم JSON فيه مفتاح مثل { "password": { "$ne": "" } }
// فقد يستطيع أحدهم تجاوز التحقق من كلمة المرور بالكامل!
// هذه الدالة تفحص أي بيانات قادمة من المستخدم وتحذف أي مفتاح خطير قبل استخدامه في أي استعلام

export function sanitizeInput(input: any): any {
  if (input === null || input === undefined) return input;

  // إذا كانت مصفوفة، ننظّف كل عنصر بداخلها
  if (Array.isArray(input)) {
    return input.map((item) => sanitizeInput(item));
  }

  // إذا كان كائناً (object)، نفحص كل مفتاح فيه
  if (typeof input === "object") {
    const cleaned: Record<string, any> = {};
    for (const key in input) {
      // نرفض أي مفتاح يبدأ بـ "$" (عوامل MongoDB الخاصة) أو يحتوي "." (قد تُستخدم للوصول لحقول متداخلة)
      if (key.startsWith("$") || key.includes(".")) {
        continue; // نتجاهل هذا المفتاح تماماً - لا نضيفه للنتيجة النهائية
      }
      cleaned[key] = sanitizeInput(input[key]);
    }
    return cleaned;
  }

  // النصوص والأرقام والقيم المنطقية تمر كما هي
  return input;
}

// يُهرِّب الأحرف الخاصة بصياغة Regex قبل استخدام نص بحث المستخدم داخل new RegExp() أو $regex
// بدون هذا، يمكن لأي شخص إرسال نص بحث "خبيث" مصمم عمداً ليجعل محرك الأحرف يستغرق وقتاً طويلاً جداً
// لمطابقته (هجوم يُعرف باسم ReDoS: Regular Expression Denial of Service) فيتجمد السيرفر بالكامل
export function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
