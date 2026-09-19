import React, { useState, useMemo } from 'react';
import { calculateYearlySIP } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, AlertCircle, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface YearlySIPCalculatorProps {
  onSelectTool?: (slug: string) => void;
}

export const YearlySIPCalculator: React.FC<YearlySIPCalculatorProps> = ({ onSelectTool }) => {
  const { formatMoney, currencySymbol, preferences } = useSettings();

  const [initialInvestment, setInitialInvestment] = useState<number | ''>('');
  const [yearlyInvestment, setYearlyInvestment] = useState<number | ''>('');
  const [returnRate, setReturnRate] = useState<number | ''>('');
  const [durationYears, setDurationYears] = useState<number | ''>('');
  const [durationUnit, setDurationUnit] = useState<'years' | 'months'>('years');
  const [stepUpPercentage, setStepUpPercentage] = useState<number | ''>('');
  const [showAllYears, setShowAllYears] = useState<boolean>(false);

  const result = useMemo(() => {
    if (typeof yearlyInvestment !== 'number' || yearlyInvestment <= 0) return null;
    const rawDur = typeof durationYears === 'number' && durationYears > 0 ? durationYears : 10;
    const effectiveYears = durationUnit === 'months' ? rawDur / 12 : rawDur;

    return calculateYearlySIP({
      initialInvestment: typeof initialInvestment === 'number' ? initialInvestment : 0,
      yearlyInvestment,
      expectedReturnRate: typeof returnRate === 'number' && returnRate > 0 ? returnRate : 12,
      timePeriodYears: effectiveYears,
      stepUpPercentage: typeof stepUpPercentage === 'number' ? stepUpPercentage : 0,
    });
  }, [initialInvestment, yearlyInvestment, returnRate, durationYears, durationUnit, stepUpPercentage]);

  const handleReset = () => {
    setInitialInvestment('');
    setYearlyInvestment('');
    setReturnRate('');
    setDurationYears('');
    setDurationUnit('years');
    setStepUpPercentage('');
  };

  const chartSegments = useMemo(() => {
    if (!result) return [];
    return [
      { label: 'Total Invested', value: result.totalInvested, color: '#3b82f6' },
      { label: 'Estimated Returns', value: result.estimatedReturns, color: '#10b981' },
    ];
  }, [result]);

  const displayedBreakdown = result
    ? showAllYears
      ? result.yearlyBreakdown
      : result.yearlyBreakdown.slice(0, 10)
    : [];

  return (
    <div className="space-y-8">
      {/* Mode Switcher: Monthly SIP vs Yearly SIP */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100 rounded-xl max-w-md border border-slate-200">
        <button
          type="button"
          id="btn-switch-monthly-sip"
          onClick={() => onSelectTool && onSelectTool('sip-calculator')}
          className="flex-1 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-all text-center"
        >
          Monthly SIP
        </button>
        <button
          type="button"
          id="btn-switch-yearly-sip"
          className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-xs text-center"
        >
          Yearly SIP (Annual)
        </button>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Yearly SIP Inputs</span>
            </h2>
            <button
              type="button"
              id="btn-reset-yearly-sip"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Initial Deposit (Optional) */}
          <CurrencyInput
            id="yearly-sip-initial"
            label="Initial Lump Sum Deposit (Optional)"
            value={initialInvestment}
            onChange={setInitialInvestment}
            min={0}
            max={100000000}
            step={preferences.currency === 'INR' ? 10000 : 500}
            helpText="Starting capital deposited before recurring yearly contributions"
          />

          {/* Yearly Investment Amount */}
          <CurrencyInput
            id="yearly-sip-amount"
            label="Yearly Investment Amount"
            value={yearlyInvestment}
            onChange={setYearlyInvestment}
            min={500}
            max={100000000}
            step={preferences.currency === 'INR' ? 10000 : 500}
            helpText="Amount deposited once every calendar year"
          />

          {/* Expected Return Rate */}
          <UnitNumberInput
            id="yearly-sip-rate"
            label="Expected Annual Return (%)"
            value={returnRate}
            onChange={setReturnRate}
            min={1}
            max={35}
            step={0.5}
            suffix="%"
            helpText="Historical broad mutual fund CAGR is typically 10% - 15%"
          />

          {/* Duration */}
          <UnitNumberInput
            id="yearly-sip-duration"
            label="Investment Duration"
            value={durationYears}
            onChange={setDurationYears}
            min={1}
            max={600}
            step={1}
            units={[
              { id: 'years', label: 'Years', symbol: 'Years' },
              { id: 'months', label: 'Months', symbol: 'Months' },
            ]}
            currentUnit={durationUnit}
            onUnitChange={(u) => setDurationUnit(u as 'years' | 'months')}
            helpText="Number of years or months you plan to keep investing"
          />

          {/* Step-up percentage */}
          <UnitNumberInput
            id="yearly-sip-stepup"
            label="Annual Step-Up Increment (%)"
            value={stepUpPercentage}
            onChange={setStepUpPercentage}
            min={0}
            max={50}
            step={1}
            suffix="%"
            helpText="Increase your yearly contribution by this % each year (e.g., 5% or 10%)"
          />
        </div>

        {/* Right Output Summary Card */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Dark Navy Result Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Expected Maturity Value
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(result.finalMaturityValue)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Invested</span>
                    <span className="font-bold text-base text-white">{formatMoney(result.totalInvested)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Estimated Returns</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(result.estimatedReturns)}</span>
                  </div>
                </div>
              </div>

              {/* Wealth Breakdown Donut Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="MATURITY"
                  centerSubtitle={formatMoney(result.finalMaturityValue)}
                  segments={[
                    {
                      label: 'Total Invested',
                      value: result.totalInvested,
                      color: '#2563eb',
                      formattedValue: formatMoney(result.totalInvested),
                    },
                    {
                      label: 'Estimated Returns',
                      value: result.estimatedReturns,
                      color: '#10b981',
                      formattedValue: formatMoney(result.estimatedReturns),
                    },
                  ]}
                />
              </div>

              {/* Mandatory Disclaimer */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Disclaimer:</strong> This is an estimate and actual investment returns can vary based on market fluctuations, asset allocation, and macroeconomic cycles.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-xs">
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-800">Enter your yearly investment amount</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Discover your estimated compounding growth, maturity value, and year-by-year schedule.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Year-by-Year Growth Table */}
      {result && result.yearlyBreakdown.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Year-by-Year Investment Schedule
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Annual deposits, compound interest earned, and closing portfolio balance
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/50">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3 text-right">Annual Deposit</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Invested</th>
                  <th className="py-2.5 px-3 text-right">Annual Interest Gain</th>
                  <th className="py-2.5 px-3 text-right">Portfolio Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                      {formatMoney(row.yearlyDeposit)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-blue-600 font-medium">
                      {formatMoney(row.cumulativeInvested)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-600 font-semibold">
                      +{formatMoney(row.interestEarnedThisYear)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900 font-bold">
                      {formatMoney(row.endingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.yearlyBreakdown.length > 10 && (
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                id="btn-toggle-years"
                onClick={() => setShowAllYears(!showAllYears)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 rounded-lg transition-colors"
              >
                <span>{showAllYears ? 'Show First 10 Years' : `View All ${result.yearlyBreakdown.length} Years`}</span>
                {showAllYears ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
