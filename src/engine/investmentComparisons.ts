/**
 * Investment Comparison Calculation Engines
 * Compare Mutual Funds / SIP against other asset classes & instruments:
 * - SIP vs FD
 * - SIP vs NPS
 * - SIP vs PPF
 * - SIP vs RD
 * - SIP vs SCSS
 * - SIP vs Gold
 * - SIP vs SGB (Sovereign Gold Bond)
 * - SIP vs Real Estate
 * - SWP vs FD (Systematic Withdrawal vs Fixed Deposit Interest)
 */

export interface ComparisonInput {
  monthlyInvestment: number;
  sipReturnRate: number; // % annual
  comparisonInstrumentRate: number; // % annual
  timePeriodYears: number;
  taxRateOnReturns?: number; // % tax
  inflationRate?: number; // %
}

export interface ComparisonResult {
  totalInvested: number;
  sipCorpus: number;
  sipTotalReturns: number;
  comparisonCorpus: number;
  comparisonTotalReturns: number;
  differenceAmount: number;
  sipAdvantageMultiplier: number;
  recommendation: string;
  yearlyComparison: {
    year: number;
    invested: number;
    sipBalance: number;
    comparisonBalance: number;
  }[];
}

/**
 * 1. Generic SIP vs Fixed Income / Asset comparison
 */
export function calculateSIPVsInstrument(
  input: ComparisonInput,
  instrumentName: string,
  instrumentCompoundingFreq: number = 4 // e.g. quarterly for FD/RD
): ComparisonResult {
  const P = Math.max(0, input.monthlyInvestment);
  const years = Math.max(1, input.timePeriodYears);
  const nMonths = years * 12;

  // SIP (Monthly compounding equity model)
  const rSipAnnual = Math.max(0, input.sipReturnRate) / 100;
  const iSip = Math.pow(1 + rSipAnnual, 1 / 12) - 1;
  const sipCorpus = rSipAnnual === 0 ? P * nMonths : P * ((Math.pow(1 + iSip, nMonths) - 1) / iSip) * (1 + iSip);

  // Comparison Instrument (Monthly recurring deposit model or periodic compounding)
  const rInstAnnual = Math.max(0, input.comparisonInstrumentRate) / 100;
  const iInst = Math.pow(1 + rInstAnnual, 1 / 12) - 1;
  const compCorpus = rInstAnnual === 0 ? P * nMonths : P * ((Math.pow(1 + iInst, nMonths) - 1) / iInst) * (1 + iInst);

  const totalInvested = P * nMonths;
  const sipReturns = Math.max(0, sipCorpus - totalInvested);
  const compReturns = Math.max(0, compCorpus - totalInvested);
  const diff = sipCorpus - compCorpus;

  const yearlyComparison = [];
  for (let yr = 1; yr <= years; yr++) {
    const months = yr * 12;
    const sVal = rSipAnnual === 0 ? P * months : P * ((Math.pow(1 + iSip, months) - 1) / iSip) * (1 + iSip);
    const cVal = rInstAnnual === 0 ? P * months : P * ((Math.pow(1 + iInst, months) - 1) / iInst) * (1 + iInst);

    yearlyComparison.push({
      year: yr,
      invested: P * months,
      sipBalance: Math.round(sVal),
      comparisonBalance: Math.round(cVal),
    });
  }

  const multiplier = compCorpus > 0 ? Math.round((sipCorpus / compCorpus) * 100) / 100 : 1;

  return {
    totalInvested: Math.round(totalInvested),
    sipCorpus: Math.round(sipCorpus),
    sipTotalReturns: Math.round(sipReturns),
    comparisonCorpus: Math.round(compCorpus),
    comparisonTotalReturns: Math.round(compReturns),
    differenceAmount: Math.round(diff),
    sipAdvantageMultiplier: multiplier,
    recommendation:
      diff > 0
        ? `SIP creates ${multiplier}x more wealth (${Math.abs(Math.round(diff)).toLocaleString()} surplus) due to equity compounding.`
        : `${instrumentName} yields higher returns by ${Math.abs(Math.round(diff)).toLocaleString()} with guaranteed returns.`,
    yearlyComparison,
  };
}

/**
 * 2. SIP vs Sovereign Gold Bond (SGB)
 * SGB gives Gold Price Appreciation + 2.5% p.a. semi-annual interest (tax-free at maturity)
 */
export interface SIPVsSGBInput {
  monthlyInvestment: number;
  sipReturnRate: number; // % e.g. 12-14%
  goldAppreciationRate: number; // % e.g. 9-11%
  sgbInterestRate?: number; // 2.5% standard
  timePeriodYears: number;
}

export function calculateSIPVsSGB(input: SIPVsSGBInput): ComparisonResult {
  const sgbInterest = input.sgbInterestRate !== undefined ? input.sgbInterestRate : 2.5;
  const totalSgbRate = input.goldAppreciationRate + sgbInterest;
  return calculateSIPVsInstrument(
    {
      monthlyInvestment: input.monthlyInvestment,
      sipReturnRate: input.sipReturnRate,
      comparisonInstrumentRate: totalSgbRate,
      timePeriodYears: input.timePeriodYears,
    },
    'SGB (Gold + 2.5% Interest)'
  );
}

/**
 * 3. SWP vs FD (Systematic Withdrawal Plan vs Fixed Deposit for Monthly Cashflow)
 */
export interface SWPVsFDInput {
  principalCorpus: number;
  monthlyCashflowNeeded: number;
  swpExpectedReturnRate: number; // % e.g. 10-12% hybrid/equity fund
  fdInterestRate: number; // % e.g. 7%
  timePeriodYears: number;
}

export interface SWPVsFDResult {
  initialCorpus: number;
  monthlyCashflow: number;
  totalCashflowReceived: number;
  swpFinalCorpus: number;
  fdFinalCorpus: number;
  swpTotalGains: number;
  fdTotalGains: number;
  differenceCorpus: number;
  betterForWealthGrowth: 'swp' | 'fd';
  yearlyComparison: {
    year: number;
    swpBalance: number;
    fdBalance: number;
  }[];
}

export function calculateSWPVsFD(input: SWPVsFDInput): SWPVsFDResult {
  const initial = Math.max(0, input.principalCorpus);
  const monthlyCashflow = Math.max(0, input.monthlyCashflowNeeded);
  const years = Math.max(1, input.timePeriodYears);
  const totalMonths = years * 12;

  const rSWP = Math.pow(1 + Math.max(0, input.swpExpectedReturnRate) / 100, 1 / 12) - 1;
  const rFDMonthly = Math.max(0, input.fdInterestRate) / 100 / 12;

  let swpBalance = initial;
  let fdBalance = initial;
  let totalWithdrawn = 0;

  const yearlyComparison = [];

  for (let m = 1; m <= totalMonths; m++) {
    // SWP
    const swpGain = swpBalance * rSWP;
    swpBalance = Math.max(0, swpBalance + swpGain - monthlyCashflow);

    // FD: Pays interest. If interest < monthlyCashflow, deficit reduces principal
    const fdInterest = fdBalance * rFDMonthly;
    const fdDeficit = monthlyCashflow - fdInterest;
    fdBalance = Math.max(0, fdBalance - fdDeficit);

    totalWithdrawn += monthlyCashflow;

    if (m % 12 === 0) {
      yearlyComparison.push({
        year: m / 12,
        swpBalance: Math.round(swpBalance),
        fdBalance: Math.round(fdBalance),
      });
    }
  }

  const swpTotalGains = swpBalance + totalWithdrawn - initial;
  const fdTotalGains = fdBalance + totalWithdrawn - initial;
  const diff = swpBalance - fdBalance;

  return {
    initialCorpus: Math.round(initial),
    monthlyCashflow: Math.round(monthlyCashflow),
    totalCashflowReceived: Math.round(totalWithdrawn),
    swpFinalCorpus: Math.round(swpBalance),
    fdFinalCorpus: Math.round(fdBalance),
    swpTotalGains: Math.round(swpTotalGains),
    fdTotalGains: Math.round(fdTotalGains),
    differenceCorpus: Math.round(diff),
    betterForWealthGrowth: diff >= 0 ? 'swp' : 'fd',
    yearlyComparison,
  };
}
