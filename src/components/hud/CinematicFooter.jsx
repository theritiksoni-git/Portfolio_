import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Disc, ArrowUp, FileText, Mail } from 'lucide-react';
import sound from '../../utils/SoundEngine';

const FOOTER_NAV = [
  { path: '/', label: 'HOME', code: '01' },
  { path: '/work', label: 'WORK', code: '02' },
  { path: '/about', label: 'ABOUT', code: '03' },
  { path: '/process', label: 'PROCESS', code: '04' },
  { path: '/skills', label: 'SKILLS', code: '05' },
  { path: '/contact', label: 'CONTACT', code: '06' },
];

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/ritiksoni',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/ritiksoni',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'X (Twitter)',
    href: 'https://twitter.com/ritiksoni',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    href: 'mailto:ritiksoni@gmail.com',
    icon: <Mail className="w-4 h-4" />,
  },
];

const CinematicFooter = ({ onOpenResume }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTop = () => {
    sound.playLensClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (path) => {
    sound.playLensClick();
    navigate(path);
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/90 backdrop-blur-2xl py-14 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Upper Footer: Brand & Scene Index Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start justify-between">
          
          {/* Brand & Slate Info (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center">
                <Disc className="w-4 h-4 text-cyan-400 animate-spin-slow" />
              </div>
              <div>
                <div className="font-syne font-bold text-base tracking-wider text-white flex items-center gap-1.5">
                  RITIK SONI
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
                <div className="text-[10px] tracking-widest text-zinc-400 font-mono">
                  FILMMAKER • VIDEO PRODUCTION EXECUTIVE • SMM LEAD
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-sm">
              Directing commercial films, viral retention cuts, and full-funnel content architectures that bridge cinematic emotion with algorithmic scale.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-white/10 text-cyan-300 font-mono text-[10px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>AVAILABLE FOR COMMISSIONS // 2024–2025</span>
            </div>
          </div>

          {/* Scene Navigation Index (Col 4) */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              {"// CINEMATIC SCENE INDEX"}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {FOOTER_NAV.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    onMouseEnter={() => sound.playHover()}
                    className={`text-left py-1 px-2 rounded-md transition-colors flex items-center gap-1.5 ${
                      isActive
                        ? 'text-cyan-400 bg-cyan-950/40 font-semibold border border-cyan-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-[10px] text-zinc-500">{item.code}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Production Credentials & Actions (Col 3) */}
          <div className="md:col-span-3 space-y-4 md:text-right flex flex-col md:items-end">
            <div className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
              {"// CREDITS & ACTIONS"}
            </div>

            <div className="flex flex-wrap md:justify-end gap-2.5">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="RESUME"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(56,189,248,0.25)] hover:shadow-[0_0_22px_rgba(56,189,248,0.5)] transition-all duration-300"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>RESUME (PDF)</span>
              </button>

              <button
                onClick={handleScrollTop}
                onMouseEnter={() => sound.playHover()}
                data-cursor="TOP"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-mono tracking-wider uppercase transition-all duration-300"
              >
                <span>TOP</span>
                <ArrowUp className="w-3 h-3 text-cyan-400" />
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  onMouseEnter={() => sound.playHover()}
                  className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:scale-105 transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Lower Footer: Telemetry & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>© {new Date().getFullYear()} RITIK SONI. ALL RIGHTS RESERVED.</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600">
            <span>24.00 FPS MASTER</span>
            <span>•</span>
            <span>4K DCI CINEMA</span>
            <span>•</span>
            <span className="text-cyan-400/80">WEBGL 3D ENVIRONMENT</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default CinematicFooter;
