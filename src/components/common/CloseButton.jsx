import React from 'react';
import { X } from 'lucide-react';
import sound from '../../utils/SoundEngine';

const CloseButton = ({
  onClick,
  label = "CLOSE",
  showEscKey = true,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        sound.playClick();
        if (onClick) onClick();
      }}
      onMouseEnter={() => sound.playHover()}
      data-cursor="CLOSE"
      aria-label="Close"
      className={`group relative flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 hover:border-red-500/60 hover:bg-red-950/30 text-zinc-400 hover:text-red-300 shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.35)] transition-all duration-300 focus:outline-none ${className}`}
    >
      {/* Interactive Rotating Cross Icon with Aperture Ring */}
      <div className="w-6 h-6 rounded-full bg-zinc-800/80 border border-white/10 flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-900/40 transition-all duration-300 group-hover:rotate-90">
        <X className="w-3.5 h-3.5 text-zinc-300 group-hover:text-red-200 transition-transform duration-300" />
      </div>

      {/* Label & ESC Shortcut Indicator */}
      <div className="hidden sm:flex items-center gap-1.5">
        <span className="text-[10px] font-mono tracking-widest font-semibold uppercase group-hover:text-red-200 transition-colors">
          {label}
        </span>
        {showEscKey && (
          <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/5 border border-white/10 text-zinc-400 group-hover:border-red-500/30 group-hover:text-red-300 transition-colors">
            ESC
          </span>
        )}
      </div>
    </button>
  );
};

export default CloseButton;
