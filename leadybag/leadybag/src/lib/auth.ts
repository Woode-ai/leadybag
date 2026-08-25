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
