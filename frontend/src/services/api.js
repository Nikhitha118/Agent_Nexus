// Campus Sentinel AI - Frontend API Service
const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl.replace(/\/$/, "")}/api`)
  : "http://localhost:5000/api";

export async function fetchCampusData(userRole = "STUDENT") {
  try {
    const roleUpper = (userRole || "").toUpperCase();
    const canAccessCameras = roleUpper === "ADMIN" || roleUpper === "SECURITY";

    const fetchPromises = [
      fetch(`${API_BASE}/campus/buildings`),
      canAccessCameras
        ? fetch(`${API_BASE}/campus/cameras`, { headers: { "x-user-role": roleUpper } })
        : Promise.resolve({ json: async () => ({ cameras: [] }) }),
      fetch(`${API_BASE}/campus/assembly-points`),
      fetch(`${API_BASE}/campus/graph`),
      fetch(`${API_BASE}/campus/stats`)
    ];

    const [buildingsRes, camerasRes, apRes, graphRes, statsRes] = await Promise.all(fetchPromises);

    const buildings = (await buildingsRes.json()).buildings || [];
    const cameras = (await camerasRes.json()).cameras || [];
    const assemblyPoints = (await apRes.json()).assemblyPoints || [];
    const graph = await graphRes.json();
    const stats = (await statsRes.json()).stats || {};

    return { success: true, buildings, cameras, assemblyPoints, graph, stats };
  } catch (error) {
    console.error("API error fetching campus data", error);
    return { success: false, error: error.message };
  }
}

export async function fetchActiveIncident() {
  try {
    const res = await fetch(`${API_BASE}/incidents/active`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchAllIncidents() {
  try {
    const res = await fetch(`${API_BASE}/incidents`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchResources() {
  try {
    const res = await fetch(`${API_BASE}/resources`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function triggerSimulation(scenario = "FIRE", options = {}) {
  try {
    const res = await fetch(`${API_BASE}/incidents/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, fastDemo: options.fastDemo })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function triggerRoadBlockage(edgeId = "E-07", incidentId = null) {
  try {
    const res = await fetch(`${API_BASE}/incidents/block-route`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ edgeId, incidentId })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function submitHumanApprovalDecision(approvalId, decision, operatorName = "Chief Operator", notes = "") {
  try {
    const res = await fetch(`${API_BASE}/approvals/${approvalId}/decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, operatorName, notes })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function resolveActiveIncident(incidentId = null, notes = "Incident resolved.") {
  try {
    const res = await fetch(`${API_BASE}/incidents/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incidentId, notes })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function resetSystemState() {
  try {
    const res = await fetch(`${API_BASE}/incidents/reset`, {
      method: "POST"
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(loginId, password, role) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, password, role })
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data && data.success) {
      return { success: true, user: data.user, token: data.token };
    }

    if (data && data.error) {
      return { success: false, error: data.error, status: res.status };
    }

    return { success: false, error: "Invalid username or password.", status: res.status };
  } catch (error) {
    console.warn("[API Network Error on Login]", error);
    return {
      success: false,
      networkError: true,
      error: "Unable to connect to authentication server. Please try again."
    };
  }
}

export async function registerUser(name, username, password, role, department) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password, role, department })
    });

    const data = await res.json().catch(() => null);

    if (res.ok && data && data.success) {
      return { success: true, message: data.message, username: data.username, role: data.role };
    }

    if (data && data.error) {
      return { success: false, error: data.error, status: res.status };
    }

    return { success: false, error: "Registration failed. Please try again.", status: res.status };
  } catch (error) {
    console.warn("[API Network Error on Register]", error);
    return {
      success: false,
      networkError: true,
      error: "Unable to connect to authentication server. Please try again."
    };
  }
}

export async function parseEmergencyNLPReport(text, autoDispatch = false) {
  try {
    const res = await fetch(`${API_BASE}/ai/report-nlp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, autoDispatch })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function analyzeImageUpload(imageBase64, metadata = {}) {
  try {
    const res = await fetch(`${API_BASE}/ai/vision-detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64, metadata })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function sendWebcamFrameConfidence(cameraId, confidence, type = "FIRE", detected = false) {
  try {
    const res = await fetch(`${API_BASE}/agents/frame-analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cameraId, confidence, type, detected })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function triggerDemoFireWebcam(cameraId = "CAM-02", fastDemo = false) {
  try {
    const res = await fetch(`${API_BASE}/agents/demo-fire`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cameraId, fastDemo })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/analytics`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchAuditLogs() {
  try {
    const res = await fetch(`${API_BASE}/audit`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function fetchReports(filters = {}) {
  try {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/reports${query ? `?${query}` : ""}`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message, reports: [] };
  }
}

export async function fetchReportById(id) {
  try {
    const res = await fetch(`${API_BASE}/reports/${id}`);
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function submitReportApi(reportData) {
  try {
    const res = await fetch(`${API_BASE}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportData)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateAiReportApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/reports/generate-ai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateReportStatusApi(reportId, status, updatedBy = "Officer", notes = "") {
  try {
    const res = await fetch(`${API_BASE}/reports/${reportId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, updatedBy, notes })
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function analyzeEmergencyQuickReportApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/ai/analyze-emergency`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function submitQuickEmergencyAlertApi(payload) {
  try {
    const res = await fetch(`${API_BASE}/incidents/quick-alert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}


