// src/components/ProductCard.tsx
"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    _id: string;
    name: { ar: string; en: string };
    price: number;
    discountPrice?: number;
    images: string[];
    stock: number;
    ratings: { rating: number }[];
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { lang, t, user, refreshCartCount } = useApp();

  const avgRating =
    product.ratings.length > 0
      ? (product.ratings.reduce((s, r) => s + r.rating, 0) / product.ratings.length).toFixed(1)
      : null;

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      await refreshCartCount();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name[lang]}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            leadybag
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-secondary text-sm truncate">{product.name[lang]}</h3>

        {avgRating && (
          <p className="text-xs text-yellow-600 mt-1">★ {avgRating}</p>
        )}

        <div className="flex items-center justify-between mt-2">
          <div>
            {product.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-primary font-bold">{product.discountPrice}</span>
                <span className="text-gray-400 text-xs line-through">{product.price}</span>
              </div>
            ) : (
              <span className="text-primary font-bold">{product.price}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary text-white p-2 rounded-full disabled:bg-gray-300 hover:opacity-90"
            title={t("addToCart")}
          >
            <ShoppingBag size={14} />
          </button>
        </div>

        {product.stock === 0 && (
          <p className="text-xs text-red-500 mt-1">{t("outOfStock")}</p>
        )}
      </div>
    </Link>
  );
}
