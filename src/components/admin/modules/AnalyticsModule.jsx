import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Clock, 
  Globe, 
  Sparkles
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function AnalyticsModule() {
  const [data, setData] = useState(adminStore.getData());
  const [timeRange, setTimeRange] = useState('30D');

  useEffect(() => {
    const handleUpdate = () => setData(adminStore.getData());
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const { analytics, overview } = data;

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Audience & SMM Retention Telemetry</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Aggregated video performance, organic virality curves, and conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-white/10 text-xs font-mono">
          {['7D', '30D', '90D', 'ALL TIME'].map((range) => (
            <button
              key={range}
              onClick={() => {
                sound.playHover();
                setTimeRange(range);
              }}
              className={`px-3 py-1 rounded-lg tracking-wider transition-colors ${
                timeRange === range
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">Gross Video Views</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-white">
            {analytics.totalReelViews}
          </div>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+24.6% vs previous cycle</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">Avg 3-Sec Retention</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-cyan-300">
            {analytics.avgRetentionRate}
          </div>
          <div className="text-[10px] font-mono text-zinc-400">
            Industry Benchmark: 55%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">Watch Time Hours</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-sky-300">
            {analytics.watchTimeHours}
          </div>
          <div className="text-[10px] font-mono text-zinc-400">
            High Audience Immersion
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/70 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="font-mono text-[11px] uppercase tracking-wider">Lead Conversion</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-bold text-amber-300">
            {overview.leadConversionRate}
          </div>
          <div className="text-[10px] font-mono text-amber-400/80">
            Inquiry to Contract Rate
          </div>
        </div>
      </div>

      {/* Chart Simulation & Geo Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Performance Growth (Col Span 8) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-syne font-bold text-base text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Monthly Views & Deliverables Trajectory</span>
            </h3>
            <span className="font-mono text-xs text-zinc-500">
              Oct 2025 – Present
            </span>
          </div>

          <div className="pt-8 pb-4 flex items-end justify-between gap-4 h-64 border-b border-white/10">
            {analytics.monthlyViewsHistory.map((m, idx) => {
              const heightPercent = ((idx + 1) / analytics.monthlyViewsHistory.length) * 80 + 20;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {m.views}
                  </span>
                  <div className="w-full max-w-[48px] bg-zinc-900 rounded-t-lg overflow-hidden flex flex-col justify-end h-44 border border-white/5">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-950 via-cyan-500 to-sky-400 rounded-t-lg transition-all duration-700 group-hover:brightness-125"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="font-mono text-[11px] text-zinc-400 font-bold">
                    {m.month}
                  </span>
                  <span className="font-mono text-[9px] text-zinc-600">
                    {m.reels} Cuts
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>Aggregated Reach Across Portfolio Works</span>
            <span className="text-emerald-400 font-bold">+247% 6-Month Compounding</span>
          </div>
        </div>

        {/* Audience Geography Breakdown (Col Span 4) */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
          <h3 className="font-syne font-bold text-base text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Audience Demographics</span>
          </h3>

          <div className="space-y-4 pt-2">
            {analytics.audienceGeo.map((geo) => (
              <div key={geo.region} className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-300">
                  <span className="truncate">{geo.region}</span>
                  <span className="font-mono text-cyan-400 font-bold">{geo.share}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${geo.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/5 p-3 rounded-xl bg-zinc-900/60 text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-white">Dominant Acquisition Channel</div>
            <div className="font-mono text-[11px] text-cyan-300">
              {analytics.topPerformingPlatform}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
