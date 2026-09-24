import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, ArrowRight, Lightbulb } from 'lucide-react';
import WorkSection from '../components/sections/WorkSection';
import sound from '../utils/SoundEngine';
import usePortfolioData from '../utils/usePortfolioData';

const WorkPage = ({ onSelectProject, onOpenTheaterArchive }) => {
  const navigate = useNavigate();
  const { clients } = usePortfolioData();
  const clientNames = (clients || []).map((c) => c.name).filter(Boolean);
  const featuredClients = clientNames.length > 0
    ? clientNames.slice(0, 4).join(', ')
    : 'Arentech, Reliance, Red Bull, and Vishwa Vinayak Group';

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
          <Film className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 03 // PRODUCTION REPERTOIRE • DIRECTED & EDITED</span>
        </div>
        <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
          CINEMATIC{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            PORTFOLIO
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
          Explore full-funnel commercial films, high-energy event recaps, viral retention edits, and narrative visual pieces crafted for industry leaders including {featuredClients}.
        </p>
      </div>

      {/* Main Work Gallery Section */}
      <WorkSection
        showAll={true}
        onSelectProject={onSelectProject}
        onOpenTheaterArchive={onOpenTheaterArchive}
      />

      {/* Next Step: Cue to Story Architecture (Scene 04: The Process) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1 flex items-center justify-center md:justify-start gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEXT SCENE // 04 • STORY ARCHITECTURE</span>
            </div>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
              HOW I SEE A STORY • THE 6-STAGE PROCESS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1 max-w-xl">
              Go behind the cuts and inspect the disciplined storytelling methodology: from hook psychology and scripting to final theatrical master delivery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/process');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="PROCESS"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105"
            >
              <span>EXPLORE THE PROCESS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/contact');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="CONTACT"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-mono text-xs tracking-wider uppercase transition-all duration-300"
            >
              <span>COMMISSION A PROJECT</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkPage;
