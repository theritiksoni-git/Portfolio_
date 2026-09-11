import React, { useState, useMemo, useEffect } from 'react';
import { X, Play, Clock, Film, Search, ArrowUpRight } from 'lucide-react';
import { PROJECTS, PROJECT_CATEGORIES } from '../../data/projects';
import sound from '../../utils/SoundEngine';
import { ClientLogoBadge, ToolIcon } from '../common/ProjectCardBadges';

export default function TheaterArchiveModal({ isOpen, onClose, onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playLensClick();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj) => {
      const matchesCategory =
        activeCategory === 'all' ||
        proj.category === activeCategory ||
        (activeCategory === 'smm' && (proj.category === 'smm' || proj.category === 'reels'));
      const matchesSearch =
        searchQuery.trim() === '' ||
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 backdrop-blur-2xl overflow-y-auto overscroll-contain theater-modal-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theater-archive-title"
    >

      {/* Sticky Cinematic Control Bar (Compact & Highly Responsive) */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Left: Badge & Live Count */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/40 text-cyan-300 font-mono text-xs tracking-wider uppercase font-semibold">
              <Film className="w-3.5 h-3.5 text-cyan-400" />
              <span id="theater-archive-title">THEATER ARCHIVE</span>
            </div>
            <span className="font-mono text-xs text-zinc-400">
              {`${filteredProjects.length} OF ${PROJECTS.length} TITLES`}
            </span>
          </div>

          {/* Right: Search Input & Close Button */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div
              className="group relative flex-1 sm:w-64"
              onMouseEnter={() => sound.playHover()}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 group-focus-within:text-cyan-300 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Filter client, style, tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 border border-white/15 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 focus:shadow-[0_0_20px_rgba(56,189,248,0.35)] focus:bg-zinc-950 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all duration-300 cursor-text shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    sound.playLensClick();
                    setSearchQuery('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-400 hover:text-cyan-300 hover:scale-110 transition-all cursor-pointer"
                >
                  CLEAR
                </button>
              )}
            </div>

            {/* Close Button with ESC badge */}
            <button
              type="button"
              onClick={() => {
                sound.playLensClick();
                onClose();
              }}
              onMouseEnter={(e) => sound.playHover(e?.clientX)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 hover:border-cyan-500/40 font-mono text-xs tracking-wider transition-all flex-shrink-0"
            >
              <span>CLOSE</span>
              <span className="hidden sm:inline text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-zinc-400">ESC</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Category Filter Pills Row (Never causes vertical bloat) */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 mt-2.5 pt-2 pb-2 px-1 border-t border-white/5 overflow-x-auto sm:overflow-visible no-scrollbar scrollbar-none scroll-smooth">
          {PROJECT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  sound.playLensClick();
                  setActiveCategory(cat.id);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-3 py-1 rounded-full font-mono text-xs tracking-wider transition-all duration-300 flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_16px_rgba(34,211,238,0.45)] border border-cyan-300'
                    : 'bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/90 border border-white/5 hover:border-white/15'
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
      </header>

      {/* Main Theater Vault Gallery */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center rounded-2xl bg-zinc-950/60 border border-white/5 font-mono text-zinc-500">
            <Film className="w-8 h-8 mx-auto mb-3 text-zinc-600" />
            <p>NO PROJECTS FOUND MATCHING "{searchQuery.toUpperCase()}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="mt-4 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-cyan-400 text-xs hover:bg-zinc-800"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredProjects.map((project) => {
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
                      ? 'scale-[1.015] -translate-y-1 border-cyan-500/50 shadow-[0_14px_32px_rgba(0,0,0,0.8),0_0_22px_rgba(56,189,248,0.18)] z-10'
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
        )}
      </main>
    </div>
  );
}
