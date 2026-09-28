import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Droplets,
  Flame,
  Moon,
  Smile,
  Clock,
  Calendar,
  Trash2,
  Volume2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Reminder } from '../types/health';

interface RemindersViewProps {
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
  onDeleteReminder: (id: string) => void;
  onTriggerTestReminder: (reminder: Reminder) => void;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onToggleReminder,
  onAddReminder,
  onDeleteReminder,
  onTriggerTestReminder,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Reminder['category']>('water');
  const [time, setTime] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
  ]);
  const [note, setNote] = useState('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedDays.length === 0) return;

    onAddReminder({
      title: title.trim(),
      category,
      time,
      days: selectedDays,
      enabled: true,
      note: note.trim() || undefined,
    });

    setTitle('');
    setNote('');
    setIsAddOpen(false);
  };

  const getCategoryIcon = (cat: Reminder['category']) => {
    switch (cat) {
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case 'exercise':
        return <Flame className="w-5 h-5 text-emerald-600" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'checkin':
        return <Smile className="w-5 h-5 text-teal-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Gentle Wellness Cues</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Habit Reminders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Set peaceful nudges for hydration, movement, bedtime wind-down, and reflections.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </button>
      </div>

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className={`p-5 rounded-3xl border transition-all bg-white shadow-xs ${
              rem.enabled
                ? 'border-slate-200'
                : 'border-slate-100 bg-slate-50/50 opacity-75'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  {getCategoryIcon(rem.category)}
                </div>
                <div>
                  <h3
                    className={`text-base font-bold leading-tight ${
                      rem.enabled ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    {rem.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-teal-800">
                      <Clock className="w-3.5 h-3.5" />
                      {rem.time}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{rem.days.join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => onToggleReminder(rem.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  rem.enabled ? 'bg-teal-700' : 'bg-slate-200'
                }`}
                role="switch"
                aria-checked={rem.enabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    rem.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {rem.note && (
              <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                "{rem.note}"
              </p>
            )}

            {/* Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => onTriggerTestReminder(rem)}
                className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1.5 transition-colors"
                title="Simulate prompt right now"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Notification</span>
              </button>

              <button
                type="button"
                onClick={() => onDeleteReminder(rem.id)}
                className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                title="Remove reminder"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reminder Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-teal-600" />
                <span>Schedule New Reminder</span>
              </h2>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Reminder['category'])}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 bg-white"
                >
                  <option value="water">💧 Hydration (Drink Water)</option>
                  <option value="exercise">🏃 Exercise & Movement Reset</option>
                  <option value="sleep">🌙 Sleep & Wind-down</option>
                  <option value="checkin">✨ Daily Mindfulness & Check-in</option>
                  <option value="custom">🔔 Custom Wellness Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reminder Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Afternoon water refill"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time of Day
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Repeat Days
                </label>
                <div className="flex items-center justify-between gap-1">
                  {weekDays.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`w-9 h-9 rounded-xl text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-teal-700 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day[0]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gentle Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pause, breathe, and drink 300ml water."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
