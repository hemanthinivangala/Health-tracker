import {
  HealthLogEntry,
  Goal,
  DailyCheckIn,
  Reminder,
  Achievement,
  UserProfile,
} from '../types/health';
import { formatDateToIso, getPastDates } from '../utils/dateUtils';

export const initialProfile: UserProfile = {
  name: 'Alex Taylor',
  email: 'alex.taylor@example.com',
  age: 32,
  gender: 'non-binary',
  height: 175, // cm
  weight: 68.4, // kg
  unitSystem: 'metric',
  dailyStepGoal: 8500,
  dailyWaterGoal: 2400, // ml
  dailySleepGoal: 7.5, // hours
  dailyExerciseGoal: 30, // minutes
  privacyConsentDate: '2026-09-01',
  pinLockEnabled: false,
};

export const initialGoals: Goal[] = [
  {
    id: 'goal-water',
    title: 'Daily Hydration Target',
    metric: 'water',
    targetValue: 2400,
    unit: 'ml',
    currentValue: 1800,
    frequency: 'daily',
    streakDays: 6,
    completedToday: false,
  },
  {
    id: 'goal-steps',
    title: 'Walking & Physical Movement',
    metric: 'steps',
    targetValue: 8500,
    unit: 'steps',
    currentValue: 8940,
    frequency: 'daily',
    streakDays: 9,
    completedToday: true,
  },
  {
    id: 'goal-sleep',
    title: 'Restorative Night Sleep',
    metric: 'sleep',
    targetValue: 7.5,
    unit: 'hrs',
    currentValue: 7.8,
    frequency: 'daily',
    streakDays: 4,
    completedToday: true,
  },
  {
    id: 'goal-exercise',
    title: 'Moderate Activity & Workout',
    metric: 'exercise',
    targetValue: 30,
    unit: 'min',
    currentValue: 35,
    frequency: 'daily',
    streakDays: 5,
    completedToday: true,
  },
];

export const initialReminders: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Morning Hydration & Glass of Water',
    category: 'water',
    time: '08:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    note: 'Start the morning with 350ml room temperature water.',
  },
  {
    id: 'rem-2',
    title: 'Midday Movement & Posture Reset',
    category: 'exercise',
    time: '12:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    enabled: true,
    note: 'Step away from the screen for a 10-minute refreshing walk.',
  },
  {
    id: 'rem-3',
    title: 'Evening Health & Mood Check-in',
    category: 'checkin',
    time: '20:30',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: true,
    note: 'Log your energy level, mood, and day reflections.',
  },
  {
    id: 'rem-4',
    title: 'Wind-down & Blue Light Dimming',
    category: 'sleep',
    time: '22:15',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    enabled: false,
    note: 'Prepare for restful sleep with gentle dim lights.',
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Mindful Beginnings',
    description: 'Logged your very first daily health check-in.',
    category: 'Consistency',
    iconName: 'Sparkles',
    unlocked: true,
    unlockedAt: '2026-09-14',
    progress: 100,
    criteria: '1 check-in logged',
  },
  {
    id: 'ach-2',
    title: 'Hydration Anchor',
    description: 'Reached daily water goal 5 consecutive days.',
    category: 'Hydration',
    iconName: 'Droplets',
    unlocked: true,
    unlockedAt: '2026-09-22',
    progress: 100,
    criteria: '5-day hydration streak',
  },
  {
    id: 'ach-3',
    title: 'Restorative Rhythm',
    description: 'Logged 7+ hours of quality sleep for 7 nights.',
    category: 'Sleep',
    iconName: 'Moon',
    unlocked: true,
    unlockedAt: '2026-09-26',
    progress: 100,
    criteria: '7 nights with 7+ hours sleep',
  },
  {
    id: 'ach-4',
    title: 'Step Explorer',
    description: 'Accumulate over 50,000 steps across your tracking history.',
    category: 'Movement',
    iconName: 'Footprints',
    unlocked: true,
    unlockedAt: '2026-09-25',
    progress: 100,
    criteria: '50,000 cumulative steps',
  },
  {
    id: 'ach-5',
    title: 'Consistent Mover',
    description: 'Record active exercise sessions 10 times in a month.',
    category: 'Exercise',
    iconName: 'Activity',
    unlocked: false,
    progress: 80,
    criteria: '8 of 10 exercise sessions completed',
  },
  {
    id: 'ach-6',
    title: 'Holistic Awareness',
    description: 'Track all 8 wellness metrics within a single week.',
    category: 'Health Literacy',
    iconName: 'ShieldCheck',
    unlocked: true,
    unlockedAt: '2026-09-27',
    progress: 100,
    criteria: '8 metrics tracked in 7 days',
  },
];

export function generateInitialLogs(): HealthLogEntry[] {
  const dates = getPastDates(14); // last 14 days including today
  const sampleActivities = [
    'Brisk Walking',
    'Morning Jog',
    'Vinyasa Yoga',
    'Cycling',
    'Pilates Core',
    'Evening Stroll',
    'Bodyweight Routine',
  ];
  const sampleMoods: ('great' | 'good' | 'neutral')[] = ['good', 'great', 'good', 'neutral', 'great', 'good'];
  const sampleQualities: ('good' | 'excellent' | 'fair')[] = ['good', 'excellent', 'good', 'good', 'fair', 'excellent'];

  const logs: HealthLogEntry[] = dates.map((dateStr, idx) => {
    const isToday = idx === dates.length - 1;
    const baseSteps = 8200 + ((idx * 370) % 2100) - (idx % 3 === 0 ? 900 : 0);
    const baseWater = 2100 + ((idx * 250) % 800) - (isToday ? 500 : 0);
    const baseSleep = 7.1 + ((idx * 3) % 15) / 10;
    const baseExercise = 25 + ((idx * 7) % 25);
    const heartRate = 66 + (idx % 6);
    const sysBp = 117 + (idx % 5);
    const diaBp = 76 + (idx % 4);
    const weight = 68.6 - (idx * 0.03);

    return {
      id: `log-${dateStr}`,
      timestamp: `${dateStr}T${isToday ? '11:45:00' : '19:30:00'}Z`,
      date: dateStr,
      steps: isToday ? 8940 : baseSteps,
      waterIntake: isToday ? 1800 : baseWater,
      sleepDuration: isToday ? 7.8 : Number(baseSleep.toFixed(1)),
      sleepQuality: sampleQualities[idx % sampleQualities.length],
      exerciseMinutes: isToday ? 35 : baseExercise,
      exerciseType: sampleActivities[idx % sampleActivities.length],
      heartRate: heartRate,
      bloodPressureSys: sysBp,
      bloodPressureDia: diaBp,
      weight: Number(weight.toFixed(1)),
      height: 175,
      mood: sampleMoods[idx % sampleMoods.length],
      energyLevel: ((idx % 3) + 3) as 3 | 4 | 5,
      notes: isToday
        ? 'Felt energized after morning walk. Remember to drink remaining water bottle before dinner.'
        : idx % 2 === 0
        ? 'Consistent steady pacing throughout workday.'
        : 'Good restorative sleep and feeling light.',
    };
  });

  return logs;
}

export const initialTodayCheckIn: DailyCheckIn = {
  date: formatDateToIso(),
  completed: true,
  mood: 'good',
  energyLevel: 4,
  sleepQuality: 'good',
  notes: 'Clear mind and steady breathing. Focused on staying well hydrated throughout the afternoon.',
  timestamp: new Date().toISOString(),
};
