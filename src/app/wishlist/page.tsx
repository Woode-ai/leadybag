// src/app/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Trash2, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { t, lang, user, refreshCartCount } = useApp();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadWishlist();
    else setLoading(false);
  }, [user]);

  async function loadWishlist() {
    setLoading(true);
    try {
      const data = await apiClient("/wishlist");
      setWishlist(data.wishlist);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function removeFromWishlist(productId: string) {
    try {
      await apiClient(`/wishlist?productId=${productId}`, { method: "DELETE" });
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (err: any) {
      alert(err.message);
    }
  }

  // "نقل للسلة": نضيف المنتج للسلة ثم نزيله من قائمة الأمنيات
  async function moveToCart(productId: string) {
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      await removeFromWishlist(productId);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">
          {lang === "ar" ? "يجب تسجيل الدخول لعرض قائمة الأمنيات" : "Please login to view your wishlist"}
        </p>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full">
          {t("login")}
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("wishlist")}</h1>

      {loading ? (
        <p className="text-gray-400">{t("loading")}</p>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">
            {lang === "ar" ? "قائمة أمنياتك فارغة" : "Your wishlist is empty"}
          </p>
          <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-full">
            {t("shopNow")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="flex gap-4 border border-gray-200 rounded-xl p-3">
              <Link href={`/products/${product._id}`} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                {product.images?.[0] && (
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1">
                <Link href={`/products/${product._id}`}>
                  <h3 className="font-medium text-secondary">{product.name[lang]}</h3>
                </Link>
                <p className="text-primary font-bold mt-1">
                  {product.discountPrice || product.price}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => moveToCart(product._id)}
                    disabled={product.stock === 0}
                    className="text-xs bg-primary text-white px-3 py-1.5 rounded-full flex items-center gap-1 disabled:bg-gray-300"
                  >
                    <ShoppingBag size={12} /> {t("addToCart")}
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="text-xs border border-gray-300 text-gray-500 px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <Trash2 size={12} /> {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
