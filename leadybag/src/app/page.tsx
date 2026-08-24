// src/app/page.tsx
// هذه الصفحة الرئيسية المؤقتة - فقط للتأكد أن المشروع يعمل
// سنستبدلها بالصفحة الرئيسية الحقيقية (بانر، أقسام، منتجات) في المرحلة 4

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold text-primary">🎉 مشروع leadybag يعمل بنجاح</h1>
      <p className="text-secondary">
        هذه صفحة اختبار مؤقتة للمرحلة 1. اذهب إلى{" "}
        <a href="/api/health" className="underline text-primary">
          /api/health
        </a>{" "}
        للتأكد من اتصال قاعدة البيانات.
      </p>
    </main>
  );
}
