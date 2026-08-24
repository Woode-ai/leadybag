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
