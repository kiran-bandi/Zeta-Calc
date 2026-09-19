import {
  calculateNetWorth,
  calculateSavingsRate,
  calculateDTI,
  calculateFutureValue,
  calculatePresentValue,
  calculateRealRateOfReturn,
  calculateCoastFIRE,
  calculateDividendYield,
  calculateStockAveragePrice,
  calculateStockProfitLoss,
  calculateSalaryIncrease,
  calculateOvertimePay,
  calculateMarkup,
  calculateOneRepMax,
  calculateBodySurfaceArea,
  calculatePercentChange,
  calculateQuadratic,
  calculateGCD,
  calculateLCM,
  calculateDownPayment,
  calculateHomeEquity,
} from '../newCalculators';

export function runNewCalculatorsTests() {
  console.log('🧪 Starting Formula Verification Gate for New Calculators...');

  // 1. Net Worth
  const nw = calculateNetWorth(
    { cash: 20000, investments: 80000, realEstate: 400000, retirement: 150000 },
    { mortgages: 250000, autoLoans: 25000, creditCards: 5000 }
  );
  if (nw.totalAssets !== 650000) throw new Error(`Net worth totalAssets mismatch: ${nw.totalAssets}`);
  if (nw.totalLiabilities !== 280000) throw new Error(`Net worth totalLiabilities mismatch: ${nw.totalLiabilities}`);
  if (nw.netWorth !== 370000) throw new Error(`Net worth mismatch: ${nw.netWorth}`);
  console.log('  ✓ calculateNetWorth passed');

  // 2. Savings Rate
  const sr = calculateSavingsRate({ grossMonthlyIncome: 10000, monthlySavings: 2500, monthlyTaxes: 2000 });
  if (sr.grossSavingsRate !== 25) throw new Error(`Gross savings rate mismatch: ${sr.grossSavingsRate}`);
  if (sr.netSavingsRate !== 31.3) throw new Error(`Net savings rate mismatch: ${sr.netSavingsRate}`);
  if (sr.annualSavings !== 30000) throw new Error(`Annual savings mismatch: ${sr.annualSavings}`);
  console.log('  ✓ calculateSavingsRate passed');

  // 3. DTI
  const dti = calculateDTI({ grossMonthlyIncome: 8000, monthlyHousingExpense: 2000, otherMonthlyDebtPayments: 800 });
  if (dti.frontEndDti !== 25) throw new Error(`Front-end DTI mismatch: ${dti.frontEndDti}`);
  if (dti.backEndDti !== 35) throw new Error(`Back-end DTI mismatch: ${dti.backEndDti}`);
  if (dti.status !== 'good') throw new Error(`DTI status mismatch: ${dti.status}`);
  console.log('  ✓ calculateDTI passed');

  // 4. Future Value (FV)
  // PV = $10,000, PMT = $500/mo, 8% annual, 10 years, monthly compounding
  const fv = calculateFutureValue({
    presentValue: 10000,
    periodicPayment: 500,
    annualRatePercent: 8,
    years: 10,
    compoundFrequency: 12,
  });
  // Standard financial math: PV grown = 10000 * (1 + 0.08/12)^120 = 22,196.40
  // PMT grown = 500 * (((1 + 0.08/12)^120 - 1) / (0.08/12)) = 91,473.02
  // Total FV ≈ 113,670
  if (Math.abs(fv.futureValue - 113670) > 10) {
    throw new Error(`Future Value formula divergence: expected ~113670, got ${fv.futureValue}`);
  }
  if (fv.totalInvested !== 70000) throw new Error(`FV totalInvested mismatch: ${fv.totalInvested}`);
  console.log('  ✓ calculateFutureValue passed');

  // 5. Present Value (PV)
  // Target FV = $100,000 in 10 years at 7% compounded annually
  const pv = calculatePresentValue({
    futureValue: 100000,
    annualRatePercent: 7,
    years: 10,
    compoundFrequency: 1,
  });
  // 100000 / (1.07)^10 = 50,834.93
  if (Math.abs(pv.presentValue - 50835) > 5) {
    throw new Error(`Present Value formula divergence: expected ~50835, got ${pv.presentValue}`);
  }
  console.log('  ✓ calculatePresentValue passed');

  // 6. Real Rate of Return (Fisher equation)
  // Nominal = 10%, Inflation = 3% -> (1.10 / 1.03) - 1 = 0.06796 (6.8%)
  const realReturn = calculateRealRateOfReturn({
    nominalRatePercent: 10,
    inflationRatePercent: 3,
    investmentAmount: 100000,
    years: 5,
  });
  if (realReturn.realRatePercent !== 6.8) {
    throw new Error(`Real return calculation mismatch: ${realReturn.realRatePercent}`);
  }
  console.log('  ✓ calculateRealRateOfReturn passed');

  // 7. Coast FIRE
  // Age 30 to 60 (30 yrs), expenses $60,000/yr, SWR 4% -> Target corpus = $1,500,000
  // At 7% return, factor = 1.07^30 = 7.612255 -> Required coast amount = 1500000 / 7.612255 ≈ $197,051
  const coast = calculateCoastFIRE({
    currentAge: 30,
    targetRetirementAge: 60,
    annualRetirementExpenses: 60000,
    currentSavings: 250000,
    expectedReturnRatePercent: 7,
    safeWithdrawalRatePercent: 4,
  });
  if (coast.targetRetirementCorpus !== 1500000) throw new Error(`Target retirement corpus mismatch: ${coast.targetRetirementCorpus}`);
  if (Math.abs(coast.requiredCoastAmount - 197051) > 20) {
    throw new Error(`Coast amount formula divergence: got ${coast.requiredCoastAmount}`);
  }
  if (!coast.hasReachedCoast) throw new Error('Coast status should be true');
  console.log('  ✓ calculateCoastFIRE passed');

  // 8. Dividend Yield
  const div = calculateDividendYield({
    stockPrice: 150,
    annualDividendPerShare: 4.5,
    sharesOwned: 200,
  });
  if (div.dividendYieldPercent !== 3) throw new Error(`Dividend yield mismatch: ${div.dividendYieldPercent}`);
  if (div.annualDividendIncome !== 900) throw new Error(`Annual dividend income mismatch: ${div.annualDividendIncome}`);
  if (div.monthlyDividendIncome !== 75) throw new Error(`Monthly dividend income mismatch: ${div.monthlyDividendIncome}`);
  console.log('  ✓ calculateDividendYield passed');

  // 9. Stock Average Price
  const stockAvg = calculateStockAveragePrice([
    { shares: 10, price: 100 },
    { shares: 20, price: 130 },
  ]);
  // Total cost = 1000 + 2600 = 3600 / 30 = 120
  if (stockAvg.averagePrice !== 120) throw new Error(`Stock average price mismatch: ${stockAvg.averagePrice}`);
  if (stockAvg.totalShares !== 30) throw new Error(`Total shares mismatch: ${stockAvg.totalShares}`);
  console.log('  ✓ calculateStockAveragePrice passed');

  // 10. Stock Profit/Loss
  const pnl = calculateStockProfitLoss({
    buyPrice: 50,
    sellPrice: 75,
    shares: 100,
    commission: 10,
  });
  if (pnl.totalCost !== 5010) throw new Error(`Total cost mismatch: ${pnl.totalCost}`);
  if (pnl.totalProceeds !== 7500) throw new Error(`Total proceeds mismatch: ${pnl.totalProceeds}`);
  if (pnl.netProfit !== 2490) throw new Error(`Net profit mismatch: ${pnl.netProfit}`);
  console.log('  ✓ calculateStockProfitLoss passed');

  // 11. Salary Increase
  const sal = calculateSalaryIncrease({ currentSalary: 80000, newSalary: 96000 });
  if (sal.absoluteIncrease !== 16000) throw new Error(`Absolute increase mismatch: ${sal.absoluteIncrease}`);
  if (sal.percentageIncrease !== 20) throw new Error(`Percentage increase mismatch: ${sal.percentageIncrease}`);
  console.log('  ✓ calculateSalaryIncrease passed');

  // 12. Overtime Pay
  const ot = calculateOvertimePay({ hourlyRate: 30, regularHours: 40, overtimeHours: 10 });
  if (ot.regularPay !== 1200) throw new Error(`Regular pay mismatch: ${ot.regularPay}`);
  if (ot.overtimePay !== 450) throw new Error(`Overtime pay mismatch: ${ot.overtimePay}`);
  if (ot.totalPay !== 1650) throw new Error(`Total pay mismatch: ${ot.totalPay}`);
  if (ot.effectiveHourlyRate !== 33) throw new Error(`Effective rate mismatch: ${ot.effectiveHourlyRate}`);
  console.log('  ✓ calculateOvertimePay passed');

  // 13. Markup & Margin
  const markup = calculateMarkup({ cost: 80, sellingPrice: 100 });
  if (markup.grossProfit !== 20) throw new Error(`Gross profit mismatch: ${markup.grossProfit}`);
  if (markup.markupPercent !== 25) throw new Error(`Markup percentage mismatch: ${markup.markupPercent}`);
  if (markup.grossMarginPercent !== 20) throw new Error(`Margin percentage mismatch: ${markup.grossMarginPercent}`);
  console.log('  ✓ calculateMarkup passed');

  // 14. One Rep Max (Epley)
  const orm = calculateOneRepMax(200, 5);
  // 200 * (1 + 5/30) = 200 * 1.16666 = 233.3
  if (orm.oneRepMax !== 233.3) throw new Error(`1RM mismatch: ${orm.oneRepMax}`);
  console.log('  ✓ calculateOneRepMax passed');

  // 15. Mosteller BSA
  const bsa = calculateBodySurfaceArea(180, 80);
  // sqrt(180 * 80 / 3600) = sqrt(4) = 2.0
  if (bsa !== 2) throw new Error(`BSA mismatch: ${bsa}`);
  console.log('  ✓ calculateBodySurfaceArea passed');

  // 16. Percent Change
  const pctChg = calculatePercentChange(50, 75);
  if (pctChg.percentageChange !== 50) throw new Error(`Percent change mismatch: ${pctChg.percentageChange}`);
  if (pctChg.direction !== 'increase') throw new Error(`Direction mismatch: ${pctChg.direction}`);
  console.log('  ✓ calculatePercentChange passed');

  // 17. Quadratic
  const quad = calculateQuadratic(1, -5, 6);
  if (quad.type !== 'two_real' || quad.root1.real !== 3 || quad.root2?.real !== 2) {
    throw new Error(`Quadratic roots mismatch: ${JSON.stringify(quad)}`);
  }
  console.log('  ✓ calculateQuadratic passed');

  // 18. LCM & GCD
  if (calculateGCD(24, 36) !== 12) throw new Error('GCD mismatch');
  if (calculateLCM(24, 36) !== 72) throw new Error('LCM mismatch');
  console.log('  ✓ calculateLCMGCD passed');

  // 19. Down Payment
  const dp = calculateDownPayment(500000, 100000);
  if (dp.downPaymentPercent !== 20) throw new Error(`Down payment percent mismatch: ${dp.downPaymentPercent}`);
  if (dp.loanAmount !== 400000) throw new Error(`Loan amount mismatch: ${dp.loanAmount}`);
  if (dp.pmiRequired !== false) throw new Error(`PMI should not be required at 20%`);
  console.log('  ✓ calculateDownPayment passed');

  // 20. Home Equity
  const equity = calculateHomeEquity(600000, 350000);
  if (equity.equityAmount !== 250000) throw new Error(`Equity mismatch: ${equity.equityAmount}`);
  if (Math.abs(equity.equityPercent - 41.7) > 0.1) throw new Error(`Equity percent mismatch: ${equity.equityPercent}`);
  if (equity.maxBorrowableCashOut !== 130000) throw new Error(`Cash out mismatch: ${equity.maxBorrowableCashOut}`);
  console.log('  ✓ calculateHomeEquity passed');

  console.log('✅ ALL 20 NEW CALCULATOR FORMULAS VERIFIED 100% ACCURATE.');
}
