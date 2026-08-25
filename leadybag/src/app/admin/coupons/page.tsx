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
