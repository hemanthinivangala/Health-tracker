import React from 'react';
import { Plus, User, HeartPulse } from 'lucide-react';
import { ActiveTab, UserProfile } from '../types/health';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  profile: UserProfile;
  onOpenAddModal: () => void;
  onOpenCheckIn: () => void;
  hasCheckedInToday: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenAddModal,
  onOpenCheckIn,
  hasCheckedInToday,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-4.5 h-4.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-900 transition-colors">
            HealthTrack
          </span>
        </button>

        {/* Zone 2: 4-6 clean text navigation links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('landing')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'landing' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            About
            {activeTab === 'landing' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'dashboard' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Dashboard
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'metrics' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Metrics & Charts
            {activeTab === 'metrics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'goals' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Goals
            {activeTab === 'goals' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'history' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Timeline
            {activeTab === 'history' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`transition-colors hover:text-slate-900 relative py-1 ${
              activeTab === 'reminders' ? 'text-teal-700 font-semibold' : ''
            }`}
          >
            Reminders
            {activeTab === 'reminders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onOpenCheckIn}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors whitespace-nowrap ${
              hasCheckedInToday
                ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span>{hasCheckedInToday ? '✓ Check-in Done' : 'Daily Check-in'}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Health Data</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            title={`Profile: ${profile.name}`}
            aria-label="User Profile"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-medium text-xs">
              {profile.name.charAt(0)}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
