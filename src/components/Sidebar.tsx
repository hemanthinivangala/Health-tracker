import React from 'react';
import {
  LayoutDashboard,
  LineChart,
  Target,
  Calendar,
  Bell,
  Award,
  UserCheck,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { ActiveTab } from '../types/health';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenCheckIn: () => void;
  hasCheckedInToday: boolean;
  unlockedBadgesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckIn,
  hasCheckedInToday,
  unlockedBadgesCount,
}) => {
  const mainNav = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'metrics' as ActiveTab, label: 'Metrics & Trends', icon: LineChart },
    { id: 'goals' as ActiveTab, label: 'Habit Goals', icon: Target },
    { id: 'history' as ActiveTab, label: 'History & Logs', icon: Calendar },
    { id: 'reminders' as ActiveTab, label: 'Reminders', icon: Bell },
    {
      id: 'achievements' as ActiveTab,
      label: 'Badges',
      icon: Award,
      badge: unlockedBadgesCount > 0 ? `${unlockedBadgesCount}` : undefined,
    },
    { id: 'profile' as ActiveTab, label: 'Profile & Privacy', icon: UserCheck },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 p-4 shrink-0 min-h-[calc(100vh-61px)]">
      {/* Daily Check-in Card in Sidebar */}
      <div className="mb-4 p-3.5 bg-gradient-to-br from-teal-50/90 to-emerald-50/80 border border-teal-200/60 rounded-2xl">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-teal-700" />
          <span className="text-xs font-semibold text-teal-950">Daily Mindfulness</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">
          {hasCheckedInToday
            ? 'Today’s check-in recorded. View or update your reflection anytime.'
            : 'Take 30 seconds to record how your body and mind feel today.'}
        </p>
        <button
          onClick={onOpenCheckIn}
          className="w-full py-2 px-3 text-xs font-semibold rounded-xl bg-teal-700 hover:bg-teal-800 text-white transition-colors text-center shadow-xs"
        >
          {hasCheckedInToday ? 'Review Check-in' : 'Start Daily Check-in'}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="text-xs font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
        Workspace
      </div>
      <nav className="space-y-1 mb-6">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-teal-50 text-teal-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 ${
                    isActive ? 'text-teal-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Secondary / Landing info link */}
      <div className="mt-auto pt-4 border-t border-slate-100 space-y-1">
        <button
          onClick={() => setActiveTab('landing')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'landing'
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Product Overview</span>
        </button>
        <div className="px-3.5 py-2 text-[11px] text-slate-400">
          HealthTrack v1.0 · Private on device
        </div>
      </div>
    </aside>
  );
};
