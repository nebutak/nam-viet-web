"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Tag, Package, Eye } from "lucide-react";
import type { Product } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:8000";

function formatPrice(price: number | string | null | undefined) {
  if (!price) return "Liên hệ";
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "Liên hệ";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

function getProductTypeLabel(type: string) {
  const map: Record<string, string> = {
    raw_material: "Nguyên liệu",
    packaging: "Bao bì",
    finished_product: "Thành phẩm",
    goods: "Hàng hóa",
  };
  return map[type] || type;
}

function getProductTypeBadge(type: string) {
  const map: Record<string, string> = {
    raw_material: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    packaging: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
    finished_product: "bg-[rgba(113,136,111,0.14)] text-[var(--nv-sage-strong)]",
    goods: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  };
  return map[type] || "bg-gray-100 text-gray-700";
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${API_BASE}/${product.image}`
    : null;

  const isActive = product.status === "active";

  return (
    <Link href={`/showcase/${product.id}`} className="group block h-full">
      <div className="group relative h-full flex flex-col overflow-hidden rounded-[42px] bg-white transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_rgba(6,95,70,0.12),0_0_30px_rgba(16,185,129,0.05)] border border-emerald-50/50">
        
        {/* Image Hub */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-emerald-50/40" />
          
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.productName}
              fill
              className="object-contain p-6 transition-transform duration-1000 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50/20">
              <Package size={56} strokeWidth={1} className="text-emerald-200" />
            </div>
          )}

          {/* Frosted Type Badge */}
          <div className="absolute top-5 left-5 z-10">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] backdrop-blur-md border border-white/40 shadow-sm transition-colors duration-500 ${getProductTypeBadge(product.productType)}`}>
              {getProductTypeLabel(product.productType)}
            </span>
          </div>

          {/* High-End Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/5 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px]">
            <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <span className="flex items-center gap-2 rounded-full bg-emerald-900 px-6 py-3 text-xs font-bold text-white shadow-2xl hover:bg-black transition-colors">
                <Eye size={16} />
                Khám phá ngay
              </span>
            </div>
          </div>
        </div>

        {/* Info Area */}
        <div className="p-7 flex flex-col flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-800/60 font-nunito">
              {product.category?.categoryName || "Sản phẩm Nam Việt"}
            </span>
          </div>

          <h3 className="mb-6 text-base font-bold leading-tight text-slate-900 line-clamp-2 flex-grow transition-colors group-hover:text-emerald-800">
            {product.productName}
          </h3>

          <div className="flex items-center justify-between pt-6 border-t border-emerald-50/60">
            <div className="flex flex-col">
              {product.sellingPriceRetail ? (
                <span className="text-xl font-bold text-emerald-900 font-cormorant tracking-tight">
                  {formatPrice(product.sellingPriceRetail)}
                </span>
              ) : (
                <span className="text-sm font-bold text-slate-400 italic">Liên hệ báo giá</span>
              )}
            </div>
            
            <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800 transition-all duration-500 hover:scale-110 active:scale-90 group/btn overflow-hidden">
               <div className="absolute inset-0 bg-emerald-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
               <ShoppingCart size={20} className="relative z-10 group-hover/btn:text-white transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
