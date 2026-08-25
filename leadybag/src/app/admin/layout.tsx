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
