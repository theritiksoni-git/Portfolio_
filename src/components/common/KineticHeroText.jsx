import React, { useState, useEffect, useRef, useCallback } from 'react';
import sound from '../../utils/SoundEngine';

/**
 * Choreographed sequence of letter transformations.
 * In "RITIK SONI", indices:
 * 0:R, 1:I, 2:T, 3:I, 4:K, 5:S, 6:O, 7:N, 8:I
 *
 * Starts with 'N' (index 7) to directly match the user's reference screenshot ("SOUND?"),
 * followed by cinematic rotations across other iconic letters.
 */
const DEFAULT_SEQUENCE = [
  { indices: [7], theme: 'red', duration: 2800 },    // 'N' in 'SONI' (Direct match to reference)
  { indices: [2], theme: 'red', duration: 2500 },    // 'T' in 'RITIK'
  { indices: [6], theme: 'red', duration: 2600 },    // 'O' in 'SONI'
  { indices: [4], theme: 'red', duration: 2400 },    // 'K' in 'RITIK'
  { indices: [3, 7], theme: 'red', duration: 3000 }, // 'I' & 'N' (Dual transformation)
  { indices: [5], theme: 'red', duration: 2500 },    // 'S' in 'SONI'
  { indices: [0], theme: 'red', duration: 2600 },    // 'R' in 'RITIK'
  { indices: [1, 6], theme: 'red', duration: 2800 }, // 'I' & 'O'
];

/**
 * Individual Kinetic Letter Roller Cell
 * Uses a 3-slot vertical tape [Solid, Outline, Solid] for seamless continuous rotation.
 */
function KineticLetter({
  char,
  index,
  isTargetOutlined,
  outlineTheme = 'red',
  onHoverSound,
}) {
  // Step 0: Solid (0%), Step 1: Outline (-33.333%), Step 2: Next Solid (-66.666%)
  const [step, setStep] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const prevOutlinedRef = useRef(false);

  const shouldBeOutlined = isTargetOutlined || isHovered;

  useEffect(() => {
    if (shouldBeOutlined && !prevOutlinedRef.current) {
      // Roll forward from Solid (Slot 1) to Outline (Slot 2)
      setTransitionEnabled(true);
      setStep(1);
    } else if (!shouldBeOutlined && prevOutlinedRef.current) {
      // Roll forward from Outline (Slot 2) to Next Solid (Slot 3)
      setTransitionEnabled(true);
      setStep(2);
    }
    prevOutlinedRef.current = shouldBeOutlined;
  }, [shouldBeOutlined]);

  // Handle transition end for seamless infinite continuous rolling
  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;

    if (step === 2) {
      // Instantly reset from Slot 3 (-66.666%) back to Slot 1 (0%) without animation
      setTransitionEnabled(false);
      setStep(0);

      // Re-enable transition on the next animation frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  };

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (onHoverSound) onHoverSound();
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const getTranslateY = () => {
    if (step === 0) return '0%';
    if (step === 1) return '-33.333333%';
    if (step === 2) return '-66.666666%';
    return '0%';
  };

  const themeClass = outlineTheme === 'cyan' 
    ? 'outline-cyan' 
    : outlineTheme === 'white' 
    ? 'outline-white' 
    : '';

  return (
    <span
      className="kinetic-letter-cell"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={`${char} (Interactive Kinetic Letter)`}
    >
      <span
        className="kinetic-letter-roller"
        style={{
          transform: `translateY(${getTranslateY()})`,
          transition: transitionEnabled
            ? 'transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Slot 1: Default Solid White with CRT phosphor scanline effect */}
        <span className="kinetic-glyph kinetic-glyph-solid">
          {char}
        </span>

        {/* Slot 2: Hollow Razor-Sharp Crimson Outline (Reference Screenshot) */}
        <span className={`kinetic-glyph kinetic-glyph-outline ${themeClass}`}>
          {char}
        </span>

        {/* Slot 3: Target Solid Letter for continuous forward roll */}
        <span className="kinetic-glyph kinetic-glyph-solid">
          {char}
        </span>
      </span>
    </span>
  );
}

/**
 * Main KineticHeroText Component
 */
export default function KineticHeroText({
  text = 'RITIK SONI',
  className = '',
  outlineTheme = 'red',
  autoPlay = true,
  interval = 4000,
}) {
  const [activeIndices, setActiveIndices] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(outlineTheme);
  const seqIndexRef = useRef(0);
  const timerRef = useRef(null);
  const holdTimerRef = useRef(null);

  // Play sound on interactive hover
  const handleHoverSound = useCallback(() => {
    try {
      if (sound && typeof sound.playHover === 'function') {
        sound.playHover();
      }
    } catch {}
  }, []);

  // Split text into words and characters with absolute indices
  const words = text.split(' ');
  let runningIndex = 0;
  const parsedWords = words.map((word) => {
    const letters = word.split('').map((char) => {
      const idx = runningIndex++;
      return { char, index: idx };
    });
    // Count the space character for sequence indexing
    runningIndex++;
    return letters;
  });

  // Choreographed rolling loop
  useEffect(() => {
    if (!autoPlay) return;

    let isMounted = true;

    const runSequenceStep = () => {
      const currentItem = DEFAULT_SEQUENCE[seqIndexRef.current % DEFAULT_SEQUENCE.length];
      
      if (!isMounted) return;
      setActiveIndices(currentItem.indices);
      if (currentItem.theme) setCurrentTheme(currentItem.theme);

      // Hold in outline state
      holdTimerRef.current = setTimeout(() => {
        if (!isMounted) return;
        // Release back to solid
        setActiveIndices([]);

        // Rest pause before next letter begins
        timerRef.current = setTimeout(() => {
          if (!isMounted) return;
          seqIndexRef.current = (seqIndexRef.current + 1) % DEFAULT_SEQUENCE.length;
          runSequenceStep();
        }, 1600);
      }, currentItem.duration || 2600);
    };

    // Initial delay after page load (2.2 seconds) before first transformation begins
    timerRef.current = setTimeout(() => {
      runSequenceStep();
    }, 2200);

    return () => {
      isMounted = false;
      if (timerRef.current) clearTimeout(timerRef.current);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [autoPlay, text]);

  return (
    <span className={`kinetic-hero-wrapper ${className}`}>
      {parsedWords.map((letters, wIdx) => (
        <React.Fragment key={wIdx}>
          <span className="kinetic-word">
            {letters.map(({ char, index }) => (
              <KineticLetter
                key={index}
                char={char}
                index={index}
                isTargetOutlined={activeIndices.includes(index)}
                outlineTheme={currentTheme}
                onHoverSound={handleHoverSound}
              />
            ))}
          </span>
          {wIdx < parsedWords.length - 1 && (
            <span className="inline-block w-[0.24em] select-none">&nbsp;</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
