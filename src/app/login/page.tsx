// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";

export default function LoginPage() {
  const { t, login } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiClient("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, twoFactorCode: twoFactorCode || undefined }),
      });

      // إذا كان الحساب مفعّلاً عليه 2FA ولم نرسل الكود بعد، نظهر حقل إدخال الكود
      if (data.status === "2fa_required") {
        setNeedsTwoFactor(true);
        setLoading(false);
        return;
      }

      login(data.token, data.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-secondary mb-6 text-center">{t("login")}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("email")}</label>
          <input
            type="email"
            required
            disabled={needsTwoFactor}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary mb-1">{t("password")}</label>
          <input
            type="password"
            required
            disabled={needsTwoFactor}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-100"
          />
        </div>

        {needsTwoFactor && (
          <div>
            <label className="block text-sm font-medium text-secondary mb-1">
              كود المصادقة الثنائية (من تطبيق المصادقة)
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
              placeholder="123456"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? t("loading") : needsTwoFactor ? "تأكيد الدخول" : t("login")}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        {t("dontHaveAccount")}{" "}
        <Link href="/register" className="text-primary font-medium">
          {t("register")}
        </Link>
      </p>
    </main>
  );
}
