import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  HealthLogEntry,
  Goal,
  DailyCheckIn,
  Reminder,
  Achievement,
  UserProfile,
} from './types/health';
import { storageService } from './services/storage';
import { formatDateToIso } from './utils/dateUtils';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { MetricsView } from './components/MetricsView';
import { GoalsView } from './components/GoalsView';
import { RemindersView } from './components/RemindersView';
import { HistoryView } from './components/HistoryView';
import { AchievementsView } from './components/AchievementsView';
import { ProfileView } from './components/ProfileView';
import { AddDataModal } from './components/AddDataModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [logs, setLogs] = useState<HealthLogEntry[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn>(storageService.getTodayCheckIn());

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [editingLogDate, setEditingLogDate] = useState<string | undefined>(undefined);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [privacyMaskActive, setPrivacyMaskActive] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    setLogs(storageService.getLogs());
    setGoals(storageService.getGoals());
    setReminders(storageService.getReminders());
    setAchievements(storageService.getAchievements());
    setProfile(storageService.getProfile());
    setTodayCheckIn(storageService.getTodayCheckIn());
  }, []);

  const showToast = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    setToast({
      id: String(Date.now()),
      type,
      title,
      message,
    });
  };

  // Check achievements against current stats
  const evaluateAchievements = (currentLogs: HealthLogEntry[], currentGoals: Goal[]) => {
    const achs = storageService.getAchievements();
    let updated = false;

    // e.g. check for 50,000 steps total
    const totalSteps = currentLogs.reduce((acc, l) => acc + (l.steps || 0), 0);
    const stepAch = achs.find((a) => a.id === 'ach-4');
    if (stepAch && !stepAch.unlocked && totalSteps >= 50000) {
      stepAch.unlocked = true;
      stepAch.unlockedAt = formatDateToIso();
      stepAch.progress = 100;
      updated = true;
      showToast('success', 'Badge Unlocked: Step Explorer', 'You have accumulated over 50,000 steps!');
    }

    if (updated) {
      storageService.saveAchievements(achs);
      setAchievements([...achs]);
    }
  };

  // Add or update health log
  const handleSaveLog = (entry: Partial<HealthLogEntry> & { date: string }) => {
    const updatedLogs = storageService.addOrUpdateLog(entry);
    setLogs(updatedLogs);

    // Sync corresponding goals if logged for today
    const todayStr = formatDateToIso();
    if (entry.date === todayStr) {
      let updatedGoals = [...goals];
      if (entry.waterIntake !== undefined) {
        updatedGoals = storageService.updateGoalProgress('goal-water', entry.waterIntake, true);
      }
      if (entry.steps !== undefined) {
        updatedGoals = storageService.updateGoalProgress('goal-steps', entry.steps, true);
      }
      if (entry.sleepDuration !== undefined) {
        updatedGoals = storageService.updateGoalProgress('goal-sleep', entry.sleepDuration, true);
      }
      if (entry.exerciseMinutes !== undefined) {
        updatedGoals = storageService.updateGoalProgress('goal-exercise', entry.exerciseMinutes, true);
      }
      setGoals(updatedGoals);
    }

    evaluateAchievements(updatedLogs, goals);
    showToast('success', 'Health Record Saved', `Successfully recorded entry for ${entry.date}.`);
  };

  // Delete a log
  const handleDeleteLog = (id: string) => {
    const updated = storageService.deleteLog(id);
    setLogs(updated);
    showToast('info', 'Record Removed', 'Health log has been deleted.');
  };

  // Quick action: water +250ml
  const handleQuickAddWater = () => {
    const todayStr = formatDateToIso();
    const existing = logs.find((l) => l.date === todayStr);
    const currentVal = existing?.waterIntake || 0;
    const newVal = currentVal + 250;

    const updatedLogs = storageService.addOrUpdateLog({
      date: todayStr,
      waterIntake: newVal,
    });
    setLogs(updatedLogs);

    const updatedGoals = storageService.updateGoalProgress('goal-water', newVal, true);
    setGoals(updatedGoals);

    showToast('success', 'Hydration Logged', `Added +250 ml of water (Total: ${newVal.toLocaleString()} ml).`);
  };

  // Quick action: steps +amount
  const handleQuickAddSteps = (amount: number) => {
    const todayStr = formatDateToIso();
    const existing = logs.find((l) => l.date === todayStr);
    const currentVal = existing?.steps || 0;
    const newVal = currentVal + amount;

    const updatedLogs = storageService.addOrUpdateLog({
      date: todayStr,
      steps: newVal,
    });
    setLogs(updatedLogs);

    const updatedGoals = storageService.updateGoalProgress('goal-steps', newVal, true);
    setGoals(updatedGoals);

    showToast('success', 'Steps Logged', `Added +${amount.toLocaleString()} steps today.`);
  };

  // Quick action: exercise +minutes
  const handleQuickAddExercise = (minutes: number) => {
    const todayStr = formatDateToIso();
    const existing = logs.find((l) => l.date === todayStr);
    const currentVal = existing?.exerciseMinutes || 0;
    const newVal = currentVal + minutes;

    const updatedLogs = storageService.addOrUpdateLog({
      date: todayStr,
      exerciseMinutes: newVal,
      exerciseType: existing?.exerciseType || 'Active Workout',
    });
    setLogs(updatedLogs);

    const updatedGoals = storageService.updateGoalProgress('goal-exercise', newVal, true);
    setGoals(updatedGoals);

    showToast('success', 'Workout Logged', `Added +${minutes} minutes of active movement.`);
  };

  // Toggle goal completion
  const handleToggleGoal = (goalId: string) => {
    const updatedGoals = goals.map((g) => {
      if (g.id === goalId) {
        const nextState = !g.completedToday;
        return {
          ...g,
          completedToday: nextState,
          streakDays: nextState ? g.streakDays + 1 : Math.max(0, g.streakDays - 1),
        };
      }
      return g;
    });
    storageService.saveGoals(updatedGoals);
    setGoals(updatedGoals);

    const targetGoal = goals.find((g) => g.id === goalId);
    if (targetGoal) {
      showToast(
        'info',
        targetGoal.completedToday ? 'Goal Reset' : 'Goal Completed! 🎉',
        `Updated status for "${targetGoal.title}".`
      );
    }
  };

  // Update goal progress increment
  const handleUpdateGoalProgress = (goalId: string, amount: number) => {
    const updatedGoals = storageService.updateGoalProgress(goalId, amount, false);
    setGoals(updatedGoals);
    const g = updatedGoals.find((item) => item.id === goalId);
    if (g) {
      showToast('success', 'Progress Updated', `${g.title}: ${g.currentValue} / ${g.targetValue} ${g.unit}`);
    }
  };

  // Add custom goal
  const handleAddGoal = (
    newGoal: Omit<Goal, 'id' | 'currentValue' | 'streakDays' | 'completedToday'>
  ) => {
    const created: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      currentValue: 0,
      streakDays: 0,
      completedToday: false,
    };
    const updated = [...goals, created];
    storageService.saveGoals(updated);
    setGoals(updated);
    showToast('success', 'Goal Created', `New goal "${created.title}" is now active.`);
  };

  // Delete goal
  const handleDeleteGoal = (goalId: string) => {
    const updated = goals.filter((g) => g.id !== goalId);
    storageService.saveGoals(updated);
    setGoals(updated);
    showToast('info', 'Goal Removed', 'The goal has been deleted.');
  };

  // Save check-in
  const handleSaveCheckIn = (checkIn: DailyCheckIn) => {
    storageService.saveTodayCheckIn(checkIn);
    setTodayCheckIn(checkIn);

    // Also update today's log mood
    const todayStr = formatDateToIso();
    const updatedLogs = storageService.addOrUpdateLog({
      date: todayStr,
      mood: checkIn.mood,
      energyLevel: checkIn.energyLevel,
      sleepQuality: checkIn.sleepQuality,
      notes: checkIn.notes,
    });
    setLogs(updatedLogs);

    showToast('success', 'Check-in Recorded', 'Your mindful reflections and energy score have been logged.');
  };

  // Toggle reminder
  const handleToggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    storageService.saveReminders(updated);
    setReminders(updated);
  };

  // Add reminder
  const handleAddReminder = (reminder: Omit<Reminder, 'id'>) => {
    const created: Reminder = {
      ...reminder,
      id: `rem-${Date.now()}`,
    };
    const updated = [...reminders, created];
    storageService.saveReminders(updated);
    setReminders(updated);
    showToast('success', 'Reminder Scheduled', `Reminder "${created.title}" is set for ${created.time}.`);
  };

  // Delete reminder
  const handleDeleteReminder = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    storageService.saveReminders(updated);
    setReminders(updated);
    showToast('info', 'Reminder Removed', 'Scheduled reminder deleted.');
  };

  // Simulate / test reminder notification
  const handleTriggerTestReminder = (rem: Reminder) => {
    showToast(
      'info',
      `Reminder: ${rem.title}`,
      rem.note || `It is ${rem.time} — time for your scheduled ${rem.category} reset.`
    );
  };

  // Profile save
  const handleSaveProfile = (newProfile: UserProfile) => {
    storageService.saveProfile(newProfile);
    setProfile(newProfile);
    showToast('success', 'Settings Saved', 'Profile preferences and goal thresholds updated.');
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonStr = storageService.exportAllDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthtrack-data-${formatDateToIso()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Export Downloaded', 'Full JSON backup downloaded to your device.');
  };

  // Export CSV
  const handleExportCsv = () => {
    const csvStr = storageService.exportLogsAsCsv();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `healthtrack-logs-${formatDateToIso()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'CSV Spreadsheet Ready', 'Health logs downloaded in spreadsheet format.');
  };

  // Import JSON backup
  const handleImportJson = (jsonText: string): boolean => {
    const success = storageService.importDataFromJson(jsonText);
    if (success) {
      setLogs(storageService.getLogs());
      setGoals(storageService.getGoals());
      setReminders(storageService.getReminders());
      setAchievements(storageService.getAchievements());
      setProfile(storageService.getProfile());
      setTodayCheckIn(storageService.getTodayCheckIn());
      showToast('success', 'Backup Restored', 'All health entries successfully loaded.');
      return true;
    }
    showToast('warning', 'Import Failed', 'Unable to parse backup JSON file.');
    return false;
  };

  // Reset to sample data
  const handleResetData = () => {
    storageService.resetToDefaultData();
    setLogs(storageService.getLogs());
    setGoals(storageService.getGoals());
    setReminders(storageService.getReminders());
    setAchievements(storageService.getAchievements());
    setProfile(storageService.getProfile());
    setTodayCheckIn(storageService.getTodayCheckIn());
    showToast('info', 'Reset Complete', 'Restored realistic baseline health tracking logs.');
  };

  // Wipe all data
  const handleClearAllData = () => {
    storageService.clearAllData();
    setLogs([]);
    setGoals([]);
    setReminders([]);
    setAchievements([]);
    showToast('warning', 'Data Purged', 'All health logs and goals deleted from this browser.');
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-slate-50 text-slate-800 ${
        privacyMaskActive ? 'privacy-masked-mode' : ''
      }`}
    >
      {/* Toast Notification */}
      <NotificationToast toast={toast} onClose={() => setToast(null)} />

      {/* Top Bar Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        onOpenAddModal={() => {
          setEditingLogDate(undefined);
          setIsAddModalOpen(true);
        }}
        onOpenCheckIn={() => setIsCheckInModalOpen(true)}
        hasCheckedInToday={todayCheckIn.completed}
      />

      {/* Privacy Mask Active Banner if enabled */}
      {privacyMaskActive && (
        <div className="bg-amber-100/90 text-amber-950 text-xs px-4 py-1.5 text-center font-medium border-b border-amber-200">
          Privacy Shield is active. Sensitive health metrics are protected from shoulder-surfing.
        </div>
      )}

      {/* Main Body with Desktop Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCheckIn={() => setIsCheckInModalOpen(true)}
          hasCheckedInToday={todayCheckIn.completed}
          unlockedBadgesCount={achievements.filter((a) => a.unlocked).length}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'landing' && (
            <LandingPage
              onGetStarted={() => setActiveTab('dashboard')}
              onExploreMetrics={() => setActiveTab('metrics')}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              logs={logs}
              goals={goals}
              profile={profile}
              todayCheckIn={todayCheckIn}
              onOpenAddModal={() => {
                setEditingLogDate(undefined);
                setIsAddModalOpen(true);
              }}
              onOpenCheckIn={() => setIsCheckInModalOpen(true)}
              onQuickAddWater={handleQuickAddWater}
              onQuickAddSteps={handleQuickAddSteps}
              onQuickAddExercise={handleQuickAddExercise}
              onToggleGoal={handleToggleGoal}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricsView
              logs={logs}
              profile={profile}
              onOpenAddModal={() => {
                setEditingLogDate(undefined);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'goals' && (
            <GoalsView
              goals={goals}
              onToggleGoal={handleToggleGoal}
              onUpdateGoalProgress={handleUpdateGoalProgress}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              logs={logs}
              onOpenEditModal={(entry) => {
                setEditingLogDate(entry.date);
                setIsAddModalOpen(true);
              }}
              onDeleteLog={handleDeleteLog}
              onOpenAddModal={() => {
                setEditingLogDate(undefined);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reminders' && (
            <RemindersView
              reminders={reminders}
              onToggleReminder={handleToggleReminder}
              onAddReminder={handleAddReminder}
              onDeleteReminder={handleDeleteReminder}
              onTriggerTestReminder={handleTriggerTestReminder}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView achievements={achievements} />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onSaveProfile={handleSaveProfile}
              onExportJson={handleExportJson}
              onExportCsv={handleExportCsv}
              onImportJson={handleImportJson}
              onResetData={handleResetData}
              onClearAllData={handleClearAllData}
              privacyMaskActive={privacyMaskActive}
              onTogglePrivacyMask={() => setPrivacyMaskActive((prev) => !prev)}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingLogDate(undefined);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Health Data Modal */}
      <AddDataModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLogDate(undefined);
        }}
        onSave={handleSaveLog}
        existingLogs={logs}
        defaultDate={editingLogDate}
      />

      {/* Daily Check-in Modal */}
      <DailyCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onSave={handleSaveCheckIn}
        currentCheckIn={todayCheckIn}
      />
    </div>
  );
}
