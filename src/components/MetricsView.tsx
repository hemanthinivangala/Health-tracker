import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  Moon,
  Flame,
  HeartPulse,
  Scale,
  TrendingUp,
  Plus,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { HealthLogEntry, HealthMetricType, UserProfile } from '../types/health';
import { formatFriendlyDate, calculateBmi } from '../utils/dateUtils';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

interface MetricsViewProps {
  logs: HealthLogEntry[];
  profile: UserProfile;
  onOpenAddModal: () => void;
}

export const MetricsView: React.FC<MetricsViewProps> = ({
  logs,
  profile,
  onOpenAddModal,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>('steps');
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const daysSlice = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
  const filteredLogs = logs.slice(-daysSlice);

  // Metric definitions & getters
  const metricMap: Record<
    HealthMetricType,
    {
      title: string;
      unit: string;
      color: string;
      strokeColor: string;
      targetVal: number;
      getValue: (l: HealthLogEntry) => number | undefined;
      format: (val: number) => string;
      category: string;
      contextNote: string;
    }
  > = {
    steps: {
      title: 'Daily Steps',
      unit: 'steps',
      color: '#0d9488', // teal-600
      strokeColor: '#0f766e',
      targetVal: profile.dailyStepGoal,
      getValue: (l) => l.steps,
      format: (v) => v.toLocaleString(),
      category: 'Movement',
      contextNote: 'Regular walking supports cardiovascular stamina and steady daily energy levels.',
    },
    water: {
      title: 'Water Intake',
      unit: 'ml',
      color: '#0284c7', // sky-600
      strokeColor: '#0369a1',
      targetVal: profile.dailyWaterGoal,
      getValue: (l) => l.waterIntake,
      format: (v) => `${v.toLocaleString()} ml`,
      category: 'Hydration',
      contextNote: 'Adequate hydration aids cognitive focus, digestion, and temperature regulation.',
    },
    sleep: {
      title: 'Sleep Duration',
      unit: 'hrs',
      color: '#6366f1', // indigo-500
      strokeColor: '#4f46e5',
      targetVal: profile.dailySleepGoal,
      getValue: (l) => l.sleepDuration,
      format: (v) => `${v} hrs`,
      category: 'Restoration',
      contextNote: 'Quality sleep repairs physical tissues and supports emotional equilibrium.',
    },
    exercise: {
      title: 'Active Exercise',
      unit: 'min',
      color: '#059669', // emerald-600
      strokeColor: '#047857',
      targetVal: profile.dailyExerciseGoal,
      getValue: (l) => l.exerciseMinutes,
      format: (v) => `${v} min`,
      category: 'Physical Activity',
      contextNote: 'Moderate workouts promote muscular health, bone density, and endurance.',
    },
    heartRate: {
      title: 'Resting Heart Rate',
      unit: 'bpm',
      color: '#e11d48', // rose-600
      strokeColor: '#be123c',
      targetVal: 70,
      getValue: (l) => l.heartRate,
      format: (v) => `${v} bpm`,
      category: 'Vitals',
      contextNote: 'Resting heart rate reflects cardiovascular conditioning and relaxation state.',
    },
    bloodPressure: {
      title: 'Blood Pressure (Systolic)',
      unit: 'mmHg',
      color: '#2563eb', // blue-600
      strokeColor: '#1d4ed8',
      targetVal: 120,
      getValue: (l) => l.bloodPressureSys,
      format: (v) => `${v} mmHg`,
      category: 'Vitals',
      contextNote: 'Tracked over time to observe lifestyle trends and relaxation responses.',
    },
    weight: {
      title: 'Weight Tracking',
      unit: 'kg',
      color: '#d97706', // amber-600
      strokeColor: '#b45309',
      targetVal: profile.weight,
      getValue: (l) => l.weight,
      format: (v) => `${v} kg`,
      category: 'Body Balance',
      contextNote: 'Weight fluctuates naturally day-to-day based on hydration and nutrition.',
    },
    height: {
      title: 'Recorded Height',
      unit: 'cm',
      color: '#0d9488',
      strokeColor: '#0f766e',
      targetVal: profile.height,
      getValue: (l) => l.height,
      format: (v) => `${v} cm`,
      category: 'Body Balance',
      contextNote: 'Used for height-to-weight ratio indicators.',
    },
  };

  const currentDef = metricMap[selectedMetric];

  // Extract numerical values
  const dataPoints = filteredLogs
    .map((log) => ({
      date: log.date,
      val: currentDef.getValue(log),
      rawLog: log,
    }))
    .filter((d): d is { date: string; val: number; rawLog: HealthLogEntry } => d.val !== undefined);

  const values = dataPoints.map((d) => d.val);
  const count = values.length;
  const sum = values.reduce((acc, v) => acc + v, 0);
  const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  const max = count > 0 ? Math.max(...values) : 0;
  const min = count > 0 ? Math.min(...values) : 0;
  const latest = count > 0 ? values[values.length - 1] : 0;

  // Chart coordinate math
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 30;

  const yMin = selectedMetric === 'heartRate' || selectedMetric === 'bloodPressure'
    ? Math.max(0, Math.floor(min * 0.85))
    : selectedMetric === 'weight'
    ? Math.max(0, Math.floor(min - 5))
    : 0;

  const yMax = Math.max(...values, currentDef.targetVal * 1.15, yMin + 10);

  const getYCoord = (val: number) => {
    const ratio = (val - yMin) / (yMax - yMin);
    return chartHeight - paddingY - ratio * (chartHeight - 2 * paddingY);
  };

  const getXCoord = (index: number) => {
    if (dataPoints.length <= 1) return chartWidth / 2;
    return paddingX + (index / (dataPoints.length - 1)) * (chartWidth - 2 * paddingX);
  };

  // Build SVG Path
  const points = dataPoints.map((d, i) => `${getXCoord(i)},${getYCoord(d.val)}`);
  const pathD = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaD =
    points.length > 0
      ? `M ${getXCoord(0)},${chartHeight - paddingY} L ${points.join(' L ')} L ${getXCoord(
          points.length - 1
        )},${chartHeight - paddingY} Z`
      : '';

  const targetY = getYCoord(currentDef.targetVal);
  const avgY = getYCoord(avg);

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            <span>Progress & Longitudinal Trends</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Health Metrics & Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Analyze patterns, averages, and habit consistency across weekly and monthly ranges.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Measurement</span>
        </button>
      </div>

      {/* Metric Selector Carousel / Pills */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(
            [
              { id: 'steps', label: 'Steps', icon: Activity },
              { id: 'water', label: 'Water', icon: Droplets },
              { id: 'sleep', label: 'Sleep', icon: Moon },
              { id: 'exercise', label: 'Exercise', icon: Flame },
              { id: 'heartRate', label: 'Heart Rate', icon: HeartPulse },
              { id: 'bloodPressure', label: 'Blood Pressure', icon: Activity },
              { id: 'weight', label: 'Weight', icon: Scale },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isSelected = selectedMetric === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedMetric(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        {/* Controls Bar: Metric Title, Summary Value, and Range Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {currentDef.category} · Trend Analysis
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-2xl font-bold text-slate-900">
                {currentDef.title}
              </h2>
              <span className="text-sm font-semibold text-teal-800 tabular-nums">
                Latest: {currentDef.format(latest)}
              </span>
            </div>
          </div>

          {/* Time range segmented buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === '7d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === '14d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === '30d' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* 4 Summary Stat Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Period Average</span>
            <div className="text-lg font-bold text-slate-900 tabular-nums mt-0.5">
              {currentDef.format(avg)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Period Peak</span>
            <div className="text-lg font-bold text-emerald-800 tabular-nums mt-0.5">
              {currentDef.format(max)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Period Lowest</span>
            <div className="text-lg font-bold text-slate-700 tabular-nums mt-0.5">
              {currentDef.format(min)}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">Habit Target</span>
            <div className="text-lg font-bold text-teal-800 tabular-nums mt-0.5">
              {currentDef.format(currentDef.targetVal)}
            </div>
          </div>
        </div>

        {/* SVG Responsive Trend Visualization */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-[580px] h-[250px] relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={currentDef.color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={currentDef.color} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line
                x1={paddingX}
                y1={paddingY}
                x2={chartWidth - paddingX}
                y2={paddingY}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight / 2}
                x2={chartWidth - paddingX}
                y2={chartHeight / 2}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="#e2e8f0"
                strokeWidth="1"
              />

              {/* Target Goal Dotted Line */}
              {targetY >= paddingY && targetY <= chartHeight - paddingY && (
                <g>
                  <line
                    x1={paddingX}
                    y1={targetY}
                    x2={chartWidth - paddingX}
                    y2={targetY}
                    stroke={currentDef.color}
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                  <text
                    x={chartWidth - paddingX}
                    y={targetY - 5}
                    textAnchor="end"
                    fill={currentDef.color}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Goal: {currentDef.format(currentDef.targetVal)}
                  </text>
                </g>
              )}

              {/* Area Gradient Fill */}
              {areaD && <path d={areaD} fill="url(#metricGrad)" />}

              {/* Smooth Connecting Line */}
              {pathD && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={currentDef.strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Point Nodes */}
              {dataPoints.map((d, idx) => {
                const cx = getXCoord(idx);
                const cy = getYCoord(d.val);
                const isHovered = hoveredIndex === idx;

                return (
                  <g
                    key={d.date}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? currentDef.strokeColor : '#ffffff'}
                      stroke={currentDef.strokeColor}
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-150"
                    />

                    {/* Date label at bottom */}
                    {idx % Math.ceil(dataPoints.length / 7) === 0 && (
                      <text
                        x={cx}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="sans-serif"
                      >
                        {formatFriendlyDate(d.date).split(',')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Floating Tooltip when node is hovered */}
            {hoveredIndex !== null && dataPoints[hoveredIndex] && (
              <div
                className="absolute pointer-events-none z-20 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs transform -translate-x-1/2 -translate-y-full mb-3"
                style={{
                  left: `${(getXCoord(hoveredIndex) / chartWidth) * 100}%`,
                  top: `${(getYCoord(dataPoints[hoveredIndex].val) / chartHeight) * 100}%`,
                }}
              >
                <div className="font-bold">{currentDef.format(dataPoints[hoveredIndex].val)}</div>
                <div className="text-[10px] text-slate-300">
                  {formatFriendlyDate(dataPoints[hoveredIndex].date)}
                </div>
                {dataPoints[hoveredIndex].rawLog.mood && (
                  <div className="text-[10px] text-teal-300 capitalize mt-0.5">
                    Mood: {dataPoints[hoveredIndex].rawLog.mood}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Informative Context Note */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-xs text-slate-700 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
          <div>
            <strong>Wellness Perspective:</strong> {currentDef.contextNote}
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <MedicalDisclaimerBanner compact />
    </div>
  );
};
