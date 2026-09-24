import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import adminStore from '../../services/adminStore';

// Module Components
import OverviewModule from './modules/OverviewModule';
import ProjectsModule from './modules/ProjectsModule';
import DriveSyncModule from './modules/DriveSyncModule';
import MediaModule from './modules/MediaModule';
import LeadsModule from './modules/LeadsModule';
import ExperienceModule from './modules/ExperienceModule';
import SkillsModule from './modules/SkillsModule';
import ServicesModule from './modules/ServicesModule';
import ClientsModule from './modules/ClientsModule';
import AnalyticsModule from './modules/AnalyticsModule';
import SocialLinksModule from './modules/SocialLinksModule';
import AvailabilityModule from './modules/AvailabilityModule';
import SettingsModule from './modules/SettingsModule';
import TeamModule from './modules/TeamModule';
import AdminPopupContainer, { showAdminToast } from './common/AdminPopupMessage';

// Icons
import {
  LayoutDashboard,
  Film,
  HardDrive,
  Image,
  MessageSquare,
  Briefcase,
  Wrench,
  Sparkles,
  Building,
  BarChart3,
  Share2,
  Calendar,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  ChevronRight,
  ChevronDown,
  Disc,
  Bell,
  Shield,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

const MODULES_CONFIG = [
  { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard, category: 'Core' },
  { id: 'projects', label: 'PROJECTS', icon: Film, category: 'Portfolio' },
  { id: 'driveSync', label: 'DRIVE SYNC', icon: HardDrive, category: 'Portfolio', hasBadge: true },
  { id: 'media', label: 'MEDIA', icon: Image, category: 'Portfolio' },
  { id: 'leads', label: 'LEADS', icon: MessageSquare, category: 'Business', hasBadge: true },
  { id: 'experience', label: 'EXPERIENCE', icon: Briefcase, category: 'Profile' },
  { id: 'skills', label: 'SKILLS', icon: Wrench, category: 'Profile' },
  { id: 'services', label: 'SERVICES', icon: Sparkles, category: 'Business' },
  { id: 'clients', label: 'CLIENTS', icon: Building, category: 'Business' },
  { id: 'analytics', label: 'ANALYTICS', icon: BarChart3, category: 'Intelligence' },
  { id: 'socialLinks', label: 'SOCIAL LINKS', icon: Share2, category: 'Channels' },
  { id: 'availability', label: 'AVAILABILITY', icon: Calendar, category: 'Operations' },
  { id: 'settings', label: 'SETTINGS', icon: Settings, category: 'System' },
  { id: 'team', label: 'TEAM', icon: Users, category: 'Operations' },
];

function RunningTimecode() {
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      const totalSeconds = Math.floor(frame / 24);
      const frames = frame % 24;
      const seconds = totalSeconds % 60;
      const minutes = Math.floor(totalSeconds / 60) % 60;
      const hours = Math.floor(totalSeconds / 3600);
      const pad = (n) => String(n).padStart(2, '0');
      setTimecode(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`);
    }, 1000 / 24);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
      <span className="text-zinc-600">TC</span>
      <span className="px-2.5 py-1 rounded bg-zinc-900/80 border border-white/10 text-cyan-300 font-bold tracking-widest">
        {timecode}
      </span>
      <span className="text-[10px] text-emerald-400 flex items-center gap-1 ml-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>LIVE SYNC</span>
      </span>
    </div>
  );
}

export default function AdminLayout({ onLogout }) {
  const [activeModule, setActiveModule] = useState('overview');
  const [moduleParams, setModuleParams] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState('');
  const [storeData, setStoreData] = useState(adminStore.getData());
  const [currentUser, setCurrentUser] = useState(adminStore.getCurrentUser());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Update on store change or user profile change
  useEffect(() => {
    const handleUpdate = () => {
      setStoreData(adminStore.getData());
      setCurrentUser(adminStore.getCurrentUser());
    };
    const handleUserChange = (e) => {
      setCurrentUser(e.detail || adminStore.getCurrentUser());
      setStoreData(adminStore.getData());
    };

    window.addEventListener('control-room-updated', handleUpdate);
    window.addEventListener('control-room-user-changed', handleUserChange);
    return () => {
      window.removeEventListener('control-room-updated', handleUpdate);
      window.removeEventListener('control-room-user-changed', handleUserChange);
    };
  }, []);

  // Security guard: Ensure activeModule is permitted under currentUser capabilities
  useEffect(() => {
    if (!adminStore.isModuleAllowed(activeModule)) {
      setActiveModule('overview');
    }
  }, [currentUser, activeModule]);

  const handleSelectModule = (id, params = {}) => {
    if (!adminStore.isModuleAllowed(id)) {
      showAdminToast({
        type: 'error',
        title: 'ACCESS RESTRICTED // 403',
        message: 'Your current profile does not possess the required capability permission for this module.',
        tag: 'SECURITY POLICY',
      });
      return;
    }
    setActiveModule(id);
    setModuleParams(params);
    setSidebarOpen(false);
  };

  const handleSwitchUser = (userId) => {
    adminStore.switchUser(userId);
    setProfileDropdownOpen(false);
  };

  const handleLogout = () => {
    adminStore.logout();
    if (onLogout) onLogout();
    else navigate('/admin');
  };

  const newLeadsCount = storeData.leads?.filter((l) => l.status === 'NEW').length || 0;
  const adminUsersList = adminStore.getAdminUsers();

  // Filter modules based on granted capabilities
  const allowedModules = MODULES_CONFIG.filter((m) => adminStore.isModuleAllowed(m.id));

  const filteredModules = allowedModules.filter((m) =>
    m.label.toLowerCase().includes(moduleSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(moduleSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050608] text-zinc-100 flex flex-col font-sans select-none relative z-20 overflow-x-hidden">
      {/* 35mm Celluloid Film Grain Overlay (Matching Website Theme) */}
      <div className="film-grain" />

      {/* Atmospheric Soft Radiance Lighting */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-cyan-500/8 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-10 right-10 w-[500px] h-[300px] bg-sky-500/6 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Top Tactical HUD Header (Matching Website Navbar) */}
      <header className="h-16 px-4 sm:px-6 lg:px-8 bg-black/85 border-b border-white/10 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white md:hidden transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-cyan-500/40 flex items-center justify-center group-hover:border-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)] transition-all">
              <Disc className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            </div>
            <div>
              <div className="font-syne font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 tracking-wider">
                <span>RITIK SONI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400/90 hidden sm:inline">
                  {'// CREATIVE CONTROL ROOM'}
                </span>
              </div>
              <div className="text-[9px] font-mono text-zinc-500 tracking-widest hidden sm:block">
                CENTRAL PRODUCTION TERMINAL
              </div>
            </div>
          </Link>
        </div>

        {/* Center: SMPTE running timecode (desktop) */}
        <RunningTimecode />

        {/* Right Action Dock */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Profile Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
              }}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 transition-all text-xs font-mono"
            >
              <img
                src={currentUser?.avatar || '/img/ritik-portrait.webp'}
                alt={currentUser?.name || 'User'}
                className="w-5 h-5 rounded-lg object-cover border border-white/20"
              />
              <div className="hidden md:flex flex-col text-left leading-none">
                <span className="text-white font-bold text-[11px] truncate max-w-[100px]">
                  {currentUser?.name || 'Ritik Soni'}
                </span>
                <span className="text-[8px] text-zinc-500 uppercase tracking-wider">
                  {currentUser?.role === 'owner' ? 'OWNER' : 'COLLABORATOR'}
                </span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${
                currentUser?.role === 'owner'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              }`}>
                {currentUser?.role === 'owner' ? 'OWNER' : `${currentUser?.capabilities?.length || 0}/7`}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {/* Profile Selector Popover */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 p-2 rounded-2xl bg-zinc-950 border border-cyan-500/30 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                <div className="px-3 py-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest border-b border-white/5 flex items-center justify-between">
                  <span>SWITCH PROFILE</span>
                  <span className="text-cyan-400 font-bold">{adminUsersList.length} PROFILES</span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                  {adminUsersList.map((u) => {
                    const isSelected = currentUser?.id === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => handleSwitchUser(u.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs font-mono transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-white border border-cyan-500/50'
                            : 'hover:bg-zinc-900 text-zinc-300 hover:text-white border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-6 h-6 rounded-lg object-cover border border-white/10"
                          />
                          <div className="truncate">
                            <div className="font-bold text-[11px] truncate flex items-center gap-1">
                              <span>{u.name}</span>
                              {u.role === 'owner' && <span className="text-[9px] text-amber-400">★</span>}
                            </div>
                            <div className="text-[9px] text-zinc-500 truncate">
                              {u.role === 'owner' ? 'Superadmin (Full)' : `${u.capabilities?.length || 0} Capabilities`}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <UserCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {adminStore.hasCapability('TEAM') && (
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSelectModule('team');
                    }}
                    className="w-full pt-2 pb-1 text-center font-mono text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline border-t border-white/5 flex items-center justify-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    <span>Manage Access & Permissions</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950/90 hover:bg-zinc-900 border border-white/20 hover:border-cyan-400 hover:text-cyan-300 text-zinc-300 font-mono text-xs transition-all duration-300 backdrop-blur-md shadow-sm"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </a>

          {adminStore.hasCapability('LEADS') && (
            <button
              onClick={() => handleSelectModule('leads')}
              className="relative p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white transition-colors"
              title="Inbound Leads"
            >
              <Bell className="w-4 h-4" />
              {newLeadsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black font-mono text-[9px] font-bold flex items-center justify-center">
                  {newLeadsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 font-mono text-xs transition-colors"
            title="Lock Control Room"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Tactical Sidebar */}
        <aside
          className={`fixed md:static inset-y-16 left-0 z-30 w-64 bg-black/90 md:bg-zinc-950/70 border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-out backdrop-blur-2xl ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-3 flex-1 overflow-y-auto">
            {/* Quick Module Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Filter ${allowedModules.length} modules...`}
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-white/5 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40 font-mono"
              />
            </div>

            {/* Navigation List */}
            <nav className="space-y-1 pt-1">
              {filteredModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-200 group text-left ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-cyan-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.id === 'leads' && newLeadsCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-black text-[9px] font-bold">
                        {newLeadsCount}
                      </span>
                    )}

                    {item.id === 'driveSync' && (storeData.stagedProjects?.length || 0) > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-bold animate-pulse">
                        {storeData.stagedProjects.length} PENDING
                      </span>
                    )}

                    {item.id === 'projects' && (
                      <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400">
                        {storeData.projects?.length || 0}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Metadata */}
          <div className="p-4 border-t border-white/5 space-y-2">
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="truncate font-bold text-white">{currentUser?.name || 'RITIK SONI'}</span>
                <span className={currentUser?.role === 'owner' ? 'text-amber-400 font-bold text-[9px] uppercase' : 'text-cyan-400 font-bold text-[9px] uppercase'}>
                  {currentUser?.role === 'owner' ? 'OWNER' : 'COLLABORATOR'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500">
                <span>CAPABILITIES</span>
                <span className="text-zinc-400 font-bold">
                  {currentUser?.role === 'owner' ? '7/7 FULL ACCESS' : `${currentUser?.capabilities?.length || 0}/7 GRANTED`}
                </span>
              </div>
            </div>
            <div className="text-[9px] font-mono text-zinc-600 text-center tracking-widest uppercase">
              STUDIO CONTROL ROOM // v2.4
            </div>
          </div>
        </aside>

        {/* Dynamic Canvas Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {!adminStore.isModuleAllowed(activeModule) ? (
            <div className="p-12 rounded-3xl bg-zinc-950/80 border border-red-500/30 text-center space-y-4 max-w-xl mx-auto my-12 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h3 className="font-syne text-2xl font-bold text-white uppercase tracking-wider">
                Access Restricted // Capability Required
              </h3>
              <p className="text-zinc-400 text-xs font-mono leading-relaxed">
                Your current active profile ({currentUser?.name || 'User'}) does not hold the capability required to view this module. Contact studio owner <strong>Ritik</strong> to request elevated permissions.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveModule('overview')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Return to Overview
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeModule === 'overview' && (
                <OverviewModule onSelectModule={handleSelectModule} />
              )}
              {activeModule === 'projects' && (
                <ProjectsModule
                  initialOpenNew={moduleParams.openNew}
                  onNavigateDrive={() => handleSelectModule('driveSync')}
                />
              )}
              {activeModule === 'driveSync' && (
                <DriveSyncModule onNavigate={handleSelectModule} />
              )}
              {activeModule === 'media' && <MediaModule />}
              {activeModule === 'leads' && (
                <LeadsModule initialLeadId={moduleParams.leadId} />
              )}
              {activeModule === 'experience' && <ExperienceModule />}
              {activeModule === 'skills' && <SkillsModule />}
              {activeModule === 'services' && <ServicesModule />}
              {activeModule === 'clients' && <ClientsModule />}
              {activeModule === 'analytics' && <AnalyticsModule />}
              {activeModule === 'socialLinks' && <SocialLinksModule />}
              {activeModule === 'availability' && <AvailabilityModule />}
              {activeModule === 'settings' && <SettingsModule />}
              {activeModule === 'team' && <TeamModule />}
            </>
          )}
        </main>
      </div>

      {/* Global Cyber Popup Toast & Confirmation Modal System */}
      <AdminPopupContainer />
    </div>
  );
}
