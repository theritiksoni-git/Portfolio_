import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Image, 
  Film, 
  Music, 
  FileText, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Trash2, 
  HardDrive
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

export default function MediaModule() {
  const [media, setMedia] = useState(adminStore.getModule('media'));
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    title: '',
    type: 'video',
    category: 'Commercial',
    resolution: '4K DCI (3840x2160)',
    aspectRatio: '16:9 UHD',
    size: '1.2 GB',
    url: '',
    tags: 'Commercial, 4K',
  });

  useEffect(() => {
    const handleUpdate = () => setMedia(adminStore.getModule('media'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleCopy = (id, url) => {
    sound.playClick();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showAdminToast({
      type: 'info',
      title: 'MEDIA URL COPIED',
      message: `Copied "${url}" to clipboard.`,
      tag: 'CLIPBOARD SYNC',
      duration: 2500,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id, title) => {
    sound.playClick();
    showAdminConfirm({
      title: 'Delete Media Asset?',
      message: `Are you sure you want to delete media asset "${title}"? This item will be removed from your master asset library.`,
      confirmText: 'DELETE ASSET',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.deleteMedia(id);
        showAdminToast({
          type: 'error',
          title: 'ASSET REMOVED',
          message: `"${title}" has been deleted from the media library.`,
          tag: 'MEDIA PURGED',
        });
      },
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    sound.playClick();
    const created = {
      ...newAsset,
      tags: newAsset.tags.split(',').map((t) => t.trim()),
    };
    adminStore.addMedia(created);
    setIsAddOpen(false);
    showAdminToast({
      type: 'success',
      title: 'ASSET INGESTED',
      message: `"${created.title}" added to the studio media repository.`,
      tag: 'MEDIA INGEST',
    });
    setNewAsset({
      title: '',
      type: 'video',
      category: 'Commercial',
      resolution: '4K DCI (3840x2160)',
      aspectRatio: '16:9 UHD',
      size: '1.2 GB',
      url: '',
      tags: 'Commercial, 4K',
    });
  };

  const filtered = media.filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Image className="w-6 h-6 text-cyan-400" />
            <span>Digital Asset Manager (DAM)</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Cloud video cuts, high-res posters, client logos, audio stems & press materials.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setIsAddOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Link Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 overflow-x-auto text-xs font-mono">
          {[
            { id: 'all', label: 'ALL ASSETS', icon: HardDrive },
            { id: 'video', label: 'VIDEOS', icon: Film },
            { id: 'image', label: 'IMAGES', icon: Image },
            { id: 'audio', label: 'AUDIO STEMS', icon: Music },
            { id: 'document', label: 'DOCS / PDF', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playHover();
                  setFilterType(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg tracking-wider transition-colors ${
                  filterType === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by name or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                  {item.type === 'video' && <Film className="w-4 h-4" />}
                  {item.type === 'image' && <Image className="w-4 h-4" />}
                  {item.type === 'audio' && <Music className="w-4 h-4" />}
                  {item.type === 'document' && <FileText className="w-4 h-4" />}
                </div>
                <div className="truncate">
                  <h4 className="text-sm font-semibold text-white group-hover:text-cyan-200 transition-colors truncate">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {item.category} • {item.size}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id, item.title)}
                title="Delete asset"
                className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Asset Preview Thumbnail / Info Box */}
            <div className="h-28 w-full rounded-xl bg-zinc-900/80 border border-white/5 flex items-center justify-center overflow-hidden relative">
              {item.type === 'image' || item.type === 'video' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-500 font-mono text-xs gap-1">
                  {item.type === 'audio' ? <Music className="w-6 h-6 text-cyan-400/60" /> : <FileText className="w-6 h-6 text-sky-400/60" />}
                  <span>{item.resolution}</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] font-mono text-cyan-300">
                {item.aspectRatio}
              </div>
            </div>

            {/* Tags & Action Bar */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-1 overflow-hidden">
                {item.tags?.slice(0, 2).map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-900 text-[9px] font-mono text-zinc-400 truncate">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleCopy(item.id, item.url)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-zinc-300 hover:text-cyan-300 flex items-center gap-1 transition-all"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Asset Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-cyan-400" />
              <span>Register Digital Asset</span>
            </h3>

            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.title}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Master High-Bitrate Reel 4K"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Asset Type
                  </label>
                  <select
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="video">Video</option>
                    <option value="image">Image</option>
                    <option value="audio">Audio</option>
                    <option value="document">Document / PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Resolution / Spec
                  </label>
                  <input
                    type="text"
                    value={newAsset.resolution}
                    onChange={(e) => setNewAsset({ ...newAsset, resolution: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="4K DCI / 1080p"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Storage / Cloud URL *
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.url}
                  onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://images.unsplash... or /audio/..."
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newAsset.tags}
                  onChange={(e) => setNewAsset({ ...newAsset, tags: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Commercial, 4K, Color Graded"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
