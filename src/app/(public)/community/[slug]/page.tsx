"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import {
  usePublicNewsBySlug,
  usePublicRelatedNews,
  useIncrementNewsView,
  usePublicNewsEngagement,
  useToggleNewsLike,
  usePublicNewsComments,
  useCreateNewsComment,
  useTrackNewsShare,
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
  Copy,
  Facebook,
  Instagram,
  Send,
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
  return path.startsWith("/") ? path : `/${path}`;
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
  const toggleLike = useToggleNewsLike();
  const createComment = useCreateNewsComment();
  const trackShare = useTrackNewsShare();
  const [clientId, setClientId] = useState("");
  const [commentForm, setCommentForm] = useState({ authorName: "", authorEmail: "", content: "" });
  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = useMemo(() => encodeURIComponent(articleUrl), [articleUrl]);

  useEffect(() => {
    const key = "namviet_news_client_id";
    let value = window.localStorage.getItem(key);
    if (!value) {
      value = `${Date.now()}-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(key, value);
    }
    setClientId(value);
  }, []);

  const { data: engagement } = usePublicNewsEngagement(post?.id || 0, clientId, !!post?.id && !!clientId);
  const { data: comments = [] } = usePublicNewsComments(post?.id || 0, !!post?.id);

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
          <Loader2 size={40} className="animate-spin text-[var(--nv-sage)]" />
          <p className="text-sm text-[var(--nv-muted)]">Đang tải bài viết...</p>
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
        <Link href="/community" className="nv-primary-button rounded-2xl px-5 py-2.5 font-medium text-white transition-colors">
          Quay lại cộng đồng
        </Link>
      </div>
    );
  }

  const imageUrl = getImageUrl(post.featuredImage);
  const videoUrl = getVideoUrl(post.videoFile);
  const thumbUrl = getImageUrl(post.videoThumbnail);
  const isVideo = post.contentType === "video";
  const displayCounts = {
    viewCount: engagement?.viewCount ?? post.viewCount ?? 0,
    likeCount: engagement?.likeCount ?? post.likeCount ?? 0,
    commentCount: engagement?.commentCount ?? post.commentCount ?? 0,
    shareCount: engagement?.shareCount ?? post.shareCount ?? 0,
  };
  const handleLike = async () => {
    if (!clientId) return;
    await toggleLike.mutateAsync({ id: post.id, clientId });
  };

  const handleShare = async (platform: "facebook" | "copy_link" | "instagram" | "native") => {
    await trackShare.mutateAsync({ id: post.id, platform, clientId: clientId || undefined });

    if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (platform === "copy_link") {
      await navigator.clipboard.writeText(articleUrl);
      toast.success("Đã copy link bài viết");
      return;
    }

    if (platform === "instagram") {
      await navigator.clipboard.writeText(articleUrl);
      window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
      toast.success("Đã copy link. Instagram không hỗ trợ chia sẻ trực tiếp từ web.");
      return;
    }

    await navigator.share?.({ title: post.title, url: articleUrl });
  };

  const handleSubmitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await createComment.mutateAsync({ id: post.id, data: commentForm });
    setCommentForm({ authorName: "", authorEmail: "", content: "" });
    toast.success("Bình luận đã được đăng thành công");
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[rgba(52,67,55,0.08)] bg-[rgba(255,255,255,0.64)] backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
            <Link href="/community" className="transition-colors hover:text-[var(--nv-sage-strong)]">
              Cộng đồng
            </Link>
            <ChevronRight size={14} />
            <Link href={`/community?category=${post.categoryId}`} className="transition-colors hover:text-[var(--nv-sage-strong)]">
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
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--nv-muted)] transition-colors hover:text-[var(--nv-sage-strong)]"
            >
              <ArrowLeft size={14} /> Quay lại cộng đồng
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="flex items-center gap-1 rounded-full bg-[rgba(113,136,111,0.12)] px-3 py-1 text-xs font-semibold text-[var(--nv-sage-strong)]">
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
              <p className="mb-6 border-l-4 border-[var(--nv-gold)] pl-4 text-lg italic leading-relaxed text-[var(--nv-muted)]">
                {post.excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-200 dark:border-slate-700 mb-8 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <User size={14} className="text-[var(--nv-sage)]" />
                {post.author?.fullName}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[var(--nv-sage)]" />
                {formatDate(post.publishedAt || post.createdAt)}
              </span>
              <div className="flex items-center gap-4 ml-auto">
                <span className="flex items-center gap-1">
                  <Eye size={13} /> {formatCount(displayCounts.viewCount)}
                </span>
                <button
                  type="button"
                  onClick={handleLike}
                  disabled={toggleLike.isPending}
                  className={`flex items-center gap-1 transition-colors hover:text-red-500 ${engagement?.liked ? "text-red-500" : ""}`}
                >
                  <Heart size={13} className={engagement?.liked ? "fill-current" : ""} /> {formatCount(displayCounts.likeCount)}
                </button>
                <span className="flex items-center gap-1">
                  <MessageCircle size={13} /> {formatCount(displayCounts.commentCount)}
                </span>
                <span className="flex items-center gap-1">
                  <Share2 size={13} /> {formatCount(displayCounts.shareCount)}
                </span>
              </div>
            </div>

            <div className="mb-8 flex flex-wrap items-center gap-2">
              <button onClick={() => handleShare("facebook")} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100">
                <Facebook size={15} /> Facebook
              </button>
              <button onClick={() => handleShare("copy_link")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                <Copy size={15} /> Copy link
              </button>
              <button onClick={() => handleShare("instagram")} className="inline-flex items-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-3 py-2 text-sm font-semibold text-pink-700 transition-colors hover:bg-pink-100">
                <Instagram size={15} /> Instagram
              </button>
              {typeof navigator !== "undefined" && Boolean(navigator.share) && (
                <button onClick={() => handleShare("native")} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100">
                  <Share2 size={15} /> Chia sẻ
                </button>
              )}
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
            <div 
              className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: post.content ? post.content.replace(/src="\/uploads/g, `src="${API_BASE}/uploads`) : ""
              }}
            />

            <section className="mt-10 border-t border-slate-200 pt-8">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Bình luận</h2>
                <span className="text-sm font-semibold text-slate-500">{comments.length} bình luận</span>
              </div>

              <form onSubmit={handleSubmitComment} className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm((prev) => ({ ...prev, authorName: e.target.value }))}
                    placeholder="Tên của bạn"
                    required
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  />
                  <input
                    value={commentForm.authorEmail}
                    onChange={(e) => setCommentForm((prev) => ({ ...prev, authorEmail: e.target.value }))}
                    placeholder="Email (không bắt buộc)"
                    type="email"
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  />
                </div>
                <textarea
                  value={commentForm.content}
                  onChange={(e) => setCommentForm((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Viết bình luận..."
                  required
                  rows={4}
                  className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                />
                <button
                  type="submit"
                  disabled={createComment.isPending}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
                >
                  <Send size={15} /> {createComment.isPending ? "Đang gửi..." : "Gửi bình luận"}
                </button>
              </form>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{comment.authorName}</div>
                      <time className="text-xs text-slate-500">{formatDate(comment.createdAt)}</time>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{comment.content}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">
                    Chưa có bình luận nào.
                  </p>
                )}
              </div>
            </section>

            {/* Tags from newsTagRelations */}
            {post.newsTagRelations && post.newsTagRelations.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400 mr-1">Tags:</span>
                {post.newsTagRelations.map(({ tag }: { tag: any }) => (
                  <span
                    key={tag.id}
                    className="cursor-pointer rounded-full bg-[rgba(113,136,111,0.08)] px-3 py-1 text-xs text-[var(--nv-muted)] transition-all hover:bg-[rgba(113,136,111,0.16)] hover:text-[var(--nv-sage-strong)]"
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
                <div className="nv-soft-card rounded-[28px] p-5 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#516754_0%,#769075_100%)] text-xl font-bold text-white">
                    {post.author.fullName[0]}
                  </div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{post.author.fullName}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Tác giả</p>
                </div>
              )}

              {/* Stats */}
              <div className="nv-soft-card rounded-[28px] p-5">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Thống kê</h4>
                <div className="space-y-3">
                  {[
                    { icon: <Eye size={15} className="text-[var(--nv-gold)]" />, label: "Lượt xem", value: formatCount(displayCounts.viewCount) },
                    { icon: <Heart size={15} className="text-red-400" />, label: "Yêu thích", value: formatCount(displayCounts.likeCount) },
                    { icon: <MessageCircle size={15} className="text-[var(--nv-sage)]" />, label: "Bình luận", value: formatCount(displayCounts.commentCount) },
                    { icon: <Share2 size={15} className="text-blue-400" />, label: "Chia sẻ", value: formatCount(displayCounts.shareCount) },
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
                onClick={() => handleShare("native")}
                className="nv-primary-button flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-medium text-white transition-all"
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
              <Link href="/community" className="flex items-center gap-1 text-sm text-[var(--nv-sage-strong)] hover:underline">
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
