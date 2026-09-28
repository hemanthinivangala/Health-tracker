export type HealthMetricType =
  | 'steps'
  | 'water'
  | 'sleep'
  | 'exercise'
  | 'heartRate'
  | 'bloodPressure'
  | 'weight'
  | 'height';

export type MoodType = 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
export type SleepQualityType = 'poor' | 'fair' | 'good' | 'excellent';

export interface HealthLogEntry {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  steps?: number;
  waterIntake?: number; // ml
  sleepDuration?: number; // hours
  sleepQuality?: SleepQualityType;
  exerciseMinutes?: number;
  exerciseType?: string;
  heartRate?: number; // bpm
  bloodPressureSys?: number; // mmHg
  bloodPressureDia?: number; // mmHg
  weight?: number; // kg
  height?: number; // cm
  mood?: MoodType;
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  metric: HealthMetricType;
  targetValue: number;
  unit: string;
  currentValue: number;
  frequency: 'daily' | 'weekly';
  streakDays: number;
  completedToday: boolean;
}

export interface DailyCheckIn {
  date: string;
  completed: boolean;
  mood: MoodType;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  sleepQuality: SleepQualityType;
  notes?: string;
  timestamp?: string;
}

export interface Reminder {
  id: string;
  title: string;
  category: 'water' | 'exercise' | 'sleep' | 'checkin' | 'custom';
  time: string; // "HH:MM"
  days: string[]; // ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  enabled: boolean;
  note?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number; // 0 to 100
  criteria: string;
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
  height: number; // cm
  weight: number; // kg
  unitSystem: 'metric' | 'imperial';
  dailyStepGoal: number;
  dailyWaterGoal: number; // ml
  dailySleepGoal: number; // hours
  dailyExerciseGoal: number; // minutes
  privacyConsentDate: string;
  pinLockEnabled: boolean;
}

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'metrics'
  | 'goals'
  | 'history'
  | 'reminders'
  | 'achievements'
  | 'profile';
