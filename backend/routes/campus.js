// Campus Sentinel - Campus Digital Twin Router (Strict Role-Protected Cameras)
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { CAMPUS_CENTER } from "../data/campusSeed.js";

const router = express.Router();

// GET all campus metadata
router.get("/overview", (req, res) => {
  res.json({
    success: true,
    center: CAMPUS_CENTER,
    buildingsCount: campusDataService.buildings.length,
    camerasCount: campusDataService.cameras.length,
    assemblyPointsCount: campusDataService.assemblyPoints.length,
    stats: campusDataService.getSystemStats()
  });
});

// GET buildings
router.get("/buildings", (req, res) => {
  res.json({ success: true, buildings: campusDataService.buildings });
});

// GET assembly points
router.get("/assembly-points", (req, res) => {
  res.json({ success: true, assemblyPoints: campusDataService.assemblyPoints });
});

// GET cameras — STRICT ROLE ACCESS (ADMIN & SECURITY ONLY)
router.get("/cameras", (req, res) => {
  const role = (req.headers["x-user-role"] || req.query.role || "").toUpperCase();

  if (role !== "ADMIN" && role !== "SECURITY") {
    return res.status(403).json({
      success: false,
      error: "Camera access restricted. Only authorized Admin and Security personnel may access live campus feeds.",
      cameras: []
    });
  }

  res.json({ success: true, cameras: campusDataService.cameras });
});

// GET graph nodes and edges
router.get("/graph", (req, res) => {
  res.json({
    success: true,
    nodes: campusDataService.nodes,
    edges: campusDataService.edges,
    blockedEdgeIds: Array.from(campusDataService.blockedEdgeIds)
  });
});

// GET system stats
router.get("/stats", (req, res) => {
  res.json({ success: true, stats: campusDataService.getSystemStats() });
});

export default router;
