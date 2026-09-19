import { ToolMetadata } from '../types/calculator';

export const EXPANDED_TOOLS: ToolMetadata[] = [
  // ==========================================
  // PROPERTY & REAL ESTATE CALCULATORS
  // ==========================================
  {
    id: 'property-tax-calculator',
    name: 'Property Tax Calculator',
    slug: 'property-tax-calculator',
    category: 'property',
    additionalCategories: ['money'],
    subcategory: 'property-costs',
    description: 'Calculate real estate property taxes, annual assessment liability, monthly escrow payments, and county vs school district tax apportionment.',
    shortDescription: 'Estimate annual property taxes, monthly mortgage escrow, and municipal millage breakdown.',
    iconName: 'Receipt',
    isPopular: true,
    isFeatured: true,
    synonyms: ['real estate tax', 'home tax calculator', 'property assessment tax', 'millage tax', 'escrow tax'],
    phrases: ['how much is property tax on my house', 'calculate property tax escrow', 'real estate millage tax'],
    seo: {
      title: 'Property Tax Calculator | Free Real Estate Assessment & Escrow Estimator',
      metaDescription: 'Estimate your real estate property taxes by home market value, assessment ratio, and local tax millage rates with monthly escrow breakdown.',
      keywords: ['property tax calculator', 'real estate tax', 'millage rate', 'home tax', 'escrow payment'],
    },
    formula: {
      expression: 'Tax_{annual} = \\text{Market Value} \\times \\text{Assessment Ratio} \\times \\frac{\\text{Tax Rate}(\\%)}{100}',
      variables: [
        { symbol: 'Market Value', explanation: 'Current market or assessed appraisal valuation of the property' },
        { symbol: 'Assessment Ratio', explanation: 'Statutory ratio of market value subject to taxation (typically 100% or jurisdiction specific)' },
        { symbol: 'Tax Rate', explanation: 'Combined county, municipal, and school district percentage or millage rate' },
      ],
    },
    explanation: {
      summary: 'Property tax is an ad valorem tax levied on real estate by local governments, municipalities, and school districts to fund education, roads, fire departments, and local infrastructure.',
      breakdown: [
        {
          title: 'Assessed Value vs Market Value',
          text: 'The local tax assessor determines your assessed value, which may equal full market value or a statutory fraction known as the assessment ratio.',
        },
        {
          title: 'Millage Rate Conversions',
          text: 'One mill equals $1 in tax for every $1,000 of assessed value (or 0.1%). A millage rate of 25 mills corresponds to a 2.5% effective tax rate.',
        },
      ],
      considerations: ['Homestead exemptions and senior discounts can reduce your taxable assessed value substantially.'],
    },
    example: {
      title: '$350,000 Home with 1.25% Property Tax Rate',
      description: 'Standard suburban residential single-family home property tax calculation.',
      inputs: {
        'Property Value': '$350,000',
        'Tax Rate': '1.25%',
        'Assessment Ratio': '100%',
      },
      results: {
        'Annual Tax': '$4,375.00',
        'Monthly Escrow': '$364.58',
        'Quarterly Payment': '$1,093.75',
      },
      walkthrough: [
        'Assessed Value = $350,000 × 100% = $350,000',
        'Annual Tax = $350,000 × 0.0125 = $4,375',
        'Monthly Escrow = $4,375 ÷ 12 = $364.58 per month',
      ],
    },
    faqs: [
      {
        question: 'How is property tax collected?',
        answer: 'If you have a mortgage, your lender usually collects 1/12th of your estimated property tax each month as part of your PITI payment into an escrow account, and pays the municipality on your behalf.',
      },
    ],
    relatedToolSlugs: ['mortgage-calculator', 'rental-yield-calculator', 'home-affordability-calculator'],
    status: 'active',
  },
  {
    id: 'rental-yield-calculator',
    name: 'Rental Yield & Cap Rate Calculator',
    slug: 'rental-yield-calculator',
    category: 'property',
    additionalCategories: ['money'],
    subcategory: 'property-costs',
    description: 'Calculate gross rental yield, net rental yield (Capitalization Rate / Cap Rate), annual operating cash flow, and expense ratios for real estate investments.',
    shortDescription: 'Compute gross & net rental yield, Cap Rate, and net cash flow for investment property.',
    iconName: 'Building',
    isPopular: true,
    isFeatured: true,
    synonyms: ['cap rate calculator', 'real estate yield', 'investment property return', 'rental roi', 'cash on cash'],
    phrases: ['calculate rental property cap rate', 'gross rental yield formula', 'investment property cash flow'],
    seo: {
      title: 'Rental Yield & Cap Rate Calculator | Real Estate Investment Returns',
      metaDescription: 'Free real estate rental yield and capitalization rate calculator. Calculate gross yield, net yield, cash flow, and operating expense ratios.',
      keywords: ['rental yield calculator', 'cap rate calculator', 'real estate roi', 'rental property cash flow'],
    },
    formula: {
      expression: '\\text{Gross Yield} = \\frac{\\text{Annual Rent}}{\\text{Price}} \\times 100, \\quad \\text{Cap Rate} = \\frac{\\text{Net Operating Income}}{\\text{Price}} \\times 100',
      variables: [
        { symbol: 'Annual Rent', explanation: 'Total expected 12-month gross rental collections' },
        { symbol: 'Net Operating Income', explanation: 'Gross rent minus vacancy loss, maintenance, property taxes, insurance, and management fees' },
        { symbol: 'Price', explanation: 'Total property acquisition cost or current market value' },
      ],
    },
    explanation: {
      summary: 'Rental yield is the measure of the ongoing income generated by an investment property relative to its purchase price or market value, providing an objective comparison against other asset classes.',
      breakdown: [
        {
          title: 'Gross vs Net Yield',
          text: 'Gross yield only considers top-line rent, whereas Net Yield (Cap Rate) deducts critical expenses like vacancies, insurance, property taxes, and management fees.',
        },
      ],
      considerations: ['Always account for a 5% to 8% vacancy rate and 1% annual maintenance reserve.'],
    },
    example: {
      title: '$250,000 Property Rented for $1,800 / month',
      description: 'Single-family rental unit with typical operating overheads.',
      inputs: {
        'Purchase Price': '$250,000',
        'Monthly Rent': '$1,800',
        'Annual Maintenance': '$1,500',
        'Annual Taxes': '$2,400',
      },
      results: {
        'Gross Yield': '8.64%',
        'Net Cap Rate': '6.45%',
        'Annual Cash Flow': '$16,128',
      },
      walkthrough: [
        'Annual Gross Rent = $1,800 × 12 = $21,600',
        'Operating Expenses = $1,500 + $2,400 + insurance = $5,472',
        'Net Operating Income = $16,128',
        'Net Cap Rate = ($16,128 ÷ $250,000) × 100 = 6.45%',
      ],
    },
    faqs: [
      {
        question: 'What is considered a good rental yield?',
        answer: 'Generally, gross rental yields between 5% and 8% are considered healthy in stable residential markets, while higher-growth urban cores may accept 3% to 5% with expected capital appreciation.',
      },
    ],
    relatedToolSlugs: ['property-tax-calculator', 'mortgage-calculator', 'home-affordability-calculator'],
    status: 'active',
  },
  {
    id: 'home-affordability-calculator',
    name: 'Home Affordability Calculator',
    slug: 'home-affordability-calculator',
    category: 'property',
    additionalCategories: ['money'],
    subcategory: 'home-buying',
    description: 'Determine the maximum home price and monthly mortgage you can comfortably afford based on household income, debts, down payment, and banking 28/36 DTI rules.',
    shortDescription: 'Calculate maximum home purchase price and loan amount based on income and DTI ratios.',
    iconName: 'Home',
    isPopular: true,
    isFeatured: true,
    synonyms: ['how much house can I afford', 'housing affordability', 'max home loan eligibility', 'mortgage qualification'],
    phrases: ['how much house can I afford with 100k salary', 'calculate maximum home price', 'mortgage debt to income limit'],
    seo: {
      title: 'Home Affordability Calculator | How Much House Can You Afford?',
      metaDescription: 'Find out the maximum home purchase price and mortgage you can qualify for using standard banking debt-to-income (DTI) underwriting models.',
      keywords: ['home affordability calculator', 'how much house can I afford', 'mortgage affordability', 'DTI calculator'],
    },
    formula: {
      expression: '\\text{Max Housing} = \\min(0.28 \\times \\text{Income}_{mo}, \\, 0.36 \\times \\text{Income}_{mo} - \\text{Debts}_{mo})',
      variables: [
        { symbol: 'Income_{mo}', explanation: 'Gross monthly household pre-tax income' },
        { symbol: 'Debts_{mo}', explanation: 'Existing recurring monthly debts (auto loans, credit cards, student loans)' },
      ],
    },
    explanation: {
      summary: 'Lenders evaluate mortgage qualification using two key ratios: the front-end ratio (housing costs should not exceed 28% of gross income) and the back-end ratio (total debts including mortgage should not exceed 36% of gross income).',
      breakdown: [
        {
          title: 'The 28/36 Rule',
          text: 'Front-end 28% covers Principal, Interest, Taxes, and Insurance. Back-end 36% includes housing plus all other debt commitments.',
        },
      ],
      considerations: ['Boosting your down payment directly lowers monthly borrowing costs and eliminates private mortgage insurance (PMI).'],
    },
    example: {
      title: '$95,000 Income with $450 Monthly Debts and $50,000 Down',
      description: 'Typical buyer qualifying for a residential home loan.',
      inputs: {
        'Annual Income': '$95,000',
        'Monthly Debts': '$450',
        'Down Payment': '$50,000',
        'Rate': '6.5%',
      },
      results: {
        'Max Home Price': '$385,000',
        'Monthly Payment': '$2,216',
        'Loan Amount': '$335,000',
      },
      walkthrough: [
        'Monthly Gross Income = $7,916.67',
        'Front-end 28% limit = $2,216.67',
        'Back-end 36% limit minus $450 debts = $2,400',
        'Max allowable housing payment = $2,216.67',
        'Calculated maximum affordable price = ~$385,000',
      ],
    },
    faqs: [
      {
        question: 'Can I exceed the 36% debt-to-income limit?',
        answer: 'Some government programs (like FHA loans) allow back-end DTI up to 43% to 50% with strong compensating factors like excellent credit scores or substantial cash reserves.',
      },
    ],
    relatedToolSlugs: ['mortgage-calculator', 'property-tax-calculator', 'home-loan-calculator'],
    status: 'active',
  },
  // ==========================================
  // FINANCIAL CALCULATORS
  // ==========================================
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    category: 'property',
    additionalCategories: ['money'],
    subcategory: 'home-buying',
    description: 'Calculate monthly mortgage payment with principal & interest, property taxes, homeowner insurance, and HOA fees.',
    shortDescription: 'Estimate complete monthly mortgage costs including taxes, insurance, and HOA.',
    iconName: 'House',
    isPopular: true,
    synonyms: ['home loan', 'housing mortgage', 'PITI calculator', 'mortgage payment', 'property financing'],
    phrases: ['how much is my monthly mortgage payment', 'calculate mortgage with property tax and insurance', 'housing loan monthly cost'],
    seo: {
      title: 'Mortgage Calculator | Complete Monthly PITI Payment Estimator',
      metaDescription: 'Estimate your exact monthly mortgage payment with principal, interest, property taxes, homeowner insurance, and HOA fees.',
      keywords: ['mortgage calculator', 'PITI payment', 'home mortgage', 'property loan estimator'],
    },
    formula: {
      expression: 'PITI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1} + \\frac{T_{annual} + Ins_{annual}}{12} + HOA_{monthly}',
      variables: [
        { symbol: 'P', explanation: 'Loan Amount (Home Value minus Down Payment)' },
        { symbol: 'r', explanation: 'Monthly Interest Rate (Annual Rate / 12 / 100)' },
        { symbol: 'n', explanation: 'Total Number of Monthly Payments (Years × 12)' },
        { symbol: 'T_{annual}', explanation: 'Annual Property Taxes' },
        { symbol: 'Ins_{annual}', explanation: 'Annual Homeowners Insurance' },
        { symbol: 'HOA', explanation: 'Monthly Homeowners Association Fee' },
      ],
    },
    explanation: {
      summary: 'A standard mortgage payment consists of four core elements often referred to as PITI: Principal, Interest, Taxes, and Insurance, alongside any applicable HOA or condo maintenance dues.',
      breakdown: [
        {
          title: 'Principal & Interest',
          text: 'Principal repays the borrowed balance, while interest compensates the mortgage lender. In early years, interest dominates each monthly payment.',
        },
        {
          title: 'Escrow: Taxes & Insurance',
          text: 'Lenders commonly collect 1/12th of your annual property taxes and homeowners hazard insurance each month into an escrow account to pay municipal and insurance bills on your behalf.',
        },
      ],
      considerations: ['A 20% down payment typically eliminates the need for Private Mortgage Insurance (PMI).'],
    },
    example: {
      title: '$400,000 Home with 20% Down at 6.5% for 30 Years',
      description: 'Standard 30-year fixed-rate residential mortgage.',
      inputs: {
        'Home Price': '$400,000',
        'Down Payment': '$80,000 (20%)',
        'Interest Rate': '6.5% p.a.',
        'Loan Term': '30 Years',
        'Property Tax': '$4,000 / year',
        'Home Insurance': '$1,200 / year',
      },
      results: {
        'Monthly P&I': '$2,022.62',
        'Monthly Taxes & Insurance': '$433.33',
        'Total Monthly Payment': '$2,455.95',
      },
      walkthrough: ['Principal financed: $320,000. P&I: $2,022.62. Taxes + Insurance: $433.33. Total: $2,455.95.'],
    },
    faqs: [
      {
        question: 'What is PITI in a mortgage?',
        answer: 'PITI stands for Principal, Interest, Taxes, and Insurance. It represents the full recurring monthly cost of maintaining a financed home.',
      },
    ],
    relatedToolSlugs: ['home-loan-calculator', 'amortization-calculator', 'loan-calculator'],
    status: 'active',
  },
  {
    id: 'loan-calculator',
    name: 'Loan Calculator',
    slug: 'loan-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Calculate monthly loan payments, total interest, and total cost for any personal, business, or consumer installment loan.',
    shortDescription: 'Calculate monthly payments, interest, and payoff timeline for any loan.',
    iconName: 'Landmark',
    isPopular: true,
    synonyms: ['personal loan calculator', 'installment loan', 'debt payment', 'loan payment calculator'],
    phrases: ['calculate my loan payment', 'how much interest will I pay on a loan', 'fixed rate loan calculator'],
    seo: {
      title: 'Loan Calculator | Fixed Payment & Total Interest Estimator',
      metaDescription: 'Calculate monthly loan payments, total interest cost, and payoff schedule for any fixed installment loan.',
      keywords: ['loan calculator', 'personal loan', 'installment loan', 'loan payment'],
    },
    formula: {
      expression: 'Payment = \\frac{P \\cdot r \\cdot (1+r)^n}{(1+r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Principal Loan Amount' },
        { symbol: 'r', explanation: 'Monthly Interest Rate (Annual Rate / 12 / 100)' },
        { symbol: 'n', explanation: 'Total Number of Months' },
      ],
    },
    explanation: {
      summary: 'Installment loans divide your principal balance and accumulated interest across equal monthly installments over a defined repayment term.',
      breakdown: [
        {
          title: 'Compounding & Amortization',
          text: 'Each monthly payment pays off all interest accrued during the preceding 30 days, with the residual amount reducing your principal loan balance.',
        },
      ],
      considerations: ['Verify whether your lender charges an upfront origination fee or prepayment penalty.'],
    },
    example: {
      title: '$15,000 Personal Loan at 10.5% for 3 Years',
      description: 'Unsecured personal installment loan.',
      inputs: {
        'Loan Amount': '$15,000',
        'Interest Rate': '10.5%',
        'Loan Term': '36 Months',
      },
      results: {
        'Monthly Payment': '$487.48',
        'Total Interest': '$2,549.28',
        'Total Cost': '$17,549.28',
      },
      walkthrough: ['Monthly payment is $487.48. Over 36 months, total paid is $17,549.28 with $2,549.28 interest.'],
    },
    faqs: [
      {
        question: 'Can I pay off my loan earlier?',
        answer: 'Most standard consumer loans allow early principal payments without penalty, reducing both total interest and the effective repayment term.',
      },
    ],
    relatedToolSlugs: ['amortization-calculator', 'mortgage-calculator', 'payment-calculator'],
    status: 'active',
  },
  {
    id: 'auto-loan-calculator',
    name: 'Auto Loan Calculator',
    slug: 'auto-loan-calculator',
    category: 'finance',
    additionalCategories: ['vehicles'],
    subcategory: 'loans',
    description: 'Calculate car loan monthly payments, accounting for trade-in allowance, cash down payment, and state/local sales tax.',
    shortDescription: 'Calculate monthly car loan payments with trade-in value, down payment, and sales tax.',
    iconName: 'CarFront',
    isPopular: true,
    synonyms: ['car loan calculator', 'vehicle financing', 'car payment estimator', 'auto financing'],
    phrases: ['calculate car loan payment', 'auto loan with trade in and sales tax', 'monthly car payment'],
    seo: {
      title: 'Auto Loan Calculator | Car Financing, Trade-In & Tax Estimator',
      metaDescription: 'Estimate monthly car payments including down payment, trade-in value, vehicle sales tax, and loan APR.',
      keywords: ['auto loan calculator', 'car loan', 'car payment', 'vehicle financing'],
    },
    formula: {
      expression: 'Financed = Price + (Price - TradeIn) \\cdot Tax\\% - Down - TradeIn, \\quad Payment = \\frac{Financed \\cdot r(1+r)^n}{(1+r)^n - 1}',
      variables: [
        { symbol: 'Price', explanation: 'Vehicle Purchase Price' },
        { symbol: 'TradeIn', explanation: 'Trade-In Vehicle Allowance' },
        { symbol: 'Down', explanation: 'Cash Down Payment' },
        { symbol: 'Tax%', explanation: 'State or Regional Sales Tax Rate' },
      ],
    },
    explanation: {
      summary: 'Auto loans typically range from 24 to 84 months. Down payments and trade-in allowances lower both the taxable base and the total financed sum.',
      breakdown: [
        {
          title: 'Impact of Term Length',
          text: 'Longer terms (e.g. 72 or 84 months) lower monthly payments but increase total interest paid over the life of the vehicle significantly.',
        },
      ],
      considerations: ['Aim to keep total vehicle expenses (loan, insurance, fuel) below 15-20% of your gross monthly income.'],
    },
    example: {
      title: '$32,000 Vehicle with $5,000 Trade-In, $3,000 Down, 6% Tax, 5.9% APR for 60 Months',
      description: 'New car purchase financing.',
      inputs: {
        'Vehicle Price': '$32,000',
        'Trade-In Value': '$5,000',
        'Down Payment': '$3,000',
        'Sales Tax': '6.0%',
        'Loan Term': '60 Months',
        'Interest Rate': '5.9%',
      },
      results: {
        'Total Financed': '$25,620.00',
        'Monthly Payment': '$494.38',
        'Total Interest': '$4,042.80',
      },
      walkthrough: ['Taxable basis is $27,000 ($1,620 tax). Total financed: $25,620. Monthly payment: $494.38.'],
    },
    faqs: [
      {
        question: 'Does a trade-in reduce vehicle sales tax?',
        answer: 'In most US states and international jurisdictions, trade-in credits reduce the taxable purchase price of the replacement vehicle.',
      },
    ],
    relatedToolSlugs: ['car-loan-calculator', 'loan-calculator', 'amortization-calculator'],
    status: 'active',
  },
  {
    id: 'payment-calculator',
    name: 'Payment Calculator',
    slug: 'payment-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Determine fixed monthly payment amounts or time required to pay off existing credit cards and loans.',
    shortDescription: 'Calculate fixed periodic loan payments or payoff durations.',
    iconName: 'CircleDollarSign',
    isPopular: false,
    synonyms: ['fixed payment calculator', 'credit card payoff', 'debt calculator', 'monthly payment solver'],
    phrases: ['calculate monthly payment', 'how long to pay off debt', 'fixed loan installment'],
    seo: {
      title: 'Payment Calculator | Fixed Installment & Debt Payoff Solver',
      metaDescription: 'Calculate fixed monthly payments and total interest for loans and credit card debt consolidation.',
      keywords: ['payment calculator', 'monthly payment', 'debt payoff', 'fixed installment'],
    },
    formula: {
      expression: 'PMT = \\frac{P \\cdot r}{1 - (1 + r)^{-n}}',
      variables: [
        { symbol: 'P', explanation: 'Current Balance / Loan Amount' },
        { symbol: 'r', explanation: 'Periodic Interest Rate' },
        { symbol: 'n', explanation: 'Number of Periods' },
      ],
    },
    explanation: {
      summary: 'Calculates the exact monthly installment required to amortize any principal balance across a targeted timeline.',
      breakdown: [
        {
          title: 'Minimizing Lifetime Interest',
          text: 'Increasing your monthly payment even modestly accelerates principal reduction and slashes total interest exponentially.',
        },
      ],
      considerations: ['Paying more than the minimum monthly balance on credit cards prevents high-interest debt spirals.'],
    },
    example: {
      title: '$8,000 Balance at 14% over 24 Months',
      description: 'Consolidated debt payoff.',
      inputs: {
        'Balance': '$8,000',
        'Interest Rate': '14%',
        'Tenure': '24 Months',
      },
      results: {
        'Monthly Payment': '$384.14',
        'Total Interest': '$1,219.36',
      },
      walkthrough: ['Paying $384.14 per month clears the $8,000 balance in 24 months with $1,219.36 interest.'],
    },
    faqs: [
      {
        question: 'How does interest compound on monthly loans?',
        answer: 'Most standard consumer loans compute interest on the declining balance each month, meaning early payments reduce total future interest charges.',
      },
    ],
    relatedToolSlugs: ['loan-calculator', 'amortization-calculator', 'mortgage-calculator'],
    status: 'active',
  },
  {
    id: 'amortization-calculator',
    name: 'Amortization Calculator',
    slug: 'amortization-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Generate complete loan amortization schedules and calculate time and interest saved by making extra monthly principal payments.',
    shortDescription: 'Generate amortization schedules and calculate extra principal payment savings.',
    iconName: 'TableProperties',
    isPopular: true,
    synonyms: ['loan amortization', 'mortgage schedule', 'extra payment calculator', 'payoff schedule'],
    phrases: ['amortization schedule with extra payments', 'how much interest do extra payments save', 'loan breakdown over time'],
    seo: {
      title: 'Amortization Calculator | Loan Schedule & Extra Payment Savings',
      metaDescription: 'View complete periodic loan amortization schedules and see how extra payments reduce your loan tenure and interest.',
      keywords: ['amortization calculator', 'loan schedule', 'extra payments', 'mortgage amortization'],
    },
    formula: {
      expression: 'Interest_t = Balance_{t-1} \\cdot r, \\quad Principal_t = Payment - Interest_t + Extra',
      variables: [
        { symbol: 'Balance', explanation: 'Remaining Loan Principal Balance' },
        { symbol: 'Payment', explanation: 'Standard Scheduled Monthly Payment' },
        { symbol: 'Extra', explanation: 'Optional Additional Principal Contribution' },
      ],
    },
    explanation: {
      summary: 'Amortization illustrates how every installment is partitioned between interest charges and equity-building principal reduction.',
      breakdown: [
        {
          title: 'The Extra Payment Effect',
          text: 'Every dollar of extra payment goes 100% toward principal, permanently removing all future interest that dollar would have accumulated.',
        },
      ],
      considerations: ['Ensure your loan servicer applies extra payments directly to principal, rather than advancing the next month’s due date.'],
    },
    example: {
      title: '$250,000 Loan at 6% for 30 Years with $200 Extra Monthly',
      description: 'Mortgage extra payment analysis.',
      inputs: {
        'Principal': '$250,000',
        'Interest Rate': '6.0%',
        'Term': '30 Years',
        'Extra Payment': '$200 / month',
      },
      results: {
        'Standard Payment': '$1,498.88',
        'New Payoff Time': '22 Years 4 Months',
        'Interest Saved': '$54,320',
      },
      walkthrough: ['Adding $200/month shaves 7 years 8 months off the mortgage and saves over $54,000 in interest.'],
    },
    faqs: [
      {
        question: 'What is negative amortization?',
        answer: 'Negative amortization occurs when monthly payments fail to cover accrued interest, causing the unpaid interest to be added to the principal balance.',
      },
    ],
    relatedToolSlugs: ['mortgage-calculator', 'loan-calculator', 'payment-calculator'],
    status: 'active',
  },
  {
    id: 'interest-rate-calculator',
    name: 'Interest Rate Calculator',
    slug: 'interest-rate-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Calculate the true annual percentage rate (APR) or effective interest rate given a loan amount, term, and monthly payment.',
    shortDescription: 'Solve for the effective annual interest rate of any loan or debt.',
    iconName: 'Percent',
    isPopular: false,
    synonyms: ['solve interest rate', 'APR calculator', 'reverse loan calculator', 'find interest rate'],
    phrases: ['find interest rate from payment', 'what APR am I paying', 'solve loan rate'],
    seo: {
      title: 'Interest Rate Calculator | Solve Loan APR from Payment & Tenure',
      metaDescription: 'Find the exact annual interest rate or APR of a loan given the loan amount, tenure, and monthly installment.',
      keywords: ['interest rate calculator', 'find APR', 'solve interest rate', 'effective rate'],
    },
    formula: {
      expression: 'f(r) = \\frac{P \\cdot r \\cdot (1+r)^n}{(1+r)^n - 1} - PMT = 0 \\quad \\text{(Newton-Raphson)}',
      variables: [
        { symbol: 'P', explanation: 'Loan Amount' },
        { symbol: 'PMT', explanation: 'Actual Monthly Payment' },
        { symbol: 'n', explanation: 'Loan Months' },
      ],
    },
    explanation: {
      summary: 'Uses numerical analysis (Newton-Raphson iteration) to uncover the exact underlying annual interest rate from stated payment amounts.',
      breakdown: [
        {
          title: 'Uncovering Hidden Financing Costs',
          text: 'Dealers and lenders often advertise low monthly payments while concealing high APRs by stretching loan duration.',
        },
      ],
      considerations: ['Compare APR rather than nominal interest rates, as APR incorporates upfront financing fees.'],
    },
    example: {
      title: '$20,000 Loan with $400 Payment for 60 Months',
      description: 'Reversing monthly payment to discover APR.',
      inputs: {
        'Loan Amount': '$20,000',
        'Monthly Payment': '$400',
        'Term': '60 Months',
      },
      results: {
        'Effective Annual Rate': '7.42%',
        'Total Repaid': '$24,000',
      },
      walkthrough: ['Total repayment is $24,000 ($4,000 interest). Solved annual interest rate is 7.42%.'],
    },
    faqs: [
      {
        question: 'Why can’t interest rate be calculated with simple division?',
        answer: 'Because compound interest and amortized loan payments involve non-linear polynomial equations that require iterative numerical solvers.',
      },
    ],
    relatedToolSlugs: ['loan-calculator', 'payment-calculator', 'amortization-calculator'],
    status: 'active',
  },
  {
    id: 'retirement-calculator',
    name: 'Retirement Calculator',
    slug: 'retirement-calculator',
    category: 'finance',
    subcategory: 'retirement',
    description: 'Plan your retirement nest egg, estimate monthly savings requirements, and determine whether your savings will sustain your post-retirement lifestyle.',
    shortDescription: 'Estimate your required retirement nest egg and monthly savings needed.',
    iconName: 'TrendingUp',
    isPopular: true,
    synonyms: ['pension calculator', 'retirement planner', '401k calculator', 'nest egg calculator', 'FIRE calculator'],
    phrases: ['how much money do I need to retire', 'retirement nest egg savings', 'am I on track for retirement'],
    seo: {
      title: 'Retirement Calculator | Nest Egg & Monthly Savings Planner',
      metaDescription: 'Calculate how much money you need to retire comfortably, accounting for inflation, investment returns, and post-retirement expenses.',
      keywords: ['retirement calculator', 'nest egg', 'retirement savings', 'pension planner'],
    },
    formula: {
      expression: 'NestEgg = \\sum_{t=1}^{RetYears \\cdot 12} \\frac{Spending}{(1 + r_{post})^t}, \\quad Contribution = \\frac{Shortfall \\cdot r_{pre}}{(1 + r_{pre})^n - 1}',
      variables: [
        { symbol: 'Spending', explanation: 'Target Monthly Spending in Retirement' },
        { symbol: 'r_{pre}', explanation: 'Real Investment Return before Retirement' },
        { symbol: 'r_{post}', explanation: 'Real Investment Return during Retirement' },
      ],
    },
    explanation: {
      summary: 'Evaluates whether your current savings trajectory will generate a sustainable nest egg to fund your golden years without outliving your capital.',
      breakdown: [
        {
          title: 'The Impact of Inflation',
          text: 'Inflation steadily degrades purchasing power. A 3% inflation rate doubles living costs roughly every 24 years.',
        },
        {
          title: 'Safe Withdrawal Rates',
          text: 'Traditional financial planning uses the 4% rule as a baseline guideline for initial portfolio withdrawals in retirement.',
        },
      ],
      considerations: ['Remember to factor in pension incomes, Social Security benefits, or health insurance premiums.'],
    },
    example: {
      title: 'Age 30 retiring at 65 with $5,000/mo spending, $20,000 saved',
      description: '35-year retirement accumulation plan.',
      inputs: {
        'Current Age': '30',
        'Retirement Age': '65',
        'Current Savings': '$20,000',
        'Target Monthly Spending': '$5,000',
        'Expected Return': '8% pre / 5% post',
        'Inflation': '3%',
      },
      results: {
        'Required Nest Egg': '$1,385,000',
        'Monthly Savings Needed': '$840',
      },
      walkthrough: ['To generate $5,000/mo real purchasing power from age 65 to 85, save ~$840/month at 8% average return.'],
    },
    faqs: [
      {
        question: 'What is the 4% retirement rule?',
        answer: 'The 4% rule suggests you can safely withdraw 4% of your total retirement portfolio in the first year of retirement, and adjust that dollar amount for inflation each year thereafter for 30 years.',
      },
    ],
    relatedToolSlugs: ['investment-calculator', 'sip-calculator', 'compound-interest-calculator'],
    status: 'active',
  },
  {
    id: 'investment-calculator',
    name: 'Investment Calculator',
    slug: 'investment-calculator',
    category: 'finance',
    subcategory: 'investments',
    description: 'Forecast the future growth of your investments with regular monthly additions and see real inflation-adjusted wealth.',
    shortDescription: 'Project investment growth and compare nominal vs inflation-adjusted wealth.',
    iconName: 'ChartNoAxesCombined',
    isPopular: true,
    synonyms: ['wealth calculator', 'portfolio growth', 'future value of investment', 'compound wealth'],
    phrases: ['how much will my investment grow', 'inflation adjusted investment calculator', 'wealth accumulation'],
    seo: {
      title: 'Investment Calculator | Wealth Growth & Inflation-Adjusted Returns',
      metaDescription: 'Forecast your investment portfolio wealth over time with initial deposit, regular contributions, and real purchasing power adjustment.',
      keywords: ['investment calculator', 'portfolio growth', 'wealth builder', 'inflation adjusted return'],
    },
    formula: {
      expression: 'FV_{nominal} = P(1+r)^n + PMT \\left[\\frac{(1+r)^n - 1}{r}\\right], \\quad FV_{real} = \\frac{FV_{nominal}}{(1 + i)^Y}',
      variables: [
        { symbol: 'P', explanation: 'Initial Investment Deposit' },
        { symbol: 'PMT', explanation: 'Periodic Monthly Addition' },
        { symbol: 'r', explanation: 'Monthly Rate of Return' },
        { symbol: 'i', explanation: 'Annual Inflation Rate' },
        { symbol: 'Y', explanation: 'Time Horizon in Years' },
      ],
    },
    explanation: {
      summary: 'Calculates the exponential growth of regular investing and highlights the crucial difference between nominal dollar totals and inflation-adjusted buying power.',
      breakdown: [
        {
          title: 'Nominal vs. Real Wealth',
          text: 'Nominal value shows the raw dollar balance in your account. Real wealth adjusts that figure for future cost of living, showing what those dollars can actually buy.',
        },
      ],
      considerations: ['Consistent monthly investing (dollar-cost averaging) smooths out market volatility over long horizons.'],
    },
    example: {
      title: '$10,000 initial + $500/month at 9% return for 20 years',
      description: 'Long-term equity index investment.',
      inputs: {
        'Initial Deposit': '$10,000',
        'Monthly Contribution': '$500',
        'Annual Return': '9%',
        'Inflation Rate': '3%',
        'Time Horizon': '20 Years',
      },
      results: {
        'Total Invested': '$130,000',
        'Nominal Wealth': '$388,432',
        'Real Wealth (Inflation-adjusted)': '$215,069',
      },
      walkthrough: ['You invest $130,000. Account grows to $388,432 nominal ($215,069 in today’s real purchasing power).'],
    },
    faqs: [
      {
        question: 'What is dollar-cost averaging?',
        answer: 'Dollar-cost averaging is the practice of investing a fixed dollar amount on a regular schedule, regardless of asset price, purchasing more shares when prices are low and fewer when prices are high.',
      },
    ],
    relatedToolSlugs: ['sip-calculator', 'retirement-calculator', 'compound-interest-calculator'],
    status: 'active',
  },
  {
    id: 'inflation-calculator',
    name: 'Inflation Calculator',
    slug: 'inflation-calculator',
    category: 'finance',
    subcategory: 'economic',
    description: 'Calculate how inflation erodes purchasing power over time and determine equivalent future and historical costs of goods.',
    shortDescription: 'Calculate future equivalent costs and purchasing power loss from inflation.',
    iconName: 'TrendingDown',
    isPopular: false,
    synonyms: ['purchasing power calculator', 'cost of living inflation', 'historical inflation', 'dollar value calculator'],
    phrases: ['how much will $100 be worth in 10 years', 'inflation purchasing power', 'future cost of goods'],
    seo: {
      title: 'Inflation Calculator | Purchasing Power & Future Cost of Goods',
      metaDescription: 'Calculate how annual inflation rates erode purchasing power and see what current dollars will be worth in future years.',
      keywords: ['inflation calculator', 'purchasing power', 'cost of goods', 'future value of money'],
    },
    formula: {
      expression: 'Cost_{future} = Amount \\cdot (1 + i)^n, \\quad PurchasingPower = \\frac{Amount}{(1 + i)^n}',
      variables: [
        { symbol: 'Amount', explanation: 'Base Currency Amount' },
        { symbol: 'i', explanation: 'Annual Inflation Rate' },
        { symbol: 'n', explanation: 'Number of Years' },
      ],
    },
    explanation: {
      summary: 'Demonstrates the compounding decay of cash purchasing power over time and helps calibrate realistic investment return targets.',
      breakdown: [
        {
          title: 'The Silent Tax of Inflation',
          text: 'Cash stored under a mattress or in a 0% checking account loses roughly half its purchasing power every 24 years at 3% inflation.',
        },
      ],
      considerations: ['To preserve wealth, assets must deliver an after-tax return higher than the rate of inflation.'],
    },
    example: {
      title: '$100,000 over 15 Years at 3.5% Inflation',
      description: 'Purchasing power loss projection.',
      inputs: {
        'Amount': '$100,000',
        'Inflation Rate': '3.5%',
        'Years': '15',
      },
      results: {
        'Future Equivalent Cost': '$167,535',
        'Future Purchasing Power': '$59,689',
        'Cumulative Price Increase': '67.5%',
      },
      walkthrough: ['An item costing $100,000 today will cost $167,535 in 15 years; $100,000 in cash will only buy $59,689 worth of goods.'],
    },
    faqs: [
      {
        question: 'What is CPI (Consumer Price Index)?',
        answer: 'The Consumer Price Index measures the monthly average change in prices paid by urban consumers for a market basket of consumer goods and services.',
      },
    ],
    relatedToolSlugs: ['investment-calculator', 'retirement-calculator', 'compound-interest-calculator'],
    status: 'active',
  },
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    slug: 'income-tax-calculator',
    category: 'finance',
    additionalCategories: ['money'],
    subcategory: 'tax',
    description: 'Estimate progressive income tax liability, effective tax rate, and take-home pay with multi-region support (US Federal, UK, India, Generic).',
    shortDescription: 'Estimate progressive income tax, effective tax rate, and net take-home salary.',
    iconName: 'Receipt',
    isPopular: true,
    synonyms: ['tax bracket calculator', 'salary tax', 'take home pay tax', 'federal income tax'],
    phrases: ['how much income tax do I owe', 'calculate my tax bracket', 'effective tax rate calculator'],
    seo: {
      title: 'Income Tax Calculator | Progressive Brackets & Net Take-Home Pay',
      metaDescription: 'Calculate progressive income tax, standard deductions, effective tax percentage, and monthly take-home salary.',
      keywords: ['income tax calculator', 'tax brackets', 'take home pay', 'effective tax rate'],
    },
    formula: {
      expression: 'Tax = \\sum_{k=1}^m (\\text{Taxable in Bracket}_k \\times \\text{Rate}_k), \\quad \\text{Effective Rate} = \\frac{\\text{Tax}}{\\text{Gross Income}}',
      variables: [
        { symbol: 'Taxable', explanation: 'Gross Income minus Applicable Standard Deductions' },
        { symbol: 'Bracket', explanation: 'Tiered Marginal Tax Brackets' },
      ],
    },
    explanation: {
      summary: 'Modern income tax systems use progressive brackets: income is taxed in chunks, so moving into a higher tax bracket only taxes the dollars that fall within that upper bracket.',
      breakdown: [
        {
          title: 'Marginal vs. Effective Rate',
          text: 'Your marginal tax rate is the rate paid on your last dollar earned. Your effective tax rate is the actual percentage of your total income paid in taxes.',
        },
      ],
      considerations: ['Educational estimate only. Does not include municipal local taxes, payroll FICA/NI taxes, or individual tax credits.'],
    },
    example: {
      title: '$85,000 US Federal Single filer with standard deduction',
      description: 'US progressive federal income tax.',
      inputs: {
        'Gross Income': '$85,000',
        'Tax Regime': 'US Federal Single',
        'Standard Deduction': '$14,600',
      },
      results: {
        'Taxable Income': '$70,400',
        'Estimated Federal Tax': '$10,544',
        'Effective Tax Rate': '12.4%',
        'Monthly Net Pay': '$6,205',
      },
      walkthrough: ['Taxable income is $70,400 after the $14,600 standard deduction. Total tax is $10,544 (12.4% effective rate).'],
    },
    faqs: [
      {
        question: 'Does earning more money put you in a higher tax bracket where you make less?',
        answer: 'No. In a progressive tax system, higher tax rates apply strictly to the dollars above each threshold, so earning more always results in more net take-home pay.',
      },
    ],
    relatedToolSlugs: ['salary-calculator', 'sales-tax-calculator', 'retirement-calculator'],
    status: 'active',
  },
  {
    id: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    slug: 'sales-tax-calculator',
    category: 'finance',
    additionalCategories: ['shopping'],
    subcategory: 'tax',
    description: 'Calculate sales tax, GST, or VAT, and easily reverse-calculate pre-tax price from gross receipt amounts.',
    shortDescription: 'Calculate sales tax, GST, VAT, or reverse-calculate pre-tax base prices.',
    iconName: 'ReceiptText',
    isPopular: false,
    synonyms: ['GST calculator', 'VAT calculator', 'sales tax reverse', 'tax added'],
    phrases: ['calculate sales tax', 'reverse sales tax from total', 'how much was the tax on receipt'],
    seo: {
      title: 'Sales Tax Calculator | Add Tax or Reverse-Calculate Pre-Tax Price',
      metaDescription: 'Calculate sales tax, VAT, or GST on retail purchases, or reverse-calculate pre-tax amounts from total receipts.',
      keywords: ['sales tax calculator', 'reverse tax', 'GST calculator', 'VAT calculator'],
    },
    formula: {
      expression: '\\text{Add Tax: } Gross = Net \\times (1 + r), \\quad \\text{Remove Tax: } Net = \\frac{Gross}{1 + r}',
      variables: [
        { symbol: 'Net', explanation: 'Pre-Tax Item Price' },
        { symbol: 'r', explanation: 'Sales Tax Rate as Decimal' },
        { symbol: 'Gross', explanation: 'Final Total Receipt Amount' },
      ],
    },
    explanation: {
      summary: 'Enables forward calculation of tax liability on purchases or reverse calculation to extract the underlying net price from all-inclusive retail receipts.',
      breakdown: [
        {
          title: 'The Reverse Tax Formula',
          text: 'To find pre-tax price from a total of $108 with 8% tax, divide $108 by 1.08 = $100 net ($8 tax). Subtracting 8% from $108 yields an incorrect figure.',
        },
      ],
      considerations: ['Tax rates vary widely between state, county, and municipal jurisdictions.'],
    },
    example: {
      title: '$249.99 with 8.25% Sales Tax',
      description: 'Standard retail sales tax calculation.',
      inputs: {
        'Net Amount': '$249.99',
        'Tax Rate': '8.25%',
        'Mode': 'Add Tax',
      },
      results: {
        'Tax Amount': '$20.62',
        'Total Gross': '$270.61',
      },
      walkthrough: ['$249.99 × 0.0825 = $20.62 tax. Final receipt total is $270.61.'],
    },
    faqs: [
      {
        question: 'What is the difference between Sales Tax and VAT?',
        answer: 'Sales tax is assessed once at the final retail point of sale to the consumer, while Value Added Tax (VAT) is collected incrementally at each production stage.',
      },
    ],
    relatedToolSlugs: ['discount-calculator', 'income-tax-calculator', 'tip-calculator'],
    status: 'active',
  },
  {
    id: 'annuity-calculator',
    name: 'Annuity Calculator',
    slug: 'annuity-calculator',
    category: 'finance',
    subcategory: 'investments',
    description: 'Calculate periodic payout withdrawals, required starting principal (present value), and accumulated growth (future value) for ordinary annuities and annuities due.',
    shortDescription: 'Calculate annuity payouts, present value, and future value with withdrawal schedules.',
    iconName: 'Landmark',
    isPopular: true,
    isFeatured: true,
    synonyms: ['annuity payout calculator', 'immediate annuity', 'fixed annuity', 'annuity due', 'present value annuity', 'future value annuity'],
    phrases: ['how much will my annuity pay', 'annuity withdrawal calculator', 'present value of annuity', 'fixed annuity payout rate'],
    seo: {
      title: 'Annuity Calculator | Payout, Present Value & Future Value Solver',
      metaDescription: 'Calculate periodic annuity payouts, starting capital required, or future accumulated wealth with ordinary annuity and annuity due schedules.',
      keywords: ['annuity calculator', 'annuity payout', 'present value annuity', 'future value annuity', 'fixed annuity'],
    },
    formula: {
      expression: 'PV = PMT \\times \\left[ \\frac{1 - (1 + i)^{-n}}{i} \\right] \\times (1 + i)^{\\text{due}}, \\quad FV = PMT \\times \\left[ \\frac{(1 + i)^n - 1}{i} \\right] \\times (1 + i)^{\\text{due}}',
      variables: [
        { symbol: 'PV', explanation: 'Present Value (Starting Principal Deposit)' },
        { symbol: 'PMT', explanation: 'Periodic Payment or Withdrawal Amount' },
        { symbol: 'i', explanation: 'Periodic Interest Rate (Annual Rate ÷ Frequency)' },
        { symbol: 'n', explanation: 'Total Number of Payment Periods (Years × Frequency)' },
        { symbol: 'due', explanation: '1 for Annuity Due (Beginning of Period), 0 for Ordinary Annuity' },
      ],
    },
    explanation: {
      summary: 'An annuity is a financial contract where a lump sum is converted into guaranteed periodic payments, or periodic payments accumulate with compounding interest into a future lump sum.',
      breakdown: [
        {
          title: 'Ordinary Annuity vs. Annuity Due',
          text: 'An ordinary annuity processes cash flows at the end of each period (e.g. loan payments, bond coupons), whereas an annuity due processes cash flows at the beginning of each period (e.g. lease payments, early retirement disbursements).',
        },
        {
          title: 'Principal Preservation vs. Amortizing Payout',
          text: 'In an amortizing payout annuity, both principal and interest are systematically drawn down to zero over the specified term.',
        },
      ],
      considerations: [
        'Annuity returns vary by insurer, fixed guarantee terms, or variable underlying index performance.',
        'Consider inflation when locking in long-term fixed annuity payout streams.',
      ],
    },
    example: {
      title: '$100,000 Starting Lump Sum at 6% over 10 Years (Monthly Payout)',
      description: 'Retirement ordinary annuity payout.',
      inputs: {
        'Starting Principal': '$100,000',
        'Annual Rate': '6.0%',
        'Tenure': '10 Years',
        'Frequency': 'Monthly',
      },
      results: {
        'Monthly Payout': '$1,110.21',
        'Total Received': '$133,225',
        'Total Interest Earned': '$33,225',
      },
      walkthrough: ['A $100,000 deposit at 6% annual return yields $1,110.21 per month for 120 months, generating $33,225 in total interest.'],
    },
    faqs: [
      {
        question: 'What is the difference between an immediate and deferred annuity?',
        answer: 'An immediate annuity starts paying income immediately (within 1 to 12 months of purchase), while a deferred annuity accumulates interest for years before converting to payouts.',
      },
      {
        question: 'Is annuity income taxable?',
        answer: 'In qualified accounts (e.g. Traditional IRA / 401k), payouts are taxed as ordinary income. In non-qualified accounts, only the earnings portion is taxed while the return of principal is tax-free.',
      },
    ],
    relatedToolSlugs: ['retirement-calculator', 'compound-interest-calculator', 'investment-calculator', 'sip-calculator'],
    status: 'active',
  },

  // ==========================================
  // HEALTH & FITNESS CALCULATORS
  // ==========================================
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    slug: 'body-fat-calculator',
    category: 'health',
    subcategory: 'body',
    description: 'Estimate body fat percentage, lean body mass, and fat mass using the standardized U.S. Navy circumference method.',
    shortDescription: 'Calculate body fat percentage and lean mass using the U.S. Navy circumference method.',
    iconName: 'Scale',
    isPopular: true,
    synonyms: ['body fat percentage', 'US Navy body fat', 'lean mass calculator', 'fat percentage'],
    phrases: ['calculate my body fat percentage', 'US navy body fat formula', 'lean body mass calculator'],
    seo: {
      title: 'Body Fat Calculator | U.S. Navy Method & Lean Mass Estimator',
      metaDescription: 'Calculate your body fat percentage, lean body mass, and fitness category using height, neck, waist, and hip measurements.',
      keywords: ['body fat calculator', 'US navy body fat', 'body composition', 'lean mass'],
    },
    formula: {
      expression: '\\text{Men: } 495 / [1.0324 - 0.19077\\log(W - N) + 0.15456\\log(H)] - 450',
      variables: [
        { symbol: 'W', explanation: 'Waist circumference at navel level (cm)' },
        { symbol: 'N', explanation: 'Neck circumference below Adam’s apple (cm)' },
        { symbol: 'H', explanation: 'Height (cm)' },
      ],
    },
    explanation: {
      summary: 'The U.S. Navy body fat formula estimates body density and adipose tissue percentage through simple tape measurements, avoiding the cost of DEXA scans.',
      breakdown: [
        {
          title: 'Essential vs. Storage Fat',
          text: 'Essential fat is required for physiological health (3-5% in men, 10-13% in women). Storage fat accumulates in adipose tissue.',
        },
      ],
      considerations: ['Educational estimate only. Not a medical clinical assessment or DXA scan replacement.'],
    },
    example: {
      title: 'Male, 180 cm, 80 kg, Waist 86 cm, Neck 38 cm',
      description: 'Body fat calculation for an active male.',
      inputs: {
        'Height': '180 cm',
        'Weight': '80 kg',
        'Waist': '86 cm',
        'Neck': '38 cm',
      },
      results: {
        'Body Fat Percentage': '16.2%',
        'Fat Mass': '13.0 kg',
        'Lean Mass': '67.0 kg',
        'Category': 'Fitness / Healthy',
      },
      walkthrough: ['Calculated body fat is 16.2%, yielding 13.0 kg fat mass and 67.0 kg lean mass.'],
    },
    faqs: [
      {
        question: 'How accurate is the U.S. Navy body fat method?',
        answer: 'When measured carefully with an un-stretched tape measure, the Navy formula correlates within 3-4% of hydrostatic weighing and DEXA scans.',
      },
    ],
    relatedToolSlugs: ['bmi-calculator', 'ideal-weight-calculator', 'calorie-counter'],
    status: 'active',
  },
  {
    id: 'bmr-calculator',
    name: 'BMR Calculator',
    slug: 'bmr-calculator',
    category: 'health',
    subcategory: 'metabolism-fitness',
    description: 'Calculate your Basal Metabolic Rate (BMR)—the exact calories your body burns every day at complete rest.',
    shortDescription: 'Calculate basal metabolic rate (calories burned at rest) via Mifflin-St Jeor.',
    iconName: 'Flame',
    isPopular: true,
    synonyms: ['basal metabolic rate', 'resting metabolic rate', 'resting calories', 'BMR formula'],
    phrases: ['how many calories do I burn at rest', 'calculate my BMR', 'basal metabolic rate calculator'],
    seo: {
      title: 'BMR Calculator | Basal Metabolic Rate & Resting Calorie Estimator',
      metaDescription: 'Find your Basal Metabolic Rate (BMR) using the scientifically validated Mifflin-St Jeor formula and activity multipliers.',
      keywords: ['BMR calculator', 'basal metabolic rate', 'resting calories', 'Mifflin St Jeor'],
    },
    formula: {
      expression: 'BMR = 10 \\cdot W_{kg} + 6.25 \\cdot H_{cm} - 5 \\cdot Age + (\\text{Men: } +5, \\text{ Women: } -161)',
      variables: [
        { symbol: 'W', explanation: 'Body weight in kilograms' },
        { symbol: 'H', explanation: 'Height in centimeters' },
        { symbol: 'Age', explanation: 'Age in years' },
      ],
    },
    explanation: {
      summary: 'BMR represents the baseline energy expended to maintain vital organs (brain, heart, lungs, kidneys) while in a resting, post-absorptive state.',
      breakdown: [
        {
          title: 'Mifflin-St Jeor Accuracy',
          text: 'The Mifflin-St Jeor equation is recommended by the Academy of Nutrition and Dietetics as the most reliable clinical predictive equation for healthy adults.',
        },
      ],
      considerations: ['Educational and nutritional planning estimate only. Consult a registered dietitian or physician for specialized diet therapy.'],
    },
    example: {
      title: 'Male, Age 28, 75 kg, 178 cm',
      description: 'BMR baseline calculation.',
      inputs: {
        'Age': '28',
        'Gender': 'Male',
        'Weight': '75 kg',
        'Height': '178 cm',
      },
      results: {
        'BMR': '1,728 kcal / day',
        'Sedentary TDEE': '2,074 kcal / day',
        'Moderate Activity TDEE': '2,678 kcal / day',
      },
      walkthrough: ['At complete bed rest, the body requires 1,728 calories per day for baseline organ maintenance.'],
    },
    faqs: [
      {
        question: 'Can you eat below your BMR?',
        answer: 'Consistently eating far below your BMR without medical supervision can cause nutrient deficiencies, muscle loss, lethargy, and metabolic adaptation.',
      },
    ],
    relatedToolSlugs: ['calorie-counter', 'bmi-calculator', 'ideal-weight-calculator'],
    status: 'active',
  },
  {
    id: 'ideal-weight-calculator',
    name: 'Ideal Weight Calculator',
    slug: 'ideal-weight-calculator',
    category: 'health',
    subcategory: 'body',
    description: 'Determine your ideal body weight range based on classic medical formulas (Devine, Robinson, Miller, Hamwi) and WHO healthy BMI parameters.',
    shortDescription: 'Calculate ideal body weight using Devine, Robinson, and healthy BMI standards.',
    iconName: 'Weight',
    isPopular: false,
    synonyms: ['ideal body weight', 'IBW calculator', 'healthy weight range', 'target weight'],
    phrases: ['what is my ideal weight', 'ideal body weight for height', 'healthy weight range calculator'],
    seo: {
      title: 'Ideal Weight Calculator | Devine, Robinson & Healthy BMI Ranges',
      metaDescription: 'Calculate your ideal body weight using Devine, Robinson, Miller, and Hamwi equations alongside WHO healthy BMI targets.',
      keywords: ['ideal weight calculator', 'IBW', 'healthy weight', 'ideal body weight'],
    },
    formula: {
      expression: '\\text{Devine (Male): } 50 + 2.3 \\cdot (H_{in} - 60), \\quad \\text{Devine (Female): } 45.5 + 2.3 \\cdot (H_{in} - 60)',
      variables: [
        { symbol: 'H_{in}', explanation: 'Height in inches above 5 feet (60 inches)' },
      ],
    },
    explanation: {
      summary: 'Ideal Body Weight (IBW) formulas provide statistical benchmarks used in clinical medicine and pharmacology for dosage estimation and general body composition goals.',
      breakdown: [
        {
          title: 'Weight is a Range, Not a Point',
          text: 'Muscular athletes naturally exceed traditional IBW without adverse health risks. Healthy weight is best interpreted as a range corresponding to BMI 18.5 - 24.9.',
        },
      ],
      considerations: ['Educational guidance only. Frame size, muscle mass, and bone density naturally affect individual target weight.'],
    },
    example: {
      title: 'Female, 168 cm (5 ft 6 in)',
      description: 'Ideal weight calculation.',
      inputs: {
        'Gender': 'Female',
        'Height': '168 cm (5 ft 6.1 in)',
      },
      results: {
        'Devine IBW': '59.5 kg (131 lbs)',
        'Robinson IBW': '59.4 kg (131 lbs)',
        'Healthy BMI Range': '52.2 kg - 70.3 kg',
      },
      walkthrough: ['Traditional clinical formulas estimate ~59.5 kg, with a broad healthy BMI range from 52 to 70 kg.'],
    },
    faqs: [
      {
        question: 'Why do different formulas produce different ideal weights?',
        answer: 'Formulas were developed by different researchers across different clinical populations (e.g. Devine was originally designed for medical drug dosing).',
      },
    ],
    relatedToolSlugs: ['bmi-calculator', 'body-fat-calculator', 'bmr-calculator'],
    status: 'active',
  },
  {
    id: 'pace-calculator',
    name: 'Pace Calculator',
    slug: 'pace-calculator',
    category: 'health',
    subcategory: 'metabolism-fitness',
    description: 'Calculate running, walking, or cycling pace per kilometer and mile, finish times, and kilometer-by-kilometer split times.',
    shortDescription: 'Calculate running pace, finish times, and split benchmarks for 5K, 10K, half, and marathon.',
    iconName: 'Activity',
    isPopular: false,
    synonyms: ['running pace calculator', 'race time calculator', 'mile pace', 'marathon pace'],
    phrases: ['calculate my running pace', '5k pace calculator', 'running speed to pace'],
    seo: {
      title: 'Pace Calculator | Running, Walking & Marathon Split Estimator',
      metaDescription: 'Calculate running pace in minutes per km and mile, finish times, and split benchmarks for 5K, 10K, half marathon, and marathon.',
      keywords: ['pace calculator', 'running pace', 'marathon pace', 'split times'],
    },
    formula: {
      expression: 'Pace = \\frac{\\text{Total Time}}{\\text{Distance}}, \\quad Speed = \\frac{\\text{Distance}}{\\text{Time (hours)}}',
      variables: [
        { symbol: 'Distance', explanation: 'Course distance in kilometers or miles' },
        { symbol: 'Time', explanation: 'Elapsed workout time in hours, minutes, and seconds' },
      ],
    },
    explanation: {
      summary: 'Essential training tool for runners, walkers, and triathletes to pace race efforts, track cardiovascular progression, and avoid early burnout.',
      breakdown: [
        {
          title: 'Negative Splits',
          text: 'Running the second half of a race slightly faster than the first (negative split) is the strategy favored by elite marathoners for personal records.',
        },
      ],
      considerations: ['Educational athletic tool. Always listen to your body and hydrate properly during endurance workouts.'],
    },
    example: {
      title: '10K in 50 Minutes',
      description: 'Standard 10-kilometer road race.',
      inputs: {
        'Distance': '10 km',
        'Time': '50 Minutes 0 Seconds',
      },
      results: {
        'Pace': '5:00 /km (8:03 /mi)',
        'Speed': '12.0 km/h (7.46 mph)',
      },
      walkthrough: ['Running 10 km in 50 minutes equates to exactly 5:00 per kilometer or 8:03 per mile.'],
    },
    faqs: [
      {
        question: 'What is a good 5K pace for beginners?',
        answer: 'A comfortable beginner 5K pace typically ranges from 6:30 to 7:30 per kilometer (10:30 to 12:00 per mile), completing 5K in 32 to 38 minutes.',
      },
    ],
    relatedToolSlugs: ['calorie-counter', 'bmi-calculator', 'fuel-cost-calculator'],
    status: 'active',
  },
  {
    id: 'pregnancy-calculator',
    name: 'Pregnancy Due Date Calculator',
    slug: 'pregnancy-calculator',
    category: 'health',
    subcategory: 'pregnancy',
    description: 'Estimate your pregnancy due date, current gestational age in weeks and days, and trimester developmental milestones based on your last menstrual period (LMP).',
    shortDescription: 'Estimate due date, current weeks/days, and trimester milestones from LMP.',
    iconName: 'Baby',
    isPopular: true,
    synonyms: ['due date calculator', 'pregnancy weeks calculator', 'baby due date', 'trimester tracker'],
    phrases: ['calculate my baby due date', 'how many weeks pregnant am I', 'pregnancy trimester timeline'],
    seo: {
      title: 'Pregnancy Due Date Calculator | Gestational Age & Trimester Milestones',
      metaDescription: 'Calculate your estimated delivery date (EDD), current pregnancy progress in weeks and days, and trimester milestones using Naegele’s rule.',
      keywords: ['pregnancy calculator', 'due date calculator', 'gestational age', 'trimester calculator'],
    },
    formula: {
      expression: '\\text{Due Date} = \\text{LMP} + 280 \\text{ days} + (\\text{Cycle Length} - 28)',
      variables: [
        { symbol: 'LMP', explanation: 'First day of Last Menstrual Period' },
        { symbol: 'Cycle Length', explanation: 'Average menstrual cycle length in days (typically 28)' },
      ],
    },
    explanation: {
      summary: 'Uses Naegele’s clinical rule to calculate Estimated Date of Delivery (EDD), assuming a 40-week (280-day) gestation starting from the first day of your last period.',
      breakdown: [
        {
          title: 'Trimester Timeline',
          text: 'First trimester: Weeks 1-12. Second trimester: Weeks 13-27. Third trimester: Week 28 until birth. Only ~4-5% of babies arrive on their exact due date.',
        },
      ],
      considerations: ['Educational and informational purpose only. Not clinical or ultrasound dating. Always consult an obstetrician or midwife.'],
    },
    example: {
      title: 'LMP on January 1st with 28-day cycle',
      description: 'Naegele’s rule estimation.',
      inputs: {
        'LMP': 'January 1',
        'Cycle Days': '28 Days',
      },
      results: {
        'Estimated Due Date': 'October 8',
        'Estimated Conception': 'January 15',
        'Total Gestation': '40 Weeks (280 Days)',
      },
      walkthrough: ['LMP + 280 days yields an estimated due date of October 8.'],
    },
    faqs: [
      {
        question: 'Why is gestational age counted from the last period rather than conception?',
        answer: 'Because the first day of menstruation is an easily identifiable physical event, whereas the exact moment of fertilization is difficult to pinpoint.',
      },
    ],
    relatedToolSlugs: ['pregnancy-conception-calculator', 'calorie-counter', 'water-intake-calculator'],
    status: 'active',
  },
  {
    id: 'pregnancy-conception-calculator',
    name: 'Pregnancy Conception Calculator',
    slug: 'pregnancy-conception-calculator',
    category: 'health',
    subcategory: 'pregnancy',
    description: 'Determine the most likely conception date and fertile window based on your due date or last menstrual period.',
    shortDescription: 'Estimate probable conception window and fertile ovulation dates.',
    iconName: 'CalendarCheck',
    isPopular: false,
    synonyms: ['conception date calculator', 'when did I get pregnant', 'fertile window calculator', 'ovulation conception'],
    phrases: ['when did I conceive', 'calculate conception date from due date', 'fertile window estimation'],
    seo: {
      title: 'Pregnancy Conception Calculator | Estimated Conception & Ovulation Date',
      metaDescription: 'Find your most probable conception date and fertile window based on your estimated due date or last menstrual period.',
      keywords: ['conception calculator', 'conception date', 'fertile window', 'when did I conceive'],
    },
    formula: {
      expression: '\\text{Conception Date} \\approx \\text{Due Date} - 266 \\text{ days}',
      variables: [
        { symbol: 'Due Date', explanation: 'Clinical Estimated Due Date' },
      ],
    },
    explanation: {
      summary: 'Biological conception generally occurs approximately 38 weeks (266 days) prior to delivery, corresponding to the time of ovulation.',
      breakdown: [
        {
          title: 'The Fertile Window',
          text: 'Sperm can survive up to 5 days within the reproductive tract. Conception can occur from intercourse up to 5 days before ovulation or 1 day after.',
        },
      ],
      considerations: ['Educational guidance only. Human ovulation timing varies naturally across cycles.'],
    },
    example: {
      title: 'Due Date October 15',
      description: 'Back-calculating probable conception.',
      inputs: {
        'Due Date': 'October 15',
      },
      results: {
        'Probable Conception Date': 'January 22',
        'Fertile Window': 'January 17 - January 23',
      },
      walkthrough: ['Subtracting 266 days yields an estimated conception date around January 22.'],
    },
    faqs: [
      {
        question: 'Can conception happen outside the estimated window?',
        answer: 'Yes. Menstrual cycles and follicular phases naturally fluctuate, and ovulation can occur earlier or later than day 14 of a cycle.',
      },
    ],
    relatedToolSlugs: ['pregnancy-calculator', 'date-difference-calculator', 'bmi-calculator'],
    status: 'active',
  },
  {
    id: 'water-intake-calculator',
    name: 'Water Intake Calculator',
    slug: 'water-intake-calculator',
    category: 'food',
    subcategory: 'nutrition',
    description: 'Calculate your recommended daily water consumption based on body weight, daily exercise duration, and climate temperature.',
    shortDescription: 'Calculate optimal daily hydration intake based on weight, workout, and climate.',
    iconName: 'Droplets',
    isPopular: false,
    synonyms: ['hydration calculator', 'daily water intake', 'how much water should I drink', 'fluid needs'],
    phrases: ['how much water should I drink a day', 'hydration needs calculator', 'water intake for weight and workout'],
    seo: {
      title: 'Water Intake Calculator | Daily Hydration & Fluid Needs',
      metaDescription: 'Calculate how much water you should drink each day in liters, ounces, and glasses, adjusted for workouts and climate.',
      keywords: ['water intake calculator', 'daily hydration', 'fluid intake', 'water glasses'],
    },
    formula: {
      expression: '\\text{Water (L)} = (\\text{Weight}_{kg} \\times 0.033) + (\\text{Exercise Min} \\times 0.007) + \\text{Climate Adj}',
      variables: [
        { symbol: 'Weight', explanation: 'Body weight in kg (~30-35 ml per kg)' },
        { symbol: 'Exercise', explanation: 'Workout duration (~350-500 ml per 30 mins exercise)' },
      ],
    },
    explanation: {
      summary: 'Proper hydration supports nutrient transport, cellular metabolism, joint lubrication, cognitive performance, and thermoregulation.',
      breakdown: [
        {
          title: 'Thirst is a Lagging Indicator',
          text: 'By the time you feel noticeable thirst, your body is already dehydrated by roughly 1-2% of total body water.',
        },
      ],
      considerations: ['Educational guidance only. Individuals with kidney or cardiovascular conditions must follow their physician’s fluid guidelines.'],
    },
    example: {
      title: '70 kg Individual with 45 Minutes Workout in Temperate Climate',
      description: 'Daily hydration requirement.',
      inputs: {
        'Weight': '70 kg',
        'Workout': '45 Minutes',
        'Climate': 'Normal',
      },
      results: {
        'Daily Water Needed': '2.6 Liters (88 fl oz)',
        'Standard 8oz Glasses': '~11 Glasses',
      },
      walkthrough: ['Baseline: 2.3L + Exercise: 0.3L = 2.6 Liters total daily fluid intake.'],
    },
    faqs: [
      {
        question: 'Does tea or coffee count toward daily water intake?',
        answer: 'Yes. While caffeine has a mild diuretic effect in unaccustomed individuals, caffeinated beverages still contribute net positive hydration.',
      },
    ],
    relatedToolSlugs: ['calorie-counter', 'bmi-calculator', 'bmr-calculator'],
    status: 'active',
  },

  // ==========================================
  // MATH CALCULATORS
  // ==========================================
  {
    id: 'standard-calculator',
    name: 'Standard Calculator',
    slug: 'standard-calculator',
    category: 'math',
    subcategory: 'basic-math',
    description: 'Clean, responsive standard arithmetic calculator with memory functions (M+, M-, MR, MC), percent, and audit history tape.',
    shortDescription: 'Clean standard arithmetic calculator with memory keys and history tape.',
    iconName: 'Calculator',
    isPopular: true,
    synonyms: ['basic calculator', 'online calculator', 'math calculator', 'arithmetic calculator'],
    phrases: ['simple online calculator', 'standard math keypad', 'arithmetic calculator'],
    seo: {
      title: 'Standard Calculator | Online Arithmetic Calculator with Memory',
      metaDescription: 'Free, clean online standard calculator with addition, subtraction, multiplication, division, percentage, and memory buttons.',
      keywords: ['standard calculator', 'basic calculator', 'online calculator', 'math keypad'],
    },
    formula: {
      expression: 'A \\pm B, \\quad A \\times B, \\quad A \\div B',
      variables: [
        { symbol: 'A, B', explanation: 'Numerical Operands' },
      ],
    },
    explanation: {
      summary: 'Performs essential four-function arithmetic with high precision and memory retention for rapid everyday calculations.',
      breakdown: [
        {
          title: 'Memory Keys',
          text: 'M+ adds the current display value to memory; M- subtracts it; MR recalls the saved sum; MC clears memory back to zero.',
        },
      ],
      considerations: ['Maintains order of operations (PEMDAS) across expression evaluations.'],
    },
    example: {
      title: '1,250 × 1.15 - 340',
      description: 'Standard arithmetic calculation.',
      inputs: {
        'Expression': '1,250 × 1.15 - 340',
      },
      results: {
        'Result': '1,097.5',
      },
      walkthrough: ['1,250 × 1.15 = 1,437.5. Subtract 340 = 1,097.5.'],
    },
    faqs: [
      {
        question: 'What does the C vs CE button do?',
        answer: 'CE (Clear Entry) erases only the most recent number entered, whereas C (Clear All) resets the entire calculation chain.',
      },
    ],
    relatedToolSlugs: ['scientific-calculator', 'percentage-calculator', 'fraction-calculator'],
    status: 'active',
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'math',
    subcategory: 'scientific',
    description: 'Comprehensive scientific calculator featuring trigonometry (sin, cos, tan), logarithms (log, ln), powers, roots, factorials, and constants (π, e).',
    shortDescription: 'Full scientific calculator with trigonometry, logarithms, powers, and constants.',
    iconName: 'Sigma',
    isPopular: true,
    synonyms: ['advanced calculator', 'trig calculator', 'sin cos tan calculator', 'log calculator'],
    phrases: ['scientific calculator online', 'trigonometry calculator', 'solve powers and roots'],
    seo: {
      title: 'Scientific Calculator | Advanced Math, Trigonometry & Logarithms',
      metaDescription: 'Free online scientific calculator with trigonometric functions, logarithms, exponentials, roots, degrees/radians toggle, and parentheses.',
      keywords: ['scientific calculator', 'trig calculator', 'sin cos tan', 'advanced math'],
    },
    formula: {
      expression: '\\sin(x), \\cos(x), \\tan(x), \\log_{10}(x), \\ln(x), x^y, \\sqrt{x}, x!',
      variables: [
        { symbol: 'x', explanation: 'Input operand in degrees or radians' },
      ],
    },
    explanation: {
      summary: 'Engineered for engineers, students, and scientists requiring advanced algebraic, trigonometric, and transcendental function evaluations.',
      breakdown: [
        {
          title: 'Degrees vs. Radians',
          text: 'Be sure to check your angle unit mode: 180 degrees equals π radians. Trigonometric functions produce vastly different values if the mode is mismatched.',
        },
      ],
      considerations: ['Parentheses ensure explicit execution precedence for multi-step equations.'],
    },
    example: {
      title: 'sin(30°) + log(100) × 2^3',
      description: 'Complex scientific expression evaluation.',
      inputs: {
        'Expression': 'sin(30°) + log(100) × 2^3',
      },
      results: {
        'Result': '16.5',
      },
      walkthrough: ['sin(30°) = 0.5. log(100) = 2. 2^3 = 8. 2 × 8 = 16. 16 + 0.5 = 16.5.'],
    },
    faqs: [
      {
        question: 'What is the natural logarithm ln(x)?',
        answer: 'The natural logarithm is the logarithm to the base of the mathematical constant e (~2.71828), ubiquitous in physics, finance, and natural growth models.',
      },
    ],
    relatedToolSlugs: ['standard-calculator', 'triangle-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    category: 'math',
    subcategory: 'fractions',
    description: 'Add, subtract, multiply, and divide fractions with automated common denominator step-by-step solutions, simplified results, and mixed numbers.',
    shortDescription: 'Add, subtract, multiply, and divide fractions with step-by-step simplification.',
    iconName: 'Divide',
    isPopular: true,
    synonyms: ['fraction solver', 'fraction reducer', 'mixed number calculator', 'simplify fractions'],
    phrases: ['how to add fractions', 'fraction calculator with steps', 'divide two fractions'],
    seo: {
      title: 'Fraction Calculator | Add, Subtract, Multiply & Divide with Steps',
      metaDescription: 'Calculate fractions step-by-step with common denominator finding, greatest common divisor simplification, and mixed number conversions.',
      keywords: ['fraction calculator', 'simplify fractions', 'add fractions', 'fraction reducer'],
    },
    formula: {
      expression: '\\frac{a}{b} \\pm \\frac{c}{d} = \\frac{ad \\pm bc}{bd}, \\quad \\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}, \\quad \\frac{a}{b} \\div \\frac{c}{d} = \\frac{ad}{bc}',
      variables: [
        { symbol: 'a/b, c/d', explanation: 'Numerator and Denominator pairs' },
      ],
    },
    explanation: {
      summary: 'Performs arithmetic on fractional values, calculates the Least Common Multiple (LCM) for denominators, and reduces the output using Greatest Common Divisor (GCD).',
      breakdown: [
        {
          title: 'Division by Reciprocal',
          text: 'Dividing by a fraction is mathematically identical to multiplying by its inverted reciprocal (e.g. ÷ 3/4 is equivalent to × 4/3).',
        },
      ],
      considerations: ['A denominator can never equal zero, as division by zero is mathematically undefined.'],
    },
    example: {
      title: '3/4 + 2/5',
      description: 'Fraction addition with differing denominators.',
      inputs: {
        'Fraction 1': '3/4',
        'Operation': '+',
        'Fraction 2': '2/5',
      },
      results: {
        'Simplified Fraction': '23/20',
        'Mixed Number': '1 3/20',
        'Decimal': '1.15',
      },
      walkthrough: ['Common denominator of 4 and 5 is 20. 15/20 + 8/20 = 23/20 = 1 3/20.'],
    },
    faqs: [
      {
        question: 'What is a mixed number?',
        answer: 'A mixed number consists of a whole number and a proper fraction combined (e.g., 1 3/4 equals the improper fraction 7/4).',
      },
    ],
    relatedToolSlugs: ['percentage-calculator', 'ratio-calculator', 'standard-calculator'],
    status: 'active',
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    slug: 'random-number-generator',
    category: 'tools',
    subcategory: 'generators',
    description: 'Generate true random integers, decimal numbers, unique lottery picks, coin flips, or dice rolls with customizable ranges.',
    shortDescription: 'Generate random numbers, unique raffle picks, coin flips, and dice rolls.',
    iconName: 'Dices',
    isPopular: false,
    synonyms: ['RNG', 'random pick', 'dice roller', 'coin flipper', 'lottery number picker'],
    phrases: ['pick a random number between 1 and 100', 'random number generator online', 'roll a dice'],
    seo: {
      title: 'Random Number Generator | RNG, Unique Picks & Dice Roller',
      metaDescription: 'Generate customizable random numbers between any minimum and maximum values, with unique non-duplicate lottery mode and dice rolls.',
      keywords: ['random number generator', 'RNG', 'dice roller', 'lottery picker'],
    },
    formula: {
      expression: '\\text{Value} = \\lfloor \\text{rand}() \\times (\\text{Max} - \\text{Min} + 1) \\rfloor + \\text{Min}',
      variables: [
        { symbol: 'Min, Max', explanation: 'Lower and upper inclusive range bounds' },
      ],
    },
    explanation: {
      summary: 'Generates uniform pseudo-random distributions across user-specified integer or floating-point intervals.',
      breakdown: [
        {
          title: 'Unique vs. Duplicate Draws',
          text: 'Enable "Unique" mode for raffles, giveaways, and lottery selections to ensure no individual number is drawn more than once.',
        },
      ],
      considerations: ['Uses cryptographic entropy where supported by the browser runtime for unbiased sampling.'],
    },
    example: {
      title: 'Pick 5 unique numbers between 1 and 50',
      description: 'Lottery raffle draw simulation.',
      inputs: {
        'Min': '1',
        'Max': '50',
        'Count': '5',
        'Unique': 'Yes',
      },
      results: {
        'Results': '7, 14, 23, 38, 45',
      },
      walkthrough: ['Selected 5 distinct, unbiased numbers from the pool of 50 integers.'],
    },
    faqs: [
      {
        question: 'Are online random number generators truly random?',
        answer: 'Modern web browsers utilize secure pseudo-random number algorithms seeded with hardware entropy, sufficient for all gaming, raffles, and statistical sampling.',
      },
    ],
    relatedToolSlugs: ['password-generator', 'standard-deviation-calculator', 'average-calculator'],
    status: 'active',
  },
  {
    id: 'triangle-calculator',
    name: 'Triangle Calculator',
    slug: 'triangle-calculator',
    category: 'math',
    subcategory: 'geometry',
    description: 'Solve any right-angled or general triangle given sides or angles, computing missing lengths, angles, perimeter, and area.',
    shortDescription: 'Solve right and general triangles for sides, angles, area, and perimeter.',
    iconName: 'Triangle',
    isPopular: false,
    synonyms: ['pythagorean theorem calculator', 'trig triangle solver', 'right triangle calculator', 'heron formula'],
    phrases: ['solve right triangle', 'find missing side of triangle', 'pythagorean theorem solver'],
    seo: {
      title: 'Triangle Calculator | Right & Oblique Triangle Solver with Angles & Area',
      metaDescription: 'Solve right and general triangles using Pythagorean theorem, trigonometric laws of sines and cosines, and Heron’s formula.',
      keywords: ['triangle calculator', 'right triangle', 'pythagorean theorem', 'triangle area'],
    },
    formula: {
      expression: 'a^2 + b^2 = c^2, \\quad \\text{Area} = \\frac{1}{2} b h = \\sqrt{s(s-a)(s-b)(s-c)}',
      variables: [
        { symbol: 'a, b', explanation: 'Perpendicular Legs of Right Triangle' },
        { symbol: 'c', explanation: 'Hypotenuse' },
        { symbol: 's', explanation: 'Semi-perimeter (a + b + c) / 2' },
      ],
    },
    explanation: {
      summary: 'Solves geometric properties of triangles using the Pythagorean theorem for right triangles and Heron’s formula for three-sided triangles.',
      breakdown: [
        {
          title: 'Triangle Inequality Theorem',
          text: 'For any valid triangle, the sum of the lengths of any two sides must always be strictly greater than the length of the remaining side.',
        },
      ],
      considerations: ['The sum of the three internal angles in Euclidean space always equals exactly 180 degrees.'],
    },
    example: {
      title: 'Right triangle with legs 6 and 8',
      description: 'Classic 3-4-5 proportional triangle.',
      inputs: {
        'Side A': '6',
        'Side B': '8',
      },
      results: {
        'Hypotenuse (Side C)': '10',
        'Area': '24',
        'Perimeter': '24',
        'Angles': '36.87°, 53.13°, 90°',
      },
      walkthrough: ['6² + 8² = 36 + 64 = 100. √100 = 10. Area = 0.5 × 6 × 8 = 24.'],
    },
    faqs: [
      {
        question: 'What is Heron’s formula?',
        answer: 'Heron’s formula calculates the area of any triangle given only the lengths of its three sides, without requiring you to calculate or measure the altitude/height.',
      },
    ],
    relatedToolSlugs: ['scientific-calculator', 'square-footage-calculator', 'ratio-calculator'],
    status: 'active',
  },
  {
    id: 'standard-deviation-calculator',
    name: 'Standard Deviation Calculator',
    slug: 'standard-deviation-calculator',
    category: 'math',
    subcategory: 'statistics',
    description: 'Calculate sample and population standard deviation, variance, mean, sum of squares, and margin metrics for any data series.',
    shortDescription: 'Calculate sample and population standard deviation, variance, and mean.',
    iconName: 'BarChart2',
    isPopular: false,
    synonyms: ['variance calculator', 'stats calculator', 'sample standard deviation', 'spread of data'],
    phrases: ['calculate standard deviation of dataset', 'sample vs population standard deviation', 'variance solver'],
    seo: {
      title: 'Standard Deviation Calculator | Sample, Population & Variance Solver',
      metaDescription: 'Calculate mean, sample standard deviation (s), population standard deviation (σ), variance, and count from any numerical dataset.',
      keywords: ['standard deviation calculator', 'sample standard deviation', 'population variance', 'data spread'],
    },
    formula: {
      expression: 's = \\sqrt{\\frac{\\sum (x_i - \\bar{x})^2}{n - 1}}, \\quad \\sigma = \\sqrt{\\frac{\\sum (x_i - \\mu)^2}{N}}',
      variables: [
        { symbol: 's', explanation: 'Sample standard deviation (Bessel’s correction n-1)' },
        { symbol: 'σ', explanation: 'Population standard deviation' },
        { symbol: 'x̄, μ', explanation: 'Sample and population mean' },
      ],
    },
    explanation: {
      summary: 'Quantifies the amount of dispersion or variation of a set of data values around their arithmetic mean.',
      breakdown: [
        {
          title: 'Sample (n-1) vs. Population (N)',
          text: 'Use sample standard deviation when your data represents a subset of a larger group (Bessel’s correction corrects for sample bias). Use population when you possess all members.',
        },
      ],
      considerations: ['In a normal distribution, ~68% of observations fall within 1 standard deviation, and ~95% fall within 2.'],
    },
    example: {
      title: 'Dataset: 12, 15, 18, 20, 25',
      description: 'Basic statistics breakdown.',
      inputs: {
        'Numbers': '12, 15, 18, 20, 25',
      },
      results: {
        'Mean': '18.0',
        'Sample SD (s)': '4.95',
        'Population SD (σ)': '4.43',
        'Sample Variance': '24.5',
      },
      walkthrough: ['Sum is 90 across 5 numbers (mean 18.0). Sample SD is 4.95 with variance 24.5.'],
    },
    faqs: [
      {
        question: 'Why does sample standard deviation divide by n-1?',
        answer: 'Dividing by n-1 (Bessel’s correction) compensates for the fact that a sample tends to underestimate the true variability of the full parent population.',
      },
    ],
    relatedToolSlugs: ['average-calculator', 'random-number-generator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    slug: 'average-calculator',
    category: 'math',
    subcategory: 'basic-math',
    description: 'Calculate mean, median, mode, range, minimum, maximum, and sum from any comma or space-separated list of numbers.',
    shortDescription: 'Calculate mean, median, mode, range, min, and max for any dataset.',
    iconName: 'BarChart3',
    isPopular: true,
    synonyms: ['mean median mode calculator', 'central tendency', 'calculate average', 'median solver'],
    phrases: ['how to find the average', 'mean median mode range calculator', 'find middle number of data'],
    seo: {
      title: 'Average Calculator | Mean, Median, Mode & Range Solver',
      metaDescription: 'Free online average calculator. Enter any dataset to find the arithmetic mean, median, mode, range, sum, and count.',
      keywords: ['average calculator', 'mean median mode', 'central tendency', 'find average'],
    },
    formula: {
      expression: '\\text{Mean} = \\frac{\\sum x_i}{n}, \\quad \\text{Median} = \\text{Middle element when sorted}',
      variables: [
        { symbol: 'n', explanation: 'Total count of observations' },
      ],
    },
    explanation: {
      summary: 'Provides the complete profile of central tendency and dispersion for any series of numbers.',
      breakdown: [
        {
          title: 'When to Use Median vs. Mean',
          text: 'The arithmetic mean is distorted by extreme outliers (like billionaire incomes in salary statistics). The median represents the truest typical value in skewed distributions.',
        },
      ],
      considerations: ['A dataset may have no mode, one unique mode, or multiple modes.'],
    },
    example: {
      title: 'Data: 10, 20, 20, 40, 60',
      description: 'Central tendency calculation.',
      inputs: {
        'Numbers': '10, 20, 20, 40, 60',
      },
      results: {
        'Mean': '30.0',
        'Median': '20.0',
        'Mode': '20',
        'Range': '50',
      },
      walkthrough: ['Sum is 150 / 5 = Mean 30. Middle value is 20. Most frequent value is 20.'],
    },
    faqs: [
      {
        question: 'What is the range of a dataset?',
        answer: 'The range is the mathematical difference between the largest number (maximum) and smallest number (minimum) in the dataset.',
      },
    ],
    relatedToolSlugs: ['standard-deviation-calculator', 'gpa-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    category: 'math',
    subcategory: 'basic-math',
    description: 'Solve proportional ratios (A:B = C:X), reduce ratios to simplest terms, and calculate screen aspect ratio dimensions.',
    shortDescription: 'Solve proportions (A:B = C:D), simplify ratios, and scale aspect ratios.',
    iconName: 'ArrowLeftRight',
    isPopular: false,
    synonyms: ['proportion calculator', 'ratio solver', 'aspect ratio calculator', 'simplify ratio'],
    phrases: ['solve for x in ratio', 'simplify ratio 1920:1080', 'cross multiplication ratio'],
    seo: {
      title: 'Ratio Calculator | Solve Proportions & Aspect Ratio Simplifier',
      metaDescription: 'Solve for missing values in proportional equations (A:B = C:D), simplify ratios to lowest terms, and scale aspect ratios.',
      keywords: ['ratio calculator', 'proportion solver', 'aspect ratio', 'simplify ratio'],
    },
    formula: {
      expression: '\\frac{A}{B} = \\frac{C}{D} \\implies D = \\frac{B \\cdot C}{A}',
      variables: [
        { symbol: 'A, B, C, D', explanation: 'Proportional terms' },
      ],
    },
    explanation: {
      summary: 'Applies cross-multiplication to solve missing terms in equivalent proportions and scales dimensions preserving geometric aspect ratios.',
      breakdown: [
        {
          title: 'Aspect Ratios in Video & Photography',
          text: 'A resolution of 1920×1080 simplifies down to 16:9 by dividing both numbers by their greatest common divisor (120).',
        },
      ],
      considerations: ['Terms in a ratio must be expressed in compatible units of measurement.'],
    },
    example: {
      title: 'Scale 1920:1080 to Width 1280',
      description: 'Proportional image resizing.',
      inputs: {
        'A (Original Width)': '1920',
        'B (Original Height)': '1080',
        'C (Target Width)': '1280',
      },
      results: {
        'D (Target Height)': '720',
        'Simplified Ratio': '16:9',
      },
      walkthrough: ['1920/1080 simplifies to 16:9. At width 1280, height is (1080 × 1280) / 1920 = 720.'],
    },
    faqs: [
      {
        question: 'What is cross-multiplication?',
        answer: 'Cross-multiplication states that if A/B = C/D, then A × D = B × C, allowing you to solve for any single unknown variable.',
      },
    ],
    relatedToolSlugs: ['fraction-calculator', 'percentage-calculator', 'triangle-calculator'],
    status: 'active',
  },

  // ==========================================
  // EVERYDAY & UTILITY CALCULATORS
  // ==========================================
  {
    id: 'date-difference-calculator',
    name: 'Date Difference Calculator',
    slug: 'date-difference-calculator',
    category: 'date-time',
    subcategory: 'calendars',
    description: 'Calculate the exact number of days, weeks, months, years, and business days between any two dates on the calendar.',
    shortDescription: 'Calculate exact days, weeks, months, and business working days between two dates.',
    iconName: 'CalendarRange',
    isPopular: true,
    synonyms: ['days between dates', 'date duration', 'working days calculator', 'business days between'],
    phrases: ['how many days between two dates', 'calendar duration calculator', 'calculate working days'],
    seo: {
      title: 'Date Difference Calculator | Days, Weeks & Business Days Between Dates',
      metaDescription: 'Calculate the exact number of days, weeks, months, years, and working business days between any two calendar dates.',
      keywords: ['date difference calculator', 'days between dates', 'business days', 'calendar duration'],
    },
    formula: {
      expression: '\\Delta t = \\text{Date}_2 - \\text{Date}_1, \\quad \\text{Business Days} = \\sum_{d=\\text{start}}^{\\text{end}} [\\text{DayOfWeek} \\notin \\{0, 6\\}]',
      variables: [
        { symbol: 'Date1, Date2', explanation: 'Start and End Calendar Dates' },
      ],
    },
    explanation: {
      summary: 'Precise calendar tool accounting for leap years, variable month lengths, and Monday-through-Friday business work schedules.',
      breakdown: [
        {
          title: 'Business vs. Total Days',
          text: 'Total days counts all 7 days of each week. Business days exclude Saturdays and Sundays for accurate project and contract scheduling.',
        },
      ],
      considerations: ['National bank holidays are not subtracted automatically as they vary by country and region.'],
    },
    example: {
      title: 'January 1, 2025 to July 4, 2025',
      description: 'Duration calculation.',
      inputs: {
        'Start Date': '2025-01-01',
        'End Date': '2025-07-04',
      },
      results: {
        'Total Days': '184 Days',
        'Breakdown': '6 Months 3 Days',
        'Total Weeks': '26 Weeks 2 Days',
        'Business Days': '133 Working Days',
      },
      walkthrough: ['184 calendar days elapse, consisting of 133 business days and 51 weekend days.'],
    },
    faqs: [
      {
        question: 'Does the calculator count both the start and end dates?',
        answer: 'By standard calendar convention, it measures the elapsed duration (end date minus start date).',
      },
    ],
    relatedToolSlugs: ['age-calculator', 'hours-worked-calculator', 'pregnancy-calculator'],
    status: 'active',
  },
  {
    id: 'hours-worked-calculator',
    name: 'Hours Worked Calculator',
    slug: 'hours-worked-calculator',
    category: 'salary-work',
    additionalCategories: ['date-time'],
    subcategory: 'hours',
    description: 'Calculate daily shift hours, unpaid meal breaks, regular vs. overtime hours, and gross wage pay for employee timesheets.',
    shortDescription: 'Calculate timesheet hours, lunch breaks, overtime, and gross payroll wages.',
    iconName: 'Clock',
    isPopular: true,
    synonyms: ['timesheet calculator', 'time card calculator', 'work hours calculator', 'payroll hours'],
    phrases: ['calculate hours worked with lunch break', 'time card calculator', 'work shift hours and pay'],
    seo: {
      title: 'Hours Worked Calculator | Timesheet, Lunch Break & Overtime Pay',
      metaDescription: 'Calculate daily work hours, break deductions, regular and overtime hours, and gross pay for employee timecards.',
      keywords: ['hours worked calculator', 'timesheet calculator', 'time card', 'overtime pay'],
    },
    formula: {
      expression: '\\text{Hours} = \\frac{(\\text{End} - \\text{Start} - \\text{Break})}{60}, \\quad \\text{Pay} = (\\text{Reg} \\times \\text{Rate}) + (\\text{OT} \\times 1.5 \\times \\text{Rate})',
      variables: [
        { symbol: 'Start, End', explanation: 'Clock-in and clock-out times' },
        { symbol: 'Break', explanation: 'Unpaid meal/rest break in minutes' },
        { symbol: 'Rate', explanation: 'Hourly base wage rate' },
      ],
    },
    explanation: {
      summary: 'Simplifies weekly timesheet compilation by calculating net working decimal hours and factoring standard time-and-a-half overtime for hours exceeding 8 in a shift.',
      breakdown: [
        {
          title: 'Decimal Hours for Payroll',
          text: 'Payroll systems require decimal hours (e.g. 7 hours 45 minutes = 7.75 hours). Our tool outputs both formats clearly.',
        },
      ],
      considerations: ['Check local labor laws regarding overtime thresholds (daily >8 hours vs. weekly >40 hours).'],
    },
    example: {
      title: '8:30 AM to 5:30 PM with 45 min lunch at $25/hr',
      description: 'Standard daily work shift.',
      inputs: {
        'Clock In': '08:30',
        'Clock Out': '17:30',
        'Break': '45 Minutes',
        'Hourly Wage': '$25.00',
      },
      results: {
        'Net Working Time': '8h 15m (8.25 Hours)',
        'Regular Hours': '8.00 Hours',
        'Overtime Hours': '0.25 Hours',
        'Gross Earnings': '$209.38',
      },
      walkthrough: ['9 total hours minus 45 min lunch = 8.25 hours worked. Pay: (8 × $25) + (0.25 × $37.50) = $209.38.'],
    },
    faqs: [
      {
        question: 'Does this calculator handle overnight graveyard shifts?',
        answer: 'Yes. If the clock-out time is earlier on the clock than clock-in (e.g., in at 10:00 PM, out at 6:00 AM), it automatically handles the midnight rollover.',
      },
    ],
    relatedToolSlugs: ['salary-calculator', 'date-difference-calculator', 'income-tax-calculator'],
    status: 'active',
  },
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    slug: 'gpa-calculator',
    category: 'education',
    subcategory: 'grades-marks',
    description: 'Calculate high school or college Grade Point Average (GPA) on the standard 4.0 scale with credit hours and honors distinctions.',
    shortDescription: 'Calculate semester and cumulative college GPA on the standard 4.0 scale.',
    iconName: 'GraduationCap',
    isPopular: true,
    synonyms: ['grade point average', 'college GPA calculator', 'semester GPA', 'cumulative GPA'],
    phrases: ['calculate my college GPA', 'gpa calculator 4.0 scale', 'grade points and credit hours'],
    seo: {
      title: 'GPA Calculator | 4.0 Scale College & High School Grade Point Average',
      metaDescription: 'Calculate your semester and cumulative GPA on the standard 4.0 scale. Add courses, letter grades, and credit hours.',
      keywords: ['GPA calculator', 'grade point average', 'college GPA', '4.0 scale'],
    },
    formula: {
      expression: '\\text{GPA} = \\frac{\\sum (\\text{Grade Points} \\times \\text{Credit Hours})}{\\sum \\text{Credit Hours}}',
      variables: [
        { symbol: 'Grade Points', explanation: 'A=4.0, B=3.0, C=2.0, D=1.0, F=0.0' },
        { symbol: 'Credit Hours', explanation: 'Course weight or credit units' },
      ],
    },
    explanation: {
      summary: 'Weights each letter grade by its course credit hours to produce the standard American university and collegiate Grade Point Average.',
      breakdown: [
        {
          title: 'Quality Points',
          text: 'An "A" (4.0 points) in a 4-credit science lecture earns 16.0 quality points, contributing twice as heavily to your GPA as a 2-credit elective.',
        },
      ],
      considerations: ['Cumulative GPA incorporates all completed semesters across your collegiate transcript.'],
    },
    example: {
      title: '4 Courses: Math (4 cr, A), English (3 cr, B), History (3 cr, A), Chemistry (4 cr, B)',
      description: 'Typical 14-credit college semester.',
      inputs: {
        'Course 1': 'Math (4 credits, Grade A: 4.0)',
        'Course 2': 'English (3 credits, Grade B: 3.0)',
        'Course 3': 'History (3 credits, Grade A: 4.0)',
        'Course 4': 'Chemistry (4 credits, Grade B: 3.0)',
      },
      results: {
        'Semester GPA': '3.50',
        'Total Credits': '14',
        'Standing': 'Magna Cum Laude / Dean’s List',
      },
      walkthrough: ['Total quality points: (16 + 9 + 12 + 12) = 49. Divided by 14 credits = 3.50 GPA.'],
    },
    faqs: [
      {
        question: 'What is the difference between weighted and unweighted GPA?',
        answer: 'Unweighted GPA caps all grades at 4.0 regardless of course rigor. Weighted GPA awards extra points (up to 5.0) for Advanced Placement (AP) or honors classes.',
      },
    ],
    relatedToolSlugs: ['grade-calculator', 'education-loan-calculator', 'average-calculator'],
    status: 'active',
  },
  {
    id: 'grade-calculator',
    name: 'Final Grade Calculator',
    slug: 'grade-calculator',
    category: 'education',
    subcategory: 'grades-marks',
    description: 'Calculate the exact score you need on your final exam to achieve your target overall course letter grade.',
    shortDescription: 'Find the score needed on your final exam to get your target grade.',
    iconName: 'Award',
    isPopular: true,
    synonyms: ['final exam calculator', 'target grade calculator', 'exam score needed', 'what do I need on final'],
    phrases: ['what grade do I need on my final exam', 'calculate needed final exam score', 'final grade planner'],
    seo: {
      title: 'Final Grade Calculator | Score Needed on Final Exam for Target Grade',
      metaDescription: 'Find out exactly what score you need on your final exam to pass the class or earn an A, B, or C grade.',
      keywords: ['final grade calculator', 'final exam score', 'grade calculator', 'target grade'],
    },
    formula: {
      expression: '\\text{Required Score} = \\frac{\\text{Target} - \\text{Current} \\times (1 - w)}{w}',
      variables: [
        { symbol: 'Target', explanation: 'Desired overall course percentage (e.g. 90% for an A)' },
        { symbol: 'Current', explanation: 'Current cumulative course grade percentage' },
        { symbol: 'w', explanation: 'Weight of the final exam as a decimal (e.g. 0.30 for 30%)' },
      ],
    },
    explanation: {
      summary: 'Determines the minimum performance threshold required on high-stakes final examinations to attain desired academic goals.',
      breakdown: [
        {
          title: 'Managing Academic Stress',
          text: 'Often, students discover they only need a modest score (e.g., 68%) to retain their existing letter grade, significantly reducing finals week anxiety.',
        },
      ],
      considerations: ['Check whether your syllabus includes any extra credit opportunities or dropped low-quiz policies.'],
    },
    example: {
      title: 'Current grade 84%, target 80% (B), final exam worth 25%',
      description: 'Maintaining a B grade in course.',
      inputs: {
        'Current Grade': '84%',
        'Target Grade': '80%',
        'Final Exam Weight': '25%',
      },
      results: {
        'Required Final Score': '68.0%',
        'Difficulty': 'Moderate',
      },
      walkthrough: ['[80 - 84 × (1 - 0.25)] / 0.25 = (80 - 63) / 0.25 = 17 / 0.25 = 68% needed on final.'],
    },
    faqs: [
      {
        question: 'What if the calculator says I need over 100%?',
        answer: 'If the required score exceeds 100%, it is mathematically impossible to reach your target grade without extra credit or curved grading.',
      },
    ],
    relatedToolSlugs: ['gpa-calculator', 'percentage-calculator', 'average-calculator'],
    status: 'active',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    category: 'tools',
    subcategory: 'generators',
    description: 'Generate strong, cryptographically secure random passwords with customizable length, symbols, ambiguity filters, and entropy strength ratings.',
    shortDescription: 'Generate secure random passwords with entropy rating and ambiguity filters.',
    iconName: 'KeyRound',
    isPopular: false,
    synonyms: ['strong password generator', 'secure password', 'random password', 'passphrase generator'],
    phrases: ['generate a strong random password', 'secure password generator online', 'safe password maker'],
    seo: {
      title: 'Password Generator | Secure Random Passwords & Entropy Strength Meter',
      metaDescription: 'Generate strong, cryptographically secure passwords. Customize character sets, exclude ambiguous characters, and check entropy bits.',
      keywords: ['password generator', 'strong password', 'secure credentials', 'entropy meter'],
    },
    formula: {
      expression: '\\text{Entropy (bits)} = L \\times \\log_2(N)',
      variables: [
        { symbol: 'L', explanation: 'Password length in characters' },
        { symbol: 'N', explanation: 'Pool size of available unique characters' },
      ],
    },
    explanation: {
      summary: 'Uses the browser’s native Cryptographically Secure Pseudorandom Number Generator (CSPRNG) to generate unpredictable credentials.',
      breakdown: [
        {
          title: 'The Power of Length',
          text: 'Length is the primary factor in password security: a 16-character password with letters and numbers has higher entropy than an 8-character password with complex symbols.',
        },
      ],
      considerations: ['Passwords are generated locally in your browser memory and are never transmitted over the internet or saved.'],
    },
    example: {
      title: '16 characters with letters, numbers, and symbols',
      description: 'Standard high-security credential generation.',
      inputs: {
        'Length': '16',
        'Include': 'Uppercase, Lowercase, Numbers, Symbols',
      },
      results: {
        'Sample Password': 'k9#M@7xQ$2pL!9wZ',
        'Entropy Rating': '104 bits',
        'Strength': 'Very Strong',
      },
      walkthrough: ['16 characters drawn from a pool of 85 characters provides 104 bits of cryptographic entropy.'],
    },
    faqs: [
      {
        question: 'What is password entropy?',
        answer: 'Entropy measures password unpredictability in bits. Passwords with over 80 bits of entropy take billions of years to crack with brute-force computing.',
      },
    ],
    relatedToolSlugs: ['random-number-generator', 'subnet-calculator'],
    status: 'active',
  },
  {
    id: 'subnet-calculator',
    name: 'Subnet Calculator',
    slug: 'subnet-calculator',
    category: 'tools',
    subcategory: 'developer-tools',
    description: 'Calculate IPv4 network address, broadcast address, netmask, wildcard mask, CIDR prefix, and usable host IP ranges.',
    shortDescription: 'Calculate IPv4 CIDR subnetting, network and broadcast addresses, and host ranges.',
    iconName: 'Network',
    isPopular: false,
    synonyms: ['IP subnet calculator', 'CIDR calculator', 'IPv4 subnetting', 'network mask'],
    phrases: ['calculate subnet mask from CIDR', 'IPv4 usable host range', 'network and broadcast IP solver'],
    seo: {
      title: 'Subnet Calculator | IPv4 CIDR, Subnet Mask & Host Range Solver',
      metaDescription: 'Calculate IPv4 subnet addresses, CIDR notation, wildcard masks, usable host IP ranges, and total host capacities.',
      keywords: ['subnet calculator', 'IPv4 subnet', 'CIDR calculator', 'network address'],
    },
    formula: {
      expression: '\\text{NetID} = \\text{IP} \\ \\& \\ \\text{Mask}, \\quad \\text{Hosts} = 2^{(32 - \\text{CIDR})} - 2',
      variables: [
        { symbol: 'CIDR', explanation: 'Prefix length in bits (/0 to /32)' },
        { symbol: '&', explanation: 'Bitwise AND operation' },
      ],
    },
    explanation: {
      summary: 'Performs binary bitwise masking on IPv4 addresses to partition networks into logical segments and compute host capacities.',
      breakdown: [
        {
          title: 'Usable Hosts',
          text: 'In standard subnets (/30 and below), two IP addresses are reserved: the network address (all zeros in host portion) and the broadcast address (all ones).',
        },
      ],
      considerations: ['A /24 subnet provides 254 usable host addresses (256 total minus network and broadcast).'],
    },
    example: {
      title: '192.168.1.100 with /24 CIDR',
      description: 'Standard home/office class C subnet.',
      inputs: {
        'IP Address': '192.168.1.100',
        'CIDR Prefix': '/24',
      },
      results: {
        'Subnet Mask': '255.255.255.0',
        'Network Address': '192.168.1.0',
        'Broadcast Address': '192.168.1.255',
        'Usable Host Range': '192.168.1.1 - 192.168.1.254',
        'Usable Hosts': '254',
      },
      walkthrough: ['Bitwise AND of 192.168.1.100 and 255.255.255.0 produces network address 192.168.1.0 with 254 usable hosts.'],
    },
    faqs: [
      {
        question: 'What is CIDR notation?',
        answer: 'Classless Inter-Domain Routing (CIDR) denotes the number of consecutive leading 1-bits in the subnet mask (e.g., /24 means 24 ones: 255.255.255.0).',
      },
    ],
    relatedToolSlugs: ['password-generator', 'unit-converter'],
    status: 'active',
  },

  // ==========================================
  // HOME & CONSTRUCTION CALCULATORS
  // ==========================================
  {
    id: 'concrete-calculator',
    name: 'Concrete Calculator',
    slug: 'concrete-calculator',
    category: 'property',
    subcategory: 'construction-renovation',
    description: 'Calculate concrete volume in cubic yards and cubic meters for slabs, footings, and cylindrical columns, plus pre-mix bag counts (60lb and 80lb).',
    shortDescription: 'Calculate concrete volume in cubic yards/meters and 60lb/80lb bag counts.',
    iconName: 'Layers',
    isPopular: true,
    synonyms: ['cement calculator', 'concrete volume', 'cubic yards of concrete', 'concrete bags calculator'],
    phrases: ['how many bags of concrete do I need', 'calculate cubic yards of concrete', 'concrete slab calculator'],
    seo: {
      title: 'Concrete Calculator | Cubic Yards, Meters & Bag Counts for Slabs',
      metaDescription: 'Calculate how much concrete you need in cubic yards, cubic meters, and 60-lb or 80-lb bags for slabs, footers, and columns.',
      keywords: ['concrete calculator', 'cubic yards', 'concrete bags', 'slab volume'],
    },
    formula: {
      expression: '\\text{Cubic Yards} = \\frac{L_{ft} \\times W_{ft} \\times (D_{in}/12)}{27}, \\quad \\text{Bags 80lb} = \\frac{\\text{Cubic Feet}}{0.60}',
      variables: [
        { symbol: 'L, W', explanation: 'Length and width in feet' },
        { symbol: 'D', explanation: 'Thickness/depth in inches' },
      ],
    },
    explanation: {
      summary: 'Determines the exact yardage required for ordering ready-mix trucks or purchasing bagged dry concrete at home improvement centers.',
      breakdown: [
        {
          title: 'The 10% Waste Factor',
          text: 'Always order 5% to 10% extra concrete to account for subgrade unevenness, spillage, and formwork deflection.',
        },
      ],
      considerations: ['Standard residential patios and walkways are typically poured 4 inches thick; driveways are poured 5 to 6 inches.'],
    },
    example: {
      title: '10 ft × 12 ft Patio Slab, 4 inches thick',
      description: 'Outdoor patio concrete slab.',
      inputs: {
        'Length': '10 Feet',
        'Width': '12 Feet',
        'Thickness': '4 Inches',
      },
      results: {
        'Volume': '1.48 Cubic Yards (1.13 m³)',
        'Cubic Feet': '40.0 cu ft',
        '80 lb Bags Needed': '67 Bags',
        '60 lb Bags Needed': '89 Bags',
      },
      walkthrough: ['10 × 12 × (4/12) = 40 cu ft. Divided by 27 = 1.48 cubic yards. Requires 67 bags of 80lb pre-mix.'],
    },
    faqs: [
      {
        question: 'When should I order a ready-mix truck instead of bags?',
        answer: 'Generally, jobs requiring more than 1 cubic yard (~45 to 60 bags) are much faster and more cost-effective when ordered via a ready-mix concrete truck.',
      },
    ],
    relatedToolSlugs: ['square-footage-calculator', 'paint-calculator', 'tile-calculator'],
    status: 'active',
  },
  {
    id: 'paint-calculator',
    name: 'Paint Calculator',
    slug: 'paint-calculator',
    category: 'property',
    subcategory: 'construction-renovation',
    description: 'Calculate gallons and liters of paint needed for room walls and ceilings, factoring in door and window deductions and multiple coats.',
    shortDescription: 'Calculate gallons and liters of paint needed with door/window deductions.',
    iconName: 'Paintbrush',
    isPopular: true,
    synonyms: ['wall paint calculator', 'how much paint do I need', 'room paint estimator', 'paint coverage'],
    phrases: ['how many gallons of paint for room', 'paint calculator square footage', 'paint coats estimator'],
    seo: {
      title: 'Paint Calculator | Gallons & Liters Needed for Room Walls & Ceilings',
      metaDescription: 'Calculate how many gallons or liters of paint you need to paint a room, deducting doors and windows and accounting for 1 or 2 coats.',
      keywords: ['paint calculator', 'paint gallons', 'room paint', 'paint coverage'],
    },
    formula: {
      expression: '\\text{Area} = 2(L + W) \\times H - \\text{Deductions}, \\quad \\text{Gallons} = \\frac{\\text{Area} \\times \\text{Coats}}{350}',
      variables: [
        { symbol: 'L, W, H', explanation: 'Room length, width, and ceiling height in feet' },
        { symbol: 'Deductions', explanation: 'Standard doors (~21 sq ft) and windows (~15 sq ft)' },
      ],
    },
    explanation: {
      summary: 'Estimates paint requirements based on the industry standard coverage benchmark of 350 to 400 square feet per gallon of paint.',
      breakdown: [
        {
          title: 'Why Two Coats?',
          text: 'Two coats provide uniform sheen, hide underlying imperfections, and ensure maximum paint durability and washability.',
        },
      ],
      considerations: ['Raw drywall or dramatic dark-to-light color changes require a dedicated primer coat first.'],
    },
    example: {
      title: '12 ft × 14 ft Bedroom, 8 ft ceiling, 2 doors, 2 windows, 2 coats',
      description: 'Standard bedroom repaint.',
      inputs: {
        'Dimensions': '12 ft length × 14 ft width × 8 ft height',
        'Doors & Windows': '2 Doors, 2 Windows',
        'Coats': '2 Coats',
      },
      results: {
        'Net Wall Area': '344 sq ft',
        'Total Paint Area': '688 sq ft',
        'Paint Needed': '2 Gallons (8 Liters)',
      },
      walkthrough: ['Gross wall area is 416 sq ft. Minus 72 sq ft deductions = 344 sq ft. Two coats require 2 gallons.'],
    },
    faqs: [
      {
        question: 'How much area does 1 gallon of paint cover?',
        answer: 'One standard gallon of interior latex paint covers approximately 350 to 400 square feet of smooth primed surface.',
      },
    ],
    relatedToolSlugs: ['square-footage-calculator', 'tile-calculator', 'concrete-calculator'],
    status: 'active',
  },
  {
    id: 'tile-calculator',
    name: 'Tile Calculator',
    slug: 'tile-calculator',
    category: 'property',
    subcategory: 'construction-renovation',
    description: 'Calculate the total number of floor or wall tiles and boxes needed, including waste percentage for cutting and layout pattern adjustments.',
    shortDescription: 'Calculate total floor/wall tiles and boxes needed including waste %.',
    iconName: 'Grid2X2',
    isPopular: false,
    synonyms: ['flooring tile calculator', 'ceramic tile estimator', 'how many tiles do I need', 'tile box calculator'],
    phrases: ['calculate tiles needed for floor', 'tile square footage with waste', 'how many boxes of tile'],
    seo: {
      title: 'Tile Calculator | Floor & Wall Tiles, Waste % & Box Estimator',
      metaDescription: 'Calculate how many floor or wall tiles and boxes you need for your renovation, factoring in tile size and cutting waste margin.',
      keywords: ['tile calculator', 'flooring tiles', 'tile boxes', 'renovation estimator'],
    },
    formula: {
      expression: '\\text{Tiles} = \\frac{\\text{Area}_{sqft} \\times (1 + \\text{Waste\\%})}{\\text{Tile Area}_{sqft}}, \\quad \\text{Boxes} = \\lceil \\text{Tiles} / \\text{PerBox} \\rceil',
      variables: [
        { symbol: 'Tile Area', explanation: 'Width in inches × Height in inches / 144' },
        { symbol: 'Waste%', explanation: 'Cutting margin (typically 10% for straight, 15% for diagonal/herringbone)' },
      ],
    },
    explanation: {
      summary: 'Accurately measures required tile volume and box purchases, preventing mid-project shortages that risk batch dye-lot color variations.',
      breakdown: [
        {
          title: 'The Cutting Waste Factor',
          text: 'Straight grid layouts require ~10% waste for perimeter cutting. Diagonal or herringbone patterns produce more cut scrap, requiring 15% extra.',
        },
      ],
      considerations: ['Keep an extra box of unopened tiles in storage after completion for future plumbing or tile repair needs.'],
    },
    example: {
      title: '10 ft × 12 ft Room with 12x12 inch tiles and 10% waste',
      description: 'Bathroom or kitchen tile floor.',
      inputs: {
        'Room Dimensions': '10 ft × 12 ft (120 sq ft)',
        'Tile Size': '12 in × 12 in (1 sq ft each)',
        'Waste Factor': '10%',
        'Tiles per Box': '10 Tiles',
      },
      results: {
        'Total Tiles with Waste': '132 Tiles',
        'Square Footage with Waste': '132 sq ft',
        'Boxes Needed': '14 Boxes',
      },
      walkthrough: ['120 sq ft area + 10% waste = 132 tiles. Packed 10 per box = 14 boxes total.'],
    },
    faqs: [
      {
        question: 'Why is it important to buy all tile from the same dye lot?',
        answer: 'Ceramic and porcelain tiles produced in different manufacturing runs can have subtle color and sizing variances even if labeled as the identical model.',
      },
    ],
    relatedToolSlugs: ['square-footage-calculator', 'paint-calculator', 'concrete-calculator'],
    status: 'active',
  },
  {
    id: 'room-area-calculator',
    name: 'Room Area Calculator',
    slug: 'room-area-calculator',
    category: 'property',
    subcategory: 'construction-renovation',
    description: 'Calculate floor square footage, total wall surface area, perimeter, and room air volume for renovation and furnishing.',
    shortDescription: 'Calculate floor area, wall surface area, perimeter, and cubic volume.',
    iconName: 'Square',
    isPopular: false,
    synonyms: ['floor area calculator', 'room square footage', 'perimeter calculator', 'room volume'],
    phrases: ['calculate square feet of a room', 'room perimeter and wall area', 'room volume cubic feet'],
    seo: {
      title: 'Room Area Calculator | Floor Sq Ft, Wall Area, Perimeter & Volume',
      metaDescription: 'Calculate the floor square footage, perimeter, wall surface area, and cubic volume for any rectangular room.',
      keywords: ['room area calculator', 'square footage', 'floor area', 'room dimensions'],
    },
    formula: {
      expression: '\\text{Floor} = L \\times W, \\quad \\text{Perimeter} = 2(L + W), \\quad \\text{Wall Area} = \\text{Perimeter} \\times H, \\quad \\text{Volume} = L \\times W \\times H',
      variables: [
        { symbol: 'L, W, H', explanation: 'Room length, width, and ceiling height' },
      ],
    },
    explanation: {
      summary: 'Provides the fundamental dimensional foundation required for purchasing flooring, baseboards, wallpaper, paint, and HVAC units.',
      breakdown: [
        {
          title: 'Flooring vs. Baseboard Trim',
          text: 'Flooring is purchased by square footage (Length × Width), while baseboards and crown molding are purchased by perimeter linear feet.',
        },
      ],
      considerations: ['For complex L-shaped rooms, divide the layout into two rectangles and sum their respective areas.'],
    },
    example: {
      title: '15 ft × 20 ft Living Room with 9 ft ceilings',
      description: 'Living room dimensions.',
      inputs: {
        'Length': '15 Feet',
        'Width': '20 Feet',
        'Ceiling Height': '9 Feet',
      },
      results: {
        'Floor Area': '300 sq ft (27.87 m²)',
        'Perimeter': '70 Linear Feet',
        'Gross Wall Area': '630 sq ft',
        'Room Volume': '2,700 cu ft',
      },
      walkthrough: ['15 × 20 = 300 sq ft floor. Perimeter: 2×(15+20) = 70 ft. Wall area: 70 × 9 = 630 sq ft.'],
    },
    faqs: [
      {
        question: 'How do you convert square feet to square meters?',
        answer: 'Divide the square footage by 10.764 to convert from square feet to square meters.',
      },
    ],
    relatedToolSlugs: ['square-footage-calculator', 'paint-calculator', 'tile-calculator'],
    status: 'active',
  },
  {
    id: 'construction-cost-calculator',
    name: 'Construction Cost Calculator',
    slug: 'construction-cost-calculator',
    category: 'property',
    additionalCategories: ['property'],
    subcategory: 'construction-renovation',
    description: 'Estimate home construction and renovation expenses broken down by civil structure, interior finishes, MEP services, and contingency reserves.',
    shortDescription: 'Estimate residential construction costs across civil, finishes, MEP, and contingency.',
    iconName: 'Construction',
    isPopular: false,
    synonyms: ['house building cost', 'renovation cost estimator', 'cost per square foot', 'home construction budget'],
    phrases: ['how much to build a house per square foot', 'construction cost breakdown', 'home renovation cost'],
    seo: {
      title: 'Construction Cost Calculator | Home Building & Renovation Estimator',
      metaDescription: 'Estimate new home construction and renovation expenses by square footage, quality grade tier, and structural vs finishes breakdown.',
      keywords: ['construction cost calculator', 'building cost', 'renovation budget', 'cost per sq ft'],
    },
    formula: {
      expression: '\\text{Cost} = \\text{Area} \\times \\text{Rate}_{tier} \\times \\text{Floors}, \\quad \\text{Civil} \\approx 50\\%, \\text{Finishes} \\approx 30\\%, \\text{MEP} \\approx 12\\%, \\text{Reserve} \\approx 8\\%',
      variables: [
        { symbol: 'Rate', explanation: 'Cost per unit area based on construction quality tier' },
      ],
    },
    explanation: {
      summary: 'Provides a structured benchmark cost model for residential construction, segmenting capital expenditure across structural engineering, finishes, and utilities.',
      breakdown: [
        {
          title: 'The Contingency Reserve',
          text: 'Unforeseen ground conditions, material price shifts, and design change-orders routinely emerge. A minimum 8-10% contingency buffer is essential.',
        },
      ],
      considerations: ['Estimates exclude raw land acquisition, legal zoning approvals, and architect design fees.'],
    },
    example: {
      title: '2,000 sq ft Standard Quality Home',
      description: 'Single-family residential construction budget.',
      inputs: {
        'Area': '2,000 sq ft',
        'Quality Tier': 'Standard ($150/sq ft)',
      },
      results: {
        'Total Estimated Budget': '$300,000',
        'Civil & Structural (50%)': '$150,000',
        'Finishes & Cabinetry (30%)': '$90,000',
        'Mechanical/Electrical/Plumbing (12%)': '$36,000',
        'Contingency Buffer (8%)': '$24,000',
      },
      walkthrough: ['2,000 sq ft at $150/sq ft yields a $300,000 baseline construction budget.'],
    },
    faqs: [
      {
        question: 'Why do construction costs vary so widely?',
        answer: 'Labor rates, municipal permit costs, foundation complexity, and material luxury tiers vary dramatically by geography and site conditions.',
      },
    ],
    relatedToolSlugs: ['concrete-calculator', 'mortgage-calculator', 'square-footage-calculator'],
    status: 'active',
  },
  {
    id: 'electricity-bill-calculator',
    name: 'Electricity Bill Calculator',
    slug: 'electricity-bill-calculator',
    category: 'home',
    subcategory: 'utilities',
    description: 'Calculate power consumption in kilowatt-hours (kWh) and estimate the monthly and annual cost of running any household appliance.',
    shortDescription: 'Calculate appliance kWh power consumption and monthly electricity costs.',
    iconName: 'Zap',
    isPopular: true,
    synonyms: ['power consumption calculator', 'kWh cost calculator', 'energy bill calculator', 'appliance running cost'],
    phrases: ['how much does it cost to run my AC', 'calculate electricity bill for appliance', 'kWh electricity cost'],
    seo: {
      title: 'Electricity Bill Calculator | Appliance kWh Consumption & Running Cost',
      metaDescription: 'Calculate the power consumption and electricity bill cost for any appliance based on wattage, daily usage hours, and kWh utility rates.',
      keywords: ['electricity bill calculator', 'kWh calculator', 'power consumption', 'energy cost'],
    },
    formula: {
      expression: '\\text{Daily kWh} = \\frac{\\text{Watts} \\times \\text{Hours}}{1000}, \\quad \\text{Monthly Cost} = \\text{Daily kWh} \\times 30 \\times \\text{Rate}_{per kWh}',
      variables: [
        { symbol: 'Watts', explanation: 'Appliance power rating in Watts' },
        { symbol: 'Hours', explanation: 'Daily operating hours' },
        { symbol: 'Rate', explanation: 'Utility tariff cost per kilowatt-hour' },
      ],
    },
    explanation: {
      summary: 'Translates appliance nameplate wattage and usage habits into predictable daily, monthly, and annual utility billing costs.',
      breakdown: [
        {
          title: 'High-Wattage Culprits',
          text: 'Heating and cooling appliances (air conditioners, space heaters, water heaters) consume 1,500 to 4,000 Watts and typically account for over 50% of home utility bills.',
        },
      ],
      considerations: ['Inverter appliances cycle on and off, averaging lower operational wattage than their peak rated capacity.'],
    },
    example: {
      title: '1,500W Space Heater running 6 hours/day at $0.16 per kWh',
      description: 'Winter heating cost analysis.',
      inputs: {
        'Wattage': '1,500 Watts',
        'Daily Usage': '6 Hours',
        'Tariff Rate': '$0.16 / kWh',
      },
      results: {
        'Daily Consumption': '9.0 kWh ($1.44 / day)',
        'Monthly Consumption': '270 kWh ($43.20 / month)',
        'Annual Cost': '$525.60',
      },
      walkthrough: ['1,500W × 6h / 1000 = 9 kWh/day. At $0.16/kWh, monthly running cost is $43.20.'],
    },
    faqs: [
      {
        question: 'What is a kilowatt-hour (kWh)?',
        answer: 'One kilowatt-hour (kWh) represents the energy consumed by using 1,000 Watts of electrical power continuously for one full hour.',
      },
    ],
    relatedToolSlugs: ['ac-btu-calculator', 'fuel-cost-calculator', 'room-area-calculator'],
    status: 'active',
  },
  {
    id: 'ac-btu-calculator',
    name: 'AC BTU Calculator',
    slug: 'ac-btu-calculator',
    category: 'home',
    subcategory: 'utilities',
    description: 'Calculate the required air conditioner cooling capacity in British Thermal Units (BTU/hr) and AC tonnage based on room dimensions, sunlight exposure, and occupancy.',
    shortDescription: 'Determine air conditioner BTU cooling capacity and AC tonnage for your room.',
    iconName: 'Wind',
    isPopular: false,
    synonyms: ['air conditioner size calculator', 'AC ton calculator', 'BTU calculator', 'HVAC sizing'],
    phrases: ['what size AC do I need for my room', 'calculate BTU for room', 'air conditioner tonnage calculator'],
    seo: {
      title: 'AC BTU Calculator | Air Conditioner Sizing & Tonnage Estimator',
      metaDescription: 'Find the right air conditioner size in BTU/hr and tons for your room, factoring in square footage, ceiling height, sunlight, and occupants.',
      keywords: ['AC BTU calculator', 'air conditioner size', 'HVAC sizing', 'AC tonnage'],
    },
    formula: {
      expression: '\\text{Base BTU} = \\text{Area}_{sqft} \\times 25, \\quad \\text{Adjusted} = \\text{Base} \\times \\text{SunFactor} + (\\text{Occupants} > 2 \\times 600)',
      variables: [
        { symbol: 'SunFactor', explanation: '0.90 for shaded rooms, 1.15 for sunny west-facing rooms' },
        { symbol: 'Tons', explanation: 'Total BTU / 12,000' },
      ],
    },
    explanation: {
      summary: 'Correctly sizes room air conditioning. An undersized unit runs constantly without cooling, while an oversized unit cools too quickly without properly dehumidifying.',
      breakdown: [
        {
          title: 'Understanding AC Tonnage',
          text: 'In HVAC terminology, 1 "Ton" of cooling capacity equals 12,000 BTU per hour (the historical rate of heat required to melt one ton of ice in 24 hours).',
        },
      ],
      considerations: ['Rooms with south- or west-facing panoramic glass require additional cooling capacity to combat solar heat gain.'],
    },
    example: {
      title: '16 ft × 20 ft Room (320 sq ft) with Sunny Exposure',
      description: 'Master bedroom or living room AC sizing.',
      inputs: {
        'Dimensions': '16 ft × 20 ft (320 sq ft)',
        'Ceiling Height': '8 Feet',
        'Sunlight': 'Sunny (+15%)',
        'Occupants': '2',
      },
      results: {
        'Required Cooling': '9,200 BTU/hr',
        'Recommended Unit': '1.0 Ton AC (or 9,000 - 10,000 BTU split unit)',
      },
      walkthrough: ['320 sq ft × 25 = 8,000 base BTU. +15% sun adjustment = 9,200 BTU, comfortably served by a 1.0 Ton AC.'],
    },
    faqs: [
      {
        question: 'What happens if an air conditioner is too large for the room?',
        answer: 'An oversized AC quickly drops temperature and shuts off ("short cycling") before extracting humidity from the air, leaving the room feeling cold and clammy.',
      },
    ],
    relatedToolSlugs: ['electricity-bill-calculator', 'room-area-calculator', 'square-footage-calculator'],
    status: 'active',
  },
];
