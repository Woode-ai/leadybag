// src/app/products/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { apiClient } from "@/lib/apiClient";
import ProductCard from "@/components/ProductCard";
import { ShoppingBag, Heart, Share2, Star } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { t, lang, user, refreshCartCount } = useApp();

  const [product, setProduct] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // حقول نموذج إضافة تقييم جديد
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await apiClient(`/products/${id}`);
        setProduct(data.product);
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/cart", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });
      await refreshCartCount();
      alert(lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
    } catch (err: any) {
      alert(err.message);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: product.name[lang], url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  }

  async function handleAddToWishlist() {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    try {
      await apiClient("/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: id }),
      });
      alert(lang === "ar" ? "تمت الإضافة لقائمة الأمنيات" : "Added to wishlist");
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setSubmittingReview(true);
    try {
      await apiClient(`/products/${id}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
      });
      // نعيد تحميل المنتج لإظهار التقييم الجديد فوراً
      const data = await apiClient(`/products/${id}`);
      setProduct(data.product);
      setReviewComment("");
      setReviewRating(5);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingReview(false);
    }
  }

  if (loading) {
    return <p className="text-center py-16 text-gray-400">{t("loading")}</p>;
  }

  if (!product) {
    return <p className="text-center py-16 text-gray-400">{t("noProducts")}</p>;
  }

  const avgRating =
    product.ratings.length > 0
      ? (
          product.ratings.reduce((s: number, r: any) => s + r.rating, 0) / product.ratings.length
        ).toFixed(1)
      : null;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* معرض الصور */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            {product.images.length > 0 ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name[lang]}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                leadybag
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === selectedImage ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div>
          <h1 className="text-2xl font-bold text-secondary mb-2">{product.name[lang]}</h1>

          {avgRating && (
            <div className="flex items-center gap-1 text-yellow-500 mb-3">
              <Star size={16} fill="currentColor" />
              <span className="text-sm text-gray-600">
                {avgRating} ({product.ratings.length} {t("reviews")})
              </span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {product.discountPrice ? (
              <>
                <span className="text-2xl font-bold text-primary">{product.discountPrice}</span>
                <span className="text-gray-400 line-through">{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">{product.price}</span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description[lang]}</p>

          {product.colors?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-secondary mb-1">{t("color")}</p>
              <div className="flex gap-2">
                {product.colors.map((c: string) => (
                  <span key={c} className="text-xs border border-gray-300 rounded-full px-3 py-1">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-secondary mb-1">{t("size")}</p>
              <div className="flex gap-2">
                {product.sizes.map((s: string) => (
                  <span key={s} className="text-xs border border-gray-300 rounded-full px-3 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-sm mb-4">
            {product.stock > 0 ? (
              <span className="text-green-600">{t("inStock")} ({product.stock})</span>
            ) : (
              <span className="text-red-500">{t("outOfStock")}</span>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-primary text-white py-3 rounded-full font-medium disabled:bg-gray-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> {t("addToCart")}
            </button>
            <button onClick={handleAddToWishlist} className="border border-gray-300 p-3 rounded-full hover:bg-gray-50">
              <Heart size={18} />
            </button>
            <button onClick={handleShare} className="border border-gray-300 p-3 rounded-full hover:bg-gray-50">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* التقييمات */}
      <section className="mt-16 max-w-2xl">
        <h2 className="text-xl font-bold text-secondary mb-4">
          {t("reviews")} ({product.ratings.length})
        </h2>

        <div className="space-y-4 mb-8">
          {product.ratings.map((r: any, i: number) => (
            <div key={i} className="border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1 text-yellow-500 mb-1">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-medium text-secondary mb-2">{t("writeReview")}</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setReviewRating(n)}
                className={n <= reviewRating ? "text-yellow-500" : "text-gray-300"}
              >
                <Star size={20} fill="currentColor" />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-3"
            rows={3}
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm disabled:opacity-50"
          >
            {t("submitReview")}
          </button>
        </form>
      </section>

      {/* منتجات مشابهة (توصيات) */}
      {recommendations.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-secondary mb-4">
            {lang === "ar" ? "منتجات مشابهة" : "Similar Products"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recommendations.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
