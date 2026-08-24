/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // نسمح بجلب الصور من Cloudinary (سنستخدمه لرفع صور المنتجات لاحقاً)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
