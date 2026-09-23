import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Share2, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function SocialLinksModule() {
  const [links, setLinks] = useState(adminStore.getModule('socialLinks'));
  const [editingLink, setEditingLink] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setLinks(adminStore.getModule('socialLinks'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingLink({
      id: `soc-${Date.now()}`,
      platform: '',
      handle: '',
      url: '',
      followers: '10K',
      badge: 'CHANNEL',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (link) => {
    sound.playClick();
    setEditingLink({ ...link });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id, current) => {
    sound.playClick();
    const updated = links.map((l) => (l.id === id ? { ...l, active: !current } : l));
    adminStore.updateSocialLinks(updated);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    const exists = links.some((l) => l.id === editingLink.id);
    let updated;
    if (exists) {
      updated = links.map((l) => (l.id === editingLink.id ? editingLink : l));
    } else {
      updated = [...links, editingLink];
    }
    adminStore.updateSocialLinks(updated);
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleDelete = (id, platform) => {
    sound.playClick();
    if (window.confirm(`Delete social channel "${platform}"?`)) {
      const updated = links.filter((l) => l.id !== id);
      adminStore.updateSocialLinks(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-cyan-400" />
            <span>Social Platforms & Priority Channels ({links.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Manage public portfolio footer links, creator handles, and direct transmission endpoints.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Channel</span>
        </button>
      </div>

      {/* Social Channels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link) => (
          <div
            key={link.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              link.active
                ? 'bg-zinc-950/70 border-white/10 hover:border-cyan-500/40'
                : 'bg-zinc-950/30 border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-400 font-bold uppercase">
                  {link.badge || 'CHANNEL'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleActive(link.id, link.active)}
                    className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors ${
                      link.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {link.active ? 'ACTIVE' : 'MUTED'}
                  </button>
                  <button
                    onClick={() => handleOpenEdit(link)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id, link.platform)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-syne font-bold text-lg text-white">
                {link.platform}
              </h3>
              <div className="text-xs font-mono text-cyan-300 font-semibold mb-2">
                {link.handle}
              </div>

              <div className="text-[11px] font-mono text-zinc-400">
                Audience / Community: <span className="text-white font-bold">{link.followers}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-zinc-400 hover:text-cyan-300 flex items-center gap-1 transition-colors truncate max-w-[220px]"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{link.url}</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingLink && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              <span>Configure Channel</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Platform Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.platform}
                  onChange={(e) => setEditingLink({ ...editingLink, platform: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Instagram"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Account Handle
                </label>
                <input
                  type="text"
                  value={editingLink.handle}
                  onChange={(e) => setEditingLink({ ...editingLink, handle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="@ritiksoni"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Full Destination URL *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.url}
                  onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="https://instagram.com/ritiksoni"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Audience Size
                  </label>
                  <input
                    type="text"
                    value={editingLink.followers}
                    onChange={(e) => setEditingLink({ ...editingLink, followers: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="48.2K"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={editingLink.badge}
                    onChange={(e) => setEditingLink({ ...editingLink, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="PRIMARY"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold"
                >
                  Save Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
