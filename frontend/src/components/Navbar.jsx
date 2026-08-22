// Campus Sentinel - Streamlined Role-Based Top Navigation
import React from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  ShieldAlert,
  Home,
  FileText,
  MapPin,
  Shield,
  Bell,
  LogOut,
  Volume2,
  VolumeX,
  PlusCircle,
  ListTodo,
  Truck,
  HeartPulse,
  Camera,
  Bot
} from "lucide-react";

export const Navbar = () => {
  const {
    currentUser,
    currentRole,
    logout,
    activeTab,
    setActiveTab,
    setActiveReportingCategory,
    isAudioMuted,
    toggleMute,
    notifications,
    reports
  } = useSentinel();

  // Role-Specific Navigation Definitions
  const getNavLinks = () => {
    switch (currentRole) {
      case "STUDENT":
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "REPORT_ISSUE", label: "Report Issue", icon: PlusCircle },
          { id: "MY_REPORTS", label: "My Reports", icon: FileText },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];

      case "FACULTY":
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "REPORT_ISSUE", label: "Report Issue", icon: PlusCircle },
          { id: "MY_REPORTS", label: "My Reports", icon: FileText },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];

      case "MEDICAL":
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "QUEUE", label: "Medical Queue", icon: HeartPulse },
          { id: "REPORTS", label: "Reports", icon: FileText },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];

      case "SECURITY":
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "QUEUE", label: "Security Incidents", icon: Shield },
          { id: "REPORTS", label: "Reports", icon: FileText },
          { id: "MAP", label: "Campus Map", icon: MapPin },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];

      case "TRANSPORT":
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "QUEUE", label: "Transport Queue", icon: Truck },
          { id: "REPORTS", label: "Reports", icon: FileText },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];

      case "ADMIN":
      default:
        return [
          { id: "HOME", label: "Home", icon: Home },
          { id: "QUEUE", label: "Issue Queue", icon: ListTodo },
          { id: "REPORTS", label: "Reports", icon: FileText },
          { id: "MAP", label: "Campus Map", icon: MapPin },
          { id: "RESOURCES", label: "Resources", icon: Shield },
          { id: "NOTIFICATIONS", label: "Notifications", icon: Bell }
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleNavClick = (tabId) => {
    if (tabId === "REPORT_ISSUE") {
      setActiveReportingCategory("CLASSROOM");
      setActiveTab("HOME");
    } else {
      setActiveReportingCategory(null);
      setActiveTab(tabId);
    }
  };

  // Filter unread notifications count for current user
  const unreadCount = notifications.filter(n => {
    if (!currentUser) return false;
    if (n.targetUserId && n.targetUserId === currentUser.id) return true;
    if (n.targetRole && n.targetRole === currentRole) return true;
    if (currentRole === "ADMIN") return true;
    return false;
  }).length;

  return (
    <header className="h-16 bg-[#0B101D] border-b border-[#1E2C48] px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xl shrink-0">
      {/* 1. Left: Brand Logo & Title */}
      <div
        onClick={() => {
          setActiveReportingCategory(null);
          setActiveTab("HOME");
        }}
        className="flex items-center space-x-3 cursor-pointer select-none shrink-0"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-500/20 border border-red-400/30">
          <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>

        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-black tracking-wider text-sm sm:text-base text-white">
              CAMPUS SENTINEL
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium hidden md:block">
            Vignan University • Emergency & Operations
          </p>
        </div>
      </div>

      {/* 2. Center: Dynamic Role-Based Nav Links */}
      <nav className="hidden lg:flex items-center space-x-1 bg-[#141D32] p-1 rounded-2xl border border-[#1E2C48]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 relative ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
              {link.id === "NOTIFICATIONS" && unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block ml-1" />
              )}
            </button>
          );
        })}
      </nav>

      {/* 3. Right: Profile & Operational Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Authenticated User Pill */}
        {currentUser && (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#141D32] border border-[#1E2C48]">
            <span className="text-sm">{currentUser.avatar || "👤"}</span>
            <div className="text-left leading-tight hidden sm:block">
              <span className="text-xs font-bold text-white block truncate max-w-[120px]">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-cyan-400 font-mono font-bold uppercase">
                {currentUser.role}
              </span>
            </div>
          </div>
        )}

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-xl bg-[#141D32] border border-[#1E2C48] text-cyan-400 hover:text-cyan-300 transition-colors"
          title={isAudioMuted ? "Unmute Alerts" : "Mute Alerts"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-red-950/90 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/50 text-xs font-bold transition-all active:scale-95 shadow-sm"
          title="Sign Out of Campus Sentinel"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">LOGOUT</span>
        </button>
      </div>
    </header>
  );
};
