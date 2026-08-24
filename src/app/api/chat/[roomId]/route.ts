// src/app/api/chat/[roomId]/route.ts
// GET  /api/chat/:roomId → يعيد سجل المحادثة الكامل لهذه الغرفة (لعرضه عند فتح الدردشة)
// POST /api/chat/:roomId → يحفظ رسالة جديدة في قاعدة البيانات
//
// ملاحظة: البث اللحظي (Real-time) للرسائل يتم عبر Socket.io في server.js
// أما هذا الـ API فهو للحفظ الدائم في قاعدة البيانات وعرض السجل القديم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const messages = await ChatMessage.find({ roomId: params.roomId }).sort({ createdAt: 1 });

    return NextResponse.json({ status: "success", messages });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: { roomId: string } }) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json(
        { status: "error", message: "لا يمكن إرسال رسالة فارغة" },
        { status: 400 }
      );
    }

    const chatMessage = await ChatMessage.create({
      roomId: params.roomId,
      senderId: currentUser.userId,
      senderRole: currentUser.role,
      message: message.trim(),
    });

    return NextResponse.json({ status: "success", chatMessage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
