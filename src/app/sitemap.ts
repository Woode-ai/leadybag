import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://leadybag.sd";

  // جلب المنتجات ديناميكياً لفهرستها
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });
    const data = await res.json();
    if (data.data) {
      productEntries = data.data.map((product: any) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error("فشل جلب المنتجات لخريطة الموقع:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...productEntries,
  ];
}