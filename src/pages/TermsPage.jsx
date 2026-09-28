import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Film, 
  Scale, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  Copy, 
  Check, 
  Clock, 
  Compass, 
  ShieldCheck 
} from 'lucide-react';
import sound from '../utils/SoundEngine';

export default function TermsPage() {
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
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span>OPERATIONAL CHARTER // LEGAL & ENGAGEMENT TERMS</span>
          </div>
          
          <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight">
            TERMS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">CONDITIONS</span>
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
            Please read these terms and conditions carefully before navigating this interactive portfolio or initiating commercial video production commissions with <span className="text-cyan-300 font-mono">Ritik Soni Creative Studios</span>.
          </p>
        </div>

        {/* Core Terms Clauses Grid */}
        <div className="space-y-8 font-sans">

          {/* Section 1: Agreement to Terms */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                1. Acceptance of Terms
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                By accessing, browsing, or utilizing any features of <strong className="text-white">ritiksoni.in</strong> (the "Website"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
              </p>
              <p>
                If you do not agree with any part of these terms, you should discontinue use of the Website immediately.
              </p>
            </div>
          </div>

          {/* Section 2: Intellectual Property */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Film className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                2. Intellectual Property & Commercial Rights
              </h2>
            </div>
            <div className="space-y-4 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                All creative content and software assets hosted on this Website—including but not limited to commercial video showreels, high-retention vertical cuts, visual storyboards, motion graphics, audio scores, WebGL 3D shaders, and graphic design assets—are the exclusive intellectual property of <strong className="text-white">Ritik Soni</strong> or respective brand clients who have licensed their showcase on this portfolio.
              </p>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2 text-xs">
                <div className="text-cyan-300 font-mono font-semibold uppercase tracking-wider">Permitted Usage:</div>
                <p className="text-zinc-300">
                  You are granted a limited, non-exclusive, non-transferable license to view and interact with the Website strictly for personal, evaluating, or client commissioning purposes.
                </p>
                <div className="text-red-400 font-mono font-semibold uppercase tracking-wider pt-1">Restricted Usage:</div>
                <p className="text-zinc-400">
                  Republishing, redistributing, scraping, screen-recording for unauthorized re-upload, deep-linking, or claiming ownership of any creative film assets without express written consent from Ritik Soni is strictly prohibited and protected under copyright law.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Commercial Engagements */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                3. Commissioning & Commercial Agreements
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                Submitting a project transmission via the Contact Terminal does not constitute a legally binding production retainer until formal written agreement and milestone terms are confirmed.
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-400">
                <li><strong className="text-white">Scoping & Estimates:</strong> Project quotes, schedules, and deliverables are tailored to project complexity, shooting requirements, and post-production scopes.</li>
                <li><strong className="text-white">Deliverable Standards:</strong> Commercial master deliverables are conformed in broadcast Rec.709 / ACES color spaces, calibrated LUFS loudness mixes, and multi-format aspect ratios (16:9, 9:16, 1:1).</li>
                <li><strong className="text-white">Revisions & Approvals:</strong> Standard production contracts include designated feedback review cycles prior to master ProRes export delivery.</li>
              </ul>
            </div>
          </div>

          {/* Section 4: Interactive WebGL & Audio Engine */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                4. Interactive WebGL & Audio Notice
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                This Website delivers an interactive 3D WebGL cinematic experience paired with a real-time Web Audio synthesizer and soundtrack engine.
              </p>
              <p>
                Audio playback is user-controllable at all times via the HUD sound toggle. If your device or browser does not support hardware-accelerated WebGL rendering, the application will automatically engage fallback modes without disrupting navigation.
              </p>
            </div>
          </div>

          {/* Section 5: Acceptable Use */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                5. Prohibited Conduct
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                When using the Website, you agree that you will not:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-cyan-400">
                <li>Submit fraudulent, defamatory, obscene, or automated spam inquiries through the communication terminal.</li>
                <li>Attempt to bypass, reverse engineer, or decompile client-side scripts, shaders, or administrative control routes.</li>
                <li>Use automated bots, spiders, or scrapers to harvest email addresses or media assets without permission.</li>
                <li>Introduce malicious payloads, viruses, or code intended to damage, overload, or disrupt server infrastructure.</li>
              </ul>
            </div>
          </div>

          {/* Section 6: Limitation of Liability */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                6. Disclaimer & Limitation of Liability
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                This Website and its contents are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.
              </p>
              <p>
                In no event shall Ritik Soni or affiliated production partners be liable for any direct, indirect, incidental, or consequential damages resulting from your access to, or inability to access, this Website or reliance on information presented herein.
              </p>
            </div>
          </div>

          {/* Section 7: Governing Law */}
          <div className="rounded-2xl bg-zinc-950/70 border border-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="font-syne font-bold text-lg sm:text-xl text-white uppercase tracking-wide">
                7. Governing Law & Jurisdiction
              </h2>
            </div>
            <div className="space-y-3 text-zinc-300 text-sm font-light leading-relaxed">
              <p>
                These Terms and Conditions and any dispute or claim arising out of or related to this Website shall be governed by and construed in accordance with the laws of <strong className="text-white">India</strong>.
              </p>
              <p>
                Any legal suit, action, or proceeding arising out of these terms shall be instituted exclusively in the competent courts located in <strong className="text-white">Pune, Maharashtra, India</strong>.
              </p>
            </div>
          </div>

          {/* Section 8: Inquiries Box */}
          <div className="rounded-2xl bg-gradient-to-br from-cyan-950/40 via-zinc-950/70 to-black border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] text-cyan-400 uppercase tracking-widest">
                  {"// LEGAL & COMMERCIAL QUESTIONS"}
                </div>
                <h3 className="font-syne text-xl font-bold uppercase text-white">
                  QUESTIONS REGARDING TERMS OR PRODUCTION RIGHTS?
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light max-w-lg">
                  Reach out directly for commercial licensing, collaborative agreements, or legal clarifications.
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
            to="/privacy"
            onMouseEnter={() => sound.playHover()}
            className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>VIEW PRIVACY POLICY</span>
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
