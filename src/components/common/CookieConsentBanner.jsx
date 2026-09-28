import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, Check } from 'lucide-react';
import sound from '../../utils/SoundEngine';

const STORAGE_KEY = 'ritik_cookie_consent';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) {
        // Slight delay before presenting so it doesn't collide with initial landing animations
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // If localStorage is blocked by browser security, fail gracefully
    }
  }, []);

  const handleAccept = () => {
    sound.playLensClick();
    try {
      localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    sound.playClick();
    try {
      localStorage.setItem(STORAGE_KEY, 'declined');
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and telemetry consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fadeIn"
    >
      <div className="relative rounded-2xl bg-[#090b10]/95 backdrop-blur-2xl border border-cyan-500/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.2)] select-none">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-mono text-[10px] font-bold tracking-widest text-cyan-300 uppercase">
              {"// TELEMETRY & PRIVACY DISCLOSURE"}
            </span>
          </div>

          <button
            onClick={handleDecline}
            aria-label="Dismiss consent disclosure"
            className="text-zinc-500 hover:text-zinc-300 transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Narrative */}
        <p className="text-zinc-300 text-xs font-light leading-relaxed mb-4">
          This portfolio utilizes minimal anonymous telemetry (Vercel Speed Insights & Analytics) and local preferences (audio engine settings) to ensure optimal 60fps rendering. No third-party ad profiling cookies are deployed.
        </p>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2.5 pt-1">
          <Link
            to="/privacy"
            onClick={() => sound.playClick()}
            className="text-[11px] font-mono text-cyan-400/90 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-400 transition-colors"
          >
            Privacy Policy
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDecline}
              onMouseEnter={() => sound.playHover()}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 font-mono text-[11px] tracking-wider uppercase transition-all"
            >
              DECLINE
            </button>

            <button
              onClick={handleAccept}
              onMouseEnter={() => sound.playHover()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-[11px] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(56,189,248,0.35)] hover:scale-102"
            >
              <Check className="w-3 h-3 text-black stroke-[3]" />
              <span>ACCEPT</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
