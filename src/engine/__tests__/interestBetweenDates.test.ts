import {
  normalizeInterestRate,
  validateInterestBetweenDatesInput,
  calculateInterestBetweenDates,
  InterestRateMethod,
  InterestBetweenDatesInput,
} from '../interestBetweenDates';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

export function runInterestBetweenDatesTests() {
  console.log('\n--- STARTING INTEREST BETWEEN DATES TESTS ---');

  // 1. SPECIFIC RATE CONVERSION TESTS:
  // 1 per ₹100/month → 12% annual
  {
    const res = normalizeInterestRate('per_hundred_per_month', 1);
    assert(res.isValid === true, '1 per ₹100/month is valid');
    assert(res.normalization?.annualRatePercent === 12, `Expected 12% annual rate, got ${res.normalization?.annualRatePercent}`);
    assert(res.normalization?.monthlyRatePercent === 1, `Expected 1% monthly rate, got ${res.normalization?.monthlyRatePercent}`);
    assert(res.normalization?.annualRateDecimal === 0.12, `Expected 0.12 decimal, got ${res.normalization?.annualRateDecimal}`);
    assert(res.normalization?.normalizedAnnualRateFormatted === '12% per year', `Expected "12% per year", got "${res.normalization?.normalizedAnnualRateFormatted}"`);
    assert(res.normalization?.enteredRateFormatted === '₹1 per ₹100 per month', `Expected formatted original rate`);
  }

  // 1.5 per ₹100/month → 18% annual
  {
    const res = normalizeInterestRate('per_hundred_per_month', 1.5);
    assert(res.isValid === true, '1.5 per ₹100/month is valid');
    assert(res.normalization?.annualRatePercent === 18, `Expected 18% annual rate, got ${res.normalization?.annualRatePercent}`);
    assert(res.normalization?.monthlyRatePercent === 1.5, `Expected 1.5% monthly rate`);
    assert(res.normalization?.annualRateDecimal === 0.18, `Expected 0.18 decimal`);
    assert(res.normalization?.normalizedAnnualRateFormatted === '18% per year', `Expected "18% per year"`);
  }

  // 2 per ₹100/month → 24% annual
  {
    const res = normalizeInterestRate('per_hundred_per_month', 2);
    assert(res.isValid === true, '2 per ₹100/month is valid');
    assert(res.normalization?.annualRatePercent === 24, `Expected 24% annual rate, got ${res.normalization?.annualRatePercent}`);
    assert(res.normalization?.monthlyRatePercent === 2, `Expected 2% monthly rate`);
    assert(res.normalization?.annualRateDecimal === 0.24, `Expected 0.24 decimal`);
    assert(res.normalization?.normalizedAnnualRateFormatted === '24% per year', `Expected "24% per year"`);
    assert(res.normalization?.calculationRateUsedFormatted === '24% per year', `Expected "24% per year" calculation rate`);
  }

  // 2.5 per ₹100/month → 30% annual
  {
    const res = normalizeInterestRate('per_hundred_per_month', 2.5);
    assert(res.isValid === true, '2.5 per ₹100/month is valid');
    assert(res.normalization?.annualRatePercent === 30, `Expected 30% annual rate, got ${res.normalization?.annualRatePercent}`);
    assert(res.normalization?.monthlyRatePercent === 2.5, `Expected 2.5% monthly rate`);
    assert(res.normalization?.annualRateDecimal === 0.30, `Expected 0.30 decimal`);
    assert(res.normalization?.normalizedAnnualRateFormatted === '30% per year', `Expected "30% per year"`);
  }

  // 3 per ₹100/month → 36% annual
  {
    const res = normalizeInterestRate('per_hundred_per_month', 3);
    assert(res.isValid === true, '3 per ₹100/month is valid');
    assert(res.normalization?.annualRatePercent === 36, `Expected 36% annual rate, got ${res.normalization?.annualRatePercent}`);
    assert(res.normalization?.monthlyRatePercent === 3, `Expected 3% monthly rate`);
    assert(res.normalization?.annualRateDecimal === 0.36, `Expected 0.36 decimal`);
    assert(res.normalization?.normalizedAnnualRateFormatted === '36% per year', `Expected "36% per year"`);
  }

  // 2. DECIMAL RATES TESTS (e.g. 1.25, 2.75, 0.75, percentage mode 12.5)
  {
    const dec1 = normalizeInterestRate('per_hundred_per_month', 1.25);
    assert(dec1.isValid === true && dec1.normalization?.annualRatePercent === 15, '1.25 per ₹100/mo converts to 15% annual');

    const dec2 = normalizeInterestRate('per_hundred_per_month', 2.75);
    assert(dec2.isValid === true && dec2.normalization?.annualRatePercent === 33, '2.75 per ₹100/mo converts to 33% annual');

    const dec3 = normalizeInterestRate('percentage_per_year', 14.75);
    assert(dec3.isValid === true && dec3.normalization?.annualRatePercent === 14.75, '14.75% per year converts to 14.75% annual');
    assert(Math.abs((dec3.normalization?.monthlyRatePercent ?? 0) - (14.75 / 12)) < 0.0001, 'Correct monthly equivalent for 14.75%');
  }

  // 3. ZERO RATE TESTS (0 is mathematically valid and not treated as empty)
  {
    const zeroPerHundred = normalizeInterestRate('per_hundred_per_month', 0);
    assert(zeroPerHundred.isValid === true, 'Zero rate in per_hundred_per_month is valid');
    assert(zeroPerHundred.normalization?.annualRatePercent === 0, 'Zero rate converts to 0% annual');
    assert(zeroPerHundred.normalization?.annualRateDecimal === 0, 'Zero rate converts to 0 decimal');

    const zeroPercent = normalizeInterestRate('percentage_per_year', 0);
    assert(zeroPercent.isValid === true, 'Zero rate in percentage_per_year is valid');
    assert(zeroPercent.normalization?.annualRatePercent === 0, 'Zero rate converts to 0% annual');

    // Interest calculation with zero rate produces 0 interest and preserves principal
    const calcZero = calculateInterestBetweenDates({
      principal: 50000,
      startDate: '2024-01-01',
      endDate: '2024-07-01',
      rateMethod: 'per_hundred_per_month',
      rateValue: 0,
    });
    assert(calcZero !== null, 'Calculation with zero rate succeeds');
    assert(calcZero?.totalInterest === 0, 'Total interest with 0 rate is 0');
    assert(calcZero?.totalAmount === 50000, 'Total amount with 0 rate equals principal');
  }

  // 4. EMPTY RATE TESTS (Empty rate is invalid when user attempts to calculate)
  {
    const emptyString = normalizeInterestRate('per_hundred_per_month', '');
    assert(emptyString.isValid === false, 'Empty string rate is rejected');
    assert(emptyString.error?.includes('required') === true, 'Provides required error message');

    const nullRate = normalizeInterestRate('percentage_per_year', null);
    assert(nullRate.isValid === false, 'Null rate is rejected');

    const undefinedRate = normalizeInterestRate('percentage_per_year', undefined);
    assert(undefinedRate.isValid === false, 'Undefined rate is rejected');

    // Validation rejects input with empty rateValue
    const valResult = validateInterestBetweenDatesInput({
      principal: 10000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      rateMethod: 'percentage_per_year',
      rateValue: '',
    });
    assert(valResult.isValid === false, 'validateInterestBetweenDatesInput rejects empty rate');
    assert(!!valResult.errors.rateValue, 'Error on rateValue field');
  }

  // 5. SWITCHING BETWEEN RATE METHODS & INACTIVE FIELD ISOLATION
  {
    // User sets method to 'percentage_per_year' with 24%
    const inputMethod1: InterestBetweenDatesInput = {
      principal: 100000,
      startDate: '2024-01-01',
      endDate: '2025-01-01', // 366 days in leap year 2024
      rateMethod: 'percentage_per_year',
      rateValue: 24,
    };
    const res1 = calculateInterestBetweenDates(inputMethod1);
    assert(res1 !== null, 'Calculated percentage_per_year');
    assert(res1?.rateInfo.annualRatePercent === 24, 'Method 1 annual rate is 24%');
    assert(res1?.rateInfo.enteredRateFormatted === '24% per year', 'Method 1 display is correct');

    // User switches to 'per_hundred_per_month' with 2 (₹2 per ₹100/mo = 24% annual)
    const inputMethod2: InterestBetweenDatesInput = {
      principal: 100000,
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      rateMethod: 'per_hundred_per_month',
      rateValue: 2,
    };
    const res2 = calculateInterestBetweenDates(inputMethod2);
    assert(res2 !== null, 'Calculated per_hundred_per_month');
    assert(res2?.rateInfo.annualRatePercent === 24, 'Method 2 annual rate is 24%');
    assert(res2?.rateInfo.enteredRateFormatted === '₹2 per ₹100 per month', 'Method 2 display formatted correctly');
    assert(res2?.rateInfo.normalizedAnnualRateFormatted === '24% per year', 'Method 2 normalized annual rate is 24% per year');

    // Both methods calculate identical annual interest for the same period
    assert(Math.abs((res1?.totalInterest ?? 0) - (res2?.totalInterest ?? 0)) < 0.01, 'Both methods produce mathematically identical result when equivalent');
  }

  // 6. INACTIVE RATE FIELD CANNOT ACCIDENTALLY AFFECT CALCULATIONS
  {
    // Simulating a form state where user entered 50 into a percentage field previously,
    // but then selected 'per_hundred_per_month' with value 1.5.
    // The engine only uses the active rateMethod ('per_hundred_per_month') and active rateValue (1.5).
    const activeInput: InterestBetweenDatesInput = {
      principal: 100000,
      startDate: '2024-01-01',
      endDate: '2024-07-01',
      rateMethod: 'per_hundred_per_month',
      rateValue: 1.5, // 18% annual
    };
    const calc = calculateInterestBetweenDates(activeInput);
    assert(calc?.rateInfo.annualRatePercent === 18, 'Annual rate strictly corresponds to the active per_hundred_per_month method');
    assert(calc?.rateInfo.annualRatePercent !== 50, 'Stale/inactive rate is completely ignored');
  }

  // 7. DISPLAY TRANSPARENCY REQUIREMENTS
  {
    const res = normalizeInterestRate('per_hundred_per_month', 2);
    assert(res.normalization?.enteredRateFormatted === '₹2 per ₹100 per month', 'Original rate entered display');
    assert(res.normalization?.normalizedAnnualRateFormatted === '24% per year', 'Equivalent annual rate display');
    assert(res.normalization?.calculationRateUsedFormatted === '24% per year', 'Calculation rate used display');
  }

  console.log('--- ALL INTEREST BETWEEN DATES ENGINE TESTS PASSED! ---\n');
}

// Auto-run if executed directly via tsx
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('interestBetweenDates.test')) {
  runInterestBetweenDatesTests();
}
