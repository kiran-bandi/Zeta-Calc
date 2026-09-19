import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { CompactCalculatorWorkspace } from './CompactCalculatorWorkspace';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import {
  calculateLoanComparison,
  calculateLoanPrepayment,
  calculateBalanceTransfer,
  calculateDebtConsolidation,
  calculateAPR,
  calculateEffectiveInterestRate,
  calculateMortgagePayoff,
  calculateMortgageRefinance,
  calculateClosingCosts,
} from '../../engine/newCalculatorsBatch2';

interface NewCalculatorsBatch2WorkspaceViewProps {
  toolSlug: string;
}

export const NEW_CALCULATORS_BATCH2_SLUGS = [
  'loan-comparison-calculator',
  'loan-prepayment-calculator',
  'loan-balance-transfer-calculator',
  'debt-consolidation-calculator',
  'apr-calculator',
  'effective-interest-rate-calculator',
  'mortgage-payoff-calculator',
  'mortgage-refinance-calculator',
  'closing-cost-calculator',
];

export const NewCalculatorsBatch2WorkspaceView: React.FC<NewCalculatorsBatch2WorkspaceViewProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // -------------------------------------------------------------------------
  // 1. LOAN COMPARISON CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [lcP1, setLcP1] = useSessionState<number | ''>('lc_p1', '');
  const [lcR1, setLcR1] = useSessionState<number | ''>('lc_r1', '');
  const [lcY1, setLcY1] = useSessionState<number | ''>('lc_y1', '');
  const [lcF1, setLcF1] = useSessionState<number | ''>('lc_f1', '');
  
  const [lcP2, setLcP2] = useSessionState<number | ''>('lc_p2', '');
  const [lcR2, setLcR2] = useSessionState<number | ''>('lc_r2', '');
  const [lcY2, setLcY2] = useSessionState<number | ''>('lc_y2', '');
  const [lcF2, setLcF2] = useSessionState<number | ''>('lc_f2', '');

  const loanComparisonResult = useMemo(() => {
    if (typeof lcP1 !== 'number' || typeof lcP2 !== 'number') return null;
    return calculateLoanComparison([
      {
        id: 'loan-1',
        name: 'Loan Offer 1',
        principal: lcP1,
        annualRatePercent: typeof lcR1 === 'number' ? lcR1 : 0,
        years: typeof lcY1 === 'number' ? lcY1 : 0,
        months: 0,
        upfrontFees: typeof lcF1 === 'number' ? lcF1 : 0,
        paymentFrequency: 'monthly',
      },
      {
        id: 'loan-2',
        name: 'Loan Offer 2',
        principal: lcP2,
        annualRatePercent: typeof lcR2 === 'number' ? lcR2 : 0,
        years: typeof lcY2 === 'number' ? lcY2 : 0,
        months: 0,
        upfrontFees: typeof lcF2 === 'number' ? lcF2 : 0,
        paymentFrequency: 'monthly',
      },
    ]);
  }, [lcP1, lcR1, lcY1, lcF1, lcP2, lcR2, lcY2, lcF2]);

  // -------------------------------------------------------------------------
  // 2. LOAN PREPAYMENT CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [lpP, setLpP] = useSessionState<number | ''>('lp_p', '');
  const [lpR, setLpR] = useSessionState<number | ''>('lp_r', '');
  const [lpY, setLpY] = useSessionState<number | ''>('lp_y', '');
  const [lpM, setLpM] = useSessionState<number | ''>('lp_m', '');
  const [lpExtra, setLpExtra] = useSessionState<number | ''>('lp_extra', '');
  const [lpOneTime, setLpOneTime] = useSessionState<number | ''>('lp_onetime', '');

  const loanPrepaymentResult = useMemo(() => {
    if (typeof lpP !== 'number' || lpP <= 0 || typeof lpR !== 'number') return null;
    return calculateLoanPrepayment({
      outstandingPrincipal: lpP,
      annualRatePercent: lpR,
      remainingYears: typeof lpY === 'number' ? lpY : 0,
      remainingMonths: typeof lpM === 'number' ? lpM : 0,
      extraPeriodicPayment: typeof lpExtra === 'number' ? lpExtra : 0,
      oneTimePrepayment: typeof lpOneTime === 'number' ? lpOneTime : 0,
      paymentFrequency: 'monthly',
    });
  }, [lpP, lpR, lpY, lpM, lpExtra, lpOneTime]);

  // -------------------------------------------------------------------------
  // 3. LOAN BALANCE TRANSFER CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [btBal, setBtBal] = useSessionState<number | ''>('bt_bal', '');
  const [btCurrRate, setBtCurrRate] = useSessionState<number | ''>('bt_curr_rate', '');
  const [btCurrY, setBtCurrY] = useSessionState<number | ''>('bt_curr_y', '');
  const [btNewRate, setBtNewRate] = useSessionState<number | ''>('bt_new_rate', '');
  const [btNewY, setBtNewY] = useSessionState<number | ''>('bt_new_y', '');
  const [btFees, setBtFees] = useSessionState<number | ''>('bt_fees', '');

  const balanceTransferResult = useMemo(() => {
    if (typeof btBal !== 'number' || btBal <= 0 || typeof btCurrRate !== 'number' || typeof btNewRate !== 'number') return null;
    return calculateBalanceTransfer({
      outstandingBalance: btBal,
      currentRatePercent: btCurrRate,
      remainingYears: typeof btCurrY === 'number' ? btCurrY : 0,
      remainingMonths: 0,
      newRatePercent: btNewRate,
      newYears: typeof btNewY === 'number' ? btNewY : 0,
      newMonths: 0,
      processingFees: typeof btFees === 'number' ? btFees : 0,
      otherFees: 0,
    });
  }, [btBal, btCurrRate, btCurrY, btNewRate, btNewY, btFees]);

  // -------------------------------------------------------------------------
  // 4. DEBT CONSOLIDATION CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [dcB1, setDcB1] = useSessionState<number | ''>('dc_b1', '');
  const [dcR1, setDcR1] = useSessionState<number | ''>('dc_r1', '');
  const [dcP1, setDcP1] = useSessionState<number | ''>('dc_p1', '');

  const [dcB2, setDcB2] = useSessionState<number | ''>('dc_b2', '');
  const [dcR2, setDcR2] = useSessionState<number | ''>('dc_r2', '');
  const [dcP2, setDcP2] = useSessionState<number | ''>('dc_p2', '');

  const [dcB3, setDcB3] = useSessionState<number | ''>('dc_b3', '');
  const [dcR3, setDcR3] = useSessionState<number | ''>('dc_r3', '');
  const [dcP3, setDcP3] = useSessionState<number | ''>('dc_p3', '');

  const [dcConsRate, setDcConsRate] = useSessionState<number | ''>('dc_cons_rate', '');
  const [dcConsY, setDcConsY] = useSessionState<number | ''>('dc_cons_y', '');
  const [dcConsFees, setDcConsFees] = useSessionState<number | ''>('dc_cons_fees', '');

  const debtConsolidationResult = useMemo(() => {
    const debts = [];
    if (typeof dcB1 === 'number' && dcB1 > 0) {
      debts.push({ id: 'd1', name: 'Debt 1', balance: dcB1, ratePercent: typeof dcR1 === 'number' ? dcR1 : 0, monthlyPayment: typeof dcP1 === 'number' ? dcP1 : 0 });
    }
    if (typeof dcB2 === 'number' && dcB2 > 0) {
      debts.push({ id: 'd2', name: 'Debt 2', balance: dcB2, ratePercent: typeof dcR2 === 'number' ? dcR2 : 0, monthlyPayment: typeof dcP2 === 'number' ? dcP2 : 0 });
    }
    if (typeof dcB3 === 'number' && dcB3 > 0) {
      debts.push({ id: 'd3', name: 'Debt 3', balance: dcB3, ratePercent: typeof dcR3 === 'number' ? dcR3 : 0, monthlyPayment: typeof dcP3 === 'number' ? dcP3 : 0 });
    }
    if (debts.length === 0 || typeof dcConsRate !== 'number' || typeof dcConsY !== 'number') return null;

    return calculateDebtConsolidation({
      debts,
      consolidatedRatePercent: dcConsRate,
      consolidatedYears: dcConsY,
      consolidatedMonths: 0,
      consolidatedFees: typeof dcConsFees === 'number' ? dcConsFees : 0,
    });
  }, [dcB1, dcR1, dcP1, dcB2, dcR2, dcP2, dcB3, dcR3, dcP3, dcConsRate, dcConsY, dcConsFees]);

  // -------------------------------------------------------------------------
  // 5. APR CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [aprAmount, setAprAmount] = useSessionState<number | ''>('apr_amount', '');
  const [aprNomRate, setAprNomRate] = useSessionState<number | ''>('apr_nomrate', '');
  const [aprYears, setAprYears] = useSessionState<number | ''>('apr_years', '');
  const [aprFees, setAprFees] = useSessionState<number | ''>('apr_fees', '');

  const aprResult = useMemo(() => {
    if (typeof aprAmount !== 'number' || aprAmount <= 0 || typeof aprNomRate !== 'number' || typeof aprYears !== 'number' || aprYears <= 0) return null;
    return calculateAPR({
      loanAmount: aprAmount,
      nominalRatePercent: aprNomRate,
      years: aprYears,
      months: 0,
      upfrontFees: typeof aprFees === 'number' ? aprFees : 0,
      paymentFrequency: 'monthly',
    });
  }, [aprAmount, aprNomRate, aprYears, aprFees]);

  // -------------------------------------------------------------------------
  // 6. EFFECTIVE INTEREST RATE CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [effNomRate, setEffNomRate] = useSessionState<number | ''>('eff_nomrate', '');
  const [effFreq, setEffFreq] = useSessionState<string>('eff_freq', 'monthly');

  const effectiveRateResult = useMemo(() => {
    if (typeof effNomRate !== 'number' || effNomRate < 0) return null;
    return calculateEffectiveInterestRate(effNomRate, effFreq);
  }, [effNomRate, effFreq]);

  // -------------------------------------------------------------------------
  // 7. MORTGAGE PAYOFF CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [mpoBal, setMpoBal] = useSessionState<number | ''>('mpo_bal', '');
  const [mpoRate, setMpoRate] = useSessionState<number | ''>('mpo_rate', '');
  const [mpoYears, setMpoYears] = useSessionState<number | ''>('mpo_years', '');
  const [mpoExtra, setMpoExtra] = useSessionState<number | ''>('mpo_extra', '');
  const [mpoOneTime, setMpoOneTime] = useSessionState<number | ''>('mpo_onetime', '');

  const mortgagePayoffResult = useMemo(() => {
    if (typeof mpoBal !== 'number' || mpoBal <= 0 || typeof mpoRate !== 'number') return null;
    return calculateMortgagePayoff({
      mortgageBalance: mpoBal,
      interestRatePercent: mpoRate,
      remainingYears: typeof mpoYears === 'number' ? mpoYears : 0,
      remainingMonths: 0,
      extraMonthlyPayment: typeof mpoExtra === 'number' ? mpoExtra : 0,
      oneTimePrepayment: typeof mpoOneTime === 'number' ? mpoOneTime : 0,
    });
  }, [mpoBal, mpoRate, mpoYears, mpoExtra, mpoOneTime]);

  // -------------------------------------------------------------------------
  // 8. MORTGAGE REFINANCE CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [mrfBal, setMrfBal] = useSessionState<number | ''>('mrf_bal', '');
  const [mrfCurrRate, setMrfCurrRate] = useSessionState<number | ''>('mrf_curr_rate', '');
  const [mrfCurrY, setMrfCurrY] = useSessionState<number | ''>('mrf_curr_y', '');
  const [mrfNewRate, setMrfNewRate] = useSessionState<number | ''>('mrf_new_rate', '');
  const [mrfNewY, setMrfNewY] = useSessionState<number | ''>('mrf_new_y', '');
  const [mrfCosts, setMrfCosts] = useSessionState<number | ''>('mrf_costs', '');

  const mortgageRefinanceResult = useMemo(() => {
    if (typeof mrfBal !== 'number' || mrfBal <= 0 || typeof mrfCurrRate !== 'number' || typeof mrfNewRate !== 'number') return null;
    return calculateMortgageRefinance({
      remainingBalance: mrfBal,
      currentRatePercent: mrfCurrRate,
      remainingYears: typeof mrfCurrY === 'number' ? mrfCurrY : 0,
      remainingMonths: 0,
      newRatePercent: mrfNewRate,
      newYears: typeof mrfNewY === 'number' ? mrfNewY : 0,
      newMonths: 0,
      refinanceCosts: typeof mrfCosts === 'number' ? mrfCosts : 0,
    });
  }, [mrfBal, mrfCurrRate, mrfCurrY, mrfNewRate, mrfNewY, mrfCosts]);

  // -------------------------------------------------------------------------
  // 9. CLOSING COST CALCULATOR STATE & LOGIC
  // -------------------------------------------------------------------------
  const [ccPrice, setCcPrice] = useSessionState<number | ''>('cc_price', '');
  const [ccDownPct, setCcDownPct] = useSessionState<number | ''>('cc_downpct', '');
  const [ccLenderOrig, setCcLenderOrig] = useSessionState<number | ''>('cc_lenderorig', '');
  const [ccLenderPoints, setCcLenderPoints] = useSessionState<number | ''>('cc_lenderpoints', '');
  const [ccAppraisal, setCcAppraisal] = useSessionState<number | ''>('cc_appraisal', '');
  const [ccTitlePct, setCcTitlePct] = useSessionState<number | ''>('cc_titlepct', '');
  const [ccTaxPct, setCcTaxPct] = useSessionState<number | ''>('cc_taxpct', '');
  const [ccIns, setCcIns] = useSessionState<number | ''>('cc_ins', '');

  const closingCostsResult = useMemo(() => {
    if (typeof ccPrice !== 'number' || ccPrice <= 0) return null;
    return calculateClosingCosts({
      purchasePrice: ccPrice,
      downPaymentPercent: typeof ccDownPct === 'number' ? ccDownPct : 0,
      lenderOriginationFee: typeof ccLenderOrig === 'number' ? ccLenderOrig : 0,
      lenderPointsPercent: typeof ccLenderPoints === 'number' ? ccLenderPoints : 0,
      appraisalFee: typeof ccAppraisal === 'number' ? ccAppraisal : 0,
      inspectionFee: 350, // Standard fixed fee
      titleInsurancePercent: typeof ccTitlePct === 'number' ? ccTitlePct : 0,
      legalAttorneyFee: 800, // Standard attorney fixed
      transferTaxPercent: typeof ccTaxPct === 'number' ? ccTaxPct : 0,
      homeownersInsurance: typeof ccIns === 'number' ? ccIns : 0,
      escrowPrepaids: 1200, // standard prepaids escrow
      otherFees: 200,
    });
  }, [ccPrice, ccDownPct, ccLenderOrig, ccLenderPoints, ccAppraisal, ccTitlePct, ccTaxPct, ccIns]);


  // =========================================================================
  // RENDER SECTIONS FOR EACH TOOL
  // =========================================================================

  // 1. LOAN COMPARISON
  if (toolSlug === 'loan-comparison-calculator') {
    const isReady = loanComparisonResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="loan-compare"
        title="Loan Comparison Calculator"
        badge="COMPARE & SAVE"
        description="Stack two loan packages side-by-side to understand the exact payment differences and identify the cheapest option."
        onReset={() => {
          setLcP1(''); setLcR1(''); setLcY1(''); setLcF1('');
          setLcP2(''); setLcR2(''); setLcY2(''); setLcF2('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Loan Option 1</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NumberSliderInput id="lc-p1" label="Principal Amount" value={lcP1} onChange={setLcP1} min={1000} max={2000000} step={5000} prefix={currencySymbol} placeholder="e.g. 100000" />
                <NumberSliderInput id="lc-r1" label="Interest Rate (% p.a.)" value={lcR1} onChange={setLcR1} min={0.5} max={25} step={0.1} suffix="%" placeholder="e.g. 5.5" />
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <NumberSliderInput id="lc-y1" label="Term Length (Years)" value={lcY1} onChange={setLcY1} min={1} max={40} step={1} placeholder="e.g. 15" />
                  <NumberSliderInput id="lc-f1" label="Upfront / Closing Fees" value={lcF1} onChange={setLcF1} min={0} max={20000} step={100} prefix={currencySymbol} placeholder="e.g. 1500" />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Loan Option 2</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NumberSliderInput id="lc-p2" label="Principal Amount" value={lcP2} onChange={setLcP2} min={1000} max={2000000} step={5000} prefix={currencySymbol} placeholder="e.g. 100000" />
                <NumberSliderInput id="lc-r2" label="Interest Rate (% p.a.)" value={lcR2} onChange={setLcR2} min={0.5} max={25} step={0.1} suffix="%" placeholder="e.g. 4.75" />
                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <NumberSliderInput id="lc-y2" label="Term Length (Years)" value={lcY2} onChange={setLcY2} min={1} max={40} step={1} placeholder="e.g. 15" />
                  <NumberSliderInput id="lc-f2" label="Upfront / Closing Fees" value={lcF2} onChange={setLcF2} min={0} max={20000} step={100} prefix={currencySymbol} placeholder="e.g. 3000" />
                </div>
              </div>
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && loanComparisonResult ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {loanComparisonResult.options.map((opt, i) => (
                    <div key={opt.id} className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {opt.name}
                      </div>
                      <div className="text-xl font-black text-emerald-400 mb-1">
                        {formatMoney(opt.periodicPayment)}/mo
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-0.5 pt-2 border-t border-slate-800">
                        <div>Total Interest: <strong>{formatMoney(opt.totalInterest)}</strong></div>
                        <div>Total Cost: <strong>{formatMoney(opt.totalCost)}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-xl text-xs space-y-1">
                  <div className="font-bold uppercase tracking-wider text-[10px]">Comparison Insights</div>
                  <div>
                    💸 The loan option with the lowest monthly payment is{' '}
                    <strong>
                      {loanComparisonResult.options.find((o) => o.id === loanComparisonResult.cheapestByPaymentId)?.name}
                    </strong>.
                  </div>
                  <div>
                    🎯 The option with the cheapest total lifetime cost (including closing fees) is{' '}
                    <strong>
                      {loanComparisonResult.options.find((o) => o.id === loanComparisonResult.cheapestByTotalCostId)?.name}
                    </strong>.
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Enter details for both loan packages on the left to see dynamic side-by-side comparison insights.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 2. LOAN PREPAYMENT
  if (toolSlug === 'loan-prepayment-calculator') {
    const isReady = loanPrepaymentResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="loan-prepay"
        title="Loan Prepayment Calculator"
        badge="ACCELERATION"
        description="Simulate applying extra monthly savings or custom cash windfalls to discover how fast you can become completely debt-free."
        onReset={() => {
          setLpP(''); setLpR(''); setLpY(''); setLpM(''); setLpExtra(''); setLpOneTime('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput id="lp-p" label="Outstanding Principal" value={lpP} onChange={setLpP} min={1000} max={2000000} step={5000} prefix={currencySymbol} placeholder="e.g. 150000" />
            <NumberSliderInput id="lp-r" label="Interest Rate (% p.a.)" value={lpR} onChange={setLpR} min={0.5} max={25} step={0.1} suffix="%" placeholder="e.g. 6.0" />
            <NumberSliderInput id="lp-y" label="Remaining Term (Years)" value={lpY} onChange={setLpY} min={1} max={40} step={1} placeholder="e.g. 20" />
            <NumberSliderInput id="lp-extra" label="Add Extra Payment / Month" value={lpExtra} onChange={setLpExtra} min={0} max={5000} step={50} prefix={currencySymbol} placeholder="e.g. 200" />
            <div className="sm:col-span-2">
              <NumberSliderInput id="lp-onetime" label="One-Time Lump-Sum (Prepay Now)" value={lpOneTime} onChange={setLpOneTime} min={0} max={100000} step={1000} prefix={currencySymbol} placeholder="e.g. 5000" />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && loanPrepaymentResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Interest Saved
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mb-1">
                    {formatMoney(loanPrepaymentResult.interestSaved)}
                  </div>
                  <span className="text-xs text-slate-400">
                     Shaves off <strong>{loanPrepaymentResult.periodsSaved} months</strong> ({Math.round(loanPrepaymentResult.periodsSaved / 12 * 10) / 10} years) of repayment timeline!
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">With Prepayments</span>
                      <span className="font-bold text-sm text-white block">
                        {formatMoney(loanPrepaymentResult.prepaidTotalInterest)} interest
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {loanPrepaymentResult.prepaidTotalPeriods} monthly periods
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Standard Amortization</span>
                      <span className="font-bold text-sm text-slate-300 block">
                        {formatMoney(loanPrepaymentResult.originalTotalInterest)} interest
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {loanPrepaymentResult.originalTotalPeriods} monthly periods
                      </span>
                    </div>
                  </div>
                </div>

                {loanPrepaymentResult.schedule.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Simulation Sample (First 5 Months)</span>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-2 font-semibold text-slate-700">Month</th>
                            <th className="p-2 font-semibold text-slate-700">Beg. Bal</th>
                            <th className="p-2 font-semibold text-slate-700">Interest</th>
                            <th className="p-2 font-semibold text-slate-700">Extra Paid</th>
                            <th className="p-2 font-semibold text-slate-700">Ending Bal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {loanPrepaymentResult.schedule.slice(0, 5).map((row) => (
                            <tr key={row.periodNumber} className="hover:bg-slate-50/50">
                              <td className="p-2 text-slate-600 font-bold">M{row.periodNumber}</td>
                              <td className="p-2 text-slate-500">{formatMoney(row.beginningBalance)}</td>
                              <td className="p-2 text-rose-500">{formatMoney(row.interestPaid)}</td>
                              <td className="p-2 text-emerald-600 font-semibold">+{formatMoney(row.extraPaymentPaid)}</td>
                              <td className="p-2 text-slate-900 font-bold">{formatMoney(row.endingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Enter your current loan balance and interest rate to calculate prepayments and payoff milestones.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 3. LOAN BALANCE TRANSFER
  if (toolSlug === 'loan-balance-transfer-calculator') {
    const isReady = balanceTransferResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="loan-transfer"
        title="Loan Balance Transfer Calculator"
        badge="REFINANCING"
        description="Verify if shifting an outstanding loan to a cheaper interest rate makes financial sense after deducting upfront processing fees."
        onReset={() => {
          setBtBal(''); setBtCurrRate(''); setBtCurrY(''); setBtNewRate(''); setBtNewY(''); setBtFees('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Loan Details</span>
              <NumberSliderInput id="bt-bal" label="Outstanding Balance" value={btBal} onChange={setBtBal} min={5000} max={1000000} step={5000} prefix={currencySymbol} placeholder="e.g. 100000" />
              <div className="grid grid-cols-2 gap-3">
                <NumberSliderInput id="bt-currrate" label="Current Rate (%)" value={btCurrRate} onChange={setBtCurrRate} min={1} max={25} step={0.1} suffix="%" placeholder="e.g. 9.5" />
                <NumberSliderInput id="bt-curry" label="Remaining Term (Y)" value={btCurrY} onChange={setBtCurrY} min={1} max={30} step={1} placeholder="e.g. 10" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Replacement Loan Details</span>
              <div className="grid grid-cols-2 gap-3">
                <NumberSliderInput id="bt-newrate" label="New Rate (%)" value={btNewRate} onChange={setBtNewRate} min={1} max={25} step={0.1} suffix="%" placeholder="e.g. 7.2" />
                <NumberSliderInput id="bt-newy" label="New Term (Years)" value={btNewY} onChange={setBtNewY} min={1} max={30} step={1} placeholder="e.g. 10" />
              </div>
              <NumberSliderInput id="bt-fees" label="Refinance & Transfer Fees" value={btFees} onChange={setBtFees} min={0} max={10000} step={100} prefix={currencySymbol} placeholder="e.g. 1200" />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && balanceTransferResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Net Refinance Savings
                  </span>
                  <div className={`text-3xl font-black mb-1 ${balanceTransferResult.netLifetimeSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {balanceTransferResult.netLifetimeSavings >= 0 ? '+' : ''}{formatMoney(balanceTransferResult.netLifetimeSavings)}
                  </div>
                  <span className="text-xs text-slate-400 block mb-4">
                    Takes about <strong>{balanceTransferResult.breakEvenMonths} months</strong> of monthly savings to cover the upfront fees.
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Old Payment</span>
                      <span className="font-bold text-base text-slate-300">
                        {formatMoney(balanceTransferResult.currentPayment)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">New Payment</span>
                      <span className="font-bold text-base text-white">
                        {formatMoney(balanceTransferResult.newPayment)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
                  <div>• Monthly Payment Change: <span className={`font-bold ${balanceTransferResult.monthlyPaymentSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{balanceTransferResult.monthlyPaymentSavings >= 0 ? 'Save' : 'Increase'} {formatMoney(Math.abs(balanceTransferResult.monthlyPaymentSavings))}</span></div>
                  <div>• Processing Fees: <span className="font-semibold text-slate-900">{formatMoney(balanceTransferResult.totalTransferFees)}</span></div>
                  <div>• Interest Savings: <span className="font-semibold text-slate-900">{formatMoney(balanceTransferResult.currentTotalInterest - balanceTransferResult.newTotalInterest)}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Enter your current loan values and the new offer details to check balance transfer economics.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 4. DEBT CONSOLIDATION
  if (toolSlug === 'debt-consolidation-calculator') {
    const isReady = debtConsolidationResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="debt-consolidate"
        title="Debt Consolidation Calculator"
        badge="DEBT ROLLUP"
        description="Verify if combining credit cards or existing loans into a single consolidated loan improves your cash flow and reduces lifetime interest costs."
        onReset={() => {
          setDcB1(''); setDcR1(''); setDcP1('');
          setDcB2(''); setDcR2(''); setDcP2('');
          setDcB3(''); setDcR3(''); setDcP3('');
          setDcConsRate(''); setDcConsY(''); setDcConsFees('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">List Existing Debts</span>
              
              <div className="border-b border-slate-200/50 pb-2 mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Debt 1 (e.g. Credit Card)</span>
                <div className="grid grid-cols-3 gap-2">
                  <NumberSliderInput id="dc-b1" label="Balance" value={dcB1} onChange={setDcB1} min={100} max={100000} step={500} prefix={currencySymbol} />
                  <NumberSliderInput id="dc-r1" label="APR (%)" value={dcR1} onChange={setDcR1} min={1} max={36} step={0.5} suffix="%" />
                  <NumberSliderInput id="dc-p1" label="Payment/Mo" value={dcP1} onChange={setDcP1} min={5} max={5000} step={25} prefix={currencySymbol} />
                </div>
              </div>

              <div className="border-b border-slate-200/50 pb-2 mb-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Debt 2 (e.g. Personal Loan)</span>
                <div className="grid grid-cols-3 gap-2">
                  <NumberSliderInput id="dc-b2" label="Balance" value={dcB2} onChange={setDcB2} min={100} max={100000} step={500} prefix={currencySymbol} />
                  <NumberSliderInput id="dc-r2" label="APR (%)" value={dcR2} onChange={setDcR2} min={1} max={36} step={0.5} suffix="%" />
                  <NumberSliderInput id="dc-p2" label="Payment/Mo" value={dcP2} onChange={setDcP2} min={5} max={5000} step={25} prefix={currencySymbol} />
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">Debt 3 (Other Debt)</span>
                <div className="grid grid-cols-3 gap-2">
                  <NumberSliderInput id="dc-b3" label="Balance" value={dcB3} onChange={setDcB3} min={100} max={100000} step={500} prefix={currencySymbol} />
                  <NumberSliderInput id="dc-r3" label="APR (%)" value={dcR3} onChange={setDcR3} min={1} max={36} step={0.5} suffix="%" />
                  <NumberSliderInput id="dc-p3" label="Payment/Mo" value={dcP3} onChange={setDcP3} min={5} max={5000} step={25} prefix={currencySymbol} />
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Consolidated Loan parameters</span>
              <div className="grid grid-cols-2 gap-3">
                <NumberSliderInput id="dc-consrate" label="New Rate (%)" value={dcConsRate} onChange={setDcConsRate} min={1} max={25} step={0.1} suffix="%" placeholder="e.g. 8.5" />
                <NumberSliderInput id="dc-consy" label="New Term (Years)" value={dcConsY} onChange={setDcConsY} min={1} max={30} step={1} placeholder="e.g. 5" />
              </div>
              <NumberSliderInput id="dc-consfees" label="Consolidation Closing Fees" value={dcConsFees} onChange={setDcConsFees} min={0} max={5000} step={100} prefix={currencySymbol} placeholder="e.g. 500" />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && debtConsolidationResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Monthly Cash-Flow Savings
                  </span>
                  <div className={`text-3xl font-black mb-1 ${debtConsolidationResult.monthlyCashFlowDifference >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {debtConsolidationResult.monthlyCashFlowDifference >= 0 ? '+' : ''}{formatMoney(debtConsolidationResult.monthlyCashFlowDifference)}/mo
                  </div>
                  <span className="text-xs text-slate-400 block mb-4">
                    Combining debts will result in a net financial difference of <strong>{formatMoney(debtConsolidationResult.netFinancialDifference)}</strong> over the loan timeline.
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Total Current Bills</span>
                      <span className="font-bold text-base text-slate-300">
                        {formatMoney(debtConsolidationResult.totalExistingMonthlyPayment)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">New Consolidated Bill</span>
                      <span className="font-bold text-base text-white">
                        {formatMoney(debtConsolidationResult.consolidatedMonthlyPayment)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
                  <div>• Combined Outstanding Debt: <span className="font-bold text-slate-900">{formatMoney(debtConsolidationResult.totalExistingBalance)}</span></div>
                  <div>• Estimated Current Interest Load: <span className="font-bold text-slate-900">{formatMoney(debtConsolidationResult.estimatedExistingTotalInterest)}</span></div>
                  <div>• Consolidated Interest Cost: <span className="font-bold text-slate-900">{formatMoney(debtConsolidationResult.consolidatedTotalInterest)}</span></div>
                  <div>• Break-Even on Fees: <span className="font-semibold text-slate-900">{debtConsolidationResult.breakEvenMonths > 0 ? `${debtConsolidationResult.breakEvenMonths} months` : 'Immediate'}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Fill in at least one debt amount and consolidation parameters to calculate debt consolidations.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 5. APR CALCULATOR
  if (toolSlug === 'apr-calculator') {
    const isReady = aprResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="apr-calc"
        title="APR Calculator"
        badge="FINANCE COST"
        description="Factor upfront processing and origination charges directly into your loan to calculate the actual Annual Percentage Rate (APR)."
        onReset={() => {
          setAprAmount(''); setAprNomRate(''); setAprYears(''); setAprFees('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput id="apr-amount" label="Loan Principal" value={aprAmount} onChange={setAprAmount} min={1000} max={2000000} step={5000} prefix={currencySymbol} placeholder="e.g. 200000" />
            <NumberSliderInput id="apr-rate" label="Nominal Rate (% p.a.)" value={aprNomRate} onChange={setAprNomRate} min={0.5} max={25} step={0.1} suffix="%" placeholder="e.g. 5.0" />
            <NumberSliderInput id="apr-years" label="Loan Term (Years)" value={aprYears} onChange={setAprYears} min={1} max={40} step={1} placeholder="e.g. 30" />
            <NumberSliderInput id="apr-fees" label="Lender & Upfront Fees" value={aprFees} onChange={setAprFees} min={0} max={30000} step={100} prefix={currencySymbol} placeholder="e.g. 4000" />
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && aprResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    True Loan APR
                  </span>
                  <div className="text-4xl font-black text-emerald-400 mb-1">
                    {aprResult.annualPercentRate}%
                  </div>
                  <span className="text-xs text-slate-400 block mb-4">
                    Nominal Rate of {aprNomRate}% rises due to {formatMoney(typeof aprFees === 'number' ? aprFees : 0)} of finance charges.
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Monthly Payment</span>
                      <span className="font-bold text-sm text-white">
                        {formatMoney(aprResult.periodicPayment)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Net Funded Amount</span>
                      <span className="font-bold text-sm text-cyan-300">
                        {formatMoney(aprResult.amountFinanced)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Methodology & Precision</div>
                  The Annual Percentage Rate (APR) represents the true yearly cost of financing. It is solved dynamically via a numerical roots-matching algorithm (Secant convergence) to find the internal rate equating the present value of future payments with the net funded proceeds.
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Enter your loan principal, nominal rate, and total fees to calculate the true APR.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 6. EFFECTIVE INTEREST RATE
  if (toolSlug === 'effective-interest-rate-calculator') {
    const isReady = effectiveRateResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="effective-rate"
        title="Effective Interest Rate Calculator"
        badge="EAR SOLVER"
        description="Convert nominal annual interest rates to the true Effective Annual Rate (EAR) reflecting different compounding intervals."
        onReset={() => {
          setEffNomRate(''); setEffFreq('monthly');
        }}
        inputs={
          <div className="grid grid-cols-1 gap-3.5">
            <NumberSliderInput id="eff-rate" label="Nominal Annual Rate" value={effNomRate} onChange={setEffNomRate} min={0.1} max={50} step={0.1} suffix="%" placeholder="e.g. 8.0" />
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Compounding Frequency</label>
              <select
                id="eff-freq-select"
                value={effFreq}
                onChange={(e) => setEffFreq(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-shadow"
              >
                <option value="annually">Compounded Annually (1x/yr)</option>
                <option value="semiannually">Compounded Semi-Annually (2x/yr)</option>
                <option value="quarterly">Compounded Quarterly (4x/yr)</option>
                <option value="monthly">Compounded Monthly (12x/yr)</option>
                <option value="biweekly">Compounded Bi-Weekly (26x/yr)</option>
                <option value="weekly">Compounded Weekly (52x/yr)</option>
                <option value="daily">Compounded Daily (365x/yr)</option>
                <option value="continuous">Compounded Continuously (Infinite)</option>
              </select>
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && effectiveRateResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Effective Annual Rate (EAR)
                  </span>
                  <div className="text-4xl font-black text-emerald-400 mb-1">
                    {effectiveRateResult.effectiveAnnualRatePercent}%
                  </div>
                  <span className="text-xs text-slate-400">
                    A nominal rate of {effNomRate}% compounding <strong>{effFreq}</strong> yields {effectiveRateResult.effectiveAnnualRatePercent}% annually.
                  </span>
                </div>

                <div className="text-[11px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 space-y-1">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[9px] mb-0.5">Compounding Concept</div>
                  Compounding frequency dictates how often accrued interest is reinvested back. The more frequent the compound interval, the higher the real annual yield. Continuous compounding represents the absolute mathematical upper limit.
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Provide a nominal interest rate to calculate compound effective annual rates.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 7. MORTGAGE PAYOFF
  if (toolSlug === 'mortgage-payoff-calculator') {
    const isReady = mortgagePayoffResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="mortgage-payoff"
        title="Mortgage Payoff Calculator"
        badge="PAYOFF OPTIMIZATION"
        description="Visualize how adding custom monthly principal contributions or immediate lump sums will shave years off your mortgage timeline."
        onReset={() => {
          setMpoBal(''); setMpoRate(''); setMpoYears(''); setMpoExtra(''); setMpoOneTime('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput id="mpo-bal" label="Current Mortgage Balance" value={mpoBal} onChange={setMpoBal} min={10000} max={3000000} step={10000} prefix={currencySymbol} placeholder="e.g. 350000" />
            <NumberSliderInput id="mpo-rate" label="Interest Rate (% p.a.)" value={mpoRate} onChange={setMpoRate} min={0.5} max={20} step={0.1} suffix="%" placeholder="e.g. 6.25" />
            <NumberSliderInput id="mpo-years" label="Remaining Term (Years)" value={mpoYears} onChange={setMpoYears} min={1} max={40} step={1} placeholder="e.g. 25" />
            <NumberSliderInput id="mpo-extra" label="Extra Monthly Contribution" value={mpoExtra} onChange={setMpoExtra} min={0} max={5000} step={50} prefix={currencySymbol} placeholder="e.g. 250" />
            <div className="sm:col-span-2">
              <NumberSliderInput id="mpo-onetime" label="One-Time Prepayment (Lump-Sum Now)" value={mpoOneTime} onChange={setMpoOneTime} min={0} max={200000} step={1000} prefix={currencySymbol} placeholder="e.g. 10000" />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && mortgagePayoffResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Mortgage Interest Saved
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mb-1">
                    {formatMoney(mortgagePayoffResult.interestSaved)}
                  </div>
                  <span className="text-xs text-slate-400">
                    Saves <strong>{mortgagePayoffResult.yearsSaved} years and {mortgagePayoffResult.monthsSaved} months</strong> on your mortgage!
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Accelerated Payoff</span>
                      <span className="font-bold text-sm text-white block">
                        {formatMoney(mortgagePayoffResult.acceleratedTotalInterest)} interest
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {mortgagePayoffResult.acceleratedPayoffMonths} months total
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Normal Term Payoff</span>
                      <span className="font-bold text-sm text-slate-300 block">
                        {formatMoney(mortgagePayoffResult.originalTotalInterest)} interest
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {mortgagePayoffResult.originalPayoffMonths} months total
                      </span>
                    </div>
                  </div>
                </div>

                {mortgagePayoffResult.schedule.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Refined Schedule Sample (First 5 Months)</span>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-2 font-semibold text-slate-700">Month</th>
                            <th className="p-2 font-semibold text-slate-700">Beg. Balance</th>
                            <th className="p-2 font-semibold text-slate-700">Interest Paid</th>
                            <th className="p-2 font-semibold text-slate-700">Extra Paid</th>
                            <th className="p-2 font-semibold text-slate-700">Ending Balance</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {mortgagePayoffResult.schedule.slice(0, 5).map((row) => (
                            <tr key={row.periodNumber} className="hover:bg-slate-50/50">
                              <td className="p-2 text-slate-600 font-bold">M{row.periodNumber}</td>
                              <td className="p-2 text-slate-500">{formatMoney(row.beginningBalance)}</td>
                              <td className="p-2 text-rose-500">{formatMoney(row.interestPaid)}</td>
                              <td className="p-2 text-emerald-600 font-semibold">+{formatMoney(row.extraPaymentPaid)}</td>
                              <td className="p-2 text-slate-900 font-bold">{formatMoney(row.endingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Input your mortgage details to see the acceleration impact of extra principal payments.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 8. MORTGAGE REFINANCE
  if (toolSlug === 'mortgage-refinance-calculator') {
    const isReady = mortgageRefinanceResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="mortgage-refi"
        title="Mortgage Refinance Calculator"
        badge="REFINANCE AUDIT"
        description="Verify refinance feasibility by comparing monthly savings, closing fees, and calculating the exact break-even month."
        onReset={() => {
          setMrfBal(''); setMrfCurrRate(''); setMrfCurrY(''); setMrfNewRate(''); setMrfNewY(''); setMrfCosts('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Current Mortgage Details</span>
              <NumberSliderInput id="mrf-bal" label="Remaining Balance" value={mrfBal} onChange={setMrfBal} min={10000} max={2000000} step={10000} prefix={currencySymbol} placeholder="e.g. 400000" />
              <div className="grid grid-cols-2 gap-3">
                <NumberSliderInput id="mrf-currrate" label="Current Rate (%)" value={mrfCurrRate} onChange={setMrfCurrRate} min={0.5} max={20} step={0.1} suffix="%" placeholder="e.g. 7.5" />
                <NumberSliderInput id="mrf-curry" label="Remaining Years" value={mrfCurrY} onChange={setMrfCurrY} min={1} max={40} step={1} placeholder="e.g. 25" />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">New Proposed Refinance</span>
              <div className="grid grid-cols-2 gap-3">
                <NumberSliderInput id="mrf-newrate" label="New Rate (%)" value={mrfNewRate} onChange={setMrfNewRate} min={0.5} max={20} step={0.1} suffix="%" placeholder="e.g. 5.5" />
                <NumberSliderInput id="mrf-newy" label="New Term (Years)" value={mrfNewY} onChange={setMrfNewY} min={1} max={40} step={1} placeholder="e.g. 25" />
              </div>
              <NumberSliderInput id="mrf-costs" label="Refinance Closing Costs" value={mrfCosts} onChange={setMrfCosts} min={0} max={30000} step={500} prefix={currencySymbol} placeholder="e.g. 6000" />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && mortgageRefinanceResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Net Refinance Lifetime Savings
                  </span>
                  <div className={`text-3xl font-black mb-1 ${mortgageRefinanceResult.netLifetimeSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {mortgageRefinanceResult.netLifetimeSavings >= 0 ? '+' : ''}{formatMoney(mortgageRefinanceResult.netLifetimeSavings)}
                  </div>
                  <span className="text-xs text-slate-400 block mb-4">
                    Takes about <strong>{mortgageRefinanceResult.breakEvenMonths} months</strong> of monthly payment savings to cover refi closing fees.
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Old Payment</span>
                      <span className="font-bold text-base text-slate-300">
                        {formatMoney(mortgageRefinanceResult.currentMonthlyPayment)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">New Payment</span>
                      <span className="font-bold text-base text-white">
                        {formatMoney(mortgageRefinanceResult.newMonthlyPayment)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
                  <div>• Monthly Payment Savings: <span className="font-bold text-slate-900">{formatMoney(mortgageRefinanceResult.monthlySavings)}</span></div>
                  <div>• Total Refinance Costs: <span className="font-semibold text-slate-900">{formatMoney(mortgageRefinanceResult.refinanceCosts)}</span></div>
                  <div>• Gross Interest Reduction: <span className="font-semibold text-slate-900">{formatMoney(mortgageRefinanceResult.currentTotalInterest - mortgageRefinanceResult.newTotalInterest)}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Enter your current mortgage values and refi conditions on the left to see refinement breakdown.
              </div>
            )}
          </div>
        }
      />
    );
  }

  // 9. CLOSING COSTS
  if (toolSlug === 'closing-cost-calculator') {
    const isReady = closingCostsResult !== null;
    return (
      <CompactCalculatorWorkspace
        id="closing-costs"
        title="Closing Cost Calculator"
        badge="SETTLEMENT COSTS"
        description="Estimate buyer closing expenses (appraisals, title insurance, attorney, tax prepayments) for a property acquisition."
        onReset={() => {
          setCcPrice(''); setCcDownPct(''); setCcLenderOrig(''); setCcLenderPoints(''); setCcAppraisal(''); setCcTitlePct(''); setCcTaxPct(''); setCcIns('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput id="cc-price" label="Property Purchase Price" value={ccPrice} onChange={setCcPrice} min={10000} max={3000000} step={10000} prefix={currencySymbol} placeholder="e.g. 400000" />
            <NumberSliderInput id="cc-down" label="Down Payment (%)" value={ccDownPct} onChange={setCcDownPct} min={0} max={100} step={1} suffix="%" placeholder="e.g. 20" />
            
            <div className="sm:col-span-2 border-t border-slate-100 pt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Itemized Closing Cost Parameters</span>
            </div>

            <NumberSliderInput id="cc-orig" label="Lender Origination Fee" value={ccLenderOrig} onChange={setCcLenderOrig} min={0} max={10000} step={100} prefix={currencySymbol} placeholder="e.g. 1500" />
            <NumberSliderInput id="cc-points" label="Lender Points (%)" value={ccLenderPoints} onChange={setCcLenderPoints} min={0} max={5} step={0.125} suffix="%" placeholder="e.g. 1" />
            <NumberSliderInput id="cc-appr" label="Appraisal & Survey Fee" value={ccAppraisal} onChange={setCcAppraisal} min={0} max={2500} step={50} prefix={currencySymbol} placeholder="e.g. 500" />
            <NumberSliderInput id="cc-title" label="Title Insurance & Escrow (%)" value={ccTitlePct} onChange={setCcTitlePct} min={0} max={3} step={0.1} suffix="%" placeholder="e.g. 0.8" />
            <NumberSliderInput id="cc-tax" label="Transfer Taxes (%)" value={ccTaxPct} onChange={setCcTaxPct} min={0} max={4} step={0.1} suffix="%" placeholder="e.g. 1.0" />
            <NumberSliderInput id="cc-ins" label="Annual Home Insurance" value={ccIns} onChange={setCcIns} min={0} max={5000} step={100} prefix={currencySymbol} placeholder="e.g. 1200" />
          </div>
        }
        results={
          <div className="space-y-4">
            {isReady && closingCostsResult ? (
              <>
                <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                    Total Estimated Closing Costs
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mb-1">
                    {formatMoney(closingCostsResult.totalClosingCosts)}
                  </div>
                  <span className="text-xs text-slate-400 block mb-4">
                    Represents roughly <strong>{closingCostsResult.closingCostPercentage}%</strong> of the property's purchase value.
                  </span>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Total Cash Required</span>
                      <span className="font-bold text-sm text-white block">
                        {formatMoney(closingCostsResult.cashRequiredAtClosing)}
                      </span>
                      <span className="text-[10px] text-slate-500">Down Payment + Closing Fees</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Total Acquisition Cost</span>
                      <span className="font-bold text-sm text-cyan-300 block">
                        {formatMoney(closingCostsResult.totalPropertyAcquisitionCost)}
                      </span>
                      <span className="text-[10px] text-slate-500">Property Price + Fees</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 text-slate-600">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">Fee Breakdown</div>
                  <div>• Loan Principal Amount: <span className="font-bold text-slate-900">{formatMoney(closingCostsResult.loanAmount)}</span></div>
                  <div>• Title / Registration Fee: <span className="font-semibold text-slate-900">{formatMoney(closingCostsResult.titleInsuranceFee)}</span></div>
                  <div>• Transfer & Local Taxes: <span className="font-semibold text-slate-900">{formatMoney(closingCostsResult.transferTaxFee)}</span></div>
                  <div>• Points Paid to Lender: <span className="font-semibold text-slate-900">{formatMoney(closingCostsResult.lenderPointsFee)}</span></div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Provide a property purchase price on the left to compute detailed itemized closing costs.
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
      <h3 className="text-sm font-bold text-slate-900 mb-2">Verified Calculation Engine (Batch 2)</h3>
      <p className="text-xs text-slate-600 mb-4">
        This calculator runs on deterministic formulas verified to industry standards.
      </p>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
        Engine Loaded: {toolSlug}
      </div>
    </div>
  );
};
