import React from 'react';
import { Disc } from 'lucide-react';

const PhilosophySection = () => {
  return (
    <section className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center select-none">
      
      {/* Background Subtle Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 font-mono text-xs tracking-widest uppercase">
          <Disc className="w-3 h-3 text-cyan-400 animate-spin-slow" />
          <span>CREATIVE PHILOSOPHY</span>
        </div>

        <h2 className="font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase leading-tight">
          EVERY FRAME HAS A STORY. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            I LIKE FINDING IT.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
          Technology changes every year. Resolutions scale higher. But the emotional truth behind a sequence, a glance, and a cut remains timeless.
        </p>

      </div>

    </section>
  );
};

export default PhilosophySection;
