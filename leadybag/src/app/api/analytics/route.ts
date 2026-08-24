// src/app/api/analytics/route.ts
// GET /api/analytics → إحصائيات شاملة (أدمن فقط): إيرادات، أكثر المنتجات مبيعاً، رسم بياني للمبيعات اليومية

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { status: "error", message: "غير مصرح لك - هذا الإجراء للأدمن فقط" },
        { status: 403 }
      );
    }

    await connectDB();

    // 1. إجمالي الإيرادات وعدد الطلبات (فقط الطلبات المدفوعة تُحسب كإيراد فعلي)
    const paidOrders = await Order.find({ paymentStatus: "paid" });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = await Order.countDocuments();

    // 2. عدد المنتجات وتنبيهات نفاد المخزون (أقل من 5 قطع = تنبيه)
    const totalProducts = await Product.countDocuments();
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } }).select(
      "name stock"
    );

    // 3. أكثر 5 منتجات مبيعاً (نحسبها من عناصر كل الطلبات)
    const allOrders = await Order.find().populate("items.productId", "name");
    const salesCount: Record<string, { name: string; count: number }> = {};

    for (const order of allOrders) {
      for (const item of order.items) {
        const product = item.productId as any;
        if (!product) continue;
        const id = product._id.toString();
        if (!salesCount[id]) {
          salesCount[id] = { name: product.name?.ar || "منتج محذوف", count: 0 };
        }
        salesCount[id].count += item.quantity;
      }
    }

    const topProducts = Object.values(salesCount)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 4. المبيعات اليومية لآخر 7 أيام (لرسم بياني بسيط)
    const last7Days: { date: string; sales: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const dayOrders = await Order.find({
        createdAt: { $gte: day, $lt: nextDay },
        paymentStatus: "paid",
      });

      last7Days.push({
        date: day.toISOString().split("T")[0],
        sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    return NextResponse.json({
      status: "success",
      analytics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        lowStockProducts,
        topProducts,
        last7Days,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
