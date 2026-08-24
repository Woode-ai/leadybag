// src/app/api/payment/stripe/route.ts
// POST /api/payment/stripe
// ينشئ "جلسة دفع" (Checkout Session) على Stripe لطلب موجود بالفعل
// يعيد رابط صفحة الدفع الخاصة بـ Stripe ليتم توجيه العميل إليها

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const { orderId } = await req.json();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    if (order.userId.toString() !== currentUser.userId) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك بدفع هذا الطلب" },
        { status: 403 }
      );
    }

    // ننشئ جلسة دفع بقيمة الطلب الإجمالية (Stripe يتعامل بالسنت، لذلك نضرب × 100)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // غيّرها لعملتك المحلية إن كانت مدعومة من Stripe
            product_data: { name: `طلب leadybag رقم ${order.trackingNumber}` },
            unit_amount: Math.round(order.total * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { orderId: order._id.toString() }, // نحتاجها لاحقاً في الـ webhook لمعرفة أي طلب تم دفعه
      success_url: `${process.env.NEXTAUTH_URL}/order-success?orderId=${order._id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=true`,
    });

    return NextResponse.json({ status: "success", checkoutUrl: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "فشل إنشاء جلسة الدفع", error: error.message },
      { status: 500 }
    );
  }
}
