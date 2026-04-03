import { Gender } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge classNames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency in Vietnamese Dong
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Format number with thousands separator
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

// Format date in Vietnamese
export function formatDate(date: Date | string, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function formatDateFull(date: Date | string, format: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (format === "long") {
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(d);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}

// Format time only in Vietnamese
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

// Truncate text with ellipsis
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

// Generate slug from string
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Sleep function for delays
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Get image path
export const getImagePath = (path: string): string => {
  if (!path) return '';
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Return relative path - Next.js will rewrite to backend
  // /uploads/products/image.jpg -> rewritten to http://localhost:5000/uploads/products/image.jpg
  return path.startsWith('/') ? path : `/${path}`;
};

export function getDefaultAvatar(gender?: Gender | null): string {
  switch (gender) {
    case "male":
      return "/images/user/user-01.jpg";
    case "female":
      return "/images/user/user-02.jpg";
    default:
      // For 'other' or undefined gender
      return "/images/user/owner.jpg";
  }
}

export function getUserAvatar(avatarUrl?: string | null, gender?: Gender | null): string {
  // Return custom avatar if exists and is valid
  if (avatarUrl && avatarUrl.trim() !== "") {
    return avatarUrl;
  }

  // Fallback to gender-based default avatar
  return getDefaultAvatar(gender);
}

export function getAvatarInitials(fullName?: string | null): string {
  if (!fullName || fullName.trim() === "") {
    return "U"; // Default for "User"
  }

  const names = fullName.trim().split(" ").filter(Boolean);

  if (names.length === 0) {
    return "U";
  }

  if (names.length === 1) {
    // Single name: take first 2 characters
    return names[0].substring(0, 2).toUpperCase();
  }

  // Multiple names: take first character of first and last name
  const firstInitial = names[0][0];
  const lastInitial = names[names.length - 1][0];

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function getAvatarColor(name?: string | null): string {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  if (!name) {
    return colors[0];
  }

  // Generate index based on name hash
  const hash = name.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };