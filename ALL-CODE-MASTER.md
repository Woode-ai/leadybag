# leadybag - الأكواد الكاملة الموحدة (من المرحلة 4 وحتى آخر تعديل)

هذا الملف يحتوي **كل كود المشروع** منسوخاً حرفياً 100% من الملفات الفعلية على القرص - بدون أي إعادة كتابة أو تلخيص - يشمل إصلاح خطأ Next.js 15 الحرج (params أصبحت Promise في كل مسارات API الديناميكية [id]/[roomId]) وإزالة baseUrl المتروكة من tsconfig.json.

## كيف تستخدم هذا الملف
هذا **ليس ملفاً تُشغّله مباشرة** - هو مرجع نصي شامل لمراجعة كل الأكواد أو نسخ أي جزء منها يدوياً إن احتجت. المشروع الفعلي القابل للتشغيل مباشرة تجده في ملف `leadybag-final.zip`.

## الترتيب
الملفات مرتبة حسب البنية المنطقية للمشروع: الإعدادات العامة أولاً، ثم `src/lib`، ثم `src/models`، ثم `src/context` و`src/components`، ثم كل صفحات `src/app` (الواجهة الأمامية فالأدمن)، ثم كل واجهات `src/app/api`.

---

# leadybag - كل الأكواد الكاملة (من المرحلة 4 حتى آخر تعديل)

عدد الملفات: 90

---


## 📄 `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // نسمح بجلب الصور من Cloudinary (سنستخدمه لرفع صور المنتجات لاحقاً)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;

```


## 📄 `package.json`

```json
{
  "name": "leadybag",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "cross-env NODE_ENV=production node server.js",
    "lint": "next lint",
    "create-admin": "node scripts/create-admin.js"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "mongoose": "8.7.0",
    "next-auth": "4.24.8",
    "bcryptjs": "2.4.3",
    "jsonwebtoken": "9.0.2",
    "zod": "3.23.8",
    "ioredis": "5.4.1",
    "socket.io": "4.8.0",
    "socket.io-client": "4.8.0",
    "cloudinary": "2.5.1",
    "nodemailer": "6.9.15",
    "resend": "4.0.0",
    "clsx": "2.1.1",
    "tailwind-merge": "2.5.4",
    "lucide-react": "0.454.0",
    "class-variance-authority": "0.7.0",
    "dotenv": "16.4.5",
    "stripe": "17.2.1",
    "otplib": "12.0.1",
    "qrcode": "1.5.4"
  },
  "devDependencies": {
    "typescript": "5.6.3",
    "@types/node": "22.7.9",
    "@types/react": "19.0.0",
    "@types/react-dom": "19.0.0",
    "@types/bcryptjs": "2.4.6",
    "@types/jsonwebtoken": "9.0.7",
    "@types/nodemailer": "6.4.16",
    "@types/qrcode": "1.5.5",
    "tailwindcss": "3.4.14",
    "postcss": "8.4.47",
    "autoprefixer": "10.4.20",
    "eslint": "8.57.1",
    "eslint-config-next": "15.0.3",
    "cross-env": "7.0.3"
  }
}

```


## 📄 `postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```


## 📄 `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ألوان أساسية للمتجر - يمكن تغييرها لاحقاً حسب هوية leadybag
        primary: "#B76E79", // وردي فاتح (روز غولد) يناسب متجر نسائي
        secondary: "#2D2D2D",
      },
    },
  },
  plugins: [],
};

export default config;

```


## 📄 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```


## 📄 `.env.local.example`

```
# =============================================
# ملف متغيرات البيئة - leadybag
# قم بنسخ هذا الملف باسم .env.local وضع فيه قيمك الحقيقية
# لا تقم أبداً برفع ملف .env.local الحقيقي على GitHub
# =============================================

# رابط الاتصال بقاعدة بيانات MongoDB
# إذا كنت تستخدم MongoDB محلياً على جهازك:
MONGODB_URI=mongodb://127.0.0.1:27017/leadybag

# إذا كنت تستخدم MongoDB Atlas (سحابي - موصى به):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadybag

# مفتاح تشفير الجلسات (JWT) - يجب أن يكون نص عشوائي طويل وسري
JWT_SECRET=غيّر_هذا_النص_إلى_نص_عشوائي_طويل_وسري_جداً

# إعدادات NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=غيّر_هذا_أيضاً_إلى_نص_عشوائي_مختلف

# إعدادات Redis (للتخزين المؤقت - سنستخدمه في مرحلة لاحقة)
REDIS_URL=redis://127.0.0.1:6379

# إعدادات Cloudinary (لرفع الصور - سنحتاجها في لوحة تحكم الأدمن)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# إعدادات البريد الإلكتروني (لإرسال إشعارات الطلبات)
RESEND_API_KEY=

# بيانات حساب الأدمن الافتراضي (تُستخدم فقط لإنشاء أول حساب أدمن)
ADMIN_EMAIL=admin@leadybag.com
ADMIN_PASSWORD=password123

# إعدادات Stripe (دفع إلكتروني - بطاقات عالمية)
# احصل عليها من: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# إعدادات PayMob (دفع إلكتروني - بوابة عربية)
# احصل عليها من: https://accept.paymob.com
PAYMOB_API_KEY=
PAYMOB_INTEGRATION_ID=
PAYMOB_IFRAME_ID=


# دومين الموقع الحقيقي بعد النشر (يُستخدم لتقييد الدردشة المباشرة CORS)
# اتركه فارغاً في التطوير المحلي - أضفه فقط بعد النشر، مثال: https://leadybag.com
ALLOWED_ORIGIN=

# إعدادات SMTP لإرسال البريد الإلكتروني (تفعيل الحساب + تأكيد الطلبات)
# للتجربة السريعة والمجانية: أنشئ حساباً على https://www.brevo.com (يعطيك SMTP مجاني)
# أو استخدم Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, وأنشئ "App Password" من إعدادات حسابك
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="leadybag <no-reply@leadybag.com>"

```


## 📄 `.gitignore`

```
# الاعتماديات
node_modules/

# ملفات البيئة (تحتوي أسراراً - لا تُرفع أبداً على GitHub)
.env
.env.local
.env*.local

# مخرجات البناء
.next/
out/
build/

# ملفات النظام والمحرر
.DS_Store
*.log
npm-debug.log*

# TypeScript
*.tsbuildinfo
next-env.d.ts

```


## 📄 `server.js`

```javascript
// server.js
// هذا الملف يستبدل طريقة تشغيل Next.js الافتراضية بسيرفر مخصص
// السبب: Socket.io (الدردشة المباشرة) يحتاج اتصالاً "مستمراً" (WebSocket)
// وهذا لا يعمل مع طريقة تشغيل Next.js العادية (npm run dev العادي لا يكفي للدردشة)
// لذلك من الآن فصاعداً، تشغيل المشروع يكون بالأمر: node server.js

const { createServer } = require("http");
const { Server } = require("socket.io");
const next = require("next");
require("dotenv").config({ path: ".env.local" });

const dev = process.env.NODE_ENV !== "production";

// في التطوير المحلي: نستخدم localhost والمنفذ 3000 دائماً
// في الإنتاج (بعد النشر على Railway/Render/أي منصة): هذه المنصات تحدد المنفذ تلقائياً
// عبر متغير بيئة PORT، ويجب الربط بـ 0.0.0.0 (وليس localhost) ليكون السيرفر قابلاً للوصول من الخارج
const hostname = dev ? "localhost" : "0.0.0.0";
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// دومين الموقع الحقيقي بعد النشر - يُستخدم لتقييد الدردشة المباشرة على دومينك فقط بدلاً من "*"
// في التطوير المحلي، نتركه "*" لأنه أسهل للاختبار (لا يوجد دومين حقيقي بعد)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  // نُنشئ سيرفر Socket.io فوق نفس السيرفر (نفس المنفذ)
  const io = new Server(httpServer, {
    cors: { origin: allowedOrigin },
  });

  io.on("connection", (socket) => {
    console.log("🟢 مستخدم جديد اتصل بالدردشة:", socket.id);

    // العميل أو الأدمن ينضم إلى "غرفة" محادثة معينة (roomId = عادة userId الخاص بالعميل)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📥 انضم ${socket.id} إلى الغرفة: ${roomId}`);
    });

    // عند إرسال رسالة جديدة، نبثّها لكل من في نفس الغرفة (العميل + الأدمن)
    socket.on("send_message", (data) => {
      // data = { roomId, senderId, senderRole, message }
      io.to(data.roomId).emit("receive_message", {
        ...data,
        createdAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 انقطع اتصال المستخدم:", socket.id);
    });
  });

  httpServer.listen(port, hostname, () => {
    console.log(`✅ السيرفر يعمل على http://${hostname}:${port}`);
    console.log("💬 نظام الدردشة المباشرة (Socket.io) جاهز");
  });
});

```


## 📄 `scripts/create-admin.js`

```javascript
// scripts/create-admin.js
// سكربت يُشغَّل مرة واحدة يدوياً لإنشاء حساب الأدمن الأول
// يُستخدم بالأمر: npm run create-admin
// يقرأ ADMIN_EMAIL و ADMIN_PASSWORD من ملف .env.local

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

async function createAdmin() {
  const MONGODB_URI = process.env.MONGODB_URI;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@leadybag.com";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password123";

  if (!MONGODB_URI) {
    console.error("❌ لم يتم العثور على MONGODB_URI في .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("✅ تم الاتصال بقاعدة البيانات");

  // نعرّف نموذج User بشكل مبسط هنا مباشرة (بدون استيراد TypeScript) لتجنب تعقيد الإعداد
  const UserSchema = new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      password: String,
      role: String,
      wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
  );
  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`⚠️ يوجد حساب بالفعل بهذا البريد: ${ADMIN_EMAIL}`);
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("✅ تم ترقية هذا الحساب إلى أدمن");
    } else {
      console.log("ℹ️ هذا الحساب أدمن بالفعل");
    }
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    name: "مدير المتجر",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    wishlist: [],
  });

  console.log("🎉 تم إنشاء حساب الأدمن بنجاح!");
  console.log(`   البريد الإلكتروني: ${ADMIN_EMAIL}`);
  console.log(`   كلمة المرور: ${ADMIN_PASSWORD}`);
  console.log("   يمكنك الآن تسجيل الدخول عبر /api/auth/login بهذه البيانات");

  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("❌ حدث خطأ:", err.message);
  process.exit(1);
});

```


## 📄 `src/middleware.ts`

```typescript
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

```


## 📄 `src/lib/db.ts`

```typescript
// src/lib/db.ts
// هذا الملف مسؤول عن فتح اتصال واحد بقاعدة بيانات MongoDB والحفاظ عليه
// نستدعي دالة connectDB() من أي مكان نحتاج فيه للتعامل مع قاعدة البيانات

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "❌ لم يتم العثور على MONGODB_URI في ملف .env.local — تأكد من إنشائه وتعبئته"
  );
}

// نستخدم متغير عام (global) لمنع فتح اتصالات متعددة أثناء التطوير
// لأن Next.js يعيد تحميل الكود كثيراً في وضع التطوير (dev mode)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    // يوجد اتصال جاهز مسبقاً، نستخدمه بدلاً من فتح اتصال جديد
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      console.log("✅ تم الاتصال بقاعدة البيانات بنجاح (Connected)");
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

```


## 📄 `src/lib/jwt.ts`

```typescript
// src/lib/jwt.ts
// أدوات لإنشاء وفك تشفير "توكن" الدخول (JWT)
// التوكن هو نص مشفر نعطيه للمستخدم بعد تسجيل الدخول، ويستخدمه لإثبات هويته في كل طلب لاحق

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface TokenPayload {
  userId: string;
  role: "customer" | "admin";
}

// إنشاء توكن جديد بعد تسجيل الدخول بنجاح - صالح لمدة 7 أيام
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

// فك تشفير التوكن والتأكد أنه صحيح وغير منتهي الصلاحية
// يعيد null إذا كان التوكن غير صالح (مزوّر أو منتهي)
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

```


## 📄 `src/lib/auth.ts`

```typescript
// src/lib/auth.ts
// دالة مساعدة تُستخدم داخل أي API لمعرفة "من هو المستخدم المسجّل دخوله" بناءً على التوكن
// المتصفح يرسل التوكن في الهيدر: Authorization: Bearer <التوكن>

import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "@/lib/jwt";

// تعيد بيانات المستخدم (userId, role) إذا كان التوكن صحيحاً، أو null إذا لم يكن مسجلاً دخوله
export function getCurrentUser(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization"); // مثال: "Bearer eyJhbGciOi..."

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return verifyToken(token);
}

// دالة مساعدة للتأكد أن المستخدم هو "أدمن" فقط - نستخدمها في APIs الخاصة بلوحة التحكم
export function requireAdmin(req: NextRequest): TokenPayload | null {
  const user = getCurrentUser(req);
  if (!user || user.role !== "admin") {
    return null;
  }
  return user;
}

```


## 📄 `src/lib/validation.ts`

```typescript
// src/lib/validation.ts
// هذا الملف يحتوي "قواعد" التحقق من صحة البيانات القادمة من المستخدم
// قبل حفظ أي بيانات في قاعدة البيانات، نتأكد أنها مطابقة لهذه القواعد
// هذا يحمينا من بيانات خاطئة أو محاولات اختراق (Zod يرفض أي شيء لا يطابق الشكل المطلوب)

import { z } from "zod";

// ==== المصادقة ====
export const registerSchema = z.object({
  name: z.string().min(2, "الاسم يجب أن يكون حرفين على الأقل"),
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

// ==== الأقسام ====
export const categorySchema = z.object({
  name: z.object({
    ar: z.string().min(1, "الاسم بالعربية مطلوب"),
    en: z.string().min(1, "الاسم بالإنجليزية مطلوب"),
  }),
  slug: z.string().min(1, "الـ slug مطلوب"),
  image: z.string().optional(),
  parentId: z.string().nullable().optional(),
});

// ==== المنتجات ====
export const productSchema = z.object({
  name: z.object({
    ar: z.string().min(1),
    en: z.string().min(1),
  }),
  description: z.object({
    ar: z.string().min(1),
    en: z.string().min(1),
  }),
  price: z.number().positive("السعر يجب أن يكون رقماً موجباً"),
  discountPrice: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, "القسم مطلوب"),
  stock: z.number().int().min(0),
  sizes: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
});

export const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// ==== السلة ====
export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
});

// ==== الطلبات ====
export const createOrderSchema = z.object({
  shippingAddress: z.string().min(5, "عنوان الشحن مطلوب"),
  paymentMethod: z.enum(["stripe", "paymob", "cod"]),
});

// ==== الكوبونات ====
export const couponSchema = z.object({
  code: z.string().min(3),
  discountType: z.enum(["percentage", "fixed"]),
  value: z.number().positive(),
  startDate: z.string(), // نستقبلها كنص ثم نحولها لـ Date
  endDate: z.string(),
  usageLimit: z.number().int().positive().optional(),
});

```


## 📄 `src/lib/sanitize.ts`

```typescript
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

```


## 📄 `src/lib/rateLimit.ts`

```typescript
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

```


## 📄 `src/lib/redis.ts`

```typescript
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

```


## 📄 `src/lib/cloudinary.ts`

```typescript
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


```


## 📄 `src/lib/stripe.ts`

```typescript
// src/lib/stripe.ts
// إعداد الاتصال بخدمة الدفع Stripe

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-09-30.acacia",
});

```


## 📄 `src/lib/mailer.ts`

```typescript
// src/lib/mailer.ts
// أداة موحدة لإرسال البريد الإلكتروني (تفعيل الحساب، تأكيد الطلبات، إلخ)
// نستخدم Nodemailer مع أي خدمة SMTP (Gmail، أو خدمات مخصصة مثل Brevo/SendGrid المجانية)
//
// ملاحظة مهمة: إذا لم تُعبَّأ إعدادات SMTP في .env.local، الموقع لا يتعطل أبداً -
// فقط لا يُرسَل البريد فعلياً، ويُطبع تنبيه في الـ Terminal بدلاً من رمي خطأ يوقف التسجيل

import nodemailer from "nodemailer";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null; // SMTP غير مُعدّ بعد - نتعامل مع هذا بلطف في sendEmail أدناه
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465, // المنفذ 465 يستخدم SSL مباشرة، غيره يستخدم STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn(
      `⚠️ لم يُرسَل بريد إلى ${to} لأن إعدادات SMTP غير مُعبّأة في .env.local (هذا لا يوقف عمل الموقع)`
    );
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"leadybag" <no-reply@leadybag.com>`,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("❌ فشل إرسال البريد الإلكتروني:", error);
    return false;
  }
}

// بريد تفعيل الحساب - يُرسَل فور التسجيل
export async function sendVerificationEmail(to: string, name: string, token: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  await sendEmail(
    to,
    "فعّل حسابك في leadybag",
    `
      <div dir="rtl" style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #B76E79;">مرحباً ${name} 👋</h2>
        <p>شكراً لتسجيلك في متجر leadybag. اضغط الزر أدناه لتفعيل بريدك الإلكتروني:</p>
        <a href="${verifyUrl}" style="display:inline-block; background:#B76E79; color:white; padding:12px 24px; border-radius:999px; text-decoration:none; margin:16px 0;">
          تفعيل الحساب
        </a>
        <p style="color:#888; font-size:13px;">هذا الرابط صالح لمدة 24 ساعة. إذا لم تُنشئ هذا الحساب، تجاهل هذه الرسالة.</p>
      </div>
    `
  );
}

// بريد تأكيد الطلب - يُرسَل فور إتمام عملية الشراء
export async function sendOrderConfirmationEmail(
  to: string,
  name: string,
  trackingNumber: string,
  total: number
) {
  await sendEmail(
    to,
    `تم استلام طلبك في leadybag - ${trackingNumber}`,
    `
      <div dir="rtl" style="font-family: sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #B76E79;">شكراً لطلبك يا ${name} 🎉</h2>
        <p>تم استلام طلبك بنجاح وسنبدأ بتجهيزه فوراً.</p>
        <p><strong>رقم التتبع:</strong> ${trackingNumber}</p>
        <p><strong>الإجمالي:</strong> ${total}</p>
      </div>
    `
  );
}

```


## 📄 `src/lib/apiClient.ts`

```typescript
// src/lib/apiClient.ts
// دالة موحدة لإرسال أي طلب لواجهات API الخلفية من الواجهة الأمامية
// تضيف تلقائياً توكن تسجيل الدخول (إن وُجد) في كل طلب

export async function apiClient(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    // نرمي رسالة الخطأ القادمة من السيرفر حتى تظهر للمستخدم بوضوح
    throw new Error(data.message || "حدث خطأ غير متوقع");
  }

  return data;
}

```


## 📄 `src/lib/i18n.ts`

```typescript
// src/lib/i18n.ts
// كل نصوص الواجهة موجودة هنا بلغتين - عند تبديل اللغة نستخدم t.ar أو t.en
// هذا أسهل بكثير من نسخ كل صفحة مرتين

export const translations = {
  ar: {
    home: "الرئيسية",
    products: "المنتجات",
    cart: "السلة",
    wishlist: "الأمنيات",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    search: "ابحث عن منتج...",
    heroTitle: "كل ما تحتاجه المرأة السودانية",
    heroSubtitle: "أزياء، إكسسوارات، مستحضرات تجميل، وأحذية بأفضل الأسعار",
    shopNow: "تسوقي الآن",
    categories: "الأقسام",
    featuredProducts: "منتجات مميزة",
    viewAll: "عرض الكل",
    addToCart: "أضف للسلة",
    outOfStock: "نفد من المخزون",
    inStock: "متوفر",
    price: "السعر",
    filters: "الفلاتر",
    priceRange: "نطاق السعر",
    color: "اللون",
    size: "المقاس",
    rating: "التقييم",
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    priceLowHigh: "السعر: من الأقل للأعلى",
    priceHighLow: "السعر: من الأعلى للأقل",
    noProducts: "لا توجد منتجات مطابقة",
    reviews: "المراجعات",
    writeReview: "أضف تقييمك",
    submitReview: "إرسال التقييم",
    yourCart: "سلتك",
    emptyCart: "سلتك فارغة",
    quantity: "الكمية",
    remove: "حذف",
    subtotal: "المجموع الفرعي",
    discount: "الخصم",
    total: "الإجمالي",
    couponCode: "كود الخصم",
    applyCoupon: "تطبيق",
    checkout: "إتمام الشراء",
    shippingAddress: "عنوان الشحن",
    paymentMethod: "طريقة الدفع",
    cashOnDelivery: "الدفع عند الاستلام",
    payWithCard: "الدفع بالبطاقة (Stripe)",
    payWithPaymob: "الدفع عبر PayMob",
    placeOrder: "تأكيد الطلب",
    orderSuccess: "تم استلام طلبك بنجاح!",
    trackingNumber: "رقم التتبع",
    name: "الاسم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    phone: "رقم الهاتف",
    address: "العنوان",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    myAccount: "حسابي",
    myOrders: "طلباتي",
  },
  en: {
    home: "Home",
    products: "Products",
    cart: "Cart",
    wishlist: "Wishlist",
    login: "Login",
    register: "Sign Up",
    logout: "Logout",
    search: "Search for a product...",
    heroTitle: "Everything a Sudanese Woman Needs",
    heroSubtitle: "Fashion, accessories, cosmetics, and shoes at the best prices",
    shopNow: "Shop Now",
    categories: "Categories",
    featuredProducts: "Featured Products",
    viewAll: "View All",
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    inStock: "In Stock",
    price: "Price",
    filters: "Filters",
    priceRange: "Price Range",
    color: "Color",
    size: "Size",
    rating: "Rating",
    sortBy: "Sort By",
    newest: "Newest",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    noProducts: "No matching products",
    reviews: "Reviews",
    writeReview: "Write a review",
    submitReview: "Submit Review",
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    quantity: "Quantity",
    remove: "Remove",
    subtotal: "Subtotal",
    discount: "Discount",
    total: "Total",
    couponCode: "Coupon Code",
    applyCoupon: "Apply",
    checkout: "Checkout",
    shippingAddress: "Shipping Address",
    paymentMethod: "Payment Method",
    cashOnDelivery: "Cash on Delivery",
    payWithCard: "Pay by Card (Stripe)",
    payWithPaymob: "Pay via PayMob",
    placeOrder: "Place Order",
    orderSuccess: "Your order was placed successfully!",
    trackingNumber: "Tracking Number",
    name: "Name",
    email: "Email",
    password: "Password",
    phone: "Phone",
    address: "Address",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    loading: "Loading...",
    error: "An error occurred",
    myAccount: "My Account",
    myOrders: "My Orders",
  },
};

export type Lang = "ar" | "en";
export type TranslationKey = keyof typeof translations.ar;

```


## 📄 `src/models/User.ts`

```typescript
// src/models/User.ts
// هذا الملف يعرّف "شكل" بيانات المستخدم داخل قاعدة البيانات
// كل مستخدم (عميل أو أدمن) سيكون له سجل بهذا الشكل بالضبط

import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // سيتم تشفيرها بـ bcrypt قبل الحفظ، لن تُخزن أبداً كنص عادي
  role: "customer" | "admin"; // نوع الحساب: عميل عادي أو مدير المتجر
  phone?: string;
  address?: string;
  wishlist: mongoose.Types.ObjectId[]; // قائمة أمنيات المستخدم (روابط لمنتجات)
  twoFactorSecret?: string; // السر الخاص بتوليد أكواد المصادقة الثنائية (2FA) - مشفّر ضمنياً بعدم إظهاره أبداً للواجهة
  twoFactorEnabled: boolean; // هل فعّل هذا المستخدم (الأدمن عادة) المصادقة الثنائية؟
  failedLoginAttempts: number; // عدد محاولات الدخول الفاشلة المتتالية (لحماية إضافية من التخمين)
  lockUntil?: Date; // إذا تجاوز محاولات فاشلة كثيرة، يُقفل الحساب مؤقتاً حتى هذا الوقت
  emailVerified: boolean; // هل أكّد المستخدم بريده الإلكتروني عبر الرابط المُرسَل له؟
  emailVerificationToken?: string; // رمز عشوائي مؤقت يُرسَل ضمن رابط التفعيل
  emailVerificationExpires?: Date; // صلاحية رمز التفعيل (24 ساعة) - بعدها لا يعمل الرابط القديم
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String },
    address: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    twoFactorSecret: { type: String, select: false }, // select: false = لا يُرجَع تلقائياً في أي استعلام عادي
    twoFactorEnabled: { type: Boolean, default: false },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
  },
  { timestamps: true } // يضيف تلقائياً createdAt و updatedAt
);

// هذا السطر يمنع Next.js من إعادة تعريف النموذج عدة مرات أثناء إعادة التحميل التلقائي
export default models.User || model<IUser>("User", UserSchema);

```


## 📄 `src/models/Category.ts`

```typescript
// src/models/Category.ts
// يعرّف أقسام المتجر مثل: أزياء، إكسسوارات، مستحضرات تجميل، أحذية، حقائب
// يدعم اللغتين العربية والإنجليزية لكل قسم

import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  _id: string;
  name: {
    ar: string; // اسم القسم بالعربية، مثال: "حقائب"
    en: string; // اسم القسم بالإنجليزية، مثال: "Bags"
  };
  slug: string; // نسخة صديقة للروابط، مثال: "bags"
  image?: string; // رابط صورة القسم (يُرفع من الأدمن)
  parentId?: mongoose.Types.ObjectId | null; // لدعم أقسام فرعية مستقبلاً
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);

```


## 📄 `src/models/Product.ts`

```typescript
// src/models/Product.ts
// يعرّف كل منتج في المتجر: اسمه، وصفه، سعره، صوره، تقييماته، إلخ

import mongoose, { Schema, models, model } from "mongoose";

export interface IRating {
  userId: mongoose.Types.ObjectId;
  rating: number; // من 1 إلى 5 نجوم
  comment?: string;
  images?: string[]; // العميل يمكنه إرفاق صور مع تقييمه
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  discountPrice?: number; // السعر بعد الخصم (اختياري)
  images: string[]; // مصفوفة روابط الصور (من Cloudinary)
  categoryId: mongoose.Types.ObjectId;
  stock: number; // الكمية المتوفرة في المخزون
  sizes?: string[]; // مثال: ["S", "M", "L"]
  colors?: string[]; // مثال: ["أحمر", "أسود"]
  ratings: IRating[];
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }], // تبدأ فارغة، الأدمن يرفع الصور لاحقاً
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    ratings: [RatingSchema],
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);

```


## 📄 `src/models/Order.ts`

```typescript
// src/models/Order.ts
// يعرّف كل طلب شراء يقوم به العميل

import mongoose, { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // سعر المنتج وقت الشراء (لا يتغير حتى لو تغير سعر المنتج لاحقاً)
}

export interface IOrder {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  discount: number;
  coupon?: string; // كود الكوبون المستخدم إن وجد
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: "stripe" | "paymob" | "cod"; // cod = الدفع عند الاستلام
  paymentStatus: "pending" | "paid" | "failed";
  trackingNumber?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ["stripe", "paymob", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);

```


## 📄 `src/models/Cart.ts`

```typescript
// src/models/Cart.ts
// يعرّف سلة التسوق الخاصة بكل مستخدم (منتجات لم يتم شراؤها بعد)

import mongoose, { Schema, models, model } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  { timestamps: true }
);

export default models.Cart || model<ICart>("Cart", CartSchema);

```


## 📄 `src/models/Coupon.ts`

```typescript
// src/models/Coupon.ts
// يعرّف أكواد الخصم التي يديرها الأدمن

import { Schema, models, model } from "mongoose";

export interface ICoupon {
  _id: string;
  code: string; // مثال: "RAMADAN25"
  discountType: "percentage" | "fixed"; // نسبة مئوية أو قيمة ثابتة
  value: number; // مثال: 25 (يعني 25% أو 25 جنيه حسب النوع)
  startDate: Date;
  endDate: Date;
  usageLimit: number; // عدد مرات الاستخدام المسموح بها
  usedCount: number; // عدد مرات الاستخدام الفعلية حتى الآن
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Coupon || model<ICoupon>("Coupon", CouponSchema);

```


## 📄 `src/models/Analytics.ts`

```typescript
// src/models/Analytics.ts
// يخزّن إحصائيات يومية: عدد الزيارات والمبيعات، تُستخدم في لوحة تحكم الأدمن للرسوم البيانية

import { Schema, models, model } from "mongoose";

export interface IAnalytics {
  _id: string;
  date: Date; // يوم واحد فقط (بدون وقت)، مثال: 2026-08-23
  visits: number; // عدد زيارات الموقع في هذا اليوم
  sales: number; // إجمالي المبيعات (بالجنيه) في هذا اليوم
  ordersCount: number; // عدد الطلبات في هذا اليوم
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: { type: Date, required: true, unique: true },
    visits: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Analytics || model<IAnalytics>("Analytics", AnalyticsSchema);

```


## 📄 `src/models/ChatMessage.ts`

```typescript
// src/models/ChatMessage.ts
// يخزّن رسائل الدردشة المباشرة بين العميل والأدمن (للاحتفاظ بسجل المحادثة)

import { Schema, models, model, Types } from "mongoose";

export interface IChatMessage {
  _id: string;
  roomId: string; // عادة تكون userId الخاص بالعميل، بحيث لكل عميل "غرفة" محادثة واحدة مع الأدمن
  senderId: string;
  senderRole: "customer" | "admin";
  message: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ["customer", "admin"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);

```


## 📄 `src/context/AppContext.tsx`

```tsx
// src/context/AppContext.tsx
// "use client" لأن هذا الملف يستخدم State وInteractivity، وليس مجرد عرض بيانات
// يوفّر لكل صفحات الموقع: اللغة الحالية، دالة الترجمة t()، بيانات المستخدم المسجل دخوله

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang, TranslationKey } from "@/lib/i18n";
import { apiClient } from "@/lib/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
  emailVerified?: boolean; // هل فعّل بريده الإلكتروني؟ (اختياري احتياطاً لأي بيانات مستخدم قديمة مخزّنة محلياً قبل هذه الميزة)
}

interface AppContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  cartCount: number;
  refreshCartCount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // عند فتح الموقع لأول مرة، نسترجع اللغة والمستخدم المحفوظين من قبل (إن وُجدا)
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedLang) setLang(savedLang);
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // كل مرة تتغير فيها اللغة، نحدّث اتجاه الصفحة (RTL للعربية، LTR للإنجليزية) تلقائياً
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    if (token) refreshCartCount();
  }, [token]);

  function toggleLang() {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] || key;
  }

  function login(newToken: string, newUser: User) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setCartCount(0);
  }

  async function refreshCartCount() {
    try {
      const data = await apiClient("/cart");
      const count = data.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }

  // يُستدعى بعد تفعيل البريد الإلكتروني (أو أي تغيير آخر في بيانات الحساب) لتحديث الحالة المحفوظة محلياً
  // دون الحاجة لتسجيل خروج ودخول مرة أخرى
  async function refreshUser() {
    if (!token) return;
    try {
      const data = await apiClient("/auth/me");
      const updatedUser: User = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        emailVerified: data.user.emailVerified,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch {
      // إذا فشل (مثلاً التوكن منتهي)، لا نفعل شيئاً - المستخدم سيُعاد توجيهه لتسجيل الدخول لاحقاً بشكل طبيعي
    }
  }

  return (
    <AppContext.Provider
      value={{ lang, toggleLang, t, user, token, login, logout, cartCount, refreshCartCount, refreshUser }}
    >
      {children}
    </AppContext.Provider>
  );
}

// دالة مختصرة لاستخدام السياق في أي صفحة: const { t, lang, user } = useApp();
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp يجب أن يُستخدم داخل AppProvider");
  }
  return context;
}

```


## 📄 `src/components/Header.tsx`

```tsx
// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Heart, User, Search, Globe, LogOut } from "lucide-react";

export default function Header() {
  const { t, lang, toggleLang, user, logout, cartCount } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* الشعار */}
        <Link href="/" className="text-2xl font-bold text-primary shrink-0">
          leadybag
        </Link>

        {/* شريط البحث */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search")}
              className="w-full border border-gray-300 rounded-full py-2 px-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-4 ms-auto">
          <Link href="/products" className="text-sm font-medium text-secondary hover:text-primary hidden md:inline">
            {t("products")}
          </Link>

          {/* تبديل اللغة */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-sm text-secondary hover:text-primary"
            title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            <Globe size={18} />
            <span>{lang === "ar" ? "EN" : "AR"}</span>
          </button>

          <Link href="/wishlist" className="text-secondary hover:text-primary" title={t("wishlist")}>
            <Heart size={20} />
          </Link>

          <Link href="/cart" className="relative text-secondary hover:text-primary" title={t("cart")}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -end-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/account" className="text-secondary hover:text-primary" title={t("myAccount")}>
                <User size={20} />
              </Link>
              <button onClick={logout} className="text-secondary hover:text-primary" title={t("logout")}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:opacity-90"
            >
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

```


## 📄 `src/components/Footer.tsx`

```tsx
// src/components/Footer.tsx
"use client";

import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className="border-t border-gray-200 bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm">
        <p className="font-bold text-lg mb-2 text-primary">leadybag</p>
        <p className="text-gray-300">
          {lang === "ar"
            ? "متجر إلكتروني سوداني عصري لكل ما تحتاجه المرأة"
            : "A modern Sudanese online store for everything a woman needs"}
        </p>
        <p className="text-gray-400 mt-4">
          © {new Date().getFullYear()} leadybag. {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}

```


## 📄 `src/components/ProductCard.tsx`

```tsx
// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: { ar: string; en: string };
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    ratings: { rating: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, t, user, refreshCartCount } = useApp();

  const avgRating =
    product.ratings.length > 0
      ? (product.ratings.reduce((s, r) => s + r.rating, 0) / product.ratings.length).toFixed(1)
      : null;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name[lang]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            leadybag
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-secondary text-sm truncate">{product.name[lang]}</h3>

        {avgRating && (
          <p className="text-xs text-yellow-600 mt-1">★ {avgRating}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{product.discountPrice}</span>
                <span className="text-gray-400 text-xs line-through">{product.price}</span>
              </div>
            ) : (
              <span className="text-primary font-bold">{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary text-white p-2 rounded-full disabled:bg-gray-300 hover:opacity-90"
            title={t("addToCart")}
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">{t("outOfStock")}</p>
        )}
      </div>
    </Link>
  );
}

```


## 📄 `src/components/ProductForm.tsx`

```tsx
// src/components/ProductForm.tsx
// نموذج كامل لإضافة أو تعديل منتج - يُستخدم في صفحتي:
// /admin/products/new  و  /admin/products/[id]/edit
// نمرر له initialData عند التعديل، أو نتركه فارغاً عند الإضافة

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import ImageUploader from "@/components/ImageUploader";
import { X } from "lucide-react";

interface Category {
  _id: string;
  name: { ar: string; en: string };
}

interface ProductFormProps {
  productId?: string; // إن وُجد، فهذا تعديل وليس إضافة
  initialData?: any;
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [nameAr, setNameAr] = useState(initialData?.name?.ar || "");
  const [nameEn, setNameEn] = useState(initialData?.name?.en || "");
  const [descAr, setDescAr] = useState(initialData?.description?.ar || "");
  const [descEn, setDescEn] = useState(initialData?.description?.en || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice?.toString() || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?._id || initialData?.categoryId || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [colors, setColors] = useState(initialData?.colors?.join(", ") || "");
  const [sizes, setSizes] = useState(initialData?.sizes?.join(", ") || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient("/categories")
      .then((data) => setCategories(data.categories))
      .catch(console.error);
  }, []);

  function addImage(url: string) {
    setImages((prev) => [...prev, url]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: { ar: nameAr, en: nameEn },
      description: { ar: descAr, en: descEn },
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      categoryId,
      stock: Number(stock),
      colors: colors ? colors.split(",").map((c: string) => c.trim()).filter(Boolean) : [],
      sizes: sizes ? sizes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      images,
    };

    try {
      if (productId) {
        await apiClient(`/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الاسم بالعربية</label>
          <input
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الاسم بالإنجليزية</label>
          <input
            required
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الوصف بالعربية</label>
          <textarea
            required
            value={descAr}
            onChange={(e) => setDescAr(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الوصف بالإنجليزية</label>
          <textarea
            required
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">السعر</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            سعر الخصم (اختياري)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الكمية بالمخزون</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1">القسم</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        >
          <option value="">-- اختر قسماً --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name.ar}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-yellow-600 mt-1">
            لا توجد أقسام بعد - أضف قسماً أولاً من صفحة الأقسام
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            الألوان (افصل بينها بفاصلة)
          </label>
          <input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="أسود, بني, أحمر"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            المقاسات (افصل بينها بفاصلة)
          </label>
          <input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="S, M, L"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-2">صور المنتج</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 end-0.5 bg-black/60 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <ImageUploader onUploaded={addImage} label="أضف صورة جديدة" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm disabled:opacity-50"
      >
        {saving ? "جاري الحفظ..." : productId ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}

```


## 📄 `src/components/ImageUploader.tsx`

```tsx
// src/components/ImageUploader.tsx
// مكون بسيط لرفع صورة: يعرض الصورة الحالية (إن وجدت)، ويسمح باختيار ملف جديد ورفعه
// بعد الرفع بنجاح، يستدعي onUploaded(url) ليضع الرابط في النموذج الذي يستخدمه

"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ currentUrl, onUploaded, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl || "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // لا نضع Content-Type يدوياً - المتصفح يحددها تلقائياً مع FormData
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err: any) {
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-secondary mb-1">{label}</label>}

      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <UploadCloud className="text-gray-300" size={24} />
          )}
        </div>

        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm text-secondary px-4 py-2 rounded-lg flex items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={16} /> جاري الرفع...
            </>
          ) : (
            "اختر صورة"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

```


## 📄 `src/components/ChatWidget.tsx`

```tsx
// src/components/ChatWidget.tsx
// فقاعة دردشة عائمة في أسفل الزاوية - هذا هو "مكان" الدردشة المباشرة الذي كان مفقوداً
// يظهر فقط للعملاء المسجلين دخولهم (الأدمن يستخدم صفحة مخصصة /admin/chats بدلاً منه)
//
// كيف تعمل: roomId = رقم حساب العميل نفسه (userId) - بهذا لكل عميل "غرفة" واحدة ثابتة يتحدث فيها مع الدعم
// عند فتح الفقاعة: نجلب سجل المحادثة القديم من قاعدة البيانات (GET /api/chat/:roomId)
// ثم نتصل بـ Socket.io لنستقبل أي رسالة جديدة لحظياً بدون تحديث الصفحة

"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatMessageItem {
  senderRole: "customer" | "admin";
  message: string;
  createdAt: string;
}

export default function ChatWidget() {
  const { user, lang } = useApp();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // فقط العملاء (وليس الأدمن) يرون هذه الفقاعة - الأدمن يدير كل المحادثات من /admin/chats
  const shouldShow = user && user.role === "customer";

  useEffect(() => {
    if (!shouldShow) return;

    // نتصل بـ Socket.io مرة واحدة فقط طالما المستخدم مسجّل دخوله (بغض النظر هل الفقاعة مفتوحة أم لا)
    // بهذا يستقبل إشعاراً حتى لو كانت النافذة مغلقة (يمكن تفعيل نقطة حمراء لاحقاً إن أردت)
    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;
    socket.emit("join_room", user!.id);

    socket.on("receive_message", (data: any) => {
      if (data.roomId !== user!.id) return;
      setMessages((prev) => [
        ...prev,
        { senderRole: data.senderRole, message: data.message, createdAt: data.createdAt },
      ]);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function loadHistory() {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiClient(`/chat/${user.id}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (messages.length === 0) loadHistory();
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageText = input.trim();
    setInput("");

    try {
      // 1. نحفظ الرسالة في قاعدة البيانات (لتبقى في السجل حتى لو أغلق أحدهما المتصفح)
      await apiClient(`/chat/${user.id}`, {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });

      // 2. نبثّها لحظياً عبر Socket.io ليراها الأدمن فوراً إن كان متصلاً الآن
      socketRef.current?.emit("send_message", {
        roomId: user.id,
        senderId: user.id,
        senderRole: "customer",
        message: messageText,
      });

      // نضيفها محلياً فوراً لظهورها في نافذتنا نحن أيضاً بدون انتظار
      setMessages((prev) => [
        ...prev,
        { senderRole: "customer", message: messageText, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
      setInput(messageText); // نُرجع النص للحقل إن فشل الإرسال حتى لا يضيع على المستخدم
    }
  }

  if (!shouldShow) return null;

  return (
    <div className="fixed bottom-4 end-4 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <span className="font-medium text-sm">
              {lang === "ar" ? "الدعم المباشر" : "Live Support"}
            </span>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </p>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-gray-400 mt-4">
                {lang === "ar" ? "ابدأ محادثة مع فريق الدعم" : "Start a conversation with support"}
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    m.senderRole === "customer"
                      ? "bg-primary text-white ms-auto rounded-ee-none"
                      : "bg-gray-100 text-secondary me-auto rounded-es-none"
                  }`}
                >
                  {m.message}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-2 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === "ar" ? "اكتب رسالة..." : "Type a message..."}
              className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="bg-primary text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:opacity-90"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

```


## 📄 `src/components/admin/AdminSidebar.tsx`

```tsx
// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package, ShoppingCart, Ticket, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";

const links = [
  { href: "/admin", label: "الإحصائيات", icon: LayoutDashboard },
  { href: "/admin/categories", label: "الأقسام", icon: FolderTree },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/coupons", label: "الكوبونات", icon: Ticket },
  { href: "/admin/chats", label: "الدردشات المباشرة", icon: MessageCircle },
  { href: "/admin/security", label: "الأمان", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-secondary text-white min-h-screen p-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-300 mb-8 hover:text-white">
        <ArrowRight size={16} />
        العودة للمتجر
      </Link>

      <p className="text-primary font-bold text-lg mb-6">لوحة تحكم leadybag</p>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

```


## 📄 `src/components/admin/ImageUploader.tsx`

```tsx
// src/components/admin/ImageUploader.tsx
// مكون لرفع صورة واحدة أو أكثر، ويعيد روابط الصور النهائية بعد الرفع
// يُستخدم في صفحة إضافة/تعديل الأقسام والمنتجات

"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[]; // الصور المرفوعة حالياً (روابط)
  onChange: (images: string[]) => void;
  multiple?: boolean; // true للمنتجات (عدة صور)، false للأقسام (صورة واحدة)
}

export default function ImageUploader({ images, onChange, multiple = true }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const uploadedUrls: string[] = [];

      // نرفع كل صورة على حدة (Cloudinary لا يدعم رفع عدة ملفات في طلب واحد بسهولة)
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "فشل رفع الصورة");
        uploadedUrls.push(data.url);
      }

      onChange(multiple ? [...images, ...uploadedUrls] : uploadedUrls);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // نفرّغ حقل الملف حتى يمكن رفع نفس الصورة مرة أخرى إن احتاج المستخدم
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <img src={img} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-0.5 end-0.5 bg-black/60 text-white rounded-full p-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary text-gray-400 hover:text-primary">
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

```


## 📄 `src/app/layout.tsx`

```tsx
// src/app/layout.tsx
// الآن الـ Layout يضم: AppProvider (اللغة + المستخدم)، Header، Footer
// وهذا يظهر في كل صفحات الموقع بدون تكرار الكود

import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "leadybag",
  description: "متجر leadybag - كل ما تحتاجه المرأة السودانية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <AppProvider>
          <Header />
          <div className="min-h-[70vh]">{children}</div>
          <Footer />
          <ChatWidget />
        </AppProvider>
      </body>
    </html>
  );
}

```


## 📄 `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* تنسيقات عامة إضافية */
body {
  font-family: system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif;
  color: #2D2D2D;
}

/* في وضع RTL، الأيقونات ذات الاتجاه (مثل السهم) تُعكس تلقائياً عبر الخصائص المنطقية
   المستخدمة في Tailwind (ms-, me-, ps-, pe-, start-, end-) بدلاً من left/right */

```


## 📄 `src/app/page.tsx`

```tsx
// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";

interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  image?: string;
}

interface Product {
  _id: string;
  name: { ar: string; en: string };
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  ratings: { rating: number }[];
}

export default function Home() {
  const { t, lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiClient("/categories"),
          apiClient("/products?limit=8&sort=newest"),
        ]);
        setCategories(catRes.categories);
        setProducts(prodRes.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main>
      {/* البانر الرئيسي */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-gray-600 mb-8 text-lg">{t("heroSubtitle")}</p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90"
          >
            {t("shopNow")}
          </Link>
        </div>
      </section>

      {/* الأقسام */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-secondary mb-6">{t("categories")}</h2>

        {categories.length === 0 && !loading ? (
          <p className="text-gray-400 text-center py-8">
            {lang === "ar"
              ? "لا توجد أقسام بعد - أضف أقساماً من لوحة تحكم الأدمن"
              : "No categories yet - add some from the admin dashboard"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group text-center"
              >
                <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden mb-2">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                      {cat.name[lang][0]}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-secondary">{cat.name[lang]}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* منتجات مميزة */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">{t("featuredProducts")}</h2>
          <Link href="/products" className="text-primary text-sm font-medium hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">{t("loading")}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {lang === "ar"
              ? "لا توجد منتجات بعد - أضف منتجات من لوحة تحكم الأدمن"
              : "No products yet - add some from the admin dashboard"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

```


## 📄 `src/app/products/page.tsx`

```tsx
// src/app/products/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const { t, lang } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // حالة الفلاتر - تُقرأ من رابط الصفحة (URL) حتى يمكن مشاركة الرابط لاحقاً
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const page = searchParams.get("page") || "1";
        const search = searchParams.get("search");
        const category = searchParams.get("category");

        params.set("page", page);
        params.set("limit", "12");
        params.set("sort", sort);
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        const data = await apiClient(`/products?${params.toString()}`);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sort, minPrice, maxPrice]);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("products")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* الفلاتر الجانبية */}
        <aside className="md:col-span-1 space-y-6">
          <div>
            <h3 className="font-medium text-secondary mb-2">{t("priceRange")}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-secondary mb-2">{t("sortBy")}</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price_asc">{t("priceLowHigh")}</option>
              <option value="price_desc">{t("priceHighLow")}</option>
            </select>
          </div>
        </aside>

        {/* شبكة المنتجات */}
        <div className="md:col-span-3">
          {loading ? (
            <p className="text-center text-gray-400 py-16">{t("loading")}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-400 py-16">{t("noProducts")}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* ترقيم الصفحات */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-full text-sm ${
                        p === pagination.page
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-secondary hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Suspense مطلوب لأن useSearchParams يحتاجها Next.js عند التصدير الثابت
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

```


## 📄 `src/app/products/[id]/page.tsx`

```tsx
// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Heart, Share2, Star } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, lang, user, refreshCartCount } = useApp();

  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // حقول نموذج إضافة تقييم جديد
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data.product);
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      await refreshCartCount();
      alert(lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name[lang], url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  }

  async function handleAddToWishlist() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: id }),
      });
      alert(lang === "ar" ? "تمت الإضافة لقائمة الأمنيات" : "Added to wishlist");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setSubmittingReview(true);
    try {
      await apiClient(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      // نعيد تحميل المنتج لإظهار التقييم الجديد فوراً
      const data = await apiClient(`/products/${id}`);
      setProduct(data.product);
      setReviewComment("");
      setReviewRating(5);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return <p className="text-center py-16 text-gray-400">{t("loading")}</p>;
  }

  if (!product) {
    return <p className="text-center py-16 text-gray-400">{t("noProducts")}</p>;
  }

  const avgRating =
    product.ratings.length > 0
      ? (
          product.ratings.reduce((s: number, r: any) => s + r.rating, 0) / product.ratings.length
        ).toFixed(1)
      : null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* معرض الصور */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name[lang]}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                leadybag
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === selectedImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">{product.name[lang]}</h1>

          {avgRating && (
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-600">
                {avgRating} ({product.ratings.length} {t("reviews")})
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-primary">{product.discountPrice}</span>
                <span className="text-gray-400 line-through">{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">{product.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description[lang]}</p>

          {product.colors?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-secondary mb-1">{t("color")}</p>
              <div className="flex gap-2">
                {product.colors.map((c: string) => (
                  <span key={c} className="text-xs border border-gray-300 rounded-full px-3 py-1">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-secondary mb-1">{t("size")}</p>
              <div className="flex gap-2">
                {product.sizes.map((s: string) => (
                  <span key={s} className="text-xs border border-gray-300 rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600">{t("inStock")} ({product.stock})</span>
            ) : (
              <span className="text-red-500">{t("outOfStock")}</span>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary text-white py-3 rounded-full font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> {t("addToCart")}
            </button>
            <button onClick={handleAddToWishlist} className="border border-gray-300 p-3 rounded-full hover:bg-gray-50">
              <Heart size={18} />
            </button>
            <button onClick={handleShare} className="border border-gray-300 p-3 rounded-full hover:bg-gray-50">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* التقييمات */}
      <section className="mt-16 max-w-2xl">
        <h2 className="text-xl font-bold text-secondary mb-4">
          {t("reviews")} ({product.ratings.length})
        </h2>

        <div className="space-y-4 mb-8">
          {product.ratings.map((r: any, i: number) => (
            <div key={i} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1 text-yellow-500 mb-1">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-medium text-secondary mb-2">{t("writeReview")}</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setReviewRating(n)}
                className={n <= reviewRating ? "text-yellow-500" : "text-gray-300"}
              >
                <Star size={20} fill="currentColor" />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-3"
            rows={3}
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {t("submitReview")}
          </button>
        </form>
      </section>

      {/* منتجات مشابهة (توصيات) */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-secondary mb-4">
            {lang === "ar" ? "منتجات مشابهة" : "Similar Products"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendations.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

```


## 📄 `src/app/cart/page.tsx`

```tsx
// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { t, lang, user, refreshCartCount } = useApp();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (user) loadCart();
    else setLoading(false);
  }, [user]);

  async function loadCart() {
    setLoading(true);
    try {
      const data = await apiClient("/cart");
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      const data = await apiClient("/cart", {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(data.cart);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function removeItem(productId: string) {
    try {
      const data = await apiClient(`/cart?productId=${productId}`, { method: "DELETE" });
      setCart(data.cart);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const data = await apiClient("/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code: couponInput }),
      });
      setCart(data.cart);
    } catch (err: any) {
      setCouponError(err.message);
    } finally {
      setApplyingCoupon(false);
    }
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">
          {lang === "ar" ? "يجب تسجيل الدخول لعرض السلة" : "Please login to view your cart"}
        </p>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full">
          {t("login")}
        </Link>
      </main>
    );
  }

  if (loading) {
    return <p className="text-center py-16 text-gray-400">{t("loading")}</p>;
  }

  const items = cart?.items || [];

  // حساب المجموع الفرعي بناءً على السعر الحالي لكل منتج
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.productId.discountPrice || item.productId.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("yourCart")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">{t("emptyCart")}</p>
          <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-full">
            {t("shopNow")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* عناصر السلة */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div
                key={item.productId._id}
                className="flex gap-4 border border-gray-200 rounded-xl p-3"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {item.productId.images?.[0] && (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name[lang]}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary">{item.productId.name[lang]}</h3>
                  <p className="text-primary font-bold mt-1">
                    {item.productId.discountPrice || item.productId.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-300 rounded-full"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      className="w-7 h-7 border border-gray-300 rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ملخص الطلب */}
          <div className="border border-gray-200 rounded-xl p-4 h-fit">
            <h2 className="font-bold text-secondary mb-4">{t("subtotal")}</h2>

            <form onSubmit={applyCoupon} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={t("couponCode")}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
              />
              <button
                type="submit"
                disabled={applyingCoupon}
                className="bg-secondary text-white px-3 rounded-lg text-sm"
              >
                {t("applyCoupon")}
              </button>
            </form>
            {couponError && <p className="text-red-500 text-xs mb-2">{couponError}</p>}
            {cart?.couponCode && (
              <p className="text-green-600 text-xs mb-2">
                ✓ {cart.couponCode} {lang === "ar" ? "مُطبّق" : "applied"}
              </p>
            )}

            <div className="flex justify-between text-sm py-2 border-t border-gray-100">
              <span>{t("subtotal")}</span>
              <span>{subtotal}</span>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-primary text-white py-3 rounded-full font-medium mt-4"
            >
              {t("checkout")}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

```


## 📄 `src/app/checkout/page.tsx`

```tsx
// src/app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";

export default function CheckoutPage() {
  const { t, user, refreshCartCount } = useApp();
  const router = useRouter();

  const [shippingAddress, setShippingAddress] = useState(user ? "" : "");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "stripe" | "paymob">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    router.push("/login");
    return null;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. ننشئ الطلب أولاً (يُحوّل السلة الحالية إلى طلب حقيقي)
      const orderData = await apiClient("/orders", {
        method: "POST",
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: paymentMethod === "cod" ? "cod" : paymentMethod,
        }),
      });

      await refreshCartCount();

      // 2. إذا اختار الدفع الإلكتروني، نوجّهه لصفحة الدفع الخارجية
      if (paymentMethod === "stripe") {
        const payData = await apiClient("/payment/stripe", {
          method: "POST",
          body: JSON.stringify({ orderId: orderData.order._id }),
        });
        window.location.href = payData.checkoutUrl;
        return;
      }

      if (paymentMethod === "paymob") {
        const payData = await apiClient("/payment/paymob", {
          method: "POST",
          body: JSON.stringify({ orderId: orderData.order._id }),
        });
        window.location.href = payData.checkoutUrl;
        return;
      }

      // 3. الدفع عند الاستلام - ننتقل مباشرة لصفحة نجاح الطلب
      router.push(`/order-success?orderId=${orderData.order._id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("checkout")}</h1>

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            {t("shippingAddress")}
          </label>
          <textarea
            required
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm"
            rows={3}
            placeholder="الخرطوم، الحي، الشارع، رقم المنزل..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary mb-2">
            {t("paymentMethod")}
          </label>
          <div className="space-y-2">
            {[
              { value: "cod", label: t("cashOnDelivery") },
              { value: "stripe", label: t("payWithCard") },
              { value: "paymob", label: t("payWithPaymob") },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 border border-gray-300 rounded-lg p-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value as any)}
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? t("loading") : t("placeOrder")}
        </button>
      </form>
    </main>
  );
}

```


## 📄 `src/app/order-success/page.tsx`

```tsx
// src/app/order-success/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { CheckCircle } from "lucide-react";

function OrderSuccessContent() {
  const { t } = useApp();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const data = await apiClient(`/orders/${orderId}`);
        setOrder(data.order);
      } catch (err) {
        console.error(err);
      }
    }
    loadOrder();
  }, [orderId]);

  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
      <h1 className="text-2xl font-bold text-secondary mb-2">{t("orderSuccess")}</h1>

      {order && (
        <p className="text-gray-600 mb-6">
          {t("trackingNumber")}: <span className="font-mono">{order.trackingNumber}</span>
        </p>
      )}

      <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-full inline-block">
        {t("shopNow")}
      </Link>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

```


## 📄 `src/app/login/page.tsx`

```tsx
// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
  const { t, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, twoFactorCode: twoFactorCode || undefined }),
      });

      // إذا كان الحساب مفعّلاً عليه 2FA ولم نرسل الكود بعد، نظهر حقل إدخال الكود
      if (data.status === "2fa_required") {
        setNeedsTwoFactor(true);
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-secondary mb-6 text-center">{t("login")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("email")}</label>
          <input
            type="email"
            required
            disabled={needsTwoFactor}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("password")}</label>
          <input
            type="password"
            required
            disabled={needsTwoFactor}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-100"
          />
        </div>

        {needsTwoFactor && (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              كود المصادقة الثنائية (من تطبيق المصادقة)
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              placeholder="123456"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? t("loading") : needsTwoFactor ? "تأكيد الدخول" : t("login")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {t("dontHaveAccount")}{" "}
        <Link href="/register" className="text-primary font-medium">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}

```


## 📄 `src/app/register/page.tsx`

```tsx
// src/app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";

export default function RegisterPage() {
  const { t, login } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, phone }),
      });
      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-secondary mb-6 text-center">{t("register")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("name")}</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("email")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("password")}</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("phone")}</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? t("loading") : t("register")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="text-primary font-medium">
          {t("login")}
        </Link>
      </p>
    </main>
  );
}

```


## 📄 `src/app/verify-email/page.tsx`

```tsx
// src/app/verify-email/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useApp();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("رابط التفعيل غير صحيح");
        return;
      }
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStatus("success");
        setMessage(data.message);
        // إن كان المستخدم مسجّلاً دخوله بالفعل في هذا المتصفح، نحدّث حالته فوراً حتى يختفي تنبيه "لم يُفعَّل بعد"
        await refreshUser();
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="max-w-md mx-auto px-4 py-24 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="mx-auto animate-spin text-primary mb-4" size={48} />
          <p className="text-gray-500">جاري التحقق من رابط التفعيل...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
          <h1 className="text-xl font-bold text-secondary mb-2">تم تفعيل بريدك بنجاح!</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/account" className="bg-primary text-white px-6 py-2 rounded-full inline-block">
            الذهاب لحسابي
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={56} />
          <h1 className="text-xl font-bold text-secondary mb-2">تعذّر التفعيل</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/account" className="bg-primary text-white px-6 py-2 rounded-full inline-block">
            الذهاب لحسابي لطلب رابط جديد
          </Link>
        </>
      )}
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

```


## 📄 `src/app/account/page.tsx`

```tsx
// src/app/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Settings, MailWarning } from "lucide-react";

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  processing: "قيد التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

export default function AccountPage() {
  const { t, user } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    apiClient("/orders")
      .then((data) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  async function handleResendVerification() {
    setResending(true);
    setResendMessage("");
    try {
      const data = await apiClient("/auth/resend-verification", { method: "POST" });
      setResendMessage(data.message);
    } catch (err: any) {
      setResendMessage(err.message);
    } finally {
      setResending(false);
    }
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full">
          {t("login")}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* تنبيه تفعيل البريد الإلكتروني - يظهر فقط إذا لم يفعّله المستخدم بعد */}
      {user.emailVerified === false && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <MailWarning className="text-yellow-600 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm text-yellow-800 font-medium">
              لم تُفعِّل بريدك الإلكتروني بعد
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              تحقق من بريدك ({user.email}) واضغط رابط التفعيل. لم يصلك؟
            </p>
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="text-xs text-primary font-medium underline mt-2 disabled:opacity-50"
            >
              {resending ? "جاري الإرسال..." : "إعادة إرسال رابط التفعيل"}
            </button>
            {resendMessage && <p className="text-xs text-gray-600 mt-1">{resendMessage}</p>}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary">{user.name}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-1 text-sm bg-secondary text-white px-4 py-2 rounded-full"
          >
            <Settings size={16} /> لوحة التحكم
          </Link>
        )}
      </div>

      <h2 className="font-bold text-secondary mb-4">{t("myOrders")}</h2>

      {loading ? (
        <p className="text-gray-400">{t("loading")}</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">
          {user.role === "admin" ? "لا توجد طلبات في المتجر بعد" : "لا توجد طلبات بعد"}
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm text-gray-500">{order.trackingNumber}</span>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  {statusLabels[order.status] || order.status}
                </span>
              </div>
              <p className="text-primary font-bold mt-2">{order.total}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString("ar-SD")}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

```


## 📄 `src/app/wishlist/page.tsx`

```tsx
// src/app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Trash2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { t, lang, user, refreshCartCount } = useApp();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadWishlist();
    else setLoading(false);
  }, [user]);

  async function loadWishlist() {
    setLoading(true);
    try {
      const data = await apiClient("/wishlist");
      setWishlist(data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      await apiClient(`/wishlist?productId=${productId}`, { method: "DELETE" });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      alert(err.message);
    }
  }

  // "نقل للسلة": نضيف المنتج للسلة ثم نزيله من قائمة الأمنيات
  async function moveToCart(productId: string) {
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      await removeFromWishlist(productId);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">
          {lang === "ar" ? "يجب تسجيل الدخول لعرض قائمة الأمنيات" : "Please login to view your wishlist"}
        </p>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full">
          {t("login")}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("wishlist")}</h1>

      {loading ? (
        <p className="text-gray-400">{t("loading")}</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">
            {lang === "ar" ? "قائمة أمنياتك فارغة" : "Your wishlist is empty"}
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-full">
            {t("shopNow")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="flex gap-4 border border-gray-200 rounded-xl p-3">
              <Link href={`/products/${product._id}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium text-secondary">{product.name[lang]}</h3>
                </Link>
                <p className="text-primary font-bold mt-1">
                  {product.discountPrice || product.price}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => moveToCart(product._id)}
                    disabled={product.stock === 0}
                    className="text-xs bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 disabled:bg-gray-300"
                  >
                    <ShoppingBag size={12} /> {t("addToCart")}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <Trash2 size={12} /> {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

```


## 📄 `src/app/admin/layout.tsx`

```tsx
// src/app/admin/layout.tsx
// هذا الملف "يحمي" كل صفحات /admin/* - لا يمكن لأي شخص غير أدمن الدخول إليها
// إذا لم يكن المستخدم أدمن، يُعاد توجيهه للصفحة الرئيسية تلقائياً

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, token } = useApp();
  const router = useRouter();

  useEffect(() => {
    // ننتظر تحميل بيانات المستخدم من localStorage أولاً (يحدث بعد أول render)
    const timer = setTimeout(() => {
      if (!token || !user) {
        router.push("/login");
      } else if (user.role !== "admin") {
        router.push("/");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [user, token, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        جاري التحقق من الصلاحيات...
      </div>
    );
  }

  return (
    <div className="flex" dir="rtl">
      <AdminSidebar />
      <div className="flex-1 bg-gray-50 min-h-screen p-6">{children}</div>
    </div>
  );
}

```


## 📄 `src/app/admin/page.tsx`

```tsx
// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient("/analytics");
        setAnalytics(data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-gray-400">جاري التحميل...</p>;
  if (!analytics) return <p className="text-gray-400">تعذّر تحميل الإحصائيات</p>;

  const maxSale = Math.max(...analytics.last7Days.map((d: any) => d.sales), 1);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-secondary">لوحة القيادة</h1>

      {/* بطاقات الملخص */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">إجمالي الإيرادات</p>
          <p className="text-2xl font-bold text-primary">{analytics.totalRevenue}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">عدد الطلبات</p>
          <p className="text-2xl font-bold text-secondary">{analytics.totalOrders}</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-1">عدد المنتجات</p>
          <p className="text-2xl font-bold text-secondary">{analytics.totalProducts}</p>
        </div>
      </div>

      {/* رسم بياني بسيط للمبيعات آخر 7 أيام */}
      <div className="border border-gray-200 rounded-xl p-4">
        <h2 className="font-medium text-secondary mb-4">المبيعات آخر 7 أيام</h2>
        <div className="flex items-end gap-2 h-40">
          {analytics.last7Days.map((day: any) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary rounded-t-md"
                style={{ height: `${Math.max((day.sales / maxSale) * 100, 4)}%` }}
                title={`${day.sales}`}
              />
              <span className="text-[10px] text-gray-400">{day.date.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* أكثر المنتجات مبيعاً */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-medium text-secondary mb-3">أكثر المنتجات مبيعاً</h2>
          {analytics.topProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد بيانات مبيعات بعد</p>
          ) : (
            <ul className="space-y-2">
              {analytics.topProducts.map((p: any, i: number) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-primary font-medium">{p.count} قطعة</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* تنبيهات نفاد المخزون */}
        <div className="border border-gray-200 rounded-xl p-4">
          <h2 className="font-medium text-secondary mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-yellow-500" />
            تنبيهات المخزون المنخفض
          </h2>
          {analytics.lowStockProducts.length === 0 ? (
            <p className="text-gray-400 text-sm">لا توجد منتجات على وشك النفاد</p>
          ) : (
            <ul className="space-y-2">
              {analytics.lowStockProducts.map((p: any) => (
                <li key={p._id} className="flex justify-between text-sm">
                  <span>{p.name?.ar}</span>
                  <span className="text-red-500 font-medium">متبقي {p.stock}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

```


## 📄 `src/app/admin/products/page.tsx`

```tsx
// src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await apiClient("/products?limit=100");
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await apiClient(`/products/${id}`, { method: "DELETE" });
      await loadProducts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
        >
          <Plus size={16} /> منتج جديد
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">لا توجد منتجات بعد</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-start">الصورة</th>
                <th className="p-3 text-start">الاسم</th>
                <th className="p-3 text-start">السعر</th>
                <th className="p-3 text-start">المخزون</th>
                <th className="p-3 text-start">القسم</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">{p.name.ar}</td>
                  <td className="p-3">
                    {p.discountPrice ? (
                      <>
                        <span className="text-primary font-medium">{p.discountPrice}</span>{" "}
                        <span className="text-gray-400 line-through text-xs">{p.price}</span>
                      </>
                    ) : (
                      p.price
                    )}
                  </td>
                  <td className="p-3">
                    <span className={p.stock < 5 ? "text-red-500" : ""}>{p.stock}</span>
                  </td>
                  <td className="p-3 text-gray-400">{p.categoryId?.name?.ar || "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-gray-400 hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

```


## 📄 `src/app/admin/products/new/page.tsx`

```tsx
// src/app/admin/products/new/page.tsx
"use client";

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">إضافة منتج جديد</h1>
      <ProductForm />
    </div>
  );
}

```


## 📄 `src/app/admin/products/[id]/edit/page.tsx`

```tsx
// src/app/admin/products/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <p className="text-gray-400">جاري التحميل...</p>;
  if (!product) return <p className="text-gray-400">المنتج غير موجود</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">تعديل المنتج</h1>
      <ProductForm productId={product._id} initialData={product} />
    </div>
  );
}

```


## 📄 `src/app/admin/categories/page.tsx`

```tsx
// src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import ImageUploader from "@/components/ImageUploader";
import { Plus, Trash2, Edit2, X } from "lucide-react";

interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  image?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nameAr, setNameAr] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    try {
      const data = await apiClient("/categories");
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setNameAr("");
    setNameEn("");
    setSlug("");
    setImage("");
    setEditingId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(cat: Category) {
    setEditingId(cat._id);
    setNameAr(cat.name.ar);
    setNameEn(cat.name.en);
    setSlug(cat.slug);
    setImage(cat.image || "");
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { name: { ar: nameAr, en: nameEn }, slug, image };

    try {
      if (editingId) {
        await apiClient(`/categories/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      await loadCategories();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا القسم؟")) return;
    try {
      await apiClient(`/categories/${id}`, { method: "DELETE" });
      await loadCategories();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">الأقسام</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "إلغاء" : "قسم جديد"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">الاسم بالعربية</label>
              <input
                required
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">الاسم بالإنجليزية</label>
              <input
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              Slug (رابط صديق - بالإنجليزية بدون مسافات)
            </label>
            <input
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              placeholder="bags"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <ImageUploader currentUrl={image} onUploaded={setImage} label="صورة القسم" />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة القسم"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400">لا توجد أقسام بعد</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-start">
              <tr>
                <th className="p-3 text-start">الصورة</th>
                <th className="p-3 text-start">الاسم (عربي)</th>
                <th className="p-3 text-start">الاسم (إنجليزي)</th>
                <th className="p-3 text-start">Slug</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                      {cat.image && (
                        <img src={cat.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">{cat.name.ar}</td>
                  <td className="p-3">{cat.name.en}</td>
                  <td className="p-3 text-gray-400">{cat.slug}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(cat)} className="text-gray-400 hover:text-primary">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

```


## 📄 `src/app/admin/orders/page.tsx`

```tsx
// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

const statusOptions = [
  { value: "pending", label: "قيد الانتظار", color: "bg-gray-100 text-gray-600" },
  { value: "processing", label: "قيد التجهيز", color: "bg-blue-100 text-blue-600" },
  { value: "shipped", label: "تم الشحن", color: "bg-purple-100 text-purple-600" },
  { value: "delivered", label: "تم التسليم", color: "bg-green-100 text-green-600" },
  { value: "cancelled", label: "ملغي", color: "bg-red-100 text-red-600" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await apiClient("/orders");
      setOrders(data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId: string, status: string) {
    setUpdatingId(orderId);
    try {
      await apiClient(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await loadOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function statusStyle(status: string) {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-600";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">الطلبات</h1>

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">لا توجد طلبات بعد</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-start">رقم التتبع</th>
                <th className="p-3 text-start">المنتجات</th>
                <th className="p-3 text-start">الإجمالي</th>
                <th className="p-3 text-start">طريقة الدفع</th>
                <th className="p-3 text-start">حالة الدفع</th>
                <th className="p-3 text-start">الحالة</th>
                <th className="p-3 text-start">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="p-3 font-mono text-xs">{order.trackingNumber}</td>
                  <td className="p-3 text-gray-500 text-xs">
                    {order.items.length} {order.items.length === 1 ? "منتج" : "منتجات"}
                  </td>
                  <td className="p-3 font-medium text-primary">{order.total}</td>
                  <td className="p-3 text-gray-500 text-xs">
                    {order.paymentMethod === "cod"
                      ? "عند الاستلام"
                      : order.paymentMethod === "stripe"
                      ? "Stripe"
                      : "PayMob"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "مدفوع" : "قيد الدفع"}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-xs rounded-full px-2 py-1 border-0 ${statusStyle(order.status)}`}
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-gray-400 text-xs">
                    {new Date(order.createdAt).toLocaleDateString("ar-SD")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

```


## 📄 `src/app/admin/coupons/page.tsx`

```tsx
// src/app/admin/coupons/page.tsx
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { Plus, X } from "lucide-react";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("100");

  useEffect(() => {
    loadCoupons();
  }, []);

  async function loadCoupons() {
    setLoading(true);
    try {
      const data = await apiClient("/coupons");
      setCoupons(data.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setCode("");
    setDiscountType("percentage");
    setValue("");
    setStartDate("");
    setEndDate("");
    setUsageLimit("100");
    setShowForm(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiClient("/coupons", {
        method: "POST",
        body: JSON.stringify({
          code,
          discountType,
          value: Number(value),
          startDate,
          endDate,
          usageLimit: Number(usageLimit),
        }),
      });
      resetForm();
      await loadCoupons();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function isExpired(endDate: string) {
    return new Date(endDate) < new Date();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">الكوبونات</h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "إلغاء" : "كوبون جديد"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-4 mb-6 space-y-3 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">كود الكوبون</label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="RAMADAN25"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">نوع الخصم</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              >
                <option value="percentage">نسبة مئوية %</option>
                <option value="fixed">قيمة ثابتة</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">
                القيمة {discountType === "percentage" ? "(%)" : ""}
              </label>
              <input
                required
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">تاريخ البداية</label>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-1">تاريخ الانتهاء</label>
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              الحد الأقصى لعدد الاستخدامات
            </label>
            <input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {saving ? "جاري الحفظ..." : "إضافة الكوبون"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : coupons.length === 0 ? (
        <p className="text-gray-400">لا توجد كوبونات بعد</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-start">الكود</th>
                <th className="p-3 text-start">الخصم</th>
                <th className="p-3 text-start">الصلاحية</th>
                <th className="p-3 text-start">الاستخدام</th>
                <th className="p-3 text-start">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-t border-gray-100">
                  <td className="p-3 font-mono font-medium">{c.code}</td>
                  <td className="p-3">
                    {c.discountType === "percentage" ? `${c.value}%` : c.value}
                  </td>
                  <td className="p-3 text-gray-400 text-xs">
                    {new Date(c.startDate).toLocaleDateString("ar-SD")} →{" "}
                    {new Date(c.endDate).toLocaleDateString("ar-SD")}
                  </td>
                  <td className="p-3 text-gray-500">
                    {c.usedCount} / {c.usageLimit}
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        isExpired(c.endDate) || c.usedCount >= c.usageLimit
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isExpired(c.endDate)
                        ? "منتهي"
                        : c.usedCount >= c.usageLimit
                        ? "مستنفد"
                        : "فعّال"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

```


## 📄 `src/app/admin/chats/page.tsx`

```tsx
// src/app/admin/chats/page.tsx
// قائمة كل العملاء الذين راسلوا الدعم، مع نافذة دردشة لكل واحد
// هذا هو "مكان" إدارة الدردشة المباشرة من جهة الأدمن

"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Send, MessageCircle } from "lucide-react";

interface Room {
  roomId: string;
  customerName: string;
  customerEmail: string;
  lastMessage: string;
  lastMessageAt: string;
}

interface ChatMessageItem {
  senderRole: "customer" | "admin";
  message: string;
  createdAt: string;
}

export default function AdminChatsPage() {
  const { user } = useApp();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  // الأدمن يتصل بـ Socket.io مرة واحدة، وينضم لأي غرفة يفتحها
  useEffect(() => {
    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;

    socket.on("receive_message", (data: any) => {
      setMessages((prev) => {
        // نضيف الرسالة فقط إذا كانت للمحادثة المفتوحة حالياً أمام الأدمن
        if (selectedRoom && data.roomId === selectedRoom.roomId) {
          return [...prev, { senderRole: data.senderRole, message: data.message, createdAt: data.createdAt }];
        }
        return prev;
      });
      loadRooms(); // نحدّث قائمة المحادثات (آخر رسالة) عند وصول أي رسالة جديدة من أي عميل
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoom?.roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadRooms() {
    try {
      const data = await apiClient("/chat");
      setRooms(data.rooms);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  }

  async function openRoom(room: Room) {
    setSelectedRoom(room);
    socketRef.current?.emit("join_room", room.roomId);
    try {
      const data = await apiClient(`/chat/${room.roomId}`);
      setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !selectedRoom || !user) return;

    const messageText = input.trim();
    setInput("");

    try {
      await apiClient(`/chat/${selectedRoom.roomId}`, {
        method: "POST",
        body: JSON.stringify({ message: messageText }),
      });

      socketRef.current?.emit("send_message", {
        roomId: selectedRoom.roomId,
        senderId: user.id,
        senderRole: "admin",
        message: messageText,
      });

      setMessages((prev) => [
        ...prev,
        { senderRole: "admin", message: messageText, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      console.error(err);
      setInput(messageText);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">الدردشات المباشرة</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* قائمة المحادثات */}
        <div className="border border-gray-200 rounded-xl overflow-y-auto">
          {loadingRooms ? (
            <p className="text-center text-gray-400 text-sm p-4">جاري التحميل...</p>
          ) : rooms.length === 0 ? (
            <p className="text-center text-gray-400 text-sm p-4">
              لا توجد محادثات بعد - ستظهر هنا فور أن يراسل أي عميل الدعم عبر فقاعة الدردشة في الموقع
            </p>
          ) : (
            rooms.map((room) => (
              <button
                key={room.roomId}
                onClick={() => openRoom(room)}
                className={`w-full text-start p-3 border-b border-gray-100 hover:bg-gray-50 ${
                  selectedRoom?.roomId === room.roomId ? "bg-primary/5" : ""
                }`}
              >
                <p className="font-medium text-secondary text-sm">{room.customerName}</p>
                <p className="text-xs text-gray-400 truncate">{room.lastMessage}</p>
              </button>
            ))
          )}
        </div>

        {/* نافذة المحادثة المفتوحة */}
        <div className="md:col-span-2 border border-gray-200 rounded-xl flex flex-col">
          {!selectedRoom ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <MessageCircle size={40} />
              <p className="text-sm mt-2">اختر محادثة من القائمة</p>
            </div>
          ) : (
            <>
              <div className="border-b border-gray-100 p-3">
                <p className="font-medium text-secondary text-sm">{selectedRoom.customerName}</p>
                <p className="text-xs text-gray-400">{selectedRoom.customerEmail}</p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[70%] px-3 py-2 rounded-xl text-sm ${
                      m.senderRole === "admin"
                        ? "bg-primary text-white ms-auto rounded-ee-none"
                        : "bg-gray-100 text-secondary me-auto rounded-es-none"
                    }`}
                  >
                    {m.message}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="border-t border-gray-100 p-2 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="اكتب رداً..."
                  className="flex-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-white rounded-full w-9 h-9 flex items-center justify-center shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

```


## 📄 `src/app/admin/security/page.tsx`

```tsx
// src/app/admin/security/page.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function AdminSecurityPage() {
  const [step, setStep] = useState<"idle" | "setup" | "done">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient("/auth/2fa/setup", { method: "POST" });
      setQrCode(data.qrCodeDataUrl);
      setSecret(data.secret);
      setStep("setup");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setMessage("تم تفعيل المصادقة الثنائية بنجاح! سيُطلب منك الكود في كل تسجيل دخول قادم");
      setStep("done");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function disable2FA(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/2fa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setMessage("تم تعطيل المصادقة الثنائية");
      setStep("idle");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-secondary mb-6">الأمان</h1>

      <div className="border border-gray-200 rounded-xl p-5">
        <h2 className="font-medium text-secondary mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-600" />
          المصادقة الثنائية (2FA)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          طبقة حماية إضافية: بعد تفعيلها، ستحتاج كلمة المرور + كود متغيّر من تطبيق مصادقة
          (مثل Google Authenticator) في كل تسجيل دخول.
        </p>

        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {step === "idle" && (
          <button
            onClick={startSetup}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {loading ? "جاري التحضير..." : "تفعيل المصادقة الثنائية"}
          </button>
        )}

        {step === "setup" && (
          <div>
            <p className="text-sm text-secondary mb-3">
              1. حمّل تطبيق <strong>Google Authenticator</strong> أو أي تطبيق مصادقة مشابه على هاتفك
              <br />
              2. امسح رمز QR التالي:
            </p>
            {qrCode && (
              <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto border border-gray-200 rounded-lg mb-3" />
            )}
            <p className="text-xs text-gray-400 mb-3 text-center">
              أو أدخل هذا الكود يدوياً: <span className="font-mono">{secret}</span>
            </p>
            <form onSubmit={confirmSetup} className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل الكود المكوّن من 6 أرقام"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                تأكيد
              </button>
            </form>
          </div>
        )}

        {step === "done" && (
          <form onSubmit={disable2FA} className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-secondary mb-2 flex items-center gap-1">
              <ShieldOff size={14} /> لتعطيل الحماية، أدخل كلمة المرور:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                تعطيل
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

```


## 📄 `src/app/api/health/route.ts`

```typescript
// src/app/api/health/route.ts
// رابط اختبار بسيط: عند فتحه في المتصفح، يحاول الاتصال بقاعدة البيانات
// ويعيد رسالة توضح هل نجح الاتصال أم لا
// جرّبه على: http://localhost:3000/api/health

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Analytics from "@/models/Analytics";

export async function GET() {
  try {
    await connectDB();

    // نتأكد أن كل نموذج (Model) تم تحميله بنجاح بدون أخطاء
    const modelsLoaded = [
      User.modelName,
      Category.modelName,
      Product.modelName,
      Order.modelName,
      Cart.modelName,
      Coupon.modelName,
      Analytics.modelName,
    ];

    return NextResponse.json({
      status: "success",
      message: "✅ الاتصال بقاعدة البيانات ناجح والنماذج جاهزة",
      modelsLoaded,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "❌ فشل الاتصال بقاعدة البيانات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/register/route.ts`

```typescript
// src/app/api/auth/register/route.ts
// POST /api/auth/register
// ينشئ حساب مستخدم جديد (عميل). يشفّر كلمة المرور قبل حفظها أبداً لا نحفظها كنص عادي

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { registerSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/sanitize";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawBody = await req.json();
    // نظّف المدخلات أولاً (نحذف أي مفاتيح $ أو تحتوي نقطة) قبل حتى التحقق من الصحة
    // طبقة حماية إضافية فوق التحقق بـ Zod ضد محاولات حقن NoSQL
    const body = sanitizeInput(rawBody);

    // 1. التحقق من صحة البيانات المُرسلة
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { name, email, password, phone, address } = parsed.data;

    // 2. التأكد أن البريد الإلكتروني غير مستخدم من قبل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { status: "error", message: "هذا البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 }
      );
    }

    // 3. تشفير كلمة المرور (bcrypt) - رقم 10 هو "قوة" التشفير، القياسي والآمن
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3.5. توليد رمز تفعيل البريد الإلكتروني (نص عشوائي طويل يصعب تخمينه) وصلاحيته 24 ساعة
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 4. إنشاء المستخدم في قاعدة البيانات
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "customer", // كل حساب جديد يُنشأ كعميل عادي، الأدمن يُنشأ يدوياً فقط
      emailVerified: false,
      emailVerificationToken,
      emailVerificationExpires,
    });

    // 4.5. نرسل بريد التفعيل، لكن لا نجعل فشل الإرسال يوقف عملية التسجيل نفسها
    // (مثلاً إذا كانت إعدادات SMTP غير مُعبّأة بعد أثناء التطوير المحلي)
    try {
      await sendVerificationEmail(user.email, user.name, emailVerificationToken);
    } catch (emailError) {
      console.error("⚠️ تعذّر إرسال بريد التفعيل، لكن الحساب أُنشئ بنجاح:", emailError);
    }

    // 5. إنشاء توكن دخول مباشرة حتى لا يحتاج المستخدم لتسجيل الدخول يدوياً بعد التسجيل
    // (يمكنه استخدام الموقع فوراً، وتفعيل البريد يبقى تذكيراً بسيطاً وليس حاجزاً صارماً)
    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json(
      {
        status: "success",
        message: "تم إنشاء الحساب بنجاح - تحقق من بريدك الإلكتروني لتفعيله",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/login/route.ts`

```typescript
// src/app/api/auth/login/route.ts
// POST /api/auth/login
// الآن يشمل: حماية من محاولات التخمين المتكرر، قفل الحساب بعد 5 محاولات فاشلة،
// ودعم المصادقة الثنائية (2FA) إن كانت مُفعّلة على الحساب (عادة حسابات الأدمن)

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { loginSchema } from "@/lib/validation";
import { checkRateLimit, resetRateLimit, getClientIp } from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";

const loginWith2FASchema = loginSchema.extend({
  twoFactorCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const rawBody = await req.json();
    const body = sanitizeInput(rawBody);

    const parsed = loginWith2FASchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { email, password, twoFactorCode } = parsed.data;

    // 1. الحماية من التخمين المتكرر - نحسبها حسب (IP + البريد) معاً
    const clientIp = getClientIp(req);
    const rateLimitKey = `login:${clientIp}:${email}`;
    const rateLimit = checkRateLimit(rateLimitKey);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: `محاولات كثيرة جداً. حاول مرة أخرى بعد ${Math.ceil(
            (rateLimit.retryAfterSeconds || 0) / 60
          )} دقيقة`,
        },
        { status: 429 }
      );
    }

    // نطلب صراحة twoFactorSecret لأن select: false في النموذج يخفيه افتراضياً
    const user = await User.findOne({ email }).select("+twoFactorSecret");

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 2. التحقق من قفل الحساب (بسبب محاولات فاشلة سابقة كثيرة)
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json(
        { status: "error", message: `الحساب مقفل مؤقتاً. حاول بعد ${minutesLeft} دقيقة` },
        { status: 423 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();

      return NextResponse.json(
        { status: "error", message: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    // 3. إذا كان الحساب مُفعَّلاً عليه 2FA (المصادقة الثنائية)
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return NextResponse.json(
          { status: "2fa_required", message: "يجب إدخال كود المصادقة الثنائية" },
          { status: 200 }
        );
      }

      const isCodeValid = authenticator.verify({
        token: twoFactorCode,
        secret: user.twoFactorSecret as string,
      });

      if (!isCodeValid) {
        return NextResponse.json(
          { status: "error", message: "كود المصادقة الثنائية غير صحيح" },
          { status: 401 }
        );
      }
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    resetRateLimit(rateLimitKey);

    const token = signToken({ userId: user._id.toString(), role: user.role });

    return NextResponse.json({
      status: "success",
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/me/route.ts`

```typescript
// src/app/api/auth/me/route.ts
// GET /api/auth/me
// يعيد بيانات المستخدم صاحب التوكن المُرسل في الهيدر
// يُستخدم في الواجهة الأمامية لمعرفة "من المستخدم الحالي؟" بعد إعادة تحميل الصفحة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    await connectDB();
    // نستثني حقل password من النتيجة حتى لو كان مشفراً - لا داعي لإرساله للواجهة الأمامية أبداً
    const user = await User.findById(currentUser.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { status: "error", message: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", user });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/verify-email/route.ts`

```typescript
// src/app/api/auth/verify-email/route.ts
// GET /api/auth/verify-email?token=xxx
// يُستدعى عند ضغط المستخدم على رابط التفعيل المُرسَل بالبريد
// يتحقق أن الرمز صحيح ولم تنتهِ صلاحيته، ثم يضع emailVerified = true

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { status: "error", message: "رابط التفعيل غير صحيح" },
        { status: 400 }
      );
    }

    await connectDB();

    // نبحث عن مستخدم يملك هذا الرمز بالضبط، وأن صلاحيته لم تنتهِ بعد
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return NextResponse.json(
        {
          status: "error",
          message: "رابط التفعيل غير صحيح أو منتهي الصلاحية - اطلب رابطاً جديداً",
        },
        { status: 400 }
      );
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "تم تفعيل بريدك الإلكتروني بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/resend-verification/route.ts`

```typescript
// src/app/api/auth/resend-verification/route.ts
// POST /api/auth/resend-verification
// يُستخدم إذا لم يستلم المستخدم البريد الأول، أو انتهت صلاحية الرابط القديم
// يتطلب تسجيل الدخول (نعرف "من" نُرسل له الرمز الجديد من التوكن نفسه)

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    // نمنع إعادة الإرسال أكثر من عدة مرات متتالية - لحماية حصة SMTP من الاستنفاد ومنع إزعاج المستخدم الآخر
    const rateLimit = checkRateLimit(`resend-verification:${currentUser.userId}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          status: "error",
          message: `محاولات كثيرة. حاول مرة أخرى بعد ${Math.ceil((rateLimit.retryAfterSeconds || 0) / 60)} دقيقة`,
        },
        { status: 429 }
      );
    }

    await connectDB();
    const user = await User.findById(currentUser.userId);

    if (!user) {
      return NextResponse.json({ status: "error", message: "المستخدم غير موجود" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({
        status: "success",
        message: "بريدك الإلكتروني مُفعَّل بالفعل",
        alreadyVerified: true,
      });
    }

    // نولّد رمزاً جديداً في كل مرة (نُبطل أي رابط قديم أُرسل من قبل تلقائياً)
    const emailVerificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user.email, user.name, emailVerificationToken);

    return NextResponse.json({
      status: "success",
      message: "تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/2fa/setup/route.ts`

```typescript
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

```


## 📄 `src/app/api/auth/2fa/verify/route.ts`

```typescript
// src/app/api/auth/2fa/verify/route.ts
// POST /api/auth/2fa/verify
// بعد أن يمسح الأدمن رمز QR من /setup، يُدخل الكود الظاهر في تطبيقه هنا للتأكيد
// إذا كان صحيحاً، نُفعّل twoFactorEnabled = true فعلياً (من الآن فصاعداً، سيُطلب الكود عند كل دخول)

import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
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
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { status: "error", message: "يجب إدخال الكود" },
        { status: 400 }
      );
    }

    const user = await User.findById(admin.userId).select("+twoFactorSecret");
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { status: "error", message: "يجب إعداد 2FA أولاً عبر /setup" },
        { status: 400 }
      );
    }

    const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
    if (!isValid) {
      return NextResponse.json(
        { status: "error", message: "الكود غير صحيح - تأكد من الوقت الصحيح على جهازك" },
        { status: 401 }
      );
    }

    user.twoFactorEnabled = true;
    await user.save();

    return NextResponse.json({
      status: "success",
      message: "تم تفعيل المصادقة الثنائية بنجاح! سيُطلب منك الكود في كل مرة تسجّل فيها الدخول",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/auth/2fa/disable/route.ts`

```typescript
// src/app/api/auth/2fa/disable/route.ts
// POST /api/auth/2fa/disable
// يعطّل 2FA - نطلب كلمة المرور الحالية للتأكيد (حتى لا يستطيع أي شخص وصل للجهاز مفتوحاً تعطيلها بسهولة)

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    const { password } = await req.json();

    const user = await User.findById(admin.userId);
    if (!user) {
      return NextResponse.json({ status: "error", message: "المستخدم غير موجود" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(password || "", user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { status: "error", message: "كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = undefined;
    await user.save();

    return NextResponse.json({ status: "success", message: "تم تعطيل المصادقة الثنائية" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/categories/route.ts`

```typescript
// src/app/api/categories/route.ts
// GET  /api/categories  → يعيد كل الأقسام (متاح للجميع، بدون تسجيل دخول)
// POST /api/categories  → يضيف قسماً جديداً (أدمن فقط) - يُستخدم من لوحة التحكم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { getCached, setCached, getCacheVersion, bumpCacheVersion } from "@/lib/redis";

export async function GET() {
  try {
    // الأقسام تتغيّر نادراً جداً مقارنة بالمنتجات، فنخزّنها لمدة أطول (5 دقائق)
    const version = await getCacheVersion("categories");
    const cacheKey = `categories:v${version}`;

    const cached = await getCached<any>(cacheKey);
    if (cached) return NextResponse.json(cached);

    await connectDB();
    // ترتيب الأقسام من الأحدث إلى الأقدم
    const categories = await Category.find().sort({ createdAt: -1 });

    const responseBody = { status: "success", categories };
    await setCached(cacheKey, responseBody, 300);

    return NextResponse.json(responseBody);
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // فقط الأدمن يمكنه إضافة قسم جديد
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // التأكد أن الـ slug غير مستخدم من قبل
    const existing = await Category.findOne({ slug: parsed.data.slug });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "يوجد قسم آخر بنفس الـ slug" },
        { status: 409 }
      );
    }

    const category = await Category.create(parsed.data);
    await bumpCacheVersion("categories");

    return NextResponse.json(
      { status: "success", message: "تم إنشاء القسم بنجاح", category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/categories/[id]/route.ts`

```typescript
// src/app/api/categories/[id]/route.ts
// GET    /api/categories/:id  → عرض قسم واحد بالتفصيل
// PUT    /api/categories/:id  → تعديل قسم (أدمن فقط)
// DELETE /api/categories/:id  → حذف قسم (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/lib/validation";
import { bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }
    return NextResponse.json({ status: "success", category });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    // نسمح بتعديل جزئي (partial) - المستخدم قد يرسل حقلاً واحداً فقط
    const parsed = categorySchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("categories");

    return NextResponse.json({ status: "success", message: "تم تعديل القسم بنجاح", category });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ status: "error", message: "القسم غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("categories");

    return NextResponse.json({ status: "success", message: "تم حذف القسم بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/products/route.ts`

```typescript
// src/app/api/products/route.ts
// GET  /api/products  → عرض المنتجات مع دعم البحث والفلاتر والترقيم
//   أمثلة على الاستخدام:
//   /api/products?page=1&limit=12
//   /api/products?category=<categoryId>
//   /api/products?minPrice=100&maxPrice=500
//   /api/products?search=حقيبة
//   /api/products?color=أسود&size=M
//   /api/products?sort=price_asc  (أو price_desc أو newest)
//
// POST /api/products → إضافة منتج جديد (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { escapeRegex } from "@/lib/sanitize";
import { getCached, setCached, getCacheVersion, bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // مفتاح الكاش يشمل كل معايير البحث/الفلترة + رقم الإصدار الحالي
    // بهذا، كل تركيبة فلاتر مختلفة (سعر/قسم/بحث..) لها كاش منفصل تلقائياً
    const version = await getCacheVersion("products");
    const cacheKey = `products:v${version}:${searchParams.toString()}`;

    const cached = await getCached<any>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, _cached: true });
    }

    await connectDB();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const color = searchParams.get("color");
    const size = searchParams.get("size");
    const minRating = searchParams.get("minRating");
    const sort = searchParams.get("sort") || "newest";

    // نبني "فلتر" mongoose تدريجياً حسب ما أُرسل من معايير
    const filter: any = {};

    if (category) filter.categoryId = category;
    if (color) filter.colors = color;
    if (size) filter.sizes = size;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      // نهرّب الأحرف الخاصة أولاً لمنع هجمات ReDoS، ثم نبحث في اسم المنتج بالعربية أو الإنجليزية
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { "name.ar": { $regex: safeSearch, $options: "i" } },
        { "name.en": { $regex: safeSearch, $options: "i" } },
      ];
    }

    // ترتيب النتائج
    let sortOption: any = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    let products = await Product.find(filter)
      .populate("categoryId", "name slug") // نجلب اسم القسم بدلاً من الـ id فقط
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    // فلترة التقييم الأدنى (نحسبها بعد الجلب لأنها متوسط وليست حقلاً مباشراً)
    if (minRating) {
      const minRatingNum = Number(minRating);
      products = products.filter((p) => {
        if (p.ratings.length === 0) return false;
        const avg = p.ratings.reduce((sum, r) => sum + r.rating, 0) / p.ratings.length;
        return avg >= minRatingNum;
      });
    }

    const total = await Product.countDocuments(filter);

    const responseBody = {
      status: "success",
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // نخزّن النتيجة لمدة 60 ثانية فقط - وقت كافٍ لتخفيف الضغط، وقصير كفاية حتى لا تظهر بيانات قديمة طويلاً
    await setCached(cacheKey, responseBody, 60);

    return NextResponse.json(responseBody);
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.create({ ...parsed.data, ratings: [] });

    // نلغي كل كاش المنتجات القديم فوراً - وإلا سيرى العملاء بيانات قديمة لا تشمل هذا المنتج الجديد لمدة دقيقة
    await bumpCacheVersion("products");

    return NextResponse.json(
      { status: "success", message: "تم إضافة المنتج بنجاح", product },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/products/[id]/route.ts`

```typescript
// src/app/api/products/[id]/route.ts
// GET    /api/products/:id  → تفاصيل منتج واحد + منتجات مشابهة (توصيات بسيطة)
// PUT    /api/products/:id  → تعديل منتج (أدمن فقط)
// DELETE /api/products/:id  → حذف منتج (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { bumpCacheVersion } from "@/lib/redis";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id).populate("categoryId", "name slug");

    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    // توصيات بسيطة: منتجات أخرى من نفس القسم (باستثناء المنتج الحالي)، أحدث 4 منتجات
    const recommendations = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
    })
      .limit(4)
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: "success", product, recommendations });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = productSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("products"); // نلغي الكاش القديم حتى لا تظهر البيانات القديمة للعملاء

    return NextResponse.json({ status: "success", message: "تم تعديل المنتج بنجاح", product });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    await bumpCacheVersion("products");

    return NextResponse.json({ status: "success", message: "تم حذف المنتج بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/products/[id]/reviews/route.ts`

```typescript
// src/app/api/products/[id]/reviews/route.ts
// POST /api/products/:id/reviews
// يضيف تقييماً (نجوم + تعليق + صور اختيارية) على منتج معين
// يتطلب تسجيل الدخول (أي عميل مسجل يمكنه التقييم)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/auth";
import { ratingSchema } from "@/lib/validation";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لإضافة تقييم" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = ratingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ status: "error", message: "المنتج غير موجود" }, { status: 404 });
    }

    product.ratings.push({
      userId: currentUser.userId as any,
      rating: parsed.data.rating,
      comment: parsed.data.comment || "",
      images: parsed.data.images || [],
      createdAt: new Date(),
    });

    await product.save();

    return NextResponse.json(
      { status: "success", message: "تم إضافة تقييمك بنجاح", ratings: product.ratings },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/cart/route.ts`

```typescript
// src/app/api/cart/route.ts
// GET   /api/cart  → عرض سلة المستخدم الحالي (مع تفاصيل كل منتج)
// POST  /api/cart  → إضافة منتج للسلة (أو زيادة كميته إذا كان موجوداً بالفعل)
// PUT   /api/cart  → تحديث كمية منتج معين في السلة
// DELETE /api/cart?productId=xxx → حذف منتج من السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getCurrentUser } from "@/lib/auth";
import { cartItemSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لعرض السلة" },
        { status: 401 }
      );
    }

    await connectDB();
    let cart = await Cart.findOne({ userId: currentUser.userId }).populate(
      "items.productId",
      "name price discountPrice images stock"
    );

    // إذا لم يكن للمستخدم سلة بعد، ننشئ له واحدة فارغة تلقائياً
    if (!cart) {
      cart = await Cart.create({ userId: currentUser.userId, items: [] });
    }

    return NextResponse.json({ status: "success", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لإضافة منتج للسلة" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, quantity } = parsed.data;

    let cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      cart = new Cart({ userId: currentUser.userId, items: [] });
    }

    // إذا كان المنتج موجوداً بالفعل في السلة، نزيد كميته بدلاً من تكراره
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }

    await cart.save();
    await cart.populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تمت إضافة المنتج للسلة", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, quantity } = parsed.data;

    const cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      return NextResponse.json({ status: "error", message: "السلة غير موجودة" }, { status: 404 });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return NextResponse.json(
        { status: "error", message: "هذا المنتج غير موجود في السلة" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم تحديث الكمية", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "يجب تحديد productId" },
        { status: 400 }
      );
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      return NextResponse.json({ status: "error", message: "السلة غير موجودة" }, { status: 404 });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    return NextResponse.json({ status: "success", message: "تم حذف المنتج من السلة", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/cart/coupon/route.ts`

```typescript
// src/app/api/cart/coupon/route.ts
// POST /api/cart/coupon → يحفظ كود الكوبون داخل سلة المستخدم بعد التأكد من صلاحيته
// DELETE /api/cart/coupon → يزيل الكوبون المُطبّق من السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { status: "error", message: "يجب إدخال كود الكوبون" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return NextResponse.json(
        { status: "error", message: "كود الكوبون غير صحيح" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate || coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { status: "error", message: "هذا الكوبون غير صالح للاستخدام حالياً" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: currentUser.userId },
      { couponCode: coupon.code },
      { new: true, upsert: true }
    ).populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم تطبيق الكوبون بنجاح", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const cart = await Cart.findOneAndUpdate(
      { userId: currentUser.userId },
      { $unset: { couponCode: "" } },
      { new: true }
    ).populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم إلغاء الكوبون", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/coupons/route.ts`

```typescript
// src/app/api/coupons/route.ts
// GET  /api/coupons  → عرض كل الكوبونات (أدمن فقط - يُستخدم في لوحة التحكم)
// POST /api/coupons  → إنشاء كوبون جديد (أدمن فقط)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { requireAdmin } from "@/lib/auth";
import { couponSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ status: "success", coupons });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = couponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await Coupon.findOne({ code: parsed.data.code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "يوجد كوبون آخر بنفس الكود" },
        { status: 409 }
      );
    }

    const coupon = await Coupon.create({
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    });

    return NextResponse.json(
      { status: "success", message: "تم إنشاء الكوبون بنجاح", coupon },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/coupons/validate/route.ts`

```typescript
// src/app/api/coupons/validate/route.ts
// POST /api/coupons/validate
// يتحقق هل الكوبون صالح للاستخدام الآن (تاريخ ساري + لم يتجاوز حد الاستخدام)
// يستخدمه العميل عند كتابة كود الخصم في صفحة السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/models/Coupon";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { status: "error", message: "يجب إدخال كود الكوبون" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json(
        { status: "error", message: "كود الكوبون غير صحيح" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json(
        { status: "error", message: "هذا الكوبون منتهي الصلاحية أو لم يبدأ بعد" },
        { status: 400 }
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { status: "error", message: "تم استنفاد عدد مرات استخدام هذا الكوبون" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "الكوبون صالح للاستخدام",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/orders/route.ts`

```typescript
// src/app/api/orders/route.ts
// POST /api/orders → يحوّل محتوى السلة الحالية إلى "طلب" حقيقي (Checkout)
// GET  /api/orders → يعرض كل طلبات المستخدم الحالي (أو كل الطلبات إذا كان أدمن)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validation";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لإتمام الطلب" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { shippingAddress, paymentMethod } = parsed.data;

    // 1. جلب سلة المستخدم
    const cart = await Cart.findOne({ userId: currentUser.userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { status: "error", message: "السلة فارغة، لا يمكن إتمام الطلب" },
        { status: 400 }
      );
    }

    // 2. التأكد من توفر الكمية المطلوبة لكل منتج في المخزون
    for (const item of cart.items) {
      const product = item.productId as any;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            status: "error",
            message: `الكمية المتوفرة من "${product.name.ar}" غير كافية (متبقي ${product.stock} فقط)`,
          },
          { status: 400 }
        );
      }
    }

    // 3. حساب الإجمالي بناءً على السعر الحالي للمنتجات (وليس أي سعر قديم مخزّن)
    let total = 0;
    const orderItems = cart.items.map((item) => {
      const product = item.productId as any;
      const priceToUse = product.discountPrice || product.price;
      total += priceToUse * item.quantity;
      return {
        productId: product._id,
        quantity: item.quantity,
        price: priceToUse,
      };
    });

    // 4. تطبيق الكوبون إن وُجد
    let discount = 0;
    if (cart.couponCode) {
      const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase() });
      if (coupon) {
        discount =
          coupon.discountType === "percentage"
            ? (total * coupon.value) / 100
            : coupon.value;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 5. إنشاء الطلب
    const order = await Order.create({
      userId: currentUser.userId,
      items: orderItems,
      total: total - discount,
      discount,
      coupon: cart.couponCode,
      status: "pending",
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending", // الدفع الإلكتروني الفعلي يُضاف في مرحلة الدفع
      trackingNumber: `LB-${Date.now()}`, // رقم تتبع مبدئي بسيط
    });

    // 6. خصم الكميات من المخزون
    for (const item of cart.items) {
      const product = item.productId as any;
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // 7. تفريغ السلة بعد إتمام الطلب بنجاح
    cart.items = [];
    cart.couponCode = undefined;
    await cart.save();

    // 8. إرسال بريد تأكيد الطلب - لا نجعل فشل الإرسال يفشل عملية الطلب نفسها
    try {
      const buyer = await User.findById(currentUser.userId);
      if (buyer) {
        await sendOrderConfirmationEmail(buyer.email, buyer.name, order.trackingNumber!, order.total);
      }
    } catch (emailError) {
      console.error("⚠️ تعذّر إرسال بريد تأكيد الطلب، لكن الطلب نفسه تم بنجاح:", emailError);
    }

    return NextResponse.json(
      { status: "success", message: "تم إنشاء الطلب بنجاح", order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();

    // الأدمن يرى كل الطلبات، أما العميل فيرى طلباته فقط
    const filter = currentUser.role === "admin" ? {} : { userId: currentUser.userId };

    const orders = await Order.find(filter)
      .populate("items.productId", "name images")
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: "success", orders });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/orders/[id]/route.ts`

```typescript
// src/app/api/orders/[id]/route.ts
// GET /api/orders/:id → تفاصيل طلب واحد (العميل صاحب الطلب أو الأدمن فقط)
// PUT /api/orders/:id → تحديث حالة الطلب (أدمن فقط) - يُستخدم لتحديث الشحن لحظة بلحظة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    await connectDB();
    const order = await Order.findById(id).populate("items.productId", "name images");

    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    // العميل يمكنه رؤية طلبه فقط، الأدمن يرى أي طلب
    if (currentUser.role !== "admin" && order.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك برؤية هذا الطلب" },
        { status: 403 }
      );
    }

    return NextResponse.json({ status: "success", order });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { status, paymentStatus, trackingNumber } = body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { status: "error", message: "حالة الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "تم تحديث الطلب بنجاح", order });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/wishlist/route.ts`

```typescript
// src/app/api/wishlist/route.ts
// GET    /api/wishlist → عرض قائمة أمنيات المستخدم الحالي (مع تفاصيل كل منتج)
// POST   /api/wishlist → إضافة منتج لقائمة الأمنيات
// DELETE /api/wishlist?productId=xxx → إزالة منتج من القائمة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const user = await User.findById(currentUser.userId).populate(
      "wishlist",
      "name price discountPrice images stock ratings"
    );

    return NextResponse.json({ status: "success", wishlist: user?.wishlist || [] });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "يجب تحديد productId" },
        { status: 400 }
      );
    }

    // $addToSet يمنع تكرار نفس المنتج مرتين في القائمة
    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { wishlist: productId },
    });

    return NextResponse.json({ status: "success", message: "تمت الإضافة لقائمة الأمنيات" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "يجب تحديد productId" },
        { status: 400 }
      );
    }

    await connectDB();
    await User.findByIdAndUpdate(currentUser.userId, {
      $pull: { wishlist: productId },
    });

    return NextResponse.json({ status: "success", message: "تمت الإزالة من قائمة الأمنيات" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/chat/route.ts`

```typescript
// src/app/api/chat/route.ts
// GET /api/chat
// يعيد قائمة بكل "الغرف" (المحادثات) التي فيها رسائل، مع آخر رسالة في كل واحدة
// أدمن فقط - يُستخدم في صفحة /admin/chats لعرض قائمة العملاء الذين راسلوا الدعم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();

    // نجمّع الرسائل حسب roomId، ونأخذ آخر رسالة وتاريخها في كل غرفة
    const rooms = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$message" },
          lastMessageAt: { $first: "$createdAt" },
          lastSenderRole: { $first: "$senderRole" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // roomId في تصميمنا = userId الخاص بالعميل، فنجلب اسمه لعرضه بدلاً من الرقم المجرّد
    const roomsWithNames = await Promise.all(
      rooms.map(async (room) => {
        const customer = await User.findById(room._id).select("name email");
        return {
          roomId: room._id,
          customerName: customer?.name || "عميل محذوف",
          customerEmail: customer?.email || "",
          lastMessage: room.lastMessage,
          lastMessageAt: room.lastMessageAt,
          lastSenderRole: room.lastSenderRole,
        };
      })
    );

    return NextResponse.json({ status: "success", rooms: roomsWithNames });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/chat/[roomId]/route.ts`

```typescript
// src/app/api/chat/[roomId]/route.ts
// GET  /api/chat/:roomId → يعيد سجل المحادثة الكامل لهذه الغرفة (لعرضه عند فتح الدردشة)
// POST /api/chat/:roomId → يحفظ رسالة جديدة في قاعدة البيانات
//
// ملاحظة: البث اللحظي (Real-time) للرسائل يتم عبر Socket.io في server.js
// أما هذا الـ API فهو للحفظ الدائم في قاعدة البيانات وعرض السجل القديم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const messages = await ChatMessage.find({ roomId }).sort({ createdAt: 1 });

    return NextResponse.json({ status: "success", messages });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
  try {
    const { roomId } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json(
        { status: "error", message: "لا يمكن إرسال رسالة فارغة" },
        { status: 400 }
      );
    }

    const chatMessage = await ChatMessage.create({
      roomId,
      senderId: currentUser.userId,
      senderRole: currentUser.role,
      message: message.trim(),
    });

    return NextResponse.json({ status: "success", chatMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/upload/route.ts`

```typescript
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

```


## 📄 `src/app/api/payment/stripe/route.ts`

```typescript
// src/app/api/payment/stripe/route.ts
// POST /api/payment/stripe
// ينشئ "جلسة دفع" (Checkout Session) على Stripe لطلب موجود بالفعل
// يعيد رابط صفحة الدفع الخاصة بـ Stripe ليتم توجيه العميل إليها

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    if (order.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك بدفع هذا الطلب" },
        { status: 403 }
      );
    }

    // ننشئ جلسة دفع بقيمة الطلب الإجمالية (Stripe يتعامل بالسنت، لذلك نضرب × 100)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // غيّرها لعملتك المحلية إن كانت مدعومة من Stripe
            product_data: { name: `طلب leadybag رقم ${order.trackingNumber}` },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order._id.toString() }, // نحتاجها لاحقاً في الـ webhook لمعرفة أي طلب تم دفعه
      success_url: `${process.env.NEXTAUTH_URL}/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=true`,
    });

    return NextResponse.json({ status: "success", checkoutUrl: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "فشل إنشاء جلسة الدفع", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/payment/paymob/route.ts`

```typescript
// src/app/api/payment/paymob/route.ts
// POST /api/payment/paymob
// PayMob بوابة دفع عربية شهيرة (تدعم بطاقات فيزا/ماستركارد ومحافظ إلكترونية)
// آلية عملها تختلف عن Stripe: تحتاج 3 خطوات متتالية (طلب توكن → تسجيل الطلب → طلب رابط الدفع)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "إعدادات PayMob غير مكتملة - أضف PAYMOB_API_KEY و PAYMOB_INTEGRATION_ID و PAYMOB_IFRAME_ID في .env.local",
        },
        { status: 500 }
      );
    }

    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    // الخطوة 1: الحصول على توكن مصادقة من PayMob
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
    });
    const authData = await authRes.json();
    const authToken = authData.token;

    // الخطوة 2: تسجيل تفاصيل الطلب لدى PayMob (المبلغ بالقروش/السنت)
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(order.total * 100),
        currency: "EGP", // غيّرها حسب عملتك
        items: [],
      }),
    });
    const orderData = await orderRes.json();

    // الخطوة 3: طلب "مفتاح دفع" (payment_key) خاص بهذا الطلب لعرض صفحة الدفع
    const paymentKeyRes = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: Math.round(order.total * 100),
          expiration: 3600,
          order_id: orderData.id,
          billing_data: {
            apartment: "NA",
            email: "customer@leadybag.com",
            floor: "NA",
            first_name: "عميل",
            street: "NA",
            building: "NA",
            phone_number: "01000000000",
            city: "Khartoum",
            country: "SD",
            last_name: "leadybag",
            state: "NA",
          },
          currency: "EGP",
          integration_id: PAYMOB_INTEGRATION_ID,
        }),
      }
    );
    const paymentKeyData = await paymentKeyRes.json();

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKeyData.token}`;

    return NextResponse.json({ status: "success", checkoutUrl: iframeUrl });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "فشل إنشاء جلسة الدفع عبر PayMob", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/payment/webhook/route.ts`

```typescript
// src/app/api/payment/webhook/route.ts
// POST /api/payment/webhook
// هذا الرابط لا يستدعيه المستخدم أبداً - بل Stripe نفسه يستدعيه تلقائياً
// عندما يكتمل الدفع بنجاح، ليخبرنا "هذا الطلب تم دفعه فعلياً"
// نستخدم هذا بدلاً من الثقة في المتصفح، لأن المتصفح يمكن التلاعب به، أما Stripe فموثوق

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event;
    try {
      // نتأكد أن هذا الطلب فعلاً من Stripe وليس مزوّراً من أي شخص آخر
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { status: "error", message: `خطأ في توقيع الـ Webhook: ${err.message}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata.orderId;

      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "processing",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```


## 📄 `src/app/api/analytics/route.ts`

```typescript
// src/app/api/analytics/route.ts
// GET /api/analytics → إحصائيات شاملة (أدمن فقط): إيرادات، أكثر المنتجات مبيعاً، رسم بياني للمبيعات اليومية

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();

    // 1. إجمالي الإيرادات وعدد الطلبات (فقط الطلبات المدفوعة تُحسب كإيراد فعلي)
    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = await Order.countDocuments();

    // 2. عدد المنتجات وتنبيهات نفاد المخزون (أقل من 5 قطع = تنبيه)
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select(
      "name stock"
    );

    // 3. أكثر 5 منتجات مبيعاً (نحسبها من عناصر كل الطلبات)
    const allOrders = await Order.find().populate("items.productId", "name");
    const salesCount: Record<string, { name: string; count: number }> = {};

    for (const order of allOrders) {
      for (const item of order.items) {
        const product = item.productId as any;
        if (!product) continue;
        const id = product._id.toString();
        if (!salesCount[id]) {
          salesCount[id] = { name: product.name?.ar || "منتج محذوف", count: 0 };
        }
        salesCount[id].count += item.quantity;
      }
    }

    const topProducts = Object.values(salesCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. المبيعات اليومية لآخر 7 أيام (لرسم بياني بسيط)
    const last7Days: { date: string; sales: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = await Order.find({
        createdAt: { $gte: day, $lt: nextDay },
        paymentStatus: "paid",
      });

      last7Days.push({
        date: day.toISOString().split("T")[0],
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    return NextResponse.json({
      status: "success",
      analytics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockProducts,
        topProducts,
        last7Days,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

```
