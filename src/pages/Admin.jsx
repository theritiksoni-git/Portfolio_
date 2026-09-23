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
  AlertCircle
} from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(adminStore.isAuthenticated());
  const [passcode, setPasscode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsAuthenticated(adminStore.isAuthenticated());
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

  // Otherwise, render the Cyber Access Terminal Gate
  return (
    <div className="min-h-screen bg-[#050608] text-white flex flex-col items-center justify-center p-4 relative z-20 select-none overflow-hidden">
      {/* Background Radiance Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Access Gate Terminal Card */}
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-zinc-950/85 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl relative z-10 space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 border border-cyan-500/40 shadow-[0_0_20px_rgba(56,189,248,0.25)] mb-2">
            <Disc className="w-7 h-7 text-cyan-400 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>CENTRAL STUDIO COMMAND // RESTRICTED</span>
          </div>

          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Creative Control Room
          </h1>
          <p className="text-zinc-400 text-xs font-light">
            Authenticate to access studio management, portfolio projects, media vault, and CRM leads.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1.5">
              Access Passcode / Collaborator PIN / Email
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-sm tracking-widest"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono text-[11px] flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-mono text-[11px]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-zinc-900 border-white/10 text-cyan-500 focus:ring-0"
              />
              <span>Remember session</span>
            </label>
            <span className="font-mono text-[10px] text-zinc-500">
              DEFAULT PIN: 2026
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 hover:scale-102 shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'VERIFYING CIPHER...' : 'UNLOCK CONTROL ROOM'}</span>
          </button>
        </form>

        {/* Quick Access Dev & Capability Testing Switcher */}
        <div className="pt-2 border-t border-white/5 space-y-2.5">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">
            {'DEV ACCESS // 1-CLICK PERSONA LOGIN'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleLoginAs('2026')}
              className="p-2 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/30 text-amber-300 font-mono text-[10px] flex flex-col items-center justify-center transition-all group"
            >
              <span className="font-bold group-hover:scale-105 transition-transform">Ritik (Owner)</span>
              <span className="text-[8px] text-amber-400/80">Full Access (7/7)</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoginAs('1111')}
              className="p-2 rounded-xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] flex flex-col items-center justify-center transition-all group"
            >
              <span className="font-bold group-hover:scale-105 transition-transform">Maya (Editor)</span>
              <span className="text-[8px] text-cyan-400/80">Projects & Media</span>
            </button>

            <button
              type="button"
              onClick={() => handleLoginAs('2222')}
              className="p-2 rounded-xl bg-sky-950/30 hover:bg-sky-900/40 border border-sky-500/30 text-sky-300 font-mono text-[10px] flex flex-col items-center justify-center transition-all group"
            >
              <span className="font-bold group-hover:scale-105 transition-transform">Devansh (CRM)</span>
              <span className="text-[8px] text-sky-400/80">Leads & Content</span>
            </button>
          </div>

          <Link
            to="/"
            className="w-full py-2 text-center text-xs font-mono text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1.5 transition-colors pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
