// Campus Sentinel AI - Unified Dev Runner (Frontend + Backend Concurrent Launcher)
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("=================================================================");
console.log("🛡️  CAMPUS SENTINEL AI - UNIFIED SYSTEM STARTUP");
console.log("=================================================================");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

// 1. Start Backend Server (Express + Socket.IO on Port 5000)
console.log("🚀 Starting Backend Express + Socket.IO Server on http://localhost:5000 ...");
const backendProcess = spawn(npmCmd, ["start"], {
  cwd: path.join(rootDir, "backend"),
  stdio: "inherit",
  shell: true
});

// 2. Start Frontend Dev Server (Vite on Port 5173)
console.log("⚡ Starting Frontend Vite Dev Server on http://localhost:5173 ...");
const frontendProcess = spawn(npmCmd, ["run", "dev"], {
  cwd: path.join(rootDir, "frontend"),
  stdio: "inherit",
  shell: true
});


const cleanup = () => {
  console.log("\n🛑 Stopping Campus Sentinel AI servers...");
  try { backendProcess.kill(); } catch (e) { }
  try { frontendProcess.kill(); } catch (e) { }
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
