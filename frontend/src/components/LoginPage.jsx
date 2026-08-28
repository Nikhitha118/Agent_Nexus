// Campus Sentinel - Role-Based Command Authentication Portal
import React, { useState } from "react";
import { useSentinel } from "../context/SentinelContext";
import {
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Shield,
  HeartPulse,
  Bus,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  User,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  Building,
  Eye,
  EyeOff
} from "lucide-react";

// Exactly 6 Department Role Access Portals in required order
export const ROLE_DEFINITIONS = [
  {
    role: "ADMIN",
    title: "ADMIN / HOD",
    description: "Campus administration and emergency command",
    icon: ShieldAlert,
    color: "from-amber-600 to-orange-700",
    badgeColor: "bg-amber-950/80 border-amber-500/60 text-amber-300",
    border: "border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10",
    buttonText: "SIGN IN AS ADMIN"
  },
  {
    role: "FACULTY",
    title: "FACULTY / STAFF",
    description: "Faculty emergency reporting and coordination",
    icon: Briefcase,
    color: "from-purple-600 to-indigo-700",
    badgeColor: "bg-purple-950/80 border-purple-500/60 text-purple-300",
    border: "border-purple-500/40 hover:border-purple-400 hover:shadow-purple-500/10",
    buttonText: "SIGN IN AS FACULTY"
  },
  {
    role: "STUDENT",
    title: "STUDENT",
    description: "Student emergency assistance and reporting",
    icon: GraduationCap,
    color: "from-blue-600 to-indigo-700",
    badgeColor: "bg-blue-950/80 border-blue-500/60 text-blue-300",
    border: "border-blue-500/40 hover:border-blue-400 hover:shadow-blue-500/10",
    buttonText: "SIGN IN AS STUDENT"
  },
  {
    role: "SECURITY",
    title: "CAMPUS SECURITY",
    description: "Security operations and incident response",
    icon: Shield,
    color: "from-sky-600 to-blue-700",
    badgeColor: "bg-sky-950/80 border-sky-500/60 text-sky-300",
    border: "border-sky-500/40 hover:border-sky-400 hover:shadow-sky-500/10",
    buttonText: "SIGN IN AS SECURITY"
  },
  {
    role: "MEDICAL",
    title: "MEDICAL & PARAMEDICS",
    description: "Medical emergency response and ambulance coordination",
    icon: HeartPulse,
    color: "from-rose-600 to-red-700",
    badgeColor: "bg-rose-950/80 border-rose-500/60 text-rose-300",
    border: "border-rose-500/40 hover:border-rose-400 hover:shadow-rose-500/10",
    buttonText: "SIGN IN AS MEDICAL"
  },
  {
    role: "TRANSPORT",
    title: "CAMPUS TRANSPORT",
    description: "Campus transport coordination and emergency mobility",
    icon: Bus,
    color: "from-emerald-600 to-teal-700",
    badgeColor: "bg-emerald-950/80 border-emerald-500/60 text-emerald-300",
    border: "border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/10",
    buttonText: "SIGN IN AS TRANSPORT"
  }
];

export const LoginPage = () => {
  const { validateAndLogin, registerAccount, openEmergencyAiModal, activeIncident } = useSentinel();

  // State: selectedRole is null on role selection screen, object when role chosen
  const [selectedRole, setSelectedRole] = useState(null);
  const [authMode, setAuthMode] = useState("LOGIN"); // "LOGIN" | "REGISTER"

  // Login form inputs
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form inputs
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Feedback & Loading
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle Role Selection (Opens Login / Register screen)
  const handleSelectRole = (roleDef) => {
    setSelectedRole(roleDef);
    setAuthMode("LOGIN");
    setErrorMsg("");
    setSuccessMsg("");
    setLoginId("");
    setPassword("");
    setShowLoginPassword(false);
    setShowRegPassword(false);
    setShowRegConfirmPassword(false);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginId.trim() || !password) {
      setErrorMsg("Please enter your University ID and Password.");
      return;
    }

    setIsLoading(true);

    const res = await validateAndLogin({
      loginId: loginId.trim(),
      password,
      selectedRole: selectedRole ? selectedRole.role : null
    });

    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Invalid username or password.");
    }
  };

  // Handle Register Submit (Does NOT auto-login, redirects to login with success message)
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!regUsername.trim() || !regPassword) {
      setErrorMsg("Username and Password are required.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    const res = await registerAccount({
      name: regName.trim(),
      username: regUsername.trim(),
      password: regPassword,
      role: selectedRole ? selectedRole.role : "STUDENT",
      department: regDepartment.trim()
    });

    setIsLoading(false);

    if (!res.success) {
      setErrorMsg(res.error || "Registration failed. Please try again.");
    } else {
      // Switch back to Login view and pre-fill username
      setSuccessMsg("Registration successful! Please login with your registered credentials.");
      setLoginId(regUsername.trim());
      setPassword(regUsername.trim());
      setShowLoginPassword(false);
      setAuthMode("LOGIN");
      setRegName("");
      setRegUsername("");
      setRegPassword("");
      setRegConfirmPassword("");
      setRegDepartment("");
    }
  };

  return (
    <div className="relative min-h-screen lg:h-screen lg:max-h-screen w-full bg-[#080B13] text-slate-100 flex flex-col justify-center items-center py-3 sm:py-4 px-4 sm:px-6 lg:px-8 selection:bg-red-500/30 overflow-x-hidden lg:overflow-hidden box-border">
      
      {/* LAYER 1: Full-Screen Cinematic Vignan University Campus Video Background */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-100 animate-subtle-zoom opacity-35"
          src="/vignan_campus_bg.mp4"
        />
      </div>

      {/* LAYER 2: Dark Navy Gradient Overlay for Command Center Focus & High Readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#080B13]/92 via-[#0A0E1A]/84 to-[#080B13]/94 backdrop-blur-[2px] pointer-events-none z-[1]" />

      {/* LAYER 3: Subtle Tech Glow Highlights */}
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl pointer-events-none z-[2]" />
      <div className="fixed bottom-0 right-1/4 w-80 h-80 bg-blue-600/8 rounded-full blur-3xl pointer-events-none z-[2]" />

      {/* LAYER 4: Application Interface Content */}
      <div className="relative z-10 w-full max-w-4xl lg:max-w-[880px] mx-auto flex flex-col items-center justify-center my-auto space-y-2 sm:space-y-2.5">
        
        {/* Main Brand & AI Agent Header Section */}
        <div className="text-center space-y-0.5 sm:space-y-1 shrink-0">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-cyan-400 text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider shadow-md shadow-cyan-500/10 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            <span>VIGNAN UNIVERSITY • EMERGENCY RESPONSE DIGITAL TWIN</span>
          </div>

          <div className="flex items-center justify-center space-x-2 pt-0.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-rose-700 flex items-center justify-center shadow-md shadow-red-500/25 border border-red-400/30 shrink-0">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none">
              CAMPUS SENTINEL
            </h1>
          </div>

          <p className="text-[10.5px] sm:text-xs font-semibold text-cyan-400 leading-tight">
            Autonomous Multi-Agent Campus Emergency Response System
          </p>
        </div>

        {/* VIEW 1: ROLE SELECTION SCREEN (3-Column Desktop Grid with Zero Scroll) */}
        {!selectedRole && (
          <div className="w-full space-y-2">
            <div className="text-center">
              <p className="text-[10px] sm:text-[10.5px] text-slate-300 font-medium bg-[#0A1120]/75 backdrop-blur-md inline-block px-3 py-0.5 rounded-full border border-[#1E2C48]">
                Select your department access portal to authenticate into the emergency command system
              </p>
            </div>

            {/* 6 Role Cards Grid: 3 columns x 2 rows with strictly equal dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 w-full auto-rows-fr">
              {ROLE_DEFINITIONS.map((roleDef) => {
                const Icon = roleDef.icon;
                return (
                  <div
                    key={roleDef.role}
                    onClick={() => handleSelectRole(roleDef)}
                    className={`p-3 rounded-xl bg-[#0F1626]/90 backdrop-blur-xl border ${roleDef.border} shadow-lg hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between h-full group select-none`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleDef.color} flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded border ${roleDef.badgeColor}`}>
                          {roleDef.role}
                        </span>
                      </div>

                      <div className="space-y-0.5">
                        <h3 className="text-xs sm:text-[13px] font-black text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors truncate">
                          {roleDef.title}
                        </h3>
                        <p className="text-[10px] sm:text-[10.5px] text-slate-300 leading-snug line-clamp-2 h-7 sm:h-7.5 overflow-hidden">
                          {roleDef.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full h-8 sm:h-8.5 mt-2 px-2.5 rounded-lg bg-gradient-to-r ${roleDef.color} hover:brightness-110 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all active:scale-95 border border-white/20 shrink-0`}
                    >
                      <span className="truncate">{roleDef.buttonText}</span>
                      <ArrowRight className="w-3 h-3 shrink-0" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: SECURE ACCESS / LOGIN MODAL (Centered, Compact, Zero Cutoff) */}
        {selectedRole && (
          <div className="max-w-xs sm:max-w-sm w-full mx-auto space-y-1.5 animate-fade-in">
            {/* Back button */}
            <button
              onClick={() => { setSelectedRole(null); setErrorMsg(""); setSuccessMsg(""); }}
              className="inline-flex items-center space-x-1.5 text-[10.5px] font-bold text-slate-300 hover:text-cyan-400 transition-colors bg-[#0A1120]/80 px-2.5 py-0.5 rounded-lg border border-[#1E2C48] backdrop-blur-md"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Role Selection</span>
            </button>

            {/* Authentication Glass Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0F1626]/95 border border-[#1E2C48] backdrop-blur-2xl shadow-2xl space-y-2.5 relative overflow-hidden">
              {/* Ambient Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Selected Role Header */}
              <div className="space-y-0.5 text-center pb-1.5 border-b border-[#1E2C48]">
                <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-[#141D32] border border-[#1E2C48]">
                  <selectedRole.icon className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Role: <span className="text-cyan-400">{selectedRole.title}</span>
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider leading-tight">
                  Secure Access Portal
                </h2>
                <p className="text-[9.5px] text-slate-400 font-mono">
                  {authMode === "LOGIN"
                    ? (selectedRole.role === "STUDENT"
                        ? "Enter your University ID to log in"
                        : `Enter your ${selectedRole.title} credentials`)
                    : "Create departmental access account"}
                </p>
              </div>

              {/* Auth Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-0.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-[10.5px] font-bold">
                <button
                  type="button"
                  onClick={() => { setAuthMode("LOGIN"); setErrorMsg(""); }}
                  className={`py-1 rounded-md transition-all ${
                    authMode === "LOGIN"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  LOGIN
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("REGISTER"); setErrorMsg(""); }}
                  className={`py-1 rounded-md transition-all ${
                    authMode === "REGISTER"
                      ? "bg-blue-600 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  REGISTER
                </button>
              </div>

              {/* Success Alert */}
              {successMsg && (
                <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-[10.5px] flex items-center space-x-1.5 animate-fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/60 text-red-300 text-[10.5px] flex items-center space-x-1.5 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* LOGIN FORM WITH ROLE-SPECIFIC LABELS AND STUDENT PASSWORD AUTO-FILL */}
              {authMode === "LOGIN" && (
                <form onSubmit={handleLoginSubmit} className="space-y-2">
                  <div className="space-y-0.5">
                    <label className="text-[10.5px] font-bold text-slate-300 flex items-center space-x-1">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>
                        {selectedRole.role === "STUDENT"
                          ? "University ID"
                          : "Username / ID"}
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder={
                        selectedRole.role === "STUDENT"
                          ? "e.g. 241FA04633"
                          : `e.g. ${selectedRole.role.toLowerCase()}`
                      }
                      value={loginId}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedRole.role === "STUDENT") {
                          const upperVal = val.toUpperCase();
                          setLoginId(upperVal);
                          setPassword(upperVal); // Student: default password is University ID
                        } else {
                          setLoginId(val);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all uppercase tracking-wider"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10.5px] font-bold text-slate-300 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Password</span>
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        placeholder={
                          selectedRole.role === "STUDENT"
                            ? "Same as University ID"
                            : "Enter password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-2.5 pr-7 py-1.5 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={showLoginPassword ? "Hide password" : "Show password"}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-cyan-400 focus:outline-none focus:text-cyan-400 transition-colors"
                      >
                        {showLoginPassword ? (
                          <EyeOff className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Eye className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-[9px] text-cyan-400 font-mono italic">
                      {selectedRole.role === "STUDENT"
                        ? "* Default password is your University ID"
                        : `* Default demo password: ${selectedRole.role.toLowerCase()}123`}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-8 sm:h-8.5 rounded-xl bg-gradient-to-r ${selectedRole.color} hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-1.5 border border-white/20`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{isLoading ? "AUTHENTICATING..." : "SECURE LOGIN"}</span>
                  </button>
                </form>
              )}

              {/* REGISTER FORM WITH COMPACT 2-COLUMN LAYOUT */}
              {authMode === "REGISTER" && (
                <form onSubmit={handleRegisterSubmit} className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                        <User className="w-3 h-3 text-cyan-400" />
                        <span>Name</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Full Name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                      />
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                        <Building className="w-3 h-3 text-purple-400" />
                        <span>Branch</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CSE"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        className="w-full px-2 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                      <User className="w-3 h-3 text-blue-400" />
                      <span>{selectedRole.role === "STUDENT" ? "University ID" : "Username / ID"}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={selectedRole.role === "STUDENT" ? "e.g. 241FA04633" : "Official Username"}
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all uppercase tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Password</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"}
                          required
                          placeholder="Password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full pl-2 pr-6 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          aria-label={showRegPassword ? "Hide password" : "Show password"}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-cyan-400 focus:outline-none"
                        >
                          {showRegPassword ? <EyeOff className="w-3 h-3 text-cyan-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-slate-300 flex items-center space-x-1">
                        <Lock className="w-3 h-3 text-amber-400" />
                        <span>Confirm</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showRegConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Confirm"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          className="w-full pl-2 pr-6 py-1 rounded-lg bg-[#141D32] border border-[#1E2C48] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-cyan-400 focus:outline-none"
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-3 h-3 text-cyan-400" /> : <Eye className="w-3 h-3 text-slate-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full h-8 sm:h-8.5 mt-1 rounded-xl bg-gradient-to-r ${selectedRole.color} hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-1.5 border border-white/20`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}</span>
                  </button>
                </form>
              )}

              <div className="pt-1 text-center border-t border-[#1E2C48]">
                <p className="text-[8px] font-mono text-slate-400 uppercase tracking-wider">
                  Emergency Operations • Authorized Personnel Only
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
