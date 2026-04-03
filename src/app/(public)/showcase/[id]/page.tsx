"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePublicProduct, usePublicProducts } from "@/hooks/api/usePublicProducts";
import ProductCard from "@/components/public/ProductCard";
import {
  ArrowLeft,
  Package,
  Tag,
  Building2,
  Ruler,
  ShoppingCart,
  Star,
  Phone,
  Mail,
  Share2,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

function formatPrice(price: number | string | null | undefined) {
  if (!price) return null;
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return null;
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
}

function getStatusInfo(status: string) {
  const map: Record<string, { label: string; icon: React.ReactNode; cls: string }> = {
    active: {
      label: "Đang kinh doanh",
      icon: <CheckCircle size={14} />,
      cls: "bg-emerald-100 text-green-600 dark:bg-lime-400/15 dark:text-emerald-400",
    },
    inactive: {
      label: "Tạm ngừng",
      icon: <AlertCircle size={14} />,
      cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    },
    discontinued: {
      label: "Ngừng kinh doanh",
      icon: <XCircle size={14} />,
      cls: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
    },
  };
  return map[status] || { label: status, icon: null, cls: "bg-gray-100 text-gray-700" };
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    raw_material: "Nguyên liệu thô",
    packaging: "Vật liệu bao bì",
    finished_product: "Thành phẩm",
    goods: "Hàng hóa thương mại",
  };
  return map[type] || type;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: product, isLoading, isError } = usePublicProduct(Number(id));
  const { data: related } = usePublicProducts({ limit: 4, status: "active" });
  const relatedProducts = (related?.data || []).filter((p) => p.id !== Number(id)).slice(0, 4);

  const imageUrl = product?.image
    ? product.image.startsWith("http")
      ? product.image
      : `${API_BASE}/${product.image}`
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-lime-400 animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
          <Package size={36} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Sản phẩm không tồn tại hoặc đã bị xóa.</p>
        <Link
          href="/showcase"
          className="px-5 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
        >
          Quay lại trang sản phẩm
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusInfo(product.status);
  const retailPrice = formatPrice(product.sellingPriceRetail);
  const wholesalePrice = formatPrice(product.sellingPriceWholesale);
  const purchasePrice = formatPrice(product.purchasePrice);

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/showcase" className="hover:text-green-500 dark:hover:text-emerald-400 transition-colors">
              Sản phẩm
            </Link>
            <ChevronRight size={14} />
            {product.category && (
              <>
                <Link
                  href={`/showcase?category=${product.categoryId}`}
                  className="hover:text-green-500 dark:hover:text-emerald-400 transition-colors"
                >
                  {product.category.categoryName}
                </Link>
                <ChevronRight size={14} />
              </>
            )}
            <span className="text-slate-800 dark:text-slate-200 font-medium line-clamp-1">
              {product.productName}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-3xl overflow-hidden shadow-xl">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.productName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Package size={80} className="text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-sm text-slate-400">Chưa có hình ảnh</p>
                </div>
              )}

              {/* Featured badge */}
              {product.isFeatured && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-white text-xs font-bold shadow-lg">
                    <Star size={12} className="fill-white" /> Nổi bật
                  </div>
                </div>
              )}
            </div>

            {/* Share/Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigator.share?.({ title: product.productName, url: window.location.href })}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all"
              >
                <Share2 size={15} /> Chia sẻ
              </button>
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-all"
              >
                <ArrowLeft size={15} /> Quay lại
              </button>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            {/* Type badge + Status */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-lime-400/15 text-green-600 dark:text-emerald-400 text-xs font-semibold">
                {getTypeLabel(product.productType)}
              </span>
              <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.cls}`}>
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>

            {/* Name */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-snug">
                {product.productName}
              </h1>
              {product.description && (
                <p className="mt-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-lime-400/10 dark:to-green-500/10 rounded-2xl p-5 border border-emerald-100 dark:border-lime-400/20">
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Giá bán</h3>
              <div className="space-y-2">
                {retailPrice ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Giá lẻ</span>
                    <span className="text-2xl font-bold text-green-500 dark:text-emerald-400">{retailPrice}</span>
                  </div>
                ) : (
                  <p className="text-green-500 dark:text-emerald-400 font-semibold">Liên hệ để báo giá</p>
                )}
                {wholesalePrice && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-500">Giá sỉ</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{wholesalePrice}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">Thông tin chi tiết</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <Tag size={15} />, label: "Mã SKU", value: product.sku || "—" },
                  { icon: <Ruler size={15} />, label: "Đơn vị", value: product.unit?.unitName || product.unitId || "—" },
                  {
                    icon: <Building2 size={15} />,
                    label: "Nhà cung cấp",
                    value: (product as any).supplier?.supplierName || "—",
                  },
                  {
                    icon: <Tag size={15} />,
                    label: "Danh mục",
                    value: product.category?.categoryName || "—",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-start gap-2.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700/50"
                  >
                    <span className="text-lime-400 mt-0.5 shrink-0">{item.icon}</span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="tel:+84123456789"
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl bg-gradient-to-r from-green-400 to-lime-400 text-white font-semibold hover:from-green-600 hover:to-green-600 shadow-lg shadow-lime-400/30 transition-all duration-300"
              >
                <Phone size={16} /> Gọi tư vấn ngay
              </a>
              <a
                href="mailto:info@namviet.vn"
                className="flex items-center justify-center gap-2 flex-1 py-3 rounded-xl border-2 border-green-500 dark:border-lime-400 text-green-500 dark:text-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-lime-400/10 transition-all duration-200"
              >
                <Mail size={16} /> Báo giá qua email
              </a>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ShoppingCart size={20} className="text-lime-400" />
                Sản phẩm liên quan
              </h2>
              <Link
                href="/showcase"
                className="text-sm text-green-500 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Xem tất cả <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
