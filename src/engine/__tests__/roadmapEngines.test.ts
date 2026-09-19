import {
  calculateRentVsBuy,
  calculateInterestOffsetLoan,
} from '../propertyHomeBuying';
import {
  calculateStepUpSIP,
  calculateCAGR,
} from '../mutualFunds';
import {
  calculateSIPVsInstrument,
  calculateSWPVsFD,
} from '../investmentComparisons';
import {
  calculatePPF,
} from '../governmentSchemes';
import {
  compareOldVsNewTaxRegimes,
} from '../taxEngines';
import {
  calculateEmergencyFund,
} from '../personalFinance';
import {
  calculateGST,
  calculateBreakEven,
} from '../businessFinance';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error('❌ FAIL: ' + msg);
    throw new Error('Test Failed: ' + msg);
  } else {
    console.log('✅ PASS: ' + msg);
  }
}

export function runRoadmapEnginesTests() {
  console.log('--- RUNNING ROADMAP FINANCIAL ENGINES TESTS ---');

  // 1. Property Home Buying
  {
    const res = calculateRentVsBuy({
      homePrice: 7500000,
      downPayment: 1500000,
      loanAmount: 6000000,
      loanInterestRate: 8.5,
      loanTermYears: 20,
      monthlyRent: 25000,
      annualRentIncrease: 5,
      propertyAppreciationRate: 5,
      investmentReturnRate: 12,
      annualMaintenanceRate: 1,
      annualPropertyTaxRate: 0.5,
      annualInsurance: 10000,
      buyingCosts: 300000,
      sellingCosts: 400000,
      timeHorizonYears: 15,
    });
    assert(res.finalHomeValue > 7500000, 'Rent vs buy final home value > 75L');
    assert(res.totalRentPaid > 0, 'Rent paid > 0');
    assert(typeof res.betterOption === 'string', 'Valid better option returned');
  }

  // 2. Interest Offset Loan
  {
    const res = calculateInterestOffsetLoan({
      homePrice: 5000000,
      downPayment: 0,
      loanAmount: 5000000,
      loanInterestRate: 8.5,
      loanTermYears: 20,
      monthlySipAmount: 10000,
      expectedSipReturnRate: 12,
    });
    assert(res.normalLoanInterest > 0, 'Normal loan interest > 0');
    assert(res.estimatedSipFutureValue > 0, 'Estimated SIP future value > 0');
  }

  // 3. Step Up SIP
  {
    const res = calculateStepUpSIP({
      initialMonthlyInvestment: 10000,
      annualStepUpPercentage: 10,
      expectedAnnualReturnRate: 12,
      investmentPeriodYears: 10,
    });
    assert(res.totalInvestedAmount > 1200000, 'Step-up invested > 12L');
    assert(res.totalMaturityCorpus > res.totalInvestedAmount, 'Maturity corpus > invested amount');
  }

  // 4. CAGR
  {
    const res = calculateCAGR({
      initialInvestment: 100000,
      finalValue: 200000,
      timePeriodYears: 5,
    });
    assert(Math.abs(res.cagrPercentage - 14.87) < 0.2, 'CAGR ~14.87%');
  }

  // 5. PPF
  {
    const res = calculatePPF({
      yearlyInvestment: 150000,
      interestRate: 7.1,
      tenureYears: 15,
    });
    assert(res.totalInvested === 2250000, 'PPF total deposited 22.5L');
    assert(res.maturityAmount > 4000000, 'PPF maturity > 40L');
  }

  // 6. Tax
  {
    const res = compareOldVsNewTaxRegimes({
      annualGrossIncome: 1500000,
      isSalaried: true,
      section80C: 150000,
      section80D: 25000,
      hraExemption: 120000,
      homeLoanInterest80EEA_24b: 200000,
    });
    assert(res.newRegime.totalTaxPayable > 0, 'New regime tax > 0');
    assert(res.oldRegime.totalTaxPayable > 0, 'Old regime tax > 0');
  }

  // 7. GST
  {
    const forward = calculateGST({
      amount: 10000,
      gstRate: 18,
      type: 'add_gst',
      isInterstate: false,
    });
    assert(forward.gstAmount === 1800, 'GST forward amount 1800');
    assert(forward.totalGrossAmount === 11800, 'GST total gross 11800');
  }

  // 8. Break-Even
  {
    const be = calculateBreakEven({
      fixedCosts: 100000,
      sellingPricePerUnit: 500,
      variableCostPerUnit: 300,
    });
    assert(be.contributionMarginPerUnit === 200, 'Contribution margin 200');
    assert(be.breakEvenUnits === 500, 'Break-even units 500');
  }

  console.log('--- ALL ROADMAP ENGINE TESTS PASSED SUCCESSFULLY ---');
}
