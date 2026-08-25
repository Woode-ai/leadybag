// src/app/api/orders/route.ts
// POST /api/orders → يحوّل محتوى السلة الحالية إلى "طلب" حقيقي (Checkout)
// GET  /api/orders → يعرض كل طلبات المستخدم الحالي (أو كل الطلبات إذا كان أدمن)

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validation";
import { sendOrderConfirmationEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لإتمام الطلب" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { shippingAddress, paymentMethod } = parsed.data;

    // 1. جلب سلة المستخدم
    const cart = await Cart.findOne({ userId: currentUser.userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { status: "error", message: "السلة فارغة، لا يمكن إتمام الطلب" },
        { status: 400 }
      );
    }

    // 2. التأكد من توفر الكمية المطلوبة لكل منتج في المخزون
    for (const item of cart.items) {
      const product = item.productId as any;
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            status: "error",
            message: `الكمية المتوفرة من "${product.name.ar}" غير كافية (متبقي ${product.stock} فقط)`,
          },
          { status: 400 }
        );
      }
    }

    // 3. حساب الإجمالي بناءً على السعر الحالي للمنتجات (وليس أي سعر قديم مخزّن)
    let total = 0;
    const orderItems = cart.items.map((item) => {
      const product = item.productId as any;
      const priceToUse = product.discountPrice || product.price;
      total += priceToUse * item.quantity;
      return {
        productId: product._id,
        quantity: item.quantity,
        price: priceToUse,
      };
    });

    // 4. تطبيق الكوبون إن وُجد
    let discount = 0;
    if (cart.couponCode) {
      const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase() });
      if (coupon) {
        discount =
          coupon.discountType === "percentage"
            ? (total * coupon.value) / 100
            : coupon.value;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // 5. إنشاء الطلب
    const order = await Order.create({
      userId: currentUser.userId,
      items: orderItems,
      total: total - discount,
      discount,
      coupon: cart.couponCode,
      status: "pending",
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending", // الدفع الإلكتروني الفعلي يُضاف في مرحلة الدفع
      trackingNumber: `LB-${Date.now()}`, // رقم تتبع مبدئي بسيط
    });

    // 6. خصم الكميات من المخزون
    for (const item of cart.items) {
      const product = item.productId as any;
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // 7. تفريغ السلة بعد إتمام الطلب بنجاح
    cart.items = [];
    cart.couponCode = undefined;
    await cart.save();

    // 8. إرسال بريد تأكيد الطلب - لا نجعل فشل الإرسال يفشل عملية الطلب نفسها
    try {
      const buyer = await User.findById(currentUser.userId);
      if (buyer) {
        await sendOrderConfirmationEmail(buyer.email, buyer.name, order.trackingNumber!, order.total);
      }
    } catch (emailError) {
      console.error("⚠️ تعذّر إرسال بريد تأكيد الطلب، لكن الطلب نفسه تم بنجاح:", emailError);
    }

    return NextResponse.json(
      { status: "success", message: "تم إنشاء الطلب بنجاح", order },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();

    // الأدمن يرى كل الطلبات، أما العميل فيرى طلباته فقط
    const filter = currentUser.role === "admin" ? {} : { userId: currentUser.userId };

    const orders = await Order.find(filter)
      .populate("items.productId", "name images")
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: "success", orders });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
