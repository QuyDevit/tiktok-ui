// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_URL_SOCKET;

export default function useSocket(eventHandlers = {}) {
  const socketRef = useRef(null);
  useEffect(() => {
    console.log("🔌 Đang khởi tạo kết nối socket...");

    const socket = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    for (const [event, handler] of Object.entries(eventHandlers)) {
      socket.on(event, handler);
    }

    socketRef.current = socket;

    return () => {
      for (const [event, handler] of Object.entries(eventHandlers)) {
        socket.off(event, handler);
      }
      socket.disconnect();
      console.log("❌ Socket disconnected");
    };
  }, []);

  return socketRef;
}
