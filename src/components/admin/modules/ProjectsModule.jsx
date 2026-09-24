import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Film, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  X,
  HardDrive
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function ProjectsModule({ initialOpenNew = false, onNavigateDrive }) {
  const [projects, setProjects] = useState(adminStore.getModule('projects'));
  const [stagedCount, setStagedCount] = useState(adminStore.getStagedProjects().length);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(initialOpenNew);

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(adminStore.getModule('projects'));
      setStagedCount(adminStore.getStagedProjects().length);
    };
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingProject({
      id: '',
      title: '',
      category: 'corporate',
      client: '',
      role: 'Video Production Executive & Post Lead',
      year: '2025',
      duration: '01:30',
      timecode: 'TC 00:01:30:00',
      aspectRatio: '16:9 UHD',
      resolution: '4K DCI (3840x2160)',
      tools: ['Adobe Premiere Pro', 'After Effects'],
      badge: 'NEW CUT',
      tagline: '',
      synopsis: '',
      deliverables: ['Master 4K Cinematic Cut', 'Social Media 9:16 Cutdowns'],
      videoEmbedUrl: '',
      previewPoster: '/img/projects/adentech-lineup-master.jpg',
      status: 'Published',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    sound.playClick();
    setEditingProject({ ...project });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingProject.id) {
      adminStore.updateProject(editingProject.id, editingProject);
    } else {
      adminStore.addProject(editingProject);
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = (id, title) => {
    sound.playClick();
    if (window.confirm(`Are you sure you want to delete project: "${title}"?`)) {
      adminStore.deleteProject(id);
    }
  };

  const handleDuplicate = (project) => {
    sound.playClick();
    const copy = {
      ...project,
      id: `copy-${Date.now()}`,
      title: `${project.title} (Copy)`,
    };
    adminStore.addProject(copy);
  };

  const filtered = projects.filter((p) => {
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Film className="w-6 h-6 text-cyan-400" />
            <span>Project Archives ({projects.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Manage commercial cuts, viral reels, documentaries, and case studies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onNavigateDrive && (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateDrive();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] group"
              title="Open Google Drive Sync & Review Staged Projects"
            >
              <HardDrive className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Google Drive Sync</span>
              {stagedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-bold animate-pulse">
                  {stagedCount} PENDING
                </span>
              )}
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Pending Google Drive Staging Gate Banner */}
      {stagedCount > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/80 to-zinc-950 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono shadow-lg">
          <div className="flex items-start sm:items-center gap-3 text-cyan-200">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
              <HardDrive className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-white tracking-wide">
                GOOGLE DRIVE SYNC GATE: {stagedCount} NEW ASSET{stagedCount > 1 ? 'S' : ''} PENDING REVIEW
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                These video projects are securely staged inside your Admin dashboard and will <strong>never</strong> appear on your public website until you allow or publish them.
              </div>
            </div>
          </div>
          {onNavigateDrive && (
            <button
              onClick={() => {
                sound.playClick();
                onNavigateDrive();
              }}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold uppercase tracking-wider text-[11px] self-start sm:self-auto transition-all shrink-0 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
            >
              Open Drive Queue &rarr;
            </button>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 overflow-x-auto text-xs font-mono">
          {[
            { id: 'all', label: 'ALL' },
            { id: 'corporate', label: 'CORPORATE' },
            { id: 'smm', label: 'SMM' },
            { id: 'reels', label: 'REELS' },
            { id: 'cinematic', label: 'CINEMATIC' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playHover();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg tracking-wider transition-colors ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Projects Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="group rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col overflow-hidden"
          >
            {/* Project Poster Header */}
            <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
              <img
                src={proj.previewPoster}
                alt={proj.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                  {proj.category}
                </span>
                {proj.badge && (
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    {proj.badge}
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={() => handleDuplicate(proj)}
                  title="Duplicate project"
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(proj)}
                  title="Edit project"
                  className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-black border border-cyan-500/40 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  title="Delete project"
                  className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span>{proj.year || '2024'}</span>
                <span>{proj.duration || '01:45'}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[11px] font-mono text-cyan-400/90 uppercase tracking-wider font-semibold">
                  {proj.client || 'Ritik Soni'}
                </div>
                <h3 className="font-syne font-bold text-base text-white group-hover:text-cyan-200 transition-colors line-clamp-1">
                  {proj.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light">
                  {proj.tagline || proj.synopsis}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="truncate max-w-[160px]">{proj.resolution || '4K DCI'}</span>
                <span className="text-emerald-400/90 font-bold">{proj.views || '1.2M'} Views</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal Drawer */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/60">
              <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-cyan-400" />
                <span>{editingProject.id ? 'Edit Project' : 'Add New Project'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g., Red Bull Adrenaline Master"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g., Red Bull, Reliance, Personal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="corporate">Corporate / Client</option>
                    <option value="smm">Social Media (SMM)</option>
                    <option value="reels">Short-Form / Reels</option>
                    <option value="cinematic">Cinematic / Creative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Year / Period
                  </label>
                  <input
                    type="text"
                    value={editingProject.year}
                    onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="2025"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingProject.duration}
                    onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="01:45"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Tagline / Hook Statement
                </label>
                <input
                  type="text"
                  value={editingProject.tagline}
                  onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. High-speed cinematic visual rhythm with heavy motion impact."
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Synopsis / Case Study Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.synopsis}
                  onChange={(e) => setEditingProject({ ...editingProject, synopsis: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none"
                  placeholder="Explain the editorial strategy, rhythm pacing, sound design, and impact..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Poster Image URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.previewPoster}
                    onChange={(e) => setEditingProject({ ...editingProject, previewPoster: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Video Embed URL (Drive / YouTube / Vimeo)
                  </label>
                  <input
                    type="text"
                    value={editingProject.videoEmbedUrl}
                    onChange={(e) => setEditingProject({ ...editingProject, videoEmbedUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
