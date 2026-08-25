"use client";

import Link from "next/link";
import { ShoppingBag, Heart, Search, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* الشعار */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-pink-600">
          leadybag<span className="text-gray-800">.sd</span>
        </Link>

        {/* شريط البحث */}
        <div className="flex-1 max-w-md hidden md:flex items-center relative">
          <input
            type="text"
            placeholder="ابحثي عن حقائب، أزياء، مستحضرات تجميل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>

        {/* الأيقونات والتنقل */}
        <div className="flex items-center gap-5 text-gray-700">
          <Link href="/wishlist" className="hover:text-pink-600 relative">
            <Heart className="w-6 h-6" />
          </Link>
          <Link href="/cart" className="hover:text-pink-600 relative">
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              0
            </span>
          </Link>
          <Link href="/account" className="hover:text-pink-600">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}