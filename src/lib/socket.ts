import { io, Socket } from "socket.io-client";
import { WS_URL } from "./constants";

// Socket.io client instance
let socket: Socket | null = null;

// Khởi tạo Socket.io connection
export const initSocket = (): Socket => {
  // Lấy token từ localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Nếu đã có socket connection, return luôn
  if (socket?.connected) {
    return socket;
  }

  // Tạo connection mới
  socket = io(WS_URL, {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  // Event listeners
  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("🔴 Socket connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
  });

  socket.on("reconnect_error", (error) => {
    console.error("🔴 Socket reconnection error:", error);
  });

  socket.on("reconnect_failed", () => {
    console.error("🔴 Socket reconnection failed");
  });

  return socket;
};

// Lấy socket instance hiện tại
export const getSocket = (): Socket | null => {
  return socket;
};

// Ngắt kết nối socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected manually");
  }
};

// Emit event đến server
export const emitEvent = (event: string, data?: any): void => {
  if (socket?.connected) {
    socket.emit(event, data);
  } else {
    console.warn("⚠️ Socket is not connected. Cannot emit event:", event);
  }
};

// Listen to event từ server
export const onEvent = (event: string, callback: (...args: any[]) => void): void => {
  if (socket) {
    socket.on(event, callback);
  }
};

// Remove event listener
export const offEvent = (event: string, callback?: (...args: any[]) => void): void => {
  if (socket) {
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }
};
