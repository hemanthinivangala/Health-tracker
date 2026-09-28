import React, { useState } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Flame,
  Trash2,
  Droplets,
  Moon,
  Activity,
  HeartPulse,
  Sparkles,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Goal, HealthMetricType } from '../types/health';

interface GoalsViewProps {
  goals: Goal[];
  onToggleGoal: (goalId: string) => void;
  onUpdateGoalProgress: (goalId: string, amount: number) => void;
  onAddGoal: (newGoal: Omit<Goal, 'id' | 'currentValue' | 'streakDays' | 'completedToday'>) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const GoalsView: React.FC<GoalsViewProps> = ({
  goals,
  onToggleGoal,
  onUpdateGoalProgress,
  onAddGoal,
  onDeleteGoal,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMetric, setNewMetric] = useState<HealthMetricType>('water');
  const [newTarget, setNewTarget] = useState('2400');
  const [newUnit, setNewUnit] = useState('ml');
  const [newFrequency, setNewFrequency] = useState<'daily' | 'weekly'>('daily');

  const metricPresets: Record<
    HealthMetricType,
    { defaultTarget: string; defaultUnit: string; label: string }
  > = {
    water: { defaultTarget: '2400', defaultUnit: 'ml', label: 'Hydration' },
    steps: { defaultTarget: '8500', defaultUnit: 'steps', label: 'Daily Steps' },
    sleep: { defaultTarget: '7.5', defaultUnit: 'hrs', label: 'Sleep Rest' },
    exercise: { defaultTarget: '30', defaultUnit: 'min', label: 'Exercise Duration' },
    heartRate: { defaultTarget: '70', defaultUnit: 'bpm', label: 'Resting Heart Rate' },
    bloodPressure: { defaultTarget: '120', defaultUnit: 'mmHg', label: 'Blood Pressure Target' },
    weight: { defaultTarget: '68', defaultUnit: 'kg', label: 'Target Weight' },
    height: { defaultTarget: '175', defaultUnit: 'cm', label: 'Height' },
  };

  const handleMetricChange = (metric: HealthMetricType) => {
    setNewMetric(metric);
    const preset = metricPresets[metric];
    if (preset) {
      setNewTarget(preset.defaultTarget);
      setNewUnit(preset.defaultUnit);
      if (!newTitle) {
        setNewTitle(`Maintain ${preset.label}`);
      }
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddGoal({
      title: newTitle.trim(),
      metric: newMetric,
      targetValue: parseFloat(newTarget) || 100,
      unit: newUnit,
      frequency: newFrequency,
    });

    setNewTitle('');
    setIsAddModalOpen(false);

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#0d9488', '#10b981'],
      });
    } catch {
      // fallback
    }
  };

  const getMetricIcon = (metric: HealthMetricType) => {
    switch (metric) {
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-600" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-600" />;
      case 'steps':
        return <Activity className="w-5 h-5 text-teal-600" />;
      case 'exercise':
        return <Flame className="w-5 h-5 text-emerald-600" />;
      case 'heartRate':
        return <HeartPulse className="w-5 h-5 text-rose-600" />;
      default:
        return <Target className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Target className="w-4 h-4" />
            <span>Habits & Commitments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Personal Health Goals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Build sustainable habits at your own pace without pressure or competition.
          </p>
        </div>

        <button
          onClick={() => {
            handleMetricChange('water');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {goals.map((goal) => {
          const isDone = goal.completedToday;
          const ratio = goal.currentValue / goal.targetValue;
          const pct = Math.min(100, Math.round(ratio * 100));

          return (
            <div
              key={goal.id}
              className={`bg-white border rounded-3xl p-5 sm:p-6 transition-all shadow-xs ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                    {getMetricIcon(goal.metric)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="capitalize">{goal.frequency} target</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-teal-800 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        {goal.streakDays} day streak
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition-colors"
                  title="Delete goal"
                  aria-label={`Delete ${goal.title}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Numbers and Bar */}
              <div className="mt-5 space-y-2">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Today’s Progress:{' '}
                    <strong className="text-slate-900 tabular-nums">
                      {goal.currentValue.toLocaleString()}
                    </strong>{' '}
                    / {goal.targetValue.toLocaleString()} {goal.unit}
                  </span>
                  <span className={`font-bold tabular-nums ${isDone ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {pct}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      isDone ? 'bg-emerald-600' : 'bg-teal-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Quick actions at bottom */}
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onToggleGoal(goal.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? 'Goal Completed Today' : 'Mark Completed'}</span>
                </button>

                {/* Quick Add delta */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      onUpdateGoalProgress(
                        goal.id,
                        goal.metric === 'water'
                          ? 250
                          : goal.metric === 'steps'
                          ? 500
                          : goal.metric === 'exercise'
                          ? 15
                          : 1
                      )
                    }
                    className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-colors"
                  >
                    +{' '}
                    {goal.metric === 'water'
                      ? '250ml'
                      : goal.metric === 'steps'
                      ? '500'
                      : goal.metric === 'exercise'
                      ? '15m'
                      : '1'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Create New Wellness Goal</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Metric
                </label>
                <select
                  value={newMetric}
                  onChange={(e) => handleMetricChange(e.target.value as HealthMetricType)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 bg-white"
                >
                  <option value="water">Hydration (Water Intake)</option>
                  <option value="steps">Movement (Daily Steps)</option>
                  <option value="sleep">Rest (Sleep Duration)</option>
                  <option value="exercise">Activity (Exercise Minutes)</option>
                  <option value="heartRate">Heart Rate (Resting bpm)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drink 8 glasses of water"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="2400"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="ml, steps, hrs"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cadence
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setNewFrequency('daily')}
                    className={`py-2 rounded-xl border font-semibold ${
                      newFrequency === 'daily'
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Daily Goal
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewFrequency('weekly')}
                    className={`py-2 rounded-xl border font-semibold ${
                      newFrequency === 'weekly'
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    Weekly Total
                  </button>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
