import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Database, 
  Eye, 
  Cookie, 
  Server, 
  Mail, 
  Copy, 
  Check, 
  FileText,
  Clock
} from 'lucide-react';
import sound from '../utils/SoundEngine';

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    sound.playClick();
    navigator.clipboard.writeText('theritiksoni@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleBack = () => {
    sound.playLensClick();
    navigate(-1);
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 cinematic-page-enter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header Meta */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <button
            onClick={handleBack}
            onMouseEnter={() => sound.playHover()}
            data-cursor="BACK"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO PREVIOUS SCENE</span>
          </button>

          <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>EFFECTIVE: MARCH 2026</span>
            </span>
            <span>VERSION 1.0</span>
          </div>
        </div>

        {/* Title Header */}
        <div className="space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>LEGAL PROTOCOL // DATA GOVERNANCE & PRIVACY</span>
          </div>
          
          <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">POLICY</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            Transparency, data minimization, and respectful visitor privacy. This document outlines how your data is collected, processed, and safeguarded across <span className="text-cyan-300 font-mono">ritiksoni.in</span> and associated creative production services.
          </p>
        </div>

        {/* Core Policy Clauses Grid */}
        <div className="space-y-8 font-sans">

          {/* Section 1: Data Controller */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                1. Data Controller & Studio Identification
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                The data controller responsible for the processing of your personal data on this website is:
              </p>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 font-mono text-xs text-zinc-300 space-y-1">
                <div><strong className="text-cyan-300">Entity:</strong> Ritik Soni (Independent Creator & Commercial Director)</div>
                <div><strong className="text-cyan-300">Location:</strong> Pune, Maharashtra, India (Coordinates: 18.5204° N, 73.8567° E)</div>
                <div><strong className="text-cyan-300">Primary Contact:</strong> theritiksoni@gmail.com</div>
                <div><strong className="text-cyan-300">Portfolio URL:</strong> https://www.ritiksoni.in/</div>
              </div>
            </div>
          </div>

          {/* Section 2: Data Collected */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                2. Information We Collect
              </h2>
            </div>
            <div className="space-y-4 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                We adhere to strict data minimization principles. We only collect information that you explicitly choose to transmit or that is strictly necessary for web delivery:
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-cyan-400">
                <li>
                  <strong className="text-white">Direct Inquiries & Project Transmissions:</strong> When you submit a commission inquiry through our contact terminal, we collect your name, email address, selected production scope, and message details.
                </li>
                <li>
                  <strong className="text-white">Technical Telemetry & Web Vitals:</strong> Performance data such as page load duration, WebGL canvas initialization status, browser type, and general geographic location (country/city level, non-PII) to ensure smooth 60fps rendering across devices.
                </li>
                <li>
                  <strong className="text-white">Client-Side Preferences:</strong> Anonymous session preferences stored locally on your device (e.g., audio engine mute state, volume, cookie consent status).
                </li>
              </ul>
            </div>
          </div>

          {/* Section 3: Telemetry & Analytics */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                3. Privacy-First Analytics (No Ad Tracking)
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                This portfolio uses <strong className="text-white">Vercel Analytics</strong> and <strong className="text-white">Vercel Speed Insights</strong> to monitor Core Web Vitals, device viewport sizes, and aggregate traffic patterns.
              </p>
              <p>
                Unlike traditional tracking suites, this telemetry is privacy-focused:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-400">
                <li>No cross-site tracking or advertising profile construction.</li>
                <li>No third-party advertising cookies or behavioural retargeting.</li>
                <li>IP addresses are anonymized and never correlated to personal identity.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Cookies & Local Storage */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Cookie className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                4. Cookies & Local Storage Usage
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                We do not use tracking or advertising cookies. We utilize browser <code className="text-cyan-300 font-mono text-xs bg-black/60 px-1.5 py-0.5 rounded">localStorage</code> strictly for functional purposes:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="text-cyan-300 font-semibold mb-1">ritik_cookie_consent</div>
                  <div className="text-zinc-400 text-[11px] font-sans">Stores whether you acknowledged the privacy & telemetry disclosure banner.</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-white/5">
                  <div className="text-cyan-300 font-semibold mb-1">ritik_sound_engine_pref</div>
                  <div className="text-zinc-400 text-[11px] font-sans">Remembers your audio soundtrack and sound-effects toggle preference.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Third-Party Processors */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Server className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                5. Third-Party Service Providers
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                To provide high-availability hosting and reliable inquiry delivery, we utilize the following trusted infrastructure partners:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-400">
                <li><strong className="text-white">Vercel Inc.:</strong> Global CDN distribution, edge serverless execution, and encrypted HTTPS routing.</li>
                <li><strong className="text-white">Web3Forms / FormSubmit:</strong> Encrypted relay services facilitating direct email delivery of contact form submissions to our studio inbox.</li>
                <li><strong className="text-white">Google Fonts & YouTube / Vimeo:</strong> Delivering typography assets and hosting commercial film streams with privacy-enhanced playback parameters.</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Data Retention & Security */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                6. Data Retention, Security & Your Rights
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                We do not sell, rent, monetize, or disclose your personal data to data brokers or marketers under any circumstance. Contact submissions are retained solely for the duration required to evaluate, communicate, and execute commercial film commissions.
              </p>
              <p>
                Under applicable data protection laws (including India's Digital Personal Data Protection Act and GDPR principles), you have the right to:
              </p>
              <ul className="list-disc pl-5 space-y-1 marker:text-cyan-400">
                <li>Request confirmation and a copy of any personal details held about you.</li>
                <li>Request immediate erasure or correction of your inquiry records.</li>
                <li>Withdraw consent to future communications at any time.</li>
              </ul>
            </div>
          </div>

          {/* Section 7: Contact Box */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-950/70 to-black border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-widest">
                  {"// PRIVACY COMMUNICATIONS TERMINAL"}
                </div>
                <h3 className="font-syne text-xl font-bold uppercase text-white">
                  HAVE A PRIVACY QUESTION OR DATA REQUEST?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-lg">
                  Direct all privacy inquiries, data modification requests, or removal notices to our studio lead.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleCopyEmail}
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="COPY"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'COPIED TO CLIPBOARD' : 'COPY EMAIL'}</span>
                </button>

                <a
                  href="mailto:theritiksoni@gmail.com"
                  onMouseEnter={() => sound.playHover()}
                  data-cursor="EMAIL"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-white/10 hover:border-cyan-500/40 text-zinc-200 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TRANSMIT MAIL</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Navigation Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-400">
          <Link
            to="/terms"
            onMouseEnter={() => sound.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIEW TERMS & CONDITIONS</span>
          </Link>

          <Link
            to="/"
            onMouseEnter={() => sound.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <span>RETURN TO MAIN PORTFOLIO</span>
            <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-cyan-400" />
          </Link>
        </div>

      </div>
    </div>
  );
}
