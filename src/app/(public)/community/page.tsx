"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePublicNewsList, usePublicFeaturedNews, usePublicNewsCategories } from "@/hooks/api/usePublicNews";
import CommunityPostCard from "@/components/public/CommunityPostCard";
import {
  Search,
  TrendingUp,
  Flame,
  Clock,
  Video,
  Star,
  ChevronLeft,
  ChevronRight,
  Users,
  MessageCircle,
  Eye,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";

const TABS = [
  { value: "", label: "Tất cả", icon: <Sparkles size={14} /> },
  { value: "featured", label: "Nổi bật", icon: <Star size={14} /> },
  { value: "video", label: "Video", icon: <Video size={14} /> },
  { value: "latest", label: "Mới nhất", icon: <Clock size={14} /> },
];

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 9;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch, activeTab]);

  const queryParams: any = {
    page,
    limit: LIMIT,
    status: "published",
    ...(debouncedSearch && { search: debouncedSearch }),
  };
  if (activeTab === "featured") queryParams.isFeatured = true;
  if (activeTab === "video") queryParams.contentType = "video";

  const { data: newsResponse, isLoading } = usePublicNewsList(queryParams);
  const { data: featuredList = [] } = usePublicFeaturedNews();
  const { data: categories = [] } = usePublicNewsCategories({ page: 1, limit: 20 });

  const posts = newsResponse?.data || [];
  const meta = newsResponse?.meta;
  const totalPages = meta?.totalPages || 1;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative w-full -mt-[80px] pt-[160px] pb-24 border-b-8 border-emerald-700 bg-emerald-900 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/carousel/carousel-02.png"
            alt="Đồng lúa xanh Nam Việt"
            fill
            className="object-cover"
            priority
          />
          {/* Lớp phủ nhạt hơn để nhìn rõ cảnh quang */}
          <div className="absolute inset-0 bg-emerald-900/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-black/20 to-transparent" />
          
          {/* MỚI: Lớp bọc sáng rực ở ĐỈNH TRANG để cứu Header màu đen */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/95 via-white/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-5 leading-tight drop-shadow-md">
            Tin Tức & Cộng Đồng
          </h1>
          <p className="mx-auto mb-14 max-w-2xl text-base md:text-lg font-medium text-emerald-50 leading-relaxed drop-shadow-sm">
            Nơi kết nối, chia sẻ kiến thức Nông nghiệp xanh và cập nhật thông tin mới nhất mỗi ngày.
          </p>
        </div>
      </section>

      {/* ── Bảng Điều Khiển (Search + Tabs) ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 md:mt-12 mb-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-4 lg:p-5">
          
          {/* Hàng 1: Khung Tìm Kiếm */}
          <div className="mb-5 lg:mb-6">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1.5 md:p-2 shadow-inner border border-slate-200 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Search size={20} className="ml-3 shrink-0 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm (VD: năng suất, hoa sinh...)"
                className="flex-1 bg-transparent py-1.5 px-2 text-sm md:text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                id="community-search"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1.5 mr-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-red-100 hover:text-red-700 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Hàng 2: Tabs Phân loại */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex items-center justify-center flex-1 lg:flex-none gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
                    activeTab === tab.value
                      ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Lọc danh mục */}
            {categories.length > 0 && (
              <div className="w-full lg:w-auto shrink-0">
                <select
                  onChange={(e) => {
                    // filter by category
                  }}
                  className="w-full lg:w-56 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 cursor-pointer hover:border-emerald-400 transition-colors"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* 3-column layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Featured post (first one if exists) */}
            {!isLoading && posts.length > 0 && page === 1 && activeTab === "" && !debouncedSearch && (
              <div className="mb-8">
                <CommunityPostCard post={posts[0]} variant="featured" />
              </div>
            )}

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 size={36} className="mb-4 animate-spin text-[var(--nv-sage)]" />
                <p className="text-sm text-[var(--nv-muted)]">Đang tải bài viết...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <MessageCircle size={28} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Không có bài viết
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {(page === 1 && activeTab === "" && !debouncedSearch ? posts.slice(1) : posts).map((post) => (
                    <CommunityPostCard key={post.id} post={post} />
                  ))}
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 mb-6">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 shrink-0"
                    >
                      <ChevronLeft size={16} /> Lùi lại
                    </button>
                    <span className="px-2 py-1 rounded bg-slate-100 text-sm font-bold text-slate-800 border">
                      Trang {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-300 disabled:border-slate-100 shrink-0"
                    >
                      Xem tiếp <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Trending / Featured */}
            <div className="nv-soft-card rounded-[28px] p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--nv-ink)]">
                <Flame size={16} className="text-[var(--nv-gold)]" />
                Bài nổi bật
              </h3>
              <div className="space-y-1">
                {featuredList.slice(0, 5).map((post) => (
                  <CommunityPostCard key={post.id} post={post} variant="compact" />
                ))}
                {featuredList.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">Chưa có bài nổi bật</p>
                )}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="nv-soft-card rounded-[28px] p-5">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-[var(--nv-ink)]">
                  <Star size={16} className="text-[var(--nv-sage)]" />
                  Danh mục
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="group flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 transition-all hover:bg-[rgba(113,136,111,0.08)]"
                      onClick={() => {}}
                    >
                      <span className="text-sm text-[var(--nv-muted)] transition-colors group-hover:text-[var(--nv-sage-strong)]">
                        {cat.categoryName}
                      </span>
                      {cat._count && (
                        <span className="rounded-full bg-[rgba(113,136,111,0.12)] px-2 py-0.5 text-xs text-[var(--nv-sage-strong)]">
                          {cat._count.news}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
