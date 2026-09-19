import { TOOLS, getToolCanonicalCategory, getToolCanonicalSubcategory, getToolCanonicalRoute } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { CURRENCIES } from '../../data/currencies';
import { COUNTRY_PROFILES } from '../../data/countries';
import {
  calculateSIP,
  calculateMortgage,
  calculateAutoLoan,
  calculateInvestment,
  calculateRetirement,
  calculateSavingsGoal,
  calculateCompoundInterest,
  calculateSimpleInterest,
  calculatePercentage,
  calculateDiscount,
  calculateROI,
  calculateYearlySIP,
} from '../financial';
import {
  calculateStepUpSIP,
  calculateCAGR,
  calculateSWP,
  calculateLumpsum,
} from '../mutualFunds';
import {
  calculatePPF,
  calculateSSY,
  calculateNPS,
  calculateAPY,
  calculateKVP,
  calculatePOMIS,
} from '../governmentSchemes';
import {
  calculateSIPVsInstrument,
  calculateSWPVsFD,
} from '../investmentComparisons';
import {
  calculateRentVsBuy,
  calculateInterestOffsetLoan,
  calculatePrepaymentVsSip,
} from '../propertyHomeBuying';
import {
  calculatePropertyTax,
  calculateRentalYield,
  calculateHomeAffordability,
} from '../property';
import {
  compareOldVsNewTaxRegimes,
  calculateNewRegimeTax,
  calculateOldRegimeTax,
} from '../taxEngines';
import {
  calculateGST,
  calculateBreakEven,
} from '../businessFinance';
import {
  calculateBMI,
  calculateTDEE,
  calculateWaterIntake,
} from '../health';
import {
  calculateAge,
  calculateFuelCost,
} from '../everyday';
import {
  calculateConcrete,
  calculatePaint,
  calculateTile,
  calculateElectricityBill,
  calculateCoolingBTU,
} from '../construction';
import { convertUnit } from '../conversion';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ [E2E FAILURE] ${message}`);
    throw new Error(`[E2E ASSERTION FAILED] ${message}`);
  }
}

export function runE2EFullSuite() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING DETERMINISTIC END-TO-END VERIFICATION SUITE');
  console.log('======================================================');

  // --- 1. TOOL REGISTRY INTEGRITY & ROUTING VERIFICATION ---
  console.log('🔹 [1/7] Testing Tools Registry & SEO URL Canonicality...');
  assert(Array.isArray(TOOLS) && TOOLS.length > 50, `Registry contains ${TOOLS.length} tools`);

  const slugSet = new Set<string>();
  const idSet = new Set<string>();

  for (const tool of TOOLS) {
    // ID uniqueness
    assert(!idSet.has(tool.id), `Duplicate tool id: "${tool.id}"`);
    idSet.add(tool.id);

    // Slug uniqueness & validity
    assert(!slugSet.has(tool.slug), `Duplicate tool slug: "${tool.slug}"`);
    slugSet.add(tool.slug);
    assert(/^[a-z0-9-]+$/.test(tool.slug), `Tool slug "${tool.slug}" has invalid characters`);

    // Required core metadata
    assert(tool.name && tool.name.trim().length > 0, `Tool "${tool.id}" missing name`);
    assert(tool.description && tool.description.length > 5, `Tool "${tool.id}" missing description`);
    assert(tool.category && tool.category.trim().length > 0, `Tool "${tool.id}" missing category`);

    // SEO canonical route resolving
    const cat = getToolCanonicalCategory(tool);
    const sub = getToolCanonicalSubcategory(tool);
    const route = getToolCanonicalRoute(tool);

    assert(typeof cat === 'string' && cat.length > 0, `Canonical category failed for ${tool.id}`);
    assert(typeof sub === 'string' && sub.length > 0, `Canonical subcategory failed for ${tool.id}`);
    assert(route.startsWith('/') && route.includes(tool.slug), `Canonical route invalid: ${route}`);
  }
  console.log(`   ✅ All ${TOOLS.length} tools verified with 100% unique slugs, canonical routes, and metadata.`);

  // --- 2. TAXONOMY DATA VERIFICATION ---
  console.log('\n🔹 [2/7] Testing Taxonomy Data (Categories, Currencies, Countries)...');
  assert(Array.isArray(CATEGORIES) && CATEGORIES.length >= 6, 'All primary categories present');
  for (const c of CATEGORIES) {
    assert(!!(c.id && c.name && c.iconName), `Category "${c.id}" missing essential properties`);
  }

  assert(typeof CURRENCIES === 'object' && Object.keys(CURRENCIES).length >= 8, 'Currencies record populated');
  assert(CURRENCIES.INR && CURRENCIES.INR.symbol === '₹', 'INR currency valid');
  assert(CURRENCIES.USD && CURRENCIES.USD.symbol === '$', 'USD currency valid');

  assert(typeof COUNTRY_PROFILES === 'object' && Object.keys(COUNTRY_PROFILES).length >= 5, 'Country profiles populated');
  assert(COUNTRY_PROFILES.IN && COUNTRY_PROFILES.IN.defaultCurrency === 'INR', 'India country profile valid');
  console.log('   ✅ Taxonomy data structure and profiles verified.');

  // --- 3. CORE FINANCIAL CALCULATIONS ---
  console.log('\n🔹 [3/7] Testing Core Financial Engines (Mortgage, Auto, Investment, Retirement)...');
  
  // SIP
  {
    const sip = calculateSIP({ monthlyInvestment: 5000, expectedReturnRate: 12, timePeriodYears: 10 });
    assert(sip.investedAmount === 600000, 'SIP invested amount is 6L');
    assert(sip.totalValue > 1150000 && sip.totalValue < 1200000, 'SIP total value ~11.6L');
    assert(sip.yearlyBreakdown.length === 10, 'SIP returns 10 years breakdown');
  }

  // Mortgage
  {
    const m = calculateMortgage({
      homeValue: 500000,
      downPayment: 100000,
      interestRate: 6.5,
      tenureYears: 30,
      annualPropertyTax: 6000,
      annualHomeInsurance: 1200,
    });
    assert(m.loanAmount === 400000, 'Mortgage loan amount is 400k');
    assert(m.monthlyPrincipalAndInterest > 2000, 'Monthly P&I > $2000');
    assert(m.totalMonthlyPayment > m.monthlyPrincipalAndInterest, 'Total monthly payment includes tax/insurance');
  }

  // Auto Loan
  {
    const a = calculateAutoLoan({
      vehiclePrice: 35000,
      downPayment: 5000,
      tradeInValue: 2000,
      salesTaxPercent: 7.0,
      interestRate: 5.0,
      loanTermMonths: 60,
    });
    assert(a.totalFinanced > 25000, 'Auto loan financed amount valid');
    assert(a.monthlyPayment > 400 && a.monthlyPayment < 800, 'Monthly auto payment in expected range');
    assert(a.totalLoanCost > 35000, 'Total cost exceeds base price');
  }

  // Investment
  {
    const inv = calculateInvestment({
      initialInvestment: 50000,
      monthlyContribution: 1000,
      expectedAnnualReturn: 10,
      timeHorizonYears: 20,
      inflationRate: 4,
    });
    assert(inv.totalPrincipal === 50000 + 1000 * 240, 'Total contributions calculated accurately');
    assert(inv.nominalWealth > inv.totalPrincipal * 2, 'Nominal future value reflects compounding');
    assert(inv.realWealth < inv.nominalWealth, 'Real value accounts for inflation discount');
  }

  // Retirement
  {
    const ret = calculateRetirement({
      currentAge: 30,
      retirementAge: 60,
      lifeExpectancyAge: 85,
      monthlySpendingInRetirement: 50000,
      inflationRate: 5,
      annualReturnPostRetirement: 8,
      annualReturnPreRetirement: 12,
      currentSavings: 500000,
      monthlySavings: 15000,
    });
    assert(ret.yearsToRetire === 30, '30 years to retire');
    assert(ret.yearsInRetirement === 25, '25 years in retirement');
    assert(ret.projectedNestEgg > 0, 'Projected nest egg positive');
    assert(ret.requiredNestEgg > 0, 'Required nest egg positive');
  }

  // Savings Goal
  {
    const sg = calculateSavingsGoal({
      targetAmount: 1000000,
      timeYears: 5,
      annualInterestRatePercent: 8,
      initialDeposit: 50000,
    });
    assert(sg.monthlySavingsRequired > 0, 'Monthly savings required is positive');
    assert(sg.totalPrincipalSaved < sg.futureValue, 'Principal is less than future value due to returns');
    assert(sg.progressMilestones.length === 5, '5 milestones for 5 years');
  }

  // Simple & Compound Interest
  {
    const si = calculateSimpleInterest({ principal: 50000, ratePercentage: 8, time: 3, timeUnit: 'years' });
    assert(si.simpleInterest === 12000, 'Simple interest 50000 * 0.08 * 3 = 12000');
    assert(si.totalAmount === 62000, 'Total amount 62000');

    const ci = calculateCompoundInterest({ principal: 50000, annualRate: 8, years: 3, compoundFrequency: 1 });
    assert(ci.totalInterest > si.simpleInterest, 'Compound interest exceeds simple interest');
  }

  // Percentage & Discount
  {
    const p = calculatePercentage({ type: 'what_is_x_percent_of_y', val1: 15, val2: 300 });
    assert(p.result === 45, '15% of 300 = 45');

    const disc = calculateDiscount({ originalPrice: 200, discountPercentage: 20, taxPercentage: 10 });
    assert(disc.savings === 40, 'Savings 40');
    assert(disc.finalPrice === 176, '200 - 40 + 10% tax on 160 = 176');
  }
  console.log('   ✅ Core financial calculation engines fully verified.');

  // --- 4. MUTUAL FUNDS & INVESTMENT COMPARISONS ---
  console.log('\n🔹 [4/7] Testing Mutual Funds, SIP, SWP & Comparisons...');
  // Step Up SIP
  {
    const stepUp = calculateStepUpSIP({
      initialMonthlyInvestment: 5000,
      annualStepUpPercentage: 10,
      expectedAnnualReturnRate: 12,
      investmentPeriodYears: 10,
    });
    assert(stepUp.totalInvestedAmount > 5000 * 12 * 10, 'Step-up invested exceeds flat SIP invested');
    assert(stepUp.totalMaturityCorpus > stepUp.totalInvestedAmount, 'Maturity corpus exceeds invested');
    assert(stepUp.yearlyBreakdown.length === 10, '10 annual breakdown rows');
  }

  // Yearly SIP
  {
    const ySip = calculateYearlySIP({
      yearlyInvestment: 100000,
      expectedReturnRate: 12,
      timePeriodYears: 10,
    });
    assert(ySip.totalInvested === 1000000, 'Yearly SIP invested is 10L');
    assert(ySip.finalMaturityValue > 1700000, 'Yearly SIP compounds correctly');
    assert(ySip.yearlyBreakdown.length === 10, '10 schedule rows');
  }

  // SWP
  {
    const swp = calculateSWP({
      initialCorpus: 2500000,
      monthlyWithdrawal: 20000,
      expectedAnnualReturnRate: 10,
      timePeriodYears: 10,
    });
    assert(swp.totalWithdrawn === 20000 * 120, 'Total withdrawn is 24L');
    assert(swp.finalRemainingCorpus > 0, 'Capital preserved with 10% returns');
  }

  // Lumpsum
  {
    const ls = calculateLumpsum({
      initialInvestment: 100000,
      expectedAnnualReturnRate: 12,
      investmentPeriodYears: 10,
    });
    assert(ls.investedAmount === 100000, 'Lumpsum investment 100k');
    assert(ls.totalMaturityCorpus > 300000, '100k at 12% for 10y ~310.5k');
  }

  // CAGR
  {
    const cagr = calculateCAGR({
      initialInvestment: 100000,
      finalValue: 200000,
      timePeriodYears: 5,
    });
    assert(Math.abs(cagr.cagrPercentage - 14.87) < 0.1, 'CAGR ~14.87% for 2x in 5 years');
  }

  // SWP vs FD
  {
    const swpFd = calculateSWPVsFD({
      principalCorpus: 2000000,
      monthlyCashflowNeeded: 15000,
      timePeriodYears: 5,
      swpExpectedReturnRate: 11,
      fdInterestRate: 7,
    });
    assert(swpFd.totalCashflowReceived === 15000 * 60, 'Cashflow is 9L');
    assert(swpFd.swpFinalCorpus > swpFd.fdFinalCorpus, 'SWP final corpus beats FD');
  }

  // SIP vs Comparisons
  {
    const sipComp = calculateSIPVsInstrument(
      {
        monthlyInvestment: 10000,
        timePeriodYears: 10,
        sipReturnRate: 12,
        comparisonInstrumentRate: 7,
      },
      'Fixed Deposit'
    );
    assert(sipComp.sipCorpus > sipComp.comparisonCorpus, 'SIP corpus beats standard FD');
    assert(sipComp.totalInvested === 1200000, 'Total invested is 12L');
  }
  console.log('   ✅ Mutual Funds, Step-Up SIP, SWP, and Comparison engines verified.');

  // --- 5. GOVERNMENT SCHEMES & TAX ENGINES ---
  console.log('\n🔹 [5/7] Testing Government Schemes (PPF, SSY, NPS, APY, KVP, POMIS) & Tax...');
  // PPF
  {
    const ppf = calculatePPF({ yearlyInvestment: 150000, interestRate: 7.1, tenureYears: 15 });
    assert(ppf.totalInvested === 2250000, 'PPF invested 22.5L');
    assert(ppf.maturityAmount > 4000000, 'PPF maturity > 40L');
  }

  // SSY
  {
    const ssy = calculateSSY({ yearlyDeposit: 100000 });
    assert(ssy.totalInvested === 1500000, 'SSY 15 years investment is 15L');
    assert(ssy.maturityAmount > 4500000, 'SSY maturity compounds to > 45L');
  }

  // NPS
  {
    const nps = calculateNPS({
      monthlyInvestment: 5000,
      currentAge: 28,
      expectedAnnualReturnRate: 10,
      annuityPercentage: 40,
      expectedAnnuityRate: 6,
    });
    assert(nps.yearsOfContribution === 32, '32 years from 28 to 60');
    assert(nps.totalAccumulatedCorpus > 10000000, 'NPS corpus reaches 8-figure mark');
    assert(nps.lumpSumAmount + nps.annuityCorpusAmount === nps.totalAccumulatedCorpus, 'Sum of lump sum and annuity equals corpus');
  }

  // APY
  {
    const apy = calculateAPY({ entryAge: 25, targetMonthlyPension: 5000 });
    assert(apy.monthlyContribution > 0, 'APY monthly contribution calculated');
    assert(apy.guaranteedMonthlyPension === 5000, 'Guaranteed pension matches target');
  }

  // KVP
  {
    const kvp = calculateKVP({ depositAmount: 50000 });
    assert(kvp.maturityAmount === 100000, 'KVP strictly doubles principal');
    assert(kvp.doublingMonths === 115, 'KVP current doubling period is 115 months');
  }

  // POMIS
  {
    const pomis = calculatePOMIS({ depositAmount: 450000, interestRate: 7.4 });
    assert(pomis.monthlyIncome > 2700, 'POMIS monthly payout computed');
    assert(pomis.principalReturnedAtMaturity === 450000, 'POMIS principal returned intact');
  }

  // Tax Regimes
  {
    const newTax = calculateNewRegimeTax({ annualGrossIncome: 1200000, isSalaried: true });
    assert(newTax.totalTaxPayable > 0, 'Tax payable computed for 12L');

    const oldTax = calculateOldRegimeTax({
      annualGrossIncome: 1200000,
      isSalaried: true,
      section80C: 150000,
      section80D: 25000,
      hraExemption: 100000,
      homeLoanInterest80EEA_24b: 150000,
    });
    assert(oldTax.netTaxableIncome < 1200000, 'Deductions lower taxable income');

    const comp = compareOldVsNewTaxRegimes({ annualGrossIncome: 1500000, isSalaried: true, section80C: 150000 });
    assert(comp.taxDifference !== undefined, 'Comparison difference provided');
  }
  console.log('   ✅ Government schemes and taxation engines verified.');

  // --- 6. PROPERTY, BUSINESS, HEALTH, CONSTRUCTION & EVERYDAY ---
  console.log('\n🔹 [6/7] Testing Property, Business, Health, Construction & Unit Engines...');
  // Property
  {
    const propTax = calculatePropertyTax({ propertyValue: 500000, taxRatePercent: 1.2 });
    assert(propTax.annualTax === 6000, 'Property tax 500k * 1.2% = 6000');
    assert(propTax.monthlyTax === 500, 'Monthly property tax 500');

    const afford = calculateHomeAffordability({ annualGrossIncome: 120000, monthlyDebtPayments: 500, downPaymentAvailable: 50000, interestRatePercent: 6.5, loanTermYears: 30 });
    assert(afford.maxAffordableHomePrice > 300000, 'Affordability calculated');

    const yieldRes = calculateRentalYield({ purchasePrice: 300000, monthlyRent: 2000, annualMaintenance: 2000, annualPropertyTax: 3000 });
    assert(yieldRes.grossRentalYieldPercent === 8.0, 'Gross yield 24k / 300k = 8.0%');

    const prepay = calculatePrepaymentVsSip({
      outstandingLoan: 3000000,
      loanInterestRate: 8.5,
      remainingTenureMonths: 180,
      monthlySurplus: 10000,
      sipExpectedReturnRate: 12,
    });
    assert(prepay.prepaymentInterestSaved > 0, 'Prepayment interest savings calculated');

    const rvb = calculateRentVsBuy({
      homePrice: 5000000,
      downPayment: 1000000,
      loanAmount: 4000000,
      loanInterestRate: 8.5,
      loanTermYears: 20,
      monthlyRent: 20000,
      annualRentIncrease: 5,
      propertyAppreciationRate: 5,
      investmentReturnRate: 12,
      annualMaintenanceRate: 1,
      annualPropertyTaxRate: 0.5,
      annualInsurance: 10000,
      buyingCosts: 200000,
      sellingCosts: 300000,
      timeHorizonYears: 15,
    });
    assert(rvb.finalHomeValue > 5000000, 'Rent vs Buy calculated');
  }

  // Business
  {
    const gst = calculateGST({ amount: 10000, gstRate: 18, type: 'add_gst' });
    assert(gst.gstAmount === 1800, 'GST 18% on 10k is 1800');
    assert(gst.totalGrossAmount === 11800, 'Gross is 11800');

    const be = calculateBreakEven({ fixedCosts: 50000, sellingPricePerUnit: 100, variableCostPerUnit: 60 });
    assert(be.breakEvenUnits === 1250, 'Break-even 50000 / 40 = 1250 units');
    assert(be.breakEvenRevenue === 125000, 'Break-even revenue 125,000');

    const roi = calculateROI({ initialInvestment: 10000, finalValue: 15000 });
    assert(roi.netProfit === 5000, 'Profit is 5000');
    assert(roi.roiPercentage === 50, 'ROI is 50%');
  }

  // Health
  {
    const bmi = calculateBMI({ weightKg: 70, heightCm: 175 });
    assert(Math.abs(bmi.bmi - 22.86) < 0.1, 'BMI ~22.86');
    assert(bmi.category === 'Normal weight', 'BMI category normal');

    const tdee = calculateTDEE({
      weightKg: 70,
      heightCm: 175,
      age: 30,
      gender: 'male',
      activityLevel: 'moderate',
      goal: 'maintain',
    });
    assert(tdee.bmr > 1500 && tdee.bmr < 1800, 'Male BMR in standard range');
    assert(tdee.tdee > tdee.bmr, 'TDEE exceeds base BMR');

    const water = calculateWaterIntake(70, 45, 'normal');
    assert(water.liters > 2.0, 'Water intake > 2L for 70kg active adult');
  }

  // Everyday
  {
    const age = calculateAge('1995-05-15', '2025-05-15');
    assert(age.years === 30, 'Exact 30 years age');

    const fuel = calculateFuelCost({ distanceKm: 500, fuelEfficiencyKmPerLiter: 20, fuelPricePerLiter: 100, passengers: 4 });
    assert(fuel.litersNeeded === 25, '25 liters for 500km');
    assert(fuel.totalCost === 2500, 'Fuel cost 2500');
    assert(fuel.costPerPerson === 625, 'Cost per person 625');
  }

  // Construction & Utility
  {
    const conc = calculateConcrete({ shape: 'slab', lengthFeet: 10, widthFeet: 10, depthInches: 6 });
    assert(conc.cubicFeet === 50, '50 cubic feet slab');
    assert(conc.bags60lb > 0 && conc.bags80lb > 0, 'Bags count calculated');

    const paint = calculatePaint({ lengthFeet: 15, widthFeet: 12, heightFeet: 10, doorsCount: 1, windowsCount: 2, coats: 2, includeCeiling: false });
    assert(paint.litersNeeded > 0, 'Paint volume calculated');

    const tile = calculateTile({ roomLengthFeet: 12, roomWidthFeet: 10, tileLengthInches: 12, tileWidthInches: 12, wastePercentage: 10 });
    assert(tile.tileCountWithWaste > 120, 'Tile count with waste calculated');

    const elec = calculateElectricityBill({ wattage: 1500, dailyHours: 8, costPerKWh: 0.15 });
    assert(elec.monthlyKWh > 0 && elec.monthlyCost > 0, 'Electricity bill calculated');

    const btu = calculateCoolingBTU({ lengthFeet: 15, widthFeet: 12, ceilingHeightFeet: 9, sunExposure: 'normal', occupants: 2 });
    assert(btu.recommendedTons > 0, 'AC cooling tons calculated');
  }

  // Unit Conversion
  {
    const len = convertUnit(100, 'meter', 'foot', 'length');
    assert(Math.abs(len - 328.084) < 0.1, '100m ~ 328.084ft');

    const temp = convertUnit(100, 'celsius', 'fahrenheit', 'temperature');
    assert(temp === 212, '100C = 212F');

    const weight = convertUnit(1, 'kilogram', 'pound', 'mass');
    assert(Math.abs(weight - 2.20462) < 0.01, '1kg ~ 2.205lb');
  }
  console.log('   ✅ Property, Business, Health, Construction & Everyday engines verified.');

  // --- 7. BOUNDARY, EXTREMES & ZERO-DIVISION SAFETY ---
  console.log('\n🔹 [7/7] Testing Boundary Conditions, Zero Values & Numeric Edge Cases...');
  {
    // Zero SIP
    const zeroSip = calculateSIP({ monthlyInvestment: 0, expectedReturnRate: 12, timePeriodYears: 10 });
    assert(zeroSip.totalValue === 0 && zeroSip.investedAmount === 0, 'Zero monthly SIP returns 0');

    // Zero interest rate SIP
    const zeroRateSip = calculateSIP({ monthlyInvestment: 5000, expectedReturnRate: 0, timePeriodYears: 5 });
    assert(zeroRateSip.totalValue === 5000 * 60, '0% rate returns strictly principal');

    // Zero interest mortgage
    const zeroRateMortgage = calculateMortgage({ homeValue: 120000, downPayment: 0, interestRate: 0, tenureYears: 10 });
    assert(zeroRateMortgage.monthlyPrincipalAndInterest === 1000, '0% interest mortgage divides evenly over 120 months');

    // Break-even with 0 margin
    const zeroBe = calculateBreakEven({ fixedCosts: 1000, sellingPricePerUnit: 50, variableCostPerUnit: 50 });
    assert(zeroBe.breakEvenUnits === 0, 'Zero contribution margin handled gracefully');

    // High number compounding
    const hugeCi = calculateCompoundInterest({ principal: 100000000, annualRate: 15, years: 30, compoundFrequency: 12 });
    assert(!isNaN(hugeCi.totalAmount) && isFinite(hugeCi.totalAmount) && hugeCi.totalAmount > 0, 'Huge numbers compute safely');
  }
  console.log('   ✅ All edge cases, boundary values, and safety guards verified.');

  console.log('\n======================================================');
  console.log('🏆 ALL END-TO-END VERIFICATIONS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}
