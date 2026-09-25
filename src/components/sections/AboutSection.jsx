import React, { useState } from 'react';
import { 
  Aperture, 
  Eye, 
  Target, 
  Compass, 
  TrendingUp, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Film, 
  Award, 
  Clock,
  Video,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { experience, settings, clients, socialLinks } = usePortfolioData();
  const [readingMode, setReadingMode] = useState('creator'); // 'creator' | 'directing' | 'executive'
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamic Current Role & Organization derived from Admin Store
  const currentExp = experience && experience.length > 0 ? experience[0] : null;
  const currentRole = currentExp?.role || 'Video Production Executive & SMM Lead';
  const currentCompany = currentExp?.company || 'Vishwa Vinayak Group';
  const currentMission = currentExp?.coreMission || currentExp?.summary || '';

  // Dynamic Collaborator Brands
  const otherExperienceCompanies = (experience || [])
    .slice(1)
    .map((e) => e.company)
    .filter(Boolean);
  const clientNames = (clients || []).map((c) => c.name).filter(Boolean);
  const brandList = Array.from(new Set([...otherExperienceCompanies, ...clientNames]))
    .filter((name) => name !== currentCompany);
  const brandHighlights = brandList.length > 0
    ? brandList.slice(0, 4).join(', ')
    : 'Adentech, Reliance Industries, Zaggle, and Red Bull';

  const authorName = settings?.name || 'RITIK SONI';
  const firstName = authorName.split(' ')[0].toUpperCase();
  const adminEmail = settings?.adminEmail || 'theritiksoni@gmail.com';

  // Dynamic social links overrides from admin store
  const ytItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('youtube'));
  const igItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('instagram'));
  const liItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('linkedin'));
  const xItem = socialLinks?.find((s) => s.platform?.toLowerCase().includes('x') || s.platform?.toLowerCase().includes('twitter'));

  const handleCopyEmail = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(adminEmail);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  // Creator Channels & Verified Profiles
  const creatorSocials = [
    {
      id: 'soc-yt',
      name: 'YouTube',
      handle: ytItem?.handle || '@theritiksoni',
      url: ytItem?.url || 'https://youtube.com/@theritiksoni',
      tag: 'Video Essays & Shorts',
      metric: 'Flagship Channel',
      icon: YouTubeIcon,
      color: 'text-red-400',
      bgColor: 'bg-red-950/40',
      borderColor: 'hover:border-red-500/50',
      shadowColor: 'hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
    },
    {
      id: 'soc-ig',
      name: 'Instagram',
      handle: igItem?.handle || '@theritiksoni',
      url: igItem?.url || 'https://instagram.com/theritiksoni',
      tag: 'Reels & Personal Brand',
      metric: '50M+ Reach',
      icon: InstagramIcon,
      color: 'text-pink-400',
      bgColor: 'bg-pink-950/40',
      borderColor: 'hover:border-pink-500/50',
      shadowColor: 'hover:shadow-[0_0_25px_rgba(236,72,153,0.2)]',
    },
    {
      id: 'soc-li',
      name: 'LinkedIn',
      handle: liItem?.handle || 'in/theritiksoni',
      url: liItem?.url || 'https://linkedin.com/in/theritiksoni',
      tag: 'Brand Network',
      metric: 'Industry Collabs',
      icon: LinkedInIcon,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/40',
      borderColor: 'hover:border-sky-500/50',
      shadowColor: 'hover:shadow-[0_0_25px_rgba(14,165,233,0.2)]',
    },
    {
      id: 'soc-x',
      name: 'X (Twitter)',
      handle: xItem?.handle || '@theritiksoni',
      url: xItem?.url || 'https://x.com/theritiksoni',
      tag: 'Editorial Insights',
      metric: 'Trends & Pacing',
      icon: XTwitterIcon,
      color: 'text-zinc-300',
      bgColor: 'bg-zinc-900/60',
      borderColor: 'hover:border-cyan-500/40',
      shadowColor: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]',
    },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 sm:space-y-20">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────────────────────────
          TIER 1: SECTION HEADER
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-3">
            <Aperture className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCENE 02 // CREATIVE IDENTITY & CONTENT CREATOR</span>
          </div>
          <h2 className="font-syne font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
            ABOUT{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              {firstName}
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl font-light">
            {settings?.tagline || `Content Creator, Director & Video Editor bridging cinematic storytelling with data-backed organic growth.`}
          </p>
        </div>

        {/* Quick Email Pill */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleCopyEmail}
            className="px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-2 transition-all shadow-md active:scale-95"
            title="Click to copy direct email"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedEmail ? 'EMAIL COPIED' : adminEmail}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TIER 2: BALANCED IDENTITY & NARRATIVE (5 / 7 COLUMNS)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch relative z-10">
        
        {/* Left: Retro CRT TV Portrait + Integrated 4-Item HUD Telemetry (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Retro CRT Television Frame */}
          <div className="relative group rounded-3xl overflow-hidden bg-zinc-950 border border-cyan-500/25 p-3 shadow-[0_0_50px_rgba(6,182,212,0.15)] group-hover:border-cyan-500/40 transition-all duration-700">
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

              {/* CRT Simulation Effects */}
              <div className="crt-tv-vignette" aria-hidden="true" />
              <div className="crt-tv-scanlines" aria-hidden="true" />
              <div className="crt-tv-roll" aria-hidden="true" />
              <div className="crt-tv-glare" aria-hidden="true" />

              {/* Top Retro TV OSD (On-Screen Display) */}
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

              {/* Bottom TV Telemetry Badge */}
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

          {/* Integrated 4-Stat Telemetry Matrix under TV */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                TOTAL VIEWS
              </span>
              <div className="mt-1 font-syne font-extrabold text-2xl text-white">50M+</div>
              <span className="text-[10px] font-mono text-zinc-500">Cumulative impressions</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Film className="w-3 h-3 text-amber-400" />
                COMMERCIALS
              </span>
              <div className="mt-1 font-syne font-extrabold text-2xl text-white">100+</div>
              <span className="text-[10px] font-mono text-zinc-500">Delivered master cuts</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-400" />
                EXPERIENCE
              </span>
              <div className="mt-1 font-syne font-extrabold text-2xl text-white">5+ Yrs</div>
              <span className="text-[10px] font-mono text-zinc-500">Post-production craft</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-md flex flex-col justify-between">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                <Video className="w-3 h-3 text-emerald-400" />
                FORMATS
              </span>
              <div className="mt-1 font-syne font-extrabold text-2xl text-white">9:16 & 16:9</div>
              <span className="text-[10px] font-mono text-zinc-500">Dual-format mastery</span>
            </div>
          </div>
        </div>

        {/* Right: Narrative Storytelling & Interactive Perspectives (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Interactive Reading Mode Switcher */}
          <div className="p-1.5 rounded-2xl bg-zinc-950/90 border border-white/10 shadow-sm">
            <div className="flex items-center gap-1 w-full">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setReadingMode('creator');
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  readingMode === 'creator'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Creator & Attention</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setReadingMode('directing');
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  readingMode === 'directing'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Director & Craft</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setReadingMode('executive');
                }}
                className={`flex-1 py-2 px-3 rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  readingMode === 'executive'
                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>Executive Dossier</span>
              </button>
            </div>
          </div>

          {/* Mode 1: Creator & Attention */}
          {readingMode === 'creator' && (
            <div className="space-y-4 animate-fadeIn flex-1">
              <div className="p-5 rounded-2xl bg-cyan-950/25 border border-cyan-500/30 text-cyan-200 font-syne text-lg sm:text-xl font-bold leading-relaxed">
                "In today’s hyper-fast digital feed, viewers decide in 1.8 seconds whether to stay or scroll. I engineer retention from the very first frame."
              </div>

              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  As an active <strong className="text-white font-medium">Content Creator</strong> with over <strong className="text-cyan-300 font-medium">50M+ cumulative digital impressions</strong> across my personal channels (<a href="https://instagram.com/theritiksoni" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline font-mono font-medium">@theritiksoni</a>), I understand what works because I test it live on real audiences every single week.
                </p>
                <p>
                  I specialize in behavioral psychology, retention curve pacing, kinetic typography, and audio disruption. By analyzing algorithmic shifts across Instagram Reels, YouTube Shorts, and long-form video essays, I translate complex brand concepts into viral, high-retention formats that stop the thumb and convert viewers into devoted advocates.
                </p>
                <p>
                  Whether scaling a brand's short-form presence from zero or directing multi-platform social campaigns, my approach is rooted in measurable impact, emotional truth, and relentless creative agility.
                </p>
              </div>
            </div>
          )}

          {/* Mode 2: Director & Craft */}
          {readingMode === 'directing' && (
            <div className="space-y-4 animate-fadeIn flex-1">
              <div className="p-5 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-amber-200 font-syne text-lg sm:text-xl font-bold leading-relaxed">
                "Every cut is an emotional choice. From camera blocking to ACES color conformity and sound design, every detail serves the story."
              </div>

              <div className="space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed font-light">
                <p>
                  Directing and lead editorial require a holistic command of the entire production arc. Currently leading post-production as <strong className="text-white font-medium">{currentRole}</strong> at <strong className="text-amber-300 font-medium">{currentCompany}</strong>, I bridge the divide between visionary creative concepts and disciplined execution.
                </p>
                <p>
                  My commercial work spans over 100+ delivered brand campaigns, collaborating with premier names including <strong className="text-white font-medium">{brandHighlights}</strong>. From multi-camera anamorphic shoots to node-based DaVinci Resolve color grading and immersive multi-layer soundscapes, I ensure broadcast conformity that looks breathtaking on IMAX and mobile screens alike.
                </p>
                {currentMission && (
                  <p className="border-l-2 border-amber-500/50 pl-3 py-1 italic text-amber-200/90 text-xs sm:text-sm bg-amber-950/20 rounded-r-lg">
                    "{currentMission}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Executive Dossier */}
          {readingMode === 'executive' && (
            <div className="space-y-4 animate-fadeIn flex-1">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-white/10 text-white font-syne text-lg sm:text-xl font-bold leading-relaxed">
                Executive Dossier // Ritik Soni — Creative Director, Content Creator & Lead Video Editor
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
                  <div className="text-zinc-500 uppercase tracking-widest text-[9px]">CURRENT POST</div>
                  <div className="text-white font-bold text-sm">{currentRole}</div>
                  <div className="text-cyan-400">@{currentCompany}</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
                  <div className="text-zinc-500 uppercase tracking-widest text-[9px]">LOCATIONS & AVAILABILITY</div>
                  <div className="text-white font-bold text-sm">Pune & Mumbai, India</div>
                  <div className="text-emerald-400">Open for Global Remote & Retainers</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
                  <div className="text-zinc-500 uppercase tracking-widest text-[9px]">CORE CAPABILITIES</div>
                  <div className="text-zinc-300">Commercial Direction, 9:16 Viral Reels, DaVinci Resolve Color, Audio Design</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/80 border border-white/5 space-y-1">
                  <div className="text-zinc-500 uppercase tracking-widest text-[9px]">PROVEN TRACTION</div>
                  <div className="text-zinc-300">50M+ Organic Video Views, 100+ Commercial Master Cuts, 5+ Years Craft</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Post Callout & Direct CTA Row */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Currently directing post-production at <strong className="text-white">{currentCompany}</strong></span>
            </div>

            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/work');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.25)] hover:scale-105 shrink-0"
            >
              <span>Explore Works</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TIER 3: CREATOR CHANNELS & VERIFIED HUBS (FULL WIDTH 4-COLUMN DOCK)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>CREATOR CHANNELS & VERIFIED HUBS</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            50M+ CUMULATIVE IMPRESSIONS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                className={`group relative p-4 rounded-2xl bg-zinc-950/80 border border-white/10 ${item.borderColor} transition-all duration-300 flex items-center justify-between gap-3 ${item.shadowColor}`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-11 h-11 rounded-xl ${item.bgColor} border border-white/10 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform shrink-0`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-syne font-bold text-sm text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                      <span>{item.name}</span>
                    </div>
                    <div className="font-mono text-xs text-zinc-300 truncate">
                      {item.handle}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      {item.tag}
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </a>
            );
          })}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TIER 4: 4 PILLARS OF EDITORIAL CRAFT (FULL-WIDTH 4-COLUMN GRID)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>4 PILLARS OF EDITORIAL CRAFT</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-500/30">
            FRAMEWORK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-sm text-white">Visual Grammar</span>
            </div>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Cinematic lighting, dynamic blocking, and film emulation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-sm text-white">Pacing & Retention</span>
            </div>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Frame-accurate cutting rhythm to eliminate audience drop-off.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-sm text-white">Creator Psychology</span>
            </div>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              First 3-second hook disruption and algorithmic lift.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-syne font-bold text-sm text-white">Full-Funnel Reach</span>
            </div>
            <p className="text-xs font-mono text-zinc-400 leading-relaxed">
              Connecting creative storytelling directly to brand conversions.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AboutSection;
