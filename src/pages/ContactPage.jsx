import React from 'react';
import ContactSection from '../components/sections/ContactSection';
import { Send } from 'lucide-react';

const ContactPage = ({ onOpenResume }) => {
  return (
    <div className="pt-28 sm:pt-32 pb-20 cinematic-page-enter">
      {/* Dedicated Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] tracking-widest uppercase mb-3">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>SCENE 06 // PRODUCTION TERMINAL • DIRECT TRANSMISSION</span>
        </div>
        <h1 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase text-white tracking-tight">
          INITIATE{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">
            CONTACT
          </span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl font-light leading-relaxed">
          Commission a commercial campaign, request full-funnel social media direction, or inquire about full-time video executive roles. All messages transmit directly to Ritik's priority terminal.
        </p>
      </div>

      {/* Main Contact Section */}
      <ContactSection onOpenResume={onOpenResume} />
    </div>
  );
};

export default ContactPage;
