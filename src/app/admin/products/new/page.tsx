// src/app/admin/products/new/page.tsx
"use client";

import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-secondary mb-6">إضافة منتج جديد</h1>
      <ProductForm />
    </div>
  );
}
