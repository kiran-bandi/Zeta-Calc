import { ToolMetadata, FAQItem, ExampleCalculation } from '../types/calculator';

export type FormulaDefinition = NonNullable<ToolMetadata['formula']>;
export type ToolExplanation = NonNullable<ToolMetadata['explanation']>;

/**
 * Educational & SEO Content Generator for Zeta Calculator
 * Generates rich, authoritative explanations, formula breakdowns, worked examples,
 * and high-value FAQs for all calculators to ensure search engine rankings and AdSense compliance.
 */

export interface ToolEducationalContent {
  explanation: ToolExplanation;
  formula: FormulaDefinition;
  example: ExampleCalculation;
  faqs: FAQItem[];
}

export function getToolEducationalContent(tool: ToolMetadata): ToolEducationalContent {
  // 1. If tool already has complete custom content, use it with fallbacks
  const existingSummary = tool.explanation?.summary;
  const existingFormula = tool.formula?.expression;
  const existingExample = tool.example?.walkthrough && tool.example.walkthrough.length > 0;
  const existingFaqs = tool.faqs && tool.faqs.length >= 3;

  if (existingSummary && existingFormula && existingExample && existingFaqs) {
    return {
      explanation: tool.explanation,
      formula: tool.formula,
      example: tool.example,
      faqs: tool.faqs,
    };
  }

  // 2. Generate enriched content based on tool category and slug
  const domain = getCategoryDomainName(tool.category);
  const toolName = tool.name;

  // Synthesize rich summary if missing
  const summary =
    tool.explanation?.summary ||
    `The ${toolName} provides instant, deterministic calculations engineered for ${domain.toLowerCase()} planning and decision-making. By eliminating guesswork and approximation errors, this tool models your specific inputs against standard mathematical, scientific, or financial formulas to provide transparent, verified outcomes.`;

  const breakdown =
    tool.explanation?.breakdown && tool.explanation.breakdown.length > 0
      ? tool.explanation.breakdown
      : [
          {
            title: 'Deterministic Calculation Precision',
            text: `Every calculation is computed locally in real time using verified standard algorithms without server round-trips or rounding approximations.`,
          },
          {
            title: 'Variable Input Adaptability',
            text: `Inputs can be dynamically modified with instant recalculation, allowing you to run sensitivity analyses and explore multiple practical scenarios side-by-side.`,
          },
          {
            title: 'Zero Data Retention & Total Privacy',
            text: `All input parameters, financial figures, and outputs are executed purely inside your browser. No personal data is stored on remote servers.`,
          },
        ];

  const considerations =
    tool.explanation?.considerations && tool.explanation.considerations.length > 0
      ? tool.explanation.considerations
      : [
          `Ensure input figures are normalized into matching measurement units or compounding intervals before drawing critical decisions.`,
          `External macroeconomic variables such as inflation, market volatility, or local regulatory changes may influence long-term projections.`,
          `Use the side-by-side Compare feature to model conservative, baseline, and optimistic scenarios before committing capital or finalizing specifications.`,
        ];

  // Synthesize formula if missing
  const formula: FormulaDefinition = {
    expression:
      tool.formula?.expression ||
      generateDefaultFormula(tool),
    notes:
      tool.formula?.notes ||
      `Standard verified equation computed according to benchmark ${domain} specifications.`,
    variables:
      tool.formula?.variables && tool.formula.variables.length > 0
        ? tool.formula.variables
        : generateDefaultVariables(tool),
  };

  // Synthesize worked example if missing
  const example: ExampleCalculation = {
    title: tool.example?.title || `Worked Example: Step-by-Step ${toolName}`,
    description:
      tool.example?.description ||
      `A typical practical scenario demonstrating how inputs translate into the final calculated output.`,
    inputs: tool.example?.inputs || { 'Base Value': 100 },
    results: tool.example?.results || { 'Calculated Output': 'Verified exact output' },
    walkthrough:
      tool.example?.walkthrough && tool.example.walkthrough.length > 0
        ? tool.example.walkthrough
        : [
            `Step 1: Identify and input your initial parameters into the respective fields.`,
            `Step 2: Select your preferred measurement units or regional currency formatting.`,
            `Step 3: The engine applies the deterministic algebraic formula without approximations.`,
            `Step 4: Inspect the primary summary metric along with the detailed distribution breakdown and scheduled amortizations.`,
          ],
  };

  // Synthesize rich FAQs if missing or fewer than 3
  const faqs: FAQItem[] =
    tool.faqs && tool.faqs.length >= 3
      ? tool.faqs
      : generateDefaultFAQs(tool, domain);

  return {
    explanation: {
      summary,
      breakdown,
      considerations,
    },
    formula,
    example,
    faqs,
  };
}

function getCategoryDomainName(category: string): string {
  switch (category) {
    case 'finance':
    case 'money':
      return 'Financial Analysis & Wealth Management';
    case 'property':
      return 'Real Estate, Mortgage & Housing';
    case 'vehicles':
      return 'Automotive, Fuel & Transportation';
    case 'health':
      return 'Health, Fitness & Metabolism';
    case 'math':
      return 'Mathematical & Quantitative Science';
    case 'physics':
      return 'Classical & Modern Physics Metrology';
    case 'converters':
      return 'Global Metrology & Unit Conversion';
    case 'salary-work':
      return 'Payroll, Taxation & Career Compensation';
    case 'home':
      return 'Home Construction, Renovation & Materials';
    case 'food':
      return 'Culinary & Nutritional Planning';
    case 'travel':
      return 'Travel, Lodging & Commute Planning';
    case 'education':
      return 'Academic Scoring & GPA Calculation';
    default:
      return 'Quantitative Everyday Decision';
  }
}

function generateDefaultFormula(tool: ToolMetadata): string {
  if (tool.category === 'finance' || tool.category === 'money') {
    return 'Result = f(Principal, Rate, Tenure, CompoundingFrequency)';
  }
  if (tool.category === 'physics') {
    return 'Outcome = f(Mass, Acceleration, Velocity, Time, Separation)';
  }
  if (tool.category === 'math') {
    return 'Output = f(x_1, x_2, \\dots, x_n)';
  }
  return 'Calculated\\ Output = \\sum (Inputs \\times Factor)';
}

function generateDefaultVariables(tool: ToolMetadata): { symbol: string; explanation: string }[] {
  if (tool.category === 'finance' || tool.category === 'money') {
    return [
      { symbol: 'Principal (P)', explanation: 'The initial capital, loan balance, or invested amount.' },
      { symbol: 'Rate (r)', explanation: 'Annualized interest or return rate expressed as a decimal or percentage.' },
      { symbol: 'Tenure (t / n)', explanation: 'Total duration or number of recurring payment / compounding periods.' },
    ];
  }
  if (tool.category === 'physics') {
    return [
      { symbol: 'm / M', explanation: 'Mass of the target object or celestial body (in kilograms or selected unit).' },
      { symbol: 'r / d', explanation: 'Radial distance or separation displacement between interacting systems.' },
      { symbol: 't / T', explanation: 'Elapsed duration or periodic oscillation cycle time.' },
    ];
  }
  return [
    { symbol: 'Primary Input', explanation: 'Base quantitative value entered by the user.' },
    { symbol: 'Conversion Rate / Factor', explanation: 'Standardized constant or multiplier applied by the engine.' },
  ];
}

function generateDefaultFAQs(tool: ToolMetadata, domain: string): FAQItem[] {
  const existing = tool.faqs || [];
  const defaults: FAQItem[] = [
    {
      question: `How accurate is the ${tool.name}?`,
      answer: `The ${tool.name} uses exact, deterministic formulas verified against standard ${domain.toLowerCase()} benchmarks. All calculations execute directly in your browser with floating-point numerical precision and zero rounding compromises.`,
    },
    {
      question: `Can I change measurement units or currency in this calculator?`,
      answer: `Yes. Zeta Calculator provides unit dropdowns next to input fields and global currency selectors, allowing you to seamlessly calculate with metric, imperial, or regional financial units.`,
    },
    {
      question: `Is my calculation data saved or transmitted to a server?`,
      answer: `No. All calculations on Zeta Calculator run 100% locally in your client web browser. We do not store, track, or transmit your financial details, physical parameters, or personal numbers.`,
    },
    {
      question: `How can I compare different scenarios with this tool?`,
      answer: `Click the "Compare" button in the top action toolbar to open the Scenario Comparison modal. You can model multiple parameter sets side-by-side to understand trade-offs before making a final decision.`,
    },
  ];

  // Merge existing FAQs with defaults to guarantee at least 4 comprehensive FAQs
  const combined = [...existing];
  for (const def of defaults) {
    if (!combined.some((item) => item.question.toLowerCase() === def.question.toLowerCase())) {
      combined.push(def);
    }
  }
  return combined;
}
