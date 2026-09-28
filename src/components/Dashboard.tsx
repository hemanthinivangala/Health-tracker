import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  HeartPulse,
  Flame,
  CheckCircle2,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Smile,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  HealthLogEntry,
  Goal,
  DailyCheckIn,
  UserProfile,
  ActiveTab,
} from '../types/health';
import { formatFullHeaderDate, formatFriendlyDate, calculateBmi } from '../utils/dateUtils';
import { calculateWellnessScore } from '../utils/wellnessScore';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

interface DashboardProps {
  logs: HealthLogEntry[];
  goals: Goal[];
  profile: UserProfile;
  todayCheckIn: DailyCheckIn;
  onOpenAddModal: () => void;
  onOpenCheckIn: () => void;
  onQuickAddWater: () => void;
  onQuickAddSteps: (amount: number) => void;
  onQuickAddExercise: (minutes: number) => void;
  onToggleGoal: (goalId: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  logs,
  goals,
  profile,
  todayCheckIn,
  onOpenAddModal,
  onOpenCheckIn,
  onQuickAddWater,
  onQuickAddSteps,
  onQuickAddExercise,
  onToggleGoal,
  setActiveTab,
}) => {
  const [selectedChartMetric, setSelectedChartMetric] = useState<
    'steps' | 'water' | 'sleep' | 'exercise' | 'heartRate'
  >('steps');

  // Most recent log (today or last entry)
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((l) => l.date === todayDateStr) || logs[logs.length - 1];

  // Calculate non-clinical wellness score
  const wellnessData = calculateWellnessScore(todayLog, goals, todayCheckIn);

  // Past 7 logs for the weekly trend chart
  const last7Logs = logs.slice(-7);

  // BMI helper
  const bmiInfo = calculateBmi(
    todayLog?.weight ?? profile.weight,
    todayLog?.height ?? profile.height
  );

  // Quick greetings
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 18
      ? 'Good afternoon'
      : 'Good evening';

  // SVG Chart calculation for last 7 days
  const metricConfigs = {
    steps: {
      label: 'Steps',
      unit: 'steps',
      color: '#0d9488', // teal-600
      bgGrad: '#ccfbf1',
      target: profile.dailyStepGoal,
      getValue: (l: HealthLogEntry) => l.steps ?? 0,
      formatVal: (val: number) => val.toLocaleString(),
    },
    water: {
      label: 'Hydration',
      unit: 'ml',
      color: '#0284c7', // sky-600
      bgGrad: '#e0f2fe',
      target: profile.dailyWaterGoal,
      getValue: (l: HealthLogEntry) => l.waterIntake ?? 0,
      formatVal: (val: number) => `${val.toLocaleString()} ml`,
    },
    sleep: {
      label: 'Sleep Duration',
      unit: 'hrs',
      color: '#6366f1', // indigo-500
      bgGrad: '#e0e7ff',
      target: profile.dailySleepGoal,
      getValue: (l: HealthLogEntry) => l.sleepDuration ?? 0,
      formatVal: (val: number) => `${val} hrs`,
    },
    exercise: {
      label: 'Exercise Time',
      unit: 'min',
      color: '#059669', // emerald-600
      bgGrad: '#d1fae5',
      target: profile.dailyExerciseGoal,
      getValue: (l: HealthLogEntry) => l.exerciseMinutes ?? 0,
      formatVal: (val: number) => `${val} min`,
    },
    heartRate: {
      label: 'Resting Heart Rate',
      unit: 'bpm',
      color: '#e11d48', // rose-600
      bgGrad: '#ffe4e6',
      target: 70,
      getValue: (l: HealthLogEntry) => l.heartRate ?? 70,
      formatVal: (val: number) => `${val} bpm`,
    },
  };

  const currentMetricConfig = metricConfigs[selectedChartMetric];
  const chartValues = last7Logs.map(currentMetricConfig.getValue);
  const maxVal = Math.max(...chartValues, currentMetricConfig.target * 1.15, 10);
  const minVal = selectedChartMetric === 'heartRate' ? 50 : 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* 1. Header Greeting & Date */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{formatFullHeaderDate()}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {greeting}, {profile.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Here is your everyday wellness balance and daily habit fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCheckIn}
            className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border transition-all flex items-center gap-2 ${
              todayCheckIn.completed
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                : 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-xs'
            }`}
          >
            <Smile className="w-4 h-4 text-emerald-600" />
            <span>{todayCheckIn.completed ? 'Review Daily Check-in' : 'Daily Check-in'}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Health Data</span>
          </button>
        </div>
      </div>

      {/* Safety Banner (Compact) */}
      <MedicalDisclaimerBanner compact />

      {/* 2. Daily Health Score (Wellness Summary) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Radial score indicator */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-slate-50/70 rounded-2xl border border-slate-100">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#0d9488"
                  strokeWidth="10"
                  strokeDasharray={314.15}
                  strokeDashoffset={314.15 * (1 - wellnessData.totalScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                  {wellnessData.totalScore}%
                </span>
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                  Habit Score
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs font-semibold text-teal-800">
              Lifestyle Habits Fulfilled
            </div>
          </div>

          {/* Score Factors & Explicit Medical Disclaimer */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  Daily Wellness Summary
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 font-medium border border-teal-200">
                  Habit-Based
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {wellnessData.summaryText}
              </p>
            </div>

            {/* Individual factors progress bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {wellnessData.factors.map((factor) => (
                <div
                  key={factor.name}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 text-xs"
                >
                  <div className="flex items-center justify-between font-medium text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 truncate">
                      {factor.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{factor.name}</span>
                    </span>
                    <span className="tabular-nums text-slate-500 shrink-0">{factor.actual}</span>
                  </div>
                  <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, factor.score)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Crucial Non-Diagnostic Notice */}
            <div className="pt-2 flex items-start gap-2 text-[11px] text-slate-500 border-t border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong>Wellness Clarification:</strong> {wellnessData.disclaimer}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metric Cards: Steps, Water, Sleep, Exercise, Heart Rate, Blood Pressure */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Today’s Core Metrics
          </h2>
          <span className="text-xs text-slate-500">
            Click quick actions to log in seconds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Steps Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-teal-300 transition-colors">
            <div className="flex items-center justify-between text-teal-700 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Steps Walked
              </span>
              <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <Activity className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {(todayLog?.steps ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                / {profile.dailyStepGoal.toLocaleString()}
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((todayLog?.steps ?? 0) / profile.dailyStepGoal) * 100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                {Math.round(((todayLog?.steps ?? 0) / profile.dailyStepGoal) * 100)}% of goal
              </span>
              <button
                onClick={() => onQuickAddSteps(500)}
                className="px-2 py-1 text-[11px] font-semibold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                title="Add 500 steps"
              >
                +500 steps
              </button>
            </div>
          </div>

          {/* Water Intake Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-sky-300 transition-colors">
            <div className="flex items-center justify-between text-sky-700 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hydration
              </span>
              <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                <Droplets className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {(todayLog?.waterIntake ?? 0).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500">
                / {profile.dailyWaterGoal.toLocaleString()} ml
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((todayLog?.waterIntake ?? 0) / profile.dailyWaterGoal) * 100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                {Math.round(((todayLog?.waterIntake ?? 0) / profile.dailyWaterGoal) * 100)}% hydrated
              </span>
              <button
                onClick={onQuickAddWater}
                className="px-2 py-1 text-[11px] font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                title="Add 1 glass (250 ml)"
              >
                +250 ml glass
              </button>
            </div>
          </div>

          {/* Sleep Duration Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between text-indigo-700 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Sleep Rest
              </span>
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
                <Moon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {todayLog?.sleepDuration ?? 0}
              </span>
              <span className="text-xs text-slate-500">
                / {profile.dailySleepGoal} hrs
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((todayLog?.sleepDuration ?? 0) / profile.dailySleepGoal) * 100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
              <span className="text-slate-500">
                Quality: <strong className="capitalize text-indigo-900">{todayLog?.sleepQuality ?? 'good'}</strong>
              </span>
              <button
                onClick={onOpenAddModal}
                className="text-indigo-700 hover:text-indigo-900 font-semibold"
              >
                Log sleep
              </button>
            </div>
          </div>

          {/* Exercise Minutes Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between text-emerald-700 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Exercise
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                <Flame className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 tabular-nums">
                {todayLog?.exerciseMinutes ?? 0}
              </span>
              <span className="text-xs text-slate-500">
                / {profile.dailyExerciseGoal} min
              </span>
            </div>

            <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    100,
                    ((todayLog?.exerciseMinutes ?? 0) / profile.dailyExerciseGoal) * 100
                  )}%`,
                }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 truncate max-w-[100px]">
                {todayLog?.exerciseType || 'Active time'}
              </span>
              <button
                onClick={() => onQuickAddExercise(15)}
                className="px-2 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                title="Add 15 min workout"
              >
                +15 min
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Vitals Bar: Heart Rate, Blood Pressure, Weight, BMI */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs text-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Resting Pulse</div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {todayLog?.heartRate ?? 68} <span className="text-[10px] font-normal text-slate-500">bpm</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Blood Pressure</div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {todayLog?.bloodPressureSys ?? 118}/{todayLog?.bloodPressureDia ?? 78}{' '}
                <span className="text-[10px] font-normal text-slate-500">mmHg</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">Recorded Weight</div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {todayLog?.weight ?? profile.weight}{' '}
                <span className="text-[10px] font-normal text-slate-500">kg</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">BMI Indicator</div>
              <div className="text-sm font-bold text-slate-900 tabular-nums">
                {bmiInfo.bmi}{' '}
                <span className={`text-[10px] font-medium ${bmiInfo.colorClass}`}>
                  ({bmiInfo.category.split(' ')[0]})
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Weekly Progress Chart Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Weekly Habit Trends
              </h2>
              <span className="text-xs text-slate-500">Last 7 Days</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Consistent daily rhythm is key to long-term vitality.
            </p>
          </div>

          {/* Interactive Metric Switcher Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            {(
              [
                { id: 'steps', label: 'Steps' },
                { id: 'water', label: 'Water' },
                { id: 'sleep', label: 'Sleep' },
                { id: 'exercise', label: 'Exercise' },
                { id: 'heartRate', label: 'Heart' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedChartMetric(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  selectedChartMetric === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Responsive Bar & Trend Chart */}
        <div className="pt-4 pb-2">
          <div className="h-56 w-full flex flex-col justify-end">
            <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {last7Logs.map((log) => {
                const val = currentMetricConfig.getValue(log);
                const heightPct = Math.max(8, Math.min(100, ((val - minVal) / (maxVal - minVal)) * 100));
                const reachedGoal = val >= currentMetricConfig.target;
                const formattedDate = formatFriendlyDate(log.date);

                return (
                  <div
                    key={log.id}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                  >
                    {/* Hover Floating Tooltip */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                      <span className="font-semibold">{currentMetricConfig.formatVal(val)}</span>
                      <span className="text-slate-300 ml-1">· {formattedDate}</span>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full max-w-[42px] flex flex-col items-center">
                      <div
                        className="w-full rounded-t-xl transition-all duration-500 group-hover:brightness-95"
                        style={{
                          height: `${heightPct}%`,
                          backgroundColor: reachedGoal
                            ? currentMetricConfig.color
                            : '#94a3b8',
                          minHeight: '12px',
                        }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="mt-2 text-center">
                      <span className="text-[11px] font-medium text-slate-600 block">
                        {formattedDate.split(',')[0]}
                      </span>
                      <span className="text-[10px] text-slate-400 block tabular-nums">
                        {formattedDate.split(' ')[1] || ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Target Baseline Reference Line */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-dashed border-slate-200 pt-2 mt-1">
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: currentMetricConfig.color }}
                />
                Target: {currentMetricConfig.formatVal(currentMetricConfig.target)} / day
              </span>
              <button
                onClick={() => setActiveTab('metrics')}
                className="text-teal-700 hover:text-teal-900 font-semibold inline-flex items-center gap-1"
              >
                Deep-dive monthly charts <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Today's Goals & 6. Recent Health Entries Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Goals (7 cols) */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Today’s Habit Goals</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Gentle targets calibrated for daily balance
              </p>
            </div>
            <button
              onClick={() => setActiveTab('goals')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              Manage all goals
            </button>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const isDone = goal.completedToday;
              const pct = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

              return (
                <div
                  key={goal.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200/80'
                      : 'bg-slate-50/60 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleGoal(goal.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                      aria-label={`Toggle ${goal.title}`}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isDone ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="tabular-nums">
                          {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-teal-700 font-medium">
                          {goal.streakDays} day streak 🔥
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isDone ? 'text-emerald-700' : 'text-slate-700'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Health Entries (5 cols) */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Logs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Previous wellness records</p>
            </div>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              Full timeline
            </button>
          </div>

          <div className="space-y-3">
            {logs.slice(-4).reverse().map((entry) => (
              <div
                key={entry.id}
                className="p-3 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-900">
                    {formatFriendlyDate(entry.date)}
                  </span>
                  <span className="text-slate-500 capitalize">
                    Mood: <strong className="text-teal-800">{entry.mood || 'good'}</strong>
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-600">
                  <span>{(entry.steps ?? 0).toLocaleString()} steps</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.waterIntake ?? 0} ml</span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.sleepDuration ?? 0} hrs sleep</span>
                  {entry.exerciseMinutes ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{entry.exerciseMinutes}m exercise</span>
                    </>
                  ) : null}
                </div>
                {entry.notes && (
                  <p className="mt-1.5 text-[11px] text-slate-500 italic line-clamp-1">
                    "{entry.notes}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
