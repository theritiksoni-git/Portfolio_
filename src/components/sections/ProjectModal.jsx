import React, { useEffect, useMemo } from 'react';
import { Film, Clock, CheckCircle2, ChevronLeft, ChevronRight, Cpu } from 'lucide-react';
import sound from '../../utils/SoundEngine';
import CloseButton from '../common/CloseButton';
import { parseVideoSource } from '../../utils/videoUtils';

const ProjectModal = ({ project, allProjects, onClose, onSelectNext }) => {
  const videoData = useMemo(() => {
    return parseVideoSource(project?.videoEmbedUrl);
  }, [project?.videoEmbedUrl]);

  useEffect(() => {
    // Fade out background loop music while video modal is active
    sound.fadeOutMusic(0.6);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onSelectNext && allProjects) {
        const nextIdx = (allProjects.findIndex((p) => p.id === project.id) + 1) % allProjects.length;
        onSelectNext(allProjects[nextIdx]);
      }
      if (e.key === 'ArrowLeft' && onSelectNext && allProjects) {
        const prevIdx = (allProjects.findIndex((p) => p.id === project.id) - 1 + allProjects.length) % allProjects.length;
        onSelectNext(allProjects[prevIdx]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Fade background loop music back in smoothly when video modal closes
      sound.fadeInMusic(0.8);
    };
  }, [project, allProjects, onClose, onSelectNext]);

  if (!project) return null;

  const currentIndex = allProjects ? allProjects.findIndex((p) => p.id === project.id) : 0;
  const totalCount = allProjects ? allProjects.length : 1;

  const navigateNext = (direction) => {
    if (!onSelectNext || !allProjects) return;
    sound.playLensClick();
    const nextIdx = (currentIndex + direction + allProjects.length) % allProjects.length;
    onSelectNext(allProjects[nextIdx]);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn select-none">
      
      {/* Container Card */}
      <div className="relative w-full max-w-6xl rounded-3xl bg-zinc-950 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden my-auto">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-4 border-b border-white/10 bg-zinc-900/80 backdrop-blur-md gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <span className="font-mono text-[11px] sm:text-xs text-cyan-300 tracking-widest uppercase font-bold truncate">
              <span className="hidden sm:inline">CINEMA </span>THEATER <span className="text-zinc-500">{"//"}</span> {project.timecode}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Prev / Next Controls */}
            {allProjects && allProjects.length > 1 && (
              <div className="flex items-center gap-0.5 sm:gap-1 bg-black/50 p-0.5 sm:p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => navigateNext(-1)}
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="PREV"
                  aria-label="Previous project"
                  className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Previous Project [←]"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="font-mono text-[9px] sm:text-[10px] text-zinc-500 px-1">
                  {currentIndex + 1}/{totalCount}
                </span>
                <button
                  type="button"
                  onClick={() => navigateNext(1)}
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="NEXT"
                  aria-label="Next project"
                  className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  title="Next Project [→]"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}

            {/* Custom Cinema Close Button */}
            <CloseButton onClick={onClose} />
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden border-b border-white/10">
          {videoData.type === 'video' ? (
            <video
              key={videoData.src}
              src={videoData.src}
              controls
              autoPlay
              playsInline
              poster={project.previewPoster}
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          ) : videoData.type === 'iframe' && videoData.src ? (
            <iframe
              key={videoData.src}
              src={videoData.src}
              title={project.title}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={project.previewPoster}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                <Film className="w-12 h-12 text-cyan-400 mb-3" />
                <span className="font-mono text-sm text-zinc-300">MEDIA PREVIEW</span>
              </div>
            </div>
          )}
        </div>

        {/* Project Editorial & Narrative Details */}
        <div className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* Main Title & Metadata Badges */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs tracking-wider uppercase font-bold">
                  {project.client}
                </span>
                <span className="px-3 py-1 rounded bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-xs tracking-wider uppercase">
                  {project.categoryLabel}
                </span>
                <span className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 font-mono text-xs">
                  {project.year}
                </span>
              </div>
              <h2 className="font-syne font-bold text-2xl sm:text-4xl text-white">
                {project.title}
              </h2>
              <p className="mt-2 text-cyan-400 font-mono text-xs sm:text-sm tracking-wider uppercase">
                {"// ROLE: "} {project.role}
              </p>
            </div>

            {/* Quick Specs Pill Box */}
            <div className="flex flex-wrap md:flex-col gap-2 font-mono text-xs text-zinc-400 bg-zinc-900/80 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>RUNTIME: {project.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span>ASPECT: {project.aspectRatio}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>RES: {project.resolution}</span>
              </div>
            </div>
          </div>

          {/* Grid: Synopsis & Deliverables */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Creative Strategy & Synopsis */}
            <div className="md:col-span-2 space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                {"// CREATIVE APPROACH & EDITORIAL DIRECTION"}
              </h3>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {project.synopsis}
              </p>
              {project.tagline && (
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-xs sm:text-sm italic">
                  "{project.tagline}"
                </div>
              )}
            </div>

            {/* Right Col: Deliverables & Tools */}
            <div className="space-y-6">
              
              {/* Deliverables List */}
              {project.deliverables && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    {"// MASTER DELIVERABLES"}
                  </h3>
                  <div className="space-y-2">
                    {project.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-mono text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tools Stack */}
              {project.tools && (
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-3">
                    {"// SOFTWARE STACK"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProjectModal;
