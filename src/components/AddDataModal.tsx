import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Activity,
  Droplets,
  Moon,
  Flame,
  HeartPulse,
  TrendingUp,
  Scale,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { HealthLogEntry, MoodType, SleepQualityType } from '../types/health';
import { formatDateToIso, calculateBmi } from '../utils/dateUtils';

interface AddDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Partial<HealthLogEntry> & { date: string }) => void;
  existingLogs: HealthLogEntry[];
  defaultDate?: string;
}

export const AddDataModal: React.FC<AddDataModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingLogs,
  defaultDate,
}) => {
  const targetDate = defaultDate || formatDateToIso();
  const existingToday = existingLogs.find((l) => l.date === targetDate);

  const [date, setDate] = useState<string>(targetDate);
  const [steps, setSteps] = useState<string>('');
  const [waterIntake, setWaterIntake] = useState<string>('');
  const [sleepDuration, setSleepDuration] = useState<string>('');
  const [sleepQuality, setSleepQuality] = useState<SleepQualityType>('good');
  const [exerciseMinutes, setExerciseMinutes] = useState<string>('');
  const [exerciseType, setExerciseType] = useState<string>('Walking');
  const [heartRate, setHeartRate] = useState<string>('');
  const [bloodPressureSys, setBloodPressureSys] = useState<string>('');
  const [bloodPressureDia, setBloodPressureDia] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('175');
  const [mood, setMood] = useState<MoodType>('good');
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [notes, setNotes] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'all' | 'daily_vitals' | 'activity'>('all');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const entry = existingLogs.find((l) => l.date === date);
      if (entry) {
        setSteps(entry.steps !== undefined ? String(entry.steps) : '');
        setWaterIntake(entry.waterIntake !== undefined ? String(entry.waterIntake) : '');
        setSleepDuration(entry.sleepDuration !== undefined ? String(entry.sleepDuration) : '');
        setSleepQuality(entry.sleepQuality || 'good');
        setExerciseMinutes(entry.exerciseMinutes !== undefined ? String(entry.exerciseMinutes) : '');
        setExerciseType(entry.exerciseType || 'Walking');
        setHeartRate(entry.heartRate !== undefined ? String(entry.heartRate) : '');
        setBloodPressureSys(entry.bloodPressureSys !== undefined ? String(entry.bloodPressureSys) : '');
        setBloodPressureDia(entry.bloodPressureDia !== undefined ? String(entry.bloodPressureDia) : '');
        setWeight(entry.weight !== undefined ? String(entry.weight) : '');
        setHeight(entry.height !== undefined ? String(entry.height) : '175');
        setMood(entry.mood || 'good');
        setEnergyLevel(entry.energyLevel || 4);
        setNotes(entry.notes || '');
      } else {
        // Defaults
        setSteps('');
        setWaterIntake('');
        setSleepDuration('');
        setExerciseMinutes('');
        setHeartRate('');
        setBloodPressureSys('');
        setBloodPressureDia('');
        setWeight('');
        setNotes('');
      }
      setSavedSuccess(false);
    }
  }, [isOpen, date, existingLogs]);

  if (!isOpen) return null;

  // Real-time calculated BMI indicator
  const numWeight = parseFloat(weight);
  const numHeight = parseFloat(height);
  const bmiCalc = calculateBmi(numWeight, numHeight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const entryToSave: Partial<HealthLogEntry> & { date: string } = {
      date,
      steps: steps ? parseInt(steps, 10) : undefined,
      waterIntake: waterIntake ? parseInt(waterIntake, 10) : undefined,
      sleepDuration: sleepDuration ? parseFloat(sleepDuration) : undefined,
      sleepQuality,
      exerciseMinutes: exerciseMinutes ? parseInt(exerciseMinutes, 10) : undefined,
      exerciseType: exerciseMinutes ? exerciseType : undefined,
      heartRate: heartRate ? parseInt(heartRate, 10) : undefined,
      bloodPressureSys: bloodPressureSys ? parseInt(bloodPressureSys, 10) : undefined,
      bloodPressureDia: bloodPressureDia ? parseInt(bloodPressureDia, 10) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      height: height ? parseFloat(height) : undefined,
      mood,
      energyLevel,
      notes: notes.trim() || undefined,
    };

    onSave(entryToSave);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-teal-600" />
              <span>Record Daily Health & Habits</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your manual measurements for everyday wellness tracking.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Selector and Category Tabs */}
        <div className="px-6 pt-4 pb-2 bg-slate-50/60 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="logDate" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
              Log Date:
            </label>
            <input
              id="logDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Metrics
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('activity')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'activity' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Movement & Sleep
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('daily_vitals')}
              className={`px-3 py-1 rounded-md transition-colors ${
                activeTab === 'daily_vitals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vitals & Body
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Presets Section */}
          <div className="p-3 bg-teal-50/60 border border-teal-100 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-teal-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Quick Fill Shortcuts:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setWaterIntake((prev) => String((parseInt(prev || '0', 10) + 250)))}
                className="px-2.5 py-1 bg-white hover:bg-teal-100/80 border border-teal-200 text-teal-900 rounded-lg transition-colors font-medium"
              >
                +250ml Water
              </button>
              <button
                type="button"
                onClick={() => setSteps((prev) => String((parseInt(prev || '0', 10) + 1000)))}
                className="px-2.5 py-1 bg-white hover:bg-teal-100/80 border border-teal-200 text-teal-900 rounded-lg transition-colors font-medium"
              >
                +1,000 Steps
              </button>
              <button
                type="button"
                onClick={() => {
                  setExerciseMinutes('30');
                  setExerciseType('Brisk Walk');
                }}
                className="px-2.5 py-1 bg-white hover:bg-teal-100/80 border border-teal-200 text-teal-900 rounded-lg transition-colors font-medium"
              >
                30m Walk
              </button>
            </div>
          </div>

          {/* Section: Activity, Water, Sleep */}
          {(activeTab === 'all' || activeTab === 'activity') && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Everyday Habits & Activity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Steps */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600" />
                    Steps Walked
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      placeholder="e.g. 8500"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">steps</span>
                  </div>
                </div>

                {/* Water Intake */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-600" />
                    Water Intake
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="50"
                      placeholder="e.g. 2400"
                      value={waterIntake}
                      onChange={(e) => setWaterIntake(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">ml</span>
                  </div>
                </div>

                {/* Sleep Duration */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-600" />
                    Sleep Duration
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      step="0.1"
                      placeholder="e.g. 7.5"
                      value={sleepDuration}
                      onChange={(e) => setSleepDuration(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">hours</span>
                  </div>
                </div>

                {/* Sleep Quality */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sleep Quality Rating
                  </label>
                  <select
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value as SleepQualityType)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 capitalize bg-white text-slate-800"
                  >
                    <option value="poor">Poor (Restless/Broken)</option>
                    <option value="fair">Fair (Average rest)</option>
                    <option value="good">Good (Refreshing)</option>
                    <option value="excellent">Excellent (Deep & energized)</option>
                  </select>
                </div>

                {/* Exercise Minutes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-emerald-600" />
                    Exercise Duration
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="600"
                      placeholder="e.g. 35"
                      value={exerciseMinutes}
                      onChange={(e) => setExerciseMinutes(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">min</span>
                  </div>
                </div>

                {/* Exercise Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Workout Activity Type
                  </label>
                  <select
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 bg-white text-slate-800"
                  >
                    <option value="Walking">Walking / Stroll</option>
                    <option value="Jogging">Jogging / Running</option>
                    <option value="Cycling">Cycling / Biking</option>
                    <option value="Yoga">Yoga / Stretching</option>
                    <option value="Pilates">Pilates / Core</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Strength">Strength / Weights</option>
                    <option value="HIIT">HIIT / Cardio</option>
                    <option value="Sports">Sports / Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Section: Vitals & Body (Heart Rate, Blood Pressure, Weight, Height) */}
          {(activeTab === 'all' || activeTab === 'daily_vitals') && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Vitals & Body Measurements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Resting Heart Rate */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                    Resting Heart Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="35"
                      max="220"
                      placeholder="e.g. 68"
                      value={heartRate}
                      onChange={(e) => setHeartRate(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">bpm</span>
                  </div>
                </div>

                {/* Blood Pressure (Sys & Dia) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    Blood Pressure (Systolic / Diastolic)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="number"
                        min="70"
                        max="220"
                        placeholder="Sys (118)"
                        value={bloodPressureSys}
                        onChange={(e) => setBloodPressureSys(e.target.value)}
                        className="w-full px-2.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400">Sys</span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="40"
                        max="140"
                        placeholder="Dia (78)"
                        value={bloodPressureDia}
                        onChange={(e) => setBloodPressureDia(e.target.value)}
                        className="w-full px-2.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                      />
                      <span className="absolute right-2 top-2 text-[10px] text-slate-400">Dia</span>
                    </div>
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    Weight
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="20"
                      max="350"
                      placeholder="e.g. 68.4"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">kg</span>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                    Height
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="1"
                      min="50"
                      max="260"
                      placeholder="e.g. 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600 tabular-nums"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400">cm</span>
                  </div>
                </div>
              </div>

              {/* Real-time BMI feedback indicator */}
              {bmiCalc.bmi > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                  <span className="text-slate-600">
                    Calculated Lifestyle BMI Indicator:
                  </span>
                  <span className="font-semibold text-slate-900">
                    {bmiCalc.bmi}{' '}
                    <span className={`text-[11px] font-medium ml-1 ${bmiCalc.colorClass}`}>
                      ({bmiCalc.category})
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Section: Daily Wellbeing & Reflection */}
          {activeTab === 'all' && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Wellbeing & Personal Notes
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    General Mood State
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {(
                      [
                        { id: 'great', label: 'Great', emoji: '✨' },
                        { id: 'good', label: 'Good', emoji: '😊' },
                        { id: 'neutral', label: 'Neutral', emoji: '😐' },
                        { id: 'tired', label: 'Tired', emoji: '🥱' },
                        { id: 'stressed', label: 'Stressed', emoji: '🌧️' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                          mood === m.id
                            ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base">{m.emoji}</span>
                        <span className="text-[10px] truncate w-full">{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Energy Level (1 to 5)
                  </label>
                  <div className="grid grid-cols-5 gap-1.5 text-center text-xs">
                    {([1, 2, 3, 4, 5] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setEnergyLevel(lvl)}
                        className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center font-bold ${
                          energyLevel === lvl
                            ? 'bg-teal-700 border-teal-700 text-white shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lvl}</span>
                        <span className="text-[9px] font-normal text-slate-400">
                          {lvl === 1 ? 'Low' : lvl === 5 ? 'High' : ''}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Notes / Wellness Reflection
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Great morning hydration, felt steady energy after lunchtime walk."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-teal-600"
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Saved strictly in your browser session.
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savedSuccess}
                className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white transition-all flex items-center gap-1.5 shadow-sm ${
                  savedSuccess ? 'bg-emerald-600' : 'bg-teal-700 hover:bg-teal-800'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Health Data</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
