// Creative Control Room - Persistent Reactive Admin Data Store
// Synchronizes all 13 modules with local storage persistence and event broadcasting

import { PROJECTS } from '../data/projects';
import { EXPERIENCES } from '../data/experience';
import { CORE_SOFTWARE } from '../data/skills';

const STORAGE_KEY = 'ritik_control_room_data_v1';
const AUTH_KEY = 'ritik_control_room_auth_v1';
export const CURRENT_USER_KEY = 'ritik_control_room_user_v1';

// Supported 7 Granular Capabilities for Access Control
export const CAPABILITIES = [
  { 
    key: 'PROJECTS', 
    label: 'PROJECTS', 
    description: 'Create, edit, archive and publish video portfolio items and case studies' 
  },
  { 
    key: 'MEDIA', 
    label: 'MEDIA', 
    description: 'Upload and manage 4K master ProRes cuts, 9:16 reels, stills & audio stems' 
  },
  { 
    key: 'LEADS', 
    label: 'LEADS', 
    description: 'Access CRM transmission inbox, budget proposals & client communications' 
  },
  { 
    key: 'ANALYTICS', 
    label: 'ANALYTICS', 
    description: 'View viewership telemetry, retention curves and cross-platform performance' 
  },
  { 
    key: 'CONTENT', 
    label: 'CONTENT', 
    description: 'Manage bio, experience, skills, services, clients, social links & availability' 
  },
  { 
    key: 'SETTINGS', 
    label: 'SETTINGS', 
    description: 'Configure studio parameters, export/import JSON backups & API settings' 
  },
  { 
    key: 'TEAM', 
    label: 'TEAM', 
    description: 'Manage production crew and invite collaborators with capability permissions' 
  },
];

// Module ID to required Capability mapping (null = open to all authenticated users)
export const MODULE_CAPABILITY_MAP = {
  overview: null,
  projects: 'PROJECTS',
  media: 'MEDIA',
  leads: 'LEADS',
  analytics: 'ANALYTICS',
  experience: 'CONTENT',
  skills: 'CONTENT',
  services: 'CONTENT',
  clients: 'CONTENT',
  socialLinks: 'CONTENT',
  availability: 'CONTENT',
  settings: 'SETTINGS',
  team: 'TEAM',
};

// Initial Seed Data for all 13 modules
const DEFAULT_SEED_DATA = {
  overview: {
    systemStatus: 'ONLINE // OPTIMAL',
    currentVersion: 'v2.4.0-CINEMA',
    storageUsedGB: 142.8,
    storageTotalGB: 500.0,
    serverUptime: '99.98%',
    activeRosterCount: 14,
    monthlyImpressions: '52.4M',
    leadConversionRate: '28.5%',
  },
  projects: PROJECTS.map((p, idx) => ({
    ...p,
    status: idx < 8 ? 'Published' : 'Featured',
    views: `${(Math.random() * 1.5 + 0.2).toFixed(1)}M`,
    likes: `${Math.floor(Math.random() * 45 + 12)}K`,
    priority: idx + 1,
  })),
  media: [
    {
      id: 'm-01',
      title: 'Adentech Master 4K ProRes Cut',
      type: 'video',
      category: 'Commercial',
      resolution: '4K DCI (3840x2160)',
      aspectRatio: '16:9 UHD',
      size: '2.4 GB',
      url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      dateAdded: '2024-11-14',
      tags: ['Commercial', 'Tech', '4K'],
    },
    {
      id: 'm-02',
      title: 'Red Bull Energy Viral Reel 9:16',
      type: 'video',
      category: 'Short-Form',
      resolution: '1080x1920 Vertical',
      aspectRatio: '9:16 Reel',
      size: '480 MB',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      dateAdded: '2024-10-02',
      tags: ['Viral', 'Sports', 'Reels'],
    },
    {
      id: 'm-03',
      title: 'Reliance Industries Clean Brand Still',
      type: 'image',
      category: 'Client Assets',
      resolution: '5120x2880 5K',
      aspectRatio: '16:9',
      size: '14.2 MB',
      url: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
      dateAdded: '2024-09-20',
      tags: ['Brand', 'Corporate'],
    },
    {
      id: 'm-04',
      title: 'Epic A-Minor Key Riser Stem',
      type: 'audio',
      category: 'Sound FX',
      resolution: '96kHz 24-bit WAV',
      aspectRatio: 'Stereo Stem',
      size: '22 MB',
      url: '/audio/sfx/epic-riser-a-min.wav',
      dateAdded: '2024-08-15',
      tags: ['SFX', 'Audio', 'Cinematic'],
    },
    {
      id: 'm-05',
      title: 'Official Executive Resume PDF',
      type: 'document',
      category: 'Credentials',
      resolution: 'Vector PDF',
      aspectRatio: 'A4',
      size: '1.2 MB',
      url: '/resume/Ritik_Soni_Executive_Resume.pdf',
      dateAdded: '2025-01-10',
      tags: ['CV', 'Executive', 'Credentials'],
    },
  ],
  leads: [
    {
      id: 'lead-01',
      name: 'Aarav Mehta',
      email: 'a.mehta@apexcreative.in',
      company: 'Apex Digital Group',
      projectType: 'Social Media Management & Growth Strategy',
      message: 'Looking for a 30-day viral reel retainer and full-funnel content direction for our tech founder brand. Need high-retention editing.',
      status: 'NEW',
      budget: '$4,000 - $6,500 / mo',
      receivedAt: '2026-03-22T09:30:00Z',
      notes: 'High priority. Schedule discovery call this week.',
    },
    {
      id: 'lead-02',
      name: 'Elena Rostova',
      email: 'elena@solsticeproductions.com',
      company: 'Solstice Films London',
      projectType: 'Corporate Video / Client Production',
      message: 'Directing a multi-country energy documentary in Q3. We loved your Adentech and Red Bull pacing. Are you available for post-lead?',
      status: 'IN DISCUSSION',
      budget: '$12,000+',
      receivedAt: '2026-03-20T14:15:00Z',
      notes: 'Sent rate sheet and reel breakdowns.',
    },
    {
      id: 'lead-03',
      name: 'Devansh Verma',
      email: 'dev@kineticbrands.co',
      company: 'Kinetic Direct',
      projectType: 'High-Retention Short-Form Reels',
      message: 'Need 15 kinetic hook-driven reels cut for an e-commerce campaign starting next Monday.',
      status: 'PROPOSAL SENT',
      budget: '$2,500 - $3,500',
      receivedAt: '2026-03-18T18:45:00Z',
      notes: 'Waiting on client review of proposal.',
    },
    {
      id: 'lead-04',
      name: 'Samantha Wu',
      email: 'swu@nexusmedia.sg',
      company: 'Nexus Media Singapore',
      projectType: 'Full-Time Video Production Executive',
      message: 'Inviting you to interview for Head of Post-Production for our APAC digital series division.',
      status: 'WON',
      budget: 'Full-Time Executive',
      receivedAt: '2026-03-12T11:00:00Z',
      notes: 'Contract finalized for advisory project.',
    },
  ],
  experience: EXPERIENCES,
  skills: CORE_SOFTWARE,
  services: [
    {
      id: 'srv-01',
      title: 'Full-Funnel Social Media & Viral Reels Direction',
      badge: 'MOST POPULAR',
      category: 'SMM & Viral Strategy',
      description: 'End-to-end viral video strategy, retention-engineered hooks, fast-paced editing, kinetic typography, and audio mastering optimized for Instagram, TikTok & YouTube Shorts.',
      deliverables: ['30-Day Content Roadmap', '12-20 High-Retention Master Reels', 'Hook A/B Variations', 'Audio Pacing & Sound Effects'],
      turnaround: '7 - 10 Days',
      startingRate: '$2,500 / month',
      active: true,
    },
    {
      id: 'srv-02',
      title: 'Commercial Brand Films & Corporate Directing',
      badge: 'FLAGSHIP',
      category: 'Commercial Production',
      description: 'High-production-value corporate narratives, brand manifestos, and technical showcases structured to inspire trust, win enterprise clients, and command attention.',
      deliverables: ['Script to Screen Direction', '4K DCI ProRes Master Deliverables', 'Color Grading & Shot Matching', 'Custom Motion Graphics'],
      turnaround: '2 - 3 Weeks',
      startingRate: '$4,000 / project',
      active: true,
    },
    {
      id: 'srv-03',
      title: 'YouTube Documentary & Creator Long-Form',
      badge: 'HIGH RETENTION',
      category: 'Long-Form Storytelling',
      description: 'Deep-dive documentaries, video essays, and high-production creator content edited with precise chapter pacing, custom sound scoring, and retention analytics alignment.',
      deliverables: ['Full 15-45 Min Timeline Sculpting', 'B-Roll & Archival Research Sync', 'Cinematic Soundscapes', 'Clickable High-CTR Thumbnail Stills'],
      turnaround: '5 - 7 Days',
      startingRate: '$1,500 / episode',
      active: true,
    },
    {
      id: 'srv-04',
      title: 'Broadcast Color Grading & Audio Mastering',
      badge: 'POST-SPECIALTY',
      category: 'Color & Sound',
      description: 'DaVinci Resolve color science grading (ACES / Rec.709 / HDR) paired with industry-grade LUFS broadcast mastering for crisp dialogue and thunderous cinematic impact.',
      deliverables: ['Color Conformed XMLs', 'Dolby/LUFS Calibrated Mixes', 'Stem Exports (Dialogue, FX, Music)', 'Multiple Codec Masters'],
      turnaround: '3 - 5 Days',
      startingRate: '$800 / project',
      active: true,
    },
  ],
  clients: [
    {
      id: 'cli-01',
      name: 'Red Bull',
      industry: 'Energy & Sports Media',
      projectsCount: 4,
      logoUrl: '/img/client-logos/redbull.png',
      status: 'Active Partner',
      nda: false,
      quote: 'Exceptional visual rhythm and adrenaline-fueled pacing across all cuts.',
    },
    {
      id: 'cli-02',
      name: 'Reliance Industries',
      industry: 'Conglomerate & Enterprise',
      projectsCount: 3,
      logoUrl: '/img/client-logos/reliance-industries-limited.png',
      status: 'Enterprise Client',
      nda: true,
      quote: 'Executed immaculate broadcast color and corporate precision under tight deadlines.',
    },
    {
      id: 'cli-03',
      name: 'AdenTech',
      industry: 'Software & Technology',
      projectsCount: 2,
      logoUrl: '/img/client-logos/adentech.png',
      status: 'Flagship Partner',
      nda: false,
      quote: 'Transformed complex technical software into an electric cinematic commercial.',
    },
    {
      id: 'cli-04',
      name: 'Vishwa Vinayak Group',
      industry: 'Real Estate & Infrastructure',
      projectsCount: 6,
      logoUrl: '/img/client-logos/vishwa-vinayak-group.png',
      status: 'Full-Time Engagement',
      nda: false,
      quote: 'Spearheads all digital video initiatives and social media storytelling with vision.',
    },
  ],
  analytics: {
    totalReelViews: '54,829,140',
    avgRetentionRate: '78.4%',
    watchTimeHours: '1,240,500',
    topPerformingPlatform: 'Instagram Reels (62%)',
    audienceGeo: [
      { region: 'India (Tier 1 Metros)', share: 54 },
      { region: 'United States & Canada', share: 24 },
      { region: 'United Kingdom & Europe', share: 14 },
      { region: 'APAC & Middle East', share: 8 },
    ],
    monthlyViewsHistory: [
      { month: 'Oct', views: '3.4M', reels: 8 },
      { month: 'Nov', views: '4.8M', reels: 12 },
      { month: 'Dec', views: '6.2M', reels: 15 },
      { month: 'Jan', views: '7.9M', reels: 18 },
      { month: 'Feb', views: '9.4M', reels: 20 },
      { month: 'Mar', views: '11.8M', reels: 24 },
    ],
  },
  socialLinks: [
    {
      id: 'soc-01',
      platform: 'LinkedIn',
      handle: 'in/ritiksoni',
      url: 'https://linkedin.com/in/ritiksoni',
      followers: '12.4K',
      badge: 'PRIMARY BUSINESS',
      active: true,
    },
    {
      id: 'soc-02',
      platform: 'Instagram',
      handle: '@ritiksoni',
      url: 'https://instagram.com/ritiksoni',
      followers: '48.2K',
      badge: 'REELS SHOWCASE',
      active: true,
    },
    {
      id: 'soc-03',
      platform: 'X (Twitter)',
      handle: '@ritiksoni',
      url: 'https://twitter.com/ritiksoni',
      followers: '8.9K',
      badge: 'CREATIVE THOUGHTS',
      active: true,
    },
    {
      id: 'soc-04',
      platform: 'YouTube',
      handle: '@RitikSoniCinema',
      url: 'https://youtube.com',
      followers: '24.1K',
      badge: 'LONG-FORM ESSAYS',
      active: true,
    },
    {
      id: 'soc-05',
      platform: 'Email Transmit',
      handle: 'theritiksoni@gmail.com',
      url: 'mailto:theritiksoni@gmail.com',
      followers: 'Priority Terminal',
      badge: 'DIRECT CONTACT',
      active: true,
    },
  ],
  availability: {
    status: 'BOOKING Q2 / Q3 2026',
    subtext: 'Open for Commercial Directing, Flagship SMM Retainers & Executive Roles',
    capacityPercent: 75,
    timezone: 'IST (UTC+5:30) / Global Remote',
    weeklyHoursAvailable: 35,
    nextOpenSlotDate: '2026-04-15',
    acceptingNewClients: true,
    autoResponseNote: 'All transmissions reviewed within 24 hours. Emergency shoot requests handled via phone/priority terminal.',
  },
  settings: {
    studioTitle: 'Ritik Soni Creative Studios',
    metaDescription: 'Official portfolio and creative control room for Ritik Soni — Filmmaker, Video Production Executive & SMM Post Lead.',
    defaultSoundOn: true,
    crtScanlinesEnabled: true,
    adminPasscode: 'admin',
    adminEmail: 'theritiksoni@gmail.com',
    syncToLocalBackend: false,
    backendApiUrl: 'http://localhost:3001',
    lastBackupDate: new Date().toISOString().split('T')[0],
  },
  team: [
    {
      id: 'tm-01',
      name: 'Ritik Soni',
      role: 'Director, Editor & Post-Production Lead',
      type: 'Executive Lead',
      email: 'theritiksoni@gmail.com',
      status: 'On Duty // Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      assignedProjectsCount: 17,
      skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'SMM Strategy'],
    },
    {
      id: 'tm-02',
      name: 'Karan Sharma',
      role: 'Director of Photography (DP) & Drone Pilot',
      type: 'Camera Department',
      email: 'karan.dop@cinema.in',
      status: 'Available On Call',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      assignedProjectsCount: 6,
      skills: ['RED V-Raptor', 'Sony FX6', 'DJI Inspire 3', 'Lighting'],
    },
    {
      id: 'tm-03',
      name: 'Maya Sengupta',
      role: '3D Motion Designer & Houdini Artist',
      type: 'VFX Department',
      email: 'maya@renderbox.io',
      status: 'Assigned to Adentech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      assignedProjectsCount: 4,
      skills: ['Blender', 'Cinema 4D', 'Unreal Engine 5', 'After Effects'],
    },
    {
      id: 'tm-04',
      name: 'Marcus Vance',
      role: 'Hollywood Sound Designer & Audio Mastering',
      type: 'Sound Department',
      email: 'marcus@soundforge.la',
      status: 'Available On Call',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      assignedProjectsCount: 8,
      skills: ['Pro Tools', 'Ableton Live', 'Foley Recording', 'Dolby Atmos'],
    },
  ],
  adminUsers: [
    {
      id: 'usr-owner',
      name: 'Ritik Soni',
      email: 'theritiksoni@gmail.com',
      role: 'owner',
      passcode: '2026',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      title: 'Director & Studio Owner',
      status: 'OWNER // UNRESTRICTED',
      capabilities: ['PROJECTS', 'MEDIA', 'LEADS', 'ANALYTICS', 'CONTENT', 'SETTINGS', 'TEAM'],
      createdAt: '2025-01-01',
      lastActive: 'Online Now',
    },
    {
      id: 'usr-collab-1',
      name: 'Maya Sengupta',
      email: 'maya@renderbox.io',
      role: 'collaborator',
      passcode: '1111',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      title: '3D VFX & Motion Lead',
      status: 'COLLABORATOR // ACTIVE',
      capabilities: ['PROJECTS', 'MEDIA'],
      createdAt: '2025-02-10',
      lastActive: '15 mins ago',
    },
    {
      id: 'usr-collab-2',
      name: 'Devansh Verma',
      email: 'devansh@agency.in',
      role: 'collaborator',
      passcode: '2222',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      title: 'Client Partner & Content Strategist',
      status: 'COLLABORATOR // ACTIVE',
      capabilities: ['LEADS', 'CONTENT'],
      createdAt: '2025-02-18',
      lastActive: '1 hour ago',
    },
  ],
};

class AdminStore {
  constructor() {
    this.cache = null;
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
        // Backfill adminUsers if missing in existing local storage
        if (!this.cache.adminUsers || !Array.isArray(this.cache.adminUsers) || this.cache.adminUsers.length === 0) {
          this.cache.adminUsers = DEFAULT_SEED_DATA.adminUsers;
          this.saveToStorage();
        }
      } else {
        this.cache = DEFAULT_SEED_DATA;
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Control Room Storage fallback to memory seed:', e);
      this.cache = DEFAULT_SEED_DATA;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      window.dispatchEvent(new CustomEvent('control-room-updated', { detail: this.cache }));
    } catch (e) {
      console.error('Failed to save to control room storage:', e);
    }
  }

  // Generic Module Accessors
  getData() {
    if (!this.cache) this.init();
    return this.cache;
  }

  getModule(key) {
    if (!this.cache) this.init();
    return this.cache[key] || [];
  }

  setModule(key, data) {
    if (!this.cache) this.init();
    this.cache[key] = data;
    this.saveToStorage();
    return this.cache[key];
  }

  // --- Projects CRUD ---
  addProject(project) {
    const newProj = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      year: project.year || String(new Date().getFullYear()),
    };
    this.cache.projects = [newProj, ...this.cache.projects];
    this.saveToStorage();
    return newProj;
  }

  updateProject(id, updates) {
    this.cache.projects = this.cache.projects.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    this.saveToStorage();
  }

  deleteProject(id) {
    this.cache.projects = this.cache.projects.filter((p) => p.id !== id);
    this.saveToStorage();
  }

  // --- Leads CRUD ---
  addLead(lead) {
    const newLead = {
      ...lead,
      id: `lead-${Date.now()}`,
      receivedAt: new Date().toISOString(),
      status: lead.status || 'NEW',
    };
    this.cache.leads = [newLead, ...this.cache.leads];
    this.saveToStorage();
    return newLead;
  }

  updateLead(id, updates) {
    this.cache.leads = this.cache.leads.map((l) =>
      l.id === id ? { ...l, ...updates } : l
    );
    this.saveToStorage();
  }

  deleteLead(id) {
    this.cache.leads = this.cache.leads.filter((l) => l.id !== id);
    this.saveToStorage();
  }

  // --- Media CRUD ---
  addMedia(media) {
    const item = {
      ...media,
      id: `m-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    this.cache.media = [item, ...this.cache.media];
    this.saveToStorage();
    return item;
  }

  deleteMedia(id) {
    this.cache.media = this.cache.media.filter((m) => m.id !== id);
    this.saveToStorage();
  }

  // --- Services CRUD ---
  addService(service) {
    const srv = {
      ...service,
      id: `srv-${Date.now()}`,
      active: true,
    };
    this.cache.services = [...this.cache.services, srv];
    this.saveToStorage();
    return srv;
  }

  updateService(id, updates) {
    this.cache.services = this.cache.services.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.saveToStorage();
  }

  deleteService(id) {
    this.cache.services = this.cache.services.filter((s) => s.id !== id);
    this.saveToStorage();
  }

  // --- Clients CRUD ---
  addClient(client) {
    const cli = {
      ...client,
      id: `cli-${Date.now()}`,
      projectsCount: client.projectsCount || 1,
    };
    this.cache.clients = [...this.cache.clients, cli];
    this.saveToStorage();
    return cli;
  }

  updateClient(id, updates) {
    this.cache.clients = this.cache.clients.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    this.saveToStorage();
  }

  deleteClient(id) {
    this.cache.clients = this.cache.clients.filter((c) => c.id !== id);
    this.saveToStorage();
  }

  // --- Team CRUD ---
  addTeamMember(member) {
    const tm = {
      ...member,
      id: `tm-${Date.now()}`,
      assignedProjectsCount: member.assignedProjectsCount || 0,
    };
    this.cache.team = [...this.cache.team, tm];
    this.saveToStorage();
    return tm;
  }

  updateTeamMember(id, updates) {
    this.cache.team = this.cache.team.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.saveToStorage();
  }

  deleteTeamMember(id) {
    this.cache.team = this.cache.team.filter((t) => t.id !== id);
    this.saveToStorage();
  }

  // --- Experience CRUD ---
  addExperience(exp) {
    const newExp = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    this.cache.experience = [newExp, ...this.cache.experience];
    this.saveToStorage();
    return newExp;
  }

  updateExperience(id, updates) {
    this.cache.experience = this.cache.experience.map((e) =>
      e.id === id ? { ...e, ...updates } : e
    );
    this.saveToStorage();
  }

  deleteExperience(id) {
    this.cache.experience = this.cache.experience.filter((e) => e.id !== id);
    this.saveToStorage();
  }

  // --- Skills CRUD ---
  addSkill(skill) {
    const newSkill = {
      ...skill,
      id: `skill-${Date.now()}`,
    };
    this.cache.skills = [...this.cache.skills, newSkill];
    this.saveToStorage();
    return newSkill;
  }

  updateSkill(id, updates) {
    this.cache.skills = this.cache.skills.map((s) =>
      s.id === id ? { ...s, ...updates } : s
    );
    this.saveToStorage();
  }

  deleteSkill(id) {
    this.cache.skills = this.cache.skills.filter((s) => s.id !== id);
    this.saveToStorage();
  }

  // --- Availability & Settings & Social ---
  updateAvailability(updates) {
    this.cache.availability = { ...this.cache.availability, ...updates };
    this.saveToStorage();
  }

  updateSettings(updates) {
    this.cache.settings = { ...this.cache.settings, ...updates };
    this.saveToStorage();
  }

  updateSocialLinks(links) {
    this.cache.socialLinks = links;
    this.saveToStorage();
  }

  // --- Backup & Restore ---
  exportSnapshot() {
    return JSON.stringify(this.cache, null, 2);
  }

  importSnapshot(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed === 'object') {
        this.cache = parsed;
        this.saveToStorage();
        return { success: true };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDefaults() {
    this.cache = DEFAULT_SEED_DATA;
    this.saveToStorage();
    return this.cache;
  }

  // --- Admin Users & Capability Permissions ---
  getAdminUsers() {
    if (!this.cache) this.init();
    return this.cache.adminUsers || [];
  }

  addAdminUser(userData) {
    if (!this.cache) this.init();
    const newUser = {
      ...userData,
      id: userData.id || `usr-${Date.now()}`,
      role: 'collaborator', // Newly invited users are collaborators
      status: 'COLLABORATOR // ACTIVE',
      capabilities: Array.isArray(userData.capabilities) ? userData.capabilities : [],
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just invited',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    };
    this.cache.adminUsers = [...(this.cache.adminUsers || []), newUser];
    this.saveToStorage();
    return newUser;
  }

  updateAdminUser(id, updates) {
    if (!this.cache) this.init();
    this.cache.adminUsers = (this.cache.adminUsers || []).map((u) => {
      if (u.id === id) {
        // Enforce Owner protection: Ritik always retains owner role and full 7 capabilities
        if (u.role === 'owner') {
          return {
            ...u,
            ...updates,
            role: 'owner',
            capabilities: ['PROJECTS', 'MEDIA', 'LEADS', 'ANALYTICS', 'CONTENT', 'SETTINGS', 'TEAM'],
          };
        }
        return { ...u, ...updates };
      }
      return u;
    });
    this.saveToStorage();

    // If active logged-in user was updated, sync current user session
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      const refreshed = this.cache.adminUsers.find((u) => u.id === id);
      if (refreshed) {
        this.setCurrentUser(refreshed);
      }
    }
  }

  deleteAdminUser(id) {
    if (!this.cache) this.init();
    const target = (this.cache.adminUsers || []).find((u) => u.id === id);
    if (target && target.role === 'owner') {
      console.warn('Action Denied: Studio Owner Ritik cannot be deleted.');
      return false;
    }
    this.cache.adminUsers = (this.cache.adminUsers || []).filter((u) => u.id !== id);
    this.saveToStorage();
    return true;
  }

  getCurrentUser() {
    try {
      const stored = sessionStorage.getItem(CURRENT_USER_KEY) || localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Refresh with latest from cache if available
        const users = this.getAdminUsers();
        const found = users.find((u) => u.id === parsed.id);
        if (found) return found;
        return parsed;
      }
    } catch {}

    // Default fallback to Owner
    const users = this.getAdminUsers();
    return users.find((u) => u.role === 'owner') || users[0] || null;
  }

  setCurrentUser(user) {
    try {
      const userStr = JSON.stringify(user);
      sessionStorage.setItem(CURRENT_USER_KEY, userStr);
      localStorage.setItem(CURRENT_USER_KEY, userStr);
      window.dispatchEvent(new CustomEvent('control-room-user-changed', { detail: user }));
    } catch (e) {
      console.error('Failed to set current user:', e);
    }
  }

  switchUser(userId) {
    const users = this.getAdminUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      this.setCurrentUser(target);
      return target;
    }
    return null;
  }

  hasCapability(capabilityKey) {
    const user = this.getCurrentUser();
    if (!user) return false;
    // Owner has unrestricted superadmin access across all systems
    if (user.role === 'owner') return true;
    if (!capabilityKey) return true;
    return Array.isArray(user.capabilities) && user.capabilities.includes(capabilityKey);
  }

  isModuleAllowed(moduleId) {
    const requiredCap = MODULE_CAPABILITY_MAP[moduleId];
    if (!requiredCap) return true; // Modules like overview are open
    return this.hasCapability(requiredCap);
  }

  // --- Authentication ---
  isAuthenticated() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === 'true' || localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  }

  login(credential, remember = false) {
    if (!this.cache) this.init();
    const users = this.getAdminUsers();
    const trimmed = String(credential || '').trim().toLowerCase();

    // 1. Direct match by user passcode or email
    let authenticatedUser = users.find(
      (u) =>
        (u.passcode && u.passcode.toLowerCase() === trimmed) ||
        (u.email && u.email.toLowerCase() === trimmed)
    );

    // 2. Default fallback pins for owner (admin, 2026, ritik)
    const settingsPass = (this.cache?.settings?.adminPasscode || 'admin').toLowerCase();
    if (!authenticatedUser) {
      if (trimmed === settingsPass || trimmed === 'admin' || trimmed === 'ritik' || trimmed === '2026') {
        authenticatedUser = users.find((u) => u.role === 'owner') || users[0];
      }
    }

    if (authenticatedUser) {
      if (remember) {
        localStorage.setItem(AUTH_KEY, 'true');
      }
      sessionStorage.setItem(AUTH_KEY, 'true');
      this.setCurrentUser(authenticatedUser);
      return true;
    }

    return false;
  }

  logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new CustomEvent('control-room-user-changed', { detail: null }));
    } catch {}
  }
}

const adminStore = new AdminStore();
export default adminStore;
