import React from 'react';
import { Aperture, Eye, Target, Compass, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
          <Aperture className="w-3.5 h-3.5" />
          <span>SCENE 02 // CREATIVE & STRATEGIC IDENTITY</span>
        </div>
        <h2 className="font-syne font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          ABOUT{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            RITIK
          </span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
          Filmmaker, Video Production Executive, and Social Media Manager bridging cinematic storytelling with data-backed organic growth.
        </p>
      </div>

      {/* Main Grid: Visual Frame & Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left: Cinematic Portrait & Frame (5 cols) */}
        <div className="lg:col-span-5 relative group">
          
          {/* Glowing Backlight */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          {/* Retro CRT Television Monitor Frame */}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-cyan-500/20 p-3 shadow-[0_0_50px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/40 transition-all duration-700">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-950 crt-tv-container">
              {/* Ritik Portrait (Optimized WebP with Fallback) */}
              <picture className="w-full h-full block">
                <source srcSet="/img/ritik-portrait.webp" type="image/webp" />
                <img
                  src="/img/ritik-portrait.png"
                  alt="Ritik Soni"
                  loading="lazy"
                  decoding="async"
                  width="960"
                  height="677"
                  className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 crt-tv-screen"
                />
              </picture>

              {/* 1. Retro CRT Curved Screen Vignette & Tube Depth */}
              <div className="crt-tv-vignette" aria-hidden="true" />

              {/* 2. Phosphor Raster Scanlines */}
              <div className="crt-tv-scanlines" aria-hidden="true" />

              {/* 3. Rolling Cathode Refresh Scanline Beam */}
              <div className="crt-tv-roll" aria-hidden="true" />

              {/* 4. Phosphor Glare / Curved Glass Reflection */}
              <div className="crt-tv-glare" aria-hidden="true" />

              {/* 5. Analog Retro TV OSD (On-Screen Display) Telemetry */}
              <div className="absolute top-3 left-3 flex items-center gap-2 font-mono text-[9px] tracking-widest pointer-events-none z-10">
                <span className="px-2 py-0.5 rounded bg-black/75 border border-cyan-500/30 text-cyan-300 font-semibold shadow-sm">
                  CH 04 // AV-1
                </span>
                <span className="flex items-center gap-1.5 text-red-400 bg-black/70 px-2 py-0.5 rounded border border-white/10 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
                </span>
              </div>
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 border border-white/10 text-zinc-400 font-mono text-[9px] tracking-widest pointer-events-none z-10 shadow-sm">
                NTSC • 60Hz
              </div>

              {/* Bottom Viewfinder / TV Badge */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-[10px] text-zinc-300 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 z-10 shadow-md">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  RITIK SONI
                </span>
                <span className="text-cyan-400 tracking-wider">DIRECTOR // SMM & POST LEAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Storytelling (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 font-syne text-lg sm:text-xl font-bold leading-relaxed">
            "Why choose between an editor who doesn't understand the algorithm and a social media manager who can't craft high-end video? I bridge both worlds."
          </div>

          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
            <p>
              My journey unites two disciplines that belong together: <strong>cinematic filmmaking</strong> and <strong>high-growth social media management</strong>. In an era where attention spans are measured in milliseconds, cutting beautiful footage is only half the battle—you must know how to engineer the hook, optimize for retention, and navigate platform distribution.
            </p>
            <p>
              As a <strong>Video Production Executive & Content Strategist</strong> at <strong>Vishwa Vinayak Group</strong> and a collaborator on brand campaigns involving names like <strong>Arentech, Reliance, and Red Bull</strong>, I manage the full content lifecycle: from market research, trend scouting, and editorial content calendars to multi-cam cinematic shoots, micro-pacing, and analytics optimization.
            </p>
            <p>
              Whether orchestrating a 30-day Instagram Reel growth campaign engineered to stop the scroll or directing a multi-minute corporate brand film, my mission is clear: <span className="text-white font-medium">turn casual scrollers into loyal communities and measurable brand momentum.</span>
            </p>
          </div>

          {/* Pillars of Craft Grid (4 Pillars) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">Visual Grammar</span>
              <span className="text-[11px] font-mono text-zinc-400">Cinematic Lighting & Tone</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">Pacing & Flow</span>
              <span className="text-[11px] font-mono text-zinc-400">Frame-Accurate Retention</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">Social Growth</span>
              <span className="text-[11px] font-mono text-zinc-400">Algorithms & Hook Design</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">End-to-End</span>
              <span className="text-[11px] font-mono text-zinc-400">Calendar to Conversion</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default AboutSection;
