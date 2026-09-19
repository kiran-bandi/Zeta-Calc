import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  RotateCcw,
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Table as TableIcon,
  PieChart,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { CURRENCIES } from '../../data/currencies';
import { CurrencyCode } from '../../types/globalization';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';
import { DonutChart } from '../common/DonutChart';
import {
  calculateLumpsum,
  calculateSIP,
  calculateStepUpSIP,
  MutualFundMode,
  MutualFundCalculationResult,
} from '../../engine/mutualFundEngine';

export const MutualFundCalculatorView: React.FC = () => {
  const { preferences, setCurrency, formatMoney, currencySymbol } = useSettings();

  // Mode Selection: Lumpsum | SIP | Step-Up SIP
  const [mode, setMode] = useState<MutualFundMode>('lumpsum');

  // Input states - strictly empty initially!
  const [amountText, setAmountText] = useState<string>('');
  const [returnRateText, setReturnRateText] = useState<string>('');
  const [stepUpRateText, setStepUpRateText] = useState<string>('');
  const [years, setYears] = useState<number | ''>('');
  const [months, setMonths] = useState<number | ''>('');
  const [inflationRateText, setInflationRateText] = useState<string>('');

  // Table view toggle
  const [breakdownView, setBreakdownView] = useState<'yearly' | 'monthly'>('yearly');
  const [isBreakdownOpen, setIsBreakdownOpen] = useState<boolean>(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);

  // Helper to parse numeric string cleanly preserving empty vs 0
  const parseNumOrEmpty = (raw: string): number | '' => {
    const trimmed = raw.trim().replace(/,/g, '');
    if (trimmed === '') return '';
    const val = parseFloat(trimmed);
    return isNaN(val) ? '' : val;
  };

  const amountVal = parseNumOrEmpty(amountText);
  const returnRateVal = parseNumOrEmpty(returnRateText);
  const stepUpRateVal = parseNumOrEmpty(stepUpRateText);
  const inflationVal = parseNumOrEmpty(inflationRateText);

  // Term normalization
  const termValidation = useMemo(() => {
    return normalizeTerm({ years, months });
  }, [years, months]);

  // Inline Validation Errors
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Amount validation
    if (amountText !== '') {
      if (typeof amountVal !== 'number' || isNaN(amountVal) || amountVal <= 0) {
        errs.amount = 'Investment amount must be greater than zero.';
      }
    }

    // Return rate validation
    if (returnRateText !== '') {
      if (typeof returnRateVal !== 'number' || isNaN(returnRateVal) || returnRateVal < 0) {
        errs.returnRate = 'Expected return cannot be negative.';
      } else if (returnRateVal > 100) {
        errs.returnRate = 'Expected return seems unusually high (>100%).';
      }
    }

    // Step up rate validation (only for step_up_sip mode)
    if (mode === 'step_up_sip' && stepUpRateText !== '') {
      if (typeof stepUpRateVal !== 'number' || isNaN(stepUpRateVal) || stepUpRateVal < 0) {
        errs.stepUpRate = 'Annual step-up rate cannot be negative.';
      }
    }

    // Term error
    if ((years !== '' || months !== '') && !termValidation.isValid) {
      errs.term = termValidation.error || 'Please enter a valid duration.';
    }

    // Inflation rate validation (optional)
    if (inflationRateText !== '') {
      if (typeof inflationVal !== 'number' || isNaN(inflationVal) || inflationVal < 0) {
        errs.inflation = 'Inflation rate cannot be negative.';
      }
    }

    return errs;
  }, [amountText, amountVal, returnRateText, returnRateVal, stepUpRateText, stepUpRateVal, mode, years, months, termValidation, inflationRateText, inflationVal]);

  // Check if all required inputs are present and valid
  const isInputComplete = useMemo(() => {
    if (typeof amountVal !== 'number' || amountVal <= 0) return false;
    if (typeof returnRateVal !== 'number' || returnRateVal < 0) return false;
    if (!termValidation.isValid || termValidation.totalMonths <= 0) return false;
    if (mode === 'step_up_sip') {
      if (typeof stepUpRateVal !== 'number' || stepUpRateVal < 0) return false;
    }
    if (inflationRateText !== '' && (typeof inflationVal !== 'number' || inflationVal < 0)) return false;
    return true;
  }, [amountVal, returnRateVal, termValidation, mode, stepUpRateVal, inflationRateText, inflationVal]);

  // Main calculation result
  const calculationResult: MutualFundCalculationResult | null = useMemo(() => {
    if (!isInputComplete) return null;

    const totalMonths = termValidation.totalMonths;
    const inflation = typeof inflationVal === 'number' ? inflationVal : undefined;

    if (mode === 'lumpsum') {
      return calculateLumpsum({
        initialInvestment: amountVal as number,
        expectedAnnualReturnRate: returnRateVal as number,
        totalMonths,
        inflationRate: inflation,
      });
    }

    if (mode === 'sip') {
      return calculateSIP({
        monthlySIPAmount: amountVal as number,
        expectedAnnualReturnRate: returnRateVal as number,
        totalMonths,
        inflationRate: inflation,
        timingConvention: 'end_of_month',
      });
    }

    if (mode === 'step_up_sip') {
      return calculateStepUpSIP({
        initialMonthlySIP: amountVal as number,
        annualStepUpPercentage: stepUpRateVal as number,
        expectedAnnualReturnRate: returnRateVal as number,
        totalMonths,
        inflationRate: inflation,
        timingConvention: 'end_of_month',
      });
    }

    return null;
  }, [isInputComplete, mode, amountVal, returnRateVal, termValidation, stepUpRateVal, inflationVal]);

  // Full Reset
  const handleReset = () => {
    setAmountText('');
    setReturnRateText('');
    setStepUpRateText('');
    setYears('');
    setMonths('');
    setInflationRateText('');
  };

  // Helper formatting for duration
  const durationLabel = useMemo(() => {
    if (!termValidation.isValid || termValidation.totalMonths <= 0) return '';
    const y = Math.floor(termValidation.totalMonths / 12);
    const m = termValidation.totalMonths % 12;
    const parts: string[] = [];
    if (y > 0) parts.push(`${y} ${y === 1 ? 'Year' : 'Years'}`);
    if (m > 0) parts.push(`${m} ${m === 1 ? 'Month' : 'Months'}`);
    if (parts.length === 0) return '0 Months';
    return `${parts.join(' ')} (${termValidation.totalMonths} Months)`;
  }, [termValidation]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Header Card with Mode Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              Wealth Accumulation Engine
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mutual Fund Calculator</h1>
            <p className="text-sm text-slate-600 mt-1">
              Estimate future maturity value, compound returns, and inflation-adjusted purchasing power across Lumpsum, SIP, and Step-Up SIP.
            </p>
          </div>

          <button
            type="button"
            id="mf-reset-btn"
            onClick={handleReset}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All
          </button>
        </div>

        {/* Investment Type Mode Selector */}
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
            Investment Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3" role="radiogroup" aria-label="Investment Type">
            <button
              type="button"
              id="mf-mode-lumpsum"
              role="radio"
              aria-checked={mode === 'lumpsum'}
              onClick={() => setMode('lumpsum')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'lumpsum'
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  mode === 'lumpsum' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}
              >
                {mode === 'lumpsum' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Lumpsum
                </div>
                <div className="text-xs text-slate-500">One-time initial capital deposit</div>
              </div>
            </button>

            <button
              type="button"
              id="mf-mode-sip"
              role="radio"
              aria-checked={mode === 'sip'}
              onClick={() => setMode('sip')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'sip'
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  mode === 'sip' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}
              >
                {mode === 'sip' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  SIP
                </div>
                <div className="text-xs text-slate-500">Fixed regular monthly installments</div>
              </div>
            </button>

            <button
              type="button"
              id="mf-mode-step-up-sip"
              role="radio"
              aria-checked={mode === 'step_up_sip'}
              onClick={() => setMode('step_up_sip')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                mode === 'step_up_sip'
                  ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  mode === 'step_up_sip' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
                }`}
              >
                {mode === 'step_up_sip' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ArrowUpRight className="w-4 h-4 text-indigo-600" />
                  Step-Up SIP
                </div>
                <div className="text-xs text-slate-500">Annual systematic percentage hike</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900">
              {mode === 'lumpsum' && 'Lumpsum Parameters'}
              {mode === 'sip' && 'Monthly SIP Parameters'}
              {mode === 'step_up_sip' && 'Step-Up SIP Parameters'}
            </h2>
            <span className="text-xs text-slate-400 font-medium">All fields empty by default</span>
          </div>

          {/* Investment Amount Input with Currency Dropdown */}
          <div className="space-y-1.5">
            <label htmlFor="mf-investment-amount" className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span>
                {mode === 'lumpsum' && 'Initial Investment Amount'}
                {mode === 'sip' && 'Monthly SIP Amount'}
                {mode === 'step_up_sip' && 'Initial Monthly SIP'}
                <span className="text-rose-500 ml-0.5">*</span>
              </span>
              <span className="text-xs text-slate-500 font-normal">Active: {preferences.currency}</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="decimal"
                id="mf-investment-amount"
                value={amountText}
                onChange={(e) => setAmountText(e.target.value)}
                placeholder={mode === 'lumpsum' ? 'e.g. 100,000' : 'e.g. 10,000'}
                aria-invalid={!!errors.amount}
                className={`w-full pl-3.5 pr-28 py-2.5 bg-white border rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal ${
                  errors.amount ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              <div className="absolute right-1.5 flex items-center">
                <select
                  aria-label="Currency"
                  id="mf-currency-select"
                  value={preferences.currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  className="py-1 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg focus:outline-hidden cursor-pointer"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                    <option key={c} value={c}>
                      {c} ({CURRENCIES[c].symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {errors.amount && <p className="text-xs text-rose-600 font-medium">{errors.amount}</p>}
          </div>

          {/* Annual Step-Up Rate (Only for Step-Up SIP) */}
          {mode === 'step_up_sip' && (
            <div className="space-y-1.5">
              <label htmlFor="mf-step-up-rate" className="text-sm font-semibold text-slate-800">
                Annual SIP Increase <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  id="mf-step-up-rate"
                  value={stepUpRateText}
                  onChange={(e) => setStepUpRateText(e.target.value)}
                  placeholder="e.g. 10"
                  aria-invalid={!!errors.stepUpRate}
                  className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal ${
                    errors.stepUpRate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <span className="absolute right-3.5 text-slate-500 text-xs font-bold pointer-events-none">%</span>
              </div>
              {errors.stepUpRate && <p className="text-xs text-rose-600 font-medium">{errors.stepUpRate}</p>}
              <p className="text-xs text-slate-500">Monthly SIP escalates by this percentage every 12 months.</p>
            </div>
          )}

          {/* Expected Annual Return Rate */}
          <div className="space-y-1.5">
            <label htmlFor="mf-return-rate" className="text-sm font-semibold text-slate-800">
              Expected Annual Return Rate <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="decimal"
                id="mf-return-rate"
                value={returnRateText}
                onChange={(e) => setReturnRateText(e.target.value)}
                placeholder="e.g. 12"
                aria-invalid={!!errors.returnRate}
                className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal ${
                  errors.returnRate ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              <span className="absolute right-3.5 text-slate-500 text-xs font-bold pointer-events-none">%</span>
            </div>
            {errors.returnRate && <p className="text-xs text-rose-600 font-medium">{errors.returnRate}</p>}
          </div>

          {/* Investment Period using Reusable Zeta TermInput */}
          <div className="space-y-1.5">
            <TermInput
              id="mf-term"
              label="Investment Period"
              years={years}
              months={months}
              onChangeYears={setYears}
              onChangeMonths={setMonths}
              error={errors.term}
              required
              helpText="Supports exact partial years (e.g. 2 yrs 5 mos)"
            />
          </div>

          {/* Expected Inflation Rate (Optional) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label htmlFor="mf-inflation-rate" className="text-sm font-semibold text-slate-800">
                Expected Inflation Rate
              </label>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="decimal"
                id="mf-inflation-rate"
                value={inflationRateText}
                onChange={(e) => setInflationRateText(e.target.value)}
                placeholder="e.g. 6 (Optional)"
                aria-invalid={!!errors.inflation}
                className={`w-full pl-3.5 pr-10 py-2.5 bg-white border rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400 placeholder:font-normal ${
                  errors.inflation ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              <span className="absolute right-3.5 text-slate-500 text-xs font-bold pointer-events-none">%</span>
            </div>
            {errors.inflation && <p className="text-xs text-rose-600 font-medium">{errors.inflation}</p>}
            <p className="text-xs text-slate-500">
              When entered, shows purchasing power loss without subtracting inflation from returns.
            </p>
          </div>

          {/* SIP Timing Convention Note */}
          {(mode === 'sip' || mode === 'step_up_sip') && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong>Compounding Convention:</strong> Contributions are assumed at the end of each monthly cycle (ordinary annuity), compounding monthly until investment maturity.
              </div>
            </div>
          )}
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-6 space-y-6">
          {calculationResult ? (
            <div className="space-y-6">
              {/* Primary Metric Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Estimated Future Value (Nominal)
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{durationLabel}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tight">
                  {formatMoney(calculationResult.estimatedFutureValue)}
                </div>

                {/* Inflation Adjusted Values (If inflation entered) */}
                {calculationResult.hasInflation && calculationResult.inflationAdjustedFutureValue !== undefined && (
                  <div className="mb-5 p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Inflation-Adjusted Purchasing Power ({calculationResult.inflationRate}%)
                      </span>
                      <span className="text-base font-bold text-amber-300">
                        {formatMoney(calculationResult.inflationAdjustedFutureValue)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-700/60">
                      <span>Estimated Purchasing Power Loss</span>
                      <span className="font-semibold text-rose-400">
                        -{formatMoney(calculationResult.estimatedPurchasingPowerLoss || 0)}
                      </span>
                    </div>
                  </div>
                )}

                {/* 2-Column Summary Breakdown */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Invested</span>
                    <span className="font-bold text-base text-white">
                      {formatMoney(calculationResult.totalInvested)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Estimated Returns</span>
                    <span className="font-bold text-base text-emerald-400">
                      +{formatMoney(calculationResult.estimatedReturns)}
                    </span>
                  </div>
                </div>

                {/* Mode Specific Extra Details */}
                <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 gap-3 text-xs text-slate-300">
                  {calculationResult.mode === 'lumpsum' && (
                    <>
                      <div>
                        <span className="text-slate-400 block">Expected Return</span>
                        <span className="font-semibold text-white">{calculationResult.expectedAnnualReturnRate}% p.a.</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Duration</span>
                        <span className="font-semibold text-white">{calculationResult.totalMonths} Months</span>
                      </div>
                    </>
                  )}

                  {calculationResult.mode === 'sip' && (
                    <>
                      <div>
                        <span className="text-slate-400 block">Monthly SIP</span>
                        <span className="font-semibold text-white">{formatMoney(calculationResult.monthlySIP)}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Installments</span>
                        <span className="font-semibold text-white">{calculationResult.totalInstallments} Months</span>
                      </div>
                    </>
                  )}

                  {calculationResult.mode === 'step_up_sip' && (
                    <>
                      <div>
                        <span className="text-slate-400 block">Step-Up Rate</span>
                        <span className="font-semibold text-white">+{calculationResult.annualStepUpRate}% / year</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Final Monthly SIP</span>
                        <span className="font-semibold text-white">{formatMoney(calculationResult.finalMonthlySIPAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Visual Donut Chart */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <PieChart className="w-4 h-4 text-blue-600" />
                    Total Invested vs Estimated Returns
                  </h3>
                </div>

                <DonutChart
                  size={200}
                  centerTitle="FUTURE VALUE"
                  centerSubtitle={formatMoney(calculationResult.estimatedFutureValue)}
                  segments={[
                    {
                      label: 'Total Invested',
                      value: calculationResult.totalInvested,
                      color: '#2563eb',
                      formattedValue: formatMoney(calculationResult.totalInvested),
                    },
                    {
                      label: 'Estimated Returns',
                      value: calculationResult.estimatedReturns,
                      color: '#10b981',
                      formattedValue: formatMoney(calculationResult.estimatedReturns),
                    },
                  ]}
                />
              </div>
            </div>
          ) : (
            /* Empty Prompt State */
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-10 text-center text-slate-500 space-y-3">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 stroke-1" />
              <h3 className="font-bold text-slate-700 text-base">Awaiting Investment Parameters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill in the investment amount, expected annual return rate, and investment duration to view projected wealth growth and compounding breakdown.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Schedule Table (Section 9) */}
      {calculationResult && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-slate-700" />
              <h3 className="text-sm font-bold text-slate-900">Growth & Amortization Schedule</h3>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  id="mf-table-yearly-btn"
                  onClick={() => setBreakdownView('yearly')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    breakdownView === 'yearly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  id="mf-table-monthly-btn"
                  onClick={() => setBreakdownView('monthly')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    breakdownView === 'monthly'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Monthly ({calculationResult.totalMonths} Periods)
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition"
                aria-label="Toggle table view"
              >
                {isBreakdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isBreakdownOpen && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                    <th className="py-2.5 px-3">Period</th>
                    {(calculationResult.mode === 'sip' || calculationResult.mode === 'step_up_sip') && (
                      <th className="py-2.5 px-3">Monthly Contribution</th>
                    )}
                    <th className="py-2.5 px-3">Total Invested</th>
                    <th className="py-2.5 px-3">Estimated Growth</th>
                    <th className="py-2.5 px-3">Total Value</th>
                    {calculationResult.hasInflation && (
                      <th className="py-2.5 px-3 text-amber-700">Inflation-Adjusted Value</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {(breakdownView === 'yearly'
                    ? calculationResult.yearlyBreakdown
                    : calculationResult.monthlyBreakdown
                  ).map((row) => (
                    <tr key={row.periodLabel} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2 px-3 font-semibold text-slate-900">{row.periodLabel}</td>
                      {(calculationResult.mode === 'sip' || calculationResult.mode === 'step_up_sip') && (
                        <td className="py-2 px-3 text-slate-600">{formatMoney(row.monthlyContribution)}</td>
                      )}
                      <td className="py-2 px-3">{formatMoney(row.cumulativeInvested)}</td>
                      <td className="py-2 px-3 text-emerald-600 font-semibold">+{formatMoney(row.estimatedGrowth)}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{formatMoney(row.totalValue)}</td>
                      {calculationResult.hasInflation && (
                        <td className="py-2 px-3 text-amber-700 font-semibold">
                          {row.inflationAdjustedValue !== undefined ? formatMoney(row.inflationAdjustedValue) : '—'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Calculation Transparency & Disclaimer Card (Section 17) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
          className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-blue-600 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600" />
            How this calculation works ({mode === 'lumpsum' ? 'Lumpsum' : mode === 'sip' ? 'SIP' : 'Step-Up SIP'})
          </span>
          {isHowItWorksOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isHowItWorksOpen && (
          <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-3">
            {mode === 'lumpsum' && (
              <div>
                <p className="font-semibold text-slate-800 mb-1">Compound Growth Formula:</p>
                <code className="block p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] mb-2">
                  FV = PV × (1 + r)^t
                </code>
                <p>
                  Where <strong>PV</strong> is the initial investment amount, <strong>r</strong> is the expected annual return rate as a decimal, and <strong>t</strong> is the exact normalized duration in years (calculated as <code>totalMonths / 12</code>, preserving both years and months).
                </p>
              </div>
            )}

            {mode === 'sip' && (
              <div>
                <p className="font-semibold text-slate-800 mb-1">Monthly SIP Annuity Formula (End-of-Month Compounding):</p>
                <code className="block p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] mb-2">
                  FV = P × [ ((1 + i)^n - 1) / i ]
                </code>
                <p>
                  Where <strong>P</strong> is the monthly contribution, <strong>i</strong> is the monthly rate (<code>annualRate / 12 / 100</code>), and <strong>n</strong> is the exact total months (<code>years × 12 + months</code>). Each contribution is credited and compounded at the end of every calendar month.
                </p>
              </div>
            )}

            {mode === 'step_up_sip' && (
              <div>
                <p className="font-semibold text-slate-800 mb-1">Step-Up SIP Escalation & Compounding:</p>
                <p className="mb-2">
                  In a Step-Up SIP, your monthly installment escalates annually by the chosen step-up percentage. For any month <em>m</em> (from 1 to <em>totalMonths</em>), the monthly investment is:
                </p>
                <code className="block p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] mb-2">
                  SIP(m) = P × (1 + s)^floor((m - 1) / 12)
                </code>
                <p>
                  Each installment compounds individually for its remaining tenure up to maturity, fully supporting partial years and months (e.g. 2 years 5 months = 29 installments).
                </p>
              </div>
            )}

            {/* Inflation Explanation */}
            <div className="pt-2 border-t border-slate-100">
              <p className="font-semibold text-slate-800 mb-1">Inflation & Real Purchasing Power:</p>
              <code className="block p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-[11px] mb-2">
                Purchasing Power = Nominal FV / (1 + inflationRate)^t
              </code>
              <p>
                Inflation reflects the rising cost of goods over time. Rather than artificially subtracting inflation from your portfolio's investment return, this model discounts the future nominal corpus into today's equivalent purchasing power, calculating exact erosion.
              </p>
            </div>
          </div>
        )}

        {/* Regulatory Risk Disclaimer */}
        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900">
          <strong>Disclaimer:</strong> Expected returns are estimates, not guaranteed mutual fund returns. Mutual fund investments are subject to market risks; read all scheme-related documents carefully.
        </div>
      </div>
    </div>
  );
};
