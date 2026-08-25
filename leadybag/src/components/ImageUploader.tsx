// src/components/ImageUploader.tsx
// مكون بسيط لرفع صورة: يعرض الصورة الحالية (إن وجدت)، ويسمح باختيار ملف جديد ورفعه
// بعد الرفع بنجاح، يستدعي onUploaded(url) ليضع الرابط في النموذج الذي يستخدمه

"use client";

import { useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  currentUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ currentUrl, onUploaded, label }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentUrl || "");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // لا نضع Content-Type يدوياً - المتصفح يحددها تلقائياً مع FormData
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setPreview(data.url);
      onUploaded(data.url);
    } catch (err: any) {
      setError(err.message || "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-secondary mb-1">{label}</label>}

      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg border border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : (
            <UploadCloud className="text-gray-300" size={24} />
          )}
        </div>

        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-sm text-secondary px-4 py-2 rounded-lg flex items-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={16} /> جاري الرفع...
            </>
          ) : (
            "اختر صورة"
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
