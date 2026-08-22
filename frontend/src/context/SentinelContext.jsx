// Campus Sentinel - Central Application Context & Real-Time Sync Provider
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { socketService } from "../services/socket";
import {
  fetchCampusData,
  fetchActiveIncident,
  fetchResources,
  fetchReports,
  submitReportApi,
  generateAiReportApi,
  updateReportStatusApi,
  analyzeEmergencyQuickReportApi,
  submitQuickEmergencyAlertApi,
  resolveActiveIncident,
  loginUser,
  registerUser
} from "../services/api";
import { audioService } from "../services/AudioNotificationService";

const SentinelContext = createContext(null);

// Initial Predefined Registered Accounts for Departmental Verification
export const DEFAULT_ACCOUNTS = [
  {
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
  {
    id: "U-FAC-04",
    email: "faculty@vignan.edu",
    username: "faculty",
    password: "faculty123",
    role: "FACULTY",
    name: "Prof. Ananya Sharma",
    title: "Senior CSE Faculty & Floor Warden",
    badge: "Faculty / Warden",
    avatar: "👩‍🏫"
  },
  {
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
  {
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
  {
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
  {
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
];

function getStoredAccounts() {
  try {
    const raw = localStorage.getItem("sentinel_registered_accounts");
    if (!raw) return DEFAULT_ACCOUNTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? [...DEFAULT_ACCOUNTS, ...parsed] : DEFAULT_ACCOUNTS;
  } catch (e) {
    return DEFAULT_ACCOUNTS;
  }
}

function saveRegisteredAccountLocally(account) {
  try {
    const raw = localStorage.getItem("sentinel_registered_accounts");
    const existing = raw ? JSON.parse(raw) : [];
    existing.push(account);
    localStorage.setItem("sentinel_registered_accounts", JSON.stringify(existing));
  } catch (e) {
    console.error("Local storage error:", e);
  }
}

// Initial Reports Seed for Local Storage Fallback
const DEFAULT_INITIAL_REPORTS = [
  {
    id: "REP-2026-0812",
    category: "CLASSROOM",
    title: "Classroom Air Conditioning System Malfunction",
    location: "Block B, Room 204",
    description: "AC is not working in classroom B204. It is not cooling properly and making vibrating noise.",
    priority: "MEDIUM",
    submittedBy: {
      id: "U-STU-2026",
      name: "Rahul Verma",
      username: "student",
      role: "STUDENT",
      department: "B.Tech Computer Science"
    },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiReport: {
      title: "Classroom Air Conditioning System Malfunction",
      location: "Block B, Room 204",
      summary: "The air conditioning system in classroom Block B Room 204 is currently non-functional, resulting in inadequate cooling and mechanical vibration.",
      problem: "The classroom AC unit is reported to be non-functional with inadequate refrigerant cooling.",
      requestedAction: "Please inspect the air conditioning compressor unit and restore normal cooling operation.",
      priority: "MEDIUM",
      attachmentsNote: "Photo evidence attached by student.",
      routedDepartment: "ADMIN"
    },
    attachments: {
      imageUrl: null,
      videoUrl: null,
      imageName: "ac_unit_b204.jpg",
      videoName: null
    },
    routedDepartment: "ADMIN",
    status: "IN_PROGRESS",
    timeline: [
      {
        status: "NEW",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedBy: "Rahul Verma (Student)",
        notes: "Initial report submitted via Student Assistance Portal."
      },
      {
        status: "ACKNOWLEDGED",
        timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        updatedBy: "Admin Operations",
        notes: "Assigned ticket to Facilities HVAC Maintenance Desk."
      },
      {
        status: "IN_PROGRESS",
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        updatedBy: "Facilities Lead",
        notes: "Technician dispatched to inspect compressor circuit."
      }
    ]
  },
  {
    id: "REP-2026-0809",
    category: "TRANSPORTATION",
    title: "Route 4 Campus Shuttle Air Conditioning Malfunction",
    location: "South Transit Terminal (Bus #TB-03)",
    description: "Bus TB-03 AC blower is blowing warm air on the morning 8:30 AM route.",
    priority: "MEDIUM",
    submittedBy: {
      id: "U-FAC-04",
      name: "Prof. Ananya Sharma",
      username: "faculty",
      role: "FACULTY",
      department: "Senior CSE Faculty"
    },
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    aiReport: {
      title: "Campus Transit Fleet Climate Control System Fault",
      location: "South Transit Terminal (Bus #TB-03)",
      summary: "Cabin climate control unit on transit vehicle TB-03 is discharging ambient uncooled air.",
      problem: "Refrigerant loop or blower compressor failure in shuttle cabin.",
      requestedAction: "Transit mechanics to inspect compressor belt and refill refrigerant at fleet depot.",
      priority: "MEDIUM",
      attachmentsNote: "Reported by faculty commuter.",
      routedDepartment: "TRANSPORT"
    },
    attachments: {
      imageUrl: null,
      videoUrl: null,
      imageName: null,
      videoName: null
    },
    routedDepartment: "TRANSPORT",
    status: "ACKNOWLEDGED",
    timeline: [
      {
        status: "NEW",
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        updatedBy: "Prof. Ananya Sharma (Faculty)",
        notes: "Report submitted via Faculty Campus Support Portal."
      },
      {
        status: "ACKNOWLEDGED",
        timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(),
        updatedBy: "Transport Fleet Dispatch",
        notes: "Vehicle queued for depot inspection at 12:00 PM turnaround."
      }
    ]
  }
];

const getStoredSession = () => {
  try {
    const raw = localStorage.getItem("sentinel_session") || sessionStorage.getItem("sentinel_session");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && parsed.role ? parsed : null;
  } catch {
    return null;
  }
};

export const SentinelProvider = ({ children }) => {
  // Authentication & Role State (Durable session persistence across page reload / restart)
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredSession());
  const [currentRole, setCurrentRole] = useState(() => {
    const s = getStoredSession();
    return s && s.role ? s.role : "ADMIN";
  });

  const [activeTab, setActiveTab] = useState("HOME");
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Issue Reporting Context State
  const [reports, setReports] = useState(() => {
    try {
      const saved = localStorage.getItem("sentinel_reports_store");
      return saved ? JSON.parse(saved) : DEFAULT_INITIAL_REPORTS;
    } catch {
      return DEFAULT_INITIAL_REPORTS;
    }
  });

  const [activeReportingCategory, setActiveReportingCategory] = useState(null);
  const [selectedReportForDetails, setSelectedReportForDetails] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  // Digital Twin Core State
  const [buildings, setBuildings] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [assemblyPoints, setAssemblyPoints] = useState([]);
  const [resources, setResources] = useState({
    security: [],
    medical: [],
    ambulances: [],
    fireSafety: [],
    transitVehicles: []
  });
  const [graphNodes, setGraphNodes] = useState({});
  const [graphEdges, setGraphEdges] = useState([]);
  const [blockedEdgeIds, setBlockedEdgeIds] = useState([]);

  // Incidents & Notifications
  const [activeIncident, setActiveIncident] = useState(null);
  const [incidentsHistory, setIncidentsHistory] = useState([]);
  const [activeEmergencyEvent, setActiveEmergencyEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isEmergencyAiModalOpen, setIsEmergencyAiModalOpen] = useState(false);
  const [resolveModalIncident, setResolveModalIncident] = useState(null);
  const [successToast, setSuccessToast] = useState(null);

  // Refresh all state from API
  const refreshAll = useCallback(async () => {
    const campusRes = await fetchCampusData(currentRole);
    if (campusRes.success) {
      setBuildings(campusRes.buildings || []);
      setCameras(campusRes.cameras || []);
      setAssemblyPoints(campusRes.assemblyPoints || []);
      if (campusRes.graph) {
        setGraphNodes(campusRes.graph.nodes || {});
        setGraphEdges(campusRes.graph.edges || []);
        setBlockedEdgeIds(campusRes.graph.blockedEdgeIds || []);
      }
    }

    const incRes = await fetchActiveIncident();
    if (incRes.success && incRes.activeIncident) {
      setActiveIncident(incRes.activeIncident);
      setActiveEmergencyEvent({
        eventId: incRes.activeIncident.id,
        eventType: incRes.activeIncident.type,
        severity: incRes.activeIncident.severity,
        source: "Emergency AI",
        initiatedBy: "System Gateway",
        initiatedByRole: "AI",
        timestamp: incRes.activeIncident.createdAt || new Date().toISOString(),
        status: "ACTIVE",
        affectedArea: incRes.activeIncident.location,
        summary: incRes.activeIncident.summary
      });
    }

    const resRes = await fetchResources();
    if (resRes.success && resRes.resources) {
      setResources(resRes.resources);
    }

    // Fetch reports from backend
    const repRes = await fetchReports();
    if (repRes.success && Array.isArray(repRes.reports) && repRes.reports.length > 0) {
      setReports(repRes.reports);
      try {
        localStorage.setItem("sentinel_reports_store", JSON.stringify(repRes.reports));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    refreshAll();

    // Socket Event Subscriptions
    const socket = socketService.connect();

    socket.on("initial_state", (state) => {
      if (state.activeIncident) setActiveIncident(state.activeIncident);
      if (state.buildings) setBuildings(state.buildings);
      if (state.cameras) setCameras(state.cameras);
      if (state.resources) setResources(state.resources);
      if (state.assemblyPoints) setAssemblyPoints(state.assemblyPoints);
      if (state.notifications) setNotifications(state.notifications);
    });

    socket.on("new_report", (newReport) => {
      setReports(prev => {
        const next = [newReport, ...prev.filter(r => r.id !== newReport.id)];
        try { localStorage.setItem("sentinel_reports_store", JSON.stringify(next)); } catch (e) {}
        return next;
      });
      audioService.playAlertChime();
    });

    socket.on("report_updated", (updatedReport) => {
      setReports(prev => {
        const next = prev.map(r => r.id === updatedReport.id ? updatedReport : r);
        try { localStorage.setItem("sentinel_reports_store", JSON.stringify(next)); } catch (e) {}
        return next;
      });
    });

    socket.on("new_notification", (notifData) => {
      const items = Array.isArray(notifData) ? notifData : [notifData];
      setNotifications(prev => [...items, ...prev].slice(0, 50));
      audioService.playAlertChime();
    });

    socket.on("incident_created", (newInc) => {
      setActiveIncident(newInc);
      setActiveEmergencyEvent({
        eventId: newInc.id,
        eventType: newInc.type,
        severity: newInc.severity || "CRITICAL",
        source: "Emergency AI",
        initiatedBy: newInc.detectedBy || "Emergency AI Gateway",
        initiatedByRole: "AI",
        timestamp: new Date().toISOString(),
        status: "ACTIVE",
        affectedArea: newInc.location
      });
      audioService.playEmergencySiren();
    });

    socket.on("incident_resolved", (resolvedInc) => {
      setActiveIncident(null);
      setActiveEmergencyEvent(null);
      audioService.playAlertChime();
    });

    return () => {
      socketService.disconnect();
    };
  }, [refreshAll]);

  // Submit Report Method with Automatic Routing & Local Storage Sync
  const submitNewReport = async (reportPayload) => {
    let resultReport = null;

    try {
      const res = await submitReportApi(reportPayload);
      if (res && res.success && res.report) {
        resultReport = res.report;
      }
    } catch (e) {
      console.warn("Backend report submit offline, storing locally:", e);
    }

    if (!resultReport) {
      // Fallback local report creation
      const category = reportPayload.category || "OTHER";
      const catUpper = category.toUpperCase();
      let routedDept = "ADMIN";
      if (catUpper.includes("TRANS")) routedDept = "TRANSPORT";
      else if (catUpper.includes("MED")) routedDept = "MEDICAL";
      else if (catUpper.includes("SEC")) routedDept = "SECURITY";

      resultReport = {
        id: `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        category: category,
        title: reportPayload.title || (reportPayload.aiReport ? reportPayload.aiReport.title : "Campus Issue Report"),
        location: reportPayload.location || "Campus Area",
        description: reportPayload.description,
        priority: reportPayload.priority || "MEDIUM",
        submittedBy: reportPayload.submittedBy || currentUser || {
          id: "U-STU-2026",
          name: "Rahul Verma",
          role: "STUDENT"
        },
        createdAt: new Date().toISOString(),
        aiReport: reportPayload.aiReport,
        attachments: reportPayload.attachments || { imageUrl: null, videoUrl: null, imageName: null, videoName: null },
        routedDepartment: routedDept,
        status: "NEW",
        timeline: [
          {
            status: "NEW",
            timestamp: new Date().toISOString(),
            updatedBy: `${currentUser ? currentUser.name : "Reporter"} (${currentUser ? currentUser.role : "User"})`,
            notes: "Initial issue report submitted via Sentinel Portal."
          }
        ]
      };
    }

    // Update state & localStorage
    setReports(prev => {
      const next = [resultReport, ...prev.filter(r => r.id !== resultReport.id)];
      try { localStorage.setItem("sentinel_reports_store", JSON.stringify(next)); } catch (e) {}
      return next;
    });

    // Create Notification
    const notif = {
      id: `NOTIF-${Date.now()}`,
      reportId: resultReport.id,
      targetRole: resultReport.routedDepartment,
      type: "ISSUE_DISPATCH",
      title: `NEW ${resultReport.category ? resultReport.category.replace("_", " ").toUpperCase() : "CAMPUS"} ISSUE`,
      message: `${resultReport.title} reported at ${resultReport.location}.`,
      severity: resultReport.priority,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      status: "UNREAD",
      linkId: resultReport.id
    };

    setNotifications(prev => [notif, ...prev]);

    return { success: true, report: resultReport };
  };

  // Change Report Status (NEW -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED)
  const changeReportStatus = async (reportId, newStatus, notes = "") => {
    try {
      await updateReportStatusApi(reportId, newStatus, currentUser ? currentUser.name : "Officer", notes);
    } catch (e) {
      console.warn("Backend status update offline, updating locally:", e);
    }

    setReports(prev => {
      const next = prev.map(r => {
        if (r.id === reportId) {
          const updatedTimeline = r.timeline || [];
          updatedTimeline.push({
            status: newStatus,
            timestamp: new Date().toISOString(),
            updatedBy: `${currentUser ? currentUser.name : "Department Officer"} (${currentUser ? currentUser.role : "ADMIN"})`,
            notes: notes || `Status updated to ${newStatus}`
          });
          return {
            ...r,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            timeline: updatedTimeline
          };
        }
        return r;
      });
      try { localStorage.setItem("sentinel_reports_store", JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  // Generate AI Report Helper
  const generateAiReport = async (payload) => {
    try {
      const res = await generateAiReportApi(payload);
      if (res && res.success && res.aiReport) {
        return res.aiReport;
      }
    } catch (e) {
      console.warn("Backend AI report generator offline, using client logic:", e);
    }

    // Client-side fallback AI generator
    const cleanLoc = (payload.location || "").trim() || "Campus Area";
    const cleanDesc = (payload.description || "").trim() || "Issue reported.";
    const cat = (payload.category || "").toUpperCase();

    let title = "Campus Departmental Issue";
    let problem = cleanDesc;
    let action = `Please inspect the reported issue at ${cleanLoc} and initiate appropriate departmental resolution.`;
    let priority = "MEDIUM";
    let targetDept = "ADMIN";

    if (cat.includes("TRANS")) {
      targetDept = "TRANSPORT";
      title = "Campus Transit & Transportation Issue";
      problem = `Transportation or shuttle concern logged: ${cleanDesc}`;
      action = `Transit fleet coordinators to verify vehicle telemetry and adjust schedule.`;
    } else if (cat.includes("MED")) {
      targetDept = "MEDICAL";
      title = "Campus Health & Medical Assistance Request";
      problem = `Medical assistance requested at ${cleanLoc}: ${cleanDesc}`;
      action = `Emergency medical responders dispatched with first-aid trauma kit.`;
      priority = "HIGH";
    } else if (cat.includes("SEC")) {
      targetDept = "SECURITY";
      title = "Campus Safety & Security Incident Report";
      problem = `Security or perimeter anomaly reported: ${cleanDesc}`;
      action = `Campus Security patrol dispatched for perimeter verification.`;
      priority = "HIGH";
    } else if (cat.includes("CLASS")) {
      targetDept = "ADMIN";
      if (cleanDesc.toLowerCase().includes("ac") || cleanDesc.toLowerCase().includes("cooling")) {
        title = "Classroom Air Conditioning System Malfunction";
        problem = `The air conditioning system in ${cleanLoc} is currently not functioning properly, resulting in inadequate cooling.`;
        action = `Please inspect the air conditioning compressor unit and restore normal cooling operation.`;
      } else {
        title = "Classroom Facility & Infrastructure Concern";
        problem = cleanDesc;
        action = `Facilities management to conduct on-site inspection at ${cleanLoc}.`;
      }
    } else if (cat.includes("CABIN") || cat.includes("OFFICE")) {
      targetDept = "ADMIN";
      title = "Faculty Office & Cabin Infrastructure Issue";
      problem = `Facility issue in faculty cabin at ${cleanLoc}: ${cleanDesc}`;
      action = `Campus Facilities to inspect cabin infrastructure and address maintenance request.`;
    } else if (cat.includes("SALARY") || cat.includes("ADMIN")) {
      targetDept = "ADMIN";
      title = "Faculty Administrative & Payroll Ingestion Query";
      problem = `Administrative documentation inquiry: ${cleanDesc}`;
      action = `Campus Administrative & Finance Directorate to review employee records.`;
      priority = "LOW";
    }

    let attachmentsNote = "No media files attached.";
    if (payload.imageAttached && payload.videoAttached) {
      attachmentsNote = "Attached Evidence: 1 High-Resolution Photo + 1 Video Demonstration.";
    } else if (payload.imageAttached) {
      attachmentsNote = "Attached Evidence: 1 Photographic Evidence Image.";
    } else if (payload.videoAttached) {
      attachmentsNote = "Attached Evidence: 1 Video Recording Demonstration.";
    }

    return {
      title,
      location: cleanLoc,
      summary: `The ${title.toLowerCase()} at ${cleanLoc} was reported by ${payload.reporterName || payload.reporterRole || "a campus member"}. ${problem}`,
      problem,
      requestedAction: action,
      priority,
      attachmentsNote,
      routedDepartment: targetDept
    };
  };

  // Open & Close Emergency AI Quick Modal
  const openEmergencyAiModal = () => setIsEmergencyAiModalOpen(true);
  const closeEmergencyAiModal = () => setIsEmergencyAiModalOpen(false);

  // Submit Emergency Quick Alert (No login required)
  const submitEmergencyQuickAlert = async (payload) => {
    try {
      const res = await submitQuickEmergencyAlertApi(payload);
      if (res && res.success && res.incident) {
        setActiveIncident(res.incident);
        setActiveEmergencyEvent({
          eventId: res.incident.id,
          eventType: res.incident.type,
          severity: res.incident.severity,
          source: "Emergency AI Quick Alert",
          initiatedBy: payload.reportedBy?.name || "Campus Member",
          initiatedByRole: payload.reportedBy?.role || "CIVILIAN",
          timestamp: res.incident.createdAt || new Date().toISOString(),
          status: "ACTIVE",
          affectedArea: res.incident.location,
          summary: res.incident.summary
        });
        if (res.alerts && Array.isArray(res.alerts)) {
          setNotifications(prev => [...res.alerts, ...prev]);
        }
        return res;
      }
    } catch (e) {
      console.warn("Backend quick alert offline, creating local incident:", e);
    }

    // Fallback local incident creation
    const incId = `INC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const localIncident = {
      id: incId,
      type: (payload.incidentType || "FIRE").toUpperCase(),
      title: `${(payload.incidentType || "FIRE").toUpperCase()} EMERGENCY - ${payload.location || "Campus"}`,
      location: payload.location || "Campus Central Zone",
      severity: payload.aiAssessment?.severity || "HIGH",
      confidence: payload.aiAssessment?.confidence || 88,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      summary: `${payload.incidentType || "Emergency"} reported at ${payload.location}. Safe evacuation zone: Assembly Point B. Responders mobilized.`,
      description: payload.description,
      attachments: payload.attachments,
      aiAssessment: payload.aiAssessment,
      isGeneralBroadcast: ["FIRE", "MEDICAL", "WEATHER"].includes((payload.incidentType || "").toUpperCase())
    };

    setActiveIncident(localIncident);
    setActiveEmergencyEvent({
      eventId: localIncident.id,
      eventType: localIncident.type,
      severity: localIncident.severity,
      source: "Emergency AI Quick Alert",
      initiatedBy: payload.reportedBy?.name || "Campus Member",
      initiatedByRole: payload.reportedBy?.role || "CIVILIAN",
      timestamp: localIncident.createdAt,
      status: "ACTIVE",
      affectedArea: localIncident.location,
      summary: localIncident.summary
    });

    const notif = {
      id: `NOTIF-${Date.now()}`,
      targetRole: "ALL",
      type: "EMERGENCY_BROADCAST",
      title: `🚨 EMERGENCY ALERT: ${localIncident.type}`,
      message: `Emergency reported at ${localIncident.location}. Severity: ${localIncident.severity}. Please follow campus safe route.`,
      severity: localIncident.severity,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      status: "UNREAD",
      linkId: localIncident.id
    };
    setNotifications(prev => [notif, ...prev]);

    return { success: true, message: "Emergency alert submitted successfully", incident: localIncident };
  };

  // Analyze Quick Report with AI
  const analyzeEmergencyQuickReport = async (payload) => {
    try {
      const res = await analyzeEmergencyQuickReportApi(payload);
      if (res && res.success && res.assessment) {
        return res;
      }
    } catch (e) {
      console.warn("Backend emergency AI offline, using client fallback:", e);
    }
    // Fallback client assessment
    const type = (payload.incidentType || "FIRE").toUpperCase();
    const isGeneral = ["FIRE", "MEDICAL", "WEATHER"].includes(type);
    return {
      success: true,
      assessment: {
        type,
        severity: type === "FIRE" || type === "MEDICAL" ? "CRITICAL" : "HIGH",
        confidence: 88,
        severityReason: `${type} reported in active campus perimeter with immediate response required.`,
        affectedArea: payload.location || "Central Campus Zone",
        visibleHazards: ["Active Incident Zone", "Access Road Blockage"],
        peopleAtRisk: 120,
        recommendedResponse: `Dispatch first responders to ${payload.location || "scene"}.`,
        recommendedUnits: { security: 2, medical: 1, ambulance: 1, transport: 1, fireSafety: type === "FIRE" ? 2 : 0 },
        isGeneralBroadcast: isGeneral,
        disclaimer: "AI Assessment — Human Verification Recommended"
      }
    };
  };

  // Resolve Modal Helpers
  const openResolveModal = (incident = null) => {
    setResolveModalIncident(incident || activeIncident);
  };
  const closeResolveModal = () => {
    setResolveModalIncident(null);
  };

  // Resolve Active Incident (Real State Transition & Toast Feedback)
  const resolveEmergencyIncident = async (incidentId = null, notes = "Incident resolved and campus secured.") => {
    const targetId = incidentId || (activeIncident ? activeIncident.id : null);
    try {
      if (targetId) {
        await resolveActiveIncident(targetId, notes);
      }
    } catch (e) {
      console.warn("Backend resolve offline, updating local state:", e);
    }

    if (activeIncident) {
      const resolvedEntry = {
        ...activeIncident,
        status: "RESOLVED",
        resolvedAt: new Date().toISOString(),
        resolvedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : "Officer",
        resolutionNotes: notes
      };
      setIncidentsHistory(prev => [resolvedEntry, ...prev.filter(i => i.id !== resolvedEntry.id)]);
    }

    setActiveIncident(null);
    setActiveEmergencyEvent(null);
    setResolveModalIncident(null);

    // Add Notification
    const notif = {
      id: `NOTIF-${Date.now()}`,
      targetRole: "ALL",
      type: "INCIDENT_RESOLVED",
      title: "✅ EMERGENCY RESOLVED",
      message: `Emergency incident at ${activeIncident ? activeIncident.location : "campus"} resolved and area confirmed safe.`,
      severity: "LOW",
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      status: "UNREAD"
    };
    setNotifications(prev => [notif, ...prev]);

    // Show Green Success Toast
    setSuccessToast("Emergency incident resolved successfully.");
    setTimeout(() => {
      setSuccessToast(null);
    }, 4000);
  };

  const resolveIncident = resolveEmergencyIncident;

  // Strict Credential Validation & Login Method
  const validateAndLogin = async ({ loginId, password, selectedRole }) => {
    if (!loginId || !password) {
      return { success: false, error: "Please enter your University ID / Username and Password." };
    }

    // 1. Try Backend Verification (Durable Database)
    try {
      const apiRes = await loginUser(loginId, password, selectedRole);
      if (apiRes && apiRes.success && apiRes.user) {
        setCurrentUser(apiRes.user);
        setCurrentRole(apiRes.user.role);
        setIsAuthenticated(true);
        setActiveTab("HOME");
        localStorage.setItem("sentinel_session", JSON.stringify(apiRes.user));
        sessionStorage.setItem("sentinel_session", JSON.stringify(apiRes.user));
        return { success: true, user: apiRes.user };
      }
      if (apiRes && !apiRes.networkError) {
        return { success: false, error: apiRes.error || "Invalid username or password." };
      }
    } catch (err) {
      console.warn("Backend auth offline, using local verification:", err);
    }

    // 2. Strict Local Verification Fallback (Only if backend completely unreachable)
    const accounts = getStoredAccounts();
    const cleanId = (loginId || "").trim().toLowerCase();

    const account = accounts.find(
      a => (a.username.toLowerCase() === cleanId || a.email.toLowerCase() === cleanId)
    );

    if (!account) {
      return { success: false, error: "Invalid username or password." };
    }

    if (account.password !== password) {
      return { success: false, error: "Invalid username or password." };
    }

    if (selectedRole && account.role.toUpperCase() !== selectedRole.toUpperCase()) {
      return {
        success: false,
        error: `This account is not authorized for the selected role (${selectedRole.toUpperCase()}). Registered role: ${account.role.toUpperCase()}.`
      };
    }

    const userSafe = {
      id: account.id,
      email: account.email,
      username: account.username,
      role: account.role,
      name: account.name,
      title: account.title,
      badge: account.badge,
      avatar: account.avatar
    };

    setCurrentUser(userSafe);
    setCurrentRole(userSafe.role);
    setIsAuthenticated(true);
    setActiveTab("HOME");
    localStorage.setItem("sentinel_session", JSON.stringify(userSafe));
    sessionStorage.setItem("sentinel_session", JSON.stringify(userSafe));
    return { success: true, user: userSafe };
  };

  // Register Method
  const registerAccount = async ({ name, username, password, role, department }) => {
    const cleanUsername = (username || "").trim().toLowerCase();
    const targetRole = (role || "STUDENT").toUpperCase();

    if (!cleanUsername || !password) {
      return {
        success: false,
        error: "Username and Password are required."
      };
    }

    // Call backend persistent registration
    try {
      const apiRes = await registerUser(name, cleanUsername, password, targetRole, department);
      if (apiRes && !apiRes.success && !apiRes.networkError) {
        return {
          success: false,
          error: apiRes.error || "Registration failed. Please try again."
        };
      }
    } catch (e) {
      console.warn("Backend registration offline, caching locally:", e);
    }

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
      name: name && name.trim() ? name.trim() : `${targetRole} Officer`,
      title: department && department.trim() ? department.trim() : `${targetRole} Department`,
      badge: `${targetRole} Registered Member`,
      avatar: avatarMap[targetRole] || "👤",
      createdAt: new Date().toISOString()
    };

    saveRegisteredAccountLocally(newAccount);

    return {
      success: true,
      message: "Registration successful. Please login with your registered credentials.",
      username: cleanUsername,
      role: targetRole
    };
  };

  // Logout Method
  const logout = () => {
    setCurrentUser(null);
    setCurrentRole("ADMIN");
    setIsAuthenticated(false);
    setActiveTab("HOME");
    setActiveReportingCategory(null);
    setSelectedReportForDetails(null);
    sessionStorage.removeItem("sentinel_session");
    localStorage.removeItem("sentinel_session");
  };

  // Audio Toggle
  const toggleMute = () => {
    setIsAudioMuted(prev => !prev);
  };

  return (
    <SentinelContext.Provider
      value={{
        // Auth
        isAuthenticated,
        currentUser,
        currentRole,
        validateAndLogin,
        registerAccount,
        logout,

        // Navigation
        activeTab,
        setActiveTab,

        // Issue & Reporting System
        reports,
        submitNewReport,
        changeReportStatus,
        generateAiReport,
        activeReportingCategory,
        setActiveReportingCategory,
        selectedReportForDetails,
        setSelectedReportForDetails,
        reportModalOpen,
        setReportModalOpen,

        // Digital Twin & Campus
        buildings,
        cameras,
        assemblyPoints,
        resources,
        graphNodes,
        graphEdges,
        blockedEdgeIds,

        // Incidents & Notifications
        activeIncident,
        activeEmergencyEvent,
        incidentsHistory,
        notifications,
        isEmergencyAiModalOpen,
        openEmergencyAiModal,
        closeEmergencyAiModal,
        submitEmergencyQuickAlert,
        analyzeEmergencyQuickReport,
        resolveEmergencyIncident,
        resolveIncident,
        resolveModalIncident,
        openResolveModal,
        closeResolveModal,
        successToast,
        setSuccessToast,

        // Audio
        isAudioMuted,
        toggleMute
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
};

export const useSentinel = () => {
  const ctx = useContext(SentinelContext);
  if (!ctx) throw new Error("useSentinel must be used within a SentinelProvider");
  return ctx;
};
