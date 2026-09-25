import React from 'react';
import { Play, ArrowDown, ChevronRight, Sparkles, Clapperboard, Scissors, TrendingUp } from 'lucide-react';
import sound from '../../utils/SoundEngine';
import usePortfolioData from '../../utils/usePortfolioData';

const CLIENTS = [
  { name: 'Red Bull', logo: '/img/client-logos/redbull.png', width: 'w-24 sm:w-28', height: 'h-6 sm:h-7' },
  { name: 'Reliance Industries', logo: '/img/client-logos/reliance-industries-limited.png', width: 'w-28 sm:w-32', height: 'h-6 sm:h-7' },
  { name: 'AdenTech', logo: '/img/client-logos/adentech.png', width: 'w-32 sm:w-44', height: 'h-10 sm:h-12', extra: 'scale-125' },
  { name: 'Vishwa Vinayak Group', logo: '/img/client-logos/vishwa-vinayak-group.png', width: 'w-28 sm:w-32', height: 'h-6 sm:h-7' },
];

const HeroSection = ({ onExploreWork, onExploreAbout, onPlayReel }) => {
  const { clients: liveClients, overview } = usePortfolioData();

  const clientList = liveClients && liveClients.length > 0
    ? liveClients.map((c) => ({
        name: c.name,
        logo: c.logoUrl || c.logo || '/img/client-logos/adentech.png',
        width: 'w-28 sm:w-32',
        height: 'h-6 sm:h-7',
      }))
    : CLIENTS;

  const metrics = [
    { label: 'MASTER CUTS', val: overview?.masterCutsCount || '100+' },
    { label: 'ORGANIC REACH', val: overview?.monthlyImpressions || '50M+' },
    { label: 'SMM STRATEGY', val: 'FULL-FUNNEL' },
    { label: 'POST LEAD', val: 'PREMIERE & AE' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-between px-4 sm:px-6 lg:px-12 pt-28 pb-10 overflow-hidden select-none"
    >
      {/* Background Soft Atmospheric Radiance */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Grid Container: The Cinema Portal & Editorial Split */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column (Col Span 7): Identity, Narrative & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          
          {/* Production Slate Header Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-950/85 border border-white/10 text-zinc-300 font-mono text-[11px] sm:text-xs tracking-widest uppercase mb-4 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-zinc-500 font-bold">PRODUCTION SLATE //</span>
            <span className="text-cyan-300">SCENE 01 • 24 FPS • 4K DCI</span>
          </div>

          {/* Hero Name Typography with Retro CRT Television Effect Strictly on Text */}
          <h1 className="font-syne font-extrabold text-4xl sm:text-6xl md:text-8xl xl:text-9xl tracking-tight uppercase leading-[0.95] w-fit max-w-full pointer-events-none select-none">
            <span className="hero-name-tv pointer-events-auto inline cursor-default">
              RITIK SONI
            </span>
          </h1>

          {/* Craft Disciplines Line (Clean, Box-Free, Refined & Light) */}
          <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 font-mono text-xs sm:text-[13px] tracking-wider text-zinc-300 select-none cursor-default">
            
            {/* Discipline 1: Content Creator */}
            <div className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 opacity-90" />
              <span className="font-medium tracking-widest uppercase">CONTENT CREATOR</span>
            </div>

            <span className="text-zinc-600 font-mono text-xs select-none">{"//"}</span>

            {/* Discipline 2: Director */}
            <div className="inline-flex items-center gap-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-sky-400 shrink-0 opacity-90" />
              <span className="font-medium tracking-widest uppercase">DIRECTOR</span>
            </div>

            <span className="text-zinc-600 font-mono text-xs select-none">{"//"}</span>

            {/* Discipline 3: Video Editor */}
            <div className="inline-flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-cyan-400 shrink-0 opacity-90" />
              <span className="font-medium tracking-widest uppercase">VIDEO EDITOR</span>
            </div>

            <span className="text-zinc-600 font-mono text-xs select-none">{"//"}</span>

            {/* Discipline 4: Social Media Manager */}
            <div className="inline-flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0 opacity-90" />
              <span className="font-medium tracking-widest uppercase">SOCIAL MEDIA MANAGER</span>
            </div>

          </div>

          {/* Narrative Subtitle */}
          <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg text-zinc-300 font-light leading-relaxed">
            Content Creator & Filmmaker directing high-impact commercial films, creator-led digital narratives, and full-funnel social media campaigns that bridge cinematic emotion with audience hook retention.
          </p>

          {/* Primary Action Group */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            
            {/* Action 1: About Me */}
            <button
              onClick={(e) => {
                sound.playLensClick(e.clientX);
                onExploreAbout();
              }}
              onMouseEnter={(e) => sound.playHover(e.clientX)}
              data-cursor="ABOUT"
              className="group h-12 px-7 rounded-full bg-zinc-950/90 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border border-white/20 hover:border-cyan-400 hover:text-cyan-300 hover:bg-zinc-900/90 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:scale-102 active:scale-[0.98] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2 backdrop-blur-md w-full sm:w-auto cursor-pointer"
            >
              <span>ABOUT ME</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>

            {/* Action 2: Explore Selected Work */}
            <button
              onClick={(e) => {
                sound.playLensClick(e.clientX);
                onExploreWork();
              }}
              onMouseEnter={(e) => sound.playHover(e.clientX)}
              data-cursor="EXPLORE"
              className="group relative h-12 px-7 rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 text-black font-mono font-bold text-xs sm:text-sm tracking-wider uppercase border border-transparent shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:scale-102 active:scale-[0.98] transition-all duration-300 focus:outline-none flex items-center justify-center gap-2.5 w-full sm:w-auto cursor-pointer overflow-hidden"
            >
              <span>EXPLORE SELECTED WORK</span>
              <ChevronRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Quick Credibility Metrics (Clean, Box-Free, Single Line Telemetry) */}
          <div className="mt-8 flex items-center flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar gap-x-2 sm:gap-x-2.5 pt-6 border-t border-white/10 font-mono text-[9px] sm:text-[10px] w-full select-none cursor-default">
            {metrics.map((m, idx) => (
              <React.Fragment key={idx}>
                <div className="inline-flex items-center gap-1.5 shrink-0">
                  <span className="text-cyan-400 font-medium">{m.val}</span>
                  <span className="text-zinc-400 font-normal uppercase">{m.label}</span>
                </div>
                {idx < metrics.length - 1 && (
                  <span className="text-zinc-700 text-[9px] shrink-0 select-none">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* Right Column (Col Span 5): The Interactive Showreel Cinema Portal */}
        <div className="lg:col-span-5 relative group w-full max-w-lg mx-auto lg:max-w-none">
          
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-cyan-500/10 rounded-3xl blur-2xl opacity-40 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none" />

          {/* Cinema Portal Interactive Card */}
          <div
            onClick={(e) => {
              sound.playGoldenHour(e.clientX);
              onPlayReel();
            }}
            onMouseEnter={(e) => sound.playHover(e.clientX)}
            data-cursor="WATCH REEL"
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-zinc-950 border border-white/15 p-2.5 sm:p-3 shadow-2xl transition-all duration-500 group-hover:border-cyan-500/40 group-hover:scale-[1.01] cursor-pointer"
          >
            {/* 16:9 Aspect Video Preview */}
            <div className="relative aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-900">
              <img
                src="/img/projects/adentech-lineup-master.jpg"
                alt="Ritik Soni Cinema Showreel"
                className="w-full h-full object-cover filter contrast-110 brightness-90 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/40" />

              {/* Top Viewfinder Indicators */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-black/80 border border-white/10 text-cyan-300 font-mono text-[9px] tracking-widest uppercase backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>4K MASTER</span>
                </span>
                <span className="px-2 py-1 rounded bg-black/60 border border-white/10 text-zinc-400 font-mono text-[9px]">
                  2.39:1
                </span>
              </div>

              <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/80 border border-white/10 text-amber-300 font-mono text-[9px] tracking-wider">
                01:45
              </div>

              {/* Center Radiant Play Orb */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/85 border border-cyan-400/70 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-300">
                  <Play className="w-6 h-6 text-cyan-400 group-hover:text-black fill-current ml-0.5 transition-colors duration-300" />
                </div>
              </div>

              {/* Bottom Card Title Overlay */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-zinc-300 bg-black/75 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-zinc-200 font-semibold">2024 SHOWREEL // DIRECTOR'S CUT</span>
                </div>
                <span className="text-[9px] text-cyan-400 tracking-wider uppercase font-semibold">PLAY</span>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="pt-2.5 px-2 pb-0.5 flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>COMMERCIAL & SMM DIRECTION</span>
              <span className="text-cyan-400 text-[11px] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                EXPAND THEATER <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Base Dock: Client Marquee & Discover Cue */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center mt-6">
        
        {/* Client Collaborations Marquee Ribbon */}
        <div className="w-full flex flex-col items-center">
          <div className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase mb-3 flex items-center gap-2">
            <span className="w-8 h-[1px] bg-zinc-800" />
            <span>SELECTED CLIENT COLLABORATIONS</span>
            <span className="w-8 h-[1px] bg-zinc-800" />
          </div>

          <div className="w-full overflow-hidden relative marquee-mask py-1">
            <div className="animate-marquee-infinite flex items-center gap-12 sm:gap-16">
              {[...clientList, ...clientList, ...clientList].map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center opacity-70 filter grayscale brightness-0 invert cursor-default select-none pointer-events-none"
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className={`${client.height || 'h-6 sm:h-7'} ${client.width} ${client.extra || ''} object-contain`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Down / Discover Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onExploreWork();
          }}
          onMouseEnter={() => sound.playHover()}
          className="group mt-4 flex items-center gap-2 sm:gap-2.5 text-zinc-400 hover:text-cyan-300 transition-colors focus:outline-none cursor-pointer"
          data-cursor="DISCOVER"
        >
          <span className="text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase font-medium">DISCOVER PORTFOLIO</span>
          <ArrowDown className="w-4 h-4 text-cyan-400/80 group-hover:translate-y-1 transition-transform duration-300" />
        </button>

      </div>
    </section>
  );
};

export default HeroSection;
