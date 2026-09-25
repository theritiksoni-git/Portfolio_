import React from 'react';
import { Aperture, Eye, Target, Compass, TrendingUp, Briefcase, Sparkles, ExternalLink, Mail } from 'lucide-react';
import usePortfolioData from '../../utils/usePortfolioData';
import sound from '../../utils/SoundEngine';

// Branded SVGs for Social Platforms
const YouTubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
  </svg>
);

const XTwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const AboutSection = () => {
  const { experience, settings, clients, socialLinks } = usePortfolioData();

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

  // Dynamic social links fallback / overrides from admin store
  const ytItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('youtube'));
  const igItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('instagram'));
  const liItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('linkedin'));
  const xItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('x') || s.platform?.toLowerCase().includes('twitter'));

  // Verified Creator Channels & Social Links
  const creatorSocials = [
    {
      id: 'soc-yt',
      name: 'YouTube',
      handle: ytItem?.handle || '@theritiksoni',
      url: ytItem?.url || 'https://youtube.com/@theritiksoni',
      tag: 'Essays & Shorts',
      icon: YouTubeIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-950/40',
      borderColor: 'hover:border-red-500/50',
      shadowColor: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.25)]',
    },
    {
      id: 'soc-ig',
      name: 'Instagram',
      handle: igItem?.handle || '@theritiksoni',
      url: igItem?.url || 'https://instagram.com/theritiksoni',
      tag: 'Reels & Personal Brand',
      icon: InstagramIcon,
      color: 'text-pink-400',
      bgColor: 'bg-pink-950/40',
      borderColor: 'hover:border-pink-500/50',
      shadowColor: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.25)]',
    },
    {
      id: 'soc-li',
      name: 'LinkedIn',
      handle: liItem?.handle || 'in/theritiksoni',
      url: liItem?.url || 'https://linkedin.com/in/theritiksoni',
      tag: 'Executive Network',
      icon: LinkedInIcon,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40',
      borderColor: 'hover:border-sky-500/50',
      shadowColor: 'hover:shadow-[0_0_20px_rgba(14,165,233,0.25)]',
    },
    {
      id: 'soc-x',
      name: 'X (Twitter)',
      handle: xItem?.handle || '@theritiksoni',
      url: xItem?.url || 'https://x.com/theritiksoni',
      tag: 'Thoughts & Trends',
      icon: XTwitterIcon,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-900/60',
      borderColor: 'hover:border-cyan-500/40',
      shadowColor: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    },
    {
      id: 'soc-email',
      name: 'Direct Transmit',
      handle: settings?.adminEmail || 'theritiksoni@gmail.com',
      url: `mailto:${settings?.adminEmail || 'theritiksoni@gmail.com'}`,
      tag: 'Collabs & Retainers',
      icon: Mail,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-950/40',
      borderColor: 'hover:border-cyan-500/50',
      shadowColor: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    },
  ];

  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
          <Aperture className="w-3.5 h-3.5" />
          <span>SCENE 02 // CREATIVE IDENTITY & CONTENT CREATOR</span>
        </div>
        <h2 className="font-syne font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
          ABOUT{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            {firstName}
          </span>
        </h2>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl">
          {settings?.tagline || `Content Creator, Director & Video Editor bridging cinematic storytelling with data-backed organic growth.`}
        </p>
      </div>

      {/* Main Grid: Visual Frame & Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
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
                  alt={`${authorName} - Content Creator, Film Director & Video Editor`}
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
                <span className="text-cyan-400 tracking-wider truncate max-w-[200px] text-right font-semibold">
                  CONTENT CREATOR // DIRECTOR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Narrative Storytelling (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-cyan-200 font-syne text-lg sm:text-xl font-bold leading-relaxed">
            "As an active Content Creator, Film Director, and Video Editor, I don't just edit footage—I engineer attention. From the first 3-second hook to the final conversion, I merge cinematic depth with viral social psychology."
          </div>

          <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
            <p>
              I am a <strong className="text-white font-medium">Content Creator</strong> and <strong className="text-white font-medium">Filmmaker</strong> who understands both sides of the screen. In today’s high-velocity digital economy, breathtaking visuals mean nothing if viewers scroll past in two seconds. Having built and scaled personal brand channels (<a href="https://instagram.com/theritiksoni" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-mono">@theritiksoni</a>) with multi-million impression short-form content in psychology, self-improvement, and cinematic storytelling, I know firsthand how to capture and retain modern audience attention.
            </p>
            <p>
              Alongside my creator channels, I serve as <strong className="text-white font-medium">{currentRole}</strong> at{' '}
              <strong className="text-cyan-300 font-medium">{currentCompany}</strong>
              {brandHighlights ? (
                <> and have collaborated on creative campaigns involving names like <strong className="text-white font-medium">{brandHighlights}</strong>,</>
              ) : (
                <>,</>
              )}{' '}
              managing the entire production arc: from market research, trend scouting, and editorial content calendars to multi-cam cinema shoots, micro-pacing, sound design, and algorithm optimization.
            </p>

            {currentMission && (
              <p className="border-l-2 border-cyan-500/50 pl-3 py-1 italic text-cyan-200/90 text-xs sm:text-sm bg-cyan-950/20 rounded-r-lg">
                "{currentMission}"
              </p>
            )}

            <p>
              Whether orchestrating a 30-day Instagram Reel growth sprint engineered to stop the scroll, directing a corporate brand film, or producing creator-first YouTube video essays, my mission is clear: <span className="text-white font-medium">turn casual scrollers into loyal communities and measurable brand momentum.</span>
            </p>
          </div>

          {/* Creator Channels & Social Links Dock */}
          <div className="pt-2 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>CREATOR CHANNELS & SOCIAL HUBS</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                CONNECT DIRECTLY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {creatorSocials.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    data-cursor="VIEW"
                    className={`group relative p-3 rounded-2xl bg-zinc-950/80 border border-white/10 ${item.borderColor} transition-all duration-300 flex items-center justify-between gap-3 ${item.shadowColor}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${item.bgColor} border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shrink-0`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-syne font-bold text-xs text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                          <span>{item.name}</span>
                        </div>
                        <div className="font-mono text-[11px] text-zinc-400 truncate">
                          {item.handle}
                        </div>
                        <div className="text-[9px] font-mono text-zinc-500">
                          {item.tag}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Dynamic Production Timeline / Active Milestones Arc */}
          {experience && experience.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  ACTIVE PRODUCTION ARC ({experience.length} MILESTONES)
                </span>
                <span className="text-zinc-500 font-mono text-[9px]">LIVE SYNC</span>
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
              <span className="font-syne font-bold text-xs text-white">Pacing & Retention</span>
              <span className="text-[11px] font-mono text-zinc-400">Frame-Accurate Cuts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">Creator Psychology</span>
              <span className="text-[11px] font-mono text-zinc-400">Viral Hooks & Algorithmic Lift</span>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/5 flex flex-col gap-1">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-xs text-white">Full-Funnel</span>
              <span className="text-[11px] font-mono text-zinc-400">Idea to Conversion</span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};

export default AboutSection;

