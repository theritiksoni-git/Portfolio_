import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Building, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function ClientsModule() {
  const [clients, setClients] = useState(adminStore.getModule('clients'));
  const [editingClient, setEditingClient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setClients(adminStore.getModule('clients'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingClient({
      id: '',
      name: '',
      industry: 'Technology & Enterprise',
      projectsCount: 1,
      logoUrl: '',
      status: 'Active Partner',
      nda: false,
      quote: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cli) => {
    sound.playClick();
    setEditingClient({ ...cli });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingClient.id) {
      adminStore.updateClient(editingClient.id, editingClient);
    } else {
      adminStore.addClient(editingClient);
    }
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id, name) => {
    sound.playClick();
    if (window.confirm(`Delete client "${name}" from directory?`)) {
      adminStore.deleteClient(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-cyan-400" />
            <span>Brand Partners & Client Roster ({clients.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Manage enterprise brand engagements, commercial partners, NDA classifications & testimonials.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand Partner</span>
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((cli) => (
          <div
            key={cli.id}
            className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-[9px] text-zinc-300 font-bold uppercase">
                  {cli.status || 'Active Partner'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(cli)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cli.id, cli.name)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Logo / Thumbnail Box */}
              <div className="h-16 w-full rounded-xl bg-zinc-900/60 border border-white/5 flex items-center justify-center p-3 mb-3">
                {cli.logoUrl ? (
                  <img
                    src={cli.logoUrl}
                    alt={cli.name}
                    className="max-h-10 max-w-full object-contain filter invert opacity-80 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Building className="w-6 h-6 text-cyan-400/60" />
                )}
              </div>

              <h3 className="font-syne font-bold text-lg text-white">
                {cli.name}
              </h3>
              <div className="text-xs font-mono text-zinc-400">
                {cli.industry}
              </div>

              {cli.quote && (
                <p className="text-xs text-zinc-400 italic mt-3 pt-3 border-t border-white/5 line-clamp-2">
                  "{cli.quote}"
                </p>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-cyan-400 font-bold">
                {cli.projectsCount} Master Cuts
              </span>
              {cli.nda ? (
                <span className="text-amber-400/90 flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  NDA PROTECTED
                </span>
              ) : (
                <span className="text-emerald-400/90 text-[10px]">PUBLIC SHOWCASE</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Building className="w-5 h-5 text-cyan-400" />
              <span>{editingClient.id ? 'Edit Brand Partner' : 'Add Brand Partner'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Brand / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingClient.name}
                  onChange={(e) => setEditingClient({ ...editingClient, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. Red Bull"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={editingClient.industry}
                    onChange={(e) => setEditingClient({ ...editingClient, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Energy & Media"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Completed Cuts Count
                  </label>
                  <input
                    type="number"
                    value={editingClient.projectsCount}
                    onChange={(e) => setEditingClient({ ...editingClient, projectsCount: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Logo Asset URL
                </label>
                <input
                  type="text"
                  value={editingClient.logoUrl}
                  onChange={(e) => setEditingClient({ ...editingClient, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="/img/client-logos/redbull.png"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Client Testimonial Quote
                </label>
                <textarea
                  rows={2}
                  value={editingClient.quote || ''}
                  onChange={(e) => setEditingClient({ ...editingClient, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="Direct client praise or feedback..."
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="nda-checkbox"
                  checked={editingClient.nda || false}
                  onChange={(e) => setEditingClient({ ...editingClient, nda: e.target.checked })}
                  className="rounded bg-zinc-900 border-white/10 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="nda-checkbox" className="text-zinc-300 font-mono text-[11px] cursor-pointer">
                  Protected under Non-Disclosure Agreement (NDA)
                </label>
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
