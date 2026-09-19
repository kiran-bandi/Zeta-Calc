import {
  UnitRegistry,
  CurrencyRegistry,
  DurationEngine,
  InterestRateNormalizer,
  ValidationEngine,
  CashFlowEngine,
  TimelineEngine,
  ScenarioEngine,
  GoalEngine,
} from '../../platform';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Platform assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

export function runPlatformTests() {
  console.log('--- STARTING PLATFORM ARCHITECTURAL SERVICES TESTS ---');

  // 1. UnitRegistry conversions
  {
    const metersToFeet = UnitRegistry.convert(10, 'm', 'ft');
    assert(Math.abs(metersToFeet - 32.8084) < 0.001, `Expected 10m ~ 32.8084ft, got ${metersToFeet}`);

    const feetToMeters = UnitRegistry.convert(metersToFeet, 'ft', 'm');
    assert(Math.abs(feetToMeters - 10) < 0.0001, `Expected reversible feet to meters, got ${feetToMeters}`);

    const kgToLb = UnitRegistry.convert(70, 'kg', 'lb');
    assert(Math.abs(kgToLb - 154.3236) < 0.01, `Expected 70kg ~ 154.32lb, got ${kgToLb}`);

    const cToF = UnitRegistry.convert(100, 'c', 'f');
    assert(cToF === 212, `Expected 100°C = 212°F, got ${cToF}`);
  }

  // 2. CurrencyRegistry formatting & isolation
  {
    const formattedUSD = CurrencyRegistry.format(500000, 'USD');
    assert(formattedUSD.includes('$500,000'), `Expected formatted USD, got ${formattedUSD}`);

    const formattedINR = CurrencyRegistry.format(500000, 'INR');
    assert(formattedINR.includes('₹500,000'), `Expected formatted INR, got ${formattedINR}`);
  }

  // 3. DurationEngine
  {
    const totalMonths = DurationEngine.toMonths(2, 5);
    assert(totalMonths === 29, `Expected 2 years 5 months = 29 months, got ${totalMonths}`);

    const decomposed = DurationEngine.fromMonths(29);
    assert(decomposed.years === 2 && decomposed.months === 5, 'Decomposed 29 months to 2y 5m');

    const formatted = DurationEngine.format(2, 5);
    assert(formatted === '2 years 5 months', `Expected '2 years 5 months', got ${formatted}`);
  }

  // 4. InterestRateNormalizer
  {
    const annualizedByaj = InterestRateNormalizer.normalize({ rate: 2, type: 'per_hundred_per_month' });
    assert(annualizedByaj.annualPercentage === 24, `Expected 2 per ₹100/mo = 24% p.a., got ${annualizedByaj.annualPercentage}`);
    assert(annualizedByaj.monthlyPercentage === 2, `Expected monthly % = 2, got ${annualizedByaj.monthlyPercentage}`);
    assert(annualizedByaj.annualDecimal === 0.24, `Expected decimal = 0.24, got ${annualizedByaj.annualDecimal}`);

    const standardPct = InterestRateNormalizer.normalize({ rate: 8.5, type: 'percentage_per_year' });
    assert(standardPct.annualPercentage === 8.5, `Expected 8.5% p.a., got ${standardPct.annualPercentage}`);
  }

  // 5. ValidationEngine (Empty remains empty, zero is valid)
  {
    const validationRes = ValidationEngine.validateFields(
      { amount: '', tenure: 0 },
      [
        { field: 'amount', validate: (v) => ValidationEngine.isRequired(v), message: 'Amount is required' },
        { field: 'tenure', validate: (v) => ValidationEngine.isNonNegative(v), message: 'Tenure must be non-negative' },
      ]
    );
    assert(!validationRes.isValid && validationRes.errors.amount === 'Amount is required', 'Empty input caught as required error');
    assert(!validationRes.errors.tenure, '0 is correctly recognized as a valid non-negative number');
  }

  // 6. CashFlowEngine & TimelineEngine
  {
    const flows = CashFlowEngine.generateMonthlyFlows(100000, 2000, 0.01, 12);
    assert(flows.length === 12, `Generated 12 months flows, got ${flows.length}`);

    const timeline = TimelineEngine.generateAnnualTimeline([
      { period: 1, principal: 1000, interest: 200, balance: 99000 },
      { period: 12, principal: 1100, interest: 150, balance: 88000 },
    ]);
    assert(timeline.length === 1 && timeline[0].period === 1, 'Aggregated timeline into year 1');
  }

  // 7. GoalEngine (Target corpus back-solving)
  {
    const goalRes = GoalEngine.calculateMonthlyContribution({
      targetAmount: 1000000,
      years: 10,
      expectedAnnualReturnRate: 12,
    });
    assert(goalRes.requiredMonthlySIP > 0, `Expected positive monthly SIP, got ${goalRes.requiredMonthlySIP}`);
    assert(goalRes.totalTarget === 1000000, 'Matched goal target');
  }

  // 8. ScenarioEngine
  {
    const scenarios = [
      { id: 'low_rate', name: 'Low Rate', input: 7 },
      { id: 'high_rate', name: 'High Rate', input: 9 },
    ];
    const outcomes = ScenarioEngine.compareScenarios(scenarios, (rate) => rate * 1000);
    assert(outcomes.length === 2 && outcomes[0].output === 7000 && outcomes[1].output === 9000, 'Ran scenarios through engine');
  }

  console.log('--- ALL PLATFORM ARCHITECTURAL SERVICES TESTS PASSED! ---');
}
