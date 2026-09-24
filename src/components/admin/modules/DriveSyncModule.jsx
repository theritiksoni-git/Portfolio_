import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import sound from '../../../utils/SoundEngine';
import {
  syncFromGoogleDrive,
  importFromDriveLinks,
  getDemoDriveStagingItems,
  extractFolderId
} from '../../../services/driveSyncService';
import {
  HardDrive,
  RefreshCw,
  CheckCircle2,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  Settings,
  Plus,
  Play,
  Search,
  X,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { parseVideoSource } from '../../../utils/videoUtils';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

export default function DriveSyncModule() {
  const [stagedProjects, setStagedProjects] = useState(adminStore.getStagedProjects());
  const [settings, setSettings] = useState(adminStore.getModule('settings') || {});
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [pastedLinks, setPastedLinks] = useState('');
  const [selectedStaged, setSelectedStaged] = useState(null); // for review & publish modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null); // for video cinema preview
  const [copiedScript, setCopiedScript] = useState(false);

  // Settings form state
  const [driveFolderUrl, setDriveFolderUrl] = useState(settings.googleDriveFolderUrl || '');
  const [driveApiKey, setDriveApiKey] = useState(settings.googleDriveApiKey || '');
  const [driveScriptUrl, setDriveScriptUrl] = useState(settings.googleDriveScriptUrl || '');
  const [autoSync, setAutoSync] = useState(settings.googleDriveAutoSync !== false);

  // Review & Publish Drawer form state
  const [publishForm, setPublishForm] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setStagedProjects(adminStore.getStagedProjects());
      const s = adminStore.getModule('settings') || {};
      setSettings(s);
      setDriveFolderUrl(s.googleDriveFolderUrl || '');
      setDriveApiKey(s.googleDriveApiKey || '');
      setDriveScriptUrl(s.googleDriveScriptUrl || '');
      setAutoSync(s.googleDriveAutoSync !== false);
    };

    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  // Save Drive Configuration
  const handleSaveDriveSettings = (e) => {
    e?.preventDefault?.();
    sound.playClick();
    const folderId = extractFolderId(driveFolderUrl);
    adminStore.updateDriveSettings({
      googleDriveFolderUrl: driveFolderUrl.trim(),
      googleDriveFolderId: folderId,
      googleDriveApiKey: driveApiKey.trim(),
      googleDriveScriptUrl: driveScriptUrl.trim(),
      googleDriveAutoSync: autoSync,
    });
    setScanNotice({
      type: 'success',
      text: 'Google Drive configuration saved successfully!',
    });
    setIsSettingsOpen(false);
    setTimeout(() => setScanNotice(null), 3500);
  };

  // Perform Live Google Drive Scan
  const handleScanDrive = async () => {
    sound.playClick();
    setIsScanning(true);
    setScanNotice(null);

    const folderId = extractFolderId(driveFolderUrl || settings.googleDriveFolderUrl);
    const apiKey = (driveApiKey || settings.googleDriveApiKey || '').trim();
    const scriptUrl = (driveScriptUrl || settings.googleDriveScriptUrl || '').trim();

    try {
      const res = await syncFromGoogleDrive({
        folderUrl: driveFolderUrl || settings.googleDriveFolderUrl,
        folderId,
        apiKey,
        scriptUrl,
      });

      if (res.success && Array.isArray(res.items) && res.items.length > 0) {
        const added = adminStore.addMultipleStagedProjects(res.items);
        adminStore.updateDriveSettings({ lastDriveSync: new Date().toISOString() });
        setScanNotice({
          type: 'success',
          text: `Scan complete! Discovered ${res.items.length} file(s) (${added.length} new items staged in review queue).`,
        });
      } else if (res.needsConfig) {
        // Helpful prompt if credentials missing
        setScanNotice({
          type: 'info',
          text: res.message,
        });
        setIsSettingsOpen(true);
      } else {
        setScanNotice({
          type: 'info',
          text: 'No new video files found in the specified Google Drive folder, or all files are already staged.',
        });
      }
    } catch (err) {
      setScanNotice({
        type: 'error',
        text: `Sync error: ${err.message}`,
      });
    } finally {
      setIsScanning(false);
    }
  };

  // Load Demo Drive items so user can test the workflow instantly
  const handleLoadDemo = () => {
    sound.playClick();
    const demoItems = getDemoDriveStagingItems();
    const added = adminStore.addMultipleStagedProjects(demoItems);
    setScanNotice({
      type: 'success',
      text: `Loaded ${added.length} test project video(s) into your Google Drive Review Queue!`,
    });
    setTimeout(() => setScanNotice(null), 4000);
  };

  // Import from pasted Drive links
  const handleImportPastedLinks = (e) => {
    e.preventDefault();
    sound.playClick();
    const items = importFromDriveLinks(pastedLinks);
    if (items.length > 0) {
      const added = adminStore.addMultipleStagedProjects(items);
      setScanNotice({
        type: 'success',
        text: `Successfully staged ${added.length} Google Drive video asset(s) for review!`,
      });
      setPastedLinks('');
      setIsImportModalOpen(false);
    } else {
      setScanNotice({
        type: 'error',
        text: 'No valid Google Drive file links detected. Ensure links match drive.google.com/file/d/... format.',
      });
    }
    setTimeout(() => setScanNotice(null), 4000);
  };

  // Open Review & Publish Modal for a specific staged item
  const handleOpenPublishModal = (stagedItem) => {
    sound.playClick();
    setSelectedStaged(stagedItem);
    setPublishForm({
      title: stagedItem.title || 'Untitled Project',
      client: stagedItem.client || 'Client Commission',
      category: stagedItem.category || 'corporate',
      role: stagedItem.role || 'Video Production Executive & Editor',
      year: stagedItem.year || String(new Date().getFullYear()),
      duration: stagedItem.duration || '01:30',
      timecode: stagedItem.timecode || 'TC 00:01:30:00',
      aspectRatio: stagedItem.aspectRatio || '16:9 UHD',
      resolution: stagedItem.resolution || '4K DCI (3840x2160)',
      tools: stagedItem.tools || ['Adobe Premiere Pro', 'DaVinci Resolve'],
      badge: stagedItem.badge || 'NEW CUT',
      tagline: stagedItem.tagline || '',
      synopsis: stagedItem.synopsis || '',
      videoEmbedUrl: stagedItem.videoEmbedUrl || '',
      previewPoster: stagedItem.previewPoster || '/img/projects/adentech-lineup-master.jpg',
    });
  };

  // Final Action: Accept & Publish to Live Portfolio
  const handleConfirmPublish = (e) => {
    e.preventDefault();
    sound.playClick();
    if (!selectedStaged) return;

    adminStore.acceptAndPublishProject(selectedStaged.id, publishForm);
    setSelectedStaged(null);
    setPublishForm(null);

    showAdminToast({
      type: 'public',
      title: 'PROJECT PUBLISHED LIVE',
      message: `🎉 "${publishForm.title}" is now PUBLISHED and LIVE on your portfolio!`,
      tag: 'DRIVE INGESTION LIVE',
    });
  };

  // Final Action: Save as Hidden Draft in Admin
  const handleSaveDraft = (e) => {
    e.preventDefault();
    sound.playClick();
    if (!selectedStaged) return;

    adminStore.saveAsDraftProject(selectedStaged.id, publishForm);
    setSelectedStaged(null);
    setPublishForm(null);

    showAdminToast({
      type: 'private',
      title: 'SAVED AS PRIVATE DRAFT',
      message: `"${publishForm.title}" saved as a hidden Draft in your Admin Projects catalog.`,
      tag: 'ADMIN DRAFT',
    });
  };

  // Quick 1-Click Instant Accept & Publish
  const handleQuickPublish = (item) => {
    sound.playClick();
    adminStore.acceptAndPublishProject(item.id, {
      title: item.title,
      client: item.client || 'Client Production',
      category: item.category || 'corporate',
    });
    showAdminToast({
      type: 'public',
      title: '1-CLICK PUBLISH COMPLETE',
      message: `"${item.title}" instantly published to your live portfolio!`,
      tag: 'FAST PUBLISH',
    });
  };

  // Dismiss / Reject Staged item
  const handleDismiss = (id, title) => {
    sound.playClick();
    adminStore.dismissStagedProject(id);
    showAdminToast({
      type: 'info',
      title: 'STAGED ASSET DISMISSED',
      message: `Dismissed "${title || 'item'}" from review queue.`,
      tag: 'QUEUE UPDATED',
    });
  };

  // Clear all staged items
  const handleClearAllStaged = () => {
    sound.playClick();
    showAdminConfirm({
      title: 'Clear Drive Staging Queue?',
      message: 'Are you sure you want to clear all pending Google Drive items from the review queue? (This will not delete any files from your actual Google Drive).',
      confirmText: 'CLEAR QUEUE',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.clearStagedProjects();
        showAdminToast({
          type: 'error',
          title: 'STAGING QUEUE CLEARED',
          message: 'All staged Google Drive items have been cleared.',
          tag: 'PURGE COMPLETE',
        });
      },
    });
  };

  // Copy sample Google Apps Script code
  const handleCopyScript = () => {
    const scriptCode = `// Google Apps Script: Paste into script.google.com and deploy as Web App
function doGet() {
  var folderId = "${extractFolderId(driveFolderUrl) || 'YOUR_FOLDER_ID_HERE'}";
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();
  var result = [];
  while (files.hasNext()) {
    var file = files.next();
    result.push({
      id: file.getId(),
      name: file.getName(),
      mimeType: file.getMimeType(),
      size: file.getSize()
    });
  }
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}`;
    navigator.clipboard.writeText(scriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // Filter staged projects by search query
  const filteredStaged = stagedProjects.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.fileName?.toLowerCase().includes(q) ||
      p.client?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
              <HardDrive className="w-6 h-6 text-cyan-400" />
              <span>Google Drive Cloud Sync & Staging Radar</span>
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
              AUTO-RADAR
            </span>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5 font-mono">
            {settings.googleDriveFolderUrl
              ? `Connected Folder: ${extractFolderId(settings.googleDriveFolderUrl) || 'Configured'}`
              : 'Syncs your Google Drive projects folder into a private review queue before public release.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              setIsSettingsOpen(!isSettingsOpen);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Folder Config</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setIsImportModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Paste Link(s)</span>
          </button>

          <button
            onClick={handleScanDrive}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-102"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Drive...' : 'Scan Folder Now'}</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {scanNotice && (
        <div
          className={`p-4 rounded-xl font-mono text-xs flex items-center justify-between gap-3 animate-fadeIn ${
            scanNotice.type === 'success'
              ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200'
              : scanNotice.type === 'error'
              ? 'bg-red-950/60 border border-red-500/40 text-red-300'
              : 'bg-zinc-900 border border-white/10 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {scanNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <span>{scanNotice.text}</span>
          </div>
          <button
            onClick={() => setScanNotice(null)}
            className="text-zinc-500 hover:text-white text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Privacy & Staging Isolation Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-zinc-950/70 border border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span>Private Staging Gate Guarantee</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ZERO LEAKS TO PUBLIC
              </span>
            </div>
            <p className="text-zinc-400 text-xs font-mono leading-relaxed">
              Files synced from your Google Drive appear <strong>strictly in this private admin queue</strong>. They are never published to your live portfolio (<code>www.ritiksoni.in</code>) until you review and explicitly click <strong>"Accept & Publish"</strong>.
            </p>
          </div>
        </div>

        {stagedProjects.length === 0 && (
          <button
            onClick={handleLoadDemo}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
          >
            + Load Demo Drive Video Assets
          </button>
        )}
      </div>

      {/* Settings Drawer / Accordion */}
      {isSettingsOpen && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-cyan-500/40 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 font-mono text-sm text-cyan-400 font-bold">
              <Settings className="w-4 h-4" />
              <span>GOOGLE DRIVE FOLDER & API CONFIGURATION</span>
            </div>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveDriveSettings} className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Google Drive Folder URL or Folder ID</span>
                <span className="text-[10px] text-zinc-500">e.g. drive.google.com/drive/folders/1aBcDe...</span>
              </label>
              <input
                type="text"
                value={driveFolderUrl}
                onChange={(e) => setDriveFolderUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none"
              />
              <p className="text-[11px] text-zinc-500 font-mono mt-1">
                Tip: In Google Drive, right click your projects folder &rarr; Share &rarr; "Anyone with the link can view" &rarr; Copy link.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Google Cloud API Key (Optional)</span>
                  <span className="text-[10px] text-cyan-400/80">Direct REST</span>
                </label>
                <input
                  type="text"
                  value={driveApiKey}
                  onChange={(e) => setDriveApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Optional: Free Google Drive API v3 key from console.cloud.google.com.
                </p>
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Google Apps Script Webhook URL (Zero-Console)</span>
                  <span className="text-[10px] text-emerald-400">100% Free</span>
                </label>
                <input
                  type="text"
                  value={driveScriptUrl}
                  onChange={(e) => setDriveScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 font-mono mt-1">
                  Want instant zero-config sync without Google Cloud console?{' '}
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 ml-1 underline"
                  >
                    {copiedScript ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 inline" />
                        <span className="text-emerald-400 font-bold">Copied script code!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 inline" />
                        <span>Copy 10-line Apps Script</span>
                      </>
                    )}
                  </button>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-zinc-400">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded border-white/20 bg-zinc-900 text-cyan-500 focus:ring-0"
                />
                <span>Automatically check folder on control room launch</span>
              </label>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
              >
                Save Folder Config
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Paste Links Quick Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-2xl bg-zinc-950 border border-cyan-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-syne text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <span>Quick Inbound: Paste Google Drive Links</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportPastedLinks} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1.5">
                  Paste Google Drive Video Link(s) (One per line)
                </label>
                <textarea
                  rows="5"
                  value={pastedLinks}
                  onChange={(e) => setPastedLinks(e.target.value)}
                  placeholder={`https://drive.google.com/file/d/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz/view?usp=sharing\nhttps://drive.google.com/file/d/1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h/view?usp=sharing`}
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono text-xs placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/60 resize-none"
                  required
                />
                <p className="text-[11px] text-zinc-500 font-mono mt-1">
                  Each link will be parsed and placed into your private Staging Queue for review.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Import to Staging Queue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Review & Approval Queue Section */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>STAGED INBOUND ASSETS</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-black font-bold text-[10px]">
                {stagedProjects.length} PENDING REVIEW
              </span>
            </span>
            {settings.lastDriveSync && (
              <span className="text-[10px] text-zinc-500 font-mono hidden md:inline">
                • Last scanned: {new Date(settings.lastDriveSync).toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter staged assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40 font-mono"
              />
            </div>

            {stagedProjects.length > 0 && (
              <button
                onClick={handleClearAllStaged}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-red-950/60 hover:text-red-300 border border-white/10 text-zinc-400 font-mono text-xs transition-colors flex items-center gap-1"
                title="Clear queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Queue</span>
              </button>
            )}
          </div>
        </div>

        {/* Staged Cards Grid */}
        {filteredStaged.length === 0 ? (
          <div className="p-12 rounded-3xl bg-zinc-950/50 border border-dashed border-white/10 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-cyan-400">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-white uppercase">
                Staging Queue is Clear
              </h3>
              <p className="text-zinc-500 text-xs font-mono max-w-md mx-auto mt-1">
                No new files pending approval. Click <strong>"Scan Folder Now"</strong> to check your Google Drive folder, paste direct links, or load sample demo assets to test.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleScanDrive}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all"
              >
                Scan Google Drive
              </button>
              <button
                onClick={handleLoadDemo}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 font-mono text-xs transition-all"
              >
                Load Demo Drive Video Assets
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaged.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-950 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all flex flex-col overflow-hidden group"
              >
                {/* Poster / Drive Preview Container */}
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  <img
                    src={item.previewPoster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-100"
                    onError={(e) => {
                      e.target.src = '/img/projects/adentech-lineup-master.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

                  {/* Play Video Trigger */}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setPreviewVideoUrl(item.videoEmbedUrl);
                    }}
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                    title="Play Drive Preview"
                  >
                    <div className="w-12 h-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.6)]">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </button>

                  {/* Status Tag */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-amber-500/90 text-black font-mono text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                      <EyeOff className="w-3 h-3" />
                      <span>PENDING APPROVAL</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                      {item.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <a
                      href={item.driveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-white/10 transition-colors inline-flex"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                    <span className="truncate max-w-[140px]">{item.fileName}</span>
                    <span>{item.sizeFormatted || 'Video Asset'}</span>
                  </div>
                </div>

                {/* Card Content & Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                      Client: {item.client || 'Client Commission'}
                    </div>
                    <h4 className="font-syne font-bold text-base text-white group-hover:text-cyan-200 transition-colors line-clamp-1 mt-0.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light leading-relaxed">
                      {item.tagline || item.synopsis}
                    </p>
                  </div>

                  {/* Staging Actions: Accept & Publish vs Save as Draft vs Dismiss */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenPublishModal(item)}
                        className="py-2.5 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept & Publish</span>
                      </button>

                      <button
                        onClick={() => handleQuickPublish(item)}
                        className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 font-mono text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1"
                        title="Instant publish with detected defaults"
                      >
                        <span>1-Click Publish</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                      <button
                        onClick={() => {
                          sound.playClick();
                          adminStore.saveAsDraftProject(item.id, {
                            title: item.title,
                            client: item.client,
                            category: item.category,
                          });
                          setScanNotice({
                            type: 'info',
                            text: `Saved "${item.title}" as hidden Draft in Projects catalog.`,
                          });
                        }}
                        className="text-zinc-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Save as Hidden Draft</span>
                      </button>

                      <button
                        onClick={() => handleDismiss(item.id, item.title)}
                        className="text-red-400/80 hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Dismiss</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Publish Customization Modal Drawer */}
      {selectedStaged && publishForm && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none">
          <div className="relative w-full max-w-3xl rounded-3xl bg-zinc-950 border border-cyan-500/50 p-6 sm:p-8 space-y-6 shadow-[0_20px_70px_rgba(0,0,0,0.95)] my-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-bold">
                  PROJECT APPROVAL & METADATA GATEWAY
                </span>
                <h3 className="font-syne text-xl sm:text-2xl font-bold text-white mt-0.5">
                  Publish to Live Portfolio: {publishForm.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedStaged(null);
                  setPublishForm(null);
                }}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Preview Check */}
            {publishForm.videoEmbedUrl && (
              <div className="rounded-xl overflow-hidden bg-black aspect-video border border-white/10 max-h-56">
                <iframe
                  src={parseVideoSource(publishForm.videoEmbedUrl).src}
                  title="Google Drive Preview"
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                />
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleConfirmPublish} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1">
                    PROJECT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={publishForm.title}
                    onChange={(e) => setPublishForm({ ...publishForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1">
                    CLIENT / BRAND
                  </label>
                  <input
                    type="text"
                    required
                    value={publishForm.client}
                    onChange={(e) => setPublishForm({ ...publishForm, client: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1">
                    PORTFOLIO CATEGORY
                  </label>
                  <select
                    value={publishForm.category}
                    onChange={(e) => setPublishForm({ ...publishForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none"
                  >
                    <option value="corporate">Corporate / Client Production</option>
                    <option value="smm">Social Media Strategy & SMM</option>
                    <option value="reels">High-Retention Short-Form Reels</option>
                    <option value="cinematic">Cinematic & Narrative</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1">
                    FEATURE BADGE
                  </label>
                  <input
                    type="text"
                    value={publishForm.badge}
                    onChange={(e) => setPublishForm({ ...publishForm, badge: e.target.value })}
                    placeholder="FEATURED CLIENT, VIRAL REEL, etc."
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1">
                  PROJECT TAGLINE / SYNOPSIS
                </label>
                <textarea
                  rows="2"
                  value={publishForm.tagline}
                  onChange={(e) => setPublishForm({ ...publishForm, tagline: e.target.value })}
                  placeholder="One sentence compelling summary of the visual execution..."
                  className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-zinc-300 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>PREVIEW POSTER IMAGE URL</span>
                  <span className="text-[10px] text-zinc-500">Poster shown on cards</span>
                </label>
                <input
                  type="text"
                  value={publishForm.previewPoster}
                  onChange={(e) => setPublishForm({ ...publishForm, previewPoster: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 focus:border-cyan-500/60 text-white font-mono text-xs focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  Save as Hidden Draft (Admin Only)
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedStaged(null);
                      setPublishForm(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all"
                  >
                    Publish to Live Portfolio Now &rarr;
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Cinema Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-950 border border-cyan-500/40 overflow-hidden shadow-2xl space-y-2 p-2">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10">
              <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5 font-bold">
                <Play className="w-3.5 h-3.5 fill-cyan-400" />
                <span>GOOGLE DRIVE PREVIEW TERMINAL</span>
              </span>
              <button
                onClick={() => setPreviewVideoUrl(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black rounded-xl overflow-hidden">
              <iframe
                src={parseVideoSource(previewVideoUrl).src}
                title="Cinema Preview"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
