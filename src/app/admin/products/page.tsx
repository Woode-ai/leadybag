// src/app/admin/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/apiClient";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await apiClient("/products?limit=100");
      setProducts(data.products);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      await apiClient(`/products/${id}`, { method: "DELETE" });
      await loadProducts();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
        >
          <Plus size={16} /> منتج جديد
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">جاري التحميل...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-400">لا توجد منتجات بعد</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-3 text-start">الصورة</th>
                <th className="p-3 text-start">الاسم</th>
                <th className="p-3 text-start">السعر</th>
                <th className="p-3 text-start">المخزون</th>
                <th className="p-3 text-start">القسم</th>
                <th className="p-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t border-gray-100">
                  <td className="p-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  </td>
                  <td className="p-3">{p.name.ar}</td>
                  <td className="p-3">
                    {p.discountPrice ? (
                      <>
                        <span className="text-primary font-medium">{p.discountPrice}</span>{" "}
                        <span className="text-gray-400 line-through text-xs">{p.price}</span>
                      </>
                    ) : (
                      p.price
                    )}
                  </td>
                  <td className="p-3">
                    <span className={p.stock < 5 ? "text-red-500" : ""}>{p.stock}</span>
                  </td>
                  <td className="p-3 text-gray-400">{p.categoryId?.name?.ar || "-"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${p._id}/edit`}
                        className="text-gray-400 hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
