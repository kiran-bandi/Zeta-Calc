/**
 * Gold & Precious Metals Deterministic Engines
 * Universal precision calculations for:
 * 1. Gold Value (Karat, Weight, 24K Ref / Purity Rate, Multi-unit)
 * 2. Gold Loan (Valuation, LTV Eligibility, EMI / Interest-Only / Bullet)
 * 3. Gold Purity (Karat, Fineness, 24K Equivalent, Non-Gold Alloy)
 * 4. Gold Jewellery Cost (Weight, Purity, Wastage, Making Charges, Tax)
 * 5. Gold Investment Return (Amount / Quantity, Buy/Sell Prices, Dates, Net Profit, CAGR)
 */

import { UnitRegistry } from '../platform/units/UnitRegistry';

// Common Types
export type GoldWeightUnit = 'g' | 'mg' | 'kg' | 'oz' | 'ozt' | 'tola';
export type GoldRateUnit = 'per_g' | 'per_10g' | 'per_oz' | 'per_ozt' | 'per_tola' | 'per_kg';
export type GoldCarat = 24 | 23 | 22 | 21 | 20 | 18 | 14 | 10 | 'custom';
export type GoldRateBasis = '24k_reference' | 'selected_purity';

export const GOLD_WEIGHT_UNIT_LABELS: Record<GoldWeightUnit, string> = {
  g: 'Grams (g)',
  mg: 'Milligrams (mg)',
  kg: 'Kilograms (kg)',
  oz: 'Ounces (oz)',
  ozt: 'Troy Ounces (oz t)',
  tola: 'Tolas (tola)',
};

export const GOLD_RATE_UNIT_LABELS: Record<GoldRateUnit, string> = {
  per_g: 'per Gram (/g)',
  per_10g: 'per 10 Grams (/10g)',
  per_oz: 'per Ounce (/oz)',
  per_ozt: 'per Troy Ounce (/oz t)',
  per_tola: 'per Tola (/tola)',
  per_kg: 'per Kilogram (/kg)',
};

export const STANDARD_CARAT_PURITIES: Record<number, { percent: number; hallmark: string; name: string }> = {
  24: { percent: 99.9, hallmark: '999', name: '24K (Pure Gold / Bullion)' },
  23: { percent: 95.833333, hallmark: '958', name: '23K (Standard Fine)' },
  22: { percent: 91.666667, hallmark: '916', name: '22K (Traditional Jewellery)' },
  21: { percent: 87.5, hallmark: '875', name: '21K (Middle Eastern Jewellery)' },
  20: { percent: 83.333333, hallmark: '833', name: '20K (Vintage Jewellery)' },
  18: { percent: 75.0, hallmark: '750', name: '18K (Diamond / Luxury Jewellery)' },
  14: { percent: 58.333333, hallmark: '585', name: '14K (Durable Daily Wear)' },
  10: { percent: 41.666667, hallmark: '417', name: '10K (Minimum US Karat Standard)' },
};

/**
 * Normalizes weight in any GoldWeightUnit to grams using UnitRegistry
 */
export function normalizeToGrams(weight: number, unit: GoldWeightUnit): number {
  if (weight <= 0 || isNaN(weight)) return 0;
  try {
    return UnitRegistry.convert(weight, unit, 'g');
  } catch {
    // Fallback if unit not registered
    const manualFactors: Record<GoldWeightUnit, number> = {
      g: 1,
      mg: 0.001,
      kg: 1000,
      oz: 28.349523125,
      ozt: 31.1034768,
      tola: 11.6638038,
    };
    return weight * (manualFactors[unit] || 1);
  }
}

/**
 * Converts price rate from rate unit to price per 1 gram
 */
export function getPricePerGram(rate: number, rateUnit: GoldRateUnit): number {
  if (rate <= 0 || isNaN(rate)) return 0;
  switch (rateUnit) {
    case 'per_g':
      return rate;
    case 'per_10g':
      return rate / 10;
    case 'per_oz':
      return rate / UnitRegistry.convert(1, 'oz', 'g');
    case 'per_ozt':
      return rate / UnitRegistry.convert(1, 'ozt', 'g');
    case 'per_tola':
      return rate / UnitRegistry.convert(1, 'tola', 'g');
    case 'per_kg':
      return rate / 1000;
    default:
      return rate;
  }
}

/**
 * Derives the purity fraction (0 to 1) from carat or custom percentage
 */
export function getPurityFraction(carat: GoldCarat, customPurityPercent?: number): number {
  if (carat === 'custom') {
    const custom = typeof customPurityPercent === 'number' && !isNaN(customPurityPercent) ? customPurityPercent : 0;
    return Math.min(100, Math.max(0, custom)) / 100;
  }
  if (carat === 24) {
    // Bullion standard 99.9% fine (or 24/24)
    return 24 / 24;
  }
  return carat / 24;
}

/* ==========================================================================
   1. GOLD VALUE CALCULATOR ENGINE
   ========================================================================== */

export interface GoldValueInput {
  weight: number | '';
  weightUnit: GoldWeightUnit;
  purity: GoldCarat;
  customPurityPercent?: number | '';
  goldRate: number | '';
  rateUnit: GoldRateUnit;
  rateBasis: GoldRateBasis;
}

export interface GoldValueResult {
  isValid: boolean;
  grossWeight: number;
  weightUnit: GoldWeightUnit;
  grossWeightInGrams: number;
  pureGoldWeightInGrams: number;
  pureGoldWeightInSelectedUnit: number;
  purityPercent: number;
  purityFraction: number;
  goldValue: number;
  effectiveRatePerGram: number;
  rateBasis: GoldRateBasis;
  rateUsed: number;
  rateUnit: GoldRateUnit;
  methodology: string;
}

export function calculateGoldValue(input: GoldValueInput): GoldValueResult | null {
  const { weight, weightUnit, purity, customPurityPercent, goldRate, rateUnit, rateBasis } = input;

  if (
    typeof weight !== 'number' ||
    weight <= 0 ||
    typeof goldRate !== 'number' ||
    goldRate <= 0 ||
    isNaN(weight) ||
    isNaN(goldRate)
  ) {
    return null;
  }

  const purityFraction = getPurityFraction(purity, typeof customPurityPercent === 'number' ? customPurityPercent : undefined);
  const purityPercent = purityFraction * 100;

  const grossWeightInGrams = normalizeToGrams(weight, weightUnit);
  const pureGoldWeightInGrams = grossWeightInGrams * purityFraction;
  const pureGoldWeightInSelectedUnit = weight * purityFraction;

  const ratePerGramEntered = getPricePerGram(goldRate, rateUnit);

  let goldValue = 0;
  let effectiveRatePerGram = 0;
  let methodology = '';

  if (rateBasis === '24k_reference') {
    effectiveRatePerGram = ratePerGramEntered * purityFraction;
    goldValue = grossWeightInGrams * effectiveRatePerGram;
    methodology = `Pure Gold Value = Gross Weight (${weight} ${weightUnit} = ${grossWeightInGrams.toFixed(4)} g) × Purity Fraction (${purity === 'custom' ? purityPercent.toFixed(2) + '%' : purity + '/24 = ' + purityPercent.toFixed(2) + '%'}) × 24K Rate per Gram (${ratePerGramEntered.toFixed(2)} /g).`;
  } else {
    // Rate is entered explicitly for the selected purity
    effectiveRatePerGram = ratePerGramEntered;
    goldValue = grossWeightInGrams * effectiveRatePerGram;
    methodology = `Gold Value = Gross Weight (${weight} ${weightUnit} = ${grossWeightInGrams.toFixed(4)} g) × Direct Rate for Selected Purity (${ratePerGramEntered.toFixed(2)} /g). Pure gold content is ${pureGoldWeightInGrams.toFixed(4)} g (${purityPercent.toFixed(2)}%).`;
  }

  return {
    isValid: true,
    grossWeight: weight,
    weightUnit,
    grossWeightInGrams,
    pureGoldWeightInGrams,
    pureGoldWeightInSelectedUnit,
    purityPercent,
    purityFraction,
    goldValue,
    effectiveRatePerGram,
    rateBasis,
    rateUsed: goldRate,
    rateUnit,
    methodology,
  };
}

/* ==========================================================================
   2. GOLD LOAN CALCULATOR ENGINE
   ========================================================================== */

export type GoldLoanRepaymentMethod = 'emi' | 'interest_only' | 'bullet_end';

export interface GoldLoanInput {
  weight: number | '';
  weightUnit: GoldWeightUnit;
  purity: GoldCarat;
  customPurityPercent?: number | '';
  goldRate: number | '';
  rateUnit: GoldRateUnit;
  ltvPercent: number | '';
  desiredLoanAmount?: number | '';
  interestRate: number | '';
  loanTerm: number | '';
  termUnit: 'months' | 'years';
  repaymentMethod: GoldLoanRepaymentMethod;
}

export interface GoldLoanScheduleItem {
  period: number;
  openingBalance: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  closingBalance: number;
}

export interface GoldLoanResult {
  isValid: boolean;
  estimatedGoldValue: number;
  maxEligibleLoan: number;
  requestedLoan: number;
  activeLoanPrincipal: number;
  ltvPercent: number;
  actualLtvPercent: number;
  isEligible: boolean;
  repaymentMethod: GoldLoanRepaymentMethod;
  interestRateAnnual: number;
  termMonths: number;
  periodicPayment: number;
  totalInterest: number;
  totalRepayment: number;
  schedule: GoldLoanScheduleItem[];
  methodSummary: string;
}

export function calculateGoldLoan(input: GoldLoanInput): GoldLoanResult | null {
  const {
    weight,
    weightUnit,
    purity,
    customPurityPercent,
    goldRate,
    rateUnit,
    ltvPercent,
    desiredLoanAmount,
    interestRate,
    loanTerm,
    termUnit,
    repaymentMethod,
  } = input;

  if (
    typeof weight !== 'number' ||
    weight <= 0 ||
    typeof goldRate !== 'number' ||
    goldRate <= 0 ||
    typeof ltvPercent !== 'number' ||
    ltvPercent <= 0 ||
    typeof interestRate !== 'number' ||
    interestRate < 0 ||
    typeof loanTerm !== 'number' ||
    loanTerm <= 0 ||
    isNaN(weight) ||
    isNaN(goldRate) ||
    isNaN(ltvPercent) ||
    isNaN(interestRate) ||
    isNaN(loanTerm)
  ) {
    return null;
  }

  const purityFraction = getPurityFraction(purity, typeof customPurityPercent === 'number' ? customPurityPercent : undefined);
  const grossGrams = normalizeToGrams(weight, weightUnit);
  const pureGoldGrams = grossGrams * purityFraction;
  const ratePerGram24K = getPricePerGram(goldRate, rateUnit);

  const estimatedGoldValue = pureGoldGrams * ratePerGram24K;
  const maxEligibleLoan = estimatedGoldValue * (ltvPercent / 100);

  const hasDesiredLoan = typeof desiredLoanAmount === 'number' && desiredLoanAmount > 0;
  const requestedLoan = hasDesiredLoan ? desiredLoanAmount : maxEligibleLoan;
  const isEligible = requestedLoan <= maxEligibleLoan + 1e-6;
  const activeLoanPrincipal = requestedLoan;
  const actualLtvPercent = estimatedGoldValue > 0 ? (activeLoanPrincipal / estimatedGoldValue) * 100 : 0;

  const termMonths = Math.round(termUnit === 'years' ? loanTerm * 12 : loanTerm);
  const monthlyRate = interestRate / 100 / 12;

  let periodicPayment = 0;
  let totalInterest = 0;
  let totalRepayment = 0;
  const schedule: GoldLoanScheduleItem[] = [];
  let methodSummary = '';

  if (repaymentMethod === 'emi') {
    if (monthlyRate === 0) {
      periodicPayment = activeLoanPrincipal / termMonths;
      totalInterest = 0;
      totalRepayment = activeLoanPrincipal;
      let balance = activeLoanPrincipal;
      for (let m = 1; m <= termMonths; m++) {
        const principal = periodicPayment;
        balance -= principal;
        schedule.push({
          period: m,
          openingBalance: balance + principal,
          principalPaid: principal,
          interestPaid: 0,
          totalPayment: principal,
          closingBalance: Math.max(0, balance),
        });
      }
    } else {
      const factor = Math.pow(1 + monthlyRate, termMonths);
      periodicPayment = (activeLoanPrincipal * monthlyRate * factor) / (factor - 1);
      totalRepayment = periodicPayment * termMonths;
      totalInterest = totalRepayment - activeLoanPrincipal;

      let balance = activeLoanPrincipal;
      for (let m = 1; m <= termMonths; m++) {
        const interest = balance * monthlyRate;
        const principal = periodicPayment - interest;
        balance -= principal;
        schedule.push({
          period: m,
          openingBalance: balance + principal,
          principalPaid: principal,
          interestPaid: interest,
          totalPayment: periodicPayment,
          closingBalance: Math.max(0, balance),
        });
      }
    }
    methodSummary = `Equated Monthly Installment (EMI) amortizes principal and interest evenly over ${termMonths} months.`;
  } else if (repaymentMethod === 'interest_only') {
    // Monthly interest serviced; principal repaid at maturity
    periodicPayment = activeLoanPrincipal * monthlyRate;
    totalInterest = periodicPayment * termMonths;
    totalRepayment = activeLoanPrincipal + totalInterest;

    for (let m = 1; m <= termMonths; m++) {
      const isFinal = m === termMonths;
      const principal = isFinal ? activeLoanPrincipal : 0;
      schedule.push({
        period: m,
        openingBalance: activeLoanPrincipal,
        principalPaid: principal,
        interestPaid: periodicPayment,
        totalPayment: periodicPayment + principal,
        closingBalance: isFinal ? 0 : activeLoanPrincipal,
      });
    }
    methodSummary = `Interest-Only / Bullet Interest: Service only the interest of ${periodicPayment.toFixed(2)} each month. The full principal of ${activeLoanPrincipal.toFixed(2)} is due at the final month.`;
  } else {
    // bullet_end: Principal + Accrued Interest at End
    periodicPayment = 0;
    totalInterest = activeLoanPrincipal * (interestRate / 100) * (termMonths / 12);
    totalRepayment = activeLoanPrincipal + totalInterest;

    schedule.push({
      period: termMonths,
      openingBalance: activeLoanPrincipal,
      principalPaid: activeLoanPrincipal,
      interestPaid: totalInterest,
      totalPayment: totalRepayment,
      closingBalance: 0,
    });
    methodSummary = `Lump Sum Bullet at Maturity: Zero periodic outflow during the ${termMonths}-month tenure. The full principal plus accrued interest is paid on the loan due date.`;
  }

  return {
    isValid: true,
    estimatedGoldValue,
    maxEligibleLoan,
    requestedLoan,
    activeLoanPrincipal,
    ltvPercent,
    actualLtvPercent,
    isEligible,
    repaymentMethod,
    interestRateAnnual: interestRate,
    termMonths,
    periodicPayment,
    totalInterest,
    totalRepayment,
    schedule,
    methodSummary,
  };
}

/* ==========================================================================
   3. GOLD PURITY CALCULATOR ENGINE
   ========================================================================== */

export interface GoldPurityInput {
  weight: number | '';
  weightUnit: GoldWeightUnit;
  carat: GoldCarat;
  customPurityPercent?: number | '';
}

export interface GoldPurityResult {
  isValid: boolean;
  carat: GoldCarat;
  caratDisplay: string;
  purityPercent: number;
  purityFraction: number;
  hallmarkCode: string;
  grossWeight: number;
  weightUnit: GoldWeightUnit;
  grossWeightInGrams: number;
  pureGoldWeight: number;
  pureGoldWeightInGrams: number;
  nonGoldWeight: number;
  nonGoldWeightInGrams: number;
  equivalent24KWeight: number;
  alloyDescription: string;
}

export function calculateGoldPurity(input: GoldPurityInput): GoldPurityResult | null {
  const { weight, weightUnit, carat, customPurityPercent } = input;

  if (typeof weight !== 'number' || weight <= 0 || isNaN(weight)) {
    return null;
  }

  let purityFraction = 0;
  let purityPercent = 0;
  let hallmarkCode = '';
  let caratDisplay = '';
  let alloyDescription = '';

  if (carat === 'custom') {
    const custom = typeof customPurityPercent === 'number' && !isNaN(customPurityPercent) ? customPurityPercent : 0;
    purityFraction = Math.min(100, Math.max(0, custom)) / 100;
    purityPercent = purityFraction * 100;
    caratDisplay = `Custom (${purityPercent.toFixed(2)}%)`;
    hallmarkCode = `${Math.round(purityPercent * 10)}`;
    alloyDescription = `${purityPercent.toFixed(2)}% Pure Gold, ${(100 - purityPercent).toFixed(2)}% Alloy metals (copper, silver, zinc, or nickel).`;
  } else {
    purityFraction = carat / 24;
    purityPercent = (carat / 24) * 100;
    caratDisplay = `${carat} Karat (${carat}K)`;
    const std = STANDARD_CARAT_PURITIES[carat];
    hallmarkCode = std ? std.hallmark : `${Math.round(purityPercent * 10)}`;
    alloyDescription = `${carat}/24 parts (${purityPercent.toFixed(2)}%) pure gold and ${(24 - carat)}/24 parts (${(100 - purityPercent).toFixed(2)}%) alloying elements added for hardness and color.`;
  }

  const grossWeightInGrams = normalizeToGrams(weight, weightUnit);
  const pureGoldWeightInGrams = grossWeightInGrams * purityFraction;
  const nonGoldWeightInGrams = grossWeightInGrams - pureGoldWeightInGrams;

  const pureGoldWeight = weight * purityFraction;
  const nonGoldWeight = weight - pureGoldWeight;
  const equivalent24KWeight = pureGoldWeight;

  return {
    isValid: true,
    carat,
    caratDisplay,
    purityPercent,
    purityFraction,
    hallmarkCode,
    grossWeight: weight,
    weightUnit,
    grossWeightInGrams,
    pureGoldWeight,
    pureGoldWeightInGrams,
    nonGoldWeight,
    nonGoldWeightInGrams,
    equivalent24KWeight,
    alloyDescription,
  };
}

/* ==========================================================================
   4. GOLD JEWELLERY COST CALCULATOR ENGINE
   ========================================================================== */

export type MakingChargeType = 'percentage' | 'fixed' | 'per_gram';

export interface GoldJewelleryCostInput {
  weight: number | '';
  weightUnit: GoldWeightUnit;
  purity: GoldCarat;
  customPurityPercent?: number | '';
  goldRate: number | '';
  rateUnit: GoldRateUnit;
  rateBasis: GoldRateBasis;
  makingCharge: number | '';
  makingChargeType: MakingChargeType;
  wastagePercent?: number | '';
  stoneCharges?: number | '';
  otherCharges?: number | '';
  taxPercent?: number | '';
}

export interface GoldJewelleryCostResult {
  isValid: boolean;
  grossWeight: number;
  weightUnit: GoldWeightUnit;
  grossWeightInGrams: number;
  goldValue: number;
  wastageCost: number;
  wastagePercent: number;
  makingChargeAmount: number;
  makingChargeType: MakingChargeType;
  makingChargeEntered: number;
  stoneCharges: number;
  otherCharges: number;
  subtotal: number;
  taxAmount: number;
  taxPercent: number;
  finalPrice: number;
  effectivePricePerGram: number;
  effectivePricePerChosenUnit: number;
}

export function calculateGoldJewelleryCost(input: GoldJewelleryCostInput): GoldJewelleryCostResult | null {
  const {
    weight,
    weightUnit,
    purity,
    customPurityPercent,
    goldRate,
    rateUnit,
    rateBasis,
    makingCharge,
    makingChargeType,
    wastagePercent,
    stoneCharges,
    otherCharges,
    taxPercent,
  } = input;

  if (
    typeof weight !== 'number' ||
    weight <= 0 ||
    typeof goldRate !== 'number' ||
    goldRate <= 0 ||
    isNaN(weight) ||
    isNaN(goldRate)
  ) {
    return null;
  }

  const purityFraction = getPurityFraction(purity, typeof customPurityPercent === 'number' ? customPurityPercent : undefined);
  const grossWeightInGrams = normalizeToGrams(weight, weightUnit);
  const ratePerGramEntered = getPricePerGram(goldRate, rateUnit);

  let goldValue = 0;
  if (rateBasis === '24k_reference') {
    goldValue = grossWeightInGrams * purityFraction * ratePerGramEntered;
  } else {
    goldValue = grossWeightInGrams * ratePerGramEntered;
  }

  const wastagePct = typeof wastagePercent === 'number' && !isNaN(wastagePercent) && wastagePercent > 0 ? wastagePercent : 0;
  const wastageCost = goldValue * (wastagePct / 100);

  const makingChargeVal = typeof makingCharge === 'number' && !isNaN(makingCharge) && makingCharge > 0 ? makingCharge : 0;
  let makingChargeAmount = 0;
  if (makingChargeType === 'percentage') {
    makingChargeAmount = goldValue * (makingChargeVal / 100);
  } else if (makingChargeType === 'per_gram') {
    makingChargeAmount = grossWeightInGrams * makingChargeVal;
  } else {
    makingChargeAmount = makingChargeVal;
  }

  const stoneCost = typeof stoneCharges === 'number' && !isNaN(stoneCharges) && stoneCharges > 0 ? stoneCharges : 0;
  const otherCost = typeof otherCharges === 'number' && !isNaN(otherCharges) && otherCharges > 0 ? otherCharges : 0;

  const subtotal = goldValue + wastageCost + makingChargeAmount + stoneCost + otherCost;

  const taxPct = typeof taxPercent === 'number' && !isNaN(taxPercent) && taxPercent > 0 ? taxPercent : 0;
  const taxAmount = subtotal * (taxPct / 100);
  const finalPrice = subtotal + taxAmount;

  const effectivePricePerGram = grossWeightInGrams > 0 ? finalPrice / grossWeightInGrams : 0;
  const effectivePricePerChosenUnit = weight > 0 ? finalPrice / weight : 0;

  return {
    isValid: true,
    grossWeight: weight,
    weightUnit,
    grossWeightInGrams,
    goldValue,
    wastageCost,
    wastagePercent: wastagePct,
    makingChargeAmount,
    makingChargeType,
    makingChargeEntered: makingChargeVal,
    stoneCharges: stoneCost,
    otherCharges: otherCost,
    subtotal,
    taxAmount,
    taxPercent: taxPct,
    finalPrice,
    effectivePricePerGram,
    effectivePricePerChosenUnit,
  };
}

/* ==========================================================================
   5. GOLD INVESTMENT RETURN CALCULATOR ENGINE
   ========================================================================== */

export type GoldInvestmentMode = 'amount' | 'quantity';

export interface GoldInvestmentReturnInput {
  mode: GoldInvestmentMode;
  purchaseAmount?: number | '';
  quantity?: number | '';
  weightUnit: GoldWeightUnit;
  purchasePrice: number | ''; // price per unit
  currentPrice: number | ''; // price per unit
  purchaseDate?: string;
  saleDate?: string;
  purchaseCosts?: number | '';
  sellingCosts?: number | '';
}

export interface GoldInvestmentReturnResult {
  isValid: boolean;
  mode: GoldInvestmentMode;
  quantity: number;
  weightUnit: GoldWeightUnit;
  purchasePricePerUnit: number;
  currentPricePerUnit: number;
  initialGrossCost: number;
  purchaseCosts: number;
  totalInitialInvestment: number;
  grossCurrentValue: number;
  sellingCosts: number;
  netCurrentValue: number;
  absoluteProfitLoss: number;
  returnPercent: number;
  hasValidDates: boolean;
  holdingDays?: number;
  holdingYears?: number;
  durationText?: string;
  annualizedReturnCAGR?: number;
}

export function calculateGoldInvestmentReturn(input: GoldInvestmentReturnInput): GoldInvestmentReturnResult | null {
  const {
    mode,
    purchaseAmount,
    quantity,
    weightUnit,
    purchasePrice,
    currentPrice,
    purchaseDate,
    saleDate,
    purchaseCosts,
    sellingCosts,
  } = input;

  if (
    typeof purchasePrice !== 'number' ||
    purchasePrice <= 0 ||
    typeof currentPrice !== 'number' ||
    currentPrice <= 0 ||
    isNaN(purchasePrice) ||
    isNaN(currentPrice)
  ) {
    return null;
  }

  let finalQty = 0;
  let initialGrossCost = 0;

  if (mode === 'amount') {
    if (typeof purchaseAmount !== 'number' || purchaseAmount <= 0 || isNaN(purchaseAmount)) {
      return null;
    }
    initialGrossCost = purchaseAmount;
    finalQty = purchaseAmount / purchasePrice;
  } else {
    if (typeof quantity !== 'number' || quantity <= 0 || isNaN(quantity)) {
      return null;
    }
    finalQty = quantity;
    initialGrossCost = quantity * purchasePrice;
  }

  const buyCharges = typeof purchaseCosts === 'number' && !isNaN(purchaseCosts) && purchaseCosts > 0 ? purchaseCosts : 0;
  const totalInitialInvestment = initialGrossCost + buyCharges;

  const grossCurrentValue = finalQty * currentPrice;
  const sellCharges = typeof sellingCosts === 'number' && !isNaN(sellingCosts) && sellingCosts > 0 ? sellingCosts : 0;
  const netCurrentValue = grossCurrentValue - sellCharges;

  const absoluteProfitLoss = netCurrentValue - totalInitialInvestment;
  const returnPercent = totalInitialInvestment > 0 ? (absoluteProfitLoss / totalInitialInvestment) * 100 : 0;

  let hasValidDates = false;
  let holdingDays: number | undefined;
  let holdingYears: number | undefined;
  let durationText: string | undefined;
  let annualizedReturnCAGR: number | undefined;

  if (purchaseDate && saleDate) {
    const dStart = new Date(purchaseDate);
    const dEnd = new Date(saleDate);

    if (!isNaN(dStart.getTime()) && !isNaN(dEnd.getTime()) && dEnd.getTime() > dStart.getTime()) {
      hasValidDates = true;
      const diffMs = dEnd.getTime() - dStart.getTime();
      holdingDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      holdingYears = holdingDays / 365.25;

      const y = Math.floor(holdingDays / 365.25);
      const remainingDays = holdingDays - Math.floor(y * 365.25);
      const m = Math.floor(remainingDays / 30.4375);
      const d = Math.round(remainingDays - m * 30.4375);

      const parts: string[] = [];
      if (y > 0) parts.push(`${y} year${y > 1 ? 's' : ''}`);
      if (m > 0) parts.push(`${m} month${m > 1 ? 's' : ''}`);
      if (d > 0 || parts.length === 0) parts.push(`${d} day${d !== 1 ? 's' : ''}`);
      durationText = parts.join(', ') + ` (${holdingDays.toLocaleString()} days)`;

      if (holdingYears >= 30 / 365.25 && totalInitialInvestment > 0 && netCurrentValue > 0) {
        // Compound Annual Growth Rate (CAGR)
        annualizedReturnCAGR = (Math.pow(netCurrentValue / totalInitialInvestment, 1 / holdingYears) - 1) * 100;
      } else if (holdingYears > 0 && totalInitialInvestment > 0) {
        // Simple annualized return for short periods
        annualizedReturnCAGR = (returnPercent / holdingYears);
      }
    }
  }

  return {
    isValid: true,
    mode,
    quantity: finalQty,
    weightUnit,
    purchasePricePerUnit: purchasePrice,
    currentPricePerUnit: currentPrice,
    initialGrossCost,
    purchaseCosts: buyCharges,
    totalInitialInvestment,
    grossCurrentValue,
    sellingCosts: sellCharges,
    netCurrentValue,
    absoluteProfitLoss,
    returnPercent,
    hasValidDates,
    holdingDays,
    holdingYears,
    durationText,
    annualizedReturnCAGR,
  };
}
