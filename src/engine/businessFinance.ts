/**
 * Business Finance & Corporate Metrics Calculation Engines
 * 1. GST Calculator (Forward & Reverse with CGST/SGST/IGST breakdown)
 * 2. Margins (Gross Margin, Operating Margin, Net Profit Margin, Markup)
 * 3. Break-Even Analysis
 * 4. Working Capital & Liquidity Ratios (Current Ratio, Quick Ratio)
 * 5. Cash Conversion Cycle (DIO + DSO - DPO)
 * 6. Startup Burn Rate & Runway
 * 7. DSCR (Debt Service Coverage Ratio)
 * 8. Business Loan Calculator
 * 9. Revenue Growth Calculator
 */

/**
 * 1. GST Calculator (Goods & Services Tax)
 */
export interface GSTInput {
  amount: number;
  gstRate: number; // e.g. 5, 12, 18, 28%
  type: 'add_gst' | 'remove_gst'; // Inclusive vs Exclusive
  isInterstate?: boolean; // IGST vs CGST+SGST
}

export interface GSTResult {
  netAmount: number;
  gstAmount: number;
  totalGrossAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  effectiveRate: number;
}

export function calculateGST(input: GSTInput): GSTResult {
  const amt = Math.max(0, input.amount);
  const rate = Math.max(0, input.gstRate);
  const isInterstate = !!input.isInterstate;

  let net = 0;
  let gst = 0;
  let gross = 0;

  if (input.type === 'add_gst') {
    net = amt;
    gst = (net * rate) / 100;
    gross = net + gst;
  } else {
    gross = amt;
    net = (gross * 100) / (100 + rate);
    gst = gross - net;
  }

  const igst = isInterstate ? gst : 0;
  const cgst = isInterstate ? 0 : gst / 2;
  const sgst = isInterstate ? 0 : gst / 2;

  return {
    netAmount: Math.round(net * 100) / 100,
    gstAmount: Math.round(gst * 100) / 100,
    totalGrossAmount: Math.round(gross * 100) / 100,
    cgstAmount: Math.round(cgst * 100) / 100,
    sgstAmount: Math.round(sgst * 100) / 100,
    igstAmount: Math.round(igst * 100) / 100,
    effectiveRate: rate,
  };
}

/**
 * 2. Margins & Markup Calculator
 */
export interface MarginInput {
  revenue: number;
  costOfGoodsSold: number;
  operatingExpenses?: number;
  taxesAndInterest?: number;
}

export interface MarginResult {
  grossProfit: number;
  grossMarginPercentage: number;
  operatingProfit: number;
  operatingMarginPercentage: number;
  netProfit: number;
  netProfitMarginPercentage: number;
  markupPercentage: number;
}

export function calculateMargins(input: MarginInput): MarginResult {
  const rev = Math.max(0, input.revenue);
  const cogs = Math.max(0, input.costOfGoodsSold);
  const opex = Math.max(0, input.operatingExpenses || 0);
  const taxInt = Math.max(0, input.taxesAndInterest || 0);

  const grossProfit = rev - cogs;
  const operatingProfit = grossProfit - opex;
  const netProfit = operatingProfit - taxInt;

  const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
  const opMargin = rev > 0 ? (operatingProfit / rev) * 100 : 0;
  const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
  const markup = cogs > 0 ? (grossProfit / cogs) * 100 : 0;

  return {
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMarginPercentage: Math.round(grossMargin * 100) / 100,
    operatingProfit: Math.round(operatingProfit * 100) / 100,
    operatingMarginPercentage: Math.round(opMargin * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    netProfitMarginPercentage: Math.round(netMargin * 100) / 100,
    markupPercentage: Math.round(markup * 100) / 100,
  };
}

/**
 * 3. Break-Even Analysis Calculator
 */
export interface BreakEvenInput {
  fixedCosts: number;
  sellingPricePerUnit: number;
  variableCostPerUnit: number;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMarginPerUnit: number;
  contributionMarginRatio: number;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fc = Math.max(0, input.fixedCosts);
  const sp = Math.max(0, input.sellingPricePerUnit);
  const vc = Math.max(0, input.variableCostPerUnit);

  const cm = Math.max(0, sp - vc);
  const cmRatio = sp > 0 ? cm / sp : 0;
  const beUnits = cm > 0 ? Math.ceil(fc / cm) : 0;
  const beRevenue = beUnits * sp;

  return {
    breakEvenUnits: beUnits,
    breakEvenRevenue: Math.round(beRevenue * 100) / 100,
    contributionMarginPerUnit: Math.round(cm * 100) / 100,
    contributionMarginRatio: Math.round(cmRatio * 1000) / 10,
  };
}

/**
 * 4. Working Capital & Liquidity Ratios
 */
export interface WorkingCapitalInput {
  currentAssets: number;
  currentLiabilities: number;
  inventory?: number;
  prepaidExpenses?: number;
}

export interface WorkingCapitalResult {
  workingCapital: number;
  currentRatio: number;
  quickRatio: number;
  liquidityAssessment: 'strong' | 'adequate' | 'risky';
}

export function calculateWorkingCapital(input: WorkingCapitalInput): WorkingCapitalResult {
  const ca = Math.max(0, input.currentAssets);
  const cl = Math.max(0, input.currentLiabilities);
  const inv = Math.max(0, input.inventory || 0);
  const prepaid = Math.max(0, input.prepaidExpenses || 0);

  const wc = ca - cl;
  const cr = cl > 0 ? ca / cl : 0;
  const quickAssets = Math.max(0, ca - inv - prepaid);
  const qr = cl > 0 ? quickAssets / cl : 0;

  let status: 'strong' | 'adequate' | 'risky' = 'adequate';
  if (cr >= 2 && qr >= 1) status = 'strong';
  else if (cr < 1 || qr < 0.8) status = 'risky';

  return {
    workingCapital: Math.round(wc),
    currentRatio: Math.round(cr * 100) / 100,
    quickRatio: Math.round(qr * 100) / 100,
    liquidityAssessment: status,
  };
}

/**
 * 5. Cash Conversion Cycle (CCC = DIO + DSO - DPO)
 */
export interface CashConversionCycleInput {
  daysSalesOutstanding_DSO: number; // Receivable days
  daysInventoryOutstanding_DIO: number; // Inventory days
  daysPayableOutstanding_DPO: number; // Payable days
}

export interface CashConversionCycleResult {
  cashConversionCycleDays: number;
  operatingCycleDays: number;
  workingCapitalEfficiency: 'highly_efficient' | 'standard' | 'capital_intensive';
}

export function calculateCashConversionCycle(input: CashConversionCycleInput): CashConversionCycleResult {
  const dso = Math.max(0, input.daysSalesOutstanding_DSO);
  const dio = Math.max(0, input.daysInventoryOutstanding_DIO);
  const dpo = Math.max(0, input.daysPayableOutstanding_DPO);

  const operatingCycle = dio + dso;
  const ccc = operatingCycle - dpo;

  return {
    cashConversionCycleDays: Math.round(ccc * 10) / 10,
    operatingCycleDays: Math.round(operatingCycle * 10) / 10,
    workingCapitalEfficiency: ccc <= 30 ? 'highly_efficient' : ccc <= 75 ? 'standard' : 'capital_intensive',
  };
}

/**
 * 6. Startup Burn Rate & Runway Calculator
 */
export interface BurnRateInput {
  cashBalance: number;
  monthlyRevenue: number;
  monthlyOperatingExpenses: number;
}

export interface BurnRateResult {
  grossBurnRateMonthly: number;
  netBurnRateMonthly: number;
  runwayMonths: number;
  isCashflowPositive: boolean;
  zeroCashDateString: string;
}

export function calculateBurnRate(input: BurnRateInput): BurnRateResult {
  const cash = Math.max(0, input.cashBalance);
  const rev = Math.max(0, input.monthlyRevenue);
  const exp = Math.max(0, input.monthlyOperatingExpenses);

  const grossBurn = exp;
  const netBurn = Math.max(0, exp - rev);
  const isProfitable = rev >= exp;
  const runwayMonths = isProfitable ? Infinity : netBurn > 0 ? Math.round((cash / netBurn) * 10) / 10 : 0;

  const now = new Date();
  const zeroDate = new Date(now.getFullYear(), now.getMonth() + (isFinite(runwayMonths) ? Math.floor(runwayMonths) : 0), now.getDate());

  return {
    grossBurnRateMonthly: Math.round(grossBurn),
    netBurnRateMonthly: Math.round(netBurn),
    runwayMonths: isFinite(runwayMonths) ? runwayMonths : 999,
    isCashflowPositive: isProfitable,
    zeroCashDateString: isProfitable ? 'Cash Flow Positive' : zeroDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  };
}

/**
 * 7. DSCR Calculator (Debt Service Coverage Ratio)
 * DSCR = Net Operating Income (NOI) / Total Debt Service (Principal + Interest)
 */
export interface DSCRInput {
  netOperatingIncome: number;
  annualPrincipalRepayments: number;
  annualInterestPayments: number;
}

export interface DSCRResult {
  dscrRatio: number;
  totalDebtService: number;
  lenderAssessment: 'approved_strong' | 'acceptable' | 'high_risk_rejection';
}

export function calculateDSCR(input: DSCRInput): DSCRResult {
  const noi = Number(input.netOperatingIncome) || 0;
  const principal = Number(input.annualPrincipalRepayments) || 0;
  const interest = Number(input.annualInterestPayments) || 0;
  const debt = Math.max(0, principal + interest);
  const dscr = debt > 0 ? noi / debt : (noi > 0 ? 999 : 0);

  let assessment: 'approved_strong' | 'acceptable' | 'high_risk_rejection' = 'acceptable';
  if (dscr >= 1.25) assessment = 'approved_strong';
  else if (dscr < 1.0) assessment = 'high_risk_rejection';
  else assessment = 'acceptable';

  return {
    dscrRatio: Math.round(dscr * 100) / 100,
    totalDebtService: Math.round(debt),
    lenderAssessment: assessment,
  };
}

/**
 * 8. Revenue Growth Calculator (YoY / MoM)
 */
export interface RevenueGrowthInput {
  previousPeriodRevenue: number;
  currentPeriodRevenue: number;
}

export interface RevenueGrowthResult {
  absoluteGrowth: number;
  percentageGrowth: number;
  growthMultiplier: number;
}

export function calculateRevenueGrowth(input: RevenueGrowthInput): RevenueGrowthResult {
  const prev = Math.max(0, input.previousPeriodRevenue);
  const curr = Math.max(0, input.currentPeriodRevenue);

  const absGrowth = curr - prev;
  const pctGrowth = prev > 0 ? (absGrowth / prev) * 100 : 0;
  const mult = prev > 0 ? curr / prev : 0;

  return {
    absoluteGrowth: Math.round(absGrowth * 100) / 100,
    percentageGrowth: Math.round(pctGrowth * 100) / 100,
    growthMultiplier: Math.round(mult * 100) / 100,
  };
}

/**
 * 9. Revenue Calculator
 */
export interface RevenueInput {
  quantity: number;
  sellingPrice: number;
}

export interface RevenueResult {
  totalRevenue: number;
  averageRevenuePerUnit: number;
}

export function calculateRevenue(input: RevenueInput): RevenueResult {
  const qty = Math.max(0, input.quantity);
  const price = Math.max(0, input.sellingPrice);

  const totalRevenue = qty * price;
  const avgRev = qty > 0 ? totalRevenue / qty : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    averageRevenuePerUnit: Math.round(avgRev * 100) / 100,
  };
}

/**
 * 10. Markup Calculator
 */
export interface MarkupInput {
  cost: number;
  sellingPrice: number;
}

export interface MarkupResult {
  markupAmount: number;
  markupPercentage: number;
  sellingPrice: number;
  cost: number;
}

export function calculateMarkup(input: MarkupInput): MarkupResult {
  const c = Math.max(0, input.cost);
  const sp = Math.max(0, input.sellingPrice);

  const markupAmount = sp - c;
  const markupPct = c > 0 ? (markupAmount / c) * 100 : 0;

  return {
    markupAmount: Math.round(markupAmount * 100) / 100,
    markupPercentage: Math.round(markupPct * 100) / 100,
    sellingPrice: sp,
    cost: c,
  };
}

/**
 * 11. Contribution Margin Calculator
 */
export interface ContributionMarginInput {
  revenue: number;
  variableCosts: number;
  quantity?: number;
}

export interface ContributionMarginResult {
  contributionMargin: number;
  contributionMarginPercentage: number;
  variableCostPercentage: number;
  contributionPerUnit: number;
}

export function calculateContributionMargin(input: ContributionMarginInput): ContributionMarginResult {
  const rev = Math.max(0, input.revenue);
  const vc = Math.max(0, input.variableCosts);
  const qty = input.quantity && input.quantity > 0 ? input.quantity : null;

  const cm = rev - vc;
  const cmPct = rev > 0 ? (cm / rev) * 100 : 0;
  const vcPct = rev > 0 ? (vc / rev) * 100 : 0;
  const cmPerUnit = qty ? cm / qty : 0;

  return {
    contributionMargin: Math.round(cm * 100) / 100,
    contributionMarginPercentage: Math.round(cmPct * 100) / 100,
    variableCostPercentage: Math.round(vcPct * 100) / 100,
    contributionPerUnit: Math.round(cmPerUnit * 100) / 100,
  };
}

/**
 * 12. Business Valuation Calculator
 */
export type ValuationMethod = 'revenue_multiple' | 'ebitda_multiple' | 'earnings_multiple';

export interface BusinessValuationInput {
  method: ValuationMethod;
  metricValue: number;
  multiple: number;
}

export interface BusinessValuationResult {
  method: ValuationMethod;
  metricValue: number;
  multiple: number;
  estimatedValuation: number;
}

export function calculateBusinessValuation(input: BusinessValuationInput): BusinessValuationResult {
  const metric = Math.max(0, input.metricValue);
  const mult = Math.max(0, input.multiple);

  const valuation = metric * mult;

  return {
    method: input.method,
    metricValue: metric,
    multiple: mult,
    estimatedValuation: Math.round(valuation * 100) / 100,
  };
}

/**
 * 13. Inventory Turnover Calculator
 */
export interface InventoryTurnoverInput {
  costOfGoodsSold: number;
  averageInventory: number;
  daysInPeriod?: number; // e.g. 365, 90, etc.
}

export interface InventoryTurnoverResult {
  inventoryTurnoverRatio: number;
  daysInventoryOutstanding: number;
}

export function calculateInventoryTurnover(input: InventoryTurnoverInput): InventoryTurnoverResult {
  const cogs = Math.max(0, input.costOfGoodsSold);
  const avgInv = Math.max(0, input.averageInventory);
  const days = Math.max(1, input.daysInPeriod || 365);

  const turnover = avgInv > 0 ? cogs / avgInv : 0;
  const dio = turnover > 0 ? days / turnover : 0;

  return {
    inventoryTurnoverRatio: Math.round(turnover * 100) / 100,
    daysInventoryOutstanding: Math.round(dio * 10) / 10,
  };
}

/**
 * 14. Receivables Turnover Calculator
 */
export interface ReceivablesTurnoverInput {
  netCreditSales: number;
  averageAccountsReceivable: number;
  daysInPeriod?: number;
}

export interface ReceivablesTurnoverResult {
  receivablesTurnoverRatio: number;
  daysSalesOutstanding: number;
}

export function calculateReceivablesTurnover(input: ReceivablesTurnoverInput): ReceivablesTurnoverResult {
  const sales = Math.max(0, input.netCreditSales);
  const avgAr = Math.max(0, input.averageAccountsReceivable);
  const days = Math.max(1, input.daysInPeriod || 365);

  const turnover = avgAr > 0 ? sales / avgAr : 0;
  const dso = turnover > 0 ? days / turnover : 0;

  return {
    receivablesTurnoverRatio: Math.round(turnover * 100) / 100,
    daysSalesOutstanding: Math.round(dso * 10) / 10,
  };
}

/**
 * 15. Payables Turnover Calculator
 */
export interface PayablesTurnoverInput {
  creditPurchases: number;
  averageAccountsPayable: number;
  daysInPeriod?: number;
}

export interface PayablesTurnoverResult {
  payablesTurnoverRatio: number;
  daysPayableOutstanding: number;
}

export function calculatePayablesTurnover(input: PayablesTurnoverInput): PayablesTurnoverResult {
  const purchases = Math.max(0, input.creditPurchases);
  const avgAp = Math.max(0, input.averageAccountsPayable);
  const days = Math.max(1, input.daysInPeriod || 365);

  const turnover = avgAp > 0 ? purchases / avgAp : 0;
  const dpo = turnover > 0 ? days / turnover : 0;

  return {
    payablesTurnoverRatio: Math.round(turnover * 100) / 100,
    daysPayableOutstanding: Math.round(dpo * 10) / 10,
  };
}

/**
 * 16. Pricing Calculator
 */
export interface PricingInput {
  cost: number;
  targetProfitMarginPercentage: number;
}

export interface PricingResult {
  sellingPrice: number;
  markupPercentage: number;
  profitAmount: number;
}

export function calculatePricing(input: PricingInput): PricingResult {
  const c = Math.max(0, input.cost);
  const targetMargin = Math.min(99.99, Math.max(0, input.targetProfitMarginPercentage)) / 100;

  const sellingPrice = targetMargin < 1 ? c / (1 - targetMargin) : c;
  const profit = sellingPrice - c;
  const markupPct = c > 0 ? (profit / c) * 100 : 0;

  return {
    sellingPrice: Math.round(sellingPrice * 100) / 100,
    markupPercentage: Math.round(markupPct * 100) / 100,
    profitAmount: Math.round(profit * 100) / 100,
  };
}

/**
 * 17. Profit Target Calculator
 */
export interface ProfitTargetInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  sellingPricePerUnit: number;
  targetProfit: number;
}

export interface ProfitTargetResult {
  contributionPerUnit: number;
  requiredUnits: number;
  requiredRevenue: number;
  isFeasible: boolean;
}

export function calculateTargetProfit(input: ProfitTargetInput): ProfitTargetResult {
  const fc = Math.max(0, input.fixedCosts);
  const vc = Math.max(0, input.variableCostPerUnit);
  const sp = Math.max(0, input.sellingPricePerUnit);
  const tp = Math.max(0, input.targetProfit);

  const contribution = sp - vc;
  const isFeasible = contribution > 0;
  const requiredUnits = isFeasible ? (fc + tp) / contribution : 0;
  const requiredRevenue = requiredUnits * sp;

  return {
    contributionPerUnit: Math.round(contribution * 100) / 100,
    requiredUnits: isFeasible ? Math.ceil(requiredUnits) : 0,
    requiredRevenue: Math.round(requiredRevenue * 100) / 100,
    isFeasible,
  };
}
