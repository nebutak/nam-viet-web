"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Video, Star, ChevronRight } from "lucide-react";
import type { News } from "@/hooks/api/useNews";

const API_BASE = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getImageUrl(path?: string) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}/${path}`;
}

interface CommunityPostCardProps {
  post: News;
  variant?: "default" | "featured" | "compact";
}

export default function CommunityPostCard({ post, variant = "default" }: CommunityPostCardProps) {
  const imageUrl = getImageUrl(post.featuredImage || post.videoThumbnail);
  const isVideo = post.contentType === "video";

  if (variant === "compact") {
    return (
      <Link href={`/community/${post.slug}`} className="group flex gap-4 rounded-[20px] p-3 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-200">
        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[14px] bg-slate-100 border border-slate-200">
          {imageUrl ? (
            <Image src={imageUrl} alt={post.title} fill className="object-cover" sizes="96px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Star size={24} className="text-slate-300" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex flex-col justify-center">
          <p className="line-clamp-2 text-base font-bold text-slate-900 group-hover:text-emerald-700 leading-snug">
            {post.title}
          </p>
          <p className="mt-1.5 text-sm font-medium text-slate-500 flex items-center gap-1.5">
            <Clock size={14} /> {formatDate(post.createdAt)}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/community/${post.slug}`} className="group block relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-[32px] border border-slate-200 shadow-sm">
        <div className="absolute inset-0 bg-slate-800" />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-xl bg-white px-3 py-1 text-sm font-bold text-emerald-800 shadow-sm">
              {post.category?.categoryName || "Tin tức"}
            </span>
            {isVideo && (
              <span className="flex items-center gap-1 rounded-xl bg-red-600 px-3 py-1 text-sm font-bold text-white shadow-sm">
                <Video size={14} /> Video
              </span>
            )}
            {post.isFeatured && (
              <span className="flex items-center gap-1 rounded-xl bg-amber-500 px-3 py-1 text-sm font-bold text-white shadow-sm">
                <Star size={14} className="fill-white" /> Nổi bật
              </span>
            )}
            <span className="flex items-center gap-1.5 ml-auto text-sm font-medium text-slate-200 bg-black/40 px-3 py-1 rounded-xl backdrop-blur-md">
              <Clock size={14} /> {formatDate(post.createdAt)}
            </span>
          </div>
          
          <h3 className="line-clamp-2 text-xl md:text-2xl font-bold leading-tight text-white mb-3 group-hover:text-emerald-100 transition-colors">
            {post.title}
          </h3>
          
          {post.excerpt && (
            <p className="text-slate-200 text-sm md:text-base line-clamp-2 max-w-4xl font-medium leading-relaxed">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/community/${post.slug}`} className="group flex flex-col h-full overflow-hidden rounded-[32px] bg-white border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-emerald-200">
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-200">
              {isVideo ? (
                <Video size={36} className="text-slate-400" />
              ) : (
                <Star size={36} className="text-slate-400" />
              )}
            </div>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex gap-2">
          {isVideo && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 shadow-md text-white text-sm font-bold tracking-wide">
              <Video size={14} /> Video
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="flex justify-between items-center mb-4">
          <span className="inline-block rounded-lg bg-emerald-50 px-3 py-1 text-sm font-bold uppercase tracking-widest text-emerald-800 border border-emerald-100/50">
            {post.category?.categoryName || "Tin tức"}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
            <Clock size={14} />
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h3 className="mb-3 text-base md:text-lg font-bold leading-snug text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-3">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-slate-600 mb-6 leading-relaxed flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
          {post.author ? (
            <span className="text-sm font-bold text-slate-700">
              Đăng bởi: <span className="text-emerald-700">{post.author.fullName}</span>
            </span>
          ) : (
            <span className="text-sm font-bold text-slate-500">Ban biên tập</span>
          )}
          
          <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
            Xem ngay <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
