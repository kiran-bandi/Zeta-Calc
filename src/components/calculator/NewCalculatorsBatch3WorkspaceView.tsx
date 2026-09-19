import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { CompactCalculatorWorkspace } from './CompactCalculatorWorkspace';
import { DonutChart, DonutSegment } from '../common/DonutChart';
import {
  calculatePortfolioAllocation,
  calculateAssetAllocation,
  calculateSIPVsLumpsum,
  calculateMultiGoalPlanner,
  calculateRetirementIncome,
  calculateAnnuity,
  GoalInputItem,
  AnnuityInput,
} from '../../engine/newCalculatorsBatch3';

interface NewCalculatorsBatch3WorkspaceViewProps {
  toolSlug: string;
}

export const NEW_CALCULATORS_BATCH3_SLUGS = [
  'portfolio-allocation-calculator',
  'asset-allocation-calculator',
  'sip-vs-lumpsum-calculator',
  'multi-goal-investment-planner',
  'retirement-income-calculator',
];

const CATEGORY_COLORS = {
  Equity: '#10b981', // Emerald
  Debt: '#3b82f6', // Blue
  Cash: '#f59e0b', // Amber
  Gold: '#eab308', // Yellow
  'Real Estate': '#8b5cf6', // Violet
  Other: '#64748b', // Slate
};

export const NewCalculatorsBatch3WorkspaceView: React.FC<NewCalculatorsBatch3WorkspaceViewProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // -------------------------------------------------------------------------
  // 1. PORTFOLIO ALLOCATION STATE & LOGIC
  // -------------------------------------------------------------------------
  const [paEq, setPaEq] = useSessionState<number | ''>('pa_eq', '');
  const [paDt, setPaDt] = useSessionState<number | ''>('pa_dt', '');
  const [paCs, setPaCs] = useSessionState<number | ''>('pa_cs', '');
  const [paGd, setPaGd] = useSessionState<number | ''>('pa_gd', '');
  const [paRe, setPaRe] = useSessionState<number | ''>('pa_re', '');
  const [paOt, setPaOt] = useSessionState<number | ''>('pa_ot', '');

  const portfolioResult = useMemo(() => {
    const assets = [
      { name: 'Equity', value: typeof paEq === 'number' ? paEq : 0 },
      { name: 'Debt', value: typeof paDt === 'number' ? paDt : 0 },
      { name: 'Cash', value: typeof paCs === 'number' ? paCs : 0 },
      { name: 'Gold', value: typeof paGd === 'number' ? paGd : 0 },
      { name: 'Real Estate', value: typeof paRe === 'number' ? paRe : 0 },
      { name: 'Other', value: typeof paOt === 'number' ? paOt : 0 },
    ];
    return calculatePortfolioAllocation(assets);
  }, [paEq, paDt, paCs, paGd, paRe, paOt]);

  const paDonutSegments: DonutSegment[] = useMemo(() => {
    if (!portfolioResult || portfolioResult.totalValue === 0) return [];
    return portfolioResult.allocations
      .filter(a => a.value > 0)
      .map(a => ({
        label: a.name,
        value: a.value,
        color: CATEGORY_COLORS[a.name as keyof typeof CATEGORY_COLORS] || '#94a3b8',
        formattedValue: `${a.percentage}%`,
      }));
  }, [portfolioResult]);

  // -------------------------------------------------------------------------
  // 2. ASSET ALLOCATION (TARGET VS CURRENT) STATE & LOGIC
  // -------------------------------------------------------------------------
  const [aaEqVal, setAaEqVal] = useSessionState<number | ''>('aa_eq_val', '');
  const [aaEqTgt, setAaEqTgt] = useSessionState<number | ''>('aa_eq_tgt', 50);
  const [aaDtVal, setAaDtVal] = useSessionState<number | ''>('aa_dt_val', '');
  const [aaDtTgt, setAaDtTgt] = useSessionState<number | ''>('aa_dt_tgt', 30);
  const [aaCsVal, setAaCsVal] = useSessionState<number | ''>('aa_cs_val', '');
  const [aaCsTgt, setAaCsTgt] = useSessionState<number | ''>('aa_cs_tgt', 10);
  const [aaGdVal, setAaGdVal] = useSessionState<number | ''>('aa_gd_val', '');
  const [aaGdTgt, setAaGdTgt] = useSessionState<number | ''>('aa_gd_tgt', 5);
  const [aaReVal, setAaReVal] = useSessionState<number | ''>('aa_re_val', '');
  const [aaReTgt, setAaReTgt] = useSessionState<number | ''>('aa_re_tgt', 5);
  const [aaOtVal, setAaOtVal] = useSessionState<number | ''>('aa_ot_val', '');
  const [aaOtTgt, setAaOtTgt] = useSessionState<number | ''>('aa_ot_tgt', 0);

  const assetAllocationResult = useMemo(() => {
    const items = [
      { category: 'Equity', currentValue: typeof aaEqVal === 'number' ? aaEqVal : 0, targetPercent: typeof aaEqTgt === 'number' ? aaEqTgt : 0 },
      { category: 'Debt', currentValue: typeof aaDtVal === 'number' ? aaDtVal : 0, targetPercent: typeof aaDtTgt === 'number' ? aaDtTgt : 0 },
      { category: 'Cash', currentValue: typeof aaCsVal === 'number' ? aaCsVal : 0, targetPercent: typeof aaCsTgt === 'number' ? aaCsTgt : 0 },
      { category: 'Gold', currentValue: typeof aaGdVal === 'number' ? aaGdVal : 0, targetPercent: typeof aaGdTgt === 'number' ? aaGdTgt : 0 },
      { category: 'Real Estate', currentValue: typeof aaReVal === 'number' ? aaReVal : 0, targetPercent: typeof aaReTgt === 'number' ? aaReTgt : 0 },
      { category: 'Other', currentValue: typeof aaOtVal === 'number' ? aaOtVal : 0, targetPercent: typeof aaOtTgt === 'number' ? aaOtTgt : 0 },
    ];
    return calculateAssetAllocation(items);
  }, [aaEqVal, aaEqTgt, aaDtVal, aaDtTgt, aaCsVal, aaCsTgt, aaGdVal, aaGdTgt, aaReVal, aaReTgt, aaOtVal, aaOtTgt]);

  // -------------------------------------------------------------------------
  // 3. SIP VS LUMPSUM STATE & LOGIC
  // -------------------------------------------------------------------------
  const [svlAmt, setSvlAmt] = useSessionState<number | ''>('svl_amt', ''); // For equal comparisons
  const [svlRate, setSvlRate] = useSessionState<number | ''>('svl_rate', '');
  const [svlY, setSvlY] = useSessionState<number | ''>('svl_y', '');
  const [svlM, setSvlM] = useSessionState<number | ''>('svl_m', '');
  const [svlMode, setSvlMode] = useSessionState<'equal-total' | 'manual'>('svl_mode', 'equal-total');
  const [svlSip, setSvlSip] = useSessionState<number | ''>('svl_sip', '');
  const [svlLump, setSvlLump] = useSessionState<number | ''>('svl_lump', '');

  const sipVsLumpsumResult = useMemo(() => {
    if (typeof svlRate !== 'number' || svlRate < 0) return null;
    const totalM = (typeof svlY === 'number' ? svlY : 0) * 12 + (typeof svlM === 'number' ? svlM : 0);
    if (totalM <= 0) return null;

    let sip = 0;
    let lump = 0;

    if (svlMode === 'equal-total') {
      const totalCap = typeof svlAmt === 'number' ? svlAmt : 0;
      lump = totalCap;
      sip = totalCap / totalM;
    } else {
      sip = typeof svlSip === 'number' ? svlSip : 0;
      lump = typeof svlLump === 'number' ? svlLump : 0;
    }

    if (sip <= 0 && lump <= 0) return null;

    return calculateSIPVsLumpsum({
      expectedReturnPercent: svlRate,
      years: typeof svlY === 'number' ? svlY : 0,
      months: typeof svlM === 'number' ? svlM : 0,
      sipAmount: sip,
      lumpSumAmount: lump,
      frequency: 'monthly',
    });
  }, [svlAmt, svlRate, svlY, svlM, svlMode, svlSip, svlLump]);

  // -------------------------------------------------------------------------
  // 4. MULTI-GOAL INVESTMENT PLANNER STATE & LOGIC
  // -------------------------------------------------------------------------
  const [mgRate, setMgRate] = useSessionState<number | ''>('mg_rate', '');
  const [mgInf, setMgInf] = useSessionState<number | ''>('mg_inf', '');

  // Track goals using session state list
  const [mgG1Name, setMgG1Name] = useSessionState<string>('mg_g1_name', 'Home Purchase');
  const [mgG1Amt, setMgG1Amt] = useSessionState<number | ''>('mg_g1_amt', '');
  const [mgG1Y, setMgG1Y] = useSessionState<number | ''>('mg_g1_y', '');

  const [mgG2Name, setMgG2Name] = useSessionState<string>('mg_g2_name', "Child Education");
  const [mgG2Amt, setMgG2Amt] = useSessionState<number | ''>('mg_g2_amt', '');
  const [mgG2Y, setMgG2Y] = useSessionState<number | ''>('mg_g2_y', '');

  const [mgG3Name, setMgG3Name] = useSessionState<string>('mg_g3_name', 'Retirement Pool');
  const [mgG3Amt, setMgG3Amt] = useSessionState<number | ''>('mg_g3_amt', '');
  const [mgG3Y, setMgG3Y] = useSessionState<number | ''>('mg_g3_y', '');

  const multiGoalResult = useMemo(() => {
    if (typeof mgRate !== 'number') return null;

    const goalsList: GoalInputItem[] = [];
    if (typeof mgG1Amt === 'number' && mgG1Amt > 0) {
      goalsList.push({ id: '1', name: mgG1Name, targetAmountToday: mgG1Amt, yearsToGoal: typeof mgG1Y === 'number' ? mgG1Y : 0 });
    }
    if (typeof mgG2Amt === 'number' && mgG2Amt > 0) {
      goalsList.push({ id: '2', name: mgG2Name, targetAmountToday: mgG2Amt, yearsToGoal: typeof mgG2Y === 'number' ? mgG2Y : 0 });
    }
    if (typeof mgG3Amt === 'number' && mgG3Amt > 0) {
      goalsList.push({ id: '3', name: mgG3Name, targetAmountToday: mgG3Amt, yearsToGoal: typeof mgG3Y === 'number' ? mgG3Y : 0 });
    }

    if (goalsList.length === 0) return null;

    return calculateMultiGoalPlanner(goalsList, mgRate, typeof mgInf === 'number' ? mgInf : 0);
  }, [mgRate, mgInf, mgG1Name, mgG1Amt, mgG1Y, mgG2Name, mgG2Amt, mgG2Y, mgG3Name, mgG3Amt, mgG3Y]);

  // -------------------------------------------------------------------------
  // 5. RETIREMENT INCOME STATE & LOGIC
  // -------------------------------------------------------------------------
  const [riCorpus, setRiCorpus] = useSessionState<number | ''>('ri_corpus', '');
  const [riRate, setRiRate] = useSessionState<number | ''>('ri_rate', '');
  const [riInf, setRiInf] = useSessionState<number | ''>('ri_inf', '');
  const [riY, setRiY] = useSessionState<number | ''>('ri_y', '');
  const [riWith, setRiWith] = useSessionState<number | ''>('ri_with', '');
  const [riAdj, setRiAdj] = useSessionState<boolean>('ri_adj', true);

  const retirementResult = useMemo(() => {
    if (typeof riCorpus !== 'number' || riCorpus <= 0 || typeof riRate !== 'number' || typeof riWith !== 'number' || riWith <= 0) return null;
    return calculateRetirementIncome({
      currentCorpus: riCorpus,
      expectedAnnualReturnPercent: riRate,
      inflationPercent: typeof riInf === 'number' ? riInf : 0,
      retirementYears: typeof riY === 'number' ? riY : 25,
      initialMonthlyWithdrawal: riWith,
      inflationAdjusted: riAdj,
    });
  }, [riCorpus, riRate, riInf, riY, riWith, riAdj]);

  const hasValidInputs = (val: any) => typeof val === 'number' && val > 0;

  // -------------------------------------------------------------------------
  // 1. PORTFOLIO ALLOCATION RENDER
  // -------------------------------------------------------------------------
  if (toolSlug === 'portfolio-allocation-calculator') {
    const isReady = paEq !== '' || paDt !== '' || paCs !== '' || paGd !== '' || paRe !== '' || paOt !== '';
    const resetFields = () => {
      setPaEq(''); setPaDt(''); setPaCs(''); setPaGd(''); setPaRe(''); setPaOt('');
    };

    return (
      <CompactCalculatorWorkspace
        onReset={resetFields}
        inputs={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Portfolio Valuation</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Equity Value ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 50000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paEq}
                  onChange={e => setPaEq(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Debt Value ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 30000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paDt}
                  onChange={e => setPaDt(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Liquid Cash ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paCs}
                  onChange={e => setPaCs(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Gold holdings ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paGd}
                  onChange={e => setPaGd(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Real Estate ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paRe}
                  onChange={e => setPaRe(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Other Assets ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={paOt}
                  onChange={e => setPaOt(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        }
        results={
          <div className="space-y-6">
            {isReady && portfolioResult.totalValue > 0 ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Portfolio Value
                  </span>
                  <div className="text-3xl font-black text-emerald-400">
                    {formatMoney(portfolioResult.totalValue)}
                  </div>
                </div>

                {paDonutSegments.length > 0 && (
                  <div className="flex justify-center py-2">
                    <DonutChart data={paDonutSegments} size={200} centerTitle="Portfolio" centerSubtitle="Mix" />
                  </div>
                )}

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
                    Asset Class Weightings
                  </div>
                  {portfolioResult.allocations.filter(a => a.value > 0).map(a => (
                    <div key={a.name} className="flex items-center justify-between text-xs border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[a.name as keyof typeof CATEGORY_COLORS] || '#94a3b8' }} />
                        {a.name}
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{formatMoney(a.value)}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{a.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Tally your asset values on the left to compute detailed portfolio percentage weightings.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // -------------------------------------------------------------------------
  // 2. ASSET ALLOCATION (TARGET VS CURRENT) RENDER
  // -------------------------------------------------------------------------
  if (toolSlug === 'asset-allocation-calculator') {
    const isReady = aaEqVal !== '' || aaDtVal !== '' || aaCsVal !== '' || aaGdVal !== '' || aaReVal !== '' || aaOtVal !== '';
    const resetFields = () => {
      setAaEqVal(''); setAaEqTgt(50); setAaDtVal(''); setAaDtTgt(30); setAaCsVal(''); setAaCsTgt(10);
      setAaGdVal(''); setAaGdTgt(5); setAaReVal(''); setAaReTgt(5); setAaOtVal(''); setAaOtTgt(0);
    };

    return (
      <CompactCalculatorWorkspace
        onReset={resetFields}
        inputs={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Current Values & Target %</h3>
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
              Define the target weighting (%) per asset class. Rebalancing suggestions will compute buy/sell actions dynamically.
            </p>

            <div className="space-y-3.5">
              {/* Equity Row */}
              <div className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-2">
                <div className="col-span-4 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Equity
                </div>
                <div className="col-span-5">
                  <label className="text-[10px] text-slate-500 block mb-0.5">Value ({currencySymbol})</label>
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 50000"
                    value={aaEqVal}
                    onChange={e => setAaEqVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <label className="text-[10px] text-slate-500 block mb-0.5">Target %</label>
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 50"
                    value={aaEqTgt}
                    onChange={e => setAaEqTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Debt Row */}
              <div className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-2">
                <div className="col-span-4 text-xs font-bold text-blue-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Debt
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 30000"
                    value={aaDtVal}
                    onChange={e => setAaDtVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 30"
                    value={aaDtTgt}
                    onChange={e => setAaDtTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Cash Row */}
              <div className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-2">
                <div className="col-span-4 text-xs font-bold text-amber-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Cash
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 10000"
                    value={aaCsVal}
                    onChange={e => setAaCsVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 10"
                    value={aaCsTgt}
                    onChange={e => setAaCsTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Gold Row */}
              <div className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-2">
                <div className="col-span-4 text-xs font-bold text-yellow-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  Gold
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 5000"
                    value={aaGdVal}
                    onChange={e => setAaGdVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 5"
                    value={aaGdTgt}
                    onChange={e => setAaGdTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Real Estate Row */}
              <div className="grid grid-cols-12 gap-3 items-end border-b border-slate-100 pb-2">
                <div className="col-span-4 text-xs font-bold text-violet-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Real Estate
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 0"
                    value={aaReVal}
                    onChange={e => setAaReVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 0"
                    value={aaReTgt}
                    onChange={e => setAaReTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Other Row */}
              <div className="grid grid-cols-12 gap-3 items-end pb-2">
                <div className="col-span-4 text-xs font-bold text-slate-500 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Other
                </div>
                <div className="col-span-5">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 5000"
                    value={aaOtVal}
                    onChange={e => setAaOtVal(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                    placeholder="e.g. 5"
                    value={aaOtTgt}
                    onChange={e => setAaOtTgt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        }
        results={
          <div className="space-y-5">
            {isReady && assetAllocationResult.totalCurrentValue > 0 ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Current Portfolio
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mb-1">
                    {formatMoney(assetAllocationResult.totalCurrentValue)}
                  </div>
                  {!assetAllocationResult.isTargetBalanced && (
                    <span className="text-[10px] text-amber-400 block font-semibold">
                      ⚠️ Target allocations sum to {assetAllocationResult.totalTargetPercent}%. Standard target is 100%. Adjustments are relative to selected proportions.
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Rebalancing Recommendations
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {assetAllocationResult.items.filter(item => item.currentValue > 0 || item.targetPercent > 0).map(item => {
                      const isBuy = item.action === 'Buy';
                      const isSell = item.action === 'Sell';
                      return (
                        <div key={item.category} className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                          <div>
                            <div className="font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || '#64748b' }} />
                              {item.category}
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Current: {item.currentPercent}% (Target: {item.targetPercent}%)
                            </div>
                          </div>

                          <div className="text-right">
                            {item.action === 'No Action' ? (
                              <span className="font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded text-[10px]">Balanced</span>
                            ) : (
                              <>
                                <span className={`font-black text-xs ${isBuy ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {isBuy ? 'BUY' : 'SELL'} {formatMoney(Math.abs(item.requiredAdjustment))}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {isBuy ? 'Under-allocated' : 'Over-allocated'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Provide current asset valuations and target allocation percentages on the left to analyze rebalancing adjustments.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // -------------------------------------------------------------------------
  // 3. SIP VS LUMPSUM RENDER
  // -------------------------------------------------------------------------
  if (toolSlug === 'sip-vs-lumpsum-calculator') {
    const isReady = svlRate !== '' && (svlY !== '' || svlM !== '') && (svlMode === 'equal-total' ? svlAmt !== '' : svlSip !== '' || svlLump !== '');
    const resetFields = () => {
      setSvlAmt(''); setSvlRate(''); setSvlY(''); setSvlM(''); setSvlSip(''); setSvlLump('');
    };

    return (
      <CompactCalculatorWorkspace
        onReset={resetFields}
        inputs={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Investment Comparison Parameters</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Expected Return (% p.a.)</label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={svlRate}
                  onChange={e => setSvlRate(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Years</label>
                  <input
                    type="number"
                    placeholder="Years"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                    value={svlY}
                    onChange={e => setSvlY(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Months</label>
                  <input
                    type="number"
                    placeholder="Months"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                    value={svlM}
                    onChange={e => setSvlM(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
              <label className="text-xs font-bold text-slate-700 block">Comparison Method</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/60 rounded-lg">
                <button
                  type="button"
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${svlMode === 'equal-total' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => setSvlMode('equal-total')}
                >
                  Equal Total Capital
                </button>
                <button
                  type="button"
                  className={`py-1.5 text-xs font-semibold rounded-md transition-all ${svlMode === 'manual' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600 hover:text-slate-900'}`}
                  onClick={() => setSvlMode('manual')}
                >
                  Manual Parameters
                </button>
              </div>

              {svlMode === 'equal-total' ? (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Total Deployed Capital ({currencySymbol})</label>
                  <input
                    type="number"
                    placeholder="e.g. 120000"
                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                    value={svlAmt}
                    onChange={e => setSvlAmt(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-500 block mt-1 leading-relaxed">
                    Splits capital: Lumpsum invests full amount on day 1. SIP divides it evenly month-by-month over the duration.
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">Monthly SIP ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                      value={svlSip}
                      onChange={e => setSvlSip(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">One-Time Lumpsum ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="e.g. 100000"
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                      value={svlLump}
                      onChange={e => setSvlLump(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        results={
          <div className="space-y-5">
            {isReady && sipVsLumpsumResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Future Value Comparison
                  </span>
                  <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800 mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">SIP Growth</span>
                      <span className="text-xl font-bold text-emerald-400 block">
                        {formatMoney(sipVsLumpsumResult.sipFutureValue)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold block">Gains: {formatMoney(sipVsLumpsumResult.sipGains)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-0.5">Lump Sum Growth</span>
                      <span className="text-xl font-bold text-cyan-300 block">
                        {formatMoney(sipVsLumpsumResult.lumpSumFutureValue)}
                      </span>
                      <span className="text-[9px] text-slate-500 font-semibold block">Gains: {formatMoney(sipVsLumpsumResult.lumpSumGains)}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                    {sipVsLumpsumResult.preferredOption === 'Lumpsum' ? (
                      <span className="text-cyan-300 font-bold">
                        Lump Sum outperforms SIP by {formatMoney(Math.abs(sipVsLumpsumResult.futureValueDifference))}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold">
                        SIP outperforms Lump Sum by {formatMoney(Math.abs(sipVsLumpsumResult.futureValueDifference))}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Comparative Parameters
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                    <span>SIP Deployed Capital:</span>
                    <strong className="text-slate-900">{formatMoney(sipVsLumpsumResult.sipTotalInvested)}</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                    <span>Lump Sum Deployed Capital:</span>
                    <strong className="text-slate-900">{formatMoney(sipVsLumpsumResult.lumpSumTotalInvested)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Growth Multiple (SIP vs Lump):</span>
                    <strong className="text-slate-900">{sipVsLumpsumResult.sipWealthRatio}x vs {sipVsLumpsumResult.lumpSumWealthRatio}x</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Provide expected return rate, investment timeline, and capitals on the left to compare growth metrics.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // -------------------------------------------------------------------------
  // 4. MULTI-GOAL INVESTMENT PLANNER RENDER
  // -------------------------------------------------------------------------
  if (toolSlug === 'multi-goal-investment-planner') {
    const isReady = mgRate !== '' && (mgG1Amt !== '' || mgG2Amt !== '' || mgG3Amt !== '');
    const resetFields = () => {
      setMgRate(''); setMgInf(''); setMgG1Amt(''); setMgG1Y(''); setMgG2Amt(''); setMgG2Y(''); setMgG3Amt(''); setMgG3Y('');
    };

    return (
      <CompactCalculatorWorkspace
        onReset={resetFields}
        inputs={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Simultaneous Financial Goals</h3>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Portfolio Return (% p.a.)</label>
                <input
                  type="number"
                  placeholder="e.g. 12"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={mgRate}
                  onChange={e => setMgRate(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Expected Inflation (% p.a.)</label>
                <input
                  type="number"
                  placeholder="e.g. 6"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={mgInf}
                  onChange={e => setMgInf(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Goal 1 Row */}
              <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2">
                <input
                  type="text"
                  className="text-xs font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
                  value={mgG1Name}
                  onChange={e => setMgG1Name(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Target Amount Today ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="e.g. 50000"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG1Amt}
                      onChange={e => setMgG1Amt(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Years to Goal</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG1Y}
                      onChange={e => setMgG1Y(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Goal 2 Row */}
              <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2">
                <input
                  type="text"
                  className="text-xs font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
                  value={mgG2Name}
                  onChange={e => setMgG2Name(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Target Amount Today ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="e.g. 100000"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG2Amt}
                      onChange={e => setMgG2Amt(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Years to Goal</label>
                    <input
                      type="number"
                      placeholder="e.g. 10"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG2Y}
                      onChange={e => setMgG2Y(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Goal 3 Row */}
              <div className="p-3 bg-slate-50/50 border border-slate-150 rounded-xl space-y-2">
                <input
                  type="text"
                  className="text-xs font-bold text-slate-700 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
                  value={mgG3Name}
                  onChange={e => setMgG3Name(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block">Target Amount Today ({currencySymbol})</label>
                    <input
                      type="number"
                      placeholder="e.g. 500000"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG3Amt}
                      onChange={e => setMgG3Amt(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Years to Goal</label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      className="w-full h-8 px-2 bg-white border border-slate-200 rounded text-xs"
                      value={mgG3Y}
                      onChange={e => setMgG3Y(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        results={
          <div className="space-y-5">
            {isReady && multiGoalResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Combined Monthly Savings Target
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mb-1">
                    {formatMoney(multiGoalResult.totalRequiredMonthlySip)}/mo
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Inflation adjusted future targets sum to: <strong>{formatMoney(multiGoalResult.totalTargetFuture)}</strong>
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Goal-wise Savings breakdown
                  </div>

                  <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {multiGoalResult.goals.map(goal => (
                      <div key={goal.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between items-center font-bold text-slate-800">
                          <span>🎯 {goal.name}</span>
                          <span className="text-emerald-600">{formatMoney(goal.requiredMonthlySip)}/mo</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <div>
                            Target (Future): <strong className="text-slate-700">{formatMoney(goal.targetAmountFuture)}</strong>
                          </div>
                          <div className="text-right">
                            Years to goal: <strong className="text-slate-700">{goal.yearsToGoal}y</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Provide expected return and add at least one financial goal target on the left to estimate required systematic savings.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // -------------------------------------------------------------------------
  // 5. RETIREMENT INCOME RENDER
  // -------------------------------------------------------------------------
  if (toolSlug === 'retirement-income-calculator') {
    const isReady = riCorpus !== '' && riRate !== '' && riWith !== '';
    const resetFields = () => {
      setRiCorpus(''); setRiRate(''); setRiInf(''); setRiY(''); setRiWith(''); setRiAdj(true);
    };

    return (
      <CompactCalculatorWorkspace
        onReset={resetFields}
        inputs={
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Nest Egg & Withdrawal Parameters</h3>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Accumulated Retirement Corpus ({currencySymbol})</label>
              <input
                type="number"
                placeholder="e.g. 1000000"
                className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                value={riCorpus}
                onChange={e => setRiCorpus(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Corpus Growth (% p.a.)</label>
                <input
                  type="number"
                  placeholder="e.g. 8"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={riRate}
                  onChange={e => setRiRate(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Annual Inflation (% p.a.)</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={riInf}
                  onChange={e => setRiInf(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Initial Monthly Withdrawal ({currencySymbol})</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={riWith}
                  onChange={e => setRiWith(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Retirement Horizon (Years)</label>
                <input
                  type="number"
                  placeholder="e.g. 25"
                  className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800"
                  value={riY}
                  onChange={e => setRiY(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="ri_adj"
                className="w-4 h-4 text-blue-600 border-slate-300 rounded"
                checked={riAdj}
                onChange={e => setRiAdj(e.target.checked)}
              />
              <label htmlFor="ri_adj" className="text-xs font-semibold text-slate-600 cursor-pointer">
                Adjust monthly withdrawals annually for inflation
              </label>
            </div>
          </div>
        }
        results={
          <div className="space-y-5">
            {isReady && retirementResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 text-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Nest Egg Sustainability
                  </span>
                  <div className={`text-2xl font-black mb-1 ${retirementResult.isFullySustained ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {retirementResult.isFullySustained ? 'Fully Sustained' : 'Depletion Point Reached'}
                  </div>
                  <span className="text-xs text-slate-400 block">
                    {retirementResult.isFullySustained
                      ? `Corpus safely survives the full ${riY} years with ${formatMoney(retirementResult.endingBalance)} remaining.`
                      : `Corpus drains in Year ${retirementResult.depletionYear}, Month ${retirementResult.depletionMonth}.`}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Sustainability Metrics
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                    <span>Months Sustained:</span>
                    <strong className="text-slate-900">{retirementResult.sustainMonths} months</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                    <span>Total Income Withdrawn:</span>
                    <strong className="text-slate-900">{formatMoney(retirementResult.totalIncomeWithdrawn)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Ending Balance:</span>
                    <strong className="text-slate-900">{formatMoney(retirementResult.endingBalance)}</strong>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Provide retirement corpus, rate of return, and initial withdrawal amount on the left to run sustainability drawdown simulations.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // Fallback
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 mb-2 font-display">Verified Calculation Engine</h3>
      <p className="text-xs text-slate-600 mb-4">
        This calculator runs on deterministic formulas verified to industry standards.
      </p>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
        Engine Loaded: {toolSlug}
      </div>
    </div>
  );
};
