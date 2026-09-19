/**
 * Mutual Funds, SIP, Lumpsum, SWP, STP, CAGR, XIRR, and Return Calculations
 * Deterministic financial engines adhering to global standards.
 */

/**
 * 1. CAGR Calculator (Compound Annual Growth Rate)
 * CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1
 */
export interface CAGRInput {
  initialInvestment: number;
  finalValue: number;
  timePeriodYears?: number;
  startDate?: string;
  endDate?: string;
}

export interface CAGRResult {
  cagrPercentage: number;
  totalGain: number;
  absoluteReturnPercentage: number;
  durationYears: number;
  durationDays: number;
  multiplier: number;
}

export function calculateCAGR(input: CAGRInput): CAGRResult {
  const initial = Math.max(0, input.initialInvestment);
  const finalVal = Math.max(0, input.finalValue);
  let years = 0;
  let days = 0;

  if (input.startDate && input.endDate) {
    const start = new Date(input.startDate).getTime();
    const end = new Date(input.endDate).getTime();
    if (!isNaN(start) && !isNaN(end) && end > start) {
      days = Math.round((end - start) / (1000 * 60 * 60 * 24));
      years = days / 365.25;
    }
  }

  if (years <= 0 && input.timePeriodYears && input.timePeriodYears > 0) {
    years = input.timePeriodYears;
    days = Math.round(years * 365.25);
  }

  if (initial <= 0 || finalVal <= 0 || years <= 0) {
    return {
      cagrPercentage: 0,
      totalGain: finalVal - initial,
      absoluteReturnPercentage: initial > 0 ? ((finalVal - initial) / initial) * 100 : 0,
      durationYears: years,
      durationDays: days,
      multiplier: initial > 0 ? finalVal / initial : 0,
    };
  }

  const cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
  const totalGain = finalVal - initial;
  const absoluteReturn = ((finalVal - initial) / initial) * 100;

  return {
    cagrPercentage: Math.round(cagr * 100) / 100,
    totalGain: Math.round(totalGain * 100) / 100,
    absoluteReturnPercentage: Math.round(absoluteReturn * 100) / 100,
    durationYears: Math.round(years * 100) / 100,
    durationDays: days,
    multiplier: Math.round((finalVal / initial) * 100) / 100,
  };
}

/**
 * 2. Absolute Return & Simple Return Calculator
 */
export interface AbsoluteReturnInput {
  initialInvestment: number;
  finalValue: number;
  holdingPeriodMonths?: number;
}

export interface AbsoluteReturnResult {
  totalGain: number;
  absoluteReturnPercentage: number;
  annualizedReturnPercentage: number;
  gainMultiplier: number;
}

export function calculateAbsoluteReturn(input: AbsoluteReturnInput): AbsoluteReturnResult {
  const init = Math.max(0, input.initialInvestment);
  const fin = Math.max(0, input.finalValue);
  const months = input.holdingPeriodMonths && input.holdingPeriodMonths > 0 ? input.holdingPeriodMonths : 12;

  if (init === 0) {
    return {
      totalGain: fin,
      absoluteReturnPercentage: 0,
      annualizedReturnPercentage: 0,
      gainMultiplier: 0,
    };
  }

  const gain = fin - init;
  const absReturn = (gain / init) * 100;
  const years = months / 12;
  const annualized = years > 0 ? (Math.pow(fin / init, 1 / years) - 1) * 100 : absReturn;

  return {
    totalGain: Math.round(gain * 100) / 100,
    absoluteReturnPercentage: Math.round(absReturn * 100) / 100,
    annualizedReturnPercentage: Math.round(annualized * 100) / 100,
    gainMultiplier: Math.round((fin / init) * 100) / 100,
  };
}

/**
 * 3. Step-Up SIP Calculator & Step-Up vs Regular SIP
 */
export interface StepUpSIPInput {
  initialMonthlyInvestment: number;
  expectedAnnualReturnRate: number; // % annual
  investmentPeriodYears: number;
  annualStepUpPercentage?: number; // e.g. 10%
  annualStepUpAmount?: number; // fixed rupee step-up e.g. ₹1000
}

export interface StepUpSIPResult {
  totalInvestedAmount: number;
  estimatedReturns: number;
  totalMaturityCorpus: number;
  // Comparison with Regular (No Step-up) SIP
  regularSipInvested: number;
  regularSipCorpus: number;
  regularSipReturns: number;
  stepUpCorpusDifference: number;
  stepUpGainMultiplier: number;
  yearlyBreakdown: {
    year: number;
    monthlyInvestment: number;
    yearlyInvested: number;
    cumulativeInvested: number;
    yearEndBalance: number;
  }[];
}

export function calculateStepUpSIP(input: StepUpSIPInput): StepUpSIPResult {
  const P = Math.max(0, input.initialMonthlyInvestment);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const monthlyRate = Math.pow(1 + rAnnual, 1 / 12) - 1;
  const years = Math.max(1, input.investmentPeriodYears);
  const stepUpPct = Math.max(0, input.annualStepUpPercentage || 0) / 100;
  const fixedStepUpAmt = Math.max(0, input.annualStepUpAmount || 0);

  let currentMonthly = P;
  let corpus = 0;
  let totalInvested = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    let yearInvested = 0;
    for (let m = 1; m <= 12; m++) {
      corpus = (corpus + currentMonthly) * (1 + monthlyRate);
      totalInvested += currentMonthly;
      yearInvested += currentMonthly;
    }

    yearlyBreakdown.push({
      year: yr,
      monthlyInvestment: Math.round(currentMonthly),
      yearlyInvested: Math.round(yearInvested),
      cumulativeInvested: Math.round(totalInvested),
      yearEndBalance: Math.round(corpus),
    });

    // Step up for next year
    if (stepUpPct > 0) {
      currentMonthly = currentMonthly * (1 + stepUpPct);
    } else if (fixedStepUpAmt > 0) {
      currentMonthly = currentMonthly + fixedStepUpAmt;
    }
  }

  // Regular SIP baseline
  let regCorpus = 0;
  const regInvested = P * 12 * years;
  for (let m = 1; m <= years * 12; m++) {
    regCorpus = (regCorpus + P) * (1 + monthlyRate);
  }

  const returns = Math.max(0, corpus - totalInvested);
  const regReturns = Math.max(0, regCorpus - regInvested);

  return {
    totalInvestedAmount: Math.round(totalInvested),
    estimatedReturns: Math.round(returns),
    totalMaturityCorpus: Math.round(corpus),
    regularSipInvested: Math.round(regInvested),
    regularSipCorpus: Math.round(regCorpus),
    regularSipReturns: Math.round(regReturns),
    stepUpCorpusDifference: Math.round(corpus - regCorpus),
    stepUpGainMultiplier: regCorpus > 0 ? Math.round((corpus / regCorpus) * 100) / 100 : 1,
    yearlyBreakdown,
  };
}

/**
 * 4. Lumpsum Mutual Fund & Lumpsum Inflation Calculator
 */
export interface LumpsumInput {
  initialInvestment: number;
  expectedAnnualReturnRate: number; // % annual
  investmentPeriodYears: number;
  inflationRate?: number; // % annual
}

export interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalMaturityCorpus: number;
  realPurchasingPowerCorpus: number; // adjusted for inflation
  inflationErosion: number;
  wealthMultiplier: number;
  yearlyBreakdown: {
    year: number;
    nominalBalance: number;
    realInflationAdjustedBalance: number;
  }[];
}

export function calculateLumpsum(input: LumpsumInput): LumpsumResult {
  const P = Math.max(0, input.initialInvestment);
  const r = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const t = Math.max(1, input.investmentPeriodYears);
  const inf = Math.max(0, input.inflationRate || 0) / 100;

  const totalCorpus = P * Math.pow(1 + r, t);
  const realCorpus = inf > 0 ? totalCorpus / Math.pow(1 + inf, t) : totalCorpus;
  const returns = Math.max(0, totalCorpus - P);

  const yearlyBreakdown = [];
  for (let yr = 1; yr <= t; yr++) {
    const nominal = P * Math.pow(1 + r, yr);
    const real = inf > 0 ? nominal / Math.pow(1 + inf, yr) : nominal;
    yearlyBreakdown.push({
      year: yr,
      nominalBalance: Math.round(nominal),
      realInflationAdjustedBalance: Math.round(real),
    });
  }

  return {
    investedAmount: Math.round(P),
    estimatedReturns: Math.round(returns),
    totalMaturityCorpus: Math.round(totalCorpus),
    realPurchasingPowerCorpus: Math.round(realCorpus),
    inflationErosion: Math.round(totalCorpus - realCorpus),
    wealthMultiplier: P > 0 ? Math.round((totalCorpus / P) * 100) / 100 : 0,
    yearlyBreakdown,
  };
}

/**
 * 5. SWP Calculator (Systematic Withdrawal Plan)
 */
export interface SWPInput {
  initialCorpus: number;
  monthlyWithdrawal: number;
  expectedAnnualReturnRate: number; // % annual
  timePeriodYears: number;
  annualStepUpWithdrawal?: number; // % annual increase in withdrawal
}

export interface SWPResult {
  initialCorpus: number;
  totalWithdrawn: number;
  finalRemainingCorpus: number;
  totalInterestEarned: number;
  depletionYear: number | null;
  yearlyBreakdown: {
    year: number;
    openingBalance: number;
    withdrawnDuringYear: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculateSWP(input: SWPInput): SWPResult {
  const initial = Math.max(0, input.initialCorpus);
  let withdrawalMonthly = Math.max(0, input.monthlyWithdrawal);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const monthlyRate = Math.pow(1 + rAnnual, 1 / 12) - 1;
  const years = Math.max(1, input.timePeriodYears);
  const stepUp = Math.max(0, input.annualStepUpWithdrawal || 0) / 100;

  let balance = initial;
  let totalWithdrawn = 0;
  let totalInterest = 0;
  let depletionYear: number | null = null;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    const opening = balance;
    let yearWithdrawn = 0;
    let yearInterest = 0;

    for (let m = 1; m <= 12; m++) {
      if (balance <= 0) {
        if (depletionYear === null) depletionYear = yr;
        break;
      }
      // Earn interest
      const interest = balance * monthlyRate;
      yearInterest += interest;
      balance += interest;

      // Withdraw
      const actualWithdrawal = Math.min(balance, withdrawalMonthly);
      balance -= actualWithdrawal;
      yearWithdrawn += actualWithdrawal;
      totalWithdrawn += actualWithdrawal;
    }

    totalInterest += yearInterest;

    yearlyBreakdown.push({
      year: yr,
      openingBalance: Math.round(opening),
      withdrawnDuringYear: Math.round(yearWithdrawn),
      interestEarned: Math.round(yearInterest),
      closingBalance: Math.round(Math.max(0, balance)),
    });

    if (stepUp > 0) {
      withdrawalMonthly *= 1 + stepUp;
    }
  }

  return {
    initialCorpus: Math.round(initial),
    totalWithdrawn: Math.round(totalWithdrawn),
    finalRemainingCorpus: Math.round(Math.max(0, balance)),
    totalInterestEarned: Math.round(totalInterest),
    depletionYear,
    yearlyBreakdown,
  };
}

/**
 * 6. STP Calculator (Systematic Transfer Plan)
 * Transfer funds periodically from Source fund (e.g. Liquid/Debt) to Target fund (e.g. Equity)
 */
export interface STPInput {
  sourceInitialCorpus: number;
  monthlyTransferAmount: number;
  sourceFundAnnualReturnRate: number; // e.g. 6% debt
  targetFundAnnualReturnRate: number; // e.g. 12% equity
  timePeriodYears: number;
}

export interface STPResult {
  sourceRemainingBalance: number;
  targetAccumulatedValue: number;
  totalTransferred: number;
  totalCombinedCorpus: number;
  targetGains: number;
  sourceGains: number;
  totalCombinedGains: number;
  yearlyBreakdown: {
    year: number;
    sourceBalance: number;
    targetBalance: number;
    combinedValue: number;
  }[];
}

export function calculateSTP(input: STPInput): STPResult {
  let sourceBal = Math.max(0, input.sourceInitialCorpus);
  const transfer = Math.max(0, input.monthlyTransferAmount);
  const rSource = Math.pow(1 + Math.max(0, input.sourceFundAnnualReturnRate) / 100, 1 / 12) - 1;
  const rTarget = Math.pow(1 + Math.max(0, input.targetFundAnnualReturnRate) / 100, 1 / 12) - 1;
  const totalMonths = Math.max(1, input.timePeriodYears) * 12;

  let targetBal = 0;
  let totalTransferred = 0;
  let sourceTotalInterest = 0;
  const yearlyBreakdown = [];

  for (let m = 1; m <= totalMonths; m++) {
    // Source earns interest
    const sInt = sourceBal * rSource;
    sourceTotalInterest += sInt;
    sourceBal += sInt;

    // Transfer
    const actualTransfer = Math.min(sourceBal, transfer);
    sourceBal -= actualTransfer;
    targetBal = (targetBal + actualTransfer) * (1 + rTarget);
    totalTransferred += actualTransfer;

    if (m % 12 === 0) {
      yearlyBreakdown.push({
        year: m / 12,
        sourceBalance: Math.round(sourceBal),
        targetBalance: Math.round(targetBal),
        combinedValue: Math.round(sourceBal + targetBal),
      });
    }
  }

  const targetGains = Math.max(0, targetBal - totalTransferred);
  const totalCombined = sourceBal + targetBal;
  const totalGains = totalCombined - input.sourceInitialCorpus;

  return {
    sourceRemainingBalance: Math.round(sourceBal),
    targetAccumulatedValue: Math.round(targetBal),
    totalTransferred: Math.round(totalTransferred),
    totalCombinedCorpus: Math.round(totalCombined),
    targetGains: Math.round(targetGains),
    sourceGains: Math.round(sourceTotalInterest),
    totalCombinedGains: Math.round(totalGains),
    yearlyBreakdown,
  };
}

/**
 * 7. Goal-Based SIP Calculator (Required Monthly SIP for a target corpus)
 */
export interface GoalBasedSIPInput {
  targetCorpusAmount: number;
  timePeriodYears: number;
  expectedAnnualReturnRate: number; // % annual
  existingSavings?: number;
}

export interface GoalBasedSIPResult {
  requiredMonthlySIP: number;
  totalInvestmentNeeded: number;
  estimatedGrowthReturns: number;
  targetCorpus: number;
  existingSavingsFutureValue: number;
  gapCorpus: number;
}

export function calculateGoalBasedSIP(input: GoalBasedSIPInput): GoalBasedSIPResult {
  const target = Math.max(0, input.targetCorpusAmount);
  const years = Math.max(1, input.timePeriodYears);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const n = years * 12;
  const existing = Math.max(0, input.existingSavings || 0);

  // Growth of existing lump sum
  const existingFV = existing * Math.pow(1 + rAnnual, years);
  const remainingTarget = Math.max(0, target - existingFV);

  let monthlySIP = 0;
  if (rAnnual === 0) {
    monthlySIP = remainingTarget / n;
  } else {
    const i = Math.pow(1 + rAnnual, 1 / 12) - 1;
    // Formula: FV = P * (( (1+i)^n - 1 ) / i) * (1+i)
    // P = FV / [ (( (1+i)^n - 1 ) / i) * (1+i) ]
    const factor = ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    monthlySIP = factor > 0 ? remainingTarget / factor : 0;
  }

  const totalInv = monthlySIP * n + existing;
  const returns = Math.max(0, target - totalInv);

  return {
    requiredMonthlySIP: Math.round(monthlySIP),
    totalInvestmentNeeded: Math.round(totalInv),
    estimatedGrowthReturns: Math.round(returns),
    targetCorpus: Math.round(target),
    existingSavingsFutureValue: Math.round(existingFV),
    gapCorpus: Math.round(remainingTarget),
  };
}

/**
 * 8. SIP Cost of Delay Calculator
 * Calculate the cost of delaying an investment by X months/years
 */
export interface SIPCostOfDelayInput {
  monthlyInvestment: number;
  expectedAnnualReturnRate: number; // % annual
  totalInvestmentPeriodYears: number;
  delayPeriodYears: number;
}

export interface SIPCostOfDelayResult {
  corpusWithoutDelay: number;
  investedWithoutDelay: number;
  corpusWithDelay: number;
  investedWithDelay: number;
  costOfDelayCorpusLost: number;
  extraMonthlySipNeededToCatchUp: number;
  percentageLossInWealth: number;
}

export function calculateSIPCostOfDelay(input: SIPCostOfDelayInput): SIPCostOfDelayResult {
  const P = Math.max(0, input.monthlyInvestment);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const totalYears = Math.max(1, input.totalInvestmentPeriodYears);
  const delayYears = Math.min(totalYears - 1, Math.max(0, input.delayPeriodYears));
  const activeYearsWithDelay = Math.max(1, totalYears - delayYears);

  const i = Math.pow(1 + rAnnual, 1 / 12) - 1;
  const nFull = totalYears * 12;
  const nDelayed = activeYearsWithDelay * 12;

  let corpusFull = 0;
  let corpusDelayed = 0;

  if (rAnnual === 0) {
    corpusFull = P * nFull;
    corpusDelayed = P * nDelayed;
  } else {
    corpusFull = P * ((Math.pow(1 + i, nFull) - 1) / i) * (1 + i);
    corpusDelayed = P * ((Math.pow(1 + i, nDelayed) - 1) / i) * (1 + i);
  }

  const costLost = Math.max(0, corpusFull - corpusDelayed);
  const pctLoss = corpusFull > 0 ? (costLost / corpusFull) * 100 : 0;

  // Catch up SIP needed in delayed period to match original corpus
  let catchUpSIP = P;
  if (rAnnual > 0 && nDelayed > 0) {
    const factor = ((Math.pow(1 + i, nDelayed) - 1) / i) * (1 + i);
    catchUpSIP = factor > 0 ? corpusFull / factor : P;
  }

  return {
    corpusWithoutDelay: Math.round(corpusFull),
    investedWithoutDelay: Math.round(P * nFull),
    corpusWithDelay: Math.round(corpusDelayed),
    investedWithDelay: Math.round(P * nDelayed),
    costOfDelayCorpusLost: Math.round(costLost),
    extraMonthlySipNeededToCatchUp: Math.round(Math.max(0, catchUpSIP - P)),
    percentageLossInWealth: Math.round(pctLoss * 10) / 10,
  };
}

/**
 * 9. SIP Inflation Calculator
 */
export interface SIPInflationInput {
  monthlyInvestment: number;
  expectedAnnualReturnRate: number; // % annual
  timePeriodYears: number;
  inflationRate: number; // % annual
}

export interface SIPInflationResult {
  totalInvestedAmount: number;
  nominalMaturityCorpus: number;
  realPurchasingPowerCorpus: number;
  inflationErosion: number;
  realAnnualizedRateOfReturn: number;
}

export function calculateSIPInflation(input: SIPInflationInput): SIPInflationResult {
  const P = Math.max(0, input.monthlyInvestment);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const inf = Math.max(0, input.inflationRate) / 100;
  const years = Math.max(1, input.timePeriodYears);
  const n = years * 12;

  const i = Math.pow(1 + rAnnual, 1 / 12) - 1;
  let nominalCorpus = 0;
  if (rAnnual === 0) {
    nominalCorpus = P * n;
  } else {
    nominalCorpus = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  }

  const realCorpus = inf > 0 ? nominalCorpus / Math.pow(1 + inf, years) : nominalCorpus;
  const realRate = ((1 + rAnnual) / (1 + inf) - 1) * 100;

  return {
    totalInvestedAmount: Math.round(P * n),
    nominalMaturityCorpus: Math.round(nominalCorpus),
    realPurchasingPowerCorpus: Math.round(realCorpus),
    inflationErosion: Math.round(nominalCorpus - realCorpus),
    realAnnualizedRateOfReturn: Math.round(realRate * 100) / 100,
  };
}

/**
 * 10. SIP Expense Ratio / Direct vs Regular Mutual Fund Calculator
 */
export interface ExpenseRatioInput {
  monthlyInvestment: number;
  expectedGrossReturnRate: number; // e.g. 15%
  directFundExpenseRatio: number; // e.g. 0.5%
  regularFundExpenseRatio: number; // e.g. 1.75%
  timePeriodYears: number;
}

export interface ExpenseRatioResult {
  totalInvested: number;
  directFundCorpus: number;
  regularFundCorpus: number;
  wealthLostToDistributorCommission: number;
  directGainPercentageHigher: number;
}

export function calculateExpenseRatioImpact(input: ExpenseRatioInput): ExpenseRatioResult {
  const P = Math.max(0, input.monthlyInvestment);
  const gross = Math.max(0, input.expectedGrossReturnRate) / 100;
  const expDirect = Math.max(0, input.directFundExpenseRatio) / 100;
  const expRegular = Math.max(0, input.regularFundExpenseRatio) / 100;
  const years = Math.max(1, input.timePeriodYears);
  const n = years * 12;

  const rDirect = Math.max(0, gross - expDirect);
  const rRegular = Math.max(0, gross - expRegular);

  const iDirect = Math.pow(1 + rDirect, 1 / 12) - 1;
  const iRegular = Math.pow(1 + rRegular, 1 / 12) - 1;

  const directCorpus = P * ((Math.pow(1 + iDirect, n) - 1) / iDirect) * (1 + iDirect);
  const regularCorpus = P * ((Math.pow(1 + iRegular, n) - 1) / iRegular) * (1 + iRegular);
  const lostCommission = Math.max(0, directCorpus - regularCorpus);

  return {
    totalInvested: Math.round(P * n),
    directFundCorpus: Math.round(directCorpus),
    regularFundCorpus: Math.round(regularCorpus),
    wealthLostToDistributorCommission: Math.round(lostCommission),
    directGainPercentageHigher: regularCorpus > 0 ? Math.round((lostCommission / regularCorpus) * 1000) / 10 : 0,
  };
}

/**
 * 11. SIP vs Lumpsum Comparison Calculator
 */
export interface SIPVsLumpsumInput {
  totalCapitalAvailable: number;
  lumpsumExpectedReturnRate: number; // % annual
  sipMonthlyInvestment: number;
  sipExpectedReturnRate: number; // % annual
  timePeriodYears: number;
}

export interface SIPVsLumpsumResult {
  lumpsumFinalValue: number;
  lumpsumTotalGains: number;
  sipFinalValue: number;
  sipTotalInvested: number;
  sipTotalGains: number;
  wealthDifference: number; // Lumpsum - SIP
  betterStrategy: 'lumpsum' | 'sip' | 'neutral';
}

export function calculateSIPVsLumpsum(input: SIPVsLumpsumInput): SIPVsLumpsumResult {
  const cap = Math.max(0, input.totalCapitalAvailable);
  const rLump = Math.max(0, input.lumpsumExpectedReturnRate) / 100;
  const years = Math.max(1, input.timePeriodYears);

  const lumpFinal = cap * Math.pow(1 + rLump, years);
  const lumpGains = Math.max(0, lumpFinal - cap);

  const P = Math.max(0, input.sipMonthlyInvestment > 0 ? input.sipMonthlyInvestment : cap / (years * 12));
  const rSip = Math.max(0, input.sipExpectedReturnRate) / 100;
  const iSip = Math.pow(1 + rSip, 1 / 12) - 1;
  const n = years * 12;

  const sipFinal = P * ((Math.pow(1 + iSip, n) - 1) / iSip) * (1 + iSip);
  const sipInvested = P * n;
  const sipGains = Math.max(0, sipFinal - sipInvested);

  const diff = lumpFinal - sipFinal;

  return {
    lumpsumFinalValue: Math.round(lumpFinal),
    lumpsumTotalGains: Math.round(lumpGains),
    sipFinalValue: Math.round(sipFinal),
    sipTotalInvested: Math.round(sipInvested),
    sipTotalGains: Math.round(sipGains),
    wealthDifference: Math.round(diff),
    betterStrategy: diff > 1000 ? 'lumpsum' : diff < -1000 ? 'sip' : 'neutral',
  };
}

/**
 * 12. XIRR Cashflow Newton-Raphson Solver
 */
export interface CashFlowItem {
  date: string;
  amount: number; // negative for investment, positive for redemption/current value
}

export function calculateXIRR(cashFlows: CashFlowItem[]): number | null {
  if (cashFlows.length < 2) return null;
  const sorted = [...cashFlows].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const hasNegative = sorted.some((c) => c.amount < 0);
  const hasPositive = sorted.some((c) => c.amount > 0);
  if (!hasNegative || !hasPositive) return null;

  const d0 = new Date(sorted[0].date).getTime();
  const datesInYears = sorted.map((c) => (new Date(c.date).getTime() - d0) / (1000 * 60 * 60 * 24 * 365));

  let rate = 0.1; // initial guess 10%
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let iter = 0; iter < maxIterations; iter++) {
    let fValue = 0;
    let fDerivative = 0;

    for (let i = 0; i < sorted.length; i++) {
      const c = sorted[i].amount;
      const t = datesInYears[i];
      const denom = Math.pow(1 + rate, t);
      if (denom === 0) continue;
      fValue += c / denom;
      fDerivative -= (t * c) / (denom * (1 + rate));
    }

    if (Math.abs(fValue) < tolerance) {
      return Math.round(rate * 10000) / 100; // % with 2 decimals
    }

    if (fDerivative === 0) break;
    const newRate = rate - fValue / fDerivative;
    if (isNaN(newRate) || !isFinite(newRate)) break;
    rate = newRate;
  }

  return Math.round(rate * 10000) / 100;
}
