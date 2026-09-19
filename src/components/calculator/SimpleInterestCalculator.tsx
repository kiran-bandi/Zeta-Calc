import React, { useState, useMemo, useEffect } from 'react';
import {
  calculateMultiDirectionSimpleInterest,
  SimpleInterestTarget,
  TimeUnit,
} from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { CurrencyInput } from '../common/CurrencyInput';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';
import { DonutChart } from '../common/DonutChart';
import { SavedValuesControls } from '../common/SavedValuesControls';
import { KnowledgeSection } from '../common/KnowledgeSection';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData, getShareableBaseUrl, setActiveCalculationData } from '../../utils/shareUtils';
import { EmbedModal } from '../common/EmbedModal';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import {
  Calendar,
  TrendingUp,
  Info,
  Share2,
  Copy,
  Check,
  Sparkles,
  Code2,
  RefreshCw,
} from 'lucide-react';

export const SimpleInterestCalculator: React.FC<{ onSelectTool?: (slug: string) => void }> = ({
  onSelectTool,
}) => {
  const { formatMoney, currencySymbol } = useSettings();

  // Multi-Direction Solve-For Target
  const [solveTarget, setSolveTarget] = useState<SimpleInterestTarget>('interest');

  // ZERO DEFAULT VALUES - All fields start empty
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [timeYears, setTimeYears] = useState<number | ''>('');
  const [timeMonths, setTimeMonths] = useState<number | ''>('');
  const [timeDays, setTimeDays] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [interest, setInterest] = useState<number | ''>('');
  const [timeUnit, setTimeUnit] = useState<TimeUnit>('years');

  const [isSharedState, setIsSharedState] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Modals
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);

  // Look up metadata
  const toolMeta = useMemo(() => {
    return (
      TOOLS_REGISTRY.find((t) => t.slug === 'simple-interest-calculator') || {
        id: 'simple-interest-calculator',
        name: 'Simple Interest Calculator',
        slug: 'simple-interest-calculator',
        category: 'money',
        subcategory: 'savings',
        description: 'Calculate simple interest, principal, rate, or duration.',
        shortDescription: 'Compute simple interest with multi-direction solving.',
        iconName: 'Percent',
        formula: {
          expression: 'SI = (P * R * T) / 100',
          variables: [
            { symbol: 'SI', explanation: 'Simple Interest Amount' },
            { symbol: 'P', explanation: 'Principal Loan/Deposit Amount' },
            { symbol: 'R', explanation: 'Annual Interest Rate (%)' },
            { symbol: 'T', explanation: 'Time Period (Years, Months, Days)' },
          ],
        },
        explanation: {
          summary: 'Simple interest accrues linearly on the initial principal without compounding.',
          breakdown: [],
          considerations: [],
        },
        example: {
          title: 'Standard Simple Interest',
          description: 'Flat rate interest calculation',
          inputs: {},
          results: {},
          walkthrough: [],
        },
        faqs: [],
        relatedToolSlugs: ['emi-calculator', 'sip-calculator'],
        status: 'active' as const,
        synonyms: [],
        phrases: [],
        seo: { title: 'Simple Interest Calculator', metaDescription: '', keywords: [] },
      }
    );
  }, []);

  const relatedTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) =>
      t.slug !== toolMeta.slug && (toolMeta.relatedToolSlugs?.includes(t.slug) || (!toolMeta.relatedToolSlugs?.length && t.category === toolMeta.category))
    ).slice(0, 4);
  }, [toolMeta]);

  // Read URL query parameters for shared state reproduction
  useEffect(() => {
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const queryString = hash.substring(queryIndex + 1);
      const params = new URLSearchParams(queryString);

      const targetParam = params.get('target') as SimpleInterestTarget | null;
      const pParam = params.get('p');
      const rParam = params.get('r');
      const tParam = params.get('t');
      const iParam = params.get('i');
      const uParam = params.get('u') as TimeUnit | null;

      let hydrated = false;
      if (targetParam && ['interest', 'principal', 'rate', 'time'].includes(targetParam)) {
        setSolveTarget(targetParam);
        hydrated = true;
      }
      if (pParam && !isNaN(Number(pParam))) {
        setPrincipal(Number(pParam));
        hydrated = true;
      }
      if (rParam && !isNaN(Number(rParam))) {
        setRate(Number(rParam));
        hydrated = true;
      }
      if (tParam && !isNaN(Number(tParam))) {
        setTime(Number(tParam));
        hydrated = true;
      }
      if (iParam && !isNaN(Number(iParam))) {
        setInterest(Number(iParam));
        hydrated = true;
      }
      if (uParam && ['years', 'months', 'days'].includes(uParam)) {
        setTimeUnit(uParam);
        hydrated = true;
      }

      if (hydrated) {
        setIsSharedState(true);
      }
    }
  }, []);

  const normalizedTerm = useMemo(() => {
    return normalizeTerm({ years: timeYears, months: timeMonths, days: timeDays });
  }, [timeYears, timeMonths, timeDays]);

  const handleReset = () => {
    setPrincipal('');
    setRate('');
    setTimeYears('');
    setTimeMonths('');
    setTimeDays('');
    setTime('');
    setInterest('');
    setTimeUnit('years');
    setIsSharedState(false);
  };

  const handleRestoreSaved = (data: Record<string, any>) => {
    if (data.solveTarget) setSolveTarget(data.solveTarget);
    if (data.principal !== undefined) setPrincipal(data.principal);
    if (data.rate !== undefined) setRate(data.rate);
    if (data.time !== undefined) setTime(data.time);
    if (data.interest !== undefined) setInterest(data.interest);
    if (data.timeUnit) setTimeUnit(data.timeUnit);
  };

  // Immediate deterministic calculation whenever required inputs are provided
  const result = useMemo(() => {
    // Check if user has entered the required inputs for the active target
    if (solveTarget === 'interest') {
      if (typeof principal !== 'number' || principal <= 0) return null;
      if (typeof rate !== 'number' || rate < 0) return null;
      if (!normalizedTerm.isValid || normalizedTerm.totalMonths <= 0) return null;
    } else if (solveTarget === 'principal') {
      if (typeof interest !== 'number' || interest <= 0) return null;
      if (typeof rate !== 'number' || rate <= 0) return null;
      if (!normalizedTerm.isValid || normalizedTerm.totalMonths <= 0) return null;
    } else if (solveTarget === 'rate') {
      if (typeof principal !== 'number' || principal <= 0) return null;
      if (typeof interest !== 'number' || interest < 0) return null;
      if (!normalizedTerm.isValid || normalizedTerm.totalMonths <= 0) return null;
    } else if (solveTarget === 'time') {
      if (typeof principal !== 'number' || principal <= 0) return null;
      if (typeof rate !== 'number' || rate <= 0) return null;
      if (typeof interest !== 'number' || interest <= 0) return null;
    }

    const calcTime = solveTarget === 'time' ? (time === '' ? undefined : Number(time)) : normalizedTerm.totalMonths;
    const calcTimeUnit = solveTarget === 'time' ? timeUnit : 'months';

    return calculateMultiDirectionSimpleInterest({
      target: solveTarget,
      principal: principal === '' ? undefined : Number(principal),
      ratePercentage: rate === '' ? undefined : Number(rate),
      time: calcTime,
      timeUnit: calcTimeUnit,
      interest: interest === '' ? undefined : Number(interest),
    });
  }, [solveTarget, principal, rate, time, timeUnit, interest, normalizedTerm]);

  const chartSegments = useMemo(() => {
    if (!result) return [];
    return [
      { label: 'Principal Amount', value: result.principal, color: '#3b82f6' },
      { label: 'Total Simple Interest', value: result.simpleInterest, color: '#10b981' },
    ];
  }, [result]);

  const handleCopySummary = () => {
    if (!result) return;
    const summary = `Zeta Calculator Result:
Solve For: ${solveTarget.toUpperCase()}
Principal: ${formatMoney(result.principal)}
Rate: ${result.ratePercentage}% per year
Time: ${result.timeDisplay}
Simple Interest: ${formatMoney(result.simpleInterest)}
Total Amount: ${formatMoney(result.totalAmount)}
Calculated on: https://zetacalculator.net/#/tool/simple-interest-calculator`;

    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // Generate share URL
  const shareUrl = useMemo(() => {
    const origin = getShareableBaseUrl();
    const params = new URLSearchParams();
    params.set('target', solveTarget);
    if (principal !== '') params.set('p', String(principal));
    if (rate !== '') params.set('r', String(rate));
    if (time !== '') params.set('t', String(time));
    if (interest !== '') params.set('i', String(interest));
    params.set('u', timeUnit);

    return `${origin}/#/tool/simple-interest-calculator?${params.toString()}`;
  }, [solveTarget, principal, rate, time, interest, timeUnit]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result) return null;
    return {
      toolSlug: 'simple-interest-calculator',
      toolName: 'Simple Interest Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Principal', value: formatMoney(result.principal) },
        { label: 'Annual Interest Rate', value: `${result.ratePercentage}% p.a.` },
        { label: 'Time Duration', value: result.timeDisplay },
      ],
      outputs: [
        { label: 'Total Simple Interest', value: formatMoney(result.simpleInterest), isHighlight: true },
        { label: 'Final Total Amount (P + I)', value: formatMoney(result.totalAmount) },
      ],
      customUrlParams: {
        target: solveTarget,
        p: result.principal,
        r: result.ratePercentage,
        t: time,
        u: timeUnit,
      },
    };
  }, [result, solveTarget, time, timeUnit, formatMoney]);

  // Beautiful textual message for messaging/social sharing
  const shareTextSummary = useMemo(() => {
    if (!result) return '';
    const formattedPrincipal = formatMoney(result.principal);
    const formattedInterest = formatMoney(result.simpleInterest);
    const formattedTotal = formatMoney(result.totalAmount);
    const formattedRate = `${result.ratePercentage}%`;
    const formattedDuration = result.timeDisplay;

    switch (solveTarget) {
      case 'interest':
        return `I calculated simple interest using Zeta Calculator! 📈\n\n💰 Principal: ${formattedPrincipal}\n⚡ Rate: ${formattedRate} p.a.\n⏱️ Duration: ${formattedDuration}\n\n✨ Total Simple Interest Earned: ${formattedInterest}\n💳 Total Value (P + SI): ${formattedTotal}\n\nCheck out the full calculation here:`;
      case 'principal':
        return `I calculated the principal required using Zeta Calculator! 📈\n\n💵 Target Interest: ${formattedInterest}\n⚡ Rate: ${formattedRate} p.a.\n⏱️ Duration: ${formattedDuration}\n\n✨ Required Principal: ${formattedPrincipal}\n💳 Total Value (P + SI): ${formattedTotal}\n\nCheck out the full calculation here:`;
      case 'rate':
        return `I calculated the interest rate required using Zeta Calculator! 📈\n\n💰 Principal: ${formattedPrincipal}\n💵 Target Interest: ${formattedInterest}\n⏱️ Duration: ${formattedDuration}\n\n✨ Required Annual Rate: ${formattedRate}\n💳 Total Value (P + SI): ${formattedTotal}\n\nCheck out the full calculation here:`;
      case 'time':
        return `I calculated the time duration required using Zeta Calculator! 📈\n\n💰 Principal: ${formattedPrincipal}\n⚡ Rate: ${formattedRate} p.a.\n💵 Target Interest: ${formattedInterest}\n\n✨ Required Time: ${formattedDuration}\n💳 Total Value (P + SI): ${formattedTotal}\n\nCheck out the full calculation here:`;
      default:
        return `Simple Interest Calculation:\nPrincipal: ${formattedPrincipal}\nInterest: ${formattedInterest}\nTotal: ${formattedTotal}`;
    }
  }, [result, solveTarget, formatMoney]);

  // Natural language description for the result box
  const resultNarrative = useMemo(() => {
    if (!result) return '';
    const formattedPrincipal = formatMoney(result.principal);
    const formattedInterest = formatMoney(result.simpleInterest);
    const formattedTotal = formatMoney(result.totalAmount);
    const formattedRate = `${result.ratePercentage}%`;
    const formattedDuration = result.timeDisplay;

    switch (solveTarget) {
      case 'interest':
        return `An investment or loan of ${formattedPrincipal} at an annual flat rate of ${formattedRate} for a period of ${formattedDuration} will generate ${formattedInterest} in total simple interest, accumulating to a final total of ${formattedTotal}.`;
      case 'principal':
        return `To achieve a total simple interest of ${formattedInterest} at a rate of ${formattedRate} per year over a period of ${formattedDuration}, you would need a starting principal of ${formattedPrincipal}. The total accumulated balance will be ${formattedTotal}.`;
      case 'rate':
        return `To generate ${formattedInterest} in interest on a starting principal of ${formattedPrincipal} over a period of ${formattedDuration}, you require a flat interest rate of ${formattedRate} per year. The final total value will be ${formattedTotal}.`;
      case 'time':
        return `With an initial principal of ${formattedPrincipal} and a flat interest rate of ${formattedRate} p.a., it will take exactly ${formattedDuration} to accumulate a total simple interest of ${formattedInterest}. The final total value will be ${formattedTotal}.`;
      default:
        return '';
    }
  }, [result, solveTarget, formatMoney]);

  return (
    <div className="space-y-8">
      {/* Shared calculation banner */}
      {isSharedState && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Values loaded from a shared calculation link. You can modify any field freely.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsSharedState(false)}
            className="text-blue-600 hover:text-blue-900 font-bold ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Remember my values & reset controls */}
      <SavedValuesControls
        toolSlug="simple-interest-calculator"
        currentValues={{ solveTarget, principal, rate, time, interest, timeUnit }}
        onRestore={handleRestoreSaved}
        onReset={handleReset}
      />

      {/* Multi-Direction Solving Variable Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Solve For Unknown Variable:
          </span>
          <span className="text-[11px] text-slate-400">
            Select which variable you want the calculator to solve
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {[
            { id: 'interest', label: 'Simple Interest (SI)' },
            { id: 'principal', label: 'Principal (P)' },
            { id: 'rate', label: 'Interest Rate (R)' },
            { id: 'time', label: 'Duration (T)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`tab-solve-${tab.id}`}
              onClick={() => {
                setSolveTarget(tab.id as SimpleInterestTarget);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                solveTarget === tab.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Input Parameters</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                Solving for {solveTarget.toUpperCase()}
              </span>
              <button
                type="button"
                id="btn-reset-si"
                onClick={handleReset}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors ml-1 cursor-pointer"
                title="Reset fields"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Principal (Shown if NOT solving for Principal) */}
          {solveTarget !== 'principal' && (
            <CurrencyInput
              id="si-principal"
              label="Principal Amount"
              value={principal}
              onChange={(val) => setPrincipal(val)}
              min={0}
              placeholder="e.g. 100,000"
              helpText="Initial sum of money deposited or borrowed"
              required
            />
          )}

          {/* Interest Rate (Shown if NOT solving for Rate) */}
          {solveTarget !== 'rate' && (
            <UnitNumberInput
              id="si-rate"
              label="Annual Interest Rate (%)"
              value={rate}
              onChange={(val) => setRate(val)}
              min={0}
              max={100}
              step={0.01}
              suffix="%"
              placeholder="Enter annual interest rate"
              helpText="Annual simple interest percentage rate"
              required
            />
          )}

          {/* Duration (Shown if NOT solving for Duration) */}
          {solveTarget !== 'time' && (
            <TermInput
              id="si-term"
              label="Duration"
              years={timeYears}
              months={timeMonths}
              days={timeDays}
              onChangeYears={(v) => setTimeYears(v)}
              onChangeMonths={(v) => setTimeMonths(v)}
              onChangeDays={(v) => setTimeDays(v)}
              helpText="Length of time for interest accrual in years, months, and days"
              required
            />
          )}

          {/* Target Interest (Shown when solving for Principal, Rate, or Time) */}
          {solveTarget !== 'interest' && (
            <CurrencyInput
              id="si-target-interest"
              label="Total Simple Interest"
              value={interest}
              onChange={(val) => setInterest(val)}
              min={0}
              placeholder="e.g. 1,500"
              helpText="The total interest earned or charged"
              required
            />
          )}

          {/* If solving for Time, let user select output time unit */}
          {solveTarget === 'time' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Preferred Output Duration Unit</label>
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value as TimeUnit)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
                <option value="days">Days</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Output Card */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs min-h-[380px] flex flex-col justify-center">
            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Calculation Results
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySummary}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      title="Copy result summary"
                    >
                      {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[11px]">{copiedSummary ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShareModalOpen(true)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 text-xs flex items-center gap-1 font-medium transition-colors cursor-pointer"
                      title="Share calculation link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Share</span>
                    </button>
                  </div>
                </div>

                {/* Highly user-friendly Display Panel */}
                <div className="bg-linear-to-b from-blue-50/70 to-indigo-50/40 border border-blue-100/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {solveTarget === 'interest' && 'Estimated Interest Earned'}
                      {solveTarget === 'principal' && 'Required Principal Amount'}
                      {solveTarget === 'rate' && 'Required Interest Rate'}
                      {solveTarget === 'time' && 'Required Duration'}
                    </span>
                  </div>

                  <div className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight leading-none">
                    {solveTarget === 'interest' && formatMoney(result.simpleInterest)}
                    {solveTarget === 'principal' && formatMoney(result.principal)}
                    {solveTarget === 'rate' && `${result.ratePercentage}%`}
                    {solveTarget === 'time' && result.timeDisplay}
                  </div>

                  <div className="pt-3.5 border-t border-blue-200/50 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-slate-500">
                      Total Maturity Amount (P + SI)
                    </span>
                    <span className="font-extrabold text-slate-800 text-base sm:text-lg">
                      {formatMoney(result.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Friendly narrative explanation */}
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">Summary Explanation:</span>
                  {resultNarrative}
                </div>

                {/* Dashboard Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 block">Principal</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                      {formatMoney(result.principal)}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 block">Annual Rate</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block">
                      {result.ratePercentage}%
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-400 block">Duration</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-800 mt-1 block leading-tight">
                      {result.timeDisplay}
                    </span>
                  </div>
                </div>


                {/* Donut Chart */}
                <div className="pt-4 border-t border-slate-100 flex flex-col items-center">
                  <DonutChart
                    segments={chartSegments}
                    centerLabel="Total Value"
                    centerValue={formatMoney(result.totalAmount)}
                    size={190}
                    strokeWidth={22}
                  />
                  <div className="flex items-center justify-center gap-6 mt-4 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                      <span>Principal: {formatMoney(result.principal)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span>Interest: {formatMoney(result.simpleInterest)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100/60">
                  <Calendar className="w-8 h-8 opacity-80" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">Your Result</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Select your unknown variable and enter known values to solve deterministically.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>No default values inserted • Multi-direction mathematical precision</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Periodic Timeline Schedule if calculated */}
      {result && result.periodBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Accrual Timeline Table
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Progression of interest earned and accumulated balance over time
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3">Timeline</th>
                  <th className="py-2.5 px-3 text-right">Periodic Interest</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Interest</th>
                  <th className="py-2.5 px-3 text-right">Total Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.periodBreakdown.map((row) => (
                  <tr key={row.period} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{row.label}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                      {formatMoney(row.interestEarned)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-bold">
                      {formatMoney(row.cumulativeInterest)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                      {formatMoney(row.totalBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full 16-Point Knowledge, Methodology, and FAQ section */}
      <KnowledgeSection
        tool={toolMeta}
        relatedTools={relatedTools}
        onNavigateToTool={onSelectTool}
        onOpenShare={() => setShareModalOpen(true)}
        onOpenEmbed={() => setEmbedModalOpen(true)}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Simple Interest Calculator"
        toolName="Simple Interest Calculator"
        toolSlug="simple-interest-calculator"
        categorySlug="finance"
        description={shareTextSummary}
        url={shareUrl}
        calculationData={calculationShareData}
      />

      {/* Embed Modal */}
      <EmbedModal
        isOpen={embedModalOpen}
        onClose={() => setEmbedModalOpen(false)}
        toolSlug="simple-interest-calculator"
        toolName="Simple Interest Calculator"
      />
    </div>
  );
};
