// src/app/api/payment/paymob/route.ts
// POST /api/payment/paymob
// PayMob بوابة دفع عربية شهيرة (تدعم بطاقات فيزا/ماستركارد ومحافظ إلكترونية)
// آلية عملها تختلف عن Stripe: تحتاج 3 خطوات متتالية (طلب توكن → تسجيل الطلب → طلب رابط الدفع)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/auth";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID;

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "إعدادات PayMob غير مكتملة - أضف PAYMOB_API_KEY و PAYMOB_INTEGRATION_ID و PAYMOB_IFRAME_ID في .env.local",
        },
        { status: 500 }
      );
    }

    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ status: "error", message: "الطلب غير موجود" }, { status: 404 });
    }

    // الخطوة 1: الحصول على توكن مصادقة من PayMob
    const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
    });
    const authData = await authRes.json();
    const authToken = authData.token;

    // الخطوة 2: تسجيل تفاصيل الطلب لدى PayMob (المبلغ بالقروش/السنت)
    const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(order.total * 100),
        currency: "EGP", // غيّرها حسب عملتك
        items: [],
      }),
    });
    const orderData = await orderRes.json();

    // الخطوة 3: طلب "مفتاح دفع" (payment_key) خاص بهذا الطلب لعرض صفحة الدفع
    const paymentKeyRes = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: Math.round(order.total * 100),
          expiration: 3600,
          order_id: orderData.id,
          billing_data: {
            apartment: "NA",
            email: "customer@leadybag.com",
            floor: "NA",
            first_name: "عميل",
            street: "NA",
            building: "NA",
            phone_number: "01000000000",
            city: "Khartoum",
            country: "SD",
            last_name: "leadybag",
            state: "NA",
          },
          currency: "EGP",
          integration_id: PAYMOB_INTEGRATION_ID,
        }),
      }
    );
    const paymentKeyData = await paymentKeyRes.json();

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKeyData.token}`;

    return NextResponse.json({ status: "success", checkoutUrl: iframeUrl });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "فشل إنشاء جلسة الدفع عبر PayMob", error: error.message },
      { status: 500 }
    );
  }
}
