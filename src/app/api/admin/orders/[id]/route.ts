import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

// دالة جلب تفاصيل الطلب (GET)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// دالة تعديل حالة الطلب (PATCH)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}