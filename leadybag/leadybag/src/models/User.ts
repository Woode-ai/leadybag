// src/models/User.ts
// هذا الملف يعرّف "شكل" بيانات المستخدم داخل قاعدة البيانات
// كل مستخدم (عميل أو أدمن) سيكون له سجل بهذا الشكل بالضبط

import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string; // سيتم تشفيرها بـ bcrypt قبل الحفظ، لن تُخزن أبداً كنص عادي
  role: "customer" | "admin"; // نوع الحساب: عميل عادي أو مدير المتجر
  phone?: string;
  address?: string;
  wishlist: mongoose.Types.ObjectId[]; // قائمة أمنيات المستخدم (روابط لمنتجات)
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    phone: { type: String },
    address: { type: String },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true } // يضيف تلقائياً createdAt و updatedAt
);

// هذا السطر يمنع Next.js من إعادة تعريف النموذج عدة مرات أثناء إعادة التحميل التلقائي
export default models.User || model<IUser>("User", UserSchema);
