export interface SIPInput {
  monthlyInvestment: number;
  expectedReturnRate: number; // annual % e.g. 12%
  timePeriodYears: number;
}

export interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    returns: number;
    balance: number;
  }[];
}

/**
 * Standard SIP formula:
 * M = P * ({[1 + i]^n - 1} / i) * (1 + i)
 * where:
 * P = monthly investment
 * i = monthly rate (returnRate / 12 / 100)
 * n = total months (years * 12)
 */
export function calculateSIP(input: SIPInput): SIPResult {
  const P = Math.max(0, input.monthlyInvestment);
  const annualRate = Math.max(0, input.expectedReturnRate);
  const years = Math.max(1 / 12, input.timePeriodYears);
  const n = Math.round(years * 12);

  if (annualRate === 0) {
    const invested = P * n;
    return {
      investedAmount: invested,
      estimatedReturns: 0,
      totalValue: invested,
      yearlyBreakdown: Array.from({ length: years }, (_, i) => ({
        year: i + 1,
        invested: P * (i + 1) * 12,
        returns: 0,
        balance: P * (i + 1) * 12,
      })),
    };
  }

  const i = annualRate / 12 / 100;
  const totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const investedAmount = P * n;
  const estimatedReturns = totalValue - investedAmount;

  const yearlyBreakdown = [];
  for (let yr = 1; yr <= years; yr++) {
    const months = yr * 12;
    const inv = P * months;
    const val = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    yearlyBreakdown.push({
      year: yr,
      invested: Math.round(inv),
      returns: Math.round(val - inv),
      balance: Math.round(val),
    });
  }

  return {
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    yearlyBreakdown,
  };
}

export interface CompoundInterestInput {
  principal: number;
  annualRate: number; // %
  years: number;
  compoundFrequency: number; // 1 = yearly, 2 = semi-annual, 4 = quarterly, 12 = monthly, 365 = daily
}

export interface CompoundInterestResult {
  principal: number;
  totalInterest: number;
  totalAmount: number;
  yearlyBreakdown: { year: number; balance: number; interestEarned: number }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const P = Math.max(0, input.principal);
  const r = Math.max(0, input.annualRate) / 100;
  const t = Math.max(0.0001, input.years);
  const n = Math.max(1, input.compoundFrequency);

  const totalAmount = P * Math.pow(1 + r / n, n * t);
  const totalInterest = totalAmount - P;

  const yearlyBreakdown = [];
  const endYear = Math.ceil(t);
  for (let y = 1; y <= endYear; y++) {
    const period = Math.min(y, t);
    const balance = P * Math.pow(1 + r / n, n * period);
    yearlyBreakdown.push({
      year: y,
      balance: Math.round(balance),
      interestEarned: Math.round(balance - P),
    });
  }

  return {
    principal: Math.round(P),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    yearlyBreakdown,
  };
}

export interface PercentageInput {
  type: 'what_is_x_percent_of_y' | 'x_is_what_percent_of_y' | 'percentage_change';
  val1: number;
  val2: number;
}

export function calculatePercentage(input: PercentageInput): { result: number; formulaText: string } {
  const { type, val1, val2 } = input;
  if (type === 'what_is_x_percent_of_y') {
    const res = (val1 / 100) * val2;
    return {
      result: Math.round(res * 1000) / 1000,
      formulaText: `${val1}% of ${val2} = (${val1} ÷ 100) × ${val2} = ${res}`,
    };
  } else if (type === 'x_is_what_percent_of_y') {
    if (val2 === 0) return { result: 0, formulaText: 'Division by zero is undefined' };
    const res = (val1 / val2) * 100;
    return {
      result: Math.round(res * 1000) / 1000,
      formulaText: `${val1} is (${val1} ÷ ${val2}) × 100 = ${Math.round(res * 100) / 100}% of ${val2}`,
    };
  } else {
    // Percentage change from val1 to val2
    if (val1 === 0) return { result: 0, formulaText: 'Base value cannot be zero for percent change' };
    const diff = val2 - val1;
    const res = (diff / Math.abs(val1)) * 100;
    return {
      result: Math.round(res * 100) / 100,
      formulaText: `Change from ${val1} to ${val2} = ((${val2} - ${val1}) ÷ ${val1}) × 100 = ${Math.round(res * 100) / 100}%`,
    };
  }
}

export interface DiscountInput {
  originalPrice: number;
  discountPercentage: number;
  taxPercentage?: number;
}

export function calculateDiscount(input: DiscountInput): {
  savings: number;
  finalPrice: number;
  taxAmount: number;
  priceAfterDiscount: number;
} {
  const price = Math.max(0, input.originalPrice);
  const discountRate = Math.min(100, Math.max(0, input.discountPercentage));
  const taxRate = Math.max(0, input.taxPercentage || 0);

  const savings = (price * discountRate) / 100;
  const priceAfterDiscount = price - savings;
  const taxAmount = (priceAfterDiscount * taxRate) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  return {
    savings: Math.round(savings * 100) / 100,
    priceAfterDiscount: Math.round(priceAfterDiscount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    finalPrice: Math.round(finalPrice * 100) / 100,
  };
}

export interface TipInput {
  billAmount: number;
  tipPercentage: number;
  splitCount: number;
  roundMode?: 'none' | 'round_total' | 'round_tip';
}

export interface TipResult {
  tipAmount: number;
  totalBill: number;
  perPersonBill: number;
  perPersonTip: number;
}

export function calculateTip(input: TipInput): TipResult {
  const bill = Math.max(0, input.billAmount);
  const tipPct = Math.max(0, input.tipPercentage);
  const people = Math.max(1, input.splitCount);

  let rawTip = (bill * tipPct) / 100;
  let rawTotal = bill + rawTip;

  if (input.roundMode === 'round_total') {
    rawTotal = Math.ceil(rawTotal);
    rawTip = Math.max(0, rawTotal - bill);
  } else if (input.roundMode === 'round_tip') {
    rawTip = Math.ceil(rawTip);
    rawTotal = bill + rawTip;
  }

  const tipAmount = Math.round(rawTip * 100) / 100;
  const totalBill = Math.round(rawTotal * 100) / 100;
  const perPersonBill = Math.round((totalBill / people) * 100) / 100;
  const perPersonTip = Math.round((tipAmount / people) * 100) / 100;

  return {
    tipAmount,
    totalBill,
    perPersonBill,
    perPersonTip,
  };
}

export type PayPeriod = 'hourly' | 'weekly' | 'biweekly' | 'monthly' | 'annual';

export interface SalaryInput {
  payAmount: number;
  payPeriod: PayPeriod;
  hoursPerWeek?: number; // default 40
  taxPercentage?: number; // e.g. 18%
  deductionsPercentage?: number; // e.g. 10% (401k/EPF/Insurance)
}

export interface SalaryResult {
  annualGross: number;
  monthlyGross: number;
  biweeklyGross: number;
  weeklyGross: number;
  hourlyGross: number;
  annualNet: number;
  monthlyNet: number;
  biweeklyNet: number;
  weeklyNet: number;
  hourlyNet: number;
  totalTaxAmount: number;
  totalDeductionsAmount: number;
  netTakeHomePercentage: number;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const pay = Math.max(0, input.payAmount);
  const hours = Math.max(1, input.hoursPerWeek || 40);
  const taxPct = Math.min(100, Math.max(0, input.taxPercentage || 0));
  const dedPct = Math.min(100, Math.max(0, input.deductionsPercentage || 0));

  let annualGross = 0;
  if (input.payPeriod === 'hourly') {
    annualGross = pay * hours * 52;
  } else if (input.payPeriod === 'weekly') {
    annualGross = pay * 52;
  } else if (input.payPeriod === 'biweekly') {
    annualGross = pay * 26;
  } else if (input.payPeriod === 'monthly') {
    annualGross = pay * 12;
  } else {
    annualGross = pay;
  }

  const totalTaxAmount = Math.round((annualGross * taxPct) / 100);
  const totalDeductionsAmount = Math.round((annualGross * dedPct) / 100);
  const annualNet = Math.max(0, annualGross - totalTaxAmount - totalDeductionsAmount);

  const monthlyGross = Math.round(annualGross / 12);
  const biweeklyGross = Math.round(annualGross / 26);
  const weeklyGross = Math.round(annualGross / 52);
  const hourlyGross = Math.round((annualGross / (hours * 52)) * 100) / 100;

  const monthlyNet = Math.round(annualNet / 12);
  const biweeklyNet = Math.round(annualNet / 26);
  const weeklyNet = Math.round(annualNet / 52);
  const hourlyNet = Math.round((annualNet / (hours * 52)) * 100) / 100;

  const netTakeHomePercentage = annualGross > 0 ? Math.round((annualNet / annualGross) * 1000) / 10 : 0;

  return {
    annualGross,
    monthlyGross,
    biweeklyGross,
    weeklyGross,
    hourlyGross,
    annualNet,
    monthlyNet,
    biweeklyNet,
    weeklyNet,
    hourlyNet,
    totalTaxAmount,
    totalDeductionsAmount,
    netTakeHomePercentage,
  };
}

export interface ROIInput {
  initialInvestment: number;
  finalValue: number;
  investmentYears?: number; // for CAGR calculation
}

export interface ROIResult {
  netProfit: number;
  roiPercentage: number;
  annualizedRoiPercentage: number; // CAGR
  profitMarginPercentage: number;
  isProfit: boolean;
}

export function calculateROI(input: ROIInput): ROIResult {
  const initial = Math.max(0.01, input.initialInvestment);
  const finalVal = Math.max(0, input.finalValue);
  const years = Math.max(0.01, input.investmentYears || 1);

  const netProfit = Math.round((finalVal - initial) * 100) / 100;
  const roiPercentage = Math.round(((finalVal - initial) / initial) * 10000) / 100;

  // CAGR = ((Final / Initial) ^ (1 / years) - 1) * 100
  let annualizedRoiPercentage = 0;
  if (finalVal > 0) {
    const cagr = (Math.pow(finalVal / initial, 1 / years) - 1) * 100;
    annualizedRoiPercentage = Math.round(cagr * 100) / 100;
  } else {
    annualizedRoiPercentage = -100;
  }

  // Profit margin = (Profit / Final Revenue) * 100
  const profitMarginPercentage = finalVal > 0 ? Math.round((netProfit / finalVal) * 10000) / 100 : -100;

  return {
    netProfit,
    roiPercentage,
    annualizedRoiPercentage,
    profitMarginPercentage,
    isProfit: netProfit >= 0,
  };
}

export interface SquareFootageInput {
  length: number;
  width: number;
  unit: 'ft' | 'm' | 'in' | 'yd';
  costPerSquareUnit?: number;
  wastePercentage?: number; // e.g. 10%
}

export interface SquareFootageResult {
  areaSqFt: number;
  areaSqM: number;
  totalAreaWithWasteSqFt: number;
  totalAreaWithWasteSqM: number;
  materialsCost: number;
}

export function calculateSquareFootage(input: SquareFootageInput): SquareFootageResult {
  const l = Math.max(0, input.length);
  const w = Math.max(0, input.width);
  const waste = Math.max(0, input.wastePercentage || 0);
  const unitCost = Math.max(0, input.costPerSquareUnit || 0);

  // Convert to feet
  let lengthInFeet = l;
  let widthInFeet = w;
  if (input.unit === 'm') {
    lengthInFeet = l * 3.28084;
    widthInFeet = w * 3.28084;
  } else if (input.unit === 'in') {
    lengthInFeet = l / 12;
    widthInFeet = w / 12;
  } else if (input.unit === 'yd') {
    lengthInFeet = l * 3;
    widthInFeet = w * 3;
  }

  const rawSqFt = lengthInFeet * widthInFeet;
  const areaSqFt = Math.round(rawSqFt * 100) / 100;
  const areaSqM = Math.round(rawSqFt * 0.092903 * 100) / 100;

  const totalAreaWithWasteSqFt = Math.round(areaSqFt * (1 + waste / 100) * 100) / 100;
  const totalAreaWithWasteSqM = Math.round(areaSqM * (1 + waste / 100) * 100) / 100;

  // Cost applied to chosen unit
  let primaryArea = areaSqFt;
  if (input.unit === 'm') primaryArea = areaSqM;
  const materialsCost = Math.round(primaryArea * (1 + waste / 100) * unitCost * 100) / 100;

  return {
    areaSqFt,
    areaSqM,
    totalAreaWithWasteSqFt,
    totalAreaWithWasteSqM,
    materialsCost,
  };
}

export interface MortgageInput {
  homeValue: number;
  downPayment: number;
  interestRate: number;
  tenureYears: number;
  annualPropertyTax?: number;
  annualHomeInsurance?: number;
}

export interface MortgageResult {
  loanAmount: number;
  ltvPercentage: number;
  monthlyPrincipalAndInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const homeVal = Math.max(0, input.homeValue);
  const downPay = Math.min(homeVal, Math.max(0, input.downPayment));
  const loanAmount = homeVal - downPay;
  const annualRate = Math.max(0, input.interestRate);
  const years = Math.max(1 / 12, input.tenureYears);
  const n = Math.round(years * 12);

  let monthlyEMI = 0;
  if (annualRate === 0) {
    monthlyEMI = loanAmount / n;
  } else {
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, n);
    monthlyEMI = (loanAmount * r * factor) / (factor - 1);
  }

  const monthlyPropertyTax = Math.round(((input.annualPropertyTax || 0) / 12) * 100) / 100;
  const monthlyHomeInsurance = Math.round(((input.annualHomeInsurance || 0) / 12) * 100) / 100;
  const totalMonthlyPayment = Math.round((monthlyEMI + monthlyPropertyTax + monthlyHomeInsurance) * 100) / 100;

  const totalPayment = Math.round(monthlyEMI * n);
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const ltvPercentage = homeVal > 0 ? Math.round((loanAmount / homeVal) * 1000) / 10 : 0;

  return {
    loanAmount,
    ltvPercentage,
    monthlyPrincipalAndInterest: Math.round(monthlyEMI),
    monthlyPropertyTax,
    monthlyHomeInsurance,
    totalMonthlyPayment,
    totalInterest,
    totalPayment,
  };
}

// ---------------------------------------------------------------------------
// SIMPLE INTEREST CALCULATOR
// ---------------------------------------------------------------------------
export type TimeUnit = 'years' | 'months' | 'days';

export interface SimpleInterestInput {
  principal: number;
  ratePercentage: number;
  time: number;
  timeUnit: TimeUnit;
}

export interface SimpleInterestResult {
  principal: number;
  ratePercentage: number;
  timeInYears: number;
  timeDisplay: string;
  simpleInterest: number;
  totalAmount: number;
  dailyInterest: number;
  monthlyInterest: number;
  annualInterest: number;
  periodBreakdown: {
    period: number;
    label: string;
    interestEarned: number;
    cumulativeInterest: number;
    totalBalance: number;
  }[];
}

export function calculateSimpleInterest(input: SimpleInterestInput): SimpleInterestResult {
  const principal = Math.max(0, input.principal || 0);
  const rate = Math.max(0, input.ratePercentage || 0);
  const time = Math.max(0, input.time || 0);
  const unit = input.timeUnit || 'years';

  let timeInYears = 0;
  let timeDisplay = '';

  if (unit === 'years') {
    timeInYears = time;
    timeDisplay = `${time} ${time === 1 ? 'Year' : 'Years'}`;
  } else if (unit === 'months') {
    timeInYears = time / 12;
    timeDisplay = `${time} ${time === 1 ? 'Month' : 'Months'} (${(time / 12).toFixed(2)} yrs)`;
  } else {
    timeInYears = time / 365;
    timeDisplay = `${time} ${time === 1 ? 'Day' : 'Days'} (${(time / 365).toFixed(2)} yrs)`;
  }

  // Formula: SI = (P * R * T) / 100
  const simpleInterest = Math.round(((principal * rate * timeInYears) / 100) * 100) / 100;
  const totalAmount = Math.round((principal + simpleInterest) * 100) / 100;

  const annualInterest = Math.round(((principal * rate) / 100) * 100) / 100;
  const monthlyInterest = Math.round((annualInterest / 12) * 100) / 100;
  const dailyInterest = Math.round((annualInterest / 365) * 100) / 100;

  // Generate periodic breakdown (up to 30 periods for clean tabular display)
  const periodBreakdown: SimpleInterestResult['periodBreakdown'] = [];
  const maxPeriods = unit === 'days' ? Math.min(30, Math.ceil(time)) : Math.min(30, Math.max(1, Math.ceil(time)));

  let cumulative = 0;
  for (let i = 1; i <= maxPeriods; i++) {
    let periodInterest = 0;
    let label = '';

    if (unit === 'years') {
      periodInterest = annualInterest;
      label = `Year ${i}`;
    } else if (unit === 'months') {
      periodInterest = monthlyInterest;
      label = `Month ${i}`;
    } else {
      periodInterest = dailyInterest;
      label = `Day ${i}`;
    }

    cumulative += periodInterest;
    periodBreakdown.push({
      period: i,
      label,
      interestEarned: Math.round(periodInterest * 100) / 100,
      cumulativeInterest: Math.round(cumulative * 100) / 100,
      totalBalance: Math.round((principal + cumulative) * 100) / 100,
    });
  }

  return {
    principal,
    ratePercentage: rate,
    timeInYears,
    timeDisplay,
    simpleInterest,
    totalAmount,
    dailyInterest,
    monthlyInterest,
    annualInterest,
    periodBreakdown,
  };
}

export type SimpleInterestTarget = 'interest' | 'principal' | 'rate' | 'time';

export interface MultiDirectionSimpleInterestInput {
  target: SimpleInterestTarget;
  principal?: number;
  ratePercentage?: number;
  time?: number;
  timeUnit: TimeUnit;
  interest?: number;
}

export interface MultiDirectionSimpleInterestResult extends SimpleInterestResult {
  solvedVariable: SimpleInterestTarget;
  solvedValue: number;
}

export function calculateMultiDirectionSimpleInterest(
  input: MultiDirectionSimpleInterestInput
): MultiDirectionSimpleInterestResult {
  const { target, timeUnit = 'years' } = input;
  let p = Math.max(0, input.principal || 0);
  let r = Math.max(0, input.ratePercentage || 0);
  let t = Math.max(0, input.time || 0);
  let si = Math.max(0, input.interest || 0);

  // Convert time to years
  let tYears = t;
  if (timeUnit === 'months') tYears = t / 12;
  if (timeUnit === 'days') tYears = t / 365;

  let solvedValue = 0;

  if (target === 'interest') {
    solvedValue = Math.round(((p * r * tYears) / 100) * 100) / 100;
    si = solvedValue;
  } else if (target === 'principal') {
    if (r > 0 && tYears > 0) {
      solvedValue = Math.round(((si * 100) / (r * tYears)) * 100) / 100;
      p = solvedValue;
    }
  } else if (target === 'rate') {
    if (p > 0 && tYears > 0) {
      solvedValue = Math.round(((si * 100) / (p * tYears)) * 100) / 100;
      r = solvedValue;
    }
  } else if (target === 'time') {
    if (p > 0 && r > 0) {
      const yearsNeeded = (si * 100) / (p * r);
      if (timeUnit === 'months') {
        solvedValue = Math.round(yearsNeeded * 12 * 10) / 10;
        t = solvedValue;
      } else if (timeUnit === 'days') {
        solvedValue = Math.round(yearsNeeded * 365);
        t = solvedValue;
      } else {
        solvedValue = Math.round(yearsNeeded * 100) / 100;
        t = solvedValue;
      }
    }
  }

  const standardResult = calculateSimpleInterest({
    principal: p,
    ratePercentage: r,
    time: t,
    timeUnit,
  });

  return {
    ...standardResult,
    solvedVariable: target,
    solvedValue,
  };
}

// ---------------------------------------------------------------------------
// YEARLY SIP CALCULATOR
// ---------------------------------------------------------------------------
export interface YearlySIPInput {
  initialInvestment?: number;
  yearlyInvestment: number;
  expectedReturnRate: number; // annual %
  timePeriodYears: number;
  stepUpPercentage?: number; // annual step up % (e.g. 5% or 10%)
}

export interface YearlySIPResult {
  totalInvested: number;
  estimatedReturns: number;
  finalMaturityValue: number;
  yearlyBreakdown: {
    year: number;
    yearlyDeposit: number;
    cumulativeInvested: number;
    interestEarnedThisYear: number;
    totalReturns: number;
    endingBalance: number;
  }[];
}

export function calculateYearlySIP(input: YearlySIPInput): YearlySIPResult {
  const initial = Math.max(0, input.initialInvestment || 0);
  const baseYearly = Math.max(0, input.yearlyInvestment || 0);
  const rate = Math.max(0, input.expectedReturnRate || 0);
  const years = Math.min(50, Math.max(1, Math.round(input.timePeriodYears || 1)));
  const stepUp = Math.max(0, input.stepUpPercentage || 0);

  let runningBalance = initial;
  let cumulativeInvested = initial;
  let currentYearlyDeposit = baseYearly;
  const yearlyBreakdown: YearlySIPResult['yearlyBreakdown'] = [];

  for (let yr = 1; yr <= years; yr++) {
    const depositThisYear = yr === 1 ? currentYearlyDeposit : (currentYearlyDeposit = Math.round(currentYearlyDeposit * (1 + stepUp / 100)));
    cumulativeInvested += depositThisYear;

    // Investment made at the beginning of the annual cycle
    const startBalance = runningBalance + depositThisYear;
    const interestEarned = Math.round(startBalance * (rate / 100));
    runningBalance = startBalance + interestEarned;

    yearlyBreakdown.push({
      year: yr,
      yearlyDeposit: depositThisYear,
      cumulativeInvested,
      interestEarnedThisYear: interestEarned,
      totalReturns: Math.max(0, runningBalance - cumulativeInvested),
      endingBalance: runningBalance,
    });
  }

  return {
    totalInvested: cumulativeInvested,
    estimatedReturns: Math.max(0, runningBalance - cumulativeInvested),
    finalMaturityValue: runningBalance,
    yearlyBreakdown,
  };
}

// ---------------------------------------------------------------------------
// SPECIALIZED LOAN CALCULATORS
// ---------------------------------------------------------------------------
export interface SpecializedLoanInput {
  loanType: 'home' | 'car' | 'personal' | 'education';
  assetPrice?: number; // e.g. Home price or Car on-road price
  downPayment?: number;
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  tenureMonths?: number;
  processingFeePercentage?: number;
  // Specific to Education Loan
  moratoriumYears?: number;
  simpleInterestDuringMoratorium?: boolean;
  // Specific to Car Loan
  annualRunningCost?: number; // insurance + fuel + maintenance
}

export interface SpecializedLoanResult {
  loanType: 'home' | 'car' | 'personal' | 'education';
  principalLoanAmount: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  processingFeeAmount: number;
  netDisbursedAmount: number;
  ltvPercentage?: number;
  // Education loan specific
  moratoriumInterest?: number;
  postMoratoriumPrincipal?: number;
  // Car loan specific
  estimatedTotalOwnershipCost?: number;
}

export function calculateSpecializedLoan(input: SpecializedLoanInput): SpecializedLoanResult {
  let principal = Math.max(0, input.loanAmount);

  // If asset price and down payment given, auto-derive loan amount if not overridden
  if (input.assetPrice && input.assetPrice > 0 && input.downPayment !== undefined) {
    const computed = Math.max(0, input.assetPrice - input.downPayment);
    if (computed > 0) {
      principal = computed;
    }
  }

  const annualRate = Math.max(0, input.interestRate);
  const totalMonths = (input.tenureYears || 0) * 12 + (input.tenureMonths || 0);
  const n = Math.max(1, totalMonths);

  let moratoriumInterest = 0;
  let effectivePrincipal = principal;

  if (input.loanType === 'education' && input.moratoriumYears && input.moratoriumYears > 0) {
    // Simple interest accumulated during study/moratorium period
    moratoriumInterest = Math.round((principal * annualRate * input.moratoriumYears) / 100);
    // Standard education loan practice: moratorium interest is capitalized into principal
    if (input.simpleInterestDuringMoratorium) {
      effectivePrincipal = principal + moratoriumInterest;
    }
  }

  let monthlyEMI = 0;
  if (annualRate === 0) {
    monthlyEMI = effectivePrincipal / n;
  } else {
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, n);
    monthlyEMI = (effectivePrincipal * r * factor) / (factor - 1);
  }

  const roundedEMI = Math.round(monthlyEMI);
  const totalPayment = Math.round(roundedEMI * n);
  const totalInterest = Math.max(0, totalPayment - principal);

  const processingFeePercentage = input.processingFeePercentage || 0;
  const processingFeeAmount = Math.round((principal * processingFeePercentage) / 100);
  const netDisbursedAmount = Math.max(0, principal - processingFeeAmount);

  let ltvPercentage: number | undefined;
  if (input.assetPrice && input.assetPrice > 0) {
    ltvPercentage = Math.round((principal / input.assetPrice) * 1000) / 10;
  }

  let estimatedTotalOwnershipCost: number | undefined;
  if (input.loanType === 'car' && input.annualRunningCost) {
    const tenureYears = n / 12;
    estimatedTotalOwnershipCost = totalPayment + (input.downPayment || 0) + (input.annualRunningCost * tenureYears);
  }

  return {
    loanType: input.loanType,
    principalLoanAmount: principal,
    monthlyEMI: roundedEMI,
    totalInterest,
    totalPayment,
    processingFeeAmount,
    netDisbursedAmount,
    ltvPercentage,
    moratoriumInterest: moratoriumInterest > 0 ? moratoriumInterest : undefined,
    postMoratoriumPrincipal: effectivePrincipal !== principal ? effectivePrincipal : undefined,
    estimatedTotalOwnershipCost,
  };
}

export interface PaymentInput {
  loanAmount: number;
  annualRate: number;
  termMonths: number;
}

export interface PaymentResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
}

export function calculatePayment(input: PaymentInput): PaymentResult {
  const P = Math.max(0, input.loanAmount);
  const r = Math.max(0, input.annualRate) / 12 / 100;
  const n = Math.max(1, input.termMonths);

  if (r === 0) {
    const pmt = P / n;
    return {
      monthlyPayment: Math.round(pmt * 100) / 100,
      totalInterest: 0,
      totalPayment: P,
    };
  }

  const pmt = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = pmt * n;
  const totalInterest = totalPayment - P;

  return {
    monthlyPayment: Math.round(pmt * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
  };
}

export interface AutoLoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPercent: number;
  interestRate: number;
  loanTermMonths: number;
}

export interface AutoLoanResult {
  totalFinanced: number;
  salesTaxAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalLoanCost: number;
}

export function calculateAutoLoan(input: AutoLoanInput): AutoLoanResult {
  const price = Math.max(0, input.vehiclePrice);
  const down = Math.max(0, input.downPayment);
  const tradeIn = Math.max(0, input.tradeInValue);
  const taxRate = Math.max(0, input.salesTaxPercent) / 100;
  const taxableAmount = Math.max(0, price - tradeIn);
  const salesTaxAmount = taxableAmount * taxRate;

  const totalFinanced = Math.max(0, price + salesTaxAmount - down - tradeIn);
  const paymentRes = calculatePayment({
    loanAmount: totalFinanced,
    annualRate: input.interestRate,
    termMonths: input.loanTermMonths,
  });

  return {
    totalFinanced: Math.round(totalFinanced * 100) / 100,
    salesTaxAmount: Math.round(salesTaxAmount * 100) / 100,
    monthlyPayment: paymentRes.monthlyPayment,
    totalInterest: paymentRes.totalInterest,
    totalLoanCost: Math.round((paymentRes.totalPayment + down + tradeIn) * 100) / 100,
  };
}

export interface AmortizationScheduleItem {
  period: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  monthsToPayoff: number;
  schedule: AmortizationScheduleItem[];
  interestSavedWithExtra?: number;
  monthsSavedWithExtra?: number;
}

export function calculateAmortization(
  principal: number,
  annualRate: number,
  termMonths: number,
  extraMonthlyPayment = 0
): AmortizationResult {
  const P = Math.max(0, principal);
  const r = Math.max(0, annualRate) / 12 / 100;
  const n = Math.max(1, termMonths);

  const basePmt = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const standardTotalInterest = (basePmt * n) - P;

  let balance = P;
  let totalInterest = 0;
  let totalPayment = 0;
  const schedule: AmortizationScheduleItem[] = [];
  let month = 0;

  while (balance > 0.01 && month < 600) {
    month++;
    const interest = balance * r;
    let payment = basePmt + extraMonthlyPayment;
    let principalPaid = payment - interest;

    if (principalPaid > balance) {
      principalPaid = balance;
      payment = principalPaid + interest;
      balance = 0;
    } else {
      balance -= principalPaid;
    }

    totalInterest += interest;
    totalPayment += payment;

    // Record yearly or first 24 months + milestone months
    if (month <= 24 || month % 12 === 0 || balance === 0) {
      schedule.push({
        period: month,
        payment: Math.round(payment),
        principal: Math.round(principalPaid),
        interest: Math.round(interest),
        remainingBalance: Math.round(balance),
      });
    }
  }

  const interestSaved = extraMonthlyPayment > 0 ? Math.max(0, standardTotalInterest - totalInterest) : 0;
  const monthsSaved = extraMonthlyPayment > 0 ? Math.max(0, n - month) : 0;

  return {
    monthlyPayment: Math.round(basePmt * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    monthsToPayoff: month,
    schedule,
    interestSavedWithExtra: Math.round(interestSaved * 100) / 100,
    monthsSavedWithExtra: monthsSaved,
  };
}

/**
 * Solve for APR given loan amount, monthly payment, and loan tenure (Newton-Raphson method)
 */
export function calculateInterestRate(loanAmount: number, monthlyPayment: number, termMonths: number): number {
  if (loanAmount <= 0 || monthlyPayment <= 0 || termMonths <= 0) return 0;
  if (monthlyPayment * termMonths <= loanAmount) return 0; // 0% or negative

  let r = 0.05 / 12; // Initial guess: 5% annual
  for (let iter = 0; iter < 40; iter++) {
    const pow = Math.pow(1 + r, termMonths);
    const f = (loanAmount * r * pow) / (pow - 1) - monthlyPayment;
    const fPrime =
      (loanAmount * (pow * (1 + r * termMonths) - 1)) / Math.pow(pow - 1, 2);
    const nextR = r - f / fPrime;
    if (Math.abs(nextR - r) < 0.000001) {
      r = nextR;
      break;
    }
    r = nextR;
  }
  return Math.round(r * 12 * 10000) / 100; // Annual percentage e.g. 7.25%
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
  currentSavings: number;
  monthlySavings: number;
  annualReturnPreRetirement: number; // e.g. 8%
  annualReturnPostRetirement: number; // e.g. 5%
  inflationRate: number; // e.g. 3%
  monthlySpendingInRetirement: number;
}

export interface RetirementResult {
  yearsToRetire: number;
  yearsInRetirement: number;
  projectedNestEgg: number;
  requiredNestEgg: number;
  monthlySurplusOrShortfall: number;
  isFunded: boolean;
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const curAge = Math.max(18, input.currentAge);
  const retAge = Math.max(curAge + 1, input.retirementAge);
  const lifeAge = Math.max(retAge + 1, input.lifeExpectancyAge);

  const yearsToRetire = retAge - curAge;
  const yearsInRetirement = lifeAge - retAge;

  const realPreRate = (1 + input.annualReturnPreRetirement / 100) / (1 + input.inflationRate / 100) - 1;
  const monthlyPreRate = realPreRate / 12;
  const preMonths = yearsToRetire * 12;

  // FV of current savings
  const fvSavings = input.currentSavings * Math.pow(1 + monthlyPreRate, preMonths);
  // FV of monthly contributions
  const fvContributions =
    monthlyPreRate === 0
      ? input.monthlySavings * preMonths
      : input.monthlySavings * ((Math.pow(1 + monthlyPreRate, preMonths) - 1) / monthlyPreRate);
  const projectedNestEgg = Math.round(fvSavings + fvContributions);

  // Present Value required at retirement to fund post-retirement spending
  const realPostRate = (1 + input.annualReturnPostRetirement / 100) / (1 + input.inflationRate / 100) - 1;
  const monthlyPostRate = realPostRate / 12;
  const postMonths = yearsInRetirement * 12;

  const requiredNestEgg =
    monthlyPostRate === 0
      ? input.monthlySpendingInRetirement * postMonths
      : Math.round(
          input.monthlySpendingInRetirement *
            ((1 - Math.pow(1 + monthlyPostRate, -postMonths)) / monthlyPostRate)
        );

  const difference = projectedNestEgg - requiredNestEgg;
  const monthlyShortfall =
    difference < 0 && monthlyPreRate > 0
      ? Math.round(Math.abs(difference) * (monthlyPreRate / (Math.pow(1 + monthlyPreRate, preMonths) - 1)))
      : 0;

  return {
    yearsToRetire,
    yearsInRetirement,
    projectedNestEgg,
    requiredNestEgg,
    monthlySurplusOrShortfall: difference < 0 ? -monthlyShortfall : Math.round(difference / preMonths),
    isFunded: projectedNestEgg >= requiredNestEgg,
  };
}

export interface InvestmentInput {
  initialInvestment: number;
  monthlyContribution: number;
  timeHorizonYears: number;
  expectedAnnualReturn: number;
  inflationRate: number;
}

export interface InvestmentResult {
  totalPrincipal: number;
  nominalWealth: number;
  realWealth: number;
  totalNominalGains: number;
  purchasingPowerLossPercent: number;
}

export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const P = Math.max(0, input.initialInvestment || 0);
  const PMT = Math.max(0, input.monthlyContribution || 0);
  const years = Math.max(1 / 12, input.timeHorizonYears || 1 / 12);
  const months = Math.round(years * 12);
  const r = (input.expectedAnnualReturn || 0) / 100 / 12;
  const totalPrincipal = P + PMT * months;

  const fvInitial = P * Math.pow(1 + r, months);
  const fvMonthly = r === 0 ? PMT * months : PMT * ((Math.pow(1 + r, months) - 1) / r);
  const nominalWealth = Math.round(fvInitial + fvMonthly);

  // Inflation-adjusted real wealth
  const inflationRate = typeof input.inflationRate === 'number' ? input.inflationRate : 0;
  const realInflationFactor = Math.pow(1 + inflationRate / 100, years);
  const realWealth = Math.round(nominalWealth / (realInflationFactor || 1));

  return {
    totalPrincipal: Math.round(totalPrincipal),
    nominalWealth,
    realWealth,
    totalNominalGains: Math.round(nominalWealth - totalPrincipal),
    purchasingPowerLossPercent: Math.round((1 - realWealth / nominalWealth) * 100),
  };
}

export interface InflationInput {
  amount: number;
  inflationRate: number;
  years: number;
}

export interface InflationResult {
  futureEquivalentCost: number;
  futurePurchasingPower: number;
  cumulativeInflationPercent: number;
}

export function calculateInflation(input: InflationInput): InflationResult {
  const amt = Math.max(0, input.amount);
  const rate = Math.max(0, input.inflationRate) / 100;
  const years = Math.max(1 / 12, input.years);

  const factor = Math.pow(1 + rate, years);
  const futureCost = amt * factor;
  const futurePower = amt / factor;

  return {
    futureEquivalentCost: Math.round(futureCost * 100) / 100,
    futurePurchasingPower: Math.round(futurePower * 100) / 100,
    cumulativeInflationPercent: Math.round((factor - 1) * 1000) / 10,
  };
}

export interface SalesTaxInput {
  amount: number;
  taxRatePercent: number;
  mode: 'add_tax' | 'remove_tax';
}

export interface SalesTaxResult {
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
}

export function calculateSalesTax(input: SalesTaxInput): SalesTaxResult {
  const amt = Math.max(0, input.amount);
  const rate = Math.max(0, input.taxRatePercent) / 100;

  if (input.mode === 'add_tax') {
    const tax = amt * rate;
    return {
      netAmount: Math.round(amt * 100) / 100,
      taxAmount: Math.round(tax * 100) / 100,
      grossAmount: Math.round((amt + tax) * 100) / 100,
    };
  }

  // remove tax: gross = net * (1 + rate) => net = gross / (1 + rate)
  const net = amt / (1 + rate);
  const tax = amt - net;
  return {
    netAmount: Math.round(net * 100) / 100,
    taxAmount: Math.round(tax * 100) / 100,
    grossAmount: Math.round(amt * 100) / 100,
  };
}

export interface IncomeTaxInput {
  grossAnnualIncome: number;
  regime: 'us_single' | 'uk_standard' | 'in_new' | 'in_old' | 'generic';
  deductions?: number;
}

export interface IncomeTaxResult {
  grossIncome: number;
  taxableIncome: number;
  totalTax: number;
  effectiveTaxRate: number;
  netTakeHomePay: number;
  monthlyTakeHome: number;
  bracketBreakdown: { bracket: string; rate: string; amount: number; taxInBracket?: number }[];
  disclaimer: string;
  // Aliases for compatibility
  effectiveTaxRatePercent: number;
  netAnnualTakeHome: number;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const gross = Math.max(0, input.grossAnnualIncome);
  const deductions = Math.max(0, input.deductions || 0);
  const disclaimer =
    'Educational estimate only. Does not account for state/local taxes, FICA/National Insurance, or personalized deductions. Consult an authorized tax professional.';

  let taxable = Math.max(0, gross - deductions);
  let totalTax = 0;
  const bracketBreakdown: { bracket: string; rate: string; amount: number }[] = [];

  if (input.regime === 'us_single') {
    // 2024 US Federal standard single brackets
    const standardDeduction = 14600;
    taxable = Math.max(0, gross - Math.max(deductions, standardDeduction));
    const brackets = [
      { cap: 11600, rate: 0.10, label: 'Up to $11,600' },
      { cap: 47150, rate: 0.12, label: '$11,600 - $47,150' },
      { cap: 100525, rate: 0.22, label: '$47,150 - $100,525' },
      { cap: 191950, rate: 0.24, label: '$100,525 - $191,950' },
      { cap: 243725, rate: 0.32, label: '$191,950 - $243,725' },
      { cap: 609350, rate: 0.35, label: '$243,725 - $609,350' },
      { cap: Infinity, rate: 0.37, label: 'Over $609,350' },
    ];
    let prev = 0;
    for (const b of brackets) {
      if (taxable > prev) {
        const taxableInBracket = Math.min(taxable, b.cap) - prev;
        const taxInBracket = taxableInBracket * b.rate;
        totalTax += taxInBracket;
        bracketBreakdown.push({ bracket: b.label, rate: `${b.rate * 100}%`, amount: Math.round(taxInBracket) });
        prev = b.cap;
      }
    }
  } else if (input.regime === 'uk_standard') {
    // UK Tax (Personal Allowance £12,570)
    const allowance = 12570;
    taxable = Math.max(0, gross - allowance);
    const brackets = [
      { cap: 37700, rate: 0.20, label: 'Basic Rate (£12,570 - £50,270)' },
      { cap: 112430, rate: 0.40, label: 'Higher Rate (£50,271 - £125,140)' },
      { cap: Infinity, rate: 0.45, label: 'Additional Rate (Over £125,140)' },
    ];
    let prev = 0;
    for (const b of brackets) {
      if (taxable > prev) {
        const chunk = Math.min(taxable, b.cap) - prev;
        const taxChunk = chunk * b.rate;
        totalTax += taxChunk;
        bracketBreakdown.push({ bracket: b.label, rate: `${b.rate * 100}%`, amount: Math.round(taxChunk) });
        prev = b.cap;
      }
    }
  } else if (input.regime === 'in_new') {
    // India New Tax Regime (Section 115BAC) standard slab
    const stdDed = 75000;
    taxable = Math.max(0, gross - stdDed);
    if (taxable <= 700000) {
      // Full rebate under 87A
      totalTax = 0;
      bracketBreakdown.push({ bracket: 'Up to ₹7,00,000 (Section 87A Full Rebate)', rate: '0%', amount: 0 });
    } else {
      const slabs = [
        { cap: 300000, rate: 0, label: 'Up to ₹3,00,000' },
        { cap: 700000, rate: 0.05, label: '₹3,00,000 - ₹7,00,000' },
        { cap: 1000000, rate: 0.10, label: '₹7,00,000 - ₹10,00,000' },
        { cap: 1200000, rate: 0.15, label: '₹10,00,000 - ₹12,00,000' },
        { cap: 1500000, rate: 0.20, label: '₹12,00,000 - ₹15,00,000' },
        { cap: Infinity, rate: 0.30, label: 'Above ₹15,00,000' },
      ];
      let prev = 0;
      for (const s of slabs) {
        if (taxable > prev) {
          const chunk = Math.min(taxable, s.cap) - prev;
          const taxChunk = chunk * s.rate;
          totalTax += taxChunk;
          if (taxChunk > 0) {
            bracketBreakdown.push({ bracket: s.label, rate: `${s.rate * 100}%`, amount: Math.round(taxChunk) });
          }
          prev = s.cap;
        }
      }
      // 4% Health & Education Cess
      totalTax = totalTax * 1.04;
    }
  } else if (input.regime === 'in_old') {
    // India Old Tax Regime (Standard deduction ₹50k + 80C/80D/HRA)
    const stdDed = 50000;
    const totalDed = Math.max(stdDed, deductions);
    taxable = Math.max(0, gross - totalDed);
    const slabs = [
      { cap: 250000, rate: 0, label: 'Up to ₹2,50,000' },
      { cap: 500000, rate: 0.05, label: '₹2,50,001 - ₹5,00,000' },
      { cap: 1000000, rate: 0.20, label: '₹5,00,001 - ₹10,00,000' },
      { cap: Infinity, rate: 0.30, label: 'Above ₹10,00,000' },
    ];
    let prev = 0;
    for (const s of slabs) {
      if (taxable > prev) {
        const chunk = Math.min(taxable, s.cap) - prev;
        const taxChunk = chunk * s.rate;
        totalTax += taxChunk;
        if (taxChunk > 0) {
          bracketBreakdown.push({ bracket: s.label, rate: `${s.rate * 100}%`, amount: Math.round(taxChunk) });
        }
        prev = s.cap;
      }
    }
    // 87A rebate for taxable <= 5,00,000 (max ₹12,500)
    if (taxable <= 500000) {
      const rebate = Math.min(12500, totalTax);
      totalTax = Math.max(0, totalTax - rebate);
      if (rebate > 0) {
        bracketBreakdown.push({ bracket: 'Section 87A Full Rebate', rate: 'Rebate', amount: -Math.round(rebate) });
      }
    }
    // 4% Health & Education Cess
    totalTax = totalTax * 1.04;
  } else {
    // Generic Progressive Tax
    const slabs = [
      { cap: 20000, rate: 0.05, label: 'Tier 1' },
      { cap: 60000, rate: 0.15, label: 'Tier 2' },
      { cap: 120000, rate: 0.25, label: 'Tier 3' },
      { cap: Infinity, rate: 0.35, label: 'Top Tier' },
    ];
    let prev = 0;
    for (const s of slabs) {
      if (taxable > prev) {
        const chunk = Math.min(taxable, s.cap) - prev;
        const taxChunk = chunk * s.rate;
        totalTax += taxChunk;
        bracketBreakdown.push({ bracket: s.label, rate: `${s.rate * 100}%`, amount: Math.round(taxChunk) });
        prev = s.cap;
      }
    }
  }

  totalTax = Math.round(totalTax);
  const netTakeHomePay = Math.max(0, gross - totalTax);
  const effectiveTaxRate = gross > 0 ? Math.round((totalTax / gross) * 1000) / 10 : 0;

  const formattedBrackets = bracketBreakdown.map((b) => ({
    ...b,
    taxInBracket: b.amount,
  }));

  return {
    grossIncome: gross,
    taxableIncome: Math.round(taxable),
    totalTax,
    effectiveTaxRate,
    netTakeHomePay,
    monthlyTakeHome: Math.round(netTakeHomePay / 12),
    bracketBreakdown: formattedBrackets,
    disclaimer,
    effectiveTaxRatePercent: effectiveTaxRate,
    netAnnualTakeHome: netTakeHomePay,
  };
}

export interface SavingsGoalInput {
  targetAmount: number;
  initialDeposit?: number;
  annualInterestRatePercent?: number; // e.g. 7%
  timeYears: number;
}

export interface SavingsGoalResult {
  monthlySavingsRequired: number;
  totalPrincipalSaved: number;
  totalInterestEarned: number;
  futureValue: number;
  progressMilestones: { year: number; balance: number; contributions: number; interest: number }[];
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const target = Math.max(0, input.targetAmount || 0);
  const initial = Math.max(0, input.initialDeposit || 0);
  const years = Math.max(0.1, input.timeYears || 1);
  const months = Math.round(years * 12);
  const annualRate = Math.max(0, input.annualInterestRatePercent || 0) / 100;
  const monthlyRate = annualRate / 12;

  let monthlySavings = 0;
  if (monthlyRate === 0) {
    monthlySavings = Math.max(0, (target - initial) / months);
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, months);
    const numerator = target - initial * compoundFactor;
    if (numerator <= 0) {
      monthlySavings = 0;
    } else {
      const annuityFactor = (compoundFactor - 1) / monthlyRate;
      monthlySavings = numerator / annuityFactor;
    }
  }

  monthlySavings = Math.round(monthlySavings * 100) / 100;
  const totalMonthlyContributed = monthlySavings * months;
  const totalPrincipalSaved = Math.round((initial + totalMonthlyContributed) * 100) / 100;
  const totalInterestEarned = Math.max(0, Math.round((target - totalPrincipalSaved) * 100) / 100);

  const milestones: { year: number; balance: number; contributions: number; interest: number }[] = [];
  let balance = initial;
  let totalContributed = initial;
  const totalWholeYears = Math.ceil(years);
  for (let y = 1; y <= totalWholeYears; y++) {
    const monthsInThisYear = Math.min(12, Math.max(0, months - (y - 1) * 12));
    for (let m = 0; m < monthsInThisYear; m++) {
      balance = balance * (1 + monthlyRate) + monthlySavings;
      totalContributed += monthlySavings;
    }
    milestones.push({
      year: y,
      balance: Math.round(balance),
      contributions: Math.round(totalContributed),
      interest: Math.round(Math.max(0, balance - totalContributed)),
    });
  }

  return {
    monthlySavingsRequired: monthlySavings,
    totalPrincipalSaved,
    totalInterestEarned,
    futureValue: target,
    progressMilestones: milestones,
  };
}

// ==========================================
// FD CALCULATOR (Fixed Deposit)
// ==========================================
export interface FDInput {
  principal: number;
  annualRate: number; // e.g. 7.5 (%)
  totalMonths: number; // total months
  compoundingFrequency: number; // 1 = Annually, 2 = Half-yearly, 4 = Quarterly, 12 = Monthly
}

export interface FDResult {
  principal: number;
  totalInterest: number;
  maturityAmount: number;
  effectiveAnnualYield: number; // %
  schedule: {
    period: number;
    label: string;
    openingBalance: number;
    interestAccrued: number;
    closingBalance: number;
  }[];
}

export function calculateFD(input: FDInput): FDResult {
  const P = Math.max(0, input.principal);
  const r = Math.max(0, input.annualRate) / 100;
  const totalMonths = Math.max(1, input.totalMonths);
  const t = totalMonths / 12; // tenure in years
  const n = Math.max(1, input.compoundingFrequency);

  // Compound Interest Formula for FD: A = P * (1 + r/n)^(n * t)
  const maturityAmount = P * Math.pow(1 + r / n, n * t);
  const totalInterest = maturityAmount - P;

  // Effective annual return rate
  const effectiveAnnualYield = t > 0 && P > 0 ? (Math.pow(maturityAmount / P, 1 / t) - 1) * 100 : 0;

  // Schedule breakdown
  const schedule = [];
  const totalPeriods = Math.ceil(t);
  let currentBal = P;

  for (let y = 1; y <= totalPeriods; y++) {
    const elapsedMonths = Math.min(y * 12, totalMonths);
    const elapsedYears = elapsedMonths / 12;
    const closing = P * Math.pow(1 + r / n, n * elapsedYears);
    const interestAccrued = closing - currentBal;

    schedule.push({
      period: y,
      label: `Year ${y}`,
      openingBalance: Math.round(currentBal),
      interestAccrued: Math.round(interestAccrued),
      closingBalance: Math.round(closing),
    });
    currentBal = closing;
  }

  return {
    principal: Math.round(P),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(maturityAmount),
    effectiveAnnualYield: Math.round(effectiveAnnualYield * 100) / 100,
    schedule,
  };
}

// ==========================================
// RD CALCULATOR (Recurring Deposit)
// ==========================================
export interface RDInput {
  monthlyDeposit: number;
  annualRate: number; // %
  totalMonths: number; // N installments
  compoundingFrequency: number; // 4 = Quarterly (standard bank RD), 12 = Monthly, 1 = Annually, 2 = Half-Yearly
}

export interface RDResult {
  monthlyDeposit: number;
  totalDeposits: number;
  totalInterest: number;
  maturityAmount: number;
  effectiveAnnualReturn: number;
  schedule: {
    month: number;
    monthlyDeposit: number;
    cumulativeDeposits: number;
    interestEarnedMonth: number;
    cumulativeInterest: number;
    closingBalance: number;
  }[];
}

export function calculateRD(input: RDInput): RDResult {
  const P = Math.max(0, input.monthlyDeposit);
  const R = Math.max(0, input.annualRate);
  const N = Math.max(1, input.totalMonths);
  const n = Math.max(1, input.compoundingFrequency); // default 4 for quarterly bank RD
  const r = R / 100;

  let totalMaturity = 0;
  const schedule = [];
  let cumDeposits = 0;

  // Indian Bank / Post Office standard formula (Quarterly compounding of monthly deposits):
  // Each k-th deposit made at month k (k = 1..N) stays for m = (N - k + 1) months.
  // Value of k-th deposit = P * (1 + r/n)^( (N - k + 1) * n / 12 )
  for (let k = 1; k <= N; k++) {
    const monthsInvested = N - k + 1;
    const depositVal = P * Math.pow(1 + r / n, (monthsInvested * n) / 12);
    totalMaturity += depositVal;
  }

  // Monthly progressive schedule calculation
  for (let m = 1; m <= N; m++) {
    cumDeposits += P;
    let balanceAtM = 0;
    for (let k = 1; k <= m; k++) {
      const monthsInvested = m - k + 1;
      balanceAtM += P * Math.pow(1 + r / n, (monthsInvested * n) / 12);
    }
    const cumInterest = balanceAtM - cumDeposits;
    const prevBalance = m > 1 ? schedule[m - 2].closingBalance + P : P;
    const interestThisMonth = balanceAtM - prevBalance;

    schedule.push({
      month: m,
      monthlyDeposit: Math.round(P),
      cumulativeDeposits: Math.round(cumDeposits),
      interestEarnedMonth: Math.round(Math.max(0, interestThisMonth)),
      cumulativeInterest: Math.round(Math.max(0, cumInterest)),
      closingBalance: Math.round(balanceAtM),
    });
  }

  const totalDeposits = P * N;
  const totalInterest = totalMaturity - totalDeposits;
  const years = N / 12;
  const effectiveAnnualReturn = years > 0 && totalDeposits > 0
    ? (Math.pow(totalMaturity / totalDeposits, 1 / years) - 1) * 100
    : 0;

  return {
    monthlyDeposit: Math.round(P),
    totalDeposits: Math.round(totalDeposits),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(totalMaturity),
    effectiveAnnualReturn: Math.round(effectiveAnnualReturn * 100) / 100,
    schedule,
  };
}

// ==========================================
// ANNUITY CALCULATOR
// ==========================================
export interface AnnuityInput {
  mode: 'payout' | 'present_value' | 'future_value'; // Payout calculation, Required starting lump sum, or Future accumulated balance
  startingPrincipal: number; // For payout / future value
  periodicPayment: number; // For present_value / future_value
  annualInterestRate: number; // % e.g. 6.5
  tenureYears: number; // Duration in years
  paymentFrequency: number; // 12 = Monthly, 4 = Quarterly, 2 = Semi-Annually, 1 = Annually
  annuityType: 'ordinary' | 'due'; // ordinary = end of period, due = beginning of period
}

export interface AnnuityResult {
  mode: 'payout' | 'present_value' | 'future_value';
  periodicPayment: number;
  startingPrincipal: number;
  futureValue: number;
  totalPayments: number;
  totalInterest: number;
  effectiveAnnualRate: number;
  schedule: {
    period: number;
    label: string;
    openingBalance: number;
    payment: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculateAnnuity(input: AnnuityInput): AnnuityResult {
  const mode = input.mode || 'payout';
  const r = Math.max(0, input.annualInterestRate) / 100;
  const freq = Math.max(1, input.paymentFrequency || 12);
  const years = Math.max(0.1, input.tenureYears || 10);
  const n = Math.round(years * freq);
  const i = r / freq; // periodic interest rate
  const isDue = input.annuityType === 'due';
  const dueFactor = isDue ? 1 + i : 1;

  let periodicPayment = 0;
  let startingPrincipal = 0;
  let futureValue = 0;
  let totalPayments = 0;
  let totalInterest = 0;
  const schedule = [];

  if (mode === 'payout') {
    // Starting with lump sum PV, calculate sustainable periodic payout PMT
    const PV = Math.max(0, input.startingPrincipal || 100000);
    startingPrincipal = PV;

    if (i === 0) {
      periodicPayment = n > 0 ? PV / n : 0;
    } else {
      // PV = PMT * [ (1 - (1+i)^-n) / i ] * (isDue ? 1+i : 1)
      const pvifa = ((1 - Math.pow(1 + i, -n)) / i) * dueFactor;
      periodicPayment = pvifa > 0 ? PV / pvifa : 0;
    }

    totalPayments = periodicPayment * n;
    totalInterest = Math.max(0, totalPayments - PV);
    futureValue = 0;

    let balance = PV;
    for (let p = 1; p <= n; p++) {
      const open = balance;
      let interest = 0;
      let pmt = periodicPayment;

      if (isDue) {
        // Payment happens at beginning
        const afterPmt = Math.max(0, open - pmt);
        interest = afterPmt * i;
        balance = Math.max(0, afterPmt + interest);
      } else {
        // Payment happens at end of period
        interest = open * i;
        balance = Math.max(0, open + interest - pmt);
      }

      // Group schedule into yearly or periodic milestones if large
      schedule.push({
        period: p,
        label: freq === 12 ? `Month ${p}` : freq === 4 ? `Q${p}` : `Year ${p}`,
        openingBalance: Math.round(open),
        payment: Math.round(pmt),
        interestEarned: Math.round(interest),
        closingBalance: Math.round(balance),
      });
    }
  } else if (mode === 'present_value') {
    // Want a target periodic payout PMT, calculate required starting PV
    const PMT = Math.max(0, input.periodicPayment || 1000);
    periodicPayment = PMT;

    if (i === 0) {
      startingPrincipal = PMT * n;
    } else {
      const pvifa = ((1 - Math.pow(1 + i, -n)) / i) * dueFactor;
      startingPrincipal = PMT * pvifa;
    }

    totalPayments = PMT * n;
    totalInterest = Math.max(0, totalPayments - startingPrincipal);
    futureValue = 0;

    let balance = startingPrincipal;
    for (let p = 1; p <= n; p++) {
      const open = balance;
      let interest = 0;
      if (isDue) {
        const afterPmt = Math.max(0, open - PMT);
        interest = afterPmt * i;
        balance = Math.max(0, afterPmt + interest);
      } else {
        interest = open * i;
        balance = Math.max(0, open + interest - PMT);
      }
      schedule.push({
        period: p,
        label: freq === 12 ? `Month ${p}` : freq === 4 ? `Q${p}` : `Year ${p}`,
        openingBalance: Math.round(open),
        payment: Math.round(PMT),
        interestEarned: Math.round(interest),
        closingBalance: Math.round(balance),
      });
    }
  } else {
    // Future Value (Accumulation Annuity): Regular deposits PMT accumulating with interest to FV
    const PMT = Math.max(0, input.periodicPayment || 500);
    const initialDeposit = Math.max(0, input.startingPrincipal || 0);
    periodicPayment = PMT;
    startingPrincipal = initialDeposit;

    let balance = initialDeposit;
    for (let p = 1; p <= n; p++) {
      const open = balance;
      let interest = 0;
      if (isDue) {
        // deposit at beginning, then interest
        interest = (open + PMT) * i;
        balance = open + PMT + interest;
      } else {
        // interest on balance, then deposit at end
        interest = open * i;
        balance = open + interest + PMT;
      }
      schedule.push({
        period: p,
        label: freq === 12 ? `Month ${p}` : freq === 4 ? `Q${p}` : `Year ${p}`,
        openingBalance: Math.round(open),
        payment: Math.round(PMT),
        interestEarned: Math.round(interest),
        closingBalance: Math.round(balance),
      });
    }

    totalPayments = initialDeposit + PMT * n;
    futureValue = balance;
    totalInterest = Math.max(0, futureValue - totalPayments);
  }

  return {
    mode,
    periodicPayment: Math.round(periodicPayment * 100) / 100,
    startingPrincipal: Math.round(startingPrincipal),
    futureValue: Math.round(futureValue),
    totalPayments: Math.round(totalPayments),
    totalInterest: Math.round(totalInterest),
    effectiveAnnualRate: Math.round(((Math.pow(1 + i, freq) - 1) * 100) * 100) / 100,
    schedule: schedule.slice(0, 120), // capped for clean performance
  };
}



