// src/context/AppContext.tsx
// "use client" لأن هذا الملف يستخدم State وInteractivity، وليس مجرد عرض بيانات
// يوفّر لكل صفحات الموقع: اللغة الحالية، دالة الترجمة t()، بيانات المستخدم المسجل دخوله

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang, TranslationKey } from "@/lib/i18n";
import { apiClient } from "@/lib/apiClient";

interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "admin";
}

interface AppContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  cartCount: number;
  refreshCartCount: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  // عند فتح الموقع لأول مرة، نسترجع اللغة والمستخدم المحفوظين من قبل (إن وُجدا)
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as Lang | null;
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedLang) setLang(savedLang);
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // كل مرة تتغير فيها اللغة، نحدّث اتجاه الصفحة (RTL للعربية، LTR للإنجليزية) تلقائياً
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    if (token) refreshCartCount();
  }, [token]);

  function toggleLang() {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }

  function t(key: TranslationKey): string {
    return translations[lang][key] || key;
  }

  function login(newToken: string, newUser: User) {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setCartCount(0);
  }

  async function refreshCartCount() {
    try {
      const data = await apiClient("/cart");
      const count = data.cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }

  return (
    <AppContext.Provider
      value={{ lang, toggleLang, t, user, token, login, logout, cartCount, refreshCartCount }}
    >
      {children}
    </AppContext.Provider>
  );
}

// دالة مختصرة لاستخدام السياق في أي صفحة: const { t, lang, user } = useApp();
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp يجب أن يُستخدم داخل AppProvider");
  }
  return context;
}
