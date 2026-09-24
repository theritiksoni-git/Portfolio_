import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  MessageSquare, 
  Search, 
  Download, 
  Mail, 
  Trash2
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';
import { showAdminToast, showAdminConfirm } from '../common/AdminPopupMessage';

export default function LeadsModule({ initialLeadId = null }) {
  const [leads, setLeads] = useState(adminStore.getModule('leads'));
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(() => {
    if (initialLeadId) {
      return adminStore.getModule('leads').find((l) => l.id === initialLeadId) || null;
    }
    return null;
  });

  useEffect(() => {
    const handleUpdate = () => setLeads(adminStore.getModule('leads'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    sound.playClick();
    adminStore.updateLead(id, { status: newStatus });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, status: newStatus }));
    }
    showAdminToast({
      type: 'info',
      title: 'LEAD STATUS UPDATED',
      message: `Transmission flagged as "${newStatus}".`,
      tag: 'CRM TELEMETRY',
      duration: 2500,
    });
  };

  const handleDelete = (id, name) => {
    sound.playClick();
    showAdminConfirm({
      title: 'Delete Inbound Lead?',
      message: `Are you sure you want to permanently delete lead communication from "${name}"?`,
      confirmText: 'DELETE LEAD',
      cancelText: 'CANCEL (ESC)',
      type: 'danger',
      onConfirm: () => {
        adminStore.deleteLead(id);
        if (selectedLead?.id === id) setSelectedLead(null);
        showAdminToast({
          type: 'error',
          title: 'LEAD PURGED',
          message: `Inquiry from "${name}" has been removed from inbox.`,
          tag: 'CRM PURGED',
        });
      },
    });
  };

  const handleNotesChange = (id, notes) => {
    adminStore.updateLead(id, { notes });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead((prev) => ({ ...prev, notes }));
    }
  };

  const handleExportCSV = () => {
    sound.playClick();
    const headers = ['Name', 'Email', 'Company', 'Project Type', 'Status', 'Budget', 'Date', 'Message', 'Notes'];
    const rows = leads.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      `"${l.company || ''}"`,
      `"${l.projectType || ''}"`,
      `"${l.status || ''}"`,
      `"${l.budget || ''}"`,
      `"${l.receivedAt || ''}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ritik_Soni_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    document.body.removeChild(link);
    showAdminToast({
      type: 'success',
      title: 'LEADS EXPORTED',
      message: 'Downloaded CRM leads report as CSV file.',
      tag: 'CSV EXPORT',
    });
  };

  const filtered = leads.filter((l) => {
    const matchesStatus = filterStatus === 'ALL' || l.status === filterStatus;
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.company && l.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.projectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Client Leads & Inbound Inquiries ({leads.length})</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Real-time transmissions received via portfolio contact terminal and priority email.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all hover:border-cyan-500/40 shrink-0"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 overflow-x-auto text-xs font-mono">
          {['ALL', 'NEW', 'IN DISCUSSION', 'PROPOSAL SENT', 'WON', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => {
                sound.playHover();
                setFilterStatus(st);
              }}
              className={`px-3 py-1.5 rounded-lg tracking-wider transition-colors whitespace-nowrap ${
                filterStatus === st
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, company, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Leads Split View: List on Left, Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Lead Cards */}
        <div className="lg:col-span-6 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-950/40 border border-white/5 text-center text-zinc-500 font-mono text-xs">
              NO INBOUND TRANSMISSIONS MATCHING CURRENT FILTER.
            </div>
          ) : (
            filtered.map((lead) => (
              <div
                key={lead.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedLead(lead);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedLead?.id === lead.id
                    ? 'bg-zinc-900 border-cyan-500/50 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                    : 'bg-zinc-950/70 border-white/5 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-sm text-white">
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

                <div className="text-xs text-cyan-400/90 font-mono truncate mb-1">
                  {lead.company ? `${lead.company} • ` : ''}{lead.projectType}
                </div>

                <p className="text-xs text-zinc-400 line-clamp-2 italic mb-2">
                  "{lead.message}"
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
                  <span>{lead.email}</span>
                  <span>{new Date(lead.receivedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Lead Detail & Action Dock */}
        <div className="lg:col-span-6">
          {selectedLead ? (
            <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 space-y-4 text-xs sticky top-24">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    INBOUND TRANSMISSION // {selectedLead.id}
                  </span>
                  <h3 className="font-syne font-bold text-xl text-white mt-0.5">
                    {selectedLead.name}
                  </h3>
                  <div className="text-zinc-400 font-mono text-xs">
                    {selectedLead.company || 'Direct Client'}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(selectedLead.id, selectedLead.name)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                  title="Delete lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Status Selector Dropdown */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-1">
                <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider block">
                  Workflow Pipeline Status
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {['NEW', 'IN DISCUSSION', 'PROPOSAL SENT', 'WON', 'ARCHIVED'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedLead.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider transition-colors ${
                        selectedLead.status === st
                          ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Payload */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
                <div className="text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                  Project Request // {selectedLead.projectType}
                </div>
                <div className="text-zinc-200 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedLead.message}
                </div>
                {selectedLead.budget && (
                  <div className="pt-2 text-cyan-400 font-mono text-[11px] font-semibold">
                    Budget Estimate: {selectedLead.budget}
                  </div>
                )}
              </div>

              {/* Internal Notes Editor */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider block">
                  Internal Production Notes
                </label>
                <textarea
                  rows={3}
                  value={selectedLead.notes || ''}
                  onChange={(e) => handleNotesChange(selectedLead.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 resize-none font-sans"
                  placeholder="Add private notes on timeline, call notes, or follow-up items..."
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={`mailto:${selectedLead.email}?subject=RE: ${selectedLead.projectType} — Ritik Soni Video Production`}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all hover:scale-102 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                >
                  <Mail className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-zinc-950/40 border border-white/5 text-center text-zinc-500 font-mono text-xs">
              SELECT AN INBOUND TRANSMISSION TO VIEW DETAILS AND WORKFLOW.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
