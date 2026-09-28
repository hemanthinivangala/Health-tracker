import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Heart, Moon, Battery, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DailyCheckIn, MoodType, SleepQualityType } from '../types/health';
import { formatDateToIso } from '../utils/dateUtils';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (checkIn: DailyCheckIn) => void;
  currentCheckIn: DailyCheckIn;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentCheckIn,
}) => {
  const [mood, setMood] = useState<MoodType>(currentCheckIn.mood || 'good');
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(currentCheckIn.energyLevel || 4);
  const [sleepQuality, setSleepQuality] = useState<SleepQualityType>(currentCheckIn.sleepQuality || 'good');
  const [notes, setNotes] = useState<string>(currentCheckIn.notes || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: DailyCheckIn = {
      date: formatDateToIso(),
      completed: true,
      mood,
      energyLevel,
      sleepQuality,
      notes: notes.trim(),
      timestamp: new Date().toISOString(),
    };

    onSave(updated);

    // Gentle confetti celebration for mindful check-in
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#10b981', '#38bdf8'],
      });
    } catch {
      // confetti fallback
    }

    onClose();
  };

  const moodOptions: { id: MoodType; label: string; icon: string; desc: string }[] = [
    { id: 'great', label: 'Great', icon: '🌟', desc: 'Vibrant & positive' },
    { id: 'good', label: 'Good', icon: '🌿', desc: 'Balanced & calm' },
    { id: 'neutral', label: 'Neutral', icon: '☁️', desc: 'Steady & present' },
    { id: 'tired', label: 'Tired', icon: '🥱', desc: 'Need gentle pacing' },
    { id: 'stressed', label: 'Stressed', icon: '🌧️', desc: 'Taking it slow' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-100/70 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Daily Wellness Check-In
              </h2>
              <p className="text-xs text-slate-500">
                A 30-second moment to listen to your body and mind.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Mood selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-teal-600" />
              How are you feeling today?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {moodOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMood(opt.id)}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center gap-1 text-center ${
                    mood === opt.id
                      ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{opt.icon}</span>
                  <span className="text-xs leading-none">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Battery className="w-4 h-4 text-emerald-600" />
              Energy Level (1 = Low, 5 = Peak)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {([1, 2, 3, 4, 5] as const).map((lvl) => {
                const labels = ['Low', 'Gentle', 'Steady', 'Active', 'Peak'];
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyLevel(lvl)}
                    className={`py-3 px-2 rounded-2xl border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      energyLevel === lvl
                        ? 'bg-emerald-700 border-emerald-700 text-white font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base leading-none">{lvl}</span>
                    <span
                      className={`text-[10px] ${
                        energyLevel === lvl ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {labels[lvl - 1]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-600" />
              Last Night’s Sleep Quality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(
                [
                  { id: 'poor', label: 'Restless' },
                  { id: 'fair', label: 'Average' },
                  { id: 'good', label: 'Good' },
                  { id: 'excellent', label: 'Restorative' },
                ] as const
              ).map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSleepQuality(q.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    sleepQuality === q.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reflection note */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-600" />
              Reflection / Daily Intention
            </label>
            <textarea
              rows={3}
              placeholder="What made you feel good today? Or what gentle intention are you keeping in mind?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-2xl border border-slate-200 focus:outline-teal-600 placeholder:text-slate-400"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Check-in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
