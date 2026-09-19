import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateInterestBetweenDates,
  validateInterestBetweenDatesInput,
  normalizeInterestRate,
  computeDateBreakdown,
  InterestRateMethod,
  InterestType,
  DayCountConvention,
  InterestBetweenDatesResult,
} from '../../engine/interestBetweenDates';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { DonutChart } from '../common/DonutChart';
import { KnowledgeSection } from '../common/KnowledgeSection';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { EmbedModal } from '../common/EmbedModal';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import {
  Calendar,
  Percent,
  TrendingUp,
  Info,
  AlertCircle,
  Share2,
  Copy,
  Check,
  Code2,
  CalendarDays,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface Props {
  onSelectTool?: (slug: string) => void;
}

export const InterestBetweenDatesCalculator: React.FC<Props> = ({ onSelectTool }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // Core Inputs
  const [principal, setPrincipal] = useState<number | ''>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);

  // Rate Method: mutually exclusive
  const [rateMethod, setRateMethod] = useState<InterestRateMethod>('per_hundred_per_month');
  // Store rates per method to prevent cross-contamination
  const [percentageRateValue, setPercentageRateValue] = useState<number | ''>('');
  const [perHundredRateValue, setPerHundredRateValue] = useState<number | ''>('');

  // Optional Calculation Options
  const [interestType, setInterestType] = useState<InterestType>('simple');
  const [dayCountConvention, setDayCountConvention] = useState<DayCountConvention>('actual_365');
  const [compoundFrequency, setCompoundFrequency] = useState<'monthly' | 'quarterly' | 'half_yearly' | 'yearly'>('monthly');

  // UI States
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [shareModalOpen, setShareModalOpen] = useState<boolean>(false);
  const [embedModalOpen, setEmbedModalOpen] = useState<boolean>(false);

  // Active rate value based strictly on selected method
  const activeRateValue = rateMethod === 'percentage_per_year' ? percentageRateValue : perHundredRateValue;

  // Real-time Rate Normalization preview (even before full calculation)
  const rateNormalization = useMemo(() => {
    return normalizeInterestRate(rateMethod, activeRateValue);
  }, [rateMethod, activeRateValue]);

  // Validation
  const validation = useMemo(() => {
    return validateInterestBetweenDatesInput({
      principal,
      startDate,
      endDate,
      includeEndDate,
      rateMethod,
      rateValue: activeRateValue,
      interestType,
      dayCountConvention,
      compoundFrequency,
    });
  }, [
    principal,
    startDate,
    endDate,
    includeEndDate,
    rateMethod,
    activeRateValue,
    interestType,
    dayCountConvention,
    compoundFrequency,
  ]);

  // Calculation Result
  const calculationResult: InterestBetweenDatesResult | null = useMemo(() => {
    if (!validation.isValid) return null;
    return calculateInterestBetweenDates({
      principal,
      startDate,
      endDate,
      includeEndDate,
      rateMethod,
      rateValue: activeRateValue,
      interestType,
      dayCountConvention,
      compoundFrequency,
    });
  }, [
    validation.isValid,
    principal,
    startDate,
    endDate,
    includeEndDate,
    rateMethod,
    activeRateValue,
    interestType,
    dayCountConvention,
    compoundFrequency,
  ]);

  // Quick Date Helpers
  const setPresetDates = (preset: string) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (preset === 'last_1_year') {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'last_6_months') {
      const past = new Date();
      past.setMonth(past.getMonth() - 6);
      setStartDate(past.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'this_year') {
      const jan1 = new Date(today.getFullYear(), 0, 1);
      setStartDate(jan1.toISOString().split('T')[0]);
      setEndDate(todayStr);
    } else if (preset === 'next_1_year') {
      setStartDate(todayStr);
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      setEndDate(future.toISOString().split('T')[0]);
    }
  };

  const handleCopySummary = () => {
    if (!calculationResult) return;
    const summaryText = `--- Interest Between Dates Calculation ---
Principal: ${formatMoney(calculationResult.principal)}
Duration: ${calculationResult.startDate} to ${calculationResult.endDate} (${calculationResult.duration.formattedText})
Interest Rate Entered: ${calculationResult.rateInfo.enteredRateFormatted}
Equivalent Annual Rate: ${calculationResult.rateInfo.normalizedAnnualRateFormatted}
Calculation Rate Used: ${calculationResult.rateInfo.calculationRateUsedFormatted}
Total Interest Accrued: ${formatMoney(calculationResult.totalInterest)}
Total Amount Payable: ${formatMoney(calculationResult.totalAmount)}
Calculated on Zeta Calculator (https://zetacalculator.net)`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Tool metadata lookup
  const toolMeta = useMemo(() => {
    return TOOLS_REGISTRY.find((t) => t.slug === 'interest-between-dates-calculator');
  }, []);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!calculationResult) return null;
    return {
      toolSlug: 'interest-between-dates-calculator',
      toolName: 'Interest Between Dates Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Principal', value: formatMoney(calculationResult.principal) },
        { label: 'Date Range', value: `${calculationResult.startDate} to ${calculationResult.endDate} (${calculationResult.duration.formattedText})` },
        { label: 'Interest Rate', value: calculationResult.rateInfo.enteredRateFormatted },
        { label: 'Interest Method', value: calculationResult.interestType === 'compound' ? `Compound (${compoundFrequency})` : 'Simple Interest' },
      ],
      outputs: [
        { label: 'Total Accrued Interest', value: formatMoney(calculationResult.totalInterest), isHighlight: true },
        { label: 'Final Total Amount (P + I)', value: formatMoney(calculationResult.totalAmount) },
      ],
      customUrlParams: {
        p: calculationResult.principal,
        s: calculationResult.startDate,
        e: calculationResult.endDate,
        r: rateMethod === 'per_hundred_per_month' ? perHundredRateValue : percentageRateValue,
        m: rateMethod,
      },
    };
  }, [calculationResult, rateMethod, perHundredRateValue, percentageRateValue, formatMoney]);

  return (
    <div className="space-y-8">
      {/* Main Grid: Inputs + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (7 Cols on LG) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Calculation Inputs</h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setPrincipal('');
                setPercentageRateValue('');
                setPerHundredRateValue('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Principal Amount Input */}
          <CurrencyInput
            id="principal-amount-input"
            label="Principal Amount"
            value={principal}
            onChange={(val) => setPrincipal(val)}
            min={0}
            placeholder="e.g. 100,000"
            helpText="Total borrowed / invested"
            error={principal !== '' && validation.errors.principal ? validation.errors.principal : undefined}
            required
          />
            {/* Quick Principal Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[10000, 50000, 100000, 500000, 1000000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setPrincipal(amt)}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  +{formatMoney(amt)}
                </button>
              ))}
            </div>

          {/* Date Range Selection */}
          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Date Range <span className="text-red-500">*</span>
              </label>
              {/* Quick Date Presets */}
              <div className="flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setPresetDates('last_6_months')}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Past 6 Months
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDates('last_1_year')}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Past 1 Year
                </button>
                <button
                  type="button"
                  onClick={() => setPresetDates('this_year')}
                  className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                >
                  Year to Date
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Start Date */}
              <div className="space-y-1.5">
                <label htmlFor="start-date-input" className="block text-xs font-semibold text-slate-600">
                  From (Start Date)
                </label>
                <input
                  id="start-date-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <label htmlFor="end-date-input" className="block text-xs font-semibold text-slate-600">
                  To (End Date)
                </label>
                <input
                  id="end-date-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-semibold text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Include End Date Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="include-end-date-checkbox"
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="include-end-date-checkbox" className="text-xs text-slate-600 cursor-pointer select-none">
                Include end date in total day count (both start & end days inclusive)
              </label>
            </div>

            {startDate && endDate && (validation.errors.startDate || validation.errors.endDate) && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{validation.errors.startDate || validation.errors.endDate}</span>
              </p>
            )}
          </div>

          {/* INTEREST RATE SECTION - MUTUALLY EXCLUSIVE METHODS */}
          <div className="space-y-3 pt-2 p-4 sm:p-5 bg-gradient-to-br from-blue-50/40 via-indigo-50/30 to-slate-50/60 rounded-2xl border border-blue-100/70">
            <div className="flex items-baseline justify-between">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
                  Interest Rate <span className="text-red-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Select your rate format. Exactly one method is used for calculation.
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-700">
                Required
              </span>
            </div>

            {/* Mutually Exclusive Radio Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <label
                htmlFor="rate-method-percentage"
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  rateMethod === 'percentage_per_year'
                    ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <input
                  id="rate-method-percentage"
                  type="radio"
                  name="interestRateMethod"
                  value="percentage_per_year"
                  checked={rateMethod === 'percentage_per_year'}
                  onChange={() => setRateMethod('percentage_per_year')}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Percentage per year</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Standard annual % (e.g. 12%, 24% p.a.)
                  </span>
                </div>
              </label>

              <label
                htmlFor="rate-method-per-hundred"
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  rateMethod === 'per_hundred_per_month'
                    ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                    : 'bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300'
                }`}
              >
                <input
                  id="rate-method-per-hundred"
                  type="radio"
                  name="interestRateMethod"
                  value="per_hundred_per_month"
                  checked={rateMethod === 'per_hundred_per_month'}
                  onChange={() => setRateMethod('per_hundred_per_month')}
                  className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-800">Per ₹100 per month</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">
                    Traditional Byaj / Vaddi (₹ interest / ₹100 / mo)
                  </span>
                </div>
              </label>
            </div>

            {/* ONLY SHOW THE RELEVANT INPUT FIELD FOR THE SELECTED METHOD */}
            <div className="pt-2">
              {rateMethod === 'percentage_per_year' ? (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label htmlFor="percentage-rate-input" className="block text-xs font-semibold text-slate-700">
                    Annual Interest Rate
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <input
                      id="percentage-rate-input"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 24"
                      value={percentageRateValue === '' ? '' : percentageRateValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPercentageRateValue(val === '' ? '' : parseFloat(val));
                      }}
                      className={`w-full pl-4 pr-24 py-2.5 text-sm sm:text-base font-semibold text-slate-800 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                        percentageRateValue !== '' && validation.errors.rateValue
                          ? 'border-red-400 bg-red-50/20 text-red-900'
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs bg-slate-100/80 px-3 my-1 mr-1 rounded-lg border border-slate-200/60">
                      % per year
                    </div>
                  </div>

                  {/* Preset chips for Percentage */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[6, 8.5, 10, 12, 18, 24, 30, 36].map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setPercentageRateValue(pVal)}
                        className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                          percentageRateValue === pVal
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {pVal}%
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in duration-200">
                  <label htmlFor="per-hundred-rate-input" className="block text-xs font-semibold text-slate-700">
                    Interest Amount per ₹100 per month
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                      ₹
                    </div>
                    <input
                      id="per-hundred-rate-input"
                      type="number"
                      min="0"
                      step="any"
                      placeholder="e.g. 2"
                      value={perHundredRateValue === '' ? '' : perHundredRateValue}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPerHundredRateValue(val === '' ? '' : parseFloat(val));
                      }}
                      className={`w-full pl-8 pr-36 py-2.5 text-sm sm:text-base font-semibold text-slate-800 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                        perHundredRateValue !== '' && validation.errors.rateValue
                          ? 'border-red-400 bg-red-50/20 text-red-900'
                          : 'border-slate-200 focus:border-blue-500'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-600 font-bold text-xs bg-slate-100/80 px-2.5 my-1 mr-1 rounded-lg border border-slate-200/60">
                      per ₹100 per month
                    </div>
                  </div>

                  {/* Preset chips for Per ₹100 */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      { val: 1, label: '₹1 (12% p.a.)' },
                      { val: 1.5, label: '₹1.5 (18% p.a.)' },
                      { val: 2, label: '₹2 (24% p.a.)' },
                      { val: 2.5, label: '₹2.5 (30% p.a.)' },
                      { val: 3, label: '₹3 (36% p.a.)' },
                    ].map((item) => (
                      <button
                        key={item.val}
                        type="button"
                        onClick={() => setPerHundredRateValue(item.val)}
                        className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors ${
                          perHundredRateValue === item.val
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Rate Error message */}
              {activeRateValue !== '' && validation.errors.rateValue && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{validation.errors.rateValue}</span>
                </p>
              )}

              {/* Live Rate Normalization Preview Box */}
              {rateNormalization.isValid && rateNormalization.normalization && (
                <div className="mt-3 p-3 bg-white/90 rounded-xl border border-blue-200/80 text-xs space-y-1.5 text-slate-700 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-blue-900 pb-1 border-b border-blue-100">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      Automatic Transparent Rate Conversion
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600">Normalized Live</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-0.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Entered Rate</span>
                      <span className="font-semibold text-slate-900">{rateNormalization.normalization.enteredRateFormatted}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Equivalent Annual Rate</span>
                      <span className="font-bold text-blue-700">{rateNormalization.normalization.normalizedAnnualRateFormatted}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Calculation Rate Used</span>
                      <span className="font-bold text-emerald-700">{rateNormalization.normalization.calculationRateUsedFormatted}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Calculation Options (Accordion / Section) */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Calculation Settings
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="interest-type-select" className="block text-xs font-medium text-slate-500">
                  Interest Mode
                </label>
                <select
                  id="interest-type-select"
                  value={interestType}
                  onChange={(e) => setInterestType(e.target.value as InterestType)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="simple">Simple Interest (Standard)</option>
                  <option value="compound">Compound Interest</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="day-count-select" className="block text-xs font-medium text-slate-500">
                  Day Count Basis
                </label>
                <select
                  id="day-count-select"
                  value={dayCountConvention}
                  onChange={(e) => setDayCountConvention(e.target.value as DayCountConvention)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="actual_365">Exact Day Count (Actual / 365)</option>
                  <option value="calendar_breakdown">Calendar Breakdown (Y / M / D)</option>
                  <option value="actual_360">Commercial Basis (Actual / 360)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Results & Transparency Card (5 Cols on LG) */}
        <div className="lg:col-span-5 space-y-6">
          {calculationResult ? (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Primary Summary Card */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Calculated Summary
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {calculationResult.interestType === 'simple' ? 'Simple Interest' : 'Compound Interest'}
                  </span>
                </div>

                {/* Hero Accrued Interest */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Total Interest Accrued
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                    {formatMoney(calculationResult.totalInterest)}
                  </div>
                  <span className="text-xs text-slate-300 block pt-0.5">
                    Over {calculationResult.duration.formattedText}
                  </span>
                </div>

                {/* Total Balance / Amount */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Principal Amount</span>
                    <span className="font-bold text-white">{formatMoney(calculationResult.principal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Total Interest</span>
                    <span className="font-bold text-emerald-400">+{formatMoney(calculationResult.totalInterest)}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Total Repayment Amount</span>
                    <span className="text-lg font-black text-white">{formatMoney(calculationResult.totalAmount)}</span>
                  </div>
                </div>

                {/* Key Metric Rates */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Interest</span>
                    <span className="text-sm font-bold text-white">{formatMoney(calculationResult.monthlyInterest)} / mo</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Daily Interest</span>
                    <span className="text-sm font-bold text-white">{formatMoney(calculationResult.dailyInterest)} / day</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopySummary}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmbedModalOpen(true)}
                    className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Embed</span>
                  </button>
                </div>
              </div>

              {/* IMPORTANT DISPLAY REQUIREMENT: RATE TRANSPARENCY CARD */}
              <div className="bg-white rounded-2xl border border-blue-200/80 shadow-xs p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Rate Normalization Transparency
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-semibold text-slate-600">Interest Rate Entered</span>
                    <span className="font-black text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                      {calculationResult.rateInfo.enteredRateFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <span className="font-semibold text-blue-900">Equivalent Annual Rate</span>
                    <span className="font-black text-blue-700 bg-white px-2.5 py-1 rounded-md border border-blue-200">
                      {calculationResult.rateInfo.normalizedAnnualRateFormatted}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <span className="font-semibold text-emerald-900">Calculation Rate Used</span>
                    <span className="font-black text-emerald-700 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                      {calculationResult.rateInfo.calculationRateUsedFormatted}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  The date-based engine computes interest on the exact calendar duration using the standardized annual rate decimal ({calculationResult.rateInfo.annualRateDecimal}).
                </p>
              </div>

              {/* Visual Breakdown Donut Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Principal vs Interest Breakdown
                </h3>
                <div className="flex justify-center">
                  <DonutChart
                    segments={[
                      {
                        label: 'Principal Amount',
                        value: calculationResult.principal,
                        color: '#3B82F6',
                      },
                      {
                        label: 'Total Interest',
                        value: calculationResult.totalInterest,
                        color: '#10B981',
                      },
                    ]}
                    size={200}
                    centerTitle="Total Amount"
                    centerSubtitle={formatMoney(calculationResult.totalAmount)}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Prompt State when not calculated or missing required inputs */
            <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800">Enter Details to Calculate</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Provide the principal amount, start & end dates, and interest rate to see instant date-range calculations.
                </p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-left text-xs space-y-1.5 text-slate-600">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Required Fields:</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${principal !== '' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Principal Amount</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${startDate && endDate ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Start & End Dates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${activeRateValue !== '' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                  <span>Interest Rate ({rateMethod === 'per_hundred_per_month' ? 'Per ₹100/mo' : '% per year'})</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step-by-Step Calculation Walkthrough & Breakdown Table */}
      {calculationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Deterministic Step-by-Step Mathematical Walkthrough
            </h3>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200/80 space-y-2.5 font-mono text-xs text-slate-800 overflow-x-auto">
            {calculationResult.calculationSteps.map((step, idx) => (
              <div key={idx} className="leading-relaxed">
                {step}
              </div>
            ))}
          </div>

          {/* Periodic Schedule Table */}
          {calculationResult.schedule.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Chronological Accrual Schedule
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-3">Period</th>
                      <th className="py-2.5 px-3">Days</th>
                      <th className="py-2.5 px-3">Interest Accrued</th>
                      <th className="py-2.5 px-3">Cumulative Interest</th>
                      <th className="py-2.5 px-3">Total Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {calculationResult.schedule.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.period}</td>
                        <td className="py-2 px-3">{row.days} days</td>
                        <td className="py-2 px-3 font-medium text-emerald-600">{formatMoney(row.interest)}</td>
                        <td className="py-2 px-3 font-medium text-slate-800">{formatMoney(row.cumulativeInterest)}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{formatMoney(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Educational Knowledge Section */}
      {toolMeta && (
        <KnowledgeSection
          tool={toolMeta}
          onSelectTool={onSelectTool}
        />
      )}

      {/* Share & Embed Modals */}
      {shareModalOpen && toolMeta && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          title={toolMeta.name}
          toolSlug={toolMeta.slug}
          toolName={toolMeta.name}
          categorySlug="finance"
          calculationData={calculationShareData}
        />
      )}
      {embedModalOpen && toolMeta && (
        <EmbedModal
          isOpen={embedModalOpen}
          onClose={() => setEmbedModalOpen(false)}
          toolSlug={toolMeta.slug}
          toolName={toolMeta.name}
        />
      )}
    </div>
  );
};
