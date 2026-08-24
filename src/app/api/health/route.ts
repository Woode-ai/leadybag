// src/app/api/health/route.ts
// رابط اختبار بسيط: عند فتحه في المتصفح، يحاول الاتصال بقاعدة البيانات
// ويعيد رسالة توضح هل نجح الاتصال أم لا
// جرّبه على: http://localhost:3000/api/health

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Analytics from "@/models/Analytics";

export async function GET() {
  try {
    await connectDB();

    // نتأكد أن كل نموذج (Model) تم تحميله بنجاح بدون أخطاء
    const modelsLoaded = [
      User.modelName,
      Category.modelName,
      Product.modelName,
      Order.modelName,
      Cart.modelName,
      Coupon.modelName,
      Analytics.modelName,
    ];

    return NextResponse.json({
      status: "success",
      message: "✅ الاتصال بقاعدة البيانات ناجح والنماذج جاهزة",
      modelsLoaded,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "❌ فشل الاتصال بقاعدة البيانات",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
