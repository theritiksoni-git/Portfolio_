import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check, 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Circle, 
  Square,
  Sparkles,
  Move
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

/**
 * ImageCropModal - Cyber-Cinema Interactive Image Cropper & Adjuster
 * Supports:
 * - Free dragging / panning (mouse & touch)
 * - Smooth wheel scroll zooming & slider zooming (1x - 3.5x)
 * - 90-degree step rotation
 * - Avatar circular vs rounded-square guide shape preview
 * - High-resolution, zero-distortion 400x400 JPEG output
 */
export default function ImageCropModal({
  isOpen,
  imageSrc,
  title = "ADJUST & CROP PROFILE PICTURE",
  subtitle = "Drag to reposition, scroll to zoom, and frame the face perfectly.",
  onCropComplete,
  onCancel,
}) {
  const canvasRef = useRef(null);
  const imageObjRef = useRef(null);

  // Transform states
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cropShape, setCropShape] = useState('circle'); // 'circle' | 'square'
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Dragging states
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Canvas Viewport Dimensions
  const CANVAS_SIZE = 340;
  const CROP_SIZE = 260; // 260px diameter preview

  // Load source image
  useEffect(() => {
    if (!isOpen || !imageSrc) {
      setIsImageLoaded(false);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      setIsImageLoaded(true);
      // Reset adjustments on new image load
      setZoom(1.0);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    };
    img.onerror = () => {
      setIsImageLoaded(false);
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Redraw preview canvas whenever adjustments change
  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current || !isImageLoaded) return;
    const ctx = canvas.getContext('2d');
    const img = imageObjRef.current;

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    // 1. Clear background
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Dark canvas backdrop
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // 2. Draw transformed image
    ctx.save();
    ctx.translate(cx + position.x, cy + position.y);
    ctx.rotate((rotation * Math.PI) / 180);

    const isFlipped = rotation % 180 !== 0;
    const naturalW = isFlipped ? img.naturalHeight : img.naturalWidth;
    const naturalH = isFlipped ? img.naturalWidth : img.naturalHeight;

    // Base scale to cover crop window
    const baseScale = Math.max(CROP_SIZE / naturalW, CROP_SIZE / naturalH);
    const totalScale = baseScale * zoom;

    ctx.scale(totalScale, totalScale);
    ctx.drawImage(
      img,
      -img.naturalWidth / 2,
      -img.naturalHeight / 2,
      img.naturalWidth,
      img.naturalHeight
    );
    ctx.restore();

    // 3. Draw Dark Vignette Mask Outside Crop Region
    ctx.save();
    ctx.fillStyle = 'rgba(9, 9, 11, 0.78)';
    ctx.beginPath();
    ctx.rect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    if (cropShape === 'circle') {
      ctx.arc(cx, cy, CROP_SIZE / 2, 0, Math.PI * 2, true);
    } else {
      // Rounded Rectangle Path Counter-Clockwise for Cutout
      const r = 24;
      const x = cx - CROP_SIZE / 2;
      const y = cy - CROP_SIZE / 2;
      const w = CROP_SIZE;
      const h = CROP_SIZE;

      ctx.moveTo(x + r, y);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.lineTo(x, y + h - r);
      ctx.quadraticCurveTo(x, y + h, x + r, y + h);
      ctx.lineTo(x + w - r, y + h);
      ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
      ctx.lineTo(x + w, y + r);
      ctx.quadraticCurveTo(x + w, y, x + w - r, y);
      ctx.closePath();
    }
    ctx.fill('evenodd');
    ctx.restore();

    // 4. Draw Crop Guide Border
    ctx.save();
    ctx.strokeStyle = '#38bdf8'; // Cyan-400
    ctx.lineWidth = 2;

    if (cropShape === 'circle') {
      ctx.beginPath();
      ctx.arc(cx, cy, CROP_SIZE / 2, 0, Math.PI * 2);
      ctx.stroke();

      // Clip inside circle for Rule of Thirds grid
      ctx.clip();
    } else {
      const r = 24;
      const x = cx - CROP_SIZE / 2;
      const y = cy - CROP_SIZE / 2;
      const w = CROP_SIZE;
      const h = CROP_SIZE;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
      ctx.stroke();

      ctx.clip();
    }

    // Subtle Rule-of-Thirds Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    const third1 = cx - CROP_SIZE / 6;
    const third2 = cx + CROP_SIZE / 6;
    const vThird1 = cy - CROP_SIZE / 6;
    const vThird2 = cy + CROP_SIZE / 6;

    ctx.beginPath();
    ctx.moveTo(third1, cy - CROP_SIZE / 2);
    ctx.lineTo(third1, cy + CROP_SIZE / 2);
    ctx.moveTo(third2, cy - CROP_SIZE / 2);
    ctx.lineTo(third2, cy + CROP_SIZE / 2);

    ctx.moveTo(cx - CROP_SIZE / 2, vThird1);
    ctx.lineTo(cx + CROP_SIZE / 2, vThird1);
    ctx.moveTo(cx - CROP_SIZE / 2, vThird2);
    ctx.lineTo(cx + CROP_SIZE / 2, vThird2);
    ctx.stroke();

    ctx.restore();
  }, [CANVAS_SIZE, CROP_SIZE, cropShape, isImageLoaded, position.x, position.y, rotation, zoom]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (clientX, clientY) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
  };

  const handlePointerMove = (clientX, clientY) => {
    if (!isDraggingRef.current) return;
    const newX = clientX - dragStartRef.current.x;
    const newY = clientY - dragStartRef.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Wheel zoom handler
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((prev) => {
      const next = Math.min(3.5, Math.max(1.0, +(prev + delta).toFixed(2)));
      return next;
    });
  };

  // Reset transforms
  const handleReset = () => {
    sound.playClick();
    setZoom(1.0);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    sound.playClick();
    setRotation((prev) => (prev + 90) % 360);
  };

  // Finalize Crop & Export High-Res 400x400 JPEG
  const handleApply = () => {
    if (!imageObjRef.current) return;
    sound.playClick();

    const OUTPUT_SIZE = 400; // 400x400 max retina dimensions
    const outCanvas = document.createElement('canvas');
    outCanvas.width = OUTPUT_SIZE;
    outCanvas.height = OUTPUT_SIZE;
    const outCtx = outCanvas.getContext('2d');

    const scaleFactor = OUTPUT_SIZE / CROP_SIZE;

    // Dark solid backdrop
    outCtx.fillStyle = '#18181b';
    outCtx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    outCtx.save();
    outCtx.translate(
      OUTPUT_SIZE / 2 + position.x * scaleFactor,
      OUTPUT_SIZE / 2 + position.y * scaleFactor
    );
    outCtx.rotate((rotation * Math.PI) / 180);

    const isFlipped = rotation % 180 !== 0;
    const naturalW = isFlipped ? imageObjRef.current.naturalHeight : imageObjRef.current.naturalWidth;
    const naturalH = isFlipped ? imageObjRef.current.naturalWidth : imageObjRef.current.naturalHeight;
    const baseScale = Math.max(OUTPUT_SIZE / naturalW, OUTPUT_SIZE / naturalH);
    const totalScale = baseScale * zoom;

    outCtx.scale(totalScale, totalScale);
    outCtx.drawImage(
      imageObjRef.current,
      -imageObjRef.current.naturalWidth / 2,
      -imageObjRef.current.naturalHeight / 2,
      imageObjRef.current.naturalWidth,
      imageObjRef.current.naturalHeight
    );
    outCtx.restore();

    const croppedDataUrl = outCanvas.toDataURL('image/jpeg', 0.90);
    if (onCropComplete) {
      onCropComplete(croppedDataUrl);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        handleApply();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-zinc-950/95 border border-cyan-500/40 rounded-3xl p-5 shadow-[0_0_60px_rgba(56,189,248,0.15)] flex flex-col space-y-4 relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-syne font-bold text-white text-base tracking-wide flex items-center gap-2">
                  {title}
                </h3>
                <p className="text-zinc-400 font-mono text-[11px]">
                  {subtitle}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-lg bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Viewport Area */}
          <div className="relative mx-auto flex flex-col items-center justify-center">
            <div 
              className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative bg-zinc-900 cursor-grab active:cursor-grabbing select-none"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
              onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
              onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={(e) => {
                if (e.touches[0]) handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }}
              onTouchEnd={handlePointerUp}
              onWheel={handleWheel}
            >
              <canvas
                ref={canvasRef}
                width={CANVAS_SIZE}
                height={CANVAS_SIZE}
                className="w-full h-full block"
              />

              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-xs">
                  Loading picture...
                </div>
              )}

              {/* Interaction Hint Badge */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 font-mono text-[10px] flex items-center gap-1.5 pointer-events-none">
                <Move className="w-3 h-3 text-cyan-400" />
                <span>Drag to pan • Scroll to zoom</span>
              </div>
            </div>
          </div>

          {/* Adjustments & Controls Toolbar */}
          <div className="space-y-3 bg-zinc-900/60 border border-white/5 rounded-2xl p-3.5">
            {/* Zoom Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ZOOM ADJUSTMENT</span>
                </span>
                <span className="text-cyan-300 font-bold">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.max(1.0, +(prev - 0.2).toFixed(2)))}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.02"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => setZoom((prev) => Math.min(3.5, +(prev + 0.2).toFixed(2)))}
                  className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Action Buttons Row */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRotate}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-300 hover:text-white font-mono text-xs flex items-center gap-1.5 transition-all"
                  title="Rotate 90 degrees clockwise"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rotate 90°</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs flex items-center gap-1 transition-all"
                  title="Reset adjustments"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Shape Guide Toggle */}
              <div className="flex items-center bg-zinc-800 rounded-xl p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCropShape('circle');
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    cropShape === 'circle'
                      ? 'bg-cyan-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Circle Avatar Guide"
                >
                  <Circle className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setCropShape('square');
                  }}
                  className={`p-1.5 rounded-lg transition-all ${
                    cropShape === 'square'
                      ? 'bg-cyan-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Square Frame Guide"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Modal Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!isImageLoaded}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Picture</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
