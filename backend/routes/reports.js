// Campus Sentinel - Departmental Issue & Report Routing Service
import express from "express";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

const router = express.Router();

// Department Routing Map
export const ROUTING_RULES = {
  CLASSROOM: "ADMIN",
  CABIN_OFFICE: "ADMIN",
  SALARY_ADMIN: "ADMIN",
  OTHER: "ADMIN",
  FACULTY_OTHER: "ADMIN",
  STUDENT_OTHER: "ADMIN",
  TRANSPORTATION: "TRANSPORT",
  STUDENT_TRANSPORTATION: "TRANSPORT",
  FACULTY_TRANSPORTATION: "TRANSPORT",
  MEDICAL: "MEDICAL",
  SECURITY: "SECURITY"
};

export const determineDepartment = (category) => {
  const cat = (category || "").toUpperCase();
  if (cat.includes("TRANS")) return "TRANSPORT";
  if (cat.includes("MED")) return "MEDICAL";
  if (cat.includes("SEC")) return "SECURITY";
  if (cat.includes("CLASS") || cat.includes("CABIN") || cat.includes("OFFICE") || cat.includes("SALARY") || cat.includes("ADMIN") || cat.includes("OTHER")) {
    return "ADMIN";
  }
  return ROUTING_RULES[cat] || "ADMIN";
};

// In-Memory Report Store
let reportsStore = [
  {
    id: "REP-2026-0812",
    category: "CLASSROOM",
    title: "Classroom Projector Optical System Failure",
    location: "Block B, Room 302",
    description: "Projector bulb is flickering and colors are inverted. Need repair before afternoon lecture.",
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
      title: "Classroom Optical Presentation Hardware Malfunction",
      location: "Block B, Room 302",
      summary: "The ceiling mounted optical projection unit is experiencing inverted color gamut and intermittent bulb flickering.",
      problem: "Inverted color output and rapid lamp strobing affecting classroom lecture visibility.",
      requestedAction: "Dispatched AV hardware technician to replace projection lamp assembly and recalibrate video input.",
      priority: "MEDIUM",
      attachmentsNote: "Visual evidence provided by student reporter.",
      routedDepartment: "ADMIN"
    },
    attachments: {
      imageUrl: null,
      videoUrl: null,
      imageName: "projector_fault.jpg",
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
        notes: "Assigned ticket to Facilities AV Maintenance Desk."
      },
      {
        status: "IN_PROGRESS",
        timestamp: new Date(Date.now() - 3600000 * 0.8).toISOString(),
        updatedBy: "Facilities Lead",
        notes: "Technician dispatched with replacement lamp module."
      }
    ]
  },
  {
    id: "REP-2026-0809",
    category: "TRANSPORTATION",
    title: "Route 4 Campus Shuttle Air Conditioning Malfunction",
    location: "South Transit Terminal (Bus #TB-03)",
    description: "Bus TB-03 AC blower is blowing hot air on the morning 8:30 AM route.",
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

// Helper: AI Transformation Logic
export const generateAiReport = ({ category, location, description, imageAttached, videoAttached, reporterRole, reporterName }) => {
  const cleanLoc = (location || "").trim() || "Campus Location Not Specified";
  const cleanDesc = (description || "").trim() || "Issue reported by campus member.";
  const targetDept = determineDepartment(category);

  const lowerDesc = cleanDesc.toLowerCase();
  
  // Inferred Title
  let title = "Campus Departmental Issue";
  let problem = cleanDesc;
  let action = `Please inspect the reported issue at ${cleanLoc} and initiate appropriate departmental resolution.`;
  let priority = "MEDIUM";

  if (category === "CLASSROOM" || lowerDesc.includes("ac") || lowerDesc.includes("air condition") || lowerDesc.includes("projector") || lowerDesc.includes("fan") || lowerDesc.includes("light") || lowerDesc.includes("bench")) {
    if (lowerDesc.includes("ac") || lowerDesc.includes("cooling") || lowerDesc.includes("air condition")) {
      title = "Classroom Air Conditioning System Malfunction";
      problem = `The air conditioning unit in ${cleanLoc} is reported to be non-functional, resulting in inadequate room cooling.`;
      action = `Please dispatch the HVAC / Facilities maintenance team to inspect the compressor and restore cooling operation at ${cleanLoc}.`;
    } else if (lowerDesc.includes("projector") || lowerDesc.includes("screen") || lowerDesc.includes("display")) {
      title = "Classroom AV Display System Optical Malfunction";
      problem = `Classroom audio-visual presentation equipment at ${cleanLoc} is not functioning properly.`;
      action = `Please dispatch AV technical support to calibrate display hardware and verify signal cables.`;
    } else if (lowerDesc.includes("power") || lowerDesc.includes("light") || lowerDesc.includes("switch")) {
      title = "Classroom Electrical & Lighting System Disruption";
      problem = `Electrical fixtures or lighting circuits at ${cleanLoc} are experiencing disruption.`;
      action = `Electrical maintenance team requested to inspect circuit breakers and replace non-functioning fixtures.`;
    } else {
      title = `Classroom Infrastructure & Facility Concern`;
      problem = `Infrastructure issue reported in classroom facility: ${cleanDesc}`;
      action = `Facilities management to conduct on-site inspection at ${cleanLoc}.`;
    }
  } else if (category === "CABIN_OFFICE" || lowerDesc.includes("cabin") || lowerDesc.includes("office") || lowerDesc.includes("desk")) {
    title = "Faculty Office & Cabin Infrastructure Issue";
    problem = `Facility infrastructure problem reported in faculty workspace at ${cleanLoc}: ${cleanDesc}`;
    action = `Facilities division to inspect cabin infrastructure and address reported maintenance request.`;
  } else if (category === "SALARY_ADMIN" || lowerDesc.includes("salary") || lowerDesc.includes("leave") || lowerDesc.includes("administrative") || lowerDesc.includes("payroll")) {
    title = "Faculty Administrative & Payroll Ingestion Query";
    problem = `Administrative documentation or payroll processing inquiry logged: ${cleanDesc}`;
    action = `Campus Administrative & Finance Directorate to review employee records and provide formal status.`;
    priority = "LOW";
  } else if (category === "TRANSPORTATION" || lowerDesc.includes("bus") || lowerDesc.includes("shuttle") || lowerDesc.includes("transport") || lowerDesc.includes("route")) {
    title = "Campus Transit & Transportation Operational Issue";
    if (lowerDesc.includes("delay") || lowerDesc.includes("late")) {
      title = "Campus Transit Shuttle Schedule Delay";
      problem = `Transit shuttle delay or schedule irregularity reported for route serving ${cleanLoc}.`;
      action = `Transit Dispatch to verify GPS telemetry, notify drivers, and coordinate backup shuttle if required.`;
    } else {
      problem = `Transportation or transit vehicle concern reported: ${cleanDesc}`;
      action = `Campus Fleet Operations to inspect shuttle fleet and adjust transit route scheduling.`;
    }
  } else if (category === "MEDICAL" || lowerDesc.includes("pain") || lowerDesc.includes("injury") || lowerDesc.includes("faint") || lowerDesc.includes("ambulance") || lowerDesc.includes("doctor")) {
    title = "Campus Health & Medical Assistance Request";
    problem = `Medical assistance or first-responder triage requested at ${cleanLoc}: ${cleanDesc}`;
    action = `Paramedics and Emergency Health Unit dispatched with first-aid trauma kit and patient transport.`;
    priority = "HIGH";
  } else if (category === "SECURITY" || lowerDesc.includes("theft") || lowerDesc.includes("suspicious") || lowerDesc.includes("fight") || lowerDesc.includes("hazard")) {
    title = "Campus Safety & Security Incident Report";
    problem = `Safety or security anomaly reported at ${cleanLoc}: ${cleanDesc}`;
    action = `Campus Security Patrol dispatched for perimeter inspection and situation verification.`;
    priority = "HIGH";
  } else {
    title = "Campus General Facilities & Operations Report";
    problem = cleanDesc;
    action = `Responsible campus administrative officer to evaluate request and take required operational action.`;
  }

  // Priority Auto-Inference
  if (lowerDesc.includes("urgent") || lowerDesc.includes("emergency") || lowerDesc.includes("danger") || lowerDesc.includes("critical") || lowerDesc.includes("fire") || lowerDesc.includes("bleeding")) {
    priority = "CRITICAL";
  } else if (lowerDesc.includes("broken") || lowerDesc.includes("exam") || lowerDesc.includes("class in 10 mins") || lowerDesc.includes("immediately")) {
    priority = "HIGH";
  }

  let attachmentsNote = "No media files attached.";
  if (imageAttached && videoAttached) {
    attachmentsNote = "Attached Evidence: 1 High-Resolution Photo + 1 Video Demonstration.";
  } else if (imageAttached) {
    attachmentsNote = "Attached Evidence: 1 Photographic Evidence Image.";
  } else if (videoAttached) {
    attachmentsNote = "Attached Evidence: 1 Video Recording Demonstration.";
  }

  const summary = `The ${title.toLowerCase()} in ${cleanLoc} was reported by ${reporterName || reporterRole || "a campus member"}. ${problem}`;

  return {
    title,
    location: cleanLoc,
    summary,
    problem,
    requestedAction: action,
    priority,
    attachmentsNote,
    routedDepartment: targetDept
  };
};

// GET /api/reports - Fetch all reports (optional filters: department, role, user)
router.get("/", (req, res) => {
  const { department, userId, role, status } = req.query;
  let filtered = [...reportsStore];

  if (department) {
    filtered = filtered.filter(r => r.routedDepartment.toUpperCase() === department.toUpperCase());
  }

  if (userId) {
    filtered = filtered.filter(r => r.submittedBy && r.submittedBy.id === userId);
  }

  if (status) {
    filtered = filtered.filter(r => r.status.toUpperCase() === status.toUpperCase());
  }

  // Sort descending by createdAt
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    total: filtered.length,
    reports: filtered
  });
});

// GET /api/reports/:id - Fetch single report
router.get("/:id", (req, res) => {
  const report = reportsStore.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, error: "Report not found" });
  }
  res.json({ success: true, report });
});

// POST /api/reports/generate-ai - Generate AI structured report from informal user inputs
router.post("/generate-ai", (req, res) => {
  try {
    const { category, location, description, imageAttached, videoAttached, reporterRole, reporterName } = req.body;
    const aiReport = generateAiReport({
      category,
      location,
      description,
      imageAttached,
      videoAttached,
      reporterRole,
      reporterName
    });
    res.json({ success: true, aiReport });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/reports - Submit a new report with automatic department routing
router.post("/", (req, res) => {
  try {
    const {
      category,
      title,
      location,
      description,
      priority,
      submittedBy,
      aiReport,
      attachments
    } = req.body;

    const routedDept = determineDepartment(category);

    const reportId = `REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReport = {
      id: reportId,
      category: category || "OTHER",
      title: title || (aiReport ? aiReport.title : "Campus Issue Report"),
      location: location || (aiReport ? aiReport.location : "Campus Area"),
      description: description || "Report submitted by campus member.",
      priority: priority || (aiReport ? aiReport.priority : "MEDIUM"),
      submittedBy: submittedBy || {
        id: "U-ANON",
        name: "Campus Member",
        role: "STUDENT",
        department: "General"
      },
      createdAt: new Date().toISOString(),
      aiReport: aiReport || generateAiReport({
        category,
        location,
        description,
        imageAttached: !!(attachments && attachments.imageUrl),
        videoAttached: !!(attachments && attachments.videoUrl),
        reporterRole: submittedBy ? submittedBy.role : "STUDENT",
        reporterName: submittedBy ? submittedBy.name : "Reporter"
      }),
      attachments: attachments || {
        imageUrl: null,
        videoUrl: null,
        imageName: null,
        videoName: null
      },
      routedDepartment: routedDept,
      status: "NEW",
      timeline: [
        {
          status: "NEW",
          timestamp: new Date().toISOString(),
          updatedBy: `${submittedBy ? submittedBy.name : "Reporter"} (${submittedBy ? submittedBy.role : "User"})`,
          notes: "Initial issue report submitted and verified by AI Sentinel Engine."
        }
      ]
    };

    // Store in backend database
    reportsStore.unshift(newReport);

    // Create targeted departmental notification
    const notification = {
      id: `NOTIF-${Date.now()}`,
      reportId: newReport.id,
      targetRole: routedDept,
      type: "ISSUE_DISPATCH",
      title: `NEW ${category ? category.replace("_", " ").toUpperCase() : "CAMPUS"} ISSUE`,
      message: `${newReport.title} reported at ${newReport.location}.`,
      severity: newReport.priority,
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      status: "UNREAD",
      linkId: newReport.id
    };

    // Broadcast in real-time via Socket.IO
    agentOrchestrator.broadcast("new_report", newReport);
    agentOrchestrator.broadcast("new_notification", notification);

    res.status(201).json({
      success: true,
      message: `Report submitted successfully and routed to ${routedDept} Department.`,
      report: newReport,
      notification
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/reports/:id/status - Update report status (NEW -> ACKNOWLEDGED -> IN_PROGRESS -> RESOLVED)
router.patch("/:id/status", (req, res) => {
  try {
    const { status, updatedBy, notes } = req.body;
    const report = reportsStore.find(r => r.id === req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    const validStatuses = ["NEW", "ACKNOWLEDGED", "IN_PROGRESS", "RESOLVED", "ESCALATED"];
    const targetStatus = (status || "").toUpperCase();

    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed: ${validStatuses.join(", ")}`
      });
    }

    report.status = targetStatus;
    report.updatedAt = new Date().toISOString();

    const timelineEntry = {
      status: targetStatus,
      timestamp: new Date().toISOString(),
      updatedBy: updatedBy || "Department Officer",
      notes: notes || `Status updated to ${targetStatus}`
    };

    report.timeline = report.timeline || [];
    report.timeline.push(timelineEntry);

    // Notification for original reporter
    const userNotification = {
      id: `NOTIF-${Date.now()}`,
      reportId: report.id,
      targetUserId: report.submittedBy ? report.submittedBy.id : null,
      targetRole: report.submittedBy ? report.submittedBy.role : "STUDENT",
      type: "STATUS_UPDATE",
      title: `REPORT ${targetStatus}: ${report.id}`,
      message: `Your issue regarding "${report.title}" is now marked as ${targetStatus}.`,
      severity: targetStatus === "RESOLVED" ? "LOW" : "MEDIUM",
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString(),
      status: "UNREAD"
    };

    agentOrchestrator.broadcast("report_updated", report);
    agentOrchestrator.broadcast("new_notification", userNotification);

    res.json({
      success: true,
      message: `Report ${report.id} updated to ${targetStatus}.`,
      report
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
