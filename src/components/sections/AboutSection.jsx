import React from 'react';
import { Aperture, Eye, Target, Compass, TrendingUp, Briefcase } from 'lucide-react';
import usePortfolioData from '../../utils/usePortfolioData';

const AboutSection = () => {
  const { experience, settings, clients } = usePortfolioData();

  // Dynamic Current Role & Organization derived from Admin Store
  const currentExp = experience && experience.length > 0 ? experience[0] : null;
  const currentRole = currentExp?.role || 'Video Production Executive & Content Strategist';
  const currentCompany = currentExp?.company || 'Vishwa Vinayak Group';
  const currentMission = currentExp?.coreMission || currentExp?.summary || '';

  // Dynamic Collaborator Brands derived from other experience items & client portfolio
  const otherExperienceCompanies = (experience || [])
    .slice(1)
    .map((e) => e.company)
    .filter(Boolean);
  const clientNames = (clients || []).map((c) => c.name).filter(Boolean);
  const brandList = Array.from(new Set([...otherExperienceCompanies, ...clientNames]))
    .filter((name) => name !== currentCompany);
  const brandHighlights = brandList.length > 0
    ? brandList.slice(0, 3).join(', ')
    : 'Arentech, Reliance, and Red Bull';

  const authorName = settings?.name || 'RITIK SONI';
  const firstName = authorName.split(' ')[0].toUpperCase();

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
            {firstName}
          </span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
          {settings?.tagline || `${currentRole} bridging cinematic storytelling with data-backed organic growth.`}
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
                  alt={authorName}
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
                  {authorName.toUpperCase()}
                </span>
                <span className="text-cyan-400 tracking-wider truncate max-w-[190px] text-right font-semibold">
                  {currentRole.toUpperCase()}
                </span>
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
              As a <strong className="text-white font-medium">{currentRole}</strong> at{' '}
              <strong className="text-cyan-300 font-medium">{currentCompany}</strong>
              {brandHighlights ? (
                <> and a collaborator on brand campaigns involving names like <strong className="text-white font-medium">{brandHighlights}</strong>,</>
              ) : (
                <>,</>
              )}{' '}
              I manage the full content lifecycle: from market research, trend scouting, and editorial content calendars to multi-cam cinematic shoots, micro-pacing, and analytics optimization.
            </p>

            {currentMission && (
              <p className="border-l-2 border-cyan-500/50 pl-3 py-1 italic text-cyan-200/90 text-xs sm:text-sm bg-cyan-950/20 rounded-r-lg">
                "{currentMission}"
              </p>
            )}

            <p>
              Whether orchestrating a 30-day Instagram Reel growth campaign engineered to stop the scroll or directing a multi-minute corporate brand film, my mission is clear: <span className="text-white font-medium">turn casual scrollers into loyal communities and measurable brand momentum.</span>
            </p>
          </div>

          {/* Dynamic Production Timeline / Active Milestones Arc */}
          {experience && experience.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  ACTIVE PRODUCTION ARC ({experience.length} MILESTONES)
                </span>
                <span className="text-zinc-500">LIVE SYNC</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 transition-colors text-xs group"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: exp.accentColor || '#06b6d4' }}
                    />
                    <span className="text-white font-medium group-hover:text-cyan-300 transition-colors">
                      {exp.role}
                    </span>
                    <span className="text-zinc-400 font-mono text-[10px]">
                      @{exp.company}
                    </span>
                    <span className="text-[9px] font-mono text-cyan-400/90 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      {exp.timelinePosition || exp.period || exp.durationLabel || 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pillars of Craft Grid (4 Pillars) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
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
