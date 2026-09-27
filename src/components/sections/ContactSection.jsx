import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Send, RotateCcw, CheckCircle2, AlertCircle, Sparkles, 
  MessageSquare, ChevronDown, Check, Film, Video, Tv, Layers, 
  FileText, Camera, Clock, ShieldCheck, Award, Zap, 
  Copy, Sliders, Radio, ArrowRight, 
  HelpCircle, CheckCheck
} from 'lucide-react';
import sound from '../../utils/SoundEngine';
import adminStore from '../../services/adminStore';
import usePortfolioData from '../../utils/usePortfolioData';

// Project types for dropdown & visual selection
const PROJECT_TYPES = [
  {
    value: 'Full-Time Video Production Executive',
    label: 'Full-Time Video Production Executive',
    desc: 'Lead in-house video production, studio shoots & post-pipeline',
    icon: Film,
    badge: 'EXECUTIVE LEAD',
    category: 'Full-Time Leadership',
    turnaround: 'Immediate / Q2-Q3 Onboarding',
    rate: 'Executive Roster / Retainer',
    deliverables: ['Lead In-House Video Dept', 'Studio Shoots & Crew Direction', 'Post-Pipeline Management', 'Team Mentorship'],
    suggestedPrompt: "Hi Ritik, we're looking for a Full-Time Video Production Executive / Creative Lead to drive our in-house media team and lead video production. We'd love to review your background and discuss this opportunity.",
  },
  {
    value: 'Social Media Management & Growth Strategy',
    label: 'Social Media Management & Organic Growth Strategy',
    desc: '30-day content calendar, hook engineering, reels management & audience growth',
    icon: Zap,
    badge: 'VIRAL GROWTH (50M+)',
    category: 'SMM & Viral Strategy',
    turnaround: '7 - 10 Days',
    rate: 'From $2,500 / month',
    deliverables: ['30-Day Content Roadmap', '12-20 High-Retention Master Reels', 'Hook A/B Variations', 'Audio Pacing & SFX'],
    suggestedPrompt: "Hi Ritik, I'm reaching out about your Full-Funnel Viral Reels & SMM Strategy. We need a high-retention 30-day content series to elevate our brand presence and drive organic growth.",
  },
  {
    value: 'Corporate Video / Client Production',
    label: 'Corporate Video / Brand Film Commission',
    desc: 'High-end commercial films, corporate documentary & brand storytelling',
    icon: Video,
    badge: 'COMMERCIAL FLAGSHIP',
    category: 'Commercial Production',
    turnaround: '2 - 3 Weeks',
    rate: 'From $4,000 / project',
    deliverables: ['Script-to-Screen Direction', '4K DCI ProRes Master Deliverables', 'Color Grading & Shot Matching', 'Custom Motion Graphics'],
    suggestedPrompt: "Hi Ritik, we are planning a commercial brand film / corporate campaign for Q3. We are looking for end-to-end cinematic direction, high production value, and 4K ProRes deliverables.",
  },
  {
    value: 'High-Retention Short-Form Reels',
    label: 'High-Retention Short-Form Reels Series',
    desc: 'Viral pacing, kinetic motion design & sound design for IG/TikTok',
    icon: Sparkles,
    badge: 'SHORT-FORM REELS',
    category: 'Viral Short-Form',
    turnaround: '5 - 7 Days',
    rate: 'From $1,800 / series',
    deliverables: ['Retention Hook Disruption', 'Frame-Accurate Kinetic Cuts', 'Dynamic Captions & Graphics', 'Audio Mastering (-14 LUFS)'],
    suggestedPrompt: "Hi Ritik, we need a high-impact series of short-form reels with viral pacing, kinetic typography, and sound design to capture audience attention from frame zero.",
  },
  {
    value: 'YouTube Long-Form Storytelling',
    label: 'YouTube Long-Form / Documentary Editing',
    desc: 'Deep-dive documentaries, video essays & creator retention storylines',
    icon: Tv,
    badge: 'LONG-FORM STORY',
    category: 'Long-Form Storytelling',
    turnaround: '5 - 7 Days',
    rate: 'From $1,500 / episode',
    deliverables: ['15-45 Min Timeline Sculpting', 'B-Roll & Archival Research Sync', 'Cinematic Soundscapes', 'High-CTR Thumbnail Stills'],
    suggestedPrompt: "Hi Ritik, we have long-form video essay / documentary footage and need retention-focused editing, chapter sculpting, custom soundscapes, and high-CTR thumbnail stills.",
  },
  {
    value: 'Creative Directing & Filmmaking',
    label: 'DaVinci Resolve Color Grading & Audio Mastering',
    desc: 'Cinematic visual direction, camera cinematography & color grading',
    icon: Sliders,
    badge: 'COLOR & SOUND',
    category: 'Post-Specialty',
    turnaround: '3 - 5 Days',
    rate: 'From $800 / project',
    deliverables: ['ACES / Rec.709 Color Passes', 'Shot Matching & Film Halation', 'Dolby/LUFS Calibrated Mixes', 'Dialogue & SFX Stem Exports'],
    suggestedPrompt: "Hi Ritik, we have locked picture and need master DaVinci Resolve color grading (ACES/Rec.709) and broadcast LUFS audio mastering for commercial release.",
  },
];

// Crisp Inline Social Brand SVGs
const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const XTwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Cinema Monitor Feed Configuration
const MONITOR_FEEDS = [
  {
    id: 'master',
    name: 'CAM A // TRANSMISSION RIG',
    badge: 'LIVE ON AIR',
    image: '/img/cinema-transmission-rig.jpg',
    description: 'RED Cinema Camera, ATEM Studio Switcher & Audio Console',
    lens: 'Cooke Anamorphic 35mm T1.5',
    shutter: '180° (1/48s)',
    iso: 'ISO 800',
    wb: '5600K',
    res: '4K DCI (3840x2160)',
    fps: '24.000 FPS',
  },
  {
    id: 'nle',
    name: 'CAM B // NLE TIMELINE SUITE',
    badge: 'STUDIO BAY',
    image: '/img/studio-pipeline.jpg',
    description: 'Post-Production Suite, Premiere Pro & DaVinci Resolve Timeline',
    lens: 'Dual 4K Pro Display Bay',
    shutter: '120Hz Calibrated',
    iso: 'DCI-P3 100%',
    wb: '6500K Rec.709',
    res: 'Dual 3840x2160',
    fps: '60.000 FPS',
  },
  {
    id: 'grading',
    name: 'CAM C // 4K COLOR GRADE',
    badge: 'ACEScg HDR',
    image: '/img/mountain-ascent.jpg',
    description: 'High-Altitude Anamorphic Film Emulation & Grading Frame',
    lens: '50mm Cinema Prime',
    shutter: 'ACES 1.3 Color Space',
    iso: '10-Bit 4:2:2 HDR',
    wb: 'Native Sensor Color',
    res: 'ProRes 4444 XQ',
    fps: '24.000 FPS',
  },
  {
    id: 'director',
    name: 'CAM D // DIRECTOR ON SET',
    badge: 'CREATIVE LEAD',
    image: '/img/ritik-portrait.webp',
    description: 'Ritik Soni • Director, SMM Lead & Commercial Video Editor',
    lens: 'Director Viewfinder',
    shutter: 'Creative Execution',
    iso: '50M+ Organic Reach',
    wb: 'Studio Ready',
    res: 'Direct Line',
    fps: 'Live Telemetry',
  },
];

// Budget brackets for client inquiries
const BUDGET_OPTIONS = [
  '< $2,500',
  '$2,500 - $5,000',
  '$5,000 - $10,000',
  '$10,000+ / Enterprise',
  'Full-Time Executive Role',
];

// Frequently Asked Collaboration Questions
const FAQ_ITEMS = [
  {
    question: "What is your typical project turnaround time?",
    answer: "Turnarounds are tailored to project scope: High-retention viral reels and short-form packages typically deliver within 7 to 10 days. YouTube long-form documentary edits average 5 to 7 days. Full commercial brand films and corporate productions run 2 to 3 weeks from approved treatment to final 4K ProRes master sign-off. Rush delivery is available for time-sensitive commercial campaigns."
  },
  {
    question: "How do you work with remote and international clients?",
    answer: "Based in India (IST, UTC+5:30), my workflow seamlessly bridges North America (PST/EST), Europe (GMT/CET), and APAC timezones. All review cycles occur via Frame.io for frame-accurate timecoded annotations, Loom asynchronous breakdowns, and Google Meet/Zoom for milestone strategy sessions."
  },
  {
    question: "How do we transfer heavy 4K raw camera footage and assets?",
    answer: "We support multiple high-speed transfer pipelines: Private enterprise Google Drive workspace, Frame.io Transfer, Dropbox Business, or Aspera. For multi-terabyte production shoots, encrypted Samsung T7/SanDisk Extreme SSD courier shipments are fully accommodated."
  },
  {
    question: "What formats, color spaces, and master deliverables do I receive?",
    answer: "All commercial projects deliver in uncompressed Apple ProRes 422 HQ / 4444 master files alongside web-optimized H.264/H.265 versions for digital feeds. Deliverables include 16:9 widescreen, 9:16 vertical cuts, 1:1 square crops, separate dialogue/SFX/music audio stems (-14 LUFS calibrated), and DaVinci Resolve/Premiere Pro XML project archives upon request."
  }
];

const ContactSection = ({ onOpenResume }) => {
  const { settings, availability } = usePortfolioData();
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    projectType: 'Corporate Video / Client Production',
    budget: '$2,500 - $5,000',
    Message: '',
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle, sending, success, error
  const [botTrap, setBotTrap] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const dropdownRef = useRef(null);

  // Monitor Interactive States
  const [activeFeedId, setActiveFeedId] = useState('master');
  const [showGrid, setShowGrid] = useState(true);
  const [showSafe, setShowSafe] = useState(true);
  const [showCross, setShowCross] = useState(true);
  const [showScope, setShowScope] = useState(false);
  const [timecode, setTimecode] = useState('01:24:18:09');
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  // Audio VU Meter dynamic heights
  const [vuLevels, setVuLevels] = useState({ left: 65, right: 62 });

  // 24 FPS Timecode Simulation
  useEffect(() => {
    let frame = 9;
    let sec = 18;
    let min = 24;
    let hr = 1;
    const interval = setInterval(() => {
      frame = (frame + 1) % 24;
      if (frame === 0) {
        sec = (sec + 1) % 60;
        if (sec === 0) {
          min = (min + 1) % 60;
          if (min === 0) {
            hr = (hr + 1) % 24;
          }
        }
      }
      const fmt = (n) => String(n).padStart(2, '0');
      setTimecode(`${fmt(hr)}:${fmt(min)}:${fmt(sec)}:${fmt(frame)}`);

      // Gentle VU level fluctuation
      setVuLevels({
        left: Math.min(95, Math.max(30, 60 + Math.floor(Math.sin(Date.now() / 200) * 25 + Math.random() * 10))),
        right: Math.min(95, Math.max(30, 58 + Math.floor(Math.cos(Date.now() / 220) * 25 + Math.random() * 10))),
      });
    }, 1000 / 24);

    return () => clearInterval(interval);
  }, []);

  // Dropdown outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };

    document.addEventListener('pointerdown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectProjectType = (val, customPrompt) => {
    sound.playClick();
    setFormData((prev) => ({
      ...prev,
      projectType: val,
      Message: (!prev.Message || prev.Message.trim() === '' || PROJECT_TYPES.some((p) => p.suggestedPrompt === prev.Message))
        ? (customPrompt || prev.Message)
        : prev.Message,
    }));
    setIsDropdownOpen(false);
  };

  const handleCopyEmail = () => {
    sound.playClick();
    const emailToCopy = settings?.adminEmail || 'theritiksoni@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(emailToCopy);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const selectedProjectTypeObj = PROJECT_TYPES.find((t) => t.value === formData.projectType) || PROJECT_TYPES[2];
  const activeFeed = MONITOR_FEEDS.find((f) => f.id === activeFeedId) || MONITOR_FEEDS[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    sound.playClick();
    setFormData({
      Name: '',
      email: '',
      projectType: 'Corporate Video / Client Production',
      budget: '$2,500 - $5,000',
      Message: '',
    });
    setStatus({ state: 'idle', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Anti-bot honeypot check
    if (botTrap && botTrap.trim() !== '') {
      sound.playShutter();
      setStatus({ state: 'success', message: 'INQUIRY TRANSMITTED SUCCESSFULLY' });
      return;
    }

    // 2. Cooldown rate limiter (prevent rapid repeated flooding)
    const now = Date.now();
    if (now - lastSubmitTime < 15000) {
      sound.playClick();
      setStatus({
        state: 'error',
        message: 'RATE LIMIT: PLEASE WAIT 15 SECONDS BEFORE TRANSMITTING ANOTHER INQUIRY',
      });
      return;
    }
    setLastSubmitTime(now);

    sound.playShutter();
    setStatus({ state: 'sending', message: 'TRANSMITTING INQUIRY TO STUDIO TERMINAL...' });

    // 3. Strict length bounds to prevent memory/payload bloat
    const submissionName = (formData.Name || '').trim().slice(0, 100);
    const submissionEmail = (formData.email || '').trim().slice(0, 150);
    const submissionProjectType = (formData.projectType || 'Corporate Video / Client Production').slice(0, 100);
    const submissionBudget = (formData.budget || '$2,500 - $5,000').slice(0, 100);
    const submissionMessage = (formData.Message || '').trim().slice(0, 3000);
    const targetEmail = settings?.adminEmail || 'theritiksoni@gmail.com';

    // 4. Immediately record lead in central admin control room store
    try {
      adminStore.addLead({
        name: submissionName,
        email: submissionEmail,
        projectType: submissionProjectType,
        budget: submissionBudget,
        message: submissionMessage,
        status: 'NEW',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.warn('Failed to log lead in store:', err);
    }

    let emailDispatched = false;

    // 5. Direct online delivery via Web3Forms (if access key provided in Admin Settings)
    if (settings?.web3formsKey) {
      try {
        const w3Res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            access_key: settings.web3formsKey,
            name: submissionName,
            email: submissionEmail,
            subject: `🎬 New Portfolio Inquiry: ${submissionName} [${submissionProjectType}]`,
            projectType: submissionProjectType,
            budgetBracket: submissionBudget,
            message: submissionMessage,
          }),
        });
        const w3Data = await w3Res.json();
        if (w3Data.success) {
          emailDispatched = true;
        }
      } catch (err) {
        console.warn('Web3Forms dispatch notice:', err);
      }
    }

    // 6. Direct online delivery via FormSubmit AJAX service
    let isActivationPending = false;
    if (!emailDispatched) {
      try {
        const fsRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            Name: submissionName || 'New Client Inquiry',
            Email: (submissionEmail.toLowerCase() === targetEmail.toLowerCase())
              ? 'inquiry@ritiksoni.in'
              : submissionEmail,
            'Project Scope': submissionProjectType,
            'Budget Bracket': submissionBudget,
            Message: submissionMessage,
            _subject: `🎬 New Portfolio Inquiry from ${submissionName || 'Client'} [${submissionProjectType}]`,
            _captcha: 'false',
            _template: 'table',
            _url: typeof window !== 'undefined' ? window.location.href : 'https://www.ritiksoni.in',
          }),
        });
        const fsData = await fsRes.json();
        if (fsData.success === 'true' || fsData.success === true) {
          emailDispatched = true;
        } else if (fsData.message && fsData.message.toLowerCase().includes('activation')) {
          isActivationPending = true;
          emailDispatched = true;
        }
      } catch (err) {
        console.warn('FormSubmit dispatch notice:', err);
      }
    }

    // 7. Local / Cloud server backend delivery fallback
    try {
      const backendUrl = settings?.backendApiUrl || 'http://localhost:3001';
      await fetch(`${backendUrl}/submitFormData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: submissionName,
          email: submissionEmail,
          projectType: submissionProjectType,
          budget: submissionBudget,
          Message: submissionMessage,
          targetEmail: targetEmail,
        }),
      });
    } catch (err) {
      // Local server offline, expected in frontend-only environments
    }

    // 8. Present clean user alert
    if (emailDispatched) {
      setFormData({
        Name: '',
        email: '',
        projectType: 'Corporate Video / Client Production',
        budget: '$2,500 - $5,000',
        Message: '',
      });
      setStatus({
        state: 'success',
        message: isActivationPending
          ? 'INQUIRY LOGGED! PLEASE CHECK YOUR EMAIL AND ACTIVATE FORM ONCE.'
          : 'TRANSMISSION COMPLETE! INQUIRY DELIVERED DIRECTLY TO RITIK’S PRIORITY INBOX.',
      });
    } else {
      setStatus({
        state: 'error',
        message: 'COULD NOT TRANSMIT INQUIRY. PLEASE CHECK YOUR CONNECTION OR EMAIL THERITIKSONI@GMAIL.COM DIRECTLY.',
      });
    }
  };

  return (
    <section id="contact" className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24 sm:space-y-32">

      {/* ─────────────────────────────────────────────────────────────────────────────
          FEATURE 1: INTERACTIVE CINEMA PRODUCTION MONITOR & STUDIO TELEMETRY
          ───────────────────────────────────────────────────────────────────────────── */}
      <div id="studio-monitor" className="relative scroll-mt-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan-400 tracking-widest uppercase">
              <Camera className="w-3.5 h-3.5" />
              <span>LIVE PRODUCTION MONITOR // DIRECT STUDIO FEED</span>
            </div>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              THE DIRECTOR'S <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">VIEWFINDER</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>FEED RESOLUTION: 4K DCI (3840x2160)</span>
            </span>
          </div>
        </div>

        {/* Realistic Cinema Field Monitor Chassis */}
        <div className="rounded-3xl bg-[#090b10] border-2 border-zinc-800 p-2 sm:p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(14,165,233,0.15)] relative">
          
          {/* Chassis Corner Industrial Screws */}
          <div className="hidden sm:block absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/80 shadow-inner" />
          <div className="hidden sm:block absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/80 shadow-inner" />
          <div className="hidden sm:block absolute bottom-3 left-3 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/80 shadow-inner" />
          <div className="hidden sm:block absolute bottom-3 right-3 w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700/80 shadow-inner" />

          {/* Monitor Screen Frame */}
          <div className="relative aspect-[16/9] sm:aspect-[21/10] w-full rounded-2xl overflow-hidden bg-black border border-zinc-800/80 group">
            
            {/* Visual Feed Media Asset */}
            <img 
              src={activeFeed.image}
              alt={activeFeed.description}
              className="w-full h-full object-cover filter contrast-110 brightness-95 transition-all duration-700 scale-100 group-hover:scale-[1.02]"
            />

            {/* Subtle Cinema Scanline Grid Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

            {/* 2.39:1 Anamorphic Cinema Scope Letterbox Bars */}
            {showScope && (
              <>
                <div className="absolute top-0 left-0 right-0 h-[10%] bg-black/95 border-b border-cyan-500/20 pointer-events-none z-10 transition-all" />
                <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-black/95 border-t border-cyan-500/20 pointer-events-none z-10 transition-all" />
              </>
            )}

            {/* 3x3 Rule of Thirds Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-40">
                <div className="border-r border-b border-cyan-400/30" />
                <div className="border-r border-b border-cyan-400/30" />
                <div className="border-b border-cyan-400/30" />
                <div className="border-r border-b border-cyan-400/30" />
                <div className="border-r border-b border-cyan-400/30" />
                <div className="border-b border-cyan-400/30" />
                <div className="border-r border-cyan-400/30" />
                <div className="border-r border-cyan-400/30" />
                <div />
              </div>
            )}

            {/* 90% / 80% Action-Safe Title Box */}
            {showSafe && (
              <div className="absolute inset-6 sm:inset-10 border border-white/20 rounded pointer-events-none z-10 opacity-50 flex items-center justify-center">
                <div className="w-[85%] h-[85%] border border-dashed border-cyan-400/30" />
              </div>
            )}

            {/* Center Crosshairs */}
            {showCross && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <div className="absolute w-full h-[1px] bg-cyan-400/80" />
                  <div className="absolute h-full w-[1px] bg-cyan-400/80" />
                  <div className="w-3 h-3 rounded-full border border-cyan-400/60" />
                </div>
              </div>
            )}

            {/* TOP MONITOR HUD BAR */}
            <div className="absolute top-0 left-0 right-0 p-3 sm:p-5 flex items-center justify-between text-white font-mono text-[10px] sm:text-xs z-20 pointer-events-none backdrop-blur-[2px]">
              
              {/* Left: Tally Light & Active Feed Title */}
              <div className="flex items-center gap-2 sm:gap-3 bg-black/70 px-2.5 py-1 rounded-lg border border-white/10">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600/90 text-white font-bold text-[9px] uppercase tracking-wider animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>REC</span>
                </div>
                <span className="text-cyan-300 font-semibold truncate">{activeFeed.name}</span>
              </div>

              {/* Center: Live 24 FPS Timecode */}
              <div className="bg-black/80 px-3 py-1 rounded-lg border border-cyan-500/40 text-cyan-400 font-mono tracking-widest font-bold shadow-[0_0_15px_rgba(56,189,248,0.25)] flex items-center gap-2">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>{timecode}</span>
                <span className="text-[9px] text-zinc-400 hidden sm:inline">[24.00 FPS]</span>
              </div>

              {/* Right: Camera Battery & Media Telemetry */}
              <div className="hidden sm:flex items-center gap-2 bg-black/70 px-3 py-1 rounded-lg border border-white/10 text-zinc-300">
                <span className="text-emerald-400">14.8V (94%)</span>
                <span>•</span>
                <span className="text-cyan-300">512GB (3h 12m)</span>
                <span>•</span>
                <span className="text-amber-300">ACEScg</span>
              </div>
            </div>

            {/* BOTTOM MONITOR HUD BAR & AUDIO METERS */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white font-mono text-[10px] sm:text-xs z-20 pointer-events-none backdrop-blur-[2px]">
              
              {/* Bottom Left: Audio VU Meter */}
              <div className="bg-black/80 p-2 rounded-lg border border-white/10 space-y-1 w-44">
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span>AUDIO IN (48kHz / 24-Bit)</span>
                  <span className="text-emerald-400">-14 LUFS</span>
                </div>
                
                {/* Channel L */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-zinc-400 w-2.5">L</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-75"
                      style={{ width: `${vuLevels.left}%` }}
                    />
                  </div>
                </div>

                {/* Channel R */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-zinc-400 w-2.5">R</span>
                  <div className="flex-1 h-1.5 bg-zinc-800 rounded overflow-hidden flex">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500 transition-all duration-75"
                      style={{ width: `${vuLevels.right}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Right: Lens & Optical Telemetry */}
              <div className="bg-black/80 px-3 py-2 rounded-lg border border-white/10 text-right space-y-0.5">
                <div className="text-cyan-300 font-semibold text-[11px] truncate">
                  {activeFeed.lens}
                </div>
                <div className="text-zinc-400 text-[9px] flex items-center justify-end gap-2">
                  <span>{activeFeed.shutter}</span>
                  <span>•</span>
                  <span>{activeFeed.iso}</span>
                  <span>•</span>
                  <span>{activeFeed.wb}</span>
                  <span>•</span>
                  <span>{activeFeed.res}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Monitor Control Bar (Feed Switcher & Reticle Toggles) */}
          <div className="mt-3 sm:mt-4 p-2.5 rounded-2xl bg-zinc-950 border border-white/10 flex flex-wrap items-center justify-between gap-3">
            
            {/* Feed Selectors */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1 hidden sm:inline">
                FEEDS:
              </span>
              {MONITOR_FEEDS.map((feed) => (
                <button
                  key={feed.id}
                  onClick={() => {
                    sound.playLensClick();
                    setActiveFeedId(feed.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[11px] tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                    activeFeedId === feed.id
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${activeFeedId === feed.id ? 'bg-black' : 'bg-cyan-400'}`} />
                  <span>{feed.badge}</span>
                </button>
              ))}
            </div>

            {/* Overlay Reticle Toggles */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1 hidden lg:inline">
                RETICLES:
              </span>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowGrid(!showGrid);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase transition-all ${
                  showGrid ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                title="Toggle 3x3 Composition Grid"
              >
                GRID
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSafe(!showSafe);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase transition-all ${
                  showSafe ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                title="Toggle Action Safe Title Box"
              >
                SAFE
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCross(!showCross);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase transition-all ${
                  showCross ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                title="Toggle Center Crosshairs"
              >
                CROSS
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowScope(!showScope);
                }}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] uppercase transition-all ${
                  showScope ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                }`}
                title="Toggle 2.39:1 Anamorphic Scope"
              >
                2.39:1
              </button>
            </div>

          </div>

        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────────────────────
          FEATURE 2: CLIENT CREDENTIALS & TRUST REEL
          ───────────────────────────────────────────────────────────────────────────── */}
      <div id="client-credentials" className="relative scroll-mt-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan-400 tracking-widest uppercase">
              <Award className="w-3.5 h-3.5" />
              <span>VERIFIED ENTERPRISE & CREATOR TRUST</span>
            </div>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              CLIENTS WHO TRUST THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">VISION</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Commercial directors, marketing executives, and content creators rely on Ritik's visual speed, color precision, and viral pacing.
          </p>
        </div>

        {/* 4 Client Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Card 1: Red Bull */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-red-500/40 transition-all duration-300 group shadow-xl hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 flex items-center justify-between">
                <img 
                  src="/img/client-logos/redbull.png" 
                  alt="Red Bull" 
                  className="max-h-8 max-w-[120px] object-contain filter brightness-95 group-hover:brightness-110 transition-all"
                />
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-red-950/50 border border-red-500/30 text-red-300 uppercase">
                  ACTIVE PARTNER
                </span>
              </div>
              <div>
                <h4 className="font-syne font-bold text-base text-white group-hover:text-red-300 transition-colors">
                  Red Bull
                </h4>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Energy & Sports Media • 4 Cuts
                </div>
              </div>
              <p className="text-xs text-zinc-300 font-light italic leading-relaxed">
                "Exceptional visual rhythm and adrenaline-fueled pacing across all cuts."
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <CheckCheck className="w-3.5 h-3.5 text-red-400" />
              <span>High-Velocity Action Reels</span>
            </div>
          </div>

          {/* Card 2: Reliance Industries */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group shadow-xl hover:shadow-[0_0_25px_rgba(56,189,248,0.15)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 flex items-center justify-between">
                <img 
                  src="/img/client-logos/reliance-industries-limited.png" 
                  alt="Reliance Industries" 
                  className="max-h-8 max-w-[120px] object-contain filter brightness-95 group-hover:brightness-110 transition-all"
                />
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 uppercase">
                  ENTERPRISE
                </span>
              </div>
              <div>
                <h4 className="font-syne font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  Reliance Industries
                </h4>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Conglomerate • Corporate NHQ
                </div>
              </div>
              <p className="text-xs text-zinc-300 font-light italic leading-relaxed">
                "Executed immaculate broadcast color and corporate precision under tight deadlines."
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Corporate Summit Documentaries</span>
            </div>
          </div>

          {/* Card 3: AdenTech */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-blue-500/40 transition-all duration-300 group shadow-xl hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 flex items-center justify-between">
                <img 
                  src="/img/client-logos/adentech.png" 
                  alt="AdenTech" 
                  className="max-h-8 max-w-[120px] object-contain filter brightness-95 group-hover:brightness-110 transition-all"
                />
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950/50 border border-blue-500/30 text-blue-300 uppercase">
                  FLAGSHIP
                </span>
              </div>
              <div>
                <h4 className="font-syne font-bold text-base text-white group-hover:text-blue-300 transition-colors">
                  AdenTech
                </h4>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Software & Tech • 4K Commercials
                </div>
              </div>
              <p className="text-xs text-zinc-300 font-light italic leading-relaxed">
                "Transformed complex technical software into an electric cinematic commercial."
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <CheckCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>4K Master Product Lineup</span>
            </div>
          </div>

          {/* Card 4: Vishwa Vinayak Group */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-white/10 hover:border-amber-500/40 transition-all duration-300 group shadow-xl hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="h-10 flex items-center justify-between">
                <img 
                  src="/img/client-logos/vishwa-vinayak-group.png" 
                  alt="Vishwa Vinayak Group" 
                  className="max-h-8 max-w-[120px] object-contain filter brightness-95 group-hover:brightness-110 transition-all"
                />
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950/50 border border-amber-500/30 text-amber-300 uppercase">
                  LEAD ROLE
                </span>
              </div>
              <div>
                <h4 className="font-syne font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                  Vishwa Vinayak Group
                </h4>
                <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                  Real Estate • Full-Time Direction
                </div>
              </div>
              <p className="text-xs text-zinc-300 font-light italic leading-relaxed">
                "Spearheads all digital video initiatives and social media storytelling with vision."
              </p>
            </div>
            <div className="pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
              <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Architectural Films & SMM</span>
            </div>
          </div>

        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────────────────────
          FEATURE 3: VISUAL PROJECT SCOPES & INSTANT STARTER SELECTION
          ───────────────────────────────────────────────────────────────────────────── */}
      <div id="project-scopes" className="relative scroll-mt-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan-400 tracking-widest uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>PRODUCTION SCOPE CATALOG // SELECT YOUR DISCIPLINE</span>
            </div>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              CHOOSE YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">PRODUCTION ARCHITECTURE</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Click any scope to automatically calibrate the transmission terminal with tailored prompts and timeline benchmarks.
          </p>
        </div>

        {/* 6 Visual Discipline Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECT_TYPES.map((type) => {
            const isSelected = formData.projectType === type.value;
            const IconComp = type.icon;

            return (
              <div
                key={type.value}
                onClick={() => {
                  handleSelectProjectType(type.value, type.suggestedPrompt);
                  const elem = document.getElementById('inquiry-terminal');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-zinc-900/90 border-2 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.25)]'
                    : 'bg-zinc-950/80 border border-white/10 hover:border-cyan-500/40 hover:bg-zinc-900/40'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Bar: Icon & Badge */}
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                        : 'bg-zinc-900 text-cyan-400 border border-white/10 group-hover:border-cyan-500/30'
                    }`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <span className={`text-[9px] font-mono px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                      isSelected
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                        : 'bg-zinc-900 text-zinc-400 border-white/5'
                    }`}>
                      {type.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className={`font-syne font-bold text-lg leading-snug transition-colors ${
                      isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'
                    }`}>
                      {type.label}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 font-light leading-relaxed">
                      {type.desc}
                    </p>
                  </div>

                  {/* Deliverables Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {type.deliverables.map((item, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900/90 border border-white/5 font-mono text-[9px] text-zinc-300">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Turnaround & Action */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase">TIMELINE:</div>
                    <div className="text-zinc-300 font-medium text-[11px]">{type.turnaround}</div>
                  </div>

                  <div className="flex items-center gap-1.5 font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                    <span>{isSelected ? 'SELECTED' : 'SELECT SCOPE'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────────────────────
          FEATURE 4: THE DIRECT TRANSMISSION TERMINAL & CHANNELS (MAIN HUB)
          ───────────────────────────────────────────────────────────────────────────── */}
      <div id="inquiry-terminal" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-32">
        
        {/* Left Column (5 cols): Direct Communication Channels & Roadmap */}
        <div className="lg:col-span-5 space-y-6">

          {/* Direct Communication Channels Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan-400 uppercase tracking-widest mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>DIRECT FREQUENCY</span>
              </div>
              <h3 className="font-syne font-bold text-xl sm:text-2xl text-white">
                Direct Communication
              </h3>
              <p className="mt-2 text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                Whether you need end-to-end video direction, high-retention viral editing, or an executive lead for your studio, my inbox is monitored daily.
              </p>
            </div>

            {/* Direct Email with One-Click Copy */}
            <div className="space-y-3 font-mono text-xs">
              <div 
                onClick={handleCopyEmail}
                className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-cyan-500/40 text-zinc-200 hover:text-cyan-300 transition-all cursor-pointer group"
                title="Click to copy direct email address"
              >
                <div className="flex items-center gap-3 truncate">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{settings?.adminEmail || 'theritiksoni@gmail.com'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400 uppercase shrink-0 font-bold">
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'COPIED' : 'COPY'}</span>
                </div>
              </div>

              {/* Live Studio Availability Card */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 uppercase tracking-wider text-[10px]">PRODUCTION STATUS:</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {availability?.status || 'BOOKING Q2 / Q3 2026'}
                  </span>
                </div>
                {availability?.subtext && (
                  <p className="text-zinc-300 text-[10px] font-sans font-light leading-relaxed">
                    {availability.subtext}
                  </p>
                )}
                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400">STUDIO CAPACITY:</span>
                  <span className="text-cyan-300 font-bold">75% BOOKED (2 SLOTS LEFT)</span>
                </div>
              </div>
            </div>

            {/* Social Network Directory */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase block">
                {"// VERIFIED NETWORKS & CHANNELS"}
              </span>
              <div className="grid grid-cols-2 gap-2.5 font-mono text-xs">
                <a
                  href="https://youtube.com/@theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-red-500/40 text-zinc-300 hover:text-red-400 transition-colors group"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white group-hover:text-red-300">YouTube</div>
                    <div className="text-[9px] text-zinc-500 font-light truncate">Video Essays</div>
                  </div>
                </a>

                <a
                  href="https://instagram.com/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-pink-500/40 text-zinc-300 hover:text-pink-400 transition-colors group"
                >
                  <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white group-hover:text-pink-300">Instagram</div>
                    <div className="text-[9px] text-zinc-500 font-light truncate">50M+ Reach</div>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-sky-500/40 text-zinc-300 hover:text-sky-400 transition-colors group"
                >
                  <LinkedInIcon className="w-4 h-4 text-sky-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white group-hover:text-sky-300">LinkedIn</div>
                    <div className="text-[9px] text-zinc-500 font-light truncate">Executive Network</div>
                  </div>
                </a>

                <a
                  href="https://x.com/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-900/60 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors group"
                >
                  <XTwitterIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-white group-hover:text-cyan-200">X (Twitter)</div>
                    <div className="text-[9px] text-zinc-500 font-light truncate">Creator Feed</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Resume Link in Card */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => sound.playHover()}
                className="w-full py-3.5 rounded-xl bg-zinc-900/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-mono text-xs font-bold tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center justify-center gap-2 group"
              >
                <FileText className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>ACCESS RESUME & CV DOSSIER</span>
              </button>
            </div>

          </div>

          {/* Production Roadmap ("What Happens After Transmission") */}
          <div className="p-6 sm:p-7 rounded-3xl bg-zinc-950 border border-white/10 space-y-4">
            <div className="inline-flex items-center gap-2 font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              <span>COMMISSION ROADMAP // WHAT HAPPENS NEXT</span>
            </div>
            <h4 className="font-syne font-bold text-lg text-white">
              From Inquiry to Master Cut
            </h4>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  01
                </div>
                <div>
                  <div className="font-semibold text-white">TRANSMISSION INTAKE</div>
                  <div className="text-[10px] text-zinc-400 font-sans font-light mt-0.5">
                    Your brief arrives directly in Ritik's priority terminal. Reviewed and verified within 24 hours.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  02
                </div>
                <div>
                  <div className="font-semibold text-white">CREATIVE TREATMENT & PROPOSAL</div>
                  <div className="text-[10px] text-zinc-400 font-sans font-light mt-0.5">
                    We align on narrative pacing, visual moodboard, milestone schedule, and commercial deliverables.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                <div className="w-6 h-6 rounded-md bg-cyan-500 text-black flex items-center justify-center font-bold text-[10px] shrink-0">
                  03
                </div>
                <div>
                  <div className="font-semibold text-white">PRODUCTION ROLLOUT & 4K DELIVERY</div>
                  <div className="text-[10px] text-zinc-400 font-sans font-light mt-0.5">
                    Real-time Frame.io timeline reviews, sound design mastering, and ProRes 422 HQ archive delivery.
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (7 cols): Interactive Sci-Fi Message Terminal */}
        <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl space-y-6">

          {/* Terminal Window Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5 font-mono text-xs text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              <MessageSquare className="w-4 h-4" />
              <span className="font-semibold">TERMINAL // TRANSMIT PROJECT INQUIRY</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ENCRYPTED 256-BIT</span>
            </span>
          </div>

          {/* One-Click Quick Inspiration Starters */}
          <div className="space-y-2">
            <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
              QUICK PROMPT PRESETS:
            </div>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.slice(0, 4).map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleSelectProjectType(preset.value, preset.suggestedPrompt)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 font-mono text-[11px] transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{preset.badge}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Honeypot anti-spam trap (hidden from users) */}
            <div className="hidden" aria-hidden="true" style={{ display: 'none', position: 'absolute', left: '-9999px' }}>
              <label htmlFor="company_website_verification">Leave this empty</label>
              <input
                type="text"
                id="company_website_verification"
                name="company_website_verification"
                value={botTrap}
                onChange={(e) => setBotTrap(e.target.value)}
                tabIndex="-1"
                autoComplete="off"
              />
            </div>

            {/* Name Input */}
            <div>
              <label htmlFor="Name" className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                YOUR NAME / BRAND
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                required
                maxLength={100}
                value={formData.Name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan / Commercial Director"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-cyan-500/70 focus:bg-zinc-900 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                DIRECT EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                maxLength={150}
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-cyan-500/70 focus:bg-zinc-900 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Project Scope Custom Decorated Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label htmlFor="projectType" className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>PROJECT SCOPE / INQUIRY TYPE</span>
                <span className="text-[10px] text-cyan-400/80 font-mono tracking-widest">[ SELECT SCENE ]</span>
              </label>

              {/* Custom Dropdown Trigger Button */}
              <button
                type="button"
                id="projectType"
                onClick={() => {
                  sound.playClick();
                  setIsDropdownOpen(!isDropdownOpen);
                }}
                onMouseEnter={() => sound.playHover()}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border text-left text-base sm:text-sm font-mono text-white flex items-center justify-between transition-all duration-300 focus:outline-none ${
                  isDropdownOpen
                    ? 'border-cyan-400/80 bg-zinc-900 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                    : 'border-white/10 hover:border-cyan-500/40 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    {React.createElement(selectedProjectTypeObj.icon, { className: 'w-4 h-4' })}
                  </div>
                  <div className="truncate">
                    <div className="text-white font-medium truncate">{selectedProjectTypeObj.label}</div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate">{selectedProjectTypeObj.desc}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="hidden sm:inline-block text-[9px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
                    {selectedProjectTypeObj.badge}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                      isDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Hidden Input for Standard Form Submission */}
              <input type="hidden" name="projectType" value={formData.projectType} />

              {/* Floating Dropdown Options */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 right-0 mt-2 z-40 max-h-72 overflow-y-auto bg-[#090b10]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(56,189,248,0.2)] space-y-1 animate-fadeIn"
                >
                  <div className="text-[9px] font-mono text-cyan-400/80 px-3 pt-1 pb-1 tracking-widest uppercase flex items-center justify-between border-b border-white/5 mb-1">
                    <span>{"// SELECT PRODUCTION CATEGORY"}</span>
                    <span>6 OPTIONS</span>
                  </div>

                  {PROJECT_TYPES.map((type) => {
                    const isSelected = formData.projectType === type.value;
                    const IconComp = type.icon;
                    return (
                      <div
                        key={type.value}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectProjectType(type.value, type.suggestedPrompt)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectProjectType(type.value, type.suggestedPrompt);
                          }
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between group transition-all duration-200 outline-none ${
                          isSelected
                            ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-300'
                            : 'hover:bg-zinc-800/80 text-zinc-300 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-zinc-800 text-zinc-400 group-hover:text-cyan-400'
                            }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className={`text-xs font-mono font-semibold truncate transition-colors ${
                              isSelected ? 'text-cyan-300' : 'text-zinc-200 group-hover:text-white'
                            }`}>
                              {type.label}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate hidden sm:block">
                              {type.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                            isSelected
                              ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/40'
                              : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                          }`}>
                            {type.badge}
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-cyan-400 animate-fadeIn" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Estimated Budget / Scale Selector */}
            <div>
              <label className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-2">
                ESTIMATED BUDGET / ENGAGEMENT SCALE
              </label>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setFormData((prev) => ({ ...prev, budget: opt }));
                    }}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
                      formData.budget === opt
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs text-zinc-400">
                <label htmlFor="Message" className="uppercase tracking-wider">
                  PROJECT VISION & SPECIFICATIONS
                </label>
                <span className="text-[10px] text-zinc-500">
                  {formData.Message.length} / 3000 CHARS
                </span>
              </div>
              <textarea
                id="Message"
                name="Message"
                rows="5"
                required
                maxLength={3000}
                value={formData.Message}
                onChange={handleChange}
                placeholder="Describe your timeline, target audience, aesthetic benchmarks, raw footage formats, or role expectations..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-cyan-500/70 focus:bg-zinc-900 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Status Alert Message */}
            {status.state !== 'idle' && (
              <div
                className={`p-4 rounded-xl font-mono text-xs flex items-center gap-2.5 transition-all ${
                  status.state === 'success'
                    ? 'bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 shadow-[0_0_25px_rgba(56,189,248,0.25)]'
                    : status.state === 'sending'
                      ? 'bg-zinc-900 border border-white/10 text-zinc-300'
                      : 'bg-red-950/60 border border-red-500/40 text-red-300'
                }`}
              >
                {status.state === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : status.state === 'sending' ? (
                  <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 animate-spin" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <span className="font-bold text-xs sm:text-sm">{status.message}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                onMouseEnter={() => sound.playHover()}
                disabled={status.state === 'sending'}
                className="flex-1 py-4 px-6 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>TRANSMIT INQUIRY</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                onMouseEnter={() => sound.playHover()}
                className="py-4 px-4 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-mono text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </div>

          </form>

        </div>

      </div>


      {/* ─────────────────────────────────────────────────────────────────────────────
          FEATURE 5: PRODUCTION FAQ & COLLABORATION GUIDELINES
          ───────────────────────────────────────────────────────────────────────────── */}
      <div id="production-faq" className="relative scroll-mt-32">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] text-cyan-400 tracking-widest uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>PRODUCTION PROTOCOLS // COLLABORATION INTELLIGENCE</span>
            </div>
            <h2 className="font-syne font-bold text-2xl sm:text-3xl text-white tracking-tight uppercase mt-1">
              FREQUENTLY ASKED <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">QUESTIONS</span>
            </h2>
          </div>
          <p className="font-mono text-xs text-zinc-400 max-w-md">
            Clear guidelines on turnaround timelines, remote review pipelines, raw asset transfer, and master deliverable formats.
          </p>
        </div>

        {/* Expandable Accordion Grid */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl bg-zinc-950/80 border border-white/10 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setOpenFaqIdx(isOpen ? null : idx);
                  }}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-cyan-400 text-xs font-bold">
                      {`0${idx + 1} //`}
                    </span>
                    <span className="font-syne font-bold text-base sm:text-lg text-white">
                      {item.question}
                    </span>
                  </div>

                  <div className={`w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-cyan-400 border-cyan-500/40' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 text-sm text-zinc-300 font-light leading-relaxed border-t border-white/5 pt-4 animate-fadeIn">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};

export default ContactSection;
