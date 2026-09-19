/**
 * Tax Calculation Engines
 * India Income Tax (New vs Old Regime), Slabs, Surcharge, Cess, HRA, 80C, 80D, Capital Gains, TDS, 44AD/44ADA & ESOPs.
 */

/**
 * 1. New Tax Regime (FY 2024-25 / 2025-26 Budget Updates)
 * Slabs:
 * Up to ₹3,00,000: Nil
 * ₹3,00,001 to ₹7,00,000: 5%
 * ₹7,00,001 to ₹10,00,000: 10%
 * ₹10,00,001 to ₹12,00,000: 15%
 * ₹12,00,001 to ₹15,00,000: 20%
 * Above ₹15,00,000: 30%
 * Standard Deduction for Salaried: ₹75,000
 * Section 87A Rebate: Full tax rebate if taxable income <= ₹7,00,000 (i.e. Gross <= ₹7,75,000 for salaried)
 * Health & Education Cess: 4%
 */
export interface TaxCalculationInput {
  annualGrossIncome: number;
  isSalaried?: boolean;
  standardDeduction?: number;
  section80C?: number; // Old regime only
  section80D?: number; // Old regime only
  hraExemption?: number; // Old regime only
  homeLoanInterest80EEA_24b?: number; // Old regime only
  otherDeductions80CCD_80G?: number; // Old regime only
  npsEmployerContribution80CCD2?: number; // Allowed in BOTH regimes (up to 14% basic/salary)
}

export interface TaxRegimeOutput {
  grossIncome: number;
  grossSalary: number; // Compatibility alias
  standardDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netTaxableIncome: number;
  taxableIncome: number; // Compatibility alias
  slabTaxBeforeRebate: number;
  section87ARebate: number;
  taxAfterRebate: number;
  surchargeAmount: number;
  healthAndEducationCess: number;
  cess: number; // Compatibility alias
  totalTaxPayable: number;
  effectiveTaxRate: number;
  takeHomeAnnual: number;
  takeHomeMonthly: number;
  slabBreakdown: {
    slab: string;
    bracket: string;
    rate: string;
    taxableInSlab: number;
    tax: number;
    taxInSlab: number;
  }[];
}

export function calculateNewRegimeTax(input: TaxCalculationInput): TaxRegimeOutput {
  const gross = Math.max(0, input.annualGrossIncome);
  const stdDed = input.isSalaried !== false ? (input.standardDeduction !== undefined ? input.standardDeduction : 75000) : 0;
  const nps80CCD2 = Math.max(0, input.npsEmployerContribution80CCD2 || 0);

  const totalDeductions = stdDed + nps80CCD2;
  const taxableIncome = Math.max(0, gross - totalDeductions);

  let slabTax = 0;
  const slabBreakdown = [];

  // Slab 0: Up to 3L (0%)
  const s1 = Math.min(taxableIncome, 300000);
  slabBreakdown.push({
    slab: 'Up to ₹3,00,000',
    bracket: 'Up to ₹3,00,000',
    rate: '0%',
    taxableInSlab: Math.round(s1),
    tax: 0,
    taxInSlab: 0,
  });

  // Slab 1: 3L - 7L (5%)
  const s2 = taxableIncome > 300000 ? Math.min(taxableIncome - 300000, 400000) : 0;
  const tax2 = s2 * 0.05;
  slabTax += tax2;
  slabBreakdown.push({
    slab: '₹3,00,001 - ₹7,00,000',
    bracket: '₹3,00,001 - ₹7,00,000',
    rate: '5%',
    taxableInSlab: Math.round(s2),
    tax: Math.round(tax2),
    taxInSlab: Math.round(tax2),
  });

  // Slab 2: 7L - 10L (10%)
  const s3 = taxableIncome > 700000 ? Math.min(taxableIncome - 700000, 300000) : 0;
  const tax3 = s3 * 0.10;
  slabTax += tax3;
  slabBreakdown.push({
    slab: '₹7,00,001 - ₹10,00,000',
    bracket: '₹7,00,001 - ₹10,00,000',
    rate: '10%',
    taxableInSlab: Math.round(s3),
    tax: Math.round(tax3),
    taxInSlab: Math.round(tax3),
  });

  // Slab 3: 10L - 12L (15%)
  const s4 = taxableIncome > 1000000 ? Math.min(taxableIncome - 1000000, 200000) : 0;
  const tax4 = s4 * 0.15;
  slabTax += tax4;
  slabBreakdown.push({
    slab: '₹10,00,001 - ₹12,00,000',
    bracket: '₹10,00,001 - ₹12,00,000',
    rate: '15%',
    taxableInSlab: Math.round(s4),
    tax: Math.round(tax4),
    taxInSlab: Math.round(tax4),
  });

  // Slab 4: 12L - 15L (20%)
  const s5 = taxableIncome > 1200000 ? Math.min(taxableIncome - 1200000, 300000) : 0;
  const tax5 = s5 * 0.20;
  slabTax += tax5;
  slabBreakdown.push({
    slab: '₹12,00,001 - ₹15,00,000',
    bracket: '₹12,00,001 - ₹15,00,000',
    rate: '20%',
    taxableInSlab: Math.round(s5),
    tax: Math.round(tax5),
    taxInSlab: Math.round(tax5),
  });

  // Slab 5: Above 15L (30%)
  const s6 = taxableIncome > 1500000 ? taxableIncome - 1500000 : 0;
  const tax6 = s6 * 0.30;
  slabTax += tax6;
  slabBreakdown.push({
    slab: 'Above ₹15,00,000',
    bracket: 'Above ₹15,00,000',
    rate: '30%',
    taxableInSlab: Math.round(s6),
    tax: Math.round(tax6),
    taxInSlab: Math.round(tax6),
  });

  // 87A Rebate: if taxable <= 7,00,000, tax is 0
  let rebate87A = 0;
  if (taxableIncome <= 700000) {
    rebate87A = slabTax;
  }
  const taxAfterRebate = Math.max(0, slabTax - rebate87A);

  // Surcharge in New Regime:
  // 50L - 1Cr: 10%, 1Cr - 2Cr: 15%, >2Cr: 25% (capped at 25% in new regime)
  let surchargeRate = 0;
  if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.10;

  const surchargeAmount = taxAfterRebate * surchargeRate;
  const cess = (taxAfterRebate + surchargeAmount) * 0.04;
  const totalTax = taxAfterRebate + surchargeAmount + cess;

  return {
    grossIncome: Math.round(gross),
    grossSalary: Math.round(gross),
    standardDeduction: Math.round(stdDed),
    otherDeductions: Math.round(nps80CCD2),
    totalDeductions: Math.round(totalDeductions),
    netTaxableIncome: Math.round(taxableIncome),
    taxableIncome: Math.round(taxableIncome),
    slabTaxBeforeRebate: Math.round(slabTax),
    section87ARebate: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    surchargeAmount: Math.round(surchargeAmount),
    healthAndEducationCess: Math.round(cess),
    cess: Math.round(cess),
    totalTaxPayable: Math.round(totalTax),
    effectiveTaxRate: gross > 0 ? Math.round((totalTax / gross) * 10000) / 100 : 0,
    takeHomeAnnual: Math.round(gross - totalTax),
    takeHomeMonthly: Math.round((gross - totalTax) / 12),
    slabBreakdown,
  };
}

/**
 * 2. Old Tax Regime
 * Slabs:
 * Up to ₹2.5L: Nil
 * 2.5L - 5L: 5%
 * 5L - 10L: 20%
 * Above 10L: 30%
 * Standard Deduction: ₹50,000
 * 87A Rebate: if taxable <= 5,00,000, max ₹12,500 rebate
 */
export function calculateOldRegimeTax(input: TaxCalculationInput): TaxRegimeOutput {
  const gross = Math.max(0, input.annualGrossIncome);
  const stdDed = input.isSalaried !== false ? (input.standardDeduction !== undefined ? input.standardDeduction : 50000) : 0;
  const c80 = Math.min(150000, Math.max(0, input.section80C || 0));
  const d80 = Math.min(100000, Math.max(0, input.section80D || 0));
  const hra = Math.max(0, input.hraExemption || 0);
  const s24b = Math.min(200000, Math.max(0, input.homeLoanInterest80EEA_24b || 0));
  const other = Math.max(0, input.otherDeductions80CCD_80G || 0);
  const nps80CCD2 = Math.max(0, input.npsEmployerContribution80CCD2 || 0);

  const otherDeductions = c80 + d80 + hra + s24b + other + nps80CCD2;
  const totalDeductions = stdDed + otherDeductions;
  const taxableIncome = Math.max(0, gross - totalDeductions);

  let slabTax = 0;
  const slabBreakdown = [];

  // Up to 2.5L
  const s1 = Math.min(taxableIncome, 250000);
  slabBreakdown.push({
    slab: 'Up to ₹2,50,000',
    bracket: 'Up to ₹2,50,000',
    rate: '0%',
    taxableInSlab: Math.round(s1),
    tax: 0,
    taxInSlab: 0,
  });

  // 2.5L to 5L (5%)
  const s2 = taxableIncome > 250000 ? Math.min(taxableIncome - 250000, 250000) : 0;
  const tax2 = s2 * 0.05;
  slabTax += tax2;
  slabBreakdown.push({
    slab: '₹2,50,001 - ₹5,00,000',
    bracket: '₹2,50,001 - ₹5,00,000',
    rate: '5%',
    taxableInSlab: Math.round(s2),
    tax: Math.round(tax2),
    taxInSlab: Math.round(tax2),
  });

  // 5L to 10L (20%)
  const s3 = taxableIncome > 500000 ? Math.min(taxableIncome - 500000, 500000) : 0;
  const tax3 = s3 * 0.20;
  slabTax += tax3;
  slabBreakdown.push({
    slab: '₹5,00,001 - ₹10,00,000',
    bracket: '₹5,00,001 - ₹10,00,000',
    rate: '20%',
    taxableInSlab: Math.round(s3),
    tax: Math.round(tax3),
    taxInSlab: Math.round(tax3),
  });

  // Above 10L (30%)
  const s4 = taxableIncome > 1000000 ? taxableIncome - 1000000 : 0;
  const tax4 = s4 * 0.30;
  slabTax += tax4;
  slabBreakdown.push({
    slab: 'Above ₹10,00,000',
    bracket: 'Above ₹10,00,000',
    rate: '30%',
    taxableInSlab: Math.round(s4),
    tax: Math.round(tax4),
    taxInSlab: Math.round(tax4),
  });

  // 87A rebate
  let rebate87A = 0;
  if (taxableIncome <= 500000) {
    rebate87A = Math.min(12500, slabTax);
  }
  const taxAfterRebate = Math.max(0, slabTax - rebate87A);

  let surchargeRate = 0;
  if (taxableIncome > 50000000) surchargeRate = 0.37;
  else if (taxableIncome > 20000000) surchargeRate = 0.25;
  else if (taxableIncome > 10000000) surchargeRate = 0.15;
  else if (taxableIncome > 5000000) surchargeRate = 0.10;

  const surchargeAmount = taxAfterRebate * surchargeRate;
  const cess = (taxAfterRebate + surchargeAmount) * 0.04;
  const totalTax = taxAfterRebate + surchargeAmount + cess;

  return {
    grossIncome: Math.round(gross),
    grossSalary: Math.round(gross),
    standardDeduction: Math.round(stdDed),
    otherDeductions: Math.round(otherDeductions),
    totalDeductions: Math.round(totalDeductions),
    netTaxableIncome: Math.round(taxableIncome),
    taxableIncome: Math.round(taxableIncome),
    slabTaxBeforeRebate: Math.round(slabTax),
    section87ARebate: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    surchargeAmount: Math.round(surchargeAmount),
    healthAndEducationCess: Math.round(cess),
    cess: Math.round(cess),
    totalTaxPayable: Math.round(totalTax),
    effectiveTaxRate: gross > 0 ? Math.round((totalTax / gross) * 10000) / 100 : 0,
    takeHomeAnnual: Math.round(gross - totalTax),
    takeHomeMonthly: Math.round((gross - totalTax) / 12),
    slabBreakdown,
  };
}

/**
 * 3. Old vs New Tax Regime Comparison & Break-Even Deductions
 */
export interface OldVsNewComparisonResult {
  newRegime: TaxRegimeOutput;
  oldRegime: TaxRegimeOutput;
  newRegimeTax: number; // Direct access to new regime total tax payable
  oldRegimeTax: number; // Direct access to old regime total tax payable
  taxDifference: number; // New - Old (positive means Old regime saves tax)
  recommendedRegime: 'new' | 'old' | 'equal';
  taxSaved: number;
  breakEvenDeductionsRequired: number; // Total deductions in old regime needed to equal new regime tax
  breakEvenDeductionNeeded: number; // Alias for breakEvenDeductionsRequired
}

export function compareOldVsNewTaxRegimes(input: TaxCalculationInput): OldVsNewComparisonResult {
  const newRes = calculateNewRegimeTax(input);
  const oldRes = calculateOldRegimeTax(input);

  const diff = newRes.totalTaxPayable - oldRes.totalTaxPayable;

  // Calculate Break-Even deductions iteratively
  const targetTax = newRes.totalTaxPayable;
  let breakEvenDeductions = 0;
  for (let d = 0; d <= input.annualGrossIncome; d += 5000) {
    const testRes = calculateOldRegimeTax({
      annualGrossIncome: input.annualGrossIncome,
      isSalaried: false, // evaluate pure total deduction amount
      standardDeduction: 0,
      section80C: d,
    });
    if (testRes.totalTaxPayable <= targetTax) {
      breakEvenDeductions = d;
      break;
    }
  }

  return {
    newRegime: newRes,
    oldRegime: oldRes,
    newRegimeTax: newRes.totalTaxPayable,
    oldRegimeTax: oldRes.totalTaxPayable,
    taxDifference: diff,
    recommendedRegime: diff > 500 ? 'old' : diff < -500 ? 'new' : 'equal',
    taxSaved: Math.abs(diff),
    breakEvenDeductionsRequired: breakEvenDeductions,
    breakEvenDeductionNeeded: breakEvenDeductions,
  };
}

/**
 * 4. HRA Exemption Calculator (House Rent Allowance)
 * Rule 2A: Least of:
 * 1. Actual HRA received
 * 2. Actual rent paid - 10% of (Basic Salary + DA)
 * 3. 50% of (Basic + DA) for Metro or 40% for Non-Metro
 */
export interface HRAInput {
  basicSalaryMonthly: number;
  daMonthly?: number;
  hraReceivedMonthly: number;
  rentPaidMonthly: number;
  isMetroCity: boolean; // Delhi, Mumbai, Kolkata, Chennai
}

export interface HRAResult {
  exemptHRAAnnual: number;
  exemptHRAMonthly: number;
  taxableHRAAnnual: number;
  taxableHRAMonthly: number;
  actualHRAReceivedAnnual: number;
  rentPaidMinus10PercentBasicAnnual: number;
  percentageBasicLimitAnnual: number;
  // Aliases for compatibility
  exemptHRAAmount: number;
  taxableHRAAmount: number;
  monthlyHRAExemption: number;
  calculationBreakdown: {
    actualHraReceived: number;
    rentPaidMinusTenPercentSalary: number;
    salaryPercentageCap: number;
  };
}

export function calculateHRAExemption(input: HRAInput): HRAResult {
  const basic = (Math.max(0, input.basicSalaryMonthly) + Math.max(0, input.daMonthly || 0)) * 12;
  const hraReceived = Math.max(0, input.hraReceivedMonthly) * 12;
  const rentPaid = Math.max(0, input.rentPaidMonthly) * 12;
  const pctLimit = input.isMetroCity ? 0.50 : 0.40;

  const cond1 = hraReceived;
  const cond2 = Math.max(0, rentPaid - basic * 0.10);
  const cond3 = basic * pctLimit;

  const exemptAnnual = Math.min(cond1, cond2, cond3);
  const taxableAnnual = Math.max(0, hraReceived - exemptAnnual);

  return {
    exemptHRAAnnual: Math.round(exemptAnnual),
    exemptHRAMonthly: Math.round(exemptAnnual / 12),
    taxableHRAAnnual: Math.round(taxableAnnual),
    taxableHRAMonthly: Math.round(taxableAnnual / 12),
    actualHRAReceivedAnnual: Math.round(cond1),
    rentPaidMinus10PercentBasicAnnual: Math.round(cond2),
    percentageBasicLimitAnnual: Math.round(cond3),
    exemptHRAAmount: Math.round(exemptAnnual),
    taxableHRAAmount: Math.round(taxableAnnual),
    monthlyHRAExemption: Math.round(exemptAnnual / 12),
    calculationBreakdown: {
      actualHraReceived: Math.round(cond1),
      rentPaidMinusTenPercentSalary: Math.round(cond2),
      salaryPercentageCap: Math.round(cond3),
    },
  };
}

/**
 * 5. Capital Gains Tax (LTCG / STCG on Equity, Debt, Real Estate)
 */
export interface CapitalGainsInput {
  assetType:
    | 'listed_equity_mutual_funds'
    | 'listed_equity'
    | 'debt_mutual_funds'
    | 'debt_funds'
    | 'real_estate'
    | 'unlisted_shares'
    | 'gold_physical'
    | 'gold_jewellery';
  purchasePrice: number;
  salePrice: number;
  holdingPeriodMonths: number;
  expensesOnSale?: number;
  costInflationIndexPurchase?: number; // For real estate/unlisted
  costInflationIndexSale?: number;
}

export interface CapitalGainsResult {
  capitalGainAmount: number;
  gainType: 'STCG' | 'LTCG';
  taxRateApplicable: number; // %
  exemptionAllowed: number; // e.g. ₹1.25L for equity LTCG
  taxableGain: number;
  taxPayable: number;
  cess: number;
  totalTaxPayable: number;
  // Aliases for compatibility
  grossCapitalGain: number;
  postTaxNetGains: number;
  taxRatePercentage: number;
  applicableExemptionLimit: number;
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const buy = Math.max(0, input.purchasePrice);
  const sell = Math.max(0, input.salePrice);
  const exp = Math.max(0, input.expensesOnSale || 0);
  const months = Math.max(1, input.holdingPeriodMonths);

  const rawGain = Math.max(0, sell - buy - exp);

  const isEquity = input.assetType === 'listed_equity_mutual_funds' || input.assetType === 'listed_equity';
  const isRealEstate = input.assetType === 'real_estate';
  const isGoldOrUnlisted =
    input.assetType === 'gold_physical' ||
    input.assetType === 'gold_jewellery' ||
    input.assetType === 'unlisted_shares';

  if (isEquity) {
    const isLTCG = months > 12;
    if (isLTCG) {
      // LTCG: 12.5% above ₹1.25 Lakh exemption (Post Budget 2024)
      const exemption = Math.min(rawGain, 125000);
      const taxable = Math.max(0, rawGain - 125000);
      const baseTax = taxable * 0.125;
      const cess = baseTax * 0.04;
      const totalTax = Math.round(baseTax + cess);
      return {
        capitalGainAmount: Math.round(rawGain),
        gainType: 'LTCG',
        taxRateApplicable: 12.5,
        exemptionAllowed: Math.round(exemption),
        taxableGain: Math.round(taxable),
        taxPayable: Math.round(baseTax),
        cess: Math.round(cess),
        totalTaxPayable: totalTax,
        grossCapitalGain: Math.round(rawGain),
        postTaxNetGains: Math.round(rawGain - totalTax),
        taxRatePercentage: 12.5,
        applicableExemptionLimit: 125000,
      };
    } else {
      // STCG: 20% (Post Budget 2024)
      const baseTax = rawGain * 0.20;
      const cess = baseTax * 0.04;
      const totalTax = Math.round(baseTax + cess);
      return {
        capitalGainAmount: Math.round(rawGain),
        gainType: 'STCG',
        taxRateApplicable: 20,
        exemptionAllowed: 0,
        taxableGain: Math.round(rawGain),
        taxPayable: Math.round(baseTax),
        cess: Math.round(cess),
        totalTaxPayable: totalTax,
        grossCapitalGain: Math.round(rawGain),
        postTaxNetGains: Math.round(rawGain - totalTax),
        taxRatePercentage: 20,
        applicableExemptionLimit: 0,
      };
    }
  }

  // Real estate: LTCG if > 24 months (12.5% without indexation)
  if (isRealEstate) {
    const isLTCG = months > 24;
    const rate = isLTCG ? 12.5 : 30;
    const baseTax = rawGain * (rate / 100);
    const cess = baseTax * 0.04;
    const totalTax = Math.round(baseTax + cess);
    return {
      capitalGainAmount: Math.round(rawGain),
      gainType: isLTCG ? 'LTCG' : 'STCG',
      taxRateApplicable: rate,
      exemptionAllowed: 0,
      taxableGain: Math.round(rawGain),
      taxPayable: Math.round(baseTax),
      cess: Math.round(cess),
      totalTaxPayable: totalTax,
      grossCapitalGain: Math.round(rawGain),
      postTaxNetGains: Math.round(rawGain - totalTax),
      taxRatePercentage: rate,
      applicableExemptionLimit: 0,
    };
  }

  // Gold or Unlisted Shares: LTCG if > 24 months (12.5%)
  if (isGoldOrUnlisted) {
    const isLTCG = months > 24;
    const rate = isLTCG ? 12.5 : 30;
    const baseTax = rawGain * (rate / 100);
    const cess = baseTax * 0.04;
    const totalTax = Math.round(baseTax + cess);
    return {
      capitalGainAmount: Math.round(rawGain),
      gainType: isLTCG ? 'LTCG' : 'STCG',
      taxRateApplicable: rate,
      exemptionAllowed: 0,
      taxableGain: Math.round(rawGain),
      taxPayable: Math.round(baseTax),
      cess: Math.round(cess),
      totalTaxPayable: totalTax,
      grossCapitalGain: Math.round(rawGain),
      postTaxNetGains: Math.round(rawGain - totalTax),
      taxRatePercentage: rate,
      applicableExemptionLimit: 0,
    };
  }

  // Debt funds / Other: Taxed at slab rate (30% marginal)
  const baseTax = rawGain * 0.30;
  const cess = baseTax * 0.04;
  const totalTax = Math.round(baseTax + cess);
  return {
    capitalGainAmount: Math.round(rawGain),
    gainType: months > 36 ? 'LTCG' : 'STCG',
    taxRateApplicable: 30,
    exemptionAllowed: 0,
    taxableGain: Math.round(rawGain),
    taxPayable: Math.round(baseTax),
    cess: Math.round(cess),
    totalTaxPayable: totalTax,
    grossCapitalGain: Math.round(rawGain),
    postTaxNetGains: Math.round(rawGain - totalTax),
    taxRatePercentage: 30,
    applicableExemptionLimit: 0,
  };
}

/**
 * 6. Presumptive Taxation Section 44ADA (Professionals & Freelancers)
 * 50% presumptive profit on gross receipts up to ₹75 Lakhs
 */
export interface Tax44ADAInput {
  grossProfessionalReceipts: number;
  actualBusinessExpenses?: number;
  otherIncome?: number;
  taxRegime?: 'new' | 'old';
}

export interface Tax44ADAResult {
  grossReceipts: number;
  presumptiveIncome50Percent: number;
  netTaxableIncome: number;
  taxPayable: number;
  taxSavingsVsRegularBookkeeping: number;
  isEligibleUnder44ADA: boolean; // Gross <= 75L (or 50L if cash > 5%)
}

export function calculate44ADATax(input: Tax44ADAInput): Tax44ADAResult {
  const receipts = Math.max(0, input.grossProfessionalReceipts);
  const presumptiveProfits = receipts * 0.50;
  const otherInc = Math.max(0, input.otherIncome || 0);
  const totalTaxable = presumptiveProfits + otherInc;

  const isEligible = receipts <= 7500000;

  const taxOutput =
    input.taxRegime === 'old'
      ? calculateOldRegimeTax({ annualGrossIncome: totalTaxable, isSalaried: false })
      : calculateNewRegimeTax({ annualGrossIncome: totalTaxable, isSalaried: false });

  // Regular bookkeeping hypothetical comparison
  const actualExpenses = input.actualBusinessExpenses || receipts * 0.20; // 20% typical expenses
  const actualProfit = Math.max(0, receipts - actualExpenses) + otherInc;
  const regularTaxOutput =
    input.taxRegime === 'old'
      ? calculateOldRegimeTax({ annualGrossIncome: actualProfit, isSalaried: false })
      : calculateNewRegimeTax({ annualGrossIncome: actualProfit, isSalaried: false });

  const taxSavings = Math.max(0, regularTaxOutput.totalTaxPayable - taxOutput.totalTaxPayable);

  return {
    grossReceipts: Math.round(receipts),
    presumptiveIncome50Percent: Math.round(presumptiveProfits),
    netTaxableIncome: Math.round(totalTaxable),
    taxPayable: Math.round(taxOutput.totalTaxPayable),
    taxSavingsVsRegularBookkeeping: Math.round(taxSavings),
    isEligibleUnder44ADA: isEligible,
  };
}

/**
 * 7. Section 44AD Presumptive Taxation (Small Businesses)
 * 6% on digital turnover, 8% on non-digital turnover up to ₹3 Crore
 */
export interface Tax44ADInput {
  digitalTurnover: number;
  nonDigitalTurnover: number;
  otherIncome?: number;
}

export interface Tax44ADResult {
  totalTurnover: number;
  presumptiveIncome: number;
  effectiveProfitRate: number;
  taxPayable: number;
  isEligibleUnder44AD: boolean;
}

export function calculate44ADTax(input: Tax44ADInput): Tax44ADResult {
  const digital = Math.max(0, input.digitalTurnover);
  const cash = Math.max(0, input.nonDigitalTurnover);
  const totalTurnover = digital + cash;

  const digitalProfit = digital * 0.06;
  const cashProfit = cash * 0.08;
  const totalPresumptiveProfit = digitalProfit + cashProfit;

  const other = Math.max(0, input.otherIncome || 0);
  const totalTaxable = totalPresumptiveProfit + other;

  const taxRes = calculateNewRegimeTax({ annualGrossIncome: totalTaxable, isSalaried: false });

  return {
    totalTurnover: Math.round(totalTurnover),
    presumptiveIncome: Math.round(totalPresumptiveProfit),
    effectiveProfitRate: totalTurnover > 0 ? Math.round((totalPresumptiveProfit / totalTurnover) * 1000) / 10 : 0,
    taxPayable: Math.round(taxRes.totalTaxPayable),
    isEligibleUnder44AD: totalTurnover <= 30000000,
  };
}
