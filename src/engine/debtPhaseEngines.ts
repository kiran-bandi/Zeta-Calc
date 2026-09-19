/**
 * Phase 5: Finance & Debt Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */

// 21. Credit Card Minimum Payment Calculator
export interface CreditCardPayoffScenario {
  months: number;
  years: number;
  totalInterest: number;
  totalPayments: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
}

export interface CreditCardPayoffResult {
  originalBalance: number;
  apr: number;
  monthlyPayment: number;
  monthsToPayoff: number;
  totalInterestPaid: number;
  totalPayments: number;
  interestRatioPercent: number;
  extraPaymentSavings?: {
    extraPayment: number;
    monthsSaved: number;
    interestSaved: number;
  };
}

export function calculateCreditCardPayoff(
  balance: number | '',
  apr: number | '',
  monthlyPayment: number | ''
): CreditCardPayoffResult | null {
  if (
    typeof balance !== 'number' ||
    typeof apr !== 'number' ||
    typeof monthlyPayment !== 'number' ||
    isNaN(balance) ||
    isNaN(apr) ||
    isNaN(monthlyPayment) ||
    balance <= 0 ||
    apr < 0 ||
    monthlyPayment <= 0
  ) {
    return null;
  }

  const monthlyRate = apr / 100 / 12;
  const firstMonthInterest = balance * monthlyRate;
  if (monthlyPayment <= firstMonthInterest) {
    return null; // Won't pay off
  }

  let curBal = balance;
  let totalInterest = 0;
  let months = 0;

  while (curBal > 0.01 && months < 600) {
    months++;
    const interest = curBal * monthlyRate;
    let principal = monthlyPayment - interest;
    if (principal > curBal) principal = curBal;
    curBal -= principal;
    totalInterest += interest;
  }

  const totalPayments = balance + totalInterest;
  const interestRatioPercent = Math.round((totalInterest / totalPayments) * 1000) / 10;

  // Extra $50/mo simulation
  let extraMonths = 0;
  let extraInterest = 0;
  let extraBal = balance;
  const acceleratedPmt = monthlyPayment + 50;

  while (extraBal > 0.01 && extraMonths < 600) {
    extraMonths++;
    const interest = extraBal * monthlyRate;
    let principal = acceleratedPmt - interest;
    if (principal > extraBal) principal = extraBal;
    extraBal -= principal;
    extraInterest += interest;
  }

  const extraPaymentSavings = {
    extraPayment: 50,
    monthsSaved: Math.max(0, months - extraMonths),
    interestSaved: Math.round(Math.max(0, totalInterest - extraInterest) * 100) / 100,
  };

  return {
    originalBalance: balance,
    apr,
    monthlyPayment,
    monthsToPayoff: months,
    totalInterestPaid: Math.round(totalInterest * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    interestRatioPercent,
    extraPaymentSavings,
  };
}

export interface CreditCardMinimumResult {
  currentBalance: number;
  apr: number;
  minPaymentPercent: number;
  minPaymentFloor: number;
  hasNegativeAmortization: boolean;
  minPaymentScenario: CreditCardPayoffScenario;
  fixedPaymentScenario?: CreditCardPayoffScenario;
  interestSaved?: number;
  monthsSaved?: number;
  schedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export function calculateCreditCardMinimum(
  balance: number | '',
  apr: number | '',
  minPaymentPercent: number | '' = 2,
  minPaymentFloor: number | '' = 25,
  fixedMonthlyPayment: number | '' = ''
): CreditCardMinimumResult | null {
  if (
    typeof balance !== 'number' ||
    typeof apr !== 'number' ||
    isNaN(balance) ||
    isNaN(apr) ||
    balance <= 0 ||
    apr < 0
  ) {
    return null;
  }

  const minPct = typeof minPaymentPercent === 'number' && !isNaN(minPaymentPercent) && minPaymentPercent > 0 ? minPaymentPercent / 100 : 0.02;
  const floor = typeof minPaymentFloor === 'number' && !isNaN(minPaymentFloor) && minPaymentFloor >= 0 ? minPaymentFloor : 25;
  const monthlyRate = apr / 100 / 12;

  // Check negative amortization on month 1
  const firstMonthInterest = balance * monthlyRate;
  const firstMonthCalculatedPmt = Math.max(floor, balance * minPct, firstMonthInterest + 0.01 * balance);
  const hasNegativeAmortization = firstMonthCalculatedPmt <= firstMonthInterest;

  // Simulate Minimum Payment Payoff (cap at 600 months = 50 years to prevent infinite loop)
  let curBal = balance;
  let minTotalInterest = 0;
  let minTotalPaid = 0;
  let minMonths = 0;
  let firstPmt = 0;
  let lastPmt = 0;
  const schedule: { month: number; payment: number; principal: number; interest: number; balance: number }[] = [];

  while (curBal > 0.01 && minMonths < 600) {
    minMonths++;
    const interest = curBal * monthlyRate;

    // Standard card rule: max(Floor, Interest + 1% Balance, Balance * MinPct)
    let payment = Math.max(floor, interest + 0.01 * curBal, curBal * minPct);

    if (minMonths === 1) firstPmt = payment;

    if (payment > curBal + interest) {
      payment = curBal + interest;
    }

    const principal = payment - interest;
    if (principal <= 0) {
      // Negative amortization
      break;
    }

    curBal -= principal;
    minTotalInterest += interest;
    minTotalPaid += payment;
    lastPmt = payment;

    if (minMonths <= 36 || curBal <= 0.01) {
      schedule.push({
        month: minMonths,
        payment: Math.round(payment * 100) / 100,
        principal: Math.round(principal * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(Math.max(0, curBal) * 100) / 100,
      });
    }
  }

  const minPaymentScenario: CreditCardPayoffScenario = {
    months: minMonths,
    years: Math.round((minMonths / 12) * 10) / 10,
    totalInterest: Math.round(minTotalInterest * 100) / 100,
    totalPayments: Math.round(minTotalPaid * 100) / 100,
    firstMonthPayment: Math.round(firstPmt * 100) / 100,
    lastMonthPayment: Math.round(lastPmt * 100) / 100,
  };

  // Fixed Monthly Payment Scenario (if specified and > interest)
  let fixedPaymentScenario: CreditCardPayoffScenario | undefined;
  let interestSaved: number | undefined;
  let monthsSaved: number | undefined;

  if (typeof fixedMonthlyPayment === 'number' && !isNaN(fixedMonthlyPayment) && fixedMonthlyPayment > firstMonthInterest) {
    let fixBal = balance;
    let fixInterest = 0;
    let fixPaid = 0;
    let fixMonths = 0;

    while (fixBal > 0.01 && fixMonths < 600) {
      fixMonths++;
      const interest = fixBal * monthlyRate;
      let payment = fixedMonthlyPayment;
      if (payment > fixBal + interest) {
        payment = fixBal + interest;
      }
      const principal = payment - interest;
      fixBal -= principal;
      fixInterest += interest;
      fixPaid += payment;
    }

    fixedPaymentScenario = {
      months: fixMonths,
      years: Math.round((fixMonths / 12) * 10) / 10,
      totalInterest: Math.round(fixInterest * 100) / 100,
      totalPayments: Math.round(fixPaid * 100) / 100,
      firstMonthPayment: fixedMonthlyPayment,
      lastMonthPayment: Math.round(fixedMonthlyPayment * 100) / 100,
    };

    interestSaved = Math.max(0, Math.round((minTotalInterest - fixInterest) * 100) / 100);
    monthsSaved = Math.max(0, minMonths - fixMonths);
  }

  return {
    currentBalance: balance,
    apr,
    minPaymentPercent: minPct * 100,
    minPaymentFloor: floor,
    hasNegativeAmortization,
    minPaymentScenario,
    fixedPaymentScenario,
    interestSaved,
    monthsSaved,
    schedule,
  };
}

// 22. Real Return Calculator
export interface RealReturnResult {
  nominalReturn: number;
  inflationRate: number;
  realReturnPct: number;
  realReturnRate: number;
  afterTaxRealReturnRate: number;
  simpleDifferencePct: number;
  purchasingPowerMultiplier10y: number;
  formulaSteps: string[];
  purchasingPowerMultiplier10Years: number;
  purchasingPowerMultiplier20Years: number;
  startingValue?: number;
  endingNominalValue?: number;
  endingRealValue?: number;
}

export function calculateRealReturn(
  nominalReturnPct: number | '',
  inflationRatePct: number | '',
  taxRatePct: number | '' = 0,
  years: number | '' = 10
): RealReturnResult | null {
  if (
    typeof nominalReturnPct !== 'number' ||
    typeof inflationRatePct !== 'number' ||
    isNaN(nominalReturnPct) ||
    isNaN(inflationRatePct)
  ) {
    return null;
  }

  const rNom = nominalReturnPct / 100;
  const i = inflationRatePct / 100;
  const tax = typeof taxRatePct === 'number' && !isNaN(taxRatePct) && taxRatePct > 0 ? taxRatePct / 100 : 0;

  // Exact Fisher Equation: (1 + r_real) = (1 + r_nominal) / (1 + i)
  if (1 + i === 0) return null;

  const realReturnDecimal = (1 + rNom) / (1 + i) - 1;
  const realReturnPct = Math.round(realReturnDecimal * 10000) / 100;
  const simpleDifferencePct = nominalReturnPct - inflationRatePct;

  // After-tax nominal: rNom * (1 - tax)
  const afterTaxNom = rNom * (1 - tax);
  const afterTaxRealDecimal = (1 + afterTaxNom) / (1 + i) - 1;
  const afterTaxRealReturnRate = Math.round(afterTaxRealDecimal * 10000) / 100;

  const pp10 = Math.round(Math.pow(1 + realReturnDecimal, 10) * 100) / 100;
  const pp20 = Math.round(Math.pow(1 + realReturnDecimal, 20) * 100) / 100;

  return {
    nominalReturn: nominalReturnPct,
    inflationRate: inflationRatePct,
    realReturnPct,
    realReturnRate: realReturnPct,
    afterTaxRealReturnRate,
    simpleDifferencePct: Math.round(simpleDifferencePct * 100) / 100,
    purchasingPowerMultiplier10y: pp10,
    formulaSteps: [
      `Fisher Equation: r_real = [(1 + r_nominal) / (1 + inflation)] - 1`,
      `r_real = [(1 + ${(rNom).toFixed(4)}) / (1 + ${(i).toFixed(4)})] - 1 = ${realReturnPct}%`,
    ],
    purchasingPowerMultiplier10Years: pp10,
    purchasingPowerMultiplier20Years: pp20,
  };
}

// 23. Retirement Contribution & Savings Horizon Calculator
export interface RetirementContributionResult {
  currentAge: number;
  retirementAge: number;
  yearsToRetire: number;
  totalContributions: number;
  totalCompoundGrowth: number;
  futureNestEgg: number;
  estimatedMonthlyRetirementIncome: number;
}

export function calculateRetirementContribution(
  currentAge: number | '',
  retirementAge: number | '',
  currentBalance: number | '',
  monthlyContribution: number | '',
  annualReturnPct: number | '',
  employerMonthlyMatch: number | '' = 0
): RetirementContributionResult | null {
  if (
    typeof currentAge !== 'number' ||
    typeof retirementAge !== 'number' ||
    typeof monthlyContribution !== 'number' ||
    typeof annualReturnPct !== 'number' ||
    isNaN(currentAge) ||
    isNaN(retirementAge) ||
    isNaN(monthlyContribution) ||
    isNaN(annualReturnPct) ||
    retirementAge <= currentAge ||
    monthlyContribution < 0
  ) {
    return null;
  }

  const curBal = typeof currentBalance === 'number' && !isNaN(currentBalance) && currentBalance >= 0 ? currentBalance : 0;
  const match = typeof employerMonthlyMatch === 'number' && !isNaN(employerMonthlyMatch) && employerMonthlyMatch >= 0 ? employerMonthlyMatch : 0;
  const totalMonthlySaving = monthlyContribution + match;

  const yearsToRetire = retirementAge - currentAge;
  const totalMonths = yearsToRetire * 12;
  const monthlyRate = annualReturnPct / 100 / 12;

  // FV of initial balance
  const fvInitial = curBal * Math.pow(1 + monthlyRate, totalMonths);

  // FV of annuity
  let fvAnnuity = 0;
  if (monthlyRate === 0) {
    fvAnnuity = totalMonthlySaving * totalMonths;
  } else {
    fvAnnuity = totalMonthlySaving * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
  }

  const futureNestEgg = fvInitial + fvAnnuity;
  const totalContributions = curBal + totalMonthlySaving * totalMonths;
  const totalCompoundGrowth = Math.max(0, futureNestEgg - totalContributions);
  // 4% safe withdrawal rule (annual / 12)
  const estimatedMonthlyRetirementIncome = (futureNestEgg * 0.04) / 12;

  return {
    currentAge,
    retirementAge,
    yearsToRetire,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalCompoundGrowth: Math.round(totalCompoundGrowth * 100) / 100,
    futureNestEgg: Math.round(futureNestEgg * 100) / 100,
    estimatedMonthlyRetirementIncome: Math.round(estimatedMonthlyRetirementIncome * 100) / 100,
  };
}

// 23. Retirement Withdrawal Calculator
export interface RetirementYearProjection {
  year: number;
  age?: number;
  startBalance: number;
  investmentGrowth: number;
  annualWithdrawal: number;
  endingBalance: number;
  isExhausted: boolean;
}

export interface RetirementWithdrawalResult {
  portfolioValue: number;
  withdrawalRatePct: number;
  initialAnnualWithdrawal: number;
  initialMonthlyWithdrawal: number;
  expectedReturnPct: number;
  inflationPct: number;
  yearsProjected: number;
  endingBalance: number;
  totalWithdrawn: number;
  totalGrowthEarned: number;
  exhaustionYear: number | null;
  isSustainable: boolean;
  projections: RetirementYearProjection[];
}

export function calculateRetirementWithdrawal(
  portfolioValue: number | '',
  withdrawalRatePct: number | '',
  expectedReturnPct: number | '' = 7,
  inflationPct: number | '' = 2.5,
  yearsInRetirement: number | '' = 30,
  adjustForInflation = true
): RetirementWithdrawalResult | null {
  if (
    typeof portfolioValue !== 'number' ||
    typeof withdrawalRatePct !== 'number' ||
    isNaN(portfolioValue) ||
    isNaN(withdrawalRatePct) ||
    portfolioValue <= 0 ||
    withdrawalRatePct <= 0
  ) {
    return null;
  }

  const expReturn = typeof expectedReturnPct === 'number' && !isNaN(expectedReturnPct) ? expectedReturnPct / 100 : 0.07;
  const infl = typeof inflationPct === 'number' && !isNaN(inflationPct) ? inflationPct / 100 : 0.025;
  const years = typeof yearsInRetirement === 'number' && !isNaN(yearsInRetirement) && yearsInRetirement > 0 ? yearsInRetirement : 30;

  const initialAnnualWithdrawal = portfolioValue * (withdrawalRatePct / 100);
  const initialMonthlyWithdrawal = initialAnnualWithdrawal / 12;

  let currentBal = portfolioValue;
  let currentWithdrawal = initialAnnualWithdrawal;
  let totalWithdrawn = 0;
  let totalGrowth = 0;
  let exhaustionYear: number | null = null;

  const projections: RetirementYearProjection[] = [];

  for (let yr = 1; yr <= years; yr++) {
    if (currentBal <= 0.01) {
      if (exhaustionYear === null) exhaustionYear = yr - 1;
      projections.push({
        year: yr,
        startBalance: 0,
        investmentGrowth: 0,
        annualWithdrawal: 0,
        endingBalance: 0,
        isExhausted: true,
      });
      continue;
    }

    const startBal = currentBal;
    // Growth earned on balance
    const growth = startBal * expReturn;
    totalGrowth += growth;

    // Withdrawal taken during year
    let w = currentWithdrawal;
    if (startBal + growth < w) {
      w = startBal + growth;
      currentBal = 0;
      if (exhaustionYear === null) exhaustionYear = yr;
    } else {
      currentBal = startBal + growth - w;
    }

    totalWithdrawn += w;

    projections.push({
      year: yr,
      startBalance: Math.round(startBal * 100) / 100,
      investmentGrowth: Math.round(growth * 100) / 100,
      annualWithdrawal: Math.round(w * 100) / 100,
      endingBalance: Math.round(Math.max(0, currentBal) * 100) / 100,
      isExhausted: currentBal <= 0.01,
    });

    if (adjustForInflation) {
      currentWithdrawal *= 1 + infl;
    }
  }

  const isSustainable = exhaustionYear === null && currentBal > 0;

  return {
    portfolioValue,
    withdrawalRatePct,
    initialAnnualWithdrawal: Math.round(initialAnnualWithdrawal * 100) / 100,
    initialMonthlyWithdrawal: Math.round(initialMonthlyWithdrawal * 100) / 100,
    expectedReturnPct: expReturn * 100,
    inflationPct: infl * 100,
    yearsProjected: years,
    endingBalance: Math.round(Math.max(0, currentBal) * 100) / 100,
    totalWithdrawn: Math.round(totalWithdrawn * 100) / 100,
    totalGrowthEarned: Math.round(totalGrowth * 100) / 100,
    exhaustionYear,
    isSustainable,
    projections,
  };
}
