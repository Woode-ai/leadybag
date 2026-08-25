// src/models/Analytics.ts
// يخزّن إحصائيات يومية: عدد الزيارات والمبيعات، تُستخدم في لوحة تحكم الأدمن للرسوم البيانية

import { Schema, models, model } from "mongoose";

export interface IAnalytics {
  _id: string;
  date: Date; // يوم واحد فقط (بدون وقت)، مثال: 2026-08-23
  visits: number; // عدد زيارات الموقع في هذا اليوم
  sales: number; // إجمالي المبيعات (بالجنيه) في هذا اليوم
  ordersCount: number; // عدد الطلبات في هذا اليوم
}

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    date: { type: Date, required: true, unique: true },
    visits: { type: Number, default: 0 },
    sales: { type: Number, default: 0 },
    ordersCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Analytics || model<IAnalytics>("Analytics", AnalyticsSchema);
