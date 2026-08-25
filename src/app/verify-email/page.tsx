// src/app/verify-email/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { refreshUser } = useApp();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus("error");
        setMessage("رابط التفعيل غير صحيح");
        return;
      }
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setStatus("success");
        setMessage(data.message);
        // إن كان المستخدم مسجّلاً دخوله بالفعل في هذا المتصفح، نحدّث حالته فوراً حتى يختفي تنبيه "لم يُفعَّل بعد"
        await refreshUser();
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message);
      }
    }
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <main className="max-w-md mx-auto px-4 py-24 text-center">
      {status === "loading" && (
        <>
          <Loader2 className="mx-auto animate-spin text-primary mb-4" size={48} />
          <p className="text-gray-500">جاري التحقق من رابط التفعيل...</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
          <h1 className="text-xl font-bold text-secondary mb-2">تم تفعيل بريدك بنجاح!</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/account" className="bg-primary text-white px-6 py-2 rounded-full inline-block">
            الذهاب لحسابي
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="mx-auto text-red-500 mb-4" size={56} />
          <h1 className="text-xl font-bold text-secondary mb-2">تعذّر التفعيل</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <Link href="/account" className="bg-primary text-white px-6 py-2 rounded-full inline-block">
            الذهاب لحسابي لطلب رابط جديد
          </Link>
        </>
      )}
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-24">...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
