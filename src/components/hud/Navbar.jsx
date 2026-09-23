import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VolumeX, FileText, Menu, X, Disc } from 'lucide-react';
import sound from '../../utils/SoundEngine';

const NAV_ITEMS = [
  { path: '/', label: 'HOME', code: '01' },
  { path: '/work', label: 'WORK', code: '02' },
  { path: '/about', label: 'ABOUT', code: '03' },
  { path: '/process', label: 'PROCESS', code: '04' },
  { path: '/skills', label: 'SKILLS', code: '05' },
  { path: '/contact', label: 'CONTACT', code: '06' },
];

const Navbar = ({ onOpenResume, isBackgroundSoundOn, onToggleBackgroundSound, isVisible: propVisible }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [internalVisible, setInternalVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isVisible = propVisible !== undefined ? propVisible : internalVisible;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      if (propVisible === undefined) {
        // Keep navbar visible at the very top of the page
        if (currentScrollY <= 15) {
          setInternalVisible(true);
          lastScrollY.current = currentScrollY;
          return;
        }

        const delta = currentScrollY - lastScrollY.current;

        // Detect scroll direction
        if (Math.abs(delta) > 6) {
          if (delta > 0) {
            // Scrolling DOWN -> Slide upwards and disappear
            setInternalVisible(false);
          } else {
            // Scrolling UP -> Slide down into view
            setInternalVisible(true);
          }
          lastScrollY.current = currentScrollY;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [propVisible]);

  // Ensure navbar is visible when navigating between pages
  useEffect(() => {
    if (propVisible === undefined) {
      setInternalVisible(true);
      lastScrollY.current = window.scrollY;
    }
  }, [location.pathname, propVisible]);

  const handleNavClick = (path) => {
    sound.playLensClick();
    navigate(path);
    setMobileMenuOpen(false);
    setInternalVisible(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transform transition-transform duration-350 ease-in-out will-change-transform ${
          isVisible || mobileMenuOpen
            ? 'translate-y-0'
            : '-translate-y-full shadow-none pointer-events-none'
        } ${
          scrolled ? 'py-3 bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Mark / Film Identity */}
          <button
            onClick={() => handleNavClick('/')}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-3 group text-left focus:outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102"
            data-cursor="HOME"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.35)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <Disc className="w-4 h-4 text-cyan-400 animate-spin-slow group-hover:text-cyan-300 transition-colors duration-300" />
            </div>
            <div>
              <div className="font-syne font-bold text-sm tracking-wider text-white flex items-center gap-1.5 transition-colors duration-300 group-hover:text-cyan-200">
                RITIK SONI
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>
              <div className="text-[10px] tracking-widest text-zinc-400 font-mono transition-colors duration-300 group-hover:text-zinc-300">
                FILMMAKER • SMM & POST LEAD
              </div>
            </div>
          </button>

          {/* Desktop Floating HUD Navigation */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  onMouseEnter={() => sound.playHover()}
                  data-cursor={item.label}
                  className={`group relative px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none ${
                    isActive
                      ? 'text-cyan-300 font-semibold bg-cyan-950/60 shadow-[0_0_14px_rgba(56,189,248,0.25)] border border-cyan-500/40 scale-102'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.06] border border-transparent hover:scale-102'
                  }`}
                >
                  <span className={`text-[10px] mr-1.5 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isActive ? 'text-cyan-400/80 font-bold' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                    {item.code}
                  </span>
                  <span className="relative z-10 inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions: Audio & Resume Trigger */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleBackgroundSound}
              onMouseEnter={() => sound.playHover()}
              data-cursor={isBackgroundSoundOn ? 'MUTE' : 'AUDIO'}
              title={isBackgroundSoundOn ? 'Mute background audio' : 'Play background audio'}
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 focus:outline-none ${
                isBackgroundSoundOn
                  ? 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              aria-label={isBackgroundSoundOn ? 'Turn background audio off' : 'Turn background audio on'}
            >
              {isBackgroundSoundOn ? (
                <div className="flex items-end gap-[2px] h-3.5 w-3.5 py-0.5 justify-center">
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-1" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-2" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-3" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-4" />
                </div>
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400 transition-colors" />
              )}
            </button>

            {/* Resume Button - Styled like Hero Explore Selected Work */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenResume();
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="RESUME"
              className="group relative flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-mono font-bold text-xs tracking-wider uppercase overflow-hidden shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:scale-102 transition-all duration-300 focus:outline-none"
            >
              <FileText className="w-3.5 h-3.5 text-black" />
              <span>RESUME</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleBackgroundSound}
              data-cursor={isBackgroundSoundOn ? 'MUTE' : 'AUDIO'}
              aria-label={isBackgroundSoundOn ? 'Turn background audio off' : 'Turn background audio on'}
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center transition-all duration-300 active:scale-95 hover:border-cyan-500/40"
            >
              {isBackgroundSoundOn ? (
                <div className="flex items-end gap-[2px] h-4 w-4 py-0.5 justify-center">
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-1" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-2" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-3" />
                  <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-bar-4" />
                </div>
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              data-cursor="MENU"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 flex items-center justify-center transition-all duration-300 active:scale-95 hover:border-cyan-500/40"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Fullscreen Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto px-6 sm:hidden animate-fadeIn transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
          <div className="space-y-4 my-auto">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>{'// CINEMATIC SCENE DIRECTORY'}</span>
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between text-left py-3 border-b border-white/5 font-syne text-xl tracking-wider min-h-[48px] transition-all duration-300 active:scale-[0.98] ${
                  location.pathname === item.path ? 'text-cyan-400 font-bold translate-x-1' : 'text-zinc-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-zinc-500">{item.code}</span>
              </button>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="w-full min-h-[48px] py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 active:scale-98 transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)]"
              >
                <FileText className="w-4 h-4 text-black" />
                <span>VIEW & DOWNLOAD RESUME</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
