import { ToolMetadata } from '../types/calculator';
import { EXPANDED_TOOLS } from './expandedToolsRegistry';

const BASE_TOOLS: ToolMetadata[] = [
  {
    id: 'interest-between-dates-calculator',
    name: 'Interest Between Dates Calculator',
    slug: 'interest-between-dates-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Calculate exact interest accrued between any two calendar dates with dual rate input methods: percentage per year (% p.a.) or amount per ₹100 per month (traditional Byaj / Vaddi).',
    shortDescription: 'Compute date-range interest with % per year or per ₹100/month rate methods.',
    iconName: 'CalendarDays',
    isPopular: true,
    isFeatured: true,
    synonyms: [
      'interest between dates',
      'date to date interest calculator',
      'vaddi calculator',
      'byaj calculator',
      'rupees per hundred per month',
      'interest for date range',
      'loan interest between dates',
    ],
    phrases: [
      'calculate interest between two dates',
      'interest from date to date',
      '2 rupees per 100 per month interest',
      'vaddi calculation between dates',
      'byaj calculator with start and end date',
    ],
    seo: {
      title: 'Interest Between Dates Calculator - % per Year & Per ₹100 per Month',
      metaDescription: 'Free online interest between dates calculator. Calculate interest from start date to end date using annual percentage or rupees per ₹100 per month (byaj/vaddi).',
      keywords: ['interest between dates', 'date to date interest calculator', 'vaddi calculator', 'byaj calculator', 'rupees per 100 interest', 'interest calculator'],
    },
    formula: {
      expression: 'I = P \\cdot r_{annual} \\cdot \\frac{d}{365}',
      variables: [
        { symbol: 'P', explanation: 'Principal Amount' },
        { symbol: 'r_{annual}', explanation: 'Normalized Annual Rate in Decimal (e.g. 24% = 0.24, ₹2 per ₹100/mo = 24% p.a.)' },
        { symbol: 'd', explanation: 'Total Number of Days between Start Date and End Date' },
      ],
      notes: 'For per ₹100 per month rate, Annual Rate % = Monthly Rate × 12. (e.g., ₹2 per ₹100/mo = 2% per month = 24% per year).',
    },
    explanation: {
      summary: 'This calculator computes the exact interest accrued over a specific chronological timeframe between two calendar dates. It natively supports two distinct rate input methods: standard annual percentage (% per year) and monthly rupee rate (amount per ₹100 per month, commonly known as Byaj or Vaddi).',
      breakdown: [
        {
          title: 'Dual Mutually Exclusive Rate Input Methods',
          text: 'You can enter the rate as either an annual percentage (e.g., 24% per year) or as an amount per ₹100 per month (e.g., ₹2 per ₹100 per month). The tool converts ₹ per ₹100/mo into an equivalent annual rate transparently by multiplying the monthly rate by 12.',
        },
        {
          title: 'Exact Calendar Duration Decomposition',
          text: 'The calculator decomposes the elapsed duration into exact calendar years, months, and days, as well as total absolute days, ensuring precision across leap years and variable month lengths.',
        },
        {
          title: 'Full Calculation Transparency',
          text: 'Both the original entered rate and the normalized annual calculation rate used by the engine are clearly displayed side-by-side with step-by-step math breakdowns.',
        },
      ],
      considerations: [
        '₹1 per ₹100 per month equals 12% per year.',
        '₹1.5 per ₹100 per month equals 18% per year.',
        '₹2 per ₹100 per month equals 24% per year.',
        '₹2.5 per ₹100 per month equals 30% per year.',
        '₹3 per ₹100 per month equals 36% per year.',
      ],
    },
    example: {
      title: 'Sample ₹1,00,000 for 1 Year at ₹2 per ₹100 per month',
      description: 'Calculating interest on a ₹1 Lakh loan at 2 rupees interest per month over a 1-year period.',
      inputs: {
        'Principal Amount': '₹1,00,000',
        'Start Date': '2024-01-01',
        'End Date': '2025-01-01',
        'Interest Rate Method': 'Per ₹100 per month',
        'Entered Rate': '₹2 per ₹100 per month',
      },
      results: {
        'Equivalent Annual Rate': '24% per year',
        'Total Duration': '1 Year (366 Days)',
        'Total Interest': '₹24,065.75',
        'Total Repayment': '₹1,24,065.75',
      },
      walkthrough: [
        'Step 1: ₹2 per ₹100 per month = 2% monthly rate = 24% annual rate (0.24 decimal).',
        'Step 2: Total elapsed days between 2024-01-01 and 2025-01-01 = 366 days (leap year).',
        'Step 3: Simple Interest = 100,000 × 0.24 × (366 / 365) = ₹24,065.75.',
        'Step 4: Total Amount = ₹1,00,000 + ₹24,065.75 = ₹1,24,065.75.',
      ],
    },
    faqs: [
      {
        question: 'What does "₹2 per ₹100 per month" interest rate mean?',
        answer: 'It means ₹2 interest is charged every month for every ₹100 of principal borrowed. This equals a 2% monthly interest rate, which converts to 24% per year (2% × 12 months = 24% p.a.).',
      },
      {
        question: 'How is date difference calculated?',
        answer: 'The system measures the exact number of calendar days between your start date and end date, taking into account leap years and months with 28, 29, 30, or 31 days.',
      },
      {
        question: 'Can I include the end date in the calculation?',
        answer: 'Yes. Checking "Include end date" treats both the start date and end date as full active days (adding 1 day to the total span).',
      },
      {
        question: 'Can I calculate compound interest between dates as well?',
        answer: 'Yes. Under Calculation Settings, you can switch from Simple Interest to Compound Interest with monthly, quarterly, or yearly compounding frequency.',
      },
    ],
    relatedToolSlugs: [
      'simple-interest-calculator',
      'compound-interest-calculator',
      'emi-calculator',
      'savings-goal-calculator',
    ],
    status: 'active',
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Calculate your exact Equated Monthly Installment (EMI) for home, personal, car, or education loans with interactive amortization schedules and principal vs interest charts.',
    shortDescription: 'Calculate monthly loan repayments, total interest, and amortized balances.',
    iconName: 'CalendarClock',
    isPopular: true,
    isFeatured: true,
    synonyms: [
      'monthly loan payment',
      'loan emi',
      'monthly installment',
      'loan repayment',
      'amortization schedule',
      'debt payment',
      'bank loan installment',
    ],
    phrases: [
      'monthly loan payment',
      'how much is my monthly installment',
      'calculate my car loan emi',
      'personal loan interest monthly',
      'loan balance payoff schedule',
    ],
    seo: {
      title: 'EMI Calculator - Equated Monthly Installment & Amortization Schedule',
      metaDescription: 'Free online EMI calculator. Compute monthly loan payments, total interest payable, principal payoff breakdown, and view year-by-year amortization charts.',
      keywords: ['emi calculator', 'loan calculator', 'monthly installment', 'amortization table', 'interest calculator'],
    },
    formula: {
      expression: 'EMI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Principal Loan Amount (the total borrowed money)' },
        { symbol: 'r', explanation: 'Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)' },
        { symbol: 'n', explanation: 'Loan Tenure in total months (Years × 12)' },
      ],
      notes: 'If the interest rate is 0%, EMI is simply Principal (P) divided by number of months (n).',
    },
    explanation: {
      summary: 'An Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified calendar date each month. Each EMI is divided into paying off both the accrued interest and the principal debt.',
      breakdown: [
        {
          title: 'Initial Payments Heavily Weighted Towards Interest',
          text: 'In the early years of any long-term loan, the outstanding principal balance is at its highest. As a result, the majority of your monthly installment goes toward interest, while only a small portion reduces the principal.',
        },
        {
          title: 'Gradual Principal Acceleration',
          text: 'Over time, as the remaining principal balance shrinks, the monthly interest charge decreases proportionately, allowing a larger share of each EMI to directly clear your debt balance.',
        },
        {
          title: 'Impact of Loan Tenure',
          text: 'Selecting a longer tenure reduces your monthly commitment, making cash flow manageable, but significantly increases the cumulative interest paid over the life of the loan.',
        },
      ],
      considerations: [
        'Prepaying even 5-10% of principal early in the loan can shave multiple years off your tenure.',
        'Always account for one-time processing fees, insurance charges, and prepayment penalty terms in your loan contract.',
        'Lenders may use daily-reducing or monthly-reducing balance calculations.',
      ],
    },
    example: {
      title: 'Sample ₹25 Lakh Home Loan at 8.5% for 20 Years',
      description: 'Understanding an everyday scenario of purchasing an apartment with a 20-year mortgage.',
      inputs: {
        'Loan Amount': '₹25,00,000',
        'Interest Rate': '8.5% p.a.',
        'Tenure': '20 Years (240 Months)',
      },
      results: {
        'Monthly EMI': '₹21,696',
        'Total Interest Paid': '₹27,06,940',
        'Total Repayment': '₹52,06,940',
      },
      walkthrough: [
        'Step 1: Monthly interest rate r = 8.5 / 12 / 100 = 0.0070833',
        'Step 2: Total payment periods n = 20 × 12 = 240 months',
        'Step 3: Compounding factor (1 + 0.0070833)^240 = 5.40938',
        'Step 4: EMI = 2,500,000 × 0.0070833 × 5.40938 ÷ (5.40938 - 1) = ₹21,696 per month',
        'Step 5: Total interest = (21,696 × 240) - 2,500,000 = ₹27,06,940',
      ],
    },
    faqs: [
      {
        question: 'What happens if I make a partial prepayment toward my loan?',
        answer: 'Partial prepayments directly reduce your outstanding principal balance. You can choose to either reduce your monthly EMI while keeping the tenure constant, or maintain the current EMI and significantly shorten the loan duration to save on total interest.',
      },
      {
        question: 'Does this calculation include processing fees and property taxes?',
        answer: 'No. This calculator isolates the core financial amortization schedule between principal and interest. Banks typically charge a 0.25% to 1.0% processing fee, documentation charges, and applicable local taxes separately.',
      },
      {
        question: 'What is the difference between fixed and floating interest rates?',
        answer: 'A fixed interest rate remains unchanged throughout your loan tenure, keeping your EMI constant. A floating rate changes with central bank benchmarks (like RBI repo rate or US Federal Reserve rate), meaning your EMI or loan duration may adjust periodically.',
      },
      {
        question: 'Is EMI calculated on a monthly reducing balance or flat rate?',
        answer: 'Modern consumer and home loans standardly use a monthly reducing balance method, where interest is charged only on the outstanding principal at the beginning of each month. Flat rate loans charge interest on the entire original principal for the full duration, resulting in a substantially higher effective interest rate.',
      },
    ],
    relatedToolSlugs: ['home-loan-calculator', 'sip-calculator', 'compound-interest-calculator', 'salary-calculator'],
    status: 'active',
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    category: 'finance',
    subcategory: 'investments',
    description: 'Calculate wealth accumulation through Systematic Investment Plans (SIP) in mutual funds or index funds with compounding estimates and yearly breakdown.',
    shortDescription: 'Estimate wealth growth and returns from disciplined monthly mutual fund investments.',
    iconName: 'TrendingUp',
    isPopular: true,
    isFeatured: true,
    synonyms: ['systematic investment plan', 'mutual fund returns', 'monthly investment', 'wealth builder', 'index fund calculator'],
    phrases: ['how much will my sip be worth', 'mutual fund monthly return', 'sip return calculator', 'invest 5000 a month'],
    seo: {
      title: 'SIP Calculator - Systematic Investment Plan Mutual Fund Returns',
      metaDescription: 'Calculate maturity amount and wealth gained from your monthly SIP investments. Compare invested capital vs estimated returns with interactive visual charts.',
      keywords: ['sip calculator', 'mutual fund returns', 'systematic investment', 'wealth growth', 'investment calculator'],
    },
    formula: {
      expression: 'M = P \\cdot \\left(\\frac{(1 + i)^n - 1}{i}\\right) \\cdot (1 + i)',
      variables: [
        { symbol: 'M', explanation: 'Expected Maturity Amount' },
        { symbol: 'P', explanation: 'Monthly SIP Investment Amount' },
        { symbol: 'i', explanation: 'Periodic Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)' },
        { symbol: 'n', explanation: 'Total Number of Monthly Installments' },
      ],
      notes: 'Assumes continuous regular monthly deposits made at the beginning of each cycle.',
    },
    explanation: {
      summary: 'A Systematic Investment Plan allows investors to allocate a fixed sum into mutual funds or index instruments at regular intervals, harnessing Rupee Cost Averaging and compound interest.',
      breakdown: [
        {
          title: 'Rupee Cost Averaging',
          text: 'When markets drop, your fixed monthly allocation buys more fund units. When markets surge, it buys fewer units, averaging out market volatility over long horizons.',
        },
        {
          title: 'The Compounding Snowball',
          text: 'In the first 5 years, your principal contribution represents most of your portfolio. By years 15-20, generated returns eclipse total invested capitalหลาย times over.',
        },
      ],
      considerations: [
        'Mutual fund returns fluctuate with market conditions and are not guaranteed like fixed bank deposits.',
        'Consider stepping up your SIP by 10% each year as your income grows to dramatically increase final wealth.',
      ],
    },
    example: {
      title: '₹10,000 Monthly SIP for 15 Years at 12% p.a.',
      description: 'Long-term equity investment projection.',
      inputs: {
        'Monthly Investment': '₹10,000',
        'Expected Return Rate': '12% p.a.',
        'Time Horizon': '15 Years',
      },
      results: {
        'Total Amount Invested': '₹18,00,000',
        'Estimated Wealth Gained': '₹32,45,760',
        'Total Maturity Value': '₹50,45,760',
      },
      walkthrough: [
        'Step 1: Total invested = ₹10,000 × 180 months = ₹18,00,000',
        'Step 2: Monthly growth rate i = 12 / 12 / 100 = 0.01',
        'Step 3: Compounding power multiplies portfolio to ₹50,45,760',
        'Step 4: Net capital gain is ₹32,45,760 (~180% return on invested principal)',
      ],
    },
    faqs: [
      {
        question: 'Is SIP better than Lump Sum investment?',
        answer: 'SIP is generally preferred for salaried individuals because it eliminates the risk of trying to time the market, provides emotional discipline, and takes advantage of market dips automatically.',
      },
      {
        question: 'Can I pause or stop my SIP anytime?',
        answer: 'Yes, mutual fund SIPs are flexible. You can pause, modify, or redeem your units without penalty unless the fund has an initial exit load period (typically 1 year).',
      },
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'emi-calculator', 'savings-goal-calculator'],
    status: 'active',
  },
  {
    id: 'fd-calculator',
    name: 'FD Calculator',
    slug: 'fd-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Calculate Fixed Deposit (FD) maturity value, total interest earned, effective yield, and year-wise compounding schedules for bank fixed deposits.',
    shortDescription: 'Calculate fixed deposit maturity value, interest earned, and quarterly compounding yield.',
    iconName: 'Landmark',
    isPopular: true,
    isFeatured: true,
    synonyms: [
      'fixed deposit calculator',
      'fd calculator',
      'bank fd return',
      'fd maturity calculator',
      'term deposit calculator',
      'fixed deposit interest rate',
    ],
    phrases: [
      'calculate my fixed deposit maturity value',
      'bank fd interest rate calculation',
      'fd return after 5 years',
      'how much interest on 1 lakh fd',
    ],
    seo: {
      title: 'FD Calculator - Fixed Deposit Maturity Value & Interest Estimator',
      metaDescription: 'Free online FD calculator. Calculate fixed deposit maturity amount, quarterly compounding interest earned, and effective annual yield with year-by-year schedules.',
      keywords: ['fd calculator', 'fixed deposit calculator', 'bank fd', 'fd maturity amount', 'fixed deposit interest'],
    },
    formula: {
      expression: 'A = P \\cdot \\left(1 + \\frac{r}{n}\\right)^{n \\cdot t}',
      variables: [
        { symbol: 'A', explanation: 'Final Maturity Amount' },
        { symbol: 'P', explanation: 'Principal Fixed Deposit Amount' },
        { symbol: 'r', explanation: 'Annual Interest Rate (in decimal)' },
        { symbol: 'n', explanation: 'Compounding frequency per year (default 4 = Quarterly for bank FDs)' },
        { symbol: 't', explanation: 'Deposit tenure in years (Total Months ÷ 12)' },
      ],
    },
    explanation: {
      summary: 'A Fixed Deposit (FD) is a financial instrument provided by banks and NBFCs which provides investors a higher rate of interest than a regular savings account until the given maturity date.',
      breakdown: [
        {
          title: 'Quarterly Compounding Standard',
          text: 'Most commercial banks compound FD interest on a quarterly basis (4 times per year), meaning accrued interest is reinvested every 3 months.',
        },
        {
          title: 'Guaranteed Capital Preservation',
          text: 'Unlike market-linked instruments (mutual funds/stocks), fixed deposits guarantee your principal and promised interest return upon maturity.',
        },
      ],
      considerations: [
        'FD interest is taxable according to your income tax bracket.',
        'Senior citizens usually receive an additional 0.50% interest rate premium on bank FDs.',
      ],
    },
    example: {
      title: '₹1,00,000 FD for 3 Years at 7.5% p.a. (Quarterly Compounded)',
      description: 'Standard bank fixed deposit calculation.',
      inputs: {
        'Principal Amount': '₹1,00,000',
        'Interest Rate': '7.5% p.a.',
        'Tenure': '3 Years',
        'Compounding': 'Quarterly',
      },
      results: {
        'Deposit Principal': '₹1,00,000',
        'Total Interest Earned': '₹24,972',
        'Maturity Value': '₹1,24,972',
      },
      walkthrough: [
        'Step 1: P = 1,00,000, r = 0.075, n = 4, t = 3',
        'Step 2: A = 100,000 × (1 + 0.075/4)^(4 × 3) = 100,000 × (1.01875)^12',
        'Step 3: Maturity Value = ₹1,24,972',
        'Step 4: Total Interest = ₹1,24,972 - ₹1,00,000 = ₹24,972',
      ],
    },
    relatedToolSlugs: ['rd-calculator', 'sip-calculator', 'compound-interest-calculator', 'simple-interest-calculator'],
    status: 'active',
  },
  {
    id: 'rd-calculator',
    name: 'RD Calculator',
    slug: 'rd-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Calculate Recurring Deposit (RD) maturity amount, total interest earned, monthly accumulation schedules, and effective annual yield for monthly bank savings.',
    shortDescription: 'Calculate recurring deposit maturity value, monthly savings accumulation, and interest earned.',
    iconName: 'Coins',
    isPopular: true,
    isFeatured: true,
    synonyms: [
      'recurring deposit calculator',
      'rd calculator',
      'bank rd return',
      'monthly deposit calculator',
      'post office rd calculator',
    ],
    phrases: [
      'calculate my recurring deposit maturity value',
      'monthly rd interest rate calculation',
      'how much interest on 5000 monthly rd',
    ],
    seo: {
      title: 'RD Calculator - Recurring Deposit Maturity Value & Interest Estimator',
      metaDescription: 'Free online RD calculator. Calculate recurring deposit maturity value, cumulative monthly deposits, interest earned, and quarterly compounding yield.',
      keywords: ['rd calculator', 'recurring deposit calculator', 'bank rd', 'rd maturity amount', 'monthly deposit interest'],
    },
    formula: {
      expression: 'M = \\sum_{k=1}^{N} P \\cdot \\left(1 + \\frac{r}{n}\\right)^{\\frac{(N - k + 1) \\cdot n}{12}}',
      variables: [
        { symbol: 'M', explanation: 'Total Maturity Value' },
        { symbol: 'P', explanation: 'Monthly Deposit Installment' },
        { symbol: 'r', explanation: 'Annual Interest Rate (in decimal)' },
        { symbol: 'n', explanation: 'Compounding frequency per year (default 4 = Quarterly)' },
        { symbol: 'N', explanation: 'Total number of monthly installments (Tenure in months)' },
      ],
    },
    explanation: {
      summary: 'A Recurring Deposit (RD) is a special term deposit offered by banks which helps people with regular incomes to deposit a fixed amount every month into their RD account and earn interest at rates applicable to Fixed Deposits.',
      breakdown: [
        {
          title: 'Disciplined Monthly Savings',
          text: 'Unlike an FD which requires a lump sum upfront, an RD builds wealth over time through fixed monthly contributions.',
        },
        {
          title: 'Quarterly Compounding Mechanism',
          text: 'Earlier monthly deposits earn interest for longer periods than later deposits, with interest compounded quarterly.',
        },
      ],
      considerations: [
        'Delayed or missed monthly RD payments may attract a small penalty fee from the bank.',
      ],
    },
    example: {
      title: '₹5,000 Monthly RD for 3 Years (36 Months) at 7.0% p.a.',
      description: '3-year recurring deposit calculation.',
      inputs: {
        'Monthly Deposit': '₹5,000',
        'Interest Rate': '7.0% p.a.',
        'Tenure': '36 Months',
      },
      results: {
        'Total Deposited': '₹1,80,000',
        'Total Interest Earned': '₹20,909',
        'Maturity Value': '₹2,00,909',
      },
      walkthrough: [
        'Step 1: Total 36 installments of ₹5,000 = ₹1,80,000 total principal',
        'Step 2: Installments compound quarterly based on remaining months',
        'Step 3: Total Interest Earned = ₹20,909',
        'Step 4: Final Maturity Value = ₹2,00,909',
      ],
    },
    relatedToolSlugs: ['fd-calculator', 'sip-calculator', 'compound-interest-calculator'],
    status: 'active',
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    slug: 'compound-interest-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Calculate interest earned on principal plus accumulated interest over time with flexible compounding frequencies: annually, quarterly, monthly, or daily.',
    shortDescription: 'Project the exponential growth of your savings and investment deposits.',
    iconName: 'ChartNoAxesCombined',
    isPopular: true,
    isFeatured: true,
    synonyms: ['compound interest', 'exponential growth', 'interest on interest', 'savings growth', 'fd return'],
    phrases: ['how does compound interest work', 'calculate interest compounding quarterly', 'savings growth calculator'],
    seo: {
      title: 'Compound Interest Calculator - Future Value & Savings Growth',
      metaDescription: 'Accurately calculate compound interest over time. Choose annual, quarterly, or monthly compounding with detailed year-by-year balance tables.',
      keywords: ['compound interest calculator', 'future value', 'interest calculator', 'savings growth'],
    },
    formula: {
      expression: 'A = P \\cdot \\left(1 + \\frac{r}{n}\\right)^{n \\cdot t}',
      variables: [
        { symbol: 'A', explanation: 'Final Accrued Amount (Principal + Interest)' },
        { symbol: 'P', explanation: 'Initial Principal Deposit' },
        { symbol: 'r', explanation: 'Annual Nominal Interest Rate (in decimal)' },
        { symbol: 'n', explanation: 'Compounding frequency per year (1=annual, 4=quarterly, 12=monthly)' },
        { symbol: 't', explanation: 'Time the money is invested in years' },
      ],
    },
    explanation: {
      summary: 'Compound interest is the addition of interest to the principal sum of a loan or deposit, or in other words, interest on interest.',
      breakdown: [
        {
          title: 'The Compounding Frequency Factor',
          text: 'The more frequently interest is compounded (e.g., quarterly vs annually), the higher the effective annual yield because interest starts generating returns sooner.',
        },
      ],
      considerations: ['Account for taxes and inflation to understand your real purchasing power over 10+ years.'],
    },
    example: {
      title: '₹5,00,000 at 7.5% Compounded Quarterly for 10 Years',
      description: 'Typical fixed bank deposit growth scenario.',
      inputs: {
        'Initial Deposit': '₹5,00,000',
        'Interest Rate': '7.5%',
        'Compounding': 'Quarterly (4 times/yr)',
        'Tenure': '10 Years',
      },
      results: {
        'Final Balance': '₹10,51,175',
        'Total Interest Earned': '₹5,51,175',
      },
      walkthrough: [
        'In 10 years at 7.5% quarterly compounding, your money more than doubles without any additional deposits.',
      ],
    },
    faqs: [
      {
        question: 'What is the Rule of 72?',
        answer: 'The Rule of 72 is a quick mental shortcut to estimate how many years it takes to double your money. Divide 72 by your annual interest rate. For example, at 8% return, money doubles in approximately 72 ÷ 8 = 9 years.',
      },
    ],
    relatedToolSlugs: ['sip-calculator', 'emi-calculator', 'savings-goal-calculator'],
    status: 'active',
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'math',
    additionalCategories: ['education', 'everyday'],
    subcategory: 'basic-math',
    description: 'Solve common percentage calculations instantly: percentage of a number, what percent one number is of another, and percentage increase or decrease.',
    shortDescription: 'Quickly compute percentages, proportions, and percentage changes.',
    iconName: 'Percent',
    isPopular: true,
    isFeatured: true,
    synonyms: ['percent calc', 'percentage increase', 'percent difference', 'math percent', 'proportion calculator'],
    phrases: ['20 percent of 5000', 'what percentage is 45 of 200', 'calculate percentage increase from 100 to 150'],
    seo: {
      title: 'Percentage Calculator - Fast & Accurate Percentage Tools',
      metaDescription: 'Free online percentage calculator. Calculate percentage of a number, percentage change, and proportions with instant formula step breakdowns.',
      keywords: ['percentage calculator', 'percent of number', 'percentage change', 'percentage decrease'],
    },
    formula: {
      expression: '\\text{Percentage} = \\left(\\frac{\\text{Part}}{\\text{Whole}}\\right) \\times 100',
      variables: [
        { symbol: 'Part', explanation: 'The subset amount' },
        { symbol: 'Whole', explanation: 'The total reference amount' },
      ],
    },
    explanation: {
      summary: 'Percentages represent a fraction of 100. They are widely used in finance, taxes, shopping discounts, health metrics, and academic statistics.',
      breakdown: [
        {
          title: 'Percentage Change',
          text: 'Percentage change compares the absolute difference between new and old values relative to the original base value.',
        },
      ],
      considerations: ['A 50% increase followed by a 50% decrease does NOT bring you back to the start! Example: 100 + 50% = 150; 150 - 50% = 75.'],
    },
    example: {
      title: '20% of 5,000',
      description: 'Calculating a standard commission or tip.',
      inputs: {
        'Percentage': '20%',
        'Value': '5,000',
      },
      results: {
        'Answer': '1,000',
      },
      walkthrough: [
        'Step 1: Convert 20% to decimal: 20 ÷ 100 = 0.20',
        'Step 2: Multiply by total value: 0.20 × 5000 = 1,000',
      ],
    },
    faqs: [
      {
        question: 'Why does a price reduction need a higher percentage increase to recover?',
        answer: 'Because the reduction lowers your starting base. If a stock drops 20% from $100 to $80, it requires a 25% gain ($20 gain on $80 base) to return to $100.',
      },
    ],
    relatedToolSlugs: ['discount-calculator', 'emi-calculator', 'fuel-cost-calculator'],
    status: 'active',
  },
  {
    id: 'discount-calculator',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    category: 'shopping',
    subcategory: 'discounts',
    description: 'Calculate the discounted price, total savings, and final price including sales tax or additional promotional coupons.',
    shortDescription: 'Find your final price after sales discounts and tax.',
    iconName: 'BadgePercent',
    isPopular: true,
    isFeatured: true,
    synonyms: ['sale price', 'markdown calculator', 'shopping discount', 'coupon savings', 'retail discount'],
    phrases: ['30 percent off 80 dollars', 'how much do i save on sale', 'discount with sales tax'],
    seo: {
      title: 'Discount Calculator - Sale Price & Savings Finder',
      metaDescription: 'Calculate discounted sale prices and total cash savings. Add sales tax percentages to see the exact out-of-pocket register total.',
      keywords: ['discount calculator', 'sale price calculator', 'savings calculator', 'coupon calculator'],
    },
    formula: {
      expression: '\\text{Final Price} = (\\text{Original Price} - \\text{Discount Amount}) + \\text{Tax}',
      variables: [
        { symbol: 'Discount Amount', explanation: 'Original Price × (Discount % ÷ 100)' },
        { symbol: 'Tax', explanation: 'Price After Discount × (Tax % ÷ 100)' },
      ],
    },
    explanation: {
      summary: 'A discount calculator helps consumers and retailers determine true out-of-pocket costs during sales, clearance promotions, or multi-tier pricing campaigns.',
      breakdown: [
        {
          title: 'Understanding Stacking Discounts',
          text: 'When a store advertises "30% off plus an extra 20% at checkout", the second 20% applies to the already discounted price, not the original sticker price.',
        },
      ],
      considerations: ['Sales tax in most regions is charged on the post-discount subtotal, saving you extra tax.'],
    },
    example: {
      title: '₹3,000 Jacket with 35% Discount and 5% GST',
      description: 'Retail clearance shopping calculation.',
      inputs: {
        'Original Price': '₹3,000',
        'Discount': '35%',
        'Sales Tax': '5%',
      },
      results: {
        'Savings': '₹1,050',
        'Discounted Price': '₹1,950',
        'Final Checkout Total': '₹2,047.50',
      },
      walkthrough: [
        'Discount = 3,000 × 0.35 = ₹1,050 savings',
        'Subtotal = 3,000 - 1,050 = ₹1,950',
        'Tax = 1,950 × 0.05 = ₹97.50',
        'Final Total = ₹2,047.50',
      ],
    },
    faqs: [
      {
        question: 'Is "Buy 1 Get 1 Free" a 50% discount?',
        answer: 'Yes, Buy 1 Get 1 Free is mathematically equivalent to 50% off two items of equal value. Buy 2 Get 1 Free equals a 33.3% discount on the total bundle.',
      },
    ],
    relatedToolSlugs: ['percentage-calculator', 'currency-converter', 'salary-calculator'],
    status: 'active',
  },
  {
    id: 'fuel-cost-calculator',
    name: 'Fuel Cost Calculator',
    slug: 'fuel-cost-calculator',
    category: 'vehicles',
    additionalCategories: ['travel'],
    subcategory: 'fuel-running-cost',
    description: 'Calculate fuel expenses for daily commutes or road trips. Estimate total liters needed, cost per kilometer/mile, and split costs among passengers.',
    shortDescription: 'Calculate petrol/diesel expenses and split trip costs easily.',
    iconName: 'Fuel',
    isPopular: true,
    isFeatured: true,
    synonyms: ['petrol cost', 'gas mileage', 'trip fuel calculator', 'road trip cost', 'diesel expense', 'fuel economy'],
    phrases: ['petrol cost for 500 km', 'how much gas for road trip', 'split fuel cost with friends'],
    seo: {
      title: 'Fuel Cost Calculator - Estimate Trip Expenses & Gas Mileage',
      metaDescription: 'Calculate total fuel cost for your trip. Enter distance, fuel efficiency, and price per liter/gallon to split costs fairly among passengers.',
      keywords: ['fuel cost calculator', 'petrol cost', 'trip calculator', 'gas cost calculator', 'fuel economy'],
    },
    formula: {
      expression: '\\text{Total Cost} = \\left(\\frac{\\text{Distance}}{\\text{Fuel Efficiency}}\\right) \\times \\text{Price per Unit}',
      variables: [
        { symbol: 'Distance', explanation: 'Total distance planned (km or miles)' },
        { symbol: 'Fuel Efficiency', explanation: 'Vehicle consumption rate (km/liter or MPG)' },
        { symbol: 'Price', explanation: 'Local fuel price per liter or gallon' },
      ],
    },
    explanation: {
      summary: 'Trip fuel calculators remove guesswork when budgeting for highway road trips, ridesharing reimbursements, or comparing public transit vs driving.',
      breakdown: [
        {
          title: 'Highway vs City Driving',
          text: 'Highway driving usually yields 15-25% better fuel efficiency than stop-and-go city traffic with idling.',
        },
      ],
      considerations: ['Remember to include highway toll charges and parking fees alongside fuel expenses.'],
    },
    example: {
      title: '600 km Road Trip with 4 Friends',
      description: 'Weekend getaway fuel budget.',
      inputs: {
        'Distance': '600 km',
        'Mileage': '15 km/liter',
        'Petrol Price': '₹102 / liter',
        'Passengers': '4 people',
      },
      results: {
        'Fuel Needed': '40 Liters',
        'Total Cost': '₹4,080',
        'Cost Per Person': '₹1,020',
      },
      walkthrough: [
        'Fuel needed = 600 ÷ 15 = 40 Liters',
        'Total fuel cost = 40 × 102 = ₹4,080',
        'Per person share = 4,080 ÷ 4 = ₹1,020',
      ],
    },
    faqs: [
      {
        question: 'How does tire pressure affect fuel consumption?',
        answer: 'Under-inflated tires increase rolling resistance. Proper tire inflation can improve your vehicle fuel efficiency by 2% to 4%.',
      },
    ],
    relatedToolSlugs: ['car-loan-calculator', 'percentage-calculator', 'currency-converter'],
    status: 'active',
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    category: 'date-time',
    subcategory: 'calendars',
    description: 'Calculate your exact age in years, months, days, hours, and minutes from your date of birth, plus a countdown to your next birthday.',
    shortDescription: 'Find exact age, total days lived, and countdown to next birthday.',
    iconName: 'Cake',
    isPopular: true,
    isFeatured: true,
    synonyms: ['date of birth calculator', 'how old am i', 'dob calculator', 'days alive', 'birthday countdown'],
    phrases: ['how old am i in days', 'exact age calculator', 'calculate age between two dates'],
    seo: {
      title: 'Age Calculator - Find Exact Age in Years, Months, and Days',
      metaDescription: 'Free online Age Calculator. Determine exact chronological age from date of birth, total weeks/days lived, and see days left until your next birthday.',
      keywords: ['age calculator', 'dob calculator', 'chronological age', 'birthday calculator'],
    },
    formula: {
      expression: '\\text{Age} = \\text{Target Date} - \\text{Birth Date}',
      variables: [
        { symbol: 'Target Date', explanation: 'Today or specified reference date' },
        { symbol: 'Birth Date', explanation: 'Original birth timestamp' },
      ],
    },
    explanation: {
      summary: 'Chronological age represents the elapsed time from birth to a specified target date, accounting for calendar leap years and varying month lengths.',
      breakdown: [
        {
          title: 'Leap Year Precision',
          text: 'Standard calendar calculations account for February having 29 days during leap years (every 4 years, excluding century years not divisible by 400).',
        },
      ],
      considerations: ['Useful for school admissions, insurance eligibility, government job age limit compliance, and retirement milestones.'],
    },
    example: {
      title: 'Born on August 15, 1995',
      description: 'Milestone calculation.',
      inputs: {
        'Birth Date': '1995-08-15',
        'Target Date': 'Today',
      },
      results: {
        'Age': '30+ Years',
        'Total Days': '11,000+ Days Lived',
      },
      walkthrough: ['Accurately accounts for leap years between 1995 and today.'],
    },
    faqs: [
      {
        question: 'Does this calculator handle leap day birthdays (Feb 29)?',
        answer: 'Yes! In non-leap years, next birthday is typically celebrated on February 28 or March 1 depending on legal jurisdiction.',
      },
    ],
    relatedToolSlugs: ['working-days-calculator', 'emi-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'currency-converter',
    name: 'Currency Converter',
    slug: 'currency-converter',
    category: 'converters',
    additionalCategories: ['travel'],
    subcategory: 'converters',
    description: 'Convert between major global currencies (INR, USD, EUR, GBP, AUD, CAD, SGD, AED, JPY) with real-time reference exchange rates.',
    shortDescription: 'Instant foreign exchange rate conversions across major global currencies.',
    iconName: 'Coins',
    isPopular: true,
    isFeatured: true,
    synonyms: ['forex converter', 'usd to inr', 'currency exchange', 'fx rates', 'dollar to rupee', 'euro to usd'],
    phrases: ['convert dollars to rupees', 'usd inr exchange rate', 'foreign exchange calculator'],
    seo: {
      title: 'Currency Converter - Global Foreign Exchange Calculator',
      metaDescription: 'Convert global currencies with transparent reference exchange rates. Instant conversions between USD, INR, EUR, GBP, AUD, and more.',
      keywords: ['currency converter', 'usd to inr', 'forex calculator', 'exchange rate'],
    },
    formula: {
      expression: '\\text{Converted Amount} = \\text{Amount} \\times \\left(\\frac{\\text{Target Rate}}{\\text{Source Rate}}\\right)',
      variables: [
        { symbol: 'Amount', explanation: 'Quantity of source currency' },
        { symbol: 'Target Rate', explanation: 'Target currency price relative to base index' },
      ],
    },
    explanation: {
      summary: 'Currency conversion estimates the purchasing parity between national sovereign currencies based on interbank exchange rates.',
      breakdown: [
        {
          title: 'Interbank vs Retail Rates',
          text: 'Consumer credit cards, airport kiosks, and bank wire services frequently add a 1% to 3.5% foreign transaction fee spread over the mid-market rate.',
        },
      ],
      considerations: ['Always check with your financial institution or credit card provider for exact live spreads and transaction fees.'],
    },
    example: {
      title: 'Convert $500 USD to Indian Rupees (INR)',
      description: 'Traveler or freelancer payment conversion.',
      inputs: {
        'Source': '$500 USD',
        'Target': 'INR',
        'Rate': '1 USD = ₹83.20 INR',
      },
      results: {
        'Converted Total': '₹41,600 INR',
      },
      walkthrough: ['$500 × 83.20 = ₹41,600'],
    },
    faqs: [
      {
        question: 'Why do bank rates differ from online converters?',
        answer: 'Online converters display the wholesale mid-market rate. Banks and credit card networks charge an exchange spread or markup to cover transaction risk and profit margins.',
      },
    ],
    relatedToolSlugs: ['travel-budget-calculator', 'emi-calculator', 'discount-calculator'],
    status: 'active',
  },
  {
    id: 'home-loan-calculator',
    name: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    category: 'property',
    additionalCategories: ['money'],
    subcategory: 'home-buying',
    description: 'Calculate monthly mortgage payments, property tax estimations, total interest over 15 to 30 years, and down payment requirements.',
    shortDescription: 'Comprehensive mortgage & housing loan calculator with down payment options.',
    iconName: 'House',
    isPopular: true,
    isFeatured: false,
    synonyms: ['mortgage calculator', 'house loan', 'property loan', 'housing finance', 'house payment'],
    phrases: ['house payment', 'home mortgage monthly cost', 'down payment for house loan'],
    seo: {
      title: 'Home Loan Calculator - Housing Mortgage EMI & Down Payment',
      metaDescription: 'Calculate your home loan EMI, down payment, total interest payable, and payoff schedules for buying your dream home.',
      keywords: ['home loan calculator', 'mortgage calculator', 'housing loan emi', 'property financing'],
    },
    formula: {
      expression: 'EMI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Net Loan Amount (Property Value - Down Payment)' },
        { symbol: 'r', explanation: 'Monthly Mortgage Interest Rate' },
        { symbol: 'n', explanation: 'Tenure in months (e.g. 240 or 360 months)' },
      ],
    },
    explanation: {
      summary: 'A home loan is typically the largest financial commitment in a person’s lifetime. Structuring your down payment and tenure wisely saves thousands in compound interest.',
      breakdown: [
        {
          title: 'The Power of Down Payment',
          text: 'Putting down 20% or more avoids lender mortgage insurance (LMI/PMI) and lowers the principal that compounds over decades.',
        },
      ],
      considerations: ['Keep total EMIs across all your debt under 40% of your net monthly take-home pay.'],
    },
    example: {
      title: '₹50 Lakh Property with 20% Down Payment',
      description: 'Standard home purchase.',
      inputs: {
        'Property Value': '₹50,00,000',
        'Down Payment': '20% (₹10,00,000)',
        'Loan Amount': '₹40,00,000 at 8.4% for 20 years',
      },
      results: {
        'Monthly EMI': '₹34,453',
        'Total Interest': '₹42,68,720',
      },
      walkthrough: ['Loan balance of ₹40,00,000 amortized over 240 months at 8.4% p.a.'],
    },
    faqs: [
      {
        question: 'Should I choose a 20-year or 30-year home loan?',
        answer: 'A 30-year loan lowers your monthly EMI, making it safer for monthly budgets, but substantially increases total lifetime interest. A smart strategy is taking a 25-30 year loan for safety, but making periodic prepayments to finish it in 15-20 years.',
      },
    ],
    relatedToolSlugs: ['emi-calculator', 'sip-calculator', 'rent-vs-buy-home-calculator'],
    status: 'active',
  },
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    category: 'salary-work',
    subcategory: 'salary',
    description: 'Calculate net take-home salary from Gross CTC / Gross Wage after standard provident fund (EPF), professional tax, and tax deductions.',
    shortDescription: 'Convert gross annual package or hourly wages into net in-hand monthly pay.',
    iconName: 'Wallet',
    isPopular: true,
    isFeatured: false,
    synonyms: ['in hand salary', 'net pay calculator', 'take home pay', 'ctc to in hand', 'wage calculator', 'take-home pay calculator', 'paycheck calculator', 'gross-to-net pay calculator', 'hourly to salary calculator', 'salary to hourly calculator', 'bi-weekly pay calculator', 'salary paycheck calculator'],
    phrases: ['how much is in hand for 12 lpa', 'gross to net salary calculator', 'monthly take home from annual salary', 'paycheck take home pay estimator', 'hourly to salary converter', 'salary to hourly wages', 'calculate bi-weekly net pay', 'salary paycheck calculator'],
    seo: {
      title: 'Salary Calculator - Gross CTC to Net Monthly Take-Home Pay',
      metaDescription: 'Calculate your actual in-hand monthly salary from your gross CTC. Understand deductions like provident fund, taxes, and allowances.',
      keywords: ['salary calculator', 'take home pay', 'ctc to in hand', 'in hand salary calculator'],
    },
    formula: {
      expression: '\\text{Net Monthly Pay} = \\frac{\\text{Gross Annual} - \\text{Deductions} - \\text{Taxes}}{12}',
      variables: [
        { symbol: 'Gross Annual', explanation: 'Total Cost to Company (CTC) or annual salary' },
        { symbol: 'Deductions', explanation: 'Retirement savings, benefits, insurance' },
      ],
    },
    explanation: {
      summary: 'Gross salary offers the headline figure, but net in-hand salary is what actually lands in your bank account every month to pay bills and invest.',
      breakdown: [
        {
          title: 'Direct Deductions',
          text: 'Typical statutory deductions include employee provident funds (EPF / 401k), health coverage, and income tax withholdings (TDS).',
        },
      ],
      considerations: ['Bonus components and stock grants (RSUs/ESOPs) may be paid quarterly or annually rather than in monthly paychecks.'],
    },
    example: {
      title: '₹12,00,000 Annual CTC',
      description: 'Understanding monthly bank deposits.',
      inputs: {
        'Gross CTC': '₹12,00,000',
        'Standard Deductions': 'EPF + Taxes (~18%)',
      },
      results: {
        'Estimated Monthly In-Hand': '₹82,000 - ₹85,000',
      },
      walkthrough: ['Gross monthly ₹1,00,000 less EPF (₹1,800-₹3,600) and income tax withholdings.'],
    },
    faqs: [
      {
        question: 'Why is my in-hand salary different from CTC ÷ 12?',
        answer: 'CTC includes employer contributions to provident funds, gratuity provisions, insurance premiums, performance bonuses, and taxes before monthly payout.',
      },
    ],
    relatedToolSlugs: ['emi-calculator', 'sip-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    slug: 'savings-goal-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Determine how much money you need to set aside every month to reach your target savings milestone for a house down payment, car, or emergency fund.',
    shortDescription: 'Calculate monthly savings required to hit your financial goals on schedule.',
    iconName: 'Target',
    isPopular: true,
    isFeatured: false,
    synonyms: ['how much should i save', 'target savings', 'emergency fund goal', 'saving for a car', 'future goal'],
    phrases: ['how much should i save each month', 'save 10 lakhs in 3 years', 'down payment savings plan'],
    seo: {
      title: 'Savings Goal Calculator - Plan Your Monthly Target Contributions',
      metaDescription: 'Plan your path to any financial goal. Calculate the exact monthly savings needed based on target amount, deadline, and return rate.',
      keywords: ['savings goal calculator', 'target savings', 'financial goal planner', 'emergency fund calculator'],
    },
    formula: {
      expression: '\\text{Monthly Saving} = \\frac{\\text{Target} \\cdot r}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'Target', explanation: 'Target financial goal amount' },
        { symbol: 'r', explanation: 'Monthly rate of interest or return' },
        { symbol: 'n', explanation: 'Total months until deadline' },
      ],
    },
    explanation: {
      summary: 'Working backwards from a concrete target date transforms overwhelming future goals into manageable, automated monthly savings habits.',
      breakdown: [
        {
          title: 'Pay Yourself First',
          text: 'Set up an automated transfer on salary day to your dedicated savings vehicle so you never rely on "whatever is left over".',
        },
      ],
      considerations: ['Build a 3 to 6-month emergency buffer before locking savings into illiquid investments.'],
    },
    example: {
      title: 'Save ₹5,00,000 in 3 Years for Wedding/Emergency',
      description: '36-month timeline with 6.5% recurring deposit.',
      inputs: {
        'Target Amount': '₹5,00,000',
        'Time Horizon': '3 Years (36 Months)',
        'Return Rate': '6.5% p.a.',
      },
      results: {
        'Required Monthly Deposit': '₹12,650 / month',
        'Total Principal Saved': '₹4,55,400',
        'Interest Earned': '₹44,600',
      },
      walkthrough: ['By saving ₹12,650 each month at 6.5%, interest helps bridge the final ₹44,600.'],
    },
    faqs: [
      {
        question: 'Where should I park short-term savings (under 3 years)?',
        answer: 'High-yield savings accounts, sweep-in accounts, liquid mutual funds, or short-term fixed deposits minimize capital risk while beating standard savings accounts.',
      },
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'sip-calculator', 'emi-calculator'],
    status: 'active',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    category: 'converters',
    additionalCategories: ['everyday'],
    subcategory: 'converters',
    description: 'Universal unit converter for length (meters, feet, inches), weight (kg, pounds), area (sq ft, acres), temperature (Celsius, Fahrenheit), and volume.',
    shortDescription: 'Convert between metric and imperial systems across length, weight, area, and temperature.',
    iconName: 'Ruler',
    isPopular: true,
    isFeatured: false,
    synonyms: ['convert kg to pounds', 'cm to inches', 'feet to meters', 'metric converter', 'imperial converter'],
    phrases: ['convert kg to pounds', 'how many feet in 180 cm', 'sq ft to sq meters converter'],
    seo: {
      title: 'Unit Converter - Length, Weight, Area & Temperature Conversions',
      metaDescription: 'Free online unit converter. Seamlessly convert between metric and imperial units with instant formulas and high precision.',
      keywords: ['unit converter', 'kg to lbs', 'meters to feet', 'celsius to fahrenheit', 'measurement converter'],
    },
    formula: {
      expression: '\\text{Value}_{\\text{target}} = \\text{Value}_{\\text{source}} \\times \\text{Conversion Factor}',
      variables: [
        { symbol: 'Conversion Factor', explanation: 'Constant ratio between standard units' },
      ],
    },
    explanation: {
      summary: 'Accurately bridges the international metric system (SI) and imperial/customary units used worldwide.',
      breakdown: [
        {
          title: 'Metric vs Imperial Standard',
          text: 'Metric scales in base-10 decimals, while imperial uses historical fractional divisions (12 inches in a foot, 16 ounces in a pound).',
        },
      ],
      considerations: ['Temperature conversion uses an offset: (°F - 32) × 5/9 = °C.'],
    },
    example: {
      title: 'Convert 70 Kilograms to Pounds',
      description: 'Fitness / health measurement conversion.',
      inputs: {
        'Source': '70 kg',
        'Target': 'Pounds (lbs)',
      },
      results: {
        'Result': '154.32 lbs',
      },
      walkthrough: ['70 kg × 2.20462 = 154.32 lbs'],
    },
    faqs: [
      {
        question: 'Why do different countries use different units?',
        answer: 'Most of the world standardized on the decimal metric system in the 19th and 20th centuries, while the United States, UK, and a few others retain customary units for everyday usage.',
      },
    ],
    relatedToolSlugs: ['currency-converter', 'percentage-calculator', 'fuel-cost-calculator'],
    status: 'active',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    slug: 'bmi-calculator',
    category: 'health',
    subcategory: 'body',
    description: 'Calculate your Body Mass Index (BMI), WHO weight category, ideal healthy weight range, and BMI Prime based on height and weight.',
    shortDescription: 'Calculate Body Mass Index and healthy weight target range.',
    iconName: 'Gauge',
    isPopular: true,
    isFeatured: true,
    synonyms: ['body mass index', 'ideal weight', 'healthy weight range', 'bmi chart', 'who bmi'],
    phrases: ['calculate my bmi', 'what is my ideal weight', 'am i overweight bmi calculator'],
    seo: {
      title: 'BMI Calculator - Body Mass Index & Healthy Weight Range',
      metaDescription: 'Free online BMI Calculator. Check your Body Mass Index, WHO health classification, healthy weight target range, and metric/imperial conversions.',
      keywords: ['bmi calculator', 'body mass index', 'ideal weight', 'who bmi chart', 'healthy weight'],
    },
    formula: {
      expression: '\\text{BMI} = \\frac{\\text{Weight (kg)}}{(\\text{Height (m)})^2}',
      variables: [
        { symbol: 'Weight', explanation: 'Body mass in kilograms' },
        { symbol: 'Height', explanation: 'Stature in meters' },
      ],
    },
    explanation: {
      summary: 'Body Mass Index (BMI) is a screening metric established by the World Health Organization (WHO) to categorize body mass relative to height.',
      breakdown: [
        {
          title: 'WHO Classifications',
          text: 'Underweight (<18.5), Normal Weight (18.5–24.9), Overweight (25–29.9), and Obese (≥30).',
        },
        {
          title: 'Healthy Weight Range',
          text: 'The healthy weight range corresponds to a BMI between 18.5 and 24.9 for your specific height.',
        },
      ],
      considerations: ['BMI does not distinguish between muscle mass and fat tissue; athletes may score higher despite low body fat.'],
    },
    example: {
      title: 'Person 175 cm Tall Weighing 70 kg',
      description: 'Healthy adult BMI calculation.',
      inputs: {
        'Height': '175 cm (1.75 m)',
        'Weight': '70 kg',
      },
      results: {
        'BMI': '22.9',
        'Category': 'Normal weight',
        'Healthy Range': '56.7 kg – 76.3 kg',
      },
      walkthrough: ['BMI = 70 ÷ (1.75 × 1.75) = 22.86 (Normal weight)'],
    },
    faqs: [
      {
        question: 'What is BMI Prime?',
        answer: 'BMI Prime is the ratio of your actual BMI to the upper limit of normal BMI (25). A BMI Prime under 0.74 indicates underweight, 0.74–1.00 is normal weight, and above 1.00 indicates overweight.',
      },
    ],
    relatedToolSlugs: ['calorie-counter', 'unit-converter', 'age-calculator'],
    status: 'active',
  },
  {
    id: 'calorie-counter',
    name: 'Calorie & TDEE Calculator',
    slug: 'calorie-counter',
    category: 'food',
    additionalCategories: ['health'],
    subcategory: 'nutrition',
    description: 'Calculate your Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), and target daily caloric intake for fat loss, maintenance, or muscle gain.',
    shortDescription: 'Calculate daily maintenance calories, BMR, and macronutrient targets.',
    iconName: 'Scale',
    isPopular: true,
    isFeatured: true,
    synonyms: ['tdee calculator', 'bmr calculator', 'daily calorie needs', 'macro calculator', 'calorie deficit'],
    phrases: ['how many calories should i eat', 'tdee calculator for weight loss', 'bmr energy expenditure'],
    seo: {
      title: 'Calorie & TDEE Calculator - Total Daily Energy Expenditure',
      metaDescription: 'Calculate your daily calorie needs and BMR with Mifflin-St Jeor formula. Custom caloric goals for fat loss, muscle building, and balanced macronutrients.',
      keywords: ['tdee calculator', 'calorie calculator', 'bmr calculator', 'macro split', 'weight loss calories'],
    },
    formula: {
      expression: '\\text{TDEE} = \\text{BMR} \\times \\text{Activity Multiplier}',
      variables: [
        { symbol: 'BMR', explanation: 'Basal Metabolic Rate via Mifflin-St Jeor equation' },
        { symbol: 'Activity Multiplier', explanation: '1.2 (Sedentary) to 1.9 (Heavy athlete)' },
      ],
    },
    explanation: {
      summary: 'TDEE is the total number of calories your body expends in 24 hours through baseline metabolic processes, digestion, and physical activity.',
      breakdown: [
        {
          title: 'Energy Deficit for Weight Loss',
          text: 'A sustainable 500 kcal daily deficit translates to approximately 0.5 kg (1 lb) of fat loss per week.',
        },
      ],
      considerations: ['Protein intake should be maintained around 1.6–2.2g per kg of bodyweight during caloric deficits to preserve lean muscle.'],
    },
    example: {
      title: '28-year-old Male, 180 cm, 80 kg, Moderate Exercise',
      description: 'Daily maintenance and fat loss calculation.',
      inputs: {
        'BMR': '1,780 kcal',
        'Activity Level': 'Moderate (1.55x)',
      },
      results: {
        'Maintenance (TDEE)': '2,759 kcal/day',
        'Fat Loss Target': '2,259 kcal/day (-500 kcal)',
      },
      walkthrough: ['1,780 BMR × 1.55 = 2,759 kcal maintenance; 2,259 kcal for 0.5 kg/week steady fat loss.'],
    },
    faqs: [
      {
        question: 'What is BMR?',
        answer: 'Basal Metabolic Rate is the baseline energy expenditure your body burns at complete rest just to keep organs functioning.',
      },
    ],
    relatedToolSlugs: ['bmi-calculator', 'unit-converter', 'fuel-cost-calculator'],
    status: 'active',
  },
  {
    id: 'tip-calculator',
    name: 'Tip & Split Bill Calculator',
    slug: 'tip-calculator',
    category: 'food',
    additionalCategories: ['everyday'],
    subcategory: 'dining-bills',
    description: 'Calculate restaurant gratuity, total check amounts, and split expenses evenly among dinner guests with instant round-up options.',
    shortDescription: 'Calculate tip amounts, total bills, and split costs fairly among friends.',
    iconName: 'HandCoins',
    isPopular: true,
    isFeatured: true,
    synonyms: ['restaurant tip', 'split the check', 'gratuity calculator', 'bill split', 'dinner share'],
    phrases: ['how much to tip on 75 dollars', 'split dinner bill 4 ways', '20 percent tip calculator'],
    seo: {
      title: 'Tip Calculator - Restaurant Gratuity & Bill Splitter',
      metaDescription: 'Quickly calculate restaurant tips and split bills among friends. Choose standard tip percentages, custom gratuities, and round up totals.',
      keywords: ['tip calculator', 'bill splitter', 'gratuity calculator', 'restaurant tip'],
    },
    formula: {
      expression: '\\text{Total Bill} = \\text{Bill} + \\left(\\text{Bill} \\times \\frac{\\text{Tip \\%}}{100}\\right)',
      variables: [
        { symbol: 'Bill', explanation: 'Subtotal before gratuity' },
        { symbol: 'Tip %', explanation: 'Selected tip percentage (e.g. 15%, 18%, 20%)' },
      ],
    },
    explanation: {
      summary: 'Effortlessly determine fair gratuity and individual payment shares for dining out, delivery drivers, and group events.',
      breakdown: [
        {
          title: 'Standard Gratuity Standards',
          text: 'In the US and Canada, 15–20% is customary for table service. In Europe and Asia, service is often included or 5–10% is rounded up.',
        },
      ],
      considerations: ['Check whether the printed restaurant receipt has already included an automatic service charge for large parties.'],
    },
    example: {
      title: '$120 Dinner Bill Split Among 4 Friends at 18% Tip',
      description: 'Group dining split.',
      inputs: {
        'Bill Amount': '$120.00',
        'Tip Rate': '18%',
        'Guests': '4',
      },
      results: {
        'Tip Total': '$21.60',
        'Total Bill': '$141.60',
        'Per Person': '$35.40',
      },
      walkthrough: ['Tip: $120 × 0.18 = $21.60; Total: $141.60; Per Person: $141.60 ÷ 4 = $35.40.'],
    },
    faqs: [
      {
        question: 'Should I tip on post-tax or pre-tax totals?',
        answer: 'Standard etiquette recommends tipping on the pre-tax food and beverage subtotal, though many automated POS card terminals calculate tips on the post-tax total.',
      },
    ],
    relatedToolSlugs: ['percentage-calculator', 'discount-calculator', 'fuel-cost-calculator'],
    status: 'active',
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    slug: 'roi-calculator',
    category: 'finance',
    subcategory: 'investments',
    description: 'Calculate Return on Investment (ROI), Compound Annual Growth Rate (CAGR), and net profit margin for stocks, business ventures, or real estate.',
    shortDescription: 'Calculate percentage return on investment, CAGR, and profit margins.',
    iconName: 'Percent',
    isPopular: true,
    isFeatured: true,
    synonyms: ['return on investment', 'cagr calculator', 'investment profit', 'annualized return', 'profit margin'],
    phrases: ['calculate roi on investment', 'annualized return on stock', 'cagr investment return'],
    seo: {
      title: 'ROI Calculator - Return on Investment & Annualized CAGR',
      metaDescription: 'Calculate ROI percentage, absolute profit, annualized CAGR, and profit margin for investments, marketing campaigns, or asset sales.',
      keywords: ['roi calculator', 'return on investment', 'cagr calculator', 'profit margin', 'investment return'],
    },
    formula: {
      expression: '\\text{ROI} = \\left(\\frac{\\text{Final Value} - \\text{Initial Investment}}{\\text{Initial Investment}}\\right) \\times 100',
      variables: [
        { symbol: 'Final Value', explanation: 'Total proceeds or current asset value' },
        { symbol: 'Initial Investment', explanation: 'Original cost basis or capital deployed' },
      ],
    },
    explanation: {
      summary: 'Return on Investment measures the efficiency or profitability of an investment relative to its initial cost.',
      breakdown: [
        {
          title: 'Simple ROI vs Annualized CAGR',
          text: 'A 50% ROI over 1 year is extraordinary, while a 50% ROI over 10 years equals a modest 4.14% annualized CAGR.',
        },
      ],
      considerations: ['Always account for transaction fees, management fees, capital gains taxes, and inflation.'],
    },
    example: {
      title: '₹2,00,000 Invested Growing to ₹3,50,000 in 4 Years',
      description: 'Equity or business investment evaluation.',
      inputs: {
        'Initial Cost': '₹2,00,000',
        'Final Value': '₹3,50,000',
        'Time Horizon': '4 Years',
      },
      results: {
        'Net Profit': '₹1,50,000',
        'Simple ROI': '75%',
        'Annualized CAGR': '15.02% per year',
      },
      walkthrough: ['Gain = ₹1,50,000; ROI = 75%; CAGR = (350000 / 200000)^(1/4) - 1 = 15.02%.'],
    },
    faqs: [
      {
        question: 'What is a good ROI?',
        answer: 'Historically, the broad stock market (S&P 500 or Nifty 50) delivers ~10-12% average nominal annualized return over long periods. Real estate typically yields 8-12% including rental yields and appreciation.',
      },
    ],
    relatedToolSlugs: ['sip-calculator', 'compound-interest-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'square-footage-calculator',
    name: 'Square Footage & Flooring Calculator',
    slug: 'square-footage-calculator',
    category: 'property',
    additionalCategories: ['property'],
    subcategory: 'construction-renovation',
    description: 'Calculate room area in square feet and square meters, estimated tiles or hardwood flooring needed, and total material costs including waste allowance.',
    shortDescription: 'Calculate room area, flooring materials, and budget with waste factors.',
    iconName: 'Square',
    isPopular: true,
    isFeatured: true,
    synonyms: ['sq ft calculator', 'flooring calculator', 'room area', 'tile calculator', 'paint square footage'],
    phrases: ['calculate square footage of room', 'how many sq ft for 12 by 15 room', 'flooring tile cost calculator'],
    seo: {
      title: 'Square Footage Calculator - Room Area & Flooring Cost Estimator',
      metaDescription: 'Free Square Footage Calculator. Find area in sq ft and sq meters, factor in 10% tile/hardwood cutting waste, and calculate total project budget.',
      keywords: ['square footage calculator', 'sq ft calculator', 'flooring calculator', 'tile area calculator', 'room size'],
    },
    formula: {
      expression: '\\text{Area} = \\text{Length} \\times \\text{Width} \\times (1 + \\text{Waste \\%})',
      variables: [
        { symbol: 'Length', explanation: 'Room length in feet or meters' },
        { symbol: 'Width', explanation: 'Room width in feet or meters' },
        { symbol: 'Waste %', explanation: 'Typically 10% for cuts and pattern matching' },
      ],
    },
    explanation: {
      summary: 'Accurately estimating surface area prevents ordering shortfalls or costly material waste during flooring, painting, or turf installation.',
      breakdown: [
        {
          title: 'The 10% Waste Factor Rule',
          text: 'Professional installers always add 10% (or 15% for herringbone/diagonal tile patterns) to account for corner trims, cuts, and damaged pieces.',
        },
      ],
      considerations: ['Subtract the area of fixed kitchen islands or built-in cabinets if you do not plan to lay flooring under them.'],
    },
    example: {
      title: 'Living Room 15 ft × 20 ft at $4.50/sq ft Flooring',
      description: 'Hardwood floor installation.',
      inputs: {
        'Length': '15 ft',
        'Width': '20 ft',
        'Tile/Board Cost': '$4.50 / sq ft',
        'Waste Allowance': '10%',
      },
      results: {
        'Room Area': '300 sq ft (27.87 m²)',
        'Material to Order': '330 sq ft',
        'Total Material Cost': '$1,485.00',
      },
      walkthrough: ['Area: 15 × 20 = 300 sq ft; With 10% waste: 330 sq ft; Cost: 330 × $4.50 = $1,485.00.'],
    },
    faqs: [
      {
        question: 'How do I convert square feet to square meters?',
        answer: '1 square meter equals approximately 10.764 square feet. To convert square feet to square meters, divide by 10.764.',
      },
    ],
    relatedToolSlugs: ['unit-converter', 'discount-calculator', 'percentage-calculator'],
    status: 'active',
  },
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'finance',
    subcategory: 'savings',
    description: 'Calculate simple interest, total repayment or maturity amount, and daily, monthly, and yearly interest rates with transparent formulas.',
    shortDescription: 'Compute simple interest (SI = P × R × T / 100) with flexible tenure in years, months, or days.',
    iconName: 'Percent',
    isPopular: true,
    isFeatured: true,
    synonyms: ['simple interest', 'si calculator', 'flat rate interest', 'loan interest flat', 'interest on deposit'],
    phrases: ['simple interest formula', 'how to calculate simple interest', 'daily simple interest calculation'],
    seo: {
      title: 'Simple Interest Calculator - Calculate SI & Total Maturity Amount',
      metaDescription: 'Free online Simple Interest Calculator. Calculate principal, annual interest rate, duration in years, months, or days, and daily/monthly breakdowns.',
      keywords: ['simple interest calculator', 'si calculator', 'interest calculator', 'flat rate interest', 'savings interest'],
    },
    formula: {
      expression: 'SI = \\frac{P \\cdot R \\cdot T}{100}, \\quad A = P + SI',
      variables: [
        { symbol: 'P', explanation: 'Principal Amount (Initial sum of money borrowed or deposited)' },
        { symbol: 'R', explanation: 'Annual Interest Rate (% per year)' },
        { symbol: 'T', explanation: 'Time Period in years (automatically converted if months or days are selected)' },
        { symbol: 'A', explanation: 'Total Amount payable or receivable (Principal + Simple Interest)' },
      ],
      notes: 'Time conversion: Months ÷ 12, or Days ÷ 365.',
    },
    explanation: {
      summary: 'Simple Interest is calculated solely on the initial principal amount. Unlike compound interest, interest accumulated in prior periods does not earn additional interest.',
      breakdown: [
        {
          title: 'Fixed Interest Per Cycle',
          text: 'Because interest is only assessed against the original principal, the interest accrued each year remains completely identical throughout the tenure.',
        },
        {
          title: 'When Simple Interest is Used',
          text: 'Commonly utilized in short-term peer-to-peer loans, retail hire-purchase agreements, certain consumer bonds, and short duration auto financing.',
        },
        {
          title: 'Simple Interest vs Compound Interest',
          text: 'Over long periods, compound interest grows exponentially, while simple interest grows linearly. For borrowers, simple interest is cheaper over time; for investors, compound interest yields significantly greater wealth.',
        },
      ],
      considerations: [
        'Most modern institutional mortgages and bank fixed deposits use compound interest rather than simple interest.',
        'Always check whether your loan uses flat simple rate or reducing balance rate.',
      ],
    },
    example: {
      title: '₹1,00,000 Loan at 8% for 3 Years',
      description: 'Standard flat rate interest calculation.',
      inputs: {
        'Principal Amount': '₹1,00,000',
        'Interest Rate': '8% p.a.',
        'Time Duration': '3 Years',
      },
      results: {
        'Simple Interest': '₹24,000',
        'Total Amount': '₹1,24,000',
        'Annual Interest': '₹8,000 / year',
      },
      walkthrough: [
        'SI = (100000 × 8 × 3) ÷ 100 = ₹24,000',
        'Total Amount = ₹100,000 + ₹24,000 = ₹1,24,000',
      ],
    },
    faqs: [
      {
        question: 'What is the formula for Simple Interest?',
        answer: 'The standard formula is SI = (P × R × T) / 100, where P is the Principal, R is the Annual Interest Rate in percent, and T is the Time in years.',
      },
      {
        question: 'How do I calculate simple interest for months or days?',
        answer: 'Convert the duration to years: for months, divide the number of months by 12 (e.g., 6 months = 0.5 years). For days, divide the number of days by 365 (or 366 in leap years).',
      },
      {
        question: 'What is the difference between simple and compound interest?',
        answer: 'Simple interest only pays on the original principal. Compound interest pays interest on both the principal and the accumulated interest from previous periods.',
      },
    ],
    relatedToolSlugs: ['compound-interest-calculator', 'savings-goal-calculator', 'emi-calculator'],
    status: 'active',
  },
  {
    id: 'yearly-sip-calculator',
    name: 'Yearly SIP Calculator',
    slug: 'yearly-sip-calculator',
    category: 'finance',
    subcategory: 'investments',
    description: 'Calculate long-term wealth accumulation for annual systematic investments (Yearly SIP, PPF, NPS, or IRA contributions) with step-up increments.',
    shortDescription: 'Calculate annual investment returns, future maturity value, and annual step-up growth.',
    iconName: 'CalendarRange',
    isPopular: true,
    isFeatured: true,
    synonyms: ['yearly sip', 'annual sip', 'annual systematic investment', 'yearly mutual fund', 'ppf calculator', 'annual investment'],
    phrases: ['yearly sip calculation', 'invest once a year mutual fund', 'annual sip returns'],
    seo: {
      title: 'Yearly SIP Calculator - Annual Systematic Investment Returns',
      metaDescription: 'Calculate returns on yearly SIP investments. Estimate total invested capital, future wealth accumulation, and annual step-up benefits.',
      keywords: ['yearly sip calculator', 'annual sip', 'systematic investment plan', 'mutual fund returns', 'wealth builder'],
    },
    formula: {
      expression: 'A = \\sum_{t=1}^{n} P_t \\cdot (1 + r)^{n - t + 1}',
      variables: [
        { symbol: 'P_t', explanation: 'Annual investment deposit in year t (with optional annual step-up)' },
        { symbol: 'r', explanation: 'Expected Annual Return Rate (Annual Rate ÷ 100)' },
        { symbol: 'n', explanation: 'Total Investment Duration in Years' },
      ],
      notes: 'Assumes contributions are deposited at the start of each annual cycle to compound for the full year.',
    },
    explanation: {
      summary: 'A Yearly SIP (Annual Systematic Investment Plan) involves investing a lump-sum amount once per calendar year instead of monthly. It is ideal for annual bonuses, tax-saving instruments (like PPF, ELSS), or annual dividend reinvestment.',
      breakdown: [
        {
          title: 'Lump Sum Discipline Once a Year',
          text: 'Investing annually allows you to deploy capital earned from annual incentives, business distributions, or year-end bonuses directly into compound wealth vehicles.',
        },
        {
          title: 'The Advantage of Annual Step-Up',
          text: 'Increasing your annual contribution by just 5% or 10% each year substantially accelerates your maturity wealth due to compounding over 15 to 30 years.',
        },
      ],
      considerations: [
        'Investment returns are market-linked and subject to market volatility. Projections are estimated mathematical models.',
        'Ensure the chosen annual investment date aligns with your cash flow cycle.',
      ],
    },
    example: {
      title: 'Investing ₹1,20,000 Annually for 15 Years at 12%',
      description: 'Annual disciplined retirement allocation.',
      inputs: {
        'Yearly Investment': '₹1,20,000 / year',
        'Expected Return Rate': '12% p.a.',
        'Duration': '15 Years',
      },
      results: {
        'Total Invested': '₹18,00,000',
        'Estimated Returns': '₹32,74,383',
        'Final Maturity Value': '₹50,74,383',
      },
      walkthrough: [
        'Annual deposit: ₹1,20,000 compounded over 15 annual cycles at 12%',
        'Total Capital Invested: 15 × ₹1,20,000 = ₹18,00,000',
        'Estimated Maturity Value: ₹50,74,383',
      ],
    },
    faqs: [
      {
        question: 'What is the difference between Monthly SIP and Yearly SIP?',
        answer: 'A Monthly SIP divides your annual investment into 12 installments, averaging market volatility monthly. A Yearly SIP invests the full annual amount once a year, allowing the entire lump sum to compound for the entire 12 months.',
      },
      {
        question: 'Can I increase my investment each year?',
        answer: 'Yes, enabling an annual step-up percentage (e.g. 5% or 10%) automatically scales your yearly contribution to match your salary increments.',
      },
    ],
    relatedToolSlugs: ['sip-calculator', 'compound-interest-calculator', 'roi-calculator'],
    status: 'active',
  },
  {
    id: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    slug: 'car-loan-calculator',
    category: 'finance',
    additionalCategories: ['vehicles'],
    subcategory: 'loans',
    description: 'Calculate monthly auto loan payments, total interest, and total 5-year vehicle cost of ownership including insurance, fuel, and maintenance.',
    shortDescription: 'Compute monthly vehicle EMI, down payment requirements, and total cost of ownership.',
    iconName: 'CarFront',
    isPopular: true,
    isFeatured: true,
    synonyms: ['auto loan', 'vehicle loan emi', 'car financing', 'car payment calculator', 'automobile loan'],
    phrases: ['car loan emi', 'how much is monthly car payment', 'auto loan down payment'],
    seo: {
      title: 'Car Loan Calculator - Auto Loan EMI & Ownership Cost',
      metaDescription: 'Free Car Loan Calculator. Compute monthly auto payments, down payment, total interest, and true 5-year vehicle ownership costs.',
      keywords: ['car loan calculator', 'auto loan emi', 'vehicle finance', 'car payment calculator', 'car affordability'],
    },
    formula: {
      expression: 'EMI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Loan Amount (On-Road Price minus Down Payment)' },
        { symbol: 'r', explanation: 'Monthly Interest Rate (Annual Rate ÷ 12 ÷ 100)' },
        { symbol: 'n', explanation: 'Tenure in months (e.g. 36 to 84 months)' },
      ],
    },
    explanation: {
      summary: 'A car loan allows you to purchase a new or used vehicle by borrowing funds from a bank or NBFC and repaying in monthly EMIs over 3 to 7 years.',
      breakdown: [
        {
          title: 'The True Cost of Ownership',
          text: 'Beyond the monthly loan EMI, vehicle owners must budget for annual comprehensive insurance, periodic maintenance, fuel, and road taxes.',
        },
        {
          title: 'Depreciation vs Tenure',
          text: 'Vehicles depreciate rapidly in the first 3 years. Avoid excessively long loan terms (over 5-6 years) to prevent owing more than the car is worth.',
        },
      ],
      considerations: ['Aim for at least a 20% down payment and keep vehicle expenses under 15% of your take-home pay.'],
    },
    example: {
      title: '₹12 Lakh Car with 20% Down Payment at 9% for 5 Years',
      description: 'Typical sedan purchase.',
      inputs: {
        'Vehicle Price': '₹12,00,000',
        'Down Payment': '₹2,40,000 (20%)',
        'Loan Amount': '₹9,60,000',
        'Interest Rate': '9% p.a.',
        'Tenure': '5 Years (60 Months)',
      },
      results: {
        'Monthly EMI': '₹19,928',
        'Total Interest': '₹2,35,680',
        'Total Loan Repayment': '₹11,95,680',
      },
      walkthrough: ['Monthly EMI of ₹19,928 across 60 months.'],
    },
    faqs: [
      {
        question: 'What is an ideal tenure for a car loan?',
        answer: 'Most financial advisors recommend 3 to 5 years (36 to 60 months). Loans longer than 5 years mean you pay significantly more interest on a depreciating asset.',
      },
    ],
    relatedToolSlugs: ['emi-calculator', 'fuel-cost-calculator', 'home-loan-calculator'],
    status: 'active',
  },
  {
    id: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    slug: 'personal-loan-calculator',
    category: 'finance',
    subcategory: 'loans',
    description: 'Calculate monthly installments, processing fees, net disbursed amount, and total interest for unsecured personal and debt-consolidation loans.',
    shortDescription: 'Compute monthly personal loan EMI, bank processing fees, and net disbursal.',
    iconName: 'HandCoins',
    isPopular: true,
    isFeatured: true,
    synonyms: ['personal loan emi', 'unsecured loan', 'debt consolidation calculator', 'instant loan emi', 'cash loan'],
    phrases: ['personal loan monthly payment', 'calculate personal loan emi', 'personal loan interest rate'],
    seo: {
      title: 'Personal Loan Calculator - Monthly Installment & Net Disbursed Amount',
      metaDescription: 'Calculate personal loan EMIs, total interest payable, bank processing fees, and net disbursed funds.',
      keywords: ['personal loan calculator', 'personal loan emi', 'unsecured loan payment', 'loan calculator'],
    },
    formula: {
      expression: 'EMI = \\frac{P \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Loan Principal Amount' },
        { symbol: 'r', explanation: 'Monthly Rate (Annual Rate ÷ 12 ÷ 100)' },
        { symbol: 'n', explanation: 'Tenure in months (typically 12 to 60 months)' },
      ],
    },
    explanation: {
      summary: 'Personal loans are unsecured credit facilities used for emergencies, medical expenses, home renovation, or debt consolidation.',
      breakdown: [
        {
          title: 'Higher Interest Rates',
          text: 'Because personal loans require no collateral, lenders charge higher interest rates (typically 10.5% to 24%) compared to secured loans.',
        },
        {
          title: 'Processing Fee Impact',
          text: 'Lenders deduct a processing fee (usually 1% to 3%) from the sanctioned principal before depositing funds into your account.',
        },
      ],
      considerations: ['Check prepayment penalty terms before signing, as some lenders lock pre-closures for 6-12 months.'],
    },
    example: {
      title: '₹5,00,000 Personal Loan at 11.5% for 3 Years',
      description: 'Standard emergency loan.',
      inputs: {
        'Loan Amount': '₹5,00,000',
        'Interest Rate': '11.5% p.a.',
        'Tenure': '3 Years (36 Months)',
        'Processing Fee': '1.5%',
      },
      results: {
        'Monthly EMI': '₹16,490',
        'Total Interest': '₹93,640',
        'Net Disbursed': '₹4,92,500',
      },
      walkthrough: ['Monthly EMI of ₹16,490 for 36 months; Processing fee ₹7,500.'],
    },
    faqs: [
      {
        question: 'Are personal loan interest rates fixed or floating?',
        answer: 'Most personal loans have fixed interest rates, meaning your monthly EMI remains constant throughout the entire loan tenure.',
      },
    ],
    relatedToolSlugs: ['emi-calculator', 'salary-calculator', 'home-loan-calculator'],
    status: 'active',
  },
  {
    id: 'education-loan-calculator',
    name: 'Education Loan Calculator',
    slug: 'education-loan-calculator',
    category: 'finance',
    additionalCategories: ['education'],
    subcategory: 'loans',
    description: 'Calculate student education loan repayments including course study moratorium periods, simple interest during college, and post-study EMIs.',
    shortDescription: 'Calculate student loan payments, moratorium grace period interest, and repayment tenure.',
    iconName: 'GraduationCap',
    isPopular: true,
    isFeatured: true,
    synonyms: ['student loan', 'education loan emi', 'higher education finance', 'college loan', 'study loan'],
    phrases: ['student loan emi', 'education loan moratorium calculation', 'college loan monthly payment'],
    seo: {
      title: 'Education Loan Calculator - Student Loan Moratorium & EMI Repayment',
      metaDescription: 'Calculate student loan repayments with course moratorium period, accumulated interest, and post-study monthly installments.',
      keywords: ['education loan calculator', 'student loan emi', 'moratorium period loan', 'higher studies finance'],
    },
    formula: {
      expression: 'Mora\\ Interest = P \\cdot R \\cdot T_{mora}, \\quad EMI = \\frac{P_{eff} \\cdot r \\cdot (1 + r)^n}{(1 + r)^n - 1}',
      variables: [
        { symbol: 'P', explanation: 'Sanctioned Tuition & Living Expenses Loan' },
        { symbol: 'T_{mora}', explanation: 'Moratorium / Study Period (Years until graduation + grace period)' },
        { symbol: 'P_{eff}', explanation: 'Effective Principal at start of repayment (P + accumulated simple interest)' },
        { symbol: 'r', explanation: 'Monthly Interest Rate' },
        { symbol: 'n', explanation: 'Post-study repayment months' },
      ],
    },
    explanation: {
      summary: 'Education loans provide financing for college tuition and living expenses, featuring a moratorium (grace period) during your degree during which full EMI payments are deferred.',
      breakdown: [
        {
          title: 'The Moratorium Period',
          text: 'Repayment of principal usually starts 6 to 12 months after graduation or upon securing employment. However, simple interest accrues during your study years.',
        },
        {
          title: 'Servicing Simple Interest Early',
          text: 'If parents or students service the simple interest during college, lenders often provide an interest rate discount (e.g., 0.5% or 1%), preventing interest capitalization.',
        },
      ],
      considerations: ['Many jurisdictions provide tax deductions on interest paid for higher education loans (e.g. Section 80E).'],
    },
    example: {
      title: '₹20 Lakh Student Loan with 2 Years Study Moratorium at 9.5% for 10 Years',
      description: 'Master’s degree education loan.',
      inputs: {
        'Loan Amount': '₹20,00,000',
        'Interest Rate': '9.5% p.a.',
        'Moratorium Period': '2 Years',
        'Repayment Tenure': '10 Years (120 Months)',
      },
      results: {
        'Monthly EMI': '₹31,048',
        'Moratorium Interest': '₹3,80,000',
        'Total Interest': '₹17,25,760',
      },
      walkthrough: ['During 2 years study: ₹3,80,000 interest accumulated. Post-study EMI: ₹31,048.'],
    },
    faqs: [
      {
        question: 'What is a moratorium period in an education loan?',
        answer: 'A moratorium period is the duration of your course plus an additional grace period (usually 6 to 12 months) before mandatory principal repayments begin.',
      },
    ],
    relatedToolSlugs: ['emi-calculator', 'personal-loan-calculator', 'salary-calculator'],
    status: 'active',
  },  {
    id: 'travel-budget-calculator',
    name: 'Trip Budget Calculator',
    slug: 'travel-budget-calculator',
    category: 'travel',
    subcategory: 'trip-planning',
    description: 'Comprehensive travel vacation budget planner with flights, lodging, meals, transit, activities, per-person split, and currency support.',
    shortDescription: 'Plan and split total travel, vacation, and trip expenses by category.',
    iconName: 'Plane',
    isPopular: true,
    isFeatured: true,
    synonyms: ['vacation budget', 'holiday cost', 'trip planner', 'travel cost calculator', 'flight and hotel budget'],
    phrases: ['how much will my trip cost', 'vacation expense planner', 'split trip costs between travelers'],
    seo: {
      title: 'Trip Budget Calculator | Vacation & Travel Expense Planner',
      metaDescription: 'Free travel budget calculator. Estimate total flights, hotels, food, local transit, and daily allowances with multi-traveler splitting.',
      keywords: ['travel budget calculator', 'trip expense planner', 'vacation budget', 'travel cost estimator'],
    },
    formula: {
      expression: 'Total = Flights + (Lodging × Nights) + ((Food + Transit + Activities) × Days × Travelers) + Misc + Contingency',
      variables: [
        { symbol: 'Flights', explanation: 'Cost of transportation / flights per person' },
        { symbol: 'Lodging', explanation: 'Room rate per night × duration' },
        { symbol: 'Daily', explanation: 'Food, transit, and activities per day' },
        { symbol: 'Contingency', explanation: 'Emergency buffer percentage (default 10%)' },
      ],
    },
    explanation: {
      summary: 'The Trip Budget Calculator forecasts your vacation cost across every major category and provides per-person and daily expense breakdowns.',
      breakdown: [
        { title: 'Fixed vs. Variable Expenses', text: 'Flights and hotels form your base committed costs, while food and activities scale with duration and party size.' },
        { title: 'Contingency Buffer', text: 'Unplanned expenses like baggage fees, tips, and emergencies typically add 10% to 15% to final travel costs.' },
      ],
      considerations: [
        'Peak travel seasons significantly increase accommodation and airfare rates.',
        'Foreign currency exchange fluctuations can alter on-the-ground spending.',
      ],
    },
    example: {
      title: '7-Day Vacation for 2 Travelers',
      description: 'A 7-night trip with round-trip flights, mid-range hotel, and daily dining.',
      inputs: { durationDays: 7, numTravelers: 2, flights: 500, lodging: 120, foodPerDay: 50 },
      results: { 'Total Cost': ',780', 'Per Person': ',390', 'Daily Cost': '97' },
      walkthrough: [
        'Flights for 2 travelers: 2 × 00 = ,000.',
        'Hotel for 7 nights: 7 × 20 = 40.',
        'Daily food & activities: 7 × 2 × 0 = 00.',
        'Contingency buffer of 10% added for miscellaneous expenses.',
      ],
    },
    faqs: [
      { question: 'How much should I budget per day for meals?', answer: 'For mid-range dining in most metropolitan areas, budget 0–0 per person per day.' },
      { question: 'What is a reasonable travel contingency fund?', answer: 'A 10% to 15% safety buffer covers surprise transit fees, medical copays, and itinerary adjustments.' },
    ],
    relatedToolSlugs: ['fuel-cost-calculator', 'currency-converter'],
    status: 'active',
  },
];

import { CATEGORIES } from './categories';
import { NEW_ROADMAP_TOOLS } from './newRoadmapToolsRegistry';
import { NEW_CALCULATORS_TOOLS } from './newCalculatorsToolsRegistry';
import { NEW_CALCULATORS_BATCH2_TOOLS } from './newCalculatorsBatch2Registry';
import { NEW_CALCULATORS_BATCH3_TOOLS } from './newCalculatorsBatch3Registry';
import { MASTER_EXPANSION_TOOLS } from './masterExpansionToolsRegistry';
import { GOLD_CALCULATORS_TOOLS } from './goldCalculatorsRegistry';
import { HIGH_VALUE_TOOLS } from './highValueCalculatorsRegistry';
import { PHYSICS_TOOLS } from './physicsCalculatorsRegistry';
import { MISSING_CALCULATORS_TOOLS } from './allMissingCalculatorsRegistry';
import { getToolFormula } from './toolFormulas';

export const TOOLS_REGISTRY: ToolMetadata[] = [
  ...BASE_TOOLS,
  ...EXPANDED_TOOLS,
  ...NEW_ROADMAP_TOOLS,
  ...NEW_CALCULATORS_TOOLS,
  ...NEW_CALCULATORS_BATCH2_TOOLS,
  ...NEW_CALCULATORS_BATCH3_TOOLS,
  ...MASTER_EXPANSION_TOOLS,
  ...GOLD_CALCULATORS_TOOLS,
  ...HIGH_VALUE_TOOLS,
  ...PHYSICS_TOOLS,
  ...MISSING_CALCULATORS_TOOLS,
].map((tool) => {
  const categoryObj = CATEGORIES.find((c) => c.id === tool.category) || CATEGORIES[0];
  const subcatObj = categoryObj.subcategories?.find((s) => s.id === tool.subcategory);
  const canonicalCategory = categoryObj.name;
  const canonicalSubcategory = subcatObj ? subcatObj.name : tool.subcategory;
  const canonicalRoute = `/${categoryObj.slug}/${tool.slug}`;

  const defaultExplanation = {
    summary: tool.explanation?.summary || `${tool.name} calculates deterministic values for ${canonicalCategory || 'practical'} applications, delivering instant results based on standard mathematical principles.`,
    breakdown: tool.explanation?.breakdown?.length
      ? tool.explanation.breakdown
      : [
          {
            title: 'Deterministic Computation',
            text: 'All equations execute locally in your browser with zero latency and complete data privacy.',
          },
          {
            title: 'Accurate Planning',
            text: 'Use this tool to compare scenarios, evaluate trade-offs, and make informed financial or mathematical decisions.',
          },
        ],
    considerations: tool.explanation?.considerations?.length
      ? tool.explanation.considerations
      : [
          'Calculations are for informational planning and estimation purposes.',
          'Verify applicable local statutory regulations or specific institutional guidelines where appropriate.',
        ],
  };

  const defaultFormula = getToolFormula(tool.slug, tool.name, tool.category, tool.formula);

  const defaultExample = {
    title: tool.example?.title || `Standard ${tool.name} Walkthrough`,
    description: tool.example?.description || `A practical demonstration of ${tool.name} based on standard inputs.`,
    inputs: tool.example?.inputs || { 'Sample Parameters': 'Standard input configuration' },
    results: tool.example?.results || { 'Computed Output': 'Accurate deterministic result' },
    walkthrough: tool.example?.walkthrough?.length
      ? tool.example.walkthrough
      : [
          'Enter the required parameters into the input fields.',
          'Review the real-time calculated breakdown, charts, and summary metrics.',
        ],
  };

  const defaultFaqs = tool.faqs?.length
    ? tool.faqs
    : [
        {
          question: `How does the ${tool.name} work?`,
          answer: `The ${tool.name} processes your parameters using standardized formulas and displays results instantly with no tracking.`,
        },
        {
          question: 'Is this calculator free to use?',
          answer: 'Yes, all Zeta Calculator tools are 100% free with local compute and no signup required.',
        },
      ];

  return {
    ...tool,
    synonyms: Array.isArray(tool.synonyms) ? tool.synonyms : [],
    phrases: Array.isArray(tool.phrases) ? tool.phrases : [],
    relatedToolSlugs: Array.isArray(tool.relatedToolSlugs) ? tool.relatedToolSlugs : [],
    explanation: defaultExplanation,
    formula: defaultFormula,
    example: defaultExample,
    faqs: defaultFaqs,
    canonicalCategory,
    canonicalSubcategory,
    canonicalRoute,
  };
});

export const TOOLS = TOOLS_REGISTRY;

export function getToolCanonicalCategory(tool: ToolMetadata): string {
  if (tool.canonicalCategory) return tool.canonicalCategory;
  const categoryObj = CATEGORIES.find((c) => c.id === tool.category);
  return categoryObj ? categoryObj.name : 'Tools';
}

export function getToolCanonicalSubcategory(tool: ToolMetadata): string {
  if (tool.canonicalSubcategory) return tool.canonicalSubcategory;
  const categoryObj = CATEGORIES.find((c) => c.id === tool.category);
  const subcatObj = categoryObj?.subcategories.find((s) => s.id === tool.subcategory);
  return subcatObj ? subcatObj.name : tool.subcategory;
}

export function getToolCanonicalRoute(tool: ToolMetadata): string {
  if (tool.canonicalRoute) return tool.canonicalRoute;
  const categoryObj = CATEGORIES.find((c) => c.id === tool.category);
  const catSlug = categoryObj ? categoryObj.slug : 'tools';
  return `/${catSlug}/${tool.slug}`;
}

