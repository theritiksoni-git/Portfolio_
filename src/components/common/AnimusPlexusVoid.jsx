import React, { useEffect, useRef } from 'react';
import { getNetworkQuality } from '../../utils/useNetworkQuality';

/**
 * AnimusPlexusVoid
 * Recreates the iconic Assassin's Creed Animus Memory Corridor:
 * A dimensional cyber void where luminous memory points float
 * and connect dynamically via delicate, glowing filaments.
 *
 * Performance Optimizations:
 * - Pre-computed gradient cache on resize (avoids creating gradients 60fps)
 * - Page Visibility API pausing when tab is inactive
 * - Clean connection cap per node to prevent N^2 draw call bottlenecks
 * - React.memo wrapping to prevent unnecessary re-renders
 */
const AnimusPlexusVoid = ({
  isCharging = false,
  isPaused = false,
  count = null,
  className = '',
  opacity = 1,
  style = {},
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const isChargingRef = useRef(isCharging);
  const isPausedPropRef = useRef(isPaused);

  useEffect(() => {
    isChargingRef.current = isCharging;
  }, [isCharging]);

  useEffect(() => {
    isPausedPropRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let isDisposed = false;
    let isPaused = false;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Responsive particle density (rich point-cloud, throttled on slow networks/mobile)
    const net = getNetworkQuality();
    const isMobile = width < 768;
    const defaultCount = isMobile ? (net.isSlow ? 40 : 55) : (net.isSlow ? 55 : 90);
    const particleCount = count || defaultCount;
    const maxConnectionDist = isMobile ? (net.isSlow ? 65 : 75) : (net.isSlow ? 85 : 105);

    // Pre-computed ambient depth gradient
    let auraGradient = null;
    const updateAuraGradient = () => {
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      auraGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width * 0.55);
      auraGradient.addColorStop(0, 'rgba(14, 165, 233, 0.07)');
      auraGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.025)');
      auraGradient.addColorStop(1, 'rgba(5, 6, 8, 0)');
    };
    updateAuraGradient();

    // Generate Animus point particles
    const particles = [];
    const colors = [
      { core: '#38bdf8', prefix: 'rgba(56, 189, 248, ' },   // Bright cyan
      { core: '#7dd3fc', prefix: 'rgba(125, 211, 252, ' },  // Ice blue
      { core: '#ffffff', prefix: 'rgba(255, 255, 255, ' },  // Pure digital white
      { core: '#00f2fe', prefix: 'rgba(0, 242, 254, ' },    // Electric aqua
    ];

    for (let i = 0; i < particleCount; i++) {
      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2.0 + 1.2,
        coreColor: colorObj.core,
        colorPrefix: colorObj.prefix,
        baseAlpha: Math.random() * 0.4 + 0.5,
        pulseSpeed: Math.random() * 0.025 + 0.015,
        pulsePhase: Math.random() * Math.PI * 2,
        isMajorNode: Math.random() > 0.8,
      });
    }

    const handleResize = () => {
      if (!canvas || isDisposed) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      updateAuraGradient();
    };

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Smooth speed & flare transitions
    let currentSpeed = 1.0;
    let currentFlare = 1.0;

    // Render loop
    const render = () => {
      if (isDisposed) return;
      if (isPaused || isPausedPropRef.current) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const charging = isChargingRef.current;
      const targetSpeed = charging ? 2.0 : 1.0;
      const targetFlare = charging ? 1.5 : 1.0;

      currentSpeed += (targetSpeed - currentSpeed) * 0.12;
      currentFlare += (targetFlare - currentFlare) * 0.12;

      const connDist = maxConnectionDist * (charging ? 1.15 : 1.0);
      const connDistSq = connDist * connDist;

      // 1. Draw pre-computed ambient cyber void depth glow
      if (auraGradient) {
        ctx.fillStyle = auraGradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw connecting strings (delicate, refined filaments)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        let connections = 0;

        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= 3) break; // Maximum 3 connections per node prevents draw call saturation

          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connDistSq) {
            connections++;
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / connDist) * (0.26 * currentFlare);

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = charging ? 0.9 : 0.65;
            ctx.stroke();
          }
        }

        // Connection to interactive mouse cursor
        if (mouseRef.current.active) {
          const mdx = p1.x - mouseRef.current.x;
          const mdy = p1.y - mouseRef.current.y;
          const mDistSq = mdx * mdx + mdy * mdy;
          const mouseConnDist = 130;

          if (mDistSq < mouseConnDist * mouseConnDist) {
            const mDist = Math.sqrt(mDistSq);
            const mAlpha = (1 - mDist / mouseConnDist) * 0.38;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.strokeStyle = `rgba(125, 211, 252, ${mAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Subtle gentle mouse repulsion
            p1.x += (mdx / mDist) * 0.25;
            p1.y += (mdy / mDist) * 0.25;
          }
        }

        // 3. Update particle positions
        p1.x += p1.vx * currentSpeed;
        p1.y += p1.vy * currentSpeed;

        if (p1.x < -15) p1.x = width + 15;
        else if (p1.x > width + 15) p1.x = -15;
        if (p1.y < -15) p1.y = height + 15;
        else if (p1.y > height + 15) p1.y = -15;

        // 4. Draw prominent, luminous Animus memory dots
        p1.pulsePhase += p1.pulseSpeed * currentSpeed;
        const pulse = Math.sin(p1.pulsePhase) * 0.25 + 0.85;
        const alpha = Math.min(1, p1.baseAlpha * pulse * currentFlare);
        const radius = p1.radius * (charging ? 1.25 : 1.0);

        // Outer phosphorescent halo for major anchor nodes
        if (p1.isMajorNode || charging) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${p1.colorPrefix}${alpha * 0.22})`;
          ctx.fill();
        }

        // Bright luminous core node
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p1.colorPrefix}${alpha})`;
        ctx.fill();

        // White hot center point
        if (p1.isMajorNode || charging) {
          ctx.beginPath();
          ctx.arc(p1.x, p1.y, radius * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.2)})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`animus-plexus-void ${className}`}
      style={{ opacity, ...style }}
      aria-hidden="true"
    />
  );
};

export default React.memo(AnimusPlexusVoid);
