// src/app/api/cart/route.ts
// GET   /api/cart  → عرض سلة المستخدم الحالي (مع تفاصيل كل منتج)
// POST  /api/cart  → إضافة منتج للسلة (أو زيادة كميته إذا كان موجوداً بالفعل)
// PUT   /api/cart  → تحديث كمية منتج معين في السلة
// DELETE /api/cart?productId=xxx → حذف منتج من السلة

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getCurrentUser } from "@/lib/auth";
import { cartItemSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول لعرض السلة" },
        { status: 401 }
      );
    }

    await connectDB();
    let cart = await Cart.findOne({ userId: currentUser.userId }).populate(
      "items.productId",
      "name price discountPrice images stock"
    );

    // إذا لم يكن للمستخدم سلة بعد، ننشئ له واحدة فارغة تلقائياً
    if (!cart) {
      cart = await Cart.create({ userId: currentUser.userId, items: [] });
    }

    return NextResponse.json({ status: "success", cart });
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
        { status: "error", message: "يجب تسجيل الدخول لإضافة منتج للسلة" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();

    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, quantity } = parsed.data;

    let cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      cart = new Cart({ userId: currentUser.userId, items: [] });
    }

    // إذا كان المنتج موجوداً بالفعل في السلة، نزيد كميته بدلاً من تكراره
    const existingItem = cart.items.find((item) => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: productId as any, quantity });
    }

    await cart.save();
    await cart.populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تمت إضافة المنتج للسلة", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const currentUser = getCurrentUser(req);
    if (!currentUser) {
      return NextResponse.json(
        { status: "error", message: "يجب تسجيل الدخول" },
        { status: 401 }
      );
    }

    await connectDB();
    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: "بيانات غير صحيحة", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const { productId, quantity } = parsed.data;

    const cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      return NextResponse.json({ status: "error", message: "السلة غير موجودة" }, { status: 404 });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return NextResponse.json(
        { status: "error", message: "هذا المنتج غير موجود في السلة" },
        { status: 404 }
      );
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId", "name price discountPrice images stock");

    return NextResponse.json({ status: "success", message: "تم تحديث الكمية", cart });
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
    const cart = await Cart.findOne({ userId: currentUser.userId });
    if (!cart) {
      return NextResponse.json({ status: "error", message: "السلة غير موجودة" }, { status: 404 });
    }

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();

    return NextResponse.json({ status: "success", message: "تم حذف المنتج من السلة", cart });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: "حدث خطأ في السيرفر", error: error.message },
      { status: 500 }
    );
  }
}
