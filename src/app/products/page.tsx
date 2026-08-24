// src/app/products/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const { t, lang } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  // حالة الفلاتر - تُقرأ من رابط الصفحة (URL) حتى يمكن مشاركة الرابط لاحقاً
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        const page = searchParams.get("page") || "1";
        const search = searchParams.get("search");
        const category = searchParams.get("category");

        params.set("page", page);
        params.set("limit", "12");
        params.set("sort", sort);
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        const data = await apiClient(`/products?${params.toString()}`);
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sort, minPrice, maxPrice]);

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/products?${params.toString()}`);
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-secondary mb-6">{t("products")}</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* الفلاتر الجانبية */}
        <aside className="md:col-span-1 space-y-6">
          <div>
            <h3 className="font-medium text-secondary mb-2">{t("priceRange")}</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-secondary mb-2">{t("sortBy")}</h3>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price_asc">{t("priceLowHigh")}</option>
              <option value="price_desc">{t("priceHighLow")}</option>
            </select>
          </div>
        </aside>

        {/* شبكة المنتجات */}
        <div className="md:col-span-3">
          {loading ? (
            <p className="text-center text-gray-400 py-16">{t("loading")}</p>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-400 py-16">{t("noProducts")}</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* ترقيم الصفحات */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-8 h-8 rounded-full text-sm ${
                        p === pagination.page
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-secondary hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// Suspense مطلوب لأن useSearchParams يحتاجها Next.js عند التصدير الثابت
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-16">...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
