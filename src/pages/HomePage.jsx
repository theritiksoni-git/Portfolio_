import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Sparkles, Film, Award, Send, FileText } from 'lucide-react';
import HeroSection from '../components/sections/HeroSection';
import { PROJECTS } from '../data/projects';
import sound from '../utils/SoundEngine';

const HomePage = ({ onSelectProject, onOpenResume }) => {
  const navigate = useNavigate();

  // Pick the top 3 standout featured projects for the home highlight
  const featuredProjects = PROJECTS.slice(0, 3);

  return (
    <div className="relative cinematic-page-enter">
      {/* 1. Hero Scene */}
      <HeroSection
        onExploreWork={() => {
          sound.playLensClick();
          navigate('/work');
        }}
        onExploreAbout={() => {
          sound.playLensClick();
          navigate('/about');
        }}
        onPlayReel={() => onSelectProject(PROJECTS[0])}
      />

      {/* 2. Curated Featured Master Cuts (3 Projects) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-20 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>CURATED SELECTION // SCENE HIGHLIGHTS</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-white pointer-events-none select-none">
              <span className="retro-tv-text pointer-events-auto inline cursor-default mr-3">FEATURED</span>
              <span className="retro-tv-cyan pointer-events-auto inline cursor-default">MASTER CUTS</span>
            </h2>
          </div>

          <button
            onClick={() => {
              sound.playLensClick();
              navigate('/work');
            }}
            onMouseEnter={() => sound.playHover()}
            className="group inline-flex items-center gap-2 text-xs font-mono tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors uppercase"
            data-cursor="ALL WORKS"
          >
            <span>VIEW COMPLETE VAULT ({PROJECTS.length} FILMS)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                sound.playGoldenHour();
                onSelectProject(project);
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="PLAY FILM"
              className="group relative rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 transition-all duration-500 cursor-pointer flex flex-col justify-between shadow-2xl hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]"
            >
              {/* Media Thumbnail with Aspect */}
              <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                <img
                  src={project.previewPoster}
                  alt={project.title}
                  className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                {/* Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-black/80 border border-white/10 text-cyan-300 font-mono text-[9px] tracking-wider uppercase backdrop-blur-md">
                    {project.badge || project.categoryLabel}
                  </span>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-zinc-300 font-mono text-[9px]">
                  {project.duration}
                </div>

                {/* Center Play Indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.8)] scale-95 sm:scale-90 sm:group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
                    {project.client} • {project.year}
                  </div>
                  <h3 className="font-syne font-bold text-lg text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                    {project.tagline || project.synopsis}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{project.aspectRatio}</span>
                  <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    EXPAND <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Works Action Pill Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              sound.playLensClick();
              navigate('/work');
            }}
            onMouseEnter={() => sound.playHover()}
            data-cursor="ALL FILMS"
            className="group px-8 py-3.5 rounded-full bg-zinc-900 border border-white/15 hover:border-cyan-400/60 text-white font-mono text-xs tracking-wider uppercase hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all duration-300 inline-flex items-center gap-3 backdrop-blur-md"
          >
            <Film className="w-4 h-4 text-cyan-400" />
            <span>EXPLORE FULL CINEMA REPERTOIRE</span>
            <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 3. Director Profile Briefing & Teaser */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16 border-t border-white/10">
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-black border border-white/10 p-8 sm:p-12 lg:p-14 relative overflow-hidden backdrop-blur-xl">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-white/10 text-cyan-400 font-mono text-[11px] tracking-widest uppercase">
                <Award className="w-3 h-3" />
                <span>DIRECTOR // SMM & POST LEAD</span>
              </div>
              <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-white tracking-tight leading-snug">
                BRIDGING HIGH-END CINEMATIC EMOTION WITH{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
                  FRAME-ACCURATE ALGORITHMIC RHYTHM.
                </span>
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                Unlike traditional directors who overlook social distribution or editors who miss big-picture storytelling, my workflow synthesizes the full arc: from raw pre-production vision through to viral editorial delivery.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
              <button
                onClick={() => {
                  sound.playLensClick();
                  navigate('/about');
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="ABOUT"
                className="group w-full px-6 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(56,189,248,0.4)]"
              >
                <span>MEET RITIK & PROCESS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  sound.playLensClick();
                  onOpenResume();
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="RESUME"
                className="group w-full px-6 py-3.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 hover:border-cyan-500/40 font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
              >
                <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>OFFICIAL RESUME & CREDITS</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Collaborate Callout Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-16">
        <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
              PRODUCTION INQUIRIES & COMMISSIONS
            </div>
            <h3 className="font-syne text-xl sm:text-2xl font-bold uppercase text-white">
              HAVE A PROJECT IN MIND? LET'S CREATE TOGETHER.
            </h3>
          </div>

          <button
            onClick={() => {
              sound.playLensClick();
              navigate('/contact');
            }}
            onMouseEnter={() => sound.playHover()}
            data-cursor="CONTACT"
            className="group px-7 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] transition-all duration-300 flex items-center gap-2 flex-shrink-0"
          >
            <span>LAUNCH CONTACT TERMINAL</span>
            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
