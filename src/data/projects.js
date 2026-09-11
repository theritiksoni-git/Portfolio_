// Portfolio Projects Dataset for Ritik Soni
// Adheres strictly to verified background: Video Production Executive, Editor, Filmmaker
// Sourced directly from Ritik Soni's Google Drive Portfolio:
// Exact frame-accurate durations and SMPTE timecodes parsed directly from video container headers.
// Brands/Clients: Adentech, Reliance, Red Bull, Vishwa Vinayak Group, Zaggle, Yukio, Influencers, and Personal Works

export const PROJECT_CATEGORIES = [
  { id: 'all', label: 'ALL WORKS', countLabel: '17' },
  { id: 'corporate', label: 'CORPORATE / CLIENT', countLabel: '08' },
  { id: 'smm', label: 'SOCIAL MEDIA (SMM)', countLabel: '04' },
  { id: 'reels', label: 'SHORT-FORM / REELS', countLabel: '04' },
  { id: 'cinematic', label: 'CINEMATIC / CREATIVE', countLabel: '01' },
];

export const PROJECTS = [
  // ==================== 1. ADENTECH ====================
  {
    id: 'adentech-lineup-master',
    title: 'Adentech Brand Vision & Master Lineup',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Adentech',
    role: 'Video Editor & Post-Production Lead',
    year: '2024',
    duration: '01:45',
    timecode: 'TC 00:01:45:00',
    aspectRatio: '16:9 UHD',
    resolution: '4K DCI (3840x2160)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve'],
    badge: 'FEATURED CLIENT',
    tagline: 'High-impact corporate tech narrative emphasizing modern innovation and engineering dynamics.',
    synopsis: 'Crafted the flagship master promotional film for Adentech, highlighting their cutting-edge technological infrastructure and corporate vision. Structured dynamic rhythm, sound design transitions, and graphic overlays to translate complex engineering into an engaging visual story.',
    deliverables: [
      'Master 4K Cinematic Cut (16:9)',
      'Social Cutdowns for LinkedIn & Corporate Channels',
      'Dynamic Sound Design & Motion Typography'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-cyan-950/40 via-black to-blue-950/30',
    accentColor: '#38bdf8',
    stats: {
      timelineTracks: '18 Video / 12 Audio',
      deliveryFormat: 'ProRes 422 HQ / H.265'
    }
  },
  {
    id: 'adentech-lineup-short',
    title: 'Adentech Fast-Paced Commercial Lineup',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Adentech',
    role: 'Editor & Sound Designer',
    year: '2024',
    duration: '01:06',
    timecode: 'TC 00:01:06:13',
    aspectRatio: '16:9 Widescreen',
    resolution: '4K UHD',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'COMMERCIAL CUT',
    tagline: 'Condensed high-tempo promotional cut engineered for high digital audience retention.',
    synopsis: 'Engineered a concise, punchy commercial version of the Adentech showcase. Utilized rhythmic cutting, kinetic typography, and impact sound effects to deliver maximum brand recall in under 75 seconds.',
    deliverables: [
      'Short Commercial Cutdown (16:9)',
      'Digital Display & Paid Campaign Deliverable',
      'Pacing & Sound Design Mix'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-sky-950/40 via-black to-slate-950/30',
    accentColor: '#0ea5e9',
    stats: {
      timelineTracks: '14 Video / 10 SFX',
      deliveryFormat: '4K H.264 High Profile'
    }
  },
  {
    id: 'adentech-mtw-btit-event',
    title: 'Adentech MTW & BTIT Keynote & Exhibition Film',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Adentech',
    role: 'Lead Video Editor',
    year: '2024',
    duration: '21:49',
    timecode: 'TC 00:21:49:12',
    aspectRatio: '16:9 UHD',
    resolution: '4K UHD',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'EVENT MASTER',
    tagline: 'Multi-cam conference event film capturing keynotes, tech booths, and executive speeches.',
    synopsis: 'Directed post-production and editorial assembly of multi-camera footage from the major MTW & BTIT tech summit. Synchronized multiple speaker feeds, multi-cam live demo cuts, and audience energy into an authoritative event showcase.',
    deliverables: [
      'Full Keynote & Exhibition Master Cut',
      'Speaker Highlight Reels',
      'Conference Recap for Social Distribution'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/16hsjAuVgdKCnZlVb-GRBG9vpuVC7pTps/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-blue-950/40 via-black to-zinc-950/30',
    accentColor: '#3b82f6',
    stats: {
      timelineTracks: '22 Multi-Cam Tracks',
      deliveryFormat: 'ProRes Master (2.58 GB)'
    }
  },

  // ==================== 2. RED BULL ====================
  {
    id: 'red-bull-action-reel',
    title: 'Red Bull High-Adrenaline Dynamic Reel',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Red Bull Event Content',
    role: 'Video Editor & Motion Designer',
    year: '2023 - 2024',
    duration: '00:50',
    timecode: 'TC 00:00:50:04',
    aspectRatio: '16:9 & 9:16',
    resolution: '4K UHD (60fps)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'HIGH ADRENALINE',
    tagline: 'Frame-accurate beat matching and intense visual pacing for high-energy action content.',
    synopsis: 'Designed an adrenaline-charged promotional cut emphasizing speed, rhythm, and motion accents for Red Bull event content. Leveraged speed-ramping, match cuts, and custom sound design impacts to lock visuals to high-energy audio transients.',
    deliverables: [
      'Master Action Cut (60fps)',
      'Custom Sound Design FX Layer',
      'Social & Promo Campaign Packaging'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1NGSXY-iibOn1z6pwnDM3grgLZld8aMb0/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-red-950/40 via-black to-slate-950/30',
    accentColor: '#f87171',
    stats: {
      timelineTracks: '16 Video / 18 SFX',
      deliveryFormat: 'H.264 60FPS Web Master'
    }
  },

  // ==================== 3. RELIANCE ====================
  {
    id: 'reliance-mumbai-summit',
    title: 'Reliance Mumbai Corporate Summit & Milestone Film',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Reliance Industries',
    role: 'Video Editor & Visual Storyteller',
    year: '2024',
    duration: '19:02',
    timecode: 'TC 00:19:02:23',
    aspectRatio: '16:9 UHD',
    resolution: '4K UHD (3840x2160)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'FLAGSHIP RECAP',
    tagline: 'Grand corporate milestone coverage and high-energy recap edit for Reliance executive summits.',
    synopsis: 'Edited and color-graded high-resolution footage from major corporate sessions and executive milestones for Reliance in Mumbai. Focused on executive narrative cohesion, crowd energy, and seamless audio balance across stadium soundscapes.',
    deliverables: [
      'Executive Highlight Reel Master Cut',
      'Opening Ceremony Visual Presentation Loop',
      'Internal Broadcast Delivery Package'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/109weRIX2rSCKExP4ZJk738SXtpbXD019/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-amber-950/40 via-black to-stone-950/30',
    accentColor: '#fbbf24',
    stats: {
      timelineTracks: '24 Multi-Cam Angles',
      deliveryFormat: 'ProRes 4444 Master (2.02 GB)'
    }
  },
  {
    id: 'reliance-nhq-film',
    title: 'Reliance NHQ National Headquarters Film',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Reliance Industries',
    role: 'Post-Production Lead & Colorist',
    year: '2024',
    duration: '17:49',
    timecode: 'TC 00:17:49:11',
    aspectRatio: '16:9 UHD',
    resolution: '4K UHD',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects', 'DaVinci Resolve'],
    badge: 'HEADQUARTERS FILM',
    tagline: 'Comprehensive architectural and corporate identity film documenting headquarters operations.',
    synopsis: 'A polished, expansive documentary-style production showcasing the Reliance National Headquarters. Included sweeping drone movements, architectural interior pacing, executive department profiles, and broadcast-grade color grading.',
    deliverables: [
      'Complete NHQ Corporate Showcase Master',
      'Departmental Snippet Series',
      'Internal Executive Briefing Cut'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/143Wro6CMyHfAqb7EoubmJP98nqNl0HDz/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-emerald-950/40 via-black to-slate-950/30',
    accentColor: '#10b981',
    stats: {
      timelineTracks: '28 Video / 16 Audio',
      deliveryFormat: 'ProRes 422 HQ (2.22 GB)'
    }
  },

  // ==================== 4. VISHWA VINAYAK GROUP ====================
  {
    id: 'vvg-elnor-project-film',
    title: 'Vishwa Vinayak Group — ELNOR Project Film',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Vishwa Vinayak Group',
    role: 'Video Production Executive & Lead Editor',
    year: '2023 - 2024',
    duration: '00:15',
    timecode: 'TC 00:00:15:10',
    aspectRatio: '16:9 UHD',
    resolution: '4K UHD',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'CORE PRODUCTION',
    tagline: 'Flagship project film combining architectural visualization with lifestyle and corporate identity.',
    synopsis: 'As Video Production Executive at Vishwa Vinayak Group, directed post-production workflows and corporate films. The ELNOR project film demonstrates high-end real estate and corporate visual standards with immersive pacing and crisp sound design.',
    deliverables: [
      'Master 4K Project Presentation',
      'Architectural Vignettes',
      'Investor & Client Presentation Cut'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1E6B1Kg87330YYHgUhHs-ZrJGJ3s9c18_/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-emerald-950/40 via-black to-zinc-950/30',
    accentColor: '#34d399',
    stats: {
      timelineTracks: '30+ Production Assets',
      deliveryFormat: 'ProRes Master (143.4 MB)'
    }
  },
  {
    id: 'vvg-motion-graphics-identity',
    title: 'VVG Motion Graphics & Campaign Identity',
    category: 'smm',
    categoryLabel: 'Social Media Management',
    client: 'Vishwa Vinayak Group',
    role: 'Motion Graphics Designer & Editor',
    year: '2024',
    duration: '00:06',
    timecode: 'TC 00:00:06:12',
    aspectRatio: '16:9 / Social',
    resolution: '1080p Full HD',
    tools: ['Adobe After Effects', 'Adobe Premiere Pro', 'Illustrator'],
    badge: 'MOTION DESIGN',
    tagline: 'Kinetic brand animation and dynamic lower thirds designed for cross-channel branding.',
    synopsis: 'Created kinetic brand animations, 2D logo resolves, vector title overlays, and lower thirds for Vishwa Vinayak Group digital channels. Designed for instant visual recognition across web and social distribution.',
    deliverables: [
      'Brand Identity Motion Graphics Pack',
      'Lower Thirds & Animated Title Cards',
      'Social Media Broadcast Stems'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1l3XIFh6YM0Sa_oGWGdBh1D4ZPRYL3rUz/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-teal-950/40 via-black to-slate-950/30',
    accentColor: '#2dd4bf',
    stats: {
      timelineTracks: '12 After Effects Comp Layers',
      deliveryFormat: 'H.264 Alpha / Web MP4'
    }
  },

  // ==================== 5. ZAGGLE ====================
  {
    id: 'zaggle-corporate-showcase',
    title: 'Zaggle FinTech Corporate Identity & Platform Film',
    category: 'corporate',
    categoryLabel: 'Corporate / Client Work',
    client: 'Zaggle',
    role: 'Video Editor & Motion Designer',
    year: '2024',
    duration: '01:26',
    timecode: 'TC 00:01:26:01',
    aspectRatio: '16:9 UHD',
    resolution: '4K UHD',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'FINTECH B2B',
    tagline: 'Modern enterprise fintech showcase blending UI animations with dynamic corporate pacing.',
    synopsis: 'Directed post-production for Zaggle, an enterprise spend management and fintech pioneer. Translated software mechanics and expense automation into an engaging visual narrative featuring sleek device mockups, motion typography, and upbeat corporate rhythm.',
    deliverables: [
      'Master FinTech Brand Showcase (16:9)',
      'Product UI Motion Graphic Overlays',
      'Investor & B2B Client Package'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/16NGY7foPNJ4JZ6v5UzQ47d2vZQ2PAgTv/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-violet-950/40 via-black to-zinc-950/30',
    accentColor: '#8b5cf6',
    stats: {
      timelineTracks: '20 Video Tracks / UI Overlays',
      deliveryFormat: 'ProRes 422 HQ (658.9 MB)'
    }
  },

  // ==================== 6. YUKIO ====================
  {
    id: 'yukio-resident-interviews',
    title: 'Yukio Co-Living — Resident Testimonials & Social Hooks',
    category: 'smm',
    categoryLabel: 'Social Media Management',
    client: 'Yukio',
    role: 'Social Media Editor & Pacing Specialist',
    year: '2024',
    duration: '00:44',
    timecode: 'TC 00:00:44:09',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920 (Vertical HD)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'AUDIENCE HOOK',
    tagline: 'Authentic street-style micro interviews crafted with fast cuts, bold captions, and acoustic pops.',
    synopsis: 'Engineered high-engagement vertical short-form interviews asking residents why they chose Yukio. Integrated kinetic subtitles, sound effects on punchy quotes, and quick-cut B-roll to create irresistible social retention on Instagram Reels and TikTok.',
    deliverables: [
      '9:16 Vertical Resident Interview Cut',
      'Engaging Subtitle Styling with Word Tracking',
      'B-roll Integration of Co-living Spaces'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1OTh1b2vd2lTJ3wsUO2V-sHm4OtwFb5j3/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-fuchsia-950/40 via-black to-slate-950/30',
    accentColor: '#d946ef',
    stats: {
      timelineTracks: '12 Layers Kinetic Text',
      deliveryFormat: '1080x1920 Vertical MP4'
    }
  },
  {
    id: 'yukio-lifestyle-showcase',
    title: 'Yukio Modern Spaces & Community Lifestyle',
    category: 'smm',
    categoryLabel: 'Social Media Management',
    client: 'Yukio',
    role: 'Video Editor & Colorist',
    year: '2024',
    duration: '01:08',
    timecode: 'TC 00:01:08:23',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'BRAND REEL',
    tagline: 'Aesthetic walkthrough of modern amenities, community vibe, and urban living standards.',
    synopsis: 'Crafted an atmospheric aesthetic reel highlighting the interior architecture, curated community lounges, and lifestyle amenities at Yukio. Balanced soft ambient lighting with modern beat-matched cuts.',
    deliverables: [
      'Vertical Walkthrough Reel (9:16)',
      'Curated Color Grade with Natural Skin Tones',
      'Ambient Chill-Hop Soundscape Sync'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1m8S_CiJZg1_T5kEyF9iV4kF618qiL5z_/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-amber-950/40 via-black to-zinc-950/30',
    accentColor: '#f59e0b',
    stats: {
      timelineTracks: '10 Video / 8 SFX',
      deliveryFormat: 'High-Bitrate Mobile Master'
    }
  },

  // ==================== 7. INFLUENCERS ====================
  {
    id: 'influencer-brand-campaign',
    title: 'Top Influencer Brand Collaboration & Commercial Final',
    category: 'smm',
    categoryLabel: 'Social Media Management',
    client: 'Influencer Creators & Brand Sponsors',
    role: 'Lead Editor & Content Strategist',
    year: '2024',
    duration: '00:37',
    timecode: 'TC 00:00:37:19',
    aspectRatio: '9:16 & 1:1 Social',
    resolution: '1080x1920 (60fps)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'VIRAL CAMPAIGN',
    tagline: 'High-production collaborative influencer campaign cut designed to maximize cross-platform reach.',
    synopsis: 'Post-production and pacing direction for leading digital creators collaborating with partner brands. Engineered frame-level transitions, audio risers, and punchy visual gags to drive audience retention and brand conversion.',
    deliverables: [
      'Multi-Platform Influencer Master Cut',
      'Optimized 9:16 Story & Reel Formats',
      'Dynamic Audio Mix & Sound Polish'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1qPlz2KOL_la0CT_1sXiAlNmAg2nsHc8w/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-sky-950/40 via-black to-blue-950/30',
    accentColor: '#38bdf8',
    stats: {
      timelineTracks: '18 Video / 14 SFX',
      deliveryFormat: '1080x1920 60FPS (111.5 MB)'
    }
  },

  // ==================== 8. SHORT-FORM RETENTION & REELS ====================
  {
    id: 'overthinking-mindset-reel',
    title: 'Overthinking — Tumhari Sabse Badi Problem',
    category: 'reels',
    categoryLabel: 'Short-Form / Reels',
    client: 'Creator Content / Personal Brand',
    role: 'Editor & Retention Strategist',
    year: '2024',
    duration: '01:49',
    timecode: 'TC 00:01:49:05',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920 (60fps)',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'RETENTION HOOK',
    tagline: 'High-impact psychological breakdown with micro-pacing, sound effects, and kinetic subtitles.',
    synopsis: 'A masterclass in short-form viewer psychology. Every 1.5 seconds features visual re-engagement through punch-ins, kinetic typography, b-roll metaphors, and crisp whooshes that eliminate viewer drop-off completely.',
    deliverables: [
      '9:16 Vertical Master Reel',
      'Custom Animated Subtitle Sequence',
      'SFX Transients & Acoustic Impact Layer'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1mCtq5gkgXi8y3efdNzbj_vcDw_NSFN47/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-purple-950/40 via-black to-indigo-950/30',
    accentColor: '#a855f7',
    stats: {
      timelineTracks: '14 Layers Kinetic Text',
      deliveryFormat: '1080x1920 MP4'
    }
  },
  {
    id: 'tera-kal-karunga-reel',
    title: 'Tera ‘Kal Karunga’ Teri Zindagi Barbad Kar Raha Hai!',
    category: 'reels',
    categoryLabel: 'Short-Form / Reels',
    client: 'Creator Content / Mindset',
    role: 'Editor & Sound Designer',
    year: '2024',
    duration: '00:41',
    timecode: 'TC 00:00:41:14',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'VIRAL PACING',
    tagline: 'Aggressive pacing and direct-to-camera hook psychology confronting procrastination.',
    synopsis: 'Created an urgent, viral short-form edit tackling procrastination. Leveraged abrupt cutaways, bass drops, sound design accents, and rapid-fire visual metaphors to shock viewers out of passive scrolling.',
    deliverables: [
      'Vertical Reel (9:16)',
      'Fast-Paced Motion Text Hierarchy',
      'Impact Sound Effects Suite'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/12Sy7BQDanD37_pElVBA0D7BGeqmny1yG/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-red-950/40 via-black to-stone-950/30',
    accentColor: '#ef4444',
    stats: {
      timelineTracks: '16 Video / 12 SFX',
      deliveryFormat: '1080x1920 MP4'
    }
  },
  {
    id: 'workout-motivation-reel',
    title: 'Finding Your Perfect Partner — Workout Motivation',
    category: 'reels',
    categoryLabel: 'Short-Form / Reels',
    client: 'Lifestyle & Fitness Content',
    role: 'Video Editor & Sound Designer',
    year: '2024',
    duration: '00:40',
    timecode: 'TC 00:00:40:22',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'DYNAMIC EDIT',
    tagline: 'Hard-hitting gym edit featuring speed ramps, bass impacts, and high-contrast color tones.',
    synopsis: 'Synchronized intense training lifts with heavy audio transients, stylized motion blur whip transitions, and a dark aesthetic color palette to create an electrifying fitness and lifestyle reel.',
    deliverables: [
      'Vertical Gym & Lifestyle Master (9:16)',
      'Speed-Ramped Exercise Cuts',
      'Heavy Bass & Transient Sound Bed'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1c76fuOMi7tJCFJv2IhcXN30dr_o0zpvJ/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-orange-950/40 via-black to-slate-950/30',
    accentColor: '#fb923c',
    stats: {
      timelineTracks: '18 Audio FX Tracks',
      deliveryFormat: 'H.264 High Profile'
    }
  },
  {
    id: 'cant-give-up-mindset-reel',
    title: 'You Can’t Give Up — Mindset Shift & Brutal Truth',
    category: 'reels',
    categoryLabel: 'Short-Form / Reels',
    client: 'Personal Creative Series',
    role: 'Editor & Narrative Architect',
    year: '2024',
    duration: '00:32',
    timecode: 'TC 00:00:32:09',
    aspectRatio: '9:16 Vertical',
    resolution: '1080x1920',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'DARK MOTIVATION',
    tagline: 'Moody visual atmosphere, heavy sub-bass drone, and unapologetic psychological pacing.',
    synopsis: 'Constructed an emotional, motivational vertical short utilizing high-contrast grading, deep acoustic resonance, and minimalist text pacing to deliver an uncompromising message on perseverance.',
    deliverables: [
      'Vertical Cinematic Short (9:16)',
      'Atmospheric Sub-Bass Foley Layer',
      'Minimalist Typographic Callouts'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1ZrJkZOWmjCfciNGBhfZeO9iYPrcctyAW/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-neutral-950/40 via-black to-zinc-950/30',
    accentColor: '#94a3b8',
    stats: {
      timelineTracks: '10 Video / 14 SFX',
      deliveryFormat: '1080x1920 MP4'
    }
  },

  // ==================== 9. CINEMATIC / PERSONAL ====================
  {
    id: 'deep-thinker-essay',
    title: 'The Deep Thinker Dilemma — Visual Narrative',
    category: 'cinematic',
    categoryLabel: 'Cinematic / Personal Work',
    client: 'Personal Creative Project',
    role: 'Director, Filmmaker & Editor',
    year: '2024',
    duration: '01:09',
    timecode: 'TC 00:01:09:16',
    aspectRatio: '9:16 Vertical & Cinematic',
    resolution: '1080x1920',
    tools: ['Adobe Premiere Pro', 'Adobe After Effects'],
    badge: 'DIRECTOR ESSAY',
    tagline: 'An introspective exploration into why intelligent and deep-thinking minds feel lost.',
    synopsis: 'A poetic cinematic reflection examining existential tension and intellectual solitude. Features nuanced color harmony, organic ambient field recordings, and thoughtful editorial pauses that give viewers room to breathe and reflect.',
    deliverables: [
      'Cinematic Essay Cut (9:16)',
      'Original Atmospheric Audio Mix',
      'Film Grain & Custom Color Grade Stills'
    ],
    videoEmbedUrl: 'https://drive.google.com/file/d/1Mk95JqOEEjU_UGXvo_7w376W06CPSUmb/view?usp=sharing',
    previewPoster: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    colorTheme: 'from-indigo-950/40 via-black to-blue-950/30',
    accentColor: '#818cf8',
    stats: {
      timelineTracks: 'Film Emulation & Grain Layer',
      deliveryFormat: 'ProRes Master'
    }
  }
];
