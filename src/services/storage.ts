import {
  HealthLogEntry,
  Goal,
  DailyCheckIn,
  Reminder,
  Achievement,
  UserProfile,
} from '../types/health';
import {
  initialProfile,
  initialGoals,
  initialReminders,
  initialAchievements,
  generateInitialLogs,
  initialTodayCheckIn,
} from '../data/initialData';
import { formatDateToIso } from '../utils/dateUtils';

const STORAGE_KEYS = {
  LOGS: 'healthtrack_logs_v1',
  GOALS: 'healthtrack_goals_v1',
  REMINDERS: 'healthtrack_reminders_v1',
  ACHIEVEMENTS: 'healthtrack_achievements_v1',
  PROFILE: 'healthtrack_profile_v1',
  CHECKIN: 'healthtrack_checkin_v1',
};

export const storageService = {
  getLogs(): HealthLogEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
      if (!raw) {
        const seeded = generateInitialLogs();
        localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(seeded));
        return seeded;
      }
      return JSON.parse(raw);
    } catch {
      return generateInitialLogs();
    }
  },

  saveLogs(logs: HealthLogEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch (err) {
      console.error('Failed to save logs to localStorage', err);
    }
  },

  addOrUpdateLog(newEntry: Partial<HealthLogEntry> & { date: string }): HealthLogEntry[] {
    const logs = this.getLogs();
    const existingIndex = logs.findIndex((l) => l.date === newEntry.date);

    let updatedLogs: HealthLogEntry[];
    if (existingIndex >= 0) {
      // Merge with existing entry
      const existing = logs[existingIndex];
      const updated: HealthLogEntry = {
        ...existing,
        ...newEntry,
        timestamp: new Date().toISOString(),
      };
      updatedLogs = [...logs];
      updatedLogs[existingIndex] = updated;
    } else {
      const created: HealthLogEntry = {
        id: `log-${newEntry.date}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...newEntry,
      };
      updatedLogs = [...logs, created].sort((a, b) => a.date.localeCompare(b.date));
    }

    this.saveLogs(updatedLogs);
    return updatedLogs;
  },

  deleteLog(id: string): HealthLogEntry[] {
    const logs = this.getLogs().filter((l) => l.id !== id);
    this.saveLogs(logs);
    return logs;
  },

  getGoals(): Goal[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(initialGoals));
        return initialGoals;
      }
      return JSON.parse(raw);
    } catch {
      return initialGoals;
    }
  },

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  updateGoalProgress(goalId: string, deltaOrValue: number, isDirectValue = false): Goal[] {
    const goals = this.getGoals();
    const updated = goals.map((g) => {
      if (g.id === goalId) {
        const newVal = isDirectValue ? deltaOrValue : Math.max(0, g.currentValue + deltaOrValue);
        const completed = newVal >= g.targetValue;
        return {
          ...g,
          currentValue: newVal,
          completedToday: completed,
          streakDays: completed && !g.completedToday ? g.streakDays + 1 : g.streakDays,
        };
      }
      return g;
    });
    this.saveGoals(updated);
    return updated;
  },

  getReminders(): Reminder[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(initialReminders));
        return initialReminders;
      }
      return JSON.parse(raw);
    } catch {
      return initialReminders;
    }
  },

  saveReminders(reminders: Reminder[]): void {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  },

  getAchievements(): Achievement[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(initialAchievements));
        return initialAchievements;
      }
      return JSON.parse(raw);
    } catch {
      return initialAchievements;
    }
  },

  saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  getProfile(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(initialProfile));
        return initialProfile;
      }
      return JSON.parse(raw);
    } catch {
      return initialProfile;
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getTodayCheckIn(): DailyCheckIn {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CHECKIN);
      const todayStr = formatDateToIso();
      if (!raw) {
        return {
          ...initialTodayCheckIn,
          date: todayStr,
        };
      }
      const parsed: DailyCheckIn = JSON.parse(raw);
      if (parsed.date !== todayStr) {
        return {
          date: todayStr,
          completed: false,
          mood: 'good',
          energyLevel: 4,
          sleepQuality: 'good',
          notes: '',
        };
      }
      return parsed;
    } catch {
      return {
        date: formatDateToIso(),
        completed: false,
        mood: 'good',
        energyLevel: 4,
        sleepQuality: 'good',
        notes: '',
      };
    }
  },

  saveTodayCheckIn(checkIn: DailyCheckIn): void {
    localStorage.setItem(STORAGE_KEYS.CHECKIN, JSON.stringify(checkIn));
  },

  exportAllDataAsJson(): string {
    const data = {
      app: 'HealthTrack',
      exportedAt: new Date().toISOString(),
      profile: this.getProfile(),
      logs: this.getLogs(),
      goals: this.getGoals(),
      reminders: this.getReminders(),
      achievements: this.getAchievements(),
      todayCheckIn: this.getTodayCheckIn(),
    };
    return JSON.stringify(data, null, 2);
  },

  exportLogsAsCsv(): string {
    const logs = this.getLogs();
    const headers = [
      'Date',
      'Steps',
      'Water_ml',
      'Sleep_hrs',
      'Sleep_Quality',
      'Exercise_min',
      'Exercise_Type',
      'Heart_Rate_bpm',
      'BP_Systolic',
      'BP_Diastolic',
      'Weight_kg',
      'Mood',
      'Energy_Level',
      'Notes',
    ];

    const rows = logs.map((l) => [
      l.date,
      l.steps ?? '',
      l.waterIntake ?? '',
      l.sleepDuration ?? '',
      l.sleepQuality ?? '',
      l.exerciseMinutes ?? '',
      `"${(l.exerciseType ?? '').replace(/"/g, '""')}"`,
      l.heartRate ?? '',
      l.bloodPressureSys ?? '',
      l.bloodPressureDia ?? '',
      l.weight ?? '',
      l.mood ?? '',
      l.energyLevel ?? '',
      `"${(l.notes ?? '').replace(/"/g, '""')}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  },

  importDataFromJson(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.profile) this.saveProfile(data.profile);
      if (Array.isArray(data.logs)) this.saveLogs(data.logs);
      if (Array.isArray(data.goals)) this.saveGoals(data.goals);
      if (Array.isArray(data.reminders)) this.saveReminders(data.reminders);
      if (Array.isArray(data.achievements)) this.saveAchievements(data.achievements);
      return true;
    } catch {
      return false;
    }
  },

  resetToDefaultData(): void {
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.GOALS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.CHECKIN);
  },

  clearAllData(): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.CHECKIN);
  },
};
