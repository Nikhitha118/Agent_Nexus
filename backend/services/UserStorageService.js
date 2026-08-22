// Campus Sentinel - Persistent User & Account Storage Service
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export const DEFAULT_DEPARTMENT_ACCOUNTS = {
  "admin": {
    id: "U-ADMIN-01",
    email: "admin@vignan.edu",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
    name: "Dr. K. Ramamurthy",
    title: "Dean of Campus Operations",
    badge: "Admin Authority",
    avatar: "👨‍💼",
    createdAt: "2026-01-01T00:00:00.000Z"
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
    avatar: "👩‍🏫",
    createdAt: "2026-01-01T00:00:00.000Z"
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
    avatar: "🎓",
    createdAt: "2026-01-01T00:00:00.000Z"
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
    avatar: "🛡️",
    createdAt: "2026-01-01T00:00:00.000Z"
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
    avatar: "🏥",
    createdAt: "2026-01-01T00:00:00.000Z"
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
    avatar: "🚌",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
};

class UserStorageService {
  constructor() {
    this.accountsMap = new Map();
    this.initStorage();
  }

  initStorage() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      let loadedAccounts = [];

      if (fs.existsSync(USERS_FILE)) {
        try {
          const raw = fs.readFileSync(USERS_FILE, "utf-8");
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedAccounts = parsed;
          }
        } catch (readErr) {
          console.warn("[UserStorageService] Warning reading users.json:", readErr.message);
        }
      }

      // Populate default accounts if missing
      const existingUsernames = new Set(loadedAccounts.map(a => (a.username || "").toLowerCase()));
      Object.values(DEFAULT_DEPARTMENT_ACCOUNTS).forEach(defaultAcc => {
        if (!existingUsernames.has(defaultAcc.username.toLowerCase())) {
          loadedAccounts.push(defaultAcc);
        }
      });

      // Index in fast memory Map
      this.accountsMap.clear();
      loadedAccounts.forEach(acc => {
        if (acc && acc.username) {
          this.accountsMap.set(acc.username.toLowerCase(), acc);
        }
        if (acc && acc.email) {
          this.accountsMap.set(acc.email.toLowerCase(), acc);
        }
      });

      // Persist to disk
      this.saveToDisk();
      console.log(`[UserStorageService] Successfully loaded and persisted ${this.getUniqueAccounts().length} user accounts.`);
    } catch (err) {
      console.error("[UserStorageService] Storage init error:", err);
    }
  }

  saveToDisk() {
    try {
      const uniqueAccounts = this.getUniqueAccounts();
      fs.writeFileSync(USERS_FILE, JSON.stringify(uniqueAccounts, null, 2), "utf-8");
    } catch (err) {
      console.error("[UserStorageService] Error writing users.json to disk:", err);
    }
  }

  getUniqueAccounts() {
    const seen = new Set();
    const unique = [];
    for (const acc of this.accountsMap.values()) {
      const cleanUser = (acc.username || "").toLowerCase();
      if (cleanUser && !seen.has(cleanUser)) {
        seen.add(cleanUser);
        unique.push(acc);
      }
    }
    return unique;
  }

  findAccount(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return this.accountsMap.get(clean) || null;
  }

  hasAccount(usernameOrEmail) {
    if (!usernameOrEmail) return false;
    const clean = usernameOrEmail.trim().toLowerCase();
    return this.accountsMap.has(clean);
  }

  saveAccount(account) {
    if (!account || !account.username) return false;
    const cleanUser = account.username.trim().toLowerCase();
    const cleanEmail = (account.email || `${cleanUser}@vignan.edu`).trim().toLowerCase();

    const record = {
      ...account,
      username: cleanUser,
      email: cleanEmail
    };

    this.accountsMap.set(cleanUser, record);
    this.accountsMap.set(cleanEmail, record);

    this.saveToDisk();
    return true;
  }
}

export const userStorageService = new UserStorageService();
