export interface BMIInput {
  heightCm: number;
  weightKg: number;
  age?: number;
  gender?: 'male' | 'female';
}

export type BMICategory =
  | 'Severe Thinness'
  | 'Moderate Thinness'
  | 'Mild Thinness'
  | 'Normal weight'
  | 'Overweight'
  | 'Obese Class I'
  | 'Obese Class II'
  | 'Obese Class III';

export interface BMIResult {
  bmi: number;
  category: BMICategory;
  categoryColor: string; // Tailwind color token
  healthyWeightRangeKg: { min: number; max: number };
  bmiPrime: number;
  ponderalIndex: number;
  differenceToNormalKg: number; // positive = excess, negative = underweight, 0 = normal
}

export function calculateBMI(input: BMIInput): BMIResult {
  const heightM = Math.max(0.5, input.heightCm / 100);
  const weight = Math.max(1, input.weightKg);

  const rawBmi = weight / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;

  let category: BMICategory = 'Normal weight';
  let categoryColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (bmi < 16.0) {
    category = 'Severe Thinness';
    categoryColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (bmi < 17.0) {
    category = 'Moderate Thinness';
    categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi < 18.5) {
    category = 'Mild Thinness';
    categoryColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmi < 25.0) {
    category = 'Normal weight';
    categoryColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (bmi < 30.0) {
    category = 'Overweight';
    categoryColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (bmi < 35.0) {
    category = 'Obese Class I';
    categoryColor = 'text-orange-700 bg-orange-50 border-orange-200';
  } else if (bmi < 40.0) {
    category = 'Obese Class II';
    categoryColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else {
    category = 'Obese Class III';
    categoryColor = 'text-purple-800 bg-purple-50 border-purple-200';
  }

  // WHO healthy BMI range is 18.5 to 24.9
  const minNormalWeight = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxNormalWeight = Math.round(24.9 * heightM * heightM * 10) / 10;

  let differenceToNormalKg = 0;
  if (weight < minNormalWeight) {
    differenceToNormalKg = Math.round((weight - minNormalWeight) * 10) / 10;
  } else if (weight > maxNormalWeight) {
    differenceToNormalKg = Math.round((weight - maxNormalWeight) * 10) / 10;
  }

  const bmiPrime = Math.round((bmi / 25) * 100) / 100;
  const ponderalIndex = Math.round((weight / Math.pow(heightM, 3)) * 10) / 10;

  return {
    bmi,
    category,
    categoryColor,
    healthyWeightRangeKg: { min: minNormalWeight, max: maxNormalWeight },
    bmiPrime,
    ponderalIndex,
    differenceToNormalKg,
  };
}

export interface TDEEInput {
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete';
  goal: 'maintain' | 'mild_loss' | 'weight_loss' | 'extreme_loss' | 'mild_gain' | 'weight_gain';
}

export interface TDEEResult {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Maintenance calories
  targetCalories: number;
  macros: {
    proteinGrams: number;
    proteinCalories: number;
    carbsGrams: number;
    carbsCalories: number;
    fatGrams: number;
    fatCalories: number;
  };
}

export function calculateTDEE(input: TDEEInput): TDEEResult {
  const age = Math.max(10, input.age);
  const weight = Math.max(20, input.weightKg);
  const height = Math.max(50, input.heightCm);

  // Mifflin-St Jeor formula
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (input.gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  bmr = Math.round(bmr);

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2, // desk job, little exercise
    light: 1.375, // 1-3 days/week
    moderate: 1.55, // 3-5 days/week
    very_active: 1.725, // 6-7 days/week
    athlete: 1.9, // 2x/day intense training
  };

  const multiplier = activityMultipliers[input.activityLevel] || 1.375;
  const tdee = Math.round(bmr * multiplier);

  const goalAdjustments: Record<string, number> = {
    maintain: 0,
    mild_loss: -250, // ~0.25 kg / 0.5 lb per week
    weight_loss: -500, // ~0.5 kg / 1 lb per week
    extreme_loss: -1000, // ~1 kg / 2 lb per week
    mild_gain: 250, // lean bulk
    weight_gain: 500, // standard bulk
  };

  const adjustment = goalAdjustments[input.goal] || 0;
  const targetCalories = Math.max(1000, tdee + adjustment);

  // Standard balanced macronutrient split: 30% Protein, 40% Carbs, 30% Fat
  const proteinCalories = Math.round(targetCalories * 0.3);
  const carbsCalories = Math.round(targetCalories * 0.4);
  const fatCalories = Math.round(targetCalories * 0.3);

  // 4 kcal per gram of protein & carbs, 9 kcal per gram of fat
  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    bmr,
    tdee,
    targetCalories,
    macros: {
      proteinGrams,
      proteinCalories,
      carbsGrams,
      carbsCalories,
      fatGrams,
      fatCalories,
    },
  };
}

/**
 * Standard disclaimer required for all health, pregnancy, and fitness calculations.
 */
export const HEALTH_DISCLAIMER =
  'This calculator is for informational and educational purposes only and is based on generalized statistical formulas. It does not constitute medical advice, diagnosis, treatment, or clinical assessment. Individual health factors vary significantly. Always consult a qualified physician or healthcare provider for any health or pregnancy concerns.';

export interface BodyFatInput {
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  neckCm: number;
  hipCm?: number; // Required for females
}

export interface BodyFatResult {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  category: string;
  idealRange: { min: number; max: number };
}

/**
 * U.S. Navy Body Fat Formula
 * For Men: %BF = 495 / (1.0324 - 0.19077*log10(waist - neck) + 0.15456*log10(height)) - 450
 * For Women: %BF = 495 / (1.29579 - 0.35004*log10(waist + hip - neck) + 0.22100*log10(height)) - 450
 */
export function calculateBodyFat(input: BodyFatInput): BodyFatResult {
  const height = Math.max(100, input.heightCm);
  const weight = Math.max(30, input.weightKg);
  const neck = Math.max(20, input.neckCm);
  const waist = Math.max(40, input.waistCm);

  let bf = 15;
  if (input.gender === 'male') {
    const diff = Math.max(1, waist - neck);
    const denom = 1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(height);
    bf = 495 / denom - 450;
  } else {
    const hip = Math.max(50, input.hipCm || waist * 1.15);
    const diff = Math.max(1, waist + hip - neck);
    const denom = 1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(height);
    bf = 495 / denom - 450;
  }

  // Constrain to realistic range
  const bodyFatPercentage = Math.max(3, Math.min(60, Math.round(bf * 10) / 10));
  const fatMassKg = Math.round(((weight * bodyFatPercentage) / 100) * 10) / 10;
  const leanMassKg = Math.round((weight - fatMassKg) * 10) / 10;

  let category = 'Average';
  let idealRange = { min: 14, max: 24 };
  if (input.gender === 'male') {
    idealRange = { min: 10, max: 20 };
    if (bodyFatPercentage < 6) category = 'Essential Fat';
    else if (bodyFatPercentage <= 13) category = 'Athletes';
    else if (bodyFatPercentage <= 17) category = 'Fitness';
    else if (bodyFatPercentage <= 24) category = 'Average';
    else category = 'Obese';
  } else {
    idealRange = { min: 18, max: 28 };
    if (bodyFatPercentage < 14) category = 'Essential Fat';
    else if (bodyFatPercentage <= 20) category = 'Athletes';
    else if (bodyFatPercentage <= 24) category = 'Fitness';
    else if (bodyFatPercentage <= 31) category = 'Average';
    else category = 'Obese';
  }

  return {
    bodyFatPercentage,
    fatMassKg,
    leanMassKg,
    category,
    idealRange,
  };
}

export interface IdealWeightResult {
  devineKg: number;
  robinsonKg: number;
  millerKg: number;
  hamwiKg: number;
  healthyBMIRangeKg: { min: number; max: number };
}

/**
 * Calculates Ideal Body Weight (IBW) based on traditional clinical formulas (Devine, Robinson, Miller, Hamwi).
 */
export function calculateIdealWeight(gender: 'male' | 'female', heightCm: number): IdealWeightResult {
  const heightInches = Math.max(48, heightCm / 2.54);
  const inchesOver60 = Math.max(0, heightInches - 60);

  let devine = 0;
  let robinson = 0;
  let miller = 0;
  let hamwi = 0;

  if (gender === 'male') {
    devine = 50 + 2.3 * inchesOver60;
    robinson = 52 + 1.9 * inchesOver60;
    miller = 56.2 + 1.41 * inchesOver60;
    hamwi = 48 + 2.7 * inchesOver60;
  } else {
    devine = 45.5 + 2.3 * inchesOver60;
    robinson = 49 + 1.7 * inchesOver60;
    miller = 53.1 + 1.36 * inchesOver60;
    hamwi = 45.5 + 2.2 * inchesOver60;
  }

  const heightM = heightCm / 100;
  const minNormal = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxNormal = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    devineKg: Math.round(devine * 10) / 10,
    robinsonKg: Math.round(robinson * 10) / 10,
    millerKg: Math.round(miller * 10) / 10,
    hamwiKg: Math.round(hamwi * 10) / 10,
    healthyBMIRangeKg: { min: minNormal, max: maxNormal },
  };
}

export interface PaceInput {
  distanceKm: number;
  timeHours: number;
  timeMinutes: number;
  timeSeconds: number;
}

export interface PaceResult {
  paceMinPerKm: string;
  paceMinPerMile: string;
  speedKmh: number;
  speedMph: number;
  splits: { km: number; splitTime: string }[];
}

export function calculatePace(input: PaceInput): PaceResult {
  const dist = Math.max(0.1, input.distanceKm);
  const totalSeconds = input.timeHours * 3600 + input.timeMinutes * 60 + input.timeSeconds;
  const safeSeconds = Math.max(1, totalSeconds);

  const secondsPerKm = safeSeconds / dist;
  const roundSecKm = Math.round(secondsPerKm);
  const pKmMin = Math.floor(roundSecKm / 60);
  const pKmSec = roundSecKm % 60;
  const paceMinPerKm = `${pKmMin}:${pKmSec.toString().padStart(2, '0')} /km`;

  const distMiles = dist * 0.621371;
  const secondsPerMile = safeSeconds / distMiles;
  const roundSecMi = Math.round(secondsPerMile);
  const pMiMin = Math.floor(roundSecMi / 60);
  const pMiSec = roundSecMi % 60;
  const paceMinPerMile = `${pMiMin}:${pMiSec.toString().padStart(2, '0')} /mi`;

  const speedKmh = Math.round((dist / (safeSeconds / 3600)) * 100) / 100;
  const speedMph = Math.round((distMiles / (safeSeconds / 3600)) * 100) / 100;

  const splits = [];
  const maxKm = Math.min(10, Math.ceil(dist));
  for (let k = 1; k <= maxKm; k++) {
    const elapsed = Math.round(secondsPerKm * k);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    splits.push({ km: k, splitTime: `${m}:${s.toString().padStart(2, '0')}` });
  }

  return {
    paceMinPerKm,
    paceMinPerMile,
    speedKmh,
    speedMph,
    splits,
  };
}

export interface PregnancyInput {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleDays?: number; // default 28
}

export interface PregnancyResult {
  dueDate: string;
  dueDateFormatted?: string;
  conceptionDate: string;
  estimatedConceptionDateFormatted?: string;
  currentWeeks: number;
  currentDays: number;
  trimester: 1 | 2 | 3;
  daysRemaining: number;
  progressPercent: number;
  milestone: string;
}

/**
 * Standard Naegele's rule calculation:
 * Due date = LMP + 280 days + (cycleDays - 28)
 */
export function calculatePregnancy(input: PregnancyInput): PregnancyResult | null {
  const lmp = new Date(input.lastPeriodDate);
  if (isNaN(lmp.getTime())) return null;

  const cycleAdjustment = (input.cycleDays || 28) - 28;
  const dueDateMs = lmp.getTime() + (280 + cycleAdjustment) * 86400000;
  const dueDate = new Date(dueDateMs);

  // Conception is approximately 14 days after LMP + cycleAdjustment
  const conceptionDate = new Date(lmp.getTime() + (14 + cycleAdjustment) * 86400000);

  const today = new Date();
  const elapsedMs = today.getTime() - lmp.getTime();
  const elapsedDays = Math.max(0, Math.floor(elapsedMs / 86400000));
  const currentWeeks = Math.floor(elapsedDays / 7);
  const currentDays = elapsedDays % 7;

  const remainingDays = Math.max(0, Math.floor((dueDateMs - today.getTime()) / 86400000));
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedDays / 280) * 100)));

  let trimester: 1 | 2 | 3 = 1;
  let milestone = 'First Trimester: Early cellular development and organogenesis.';
  if (currentWeeks >= 28) {
    trimester = 3;
    milestone = 'Third Trimester: Rapid growth, lung maturation, and final preparation for birth.';
  } else if (currentWeeks >= 13) {
    trimester = 2;
    milestone = 'Second Trimester: Fetal movements, skeletal development, and ultrasound scan window.';
  }

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    dueDate: dueDate.toISOString().split('T')[0],
    dueDateFormatted: fmt(dueDate),
    conceptionDate: conceptionDate.toISOString().split('T')[0],
    estimatedConceptionDateFormatted: fmt(conceptionDate),
    currentWeeks,
    currentDays,
    trimester,
    daysRemaining: remainingDays,
    progressPercent,
    milestone,
  };
}

export interface ConceptionResult {
  probableConceptionDate: string;
  fertileWindow: string;
}

export function calculatePregnancyConception(dueDateStr: string): ConceptionResult {
  const due = new Date(dueDateStr);
  if (isNaN(due.getTime())) {
    return {
      probableConceptionDate: 'Invalid date',
      fertileWindow: 'N/A',
    };
  }

  // Conception is approximately 266 days before due date
  const conceptionMs = due.getTime() - 266 * 86400000;
  const conceptionDate = new Date(conceptionMs);

  const fertileStart = new Date(conceptionMs - 5 * 86400000);
  const fertileEnd = new Date(conceptionMs + 1 * 86400000);

  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    probableConceptionDate: fmt(conceptionDate),
    fertileWindow: `${fmt(fertileStart)} – ${fmt(fertileEnd)}`,
  };
}

export interface WaterIntakeResult {
  liters: number;
  fluidOunces: number;
  glasses: number;
}

export function calculateWaterIntake(
  weightKg: number,
  exerciseMinutes = 0,
  climate: 'cold' | 'normal' | 'hot' = 'normal'
): WaterIntakeResult {
  const w = Math.max(20, weightKg);
  // Base requirement: ~35 ml per kg of body weight
  let ml = w * 35;

  // Add 12 ml per minute of exercise
  ml += Math.max(0, exerciseMinutes) * 12;

  // Climate adjustment
  if (climate === 'hot') {
    ml += 500;
  } else if (climate === 'cold') {
    ml -= 100;
  }

  const liters = Math.round((ml / 1000) * 10) / 10;
  // 1 liter = 33.814 oz
  const fluidOunces = Math.round(liters * 33.814);
  // 1 standard glass = 250 ml
  const glasses = Math.round(ml / 250);

  return {
    liters,
    fluidOunces,
    glasses,
  };
}

