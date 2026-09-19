import {
  calculateLoanComparison,
  calculateLoanPrepayment,
  calculateBalanceTransfer,
  calculateDebtConsolidation,
  calculateAPR,
  calculateEffectiveInterestRate,
  calculateMortgagePayoff,
  calculateMortgageRefinance,
  calculateClosingCosts,
} from '../newCalculatorsBatch2';

export function runNewCalculatorsBatch2Tests() {
  console.log('🧪 Starting Formula Verification Gate for Next Batch (Batch 2) Calculators...');

  // 1. Loan Comparison
  const lcResult = calculateLoanComparison([
    {
      id: 'loan-a',
      name: 'Loan A',
      principal: 100000,
      annualRatePercent: 5.0,
      years: 15,
      months: 0,
      upfrontFees: 1000,
      paymentFrequency: 'monthly',
    },
    {
      id: 'loan-b',
      name: 'Loan B',
      principal: 100000,
      annualRatePercent: 4.5,
      years: 15,
      months: 0,
      upfrontFees: 2500,
      paymentFrequency: 'monthly',
    },
  ]);

  if (lcResult.options.length !== 2) throw new Error('Loan Comparison options length mismatch');
  if (lcResult.options[1].periodicPayment >= lcResult.options[0].periodicPayment) {
    throw new Error('Loan Comparison payment inequality mismatch');
  }
  if (lcResult.cheapestByPaymentId !== 'loan-b') throw new Error('Loan Comparison cheapestByPaymentId mismatch');
  console.log('  ✓ calculateLoanComparison passed');

  // 2. Loan Prepayment
  const lpResult = calculateLoanPrepayment({
    outstandingPrincipal: 100000,
    annualRatePercent: 6.0,
    remainingYears: 10,
    remainingMonths: 0,
    extraPeriodicPayment: 200,
    oneTimePrepayment: 5000,
    paymentFrequency: 'monthly',
  });

  if (lpResult.originalTotalPeriods !== 120) throw new Error('Loan Prepayment periods mismatch');
  if (lpResult.prepaidTotalPeriods >= 120) throw new Error('Loan Prepayment early payoff periods mismatch');
  if (lpResult.interestSaved <= 0) throw new Error('Loan Prepayment interest saved mismatch');
  if (lpResult.schedule.length === 0) throw new Error('Loan Prepayment schedule mismatch');
  console.log('  ✓ calculateLoanPrepayment passed');

  // 3. Balance Transfer
  const btResult = calculateBalanceTransfer({
    outstandingBalance: 150000,
    currentRatePercent: 8.5,
    remainingYears: 15,
    remainingMonths: 0,
    newRatePercent: 6.0,
    newYears: 15,
    newMonths: 0,
    processingFees: 1500,
    otherFees: 300,
  });

  if (btResult.monthlyPaymentSavings <= 0) throw new Error('Balance Transfer monthly savings mismatch');
  if (btResult.netLifetimeSavings <= 0) throw new Error('Balance Transfer lifetime savings mismatch');
  if (Math.abs(btResult.breakEvenMonths - 8.5) > 0.1) throw new Error('Balance Transfer break-even period mismatch');
  console.log('  ✓ calculateBalanceTransfer passed');

  // 4. Debt Consolidation
  const dcResult = calculateDebtConsolidation({
    debts: [
      { id: 'cc1', name: 'Credit Card A', balance: 5000, ratePercent: 18.0, monthlyPayment: 150 },
      { id: 'cc2', name: 'Credit Card B', balance: 8000, ratePercent: 21.0, monthlyPayment: 250 },
    ],
    consolidatedRatePercent: 8.5,
    consolidatedYears: 5,
    consolidatedMonths: 0,
    consolidatedFees: 500,
  });

  if (dcResult.totalExistingBalance !== 13000) throw new Error('Debt Consolidation balance sum mismatch');
  if (dcResult.totalExistingMonthlyPayment !== 400) throw new Error('Debt Consolidation existing payments sum mismatch');
  if (Math.abs(dcResult.consolidatedMonthlyPayment - 276.97) > 0.5) {
    throw new Error(`Debt Consolidation payment mismatch: ${dcResult.consolidatedMonthlyPayment}`);
  }
  console.log('  ✓ calculateDebtConsolidation passed');

  // 5. APR Numerical Solver
  const aprResult = calculateAPR({
    loanAmount: 100000,
    nominalRatePercent: 5.0,
    years: 15,
    months: 0,
    upfrontFees: 3000,
    paymentFrequency: 'monthly',
  });

  if (aprResult.annualPercentRate <= 5.0) throw new Error('APR numerical solver rate mismatch');
  if (!aprResult.isConverged) throw new Error('APR numerical solver convergence mismatch');
  console.log('  ✓ calculateAPR passed');

  // 6. Effective Interest Rate
  const effMonthly = calculateEffectiveInterestRate(6.0, 'monthly');
  if (Math.abs(effMonthly.effectiveAnnualRatePercent - 6.17) > 0.05) {
    throw new Error('Effective Interest Rate monthly EAR mismatch');
  }

  const effContinuous = calculateEffectiveInterestRate(6.0, 'continuous');
  if (Math.abs(effContinuous.effectiveAnnualRatePercent - 6.18) > 0.05) {
    throw new Error('Effective Interest Rate continuous EAR mismatch');
  }
  console.log('  ✓ calculateEffectiveInterestRate passed');

  // 7. Mortgage Payoff
  const mpoResult = calculateMortgagePayoff({
    mortgageBalance: 300000,
    interestRatePercent: 6.5,
    remainingYears: 25,
    remainingMonths: 0,
    extraMonthlyPayment: 300,
    oneTimePrepayment: 10000,
  });

  if (mpoResult.interestSaved <= 0) throw new Error('Mortgage Payoff interest savings mismatch');
  if (mpoResult.acceleratedPayoffMonths >= 300) throw new Error('Mortgage Payoff payoff timing mismatch');
  console.log('  ✓ calculateMortgagePayoff passed');

  // 8. Mortgage Refinance
  const mrfResult = calculateMortgageRefinance({
    remainingBalance: 250000,
    currentRatePercent: 7.0,
    remainingYears: 20,
    remainingMonths: 0,
    newRatePercent: 5.5,
    newYears: 20,
    newMonths: 0,
    refinanceCosts: 5000,
  });

  if (mrfResult.monthlySavings <= 0) throw new Error('Mortgage Refinance monthly savings mismatch');
  if (mrfResult.netLifetimeSavings <= 0) throw new Error('Mortgage Refinance net lifetime savings mismatch');
  if (Math.abs(mrfResult.breakEvenMonths - 22.9) > 0.1) throw new Error('Mortgage Refinance breakeven mismatch');
  console.log('  ✓ calculateMortgageRefinance passed');

  // 9. Closing Costs
  const ccResult = calculateClosingCosts({
    purchasePrice: 400000,
    downPaymentPercent: 20,
    lenderOriginationFee: 1500,
    lenderPointsPercent: 1,
    appraisalFee: 500,
    inspectionFee: 350,
    titleInsurancePercent: 0.5,
    legalAttorneyFee: 800,
    transferTaxPercent: 1.0,
    homeownersInsurance: 1200,
    escrowPrepaids: 1000,
    otherFees: 300,
  });

  if (ccResult.purchasePrice !== 400000) throw new Error('Closing Cost purchasePrice mismatch');
  if (ccResult.downPaymentAmount !== 80000) throw new Error('Closing Cost downPaymentAmount mismatch');
  if (ccResult.loanAmount !== 320000) throw new Error('Closing Cost loanAmount mismatch');
  if (ccResult.lenderPointsFee !== 3200) throw new Error('Closing Cost lenderPointsFee mismatch');
  if (ccResult.titleInsuranceFee !== 2000) throw new Error('Closing Cost titleInsuranceFee mismatch');
  if (ccResult.transferTaxFee !== 4000) throw new Error('Closing Cost transferTaxFee mismatch');
  if (ccResult.totalClosingCosts !== 14850) throw new Error('Closing Cost totalClosingCosts mismatch');
  if (ccResult.cashRequiredAtClosing !== 94850) throw new Error('Closing Cost cashRequiredAtClosing mismatch');
  console.log('  ✓ calculateClosingCosts passed');
}
