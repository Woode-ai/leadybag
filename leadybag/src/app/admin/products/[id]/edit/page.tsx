// src/app/admin/products/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) return <p className="text-gray-400">جاري التحميل...</p>;
  if (!product) return <p className="text-gray-400">المنتج غير موجود</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">تعديل المنتج</h1>
      <ProductForm productId={product._id} initialData={product} />
    </div>
  );
}
