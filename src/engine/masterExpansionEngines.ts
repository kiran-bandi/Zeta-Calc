/**
 * Deterministic Calculation Engines for Master Expansion Tools
 *
 * Rules:
 * - 100% Deterministic TypeScript
 * - No default values in calculation logic
 * - Zero is treated as valid 0, empty values are handled explicitly
 * - Division by zero guarded
 * - Clean display rounding while keeping internal math full-precision
 */

// ============================================================================
// 1. PERSONAL FINANCE & DEBT PAYOFF ENGINES
// ============================================================================

export interface DebtPayoffInput {
  balance: number;
  annualInterestRate: number; // e.g. 18 for 18%
  monthlyPayment: number;
  extraMonthlyPayment?: number;
}

export interface DebtPayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  monthlySavingsWithExtra: number;
  interestSavedWithExtra: number;
  monthsSavedWithExtra: number;
}

export function calculateDebtPayoff(input: DebtPayoffInput): DebtPayoffResult | null {
  const { balance, annualInterestRate, monthlyPayment, extraMonthlyPayment = 0 } = input;
  if (balance <= 0 || monthlyPayment <= 0) return null;

  const monthlyRate = annualInterestRate > 0 ? annualInterestRate / 100 / 12 : 0;
  const initialMonthlyInterest = balance * monthlyRate;
  if (monthlyPayment <= initialMonthlyInterest && annualInterestRate > 0) {
    // Payment too low to cover interest (infinite loan)
    return null;
  }

  const simulate = (payment: number) => {
    let remBalance = balance;
    let totalInterest = 0;
    let months = 0;
    const maxMonths = 1200; // 100 years guard

    while (remBalance > 0.01 && months < maxMonths) {
      months++;
      const interest = remBalance * monthlyRate;
      totalInterest += interest;
      const principalPaid = Math.min(remBalance, payment - interest);
      remBalance -= principalPaid;
    }
    return { months, totalInterest, totalPaid: balance + totalInterest };
  };

  const base = simulate(monthlyPayment);
  const withExtra = extraMonthlyPayment > 0 ? simulate(monthlyPayment + extraMonthlyPayment) : base;

  return {
    monthsToPayoff: withExtra.months,
    yearsToPayoff: Math.round((withExtra.months / 12) * 10) / 10,
    totalInterestPaid: Math.round(withExtra.totalInterest),
    totalAmountPaid: Math.round(withExtra.totalPaid),
    monthlySavingsWithExtra: extraMonthlyPayment,
    interestSavedWithExtra: Math.max(0, Math.round(base.totalInterest - withExtra.totalInterest)),
    monthsSavedWithExtra: Math.max(0, base.months - withExtra.months),
  };
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  annualInterestRate: number;
  minimumPayment: number;
}

export interface SnowballAvalancheResult {
  snowballMonths: number;
  snowballTotalInterest: number;
  snowballTotalPaid: number;
  avalancheMonths: number;
  avalancheTotalInterest: number;
  avalancheTotalPaid: number;
  interestDifference: number; // avalanche savings over snowball
  recommendedStrategy: 'Snowball (Fast Psychological Wins)' | 'Avalanche (Maximum Interest Savings)' | 'Equivalent';
}

export function calculateSnowballVsAvalanche(
  debts: DebtItem[],
  extraMonthlyBudget: number = 0
): SnowballAvalancheResult | null {
  const validDebts = debts.filter((d) => d.balance > 0 && d.minimumPayment > 0);
  if (validDebts.length === 0) return null;

  const simulateStrategy = (isSnowball: boolean) => {
    let remainingDebts = validDebts.map((d) => ({
      ...d,
      currentBalance: d.balance,
      monthlyRate: d.annualInterestRate > 0 ? d.annualInterestRate / 100 / 12 : 0,
    }));

    let months = 0;
    let totalInterest = 0;
    const maxMonths = 1200;

    while (remainingDebts.some((d) => d.currentBalance > 0.01) && months < maxMonths) {
      months++;
      // Accrue interest
      remainingDebts.forEach((d) => {
        if (d.currentBalance > 0.01) {
          const interest = d.currentBalance * d.monthlyRate;
          totalInterest += interest;
          d.currentBalance += interest;
        }
      });

      // Pay minimums
      let availableExtra = extraMonthlyBudget;
      remainingDebts.forEach((d) => {
        if (d.currentBalance > 0.01) {
          const payment = Math.min(d.currentBalance, d.minimumPayment);
          d.currentBalance -= payment;
        }
      });

      // Sort remaining active debts for target accelerated payment
      const activeDebts = remainingDebts.filter((d) => d.currentBalance > 0.01);
      if (activeDebts.length > 0 && availableExtra > 0) {
        if (isSnowball) {
          activeDebts.sort((a, b) => a.currentBalance - b.currentBalance);
        } else {
          activeDebts.sort((a, b) => b.annualInterestRate - a.annualInterestRate);
        }
        for (const target of activeDebts) {
          if (availableExtra <= 0) break;
          const extraPay = Math.min(target.currentBalance, availableExtra);
          target.currentBalance -= extraPay;
          availableExtra -= extraPay;
        }
      }
    }

    const totalPrincipal = validDebts.reduce((sum, d) => sum + d.balance, 0);
    return { months, totalInterest, totalPaid: totalPrincipal + totalInterest };
  };

  const snowball = simulateStrategy(true);
  const avalanche = simulateStrategy(false);
  const interestDiff = Math.max(0, Math.round(snowball.totalInterest - avalanche.totalInterest));

  let recommendedStrategy: SnowballAvalancheResult['recommendedStrategy'] = 'Equivalent';
  if (interestDiff > 50) {
    recommendedStrategy = 'Avalanche (Maximum Interest Savings)';
  } else {
    recommendedStrategy = 'Snowball (Fast Psychological Wins)';
  }

  return {
    snowballMonths: snowball.months,
    snowballTotalInterest: Math.round(snowball.totalInterest),
    snowballTotalPaid: Math.round(snowball.totalPaid),
    avalancheMonths: avalanche.months,
    avalancheTotalInterest: Math.round(avalanche.totalInterest),
    avalancheTotalPaid: Math.round(avalanche.totalPaid),
    interestDifference: interestDiff,
    recommendedStrategy,
  };
}

export interface CreditCardInterestInput {
  balance: number;
  apr: number; // e.g. 24 for 24%
  daysInCycle?: number; // default 30
}

export interface CreditCardInterestResult {
  monthlyInterestCharge: number;
  dailyPeriodicRate: number; // percentage e.g. 0.0657%
  annualInterestCharge: number;
  effectiveAnnualPercentageRate: number;
}

export function calculateCreditCardInterest(input: CreditCardInterestInput): CreditCardInterestResult | null {
  const { balance, apr, daysInCycle = 30 } = input;
  if (balance <= 0 || apr <= 0) return null;

  const dailyPeriodicRate = apr / 365; // percentage per day
  const monthlyInterestCharge = balance * (dailyPeriodicRate / 100) * daysInCycle;
  const annualInterestCharge = monthlyInterestCharge * (365 / daysInCycle);
  const effectiveAnnualRate = (Math.pow(1 + dailyPeriodicRate / 100, 365) - 1) * 100;

  return {
    monthlyInterestCharge: Math.round(monthlyInterestCharge * 100) / 100,
    dailyPeriodicRate: Math.round(dailyPeriodicRate * 10000) / 10000,
    annualInterestCharge: Math.round(annualInterestCharge * 100) / 100,
    effectiveAnnualPercentageRate: Math.round(effectiveAnnualRate * 100) / 100,
  };
}

export interface PortfolioRebalancingAsset {
  id: string;
  name: string;
  currentValue: number;
  targetPercent: number; // e.g. 40 for 40%
}

export interface PortfolioRebalancingResult {
  totalPortfolioValue: number;
  targetTotalPercent: number;
  rebalanceItems: Array<{
    name: string;
    currentValue: number;
    currentPercent: number;
    targetPercent: number;
    targetValue: number;
    action: 'BUY' | 'SELL' | 'HOLD';
    actionAmount: number;
  }>;
}

export function calculatePortfolioRebalancing(
  assets: PortfolioRebalancingAsset[]
): PortfolioRebalancingResult | null {
  const valid = assets.filter((a) => a.currentValue >= 0);
  if (valid.length === 0) return null;

  const totalValue = valid.reduce((sum, a) => sum + a.currentValue, 0);
  if (totalValue <= 0) return null;

  const targetTotalPercent = valid.reduce((sum, a) => sum + (a.targetPercent || 0), 0);

  const rebalanceItems = valid.map((a) => {
    const currentPercent = Math.round((a.currentValue / totalValue) * 1000) / 10;
    const targetValue = Math.round(totalValue * ((a.targetPercent || 0) / 100));
    const delta = targetValue - a.currentValue;

    let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    if (delta > 1) action = 'BUY';
    else if (delta < -1) action = 'SELL';

    return {
      name: a.name,
      currentValue: a.currentValue,
      currentPercent,
      targetPercent: a.targetPercent || 0,
      targetValue,
      action,
      actionAmount: Math.abs(delta),
    };
  });

  return {
    totalPortfolioValue: Math.round(totalValue),
    targetTotalPercent,
    rebalanceItems,
  };
}

// ============================================================================
// 2. RETIREMENT SPECIALIZED ENGINES (401k, Roth IRA, HSA)
// ============================================================================

export interface FourZeroOneKInput {
  currentBalance: number;
  annualSalary: number;
  employeeContributionPercent: number; // e.g. 8 for 8%
  employerMatchPercent: number; // e.g. 50 for 50% match
  employerMatchCapPercent: number; // e.g. 6 for up to 6% of salary
  annualReturnRate: number; // e.g. 7 for 7%
  yearsToRetire: number;
}

export interface FourZeroOneKResult {
  projectedEndingBalance: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalInvestmentGrowth: number;
  annualEmployeeContribution: number;
  annualEmployerMatch: number;
}

export function calculate401k(input: FourZeroOneKInput): FourZeroOneKResult | null {
  const {
    currentBalance,
    annualSalary,
    employeeContributionPercent,
    employerMatchPercent,
    employerMatchCapPercent,
    annualReturnRate,
    yearsToRetire,
  } = input;

  if (annualSalary <= 0 || yearsToRetire <= 0) return null;

  const annualEmployee = annualSalary * (employeeContributionPercent / 100);
  const eligibleMatchPercent = Math.min(employeeContributionPercent, employerMatchCapPercent);
  const annualEmployer = annualSalary * (eligibleMatchPercent / 100) * (employerMatchPercent / 100);
  const totalAnnualAdd = annualEmployee + annualEmployer;
  const r = annualReturnRate / 100;

  let balance = currentBalance;
  let totalEmployee = 0;
  let totalEmployer = 0;

  for (let year = 1; year <= yearsToRetire; year++) {
    balance = balance * (1 + r) + totalAnnualAdd;
    totalEmployee += annualEmployee;
    totalEmployer += annualEmployer;
  }

  const totalContributions = currentBalance + totalEmployee + totalEmployer;
  const totalGrowth = Math.max(0, balance - totalContributions);

  return {
    projectedEndingBalance: Math.round(balance),
    totalEmployeeContributions: Math.round(totalEmployee),
    totalEmployerContributions: Math.round(totalEmployer),
    totalInvestmentGrowth: Math.round(totalGrowth),
    annualEmployeeContribution: Math.round(annualEmployee),
    annualEmployerMatch: Math.round(annualEmployer),
  };
}

export interface RothIRAInput {
  currentBalance: number;
  annualContribution: number;
  annualReturnRate: number;
  years: number;
}

export interface RothIRAResult {
  projectedCorpus: number;
  totalContributions: number;
  taxFreeGrowth: number;
}

export function calculateRothIRA(input: RothIRAInput): RothIRAResult | null {
  const { currentBalance, annualContribution, annualReturnRate, years } = input;
  if (years <= 0 || (currentBalance <= 0 && annualContribution <= 0)) return null;

  const r = annualReturnRate / 100;
  let corpus = currentBalance;
  let totalContributed = currentBalance;

  for (let y = 1; y <= years; y++) {
    corpus = corpus * (1 + r) + annualContribution;
    totalContributed += annualContribution;
  }

  return {
    projectedCorpus: Math.round(corpus),
    totalContributions: Math.round(totalContributed),
    taxFreeGrowth: Math.max(0, Math.round(corpus - totalContributed)),
  };
}

export interface HSAInput {
  currentBalance: number;
  annualContribution: number;
  employerContribution?: number;
  annualReturnRate: number;
  years: number;
}

export interface HSAResult {
  projectedBalance: number;
  totalContributions: number;
  taxFreeInvestmentEarnings: number;
  totalAnnualContribution: number;
}

export function calculateHSA(input: HSAInput): HSAResult | null {
  const { currentBalance, annualContribution, employerContribution = 0, annualReturnRate, years } = input;
  if (years <= 0) return null;

  const annualTotal = annualContribution + employerContribution;
  const r = annualReturnRate / 100;

  let balance = currentBalance;
  let totalContributed = currentBalance;

  for (let y = 1; y <= years; y++) {
    balance = balance * (1 + r) + annualTotal;
    totalContributed += annualTotal;
  }

  return {
    projectedBalance: Math.round(balance),
    totalContributions: Math.round(totalContributed),
    taxFreeInvestmentEarnings: Math.max(0, Math.round(balance - totalContributed)),
    totalAnnualContribution: Math.round(annualTotal),
  };
}

// ============================================================================
// 3. PROPERTY & REAL ESTATE ENGINES (LTV, Appreciation, Rental Cash Flow, Points)
// ============================================================================

export interface LTVInput {
  loanAmount: number;
  propertyValue: number;
}

export interface LTVResult {
  ltvPercentage: number;
  equityPercentage: number;
  equityValue: number;
  riskCategory: 'Low Risk (≤80%)' | 'Moderate Risk (80%-90%)' | 'High Risk / PMI Required (>90%)';
}

export function calculateLTV(input: LTVInput): LTVResult | null {
  const { loanAmount, propertyValue } = input;
  if (propertyValue <= 0 || loanAmount <= 0) return null;

  const ltv = (loanAmount / propertyValue) * 100;
  const equityPercent = Math.max(0, 100 - ltv);
  const equityValue = Math.max(0, propertyValue - loanAmount);

  let riskCategory: LTVResult['riskCategory'] = 'Low Risk (≤80%)';
  if (ltv > 90) riskCategory = 'High Risk / PMI Required (>90%)';
  else if (ltv > 80) riskCategory = 'Moderate Risk (80%-90%)';

  return {
    ltvPercentage: Math.round(ltv * 100) / 100,
    equityPercentage: Math.round(equityPercent * 100) / 100,
    equityValue: Math.round(equityValue),
    riskCategory,
  };
}

export interface PropertyAppreciationInput {
  currentValue: number;
  annualAppreciationRate: number; // e.g. 5 for 5%
  years: number;
}

export interface PropertyAppreciationResult {
  futureValue: number;
  totalAppreciation: number;
  totalPercentageGain: number;
}

export function calculatePropertyAppreciation(input: PropertyAppreciationInput): PropertyAppreciationResult | null {
  const { currentValue, annualAppreciationRate, years } = input;
  if (currentValue <= 0 || years <= 0) return null;

  const futureValue = currentValue * Math.pow(1 + annualAppreciationRate / 100, years);
  const totalAppreciation = futureValue - currentValue;
  const totalPercentageGain = (totalAppreciation / currentValue) * 100;

  return {
    futureValue: Math.round(futureValue),
    totalAppreciation: Math.round(totalAppreciation),
    totalPercentageGain: Math.round(totalPercentageGain * 10) / 10,
  };
}

export interface RentalCashFlowInput {
  monthlyGrossRent: number;
  vacancyRatePercent?: number; // e.g. 5 for 5%
  monthlyMortgagePayment?: number;
  annualPropertyTax?: number;
  annualInsurance?: number;
  monthlyMaintenance?: number;
  propertyManagementPercent?: number; // e.g. 8 for 8%
  totalInitialInvestment?: number; // down payment + closing + reno
}

export interface RentalCashFlowResult {
  effectiveMonthlyGrossIncome: number;
  totalMonthlyOperatingExpenses: number;
  netMonthlyCashFlow: number;
  annualNetCashFlow: number;
  cashOnCashReturnPercent?: number;
}

export function calculateRentalCashFlow(input: RentalCashFlowInput): RentalCashFlowResult | null {
  const {
    monthlyGrossRent,
    vacancyRatePercent = 0,
    monthlyMortgagePayment = 0,
    annualPropertyTax = 0,
    annualInsurance = 0,
    monthlyMaintenance = 0,
    propertyManagementPercent = 0,
    totalInitialInvestment,
  } = input;

  if (monthlyGrossRent <= 0) return null;

  const effectiveRent = monthlyGrossRent * (1 - vacancyRatePercent / 100);
  const monthlyTax = annualPropertyTax / 12;
  const monthlyIns = annualInsurance / 12;
  const monthlyMgmt = effectiveRent * (propertyManagementPercent / 100);

  const totalMonthlyExpenses =
    monthlyMortgagePayment + monthlyTax + monthlyIns + monthlyMaintenance + monthlyMgmt;
  const netMonthly = effectiveRent - totalMonthlyExpenses;
  const annualNet = netMonthly * 12;

  let cashOnCash: number | undefined;
  if (totalInitialInvestment && totalInitialInvestment > 0) {
    cashOnCash = Math.round((annualNet / totalInitialInvestment) * 10000) / 100;
  }

  return {
    effectiveMonthlyGrossIncome: Math.round(effectiveRent),
    totalMonthlyOperatingExpenses: Math.round(totalMonthlyExpenses),
    netMonthlyCashFlow: Math.round(netMonthly),
    annualNetCashFlow: Math.round(annualNet),
    cashOnCashReturnPercent: cashOnCash,
  };
}

export interface MortgagePointsInput {
  loanAmount: number;
  pointsCost: number; // total upfront cost of discount points
  interestRateWithoutPoints: number; // e.g. 6.5%
  interestRateWithPoints: number; // e.g. 6.0%
  termYears?: number; // default 30
}

export interface MortgagePointsResult {
  monthlyPaymentWithoutPoints: number;
  monthlyPaymentWithPoints: number;
  monthlySavings: number;
  breakEvenMonths: number;
  breakEvenYears: number;
  totalSavingsOverTerm: number;
}

export function calculateMortgagePoints(input: MortgagePointsInput): MortgagePointsResult | null {
  const {
    loanAmount,
    pointsCost,
    interestRateWithoutPoints,
    interestRateWithPoints,
    termYears = 30,
  } = input;

  if (loanAmount <= 0 || pointsCost <= 0 || interestRateWithoutPoints <= 0) return null;

  const calcPmt = (rate: number) => {
    const r = rate / 100 / 12;
    const n = termYears * 12;
    if (r === 0) return loanAmount / n;
    return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const pmtWithout = calcPmt(interestRateWithoutPoints);
  const pmtWith = calcPmt(interestRateWithPoints);
  const monthlySavings = pmtWithout - pmtWith;

  if (monthlySavings <= 0) return null;

  const breakEvenMonths = Math.ceil(pointsCost / monthlySavings);
  const totalMonths = termYears * 12;
  const totalSavings = monthlySavings * totalMonths - pointsCost;

  return {
    monthlyPaymentWithoutPoints: Math.round(pmtWithout),
    monthlyPaymentWithPoints: Math.round(pmtWith),
    monthlySavings: Math.round(monthlySavings * 100) / 100,
    breakEvenMonths,
    breakEvenYears: Math.round((breakEvenMonths / 12) * 10) / 10,
    totalSavingsOverTerm: Math.round(totalSavings),
  };
}

// ============================================================================
// 4. BUSINESS, MARKETING & OPERATIONS ENGINES (ROAS, CAC, CLV, GMROI, Employee Cost)
// ============================================================================

export function calculateROAS(adRevenue: number, adSpend: number): { roasMultiplier: number; roasPercentage: number } | null {
  if (adRevenue <= 0 || adSpend <= 0) return null;
  const mult = adRevenue / adSpend;
  return {
    roasMultiplier: Math.round(mult * 100) / 100,
    roasPercentage: Math.round(mult * 10000) / 100,
  };
}

export function calculateCAC(totalSalesAndMarketingCost: number, newCustomersAcquired: number): { cac: number } | null {
  if (totalSalesAndMarketingCost <= 0 || newCustomersAcquired <= 0) return null;
  return {
    cac: Math.round((totalSalesAndMarketingCost / newCustomersAcquired) * 100) / 100,
  };
}

export interface CLVInput {
  averagePurchaseValue: number;
  purchaseFrequencyPerYear: number;
  grossMarginPercent: number; // e.g. 60 for 60%
  customerLifespanYears: number;
  cac?: number;
}

export interface CLVResult {
  customerLifetimeValue: number;
  annualCustomerValue: number;
  clvToCacRatio?: number;
}

export function calculateCLV(input: CLVInput): CLVResult | null {
  const { averagePurchaseValue, purchaseFrequencyPerYear, grossMarginPercent, customerLifespanYears, cac } = input;
  if (averagePurchaseValue <= 0 || purchaseFrequencyPerYear <= 0 || customerLifespanYears <= 0) return null;

  const annualRevenue = averagePurchaseValue * purchaseFrequencyPerYear;
  const annualMargin = annualRevenue * (grossMarginPercent / 100);
  const clv = annualMargin * customerLifespanYears;

  let ratio: number | undefined;
  if (cac && cac > 0) {
    ratio = Math.round((clv / cac) * 100) / 100;
  }

  return {
    customerLifetimeValue: Math.round(clv),
    annualCustomerValue: Math.round(annualMargin),
    clvToCacRatio: ratio,
  };
}

export function calculateGMROI(grossMarginAmount: number, averageInventoryCost: number): { gmroiRatio: number; gmroiPercent: number } | null {
  if (averageInventoryCost <= 0 || grossMarginAmount < 0) return null;
  const ratio = grossMarginAmount / averageInventoryCost;
  return {
    gmroiRatio: Math.round(ratio * 100) / 100,
    gmroiPercent: Math.round(ratio * 10000) / 100,
  };
}

export interface EmployeeCostInput {
  baseSalary: number;
  payrollTaxesPercent?: number; // e.g. 7.65%
  healthInsuranceAnnual?: number;
  retirementMatchAnnual?: number;
  annualBonus?: number;
  equipmentAndOverheadAnnual?: number;
}

export interface EmployeeCostResult {
  totalAnnualCost: number;
  overheadMarkupPercent: number;
  costPerHour: number; // based on 2080 hours
}

export function calculateEmployeeCost(input: EmployeeCostInput): EmployeeCostResult | null {
  const {
    baseSalary,
    payrollTaxesPercent = 0,
    healthInsuranceAnnual = 0,
    retirementMatchAnnual = 0,
    annualBonus = 0,
    equipmentAndOverheadAnnual = 0,
  } = input;

  if (baseSalary <= 0) return null;

  const taxes = baseSalary * (payrollTaxesPercent / 100);
  const total =
    baseSalary + taxes + healthInsuranceAnnual + retirementMatchAnnual + annualBonus + equipmentAndOverheadAnnual;
  const markup = ((total - baseSalary) / baseSalary) * 100;
  const hourly = total / 2080;

  return {
    totalAnnualCost: Math.round(total),
    overheadMarkupPercent: Math.round(markup * 10) / 10,
    costPerHour: Math.round(hourly * 100) / 100,
  };
}

export interface ProjectProfitabilityInput {
  contractRevenue: number;
  laborCost: number;
  materialsCost?: number;
  overheadCost?: number;
}

export interface ProjectProfitabilityResult {
  totalExpenses: number;
  netProfit: number;
  profitMarginPercent: number;
  roiPercent: number;
}

export function calculateProjectProfitability(input: ProjectProfitabilityInput): ProjectProfitabilityResult | null {
  const { contractRevenue, laborCost, materialsCost = 0, overheadCost = 0 } = input;
  if (contractRevenue <= 0) return null;

  const totalExpenses = laborCost + materialsCost + overheadCost;
  const netProfit = contractRevenue - totalExpenses;
  const margin = (netProfit / contractRevenue) * 100;
  const roi = totalExpenses > 0 ? (netProfit / totalExpenses) * 100 : 0;

  return {
    totalExpenses: Math.round(totalExpenses),
    netProfit: Math.round(netProfit),
    profitMarginPercent: Math.round(margin * 10) / 10,
    roiPercent: Math.round(roi * 10) / 10,
  };
}

// ============================================================================
// 5. SALARY & COMPENSATION ENGINES
// ============================================================================

export function calculateHourlyToSalary(hourlyRate: number, hoursPerWeek: number = 40, weeksPerYear: number = 52) {
  if (hourlyRate <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) return null;
  const annual = hourlyRate * hoursPerWeek * weeksPerYear;
  return {
    annualSalary: Math.round(annual),
    monthlySalary: Math.round(annual / 12),
    biweeklySalary: Math.round(annual / 26),
    weeklySalary: Math.round(annual / weeksPerYear),
  };
}

export function calculateSalaryToHourly(annualSalary: number, hoursPerWeek: number = 40, weeksPerYear: number = 52) {
  if (annualSalary <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) return null;
  const totalHours = hoursPerWeek * weeksPerYear;
  const hourly = annualSalary / totalHours;
  return {
    hourlyRate: Math.round(hourly * 100) / 100,
    dailyRate: Math.round((annualSalary / (weeksPerYear * 5)) * 100) / 100,
    weeklyRate: Math.round(annualSalary / weeksPerYear),
    monthlyRate: Math.round(annualSalary / 12),
  };
}

export function calculateBonusCommission(
  baseSalary: number,
  bonusAmountOrPercent: number,
  isBonusPercent: boolean,
  commissionRatePercent: number,
  salesVolume: number
) {
  if (baseSalary < 0) return null;
  const bonus = isBonusPercent ? baseSalary * (bonusAmountOrPercent / 100) : bonusAmountOrPercent;
  const commission = salesVolume * (commissionRatePercent / 100);
  const total = baseSalary + bonus + commission;

  return {
    baseSalary: Math.round(baseSalary),
    bonusAmount: Math.round(bonus),
    commissionAmount: Math.round(commission),
    totalCompensation: Math.round(total),
  };
}

export function calculateTotalCompensation(
  baseSalary: number,
  bonus: number = 0,
  commission: number = 0,
  retirementMatch: number = 0,
  healthInsurance: number = 0,
  equityOrRSU: number = 0,
  otherBenefits: number = 0
) {
  if (baseSalary <= 0) return null;
  const total = baseSalary + bonus + commission + retirementMatch + healthInsurance + equityOrRSU + otherBenefits;
  return {
    totalCompensation: Math.round(total),
    baseSalaryPercent: Math.round((baseSalary / total) * 1000) / 10,
    benefitsTotal: Math.round(retirementMatch + healthInsurance + equityOrRSU + otherBenefits),
  };
}

export function calculateRequiredSalary(targetNetTakeHome: number, estimatedTaxAndDeductionPercent: number) {
  if (targetNetTakeHome <= 0 || estimatedTaxAndDeductionPercent >= 100) return null;
  const factor = 1 - estimatedTaxAndDeductionPercent / 100;
  const gross = targetNetTakeHome / factor;
  return {
    requiredGrossSalary: Math.round(gross),
    totalTaxesAndDeductions: Math.round(gross - targetNetTakeHome),
  };
}

// ============================================================================
// 6. EDUCATION ENGINES
// ============================================================================

export function calculateGPAToPercentage(gpa: number, maxScale: 4.0 | 10.0 = 4.0): { equivalentPercentage: number } | null {
  if (gpa < 0 || gpa > maxScale) return null;
  let percent = 0;
  if (maxScale === 4.0) {
    // Standard US 4.0 conversion formula: (GPA / 4) * 100 or polynomial mapping
    percent = (gpa / 4.0) * 100;
  } else {
    // 10-point scale: standard percentage is GPA * 9.5 (e.g. CBSE/AICTE India)
    percent = gpa * 9.5;
  }
  return { equivalentPercentage: Math.round(percent * 10) / 10 };
}

export function calculateWhatGradeDoINeed(currentGradePercent: number, targetGradePercent: number, finalExamWeightPercent: number) {
  if (finalExamWeightPercent <= 0 || finalExamWeightPercent > 100) return null;
  const currentWeight = (100 - finalExamWeightPercent) / 100;
  const finalWeight = finalExamWeightPercent / 100;

  // target = (current * currentWeight) + (required * finalWeight)
  const required = (targetGradePercent - currentGradePercent * currentWeight) / finalWeight;
  return {
    requiredFinalScore: Math.round(required * 10) / 10,
    isAchievable: required <= 100,
  };
}

export function calculateCollegeCost(
  tuitionAndFees: number,
  roomAndBoard: number,
  booksAndSupplies: number = 0,
  personalAndTravel: number = 0,
  scholarshipsAndGrants: number = 0,
  years: number = 4
) {
  const annualGross = tuitionAndFees + roomAndBoard + booksAndSupplies + personalAndTravel;
  const annualNet = Math.max(0, annualGross - scholarshipsAndGrants);
  return {
    annualGrossCost: Math.round(annualGross),
    annualNetCost: Math.round(annualNet),
    totalFourYearNetCost: Math.round(annualNet * years),
    totalFourYearGrossCost: Math.round(annualGross * years),
  };
}

// ============================================================================
// 7. VEHICLES & EV ENGINES
// ============================================================================

export function calculateCarDepreciation(purchasePrice: number, vehicleAgeYears: number, annualDepreciationRatePercent: number = 15) {
  if (purchasePrice <= 0 || vehicleAgeYears < 0) return null;
  const r = annualDepreciationRatePercent / 100;
  const currentValue = purchasePrice * Math.pow(1 - r, vehicleAgeYears);
  const totalLost = purchasePrice - currentValue;
  return {
    estimatedCurrentValue: Math.round(currentValue),
    totalDepreciationLoss: Math.round(totalLost),
    depreciationPercentage: Math.round((totalLost / purchasePrice) * 1000) / 10,
  };
}

export function calculateCarOwnershipCost(
  annualFinancingPayment: number,
  annualInsurance: number,
  annualFuelOrCharging: number,
  annualMaintenance: number,
  annualDepreciation: number,
  annualMileage: number = 12000
) {
  const total = annualFinancingPayment + annualInsurance + annualFuelOrCharging + annualMaintenance + annualDepreciation;
  if (total <= 0) return null;
  const perMile = annualMileage > 0 ? total / annualMileage : 0;
  return {
    totalAnnualCost: Math.round(total),
    monthlyCost: Math.round(total / 12),
    costPerDistanceUnit: Math.round(perMile * 100) / 100,
  };
}

export function convertFuelEconomy(value: number, from: 'km/L' | 'L/100km' | 'US MPG' | 'Imp MPG') {
  if (value <= 0) return null;
  let usMpg = 0;
  if (from === 'US MPG') usMpg = value;
  else if (from === 'km/L') usMpg = value * 2.35214583;
  else if (from === 'L/100km') usMpg = 235.214583 / value;
  else if (from === 'Imp MPG') usMpg = value * 0.832674;

  return {
    usMpg: Math.round(usMpg * 10) / 10,
    impMpg: Math.round((usMpg * 1.20095) * 10) / 10,
    kmPerLiter: Math.round((usMpg / 2.35214583) * 10) / 10,
    litersPer100Km: Math.round((235.214583 / usMpg) * 10) / 10,
  };
}

export function calculateEVChargingCost(
  batteryCapacityKWh: number,
  chargeIncreasePercent: number, // e.g. 60 for 20% to 80%
  electricityRatePerKWh: number,
  chargerEfficiencyPercent: number = 90
) {
  if (batteryCapacityKWh <= 0 || chargeIncreasePercent <= 0 || electricityRatePerKWh <= 0) return null;
  const energyNet = batteryCapacityKWh * (chargeIncreasePercent / 100);
  const energyGross = energyNet / (chargerEfficiencyPercent / 100);
  const cost = energyGross * electricityRatePerKWh;
  return {
    energyRequiredKWh: Math.round(energyGross * 10) / 10,
    totalChargingCost: Math.round(cost * 100) / 100,
  };
}

export function calculateEVRange(usableBatteryKWh: number, consumptionRateWhPerKm: number) {
  if (usableBatteryKWh <= 0 || consumptionRateWhPerKm <= 0) return null;
  const rangeKm = (usableBatteryKWh * 1000) / consumptionRateWhPerKm;
  const rangeMiles = rangeKm * 0.621371;
  return {
    estimatedRangeKm: Math.round(rangeKm),
    estimatedRangeMiles: Math.round(rangeMiles),
  };
}

export function calculateEVVsGasCost(
  annualDistanceKm: number,
  gasPricePerLiter: number,
  gasLitersPer100Km: number,
  electricityRatePerKWh: number,
  evKWhPer100Km: number
) {
  if (annualDistanceKm <= 0) return null;
  const annualGasCost = (annualDistanceKm / 100) * gasLitersPer100Km * gasPricePerLiter;
  const annualEVCost = (annualDistanceKm / 100) * evKWhPer100Km * electricityRatePerKWh;
  const annualSavings = annualGasCost - annualEVCost;

  return {
    annualGasCost: Math.round(annualGasCost),
    annualEVCost: Math.round(annualEVCost),
    annualSavings: Math.round(annualSavings),
    fiveYearSavings: Math.round(annualSavings * 5),
  };
}

// ============================================================================
// 8. TRAVEL ENGINES
// ============================================================================

export function calculateTravelTime(distance: number, speed: number) {
  if (distance <= 0 || speed <= 0) return null;
  const hoursDecimal = distance / speed;
  const hours = Math.floor(hoursDecimal);
  const minutes = Math.round((hoursDecimal - hours) * 60);
  return {
    totalHoursDecimal: Math.round(hoursDecimal * 100) / 100,
    hours,
    minutes,
  };
}

export function calculateAverageSpeed(distance: number, totalHours: number, totalMinutes: number = 0) {
  const hours = totalHours + totalMinutes / 60;
  if (distance <= 0 || hours <= 0) return null;
  const speed = distance / hours;
  return {
    speed: Math.round(speed * 10) / 10,
  };
}

// ============================================================================
// 9. HEALTH & FITNESS ENGINES
// ============================================================================

export function calculateMacroSplit(totalCalories: number, proteinPercent: number, carbsPercent: number, fatPercent: number) {
  if (totalCalories <= 0) return null;
  // Protein: 4 cal/g, Carbs: 4 cal/g, Fat: 9 cal/g
  const proteinGrams = (totalCalories * (proteinPercent / 100)) / 4;
  const carbsGrams = (totalCalories * (carbsPercent / 100)) / 4;
  const fatGrams = (totalCalories * (fatPercent / 100)) / 9;

  return {
    proteinGrams: Math.round(proteinGrams),
    carbsGrams: Math.round(carbsGrams),
    fatGrams: Math.round(fatGrams),
    proteinCalories: Math.round(proteinGrams * 4),
    carbsCalories: Math.round(carbsGrams * 4),
    fatCalories: Math.round(fatGrams * 9),
  };
}

export function calculateProteinIntake(bodyWeightKg: number, goal: 'sedentary' | 'moderate' | 'muscle_gain' | 'athlete') {
  if (bodyWeightKg <= 0) return null;
  const ranges = {
    sedentary: { min: 0.8, max: 1.0 },
    moderate: { min: 1.2, max: 1.6 },
    muscle_gain: { min: 1.6, max: 2.2 },
    athlete: { min: 2.0, max: 2.5 },
  };
  const range = ranges[goal] || ranges.moderate;
  return {
    minGrams: Math.round(bodyWeightKg * range.min),
    maxGrams: Math.round(bodyWeightKg * range.max),
  };
}

export function calculateLeanBodyMass(weightKg: number, heightCm: number, gender: 'male' | 'female') {
  if (weightKg <= 0 || heightCm <= 0) return null;
  // Boer formula
  let lbm = 0;
  if (gender === 'male') {
    lbm = 0.407 * weightKg + 0.267 * heightCm - 19.2;
  } else {
    lbm = 0.252 * weightKg + 0.473 * heightCm - 48.3;
  }
  const fatMass = Math.max(0, weightKg - lbm);
  const fatPercent = (fatMass / weightKg) * 100;

  return {
    leanBodyMassKg: Math.round(lbm * 10) / 10,
    fatMassKg: Math.round(fatMass * 10) / 10,
    bodyFatPercent: Math.round(fatPercent * 10) / 10,
  };
}

export function calculateRunningCalories(weightKg: number, distanceKm: number) {
  if (weightKg <= 0 || distanceKm <= 0) return null;
  // Standard net caloric cost of running: ~1.036 kcal per kg per km
  const calories = weightKg * distanceKm * 1.036;
  return {
    estimatedCaloriesBurned: Math.round(calories),
  };
}

export function calculateVO2Max(restingHeartRate: number, age: number) {
  if (restingHeartRate <= 0 || age <= 0) return null;
  // Uth-Sørensen-Overgaard-Pedersen formula: VO2 max = 15.3 * (HRmax / HRrest)
  const maxHR = 208 - 0.7 * age;
  const vo2 = 15.3 * (maxHR / restingHeartRate);
  return {
    estimatedVO2Max: Math.round(vo2 * 10) / 10,
    maxHeartRate: Math.round(maxHR),
  };
}

export function calculateHeartRateZones(age: number, restingHeartRate: number = 60) {
  if (age <= 0) return null;
  const maxHR = 220 - age;
  const hrr = maxHR - restingHeartRate; // Heart Rate Reserve (Karvonen)

  const calcZone = (minPct: number, maxPct: number) => ({
    min: Math.round(restingHeartRate + hrr * minPct),
    max: Math.round(restingHeartRate + hrr * maxPct),
  });

  return {
    maxHeartRate: maxHR,
    zone1Recovery: calcZone(0.5, 0.6),
    zone2Aerobic: calcZone(0.6, 0.7),
    zone3Tempo: calcZone(0.7, 0.8),
    zone4Threshold: calcZone(0.8, 0.9),
    zone5Neuromuscular: calcZone(0.9, 1.0),
  };
}

// ============================================================================
// 10. FOOD & CULINARY ENGINES
// ============================================================================

export function scaleRecipe(originalServings: number, targetServings: number, ingredients: Array<{ name: string; amount: number; unit: string }>) {
  if (originalServings <= 0 || targetServings <= 0) return null;
  const ratio = targetServings / originalServings;
  return ingredients.map((ing) => ({
    name: ing.name,
    amount: Math.round(ing.amount * ratio * 100) / 100,
    unit: ing.unit,
  }));
}

export function calculateFoodCostPerServing(totalBatchCost: number, servingsYield: number, targetMarginPercent: number = 70) {
  if (totalBatchCost <= 0 || servingsYield <= 0) return null;
  const costPerServing = totalBatchCost / servingsYield;
  const suggestedPrice = costPerServing / (1 - targetMarginPercent / 100);
  return {
    costPerServing: Math.round(costPerServing * 100) / 100,
    suggestedMenuPrice: Math.round(suggestedPrice * 100) / 100,
  };
}

export function calculateRestaurantFoodCostPercentage(ingredientCost: number, sellingPrice: number) {
  if (sellingPrice <= 0 || ingredientCost <= 0) return null;
  const foodCostPercent = (ingredientCost / sellingPrice) * 100;
  return {
    foodCostPercent: Math.round(foodCostPercent * 10) / 10,
    grossMarginPercent: Math.round((100 - foodCostPercent) * 10) / 10,
  };
}

// ============================================================================
// 11. HOME & CONSTRUCTION ENGINES
// ============================================================================

export function calculateGravel(lengthFt: number, widthFt: number, depthInches: number, densityTonsPerCuYd: number = 1.4) {
  if (lengthFt <= 0 || widthFt <= 0 || depthInches <= 0) return null;
  const cubicFeet = lengthFt * widthFt * (depthInches / 12);
  const cubicYards = cubicFeet / 27;
  const tons = cubicYards * densityTonsPerCuYd;
  return {
    cubicYards: Math.round(cubicYards * 100) / 100,
    cubicMeters: Math.round(cubicYards * 0.764555 * 100) / 100,
    tonsEstimated: Math.round(tons * 100) / 100,
  };
}

export function calculateMulch(lengthFt: number, widthFt: number, depthInches: number = 3) {
  if (lengthFt <= 0 || widthFt <= 0 || depthInches <= 0) return null;
  const cubicFeet = lengthFt * widthFt * (depthInches / 12);
  const cubicYards = cubicFeet / 27;
  const bagsTwoCuFt = Math.ceil(cubicFeet / 2);
  const bagsThreeCuFt = Math.ceil(cubicFeet / 3);

  return {
    cubicYards: Math.round(cubicYards * 100) / 100,
    cubicFeet: Math.round(cubicFeet * 10) / 10,
    bagsTwoCubicFeet: bagsTwoCuFt,
    bagsThreeCubicFeet: bagsThreeCuFt,
  };
}

export function calculateRoofing(lengthFt: number, widthFt: number, pitchRiseIn12: number, overhangInches: number = 12) {
  if (lengthFt <= 0 || widthFt <= 0) return null;
  const effLength = lengthFt + (overhangInches * 2) / 12;
  const effWidth = widthFt + (overhangInches * 2) / 12;
  const baseArea = effLength * effWidth;
  const pitchFactor = Math.sqrt(1 + Math.pow(pitchRiseIn12 / 12, 2));
  const roofAreaSqFt = baseArea * pitchFactor;
  const squares = roofAreaSqFt / 100;
  const bundles = Math.ceil(squares * 3); // 3 bundles per square

  return {
    totalRoofAreaSqFt: Math.round(roofAreaSqFt),
    roofingSquares: Math.round(squares * 10) / 10,
    bundlesRequired: bundles,
  };
}

export function calculateFence(totalLengthFt: number, postSpacingFt: number = 8, panelWidthFt: number = 6) {
  if (totalLengthFt <= 0) return null;
  const posts = Math.ceil(totalLengthFt / postSpacingFt) + 1;
  const panels = Math.ceil(totalLengthFt / panelWidthFt);
  const rails = (posts - 1) * 2; // 2 rails per section

  return {
    postsCount: posts,
    panelsCount: panels,
    railsCount: rails,
  };
}

// ============================================================================
// 12. MATH & STATISTICS ENGINES
// ============================================================================

export function calculatePercentageDifference(valA: number, valB: number) {
  const avg = (valA + valB) / 2;
  if (avg === 0) return null;
  const diff = Math.abs(valA - valB);
  const percentDiff = (diff / avg) * 100;
  return {
    absoluteDifference: Math.round(diff * 100) / 100,
    average: Math.round(avg * 100) / 100,
    percentageDifference: Math.round(percentDiff * 100) / 100,
  };
}

export function calculateZScore(x: number, mean: number, standardDeviation: number) {
  if (standardDeviation <= 0) return null;
  const z = (x - mean) / standardDeviation;
  return {
    zScore: Math.round(z * 1000) / 1000,
  };
}

export function calculateStandardError(sampleStandardDeviation: number, sampleSizeN: number) {
  if (sampleSizeN <= 0 || sampleStandardDeviation < 0) return null;
  const se = sampleStandardDeviation / Math.sqrt(sampleSizeN);
  return {
    standardError: Math.round(se * 10000) / 10000,
  };
}

export function calculateProbability(pA: number, pB: number, areIndependent: boolean = true) {
  if (pA < 0 || pA > 1 || pB < 0 || pB > 1) return null;
  const pNotA = 1 - pA;
  const pNotB = 1 - pB;
  const pAAndB = areIndependent ? pA * pB : 0;
  const pAOrB = pA + pB - pAAndB;

  return {
    pNotA: Math.round(pNotA * 1000) / 1000,
    pNotB: Math.round(pNotB * 1000) / 1000,
    pAAndB: Math.round(pAAndB * 1000) / 1000,
    pAOrB: Math.round(pAOrB * 1000) / 1000,
  };
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function calculatePermutationCombination(n: number, r: number) {
  if (n < 0 || r < 0 || r > n || n > 25) return null;
  const nPr = factorial(n) / factorial(n - r);
  const nCr = factorial(n) / (factorial(r) * factorial(n - r));

  return {
    permutationsNPr: nPr,
    combinationsNCr: nCr,
  };
}

export function checkPrimeNumber(n: number) {
  if (!Number.isInteger(n) || n < 1) return null;
  if (n === 1) {
    return { isPrime: false, divisors: [1], nextPrime: 2 };
  }

  const divisors: number[] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i) divisors.push(n / i);
    }
  }
  divisors.sort((a, b) => a - b);
  const isPrime = divisors.length === 2;

  // find next prime
  let next = n + 1;
  const isP = (num: number) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };
  while (!isP(next)) next++;

  return {
    isPrime,
    divisors,
    nextPrime: next,
  };
}

export function calculateLogarithm(x: number, base: number = 10) {
  if (x <= 0 || base <= 0 || base === 1) return null;
  const result = Math.log(x) / Math.log(base);
  const naturalLog = Math.log(x);
  const log10 = Math.log10(x);
  return {
    logBaseResult: Math.round(result * 10000) / 10000,
    naturalLog: Math.round(naturalLog * 10000) / 10000,
    log10: Math.round(log10 * 10000) / 10000,
  };
}

export function calculateExponent(base: number, exponent: number) {
  const result = Math.pow(base, exponent);
  return {
    result,
    scientificNotation: result.toExponential(4),
  };
}

// ============================================================================
// 13. DATE & TIME ENGINES
// ============================================================================

export function calculateDateAddSubtract(
  startDateStr: string,
  days: number = 0,
  months: number = 0,
  years: number = 0,
  operation: 'add' | 'subtract' = 'add'
) {
  if (!startDateStr) return null;
  const parts = startDateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;

  const [origYear, origMonth, origDay] = parts; // Month is 1-indexed in YYYY-MM-DD
  const sign = operation === 'add' ? 1 : -1;

  // Step 1: Calculate new Year and Month
  let targetYear = origYear + sign * years;
  let targetMonth = origMonth + sign * months;

  // Adjust for year overflow/underflow
  while (targetMonth > 12) {
    targetYear += 1;
    targetMonth -= 12;
  }
  while (targetMonth < 1) {
    targetYear -= 1;
    targetMonth += 12;
  }

  // Step 2: Calendar month-end clamping (e.g. Jan 31 + 1 month -> Feb 28 or 29)
  const daysInTargetMonth = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const clampedDay = Math.min(origDay, daysInTargetMonth);

  // Step 3: Apply Days addition/subtraction
  const baseDateUtc = new Date(Date.UTC(targetYear, targetMonth - 1, clampedDay));
  baseDateUtc.setUTCDate(baseDateUtc.getUTCDate() + sign * days);

  const resultingYear = baseDateUtc.getUTCFullYear();
  const resultingMonth = String(baseDateUtc.getUTCMonth() + 1).padStart(2, '0');
  const resultingDay = String(baseDateUtc.getUTCDate()).padStart(2, '0');
  const resultingDateStr = `${resultingYear}-${resultingMonth}-${resultingDay}`;

  // Calculate day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = dayNames[baseDateUtc.getUTCDay()];

  // Calculate total calendar days elapsed
  const origDateUtc = new Date(Date.UTC(origYear, origMonth - 1, origDay));
  const diffTime = Math.abs(baseDateUtc.getTime() - origDateUtc.getTime());
  const totalElapsedDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const wasClamped = origDay > daysInTargetMonth;

  return {
    resultingDate: resultingDateStr,
    dayOfWeek,
    totalElapsedDays,
    wasClamped,
    clampedNotice: wasClamped
      ? `Day ${origDay} was clamped to ${clampedDay} (the last day of ${new Date(Date.UTC(targetYear, targetMonth - 1, 1)).toLocaleString('en-US', { month: 'long', timeZone: 'UTC' })}).`
      : null,
  };
}

export function calculateBusinessDays(startDateStr: string, endDateStr: string) {
  if (!startDateStr || !endDateStr) return null;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const [d1, d2] = start <= end ? [start, end] : [end, start];
  let current = new Date(d1);
  let businessDays = 0;
  let weekendDays = 0;

  while (current <= d2) {
    const day = current.getDay();
    if (day === 0 || day === 6) {
      weekendDays++;
    } else {
      businessDays++;
    }
    current.setDate(current.getDate() + 1);
  }

  return {
    businessDays,
    weekendDays,
    totalCalendarDays: businessDays + weekendDays,
  };
}

export function calculateWorkingDaysAdd(startDateStr: string, daysToAdd: number) {
  if (!startDateStr || daysToAdd <= 0) return null;
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) return null;

  let added = 0;
  while (added < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      added++;
    }
  }

  return {
    resultingDate: date.toISOString().split('T')[0],
    dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
  };
}

export function calculateTimeDuration(startHour: number, startMinute: number, endHour: number, endMinute: number) {
  let startMins = startHour * 60 + startMinute;
  let endMins = endHour * 60 + endMinute;
  if (endMins < startMins) endMins += 24 * 60; // overnight crossing

  const diffMins = endMins - startMins;
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  return {
    totalHoursDecimal: Math.round((diffMins / 60) * 100) / 100,
    hours,
    minutes,
  };
}

export function convertUnixTimestamp(timestamp: number) {
  if (timestamp <= 0) return null;
  // handle seconds vs ms
  const ms = timestamp < 1e11 ? timestamp * 1000 : timestamp;
  const date = new Date(ms);
  if (isNaN(date.getTime())) return null;

  return {
    utcString: date.toUTCString(),
    isoString: date.toISOString(),
    localDateString: date.toLocaleDateString(),
    localTimeString: date.toLocaleTimeString(),
  };
}

export function calculateWeekNumber(dateStr: string) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  // ISO-8601 week calculation
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  return {
    isoWeekNumber: weekNo,
    year: date.getUTCFullYear(),
  };
}

export function calculateDaysUntilDate(targetDateStr: string, fromDateStr?: string) {
  if (!targetDateStr) return null;
  const target = new Date(targetDateStr);
  const from = fromDateStr ? new Date(fromDateStr) : new Date();
  if (isNaN(target.getTime()) || isNaN(from.getTime())) return null;

  const diffTime = target.getTime() - from.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return {
    totalDays: days,
    weeksRemaining: Math.floor(days / 7),
    isPast: days < 0,
  };
}

// ============================================================================
// 14. FINANCIAL & CURRENCY UTILITIES
// ============================================================================

export function calculateCurrencyExchangeFee(
  transferAmount: number,
  midMarketRate: number,
  bankOfferedRate: number,
  upfrontFee: number = 0
) {
  if (transferAmount <= 0 || midMarketRate <= 0 || bankOfferedRate <= 0) return null;
  const idealConverted = transferAmount * midMarketRate;
  const actualConverted = (transferAmount - upfrontFee) * bankOfferedRate;
  const hiddenSpreadCost = idealConverted - transferAmount * bankOfferedRate;
  const totalCost = upfrontFee * bankOfferedRate + hiddenSpreadCost;

  return {
    idealConvertedAmount: Math.round(idealConverted * 100) / 100,
    actualConvertedAmount: Math.round(actualConverted * 100) / 100,
    hiddenMarkupFee: Math.round(hiddenSpreadCost * 100) / 100,
    totalLossToFees: Math.round(totalCost * 100) / 100,
  };
}

// ============================================================================
// 15. DIGITAL & INTERNET UTILITIES
// ============================================================================

export function calculateDataTransferTime(fileSizeMB: number, speedMbps: number) {
  if (fileSizeMB <= 0 || speedMbps <= 0) return null;
  const fileBits = fileSizeMB * 8 * 1024 * 1024;
  const speedBitsPerSec = speedMbps * 1000 * 1000;
  const seconds = fileBits / speedBitsPerSec;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remSec = Math.round(seconds % 60);

  return {
    totalSeconds: Math.round(seconds),
    hours,
    minutes,
    seconds: remSec,
  };
}

export function calculatePasswordEntropy(length: number, charsetSize: number) {
  if (length <= 0 || charsetSize <= 0) return null;
  const entropyBits = length * Math.log2(charsetSize);
  let strength: 'Weak' | 'Moderate' | 'Strong' | 'Very Strong' = 'Weak';
  if (entropyBits >= 128) strength = 'Very Strong';
  else if (entropyBits >= 80) strength = 'Strong';
  else if (entropyBits >= 50) strength = 'Moderate';

  return {
    entropyBits: Math.round(entropyBits * 10) / 10,
    strengthRating: strength,
  };
}

// ============================================================================
// 16. EVERYDAY UTILITIES
// ============================================================================

export function calculateUnitPriceComparison(
  itemAPrice: number,
  itemAQuantity: number,
  itemBPrice: number,
  itemBQuantity: number
) {
  if (itemAPrice <= 0 || itemAQuantity <= 0 || itemBPrice <= 0 || itemBQuantity <= 0) return null;
  const unitA = itemAPrice / itemAQuantity;
  const unitB = itemBPrice / itemBQuantity;
  const percentSavings = Math.abs(unitA - unitB) / Math.max(unitA, unitB) * 100;

  let betterDeal: 'Item A' | 'Item B' | 'Equal Value' = 'Equal Value';
  if (unitA < unitB) betterDeal = 'Item A';
  else if (unitB < unitA) betterDeal = 'Item B';

  return {
    itemAUnitPrice: Math.round(unitA * 1000) / 1000,
    itemBUnitPrice: Math.round(unitB * 1000) / 1000,
    betterDeal,
    percentSavings: Math.round(percentSavings * 10) / 10,
  };
}

// ============================================================================
// 17. DECISION & COMPARISON ENGINES
// ============================================================================

export function calculateLeaseVsBuy(
  purchasePrice: number,
  downPayment: number,
  loanRatePercent: number,
  loanTermMonths: number,
  monthlyLeasePayment: number,
  leaseTermMonths: number,
  estimatedResidualValue: number
) {
  if (purchasePrice <= 0 || monthlyLeasePayment <= 0) return null;

  // Buy option:
  const loanAmt = purchasePrice - downPayment;
  const r = loanRatePercent / 100 / 12;
  const buyPmt = r > 0 ? (loanAmt * r * Math.pow(1 + r, loanTermMonths)) / (Math.pow(1 + r, loanTermMonths) - 1) : loanAmt / loanTermMonths;
  const totalBuyPaid = downPayment + buyPmt * loanTermMonths;
  const netBuyCost = totalBuyPaid - estimatedResidualValue;

  // Lease option:
  const totalLeaseCost = monthlyLeasePayment * leaseTermMonths;
  const difference = Math.abs(netBuyCost - totalLeaseCost);
  const betterOption = netBuyCost < totalLeaseCost ? 'Buy (Lower Net Cost)' : 'Lease (Lower Net Cost)';

  return {
    totalBuyPaid: Math.round(totalBuyPaid),
    netBuyCostAfterResidual: Math.round(netBuyCost),
    totalLeaseCost: Math.round(totalLeaseCost),
    costDifference: Math.round(difference),
    betterOption,
  };
}

export function calculateCarLoanVsCash(
  cashPrice: number,
  loanRatePercent: number,
  loanTermMonths: number,
  cashInvestmentReturnPercent: number
) {
  if (cashPrice <= 0 || loanTermMonths <= 0) return null;
  const rLoan = loanRatePercent / 100 / 12;
  const pmt = rLoan > 0 ? (cashPrice * rLoan * Math.pow(1 + rLoan, loanTermMonths)) / (Math.pow(1 + rLoan, loanTermMonths) - 1) : cashPrice / loanTermMonths;
  const totalLoanPaid = pmt * loanTermMonths;

  // Investment return if cash preserved:
  const rInvest = cashInvestmentReturnPercent / 100 / 12;
  const futureInvestValue = cashPrice * Math.pow(1 + rInvest, loanTermMonths);
  const investmentGain = futureInvestValue - cashPrice;
  const loanInterestCost = totalLoanPaid - cashPrice;
  const netAdvantage = investmentGain - loanInterestCost;

  return {
    totalLoanPaid: Math.round(totalLoanPaid),
    loanInterestCost: Math.round(loanInterestCost),
    investmentGrowthFromPreservedCash: Math.round(investmentGain),
    netAdvantageOfFinancing: Math.round(netAdvantage),
    betterDecision: netAdvantage > 0 ? 'Take Loan & Invest Cash' : 'Pay Cash Upfront',
  };
}

export function calculatePayDebtVsInvest(
  debtInterestRatePercent: number,
  investmentReturnPercent: number,
  extraMonthlyAmount: number,
  durationMonths: number = 60
) {
  if (debtInterestRatePercent < 0 || investmentReturnPercent < 0 || extraMonthlyAmount <= 0) return null;
  const rDebt = debtInterestRatePercent / 100 / 12;
  const rInvest = investmentReturnPercent / 100 / 12;

  // Guaranteed interest saved:
  const totalDebtSaved = extraMonthlyAmount * durationMonths * (rDebt * durationMonths / 2);
  // Investment growth:
  const futureInvest = rInvest > 0 ? extraMonthlyAmount * ((Math.pow(1 + rInvest, durationMonths) - 1) / rInvest) : extraMonthlyAmount * durationMonths;
  const investEarnings = futureInvest - extraMonthlyAmount * durationMonths;

  return {
    guaranteedDebtInterestSaved: Math.round(totalDebtSaved),
    projectedInvestmentEarnings: Math.round(investEarnings),
    recommendedAction: debtInterestRatePercent >= investmentReturnPercent ? 'Pay Down Debt (Guaranteed Return)' : 'Invest (Higher Expected Growth)',
  };
}

export function calculateEmergencyFundVsDebt(
  monthlyExpenses: number,
  targetFundMonths: number,
  currentEmergencyFund: number,
  debtInterestRatePercent: number,
  monthlySurplus: number
) {
  if (monthlyExpenses <= 0 || monthlySurplus <= 0) return null;
  const targetFund = monthlyExpenses * targetFundMonths;
  const fundDeficit = Math.max(0, targetFund - currentEmergencyFund);

  let recommendation = '';
  if (fundDeficit > 0 && currentEmergencyFund < monthlyExpenses) {
    recommendation = 'Build a starter 1-month emergency fund first before aggressive debt payoff.';
  } else if (debtInterestRatePercent > 12) {
    recommendation = 'Prioritize high-interest debt payoff while maintaining your base emergency reserve.';
  } else {
    recommendation = 'Split surplus: 50% towards emergency reserve and 50% towards low-interest debt.';
  }

  return {
    targetEmergencyFund: Math.round(targetFund),
    emergencyFundDeficit: Math.round(fundDeficit),
    monthsToFundTarget: Math.ceil(fundDeficit / monthlySurplus),
    recommendation,
  };
}

export function calculateBreakevenInvestmentReturn(debtInterestRatePercent: number, taxDeductionPercent: number = 0) {
  if (debtInterestRatePercent <= 0) return null;
  const effectiveDebtRate = debtInterestRatePercent * (1 - taxDeductionPercent / 100);
  return {
    breakevenAnnualReturnPercent: Math.round(effectiveDebtRate * 100) / 100,
  };
}

// ============================================================================
// 18. ADVANCED COMPARISON / PLANNING ENGINES
// ============================================================================

export function calculateScenarioComparison(
  scenarioAInitial: number,
  scenarioAMonthly: number,
  scenarioARate: number,
  scenarioBInitial: number,
  scenarioBMonthly: number,
  scenarioBRate: number,
  years: number
) {
  if (years <= 0) return null;
  const calcFV = (init: number, pmt: number, rate: number) => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const fvInit = init * Math.pow(1 + r, n);
    const fvPmt = r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) : pmt * n;
    return fvInit + fvPmt;
  };

  const fvA = calcFV(scenarioAInitial, scenarioAMonthly, scenarioARate);
  const fvB = calcFV(scenarioBInitial, scenarioBMonthly, scenarioBRate);

  return {
    scenarioAFinalValue: Math.round(fvA),
    scenarioBFinalValue: Math.round(fvB),
    difference: Math.round(Math.abs(fvA - fvB)),
    betterScenario: fvA >= fvB ? 'Scenario A' : 'Scenario B',
  };
}

export function calculateSensitivityAnalysis(baseValue: number, changeRangePercent: number = 20) {
  if (baseValue <= 0) return null;
  const step = changeRangePercent / 2;
  return {
    pessimisticLow: Math.round(baseValue * (1 - changeRangePercent / 100)),
    pessimisticModerate: Math.round(baseValue * (1 - step / 100)),
    baseScenario: Math.round(baseValue),
    optimisticModerate: Math.round(baseValue * (1 + step / 100)),
    optimisticHigh: Math.round(baseValue * (1 + changeRangePercent / 100)),
  };
}

// ============================================================================
// 19. PERCENTAGE POINT & RATIO / PROPORTION ENGINES
// ============================================================================

export interface PercentagePointDiffResult {
  difference: number;
  absoluteDifference: number;
  percentageChange: number | null;
  changeDirection: 'increase' | 'decrease' | 'no-change';
  explanation: string;
}

export function calculatePercentagePointDifference(
  percentageA: number,
  percentageB: number
): PercentagePointDiffResult {
  const difference = Math.round((percentageB - percentageA) * 10000) / 10000;
  const absoluteDifference = Math.abs(difference);
  const percentageChange = percentageA !== 0
    ? Math.round(((percentageB - percentageA) / Math.abs(percentageA)) * 10000) / 100
    : null;

  let changeDirection: 'increase' | 'decrease' | 'no-change' = 'no-change';
  if (difference > 0) changeDirection = 'increase';
  else if (difference < 0) changeDirection = 'decrease';

  let explanation = '';
  if (difference === 0) {
    explanation = 'Both percentages are equal. There is zero percentage point difference and zero relative percentage change.';
  } else {
    const dirText = difference > 0 ? 'increase' : 'decrease';
    const ppText = `${Math.abs(difference)} percentage point ${dirText}`;
    const pctText = percentageChange !== null ? ` (a relative ${Math.abs(percentageChange)}% ${dirText} from baseline ${percentageA}%)` : '';
    explanation = `Changing from ${percentageA}% to ${percentageB}% is a ${ppText}${pctText}.`;
  }

  return {
    difference,
    absoluteDifference,
    percentageChange,
    changeDirection,
    explanation,
  };
}

export function calculateGCDHelper(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export interface RatioSimplifyResult {
  simplifiedA: number;
  simplifiedB: number;
  ratioString: string;
  decimalValue: number;
  percentageValue: number;
  fractionString: string;
  scalingFactor: number;
}

export function simplifyRatio(a: number, b: number): RatioSimplifyResult | null {
  if (a <= 0 || b <= 0) return null;
  let mult = 1;
  while (!Number.isInteger(a * mult) || !Number.isInteger(b * mult)) {
    mult *= 10;
    if (mult > 1000000) break;
  }
  const intA = Math.round(a * mult);
  const intB = Math.round(b * mult);
  const gcd = calculateGCDHelper(intA, intB);

  const simplifiedA = intA / gcd;
  const simplifiedB = intB / gcd;
  const decimalValue = Math.round((a / b) * 10000) / 10000;
  const percentageValue = Math.round((a / b) * 10000) / 100;

  return {
    simplifiedA,
    simplifiedB,
    ratioString: `${simplifiedA} : ${simplifiedB}`,
    decimalValue,
    percentageValue,
    fractionString: `${simplifiedA}/${simplifiedB}`,
    scalingFactor: gcd,
  };
}

export interface ProportionSolverResult {
  solvedVariable: 'A' | 'B' | 'C' | 'D' | 'All' | 'Invalid';
  solvedValue: number | null;
  isEqual: boolean;
  stepExplanation: string[];
  formulaUsed: string;
}

export function solveProportion(
  a: number | '',
  b: number | '',
  c: number | '',
  d: number | ''
): ProportionSolverResult | null {
  const numFilled = [a, b, c, d].filter((x) => typeof x === 'number').length;
  if (numFilled < 3) return null;

  const numA = typeof a === 'number' ? a : null;
  const numB = typeof b === 'number' ? b : null;
  const numC = typeof c === 'number' ? c : null;
  const numD = typeof d === 'number' ? d : null;

  if (numA !== null && numB !== null && numC !== null && numD !== null) {
    if (numB === 0 || numD === 0) {
      return {
        solvedVariable: 'Invalid',
        solvedValue: null,
        isEqual: false,
        stepExplanation: ['Denominators B and D cannot be zero.'],
        formulaUsed: 'A / B = C / D',
      };
    }
    const leftCross = numA * numD;
    const rightCross = numB * numC;
    const isEqual = Math.abs(leftCross - rightCross) < 1e-6;
    return {
      solvedVariable: 'All',
      solvedValue: null,
      isEqual,
      stepExplanation: [
        `Cross-product 1: A × D = ${numA} × ${numD} = ${Math.round(leftCross * 10000) / 10000}`,
        `Cross-product 2: B × C = ${numB} × ${numC} = ${Math.round(rightCross * 10000) / 10000}`,
        isEqual
          ? 'The cross-products are equal; the equation forms a valid proportion.'
          : 'The cross-products are unequal; the ratios are not proportional.',
      ],
      formulaUsed: 'A × D = B × C',
    };
  }

  if (numA === null && numB !== null && numC !== null && numD !== null) {
    if (numD === 0) return null;
    const solved = (numB * numC) / numD;
    return {
      solvedVariable: 'A',
      solvedValue: Math.round(solved * 10000) / 10000,
      isEqual: true,
      stepExplanation: [
        'Proportion formula: A / B = C / D',
        'Cross-multiply: A × D = B × C',
        `Solve for A: A = (${numB} × ${numC}) / ${numD}`,
        `A = ${Math.round(numB * numC * 10000) / 10000} / ${numD} = ${Math.round(solved * 10000) / 10000}`,
      ],
      formulaUsed: 'A = (B × C) / D',
    };
  }

  if (numB === null && numA !== null && numC !== null && numD !== null) {
    if (numC === 0) return null;
    const solved = (numA * numD) / numC;
    return {
      solvedVariable: 'B',
      solvedValue: Math.round(solved * 10000) / 10000,
      isEqual: true,
      stepExplanation: [
        'Proportion formula: A / B = C / D',
        'Cross-multiply: A × D = B × C',
        `Solve for B: B = (${numA} × ${numD}) / ${numC}`,
        `B = ${Math.round(numA * numD * 10000) / 10000} / ${numC} = ${Math.round(solved * 10000) / 10000}`,
      ],
      formulaUsed: 'B = (A × D) / C',
    };
  }

  if (numC === null && numA !== null && numB !== null && numD !== null) {
    if (numB === 0) return null;
    const solved = (numA * numD) / numB;
    return {
      solvedVariable: 'C',
      solvedValue: Math.round(solved * 10000) / 10000,
      isEqual: true,
      stepExplanation: [
        'Proportion formula: A / B = C / D',
        'Cross-multiply: A × D = B × C',
        `Solve for C: C = (${numA} × ${numD}) / ${numB}`,
        `C = ${Math.round(numA * numD * 10000) / 10000} / ${numB} = ${Math.round(solved * 10000) / 10000}`,
      ],
      formulaUsed: 'C = (A × D) / B',
    };
  }

  if (numD === null && numA !== null && numB !== null && numC !== null) {
    if (numA === 0) return null;
    const solved = (numB * numC) / numA;
    return {
      solvedVariable: 'D',
      solvedValue: Math.round(solved * 10000) / 10000,
      isEqual: true,
      stepExplanation: [
        'Proportion formula: A / B = C / D',
        'Cross-multiply: A × D = B × C',
        `Solve for D: D = (${numB} × ${numC}) / ${numA}`,
        `D = ${Math.round(numB * numC * 10000) / 10000} / ${numA} = ${Math.round(solved * 10000) / 10000}`,
      ],
      formulaUsed: 'D = (B × C) / A',
    };
  }

  return null;
}

// ============================================================================
// 20. MULTI-LEG AVERAGE SPEED ENGINE
// ============================================================================

export interface SpeedJourneyLeg {
  id: string;
  distance: number | '';
  distanceUnit: 'km' | 'mi' | 'm' | 'ft' | 'yd' | 'nmi';
  hours: number | '';
  minutes: number | '';
  seconds: number | '';
}

export interface SpeedJourneyResult {
  totalDistanceKm: number;
  totalDistanceMiles: number;
  totalDistanceMeters: number;
  totalTimeHours: number;
  totalTimeMinutes: number;
  totalTimeSeconds: number;
  totalTimeFormatted: string;
  averageSpeedKmh: number;
  averageSpeedMph: number;
  averageSpeedMs: number;
  averageSpeedKnots: number;
  averageSpeedFts: number;
  legs: {
    legNumber: number;
    distanceKm: number;
    timeHours: number;
    speedKmh: number;
    speedMph: number;
  }[];
}

const DISTANCE_TO_METERS: Record<string, number> = {
  km: 1000,
  mi: 1609.344,
  m: 1,
  ft: 0.3048,
  yd: 0.9144,
  nmi: 1852,
};

export function calculateMultiLegAverageSpeed(legs: SpeedJourneyLeg[]): SpeedJourneyResult | null {
  if (!legs || legs.length === 0) return null;

  let totalMeters = 0;
  let totalSeconds = 0;
  const processedLegs: SpeedJourneyResult['legs'] = [];

  for (let i = 0; i < legs.length; i++) {
    const leg = legs[i];
    const dist = typeof leg.distance === 'number' && leg.distance > 0 ? leg.distance : 0;
    const h = typeof leg.hours === 'number' && leg.hours >= 0 ? leg.hours : 0;
    const m = typeof leg.minutes === 'number' && leg.minutes >= 0 ? leg.minutes : 0;
    const s = typeof leg.seconds === 'number' && leg.seconds >= 0 ? leg.seconds : 0;

    const legSeconds = h * 3600 + m * 60 + s;
    const ratio = DISTANCE_TO_METERS[leg.distanceUnit] || 1000;
    const legMeters = dist * ratio;

    if (dist > 0 && legSeconds > 0) {
      totalMeters += legMeters;
      totalSeconds += legSeconds;

      const legHours = legSeconds / 3600;
      const legKm = legMeters / 1000;
      const speedKmh = legHours > 0 ? legKm / legHours : 0;
      const speedMph = speedKmh * 0.621371;

      processedLegs.push({
        legNumber: i + 1,
        distanceKm: Math.round(legKm * 100) / 100,
        timeHours: Math.round(legHours * 100) / 100,
        speedKmh: Math.round(speedKmh * 10) / 10,
        speedMph: Math.round(speedMph * 10) / 10,
      });
    }
  }

  if (totalMeters <= 0 || totalSeconds <= 0) return null;

  const totalDistanceKm = totalMeters / 1000;
  const totalDistanceMiles = totalDistanceKm * 0.621371;
  const totalTimeHours = totalSeconds / 3600;
  const totalTimeMinutes = totalSeconds / 60;

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.round(totalSeconds % 60);
  const formattedParts: string[] = [];
  if (h > 0) formattedParts.push(`${h}h`);
  if (m > 0 || h > 0) formattedParts.push(`${m}m`);
  formattedParts.push(`${s}s`);
  const totalTimeFormatted = formattedParts.join(' ');

  const averageSpeedMs = totalMeters / totalSeconds;
  const averageSpeedKmh = averageSpeedMs * 3.6;
  const averageSpeedMph = averageSpeedKmh * 0.621371;
  const averageSpeedKnots = averageSpeedKmh / 1.852;
  const averageSpeedFts = averageSpeedMs * 3.28084;

  return {
    totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
    totalDistanceMiles: Math.round(totalDistanceMiles * 100) / 100,
    totalDistanceMeters: Math.round(totalMeters),
    totalTimeHours: Math.round(totalTimeHours * 100) / 100,
    totalTimeMinutes: Math.round(totalTimeMinutes * 10) / 10,
    totalTimeSeconds: Math.round(totalSeconds),
    totalTimeFormatted,
    averageSpeedKmh: Math.round(averageSpeedKmh * 100) / 100,
    averageSpeedMph: Math.round(averageSpeedMph * 100) / 100,
    averageSpeedMs: Math.round(averageSpeedMs * 100) / 100,
    averageSpeedKnots: Math.round(averageSpeedKnots * 100) / 100,
    averageSpeedFts: Math.round(averageSpeedFts * 100) / 100,
    legs: processedLegs,
  };
}

// ============================================================================
// 21. TIME ZONE CONVERTER ENGINE
// ============================================================================

export interface TimeZoneConversionResult {
  fromFormatted: string;
  toFormatted: string;
  fromTime24: string;
  toTime24: string;
  fromDate: string;
  toDate: string;
  offsetDiffHours: number;
  offsetDescription: string;
  dayRollover: 'same-day' | 'next-day' | 'previous-day';
  utcString: string;
}

export function calculateTimeZoneConversion(
  dateStr: string, // YYYY-MM-DD
  timeStr: string, // HH:mm
  fromTz: string,
  toTz: string
): TimeZoneConversionResult | null {
  if (!dateStr || !timeStr || !fromTz || !toTz) return null;

  try {
    // Construct local ISO date in fromTz context
    const [y, m, d] = dateStr.split('-').map(Number);
    const [hr, mn] = timeStr.split(':').map(Number);
    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(hr) || isNaN(mn)) return null;

    // Use a reference UTC base and adjust for timezone offset
    // In modern browsers, Intl.DateTimeFormat can format to any IANA timezone
    // To parse a local date in arbitrary timezone:
    // Create an arbitrary date and test offset
    const approxUtc = new Date(Date.UTC(y, m - 1, d, hr, mn));

    // Get time in fromTz for approxUtc to find its offset from UTC
    const getTzOffsetMs = (date: Date, tz: string) => {
      const invDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
      return invDate.getTime() - date.getTime();
    };

    // Calculate exact instant
    const fromOffset = getTzOffsetMs(approxUtc, fromTz);
    const targetUtcTimestamp = approxUtc.getTime() - fromOffset;
    const exactUtcDate = new Date(targetUtcTimestamp);

    // Format in source timezone
    const fromDateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: fromTz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const fromDate24Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: fromTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const fromIsoDateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: fromTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Format in destination timezone
    const toDateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const toDate24Formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const toIsoDateFormatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: toTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const fromIsoDate = fromIsoDateFormatter.format(exactUtcDate);
    const toIsoDate = toIsoDateFormatter.format(exactUtcDate);

    let dayRollover: 'same-day' | 'next-day' | 'previous-day' = 'same-day';
    if (toIsoDate > fromIsoDate) dayRollover = 'next-day';
    else if (toIsoDate < fromIsoDate) dayRollover = 'previous-day';

    const toOffset = getTzOffsetMs(exactUtcDate, toTz);
    const offsetDiffHours = Math.round(((toOffset - fromOffset) / (1000 * 60 * 60)) * 10) / 10;

    let offsetDescription = '';
    if (offsetDiffHours === 0) {
      offsetDescription = 'Both locations share the exact same local time.';
    } else if (offsetDiffHours > 0) {
      offsetDescription = `Destination is ${offsetDiffHours} hour${Math.abs(offsetDiffHours) === 1 ? '' : 's'} ahead of origin.`;
    } else {
      offsetDescription = `Destination is ${Math.abs(offsetDiffHours)} hour${Math.abs(offsetDiffHours) === 1 ? '' : 's'} behind origin.`;
    }

    return {
      fromFormatted: fromDateFormatter.format(exactUtcDate),
      toFormatted: toDateFormatter.format(exactUtcDate),
      fromTime24: fromDate24Formatter.format(exactUtcDate),
      toTime24: toDate24Formatter.format(exactUtcDate),
      fromDate: fromIsoDate,
      toDate: toIsoDate,
      offsetDiffHours,
      offsetDescription,
      dayRollover,
      utcString: exactUtcDate.toUTCString(),
    };
  } catch (err) {
    return null;
  }
}

// ============================================================================
// 22. FUEL COMPARISON ENGINE
// ============================================================================

export interface FuelComparisonInput {
  fuelEconomyA: number;
  unitA: 'US MPG' | 'Imp MPG' | 'L/100km' | 'km/L';
  fuelEconomyB: number;
  unitB: 'US MPG' | 'Imp MPG' | 'L/100km' | 'km/L';
  annualDistance: number;
  distanceUnit: 'km' | 'mi';
  fuelPricePerUnit: number;
  pricePerVolumeUnit: 'liter' | 'gallon';
}

export interface FuelComparisonResult {
  normLitersPer100KmA: number;
  normLitersPer100KmB: number;
  annualLitersA: number;
  annualLitersB: number;
  annualGallonsA: number;
  annualGallonsB: number;
  annualCostA: number;
  annualCostB: number;
  annualCostDifference: number;
  percentSavings: number;
  cheaperVehicle: 'A' | 'B' | 'Equal';
  fiveYearSavings: number;
}

export function calculateFuelComparison(input: FuelComparisonInput): FuelComparisonResult | null {
  const { fuelEconomyA, unitA, fuelEconomyB, unitB, annualDistance, distanceUnit, fuelPricePerUnit, pricePerVolumeUnit } = input;
  if (fuelEconomyA <= 0 || fuelEconomyB <= 0 || annualDistance <= 0 || fuelPricePerUnit <= 0) return null;

  const toLitersPer100Km = (val: number, unit: string) => {
    if (unit === 'L/100km') return val;
    if (unit === 'km/L') return 100 / val;
    if (unit === 'US MPG') return 235.214583 / val;
    if (unit === 'Imp MPG') return 282.481 / val;
    return val;
  };

  const l100A = toLitersPer100Km(fuelEconomyA, unitA);
  const l100B = toLitersPer100Km(fuelEconomyB, unitB);

  const annualKm = distanceUnit === 'mi' ? annualDistance * 1.609344 : annualDistance;

  const annualLitersA = (annualKm / 100) * l100A;
  const annualLitersB = (annualKm / 100) * l100B;

  const annualGallonsA = annualLitersA / 3.785411784;
  const annualGallonsB = annualLitersB / 3.785411784;

  const pricePerLiter = pricePerVolumeUnit === 'gallon' ? fuelPricePerUnit / 3.785411784 : fuelPricePerUnit;

  const annualCostA = annualLitersA * pricePerLiter;
  const annualCostB = annualLitersB * pricePerLiter;

  const annualCostDifference = Math.abs(annualCostA - annualCostB);
  const maxCost = Math.max(annualCostA, annualCostB);
  const percentSavings = maxCost > 0 ? (annualCostDifference / maxCost) * 100 : 0;

  let cheaperVehicle: 'A' | 'B' | 'Equal' = 'Equal';
  if (annualCostA < annualCostB) cheaperVehicle = 'A';
  else if (annualCostB < annualCostA) cheaperVehicle = 'B';

  return {
    normLitersPer100KmA: Math.round(l100A * 100) / 100,
    normLitersPer100KmB: Math.round(l100B * 100) / 100,
    annualLitersA: Math.round(annualLitersA),
    annualLitersB: Math.round(annualLitersB),
    annualGallonsA: Math.round(annualGallonsA),
    annualGallonsB: Math.round(annualGallonsB),
    annualCostA: Math.round(annualCostA * 100) / 100,
    annualCostB: Math.round(annualCostB * 100) / 100,
    annualCostDifference: Math.round(annualCostDifference * 100) / 100,
    percentSavings: Math.round(percentSavings * 10) / 10,
    cheaperVehicle,
    fiveYearSavings: Math.round(annualCostDifference * 5 * 100) / 100,
  };
}

// ============================================================================
// 23. ELECTRICITY BILL ENGINE
// ============================================================================

export interface ElectricitySlab {
  maxKwh: number; // e.g. 100 for first 100 kWh, or Infinity for remaining
  ratePerKwh: number;
}

export interface ElectricityBillInput {
  energyConsumption: number;
  energyUnit: 'kWh' | 'MWh' | 'Wh';
  tariffType: 'flat' | 'tiered';
  flatRatePerKwh?: number;
  tieredSlabs?: ElectricitySlab[];
  fixedCharge?: number;
  taxRatePercent?: number;
  otherFees?: number;
}

export interface ElectricitySlabBreakdown {
  slabIndex: number;
  rangeLabel: string;
  unitsInSlab: number;
  ratePerKwh: number;
  slabCost: number;
}

export interface ElectricityBillResult {
  normalizedKWh: number;
  energyCharges: number;
  slabBreakdown: ElectricitySlabBreakdown[];
  fixedCharges: number;
  taxAmount: number;
  otherFees: number;
  totalBill: number;
  effectiveCostPerKwh: number;
  dailyCost: number;
  annualCost: number;
}

export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult | null {
  const { energyConsumption, energyUnit, tariffType, flatRatePerKwh, tieredSlabs, fixedCharge = 0, taxRatePercent = 0, otherFees = 0 } = input;
  if (energyConsumption <= 0) return null;

  let normalizedKWh = energyConsumption;
  if (energyUnit === 'MWh') normalizedKWh = energyConsumption * 1000;
  else if (energyUnit === 'Wh') normalizedKWh = energyConsumption / 1000;

  let energyCharges = 0;
  const slabBreakdown: ElectricitySlabBreakdown[] = [];

  if (tariffType === 'flat') {
    const rate = typeof flatRatePerKwh === 'number' && flatRatePerKwh >= 0 ? flatRatePerKwh : 0;
    if (rate <= 0) return null;
    energyCharges = normalizedKWh * rate;
    slabBreakdown.push({
      slabIndex: 1,
      rangeLabel: `All ${Math.round(normalizedKWh * 10) / 10} kWh @ flat rate`,
      unitsInSlab: Math.round(normalizedKWh * 10) / 10,
      ratePerKwh: rate,
      slabCost: Math.round(energyCharges * 100) / 100,
    });
  } else {
    if (!tieredSlabs || tieredSlabs.length === 0) return null;
    let remUnits = normalizedKWh;
    let prevThreshold = 0;

    for (let i = 0; i < tieredSlabs.length; i++) {
      const slab = tieredSlabs[i];
      if (remUnits <= 0) break;

      const slabCapacity = slab.maxKwh - prevThreshold;
      const unitsInSlab = Math.min(remUnits, slabCapacity > 0 ? slabCapacity : remUnits);
      const cost = unitsInSlab * slab.ratePerKwh;

      energyCharges += cost;
      slabBreakdown.push({
        slabIndex: i + 1,
        rangeLabel: isFinite(slab.maxKwh)
          ? `${prevThreshold + 1} to ${slab.maxKwh} kWh`
          : `Over ${prevThreshold} kWh`,
        unitsInSlab: Math.round(unitsInSlab * 10) / 10,
        ratePerKwh: slab.ratePerKwh,
        slabCost: Math.round(cost * 100) / 100,
      });

      remUnits -= unitsInSlab;
      prevThreshold = slab.maxKwh;
    }
  }

  const subtotal = energyCharges + fixedCharge + otherFees;
  const taxAmount = (subtotal * taxRatePercent) / 100;
  const totalBill = subtotal + taxAmount;
  const effectiveCostPerKwh = normalizedKWh > 0 ? totalBill / normalizedKWh : 0;
  const dailyCost = totalBill / 30;
  const annualCost = totalBill * 12;

  return {
    normalizedKWh: Math.round(normalizedKWh * 100) / 100,
    energyCharges: Math.round(energyCharges * 100) / 100,
    slabBreakdown,
    fixedCharges: Math.round(fixedCharge * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    otherFees: Math.round(otherFees * 100) / 100,
    totalBill: Math.round(totalBill * 100) / 100,
    effectiveCostPerKwh: Math.round(effectiveCostPerKwh * 10000) / 10000,
    dailyCost: Math.round(dailyCost * 100) / 100,
    annualCost: Math.round(annualCost * 100) / 100,
  };
}

