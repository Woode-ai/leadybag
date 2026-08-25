// src/models/ChatMessage.ts
// يخزّن رسائل الدردشة المباشرة بين العميل والأدمن (للاحتفاظ بسجل المحادثة)

import { Schema, models, model, Types } from "mongoose";

export interface IChatMessage {
  _id: string;
  roomId: string; // عادة تكون userId الخاص بالعميل، بحيث لكل عميل "غرفة" محادثة واحدة مع الأدمن
  senderId: string;
  senderRole: "customer" | "admin";
  message: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: { type: String, required: true, index: true },
    senderId: { type: String, required: true },
    senderRole: { type: String, enum: ["customer", "admin"], required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema);
