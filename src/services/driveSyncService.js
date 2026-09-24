/**
 * Google Drive Cloud Synchronization & Staging Engine
 * Automatically scans and syncs video and media files from Google Drive folders,
 * staging them in the Admin Control Room for private review before publication.
 */

// Helper to clean file names into cinematic project titles
export function cleanDriveFileName(fileName) {
  if (!fileName || typeof fileName !== 'string') return 'Untitled Project';

  return fileName
    // Strip common video & image file extensions
    .replace(/\.(mp4|mov|m4v|webm|mkv|avi|png|jpg|jpeg|webp)$/i, '')
    // Strip timestamps or version tags like _v1, _v2, _final, _4k, _1080p, _UHD
    .replace(/[_-]?(?:v\d+|final|master|cut|4k|1080p|uhd|prores|h264|h265|dci)/gi, '')
    // Replace underscores, hyphens, and dots with spaces
    .replace(/[_\-.]+/g, ' ')
    // Normalize extra whitespace
    .replace(/\s+/g, ' ')
    .trim()
    // Capitalize words
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Untitled Project';
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

  // If already a clean 25-50 char alphanumeric ID
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

// Known client detection heuristic based on title / filename
export function detectClientFromText(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('adentech')) return 'Adentech';
  if (lower.includes('reliance')) return 'Reliance Industries';
  if (lower.includes('red bull') || lower.includes('redbull')) return 'Red Bull Media';
  if (lower.includes('vishwa') || lower.includes('vinayak')) return 'Vishwa Vinayak Group';
  if (lower.includes('zaggle')) return 'Zaggle';
  if (lower.includes('yukio')) return 'Yukio';
  return 'Client Commission';
}

// Known category detection heuristic
export function detectCategoryFromText(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('reel') || lower.includes('short') || lower.includes('916') || lower.includes('tiktok') || lower.includes('ig')) {
    return 'reels';
  }
  if (lower.includes('smm') || lower.includes('social') || lower.includes('hook') || lower.includes('creator')) {
    return 'smm';
  }
  if (lower.includes('cinematic') || lower.includes('film') || lower.includes('narrative') || lower.includes('trailer')) {
    return 'cinematic';
  }
  return 'corporate';
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
      const fields = encodeURIComponent('files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webViewLink, videoMediaMetadata)');
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

      const stagedItems = mediaFiles.map((f) => {
        const cleaned = cleanDriveFileName(f.name);
        const durationSec = f.videoMediaMetadata?.durationMillis ? Math.round(f.videoMediaMetadata.durationMillis / 1000) : 90;
        const minutes = String(Math.floor(durationSec / 60)).padStart(2, '0');
        const seconds = String(durationSec % 60).padStart(2, '0');

        return {
          id: `drive-${f.id}`,
          driveId: f.id,
          fileName: f.name,
          title: cleaned,
          category: detectCategoryFromText(f.name),
          categoryLabel: 'Google Drive Inbound Import',
          client: detectClientFromText(f.name),
          role: 'Video Production Executive & Editor',
          year: f.createdTime ? String(new Date(f.createdTime).getFullYear()) : String(new Date().getFullYear()),
          duration: `${minutes}:${seconds}`,
          timecode: `TC 00:${minutes}:${seconds}:00`,
          aspectRatio: f.videoMediaMetadata?.height && f.videoMediaMetadata?.width && f.videoMediaMetadata.height > f.videoMediaMetadata.width ? '9:16 Vertical Reel' : '16:9 UHD Master',
          resolution: f.videoMediaMetadata?.width ? `${f.videoMediaMetadata.width}x${f.videoMediaMetadata.height}` : '4K DCI (3840x2160)',
          tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Google Drive Pipeline'],
          badge: 'DRIVE IMPORT',
          tagline: `Fresh video asset detected in Google Drive folder [${f.name}].`,
          synopsis: `Automatic Google Drive sync item. Original file: ${f.name}. Awaiting producer review and public publication.`,
          deliverables: ['Master 4K Cinematic Cut', 'Google Drive Cloud Asset'],
          videoEmbedUrl: `https://drive.google.com/file/d/${f.id}/view?usp=sharing`,
          previewPoster: f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+/, '=s1200') : `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
          status: 'Staged', // PRIVATE STAGING QUEUE ONLY
          dateDiscovered: new Date().toISOString(),
          driveViewUrl: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view?usp=sharing`,
          sizeFormatted: formatBytes(f.size),
        };
      });

      return {
        success: true,
        items: stagedItems,
        totalFound: mediaFiles.length,
        strategy: 'Google Drive API v3 (Direct)',
      };
    } catch (err) {
      console.warn('Google Drive v3 API sync notice:', err);
      // Fall through to alternative strategies
    }
  }

  // Strategy 2: Google Apps Script Webhook
  if (scriptUrl) {
    try {
      const res = await fetch(scriptUrl);
      if (res.ok) {
        const data = await res.json();
        const files = Array.isArray(data) ? data : (data.files || []);
        const stagedItems = files.map((f) => ({
          id: `drive-${f.id}`,
          driveId: f.id,
          fileName: f.name || 'Drive Video',
          title: cleanDriveFileName(f.name || 'Drive Video'),
          category: detectCategoryFromText(f.name),
          categoryLabel: 'Google Drive Inbound Import',
          client: detectClientFromText(f.name),
          role: 'Video Production Executive & Editor',
          year: String(new Date().getFullYear()),
          duration: '01:30',
          timecode: 'TC 00:01:30:00',
          aspectRatio: '16:9 UHD',
          resolution: '4K DCI',
          tools: ['Adobe Premiere Pro', 'DaVinci Resolve'],
          badge: 'DRIVE IMPORT',
          tagline: 'Discovered from Google Drive shared repository.',
          synopsis: `Discovered from Google Drive. Original filename: ${f.name}`,
          deliverables: ['Master 4K Cinematic Cut'],
          videoEmbedUrl: `https://drive.google.com/file/d/${f.id}/view?usp=sharing`,
          previewPoster: `https://drive.google.com/thumbnail?id=${f.id}&sz=w1200`,
          status: 'Staged',
          dateDiscovered: new Date().toISOString(),
          driveViewUrl: `https://drive.google.com/file/d/${f.id}/view?usp=sharing`,
          sizeFormatted: formatBytes(f.size),
        }));

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

  // If no API key or script provided, return helpful guide + demo loader
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
 */
export function importFromDriveLinks(linksText) {
  if (!linksText || typeof linksText !== 'string') return [];

  const lines = linksText.split(/[\n,;]+/);
  const items = [];

  for (const line of lines) {
    const fileId = extractFileId(line);
    if (fileId) {
      items.push({
        id: `drive-${fileId}`,
        driveId: fileId,
        fileName: `Drive_Video_${fileId.substring(0, 6)}.mp4`,
        title: `Google Drive Project [${fileId.substring(0, 6)}]`,
        category: 'corporate',
        categoryLabel: 'Corporate / Client Work',
        client: 'Direct Drive Inbound',
        role: 'Video Production Executive & Editor',
        year: String(new Date().getFullYear()),
        duration: '01:30',
        timecode: 'TC 00:01:30:00',
        aspectRatio: '16:9 UHD',
        resolution: '4K DCI (3840x2160)',
        tools: ['Adobe Premiere Pro', 'DaVinci Resolve'],
        badge: 'DRIVE IMPORT',
        tagline: 'Direct Google Drive master video asset imported to staging queue.',
        synopsis: 'Private staged video asset imported from Google Drive. Review client details and select category before publishing to public portfolio.',
        deliverables: ['Master 4K Cinematic Cut'],
        videoEmbedUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        previewPoster: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
        status: 'Staged',
        dateDiscovered: new Date().toISOString(),
        driveViewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`,
        sizeFormatted: 'Google Drive Stream',
      });
    }
  }

  return items;
}

/**
 * Curated Demo Drive Staging Items using Ritik's verified Google Drive assets.
 * Allows Ritik to immediately test the "Accept & Publish" vs "Save as Draft" workflow.
 */
export function getDemoDriveStagingItems() {
  return [
    {
      id: 'drive-demo-01',
      driveId: '1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz',
      fileName: 'Adentech_Corporate_Flagship_Master_4k.mp4',
      title: 'Adentech Flagship Brand Anthem [Fresh Cut]',
      category: 'corporate',
      categoryLabel: 'Corporate / Client Work',
      client: 'Adentech',
      role: 'Director, Video Production & Post Lead',
      year: '2025',
      duration: '01:45',
      timecode: 'TC 00:01:45:00',
      aspectRatio: '16:9 UHD',
      resolution: '4K DCI (3840x2160)',
      tools: ['Adobe Premiere Pro', 'DaVinci Resolve', 'After Effects'],
      badge: 'NEW DRIVE CUT',
      tagline: 'High-production-value corporate engineering anthem showcasing next-gen technical vision.',
      synopsis: 'Imported from Google Drive projects folder. High-energy narrative engineered to establish trust and win enterprise contracts.',
      deliverables: ['Master 4K Cinematic Cut (16:9)', 'LinkedIn Cutdown (1:1)'],
      videoEmbedUrl: 'https://drive.google.com/file/d/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz/view?usp=sharing',
      previewPoster: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      status: 'Staged',
      dateDiscovered: new Date().toISOString(),
      driveViewUrl: 'https://drive.google.com/file/d/1F_qX4leuz7UMKU472lZkuUe2TfuGsOyz/view?usp=sharing',
      sizeFormatted: '385 MB (4K ProRes Proxy)',
    },
    {
      id: 'drive-demo-02',
      driveId: '1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h',
      fileName: 'Vishwa_Vinayak_Luxury_Realty_Showcase_v2.mov',
      title: 'Vishwa Vinayak Architectural Vision Reel',
      category: 'corporate',
      categoryLabel: 'Commercial Production',
      client: 'Vishwa Vinayak Group',
      role: 'Cinematographer & Lead Editor',
      year: '2025',
      duration: '01:15',
      timecode: 'TC 00:01:15:00',
      aspectRatio: '16:9 CinemaScope',
      resolution: '4K UHD (3840x2160)',
      tools: ['DaVinci Resolve Studio', 'Premiere Pro'],
      badge: 'DRIVE IMPORT',
      tagline: 'Cinematic architectural walkthrough crafted with smooth camera motion and warm golden-hour grading.',
      synopsis: 'Discovered in Google Drive projects folder. Ready for review and live portfolio release.',
      deliverables: ['4K DCI Widescreen Master', '9:16 Instagram Reels Version'],
      videoEmbedUrl: 'https://drive.google.com/file/d/1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h/view?usp=sharing',
      previewPoster: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      status: 'Staged',
      dateDiscovered: new Date().toISOString(),
      driveViewUrl: 'https://drive.google.com/file/d/1JVWpUFFzRrfO9ye_Rx4zvO4jRbhhCx8h/view?usp=sharing',
      sizeFormatted: '520 MB (MOV Master)',
    },
    {
      id: 'drive-demo-03',
      driveId: '16hsjAuVgdKCnZlVb-GRBG9vpuVC7pTps',
      fileName: 'RedBull_High_Octane_Retention_916_Master.mp4',
      title: 'Red Bull Energy Viral Reel [Retention Edit]',
      category: 'reels',
      categoryLabel: 'Short-Form Viral Reels',
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
      deliverables: ['9:16 Vertical Master', 'Hook A/B Variations'],
      videoEmbedUrl: 'https://drive.google.com/file/d/16hsjAuVgdKCnZlVb-GRBG9vpuVC7pTps/view?usp=sharing',
      previewPoster: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
      status: 'Staged',
      dateDiscovered: new Date().toISOString(),
      driveViewUrl: 'https://drive.google.com/file/d/16hsjAuVgdKCnZlVb-GRBG9vpuVC7pTps/view?usp=sharing',
      sizeFormatted: '92 MB (H.264 60fps)',
    },
  ];
}
