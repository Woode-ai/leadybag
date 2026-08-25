// src/models/Cart.ts
// يعرّف سلة التسوق الخاصة بكل مستخدم (منتجات لم يتم شراؤها بعد)

import mongoose, { Schema, models, model } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  couponCode?: string;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
    couponCode: { type: String },
  },
  { timestamps: true }
);

export default models.Cart || model<ICart>("Cart", CartSchema);
