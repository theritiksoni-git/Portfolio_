import React, { useState, useMemo } from 'react';
import { 
  Cpu, Sliders, Zap, ChevronDown, Sparkles, Search, X, 
  Film, Camera, TrendingUp, Video, Activity, Check 
} from 'lucide-react';
import { CORE_SOFTWARE, PRODUCTION_SKILLS } from '../../data/skills';
import sound from '../../utils/SoundEngine';
import usePortfolioData from '../../utils/usePortfolioData';

const DISCIPLINE_CATEGORIES = [
  { id: 'all', label: 'ALL CAPABILITIES' },
  { id: 'post', label: 'POST-PRODUCTION' },
  { id: 'growth', label: 'SOCIAL & RETENTION' },
  { id: 'camera', label: 'DIRECTION & CAMERA' },
];

const QUICK_TAG_SUGGESTIONS = [
  'Hooks', 'Reels', '4K', 'Color', 'Storytelling', 'Analytics', 'YouTube', 'Corporate'
];

const CAPABILITY_TELEMETRY = [
  { label: 'CALIBRATION', val: '4K DCI & 9:16 VERTICAL' },
  { label: 'CORE ENGINES', val: 'PREMIERE PRO • AFTER EFFECTS' },
  { label: 'STRATEGY', val: '3-SEC HOOK ARCHITECTURE' },
  { label: 'POST PIPELINE', val: 'LUMETRI & FOLEY MASTERING' },
];

// Software Monogram Glyph Component
const SoftwareGlyph = ({ id, accentColor }) => {
  if (id === 'premiere-pro') {
    return (
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-black text-sm border shadow-inner transition-transform group-hover:scale-105"
        style={{
          backgroundColor: '#9999ff15',
          borderColor: '#9999ff50',
          color: '#9999ff',
          boxShadow: '0 0 15px rgba(153, 153, 255, 0.2)'
        }}
      >
        Pr
      </div>
    );
  }
  if (id === 'after-effects') {
    return (
      <div 
        className="w-10 h-10 rounded-xl flex items-center justify-center font-syne font-black text-sm border shadow-inner transition-transform group-hover:scale-105"
        style={{
          backgroundColor: '#ff77aa15',
          borderColor: '#ff77aa50',
          color: '#ff77aa',
          boxShadow: '0 0 15px rgba(255, 119, 170, 0.2)'
        }}
      >
        Ae
      </div>
    );
  }
  return (
    <div 
      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs border shadow-inner transition-transform group-hover:scale-105"
      style={{
        backgroundColor: `${accentColor}15`,
        borderColor: `${accentColor}50`,
        color: accentColor,
        boxShadow: `0 0 15px ${accentColor}30`
      }}
    >
      <TrendingUp className="w-5 h-5" />
    </div>
  );
};

// Helper for category icons
const getCategoryIcon = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('post') || cat.includes('editing')) return Film;
  if (cat.includes('growth') || cat.includes('retention') || cat.includes('social') || cat.includes('performance')) return TrendingUp;
  if (cat.includes('camera') || cat.includes('cinematography') || cat.includes('production')) return Camera;
  return Video;
};


const SkillsSection = ({ isStandalonePage = false }) => {
  const { skills: liveSkills } = usePortfolioData();
  const softwareList = liveSkills && liveSkills.length > 0 ? liveSkills : CORE_SOFTWARE;

  const [activeSoftwareId, setActiveSoftwareId] = useState(softwareList[0]?.id || CORE_SOFTWARE[0].id);
  const [activeDisciplineFilter, setActiveDisciplineFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAllDisciplinesExpanded, setIsAllDisciplinesExpanded] = useState(false);

  const selectedSoftware = softwareList.find((s) => s.id === activeSoftwareId) || softwareList[0] || CORE_SOFTWARE[0];

  // Dynamic counts for category filter tabs
  const categoryCounts = useMemo(() => {
    const counts = { all: PRODUCTION_SKILLS.length, post: 0, growth: 0, camera: 0 };
    PRODUCTION_SKILLS.forEach((skill) => {
      if (['video-editing', 'hook-architecture', 'cinematic-video'].includes(skill.id)) counts.post++;
      if (['smm-management', 'growth-analytics', 'short-form-reels', 'content-calendars', 'youtube-content'].includes(skill.id)) counts.growth++;
      if (['corporate-film', 'storytelling', 'cinematography', 'video-production'].includes(skill.id)) counts.camera++;
    });
    return counts;
  }, []);

  const filteredDisciplines = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return PRODUCTION_SKILLS.filter((skill) => {
      // 1. Category Filter
      let matchesCategory = true;
      if (activeDisciplineFilter === 'post') {
        matchesCategory = ['video-editing', 'hook-architecture', 'cinematic-video'].includes(skill.id);
      } else if (activeDisciplineFilter === 'growth') {
        matchesCategory = ['smm-management', 'growth-analytics', 'short-form-reels', 'content-calendars', 'youtube-content'].includes(skill.id);
      } else if (activeDisciplineFilter === 'camera') {
        matchesCategory = ['corporate-film', 'storytelling', 'cinematography', 'video-production'].includes(skill.id);
      }

      if (!matchesCategory) return false;

      // 2. Search Query Filter
      if (normalizedQuery) {
        const targetString = `${skill.name} ${skill.description} ${skill.category} ${skill.highlight} ${skill.tag}`.toLowerCase();
        return targetString.includes(normalizedQuery);
      }

      return true;
    });
  }, [activeDisciplineFilter, searchQuery]);

  // When searching, show all matched results; otherwise curate to 6 by default
  const isSearchActive = searchQuery.trim().length > 0;
  const displayedDisciplines = isAllDisciplinesExpanded || isSearchActive ? filteredDisciplines : filteredDisciplines.slice(0, 6);
  const hasMoreDisciplines = !isSearchActive && filteredDisciplines.length > 6;

  const handleSoftwareChange = (id) => {
    sound.playLensClick();
    setActiveSoftwareId(id);
  };

  const handleFilterChange = (id) => {
    sound.playLensClick();
    setActiveDisciplineFilter(id);
  };

  const handleQuickTagClick = (tag) => {
    sound.playLensClick();
    setSearchQuery(tag);
  };

  const handleClearSearch = () => {
    sound.playClick();
    setSearchQuery('');
  };

  return (
    <section
      id="skills"
      className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
        isStandalonePage ? 'py-4 sm:py-6' : 'py-16 md:py-20'
      }`}
    >
      {/* Ambient Atmospheric Lighting Accent */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Unified High-Impact Section Header */}
      <div className="relative z-10 mb-12 pb-8 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 05 // PRODUCTION TOOLKIT &amp; HARDWARE CONSOLE</span>
        </div>

        <h1 className="font-syne font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-tight">
          TECH{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500">
            SKILLS &amp; WORKFLOWS
          </span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-zinc-300 max-w-3xl font-light leading-relaxed">
          Frame-accurate mastery across industry-standard non-linear editors, motion graphics workflows, high-retention social content architecture, and broadcast mastering.
        </p>

        {/* Telemetry Capability Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-6 pt-5 border-t border-white/5">
          {CAPABILITY_TELEMETRY.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-zinc-950/70 border border-white/10 backdrop-blur-md flex flex-col justify-between"
            >
              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block">
                {item.label}
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-cyan-300 tracking-wide truncate mt-0.5">
                {item.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 1. CORE SOFTWARE WORKSTATION SUITE */}
      <div className="mb-16 space-y-4">
        {/* Workstation Selector Tabs (Responsive Grid) */}
        <div
          role="tablist"
          aria-label="Software Workstations"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5"
        >
          {softwareList.map((sw, idx) => {
            const isActive = activeSoftwareId === sw.id;

            return (
              <button
                key={sw.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => handleSoftwareChange(sw.id)}
                onMouseEnter={(e) => sound.playHover(e?.clientX)}
                data-cursor="SELECT"
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-4 focus:outline-none relative group overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-b from-zinc-900/90 to-zinc-950 border-cyan-500/80 shadow-[0_0_35px_rgba(56,189,248,0.25)] ring-1 ring-cyan-500/40'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/20 hover:bg-zinc-900/60'
                }`}
              >
                {/* Active Indicator Top Border Accent */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: sw.accentColor }}
                  />
                )}

                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <SoftwareGlyph id={sw.id} accentColor={sw.accentColor} />
                    <div>
                      <span
                        className="font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase"
                        style={{
                          backgroundColor: `${sw.accentColor}18`,
                          color: sw.accentColor,
                          border: `1px solid ${sw.accentColor}35`,
                        }}
                      >
                        {sw.badge}
                      </span>
                      <p className="font-mono text-[11px] text-zinc-400 mt-1">
                        {sw.category}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 font-mono text-[9px] text-cyan-300 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-zinc-500 font-semibold">
                        {`0${idx + 1} // 0${softwareList.length}`}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="font-syne font-bold text-lg sm:text-xl text-white group-hover:text-cyan-200 transition-colors">
                    {sw.name}
                  </h2>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Workstation Inspector Console */}
        <div
          key={selectedSoftware.id}
          className="rounded-3xl bg-zinc-950/90 border border-white/15 p-6 sm:p-9 shadow-2xl relative overflow-hidden backdrop-blur-xl animate-fadeIn"
        >
          {/* Ambient Glowing Aura */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[130px] pointer-events-none opacity-20 transition-all duration-700"
            style={{ backgroundColor: selectedSoftware.accentColor }}
          />

          {/* Console Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center border"
                style={{
                  backgroundColor: `${selectedSoftware.accentColor}20`,
                  borderColor: `${selectedSoftware.accentColor}40`,
                  color: selectedSoftware.accentColor
                }}
              >
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-syne font-bold text-xl sm:text-2xl text-white">
                  {`${selectedSoftware.name} Workspace`}
                </h3>
                <span className="font-mono text-[10px] text-zinc-400">
                  FRAME-ACCURATE HARDWARE-ACCELERATED TIMELINE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <span 
                className="px-3 py-1 rounded-full font-mono text-xs font-semibold border shadow-sm"
                style={{
                  backgroundColor: `${selectedSoftware.accentColor}20`,
                  borderColor: `${selectedSoftware.accentColor}40`,
                  color: selectedSoftware.accentColor
                }}
              >
                {selectedSoftware.level}
              </span>
              <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CONSOLE READY
              </span>
            </div>
          </div>

          {/* Software Overview Statement */}
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-8 font-light max-w-4xl">
            {selectedSoftware.summary}
          </p>

          {/* Capabilities Grid */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>ADVANCED WORKFLOW CAPABILITIES ({selectedSoftware.specializations.length})</span>
              </span>
              <span className="font-mono text-[10px] text-cyan-400 hidden sm:inline">
                NATIVE SPEED // ZERO LATENCY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedSoftware.specializations.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-cyan-500/40 hover:bg-zinc-900/90 transition-all duration-200 flex items-center gap-3 text-xs font-mono text-zinc-200 group/spec hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                >
                  <div className="w-6 h-6 rounded-md bg-zinc-950 border border-white/10 flex items-center justify-center text-cyan-400 group-hover/spec:border-cyan-500/40 shrink-0">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate group-hover/spec:text-white transition-colors">{spec}</span>
                </div>
              ))}

            </div>
          </div>

          {/* Console Specs Footer Bar */}
          <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-[11px] text-zinc-400">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-zinc-500">CODECS:</span>
              <span className="text-zinc-300">PRORES 422 HQ • H.265 • 10-BIT LOG</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Check className="w-4 h-4 text-cyan-400" />
              <span>CALIBRATED FOR MASTER DELIVERY</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILMMAKING & GROWTH DISCIPLINES MATRIX */}
      <div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{`// FILMMAKING & GROWTH DISCIPLINES (${filteredDisciplines.length} ACTIVE)`}</span>
            </div>
            <h3 className="font-syne font-bold text-2xl text-white">
              Tactical Discipline Matrix
            </h3>
          </div>

          {/* Controls Deck: Instant Search & Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search disciplines..."
                className="w-full sm:w-56 pl-9 pr-8 py-2 rounded-full bg-zinc-900/90 border border-white/15 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear Search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {DISCIPLINE_CATEGORIES.map((cat) => {
                const isActive = activeDisciplineFilter === cat.id;
                const count = categoryCounts[cat.id] ?? 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleFilterChange(cat.id)}
                    onMouseEnter={() => sound.playHover()}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                        : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/10'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-black/25 text-black font-bold' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Tag Recommendations Bar */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none font-mono text-[11px] text-zinc-500">
          <span className="shrink-0 uppercase text-[10px] tracking-wider text-zinc-500">QUICK FILTER:</span>
          {QUICK_TAG_SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleQuickTagClick(tag)}
              className={`px-2.5 py-1 rounded-md text-[10px] tracking-wider uppercase border transition-all shrink-0 ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                  : 'bg-zinc-950/60 border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/20'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Disciplines Cards Grid */}
        {displayedDisciplines.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {displayedDisciplines.map((skill, idx) => {
              const IconComp = getCategoryIcon(skill.category);

              return (
                <div
                  key={skill.id}
                  onMouseEnter={(e) => sound.playHover(e?.clientX)}
                  data-cursor="EXPLORE"
                  className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950 border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-mono text-[10px] text-cyan-400 tracking-wider uppercase font-bold">
                          {skill.category}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-900/90 border border-white/10 text-zinc-400">
                        {skill.tag}
                      </span>
                    </div>

                    <h4 className="font-syne font-bold text-lg text-white group-hover:text-cyan-200 transition-colors truncate">
                      {skill.name}
                    </h4>

                    <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed font-light line-clamp-2">
                      {skill.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="text-zinc-500 text-[10px]">CORE FOCUS:</span>
                    <span className="text-cyan-300 font-semibold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-[10px]">
                      {skill.highlight}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-md">
            <p className="font-mono text-sm text-zinc-300">
              No capabilities found matching "{searchQuery}".
            </p>
            <p className="font-mono text-xs text-zinc-500 mt-1">
              Try a different keyword or reset the filter.
            </p>
            <button
              type="button"
              onClick={handleClearSearch}
              className="mt-4 px-5 py-2 rounded-full bg-cyan-500 text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(56,189,248,0.3)]"
            >
              Reset Search Filter
            </button>
          </div>
        )}

        {/* Expand / Collapse All 12 Disciplines Button (Hidden when searching) */}
        {hasMoreDisciplines && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => {
                sound.playLensClick();
                setIsAllDisciplinesExpanded(!isAllDisciplinesExpanded);
              }}
              onMouseEnter={(e) => sound.playHover(e?.clientX)}
              className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 hover:border-cyan-500/50 font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-md group hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              <span>
                {isAllDisciplinesExpanded
                  ? 'SHOW CURATED DISCIPLINES (6)'
                  : `EXPAND COMPLETE MATRIX (${filteredDisciplines.length})`}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
                  isAllDisciplinesExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;

