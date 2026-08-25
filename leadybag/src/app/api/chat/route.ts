// src/app/api/chat/route.ts
// GET /api/chat
// يعيد قائمة بكل "الغرف" (المحادثات) التي فيها رسائل، مع آخر رسالة في كل واحدة
// أدمن فقط - يُستخدم في صفحة /admin/chats لعرض قائمة العملاء الذين راسلوا الدعم

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ChatMessage from "@/models/ChatMessage";
import User from "@/models/User";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();

    // نجمّع الرسائل حسب roomId، ونأخذ آخر رسالة وتاريخها في كل غرفة
    const rooms = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$roomId",
          lastMessage: { $first: "$message" },
          lastMessageAt: { $first: "$createdAt" },
          lastSenderRole: { $first: "$senderRole" },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);

    // roomId في تصميمنا = userId الخاص بالعميل، فنجلب اسمه لعرضه بدلاً من الرقم المجرّد
    const roomsWithNames = await Promise.all(
      rooms.map(async (room) => {
        const customer = await User.findById(room._id).select("name email");
        return {
          roomId: room._id,
          customerName: customer?.name || "عميل محذوف",
          customerEmail: customer?.email || "",
          lastMessage: room.lastMessage,
          lastMessageAt: room.lastMessageAt,
          lastSenderRole: room.lastSenderRole,
        };
      })
    );

    return NextResponse.json({ status: "success", rooms: roomsWithNames });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
