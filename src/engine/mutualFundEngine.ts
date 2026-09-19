/**
 * Dedicated Mutual Fund Calculation Engine
 *
 * Supports three distinct investment modes:
 * 1. Lumpsum (FV = PV * (1 + r)^t)
 * 2. SIP (Regular Monthly Annuity with exact end-of-month monthly compounding)
 * 3. Step-Up SIP (Annual compounding increase with exact partial periods)
 *
 * Adheres strictly to:
 * - Exact normalized duration: totalMonths = (years * 12) + months; t = totalMonths / 12
 * - Optional inflation: Inflation-Adjusted FV = Nominal FV / (1 + inf)^t
 * - Purchasing Power Loss = Nominal FV - Inflation-Adjusted FV
 * - Full internal floating-point precision
 * - Zero as valid explicit input
 */

export type MutualFundMode = 'lumpsum' | 'sip' | 'step_up_sip';

export type SIPTigmingConvention = 'end_of_month' | 'beginning_of_month';

export interface MutualFundPeriodScheduleItem {
  periodIndex: number; // 1-indexed (month or year)
  periodLabel: string; // e.g. "Month 1", "Year 1"
  monthlyContribution: number;
  cumulativeInvested: number;
  estimatedGrowth: number;
  totalValue: number;
  inflationAdjustedValue?: number;
}

export interface LumpsumCalculationInput {
  initialInvestment: number;
  expectedAnnualReturnRate: number; // e.g. 12 for 12%
  totalMonths: number;
  inflationRate?: number; // optional, e.g. 6 for 6%
}

export interface LumpsumCalculationResult {
  mode: 'lumpsum';
  initialInvestment: number;
  expectedAnnualReturnRate: number;
  totalMonths: number;
  exactDurationYears: number;
  totalInvested: number;
  estimatedReturns: number;
  estimatedFutureValue: number;
  hasInflation: boolean;
  inflationRate?: number;
  inflationAdjustedFutureValue?: number;
  estimatedPurchasingPowerLoss?: number;
  monthlyBreakdown: MutualFundPeriodScheduleItem[];
  yearlyBreakdown: MutualFundPeriodScheduleItem[];
}

export interface SIPCalculationInput {
  monthlySIPAmount: number;
  expectedAnnualReturnRate: number; // e.g. 12 for 12%
  totalMonths: number;
  inflationRate?: number; // optional
  timingConvention?: SIPTigmingConvention; // defaults to 'end_of_month'
}

export interface SIPCalculationResult {
  mode: 'sip';
  monthlySIP: number;
  expectedAnnualReturnRate: number;
  totalMonths: number;
  exactDurationYears: number;
  totalInstallments: number;
  totalInvested: number;
  estimatedReturns: number;
  estimatedFutureValue: number;
  timingConvention: SIPTigmingConvention;
  hasInflation: boolean;
  inflationRate?: number;
  inflationAdjustedFutureValue?: number;
  estimatedPurchasingPowerLoss?: number;
  monthlyBreakdown: MutualFundPeriodScheduleItem[];
  yearlyBreakdown: MutualFundPeriodScheduleItem[];
}

export interface StepUpSIPCalculationInput {
  initialMonthlySIP: number;
  annualStepUpPercentage: number; // e.g. 10 for 10%
  expectedAnnualReturnRate: number; // e.g. 12 for 12%
  totalMonths: number;
  inflationRate?: number; // optional
  timingConvention?: SIPTigmingConvention; // defaults to 'end_of_month'
}

export interface StepUpSIPCalculationResult {
  mode: 'step_up_sip';
  initialMonthlySIP: number;
  annualStepUpRate: number;
  finalMonthlySIPAmount: number;
  expectedAnnualReturnRate: number;
  totalMonths: number;
  exactDurationYears: number;
  totalInstallments: number;
  totalInvested: number;
  estimatedReturns: number;
  estimatedFutureValue: number;
  timingConvention: SIPTigmingConvention;
  hasInflation: boolean;
  inflationRate?: number;
  inflationAdjustedFutureValue?: number;
  estimatedPurchasingPowerLoss?: number;
  monthlyBreakdown: MutualFundPeriodScheduleItem[];
  yearlyBreakdown: MutualFundPeriodScheduleItem[];
}

export type MutualFundCalculationResult =
  | LumpsumCalculationResult
  | SIPCalculationResult
  | StepUpSIPCalculationResult;

/**
 * 1. Calculate Lumpsum Mutual Fund Investment
 * FV = PV * (1 + r)^t
 */
export function calculateLumpsum(input: LumpsumCalculationInput): LumpsumCalculationResult {
  const PV = Math.max(0, input.initialInvestment);
  const r = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const totalMonths = Math.max(1, input.totalMonths);
  const t = totalMonths / 12;

  const hasInflation =
    input.inflationRate !== undefined &&
    input.inflationRate !== null &&
    !isNaN(input.inflationRate);
  const infRate = hasInflation ? Math.max(0, input.inflationRate!) / 100 : 0;

  // Nominal Future Value
  let nominalFV = PV;
  if (r === 0) {
    nominalFV = PV;
  } else {
    nominalFV = PV * Math.pow(1 + r, t);
  }

  const totalInvested = PV;
  const estimatedReturns = Math.max(0, nominalFV - totalInvested);

  // Inflation adjusted values
  let inflationAdjustedFutureValue: number | undefined;
  let estimatedPurchasingPowerLoss: number | undefined;

  if (hasInflation) {
    inflationAdjustedFutureValue = nominalFV / Math.pow(1 + infRate, t);
    estimatedPurchasingPowerLoss = Math.max(0, nominalFV - inflationAdjustedFutureValue);
  }

  // Monthly & Yearly breakdown
  const monthlyBreakdown: MutualFundPeriodScheduleItem[] = [];
  for (let m = 1; m <= totalMonths; m++) {
    const elapsedYears = m / 12;
    const curNominal = r === 0 ? PV : PV * Math.pow(1 + r, elapsedYears);
    const curReal = hasInflation ? curNominal / Math.pow(1 + infRate, elapsedYears) : undefined;

    monthlyBreakdown.push({
      periodIndex: m,
      periodLabel: `Month ${m}`,
      monthlyContribution: m === 1 ? PV : 0,
      cumulativeInvested: PV,
      estimatedGrowth: Math.max(0, curNominal - PV),
      totalValue: curNominal,
      inflationAdjustedValue: curReal,
    });
  }

  const yearlyBreakdown: MutualFundPeriodScheduleItem[] = [];
  const totalYearsCeil = Math.ceil(totalMonths / 12);
  for (let yr = 1; yr <= totalYearsCeil; yr++) {
    const targetMonth = Math.min(yr * 12, totalMonths);
    const mItem = monthlyBreakdown[targetMonth - 1];
    yearlyBreakdown.push({
      periodIndex: yr,
      periodLabel: `Year ${yr}${targetMonth < yr * 12 ? ` (${targetMonth} mo)` : ''}`,
      monthlyContribution: yr === 1 ? PV : 0,
      cumulativeInvested: PV,
      estimatedGrowth: mItem.estimatedGrowth,
      totalValue: mItem.totalValue,
      inflationAdjustedValue: mItem.inflationAdjustedValue,
    });
  }

  return {
    mode: 'lumpsum',
    initialInvestment: PV,
    expectedAnnualReturnRate: input.expectedAnnualReturnRate,
    totalMonths,
    exactDurationYears: t,
    totalInvested,
    estimatedReturns,
    estimatedFutureValue: nominalFV,
    hasInflation,
    inflationRate: hasInflation ? input.inflationRate : undefined,
    inflationAdjustedFutureValue,
    estimatedPurchasingPowerLoss,
    monthlyBreakdown,
    yearlyBreakdown,
  };
}

/**
 * 2. Calculate Regular SIP Mutual Fund Investment
 * End of month annuity compounding:
 * FV = P * [ ((1 + i)^n - 1) / i ]
 */
export function calculateSIP(input: SIPCalculationInput): SIPCalculationResult {
  const P = Math.max(0, input.monthlySIPAmount);
  const annualRate = Math.max(0, input.expectedAnnualReturnRate);
  const totalMonths = Math.max(1, input.totalMonths);
  const timing = input.timingConvention || 'end_of_month';

  const t = totalMonths / 12;
  const annualRateDec = annualRate / 100;
  const monthlyRate = annualRateDec / 12;

  const hasInflation =
    input.inflationRate !== undefined &&
    input.inflationRate !== null &&
    !isNaN(input.inflationRate);
  const infRate = hasInflation ? Math.max(0, input.inflationRate!) / 100 : 0;

  let nominalFV = 0;
  if (monthlyRate === 0) {
    nominalFV = P * totalMonths;
  } else {
    if (timing === 'beginning_of_month') {
      nominalFV = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    } else {
      nominalFV = P * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    }
  }

  const totalInvested = P * totalMonths;
  const estimatedReturns = Math.max(0, nominalFV - totalInvested);

  let inflationAdjustedFutureValue: number | undefined;
  let estimatedPurchasingPowerLoss: number | undefined;

  if (hasInflation) {
    inflationAdjustedFutureValue = nominalFV / Math.pow(1 + infRate, t);
    estimatedPurchasingPowerLoss = Math.max(0, nominalFV - inflationAdjustedFutureValue);
  }

  // Generate exact period breakdown
  const monthlyBreakdown: MutualFundPeriodScheduleItem[] = [];
  let runningCorpus = 0;
  let runningInvested = 0;

  for (let m = 1; m <= totalMonths; m++) {
    runningInvested += P;
    if (timing === 'beginning_of_month') {
      runningCorpus = (runningCorpus + P) * (1 + monthlyRate);
    } else {
      // End of month: interest accrued on previous corpus, then current contribution added
      runningCorpus = runningCorpus * (1 + monthlyRate) + P;
    }

    const elapsedYears = m / 12;
    const curReal = hasInflation ? runningCorpus / Math.pow(1 + infRate, elapsedYears) : undefined;

    monthlyBreakdown.push({
      periodIndex: m,
      periodLabel: `Month ${m}`,
      monthlyContribution: P,
      cumulativeInvested: runningInvested,
      estimatedGrowth: Math.max(0, runningCorpus - runningInvested),
      totalValue: runningCorpus,
      inflationAdjustedValue: curReal,
    });
  }

  const yearlyBreakdown: MutualFundPeriodScheduleItem[] = [];
  const totalYearsCeil = Math.ceil(totalMonths / 12);
  for (let yr = 1; yr <= totalYearsCeil; yr++) {
    const targetMonth = Math.min(yr * 12, totalMonths);
    const mItem = monthlyBreakdown[targetMonth - 1];
    yearlyBreakdown.push({
      periodIndex: yr,
      periodLabel: `Year ${yr}${targetMonth < yr * 12 ? ` (${targetMonth} mo)` : ''}`,
      monthlyContribution: P,
      cumulativeInvested: mItem.cumulativeInvested,
      estimatedGrowth: mItem.estimatedGrowth,
      totalValue: mItem.totalValue,
      inflationAdjustedValue: mItem.inflationAdjustedValue,
    });
  }

  return {
    mode: 'sip',
    monthlySIP: P,
    expectedAnnualReturnRate: input.expectedAnnualReturnRate,
    totalMonths,
    exactDurationYears: t,
    totalInstallments: totalMonths,
    totalInvested,
    estimatedReturns,
    estimatedFutureValue: nominalFV,
    timingConvention: timing,
    hasInflation,
    inflationRate: hasInflation ? input.inflationRate : undefined,
    inflationAdjustedFutureValue,
    estimatedPurchasingPowerLoss,
    monthlyBreakdown,
    yearlyBreakdown,
  };
}

/**
 * 3. Calculate Step-Up SIP Mutual Fund Investment
 * Contribution increases every 12 months by annualStepUpPercentage.
 * Compounding calculated with exact partial duration support.
 */
export function calculateStepUpSIP(input: StepUpSIPCalculationInput): StepUpSIPCalculationResult {
  const P = Math.max(0, input.initialMonthlySIP);
  const stepUpPct = Math.max(0, input.annualStepUpPercentage);
  const annualRate = Math.max(0, input.expectedAnnualReturnRate);
  const totalMonths = Math.max(1, input.totalMonths);
  const timing = input.timingConvention || 'end_of_month';

  const t = totalMonths / 12;
  const stepUpDec = stepUpPct / 100;
  const annualRateDec = annualRate / 100;
  const monthlyRate = annualRateDec / 12;

  const hasInflation =
    input.inflationRate !== undefined &&
    input.inflationRate !== null &&
    !isNaN(input.inflationRate);
  const infRate = hasInflation ? Math.max(0, input.inflationRate!) / 100 : 0;

  let totalInvested = 0;
  let runningCorpus = 0;
  const monthlyBreakdown: MutualFundPeriodScheduleItem[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const yearIndex = Math.floor((m - 1) / 12);
    const sipForMonth = P * Math.pow(1 + stepUpDec, yearIndex);

    totalInvested += sipForMonth;

    if (timing === 'beginning_of_month') {
      runningCorpus = (runningCorpus + sipForMonth) * (1 + monthlyRate);
    } else {
      runningCorpus = runningCorpus * (1 + monthlyRate) + sipForMonth;
    }

    const elapsedYears = m / 12;
    const curReal = hasInflation ? runningCorpus / Math.pow(1 + infRate, elapsedYears) : undefined;

    monthlyBreakdown.push({
      periodIndex: m,
      periodLabel: `Month ${m}`,
      monthlyContribution: sipForMonth,
      cumulativeInvested: totalInvested,
      estimatedGrowth: Math.max(0, runningCorpus - totalInvested),
      totalValue: runningCorpus,
      inflationAdjustedValue: curReal,
    });
  }

  const nominalFV = runningCorpus;
  const estimatedReturns = Math.max(0, nominalFV - totalInvested);

  const finalYearIndex = Math.floor((totalMonths - 1) / 12);
  const finalMonthlySIPAmount = P * Math.pow(1 + stepUpDec, finalYearIndex);

  let inflationAdjustedFutureValue: number | undefined;
  let estimatedPurchasingPowerLoss: number | undefined;

  if (hasInflation) {
    inflationAdjustedFutureValue = nominalFV / Math.pow(1 + infRate, t);
    estimatedPurchasingPowerLoss = Math.max(0, nominalFV - inflationAdjustedFutureValue);
  }

  const yearlyBreakdown: MutualFundPeriodScheduleItem[] = [];
  const totalYearsCeil = Math.ceil(totalMonths / 12);
  for (let yr = 1; yr <= totalYearsCeil; yr++) {
    const targetMonth = Math.min(yr * 12, totalMonths);
    const mItem = monthlyBreakdown[targetMonth - 1];
    const yearIndex = yr - 1;
    const monthlyContributionAtYr = P * Math.pow(1 + stepUpDec, yearIndex);

    yearlyBreakdown.push({
      periodIndex: yr,
      periodLabel: `Year ${yr}${targetMonth < yr * 12 ? ` (${targetMonth} mo)` : ''}`,
      monthlyContribution: monthlyContributionAtYr,
      cumulativeInvested: mItem.cumulativeInvested,
      estimatedGrowth: mItem.estimatedGrowth,
      totalValue: mItem.totalValue,
      inflationAdjustedValue: mItem.inflationAdjustedValue,
    });
  }

  return {
    mode: 'step_up_sip',
    initialMonthlySIP: P,
    annualStepUpRate: stepUpPct,
    finalMonthlySIPAmount,
    expectedAnnualReturnRate: input.expectedAnnualReturnRate,
    totalMonths,
    exactDurationYears: t,
    totalInstallments: totalMonths,
    totalInvested,
    estimatedReturns,
    estimatedFutureValue: nominalFV,
    timingConvention: timing,
    hasInflation,
    inflationRate: hasInflation ? input.inflationRate : undefined,
    inflationAdjustedFutureValue,
    estimatedPurchasingPowerLoss,
    monthlyBreakdown,
    yearlyBreakdown,
  };
}
