// src/models/Coupon.ts
// يعرّف أكواد الخصم التي يديرها الأدمن

import { Schema, models, model } from "mongoose";

export interface ICoupon {
  _id: string;
  code: string; // مثال: "RAMADAN25"
  discountType: "percentage" | "fixed"; // نسبة مئوية أو قيمة ثابتة
  value: number; // مثال: 25 (يعني 25% أو 25 جنيه حسب النوع)
  startDate: Date;
  endDate: Date;
  usageLimit: number; // عدد مرات الاستخدام المسموح بها
  usedCount: number; // عدد مرات الاستخدام الفعلية حتى الآن
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Coupon || model<ICoupon>("Coupon", CouponSchema);
