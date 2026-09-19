import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { calculateTaxImpactComparison, TaxScenarioInput } from '../../engine/taxImpactEngine';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { RotateCcw, Copy, ArrowRight, TrendingUp, TrendingDown, Receipt, CheckCircle2 } from 'lucide-react';

export const TaxImpactCalculatorView: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  // Scenario A States
  const [grossA, setGrossA] = useSessionState<number | ''>('tax_imp_gross_a', 100000);
  const [otherIncomeA, setOtherIncomeA] = useSessionState<number | ''>('tax_imp_other_a', 0);
  const [preTaxA, setPreTaxA] = useSessionState<number | ''>('tax_imp_pretax_a', 5000);
  const [deductionsA, setDeductionsA] = useSessionState<number | ''>('tax_imp_deduct_a', 13850);
  const [creditsA, setCreditsA] = useSessionState<number | ''>('tax_imp_credits_a', 0);
  const [rateA, setRateA] = useSessionState<number | ''>('tax_imp_rate_a', 22);

  // Scenario B States
  const [grossB, setGrossB] = useSessionState<number | ''>('tax_imp_gross_b', 120000);
  const [otherIncomeB, setOtherIncomeB] = useSessionState<number | ''>('tax_imp_other_b', 0);
  const [preTaxB, setPreTaxB] = useSessionState<number | ''>('tax_imp_pretax_b', 8000);
  const [deductionsB, setDeductionsB] = useSessionState<number | ''>('tax_imp_deduct_b', 13850);
  const [creditsB, setCreditsB] = useSessionState<number | ''>('tax_imp_credits_b', 0);
  const [rateB, setRateB] = useSessionState<number | ''>('tax_imp_rate_b', 24);

  const resetAll = () => {
    setGrossA('');
    setOtherIncomeA(0);
    setPreTaxA(0);
    setDeductionsA(0);
    setCreditsA(0);
    setRateA('');

    setGrossB('');
    setOtherIncomeB(0);
    setPreTaxB(0);
    setDeductionsB(0);
    setCreditsB(0);
    setRateB('');
  };

  const copyAtoB = () => {
    setGrossB(grossA);
    setOtherIncomeB(otherIncomeA);
    setPreTaxB(preTaxA);
    setDeductionsB(deductionsA);
    setCreditsB(creditsA);
    setRateB(rateA);
  };

  const comparison = React.useMemo(() => {
    if (
      typeof grossA !== 'number' || grossA < 0 ||
      typeof rateA !== 'number' || rateA < 0 ||
      typeof grossB !== 'number' || grossB < 0 ||
      typeof rateB !== 'number' || rateB < 0
    ) {
      return null;
    }

    const inputA: TaxScenarioInput = {
      grossIncome: grossA,
      otherTaxableIncome: typeof otherIncomeA === 'number' ? otherIncomeA : 0,
      preTaxDeductions: typeof preTaxA === 'number' ? preTaxA : 0,
      taxDeductions: typeof deductionsA === 'number' ? deductionsA : 0,
      taxCredits: typeof creditsA === 'number' ? creditsA : 0,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: rateA,
    };

    const inputB: TaxScenarioInput = {
      grossIncome: grossB,
      otherTaxableIncome: typeof otherIncomeB === 'number' ? otherIncomeB : 0,
      preTaxDeductions: typeof preTaxB === 'number' ? preTaxB : 0,
      taxDeductions: typeof deductionsB === 'number' ? deductionsB : 0,
      taxCredits: typeof creditsB === 'number' ? creditsB : 0,
      taxRateMode: 'effective_rate',
      effectiveTaxRate: rateB,
    };

    return calculateTaxImpactComparison(inputA, inputB);
  }, [
    grossA, otherIncomeA, preTaxA, deductionsA, creditsA, rateA,
    grossB, otherIncomeB, preTaxB, deductionsB, creditsB, rateB,
  ]);

  const marginalRateOnExtra = React.useMemo(() => {
    if (!comparison) return null;
    const grossDiff = comparison.scenarioB.totalIncome - comparison.scenarioA.totalIncome;
    if (grossDiff > 0) {
      return (comparison.taxDifference / grossDiff) * 100;
    }
    return null;
  }, [comparison]);

  const monthlyCashDelta = React.useMemo(() => {
    if (!comparison) return 0;
    return comparison.afterTaxIncomeDifference / 12;
  }, [comparison]);

  return (
    <div className="space-y-8">
      {/* Top Header & Reset Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            Side-by-Side Dual Scenario Modeling
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Model how promotions, raises, extra income, retirement deductions, or tax rate changes impact your take-home pay.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={copyAtoB}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-1.5 shadow-xs transition"
            title="Duplicate Scenario A values into Scenario B for easy incremental adjustments"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy A → B
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-rose-600 hover:border-rose-200 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Side-by-Side Scenario Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SCENARIO A */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                A
              </span>
              <h3 className="text-sm font-bold text-slate-900">Current / Baseline Scenario</h3>
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">Baseline</span>
          </div>

          <NumberSliderInput
            label="Gross Annual Salary"
            value={grossA}
            onChange={setGrossA}
            min={0}
            max={10000000}
            step={1000}
            unitPrefix={currencySymbol}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberSliderInput
              label="Other Income / Bonus"
              value={otherIncomeA}
              onChange={setOtherIncomeA}
              min={0}
              max={1000000}
              step={500}
              unitPrefix={currencySymbol}
            />
            <NumberSliderInput
              label="Pre-Tax Deductions (401k/HSA)"
              value={preTaxA}
              onChange={setPreTaxA}
              min={0}
              max={100000}
              step={500}
              unitPrefix={currencySymbol}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberSliderInput
              label="Tax Deductions (Standard/80C)"
              value={deductionsA}
              onChange={setDeductionsA}
              min={0}
              max={200000}
              step={500}
              unitPrefix={currencySymbol}
            />
            <NumberSliderInput
              label="Direct Tax Credits"
              value={creditsA}
              onChange={setCreditsA}
              min={0}
              max={50000}
              step={250}
              unitPrefix={currencySymbol}
            />
          </div>

          <NumberSliderInput
            label="Estimated Effective Tax Rate (%)"
            value={rateA}
            onChange={setRateA}
            min={0}
            max={50}
            step={0.5}
            unitSuffix="%"
            helperText="Combined federal/state/provincial effective rate"
            required
          />
        </div>

        {/* SCENARIO B */}
        <div className="bg-white p-6 rounded-2xl border border-blue-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                B
              </span>
              <h3 className="text-sm font-bold text-slate-900">Proposed / New Scenario</h3>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Target
            </span>
          </div>

          <NumberSliderInput
            label="Gross Annual Salary"
            value={grossB}
            onChange={setGrossB}
            min={0}
            max={10000000}
            step={1000}
            unitPrefix={currencySymbol}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <NumberSliderInput
              label="Other Income / Bonus"
              value={otherIncomeB}
              onChange={setOtherIncomeB}
              min={0}
              max={1000000}
              step={500}
              unitPrefix={currencySymbol}
            />
            <NumberSliderInput
              label="Pre-Tax Deductions (401k/HSA)"
              value={preTaxB}
              onChange={setPreTaxB}
              min={0}
              max={100000}
              step={500}
              unitPrefix={currencySymbol}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberSliderInput
              label="Tax Deductions (Standard/80C)"
              value={deductionsB}
              onChange={setDeductionsB}
              min={0}
              max={200000}
              step={500}
              unitPrefix={currencySymbol}
            />
            <NumberSliderInput
              label="Direct Tax Credits"
              value={creditsB}
              onChange={setCreditsB}
              min={0}
              max={50000}
              step={250}
              unitPrefix={currencySymbol}
            />
          </div>

          <NumberSliderInput
            label="Estimated Effective Tax Rate (%)"
            value={rateB}
            onChange={setRateB}
            min={0}
            max={50}
            step={0.5}
            unitSuffix="%"
            helperText="Combined federal/state/provincial effective rate"
            required
          />
        </div>
      </div>

      {/* COMPARISON RESULTS SECTION */}
      {comparison ? (
        <div className="space-y-6">
          {/* Executive Summary Banner */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Financial Impact Analysis</h3>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {comparison.taxDifference >= 0
                  ? `Additional Tax: +${formatMoney(comparison.taxDifference)}/yr`
                  : `Tax Savings: ${formatMoney(Math.abs(comparison.taxDifference))}/yr`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Take-home Delta */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Annual Net Take-Home Impact</div>
                <div className={`text-2xl font-black mt-1 flex items-center gap-1.5 ${
                  comparison.afterTaxIncomeDifference >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {comparison.afterTaxIncomeDifference >= 0 ? (
                    <TrendingUp className="w-6 h-6 shrink-0" />
                  ) : (
                    <TrendingDown className="w-6 h-6 shrink-0" />
                  )}
                  <span>
                    {comparison.afterTaxIncomeDifference >= 0 ? '+' : ''}
                    {formatMoney(comparison.afterTaxIncomeDifference)}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Change in total annual cash after tax</div>
              </div>

              {/* Monthly Take-home Delta */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Monthly Cash Flow Impact</div>
                <div className={`text-2xl font-black mt-1 ${
                  monthlyCashDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {monthlyCashDelta >= 0 ? '+' : ''}
                  {formatMoney(monthlyCashDelta)}/mo
                </div>
                <div className="text-xs text-slate-500 mt-1">Extra cash in your monthly paycheck</div>
              </div>

              {/* Marginal Tax on Additional Income */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Marginal Rate on Extra Income</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {marginalRateOnExtra !== null
                    ? `${marginalRateOnExtra.toFixed(1)}%`
                    : 'N/A'}
                </div>
                <div className="text-xs text-slate-500 mt-1">Fraction of new earnings lost to tax</div>
              </div>
            </div>
          </div>

          {/* Granular Side-by-Side Comparison Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-sm">Detailed Metric Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Scenario A (Baseline)</th>
                    <th className="py-3 px-4 text-blue-700">Scenario B (Proposed)</th>
                    <th className="py-3 px-4 text-right">Net Change (Δ)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Total Gross Income</td>
                    <td className="py-3 px-4 text-slate-700">{formatMoney(comparison.scenarioA.totalIncome)}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{formatMoney(comparison.scenarioB.totalIncome)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {comparison.scenarioB.totalIncome - comparison.scenarioA.totalIncome >= 0 ? '+' : ''}
                      {formatMoney(comparison.scenarioB.totalIncome - comparison.scenarioA.totalIncome)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Total Deductions (Pre-tax + Tax)</td>
                    <td className="py-3 px-4 text-slate-700">
                      {formatMoney(comparison.scenarioA.preTaxDeductions + comparison.scenarioA.taxDeductions)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {formatMoney(comparison.scenarioB.preTaxDeductions + comparison.scenarioB.taxDeductions)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {(comparison.scenarioB.preTaxDeductions + comparison.scenarioB.taxDeductions) -
                        (comparison.scenarioA.preTaxDeductions + comparison.scenarioA.taxDeductions) >= 0 ? '+' : ''}
                      {formatMoney(
                        (comparison.scenarioB.preTaxDeductions + comparison.scenarioB.taxDeductions) -
                        (comparison.scenarioA.preTaxDeductions + comparison.scenarioA.taxDeductions)
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Taxable Income</td>
                    <td className="py-3 px-4 text-slate-700">{formatMoney(comparison.scenarioA.taxableIncome)}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{formatMoney(comparison.scenarioB.taxableIncome)}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {comparison.scenarioB.taxableIncome - comparison.scenarioA.taxableIncome >= 0 ? '+' : ''}
                      {formatMoney(comparison.scenarioB.taxableIncome - comparison.scenarioA.taxableIncome)}
                    </td>
                  </tr>
                  <tr className="bg-rose-50/30">
                    <td className="py-3 px-4 font-medium text-slate-900">Estimated Total Tax</td>
                    <td className="py-3 px-4 text-slate-700">{formatMoney(comparison.scenarioA.estimatedTax)}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{formatMoney(comparison.scenarioB.estimatedTax)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      comparison.taxDifference > 0 ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {comparison.taxDifference >= 0 ? '+' : ''}
                      {formatMoney(comparison.taxDifference)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Effective Tax Rate</td>
                    <td className="py-3 px-4 text-slate-700">{comparison.scenarioA.effectiveTaxRate.toFixed(2)}%</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{comparison.scenarioB.effectiveTaxRate.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-900">
                      {comparison.effectiveTaxRateDifference >= 0 ? '+' : ''}
                      {comparison.effectiveTaxRateDifference.toFixed(2)}%
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="py-3 px-4 font-bold text-slate-900">Annual Net Take-Home Pay</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{formatMoney(comparison.scenarioA.afterTaxIncome)}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">{formatMoney(comparison.scenarioB.afterTaxIncome)}</td>
                    <td className={`py-3 px-4 text-right font-black ${
                      comparison.afterTaxIncomeDifference >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {comparison.afterTaxIncomeDifference >= 0 ? '+' : ''}
                      {formatMoney(comparison.afterTaxIncomeDifference)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-900">Monthly Net Take-Home</td>
                    <td className="py-3 px-4 text-slate-700">{formatMoney(comparison.scenarioA.afterTaxIncome / 12)}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-700">{formatMoney(comparison.scenarioB.afterTaxIncome / 12)}</td>
                    <td className={`py-3 px-4 text-right font-bold ${
                      monthlyCashDelta >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {monthlyCashDelta >= 0 ? '+' : ''}
                      {formatMoney(monthlyCashDelta)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
          <Receipt className="w-10 h-10 mx-auto text-slate-400 mb-3" />
          <p className="font-medium text-slate-700">Enter income and tax rates for both scenarios</p>
          <p className="text-xs text-slate-500 mt-1">Fill in the required inputs to see immediate side-by-side marginal analysis.</p>
        </div>
      )}
    </div>
  );
};
