import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Aperture, 
  ArrowRight, 
  TrendingUp, 
  Film, 
  Clock, 
  Globe, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import AboutSection from '../components/sections/AboutSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import PhilosophySection from '../components/sections/PhilosophySection';
import sound from '../utils/SoundEngine';
import usePortfolioData from '../utils/usePortfolioData';

const AboutPage = () => {
  const navigate = useNavigate();
  const { settings, availability } = usePortfolioData();
  const name = settings?.name || 'Ritik Soni';
  const firstName = name.split(' ')[0].toUpperCase();

  const scrollToAnchor = (id) => {
    sound.playClick();
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header & Dossier Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Aperture className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 02 // CONTENT CREATOR & DIRECTOR DOSSIER • BIOGRAPHY & CAREER ARC</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
              ABOUT{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
                {firstName || 'ME'}
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-2xl font-light leading-relaxed">
              {settings?.bioSummary || `The intersection of content creation, cinematic production mastery, and audience psychology. Discover ${name}'s creator channels, production journey with premier brands, and directorial philosophy.`}
            </p>
          </div>

          {/* Quick Anchor Navigation Jump Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => scrollToAnchor('about')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>01 // BIO & CREATOR HUBS</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToAnchor('experience')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>02 // NLE TIMELINE</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToAnchor('philosophy')}
              className="px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 font-mono text-[10px] text-zinc-400 hover:text-cyan-300 uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>03 // PHILOSOPHY</span>
              <ChevronDown className="w-3 h-3 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Executive Impact Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10">
          
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-cyan-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-xl sm:text-2xl text-white">50M+</div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">Organic Impressions</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-amber-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-xl sm:text-2xl text-white">100+</div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">Commercial Cuts</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-blue-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-xl sm:text-2xl text-white">5+ Years</div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">Post-Production Craft</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex items-center gap-3.5 group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="font-syne font-extrabold text-base sm:text-lg text-white">Pune & Mumbai</div>
              <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">{availability?.status || 'Open for Global Retainers'}</div>
            </div>
          </div>

        </div>

      </div>

      {/* Part 1: Creative Identity, Retro TV & Interactive Story Modes */}
      <AboutSection />

      {/* Part 2: Production Experience & Interactive NLE Timeline Suite */}
      <div id="experience" className="border-t border-white/10">
        <ExperienceSection />
      </div>

      {/* Part 3: Artistic Philosophy Statement */}
      <div id="philosophy" className="border-t border-white/10">
        <PhilosophySection />
      </div>

      {/* Next Step: Dual Navigation Call-To-Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
          <div className="text-center md:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1 flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CONTINUE THE CINEMATIC JOURNEY</span>
            </div>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
              EXPLORE DIRECTED FILMS OR STORY PROCESS
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
              Inspect the commercial reel or dive into the 6-stage storytelling framework.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/work');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="WORK"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105"
            >
              <span>VIEW WORK (SCENE 03)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/process');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="PROCESS"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-mono text-xs tracking-wider uppercase transition-all duration-300"
            >
              <span>STORY PROCESS (SCENE 04)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
