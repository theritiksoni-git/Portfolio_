import React, { useState, useEffect } from 'react';
import adminStore from '../../../services/adminStore';
import { 
  Calendar, 
  Clock, 
  Globe, 
  Save, 
  Check
} from 'lucide-react';
import sound from '../../../utils/SoundEngine';

export default function AvailabilityModule() {
  const [availability, setAvailability] = useState(adminStore.getModule('availability'));
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const handleUpdate = () => setAvailability(adminStore.getModule('availability'));
    window.addEventListener('control-room-updated', handleUpdate);
    return () => window.removeEventListener('control-room-updated', handleUpdate);
  }, []);

  const handleChange = (field, value) => {
    setAvailability((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    sound.playClick();
    adminStore.updateAvailability(availability);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-950/60 border border-white/10">
        <div>
          <h2 className="font-syne text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-cyan-400" />
            <span>Studio Availability & Capacity Management</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">
            Controls client booking status badges, project intake capacity, and auto-responder notes.
          </p>
        </div>

        {savedNotice && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4" />
            <span>Telemetry Synchronized!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
        {/* Left Column (Col Span 7): Main Status Config */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
          <h3 className="font-syne font-bold text-base text-white">
            Primary Availability Display
          </h3>

          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
              Main Availability Headline *
            </label>
            <input
              type="text"
              required
              value={availability.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono font-bold text-sm focus:outline-none focus:border-cyan-500"
              placeholder="BOOKING Q2 / Q3 2026"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
              Detailed Scope Subtext
            </label>
            <input
              type="text"
              value={availability.subtext}
              onChange={(e) => handleChange('subtext', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
              placeholder="Open for Commercial Directing, Flagship SMM Retainers & Executive Roles"
            />
          </div>

          {/* Production Capacity Slider */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                Current Studio Capacity: <span className="text-cyan-400 font-bold">{availability.capacityPercent}%</span>
              </label>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                availability.capacityPercent >= 90
                  ? 'bg-red-500/20 text-red-300'
                  : availability.capacityPercent >= 70
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {availability.capacityPercent >= 90 ? 'Near Maxed' : availability.capacityPercent >= 70 ? 'Moderate Booking' : 'Open Slots'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={availability.capacityPercent}
              onChange={(e) => handleChange('capacityPercent', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-400 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Next Open Production Slot
              </label>
              <input
                type="date"
                value={availability.nextOpenSlotDate}
                onChange={(e) => handleChange('nextOpenSlotDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                Weekly Available Hours
              </label>
              <input
                type="number"
                value={availability.weeklyHoursAvailable}
                onChange={(e) => handleChange('weeklyHoursAvailable', parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-mono text-[10px] uppercase tracking-wider mb-1">
              Studio Auto-Responder / Confirmation Notice
            </label>
            <textarea
              rows={3}
              value={availability.autoResponseNote}
              onChange={(e) => handleChange('autoResponseNote', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 resize-none font-sans"
              placeholder="Displayed on contact form upon transmission..."
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(56,189,248,0.4)]"
            >
              <Save className="w-4 h-4" />
              <span>Update Availability</span>
            </button>
          </div>
        </div>

        {/* Right Column (Col Span 5): Live Badge Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-4">
            <h3 className="font-syne font-bold text-base text-white">
              Public Portfolio Live Preview
            </h3>

            <div className="p-4 rounded-xl bg-black border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                  {availability.status}
                </span>
              </div>
              <p className="text-zinc-400 text-xs font-light">
                {availability.subtext}
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>SLOT: {availability.nextOpenSlotDate}</span>
                <span>{availability.capacityPercent}% CAPACITY</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Base Timezone: {availability.timezone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{availability.weeklyHoursAvailable} Dedicated Production Hours / Week</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
