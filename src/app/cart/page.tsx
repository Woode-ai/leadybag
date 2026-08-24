// src/app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { t, lang, user, refreshCartCount } = useApp();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (user) loadCart();
    else setLoading(false);
  }, [user]);

  async function loadCart() {
    setLoading(true);
    try {
      const data = await apiClient("/cart");
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    try {
      const data = await apiClient("/cart", {
        method: "PUT",
        body: JSON.stringify({ productId, quantity }),
      });
      setCart(data.cart);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function removeItem(productId: string) {
    try {
      const data = await apiClient(`/cart?productId=${productId}`, { method: "DELETE" });
      setCart(data.cart);
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setApplyingCoupon(true);
    setCouponError("");
    try {
      const data = await apiClient("/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code: couponInput }),
      });
      setCart(data.cart);
    } catch (err: any) {
      setCouponError(err.message);
    } finally {
      setApplyingCoupon(false);
    }
  }

  if (!user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">
          {lang === "ar" ? "يجب تسجيل الدخول لعرض السلة" : "Please login to view your cart"}
        </p>
        <Link href="/login" className="bg-primary text-white px-6 py-2 rounded-full">
          {t("login")}
        </Link>
      </main>
    );
  }

  if (loading) {
    return <p className="text-center py-16 text-gray-400">{t("loading")}</p>;
  }

  const items = cart?.items || [];

  // حساب المجموع الفرعي بناءً على السعر الحالي لكل منتج
  const subtotal = items.reduce((sum: number, item: any) => {
    const price = item.productId.discountPrice || item.productId.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("yourCart")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-4">{t("emptyCart")}</p>
          <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-full">
            {t("shopNow")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* عناصر السلة */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item: any) => (
              <div
                key={item.productId._id}
                className="flex gap-4 border border-gray-200 rounded-xl p-3"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {item.productId.images?.[0] && (
                    <img
                      src={item.productId.images[0]}
                      alt={item.productId.name[lang]}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary">{item.productId.name[lang]}</h3>
                  <p className="text-primary font-bold mt-1">
                    {item.productId.discountPrice || item.productId.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                      className="w-7 h-7 border border-gray-300 rounded-full"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                      className="w-7 h-7 border border-gray-300 rounded-full"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.productId._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* ملخص الطلب */}
          <div className="border border-gray-200 rounded-xl p-4 h-fit">
            <h2 className="font-bold text-secondary mb-4">{t("subtotal")}</h2>

            <form onSubmit={applyCoupon} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder={t("couponCode")}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
              />
              <button
                type="submit"
                disabled={applyingCoupon}
                className="bg-secondary text-white px-3 rounded-lg text-sm"
              >
                {t("applyCoupon")}
              </button>
            </form>
            {couponError && <p className="text-red-500 text-xs mb-2">{couponError}</p>}
            {cart?.couponCode && (
              <p className="text-green-600 text-xs mb-2">
                ✓ {cart.couponCode} {lang === "ar" ? "مُطبّق" : "applied"}
              </p>
            )}

            <div className="flex justify-between text-sm py-2 border-t border-gray-100">
              <span>{t("subtotal")}</span>
              <span>{subtotal}</span>
            </div>

            <Link
              href="/checkout"
              className="block text-center bg-primary text-white py-3 rounded-full font-medium mt-4"
            >
              {t("checkout")}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
