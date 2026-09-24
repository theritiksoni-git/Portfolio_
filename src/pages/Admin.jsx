import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminStore from '../services/adminStore';
import AdminLayout from '../components/admin/AdminLayout';
import { 
  Key, 
  LogIn, 
  Disc, 
  ArrowLeft, 
  AlertCircle,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(adminStore.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timecode, setTimecode] = useState('00:00:27:17');

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
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const ok = adminStore.login(passcode.trim(), rememberMe);
      if (ok) {
        setIsAuthenticated(true);
      } else {
        setError('ACCESS DENIED // Invalid credentials. Please enter your private Studio PIN or registered email.');
      }
      setIsSubmitting(false);
    }, 250);
  };

  // If already logged in, render the full Control Room Dashboard!
  if (isAuthenticated) {
    return <AdminLayout onLogout={() => setIsAuthenticated(false)} />;
  }

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col justify-between relative z-10 select-none overflow-x-hidden font-sans">
      {/* Atmospheric Soft Radiance Backlights */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[250px] bg-blue-600/8 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Top HUD Header (Exact Match to Website Navbar) */}
      <header className="h-16 px-4 sm:px-6 lg:px-12 bg-black/85 backdrop-blur-xl border-b border-white/10 flex items-center justify-between sticky top-0 z-40">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
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
            className="group h-9 px-4 rounded-full bg-zinc-950/90 text-white font-mono font-bold text-xs tracking-wider uppercase border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-zinc-900/90 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:scale-102 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-1.5 backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Public Portfolio</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area: Centered Sovereign Command Terminal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-14 relative z-10 w-full max-w-xl mx-auto">
        
        {/* Terminal Gate Card */}
        <div className="w-full rounded-3xl bg-zinc-950/80 border border-white/15 p-6 sm:p-9 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-500 space-y-6">
          
          {/* Card Top Branding & Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900/90 border border-cyan-500/40 shadow-[0_0_25px_rgba(56,189,248,0.25)] mb-1 group-hover:scale-105 transition-transform duration-300">
              <Disc className="w-7 h-7 text-cyan-400 animate-spin-slow" />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>STUDIO COMMAND // SECURE CIPHER GATE</span>
              </div>
            </div>

            <h1 className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-tight">
              Creative Control Room
            </h1>

            <p className="text-zinc-400 text-xs sm:text-[13px] font-light max-w-sm mx-auto leading-relaxed">
              Directing, editorial telemetry & central asset management for Ritik Soni Studios.
            </p>
          </div>

          {/* Authentication Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] uppercase tracking-wider mb-2">
                Access Passcode // Studio PIN // Email
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
                  onClick={() => setShowPin(!showPin)}
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

            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer hover:text-zinc-200 transition-colors">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-zinc-900 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px]">Remember session</span>
              </label>
              <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>ENCRYPTED CIPHER</span>
              </span>
            </div>

            {/* Glowing Hero Action Button (Matching HeroSection) */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full h-12 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border border-transparent shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:scale-101 active:scale-[0.99] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 overflow-hidden"
            >
              <LogIn className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
              <span>{isSubmitting ? 'VERIFYING CIPHER...' : 'UNLOCK CONTROL ROOM'}</span>
            </button>
          </form>

          {/* Security Indicator */}
          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>AES-256 ENCRYPTED SESSION</span>
            </span>
            <span className="text-zinc-500">13 MODULES ACTIVE</span>
          </div>

        </div>

      </main>

      {/* Cinematic Footer (Matching Website Footer) */}
      <footer className="py-4 px-4 sm:px-6 lg:px-12 bg-black/85 border-t border-white/10 text-center text-xs font-mono text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>RITIK SONI CREATIVE STUDIOS // CENTRAL PRODUCTION TERMINAL</div>
        <div className="text-zinc-600">v2.4.0-CINEMA • ALL SESSIONS LOGGED</div>
      </footer>
    </div>
  );
}


