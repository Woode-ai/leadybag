"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, User, MapPin, Phone, CreditCard, ShoppingBag, Truck } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOrder(data.data);
      }
    } catch (err) {
      console.error("فشل جلب تفاصيل الطلب", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">جاري تحميل تفاصيل الطلب...</div>;
  }

  if (!order) {
    return <div className="p-8 text-center text-red-500">لم يتم العثور على الطلب.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/orders" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-pink-600">
          <ArrowRight className="w-4 h-4" /> العودة للطلبات
        </Link>
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          رقم الطلب: {order._id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* قائمة المنتجات والفاتورة */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 border-b pb-3">
              <ShoppingBag className="w-5 h-5 text-pink-600" /> المنتجات المطلوبة
            </h2>

            <div className="divide-y">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">الكمية: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-pink-600">{(item.price * item.quantity).toLocaleString()} ج.س</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3 text-sm">
            <h3 className="font-bold text-gray-800 border-b pb-2">ملخص الحساب</h3>
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span>{order.subtotal?.toLocaleString()} ج.س</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>الخصم:</span>
                <span>-{order.discount?.toLocaleString()} ج.س</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t">
              <span>الإجمالي:</span>
              <span className="text-pink-600">{order.total?.toLocaleString()} ج.س</span>
            </div>
          </div>
        </div>

        {/* معلومات العميل والتوصيل */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-gray-800 border-b pb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-pink-600" /> بيانات العميل
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{order.shippingAddress?.fullName}</p>
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" /> {order.shippingAddress?.phone}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" /> {order.shippingAddress?.city} - {order.shippingAddress?.address}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
            <h2 className="font-bold text-lg text-gray-800 border-b pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-pink-600" /> طريقة الدفع
            </h2>
            <p className="text-sm font-medium text-gray-700 uppercase">
              {order.paymentMethod === "cod" ? "الدفع عند الاستلام (COD)" : "تحويل بنكي (بنكك)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}