"use client";

import { useState, useEffect } from "react";
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
      <section className="relative overflow-hidden bg-gradient-to-br from-lime-500 via-green-500 to-emerald-500 pt-20 pb-24">
        <div className="absolute top-10 left-1/3 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-lime-400/20 rounded-full blur-3xl animate-pulse [animation-delay:0.8s]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-medium mb-6 backdrop-blur-sm">
            <Users size={14} />
            Cộng đồng Nam Việt
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
            Tin tức &amp;{" "}
            <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-lime-400 bg-clip-text text-transparent">
              Cộng đồng
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            Cập nhật thông tin mới nhất, chia sẻ kiến thức và kết nối cùng cộng đồng Nam Việt.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-2xl">
              <Search size={18} className="text-slate-400 ml-2 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài viết..."
                className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm py-1"
                id="community-search"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-1 text-slate-400 hover:text-white">
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><Eye size={14} className="text-teal-400" /> {(meta?.total || 0).toLocaleString()} bài viết</span>
            <span className="flex items-center gap-1.5"><MessageCircle size={14} className="text-emerald-400" /> Cộng đồng sôi động</span>
            <span className="flex items-center gap-1.5"><TrendingUp size={14} className="text-lime-400" /> Cập nhật hàng ngày</span>
          </div>
        </div>
      </section>

      {/* ── Tabs & Main ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-green-500 text-white shadow-lg shadow-lime-400/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-green-600 hover:text-green-500 dark:hover:text-emerald-400"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* Category filter */}
          {categories.length > 0 && (
            <div className="ml-auto shrink-0">
              <select
                onChange={(e) => {
                  // filter by category – could extend queryParams
                }}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-lime-400/30"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 3-column layout */}
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
                <Loader2 size={36} className="text-lime-400 animate-spin mb-4" />
                <p className="text-slate-500 text-sm">Đang tải bài viết...</p>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-lime-400/10 hover:text-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={15} /> Trước
                    </button>
                    <span className="text-sm text-slate-500 dark:text-slate-400 px-3">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-lime-400/10 hover:text-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Sau <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Trending / Featured */}
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                <Flame size={16} className="text-orange-500" />
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
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                  <Star size={16} className="text-lime-400" />
                  Danh mục
                </h3>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-lime-400/10 cursor-pointer group transition-all"
                      onClick={() => {}}
                    >
                      <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-green-500 dark:group-hover:text-emerald-400 transition-colors">
                        {cat.categoryName}
                      </span>
                      {cat._count && (
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
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
