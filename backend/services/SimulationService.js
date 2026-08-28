// Campus Sentinel AI - Emergency Simulation Service
// Automates realistic hackathon demonstration scenarios

import { agentOrchestrator } from "../agents/AgentOrchestrator.js";
import { campusDataService } from "./CampusDataService.js";

export class SimulationService {
  async runScenario(scenarioKey, options = {}) {
    const fastDemo = options.fastDemo || false;
    const key = (scenarioKey || "").toUpperCase();

    switch (key) {
      case "FIRE":
      case "FIRE_DEMO":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "FIRE",
          title: "Fire Emergency - A-Block (Main Academic)",
          location: "A-Block",
          buildingId: "a-block",
          locationCoords: { lat: 16.232529, lng: 80.547941 },
          hazardRadius: 85,
          severity: "CRITICAL",
          confidence: 94,
          detectedBy: "CAM-02 (A-Block Floor 2)",
          cameraId: "CAM-02",
          peopleAtRisk: 620
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "MEDICAL":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "MEDICAL",
          title: "Medical Emergency - MHP Auditorium",
          location: "MHP",
          buildingId: "mhp",
          locationCoords: { lat: 16.231920, lng: 80.548350 },
          hazardRadius: 40,
          severity: "HIGH",
          confidence: 91,
          detectedBy: "CAM-07 (MHP Cultural Complex)",
          cameraId: "CAM-07",
          peopleAtRisk: 45
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "SECURITY":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "SECURITY",
          title: "Security Alert - North Checkpoint",
          location: "N-Block",
          buildingId: "n-block",
          locationCoords: { lat: 16.234180, lng: 80.549650 },
          hazardRadius: 50,
          severity: "HIGH",
          confidence: 89,
          detectedBy: "CAM-01 (North Gate)",
          cameraId: "CAM-01",
          peopleAtRisk: 120
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "WEATHER":
      case "FLOOD":
      case "SEVERE_WEATHER":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "WEATHER",
          title: "Severe Weather & Water Inundation - Pharmacy Wing",
          location: "Pharmacy Block",
          buildingId: "pharmacy-block",
          locationCoords: { lat: 16.231420, lng: 80.549250 },
          hazardRadius: 60,
          severity: "HIGH",
          confidence: 88,
          detectedBy: "CAM-05 (Pharmacy Quad)",
          cameraId: "CAM-05",
          peopleAtRisk: 190
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "CROWD":
      case "CROWD_EMERGENCY":
      case "CROWD_SURGE":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "CROWD_EMERGENCY",
          title: "Crowd Surge Alert - NTR Library",
          location: "NTR Library",
          buildingId: "ntr-library",
          locationCoords: { lat: 16.233572, lng: 80.548722 },
          hazardRadius: 50,
          severity: "HIGH",
          confidence: 92,
          detectedBy: "CAM-04 (NTR Library Circle)",
          cameraId: "CAM-04",
          peopleAtRisk: 280
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "ROUTE_BLOCKAGE":
      case "BLOCK_ROAD":
        return agentOrchestrator.handleRoadBlockage("edge-central-h");

      case "RESET":
        return agentOrchestrator.resetAll();

      default:
        return { success: false, message: `Unknown simulation scenario: ${scenarioKey}` };
    }
  }
}

export const simulationService = new SimulationService();
