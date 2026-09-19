import { calculateRentVsBuy } from '../propertyHomeBuying';
import { calculateSingleTaxScenario, calculateTaxImpactComparison } from '../taxImpactEngine';
import { calculateWealthGoal } from '../wealthGoalEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

export function runThreeCalculatorsTests() {
  console.log('--- STARTING 3 HIGH-VALUE CALCULATORS VERIFICATION SUITE ---');

  // =========================================================================
  // 1. BUY VS RENT CALCULATOR TESTS
  // =========================================================================
  console.log('--- 1. BUY VS RENT ENGINE TESTS ---');

  // 1. Zero-interest loan
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 0,
      loanTermYears: 20,
      monthlyRent: 1200,
      timeHorizonYears: 10,
    });
    assert(res.monthlyEMI === 1000, `0% interest EMI expected 1000, got ${res.monthlyEMI}`);
    assert(res.outstandingLoanAtEnd === 120000, `Outstanding loan at year 10 expected 120000, got ${res.outstandingLoanAtEnd}`);
  }

  // 2. Normal amortizing loan
  {
    const res = calculateRentVsBuy({
      homePrice: 500000,
      downPayment: 100000,
      loanInterestRate: 6,
      loanTermYears: 30,
      monthlyRent: 2000,
      timeHorizonYears: 15,
    });
    assert(res.monthlyEMI > 2300 && res.monthlyEMI < 2500, `Normal EMI expected ~2398, got ${res.monthlyEMI}`);
    assert(res.loanAmount === 400000, `Loan amount expected 400000, got ${res.loanAmount}`);
  }

  // 3. Zero appreciation
  {
    const res = calculateRentVsBuy({
      homePrice: 400000,
      downPayment: 80000,
      loanInterestRate: 5,
      loanTermYears: 30,
      monthlyRent: 1500,
      propertyAppreciationRate: 0,
      timeHorizonYears: 10,
    });
    assert(res.finalHomeValue === 400000, `0% appreciation home value expected 400000, got ${res.finalHomeValue}`);
  }

  // 4. Positive appreciation
  {
    const res = calculateRentVsBuy({
      homePrice: 400000,
      downPayment: 80000,
      loanInterestRate: 5,
      loanTermYears: 30,
      monthlyRent: 1500,
      propertyAppreciationRate: 4,
      timeHorizonYears: 10,
    });
    assert(res.finalHomeValue > 400000, `Positive appreciation should increase value, got ${res.finalHomeValue}`);
  }

  // 5. Zero rent growth
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 1000,
      annualRentIncrease: 0,
      timeHorizonYears: 5,
    });
    assert(res.totalRentPaid === 1000 * 12 * 5, `Zero rent growth should equal 60000, got ${res.totalRentPaid}`);
  }

  // 6. Positive rent growth
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 1000,
      annualRentIncrease: 5,
      timeHorizonYears: 5,
    });
    assert(res.totalRentPaid > 60000, `Rent with 5% annual increase should exceed 60000, got ${res.totalRentPaid}`);
  }

  // 7. Zero investment return
  {
    const res = calculateRentVsBuy({
      homePrice: 200000,
      downPayment: 40000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 800,
      investmentReturnRate: 0,
      timeHorizonYears: 5,
    });
    assert(res.netWealthRenting >= 40000, `Zero investment return renter portfolio should reflect principal, got ${res.netWealthRenting}`);
  }

  // 8. Positive investment return
  {
    const res = calculateRentVsBuy({
      homePrice: 200000,
      downPayment: 40000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 800,
      investmentReturnRate: 10,
      timeHorizonYears: 5,
    });
    assert(res.netWealthRenting > 40000, `Positive return portfolio should exceed 40000, got ${res.netWealthRenting}`);
  }

  // 9. Down payment amount mode
  {
    const res = calculateRentVsBuy({
      homePrice: 500000,
      downPaymentMode: 'amount',
      downPayment: 150000,
      loanInterestRate: 5,
      loanTermYears: 20,
      monthlyRent: 1500,
      timeHorizonYears: 10,
    });
    assert(res.loanAmount === 350000, `Expected loan 350000, got ${res.loanAmount}`);
  }

  // 10. Down payment percentage mode
  {
    const res = calculateRentVsBuy({
      homePrice: 500000,
      downPaymentMode: 'percentage',
      downPayment: 0,
      downPaymentPercent: 25,
      loanInterestRate: 5,
      loanTermYears: 20,
      monthlyRent: 1500,
      timeHorizonYears: 10,
    });
    assert(res.loanAmount === 375000, `Expected loan 375000 with 25% down, got ${res.loanAmount}`);
  }

  // 11. Horizon shorter than loan term
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 30,
      monthlyRent: 1200,
      timeHorizonYears: 10,
    });
    assert(res.outstandingLoanAtEnd > 0, `Loan should have remaining balance at year 10 of 30, got ${res.outstandingLoanAtEnd}`);
  }

  // 12. Horizon longer than loan term
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 1200,
      timeHorizonYears: 20,
    });
    assert(res.outstandingLoanAtEnd === 0, `Loan should be fully paid off at year 20 for 15y term, got ${res.outstandingLoanAtEnd}`);
  }

  // 13. Selling costs
  {
    const res = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 1200,
      propertyAppreciationRate: 0,
      sellingCostMode: 'percentage',
      sellingCostValue: 6,
      timeHorizonYears: 15,
    });
    // Final property value is 300000, loan is 0, selling cost is 18000 -> net equity 282000
    assert(res.netWealthBuying === 282000, `Net wealth buying after 6% sell cost expected 282000, got ${res.netWealthBuying}`);
  }

  // 14. Ownership costs
  {
    const resFixed = calculateRentVsBuy({
      homePrice: 300000,
      downPayment: 60000,
      loanInterestRate: 4,
      loanTermYears: 15,
      monthlyRent: 1200,
      ownershipCostMode: 'fixed',
      annualOwnershipCost: 3000,
      timeHorizonYears: 5,
    });
    assert(resFixed.totalOwnershipCosts >= 15000, `Ownership costs should be tracked, got ${resFixed.totalOwnershipCosts}`);
  }

  // 15. No break-even
  {
    const res = calculateRentVsBuy({
      homePrice: 1000000,
      downPayment: 200000,
      loanInterestRate: 10,
      loanTermYears: 30,
      monthlyRent: 500, // Very cheap rent vs expensive home
      propertyAppreciationRate: 1,
      investmentReturnRate: 12,
      timeHorizonYears: 10,
    });
    assert(res.breakEvenYear === null, 'Expected no break-even when rent is artificially tiny and investments outperform');
  }

  // 16. Break-even scenario
  {
    const res = calculateRentVsBuy({
      homePrice: 250000,
      downPayment: 50000,
      loanInterestRate: 3.5,
      loanTermYears: 20,
      monthlyRent: 2000, // Expensive rent
      propertyAppreciationRate: 5,
      investmentReturnRate: 5,
      timeHorizonYears: 15,
    });
    assert(res.breakEvenYear !== null, `Break even expected within 15 years, got year ${res.breakEvenYear}`);
  }

  // 17. Blank input state / zero price
  {
    const res = calculateRentVsBuy({
      homePrice: 0,
      downPayment: 0,
      loanInterestRate: 0,
      loanTermYears: 0,
      monthlyRent: 0,
      timeHorizonYears: 0,
    });
    assert(res.finalHomeValue === 0 && res.monthlyEMI === 0, 'Zero home price handled cleanly with zero outputs');
  }

  // 18. Reset state representation
  {
    const res = calculateRentVsBuy({
      homePrice: 0,
      downPayment: 0,
      loanInterestRate: 0,
      loanTermYears: 1,
      monthlyRent: 0,
      timeHorizonYears: 1,
    });
    assert(res.netWealthBuying === 0 && res.netWealthRenting === 0, 'Reset / zero state outputs 0');
  }

  // =========================================================================
  // 2. TAX IMPACT / TAX SCENARIO CALCULATOR TESTS
  // =========================================================================
  console.log('--- 2. TAX IMPACT ENGINE TESTS ---');

  // 1. Zero income
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 0,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 20,
    });
    assert(res.estimatedTax === 0 && res.taxableIncome === 0, 'Zero income results in 0 tax');
  }

  // 2. Basic effective-rate calculation
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 100000,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 25,
    });
    assert(res.taxableIncome === 100000, `Taxable income expected 100000, got ${res.taxableIncome}`);
    assert(res.estimatedTax === 25000, `Estimated tax expected 25000, got ${res.estimatedTax}`);
    assert(res.afterTaxIncome === 75000, `After tax income expected 75000, got ${res.afterTaxIncome}`);
  }

  // 3. Progressive bracket calculation
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 80000,
      taxRateMode: 'brackets',
      brackets: [
        { upTo: 20000, rate: 0 },
        { upTo: 50000, rate: 10 },
        { upTo: Infinity, rate: 20 },
      ],
    });
    // 0 to 20k = 0; 20k to 50k (30k) @ 10% = 3000; 50k to 80k (30k) @ 20% = 6000; Total = 9000
    assert(res.estimatedTax === 9000, `Progressive tax expected 9000, got ${res.estimatedTax}`);
    assert(res.afterTaxIncome === 71000, `After tax income expected 71000, got ${res.afterTaxIncome}`);
  }

  // 4. Deduction
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 100000,
      taxDeductions: 20000,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 20,
    });
    assert(res.taxableIncome === 80000, `Taxable income after 20k deduction expected 80000, got ${res.taxableIncome}`);
    assert(res.estimatedTax === 16000, `Estimated tax expected 16000, got ${res.estimatedTax}`);
  }

  // 5. Credit
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 100000,
      taxCredits: 5000,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 20,
    });
    // Tax before credit: 20000, Credit: 5000 -> Estimated tax: 15000
    assert(res.taxBeforeCredits === 20000, `Tax before credit expected 20000, got ${res.taxBeforeCredits}`);
    assert(res.estimatedTax === 15000, `Estimated tax expected 15000, got ${res.estimatedTax}`);
  }

  // 6. Multiple brackets
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 150000,
      taxRateMode: 'brackets',
      brackets: [
        { upTo: 50000, rate: 10 },
        { upTo: 100000, rate: 20 },
        { upTo: Infinity, rate: 30 },
      ],
    });
    // 50k @ 10% = 5k; 50k @ 20% = 10k; 50k @ 30% = 15k; Total = 30k
    assert(res.estimatedTax === 30000, `Multiple brackets expected 30000, got ${res.estimatedTax}`);
  }

  // 7. Scenario A vs Scenario B comparison
  {
    const comparison = calculateTaxImpactComparison(
      {
        grossIncome: 100000,
        taxRateMode: 'effective_rate',
        effectiveTaxRate: 20,
      },
      {
        grossIncome: 120000,
        taxRateMode: 'effective_rate',
        effectiveTaxRate: 22,
      }
    );
    // Scenario A: 20000 tax. Scenario B: 26400 tax. Difference: +6400.
    assert(comparison.scenarioA.estimatedTax === 20000, `A tax expected 20000, got ${comparison.scenarioA.estimatedTax}`);
    assert(comparison.scenarioB.estimatedTax === 26400, `B tax expected 26400, got ${comparison.scenarioB.estimatedTax}`);
    assert(comparison.taxDifference === 6400, `Tax difference expected 6400, got ${comparison.taxDifference}`);
    assert(comparison.afterTaxIncomeDifference === 13600, `After-tax income diff expected 13600, got ${comparison.afterTaxIncomeDifference}`);
  }

  // 8. Tax cannot become negative after credits
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 30000,
      taxCredits: 50000, // Credit exceeds total tax
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 10,
    });
    assert(res.estimatedTax === 0, `Tax cannot become negative, expected 0, got ${res.estimatedTax}`);
  }

  // 9. Blank state
  {
    const res = calculateSingleTaxScenario({
      grossIncome: 0,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: 0,
    });
    assert(res.estimatedTax === 0 && res.afterTaxIncome === 0, 'Blank state produces 0 tax');
  }

  // 10. Reset state
  {
    const comp = calculateTaxImpactComparison(
      { grossIncome: 0, taxRateMode: 'effective_rate', effectiveTaxRate: 0 },
      { grossIncome: 0, taxRateMode: 'effective_rate', effectiveTaxRate: 0 }
    );
    assert(comp.taxDifference === 0, 'Reset comparison produces 0 diff');
  }

  // =========================================================================
  // 3. WEALTH GOAL & MILLIONAIRE CALCULATOR TESTS
  // =========================================================================
  console.log('--- 3. WEALTH GOAL & MILLIONAIRE ENGINE TESTS ---');

  // 1. Zero starting balance
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 0,
      targetWealth: 100000,
      monthlyContribution: 1000,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.monthsToGoal === 100, `At 0% return with 1000/mo, 100k target expected in 100 months, got ${res.monthsToGoal}`);
  }

  // 2. Zero contribution
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 50000,
      targetWealth: 100000,
      monthlyContribution: 0,
      annualReturn: 7.18, // ~10 years doubling
      contributionTiming: 'end_of_month',
    });
    assert(res.monthsToGoal !== null && res.monthsToGoal > 100 && res.monthsToGoal < 130, `Lumpsum growth expected ~116-120 months, got ${res.monthsToGoal}`);
  }

  // 3. Zero return
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 10000,
      targetWealth: 50000,
      monthlyContribution: 1000,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.monthsToGoal === 40, `40k gap at 1000/mo expected in 40 months, got ${res.monthsToGoal}`);
  }

  // 4. Positive return
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 10000,
      targetWealth: 1000000, // 1 Million
      monthlyContribution: 2000,
      annualReturn: 12,
      contributionTiming: 'end_of_month',
    });
    assert(res.status === 'reached', 'Positive return reaches 1 million');
    assert(res.monthsToGoal !== null && res.monthsToGoal < 190, `Expected millionaire goal in < 190 months, got ${res.monthsToGoal}`);
  }

  // 5. Negative return
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 10000,
      targetWealth: 20000,
      monthlyContribution: 2000,
      annualReturn: -5,
      contributionTiming: 'end_of_month',
    });
    assert(res.status === 'reached', 'High contribution overcomes modest negative return');
  }

  // 6. Target already reached
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 1000000,
      targetWealth: 1000000,
      monthlyContribution: 500,
      annualReturn: 8,
      contributionTiming: 'end_of_month',
    });
    assert(res.status === 'already_reached', `Expected already_reached status, got ${res.status}`);
    assert(res.monthsToGoal === 0, `Expected 0 months to goal, got ${res.monthsToGoal}`);
  }

  // 7. Impossible target (zero contribution, zero return, target > current savings)
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 10000,
      targetWealth: 50000,
      monthlyContribution: 0,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.status === 'unreachable', `Expected unreachable status, got ${res.status}`);
    assert(res.monthsToGoal === null, 'Months to goal should be null');
  }

  // 8. Monthly contribution formula
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 0,
      targetWealth: 12000,
      monthlyContribution: 1000,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.monthsToGoal === 12, `12000 target at 1000/mo = 12 months, got ${res.monthsToGoal}`);
  }

  // 9. Beginning-of-month contribution
  {
    const resEnd = calculateWealthGoal({
      mode: 'future_wealth',
      currentSavings: 0,
      targetWealth: 100000,
      monthlyContribution: 1000,
      annualReturn: 12,
      timeHorizonYears: 5,
      contributionTiming: 'end_of_month',
    });
    const resBegin = calculateWealthGoal({
      mode: 'future_wealth',
      currentSavings: 0,
      targetWealth: 100000,
      monthlyContribution: 1000,
      annualReturn: 12,
      timeHorizonYears: 5,
      contributionTiming: 'beginning_of_month',
    });
    assert(resBegin.projectedWealth > resEnd.projectedWealth, 'Beginning of month should earn slightly more than end of month');
  }

  // 10. End-of-month contribution
  {
    const res = calculateWealthGoal({
      mode: 'future_wealth',
      currentSavings: 10000,
      targetWealth: 50000,
      monthlyContribution: 500,
      annualReturn: 0,
      timeHorizonYears: 2,
      contributionTiming: 'end_of_month',
    });
    // 10000 + 500 * 24 = 22000
    assert(res.projectedWealth === 22000, `Future wealth at 0% return expected 22000, got ${res.projectedWealth}`);
  }

  // 11. Required contribution reverse calculation
  {
    const res = calculateWealthGoal({
      mode: 'required_contribution',
      currentSavings: 0,
      targetWealth: 120000,
      monthlyContribution: 0,
      annualReturn: 0,
      timeHorizonYears: 10,
      contributionTiming: 'end_of_month',
    });
    // 120000 / 120 months = 1000 / month
    assert(res.monthlyContribution === 1000, `Required monthly contribution expected 1000, got ${res.monthlyContribution}`);
  }

  // 12. Contribution growth (step-up)
  {
    const resFlat = calculateWealthGoal({
      mode: 'future_wealth',
      currentSavings: 0,
      targetWealth: 500000,
      monthlyContribution: 1000,
      annualReturn: 10,
      annualContributionGrowth: 0,
      timeHorizonYears: 5,
      contributionTiming: 'end_of_month',
    });
    const resStepUp = calculateWealthGoal({
      mode: 'future_wealth',
      currentSavings: 0,
      targetWealth: 500000,
      monthlyContribution: 1000,
      annualReturn: 10,
      annualContributionGrowth: 10, // 10% annual step-up
      timeHorizonYears: 5,
      contributionTiming: 'end_of_month',
    });
    assert(resStepUp.projectedWealth > resFlat.projectedWealth, 'Step-up contribution should yield higher projected wealth');
  }

  // 13. Inflation
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 0,
      targetWealth: 1000000,
      monthlyContribution: 5000,
      annualReturn: 12,
      inflationRate: 6,
      contributionTiming: 'end_of_month',
    });
    assert(res.realPurchasingPowerAtGoal !== undefined, 'Inflation should calculate real purchasing power');
    assert(res.realPurchasingPowerAtGoal! < res.targetWealth, 'Real purchasing power should be less than nominal target');
  }

  // 14. Very long horizon
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 100,
      targetWealth: 100000000, // 100 million with small 10/month
      monthlyContribution: 10,
      annualReturn: 2,
      contributionTiming: 'end_of_month',
    });
    assert(res.status === 'horizon_exceeded', `100-year cap should flag horizon_exceeded, got ${res.status}`);
  }

  // 15. Blank state
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 0,
      targetWealth: 0,
      monthlyContribution: 0,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.projectedWealth === 0, 'Blank state produces 0 projected wealth');
  }

  // 16. Reset state
  {
    const res = calculateWealthGoal({
      mode: 'time_to_goal',
      currentSavings: 0,
      targetWealth: 0,
      monthlyContribution: 0,
      annualReturn: 0,
      contributionTiming: 'end_of_month',
    });
    assert(res.timeline.length === 0, 'Reset state has empty timeline');
  }

  console.log('--- ALL 3 CALCULATORS ENGINE TESTS PASSED! ---');
}
