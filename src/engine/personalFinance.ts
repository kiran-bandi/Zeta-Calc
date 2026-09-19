/**
 * Personal Finance Calculation Engines
 * 1. Monthly Survival Cost Calculator
 * 2. Emergency Fund Calculator
 * 3. Net Worth Calculator
 * 4. Savings Rate Calculator
 * 5. Financial Independence / FIRE Calculator
 */

/**
 * 1. Monthly Survival Cost Calculator
 */
export interface SurvivalCostInput {
  housingRentOrEmi: number;
  groceriesAndFood: number;
  utilitiesBills: number;
  minimumDebtPayments: number;
  essentialInsurance: number;
  basicTransportation: number;
  criticalHealthcareMedicines: number;
  otherBareNecessities?: number;
}

export interface SurvivalCostResult {
  totalMonthlySurvivalCost: number;
  totalAnnualSurvivalCost: number;
  dailySurvivalBudget: number;
  costBreakdown: { category: string; amount: number; percentage: number }[];
}

export function calculateSurvivalCost(input: SurvivalCostInput): SurvivalCostResult {
  const categories = [
    { category: 'Housing (Rent/EMI)', amount: Math.max(0, input.housingRentOrEmi) },
    { category: 'Groceries & Basic Food', amount: Math.max(0, input.groceriesAndFood) },
    { category: 'Utilities & Connectivity', amount: Math.max(0, input.utilitiesBills) },
    { category: 'Minimum Debt EMIs', amount: Math.max(0, input.minimumDebtPayments) },
    { category: 'Essential Insurance', amount: Math.max(0, input.essentialInsurance) },
    { category: 'Basic Transportation', amount: Math.max(0, input.basicTransportation) },
    { category: 'Healthcare & Medicines', amount: Math.max(0, input.criticalHealthcareMedicines) },
    { category: 'Other Essentials', amount: Math.max(0, input.otherBareNecessities || 0) },
  ];

  const totalMonthly = categories.reduce((sum, c) => sum + c.amount, 0);
  const costBreakdown = categories.map((c) => ({
    ...c,
    percentage: totalMonthly > 0 ? Math.round((c.amount / totalMonthly) * 1000) / 10 : 0,
  }));

  return {
    totalMonthlySurvivalCost: Math.round(totalMonthly),
    totalAnnualSurvivalCost: Math.round(totalMonthly * 12),
    dailySurvivalBudget: Math.round(totalMonthly / 30),
    costBreakdown,
  };
}

/**
 * 2. Emergency Fund Calculator
 */
export interface EmergencyFundInput {
  monthlyEssentialExpenses: number;
  targetRunwayMonths: number; // typically 3, 6, 9, or 12 months
  currentEmergencySavings: number;
  monthlySavingsAllocated?: number;
  jobStabilityFactor?: 'high' | 'medium' | 'freelance_variable';
}

export interface EmergencyFundResult {
  recommendedMonths: number;
  targetFundAmount: number;
  currentSavings: number;
  savingsShortfallOrSurplus: number;
  isFullyFunded: boolean;
  monthsToReachGoal: number;
  recommendedLiquidAllocation: {
    savingsAccountCash: number;
    liquidMutualFundsOrFD: number;
  };
}

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const monthly = Math.max(0, input.monthlyEssentialExpenses);
  let recommendedMonths = input.targetRunwayMonths && input.targetRunwayMonths > 0 ? input.targetRunwayMonths : 6;
  if (input.jobStabilityFactor === 'freelance_variable') {
    recommendedMonths = Math.max(recommendedMonths, 9);
  } else if (input.jobStabilityFactor === 'high') {
    recommendedMonths = Math.max(3, recommendedMonths);
  }

  const target = monthly * recommendedMonths;
  const current = Math.max(0, input.currentEmergencySavings);
  const diff = target - current;
  const monthlyAlloc = Math.max(0, input.monthlySavingsAllocated || 0);

  const monthsToGoal = diff > 0 && monthlyAlloc > 0 ? Math.ceil(diff / monthlyAlloc) : diff <= 0 ? 0 : Infinity;

  return {
    recommendedMonths,
    targetFundAmount: Math.round(target),
    currentSavings: Math.round(current),
    savingsShortfallOrSurplus: Math.round(-diff),
    isFullyFunded: current >= target,
    monthsToReachGoal: isFinite(monthsToGoal) ? monthsToGoal : 0,
    recommendedLiquidAllocation: {
      savingsAccountCash: Math.round(target * 0.30), // 30% immediate cash
      liquidMutualFundsOrFD: Math.round(target * 0.70), // 70% liquid fund / arbitrage / FD
    },
  };
}

/**
 * 3. Net Worth Calculator
 */
export interface NetWorthInput {
  // Assets
  cashAndBankBalances: number;
  liquidInvestmentsStocksMutualFunds: number;
  retirementFundsEPF_PPF_NPS: number;
  realEstatePrimaryProperty: number;
  realEstateOtherLand: number;
  vehiclesAndValuables: number;
  businessEquityOrOtherAssets?: number;

  // Liabilities
  homeLoanMortgage: number;
  carAutoLoans: number;
  personalLoans: number;
  creditCardBalances: number;
  studentEducationLoans: number;
  otherDebts?: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liquidAssets: number;
  debtToAssetRatio: number;
  solvencyStatus: 'solvent' | 'insolvent';
  assetDistribution: { category: string; value: number; percentage: number }[];
  liabilityDistribution: { category: string; value: number; percentage: number }[];
}

export function calculateNetWorth(input: NetWorthInput): NetWorthResult {
  const assets = [
    { category: 'Cash & Savings Accounts', value: Math.max(0, input.cashAndBankBalances) },
    { category: 'Stocks & Mutual Funds', value: Math.max(0, input.liquidInvestmentsStocksMutualFunds) },
    { category: 'Retirement (EPF/PPF/NPS)', value: Math.max(0, input.retirementFundsEPF_PPF_NPS) },
    { category: 'Primary Real Estate', value: Math.max(0, input.realEstatePrimaryProperty) },
    { category: 'Other Real Estate / Land', value: Math.max(0, input.realEstateOtherLand) },
    { category: 'Vehicles & Physical Assets', value: Math.max(0, input.vehiclesAndValuables) },
    { category: 'Business / Other Equity', value: Math.max(0, input.businessEquityOrOtherAssets || 0) },
  ];

  const liabilities = [
    { category: 'Home Loan / Mortgage', value: Math.max(0, input.homeLoanMortgage) },
    { category: 'Auto / Vehicle Loans', value: Math.max(0, input.carAutoLoans) },
    { category: 'Personal Loans', value: Math.max(0, input.personalLoans) },
    { category: 'Credit Card Balances', value: Math.max(0, input.creditCardBalances) },
    { category: 'Student / Education Loans', value: Math.max(0, input.studentEducationLoans) },
    { category: 'Other Liabilities', value: Math.max(0, input.otherDebts || 0) },
  ];

  const totalAssets = assets.reduce((s, a) => s + a.value, 0);
  const totalLiabilities = liabilities.reduce((s, l) => s + l.value, 0);
  const netWorth = totalAssets - totalLiabilities;

  const liquidAssets = input.cashAndBankBalances + input.liquidInvestmentsStocksMutualFunds;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  return {
    totalAssets: Math.round(totalAssets),
    totalLiabilities: Math.round(totalLiabilities),
    netWorth: Math.round(netWorth),
    liquidAssets: Math.round(liquidAssets),
    debtToAssetRatio: Math.round(debtToAssetRatio * 10) / 10,
    solvencyStatus: netWorth >= 0 ? 'solvent' : 'insolvent',
    assetDistribution: assets.map((a) => ({
      ...a,
      percentage: totalAssets > 0 ? Math.round((a.value / totalAssets) * 1000) / 10 : 0,
    })),
    liabilityDistribution: liabilities.map((l) => ({
      ...l,
      percentage: totalLiabilities > 0 ? Math.round((l.value / totalLiabilities) * 1000) / 10 : 0,
    })),
  };
}

/**
 * 4. Savings Rate & 50/30/20 Budget Calculator
 */
export interface SavingsRateInput {
  monthlyGrossIncome: number;
  monthlyTaxDeductions: number;
  monthlyNeedsExpenses: number; // Essentials (rent, groceries, bills)
  monthlyWantsExpenses: number; // Discretionary (dining, travel, shopping)
  monthlySavingsAndInvestments: number; // Actual savings
}

export interface SavingsRateResult {
  monthlyNetTakeHome: number;
  savingsRatePercentage: number;
  needsPercentage: number;
  wantsPercentage: number;
  budgetComparison50_30_20: {
    category: 'Needs' | 'Wants' | 'Savings';
    actualAmount: number;
    actualPercentage: number;
    recommendedTarget: number;
    recommendedPercentage: number;
    status: 'on_track' | 'needs_attention' | 'optimal';
  }[];
}

export function calculateSavingsRate(input: SavingsRateInput): SavingsRateResult {
  const gross = Math.max(0, input.monthlyGrossIncome);
  const tax = Math.max(0, input.monthlyTaxDeductions);
  const net = Math.max(0, gross - tax);

  const needs = Math.max(0, input.monthlyNeedsExpenses);
  const wants = Math.max(0, input.monthlyWantsExpenses);
  const savings = Math.max(0, input.monthlySavingsAndInvestments > 0 ? input.monthlySavingsAndInvestments : net - needs - wants);

  const savingsRate = net > 0 ? (savings / net) * 100 : 0;
  const needsPct = net > 0 ? (needs / net) * 100 : 0;
  const wantsPct = net > 0 ? (wants / net) * 100 : 0;

  return {
    monthlyNetTakeHome: Math.round(net),
    savingsRatePercentage: Math.round(savingsRate * 10) / 10,
    needsPercentage: Math.round(needsPct * 10) / 10,
    wantsPercentage: Math.round(wantsPct * 10) / 10,
    budgetComparison50_30_20: [
      {
        category: 'Needs',
        actualAmount: Math.round(needs),
        actualPercentage: Math.round(needsPct * 10) / 10,
        recommendedTarget: Math.round(net * 0.50),
        recommendedPercentage: 50,
        status: needsPct <= 50 ? 'on_track' : 'needs_attention',
      },
      {
        category: 'Wants',
        actualAmount: Math.round(wants),
        actualPercentage: Math.round(wantsPct * 10) / 10,
        recommendedTarget: Math.round(net * 0.30),
        recommendedPercentage: 30,
        status: wantsPct <= 30 ? 'on_track' : 'needs_attention',
      },
      {
        category: 'Savings',
        actualAmount: Math.round(savings),
        actualPercentage: Math.round(savingsRate * 10) / 10,
        recommendedTarget: Math.round(net * 0.20),
        recommendedPercentage: 20,
        status: savingsRate >= 20 ? 'optimal' : 'needs_attention',
      },
    ],
  };
}

/**
 * 5. FIRE / Financial Independence Calculator
 * (Standard FIRE, Lean FIRE, Fat FIRE, Coast FIRE, Barista FIRE)
 */
export interface FIREInput {
  currentAge: number;
  monthlyAnnualExpenses: number; // annual living expenses
  currentNetWorthInvestments: number;
  monthlyInvestmentAmount: number;
  expectedAnnualReturnRate: number; // % annual e.g. 10%
  expectedInflationRate: number; // % annual e.g. 6%
  safeWithdrawalRate?: number; // % annual e.g. 4% (25x) or 3.33% (30x)
}

export interface FIREResult {
  standardFireNumber: number; // 25x or 30x expenses
  leanFireNumber: number; // 75% of expenses
  fatFireNumber: number; // 150% of expenses
  yearsToFIRE: number;
  fireAge: number;
  fireYear: number;
  coastFireTargetNow: number;
  safeWithdrawalRate: number;
  milestones: {
    milestone: string;
    targetCorpus: number;
    reached: boolean;
  }[];
}

export function calculateFIRE(input: FIREInput): FIREResult {
  const age = Math.max(18, input.currentAge);
  const annualExpenses = Math.max(0, input.monthlyAnnualExpenses);
  const currentInvestments = Math.max(0, input.currentNetWorthInvestments);
  const monthlySip = Math.max(0, input.monthlyInvestmentAmount);
  const swr = (input.safeWithdrawalRate || 4) / 100;

  const standardFireNumber = swr > 0 ? annualExpenses / swr : annualExpenses * 25;
  const leanFireNumber = standardFireNumber * 0.75;
  const fatFireNumber = standardFireNumber * 1.50;

  const rNominal = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const inf = Math.max(0, input.expectedInflationRate) / 100;
  const realRate = (1 + rNominal) / (1 + inf) - 1;
  const monthlyRealRate = Math.pow(1 + realRate, 1 / 12) - 1;

  // Simulate months to reach standardFireNumber in real terms
  let portfolio = currentInvestments;
  let months = 0;
  const maxMonths = 100 * 12; // 100 years max

  while (portfolio < standardFireNumber && months < maxMonths) {
    portfolio = (portfolio + monthlySip) * (1 + monthlyRealRate);
    months++;
  }

  const yearsToFire = Math.round((months / 12) * 10) / 10;
  const currentYear = new Date().getFullYear();
  const fireAge = Math.round(age + yearsToFire);
  const fireYear = Math.round(currentYear + yearsToFire);

  // Coast FIRE: Amount needed today that will grow to FIRE number at age 60 without further contributions
  const yearsTo60 = Math.max(1, 60 - age);
  const coastFireTargetNow = standardFireNumber / Math.pow(1 + realRate, yearsTo60);

  return {
    standardFireNumber: Math.round(standardFireNumber),
    leanFireNumber: Math.round(leanFireNumber),
    fatFireNumber: Math.round(fatFireNumber),
    yearsToFIRE: yearsToFire,
    fireAge,
    fireYear,
    coastFireTargetNow: Math.round(coastFireTargetNow),
    safeWithdrawalRate: swr * 100,
    milestones: [
      {
        milestone: 'Lean FIRE (Basic Essentials)',
        targetCorpus: Math.round(leanFireNumber),
        reached: currentInvestments >= leanFireNumber,
      },
      {
        milestone: 'Standard FIRE (Current Lifestyle)',
        targetCorpus: Math.round(standardFireNumber),
        reached: currentInvestments >= standardFireNumber,
      },
      {
        milestone: 'Fat FIRE (Abundant Lifestyle)',
        targetCorpus: Math.round(fatFireNumber),
        reached: currentInvestments >= fatFireNumber,
      },
      {
        milestone: 'Coast FIRE (Zero Future Savings needed for age 60)',
        targetCorpus: Math.round(coastFireTargetNow),
        reached: currentInvestments >= coastFireTargetNow,
      },
    ],
  };
}
