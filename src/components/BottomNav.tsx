import React from 'react';
import { LayoutDashboard, LineChart, Plus, Target, User } from 'lucide-react';
import { ActiveTab } from '../types/health';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
}) => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-lg"
      style={{ maxHeight: '68px' }}
      aria-label="Mobile Navigation"
    >
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          activeTab === 'dashboard' ? 'text-teal-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Today</span>
      </button>

      <button
        onClick={() => setActiveTab('metrics')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          activeTab === 'metrics' ? 'text-teal-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <LineChart className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Trends</span>
      </button>

      {/* Primary Floating Action in Bottom Bar */}
      <button
        onClick={onOpenAddModal}
        className="flex items-center justify-center w-12 h-12 -mt-4 rounded-full bg-teal-700 text-white shadow-md shadow-teal-700/30 hover:bg-teal-800 active:scale-95 transition-all"
        aria-label="Quick Add Health Entry"
      >
        <Plus className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveTab('goals')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          activeTab === 'goals' ? 'text-teal-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <Target className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Goals</span>
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] transition-colors ${
          activeTab === 'profile' ? 'text-teal-700 font-semibold' : 'text-slate-500'
        }`}
      >
        <User className="w-5 h-5 mb-0.5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};
