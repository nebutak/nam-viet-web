import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Chạy trước mỗi request để kiểm tra authentication

// Routes không cần authentication
const publicRoutes = ["/login", "/signup", "/forgot-password", "/reset-password", "/error-404"];

// Routes chỉ dành cho guest (đã login thì không vào được)
const guestOnlyRoutes = ["/login", "/signup"];

// Routes cần authentication
const protectedRoutes = [
  "/",
  "/dashboard",
  "/products",
  "/inventory",
  "/warehouses",
  "/production",
  "/sales",
  "/customers",
  "/finance",
  "/users",
  "/reports",
  "/settings",
  "/profile",
  "/material",
  "/packaging",
  "/thanh-pham",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vì accessToken lưu ở RAM (Client), Middleware (Server) không đọc được.
  // Chỉ có refreshToken (HttpOnly Cookie) là được gửi kèm request lên Server.
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Có refreshToken trong cookie nghĩa là người dùng (khả năng cao) đã đăng nhập
  const isAuthenticated = !!refreshToken;

  // Logic kiểm tra loại route
  const isGuestOnlyRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));

  // Kiểm tra xem route hiện tại có thuộc nhóm protected không
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );


  // XỬ LÝ ĐIỀU HƯỚNG
  // Trường hợp 1: Đã login nhưng cố vào trang Guest (login, signup)
  // Đá về Dashboard 
  if(isAuthenticated && isGuestOnlyRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Trường hợp 2: Chưa Login mà cố vào trang Protected
  // Đá về trang Login
  if(!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);

    // Lưu lại url muốn vào để sau khi login xong redirect lại đó
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Các trường hợp khác (Public routes, static files...) -> Cho đi tiếp
  return NextResponse.next();
}

// Config matcher để loại trừ các file tĩnh, ảnh, api...
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.webp).*)",
  ],
};
