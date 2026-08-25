"use client";

import { useState, useEffect, DragEvent } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Image as ImageIcon } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    price: "",
    discountPrice: "",
    categoryId: "",
    stock: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []));
  }, []);

  // معالجة رفع الصور
  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setImages((prev) => [...prev, ...result.urls]);
      } else {
        alert(result.error || "فشل رفع الصور");
      }
    } catch (err) {
      alert("حدث خطأ أثناء الاتصال بسيرفر الرفع");
    } finally {
      setUploading(false);
    }
  };

  // أحداث السحب والإفلات (Drag and Drop)
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("يرجى إدراج صورة واحدة على الأقل للمنتج");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          discountPrice: Number(formData.discountPrice) || 0,
          stock: Number(formData.stock) || 0,
          images,
        }),
      });

      if (res.ok) {
        alert("تم إضافة المنتج مع الصورة بنجاح!");
        router.push("/");
      } else {
        alert("حدث خطأ أثناء الإضافة");
      }
    } catch (err) {
      alert("فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl border my-8 shadow-sm">
      <h2 className="text-xl font-bold mb-6 text-gray-800">إضافة منتج جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج (بالعربي)</label>
          <input
            type="text"
            required
            value={formData.nameAr}
            onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            className="w-full border p-2.5 rounded-lg text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ج.س)</label>
            <input
              type="number"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border p-2.5 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">السعر بعد الخصم (اختياري)</label>
            <input
              type="number"
              value={formData.discountPrice}
              onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
              className="w-full border p-2.5 rounded-lg text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full border p-2.5 rounded-lg text-sm"
          >
            <option value="">اختر القسم...</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat._id}>{cat.name.ar}</option>
            ))}
          </select>
        </div>

        {/* حقل رفع الصور بأسلوب Drag and Drop */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">صور المنتج</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-pink-400"
            }`}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              id="fileInput"
              className="hidden"
              onChange={(e) => e.target.files && handleFilesUpload(e.target.files)}
            />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-10 h-10 text-pink-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">اسحبي الصور وأسقطيها هنا، أو اضغطي للاختيار</p>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (حد أقصى 5MB لكل صورة)</span>
            </label>
          </div>

          {/* معاينة الصور المرفوعة */}
          {uploading && <p className="text-xs text-pink-600 mt-2 font-medium">جاري رفع الصور...</p>}

          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border">
                  <img src={url} alt="معاينة" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition disabled:opacity-50"
        >
          {loading ? "جاري الحفظ..." : "حفظ المنتج"}
        </button>
      </form>
    </div>
  );
}