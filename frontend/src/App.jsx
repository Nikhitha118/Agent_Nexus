// Campus Sentinel - Autonomous Multi-Agent Campus Emergency Response & Issue Management System
import React from "react";
import { SentinelProvider, useSentinel } from "./context/SentinelContext";
import { Navbar } from "./components/Navbar";
import { EmergencyAlertBanner } from "./components/EmergencyAlertBanner";
import { CampusMap } from "./components/CampusMap";
import { LoginPage } from "./components/LoginPage";
import { ResourcesDashboard } from "./components/ResourcesDashboard";
import { LiveCameraStudio } from "./components/LiveCameraStudio";
import { MyReportsView } from "./components/MyReportsView";
import { NotificationsView } from "./components/NotificationsView";
import { EmergencyAiQuickButton } from "./components/EmergencyAiQuickButton";
import { EmergencyAiQuickModal } from "./components/EmergencyAiQuickModal";
import { ResolveIncidentModal } from "./components/ResolveIncidentModal";
import { CheckCircle2 } from "lucide-react";

// Role-Specific Dashboards
import { StudentDashboard } from "./components/RoleDashboards/StudentDashboard";
import { FacultyDashboard } from "./components/RoleDashboards/FacultyDashboard";
import { AdminDashboard } from "./components/RoleDashboards/AdminDashboard";
import { MedicalDashboard } from "./components/RoleDashboards/MedicalDashboard";
import { SecurityDashboard } from "./components/RoleDashboards/SecurityDashboard";
import { TransportDashboard } from "./components/RoleDashboards/TransportDashboard";
import { EmergencyAiDashboard } from "./components/RoleDashboards/EmergencyAiDashboard";

const MainContent = () => {
  const { activeTab, currentRole } = useSentinel();

  // 1. Campus Map Tab
  if (activeTab === "MAP") {
    return (
      <div className="w-full max-w-[1700px] mx-auto py-6 px-3 sm:px-4 lg:px-6 space-y-4 box-border">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E2C48]">
          <div>
            <h2 className="text-xl font-black text-white">Campus Digital Twin Graph Map</h2>
            <p className="text-xs text-slate-400">Interactive campus navigation mesh & sensor topography</p>
          </div>
          <span className="text-xs font-mono text-cyan-400">39 Nodes • 46 Edge Routes</span>
        </div>
        <CampusMap height="h-[620px]" interactive={true} />
      </div>
    );
  }

  // 2. Live Cameras Tab (Strict Role Guard in Component)
  if (activeTab === "LIVE_CAMERAS") {
    return <LiveCameraStudio />;
  }

  // 3. Resources Tab (Admin)
  if (activeTab === "RESOURCES") {
    return (
      <div className="w-full max-w-[1700px] mx-auto py-6 px-3 sm:px-4 lg:px-6 box-border">
        <ResourcesDashboard />
      </div>
    );
  }

  // 4. Autonomous Emergency AI System Tab
  if (activeTab === "EMERGENCY_AI") {
    return <EmergencyAiDashboard />;
  }

  // 5. My Reports Tab (Student / Faculty)
  if (activeTab === "MY_REPORTS") {
    return <MyReportsView />;
  }

  // 6. Notifications Tab
  if (activeTab === "NOTIFICATIONS") {
    return <NotificationsView />;
  }

  // 7. Department Queue / Reports Tab
  if (activeTab === "QUEUE" || activeTab === "REPORTS") {
    switch (currentRole) {
      case "ADMIN":
        return <AdminDashboard />;
      case "MEDICAL":
        return <MedicalDashboard />;
      case "SECURITY":
        return <SecurityDashboard />;
      case "TRANSPORT":
        return <TransportDashboard />;
      case "STUDENT":
      case "FACULTY":
      default:
        return <MyReportsView />;
    }
  }

  // 8. Default HOME Screen - Rendered strictly by authenticated role
  switch (currentRole) {
    case "STUDENT":
      return <StudentDashboard />;
    case "FACULTY":
      return <FacultyDashboard />;
    case "SECURITY":
      return <SecurityDashboard />;
    case "MEDICAL":
      return <MedicalDashboard />;
    case "TRANSPORT":
      return <TransportDashboard />;
    case "ADMIN":
    default:
      return <AdminDashboard />;
  }
};

function AppContent() {
  const {
    isAuthenticated,
    currentUser,
    resolveModalIncident,
    closeResolveModal,
    successToast
  } = useSentinel();

  // If unauthenticated, render dedicated Login / Role Selection portal with Emergency AI floating button & modal
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="relative min-h-screen w-full">
        <LoginPage />
        <EmergencyAiQuickButton />
        <EmergencyAiQuickModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full bg-[#080B13] text-slate-100 flex flex-col font-sans selection:bg-red-500/30 overflow-x-hidden box-border relative">
      {/* 1. Clean Fixed Header Navigation */}
      <Navbar />

      {/* 2. Global Real-Time Campus Emergency Alert Banner (Shown during active emergencies) */}
      <EmergencyAlertBanner />

      {/* 3. Global Green Success Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 p-4 rounded-2xl bg-[#0F1626] border-2 border-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center space-x-3 animate-slide-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 4. Main Dashboard Content Layer - Ends cleanly after dashboard content */}
      <main className="flex-1 w-full max-w-full bg-gradient-to-b from-[#080B13] via-[#0A0E1A] to-[#080B13] pb-10 box-border">
        <MainContent />
      </main>

      {/* 5. Global Emergency AI Quick Action Button & Full-Screen Reporting Modal */}
      <EmergencyAiQuickButton />
      <EmergencyAiQuickModal />

      {/* 6. Global Resolve Incident Confirmation Modal */}
      {resolveModalIncident && (
        <ResolveIncidentModal
          isOpen={!!resolveModalIncident}
          onClose={closeResolveModal}
          incident={resolveModalIncident}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SentinelProvider>
      <AppContent />
    </SentinelProvider>
  );
}
