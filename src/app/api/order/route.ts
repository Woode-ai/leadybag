import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    const { items, shippingAddress, paymentMethod, subtotal, discount, total } = body;

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: "بيانات الطلب غير مكتملة" }, { status: 400 });
    }

    const newOrder = await Order.create({
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      discount,
      total,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, orderId: newOrder._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}