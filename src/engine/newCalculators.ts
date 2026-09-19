/**
 * Deterministic calculation engines for new high-value calculators
 * Pure TypeScript, zero side effects, independently testable.
 */

// 1. NET WORTH CALCULATOR
export interface NetWorthAssets {
  cash?: number;
  investments?: number;
  realEstate?: number;
  retirement?: number;
  vehicles?: number;
  other?: number;
}

export interface NetWorthLiabilities {
  mortgages?: number;
  autoLoans?: number;
  studentLoans?: number;
  creditCards?: number;
  personalLoans?: number;
  other?: number;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
  assetBreakdown: { label: string; value: number; percentage: number }[];
  liabilityBreakdown: { label: string; value: number; percentage: number }[];
}

export function calculateNetWorth(
  assets: NetWorthAssets,
  liabilities: NetWorthLiabilities
): NetWorthResult {
  const assetItems = [
    { label: 'Cash & Savings', value: assets.cash || 0 },
    { label: 'Investment Portfolio', value: assets.investments || 0 },
    { label: 'Real Estate', value: assets.realEstate || 0 },
    { label: 'Retirement Accounts', value: assets.retirement || 0 },
    { label: 'Vehicles', value: assets.vehicles || 0 },
    { label: 'Other Assets', value: assets.other || 0 },
  ];

  const liabilityItems = [
    { label: 'Mortgages', value: liabilities.mortgages || 0 },
    { label: 'Auto Loans', value: liabilities.autoLoans || 0 },
    { label: 'Student Loans', value: liabilities.studentLoans || 0 },
    { label: 'Credit Card Debt', value: liabilities.creditCards || 0 },
    { label: 'Personal Loans', value: liabilities.personalLoans || 0 },
    { label: 'Other Debts', value: liabilities.other || 0 },
  ];

  const totalAssets = assetItems.reduce((sum, item) => sum + item.value, 0);
  const totalLiabilities = liabilityItems.reduce((sum, item) => sum + item.value, 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  const assetBreakdown = assetItems
    .filter((i) => i.value > 0)
    .map((i) => ({
      ...i,
      percentage: totalAssets > 0 ? Math.round((i.value / totalAssets) * 1000) / 10 : 0,
    }));

  const liabilityBreakdown = liabilityItems
    .filter((i) => i.value > 0)
    .map((i) => ({
      ...i,
      percentage: totalLiabilities > 0 ? Math.round((i.value / totalLiabilities) * 1000) / 10 : 0,
    }));

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtToAssetRatio: Math.round(debtToAssetRatio * 10) / 10,
    assetBreakdown,
    liabilityBreakdown,
  };
}

// 2. SAVINGS RATE CALCULATOR
export interface SavingsRateInput {
  grossMonthlyIncome: number;
  monthlySavings: number;
  monthlyTaxes?: number;
}

export interface SavingsRateResult {
  grossSavingsRate: number;
  netSavingsRate: number;
  annualSavings: number;
  annualIncome: number;
  monthlyLivingExpenses: number;
}

export function calculateSavingsRate(input: SavingsRateInput): SavingsRateResult {
  const { grossMonthlyIncome, monthlySavings, monthlyTaxes = 0 } = input;
  if (grossMonthlyIncome <= 0) {
    return {
      grossSavingsRate: 0,
      netSavingsRate: 0,
      annualSavings: 0,
      annualIncome: 0,
      monthlyLivingExpenses: 0,
    };
  }

  const grossSavingsRate = (monthlySavings / grossMonthlyIncome) * 100;
  const netIncome = Math.max(0, grossMonthlyIncome - monthlyTaxes);
  const netSavingsRate = netIncome > 0 ? (monthlySavings / netIncome) * 100 : grossSavingsRate;
  const annualSavings = monthlySavings * 12;
  const annualIncome = grossMonthlyIncome * 12;
  const monthlyLivingExpenses = Math.max(0, grossMonthlyIncome - monthlyTaxes - monthlySavings);

  return {
    grossSavingsRate: Math.round(grossSavingsRate * 10) / 10,
    netSavingsRate: Math.round(netSavingsRate * 10) / 10,
    annualSavings,
    annualIncome,
    monthlyLivingExpenses,
  };
}

// 3. DEBT-TO-INCOME (DTI) CALCULATOR
export interface DTIInput {
  grossMonthlyIncome: number;
  monthlyHousingExpense: number; // mortgage or rent
  otherMonthlyDebtPayments: number; // loans, credit cards, etc.
}

export interface DTIResult {
  frontEndDti: number;
  backEndDti: number;
  totalMonthlyDebt: number;
  status: 'good' | 'manageable' | 'high' | 'critical';
  statusLabel: string;
  recommendation: string;
}

export function calculateDTI(input: DTIInput): DTIResult {
  const { grossMonthlyIncome, monthlyHousingExpense, otherMonthlyDebtPayments } = input;
  if (grossMonthlyIncome <= 0) {
    return {
      frontEndDti: 0,
      backEndDti: 0,
      totalMonthlyDebt: 0,
      status: 'good',
      statusLabel: 'No Data',
      recommendation: 'Enter monthly income to compute DTI.',
    };
  }

  const totalMonthlyDebt = monthlyHousingExpense + otherMonthlyDebtPayments;
  const frontEndDti = (monthlyHousingExpense / grossMonthlyIncome) * 100;
  const backEndDti = (totalMonthlyDebt / grossMonthlyIncome) * 100;

  let status: DTIResult['status'] = 'good';
  let statusLabel = 'Healthy (≤ 36%)';
  let recommendation = 'Your debt levels are within favorable limits for most lenders.';

  if (backEndDti > 50) {
    status = 'critical';
    statusLabel = 'Critical (> 50%)';
    recommendation = 'High debt obligations; lenders generally reject new borrowing at this level.';
  } else if (backEndDti > 43) {
    status = 'high';
    statusLabel = 'High (43% - 50%)';
    recommendation = 'Exceeds standard Qualified Mortgage thresholds; debt payoff should be prioritized.';
  } else if (backEndDti > 36) {
    status = 'manageable';
    statusLabel = 'Moderate (37% - 43%)';
    recommendation = 'Acceptable for many conventional loans, but leaves narrower budget margins.';
  }

  return {
    frontEndDti: Math.round(frontEndDti * 10) / 10,
    backEndDti: Math.round(backEndDti * 10) / 10,
    totalMonthlyDebt,
    status,
    statusLabel,
    recommendation,
  };
}

// 4. FUTURE VALUE CALCULATOR
export interface FutureValueInput {
  presentValue: number;
  periodicPayment: number;
  annualRatePercent: number;
  years: number;
  compoundFrequency?: number; // 1 = yearly, 12 = monthly
  paymentTiming?: 'beginning' | 'end';
}

export interface FutureValueResult {
  futureValue: number;
  totalInvested: number;
  totalInterestEarned: number;
  fvOfInitialDeposit: number;
  fvOfContributions: number;
}

export function calculateFutureValue(input: FutureValueInput): FutureValueResult {
  const {
    presentValue,
    periodicPayment,
    annualRatePercent,
    years,
    compoundFrequency = 12,
    paymentTiming = 'end',
  } = input;

  const totalPeriods = Math.round(years * compoundFrequency);
  const periodicRate = annualRatePercent / 100 / compoundFrequency;
  const totalContributed = periodicPayment * totalPeriods;
  const totalInvested = presentValue + totalContributed;

  if (periodicRate === 0 || totalPeriods === 0) {
    return {
      futureValue: totalInvested,
      totalInvested,
      totalInterestEarned: 0,
      fvOfInitialDeposit: presentValue,
      fvOfContributions: totalContributed,
    };
  }

  const growthFactor = Math.pow(1 + periodicRate, totalPeriods);
  const fvOfInitialDeposit = presentValue * growthFactor;

  let fvOfContributions = periodicPayment * ((growthFactor - 1) / periodicRate);
  if (paymentTiming === 'beginning') {
    fvOfContributions *= (1 + periodicRate);
  }

  const futureValue = fvOfInitialDeposit + fvOfContributions;
  const totalInterestEarned = Math.max(0, futureValue - totalInvested);

  return {
    futureValue: Math.round(futureValue),
    totalInvested: Math.round(totalInvested),
    totalInterestEarned: Math.round(totalInterestEarned),
    fvOfInitialDeposit: Math.round(fvOfInitialDeposit),
    fvOfContributions: Math.round(fvOfContributions),
  };
}

// 5. PRESENT VALUE CALCULATOR
export interface PresentValueInput {
  futureValue: number;
  periodicPayment?: number;
  annualRatePercent: number;
  years: number;
  compoundFrequency?: number;
}

export interface PresentValueResult {
  presentValue: number;
  discountAmount: number;
  discountRatePercent: number;
}

export function calculatePresentValue(input: PresentValueInput): PresentValueResult {
  const {
    futureValue,
    annualRatePercent,
    years,
    compoundFrequency = 12,
  } = input;

  const totalPeriods = Math.round(years * compoundFrequency);
  const periodicRate = annualRatePercent / 100 / compoundFrequency;

  if (periodicRate === 0 || totalPeriods === 0) {
    return {
      presentValue: futureValue,
      discountAmount: 0,
      discountRatePercent: 0,
    };
  }

  const discountFactor = Math.pow(1 + periodicRate, totalPeriods);
  const presentValue = futureValue / discountFactor;
  const discountAmount = Math.max(0, futureValue - presentValue);

  return {
    presentValue: Math.round(presentValue),
    discountAmount: Math.round(discountAmount),
    discountRatePercent: annualRatePercent,
  };
}

// 6. REAL RATE OF RETURN CALCULATOR
export interface RealReturnInput {
  nominalRatePercent: number;
  inflationRatePercent: number;
  investmentAmount?: number;
  years?: number;
}

export interface RealReturnResult {
  realRatePercent: number;
  nominalFutureValue?: number;
  realFutureValue?: number;
  purchasingPowerLoss?: number;
}

export function calculateRealRateOfReturn(input: RealReturnInput): RealReturnResult {
  const { nominalRatePercent, inflationRatePercent, investmentAmount, years } = input;
  const nominalDecimal = nominalRatePercent / 100;
  const inflationDecimal = inflationRatePercent / 100;

  // Exact Fisher equation: (1 + r_nominal) = (1 + r_real) * (1 + i)
  const realDecimal = (1 + nominalDecimal) / (1 + inflationDecimal) - 1;
  const realRatePercent = Math.round(realDecimal * 10000) / 100;

  if (investmentAmount && investmentAmount > 0 && years && years > 0) {
    const nominalFV = investmentAmount * Math.pow(1 + nominalDecimal, years);
    const realFV = investmentAmount * Math.pow(1 + realDecimal, years);
    const purchasingPowerLoss = Math.max(0, nominalFV - realFV);

    return {
      realRatePercent,
      nominalFutureValue: Math.round(nominalFV),
      realFutureValue: Math.round(realFV),
      purchasingPowerLoss: Math.round(purchasingPowerLoss),
    };
  }

  return {
    realRatePercent,
  };
}

// 7. COAST FIRE CALCULATOR
export interface CoastFIREInput {
  currentAge: number;
  targetRetirementAge: number;
  annualRetirementExpenses: number;
  currentSavings: number;
  expectedReturnRatePercent: number;
  safeWithdrawalRatePercent?: number; // default 4%
}

export interface CoastFIREResult {
  yearsToGrow: number;
  targetRetirementCorpus: number;
  requiredCoastAmount: number;
  hasReachedCoast: boolean;
  difference: number;
  projectedCorpusAtRetirement: number;
}

export function calculateCoastFIRE(input: CoastFIREInput): CoastFIREResult {
  const {
    currentAge,
    targetRetirementAge,
    annualRetirementExpenses,
    currentSavings,
    expectedReturnRatePercent,
    safeWithdrawalRatePercent = 4,
  } = input;

  const yearsToGrow = Math.max(0, targetRetirementAge - currentAge);
  const swr = (safeWithdrawalRatePercent || 4) / 100;
  const targetRetirementCorpus = swr > 0 ? annualRetirementExpenses / swr : 0;

  const growthFactor = Math.pow(1 + expectedReturnRatePercent / 100, yearsToGrow);
  const requiredCoastAmount = growthFactor > 0 ? targetRetirementCorpus / growthFactor : targetRetirementCorpus;
  const projectedCorpusAtRetirement = currentSavings * growthFactor;
  const difference = currentSavings - requiredCoastAmount;
  const hasReachedCoast = currentSavings >= requiredCoastAmount;

  return {
    yearsToGrow,
    targetRetirementCorpus: Math.round(targetRetirementCorpus),
    requiredCoastAmount: Math.round(requiredCoastAmount),
    hasReachedCoast,
    difference: Math.round(difference),
    projectedCorpusAtRetirement: Math.round(projectedCorpusAtRetirement),
  };
}

// 8. DIVIDEND YIELD CALCULATOR
export interface DividendYieldInput {
  stockPrice: number;
  annualDividendPerShare: number;
  sharesOwned?: number;
}

export interface DividendYieldResult {
  dividendYieldPercent: number;
  annualDividendIncome: number;
  monthlyDividendIncome: number;
  totalPortfolioValue: number;
}

export function calculateDividendYield(input: DividendYieldInput): DividendYieldResult {
  const { stockPrice, annualDividendPerShare, sharesOwned = 0 } = input;
  if (stockPrice <= 0) {
    return {
      dividendYieldPercent: 0,
      annualDividendIncome: 0,
      monthlyDividendIncome: 0,
      totalPortfolioValue: 0,
    };
  }

  const dividendYieldPercent = (annualDividendPerShare / stockPrice) * 100;
  const annualDividendIncome = sharesOwned * annualDividendPerShare;
  const monthlyDividendIncome = annualDividendIncome / 12;
  const totalPortfolioValue = sharesOwned * stockPrice;

  return {
    dividendYieldPercent: Math.round(dividendYieldPercent * 100) / 100,
    annualDividendIncome: Math.round(annualDividendIncome),
    monthlyDividendIncome: Math.round(monthlyDividendIncome),
    totalPortfolioValue: Math.round(totalPortfolioValue),
  };
}

// 9. STOCK AVERAGE PRICE CALCULATOR
export interface StockLot {
  shares: number;
  price: number;
}

export interface StockAverageResult {
  totalShares: number;
  totalInvestment: number;
  averagePrice: number;
}

export function calculateStockAveragePrice(lots: StockLot[]): StockAverageResult {
  let totalShares = 0;
  let totalInvestment = 0;

  for (const lot of lots) {
    if (lot.shares > 0 && lot.price > 0) {
      totalShares += lot.shares;
      totalInvestment += lot.shares * lot.price;
    }
  }

  const averagePrice = totalShares > 0 ? totalInvestment / totalShares : 0;

  return {
    totalShares,
    totalInvestment: Math.round(totalInvestment * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
  };
}

// 10. STOCK PROFIT/LOSS CALCULATOR
export interface StockProfitLossInput {
  buyPrice: number;
  sellPrice: number;
  shares: number;
  commission?: number;
}

export interface StockProfitLossResult {
  totalCost: number;
  totalProceeds: number;
  netProfit: number;
  roiPercent: number;
  isProfit: boolean;
}

export function calculateStockProfitLoss(input: StockProfitLossInput): StockProfitLossResult {
  const { buyPrice, sellPrice, shares, commission = 0 } = input;
  const totalCost = buyPrice * shares + commission;
  const totalProceeds = sellPrice * shares;
  const netProfit = totalProceeds - totalCost;
  const roiPercent = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    totalProceeds: Math.round(totalProceeds * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    roiPercent: Math.round(roiPercent * 100) / 100,
    isProfit: netProfit >= 0,
  };
}

// 11. SALARY INCREASE CALCULATOR
export interface SalaryIncreaseInput {
  currentSalary: number;
  newSalary: number;
}

export interface SalaryIncreaseResult {
  absoluteIncrease: number;
  percentageIncrease: number;
  monthlyIncrease: number;
  biweeklyIncrease: number;
}

export function calculateSalaryIncrease(input: SalaryIncreaseInput): SalaryIncreaseResult {
  const { currentSalary, newSalary } = input;
  const absoluteIncrease = newSalary - currentSalary;
  const percentageIncrease = currentSalary > 0 ? (absoluteIncrease / currentSalary) * 100 : 0;

  return {
    absoluteIncrease: Math.round(absoluteIncrease),
    percentageIncrease: Math.round(percentageIncrease * 100) / 100,
    monthlyIncrease: Math.round((absoluteIncrease / 12) * 100) / 100,
    biweeklyIncrease: Math.round((absoluteIncrease / 26) * 100) / 100,
  };
}

// 12. OVERTIME PAY CALCULATOR
export interface OvertimeInput {
  hourlyRate: number;
  regularHours: number;
  overtimeHours: number;
  overtimeMultiplier?: number; // default 1.5
}

export interface OvertimeResult {
  regularPay: number;
  overtimePay: number;
  totalPay: number;
  effectiveHourlyRate: number;
}

export function calculateOvertimePay(input: OvertimeInput): OvertimeResult {
  const { hourlyRate, regularHours, overtimeHours, overtimeMultiplier = 1.5 } = input;
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * (hourlyRate * overtimeMultiplier);
  const totalPay = regularPay + overtimePay;
  const totalHours = regularHours + overtimeHours;
  const effectiveHourlyRate = totalHours > 0 ? totalPay / totalHours : hourlyRate;

  return {
    regularPay: Math.round(regularPay * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    totalPay: Math.round(totalPay * 100) / 100,
    effectiveHourlyRate: Math.round(effectiveHourlyRate * 100) / 100,
  };
}

// 13. MARKUP CALCULATOR
export interface MarkupInput {
  cost: number;
  sellingPrice?: number;
  markupPercent?: number;
}

export interface MarkupResult {
  cost: number;
  sellingPrice: number;
  grossProfit: number;
  markupPercent: number;
  grossMarginPercent: number;
}

export function calculateMarkup(input: MarkupInput): MarkupResult {
  const { cost, sellingPrice, markupPercent } = input;

  if (cost > 0 && typeof sellingPrice === 'number' && sellingPrice > 0) {
    const grossProfit = sellingPrice - cost;
    const computedMarkup = (grossProfit / cost) * 100;
    const computedMargin = (grossProfit / sellingPrice) * 100;
    return {
      cost,
      sellingPrice,
      grossProfit: Math.round(grossProfit * 100) / 100,
      markupPercent: Math.round(computedMarkup * 100) / 100,
      grossMarginPercent: Math.round(computedMargin * 100) / 100,
    };
  }

  if (cost > 0 && typeof markupPercent === 'number') {
    const grossProfit = cost * (markupPercent / 100);
    const computedSellingPrice = cost + grossProfit;
    const computedMargin = computedSellingPrice > 0 ? (grossProfit / computedSellingPrice) * 100 : 0;
    return {
      cost,
      sellingPrice: Math.round(computedSellingPrice * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      markupPercent: Math.round(markupPercent * 100) / 100,
      grossMarginPercent: Math.round(computedMargin * 100) / 100,
    };
  }

  return {
    cost: cost || 0,
    sellingPrice: sellingPrice || 0,
    grossProfit: 0,
    markupPercent: 0,
    grossMarginPercent: 0,
  };
}

// 14. ONE REP MAX (1RM) CALCULATOR
export interface OneRepMaxResult {
  oneRepMax: number;
  percentages: { percentage: number; weight: number; repsEstimate: number }[];
}

export function calculateOneRepMax(weight: number, reps: number): OneRepMaxResult {
  if (weight <= 0 || reps <= 0) {
    return { oneRepMax: 0, percentages: [] };
  }

  // Epley formula: 1RM = weight * (1 + reps / 30)
  const oneRepMax = reps === 1 ? weight : Math.round(weight * (1 + reps / 30) * 10) / 10;

  const percentageTiers = [
    { percentage: 95, repsEstimate: 2 },
    { percentage: 90, repsEstimate: 4 },
    { percentage: 85, repsEstimate: 6 },
    { percentage: 80, repsEstimate: 8 },
    { percentage: 75, repsEstimate: 10 },
    { percentage: 70, repsEstimate: 12 },
    { percentage: 65, repsEstimate: 15 },
  ];

  const percentages = percentageTiers.map((tier) => ({
    ...tier,
    weight: Math.round(oneRepMax * (tier.percentage / 100) * 10) / 10,
  }));

  return {
    oneRepMax,
    percentages,
  };
}

// 15. BODY SURFACE AREA (BSA) CALCULATOR
export function calculateBodySurfaceArea(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 0;
  // Mosteller formula: BSA (m²) = sqrt((height(cm) * weight(kg)) / 3600)
  const bsa = Math.sqrt((heightCm * weightKg) / 3600);
  return Math.round(bsa * 100) / 100;
}

// 16. PERCENT CHANGE CALCULATOR
export interface PercentChangeResult {
  absoluteChange: number;
  percentageChange: number;
  multiplier: number;
  direction: 'increase' | 'decrease' | 'neutral';
}

export function calculatePercentChange(initialValue: number, finalValue: number): PercentChangeResult {
  const absoluteChange = finalValue - initialValue;
  const percentageChange = initialValue !== 0 ? (absoluteChange / Math.abs(initialValue)) * 100 : 0;
  const multiplier = initialValue !== 0 ? finalValue / initialValue : 0;
  const direction = absoluteChange > 0 ? 'increase' : absoluteChange < 0 ? 'decrease' : 'neutral';

  return {
    absoluteChange: Math.round(absoluteChange * 100) / 100,
    percentageChange: Math.round(percentageChange * 100) / 100,
    multiplier: Math.round(multiplier * 1000) / 1000,
    direction,
  };
}

// 17. QUADRATIC EQUATION CALCULATOR
export interface QuadraticResult {
  discriminant: number;
  type: 'two_real' | 'one_real' | 'complex' | 'linear';
  root1: { real: number; imaginary?: number };
  root2?: { real: number; imaginary?: number };
}

export function calculateQuadratic(a: number, b: number, c: number): QuadraticResult {
  if (a === 0) {
    const root = b !== 0 ? -c / b : 0;
    return {
      discriminant: 0,
      type: 'linear',
      root1: { real: Math.round(root * 10000) / 10000 },
    };
  }

  const discriminant = b * b - 4 * a * c;

  if (discriminant > 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return {
      discriminant,
      type: 'two_real',
      root1: { real: Math.round(r1 * 10000) / 10000 },
      root2: { real: Math.round(r2 * 10000) / 10000 },
    };
  }

  if (discriminant === 0) {
    const r = -b / (2 * a);
    return {
      discriminant: 0,
      type: 'one_real',
      root1: { real: Math.round(r * 10000) / 10000 },
    };
  }

  const realPart = -b / (2 * a);
  const imagPart = Math.sqrt(-discriminant) / (2 * a);
  return {
    discriminant,
    type: 'complex',
    root1: { real: Math.round(realPart * 10000) / 10000, imaginary: Math.round(Math.abs(imagPart) * 10000) / 10000 },
    root2: { real: Math.round(realPart * 10000) / 10000, imaginary: -Math.round(Math.abs(imagPart) * 10000) / 10000 },
  };
}

// 18. LCM & GCD CALCULATOR
export function calculateGCD(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

export function calculateLCM(a: number, b: number): number {
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));
  if (x === 0 || y === 0) return 0;
  return (x * y) / calculateGCD(x, y);
}

// 19. DOWN PAYMENT CALCULATOR
export interface DownPaymentResult {
  homePrice: number;
  downPaymentAmount: number;
  downPaymentPercent: number;
  loanAmount: number;
  pmiRequired: boolean;
}

export function calculateDownPayment(
  homePrice: number,
  downPaymentAmount?: number,
  downPaymentPercent?: number
): DownPaymentResult {
  if (homePrice <= 0) {
    return { homePrice: 0, downPaymentAmount: 0, downPaymentPercent: 0, loanAmount: 0, pmiRequired: false };
  }

  let amount = 0;
  let percent = 0;

  if (typeof downPaymentAmount === 'number' && downPaymentAmount >= 0) {
    amount = downPaymentAmount;
    percent = (amount / homePrice) * 100;
  } else if (typeof downPaymentPercent === 'number' && downPaymentPercent >= 0) {
    percent = downPaymentPercent;
    amount = homePrice * (percent / 100);
  }

  const loanAmount = Math.max(0, homePrice - amount);
  const pmiRequired = percent < 20;

  return {
    homePrice,
    downPaymentAmount: Math.round(amount),
    downPaymentPercent: Math.round(percent * 10) / 10,
    loanAmount: Math.round(loanAmount),
    pmiRequired,
  };
}

// 20. HOME EQUITY CALCULATOR
export interface HomeEquityResult {
  propertyValue: number;
  mortgageBalance: number;
  equityAmount: number;
  equityPercent: number;
  ltvPercent: number;
  maxBorrowableCashOut: number; // typically up to 80% LTV
}

export function calculateHomeEquity(propertyValue: number, mortgageBalance: number): HomeEquityResult {
  if (propertyValue <= 0) {
    return {
      propertyValue: 0,
      mortgageBalance: 0,
      equityAmount: 0,
      equityPercent: 0,
      ltvPercent: 0,
      maxBorrowableCashOut: 0,
    };
  }

  const equityAmount = Math.max(0, propertyValue - mortgageBalance);
  const equityPercent = (equityAmount / propertyValue) * 100;
  const ltvPercent = (mortgageBalance / propertyValue) * 100;
  const maxBorrowableCashOut = Math.max(0, propertyValue * 0.8 - mortgageBalance);

  return {
    propertyValue,
    mortgageBalance,
    equityAmount: Math.round(equityAmount),
    equityPercent: Math.round(equityPercent * 10) / 10,
    ltvPercent: Math.round(ltvPercent * 10) / 10,
    maxBorrowableCashOut: Math.round(maxBorrowableCashOut),
  };
}
