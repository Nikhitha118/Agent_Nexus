// Campus Sentinel AI - Socket.IO Real-time Gateway
import { campusDataService } from "../services/CampusDataService.js";
import { agentOrchestrator } from "../agents/AgentOrchestrator.js";

export function initializeSocketGateway(io) {
  agentOrchestrator.setSocketServer(io);

  io.on("connection", (socket) => {
    // Send initial snapshot on connection
    socket.emit("initial_state", {
      activeIncident: campusDataService.getActiveIncident(),
      buildings: campusDataService.buildings,
      cameras: campusDataService.cameras,
      resources: campusDataService.resources,
      assemblyPoints: campusDataService.assemblyPoints,
      edges: campusDataService.edges,
      notifications: campusDataService.notifications.slice(0, 15),
      approvals: campusDataService.pendingApprovals,
      stats: campusDataService.getSystemStats(),
      activities: campusDataService.agentActivities.slice(0, 20)
    });

    // Client role subscription (e.g. STUDENT, SECURITY, MEDICAL, COMMANDER)
    socket.on("join_role", (role) => {
      socket.join(`role_${role.toUpperCase()}`);
    });

    // Live webcam frame stream ping
    socket.on("stream_frame_confidence", (data) => {
      // Re-broadcast camera confidence updates
      if (data && data.cameraId) {
        io.emit("camera_ping", data);
      }
    });

    socket.on("disconnect", () => {
      // client disconnected
    });
  });
}
