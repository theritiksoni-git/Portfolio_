import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, Film, ArrowLeft, Radio } from 'lucide-react';
import sound from '../utils/SoundEngine';


const QUICK_NAV_SCENES = [
  { path: '/', label: 'HOME // 01', desc: 'Main Cinematic Reel' },
  { path: '/work', label: 'WORK // 02', desc: 'Commercial & Short-Form Films' },
  { path: '/about', label: 'ABOUT // 03', desc: 'Director Bio & Creator Story' },
  { path: '/process', label: 'PROCESS // 04', desc: '6-Stage Story Framework' },
  { path: '/skills', label: 'SKILLS // 05', desc: 'Hardware & NLE Tooling' },
  { path: '/contact', label: 'CONTACT // 06', desc: 'Direct Transmission Terminal' },
];

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    sound.playLensClick();
    navigate(path);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 relative cinematic-page-enter">
      {/* Ambient Red & Cyan Atmospheric Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl w-full mx-auto text-center relative z-10">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 font-mono text-xs tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(239,68,68,0.25)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          <span>SCENE 404 // SIGNAL LOST • FRAME NOT FOUND</span>
        </div>

        {/* SMPTE Film Leader Test Strip Graphic */}
        <div className="max-w-md mx-auto mb-8 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          <div className="grid grid-cols-8 h-3">
            <div className="bg-[#f4f4f5]" />
            <div className="bg-[#facc15]" />
            <div className="bg-[#38bdf8]" />
            <div className="bg-[#4ade80]" />
            <div className="bg-[#f43f5e]" />
            <div className="bg-[#ef4444]" />
            <div className="bg-[#3b82f6]" />
            <div className="bg-[#18181b]" />
          </div>
          <div className="py-1 px-3 bg-zinc-950 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-zinc-500">
            <span className="flex items-center gap-1 text-red-400">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              SMPTE PATTERN // NO CARRIER
            </span>
            <span>1000Hz TONE REF</span>
          </div>
        </div>

        {/* Big Glitch 404 Number */}
        <div className="relative mb-3">
          <h1 className="font-syne text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 drop-shadow-[0_0_35px_rgba(56,189,248,0.2)] select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 blur-sm">
            <span className="font-syne text-8xl sm:text-9xl md:text-[11rem] font-black text-cyan-400">
              404
            </span>
          </div>
        </div>

        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold uppercase text-white tracking-tight mb-3">
          TIMELINE MISSING // CUT TO BLACK
        </h2>

        <p className="text-zinc-400 text-sm sm:text-base font-light max-w-xl mx-auto leading-relaxed mb-8">
          The requested sequence frequency could not be resolved. The reel has been trimmed in post-production, moved to deep storage, or does not exist on this timeline.
        </p>

        {/* Telemetry Readout Box */}
        <div className="max-w-lg mx-auto rounded-2xl bg-zinc-950/80 border border-white/10 p-4 mb-8 text-left font-mono text-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-zinc-500 text-[10px] tracking-wider uppercase">
            <span>CONSOLE TELEMETRY</span>
            <span className="text-red-400 font-bold">MEDIA OFFLINE</span>
          </div>
          <div className="space-y-1.5 text-zinc-400">
            <div className="flex justify-between">
              <span className="text-zinc-500">REQUESTED URI:</span>
              <span className="text-cyan-300 truncate max-w-[240px] sm:max-w-[300px]">{location.pathname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">STATUS CODE:</span>
              <span className="text-red-400 font-bold">404 NOT_FOUND</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TIMECODE:</span>
              <span className="text-zinc-300">00:00:00:00 [DROP_FRAME]</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
          <button
            onClick={() => handleNavigate('/')}
            onMouseEnter={() => sound.playHover()}
            data-cursor="HOME"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO HERO SCENE</span>
          </button>

          <button
            onClick={() => handleNavigate('/work')}
            onMouseEnter={() => sound.playHover()}
            data-cursor="WORK"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 hover:border-cyan-500/40 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>EXPLORE CINEMA VAULT</span>
          </button>

          <button
            onClick={() => handleNavigate(-1)}
            onMouseEnter={() => sound.playHover()}
            data-cursor="BACK"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-white/10 font-mono text-xs tracking-wider uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>PREVIOUS FRAME</span>
          </button>
        </div>

        {/* Quick Nav Scene Deck */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-4">
            RE-ROUTE TRANSMISSION DIRECTLY TO ANY PRODUCTION SCENE:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl mx-auto">
            {QUICK_NAV_SCENES.map((scene) => (
              <button
                key={scene.path}
                type="button"
                onClick={() => handleNavigate(scene.path)}
                onMouseEnter={() => sound.playHover()}
                className="p-3 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-cyan-500/30 hover:bg-zinc-900/80 transition-all text-left group"
              >
                <span className="font-mono text-[10px] text-cyan-400 font-bold block group-hover:text-cyan-300">
                  {scene.label}
                </span>
                <span className="font-mono text-[9px] text-zinc-500 block truncate mt-0.5">
                  {scene.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;
