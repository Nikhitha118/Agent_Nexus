// Campus Sentinel AI - Real-time Socket.IO Connector
import { io } from "socket.io-client";

const rawSocketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "");
const SOCKET_URL = rawSocketUrl ? rawSocketUrl.replace(/\/$/, "") : "http://localhost:5000";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        transports: ["websocket", "polling"]
      });

      this.socket.on("connect", () => {
        console.log("🛡️ Connected to Sentinel Real-Time Gateway");
      });

      this.socket.on("connect_error", (err) => {
        console.warn("Socket connection warning:", err.message);
      });
    }
    return this.socket;
  }

  on(event, callback) {
    if (!this.socket) this.connect();
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (!this.socket) this.connect();
    this.socket.emit(event, data);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
