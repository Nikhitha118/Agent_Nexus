// Campus Sentinel AI - Main Express + Socket.IO Server
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

import incidentsRouter from "./routes/incidents.js";
import campusRouter from "./routes/campus.js";
import resourcesRouter from "./routes/resources.js";
import agentsRouter from "./routes/agents.js";
import notificationsRouter from "./routes/notifications.js";
import analyticsRouter from "./routes/analytics.js";
import auditRouter from "./routes/audit.js";
import aiRouter from "./routes/ai.js";
import approvalsRouter from "./routes/approvals.js";
import authRouter from "./routes/auth.js";
import reportsRouter from "./routes/reports.js";
import { initializeSocketGateway } from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 10000;

// Universal CORS Middleware for local development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    // In local development or if origin matches allowed list or is a vercel deployment
    if (
      process.env.NODE_ENV !== "production" ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1")
    ) {
      return callback(null, true);
    }
    
    // Allow for hackathon production flexibility
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "x-user-role"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});
initializeSocketGateway(io);

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/campus", campusRouter);
app.use("/api/resources", resourcesRouter);
app.use("/api/agents", agentsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/audit", auditRouter);
app.use("/api/ai", aiRouter);
app.use("/api/approvals", approvalsRouter);
app.use("/api/reports", reportsRouter);

// Standard Render & Deployment Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Detailed API Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ONLINE",
    name: "Campus Sentinel AI Core Gateway",
    version: "2.4.0",
    engine: "Autonomous Multi-Agent Orchestration Graph",
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
});

// Start Server binding to 0.0.0.0 for Render / Cloud hosting
server.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(`🛡️  CAMPUS SENTINEL AI - MULTI-AGENT EMERGENCY SYSTEM`);
  console.log(`🚀  Backend Server running on port: ${PORT} (0.0.0.0)`);
  console.log(`📡  Socket.IO Gateway active and ready for live clients`);
  console.log(`=======================================================`);
});
