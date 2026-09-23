import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Film, 
  MessageSquare, 
  Eye, 
  Building, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Activity
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function OverviewModule({ onSelectModule }) {
  const [data, setData] = useState(adminStore.getData());

  useEffect(() => {
    const handleUpdate = (e) => setData(e.detail || adminStore.getData());
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const { overview, projects, leads, clients, availability } = data;
  const newLeadsCount = leads.filter((l) => l.status === 'NEW').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Control Room Status */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-zinc-900/60 to-black border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-emerald-400 tracking-widest uppercase">
              CREATIVE CONTROL ROOM ACTIVE // {overview.systemStatus}
            </span>
          </div>
          <h2 className="font-syne text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Command Center Overview
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Real-time telemetry, portfolio pipeline & live business transmissions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={() => {
              sound.playClick();
              onSelectModule('projects', { openNew: true });
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectModule('leads');
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300 font-mono text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:border-cyan-500/40"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Leads ({newLeadsCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Master Projects</span>
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-white">{projects.length}</div>
          <div className="font-mono text-[10px] text-cyan-400/80 mt-1 flex items-center gap-1">
            <span>{projects.filter(p => p.status === 'Published').length} Published</span>
            <span>•</span>
            <span>{projects.filter(p => p.badge).length} Featured</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Total Video Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-emerald-400">{overview.monthlyImpressions}</div>
          <div className="font-mono text-[10px] text-zinc-400 mt-1">
            Across IG Reels & YouTube
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Inquiries & Leads</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-white">{leads.length}</div>
          <div className="font-mono text-[10px] text-amber-400/90 mt-1">
            {newLeadsCount} Need Review
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider">Studio Capacity</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-cyan-300">{availability.capacityPercent}%</div>
          <div className="font-mono text-[10px] text-zinc-400 mt-1 truncate">
            {availability.status}
          </div>
        </div>
      </div>

      {/* Grid: Live Leads & Quick Project Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Col Span 7): Recent Client Leads */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-zinc-950/60 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <h3 className="font-syne font-bold text-white text-base tracking-wide">
                  Recent Inbound Leads
                </h3>
              </div>
              <button
                onClick={() => onSelectModule('leads')}
                className="font-mono text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 uppercase tracking-wider"
              >
                <span>View All ({leads.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <div className="p-8 rounded-xl bg-zinc-900/40 border border-white/5 text-center text-zinc-500 font-mono text-xs">
                  NO INBOUND TRANSMISSIONS YET // Genuine client inquiries submitted via the public contact terminal will appear here in real-time.
                </div>
              ) : (
                leads.slice(0, 3).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectModule('leads', { leadId: lead.id })}
                    className="p-3.5 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                        {lead.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold ${
                        lead.status === 'NEW' 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                          : lead.status === 'WON' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 font-mono truncate mb-1">
                      {lead.company ? `${lead.company} • ` : ''}{lead.projectType}
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1 italic">
                      "{lead.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Target Response Time: &lt; 24 Hrs</span>
            <span>Auto-Sync: Active</span>
          </div>
        </div>

        {/* Right Column (Col Span 5): Studio Quick Status */}
        <div className="lg:col-span-5 space-y-4">
          {/* Booking & Availability Card */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <h3 className="font-syne font-bold text-white text-base">Booking Status</h3>
              </div>
              <button
                onClick={() => onSelectModule('availability')}
                className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
              >
                Configure
              </button>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 mb-3">
              <div className="text-xs font-mono font-bold text-cyan-300 tracking-wider">
                {availability.status}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {availability.subtext}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Production Workload</span>
                <span className="font-mono text-cyan-400 font-bold">{availability.capacityPercent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full" 
                  style={{ width: `${availability.capacityPercent}%` }} 
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-1">
                <span>Next Slot: {availability.nextOpenSlotDate}</span>
                <span>{availability.timezone.split('/')[0]}</span>
              </div>
            </div>
          </div>

          {/* Quick Client Roster */}
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-cyan-400" />
                <h3 className="font-syne font-bold text-white text-base">Brand Partners</h3>
              </div>
              <button
                onClick={() => onSelectModule('clients')}
                className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 uppercase tracking-wider"
              >
                View Roster ({clients.length})
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {clients.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-zinc-200 truncate">{c.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono truncate">{c.projectsCount} Cuts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
