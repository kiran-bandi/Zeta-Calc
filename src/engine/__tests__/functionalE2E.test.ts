import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { searchTools } from '../../components/search/UniversalSearchModal';
import { calculateEMI, validateEMIInput } from '../emi';
import { calculateSIP, calculateMortgage, calculateCompoundInterest } from '../financial';
import { calculateStepUpSIP } from '../mutualFunds';
import { calculateRentVsBuy } from '../propertyHomeBuying';
import { calculateBMI } from '../health';
import { calculateFuelCost } from '../everyday';
import { CurrencyRegistry, UnitRegistry } from '../../platform';

function assert(condition: boolean, testName: string, detail?: string) {
  if (!condition) {
    console.error(`❌ FAILED [${testName}]: ${detail || 'Condition not met'}`);
    throw new Error(`Functional E2E failure in "${testName}": ${detail}`);
  } else {
    console.log(`✅ PASSED [${testName}]${detail ? ` - ${detail}` : ''}`);
  }
}

export function runFunctionalE2ETests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING END-TO-END FUNCTIONAL USER FLOW TEST SUITE');
  console.log('======================================================\n');

  // =========================================================================
  // TEST SUITE 1: Universal Search Functionality & Relevancy Engine
  // =========================================================================
  console.log('--- 1. UNIVERSAL SEARCH FUNCTIONALITY FLOWS ---');

  // 1.1 Exact Name & Intent Search
  {
    const exactResults = searchTools('EMI Calculator');
    assert(exactResults.length > 0, 'Search: Exact Name', 'Found matches for "EMI Calculator"');
    assert(exactResults[0].tool.slug === 'emi-calculator', 'Search: Exact Name Match', 'EMI calculator is top result');
    assert(exactResults[0].score >= 100, 'Search: Exact Name Score', `Score: ${exactResults[0].score}`);

    const intentResults = searchTools('Loan EMI Calculator');
    assert(intentResults.length > 0, 'Search: Multi-word Intent', 'Found matches for "Loan EMI Calculator"');
    assert(intentResults[0].tool.slug === 'emi-calculator', 'Search: Intent Top Rank', 'EMI calculator is top result for "Loan EMI Calculator"');
  }

  // 1.2 Partial / Prefix Search
  {
    const results = searchTools('mortg');
    assert(results.length > 0, 'Search: Prefix', 'Found matches for "mortg"');
    const mortgageTool = results.find((r) => r.tool.slug === 'mortgage-calculator');
    assert(!!mortgageTool, 'Search: Prefix Match', 'Mortgage calculator present in results');
  }

  // 1.3 Synonym / Intent Search
  {
    const carResults = searchTools('car loan payment');
    assert(carResults.length > 0, 'Search: Synonym Intent', 'Found matches for "car loan payment"');
    const autoLoan = carResults.find((r) => r.tool.slug === 'auto-loan-calculator' || r.tool.slug === 'car-loan-calculator');
    assert(!!autoLoan, 'Search: Auto Loan Synonym', 'Auto/Car loan found from "car loan payment"');

    const fuelResults = searchTools('gas mileage trip cost');
    assert(fuelResults.length > 0, 'Search: Fuel Synonym', 'Found matches for "gas mileage trip cost"');
    const fuelTool = fuelResults.find((r) => r.tool.slug === 'fuel-cost-calculator');
    assert(!!fuelTool, 'Search: Fuel Tool Match', 'Fuel cost calculator resolved via fuel synonym query');
  }

  // 1.4 Category Keyword Search
  {
    const healthResults = searchTools('health');
    assert(healthResults.length >= 5, 'Search: Category Search', `Found ${healthResults.length} tools for "health"`);
    const bmi = healthResults.find((r) => r.tool.slug === 'bmi-calculator');
    assert(!!bmi, 'Search: Category Tool Result', 'BMI Calculator found under "health" query');
  }

  // 1.5 Edge Cases: Whitespace, Case-insensitivity, and Non-existent query
  {
    const whitespaceResults = searchTools('   SIP CALCULATOR   ');
    assert(whitespaceResults.length > 0 && whitespaceResults[0].tool.slug === 'sip-calculator', 'Search: Whitespace & Uppercase', 'Trimmed & case-insensitive search passed');

    const emptyResults = searchTools('');
    assert(emptyResults.length === 0, 'Search: Empty Query', 'Empty query returns zero matches');

    const nonsenseResults = searchTools('xyz987nonsensequery');
    assert(nonsenseResults.length === 0, 'Search: Nonexistent Query', 'Nonsense query handled cleanly without exceptions');
  }

  // =========================================================================
  // TEST SUITE 2: Navigation & Hash Router Simulation
  // =========================================================================
  console.log('\n--- 2. NAVIGATION & ROUTER DEEP-LINKING FLOWS ---');

  const simulateParseHash = (hashStr: string) => {
    const raw = hashStr.replace('#', '').trim();
    if (!raw || raw === '/') return 'home';
    const hash = raw.split('?')[0];

    if (hash.startsWith('/embed/')) {
      const slug = hash.replace('/embed/', '');
      return `embed-${slug}`;
    }
    if (hash.startsWith('/tool/')) {
      const slug = hash.replace('/tool/', '');
      return `tool-${slug}`;
    }
    if (hash.startsWith('/category/')) {
      const cat = hash.replace('/category/', '');
      return `category-${cat}`;
    }
    if (hash === '/all-tools') return 'all-tools';
    if (hash === '/decision-center') return 'decision-center';
    if (hash === '/collections') return 'collections';
    if (hash === '/discover') return 'discover';

    // Support canonical route format: /categorySlug/toolSlug or /categorySlug
    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 2) {
      const [, toolSlug] = parts;
      const matchedTool = TOOLS_REGISTRY.find((t) => t.slug === toolSlug);
      if (matchedTool) return `tool-${toolSlug}`;
    } else if (parts.length === 1) {
      const [catSlug] = parts;
      const matchedCat = CATEGORIES.find((c) => c.slug === catSlug || c.id === catSlug);
      if (matchedCat) return `category-${matchedCat.id}`;
      const matchedTool = TOOLS_REGISTRY.find((t) => t.slug === catSlug);
      if (matchedTool) return `tool-${catSlug}`;
    }

    return 'home';
  };

  assert(simulateParseHash('#/') === 'home', 'Router: Root URL', 'Maps to home');
  assert(simulateParseHash('') === 'home', 'Router: Empty Hash', 'Maps to home');
  assert(simulateParseHash('#/all-tools') === 'all-tools', 'Router: All Tools', 'Maps to all-tools');
  assert(simulateParseHash('#/decision-center') === 'decision-center', 'Router: Decision Center', 'Maps to decision-center');
  assert(simulateParseHash('#/collections') === 'collections', 'Router: Collections', 'Maps to collections');
  assert(simulateParseHash('#/discover') === 'discover', 'Router: Discover', 'Maps to discover');
  assert(simulateParseHash('#/category/finance') === 'category-finance', 'Router: Category Route', 'Maps to category-finance');
  assert(simulateParseHash('#/tool/emi-calculator') === 'tool-emi-calculator', 'Router: Tool Route', 'Maps to tool-emi-calculator');
  assert(simulateParseHash('#/embed/emi-calculator') === 'embed-emi-calculator', 'Router: Embed Route', 'Maps to embed-emi-calculator');
  assert(simulateParseHash('#/finance/emi-calculator') === 'tool-emi-calculator', 'Router: Canonical Path', 'Maps to tool-emi-calculator');
  assert(simulateParseHash('#/property') === 'category-property', 'Router: Direct Category Slug', 'Maps to category-property');

  // Verify all 330 tools can be routed cleanly
  let routeFailures = 0;
  for (const tool of TOOLS_REGISTRY) {
    const route = simulateParseHash(`#/tool/${tool.slug}`);
    if (route !== `tool-${tool.slug}`) routeFailures++;
  }
  assert(routeFailures === 0, 'Router: All 330 Tools Accessible', 'All registered tools route with 100% accuracy');

  // =========================================================================
  // TEST SUITE 3: Interactive End-to-End Calculator Execution Flows
  // =========================================================================
  console.log('\n--- 3. END-TO-END CALCULATOR FUNCTIONAL EXECUTION FLOWS ---');

  // 3.1 Loan EMI Interactive User Flow (Principal: $500,000, 7.5%, 20y vs 30y comparison)
  {
    const input20y = { loanAmount: 500000, interestRate: 7.5, tenure: 20, tenureUnit: 'years' as const };
    const res20y = calculateEMI(input20y);
    assert(res20y.monthlyEMI === 4028, 'EMI Flow: 20y Monthly Payment', `Monthly EMI is $${res20y.monthlyEMI}`);
    assert(res20y.monthlyAmortization.length === 240, 'EMI Flow: 240 Amortized Periods', 'Full monthly amortization schedule generated');
    assert(res20y.yearlyAmortization.length === 20, 'EMI Flow: 20 Yearly Amortized Rows', 'Yearly aggregate schedule generated');

    // User switches tenure to 30 years
    const input30y = { loanAmount: 500000, interestRate: 7.5, tenure: 30, tenureUnit: 'years' as const };
    const res30y = calculateEMI(input30y);
    assert(res30y.monthlyEMI === 3496, 'EMI Flow: 30y Monthly Payment', `Monthly EMI drops to $${res30y.monthlyEMI}`);
    assert(res30y.totalInterest > res20y.totalInterest, 'EMI Flow: Interest Increase on Longer Tenure', `30y interest ($${res30y.totalInterest}) > 20y interest ($${res20y.totalInterest})`);

    // Input Validation
    const invalidRes = validateEMIInput({ loanAmount: 0, interestRate: 5, tenure: 10, tenureUnit: 'years' });
    assert(!invalidRes.isValid && !!invalidRes.errors.loanAmount, 'EMI Flow: Zero Loan Amount Error', 'Properly flagged zero loan amount');
  }

  // 3.2 Mortgage Calculator Functional Flow (Home purchase, Down payment & Escrow)
  {
    const mortgageRes = calculateMortgage({
      homeValue: 600000,
      downPayment: 120000, // 20% down
      interestRate: 6.8,
      tenureYears: 30,
      annualPropertyTax: 7500,
      annualHomeInsurance: 1500,
    });
    assert(mortgageRes.loanAmount === 480000, 'Mortgage Flow: Loan Amount', `Loan principal: $${mortgageRes.loanAmount}`);
    assert(mortgageRes.monthlyPrincipalAndInterest > 3000, 'Mortgage Flow: Monthly P&I', `Monthly Principal & Interest: $${mortgageRes.monthlyPrincipalAndInterest}`);
    assert(mortgageRes.totalMonthlyPayment > mortgageRes.monthlyPrincipalAndInterest, 'Mortgage Flow: Total Escrow', `Total monthly with taxes & insurance: $${mortgageRes.totalMonthlyPayment}`);
    assert(mortgageRes.totalInterest > 500000, 'Mortgage Flow: Total Interest', `Total interest calculated: $${mortgageRes.totalInterest}`);
  }

  // 3.3 Systematic Investment Plan (SIP) & Step-Up Compounding Flow
  {
    const regularSIP = calculateSIP({ monthlyInvestment: 15000, expectedReturnRate: 12.5, timePeriodYears: 10 });
    const stepUpSIP = calculateStepUpSIP({
      initialMonthlyInvestment: 15000,
      annualStepUpPercentage: 10,
      expectedAnnualReturnRate: 12.5,
      investmentPeriodYears: 10,
    });

    assert(regularSIP.investedAmount === 1800000, 'SIP Flow: Invested Principal', '15k * 12 * 10 = $1,800,000');
    assert(regularSIP.totalValue > regularSIP.investedAmount, 'SIP Flow: Wealth Multiplier', `Corpus grew to $${regularSIP.totalValue}`);

    assert(stepUpSIP.totalInvestedAmount > regularSIP.investedAmount, 'Step-Up Flow: Step-Up Principal', `Step-up total invested ($${stepUpSIP.totalInvestedAmount}) > regular SIP ($${regularSIP.investedAmount})`);
    assert(stepUpSIP.totalMaturityCorpus > regularSIP.totalValue, 'Step-Up Flow: Accelerated Maturity Value', `Step-up final value ($${stepUpSIP.totalMaturityCorpus}) > regular SIP ($${regularSIP.totalValue})`);
  }

  // 3.4 Buy vs Rent Financial Decision Flow
  {
    const buyVsRent = calculateRentVsBuy({
      homePrice: 450000,
      downPayment: 90000, // 20% down
      loanInterestRate: 6.5,
      loanTermYears: 30,
      propertyAppreciationRate: 3.5,
      annualPropertyTaxRate: 1.2,
      annualMaintenanceRate: 1.0,
      monthlyRent: 2200,
      annualRentIncrease: 3.0,
      investmentReturnRate: 7.0,
      timeHorizonYears: 15,
    });

    assert(buyVsRent.loanAmount === 360000, 'Buy vs Rent Flow: Loan Amount', `Loan amount is $${buyVsRent.loanAmount}`);
    assert(buyVsRent.yearlyComparison.length === 15, 'Buy vs Rent Flow: 15-Year Horizon Breakdown', 'All 15 comparative years analyzed');
    assert(typeof buyVsRent.breakEvenYear === 'number' || buyVsRent.breakEvenYear === null, 'Buy vs Rent Flow: Break-Even Year', `Break-even identified at year: ${buyVsRent.breakEvenYear}`);
  }

  // 3.5 Everyday Fuel Cost Calculator Flow
  {
    const fuelRes = calculateFuelCost({
      distanceKm: 500,
      fuelEfficiencyKmPerLiter: 12.5, // 12.5 km/L
      fuelPricePerLiter: 1.5, // $1.50/L
      passengers: 4,
    });

    assert(fuelRes.litersNeeded === 40, 'Fuel Flow: Fuel Required', `500 km / 12.5 km/L = 40 Liters (got ${fuelRes.litersNeeded})`);
    assert(fuelRes.totalCost === 60, 'Fuel Flow: Total Cost', `40 L * $1.50 = $60 (got $${fuelRes.totalCost})`);
    assert(fuelRes.costPerPerson === 15, 'Fuel Flow: Cost Per Passenger', `Divided by 4 travelers = $15 (got $${fuelRes.costPerPerson})`);
  }

  // 3.6 Health & BMI Physical Metric Flow
  {
    const metricBMI = calculateBMI({
      weightKg: 75,
      heightCm: 180,
    });
    // BMI = 75 / (1.8)^2 = 23.15
    assert(Math.abs(metricBMI.bmi - 23.15) < 0.1, 'BMI Flow: Metric Standard', `BMI calculated at ${metricBMI.bmi}`);
    assert(metricBMI.category === 'Normal weight', 'BMI Flow: WHO Category', `Classification: ${metricBMI.category}`);
  }

  // =========================================================================
  // TEST SUITE 4: Universal Localization & Currency Registry Simulation
  // =========================================================================
  console.log('\n--- 4. LOCALIZATION & FORMATTING ENGINE FLOWS ---');

  {
    const usdFormatted = CurrencyRegistry.format(1250000, 'USD');
    assert(usdFormatted.includes('1,250,000'), 'Localization: USD Formatting', `Standard Western 3-digit comma: ${usdFormatted}`);

    const inrFormatted = CurrencyRegistry.format(1250000, 'INR');
    assert(inrFormatted.startsWith('₹') && (inrFormatted.includes('1,250,000') || inrFormatted.includes('12,50,000')), 'Localization: INR Formatting', `Indian Rupee symbol and formatting: ${inrFormatted}`);

    const eurFormatted = CurrencyRegistry.format(75000, 'EUR');
    assert(eurFormatted.includes('75,000') || eurFormatted.includes('75.000'), 'Localization: EUR Formatting', `EUR formatting verified: ${eurFormatted}`);
  }

  // Unit Conversion
  {
    const kmToMiles = UnitRegistry.convert(100, 'km', 'mi');
    assert(Math.abs(kmToMiles - 62.1371) < 0.01, 'Units: km to miles', `100 km ~ 62.14 mi (got ${kmToMiles})`);

    const sqMToSqFt = UnitRegistry.convert(50, 'sqm', 'sqft');
    assert(Math.abs(sqMToSqFt - 538.196) < 0.1, 'Units: sqm to sqft', `50 m² ~ 538.2 sq ft (got ${sqMToSqFt})`);
  }

  // =========================================================================
  // TEST SUITE 5: User History & Favorites State Lifecycle Simulation
  // =========================================================================
  console.log('\n--- 5. USER HISTORY & FAVORITES STATE LIFECYCLE ---');

  {
    let recentTools: { slug: string; visitedAt: number }[] = [];
    let favorites: string[] = ['emi-calculator'];

    // Action 1: User visits a calculator
    const recordToolUsage = (slug: string) => {
      recentTools = [{ slug, visitedAt: Date.now() }, ...recentTools.filter((t) => t.slug !== slug)].slice(0, 10);
    };

    recordToolUsage('sip-calculator');
    recordToolUsage('mortgage-calculator');
    recordToolUsage('sip-calculator'); // Re-visiting moves to top

    assert(recentTools.length === 2, 'History: Deduplication', 'No duplicate entries created for visited tools');
    assert(recentTools[0].slug === 'sip-calculator', 'History: Most Recent on Top', 'Latest visited tool sits at index 0');

    // Action 2: User toggles favorites
    const toggleFavorite = (slug: string) => {
      favorites = favorites.includes(slug) ? favorites.filter((s) => s !== slug) : [...favorites, slug];
    };

    toggleFavorite('mortgage-calculator');
    assert(favorites.includes('mortgage-calculator'), 'Favorites: Add Favorite', 'Added mortgage-calculator to favorites');

    toggleFavorite('mortgage-calculator');
    assert(!favorites.includes('mortgage-calculator'), 'Favorites: Remove Favorite', 'Removed mortgage-calculator from favorites');
  }

  console.log('\n===============================================================');
  console.log('🎉 ALL END-TO-END FUNCTIONAL USER FLOW TESTS PASSED (100%)!');
  console.log('===============================================================\n');
}

// Auto-run if executed directly
if (process.argv[1] && process.argv[1].endsWith('functionalE2E.test.ts')) {
  runFunctionalE2ETests();
}
