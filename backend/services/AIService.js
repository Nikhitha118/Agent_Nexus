// Campus Sentinel AI - AI Vision & NLP Reporting Service
// Pluggable multi-modal intelligence for text incident extraction and image analysis

import { BUILDINGS } from "../data/campusSeed.js";

export class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || null;
    this.modelProvider = process.env.AI_PROVIDER || "LOCAL_SENTINEL_INFERENCE";
  }

  // Multi-modal Quick Emergency AI Analysis
  async analyzeEmergencyQuickReport(payload = {}) {
    const {
      incidentType = "OTHER",
      location = "Campus Central Zone",
      description = "",
      hasImage = false,
      hasVideo = false,
      gpsCoords = null
    } = payload;

    const desc = (description || "").trim().toLowerCase();
    const hasEvidence = hasImage || hasVideo || desc.length > 0;

    if (!hasEvidence && (!location || location === "Unknown")) {
      return {
        success: true,
        insufficientEvidence: true,
        disclaimer: "Insufficient evidence — manual verification required.",
        assessment: {
          type: incidentType || "UNSPECIFIED",
          severity: "MEDIUM",
          confidence: 45,
          severityReason: "Insufficient evidence provided. Defaulted to standard priority pending manual responder verification.",
          affectedArea: location || "Unspecified Campus Area",
          visibleHazards: ["Unverified hazard report"],
          peopleAtRisk: 50,
          recommendedResponse: "Dispatch patrol security officer to physically verify location.",
          recommendedUnits: { security: 1, medical: 0, ambulance: 0, transport: 0 },
          isGeneralBroadcast: false
        }
      };
    }

    // 1. Inferred Incident Type
    let inferredType = incidentType;
    let confidence = 85;

    if (desc.includes("fire") || desc.includes("smoke") || desc.includes("flame") || desc.includes("burning") || desc.includes("explosion")) {
      inferredType = "FIRE";
      confidence = 94;
    } else if (desc.includes("medical") || desc.includes("heart") || desc.includes("collapsed") || desc.includes("unconscious") || desc.includes("bleeding") || desc.includes("fainted") || desc.includes("injury")) {
      inferredType = "MEDICAL";
      confidence = 92;
    } else if (desc.includes("weather") || desc.includes("storm") || desc.includes("lightning") || desc.includes("cyclone") || desc.includes("flooding") || desc.includes("tree fell")) {
      inferredType = "WEATHER";
      confidence = 90;
    } else if (desc.includes("accident") || desc.includes("crash") || desc.includes("collision") || desc.includes("vehicle") || desc.includes("bike")) {
      inferredType = "ACCIDENT";
      confidence = 88;
    } else if (desc.includes("security") || desc.includes("weapon") || desc.includes("intruder") || desc.includes("trespass") || desc.includes("fight") || desc.includes("theft")) {
      inferredType = "SECURITY";
      confidence = 91;
    } else if (desc.includes("crowd") || desc.includes("stampede") || desc.includes("overcrowd") || desc.includes("surge")) {
      inferredType = "CROWD";
      confidence = 89;
    }

    // Boost confidence if media attached
    if (hasImage && hasVideo) confidence = Math.min(98, confidence + 6);
    else if (hasImage || hasVideo) confidence = Math.min(96, confidence + 4);

    // 2. Severity Calculation & Reasoning Engine
    let severity = "HIGH";
    let severityReason = "";

    switch (inferredType) {
      case "FIRE":
        if (desc.includes("explosion") || desc.includes("spreading") || desc.includes("trapped") || desc.includes("large")) {
          severity = "CRITICAL";
          severityReason = "CRITICAL severity: Rapidly expanding fire/smoke detected with active combustible spread in an occupied university structure.";
        } else {
          severity = "HIGH";
          severityReason = "HIGH severity: Thermal/combustion hazard reported within academic perimeter requiring immediate structural evacuation.";
        }
        break;

      case "MEDICAL":
        if (desc.includes("unconscious") || desc.includes("heart") || desc.includes("bleeding") || desc.includes("severe")) {
          severity = "CRITICAL";
          severityReason = "CRITICAL severity: Life-threatening acute medical trauma reported requiring ALS ambulance triage within 4 minutes.";
        } else {
          severity = "HIGH";
          severityReason = "HIGH severity: Acute medical distress requiring paramedic intervention and campus clinic mobilization.";
        }
        break;

      case "WEATHER":
        severity = desc.includes("cyclone") || desc.includes("structural") ? "CRITICAL" : "MEDIUM";
        severityReason = `${severity} severity: Severe atmospheric conditions impacting campus mobility and building safety.`;
        break;

      case "ACCIDENT":
        severity = desc.includes("injury") || desc.includes("trapped") ? "HIGH" : "MEDIUM";
        severityReason = `${severity} severity: Vehicular/structural accident obstructing transit corridor and posing injury hazard.`;
        break;

      case "SECURITY":
        severity = desc.includes("weapon") || desc.includes("hostile") ? "CRITICAL" : "HIGH";
        severityReason = `${severity} severity: Active campus security breach requiring tactical lockdown and perimeter containment.`;
        break;

      case "CROWD":
        severity = desc.includes("stampede") || desc.includes("crush") ? "CRITICAL" : "HIGH";
        severityReason = `${severity} severity: High-density crowd bottleneck threatening physical safety and requiring flow dispersion.`;
        break;

      default:
        severity = "MEDIUM";
        severityReason = "MEDIUM severity: Campus operational incident requiring supervisor review and departmental dispatch.";
        break;
    }

    // 3. Matched Building & Occupancy
    let matchedBuilding = BUILDINGS[0];
    const locLower = location.toLowerCase();
    for (const b of BUILDINGS) {
      if (locLower.includes(b.name.toLowerCase()) || locLower.includes(b.code.toLowerCase())) {
        matchedBuilding = b;
        break;
      }
    }

    const peopleAtRisk = matchedBuilding ? Math.round(matchedBuilding.occupancy * 0.4) : 120;
    const affectedArea = `${location} (${matchedBuilding.code || "Zone"})`;

    // 4. Visible Hazards & Recommended Response
    let visibleHazards = [];
    if (inferredType === "FIRE") visibleHazards = ["Smoke Plume", "High Thermal Radiation", "Corridor Obstruction"];
    else if (inferredType === "MEDICAL") visibleHazards = ["Acute Patient Trauma", "Airway Compromise", "Stairwell Evac Needed"];
    else if (inferredType === "WEATHER") visibleHazards = ["High Wind Velocity", "Water Inundation", "Fallen Debris"];
    else if (inferredType === "ACCIDENT") visibleHazards = ["Vehicular Damage", "Spilled Fluids", "Blocked Transit Lane"];
    else if (inferredType === "SECURITY") visibleHazards = ["Unauthorized Intrusion", "Access Point Breach", "Physical Confrontation"];
    else if (inferredType === "CROWD") visibleHazards = ["High Crowd Density", "Crush Hazard", "Blocked Exit Turnstiles"];
    else visibleHazards = ["Unspecified Physical Hazard"];

    // 5. Dynamic Recommended Units
    let recommendedUnits = {
      security: 2,
      medical: 1,
      ambulance: 1,
      transport: 1,
      fireSafety: inferredType === "FIRE" ? 1 : 0
    };

    if (inferredType === "FIRE") {
      recommendedUnits = { security: 2, medical: 1, ambulance: 1, transport: 1, fireSafety: 2 };
    } else if (inferredType === "MEDICAL") {
      recommendedUnits = { security: 1, medical: 2, ambulance: 1, transport: 0, fireSafety: 0 };
    } else if (inferredType === "WEATHER") {
      recommendedUnits = { security: 2, medical: 1, ambulance: 0, transport: 2, fireSafety: 0 };
    } else if (inferredType === "ACCIDENT") {
      recommendedUnits = { security: 2, medical: 1, ambulance: 1, transport: 1, fireSafety: 0 };
    } else if (inferredType === "SECURITY") {
      recommendedUnits = { security: 3, medical: 1, ambulance: 0, transport: 0, fireSafety: 0 };
    } else if (inferredType === "CROWD") {
      recommendedUnits = { security: 3, medical: 1, ambulance: 1, transport: 1, fireSafety: 0 };
    }

    // 6. Role-Based Notification Broadcast Rule
    // General Emergencies: Fire, Medical, Weather -> All Users (Student, Faculty, Security, Medical, Transport, Admin)
    // Restricted: Accident, Security, Crowd -> Only Admin, Security, Medical
    const isGeneralBroadcast = ["FIRE", "MEDICAL", "WEATHER"].includes(inferredType);

    return {
      success: true,
      assessment: {
        type: inferredType,
        severity,
        confidence,
        severityReason,
        affectedArea,
        visibleHazards,
        peopleAtRisk,
        recommendedResponse: `Initiate rapid ${inferredType} protocols at ${location}. Deploy targeted response units and clear access perimeter.`,
        recommendedUnits,
        isGeneralBroadcast,
        disclaimer: "AI Assessment — Human Verification Recommended"
      }
    };
  }

  // Parse natural language emergency text report
  async parseNaturalLanguageReport(text) {
    if (!text || typeof text !== "string") {
      return { success: false, error: "Report text is required" };
    }

    const lower = text.toLowerCase();

    // 1. Identify Incident Type
    let type = "OTHER";
    let confidence = 85;

    if (lower.includes("fire") || lower.includes("smoke") || lower.includes("flame") || lower.includes("burning") || lower.includes("explosion")) {
      type = "FIRE";
      confidence = 94;
    } else if (lower.includes("medical") || lower.includes("heart") || lower.includes("collapse") || lower.includes("fainted") || lower.includes("bleeding") || lower.includes("unconscious") || lower.includes("seizure") || lower.includes("injured")) {
      type = "MEDICAL";
      confidence = 91;
    } else if (lower.includes("gun") || lower.includes("weapon") || lower.includes("intruder") || lower.includes("fight") || lower.includes("hostile") || lower.includes("trespass") || lower.includes("threat")) {
      type = "SECURITY";
      confidence = 93;
    } else if (lower.includes("flood") || lower.includes("water leak") || lower.includes("pipe burst") || lower.includes("submerged")) {
      type = "FLOOD";
      confidence = 88;
    } else if (lower.includes("crowd") || lower.includes("stampede") || lower.includes("crush") || lower.includes("overcrowd")) {
      type = "CROWD_EMERGENCY";
      confidence = 89;
    }

    // 2. Identify Location / Building
    let matchedBuilding = null;
    for (const b of BUILDINGS) {
      const nameParts = b.name.toLowerCase().split(" ");
      const codePart = b.code.toLowerCase();
      if (lower.includes(codePart) || lower.includes(b.name.toLowerCase()) || nameParts.some(p => p.length > 3 && lower.includes(p))) {
        matchedBuilding = b;
        break;
      }
    }

    if (!matchedBuilding) {
      if (lower.includes("main") || lower.includes("academic")) matchedBuilding = BUILDINGS[0];
      else if (lower.includes("cse") || lower.includes("computer") || lower.includes("ai")) matchedBuilding = BUILDINGS[1];
      else if (lower.includes("library") || lower.includes("book")) matchedBuilding = BUILDINGS[2];
      else if (lower.includes("engineering") || lower.includes("workshop") || lower.includes("lab")) matchedBuilding = BUILDINGS[3];
      else if (lower.includes("cafeteria") || lower.includes("student center") || lower.includes("food")) matchedBuilding = BUILDINGS[4];
      else if (lower.includes("dorm") || lower.includes("hostel") || lower.includes("residence")) matchedBuilding = BUILDINGS[8];
      else if (lower.includes("gym") || lower.includes("sports") || lower.includes("arena")) matchedBuilding = BUILDINGS[10];
      else matchedBuilding = BUILDINGS[0]; // fallback
    }

    // 3. Severity Assessment
    let severity = "HIGH";
    if (lower.includes("huge") || lower.includes("critical") || lower.includes("emergency") || lower.includes("many") || lower.includes("explosion") || lower.includes("trapped")) {
      severity = "CRITICAL";
    } else if (lower.includes("small") || lower.includes("minor") || lower.includes("slight")) {
      severity = "MODERATE";
    }

    // 4. People Affected estimation
    let peopleAtRisk = matchedBuilding ? matchedBuilding.occupancy : 300;
    if (lower.includes("many") || lower.includes("crowded")) peopleAtRisk = Math.round(peopleAtRisk * 1.1);
    if (lower.includes("few") || lower.includes("empty")) peopleAtRisk = Math.min(20, Math.round(peopleAtRisk * 0.1));

    // 5. Recommended Actions
    const recommendedActions = [
      `1. Immediate evacuation of ${matchedBuilding.name}.`,
      `2. Alert campus dispatch and mobile responders.`,
      `3. Establish ${matchedBuilding.code} perimeter safety zone.`
    ];

    return {
      success: true,
      rawInput: text,
      extracted: {
        type,
        location: matchedBuilding.name,
        buildingId: matchedBuilding.id,
        locationCoords: { lat: matchedBuilding.lat, lng: matchedBuilding.lng },
        severity,
        confidence,
        peopleAtRisk,
        hazardRadius: type === "FIRE" ? 85 : 45,
        summary: `NLP Extraction: ${severity} ${type} reported at ${matchedBuilding.name}. Estimated occupants at risk: ${peopleAtRisk}.`,
        recommendedActions
      },
      modelProvider: this.modelProvider
    };
  }

  // Vision mock / detector
  async analyzeEmergencyImage(imageBase64, metadata = {}) {
    return {
      success: true,
      detectedObjects: ["Thermal Anomaly", "Smoke Gradient"],
      confidence: 91,
      estimatedSeverity: "CRITICAL",
      metadata
    };
  }
}

export const aiService = new AIService();
