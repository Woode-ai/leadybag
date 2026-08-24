// src/models/Category.ts
// يعرّف أقسام المتجر مثل: أزياء، إكسسوارات، مستحضرات تجميل، أحذية، حقائب
// يدعم اللغتين العربية والإنجليزية لكل قسم

import mongoose, { Schema, models, model } from "mongoose";

export interface ICategory {
  _id: string;
  name: {
    ar: string; // اسم القسم بالعربية، مثال: "حقائب"
    en: string; // اسم القسم بالإنجليزية، مثال: "Bags"
  };
  slug: string; // نسخة صديقة للروابط، مثال: "bags"
  image?: string; // رابط صورة القسم (يُرفع من الأدمن)
  parentId?: mongoose.Types.ObjectId | null; // لدعم أقسام فرعية مستقبلاً
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      ar: { type: String, required: true, trim: true },
      en: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    image: { type: String, default: "" },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

export default models.Category || model<ICategory>("Category", CategorySchema);
