// src/models/Product.ts
// يعرّف كل منتج في المتجر: اسمه، وصفه، سعره، صوره، تقييماته، إلخ

import mongoose, { Schema, models, model } from "mongoose";

export interface IRating {
  userId: mongoose.Types.ObjectId;
  rating: number; // من 1 إلى 5 نجوم
  comment?: string;
  images?: string[]; // العميل يمكنه إرفاق صور مع تقييمه
  createdAt: Date;
}

export interface IProduct {
  _id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: number;
  discountPrice?: number; // السعر بعد الخصم (اختياري)
  images: string[]; // مصفوفة روابط الصور (من Cloudinary)
  categoryId: mongoose.Types.ObjectId;
  stock: number; // الكمية المتوفرة في المخزون
  sizes?: string[]; // مثال: ["S", "M", "L"]
  colors?: string[]; // مثال: ["أحمر", "أسود"]
  ratings: IRating[];
  createdAt: Date;
  updatedAt: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    images: [{ type: String }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    description: {
      ar: { type: String, required: true },
      en: { type: String, required: true },
    },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String }], // تبدأ فارغة، الأدمن يرفع الصور لاحقاً
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    ratings: [RatingSchema],
  },
  { timestamps: true }
);

export default models.Product || model<IProduct>("Product", ProductSchema);
