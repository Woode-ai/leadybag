// src/app/admin/security/page.tsx
"use client";

import { useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function AdminSecurityPage() {
  const [step, setStep] = useState<"idle" | "setup" | "done">("idle");
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function startSetup() {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient("/auth/2fa/setup", { method: "POST" });
      setQrCode(data.qrCodeDataUrl);
      setSecret(data.secret);
      setStep("setup");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function confirmSetup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setMessage("تم تفعيل المصادقة الثنائية بنجاح! سيُطلب منك الكود في كل تسجيل دخول قادم");
      setStep("done");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function disable2FA(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient("/auth/2fa/disable", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setMessage("تم تعطيل المصادقة الثنائية");
      setStep("idle");
      setPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-secondary mb-6">الأمان</h1>

      <div className="border border-gray-200 rounded-xl p-5">
        <h2 className="font-medium text-secondary mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-600" />
          المصادقة الثنائية (2FA)
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          طبقة حماية إضافية: بعد تفعيلها، ستحتاج كلمة المرور + كود متغيّر من تطبيق مصادقة
          (مثل Google Authenticator) في كل تسجيل دخول.
        </p>

        {message && <p className="text-green-600 text-sm mb-3">{message}</p>}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {step === "idle" && (
          <button
            onClick={startSetup}
            disabled={loading}
            className="bg-primary text-white px-5 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {loading ? "جاري التحضير..." : "تفعيل المصادقة الثنائية"}
          </button>
        )}

        {step === "setup" && (
          <div>
            <p className="text-sm text-secondary mb-3">
              1. حمّل تطبيق <strong>Google Authenticator</strong> أو أي تطبيق مصادقة مشابه على هاتفك
              <br />
              2. امسح رمز QR التالي:
            </p>
            {qrCode && (
              <img src={qrCode} alt="QR Code" className="w-48 h-48 mx-auto border border-gray-200 rounded-lg mb-3" />
            )}
            <p className="text-xs text-gray-400 mb-3 text-center">
              أو أدخل هذا الكود يدوياً: <span className="font-mono">{secret}</span>
            </p>
            <form onSubmit={confirmSetup} className="flex gap-2">
              <input
                type="text"
                placeholder="أدخل الكود المكوّن من 6 أرقام"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                تأكيد
              </button>
            </form>
          </div>
        )}

        {step === "done" && (
          <form onSubmit={disable2FA} className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-secondary mb-2 flex items-center gap-1">
              <ShieldOff size={14} /> لتعطيل الحماية، أدخل كلمة المرور:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                تعطيل
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
