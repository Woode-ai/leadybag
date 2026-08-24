// src/app/api/wishlist/route.ts
// GET    /api/wishlist → عرض قائمة أمنيات المستخدم الحالي (مع تفاصيل كل منتج)
// POST   /api/wishlist → إضافة منتج لقائمة الأمنيات
// DELETE /api/wishlist?productId=xxx → إزالة منتج من القائمة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

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
    const user = await User.findById(currentUser.userId).populate(
      "wishlist",
      "name price discountPrice images stock ratings"
    );

    return NextResponse.json({ status: "success", wishlist: user?.wishlist || [] });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

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
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "يجب تحديد productId" },
        { status: 400 }
      );
    }

    // $addToSet يمنع تكرار نفس المنتج مرتين في القائمة
    await User.findByIdAndUpdate(currentUser.userId, {
      $addToSet: { wishlist: productId },
    });

    return NextResponse.json({ status: "success", message: "تمت الإضافة لقائمة الأمنيات" });
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

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    if (!productId) {
      return NextResponse.json(
        { status: "error", message: "يجب تحديد productId" },
        { status: 400 }
      );
    }

    await connectDB();
    await User.findByIdAndUpdate(currentUser.userId, {
      $pull: { wishlist: productId },
    });

    return NextResponse.json({ status: "success", message: "تمت الإزالة من قائمة الأمنيات" });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
