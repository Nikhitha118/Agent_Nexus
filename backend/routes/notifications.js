// Campus Sentinel AI - Notifications Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";

const router = express.Router();

// GET all notifications
router.get("/", (req, res) => {
  res.json({
    success: true,
    notifications: campusDataService.notifications
  });
});

// GET notifications by role (e.g. STUDENT, STAFF, SECURITY, MEDICAL)
router.get("/role/:role", (req, res) => {
  const role = req.params.role.toUpperCase();
  const filtered = campusDataService.notifications.filter(n => n.targetRole === role || n.targetRole === "ALL");
  res.json({
    success: true,
    role,
    notifications: filtered
  });
});

// POST mark as read
router.post("/mark-read", (req, res) => {
  const { id } = req.body;
  if (id) {
    const item = campusDataService.notifications.find(n => n.id === id);
    if (item) item.read = true;
  } else {
    campusDataService.notifications.forEach(n => { n.read = true; });
  }
  res.json({ success: true });
});

export default router;
