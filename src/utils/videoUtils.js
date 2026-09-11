/**
 * Video Source Parser & Helper Utilities
 * Supports Google Drive, YouTube, Vimeo, and Local / Direct HTML5 Video Files
 */

/**
 * Parses any video URL and formats it appropriately for embed or HTML5 player.
 * @param {string} url - The video URL or path
 * @returns {object} { type: 'iframe' | 'video' | 'none', src: string, isGoogleDrive: boolean, originalUrl: string }
 */
export function parseVideoSource(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { type: 'none', src: '', originalUrl: '' };
  }

  const trimmed = url.trim();

  // 1. Google Drive Links:
  // Handles:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/file/d/FILE_ID/view
  // - https://drive.google.com/file/d/FILE_ID/preview
  // - https://drive.google.com/file/d/FILE_ID
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  const driveOpenMatch = trimmed.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([a-zA-Z0-9_-]+)/);
  const driveId = driveFileMatch?.[1] || driveOpenMatch?.[1];

  if (driveId) {
    return {
      type: 'iframe',
      src: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: trimmed,
      driveId,
      isGoogleDrive: true,
      openUrl: `https://drive.google.com/file/d/${driveId}/view?usp=sharing`
    };
  }

  // 2. Direct Video Files (HTML5 <video>):
  // Local files like '/videos/my-clip.mp4' or web URLs ending in .mp4, .webm, .mov, .ogg, .m4v
  const isDirectFile =
    /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(trimmed) ||
    trimmed.startsWith('/videos/') ||
    trimmed.startsWith('blob:');

  if (isDirectFile) {
    return {
      type: 'video',
      src: trimmed,
      originalUrl: trimmed,
      isDirectVideo: true
    };
  }

  // 3. YouTube Links:
  // Handles youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/...
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return {
      type: 'iframe',
      src: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0`,
      originalUrl: trimmed,
      isYouTube: true
    };
  }

  // 4. Vimeo Links:
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[2]) {
    return {
      type: 'iframe',
      src: `https://player.vimeo.com/video/${vimeoMatch[2]}?autoplay=1`,
      originalUrl: trimmed,
      isVimeo: true
    };
  }

  // 5. Fallback standard iframe embed URL
  return {
    type: 'iframe',
    src: trimmed,
    originalUrl: trimmed
  };
}
