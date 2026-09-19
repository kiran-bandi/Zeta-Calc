import { EMIResult, AmortizationRow } from '../types/calculator';

export interface EMIInput {
  loanAmount: number;
  interestRate: number; // annual percentage e.g. 8.5
  tenure: number;
  tenureUnit: 'years' | 'months';
  prepaymentMonthly?: number; // optional extra payment per month
}

export interface EMIValidationResult {
  isValid: boolean;
  errors: {
    loanAmount?: string;
    interestRate?: string;
    tenure?: string;
  };
}

export function validateEMIInput(input: EMIInput): EMIValidationResult {
  const errors: { loanAmount?: string; interestRate?: string; tenure?: string } = {};

  if (isNaN(input.loanAmount) || input.loanAmount === null || input.loanAmount === undefined) {
    errors.loanAmount = 'Loan amount is required';
  } else if (input.loanAmount <= 0) {
    errors.loanAmount = 'Loan amount must be greater than zero';
  } else if (input.loanAmount > 10000000000) {
    errors.loanAmount = 'Loan amount exceeds maximum allowable limit';
  }

  if (isNaN(input.interestRate) || input.interestRate === null || input.interestRate === undefined) {
    errors.interestRate = 'Interest rate is required';
  } else if (input.interestRate < 0) {
    errors.interestRate = 'Interest rate cannot be negative';
  } else if (input.interestRate > 100) {
    errors.interestRate = 'Interest rate cannot exceed 100%';
  }

  if (isNaN(input.tenure) || input.tenure === null || input.tenure === undefined) {
    errors.tenure = 'Tenure is required';
  } else if (input.tenure <= 0) {
    errors.tenure = 'Tenure must be greater than zero';
  } else {
    const totalMonths = input.tenureUnit === 'years' ? input.tenure * 12 : input.tenure;
    if (totalMonths > 600) { // 50 years
      errors.tenure = 'Tenure cannot exceed 50 years (600 months)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Deterministic standard Equated Monthly Installment (EMI) formula:
 * EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * where:
 * P = Principal loan amount
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Loan duration in months
 */
export function calculateEMI(input: EMIInput): EMIResult {
  const validation = validateEMIInput(input);
  if (!validation.isValid) {
    return {
      monthlyEMI: 0,
      totalPrincipal: Math.max(0, input.loanAmount || 0),
      totalInterest: 0,
      totalPayment: Math.max(0, input.loanAmount || 0),
      interestRatio: 0,
      principalRatio: 100,
      yearlyAmortization: [],
      monthlyAmortization: [],
    };
  }

  const P = Math.max(0, input.loanAmount);
  const annualRate = Math.max(0, input.interestRate);
  const n = Math.round(input.tenureUnit === 'years' ? input.tenure * 12 : input.tenure);

  // Special case: 0% interest rate
  if (annualRate === 0) {
    const monthlyEMI = P / n;
    const monthlyAmortization: AmortizationRow[] = [];
    let remaining = P;
    for (let m = 1; m <= n; m++) {
      const principalPaid = Math.min(remaining, monthlyEMI);
      remaining = Math.max(0, remaining - principalPaid);
      monthlyAmortization.push({
        period: m,
        label: `Month ${m}`,
        emi: Math.round(principalPaid),
        principal: Math.round(principalPaid),
        interest: 0,
        balance: Math.round(remaining),
        totalInterestToDate: 0,
      });
    }

    // Yearly roll-up
    const yearlyAmortization = rollupToYearly(monthlyAmortization);

    return {
      monthlyEMI: Math.round(monthlyEMI),
      totalPrincipal: Math.round(P),
      totalInterest: 0,
      totalPayment: Math.round(P),
      interestRatio: 0,
      principalRatio: 100,
      yearlyAmortization,
      monthlyAmortization,
    };
  }

  // Standard compounding calculation
  const r = annualRate / 12 / 100;
  const factor = Math.pow(1 + r, n);
  const rawEMI = (P * r * factor) / (factor - 1);
  const emi = Math.round(rawEMI);

  // Generate complete monthly amortization schedule
  let balance = P;
  let accumulatedInterest = 0;
  const monthlyAmortization: AmortizationRow[] = [];

  for (let month = 1; month <= n; month++) {
    const interestForMonth = balance * r;
    let principalForMonth = rawEMI - interestForMonth;

    if (month === n || balance <= principalForMonth) {
      principalForMonth = balance;
      balance = 0;
    } else {
      balance -= principalForMonth;
    }

    accumulatedInterest += interestForMonth;

    monthlyAmortization.push({
      period: month,
      label: `Month ${month}`,
      emi: Math.round(principalForMonth + interestForMonth),
      principal: Math.round(principalForMonth),
      interest: Math.round(interestForMonth),
      balance: Math.max(0, Math.round(balance)),
      totalInterestToDate: Math.round(accumulatedInterest),
    });

    if (balance <= 0) break;
  }

  const totalInterest = Math.round(accumulatedInterest);
  const totalPayment = Math.round(P + totalInterest);
  const interestRatio = Math.round((totalInterest / totalPayment) * 1000) / 10;
  const principalRatio = Math.round((100 - interestRatio) * 10) / 10;

  const yearlyAmortization = rollupToYearly(monthlyAmortization);

  return {
    monthlyEMI: emi,
    totalPrincipal: Math.round(P),
    totalInterest,
    totalPayment,
    interestRatio,
    principalRatio,
    yearlyAmortization,
    monthlyAmortization,
  };
}

function rollupToYearly(monthlyList: AmortizationRow[]): AmortizationRow[] {
  const yearly: AmortizationRow[] = [];
  let currentYear = 1;
  let yearEMI = 0;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let lastBalance = 0;
  let lastTotalInterest = 0;

  monthlyList.forEach((row, index) => {
    yearEMI += row.emi;
    yearPrincipal += row.principal;
    yearInterest += row.interest;
    lastBalance = row.balance;
    lastTotalInterest = row.totalInterestToDate;

    const isYearEnd = (index + 1) % 12 === 0 || index === monthlyList.length - 1;
    if (isYearEnd) {
      yearly.push({
        period: currentYear,
        label: `Year ${currentYear}`,
        emi: Math.round(yearEMI),
        principal: Math.round(yearPrincipal),
        interest: Math.round(yearInterest),
        balance: lastBalance,
        totalInterestToDate: lastTotalInterest,
      });
      currentYear++;
      yearEMI = 0;
      yearPrincipal = 0;
      yearInterest = 0;
    }
  });

  return yearly;
}
