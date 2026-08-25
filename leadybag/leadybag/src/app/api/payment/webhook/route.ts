// src/app/api/payment/webhook/route.ts
// POST /api/payment/webhook
// هذا الرابط لا يستدعيه المستخدم أبداً - بل Stripe نفسه يستدعيه تلقائياً
// عندما يكتمل الدفع بنجاح، ليخبرنا "هذا الطلب تم دفعه فعلياً"
// نستخدم هذا بدلاً من الثقة في المتصفح، لأن المتصفح يمكن التلاعب به، أما Stripe فموثوق

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event;
    try {
      // نتأكد أن هذا الطلب فعلاً من Stripe وليس مزوّراً من أي شخص آخر
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      return NextResponse.json(
        { status: "error", message: `خطأ في توقيع الـ Webhook: ${err.message}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata.orderId;

      await connectDB();
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        status: "processing",
      });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
