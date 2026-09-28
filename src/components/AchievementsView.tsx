import React from 'react';
import {
  Award,
  Sparkles,
  Droplets,
  Moon,
  Footprints,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Achievement } from '../types/health';
import { formatFriendlyDate } from '../utils/dateUtils';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const renderIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? 'text-teal-700' : 'text-slate-400'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'Footprints':
        return <Footprints className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-700 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Habit Milestones</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Gentle Consistency Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Personal, non-competitive recognitions for showing up and caring for your daily wellness.
          </p>
        </div>

        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-xs font-semibold text-emerald-900 self-start sm:self-auto flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>
            {unlockedCount} of {achievements.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Philosophy banner */}
      <div className="p-4 bg-teal-50/70 border border-teal-100 rounded-2xl text-xs text-slate-700 flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>No leaderboards. No artificial pressure.</strong> Every badge here celebrates your own personal rhythm and steady self-care, honoring consistency over extreme performance.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map((item) => (
          <div
            key={item.id}
            className={`p-6 rounded-3xl border transition-all relative overflow-hidden bg-white shadow-xs ${
              item.unlocked
                ? 'border-teal-200/80 hover:border-teal-300'
                : 'border-slate-200/70 opacity-80'
            }`}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  item.unlocked
                    ? 'bg-gradient-to-br from-teal-50 to-emerald-100/70 border border-teal-200/60 shadow-2xs'
                    : 'bg-slate-100 border border-slate-200'
                }`}
              >
                {renderIcon(item.iconName, item.unlocked)}
              </div>

              {item.unlocked ? (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Unlocked
                </span>
              ) : (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> In Progress
                </span>
              )}
            </div>

            {/* Info */}
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {item.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {item.description}
            </p>

            {/* Criteria */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Requirement: {item.criteria}</span>
                <span className="font-semibold text-slate-700 tabular-nums">
                  {item.progress}%
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    item.unlocked ? 'bg-teal-600' : 'bg-slate-400'
                  }`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>

              {item.unlockedAt && (
                <div className="text-[10px] text-teal-800 font-medium pt-1">
                  Earned on {formatFriendlyDate(item.unlockedAt)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
