import {
  calculateLumpsum,
  calculateSIP,
  calculateStepUpSIP,
} from '../mutualFundEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

export function runMutualFundDeterministicTests() {
  console.log('--- STARTING MUTUAL FUND DETERMINISTIC ENGINE TESTS ---');

  // 1. Basic Lumpsum
  {
    const res = calculateLumpsum({
      initialInvestment: 100000,
      expectedAnnualReturnRate: 12,
      totalMonths: 36,
    });
    assert(res.totalInvested === 100000, 'Lumpsum total invested matches principal');
    assert(Math.abs(res.estimatedFutureValue - 140492.8) < 0.5, 'Lumpsum FV matches (1+r)^t');
    assert(res.exactDurationYears === 3, 'Lumpsum exact duration in years is 3');
  }

  // 2. Zero Return Lumpsum
  {
    const res = calculateLumpsum({
      initialInvestment: 50000,
      expectedAnnualReturnRate: 0,
      totalMonths: 24,
    });
    assert(res.estimatedFutureValue === 50000, 'Lumpsum with 0% return equals principal');
    assert(res.estimatedReturns === 0, 'Lumpsum with 0% return has 0 gain');
  }

  // 3. Partial Duration Lumpsum (2 years 5 months = 29 months)
  {
    const res = calculateLumpsum({
      initialInvestment: 100000,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
    });
    const t = 29 / 12;
    const expected = 100000 * Math.pow(1.12, t);
    assert(Math.abs(res.estimatedFutureValue - expected) < 0.01, 'Lumpsum calculates exact partial 29 months');
  }

  // 4. Basic SIP (12 months at 12% p.a.)
  {
    const res = calculateSIP({
      monthlySIPAmount: 5000,
      expectedAnnualReturnRate: 12,
      totalMonths: 12,
      timingConvention: 'end_of_month',
    });
    assert(res.totalInvested === 60000, 'SIP total invested is 5000 * 12 = 60000');
    assert(Math.abs(res.estimatedFutureValue - 63412.52) < 0.5, 'SIP FV matches end-of-month formula');
  }

  // 5. Zero Return SIP
  {
    const res = calculateSIP({
      monthlySIPAmount: 10000,
      expectedAnnualReturnRate: 0,
      totalMonths: 24,
    });
    assert(res.totalInvested === 240000, 'SIP 0% total invested is 240000');
    assert(res.estimatedFutureValue === 240000, 'SIP 0% FV equals total invested');
    assert(res.estimatedReturns === 0, 'SIP 0% returns is 0');
  }

  // 6. Partial Duration SIP (29 months)
  {
    const res = calculateSIP({
      monthlySIPAmount: 5000,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
    });
    const i = 0.12 / 12;
    const expected = 5000 * ((Math.pow(1 + i, 29) - 1) / i);
    assert(res.totalInstallments === 29, 'SIP total installments is 29');
    assert(Math.abs(res.estimatedFutureValue - expected) < 0.01, 'SIP partial duration matches exact formula');
  }

  // 7. Step-Up SIP: 0% Step-Up matches regular SIP exactly
  {
    const sipRes = calculateSIP({
      monthlySIPAmount: 5000,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
    });
    const stepUpZero = calculateStepUpSIP({
      initialMonthlySIP: 5000,
      annualStepUpPercentage: 0,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
    });
    assert(Math.abs(stepUpZero.estimatedFutureValue - sipRes.estimatedFutureValue) < 0.01, '0% step-up matches regular SIP');
    assert(stepUpZero.totalInvested === sipRes.totalInvested, '0% step-up invested matches regular SIP');
  }

  // 8. Step-Up SIP: 10% Step-Up across 29 months
  {
    const res = calculateStepUpSIP({
      initialMonthlySIP: 5000,
      annualStepUpPercentage: 10,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
    });
    const expectedInvested = 5000 * 12 + 5500 * 12 + 6050 * 5;
    assert(Math.abs(res.totalInvested - expectedInvested) < 0.01, 'Step-Up invested sums exact 3 tiers');
    assert(Math.abs(res.finalMonthlySIPAmount - 6050) < 0.01, 'Final monthly SIP is 6050');
  }

  // 9. Inflation: Purchasing Power and Loss
  {
    const res = calculateLumpsum({
      initialInvestment: 100000,
      expectedAnnualReturnRate: 12,
      totalMonths: 29,
      inflationRate: 6,
    });
    assert(res.hasInflation === true, 'hasInflation is true when provided');
    assert(res.inflationRate === 6, 'inflationRate is 6%');
    const t = 29 / 12;
    const realFV = res.estimatedFutureValue / Math.pow(1.06, t);
    assert(Math.abs(res.inflationAdjustedFutureValue! - realFV) < 0.01, 'Real FV matches inflation discount');
    assert(Math.abs(res.estimatedPurchasingPowerLoss! - (res.estimatedFutureValue - realFV)) < 0.01, 'Loss is Nominal - Real');
  }

  // 10. Inflation: 0% explicit inflation
  {
    const res = calculateLumpsum({
      initialInvestment: 100000,
      expectedAnnualReturnRate: 12,
      totalMonths: 24,
      inflationRate: 0,
    });
    assert(res.hasInflation === true, 'Explicit 0% inflation is recognized');
    assert(Math.abs(res.inflationAdjustedFutureValue! - res.estimatedFutureValue) < 0.01, '0% inflation has equal real and nominal');
    assert(Math.abs(res.estimatedPurchasingPowerLoss!) < 0.01, '0% inflation has 0 purchasing power loss');
  }

  console.log('--- ALL MUTUAL FUND DETERMINISTIC ENGINE TESTS PASSED! ---');
}
