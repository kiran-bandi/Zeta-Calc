import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { calculateWealthGoal } from '../../engine/wealthGoalEngine';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, Crown, Target, Sparkles, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const MillionaireCalculatorView: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  const [calcMode, setCalcMode] = useSessionState<'time_to_goal' | 'required_contribution' | 'future_wealth'>(
    'mil_calc_mode',
    'time_to_goal'
  );

  const [targetWealth, setTargetWealth] = useSessionState<number | ''>('mil_target_wealth', 1000000);
  const [currentSavings, setCurrentSavings] = useSessionState<number | ''>('mil_curr_savings', 25000);
  const [monthlyContribution, setMonthlyContribution] = useSessionState<number | ''>('mil_monthly_contrib', 1500);
  const [expectedReturn, setExpectedReturn] = useSessionState<number | ''>('mil_exp_return', 8);
  const [stepUpPercent, setStepUpPercent] = useSessionState<number | ''>('mil_step_up', 3);
  const [inflationRate, setInflationRate] = useSessionState<number | ''>('mil_inflation', 2.5);
  const [targetYears, setTargetYears] = useSessionState<number | ''>('mil_target_years', 20);

  const resetAll = () => {
    setTargetWealth('');
    setCurrentSavings('');
    setMonthlyContribution('');
    setExpectedReturn('');
    setStepUpPercent(0);
    setInflationRate(2.5);
    setTargetYears(20);
  };

  const result = React.useMemo(() => {
    if (typeof expectedReturn !== 'number' || expectedReturn < 0) {
      return null;
    }

    const startVal = typeof currentSavings === 'number' ? currentSavings : 0;
    const targetVal = typeof targetWealth === 'number' ? targetWealth : 1000000;
    const monthlyVal = typeof monthlyContribution === 'number' ? monthlyContribution : 0;
    const yearsVal = typeof targetYears === 'number' && targetYears > 0 ? targetYears : 20;

    if (calcMode === 'time_to_goal') {
      if (typeof targetWealth !== 'number' || targetWealth <= 0) return null;
      if (startVal === 0 && monthlyVal === 0) return null;

      return calculateWealthGoal({
        mode: 'time_to_goal',
        targetWealth: targetVal,
        currentSavings: startVal,
        monthlyContribution: monthlyVal,
        annualReturn: expectedReturn,
        annualContributionGrowth: typeof stepUpPercent === 'number' ? stepUpPercent : 0,
        inflationRate: typeof inflationRate === 'number' ? inflationRate : 0,
        contributionTiming: 'end_of_month',
      });
    }

    if (calcMode === 'required_contribution') {
      if (typeof targetWealth !== 'number' || targetWealth <= 0) return null;

      return calculateWealthGoal({
        mode: 'required_contribution',
        targetWealth: targetVal,
        currentSavings: startVal,
        monthlyContribution: 0,
        timeHorizonYears: yearsVal,
        annualReturn: expectedReturn,
        annualContributionGrowth: typeof stepUpPercent === 'number' ? stepUpPercent : 0,
        inflationRate: typeof inflationRate === 'number' ? inflationRate : 0,
        contributionTiming: 'end_of_month',
      });
    }

    if (calcMode === 'future_wealth') {
      return calculateWealthGoal({
        mode: 'future_wealth',
        targetWealth: targetVal,
        currentSavings: startVal,
        monthlyContribution: monthlyVal,
        timeHorizonYears: yearsVal,
        annualReturn: expectedReturn,
        annualContributionGrowth: typeof stepUpPercent === 'number' ? stepUpPercent : 0,
        inflationRate: typeof inflationRate === 'number' ? inflationRate : 0,
        contributionTiming: 'end_of_month',
      });
    }

    return null;
  }, [
    calcMode,
    targetWealth,
    currentSavings,
    monthlyContribution,
    expectedReturn,
    stepUpPercent,
    inflationRate,
    targetYears,
  ]);

  const donutData = React.useMemo(() => {
    if (!result) return [];
    return [
      {
        name: 'Principal Invested',
        value: Math.max(0, result.totalContributions),
        color: '#2563eb', // blue-600
      },
      {
        name: 'Compounding Growth',
        value: Math.max(0, result.investmentGrowth),
        color: '#10b981', // emerald-500
      },
    ];
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input Parameters */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Wealth & Milestone Configuration
            </h2>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-semibold text-slate-600 hover:text-amber-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          {/* Mode Selector Tabs */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Calculation Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setCalcMode('time_to_goal')}
                className={`py-2 px-2 rounded-lg transition text-center ${
                  calcMode === 'time_to_goal'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Time to $1M
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('required_contribution')}
                className={`py-2 px-2 rounded-lg transition text-center ${
                  calcMode === 'required_contribution'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Required SIP
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('future_wealth')}
                className={`py-2 px-2 rounded-lg transition text-center ${
                  calcMode === 'future_wealth'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                Future Wealth
              </button>
            </div>
          </div>

          {/* Target Wealth Input (for time_to_goal and required_contribution) */}
          {calcMode !== 'future_wealth' && (
            <div>
              <NumberSliderInput
                label="Target Portfolio Goal"
                value={targetWealth}
                onChange={setTargetWealth}
                min={100000}
                max={50000000}
                step={50000}
                unitPrefix={currencySymbol}
                helperText="Milestone portfolio amount to achieve"
                required
              />
              <div className="flex gap-2 mt-2">
                {[500000, 1000000, 2000000, 5000000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTargetWealth(preset)}
                    className="text-[11px] font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition"
                  >
                    {formatMoney(preset)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Years Input (for required_contribution and future_wealth) */}
          {calcMode !== 'time_to_goal' && (
            <NumberSliderInput
              label="Investment Time Horizon"
              value={targetYears}
              onChange={setTargetYears}
              min={1}
              max={50}
              step={1}
              unitSuffix="Years"
              helperText="Years until target milestone date"
              required
            />
          )}

          <NumberSliderInput
            label="Current Savings / Portfolio Balance"
            value={currentSavings}
            onChange={setCurrentSavings}
            min={0}
            max={10000000}
            step={5000}
            unitPrefix={currencySymbol}
            helperText="Starting investment assets"
          />

          {/* Monthly Contribution Input (for time_to_goal and future_wealth) */}
          {calcMode !== 'required_contribution' && (
            <NumberSliderInput
              label="Regular Monthly Investment"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              min={0}
              max={500000}
              step={500}
              unitPrefix={currencySymbol}
              helperText="Monthly SIP or savings deposit"
              required
            />
          )}

          <NumberSliderInput
            label="Expected Annual Market Return (%)"
            value={expectedReturn}
            onChange={setExpectedReturn}
            min={1}
            max={25}
            step={0.5}
            unitSuffix="%"
            helperText="Historic index funds average 8-12% annually"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              label="Annual Contribution Step-Up (%)"
              value={stepUpPercent}
              onChange={setStepUpPercent}
              min={0}
              max={20}
              step={1}
              unitSuffix="%"
              helperText="Annual % raise in contributions"
            />
            <NumberSliderInput
              label="Expected Inflation Rate (%)"
              value={inflationRate}
              onChange={setInflationRate}
              min={0}
              max={12}
              step={0.5}
              unitSuffix="%"
              helperText="Purchasing power adjustment"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Results & Milestone Table */}
      <div className="lg:col-span-6 space-y-6">
        {result ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Hero Milestone Badge */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider mb-1">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>Roadmap to Financial Independence</span>
              </div>

              {calcMode === 'time_to_goal' && (
                <div>
                  {result.status === 'already_reached' ? (
                    <div className="text-2xl font-black text-emerald-700 mt-1 flex items-center gap-2">
                      <CheckCircle2 className="w-7 h-7" />
                      Goal Already Achieved!
                    </div>
                  ) : result.status === 'unreachable' ? (
                    <div className="text-xl font-bold text-rose-700 mt-1 flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6" />
                      Goal Unreachable with current inputs
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-black text-slate-900 mt-1">
                        {result.yearsToGoal} Years, {result.remainingMonths} Months
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        With disciplined compounding, you reach{' '}
                        <strong>{formatMoney(typeof targetWealth === 'number' ? targetWealth : 1000000)}</strong> in approx{' '}
                        <strong>{result.monthsToGoal} total months</strong>.
                      </p>
                    </>
                  )}
                </div>
              )}

              {calcMode === 'required_contribution' && (
                <div>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {formatMoney(result.monthlyContribution)}/month
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Monthly investment required to build{' '}
                    <strong>{formatMoney(typeof targetWealth === 'number' ? targetWealth : 1000000)}</strong> in{' '}
                    <strong>{targetYears} years</strong>.
                  </p>
                </div>
              )}

              {calcMode === 'future_wealth' && (
                <div>
                  <div className="text-3xl font-black text-slate-900 mt-1">
                    {formatMoney(result.projectedWealth)}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Total wealth accumulated in <strong>{targetYears} years</strong> from starting savings and regular deposits.
                  </p>
                </div>
              )}
            </div>

            {/* Metric Overview Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Total Cash Contributed</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(result.totalContributions)}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {((result.totalContributions / Math.max(1, result.projectedWealth)) * 100).toFixed(1)}% of final wealth
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Compounding Growth</div>
                <div className="text-2xl font-bold text-emerald-600 mt-1">{formatMoney(result.investmentGrowth)}</div>
                <div className="text-xs text-emerald-700 mt-1 font-medium">
                  {result.growthPercentage.toFixed(1)}% generated purely by returns
                </div>
              </div>
            </div>

            {/* Inflation Adjusted Purchasing Power Card */}
            {typeof inflationRate === 'number' && inflationRate > 0 && typeof result.realPurchasingPowerAtGoal === 'number' && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider block">
                    Inflation-Adjusted Purchasing Power
                  </span>
                  <span className="text-lg font-bold text-blue-950 mt-0.5 block">
                    {formatMoney(result.realPurchasingPowerAtGoal)}
                  </span>
                  <span className="text-xs text-blue-700">
                    What this future portfolio is worth in today's money at {inflationRate}% inflation
                  </span>
                </div>
                <Sparkles className="w-8 h-8 text-blue-400 shrink-0" />
              </div>
            )}

            {/* Visual Breakdown Donut Chart */}
            <div className="p-4 bg-white rounded-xl border border-slate-200">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Portfolio Growth Breakdown</h3>
              <DonutChart
                data={donutData}
                centerLabel={formatMoney(result.projectedWealth)}
                subLabel="Total Target Portfolio"
              />
            </div>

            {/* Year-by-Year Milestone Table */}
            {result.timeline && result.timeline.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-900">Milestone Roadmap</h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-72 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Year</th>
                        <th className="py-2.5 px-3">Annual Contrib.</th>
                        <th className="py-2.5 px-3 text-emerald-700">Growth</th>
                        <th className="py-2.5 px-3 font-bold text-slate-900">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {result.timeline.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-medium text-slate-900">Year {row.year}</td>
                          <td className="py-2 px-3 text-slate-600">{formatMoney(row.annualContributions)}</td>
                          <td className="py-2 px-3 font-medium text-emerald-600">{formatMoney(row.investmentGrowth)}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{formatMoney(row.endingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <Target className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Configure your target portfolio and investment contributions</p>
            <p className="text-xs text-slate-500 mt-1">
              Strict empty inputs rule: enter expected return and contribution to view roadmap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
