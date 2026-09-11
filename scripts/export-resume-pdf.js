/**
 * Official Resume PDF Generator for Ritik Soni Portfolio
 * Renders the live website resume from http://localhost:3000/resume
 * and generates a high-resolution, vector A4 PDF to public/Ritik_Soni_Resume.pdf
 */
const { getBrowser } = require('./browser');
const path = require('path');
const fs = require('fs');

async function exportResumePdf() {
  console.log('[PDF Export] Launching Microsoft Edge browser...');
  const browser = await getBrowser({ headless: true });
  const page = await browser.newPage();
  
  // High-DPI A4-proportional viewport
  await page.setViewportSize({ width: 1240, height: 1754 });

  console.log('[PDF Export] Navigating to http://localhost:3000/resume...');
  await page.goto('http://localhost:3000/resume', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Wait for #printable-resume to be rendered
  await page.waitForSelector('#printable-resume', { timeout: 15000 });

  // Actively remove HUD, noise overlays, canvases, navigation, and all no-print elements
  await page.evaluate(() => {
    // Force light color-scheme so Chromium prints pure white margins
    let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.setAttribute('content', 'light');
    }
    document.documentElement.style.colorScheme = 'light';
    document.body.style.colorScheme = 'light';

    const selectorsToRemove = [
      '#viewport-hud',
      '.viewport-hud',
      '.camera-tally-dot',
      '.site-loader',
      '.film-grain',
      '.animus-plexus-void',
      '.animus-plexus-void--fixed',
      'canvas',
      'header',
      'nav',
      'footer',
      '.no-print'
    ];

    selectorsToRemove.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    });

    // Reset document & container styles to pure white background
    document.documentElement.style.background = '#ffffff';
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.background = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#18181b';

    const appShell = document.querySelector('.app-shell') || document.querySelector('#root > div');
    if (appShell) {
      appShell.style.background = '#ffffff';
      appShell.style.backgroundColor = '#ffffff';
      appShell.style.padding = '0';
      appShell.style.margin = '0';
    }

    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.style.background = '#ffffff';
      mainEl.style.backgroundColor = '#ffffff';
      mainEl.style.padding = '0';
      mainEl.style.margin = '0';
    }

    const pageEnter = document.querySelector('.cinematic-page-enter');
    if (pageEnter) {
      pageEnter.style.padding = '0';
      pageEnter.style.margin = '0';
      pageEnter.style.opacity = '1';
      pageEnter.style.animation = 'none';
      pageEnter.style.transform = 'none';
    }

    const resumeEl = document.querySelector('#printable-resume');
    if (resumeEl) {
      resumeEl.style.background = '#ffffff';
      resumeEl.style.backgroundColor = '#ffffff';
      resumeEl.style.boxShadow = 'none';
      resumeEl.style.border = 'none';
      resumeEl.style.borderRadius = '0';
      resumeEl.style.padding = '0';
      resumeEl.style.margin = '0';
    }
  });

  // Emulate print media for clean CSS A4 export
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(1200);

  const outputPath = path.resolve(__dirname, '../public/Ritik_Soni_Resume.pdf');
  console.log(`[PDF Export] Generating official PDF to: ${outputPath}...`);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true
  });

  // Also sync to build directory if it exists
  const buildDir = path.resolve(__dirname, '../build');
  if (fs.existsSync(buildDir)) {
    const buildDest = path.join(buildDir, 'Ritik_Soni_Resume.pdf');
    fs.copyFileSync(outputPath, buildDest);
    console.log(`[PDF Export] Synced updated PDF to: ${buildDest}`);
  }

  const stat = fs.statSync(outputPath);
  console.log(`[PDF Export] Success! Generated ${stat.size} bytes PDF.`);
  await browser.close();
}

if (require.main === module) {
  exportResumePdf()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[PDF Export Error]:', err);
      process.exit(1);
    });
}

module.exports = { exportResumePdf };
