import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

export default function ServicesModule() {
  const [services, setServices] = useState(adminStore.getModule('services'));
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setServices(adminStore.getModule('services'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingService({
      id: '',
      title: '',
      badge: 'COMMERCIAL',
      category: 'Video Production',
      description: '',
      deliverables: ['Master 4K Cut', 'Reels Package', 'Sound Mastering'],
      turnaround: '1 - 2 Weeks',
      startingRate: '$2,000 / project',
      active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    sound.playClick();
    setEditingService({ ...srv });
    setIsModalOpen(true);
  };

  const handleToggleActive = (id, current) => {
    sound.playClick();
    adminStore.updateService(id, { active: !current });
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingService.id) {
      adminStore.updateService(editingService.id, editingService);
    } else {
      adminStore.addService(editingService);
    }
    setIsModalOpen(false);
    showAdminToast({
      type: 'success',
      title: 'SERVICE SUITE SAVED',
      message: `Commercial package "${editingService.title}" updated.`,
      tag: 'SERVICES DIRECTORY',
    });
    setEditingService(null);
  };

  const handleDelete = (id, title) => {
    sound.playClick();
    showAdminConfirm({
      title: 'Delete Service Offering?',
      message: `Are you sure you want to remove package "${title}" from your commercial offerings?`,
      confirmText: 'DELETE SERVICE',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.deleteService(id);
        showAdminToast({
          type: 'error',
          title: 'SERVICE REMOVED',
          message: `"${title}" has been deleted.`,
          tag: 'PURGE COMPLETE',
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
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>Commercial Services & Packages ({services.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Configure client service offerings, monthly retainers, turnaround timelines, and rates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Package</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              srv.active
                ? 'bg-zinc-950/70 border-white/10 hover:border-cyan-500/40'
                : 'bg-zinc-950/30 border-white/5 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-400 font-bold uppercase">
                    {srv.badge || 'SERVICE'}
                  </span>
                  <button
                    onClick={() => handleToggleActive(srv.id, srv.active)}
                    className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase transition-colors ${
                      srv.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {srv.active ? 'ACTIVE OFFERING' : 'PAUSED'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(srv)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id, srv.title)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-syne font-bold text-lg text-white">
                {srv.title}
              </h3>
              <div className="text-xs font-mono text-cyan-400/90 mb-3">
                {srv.category}
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed font-light mb-4">
                {srv.description}
              </p>

              {srv.deliverables && srv.deliverables.length > 0 && (
                <div className="space-y-1.5 mb-4">
                  {srv.deliverables.map((deliv, dIdx) => (
                    <div key={dIdx} className="text-xs text-zinc-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {srv.turnaround}
              </span>
              <span className="text-emerald-400 font-bold text-sm">
                {srv.startingRate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>{editingService.id ? 'Edit Service Package' : 'Create Service Package'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Viral Reels Direction Retainer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={editingService.category}
                    onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="SMM & Viral Strategy"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    value={editingService.badge}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="MOST POPULAR / FLAGSHIP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Turnaround Speed
                  </label>
                  <input
                    type="text"
                    value={editingService.turnaround}
                    onChange={(e) => setEditingService({ ...editingService, turnaround: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="7 - 10 Days"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Starting Rate / Investment
                  </label>
                  <input
                    type="text"
                    value={editingService.startingRate}
                    onChange={(e) => setEditingService({ ...editingService, startingRate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="$2,500 / month"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Package Overview & Value Proposition
                </label>
                <textarea
                  rows={3}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="Detail the scope and workflow..."
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingService.deliverables ? editingService.deliverables.join('\n') : ''}
                  onChange={(e) => setEditingService({ ...editingService, deliverables: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="30-Day Content Roadmap&#10;15 High-Retention Master Reels&#10;Audio Mastering"
                />
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
