"use client";

import { useState, useEffect } from "react";
import { usePublicProducts } from "@/hooks/api/usePublicProducts";
import ProductCard from "@/components/public/ProductCard";
import {
  Search,
  SlidersHorizontal,
  Package,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Grid3x3,
  List,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const PRODUCT_TYPES = [
  { value: "", label: "Tất cả", emoji: "🛍️" },
  { value: "goods", label: "Hàng hóa", emoji: "📦" },
  { value: "finished_product", label: "Thành phẩm", emoji: "✨" },
  { value: "raw_material", label: "Nguyên liệu", emoji: "🌿" },
  { value: "packaging", label: "Bao bì", emoji: "🎁" },
];

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Mới nhất" },
  { value: "productName_asc", label: "Tên A → Z" },
  { value: "productName_desc", label: "Tên Z → A" },
  { value: "sellingPriceRetail_asc", label: "Giá tăng dần" },
  { value: "sellingPriceRetail_desc", label: "Giá giảm dần" },
];

export default function ShowcasePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [productType, setProductType] = useState("");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const LIMIT = 12;

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, productType, sort]);

  const [sortField, sortOrder] = sort.split("_");

  const { data: productsResponse, isLoading, isFetching } = usePublicProducts({
    page,
    limit: LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(productType && { productType: productType as any }),
    sortBy: sortField,
    sortOrder: sortOrder as "asc" | "desc",
    status: "active",
  });

  const products = productsResponse?.data || [];
  const meta = productsResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500 pt-20 pb-24">
        {/* Background orbs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lime-400/20 border border-lime-400/30 text-emerald-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="animate-spin [animation-duration:3s]" />
            Danh mục sản phẩm Nam Việt
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-5 leading-tight">
            Sản phẩm{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-lime-400 to-lime-400 bg-clip-text text-transparent">
              chất lượng cao
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Khám phá bộ sưu tập đa dạng từ nguyên liệu, bao bì đến thành phẩm – đáp ứng mọi nhu cầu sản xuất và thương mại.
          </p>

          {/* Search Hero */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
              <Search size={20} className="text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-base py-1"
                id="showcase-search"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 text-slate-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              )}
              <button className="px-5 py-2.5 bg-gradient-to-r from-green-400 to-lime-400 text-white rounded-xl font-medium text-sm hover:from-green-600 hover:to-green-600 transition-all duration-200 shadow-lg shadow-lime-400/30 shrink-0">
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Quick type filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {PRODUCT_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setProductType(t.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  productType === t.value
                    ? "bg-white text-green-600 shadow-lg shadow-white/20"
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
                }`}
              >
                <span>{t.emoji}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center flex-wrap gap-6 py-3">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Package size={16} className="text-lime-400" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200">{meta?.total || 0}</strong> sản phẩm
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <TrendingUp size={16} className="text-lime-400" />
              <span>Cập nhật liên tục</span>
            </div>

            {/* Spacer */}
            <div className="ml-auto flex items-center gap-3">
              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-lime-400/30"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* View mode */}
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-green-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"} transition-all`}
                >
                  <Grid3x3 size={15} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-green-500 text-white" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"} transition-all`}
                >
                  <List size={15} />
                </button>
              </div>

              {/* Filters toggle on mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all lg:hidden"
              >
                <SlidersHorizontal size={14} /> Lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-28">
            <Loader2 size={40} className="text-lime-400 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
              <Package size={36} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm sản phẩm phù hợp.
            </p>
            {(search || productType) && (
              <button
                onClick={() => { setSearch(""); setProductType(""); }}
                className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className={`grid gap-6 ${
              isFetching ? "opacity-60 pointer-events-none" : ""
            } ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2"
            } transition-opacity duration-200`}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-lime-400/10 hover:text-green-500 dark:hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} /> Trước
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <div key={p} className="flex">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span key={`dot-${p}`} className="px-1 text-slate-400">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                            p === page
                              ? "bg-green-500 text-white shadow-lg shadow-lime-400/30"
                              : "text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-lime-400/10 hover:text-green-500 dark:hover:text-emerald-400"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-lime-400/10 hover:text-green-500 dark:hover:text-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Sau <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-lime-500 to-green-500 py-16 mt-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Cần tư vấn sản phẩm?</h2>
          <p className="text-emerald-200 mb-8">
            Đội ngũ của chúng tôi sẵn sàng hỗ trợ bạn tìm sản phẩm phù hợp nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/community"
              className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur text-white font-medium hover:bg-white/30 transition-all border border-white/20"
            >
              Đọc tin tức & Blog
            </Link>
            <a
              href="mailto:info@namviet.vn"
              className="px-6 py-3 rounded-xl bg-white text-green-600 font-semibold hover:bg-emerald-50 transition-all shadow-lg"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
