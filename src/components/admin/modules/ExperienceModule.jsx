import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Briefcase, 
  Plus, 
  Edit3, 
  Trash2
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function ExperienceModule() {
  const [experience, setExperience] = useState(adminStore.getModule('experience'));
  const [editingExp, setEditingExp] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setExperience(adminStore.getModule('experience'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingExp({
      id: '',
      role: '',
      company: '',
      shortLabel: '',
      period: '2024 — Present',
      timelinePosition: '2024 — Present',
      track: 'V1',
      badge: 'FULL-TIME EXECUTIVE',
      summary: '',
      points: ['Structured high-retention video pipelines', 'Spearheaded commercial brand campaigns'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    sound.playClick();
    setEditingExp({ ...exp });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingExp.id) {
      adminStore.updateExperience(editingExp.id, editingExp);
    } else {
      adminStore.addExperience(editingExp);
    }
    setIsModalOpen(false);
    setEditingExp(null);
  };

  const handleDelete = (id, role) => {
    sound.playClick();
    if (window.confirm(`Delete experience milestone "${role}"?`)) {
      adminStore.deleteExperience(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <span>Production Timeline & Experience ({experience.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Manage NLE timeline roles (V1/V2 video tracks, leadership, commercial engagements).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Career Milestone</span>
        </button>
      </div>

      {/* Experience Timeline Cards */}
      <div className="space-y-4">
        {experience.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-400 font-bold uppercase">
                    TRACK: {exp.track || 'V1'}
                  </span>
                  {exp.badge && (
                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 font-mono text-[9px] text-zinc-300 font-bold uppercase">
                      {exp.badge}
                    </span>
                  )}
                  <span className="font-mono text-xs text-zinc-400">
                    {exp.timelinePosition || exp.period}
                  </span>
                </div>
                <h3 className="font-syne font-bold text-lg text-white">
                  {exp.role}
                </h3>
                <div className="font-mono text-xs text-cyan-400 font-semibold">
                  {exp.company}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-white/10 hover:border-cyan-500/40 flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(exp.id, exp.role)}
                  className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300 border border-red-500/30 transition-colors"
                  title="Delete milestone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {exp.summary && (
              <p className="text-xs text-zinc-300 leading-relaxed font-light">
                {exp.summary}
              </p>
            )}

            {exp.points && exp.points.length > 0 && (
              <ul className="space-y-1.5 pt-2 border-t border-white/5">
                {exp.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-xs text-zinc-400 flex items-start gap-2">
                    <span className="text-cyan-400 font-mono">▸</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl max-h-[90vh] bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 overflow-y-auto animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              <span>{editingExp.id ? 'Edit Experience Milestone' : 'Add Career Milestone'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.role}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Video Production Executive"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="e.g. Vishwa Vinayak Group"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Timeline Span
                  </label>
                  <input
                    type="text"
                    value={editingExp.timelinePosition}
                    onChange={(e) => setEditingExp({ ...editingExp, timelinePosition: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="2023 — Present"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    NLE Track Tag
                  </label>
                  <select
                    value={editingExp.track}
                    onChange={(e) => setEditingExp({ ...editingExp, track: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="V1">V1: Executive Leadership</option>
                    <option value="V2">V2: Brand Engagements</option>
                    <option value="A1">A1: Independent & Creative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Key Accomplishments (One per line)
                </label>
                <textarea
                  rows={4}
                  value={editingExp.points ? editingExp.points.join('\n') : ''}
                  onChange={(e) => setEditingExp({ ...editingExp, points: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="Enter key achievements..."
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
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
