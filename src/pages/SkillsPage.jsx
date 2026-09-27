import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Film, ArrowRight } from 'lucide-react';
import SkillsSection from '../components/sections/SkillsSection';
import sound from '../utils/SoundEngine';

const SkillsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 sm:pt-28 pb-16 cinematic-page-enter">
      {/* Main Skills Console Section with Unified Header */}
      <SkillsSection isStandalonePage={true} />

      {/* Next Step: Cue to Work Repertoire or Contact Terminal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-10 backdrop-blur-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              NEXT SCENE // 06
            </div>
            <h2 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
              READY TO ELEVATE YOUR VIDEO PRODUCTION?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1 max-w-xl">
              Commission an executive video production, corporate brand film, or high-retention viral growth campaign.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/work');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="WORK"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/15 hover:border-cyan-500/40 font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              <Film className="w-4 h-4 text-cyan-400" />
              <span>EXPLORE DIRECTED CUTS</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/contact');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="CONTACT"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105"
            >
              <span>LAUNCH CONTACT TERMINAL</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;

