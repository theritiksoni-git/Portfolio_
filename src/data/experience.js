// Career & Production Experience Dataset for Ritik Soni
// Modeled as a Professional NLE Editing Timeline (Tracks V2, V1, A1)

export const TIMELINE_TRACKS = [
  { id: 'V2', name: 'V2: BRAND ENGAGEMENTS', label: 'V2', color: '#38bdf8', type: 'video' },
  { id: 'V1', name: 'V1: EXECUTIVE LEADERSHIP', label: 'V1', color: '#818cf8', type: 'video' },
  { id: 'A1', name: 'A1: INDEPENDENT & CREATIVE', label: 'A1', color: '#34d399', type: 'audio' }
];

export const TIMELINE_SPAN = {
  startYear: 2022.0,
  endYear: 2025.5,
  ticks: [
    { year: 2022, label: '2022.01', position: 2 },
    { year: 2023, label: '2023.01', position: 28.6 },
    { year: 2024, label: '2024.01', position: 57.1 },
    { year: 2025, label: '2025 / PRESENT', position: 85.7, isPresent: true }
  ]
};

export const EXPERIENCES = [
  {
    id: 'vishwa-vinayak',
    role: 'Video Production Executive & SMM Lead',
    company: 'Vishwa Vinayak Group',
    shortLabel: 'Vishwa Vinayak',
    period: 'Current Position',
    timelinePosition: '2023 — Present',
    track: 'V1',
    badge: 'FULL-TIME EXECUTIVE',
    accentColor: '#38bdf8',
    videoUrl: '/videos/experience/vishwa-vinayak.mp4',
    previewImage: '/img/experience/vishwa-vinayak.webp',
    previewImageCam2: '/img/experience/vishwa-vinayak-cam2.webp',
    cam1Label: 'CAM 01: ARRI STUDIO',
    cam2Label: 'CAM 02: ATEM MULTIVIEW',
    lutName: 'KODAK 2383 PRINT',
    editPace: 'BROADCAST CUT // 24 FPS',
    logoImage: '/img/client-logos/vishwa-vinayak-group.png',
    visualTags: ['EXECUTIVE DOCS', 'VERTICAL REELS', 'ORGANIC GROWTH'],
    timecode: '00:23:08:14',
    yearStart: 2023.0,
    yearEnd: 2025.5,
    durationLabel: '18+ MOS // ONGOING',
    trackStartPercent: 28.6,
    trackWidthPercent: 69.5,
    impactMetrics: [
      { label: 'ORGANIC REACH', value: '10M+' },
      { label: 'CHANNEL GROWTH', value: '+240%' },
      { label: 'PRODUCTIONS', value: '50+ CUTS' }
    ],
    coreMission: 'Directing full-cycle video production pipelines, corporate documentary films, and multi-channel social media growth.',
    highlights: [
      'Spearhead high-retention corporate films & viral vertical reel pipelines.',
      'Manage brand channels (Instagram, LinkedIn, YouTube) with monthly editorial rhythms.',
      'Analyze hook watch-time & retention drop-offs to continually optimize pacing.'
    ],
    summary: 'Directing and executing comprehensive video production, corporate content creation, social media growth operations, and end-to-end post-production workflows.',
    responsibilities: [
      'Managing brand social media channels (Instagram, LinkedIn, YouTube) and establishing monthly editorial content calendars.',
      'Spearheading video production pipelines from initial creative ideation to master multi-platform delivery.',
      'Editing high-impact corporate films, brand showcases, and viral vertical reels optimized for audience retention.',
      'Monitoring social media analytics, hook performance, and audience retention metrics to continuously refine content strategy.',
      'Collaborating cross-functionally across marketing and leadership to align visual deliverables with brand growth goals.'
    ],
    toolsUsed: ['Adobe Premiere Pro', 'Adobe After Effects', 'Meta Business Suite', 'YouTube Studio'],
    keyMilestones: 'Corporate video series, executive interviews, multi-platform social media growth'
  },
  {
    id: 'brand-arentech',
    role: 'Video Editor & Content Specialist',
    company: 'Arentech Projects',
    shortLabel: 'Arentech',
    period: 'Collaborative Engagement',
    timelinePosition: '2023',
    track: 'V2',
    badge: 'TECH SHOWCASE',
    accentColor: '#818cf8',
    videoUrl: '/videos/experience/arentech.mp4',
    previewImage: '/img/experience/arentech.webp',
    previewImageCam2: '/img/experience/arentech-cam2.webp',
    cam1Label: 'CAM 01: ATRIUM 3D',
    cam2Label: 'CAM 02: 4K MACRO',
    lutName: 'CYBER DCI P3',
    editPace: 'DYNAMIC RAMP // 60 FPS',
    logoImage: '/img/client-logos/adentech.png',
    visualTags: ['INFRASTRUCTURE', 'KINETIC 3D', 'TECH SHOWCASE'],
    timecode: '00:23:02:00',
    yearStart: 2023.0,
    yearEnd: 2023.6,
    durationLabel: '6 MOS',
    trackStartPercent: 28.6,
    trackWidthPercent: 18.5,
    impactMetrics: [
      { label: 'CORPORATE ASSETS', value: '25+ CUTS' },
      { label: 'MASTER FORMAT', value: '4K DCI' },
      { label: 'MOTION ASSETS', value: '3D GRAPHICS' }
    ],
    coreMission: 'Crafted dynamic promotional video content and corporate tech showcases highlighting infrastructure innovation.',
    highlights: [
      'Edited promotional video assets tailored for stakeholder presentations.',
      'Designed kinetic title cards, lower-thirds, and tech overlays in After Effects.',
      'Structured crisp audio pacing with custom sound effects to amplify transitions.'
    ],
    summary: 'Crafted dynamic promotional video content and corporate tech showcases highlighting innovation and infrastructure.',
    responsibilities: [
      'Edited promotional video assets tailored for corporate distribution and stakeholder presentations.',
      'Designed kinetic title cards, lower-thirds, and tech overlays using Adobe After Effects.',
      'Structured crisp audio pacing with custom sound effects to amplify visual transitions.'
    ],
    toolsUsed: ['Adobe Premiere Pro', 'Adobe After Effects'],
    keyMilestones: 'Promotional video cuts, tech showcase series'
  },
  {
    id: 'brand-redbull',
    role: 'Video Editor (High-Energy Action)',
    company: 'Red Bull Event / Action Content',
    shortLabel: 'Red Bull',
    period: 'Creative Engagement',
    timelinePosition: '2023 — 2024',
    track: 'V2',
    badge: 'ACTION REEL',
    accentColor: '#f87171',
    videoUrl: '/videos/experience/redbull.mp4',
    previewImage: '/img/experience/redbull.webp',
    previewImageCam2: '/img/experience/redbull-cam2.webp',
    cam1Label: 'CAM 01: RALLY WIDE',
    cam2Label: 'CAM 02: DRIFT DETAIL',
    lutName: 'FUJI F-125 SPEED',
    editPace: 'BEAT-LOCKED // 120 BPM',
    logoImage: '/img/client-logos/redbull.png',
    visualTags: ['SPEED-RAMPING', 'BEAT-LOCKED', 'ACTION CUTS'],
    timecode: '00:23:07:22',
    yearStart: 2023.6,
    yearEnd: 2024.0,
    durationLabel: '6 MOS',
    trackStartPercent: 48.5,
    trackWidthPercent: 14.5,
    impactMetrics: [
      { label: 'AUDIO PACING', value: '120 BPM' },
      { label: 'FRAME SYNC', value: 'BEAT-LOCK' },
      { label: 'MASTER FORMAT', value: '9:16 & 16:9' }
    ],
    coreMission: 'Engineered high-octane video edits focused on fast-paced action, speed-ramping, and rhythmic sound design synchronization.',
    highlights: [
      'Executed frame-accurate beat matching to lock high-speed action clips to music.',
      'Crafted custom sound design FX layers (impacts, whooshes, risers) to heighten intensity.',
      'Delivered optimized vertical (9:16) and widescreen (16:9) cuts for social.'
    ],
    summary: 'Engineered high-octane video edits focused on fast-paced action, speed-ramping, and rhythmic sound design synchronization.',
    responsibilities: [
      'Executed frame-accurate beat matching to lock high-speed action clips to dynamic music tracks.',
      'Crafted custom sound design FX layers (impacts, whooshes, risers) to heighten visual intensity.',
      'Delivered optimized vertical (9:16) and widescreen (16:9) cuts for digital and social media.'
    ],
    toolsUsed: ['Adobe Premiere Pro', 'Adobe After Effects'],
    keyMilestones: 'High-adrenaline social cuts, promotional reels'
  },
  {
    id: 'brand-reliance',
    role: 'Video Editor & Post Specialist',
    company: 'Reliance Related Projects',
    shortLabel: 'Reliance',
    period: 'Event / Milestone Projects',
    timelinePosition: '2024',
    track: 'V2',
    badge: 'MULTI-CAM EVENT',
    accentColor: '#fbbf24',
    videoUrl: '/videos/experience/reliance.mp4',
    previewImage: '/img/experience/reliance.webp',
    previewImageCam2: '/img/experience/reliance-cam2.webp',
    cam1Label: 'CAM 01: JIB STAGE',
    cam2Label: 'CAM 02: ARENA CROWD',
    lutName: 'WARM GOLD LIVE',
    editPace: 'MULTI-CAM RUSH // 50P',
    logoImage: '/img/client-logos/reliance-industries-limited.png',
    visualTags: ['MULTI-CAM STAGE', 'KEYNOTE CUTS', 'SAME-DAY RUSH'],
    timecode: '00:24:02:18',
    yearStart: 2024.0,
    yearEnd: 2024.8,
    durationLabel: '8 MOS',
    trackStartPercent: 64.5,
    trackWidthPercent: 21.0,
    impactMetrics: [
      { label: 'MULTI-CAM FEEDS', value: '24+ ANGLES' },
      { label: 'TURNAROUND', value: 'SAME-DAY' },
      { label: 'MASTER FORMAT', value: '4K DCI' }
    ],
    coreMission: 'Delivered fast-turnaround recap films and event highlight cuts for major corporate milestones.',
    highlights: [
      'Synchronized multi-camera live footage from corporate conferences and keynotes.',
      'Executed broadcast color grading and audio mastering across live environments.',
      'Produced energetic highlight reels for internal broadcast and stakeholder sharing.'
    ],
    summary: 'Delivered fast-turnaround video edits, recap films, and promotional content for major internal corporate milestones and events.',
    responsibilities: [
      'Synchronized and edited multi-camera live footage from corporate conferences and leadership sessions.',
      'Executed color correction and audio mastering across diverse recording environments.',
      'Produced energetic highlight reels for internal broadcast and organizational sharing.'
    ],
    toolsUsed: ['Adobe Premiere Pro', 'Adobe After Effects'],
    keyMilestones: 'Multi-cam conference cutdowns, executive highlights'
  },
  {
    id: 'freelance-filmmaking',
    role: 'Filmmaker & Creative Director',
    company: 'Freelance & Creative Productions',
    shortLabel: 'Freelance',
    period: 'Ongoing',
    timelinePosition: '2022 — Present',
    track: 'A1',
    badge: 'INDEPENDENT',
    accentColor: '#34d399',
    videoUrl: '/videos/experience/freelance.mp4',
    previewImage: '/img/experience/freelance.webp',
    previewImageCam2: '/img/experience/freelance-cam2.webp',
    cam1Label: 'CAM 01: PARIS 35MM',
    cam2Label: 'CAM 02: GRADE SUITE',
    lutName: 'ARRI 709 DYNAMIC',
    editPace: 'DIRECTOR CUT // 2.39:1',
    logoImage: null,
    visualTags: ['ANAMORPHIC FILM', 'COLOR GRADING', 'DIRECTOR CUT'],
    timecode: '00:22:01:00',
    yearStart: 2022.0,
    yearEnd: 2025.5,
    durationLabel: '36+ MOS // ONGOING',
    trackStartPercent: 2.0,
    trackWidthPercent: 96.0,
    impactMetrics: [
      { label: 'RETENTION HOOK', value: '3-SEC' },
      { label: 'PRODUCED EDITS', value: '50+ CUTS' },
      { label: 'CREATOR NETWORK', value: '20+ BRANDS' }
    ],
    coreMission: 'Partnering with creators, brands, and agencies to direct cinematic narratives, commercial cuts, and social media campaigns.',
    highlights: [
      'Design scroll-stopping 3-second visual hooks, kinetic captions, and sound design pacing.',
      'Develop full-funnel content strategies, SEO architectures, and posting calendars.',
      'Direct cinematic storytelling, mini-documentaries, and high-converting commercial reels.'
    ],
    summary: 'Partnering with creators, brands, and agencies to produce high-retention short-form reels, manage organic social media channels, and direct cinematic narratives.',
    responsibilities: [
      'Designing 3-second visual hooks, kinetic captions, and sound design pacing for maximum scroll-stopping power.',
      'Developing full-funnel content strategies, hashtag and SEO architectures, and posting schedules across Instagram and YouTube.',
      'Directing cinematic storytelling, documentary essays, and high-converting commercial cuts.'
    ],
    toolsUsed: ['Adobe Premiere Pro', 'Adobe After Effects', 'Meta Business Suite', 'Content Ops'],
    keyMilestones: '50+ produced social edits, organic audience scaling campaigns'
  }
];
