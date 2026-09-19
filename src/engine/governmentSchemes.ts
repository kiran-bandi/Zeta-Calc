/**
 * Government & Small Savings Schemes Calculation Engines
 * Highly deterministic, transparent models for PPF, NPS, EPF, VPF, SSY, KVP, POMIS, SCSS, NSC, APY, PO RD & PO FD.
 */

/**
 * 1. PPF Calculator (Public Provident Fund)
 * 15-Year Mandatory Lock-in, Yearly Interest Compounded Annually.
 */
export interface PPFInput {
  yearlyInvestment: number; // Max ₹1.5 Lakh / yr
  interestRate?: number; // % annual, defaults to 7.1%
  tenureYears?: number; // defaults to 15 years, can be extended in 5-year blocks
}

export interface PPFResult {
  totalInvested: number;
  totalInterestEarned: number;
  maturityAmount: number;
  yearlyBreakdown: {
    year: number;
    openingBalance: number;
    deposit: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculatePPF(input: PPFInput): PPFResult {
  const deposit = Math.max(0, input.yearlyInvestment);
  const rate = (input.interestRate !== undefined && input.interestRate > 0 ? input.interestRate : 7.1) / 100;
  const years = input.tenureYears && input.tenureYears >= 15 ? input.tenureYears : 15;

  let balance = 0;
  let totalInterest = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    const opening = balance;
    balance += deposit;
    const interest = balance * rate;
    totalInterest += interest;
    balance += interest;

    yearlyBreakdown.push({
      year: yr,
      openingBalance: Math.round(opening),
      deposit: Math.round(deposit),
      interestEarned: Math.round(interest),
      closingBalance: Math.round(balance),
    });
  }

  return {
    totalInvested: Math.round(deposit * years),
    totalInterestEarned: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}

/**
 * 2. NPS Calculator (National Pension System)
 */
export interface NPSInput {
  currentAge: number;
  retirementAge?: number; // defaults to 60
  monthlyInvestment: number;
  expectedAnnualReturnRate: number; // % annual, e.g. 10%
  annuityPercentage?: number; // % converted to annuity at retirement (min 40%)
  expectedAnnuityRate?: number; // % annuity pension yield, e.g. 6%
}

export interface NPSResult {
  totalInvested: number;
  totalAccumulatedCorpus: number;
  totalGains: number;
  lumpSumAmount: number; // Tax-free up to 60%
  annuityCorpusAmount: number; // min 40%
  expectedMonthlyPension: number;
  yearsOfContribution: number;
}

export function calculateNPS(input: NPSInput): NPSResult {
  const age = Math.max(18, Math.min(65, input.currentAge));
  const retAge = Math.max(age + 1, input.retirementAge || 60);
  const years = retAge - age;
  const monthly = Math.max(0, input.monthlyInvestment);
  const rAnnual = Math.max(0, input.expectedAnnualReturnRate) / 100;
  const iMonthly = Math.pow(1 + rAnnual, 1 / 12) - 1;
  const totalMonths = years * 12;

  const annuityPct = Math.min(100, Math.max(40, input.annuityPercentage || 40)) / 100;
  const annuityYieldAnnual = (input.expectedAnnuityRate !== undefined ? input.expectedAnnuityRate : 6) / 100;

  const totalCorpus = monthly * ((Math.pow(1 + iMonthly, totalMonths) - 1) / iMonthly) * (1 + iMonthly);
  const totalInvested = monthly * totalMonths;
  const totalGains = Math.max(0, totalCorpus - totalInvested);

  const annuityCorpus = totalCorpus * annuityPct;
  const lumpSum = totalCorpus * (1 - annuityPct);
  const monthlyPension = (annuityCorpus * annuityYieldAnnual) / 12;

  return {
    totalInvested: Math.round(totalInvested),
    totalAccumulatedCorpus: Math.round(totalCorpus),
    totalGains: Math.round(totalGains),
    lumpSumAmount: Math.round(lumpSum),
    annuityCorpusAmount: Math.round(annuityCorpus),
    expectedMonthlyPension: Math.round(monthlyPension),
    yearsOfContribution: years,
  };
}

/**
 * 3. EPF & VPF Calculator
 */
export interface EPFInput {
  currentMonthlyBasicSalary: number;
  employeeContributionPercent?: number; // standard 12%
  vpfContributionAmount?: number; // additional voluntary monthly amount
  annualSalaryGrowthRate?: number; // % annual salary hike
  currentEpfBalance?: number;
  interestRate?: number; // % annual, defaults to 8.25%
  currentAge: number;
  retirementAge?: number; // defaults to 58
}

export interface EPFResult {
  totalEmployeeContribution: number;
  totalEmployerContribution: number;
  totalVpfContribution: number;
  totalInterestEarned: number;
  finalEpfCorpus: number;
  yearlyBreakdown: {
    year: number;
    basicSalary: number;
    employeeShare: number;
    employerShare: number;
    vpfShare: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculateEPF(input: EPFInput): EPFResult {
  let basic = Math.max(0, input.currentMonthlyBasicSalary);
  const empPct = (input.employeeContributionPercent || 12) / 100;
  const vpfMonthly = Math.max(0, input.vpfContributionAmount || 0);
  const salaryHike = Math.max(0, input.annualSalaryGrowthRate || 0) / 100;
  const rate = (input.interestRate !== undefined ? input.interestRate : 8.25) / 100;
  const age = Math.max(18, input.currentAge);
  const retAge = Math.max(age + 1, input.retirementAge || 58);
  const years = retAge - age;

  let balance = Math.max(0, input.currentEpfBalance || 0);
  let totalEmp = 0;
  let totalEmpr = 0;
  let totalVpf = 0;
  let totalInterest = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= years; yr++) {
    const monthlyEmp = basic * empPct;
    // Employer EPF portion is 3.67% (8.33% goes to EPS subject to ceiling)
    const monthlyEmpr = basic * 0.0367;

    const yrEmp = monthlyEmp * 12;
    const yrEmpr = monthlyEmpr * 12;
    const yrVpf = vpfMonthly * 12;

    const opening = balance;
    const yearlyAdditions = yrEmp + yrEmpr + yrVpf;
    // Interest calculated on monthly running balance, standard annual approximation: (Opening * r) + (Additions * r / 2)
    const yrInt = opening * rate + yearlyAdditions * (rate / 2);

    balance = opening + yearlyAdditions + yrInt;
    totalEmp += yrEmp;
    totalEmpr += yrEmpr;
    totalVpf += yrVpf;
    totalInterest += yrInt;

    yearlyBreakdown.push({
      year: yr,
      basicSalary: Math.round(basic),
      employeeShare: Math.round(yrEmp),
      employerShare: Math.round(yrEmpr),
      vpfShare: Math.round(yrVpf),
      interestEarned: Math.round(yrInt),
      closingBalance: Math.round(balance),
    });

    basic *= 1 + salaryHike;
  }

  return {
    totalEmployeeContribution: Math.round(totalEmp),
    totalEmployerContribution: Math.round(totalEmpr),
    totalVpfContribution: Math.round(totalVpf),
    totalInterestEarned: Math.round(totalInterest),
    finalEpfCorpus: Math.round(balance),
    yearlyBreakdown,
  };
}

/**
 * 4. SSY Calculator (Sukanya Samriddhi Yojana)
 * Deposits for 15 years, Matures after 21 years from account opening.
 */
export interface SSYInput {
  yearlyDeposit: number;
  interestRate?: number; // defaults to 8.2%
}

export interface SSYResult {
  totalInvested: number;
  totalInterestEarned: number;
  maturityAmount: number;
  depositPeriodYears: number;
  maturityPeriodYears: number;
  yearlyBreakdown: {
    year: number;
    deposit: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculateSSY(input: SSYInput): SSYResult {
  const deposit = Math.max(0, input.yearlyDeposit);
  const rate = (input.interestRate !== undefined ? input.interestRate : 8.2) / 100;
  const depositYears = 15;
  const maturityYears = 21;

  let balance = 0;
  let totalInterest = 0;
  let totalInvested = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= maturityYears; yr++) {
    const dep = yr <= depositYears ? deposit : 0;
    balance += dep;
    totalInvested += dep;

    const interest = balance * rate;
    totalInterest += interest;
    balance += interest;

    yearlyBreakdown.push({
      year: yr,
      deposit: Math.round(dep),
      interestEarned: Math.round(interest),
      closingBalance: Math.round(balance),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalInterestEarned: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    depositPeriodYears: depositYears,
    maturityPeriodYears: maturityYears,
    yearlyBreakdown,
  };
}

/**
 * 5. KVP Calculator (Kisan Vikas Patra)
 * Doubles principal over fixed tenure: Period = (72 / rate) in years
 */
export interface KVPInput {
  depositAmount: number;
  interestRate?: number; // defaults to 7.5%
}

export interface KVPResult {
  investedAmount: number;
  maturityAmount: number;
  totalInterest: number;
  doublingMonths: number;
  doublingYearsString: string;
}

export function calculateKVP(input: KVPInput): KVPResult {
  const P = Math.max(0, input.depositAmount);
  const rate = input.interestRate !== undefined && input.interestRate > 0 ? input.interestRate : 7.5;
  // Rule of 72 exact formula for compound interest doubling
  // (1 + r/100)^t = 2 => t = ln(2) / ln(1 + r/100)
  const yearsExact = Math.log(2) / Math.log(1 + rate / 100);
  const months = Math.round(yearsExact * 12);
  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  return {
    investedAmount: Math.round(P),
    maturityAmount: Math.round(P * 2),
    totalInterest: Math.round(P),
    doublingMonths: months,
    doublingYearsString: `${years} Years ${remMonths > 0 ? `${remMonths} Months` : ''}`,
  };
}

/**
 * 6. POMIS Calculator (Post Office Monthly Income Scheme)
 * 5-year lock-in with monthly interest payout
 */
export interface POMISInput {
  depositAmount: number;
  interestRate?: number; // defaults to 7.4%
}

export interface POMISResult {
  investedAmount: number;
  monthlyIncome: number;
  annualIncome: number;
  totalIncomeOver5Years: number;
  principalReturnedAtMaturity: number;
}

export function calculatePOMIS(input: POMISInput): POMISResult {
  const P = Math.max(0, input.depositAmount);
  const rate = (input.interestRate !== undefined ? input.interestRate : 7.4) / 100;
  const annualIncome = P * rate;
  const monthlyIncome = annualIncome / 12;

  return {
    investedAmount: Math.round(P),
    monthlyIncome: Math.round(monthlyIncome),
    annualIncome: Math.round(annualIncome),
    totalIncomeOver5Years: Math.round(annualIncome * 5),
    principalReturnedAtMaturity: Math.round(P),
  };
}

/**
 * 7. SCSS Calculator (Senior Citizens Savings Scheme)
 * 5-year tenure with quarterly interest payouts
 */
export interface SCSSInput {
  depositAmount: number; // Max ₹30 Lakh
  interestRate?: number; // defaults to 8.2%
}

export interface SCSSResult {
  investedAmount: number;
  quarterlyInterestPayout: number;
  annualInterest: number;
  totalInterest5Years: number;
  principalReturnedAtMaturity: number;
}

export function calculateSCSS(input: SCSSInput): SCSSResult {
  const P = Math.max(0, input.depositAmount);
  const rate = (input.interestRate !== undefined ? input.interestRate : 8.2) / 100;
  const annualInterest = P * rate;
  const quarterly = annualInterest / 4;

  return {
    investedAmount: Math.round(P),
    quarterlyInterestPayout: Math.round(quarterly),
    annualInterest: Math.round(annualInterest),
    totalInterest5Years: Math.round(annualInterest * 5),
    principalReturnedAtMaturity: Math.round(P),
  };
}

/**
 * 8. NSC Calculator (National Savings Certificate)
 * 5-year compounding annually/semi-annually, payable at maturity.
 */
export interface NSCInput {
  depositAmount: number;
  interestRate?: number; // defaults to 7.7%
}

export interface NSCResult {
  investedAmount: number;
  totalInterest: number;
  maturityAmount: number;
  yearlyBreakdown: {
    year: number;
    openingBalance: number;
    interestEarned: number;
    closingBalance: number;
  }[];
}

export function calculateNSC(input: NSCInput): NSCResult {
  const P = Math.max(0, input.depositAmount);
  const rate = (input.interestRate !== undefined ? input.interestRate : 7.7) / 100;

  let balance = P;
  let totalInterest = 0;
  const yearlyBreakdown = [];

  for (let yr = 1; yr <= 5; yr++) {
    const opening = balance;
    const interest = opening * rate;
    totalInterest += interest;
    balance += interest;

    yearlyBreakdown.push({
      year: yr,
      openingBalance: Math.round(opening),
      interestEarned: Math.round(interest),
      closingBalance: Math.round(balance),
    });
  }

  return {
    investedAmount: Math.round(P),
    totalInterest: Math.round(totalInterest),
    maturityAmount: Math.round(balance),
    yearlyBreakdown,
  };
}

/**
 * 9. APY Calculator (Atal Pension Yojana)
 * Monthly contribution matrix for target pension ₹1,000 to ₹5,000 based on entry age (18 to 40)
 */
export interface APYInput {
  entryAge: number; // 18 - 40
  targetMonthlyPension: 1000 | 2000 | 3000 | 4000 | 5000;
}

export interface APYResult {
  monthlyContribution: number;
  entryAge: number;
  contributionYears: number;
  totalContribution: number;
  guaranteedMonthlyPension: number;
  guaranteedCorpusToNominee: number;
}

const APY_MATRIX: Record<number, Record<number, number>> = {
  18: { 1000: 42, 2000: 84, 3000: 126, 4000: 168, 5000: 210 },
  20: { 1000: 50, 2000: 100, 3000: 150, 4000: 198, 5000: 248 },
  25: { 1000: 76, 2000: 151, 3000: 226, 4000: 301, 5000: 376 },
  30: { 1000: 116, 2000: 231, 3000: 347, 4000: 462, 5000: 577 },
  35: { 1000: 181, 2000: 362, 3000: 543, 4000: 722, 5000: 902 },
  40: { 1000: 291, 2000: 582, 3000: 873, 4000: 1164, 5000: 1454 },
};

export function calculateAPY(input: APYInput): APYResult {
  const age = Math.min(40, Math.max(18, input.entryAge));
  const pension = input.targetMonthlyPension || 5000;
  const years = 60 - age;

  // Approximate contribution via linear interpolation between benchmark ages
  const benchmarkAges = [18, 20, 25, 30, 35, 40];
  let lowerAge = 18;
  let upperAge = 40;

  for (let i = 0; i < benchmarkAges.length - 1; i++) {
    if (age >= benchmarkAges[i] && age <= benchmarkAges[i + 1]) {
      lowerAge = benchmarkAges[i];
      upperAge = benchmarkAges[i + 1];
      break;
    }
  }

  const lowerVal = APY_MATRIX[lowerAge][pension];
  const upperVal = APY_MATRIX[upperAge][pension];
  const monthly =
    lowerAge === upperAge
      ? lowerVal
      : Math.round(lowerVal + ((age - lowerAge) / (upperAge - lowerAge)) * (upperVal - lowerVal));

  const totalContribution = monthly * years * 12;
  const nomineeCorpus = pension * 1700; // Standard government guaranteed nominee return ratio (e.g. ₹8.5L for ₹5K pension)

  return {
    monthlyContribution: monthly,
    entryAge: age,
    contributionYears: years,
    totalContribution,
    guaranteedMonthlyPension: pension,
    guaranteedCorpusToNominee: nomineeCorpus,
  };
}

/**
 * 10. Post Office Recurring Deposit (PO RD)
 * 5-year tenure with quarterly compounding
 */
export interface PORDInput {
  monthlyDeposit: number;
  interestRate?: number; // defaults to 6.7%
}

export interface PORDResult {
  totalInvested: number;
  totalInterest: number;
  maturityAmount: number;
  yearlyBreakdown: {
    year: number;
    invested: number;
    closingBalance: number;
  }[];
}

export function calculatePORD(input: PORDInput): PORDResult {
  const P = Math.max(0, input.monthlyDeposit);
  const annualRate = (input.interestRate !== undefined ? input.interestRate : 6.7) / 100;
  const totalMonths = 60; // 5 years

  // Quarterly compounding effective monthly rate: i = (1 + r/4)^(1/3) - 1
  const i = Math.pow(1 + annualRate / 4, 1 / 3) - 1;
  const maturityAmount = P * ((Math.pow(1 + i, totalMonths) - 1) / i) * (1 + i);
  const totalInvested = P * totalMonths;

  const yearlyBreakdown = [];
  for (let yr = 1; yr <= 5; yr++) {
    const m = yr * 12;
    const bal = P * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
    yearlyBreakdown.push({
      year: yr,
      invested: P * m,
      closingBalance: Math.round(bal),
    });
  }

  return {
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(Math.max(0, maturityAmount - totalInvested)),
    maturityAmount: Math.round(maturityAmount),
    yearlyBreakdown,
  };
}
