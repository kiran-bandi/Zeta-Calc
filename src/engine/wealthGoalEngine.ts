/**
 * Deterministic Wealth Goal & Millionaire Calculator Engine
 * Zeta Calculator Planning & Future Value Simulation Engine
 */

export interface WealthGoalInput {
  mode: 'time_to_goal' | 'required_contribution' | 'future_wealth';
  currentSavings: number;
  targetWealth: number;
  monthlyContribution: number;
  annualReturn: number; // % annual
  timeHorizonYears?: number;
  inflationRate?: number; // % annual (optional)
  annualContributionGrowth?: number; // % annual step-up (optional)
  contributionTiming: 'end_of_month' | 'beginning_of_month';
}

export interface WealthTimelineRow {
  year: number;
  startingBalance: number;
  annualContributions: number;
  investmentGrowth: number;
  endingBalance: number;
  targetProgressPct: number;
  realPurchasingPower?: number;
}

export interface WealthGoalResult {
  mode: 'time_to_goal' | 'required_contribution' | 'future_wealth';
  status: 'reached' | 'unreachable' | 'already_reached' | 'horizon_exceeded';
  targetWealth: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  monthsToGoal: number | null;
  yearsToGoal: number | null;
  remainingMonths: number | null;
  projectedWealth: number;
  totalContributions: number;
  investmentGrowth: number;
  growthPercentage: number;
  realPurchasingPowerAtGoal?: number;
  timeline: WealthTimelineRow[];
  summaryMessage: string;
}

export function calculateWealthGoal(input: WealthGoalInput): WealthGoalResult {
  const currentSavings = Math.max(0, input.currentSavings || 0);
  const targetWealth = Math.max(0, input.targetWealth || 0);
  const baseMonthlyContribution = Math.max(0, input.monthlyContribution || 0);
  const annualReturnPct = input.annualReturn || 0;
  const inflationPct = Math.max(0, input.inflationRate || 0);
  const stepUpPct = Math.max(0, input.annualContributionGrowth || 0) / 100;
  const isBegin = input.contributionTiming === 'beginning_of_month';

  // Monthly compound rate
  const annualReturnDecimal = annualReturnPct / 100;
  const monthlyRate = annualReturnDecimal > -1 ? Math.pow(1 + annualReturnDecimal, 1 / 12) - 1 : 0;
  const monthlyInflationRate = inflationPct > 0 ? Math.pow(1 + inflationPct / 100, 1 / 12) - 1 : 0;

  // -------------------------------------------------------------
  // MODE: REQUIRED MONTHLY CONTRIBUTION (Reverse Mode)
  // -------------------------------------------------------------
  if (input.mode === 'required_contribution') {
    const horizonYears = Math.max(1, input.timeHorizonYears || 1);
    const n = Math.round(horizonYears * 12);
    const fvStarting = currentSavings * Math.pow(1 + monthlyRate, n);

    if (currentSavings >= targetWealth || fvStarting >= targetWealth) {
      // Future value of current savings alone reaches target
      return {
        mode: 'required_contribution',
        status: 'already_reached',
        targetWealth,
        currentSavings,
        monthlyContribution: 0,
        annualReturn: annualReturnPct,
        monthsToGoal: n,
        yearsToGoal: horizonYears,
        remainingMonths: 0,
        projectedWealth: Math.round(fvStarting),
        totalContributions: 0,
        investmentGrowth: Math.round(fvStarting - currentSavings),
        growthPercentage: fvStarting > 0 ? Math.round(((fvStarting - currentSavings) / fvStarting) * 100) : 0,
        timeline: [],
        summaryMessage: 'Current savings will achieve or exceed your target without additional monthly contributions.',
      };
    }

    const gap = targetWealth - fvStarting;
    let requiredPMT = 0;
    if (monthlyRate === 0) {
      requiredPMT = gap / n;
    } else {
      let annuityFactor = (Math.pow(1 + monthlyRate, n) - 1) / monthlyRate;
      if (isBegin) {
        annuityFactor *= (1 + monthlyRate);
      }
      requiredPMT = gap / annuityFactor;
    }

    const roundedPMT = Math.max(0, Math.round(requiredPMT * 100) / 100);
    const totalContributed = roundedPMT * n;
    const finalProjected = currentSavings + totalContributed + Math.round(gap);

    return {
      mode: 'required_contribution',
      status: 'reached',
      targetWealth,
      currentSavings,
      monthlyContribution: roundedPMT,
      annualReturn: annualReturnPct,
      monthsToGoal: n,
      yearsToGoal: horizonYears,
      remainingMonths: 0,
      projectedWealth: Math.round(finalProjected),
      totalContributions: Math.round(totalContributed),
      investmentGrowth: Math.round(targetWealth - currentSavings - totalContributed),
      growthPercentage: targetWealth > 0 ? Math.round(((targetWealth - currentSavings - totalContributed) / targetWealth) * 100) : 0,
      timeline: [],
      summaryMessage: `A monthly contribution of ${roundedPMT.toLocaleString()} is required to reach your target of ${targetWealth.toLocaleString()} in ${horizonYears} years.`,
    };
  }

  // -------------------------------------------------------------
  // MODE: TIME TO GOAL or FUTURE WEALTH
  // -------------------------------------------------------------
  if (input.mode === 'time_to_goal' && targetWealth <= 0) {
    return {
      mode: 'time_to_goal',
      status: 'already_reached',
      targetWealth: 0,
      currentSavings,
      monthlyContribution: baseMonthlyContribution,
      annualReturn: annualReturnPct,
      monthsToGoal: 0,
      yearsToGoal: 0,
      remainingMonths: 0,
      projectedWealth: currentSavings,
      totalContributions: 0,
      investmentGrowth: 0,
      growthPercentage: 0,
      timeline: [],
      summaryMessage: 'Please specify a positive target wealth to calculate time to goal.',
    };
  }

  if (input.mode === 'time_to_goal' && currentSavings >= targetWealth && targetWealth > 0) {
    return {
      mode: 'time_to_goal',
      status: 'already_reached',
      targetWealth,
      currentSavings,
      monthlyContribution: baseMonthlyContribution,
      annualReturn: annualReturnPct,
      monthsToGoal: 0,
      yearsToGoal: 0,
      remainingMonths: 0,
      projectedWealth: currentSavings,
      totalContributions: 0,
      investmentGrowth: 0,
      growthPercentage: 0,
      timeline: [],
      summaryMessage: 'Goal already reached based on the entered starting balance.',
    };
  }

  if (input.mode === 'time_to_goal' && baseMonthlyContribution === 0 && annualReturnPct <= 0 && targetWealth > currentSavings) {
    return {
      mode: 'time_to_goal',
      status: 'unreachable',
      targetWealth,
      currentSavings,
      monthlyContribution: 0,
      annualReturn: annualReturnPct,
      monthsToGoal: null,
      yearsToGoal: null,
      remainingMonths: null,
      projectedWealth: currentSavings,
      totalContributions: 0,
      investmentGrowth: 0,
      growthPercentage: 0,
      timeline: [],
      summaryMessage: 'Goal cannot be reached under these assumptions with 0 monthly contribution and zero or negative return.',
    };
  }

  // Max horizon simulation limit: 1200 months = 100 years
  const targetHorizonMonths = input.mode === 'future_wealth' ? Math.max(1, Math.round((input.timeHorizonYears || 10) * 12)) : 1200;
  let balance = currentSavings;
  let totalContributed = 0;
  let monthsToGoal: number | null = null;
  const timeline: WealthTimelineRow[] = [];

  let currentYearStartBalance = balance;
  let currentYearContributions = 0;
  let currentYearGrowth = 0;

  for (let month = 1; month <= targetHorizonMonths; month++) {
    const yrIndex = Math.floor((month - 1) / 12);
    const yr = yrIndex + 1;

    // Apply annual step-up to contribution if set
    const currentPMT = baseMonthlyContribution * Math.pow(1 + stepUpPct, yrIndex);

    let growthThisMonth = 0;
    if (isBegin) {
      const balanceWithDeposit = balance + currentPMT;
      const endMonthBalance = balanceWithDeposit * (1 + monthlyRate);
      growthThisMonth = endMonthBalance - balanceWithDeposit;
      balance = Math.max(0, endMonthBalance);
    } else {
      const interestOnExisting = balance * monthlyRate;
      growthThisMonth = interestOnExisting;
      balance = Math.max(0, balance + interestOnExisting + currentPMT);
    }

    totalContributed += currentPMT;
    currentYearContributions += currentPMT;
    currentYearGrowth += growthThisMonth;

    // Check goal achievement in time_to_goal mode
    if (input.mode === 'time_to_goal' && monthsToGoal === null && balance >= targetWealth) {
      monthsToGoal = month;
    }

    // Capture annual milestone or final month
    if (month % 12 === 0 || month === targetHorizonMonths) {
      const targetProgress = targetWealth > 0 ? Math.min(100, Math.round((balance / targetWealth) * 1000) / 10) : 100;
      const realPurchasingPower = inflationPct > 0 ? Math.round(balance / Math.pow(1 + inflationPct / 100, yr)) : undefined;

      timeline.push({
        year: yr,
        startingBalance: Math.round(currentYearStartBalance),
        annualContributions: Math.round(currentYearContributions),
        investmentGrowth: Math.round(currentYearGrowth),
        endingBalance: Math.round(balance),
        targetProgressPct: targetProgress,
        realPurchasingPower,
      });

      currentYearStartBalance = balance;
      currentYearContributions = 0;
      currentYearGrowth = 0;
    }

    // If goal is reached in time_to_goal mode and we have at least 1-2 years of timeline beyond goal, stop early to avoid 100 years calculation
    if (input.mode === 'time_to_goal' && monthsToGoal !== null && month >= Math.min(targetHorizonMonths, Math.ceil(monthsToGoal / 12) * 12)) {
      break;
    }
  }

  if (input.mode === 'time_to_goal') {
    if (monthsToGoal === null) {
      return {
        mode: 'time_to_goal',
        status: 'horizon_exceeded',
        targetWealth,
        currentSavings,
        monthlyContribution: baseMonthlyContribution,
        annualReturn: annualReturnPct,
        monthsToGoal: null,
        yearsToGoal: null,
        remainingMonths: null,
        projectedWealth: Math.round(balance),
        totalContributions: Math.round(totalContributed),
        investmentGrowth: Math.round(balance - currentSavings - totalContributed),
        growthPercentage: balance > 0 ? Math.round(((balance - currentSavings - totalContributed) / balance) * 100) : 0,
        timeline,
        summaryMessage: 'Goal could not be reached within the 100-year simulation horizon. Consider increasing contributions or target return.',
      };
    }

    const y = Math.floor(monthsToGoal / 12);
    const m = monthsToGoal % 12;
    const timeDisplay = y > 0 && m > 0 ? `${y} years, ${m} months` : y > 0 ? `${y} years` : `${m} months`;
    const realPower = inflationPct > 0 ? Math.round(targetWealth / Math.pow(1 + inflationPct / 100, monthsToGoal / 12)) : undefined;
    const invGrowth = Math.max(0, balance - currentSavings - totalContributed);
    const growthPct = balance > 0 ? Math.round((invGrowth / balance) * 100) : 0;

    return {
      mode: 'time_to_goal',
      status: 'reached',
      targetWealth,
      currentSavings,
      monthlyContribution: baseMonthlyContribution,
      annualReturn: annualReturnPct,
      monthsToGoal,
      yearsToGoal: y,
      remainingMonths: m,
      projectedWealth: Math.round(balance),
      totalContributions: Math.round(totalContributed),
      investmentGrowth: Math.round(invGrowth),
      growthPercentage: growthPct,
      realPurchasingPowerAtGoal: realPower,
      timeline,
      summaryMessage: `Estimated time to reach your goal: ${timeDisplay} (${monthsToGoal} months total).`,
    };
  }

  // Future Wealth Mode Result
  const horizonY = Math.round(targetHorizonMonths / 12);
  const invGrowth = Math.max(0, balance - currentSavings - totalContributed);
  const growthPct = balance > 0 ? Math.round((invGrowth / balance) * 100) : 0;
  const realPower = inflationPct > 0 ? Math.round(balance / Math.pow(1 + inflationPct / 100, horizonY)) : undefined;

  return {
    mode: 'future_wealth',
    status: balance >= targetWealth ? 'reached' : 'unreachable',
    targetWealth,
    currentSavings,
    monthlyContribution: baseMonthlyContribution,
    annualReturn: annualReturnPct,
    monthsToGoal: null,
    yearsToGoal: horizonY,
    remainingMonths: 0,
    projectedWealth: Math.round(balance),
    totalContributions: Math.round(totalContributed),
    investmentGrowth: Math.round(invGrowth),
    growthPercentage: growthPct,
    realPurchasingPowerAtGoal: realPower,
    timeline,
    summaryMessage: `Projected balance after ${horizonY} years is ${Math.round(balance).toLocaleString()}.`,
  };
}
