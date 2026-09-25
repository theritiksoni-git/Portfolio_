/**
 * Google Drive Cloud Synchronization & Staging Engine
 * Automatically scans and syncs video and media files from Google Drive folders,
 * staging them in the Admin Control Room for private review before publication.
 */

// Helper to clean file names into cinematic project titles
export function cleanDriveFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'Untitled Project';

  let cleaned = fileName
    // Strip common video & image file extensions
    .replace(/\.(mp4|mov|m4v|webm|mkv|avi|png|jpg|jpeg|webp)$/i, '')
    // Strip timestamps or version tags like _v1, _v2, _final, _4k, _1080p, _UHD, _master, _cut
    .replace(/[_-]?(?:v\d+|final|master|cut|4k|1080p|uhd|prores|h264|h265|dci|export|render|edit)/gi, '')
    // Strip leading track or sequence numbers like "01 ", "01_", "1- "
    .replace(/^[\d\s._-]+/, '')
    // Replace underscores, hyphens, and dots with spaces
    .replace(/[_\-.]+/g, ' ')
    // Normalize extra whitespace
    .replace(/\s+/g, ' ')
    .trim();

  // Capitalize words cleanly
  cleaned = cleaned.replace(/\b\w/g, (char) => char.toUpperCase());

  return cleaned || 'Untitled Project';
}

// Extract Google Drive Folder ID from various URL formats
export function extractFolderId(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();

  // Match /folders/FOLDER_ID format
  const folderMatch = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch) return folderMatch[1];

  // Match id=FOLDER_ID format
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  // If already a clean 20+ char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

// Extract Google Drive File ID from various URL formats
export function extractFileId(input) {
  if (!input || typeof input !== 'string') return '';
  const trimmed = input.trim();

  // Match /file/d/FILE_ID
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return fileMatch[1];

  // Match id=FILE_ID
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) return idMatch[1];

  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  return '';
}

// Human-readable byte formatting
export function formatBytes(bytes) {
  if (!bytes || isNaN(bytes)) return 'Video Stream';
  const b = parseInt(bytes, 10);
  if (b === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Known client detection heuristic based on title, filename, or description
export function detectClientFromText(text) {
  const lower = (text || '').toLowerCase();
  
  if (lower.includes('adentech')) return 'Adentech';
  if (lower.includes('reliance')) return 'Reliance Industries';
  if (lower.includes('red bull') || lower.includes('redbull')) return 'Red Bull Media';
  if (lower.includes('vishwa') || lower.includes('vinayak')) return 'Vishwa Vinayak Group';
  if (lower.includes('zaggle')) return 'Zaggle';
  if (lower.includes('yukio')) return 'Yukio';
  if (lower.includes('nike')) return 'Nike';
  if (lower.includes('apple')) return 'Apple';
  if (lower.includes('puma')) return 'Puma';
  if (lower.includes('netflix')) return 'Netflix';
  if (lower.includes('sony')) return 'Sony Music';
  if (lower.includes('tata')) return 'Tata Group';
  if (lower.includes('zomato')) return 'Zomato';
  if (lower.includes('swiggy')) return 'Swiggy';
  if (lower.includes('spotify')) return 'Spotify';

  // Try extracting client from standard naming conventions: "ClientName_ProjectName" or "ClientName - Project"
  if (text && typeof text === 'string') {
    const parts = text.split(/[_\-–]/);
    if (parts.length > 1) {
      const candidate = parts[0].trim().replace(/\.(mp4|mov|mkv)$/i, '');
      const candidateLower = candidate.toLowerCase();
      const forbidden = ['drive', 'video', 'vid', 'project', 'my', 'untitled', 'img', 'final', 'cut', 'reel', 'screen', 'export'];
      if (candidate.length >= 3 && !forbidden.includes(candidateLower) && !/^\d+$/.test(candidate)) {
        return candidate.replace(/\b\w/g, (c) => c.toUpperCase());
      }
    }
  }

  return 'Client Commission';
}

// Known category detection heuristic
export function detectCategoryFromText(text) {
  const lower = (text || '').toLowerCase();
  if (
    lower.includes('reel') || 
    lower.includes('short') || 
    lower.includes('916') || 
    lower.includes('tiktok') || 
    lower.includes('ig') || 
    lower.includes('vertical') || 
    lower.includes('retention') || 
    lower.includes('hook')
  ) {
    return 'reels';
  }
  if (
    lower.includes('smm') || 
    lower.includes('social') || 
    lower.includes('creator') || 
    lower.includes('ad') || 
    lower.includes('promo') || 
    lower.includes('campaign') || 
    lower.includes('marketing')
  ) {
    return 'smm';
  }
  if (
    lower.includes('cinematic') || 
    lower.includes('film') || 
    lower.includes('narrative') || 
    lower.includes('trailer') || 
    lower.includes('documentary') || 
    lower.includes('realty') || 
    lower.includes('luxury') || 
    lower.includes('architectural') || 
    lower.includes('anthem')
  ) {
    return 'cinematic';
  }
  return 'corporate';
}

/**
 * Intelligent Video Project Details Synthesizer.
 * Ingests raw Google Drive file metadata and synthesizes a 100% complete,
 * production-ready portfolio project specification so the user only has to review and publish!
 */
export function synthesizeVideoProjectDetails(raw = {}) {
  const driveId = raw.driveId || (raw.id ? String(raw.id).replace(/^drive-/, '') : '') || extractFileId(raw.videoEmbedUrl || raw.driveViewUrl || '');
  const rawFileName = raw.fileName || raw.name || (driveId ? `Drive_Video_${driveId.substring(0, 6)}.mp4` : 'Video_Asset.mp4');

  // 1. Detect Client
  const detectedClient = detectClientFromText(rawFileName + ' ' + (raw.description || '') + ' ' + (raw.title || ''));
  const client = (raw.client && raw.client !== 'Direct Drive Inbound' && raw.client !== 'Client Commission') 
    ? raw.client 
    : (detectedClient !== 'Client Commission' ? detectedClient : (raw.client || 'Client Commission'));

  // 2. Video Dimensions & Aspect Ratio Detection
  const vMeta = raw.videoMediaMetadata || {};
  const rawWidth = Number(vMeta.width) || Number(raw.width) || 0;
  const rawHeight = Number(vMeta.height) || Number(raw.height) || 0;

  const isVerticalHeuristic = 
    (rawHeight > 0 && rawWidth > 0 && rawHeight > rawWidth) ||
    /916|vertical|reel|tiktok|short/i.test(rawFileName) ||
    (raw.aspectRatio && raw.aspectRatio.includes('9:16'));

  const isCinemaScopeHeuristic = 
    rawWidth > 0 && rawHeight > 0 && (rawWidth / rawHeight >= 2.2);

  let aspectRatio = raw.aspectRatio;
  let resolution = raw.resolution;

  if (isVerticalHeuristic) {
    aspectRatio = '9:16 Vertical Reel';
    resolution = rawHeight >= 1920 ? 'Full HD 1080x1920 (Vertical)' : (rawWidth ? `${rawWidth}x${rawHeight} (Vertical)` : '1080x1920 (Vertical)');
  } else if (isCinemaScopeHeuristic) {
    aspectRatio = '2.39:1 CinemaScope';
    resolution = rawWidth >= 3840 ? '4K Anamorphic (3840x1600)' : '2.39:1 Widescreen';
  } else {
    aspectRatio = aspectRatio || '16:9 UHD';
    resolution = resolution || (rawWidth >= 3840 ? '4K DCI (3840x2160)' : (rawWidth >= 1920 ? '1080p Full HD (1920x1080)' : '4K DCI (3840x2160)'));
  }

  // 3. Category Detection
  let category = raw.category;
  if (!category || category === 'corporate') {
    if (isVerticalHeuristic) {
      category = 'reels';
    } else {
      category = detectCategoryFromText(rawFileName + ' ' + (raw.description || '') + ' ' + (raw.title || ''));
    }
  }

  const categoryLabels = {
    corporate: 'Corporate / Client Production',
    smm: 'Social Media Strategy & SMM',
    reels: 'High-Retention Short-Form Reels',
    cinematic: 'Cinematic & Narrative',
  };
  const categoryLabel = categoryLabels[category] || 'Corporate / Client Work';

  // 4. Project Title
  let title = raw.title;
  const isGenericTitle = !title || 
    title.startsWith('Google Drive Project') || 
    title.startsWith('Drive Video') || 
    title.startsWith('Drive_Video') ||
    title === 'Untitled Project';

  if (isGenericTitle) {
    const cleaned = cleanDriveFileName(rawFileName);
    if (cleaned && cleaned !== 'Untitled Project' && !cleaned.toLowerCase().includes('drive video')) {
      title = cleaned;
    } else {
      const clientLabel = client !== 'Client Commission' ? client : 'Cinematic';
      const suffix = category === 'reels' 
        ? 'Viral Retention Reel' 
        : category === 'cinematic' 
        ? 'Visual Narrative Showcase' 
        : category === 'smm'
        ? 'Commercial Social Campaign'
        : 'Brand Vision Anthem';
      title = `${clientLabel} ${suffix}`;
    }
  }

  // 5. Duration & Timecode
  let duration = raw.duration;
  let timecode = raw.timecode;
  if (vMeta.durationMillis) {
    const totalSec = Math.round(Number(vMeta.durationMillis) / 1000);
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    duration = `${m}:${s}`;
    timecode = `TC 00:${m}:${s}:00`;
  } else if (!duration || duration === '01:30') {
    if (category === 'reels') {
      duration = '00:32';
      timecode = 'TC 00:00:32:15';
    } else if (category === 'smm') {
      duration = '00:45';
      timecode = 'TC 00:00:45:00';
    } else if (category === 'cinematic') {
      duration = '02:15';
      timecode = 'TC 00:02:15:00';
    } else {
      duration = '01:30';
      timecode = 'TC 00:01:30:00';
    }
  }

  // 6. Professional Role
  const role = raw.role || (
    category === 'reels' ? 'Viral Hook Specialist & Sound Designer' :
    category === 'smm' ? 'Social Media Video Strategist & Editor' :
    category === 'cinematic' ? 'Cinematographer & Lead Colorist' :
    'Video Production Executive & Post Lead'
  );

  // 7. Year
  const year = raw.year || (
    raw.createdTime ? String(new Date(raw.createdTime).getFullYear()) :
    (rawFileName.match(/\b(202[0-9])\b/)?.[1] || String(new Date().getFullYear()))
  );

  // 8. Feature Badge
  const badge = (raw.badge && raw.badge !== 'DRIVE IMPORT' && raw.badge !== 'NEW CUT') ? raw.badge : (
    category === 'reels' ? 'VIRAL HOOK' :
    category === 'cinematic' ? 'CINEMATIC CUT' :
    category === 'smm' ? 'GROWTH CAMPAIGN' :
    'FEATURED CLIENT'
  );

  // 9. Tagline (Catchy 1-liner)
  let tagline = raw.tagline;
  const isGenericTagline = !tagline || 
    tagline.includes('Direct Google Drive master') || 
    tagline.includes('Discovered from Google Drive') || 
    tagline.includes('Fresh video asset detected');

  if (isGenericTagline) {
    if (raw.description && raw.description.trim().length > 10) {
      tagline = raw.description.split('\n')[0].substring(0, 140);
    } else {
      const taglines = {
        corporate: `High-impact corporate brand film engineered for ${client}, highlighting next-generation infrastructure, executive authority, and enterprise trust.`,
        reels: `High-retention vertical short crafted for ${client} with hyper-engaging first-3-second hook, kinetic subtitles, and multi-layered impact sound design.`,
        cinematic: `Atmospheric visual narrative crafted for ${client} featuring fluid camera movement, nuanced color grading, and resonant storytelling.`,
        smm: `Targeted social video campaign for ${client} structured for peak audience retention, scroll-stopping visual rhythm, and high conversion.`,
      };
      tagline = taglines[category] || taglines.corporate;
    }
  }

  // 10. Synopsis / Case Study
  let synopsis = raw.synopsis;
  const isGenericSynopsis = !synopsis || 
    synopsis.includes('Private staged video asset') || 
    synopsis.includes('Original filename:') || 
    synopsis.includes('Automatic Google Drive sync item');

  if (isGenericSynopsis) {
    if (raw.description && raw.description.trim().length > 30) {
      synopsis = raw.description.trim();
    } else {
      const synopses = {
        corporate: `Directed post-production and editorial assembly of the master brand film for ${client}. Structured dynamic rhythm, sound design transitions, and graphic overlays to translate complex enterprise capabilities into an authoritative, unforgettable visual story.`,
        reels: `Engineered an ultra-fast-paced short-form edit for ${client} specifically optimized for modern mobile algorithms. Deployed audio-visual contrast, custom whoosh impacts, and kinetic editorial cuts to maximize watch time and viral shareability.`,
        cinematic: `Crafted a cinematic showcase for ${client} rooted in emotional pacing, intentional pauses, and bespoke color grading in DaVinci Resolve Studio. Emphasized rich contrast, atmospheric audio texture, and widescreen framing.`,
        smm: `Developed a dynamic commercial asset for ${client}'s multi-channel social campaign. Focused on clear visual hierarchy, kinetic brand reveals, and engaging editorial momentum that drives immediate viewer action and measurable engagement.`,
      };
      synopsis = synopses[category] || synopses.corporate;
    }
  }

  // 11. Deliverables
  const deliverables = (raw.deliverables && raw.deliverables.length > 1 && !raw.deliverables.includes('Google Drive Cloud Asset')) ? raw.deliverables : (
    category === 'reels' ? [
      '9:16 Vertical Master (Full HD 60fps)',
      'First-3-Sec Hook Variations (A/B Test)',
      'Dynamic Subtitles & SFX Stems'
    ] :
    category === 'smm' ? [
      'Multi-Platform Campaign Master (16:9 & 9:16)',
      'Paid Social Ad Deliverables (4:5 & 1:1)',
      'Dynamic Call-to-Action Variations'
    ] :
    category === 'cinematic' ? [
      '4K DCI CinemaScope Master Cut',
      'Director\'s Cut with Color Grade Stems',
      'High-Impact Teaser Trailer'
    ] : [
      'Master 4K Cinematic Cut (16:9 UHD)',
      'Executive Showcase & Keynote Cutdown',
      'LinkedIn & Corporate Social Edit'
    ]
  );

  // 12. Tools
  const tools = (raw.tools && raw.tools.length >= 2 && !raw.tools.includes('Google Drive Pipeline')) ? raw.tools : [
    'Adobe Premiere Pro',
    'DaVinci Resolve Studio',
    'Adobe After Effects',
    ...(category === 'reels' ? ['Adobe Audition'] : [])
  ];

  // 13. Editorial Stats
  const stats = raw.stats || {
    timelineTracks: isVerticalHeuristic ? '14 Video / 12 SFX' : '22 Video / 16 Audio',
    deliveryFormat: isVerticalHeuristic ? '1080x1920 H.264 60fps' : 'ProRes 422 HQ / 4K H.265'
  };

  // 14. Color Theme & Visual Accents
  const themeMap = {
    corporate: { accent: '#38bdf8', theme: 'from-cyan-950/40 via-black to-blue-950/30' },
    smm: { accent: '#10b981', theme: 'from-emerald-950/40 via-black to-teal-950/30' },
    reels: { accent: '#ec4899', theme: 'from-pink-950/40 via-black to-purple-950/30' },
    cinematic: { accent: '#f59e0b', theme: 'from-amber-950/40 via-black to-orange-950/30' },
  };
  const theme = themeMap[category] || themeMap.corporate;

  // 15. Video Embed & High-Resolution Thumbnail
  const videoEmbedUrl = raw.videoEmbedUrl || (driveId ? `https://drive.google.com/file/d/${driveId}/view?usp=sharing` : '');
  const previewPoster = raw.previewPoster || (
    raw.thumbnailLink ? raw.thumbnailLink.replace(/=s\d+/, '=s1200') :
    (driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200` : '/img/projects/adentech-lineup-master.jpg')
  );

  return {
    ...raw,
    id: raw.id || (driveId ? `drive-${driveId}` : `drive-${Date.now()}`),
    driveId,
    fileName: rawFileName,
    title,
    client,
    category,
    categoryLabel,
    role,
    year,
    duration,
    timecode,
    aspectRatio,
    resolution,
    tools,
    badge,
    tagline,
    synopsis,
    deliverables,
    stats,
    colorTheme: raw.colorTheme || theme.theme,
    accentColor: raw.accentColor || theme.accent,
    videoEmbedUrl,
    previewPoster,
    status: raw.status || 'Staged',
    driveViewUrl: raw.driveViewUrl || videoEmbedUrl,
    sizeFormatted: raw.sizeFormatted || formatBytes(raw.size),
    dateDiscovered: raw.dateDiscovered || new Date().toISOString(),
  };
}

/**
 * Fetch rich metadata for a single Google Drive file using Google Drive v3 REST API.
 */
export async function fetchDriveFileMetadata(fileId, apiKey) {
  if (!fileId || !apiKey) return null;
  try {
    const fields = encodeURIComponent('id,name,mimeType,size,createdTime,modifiedTime,description,thumbnailLink,webViewLink,videoMediaMetadata');
    const apiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?fields=${fields}&key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const fileData = await res.json();
    return fileData;
  } catch (err) {
    console.warn(`Could not fetch Google Drive metadata for ${fileId}:`, err);
    return null;
  }
}

/**
 * Sync from a Google Drive Folder.
 * Supports:
 * 1. Google Drive v3 REST API (if apiKey provided)
 * 2. Google Apps Script Webhook (if scriptUrl provided)
 * 3. Direct Google Drive Public Folder fallback
 */
export async function syncFromGoogleDrive({ folderUrl, folderId, apiKey, scriptUrl }) {
  const targetFolderId = folderId || extractFolderId(folderUrl);

  // Strategy 1: Google Drive v3 REST API
  if (targetFolderId && apiKey) {
    try {
      const q = encodeURIComponent(`'${targetFolderId}' in parents and trashed = false`);
      const fields = encodeURIComponent('files(id, name, mimeType, size, createdTime, modifiedTime, description, thumbnailLink, webViewLink, videoMediaMetadata)');
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&key=${apiKey}&pageSize=50`;

      const res = await fetch(apiUrl);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `Google Drive API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const files = data.files || [];

      // Filter for video files or relevant media
      const mediaFiles = files.filter((f) => 
        (f.mimeType && f.mimeType.startsWith('video/')) ||
        /\.(mp4|mov|m4v|webm|mkv)$/i.test(f.name) ||
        (f.mimeType && f.mimeType.startsWith('image/'))
      );

      // Synthesize each file into a complete, rich portfolio specification
      const stagedItems = mediaFiles.map((f) => {
        return synthesizeVideoProjectDetails({
          driveId: f.id,
          fileName: f.name,
          mimeType: f.mimeType,
          size: f.size,
          createdTime: f.createdTime,
          description: f.description,
          thumbnailLink: f.thumbnailLink,
          webViewLink: f.webViewLink,
          videoMediaMetadata: f.videoMediaMetadata,
        });
      });

      return {
        success: true,
        items: stagedItems,
        totalFound: mediaFiles.length,
        strategy: 'Google Drive API v3 (Direct)',
      };
    } catch (err) {
      console.warn('Google Drive v3 API sync notice:', err);
    }
  }

  // Strategy 2: Google Apps Script Webhook
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl);
      if (res.ok) {
        const data = await res.json();
        const files = Array.isArray(data) ? data : (data.files || []);
        const stagedItems = files.map((f) => {
          return synthesizeVideoProjectDetails({
            driveId: f.id,
            fileName: f.name || 'Drive Video',
            size: f.size,
            mimeType: f.mimeType,
            description: f.description,
          });
        });

        return {
          success: true,
          items: stagedItems,
          totalFound: stagedItems.length,
          strategy: 'Google Apps Script Webhook Bridge',
        };
      }
    } catch (err) {
      console.warn('Google Apps Script bridge notice:', err);
    }
  }

  // If no API key or script provided, return helpful guide
  return {
    success: false,
    needsConfig: true,
    folderId: targetFolderId,
    message: targetFolderId 
      ? 'Folder ID identified! For automatic scanning without manual Google Cloud setup, enter a free Google Cloud API key or use our 1-click Google Apps Script bridge.' 
      : 'Please enter a valid Google Drive Folder URL or Folder ID to initiate cloud synchronization.',
  };
}

/**
 * Converts a list of pasted Google Drive file links into staged project candidates.
 * Enriches with actual Drive metadata whenever an API key is available.
 */
export async function importFromDriveLinks(linksText, apiKey = '') {
  if (!linksText || typeof linksText !== 'string') return [];

  const lines = linksText.split(/[\n,;]+/);
  const items = [];

  for (const line of lines) {
    const fileId = extractFileId(line);
    if (fileId) {
      let rawData = {
        driveId: fileId,
        fileName: `Drive_Video_${fileId.substring(0, 6)}.mp4`,
      };

      // Attempt live Drive API metadata fetch if apiKey available
      if (apiKey) {
        const liveMeta = await fetchDriveFileMetadata(fileId, apiKey);
        if (liveMeta) {
          rawData = {
            ...rawData,
            fileName: liveMeta.name || rawData.fileName,
            size: liveMeta.size,
            mimeType: liveMeta.mimeType,
            createdTime: liveMeta.createdTime,
            description: liveMeta.description,
            thumbnailLink: liveMeta.thumbnailLink,
            webViewLink: liveMeta.webViewLink,
            videoMediaMetadata: liveMeta.videoMediaMetadata,
          };
        }
      }

      // Synthesize 100% complete project details
      items.push(synthesizeVideoProjectDetails(rawData));
    }
  }

  return items;
}

/**
 * Curated Demo Drive Staging Items using Ritik's verified Google Drive assets.
 * Pre-synthesized with rich professional details.
 */
export function getDemoDriveStagingItems() {
  return [
    synthesizeVideoProjectDetails({
      id: 'drive-demo-01',
      driveId: '1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz',
      fileName: 'Adentech_Corporate_Flagship_Master_4k.mp4',
      title: 'Adentech Flagship Brand Anthem [Fresh Cut]',
      category: 'corporate',
      client: 'Adentech',
      role: 'Director, Video Production & Post Lead',
      year: '2025',
      duration: '01:45',
      timecode: 'TC 00:01:45:00',
      aspectRatio: '16:9 UHD',
      resolution: '4K DCI (3840x2160)',
      tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'After Effects'],
      badge: 'FEATURED CLIENT',
      tagline: 'High-production-value corporate engineering anthem showcasing next-gen technical vision.',
      synopsis: 'Imported from Google Drive projects folder. High-energy narrative engineered to establish trust and win enterprise contracts.',
      previewPoster: '/img/projects/adentech-lineup-master.jpg',
      sizeFormatted: '385 MB (4K ProRes Proxy)',
    }),
    synthesizeVideoProjectDetails({
      id: 'drive-demo-02',
      driveId: '1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h',
      fileName: 'Vishwa_Vinayak_Luxury_Realty_Showcase_v2.mov',
      title: 'Vishwa Vinayak Architectural Vision Reel',
      category: 'cinematic',
      client: 'Vishwa Vinayak Group',
      role: 'Cinematographer & Lead Editor',
      year: '2025',
      duration: '01:15',
      timecode: 'TC 00:01:15:00',
      aspectRatio: '2.39:1 CinemaScope',
      resolution: '4K UHD (3840x2160)',
      tools: ['DaVinci Resolve Studio', 'Premiere Pro'],
      badge: 'CINEMATIC CUT',
      tagline: 'Cinematic architectural walkthrough crafted with smooth camera motion and warm golden-hour grading.',
      synopsis: 'Discovered in Google Drive projects folder. Ready for review and live portfolio release.',
      previewPoster: '/img/projects/vvg-elnor-project-film.jpg',
      sizeFormatted: '520 MB (MOV Master)',
    }),
    synthesizeVideoProjectDetails({
      id: 'drive-demo-03',
      driveId: '16hsjAuVgdKCnZlVb-GRBG9vpuVC7pTps',
      fileName: 'RedBull_High_Octane_Retention_916_Master.mp4',
      title: 'Red Bull Energy Viral Reel [Retention Edit]',
      category: 'reels',
      client: 'Red Bull Media House',
      role: 'Viral Hook Specialist & Sound Designer',
      year: '2025',
      duration: '00:32',
      timecode: 'TC 00:00:32:15',
      aspectRatio: '9:16 Vertical Reel',
      resolution: 'Full HD 1080x1920 (Vertical)',
      tools: ['Premiere Pro', 'After Effects', 'Audition'],
      badge: 'VIRAL HOOK',
      tagline: 'First 3-second hook engineered with multi-layered whoosh sound effects and kinetic typography.',
      synopsis: 'High-retention vertical short synced from Google Drive staging repository. Staged in private queue awaiting approval.',
      previewPoster: '/img/projects/red-bull-action-reel.jpg',
      sizeFormatted: '92 MB (H.264 60fps)',
    }),
  ];
}
