import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getNetworkQuality } from '../../utils/useNetworkQuality';

/**
 * Global Film Strip Texture Cache (Singleton / Reference Counted)
 * Generates the authentic 35mm Celluloid Film Strip texture once in memory
 * and shares it across all instances, eliminating redundant 2048x256 canvas
 * allocations and multiple GPU texture uploads.
 */
let cachedFilmTexture = null;
let textureRefCount = 0;

function getFilmStripTexture() {
  if (cachedFilmTexture) {
    textureRefCount++;
    return cachedFilmTexture;
  }

  const canvas = document.createElement('canvas');
  // Optimal power-of-2 dimensions for WebGL mipmapping & reduced VRAM
  canvas.width = 2048;
  canvas.height = 256;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return new THREE.Texture();

  // 1. Deep dark celluloid base
  ctx.fillStyle = '#06080e';
  ctx.fillRect(0, 0, 2048, 256);

  const frameWidth = 460;
  const frameGap = 40;
  const totalFrames = 4;
  const startX = 24;

  // 2. Top and Bottom Sprocket Perforations Tracks
  const sprocketWidth = 18;
  const sprocketHeight = 22;
  const sprocketPitch = 32;

  ctx.fillStyle = '#010204';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.2;

  for (let x = 12; x < 2048; x += sprocketPitch) {
    // Top sprocket hole
    ctx.fillRect(x, 5, sprocketWidth, sprocketHeight);
    ctx.strokeRect(x, 5, sprocketWidth, sprocketHeight);

    // Bottom sprocket hole
    ctx.fillRect(x, 229, sprocketWidth, sprocketHeight);
    ctx.strokeRect(x, 229, sprocketWidth, sprocketHeight);

    // Sprocket center alignment notch
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(x + sprocketWidth / 2 - 1, 15, 2, 2);
    ctx.fillRect(x + sprocketWidth / 2 - 1, 239, 2, 2);
    ctx.fillStyle = '#010204';
  }

  // 3. Analog Film Stock Edge Markings
  ctx.font = 'bold 10px monospace';
  ctx.fillStyle = '#fbbf24'; // Kodak gold ink
  ctx.fillText('EASTMAN 5219 VISION3 500T', 60, 36);
  ctx.fillText('4K DCI • 24.00 FPS • ISO 800', 580, 36);
  ctx.fillText('SAFETY FILM • COLOR REEL #01', 1100, 36);
  ctx.fillText('DIRECTOR: RITIK SONI CINEMA', 1600, 36);

  ctx.fillStyle = '#38bdf8'; // Lab cyan edge codes
  ctx.fillText('▲ 024.01 ▲', 180, 222);
  ctx.fillText('▲ 024.02 ▲', 690, 222);
  ctx.fillText('▲ 024.03 ▲', 1200, 222);
  ctx.fillText('▲ 024.04 ▲', 1710, 222);

  // 4. Film Frame Windows (Cinematic Color Grades)
  const frameThemes = [
    {
      scene: 'SCENE 01 // DUSK ANAMORPHIC',
      time: '00:01:24:12',
      color1: 'rgba(14, 165, 233, 0.85)',
      color2: 'rgba(3, 105, 161, 0.95)',
      lens: '50MM T1.5 • 2.39:1',
      accent: '#38bdf8',
    },
    {
      scene: 'SCENE 02 // GOLDEN HOUR GLOW',
      time: '00:01:38:04',
      color1: 'rgba(245, 158, 11, 0.85)',
      color2: 'rgba(180, 83, 9, 0.95)',
      lens: '35MM T1.3 • WARM FLARE',
      accent: '#fbbf24',
    },
    {
      scene: 'SCENE 03 // CYBER RETENTION',
      time: '00:01:52:18',
      color1: 'rgba(168, 85, 247, 0.85)',
      color2: 'rgba(109, 40, 217, 0.95)',
      lens: '85MM T1.4 • NEON CONTRAST',
      accent: '#c084fc',
    },
    {
      scene: 'SCENE 04 // DOCUMENTARY EMERALD',
      time: '00:02:10:00',
      color1: 'rgba(16, 185, 129, 0.85)',
      color2: 'rgba(4, 120, 87, 0.95)',
      lens: '24MM T2.0 • HIGH DYNAMIC',
      accent: '#34d399',
    },
  ];

  for (let i = 0; i < totalFrames; i++) {
    const fx = startX + i * (frameWidth + frameGap);
    const fy = 44;
    const fw = frameWidth;
    const fh = 168;

    // Frame window background gradient
    const grad = ctx.createLinearGradient(fx, fy, fx + fw, fy + fh);
    grad.addColorStop(0, frameThemes[i].color1);
    grad.addColorStop(1, frameThemes[i].color2);
    ctx.fillStyle = grad;
    ctx.fillRect(fx, fy, fw, fh);

    // Film shot horizon silhouette
    ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
    ctx.beginPath();
    ctx.moveTo(fx, fy + fh * 0.72);
    ctx.lineTo(fx + fw * 0.28, fy + fh * 0.58);
    ctx.lineTo(fx + fw * 0.55, fy + fh * 0.68);
    ctx.lineTo(fx + fw * 0.82, fy + fh * 0.52);
    ctx.lineTo(fx + fw, fy + fh * 0.64);
    ctx.lineTo(fx + fw, fy + fh);
    ctx.lineTo(fx, fy + fh);
    ctx.closePath();
    ctx.fill();

    // Frame Outer Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(fx, fy, fw, fh);

    // 2.39:1 Aspect Ratio Framing Guide
    ctx.strokeStyle = frameThemes[i].accent;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 3]);
    ctx.strokeRect(fx + 14, fy + 16, fw - 28, fh - 32);
    ctx.setLineDash([]);

    // Scene Title & SMPTE Timecode
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(frameThemes[i].scene, fx + 20, fy + 30);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(frameThemes[i].time, fx + fw - 105, fy + 30);

    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(frameThemes[i].lens, fx + 20, fy + fh - 20);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  cachedFilmTexture = texture;
  textureRefCount = 1;
  return texture;
}

function releaseFilmStripTexture() {
  textureRefCount--;
  if (textureRefCount <= 0 && cachedFilmTexture) {
    cachedFilmTexture.dispose();
    cachedFilmTexture = null;
    textureRefCount = 0;
  }
}

/**
 * Builds an optimized 3D ribbon geometry following a 3D CatmullRom spline.
 * Uses pre-allocated typed arrays and avoids allocations inside loops.
 */
function createRibbonGeometry(curve, segments = 50, width = 2.6, uvRepeat = 7) {
  const points = curve.getSpacedPoints(segments);
  const vertexCount = (segments + 1) * 2;
  const vertices = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const indices = new Uint16Array(segments * 6);

  const tangent = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0.25);
  const normal = new THREE.Vector3();
  const left = new THREE.Vector3();
  const right = new THREE.Vector3();
  const halfWidth = width * 0.5;

  let vIdx = 0;
  let uvIdx = 0;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const pt = points[i];

    curve.getTangent(t, tangent).normalize();
    normal.crossVectors(tangent, up).normalize();
    if (normal.lengthSq() < 0.001) normal.set(0, 0, 1);

    left.copy(pt).addScaledVector(normal, halfWidth);
    right.copy(pt).addScaledVector(normal, -halfWidth);

    vertices[vIdx++] = left.x;
    vertices[vIdx++] = left.y;
    vertices[vIdx++] = left.z;

    vertices[vIdx++] = right.x;
    vertices[vIdx++] = right.y;
    vertices[vIdx++] = right.z;

    const u = t * uvRepeat;
    uvs[uvIdx++] = u;
    uvs[uvIdx++] = 1;
    uvs[uvIdx++] = u;
    uvs[uvIdx++] = 0;
  }

  let idx = 0;
  for (let i = 0; i < segments; i++) {
    const i2 = i * 2;
    indices[idx++] = i2;
    indices[idx++] = i2 + 1;
    indices[idx++] = i2 + 2;

    indices[idx++] = i2 + 1;
    indices[idx++] = i2 + 3;
    indices[idx++] = i2 + 2;
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geom.setIndex(new THREE.BufferAttribute(indices, 1));
  geom.computeVertexNormals();
  return geom;
}

/**
 * Ultra-Optimized Cinematic 35mm Celluloid Canvas (WebGL)
 * - Shared texture cache with zero duplicate canvas reallocations
 * - Zero CPU-to-GPU buffer re-uploads during animation
 * - Fillrate optimization with capped DPR (1.5 max)
 * - Auto-pausing on tab switch (Page Visibility API)
 * - Lightweight spline segment count and depthWrite optimization
 */
const CinematicCanvas = ({
  className = 'fixed inset-0 pointer-events-none z-0 w-full h-full opacity-[0.38]',
  isMobile = false,
  isPaused = false,
  opacity,
}) => {
  const canvasRef = useRef(null);
  const isPausedPropRef = useRef(isPaused);

  useEffect(() => {
    isPausedPropRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;
    let isDisposed = false;
    let isPaused = false;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050608, 16, 60);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    // 2. High-Efficiency Renderer Setup
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      });
      const net = getNetworkQuality();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, (isMobile || net.isSlow) ? 1.0 : 2.0);
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
    } catch (e) {
      console.warn('WebGL initialization failed.', e);
      return;
    }

    // 3. Shared Film Strip Texture
    const filmTexture = getFilmStripTexture();
    if (renderer && filmTexture) {
      filmTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    }

    // 4. Primary 35mm Film Ribbon
    const filmCurve1 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-20, 6.8, -5.5),
      new THREE.Vector3(-10, 4.5, -4.6),
      new THREE.Vector3(0, 3.5, -4.8),
      new THREE.Vector3(10, 4.5, -4.6),
      new THREE.Vector3(20, 6.8, -5.5),
    ]);

    const filmGeo1 = createRibbonGeometry(filmCurve1, isMobile ? 40 : 60, isMobile ? 2.2 : 2.6, 7);
    const filmMat1 = new THREE.MeshBasicMaterial({
      map: filmTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.32,
      depthWrite: false,
    });
    const filmRibbon1 = new THREE.Mesh(filmGeo1, filmMat1);
    scene.add(filmRibbon1);

    // Secondary Deeper Film Ribbon
    const filmCurve2 = new THREE.CatmullRomCurve3([
      new THREE.Vector3(22, 10, -15),
      new THREE.Vector3(10, 6, -14),
      new THREE.Vector3(-4, 7.5, -15),
      new THREE.Vector3(-18, 4, -16),
    ]);

    const filmGeo2 = createRibbonGeometry(filmCurve2, isMobile ? 30 : 45, isMobile ? 1.6 : 2.0, 5);
    const filmMat2 = new THREE.MeshBasicMaterial({
      map: filmTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
    const filmRibbon2 = new THREE.Mesh(filmGeo2, filmMat2);
    scene.add(filmRibbon2);

    // 5. Cinematic Luminous Dust Particles (Static GPU buffer, transform-animated)
    const particleCount = isMobile ? 32 : 60;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 36;
      particlePositions[i + 1] = (Math.random() - 0.5) * 24;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: isMobile ? 0.12 : 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Critical for fast point rendering
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Smooth Mouse Parallax
    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();

    const handleMouseMove = (event) => {
      pointerTarget.set(
        (event.clientX / window.innerWidth - 0.5) * 2,
        -(event.clientY / window.innerHeight - 0.5) * 2
      );
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!renderer || isDisposed) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 7. Page Visibility API: Pause rendering when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isPaused = true;
        cancelAnimationFrame(animationFrameId);
      } else {
        isPaused = false;
        clock.getDelta(); // flush delta spike
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const clock = new THREE.Clock();
    let elapsedTime = 0;

    const animate = () => {
      if (isDisposed) return;
      if (isPaused || isPausedPropRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      elapsedTime += delta;
      pointer.lerp(pointerTarget, 1 - Math.exp(-delta * 4));

      // Camera subtle drift
      camera.position.x = pointer.x * 0.5;
      camera.position.y = pointer.y * 0.4;
      camera.lookAt(pointer.x * 0.06, pointer.y * 0.04, 0);

      // Smooth film roll
      filmTexture.offset.x -= delta * 0.018;

      filmRibbon1.position.y = Math.sin(elapsedTime * 0.35) * 0.14;
      filmRibbon1.rotation.z = Math.sin(elapsedTime * 0.25) * 0.01;

      filmRibbon2.position.y = Math.sin(elapsedTime * 0.3 + 1.0) * 0.1;

      // Dust float via GPU transformation matrix: 0 bytes uploaded to GPU!
      particleSystem.rotation.y += delta * 0.01;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.15) * 0.03;
      particleSystem.position.y = Math.sin(elapsedTime * 0.25) * 0.3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      releaseFilmStripTexture();
      filmGeo1.dispose();
      filmGeo2.dispose();
      filmMat1.dispose();
      filmMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      scene.clear();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={opacity !== undefined ? { opacity } : undefined}
      aria-hidden="true"
    />
  );
};

export default React.memo(CinematicCanvas);
