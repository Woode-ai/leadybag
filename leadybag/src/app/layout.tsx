// src/app/layout.tsx
// هذا الملف "يلف" كل صفحات الموقع - أي شيء تضعه هنا يظهر في كل صفحة
// حالياً بسيط جداً، سنضيف له الهيدر والفوتر في المرحلة 4 (الواجهات الأمامية)

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "leadybag",
  description: "متجر leadybag - كل ما تحتاجه المرأة السودانية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
