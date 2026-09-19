import React, { useState, useMemo } from 'react';
import { calculateEMI } from '../../engine/emi';
import { calculateSpecializedLoan } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, Home, Car, Landmark, GraduationCap, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';

interface SpecializedLoanCalculatorProps {
  toolSlug: 'home-loan-calculator' | 'car-loan-calculator' | 'personal-loan-calculator' | 'education-loan-calculator';
  onSelectTool?: (slug: string) => void;
}

export const SpecializedLoanCalculator: React.FC<SpecializedLoanCalculatorProps> = ({
  toolSlug,
  onSelectTool,
}) => {
  const { formatMoney, currencySymbol, preferences } = useSettings();
  const isINR = preferences.currency === 'INR';

  // --- HOME LOAN DEFAULTS - Empty by default ---
  const [homePrice, setHomePrice] = useState<number | ''>('');
  const [homeDownPayment, setHomeDownPayment] = useState<number | ''>('');
  const [homeRate, setHomeRate] = useState<number | ''>('');
  const [homeTenureYears, setHomeTenureYears] = useState<number | ''>('');
  const [homeTenureMonths, setHomeTenureMonths] = useState<number | ''>('');

  // --- CAR LOAN DEFAULTS - Empty by default ---
  const [carPrice, setCarPrice] = useState<number | ''>('');
  const [carDownPayment, setCarDownPayment] = useState<number | ''>('');
  const [carRate, setCarRate] = useState<number | ''>('');
  const [carTenureYears, setCarTenureYears] = useState<number | ''>('');
  const [carTenureMonths, setCarTenureMonths] = useState<number | ''>('');
  const [annualRunningCost, setAnnualRunningCost] = useState<number | ''>('');

  // --- PERSONAL LOAN DEFAULTS - Empty by default ---
  const [personalLoanAmount, setPersonalLoanAmount] = useState<number | ''>('');
  const [personalRate, setPersonalRate] = useState<number | ''>('');
  const [personalTenureYears, setPersonalTenureYears] = useState<number | ''>('');
  const [personalTenureMonths, setPersonalTenureMonths] = useState<number | ''>('');
  const [processingFeePercent, setProcessingFeePercent] = useState<number | ''>('');

  // --- EDUCATION LOAN DEFAULTS - Empty by default ---
  const [eduLoanAmount, setEduLoanAmount] = useState<number | ''>('');
  const [eduRate, setEduRate] = useState<number | ''>('');
  const [moratoriumYears, setMoratoriumYears] = useState<number | ''>('');
  const [eduTenureYears, setEduTenureYears] = useState<number | ''>('');
  const [eduTenureMonths, setEduTenureMonths] = useState<number | ''>('');
  const [payMoratoriumInterest, setPayMoratoriumInterest] = useState<boolean>(false);

  // Pagination for amortization table
  const [amortizationTab, setAmortizationTab] = useState<'yearly' | 'monthly'>('yearly');
  const [monthlyPage, setMonthlyPage] = useState<number>(1);

  // Derived Values based on active tool
  const currentLoanConfig = useMemo(() => {
    if (toolSlug === 'home-loan-calculator') {
      if (typeof homePrice !== 'number' || homePrice <= 0) return null;
      const homeNorm = normalizeTerm({ years: homeTenureYears, months: homeTenureMonths });
      if (!homeNorm.isValid) return null;

      const dp = typeof homeDownPayment === 'number' ? homeDownPayment : 0;
      const loanAmount = Math.max(0, homePrice - dp);
      const rate = typeof homeRate === 'number' && homeRate > 0 ? homeRate : 8.5;
      const tenureYears = homeNorm.totalYears;

      const specialized = calculateSpecializedLoan({
        loanType: 'home',
        assetPrice: homePrice,
        downPayment: dp,
        loanAmount,
        interestRate: rate,
        tenureYears,
      });
      const emiSchedule = calculateEMI({
        loanAmount,
        interestRate: rate,
        tenure: homeNorm.totalMonths,
        tenureUnit: 'months',
      });
      return {
        type: 'home' as const,
        loanAmount,
        rate,
        tenureYears,
        specialized,
        emiSchedule,
      };
    }

    if (toolSlug === 'car-loan-calculator') {
      if (typeof carPrice !== 'number' || carPrice <= 0) return null;
      const carNorm = normalizeTerm({ years: carTenureYears, months: carTenureMonths });
      if (!carNorm.isValid) return null;

      const dp = typeof carDownPayment === 'number' ? carDownPayment : 0;
      const loanAmount = Math.max(0, carPrice - dp);
      const rate = typeof carRate === 'number' && carRate > 0 ? carRate : 9.0;
      const tenureYears = carNorm.totalYears;
      const runningCost = typeof annualRunningCost === 'number' ? annualRunningCost : 0;

      const specialized = calculateSpecializedLoan({
        loanType: 'car',
        assetPrice: carPrice,
        downPayment: dp,
        loanAmount,
        interestRate: rate,
        tenureYears,
        annualRunningCost: runningCost,
      });
      const emiSchedule = calculateEMI({
        loanAmount,
        interestRate: rate,
        tenure: carNorm.totalMonths,
        tenureUnit: 'months',
      });
      return {
        type: 'car' as const,
        loanAmount,
        rate,
        tenureYears,
        specialized,
        emiSchedule,
      };
    }

    if (toolSlug === 'personal-loan-calculator') {
      if (typeof personalLoanAmount !== 'number' || personalLoanAmount <= 0) return null;
      const persNorm = normalizeTerm({ years: personalTenureYears, months: personalTenureMonths });
      if (!persNorm.isValid) return null;

      const rate = typeof personalRate === 'number' && personalRate > 0 ? personalRate : 11.5;
      const tenureYears = persNorm.totalYears;
      const fee = typeof processingFeePercent === 'number' ? processingFeePercent : 0;

      const specialized = calculateSpecializedLoan({
        loanType: 'personal',
        loanAmount: personalLoanAmount,
        interestRate: rate,
        tenureYears,
        processingFeePercentage: fee,
      });
      const emiSchedule = calculateEMI({
        loanAmount: personalLoanAmount,
        interestRate: rate,
        tenure: persNorm.totalMonths,
        tenureUnit: 'months',
      });
      return {
        type: 'personal' as const,
        loanAmount: personalLoanAmount,
        rate,
        tenureYears,
        specialized,
        emiSchedule,
      };
    }

    // Education Loan
    if (typeof eduLoanAmount !== 'number' || eduLoanAmount <= 0) return null;
    const eduNorm = normalizeTerm({ years: eduTenureYears, months: eduTenureMonths });
    if (!eduNorm.isValid) return null;

    const rate = typeof eduRate === 'number' && eduRate > 0 ? eduRate : 9.5;
    const tenureYears = eduNorm.totalYears;
    const mora = typeof moratoriumYears === 'number' ? moratoriumYears : 0;

    const specialized = calculateSpecializedLoan({
      loanType: 'education',
      loanAmount: eduLoanAmount,
      interestRate: rate,
      tenureYears,
      moratoriumYears: mora,
      simpleInterestDuringMoratorium: !payMoratoriumInterest,
    });
    const effectiveLoan = payMoratoriumInterest
      ? eduLoanAmount
      : (specialized.postMoratoriumPrincipal || eduLoanAmount);
    const emiSchedule = calculateEMI({
      loanAmount: effectiveLoan,
      interestRate: rate,
      tenure: eduNorm.totalMonths,
      tenureUnit: 'months',
    });
    return {
      type: 'education' as const,
      loanAmount: effectiveLoan,
      rate,
      tenureYears,
      specialized,
      emiSchedule,
    };
  }, [
    toolSlug,
    homePrice,
    homeDownPayment,
    homeRate,
    homeTenureYears,
    homeTenureMonths,
    carPrice,
    carDownPayment,
    carRate,
    carTenureYears,
    carTenureMonths,
    annualRunningCost,
    personalLoanAmount,
    personalRate,
    personalTenureYears,
    personalTenureMonths,
    processingFeePercent,
    eduLoanAmount,
    eduRate,
    moratoriumYears,
    eduTenureYears,
    eduTenureMonths,
    payMoratoriumInterest,
  ]);

  const handleReset = () => {
    if (toolSlug === 'home-loan-calculator') {
      setHomePrice('');
      setHomeDownPayment('');
      setHomeRate('');
      setHomeTenureYears('');
      setHomeTenureMonths('');
    } else if (toolSlug === 'car-loan-calculator') {
      setCarPrice('');
      setCarDownPayment('');
      setCarRate('');
      setCarTenureYears('');
      setCarTenureMonths('');
      setAnnualRunningCost('');
    } else if (toolSlug === 'personal-loan-calculator') {
      setPersonalLoanAmount('');
      setPersonalRate('');
      setPersonalTenureYears('');
      setPersonalTenureMonths('');
      setProcessingFeePercent('');
    } else {
      setEduLoanAmount('');
      setEduRate('');
      setMoratoriumYears('');
      setEduTenureYears('');
      setEduTenureMonths('');
      setPayMoratoriumInterest(false);
    }
    setMonthlyPage(1);
  };

  // Chart data
  const chartSegments = useMemo(() => {
    if (!currentLoanConfig) return [];
    const principal = currentLoanConfig.loanAmount;
    const interest = currentLoanConfig.emiSchedule.totalInterest;
    return [
      { label: 'Principal Loan Amount', value: principal, color: '#3b82f6' },
      { label: 'Total Interest Payable', value: interest, color: '#f59e0b' },
    ];
  }, [currentLoanConfig]);

  // Total Amount Payable by End of Loan (Principal + Interest)
  const totalRepaymentByEnd = useMemo(() => {
    if (!currentLoanConfig) return 0;
    if (toolSlug === 'education-loan-calculator' && payMoratoriumInterest && currentLoanConfig.specialized.moratoriumInterest) {
      return currentLoanConfig.emiSchedule.totalPayment + currentLoanConfig.specialized.moratoriumInterest;
    }
    return currentLoanConfig.emiSchedule.totalPayment;
  }, [currentLoanConfig, toolSlug, payMoratoriumInterest]);

  // Paginated monthly schedule
  const itemsPerPage = 12;
  const totalMonthlyPages = currentLoanConfig ? Math.ceil(currentLoanConfig.emiSchedule.monthlyAmortization.length / itemsPerPage) : 1;
  const displayedMonthly = useMemo(() => {
    if (!currentLoanConfig) return [];
    const start = (monthlyPage - 1) * itemsPerPage;
    return currentLoanConfig.emiSchedule.monthlyAmortization.slice(start, start + itemsPerPage);
  }, [currentLoanConfig, monthlyPage]);

  return (
    <div className="space-y-8">
      {/* Loan Type Tab Selector for Fast Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl overflow-x-auto border border-slate-200">
        {[
          { slug: 'home-loan-calculator', label: 'Home Loan', icon: Home },
          { slug: 'car-loan-calculator', label: 'Car Loan', icon: Car },
          { slug: 'personal-loan-calculator', label: 'Personal Loan', icon: Landmark },
          { slug: 'education-loan-calculator', label: 'Education Loan', icon: GraduationCap },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = toolSlug === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              id={`tab-${item.slug}`}
              onClick={() => onSelectTool && onSelectTool(item.slug)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Domain-Specific Inputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>
                {toolSlug === 'home-loan-calculator' && 'Property & Mortgage Details'}
                {toolSlug === 'car-loan-calculator' && 'Vehicle & Financing Details'}
                {toolSlug === 'personal-loan-calculator' && 'Personal Loan Details'}
                {toolSlug === 'education-loan-calculator' && 'Student Loan & Course Details'}
              </span>
            </h2>
            <button
              type="button"
              id="btn-reset-loan"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* HOME LOAN INPUTS */}
          {toolSlug === 'home-loan-calculator' && (
            <>
              <CurrencyInput
                id="home-price"
                label="Property / Home Price"
                value={homePrice}
                onChange={setHomePrice}
                min={100000}
                max={1000000000}
                step={isINR ? 50000 : 5000}
                helpText="Estimated purchase price of the property"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="home-downpayment"
                  label="Down Payment Amount"
                  value={homeDownPayment}
                  onChange={(val) => {
                    setHomeDownPayment(val);
                  }}
                  min={0}
                  max={homePrice}
                  step={isINR ? 25000 : 1000}
                />
                <UnitNumberInput
                  id="home-downpayment-pct"
                  label="Down Payment %"
                  value={
                    typeof homePrice === 'number' && homePrice > 0 && typeof homeDownPayment === 'number'
                      ? Math.round((homeDownPayment / homePrice) * 100)
                      : ''
                  }
                  onChange={(pct) => {
                    if (typeof homePrice === 'number' && typeof pct === 'number') {
                      setHomeDownPayment(Math.round((homePrice * pct) / 100));
                    } else if (pct === '') {
                      setHomeDownPayment('');
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  suffix="%"
                />
              </div>

              {/* LTV Badge */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Net Financed Loan Amount:</span>
                <span className="font-bold text-slate-900">
                  {currentLoanConfig ? formatMoney(currentLoanConfig.loanAmount) : '—'}
                </span>
              </div>
              {currentLoanConfig && currentLoanConfig.specialized.ltvPercentage !== undefined && (
                <div className="text-xs text-slate-500 flex items-center gap-2">
                  <span className="font-semibold text-slate-700">Loan-to-Value (LTV):</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold ${
                    currentLoanConfig.specialized.ltvPercentage <= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {currentLoanConfig.specialized.ltvPercentage}% LTV
                  </span>
                  <span className="text-[11px] text-slate-400">
                    ({currentLoanConfig.specialized.ltvPercentage <= 80 ? 'Standard 80% guideline' : 'Higher down payment advised'})
                  </span>
                </div>
              )}

              <UnitNumberInput
                id="home-rate"
                label="Mortgage Interest Rate (% p.a.)"
                value={homeRate}
                onChange={setHomeRate}
                min={1}
                max={25}
                step={0.05}
                suffix="%"
                helpText="Floating / Fixed interest rate from your lender"
              />

              <TermInput
                id="home-tenure"
                label="Loan Tenure"
                years={homeTenureYears}
                months={homeTenureMonths}
                onChangeYears={setHomeTenureYears}
                onChangeMonths={setHomeTenureMonths}
                helpText="Standard tenures are 15, 20, 25, or 30 years"
              />
            </>
          )}

          {/* CAR LOAN INPUTS */}
          {toolSlug === 'car-loan-calculator' && (
            <>
              <CurrencyInput
                id="car-price"
                label="Vehicle On-Road Price"
                value={carPrice}
                onChange={setCarPrice}
                min={10000}
                max={100000000}
                step={isINR ? 20000 : 1000}
                helpText="Total showroom price plus registration and taxes"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  id="car-downpayment"
                  label="Down Payment Amount"
                  value={carDownPayment}
                  onChange={setCarDownPayment}
                  min={0}
                  max={carPrice}
                  step={isINR ? 10000 : 500}
                />
                <UnitNumberInput
                  id="car-downpayment-pct"
                  label="Down Payment %"
                  value={typeof carPrice === 'number' && carPrice > 0 && typeof carDownPayment === 'number' ? Math.round((carDownPayment / carPrice) * 100) : ''}
                  onChange={(pct) => {
                    if (typeof carPrice === 'number') {
                      setCarDownPayment(Math.round((carPrice * pct) / 100));
                    }
                  }}
                  min={0}
                  max={100}
                  step={1}
                  suffix="%"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Auto Loan Amount:</span>
                <span className="font-bold text-slate-900">
                  {currentLoanConfig ? formatMoney(currentLoanConfig.loanAmount) : '—'}
                </span>
              </div>

              <UnitNumberInput
                id="car-rate"
                label="Auto Loan Interest Rate (% p.a.)"
                value={carRate}
                onChange={setCarRate}
                min={1}
                max={30}
                step={0.1}
                suffix="%"
              />

              <TermInput
                id="car-tenure"
                label="Loan Tenure"
                years={carTenureYears}
                months={carTenureMonths}
                onChangeYears={setCarTenureYears}
                onChangeMonths={setCarTenureMonths}
                helpText="Recommended: 3 to 5 years"
              />

              <CurrencyInput
                id="car-running-cost"
                label="Estimated Annual Ownership Costs"
                value={annualRunningCost}
                onChange={setAnnualRunningCost}
                min={0}
                max={1000000}
                step={isINR ? 5000 : 250}
                helpText="Annual comprehensive insurance + routine servicing + fuel"
              />
            </>
          )}

          {/* PERSONAL LOAN INPUTS */}
          {toolSlug === 'personal-loan-calculator' && (
            <>
              <CurrencyInput
                id="personal-amount"
                label="Personal Loan Amount"
                value={personalLoanAmount}
                onChange={setPersonalLoanAmount}
                min={5000}
                max={10000000}
                step={isINR ? 10000 : 500}
                helpText="Sanctioned principal borrowed from lender"
              />

              <UnitNumberInput
                id="personal-rate"
                label="Interest Rate (% per annum)"
                value={personalRate}
                onChange={setPersonalRate}
                min={5}
                max={40}
                step={0.25}
                suffix="%"
                helpText="Unsecured loans typically range from 10.5% to 24%"
              />

              <TermInput
                id="personal-tenure"
                label="Loan Tenure"
                years={personalTenureYears}
                months={personalTenureMonths}
                onChangeYears={setPersonalTenureYears}
                onChangeMonths={setPersonalTenureMonths}
                helpText="Personal loans are usually 1 to 5 years"
              />

              <UnitNumberInput
                id="personal-fee"
                label="Lender Processing Fee (%)"
                value={processingFeePercent}
                onChange={setProcessingFeePercent}
                min={0}
                max={10}
                step={0.25}
                suffix="%"
                helpText="Deducted upfront from the disbursed loan amount"
              />

              {currentLoanConfig && (
                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Upfront Processing Fee:</span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(currentLoanConfig.specialized.processingFeeAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-blue-900 font-bold border-t border-blue-200/50 pt-1.5">
                    <span>Net Disbursed to Bank Account:</span>
                    <span>{formatMoney(currentLoanConfig.specialized.netDisbursedAmount)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* EDUCATION LOAN INPUTS */}
          {toolSlug === 'education-loan-calculator' && (
            <>
              <CurrencyInput
                id="edu-amount"
                label="Sanctioned Education Loan Amount"
                value={eduLoanAmount}
                onChange={setEduLoanAmount}
                min={50000}
                max={50000000}
                step={isINR ? 50000 : 2500}
                helpText="Tuition fees, lab costs, books, and living expenses"
              />

              <UnitNumberInput
                id="edu-rate"
                label="Interest Rate (% p.a.)"
                value={eduRate}
                onChange={setEduRate}
                min={4}
                max={25}
                step={0.25}
                suffix="%"
              />

              <UnitNumberInput
                id="edu-moratorium"
                label="Course Study Moratorium Period"
                value={moratoriumYears}
                onChange={setMoratoriumYears}
                min={0}
                max={6}
                step={0.5}
                suffix="Years"
                helpText="Duration of study plus grace period before EMI repayment starts"
              />

              <TermInput
                id="edu-tenure"
                label="Post-Study Repayment Tenure"
                years={eduTenureYears}
                months={eduTenureMonths}
                onChangeYears={setEduTenureYears}
                onChangeMonths={setEduTenureMonths}
                helpText="Tenure over which you repay the loan after graduation"
              />

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-mora-interest" className="text-xs font-semibold text-slate-800">
                    Pay simple interest during study period?
                  </label>
                  <input
                    type="checkbox"
                    id="toggle-mora-interest"
                    checked={payMoratoriumInterest}
                    onChange={(e) => setPayMoratoriumInterest(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {payMoratoriumInterest
                    ? 'Paying monthly simple interest during college prevents interest capitalization, keeping your post-graduation loan balance lower.'
                    : 'Interest accumulates during study and is added to the principal balance when repayment begins.'}
                </p>
              </div>

              {currentLoanConfig && currentLoanConfig.specialized.moratoriumInterest && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span>Accrued Moratorium Interest:</span>
                    <span>{formatMoney(currentLoanConfig.specialized.moratoriumInterest)}</span>
                  </div>
                  {!payMoratoriumInterest && currentLoanConfig.specialized.postMoratoriumPrincipal && (
                    <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-amber-200/50">
                      <span>Post-Graduation Starting Principal:</span>
                      <span className="font-bold text-slate-900">
                        {formatMoney(currentLoanConfig.specialized.postMoratoriumPrincipal)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Output Summary Card */}
        <div className="lg:col-span-6 space-y-6">
          {currentLoanConfig ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Monthly Repayment Summary
              </h2>

              <div className="p-5 bg-linear-to-br from-blue-50/90 to-indigo-50/60 rounded-2xl border border-blue-100 mb-6">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                  Monthly EMI Payment
                </span>
                <div className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight mt-1">
                  {formatMoney(currentLoanConfig.emiSchedule.monthlyEMI)}
                  <span className="text-sm font-semibold text-slate-500"> / month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  For {currentLoanConfig.tenureYears} Years ({currentLoanConfig.tenureYears * 12} Installments)
                </p>
              </div>

              {/* Metrics Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-medium text-slate-500 block">Total Loan Principal</span>
                  <span className="text-base sm:text-lg font-bold text-slate-900 mt-1 block">
                    {formatMoney(currentLoanConfig.loanAmount)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Borrowed Amount</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-medium text-slate-500 block">Total Interest Payable</span>
                  <span className="text-base sm:text-lg font-bold text-amber-600 mt-1 block">
                    {formatMoney(currentLoanConfig.emiSchedule.totalInterest)}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Financing Cost</span>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="text-xs font-semibold text-blue-700 block">Total Amount Payable</span>
                  <span className="text-base sm:text-lg font-black text-blue-950 mt-1 block">
                    {formatMoney(totalRepaymentByEnd)}
                  </span>
                  <span className="text-[10px] text-blue-600 block mt-0.5">Principal + Interest</span>
                </div>
              </div>

              {/* Special Car Loan Ownership Metric */}
              {toolSlug === 'car-loan-calculator' && currentLoanConfig.specialized.estimatedTotalOwnershipCost && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                        Estimated Total 5-Year Ownership Cost
                      </span>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        Down Payment + All EMIs + Running Costs (Insurance, Maintenance, Fuel)
                      </p>
                    </div>
                    <div className="text-right text-lg font-black text-emerald-950">
                      {formatMoney(currentLoanConfig.specialized.estimatedTotalOwnershipCost)}
                    </div>
                  </div>
                </div>
              )}

              {/* Donut Chart */}
              <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
                <DonutChart
                  segments={chartSegments}
                  centerLabel="Total Repayment"
                  centerValue={formatMoney(totalRepaymentByEnd)}
                  size={190}
                  strokeWidth={22}
                />
                <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Principal ({totalRepaymentByEnd > 0 ? Math.round((currentLoanConfig.loanAmount / totalRepaymentByEnd) * 100) : 0}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span>Interest ({totalRepaymentByEnd > 0 ? Math.round((currentLoanConfig.emiSchedule.totalInterest / totalRepaymentByEnd) * 100) : 0}%)</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
              <Landmark className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">Enter loan amount and details</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Fill in the details above to calculate your monthly EMI payment, total interest, and full repayment schedule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amortization Schedule Table */}
      {currentLoanConfig && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Amortization Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Principal vs Interest breakdown and remaining balance over time
              </p>
            </div>

            <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200">
            <button
              type="button"
              id="tab-yearly-schedule"
              onClick={() => setAmortizationTab('yearly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                amortizationTab === 'yearly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly Summary
            </button>
            <button
              type="button"
              id="tab-monthly-schedule"
              onClick={() => setAmortizationTab('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                amortizationTab === 'monthly'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Breakdown
            </button>
          </div>
        </div>

        {amortizationTab === 'yearly' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3 text-right">Principal Paid</th>
                  <th className="py-2.5 px-3 text-right">Interest Paid</th>
                  <th className="py-2.5 px-3 text-right">Total Annual Payment</th>
                  <th className="py-2.5 px-3 text-right">Total Interest to Date</th>
                  <th className="py-2.5 px-3 text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLoanConfig.emiSchedule.yearlyAmortization.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.label}</td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-semibold">{formatMoney(row.principal)}</td>
                    <td className="py-2.5 px-3 text-right text-amber-600 font-medium">{formatMoney(row.interest)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{formatMoney(row.emi)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{formatMoney(row.totalInterestToDate)}</td>
                    <td className="py-2.5 px-3 text-right text-slate-900 font-bold">{formatMoney(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">Principal</th>
                    <th className="py-2.5 px-3 text-right">Interest</th>
                    <th className="py-2.5 px-3 text-right">Monthly EMI</th>
                    <th className="py-2.5 px-3 text-right">Ending Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedMonthly.map((m) => (
                    <tr key={m.period} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{m.label}</td>
                      <td className="py-2.5 px-3 text-right text-blue-600 font-medium">{formatMoney(m.principal)}</td>
                      <td className="py-2.5 px-3 text-right text-amber-600 font-medium">{formatMoney(m.interest)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-700 font-medium">{formatMoney(m.emi)}</td>
                      <td className="py-2.5 px-3 text-right text-slate-900 font-bold">{formatMoney(m.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalMonthlyPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 text-xs">
                <span className="text-slate-500">
                  Page {monthlyPage} of {totalMonthlyPages} ({currentLoanConfig.emiSchedule.monthlyAmortization.length} months)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={monthlyPage === 1}
                    onClick={() => setMonthlyPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={monthlyPage === totalMonthlyPages}
                    onClick={() => setMonthlyPage((p) => Math.min(totalMonthlyPages, p + 1))}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
};
