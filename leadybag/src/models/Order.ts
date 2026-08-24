// src/models/Order.ts
// يعرّف كل طلب شراء يقوم به العميل

import mongoose, { Schema, models, model } from "mongoose";

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number; // سعر المنتج وقت الشراء (لا يتغير حتى لو تغير سعر المنتج لاحقاً)
}

export interface IOrder {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  discount: number;
  coupon?: string; // كود الكوبون المستخدم إن وجد
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  paymentMethod: "stripe" | "paymob" | "cod"; // cod = الدفع عند الاستلام
  paymentStatus: "pending" | "paid" | "failed";
  trackingNumber?: string;
  createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: { type: String, required: true },
    paymentMethod: { type: String, enum: ["stripe", "paymob", "cod"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    trackingNumber: { type: String },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);
