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
