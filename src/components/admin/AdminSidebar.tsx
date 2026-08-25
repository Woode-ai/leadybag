// src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderTree, Package, ShoppingCart, Ticket, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";

const links = [
  { href: "/admin", label: "الإحصائيات", icon: LayoutDashboard },
  { href: "/admin/categories", label: "الأقسام", icon: FolderTree },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/coupons", label: "الكوبونات", icon: Ticket },
  { href: "/admin/chats", label: "الدردشات المباشرة", icon: MessageCircle },
  { href: "/admin/security", label: "الأمان", icon: ShieldCheck },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 bg-secondary text-white min-h-screen p-4">
      <Link href="/" className="flex items-center gap-2 text-sm text-gray-300 mb-8 hover:text-white">
        <ArrowRight size={16} />
        العودة للمتجر
      </Link>

      <p className="text-primary font-bold text-lg mb-6">لوحة تحكم leadybag</p>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
