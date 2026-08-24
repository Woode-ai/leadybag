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
