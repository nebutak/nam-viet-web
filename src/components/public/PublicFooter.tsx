"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Youtube, Globe, ChevronRight } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="border-t border-green-500/30 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-emerald-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand & About (Larger Column) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative h-14 w-14 flex items-center justify-center bg-white rounded-2xl overflow-hidden shadow-lg p-1.5">
                <Image src="/images/logo/logo-nobackground.png" alt="Nam Việt Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="block text-2xl font-black text-white uppercase tracking-wider leading-tight">Nam Việt</span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#f0e2cc]">Sản xuất & Thương mại</span>
              </div>
            </div>
            <p className="mb-8 text-sm leading-relaxed text-emerald-100 font-medium pr-4 md:pr-10">
              Chuyên cung cấp các sản phẩm chất lượng cao, đáp ứng nhu cầu sản xuất và thương mại trong nước và quốc tế.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook size={18} />, label: "Facebook", href: "#", hoverColor: "hover:bg-blue-500 hover:border-blue-500 hover:text-white" },
                { icon: <Youtube size={18} />, label: "Youtube", href: "#", hoverColor: "hover:bg-red-500 hover:border-red-500 hover:text-white" },
                { icon: <Globe size={18} />, label: "Website", href: "#", hoverColor: "hover:bg-teal-500 hover:border-teal-500 hover:text-white" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-800/30 text-emerald-100 transition-all duration-300 ${s.hoverColor} backdrop-blur-sm`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Khám phá</h3>
            <ul className="space-y-4">
              {[
                { href: "/showcase", label: "Tất cả sản phẩm" },
                { href: "/showcase?type=goods", label: "Hàng hóa" },
                { href: "/showcase?type=finished_product", label: "Thành phẩm" },
                { href: "/community", label: "Tin tức & Blog" },
                { href: "/community?type=video", label: "Video" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm font-semibold text-emerald-100 transition-all duration-200 hover:text-white"
                  >
                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-white" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Công ty</h3>
            <ul className="space-y-4">
              {[
                { href: "/gioi-thieu", label: "Về chúng tôi" },
                { href: "/gioi-thieu#lich-su", label: "Lịch sử hình thành" },
                { href: "/gioi-thieu#gia-tri", label: "Chứng nhận chất lượng" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm font-semibold text-emerald-100 transition-all duration-200 hover:text-white"
                  >
                    <ChevronRight size={14} className="mr-2 opacity-0 -ml-4 transition-all duration-300 group-hover:opacity-100 group-hover:ml-0 text-white" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="mb-6 text-sm font-black uppercase tracking-widest text-white">Liên hệ</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800/40 border border-emerald-400/30 text-white backdrop-blur-sm">
                  <MapPin size={18} />
                </div>
                <span className="text-sm font-semibold text-emerald-100 leading-relaxed max-w-[200px]">
                  123 Đường Nam Việt, Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800/40 border border-emerald-400/30 text-white backdrop-blur-sm">
                  <Phone size={18} />
                </div>
                <a href="tel:+84123456789" className="text-sm font-semibold text-emerald-100 transition-colors hover:text-white">
                  +84 (0) 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-800/40 border border-emerald-400/30 text-white backdrop-blur-sm">
                  <Mail size={18} />
                </div>
                <a href="mailto:info@namviet.vn" className="text-sm font-semibold text-emerald-100 transition-colors hover:text-white">
                  info@namviet.vn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-emerald-500/20 bg-emerald-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-emerald-200/80 font-semibold tracking-wide">
            © {new Date().getFullYear()} Nam Việt. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-sm font-semibold text-emerald-200/80 transition-colors hover:text-white">Chính sách bảo mật</Link>
            <Link href="#" className="text-sm font-semibold text-emerald-200/80 transition-colors hover:text-white">Điều khoản sử dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
