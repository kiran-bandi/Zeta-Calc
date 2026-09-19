/**
 * Deterministic Tax Impact / Scenario Comparison Engine
 * Zeta Calculator Generalized Multi-Scenario Tax Modeling
 */

export interface TaxBracketInput {
  upTo: number; // Upper limit of bracket (Infinity for top bracket)
  rate: number; // % rate for this tier (0 to 100)
}

export interface TaxScenarioInput {
  grossIncome: number;
  otherTaxableIncome?: number;
  preTaxDeductions?: number;
  taxDeductions?: number;
  taxCredits?: number;
  taxRateMode: 'effective_rate' | 'brackets';
  effectiveTaxRate?: number; // %
  brackets?: TaxBracketInput[];
  otherTax?: number;
}

export interface TaxBracketBreakdownRow {
  tierLabel: string;
  taxableAmount: number;
  rate: number;
  tax: number;
}

export interface SingleScenarioResult {
  grossIncome: number;
  otherTaxableIncome: number;
  totalIncome: number;
  preTaxDeductions: number;
  taxDeductions: number;
  taxableIncome: number;
  taxBeforeCredits: number;
  taxCredits: number;
  otherTax: number;
  estimatedTax: number;
  afterTaxIncome: number;
  effectiveTaxRate: number; // %
  bracketBreakdown: TaxBracketBreakdownRow[];
}

export interface TaxImpactComparisonResult {
  scenarioA: SingleScenarioResult;
  scenarioB: SingleScenarioResult;
  taxDifference: number; // scenarioB - scenarioA (positive means B pays more tax)
  afterTaxIncomeDifference: number; // scenarioB - scenarioA (positive means B has more take-home)
  effectiveTaxRateDifference: number; // scenarioB - scenarioA
  summaryMessage: string;
}

export function calculateSingleTaxScenario(input: TaxScenarioInput): SingleScenarioResult {
  const gross = Math.max(0, input.grossIncome || 0);
  const otherInc = Math.max(0, input.otherTaxableIncome || 0);
  const totalIncome = gross + otherInc;
  const preTax = Math.max(0, input.preTaxDeductions || 0);
  const deductions = Math.max(0, input.taxDeductions || 0);
  const taxableIncome = Math.max(0, totalIncome - preTax - deductions);

  let taxBeforeCredits = 0;
  const bracketBreakdown: TaxBracketBreakdownRow[] = [];

  if (input.taxRateMode === 'brackets' && Array.isArray(input.brackets) && input.brackets.length > 0) {
    const sortedBrackets = [...input.brackets].sort((a, b) => a.upTo - b.upTo);
    let prevThreshold = 0;
    let remainingTaxable = taxableIncome;

    for (let i = 0; i < sortedBrackets.length; i++) {
      const b = sortedBrackets[i];
      const tierCapacity = b.upTo === Infinity ? Infinity : Math.max(0, b.upTo - prevThreshold);
      const amountInTier = Math.min(remainingTaxable, tierCapacity);

      if (amountInTier > 0) {
        const tierTax = amountInTier * (Math.max(0, b.rate) / 100);
        taxBeforeCredits += tierTax;
        bracketBreakdown.push({
          tierLabel: b.upTo === Infinity ? `Above ${prevThreshold.toLocaleString()}` : `${prevThreshold.toLocaleString()} to ${b.upTo.toLocaleString()}`,
          taxableAmount: Math.round(amountInTier * 100) / 100,
          rate: b.rate,
          tax: Math.round(tierTax * 100) / 100,
        });
        remainingTaxable = Math.max(0, remainingTaxable - amountInTier);
      } else {
        bracketBreakdown.push({
          tierLabel: b.upTo === Infinity ? `Above ${prevThreshold.toLocaleString()}` : `${prevThreshold.toLocaleString()} to ${b.upTo.toLocaleString()}`,
          taxableAmount: 0,
          rate: b.rate,
          tax: 0,
        });
      }

      prevThreshold = b.upTo;
      if (remainingTaxable <= 0 && b.upTo !== Infinity) {
        // Still fill rest of brackets as 0 for transparency
      }
    }
  } else {
    // Simplified effective rate model
    const effRate = Math.max(0, Math.min(100, input.effectiveTaxRate || 0));
    taxBeforeCredits = taxableIncome * (effRate / 100);
    bracketBreakdown.push({
      tierLabel: 'Taxable Income Base',
      taxableAmount: taxableIncome,
      rate: effRate,
      tax: Math.round(taxBeforeCredits * 100) / 100,
    });
  }

  const credits = Math.max(0, input.taxCredits || 0);
  const otherTax = Math.max(0, input.otherTax || 0);
  const taxAfterCredits = Math.max(0, taxBeforeCredits - credits);
  const estimatedTax = Math.round((taxAfterCredits + otherTax) * 100) / 100;
  const afterTaxIncome = Math.round(Math.max(0, totalIncome - estimatedTax) * 100) / 100;
  const effectiveTaxRate = totalIncome > 0 ? Math.round((estimatedTax / totalIncome) * 10000) / 100 : 0;

  return {
    grossIncome: gross,
    otherTaxableIncome: otherInc,
    totalIncome,
    preTaxDeductions: preTax,
    taxDeductions: deductions,
    taxableIncome,
    taxBeforeCredits: Math.round(taxBeforeCredits * 100) / 100,
    taxCredits: credits,
    otherTax,
    estimatedTax,
    afterTaxIncome,
    effectiveTaxRate,
    bracketBreakdown,
  };
}

export function calculateTaxImpactComparison(
  scenarioA: TaxScenarioInput,
  scenarioB: TaxScenarioInput
): TaxImpactComparisonResult {
  const resA = calculateSingleTaxScenario(scenarioA);
  const resB = calculateSingleTaxScenario(scenarioB);

  const taxDiff = Math.round((resB.estimatedTax - resA.estimatedTax) * 100) / 100;
  const afterTaxDiff = Math.round((resB.afterTaxIncome - resA.afterTaxIncome) * 100) / 100;
  const effRateDiff = Math.round((resB.effectiveTaxRate - resA.effectiveTaxRate) * 100) / 100;

  let summaryMessage = '';
  if (Math.abs(taxDiff) < 1) {
    summaryMessage = 'Both scenarios result in virtually identical estimated tax.';
  } else if (taxDiff > 0) {
    summaryMessage = `Scenario B results in an estimated tax increase of ${Math.abs(taxDiff).toLocaleString()} compared to Scenario A.`;
  } else {
    summaryMessage = `Scenario B results in an estimated tax reduction of ${Math.abs(taxDiff).toLocaleString()} compared to Scenario A.`;
  }

  return {
    scenarioA: resA,
    scenarioB: resB,
    taxDifference: taxDiff,
    afterTaxIncomeDifference: afterTaxDiff,
    effectiveTaxRateDifference: effRateDiff,
    summaryMessage,
  };
}
