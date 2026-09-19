/**
 * Deterministic Property and Real Estate Calculation Engine
 */

export interface PropertyTaxInputs {
  propertyValue: number;
  assessmentRatioPercent?: number; // e.g. 100% or 80%
  taxRatePercent?: number; // e.g. 1.2%
  millageRate?: number; // mills (1 mill = $1 per $1,000 assessed value = 0.1%)
  countyTaxPercent?: number;
  cityTaxPercent?: number;
  schoolTaxPercent?: number;
}

export interface PropertyTaxResult {
  assessedValue: number;
  effectiveTaxRatePercent: number;
  annualTax: number;
  monthlyTax: number;
  quarterlyTax: number;
  taxBreakdown: {
    label: string;
    annualAmount: number;
    monthlyAmount: number;
    sharePercent: number;
  }[];
}

export function calculatePropertyTax(inputs: PropertyTaxInputs): PropertyTaxResult {
  const {
    propertyValue,
    assessmentRatioPercent = 100,
    taxRatePercent,
    millageRate,
    countyTaxPercent,
    cityTaxPercent,
    schoolTaxPercent,
  } = inputs;

  const validPropValue = Math.max(0, propertyValue || 0);
  const ratio = Math.max(0, Math.min(100, assessmentRatioPercent || 100)) / 100;
  const assessedValue = validPropValue * ratio;

  let totalRatePercent = 0;
  if (taxRatePercent !== undefined && taxRatePercent > 0) {
    totalRatePercent = taxRatePercent;
  } else if (millageRate !== undefined && millageRate > 0) {
    totalRatePercent = millageRate / 10; // 10 mills = 1.0%
  } else if (countyTaxPercent || cityTaxPercent || schoolTaxPercent) {
    totalRatePercent = (countyTaxPercent || 0) + (cityTaxPercent || 0) + (schoolTaxPercent || 0);
  } else {
    totalRatePercent = 1.2; // default standard benchmark
  }

  const annualTax = assessedValue * (totalRatePercent / 100);
  const monthlyTax = annualTax / 12;
  const quarterlyTax = annualTax / 4;

  const breakdown: PropertyTaxResult['taxBreakdown'] = [];

  if (countyTaxPercent || cityTaxPercent || schoolTaxPercent) {
    const sum = (countyTaxPercent || 0) + (cityTaxPercent || 0) + (schoolTaxPercent || 0);
    if (sum > 0) {
      if (schoolTaxPercent) {
        const annual = assessedValue * (schoolTaxPercent / 100);
        breakdown.push({
          label: 'School District',
          annualAmount: annual,
          monthlyAmount: annual / 12,
          sharePercent: (schoolTaxPercent / sum) * 100,
        });
      }
      if (countyTaxPercent) {
        const annual = assessedValue * (countyTaxPercent / 100);
        breakdown.push({
          label: 'County / District',
          annualAmount: annual,
          monthlyAmount: annual / 12,
          sharePercent: (countyTaxPercent / sum) * 100,
        });
      }
      if (cityTaxPercent) {
        const annual = assessedValue * (cityTaxPercent / 100);
        breakdown.push({
          label: 'City / Municipal Services',
          annualAmount: annual,
          monthlyAmount: annual / 12,
          sharePercent: (cityTaxPercent / sum) * 100,
        });
      }
    }
  } else {
    // Standard default proportional breakdown
    breakdown.push(
      {
        label: 'Local Public Schools',
        annualAmount: annualTax * 0.52,
        monthlyAmount: (annualTax * 0.52) / 12,
        sharePercent: 52,
      },
      {
        label: 'County Administration & Parks',
        annualAmount: annualTax * 0.28,
        monthlyAmount: (annualTax * 0.28) / 12,
        sharePercent: 28,
      },
      {
        label: 'City Infrastructure, Police & Fire',
        annualAmount: annualTax * 0.20,
        monthlyAmount: (annualTax * 0.20) / 12,
        sharePercent: 20,
      }
    );
  }

  return {
    assessedValue,
    effectiveTaxRatePercent: totalRatePercent * ratio,
    annualTax,
    monthlyTax,
    quarterlyTax,
    taxBreakdown: breakdown,
  };
}

export interface RentalYieldInputs {
  purchasePrice: number;
  monthlyRent: number;
  annualMaintenance?: number;
  annualInsurance?: number;
  annualPropertyTax?: number;
  propertyManagementPercent?: number; // e.g. 8%
  vacancyRatePercent?: number; // e.g. 5%
}

export interface RentalYieldResult {
  annualGrossRent: number;
  effectiveGrossIncome: number;
  annualOperatingExpenses: number;
  netOperatingIncome: number;
  grossRentalYieldPercent: number;
  netRentalYieldPercent: number; // Cap Rate
  monthlyCashFlow: number;
  expenseRatioPercent: number;
}

export function calculateRentalYield(inputs: RentalYieldInputs): RentalYieldResult {
  const purchasePrice = Math.max(0, inputs.purchasePrice || 0);
  const monthlyRent = Math.max(0, inputs.monthlyRent || 0);
  const vacancyRate = Math.max(0, Math.min(100, inputs.vacancyRatePercent || 0)) / 100;
  const managementRate = Math.max(0, Math.min(100, inputs.propertyManagementPercent || 0)) / 100;

  const annualGrossRent = monthlyRent * 12;
  const vacancyLoss = annualGrossRent * vacancyRate;
  const effectiveGrossIncome = Math.max(0, annualGrossRent - vacancyLoss);

  const managementFee = effectiveGrossIncome * managementRate;
  const maintenance = Math.max(0, inputs.annualMaintenance || 0);
  const insurance = Math.max(0, inputs.annualInsurance || 0);
  const propertyTax = Math.max(0, inputs.annualPropertyTax || 0);

  const annualOperatingExpenses = managementFee + maintenance + insurance + propertyTax;
  const netOperatingIncome = effectiveGrossIncome - annualOperatingExpenses;

  const grossRentalYieldPercent = purchasePrice > 0 ? (annualGrossRent / purchasePrice) * 100 : 0;
  const netRentalYieldPercent = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
  const monthlyCashFlow = netOperatingIncome / 12;
  const expenseRatioPercent = effectiveGrossIncome > 0 ? (annualOperatingExpenses / effectiveGrossIncome) * 100 : 0;

  return {
    annualGrossRent,
    effectiveGrossIncome,
    annualOperatingExpenses,
    netOperatingIncome,
    grossRentalYieldPercent,
    netRentalYieldPercent,
    monthlyCashFlow,
    expenseRatioPercent,
  };
}

export interface HomeAffordabilityInputs {
  annualGrossIncome: number;
  monthlyDebtPayments: number;
  downPaymentAvailable: number;
  interestRatePercent: number;
  loanTermYears: number;
  annualPropertyTaxRatePercent?: number; // e.g. 1.2%
  annualHomeInsuranceRatePercent?: number; // e.g. 0.5%
  frontEndDtiPercent?: number; // e.g. 28%
  backEndDtiPercent?: number; // e.g. 36%
}

export interface HomeAffordabilityResult {
  maxAffordableHomePrice: number;
  maxLoanAmount: number;
  downPaymentAmount: number;
  maxTotalMonthlyPayment: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  frontEndDtiAchieved: number;
  backEndDtiAchieved: number;
  monthlyGrossIncome: number;
}

export function calculateHomeAffordability(inputs: HomeAffordabilityInputs): HomeAffordabilityResult {
  const annualIncome = Math.max(0, inputs.annualGrossIncome || 0);
  const monthlyIncome = annualIncome / 12;
  const monthlyDebts = Math.max(0, inputs.monthlyDebtPayments || 0);
  const downPayment = Math.max(0, inputs.downPaymentAvailable || 0);
  const interestRate = Math.max(0, inputs.interestRatePercent || 0);
  const tenureYears = Math.max(1, inputs.loanTermYears || 30);
  const taxRate = (inputs.annualPropertyTaxRatePercent ?? 1.2) / 100;
  const insRate = (inputs.annualHomeInsuranceRatePercent ?? 0.5) / 100;
  const frontEndDti = (inputs.frontEndDtiPercent ?? 28) / 100;
  const backEndDti = (inputs.backEndDtiPercent ?? 36) / 100;

  // Max housing payment based on standard banking guidelines:
  // Front-end: 28% of gross monthly income
  const maxHousingFront = monthlyIncome * frontEndDti;
  // Back-end: 36% of gross income minus existing monthly debt
  const maxHousingBack = Math.max(0, (monthlyIncome * backEndDti) - monthlyDebts);

  // Lenders take the lower of the two rules
  const maxMonthlyHousingBudget = Math.min(maxHousingFront, maxHousingBack);

  if (maxMonthlyHousingBudget <= 0 || monthlyIncome <= 0) {
    return {
      maxAffordableHomePrice: downPayment,
      maxLoanAmount: 0,
      downPaymentAmount: downPayment,
      maxTotalMonthlyPayment: 0,
      monthlyPrincipalInterest: 0,
      monthlyPropertyTax: 0,
      monthlyInsurance: 0,
      frontEndDtiAchieved: 0,
      backEndDtiAchieved: monthlyIncome > 0 ? (monthlyDebts / monthlyIncome) * 100 : 0,
      monthlyGrossIncome: monthlyIncome,
    };
  }

  // Monthly mortgage factor for principal & interest
  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  let loanFactor = 1 / totalMonths; // 0% rate fallback
  if (monthlyRate > 0) {
    loanFactor = (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // Monthly payment = (HomePrice - DownPayment) * loanFactor + HomePrice * (taxRate / 12) + HomePrice * (insRate / 12)
  // MaxHousing = HomePrice * (loanFactor + (taxRate + insRate) / 12) - DownPayment * loanFactor
  // HomePrice = (MaxHousing + DownPayment * loanFactor) / (loanFactor + (taxRate + insRate) / 12)
  const combinedMonthlyEscrowRate = (taxRate + insRate) / 12;
  const denominator = loanFactor + combinedMonthlyEscrowRate;

  const maxAffordableHomePrice = Math.max(
    downPayment,
    Math.round((maxMonthlyHousingBudget + downPayment * loanFactor) / denominator)
  );

  const maxLoanAmount = Math.max(0, maxAffordableHomePrice - downPayment);
  const monthlyPrincipalInterest = maxLoanAmount * loanFactor;
  const monthlyPropertyTax = (maxAffordableHomePrice * taxRate) / 12;
  const monthlyInsurance = (maxAffordableHomePrice * insRate) / 12;
  const maxTotalMonthlyPayment = monthlyPrincipalInterest + monthlyPropertyTax + monthlyInsurance;

  return {
    maxAffordableHomePrice,
    maxLoanAmount,
    downPaymentAmount: downPayment,
    maxTotalMonthlyPayment,
    monthlyPrincipalInterest,
    monthlyPropertyTax,
    monthlyInsurance,
    frontEndDtiAchieved: monthlyIncome > 0 ? (maxTotalMonthlyPayment / monthlyIncome) * 100 : 0,
    backEndDtiAchieved: monthlyIncome > 0 ? ((maxTotalMonthlyPayment + monthlyDebts) / monthlyIncome) * 100 : 0,
    monthlyGrossIncome: monthlyIncome,
  };
}
