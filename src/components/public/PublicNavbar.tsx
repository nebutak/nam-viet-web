"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Users, Search, Menu, X, Building2 } from "lucide-react";

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/gioi-thieu", label: "Giới thiệu", icon: <Building2 size={16} /> },
    { href: "/showcase", label: "Sản phẩm", icon: <ShoppingBag size={16} /> },
    { href: "/community", label: "Cộng đồng", icon: <Users size={16} /> },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled
          ? "border-b border-emerald-100 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(6,95,70,0.08)] py-2"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/showcase" className="flex items-center gap-3 group">
            <div className={`relative w-10 h-10 flex items-center justify-center transition-all duration-500 !bg-transparent border-none sm:border-none`}
                 style={{ isolation: 'isolate' }}>
              <Image 
                src="/logo.gif" 
                alt="Nam Việt Logo" 
                fill
                className="object-contain p-0 transition-transform group-hover:scale-110" 
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold bg-gradient-to-r from-emerald-800 to-green-600 bg-clip-text text-transparent">
                Nam Việt
              </span>
              <span className="block text-[10px] -mt-1 font-semibold tracking-[0.22em] uppercase text-slate-500">
                Sản xuất & Thương mại
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 ${
                  isScrolled 
                    ? "text-slate-700 hover:bg-emerald-50 hover:text-emerald-800" 
                    : "text-slate-600 hover:bg-white/20 hover:text-emerald-700"
                }`}
              >
                <span className={isScrolled ? "text-emerald-600" : ""}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar */}
            <div className={`hidden lg:flex w-64 items-center gap-2 rounded-full border transition-all ${
              isScrolled 
                ? "border-emerald-100 bg-emerald-50/30 text-slate-900 focus-within:border-emerald-500 focus-within:ring-emerald-500/10" 
                : "border-slate-200 bg-white/50 text-slate-900 focus-within:border-white focus-within:ring-white/20"
            } px-4 py-2 shadow-sm`}>
              <Search size={14} className="text-emerald-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`rounded-full p-2 transition-all ${
                isScrolled ? "text-emerald-800 hover:bg-emerald-50" : "text-slate-600 hover:bg-white/20"
              } md:hidden`}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="border-t border-emerald-50 bg-white/95 px-4 py-8 shadow-2xl backdrop-blur-3xl md:hidden">
          <div className="space-y-2 rounded-3xl p-3 border border-emerald-100/50 bg-emerald-50/30">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 transition-all hover:bg-white hover:text-emerald-700 hover:shadow-sm"
            >
              <span className="p-2.5 rounded-xl bg-white shadow-sm italic text-emerald-600">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
          </div>
        </div>
      )}
    </nav>
  );
}
