// src/app/api/coupons/validate/route.ts
// POST /api/coupons/validate
// يتحقق هل الكوبون صالح للاستخدام الآن (تاريخ ساري + لم يتجاوز حد الاستخدام)
// يستخدمه العميل عند كتابة كود الخصم في صفحة السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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
    if (now < coupon.startDate || now > coupon.endDate) {
      return NextResponse.json(
        { status: "error", message: "هذا الكوبون منتهي الصلاحية أو لم يبدأ بعد" },
        { status: 400 }
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { status: "error", message: "تم استنفاد عدد مرات استخدام هذا الكوبون" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "الكوبون صالح للاستخدام",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        value: coupon.value,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
