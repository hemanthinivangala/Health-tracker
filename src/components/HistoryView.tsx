import React, { useState } from 'react';
import {
  Calendar,
  Activity,
  Droplets,
  Moon,
  Flame,
  HeartPulse,
  Scale,
  Trash2,
  Edit2,
  Plus,
  Smile,
  Filter,
} from 'lucide-react';
import { HealthLogEntry } from '../types/health';
import { formatFriendlyDate, formatTimeFriendly } from '../utils/dateUtils';

interface HistoryViewProps {
  logs: HealthLogEntry[];
  onOpenEditModal: (entry: HealthLogEntry) => void;
  onDeleteLog: (id: string) => void;
  onOpenAddModal: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  logs,
  onOpenEditModal,
  onDeleteLog,
  onOpenAddModal,
}) => {
  const [filterMetric, setFilterMetric] = useState<string>('all');
  const [searchDate, setSearchDate] = useState<string>('');

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  const filteredLogs = sortedLogs.filter((log) => {
    if (searchDate && !log.date.includes(searchDate)) return false;
    if (filterMetric === 'steps' && !log.steps) return false;
    if (filterMetric === 'water' && !log.waterIntake) return false;
    if (filterMetric === 'sleep' && !log.sleepDuration) return false;
    if (filterMetric === 'exercise' && !log.exerciseMinutes) return false;
    if (filterMetric === 'vitals' && !log.heartRate && !log.bloodPressureSys) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4" />
            <span>Recorded Journal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Health History & Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse previous days, review wellness logs, and maintain accurate records.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Date</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">Filter By:</span>
          <select
            value={filterMetric}
            onChange={(e) => setFilterMetric(e.target.value)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-teal-600"
          >
            <option value="all">All Logs ({sortedLogs.length})</option>
            <option value="steps">Steps Logged</option>
            <option value="water">Water Logged</option>
            <option value="sleep">Sleep Logged</option>
            <option value="exercise">Exercise Logged</option>
            <option value="vitals">Vitals (Heart/BP)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="filterDate" className="text-xs font-medium text-slate-500">
            Jump to Date:
          </label>
          <input
            id="filterDate"
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-teal-600 text-slate-700"
          />
          {searchDate && (
            <button
              onClick={() => setSearchDate('')}
              className="text-xs text-slate-500 hover:text-slate-800 underline ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Timeline Entry List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No logs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              There are no health logs matching your selected filter or date.
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-teal-700 text-white hover:bg-teal-800"
            >
              Log Data Now
            </button>
          </div>
        ) : (
          filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              {/* Entry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-xs">
                    {entry.date.split('-')[2]}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {formatFriendlyDate(entry.date)}
                    </h3>
                    <span className="text-xs text-slate-500">
                      Logged {formatTimeFriendly(entry.timestamp)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {entry.mood && (
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5 capitalize">
                      <Smile className="w-3.5 h-3.5 text-teal-600" />
                      Mood: {entry.mood}
                    </span>
                  )}
                  <button
                    onClick={() => onOpenEditModal(entry)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit entry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteLog(entry.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Metric Values Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {entry.steps !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Activity className="w-3.5 h-3.5 text-teal-600" /> Steps
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.steps.toLocaleString()}
                    </span>
                  </div>
                )}

                {entry.waterIntake !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" /> Hydration
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.waterIntake.toLocaleString()} ml
                    </span>
                  </div>
                )}

                {entry.sleepDuration !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" /> Sleep
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.sleepDuration} hrs ({entry.sleepQuality || 'good'})
                    </span>
                  </div>
                )}

                {entry.exerciseMinutes !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Flame className="w-3.5 h-3.5 text-emerald-600" /> Exercise
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.exerciseMinutes} min ({entry.exerciseType || 'Active'})
                    </span>
                  </div>
                )}

                {entry.heartRate !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-600" /> Pulse
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.heartRate} bpm
                    </span>
                  </div>
                )}

                {entry.bloodPressureSys !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Activity className="w-3.5 h-3.5 text-blue-600" /> Blood Pressure
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.bloodPressureSys}/{entry.bloodPressureDia || 80} mmHg
                    </span>
                  </div>
                )}

                {entry.weight !== undefined && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 flex items-center gap-1 mb-1">
                      <Scale className="w-3.5 h-3.5 text-amber-600" /> Weight
                    </span>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">
                      {entry.weight} kg
                    </span>
                  </div>
                )}
              </div>

              {/* Reflection Note */}
              {entry.notes && (
                <div className="p-3 rounded-2xl bg-teal-50/40 border border-teal-100/60 text-xs text-slate-600">
                  <span className="font-semibold text-teal-900">Journal Note:</span> "{entry.notes}"
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
