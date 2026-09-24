import React, { useState, useEffect, useRef } from 'react';
import { Mail, Send, RotateCcw, CheckCircle2, AlertCircle, Sparkles, MessageSquare, ChevronDown, Check, Film, Video, Tv, Layers, FileText } from 'lucide-react';
import sound from '../../utils/SoundEngine';
import adminStore from '../../services/adminStore';
import usePortfolioData from '../../utils/usePortfolioData';

// Define the types of projects that can be selected in the contact form.
// Each project type has a value, label, description, icon, and badge.
// This array is used to populate the dropdown menu in the contact form.
const PROJECT_TYPES = [
  {
    value: 'Full-Time Video Production Executive',
    label: 'Full-Time Video Production Executive',
    desc: 'Lead in-house video production, studio shoots & post-pipeline',
    icon: Film,
    badge: 'EXECUTIVE',
  },
  {
    value: 'Social Media Management & Growth Strategy',
    label: 'Social Media Management & Organic Growth Strategy',
    desc: '30-day content calendar, hook engineering, reels management & audience growth',
    icon: Sparkles,
    badge: 'SMM & GROWTH',
  },
  {
    value: 'Corporate Video / Client Production',
    label: 'Corporate Video / Brand Film Commission',
    desc: 'High-end commercial films, corporate documentary & brand storytelling',
    icon: Video,
    badge: 'COMMERCIAL',
  },
  {
    value: 'High-Retention Short-Form Reels',
    label: 'High-Retention Short-Form Reels Series',
    desc: 'Viral pacing, kinetic motion design & sound design for IG/TikTok',
    icon: Sparkles,
    badge: 'VIRAL REELS',
  },
  {
    value: 'YouTube Long-Form Storytelling',
    label: 'YouTube Long-Form / Documentary Editing',
    desc: 'Deep-dive documentaries, video essays & creator retention storylines',
    icon: Tv,
    badge: 'LONG-FORM',
  },
  {
    value: 'Creative Directing & Filmmaking',
    label: 'Creative Directing / Passion Project',
    desc: 'Cinematic visual direction, camera cinematography & color grading',
    icon: Layers,
    badge: 'CINEMATIC',
  },
];

// Crisp Inline Social Brand SVGs

// This component renders inline social brand SVGs.
// Each SVG represents a different social media platform.
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

const XTwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

// This component renders the contact section of the portfolio.
// It includes a form for users to submit their project inquiries and contact information.

const ContactSection = ({ onOpenResume }) => {
  const { settings, availability } = usePortfolioData();
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    projectType: 'Corporate Video / Client Production',
    Message: '',
  });

  const [status, setStatus] = useState({ state: 'idle', message: '' }); // idle, sending, success, error
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // This useEffect hook handles the dropdown menu functionality.
  // It adds event listeners for clicks outside the dropdown and key presses.

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

  const handleSelectProjectType = (val) => {
    sound.playClick();
    setFormData((prev) => ({ ...prev, projectType: val }));
    setIsDropdownOpen(false);
  };

  // Find the selected project type object from the PROJECT_TYPES array.
  // If no match is found, default to the second project type in the array.

  const selectedProjectTypeObj = PROJECT_TYPES.find((t) => t.value === formData.projectType) || PROJECT_TYPES[1];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // This function resets the form data and status.
  // It is called when the user clicks the reset button.

  const handleReset = () => {
    sound.playClick();
    setFormData({
      Name: '',
      email: '',
      projectType: 'Corporate Video / Client Production',
      Message: '',
    });
    setStatus({ state: 'idle', message: '' });
  };

  // This function handles the form submission.
  // It sends the form data to the server and updates the status accordingly.

  const handleSubmit = async (e) => {
    e.preventDefault();
    sound.playShutter();
    setStatus({ state: 'sending', message: 'TRANSMITTING INQUIRY...' });

    const submissionName = (formData.Name || '').trim();
    const submissionEmail = (formData.email || '').trim();
    const submissionProjectType = formData.projectType || 'Corporate Video / Client Production';
    const submissionMessage = (formData.Message || '').trim();
    const targetEmail = settings?.adminEmail || 'theritiksoni@gmail.com';

    // 1. Immediately record lead in central admin control room store
    try {
      adminStore.addLead({
        name: submissionName,
        email: submissionEmail,
        projectType: submissionProjectType,
        message: submissionMessage,
        status: 'NEW',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.warn('Failed to log lead in store:', err);
    }

    let emailDispatched = false;

    // 2. Direct online delivery via Web3Forms (if access key provided in Admin Settings)
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

    // 3. Direct online delivery via FormSubmit AJAX service
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
            name: submissionName,
            email: submissionEmail,
            project_scope: submissionProjectType,
            message: `[Project Scope: ${submissionProjectType}]\n\n${submissionMessage}`,
            _subject: `🎬 New Portfolio Inquiry from ${submissionName} [${submissionProjectType}]`,
            _captcha: 'false',
            _template: 'table',
            _url: typeof window !== 'undefined' ? window.location.href : '',
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

    // 4. Local / Cloud server backend delivery fallback
    try {
      const backendUrl = settings?.backendApiUrl || 'http://localhost:3001';
      await fetch(`${backendUrl}/submitFormData`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: submissionName,
          email: submissionEmail,
          projectType: submissionProjectType,
          Message: submissionMessage,
          targetEmail: targetEmail,
        }),
      });
    } catch (err) {
      // Local server offline, expected in frontend-only environments
    }

    // 5. Present clean user alert: email is sent or not
    if (emailDispatched) {
      setFormData({
        Name: '',
        email: '',
        projectType: 'Corporate Video / Client Production',
        Message: '',
      });
      setStatus({
        state: 'success',
        message: isActivationPending
          ? 'INQUIRY LOGGED! OWNER SETUP: PLEASE CHECK YOUR EMAIL AND CLICK "ACTIVATE FORM" FOR THIS DOMAIN.'
          : 'INQUIRY SENT SUCCESSFULLY! THANK YOU FOR REACHING OUT, I WILL GET BACK TO YOU SHORTLY.',
      });
    } else {
      setStatus({
        state: 'error',
        message: 'COULD NOT TRANSMIT INQUIRY. PLEASE CHECK YOUR CONNECTION OR TRY AGAIN.',
      });
    }
  };

  // This function renders the contact section component.
  // It includes the section header, direct contact information, and the interactive message terminal.

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-widest uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FINAL SCENE // GET IN TOUCH</span>
        </div>
        <h2 className="font-syne font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-tight">
          HAVE A STORY TO TELL? <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            LET'S MAKE SOMETHING WORTH WATCHING.
          </span>
        </h2>
        <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light">
          Available for full-time executive production roles, corporate video commissions, and high-impact freelance creative projects.
        </p>
      </div>

      {/* Main Grid: Contact Terminal & Direct Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left: Direct Contact Information (5 cols) */}
        <div className="lg:col-span-5 space-y-6">

          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-white/10 shadow-2xl space-y-6">
            <h3 className="font-syne font-bold text-xl text-white">
              Direct Communication
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
              Whether you need end-to-end video production, high-retention social edits, or a creative lead for your next film, my inbox is open.
            </p>

            <div className="space-y-4 font-mono text-xs">
              <a
                href={`mailto:${settings?.adminEmail || 'theritiksoni@gmail.com'}`}
                onMouseEnter={() => sound.playHover()}
                data-cursor="VIEW"
                className="flex items-center gap-3 p-3.5 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-cyan-500/40 hover:text-cyan-300 text-zinc-200 transition-colors"
              >
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{settings?.adminEmail || 'theritiksoni@gmail.com'}</span>
              </a>

              {/* Live Studio Availability Badge */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 uppercase tracking-wider text-[10px]">PRODUCTION STATUS:</span>
                  <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {availability?.status || 'BOOKING Q2 / Q3 2026'}
                  </span>
                </div>
                {availability?.subtext && (
                  <p className="text-zinc-400 text-[10px] font-sans font-light leading-relaxed">{availability.subtext}</p>
                )}
              </div>
            </div>

            {/* Social Network Directory */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <span className="font-mono text-[11px] text-zinc-400 tracking-wider uppercase block">
                {"// PROFESSIONAL NETWORKS & SOCIALS"}
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <a
                  href="https://linkedin.com/in/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="VIEW"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://instagram.com/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="VIEW"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://twitter.com/theritiksoni"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="VIEW"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
                >
                  <XTwitterIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>X (Twitter)</span>
                </a>

                <a
                  href="https://facebook.com/ritik.soni.338211"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="VIEW"
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-300 transition-colors"
                >
                  <FacebookIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Facebook</span>
                </a>
              </div>
            </div>

            {/* Quick Resume Link in Card */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenResume();
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="VIEW"
                className="w-full py-3 rounded-xl bg-zinc-900/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 font-mono text-xs font-bold tracking-wider transition-all duration-200 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] flex items-center justify-center gap-2 group"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>ACCESS RESUME & CV DOSSIER</span>
              </button>
            </div>

          </div>

        </div>

        {/* Right: Interactive Message Terminal (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-zinc-950 border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl">

          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <MessageSquare className="w-4 h-4" />
              <span>TERMINAL // TRANSMIT PROJECT INQUIRY</span>
            </div>
            <span className="font-mono text-[10px] text-zinc-400">
              ENCRYPTED 256-BIT
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

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
                value={formData.Name}
                onChange={handleChange}
                placeholder="e.g. Alex Morgan / Media Director"
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-cyan-500/70 focus:bg-zinc-900 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
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
                data-cursor="SELECT"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                className={`w-full px-4 py-3 rounded-xl bg-zinc-900/90 border text-left text-base sm:text-sm font-mono text-white flex items-center justify-between transition-all duration-300 focus:outline-none ${isDropdownOpen
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
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                  />
                </div>
              </button>

              {/* Hidden Input for Standard Form Submission & Accessibility */}
              <input type="hidden" name="projectType" value={formData.projectType} />

              {/* Decorated Floating Glass Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  role="listbox"
                  className="absolute top-full left-0 right-0 mt-2 z-40 max-h-72 overflow-y-auto bg-[#090b10]/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(56,189,248,0.2)] space-y-1 animate-fadeIn"
                >
                  <div className="text-[9px] font-mono text-cyan-400/80 px-3 pt-1 pb-1 tracking-widest uppercase flex items-center justify-between border-b border-white/5 mb-1">
                    <span>{"// SELECT PRODUCTION CATEGORY"}</span>
                    <span>5 OPTIONS</span>
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
                        onClick={() => handleSelectProjectType(type.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectProjectType(type.value);
                          }
                        }}
                        onMouseEnter={() => sound.playHover()}
                        className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between group transition-all duration-200 outline-none ${isSelected
                            ? 'bg-cyan-950/50 border border-cyan-500/50 text-cyan-300'
                            : 'hover:bg-zinc-800/80 text-zinc-300 border border-transparent'
                          }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${isSelected
                                ? 'bg-cyan-500/20 text-cyan-300'
                                : 'bg-zinc-800 text-zinc-400 group-hover:text-cyan-400'
                              }`}
                          >
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div
                              className={`text-xs font-mono font-semibold truncate transition-colors ${isSelected ? 'text-cyan-300' : 'text-zinc-200 group-hover:text-white'
                                }`}
                            >
                              {type.label}
                            </div>
                            <div className="text-[10px] text-zinc-400 font-mono truncate hidden sm:block">
                              {type.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[8px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${isSelected
                                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/40'
                                : 'bg-zinc-900/80 text-zinc-400 border border-white/5'
                              }`}
                          >
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

            {/* Message Textarea */}
            <div>
              <label htmlFor="Message" className="block font-mono text-xs text-zinc-400 uppercase tracking-wider mb-1.5">
                PROJECT VISION & DETAILS
              </label>
              <textarea
                id="Message"
                name="Message"
                rows="4"
                required
                value={formData.Message}
                onChange={handleChange}
                placeholder="Describe timeline, target audience, aesthetic goals, or role expectations..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-900/90 border border-white/10 focus:border-cyan-500/70 focus:bg-zinc-900 text-base sm:text-sm font-mono text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
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
                data-cursor="EXPLORE"
                onMouseEnter={() => sound.playHover()}
                disabled={status.state === 'sending'}
                className="flex-1 py-3.5 px-6 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>TRANSMIT INQUIRY</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                data-cursor="VIEW"
                onMouseEnter={() => sound.playHover()}
                className="py-3.5 px-4 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors font-mono text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};

export default ContactSection;
