// Campus Sentinel AI - AI Router (NLP & Vision)
import express from "express";
import { aiService } from "../services/AIService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

const router = express.Router();

// POST parse natural language emergency text
router.post("/report-nlp", async (req, res) => {
  const { text, autoDispatch } = req.body;
  if (!text) {
    return res.status(400).json({ success: false, error: "Text description is required" });
  }

  const analysis = await aiService.parseNaturalLanguageReport(text);

  if (autoDispatch && analysis.success) {
    const workflow = await agentOrchestrator.executeEmergencyWorkflow({
      type: analysis.extracted.type,
      title: `${analysis.extracted.type} - ${analysis.extracted.location}`,
      location: analysis.extracted.location,
      buildingId: analysis.extracted.buildingId,
      confidence: analysis.extracted.confidence,
      peopleAtRisk: analysis.extracted.peopleAtRisk
    });
    return res.json({ success: true, analysis, workflow });
  }

  res.json({ success: true, analysis });
});

// POST analyze uploaded image or frame
router.post("/vision-detect", async (req, res) => {
  const { imageBase64, metadata } = req.body;
  const analysis = await aiService.analyzeEmergencyImage(imageBase64, metadata || {});
  res.json(analysis);
});

export default router;
