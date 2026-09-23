import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Wrench, 
  Plus, 
  Edit3, 
  Trash2
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function SkillsModule() {
  const [skills, setSkills] = useState(adminStore.getModule('skills'));
  const [editingSkill, setEditingSkill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setSkills(adminStore.getModule('skills'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleOpenAdd = () => {
    sound.playClick();
    setEditingSkill({
      id: '',
      name: '',
      category: 'Non-Linear Editing (NLE)',
      level: 'Advanced Specialist',
      badge: 'CORE TOOL',
      summary: '',
      specializations: ['Precision Timeline Editing', 'Sound Design & Pacing'],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill) => {
    sound.playClick();
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    if (editingSkill.id) {
      adminStore.updateSkill(editingSkill.id, editingSkill);
    } else {
      adminStore.addSkill(editingSkill);
    }
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const handleDelete = (id, name) => {
    sound.playClick();
    if (window.confirm(`Delete skill tool "${name}"?`)) {
      adminStore.deleteSkill(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <span>Creative & Technical Capabilities ({skills.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Manage NLE suites, motion graphics tools, color grading science, and SMM strategy.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Tool / Capability</span>
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill, idx) => (
          <div
            key={skill.id || idx}
            className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 font-mono text-[9px] text-cyan-300 font-bold uppercase">
                  {skill.badge || 'PRO'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-syne font-bold text-base text-white">
                {skill.name}
              </h3>
              <div className="text-[11px] font-mono text-zinc-400 mb-2">
                {skill.category} • <span className="text-cyan-400">{skill.level}</span>
              </div>

              {skill.summary && (
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light mb-3">
                  {skill.summary}
                </p>
              )}
            </div>

            {skill.specializations && skill.specializations.length > 0 && (
              <div className="pt-2 border-t border-white/5 space-y-1">
                {skill.specializations.slice(0, 3).map((spec, sIdx) => (
                  <div key={sIdx} className="text-[11px] text-zinc-400 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-cyan-500/30 rounded-2xl shadow-2xl p-6 space-y-4 animate-fadeIn text-xs">
            <h3 className="font-syne font-bold text-lg text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-cyan-400" />
              <span>{editingSkill.id ? 'Edit Capability' : 'Add Creative Capability'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Tool / Capability Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. DaVinci Resolve Studio"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingSkill.category}
                    onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Color & Finishing"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                    Proficiency Level
                  </label>
                  <input
                    type="text"
                    value={editingSkill.level}
                    onChange={(e) => setEditingSkill({ ...editingSkill, level: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Advanced Master"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Summary Description
                </label>
                <textarea
                  rows={2}
                  value={editingSkill.summary || ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="Core technical purpose..."
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                  Specializations (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingSkill.specializations ? editingSkill.specializations.join('\n') : ''}
                  onChange={(e) => setEditingSkill({ ...editingSkill, specializations: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="ACES Color Science&#10;Shot Matching&#10;HDR Grading"
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
                  Save Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
