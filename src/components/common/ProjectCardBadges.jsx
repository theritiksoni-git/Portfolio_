import React from 'react';

const CLIENT_LOGOS = {
  'Adentech': '/img/client-logos/adentech.png',
  'Red Bull': '/img/client-logos/redbull.png',
  'Red Bull Event Content': '/img/client-logos/redbull.png',
  'Reliance Industries': '/img/client-logos/reliance-industries-limited.png',
  'Vishwa Vinayak Group': '/img/client-logos/vishwa-vinayak-group.png',
};

export const ClientLogoBadge = ({ client, badge, showBadge = false }) => {
  const logoSrc = CLIENT_LOGOS[client];

  return (
    <div className="flex items-center gap-1.5 pointer-events-auto">
      {logoSrc ? (
        <div
          title={client}
          className="h-6 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-md transition-all duration-300 hover:border-cyan-400/60 hover:bg-black/90 overflow-hidden"
        >
          <img
            src={logoSrc}
            alt={client}
            className={`object-contain filter brightness-0 invert opacity-95 transition-all hover:opacity-100 ${
              client.includes('Aden')
                ? 'h-5 sm:h-5.5 w-auto max-w-[75px] scale-[1.75]'
                : 'h-3 sm:h-3.5 w-auto max-w-[65px]'
            }`}
          />
        </div>
      ) : client === 'Zaggle' ? (
        <div
          title="Zaggle FinTech"
          className="h-6 px-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-md"
        >
          <span className="font-syne font-black text-[10px] tracking-wider text-white">ZAGGLE</span>
        </div>
      ) : client === 'Yukio' ? (
        <div
          title="Yukio Living"
          className="h-6 px-2.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 flex items-center justify-center shadow-md"
        >
          <span className="font-syne font-black text-[10px] tracking-wider text-white">YUKIO</span>
        </div>
      ) : (
        <div className="h-6 px-2.5 rounded-full bg-black/75 backdrop-blur-md border border-cyan-500/30 text-cyan-300 font-mono text-[9px] tracking-wider uppercase font-semibold flex items-center justify-center shadow-md">
          {client.replace('Content', '').trim()}
        </div>
      )}

      {showBadge && badge && (
        <span className="hidden sm:inline-flex items-center h-6 px-2 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[9px] tracking-wider uppercase">
          {badge}
        </span>
      )}
    </div>
  );
};

export const ToolIcon = ({ tool }) => {
  if (!tool) return null;
  const t = String(tool).toLowerCase().trim();

  if (t.includes('premiere')) {
    return (
      <div
        title="Adobe Premiere Pro"
        className="w-5 h-5 rounded-[4px] bg-[#00005b] border border-[#9999ff]/60 flex items-center justify-center text-[#9999ff] font-sans font-black text-[10px] select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-help"
      >
        Pr
      </div>
    );
  }

  if (t.includes('after effects') || t === 'ae') {
    return (
      <div
        title="Adobe After Effects"
        className="w-5 h-5 rounded-[4px] bg-[#1a0033] border border-[#d291ff]/60 flex items-center justify-center text-[#d291ff] font-sans font-black text-[10px] select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-help"
      >
        Ae
      </div>
    );
  }

  if (t.includes('davinci') || t.includes('resolve')) {
    return (
      <div
        title="DaVinci Resolve"
        className="w-5 h-5 rounded-[4px] bg-zinc-950 border border-zinc-700/60 flex items-center justify-center select-none shrink-0 shadow-sm p-0.5 filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:border-amber-500/60 hover:scale-110 transition-all duration-300 cursor-help"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
          <circle cx="12" cy="7" r="3.2" fill="#ef4444" />
          <circle cx="7.5" cy="15.5" r="3.2" fill="#10b981" />
          <circle cx="16.5" cy="15.5" r="3.2" fill="#3b82f6" />
        </svg>
      </div>
    );
  }

  if (t.includes('illustrator')) {
    return (
      <div
        title="Adobe Illustrator"
        className="w-5 h-5 rounded-[4px] bg-[#2a1000] border border-[#ff9a00]/60 flex items-center justify-center text-[#ff9a00] font-sans font-black text-[10px] select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-help"
      >
        Ai
      </div>
    );
  }

  if (t.includes('meta')) {
    return (
      <div
        title="Meta Business Suite"
        className="w-5 h-5 rounded-[4px] bg-[#00142b] border border-[#0081fb]/60 flex items-center justify-center p-0.5 select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:border-[#0081fb] transition-all duration-300 cursor-help"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#0081fb]" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" />
        </svg>
      </div>
    );
  }

  if (t.includes('youtube') || t.includes('shorts')) {
    return (
      <div
        title={tool}
        className="w-5 h-5 rounded-[4px] bg-[#220000] border border-[#ff0000]/60 flex items-center justify-center p-0.5 select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:border-[#ff0000] transition-all duration-300 cursor-help"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-[#ff0000]" xmlns="http://www.w3.org/2000/svg">
          <path d="m18.931 9.99-1.441-.601 1.717-.913a4.48 4.48 0 0 0 1.874-6.078 4.506 4.506 0 0 0-6.09-1.874L4.792 5.929a4.504 4.504 0 0 0-2.402 4.193 4.521 4.521 0 0 0 2.666 3.904c.036.012 1.442.6 1.442.6l-1.706.901a4.51 4.51 0 0 0-2.369 3.967A4.528 4.528 0 0 0 6.93 24c.725 0 1.437-.174 2.08-.508l10.21-5.406a4.494 4.494 0 0 0 2.39-4.192 4.525 4.525 0 0 0-2.678-3.904ZM9.597 15.19V8.824l6.007 3.184z" />
        </svg>
      </div>
    );
  }

  if (t.includes('ops')) {
    return (
      <div
        title="Content Ops"
        className="w-5 h-5 rounded-[4px] bg-[#022c22] border border-[#10b981]/60 flex items-center justify-center p-0.5 select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 hover:scale-110 hover:border-[#10b981] transition-all duration-300 cursor-help"
      >
        <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
      </div>
    );
  }

  // Fallback: uniform 20x20 square chip with tooltip, never a long text pill
  return (
    <div
      title={tool}
      className="w-5 h-5 rounded-[4px] bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 font-mono text-[8px] font-bold select-none shrink-0 shadow-sm filter grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all cursor-help uppercase"
    >
      {String(tool).slice(0, 2)}
    </div>
  );
};

