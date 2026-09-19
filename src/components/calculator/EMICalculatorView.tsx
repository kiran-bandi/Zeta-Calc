import React, { useState, useMemo, useEffect } from 'react';
import { useSessionState } from '../../utils/useSessionState';
import {
  RotateCcw,
  Share2,
  Printer,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  AlertCircle,
  Copy,
  DollarSign,
  ArrowRight,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useHistory } from '../../context/HistoryContext';
import { calculateEMI, validateEMIInput, EMIInput } from '../../engine/emi';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { CurrencyInput } from '../common/CurrencyInput';
import { TermInput } from '../common/TermInput';
import { normalizeTerm, monthsToTerm } from '../../engine/termEngine';
import { DonutChart } from '../common/DonutChart';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQAccordion } from '../common/FAQAccordion';
import { ToolMetadata } from '../../types/calculator';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { ToolIcon } from '../common/AppIcon';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';

interface EMICalculatorViewProps {
  tool: ToolMetadata;
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onSelectTool: (slug: string) => void;
  onGoBack?: () => void;
}

export const EMICalculatorView: React.FC<EMICalculatorViewProps> = ({
  tool,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
  onGoBack,
}) => {
  const { formatMoney, currencySymbol, preferences } = useSettings();
  const { recordToolUsage } = useHistory();

  // Record usage when loaded
  useEffect(() => {
    recordToolUsage(tool.slug);
  }, [tool.slug]);

  // Start with empty input states so user enters their own values, persisted across tab/tool navigation
  const [loanAmount, setLoanAmount] = useSessionState<number | ''>('emi_loan_amount', '');
  const [interestRate, setInterestRate] = useSessionState<number | ''>('emi_interest_rate', '');
  const [tenureYears, setTenureYears] = useSessionState<number | ''>('emi_tenure_years', '');
  const [tenureMonths, setTenureMonths] = useSessionState<number | ''>('emi_tenure_months', '');

  // Hydrate from URL query parameters if available
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return;
    const queryString = hash.substring(queryIndex + 1);
    const params = new URLSearchParams(queryString);

    const amt = params.get('amount') || params.get('p');
    const r = params.get('rate') || params.get('r');
    const m = params.get('months') || params.get('m');
    const y = params.get('years') || params.get('t');

    if (amt && !isNaN(Number(amt))) setLoanAmount(Number(amt));
    if (r && !isNaN(Number(r))) setInterestRate(Number(r));
    if (m && !isNaN(Number(m))) {
      const totalM = Number(m);
      setTenureYears(Math.floor(totalM / 12));
      setTenureMonths(totalM % 12);
    } else if (y && !isNaN(Number(y))) {
      setTenureYears(Number(y));
      setTenureMonths(0);
    }
  }, []);

  // Normalized term
  const normalizedTerm = useMemo(() => {
    return normalizeTerm({ years: tenureYears, months: tenureMonths });
  }, [tenureYears, tenureMonths]);

  // View mode for amortization: yearly vs monthly
  const [amortizationTab, setAmortizationTab] = useState<'yearly' | 'monthly'>('yearly');
  const [monthlyPage, setMonthlyPage] = useState<number>(1);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Synchronize currency default presets
  const loanPresets = useMemo(() => {
    if (preferences.currency === 'INR') {
      return [
        { label: '₹10 Lakh', value: 1000000 },
        { label: '₹25 Lakh', value: 2500000 },
        { label: '₹50 Lakh', value: 5000000 },
        { label: '₹1 Crore', value: 10000000 },
      ];
    } else {
      return [
        { label: '$50k', value: 50000 },
        { label: '$150k', value: 150000 },
        { label: '$350k', value: 350000 },
        { label: '$500k', value: 500000 },
      ];
    }
  }, [preferences.currency]);

  const ratePresets = [
    { label: '7.5%', value: 7.5 },
    { label: '8.5%', value: 8.5 },
    { label: '9.5%', value: 9.5 },
    { label: '11.0%', value: 11.0 },
  ];

  // Validation
  const validation = useMemo(() => {
    const errors: Record<string, string> = {};
    if (loanAmount === '' || interestRate === '' || !normalizedTerm.isValid) {
      if (!normalizedTerm.isValid && (tenureYears !== '' || tenureMonths !== '')) {
        errors.tenure = normalizedTerm.error || 'Invalid tenure';
      }
      return { isValid: false, errors };
    }
    const emiValidation = validateEMIInput({ loanAmount, interestRate, tenure: normalizedTerm.totalMonths, tenureUnit: 'months' });
    return emiValidation;
  }, [loanAmount, interestRate, normalizedTerm, tenureYears, tenureMonths]);

  // Calculation
  const result = useMemo(() => {
    if (!validation.isValid || loanAmount === '' || interestRate === '' || !normalizedTerm.isValid) return null;
    try {
      return calculateEMI({ loanAmount, interestRate, tenure: normalizedTerm.totalMonths, tenureUnit: 'months' });
    } catch {
      return null;
    }
  }, [loanAmount, interestRate, normalizedTerm, validation.isValid]);

  const currentCategory = CATEGORIES.find((c) => c.id === tool.category);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result || typeof loanAmount !== 'number' || typeof interestRate !== 'number') return null;
    return {
      toolSlug: tool.slug,
      toolName: tool.name,
      categorySlug: currentCategory?.slug || 'loans',
      inputs: [
        { label: 'Loan Amount', value: formatMoney(loanAmount) },
        { label: 'Interest Rate', value: `${interestRate}% p.a.` },
        { label: 'Loan Duration', value: `${normalizedTerm.totalMonths} Months (${normalizedTerm.years}y ${normalizedTerm.months}m)` },
      ],
      outputs: [
        { label: 'Monthly Repayment (EMI)', value: `${formatMoney(result.monthlyEMI)} / mo`, isHighlight: true },
        { label: 'Total Principal', value: formatMoney(result.principalAmount) },
        { label: 'Total Interest Payable', value: formatMoney(result.totalInterest) },
        { label: 'Total Amount Payable', value: formatMoney(result.totalPayment) },
      ],
      customUrlParams: {
        amount: loanAmount,
        rate: interestRate,
        months: normalizedTerm.totalMonths,
      },
    };
  }, [result, loanAmount, interestRate, normalizedTerm, tool.slug, tool.name, currentCategory, formatMoney]);

  const handleReset = () => {
    setLoanAmount('');
    setInterestRate('');
    setTenureYears('');
    setTenureMonths('');
    setMonthlyPage(1);
  };

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pagination for monthly amortization (12 months per page)
  const monthlyItemsPerPage = 12;
  const totalMonthlyPages = result ? Math.ceil(result.monthlyAmortization.length / monthlyItemsPerPage) : 1;
  const paginatedMonthly = useMemo(() => {
    if (!result) return [];
    const start = (monthlyPage - 1) * monthlyItemsPerPage;
    return result.monthlyAmortization.slice(start, start + monthlyItemsPerPage);
  }, [result, monthlyPage]);

  // Related Tools
  const relatedTools = TOOLS_REGISTRY.filter((t) =>
    t.slug !== tool.slug && (tool.relatedToolSlugs?.includes(t.slug) || (!tool.relatedToolSlugs?.length && t.category === tool.category))
  ).slice(0, 4);

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        onBack={onGoBack}
        items={[
          { label: 'Home', onClick: onNavigateHome },
          {
            label: currentCategory ? currentCategory.name : 'Finance',
            onClick: () => onNavigateCategory(tool.category),
          },
          { label: tool.name, active: true },
        ]}
      />

      {/* 2. Header Title & Description */}
      <div className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 uppercase tracking-wider">
            {currentCategory?.name || 'Loans'}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            Deterministic Math
          </span>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100 shadow-2xs">
            <ToolIcon slug={tool.slug} size={26} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-2 text-base text-slate-600 max-w-3xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* 4 & 5: Calculator Interface + Result Section (Above the Fold Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Inputs Card (5 cols on lg) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-5 mb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Loan Parameters</h2>
            <button
              type="button"
              id="emi-reset-btn"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Input 1: Loan Amount with field-level currency dropdown */}
            <CurrencyInput
              id="emi-loan-amount"
              label="Total Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              error={validation.errors.loanAmount}
              placeholder="e.g. 250,000"
            />

            {/* Input 2: Interest Rate */}
            <NumberSliderInput
              id="emi-interest-rate"
              label="Annual Interest Rate (% p.a.)"
              value={interestRate}
              onChange={setInterestRate}
              min={1}
              max={30}
              step={0.1}
              suffix="%"
              error={validation.errors.interestRate}
              presets={ratePresets}
            />

            {/* Input 3: Loan Tenure */}
            <TermInput
              id="emi-tenure"
              label="Loan Duration / Tenure"
              years={tenureYears}
              months={tenureMonths}
              onChangeYears={setTenureYears}
              onChangeMonths={setTenureMonths}
              error={validation.errors.tenure}
              helpText="Enter loan duration in years and months"
            />
          </div>

          {/* Quick Guidance Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Calculated using the monthly reducing balance formula standard among major retail banks.
            </span>
          </div>
        </div>

        {/* Right Side: Results & Chart (6 cols on lg) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Key Results Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                Monthly Repayment
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="emi-share-btn"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
                  title="Copy shareable link"
                >
                  {shareCopied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  id="emi-print-btn"
                  onClick={handlePrint}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 transition-colors"
                  title="Print breakdown"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Big Headline EMI Number */}
            <div className="mb-6">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                {result ? formatMoney(result.monthlyEMI) : '—'}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-2">/ month</span>
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Principal Amount</span>
                <span className="font-bold text-white text-sm">
                  {result ? formatMoney(result.totalPrincipal) : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Total Interest</span>
                <span className="font-bold text-amber-400 text-sm">
                  {result ? formatMoney(result.totalInterest) : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Total Payment</span>
                <span className="font-bold text-white text-sm">
                  {result ? formatMoney(result.totalPayment) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Principal vs Interest Chart Card */}
          {result && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">
                Payment Distribution Breakdown
              </h3>
              <DonutChart
                size={190}
                centerTitle="Total Payment"
                centerSubtitle={formatMoney(result.totalPayment)}
                segments={[
                  {
                    label: 'Principal Loan Amount',
                    value: result.totalPrincipal,
                    color: '#2563eb', // Blue-600
                    formattedValue: formatMoney(result.totalPrincipal),
                  },
                  {
                    label: 'Total Interest Payable',
                    value: result.totalInterest,
                    color: '#f59e0b', // Amber-500
                    formattedValue: formatMoney(result.totalInterest),
                  },
                ]}
              />

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Principal: <strong className="text-slate-800">{result.principalRatio}%</strong></span>
                <span>Interest: <strong className="text-amber-600">{result.interestRatio}%</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Complete Amortization Schedule Table */}
      {result ? (
        <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Loan Amortization Schedule</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Detailed breakdown of principal reduction, interest paid, and remaining balance.
              </p>
            </div>

            {/* Toggle Yearly vs Monthly */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                id="amortization-tab-yearly"
                onClick={() => setAmortizationTab('yearly')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  amortizationTab === 'yearly'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Yearly View ({result.yearlyAmortization.length} Yrs)
              </button>
              <button
                type="button"
                id="amortization-tab-monthly"
                onClick={() => {
                  setAmortizationTab('monthly');
                  setMonthlyPage(1);
                }}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  amortizationTab === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Breakdown ({result.monthlyAmortization.length} Mos)
              </button>
            </div>
          </div>

          {/* Schedule Table */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">EMI Paid</th>
                  <th className="py-3 px-4">Principal Component</th>
                  <th className="py-3 px-4">Interest Component</th>
                  <th className="py-3 px-4">Total Interest to Date</th>
                  <th className="py-3 px-4 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(amortizationTab === 'yearly' ? result.yearlyAmortization : paginatedMonthly).map(
                  (row) => (
                    <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.label}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{formatMoney(row.emi)}</td>
                      <td className="py-3 px-4 font-medium text-blue-600">{formatMoney(row.principal)}</td>
                      <td className="py-3 px-4 font-medium text-amber-600">{formatMoney(row.interest)}</td>
                      <td className="py-3 px-4 text-slate-500">{formatMoney(row.totalInterestToDate)}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {formatMoney(row.balance)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Monthly Pagination Controls */}
          {amortizationTab === 'monthly' && totalMonthlyPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500">
              <span>
                Showing months {(monthlyPage - 1) * monthlyItemsPerPage + 1} to{' '}
                {Math.min(monthlyPage * monthlyItemsPerPage, result.monthlyAmortization.length)} of{' '}
                {result.monthlyAmortization.length}
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  id="amortization-page-prev"
                  disabled={monthlyPage === 1}
                  onClick={() => setMonthlyPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-semibold text-slate-700"
                >
                  Previous
                </button>
                <button
                  type="button"
                  id="amortization-page-next"
                  disabled={monthlyPage === totalMonthlyPages}
                  onClick={() => setMonthlyPage((p) => Math.min(totalMonthlyPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none font-semibold text-slate-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-8 sm:p-10 shadow-xs text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
              <Calendar className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Loan Amortization Schedule</h2>
            <p className="text-sm text-slate-500">
              Enter loan details above to view the amortization schedule.
            </p>
          </div>
        </section>
      )}

      {/* 7. "What Does This Result Mean?" Plain Language Explanation */}
      {tool.explanation?.summary && (
        <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
            What does this result mean?
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {tool.explanation.summary}
          </p>

          {tool.explanation.breakdown && tool.explanation.breakdown.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-100">
              {tool.explanation.breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 8. Mathematical Formula & Variables */}
      {tool.formula?.expression && (
        <section className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
            EMI Mathematical Formula
          </h2>
          <p className="text-xs text-slate-600 mb-4">
            Retail loan installments are computed using standard annuity mathematics with monthly compounded reducing balances:
          </p>

          <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-sm sm:text-base text-slate-900 text-center shadow-xs overflow-x-auto">
            {tool.formula.expression || `EMI = [ P × r × (1 + r)ⁿ ] ÷ [ (1 + r)ⁿ - 1 ]`}
          </div>

          {tool.formula.variables && tool.formula.variables.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs text-slate-600">
              {tool.formula.variables.map((v) => (
                <div key={v.symbol} className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="font-bold text-slate-900 font-mono mr-1.5">{v.symbol}:</strong>
                  <span>{v.explanation}</span>
                </div>
              ))}
            </div>
          )}
          {tool.formula.notes && (
            <p className="text-xs text-slate-500 mt-3 italic">{tool.formula.notes}</p>
          )}
        </section>
      )}

      {/* 9. Practical Example Calculation */}
      {tool.example?.title && (
        <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
            {tool.example.title}
          </h2>
          {tool.example.description && (
            <p className="text-xs text-slate-600 mb-4">{tool.example.description}</p>
          )}

          {tool.example.inputs && tool.example.results && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-4 text-xs">
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Inputs Entered
                </span>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(tool.example.inputs).map(([k, v]) => (
                    <li key={k} className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span>{k}:</span>
                      <strong className="text-slate-900">{v}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Calculated Outcomes
                </span>
                <ul className="space-y-1 text-slate-600">
                  {Object.entries(tool.example.results).map(([k, v]) => (
                    <li key={k} className="flex justify-between border-b border-slate-200/60 pb-1">
                      <span>{k}:</span>
                      <strong className="text-blue-700">{v}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tool.example.walkthrough && tool.example.walkthrough.length > 0 && (
            <div className="space-y-1 text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-1">Step-by-step Walkthrough:</span>
              {tool.example.walkthrough.map((step, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{step}</span>
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 10. Important Considerations */}
      {tool.explanation?.considerations && tool.explanation.considerations.length > 0 && (
        <section className="mt-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-7">
          <h2 className="text-base font-bold text-amber-950 tracking-tight mb-2">
            Important Financial Considerations
          </h2>
          <ul className="space-y-2 text-xs text-amber-900">
            {tool.explanation.considerations.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 11. FAQ Accordion */}
      {tool.faqs && tool.faqs.length > 0 && (
        <FAQAccordion faqs={tool.faqs} />
      )}

      {/* 12. Related Calculators */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
            Related Calculators & Utilities
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => (
              <button
                key={rel.id}
                type="button"
                id={`related-tool-card-${rel.slug}`}
                onClick={() => onSelectTool(rel.slug)}
                className="text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-white group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-2.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ToolIcon slug={rel.slug} size={16} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-blue-600">
                  <span>Open calculator</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={tool.name}
        toolName={tool.name}
        toolSlug={tool.slug}
        categorySlug={currentCategory?.slug}
        description={tool.description}
        calculationData={calculationShareData}
      />
    </article>
  );
};
