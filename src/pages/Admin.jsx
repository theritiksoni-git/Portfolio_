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
  Clapperboard,
  Scissors,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Lock
} from 'lucide-react';

const TELEMETRY_METRICS = [
  { label: 'MASTER MODULES', val: '13' },
  { label: 'AUTHENTICATION', val: 'CAPABILITY-BASED' },
  { label: 'STUDIO ENCRYPTION', val: 'AES-256' },
  { label: 'FRAME RATE', val: '24 FPS • 4K DCI' },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(adminStore.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    setIsAuthenticated(adminStore.isAuthenticated());
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
        setError('ACCESS DENIED // Invalid credentials. Enter 2026/admin (Owner), 1111 (Maya), or 2222 (Devansh).');
      }
      setIsSubmitting(false);
    }, 250);
  };

  const handleLoginAs = (pin) => {
    sound.playLensClick();
    const ok = adminStore.login(pin, true);
    if (ok) {
      setIsAuthenticated(true);
    }
  };

  // If already logged in, render the full Control Room Dashboard!
  if (isAuthenticated) {
    return <AdminLayout onLogout={() => setIsAuthenticated(false)} />;
  }

  // Otherwise, render the Cinematic Cyber Access Terminal Gate matching the website theme
  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col justify-between relative z-20 select-none overflow-x-hidden font-sans">
      {/* 35mm Film Grain Overlay (Matching Website Theme) */}
      <div className="film-grain" />

      {/* Atmospheric Soft Radiance Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-sky-500/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Top HUD Slate Header (Matching Website Navbar) */}
      <header className="py-4 px-4 sm:px-6 lg:px-12 bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Mark with Spinning Disc */}
          <Link
            to="/"
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

          {/* Center Running SMPTE Timecode (Desktop) */}
          <div className="hidden md:flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-600">TC</span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-950 border border-white/10 text-cyan-300 font-bold tracking-widest shadow-inner">
              {timecode}
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5 ml-2 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TERMINAL ARMED</span>
            </span>
          </div>

          {/* Right Action: Return to Public Portfolio */}
          <Link
            to="/"
            className="group h-9 px-4 rounded-full bg-zinc-950/90 text-white font-mono font-bold text-xs tracking-wider uppercase border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-zinc-900/90 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:scale-102 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Public Portfolio</span>
          </Link>
        </div>
      </header>

      {/* Main Terminal Gateway Canvas */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 w-full flex flex-col justify-center relative z-10">
        
        {/* Production Slate Header Pill (Matching HeroSection) */}
        <div className="flex flex-col items-center sm:items-start mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/85 border border-white/10 text-zinc-300 font-mono text-[11px] sm:text-xs tracking-widest uppercase mb-3 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-zinc-500 font-bold">PRODUCTION SLATE //</span>
            <span className="text-cyan-300">STUDIO COMMAND • CAPABILITY GATE • v2.4</span>
          </div>

          <h1 className="font-syne font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight uppercase leading-[0.95] text-white">
            Creative Control Room
          </h1>

          {/* Craft Disciplines Line (Matching HeroSection) */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 font-mono text-xs tracking-wider text-zinc-300 select-none">
            <div className="inline-flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-medium tracking-widest uppercase">DIRECTOR</span>
            </div>
            <span className="text-zinc-600 font-mono text-xs">{"//"}</span>
            <div className="inline-flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="font-medium tracking-widest uppercase">VIDEO EDITOR</span>
            </div>
            <span className="text-zinc-600 font-mono text-xs">{"//"}</span>
            <div className="inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-medium tracking-widest uppercase">SMM LEAD</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Cipher Terminal (Col 7) + Persona & System Telemetry (Col 5) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* Left Column (Col 7): The Cipher Authentication Portal */}
          <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-zinc-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500">
            {/* Viewfinder Top Bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-cyan-300 font-mono text-[9px] tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>SECURE CIPHER PORTAL</span>
                </span>
                <span className="px-2 py-1 rounded bg-black/60 border border-white/10 text-zinc-400 font-mono text-[9px]">
                  AES-256
                </span>
              </div>
              <span className="px-2 py-1 rounded bg-black/80 border border-cyan-500/30 text-cyan-300 font-mono text-[9px] tracking-widest uppercase">
                STATUS: ARMED
              </span>
            </div>

            {/* Terminal Cipher Form */}
            <form onSubmit={handleLogin} className="space-y-5 my-auto">
              <div>
                <label className="block text-zinc-400 font-mono text-xs uppercase tracking-wider mb-2">
                  Access Passcode // Master PIN // Collaborator Email
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <Key className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter PIN (e.g. 2026, 1111, 2222)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(56,189,248,0.25)] font-mono text-sm tracking-widest transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs hover:text-zinc-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-zinc-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Remember session authentication</span>
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  MASTER PIN: <strong className="text-zinc-300">2026</strong>
                </span>
              </div>

              {/* Glowing Hero Action Button (Matching HeroSection) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full h-13 px-8 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border border-transparent shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:scale-101 active:scale-[0.99] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 overflow-hidden"
              >
                <LogIn className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                <span>{isSubmitting ? 'VERIFYING CIPHER TRANSMISSION...' : 'UNLOCK CONTROL ROOM'}</span>
              </button>
            </form>

            {/* Terminal Security Bottom Indicator */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>RESTRICTED STUDIO ENVIRONMENT</span>
              </span>
              <span className="text-zinc-400">RITIK SONI CREATIVE STUDIOS</span>
            </div>
          </div>

          {/* Right Column (Col 5): 1-Click Persona Simulator & Capabilities Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-zinc-950/85 border border-white/15 backdrop-blur-2xl shadow-2xl relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500 space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1-Click Persona Entry</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[9px] font-bold uppercase">
                  DEV ACCESS
                </span>
              </div>
              <p className="text-zinc-400 text-xs mt-1">
                Authenticate instantly as the Studio Owner or test capability restrictions as an invited Collaborator:
              </p>
            </div>

            {/* Persona Cards Grid */}
            <div className="space-y-3">
              {/* Persona 1: Owner Ritik */}
              <button
                type="button"
                onClick={() => handleLoginAs('2026')}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-900 border border-amber-500/40 hover:border-amber-400 text-left transition-all duration-300 group/btn flex items-center justify-between shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                      alt="Ritik Soni"
                      className="w-10 h-10 rounded-xl object-cover border border-amber-400/50"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 rounded bg-amber-500 text-black font-mono text-[8px] font-bold">
                      OWN
                    </span>
                  </div>
                  <div>
                    <div className="font-syne font-bold text-sm text-white flex items-center gap-1.5">
                      <span>Ritik Soni</span>
                      <span className="text-[10px] text-amber-400 font-mono">★ OWNER</span>
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      Director & Lead // <span className="text-amber-300 font-bold">Full 7/7 Access</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 group-hover/btn:translate-x-1 transition-transform">
                  <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">PIN: 2026</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Persona 2: Maya Sengupta */}
              <button
                type="button"
                onClick={() => handleLoginAs('1111')}
                className="w-full p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-cyan-500/50 text-left transition-all duration-300 group/btn flex items-center justify-between hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80"
                      alt="Maya Sengupta"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 rounded bg-cyan-500 text-black font-mono text-[8px] font-bold">
                      COL
                    </span>
                  </div>
                  <div>
                    <div className="font-syne font-bold text-sm text-white">
                      Maya Sengupta
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      3D VFX Lead // <span className="text-cyan-300 font-bold">Projects + Media</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 group-hover/btn:translate-x-1 transition-transform">
                  <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30">PIN: 1111</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Persona 3: Devansh Verma */}
              <button
                type="button"
                onClick={() => handleLoginAs('2222')}
                className="w-full p-3.5 rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-cyan-500/50 text-left transition-all duration-300 group/btn flex items-center justify-between hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                      alt="Devansh Verma"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20"
                    />
                    <span className="absolute -bottom-1 -right-1 px-1 rounded bg-sky-500 text-black font-mono text-[8px] font-bold">
                      COL
                    </span>
                  </div>
                  <div>
                    <div className="font-syne font-bold text-sm text-white">
                      Devansh Verma
                    </div>
                    <div className="font-mono text-[10px] text-zinc-400">
                      Client Strategist // <span className="text-sky-300 font-bold">Leads + Content</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-sky-400 group-hover/btn:translate-x-1 transition-transform">
                  <span className="text-[10px] bg-sky-500/20 px-2 py-0.5 rounded border border-sky-500/30">PIN: 2222</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Quick Security Guarantee */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ROLE-BASED AUTHORIZATION</span>
              </span>
              <span className="text-cyan-400 font-medium">100% PERSISTENT</span>
            </div>
          </div>

        </div>

        {/* Bottom Credibility Metrics Ticker (Matching HeroSection) */}
        <div className="mt-8 flex items-center flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar gap-x-3 sm:gap-x-4 pt-6 border-t border-white/10 font-mono text-[10px] sm:text-xs w-full select-none cursor-default">
          {TELEMETRY_METRICS.map((m, idx) => (
            <React.Fragment key={idx}>
              <div className="inline-flex items-center gap-1.5 shrink-0">
                <span className="text-cyan-400 font-bold">{m.val}</span>
                <span className="text-zinc-400 font-normal uppercase">{m.label}</span>
              </div>
              {idx < TELEMETRY_METRICS.length - 1 && (
                <span className="text-zinc-700 text-[10px] shrink-0 select-none">•</span>
              )}
            </React.Fragment>
          ))}
        </div>

      </main>

      {/* Tactical Sub-footer */}
      <footer className="py-4 px-4 sm:px-6 lg:px-12 bg-black/60 border-t border-white/10 text-center text-xs font-mono text-zinc-600 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>RITIK SONI CREATIVE STUDIOS // CENTRAL PRODUCTION TERMINAL</div>
        <div className="text-zinc-500">AES-256 CIPHER GATE • SECURE RECTIFY</div>
      </footer>
    </div>
  );
}
