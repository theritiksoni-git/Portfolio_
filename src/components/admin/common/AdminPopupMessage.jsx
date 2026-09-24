import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  Lock, 
  Globe, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

// Global Event Names for decoupled triggering from any module
const EVENT_SHOW_TOAST = 'admin-toast-event';
const EVENT_SHOW_CONFIRM = 'admin-confirm-event';

/**
 * Trigger a floating cyber popup toast in the Admin page
 * @param {Object} options
 * @param {'success'|'warning'|'error'|'info'|'public'|'private'} [options.type='info']
 * @param {string} [options.title]
 * @param {string} options.message
 * @param {string} [options.tag]
 * @param {number} [options.duration=2800]
 * @param {string} [options.actionLabel]
 * @param {Function} [options.onAction]
 */
export function showAdminToast({
  type = 'info',
  title,
  message,
  tag,
  duration = 2800,
  actionLabel,
  onAction,
}) {
  if (typeof window === 'undefined') return;
  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  window.dispatchEvent(
    new CustomEvent(EVENT_SHOW_TOAST, {
      detail: {
        id,
        type,
        title,
        message,
        tag,
        duration,
        actionLabel,
        onAction,
      },
    })
  );
}

/**
 * Trigger a cinematic confirmation modal popup in the Admin page
 * @param {Object} options
 * @param {string} options.title
 * @param {string} options.message
 * @param {string} [options.confirmText='CONFIRM']
 * @param {string} [options.cancelText='CANCEL']
 * @param {'danger'|'warning'|'info'} [options.type='danger']
 * @param {Function} options.onConfirm
 * @param {Function} [options.onCancel]
 */
export function showAdminConfirm({
  title,
  message,
  confirmText = 'CONFIRM',
  cancelText = 'CANCEL',
  type = 'danger',
  onConfirm,
  onCancel,
}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(EVENT_SHOW_CONFIRM, {
      detail: {
        title,
        message,
        confirmText,
        cancelText,
        type,
        onConfirm,
        onCancel,
      },
    })
  );
}

// Visual theme configurations based on notification type
const THEME_CONFIG = {
  success: {
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/50',
    glowColor: 'shadow-[0_0_30px_rgba(16,185,129,0.22)]',
    badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
    progressBarBg: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
    Icon: CheckCircle2,
    defaultTitle: 'TRANSMISSION VERIFIED',
  },
  public: {
    accentColor: '#10b981',
    borderColor: 'border-emerald-500/60',
    glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.3)]',
    badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
    progressBarBg: 'bg-gradient-to-r from-emerald-400 to-cyan-400',
    iconBg: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50',
    Icon: Globe,
    defaultTitle: 'PORTFOLIO VISIBILITY: PUBLIC',
  },
  warning: {
    accentColor: '#f59e0b',
    borderColor: 'border-amber-500/50',
    glowColor: 'shadow-[0_0_30px_rgba(245,158,11,0.22)]',
    badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
    progressBarBg: 'bg-gradient-to-r from-amber-500 to-orange-400',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    Icon: AlertTriangle,
    defaultTitle: 'STUDIO WARNING',
  },
  private: {
    accentColor: '#f59e0b',
    borderColor: 'border-amber-500/60',
    glowColor: 'shadow-[0_0_35px_rgba(245,158,11,0.3)]',
    badgeBg: 'bg-amber-950/90 text-amber-300 border-amber-500/50',
    progressBarBg: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    iconBg: 'bg-amber-500/20 text-amber-400 border border-amber-500/50',
    Icon: Lock,
    defaultTitle: 'PORTFOLIO VISIBILITY: PRIVATE',
  },
  error: {
    accentColor: '#f43f5e',
    borderColor: 'border-rose-500/50',
    glowColor: 'shadow-[0_0_30px_rgba(244,63,94,0.25)]',
    badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
    progressBarBg: 'bg-gradient-to-r from-rose-500 to-red-500',
    iconBg: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    Icon: AlertCircle,
    defaultTitle: 'SECURITY / EXECUTION ERROR',
  },
  info: {
    accentColor: '#06b6d4',
    borderColor: 'border-cyan-500/50',
    glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.22)]',
    badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
    progressBarBg: 'bg-gradient-to-r from-cyan-400 to-sky-400',
    iconBg: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
    Icon: Sparkles,
    defaultTitle: 'COMMAND UPDATE',
  },
};

/**
 * Individual Cyber Toast Popup Item with Auto-dismiss countdown
 */
function ToastItem({ toast, onDismiss }) {
  const duration = toast.duration || 2800;

  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  });

  const theme = THEME_CONFIG[toast.type] || THEME_CONFIG.info;
  const Icon = theme.Icon;

  // Running SMPTE timestamp when toast was spawned
  const [timecodeStamp] = useState(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  });

  useEffect(() => {
    // Guaranteed auto-dismissal timer that triggers Framer Motion exit
    const dismissTimer = setTimeout(() => {
      if (onDismissRef.current) {
        onDismissRef.current(toast.id);
      }
    }, duration);

    return () => {
      clearTimeout(dismissTimer);
    };
  }, [toast.id, duration]);

  const handleManualDismiss = () => {
    sound.playClick();
    if (onDismissRef.current) {
      onDismissRef.current(toast.id);
    }
  };

  const handleActionClick = () => {
    sound.playClick();
    if (toast.onAction) toast.onAction();
    if (onDismissRef.current) {
      onDismissRef.current(toast.id);
    }
  };

  return (
    <div
      className={`group relative w-full sm:w-[410px] rounded-2xl bg-zinc-950/95 backdrop-blur-2xl border ${theme.borderColor} ${theme.glowColor} overflow-hidden shadow-2xl flex flex-col`}
      style={{
        boxShadow: `0 10px 35px -5px rgba(0, 0, 0, 0.7), 0 0 20px -2px ${theme.accentColor}25`,
      }}
    >
      {/* Top Cyber Accent Bar & Timecode */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between border-b border-white/5 bg-zinc-900/40 text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: theme.accentColor }} />
          <span className="uppercase tracking-widest text-zinc-400 font-semibold">
            {toast.tag || `[TC ${timecodeStamp}]`}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-wider text-zinc-500">
          CONTROL ROOM // DISPATCH
        </span>
      </div>

      {/* Main Toast Content */}
      <div className="p-4 flex items-start gap-3.5">
        {/* Glow Icon Box */}
        <div className={`p-2.5 rounded-xl shrink-0 ${theme.iconBg} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="font-syne font-bold text-sm text-white tracking-wide truncate">
              {toast.title || theme.defaultTitle}
            </h4>
          </div>
          <p className="text-xs text-zinc-300 font-light leading-relaxed break-words">
            {toast.message}
          </p>

          {/* Action Button (e.g., Undo, View) */}
          {toast.actionLabel && (
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleActionClick}
                className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/15 hover:border-white/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3 h-3 text-cyan-400" />
                <span>{toast.actionLabel}</span>
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={handleManualDismiss}
          className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors shrink-0"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dynamic Animated Auto-Dismiss Progress Bar */}
      <div className="h-[2px] w-full bg-zinc-900/80 overflow-hidden">
        <motion.div
          className={`h-full ${theme.progressBarBg}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      </div>
    </div>
  );
}

/**
 * Cinematic Cyber Confirmation Modal Dialog
 */
function ConfirmModal({ config, onClose }) {
  if (!config) return null;

  const isDanger = config.type === 'danger';

  const handleConfirm = () => {
    sound.playClick();
    if (config.onConfirm) config.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    sound.playClick();
    if (config.onCancel) config.onCancel();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className={`w-full max-w-md rounded-3xl bg-zinc-950/95 border ${
          isDanger ? 'border-red-500/40 shadow-[0_0_50px_rgba(244,63,94,0.25)]' : 'border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)]'
        } p-6 sm:p-7 relative overflow-hidden flex flex-col space-y-5`}
      >
        {/* Subtle Ambient Backlight Glow */}
        <div className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-[80px] pointer-events-none ${
          isDanger ? 'bg-red-500/15' : 'bg-cyan-500/15'
        }`} />

        {/* Header with Icon */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl shrink-0 ${
            isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
          }`}>
            {isDanger ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-red-400' : 'bg-cyan-400'}`} />
              <span>COMMAND VERIFICATION REQUIRED</span>
            </div>
            <h3 className="font-syne font-bold text-xl text-white tracking-wide">
              {config.title || 'Are you sure?'}
            </h3>
          </div>
        </div>

        {/* Message Body */}
        <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 text-xs text-zinc-300 font-light leading-relaxed">
          {config.message}
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-white/20 text-zinc-300 font-bold uppercase tracking-wider transition-all"
          >
            {config.cancelText || 'CANCEL (ESC)'}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg hover:scale-102 active:scale-98 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            <span>{config.confirmText || 'PROCEED'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Global Admin Popup Messages Container
 * Mount this once in AdminLayout.
 */
function AdminPopupContainer() {
  const [toasts, setToasts] = useState([]);
  const [confirmModal, setConfirmModal] = useState(null);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const toastData = e.detail;
      if (!toastData) return;
      setToasts((prev) => [toastData, ...prev.slice(0, 4)]); // Keep max 5 visible
    };

    const handleConfirmEvent = (e) => {
      const confirmData = e.detail;
      if (!confirmData) return;
      setConfirmModal(confirmData);
    };

    window.addEventListener(EVENT_SHOW_TOAST, handleToastEvent);
    window.addEventListener(EVENT_SHOW_CONFIRM, handleConfirmEvent);

    return () => {
      window.removeEventListener(EVENT_SHOW_TOAST, handleToastEvent);
      window.removeEventListener(EVENT_SHOW_CONFIRM, handleConfirmEvent);
    };
  }, []);

  // Keyboard navigation: Escape key cancels modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (confirmModal) {
          if (confirmModal.onCancel) confirmModal.onCancel();
          setConfirmModal(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmModal]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <>
      {/* Floating Cyber Toast Messages Stack (Top Right) */}
      <div 
        className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-3 pointer-events-none max-w-full"
        style={{ perspective: 1000 }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.94, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                x: 75,
                scale: 0.92,
                filter: 'blur(8px)',
                transition: {
                  duration: 0.35,
                  ease: [0.32, 0.72, 0, 1]
                }
              }}
              transition={{
                type: 'spring',
                stiffness: 380,
                damping: 28,
                layout: { duration: 0.28, ease: 'easeOut' }
              }}
              className="pointer-events-auto"
            >
              <ToastItem toast={toast} onDismiss={dismissToast} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal key="admin-confirm-dialog" config={confirmModal} onClose={() => setConfirmModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default React.memo(AdminPopupContainer);
