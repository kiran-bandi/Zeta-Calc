export interface CalculatorCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  iconName: string;
  toolSlugs: string[];
  featuredSlug: string;
}

export const CALCULATOR_COLLECTIONS: CalculatorCollection[] = [
  {
    id: 'loans',
    slug: 'loans',
    name: 'Loan & Debt Management Collection',
    description: 'Tools to calculate EMIs, compare interest rates, estimate down payments, and accelerate debt payoff.',
    longDescription: 'Comprehensive financial instruments designed to plan, compare, and minimize borrowing costs across mortgages, auto loans, personal loans, and credit lines.',
    iconName: 'CreditCard',
    featuredSlug: 'emi-calculator',
    toolSlugs: [
      'emi-calculator',
      'home-loan-calculator',
      'car-loan-calculator',
      'personal-loan-calculator',
      'simple-interest-calculator',
      'compound-interest-calculator',
      'amortization-calculator',
    ],
  },
  {
    id: 'investing',
    slug: 'investing',
    name: 'Investment & Wealth Growth Collection',
    description: 'Calculators for SIP compounding, mutual funds, stock market ROI, CAGR, and retirement horizons.',
    longDescription: 'Deterministic mathematical forecasting tools to evaluate recurring systematic investments, compound growth, and real inflation-adjusted wealth generation.',
    iconName: 'TrendingUp',
    featuredSlug: 'sip-calculator',
    toolSlugs: [
      'sip-calculator',
      'roi-calculator',
      'compound-interest-calculator',
      'cagr-calculator',
      'retirement-calculator',
      'inflation-calculator',
    ],
  },
  {
    id: 'salary-work',
    slug: 'salary-work',
    name: 'Salary, Freelance & Work Collection',
    description: 'Gross-to-net take-home pay, hourly conversions, overtime rates, and freelance quote estimators.',
    longDescription: 'Accurately convert between hourly wages, weekly paychecks, monthly payroll, and annual gross compensation, accounting for statutory deductions and taxes.',
    iconName: 'Briefcase',
    featuredSlug: 'salary-calculator',
    toolSlugs: [
      'salary-calculator',
      'hourly-to-salary-calculator',
      'overtime-pay-calculator',
      'freelance-rate-calculator',
      'bonus-tax-calculator',
    ],
  },
  {
    id: 'budget-savings',
    slug: 'budget-savings',
    name: 'Budget & Everyday Savings Collection',
    description: 'Practical daily tools for the 50/30/20 budget rule, emergency funds, and recurring expense audits.',
    longDescription: 'Actionable utilities to uncover hidden recurring costs, build resilient emergency funds, and optimize household cash flows.',
    iconName: 'PiggyBank',
    featuredSlug: 'percentage-calculator',
    toolSlugs: [
      'percentage-calculator',
      'discount-calculator',
      'tip-calculator',
      'fuel-cost-calculator',
      'currency-converter',
    ],
  },
  {
    id: 'home-property',
    slug: 'home-property',
    name: 'Home Buying & Property Collection',
    description: 'Calculators for mortgage affordability, rent vs buy analysis, stamp duty, and property ROI.',
    longDescription: 'Make high-stakes real estate decisions with confidence by simulating long-term equity, maintenance, property taxes, and tenure alternatives.',
    iconName: 'Home',
    featuredSlug: 'home-loan-calculator',
    toolSlugs: [
      'home-loan-calculator',
      'rent-vs-buy-home-calculator',
      'square-footage-calculator',
      'property-roi-calculator',
      'mortgage-amortization-calculator',
    ],
  },
  {
    id: 'construction',
    slug: 'construction',
    name: 'Construction & Material Estimator Collection',
    description: 'Estimate square footage, concrete yardage, flooring waste, paint coverage, and brick counts.',
    longDescription: 'Eliminate project shortfalls and material waste with precision area, volume, and material estimation algorithms for builders and homeowners.',
    iconName: 'HardHat',
    featuredSlug: 'square-footage-calculator',
    toolSlugs: [
      'square-footage-calculator',
      'concrete-calculator',
      'paint-calculator',
      'flooring-calculator',
      'brick-calculator',
    ],
  },
  {
    id: 'car-ownership',
    slug: 'car-ownership',
    name: 'Vehicle & Commute Cost Collection',
    description: 'Calculate fuel consumption, true cost of car ownership, loan installments, and road trip budgets.',
    longDescription: 'Understand the full financial impact of vehicle ownership including depreciation, insurance, fuel economy, and mileage expenses.',
    iconName: 'Car',
    featuredSlug: 'fuel-cost-calculator',
    toolSlugs: [
      'fuel-cost-calculator',
      'car-loan-calculator',
      'car-depreciation-calculator',
      'commute-cost-calculator',
    ],
  },
  {
    id: 'travel-planning',
    slug: 'travel-planning',
    name: 'Travel & Global Mobility Collection',
    description: 'Plan multi-currency trip budgets, daily allowances, foreign exchange, and timezone differences.',
    longDescription: 'Comprehensive itinerary and travel budget engines that handle multi-currency conversions and localized purchasing power.',
    iconName: 'Plane',
    featuredSlug: 'travel-budget-calculator',
    toolSlugs: [
      'travel-budget-calculator',
      'currency-converter',
      'fuel-cost-calculator',
      'tip-calculator',
    ],
  },
  {
    id: 'health-wellness',
    slug: 'health-wellness',
    name: 'Health & Physical Wellness Collection',
    description: 'Scientifically validated formulas for BMI, TDEE maintenance calories, BMR, and hydration targets.',
    longDescription: 'Accredited metabolic formulas (Mifflin-St Jeor, WHO standards) to track body composition, nutrition planning, and healthy weight targets.',
    iconName: 'HeartPulse',
    featuredSlug: 'bmi-calculator',
    toolSlugs: [
      'bmi-calculator',
      'calorie-counter',
      'bmr-calculator',
      'body-fat-calculator',
      'water-intake-calculator',
    ],
  },
];
