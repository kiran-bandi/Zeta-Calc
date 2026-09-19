/**
 * Property & Home Buying Decision Engines
 * Deterministic calculations for:
 * 1. Rent vs Buy Home Calculator
 * 2. Interest-Free / Parallel SIP Offset Home Loan Calculator
 * 3. Home Loan Prepayment vs SIP Calculator
 */

export interface RentVsBuyInput {
  homePrice: number;
  downPayment: number;
  loanAmount?: number;
  loanInterestRate: number; // % annual
  loanTermYears: number;
  monthlyRent: number;
  annualRentIncrease?: number; // % annual
  propertyAppreciationRate?: number; // % annual
  investmentReturnRate?: number; // % annual (opportunity cost return)
  annualMaintenanceRate?: number; // % of home price or fixed amount
  annualPropertyTaxRate?: number; // % of home price
  annualInsurance?: number;
  buyingCosts?: number; // closing costs, stamp duty, registration (e.g. 5-7%)
  sellingCosts?: number; // agent commission, legal (e.g. 6%)
  timeHorizonYears: number;

  // Upgraded flexible options:
  downPaymentMode?: 'amount' | 'percentage';
  downPaymentPercent?: number;
  ownershipCostMode?: 'percentage' | 'fixed';
  annualOwnershipCost?: number; // either % or fixed annual amount
  upfrontCostMode?: 'percentage' | 'fixed';
  upfrontCostValue?: number;
  sellingCostMode?: 'percentage' | 'fixed';
  sellingCostValue?: number;
  initialRentalDeposit?: number;
  otherRecurringOwnerCosts?: number; // monthly
  otherRecurringRenterCosts?: number; // monthly
}

export interface RentVsBuyResult {
  totalRentPaid: number;
  totalBuyingCost: number;
  finalHomeValue: number;
  outstandingLoanAtEnd: number;
  buyingEquity: number;
  netWealthBuying: number;
  netWealthRenting: number;
  wealthDifference: number; // positive means buying is ahead
  betterOption: 'buy' | 'rent' | 'neutral';
  breakEvenYear: number | null; // year when buying surpasses renting
  breakEvenMonth: number | null;
  monthlyEMI: number;
  loanAmount: number;
  totalOwnershipCosts: number;
  totalInvestmentContributions: number;
  renterInvestmentBalance: number;
  summaryMessage: string;
  yearlyComparison: {
    year: number;
    homeValue: number;
    outstandingLoan: number;
    monthlyRent: number;
    buyingNetWealth: number;
    rentPaidCumulative: number;
    rentingInvestmentPortfolio: number;
    rentingNetWealth: number;
  }[];
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const P = Math.max(0, input.homePrice || 0);

  // Compute effective down payment
  let dp = 0;
  if (input.downPaymentMode === 'percentage' && typeof input.downPaymentPercent === 'number') {
    dp = P * (Math.max(0, Math.min(100, input.downPaymentPercent)) / 100);
  } else {
    dp = Math.min(P, Math.max(0, input.downPayment || 0));
  }

  const loan = Math.max(0, input.loanAmount !== undefined && input.loanAmount > 0 ? input.loanAmount : P - dp);
  const loanRateAnnual = Math.max(0, input.loanInterestRate || 0);
  const r = loanRateAnnual / 100 / 12;
  const n = Math.max(1, Math.round((input.loanTermYears || 1) * 12));
  const horizonYears = Math.max(1, input.timeHorizonYears || 1);
  const totalHorizonMonths = Math.round(horizonYears * 12);

  // EMI
  let monthlyEMI = 0;
  if (loan > 0 && n > 0) {
    if (r === 0) {
      monthlyEMI = loan / n;
    } else {
      monthlyEMI = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const rentMonthlyInitial = Math.max(0, input.monthlyRent || 0);
  const rentGrowth = Math.max(0, (input.annualRentIncrease ?? 0)) / 100;
  const propGrowthAnnual = (input.propertyAppreciationRate ?? 0) / 100;
  const monthlyPropRate = propGrowthAnnual > -1 ? Math.pow(1 + propGrowthAnnual, 1 / 12) - 1 : 0;
  const invReturnAnnual = (input.investmentReturnRate ?? 0) / 100;
  const monthlyInvRate = invReturnAnnual > -1 ? Math.pow(1 + invReturnAnnual, 1 / 12) - 1 : 0;

  // Upfront buying cost
  let buyClosing = 0;
  if (input.upfrontCostMode === 'percentage' && typeof input.upfrontCostValue === 'number') {
    buyClosing = P * (Math.max(0, input.upfrontCostValue) / 100);
  } else if (typeof input.upfrontCostValue === 'number') {
    buyClosing = Math.max(0, input.upfrontCostValue);
  } else {
    buyClosing = Math.max(0, input.buyingCosts || 0);
  }

  // Initial out-of-pocket for buyer = Down Payment + Buying Costs
  const initialBuyerCapital = dp + buyClosing;

  // Renter starts with initialBuyerCapital invested in market (minus any initial deposit)
  const initialRenterDeposit = Math.max(0, input.initialRentalDeposit || 0);
  let renterPortfolio = Math.max(0, initialBuyerCapital - initialRenterDeposit);
  let cumulativeRent = initialRenterDeposit;
  let cumulativeBuyingOutflow = initialBuyerCapital;
  let cumulativeOwnershipCosts = 0;
  let cumulativeInvestmentContributions = renterPortfolio;

  let remainingLoanBalance = loan;
  const yearlyComparison: RentVsBuyResult['yearlyComparison'] = [];
  let breakEvenMonth: number | null = null;
  let breakEvenYear: number | null = null;

  for (let month = 1; month <= totalHorizonMonths; month++) {
    const yrIndex = Math.floor((month - 1) / 12);
    const yr = yrIndex + 1;

    // Rent for this month
    const currentMonthRent = rentMonthlyInitial * Math.pow(1 + rentGrowth, yrIndex);
    const renterMonthlyOutflow = currentMonthRent + Math.max(0, input.otherRecurringRenterCosts || 0);
    cumulativeRent += currentMonthRent;

    // Loan balance calculation for the month
    let currentInterest = 0;
    let currentPrincipal = 0;
    if (month <= n && remainingLoanBalance > 0) {
      if (r === 0) {
        currentInterest = 0;
        currentPrincipal = Math.min(remainingLoanBalance, monthlyEMI);
      } else {
        currentInterest = remainingLoanBalance * r;
        currentPrincipal = Math.min(remainingLoanBalance, monthlyEMI - currentInterest);
      }
      remainingLoanBalance = Math.max(0, remainingLoanBalance - currentPrincipal);
    } else {
      remainingLoanBalance = 0;
    }

    // Ownership costs
    let monthlyOwnershipCost = 0;
    if (input.ownershipCostMode === 'percentage' && typeof input.annualOwnershipCost === 'number') {
      const currentPropVal = P * Math.pow(1 + monthlyPropRate, month);
      monthlyOwnershipCost = (currentPropVal * (input.annualOwnershipCost / 100)) / 12;
    } else if (input.ownershipCostMode === 'fixed' && typeof input.annualOwnershipCost === 'number') {
      monthlyOwnershipCost = (input.annualOwnershipCost * Math.pow(1 + propGrowthAnnual, yrIndex)) / 12;
    } else {
      const annualMaint = (P * ((input.annualMaintenanceRate ?? 0) / 100)) * Math.pow(1 + propGrowthAnnual, yrIndex);
      const annualPropTax = (P * ((input.annualPropertyTaxRate ?? 0) / 100)) * Math.pow(1 + propGrowthAnnual, yrIndex);
      const annualIns = input.annualInsurance ?? 0;
      monthlyOwnershipCost = (annualMaint + annualPropTax + annualIns) / 12;
    }
    monthlyOwnershipCost += Math.max(0, input.otherRecurringOwnerCosts || 0);
    cumulativeOwnershipCosts += monthlyOwnershipCost;

    // Buyer monthly outflow
    const currentEMI = month <= n ? monthlyEMI : 0;
    const buyerMonthlyOutflow = currentEMI + monthlyOwnershipCost;
    cumulativeBuyingOutflow += buyerMonthlyOutflow;

    // Renter investment growth + savings difference
    renterPortfolio = renterPortfolio * (1 + monthlyInvRate);
    const monthlySavingsForRenter = buyerMonthlyOutflow - renterMonthlyOutflow;
    if (monthlySavingsForRenter > 0) {
      renterPortfolio += monthlySavingsForRenter;
      cumulativeInvestmentContributions += monthlySavingsForRenter;
    } else if (monthlySavingsForRenter < 0) {
      // If renting costs more than buying, draw down from portfolio but don't drop below zero unless deficit persists
      renterPortfolio = Math.max(0, renterPortfolio + monthlySavingsForRenter);
    }

    // Current property value & equity
    const currentPropValueAtMonth = P * Math.pow(1 + monthlyPropRate, month);
    let sellingExpenseAtMonth = 0;
    if (input.sellingCostMode === 'percentage' && typeof input.sellingCostValue === 'number') {
      sellingExpenseAtMonth = currentPropValueAtMonth * (Math.max(0, input.sellingCostValue) / 100);
    } else if (typeof input.sellingCostValue === 'number') {
      sellingExpenseAtMonth = Math.max(0, input.sellingCostValue);
    } else {
      const sellCostPct = Math.max(0, input.sellingCosts ?? 0) / 100;
      sellingExpenseAtMonth = currentPropValueAtMonth * sellCostPct;
    }

    const currentBuyerNetWealth = Math.max(0, currentPropValueAtMonth - remainingLoanBalance - sellingExpenseAtMonth);
    const currentRenterNetWealth = renterPortfolio;

    if (breakEvenMonth === null && currentBuyerNetWealth >= currentRenterNetWealth) {
      breakEvenMonth = month;
      breakEvenYear = Math.ceil(month / 12);
    }

    // Record yearly comparison milestone
    if (month % 12 === 0 || month === totalHorizonMonths) {
      yearlyComparison.push({
        year: yr,
        homeValue: Math.round(currentPropValueAtMonth),
        outstandingLoan: Math.round(remainingLoanBalance),
        monthlyRent: Math.round(currentMonthRent),
        buyingNetWealth: Math.round(currentBuyerNetWealth),
        rentPaidCumulative: Math.round(cumulativeRent),
        rentingInvestmentPortfolio: Math.round(renterPortfolio),
        rentingNetWealth: Math.round(currentRenterNetWealth),
      });
    }
  }

  // Final values
  const finalHomeValue = Math.round(P * Math.pow(1 + monthlyPropRate, totalHorizonMonths));
  let finalSellingCost = 0;
  if (input.sellingCostMode === 'percentage' && typeof input.sellingCostValue === 'number') {
    finalSellingCost = finalHomeValue * (Math.max(0, input.sellingCostValue) / 100);
  } else if (typeof input.sellingCostValue === 'number') {
    finalSellingCost = Math.max(0, input.sellingCostValue);
  } else {
    finalSellingCost = finalHomeValue * (Math.max(0, input.sellingCosts ?? 0) / 100);
  }

  const finalBuyerEquity = Math.max(0, finalHomeValue - remainingLoanBalance);
  const netWealthBuying = Math.round(Math.max(0, finalHomeValue - remainingLoanBalance - finalSellingCost));
  const netWealthRenting = Math.round(Math.max(0, renterPortfolio));
  const wealthDifference = netWealthBuying - netWealthRenting;

  let summaryMessage = 'Projected financial difference based on your assumptions';
  if (Math.abs(wealthDifference) <= 500) {
    summaryMessage = 'Buying and renting result in virtually identical projected net wealth under these assumptions.';
  } else if (wealthDifference > 0) {
    summaryMessage = `Buying has a higher projected net wealth under these assumptions.`;
  } else {
    summaryMessage = `Renting has a higher projected net wealth under these assumptions.`;
  }

  return {
    totalRentPaid: Math.round(cumulativeRent),
    totalBuyingCost: Math.round(cumulativeBuyingOutflow),
    finalHomeValue,
    outstandingLoanAtEnd: Math.round(remainingLoanBalance),
    buyingEquity: Math.round(finalBuyerEquity),
    netWealthBuying,
    netWealthRenting,
    wealthDifference: Math.round(wealthDifference),
    betterOption: wealthDifference > 1000 ? 'buy' : wealthDifference < -1000 ? 'rent' : 'neutral',
    breakEvenYear,
    breakEvenMonth,
    monthlyEMI: Math.round(monthlyEMI),
    loanAmount: Math.round(loan),
    totalOwnershipCosts: Math.round(cumulativeOwnershipCosts),
    totalInvestmentContributions: Math.round(cumulativeInvestmentContributions),
    renterInvestmentBalance: netWealthRenting,
    summaryMessage,
    yearlyComparison,
  };
}

/**
 * 2. Parallel SIP / Interest Offset Home Loan Strategy Calculator
 * Note: Clearly framed as a modeling strategy, not contractually interest-free.
 */
export interface InterestOffsetLoanInput {
  homePrice: number;
  downPayment: number;
  loanAmount: number;
  loanInterestRate: number; // % annual
  loanTermYears: number;
  monthlySipAmount: number;
  expectedSipReturnRate: number; // % annual
  sipStepUpPercent?: number; // annual % step up
  investmentDurationYears?: number; // defaults to loan term
}

export interface InterestOffsetLoanResult {
  monthlyEMI: number;
  totalPrincipal: number;
  normalLoanInterest: number;
  totalLoanRepayment: number;
  totalSipInvested: number;
  estimatedSipFutureValue: number;
  sipGains: number;
  interestOffsetAmount: number;
  interestOffsetPercentage: number;
  effectiveInterestCost: number;
  effectiveNetLoanCost: number;
  remainingInvestmentSurplus: number;
  isFullyOffset: boolean;
  yearlyProjection: {
    year: number;
    cumulativeLoanInterestPaid: number;
    cumulativeSipInvested: number;
    sipPortfolioValue: number;
    netOffsetPosition: number;
  }[];
}

export function calculateInterestOffsetLoan(input: InterestOffsetLoanInput): InterestOffsetLoanResult {
  const P = Math.max(0, input.loanAmount > 0 ? input.loanAmount : Math.max(0, input.homePrice - input.downPayment));
  const r = Math.max(0, input.loanInterestRate) / 100 / 12;
  const termYears = Math.max(1, input.loanTermYears);
  const n = termYears * 12;
  const invYears = input.investmentDurationYears && input.investmentDurationYears > 0 ? input.investmentDurationYears : termYears;

  let monthlyEMI = 0;
  if (P > 0 && n > 0) {
    if (r === 0) {
      monthlyEMI = P / n;
    } else {
      monthlyEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const totalLoanRepayment = monthlyEMI * n;
  const normalLoanInterest = Math.max(0, totalLoanRepayment - P);

  // SIP Growth simulation
  const initialSip = Math.max(0, input.monthlySipAmount);
  const sipReturnAnnual = Math.max(0, input.expectedSipReturnRate) / 100;
  const monthlySipRate = Math.pow(1 + sipReturnAnnual, 1 / 12) - 1;
  const stepUp = Math.max(0, input.sipStepUpPercent || 0) / 100;

  let sipBalance = 0;
  let totalSipInvested = 0;
  let remainingLoanPrincipal = P;
  let cumulativeInterestPaid = 0;

  const yearlyProjection = [];

  for (let yr = 1; yr <= Math.max(termYears, invYears); yr++) {
    const currentYearSip = initialSip * Math.pow(1 + stepUp, yr - 1);

    for (let m = 1; m <= 12; m++) {
      const monthIdx = (yr - 1) * 12 + m;

      // Loan tracking
      if (monthIdx <= n && remainingLoanPrincipal > 0) {
        const interest = remainingLoanPrincipal * r;
        cumulativeInterestPaid += interest;
        const principal = monthlyEMI - interest;
        remainingLoanPrincipal = Math.max(0, remainingLoanPrincipal - principal);
      }

      // SIP tracking
      if (yr <= invYears) {
        sipBalance = (sipBalance + currentYearSip) * (1 + monthlySipRate);
        totalSipInvested += currentYearSip;
      } else {
        sipBalance = sipBalance * (1 + monthlySipRate);
      }
    }

    yearlyProjection.push({
      year: yr,
      cumulativeLoanInterestPaid: Math.round(cumulativeInterestPaid),
      cumulativeSipInvested: Math.round(totalSipInvested),
      sipPortfolioValue: Math.round(sipBalance),
      netOffsetPosition: Math.round(sipBalance - cumulativeInterestPaid),
    });
  }

  const sipGains = Math.max(0, sipBalance - totalSipInvested);
  const interestOffsetAmount = Math.min(normalLoanInterest, sipGains);
  const interestOffsetPercentage = normalLoanInterest > 0 ? Math.min(100, (sipGains / normalLoanInterest) * 100) : 100;
  const effectiveInterestCost = Math.max(0, normalLoanInterest - sipGains);
  const effectiveNetLoanCost = P + effectiveInterestCost;
  const remainingInvestmentSurplus = Math.max(0, sipGains - normalLoanInterest);

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalPrincipal: Math.round(P),
    normalLoanInterest: Math.round(normalLoanInterest),
    totalLoanRepayment: Math.round(totalLoanRepayment),
    totalSipInvested: Math.round(totalSipInvested),
    estimatedSipFutureValue: Math.round(sipBalance),
    sipGains: Math.round(sipGains),
    interestOffsetAmount: Math.round(interestOffsetAmount),
    interestOffsetPercentage: Math.round(interestOffsetPercentage * 10) / 10,
    effectiveInterestCost: Math.round(effectiveInterestCost),
    effectiveNetLoanCost: Math.round(effectiveNetLoanCost),
    remainingInvestmentSurplus: Math.round(remainingInvestmentSurplus),
    isFullyOffset: sipGains >= normalLoanInterest,
    yearlyProjection,
  };
}

/**
 * 3. Home Loan Prepayment vs SIP Calculator
 */
export interface PrepaymentVsSipInput {
  outstandingLoan: number;
  loanInterestRate: number; // % annual
  remainingTenureMonths: number;
  monthlySurplus: number;
  sipExpectedReturnRate: number; // % annual
  prepaymentFrequency?: 'monthly' | 'quarterly' | 'yearly';
}

export interface PrepaymentVsSipResult {
  originalLoanClosureMonths: number;
  originalInterestPayable: number;
  
  // Prepayment Path
  prepaymentLoanClosureMonths: number;
  prepaymentTenureSavedMonths: number;
  prepaymentInterestPaid: number;
  prepaymentInterestSaved: number;
  
  // SIP Path (Keep paying normal EMI and invest surplus)
  sipTotalInvested: number;
  sipFutureValue: number;
  sipGains: number;
  
  // Net Wealth Comparison at End of Original Loan Term
  netWealthPrepaymentPath: number;
  netWealthSipPath: number;
  netDifference: number; // positive means SIP path is ahead
  recommendation: 'sip' | 'prepay' | 'neutral';
  breakEvenReturnRate: number; // SIP return required to match prepayment
  yearlyComparison: {
    year: number;
    prepayOutstandingLoan: number;
    prepayCumulativeInterest: number;
    sipPortfolioValue: number;
    sipCumulativeInvested: number;
  }[];
}

export function calculatePrepaymentVsSip(input: PrepaymentVsSipInput): PrepaymentVsSipResult {
  const P = Math.max(0, input.outstandingLoan);
  const r = Math.max(0, input.loanInterestRate) / 100 / 12;
  const n = Math.max(1, input.remainingTenureMonths);
  const surplus = Math.max(0, input.monthlySurplus);
  const sipReturnAnnual = Math.max(0, input.sipExpectedReturnRate) / 100;
  const monthlySipRate = Math.pow(1 + sipReturnAnnual, 1 / 12) - 1;

  // Normal EMI
  let normalEMI = 0;
  if (P > 0 && n > 0) {
    if (r === 0) {
      normalEMI = P / n;
    } else {
      normalEMI = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const originalInterestPayable = Math.max(0, normalEMI * n - P);

  // Path 1: Prepayment Simulation
  let prepayBalance = P;
  let prepayTotalInterest = 0;
  let prepayClosureMonth = n;

  for (let m = 1; m <= n; m++) {
    if (prepayBalance <= 0) break;
    const interest = prepayBalance * r;
    prepayTotalInterest += interest;
    const standardPrincipal = Math.min(prepayBalance, normalEMI - interest);
    let totalPrincipalPaid = standardPrincipal;

    // Apply surplus
    if (prepayBalance > standardPrincipal) {
      const extraPrepayment = Math.min(surplus, prepayBalance - standardPrincipal);
      totalPrincipalPaid += extraPrepayment;
    }

    prepayBalance = Math.max(0, prepayBalance - totalPrincipalPaid);

    if (prepayBalance === 0) {
      prepayClosureMonth = m;
      break;
    }
  }

  const prepaymentInterestSaved = Math.max(0, originalInterestPayable - prepayTotalInterest);
  const tenureSavedMonths = Math.max(0, n - prepayClosureMonth);

  // Path 2: SIP Simulation over full original loan tenure
  let sipPortfolio = 0;
  let sipTotalInvested = 0;

  for (let m = 1; m <= n; m++) {
    sipPortfolio = (sipPortfolio + surplus) * (1 + monthlySipRate);
    sipTotalInvested += surplus;
  }

  // Prepayment post-closure reinvestment path (once loan is closed, invest EMI + surplus)
  let prepayPathReinvestment = 0;
  for (let m = prepayClosureMonth + 1; m <= n; m++) {
    prepayPathReinvestment = (prepayPathReinvestment + normalEMI + surplus) * (1 + monthlySipRate);
  }

  const netWealthPrepaymentPath = Math.round(prepayPathReinvestment);
  const netWealthSipPath = Math.round(sipPortfolio);
  const netDifference = netWealthSipPath - netWealthPrepaymentPath;

  const totalYears = Math.ceil(n / 12);
  const yearlyComparison = [];
  let tempPrepayBal = P;
  let tempPrepayInt = 0;
  let tempSipVal = 0;
  let tempSipInv = 0;

  for (let yr = 1; yr <= totalYears; yr++) {
    for (let m = 1; m <= 12; m++) {
      const globalMonth = (yr - 1) * 12 + m;
      if (globalMonth <= n) {
        if (tempPrepayBal > 0) {
          const interest = tempPrepayBal * r;
          tempPrepayInt += interest;
          const stdPrincipal = Math.min(tempPrepayBal, normalEMI - interest);
          const extra = Math.min(surplus, tempPrepayBal - stdPrincipal);
          tempPrepayBal = Math.max(0, tempPrepayBal - (stdPrincipal + extra));
        }
        tempSipVal = (tempSipVal + surplus) * (1 + monthlySipRate);
        tempSipInv += surplus;
      }
    }

    yearlyComparison.push({
      year: yr,
      prepayOutstandingLoan: Math.round(tempPrepayBal),
      prepayCumulativeInterest: Math.round(tempPrepayInt),
      sipPortfolioValue: Math.round(tempSipVal),
      sipCumulativeInvested: Math.round(tempSipInv),
    });
  }

  return {
    originalLoanClosureMonths: n,
    originalInterestPayable: Math.round(originalInterestPayable),
    prepaymentLoanClosureMonths: prepayClosureMonth,
    prepaymentTenureSavedMonths: tenureSavedMonths,
    prepaymentInterestPaid: Math.round(prepayTotalInterest),
    prepaymentInterestSaved: Math.round(prepaymentInterestSaved),
    sipTotalInvested: Math.round(sipTotalInvested),
    sipFutureValue: Math.round(sipPortfolio),
    sipGains: Math.round(Math.max(0, sipPortfolio - sipTotalInvested)),
    netWealthPrepaymentPath,
    netWealthSipPath,
    netDifference,
    recommendation: netDifference > 5000 ? 'sip' : netDifference < -5000 ? 'prepay' : 'neutral',
    breakEvenReturnRate: input.loanInterestRate, // Approximate break-even return matches the loan interest rate
    yearlyComparison,
  };
}
