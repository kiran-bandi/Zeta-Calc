import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateMortgage,
  calculatePayment,
  calculateAutoLoan,
  calculateAmortization,
  calculateInterestRate,
  calculateRetirement,
  calculateInvestment,
  calculateInflation,
  calculateSalesTax,
  calculateIncomeTax,
  calculateSavingsGoal,
  calculateAnnuity,
} from '../../engine/financial';
import {
  calculatePropertyTax,
  calculateRentalYield,
  calculateHomeAffordability,
} from '../../engine/property';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw } from 'lucide-react';

interface FinancialExpandedViewsProps {
  toolSlug: string;
}

export const FinancialExpandedViews: React.FC<FinancialExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // 1. MORTGAGE CALCULATOR
  // ==========================================
  const [homePrice, setHomePrice] = useSessionState<number | ''>('mort_home_price', '');
  const [downPayment, setDownPayment] = useSessionState<number | ''>('mort_down_pmt', '');
  const [mortgageRate, setMortgageRate] = useSessionState<number | ''>('mort_rate', '');
  const [mortgageTermYears, setMortgageTermYears] = useSessionState<number | ''>('mort_term_yrs', '');
  const [mortgageTermMonths, setMortgageTermMonths] = useSessionState<number | ''>('mort_term_mos', '');
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useSessionState<number | ''>('mort_prop_tax', '');
  const [insuranceAnnual, setInsuranceAnnual] = useSessionState<number | ''>('mort_ins', '');
  const [hoaMonthly, setHoaMonthly] = useSessionState<number | ''>('mort_hoa', '');

  const resetMortgage = () => {
    setHomePrice('');
    setDownPayment('');
    setMortgageRate('');
    setMortgageTermYears('');
    setMortgageTermMonths('');
    setPropertyTaxAnnual('');
    setInsuranceAnnual('');
    setHoaMonthly('');
  };

  const mortgageNorm = useMemo(() => {
    return normalizeTerm({ years: mortgageTermYears, months: mortgageTermMonths });
  }, [mortgageTermYears, mortgageTermMonths]);

  const mortgageResult = useMemo(() => {
    if (
      typeof homePrice !== 'number' || homePrice <= 0 ||
      typeof mortgageRate !== 'number' || mortgageRate <= 0 ||
      !mortgageNorm.isValid
    ) {
      return null;
    }
    const dp = typeof downPayment === 'number' ? downPayment : 0;
    const tax = typeof propertyTaxAnnual === 'number' ? propertyTaxAnnual : 0;
    const ins = typeof insuranceAnnual === 'number' ? insuranceAnnual : 0;
    const hoa = typeof hoaMonthly === 'number' ? hoaMonthly : 0;

    const base = calculateMortgage({
      homeValue: homePrice,
      downPayment: dp,
      interestRate: mortgageRate,
      tenureYears: mortgageNorm.totalYears,
      annualPropertyTax: tax,
      annualHomeInsurance: ins,
    });

    return {
      ...base,
      totalMonthlyPayment: base.totalMonthlyPayment + hoa,
      hoaMonthly: hoa,
    };
  }, [homePrice, downPayment, mortgageRate, mortgageNorm, propertyTaxAnnual, insuranceAnnual, hoaMonthly]);

  // ==========================================
  // 2. AUTO LOAN CALCULATOR
  // ==========================================
  const [autoPrice, setAutoPrice] = useSessionState<number | ''>('auto_price', '');
  const [autoDown, setAutoDown] = useSessionState<number | ''>('auto_down', '');
  const [autoTradeIn, setAutoTradeIn] = useSessionState<number | ''>('auto_trade_in', '');
  const [autoRate, setAutoRate] = useSessionState<number | ''>('auto_rate', '');
  const [autoTermYears, setAutoTermYears] = useSessionState<number | ''>('auto_term_yrs', '');
  const [autoTermMonths, setAutoTermMonths] = useSessionState<number | ''>('auto_term_mos', '');
  const [autoTaxRate, setAutoTaxRate] = useSessionState<number | ''>('auto_tax_rate', '');

  const resetAuto = () => {
    setAutoPrice('');
    setAutoDown('');
    setAutoTradeIn('');
    setAutoRate('');
    setAutoTermYears('');
    setAutoTermMonths('');
    setAutoTaxRate('');
  };

  const autoNorm = useMemo(() => {
    return normalizeTerm({ years: autoTermYears, months: autoTermMonths });
  }, [autoTermYears, autoTermMonths]);

  const autoResult = useMemo(() => {
    if (
      typeof autoPrice !== 'number' || autoPrice <= 0 ||
      typeof autoRate !== 'number' || autoRate <= 0 ||
      !autoNorm.isValid
    ) {
      return null;
    }
    return calculateAutoLoan({
      vehiclePrice: autoPrice,
      downPayment: typeof autoDown === 'number' ? autoDown : 0,
      tradeInValue: typeof autoTradeIn === 'number' ? autoTradeIn : 0,
      interestRate: autoRate,
      loanTermMonths: autoNorm.totalMonths,
      salesTaxPercent: typeof autoTaxRate === 'number' ? autoTaxRate : 0,
    });
  }, [autoPrice, autoDown, autoTradeIn, autoRate, autoNorm, autoTaxRate]);

  // ==========================================
  // 3. PAYMENT CALCULATOR or LOAN CALCULATOR
  // ==========================================
  const [payPrincipal, setPayPrincipal] = useSessionState<number | ''>('pay_principal', '');
  const [payRate, setPayRate] = useSessionState<number | ''>('pay_rate', '');
  const [payTenureYears, setPayTenureYears] = useSessionState<number | ''>('pay_tenure_yrs', '');
  const [payTenureMonths, setPayTenureMonths] = useSessionState<number | ''>('pay_tenure_mos', '');

  const resetPayment = () => {
    setPayPrincipal('');
    setPayRate('');
    setPayTenureYears('');
    setPayTenureMonths('');
  };

  const payNorm = useMemo(() => {
    return normalizeTerm({ years: payTenureYears, months: payTenureMonths });
  }, [payTenureYears, payTenureMonths]);

  const paymentResult = useMemo(() => {
    if (
      typeof payPrincipal !== 'number' || payPrincipal <= 0 ||
      typeof payRate !== 'number' || payRate <= 0 ||
      !payNorm.isValid
    ) {
      return null;
    }
    return calculatePayment({
      loanAmount: payPrincipal,
      annualRate: payRate,
      termMonths: payNorm.totalMonths,
    });
  }, [payPrincipal, payRate, payNorm]);

  // ==========================================
  // 4. AMORTIZATION CALCULATOR
  // ==========================================
  const [amortPrincipal, setAmortPrincipal] = useSessionState<number | ''>('amort_principal', '');
  const [amortRate, setAmortRate] = useSessionState<number | ''>('amort_rate', '');
  const [amortYearsInput, setAmortYearsInput] = useSessionState<number | ''>('amort_years_in', '');
  const [amortMonthsInput, setAmortMonthsInput] = useSessionState<number | ''>('amort_months_in', '');
  const [amortExtra, setAmortExtra] = useSessionState<number | ''>('amort_extra', '');

  const resetAmortization = () => {
    setAmortPrincipal('');
    setAmortRate('');
    setAmortYearsInput('');
    setAmortMonthsInput('');
    setAmortExtra('');
  };

  const amortNorm = useMemo(() => {
    return normalizeTerm({ years: amortYearsInput, months: amortMonthsInput });
  }, [amortYearsInput, amortMonthsInput]);

  const amortResult = useMemo(() => {
    if (
      typeof amortPrincipal !== 'number' || amortPrincipal <= 0 ||
      typeof amortRate !== 'number' || amortRate <= 0 ||
      !amortNorm.isValid
    ) {
      return null;
    }
    const extra = typeof amortExtra === 'number' ? amortExtra : 0;
    return calculateAmortization(amortPrincipal, amortRate, amortNorm.totalMonths, extra);
  }, [amortPrincipal, amortRate, amortNorm, amortExtra]);

  // ==========================================
  // 5. INTEREST RATE CALCULATOR
  // ==========================================
  const [rateLoanAmount, setRateLoanAmount] = useSessionState<number | ''>('rate_loan_amount', '');
  const [rateMonthlyPay, setRateMonthlyPay] = useSessionState<number | ''>('rate_monthly_pay', '');
  const [rateTermYears, setRateTermYears] = useSessionState<number | ''>('rate_term_yrs', '');
  const [rateTermMonths, setRateTermMonths] = useSessionState<number | ''>('rate_term_mos', '');

  const resetInterestRate = () => {
    setRateLoanAmount('');
    setRateMonthlyPay('');
    setRateTermYears('');
    setRateTermMonths('');
  };

  const rateNorm = useMemo(() => {
    return normalizeTerm({ years: rateTermYears, months: rateTermMonths });
  }, [rateTermYears, rateTermMonths]);

  const solvedRate = useMemo(() => {
    if (
      typeof rateLoanAmount !== 'number' || rateLoanAmount <= 0 ||
      typeof rateMonthlyPay !== 'number' || rateMonthlyPay <= 0 ||
      !rateNorm.isValid
    ) {
      return null;
    }
    return calculateInterestRate(rateLoanAmount, rateMonthlyPay, rateNorm.totalMonths);
  }, [rateLoanAmount, rateMonthlyPay, rateNorm]);

  // ==========================================
  // 6. RETIREMENT CALCULATOR
  // ==========================================
  const [currentAge, setCurrentAge] = useSessionState<number | ''>('ret_curr_age', '');
  const [retireAge, setRetireAge] = useSessionState<number | ''>('ret_age', '');
  const [currentSavings, setCurrentSavings] = useSessionState<number | ''>('ret_curr_sav', '');
  const [monthlySavings, setMonthlySavings] = useSessionState<number | ''>('ret_mo_sav', '');
  const [targetMonthlySpend, setTargetMonthlySpend] = useSessionState<number | ''>('ret_spend', '');
  const [retireReturn, setRetireReturn] = useSessionState<number | ''>('ret_return', '');
  const [retireInflation, setRetireInflation] = useSessionState<number | ''>('ret_inf', '');

  const resetRetirement = () => {
    setCurrentAge('');
    setRetireAge('');
    setCurrentSavings('');
    setMonthlySavings('');
    setTargetMonthlySpend('');
    setRetireReturn('');
    setRetireInflation('');
  };

  const retireResult = useMemo(() => {
    if (
      typeof currentAge !== 'number' || currentAge <= 0 ||
      typeof retireAge !== 'number' || retireAge <= currentAge ||
      typeof targetMonthlySpend !== 'number' || targetMonthlySpend <= 0
    ) {
      return null;
    }
    const ret = typeof retireReturn === 'number' ? retireReturn : 7;
    const inf = typeof retireInflation === 'number' ? retireInflation : 3;
    const sav = typeof currentSavings === 'number' ? currentSavings : 0;
    const mSav = typeof monthlySavings === 'number' ? monthlySavings : 0;

    return calculateRetirement({
      currentAge,
      retirementAge: retireAge,
      lifeExpectancyAge: 85,
      currentSavings: sav,
      monthlySavings: mSav,
      annualReturnPreRetirement: ret,
      annualReturnPostRetirement: Math.max(3, ret - 3),
      inflationRate: inf,
      monthlySpendingInRetirement: targetMonthlySpend,
    });
  }, [currentAge, retireAge, currentSavings, monthlySavings, targetMonthlySpend, retireReturn, retireInflation]);

  // ==========================================
  // 7. INVESTMENT CALCULATOR
  // ==========================================
  const [invInitial, setInvInitial] = useSessionState<number | ''>('inv_init', '');
  const [invMonthly, setInvMonthly] = useSessionState<number | ''>('inv_mo', '');
  const [invReturn, setInvReturn] = useSessionState<number | ''>('inv_ret', '');
  const [invYearsInput, setInvYearsInput] = useSessionState<number | ''>('inv_yrs_in', '');
  const [invMonthsInput, setInvMonthsInput] = useSessionState<number | ''>('inv_mos_in', '');
  const [invInflation, setInvInflation] = useSessionState<number | ''>('inv_inf', '');

  const resetInvestment = () => {
    setInvInitial('');
    setInvMonthly('');
    setInvReturn('');
    setInvYearsInput('');
    setInvMonthsInput('');
    setInvInflation('');
  };

  const invNorm = useMemo(() => {
    return normalizeTerm({ years: invYearsInput, months: invMonthsInput });
  }, [invYearsInput, invMonthsInput]);

  const invResult = useMemo(() => {
    const hasInitial = typeof invInitial === 'number' && invInitial > 0;
    const hasMonthly = typeof invMonthly === 'number' && invMonthly > 0;
    if ((!hasInitial && !hasMonthly) || !invNorm.isValid) {
      return null;
    }
    const ret = typeof invReturn === 'number' ? invReturn : 8;
    const inf = typeof invInflation === 'number' ? invInflation : 2.5;

    return calculateInvestment({
      initialInvestment: typeof invInitial === 'number' ? invInitial : 0,
      monthlyContribution: typeof invMonthly === 'number' ? invMonthly : 0,
      expectedAnnualReturn: ret,
      timeHorizonYears: invNorm.totalYears,
      inflationRate: inf,
    });
  }, [invInitial, invMonthly, invReturn, invNorm, invInflation]);

  // ==========================================
  // 8. INFLATION CALCULATOR
  // ==========================================
  const [infAmount, setInfAmount] = useSessionState<number | ''>('inf_amt', '');
  const [infRate, setInfRate] = useSessionState<number | ''>('inf_rate', '');
  const [infYearsInput, setInfYearsInput] = useSessionState<number | ''>('inf_yrs_in', '');
  const [infMonthsInput, setInfMonthsInput] = useSessionState<number | ''>('inf_mos_in', '');

  const resetInflation = () => {
    setInfAmount('');
    setInfRate('');
    setInfYearsInput('');
    setInfMonthsInput('');
  };

  const infNorm = useMemo(() => {
    return normalizeTerm({ years: infYearsInput, months: infMonthsInput });
  }, [infYearsInput, infMonthsInput]);

  const infResult = useMemo(() => {
    if (
      typeof infAmount !== 'number' || infAmount <= 0 ||
      typeof infRate !== 'number' ||
      !infNorm.isValid
    ) {
      return null;
    }
    return calculateInflation({
      amount: infAmount,
      inflationRate: infRate,
      years: infNorm.totalYears,
    });
  }, [infAmount, infRate, infNorm]);

  // ==========================================
  // 9. SALES TAX CALCULATOR
  // ==========================================
  const [taxMode, setTaxMode] = useSessionState<'add' | 'reverse'>('stax_mode', 'add');
  const [taxAmount, setTaxAmount] = useSessionState<number | ''>('stax_amt', '');
  const [taxPercent, setTaxPercent] = useSessionState<number | ''>('stax_pct', '');

  const resetSalesTax = () => {
    setTaxMode('add');
    setTaxAmount('');
    setTaxPercent('');
  };

  const salesTaxResult = useMemo(() => {
    if (
      typeof taxAmount !== 'number' || taxAmount <= 0 ||
      typeof taxPercent !== 'number' || taxPercent < 0
    ) {
      return null;
    }
    return calculateSalesTax({
      amount: taxAmount,
      taxRatePercent: taxPercent,
      mode: taxMode === 'reverse' ? 'remove_tax' : 'add_tax',
    });
  }, [taxAmount, taxPercent, taxMode]);

  // ==========================================
  // 10. INCOME TAX CALCULATOR
  // ==========================================
  const [taxGross, setTaxGross] = useSessionState<number | ''>('itax_gross', '');
  const [taxRegime, setTaxRegime] = useSessionState<'us_single' | 'uk_standard' | 'in_new' | 'in_old' | 'generic' | ''>('itax_regime', '');
  const [taxDeduction, setTaxDeduction] = useSessionState<number | ''>('itax_ded', '');

  const resetIncomeTax = () => {
    setTaxGross('');
    setTaxRegime('');
    setTaxDeduction('');
  };

  const incomeTaxResult = useMemo(() => {
    if (typeof taxGross !== 'number' || taxGross <= 0 || !taxRegime) {
      return null;
    }
    return calculateIncomeTax({
      grossAnnualIncome: taxGross,
      deductions: typeof taxDeduction === 'number' ? taxDeduction : 0,
      regime: taxRegime,
    });
  }, [taxGross, taxDeduction, taxRegime]);

  // ==========================================
  // 11. PROPERTY TAX CALCULATOR
  // ==========================================
  const [propTaxValue, setPropTaxValue] = useSessionState<number | ''>('ptax_val', '');
  const [propTaxRate, setPropTaxRate] = useSessionState<number | ''>('ptax_rate', '');
  const [propTaxAssessmentRatio, setPropTaxAssessmentRatio] = useSessionState<number | ''>('ptax_ratio', '');

  const resetPropertyTax = () => {
    setPropTaxValue('');
    setPropTaxRate('');
    setPropTaxAssessmentRatio(100);
  };

  const propertyTaxResult = useMemo(() => {
    if (typeof propTaxValue !== 'number' || propTaxValue <= 0 || typeof propTaxRate !== 'number' || propTaxRate <= 0) {
      return null;
    }
    return calculatePropertyTax({
      propertyValue: propTaxValue,
      taxRatePercent: propTaxRate,
      assessmentRatioPercent: typeof propTaxAssessmentRatio === 'number' ? propTaxAssessmentRatio : 100,
    });
  }, [propTaxValue, propTaxRate, propTaxAssessmentRatio]);

  // ==========================================
  // 12. RENTAL YIELD CALCULATOR
  // ==========================================
  const [rentalPrice, setRentalPrice] = useSessionState<number | ''>('ryield_price', '');
  const [rentalMonthlyRent, setRentalMonthlyRent] = useSessionState<number | ''>('ryield_rent', '');
  const [rentalMaintenance, setRentalMaintenance] = useSessionState<number | ''>('ryield_maint', '');
  const [rentalInsurance, setRentalInsurance] = useSessionState<number | ''>('ryield_ins', '');
  const [rentalPropTax, setRentalPropTax] = useSessionState<number | ''>('ryield_ptax', '');
  const [rentalVacancyRate, setRentalVacancyRate] = useSessionState<number | ''>('ryield_vac', '');

  const resetRentalYield = () => {
    setRentalPrice('');
    setRentalMonthlyRent('');
    setRentalMaintenance('');
    setRentalInsurance('');
    setRentalPropTax('');
    setRentalVacancyRate('');
  };

  const rentalYieldResult = useMemo(() => {
    if (typeof rentalPrice !== 'number' || rentalPrice <= 0 || typeof rentalMonthlyRent !== 'number' || rentalMonthlyRent <= 0) {
      return null;
    }
    return calculateRentalYield({
      purchasePrice: rentalPrice,
      monthlyRent: rentalMonthlyRent,
      annualMaintenance: typeof rentalMaintenance === 'number' ? rentalMaintenance : 0,
      annualInsurance: typeof rentalInsurance === 'number' ? rentalInsurance : 0,
      annualPropertyTax: typeof rentalPropTax === 'number' ? rentalPropTax : 0,
      vacancyRatePercent: typeof rentalVacancyRate === 'number' ? rentalVacancyRate : 0,
    });
  }, [rentalPrice, rentalMonthlyRent, rentalMaintenance, rentalInsurance, rentalPropTax, rentalVacancyRate]);

  // ==========================================
  // 13. HOME AFFORDABILITY CALCULATOR
  // ==========================================
  const [affordIncome, setAffordIncome] = useSessionState<number | ''>('afford_inc', '');
  const [affordMonthlyDebts, setAffordMonthlyDebts] = useSessionState<number | ''>('afford_debts', '');
  const [affordDownPayment, setAffordDownPayment] = useSessionState<number | ''>('afford_down', '');
  const [affordRate, setAffordRate] = useSessionState<number | ''>('afford_rate', '');
  const [affordTermYears, setAffordTermYears] = useSessionState<number | ''>('afford_term_yrs', '');
  const [affordTermMonths, setAffordTermMonths] = useSessionState<number | ''>('afford_term_mos', '');

  const resetHomeAffordability = () => {
    setAffordIncome('');
    setAffordMonthlyDebts('');
    setAffordDownPayment('');
    setAffordRate('');
    setAffordTermYears('');
    setAffordTermMonths('');
  };

  const affordNorm = useMemo(() => {
    return normalizeTerm({ years: affordTermYears, months: affordTermMonths });
  }, [affordTermYears, affordTermMonths]);

  const affordabilityResult = useMemo(() => {
    if (typeof affordIncome !== 'number' || affordIncome <= 0 || typeof affordRate !== 'number' || affordRate <= 0 || !affordNorm.isValid) {
      return null;
    }
    return calculateHomeAffordability({
      annualGrossIncome: affordIncome,
      monthlyDebtPayments: typeof affordMonthlyDebts === 'number' ? affordMonthlyDebts : 0,
      downPaymentAvailable: typeof affordDownPayment === 'number' ? affordDownPayment : 0,
      interestRatePercent: affordRate,
      loanTermYears: affordNorm.totalYears,
    });
  }, [affordIncome, affordMonthlyDebts, affordDownPayment, affordRate, affordNorm]);

  // ==========================================
  // 14. SAVINGS GOAL CALCULATOR
  // ==========================================
  const [goalTarget, setGoalTarget] = useSessionState<number | ''>('goal_tgt', '');
  const [goalInitial, setGoalInitial] = useSessionState<number | ''>('goal_init', '');
  const [goalRate, setGoalRate] = useSessionState<number | ''>('goal_rate', '');
  const [goalYearsInput, setGoalYearsInput] = useSessionState<number | ''>('goal_yrs_in', '');
  const [goalMonthsInput, setGoalMonthsInput] = useSessionState<number | ''>('goal_mos_in', '');

  const resetSavingsGoal = () => {
    setGoalTarget('');
    setGoalInitial('');
    setGoalRate('');
    setGoalYearsInput('');
    setGoalMonthsInput('');
  };

  const goalNorm = useMemo(() => {
    return normalizeTerm({ years: goalYearsInput, months: goalMonthsInput });
  }, [goalYearsInput, goalMonthsInput]);

  const savingsGoalResult = useMemo(() => {
    if (typeof goalTarget !== 'number' || goalTarget <= 0 || !goalNorm.isValid) {
      return null;
    }
    return calculateSavingsGoal({
      targetAmount: goalTarget,
      initialDeposit: typeof goalInitial === 'number' ? goalInitial : 0,
      annualInterestRatePercent: typeof goalRate === 'number' ? goalRate : 0,
      timeYears: goalNorm.totalYears,
    });
  }, [goalTarget, goalInitial, goalRate, goalNorm]);

  // ==========================================
  // RENDER PER TOOL SLUG
  // ==========================================

  // 1. MORTGAGE CALCULATOR
  if (toolSlug === 'mortgage-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Mortgage Loan Parameters</h3>
          <button
            type="button"
            id="mortgage-reset-btn"
            onClick={resetMortgage}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="mortgage-home-price"
              label="Home Purchase Price"
              value={homePrice}
              onChange={setHomePrice}
              min={10000}
              max={5000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 400000"
              formattedDisplay={typeof homePrice === 'number' && homePrice > 0 ? formatMoney(homePrice) : undefined}
            />
            <NumberSliderInput
              id="mortgage-down-payment"
              label={`Down Payment ${typeof homePrice === 'number' && typeof downPayment === 'number' && homePrice > 0 ? `(${Math.round((downPayment / homePrice) * 100)}%)` : ''}`}
              value={downPayment}
              onChange={setDownPayment}
              min={0}
              max={typeof homePrice === 'number' ? homePrice : 1000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 80000"
              formattedDisplay={typeof downPayment === 'number' && downPayment > 0 ? formatMoney(downPayment) : undefined}
            />
            <NumberSliderInput
              id="mortgage-rate"
              label="Interest Rate (%)"
              value={mortgageRate}
              onChange={setMortgageRate}
              min={0.5}
              max={20}
              step={0.125}
              suffix="%"
              placeholder="e.g. 6.5"
            />
            <TermInput
              id="mortgage-term"
              label="Loan Term"
              years={mortgageTermYears}
              months={mortgageTermMonths}
              onChangeYears={setMortgageTermYears}
              onChangeMonths={setMortgageTermMonths}
              helpText="Mortgage duration in years and months"
            />
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Taxes, Insurance &amp; HOA (PITI)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Annual Property Tax</label>
                  <input
                    type="number"
                    placeholder="e.g. 4000"
                    value={propertyTaxAnnual}
                    onChange={(e) => setPropertyTaxAnnual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Annual Home Insurance</label>
                  <input
                    type="number"
                    placeholder="e.g. 1200"
                    value={insuranceAnnual}
                    onChange={(e) => setInsuranceAnnual(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Monthly HOA Fees</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    value={hoaMonthly}
                    onChange={(e) => setHoaMonthly(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {mortgageResult ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Monthly Payment
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(mortgageResult.totalMonthlyPayment)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Principal &amp; Interest</span>
                      <span className="font-bold text-base text-white">{formatMoney(mortgageResult.monthlyPrincipalAndInterest)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Taxes, Insurance &amp; HOA</span>
                      <span className="font-bold text-base text-emerald-400">
                        +{formatMoney(mortgageResult.monthlyPropertyTax + mortgageResult.monthlyHomeInsurance + (typeof hoaMonthly === 'number' ? hoaMonthly : 0))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Monthly Payment Breakdown</h3>
                  <DonutChart
                    size={180}
                    centerTitle="MONTHLY"
                    centerSubtitle={formatMoney(mortgageResult.totalMonthlyPayment)}
                    segments={[
                      {
                        label: 'Principal & Interest',
                        value: mortgageResult.monthlyPrincipalAndInterest,
                        color: '#2563eb',
                        formattedValue: formatMoney(mortgageResult.monthlyPrincipalAndInterest),
                      },
                      {
                        label: 'Property Taxes',
                        value: mortgageResult.monthlyPropertyTax,
                        color: '#10b981',
                        formattedValue: formatMoney(mortgageResult.monthlyPropertyTax),
                      },
                      {
                        label: 'Home Insurance',
                        value: mortgageResult.monthlyHomeInsurance,
                        color: '#f59e0b',
                        formattedValue: formatMoney(mortgageResult.monthlyHomeInsurance),
                      },
                      ...(typeof hoaMonthly === 'number' && hoaMonthly > 0
                        ? [
                            {
                              label: 'HOA Fees',
                              value: hoaMonthly,
                              color: '#8b5cf6',
                              formattedValue: formatMoney(hoaMonthly),
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Total Financed Principal</span>
                    <span className="font-bold text-slate-900 text-base mt-0.5 block">{formatMoney(mortgageResult.loanAmount)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Base Loan</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Total Lifetime Interest</span>
                    <span className="font-bold text-amber-600 text-base mt-0.5 block">{formatMoney(mortgageResult.totalInterest)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Borrowing Cost</span>
                  </div>
                  <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-blue-700 font-semibold block">Total Amount Payable</span>
                    <span className="font-black text-blue-950 text-base mt-0.5 block">{formatMoney(mortgageResult.totalPayment)}</span>
                    <span className="text-[10px] text-blue-600 block mt-0.5">Principal + Interest</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter loan details above</p>
                <p className="text-xs">Provide home price, interest rate, and term to see your monthly mortgage payment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTO LOAN CALCULATOR
  if (toolSlug === 'auto-loan-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Auto Loan Parameters</h3>
          <button
            type="button"
            id="auto-reset-btn"
            onClick={resetAuto}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="auto-price"
              label="Vehicle Purchase Price"
              value={autoPrice}
              onChange={setAutoPrice}
              min={1000}
              max={300000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 32000"
              formattedDisplay={typeof autoPrice === 'number' && autoPrice > 0 ? formatMoney(autoPrice) : undefined}
            />
            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                id="auto-down"
                label="Cash Down Payment"
                value={autoDown}
                onChange={setAutoDown}
                min={0}
                max={typeof autoPrice === 'number' ? autoPrice : 50000}
                step={500}
                prefix={currencySymbol}
                placeholder="e.g. 4000"
                formattedDisplay={typeof autoDown === 'number' && autoDown > 0 ? formatMoney(autoDown) : undefined}
              />
              <NumberSliderInput
                id="auto-trade-in"
                label="Trade-In Allowance"
                value={autoTradeIn}
                onChange={setAutoTradeIn}
                min={0}
                max={typeof autoPrice === 'number' ? autoPrice : 50000}
                step={500}
                prefix={currencySymbol}
                placeholder="e.g. 3000"
                formattedDisplay={typeof autoTradeIn === 'number' && autoTradeIn > 0 ? formatMoney(autoTradeIn) : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberSliderInput
                id="auto-rate"
                label="APR (%)"
                value={autoRate}
                onChange={setAutoRate}
                min={0.5}
                max={25}
                step={0.1}
                suffix="%"
                placeholder="e.g. 5.9"
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Sales Tax (%)</label>
                <input
                  type="number"
                  placeholder="e.g. 6.5"
                  value={autoTaxRate}
                  onChange={(e) => setAutoTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <TermInput
              id="auto-term"
              label="Loan Term"
              years={autoTermYears}
              months={autoTermMonths}
              onChangeYears={setAutoTermYears}
              onChangeMonths={setAutoTermMonths}
              helpText="Auto loan duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {autoResult ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Estimated Monthly Payment
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(autoResult.monthlyPayment)}
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Net Financed</span>
                      <span className="font-bold text-base text-white">{formatMoney(autoResult.loanAmount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Total Interest</span>
                      <span className="font-bold text-base text-amber-400">+{formatMoney(autoResult.totalInterest)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Total Loan Repayment</span>
                      <span className="font-bold text-base text-emerald-400">{formatMoney(autoResult.loanAmount + autoResult.totalInterest)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Total Vehicle Cost Breakdown</h3>
                  <DonutChart
                    size={180}
                    centerTitle="TOTAL COST"
                    centerSubtitle={formatMoney(autoResult.totalCost)}
                    segments={[
                      {
                        label: 'Vehicle Principal',
                        value: autoResult.loanAmount,
                        color: '#2563eb',
                        formattedValue: formatMoney(autoResult.loanAmount),
                      },
                      {
                        label: 'Total Interest',
                        value: autoResult.totalInterest,
                        color: '#f59e0b',
                        formattedValue: formatMoney(autoResult.totalInterest),
                      },
                      ...(autoResult.salesTaxAmount > 0
                        ? [
                            {
                              label: 'Sales Tax',
                              value: autoResult.salesTaxAmount,
                              color: '#10b981',
                              formattedValue: formatMoney(autoResult.salesTaxAmount),
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Total Loan Repayment</span>
                    <span className="font-bold text-blue-900 text-base mt-0.5 block">{formatMoney(autoResult.loanAmount + autoResult.totalInterest)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Financed + Interest</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Estimated Sales Tax</span>
                    <span className="font-bold text-slate-900 text-base mt-0.5 block">{formatMoney(autoResult.salesTaxAmount)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Vehicle Tax</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Total Vehicle Lifetime Cost</span>
                    <span className="font-bold text-slate-900 text-base mt-0.5 block">{formatMoney(autoResult.totalCost)}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Loan + Down + Trade-in</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter vehicle price, rate, and term</p>
                <p className="text-xs">Fill in parameters above to compute your monthly car loan payment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. PAYMENT CALCULATOR or LOAN CALCULATOR
  if (toolSlug === 'payment-calculator' || toolSlug === 'loan-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Loan Repayment Parameters</h3>
          <button
            type="button"
            id="payment-reset-btn"
            onClick={resetPayment}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="pay-principal"
              label="Principal Loan / Debt Balance"
              value={payPrincipal}
              onChange={setPayPrincipal}
              min={500}
              max={500000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 15000"
              formattedDisplay={typeof payPrincipal === 'number' && payPrincipal > 0 ? formatMoney(payPrincipal) : undefined}
            />
            <NumberSliderInput
              id="pay-rate"
              label="Annual Interest Rate (%)"
              value={payRate}
              onChange={setPayRate}
              min={0.5}
              max={35}
              step={0.25}
              suffix="%"
              placeholder="e.g. 9.5"
            />
            <TermInput
              id="pay-tenure"
              label="Repayment Tenure"
              years={payTenureYears}
              months={payTenureMonths}
              onChangeYears={setPayTenureYears}
              onChangeMonths={setPayTenureMonths}
              helpText="Repayment duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7">
            {paymentResult ? (
              <>
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fixed Monthly Installment</span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1 text-emerald-600">
                    {formatMoney(paymentResult.monthlyPayment)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Paid over {payNorm.totalMonths} monthly installments ({payNorm.totalYears} Years)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 text-center">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Loan Principal</span>
                    <span className="text-lg sm:text-xl font-bold text-slate-900 mt-1 block">{formatMoney(paymentResult.loanAmount)}</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Total Interest Cost</span>
                    <span className="text-lg sm:text-xl font-bold text-amber-600 mt-1 block">{formatMoney(paymentResult.totalInterest)}</span>
                  </div>
                  <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
                    <span className="text-xs text-blue-700 font-semibold block">Total Amount Repaid</span>
                    <span className="text-lg sm:text-xl font-black text-blue-950 mt-1 block">{formatMoney(paymentResult.totalPayment)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter principal, interest rate, and term</p>
                <p className="text-xs">Fill in loan parameters above to calculate your fixed installment schedule.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 4. AMORTIZATION CALCULATOR
  if (toolSlug === 'amortization-calculator' || toolSlug === 'loan-amortization') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Amortization Schedule Parameters</h3>
          <button
            type="button"
            id="amort-reset-btn"
            onClick={resetAmortization}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberSliderInput
            id="amort-principal"
            label="Loan Principal"
            value={amortPrincipal}
            onChange={setAmortPrincipal}
            min={1000}
            max={2000000}
            step={5000}
            prefix={currencySymbol}
            placeholder="e.g. 250000"
            formattedDisplay={typeof amortPrincipal === 'number' && amortPrincipal > 0 ? formatMoney(amortPrincipal) : undefined}
          />
          <NumberSliderInput
            id="amort-rate"
            label="Interest Rate (%)"
            value={amortRate}
            onChange={setAmortRate}
            min={1}
            max={20}
            step={0.25}
            suffix="%"
            placeholder="e.g. 6.0"
          />
          <TermInput
            id="amort-term"
            label="Loan Term"
            years={amortYearsInput}
            months={amortMonthsInput}
            onChangeYears={setAmortYearsInput}
            onChangeMonths={setAmortMonthsInput}
            helpText="Loan duration in years and months"
          />
          <NumberSliderInput
            id="amort-extra"
            label="Extra Monthly Principal"
            value={amortExtra}
            onChange={setAmortExtra}
            min={0}
            max={5000}
            step={50}
            prefix={currencySymbol}
            placeholder="e.g. 200"
            formattedDisplay={typeof amortExtra === 'number' && amortExtra > 0 ? formatMoney(amortExtra) : undefined}
          />
        </div>

        {amortResult ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 text-center">
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Base Monthly Payment</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(amortResult.standardMonthlyPayment)}</div>
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Interest Saved with Extra Pay</span>
                <div className="text-2xl font-bold text-emerald-700 mt-1">{formatMoney(amortResult.interestSavedWithExtra)}</div>
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Time Saved</span>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {Math.floor(amortResult.monthsSavedWithExtra / 12)} Yrs {amortResult.monthsSavedWithExtra % 12} Mo
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200 rounded-2xl p-5 text-center shadow-xs">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Loan Principal</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{typeof amortPrincipal === 'number' ? formatMoney(amortPrincipal) : '—'}</div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Interest Paid</span>
                <div className="text-xl font-bold text-amber-600 mt-1">{formatMoney(amortResult.totalInterest)}</div>
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total Amount Repaid</span>
                <div className="text-xl font-black text-blue-950 mt-1">{formatMoney(amortResult.totalPayment)}</div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 overflow-hidden">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Annual Amortization Schedule (First 12 Months Preview)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Principal Paid</th>
                      <th className="py-2.5 px-3">Interest Paid</th>
                      <th className="py-2.5 px-3">Total Payment</th>
                      <th className="py-2.5 px-3">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {amortResult.schedule.slice(0, 12).map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.month}</td>
                        <td className="py-2 px-3 text-emerald-600">{formatMoney(row.principal)}</td>
                        <td className="py-2 px-3 text-amber-600">{formatMoney(row.interest)}</td>
                        <td className="py-2 px-3 text-slate-900">{formatMoney(row.totalPayment)}</td>
                        <td className="py-2 px-3 font-bold text-slate-950">{formatMoney(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">Enter loan details above to view the amortization schedule</p>
            <p className="text-xs">Specify loan principal, interest rate, and term to generate full payment breakdown.</p>
          </div>
        )}
      </div>
    );
  }

  // 5. INTEREST RATE CALCULATOR
  if (toolSlug === 'interest-rate-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Interest Rate Solver Parameters</h3>
          <button
            type="button"
            id="rate-reset-btn"
            onClick={resetInterestRate}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="rate-loan"
              label="Borrowed Loan Amount"
              value={rateLoanAmount}
              onChange={setRateLoanAmount}
              min={500}
              max={500000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 20000"
              formattedDisplay={typeof rateLoanAmount === 'number' && rateLoanAmount > 0 ? formatMoney(rateLoanAmount) : undefined}
            />
            <NumberSliderInput
              id="rate-payment"
              label="Actual Monthly Payment Paid"
              value={rateMonthlyPay}
              onChange={setRateMonthlyPay}
              min={25}
              max={25000}
              step={25}
              prefix={currencySymbol}
              placeholder="e.g. 400"
              formattedDisplay={typeof rateMonthlyPay === 'number' && rateMonthlyPay > 0 ? formatMoney(rateMonthlyPay) : undefined}
            />
            <TermInput
              id="rate-term"
              label="Loan Duration"
              years={rateTermYears}
              months={rateTermMonths}
              onChangeYears={setRateTermYears}
              onChangeMonths={setRateTermMonths}
              helpText="Loan duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            {solvedRate !== null && typeof rateMonthlyPay === 'number' && rateNorm.isValid && typeof rateLoanAmount === 'number' ? (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Solved Annual Interest Rate (APR)</span>
                <div className="text-5xl font-extrabold text-emerald-600 tracking-tight mt-2">
                  {solvedRate}%
                </div>
                <p className="text-xs text-slate-500 mt-2">Calculated via Newton-Raphson numerical polynomial iteration</p>

                <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Principal Borrowed</span>
                    <span className="font-bold text-slate-900 text-sm mt-1 block">{formatMoney(rateLoanAmount)}</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Total Finance Charges</span>
                    <span className="font-bold text-amber-600 text-sm mt-1 block">
                      {formatMoney(Math.max(0, rateMonthlyPay * rateNorm.totalMonths - rateLoanAmount))}
                    </span>
                  </div>
                  <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
                    <span className="text-blue-700 font-semibold block">Total Amount Repaid</span>
                    <span className="font-black text-blue-950 text-sm mt-1 block">{formatMoney(rateMonthlyPay * rateNorm.totalMonths)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter loan parameters above</p>
                <p className="text-xs">Provide principal, monthly installment, and term to reverse-calculate the interest rate.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 6. RETIREMENT CALCULATOR
  if (toolSlug === 'retirement-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Retirement Horizon Parameters</h3>
          <button
            type="button"
            id="retire-reset-btn"
            onClick={resetRetirement}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                id="retire-current-age"
                label="Current Age"
                value={currentAge}
                onChange={setCurrentAge}
                min={18}
                max={75}
                step={1}
                suffix="Yrs"
                placeholder="e.g. 30"
              />
              <NumberSliderInput
                id="retire-target-age"
                label="Retirement Age"
                value={retireAge}
                onChange={setRetireAge}
                min={typeof currentAge === 'number' ? currentAge + 1 : 50}
                max={85}
                step={1}
                suffix="Yrs"
                placeholder="e.g. 65"
              />
            </div>
            <NumberSliderInput
              id="retire-savings"
              label="Current Savings / 401k Balance"
              value={currentSavings}
              onChange={setCurrentSavings}
              min={0}
              max={2000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 25000"
              formattedDisplay={typeof currentSavings === 'number' && currentSavings > 0 ? formatMoney(currentSavings) : undefined}
            />
            <NumberSliderInput
              id="retire-spending"
              label="Target Monthly Spending in Retirement"
              value={targetMonthlySpend}
              onChange={setTargetMonthlySpend}
              min={500}
              max={50000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 5000"
              formattedDisplay={typeof targetMonthlySpend === 'number' && targetMonthlySpend > 0 ? formatMoney(targetMonthlySpend) : undefined}
            />
            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                id="retire-return"
                label="Expected Return (%)"
                value={retireReturn}
                onChange={setRetireReturn}
                min={2}
                max={15}
                step={0.5}
                suffix="%"
                placeholder="e.g. 8.0"
              />
              <NumberSliderInput
                id="retire-inflation"
                label="Annual Inflation (%)"
                value={retireInflation}
                onChange={setRetireInflation}
                min={1}
                max={10}
                step={0.5}
                suffix="%"
                placeholder="e.g. 3.0"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            {retireResult ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Required Retirement Nest Egg
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(retireResult.requiredNestEgg)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Recommended Saving</span>
                      <span className="font-bold text-base text-emerald-400">{formatMoney(retireResult.recommendedMonthlySavings)}/mo</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Retirement Horizon</span>
                      <span className="font-bold text-base text-white">{retireResult.yearsInRetirement} Years</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Retirement Corpus Breakdown</h3>
                  <DonutChart
                    size={180}
                    centerTitle="NEST EGG"
                    centerSubtitle={formatMoney(retireResult.requiredNestEgg)}
                    segments={[
                      {
                        label: 'Projected Nest Egg',
                        value: retireResult.projectedNestEgg > 0 ? retireResult.projectedNestEgg : 0,
                        color: '#2563eb',
                        formattedValue: formatMoney(retireResult.projectedNestEgg),
                      },
                      {
                        label: 'Required Target Nest Egg',
                        value: retireResult.requiredNestEgg,
                        color: '#10b981',
                        formattedValue: formatMoney(retireResult.requiredNestEgg),
                      },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Years in Retirement</span>
                    <span className="font-bold text-slate-900 text-base mt-0.5 block">{retireResult.yearsInRetirement} Years</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 block">Status Assessment</span>
                    <span className="font-bold text-emerald-700 text-base mt-0.5 block">
                      {retireResult.isFunded ? 'On Track' : 'Needs Regular Saving'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter age and target retirement spending</p>
                <p className="text-xs">Fill in parameters above to evaluate your retirement nest egg requirement.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 7. INVESTMENT CALCULATOR
  if (toolSlug === 'investment-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Investment Growth Parameters</h3>
          <button
            type="button"
            id="inv-reset-btn"
            onClick={resetInvestment}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="inv-initial"
              label="Initial Lump Sum Deposit"
              value={invInitial}
              onChange={setInvInitial}
              min={0}
              max={500000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 10000"
              formattedDisplay={typeof invInitial === 'number' && invInitial > 0 ? formatMoney(invInitial) : undefined}
            />
            <NumberSliderInput
              id="inv-monthly"
              label="Monthly Contribution"
              value={invMonthly}
              onChange={setInvMonthly}
              min={0}
              max={10000}
              step={50}
              prefix={currencySymbol}
              placeholder="e.g. 500"
              formattedDisplay={typeof invMonthly === 'number' && invMonthly > 0 ? formatMoney(invMonthly) : undefined}
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberSliderInput
                id="inv-return"
                label="Return (%)"
                value={invReturn}
                onChange={setInvReturn}
                min={1}
                max={25}
                step={0.5}
                suffix="%"
                placeholder="e.g. 9.0"
              />
              <NumberSliderInput
                id="inv-inf"
                label="Inflation (%)"
                value={invInflation}
                onChange={setInvInflation}
                min={0}
                max={12}
                step={0.5}
                suffix="%"
                placeholder="e.g. 3.0"
              />
            </div>
            <TermInput
              id="inv-term"
              label="Investment Horizon"
              years={invYearsInput}
              months={invMonthsInput}
              onChangeYears={setInvYearsInput}
              onChangeMonths={setInvMonthsInput}
              helpText="Investment duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {invResult ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Nominal Future Portfolio Value
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(invResult.futureValueNominal)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Invested Amount</span>
                      <span className="font-bold text-base text-white">{formatMoney(invResult.totalContributed)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Est. Returns</span>
                      <span className="font-bold text-base text-emerald-400">+{formatMoney(invResult.totalGains)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                  <DonutChart
                    size={180}
                    centerTitle="MATURITY"
                    centerSubtitle={formatMoney(invResult.futureValueNominal)}
                    segments={[
                      {
                        label: 'Invested Amount',
                        value: invResult.totalContributed,
                        color: '#2563eb',
                        formattedValue: formatMoney(invResult.totalContributed),
                      },
                      {
                        label: 'Est. Returns',
                        value: invResult.totalGains,
                        color: '#10b981',
                        formattedValue: formatMoney(invResult.totalGains),
                      },
                    ]}
                  />
                </div>

                <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Real Inflation-Adjusted Wealth</span>
                  <div className="text-2xl font-bold text-blue-800 mt-1">
                    {formatMoney(invResult.futureValueReal)}
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Equivalent in today’s purchasing power after {invNorm.totalYears} years of inflation.</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter deposit and horizon details</p>
                <p className="text-xs">Specify contributions and timeline above to project your wealth compounding.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 8. INFLATION CALCULATOR
  if (toolSlug === 'inflation-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Purchasing Power &amp; Inflation Parameters</h3>
          <button
            type="button"
            id="inf-reset-btn"
            onClick={resetInflation}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <NumberSliderInput
              id="inf-amount"
              label="Base Amount Today"
              value={infAmount}
              onChange={setInfAmount}
              min={10}
              max={2000000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 100000"
              formattedDisplay={typeof infAmount === 'number' && infAmount > 0 ? formatMoney(infAmount) : undefined}
            />
            <NumberSliderInput
              id="inf-rate"
              label="Annual Inflation Rate (%)"
              value={infRate}
              onChange={setInfRate}
              min={0.1}
              max={30}
              step={0.25}
              suffix="%"
              placeholder="e.g. 3.5"
            />
            <TermInput
              id="inf-term"
              label="Time Horizon"
              years={infYearsInput}
              months={infMonthsInput}
              onChangeYears={setInfYearsInput}
              onChangeMonths={setInfMonthsInput}
              helpText="Inflation horizon in years and months"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7">
            {infResult ? (
              <>
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Future Cost of Goods</span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1 text-amber-600">
                    {formatMoney(infResult.futureEquivalentCost)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">What costs {formatMoney(typeof infAmount === 'number' ? infAmount : 0)} today will cost in {infNorm.totalYears} years</p>
                </div>

                <div className="my-6 bg-rose-50/80 border border-rose-200 p-4 rounded-xl text-center">
                  <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Future Purchasing Power of {formatMoney(typeof infAmount === 'number' ? infAmount : 0)} Cash</span>
                  <div className="text-3xl font-extrabold text-rose-700 mt-1">
                    {formatMoney(infResult.futurePurchasingPower)}
                  </div>
                  <p className="text-xs text-rose-900 mt-1">Cash loses {infResult.lossOfPurchasingPowerPercent}% of its value</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center text-xs">
                  <span className="text-slate-500 block">Cumulative Price Increase</span>
                  <span className="text-base font-bold text-slate-900">+{infResult.cumulativeInflationPercent}%</span>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter base cash amount and horizon</p>
                <p className="text-xs">Specify values above to measure purchasing power erosion over time.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 9. SALES TAX CALCULATOR
  if (toolSlug === 'sales-tax-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Sales Tax / VAT Parameters</h3>
          <button
            type="button"
            id="tax-reset-btn"
            onClick={resetSalesTax}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                id="sales-tax-mode-add"
                onClick={() => setTaxMode('add')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  taxMode === 'add' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Add Tax to Net Price
              </button>
              <button
                type="button"
                id="sales-tax-mode-reverse"
                onClick={() => setTaxMode('reverse')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  taxMode === 'reverse' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reverse Tax from Total Receipt
              </button>
            </div>

            <NumberSliderInput
              id="tax-amount"
              label={taxMode === 'add' ? 'Pre-Tax Net Price' : 'Gross Receipt Total'}
              value={taxAmount}
              onChange={setTaxAmount}
              min={1}
              max={50000}
              step={5}
              prefix={currencySymbol}
              placeholder="e.g. 150"
              formattedDisplay={typeof taxAmount === 'number' && taxAmount > 0 ? formatMoney(taxAmount) : undefined}
            />

            <NumberSliderInput
              id="tax-percent"
              label="Sales Tax / VAT / GST Rate (%)"
              value={taxPercent}
              onChange={setTaxPercent}
              min={0}
              max={40}
              step={0.25}
              suffix="%"
              placeholder="e.g. 8.25"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7">
            {salesTaxResult ? (
              <>
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {taxMode === 'add' ? 'Final Total with Tax' : 'Base Pre-Tax Price'}
                  </span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1 text-emerald-600">
                    {formatMoney(taxMode === 'add' ? salesTaxResult.grossAmount : salesTaxResult.netAmount)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Tax Amount: {formatMoney(salesTaxResult.taxAmount)}</p>
                </div>

                <div className="space-y-3 my-6 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Net Pre-Tax Base:</span>
                    <span className="font-bold text-slate-900">{formatMoney(salesTaxResult.netAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Tax Assessed ({taxPercent}%):</span>
                    <span className="font-bold text-emerald-600">+{formatMoney(salesTaxResult.taxAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-base">
                    <span className="font-bold text-slate-900">Total Gross Amount:</span>
                    <span className="font-extrabold text-slate-950">{formatMoney(salesTaxResult.grossAmount)}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter price and tax percentage above</p>
                <p className="text-xs">Calculate gross checkout total or back-out net amounts and assessed taxes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 10. INCOME TAX CALCULATOR
  if (toolSlug === 'income-tax-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Annual Income Tax Parameters</h3>
          <button
            type="button"
            id="income-tax-reset-btn"
            onClick={resetIncomeTax}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tax Jurisdiction</label>
              <select
                id="income-tax-regime"
                value={taxRegime}
                onChange={(e) => {
                  const reg = e.target.value as 'us_single' | 'uk_standard' | 'in_new' | 'in_old' | 'generic' | '';
                  setTaxRegime(reg);
                }}
                className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="">Select tax jurisdiction...</option>
                <option value="us_single">United States (Federal Single Filer)</option>
                <option value="uk_standard">United Kingdom (Personal Allowance)</option>
                <option value="in_new">India (New Tax Regime 2024-25 - Std Ded ₹75k)</option>
                <option value="in_old">India (Old Tax Regime - Slabs & Deductions)</option>
                <option value="generic">Generic Progressive Brackets</option>
              </select>
            </div>

            <NumberSliderInput
              id="tax-gross"
              label="Gross Annual Income"
              value={taxGross}
              onChange={setTaxGross}
              min={1000}
              max={1000000}
              step={2500}
              prefix={currencySymbol}
              placeholder="e.g. 85000"
              formattedDisplay={typeof taxGross === 'number' && taxGross > 0 ? formatMoney(taxGross) : undefined}
            />

            <NumberSliderInput
              id="tax-deduction"
              label="Standard Deduction / Exemptions"
              value={taxDeduction}
              onChange={setTaxDeduction}
              min={0}
              max={100000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 14600"
              formattedDisplay={typeof taxDeduction === 'number' && taxDeduction > 0 ? formatMoney(taxDeduction) : undefined}
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7">
            {incomeTaxResult ? (
              <>
                <div className="text-center pb-6 border-b border-slate-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Total Income Tax</span>
                  <div className="text-4xl font-extrabold text-slate-900 tracking-tight mt-1 text-rose-600">
                    {formatMoney(incomeTaxResult.totalTax)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Effective Tax Rate: {incomeTaxResult.effectiveTaxRatePercent}%</p>
                </div>

                <div className="grid grid-cols-2 gap-3 my-6 text-center">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Annual Take-Home Pay</span>
                    <span className="text-lg font-bold text-emerald-600 mt-1 block">{formatMoney(incomeTaxResult.netAnnualTakeHome)}</span>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 block">Monthly Net Pay</span>
                    <span className="text-lg font-bold text-emerald-600 mt-1 block">{formatMoney(incomeTaxResult.monthlyTakeHome)}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-700 block mb-2">Bracket Breakdown</span>
                  {incomeTaxResult.bracketBreakdown.map((b, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">{b.bracket}</span>
                      <span className="font-mono font-semibold text-slate-900">{formatMoney(b.taxInBracket)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter gross annual income above</p>
                <p className="text-xs">Calculate tax liabilities, effective percentage rate, and monthly take-home net pay.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 11. PROPERTY TAX CALCULATOR
  if (toolSlug === 'property-tax-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Property Tax Assessment</h3>
          <button
            type="button"
            onClick={resetPropertyTax}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <NumberSliderInput
              id="prop-tax-val"
              label="Property Market / Appraised Value"
              value={propTaxValue}
              onChange={setPropTaxValue}
              min={10000}
              max={10000000}
              step={10000}
              placeholder="e.g. 350000"
              prefix={currencySymbol}
              formattedDisplay={typeof propTaxValue === 'number' && propTaxValue > 0 ? formatMoney(propTaxValue) : undefined}
            />
            <NumberSliderInput
              id="prop-tax-rate"
              label="Property Tax Rate (% p.a.)"
              value={propTaxRate}
              onChange={setPropTaxRate}
              min={0.1}
              max={10}
              step={0.05}
              placeholder="e.g. 1.25"
              suffix="%"
            />
            <NumberSliderInput
              id="prop-tax-ratio"
              label="Assessment Ratio (%)"
              value={propTaxAssessmentRatio}
              onChange={setPropTaxAssessmentRatio}
              min={10}
              max={100}
              step={5}
              placeholder="100"
              suffix="%"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
            {propertyTaxResult ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Annual Property Tax</span>
                  <div className="text-4xl font-extrabold text-blue-600 mt-1">
                    {formatMoney(propertyTaxResult.annualTax)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Monthly Escrow</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(propertyTaxResult.monthlyTax)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Quarterly Payment</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(propertyTaxResult.quarterlyTax)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Taxable Assessed Value</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(propertyTaxResult.assessedValue)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Effective Tax Rate</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {propertyTaxResult.effectiveTaxRatePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter property value & tax rate</p>
                <p className="text-xs">Estimate your annual property tax liability, monthly mortgage escrow, and quarterly payments.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 12. RENTAL YIELD CALCULATOR
  if (toolSlug === 'rental-yield-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Rental Property Financials</h3>
          <button
            type="button"
            onClick={resetRentalYield}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <NumberSliderInput
              id="rental-price"
              label="Property Purchase Price / Valuation"
              value={rentalPrice}
              onChange={setRentalPrice}
              min={20000}
              max={10000000}
              step={10000}
              placeholder="e.g. 250000"
              prefix={currencySymbol}
              formattedDisplay={typeof rentalPrice === 'number' && rentalPrice > 0 ? formatMoney(rentalPrice) : undefined}
            />
            <NumberSliderInput
              id="rental-rent"
              label="Expected Monthly Rent"
              value={rentalMonthlyRent}
              onChange={setRentalMonthlyRent}
              min={100}
              max={50000}
              step={100}
              placeholder="e.g. 1800"
              prefix={currencySymbol}
              formattedDisplay={typeof rentalMonthlyRent === 'number' && rentalMonthlyRent > 0 ? formatMoney(rentalMonthlyRent) : undefined}
            />
            <NumberSliderInput
              id="rental-maint"
              label="Annual Maintenance Reserve (Optional)"
              value={rentalMaintenance}
              onChange={setRentalMaintenance}
              min={0}
              max={20000}
              step={200}
              placeholder="0"
              prefix={currencySymbol}
            />
            <NumberSliderInput
              id="rental-tax"
              label="Annual Property Tax & Insurance (Optional)"
              value={rentalPropTax}
              onChange={setRentalPropTax}
              min={0}
              max={30000}
              step={200}
              placeholder="0"
              prefix={currencySymbol}
            />
            <NumberSliderInput
              id="rental-vacancy"
              label="Estimated Vacancy Rate (%)"
              value={rentalVacancyRate}
              onChange={setRentalVacancyRate}
              min={0}
              max={20}
              step={1}
              placeholder="0"
              suffix="%"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
            {rentalYieldResult ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Gross Rental Yield</span>
                    <span className="text-3xl font-extrabold text-blue-600 mt-1 block">
                      {rentalYieldResult.grossRentalYieldPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Net Yield (Cap Rate)</span>
                    <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
                      {rentalYieldResult.netRentalYieldPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Annual Gross Rent</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(rentalYieldResult.annualGrossRent)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Net Operating Income (NOI)</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(rentalYieldResult.netOperatingIncome)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Monthly Net Cash Flow</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(rentalYieldResult.monthlyCashFlow)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Operating Expense Ratio</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {rentalYieldResult.expenseRatioPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter purchase price & expected rent</p>
                <p className="text-xs">Evaluate investment returns, gross yield, net cap rate, and cash flow projections.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 13. HOME AFFORDABILITY CALCULATOR
  if (toolSlug === 'home-affordability-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Home Affordability & Income</h3>
          <button
            type="button"
            onClick={resetHomeAffordability}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <NumberSliderInput
              id="afford-income"
              label="Gross Annual Household Income"
              value={affordIncome}
              onChange={setAffordIncome}
              min={15000}
              max={1000000}
              step={5000}
              placeholder="e.g. 95000"
              prefix={currencySymbol}
              formattedDisplay={typeof affordIncome === 'number' && affordIncome > 0 ? formatMoney(affordIncome) : undefined}
            />
            <NumberSliderInput
              id="afford-debts"
              label="Monthly Debt Commitments (Cards, Auto, Loans)"
              value={affordMonthlyDebts}
              onChange={setAffordMonthlyDebts}
              min={0}
              max={10000}
              step={50}
              placeholder="0"
              prefix={currencySymbol}
            />
            <NumberSliderInput
              id="afford-down"
              label="Down Payment Available"
              value={affordDownPayment}
              onChange={setAffordDownPayment}
              min={0}
              max={500000}
              step={5000}
              placeholder="0"
              prefix={currencySymbol}
              formattedDisplay={typeof affordDownPayment === 'number' && affordDownPayment > 0 ? formatMoney(affordDownPayment) : undefined}
            />
            <NumberSliderInput
              id="afford-rate"
              label="Anticipated Mortgage Interest Rate (% p.a.)"
              value={affordRate}
              onChange={setAffordRate}
              min={1}
              max={15}
              step={0.1}
              placeholder="e.g. 6.5"
              suffix="%"
            />
            <TermInput
              id="afford-term"
              label="Loan Tenure"
              years={affordTermYears}
              months={affordTermMonths}
              onChangeYears={setAffordTermYears}
              onChangeMonths={setAffordTermMonths}
              helpText="Loan duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-xl p-6">
            {affordabilityResult ? (
              <div className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maximum Affordable Home Price</span>
                  <div className="text-4xl font-extrabold text-blue-600 mt-1">
                    {formatMoney(affordabilityResult.maxAffordableHomePrice)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Based on standard banking 28/36 Debt-to-Income (DTI) guidelines
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Max Allowable Loan</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(affordabilityResult.maxLoanAmount)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Total Monthly Housing Cost</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(affordabilityResult.maxTotalMonthlyPayment)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Monthly Principal & Interest</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(affordabilityResult.monthlyPrincipalInterest)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Monthly Tax & Insurance</span>
                    <span className="text-base font-bold text-slate-900 mt-0.5 block">
                      {formatMoney(affordabilityResult.monthlyPropertyTax + affordabilityResult.monthlyInsurance)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter annual income & mortgage rate</p>
                <p className="text-xs">Determine how much house you can afford using standard banking underwriting criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 14. SAVINGS GOAL CALCULATOR
  if (toolSlug === 'savings-goal-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Savings Target Parameters</h3>
          <button
            type="button"
            onClick={resetSavingsGoal}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-4">
            <NumberSliderInput
              id="goal-target"
              label="Target Savings Goal (Future Amount)"
              value={goalTarget}
              onChange={setGoalTarget}
              min={1000}
              max={10000000}
              step={5000}
              placeholder="e.g. 50000"
              prefix={currencySymbol}
              formattedDisplay={typeof goalTarget === 'number' && goalTarget > 0 ? formatMoney(goalTarget) : undefined}
            />
            <NumberSliderInput
              id="goal-initial"
              label="Starting Balance (Already Saved)"
              value={goalInitial}
              onChange={setGoalInitial}
              min={0}
              max={1000000}
              step={1000}
              placeholder="0"
              prefix={currencySymbol}
              formattedDisplay={typeof goalInitial === 'number' && goalInitial > 0 ? formatMoney(goalInitial) : undefined}
            />
            <NumberSliderInput
              id="goal-rate"
              label="Expected Annual Return Rate (% p.a.)"
              value={goalRate}
              onChange={setGoalRate}
              min={0}
              max={25}
              step={0.5}
              placeholder="e.g. 7"
              suffix="%"
            />
            <TermInput
              id="goal-term"
              label="Time Horizon"
              years={goalYearsInput}
              months={goalMonthsInput}
              onChangeYears={setGoalYearsInput}
              onChangeMonths={setGoalMonthsInput}
              helpText="Savings duration in years and months"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            {savingsGoalResult ? (
              <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Required Monthly Savings
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(savingsGoalResult.monthlySavingsRequired)}
                    <span className="text-sm font-normal text-slate-400 ml-1.5">/ mo</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Total Principal</span>
                      <span className="font-bold text-base text-white">{formatMoney(savingsGoalResult.totalPrincipalSaved)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Interest Earned</span>
                      <span className="font-bold text-base text-emerald-400">+{formatMoney(savingsGoalResult.totalInterestEarned)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Target Goal Wealth Breakdown</h3>
                  <DonutChart
                    size={180}
                    centerTitle="TARGET GOAL"
                    centerSubtitle={formatMoney(savingsGoalResult.futureValue)}
                    segments={[
                      {
                        label: 'Principal Contributed',
                        value: savingsGoalResult.totalPrincipalSaved,
                        color: '#2563eb',
                        formattedValue: formatMoney(savingsGoalResult.totalPrincipalSaved),
                      },
                      {
                        label: 'Interest Earned',
                        value: savingsGoalResult.totalInterestEarned,
                        color: '#10b981',
                        formattedValue: formatMoney(savingsGoalResult.totalInterestEarned),
                      },
                    ]}
                  />
                </div>

                {savingsGoalResult.progressMilestones.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs">
                    <span className="font-bold text-slate-900 block mb-3 text-sm">Annual Growth Milestones</span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {savingsGoalResult.progressMilestones.map((m) => (
                        <div key={m.year} className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
                          <span className="font-semibold text-slate-700">Year {m.year}</span>
                          <span className="text-slate-500">Saved: {formatMoney(m.contributions)}</span>
                          <span className="font-bold text-blue-600">Balance: {formatMoney(m.balance)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500 space-y-2">
                <p className="font-semibold text-slate-700">Enter target amount &amp; time horizon</p>
                <p className="text-xs">Find out how much you need to set aside every month to reach your financial savings goal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 16. ANNUITY CALCULATOR
  // ==========================================
  const [annuityMode, setAnnuityMode] = useSessionState<'payout' | 'present_value' | 'future_value'>('ann_mode_v2', 'payout');
  const [annuityPrincipal, setAnnuityPrincipal] = useSessionState<number | ''>('ann_principal_v2', 100000);
  const [annuityPayment, setAnnuityPayment] = useSessionState<number | ''>('ann_payment_v2', 10000);
  const [annuityRate, setAnnuityRate] = useSessionState<number | ''>('ann_rate_v2', 8);
  const [annuityYears, setAnnuityYears] = useSessionState<number | ''>('ann_years_v2', 10);
  const [annuityFreq, setAnnuityFreq] = useSessionState<number>('ann_freq_v2', 12);
  const [annuityType, setAnnuityType] = useSessionState<'ordinary' | 'due'>('ann_type_v2', 'ordinary');

  const resetAnnuity = () => {
    setAnnuityPrincipal(100000);
    setAnnuityPayment(10000);
    setAnnuityRate(8);
    setAnnuityYears(10);
    setAnnuityFreq(12);
    setAnnuityType('ordinary');
  };

  const activePrincipal = typeof annuityPrincipal === 'number' && annuityPrincipal > 0 ? annuityPrincipal : 100000;
  const activePayment = typeof annuityPayment === 'number' && annuityPayment > 0 ? annuityPayment : 10000;
  const activeRate = typeof annuityRate === 'number' && annuityRate > 0 ? annuityRate : 8;
  const activeYears = typeof annuityYears === 'number' && annuityYears > 0 ? annuityYears : 10;

  const annuityResult = useMemo(() => {
    return calculateAnnuity({
      mode: annuityMode,
      startingPrincipal: activePrincipal,
      periodicPayment: activePayment,
      annualInterestRate: activeRate,
      tenureYears: activeYears,
      paymentFrequency: annuityFreq,
      annuityType: annuityType,
    });
  }, [annuityMode, activePrincipal, activePayment, activeRate, activeYears, annuityFreq, annuityType]);

  const freqLabel = annuityFreq === 12 ? 'month' : annuityFreq === 4 ? 'quarter' : annuityFreq === 2 ? '6 months' : 'year';
  const freqPeriodName = annuityFreq === 12 ? 'Monthly' : annuityFreq === 4 ? 'Quarterly' : annuityFreq === 2 ? 'Semi-Annual' : 'Annual';

  if (toolSlug === 'annuity-calculator') {
    return (
      <div className="space-y-8">
        {/* Mode selector tabs */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {[
              { id: 'payout', label: 'Payout (Fixed Regular Income)' },
              { id: 'present_value', label: 'Present Value (Capital Needed)' },
              { id: 'future_value', label: 'Future Value (Accumulation)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                id={`annuity-mode-${tab.id}`}
                onClick={() => setAnnuityMode(tab.id as any)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  annuityMode === tab.id
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 bg-blue-50/60 border border-blue-100 rounded-xl p-3">
            {annuityMode === 'payout' && (
              <span>
                <strong>Income Drawdown:</strong> Invest a lump sum today ({formatMoney(activePrincipal)}) and calculate the periodic payout you can withdraw for {activeYears} years.
              </span>
            )}
            {annuityMode === 'present_value' && (
              <span>
                <strong>Target Income Planning:</strong> Calculate how much lump sum capital you need today to receive {formatMoney(activePayment)} every {freqLabel} for {activeYears} years.
              </span>
            )}
            {annuityMode === 'future_value' && (
              <span>
                <strong>Wealth Accumulation:</strong> Calculate total future corpus accumulated by contributing {formatMoney(activePayment)} every {freqLabel} over {activeYears} years.
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Annuity Parameters</h2>
              <button
                type="button"
                id="reset-annuity-btn"
                onClick={resetAnnuity}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {annuityMode === 'payout' && (
              <div>
                <NumberSliderInput
                  id="annuity-principal"
                  label="Starting Lump Sum Deposit (Principal)"
                  value={annuityPrincipal}
                  onChange={setAnnuityPrincipal}
                  min={10000}
                  max={10000000}
                  step={10000}
                  placeholder="100,000"
                  prefix={currencySymbol}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[50000, 100000, 500000, 1000000, 2500000, 5000000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAnnuityPrincipal(preset)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                        annuityPrincipal === preset
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatMoney(preset)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(annuityMode === 'present_value' || annuityMode === 'future_value') && (
              <div>
                <NumberSliderInput
                  id="annuity-payment"
                  label={annuityMode === 'present_value' ? 'Target Periodic Withdrawal' : 'Periodic Deposit Contribution'}
                  value={annuityPayment}
                  onChange={setAnnuityPayment}
                  min={500}
                  max={500000}
                  step={500}
                  placeholder="10,000"
                  prefix={currencySymbol}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[2000, 5000, 10000, 25000, 50000, 100000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAnnuityPayment(preset)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                        annuityPayment === preset
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatMoney(preset)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {annuityMode === 'future_value' && (
              <NumberSliderInput
                id="annuity-initial-principal"
                label="Initial Starting Balance (Optional)"
                value={annuityPrincipal}
                onChange={setAnnuityPrincipal}
                min={0}
                max={2000000}
                step={5000}
                placeholder="0"
                prefix={currencySymbol}
              />
            )}

            <NumberSliderInput
              id="annuity-rate"
              label="Annual Interest / Expected Return Rate"
              value={annuityRate}
              onChange={setAnnuityRate}
              min={0.5}
              max={25}
              step={0.1}
              placeholder="8.0"
              suffix="%"
            />

            <NumberSliderInput
              id="annuity-years"
              label="Annuity Term (Duration)"
              value={annuityYears}
              onChange={setAnnuityYears}
              min={1}
              max={40}
              step={1}
              placeholder="10"
              suffix="Years"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Payout / Compounding Frequency
                </label>
                <select
                  id="annuity-freq-select"
                  value={annuityFreq}
                  onChange={(e) => setAnnuityFreq(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={12}>Monthly (12 payouts/year)</option>
                  <option value={4}>Quarterly (4 payouts/year)</option>
                  <option value={2}>Semi-Annually (2 payouts/year)</option>
                  <option value={1}>Annually (1 payout/year)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Annuity Timing Type
                </label>
                <select
                  id="annuity-type-select"
                  value={annuityType}
                  onChange={(e) => setAnnuityType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ordinary">Ordinary Annuity (End of period)</option>
                  <option value="due">Annuity Due (Beginning of period)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-6">
              {/* Hero Result Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md">
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-100 block">
                  {annuityMode === 'payout'
                    ? `Estimated Periodic Payout (${freqPeriodName})`
                    : annuityMode === 'present_value'
                    ? 'Required Starting Capital (Present Value)'
                    : 'Accumulated Future Value (Maturity Corpus)'}
                </span>
                <div className="text-3xl sm:text-4xl font-black mt-1">
                  {formatMoney(
                    annuityMode === 'payout'
                      ? annuityResult.periodicPayment
                      : annuityMode === 'present_value'
                      ? annuityResult.startingPrincipal
                      : annuityResult.futureValue
                  )}
                  {annuityMode === 'payout' && (
                    <span className="text-sm font-normal text-blue-100 ml-1.5">
                      / {freqLabel}
                    </span>
                  )}
                </div>
                <p className="text-xs text-blue-100 mt-2">
                  {annuityMode === 'payout'
                    ? `From your ${formatMoney(activePrincipal)} deposit, you will receive ${formatMoney(annuityResult.periodicPayment)} every ${freqLabel} for ${activeYears} years (Total ${formatMoney(annuityResult.totalPayments)}).`
                    : annuityMode === 'present_value'
                    ? `Invest ${formatMoney(annuityResult.startingPrincipal)} upfront at ${activeRate}% p.a. to fund ${formatMoney(activePayment)} every ${freqLabel} for ${activeYears} years.`
                    : `Contributing ${formatMoney(activePayment)} every ${freqLabel} grows into a final corpus of ${formatMoney(annuityResult.futureValue)}.`}
                </p>
              </div>

              {/* Metrics Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">
                    {annuityMode === 'payout' ? 'Total Payouts Received' : 'Total Contributions Made'}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 mt-1 block">
                    {formatMoney(annuityResult.totalPayments)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {activeYears * annuityFreq} installments total
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500 font-medium block">Total Interest / Earnings</span>
                  <span className="text-base sm:text-lg font-bold text-emerald-600 mt-1 block">
                    {formatMoney(annuityResult.totalInterest)}
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    {annuityType === 'due' ? 'Annuity Due (+extra period growth)' : 'Ordinary Annuity'}
                  </span>
                </div>
              </div>

              {/* Visual Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <DonutChart
                  title="Capital vs. Interest Breakdown"
                  segments={[
                    {
                      label: annuityMode === 'payout' ? 'Initial Capital' : 'Principal Deposited',
                      value: annuityMode === 'payout' ? annuityResult.startingPrincipal : annuityResult.totalPayments,
                      color: '#2563eb',
                      formattedValue: formatMoney(
                        annuityMode === 'payout' ? annuityResult.startingPrincipal : annuityResult.totalPayments
                      ),
                    },
                    {
                      label: 'Accumulated Interest',
                      value: annuityResult.totalInterest,
                      color: '#10b981',
                      formattedValue: formatMoney(annuityResult.totalInterest),
                    },
                  ]}
                />
              </div>

              {/* Payout Schedule Snippet */}
              {annuityResult.schedule.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-slate-900 text-sm">Amortization / Milestone Schedule</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Showing first {Math.min(12, annuityResult.schedule.length)} of {annuityResult.schedule.length} periods
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {annuityResult.schedule.slice(0, 24).map((s) => (
                      <div
                        key={s.period}
                        className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <span className="font-semibold text-slate-700">{s.label}</span>
                        <span className="text-slate-500">
                          {annuityMode === 'future_value' ? 'Contribution' : 'Payout'}: {formatMoney(s.payment)}
                        </span>
                        <span className="text-slate-500">Interest: {formatMoney(s.interestEarned)}</span>
                        <span className="font-bold text-blue-600">Balance: {formatMoney(s.closingBalance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
