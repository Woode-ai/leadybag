// src/components/Footer.tsx
"use client";

import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { lang } = useApp();

  return (
    <footer className="border-t border-gray-200 bg-secondary text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm">
        <p className="font-bold text-lg mb-2 text-primary">leadybag</p>
        <p className="text-gray-300">
          {lang === "ar"
            ? "متجر إلكتروني سوداني عصري لكل ما تحتاجه المرأة"
            : "A modern Sudanese online store for everything a woman needs"}
        </p>
        <p className="text-gray-400 mt-4">
          © {new Date().getFullYear()} leadybag. {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}
