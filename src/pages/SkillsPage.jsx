import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Send } from 'lucide-react';
import SkillsSection from '../components/sections/SkillsSection';
import sound from '../utils/SoundEngine';

const SkillsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 05 // PRODUCTION TOOLKIT • HARDWARE & EDITING CONSOLE</span>
        </div>
        <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
          TECH{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            SKILLS
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
          Frame-accurate mastery across industry-standard non-linear editors, motion graphics workflows, audio sweetening engines, and high-performance color grading consoles.
        </p>
      </div>

      {/* Main Skills Console Section */}
      <SkillsSection />

      {/* Next Step: Cue to Contact Terminal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-12 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              NEXT SCENE // 06
            </div>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
              READY TO LAUNCH A PROJECT?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
              Transmit your production brief directly to Ritik's terminal.
            </p>
          </div>
          <button
            onClick={() => {
              sound.playLensClick();
              navigate('/contact');
            }}
            onMouseEnter={() => sound.playHover()}
            data-cursor="CONTACT"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105 flex-shrink-0"
          >
            <span>LAUNCH CONTACT TERMINAL</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
