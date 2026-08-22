// Campus Sentinel AI - Agents Router
import express from "express";
import { campusDataService } from "../services/CampusDataService.js";
import { cameraVisionAgent } from "../agents/CameraVisionAgent.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

const router = express.Router();

// GET agent activity stream
router.get("/activities", (req, res) => {
  res.json({
    success: true,
    activities: campusDataService.agentActivities
  });
});

// POST process frame from browser webcam or CCTV camera
router.post("/frame-analysis", (req, res) => {
  const { cameraId, confidence, type, detected } = req.body;
  const targetCam = cameraId || "CAM-02";

  const result = cameraVisionAgent.processFrame(targetCam, {
    confidence: confidence !== undefined ? confidence : 0,
    type: type || "FIRE",
    detected: detected !== undefined ? detected : false
  });

  agentOrchestrator.broadcast("camera_updated", {
    camera: campusDataService.cameras.find(c => c.id === targetCam),
    analysis: result
  });

  // If temporal confirmation met (>80% consecutive), trigger emergency automatically if not already active
  if (result.temporalConfirmationMet && !campusDataService.activeIncident) {
    agentOrchestrator.executeEmergencyWorkflow({
      type: type || "FIRE",
      cameraId: targetCam,
      confidence: result.confidence
    });
  }

  res.json({ success: true, analysis: result });
});

// POST trigger judge demo fire
router.post("/demo-fire", async (req, res) => {
  const { cameraId, fastDemo } = req.body;
  const targetCam = cameraId || "CAM-02";

  const visionResult = cameraVisionAgent.triggerDemoFire(targetCam);
  const workflowResult = await agentOrchestrator.executeEmergencyWorkflow({
    type: "FIRE",
    cameraId: targetCam,
    confidence: 94
  }, { fastDemo });

  res.json({
    success: true,
    vision: visionResult,
    workflow: workflowResult
  });
});

// POST reset single camera
router.post("/reset-camera", (req, res) => {
  const { cameraId } = req.body;
  cameraVisionAgent.resetCamera(cameraId || "CAM-02");
  res.json({ success: true, message: `Camera ${cameraId} reset.` });
});

export default router;
