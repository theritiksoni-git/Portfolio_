import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminStore from '../services/adminStore';
import AdminLayout from '../components/admin/AdminLayout';
import sound from '../utils/SoundEngine';
import { 
  Key, 
  LogIn, 
  Disc, 
  ArrowLeft, 
  AlertCircle,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight,
  FolderKanban,
  Video,
  TrendingUp
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(adminStore.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timecode, setTimecode] = useState('00:00:26:19');
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    setIsAuthenticated(adminStore.isAuthenticated());
    setAdminUsers(adminStore.getAdminUsers());
  }, []);

  // Running SMPTE timecode (24fps broadcast standard)
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const totalSeconds = Math.floor(frame / 24);
      const frames = frame % 24;
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      const pad = (n) => String(n).padStart(2, '0');
      setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    sound.playClick();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const ok = adminStore.login(passcode.trim(), rememberMe);
      if (ok) {
        sound.playLensClick();
        setIsAuthenticated(true);
      } else {
        setError('ACCESS DENIED // Invalid credentials. Enter your private Studio PIN or registered email.');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const handleLoginAs = (user) => {
    sound.playLensClick();
    // Direct login via user passcode or email
    const ok = adminStore.login(user.passcode || user.email, true);
    if (ok) {
      setIsAuthenticated(true);
    }
  };

  // If already logged in, render the full Control Room Dashboard!
  if (isAuthenticated) {
    return <AdminLayout onLogout={() => setIsAuthenticated(false)} />;
  }

  // Find owner and collaborators
  const owner = adminUsers.find((u) => u.role === 'owner') || adminUsers[0];
  const collaborators = adminUsers.filter((u) => u.role !== 'owner');

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col justify-between relative z-20 select-none overflow-x-hidden font-sans">
      {/* 35mm Celluloid Film Grain Overlay */}
      <div className="film-grain pointer-events-none" />

      {/* Atmospheric Soft Radiance Backlights */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[170px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 left-1/3 w-[500px] h-[350px] bg-blue-600/8 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top HUD Header (Exact Match to Website Navbar) */}
      <header className="h-16 px-4 sm:px-6 lg:px-12 bg-black/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          {/* Brand Mark with Spinning Disc */}
          <Link
            to="/"
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-3 group focus:outline-none transition-transform duration-300 hover:scale-102"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-300">
              <Disc className="w-4 h-4 text-cyan-400 animate-spin-slow group-hover:text-cyan-300 transition-colors" />
            </div>
            <div>
              <div className="font-syne font-bold text-sm tracking-wider text-white flex items-center gap-1.5 transition-colors group-hover:text-cyan-200">
                <span>RITIK SONI</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">
                {'// CREATIVE CONTROL ROOM'}
              </div>
            </div>
          </Link>

          {/* Running SMPTE Timecode (Desktop) */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-600 font-semibold">TC</span>
            <span className="px-2.5 py-1 rounded bg-zinc-950 border border-white/10 text-cyan-300 font-bold tracking-widest shadow-[0_0_12px_rgba(56,189,248,0.2)]">
              {timecode}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 ml-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TERMINAL ARMED</span>
            </span>
          </div>

          {/* Return to Public Portfolio */}
          <Link
            to="/"
            onMouseEnter={() => sound.playHover()}
            className="group h-9 px-4 rounded-full bg-zinc-950/90 text-white font-mono font-bold text-xs tracking-wider uppercase border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-zinc-900/90 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:scale-102 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Public Portfolio</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 py-10 sm:py-14 relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Banner Section */}
        <div className="text-center mb-8 sm:mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase shadow-[0_0_20px_rgba(56,189,248,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>PRODUCTION SLATE // STUDIO COMMAND • CAPABILITY GATE • V2.4</span>
          </div>

          <h1 className="font-syne font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-none">
            Creative Control Room
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-zinc-400 font-mono text-xs tracking-widest uppercase pt-1">
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
              DIRECTOR
            </span>
            <span className="text-zinc-600">{'//'}</span>
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              VIDEO EDITOR
            </span>
            <span className="text-zinc-600">{'//'}</span>
            <span className="flex items-center gap-1.5 hover:text-cyan-300 transition-colors">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              SMM LEAD
            </span>
          </div>
        </div>

        {/* Dual Command Slate Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          
          {/* Card 1: Secure Cipher Portal */}
          <div className="rounded-3xl bg-zinc-950/80 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500">
            {/* Corner Optical Alignment Markers */}
            <div className="absolute top-3 left-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute top-3 right-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute bottom-3 left-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute bottom-3 right-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                    Secure Cipher Portal
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-[9px] text-zinc-400 uppercase">
                    AES-256
                  </span>
                </div>
                <div className="font-mono text-[10px] text-emerald-400 tracking-widest uppercase">
                  STATUS: ARMED
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-2.5">
                    Access Passcode // Studio PIN // Collaborator Email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
                      <Key className="w-4 h-4 text-cyan-400" />
                    </div>
                    <input
                      type={showPin ? "text" : "password"}
                      required
                      autoFocus
                      value={passcode}
                      onChange={(e) => {
                        setPasscode(e.target.value);
                        if (error) setError('');
                      }}
                      placeholder="Enter private Studio PIN or email..."
                      className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(56,189,248,0.25)] font-mono text-sm tracking-widest transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setShowPin(!showPin);
                      }}
                      className="p-2 text-zinc-500 hover:text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                      title={showPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs flex items-start gap-2.5 animate-fadeIn">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200 transition-colors">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded bg-zinc-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px]">Remember session authentication</span>
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>PIN IS PRIVATE & ENCRYPTED</span>
                  </span>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onMouseEnter={() => sound.playHover()}
                  className="group relative w-full h-12 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border border-transparent shadow-[0_0_25px_rgba(56,189,248,0.35)] hover:shadow-[0_0_35px_rgba(56,189,248,0.65)] hover:scale-101 active:scale-[0.99] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 overflow-hidden"
                >
                  <LogIn className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                  <span>{isSubmitting ? 'VERIFYING CIPHER...' : 'UNLOCK CONTROL ROOM'}</span>
                </button>
              </form>
            </div>

            {/* Left Card Bottom Security Tags */}
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>RESTRICTED STUDIO ENVIRONMENT</span>
              </span>
              <span>RITIK SONI CREATIVE STUDIOS</span>
            </div>
          </div>

          {/* Card 2: 1-Click Persona Entry (Authorized Station Profiles) */}
          <div className="rounded-3xl bg-zinc-950/80 border border-white/15 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500">
            {/* Corner Optical Alignment Markers */}
            <div className="absolute top-3 left-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute top-3 right-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute bottom-3 left-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>
            <div className="absolute bottom-3 right-3 text-zinc-700 font-mono text-[9px] pointer-events-none select-none">+</div>

            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-xs font-bold tracking-wider text-white uppercase">
                    1-Click Persona Entry
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-300 uppercase tracking-widest">
                  DEV ACCESS
                </span>
              </div>

              <p className="text-zinc-400 font-mono text-[11px] leading-relaxed mb-4">
                Authenticate instantly as the Studio Owner or test capability restrictions as an invited Collaborator:
              </p>

              {/* Persona List */}
              <div className="space-y-3">
                {/* 1. Studio Owner: Ritik Soni */}
                {owner && (
                  <div
                    onClick={() => handleLoginAs(owner)}
                    onMouseEnter={() => sound.playHover()}
                    className="p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-amber-950/30 border border-white/10 hover:border-amber-400/50 transition-all duration-300 flex items-center justify-between cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={owner.avatar}
                          alt={owner.name}
                          className="w-10 h-10 rounded-xl object-cover border border-amber-400/40 group-hover/item:border-amber-400 transition-colors"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 rounded bg-amber-500 text-black font-mono text-[7px] font-bold uppercase">
                          OWN
                        </span>
                      </div>
                      <div>
                        <div className="font-syne font-bold text-sm text-white group-hover/item:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>{owner.name}</span>
                          <span className="text-[10px] text-amber-400 font-mono">★ OWNER</span>
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          {owner.title || 'Director & Lead'} <span className="text-zinc-600">{'//'}</span> <span className="text-amber-400/90 font-medium">Full 7/7 Access</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 group-hover/item:bg-amber-400 group-hover/item:text-black text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shrink-0"
                    >
                      <span>ENTER AS OWNER</span>
                      <ChevronRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {/* 2. Collaborator 1: Maya Sengupta */}
                {collaborators[0] && (
                  <div
                    onClick={() => handleLoginAs(collaborators[0])}
                    onMouseEnter={() => sound.playHover()}
                    className="p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-cyan-950/30 border border-white/10 hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-between cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={collaborators[0].avatar}
                          alt={collaborators[0].name}
                          className="w-10 h-10 rounded-xl object-cover border border-cyan-400/40 group-hover/item:border-cyan-400 transition-colors"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 rounded bg-cyan-500 text-black font-mono text-[7px] font-bold uppercase">
                          COL
                        </span>
                      </div>
                      <div>
                        <div className="font-syne font-bold text-sm text-white group-hover/item:text-cyan-300 transition-colors">
                          {collaborators[0].name}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          {collaborators[0].title || '3D VFX Lead'} <span className="text-zinc-600">{'//'}</span> <span className="text-cyan-400 font-medium">Projects + Media</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 group-hover/item:bg-cyan-400 group-hover/item:text-black text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shrink-0"
                    >
                      <span>ENTER AS MAYA</span>
                      <ChevronRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}

                {/* 3. Collaborator 2: Devansh Verma */}
                {collaborators[1] && (
                  <div
                    onClick={() => handleLoginAs(collaborators[1])}
                    onMouseEnter={() => sound.playHover()}
                    className="p-3.5 rounded-2xl bg-zinc-900/70 hover:bg-sky-950/30 border border-white/10 hover:border-sky-400/50 transition-all duration-300 flex items-center justify-between cursor-pointer group/item"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={collaborators[1].avatar}
                          alt={collaborators[1].name}
                          className="w-10 h-10 rounded-xl object-cover border border-sky-400/40 group-hover/item:border-sky-400 transition-colors"
                        />
                        <span className="absolute -bottom-1 -right-1 px-1 rounded bg-sky-500 text-black font-mono text-[7px] font-bold uppercase">
                          COL
                        </span>
                      </div>
                      <div>
                        <div className="font-syne font-bold text-sm text-white group-hover/item:text-sky-300 transition-colors">
                          {collaborators[1].name}
                        </div>
                        <div className="font-mono text-[10px] text-zinc-400">
                          {collaborators[1].title || 'Client Strategist'} <span className="text-zinc-600">{'//'}</span> <span className="text-sky-400 font-medium">Leads + Content</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 border border-sky-400/30 group-hover/item:bg-sky-400 group-hover/item:text-black text-sky-300 font-mono text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1 shrink-0"
                    >
                      <span>ENTER AS DEVANSH</span>
                      <ChevronRight className="w-3 h-3 group-hover/item:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card Bottom Security Tags */}
            <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ROLE-BASED AUTHORIZATION</span>
              </span>
              <span>100% PERSISTENT</span>
            </div>
          </div>

        </div>

        {/* Telemetry Feature Slate Bar */}
        <div className="mt-8 sm:mt-10 py-3 px-4 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] font-mono text-zinc-400 uppercase tracking-widest text-center">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <strong className="text-white">13 MASTER MODULES</strong>
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span>
            <strong className="text-cyan-300">CAPABILITY-BASED</strong> AUTHENTICATION
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span>
            <strong className="text-white">AES-256</strong> STUDIO ENCRYPTION
          </span>
          <span className="text-zinc-700 hidden sm:inline">•</span>
          <span>
            <strong className="text-white">24 FPS</strong> • <strong className="text-cyan-400">4K DCI</strong> FRAME RATE
          </span>
        </div>

      </main>

      {/* Cinematic Footer (Matching Website Footer) */}
      <footer className="py-4 px-4 sm:px-6 lg:px-12 bg-black/85 border-t border-white/10 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>RITIK SONI CREATIVE STUDIOS // CENTRAL PRODUCTION TERMINAL</div>
        <div className="text-zinc-600 flex items-center gap-2">
          <span>AES-256 CIPHER GATE</span>
          <span>•</span>
          <span className="text-cyan-400/80">SECURE RECTIFY</span>
        </div>
      </footer>
    </div>
  );
}

