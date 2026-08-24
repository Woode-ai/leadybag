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
