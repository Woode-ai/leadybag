# دليل المرحلة 2️⃣ - اختبار واجهات API (الجزء الأول)

⚠️ **قبل البدء**: هذه ملفات جديدة تُضاف فوق مشروع المرحلة 1. فك ضغط هذا الملف واستبدل به مجلد `leadybag` القديم (أو انسخ الملفات الجديدة فوق القديمة)، ثم:
```
npm install
```
(لتثبيت مكتبة `dotenv` الجديدة المطلوبة للسكربت).

---

## 📁 الملفات الجديدة في هذه المرحلة

```
src/
├── lib/
│   ├── jwt.ts           ← إنشاء وفك تشفير توكن الدخول
│   ├── auth.ts          ← معرفة "من المستخدم الحالي" في أي API
│   └── validation.ts    ← قواعد التحقق من صحة كل البيانات (Zod)
│
└── app/api/
    ├── auth/
    │   ├── register/route.ts   ← POST: إنشاء حساب عميل جديد
    │   ├── login/route.ts      ← POST: تسجيل الدخول
    │   └── me/route.ts         ← GET: بيانات المستخدم الحالي
    ├── categories/
    │   ├── route.ts            ← GET (الجميع) / POST (أدمن)
    │   └── [id]/route.ts       ← GET / PUT / DELETE
    ├── products/
    │   ├── route.ts            ← GET مع بحث وفلاتر / POST (أدمن)
    │   └── [id]/
    │       ├── route.ts        ← GET (مع توصيات) / PUT / DELETE
    │       └── reviews/route.ts ← POST: إضافة تقييم
    ├── cart/
    │   ├── route.ts            ← GET / POST / PUT / DELETE
    │   └── coupon/route.ts     ← POST / DELETE: تطبيق أو إلغاء كوبون
    ├── coupons/
    │   ├── route.ts            ← GET / POST (أدمن)
    │   └── validate/route.ts   ← POST: التحقق من صلاحية كوبون
    └── orders/
        ├── route.ts            ← GET / POST: إنشاء طلب من السلة
        └── [id]/route.ts       ← GET / PUT (تحديث الحالة - أدمن)
```

كل هذه الملفات هي "أبواب" (Endpoints) يتحدث معها المتصفح لاحقاً في المرحلة 4. الآن سنختبرها مباشرة بدون واجهة رسومية، باستخدام أداة اسمها **Postman**.

---

## 🧰 الخطوة 1: تثبيت Postman

1. حمّل التطبيق من: https://www.postman.com/downloads/
2. ثبّته وافتحه (يمكنك تخطي إنشاء حساب والدخول كـ "Skip")

---

## 🔑 الخطوة 2: تحديث ملف .env.local

افتح ملف `.env.local` الذي أنشأته في المرحلة 1، وتأكد من وضع قيمة حقيقية لـ:
```
JWT_SECRET=اكتب-هنا-نص-عشوائي-طويل-جداً-لا-يخمنه-احد-123456789
```
(أي نص طويل عشوائي يكفي - كلما كان أطول وأعقد كان أفضل)

---

## 👤 الخطوة 3: إنشاء أول حساب أدمن

في الـ Terminal، داخل مجلد المشروع، نفّذ:
```
npm run create-admin
```

**يجب أن ترى**:
```
✅ تم الاتصال بقاعدة البيانات
🎉 تم إنشاء حساب الأدمن بنجاح!
   البريد الإلكتروني: admin@leadybag.com
   كلمة المرور: password123
```

---

## ▶️ الخطوة 4: تشغيل المشروع

```
npm run dev
```
اتركه يعمل في الـ Terminal، وافتح Postman في نافذة منفصلة.

---

## ✅ اختبارات Postman (نفّذها بالترتيب بالضبط)

### اختبار 1: تسجيل الدخول كأدمن
- Method: `POST`
- URL: `http://localhost:3000/api/auth/login`
- Body → اختر `raw` و `JSON`:
```json
{
  "email": "admin@leadybag.com",
  "password": "password123"
}
```
- **النتيجة المتوقعة**: رد فيه `"status": "success"` و `"token": "eyJ....."`
- **مهم جداً**: انسخ قيمة `token` كاملة، سنحتاجها في كل الاختبارات التالية.

---

### اختبار 2: إنشاء حساب عميل جديد
- Method: `POST`
- URL: `http://localhost:3000/api/auth/register`
- Body:
```json
{
  "name": "سارة أحمد",
  "email": "sara@example.com",
  "password": "123456"
}
```
- **النتيجة المتوقعة**: `"status": "success"` + توكن جديد خاص بهذا العميل.

---

### اختبار 3: إنشاء قسم جديد (يتطلب توكن الأدمن)
- Method: `POST`
- URL: `http://localhost:3000/api/categories`
- Headers → أضف:
  - Key: `Authorization`
  - Value: `Bearer` ثم مسافة ثم توكن الأدمن الذي نسخته في اختبار 1
    (مثال: `Bearer eyJhbGciOiJIUzI1NiIs...`)
- Body:
```json
{
  "name": { "ar": "حقائب", "en": "Bags" },
  "slug": "bags"
}
```
- **النتيجة المتوقعة**: `"status": "success"` + بيانات القسم. **انسخ الـ `_id`** الخاص به من الرد، سنحتاجه.

---

### اختبار 4: محاولة إنشاء قسم بدون توكن (يجب أن يُرفض)
- نفس اختبار 3 لكن بدون هيدر `Authorization`
- **النتيجة المتوقعة**: خطأ 403 برسالة "غير مصرح لك - هذا الإجراء للأدمن فقط"
- هذا يثبت أن الحماية تعمل بشكل صحيح ✅

---

### اختبار 5: إضافة منتج جديد (يتطلب توكن الأدمن + الـ categoryId من اختبار 3)
- Method: `POST`
- URL: `http://localhost:3000/api/products`
- Headers: نفس هيدر الأدمن
- Body (استبدل `categoryId` بالـ `_id` الحقيقي):
```json
{
  "name": { "ar": "حقيبة يد جلدية", "en": "Leather Handbag" },
  "description": { "ar": "حقيبة أنيقة مناسبة للمناسبات", "en": "Elegant bag for occasions" },
  "price": 250,
  "categoryId": "ضع_الـ_id_هنا",
  "stock": 20,
  "colors": ["أسود", "بني"],
  "sizes": []
}
```
- **النتيجة المتوقعة**: `"status": "success"` + بيانات المنتج. **انسخ الـ `_id`** الخاص بالمنتج.

---

### اختبار 6: عرض كل المنتجات (بدون توكن - متاح للجميع)
- Method: `GET`
- URL: `http://localhost:3000/api/products`
- **النتيجة المتوقعة**: قائمة فيها المنتج الذي أضفته، مع `pagination`.

جرّب أيضاً البحث والفلاتر:
```
http://localhost:3000/api/products?search=حقيبة
http://localhost:3000/api/products?minPrice=100&maxPrice=300
```

---

### اختبار 7: تسجيل دخول العميل ثم إضافة منتج للسلة
1. سجّل دخول بحساب `sara@example.com` (مثل اختبار 1) وانسخ توكنها
2. Method: `POST`
- URL: `http://localhost:3000/api/cart`
- Headers: `Authorization: Bearer توكن_سارة`
- Body:
```json
{
  "productId": "ضع_id_المنتج_هنا",
  "quantity": 2
}
```
- **النتيجة المتوقعة**: `"status": "success"` مع السلة فيها المنتج بكمية 2.

---

### اختبار 8: إنشاء كوبون خصم (أدمن)
- Method: `POST`
- URL: `http://localhost:3000/api/coupons`
- Headers: توكن الأدمن
- Body:
```json
{
  "code": "WELCOME10",
  "discountType": "percentage",
  "value": 10,
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "usageLimit": 100
}
```

---

### اختبار 9: تطبيق الكوبون على سلة سارة
- Method: `POST`
- URL: `http://localhost:3000/api/cart/coupon`
- Headers: توكن سارة
- Body:
```json
{ "code": "WELCOME10" }
```
- **النتيجة المتوقعة**: `"status": "success"` والسلة فيها `couponCode: "WELCOME10"`

---

### اختبار 10: إتمام الطلب (Checkout)
- Method: `POST`
- URL: `http://localhost:3000/api/orders`
- Headers: توكن سارة
- Body:
```json
{
  "shippingAddress": "الخرطوم، شارع النيل، منزل 12",
  "paymentMethod": "cod"
}
```
- **النتيجة المتوقعة**: طلب جديد فيه الخصم مطبّق، ورقم تتبع (`trackingNumber`)، والسلة تصبح فارغة بعدها.

---

### اختبار 11: الأدمن يحدّث حالة الطلب
- Method: `PUT`
- URL: `http://localhost:3000/api/orders/id_الطلب_من_الاختبار_السابق`
- Headers: توكن الأدمن
- Body:
```json
{ "status": "shipped" }
```
- **النتيجة المتوقعة**: حالة الطلب أصبحت "shipped"

---

## 🎯 إذا نجحت كل الاختبارات أعلاه
أخبرني، وسننتقل للجزء الثاني من المرحلة 2: رفع الصور (Cloudinary)، الدردشة المباشرة (Socket.io)، بوابات الدفع، والتحليلات - ثم بعدها المرحلة 4 (الواجهة الأمامية الكاملة بالتصميم).

## ❌ إذا واجهت أي خطأ
انسخ لي:
1. رقم الخطأ (Status Code) الذي ظهر في Postman
2. نص الرسالة كاملاً
3. أي اختبار كنت تنفذ بالضبط
