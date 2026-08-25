// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";

interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: string;
  image?: string;
}

interface Product {
  _id: string;
  name: { ar: string; en: string };
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  ratings: { rating: number }[];
}

export default function Home() {
  const { t, lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          apiClient("/categories"),
          apiClient("/products?limit=8&sort=newest"),
        ]);
        setCategories(catRes.categories);
        setProducts(prodRes.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main>
      {/* البانر الرئيسي */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-gray-600 mb-8 text-lg">{t("heroSubtitle")}</p>
          <Link
            href="/products"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:opacity-90"
          >
            {t("shopNow")}
          </Link>
        </div>
      </section>

      {/* الأقسام */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-secondary mb-6">{t("categories")}</h2>

        {categories.length === 0 && !loading ? (
          <p className="text-gray-400 text-center py-8">
            {lang === "ar"
              ? "لا توجد أقسام بعد - أضف أقساماً من لوحة تحكم الأدمن"
              : "No categories yet - add some from the admin dashboard"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat._id}`}
                className="group text-center"
              >
                <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden mb-2">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary font-bold text-xl">
                      {cat.name[lang][0]}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-secondary">{cat.name[lang]}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* منتجات مميزة */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-secondary">{t("featuredProducts")}</h2>
          <Link href="/products" className="text-primary text-sm font-medium hover:underline">
            {t("viewAll")}
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-8">{t("loading")}</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            {lang === "ar"
              ? "لا توجد منتجات بعد - أضف منتجات من لوحة تحكم الأدمن"
              : "No products yet - add some from the admin dashboard"}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
