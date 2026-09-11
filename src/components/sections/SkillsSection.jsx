import React, { useState, useMemo } from 'react';
import { Cpu, Sliders, Zap, ChevronDown, Sparkles } from 'lucide-react';
import { CORE_SOFTWARE, PRODUCTION_SKILLS } from '../../data/skills';
import sound from '../../utils/SoundEngine';

const DISCIPLINE_CATEGORIES = [
  { id: 'all', label: 'ALL CAPABILITIES' },
  { id: 'post', label: 'POST-PRODUCTION & NLE' },
  { id: 'growth', label: 'SOCIAL & RETENTION' },
  { id: 'camera', label: 'DIRECTION & CAMERA' },
];

const SkillsSection = () => {
  const [activeSoftwareId, setActiveSoftwareId] = useState(CORE_SOFTWARE[0].id);
  const [activeDisciplineFilter, setActiveDisciplineFilter] = useState('all');
  const [isAllDisciplinesExpanded, setIsAllDisciplinesExpanded] = useState(false);

  const selectedSoftware = CORE_SOFTWARE.find((s) => s.id === activeSoftwareId) || CORE_SOFTWARE[0];

  const filteredDisciplines = useMemo(() => {
    return PRODUCTION_SKILLS.filter((skill) => {
      if (activeDisciplineFilter === 'all') return true;
      if (activeDisciplineFilter === 'post') {
        return ['video-editing', 'hook-architecture', 'cinematic-video'].includes(skill.id);
      }
      if (activeDisciplineFilter === 'growth') {
        return ['smm-management', 'growth-analytics', 'short-form-reels', 'content-calendars', 'youtube-content'].includes(skill.id);
      }
      if (activeDisciplineFilter === 'camera') {
        return ['corporate-film', 'storytelling', 'cinematography', 'video-production'].includes(skill.id);
      }
      return true;
    });
  }, [activeDisciplineFilter]);

  // Display top 6 disciplines by default to keep the section compact
  const displayedDisciplines = isAllDisciplinesExpanded ? filteredDisciplines : filteredDisciplines.slice(0, 6);
  const hasMoreDisciplines = filteredDisciplines.length > 6;

  const handleSoftwareChange = (id) => {
    sound.playLensClick();
    setActiveSoftwareId(id);
  };

  const handleFilterChange = (id) => {
    sound.playLensClick();
    setActiveDisciplineFilter(id);
  };

  return (
    <section id="skills" className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="mb-10 pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-2.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 06 // PRODUCTION CONSOLE & TOOLING</span>
        </div>
        <h2 className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
          SKILLS &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            SOFTWARE
          </span>
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-2xl font-light">
          Deep specializations across industry-standard NLE platforms, motion design suites, and data-driven social media growth operations.
        </p>
      </div>

      {/* 1. CORE SOFTWARE WORKSTATION SUITE */}
      <div className="mb-14 space-y-4">
        
        {/* Workstation Selector Tabs (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CORE_SOFTWARE.map((sw, idx) => {
            const isActive = activeSoftwareId === sw.id;

            return (
              <button
                key={sw.id}
                type="button"
                onClick={() => handleSoftwareChange(sw.id)}
                onMouseEnter={(e) => sound.playHover(e?.clientX)}
                data-cursor="SELECT"
                className={`p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-2 focus:outline-none ${
                  isActive
                    ? 'bg-zinc-900 border-cyan-500/80 shadow-[0_0_25px_rgba(56,189,248,0.2)] ring-1 ring-cyan-500/40'
                    : 'bg-zinc-950/80 border-white/10 hover:border-white/20 hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="font-mono text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase"
                    style={{
                      backgroundColor: `${sw.accentColor}20`,
                      color: sw.accentColor,
                      border: `1px solid ${sw.accentColor}40`
                    }}
                  >
                    {sw.badge}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500 font-semibold">
                    {`0${idx + 1} // 03`}
                  </span>
                </div>

                <div>
                  <h3 className="font-syne font-bold text-base sm:text-lg text-white">
                    {sw.name}
                  </h3>
                  <p className="font-mono text-xs text-cyan-400 mt-0.5">
                    {sw.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Workstation Inspector Console */}
        <div
          key={selectedSoftware.id}
          className="rounded-2xl sm:rounded-3xl bg-zinc-950/90 border border-white/10 p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fadeIn"
        >
          {/* Ambient Glow */}
          <div
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-20 transition-all duration-700"
            style={{ backgroundColor: selectedSoftware.accentColor }}
          />

          {/* Console Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h4 className="font-syne font-bold text-lg sm:text-xl text-white">
                {`${selectedSoftware.name} Workspace`}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold">
                {selectedSoftware.level}
              </span>
              <span className="hidden sm:inline font-mono text-xs text-zinc-500">
                100% NATIVE EXPERTISE
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6 font-light max-w-4xl">
            {selectedSoftware.summary}
          </p>

          {/* Capabilities Grid */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
              {`// ADVANCED WORKFLOW CAPABILITIES`}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {selectedSoftware.specializations.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-zinc-900/70 border border-white/5 flex items-center gap-2.5 text-xs font-mono text-zinc-200"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{spec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-[11px] text-zinc-400">
            <span>CALIBRATED FOR: 4K DCI & VERTICAL RETENTION PIPELINES</span>
            <span className="text-cyan-400 font-semibold">PRODUCTION READY</span>
          </div>

        </div>

      </div>

      {/* 2. FILMMAKING & GROWTH DISCIPLINES MATRIX */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="text-xs font-mono tracking-widest uppercase text-zinc-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{`// FILMMAKING & GROWTH DISCIPLINES (${filteredDisciplines.length} ACTIVE)`}</span>
          </div>

          {/* Discipline Category Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {DISCIPLINE_CATEGORIES.map((cat) => {
              const isActive = activeDisciplineFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleFilterChange(cat.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                      : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Disciplines Cards Grid (Curated 6 Cards by Default) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {displayedDisciplines.map((skill) => (
            <div
              key={skill.id}
              onMouseEnter={(e) => sound.playHover(e?.clientX)}
              data-cursor="EXPLORE"
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-950 border border-white/10 hover:border-cyan-500/40 hover:bg-zinc-900/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-cyan-400 tracking-wider uppercase font-bold">
                    {skill.category}
                  </span>
                  <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-zinc-400">
                    {skill.tag}
                  </span>
                </div>
                <h4 className="font-syne font-bold text-base sm:text-lg text-white group-hover:text-cyan-300 transition-colors truncate">
                  {skill.name}
                </h4>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed font-light line-clamp-2">
                  {skill.description}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500">CORE FOCUS:</span>
                <span className="text-cyan-300 font-semibold">{skill.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Expand / Collapse All 12 Disciplines Button */}
        {hasMoreDisciplines && (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                sound.playLensClick();
                setIsAllDisciplinesExpanded(!isAllDisciplinesExpanded);
              }}
              onMouseEnter={(e) => sound.playHover(e?.clientX)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-white/10 hover:border-cyan-500/40 font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-md group"
            >
              <span>
                {isAllDisciplinesExpanded
                  ? 'SHOW CURATED DISCIPLINES'
                  : `VIEW ALL ${filteredDisciplines.length} DISCIPLINES`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-cyan-400 transition-transform duration-300 ${
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
