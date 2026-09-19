import { calculateEMI, validateEMIInput } from '../emi';
import { calculateSIP, calculateCompoundInterest, calculatePercentage, calculateDiscount } from '../financial';
import { calculateFuelCost, calculateAge } from '../everyday';
import { runInterestBetweenDatesTests } from './interestBetweenDates.test';
import { runRoadmapEnginesTests } from './roadmapEngines.test';
import { runE2EFullSuite } from './e2eFullSuite.test';
import { runTermEngineTests } from './termEngine.test';
import { runMutualFundDeterministicTests } from './mutualFundDeterministic.test';
import { runPlatformTests } from './platform.test';
import { runNewCalculatorsTests } from './newCalculators.test';
import { runNewCalculatorsBatch2Tests } from './newCalculatorsBatch2.test';
import { runNewCalculatorsBatch3Tests } from './newCalculatorsBatch3.test';
import { runGoldEnginesTests } from './goldEnginesTestRunner';
import { runThreeCalculatorsTests } from './threeUpgradedCalculators.test';
import { runE2EAppValidationTests } from './e2eAppValidation.test';
import { runFunctionalE2ETests } from './functionalE2E.test';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('--- STARTING CALCULATOR DETERMINISTIC ENGINE TESTS ---');

// 1. EMI Reference Value Test (Standard Reference: 100,000 at 8.5% for 20 years)
{
  const input = { loanAmount: 100000, interestRate: 8.5, tenure: 20, tenureUnit: 'years' as const };
  const res = calculateEMI(input);
  assert(res.monthlyEMI === 868, `Expected EMI 868, got ${res.monthlyEMI}`);
  assert(res.totalPrincipal === 100000, `Expected principal 100000, got ${res.totalPrincipal}`);
  assert(Math.abs(res.totalInterest - 108278) <= 1, `Expected total interest ~108278, got ${res.totalInterest}`);
  assert(Math.abs(res.totalPayment - 208278) <= 1, `Expected total payment ~208278, got ${res.totalPayment}`);
  assert(res.monthlyAmortization.length === 240, `Expected 240 monthly rows, got ${res.monthlyAmortization.length}`);
  assert(res.yearlyAmortization.length === 20, `Expected 20 yearly rows, got ${res.yearlyAmortization.length}`);
}

// 2. EMI 0% Interest Case
{
  const input = { loanAmount: 120000, interestRate: 0, tenure: 12, tenureUnit: 'months' as const };
  const res = calculateEMI(input);
  assert(res.monthlyEMI === 10000, `Expected 0% interest EMI 10000, got ${res.monthlyEMI}`);
  assert(res.totalInterest === 0, `Expected total interest 0, got ${res.totalInterest}`);
  assert(res.totalPayment === 120000, `Expected total payment 120000, got ${res.totalPayment}`);
}

// 3. EMI Decimal and Large Values
{
  const input = { loanAmount: 2500000, interestRate: 8.75, tenure: 15, tenureUnit: 'years' as const };
  const res = calculateEMI(input);
  assert(res.monthlyEMI > 0 && res.totalPayment > res.totalPrincipal, 'Valid positive outcome for 25L at 8.75% for 15y');
}

// 4. EMI Input Validation (Negative & Invalid)
{
  const invalidNegative = validateEMIInput({ loanAmount: -5000, interestRate: 8, tenure: 10, tenureUnit: 'years' });
  assert(!invalidNegative.isValid && !!invalidNegative.errors.loanAmount, 'Properly rejected negative loan amount');

  const invalidRate = validateEMIInput({ loanAmount: 50000, interestRate: -2, tenure: 10, tenureUnit: 'years' });
  assert(!invalidRate.isValid && !!invalidRate.errors.interestRate, 'Properly rejected negative interest rate');

  const invalidTenure = validateEMIInput({ loanAmount: 50000, interestRate: 8, tenure: 65, tenureUnit: 'years' });
  assert(!invalidTenure.isValid && !!invalidTenure.errors.tenure, 'Properly rejected tenure > 50 years');
}

// 5. SIP Calculation Reference Test
{
  const sip = calculateSIP({ monthlyInvestment: 10000, expectedReturnRate: 12, timePeriodYears: 15 });
  assert(sip.investedAmount === 1800000, `Expected invested 1800000, got ${sip.investedAmount}`);
  // Compound formula: ~5,045,760
  assert(Math.abs(sip.totalValue - 5045760) < 500, `Expected total value ~5045760, got ${sip.totalValue}`);
  assert(sip.estimatedReturns > 3200000, `Expected returns > 32L, got ${sip.estimatedReturns}`);
}

// 6. Compound Interest Reference Test
{
  const ci = calculateCompoundInterest({ principal: 100000, annualRate: 10, years: 3, compoundFrequency: 1 });
  // 100000 * (1.1)^3 = 133,100
  assert(ci.totalAmount === 133100, `Expected 133100, got ${ci.totalAmount}`);
  assert(ci.totalInterest === 33100, `Expected 33100, got ${ci.totalInterest}`);
}

// 7. Percentage Test
{
  const p1 = calculatePercentage({ type: 'what_is_x_percent_of_y', val1: 20, val2: 5000 });
  assert(p1.result === 1000, `Expected 20% of 5000 to be 1000, got ${p1.result}`);

  const p2 = calculatePercentage({ type: 'x_is_what_percent_of_y', val1: 25, val2: 200 });
  assert(p2.result === 12.5, `Expected 25 of 200 to be 12.5%, got ${p2.result}`);
}

// 8. Discount Test
{
  const d = calculateDiscount({ originalPrice: 100, discountPercentage: 20, taxPercentage: 10 });
  assert(d.savings === 20, `Expected savings 20, got ${d.savings}`);
  assert(d.priceAfterDiscount === 80, `Expected subtotal 80, got ${d.priceAfterDiscount}`);
  assert(d.taxAmount === 8, `Expected tax 8, got ${d.taxAmount}`);
  assert(d.finalPrice === 88, `Expected final price 88, got ${d.finalPrice}`);
}

// 9. Fuel Cost Test
{
  const fuel = calculateFuelCost({ distanceKm: 300, fuelEfficiencyKmPerLiter: 15, fuelPricePerLiter: 100, passengers: 2 });
  assert(fuel.litersNeeded === 20, `Expected 20 liters, got ${fuel.litersNeeded}`);
  assert(fuel.totalCost === 2000, `Expected total cost 2000, got ${fuel.totalCost}`);
  assert(fuel.costPerPerson === 1000, `Expected cost per person 1000, got ${fuel.costPerPerson}`);
}

// 10. Term Engine Tests
runTermEngineTests();

// 11. Interest Between Dates Rate Conversion & Isolation Tests
runInterestBetweenDatesTests();

// 11. Roadmap Financial Engines (Property, Mutual Funds, Tax, Schemes, Business)
runRoadmapEnginesTests();

// 12. Dedicated Mutual Fund Engine Tests
runMutualFundDeterministicTests();

// 13. Universal Platform Primitives & Normalization Tests
runPlatformTests();

// 14. New Calculators Formula Verification Gate
runNewCalculatorsTests();

// 14b. New Calculators Batch 2 Formula Verification Gate
runNewCalculatorsBatch2Tests();

// 14c. New Calculators Batch 3 Formula Verification Gate
runNewCalculatorsBatch3Tests();

// 14d. Gold & Precious Metals Deterministic Engine Gate
runGoldEnginesTests();

// 14e. Buy vs Rent, Tax Impact, Wealth Goal Deterministic Gate
runThreeCalculatorsTests();

// 15. Full E2E Test Suite (All 114 Tools, Taxonomies, All Calculation Engines & Boundaries)
runE2EFullSuite();

// 16. Comprehensive E2E Application, Schema & SEO Payload Validation Suite
runE2EAppValidationTests();

// 17. End-to-End Functional User Flow Test Suite (Search, Navigation, Engine Executions, History & Settings)
runFunctionalE2ETests();

console.log('--- ALL CALCULATOR DETERMINISTIC ENGINE TESTS PASSED! ---');
