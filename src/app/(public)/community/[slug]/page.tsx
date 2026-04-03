"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import {
  usePublicNewsBySlug,
  usePublicRelatedNews,
  useIncrementNewsView,
} from "@/hooks/api/usePublicNews";
import CommunityPostCard from "@/components/public/CommunityPostCard";
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Video,
  User,
  ChevronRight,
  Loader2,
  Share2,
  Tag,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function getImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path}`;
}

function getVideoUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path}`;
}

export default function CommunityArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, isError } = usePublicNewsBySlug(slug);
  const { data: related = [] } = usePublicRelatedNews(post?.id || 0, !!post?.id);
  const incrementView = useIncrementNewsView();

  // Auto increment view count
  useEffect(() => {
    if (post?.id) {
      incrementView.mutate(post.id);
    }
  }, [post?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-teal-500 animate-spin" />
          <p className="text-slate-500 text-sm">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
          <MessageCircle size={36} className="text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Không tìm thấy bài viết</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Bài viết không tồn tại hoặc đã bị xóa.</p>
        <Link href="/community" className="px-5 py-2.5 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors">
          Quay lại cộng đồng
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(post.featuredImage);
  const videoUrl = getVideoUrl(post.videoFile);
  const thumbUrl = getImageUrl(post.videoThumbnail);
  const isVideo = post.contentType === "video";

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <Link href="/community" className="hover:text-green-500 dark:hover:text-emerald-400 transition-colors">
              Cộng đồng
            </Link>
            <ChevronRight size={14} />
            <Link href={`/community?category=${post.categoryId}`} className="hover:text-green-500 dark:hover:text-emerald-400 transition-colors">
              {post.category?.categoryName}
            </Link>
            <ChevronRight size={14} />
            <span className="text-slate-800 dark:text-slate-200 font-medium line-clamp-1">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      {imageUrl && (
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Article */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Content */}
          <div className="lg:col-span-3">
            {/* Back button */}
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-green-500 dark:hover:text-emerald-400 transition-colors mb-6"
            >
              <ArrowLeft size={14} /> Quay lại cộng đồng
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 dark:bg-lime-400/15 text-green-500 dark:text-emerald-400 text-xs font-semibold">
                <Tag size={11} />
                {post.category?.categoryName}
              </span>
              {isVideo && (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-semibold">
                  <Video size={11} /> Video
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed border-l-4 border-lime-400 pl-4 mb-6 italic">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-700 mb-8 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-emerald-400" />
                {post.author?.fullName}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-emerald-400" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {formatCount(post.viewCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart size={13} /> {formatCount(post.likeCount)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={13} /> {formatCount(post.commentCount)}
                </span>
                <button
                  onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                  className="flex items-center gap-1 text-lime-400 hover:text-green-600 transition-colors"
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>

            {/* Video Player */}
            {isVideo && videoUrl && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                <video
                  controls
                  poster={thumbUrl || undefined}
                  className="w-full"
                  preload="metadata"
                >
                  <source src={videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              </div>
            )}

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
              {post.content.split("\n").map((paragraph, i) => (
                paragraph.trim() ? (
                  <p key={i} className="mb-4 text-base leading-7">{paragraph}</p>
                ) : (
                  <br key={i} />
                )
              ))}
            </div>

            {/* Tags from newsTagRelations */}
            {post.newsTagRelations && post.newsTagRelations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400 mr-1">Tags:</span>
                {post.newsTagRelations.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs hover:bg-emerald-100 dark:hover:bg-lime-400/15 hover:text-green-500 dark:hover:text-emerald-400 cursor-pointer transition-all"
                  >
                    #{tag.tagName}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Author card */}
              {post.author && (
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-lime-400 to-green-500 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    {post.author.fullName[0]}
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{post.author.fullName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tác giả</p>
                </div>
              )}

              {/* Stats */}
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 p-5">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Thống kê</h4>
                <div className="space-y-3">
                  {[
                    { icon: <Eye size={15} className="text-teal-400" />, label: "Lượt xem", value: formatCount(post.viewCount) },
                    { icon: <Heart size={15} className="text-red-400" />, label: "Yêu thích", value: formatCount(post.likeCount) },
                    { icon: <MessageCircle size={15} className="text-emerald-400" />, label: "Bình luận", value: formatCount(post.commentCount) },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {stat.icon} {stat.label}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share */}
              <button
                onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-400 to-lime-400 text-white font-medium text-sm hover:from-green-600 hover:to-green-600 transition-all shadow-lg shadow-lime-400/30"
              >
                <Share2 size={15} /> Chia sẻ bài viết
              </button>
            </div>
          </aside>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Bài viết liên quan</h2>
              <Link href="/community" className="text-sm text-green-500 dark:text-emerald-400 hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.slice(0, 3).map((p) => (
                <CommunityPostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
