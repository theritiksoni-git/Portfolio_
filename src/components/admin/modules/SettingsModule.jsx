import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Settings, 
  Download, 
  Upload, 
  RotateCcw, 
  Lock, 
  HardDrive,
  Save,
  Eye,
  EyeOff,
  Mail
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

export default function SettingsModule() {
  const [settings, setSettings] = useState(adminStore.getModule('settings'));
  const [passcode, setPasscode] = useState(settings.adminPasscode || '2026');
  const [showSettingsPin, setShowSettingsPin] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      const s = adminStore.getModule('settings');
      setSettings(s);
      if (s.adminPasscode) setPasscode(s.adminPasscode);
    };
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleTestEmail = async () => {
    sound.playClick();
    setTestingEmail(true);
    setEmailTestResult(null);
    const targetEmail = settings.adminEmail || 'theritiksoni@gmail.com';
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: 'Control Room Test Bot',
          email: 'system@ritiksoni.in',
          _subject: '🎬 Verification Test Inquiry for Ritik Soni',
          _captcha: 'false',
          _template: 'table',
          message: `This is a verified test inquiry sent from your Admin Control Room to confirm that inquiries sent through your portfolio contact form arrive directly in your inbox (${targetEmail}).`,
        }),
      });
      const data = await res.json();
      if (data.success === 'true' || data.success === true) {
        setEmailTestResult({
          type: 'success',
          text: `Test email dispatched to ${targetEmail}! Please check your inbox (and Spam/Promotions folder). If you see an email from FormSubmit.co asking to "Confirm your form", click the green "Activate Form" button once to enable direct delivery.`,
        });
      } else {
        setEmailTestResult({
          type: 'warning',
          text: data.message || `FormSubmit returned: ${JSON.stringify(data)}. Check ${targetEmail} for activation.`,
        });
      }
    } catch (err) {
      setEmailTestResult({
        type: 'error',
        text: `Failed to dispatch test probe: ${err.message}`,
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    sound.playClick();
    const updates = { ...settings };
    if (passcode && passcode.trim()) {
      updates.adminPasscode = passcode.trim();
    }
    adminStore.updateSettings(updates);
    showAdminToast({
      type: 'success',
      title: 'SETTINGS UPDATED',
      message: 'Studio parameters & encrypted credentials saved successfully!',
      tag: 'SYSTEM CONFIG',
    });
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
    showAdminToast({
      type: 'info',
      title: 'SNAPSHOT EXPORTED',
      message: 'Complete JSON archive downloaded to your device.',
      tag: 'BACKUP CREATED',
    });
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      sound.playClick();
      const res = adminStore.importSnapshot(event.target.result);
      if (res.success) {
        showAdminToast({
          type: 'success',
          title: 'SNAPSHOT RESTORED',
          message: 'All 13 studio modules restored from JSON backup.',
          tag: 'DATA RESTORED',
        });
      } else {
        showAdminToast({
          type: 'error',
          title: 'IMPORT ERROR',
          message: `Import failed: ${res.error}`,
          tag: 'VERIFICATION FAILED',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    sound.playClick();
    showAdminConfirm({
      title: 'Reset Entire Control Room?',
      message: 'CRITICAL WARNING: This will reset all 13 modules, project repertoire, credentials, and settings back to factory seed defaults. Are you sure you wish to continue?',
      confirmText: 'RESET ALL DATA',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.resetToDefaults();
        showAdminToast({
          type: 'warning',
          title: 'FACTORY SEED RESTORED',
          message: 'Control room data has been reset to initial production defaults.',
          tag: 'SYSTEM RESET',
        });
      },
    });
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                  Official Priority Email (Receives Inbound Inquiries)
                </label>
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] hover:bg-cyan-900/60 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>{testingEmail ? 'SENDING PROBE...' : 'SEND TEST PROBE'}</span>
                </button>
              </div>
              <input
                type="email"
                value={settings.adminEmail || ''}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                placeholder="theritiksoni@gmail.com"
              />

              {emailTestResult && (
                <div
                  className={`mt-2 p-3 rounded-xl font-mono text-[11px] leading-relaxed border ${
                    emailTestResult.type === 'success'
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200 shadow-[0_0_15px_rgba(56,189,248,0.2)]'
                      : emailTestResult.type === 'warning'
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                        : 'bg-red-950/80 border-red-500/50 text-red-200'
                  }`}
                >
                  {emailTestResult.text}
                </div>
              )}

              <div className="mt-2.5 p-3.5 rounded-xl bg-zinc-900/70 border border-white/5 space-y-1.5 text-[11px] text-zinc-400 font-sans leading-relaxed">
                <div className="text-white font-medium flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  How Client Inquiries Reach Your Inbox:
                </div>
                <p>
                  Inquiries submitted via the Contact Form are dispatched directly to <strong>{settings.adminEmail || 'theritiksoni@gmail.com'}</strong> via FormSubmit.co.
                </p>
                <p className="text-zinc-400 text-[10.5px]">
                  📌 <strong>First-Time Gmail Step:</strong> Check your inbox (and Spam/Promotions folder) for an email from <code>FormSubmit.co</code> with subject <em>"Action Required: Confirm your form"</em> and click the green <em>"Activate Form"</em> button once. After that single confirmation, all future inquiries land in your inbox automatically.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Web3Forms Access Key (Optional — 100% Instant Delivery)
              </label>
              <input
                type="text"
                value={settings.web3formsKey || ''}
                onChange={(e) => setSettings({ ...settings, web3formsKey: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                placeholder="e.g. 12345678-abcd-ef01-2345-6789abcdef01"
              />
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                Want zero-activation instant delivery? Grab a free key from <a href="https://web3forms.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline">web3forms.com</a> in 30 seconds and paste it here.
              </span>
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
                Control Room Security PIN / Passcode (Private)
              </label>
              <div className="flex items-center gap-2 max-w-sm">
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showSettingsPin ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono font-bold tracking-widest"
                    placeholder="Enter private PIN..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setShowSettingsPin(!showSettingsPin);
                    }}
                    className="p-1 text-zinc-500 hover:text-cyan-400 absolute right-3 top-1/2 -translate-y-1/2 transition-colors focus:outline-none"
                    title={showSettingsPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showSettingsPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">
                Encrypted master access credential (SHA-256 hashed). Used to authenticate into this creative control room.
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
