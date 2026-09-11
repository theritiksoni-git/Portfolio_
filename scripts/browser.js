/**
 * Browser Automation Utility for Antigravity & Ritik Soni Portfolio
 * Uses the system-installed Microsoft Edge browser via Playwright.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

/**
 * Launch an automated browser instance or connect to an existing one.
 * @param {object} options
 * @param {boolean} options.headless - Run headless or with a visible window (default true)
 * @param {number} options.cdpPort - Optional port to connect to an existing browser (e.g. 9222)
 * @param {string} options.userDataDir - Optional user data directory for persistence
 */
async function getBrowser(options = {}) {
  const { headless = true, cdpPort, userDataDir } = options;

  if (cdpPort) {
    console.log(`[Browser] Connecting to existing browser on CDP port ${cdpPort}...`);
    return await chromium.connectOverCDP(`http://localhost:${cdpPort}`);
  }

  console.log(`[Browser] Launching Microsoft Edge (headless: ${headless})...`);
  if (userDataDir) {
    return await chromium.launchPersistentContext(userDataDir, {
      channel: 'msedge',
      headless
    });
  }

  return await chromium.launch({
    channel: 'msedge',
    headless
  });
}

/**
 * Navigate to a URL and capture details / screenshot
 */
async function openUrl(url, options = {}) {
  const {
    headless = true,
    screenshotPath,
    waitForSelector,
    timeout = 30000,
    cdpPort
  } = options;

  const browser = await getBrowser({ headless, cdpPort });
  const context = browser.newContext ? await browser.newContext() : browser;
  const page = await context.newPage();

  console.log(`[Browser] Navigating to: ${url}`);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout });

  if (waitForSelector) {
    console.log(`[Browser] Waiting for selector: ${waitForSelector}`);
    await page.waitForSelector(waitForSelector, { timeout });
  }

  const title = await page.title();
  const currentUrl = page.url();

  let screenshot = null;
  if (screenshotPath) {
    const fullPath = path.resolve(screenshotPath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    await page.screenshot({ path: fullPath, fullPage: true });
    screenshot = fullPath;
    console.log(`[Browser] Saved screenshot to: ${fullPath}`);
  }

  if (!cdpPort && browser.close) {
    await browser.close();
  }

  return { title, url: currentUrl, screenshot };
}

module.exports = {
  getBrowser,
  openUrl
};

// CLI execution helper: node scripts/browser.js <url> [screenshotPath]
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetUrl = args[0] || 'https://google.com';
  const screen = args[1];

  openUrl(targetUrl, { headless: true, screenshotPath: screen })
    .then((res) => {
      console.log('[Browser Result]:', res);
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Browser Error]:', err.message);
      process.exit(1);
    });
}
