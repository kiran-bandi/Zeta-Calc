/**
 * Zeta Calculator - Investment & Wealth Expansion (Batch 3 Engines)
 * 
 * Includes high-precision deterministic formulas for:
 * 1. Portfolio Allocation Calculator
 * 2. Asset Allocation Calculator (Current vs Target with adjustments)
 * 3. SIP vs Lumpsum Calculator (Equivalent growth scenarios)
 * 4. Multi-Goal Investment Planner (Simultaneous goals with inflation adjusting)
 * 5. Retirement Income Calculator (Period-by-period retirement simulation)
 * 6. Annuity Calculator (Ordinary vs Due, 0% rate guard, compounding frequencies)
 */

// 1. PORTFOLIO ALLOCATION CALCULATOR
export interface PortfolioAssetInput {
  name: string;
  value: number;
}

export interface PortfolioAssetResult {
  name: string;
  value: number;
  percentage: number;
}

export interface PortfolioAllocationResult {
  totalValue: number;
  allocations: PortfolioAssetResult[];
}

export function calculatePortfolioAllocation(assets: PortfolioAssetInput[]): PortfolioAllocationResult {
  const filtered = assets.filter(a => a.value > 0);
  const totalValue = filtered.reduce((sum, a) => sum + a.value, 0);

  if (totalValue <= 0) {
    return {
      totalValue: 0,
      allocations: assets.map(a => ({ name: a.name, value: a.value, percentage: 0 })),
    };
  }

  const allocations = assets.map(a => {
    const val = a.value > 0 ? a.value : 0;
    return {
      name: a.name,
      value: val,
      percentage: Number(((val / totalValue) * 100).toFixed(2)),
    };
  });

  return {
    totalValue,
    allocations,
  };
}

// 2. ASSET ALLOCATION CALCULATOR
export interface AssetAllocationItemInput {
  category: string; // Equity, Debt, Cash, Gold, Real Estate, Other
  currentValue: number;
  targetPercent: number; // e.g. 50 for 50%
}

export interface AssetAllocationItemResult {
  category: string;
  currentValue: number;
  currentPercent: number;
  targetPercent: number;
  targetValue: number;
  differencePercent: number;
  requiredAdjustment: number; // Target Value - Current Value
  action: 'Buy' | 'Sell' | 'No Action';
}

export interface AssetAllocationResult {
  totalCurrentValue: number;
  totalTargetPercent: number;
  items: AssetAllocationItemResult[];
  isTargetBalanced: boolean; // True if target percentages sum to exactly 100
}

export function calculateAssetAllocation(items: AssetAllocationItemInput[]): AssetAllocationResult {
  const totalCurrentValue = items.reduce((sum, item) => sum + (item.currentValue > 0 ? item.currentValue : 0), 0);
  const totalTargetPercent = items.reduce((sum, item) => sum + (item.targetPercent > 0 ? item.targetPercent : 0), 0);
  const isTargetBalanced = Math.abs(totalTargetPercent - 100) < 0.01;

  // Even if target % doesn't sum to 100, we compute based on entered targets, but we flag it
  const processedItems = items.map(item => {
    const curVal = item.currentValue > 0 ? item.currentValue : 0;
    const curPercent = totalCurrentValue > 0 ? (curVal / totalCurrentValue) * 100 : 0;
    const tgtPct = item.targetPercent > 0 ? item.targetPercent : 0;
    const targetVal = isTargetBalanced
      ? (tgtPct / 100) * totalCurrentValue
      : totalTargetPercent > 0
        ? (tgtPct / totalTargetPercent) * totalCurrentValue
        : 0;

    const requiredAdjustment = targetVal - curVal;
    const diffPercent = curPercent - tgtPct;

    let action: 'Buy' | 'Sell' | 'No Action' = 'No Action';
    if (Math.abs(requiredAdjustment) > 1) {
      action = requiredAdjustment > 0 ? 'Buy' : 'Sell';
    }

    return {
      category: item.category,
      currentValue: curVal,
      currentPercent: Number(curPercent.toFixed(2)),
      targetPercent: tgtPct,
      targetValue: Number(targetVal.toFixed(2)),
      differencePercent: Number(diffPercent.toFixed(2)),
      requiredAdjustment: Number(requiredAdjustment.toFixed(2)),
      action,
    };
  });

  return {
    totalCurrentValue,
    totalTargetPercent,
    items: processedItems,
    isTargetBalanced,
  };
}

// 3. SIP VS LUMPSUM CALCULATOR
export interface SIPVsLumpsumInput {
  expectedReturnPercent: number;
  years: number;
  months: number;
  sipAmount: number;
  lumpSumAmount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
}

export interface SIPVsLumpsumResult {
  sipTotalInvested: number;
  sipFutureValue: number;
  sipGains: number;
  lumpSumTotalInvested: number;
  lumpSumFutureValue: number;
  lumpSumGains: number;
  futureValueDifference: number; // Lumpsum FV - SIP FV
  preferredOption: 'SIP' | 'Lumpsum' | 'Equal';
  sipWealthRatio: number; // FV / Invested
  lumpSumWealthRatio: number; // FV / Invested
}

export function calculateSIPVsLumpsum(input: SIPVsLumpsumInput): SIPVsLumpsumResult {
  const r = input.expectedReturnPercent > 0 ? input.expectedReturnPercent / 100 : 0;
  const totalMonths = (input.years > 0 ? input.years : 0) * 12 + (input.months > 0 ? input.months : 0);

  // 1. Calculate Lumpsum growth
  // Standard monthly compounding: FV = PV * (1 + r/12)^n
  const mr = r / 12;
  const lumpSumAmount = input.lumpSumAmount > 0 ? input.lumpSumAmount : 0;
  const lumpSumFutureValue = totalMonths > 0
    ? lumpSumAmount * Math.pow(1 + mr, totalMonths)
    : lumpSumAmount;
  const lumpSumGains = Math.max(0, lumpSumFutureValue - lumpSumAmount);

  // 2. Calculate SIP growth
  // Monthly frequency maps directly to totalMonths
  let sipTotalInvested = 0;
  let sipFutureValue = 0;
  const sipAmount = input.sipAmount > 0 ? input.sipAmount : 0;

  if (totalMonths > 0) {
    if (mr === 0) {
      sipFutureValue = sipAmount * totalMonths;
      sipTotalInvested = sipAmount * totalMonths;
    } else {
      // Annuity due compounding formula: PMT * (((1 + mr)^n - 1) / mr) * (1 + mr)
      sipFutureValue = sipAmount * ((Math.pow(1 + mr, totalMonths) - 1) / mr) * (1 + mr);
      sipTotalInvested = sipAmount * totalMonths;
    }
  } else {
    sipFutureValue = 0;
    sipTotalInvested = 0;
  }
  const sipGains = Math.max(0, sipFutureValue - sipTotalInvested);

  const futureValueDifference = lumpSumFutureValue - sipFutureValue;
  let preferredOption: 'SIP' | 'Lumpsum' | 'Equal' = 'Equal';
  if (Math.abs(futureValueDifference) > 1) {
    preferredOption = futureValueDifference > 0 ? 'Lumpsum' : 'SIP';
  }

  const sipWealthRatio = sipTotalInvested > 0 ? sipFutureValue / sipTotalInvested : 1;
  const lumpSumWealthRatio = lumpSumAmount > 0 ? lumpSumFutureValue / lumpSumAmount : 1;

  return {
    sipTotalInvested: Number(sipTotalInvested.toFixed(2)),
    sipFutureValue: Number(sipFutureValue.toFixed(2)),
    sipGains: Number(sipGains.toFixed(2)),
    lumpSumTotalInvested: Number(lumpSumAmount.toFixed(2)),
    lumpSumFutureValue: Number(lumpSumFutureValue.toFixed(2)),
    lumpSumGains: Number(lumpSumGains.toFixed(2)),
    futureValueDifference: Number(futureValueDifference.toFixed(2)),
    preferredOption,
    sipWealthRatio: Number(sipWealthRatio.toFixed(2)),
    lumpSumWealthRatio: Number(lumpSumWealthRatio.toFixed(2)),
  };
}

// 4. MULTI-GOAL INVESTMENT PLANNER
export interface GoalInputItem {
  id: string;
  name: string;
  targetAmountToday: number;
  yearsToGoal: number;
}

export interface GoalResultItem {
  id: string;
  name: string;
  targetAmountToday: number;
  targetAmountFuture: number; // Inflation adjusted
  yearsToGoal: number;
  requiredMonthlySip: number;
  totalInvested: number;
  projectedGains: number;
}

export interface MultiGoalPlannerResult {
  totalTargetToday: number;
  totalTargetFuture: number;
  totalRequiredMonthlySip: number;
  goals: GoalResultItem[];
}

export function calculateMultiGoalPlanner(
  goals: GoalInputItem[],
  expectedReturnPercent: number,
  inflationPercent: number
): MultiGoalPlannerResult {
  const r = expectedReturnPercent > 0 ? expectedReturnPercent / 100 : 0;
  const inf = inflationPercent > 0 ? inflationPercent / 100 : 0;
  const mr = r / 12;

  let totalTargetToday = 0;
  let totalTargetFuture = 0;
  let totalRequiredMonthlySip = 0;

  const processedGoals = goals.map(goal => {
    const tgtToday = goal.targetAmountToday > 0 ? goal.targetAmountToday : 0;
    const years = goal.yearsToGoal > 0 ? goal.yearsToGoal : 0;
    const totalMonths = years * 12;

    // Adjust target amount for inflation: FV = PV * (1 + inflation)^years
    const tgtFuture = totalMonths > 0 ? tgtToday * Math.pow(1 + inf, years) : tgtToday;

    // Required monthly SIP to reach tgtFuture
    let requiredMonthlySip = 0;
    if (totalMonths > 0) {
      if (mr === 0) {
        requiredMonthlySip = tgtFuture / totalMonths;
      } else {
        // Annuity due compounding solver: PMT = FV / (((1 + mr)^n - 1) / mr * (1 + mr))
        requiredMonthlySip = tgtFuture / (((Math.pow(1 + mr, totalMonths) - 1) / mr) * (1 + mr));
      }
    } else {
      requiredMonthlySip = tgtFuture;
    }

    const totalInvested = totalMonths > 0 ? requiredMonthlySip * totalMonths : tgtFuture;
    const projectedGains = Math.max(0, tgtFuture - totalInvested);

    totalTargetToday += tgtToday;
    totalTargetFuture += tgtFuture;
    totalRequiredMonthlySip += requiredMonthlySip;

    return {
      id: goal.id,
      name: goal.name || 'Untitled Goal',
      targetAmountToday: tgtToday,
      targetAmountFuture: Number(tgtFuture.toFixed(2)),
      yearsToGoal: years,
      requiredMonthlySip: Number(requiredMonthlySip.toFixed(2)),
      totalInvested: Number(totalInvested.toFixed(2)),
      projectedGains: Number(projectedGains.toFixed(2)),
    };
  });

  return {
    totalTargetToday: Number(totalTargetToday.toFixed(2)),
    totalTargetFuture: Number(totalTargetFuture.toFixed(2)),
    totalRequiredMonthlySip: Number(totalRequiredMonthlySip.toFixed(2)),
    goals: processedGoals,
  };
}

// 5. RETIREMENT INCOME CALCULATOR
export interface RetirementIncomeInput {
  currentCorpus: number;
  expectedAnnualReturnPercent: number;
  inflationPercent: number;
  retirementYears: number;
  initialMonthlyWithdrawal: number;
  inflationAdjusted: boolean;
}

export interface RetirementMonthlyFlow {
  month: number;
  year: number;
  beginningBalance: number;
  withdrawal: number;
  interestEarned: number;
  endingBalance: number;
}

export interface RetirementIncomeResult {
  sustainMonths: number;
  isFullySustained: boolean;
  totalIncomeWithdrawn: number;
  endingBalance: number;
  depletionYear: number | null;
  depletionMonth: number | null;
  schedule: RetirementMonthlyFlow[];
}

export function calculateRetirementIncome(input: RetirementIncomeInput): RetirementIncomeResult {
  const corpus = input.currentCorpus > 0 ? input.currentCorpus : 0;
  const returnRate = input.expectedAnnualReturnPercent > 0 ? input.expectedAnnualReturnPercent / 100 : 0;
  const infRate = input.inflationPercent > 0 ? input.inflationPercent / 100 : 0;
  const years = input.retirementYears > 0 ? input.retirementYears : 0;
  const totalMonths = years * 12;

  const mr = returnRate / 12;
  const monthlyWithdrawalStart = input.initialMonthlyWithdrawal > 0 ? input.initialMonthlyWithdrawal : 0;

  let currentBalance = corpus;
  let sustainMonths = 0;
  let totalIncomeWithdrawn = 0;
  let isFullySustained = true;
  let depletionYear: number | null = null;
  let depletionMonth: number | null = null;

  const schedule: RetirementMonthlyFlow[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const curYear = Math.ceil(m / 12);
    const monthInYear = m % 12 === 0 ? 12 : m % 12;

    // Adjust withdrawal for inflation annually
    let currentWithdrawal = monthlyWithdrawalStart;
    if (input.inflationAdjusted && curYear > 1) {
      currentWithdrawal = monthlyWithdrawalStart * Math.pow(1 + infRate, curYear - 1);
    }

    const beginningBalance = currentBalance;
    let actualWithdrawal = currentWithdrawal;

    if (currentBalance <= 0) {
      isFullySustained = false;
      actualWithdrawal = 0;
      if (depletionYear === null) {
        depletionYear = curYear;
        depletionMonth = monthInYear;
      }
    } else if (currentBalance < currentWithdrawal) {
      isFullySustained = false;
      actualWithdrawal = currentBalance;
      currentBalance = 0;
      if (depletionYear === null) {
        depletionYear = curYear;
        depletionMonth = monthInYear;
      }
    } else {
      currentBalance -= currentWithdrawal;
      sustainMonths++;
    }

    const interestEarned = currentBalance * mr;
    currentBalance += interestEarned;
    totalIncomeWithdrawn += actualWithdrawal;

    // Record flow details (limit recorded schedule to first 360 months for performance, but calculate fully)
    if (m <= 360) {
      schedule.push({
        month: m,
        year: curYear,
        beginningBalance: Number(beginningBalance.toFixed(2)),
        withdrawal: Number(actualWithdrawal.toFixed(2)),
        interestEarned: Number(interestEarned.toFixed(2)),
        endingBalance: Number(currentBalance.toFixed(2)),
      });
    }
  }

  return {
    sustainMonths,
    isFullySustained,
    totalIncomeWithdrawn: Number(totalIncomeWithdrawn.toFixed(2)),
    endingBalance: Number(currentBalance.toFixed(2)),
    depletionYear,
    depletionMonth,
    schedule,
  };
}

// 6. ANNUITY CALCULATOR
export interface AnnuityInput {
  principalAmount: number; // For payout calculations
  regularPayment: number; // For future growth calculations
  expectedReturnPercent: number;
  years: number;
  frequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  type: 'ordinary' | 'due'; // ordinary (end of period) vs due (start of period)
  mode: 'calculate-payment' | 'calculate-fv' | 'calculate-pv';
}

export interface AnnuityResult {
  calculatedAmount: number;
  totalPayments: number;
  totalInterest: number;
}

export function calculateAnnuity(input: AnnuityInput): AnnuityResult {
  const rAnnual = input.expectedReturnPercent > 0 ? input.expectedReturnPercent / 100 : 0;
  const years = input.years > 0 ? input.years : 0;

  let freqMultiplier = 12;
  if (input.frequency === 'quarterly') freqMultiplier = 4;
  else if (input.frequency === 'semi-annually') freqMultiplier = 2;
  else if (input.frequency === 'annually') freqMultiplier = 1;

  const n = years * freqMultiplier;
  const r = rAnnual / freqMultiplier;

  let calculatedAmount = 0;
  let totalPayments = 0;
  let totalInterest = 0;

  if (input.mode === 'calculate-payment') {
    const pv = input.principalAmount > 0 ? input.principalAmount : 0;
    if (n <= 0) {
      calculatedAmount = 0;
      totalPayments = 0;
    } else if (r === 0) {
      calculatedAmount = pv / n;
      totalPayments = pv;
    } else {
      if (input.type === 'ordinary') {
        calculatedAmount = (pv * r) / (1 - Math.pow(1 + r, -n));
      } else {
        calculatedAmount = (pv * r) / ((1 - Math.pow(1 + r, -n)) * (1 + r));
      }
      totalPayments = calculatedAmount * n;
    }
    totalInterest = Math.max(0, totalPayments - pv);

  } else if (input.mode === 'calculate-fv') {
    const pmt = input.regularPayment > 0 ? input.regularPayment : 0;
    totalPayments = pmt * n;
    if (n <= 0) {
      calculatedAmount = 0;
    } else if (r === 0) {
      calculatedAmount = totalPayments;
    } else {
      if (input.type === 'ordinary') {
        calculatedAmount = pmt * ((Math.pow(1 + r, n) - 1) / r);
      } else {
        calculatedAmount = pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      }
    }
    totalInterest = Math.max(0, calculatedAmount - totalPayments);

  } else if (input.mode === 'calculate-pv') {
    const pmt = input.regularPayment > 0 ? input.regularPayment : 0;
    totalPayments = pmt * n;
    if (n <= 0) {
      calculatedAmount = 0;
    } else if (r === 0) {
      calculatedAmount = totalPayments;
    } else {
      if (input.type === 'ordinary') {
        calculatedAmount = pmt * ((1 - Math.pow(1 + r, -n)) / r);
      } else {
        calculatedAmount = pmt * ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
      }
    }
    totalInterest = Math.max(0, totalPayments - calculatedAmount);
  }

  return {
    calculatedAmount: Number(calculatedAmount.toFixed(2)),
    totalPayments: Number(totalPayments.toFixed(2)),
    totalInterest: Number(totalInterest.toFixed(2)),
  };
}
