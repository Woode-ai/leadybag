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
