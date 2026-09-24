import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Aperture, ArrowRight } from 'lucide-react';
import AboutSection from '../components/sections/AboutSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import PhilosophySection from '../components/sections/PhilosophySection';
import sound from '../utils/SoundEngine';
import usePortfolioData from '../utils/usePortfolioData';

const AboutPage = () => {
  const navigate = useNavigate();
  const { settings } = usePortfolioData();
  const name = settings?.name || 'Ritik Soni';
  const firstName = name.split(' ')[0].toUpperCase();

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
          <Aperture className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 02 // DIRECTOR DOSSIER • BIOGRAPHY & CAREER ARC</span>
        </div>
        <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
          ABOUT{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            {firstName || 'ME'}
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
          {settings?.bioSummary || `The intersection of cinematic production mastery and audience psychology. Discover ${name}'s background, production journey with premier brands, and directorial philosophy.`}
        </p>
      </div>

      {/* Part 1: Creative Identity & Retro TV Portrait */}
      <AboutSection />

      {/* Part 2: Production Experience & NLE Timeline */}
      <div className="border-t border-white/10">
        <ExperienceSection />
      </div>

      {/* Part 3: Artistic Philosophy Statement */}
      <div className="border-t border-white/10">
        <PhilosophySection />
      </div>

      {/* Next Step: Dual Navigation Cue */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-12 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              CONTINUE THE CINEMATIC JOURNEY
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
