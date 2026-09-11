import React, { useState } from 'react';
import {
  Lightbulb,
  BookOpen,
  Camera,
  Scissors,
  Sparkles,
  Send,
  Film,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Video,
  Activity
} from 'lucide-react';
import sound from '../../utils/SoundEngine';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'IDEA',
    subtitle: 'Concept, Algorithm Strategy & Audience Psychology',
    icon: Lightbulb,
    accent: '#38bdf8',
    accentRgb: '56, 189, 248',
    details: 'Every impactful campaign starts with strategic intention. Before opening a timeline or turning on a camera, I dissect the core hook, algorithm positioning, and target audience psychology.',
    deliverable: 'Creative Brief & Content Architecture',
    metrics: ['RETENTION HOOK FRAMEWORK', 'TARGET AUDIENCE PROFILE', 'VIRALITY MATRIX'],
    focalLens: '24MM WIDE',
    telemetry: '0-3S RETENTION BLUEPRINT',
    stageCode: 'PRE-PROD // 01'
  },
  {
    step: '02',
    title: 'STORY',
    subtitle: 'Narrative Architecture & Emotional Pacing',
    icon: BookOpen,
    accent: '#818cf8',
    accentRgb: '129, 140, 248',
    details: 'Structuring the rise and fall of visual tension. Whether crafting a 30-second high-retention reel or a 4-minute corporate documentary, the story blueprint determines viewer retention.',
    deliverable: 'Storyboard & Script Breakdown',
    metrics: ['SCENE RHYTHM MAP', 'AUDIO-VISUAL STORYBOARD', 'BEAT TIMELINE'],
    focalLens: '35MM T1.4',
    telemetry: '3-ACT TENSION HARMONICS',
    stageCode: 'NARRATIVE // 02'
  },
  {
    step: '03',
    title: 'SHOOT',
    subtitle: 'Cinematography, Lighting & Composition',
    icon: Camera,
    accent: '#fbbf24',
    accentRgb: '251, 191, 36',
    details: 'Capturing deliberate frames with cinematic lighting ratios, focal length precision, and intentional camera movement that serves the emotional tone of the piece.',
    deliverable: '4K Raw Footage & Camera Logs',
    metrics: ['4K LOG CAPTURE', 'ANAMORPHIC FRAMING', 'DUAL-MIC FOLEY STEMS'],
    focalLens: '50MM ANAMORPHIC',
    telemetry: '4K DCI RAW • 4:1 RATIO',
    stageCode: 'CINEMA // 03'
  },
  {
    step: '04',
    title: 'EDIT',
    subtitle: 'Assembly, Micro-Pacing & Dynamic Flow',
    icon: Scissors,
    accent: '#34d399',
    accentRgb: '52, 211, 153',
    details: 'The heartbeat of filmmaking. Selecting the exact frame where energy transfers, trimming dead air, building rhythmic momentum, and cutting on motion to create hypnotic flow.',
    deliverable: 'Rough Cut & Director Picture Lock',
    metrics: ['FRAME-ACCURATE PACING', 'J-CUT / L-CUT DIALOGUE', 'SEAMLESS TRANSITIONS'],
    focalLens: '85MM T1.5',
    telemetry: 'FRAME-ACCURATE J/L OVERLAP',
    stageCode: 'EDITORIAL // 04'
  },
  {
    step: '05',
    title: 'REFINE',
    subtitle: 'Color Grading, Sound Design & Motion VFX',
    icon: Sparkles,
    accent: '#f472b6',
    accentRgb: '244, 114, 182',
    details: 'Elevating the sensory atmosphere. Sculpting deep cinematic contrast curves, applying rich LUTs, and layering multi-track foley sound design, impacts, and kinetic graphic elements.',
    deliverable: 'Master Color Graded & Mixed Stems',
    metrics: ['DAVINCI COLOR SCULPT', 'MULTI-STEM SOUND DESIGN', 'AFTER EFFECTS MOTION'],
    focalLens: '35MM MACRO',
    telemetry: 'DAVINCI DCI-P3 THEATRICAL',
    stageCode: 'FINISHING // 05'
  },
  {
    step: '06',
    title: 'GROW',
    subtitle: 'Multi-Platform Launch, Analytics & Growth',
    icon: Send,
    accent: '#a78bfa',
    accentRgb: '167, 139, 250',
    details: 'Exporting pristine masters calibrated for YouTube 4K, broadcast, and social vertical algorithms, paired with strategic thumbnail frameworks, hook timing, and analytics diagnostics.',
    deliverable: 'Master Package, Social Schedule & KPI Tracker',
    metrics: ['4K UHD MASTERS', 'VERTICAL 9:16 OPTIMIZATION', 'ALGORITHM DIAGNOSTICS'],
    focalLens: '135MM MASTER',
    telemetry: 'ALGORITHMIC VELOCITY',
    stageCode: 'DISTRIBUTION // 06'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// HIGH-FIDELITY 3D HOLOGRAPHIC VISUAL ARTIFACTS
// ─────────────────────────────────────────────────────────────────────────────

// 01 IDEA: Holographic Neural Core with Smooth Orbital Gimbals
const Idea3DWidget = ({ accent }) => (
  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-4 rounded-full blur-[40px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />

    {/* Outer Primary Orbital Track */}
    <div
      className="absolute inset-3 rounded-full border border-cyan-500/40 animate-[spin_22s_linear_infinite]"
      style={{ transform: 'rotateX(68deg) rotateZ(15deg)', transformStyle: 'preserve-3d' }}
    >
      <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_10px_#38bdf8]" />
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400/50" />
    </div>

    {/* Mid Elliptical Counter-Rotating Gimbal Ring */}
    <div
      className="absolute inset-8 rounded-full border border-sky-400/40 border-dashed animate-[spin_15s_linear_infinite_reverse]"
      style={{ transform: 'rotateY(60deg) rotateX(30deg)', transformStyle: 'preserve-3d' }}
    >
      <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-200 shadow-[0_0_8px_#38bdf8]" />
    </div>

    {/* Inner Precision Polar Ring */}
    <div
      className="absolute inset-14 rounded-full border border-white/20 animate-[spin_9s_linear_infinite]"
      style={{ transform: 'rotateZ(45deg)' }}
    />

    {/* Holographic Core Sphere */}
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-300 via-sky-500 to-sky-900 flex items-center justify-center shadow-[0_0_26px_rgba(56,189,248,0.55)] animate-pulse">
      <div className="w-6 h-6 rounded-full bg-zinc-950/80 flex items-center justify-center border border-cyan-300/50">
        <div className="w-2 h-2 rounded-full bg-cyan-100 shadow-[0_0_8px_#38bdf8]" />
      </div>
    </div>

    {/* Geometric Constellation Reticle Lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
      <line x1="15%" y1="25%" x2="50%" y2="50%" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="85%" y1="20%" x2="50%" y2="50%" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="25%" y1="80%" x2="50%" y2="50%" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="80%" y1="80%" x2="50%" y2="50%" stroke="rgba(56,189,248,0.5)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="15%" cy="25%" r="2.5" fill="#38bdf8" />
      <circle cx="85%" cy="20%" r="2.5" fill="#38bdf8" />
      <circle cx="25%" cy="80%" r="2.5" fill="#38bdf8" />
      <circle cx="80%" cy="80%" r="2.5" fill="#38bdf8" />
    </svg>
  </div>
);

// 02 STORY: 3D Storyboard Sequence Stack
const Story3DWidget = ({ accent }) => (
  <div className="relative w-60 h-44 sm:w-72 sm:h-52 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-2 rounded-3xl blur-[35px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />
    {/* Back Layer Frame */}
    <div
      className="absolute w-44 sm:w-52 aspect-[16/9] rounded-xl bg-zinc-950/80 border border-white/10 shadow-xl"
      style={{ transform: 'translate3d(-25px, -20px, -40px) rotateY(-10deg)', opacity: 0.4 }}
    />
    {/* Mid Layer Frame */}
    <div
      className="absolute w-48 sm:w-56 aspect-[16/9] rounded-xl bg-zinc-950/90 border border-indigo-500/30 p-2 shadow-xl"
      style={{ transform: 'translate3d(18px, -8px, -20px) rotateY(6deg)', opacity: 0.7 }}
    />
    {/* Front 2.39:1 Anamorphic Frame */}
    <div
      className="relative w-52 sm:w-64 aspect-[2.39/1] rounded-xl bg-zinc-950/95 border border-indigo-400/70 p-2.5 shadow-2xl backdrop-blur-md flex flex-col justify-between"
      style={{ transform: 'translateZ(20px)' }}
    >
      <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400 border-b border-white/10 pb-1">
        <span className="text-indigo-300 font-bold">2.39:1 DCI SCOPE</span>
        <span className="text-white">00:01:24:18</span>
      </div>
      <div className="w-full h-10 flex items-center">
        <svg className="w-full h-full" viewBox="0 0 220 50" preserveAspectRatio="none">
          <path d="M 0,38 Q 60,32 90,16 T 150,10 T 220,28" fill="none" stroke="#818cf8" strokeWidth="2.5" />
          <circle cx="150" cy="10" r="3.5" fill="#fff" stroke="#818cf8" strokeWidth="2" />
        </svg>
      </div>
      <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500 pt-1 border-t border-white/10">
        <span>3-ACT BLUEPRINT</span>
        <span className="text-indigo-400 font-semibold">TENSION CLIMAX</span>
      </div>
    </div>
  </div>
);

// 03 SHOOT: Stylized Cinema Lens Apparatus
const Shoot3DWidget = ({ accent }) => (
  <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-4 rounded-full blur-[35px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />
    {/* Outer Metallic Lens Barrel */}
    <div className="absolute inset-3 rounded-full border-2 border-amber-500/40 flex items-center justify-center shadow-[inset_0_0_25px_rgba(251,191,36,0.15)]">
      <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_35s_linear_infinite]" />
      <span className="absolute top-1.5 font-mono text-[8px] text-amber-400 font-bold tracking-wider">50MM T1.4 ANAMORPHIC</span>
      <span className="absolute bottom-1.5 font-mono text-[8px] text-zinc-500">4K DCI RAW FORMAT</span>
    </div>
    {/* Optical Glass Element with Flare */}
    <div className="absolute inset-10 rounded-full border border-amber-400/50 bg-gradient-to-br from-amber-500/15 via-zinc-950/85 to-sky-500/10 flex items-center justify-center overflow-hidden">
      <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_10px_#fbbf24] animate-pulse" />
      <div className="relative w-14 h-14 border-2 border-amber-400 rounded-lg rotate-45 flex items-center justify-center bg-black/60 shadow-[0_0_20px_rgba(251,191,36,0.45)]">
        <div className="w-5 h-5 rounded-full bg-amber-400/80 blur-[1px]" />
      </div>
    </div>
    {/* Viewfinder Target Reticle */}
    <div className="w-10 h-10 border border-amber-400/80 relative flex items-center justify-center pointer-events-none">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
    </div>
  </div>
);

// 04 EDIT: Magnetic Multi-Track Timeline
const Edit3DWidget = ({ accent }) => (
  <div className="relative w-60 h-44 sm:w-72 sm:h-52 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-2 rounded-2xl blur-[35px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />
    <div
      className="relative w-full rounded-2xl bg-zinc-950/95 border border-emerald-500/40 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden"
      style={{ transform: 'perspective(700px) rotateX(12deg) rotateY(-4deg)' }}
    >
      <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400 border-b border-white/10 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-300 font-bold">TIMELINE // 24.00 FPS</span>
        </div>
        <span className="text-white font-semibold">00:04:12:08</span>
      </div>
      <div className="space-y-1.5 font-mono text-[8px]">
        <div className="h-5 rounded bg-zinc-900 border border-white/10 flex items-center px-2 gap-1.5">
          <span className="text-zinc-500 font-bold">V1</span>
          <div className="w-20 h-3.5 rounded bg-emerald-950 border border-emerald-400/50 flex items-center px-1.5 text-emerald-200 truncate font-medium">
            HERO_CUT
          </div>
          <div className="w-28 h-3.5 rounded bg-emerald-900/80 border border-emerald-400/60 flex items-center px-1.5 text-white truncate font-medium">
            MOTION_PACING
          </div>
        </div>
        <div className="h-6 rounded bg-zinc-900 border border-white/10 flex items-center px-2 gap-1.5">
          <span className="text-zinc-500 font-bold">A1</span>
          <svg className="w-full h-4" viewBox="0 0 240 16" preserveAspectRatio="none">
            <path d="M 0,8 Q 12,2 24,8 T 48,14 T 72,8 T 96,3 T 120,13 T 144,8 T 168,2 T 192,14 T 216,8 T 240,8" fill="none" stroke="#34d399" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-400 shadow-[0_0_10px_#34d399]" style={{ left: '46%' }} />
      <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500 pt-1.5 border-t border-white/10 mt-1.5">
        <span>PICTURE LOCK</span>
        <span className="text-emerald-400 font-semibold">MAGNETIC J/L CUT</span>
      </div>
    </div>
  </div>
);

// 05 REFINE: DaVinci 3-Way Color Wheels
const Refine3DWidget = ({ accent }) => (
  <div className="relative w-60 h-44 sm:w-72 sm:h-52 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-2 rounded-2xl blur-[35px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />
    <div
      className="relative w-full rounded-2xl bg-zinc-950/95 border border-pink-500/40 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between"
      style={{ transform: 'perspective(700px) rotateX(10deg) rotateY(3deg)' }}
    >
      <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400 border-b border-white/10 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
          <span className="text-pink-300 font-bold">DAVINCI 3-WAY GRADE</span>
        </div>
        <span className="text-white">REC.709 DCI-P3</span>
      </div>
      <div className="grid grid-cols-3 gap-2 my-1">
        {/* Lift */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/20 p-1 flex items-center justify-center bg-zinc-900">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-900/60 to-pink-900/40 flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] translate-x-0.5 -translate-y-0.5" />
            </div>
          </div>
          <span className="font-mono text-[8px] text-cyan-300 font-bold">LIFT</span>
        </div>
        {/* Gamma */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-pink-500/50 p-1 flex items-center justify-center bg-zinc-900 shadow-[0_0_12px_rgba(244,114,182,0.3)]">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-950 to-zinc-950 flex items-center justify-center relative">
              <div className="w-3 h-3 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
            </div>
          </div>
          <span className="font-mono text-[8px] text-pink-300 font-bold">GAMMA</span>
        </div>
        {/* Gain */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/20 p-1 flex items-center justify-center bg-zinc-900">
            <div className="w-full h-full rounded-full bg-gradient-to-bl from-amber-900/60 to-pink-900/40 flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_#fbbf24] -translate-x-0.5 translate-y-0.5" />
            </div>
          </div>
          <span className="font-mono text-[8px] text-amber-300 font-bold">GAIN</span>
        </div>
      </div>
      <div className="flex items-center justify-between font-mono text-[8px] text-zinc-500 pt-1.5 border-t border-white/10 mt-1">
        <span>35MM FILM CURVE</span>
        <span className="text-pink-400 font-semibold">48KHZ FOLEY STEMS</span>
      </div>
    </div>
  </div>
);

// 06 GROW: Exponential Analytics & Reach Curve
const Grow3DWidget = ({ accent }) => (
  <div className="relative w-60 h-44 sm:w-72 sm:h-52 flex items-center justify-center">
    {/* Ambient Glow Aura */}
    <div
      className="absolute inset-2 rounded-2xl blur-[35px] opacity-[0.20] pointer-events-none transition-all duration-700"
      style={{ backgroundColor: accent }}
    />
    <div
      className="relative w-full rounded-2xl bg-zinc-950/95 border border-purple-500/40 p-3 shadow-2xl backdrop-blur-md flex flex-col justify-between overflow-hidden"
      style={{ transform: 'perspective(700px) rotateX(12deg) rotateY(-5deg)' }}
    >
      <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400 border-b border-white/10 pb-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span className="text-purple-300 font-bold">VIRAL VELOCITY</span>
        </div>
        <span className="text-white font-bold">1M+ REACH</span>
      </div>
      <div className="relative w-full h-16 flex items-end">
        <svg className="w-full h-full" viewBox="0 0 240 70" preserveAspectRatio="none">
          <path d="M 0,65 Q 80,62 130,45 T 190,18 T 240,4 L 240,70 L 0,70 Z" fill="rgba(167, 139, 250, 0.25)" />
          <path d="M 0,65 Q 80,62 130,45 T 190,18 T 240,4" fill="none" stroke="#a78bfa" strokeWidth="2.5" />
          <circle cx="130" cy="45" r="3" fill="#818cf8" />
          <circle cx="190" cy="18" r="3.5" fill="#a78bfa" />
          <circle cx="240" cy="4" r="4" fill="#ffffff" className="animate-ping" />
          <circle cx="240" cy="4" r="4" fill="#ffffff" />
        </svg>
      </div>
      <div className="flex items-center justify-between font-mono text-[8px] text-zinc-400 pt-1.5 border-t border-white/10 mt-1">
        <span className="text-purple-300 font-semibold">4K & 9:16 VERTICAL</span>
        <span className="text-white font-bold">MAX RETENTION</span>
      </div>
    </div>
  </div>
);

const render3DWidget = (stepIndex, accent) => {
  switch (stepIndex) {
    case 0:
      return <Idea3DWidget accent={accent} />;
    case 1:
      return <Story3DWidget accent={accent} />;
    case 2:
      return <Shoot3DWidget accent={accent} />;
    case 3:
      return <Edit3DWidget accent={accent} />;
    case 4:
      return <Refine3DWidget accent={accent} />;
    case 5:
      return <Grow3DWidget accent={accent} />;
    default:
      return <Idea3DWidget accent={accent} />;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PROCESS SECTION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ProcessSection = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const activeStep = PROCESS_STEPS[activeStepIndex];
  const StepIcon = activeStep.icon;

  const handleStepSelect = (idx) => {
    sound.playLensClick();
    setActiveStepIndex(idx);
  };

  const handlePrev = () => {
    sound.playLensClick();
    setActiveStepIndex((prev) => (prev > 0 ? prev - 1 : PROCESS_STEPS.length - 1));
  };

  const handleNext = () => {
    sound.playLensClick();
    setActiveStepIndex((prev) => (prev < PROCESS_STEPS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="process" className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      
      {/* Section Header */}
      <div className="mb-10 pb-6 border-b border-white/10 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-2.5">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>SCENE 04 // CREATIVE ARCHITECTURE</span>
          </div>
          <h2 className="font-syne font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
            HOW I SEE{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-amber-300">
              A STORY
            </span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 max-w-2xl font-light">
            Visual storytelling is not an accident of software—it is a disciplined, 6-stage sequence from initial psychological hook to master delivery.
          </p>
        </div>

        {/* Live Camera Viewfinder Telemetry */}
        <div className="flex items-center gap-2 font-mono text-xs self-start md:self-auto">
          <div className="flex items-center gap-2 bg-zinc-950/90 border border-white/10 px-3 py-1.5 rounded-xl">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            <div className="text-right">
              <span className="text-[8px] text-zinc-500 uppercase block leading-none">FOCAL LENS</span>
              <span className="text-[10px] sm:text-xs font-bold text-white tracking-wide">{activeStep.focalLens}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-zinc-950/90 border border-white/10 px-3 py-1.5 rounded-xl text-zinc-400">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeStep.accent }} />
            <span className="text-[10px] font-bold text-white uppercase">{activeStep.telemetry}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Interactive Timeline Scrubber */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none w-full">
          {PROCESS_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStepIndex === idx;

            return (
              <React.Fragment key={step.step}>
                <button
                  type="button"
                  onClick={() => handleStepSelect(idx)}
                  data-cursor="SELECT"
                  className={`flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-2.5 rounded-xl sm:rounded-2xl border font-mono text-xs transition-all duration-300 min-w-[125px] sm:min-w-[140px] lg:min-w-0 lg:flex-1 focus:outline-none cursor-pointer ${
                    isActive
                      ? 'bg-zinc-900 border text-white shadow-lg ring-1 scale-105 z-10'
                      : 'bg-zinc-950/80 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 hover:border-white/25'
                  }`}
                  style={{
                    borderColor: isActive ? step.accent : undefined,
                    boxShadow: isActive ? `0 0 15px rgba(${step.accentRgb}, 0.3)` : undefined
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-transform"
                    style={{ backgroundColor: `${step.accent}25` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: step.accent }} />
                  </div>
                  <span className="text-[10px] text-zinc-500 font-semibold">{step.step}</span>
                  <span className="font-bold tracking-wider truncate">{step.title}</span>
                </button>

                {/* Connecting Step Progression Arrow */}
                {idx < PROCESS_STEPS.length - 1 && (
                  <div className="flex items-center justify-center shrink-0 px-0.5 sm:px-1">
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-all duration-300 ${
                        activeStepIndex > idx
                          ? 'drop-shadow-[0_0_6px_rgba(56,189,248,0.7)]'
                          : activeStepIndex === idx
                          ? 'animate-pulse'
                          : 'text-zinc-700'
                      }`}
                      style={{
                        color:
                          activeStepIndex > idx
                            ? PROCESS_STEPS[idx].accent
                            : activeStepIndex === idx
                            ? activeStep.accent
                            : undefined
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Dynamic Timeline Scrubber Progress Line */}
        <div className="hidden lg:block relative w-full h-1 bg-zinc-900 rounded-full mt-3 overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-cyan-400 transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
            style={{ width: `${((activeStepIndex + 1) / PROCESS_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── SEAMLESS OPTIMIZED CONSOLE CARD ── */}
      <div className="relative w-full">
        <div
          key={activeStep.step}
          className="relative rounded-3xl bg-zinc-950 p-6 sm:p-8 lg:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden animate-fadeIn"
        >
          {/* Ambient Diagram Side Glow (Vibrant Intensity) */}
          <div
            className="absolute top-1/2 -right-12 -translate-y-1/2 w-[440px] h-[440px] rounded-full blur-[130px] pointer-events-none opacity-[0.25] transition-all duration-700"
            style={{ backgroundColor: activeStep.accent }}
          />

          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 mb-6 gap-3 text-xs font-mono relative z-20">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-cyan-300 font-mono text-[11px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeStep.accent }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: activeStep.accent }} />
                </span>
                <span>{`PHASE ${activeStep.step} // ACTIVE PIPELINE`}</span>
              </span>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="text-zinc-400 font-medium">{activeStep.telemetry}</span>
            </div>

            {/* Prev / Next Fast Step Navigation */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrev}
                aria-label="Previous Phase"
                className="p-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-zinc-400 px-1 font-mono text-[11px]">
                0{activeStepIndex + 1} / 0{PROCESS_STEPS.length}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next Phase"
                className="p-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── CENTER GRID: STORY OVERVIEW (LEFT) + SEAMLESS 3D HOLOGRAPHIC VIEW (RIGHT) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-20">
            
            {/* Left Column: Stage Identity, Narrative & Benchmarks (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                {/* Title & Badge */}
                <div className="flex items-center gap-3.5 mb-2.5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border"
                    style={{
                      backgroundColor: `${activeStep.accent}15`,
                      borderColor: `${activeStep.accent}40`
                    }}
                  >
                    <StepIcon className="w-5 h-5" style={{ color: activeStep.accent }} />
                  </div>
                  <div>
                    <h3 className="font-syne font-black text-3xl sm:text-4xl text-white tracking-tight leading-none">
                      {activeStep.title}
                    </h3>
                  </div>
                </div>

                {/* Subtitle */}
                <p className="font-mono text-xs sm:text-sm tracking-wide font-semibold mb-3" style={{ color: activeStep.accent }}>
                  {activeStep.subtitle}
                </p>

                {/* Main Description */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-light">
                  {activeStep.details}
                </p>
              </div>

              {/* Critical Benchmarks (Neutral Dark Surface - No Color Wash) */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-3.5 sm:p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeStep.accent }} />
                    Critical Benchmarks
                  </span>
                  <span className="font-mono text-[9px] text-zinc-500">STAGE VERIFICATION</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeStep.metrics.map((metric) => (
                    <div
                      key={metric}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: activeStep.accent }} />
                      <span className="truncate">{metric}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stage Deliverable Highlight Bar */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider">STAGE DELIVERABLE:</span>
                </div>
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-black/80 border text-xs font-semibold text-white shadow-md self-start sm:self-auto"
                  style={{
                    borderColor: `${activeStep.accent}60`,
                    boxShadow: `0 0 16px -4px rgba(${activeStep.accentRgb}, 0.3)`
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: activeStep.accent }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: activeStep.accent }} />
                  </span>
                  <span>{activeStep.deliverable}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Seamless 3D Holographic Projection Stage (5 Cols) */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-zinc-950/80 border border-white/5 backdrop-blur-sm min-h-[300px] sm:min-h-[340px] overflow-hidden">
              
              {/* Stage Backlight Glow */}
              <div
                className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full blur-[60px] opacity-[0.22] pointer-events-none transition-all duration-700"
                style={{ backgroundColor: activeStep.accent }}
              />

              {/* Subtle Holographic Grid Texture */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

              {/* Telemetry Header */}
              <div className="w-full flex items-center justify-between font-mono text-[9px] text-zinc-500 pb-2 border-b border-white/10 mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: activeStep.accent }} />
                  <span className="text-zinc-300 font-bold tracking-wider">3D HOLOGRAPHIC VIEW</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-zinc-900/80 border border-white/10 text-white font-semibold">
                  {activeStep.focalLens}
                </span>
              </div>

              {/* Center 3D Interactive Visual Artifact */}
              <div className="my-auto py-2 w-full flex items-center justify-center relative z-10">
                {render3DWidget(activeStepIndex, activeStep.accent)}
              </div>

              {/* Target Readout Footer */}
              <div className="w-full flex items-center justify-between font-mono text-[9px] text-zinc-400 pt-2 border-t border-white/10 mt-2 relative z-10">
                <span className="tracking-wide">TARGET: <strong className="text-white">{activeStep.title}</strong></span>
                <span className="inline-flex items-center gap-1.5 font-bold tracking-wider" style={{ color: activeStep.accent }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: activeStep.accent }} />
                  CALIBRATED
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};

export default ProcessSection;
