"use client";

import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, MessageCircle, Clock, Video, Star } from "lucide-react";
import type { News } from "@/hooks/api/useNews";

const API_BASE = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
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

interface CommunityPostCardProps {
  post: News;
  variant?: "default" | "featured" | "compact";
}

export default function CommunityPostCard({ post, variant = "default" }: CommunityPostCardProps) {
  const imageUrl = getImageUrl(post.featuredImage || post.videoThumbnail);
  const isVideo = post.contentType === "video";

  if (variant === "compact") {
    return (
      <Link href={`/community/${post.slug}`} className="group flex gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
          {imageUrl ? (
            <Image src={imageUrl} alt={post.title} fill className="object-cover" sizes="64px" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageCircle size={20} className="text-slate-400" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-green-500 dark:group-hover:text-emerald-400 transition-colors">
            {post.title}
          </p>
          <p className="text-xs text-slate-400 mt-1">{formatDate(post.createdAt)}</p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/community/${post.slug}`} className="group block relative rounded-2xl overflow-hidden aspect-[16/9]">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600" />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-lime-400/80 backdrop-blur-sm text-white text-[11px] font-semibold">
              {post.category?.categoryName}
            </span>
            {isVideo && (
              <span className="px-2.5 py-1 rounded-full bg-red-500/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                <Video size={11} /> Video
              </span>
            )}
            {post.isFeatured && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                <Star size={11} className="fill-white" /> Nổi bật
              </span>
            )}
          </div>
          <h3 className="text-white font-bold text-lg leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-slate-300 text-sm mt-2 line-clamp-2 hidden sm:block">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-4 mt-4 text-slate-300 text-xs">
            <span className="flex items-center gap-1"><Eye size={13} />{formatCount(post.viewCount)}</span>
            <span className="flex items-center gap-1"><Heart size={13} />{formatCount(post.likeCount)}</span>
            <span className="flex items-center gap-1"><MessageCircle size={13} />{formatCount(post.commentCount)}</span>
            <span className="flex items-center gap-1 ml-auto"><Clock size={13} />{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/community/${post.slug}`} className="group block">
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-lime-400/10 dark:hover:shadow-lime-400/5 transition-all duration-500 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-lime-400/20 flex items-center justify-center">
                {isVideo ? (
                  <Video size={28} className="text-emerald-400" />
                ) : (
                  <MessageCircle size={28} className="text-emerald-400" />
                )}
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {isVideo && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-semibold">
                <Video size={10} /> Video
              </span>
            )}
            {post.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400 text-white text-[10px] font-semibold">
                <Star size={10} className="fill-white" /> Nổi bật
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category + Date */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-lime-400 dark:text-emerald-400 uppercase tracking-wide">
              {post.category?.categoryName}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock size={11} />
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-green-500 dark:group-hover:text-emerald-400 transition-colors mb-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
              {post.excerpt}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-700/50">
            <span className="flex items-center gap-1 hover:text-lime-400 transition-colors cursor-pointer">
              <Eye size={13} /> {formatCount(post.viewCount)}
            </span>
            <span className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
              <Heart size={13} /> {formatCount(post.likeCount)}
            </span>
            <span className="flex items-center gap-1 hover:text-teal-500 transition-colors cursor-pointer">
              <MessageCircle size={13} /> {formatCount(post.commentCount)}
            </span>
            {post.author && (
              <span className="ml-auto text-slate-400 truncate max-w-[100px]">
                {post.author.fullName}
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-0.5 bg-gradient-to-r from-lime-400 to-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>
    </Link>
  );
}
