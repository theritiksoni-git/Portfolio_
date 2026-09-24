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
  HardDrive,
  Eye,
  EyeOff,
  Lock,
  Globe
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function ProjectsModule({ initialOpenNew = false, onNavigateDrive }) {
  const [projects, setProjects] = useState(adminStore.getModule('projects'));
  const [stagedCount, setStagedCount] = useState(adminStore.getStagedProjects().length);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVisibility, setActiveVisibility] = useState('all'); // 'all' | 'public' | 'private'
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(initialOpenNew);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const handleUpdate = () => {
      setProjects(adminStore.getModule('projects'));
      setStagedCount(adminStore.getStagedProjects().length);
    };
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const publicCount = projects.filter(
    (p) => !p.isPrivate && p.visibility !== 'private' && p.status !== 'Private' && p.status !== 'Draft'
  ).length;
  const privateCount = projects.length - publicCount;

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
      isPrivate: false,
      visibility: 'public',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    sound.playClick();
    const isPrivate = Boolean(
      project.isPrivate || project.visibility === 'private' || project.status === 'Private' || project.status === 'Draft'
    );
    setEditingProject({
      ...project,
      isPrivate,
      visibility: isPrivate ? 'private' : 'public',
      status: project.status || (isPrivate ? 'Private' : 'Published'),
    });
    setIsModalOpen(true);
  };

  const handleToggleVisibility = (project) => {
    sound.playClick();
    const updated = adminStore.toggleProjectVisibility(project.id);
    const isNowPrivate = updated?.isPrivate;
    setToastMessage({
      type: isNowPrivate ? 'private' : 'public',
      text: isNowPrivate
        ? `🔒 "${project.title}" marked PRIVATE (hidden from public portfolio).`
        : `🌐 "${project.title}" marked PUBLIC (now live on portfolio).`,
    });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    const isPrivate = Boolean(editingProject.isPrivate);
    const payload = {
      ...editingProject,
      isPrivate,
      visibility: isPrivate ? 'private' : 'public',
      status: isPrivate
        ? (editingProject.status === 'Draft' ? 'Draft' : 'Private')
        : (editingProject.status === 'Private' ? 'Published' : (editingProject.status || 'Published')),
    };

    if (payload.id) {
      adminStore.updateProject(payload.id, payload);
    } else {
      adminStore.addProject(payload);
    }
    setIsModalOpen(false);
    setEditingProject(null);
    setToastMessage({
      type: isPrivate ? 'private' : 'public',
      text: `✓ Project "${payload.title}" saved successfully (${isPrivate ? 'PRIVATE' : 'PUBLIC'}).`,
    });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = (id, title) => {
    sound.playClick();
    if (window.confirm(`Are you sure you want to delete project: "${title}"?`)) {
      adminStore.deleteProject(id);
    }
  };

  const handleDuplicate = (project) => {
    sound.playClick();
    const isPrivate = Boolean(
      project.isPrivate || project.visibility === 'private' || project.status === 'Private' || project.status === 'Draft'
    );
    const copy = {
      ...project,
      id: `copy-${Date.now()}`,
      title: `${project.title} (Copy)`,
      isPrivate,
      visibility: isPrivate ? 'private' : 'public',
      status: isPrivate ? 'Private' : (project.status || 'Published'),
    };
    adminStore.addProject(copy);
  };

  const filtered = projects.filter((p) => {
    const isPrivate = Boolean(
      p.isPrivate || p.visibility === 'private' || p.status === 'Private' || p.status === 'Draft'
    );
    const matchesVis =
      activeVisibility === 'all' ||
      (activeVisibility === 'public' && !isPrivate) ||
      (activeVisibility === 'private' && isPrivate);
    const matchesCat = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.client && p.client.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.tagline && p.tagline.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesVis && matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-cyan-400" />
              <span>Project Archives ({projects.length})</span>
            </h2>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {publicCount} PUBLIC
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-400 font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
                <Lock className="w-2.5 h-2.5 text-amber-400" />
                {privateCount} PRIVATE
              </span>
            </div>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Manage commercial cuts, reels, documentaries, and control public vs private visibility.
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

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono animate-fadeIn shadow-xl transition-all ${
          toastMessage.type === 'private'
            ? 'bg-amber-950/80 border-amber-500/40 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
            : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
        }`}>
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'private' ? (
              <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-semibold">{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Visibility Filter Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono">
            {[
              { id: 'all', label: `ALL (${projects.length})` },
              { id: 'public', label: `PUBLIC (${publicCount})`, icon: Eye, color: 'text-emerald-400' },
              { id: 'private', label: `PRIVATE (${privateCount})`, icon: EyeOff, color: 'text-amber-400' },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    sound.playHover();
                    setActiveVisibility(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg tracking-wider transition-all flex items-center gap-1.5 text-xs ${
                    activeVisibility === tab.id
                      ? tab.id === 'private'
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        : tab.id === 'public'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                        : 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {Icon && <Icon className={`w-3 h-3 ${tab.color}`} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10 overflow-x-auto text-xs font-mono">
            {[
              { id: 'all', label: 'ALL GENRES' },
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
                className={`px-2.5 py-1 rounded-lg tracking-wider transition-colors text-[11px] ${
                  activeCategory === cat.id
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((proj) => {
          const isPrivate = Boolean(
            proj.isPrivate || proj.visibility === 'private' || proj.status === 'Private' || proj.status === 'Draft'
          );

          return (
            <div
              key={proj.id}
              className={`group rounded-2xl bg-zinc-950/70 border transition-all flex flex-col overflow-hidden relative ${
                isPrivate
                  ? 'border-amber-500/25 hover:border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                  : 'border-white/10 hover:border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
              }`}
            >
              {/* Project Poster Header */}
              <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={proj.previewPoster}
                  alt={proj.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                    isPrivate ? 'opacity-60 grayscale-[25%] group-hover:opacity-80' : 'opacity-80 group-hover:opacity-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                
                {/* Badges: Category + Public/Private status */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap items-center">
                  <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-cyan-300 uppercase tracking-widest font-bold">
                    {proj.category}
                  </span>

                  {isPrivate ? (
                    <span className="px-2 py-0.5 rounded bg-amber-950/90 backdrop-blur-md border border-amber-500/50 text-[9px] font-mono text-amber-300 uppercase tracking-widest font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                      <EyeOff className="w-2.5 h-2.5 text-amber-400" />
                      <span>PRIVATE</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-[9px] font-mono text-emerald-300 uppercase tracking-widest font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.25)]">
                      <Eye className="w-2.5 h-2.5 text-emerald-400" />
                      <span>PUBLIC</span>
                    </span>
                  )}

                  {proj.badge && (
                    <span className="px-2 py-0.5 rounded bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-[9px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                      {proj.badge}
                    </span>
                  )}
                </div>

                {/* Top Action Buttons */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  {/* Visibility Quick Toggle Button */}
                  <button
                    onClick={() => handleToggleVisibility(proj)}
                    title={isPrivate ? "Click to make PUBLIC (publish to live portfolio)" : "Click to make PRIVATE (hide from live portfolio)"}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isPrivate
                        ? 'bg-amber-950/80 hover:bg-emerald-950 text-amber-300 hover:text-emerald-300 border-amber-500/40 hover:border-emerald-500/50'
                        : 'bg-emerald-950/80 hover:bg-amber-950 text-emerald-300 hover:text-amber-300 border-emerald-500/40 hover:border-amber-500/50'
                    }`}
                  >
                    {isPrivate ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => handleDuplicate(proj)}
                    title="Duplicate project"
                    className="p-1.5 rounded-lg bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    title="Edit project details & visibility"
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
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400/90 uppercase tracking-wider font-semibold">
                      {proj.client || 'Ritik Soni'}
                    </span>
                    <span className={`text-[10px] font-mono font-bold flex items-center gap-1 ${
                      isPrivate ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {isPrivate ? (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>HIDDEN</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-3 h-3" />
                          <span>LIVE</span>
                        </>
                      )}
                    </span>
                  </div>
                  <h3 className="font-syne font-bold text-base text-white group-hover:text-cyan-200 transition-colors line-clamp-1 mt-0.5">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1 font-light">
                    {proj.tagline || proj.synopsis}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <span className="truncate max-w-[160px]">{proj.resolution || '4K DCI'}</span>
                  <span className="text-emerald-400/90 font-bold">{proj.views || 'Verified Repertoire'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-16 text-center rounded-2xl bg-zinc-950/40 border border-white/10 p-8">
          <Film className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h4 className="font-syne font-bold text-white text-base">No Projects Found</h4>
          <p className="text-zinc-400 text-xs mt-1">
            {activeVisibility !== 'all'
              ? `There are no ${activeVisibility} projects matching your current filters.`
              : 'No projects match your current search query or category filter.'}
          </p>
          {(activeVisibility !== 'all' || activeCategory !== 'all' || searchTerm) && (
            <button
              onClick={() => {
                setActiveVisibility('all');
                setActiveCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-mono text-xs"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}

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
              {/* Prominent Visibility Status Control */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-mono text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <span>Portfolio Visibility Status *</span>
                  </label>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    editingProject.isPrivate
                      ? 'bg-amber-950 border border-amber-500/40 text-amber-400'
                      : 'bg-emerald-950 border border-emerald-500/40 text-emerald-400'
                  }`}>
                    {editingProject.isPrivate ? '🔒 HIDDEN FROM VISITORS' : '🌐 LIVE ON PORTFOLIO'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Public Option */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setEditingProject({
                        ...editingProject,
                        isPrivate: false,
                        visibility: 'public',
                        status: editingProject.status === 'Private' ? 'Published' : (editingProject.status || 'Published'),
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      !editingProject.isPrivate
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      !editingProject.isPrivate ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-syne font-bold text-xs flex items-center gap-1.5 text-white">
                        <span>Public (Live)</span>
                        {!editingProject.isPrivate && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                        Visible to all visitors, search engines, and client prospects on the live portfolio.
                      </p>
                    </div>
                  </button>

                  {/* Private Option */}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setEditingProject({
                        ...editingProject,
                        isPrivate: true,
                        visibility: 'private',
                        status: 'Private',
                      });
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      editingProject.isPrivate
                        ? 'bg-amber-950/40 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : 'bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/20'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      editingProject.isPrivate ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'
                    }`}>
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-syne font-bold text-xs flex items-center gap-1.5 text-white">
                        <span>Private (Admin Only)</span>
                        {editingProject.isPrivate && (
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-snug">
                        Completely hidden from the live website. Only visible and editable inside Admin.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

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
