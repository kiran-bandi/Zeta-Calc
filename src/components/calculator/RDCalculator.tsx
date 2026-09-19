import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { calculateRD } from '../../engine/financial';
import { CurrencyInput } from '../common/CurrencyInput';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, Share2, Scale, ArrowRight, Table, Coins, Landmark } from 'lucide-react';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';

interface RDCalculatorProps {
  onSelectTool?: (slug: string) => void;
}

export const RDCalculator: React.FC<RDCalculatorProps> = ({ onSelectTool }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // All numeric inputs start EMPTY
  const [monthlyDeposit, setMonthlyDeposit] = useSessionState<number | ''>('rd_monthly_deposit', '');
  const [interestRate, setInterestRate] = useSessionState<number | ''>('rd_interest_rate', '');
  const [tenureYears, setTenureYears] = useSessionState<number | ''>('rd_tenure_yrs', '');
  const [tenureMonths, setTenureMonths] = useSessionState<number | ''>('rd_tenure_mos', '');
  const [compoundFreq, setCompoundFreq] = useSessionState<number>('rd_compound_freq', 4); // 4 = Quarterly
  const [isShareOpen, setIsShareOpen] = React.useState(false);

  // URL query hydration
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const qIdx = hash.indexOf('?');
    if (qIdx === -1) return;
    const params = new URLSearchParams(hash.substring(qIdx + 1));
    const dep = params.get('deposit') || params.get('m') || params.get('monthly');
    const r = params.get('rate') || params.get('r');
    const m = params.get('months');
    const y = params.get('years') || params.get('y');
    const f = params.get('freq');

    if (dep && !isNaN(Number(dep))) setMonthlyDeposit(Number(dep));
    if (r && !isNaN(Number(r))) setInterestRate(Number(r));
    if (m && !isNaN(Number(m))) {
      const totM = Number(m);
      setTenureYears(Math.floor(totM / 12));
      setTenureMonths(totM % 12);
    } else if (y && !isNaN(Number(y))) {
      setTenureYears(Number(y));
      setTenureMonths(0);
    }
    if (f && !isNaN(Number(f))) setCompoundFreq(Number(f));
  }, []);

  const resetAll = () => {
    setMonthlyDeposit('');
    setInterestRate('');
    setTenureYears('');
    setTenureMonths('');
    setCompoundFreq(4);
  };

  const totalMonths = useMemo(() => {
    const yrs = typeof tenureYears === 'number' ? tenureYears : 0;
    const mos = typeof tenureMonths === 'number' ? tenureMonths : 0;
    return yrs * 12 + mos;
  }, [tenureYears, tenureMonths]);

  const result = useMemo(() => {
    if (
      typeof monthlyDeposit !== 'number' ||
      monthlyDeposit <= 0 ||
      typeof interestRate !== 'number' ||
      interestRate <= 0 ||
      totalMonths <= 0
    ) {
      return null;
    }

    return calculateRD({
      monthlyDeposit,
      annualRate: interestRate,
      totalMonths,
      compoundingFrequency: compoundFreq,
    });
  }, [monthlyDeposit, interestRate, totalMonths, compoundFreq]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result || typeof monthlyDeposit !== 'number' || typeof interestRate !== 'number') return null;
    const freqName = compoundFreq === 1 ? 'Annually' : compoundFreq === 2 ? 'Semi-Annually' : compoundFreq === 4 ? 'Quarterly' : 'Monthly';
    return {
      toolSlug: 'rd-calculator',
      toolName: 'Recurring Deposit (RD) Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Monthly Deposit', value: `${formatMoney(monthlyDeposit)} / month` },
        { label: 'Annual Interest Rate', value: `${interestRate}% p.a.` },
        { label: 'Tenure', value: `${totalMonths} Months` },
        { label: 'Compounding', value: freqName },
      ],
      outputs: [
        { label: 'Total Maturity Value', value: formatMoney(result.maturityAmount), isHighlight: true },
        { label: 'Total Amount Deposited', value: formatMoney(result.totalInvested) },
        { label: 'Total Interest Earned', value: formatMoney(result.totalInterest) },
      ],
      customUrlParams: {
        deposit: monthlyDeposit,
        rate: interestRate,
        months: totalMonths,
        freq: compoundFreq,
      },
    };
  }, [result, monthlyDeposit, interestRate, totalMonths, compoundFreq, formatMoney]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Parameters */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">RD Installment Parameters</h2>
            </div>
            <button
              type="button"
              id="rd-reset-btn"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors cursor-pointer"
              title="Reset fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* Monthly Deposit */}
            <div>
              <CurrencyInput
                id="rd-monthly-deposit"
                label="Monthly Recurring Deposit Amount"
                value={monthlyDeposit}
                onChange={setMonthlyDeposit}
                min={500}
                max={500000}
                step={500}
                placeholder="e.g. 5000"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[
                  { label: `${currencySymbol}1,000`, val: 1000 },
                  { label: `${currencySymbol}2,500`, val: 2500 },
                  { label: `${currencySymbol}5,000`, val: 5000 },
                  { label: `${currencySymbol}10,000`, val: 10000 },
                  { label: `${currencySymbol}25,000`, val: 25000 },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => setMonthlyDeposit(chip.val)}
                    className="px-2 py-0.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors cursor-pointer border border-slate-200"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate */}
            <NumberSliderInput
              id="rd-interest-rate"
              label="Annual Interest Rate (% p.a.)"
              value={interestRate}
              onChange={setInterestRate}
              min={1}
              max={20}
              step={0.1}
              placeholder="e.g. 7.0"
              suffix="%"
            />

            {/* Tenure Duration Input (Years & Months) */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-2">
                Deposit Duration / Tenure
              </label>
              <div className="grid grid-cols-2 gap-3">
                <UnitNumberInput
                  id="rd-tenure-years"
                  label="Years"
                  value={tenureYears}
                  onChange={setTenureYears}
                  placeholder="e.g. 3"
                  min={0}
                  max={30}
                  suffix="Yr"
                />
                <UnitNumberInput
                  id="rd-tenure-months"
                  label="Months"
                  value={tenureMonths}
                  onChange={setTenureMonths}
                  placeholder="e.g. 0"
                  min={0}
                  max={11}
                  suffix="Mo"
                />
              </div>
              {totalMonths > 0 && (
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">
                  Total Tenure: {Math.floor(totalMonths / 12)} years {totalMonths % 12} months ({totalMonths} monthly installments)
                </p>
              )}
            </div>

            {/* Compounding Frequency Selection */}
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-2">
                Compounding Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { label: 'Quarterly (Std)', val: 4 },
                  { label: 'Monthly', val: 12 },
                  { label: 'Half-Yearly', val: 2 },
                  { label: 'Annually', val: 1 },
                ].map((f) => (
                  <button
                    key={f.val}
                    type="button"
                    id={`rd-freq-${f.val}`}
                    onClick={() => setCompoundFreq(f.val)}
                    className={`py-2 px-2.5 rounded-xl border font-semibold transition-all cursor-pointer ${
                      compoundFreq === f.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-6">
            <span className="text-xs text-slate-500">Standard Bank RD Compounding Math</span>
            <button
              type="button"
              id="rd-bottom-reset-btn"
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 bg-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Right Output & Analytics Section */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                RD Maturity Summary
              </span>
              <button
                type="button"
                id="rd-share-btn"
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Share Output</span>
              </button>
            </div>

            {result ? (
              <div className="space-y-6">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Estimated Maturity Value</div>
                  <div className="text-3xl sm:text-4xl font-black text-blue-400 mt-1 tracking-tight">
                    {formatMoney(result.maturityAmount)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                    <div className="text-[11px] text-slate-400 font-semibold uppercase">Total Amount Deposited</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {formatMoney(result.totalDeposits)}
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
                    <div className="text-[11px] text-blue-400 font-semibold uppercase">Total Interest Earned</div>
                    <div className="text-lg font-bold text-blue-300 mt-0.5">
                      +{formatMoney(result.totalInterest)}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-950/40 p-3.5 rounded-xl border border-blue-800/60 flex items-center justify-between">
                  <span className="text-xs text-blue-200 font-semibold">Effective Annual Yield</span>
                  <span className="text-base font-bold text-blue-300">{result.effectiveAnnualReturn}% p.a.</span>
                </div>

                {/* Donut Chart Visualizing Cumulative Deposits vs Interest */}
                <div className="pt-2">
                  <DonutChart
                    segments={[
                      { label: 'Total Deposited', value: result.totalDeposits, color: '#3B82F6', formattedValue: formatMoney(result.totalDeposits) },
                      { label: 'Interest Earned', value: result.totalInterest, color: '#10B981', formattedValue: formatMoney(result.totalInterest) },
                    ]}
                    centerTitle="Total Maturity"
                    centerSubtitle={formatMoney(result.maturityAmount)}
                  />
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400">
                <p className="font-semibold text-base text-slate-300">Enter monthly deposit details to view estimation</p>
                <p className="text-xs mt-1 text-slate-500">
                  Fill in your monthly deposit, interest rate, and tenure above.
                </p>
              </div>
            )}
          </div>

          {/* Monthly Schedule Breakdown */}
          {result && result.schedule.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-4">
                <Table className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Monthly Accumulation Breakdown</h3>
              </div>
              <div className="overflow-x-auto max-h-80 overflow-y-auto scrollbar-thin">
                <table className="w-full text-xs text-left">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-700 font-bold z-10">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Cumulative Deposits</th>
                      <th className="py-2.5 px-3">Cumulative Interest</th>
                      <th className="py-2.5 px-3 text-right">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {result.schedule.map((row) => (
                      <tr key={row.month} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">Month {row.month}</td>
                        <td className="py-2.5 px-3">{formatMoney(row.cumulativeDeposits)}</td>
                        <td className="py-2.5 px-3 text-blue-600 font-semibold">+{formatMoney(row.cumulativeInterest)}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatMoney(row.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Related Tools Links */}
          {onSelectTool && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Compare RD Strategy
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  id="link-fd-calculator"
                  onClick={() => onSelectTool('fd-calculator')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-800 font-semibold transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span>Fixed Deposit (FD)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  type="button"
                  id="link-sip-calculator"
                  onClick={() => onSelectTool('sip-calculator')}
                  className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-800 font-semibold transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-600" />
                    <span>SIP Calculator</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Recurring Deposit (RD) Calculator"
        toolName="Recurring Deposit (RD) Calculator"
        toolSlug="rd-calculator"
        categorySlug="finance"
        description="Calculate Recurring Deposit maturity value on Zeta Calculator"
        calculationData={calculationShareData}
      />
    </div>
  );
};
