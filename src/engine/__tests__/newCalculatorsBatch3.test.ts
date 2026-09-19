import {
  calculatePortfolioAllocation,
  calculateAssetAllocation,
  calculateSIPVsLumpsum,
  calculateMultiGoalPlanner,
  calculateRetirementIncome,
  calculateAnnuity,
} from '../newCalculatorsBatch3';

export function runNewCalculatorsBatch3Tests() {
  console.log('🧪 Starting Formula Verification Gate for Next Batch (Batch 3) Calculators...');

  // 1. Portfolio Allocation
  const paRes = calculatePortfolioAllocation([
    { name: 'Equity', value: 50000 },
    { name: 'Debt', value: 30000 },
    { name: 'Cash', value: 20000 },
  ]);
  if (paRes.totalValue !== 100000) throw new Error('Portfolio Allocation totalValue mismatch');
  if (paRes.allocations[0].percentage !== 50) throw new Error('Portfolio Allocation first category percentage mismatch');
  if (paRes.allocations[1].percentage !== 30) throw new Error('Portfolio Allocation second category percentage mismatch');
  console.log('  ✓ calculatePortfolioAllocation passed');

  // 2. Asset Allocation
  const aaRes = calculateAssetAllocation([
    { category: 'Equity', currentValue: 40000, targetPercent: 50 },
    { category: 'Debt', currentValue: 60000, targetPercent: 50 },
  ]);
  if (aaRes.totalCurrentValue !== 100000) throw new Error('Asset Allocation totalCurrentValue mismatch');
  if (aaRes.items[0].targetValue !== 50000) throw new Error('Asset Allocation target value mismatch');
  if (aaRes.items[0].requiredAdjustment !== 10000) throw new Error('Asset Allocation requiredAdjustment mismatch');
  if (aaRes.items[0].action !== 'Buy') throw new Error('Asset Allocation adjustment action mismatch');
  console.log('  ✓ calculateAssetAllocation passed');

  // 3. SIP vs Lumpsum
  const svlRes = calculateSIPVsLumpsum({
    expectedReturnPercent: 12,
    years: 5,
    months: 0,
    sipAmount: 2000,
    lumpSumAmount: 120000,
    frequency: 'monthly',
  });
  if (svlRes === null) throw new Error('SIP vs Lumpsum unexpected null result');
  if (svlRes.lumpSumTotalInvested !== 120000) throw new Error('SIP vs Lumpsum total lump sum invested mismatch');
  if (svlRes.sipTotalInvested !== 120000) throw new Error('SIP vs Lumpsum total SIP invested mismatch');
  if (svlRes.lumpSumFutureValue <= svlRes.sipFutureValue) {
    throw new Error('SIP vs Lumpsum future value relationship mismatch');
  }
  console.log('  ✓ calculateSIPVsLumpsum passed');

  // 4. Multi-Goal Investment Planner
  const mgRes = calculateMultiGoalPlanner(
    [
      { id: 'g1', name: 'Home Fund', targetAmountToday: 100000, yearsToGoal: 5 },
      { id: 'g2', name: 'School Fund', targetAmountToday: 200000, yearsToGoal: 10 },
    ],
    10, // return
    5 // inflation
  );
  if (mgRes.totalTargetToday !== 300000) throw new Error('Multi-Goal total target today mismatch');
  if (mgRes.totalTargetFuture <= 300000) throw new Error('Multi-Goal inflation target growth mismatch');
  if (mgRes.totalRequiredMonthlySip <= 0) throw new Error('Multi-Goal required monthly saving mismatch');
  console.log('  ✓ calculateMultiGoalPlanner passed');

  // 5. Retirement Income Calculator
  const riRes = calculateRetirementIncome({
    currentCorpus: 500000,
    expectedAnnualReturnPercent: 6,
    inflationPercent: 4,
    retirementYears: 20,
    initialMonthlyWithdrawal: 3000,
    inflationAdjusted: true,
  });
  if (riRes.totalIncomeWithdrawn <= 0) throw new Error('Retirement Income total income withdrawn mismatch');
  if (riRes.schedule.length === 0) throw new Error('Retirement Income schedule timeline mismatch');
  console.log('  ✓ calculateRetirementIncome passed');

  // 6. Annuity Calculator
  const annRes = calculateAnnuity({
    principalAmount: 100000,
    regularPayment: 0,
    expectedReturnPercent: 5,
    years: 10,
    frequency: 'monthly',
    type: 'ordinary',
    mode: 'calculate-payment',
  });
  if (annRes.calculatedAmount <= 0) throw new Error('Annuity payment amount mismatch');
  if (annRes.totalPayments <= 100000) throw new Error('Annuity total cumulative payments mismatch');
  console.log('  ✓ calculateAnnuity passed');

  console.log('🎉 All Batch 3 Formula Verification Tests Passed Successfully!');
}
