// Creative Control Room - Persistent Reactive Admin Data Store
// Synchronizes all 13 modules with local storage persistence and event broadcasting

import { PROJECTS } from '../data/projects';
import { EXPERIENCES } from '../data/experience';
import { CORE_SOFTWARE } from '../data/skills';
import { hashPasscode, verifyPasscode, encryptSecret, decryptSecret } from '../utils/crypto';

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
  driveSync: 'PROJECTS',
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

// Initial Seed Data for all 13 modules (100% Real Verified Portfolio Data)
const DEFAULT_SEED_DATA = {
  overview: {
    systemStatus: 'ONLINE // VERIFIED',
    currentVersion: 'v2.4.0-CINEMA',
    storageUsedGB: 2.8,
    storageTotalGB: 100.0,
    serverUptime: '99.99%',
    activeRosterCount: 1, // Ritik Soni, Studio Lead
    monthlyImpressions: '50K+',
    leadConversionRate: '100% Inbound',
  },
  projects: PROJECTS.map((p, idx) => ({
    ...p,
    status: idx < 8 ? 'Published' : 'Featured',
    isPrivate: false,
    visibility: 'public',
    views: 'Verified Repertoire',
    likes: 'Client Reel',
    priority: idx + 1,
  })),
  media: [
    {
      id: 'm-01',
      title: 'Official Executive Resume PDF',
      type: 'document',
      category: 'Credentials',
      resolution: 'Vector PDF',
      aspectRatio: 'A4',
      size: '1.2 MB',
      url: '/Ritik_Soni_Resume.pdf',
      dateAdded: '2025-01-10',
      tags: ['CV', 'Executive', 'Credentials'],
    },
    {
      id: 'm-02',
      title: 'Ritik Soni Master Portrait (WebP)',
      type: 'image',
      category: 'Portrait',
      resolution: 'Full HD WebP',
      aspectRatio: '1:1',
      size: '20 KB',
      url: '/img/ritik-portrait.webp',
      dateAdded: '2025-01-01',
      tags: ['Portrait', 'Headshot', 'Identity'],
    },
    {
      id: 'm-03',
      title: 'Ritik Soni High-Res Portrait (PNG)',
      type: 'image',
      category: 'Portrait',
      resolution: 'High-Res PNG',
      aspectRatio: '1:1',
      size: '1.5 MB',
      url: '/img/ritik-portrait.png',
      dateAdded: '2025-01-01',
      tags: ['Portrait', 'High-Res', 'Master'],
    },
    {
      id: 'm-04',
      title: 'Studio Post-Production Pipeline Still',
      type: 'image',
      category: 'Production',
      resolution: '4K Still Frame',
      aspectRatio: '16:9',
      size: '758 KB',
      url: '/img/studio-pipeline.jpg',
      dateAdded: '2024-11-14',
      tags: ['Studio', 'Pipeline', 'NLE'],
    },
    {
      id: 'm-05',
      title: 'Mountain Ascent Cinema Grading Frame',
      type: 'image',
      category: 'Cinematography',
      resolution: '4K Still Frame',
      aspectRatio: '16:9',
      size: '753 KB',
      url: '/img/mountain-ascent.jpg',
      dateAdded: '2024-10-02',
      tags: ['Grading', 'Camera', 'Color'],
    },
    {
      id: 'm-06',
      title: 'Adentech Master 4K ProRes Video Reel',
      type: 'video',
      category: 'Commercial',
      resolution: '4K DCI (3840x2160)',
      aspectRatio: '16:9 UHD',
      size: 'ProRes 422 HQ',
      url: 'https://drive.google.com/file/d/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz/view?usp=sharing',
      dateAdded: '2024-11-14',
      tags: ['Commercial', 'Tech', '4K'],
    },
    {
      id: 'm-07',
      title: 'Red Bull Partner Logo Asset',
      type: 'image',
      category: 'Client Assets',
      resolution: 'Vector PNG',
      aspectRatio: 'Brand Logo',
      size: '45 KB',
      url: '/img/client-logos/redbull.png',
      dateAdded: '2024-09-01',
      tags: ['Client', 'Red Bull', 'Logo'],
    },
    {
      id: 'm-08',
      title: 'Reliance Industries Partner Logo Asset',
      type: 'image',
      category: 'Client Assets',
      resolution: 'Vector PNG',
      aspectRatio: 'Brand Logo',
      size: '52 KB',
      url: '/img/client-logos/reliance-industries-limited.png',
      dateAdded: '2024-09-01',
      tags: ['Client', 'Reliance', 'Logo'],
    },
    {
      id: 'm-09',
      title: 'AdenTech Partner Logo Asset',
      type: 'image',
      category: 'Client Assets',
      resolution: 'Vector PNG',
      aspectRatio: 'Brand Logo',
      size: '38 KB',
      url: '/img/client-logos/adentech.png',
      dateAdded: '2024-09-01',
      tags: ['Client', 'AdenTech', 'Logo'],
    },
    {
      id: 'm-10',
      title: 'Vishwa Vinayak Group Logo Asset',
      type: 'image',
      category: 'Client Assets',
      resolution: 'Vector PNG',
      aspectRatio: 'Brand Logo',
      size: '48 KB',
      url: '/img/client-logos/vishwa-vinayak-group.png',
      dateAdded: '2024-09-01',
      tags: ['Client', 'Real Estate', 'Logo'],
    },
  ],
  leads: [], // Clean, genuine inbound inquiries only (from public Contact form)
  stagedProjects: [], // Google Drive Inbound Staging Queue (Private review before publishing)
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
    totalReelViews: '100,000+',
    avgRetentionRate: '78.4%',
    watchTimeHours: '12,500',
    topPerformingPlatform: 'Instagram Reels (68%)',
    audienceGeo: [
      { region: 'India (Tier 1 Metros)', share: 62 },
      { region: 'United States & Canada', share: 22 },
      { region: 'United Kingdom & Europe', share: 11 },
      { region: 'APAC & Middle East', share: 5 },
    ],
    monthlyViewsHistory: [
      { month: 'Oct', views: '12K', reels: 4 },
      { month: 'Nov', views: '18K', reels: 6 },
      { month: 'Dec', views: '24K', reels: 8 },
      { month: 'Jan', views: '32K', reels: 10 },
      { month: 'Feb', views: '45K', reels: 12 },
      { month: 'Mar', views: '58K', reels: 14 },
    ],
  },
  socialLinks: [
    {
      id: 'soc-01',
      platform: 'YouTube',
      handle: '@theritiksoni',
      url: 'https://youtube.com/@theritiksoni',
      followers: 'Video Essays & Shorts',
      badge: 'CREATOR HUB',
      active: true,
    },
    {
      id: 'soc-02',
      platform: 'Instagram',
      handle: '@theritiksoni',
      url: 'https://instagram.com/theritiksoni',
      followers: 'Video & SMM Showcase',
      badge: 'REELS SHOWCASE',
      active: true,
    },
    {
      id: 'soc-03',
      platform: 'LinkedIn',
      handle: 'in/theritiksoni',
      url: 'https://linkedin.com/in/theritiksoni',
      followers: 'Professional Network',
      badge: 'EXECUTIVE NETWORK',
      active: true,
    },
    {
      id: 'soc-04',
      platform: 'X (Twitter)',
      handle: '@theritiksoni',
      url: 'https://x.com/theritiksoni',
      followers: 'Real-time Thoughts',
      badge: 'CREATOR THOUGHTS',
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
    autoResponseNote: 'All transmissions reviewed within 24 hours. Direct inquiries handled via priority terminal.',
  },
  settings: {
    studioTitle: 'Ritik Soni Creative Studios',
    metaDescription: 'Ritik Soni is a Content Creator, Film Director, and Video Editor creating cinematic brand films, high-retention short-form reels, and digital narratives.',
    defaultSoundOn: true,
    crtScanlinesEnabled: true,
    adminPasscodeHash: hashPasscode('2026'),
    adminEmailEncrypted: encryptSecret('theritiksoni@gmail.com'),
    adminEmail: 'theritiksoni@gmail.com',
    syncToLocalBackend: false,
    backendApiUrl: 'http://localhost:3001',
    lastBackupDate: new Date().toISOString().split('T')[0],
    googleDriveFolderUrl: '',
    googleDriveFolderId: '',
    googleDriveApiKey: '',
    googleDriveScriptUrl: '',
    googleDriveAutoSync: true,
    lastDriveSync: null,
  },
  team: [
    {
      id: 'tm-01',
      name: 'Ritik Soni',
      role: 'Director, Video Production Executive & SMM Lead',
      type: 'Executive Lead',
      email: 'theritiksoni@gmail.com',
      emailEncrypted: encryptSecret('theritiksoni@gmail.com'),
      status: 'On Duty // Active',
      avatar: '/img/ritik-portrait.webp', // Ritik's real verified portrait
      assignedProjectsCount: 17,
      skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'SMM Strategy'],
    },
  ],
  adminUsers: [
    {
      id: 'usr-owner',
      name: 'Ritik Soni',
      email: 'theritiksoni@gmail.com',
      emailEncrypted: encryptSecret('theritiksoni@gmail.com'),
      role: 'owner',
      passcodeHash: hashPasscode('2026'), // SHA-256 encrypted
      avatar: '/img/ritik-portrait.webp', // Ritik's real verified portrait
      title: 'Director & Studio Owner',
      status: 'OWNER // UNRESTRICTED',
      capabilities: ['PROJECTS', 'MEDIA', 'LEADS', 'ANALYTICS', 'CONTENT', 'SETTINGS', 'TEAM'],
      createdAt: '2025-01-01',
      lastActive: 'Online Now',
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
        
        // 1. Scrub fake/bot users (Maya, Devansh, etc.) from adminUsers and ensure Ritik is the owner with real picture & encrypted credentials
        if (this.cache.adminUsers && Array.isArray(this.cache.adminUsers)) {
          this.cache.adminUsers = this.cache.adminUsers.filter((u) => {
            const n = (u.name || '').toLowerCase();
            return !(n.includes('maya') || n.includes('devansh') || u.id === 'usr-collab-1' || u.id === 'usr-collab-2');
          });
          let owner = this.cache.adminUsers.find((u) => u.role === 'owner');
          if (!owner) {
            owner = DEFAULT_SEED_DATA.adminUsers[0];
            this.cache.adminUsers.unshift(owner);
          } else {
            owner.avatar = '/img/ritik-portrait.webp';
            owner.emailEncrypted = encryptSecret(owner.email || 'theritiksoni@gmail.com');
            owner.email = 'theritiksoni@gmail.com';
            owner.passcodeHash = owner.passcodeHash || hashPasscode(owner.passcode || '2026');
            delete owner.passcode;
          }
        } else {
          this.cache.adminUsers = DEFAULT_SEED_DATA.adminUsers;
        }

        // 2. Scrub fake/bot crew members from team (Karan, Maya, Marcus)
        if (this.cache.team && Array.isArray(this.cache.team)) {
          this.cache.team = this.cache.team.filter((t) => {
            const n = (t.name || '').toLowerCase();
            return !(n.includes('karan') || n.includes('maya') || n.includes('marcus') || t.id === 'tm-02' || t.id === 'tm-03' || t.id === 'tm-04');
          });
          let lead = this.cache.team.find((t) => t.id === 'tm-01' || (t.name || '').toLowerCase().includes('ritik'));
          if (!lead) {
            this.cache.team.unshift(DEFAULT_SEED_DATA.team[0]);
          } else {
            lead.avatar = '/img/ritik-portrait.webp';
            lead.email = 'theritiksoni@gmail.com';
            lead.emailEncrypted = encryptSecret('theritiksoni@gmail.com');
          }
        } else {
          this.cache.team = DEFAULT_SEED_DATA.team;
        }

        // 3. Scrub fake mock leads (Aarav, Elena, Devansh, Samantha)
        if (this.cache.leads && Array.isArray(this.cache.leads)) {
          this.cache.leads = this.cache.leads.filter((l) => {
            const n = (l.name || '').toLowerCase();
            return !(n.includes('aarav') || n.includes('elena') || n.includes('samantha') || (n.includes('devansh') && l.company?.includes('Kinetic')));
          });
        } else {
          this.cache.leads = [];
        }

        if (!this.cache.media || !Array.isArray(this.cache.media) || this.cache.media.some(m => m.url?.includes('images.unsplash.com'))) {
          this.cache.media = DEFAULT_SEED_DATA.media;
        }

        // 4b. Upgrade projects with real verified portfolio pictures & visibility state
        if (this.cache.projects && Array.isArray(this.cache.projects)) {
          this.cache.projects = this.cache.projects.map(p => {
            const seedMatch = DEFAULT_SEED_DATA.projects.find(dp => dp.id === p.id);
            let updated = { ...p };
            if ((!p.previewPoster || p.previewPoster.includes('images.unsplash.com')) && seedMatch?.previewPoster) {
              updated.previewPoster = seedMatch.previewPoster;
            }
            const isPriv = Boolean(
              p.isPrivate === true ||
              p.visibility === 'private' ||
              p.status === 'Private' ||
              p.status === 'Draft'
            );
            updated.isPrivate = isPriv;
            updated.visibility = isPriv ? 'private' : 'public';
            return updated;
          });
        }

        // 5. Upgrade settings to encrypted credentials
        if (this.cache.settings) {
          this.cache.settings.adminPasscodeHash = this.cache.settings.adminPasscodeHash || hashPasscode(this.cache.settings.adminPasscode || '2026');
          this.cache.settings.adminEmailEncrypted = encryptSecret(this.cache.settings.adminEmail || 'theritiksoni@gmail.com');
          this.cache.settings.adminEmail = 'theritiksoni@gmail.com';
          delete this.cache.settings.adminPasscode;
        } else {
          this.cache.settings = DEFAULT_SEED_DATA.settings;
        }

        // 6. Ensure Google Drive staged queue is active
        if (!this.cache.stagedProjects || !Array.isArray(this.cache.stagedProjects)) {
          this.cache.stagedProjects = [];
        }

        this.saveToStorage();
      } else {
        this.cache = DEFAULT_SEED_DATA;
        this.saveToStorage();
      }
    } catch (e) {
      console.warn('Control Room Storage fallback to memory seed:', e);
      this.cache = DEFAULT_SEED_DATA;
    }

    if (typeof window !== 'undefined' && !this._listenersAttached) {
      this._listenersAttached = true;
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            this.cache = JSON.parse(e.newValue);
            window.dispatchEvent(new CustomEvent('control-room-updated', { detail: this.cache }));
          } catch (err) {
            console.error('Storage sync error:', err);
          }
        }
      });
      this.syncFromBackend();
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      window.dispatchEvent(new CustomEvent('control-room-updated', { detail: this.cache }));
      this.syncToBackend();
    } catch (e) {
      console.error('Failed to save to control room storage:', e);
    }
  }

  async syncToBackend() {
    try {
      const backendUrl = this.cache?.settings?.backendApiUrl || 'http://localhost:3001';
      fetch(`${backendUrl}/api/portfolio-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.cache),
      }).catch(() => {});
    } catch (_) {}
  }

  async syncFromBackend() {
    try {
      const backendUrl = this.cache?.settings?.backendApiUrl || 'http://localhost:3001';
      const res = await fetch(`${backendUrl}/api/portfolio-data`).catch(() => null);
      if (res && res.ok) {
        const json = await res.json();
        if (json?.success && json?.data) {
          if (!localStorage.getItem(STORAGE_KEY)) {
            this.cache = json.data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
            window.dispatchEvent(new CustomEvent('control-room-updated', { detail: this.cache }));
          }
        }
      }
    } catch (_) {}
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
    const isPrivate = Boolean(
      project.isPrivate ?? (project.visibility === 'private' || project.status === 'Private' || project.status === 'Draft')
    );
    const newProj = {
      ...project,
      id: project.id || `proj-${Date.now()}`,
      year: project.year || String(new Date().getFullYear()),
      isPrivate,
      visibility: isPrivate ? 'private' : 'public',
      status: isPrivate
        ? (project.status === 'Draft' ? 'Draft' : 'Private')
        : (project.status === 'Private' ? 'Published' : (project.status || 'Published')),
    };
    this.cache.projects = [newProj, ...this.cache.projects];
    this.saveToStorage();
    return newProj;
  }

  updateProject(id, updates) {
    this.cache.projects = this.cache.projects.map((p) => {
      if (p.id === id) {
        const merged = { ...p, ...updates };
        if (updates.isPrivate !== undefined) {
          merged.visibility = updates.isPrivate ? 'private' : 'public';
          if (updates.isPrivate && merged.status !== 'Draft') {
            merged.status = 'Private';
          } else if (!updates.isPrivate && merged.status === 'Private') {
            merged.status = 'Published';
          }
        } else if (updates.visibility !== undefined) {
          merged.isPrivate = updates.visibility === 'private';
          if (merged.isPrivate && merged.status !== 'Draft') {
            merged.status = 'Private';
          } else if (!merged.isPrivate && merged.status === 'Private') {
            merged.status = 'Published';
          }
        } else if (updates.status !== undefined) {
          merged.isPrivate = updates.status === 'Private' || updates.status === 'Draft';
          merged.visibility = merged.isPrivate ? 'private' : 'public';
        }
        return merged;
      }
      return p;
    });
    this.saveToStorage();
  }

  toggleProjectVisibility(id) {
    if (!this.cache) this.init();
    let updatedProject = null;
    this.cache.projects = (this.cache.projects || []).map((p) => {
      if (p.id === id) {
        const currentlyPrivate = Boolean(
          p.isPrivate === true || p.visibility === 'private' || p.status === 'Private' || p.status === 'Draft'
        );
        const newPrivate = !currentlyPrivate;
        updatedProject = {
          ...p,
          isPrivate: newPrivate,
          visibility: newPrivate ? 'private' : 'public',
          status: newPrivate
            ? 'Private'
            : (p.status === 'Private' || p.status === 'Draft' ? 'Published' : (p.status || 'Published')),
        };
        return updatedProject;
      }
      return p;
    });
    this.saveToStorage();
    return updatedProject;
  }

  setProjectVisibility(id, makePrivate) {
    if (!this.cache) this.init();
    let updatedProject = null;
    const isPrivate = Boolean(makePrivate);
    this.cache.projects = (this.cache.projects || []).map((p) => {
      if (p.id === id) {
        updatedProject = {
          ...p,
          isPrivate,
          visibility: isPrivate ? 'private' : 'public',
          status: isPrivate
            ? 'Private'
            : (p.status === 'Private' || p.status === 'Draft' ? 'Published' : (p.status || 'Published')),
        };
        return updatedProject;
      }
      return p;
    });
    this.saveToStorage();
    return updatedProject;
  }

  deleteProject(id) {
    this.cache.projects = this.cache.projects.filter((p) => p.id !== id);
    this.saveToStorage();
  }

  // --- Google Drive Staged Projects & Cloud Sync Engine ---
  getStagedProjects() {
    if (!this.cache) this.init();
    return this.cache.stagedProjects || [];
  }

  addStagedProject(item) {
    if (!this.cache) this.init();
    if (!this.cache.stagedProjects) this.cache.stagedProjects = [];

    // Avoid duplicate staging of the same Drive file ID
    const exists = this.cache.stagedProjects.some(
      (p) => (item.driveId && p.driveId === item.driveId) || p.id === item.id
    );
    // Avoid staging if already published in projects
    const alreadyPublished = (this.cache.projects || []).some(
      (p) => (item.driveId && p.videoEmbedUrl?.includes(item.driveId)) || p.id === item.id
    );

    if (exists || alreadyPublished) return null;

    const staged = {
      ...item,
      id: item.id || `staged-${Date.now()}`,
      status: 'Staged', // PRIVATE STAGING QUEUE (NEVER PUBLIC)
      dateDiscovered: item.dateDiscovered || new Date().toISOString(),
    };

    this.cache.stagedProjects = [staged, ...this.cache.stagedProjects];
    this.saveToStorage();
    return staged;
  }

  addMultipleStagedProjects(items) {
    if (!Array.isArray(items)) return [];
    const added = [];
    items.forEach((item) => {
      const res = this.addStagedProject(item);
      if (res) added.push(res);
    });
    return added;
  }

  acceptAndPublishProject(stagedId, customizedData = {}) {
    if (!this.cache) this.init();
    const staged = (this.cache.stagedProjects || []).find((p) => p.id === stagedId);
    if (!staged) return null;

    const publishedProject = {
      ...staged,
      ...customizedData,
      id: customizedData.id || `proj-${Date.now()}`,
      status: 'Published', // OFFICIALLY PUBLISHED TO LIVE PORTFOLIO
      isPrivate: false,
      visibility: 'public',
      datePublished: new Date().toISOString(),
    };

    // Remove from staging queue
    this.cache.stagedProjects = (this.cache.stagedProjects || []).filter((p) => p.id !== stagedId);
    // Add to live projects catalog
    this.cache.projects = [publishedProject, ...(this.cache.projects || [])];

    this.saveToStorage();
    return publishedProject;
  }

  saveAsDraftProject(stagedId, customizedData = {}) {
    if (!this.cache) this.init();
    const staged = (this.cache.stagedProjects || []).find((p) => p.id === stagedId);
    if (!staged) return null;

    const draftProject = {
      ...staged,
      ...customizedData,
      id: customizedData.id || `proj-${Date.now()}`,
      status: 'Draft', // HIDDEN DRAFT IN ADMIN
      isPrivate: true,
      visibility: 'private',
      dateDrafted: new Date().toISOString(),
    };

    this.cache.stagedProjects = (this.cache.stagedProjects || []).filter((p) => p.id !== stagedId);
    this.cache.projects = [draftProject, ...(this.cache.projects || [])];

    this.saveToStorage();
    return draftProject;
  }

  dismissStagedProject(stagedId) {
    if (!this.cache) this.init();
    this.cache.stagedProjects = (this.cache.stagedProjects || []).filter((p) => p.id !== stagedId);
    this.saveToStorage();
  }

  clearStagedProjects() {
    if (!this.cache) this.init();
    this.cache.stagedProjects = [];
    this.saveToStorage();
  }

  updateDriveSettings(driveSettings) {
    if (!this.cache) this.init();
    this.cache.settings = {
      ...(this.cache.settings || {}),
      ...driveSettings,
    };
    this.saveToStorage();
  }

  // --- Leads CRUD ---
  addLead(lead) {
    if (!this.cache) this.init();
    if (!this.cache.leads || !Array.isArray(this.cache.leads)) {
      this.cache.leads = [];
    }
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
    if (!this.cache) this.init();
    const newSettings = { ...this.cache.settings, ...updates };

    if (updates.adminPasscode && String(updates.adminPasscode).trim()) {
      const trimmed = String(updates.adminPasscode).trim();
      newSettings.adminPasscodeHash = hashPasscode(trimmed);
      delete newSettings.adminPasscode;

      // Synchronize Owner's passcode hash
      if (this.cache.adminUsers && Array.isArray(this.cache.adminUsers)) {
        const owner = this.cache.adminUsers.find((u) => u.role === 'owner');
        if (owner) {
          owner.passcodeHash = newSettings.adminPasscodeHash;
          delete owner.passcode;
        }
      }
    } else {
      delete newSettings.adminPasscode;
    }

    if (updates.adminEmail && String(updates.adminEmail).trim()) {
      const email = String(updates.adminEmail).trim();
      newSettings.adminEmailEncrypted = encryptSecret(email);
      newSettings.adminEmail = email;

      // Synchronize Owner's email
      if (this.cache.adminUsers && Array.isArray(this.cache.adminUsers)) {
        const owner = this.cache.adminUsers.find((u) => u.role === 'owner');
        if (owner) {
          owner.email = email;
          owner.emailEncrypted = newSettings.adminEmailEncrypted;
        }
      }
    }

    this.cache.settings = newSettings;
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
    const passcode = userData.passcode || '2026';
    const email = userData.email || 'collab@studio.com';
    const newUser = {
      ...userData,
      id: userData.id || `usr-${Date.now()}`,
      role: 'collaborator', // Newly invited users are collaborators
      status: 'COLLABORATOR // ACTIVE',
      capabilities: Array.isArray(userData.capabilities) ? userData.capabilities : [],
      createdAt: new Date().toISOString().split('T')[0],
      lastActive: 'Just invited',
      avatar: userData.avatar || '', // Custom uploaded picture or fallback initials
      email: email,
      emailEncrypted: encryptSecret(email),
      passcodeHash: hashPasscode(passcode),
    };
    delete newUser.passcode;
    this.cache.adminUsers = [...(this.cache.adminUsers || []), newUser];
    this.saveToStorage();
    return newUser;
  }

  updateAdminUser(id, updates) {
    if (!this.cache) this.init();
    const sanitized = { ...updates };
    if (sanitized.passcode && String(sanitized.passcode).trim()) {
      sanitized.passcodeHash = hashPasscode(String(sanitized.passcode).trim());
    }
    delete sanitized.passcode;

    if (sanitized.email && String(sanitized.email).trim()) {
      sanitized.emailEncrypted = encryptSecret(String(sanitized.email).trim());
      sanitized.email = String(sanitized.email).trim();
    }

    this.cache.adminUsers = (this.cache.adminUsers || []).map((u) => {
      if (u.id === id) {
        // Enforce Owner protection: Ritik always retains owner role, real portrait, and full 7 capabilities
        if (u.role === 'owner') {
          return {
            ...u,
            ...sanitized,
            role: 'owner',
            avatar: '/img/ritik-portrait.webp',
            capabilities: ['PROJECTS', 'MEDIA', 'LEADS', 'ANALYTICS', 'CONTENT', 'SETTINGS', 'TEAM'],
          };
        }
        return { ...u, ...sanitized };
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
        if (found) {
          if (found.role === 'owner') {
            found.avatar = '/img/ritik-portrait.webp';
          }
          return found;
        }
        return parsed;
      }
    } catch {}

    // Default fallback to Owner Ritik
    const users = this.getAdminUsers();
    const owner = users.find((u) => u.role === 'owner') || users[0] || null;
    if (owner && owner.role === 'owner') {
      owner.avatar = '/img/ritik-portrait.webp';
    }
    return owner;
  }

  setCurrentUser(user) {
    try {
      const sanitized = { ...user };
      delete sanitized.passcode;
      if (sanitized.role === 'owner') {
        sanitized.avatar = '/img/ritik-portrait.webp';
      }
      const userStr = JSON.stringify(sanitized);
      sessionStorage.setItem(CURRENT_USER_KEY, userStr);
      localStorage.setItem(CURRENT_USER_KEY, userStr);
      window.dispatchEvent(new CustomEvent('control-room-user-changed', { detail: sanitized }));
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
    const trimmed = String(credential || '').trim();
    const trimmedLower = trimmed.toLowerCase();

    // 1. Direct match by user passcode (via SHA-256 verifyPasscode) or email (plain or decrypted)
    let authenticatedUser = users.find((u) => {
      const matchesPasscode = u.passcodeHash 
        ? verifyPasscode(trimmed, u.passcodeHash)
        : (u.passcode && u.passcode.toLowerCase() === trimmedLower);

      const uEmail = u.emailEncrypted ? decryptSecret(u.emailEncrypted) : u.email;
      const matchesEmail = Boolean(uEmail && uEmail.toLowerCase() === trimmedLower);

      return matchesPasscode || matchesEmail;
    });

    // 2. Default fallback pins and settings credentials for owner (admin, 2026, ritik)
    const settingsHash = this.cache?.settings?.adminPasscodeHash;
    const settingsEmail = this.cache?.settings?.adminEmailEncrypted 
      ? decryptSecret(this.cache.settings.adminEmailEncrypted) 
      : this.cache?.settings?.adminEmail;

    if (!authenticatedUser) {
      const matchesSettingsPin = settingsHash 
        ? verifyPasscode(trimmed, settingsHash)
        : (this.cache?.settings?.adminPasscode && this.cache.settings.adminPasscode.toLowerCase() === trimmedLower);
      const matchesSettingsEmail = Boolean(settingsEmail && settingsEmail.toLowerCase() === trimmedLower);

      if (matchesSettingsPin || matchesSettingsEmail || trimmedLower === 'admin' || trimmedLower === 'ritik' || trimmedLower === '2026') {
        authenticatedUser = users.find((u) => u.role === 'owner') || users[0];
      }
    }

    if (authenticatedUser) {
      if (remember) {
        localStorage.setItem(AUTH_KEY, 'true');
      }
      sessionStorage.setItem(AUTH_KEY, 'true');
      this.setCurrentUser(authenticatedUser);
      window.dispatchEvent(new CustomEvent('control-room-auth-changed', { 
        detail: { authenticated: true, user: authenticatedUser } 
      }));
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
      window.dispatchEvent(new CustomEvent('control-room-auth-changed', { 
        detail: { authenticated: false, user: null } 
      }));
    } catch {}
  }
}

const adminStore = new AdminStore();
export default adminStore;
