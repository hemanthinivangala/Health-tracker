import { Goal, HealthLogEntry, DailyCheckIn } from '../types/health';

export interface WellnessScoreBreakdown {
  totalScore: number; // 0 to 100
  factors: {
    name: string;
    score: number; // 0 to 100
    target: string;
    actual: string;
    completed: boolean;
    weightPercent: number;
  }[];
  summaryText: string;
  disclaimer: string;
}

/**
 * Calculates a non-diagnostic daily wellness score based exclusively on lifestyle habit targets.
 */
export function calculateWellnessScore(
  todayLog: HealthLogEntry | undefined,
  goals: Goal[],
  todayCheckIn: DailyCheckIn | undefined
): WellnessScoreBreakdown {
  const factors: WellnessScoreBreakdown['factors'] = [];

  // 1. Hydration
  const waterGoal = goals.find((g) => g.metric === 'water') || { targetValue: 2000, unit: 'ml' };
  const waterActual = todayLog?.waterIntake ?? 0;
  const waterRatio = Math.min(1, waterActual / waterGoal.targetValue);
  const waterScore = Math.round(waterRatio * 100);
  factors.push({
    name: 'Hydration Target',
    score: waterScore,
    target: `${waterGoal.targetValue.toLocaleString()} ml`,
    actual: `${waterActual.toLocaleString()} ml`,
    completed: waterRatio >= 1,
    weightPercent: 20,
  });

  // 2. Steps / Physical Movement
  const stepsGoal = goals.find((g) => g.metric === 'steps') || { targetValue: 8000, unit: 'steps' };
  const stepsActual = todayLog?.steps ?? 0;
  const stepsRatio = Math.min(1, stepsActual / stepsGoal.targetValue);
  const stepsScore = Math.round(stepsRatio * 100);
  factors.push({
    name: 'Daily Steps',
    score: stepsScore,
    target: `${stepsGoal.targetValue.toLocaleString()} steps`,
    actual: `${stepsActual.toLocaleString()} steps`,
    completed: stepsRatio >= 1,
    weightPercent: 25,
  });

  // 3. Sleep Rest
  const sleepGoal = goals.find((g) => g.metric === 'sleep') || { targetValue: 7.5, unit: 'hrs' };
  const sleepActual = todayLog?.sleepDuration ?? 0;
  const sleepRatio = Math.min(1, sleepActual / sleepGoal.targetValue);
  const sleepScore = Math.round(sleepRatio * 100);
  factors.push({
    name: 'Restorative Sleep',
    score: sleepScore,
    target: `${sleepGoal.targetValue} hrs`,
    actual: `${sleepActual} hrs`,
    completed: sleepRatio >= 1,
    weightPercent: 25,
  });

  // 4. Active Exercise
  const exerciseGoal = goals.find((g) => g.metric === 'exercise') || { targetValue: 30, unit: 'min' };
  const exerciseActual = todayLog?.exerciseMinutes ?? 0;
  const exerciseRatio = Math.min(1, exerciseActual / exerciseGoal.targetValue);
  const exerciseScore = Math.round(exerciseRatio * 100);
  factors.push({
    name: 'Active Exercise',
    score: exerciseScore,
    target: `${exerciseGoal.targetValue} min`,
    actual: `${exerciseActual} min`,
    completed: exerciseRatio >= 1,
    weightPercent: 15,
  });

  // 5. Daily Check-in / Mindfulness
  const checkInCompleted = todayCheckIn?.completed || (todayLog?.mood !== undefined);
  const checkInScore = checkInCompleted ? 100 : 0;
  factors.push({
    name: 'Daily Check-in',
    score: checkInScore,
    target: 'Logged once',
    actual: checkInCompleted ? 'Completed' : 'Not yet logged',
    completed: checkInCompleted,
    weightPercent: 15,
  });

  // Weighted total
  const totalScore = Math.round(
    factors.reduce((acc, f) => acc + (f.score * f.weightPercent) / 100, 0)
  );

  let summaryText = 'Tracking off to a calm start. Keep logging your habits today.';
  if (totalScore >= 85) {
    summaryText = 'Outstanding habit consistency across hydration, sleep, and physical activity today.';
  } else if (totalScore >= 65) {
    summaryText = 'Solid daily wellness balance with steady progress across your personal targets.';
  } else if (totalScore >= 40) {
    summaryText = 'Gentle progress logged today. A short walk or water refill will elevate your balance.';
  }

  return {
    totalScore,
    factors,
    summaryText,
    disclaimer:
      'Wellness score is a lifestyle tracking summary reflecting habit fulfillment and does not constitute a clinical assessment or medical diagnosis.',
  };
}
