// src/lib/redis.ts
// نظام تخزين مؤقت (Caching) باستخدام Redis
// الفكرة: بعض البيانات (مثل قائمة المنتجات والأقسام) تُقرأ آلاف المرات لكل مرة تتغيّر فيها
// بدل الاتصال بـ MongoDB في كل طلب، نخزّن النتيجة في Redis لفترة قصيرة (TTL) ونعيدها من هناك مباشرة
// هذا يقلل الضغط على قاعدة البيانات ويجعل الموقع أسرع بشكل ملحوظ
//
// تصميم "الإصدار" (Version) بدلاً من حذف مفاتيح محددة:
// كل بيانات منتجات مثلاً تُخزَّن بمفتاح فيه رقم إصدار: products:v3:...
// عند أي تعديل/إضافة/حذف منتج، نزيد الإصدار إلى v4 - فتصبح كل المفاتيح القديمة "منسية" تلقائياً
// (تنتهي صلاحيتها بمرور الوقت TTL دون أن نحتاج للبحث عنها وحذفها واحدة واحدة)

import Redis from "ioredis";

let redisClient: Redis | null = null;
let redisAvailable = true; // إذا فشل الاتصال، نوقف محاولة استخدام Redis لبقية الطلب بدل تكرار المحاولة والفشل

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) return null; // Redis غير مُعدّ - نعمل بدونه بلا مشاكل (fallback لقاعدة البيانات مباشرة)

  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1, // لا نريد أن ينتظر الطلب طويلاً إذا كان Redis متعطلاً
      lazyConnect: true,
    });
    redisClient.on("error", () => {
      redisAvailable = false; // أي خطأ في الاتصال يوقف استخدام الكاش مؤقتاً، لكن الموقع يستمر بالعمل عبر قاعدة البيانات مباشرة
    });
  }
  return redisClient;
}

// يجلب قيمة من الكاش، أو null إذا لم تكن موجودة أو كان Redis غير متاح
export async function getCached<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || !redisAvailable) return null;

  try {
    const value = await client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    redisAvailable = false;
    return null;
  }
}

// يخزّن قيمة في الكاش لمدة ttlSeconds (بعدها تُحذف تلقائياً من Redis)
export async function setCached(key: string, value: any, ttlSeconds: number): Promise<void> {
  const client = getRedisClient();
  if (!client || !redisAvailable) return;

  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    redisAvailable = false;
  }
}

// يجلب "رقم إصدار" الكاش الحالي لنوع بيانات معيّن (مثلاً "products" أو "categories")
export async function getCacheVersion(namespace: string): Promise<number> {
  const client = getRedisClient();
  if (!client || !redisAvailable) return 0; // 0 يعني "بدون كاش" - سيُبنى المفتاح لكنه لن يُستخدم فعلياً بدون Redis

  try {
    const version = await client.get(`cache_version:${namespace}`);
    return version ? parseInt(version) : 1;
  } catch {
    redisAvailable = false;
    return 0;
  }
}

// يُستدعى بعد أي إضافة/تعديل/حذف - يزيد رقم الإصدار فيصبح كل الكاش القديم لهذا النوع "منتهي الصلاحية" فعلياً
export async function bumpCacheVersion(namespace: string): Promise<void> {
  const client = getRedisClient();
  if (!client) return;

  try {
    await client.incr(`cache_version:${namespace}`);
  } catch {
    redisAvailable = false;
  }
}
