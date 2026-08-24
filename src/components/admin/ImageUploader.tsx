// src/components/admin/ImageUploader.tsx
// مكون لرفع صورة واحدة أو أكثر، ويعيد روابط الصور النهائية بعد الرفع
// يُستخدم في صفحة إضافة/تعديل الأقسام والمنتجات

"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  images: string[]; // الصور المرفوعة حالياً (روابط)
  onChange: (images: string[]) => void;
  multiple?: boolean; // true للمنتجات (عدة صور)، false للأقسام (صورة واحدة)
}

export default function ImageUploader({ images, onChange, multiple = true }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const uploadedUrls: string[] = [];

      // نرفع كل صورة على حدة (Cloudinary لا يدعم رفع عدة ملفات في طلب واحد بسهولة)
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "فشل رفع الصورة");
        uploadedUrls.push(data.url);
      }

      onChange(multiple ? [...images, ...uploadedUrls] : uploadedUrls);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // نفرّغ حقل الملف حتى يمكن رفع نفس الصورة مرة أخرى إن احتاج المستخدم
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
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

        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary text-gray-400 hover:text-primary">
          {uploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
