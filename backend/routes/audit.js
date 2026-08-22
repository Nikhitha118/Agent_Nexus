// Campus Sentinel AI - Audit Logs Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";

const router = express.Router();

// GET all audit logs
router.get("/", (req, res) => {
  res.json({
    success: true,
    totalLogs: campusDataService.auditLogs.length,
    auditLogs: campusDataService.auditLogs
  });
});

export default router;
