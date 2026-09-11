import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Sliders,
  Film,
  Disc,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  Grid,
  Aperture,
  Volume2,
  VolumeX,
  Video,
  Columns
} from 'lucide-react';
import { EXPERIENCES, TIMELINE_TRACKS, TIMELINE_SPAN } from '../../data/experience';
import sound from '../../utils/SoundEngine';
import useNetworkQuality from '../../utils/useNetworkQuality';
import { ToolIcon } from '../common/ProjectCardBadges';

// Authentic NLE Video Editor Track Priority:
// Higher video tracks (V2) take visual precedence over lower layers (V1, A1)
const getActiveExperienceAtPercent = (percent) => {
  const matching = EXPERIENCES.filter(
    (exp) =>
      percent >= exp.trackStartPercent &&
      percent <= exp.trackStartPercent + exp.trackWidthPercent
  );
  if (matching.length === 0) return null;

  // Track priority: V2 (Top video layer / client cuts) > V1 (Middle layer) > A1 (Bottom layer)
  const trackOrder = { V2: 3, V1: 2, A1: 1 };
  matching.sort((a, b) => (trackOrder[b.track] || 0) - (trackOrder[a.track] || 0));

  return matching[0];
};

const ExperienceSection = () => {
  const [selectedExpId, setSelectedExpId] = useState(EXPERIENCES[0].id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullSpecs, setShowFullSpecs] = useState(false);
  const [layoutMode, setLayoutMode] = useState('studio'); // 'studio' (side-by-side) | 'stacked'

  // Video Edit Suite Interactive States:
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isCutting, setIsCutting] = useState(false);
  const [lutMode, setLutMode] = useState('graded'); // 'graded' | 'log'
  const [showGuides, setShowGuides] = useState(false);
  const [frameTick, setFrameTick] = useState(14);
  const videoRef = useRef(null);
  const { videoPreload } = useNetworkQuality();

  const selectedExperience = EXPERIENCES.find((e) => e.id === selectedExpId) || EXPERIENCES[0];
  const currentIndex = EXPERIENCES.findIndex((e) => e.id === selectedExperience.id);

  // Playhead position along the 0-100% time continuum
  const [playheadPercent, setPlayheadPercent] = useState(() => {
    return selectedExperience.trackStartPercent + selectedExperience.trackWidthPercent / 2;
  });

  const timelineTrackRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Shutter / Optical Cut Transition Trigger (simulates video edit cut flash)
  const triggerCut = useCallback(() => {
    setIsCutting(true);
    const t = setTimeout(() => setIsCutting(false), 280);
    return () => clearTimeout(t);
  }, []);

  // Preload images and logos for instantaneous zero-latency switching
  useEffect(() => {
    EXPERIENCES.forEach((exp) => {
      if (exp.previewImage) {
        const img = new Image();
        img.src = exp.previewImage;
      }
      if (exp.logoImage) {
        const logo = new Image();
        logo.src = exp.logoImage;
      }
    });
  }, []);

  // 24 FPS Live Frame Counter simulation for Program Monitor (ticks only when playing)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setFrameTick((prev) => (prev + 1) % 24);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Strictly synchronize HTML5 video playback with timeline isPlaying state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [isPlaying, selectedExperience.id]);

  // Colorist LUT Toggle (Rec.709 vs RAW Log)
  const handleToggleLut = useCallback(() => {
    sound.playClick();
    setLutMode((prev) => (prev === 'graded' ? 'log' : 'graded'));
  }, []);

  // Rule of Thirds Guides Toggle
  const handleToggleGuides = useCallback(() => {
    sound.playClick();
    setShowGuides((prev) => !prev);
  }, []);

  // Synchronize playhead smoothly when user selects an experience manually
  const handleSelectExperience = useCallback((id, shouldPlaySound = true) => {
    const exp = EXPERIENCES.find((e) => e.id === id);
    if (!exp) return;
    if (shouldPlaySound) {
      sound.playLensClick();
    }
    triggerCut();
    setSelectedExpId(id);
    setPlayheadPercent(exp.trackStartPercent + exp.trackWidthPercent / 2);
  }, [triggerCut]);

  // Jump to previous milestone
  const handlePrev = useCallback(() => {
    sound.playLensClick();
    const prevIdx = (currentIndex - 1 + EXPERIENCES.length) % EXPERIENCES.length;
    handleSelectExperience(EXPERIENCES[prevIdx].id, false);
  }, [currentIndex, handleSelectExperience]);

  // Jump to next milestone
  const handleNext = useCallback(() => {
    sound.playLensClick();
    const nextIdx = (currentIndex + 1) % EXPERIENCES.length;
    handleSelectExperience(EXPERIENCES[nextIdx].id, false);
  }, [currentIndex, handleSelectExperience]);

  // Toggle Automated Timeline Sequence Playback
  const togglePlay = () => {
    sound.playLensClick();
    setIsPlaying((prev) => !prev);
  };

  // Keyboard navigation: J-K-L editor keys & Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Automated Timeline Sequence Playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setPlayheadPercent((prev) => {
        let next = prev + 0.65; // Smooth playhead progression speed
        if (next > 98) {
          next = 2; // Loop back to start
        }

        // Top layers (V2) take precedence during playback!
        const activeExp = getActiveExperienceAtPercent(next);

        if (activeExp && activeExp.id !== selectedExpId) {
          setSelectedExpId(activeExp.id);
          triggerCut();
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, selectedExpId, triggerCut]);

  // Calculate percentage from mouse or touch event on the timeline track
  const updatePlayheadFromEvent = useCallback((clientX) => {
    if (!timelineTrackRef.current) return;
    const rect = timelineTrackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(1, Math.min(99, (x / rect.width) * 100));
    setPlayheadPercent(percent);

    // Top layers (V2) take precedence when scrubbing!
    const activeExp = getActiveExperienceAtPercent(percent);

    if (activeExp && activeExp.id !== selectedExpId) {
      setSelectedExpId(activeExp.id);
    }
  }, [selectedExpId]);

  const handleTimelineMouseDown = (e) => {
    isDraggingRef.current = true;
    sound.playLensClick();
    updatePlayheadFromEvent(e.clientX);

    const handleMouseMove = (moveEvent) => {
      if (!isDraggingRef.current) return;
      updatePlayheadFromEvent(moveEvent.clientX);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleTimelineTouchStart = (e) => {
    if (!e.touches[0]) return;
    isDraggingRef.current = true;
    sound.playLensClick();
    updatePlayheadFromEvent(e.touches[0].clientX);

    const handleTouchMove = (moveEvent) => {
      if (!isDraggingRef.current || !moveEvent.touches[0]) return;
      updatePlayheadFromEvent(moveEvent.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
  };

  // Convert playhead percent into pseudo SMPTE timecode (2022.0 to 2025.5)
  const currentYear = (
    TIMELINE_SPAN.startYear +
    (playheadPercent / 100) * (TIMELINE_SPAN.endYear - TIMELINE_SPAN.startYear)
  ).toFixed(1);

  return (
    <section id="experience" className="relative scroll-mt-24 pt-8 sm:pt-12 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-3.5 sm:mb-4 pb-3 border-b border-white/10 gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] sm:text-[11px] tracking-widest uppercase mb-1.5">
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
            <span>SCENE 05 // NLE CAREER SEQUENCE SUITE</span>
          </div>
          <h2 className="font-syne font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
            CAREER &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
              TIMELINE
            </span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl font-light">
            Interactive multi-track NLE sequence tracking commercial productions, brand tenures, and creative milestones.
          </p>
        </div>

        {/* Studio View Switcher & NLE Keys Helper */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Dual / Stacked Mode Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-zinc-950/90 border border-white/10 p-0.5 rounded-lg text-[10px] font-mono">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setLayoutMode('studio');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                layoutMode === 'studio'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Studio Dual: Screen & Timeline side-by-side on screen"
            >
              <Columns className="w-3 h-3" />
              <span>STUDIO DUAL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setLayoutMode('stacked');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                layoutMode === 'stacked'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Stacked: Full-width sequence layout"
            >
              <Sliders className="w-3 h-3" />
              <span>STACKED</span>
            </button>
          </div>

          {/* NLE Shortcut Helper */}
          <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-zinc-950 border border-white/10 px-2.5 py-1 rounded-full">
            <span className="text-cyan-400 font-bold">KEYS:</span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-white">J</span> PREV
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-white">K / SPACE</span> {isPlaying ? 'PAUSE' : 'PLAY'}
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-white/10 text-white">L</span> NEXT
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════════════
          NLE WORKSTATION: SCREEN MONITOR & TIMELINE CONSOLE (VISIBLE TOGETHER)
          ═══════════════════════════════════════════════════════════════════════════════ */}
      <div className={layoutMode === 'studio' ? 'grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start' : 'flex flex-col space-y-5'}>
        
        {/* ── LEFT PANE: THE CINEMA PROGRAM SCREEN MONITOR ── */}
        <div className={layoutMode === 'studio' ? 'lg:col-span-6 flex flex-col space-y-2 sm:space-y-2.5' : 'w-full flex flex-col space-y-3'}>
          <div className="nle-screen-frame p-2 sm:p-3 relative overflow-hidden">
            
            {/* Authentic Cinema Screen Overlays (Glare, Scanlines, 4-Corner Crosshairs) */}
            <div className="nle-screen-glare" />
            <div className="nle-screen-scanlines" />
            <div className="nle-screen-bracket nle-screen-bracket--tl" />
            <div className="nle-screen-bracket nle-screen-bracket--tr" />
            <div className="nle-screen-bracket nle-screen-bracket--bl" />
            <div className="nle-screen-bracket nle-screen-bracket--br" />

            {/* Ambient Phosphor Backglow keyed to selected clip color */}
            <div
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[140px] pointer-events-none opacity-30 transition-all duration-700"
              style={{ backgroundColor: selectedExperience.accentColor }}
            />

            {/* Screen Top Bezel Bar: Telemetry, SMPTE Timecode, Multi-Cam & LUT controls */}
            <div className="relative z-10 flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-white/10 gap-1.5 text-xs font-mono">
              {/* Left: Tally Dot, Resolution & Colorist Tools */}
              <div className="flex items-center flex-wrap gap-1 sm:gap-1.5">
                <div
                  onClick={togglePlay}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded border cursor-pointer transition-all ${
                    isPlaying
                      ? 'bg-red-950/70 border-red-500/40 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                      : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                  title={isPlaying ? 'Click to Pause [SPACE]' : 'Click to Play [SPACE]'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-zinc-500'}`} />
                  <span className="font-bold text-[9px] sm:text-[10px] tracking-wider whitespace-nowrap">
                    {isPlaying ? '● LIVE' : 'PAUSED'}
                  </span>
                </div>

                {/* Colorist LUT Switcher Button */}
                <button
                  type="button"
                  onClick={handleToggleLut}
                  title={`Toggle Color Profile (Currently: ${selectedExperience.lutName})`}
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border text-[9px] transition-all ${
                    lutMode === 'graded'
                      ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                      : 'bg-zinc-900/90 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <Aperture className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="font-bold">{lutMode === 'graded' ? 'REC.709' : 'LOG-C'}</span>
                </button>

                {/* 3x3 Framing Guides Toggle */}
                <button
                  type="button"
                  onClick={handleToggleGuides}
                  title="Toggle 3x3 Rule-of-Thirds Grid Guides"
                  className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] transition-all ${
                    showGuides
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-2.5 h-2.5" />
                  <span>GRID</span>
                </button>

                {/* Clip Audio Unmute Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsVideoMuted((prev) => !prev);
                  }}
                  title={isVideoMuted ? 'Unmute Live Video Audio' : 'Mute Video Audio'}
                  className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded border text-[9px] transition-all font-mono font-bold ${
                    !isVideoMuted
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.35)]'
                      : 'bg-zinc-900/80 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {isVideoMuted ? (
                    <VolumeX className="w-2.5 h-2.5 text-zinc-400" />
                  ) : (
                    <Volume2 className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
                  )}
                  <span>{isVideoMuted ? 'MUTE' : 'AUDIO'}</span>
                </button>
              </div>

              {/* Right: Live Running Timecode */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Running SMPTE Timecode */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 border border-white/10 font-mono text-[9px] sm:text-[10px] text-white">
                  <span className="text-zinc-500 font-bold">TC</span>
                  <span className="text-cyan-400 font-bold tracking-wider">
                    {selectedExperience.timecode.slice(0, 9)}
                    <span className="text-white">{String(frameTick).padStart(2, '0')}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* ── THE HERO CINEMATIC VISUAL FRAME (LIVING VIDEO EDIT WORKSTATION) ── */}
            <div
              onClick={togglePlay}
              title={isPlaying ? 'Click video to Pause Sequence [SPACE]' : 'Click video to Play Sequence [SPACE]'}
              className="relative z-10 rounded-xl overflow-hidden border border-white/15 shadow-2xl bg-black aspect-[16/10] sm:aspect-[16/9] group select-none cursor-pointer"
            >
              
              {/* Real High-Octane Motion Video Reel */}
              <video
                ref={videoRef}
                key={`${selectedExperience.id}-cam1`}
                src={selectedExperience.videoUrl}
                poster={selectedExperience.previewImage}
                autoPlay={isPlaying}
                loop
                muted={isVideoMuted}
                playsInline
                preload={isPlaying ? 'auto' : videoPreload}
                className={`w-full h-full object-cover object-center transition-all duration-300 ${
                  lutMode === 'log' ? 'lut-raw-log' : 'lut-graded-rec709'
                }`}
              />

              {/* Center Play Overlay when Paused */}
              {!isPlaying && (
                <div className="absolute inset-0 z-25 flex items-center justify-center bg-black/35 backdrop-blur-[1px] transition-all duration-300 pointer-events-none">
                  <div className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-zinc-950/85 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.35)] backdrop-blur-md group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                    <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400 ml-0.5" />
                    <span className="font-mono text-[9px] sm:text-[10px] font-bold tracking-widest text-white">PLAY</span>
                  </div>
                </div>
              )}

              {/* Shutter / Optical Cut Flash (Fires on Camera Cut / Sequence Switch) */}
              {isCutting && <div className="edit-shutter-flash" />}

              {/* Authentic 35mm Celluloid Film Grain Overlay */}
              <div className="footage-film-grain" />

              {/* 3x3 Rule of Thirds & Center Framing Guides */}
              {showGuides && <div className="footage-safe-grid" />}

              {/* Cinematic Vignette & Dynamic Lighting Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/60 pointer-events-none" />

              {/* Broadcast Safe Area Crosshairs Inside The Footage */}
              <div className="nle-screen-bracket nle-screen-bracket--tl !top-2.5 !left-2.5 sm:!top-3.5 sm:!left-3.5" />
              <div className="nle-screen-bracket nle-screen-bracket--tr !top-2.5 !right-2.5 sm:!top-3.5 sm:!right-3.5" />
              <div className="nle-screen-bracket nle-screen-bracket--bl !bottom-2.5 !left-2.5 sm:!bottom-3.5 sm:!left-3.5" />
              <div className="nle-screen-bracket nle-screen-bracket--br !bottom-2.5 !right-2.5 sm:!bottom-3.5 sm:!right-3.5" />

              {/* Top Left: Live Camera Viewfinder Telemetry & Angle Tag */}
              <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 z-20 flex flex-wrap items-center gap-1 sm:gap-1.5">
                <span
                  className="font-mono text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-md shadow-md"
                  style={{
                    backgroundColor: `${selectedExperience.accentColor}30`,
                    color: selectedExperience.accentColor,
                    border: `1px solid ${selectedExperience.accentColor}80`
                  }}
                >
                  {selectedExperience.badge}
                </span>

                <span className="font-mono text-[8px] sm:text-[9px] text-cyan-300 bg-black/75 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 shadow-md">
                  <Video className="w-2.5 h-2.5 text-cyan-400" />
                  <span className="font-semibold">{selectedExperience.cam1Label}</span>
                </span>
              </div>

              {/* Top Right: Client Brand Logo Badge */}
              <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20 flex items-center gap-1.5">
                {selectedExperience.logoImage ? (
                  <div className="px-2 py-0.5 sm:py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center">
                    <img
                      src={selectedExperience.logoImage}
                      alt={selectedExperience.company}
                      className="h-3.5 sm:h-5 w-auto object-contain max-w-[70px] sm:max-w-[100px] filter drop-shadow"
                    />
                  </div>
                ) : (
                  <div className="px-2 py-0.5 sm:py-1 rounded-lg bg-black/75 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-mono text-[8px] sm:text-[9px] font-bold tracking-wider flex items-center gap-1 shadow-lg">
                    <Film className="w-2.5 h-2.5 text-emerald-400" />
                    <span>DIRECTOR'S CUT</span>
                  </div>
                )}
              </div>

              {/* Bottom Left: Live Audio Waveform & Sleek Broadcast Lower Third */}
              <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 z-20 pointer-events-none max-w-[85%]">
                
                {/* Dynamic Audio Waveform Track */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="flex items-center gap-1 py-0.5 px-1.5 sm:px-2 rounded bg-black/80 backdrop-blur-md border border-white/10 shadow-lg text-[8px] font-mono">
                    <Volume2 className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                    <div className="flex items-end gap-[1.5px] h-2.5 sm:h-3 w-14 sm:w-18">
                      {[40, 75, 55, 90, 65, 30, 85, 100, 70, 45, 80, 60, 95, 50, 70, 85].map((h, i) => (
                        <span
                          key={i}
                          className="w-[2px] rounded-full bg-gradient-to-t from-cyan-500 to-sky-300 transition-all duration-200"
                          style={{
                            height: isPlaying ? `${Math.max(15, (h + (frameTick * 9 + i * 13) % 75))}%` : '20%',
                            opacity: isPlaying ? 0.95 : 0.4
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-zinc-400 text-[7px] sm:text-[8px] tracking-wider hidden xs:inline">
                      {isPlaying ? '48kHz' : 'IDLE'}
                    </span>
                  </div>
                </div>

                {/* Lower Third Typography (Sleek broadcast glass strap) */}
                <div className="inline-flex flex-col bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/15 shadow-xl max-w-full">
                  <h3 className="font-syne font-bold text-xs sm:text-sm text-white tracking-tight leading-tight truncate">
                    {selectedExperience.role}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] font-mono text-zinc-400 mt-0.5 truncate">
                    <span className="text-cyan-300 font-semibold">@{selectedExperience.shortLabel || selectedExperience.company}</span>
                    {selectedExperience.visualTags?.[0] && (
                      <>
                        <span className="text-zinc-600">•</span>
                        <span className="text-zinc-300 uppercase">{selectedExperience.visualTags[0]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* ── LOWER DECK: 3 HIGH-IMPACT STAT CARDS (CLEAN, PROPORTIONAL & PUNCHY) ── */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {selectedExperience.impactMetrics.map((metric, i) => {
              const isLong = metric.value.length > 7;
              const isMedium = metric.value.length > 4;
              return (
                <div
                  key={i}
                  className="p-2 sm:p-2.5 rounded-xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 relative overflow-hidden group/metric"
                >
                  <div
                    className="absolute top-0 inset-x-0 h-[2px] opacity-70 group-hover/metric:opacity-100 transition-opacity"
                    style={{ backgroundColor: selectedExperience.accentColor }}
                  />
                  <span
                    className={`font-syne font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-white leading-tight truncate max-w-full px-1 ${
                      isLong
                        ? 'text-xs xs:text-sm sm:text-base'
                        : isMedium
                        ? 'text-sm xs:text-base sm:text-lg md:text-xl'
                        : 'text-base xs:text-lg sm:text-xl md:text-2xl'
                    }`}
                    title={metric.value}
                  >
                    {metric.value}
                  </span>
                  <span className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] text-zinc-400 uppercase tracking-wider mt-1 truncate max-w-full font-medium">
                    {metric.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── QUICK MOBILE MILESTONE CUES NAVIGATION STRIP (VISIBLE ON < LG) ── */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono">
          <span className="text-zinc-500 shrink-0 text-[9px] uppercase tracking-wider pl-1">CUES:</span>
          {EXPERIENCES.map((exp) => (
            <button
              key={exp.id}
              type="button"
              onClick={() => handleSelectExperience(exp.id)}
              className={`px-2.5 py-1 rounded-md border shrink-0 transition-all ${
                selectedExpId === exp.id
                  ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'
                  : 'bg-zinc-950/90 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              {exp.shortLabel || exp.company}
            </button>
          ))}
        </div>

        {/* ── RIGHT PANE: THE NLE TIMELINE CONSOLE & MILESTONE DOSSIER ── */}
        <div className={layoutMode === 'studio' ? 'lg:col-span-6 flex flex-col space-y-2 sm:space-y-2.5' : 'w-full flex flex-col space-y-3'}>
          
          {/* NLE Timeline Console Frame */}
          <div className="nle-timeline-console rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            
            {/* NLE Transport Bar */}
            <div className="px-2.5 sm:px-3.5 py-2 bg-zinc-950/90 border-b border-white/10 flex items-center justify-between gap-1.5 flex-wrap">
              
              {/* Left: Transport Controls */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 bg-black/60 border border-white/10 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    title="Previous Milestone (J or ←)"
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <SkipBack className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={togglePlay}
                    title={isPlaying ? 'Pause Sequence (K or Space)' : 'Play Sequence (K or Space)'}
                    className={`flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-bold transition-all ${
                      isPlaying
                        ? 'bg-amber-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>PLAY</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    title="Next Milestone (L or →)"
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                {/* Live Timecode Readout */}
                <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 font-mono text-[9px] sm:text-[10px]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-red-500 animate-ping' : 'bg-red-500/80 shadow-[0_0_6px_#ef4444]'}`} />
                  <span className="text-zinc-400 font-bold hidden xs:inline">TC:</span>
                  <span className="text-white tracking-wider font-semibold">
                    {selectedExperience.timecode}
                  </span>
                  <span className="text-cyan-400/90 font-bold">({currentYear})</span>
                </div>
              </div>

              {/* Right: Sequence FPS & Track Legend */}
              <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono">
                <div className="hidden sm:flex items-center gap-1 text-zinc-400">
                  <Sliders className="w-3 h-3 text-cyan-400" />
                  <span>24 FPS</span>
                </div>

                <div className="flex items-center gap-1">
                  {TIMELINE_TRACKS.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 border border-white/5 text-[8px] sm:text-[9px]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
                      <span className="text-zinc-300 font-semibold">{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Visual Multi-Track Sequence Canvas */}
            <div className="p-2 sm:p-2.5 bg-black/60 select-none overflow-x-auto scrollbar-none">
              
              <div className="min-w-[460px] lg:min-w-0 w-full flex items-stretch">

                {/* Left Track Headers Column (Ruler, V2, V1, A1) */}
                <div className="w-12 sm:w-16 md:w-20 shrink-0 flex flex-col space-y-1 sm:space-y-1.5 pr-1.5 sm:pr-2 border-r border-white/10">
                  
                  {/* Ruler Track Header */}
                  <div className="h-7 sm:h-8 flex items-center justify-between px-1 sm:px-1.5 text-[9px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1 font-bold text-cyan-400">
                      <Clock className="w-2.5 h-2.5 text-cyan-400" />
                      <span className="hidden sm:inline">RULER</span>
                    </span>
                    <span className="text-[8px] hidden xs:inline">TIME</span>
                  </div>

                  {/* V2 Header (Top Video Layer: Brand Engagements) */}
                  <div className={`h-11 sm:h-13 md:h-14 flex flex-col justify-center px-1 sm:px-1.5 border rounded-lg font-mono transition-all duration-300 ${
                    selectedExperience.track === 'V2'
                      ? 'bg-sky-950/70 border-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/60'
                      : 'bg-zinc-950/80 border-white/5'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-bold text-sky-400">
                      <div className="flex items-center gap-1">
                        <span>V2</span>
                        {selectedExperience.track === 'V2' && (
                          <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
                        )}
                      </div>
                      <Film className="w-2.5 h-2.5 text-zinc-500 hidden sm:block" />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] sm:text-[8px] text-zinc-400 truncate">BRAND</span>
                      {selectedExperience.track === 'V2' && (
                        <span className="text-[7px] font-bold text-sky-300 bg-sky-900/80 px-0.5 rounded">ON</span>
                      )}
                    </div>
                  </div>

                  {/* V1 Header (Middle Layer: Executive Leadership) */}
                  <div className={`h-11 sm:h-13 md:h-14 flex flex-col justify-center px-1 sm:px-1.5 border rounded-lg font-mono transition-all duration-300 ${
                    selectedExperience.track === 'V1'
                      ? 'bg-indigo-950/70 border-indigo-400/90 shadow-[0_0_12px_rgba(129,140,248,0.35)] ring-1 ring-indigo-400/60'
                      : 'bg-zinc-950/80 border-white/5'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400">
                      <div className="flex items-center gap-1">
                        <span>V1</span>
                        {selectedExperience.track === 'V1' && (
                          <span className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />
                        )}
                      </div>
                      <Lock className="w-2.5 h-2.5 text-zinc-500 hidden sm:block" />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] sm:text-[8px] text-zinc-400 truncate">LEAD</span>
                      {selectedExperience.track === 'V1' && (
                        <span className="text-[7px] font-bold text-indigo-300 bg-indigo-900/80 px-0.5 rounded">ON</span>
                      )}
                    </div>
                  </div>

                  {/* A1 Header (Bottom Layer: Independent & Audio) */}
                  <div className={`h-11 sm:h-13 md:h-14 flex flex-col justify-center px-1 sm:px-1.5 border rounded-lg font-mono transition-all duration-300 ${
                    selectedExperience.track === 'A1'
                      ? 'bg-emerald-950/70 border-emerald-400/90 shadow-[0_0_12px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400/60'
                      : 'bg-zinc-950/80 border-white/5'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-bold text-emerald-400">
                      <div className="flex items-center gap-1">
                        <span>A1</span>
                        {selectedExperience.track === 'A1' && (
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <Disc className="w-2.5 h-2.5 text-zinc-500 hidden sm:block" />
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] sm:text-[8px] text-zinc-400 truncate">AUDIO</span>
                      {selectedExperience.track === 'A1' && (
                        <span className="text-[7px] font-bold text-emerald-300 bg-emerald-900/80 px-0.5 rounded">ON</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Right Interactive Sequence Track Canvas */}
                <div
                  ref={timelineTrackRef}
                  onMouseDown={handleTimelineMouseDown}
                  onTouchStart={handleTimelineTouchStart}
                  className="relative flex-1 pl-2 cursor-pointer flex flex-col space-y-1 sm:space-y-1.5"
                >
                  
                  {/* ── UNIFIED VERTICAL RED LASER PLAYHEAD & CAP (NO CLIPPING BUBBLE) ── */}
                  <div
                    className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75"
                    style={{ left: `${playheadPercent}%` }}
                  >
                    {/* Laser Line */}
                    <div className="w-[2px] h-full bg-red-500 shadow-[0_0_8px_#ef4444,0_0_18px_rgba(239,68,68,0.7)]" />
                    
                    {/* Playhead Cap over Ruler */}
                    <div className="nle-playhead-cap" />
                  </div>

                  {/* ── 1. Ruler Lane ── */}
                  <div className="nle-ruler relative h-7 sm:h-8 rounded border border-white/10 overflow-hidden">
                    {TIMELINE_SPAN.ticks.map((tick) => (
                      <div
                        key={tick.year}
                        className="absolute top-0 bottom-0 flex flex-col justify-between py-0.5 pointer-events-none"
                        style={{ left: `${tick.position}%` }}
                      >
                        <span className="text-[8px] sm:text-[9px] font-mono font-bold tracking-wider text-zinc-400 pl-1">
                          {tick.label}
                        </span>
                        <div className="w-[1px] h-2.5 bg-cyan-400/60" />
                      </div>
                    ))}
                  </div>

                  {/* ── 2. Track V2 (Brand Engagements: Arentech, Red Bull, Reliance - FULL VISIBILITY) ── */}
                  <div className="nle-track-lane relative h-11 sm:h-13 md:h-14 rounded-lg overflow-hidden border border-white/5">
                    {EXPERIENCES.filter((e) => e.track === 'V2').map((exp) => {
                      const isSelected = selectedExpId === exp.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectExperience(exp.id);
                          }}
                          title={`${exp.company} — ${exp.role} (${exp.durationLabel})`}
                          className={`nle-clip nle-video-filmstrip flex flex-col justify-between p-1 sm:p-1.5 border transition-all ${
                            isSelected
                              ? 'nle-clip--active ring-2 ring-sky-400 border-sky-400 bg-sky-950/90 shadow-[0_0_20px_rgba(56,189,248,0.5)]'
                              : 'border-white/10 bg-zinc-900/90 hover:border-white/30'
                          }`}
                          style={{
                            left: `${exp.trackStartPercent}%`,
                            width: `${exp.trackWidthPercent}%`,
                            color: exp.accentColor
                          }}
                        >
                          {/* Top Row: Full-width company label without premature truncation */}
                          <div className="flex items-center justify-between gap-1 min-w-0">
                            <span className="font-syne font-bold text-[10px] sm:text-[11px] text-white truncate tracking-tight">
                              {exp.shortLabel || exp.company}
                            </span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                            )}
                          </div>
                          
                          {/* Bottom Row: Duration and Badge */}
                          <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-zinc-400 gap-1 overflow-hidden mt-auto">
                            <span className="text-zinc-300 font-medium truncate">{exp.durationLabel}</span>
                            <span className="font-bold shrink-0 opacity-90 hidden xs:inline" style={{ color: exp.accentColor }}>
                              {exp.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── 3. Track V1 (Executive Leadership: Vishwa Vinayak) ── */}
                  <div className="nle-track-lane relative h-11 sm:h-13 md:h-14 rounded-lg overflow-hidden border border-white/5">
                    {EXPERIENCES.filter((e) => e.track === 'V1').map((exp) => {
                      const isSelected = selectedExpId === exp.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectExperience(exp.id);
                          }}
                          title={`${exp.company} — ${exp.role} (${exp.durationLabel})`}
                          className={`nle-clip nle-video-filmstrip flex flex-col justify-between p-1 sm:p-1.5 border transition-all ${
                            isSelected
                              ? 'nle-clip--active ring-2 ring-indigo-400 border-indigo-400 bg-indigo-950/90 shadow-[0_0_20px_rgba(129,140,248,0.5)]'
                              : 'border-white/10 bg-zinc-900/90 hover:border-white/30'
                          }`}
                          style={{
                            left: `${exp.trackStartPercent}%`,
                            width: `${exp.trackWidthPercent}%`,
                            color: exp.accentColor
                          }}
                        >
                          <div className="flex items-center justify-between gap-1 overflow-hidden">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-syne font-bold text-[10px] sm:text-[11px] text-white truncate">
                                {exp.company}
                              </span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <span className="font-mono text-[7px] sm:text-[8px] px-1.5 py-0.2 rounded bg-black/70 text-cyan-300 font-bold shrink-0">
                              {exp.durationLabel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-zinc-300 gap-1 overflow-hidden mt-auto">
                            <span className="truncate">{exp.role}</span>
                            <span className="font-bold shrink-0 text-indigo-300">{exp.badge}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ── 4. Track A1 (Independent & Creative: Freelance) ── */}
                  <div className="nle-track-lane relative h-11 sm:h-13 md:h-14 rounded-lg overflow-hidden border border-white/5">
                    {EXPERIENCES.filter((e) => e.track === 'A1').map((exp) => {
                      const isSelected = selectedExpId === exp.id;
                      return (
                        <div
                          key={exp.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectExperience(exp.id);
                          }}
                          title={`${exp.company} — ${exp.role} (${exp.durationLabel})`}
                          className={`nle-clip nle-audio-waveform flex flex-col justify-between p-1 sm:p-1.5 border transition-all ${
                            isSelected
                              ? 'nle-clip--active ring-2 ring-emerald-400 border-emerald-400 bg-emerald-950/90 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                              : 'border-white/10 bg-zinc-900/90 hover:border-white/30'
                          }`}
                          style={{
                            left: `${exp.trackStartPercent}%`,
                            width: `${exp.trackWidthPercent}%`,
                            color: exp.accentColor
                          }}
                        >
                          <div className="flex items-center justify-between gap-1 overflow-hidden">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-syne font-bold text-[10px] sm:text-[11px] text-white truncate">
                                {exp.company}
                              </span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                              )}
                            </div>
                            <span className="font-mono text-[7px] sm:text-[8px] px-1.5 py-0.2 rounded bg-black/70 text-emerald-300 font-bold shrink-0">
                              {exp.durationLabel}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[7px] sm:text-[8px] font-mono text-zinc-300 gap-1 overflow-hidden mt-auto">
                            <span className="truncate">{exp.role}</span>
                            <span className="font-bold shrink-0 text-emerald-300">{exp.badge}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ── ACTIVE MILESTONE DOSSIER & SPEC LOG CARD (POLISHED & HARMONIZED) ── */}
          <div className="rounded-2xl bg-zinc-950/80 border border-white/10 p-3 sm:p-3.5 backdrop-blur-xl shadow-xl space-y-2">
            
            {/* Dossier Header */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedExperience.logoImage ? (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-black/80 border border-white/15 p-1 flex items-center justify-center shrink-0 shadow-sm">
                    <img
                      src={selectedExperience.logoImage}
                      alt={selectedExperience.company}
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                    <Film className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-syne font-bold text-xs sm:text-sm text-white truncate leading-tight">
                    {selectedExperience.role}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono text-zinc-400 mt-0.5">
                    <span className="text-cyan-400 font-semibold">{selectedExperience.company}</span>
                    <span>•</span>
                    <span>{selectedExperience.timelinePosition}</span>
                  </div>
                </div>
              </div>

              {/* Track & Duration Badge */}
              <div className="flex flex-col items-end shrink-0">
                <span
                  className="font-mono text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                  style={{
                    backgroundColor: `${selectedExperience.accentColor}25`,
                    color: selectedExperience.accentColor,
                    border: `1px solid ${selectedExperience.accentColor}60`
                  }}
                >
                  {`TRACK ${selectedExperience.track} // ${selectedExperience.badge}`}
                </span>
                <span className="text-[8px] font-mono text-zinc-500 mt-0.5">
                  {selectedExperience.durationLabel}
                </span>
              </div>
            </div>

            {/* Core Mission (Clean 1-2 line impact statement) */}
            <p className="text-zinc-300 text-[11px] sm:text-xs font-sans leading-relaxed line-clamp-2">
              {selectedExperience.coreMission}
            </p>

            {/* Tools Stack and Full Specs Expander */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-wider text-zinc-500 uppercase font-medium select-none shrink-0">
                  Tools:
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedExperience.toolsUsed.map((tool) => (
                    <ToolIcon key={tool} tool={tool} />
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFullSpecs(!showFullSpecs)}
                className="text-[9px] sm:text-[10px] font-mono text-cyan-400 hover:text-cyan-300 px-2.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-1 transition-colors shrink-0"
              >
                <span>{showFullSpecs ? 'LESS' : 'FULL SPECS'}</span>
                {showFullSpecs ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
              </button>
            </div>

            {/* Expanded Full Specifications & Responsibilities Drawer */}
            {showFullSpecs && (
              <div className="pt-2 border-t border-white/10 space-y-2 text-[10px] sm:text-[11px] text-zinc-400 max-h-44 overflow-y-auto scrollbar-none animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Key Highlights:</span>
                  {selectedExperience.highlights?.map((hl, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 pl-1">
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-1 pt-1.5 border-t border-white/5">
                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">Responsibilities:</span>
                  {selectedExperience.responsibilities.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 pl-1">
                      <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
