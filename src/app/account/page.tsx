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
