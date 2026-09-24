import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Download, Mail, Globe, Phone, Check, Copy, Sparkles, Send, Award, Briefcase, GraduationCap, ArrowRight, ArrowLeft, Sun, Moon, Printer, X } from 'lucide-react';
import sound from '../utils/SoundEngine';
import usePortfolioData from '../utils/usePortfolioData';

const ResumePage = ({ onOpenResume }) => {
  const navigate = useNavigate();
  const { experience: liveExperiences, settings, availability } = usePortfolioData();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAts, setCopiedAts] = useState(false);
  const [showAtsView, setShowAtsView] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to clean authentic white A4 sheet like PDF

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('printing-resume');
      const meta = document.querySelector('meta[name="color-scheme"]');
      if (meta) meta.setAttribute('content', 'dark');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handleDownload = () => {
    sound.playClick();
    document.body.classList.add('printing-resume');
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute('content', 'light');
    window.print();
  };


  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('theritiksoni@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleCopyAtsText = () => {
    sound.playClick();
    const atsString = `RITIK SONI
Social Media Executive | Video Production Lead | Content Creator | Digital Strategist
Phone: +91 7007864962 | Email: theritiksoni@gmail.com | Location: Open for Full-Time & Remote
Website: www.ritiksoni.in | Channels: instagram.com/theritiksoni | instagram.com/thesameerap

PROFESSIONAL SUMMARY:
Creative and results-driven Social Media Executive, Video Production Lead, and Content Creator with hands-on experience in high-retention content creation, personal branding, and organic audience growth across Instagram, YouTube, and LinkedIn. Skilled in short-form video production, content psychology, 3-second hook writing, and platform strategy. Proven ability to direct end-to-end post-production pipelines, manage corporate social channels (Vishwa Vinayak Group, Yukio Co-Living), deliver polished promotional edits for premier brands (Arentech, Reliance, Red Bull), and build loyal engaged communities that drive real business outcomes.

CORE SKILLS & COMPETENCIES:
- Platforms: Instagram, LinkedIn, YouTube, Pinterest, Twitter/X, Meta Business Suite, YouTube Studio
- Software & NLE Tools: Adobe Premiere Pro (Advanced Multicam, Dynamic Trim, Lumetri Color), Adobe After Effects (Motion VFX, Kinetic Typography), DaVinci Resolve, Canva
- Content & Production: Short-Form Vertical Video (9:16), Cinematic Storytelling, Hook Writing, Scripting, Filming, Foley & Sound Design
- Strategy & Growth: Content Psychology, Audience Retention Diagnostics, Trend Adaptation, Editorial Content Calendars, Engagement Optimization
- Soft Skills: Creative Direction, Cross-Functional Communication, Platform Expertise, Brand Storytelling

WORK EXPERIENCE:
Content Creator (Contract) | Yukio Co-Living (Feb 2026 — May 2026)
- Produced engaging short-form videos using creative storytelling to boost audience retention and drive resident inquiries.
- Delivered conversion-focused, experience-driven content aligned with Yukio's brand identity to attract potential residents.
- Managed end-to-end content production — ideation, scripting, filming, and editing — for consistent brand output.

Video Production Executive & Social Media Lead | Vishwa Vinayak Group (2023 — Present)
- Directing end-to-end video production workflows for corporate communications and marketing campaigns.
- Managing brand social media channels across Instagram, LinkedIn, and YouTube with structured editorial calendars.
- Editing high-retention vertical reels, corporate showcases, and executive keynotes.
- Analyzing retention curves and drop-off metrics to iteratively scale organic engagement.

Instagram Content Creator & Personal Brand Builder | Self-Employed / Freelance (2022 — Present) | Pune, Maharashtra
- Built and scaled personal brand channels (@theritiksoni & @thesameerap) through high-impact short-form content on psychology, self-improvement, and cinematic storytelling.
- Produced scroll-stopping videos using strong hooks, storytelling structures, and audience retention techniques to maintain a loyal niche audience.
- Secured paid content creation contracts (including Yukio Co-Living) based purely on organic content quality and reach.

Lead Video Editor & Content Specialist (Selected Client Engagements) | (2022 — Present)
- Arentech Projects: Edited corporate tech showcase films highlighting infrastructure and technological innovation with custom kinetic typography.
- Reliance Related Projects: Synchronized and cut multi-camera live footage from corporate conferences and leadership sessions with fast turnaround.
- Red Bull Event Content: Crafted high-octane action cuts with speed ramping and layered Foley sound design.

KEY ACHIEVEMENTS:
- @theritiksoni: Grew personal Instagram page with niche content on psychology and self-improvement.
- @thesameerap: Scaled a second Instagram page, demonstrating ability to build and manage distinct brand identities.
- Brand Contracts: Secured a paid content creation contract with Yukio Co-Living and executed commercial edits for Arentech, Reliance, and Red Bull based purely on organic content quality and reach.

EDUCATION:
Bachelor of Computer Applications (BCA) | 2020 — 2023
ITM University | Score: 78%`;

    navigator.clipboard.writeText(atsString);
    setCopiedAts(true);
    setTimeout(() => setCopiedAts(false), 2200);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header */}
      <div className="max-w-[210mm] mx-auto px-4 sm:px-6 mb-6 no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 07 // OFFICIAL DOSSIER • A4 CURRICULUM VITAE</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
              OFFICIAL{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
                RESUME
              </span>
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
              Standard A4 Curriculum Vitae with full platform strategy, creative editing, and brand campaign records.
            </p>
          </div>
        </div>
      </div>

      {/* Optimized Floating Sticky Action Controls Bar */}
      <div className="max-w-[210mm] mx-auto px-4 sm:px-6 mb-6 sticky top-20 sm:top-24 z-30 no-print select-none">
        <header className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.6)] flex items-center justify-between gap-2 sm:gap-3">
          
          {/* Left: Identity & Back Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-shrink">
            <button
              type="button"
              onClick={() => {
                sound.playLensClick();
                navigate(-1);
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="BACK"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 font-mono text-[11px] transition-all flex-shrink-0"
              title="Go back"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">BACK</span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
              <div className="relative flex items-center justify-center w-2 h-2 sm:w-2.5 sm:h-2.5 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-cyan-500" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-white truncate">
                <span className="font-bold tracking-wider hidden lg:inline">RITIK SONI</span>
                <span className="text-zinc-500 hidden lg:inline">•</span>
                <span className="text-cyan-400 font-semibold tracking-wider text-[11px] sm:text-xs">A4 RESUME</span>
              </div>
            </div>
          </div>

          {/* Right: High-Utility Segmented Button Console */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* View & Theme Segmented Pill */}
            <div className="flex items-center p-0.5 rounded-xl bg-zinc-900 border border-white/10 flex-shrink-0">
              {/* Document View Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowAtsView(false);
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="DOC"
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all duration-200 ${
                  !showAtsView
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="View formatted A4 document"
              >
                A4
              </button>

              {/* ATS Plain Text Toggle */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowAtsView(true);
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="ATS"
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold transition-all duration-200 ${
                  showAtsView
                    ? 'bg-cyan-500 text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="View ATS plain-text format"
              >
                ATS
              </button>

              {/* Subtle Divider */}
              <div className="w-[1px] h-3.5 bg-white/10 mx-0.5 sm:mx-1" />

              {/* Paper Theme Toggle (Light / Dark) */}
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setIsDarkMode(!isDarkMode);
                }}
                onMouseEnter={() => sound.playHover()}
                data-cursor="THEME"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all duration-200"
                title={isDarkMode ? 'Switch to Light A4 Paper' : 'Switch to Dark A4 Paper'}
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </button>
            </div>

            {/* Contextual ATS Copy Button (Shown when in ATS view) */}
            {showAtsView && (
              <button
                type="button"
                onClick={handleCopyAtsText}
                onMouseEnter={() => sound.playHover()}
                data-cursor="COPY"
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-mono text-[10px] sm:text-[11px] font-medium transition-all duration-200 hover:border-cyan-500/40 flex-shrink-0"
              >
                {copiedAts ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-zinc-400" />
                    <span className="hidden sm:inline">COPY</span>
                  </>
                )}
              </button>
            )}

            {/* Quick Copy Email Action (When in A4 view on large screens) */}
            {!showAtsView && (
              <button
                type="button"
                onClick={handleCopyEmail}
                onMouseEnter={() => sound.playHover()}
                data-cursor="COPY EMAIL"
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 hover:border-white/20 font-mono text-[11px] font-medium transition-all duration-200 active:scale-95 flex-shrink-0"
                title="Copy theritiksoni@gmail.com to clipboard"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-zinc-400" />
                    <span>COPY EMAIL</span>
                  </>
                )}
              </button>
            )}

            {/* Print / Save as PDF Action Button (Desktop/Tablet) */}
            <button
              type="button"
              onClick={handleDownload}
              onMouseEnter={() => sound.playHover()}
              data-cursor="PRINT"
              className="hidden sm:inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/10 hover:border-white/20 font-mono text-[10px] sm:text-[11px] font-medium transition-all duration-200 active:scale-95 flex-shrink-0"
              title="Print or Save as PDF via browser"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-400" />
              <span>PRINT</span>
            </button>

            {/* Primary Action Button: Direct PDF Download */}
            <a
              href="/Ritik_Soni_Resume.pdf"
              download="Ritik_Soni_Resume.pdf"
              data-cursor="DOWNLOAD"
              onClick={() => sound.playClick()}
              onMouseEnter={() => sound.playHover()}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-black font-mono text-[10px] sm:text-[11px] font-bold tracking-wide shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all duration-200 active:scale-95 flex-shrink-0"
              title="Download official PDF file directly"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>PDF</span>
              <span className="hidden sm:inline">DOWNLOAD</span>
            </a>

            {/* Exit/Close Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                navigate('/');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="CLOSE"
              aria-label="Exit resume"
              className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-900 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 transition-all duration-200 active:scale-95 flex-shrink-0 ml-0.5"
              title="Exit to home"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        </header>
      </div>

      {/* A4 Size Resume Document: Naturally Scrollable on Page */}
      <div className="max-w-[210mm] mx-auto px-2 sm:px-6">
        <div
          className={`w-full min-h-[297mm] p-4 sm:p-10 md:p-12 transition-colors duration-300 ${
            isDarkMode
              ? 'bg-zinc-950 text-zinc-200 border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.95)]'
              : 'bg-white text-zinc-900 border border-zinc-200 shadow-[0_25px_70px_rgba(0,0,0,0.45)]'
          } rounded-xl sm:rounded-2xl space-y-6 sm:space-y-8 select-text`}
          id="printable-resume"
        >
          {showAtsView ? (
            /* Plain-Text ATS Mode View */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-white/10">
                <div className={`font-mono text-xs ${isDarkMode ? 'text-cyan-400' : 'text-sky-700 font-bold'}`}>
                  {"// ATS OPTIMIZED PLAIN-TEXT FORMAT"}
                </div>
                <button
                  onClick={handleCopyAtsText}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 text-black font-mono text-xs font-bold hover:bg-cyan-400"
                >
                  {copiedAts ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAts ? 'COPIED TO CLIPBOARD' : 'COPY ALL TEXT'}</span>
                </button>
              </div>
              <pre className={`p-4 sm:p-6 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed select-text overflow-x-auto ${
                isDarkMode ? 'bg-zinc-900/90 text-zinc-300 border border-white/10' : 'bg-zinc-50 text-zinc-800 border border-zinc-200'
              }`}>
{`RITIK SONI
Social Media Executive | Video Production Lead | Content Creator | Digital Strategist
Phone: +91 7007864962 | Email: theritiksoni@gmail.com | Location: Open for Full-Time & Remote
Website: www.ritiksoni.in | Channels: instagram.com/theritiksoni | instagram.com/thesameerap

PROFESSIONAL SUMMARY:
Creative and results-driven Social Media Executive, Video Production Lead, and Content Creator with hands-on experience in high-retention content creation, personal branding, and organic audience growth across Instagram, YouTube, and LinkedIn. Skilled in short-form video production, content psychology, 3-second hook writing, and platform strategy. Proven ability to direct end-to-end post-production pipelines, manage corporate social channels (Vishwa Vinayak Group, Yukio Co-Living), deliver polished promotional edits for premier brands (Arentech, Reliance, Red Bull), and build loyal engaged communities that drive real business outcomes.

CORE SKILLS & COMPETENCIES:
- Platforms: Instagram, LinkedIn, YouTube, Pinterest, Twitter/X, Meta Business Suite, YouTube Studio
- Software & NLE Tools: Adobe Premiere Pro (Advanced Multicam, Dynamic Trim, Lumetri Color), Adobe After Effects (Motion VFX, Kinetic Typography), DaVinci Resolve, Canva
- Content & Production: Short-Form Vertical Video (9:16), Cinematic Storytelling, Hook Writing, Scripting, Filming, Foley & Sound Design
- Strategy & Growth: Content Psychology, Audience Retention Diagnostics, Trend Adaptation, Editorial Content Calendars, Engagement Optimization
- Soft Skills: Creative Direction, Cross-Functional Communication, Platform Expertise, Brand Storytelling

WORK EXPERIENCE:
Content Creator (Contract) | Yukio Co-Living (Feb 2026 — May 2026)
- Produced engaging short-form videos using creative storytelling to boost audience retention and drive resident inquiries.
- Delivered conversion-focused, experience-driven content aligned with Yukio's brand identity to attract potential residents.
- Managed end-to-end content production — ideation, scripting, filming, and editing — for consistent brand output.

Video Production Executive & Social Media Lead | Vishwa Vinayak Group (2023 — Present)
- Directing end-to-end video production workflows for corporate communications and marketing campaigns.
- Managing brand social media channels across Instagram, LinkedIn, and YouTube with structured editorial calendars.
- Editing high-retention vertical reels, corporate showcases, and executive keynotes.
- Analyzing retention curves and drop-off metrics to iteratively scale organic engagement.

Instagram Content Creator & Personal Brand Builder | Self-Employed / Freelance (2022 — Present) | Pune, Maharashtra
- Built and scaled personal brand channels (@theritiksoni & @thesameerap) through high-impact short-form content on psychology, self-improvement, and cinematic storytelling.
- Produced scroll-stopping videos using strong hooks, storytelling structures, and audience retention techniques to maintain a loyal niche audience.
- Secured paid content creation contracts (including Yukio Co-Living) based purely on organic content quality and reach.

Lead Video Editor & Content Specialist (Selected Client Engagements) | (2022 — Present)
- Arentech Projects: Edited corporate tech showcase films highlighting infrastructure and technological innovation with custom kinetic typography.
- Reliance Related Projects: Synchronized and cut multi-camera live footage from corporate conferences and leadership sessions with fast turnaround.
- Red Bull Event Content: Crafted high-octane action cuts with speed ramping and layered Foley sound design.

KEY ACHIEVEMENTS:
- @theritiksoni: Grew personal Instagram page with niche content on psychology and self-improvement.
- @thesameerap: Scaled a second Instagram page, demonstrating ability to build and manage distinct brand identities.
- Brand Contracts: Secured a paid content creation contract with Yukio Co-Living and executed commercial edits for Arentech, Reliance, and Red Bull based purely on organic content quality and reach.

EDUCATION:
Bachelor of Computer Applications (BCA) | 2020 — 2023
ITM University | Score: 78%`}
              </pre>
            </div>
          ) : (
            /* Rich A4 Document View */
            <>
              {/* Resume Header */}
              <div className={`border-b pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-6 ${
                isDarkMode ? 'border-white/10' : 'border-zinc-200'
              }`}>
                <div className="min-w-0 flex-1">
                  <h2 className={`font-syne font-extrabold text-3xl sm:text-4xl tracking-tight uppercase ${
                    isDarkMode ? 'text-white' : 'text-zinc-950'
                  }`}>
                    {settings?.name?.toUpperCase() || 'RITIK SONI'}
                  </h2>
                  <p className={`font-mono text-xs sm:text-sm font-semibold tracking-wider mt-1.5 ${
                    isDarkMode ? 'text-cyan-400' : 'text-sky-700'
                  }`}>
                    {settings?.title || 'Social Media Executive • Video Production Lead • Digital Strategist'}
                  </p>
                </div>

                <div className={`font-mono text-xs space-y-1.5 sm:text-right flex-shrink-0 ${
                  isDarkMode ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  <div className="flex items-center sm:justify-end gap-2 whitespace-nowrap">
                    <Globe className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-sky-700'}`} />
                    <a
                      href={settings?.website ? (settings.website.startsWith('http') ? settings.website : `https://${settings.website}`) : 'https://www.ritiksoni.in'}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline font-semibold"
                    >
                      {settings?.website || 'www.ritiksoni.in'}
                    </a>
                  </div>
                  <div className="flex items-center sm:justify-end gap-2 whitespace-nowrap">
                    <Mail className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-sky-700'}`} />
                    <a
                      href={`mailto:${settings?.email || 'theritiksoni@gmail.com'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopyEmail();
                      }}
                      className="hover:underline text-left sm:text-right"
                      title="Click to copy email"
                    >
                      {settings?.email || 'theritiksoni@gmail.com'}
                    </a>
                    {copiedEmail && (
                      <span className="text-[10px] text-emerald-500 font-bold no-print">COPIED!</span>
                    )}
                  </div>
                  <div className="flex items-center sm:justify-end gap-2 whitespace-nowrap">
                    <Phone className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-sky-700'}`} />
                    <a href={`tel:${settings?.phone || '+917007864962'}`} className="hover:underline">
                      {settings?.phone || '+91 7007864962'}
                    </a>
                  </div>
                  <div className="flex items-center sm:justify-end whitespace-nowrap pt-0.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] font-medium tracking-wide ${
                      isDarkMode
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {availability?.status || 'Open for Full-Time & Remote'}
                    </span>
                  </div>
                  <div className={`flex items-center sm:justify-end gap-2 pt-0.5 text-[11px] whitespace-nowrap ${
                    isDarkMode ? 'text-cyan-300' : 'text-sky-700'
                  }`}>
                    <a
                      href="https://instagram.com/theritiksoni"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      @theritiksoni
                    </a>
                    <span className={isDarkMode ? 'text-zinc-600' : 'text-zinc-400'}>•</span>
                    <a
                      href="https://instagram.com/thesameerap"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:underline"
                    >
                      @thesameerap
                    </a>
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="resume-section-block">
                <h3 className={`font-mono text-xs uppercase tracking-widest font-bold mb-2 flex items-center gap-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-sky-800'
                }`}>
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{"PROFESSIONAL SUMMARY"}</span>
                </h3>
                <p className={`text-xs sm:text-[13px] leading-relaxed font-light ${
                  isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  Creative and results-driven <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Social Media Executive</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Video Production Lead</strong>, and <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Content Creator</strong> with hands-on experience in high-retention content creation, personal branding, and <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>organic audience growth</strong> across <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Instagram, YouTube, and LinkedIn</strong>. Skilled in <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>short-form vertical video (9:16)</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>content psychology</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>3-second hook writing</strong>, and <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>platform strategy</strong>. Proven ability to grow engaged communities from scratch, direct <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>end-to-end post-production pipelines</strong> for brands including <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Yukio Co-Living</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Vishwa Vinayak Group</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Arentech</strong>, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Reliance</strong>, and <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Red Bull</strong>, and deliver <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>conversion-focused content</strong> that drives real business outcomes.
                </p>
              </div>

              {/* Skills Section (Clean 4-column A4 grid) */}
              <div className="resume-section-block">
                <h3 className={`font-mono text-xs uppercase tracking-widest font-bold mb-2.5 flex items-center gap-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-sky-800'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{"SKILLS & PLATFORM EXPERTISE"}</span>
                </h3>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs p-3.5 rounded-xl border ${
                  isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50/80 border-zinc-200'
                }`}>
                  <div>
                    <div className={`font-bold mb-1 ${isDarkMode ? 'text-cyan-300' : 'text-sky-900'}`}>PLATFORMS</div>
                    <div className={`space-y-0.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <div>• Instagram / Reels</div>
                      <div>• LinkedIn</div>
                      <div>• YouTube / Shorts</div>
                      <div>• Meta Business Suite</div>
                      <div>• Pinterest, Twitter/X</div>
                    </div>
                  </div>
                  <div>
                    <div className={`font-bold mb-1 ${isDarkMode ? 'text-cyan-300' : 'text-sky-900'}`}>TOOLS</div>
                    <div className={`space-y-0.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <div>• Adobe Premiere Pro</div>
                      <div>• Adobe After Effects</div>
                      <div>• DaVinci Resolve</div>
                      <div>• Canva</div>
                      <div>• YouTube Studio</div>
                    </div>
                  </div>
                  <div>
                    <div className={`font-bold mb-1 ${isDarkMode ? 'text-cyan-300' : 'text-sky-900'}`}>CONTENT</div>
                    <div className={`space-y-0.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <div>• Short-Form Video (9:16)</div>
                      <div>• Hook Writing (3s Rule)</div>
                      <div>• Brand Storytelling</div>
                      <div>• Content Calendars</div>
                      <div>• End-to-End Production</div>
                    </div>
                  </div>
                  <div>
                    <div className={`font-bold mb-1 ${isDarkMode ? 'text-cyan-300' : 'text-sky-900'}`}>STRATEGY</div>
                    <div className={`space-y-0.5 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      <div>• Content Psychology</div>
                      <div>• Audience Retention</div>
                      <div>• Trend Adaptation</div>
                      <div>• Engagement Growth</div>
                      <div>• Brand Positioning</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-5">
                <h3 className={`font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-sky-800'
                }`}>
                  <Award className="w-3.5 h-3.5" />
                  <span>{"WORK EXPERIENCE"}</span>
                </h3>

                {/* Dynamic Work Experience */}
                {liveExperiences && liveExperiences.length > 0 ? (
                  liveExperiences.map((exp, idx) => {
                    const points = (exp.highlights && exp.highlights.length > 0)
                      ? exp.highlights
                      : ((exp.responsibilities && exp.responsibilities.length > 0)
                          ? exp.responsibilities
                          : (exp.points || []));
                    const period = exp.timelinePosition || exp.period || exp.durationLabel || '';
                    const badge = exp.badge || exp.employmentType || '';
                    const colorStyles = [
                      { borderDark: 'border-emerald-400', borderLight: 'border-emerald-600', textDark: 'text-emerald-400', textLight: 'text-emerald-700' },
                      { borderDark: 'border-cyan-400', borderLight: 'border-sky-600', textDark: 'text-cyan-400', textLight: 'text-sky-700' },
                      { borderDark: 'border-purple-400', borderLight: 'border-purple-600', textDark: 'text-purple-300', textLight: 'text-purple-700' },
                      { borderDark: 'border-amber-400', borderLight: 'border-amber-600', textDark: 'text-amber-300', textLight: 'text-amber-700' },
                    ];
                    const theme = colorStyles[idx % colorStyles.length];

                    return (
                      <div
                        key={exp.id || idx}
                        className={`resume-job-block space-y-1.5 border-l-2 pl-4 py-0.5 ${
                          isDarkMode ? theme.borderDark : theme.borderLight
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <div className={`font-syne font-bold text-sm sm:text-base ${
                            isDarkMode ? 'text-white' : 'text-zinc-950'
                          }`}>
                            {exp.role}
                          </div>
                          <div className={`font-mono text-xs font-semibold whitespace-nowrap flex-shrink-0 uppercase ${
                            isDarkMode ? theme.textDark : theme.textLight
                          }`}>
                            {period}
                          </div>
                        </div>
                        <div className={`font-mono text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                          {exp.company} {badge ? `• ${badge}` : ''}
                        </div>
                        {points && points.length > 0 && (
                          <ul className={`list-disc list-inside text-xs sm:text-[13px] space-y-1 font-light leading-relaxed ${
                            isDarkMode ? 'text-zinc-300' : 'text-zinc-700'
                          }`}>
                            {points.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-zinc-500 font-mono py-2">
                    No verified milestones registered yet.
                  </div>
                )}
              </div>

              {/* Key Achievements */}
              <div className="resume-section-block">
                <h3 className={`font-mono text-xs uppercase tracking-widest font-bold mb-2.5 flex items-center gap-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-sky-800'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{"KEY ACHIEVEMENTS"}</span>
                </h3>
                <div className={`p-4 rounded-xl border space-y-2 text-xs sm:text-[13px] ${
                  isDarkMode ? 'bg-zinc-900/50 border-white/5 text-zinc-300' : 'bg-zinc-50/80 border-zinc-200 text-zinc-700'
                }`}>
                  <div>• <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>@theritiksoni:</strong> Grew personal Instagram page with niche, <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>high-retention content</strong> centered on psychology and self-improvement.</div>
                  <div>• <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>@thesameerap:</strong> Scaled a second Instagram page, demonstrating ability to <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>build and manage distinct brand identities</strong>.</div>
                  <div>• <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Brand Contracts:</strong> Secured paid content creation contracts (<strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Yukio Co-Living</strong>) and delivered commercial edits for <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>Arentech, Reliance, and Red Bull</strong> based purely on <strong className={`font-semibold ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>organic content quality and reach</strong>.</div>
                </div>
              </div>

              {/* Education */}
              <div className="resume-section-block">
                <h3 className={`font-mono text-xs uppercase tracking-widest font-bold mb-2.5 flex items-center gap-2 ${
                  isDarkMode ? 'text-cyan-400' : 'text-sky-800'
                }`}>
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{"EDUCATION"}</span>
                </h3>
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs ${
                  isDarkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-50/80 border-zinc-200'
                }`}>
                  <div>
                    <div className={`font-syne font-bold text-sm ${isDarkMode ? 'text-white' : 'text-zinc-950'}`}>
                      Bachelor of Computer Applications (BCA)
                    </div>
                    <div className={`${isDarkMode ? 'text-cyan-400' : 'text-sky-700 font-semibold'}`}>
                      ITM University
                    </div>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <div className={isDarkMode ? 'text-zinc-300' : 'text-zinc-800 font-semibold'}>Score: 78%</div>
                    <div className={isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}>2020 — 2023</div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className={`mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 no-print ${
                isDarkMode ? 'border-white/10 text-zinc-400' : 'border-zinc-200 text-zinc-600'
              }`}>
                <div className="text-xs font-mono">
                  <span>DOCUMENT VERIFIED • RITIK SONI</span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                  {/* Copy Email Button */}
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    data-cursor="COPY"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Mail className="w-3.5 h-3.5 text-sky-600" />}
                    <span>{copiedEmail ? 'COPIED!' : 'COPY EMAIL'}</span>
                  </button>

                  {/* Print / Save as PDF Button */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    data-cursor="PRINT"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all duration-200 ${
                      isDarkMode
                        ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-white/10'
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                    }`}
                  >
                    <Printer className="w-3.5 h-3.5 text-zinc-500" />
                    <span>PRINT / PDF</span>
                  </button>

                  {/* Direct PDF Download Link */}
                  <a
                    href="/Ritik_Soni_Resume.pdf"
                    download="Ritik_Soni_Resume.pdf"
                    data-cursor="DOWNLOAD"
                    onClick={() => sound.playClick()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs shadow-[0_0_15px_rgba(56,189,248,0.3)] transition-all duration-200 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>DOWNLOAD PDF</span>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Next Step: Cue to Contact / Work */}
      <div className="max-w-[210mm] mx-auto px-4 sm:px-6 mt-14 text-center no-print">
        <div className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 sm:p-12 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-mono text-cyan-400 tracking-widest uppercase mb-1">
              CONNECT WITH RITIK
            </div>
            <h3 className="font-syne text-2xl sm:text-3xl font-bold uppercase text-white">
              NEED STRATEGIC CONTENT & PRODUCTION?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-light mt-1">
              Transmit your production brief directly to Ritik's terminal.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/work');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="WORK"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/10 font-mono text-xs tracking-wider uppercase transition-all"
            >
              <span>INSPECT WORK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                sound.playLensClick();
                navigate('/contact');
              }}
              onMouseEnter={() => sound.playHover()}
              data-cursor="CONTACT"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105"
            >
              <span>LAUNCH BRIEF TERMINAL</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
