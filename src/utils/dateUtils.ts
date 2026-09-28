/**
 * Date utility helpers for HealthTrack
 */

export function formatDateToIso(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const d = new Date(year, month, day);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

export function formatFullHeaderDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getPastDates(daysCount: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDateToIso(d));
  }
  return dates;
}

export function formatTimeFriendly(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '12:00 PM';
  }
}

export function calculateBmi(weightKg: number, heightCm: number): {
  bmi: number;
  category: string;
  colorClass: string;
} {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 0, category: 'N/A', colorClass: 'text-slate-500' };
  }
  const heightMeters = heightCm / 100;
  const bmi = Number((weightKg / (heightMeters * heightMeters)).toFixed(1));

  let category = 'Normal';
  let colorClass = 'text-emerald-700';

  if (bmi < 18.5) {
    category = 'Underweight range';
    colorClass = 'text-sky-700';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Standard healthy range';
    colorClass = 'text-emerald-700';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Over standard range';
    colorClass = 'text-amber-700';
  } else {
    category = 'Elevated range';
    colorClass = 'text-orange-700';
  }

  return { bmi, category, colorClass };
}
