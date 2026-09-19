import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { CurrencyInput } from '../../common/CurrencyInput';
import { TermInput } from '../../common/TermInput';
import {
  calculateDebtPayoff,
  calculateSnowballVsAvalanche,
  calculateCreditCardInterest,
  calculatePortfolioRebalancing,
  calculate401k,
  calculateRothIRA,
  calculateHSA,
  DebtItem,
  PortfolioRebalancingAsset,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const DEBT_RETIREMENT_SLUGS = [
  'debt-payoff-calculator',
  'debt-snowball-avalanche-calculator',
  'credit-card-payoff-calculator',
  'credit-card-interest-calculator',
  'portfolio-rebalancing-calculator',
  '401k-calculator',
  'roth-ira-calculator',
  'hsa-calculator',
];

export const DebtAndRetirementViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Debt Payoff & Credit Card Payoff
  const [dpBal, setDpBal] = useSessionState<number | ''>('dp_bal', 10000);
  const [dpRate, setDpRate] = useSessionState<number | ''>('dp_rate', 18);
  const [dpPay, setDpPay] = useSessionState<number | ''>('dp_pay', 300);
  const [dpExtra, setDpExtra] = useSessionState<number | ''>('dp_extra', 50);

  const debtPayoffResult = useMemo(() => {
    if (typeof dpBal !== 'number' || typeof dpRate !== 'number' || typeof dpPay !== 'number') return null;
    return calculateDebtPayoff({
      balance: dpBal,
      annualInterestRate: dpRate,
      monthlyPayment: dpPay,
      extraMonthlyPayment: typeof dpExtra === 'number' ? dpExtra : 0,
    });
  }, [dpBal, dpRate, dpPay, dpExtra]);

  // 2. Snowball vs Avalanche
  const [d1Bal, setD1Bal] = useSessionState<number | ''>('sa_d1_bal', 2500);
  const [d1Rate, setD1Rate] = useSessionState<number | ''>('sa_d1_rate', 22);
  const [d1Min, setD1Min] = useSessionState<number | ''>('sa_d1_min', 75);

  const [d2Bal, setD2Bal] = useSessionState<number | ''>('sa_d2_bal', 8000);
  const [d2Rate, setD2Rate] = useSessionState<number | ''>('sa_d2_rate', 15);
  const [d2Min, setD2Min] = useSessionState<number | ''>('sa_d2_min', 180);

  const [saExtra, setSaExtra] = useSessionState<number | ''>('sa_extra', 100);

  const snowballResult = useMemo(() => {
    const debts: DebtItem[] = [];
    if (typeof d1Bal === 'number' && typeof d1Min === 'number') {
      debts.push({ id: '1', name: 'Credit Card A', balance: d1Bal, annualInterestRate: typeof d1Rate === 'number' ? d1Rate : 0, minimumPayment: d1Min });
    }
    if (typeof d2Bal === 'number' && typeof d2Min === 'number') {
      debts.push({ id: '2', name: 'Personal Loan B', balance: d2Bal, annualInterestRate: typeof d2Rate === 'number' ? d2Rate : 0, minimumPayment: d2Min });
    }
    if (debts.length === 0) return null;
    return calculateSnowballVsAvalanche(debts, typeof saExtra === 'number' ? saExtra : 0);
  }, [d1Bal, d1Rate, d1Min, d2Bal, d2Rate, d2Min, saExtra]);

  // 3. Credit Card Interest
  const [cciBal, setCciBal] = useSessionState<number | ''>('cci_bal', 5000);
  const [cciApr, setCciApr] = useSessionState<number | ''>('cci_apr', 24);
  const [cciDays, setCciDays] = useSessionState<number | ''>('cci_days', 30);

  const ccInterestResult = useMemo(() => {
    if (typeof cciBal !== 'number' || typeof cciApr !== 'number') return null;
    return calculateCreditCardInterest({
      balance: cciBal,
      apr: cciApr,
      daysInCycle: typeof cciDays === 'number' ? cciDays : 30,
    });
  }, [cciBal, cciApr, cciDays]);

  // 4. Portfolio Rebalancing
  const [prStk, setPrStk] = useSessionState<number | ''>('pr_stk', 70000);
  const [prStkTgt, setPrStkTgt] = useSessionState<number | ''>('pr_stk_tgt', 60);
  const [prBnd, setPrBnd] = useSessionState<number | ''>('pr_bnd', 20000);
  const [prBndTgt, setPrBndTgt] = useSessionState<number | ''>('pr_bnd_tgt', 30);
  const [prCsh, setPrCsh] = useSessionState<number | ''>('pr_csh', 10000);
  const [prCshTgt, setPrCshTgt] = useSessionState<number | ''>('pr_csh_tgt', 10);

  const rebalanceResult = useMemo(() => {
    const assets: PortfolioRebalancingAsset[] = [
      { id: '1', name: 'Equities / Stocks', currentValue: typeof prStk === 'number' ? prStk : 0, targetPercent: typeof prStkTgt === 'number' ? prStkTgt : 0 },
      { id: '2', name: 'Bonds / Fixed Income', currentValue: typeof prBnd === 'number' ? prBnd : 0, targetPercent: typeof prBndTgt === 'number' ? prBndTgt : 0 },
      { id: '3', name: 'Cash / Money Market', currentValue: typeof prCsh === 'number' ? prCsh : 0, targetPercent: typeof prCshTgt === 'number' ? prCshTgt : 0 },
    ];
    return calculatePortfolioRebalancing(assets);
  }, [prStk, prStkTgt, prBnd, prBndTgt, prCsh, prCshTgt]);

  // 5. 401(k)
  const [fkBal, setFkBal] = useSessionState<number | ''>('fk_bal', 25000);
  const [fkSal, setFkSal] = useSessionState<number | ''>('fk_sal', 85000);
  const [fkCont, setFkCont] = useSessionState<number | ''>('fk_cont', 8);
  const [fkMatch, setFkMatch] = useSessionState<number | ''>('fk_match', 50);
  const [fkCap, setFkCap] = useSessionState<number | ''>('fk_cap', 6);
  const [fkRet, setFkRet] = useSessionState<number | ''>('fk_ret', 7);
  const [fkYrs, setFkYrs] = useSessionState<number | ''>('fk_yrs', 25);

  const fourZeroOneKResult = useMemo(() => {
    if (typeof fkSal !== 'number' || typeof fkYrs !== 'number') return null;
    return calculate401k({
      currentBalance: typeof fkBal === 'number' ? fkBal : 0,
      annualSalary: fkSal,
      employeeContributionPercent: typeof fkCont === 'number' ? fkCont : 0,
      employerMatchPercent: typeof fkMatch === 'number' ? fkMatch : 0,
      employerMatchCapPercent: typeof fkCap === 'number' ? fkCap : 0,
      annualReturnRate: typeof fkRet === 'number' ? fkRet : 0,
      yearsToRetire: fkYrs,
    });
  }, [fkBal, fkSal, fkCont, fkMatch, fkCap, fkRet, fkYrs]);

  // 6. Roth IRA
  const [riBal, setRiBal] = useSessionState<number | ''>('ri_bal', 10000);
  const [riCont, setRiCont] = useSessionState<number | ''>('ri_cont', 7000);
  const [riRet, setRiRet] = useSessionState<number | ''>('ri_ret', 8);
  const [riYrs, setRiYrs] = useSessionState<number | ''>('ri_yrs', 20);

  const rothIraResult = useMemo(() => {
    if (typeof riYrs !== 'number') return null;
    return calculateRothIRA({
      currentBalance: typeof riBal === 'number' ? riBal : 0,
      annualContribution: typeof riCont === 'number' ? riCont : 0,
      annualReturnRate: typeof riRet === 'number' ? riRet : 0,
      years: riYrs,
    });
  }, [riBal, riCont, riRet, riYrs]);

  // 7. HSA
  const [hsaBal, setHsaBal] = useSessionState<number | ''>('hsa_bal', 3000);
  const [hsaCont, setHsaCont] = useSessionState<number | ''>('hsa_cont', 3500);
  const [hsaEmp, setHsaEmp] = useSessionState<number | ''>('hsa_emp', 500);
  const [hsaRet, setHsaRet] = useSessionState<number | ''>('hsa_ret', 7);
  const [hsaYrs, setHsaYrs] = useSessionState<number | ''>('hsa_yrs', 15);

  const hsaResult = useMemo(() => {
    if (typeof hsaYrs !== 'number') return null;
    return calculateHSA({
      currentBalance: typeof hsaBal === 'number' ? hsaBal : 0,
      annualContribution: typeof hsaCont === 'number' ? hsaCont : 0,
      employerContribution: typeof hsaEmp === 'number' ? hsaEmp : 0,
      annualReturnRate: typeof hsaRet === 'number' ? hsaRet : 0,
      years: hsaYrs,
    });
  }, [hsaBal, hsaCont, hsaEmp, hsaRet, hsaYrs]);

  // RENDER PER SLUG
  if (toolSlug === 'debt-payoff-calculator' || toolSlug === 'credit-card-payoff-calculator') {
    return (
      <CompactCalculatorWorkspace
        title={toolSlug === 'debt-payoff-calculator' ? 'Debt Payoff Calculator' : 'Credit Card Payoff Calculator'}
        onReset={() => {
          setDpBal(10000);
          setDpRate(18);
          setDpPay(300);
          setDpExtra(50);
        }}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Outstanding Balance ({currencySymbol})
              </label>
              <input
                type="number"
                value={dpBal}
                onChange={(e) => setDpBal(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g. 10000"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Annual Interest Rate (%)
                </label>
                <input
                  type="number"
                  value={dpRate}
                  onChange={(e) => setDpRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. 18"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Regular Payment ({currencySymbol}/mo)
                </label>
                <input
                  type="number"
                  value={dpPay}
                  onChange={(e) => setDpPay(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. 300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Extra Monthly Payment ({currencySymbol})
              </label>
              <input
                type="number"
                value={dpExtra}
                onChange={(e) => setDpExtra(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white"
                placeholder="e.g. 50"
              />
              <span className="text-xs text-slate-500">Accelerate your payoff date by adding surplus monthly funds.</span>
            </div>
          </div>
        }
        results={
          debtPayoffResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Debt-Free Timeline
                </span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {debtPayoffResult.monthsToPayoff} Months ({debtPayoffResult.yearsToPayoff} yrs)
                </div>
                {debtPayoffResult.monthsSavedWithExtra > 0 && (
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    🚀 Extra payments cut your payoff time by {debtPayoffResult.monthsSavedWithExtra} months!
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Total Interest Paid</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {formatMoney(debtPayoffResult.totalInterestPaid)}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500">Total Amount Paid</span>
                  <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {formatMoney(debtPayoffResult.totalAmountPaid)}
                  </div>
                </div>
              </div>
              {debtPayoffResult.interestSavedWithExtra > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 text-sm">
                  💡 <strong>Interest Saved:</strong> {formatMoney(debtPayoffResult.interestSavedWithExtra)} kept in your pocket.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Enter balance and payment to view timeline</div>
          )
        }
      />
    );
  }

  if (toolSlug === 'debt-snowball-avalanche-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Debt Snowball vs Avalanche Strategy Comparison"
        onReset={() => {
          setD1Bal(2500); setD1Rate(22); setD1Min(75);
          setD2Bal(8000); setD2Rate(15); setD2Min(180);
          setSaExtra(100);
        }}
        inputs={
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">Debt 1 (e.g. Credit Card)</h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={d1Bal}
                  onChange={(e) => setD1Bal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="Balance"
                />
                <input
                  type="number"
                  value={d1Rate}
                  onChange={(e) => setD1Rate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="APR %"
                />
                <input
                  type="number"
                  value={d1Min}
                  onChange={(e) => setD1Min(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="Min Pmt"
                />
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase">Debt 2 (e.g. Loan)</h4>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={d2Bal}
                  onChange={(e) => setD2Bal(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="Balance"
                />
                <input
                  type="number"
                  value={d2Rate}
                  onChange={(e) => setD2Rate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="APR %"
                />
                <input
                  type="number"
                  value={d2Min}
                  onChange={(e) => setD2Min(e.target.value === '' ? '' : Number(e.target.value))}
                  className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900"
                  placeholder="Min Pmt"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Extra Monthly Accelerated Budget ({currencySymbol})
              </label>
              <input
                type="number"
                value={saExtra}
                onChange={(e) => setSaExtra(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                placeholder="e.g. 100"
              />
            </div>
          </div>
        }
        results={
          snowballResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase">Snowball Method</span>
                  <div className="text-xl font-bold text-blue-900 dark:text-white mt-1">{snowballResult.snowballMonths} Months</div>
                  <div className="text-xs text-slate-500 mt-1">Interest: {formatMoney(snowballResult.snowballTotalInterest)}</div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase">Avalanche Method</span>
                  <div className="text-xl font-bold text-emerald-900 dark:text-white mt-1">{snowballResult.avalancheMonths} Months</div>
                  <div className="text-xs text-slate-500 mt-1">Interest: {formatMoney(snowballResult.avalancheTotalInterest)}</div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 text-xs text-amber-900 dark:text-amber-300">
                <strong>Recommendation:</strong> {snowballResult.recommendedStrategy} saves{' '}
                {formatMoney(snowballResult.interestDifference)} in interest charges.
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">Configure debts to compare strategies</div>
          )
        }
      />
    );
  }

  if (toolSlug === 'credit-card-interest-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Credit Card Interest & Finance Charge Calculator"
        onReset={() => { setCciBal(5000); setCciApr(24); setCciDays(30); }}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Card Balance ({currencySymbol})</label>
              <input
                type="number"
                value={cciBal}
                onChange={(e) => setCciBal(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Annual APR (%)</label>
                <input
                  type="number"
                  value={cciApr}
                  onChange={(e) => setCciApr(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Billing Cycle Days</label>
                <input
                  type="number"
                  value={cciDays}
                  onChange={(e) => setCciDays(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            </div>
          </div>
        }
        results={
          ccInterestResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
                <span className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase">Monthly Finance Charge</span>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{formatMoney(ccInterestResult.monthlyInterestCharge)}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                  <span className="text-xs text-slate-500">Daily Periodic Rate</span>
                  <div className="text-base font-bold text-slate-800 dark:text-white">{ccInterestResult.dailyPeriodicRate}% / day</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border">
                  <span className="text-xs text-slate-500">Effective Annual Rate</span>
                  <div className="text-base font-bold text-slate-800 dark:text-white">{ccInterestResult.effectiveAnnualPercentageRate}% EAR</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'portfolio-rebalancing-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Portfolio Asset Rebalancing Calculator"
        onReset={() => {
          setPrStk(70000); setPrStkTgt(60);
          setPrBnd(20000); setPrBndTgt(30);
          setPrCsh(10000); setPrCshTgt(10);
        }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-500 uppercase">
              <span>Asset Class</span>
              <span>Current Value</span>
              <span>Target %</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs font-medium self-center text-slate-700 dark:text-slate-300">Equities / Stocks</span>
              <input type="number" value={prStk} onChange={(e) => setPrStk(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              <input type="number" value={prStkTgt} onChange={(e) => setPrStkTgt(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs font-medium self-center text-slate-700 dark:text-slate-300">Bonds / Debt</span>
              <input type="number" value={prBnd} onChange={(e) => setPrBnd(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              <input type="number" value={prBndTgt} onChange={(e) => setPrBndTgt(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-xs font-medium self-center text-slate-700 dark:text-slate-300">Cash / Liquid</span>
              <input type="number" value={prCsh} onChange={(e) => setPrCsh(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              <input type="number" value={prCshTgt} onChange={(e) => setPrCshTgt(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          rebalanceResult ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Total Portfolio Value</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white">{formatMoney(rebalanceResult.totalPortfolioValue)}</span>
              </div>
              <div className="space-y-2">
                {rebalanceResult.rebalanceItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white dark:bg-slate-800 rounded-lg border flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-white">{item.name}</div>
                      <div className="text-slate-500">Current: {item.currentPercent}% (Target: {item.targetPercent}%)</div>
                    </div>
                    <div>
                      <span className={`px-2 py-1 rounded font-bold ${
                        item.action === 'BUY' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                        item.action === 'SELL' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.action} {formatMoney(item.actionAmount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === '401k-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="401k-calculator"
        title="401(k) Retirement Growth & Match Calculator"
        description="Project your retirement savings growth with employer matching contributions in your choice of global currency."
        onReset={() => {
          setFkBal(25000); setFkSal(85000); setFkCont(8);
          setFkMatch(50); setFkCap(6); setFkRet(7); setFkYrs(25);
        }}
        calculationData={
          fourZeroOneKResult ? {
            toolSlug: '401k-calculator',
            toolTitle: '401(k) Retirement Growth & Match Calculator',
            categorySlug: 'finance',
            inputs: [
              { label: 'Current Balance', value: formatMoney(typeof fkBal === 'number' ? fkBal : 0) },
              { label: 'Annual Salary', value: formatMoney(typeof fkSal === 'number' ? fkSal : 0) },
              { label: 'Your Contribution', value: `${fkCont}%` },
              { label: 'Employer Match', value: `${fkMatch}% up to ${fkCap}% salary` },
              { label: 'Expected Return', value: `${fkRet}% p.a.` },
              { label: 'Years to Retirement', value: `${fkYrs} Years` },
            ],
            outputs: [
              { label: 'Projected 401(k) Balance', value: formatMoney(fourZeroOneKResult.projectedEndingBalance), isHighlight: true },
              { label: 'Total Employee Contribution', value: formatMoney(fourZeroOneKResult.totalEmployeeContributions) },
              { label: 'Total Employer Match', value: formatMoney(fourZeroOneKResult.totalEmployerContributions) },
              { label: 'Compound Investment Gains', value: formatMoney(fourZeroOneKResult.totalInvestmentGrowth) },
            ],
          } : null
        }
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="401k-current-bal"
                label="Current Balance"
                value={fkBal}
                onChange={(val) => setFkBal(val)}
                placeholder="e.g. 25,000"
              />
              <CurrencyInput
                id="401k-annual-salary"
                label="Annual Salary"
                value={fkSal}
                onChange={(val) => setFkSal(val)}
                placeholder="e.g. 85,000"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Your Contrib %</label>
                <input type="number" value={fkCont} onChange={(e) => setFkCont(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 8" className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Match Rate %</label>
                <input type="number" value={fkMatch} onChange={(e) => setFkMatch(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 50" className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Match Cap %</label>
                <input type="number" value={fkCap} onChange={(e) => setFkCap(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 6" className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Annual Return (%)</label>
                <input type="number" value={fkRet} onChange={(e) => setFkRet(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 7" className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Years to Retire</label>
                <input type="number" value={fkYrs} onChange={(e) => setFkYrs(e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g. 25" className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          fourZeroOneKResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Projected 401(k) Balance</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(fourZeroOneKResult.projectedEndingBalance)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500">Your Contributions</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formatMoney(fourZeroOneKResult.totalEmployeeContributions)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="text-slate-500">Employer Match Total</div>
                  <div className="font-bold text-slate-900 dark:text-white mt-0.5">{formatMoney(fourZeroOneKResult.totalEmployerContributions)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 col-span-2">
                  <div className="text-slate-500">Compound Investment Growth</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{formatMoney(fourZeroOneKResult.totalInvestmentGrowth)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'roth-ira-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Roth IRA Tax-Free Retirement Growth"
        onReset={() => { setRiBal(10000); setRiCont(7000); setRiRet(8); setRiYrs(20); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Current Balance ({currencySymbol})</label>
              <input type="number" value={riBal} onChange={(e) => setRiBal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Annual Contribution ({currencySymbol})</label>
              <input type="number" value={riCont} onChange={(e) => setRiCont(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Expected Return (%)</label>
                <input type="number" value={riRet} onChange={(e) => setRiRet(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Years to Invest</label>
                <input type="number" value={riYrs} onChange={(e) => setRiYrs(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          rothIraResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Tax-Free Retirement Corpus</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(rothIraResult.projectedCorpus)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Your Contributions</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(rothIraResult.totalContributions)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Tax-Free Earnings</div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(rothIraResult.taxFreeGrowth)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / HSA
  return (
    <CompactCalculatorWorkspace
      title="HSA (Health Savings Account) Growth Calculator"
      onReset={() => { setHsaBal(3000); setHsaCont(3500); setHsaEmp(500); setHsaRet(7); setHsaYrs(15); }}
      inputs={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Current HSA Balance ({currencySymbol})</label>
              <input type="number" value={hsaBal} onChange={(e) => setHsaBal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Your Contribution ({currencySymbol}/yr)</label>
              <input type="number" value={hsaCont} onChange={(e) => setHsaCont(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Employer Contrib</label>
              <input type="number" value={hsaEmp} onChange={(e) => setHsaEmp(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Annual Return %</label>
              <input type="number" value={hsaRet} onChange={(e) => setHsaRet(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Years to Grow</label>
              <input type="number" value={hsaYrs} onChange={(e) => setHsaYrs(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
          </div>
        </div>
      }
      results={
        hsaResult ? (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Projected HSA Balance</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(hsaResult.projectedBalance)}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <div className="text-slate-500">Total Contributed</div>
                <div className="font-bold text-slate-900 dark:text-white">{formatMoney(hsaResult.totalContributions)}</div>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                <div className="text-slate-500">Triple-Tax-Free Gains</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400">{formatMoney(hsaResult.taxFreeInvestmentEarnings)}</div>
              </div>
            </div>
          </div>
        ) : null
      }
    />
  );
};
