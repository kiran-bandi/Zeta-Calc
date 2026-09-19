/**
 * Zeta Calculator - Pure TypeScript Engines for Next Calculator Batch
 * All formulas execute with maximum precision and zero external dependencies.
 */

// 1. LOAN COMPARISON CALCULATOR
export interface LoanOptionInput {
  id: string;
  name: string;
  principal: number;
  annualRatePercent: number;
  years: number;
  months: number;
  upfrontFees: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
}

export interface LoanOptionResult {
  id: string;
  name: string;
  periodicPayment: number;
  totalPeriods: number;
  totalPayments: number;
  totalInterest: number;
  totalCost: number; // payments + fees
}

export interface LoanComparisonResult {
  options: LoanOptionResult[];
  cheapestByPaymentId?: string;
  cheapestByInterestId?: string;
  cheapestByTotalCostId?: string;
}

export function calculateLoanComparison(options: LoanOptionInput[]): LoanComparisonResult {
  const results: LoanOptionResult[] = options.map((opt) => {
    const p = opt.principal || 0;
    const rateDecimal = (opt.annualRatePercent || 0) / 100;
    const totalMonths = (opt.years || 0) * 12 + (opt.months || 0);

    let frequencyCompounding = 12;
    if (opt.paymentFrequency === 'biweekly') frequencyCompounding = 26;
    if (opt.paymentFrequency === 'weekly') frequencyCompounding = 52;

    const yearsEquivalent = totalMonths / 12;
    const totalPeriods = Math.round(yearsEquivalent * frequencyCompounding);
    const periodicRate = rateDecimal / frequencyCompounding;

    let periodicPayment = 0;
    if (p > 0 && totalPeriods > 0) {
      if (periodicRate === 0) {
        periodicPayment = p / totalPeriods;
      } else {
        periodicPayment = (p * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
                          (Math.pow(1 + periodicRate, totalPeriods) - 1);
      }
    }

    const totalPayments = periodicPayment * totalPeriods;
    const totalInterest = Math.max(0, totalPayments - p);
    const totalCost = totalPayments + (opt.upfrontFees || 0);

    return {
      id: opt.id,
      name: opt.name,
      periodicPayment: Math.round(periodicPayment * 100) / 100,
      totalPeriods,
      totalPayments: Math.round(totalPayments * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
    };
  });

  let cheapestByPaymentId: string | undefined;
  let cheapestByInterestId: string | undefined;
  let cheapestByTotalCostId: string | undefined;

  if (results.length > 0) {
    cheapestByPaymentId = [...results].sort((a, b) => a.periodicPayment - b.periodicPayment)[0].id;
    cheapestByInterestId = [...results].sort((a, b) => a.totalInterest - b.totalInterest)[0].id;
    cheapestByTotalCostId = [...results].sort((a, b) => a.totalCost - b.totalCost)[0].id;
  }

  return {
    options: results,
    cheapestByPaymentId,
    cheapestByInterestId,
    cheapestByTotalCostId,
  };
}

// 2. LOAN PREPAYMENT CALCULATOR
export interface LoanPrepaymentInput {
  outstandingPrincipal: number;
  annualRatePercent: number;
  remainingYears: number;
  remainingMonths: number;
  extraPeriodicPayment: number;
  oneTimePrepayment: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
}

export interface AmortizationPeriod {
  periodNumber: number;
  beginningBalance: number;
  interestPaid: number;
  principalPaid: number;
  extraPaymentPaid: number;
  totalPaid: number;
  endingBalance: number;
}

export interface LoanPrepaymentResult {
  originalPeriodicPayment: number;
  originalTotalInterest: number;
  originalTotalPeriods: number;
  
  prepaidTotalInterest: number;
  prepaidTotalPeriods: number;
  interestSaved: number;
  periodsSaved: number;
  
  schedule: AmortizationPeriod[];
}

export function calculateLoanPrepayment(input: LoanPrepaymentInput): LoanPrepaymentResult {
  const p = input.outstandingPrincipal || 0;
  const rateDecimal = (input.annualRatePercent || 0) / 100;
  const totalMonths = (input.remainingYears || 0) * 12 + (input.remainingMonths || 0);

  let freq = 12;
  if (input.paymentFrequency === 'biweekly') freq = 26;
  if (input.paymentFrequency === 'weekly') freq = 52;

  const totalPeriods = Math.round((totalMonths / 12) * freq);
  const periodicRate = rateDecimal / freq;

  // 1. Calculate standard periodic payment
  let originalPayment = 0;
  if (p > 0 && totalPeriods > 0) {
    if (periodicRate === 0) {
      originalPayment = p / totalPeriods;
    } else {
      originalPayment = (p * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
                        (Math.pow(1 + periodicRate, totalPeriods) - 1);
    }
  }

  const originalTotalInterest = Math.max(0, originalPayment * totalPeriods - p);

  // 2. Run simulation with extra prepayments
  const schedule: AmortizationPeriod[] = [];
  let balance = p - (input.oneTimePrepayment || 0);
  
  // Handle case where one-time prepayment fully clears the balance
  if (balance < 0) balance = 0;

  let period = 0;
  let prepaidTotalInterest = 0;

  while (balance > 0.01 && period < 600) { // Safety cap of 50 years / 600 periods
    period++;
    const beginningBalance = balance;
    const interestPaid = balance * periodicRate;
    
    let principalPaid = originalPayment - interestPaid;
    if (principalPaid < 0) principalPaid = 0;

    const extraPaymentPaid = Math.min(input.extraPeriodicPayment || 0, balance - principalPaid);
    let totalPaid = principalPaid + interestPaid + extraPaymentPaid;

    if (principalPaid + extraPaymentPaid >= balance) {
      principalPaid = balance - extraPaymentPaid;
      if (principalPaid < 0) principalPaid = 0;
      totalPaid = principalPaid + interestPaid + extraPaymentPaid;
      balance = 0;
    } else {
      balance = balance - (principalPaid + extraPaymentPaid);
    }

    prepaidTotalInterest += interestPaid;

    schedule.push({
      periodNumber: period,
      beginningBalance: Math.round(beginningBalance * 100) / 100,
      interestPaid: Math.round(interestPaid * 100) / 100,
      principalPaid: Math.round(principalPaid * 100) / 100,
      extraPaymentPaid: Math.round(extraPaymentPaid * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      endingBalance: Math.round(balance * 100) / 100,
    });
  }

  const interestSaved = Math.max(0, originalTotalInterest - prepaidTotalInterest);
  const periodsSaved = Math.max(0, totalPeriods - period);

  return {
    originalPeriodicPayment: Math.round(originalPayment * 100) / 100,
    originalTotalInterest: Math.round(originalTotalInterest * 100) / 100,
    originalTotalPeriods: totalPeriods,
    prepaidTotalInterest: Math.round(prepaidTotalInterest * 100) / 100,
    prepaidTotalPeriods: period,
    interestSaved: Math.round(interestSaved * 100) / 100,
    periodsSaved,
    schedule,
  };
}

// 3. LOAN BALANCE TRANSFER CALCULATOR
export interface BalanceTransferInput {
  outstandingBalance: number;
  currentRatePercent: number;
  remainingYears: number;
  remainingMonths: number;
  
  newRatePercent: number;
  newYears: number;
  newMonths: number;
  processingFees: number;
  otherFees: number;
}

export interface BalanceTransferResult {
  currentPayment: number;
  currentTotalInterest: number;
  newPayment: number;
  newTotalInterest: number;
  totalTransferFees: number;
  monthlyPaymentSavings: number;
  netLifetimeSavings: number;
  breakEvenMonths: number;
}

export function calculateBalanceTransfer(input: BalanceTransferInput): BalanceTransferResult {
  const bal = input.outstandingBalance || 0;
  
  // Current Loan metrics
  const currMonths = (input.remainingYears || 0) * 12 + (input.remainingMonths || 0);
  const currPeriodicRate = (input.currentRatePercent || 0) / 100 / 12;
  let currentPayment = 0;
  if (bal > 0 && currMonths > 0) {
    if (currPeriodicRate === 0) currentPayment = bal / currMonths;
    else currentPayment = (bal * currPeriodicRate * Math.pow(1 + currPeriodicRate, currMonths)) / 
                         (Math.pow(1 + currPeriodicRate, currMonths) - 1);
  }
  const currentTotalInterest = Math.max(0, currentPayment * currMonths - bal);

  // New Loan metrics
  const newMonths = (input.newYears || 0) * 12 + (input.newMonths || 0);
  const newPeriodicRate = (input.newRatePercent || 0) / 100 / 12;
  let newPayment = 0;
  if (bal > 0 && newMonths > 0) {
    if (newPeriodicRate === 0) newPayment = bal / newMonths;
    else newPayment = (bal * newPeriodicRate * Math.pow(1 + newPeriodicRate, newMonths)) / 
                     (Math.pow(1 + newPeriodicRate, newMonths) - 1);
  }
  const newTotalInterest = Math.max(0, newPayment * newMonths - bal);

  const totalTransferFees = (input.processingFees || 0) + (input.otherFees || 0);
  const monthlyPaymentSavings = currentPayment - newPayment;
  const netLifetimeSavings = currentTotalInterest - newTotalInterest - totalTransferFees;

  let breakEvenMonths = 0;
  if (monthlyPaymentSavings > 0.01) {
    breakEvenMonths = totalTransferFees / monthlyPaymentSavings;
  }

  return {
    currentPayment: Math.round(currentPayment * 100) / 100,
    currentTotalInterest: Math.round(currentTotalInterest * 100) / 100,
    newPayment: Math.round(newPayment * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    totalTransferFees: Math.round(totalTransferFees * 100) / 100,
    monthlyPaymentSavings: Math.round(monthlyPaymentSavings * 100) / 100,
    netLifetimeSavings: Math.round(netLifetimeSavings * 100) / 100,
    breakEvenMonths: Math.round(breakEvenMonths * 10) / 10,
  };
}

// 4. DEBT CONSOLIDATION CALCULATOR
export interface IndividualDebt {
  id: string;
  name: string;
  balance: number;
  ratePercent: number;
  monthlyPayment: number;
}

export interface DebtConsolidationInput {
  debts: IndividualDebt[];
  consolidatedRatePercent: number;
  consolidatedYears: number;
  consolidatedMonths: number;
  consolidatedFees: number;
}

export interface DebtConsolidationResult {
  totalExistingBalance: number;
  totalExistingMonthlyPayment: number;
  estimatedExistingTotalInterest: number;
  
  consolidatedMonthlyPayment: number;
  consolidatedTotalInterest: number;
  consolidatedTotalCost: number;
  
  monthlyCashFlowDifference: number;
  netFinancialDifference: number;
  breakEvenMonths: number;
}

export function calculateDebtConsolidation(input: DebtConsolidationInput): DebtConsolidationResult {
  const activeDebts = input.debts.filter(d => (d.balance || 0) > 0);
  const totalExistingBalance = activeDebts.reduce((sum, d) => sum + (d.balance || 0), 0);
  const totalExistingMonthlyPayment = activeDebts.reduce((sum, d) => sum + (d.monthlyPayment || 0), 0);

  // Estimate remaining term & interest for each individual debt
  let estimatedExistingTotalInterest = 0;
  for (const debt of activeDebts) {
    const bal = debt.balance || 0;
    const rate = (debt.ratePercent || 0) / 100 / 12;
    const pmt = debt.monthlyPayment || 0;

    if (bal > 0 && pmt > 0) {
      if (rate === 0) {
        // No interest
        continue;
      }
      if (pmt <= bal * rate) {
        // Payment doesn't cover interest. Assume 30 years payoff for comparison
        const interest30Yr = bal * rate * 12 * 30; 
        estimatedExistingTotalInterest += interest30Yr;
      } else {
        const remainingMonths = Math.log(pmt / (pmt - bal * rate)) / Math.log(1 + rate);
        const estimatedInterest = (pmt * remainingMonths) - bal;
        estimatedExistingTotalInterest += Math.max(0, estimatedInterest);
      }
    }
  }

  // Consolidated calculations
  const totalConsolBalance = totalExistingBalance + (input.consolidatedFees || 0);
  const consMonths = (input.consolidatedYears || 0) * 12 + (input.consolidatedMonths || 0);
  const consPeriodicRate = (input.consolidatedRatePercent || 0) / 100 / 12;

  let consolidatedMonthlyPayment = 0;
  if (totalConsolBalance > 0 && consMonths > 0) {
    if (consPeriodicRate === 0) {
      consolidatedMonthlyPayment = totalConsolBalance / consMonths;
    } else {
      consolidatedMonthlyPayment = (totalConsolBalance * consPeriodicRate * Math.pow(1 + consPeriodicRate, consMonths)) /
                                   (Math.pow(1 + consPeriodicRate, consMonths) - 1);
    }
  }

  const consolidatedTotalInterest = Math.max(0, (consolidatedMonthlyPayment * consMonths) - totalConsolBalance);
  const consolidatedTotalCost = (consolidatedMonthlyPayment * consMonths);

  const monthlyCashFlowDifference = totalExistingMonthlyPayment - consolidatedMonthlyPayment;
  const netFinancialDifference = estimatedExistingTotalInterest - consolidatedTotalInterest - (input.consolidatedFees || 0);

  let breakEvenMonths = 0;
  if (monthlyCashFlowDifference > 0.01 && (input.consolidatedFees || 0) > 0) {
    breakEvenMonths = (input.consolidatedFees || 0) / monthlyCashFlowDifference;
  }

  return {
    totalExistingBalance: Math.round(totalExistingBalance * 100) / 100,
    totalExistingMonthlyPayment: Math.round(totalExistingMonthlyPayment * 100) / 100,
    estimatedExistingTotalInterest: Math.round(estimatedExistingTotalInterest * 100) / 100,
    consolidatedMonthlyPayment: Math.round(consolidatedMonthlyPayment * 100) / 100,
    consolidatedTotalInterest: Math.round(consolidatedTotalInterest * 100) / 100,
    consolidatedTotalCost: Math.round(consolidatedTotalCost * 100) / 100,
    monthlyCashFlowDifference: Math.round(monthlyCashFlowDifference * 100) / 100,
    netFinancialDifference: Math.round(netFinancialDifference * 100) / 100,
    breakEvenMonths: Math.round(breakEvenMonths * 10) / 10,
  };
}

// 5. APR CALCULATOR (NUMERICAL SOLVER)
export interface AprInput {
  loanAmount: number;
  nominalRatePercent: number;
  years: number;
  months: number;
  upfrontFees: number;
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly';
}

export interface AprResult {
  periodicPayment: number;
  totalPayments: number;
  totalInterestPaid: number;
  amountFinanced: number;
  annualPercentRate: number; // The computed APR
  isConverged: boolean;
}

export function calculateAPR(input: AprInput): AprResult {
  const p = input.loanAmount || 0;
  const nominalRate = (input.nominalRatePercent || 0) / 100;
  const totalMonths = (input.years || 0) * 12 + (input.months || 0);
  const fees = input.upfrontFees || 0;

  let freq = 12;
  if (input.paymentFrequency === 'biweekly') freq = 26;
  if (input.paymentFrequency === 'weekly') freq = 52;

  const totalPeriods = Math.round((totalMonths / 12) * freq);
  const periodicRate = nominalRate / freq;

  // 1. Periodic Payment
  let pmt = 0;
  if (p > 0 && totalPeriods > 0) {
    if (periodicRate === 0) {
      pmt = p / totalPeriods;
    } else {
      pmt = (p * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) /
            (Math.pow(1 + periodicRate, totalPeriods) - 1);
    }
  }

  const netAmountFinanced = p - fees;

  // If there are no fees or invalid finances, APR is the nominal rate
  if (fees <= 0 || netAmountFinanced <= 0 || pmt <= 0 || totalPeriods <= 0) {
    return {
      periodicPayment: Math.round(pmt * 100) / 100,
      totalPayments: Math.round(pmt * totalPeriods * 100) / 100,
      totalInterestPaid: Math.round(Math.max(0, pmt * totalPeriods - p) * 100) / 100,
      amountFinanced: Math.round(netAmountFinanced * 100) / 100,
      annualPercentRate: Math.round(input.nominalRatePercent * 100) / 100,
      isConverged: true,
    };
  }

  // 2. Numerical Solver for APR (Secant Method)
  // Target: NetFinanced = PMT * (1 - (1 + r)^-N) / r
  // f(r) = PMT * (1 - (1 + r)^-N) / r - NetFinanced = 0
  const f = (r: number): number => {
    if (r === 0) return pmt * totalPeriods - netAmountFinanced;
    return pmt * (1 - Math.pow(1 + r, -totalPeriods)) / r - netAmountFinanced;
  };

  // Initial guesses for periodic rate
  let r0 = nominalRate / freq;
  let r1 = r0 + 0.001; // Slightly higher rate due to fees

  let iter = 0;
  const maxIterations = 100;
  const tolerance = 1e-8;
  let isConverged = false;

  while (iter < maxIterations) {
    const f0 = f(r0);
    const f1 = f(r1);

    if (Math.abs(f1 - f0) < 1e-12) {
      break;
    }

    const rNew = r1 - f1 * (r1 - r0) / (f1 - f0);

    if (Math.abs(rNew - r1) < tolerance) {
      r1 = rNew;
      isConverged = true;
      break;
    }

    r0 = r1;
    r1 = rNew;
    iter++;
  }

  const annualAPR = r1 * freq * 100;

  return {
    periodicPayment: Math.round(pmt * 100) / 100,
    totalPayments: Math.round(pmt * totalPeriods * 100) / 100,
    totalInterestPaid: Math.round(Math.max(0, pmt * totalPeriods - p) * 100) / 100,
    amountFinanced: Math.round(netAmountFinanced * 100) / 100,
    annualPercentRate: Math.round(annualAPR * 100) / 100,
    isConverged,
  };
}

// 6. EFFECTIVE INTEREST RATE CALCULATOR
export interface EffectiveRateResult {
  nominalRatePercent: number;
  compoundingFrequency: string;
  effectiveAnnualRatePercent: number;
}

export function calculateEffectiveInterestRate(nominalRatePercent: number, frequency: string): EffectiveRateResult {
  const r = nominalRatePercent / 100;
  let ear = 0;

  if (frequency === 'continuous') {
    ear = Math.exp(r) - 1;
  } else {
    let m = 12; // Monthly default
    if (frequency === 'annually') m = 1;
    if (frequency === 'semiannually') m = 2;
    if (frequency === 'quarterly') m = 4;
    if (frequency === 'bimonthly') m = 6;
    if (frequency === 'monthly') m = 12;
    if (frequency === 'biweekly') m = 26;
    if (frequency === 'weekly') m = 52;
    if (frequency === 'daily') m = 365;

    ear = Math.pow(1 + r / m, m) - 1;
  }

  return {
    nominalRatePercent,
    compoundingFrequency: frequency,
    effectiveAnnualRatePercent: Math.round(ear * 10000) / 100,
  };
}

// 7. MORTGAGE PAYOFF CALCULATOR
// Simulates accelerated amortization specifically for home buyers
export interface MortgagePayoffInput {
  mortgageBalance: number;
  interestRatePercent: number;
  remainingYears: number;
  remainingMonths: number;
  extraMonthlyPayment: number;
  oneTimePrepayment: number;
}

export interface MortgagePayoffResult {
  originalPayment: number;
  originalTotalInterest: number;
  originalPayoffMonths: number;
  
  acceleratedTotalInterest: number;
  acceleratedPayoffMonths: number;
  interestSaved: number;
  yearsSaved: number;
  monthsSaved: number;
  
  schedule: AmortizationPeriod[];
}

export function calculateMortgagePayoff(input: MortgagePayoffInput): MortgagePayoffResult {
  // Use prepayment calculation infrastructure as they follow the same amortization loop but with mortgage focus
  const result = calculateLoanPrepayment({
    outstandingPrincipal: input.mortgageBalance,
    annualRatePercent: input.interestRatePercent,
    remainingYears: input.remainingYears,
    remainingMonths: input.remainingMonths,
    extraPeriodicPayment: input.extraMonthlyPayment,
    oneTimePrepayment: input.oneTimePrepayment,
    paymentFrequency: 'monthly',
  });

  const totalOriginalMonths = result.originalTotalPeriods;
  const acceleratedMonths = result.prepaidTotalPeriods;
  const differenceMonths = Math.max(0, totalOriginalMonths - acceleratedMonths);
  const yearsSaved = Math.floor(differenceMonths / 12);
  const monthsSaved = differenceMonths % 12;

  return {
    originalPayment: result.originalPeriodicPayment,
    originalTotalInterest: result.originalTotalInterest,
    originalPayoffMonths: totalOriginalMonths,
    acceleratedTotalInterest: result.prepaidTotalInterest,
    acceleratedPayoffMonths: acceleratedMonths,
    interestSaved: result.interestSaved,
    yearsSaved,
    monthsSaved,
    schedule: result.schedule,
  };
}

// 8. MORTGAGE REFINANCE CALCULATOR
export interface MortgageRefinanceInput {
  remainingBalance: number;
  currentRatePercent: number;
  remainingYears: number;
  remainingMonths: number;
  
  newRatePercent: number;
  newYears: number;
  newMonths: number;
  refinanceCosts: number;
}

export interface MortgageRefinanceResult {
  currentMonthlyPayment: number;
  currentTotalInterest: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  refinanceCosts: number;
  monthlySavings: number;
  netLifetimeSavings: number;
  breakEvenMonths: number;
}

export function calculateMortgageRefinance(input: MortgageRefinanceInput): MortgageRefinanceResult {
  const result = calculateBalanceTransfer({
    outstandingBalance: input.remainingBalance,
    currentRatePercent: input.currentRatePercent,
    remainingYears: input.remainingYears,
    remainingMonths: input.remainingMonths,
    newRatePercent: input.newRatePercent,
    newYears: input.newYears,
    newMonths: input.newMonths,
    processingFees: input.refinanceCosts,
    otherFees: 0,
  });

  return {
    currentMonthlyPayment: result.currentPayment,
    currentTotalInterest: result.currentTotalInterest,
    newMonthlyPayment: result.newPayment,
    newTotalInterest: result.newTotalInterest,
    refinanceCosts: result.totalTransferFees,
    monthlySavings: result.monthlyPaymentSavings,
    netLifetimeSavings: result.netLifetimeSavings,
    breakEvenMonths: result.breakEvenMonths,
  };
}

// 9. CLOSING COST CALCULATOR
export interface ClosingCostItem {
  name: string;
  value: number;
  isPercentage: boolean;
}

export interface ClosingCostInput {
  purchasePrice: number;
  downPaymentPercent: number;
  lenderOriginationFee: number; // Flat
  lenderPointsPercent: number; // % of loan
  appraisalFee: number;
  inspectionFee: number;
  titleInsurancePercent: number; // % of price
  legalAttorneyFee: number;
  transferTaxPercent: number; // % of price
  homeownersInsurance: number; // Annual
  escrowPrepaids: number; // Flat
  otherFees: number;
}

export interface ClosingCostResult {
  purchasePrice: number;
  downPaymentAmount: number;
  loanAmount: number;
  
  lenderPointsFee: number;
  titleInsuranceFee: number;
  transferTaxFee: number;
  
  totalClosingCosts: number;
  closingCostPercentage: number;
  cashRequiredAtClosing: number;
  totalPropertyAcquisitionCost: number;
}

export function calculateClosingCosts(input: ClosingCostInput): ClosingCostResult {
  const price = input.purchasePrice || 0;
  const downPaymentAmount = price * ((input.downPaymentPercent || 0) / 100);
  const loanAmount = Math.max(0, price - downPaymentAmount);

  const lenderPointsFee = loanAmount * ((input.lenderPointsPercent || 0) / 100);
  const titleInsuranceFee = price * ((input.titleInsurancePercent || 0) / 100);
  const transferTaxFee = price * ((input.transferTaxPercent || 0) / 100);

  const totalClosingCosts =
    (input.lenderOriginationFee || 0) +
    lenderPointsFee +
    (input.appraisalFee || 0) +
    (input.inspectionFee || 0) +
    titleInsuranceFee +
    (input.legalAttorneyFee || 0) +
    transferTaxFee +
    (input.homeownersInsurance || 0) +
    (input.escrowPrepaids || 0) +
    (input.otherFees || 0);

  const closingCostPercentage = price > 0 ? (totalClosingCosts / price) * 100 : 0;
  const cashRequiredAtClosing = downPaymentAmount + totalClosingCosts;
  const totalPropertyAcquisitionCost = price + totalClosingCosts;

  return {
    purchasePrice: price,
    downPaymentAmount: Math.round(downPaymentAmount),
    loanAmount: Math.round(loanAmount),
    lenderPointsFee: Math.round(lenderPointsFee),
    titleInsuranceFee: Math.round(titleInsuranceFee),
    transferTaxFee: Math.round(transferTaxFee),
    totalClosingCosts: Math.round(totalClosingCosts),
    closingCostPercentage: Math.round(closingCostPercentage * 100) / 100,
    cashRequiredAtClosing: Math.round(cashRequiredAtClosing),
    totalPropertyAcquisitionCost: Math.round(totalPropertyAcquisitionCost),
  };
}
