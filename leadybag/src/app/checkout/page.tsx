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
