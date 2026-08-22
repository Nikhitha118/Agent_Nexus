// Campus Sentinel AI - Authentication Router (Strict Security & Role Verification)
import express from "express";

const router = express.Router();

export const INITIAL_ACCOUNTS = {
  "admin": {
    id: "U-ADMIN-01",
    email: "admin@vignan.edu",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
    name: "Dr. K. Ramamurthy",
    title: "Dean of Campus Operations",
    badge: "Admin Authority",
    avatar: "👨‍💼"
  },
  "faculty": {
    id: "U-FAC-04",
    email: "faculty@vignan.edu",
    username: "faculty",
    password: "faculty123",
    role: "FACULTY",
    name: "Prof. Ananya Sharma",
    title: "Senior Faculty & Floor Warden",
    badge: "Faculty / Warden",
    avatar: "👩‍🏫"
  },
  "student": {
    id: "U-STU-2026",
    email: "student@vignan.edu",
    username: "student",
    password: "student123",
    role: "STUDENT",
    name: "Rahul Verma",
    title: "B.Tech Computer Science (3rd Year)",
    badge: "Student Civilian",
    avatar: "🎓"
  },
  "security": {
    id: "U-SEC-09",
    email: "security@vignan.edu",
    username: "security",
    password: "security123",
    role: "SECURITY",
    name: "Sgt. Sarah Chen",
    title: "Lead Delta Rapid Tactical Guard",
    badge: "Security Officer",
    avatar: "🛡️"
  },
  "medical": {
    id: "U-MED-03",
    email: "medical@vignan.edu",
    username: "medical",
    password: "medical123",
    role: "MEDICAL",
    name: "Dr. Karen Thorne",
    title: "Chief Trauma Physician / Paramedic",
    badge: "Medical Team Lead",
    avatar: "🏥"
  },
  "transport": {
    id: "U-TRANS-05",
    email: "transport@vignan.edu",
    username: "transport",
    password: "transport123",
    role: "TRANSPORT",
    name: "Campus Transit Fleet Dispatch",
    title: "Chief Transportation & Mobility Officer",
    badge: "Transport Fleet Coordinator",
    avatar: "🚌"
  }
};

// In-memory account store with initial accounts
const accountDatabase = new Map();
Object.values(INITIAL_ACCOUNTS).forEach(acc => {
  accountDatabase.set(acc.username.toLowerCase(), acc);
  accountDatabase.set(acc.email.toLowerCase(), acc);
});

// Helper to look up an account by username or email
export function findAccount(identifier) {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  return accountDatabase.get(clean) || null;
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

  // Step 1: Check whether the account exists
  const account = findAccount(loginId);
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

  // Step 3: Check selected role
  if (role && account.role.toUpperCase() !== role.toUpperCase()) {
    return res.status(403).json({
      success: false,
      error: `This account is not authorized for the selected role (${role.toUpperCase()}).`
    });
  }

  // Step 4: Login Success
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

  // Check if account already exists
  if (accountDatabase.has(cleanUsername)) {
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
    name: name ? name.trim() : `${targetRole} Officer`,
    title: department ? department.trim() : `${targetRole} Department`,
    badge: `${targetRole} Registered Member`,
    avatar: avatarMap[targetRole] || "👤",
    createdAt: new Date().toISOString()
  };

  accountDatabase.set(cleanUsername, newAccount);
  accountDatabase.set(newAccount.email.toLowerCase(), newAccount);

  // Return success message without automatic authentication
  res.json({
    success: true,
    message: "Registration successful. Please login with your registered credentials.",
    username: cleanUsername,
    role: targetRole
  });
});

export default router;
