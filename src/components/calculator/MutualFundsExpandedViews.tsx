import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateCAGR,
  calculateAbsoluteReturn,
  calculateStepUpSIP,
  calculateLumpsum,
  calculateSWP,
  calculateSTP,
  calculateGoalBasedSIP,
  calculateSIPCostOfDelay,
  calculateSIPInflation,
  calculateExpenseRatioImpact,
  calculateSIPVsLumpsum,
  calculateXIRR,
  CashFlowItem,
} from '../../engine/mutualFunds';
import { calculateSIP } from '../../engine/financial';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, TrendingUp, Calendar, Plus, Trash2, ArrowRight } from 'lucide-react';
import { MutualFundCalculatorView } from './MutualFundCalculatorView';

interface MutualFundsExpandedViewsProps {
  toolSlug: string;
}

export const MutualFundsExpandedViews: React.FC<MutualFundsExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // 1. CAGR CALCULATOR
  // ==========================================
  const [cagrInit, setCagrInit] = useSessionState<number | ''>('cagr_init', '');
  const [cagrFinal, setCagrFinal] = useSessionState<number | ''>('cagr_final', '');
  const [cagrYears, setCagrYears] = useSessionState<number | ''>('cagr_years', '');
  const [cagrStart, setCagrStart] = useSessionState<string>('cagr_start', '');
  const [cagrEnd, setCagrEnd] = useSessionState<string>('cagr_end', '');

  const resetCAGR = () => {
    setCagrInit('');
    setCagrFinal('');
    setCagrYears('');
    setCagrStart('');
    setCagrEnd('');
  };

  const cagrResult = useMemo(() => {
    if (typeof cagrInit !== 'number' || cagrInit <= 0 || typeof cagrFinal !== 'number' || cagrFinal <= 0) {
      return null;
    }
    if (!cagrYears && (!cagrStart || !cagrEnd)) return null;
    return calculateCAGR({
      initialInvestment: cagrInit,
      finalValue: cagrFinal,
      timePeriodYears: typeof cagrYears === 'number' ? cagrYears : undefined,
      startDate: cagrStart || undefined,
      endDate: cagrEnd || undefined,
    });
  }, [cagrInit, cagrFinal, cagrYears, cagrStart, cagrEnd]);

  // ==========================================
  // 2. ABSOLUTE RETURN CALCULATOR
  // ==========================================
  const [absInit, setAbsInit] = useSessionState<number | ''>('abs_init', '');
  const [absFinal, setAbsFinal] = useSessionState<number | ''>('abs_final', '');
  const [absMonths, setAbsMonths] = useSessionState<number | ''>('abs_months', '');

  const resetAbsoluteReturn = () => {
    setAbsInit('');
    setAbsFinal('');
    setAbsMonths('');
  };

  const absResult = useMemo(() => {
    if (typeof absInit !== 'number' || absInit <= 0 || typeof absFinal !== 'number' || absFinal <= 0) return null;
    return calculateAbsoluteReturn({
      initialInvestment: absInit,
      finalValue: absFinal,
      holdingPeriodMonths: typeof absMonths === 'number' ? absMonths : 12,
    });
  }, [absInit, absFinal, absMonths]);

  // ==========================================
  // 3. STEP-UP SIP CALCULATOR
  // ==========================================
  const [suInitSip, setSuInitSip] = useSessionState<number | ''>('su_init_sip', '');
  const [suRate, setSuRate] = useSessionState<number | ''>('su_rate', '');
  const [suYears, setSuYears] = useSessionState<number | ''>('su_years', '');
  const [suStepPct, setSuStepPct] = useSessionState<number | ''>('su_step_pct', '');

  const resetStepUpSIP = () => {
    setSuInitSip('');
    setSuRate('');
    setSuYears('');
    setSuStepPct('');
  };

  const stepUpResult = useMemo(() => {
    if (
      typeof suInitSip !== 'number' || suInitSip <= 0 ||
      typeof suRate !== 'number' || suRate <= 0 ||
      typeof suYears !== 'number' || suYears <= 0
    ) {
      return null;
    }
    return calculateStepUpSIP({
      initialMonthlyInvestment: suInitSip,
      expectedAnnualReturnRate: suRate,
      investmentPeriodYears: suYears,
      annualStepUpPercentage: typeof suStepPct === 'number' ? suStepPct : 10,
    });
  }, [suInitSip, suRate, suYears, suStepPct]);

  // ==========================================
  // 4. LUMPSUM MUTUAL FUND CALCULATOR
  // ==========================================
  const [lumpAmt, setLumpAmt] = useSessionState<number | ''>('lump_amt', '');
  const [lumpRate, setLumpRate] = useSessionState<number | ''>('lump_rate', '');
  const [lumpYears, setLumpYears] = useSessionState<number | ''>('lump_years', '');
  const [lumpInf, setLumpInf] = useSessionState<number | ''>('lump_inf', '');

  const resetLumpsum = () => {
    setLumpAmt('');
    setLumpRate('');
    setLumpYears('');
    setLumpInf('');
  };

  const lumpsumResult = useMemo(() => {
    if (
      typeof lumpAmt !== 'number' || lumpAmt <= 0 ||
      typeof lumpRate !== 'number' || lumpRate <= 0 ||
      typeof lumpYears !== 'number' || lumpYears <= 0
    ) {
      return null;
    }
    return calculateLumpsum({
      initialInvestment: lumpAmt,
      expectedAnnualReturnRate: lumpRate,
      investmentPeriodYears: lumpYears,
      inflationRate: typeof lumpInf === 'number' ? lumpInf : 0,
    });
  }, [lumpAmt, lumpRate, lumpYears, lumpInf]);

  // ==========================================
  // 5. SWP CALCULATOR
  // ==========================================
  const [swpCorpus, setSwpCorpus] = useSessionState<number | ''>('swp_corpus', '');
  const [swpMonthly, setSwpMonthly] = useSessionState<number | ''>('swp_monthly', '');
  const [swpRate, setSwpRate] = useSessionState<number | ''>('swp_rate', '');
  const [swpYears, setSwpYears] = useSessionState<number | ''>('swp_years', '');

  const resetSWP = () => {
    setSwpCorpus('');
    setSwpMonthly('');
    setSwpRate('');
    setSwpYears('');
  };

  const swpResult = useMemo(() => {
    if (
      typeof swpCorpus !== 'number' || swpCorpus <= 0 ||
      typeof swpMonthly !== 'number' || swpMonthly <= 0 ||
      typeof swpRate !== 'number' || swpRate <= 0 ||
      typeof swpYears !== 'number' || swpYears <= 0
    ) {
      return null;
    }
    return calculateSWP({
      initialCorpus: swpCorpus,
      monthlyWithdrawal: swpMonthly,
      expectedAnnualReturnRate: swpRate,
      timePeriodYears: swpYears,
    });
  }, [swpCorpus, swpMonthly, swpRate, swpYears]);

  // ==========================================
  // 6. STP CALCULATOR
  // ==========================================
  const [stpSourceCorpus, setStpSourceCorpus] = useSessionState<number | ''>('stp_source_corpus', '');
  const [stpTransferAmt, setStpTransferAmt] = useSessionState<number | ''>('stp_transfer_amt', '');
  const [stpSourceRate, setStpSourceRate] = useSessionState<number | ''>('stp_source_rate', '');
  const [stpTargetRate, setStpTargetRate] = useSessionState<number | ''>('stp_target_rate', '');
  const [stpYears, setStpYears] = useSessionState<number | ''>('stp_years', '');

  const resetSTP = () => {
    setStpSourceCorpus('');
    setStpTransferAmt('');
    setStpSourceRate('');
    setStpTargetRate('');
    setStpYears('');
  };

  const stpResult = useMemo(() => {
    if (
      typeof stpSourceCorpus !== 'number' || stpSourceCorpus <= 0 ||
      typeof stpTransferAmt !== 'number' || stpTransferAmt <= 0
    ) {
      return null;
    }
    return calculateSTP({
      sourceInitialCorpus: stpSourceCorpus,
      monthlyTransferAmount: stpTransferAmt,
      sourceFundAnnualReturnRate: typeof stpSourceRate === 'number' ? stpSourceRate : 6,
      targetFundAnnualReturnRate: typeof stpTargetRate === 'number' ? stpTargetRate : 12,
      timePeriodYears: typeof stpYears === 'number' ? stpYears : 5,
    });
  }, [stpSourceCorpus, stpTransferAmt, stpSourceRate, stpTargetRate, stpYears]);

  // ==========================================
  // 7. GOAL-BASED SIP CALCULATOR
  // ==========================================
  const [goalTarget, setGoalTarget] = useSessionState<number | ''>('goal_target', '');
  const [goalYears, setGoalYears] = useSessionState<number | ''>('goal_years', '');
  const [goalRate, setGoalRate] = useSessionState<number | ''>('goal_rate', '');
  const [goalExisting, setGoalExisting] = useSessionState<number | ''>('goal_existing', '');

  const resetGoal = () => {
    setGoalTarget('');
    setGoalYears('');
    setGoalRate('');
    setGoalExisting('');
  };

  const goalResult = useMemo(() => {
    if (
      typeof goalTarget !== 'number' || goalTarget <= 0 ||
      typeof goalYears !== 'number' || goalYears <= 0 ||
      typeof goalRate !== 'number' || goalRate <= 0
    ) {
      return null;
    }
    return calculateGoalBasedSIP({
      targetCorpusAmount: goalTarget,
      timePeriodYears: goalYears,
      expectedAnnualReturnRate: goalRate,
      existingSavings: typeof goalExisting === 'number' ? goalExisting : 0,
    });
  }, [goalTarget, goalYears, goalRate, goalExisting]);

  // ==========================================
  // 8. SIP COST OF DELAY CALCULATOR
  // ==========================================
  const [delaySip, setDelaySip] = useSessionState<number | ''>('delay_sip', '');
  const [delayRate, setDelayRate] = useSessionState<number | ''>('delay_rate', '');
  const [delayTotalYears, setDelayTotalYears] = useSessionState<number | ''>('delay_total_years', '');
  const [delayYears, setDelayYears] = useSessionState<number | ''>('delay_years', '');

  const resetCostOfDelay = () => {
    setDelaySip('');
    setDelayRate('');
    setDelayTotalYears('');
    setDelayYears('');
  };

  const delayResult = useMemo(() => {
    if (
      typeof delaySip !== 'number' || delaySip <= 0 ||
      typeof delayRate !== 'number' || delayRate <= 0 ||
      typeof delayTotalYears !== 'number' || delayTotalYears <= 0 ||
      typeof delayYears !== 'number' || delayYears <= 0
    ) {
      return null;
    }
    return calculateSIPCostOfDelay({
      monthlyInvestment: delaySip,
      expectedAnnualReturnRate: delayRate,
      totalInvestmentPeriodYears: delayTotalYears,
      delayPeriodYears: delayYears,
    });
  }, [delaySip, delayRate, delayTotalYears, delayYears]);

  // ==========================================
  // 9. SIP EXPENSE RATIO IMPACT
  // ==========================================
  const [expSip, setExpSip] = useSessionState<number | ''>('exp_sip', '');
  const [expGross, setExpGross] = useSessionState<number | ''>('exp_gross', '');
  const [expDirect, setExpDirect] = useSessionState<number | ''>('exp_direct', '');
  const [expRegular, setExpRegular] = useSessionState<number | ''>('exp_regular', '');
  const [expYears, setExpYears] = useSessionState<number | ''>('exp_years', '');

  const resetExpenseRatio = () => {
    setExpSip('');
    setExpGross('');
    setExpDirect('');
    setExpRegular('');
    setExpYears('');
  };

  const expenseResult = useMemo(() => {
    if (
      typeof expSip !== 'number' || expSip <= 0 ||
      typeof expGross !== 'number' || expGross <= 0 ||
      typeof expYears !== 'number' || expYears <= 0
    ) {
      return null;
    }
    return calculateExpenseRatioImpact({
      monthlyInvestment: expSip,
      expectedGrossReturnRate: expGross,
      directFundExpenseRatio: typeof expDirect === 'number' ? expDirect : 0.5,
      regularFundExpenseRatio: typeof expRegular === 'number' ? expRegular : 1.75,
      timePeriodYears: expYears,
    });
  }, [expSip, expGross, expDirect, expRegular, expYears]);

  // ==========================================
  // 10. XIRR CALCULATOR
  // ==========================================
  const [cashFlows, setCashFlows] = useSessionState<CashFlowItem[]>('xirr_flows', [
    { date: '2023-01-01', amount: -100000 },
    { date: '2024-01-01', amount: -100000 },
    { date: '2025-01-01', amount: 260000 },
  ]);

  const xirrResult = useMemo(() => {
    return calculateXIRR(cashFlows);
  }, [cashFlows]);

  // ------------------------------------------
  // RENDER BASED ON TOOL SLUG
  // ------------------------------------------
  if (toolSlug === 'mutual-fund-calculator') {
    return <MutualFundCalculatorView />;
  }

  if (toolSlug === 'cagr-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                CAGR Parameters
              </h2>
              <button
                type="button"
                onClick={resetCAGR}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Initial Investment (Beginning Value)"
              value={cagrInit}
              onChange={setCagrInit}
              min={1000}
              max={10000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Final Value (Ending Balance)"
              value={cagrFinal}
              onChange={setCagrFinal}
              min={1000}
              max={50000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <div className="pt-2 border-t border-slate-100 space-y-4">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration Input Method</div>
              <NumberSliderInput
                label="Duration in Years"
                value={cagrYears}
                onChange={(v) => {
                  setCagrYears(v);
                  if (v !== '') {
                    setCagrStart('');
                    setCagrEnd('');
                  }
                }}
                min={0.1}
                max={50}
                step={0.1}
                unitSuffix="Years"
              />

              <div className="text-xs text-center text-slate-400 font-medium">— OR EXACT DATES —</div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={cagrStart}
                    onChange={(e) => {
                      setCagrStart(e.target.value);
                      setCagrYears('');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={cagrEnd}
                    onChange={(e) => {
                      setCagrEnd(e.target.value);
                      setCagrYears('');
                    }}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {cagrResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Compound Annual Growth Rate
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {cagrResult.cagrPercentage}%
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Initial Investment</span>
                    <span className="font-bold text-base text-white">{formatMoney(cagrResult.initialInvestment)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Total Profit</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(cagrResult.totalGain)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="FINAL VALUE"
                  centerSubtitle={formatMoney(cagrResult.finalValue)}
                  segments={[
                    {
                      label: 'Initial Capital',
                      value: cagrResult.initialInvestment,
                      color: '#2563eb',
                      formattedValue: formatMoney(cagrResult.initialInvestment),
                    },
                    {
                      label: 'Capital Gains',
                      value: cagrResult.totalGain,
                      color: '#10b981',
                      formattedValue: formatMoney(cagrResult.totalGain),
                    },
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-xs text-slate-600">
                <span>Growth Multiplier: <strong className="text-slate-900">{cagrResult.multiplier}x</strong></span>
                <span>Absolute Return: <strong className="text-emerald-700">+{cagrResult.absoluteReturnPercentage}%</strong></span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter initial investment, ending value, and timeframe</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolSlug === 'step-up-sip-calculator' || toolSlug === 'step-up-sip-vs-regular-sip-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Step-Up SIP Parameters
              </h2>
              <button
                type="button"
                onClick={resetStepUpSIP}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Initial Monthly Investment"
              value={suInitSip}
              onChange={setSuInitSip}
              min={500}
              max={500000}
              step={500}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Expected Annual Return Rate (%)"
              value={suRate}
              onChange={setSuRate}
              min={1}
              max={30}
              step={0.5}
              unitSuffix="%"
              required
            />

            <NumberSliderInput
              label="Investment Period (Years)"
              value={suYears}
              onChange={setSuYears}
              min={1}
              max={40}
              unitSuffix="Years"
              required
            />

            <NumberSliderInput
              label="Annual Step-Up Percentage (%)"
              value={suStepPct}
              onChange={setSuStepPct}
              min={0}
              max={30}
              unitSuffix="%"
              helperText="Increase monthly investment by this % each year"
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {stepUpResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Expected Maturity Corpus
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(stepUpResult.totalMaturityCorpus)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Invested</span>
                    <span className="font-bold text-base text-white">{formatMoney(stepUpResult.totalInvestedAmount)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Estimated Returns</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(stepUpResult.estimatedReturns)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="MATURITY"
                  centerSubtitle={formatMoney(stepUpResult.totalMaturityCorpus)}
                  segments={[
                    {
                      label: 'Total Invested',
                      value: stepUpResult.totalInvestedAmount,
                      color: '#2563eb',
                      formattedValue: formatMoney(stepUpResult.totalInvestedAmount),
                    },
                    {
                      label: 'Estimated Returns',
                      value: stepUpResult.estimatedReturns,
                      color: '#10b981',
                      formattedValue: formatMoney(stepUpResult.estimatedReturns),
                    },
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Step-Up vs Regular SIP Surplus
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-emerald-700">+{formatMoney(stepUpResult.stepUpCorpusDifference)}</div>
                    <div className="text-xs text-slate-500">
                      {stepUpResult.stepUpGainMultiplier}x larger wealth accumulation
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-600">
                    <div>Regular SIP: {formatMoney(stepUpResult.regularSipCorpus)}</div>
                    <div>Invested: {formatMoney(stepUpResult.regularSipInvested)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter monthly SIP amount, expected return, and tenure</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolSlug === 'swp-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                SWP Parameters
              </h2>
              <button
                type="button"
                onClick={resetSWP}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Initial Corpus"
              value={swpCorpus}
              onChange={setSwpCorpus}
              min={100000}
              max={50000000}
              step={50000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Monthly Withdrawal Amount"
              value={swpMonthly}
              onChange={setSwpMonthly}
              min={1000}
              max={500000}
              step={500}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Expected Annual Return Rate (%)"
              value={swpRate}
              onChange={setSwpRate}
              min={1}
              max={25}
              unitSuffix="%"
              required
            />

            <NumberSliderInput
              label="Withdrawal Period (Years)"
              value={swpYears}
              onChange={setSwpYears}
              min={1}
              max={40}
              unitSuffix="Years"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {swpResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Final Remaining Balance
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(swpResult.finalRemainingCorpus)}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Withdrawn</span>
                    <span className="font-bold text-base text-white">{formatMoney(swpResult.totalWithdrawn)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Interest Earned</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(swpResult.totalInterestEarned)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="TOTAL VALUE"
                  centerSubtitle={formatMoney(swpResult.finalRemainingCorpus + swpResult.totalWithdrawn)}
                  segments={[
                    {
                      label: 'Total Withdrawn',
                      value: swpResult.totalWithdrawn,
                      color: '#2563eb',
                      formattedValue: formatMoney(swpResult.totalWithdrawn),
                    },
                    {
                      label: 'Remaining Balance',
                      value: swpResult.finalRemainingCorpus,
                      color: '#10b981',
                      formattedValue: formatMoney(swpResult.finalRemainingCorpus),
                    },
                  ]}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex justify-between">
                <span>Sustainability Status:</span>
                <strong className={swpResult.depletionYear ? 'text-rose-600' : 'text-emerald-700'}>
                  {swpResult.depletionYear ? `Depletes at Year ${swpResult.depletionYear}` : 'Fully Sustainable'}
                </strong>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter initial corpus, monthly withdrawal, and expected return</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolSlug === 'goal-based-sip-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Goal Target Parameters
              </h2>
              <button
                type="button"
                onClick={resetGoal}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Target Goal Corpus Needed"
              value={goalTarget}
              onChange={setGoalTarget}
              min={100000}
              max={100000000}
              step={50000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Time Period to Reach Goal (Years)"
              value={goalYears}
              onChange={setGoalYears}
              min={1}
              max={40}
              unitSuffix="Years"
              required
            />

            <NumberSliderInput
              label="Expected Annual Return Rate (%)"
              value={goalRate}
              onChange={setGoalRate}
              min={1}
              max={25}
              unitSuffix="%"
              required
            />

            <NumberSliderInput
              label="Existing Savings Available Today"
              value={goalExisting}
              onChange={setGoalExisting}
              min={0}
              max={10000000}
              step={10000}
              unitPrefix={currencySymbol}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {goalResult ? (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                  Required Monthly SIP
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                  {formatMoney(goalResult.requiredMonthlySIP)} <span className="text-lg font-normal text-slate-400">/ mo</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Total Out-of-Pocket</span>
                    <span className="font-bold text-base text-white">{formatMoney(goalResult.totalInvestmentNeeded)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Growth Returns</span>
                    <span className="font-bold text-base text-emerald-400">+{formatMoney(goalResult.estimatedGrowthReturns)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                <DonutChart
                  size={180}
                  centerTitle="TARGET"
                  centerSubtitle={formatMoney(goalResult.targetCorpus)}
                  segments={[
                    {
                      label: 'Invested Capital',
                      value: goalResult.totalInvestmentNeeded,
                      color: '#2563eb',
                      formattedValue: formatMoney(goalResult.totalInvestmentNeeded),
                    },
                    {
                      label: 'Growth Returns',
                      value: goalResult.estimatedGrowthReturns,
                      color: '#10b981',
                      formattedValue: formatMoney(goalResult.estimatedGrowthReturns),
                    },
                  ]}
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter target corpus and timeframe</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Generic Lumpsum / Mutual fund return default
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Investment Parameters
            </h2>
            <button
              type="button"
              onClick={resetLumpsum}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <NumberSliderInput
            label="Initial Investment Amount"
            value={lumpAmt}
            onChange={setLumpAmt}
            min={1000}
            max={10000000}
            step={1000}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Expected Annual Return Rate (%)"
            value={lumpRate}
            onChange={setLumpRate}
            min={1}
            max={30}
            step={0.5}
            unitSuffix="%"
            required
          />

          <NumberSliderInput
            label="Time Horizon (Years)"
            value={lumpYears}
            onChange={setLumpYears}
            min={1}
            max={40}
            unitSuffix="Years"
            required
          />

          <NumberSliderInput
            label="Expected Inflation Rate (%) (Optional)"
            value={lumpInf}
            onChange={setLumpInf}
            min={0}
            max={15}
            unitSuffix="%"
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {lumpsumResult ? (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Total Maturity Value
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                {formatMoney(lumpsumResult.totalMaturityCorpus)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Total Invested</span>
                  <span className="font-bold text-base text-white">{formatMoney(lumpsumResult.initialInvestment)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Estimated Returns</span>
                  <span className="font-bold text-base text-emerald-400">+{formatMoney(lumpsumResult.estimatedReturns)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
              <DonutChart
                size={180}
                centerTitle="MATURITY"
                centerSubtitle={formatMoney(lumpsumResult.totalMaturityCorpus)}
                segments={[
                  {
                    label: 'Total Invested',
                    value: lumpsumResult.initialInvestment,
                    color: '#2563eb',
                    formattedValue: formatMoney(lumpsumResult.initialInvestment),
                  },
                  {
                    label: 'Estimated Returns',
                    value: lumpsumResult.estimatedReturns,
                    color: '#10b981',
                    formattedValue: formatMoney(lumpsumResult.estimatedReturns),
                  },
                ]}
              />
            </div>

            {lumpInf !== '' && Number(lumpInf) > 0 && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Real Purchasing Power</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(lumpsumResult.realPurchasingPowerCorpus)}</div>
                <div className="text-xs text-rose-600 mt-1">Inflation erosion: -{formatMoney(lumpsumResult.inflationErosion)}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter investment amount and timeframe</p>
          </div>
        )}
      </div>
    </div>
  );
};
