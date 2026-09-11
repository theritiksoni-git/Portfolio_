import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import sound from '../../utils/SoundEngine';

const ViewportHUD = ({ activeSection, isLetterbox, onToggleLetterbox }) => {
  const [timecode, setTimecode] = useState('00:00:00:00');

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

  return (
    <>
      {/* Cinematic Letterbox Bars (background-only overlay) */}
      <div
        className={`pointer-events-none fixed top-0 left-0 right-0 bg-black z-[5] transition-all duration-700 ease-out no-print ${isLetterbox ? 'h-8 sm:h-12' : 'h-0'
          }`}
      />
      <div
        className={`pointer-events-none fixed bottom-0 left-0 right-0 bg-black z-[5] transition-all duration-700 ease-out no-print ${isLetterbox ? 'h-8 sm:h-12' : 'h-0'
          }`}
      />

      {/* Cinematic Viewfinder HUD Overlay */}
      <div
        id="viewport-hud"
        className="viewport-hud no-print pointer-events-none fixed inset-0 z-30 flex flex-col justify-between px-3 pt-20 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:px-5 sm:pt-24 sm:pb-5 select-none opacity-45 hover:opacity-80 transition-opacity duration-500"
      >

        {/* Top Viewfinder Metadata */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-500">

          {/* REC Status & Camera Sensor Meta */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/40 border border-red-500/30 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 camera-tally-dot" />
              <span className="font-bold text-[9px]">REC</span>
            </div>
            <div className="hidden md:flex items-center gap-3 text-zinc-500">
              <span>24.000 FPS</span>
              <span className="text-zinc-700">|</span>
              <span>180° SHUTTER</span>
              <span className="text-zinc-700">|</span>
              <span>ISO 800</span>
              <span className="text-zinc-700">|</span>
              <span className="text-cyan-400/80 font-semibold">4K DCI</span>
            </div>
          </div>

          {/* SMPTE Running Timecode */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-zinc-600">TC</span>
            <span className="px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5 text-cyan-400/90 font-bold tracking-widest">
              {timecode}
            </span>
          </div>
        </div>

        {/* Bottom Viewfinder Controls */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400">

          {/* Active Scene Code */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-600">SCENE:</span>
            <span className="text-cyan-300 font-semibold uppercase">
              {activeSection.toUpperCase()}
            </span>
            <span className="hidden sm:inline text-zinc-600">{"// SEQUENCE 01"}</span>
          </div>

          {/* CinemaScope Letterbox Aspect Toggle */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onToggleLetterbox();
              }}
              data-cursor="VIEW"
              onMouseEnter={() => sound.playHover()}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] transition-all duration-300 focus:outline-none ${isLetterbox
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-zinc-200'
                }`}
              title="Toggle CinemaScope 2.39:1 Aspect Ratio Letterbox"
            >
              <Film className="w-3 h-3" />
              <span>{isLetterbox ? '2.39:1 SCOPE' : '16:9 FULL'}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewportHUD;
