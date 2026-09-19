import {
  calculateGoldValue,
  calculateGoldLoan,
  calculateGoldPurity,
  calculateGoldJewelleryCost,
  calculateGoldInvestmentReturn,
  normalizeToGrams,
  getPurityFraction,
} from '../goldEngines';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

export function runGoldEnginesTests() {
  console.log('--- STARTING GOLD & PRECIOUS METALS DETERMINISTIC ENGINE TESTS ---');

  // 1. Normalization & Purity
  {
    assert(normalizeToGrams(10, 'g') === 10, '10g normalizes to 10g');
    assert(Math.abs(normalizeToGrams(1, 'ozt') - 31.1034768) < 0.001, '1 ozt converts to ~31.1035g');
    assert(Math.abs(normalizeToGrams(1, 'tola') - 11.6638038) < 0.001, '1 tola converts to ~11.6638g');
    assert(getPurityFraction(24) === 1.0, '24K is 100% fine');
    assert(Math.abs(getPurityFraction(22) - 22 / 24) < 1e-6, '22K is 22/24 fraction');
  }

  // 2. Gold Value Formula Tests
  {
    // 24K: 10g * 7000 = 70,000
    const res24k = calculateGoldValue({
      weight: 10,
      weightUnit: 'g',
      purity: 24,
      goldRate: 7000,
      rateUnit: 'per_g',
      rateBasis: '24k_reference',
    });
    assert(!!res24k && res24k.goldValue === 70000, 'Gold Value 24K 10g @ 7000/g = 70,000');

    // 22K: 10g * (22/24) * 7000 = 64,166.67
    const res22k = calculateGoldValue({
      weight: 10,
      weightUnit: 'g',
      purity: 22,
      goldRate: 7000,
      rateUnit: 'per_g',
      rateBasis: '24k_reference',
    });
    const exp22k = 10 * (22 / 24) * 7000;
    assert(!!res22k && Math.abs(res22k.goldValue - exp22k) < 0.01, 'Gold Value 22K 10g @ 7000/g = 64,166.67');

    // Empty rate/weight should return null
    const resEmpty = calculateGoldValue({
      weight: '',
      weightUnit: 'g',
      purity: 24,
      goldRate: '',
      rateUnit: 'per_g',
      rateBasis: '24k_reference',
    });
    assert(resEmpty === null, 'Gold Value returns null for empty inputs');
  }

  // 3. Gold Loan Formula Tests
  {
    // 50g 22K @ 7000 24K ref = 320,833.33. LTV 75% = 240,625. EMI 12 mo @ 9%
    const resLoan = calculateGoldLoan({
      weight: 50,
      weightUnit: 'g',
      purity: 22,
      goldRate: 7000,
      rateUnit: 'per_g',
      ltvPercent: 75,
      interestRate: 9,
      loanTerm: 12,
      termUnit: 'months',
      repaymentMethod: 'emi',
    });
    assert(!!resLoan, 'Gold Loan calculation returned non-null');
    assert(Math.abs(resLoan!.estimatedGoldValue - 320833.33) < 1, 'Estimated gold value ~320,833');
    assert(Math.abs(resLoan!.maxEligibleLoan - 240625) < 1, 'Max eligible loan ~240,625');
    assert(resLoan!.isEligible === true, 'Loan is eligible within LTV');
    assert(resLoan!.periodicPayment > 20000 && resLoan!.periodicPayment < 22000, 'Valid monthly EMI ~21,048');

    // Zero interest rate
    const resZeroInterest = calculateGoldLoan({
      weight: 10,
      weightUnit: 'g',
      purity: 24,
      goldRate: 6000,
      rateUnit: 'per_g',
      ltvPercent: 50,
      desiredLoanAmount: 30000,
      interestRate: 0,
      loanTerm: 6,
      termUnit: 'months',
      repaymentMethod: 'emi',
    });
    assert(resZeroInterest?.periodicPayment === 5000, '0% interest EMI is exactly P/n = 5,000');
    assert(resZeroInterest?.totalInterest === 0, '0% interest has total interest = 0');
  }

  // 4. Gold Purity Formula Tests
  {
    const resPurity = calculateGoldPurity({
      weight: 100,
      weightUnit: 'g',
      carat: 22,
    });
    assert(!!resPurity, 'Purity returned non-null');
    assert(Math.abs(resPurity!.purityPercent - 91.666667) < 0.001, '22K purity is ~91.6667%');
    assert(Math.abs(resPurity!.pureGoldWeight - 91.6667) < 0.01, 'Pure gold weight is 91.67g');
    assert(Math.abs(resPurity!.nonGoldWeight - 8.3333) < 0.01, 'Non-gold weight is 8.33g');
    assert(resPurity!.hallmarkCode === '916', 'Hallmark code is 916');
  }

  // 5. Gold Jewellery Cost Formula Tests
  {
    const resJewellery = calculateGoldJewelleryCost({
      weight: 20,
      weightUnit: 'g',
      purity: 22,
      goldRate: 7000,
      rateUnit: 'per_g',
      rateBasis: '24k_reference',
      makingCharge: 10,
      makingChargeType: 'percentage',
      wastagePercent: 4,
      stoneCharges: 2500,
      otherCharges: 500,
      taxPercent: 3,
    });
    assert(!!resJewellery, 'Jewellery cost returned non-null');
    const expGold = 20 * (22 / 24) * 7000;
    const expWastage = expGold * 0.04;
    const expMaking = expGold * 0.10;
    const expSubtotal = expGold + expWastage + expMaking + 2500 + 500;
    const expTax = expSubtotal * 0.03;
    const expFinal = expSubtotal + expTax;

    assert(Math.abs(resJewellery!.goldValue - expGold) < 0.01, 'Jewellery gold value matches');
    assert(Math.abs(resJewellery!.wastageCost - expWastage) < 0.01, 'Jewellery wastage cost matches');
    assert(Math.abs(resJewellery!.makingChargeAmount - expMaking) < 0.01, 'Jewellery making charge matches');
    assert(Math.abs(resJewellery!.finalPrice - expFinal) < 0.01, 'Jewellery final price matches');
    assert(Math.abs(resJewellery!.effectivePricePerGram - expFinal / 20) < 0.01, 'Effective price per gram matches');
  }

  // 6. Gold Investment Return Formula Tests
  {
    const resReturn = calculateGoldInvestmentReturn({
      mode: 'quantity',
      quantity: 50,
      weightUnit: 'g',
      purchasePrice: 5000,
      currentPrice: 7000,
      purchaseDate: '2022-01-01',
      saleDate: '2024-01-01',
      purchaseCosts: 1000,
      sellingCosts: 1000,
    });
    assert(!!resReturn, 'Investment return returned non-null');
    assert(resReturn!.totalInitialInvestment === 251000, 'Total invested = 250,000 + 1000 = 251,000');
    assert(resReturn!.netCurrentValue === 349000, 'Net value = 350,000 - 1000 = 349,000');
    assert(resReturn!.absoluteProfitLoss === 98000, 'Profit = 98,000');
    assert(Math.abs(resReturn!.returnPercent - (98000 / 251000) * 100) < 0.01, 'Return % matches');
    assert(resReturn!.hasValidDates === true, 'Dates flagged valid');
    assert(typeof resReturn!.annualizedReturnCAGR === 'number' && resReturn!.annualizedReturnCAGR > 15, 'Valid CAGR > 15%');
  }

  console.log('--- ALL GOLD & PRECIOUS METALS ENGINE TESTS PASSED! ---');
}
