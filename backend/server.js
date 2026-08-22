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

const PORT = process.env.PORT || 5000;

// Universal CORS Middleware for local development and production
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
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

// Health check endpoint
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

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️  CAMPUS SENTINEL AI - MULTI-AGENT EMERGENCY SYSTEM`);
  console.log(`🚀  Backend Server running on: http://localhost:${PORT}`);
  console.log(`📡  Socket.IO Gateway active and ready for live clients`);
  console.log(`=======================================================`);
});
