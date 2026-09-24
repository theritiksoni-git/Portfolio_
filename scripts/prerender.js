const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, '..', 'build');
const BASE_URL = 'https://www.ritiksoni.in';

if (!fs.existsSync(BUILD_DIR)) {
  console.error('[PRERENDER ERROR] Build directory does not exist! Run react-scripts build first.');
  process.exit(1);
}

const templatePath = path.join(BUILD_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[PRERENDER ERROR] build/index.html template not found!');
  process.exit(1);
}

const baseHtml = fs.readFileSync(templatePath, 'utf8');

const ROUTES = [
  {
    path: '/about',
    title: 'About Ritik Soni | Video Editor & Filmmaker in Pune',
    description: 'Learn about Ritik Soni, a Pune-based video editor, filmmaker, and UGC content creator delivering high-retention visual stories.',
    heading: 'About Ritik Soni: Commercial Director & Video Editor in Pune',
    content: `
      <h2>Directorial Biography & Background</h2>
      <p>Ritik Soni is a commercial film director, lead video editor, and content strategist based in Pune and Mumbai, Maharashtra, India. With 5+ years of dedicated post-production craft, Ritik directs brand commercials, dynamic 9:16 viral short-form reels for Instagram and YouTube, and full-funnel digital narrative campaigns.</p>
      <p>Having delivered over 100+ master cuts and generated 50M+ organic digital views, Ritik combines cinematic visual rhythm with rigorous viewer psychology to eliminate drop-off and maximize retention.</p>
      <h2>Collaborations & Trusted Brands</h2>
      <p>Commercial work spans premier brands and enterprises including Adentech, Vishwa Vinayak Group, Reliance Industries, Red Bull Media House, Zaggle, and Yukio Co-Living.</p>
      <h2>Storytelling Philosophy</h2>
      <p>Every frame serves the story. From 3-second hook construction to theatrical master grading and audio spatialization, every edit is crafted with frame-level intentionality.</p>
      <h2>Contact</h2>
      <p>Email: <a href="mailto:theritiksoni@gmail.com">theritiksoni@gmail.com</a> | Instagram: <a href="https://www.instagram.com/theritiksoni/">@theritiksoni</a> | LinkedIn: <a href="https://www.linkedin.com/in/theritiksoni">Ritik Soni</a></p>
    `
  },
  {
    path: '/work',
    title: 'Portfolio & Commercial Projects | Ritik Soni Pune',
    description: 'Explore video editing and directorial projects by Ritik Soni in Pune, featuring commercial brand films, social reels, and product videos.',
    heading: 'Directed Works & Commercial Repertoire | Ritik Soni',
    content: `
      <h2>Commercial Portfolio & Case Studies</h2>
      <ul>
        <li>
          <h3>Adentech Brand Vision & Master Lineup</h3>
          <p>4K corporate technology showcase combining live-action dynamics, engineering narrative, sound design transitions, and graphic overlays.</p>
        </li>
        <li>
          <h3>Adentech Fast-Paced Commercial Lineup</h3>
          <p>Condensed 66-second high-tempo commercial cut engineered for digital advertising campaigns and high audience retention.</p>
        </li>
        <li>
          <h3>Red Bull High-Adrenaline Dynamic Reel</h3>
          <p>Action sports promotional edit featuring speed-ramping, match cuts, and custom sound design transients locked to high-energy audio beats.</p>
        </li>
        <li>
          <h3>Reliance Mumbai Corporate Summit & Milestone Film</h3>
          <p>Multi-camera stadium summit recap film capturing executive keynotes, crowd energy, and corporate milestone presentations.</p>
        </li>
        <li>
          <h3>Reliance NHQ National Headquarters Film</h3>
          <p>Comprehensive architectural and corporate identity documentary featuring aerial cinematography and broadcast-grade color grading.</p>
        </li>
        <li>
          <h3>Vishwa Vinayak Group — ELNOR Project Film</h3>
          <p>Flagship real estate and architectural development film combining interior cinematography, lifestyle pacing, and sound design.</p>
        </li>
        <li>
          <h3>VVG Motion Graphics & Campaign Identity</h3>
          <p>After Effects motion design pack including 2D logo resolves, animated lower thirds, and social broadcast stems.</p>
        </li>
        <li>
          <h3>Zaggle FinTech Corporate Identity & Platform Film</h3>
          <p>Modern B2B enterprise fintech showcase blending UI device animations with dynamic commercial pacing.</p>
        </li>
        <li>
          <h3>Yukio Co-Living — Resident Testimonials & Social Hooks</h3>
          <p>Street-style vertical micro-interviews with kinetic subtitles and sound effects for Instagram Reels and TikTok.</p>
        </li>
        <li>
          <h3>Yukio Modern Spaces & Community Lifestyle</h3>
          <p>Atmospheric aesthetic architectural walkthrough reel highlighting modern amenities and community living.</p>
        </li>
        <li>
          <h3>Top Influencer Brand Collaboration & Commercial Final</h3>
          <p>High-production collaborative influencer campaign cut designed to maximize cross-platform brand conversion.</p>
        </li>
        <li>
          <h3>Overthinking — Tumhari Sabse Badi Problem</h3>
          <p>Psychological short-form breakdown with micro-pacing, sound effects, and kinetic subtitles eliminating viewer drop-off.</p>
        </li>
        <li>
          <h3>Tera ‘Kal Karunga’ Teri Zindagi Barbad Kar Raha Hai!</h3>
          <p>Viral short-form edit tackling procrastination with aggressive hook psychology and abrupt visual metaphors.</p>
        </li>
        <li>
          <h3>Finding Your Perfect Partner — Workout Motivation</h3>
          <p>Hard-hitting gym edit featuring speed ramps, heavy bass impacts, and dark aesthetic color tones.</p>
        </li>
        <li>
          <h3>You Can’t Give Up — Mindset Shift & Brutal Truth</h3>
          <p>Moody motivational vertical short utilizing high-contrast grading, deep acoustic resonance, and minimalist text pacing.</p>
        </li>
        <li>
          <h3>The Deep Thinker Dilemma — Visual Narrative</h3>
          <p>Poetic cinematic reflection examining existential tension with organic field recordings and custom color grading.</p>
        </li>
      </ul>
    `
  },
  {
    path: '/process',
    title: 'Filmmaking & Video Editing Workflow | Ritik Soni',
    description: "Discover Ritik Soni's 6-stage video editing and directing workflow, from hook psychology to sound design and master color grading.",
    heading: 'How I See a Story: 6-Stage Filmmaking Framework - Ritik Soni',
    content: `
      <h2>The 6-Stage Frame-Accurate Directorial Framework</h2>
      <ol>
        <li><strong>Stage 01 // Hook Psychology:</strong> First 3-second cognitive hook engineering, visual disruption, and audience retention framing.</li>
        <li><strong>Stage 02 // Pacing Architecture:</strong> Frame-accurate cutting rhythm, match cuts, and tension-and-release editorial structures.</li>
        <li><strong>Stage 03 // Motion & Typography:</strong> After Effects kinetic typography, animated graphic callouts, and brand motion design.</li>
        <li><strong>Stage 04 // Sound Engineering:</strong> Multi-track sound design, Foley layering, acoustic transients, whooshes, and sub-bass impacts.</li>
        <li><strong>Stage 05 // Color Calibration:</strong> ACES/Rec.709 color conformity, Kodak 2383 film print emulation, and clean skin tone grading in DaVinci Resolve.</li>
        <li><strong>Stage 06 // Multi-Platform Master:</strong> Multi-aspect rendering (16:9, 9:16, 1:1, 4:5) optimized for compression algorithms on YouTube, Instagram, and web.</li>
      </ol>
    `
  },
  {
    path: '/skills',
    title: 'Editing Suite & NLE Skills | Ritik Soni Pune',
    description: 'Technical proficiency in Adobe Premiere Pro, After Effects, and DaVinci Resolve Studio for commercial video editing and color grading.',
    heading: 'Technical Console & NLE Suite | Ritik Soni - Pune',
    content: `
      <h2>Core Software Competencies</h2>
      <ul>
        <li><strong>Adobe Premiere Pro:</strong> Master multi-track timeline editing, multi-camera live switching, proxy workflows, dynamic trimming, and frame-accurate SMPTE cuts.</li>
        <li><strong>Adobe After Effects:</strong> Advanced motion graphics, 2D/3D tracking, kinetic typography, HUD interface animations, visual effects, and logo animation.</li>
        <li><strong>DaVinci Resolve Studio:</strong> Node-based primary and secondary color correction, ACES/Rec.709 color management, Kodak 2383 film LUT development, and shot matching.</li>
        <li><strong>Adobe Audition:</strong> Multi-channel dialogue restoration, noise gating, vocal clarity EQ, sound effects design, and broadcast LUFS loudness compliance.</li>
        <li><strong>Adobe Photoshop & Illustrator:</strong> Storyboard layout creation, custom vector title graphics, lower thirds, and video thumbnail packaging.</li>
      </ul>
    `
  },
  {
    path: '/contact',
    title: 'Hire Ritik Soni | Video Editor & Filmmaker in Pune',
    description: 'Hire Ritik Soni for commercial video editing, UGC campaigns, or directorial commissions in Pune and across India. Get in touch today.',
    heading: 'Initiate Contact & Commission Terminal | Ritik Soni',
    content: `
      <h2>Direct Booking & Production Inquiries</h2>
      <p>Available for commercial directing, video editing commissions, flagship SMM retainers, and full-time video executive roles in Pune, Mumbai, and globally remote.</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:theritiksoni@gmail.com">theritiksoni@gmail.com</a></li>
        <li><strong>Instagram:</strong> <a href="https://www.instagram.com/theritiksoni/" target="_blank" rel="noreferrer">@theritiksoni</a></li>
        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/theritiksoni" target="_blank" rel="noreferrer">linkedin.com/in/theritiksoni</a></li>
        <li><strong>YouTube:</strong> <a href="https://www.youtube.com/@theritiksoni" target="_blank" rel="noreferrer">youtube.com/@theritiksoni</a></li>
        <li><strong>Location:</strong> Pune & Mumbai, Maharashtra, India (Available for nationwide travel and global remote editing)</li>
      </ul>
    `
  },
  {
    path: '/resume',
    title: 'Resume & Experience | Ritik Soni Video Editor Pune',
    description: "View Ritik Soni's professional background, video editing credentials, client metrics, and commercial production experience.",
    heading: 'Executive Resume & Curriculum Vitae | Ritik Soni',
    content: `
      <h2>Professional Summary</h2>
      <p>Creative and results-driven Social Media Executive, Video Production Lead, and Content Creator with hands-on experience in high-retention content creation, personal branding, and organic audience growth across Instagram, YouTube, and LinkedIn.</p>
      <h2>Career Timeline</h2>
      <ul>
        <li><strong>Vishwa Vinayak Group:</strong> Video Production Executive & SMM Lead (2023 - Present) — Directing comprehensive video production, corporate content creation, and social media growth operations.</li>
        <li><strong>Commercial Video Director & Lead Editor (Freelance):</strong> Directing and editing commercial cuts, short-form reels, and brand films for Adentech, Reliance Industries, Red Bull Media House, Zaggle, and Yukio Co-Living.</li>
      </ul>
      <h2>Core Metrics</h2>
      <p>50M+ Organic Views • 100+ Master Commercial Cuts • 78%+ Average Audience Retention Rate</p>
    `
  }
];

function generatePageHtml(route) {
  const pageUrl = `${BASE_URL}${route.path}`;
  let html = baseHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`);
  
  // Replace Meta Description
  html = html.replace(/<meta name="description" content=".*?"/i, `<meta name="description" content="${route.description}"`);
  
  // Replace Canonical Link
  html = html.replace(/<link rel="canonical" href=".*?"/i, `<link rel="canonical" href="${pageUrl}"`);

  // Replace OG / Twitter Title and Description
  html = html.replace(/<meta property="og:title" content=".*?"/i, `<meta property="og:title" content="${route.title}"`);
  html = html.replace(/<meta property="og:description" content=".*?"/i, `<meta property="og:description" content="${route.description}"`);
  html = html.replace(/<meta property="og:url" content=".*?"/i, `<meta property="og:url" content="${pageUrl}"`);

  html = html.replace(/<meta name="twitter:title" content=".*?"/i, `<meta name="twitter:title" content="${route.title}"`);
  html = html.replace(/<meta name="twitter:description" content=".*?"/i, `<meta name="twitter:description" content="${route.description}"`);

  // Replace Pre-Rendered Main Content inside root shell
  const pageBody = `
    <header style="margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 1.5rem;">
      <h1 style="font-size: 2.2rem; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; margin-bottom: 0.5rem;">
        ${route.heading}
      </h1>
      <p style="font-size: 1.15rem; color: #38bdf8; margin: 0 0 1rem 0;">
        ${route.description}
      </p>
      <nav style="display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.95rem;">
        <a href="/" style="color: #38bdf8; text-decoration: underline;">Home</a>
        <a href="/work" style="color: #38bdf8; text-decoration: underline;">Work</a>
        <a href="/about" style="color: #38bdf8; text-decoration: underline;">About</a>
        <a href="/process" style="color: #38bdf8; text-decoration: underline;">Process</a>
        <a href="/skills" style="color: #38bdf8; text-decoration: underline;">Skills</a>
        <a href="/resume" style="color: #38bdf8; text-decoration: underline;">Resume</a>
        <a href="/contact" style="color: #38bdf8; text-decoration: underline;">Contact</a>
      </nav>
    </header>
    <main>
      ${route.content}
    </main>
  `;

  // Update noscript container content for static crawlers without flashing in JS browsers
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    `<noscript><main style="padding: 2.5rem 1.5rem; max-width: 900px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.7; color: #f4f4f5;">${pageBody}</main></noscript>`
  );

  return html;
}

console.log('[PRERENDER] Starting build-time static HTML pre-rendering...');

for (const route of ROUTES) {
  const routeDir = path.join(BUILD_DIR, route.path.replace(/^\//, ''));
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const targetFile = path.join(routeDir, 'index.html');
  const renderedHtml = generatePageHtml(route);
  fs.writeFileSync(targetFile, renderedHtml, 'utf8');
  console.log(`[PRERENDER SUCCESS] ${route.path} -> ${path.relative(BUILD_DIR, targetFile)} (${renderedHtml.length} bytes)`);
}

console.log('[PRERENDER COMPLETE] All routes successfully pre-rendered for search engines.');
