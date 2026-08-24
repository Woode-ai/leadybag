# دليل المرحلة 2️⃣ - الجزء الثاني (رفع الصور، الدردشة، الدفع، التحليلات)

⚠️ **قبل البدء**: استبدل ملفات المشروع بالملفات الجديدة، ثم:
```
npm install
```
(لتثبيت مكتبتي `stripe` و `cross-env` الجديدتين)

---

## 🔴 تغيير مهم جداً: طريقة تشغيل المشروع تغيّرت

من الآن، **لا تستخدم** `next dev` مباشرة. المشروع أصبح يعمل عبر ملف `server.js` المخصص (لأنه يحتاج لتشغيل الدردشة المباشرة Socket.io فوق نفس السيرفر). لكن الأمر الذي تكتبه لم يتغيّر:
```
npm run dev
```
فقط الآن سيظهر لك سطر إضافي في الـ Terminal:
```
💬 نظام الدردشة المباشرة (Socket.io) جاهز
```

---

## 📁 الملفات الجديدة

```
server.js                          ← سيرفر مخصص (Next.js + Socket.io معاً)
src/lib/cloudinary.ts              ← إعداد رفع الصور
src/lib/stripe.ts                  ← إعداد الدفع عبر Stripe
src/models/ChatMessage.ts          ← نموذج رسائل الدردشة
src/app/api/
  ├── upload/route.ts              ← POST: رفع صورة (أدمن)
  ├── chat/[roomId]/route.ts       ← GET/POST: سجل الدردشة
  ├── payment/
  │   ├── stripe/route.ts          ← POST: بدء الدفع عبر Stripe
  │   ├── paymob/route.ts          ← POST: بدء الدفع عبر PayMob
  │   └── webhook/route.ts         ← إشعار تلقائي من Stripe عند نجاح الدفع
  └── analytics/route.ts           ← GET: إحصائيات المتجر (أدمن)
```

---

## 🖼️ اختبار 1: رفع صورة (يتطلب حساب Cloudinary مجاني)

1. أنشئ حساباً مجانياً على: https://cloudinary.com/users/register/free
2. من لوحة تحكم Cloudinary، انسخ: `Cloud Name`, `API Key`, `API Secret`
3. ضعهم في `.env.local`:
```
CLOUDINARY_CLOUD_NAME=اسم_حسابك
CLOUDINARY_API_KEY=المفتاح
CLOUDINARY_API_SECRET=السر
```
4. أعد تشغيل السيرفر (`Ctrl+C` ثم `npm run dev`)

في Postman:
- Method: `POST`
- URL: `http://localhost:3000/api/upload`
- Headers: `Authorization: Bearer توكن_الأدمن`
- Body → اختر `form-data` (وليس raw/JSON):
  - Key: `file` (غيّر نوعه من Text إلى **File** من القائمة المنسدلة بجانب الحقل)
  - Value: اختر أي صورة من جهازك
- **النتيجة المتوقعة**: `"status": "success"` + رابط الصورة (`url`) يبدأ بـ `https://res.cloudinary.com/...`

جرّب فتح هذا الرابط في المتصفح - يجب أن تظهر الصورة.

---

## 💬 اختبار 2: الدردشة المباشرة

هذا الاختبار مختلف قليلاً - نحتاج صفحة HTML بسيطة لتجربته لأن Postman لا يدعم Socket.io بسهولة.

أنشئ ملفاً على سطح المكتب باسم `test-chat.html` والصق فيه:
```html
<!DOCTYPE html>
<html>
<body>
  <h2>اختبار الدردشة</h2>
  <input id="msg" placeholder="اكتب رسالة" />
  <button onclick="send()">إرسال</button>
  <div id="messages"></div>

  <script src="https://cdn.socket.io/4.8.0/socket.io.min.js"></script>
  <script>
    const socket = io("http://localhost:3000");
    const roomId = "test-room-1";
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      document.getElementById("messages").innerHTML +=
        `<p>${data.senderRole}: ${data.message}</p>`;
    });

    function send() {
      const message = document.getElementById("msg").value;
      socket.emit("send_message", {
        roomId,
        senderId: "test-user",
        senderRole: "customer",
        message,
      });
      document.getElementById("msg").value = "";
    }
  </script>
</body>
</html>
```

افتحه في **نافذتين متصفح مختلفتين** (أو تبويبين)، اكتب رسالة في واحدة، ويجب أن تظهر فوراً في الاثنتين. هذا يثبت أن البث اللحظي يعمل ✅

---

## 💳 اختبار 3: الدفع عبر Stripe

1. أنشئ حساباً مجانياً على: https://dashboard.stripe.com/register
2. من `Developers → API keys`، انسخ `Secret key` (يبدأ بـ `sk_test_`)
3. ضعه في `.env.local`:
```
STRIPE_SECRET_KEY=sk_test_...
```
4. أعد تشغيل السيرفر

في Postman:
- Method: `POST`
- URL: `http://localhost:3000/api/payment/stripe`
- Headers: توكن العميل (سارة)
- Body:
```json
{ "orderId": "ضع_id_طلب_حقيقي_هنا" }
```
- **النتيجة المتوقعة**: رابط `checkoutUrl` يبدأ بـ `https://checkout.stripe.com/...`
- افتح هذا الرابط في المتصفح، جرّب الدفع ببطاقة Stripe التجريبية: `4242 4242 4242 4242` وأي تاريخ مستقبلي وأي CVC

**ملاحظة**: تفعيل الـ Webhook (لتأكيد الدفع تلقائياً) يحتاج أداة Stripe CLI لاختباره محلياً - يمكننا تجهيزها في مرحلة النشر (المرحلة 7) حين يكون لديك دومين حقيقي.

---

## 📊 اختبار 4: التحليلات

في Postman:
- Method: `GET`
- URL: `http://localhost:3000/api/analytics`
- Headers: توكن الأدمن
- **النتيجة المتوقعة**: بيانات فيها `totalRevenue`, `totalOrders`, `topProducts`, `last7Days`

---

## 🎯 ماذا بعد؟

بمجرد نجاح هذه الاختبارات (لو Cloudinary أو Stripe صعب عليك تجهيزهم الآن، لا مشكلة - أخبرني وسنكمل، ويمكنك تجهيزهم لاحقاً)، ننتقل مباشرة إلى **المرحلة 4: بناء الواجهة الأمامية الكاملة** (الصفحة الرئيسية، صفحة المنتجات، السلة، الدفع) بتصميم عصري ودعم اللغتين والاتجاهين RTL/LTR.
