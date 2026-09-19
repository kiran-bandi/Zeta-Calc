import { normalizeTerm, monthsToTerm } from '../termEngine';

export function runTermEngineTests() {
  console.log('--- STARTING TERM ENGINE TESTS ---');

  // Test 1: 2 years 5 months -> 29 months
  const res1 = normalizeTerm({ years: 2, months: 5 });
  if (!res1.isValid || res1.totalMonths !== 29 || res1.totalYears !== 29 / 12) {
    throw new Error(`Test 1 Failed: Expected 29 months and 2.4166666667 years, got totalMonths=${res1.totalMonths}, totalYears=${res1.totalYears}`);
  }
  console.log('✅ PASSED: 2 years 5 months -> 29 months');

  // Test 2: 0 years 5 months -> 5 months
  const res2 = normalizeTerm({ years: 0, months: 5 });
  if (!res2.isValid || res2.totalMonths !== 5 || res2.totalYears !== 5 / 12) {
    throw new Error(`Test 2 Failed: Expected 5 months, got totalMonths=${res2.totalMonths}`);
  }
  console.log('✅ PASSED: 0 years 5 months -> 5 months');

  // Test 3: 2 years 0 months -> 24 months
  const res3 = normalizeTerm({ years: 2, months: 0 });
  if (!res3.isValid || res3.totalMonths !== 24 || res3.totalYears !== 2) {
    throw new Error(`Test 3 Failed: Expected 24 months, got totalMonths=${res3.totalMonths}`);
  }
  console.log('✅ PASSED: 2 years 0 months -> 24 months');

  // Test 4: 10 years 11 months -> 131 months
  const res4 = normalizeTerm({ years: 10, months: 11 });
  if (!res4.isValid || res4.totalMonths !== 131 || res4.totalYears !== 131 / 12) {
    throw new Error(`Test 4 Failed: Expected 131 months, got totalMonths=${res4.totalMonths}`);
  }
  console.log('✅ PASSED: 10 years 11 months -> 131 months');

  // Test 5: 1 year 3 months -> 15 months
  const res5 = normalizeTerm({ years: 1, months: 3 });
  if (!res5.isValid || res5.totalMonths !== 15 || res5.totalYears !== 1.25) {
    throw new Error(`Test 5 Failed: Expected 15 months, got totalMonths=${res5.totalMonths}`);
  }
  console.log('✅ PASSED: 1 year 3 months -> 15 months');

  // Test 6: Empty years + empty months -> validation error
  const res6 = normalizeTerm({ years: '', months: '' });
  if (res6.isValid || res6.error !== 'Enter a term.') {
    throw new Error(`Test 6 Failed: Expected validation error "Enter a term.", got isValid=${res6.isValid}, error=${res6.error}`);
  }
  console.log('✅ PASSED: Empty years + empty months -> validation error');

  // Test 7: Negative years -> validation error
  const res7 = normalizeTerm({ years: -2, months: 5 });
  if (res7.isValid || res7.error !== 'Years cannot be negative.') {
    throw new Error(`Test 7 Failed: Expected negative years error, got ${res7.error}`);
  }
  console.log('✅ PASSED: Negative years -> validation error');

  // Test 8: Negative months -> validation error
  const res8 = normalizeTerm({ years: 2, months: -3 });
  if (res8.isValid || res8.error !== 'Months cannot be negative.') {
    throw new Error(`Test 8 Failed: Expected negative months error, got ${res8.error}`);
  }
  console.log('✅ PASSED: Negative months -> validation error');

  // Test 9: 12 months -> validation error
  const res9 = normalizeTerm({ years: 0, months: 12 });
  if (res9.isValid || !res9.error?.includes('Months must be between 0 and 11')) {
    throw new Error(`Test 9 Failed: Expected 12 months error, got ${res9.error}`);
  }
  console.log('✅ PASSED: 12 months -> validation error');

  // Test 10: 15 months -> validation error
  const res10 = normalizeTerm({ years: 1, months: 15 });
  if (res10.isValid || !res10.error?.includes('Months must be between 0 and 11')) {
    throw new Error(`Test 10 Failed: Expected 15 months error, got ${res10.error}`);
  }
  console.log('✅ PASSED: 15 months -> validation error');

  // Test 11: Empty years with valid months treated correctly
  const res11 = normalizeTerm({ years: '', months: 5 });
  if (!res11.isValid || res11.totalMonths !== 5) {
    throw new Error(`Test 11 Failed: Expected 5 months when years is empty, got ${res11.totalMonths}`);
  }
  console.log('✅ PASSED: Empty years + 5 months -> 5 total months');

  // Test 12: Valid years with empty months treated correctly
  const res12 = normalizeTerm({ years: 2, months: '' });
  if (!res12.isValid || res12.totalMonths !== 24) {
    throw new Error(`Test 12 Failed: Expected 24 months when months is empty, got ${res12.totalMonths}`);
  }
  console.log('✅ PASSED: 2 years + empty months -> 24 total months');

  console.log('--- ALL TERM ENGINE TESTS PASSED! ---');
}
