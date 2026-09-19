import React, { useMemo } from 'react';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import {
  calculatePercentageDifference,
  calculateZScore,
  calculateStandardError,
  calculateProbability,
  calculatePermutationCombination,
  checkPrimeNumber,
  calculateLogarithm,
  calculateExponent,
  calculateDateAddSubtract,
  calculateBusinessDays,
  calculateWorkingDaysAdd,
  calculateTimeDuration,
  convertUnixTimestamp,
  calculateWeekNumber,
  calculateDaysUntilDate,
  calculatePercentagePointDifference,
  simplifyRatio,
  solveProportion,
  calculateTimeZoneConversion,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const MATH_DATETIME_SLUGS = [
  'percentage-point-difference-calculator',
  'ratio-proportion-calculator',
  'time-zone-converter',
  'percentage-difference-calculator',
  'z-score-calculator',
  'standard-error-calculator',
  'probability-calculator',
  'permutation-combination-calculator',
  'prime-number-checker',
  'logarithm-calculator',
  'exponent-calculator',
  'date-add-subtract-calculator',
  'business-days-calculator',
  'working-days-add-calculator',
  'time-duration-calculator',
  'unix-timestamp-converter',
  'week-number-calculator',
  'days-until-date-calculator',
];

const COMMON_TIME_ZONES = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'New York (Eastern Time - US / Canada)' },
  { value: 'America/Chicago', label: 'Chicago (Central Time - US / Canada)' },
  { value: 'America/Denver', label: 'Denver (Mountain Time - US / Canada)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (Pacific Time - US / Canada)' },
  { value: 'America/Anchorage', label: 'Anchorage (Alaska Time)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (Hawaii-Aleutian Time)' },
  { value: 'America/Toronto', label: 'Toronto (Eastern Time - Canada)' },
  { value: 'America/Vancouver', label: 'Vancouver (Pacific Time - Canada)' },
  { value: 'America/Sao_Paulo', label: 'São Paulo (Brasília Time)' },
  { value: 'America/Buenos_Aires', label: 'Buenos Aires (Argentina Time)' },
  { value: 'Europe/London', label: 'London / Dublin / Lisbon (GMT / BST)' },
  { value: 'Europe/Paris', label: 'Paris / Berlin / Rome / Madrid (CET / CEST)' },
  { value: 'Europe/Athens', label: 'Athens / Helsinki / Bucharest (EET / EEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (Moscow Standard Time - MSK)' },
  { value: 'Africa/Cairo', label: 'Cairo (Egypt Standard Time)' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (South Africa Standard Time)' },
  { value: 'Asia/Dubai', label: 'Dubai / Abu Dhabi (Gulf Standard Time - GST)' },
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST - Delhi, Mumbai, Bengaluru)' },
  { value: 'Asia/Dhaka', label: 'Dhaka (Bangladesh Standard Time)' },
  { value: 'Asia/Bangkok', label: 'Bangkok / Hanoi / Jakarta (Indochina Time)' },
  { value: 'Asia/Singapore', label: 'Singapore / Kuala Lumpur (SGT)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong / Shanghai / Beijing (HKT / CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo / Seoul (Japan Standard Time - JST)' },
  { value: 'Australia/Sydney', label: 'Sydney / Melbourne (AEST / AEDT)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Pacific/Auckland', label: 'Auckland / Wellington (NZST / NZDT)' },
];

export const MathAndDateTimeViews: React.FC<Props> = ({ toolSlug }) => {
  // 0. Percentage Point Difference
  const [ppA, setPpA] = useSessionState<number | ''>('pp_val_a', '');
  const [ppB, setPpB] = useSessionState<number | ''>('pp_val_b', '');

  const ppResult = useMemo(() => {
    if (typeof ppA !== 'number' || typeof ppB !== 'number') return null;
    return calculatePercentagePointDifference(ppA, ppB);
  }, [ppA, ppB]);

  // 0.1 Ratio & Proportion
  const [rpMode, setRpMode] = useSessionState<'simplify' | 'proportion'>('rp_mode', 'simplify');
  const [rpA, setRpA] = useSessionState<number | ''>('rp_simp_a', '');
  const [rpB, setRpB] = useSessionState<number | ''>('rp_simp_b', '');

  const [propA, setPropA] = useSessionState<number | ''>('prop_a', '');
  const [propB, setPropB] = useSessionState<number | ''>('prop_b', '');
  const [propC, setPropC] = useSessionState<number | ''>('prop_c', '');
  const [propD, setPropD] = useSessionState<number | ''>('prop_d', '');

  const ratioSimplifyResult = useMemo(() => {
    if (typeof rpA !== 'number' || typeof rpB !== 'number') return null;
    return simplifyRatio(rpA, rpB);
  }, [rpA, rpB]);

  const proportionResult = useMemo(() => {
    return solveProportion(propA, propB, propC, propD);
  }, [propA, propB, propC, propD]);

  // 0.2 Time Zone Converter
  const [tzDate, setTzDate] = useSessionState<string>('tz_date', '2025-01-15');
  const [tzTime, setTzTime] = useSessionState<string>('tz_time', '12:00');
  const [tzFrom, setTzFrom] = useSessionState<string>('tz_from', 'America/New_York');
  const [tzTo, setTzTo] = useSessionState<string>('tz_to', 'Europe/London');

  const timeZoneResult = useMemo(() => {
    return calculateTimeZoneConversion(tzDate, tzTime, tzFrom, tzTo);
  }, [tzDate, tzTime, tzFrom, tzTo]);

  // 1. Percentage Difference
  const [pdV1, setPdV1] = useSessionState<number | ''>('pd_v1', 120);
  const [pdV2, setPdV2] = useSessionState<number | ''>('pd_v2', 150);

  const pdResult = useMemo(() => {
    if (typeof pdV1 !== 'number' || typeof pdV2 !== 'number') return null;
    return calculatePercentageDifference(pdV1, pdV2);
  }, [pdV1, pdV2]);

  // 2. Z-Score
  const [zsVal, setZsVal] = useSessionState<number | ''>('zs_val', 85);
  const [zsMean, setZsMean] = useSessionState<number | ''>('zs_mean', 70);
  const [zsSd, setZsSd] = useSessionState<number | ''>('zs_sd', 10);

  const zScoreResult = useMemo(() => {
    if (typeof zsVal !== 'number' || typeof zsMean !== 'number' || typeof zsSd !== 'number') return null;
    return calculateZScore(zsVal, zsMean, zsSd);
  }, [zsVal, zsMean, zsSd]);

  // 3. Standard Error
  const [seSd, setSeSd] = useSessionState<number | ''>('se_sd', 15);
  const [seN, setSeN] = useSessionState<number | ''>('se_n', 100);

  const seResult = useMemo(() => {
    if (typeof seSd !== 'number' || typeof seN !== 'number') return null;
    return calculateStandardError(seSd, seN);
  }, [seSd, seN]);

  // 4. Probability
  const [pbA, setPbA] = useSessionState<number | ''>('pb_a', 0.4);
  const [pbB, setPbB] = useSessionState<number | ''>('pb_b', 0.25);
  const [pbIndep, setPbIndep] = useSessionState<boolean>('pb_ind', true);

  const probResult = useMemo(() => {
    if (typeof pbA !== 'number' || typeof pbB !== 'number') return null;
    return calculateProbability(pbA, pbB, pbIndep);
  }, [pbA, pbB, pbIndep]);

  // 5. Permutation & Combination
  const [pcN, setPcN] = useSessionState<number | ''>('pc_n', 10);
  const [pcR, setPcR] = useSessionState<number | ''>('pc_r', 4);

  const pcResult = useMemo(() => {
    if (typeof pcN !== 'number' || typeof pcR !== 'number') return null;
    return calculatePermutationCombination(pcN, pcR);
  }, [pcN, pcR]);

  // 6. Prime Number Checker
  const [pnNum, setPnNum] = useSessionState<number | ''>('pn_num', 97);

  const primeResult = useMemo(() => {
    if (typeof pnNum !== 'number') return null;
    return checkPrimeNumber(pnNum);
  }, [pnNum]);

  // 7. Logarithm
  const [lgVal, setLgVal] = useSessionState<number | ''>('lg_val', 1000);
  const [lgBase, setLgBase] = useSessionState<number | ''>('lg_base', 10);

  const logResult = useMemo(() => {
    if (typeof lgVal !== 'number' || typeof lgBase !== 'number') return null;
    return calculateLogarithm(lgVal, lgBase);
  }, [lgVal, lgBase]);

  // 8. Exponent
  const [exBase, setExBase] = useSessionState<number | ''>('ex_base', 2);
  const [exPwr, setExPwr] = useSessionState<number | ''>('ex_pwr', 8);

  const expResult = useMemo(() => {
    if (typeof exBase !== 'number' || typeof exPwr !== 'number') return null;
    return calculateExponent(exBase, exPwr);
  }, [exBase, exPwr]);

  // 9. Date Add/Subtract
  const [daStart, setDaStart] = useSessionState<string>('da_start', '2025-01-15');
  const [daDays, setDaDays] = useSessionState<number | ''>('da_days', '');
  const [daWeeks, setDaWeeks] = useSessionState<number | ''>('da_weeks', '');
  const [daMonths, setDaMonths] = useSessionState<number | ''>('da_months', '');
  const [daYears, setDaYears] = useSessionState<number | ''>('da_years', '');
  const [daOp, setDaOp] = useSessionState<'add' | 'subtract'>('da_op', 'add');

  const dateAddResult = useMemo(() => {
    const days = (typeof daDays === 'number' ? daDays : 0) + (typeof daWeeks === 'number' ? daWeeks * 7 : 0);
    const months = typeof daMonths === 'number' ? daMonths : 0;
    const years = typeof daYears === 'number' ? daYears : 0;
    if (days === 0 && months === 0 && years === 0) return null;
    return calculateDateAddSubtract(daStart, days, months, years, daOp);
  }, [daStart, daDays, daWeeks, daMonths, daYears, daOp]);

  // 10. Business Days Between
  const [bdStart, setBdStart] = useSessionState<string>('bd_start', new Date().toISOString().split('T')[0]);
  const [bdEnd, setBdEnd] = useSessionState<string>('bd_end', new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);

  const businessDaysResult = useMemo(() => {
    if (!bdStart || !bdEnd) return null;
    return calculateBusinessDays(bdStart, bdEnd);
  }, [bdStart, bdEnd]);

  // 11. Working Days Add
  const [wdStart, setWdStart] = useSessionState<string>('wd_start', new Date().toISOString().split('T')[0]);
  const [wdDays, setWdDays] = useSessionState<number | ''>('wd_days', 15);

  const workingDaysAddResult = useMemo(() => {
    if (!wdStart || typeof wdDays !== 'number') return null;
    return calculateWorkingDaysAdd(wdStart, wdDays);
  }, [wdStart, wdDays]);

  // 12. Time Duration
  const [tdStart, setTdStart] = useSessionState<string>('td_start', '08:30');
  const [tdEnd, setTdEnd] = useSessionState<string>('td_end', '17:15');

  const timeDurationResult = useMemo(() => {
    if (!tdStart || !tdEnd) return null;
    const [sh, sm] = tdStart.split(':').map(Number);
    const [eh, em] = tdEnd.split(':').map(Number);
    if (isNaN(sh) || isNaN(sm) || isNaN(eh) || isNaN(em)) return null;
    return calculateTimeDuration(sh, sm, eh, em);
  }, [tdStart, tdEnd]);

  // 13. Unix Timestamp Converter
  const [uxTs, setUxTs] = useSessionState<number | ''>('ux_ts', Math.floor(Date.now() / 1000));

  const unixResult = useMemo(() => {
    if (typeof uxTs !== 'number') return null;
    return convertUnixTimestamp(uxTs);
  }, [uxTs]);

  // 14. Week Number
  const [wnDate, setWnDate] = useSessionState<string>('wn_date', new Date().toISOString().split('T')[0]);

  const weekNumberResult = useMemo(() => {
    if (!wnDate) return null;
    return calculateWeekNumber(wnDate);
  }, [wnDate]);

  // 15. Days Until Date
  const [duDate, setDuDate] = useSessionState<string>('du_date', new Date(Date.now() + 100 * 86400000).toISOString().split('T')[0]);

  const daysUntilResult = useMemo(() => {
    if (!duDate) return null;
    return calculateDaysUntilDate(duDate);
  }, [duDate]);

  // RENDERING
  if (toolSlug === 'percentage-point-difference-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Percentage Point Difference Calculator"
        onReset={() => {
          setPpA('');
          setPpB('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Baseline / Initial Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5.0"
                    value={ppA}
                    onChange={(e) => setPpA(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-sm font-semibold">%</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  New / Final Percentage (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 7.5"
                    value={ppB}
                    onChange={(e) => setPpB(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800 pr-8"
                  />
                  <span className="absolute right-3 top-2 text-slate-400 text-sm font-semibold">%</span>
                </div>
              </div>
            </div>
          </div>
        }
        results={
          ppResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  Percentage Point Difference
                </span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">
                  {ppResult.difference > 0 ? `+${ppResult.difference}` : ppResult.difference} pp
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">
                  {ppResult.explanation}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Basis Points (bps)</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {Math.round(ppResult.absoluteDifference * 100)} bps
                  </div>
                  <div className="text-[10px] text-slate-400">1 percentage point = 100 basis points</div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Relative Percentage Change</div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {ppResult.percentageChange !== null
                      ? `${ppResult.percentageChange > 0 ? '+' : ''}${ppResult.percentageChange}%`
                      : 'N/A (Baseline is 0%)'}
                  </div>
                  <div className="text-[10px] text-slate-400">((Final - Initial) / |Initial|) × 100</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm border border-dashed rounded-xl">
              Enter initial and final percentage figures above to calculate percentage points, basis points, and relative change.
            </div>
          )
        }
      />
    );
  }

  if (toolSlug === 'ratio-proportion-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Ratio & Proportion Calculator"
        onReset={() => {
          setRpA('');
          setRpB('');
          setPropA('');
          setPropB('');
          setPropC('');
          setPropD('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="flex border rounded-lg p-1 bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setRpMode('simplify')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  rpMode === 'simplify'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Simplify Ratio (A : B)
              </button>
              <button
                type="button"
                onClick={() => setRpMode('proportion')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  rpMode === 'proportion'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Solve Proportion (A / B = C / D)
              </button>
            </div>

            {rpMode === 'simplify' ? (
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Term A
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 1920"
                    value={rpA}
                    onChange={(e) => setRpA(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Term B
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 1080"
                    value={rpB}
                    onChange={(e) => setRpB(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs text-slate-500">
                  Enter 3 known values to solve for the missing 4th variable, or enter all 4 to test equality:
                </div>
                <div className="grid grid-cols-2 gap-4 items-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-center text-slate-500">Left Ratio (A / B)</div>
                    <input
                      type="number"
                      placeholder="A (Numerator)"
                      value={propA}
                      onChange={(e) => setPropA(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded text-xs text-center dark:bg-slate-800"
                    />
                    <div className="border-t border-slate-300 dark:border-slate-600 my-1"></div>
                    <input
                      type="number"
                      placeholder="B (Denominator)"
                      value={propB}
                      onChange={(e) => setPropB(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded text-xs text-center dark:bg-slate-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-center text-slate-500">Right Ratio (C / D)</div>
                    <input
                      type="number"
                      placeholder="C (Numerator)"
                      value={propC}
                      onChange={(e) => setPropC(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded text-xs text-center dark:bg-slate-800"
                    />
                    <div className="border-t border-slate-300 dark:border-slate-600 my-1"></div>
                    <input
                      type="number"
                      placeholder="D (Denominator)"
                      value={propD}
                      onChange={(e) => setPropD(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border rounded text-xs text-center dark:bg-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        }
        results={
          rpMode === 'simplify' ? (
            ratioSimplifyResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Simplified Ratio
                  </span>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                    {ratioSimplifyResult.ratioString}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Greatest Common Divisor (GCD): {ratioSimplifyResult.scalingFactor}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">Fraction</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {ratioSimplifyResult.fractionString}
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">Decimal (A ÷ B)</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {ratioSimplifyResult.decimalValue}
                    </div>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                    <div className="text-slate-500">Percentage</div>
                    <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {ratioSimplifyResult.percentageValue}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm border border-dashed rounded-xl">
                Enter positive numbers for terms A and B to simplify the ratio.
              </div>
            )
          ) : proportionResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {proportionResult.solvedVariable === 'All'
                    ? 'Proportion Equality Check'
                    : `Solved Variable: ${proportionResult.solvedVariable}`}
                </span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">
                  {proportionResult.solvedVariable === 'All'
                    ? proportionResult.isEqual
                      ? '✓ Proportional (True)'
                      : '✗ Not Proportional (False)'
                    : `${proportionResult.solvedVariable} = ${proportionResult.solvedValue}`}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Formula: {proportionResult.formulaUsed}
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border space-y-1.5 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Calculation Steps:</div>
                {proportionResult.stepExplanation.map((step, idx) => (
                  <div key={idx} className="text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-blue-500 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm border border-dashed rounded-xl">
              Enter any 3 values to solve for the missing term, or all 4 to verify proportion balance.
            </div>
          )
        }
      />
    );
  }

  if (toolSlug === 'time-zone-converter') {
    return (
      <CompactCalculatorWorkspace
        title="Time Zone Converter"
        onReset={() => {
          setTzDate(new Date().toISOString().split('T')[0]);
          setTzTime('12:00');
          setTzFrom('America/New_York');
          setTzTo('Europe/London');
        }}
        inputs={
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={tzDate}
                  onChange={(e) => setTzDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={tzTime}
                  onChange={(e) => setTzTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  From Time Zone
                </label>
                <select
                  value={tzFrom}
                  onChange={(e) => setTzFrom(e.target.value)}
                  className="w-full px-2.5 py-2 border rounded-lg text-xs dark:bg-slate-800"
                >
                  {COMMON_TIME_ZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  To Time Zone
                </label>
                <select
                  value={tzTo}
                  onChange={(e) => setTzTo(e.target.value)}
                  className="w-full px-2.5 py-2 border rounded-lg text-xs dark:bg-slate-800"
                >
                  {COMMON_TIME_ZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const now = new Date();
                setTzDate(now.toISOString().split('T')[0]);
                setTzTime(
                  `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
                );
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              🕒 Set to current date & time
            </button>
          </div>
        }
        results={
          timeZoneResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    Converted Destination Time
                  </span>
                  {timeZoneResult.dayRollover !== 'same-day' && (
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        timeZoneResult.dayRollover === 'next-day'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300'
                      }`}
                    >
                      {timeZoneResult.dayRollover === 'next-day' ? '+1 Day Ahead' : '-1 Day Prior'}
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {timeZoneResult.toFormatted}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {timeZoneResult.offsetDescription}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Origin Time ({tzFrom})</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                    {timeZoneResult.fromFormatted}
                  </div>
                  <div className="text-[10px] text-slate-400">24h format: {timeZoneResult.fromTime24}</div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">UTC Reference Timestamp</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono text-[11px]">
                    {timeZoneResult.utcString}
                  </div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'percentage-difference-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Percentage Difference Calculator"
        onReset={() => { setPdV1(120); setPdV2(150); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Value A</label>
                <input type="number" value={pdV1} onChange={(e) => setPdV1(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Value B</label>
                <input type="number" value={pdV2} onChange={(e) => setPdV2(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          pdResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Percentage Difference</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{pdResult.percentageDifference}%</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Average value: {pdResult.average}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Absolute Difference |A - B|</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{pdResult.absoluteDifference}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'z-score-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Z-Score Standard Score Calculator"
        onReset={() => { setZsVal(85); setZsMean(70); setZsSd(10); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Raw Value (x)</label>
              <input type="number" value={zsVal} onChange={(e) => setZsVal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Mean (μ)</label>
                <input type="number" value={zsMean} onChange={(e) => setZsMean(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Standard Dev (σ)</label>
                <input type="number" value={zsSd} onChange={(e) => setZsSd(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          zScoreResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Standard Z-Score</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{zScoreResult.zScore}</div>
                <div className="text-xs text-slate-500 mt-1">z = (x - μ) / σ</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'standard-error-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Standard Error of the Mean (SEM) Calculator"
        onReset={() => { setSeSd(15); setSeN(100); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Sample Std Dev (s)</label>
                <input type="number" value={seSd} onChange={(e) => setSeSd(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Sample Size (n)</label>
                <input type="number" value={seN} onChange={(e) => setSeN(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          seResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Standard Error (SE)</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{seResult.standardError}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">SE = s / √n</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'probability-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Probability Calculator"
        onReset={() => { setPbA(0.4); setPbB(0.25); setPbIndep(true); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">P(A) [0 to 1]</label>
                <input type="number" step="0.01" min="0" max="1" value={pbA} onChange={(e) => setPbA(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">P(B) [0 to 1]</label>
                <input type="number" step="0.01" min="0" max="1" value={pbB} onChange={(e) => setPbB(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="p_ind" checked={pbIndep} onChange={(e) => setPbIndep(e.target.checked)} className="rounded" />
              <label htmlFor="p_ind" className="text-xs text-slate-600 dark:text-slate-300">Events are independent</label>
            </div>
          </div>
        }
        results={
          probResult ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border">
                <div className="text-slate-500">P(A and B)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{probResult.pAAndB}</div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border">
                <div className="text-slate-500">P(A or B)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{probResult.pAOrB}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <div className="text-slate-500">P(not A)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{probResult.pNotA}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <div className="text-slate-500">P(not B)</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">{probResult.pNotB}</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'permutation-combination-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Permutations (nPr) & Combinations (nCr) Calculator"
        onReset={() => { setPcN(10); setPcR(4); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Total Items (n)</label>
                <input type="number" value={pcN} onChange={(e) => setPcN(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Subset Size (r)</label>
                <input type="number" value={pcR} onChange={(e) => setPcR(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          pcResult ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Combinations (nCr)</span>
                <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1">{pcResult.combinationsNCr.toLocaleString()}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Order does NOT matter</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase">Permutations (nPr)</span>
                <div className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{pcResult.permutationsNPr.toLocaleString()}</div>
                <div className="text-slate-500 text-[10px] mt-0.5">Order DOES matter</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'prime-number-checker') {
    return (
      <CompactCalculatorWorkspace
        title="Prime Number Identifier & Factorization"
        onReset={() => { setPnNum(97); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Enter Positive Integer</label>
              <input type="number" value={pnNum} onChange={(e) => setPnNum(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          primeResult ? (
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${
                primeResult.isPrime ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
              }`}>
                <span className="text-xs font-semibold uppercase tracking-wider">{pnNum} is</span>
                <div className="text-3xl font-bold mt-1">{primeResult.isPrime ? 'A Prime Number' : 'A Composite Number'}</div>
                <div className="text-xs mt-1 text-slate-500">Next Prime: {primeResult.nextPrime}</div>
              </div>
              <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border text-xs">
                <div className="text-slate-500">Divisors / Factors:</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5">{primeResult.divisors.join(', ')}</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'logarithm-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Logarithm (Log & Ln) Calculator"
        onReset={() => { setLgVal(1000); setLgBase(10); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Number (x)</label>
                <input type="number" value={lgVal} onChange={(e) => setLgVal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Base (b)</label>
                <input type="number" value={lgBase} onChange={(e) => setLgBase(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          logResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Log_{lgBase}({lgVal})</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{logResult.logBaseResult}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Natural Log ln(x)</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{logResult.naturalLog}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Common Log log10(x)</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{logResult.log10}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'exponent-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Exponent & Power Calculator"
        onReset={() => { setExBase(2); setExPwr(8); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Base</label>
                <input type="number" value={exBase} onChange={(e) => setExBase(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Exponent</label>
                <input type="number" value={exPwr} onChange={(e) => setExPwr(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          expResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">{exBase}^{exPwr}</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{expResult.result.toLocaleString()}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Scientific: {expResult.scientificNotation}</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'date-add-subtract-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Date Add / Subtract Calculator"
        onReset={() => {
          setDaStart(new Date().toISOString().split('T')[0]);
          setDaDays('');
          setDaWeeks('');
          setDaMonths('');
          setDaYears('');
          setDaOp('add');
        }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Starting Date</label>
              <input type="date" value={daStart} onChange={(e) => setDaStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 text-sm" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Operation</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDaOp('add')}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    daOp === 'add'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-white'
                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  ➕ Add Time (+)
                </button>
                <button
                  type="button"
                  onClick={() => setDaOp('subtract')}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    daOp === 'subtract'
                      ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-900/40 dark:border-amber-700 dark:text-white'
                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  ➖ Subtract Time (-)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Years</label>
                <input type="number" placeholder="0" value={daYears} onChange={(e) => setDaYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Months</label>
                <input type="number" placeholder="0" value={daMonths} onChange={(e) => setDaMonths(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Weeks</label>
                <input type="number" placeholder="0" value={daWeeks} onChange={(e) => setDaWeeks(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Days</label>
                <input type="number" placeholder="0" value={daDays} onChange={(e) => setDaDays(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          dateAddResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Resulting Target Date</span>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900 dark:text-white mt-1">{dateAddResult.resultingDate}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">{dateAddResult.dayOfWeek} (Total {dateAddResult.totalElapsedDays} elapsed calendar days)</div>
              </div>

              {dateAddResult.wasClamped && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300">
                  ⚠️ {dateAddResult.clampedNotice}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm border border-dashed rounded-xl">
              Enter years, months, weeks, or days above to compute the resulting calendar date.
            </div>
          )
        }
      />
    );
  }

  if (toolSlug === 'business-days-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Business Days Between Dates Calculator"
        onReset={() => {
          setBdStart(new Date().toISOString().split('T')[0]);
          setBdEnd(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
        }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
              <input type="date" value={bdStart} onChange={(e) => setBdStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">End Date</label>
              <input type="date" value={bdEnd} onChange={(e) => setBdEnd(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          businessDaysResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Working Business Days</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{businessDaysResult.businessDays} Days</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Excludes {businessDaysResult.weekendDays} weekend days</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Total Calendar Days</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{businessDaysResult.totalCalendarDays} Days</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'working-days-add-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Add Working Business Days Calculator"
        onReset={() => { setWdStart(new Date().toISOString().split('T')[0]); setWdDays(15); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Start Date</label>
              <input type="date" value={wdStart} onChange={(e) => setWdStart(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Business Days to Add</label>
              <input type="number" value={wdDays} onChange={(e) => setWdDays(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          workingDaysAddResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Target Completion Date</span>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{workingDaysAddResult.resultingDate}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{workingDaysAddResult.dayOfWeek}</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'time-duration-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Time Duration & Hours Elapsed Calculator"
        onReset={() => { setTdStart('08:30'); setTdEnd('17:15'); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Start Time</label>
                <input type="time" value={tdStart} onChange={(e) => setTdStart(e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">End Time</label>
                <input type="time" value={tdEnd} onChange={(e) => setTdEnd(e.target.value)} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          timeDurationResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Time Elapsed</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{timeDurationResult.hours}h {timeDurationResult.minutes}m</div>
                <div className="text-xs text-slate-500 mt-1">{timeDurationResult.totalHoursDecimal} decimal hours</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'unix-timestamp-converter') {
    return (
      <CompactCalculatorWorkspace
        title="Unix Epoch Timestamp Converter"
        onReset={() => { setUxTs(Math.floor(Date.now() / 1000)); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Unix Timestamp (Seconds or ms)</label>
              <input type="number" value={uxTs} onChange={(e) => setUxTs(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          unixResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                <span className="text-xs font-semibold text-slate-500 uppercase">UTC Date Time</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-1">{unixResult.utcString}</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Local Date & Time</span>
                <div className="text-base font-bold text-blue-900 dark:text-white mt-1">{unixResult.localDateString} {unixResult.localTimeString}</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'week-number-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="ISO Week Number Calculator"
        onReset={() => { setWnDate(new Date().toISOString().split('T')[0]); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Select Date</label>
              <input type="date" value={wnDate} onChange={(e) => setWnDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          weekNumberResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Calendar Week</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">Week {weekNumberResult.isoWeekNumber}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Year {weekNumberResult.year}</div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / Days Until Date
  return (
    <CompactCalculatorWorkspace
      title="Days Until Date Countdown Calculator"
      onReset={() => { setDuDate(new Date(Date.now() + 100 * 86400000).toISOString().split('T')[0]); }}
      inputs={
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Date</label>
            <input type="date" value={duDate} onChange={(e) => setDuDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
          </div>
        </div>
      }
      results={
        daysUntilResult ? (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Countdown</span>
            <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{daysUntilResult.totalDays} Days</div>
            <div className="text-xs text-slate-500 mt-1">{daysUntilResult.weeksRemaining} weeks remaining</div>
          </div>
        ) : null
      }
    />
  );
};
