// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { ShoppingBag, Heart, User, Search, Globe, LogOut } from "lucide-react";

export default function Header() {
  const { t, lang, toggleLang, user, logout, cartCount } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* الشعار */}
        <Link href="/" className="text-2xl font-bold text-primary shrink-0">
          leadybag
        </Link>

        {/* شريط البحث */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("search")}
              className="w-full border border-gray-300 rounded-full py-2 px-4 pe-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-4 ms-auto">
          <Link href="/products" className="text-sm font-medium text-secondary hover:text-primary hidden md:inline">
            {t("products")}
          </Link>

          {/* تبديل اللغة */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 text-sm text-secondary hover:text-primary"
            title={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
          >
            <Globe size={18} />
            <span>{lang === "ar" ? "EN" : "AR"}</span>
          </button>

          <Link href="/wishlist" className="text-secondary hover:text-primary" title={t("wishlist")}>
            <Heart size={20} />
          </Link>

          <Link href="/cart" className="relative text-secondary hover:text-primary" title={t("cart")}>
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -end-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/account" className="text-secondary hover:text-primary" title={t("myAccount")}>
                <User size={20} />
              </Link>
              <button onClick={logout} className="text-secondary hover:text-primary" title={t("logout")}>
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-primary text-white px-4 py-1.5 rounded-full hover:opacity-90"
            >
              {t("login")}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
