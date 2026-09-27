import React, { useState, useEffect } from 'react';
import ContactSection from '../components/sections/ContactSection';
import { 
  Send, 
  Clock, 
  Globe, 
  Copy, 
  Check, 
  Tv, 
  Award, 
  Layers, 
  HelpCircle,
  Radio
} from 'lucide-react';
import sound from '../utils/SoundEngine';
import usePortfolioData from '../utils/usePortfolioData';

const ContactPage = ({ onOpenResume }) => {
  const { settings, availability } = usePortfolioData();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  const adminEmail = settings?.adminEmail || 'theritiksoni@gmail.com';

  // Live IST running clock
  useEffect(() => {
    const updateTime = () => {
      try {
        const istString = new Date().toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setCurrentTime(`${istString} IST`);
      } catch (e) {
        const d = new Date();
        setCurrentTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')} IST`);
      }
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adminEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const scrollToAnchor = (id) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header & Direct Transmission Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        {/* Scene Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 06 // PRODUCTION TRANSMISSION TERMINAL • DIRECT COMMISSION & INTAKE</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
              INITIATE{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                CONTACT
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-2xl font-light leading-relaxed">
              Commission a high-end commercial campaign, request full-funnel viral social media direction, or inquire about full-time video executive leadership. All transmissions route directly to Ritik's priority terminal.
            </p>
          </div>

          {/* Quick Anchor Navigation Jump Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => scrollToAnchor('studio-monitor')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Tv className="w-3 h-3 text-cyan-400" />
              <span>01 // STUDIO MONITOR</span>
            </button>
            <button
              onClick={() => scrollToAnchor('client-credentials')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Award className="w-3 h-3 text-cyan-400" />
              <span>02 // CLIENTS</span>
            </button>
            <button
              onClick={() => scrollToAnchor('project-scopes')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>03 // SCOPES</span>
            </button>
            <button
              onClick={() => scrollToAnchor('inquiry-terminal')}
              className="px-3 py-1.5 rounded-full bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(56,189,248,0.2)]"
            >
              <Send className="w-3 h-3 text-cyan-400" />
              <span>04 // TRANSMIT</span>
            </button>
            <button
              onClick={() => scrollToAnchor('production-faq')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>05 // FAQ</span>
            </button>
          </div>
        </div>

        {/* Executive Studio Telemetry Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          
          {/* Card 1: Production Status */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-syne font-extrabold text-sm sm:text-base text-white tracking-wide">
                  {availability?.status || 'BOOKING Q2 / Q3 2026'}
                </span>
              </div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mt-0.5">
                Live Production Roster
              </div>
            </div>
          </div>

          {/* Card 2: Response Guarantee */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-base sm:text-lg text-white">
                &lt; 24 Hours
              </div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                Direct Priority Response
              </div>
            </div>
          </div>

          {/* Card 3: Studio Coordinates & Time */}
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-sky-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-sm sm:text-base text-white">
                {currentTime || 'IST (UTC+5:30)'}
              </div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                New Delhi / Mumbai • Global Remote
              </div>
            </div>
          </div>

          {/* Card 4: Quick Copy Email Pill */}
          <div 
            onClick={handleCopyEmail}
            className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 backdrop-blur-md flex items-center justify-between cursor-pointer group transition-all"
            title="Click to copy direct email"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                {copiedEmail ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className="truncate">
                <div className="font-mono font-semibold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                  {copiedEmail ? 'COPIED TO CLIPBOARD' : adminEmail}
                </div>
                <div className="font-mono text-[10px] text-cyan-400/80 uppercase tracking-wider">
                  {copiedEmail ? 'READY TO PASTE' : 'CLICK TO COPY EMAIL'}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Main Contact Section */}
      <ContactSection onOpenResume={onOpenResume} />
    </div>
  );
};

export default ContactPage;
