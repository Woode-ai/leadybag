"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductProps {
  _id: string;
  name: { ar: string };
  price: number;
  discountPrice?: number;
  images: string[];
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition group">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.images[0] || "https://via.placeholder.com/300"}
          alt={product.name.ar}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />
        <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-white text-gray-600 hover:text-pink-600 transition">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-800 hover:text-pink-600 line-clamp-1 transition">
            {product.name.ar}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900">
              {(hasDiscount ? product.discountPrice : product.price)?.toLocaleString()} ج.س
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toLocaleString()}
              </span>
            )}
          </div>
          <button className="bg-pink-50 p-2 rounded-lg text-pink-600 hover:bg-pink-600 hover:text-white transition">
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}