// src/lib/stripe.ts
// إعداد الاتصال بخدمة الدفع Stripe

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

export const stripe = new Stripe(STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-09-30.acacia",
});
