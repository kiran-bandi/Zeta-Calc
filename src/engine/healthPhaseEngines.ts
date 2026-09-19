/**
 * Phase 2: Health Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */
import { convertUnitValue } from './unitEngine';

// 8. Protein Calculator
export type ProteinGoal = 'sedentary' | 'light' | 'moderate' | 'endurance' | 'strength_hypertrophy' | 'fat_loss_high';

export interface ProteinResult {
  weightKg: number;
  weightLb: number;
  goal: ProteinGoal;
  goalLabel: string;
  lowMultiplier: number;
  highMultiplier: number;
  recommendedMultiplier: number;
  lowGrams: number;
  recommendedGrams: number;
  highGrams: number;
  perMeal3Grams: number;
  perMeal4Grams: number;
  perMeal5Grams: number;
  assumptions: string[];
}

const PROTEIN_MULTIPLIERS: Record<ProteinGoal, { label: string; low: number; rec: number; high: number; desc: string }> = {
  sedentary: {
    label: 'Sedentary (General Health / DRI Baseline)',
    low: 0.8,
    rec: 1.0,
    high: 1.2,
    desc: 'Minimum RDA recommendation for healthy adults with little to no regular exercise.',
  },
  light: {
    label: 'Light Activity (Casual Fitness / Walking)',
    low: 1.0,
    rec: 1.2,
    high: 1.4,
    desc: 'Recommended for recreational exercisers training 2-3 times per week.',
  },
  moderate: {
    label: 'Moderate Activity / Team Sports',
    low: 1.2,
    rec: 1.5,
    high: 1.7,
    desc: 'Suitable for active individuals, runners, cyclists, and team sport athletes.',
  },
  endurance: {
    label: 'Endurance Athlete (Marathon / Cycling / Tri)',
    low: 1.4,
    rec: 1.6,
    high: 1.8,
    desc: 'Maintains glycogen replenishment, reduces muscle catabolism, and accelerates tissue repair.',
  },
  strength_hypertrophy: {
    label: 'Muscle Growth & Strength Training (Hypertrophy)',
    low: 1.6,
    rec: 2.0,
    high: 2.2,
    desc: 'Optimizes muscle protein synthesis (MPS) for bodybuilders, powerlifters, and heavy resistance training.',
  },
  fat_loss_high: {
    label: 'Fat Loss While Preserving Lean Muscle (Caloric Deficit)',
    low: 1.8,
    rec: 2.2,
    high: 2.4,
    desc: 'Elevated protein during energy restriction spares lean mass and increases dietary thermogenesis/satiety.',
  },
};

export function calculateProtein(
  weight: number | '',
  weightUnit = 'kg',
  goal: ProteinGoal = 'moderate'
): ProteinResult | null {
  if (typeof weight !== 'number' || isNaN(weight) || weight <= 0) return null;

  const weightKg = convertUnitValue(weight, weightUnit, 'kg');
  const weightLb = convertUnitValue(weight, weightUnit, 'lb');
  const profile = PROTEIN_MULTIPLIERS[goal] || PROTEIN_MULTIPLIERS.moderate;

  const lowGrams = Math.round(weightKg * profile.low);
  const recommendedGrams = Math.round(weightKg * profile.rec);
  const highGrams = Math.round(weightKg * profile.high);

  return {
    weightKg: Math.round(weightKg * 10) / 10,
    weightLb: Math.round(weightLb * 10) / 10,
    goal,
    goalLabel: profile.label,
    lowMultiplier: profile.low,
    highMultiplier: profile.high,
    recommendedMultiplier: profile.rec,
    lowGrams,
    recommendedGrams,
    highGrams,
    perMeal3Grams: Math.round(recommendedGrams / 3),
    perMeal4Grams: Math.round(recommendedGrams / 4),
    perMeal5Grams: Math.round(recommendedGrams / 5),
    assumptions: [
      profile.desc,
      'Protein targets assume healthy kidney function and adequate total daily caloric intake.',
      'Distributing protein across 3 to 5 meals (20-40g per meal) optimizes muscle protein synthesis.',
    ],
  };
}

// 9. Sleep Calculator
export type SleepMode = 'wake_at' | 'sleep_at';

export interface SleepCandidateTime {
  timeStr: string;
  cycles: number;
  totalSleepHours: number;
  totalSleepMinutes: number;
  rating: 'optimal' | 'good' | 'acceptable';
  description: string;
}

export interface SleepResult {
  mode: SleepMode;
  targetTime: string;
  sleepLatencyMinutes: number;
  candidates: SleepCandidateTime[];
  assumptions: string[];
}

export function calculateSleep(
  mode: SleepMode,
  targetTimeStr: string,
  sleepLatencyMinutes: number | '' = 15
): SleepResult | null {
  if (!targetTimeStr || !targetTimeStr.includes(':')) return null;

  const [hoursStr, minsStr] = targetTimeStr.split(':');
  const hours = parseInt(hoursStr, 10);
  const mins = parseInt(minsStr, 10);
  if (isNaN(hours) || isNaN(mins) || hours < 0 || hours > 23 || mins < 0 || mins > 59) return null;

  const latency = typeof sleepLatencyMinutes === 'number' && !isNaN(sleepLatencyMinutes) && sleepLatencyMinutes >= 0 ? sleepLatencyMinutes : 15;
  const targetTotalMinutes = hours * 60 + mins;

  // Sleep cycles: 90 minutes each
  // Recommended 4 to 6 cycles (6h, 7.5h, 9h)
  const cycleCounts = [6, 5, 4, 3];
  const candidates: SleepCandidateTime[] = [];

  for (const cycles of cycleCounts) {
    const cycleDurationMinutes = cycles * 90;
    let candidateMinuteOfDay: number;

    if (mode === 'wake_at') {
      // Calculate bed time: wake time - cycle duration - latency
      candidateMinuteOfDay = (targetTotalMinutes - cycleDurationMinutes - latency + 24 * 60 * 2) % (24 * 60);
    } else {
      // Calculate wake time: sleep time + latency + cycle duration
      candidateMinuteOfDay = (targetTotalMinutes + latency + cycleDurationMinutes) % (24 * 60);
    }

    const cHours = Math.floor(candidateMinuteOfDay / 60);
    const cMins = candidateMinuteOfDay % 60;
    const ampm = cHours >= 12 ? 'PM' : 'AM';
    const displayHours = cHours % 12 === 0 ? 12 : cHours % 12;
    const displayMins = cMins < 10 ? `0${cMins}` : `${cMins}`;
    const formatted = `${displayHours}:${displayMins} ${ampm}`;

    const totalSleepHours = Math.floor(cycleDurationMinutes / 60);
    const remMins = cycleDurationMinutes % 60;

    let rating: 'optimal' | 'good' | 'acceptable' = 'good';
    let description = `${cycles} sleep cycles (${totalSleepHours}h ${remMins > 0 ? `${remMins}m` : ''})`;

    if (cycles === 5) {
      rating = 'optimal';
      description = `${cycles} cycles (7.5 hours) — Most recommended for adults`;
    } else if (cycles === 6) {
      rating = 'optimal';
      description = `${cycles} cycles (9 hours) — Ideal for heavy physical recovery`;
    } else if (cycles === 4) {
      rating = 'good';
      description = `${cycles} cycles (6 hours) — Minimum healthy sleep duration`;
    } else {
      rating = 'acceptable';
      description = `${cycles} cycles (4.5 hours) — Short rest / power nap cycle`;
    }

    candidates.push({
      timeStr: formatted,
      cycles,
      totalSleepHours: Math.round((cycleDurationMinutes / 60) * 10) / 10,
      totalSleepMinutes: cycleDurationMinutes,
      rating,
      description,
    });
  }

  return {
    mode,
    targetTime: targetTimeStr,
    sleepLatencyMinutes: latency,
    candidates,
    assumptions: [
      'Calculations use standard 90-minute sleep cycles (NREM + REM phases).',
      `Includes an estimated ${latency} minutes sleep onset latency (time to fall asleep).`,
      'Waking at the end of a sleep cycle minimizes morning grogginess and sleep inertia.',
    ],
  };
}

// 10. Ovulation Calculator
export interface OvulationResult {
  lmpDateStr: string;
  cycleLength: number;
  lutealPhase: number;
  estimatedOvulationDateStr: string;
  fertileWindowStartStr: string;
  fertileWindowEndStr: string;
  nextPeriodDateStr: string;
  probableConceptionDatesStr: string;
  cycleDayOfOvulation: number;
  assumptions: string[];
}

function formatDateDisplay(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateOvulation(
  lmpDateStr: string,
  cycleLength: number | '' = 28,
  lutealPhase: number | '' = 14
): OvulationResult | null {
  if (!lmpDateStr) return null;

  const lmpDate = new Date(lmpDateStr);
  if (isNaN(lmpDate.getTime())) return null;

  const cycle = typeof cycleLength === 'number' && !isNaN(cycleLength) && cycleLength >= 20 && cycleLength <= 45 ? cycleLength : 28;
  const luteal = typeof lutealPhase === 'number' && !isNaN(lutealPhase) && lutealPhase >= 10 && lutealPhase <= 16 ? lutealPhase : 14;

  const ovulationDayOffset = cycle - luteal;
  if (ovulationDayOffset <= 0) return null;

  const ovulationDate = new Date(lmpDate.getTime() + ovulationDayOffset * 86400000);
  const fertileStart = new Date(ovulationDate.getTime() - 5 * 86400000);
  const fertileEnd = new Date(ovulationDate.getTime() + 1 * 86400000);
  const nextPeriod = new Date(lmpDate.getTime() + cycle * 86400000);

  return {
    lmpDateStr,
    cycleLength: cycle,
    lutealPhase: luteal,
    estimatedOvulationDateStr: formatDateDisplay(ovulationDate),
    fertileWindowStartStr: formatDateDisplay(fertileStart),
    fertileWindowEndStr: formatDateDisplay(fertileEnd),
    nextPeriodDateStr: formatDateDisplay(nextPeriod),
    probableConceptionDatesStr: `${formatDateDisplay(fertileStart)} – ${formatDateDisplay(fertileEnd)}`,
    cycleDayOfOvulation: ovulationDayOffset + 1,
    assumptions: [
      `Assumes a regular menstrual cycle of ${cycle} days with a ${luteal}-day luteal phase.`,
      'The fertile window spans 5 days prior to ovulation plus ovulation day (sperm survival ~5 days, ovum ~24h).',
      'This calculation is an estimation for educational/planning purposes and should not be used as contraception.',
    ],
  };
}
