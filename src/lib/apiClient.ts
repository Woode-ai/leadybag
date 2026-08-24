// src/lib/apiClient.ts
// دالة موحدة لإرسال أي طلب لواجهات API الخلفية من الواجهة الأمامية
// تضيف تلقائياً توكن تسجيل الدخول (إن وُجد) في كل طلب

export async function apiClient(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    // نرمي رسالة الخطأ القادمة من السيرفر حتى تظهر للمستخدم بوضوح
    throw new Error(data.message || "حدث خطأ غير متوقع");
  }

  return data;
}
