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
          title: "Fire Emergency - Main Academic Block",
          location: "Main Academic Block",
          buildingId: "B-01",
          locationCoords: { lat: 37.7772, lng: -122.4182 },
          hazardRadius: 85,
          severity: "CRITICAL",
          confidence: 94,
          detectedBy: "CAM-02 (2nd Floor Corridor)",
          cameraId: "CAM-02",
          peopleAtRisk: 620
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "MEDICAL":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "MEDICAL",
          title: "Medical Emergency - Student Activity Center",
          location: "Student Activity Center",
          buildingId: "B-05",
          locationCoords: { lat: 37.7754, lng: -122.4173 },
          hazardRadius: 40,
          severity: "HIGH",
          confidence: 91,
          detectedBy: "CAM-05 (Recreation Pavilion)",
          cameraId: "CAM-05",
          peopleAtRisk: 40
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "SECURITY":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "SECURITY",
          title: "Security Incident - North Gate Checkpoint",
          location: "North Gate / Security Command",
          buildingId: "B-08",
          locationCoords: { lat: 37.7788, lng: -122.4185 },
          hazardRadius: 50,
          severity: "HIGH",
          confidence: 89,
          detectedBy: "CAM-06 (North Gate 1)",
          cameraId: "CAM-06",
          peopleAtRisk: 120
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "WEATHER":
      case "FLOOD":
      case "SEVERE_WEATHER":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "WEATHER",
          title: "Severe Weather & Water Inundation - Bio Labs",
          location: "Biotechnology & Research Labs",
          buildingId: "B-06",
          locationCoords: { lat: 37.7770, lng: -122.4198 },
          hazardRadius: 60,
          severity: "HIGH",
          confidence: 88,
          detectedBy: "CAM-08 (Basement Perimeter)",
          cameraId: "CAM-08",
          peopleAtRisk: 190
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "CROWD":
      case "CROWD_EMERGENCY":
      case "CROWD_SURGE":
        return await agentOrchestrator.executeEmergencyWorkflow({
          type: "CROWD_EMERGENCY",
          title: "Crowd Surge Alert - Central Science Library",
          location: "Central Science Library",
          buildingId: "B-03",
          locationCoords: { lat: 37.7765, lng: -122.4162 },
          hazardRadius: 50,
          severity: "HIGH",
          confidence: 92,
          detectedBy: "CAM-03 (Library Atrium)",
          cameraId: "CAM-03",
          peopleAtRisk: 280
        }, { fastDemo, stepDelayMs: options.stepDelayMs || 350 });

      case "ROUTE_BLOCKAGE":
      case "BLOCK_ROAD":
        return agentOrchestrator.handleRoadBlockage("E-07");

      case "RESET":
        return agentOrchestrator.resetAll();

      default:
        return { success: false, message: `Unknown simulation scenario: ${scenarioKey}` };
    }
  }
}

export const simulationService = new SimulationService();
