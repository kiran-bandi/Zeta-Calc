/**
 * Zeta Calculator - Interest Between Dates Engine
 * Deterministic date-range interest calculation with dual mutually exclusive rate input methods.
 */

export type InterestRateMethod = 'percentage_per_year' | 'per_hundred_per_month';
export type DayCountConvention = 'actual_365' | 'actual_360' | 'calendar_breakdown';
export type InterestType = 'simple' | 'compound';

export interface InterestRateNormalization {
  method: InterestRateMethod;
  enteredRate: number;
  enteredRateFormatted: string;
  monthlyRatePercent: number;
  annualRatePercent: number;
  annualRateDecimal: number;
  normalizedAnnualRateFormatted: string;
  calculationRateUsedFormatted: string;
}

export interface InterestBetweenDatesInput {
  principal: number | string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  includeEndDate?: boolean;
  rateMethod: InterestRateMethod;
  rateValue: number | string; // user entered rate
  interestType?: InterestType;
  compoundFrequency?: 'monthly' | 'quarterly' | 'half_yearly' | 'yearly';
  dayCountConvention?: DayCountConvention;
}

export interface InterestBetweenDatesValidation {
  isValid: boolean;
  errors: {
    principal?: string;
    startDate?: string;
    endDate?: string;
    rateValue?: string;
    rateMethod?: string;
  };
}

export interface DateBreakdown {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  formattedText: string;
}

export interface InterestScheduleRow {
  period: string;
  startDate: string;
  endDate: string;
  days: number;
  interest: number;
  cumulativeInterest: number;
  balance: number;
}

export interface InterestBetweenDatesResult {
  principal: number;
  startDate: string;
  endDate: string;
  duration: DateBreakdown;
  rateInfo: InterestRateNormalization;
  interestType: InterestType;
  dayCountConvention: DayCountConvention;
  totalInterest: number;
  totalAmount: number;
  dailyInterest: number;
  monthlyInterest: number;
  yearlyInterest: number;
  calculationSteps: string[];
  schedule: InterestScheduleRow[];
}

/**
 * Normalizes user interest rate from either:
 * - 'percentage_per_year': annual rate %
 * - 'per_hundred_per_month': rate per ₹100 per month -> annual rate = monthly * 12
 */
export function normalizeInterestRate(
  method: InterestRateMethod,
  rateValue: number | string | null | undefined
): {
  isValid: boolean;
  error?: string;
  normalization?: InterestRateNormalization;
} {
  if (rateValue === '' || rateValue === null || rateValue === undefined) {
    return {
      isValid: false,
      error: 'Interest rate is required.',
    };
  }

  const rawString = String(rateValue).trim();
  if (rawString === '') {
    return {
      isValid: false,
      error: 'Interest rate is required.',
    };
  }

  const num = typeof rateValue === 'number' ? rateValue : parseFloat(rawString);
  if (isNaN(num)) {
    return {
      isValid: false,
      error: 'Interest rate must be a valid numeric value.',
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      error: 'Interest rate cannot be negative.',
    };
  }

  let monthlyRatePercent = 0;
  let annualRatePercent = 0;
  let enteredRateFormatted = '';

  if (method === 'percentage_per_year') {
    annualRatePercent = num;
    monthlyRatePercent = num / 12;
    enteredRateFormatted = `${num}% per year`;
  } else if (method === 'per_hundred_per_month') {
    monthlyRatePercent = num;
    annualRatePercent = num * 12;
    enteredRateFormatted = `₹${num} per ₹100 per month`;
  } else {
    return {
      isValid: false,
      error: 'Invalid interest rate method selected.',
    };
  }

  const annualRateDecimal = annualRatePercent / 100;

  return {
    isValid: true,
    normalization: {
      method,
      enteredRate: num,
      enteredRateFormatted,
      monthlyRatePercent,
      annualRatePercent,
      annualRateDecimal,
      normalizedAnnualRateFormatted: `${annualRatePercent}% per year`,
      calculationRateUsedFormatted: `${annualRatePercent}% per year`,
    },
  };
}

/**
 * Calculates calendar differences (Years, Months, Days) and Total Days
 */
export function computeDateBreakdown(
  startDateStr: string,
  endDateStr: string,
  includeEndDate = false
): DateBreakdown | null {
  if (!startDateStr || !endDateStr) return null;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const d1 = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
  const d2 = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

  let diffMs = d2.getTime() - d1.getTime();
  if (diffMs < 0) {
    return null; // end date before start date
  }

  if (includeEndDate) {
    diffMs += 24 * 60 * 60 * 1000;
  }

  const totalDays = Math.round(diffMs / (24 * 60 * 60 * 1000));

  // Calendar Y/M/D decomposition
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (includeEndDate) {
    days += 1;
  }

  if (days < 0) {
    months -= 1;
    const prevMonthLastDay = new Date(Date.UTC(end.getFullYear(), end.getMonth(), 0)).getDate();
    days += prevMonthLastDay;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
  if (months > 0) parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
  if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);

  return {
    totalDays,
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    formattedText: parts.join(', ') + ` (${totalDays} total days)`,
  };
}

/**
 * Validate all inputs for Interest Between Dates Calculator
 */
export function validateInterestBetweenDatesInput(
  input: InterestBetweenDatesInput
): InterestBetweenDatesValidation {
  const errors: InterestBetweenDatesValidation['errors'] = {};

  // Principal validation
  const pStr = String(input.principal ?? '').trim();
  if (pStr === '') {
    errors.principal = 'Principal amount is required.';
  } else {
    const pNum = typeof input.principal === 'number' ? input.principal : parseFloat(pStr);
    if (isNaN(pNum) || pNum < 0) {
      errors.principal = 'Principal amount must be a positive number.';
    }
  }

  // Date validation
  if (!input.startDate) {
    errors.startDate = 'Start date is required.';
  }
  if (!input.endDate) {
    errors.endDate = 'End date is required.';
  }
  if (input.startDate && input.endDate) {
    const s = new Date(input.startDate).getTime();
    const e = new Date(input.endDate).getTime();
    if (isNaN(s)) errors.startDate = 'Invalid start date.';
    if (isNaN(e)) errors.endDate = 'Invalid end date.';
    if (!isNaN(s) && !isNaN(e) && e < s) {
      errors.endDate = 'End date must be on or after start date.';
    }
  }

  // Rate validation
  if (!input.rateMethod || !['percentage_per_year', 'per_hundred_per_month'].includes(input.rateMethod)) {
    errors.rateMethod = 'Exactly one valid interest rate method must be selected.';
  }

  const rateCheck = normalizeInterestRate(input.rateMethod, input.rateValue);
  if (!rateCheck.isValid) {
    errors.rateValue = rateCheck.error || 'Valid interest rate is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Calculates interest between two dates deterministically.
 */
export function calculateInterestBetweenDates(
  input: InterestBetweenDatesInput
): InterestBetweenDatesResult | null {
  const validation = validateInterestBetweenDatesInput(input);
  if (!validation.isValid) {
    return null;
  }

  const principal = typeof input.principal === 'number' ? input.principal : parseFloat(String(input.principal));
  const rateNorm = normalizeInterestRate(input.rateMethod, input.rateValue).normalization!;
  const duration = computeDateBreakdown(input.startDate, input.endDate, !!input.includeEndDate);

  if (!duration) return null;

  const interestType = input.interestType || 'simple';
  const convention = input.dayCountConvention || 'actual_365';

  const annualRateDecimal = rateNorm.annualRateDecimal;
  const annualRatePercent = rateNorm.annualRatePercent;
  const monthlyRatePercent = rateNorm.monthlyRatePercent;

  let totalInterest = 0;
  const calculationSteps: string[] = [];

  // Step 1: Conversion explanation
  if (input.rateMethod === 'per_hundred_per_month') {
    calculationSteps.push(
      `1. Rate Conversion: ₹${rateNorm.enteredRate} per ₹100 per month = ${rateNorm.enteredRate}% monthly rate.`
    );
    calculationSteps.push(
      `2. Annual Rate: ${rateNorm.enteredRate}% × 12 months = ${annualRatePercent}% per year (Decimal: ${annualRateDecimal}).`
    );
  } else {
    calculationSteps.push(
      `1. Rate Normalization: Entered rate is ${annualRatePercent}% per year (Decimal: ${annualRateDecimal}).`
    );
  }

  calculationSteps.push(
    `3. Duration: From ${input.startDate} to ${input.endDate}${input.includeEndDate ? ' (inclusive)' : ''} = ${duration.years} years, ${duration.months} months, ${duration.days} days (Total: ${duration.totalDays} days).`
  );

  const divisor = convention === 'actual_360' ? 360 : 365;

  if (interestType === 'simple') {
    if (convention === 'calendar_breakdown') {
      // Traditional Calendar method: Years + Months + Days
      const yearInterest = principal * annualRateDecimal * duration.years;
      const monthInterest = principal * (monthlyRatePercent / 100) * duration.months;
      const dayInterest = principal * (monthlyRatePercent / 100) * (duration.days / 30);
      totalInterest = yearInterest + monthInterest + dayInterest;

      calculationSteps.push(
        `4. Simple Interest Formula (Calendar Breakdown): (Years × P × R_yr) + (Months × P × R_mo) + (Days × P × R_mo / 30)`
      );
      calculationSteps.push(
        `   = (${duration.years} × ₹${principal.toLocaleString()} × ${annualRateDecimal}) + (${duration.months} × ₹${principal.toLocaleString()} × ${(monthlyRatePercent / 100).toFixed(4)}) + (${duration.days} × ₹${principal.toLocaleString()} × ${(monthlyRatePercent / 100 / 30).toFixed(6)})`
      );
      calculationSteps.push(
        `   = ₹${yearInterest.toFixed(2)} + ₹${monthInterest.toFixed(2)} + ₹${dayInterest.toFixed(2)} = ₹${totalInterest.toFixed(2)}`
      );
    } else {
      // Exact Day Count basis (Actual/365 or Actual/360)
      const timeInYears = duration.totalDays / divisor;
      totalInterest = principal * annualRateDecimal * timeInYears;

      calculationSteps.push(
        `4. Simple Interest Formula: I = P × r × (Days ÷ ${divisor})`
      );
      calculationSteps.push(
        `   = ₹${principal.toLocaleString()} × ${annualRateDecimal} × (${duration.totalDays} ÷ ${divisor})`
      );
      calculationSteps.push(
        `   = ₹${principal.toLocaleString()} × ${annualRateDecimal} × ${timeInYears.toFixed(6)} = ₹${totalInterest.toFixed(2)}`
      );
    }
  } else {
    // Compound interest
    const freq = input.compoundFrequency || 'monthly';
    let n = 12;
    if (freq === 'yearly') n = 1;
    else if (freq === 'half_yearly') n = 2;
    else if (freq === 'quarterly') n = 4;
    else if (freq === 'monthly') n = 12;

    const t = duration.totalDays / divisor;
    const compoundAmount = principal * Math.pow(1 + annualRateDecimal / n, n * t);
    totalInterest = compoundAmount - principal;

    calculationSteps.push(
      `4. Compound Interest Formula: A = P × (1 + r/n)^(n × t), where n = ${n} (${freq}), t = ${duration.totalDays}/${divisor} years.`
    );
    calculationSteps.push(
      `   = ₹${principal.toLocaleString()} × (1 + ${annualRateDecimal}/${n})^(${n} × ${t.toFixed(4)}) = ₹${compoundAmount.toFixed(2)}`
    );
    calculationSteps.push(`   Interest = Total Amount - Principal = ₹${totalInterest.toFixed(2)}`);
  }

  const totalAmount = principal + totalInterest;

  // Key derived interest rates
  const yearlyInterest = principal * annualRateDecimal;
  const monthlyInterest = principal * (monthlyRatePercent / 100);
  const dailyInterest = yearlyInterest / divisor;

  // Build a clean period breakdown schedule
  const schedule: InterestScheduleRow[] = [];
  if (duration.totalDays > 0) {
    const periodsCount = Math.min(12, Math.max(1, duration.months + duration.years * 12 + (duration.days > 0 ? 1 : 0)));
    const daysPerPeriod = duration.totalDays / periodsCount;
    const interestPerPeriod = totalInterest / periodsCount;
    let accumulatedInterest = 0;

    for (let p = 1; p <= periodsCount; p++) {
      accumulatedInterest += interestPerPeriod;
      schedule.push({
        period: `Period ${p}`,
        startDate: p === 1 ? input.startDate : `Period ${p} Start`,
        endDate: p === periodsCount ? input.endDate : `Period ${p} End`,
        days: Math.round(daysPerPeriod),
        interest: Math.round(interestPerPeriod * 100) / 100,
        cumulativeInterest: Math.round(accumulatedInterest * 100) / 100,
        balance: Math.round((principal + accumulatedInterest) * 100) / 100,
      });
    }
  }

  return {
    principal: Math.round(principal * 100) / 100,
    startDate: input.startDate,
    endDate: input.endDate,
    duration,
    rateInfo: rateNorm,
    interestType,
    dayCountConvention: convention,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
    dailyInterest: Math.round(dailyInterest * 100) / 100,
    monthlyInterest: Math.round(monthlyInterest * 100) / 100,
    yearlyInterest: Math.round(yearlyInterest * 100) / 100,
    calculationSteps,
    schedule,
  };
}
