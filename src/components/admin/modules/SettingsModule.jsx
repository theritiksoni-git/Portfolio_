import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Lock, 
  Check, 
  HardDrive,
  Save
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function SettingsModule() {
  const [settings, setSettings] = useState(adminStore.getModule('settings'));
  const [passcode, setPasscode] = useState(settings.adminPasscode || 'admin');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      const s = adminStore.getModule('settings');
      setSettings(s);
      setPasscode(s.adminPasscode || 'admin');
    };
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    sound.playClick();
    adminStore.updateSettings({
      ...settings,
      adminPasscode: passcode,
    });
    setNotice({ type: 'success', text: 'System settings saved!' });
    setTimeout(() => setNotice(null), 2500);
  };

  const handleExport = () => {
    sound.playClick();
    const dataStr = adminStore.exportSnapshot();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ritik_Control_Room_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice({ type: 'success', text: 'Complete JSON snapshot exported!' });
    setTimeout(() => setNotice(null), 2500);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      sound.playClick();
      const res = adminStore.importSnapshot(event.target.result);
      if (res.success) {
        setNotice({ type: 'success', text: 'Snapshot restored successfully!' });
      } else {
        setNotice({ type: 'error', text: `Import failed: ${res.error}` });
      }
      setTimeout(() => setNotice(null), 3000);
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    sound.playClick();
    if (window.confirm('WARNING: Reset all portfolio and control room data back to original seed defaults?')) {
      adminStore.resetToDefaults();
      setNotice({ type: 'success', text: 'Control room reset to factory seed!' });
      setTimeout(() => setNotice(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            <span>Creative Control Room Settings & Data Engine</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Configure system audio defaults, access credentials, and full data snapshot backup/restore.
          </p>
        </div>

        {notice && (
          <div className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 animate-fadeIn ${
            notice.type === 'success' 
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300' 
              : 'bg-red-500/20 border border-red-500/40 text-red-300'
          }`}>
            <Check className="w-4 h-4" />
            <span>{notice.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Column: System & Security Config (Col Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
            <h3 className="font-syne font-bold text-base text-white">
              Studio & Control Room Preferences
            </h3>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Studio Title
              </label>
              <input
                type="text"
                value={settings.studioTitle || ''}
                onChange={(e) => setSettings({ ...settings, studioTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Official Priority Email
              </label>
              <input
                type="email"
                value={settings.adminEmail || ''}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Meta Narrative & SEO Description
              </label>
              <textarea
                rows={2}
                value={settings.metaDescription || ''}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
              />
            </div>

            {/* Audio & Visual FX Toggles */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider block">
                Atmosphere & Audio Preferences
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="sound-default-cb"
                  checked={settings.defaultSoundOn ?? true}
                  onChange={(e) => setSettings({ ...settings, defaultSoundOn: e.target.checked })}
                  className="rounded bg-zinc-900 border-white/10 text-cyan-500"
                />
                <label htmlFor="sound-default-cb" className="text-zinc-300 font-mono cursor-pointer">
                  Default cinematic sound enabled on portfolio boot
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="crt-scanlines-cb"
                  checked={settings.crtScanlinesEnabled ?? true}
                  onChange={(e) => setSettings({ ...settings, crtScanlinesEnabled: e.target.checked })}
                  className="rounded bg-zinc-900 border-white/10 text-cyan-500"
                />
                <label htmlFor="crt-scanlines-cb" className="text-zinc-300 font-mono cursor-pointer">
                  CRT Television Scanlines & Phosphor Bloom active
                </label>
              </div>
            </div>

            {/* Admin Security PIN */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider block">
                Control Room Security PIN / Passcode
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <Lock className="w-4 h-4 text-cyan-400" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="admin"
                />
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                Default: "admin". Used to authenticate into this creative control room.
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              >
                <Save className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Data Engine Backup & Restore (Col Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
            <h3 className="font-syne font-bold text-base text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <span>Data Engine & Snapshots</span>
            </h3>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Export a standalone JSON snapshot of your entire portfolio data (projects, media, leads, experience, clients, availability). You can restore anytime or commit directly back into code.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleExport}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Export JSON Snapshot</span>
              </button>

              <label className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Import / Restore Snapshot</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Seed Defaults</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
