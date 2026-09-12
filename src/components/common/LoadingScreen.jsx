import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Headphones } from 'lucide-react';
import sound from '../../utils/SoundEngine';
import AnimusPlexusVoid from './AnimusPlexusVoid';

// Curated Quotes across Film Editing, Cinematography & Social Media Management (SMM)
const CINEMATIC_QUOTES = [
  // Editorial
  {
    category: 'EDITORIAL RHYTHM',
    quote: 'Cutting is not just joining strips of celluloid; it is creating a rhythm, a heartbeat.',
    author: 'Walter Murch (Apocalypse Now, The Godfather III)',
  },
  {
    category: 'EDITORIAL MASTERY',
    quote: 'Editing is where movies are made or lost, made or destroyed.',
    author: 'Stanley Kubrick',
  },
  {
    category: 'EDITORIAL PHILOSOPHY',
    quote: "The essence of cinema is editing. It's the alchemy of emotion, pacing, and time.",
    author: 'Francis Ford Coppola',
  },
  {
    category: 'EDITORIAL CRAFT',
    quote: 'Good editing is invisible. Great editing is unforgettable.',
    author: 'Film Editor Maxim',
  },
  {
    category: 'EDITORIAL INTENTION',
    quote: 'Every cut is a choice between rhythm, story revelation, and raw human truth.',
    author: 'Michael Kahn, ACE',
  },

  // Cinematography
  {
    category: 'CINEMATOGRAPHY',
    quote: 'Cinematography is infinite possibilities, like the keys on a piano.',
    author: 'Roger Deakins, ASC, BSC (Blade Runner 2049, 1917)',
  },
  {
    category: 'CINEMATOGRAPHY & LIGHT',
    quote: 'Light makes photography. Light creates the mood, and the feeling is the lens of the soul.',
    author: 'Gordon Willis, ASC (The Godfather)',
  },
  {
    category: 'CINEMATOGRAPHY',
    quote: 'A film is never really good unless the camera is an eye in the head of a poet.',
    author: 'Orson Welles (Citizen Kane)',
  },
  {
    category: 'CINEMATOGRAPHY',
    quote: 'The camera is not merely an instrument to record reality, but to elevate it.',
    author: 'Vittorio Storaro, ASC, AIC (Apocalypse Now)',
  },
  {
    category: 'VISUAL LANGUAGE',
    quote: 'Framing is the architecture of human emotion on screen.',
    author: 'Emmanuel Lubezki, ASC, AMC (The Revenant)',
  },

  // Social Media Management & Viral Storytelling (SMM)
  {
    category: 'SOCIAL STRATEGY (SMM)',
    quote: 'In the first 3 seconds, you do not just grab attention — you earn the right to tell a story.',
    author: 'Digital Retention Principle',
  },
  {
    category: 'SOCIAL VIRALITY (SMM)',
    quote: 'Content is fire, social media is gasoline.',
    author: 'Jay Baer',
  },
  {
    category: 'SMM & RETENTION',
    quote: 'A great edit stops the thumb; a great story captures the soul.',
    author: 'Creative Director Maxim',
  },
  {
    category: 'MODERN MEDIA STRATEGY',
    quote: 'Algorithms reward retention, but human emotion demands frame-accurate rhythm.',
    author: 'Digital Filmmaker Codex',
  },
  {
    category: 'SOCIAL MEDIA CAMPAIGNS',
    quote: 'Social video is cinematic storytelling compressed into pulse-pounding velocity.',
    author: 'Full-Funnel Campaign Rule',
  },
];

/** Cinematic boot sequence: headphone prompt first, followed by loading sequence before entering. */
export default function LoadingScreen({ onComplete, onEnableSound, onStartSiteTransition }) {
  const [step, setStep] = useState('headphone'); // 'headphone' (first) | 'loading' (second)
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isDropCharging, setIsDropCharging] = useState(false);

  // Random Lower Third Quote selection (randomized per loading session)
  const [activeQuote] = useState(() => {
    const randomIndex = Math.floor(Math.random() * CINEMATIC_QUOTES.length);
    return CINEMATIC_QUOTES[randomIndex];
  });

  const onCompleteRef = useRef(onComplete);
  const onStartSiteTransitionRef = useRef(onStartSiteTransition);
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onStartSiteTransitionRef.current = onStartSiteTransition;
  }, [onComplete, onStartSiteTransition]);

  const hasStartedLoadingRef = useRef(false);
  const hasFinishedRef = useRef(false);

  // Trigger retro CRT television turn-on audio on mount strictly once
  const hasTvTurnedOnRef = useRef(false);
  useEffect(() => {
    if (step === 'headphone' && !hasTvTurnedOnRef.current) {
      hasTvTurnedOnRef.current = true;
      sound.playTvPowerOn();
    }
  }, [step]);

  // Loading progress bar: runs once user advances from the headphone screen
  useEffect(() => {
    if (step !== 'loading') return;
    if (hasStartedLoadingRef.current) return;
    hasStartedLoadingRef.current = true;

    // Trigger synchronized futuristic cyber loading audio STRICTLY ONCE
    sound.playFuturisticLoading();

    const minimumDuration = 3800;
    let animationFrame;
    let finishTimer;
    let transitionTimer;
    let completeTimer;
    const startedAt = Date.now();

    const finishLoading = () => {
      if (hasFinishedRef.current) return;
      hasFinishedRef.current = true;

      setProgress(100);
      setIsDropCharging(true);

      // Stop futuristic loading loop
      sound.stopFuturisticLoading(0.1);

      // Trigger cinematic sub-bass beat drop STRICTLY ONCE
      sound.playCinematicBeatDrop();

      // Transition into the site right on the sub-bass beat drop impact at exactly 1.10s!
      transitionTimer = window.setTimeout(() => {
        if (onStartSiteTransitionRef.current) onStartSiteTransitionRef.current();
        setIsLeaving(true);
        completeTimer = window.setTimeout(() => {
          if (onCompleteRef.current) onCompleteRef.current();
        }, 80);
      }, 1100);
    };

    const updateProgress = () => {
      const elapsed = Date.now() - startedAt;
      const calculated = Math.min(99, Math.floor((elapsed / minimumDuration) * 100));
      setProgress((prev) => Math.max(prev, calculated));

      if (elapsed < minimumDuration) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    animationFrame = window.requestAnimationFrame(updateProgress);
    finishTimer = window.setTimeout(finishLoading, minimumDuration);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(finishTimer);
      window.clearTimeout(transitionTimer);
      window.clearTimeout(completeTimer);
      sound.stopFuturisticLoading(0.1);
    };
  }, [step]);

  // Step 1: User clicks START on the Headphone screen -> Triggers Cyber Glitch Transition
  const handleStartFromHeadphones = useCallback((e) => {
    if (isGlitching) return;
    const clientX = e?.clientX;

    // Unmute & trigger futuristic click and cyber glitch sound effects
    sound.isMuted = false;
    sound.playFuturisticButtonClick(clientX);
    sound.playGlitch(clientX);
    sound.preloadGoldenHour().catch(() => {});
    setIsGlitching(true);

    // Advance to loading screen at 700ms when the visual glitch concludes
    window.setTimeout(() => {
      setStep('loading');
      setIsGlitching(false);
    }, 700);
  }, [isGlitching]);

  // Keyboard shortcut: Pressing 'Enter' triggers the button click immediately
  useEffect(() => {
    if (step !== 'headphone') return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStartFromHeadphones();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, handleStartFromHeadphones]);

  // FIRST PAGE: Headphone Disclaimer
  if (step === 'headphone') {
    return (
      <div
        className={`site-loader site-loader--disclaimer ${isGlitching ? 'site-loader--glitching' : ''}`}
        role="dialog"
        aria-labelledby="headphone-title"
      >
        <div className="site-loader__glow" />

        {/* Retro CRT Television Overlays */}
        <div className="site-loader__tv-vignette" aria-hidden="true" />
        <div className="site-loader__tv-scanlines" aria-hidden="true" />
        <div className="site-loader__tv-beam" aria-hidden="true" />
        <div className="site-loader__tv-flash" aria-hidden="true" />

        {/* Cinematic Cyber Glitch Overlay */}
        {isGlitching && (
          <div className="site-loader__glitch-overlay" aria-hidden="true">
            <div className="site-loader__glitch-scanlines" />
            <div className="site-loader__glitch-noise" />
            <div className="site-loader__glitch-slice site-loader__glitch-slice--1" />
            <div className="site-loader__glitch-slice site-loader__glitch-slice--2" />
            <div className="site-loader__glitch-slice site-loader__glitch-slice--3" />
            <div className="site-loader__glitch-bars" />
            <div className="site-loader__glitch-invert" />
            <div className="site-loader__glitch-flash" />
          </div>
        )}

        {/* The TV Screen Aperture that reveals content via CRT power-on */}
        <div className="site-loader__tv-screen">
          <div className="site-loader__disclaimer-content">
            <div className="site-loader__headphone-mark" aria-hidden="true">
              <Headphones strokeWidth={1.25} />
            </div>
            <p className="site-loader__eyebrow">A CINEMATIC EXPERIENCE AWAITS</p>
            <h1 id="headphone-title" className="site-loader__disclaimer-title">
              WEAR<br />HEADPHONES
            </h1>
            <p className="site-loader__disclaimer-copy">This portfolio is best experienced with sound on.</p>
            <button
              className="site-loader__continue"
              type="button"
              data-cursor="START"
              onMouseEnter={(e) => sound.playFuturisticButtonHover(e.clientX)}
              onClick={handleStartFromHeadphones}
              disabled={isGlitching}
            >
              {isGlitching ? 'SYNCING FRAME...' : 'START EXPERIENCE'} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <span className="site-loader__corner site-loader__corner--top-left" />
        <span className="site-loader__corner site-loader__corner--top-right" />
        <span className="site-loader__corner site-loader__corner--bottom-left" />
        <span className="site-loader__corner site-loader__corner--bottom-right" />
      </div>
    );
  }

  // SECOND PAGE: Rolling Into Frame (Progress Meter)
  return (
    <div
      className={`site-loader ${isLeaving ? 'site-loader--leaving' : ''} ${isDropCharging ? 'site-loader--charging-drop' : ''}`}
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="site-loader__glow" />

      {/* Retro CRT Television Overlays */}
      <div className="site-loader__tv-vignette" aria-hidden="true" />
      <div className="site-loader__tv-scanlines" aria-hidden="true" />

      {/* Assassin's Creed Animus Point-Cloud & Connecting Strings Web */}
      <AnimusPlexusVoid isCharging={isDropCharging} count={140} />

      <div className="site-loader__content">
        <p className="site-loader__eyebrow">RITIK SONI / CREATIVE PORTFOLIO</p>
        <h1 className="site-loader__title">
          ROLLING<br />INTO FRAME
        </h1>
        <div className="site-loader__meter" aria-hidden="true">
          <div className="site-loader__meter-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="site-loader__footer">
          <span>{isDropCharging ? 'ENTERING THE ANIMUS...' : 'INITIALIZING EXPERIENCE'}</span>
          <span>{String(progress).padStart(3, '0')}%</span>
        </div>
      </div>

      {/* Bottom-Left Clean Quote Text */}
      {activeQuote && (
        <div className="site-loader__corner-quote" role="note" aria-label="Cinematography and editing quote">
          <p className="site-loader__corner-quote-text">
            &ldquo;{activeQuote.quote}&rdquo;
          </p>
          <span className="site-loader__corner-quote-author">
            &mdash; {activeQuote.author}
          </span>
        </div>
      )}

      {/* Viewfinder Corner HUD Telemetry Text */}
      <CornerTelemetry isDropCharging={isDropCharging} />

      <span className="site-loader__corner site-loader__corner--top-left" />
      <span className="site-loader__corner site-loader__corner--top-right" />
      <span className="site-loader__corner site-loader__corner--bottom-left" />
      <span className="site-loader__corner site-loader__corner--bottom-right" />
    </div>
  );
}

/** Authentic Animus & Film Viewfinder Corner Telemetry (Top-Left & Bottom-Right) */
function CornerTelemetry({ isDropCharging = false }) {
  return (
    <>
      {/* 1. Top-Left Corner */}
      <div className="site-loader__corner-meta site-loader__corner-meta--top-left">
        <span className="site-loader__corner-tag">SYS // ANCESTRAL SYNC</span>
        <span className="site-loader__corner-sub">CORE: 0x7F4A-ANIMUS</span>
      </div>

      {/* 2. Bottom-Right Corner */}
      <div className="site-loader__corner-meta site-loader__corner-meta--bottom-right">
        <span className="site-loader__corner-tag">ABSTERGO // ANM-SYS</span>
        <span className="site-loader__corner-sub">
          RENDER: {isDropCharging ? 'SYNCHRONIZING' : 'REALTIME'}
        </span>
      </div>
    </>
  );
}