// src/components/ProductForm.tsx
// نموذج كامل لإضافة أو تعديل منتج - يُستخدم في صفحتي:
// /admin/products/new  و  /admin/products/[id]/edit
// نمرر له initialData عند التعديل، أو نتركه فارغاً عند الإضافة

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import ImageUploader from "@/components/ImageUploader";
import { X } from "lucide-react";

interface Category {
  _id: string;
  name: { ar: string; en: string };
}

interface ProductFormProps {
  productId?: string; // إن وُجد، فهذا تعديل وليس إضافة
  initialData?: any;
}

export default function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  const [nameAr, setNameAr] = useState(initialData?.name?.ar || "");
  const [nameEn, setNameEn] = useState(initialData?.name?.en || "");
  const [descAr, setDescAr] = useState(initialData?.description?.ar || "");
  const [descEn, setDescEn] = useState(initialData?.description?.en || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice?.toString() || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId?._id || initialData?.categoryId || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [colors, setColors] = useState(initialData?.colors?.join(", ") || "");
  const [sizes, setSizes] = useState(initialData?.sizes?.join(", ") || "");
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient("/categories")
      .then((data) => setCategories(data.categories))
      .catch(console.error);
  }, []);

  function addImage(url: string) {
    setImages((prev) => [...prev, url]);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      name: { ar: nameAr, en: nameEn },
      description: { ar: descAr, en: descEn },
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      categoryId,
      stock: Number(stock),
      colors: colors ? colors.split(",").map((c: string) => c.trim()).filter(Boolean) : [],
      sizes: sizes ? sizes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      images,
    };

    try {
      if (productId) {
        await apiClient(`/products/${productId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الاسم بالعربية</label>
          <input
            required
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الاسم بالإنجليزية</label>
          <input
            required
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الوصف بالعربية</label>
          <textarea
            required
            value={descAr}
            onChange={(e) => setDescAr(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الوصف بالإنجليزية</label>
          <textarea
            required
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
            rows={3}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">السعر</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            سعر الخصم (اختياري)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">الكمية بالمخزون</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1">القسم</label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm"
        >
          <option value="">-- اختر قسماً --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name.ar}
            </option>
          ))}
        </select>
        {categories.length === 0 && (
          <p className="text-xs text-yellow-600 mt-1">
            لا توجد أقسام بعد - أضف قسماً أولاً من صفحة الأقسام
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            الألوان (افصل بينها بفاصلة)
          </label>
          <input
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="أسود, بني, أحمر"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">
            المقاسات (افصل بينها بفاصلة)
          </label>
          <input
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="S, M, L"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-2">صور المنتج</label>
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-0.5 end-0.5 bg-black/60 text-white rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <ImageUploader onUploaded={addImage} label="أضف صورة جديدة" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm disabled:opacity-50"
      >
        {saving ? "جاري الحفظ..." : productId ? "حفظ التعديلات" : "إضافة المنتج"}
      </button>
    </form>
  );
}
