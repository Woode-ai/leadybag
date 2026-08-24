// src/app/api/cart/coupon/route.ts
// POST /api/cart/coupon → يحفظ كود الكوبون داخل سلة المستخدم بعد التأكد من صلاحيته
// DELETE /api/cart/coupon → يزيل الكوبون المُطبّق من السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import { getCurrentUser } from "@/lib/auth";

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
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json(
        { status: "error", message: "يجب إدخال كود الكوبون" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return NextResponse.json(
        { status: "error", message: "كود الكوبون غير صحيح" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (now < coupon.startDate || now > coupon.endDate || coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { status: "error", message: "هذا الكوبون غير صالح للاستخدام حالياً" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: currentUser.userId },
      { couponCode: coupon.code },
      { new: true, upsert: true }
    ).populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم تطبيق الكوبون بنجاح", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const cart = await Cart.findOneAndUpdate(
      { userId: currentUser.userId },
      { $unset: { couponCode: "" } },
      { new: true }
    ).populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم إلغاء الكوبون", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
