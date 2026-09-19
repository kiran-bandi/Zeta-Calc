/**
 * Phase 6: Salary & Education Calculation Engines
 * Pure TypeScript, deterministic, side-effect free.
 */

// 24. Pay Raise Calculator
export interface PayRaiseResult {
  currentAnnualSalary: number;
  newAnnualSalary: number;
  annualRaiseAmount: number;
  monthlyRaiseAmount: number;
  biWeeklyRaiseAmount: number;
  hourlyRaiseAmount: number;
  effectivePercentage: number;
}

export function calculatePayRaise(
  currentSalary: number | '',
  salaryPeriod: 'annual' | 'monthly' | 'hourly',
  raiseType: 'percent' | 'flat',
  raiseValue: number | ''
): PayRaiseResult | null {
  if (
    typeof currentSalary !== 'number' ||
    typeof raiseValue !== 'number' ||
    isNaN(currentSalary) ||
    isNaN(raiseValue) ||
    currentSalary <= 0 ||
    raiseValue <= 0
  ) {
    return null;
  }

  let baseAnnual = currentSalary;
  if (salaryPeriod === 'monthly') baseAnnual = currentSalary * 12;
  else if (salaryPeriod === 'hourly') baseAnnual = currentSalary * 2080;

  let annualRaise = 0;
  let effectivePct = 0;

  if (raiseType === 'percent') {
    effectivePct = raiseValue;
    annualRaise = baseAnnual * (raiseValue / 100);
  } else {
    annualRaise = raiseValue;
    effectivePct = Math.round((raiseValue / baseAnnual) * 10000) / 100;
  }

  const newAnnual = baseAnnual + annualRaise;

  return {
    currentAnnualSalary: Math.round(baseAnnual * 100) / 100,
    newAnnualSalary: Math.round(newAnnual * 100) / 100,
    annualRaiseAmount: Math.round(annualRaise * 100) / 100,
    monthlyRaiseAmount: Math.round((annualRaise / 12) * 100) / 100,
    biWeeklyRaiseAmount: Math.round((annualRaise / 26) * 100) / 100,
    hourlyRaiseAmount: Math.round((annualRaise / 2080) * 100) / 100,
    effectivePercentage: effectivePct,
  };
}

// 25. Weighted Grade Calculator
export interface GradeItem {
  id: string;
  name: string;
  score: number | '';
  maxScore?: number;
  weight: number | '';
}

export interface WeightedGradeResult {
  weightedGradeScore: number;
  letterGrade: string;
  earnedWeightedScore: number;
  gradedWeightTotal: number;
  remainingWeight: number;
}

function getLetterGrade(pct: number): string {
  if (pct >= 93) return 'A (4.0)';
  if (pct >= 90) return 'A- (3.7)';
  if (pct >= 87) return 'B+ (3.3)';
  if (pct >= 83) return 'B (3.0)';
  if (pct >= 80) return 'B- (2.7)';
  if (pct >= 77) return 'C+ (2.3)';
  if (pct >= 73) return 'C (2.0)';
  if (pct >= 70) return 'C- (1.7)';
  if (pct >= 60) return 'D (1.0)';
  return 'F (0.0)';
}

export function calculateWeightedGrade(items: GradeItem[]): WeightedGradeResult | null {
  const valid = items.filter(
    (it) => typeof it.score === 'number' && typeof it.weight === 'number' && !isNaN(it.score) && !isNaN(it.weight)
  ) as { id: string; name: string; score: number; maxScore?: number; weight: number }[];

  if (valid.length === 0) return null;

  let totalWeight = 0;
  let totalWeightedPoints = 0;

  for (const item of valid) {
    const max = item.maxScore && item.maxScore > 0 ? item.maxScore : 100;
    const normalizedScore = (item.score / max) * 100;
    totalWeightedPoints += (normalizedScore * item.weight) / 100;
    totalWeight += item.weight;
  }

  if (totalWeight <= 0) return null;

  const currentWeightedGrade = (totalWeightedPoints / totalWeight) * 100;
  const remainingWeight = Math.max(0, 100 - totalWeight);

  return {
    weightedGradeScore: Math.round(currentWeightedGrade * 10) / 10,
    letterGrade: getLetterGrade(currentWeightedGrade),
    earnedWeightedScore: Math.round(totalWeightedPoints * 10) / 10,
    gradedWeightTotal: Math.round(totalWeight * 10) / 10,
    remainingWeight: Math.round(remainingWeight * 10) / 10,
  };
}

// 26. Student Loan Refinance Calculator
export interface StudentLoanRefinanceResult {
  currentMonthlyPayment: number;
  newMonthlyPayment: number;
  monthlyDifference: number;
  currentTotalInterest: number;
  newTotalInterest: number;
  lifetimeSavings: number;
}

export function calculateStudentLoanRefinance(
  balance: number | '',
  currentApr: number | '',
  currentTermYears: number | '',
  newApr: number | '',
  newTermYears: number | ''
): StudentLoanRefinanceResult | null {
  if (
    typeof balance !== 'number' ||
    typeof currentApr !== 'number' ||
    typeof currentTermYears !== 'number' ||
    typeof newApr !== 'number' ||
    typeof newTermYears !== 'number' ||
    isNaN(balance) ||
    isNaN(currentApr) ||
    isNaN(currentTermYears) ||
    isNaN(newApr) ||
    isNaN(newTermYears) ||
    balance <= 0 ||
    currentApr < 0 ||
    newApr < 0 ||
    currentTermYears <= 0 ||
    newTermYears <= 0
  ) {
    return null;
  }

  const calcMonthly = (p: number, r: number, y: number) => {
    const mr = r / 100 / 12;
    const n = y * 12;
    if (mr === 0) return p / n;
    return (p * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  };

  const curPmt = calcMonthly(balance, currentApr, currentTermYears);
  const newPmt = calcMonthly(balance, newApr, newTermYears);

  const curTotalInterest = curPmt * currentTermYears * 12 - balance;
  const newTotalInterest = newPmt * newTermYears * 12 - balance;
  const lifetimeSavings = curTotalInterest - newTotalInterest;

  return {
    currentMonthlyPayment: Math.round(curPmt * 100) / 100,
    newMonthlyPayment: Math.round(newPmt * 100) / 100,
    monthlyDifference: Math.round((newPmt - curPmt) * 100) / 100,
    currentTotalInterest: Math.round(curTotalInterest * 100) / 100,
    newTotalInterest: Math.round(newTotalInterest * 100) / 100,
    lifetimeSavings: Math.round(lifetimeSavings * 100) / 100,
  };
}

// 27. Student Loan Repayment Calculator
export interface StudentLoanRepaymentResult {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  earlyPayoff?: {
    extraMonthlyPayment: number;
    payoffMonths: number;
    payoffYears: number;
    monthsSaved: number;
    interestSaved: number;
  };
}

export function calculateStudentLoanRepayment(
  balance: number | '',
  apr: number | '',
  termYears: number | '',
  extraMonthlyPayment: number | '' = 0
): StudentLoanRepaymentResult | null {
  if (
    typeof balance !== 'number' ||
    typeof apr !== 'number' ||
    typeof termYears !== 'number' ||
    isNaN(balance) ||
    isNaN(apr) ||
    isNaN(termYears) ||
    balance <= 0 ||
    apr < 0 ||
    termYears <= 0
  ) {
    return null;
  }

  const mr = apr / 100 / 12;
  const n = termYears * 12;
  let standardPmt = 0;
  if (mr === 0) {
    standardPmt = balance / n;
  } else {
    standardPmt = (balance * mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1);
  }

  const standardTotalPaid = standardPmt * n;
  const standardTotalInterest = standardTotalPaid - balance;

  const extra = typeof extraMonthlyPayment === 'number' && !isNaN(extraMonthlyPayment) && extraMonthlyPayment > 0 ? extraMonthlyPayment : 0;
  let earlyPayoff: StudentLoanRepaymentResult['earlyPayoff'] | undefined;

  if (extra > 0) {
    let curBal = balance;
    let extraMonths = 0;
    let extraInterestPaid = 0;
    const accelPmt = standardPmt + extra;

    while (curBal > 0.01 && extraMonths < 600) {
      extraMonths++;
      const interest = curBal * mr;
      let principal = accelPmt - interest;
      if (principal > curBal) principal = curBal;
      curBal -= principal;
      extraInterestPaid += interest;
    }

    const monthsSaved = Math.max(0, n - extraMonths);
    const interestSaved = Math.max(0, standardTotalInterest - extraInterestPaid);

    earlyPayoff = {
      extraMonthlyPayment: extra,
      payoffMonths: extraMonths,
      payoffYears: Math.round((extraMonths / 12) * 10) / 10,
      monthsSaved,
      interestSaved: Math.round(interestSaved * 100) / 100,
    };
  }

  return {
    monthlyPayment: Math.round(standardPmt * 100) / 100,
    totalPayments: Math.round(standardTotalPaid * 100) / 100,
    totalInterest: Math.round(standardTotalInterest * 100) / 100,
    earlyPayoff,
  };
}
