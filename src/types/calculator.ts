export type CategoryId =
  | 'finance'
  | 'money'
  | 'property'
  | 'vehicles'
  | 'shopping'
  | 'salary-work'
  | 'travel'
  | 'education'
  | 'home'
  | 'food'
  | 'health'
  | 'math'
  | 'date-time'
  | 'converters'
  | 'tools'
  | 'everyday'
  | 'loans'
  | 'savings'
  | 'investing'
  | 'math-everyday'
  | 'construction'
  | 'decision-center'
  | 'physics'
  | 'more-tools';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  popularToolSlugs: string[];
  subcategories: {
    id: string;
    name: string;
    description?: string;
  }[];
}

export type InputType = 'number' | 'currency' | 'percentage' | 'select' | 'date' | 'slider';

export interface CalculatorInputConfig {
  id: string;
  name: string;
  label: string;
  type: InputType;
  defaultValue: number | string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  prefix?: string;
  helpText?: string;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ExampleCalculation {
  title: string;
  description: string;
  inputs: Record<string, number | string>;
  results: Record<string, string>;
  walkthrough: string[];
}

export interface ToolMetadata {
  id: string;
  name: string;
  slug: string;
  category: CategoryId;
  canonicalCategory?: string;
  canonicalSubcategory?: string;
  canonicalRoute?: string;
  additionalCategories?: CategoryId[];
  subcategory: string;
  description: string;
  shortDescription: string;
  iconName: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  synonyms: string[];
  phrases?: string[];
  seo: {
    title: string;
    metaDescription: string;
    keywords: string[];
  };
  formula?: {
    expression: string;
    variables: { symbol: string; explanation: string }[];
    notes?: string;
  };
  explanation?: {
    summary: string;
    breakdown: { title: string; text: string }[];
    considerations?: string[];
  };
  example?: ExampleCalculation;
  faqs?: FAQItem[];
  relatedToolSlugs?: string[];
  sources?: {
    title: string;
    publisher: string;
    url?: string;
    sourceType?: string;
    accessedDate?: string;
  }[];
  lastReviewed?: string;
  methodology?: {
    calculationMethod: string;
    assumptions: string[];
    limitations: string[];
  };
  countryNotes?: string;
  relatedComparisons?: {
    title: string;
    slug: string;
    description: string;
  }[];
  status?: 'active' | 'beta' | 'planned';
}

export interface AmortizationRow {
  period: number;
  label: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterestToDate: number;
}

export interface EMIResult {
  monthlyEMI: number;
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  interestRatio: number; // percentage of total payment
  principalRatio: number;
  yearlyAmortization: AmortizationRow[];
  monthlyAmortization: AmortizationRow[];
}
