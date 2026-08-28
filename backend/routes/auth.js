// Campus Sentinel - Authentication Router (Durable Persistent Storage & Role Verification)
import express from "express";
import { userStorageService, DEFAULT_DEPARTMENT_ACCOUNTS } from "../services/UserStorageService.js";

const router = express.Router();

export const INITIAL_ACCOUNTS = DEFAULT_DEPARTMENT_ACCOUNTS;

// Helper to look up an account by username or email
export function findAccount(identifier) {
  return userStorageService.findAccount(identifier);
}

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { loginId, password, role } = req.body;

  if (!loginId || !password) {
    return res.status(400).json({
      success: false,
      error: "Please enter your University ID / Username and Password."
    });
  }

  // Step 1: Check whether the account exists in persistent storage
  let account = userStorageService.findAccount(loginId);

  // Student Instant Verification (Hackathon Demo: Student University ID = Default Password)
  if (!account && role && role.toUpperCase() === "STUDENT" && loginId && password === loginId) {
    account = {
      id: `U-STU-${loginId.toUpperCase()}`,
      email: `${loginId.toLowerCase()}@vignan.edu`,
      username: loginId.toLowerCase(),
      password: password,
      role: "STUDENT",
      name: `Student (${loginId.toUpperCase()})`,
      title: "B.Tech Student",
      badge: "Student Civilian",
      avatar: "🎓",
      createdAt: new Date().toISOString()
    };
    userStorageService.saveAccount(account);
  }

  if (!account) {
    return res.status(401).json({
      success: false,
      error: "Invalid username or password."
    });
  }

  // Step 2: Check password
  if (account.password !== password) {
    return res.status(401).json({
      success: false,
      error: "Invalid username or password."
    });
  }

  // Step 3: Check selected role if specified
  if (role && account.role.toUpperCase() !== role.toUpperCase()) {
    return res.status(403).json({
      success: false,
      error: `This account is not authorized for the selected role (${role.toUpperCase()}). Registered role: ${account.role.toUpperCase()}.`
    });
  }

  // Step 4: Login Success - return sanitized user record
  const { password: _, ...userSafe } = account;
  res.json({
    success: true,
    user: userSafe,
    token: `sentinel-session-${Date.now()}`
  });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, username, password, role, department } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      success: false,
      error: "Username, Password, and Role are required."
    });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Check if account already exists in persistent storage
  if (userStorageService.hasAccount(cleanUsername)) {
    return res.status(409).json({
      success: false,
      error: "An account with this username already exists. Please login."
    });
  }

  const targetRole = role.toUpperCase();
  const avatarMap = {
    ADMIN: "👨‍💼",
    FACULTY: "👩‍🏫",
    STUDENT: "🎓",
    SECURITY: "🛡️",
    MEDICAL: "🏥",
    TRANSPORT: "🚌"
  };

  const newAccount = {
    id: `U-${targetRole}-${Date.now().toString(36)}`.toUpperCase(),
    email: `${cleanUsername}@vignan.edu`,
    username: cleanUsername,
    password: password,
    role: targetRole,
    name: name && name.trim() ? name.trim() : `${targetRole} Officer`,
    title: department && department.trim() ? department.trim() : `${targetRole} Department`,
    badge: `${targetRole} Registered Member`,
    avatar: avatarMap[targetRole] || "👤",
    createdAt: new Date().toISOString()
  };

  // Save permanently to disk and memory
  userStorageService.saveAccount(newAccount);

  // Return success message WITHOUT automatic authentication
  res.json({
    success: true,
    message: "Registration successful. Please login with your registered credentials.",
    username: cleanUsername,
    role: targetRole
  });
});

// GET /api/auth/users (for internal / debug verification if needed)
router.get("/users", (req, res) => {
  const safeAccounts = userStorageService.getUniqueAccounts().map(({ password, ...rest }) => rest);
  res.json({
    success: true,
    count: safeAccounts.length,
    users: safeAccounts
  });
});

export default router;
