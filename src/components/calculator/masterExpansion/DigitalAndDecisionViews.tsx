import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import {
  calculateCurrencyExchangeFee,
  calculateDataTransferTime,
  calculatePasswordEntropy,
  calculateUnitPriceComparison,
  calculateLeaseVsBuy,
  calculateCarLoanVsCash,
  calculatePayDebtVsInvest,
  calculateEmergencyFundVsDebt,
  calculateBreakevenInvestmentReturn,
  calculateScenarioComparison,
  calculateSensitivityAnalysis,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const DIGITAL_DECISION_SLUGS = [
  'currency-exchange-fee-calculator',
  'data-transfer-time-calculator',
  'password-entropy-calculator',
  'unit-price-comparison-calculator',
  'lease-vs-buy-calculator',
  'car-loan-vs-cash-calculator',
  'pay-debt-vs-invest-calculator',
  'emergency-fund-vs-debt-calculator',
  'breakeven-investment-return-calculator',
  'scenario-comparison-calculator',
  'sensitivity-analysis-calculator',
];

export const DigitalAndDecisionViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Currency Exchange Fee
  const [ceAmt, setCeAmt] = useSessionState<number | ''>('ce_amt', 1000);
  const [ceMid, setCeMid] = useSessionState<number | ''>('ce_mid', 1.08);
  const [ceOff, setCeOff] = useSessionState<number | ''>('ce_off', 1.04);
  const [ceFlat, setCeFlat] = useSessionState<number | ''>('ce_flat', 5);

  const currencyFeeResult = useMemo(() => {
    if (typeof ceAmt !== 'number' || typeof ceMid !== 'number' || typeof ceOff !== 'number') return null;
    return calculateCurrencyExchangeFee(ceAmt, ceMid, ceOff, typeof ceFlat === 'number' ? ceFlat : 0);
  }, [ceAmt, ceMid, ceOff, ceFlat]);

  // 2. Data Transfer Time
  const [dtSize, setDtSize] = useSessionState<number | ''>('dt_sz', 25);
  const [dtSizeUnit, setDtSizeUnit] = useSessionState<'MB' | 'GB' | 'TB'>('dt_su', 'GB');
  const [dtSpd, setDtSpd] = useSessionState<number | ''>('dt_spd', 100);
  const [dtSpdUnit, setDtSpdUnit] = useSessionState<'Kbps' | 'Mbps' | 'Gbps'>('dt_spdu', 'Mbps');

  const dataTransferResult = useMemo(() => {
    if (typeof dtSize !== 'number' || typeof dtSpd !== 'number' || dtSize <= 0 || dtSpd <= 0) return null;
    const sizeMB = dtSizeUnit === 'TB' ? dtSize * 1024 * 1024 : dtSizeUnit === 'GB' ? dtSize * 1024 : dtSize;
    const speedMbps = dtSpdUnit === 'Gbps' ? dtSpd * 1000 : dtSpdUnit === 'Kbps' ? dtSpd / 1000 : dtSpd;
    const res = calculateDataTransferTime(sizeMB, speedMbps);
    if (!res) return null;
    const formatted = res.hours > 0 ? `${res.hours}h ${res.minutes}m ${res.seconds}s` : `${res.minutes}m ${res.seconds}s`;
    return { ...res, formatted };
  }, [dtSize, dtSizeUnit, dtSpd, dtSpdUnit]);

  // 3. Password Entropy
  const [pwVal, setPwVal] = useSessionState<string>('pw_val', 'CorrectHorseBatteryStaple99!');

  const passwordResult = useMemo(() => {
    if (!pwVal) return null;
    let charset = 0;
    if (/[a-z]/.test(pwVal)) charset += 26;
    if (/[A-Z]/.test(pwVal)) charset += 26;
    if (/[0-9]/.test(pwVal)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(pwVal)) charset += 33;
    if (charset === 0) charset = 26;

    const res = calculatePasswordEntropy(pwVal.length, charset);
    if (!res) return null;

    let crackTime = 'Instant';
    if (res.entropyBits >= 128) crackTime = 'Trillions of centuries';
    else if (res.entropyBits >= 80) crackTime = 'Thousands of centuries';
    else if (res.entropyBits >= 60) crackTime = 'Several months';
    else if (res.entropyBits >= 40) crackTime = 'A few hours / days';
    else crackTime = 'A few seconds';

    return { ...res, crackTime };
  }, [pwVal]);

  // 4. Unit Price Comparison
  const [upP1, setUpP1] = useSessionState<number | ''>('up_p1', 4.99);
  const [upQ1, setUpQ1] = useSessionState<number | ''>('up_q1', 16);
  const [upP2, setUpP2] = useSessionState<number | ''>('up_p2', 8.49);
  const [upQ2, setUpQ2] = useSessionState<number | ''>('up_q2', 32);

  const unitPriceResult = useMemo(() => {
    if (typeof upP1 !== 'number' || typeof upQ1 !== 'number' || typeof upP2 !== 'number' || typeof upQ2 !== 'number') return null;
    return calculateUnitPriceComparison(upP1, upQ1, upP2, upQ2);
  }, [upP1, upQ1, upP2, upQ2]);

  // 5. Lease vs Buy
  const [lbBuyPrice, setLbBuyPrice] = useSessionState<number | ''>('lb_buy_p', 25000);
  const [lbDown, setLbDown] = useSessionState<number | ''>('lb_down', 2000);
  const [lbLoanRate, setLbLoanRate] = useSessionState<number | ''>('lb_loan_rate', 6.5);
  const [lbMonths, setLbMonths] = useSessionState<number | ''>('lb_mos', 36);
  const [lbPmt, setLbPmt] = useSessionState<number | ''>('lb_pmt', 450);
  const [lbResale, setLbResale] = useSessionState<number | ''>('lb_resale', 8000);

  const leaseBuyResult = useMemo(() => {
    if (typeof lbBuyPrice !== 'number' || typeof lbPmt !== 'number' || typeof lbMonths !== 'number') return null;
    const down = typeof lbDown === 'number' ? lbDown : 0;
    const rate = typeof lbLoanRate === 'number' ? lbLoanRate : 6.0;
    const resale = typeof lbResale === 'number' ? lbResale : 0;
    return calculateLeaseVsBuy(lbBuyPrice, down, rate, lbMonths, lbPmt, lbMonths, resale);
  }, [lbBuyPrice, lbDown, lbLoanRate, lbMonths, lbPmt, lbResale]);

  // 6. Car Loan vs Cash
  const [clPrice, setClPrice] = useSessionState<number | ''>('cl_p', 30000);
  const [clRate, setClRate] = useSessionState<number | ''>('cl_rate', 5.5);
  const [clMonths, setClMonths] = useSessionState<number | ''>('cl_mos', 48);
  const [clInvRate, setClInvRate] = useSessionState<number | ''>('cl_inv', 7.0);

  const carLoanCashResult = useMemo(() => {
    if (typeof clPrice !== 'number' || typeof clRate !== 'number' || typeof clMonths !== 'number' || typeof clInvRate !== 'number') return null;
    return calculateCarLoanVsCash(clPrice, clRate, clMonths, clInvRate);
  }, [clPrice, clRate, clMonths, clInvRate]);

  // 7. Pay Debt vs Invest
  const [pdiDebtRate, setPdiDebtRate] = useSessionState<number | ''>('pdi_drate', 18);
  const [pdiInvRate, setPdiInvRate] = useSessionState<number | ''>('pdi_irate', 8);
  const [pdiAmt, setPdiAmt] = useSessionState<number | ''>('pdi_amt', 500);
  const [pdiYears, setPdiYears] = useSessionState<number | ''>('pdi_yrs', 5);

  const debtInvestResult = useMemo(() => {
    if (typeof pdiDebtRate !== 'number' || typeof pdiInvRate !== 'number' || typeof pdiAmt !== 'number' || typeof pdiYears !== 'number') return null;
    return calculatePayDebtVsInvest(pdiDebtRate, pdiInvRate, pdiAmt, pdiYears * 12);
  }, [pdiDebtRate, pdiInvRate, pdiAmt, pdiYears]);

  // 8. Emergency Fund vs Debt
  const [efdExp, setEfdExp] = useSessionState<number | ''>('efd_exp', 2500);
  const [efdTargetMos, setEfdTargetMos] = useSessionState<number | ''>('efd_tmos', 6);
  const [efdSavings, setEfdSavings] = useSessionState<number | ''>('efd_sav', 8000);
  const [efdDebtRate, setEfdDebtRate] = useSessionState<number | ''>('efd_drate', 22);
  const [efdSurplus, setEfdSurplus] = useSessionState<number | ''>('efd_surplus', 500);

  const emergDebtResult = useMemo(() => {
    if (typeof efdExp !== 'number' || typeof efdTargetMos !== 'number' || typeof efdSavings !== 'number' || typeof efdDebtRate !== 'number' || typeof efdSurplus !== 'number') return null;
    return calculateEmergencyFundVsDebt(efdExp, efdTargetMos, efdSavings, efdDebtRate, efdSurplus);
  }, [efdExp, efdTargetMos, efdSavings, efdDebtRate, efdSurplus]);

  // 9. Breakeven Investment Return
  const [biDebtRate, setBiDebtRate] = useSessionState<number | ''>('bi_drate', 10.0);
  const [biTax, setBiTax] = useSessionState<number | ''>('bi_tax', 20.0);

  const breakevenResult = useMemo(() => {
    if (typeof biDebtRate !== 'number') return null;
    const tax = typeof biTax === 'number' ? biTax : 0;
    return calculateBreakevenInvestmentReturn(biDebtRate, tax);
  }, [biDebtRate, biTax]);

  // 10. Scenario Comparison
  const [scAInit, setScAInit] = useSessionState<number | ''>('sc_a_init', 10000);
  const [scAMonthly, setScAMonthly] = useSessionState<number | ''>('sc_a_mo', 500);
  const [scARate, setScARate] = useSessionState<number | ''>('sc_a_r', 8.0);
  const [scBInit, setScBInit] = useSessionState<number | ''>('sc_b_init', 20000);
  const [scBMonthly, setScBMonthly] = useSessionState<number | ''>('sc_b_mo', 350);
  const [scBRate, setScBRate] = useSessionState<number | ''>('sc_b_r', 10.0);
  const [scYears, setScYears] = useSessionState<number | ''>('sc_yrs', 10);

  const scenarioResult = useMemo(() => {
    if (typeof scAInit !== 'number' || typeof scAMonthly !== 'number' || typeof scARate !== 'number' ||
        typeof scBInit !== 'number' || typeof scBMonthly !== 'number' || typeof scBRate !== 'number' ||
        typeof scYears !== 'number' || scYears <= 0) return null;
    return calculateScenarioComparison(scAInit, scAMonthly, scARate, scBInit, scBMonthly, scBRate, scYears);
  }, [scAInit, scAMonthly, scARate, scBInit, scBMonthly, scBRate, scYears]);

  // 11. Sensitivity Analysis
  const [saBase, setSaBase] = useSessionState<number | ''>('sa_base', 50000);
  const [saStep, setSaStep] = useSessionState<number | ''>('sa_step', 20);

  const sensitivityResult = useMemo(() => {
    if (typeof saBase !== 'number' || typeof saStep !== 'number') return null;
    return calculateSensitivityAnalysis(saBase, saStep);
  }, [saBase, saStep]);

  // RENDERING
  if (toolSlug === 'currency-exchange-fee-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Hidden Currency Exchange Markup & Fee Calculator"
        onReset={() => { setCeAmt(1000); setCeMid(1.08); setCeOff(1.04); setCeFlat(5); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Transfer Amount ({currencySymbol})</label>
              <input type="number" value={ceAmt} onChange={(e) => setCeAmt(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Real Mid-Market Rate</label>
                <input type="number" step="0.001" value={ceMid} onChange={(e) => setCeMid(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Offered Bank Rate</label>
                <input type="number" step="0.001" value={ceOff} onChange={(e) => setCeOff(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Upfront Transfer Fee ({currencySymbol})</label>
              <input type="number" value={ceFlat} onChange={(e) => setCeFlat(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          currencyFeeResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800">
                <span className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase">Total Currency Loss To Fees</span>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mt-1">{formatMoney(currencyFeeResult.totalLossToFees)}</div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">Hidden spread markup: {formatMoney(currencyFeeResult.hiddenMarkupFee)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-slate-500">Actual Converted</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{currencyFeeResult.actualConvertedAmount}</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-slate-500">Ideal Converted</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{currencyFeeResult.idealConvertedAmount}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'data-transfer-time-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Data File Download & Transfer Time Calculator"
        onReset={() => { setDtSize(25); setDtSizeUnit('GB'); setDtSpd(100); setDtSpdUnit('Mbps'); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">File Size</label>
                <input type="number" value={dtSize} onChange={(e) => setDtSize(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Size Unit</label>
                <select value={dtSizeUnit} onChange={(e) => setDtSizeUnit(e.target.value as any)} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800">
                  <option value="MB">Megabytes (MB)</option>
                  <option value="GB">Gigabytes (GB)</option>
                  <option value="TB">Terabytes (TB)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Bandwidth Speed</label>
                <input type="number" value={dtSpd} onChange={(e) => setDtSpd(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Speed Unit</label>
                <select value={dtSpdUnit} onChange={(e) => setDtSpdUnit(e.target.value as any)} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800">
                  <option value="Kbps">Kbps</option>
                  <option value="Mbps">Mbps</option>
                  <option value="Gbps">Gbps</option>
                </select>
              </div>
            </div>
          </div>
        }
        results={
          dataTransferResult ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Estimated Transfer Duration</span>
              <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{dataTransferResult.formatted}</div>
              <div className="text-xs text-slate-500 mt-1">{dataTransferResult.totalSeconds.toLocaleString()} seconds total</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'password-entropy-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Password Entropy & Crack Time Estimator"
        onReset={() => { setPwVal('CorrectHorseBatteryStaple99!'); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Test Password / Passphrase</label>
              <input
                type="text"
                value={pwVal}
                onChange={(e) => setPwVal(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 font-mono text-sm"
              />
            </div>
          </div>
        }
        results={
          passwordResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Entropy Score</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{passwordResult.entropyBits} bits</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-bold">{passwordResult.strengthRating}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimated Brute-Force Time</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{passwordResult.crackTime}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'unit-price-comparison-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Unit Price & Grocery Best Buy Comparison"
        onReset={() => { setUpP1(4.99); setUpQ1(16); setUpP2(8.49); setUpQ2(32); }}
        inputs={
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
              <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Option A (Standard Pack)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" value={upP1} onChange={(e) => setUpP1(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Price" />
                <input type="number" value={upQ1} onChange={(e) => setUpQ1(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Qty / Units" />
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
              <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Option B (Bulk Pack)</h4>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" step="0.01" value={upP2} onChange={(e) => setUpP2(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Price" />
                <input type="number" value={upQ2} onChange={(e) => setUpQ2(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Qty / Units" />
              </div>
            </div>
          </div>
        }
        results={
          unitPriceResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Best Value Deal</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{unitPriceResult.betterDeal}</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Saves {unitPriceResult.percentSavings}% per unit</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-center">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Option A Unit Price</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{currencySymbol}{unitPriceResult.itemAUnitPrice} / unit</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Option B Unit Price</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{currencySymbol}{unitPriceResult.itemBUnitPrice} / unit</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'lease-vs-buy-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Lease vs Buy Equipment & Auto Analysis"
        onReset={() => { setLbBuyPrice(25000); setLbDown(2000); setLbLoanRate(6.5); setLbMonths(36); setLbPmt(450); setLbResale(8000); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Purchase Price</label>
                <input type="number" value={lbBuyPrice} onChange={(e) => setLbBuyPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Estimated Resale</label>
                <input type="number" value={lbResale} onChange={(e) => setLbResale(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Buy Down Payment</label>
                <input type="number" value={lbDown} onChange={(e) => setLbDown(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Loan Interest %</label>
                <input type="number" step="0.1" value={lbLoanRate} onChange={(e) => setLbLoanRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Monthly Lease Payment</label>
                <input type="number" value={lbPmt} onChange={(e) => setLbPmt(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Term (Months)</label>
                <input type="number" value={lbMonths} onChange={(e) => setLbMonths(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          leaseBuyResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Recommended Decision</span>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{leaseBuyResult.betterOption}</div>
                <div className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Difference of {formatMoney(leaseBuyResult.costDifference)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Net Buy Cost</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(leaseBuyResult.netBuyCostAfterResidual)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Total Lease Cost</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(leaseBuyResult.totalLeaseCost)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'car-loan-vs-cash-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Car Loan vs Paying Cash Opportunity Cost"
        onReset={() => { setClPrice(30000); setClRate(5.5); setClMonths(48); setClInvRate(7.0); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Vehicle Price</label>
                <input type="number" value={clPrice} onChange={(e) => setClPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Loan APR %</label>
                <input type="number" step="0.1" value={clRate} onChange={(e) => setClRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Term (Months)</label>
                <input type="number" value={clMonths} onChange={(e) => setClMonths(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Investment Return %</label>
                <input type="number" step="0.1" value={clInvRate} onChange={(e) => setClInvRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          carLoanCashResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Optimal Strategy</span>
                <div className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{carLoanCashResult.betterDecision}</div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Net advantage: {formatMoney(carLoanCashResult.netAdvantageOfFinancing)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Loan Interest Cost</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(carLoanCashResult.loanInterestCost)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Investment Growth</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(carLoanCashResult.investmentGrowthFromPreservedCash)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'pay-debt-vs-invest-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Pay Off Debt vs Invest Wealth Comparison"
        onReset={() => { setPdiDebtRate(18); setPdiInvRate(8); setPdiAmt(500); setPdiYears(5); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Debt Interest Rate %</label>
                <input type="number" value={pdiDebtRate} onChange={(e) => setPdiDebtRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Expected Return %</label>
                <input type="number" value={pdiInvRate} onChange={(e) => setPdiInvRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Monthly Extra Capital ({currencySymbol})</label>
                <input type="number" value={pdiAmt} onChange={(e) => setPdiAmt(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Horizon (Years)</label>
                <input type="number" value={pdiYears} onChange={(e) => setPdiYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          debtInvestResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Recommended Strategy</span>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{debtInvestResult.recommendedAction}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Guaranteed Interest Saved</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(debtInvestResult.guaranteedDebtInterestSaved)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Projected Invest Growth</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(debtInvestResult.projectedInvestmentEarnings)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'emergency-fund-vs-debt-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Emergency Cash Reserves vs High-Interest Debt"
        onReset={() => { setEfdExp(2500); setEfdTargetMos(6); setEfdSavings(8000); setEfdDebtRate(22); setEfdSurplus(500); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Monthly Living Expenses</label>
                <input type="number" value={efdExp} onChange={(e) => setEfdExp(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Months</label>
                <input type="number" value={efdTargetMos} onChange={(e) => setEfdTargetMos(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Current Cash</label>
                <input type="number" value={efdSavings} onChange={(e) => setEfdSavings(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Debt APR %</label>
                <input type="number" value={efdDebtRate} onChange={(e) => setEfdDebtRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Monthly Surplus</label>
                <input type="number" value={efdSurplus} onChange={(e) => setEfdSurplus(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          emergDebtResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Target Emergency Fund</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{formatMoney(emergDebtResult.targetEmergencyFund)}</div>
                <div className="text-xs text-slate-500 mt-1">Deficit: {formatMoney(emergDebtResult.emergencyFundDeficit)} ({emergDebtResult.monthsToFundTarget} months to target)</div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-xl border text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                {emergDebtResult.recommendation}
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'breakeven-investment-return-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Real Breakeven Investment Return (Hurdle Rate)"
        onReset={() => { setBiDebtRate(10.0); setBiTax(20.0); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Debt Interest Rate %</label>
              <input type="number" step="0.1" value={biDebtRate} onChange={(e) => setBiDebtRate(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Tax Deduction / Tax Bracket Rate %</label>
              <input type="number" step="0.1" value={biTax} onChange={(e) => setBiTax(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          breakevenResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Breakeven Return Hurdle</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{breakevenResult.breakevenAnnualReturnPercent}% / yr</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Required investment return to beat paying off debt after tax effects</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'scenario-comparison-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Scenario Comparison (Scenario A vs Scenario B)"
        onReset={() => { setScAInit(10000); setScAMonthly(500); setScARate(8.0); setScBInit(20000); setScBMonthly(350); setScBRate(10.0); setScYears(10); }}
        inputs={
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
              <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Scenario A</h4>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={scAInit} onChange={(e) => setScAInit(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Initial" />
                <input type="number" value={scAMonthly} onChange={(e) => setScAMonthly(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Monthly" />
                <input type="number" step="0.1" value={scARate} onChange={(e) => setScARate(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Rate %" />
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
              <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Scenario B</h4>
              <div className="grid grid-cols-3 gap-2">
                <input type="number" value={scBInit} onChange={(e) => setScBInit(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Initial" />
                <input type="number" value={scBMonthly} onChange={(e) => setScBMonthly(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Monthly" />
                <input type="number" step="0.1" value={scBRate} onChange={(e) => setScBRate(e.target.value === '' ? '' : Number(e.target.value))} className="px-2 py-1.5 border rounded text-xs dark:bg-slate-900" placeholder="Rate %" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Time Horizon (Years)</label>
              <input type="number" value={scYears} onChange={(e) => setScYears(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          scenarioResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Top Outcome</span>
                <div className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{scenarioResult.betterScenario} Leads</div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Difference of {formatMoney(scenarioResult.difference)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-center">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Scenario A Total</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(scenarioResult.scenarioAFinalValue)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <span className="text-slate-500">Scenario B Total</span>
                  <div className="font-bold text-slate-900 dark:text-white mt-1">{formatMoney(scenarioResult.scenarioBFinalValue)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / Sensitivity Analysis
  return (
    <CompactCalculatorWorkspace
      title="Financial Sensitivity Variance Range Analysis"
      onReset={() => { setSaBase(50000); setSaStep(20); }}
      inputs={
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Base Target Value ({currencySymbol})</label>
            <input type="number" value={saBase} onChange={(e) => setSaBase(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Range Range (± %)</label>
            <input type="number" value={saStep} onChange={(e) => setSaStep(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
          </div>
        </div>
      }
      results={
        sensitivityResult ? (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase text-slate-500 mb-1">Sensitivity Scenarios:</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-red-50 dark:bg-red-950/30 rounded border border-red-200">
                <span className="text-red-700">Pessimistic (Low)</span>
                <div className="font-bold text-red-900 dark:text-red-300 text-sm mt-0.5">{formatMoney(sensitivityResult.pessimisticLow)}</div>
              </div>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-200">
                <span className="text-amber-700">Pessimistic (Moderate)</span>
                <div className="font-bold text-amber-900 dark:text-amber-300 text-sm mt-0.5">{formatMoney(sensitivityResult.pessimisticModerate)}</div>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                <span className="text-blue-700">Base Scenario</span>
                <div className="font-bold text-blue-900 dark:text-blue-300 text-sm mt-0.5">{formatMoney(sensitivityResult.baseScenario)}</div>
              </div>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-200">
                <span className="text-emerald-700">Optimistic (Moderate)</span>
                <div className="font-bold text-emerald-900 dark:text-emerald-300 text-sm mt-0.5">{formatMoney(sensitivityResult.optimisticModerate)}</div>
              </div>
            </div>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded border border-emerald-300 text-xs">
              <span className="text-emerald-800 font-semibold">Optimistic (High)</span>
              <div className="font-bold text-emerald-950 dark:text-emerald-200 text-base mt-0.5">{formatMoney(sensitivityResult.optimisticHigh)}</div>
            </div>
          </div>
        ) : null
      }
    />
  );
};
