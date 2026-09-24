import React, { useState, useMemo } from 'react';
import { Play, Film, Clock, ArrowUpRight, Search } from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../data/projects';
import sound from '../../utils/SoundEngine';
import usePortfolioData from '../../utils/usePortfolioData';
import { ClientLogoBadge, ToolIcon } from '../common/ProjectCardBadges';
const DISPLAY_LIMIT = 3; // Display exactly 1 line (3 smaller cards on desktop)

const WorkSection = ({ onSelectProject, onOpenTheaterArchive, showAll = false }) => {
  const { projects } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  const dynamicCategories = useMemo(() => {
    return PROJECT_CATEGORIES.map((cat) => {
      let count = 0;
      if (cat.id === 'all') count = projects.length;
      else if (cat.id === 'smm') count = projects.filter((p) => p.category === 'smm' || p.category === 'reels').length;
      else count = projects.filter((p) => p.category === cat.id).length;
      return {
        ...cat,
        countLabel: String(count).padStart(2, '0')
      };
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((proj) => {
      const matchesCategory =
        activeCategory === 'all' ||
        proj.category === activeCategory ||
        (activeCategory === 'smm' && (proj.category === 'smm' || proj.category === 'reels'));
      const matchesSearch =
        searchQuery.trim() === '' ||
        (proj.title && proj.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proj.client && proj.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proj.synopsis && proj.synopsis.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(proj.tools) && proj.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, searchQuery]);

  const handleCategoryChange = (categoryId) => {
    sound.playLensClick();
    setActiveCategory(categoryId);
  };

  // On dedicated page, show all matching cards; otherwise adhere to DISPLAY_LIMIT
  const effectiveLimit = showAll ? 999 : DISPLAY_LIMIT;
  const displayedProjects = filteredProjects.slice(0, effectiveLimit);
  const hasMore = !showAll && filteredProjects.length > DISPLAY_LIMIT;

  return (
    <section id="work" className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header with Cinematic Timecode Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-2">
            <Film className="w-3.5 h-3.5" />
            <span>SCENE 03 // PORTFOLIO GALLERY</span>
          </div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            SELECTED{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              WORKS
            </span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
            Cinematic corporate films, viral retention edits, long-form YouTube essays, and narrative visual pieces.
          </p>
        </div>

        {/* Search Input Bar with Clickable Highlight & Hover Feedback */}
        <div
          className="group relative w-full md:w-72"
          onMouseEnter={() => sound.playHover()}
        >
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 group-focus-within:text-cyan-300 transition-colors pointer-events-none" />
          <input
            type="text"
            placeholder="Search client, style, tool..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-900 border border-white/15 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(56,189,248,0.25)] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_24px_rgba(56,189,248,0.35)] focus:bg-zinc-950 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all duration-300 cursor-text shadow-sm"
          />
          {searchQuery ? (
            <button
              onClick={() => {
                sound.playLensClick();
                setSearchQuery('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-cyan-300 hover:scale-110 transition-all cursor-pointer"
            >
              CLEAR
            </button>
          ) : (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] text-zinc-500 border border-white/10 px-1.5 py-0.2 rounded pointer-events-none group-hover:text-cyan-400/80 group-hover:border-cyan-500/40 transition-colors">
              /
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto sm:overflow-visible py-3.5 -my-2 mb-8 -mx-4 px-4 sm:mx-0 sm:px-1 sm:flex-wrap scrollbar-none no-scrollbar">
        {dynamicCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              onMouseEnter={() => sound.playHover()}
              data-cursor="VIEW"
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 focus:outline-none flex-shrink-0 whitespace-nowrap min-h-[36px] cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.45)] border border-cyan-300'
                  : 'bg-zinc-900/85 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-white/10 active:bg-zinc-800 hover:border-white/20'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-black/25 text-black font-semibold' : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {cat.countLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Project Grid (One Line Only, Smaller Cards) */}
      {filteredProjects.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-950/60 border border-white/5 font-mono text-zinc-500">
          <Film className="w-7 h-7 mx-auto mb-2.5 text-zinc-600" />
          <p>NO PROJECTS FOUND MATCHING "{searchQuery.toUpperCase()}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="mt-3 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-cyan-400 text-xs hover:bg-zinc-800"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <>
          {/* Compact Modern Cinematic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 max-w-6xl mx-auto">
            {displayedProjects.map((project) => {
              const isHovered = hoveredProjectId === project.id;
              const isAnyHovered = hoveredProjectId !== null;

              return (
                <div
                  key={project.id}
                  onMouseEnter={(e) => {
                    sound.playHover(e.clientX);
                    setHoveredProjectId(project.id);
                  }}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  onClick={(e) => {
                    sound.playGoldenHour(e.clientX);
                    onSelectProject(project);
                  }}
                  data-cursor="PLAY"
                  className={`group relative rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/[0.08] cursor-pointer transition-all duration-300 ease-out flex flex-col justify-between shadow-md ${
                    isHovered
                      ? 'scale-[1.015] -translate-y-1 border-cyan-500/50 shadow-[0_14px_32px_rgba(0,0,0,0.8),0_0_22px_rgba(56,189,248,0.18)] z-20'
                      : isAnyHovered
                      ? 'opacity-75'
                      : 'opacity-100 hover:border-white/20'
                  }`}
                >
                  {/* Widescreen Cinematic Poster Frame */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                    <img
                      src={project.previewPoster}
                      alt={project.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter contrast-105 brightness-95 group-hover:brightness-105"
                      loading="lazy"
                    />
                    
                    {/* Ambient Cinematic Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/35 pointer-events-none" />

                    {/* Top Left: Floating Client Logo Pill */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <ClientLogoBadge client={project.client} />
                    </div>

                    {/* Top Right: Floating Duration Pill */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 h-6 px-2 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-zinc-300 font-mono text-[9px] shadow-md">
                      <Clock className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{project.duration}</span>
                    </div>

                    {/* Center Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-9 h-9 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)] group-hover:scale-110 group-hover:bg-cyan-400 group-hover:shadow-[0_0_28px_rgba(56,189,248,0.8)] transition-all duration-300">
                        <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Compact Card Content & Balanced Typography */}
                  <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.16em] text-cyan-400/90 uppercase font-medium mb-1">
                        {project.role}
                      </div>
                      <h3 className="font-syne font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2 min-h-[2.35rem] flex items-start">
                        {project.title}
                      </h3>
                    </div>

                    {/* Compact Footer Strip */}
                    <div className="mt-3.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-medium select-none">
                          Tools:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {project.tools.map((tool) => (
                            <ToolIcon key={tool} tool={tool} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-cyan-400 font-mono text-[11px] tracking-wider group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0">
                        <span>THEATER</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Option: Opens Cinematic Theater Window */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  sound.playLensClick();
                  if (onOpenTheaterArchive) onOpenTheaterArchive();
                }}
                onMouseEnter={(e) => sound.playHover(e?.clientX)}
                data-cursor="THEATER"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-white border border-cyan-500/40 hover:border-cyan-400 font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] group scale-100 hover:scale-[1.02]"
              >
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHOW MORE // OPEN CINEMATIC THEATER ({projects.length} TITLES)</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </>
      )}

    </section>
  );
};

export default WorkSection;
