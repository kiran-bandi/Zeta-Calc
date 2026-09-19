import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { CreditCard, TrendingUp, PiggyBank } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import {
  calculateCreditCardPayoff,
  calculateRealReturn,
  calculateRetirementContribution,
} from '../../../engine/debtPhaseEngines';

export const DEBT_PHASE_SLUGS = [
  'credit-card-payoff-calculator',
  'real-return-calculator',
  'retirement-contribution-calculator',
];

interface Props {
  toolSlug: string;
}

export const DebtPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Credit Card Payoff
  const [ccBal, setCcBal] = useState<number | ''>('');
  const [ccApr, setCcApr] = useState<number | ''>(21.99);
  const [ccPay, setCcPay] = useState<number | ''>('');
  const ccResult = useMemo(
    () => calculateCreditCardPayoff(ccBal, ccApr, ccPay),
    [ccBal, ccApr, ccPay]
  );

  // 2. Real Return
  const [rrNominal, setRrNominal] = useState<number | ''>('');
  const [rrInflation, setRrInflation] = useState<number | ''>('');
  const [rrTax, setRrTax] = useState<number | ''>(0);
  const rrResult = useMemo(
    () => calculateRealReturn(rrNominal, rrInflation, rrTax),
    [rrNominal, rrInflation, rrTax]
  );

  // 3. Retirement Contribution
  const [rcCurrentAge, setRcCurrentAge] = useState<number | ''>('');
  const [rcRetireAge, setRcRetireAge] = useState<number | ''>(65);
  const [rcBalance, setRcBalance] = useState<number | ''>(0);
  const [rcMonthly, setRcMonthly] = useState<number | ''>('');
  const [rcReturn, setRcReturn] = useState<number | ''>(8);
  const [rcEmployer, setRcEmployer] = useState<number | ''>(0);
  const rcResult = useMemo(
    () => calculateRetirementContribution(rcCurrentAge, rcRetireAge, rcBalance, rcMonthly, rcReturn, rcEmployer),
    [rcCurrentAge, rcRetireAge, rcBalance, rcMonthly, rcReturn, rcEmployer]
  );

  // =========================================================================
  // VIEW 1: CREDIT CARD PAYOFF
  // =========================================================================
  if (toolSlug === 'credit-card-payoff-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="credit-card-payoff-calc"
        inputsTitle="Credit Card Debt & Repayment"
        resultsTitle="Debt Freedom Schedule"
        onReset={() => {
          setCcBal('');
          setCcApr(21.99);
          setCcPay('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Outstanding Credit Card Balance"
              value={ccBal}
              onChange={setCcBal}
              min={100}
              max={100000}
              step={100}
              prefix={currencySymbol}
              placeholder="e.g. 5000"
            />
            <NumberSliderInput
              label="Annual Percentage Rate (APR %)"
              value={ccApr}
              onChange={setCcApr}
              min={5}
              max={36}
              step={0.25}
              suffix="%"
              placeholder="21.99"
            />
            <NumberSliderInput
              label="Fixed Monthly Payment"
              value={ccPay}
              onChange={setCcPay}
              min={25}
              max={5000}
              step={25}
              prefix={currencySymbol}
              placeholder="e.g. 200"
            />
          </div>
        }
        results={
          ccResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-rose-300 font-semibold mb-1">
                  Time to Zero Balance
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {ccResult.monthsToPayoff} Months <span className="text-xl font-normal text-rose-300">({(ccResult.monthsToPayoff / 12).toFixed(1)} Years)</span>
                </div>
                <p className="text-sm text-rose-200">
                  Total interest charges: {formatMoney(ccResult.totalInterestPaid)} on a {formatMoney(ccResult.originalBalance)} balance.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Total Cash Paid</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(ccResult.totalPayments)}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Interest Burden Ratio</div>
                  <div className="text-lg font-bold text-rose-600 mt-0.5">{ccResult.interestRatioPercent}%</div>
                </div>
              </div>

              {ccResult.extraPaymentSavings && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <span className="font-bold">Accelerated Plan (+{formatMoney(50)}/mo):</span> Paying {formatMoney(ccResult.extraPaymentSavings.extraPayment)}/mo saves {formatMoney(ccResult.extraPaymentSavings.interestSaved)} in interest and cuts payoff time by {ccResult.extraPaymentSavings.monthsSaved} months.
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter balance, APR, and monthly payment to see exact debt freedom timeline and interest cost.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: REAL RETURN (FISHER EQUATION)
  // =========================================================================
  if (toolSlug === 'real-return-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="real-return-calc"
        inputsTitle="Nominal Return & Inflation"
        resultsTitle="Purchasing Power (Real Return)"
        onReset={() => {
          setRrNominal('');
          setRrInflation('');
          setRrTax(0);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Nominal Investment Return (Gross % p.a.)"
              value={rrNominal}
              onChange={setRrNominal}
              min={-20}
              max={50}
              step={0.5}
              suffix="%"
              placeholder="e.g. 10"
            />
            <NumberSliderInput
              label="Expected Inflation Rate (CPI % p.a.)"
              value={rrInflation}
              onChange={setRrInflation}
              min={0}
              max={25}
              step={0.25}
              suffix="%"
              placeholder="e.g. 4.5"
            />
            <NumberSliderInput
              label="Marginal Capital Gains Tax Rate (%)"
              value={rrTax}
              onChange={setRrTax}
              min={0}
              max={50}
              step={1}
              suffix="%"
              placeholder="0"
            />
          </div>
        }
        results={
          rrResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Exact Real Return (Fisher Equation)
                </div>
                <div className={`text-4xl font-extrabold tracking-tight mb-2 ${rrResult.realReturnRate >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {rrResult.realReturnRate >= 0 ? `+${rrResult.realReturnRate}%` : `${rrResult.realReturnRate}%`}
                </div>
                <p className="text-sm text-indigo-200">
                  Purchasing power growth after accounting for {rrResult.inflationRate}% annual inflation.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">After-Tax Real Return</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{rrResult.afterTaxRealReturnRate}%</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Purchasing Power Multiplier (10y)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{rrResult.purchasingPowerMultiplier10y}×</div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950">
                <span className="font-bold">Fisher Exact Formula:</span> (1 + r_nominal) / (1 + i_inflation) - 1
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter nominal return rate and inflation rate to calculate real purchasing power growth.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: RETIREMENT CONTRIBUTION
  // =========================================================================
  if (toolSlug === 'retirement-contribution-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="retirement-contribution-calc"
        inputsTitle="Retirement Savings Horizon"
        resultsTitle="Projected Nest Egg & Growth"
        onReset={() => {
          setRcCurrentAge('');
          setRcRetireAge(65);
          setRcBalance(0);
          setRcMonthly('');
          setRcReturn(8);
          setRcEmployer(0);
        }}
        inputs={
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <NumberSliderInput
                label="Current Age"
                value={rcCurrentAge}
                onChange={setRcCurrentAge}
                min={18}
                max={75}
                step={1}
                placeholder="e.g. 30"
              />
              <NumberSliderInput
                label="Target Retirement Age"
                value={rcRetireAge}
                onChange={setRcRetireAge}
                min={40}
                max={85}
                step={1}
                placeholder="65"
              />
            </div>
            <NumberSliderInput
              label="Current Retirement Portfolio Balance"
              value={rcBalance}
              onChange={setRcBalance}
              min={0}
              max={2000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="0"
            />
            <NumberSliderInput
              label="Your Monthly Contribution"
              value={rcMonthly}
              onChange={setRcMonthly}
              min={50}
              max={20000}
              step={50}
              prefix={currencySymbol}
              placeholder="e.g. 500"
            />
            <NumberSliderInput
              label="Employer Monthly Match / Contribution"
              value={rcEmployer}
              onChange={setRcEmployer}
              min={0}
              max={5000}
              step={25}
              prefix={currencySymbol}
              placeholder="0"
            />
            <NumberSliderInput
              label="Expected Annual Return (%)"
              value={rcReturn}
              onChange={setRcReturn}
              min={1}
              max={15}
              step={0.5}
              suffix="%"
              placeholder="8"
            />
          </div>
        }
        results={
          rcResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Projected Nest Egg at Age {rcResult.retirementAge}
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(rcResult.futureNestEgg)}
                </div>
                <p className="text-sm text-indigo-200">
                  Provides an estimated safe monthly retirement withdrawal of {formatMoney(rcResult.estimatedMonthlyRetirementIncome)} (4% safe rule).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Total Contributions</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(rcResult.totalContributions)}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Compound Interest Earned</div>
                  <div className="text-lg font-bold text-emerald-600 mt-0.5">{formatMoney(rcResult.totalCompoundGrowth)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <PiggyBank className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter current age, target retirement age, and monthly contribution to project future nest egg.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
