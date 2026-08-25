// src/app/api/orders/[id]/route.ts
// GET /api/orders/:id → تفاصيل طلب واحد (العميل صاحب الطلب أو الأدمن فقط)
// PUT /api/orders/:id → تحديث حالة الطلب (أدمن فقط) - يُستخدم لتحديث الشحن لحظة بلحظة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    await connectDB();
    const order = await Order.findById(id).populate("items.productId", "name images");

    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    // العميل يمكنه رؤية طلبه فقط، الأدمن يرى أي طلب
    if (currentUser.role !== "admin" && order.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك برؤية هذا الطلب" },
        { status: 403 }
      );
    }

    return NextResponse.json({ status: "success", order });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Next.js 15: params أصبحت Promise ويجب انتظارها قبل استخدامها
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();
    const body = await req.json();
    const { status, paymentStatus, trackingNumber } = body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { status: "error", message: "حالة الطلب غير صحيحة" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (trackingNumber) updateData.trackingNumber = trackingNumber;

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ status: "success", message: "تم تحديث الطلب بنجاح", order });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
