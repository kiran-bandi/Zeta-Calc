import React, { useState, useMemo } from 'react';
import { Share2, RefreshCw } from 'lucide-react';
import { calculateSalary, PayPeriod } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { DonutChart } from '../common/DonutChart';

export const SalaryCalculator: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  const [payAmount, setPayAmount] = useState<number | ''>('');
  const [payPeriod, setPayPeriod] = useState<PayPeriod>('annual');
  const [hoursPerWeek, setHoursPerWeek] = useState<number | ''>('');
  const [taxPercentage, setTaxPercentage] = useState<number | ''>('');
  const [deductionsPercentage, setDeductionsPercentage] = useState<number | ''>('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const periods: { id: PayPeriod; label: string }[] = [
    { id: 'annual', label: 'Per Year' },
    { id: 'monthly', label: 'Per Month' },
    { id: 'biweekly', label: 'Bi-Weekly' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'hourly', label: 'Hourly' },
  ];

  const result = useMemo(() => {
    if (typeof payAmount !== 'number' || payAmount <= 0) return null;
    return calculateSalary({
      payAmount,
      payPeriod,
      hoursPerWeek: typeof hoursPerWeek === 'number' && hoursPerWeek > 0 ? hoursPerWeek : 40,
      taxPercentage: typeof taxPercentage === 'number' ? taxPercentage : 0,
      deductionsPercentage: typeof deductionsPercentage === 'number' ? deductionsPercentage : 0,
    });
  }, [payAmount, payPeriod, hoursPerWeek, taxPercentage, deductionsPercentage]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result || typeof payAmount !== 'number') return null;
    return {
      toolSlug: 'salary-calculator',
      toolName: 'Salary & Take-Home Pay Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Pay Amount', value: `${formatMoney(payAmount)} (${payPeriod})` },
        ...(typeof taxPercentage === 'number' && taxPercentage > 0 ? [{ label: 'Estimated Tax', value: `${taxPercentage}%` }] : []),
      ],
      outputs: [
        { label: 'Annual Net Take-Home', value: formatMoney(result.annualNet), isHighlight: true },
        { label: 'Monthly Net Take-Home', value: `${formatMoney(result.monthlyNet)} / month` },
        { label: 'Annual Gross Salary', value: formatMoney(result.annualGross) },
        { label: 'Total Tax Deductions', value: formatMoney(result.annualTax) },
      ],
      customUrlParams: {
        pay: payAmount,
        period: payPeriod,
        ...(typeof taxPercentage === 'number' ? { tax: taxPercentage } : {}),
      },
    };
  }, [result, payAmount, payPeriod, taxPercentage, formatMoney]);

  const handleReset = () => {
    setPayAmount('');
    setPayPeriod('annual');
    setHoursPerWeek('');
    setTaxPercentage('');
    setDeductionsPercentage('');
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-800 block">
              Gross Pay Frequency
            </label>
            <button
              type="button"
              id="salary-reset-btn"
              onClick={handleReset}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset fields"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {periods.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPayPeriod(p.id)}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                  payPeriod === p.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <CurrencyInput
          id="salary-amount"
          label="Gross Salary / Rate"
          value={payAmount}
          onChange={setPayAmount}
          min={0}
          max={100000000}
          step={payPeriod === 'hourly' ? 1 : 1000}
          placeholder="Enter gross salary amount"
        />

        {payPeriod === 'hourly' && (
          <UnitNumberInput
            id="salary-hours"
            label="Hours Worked Per Week"
            value={hoursPerWeek}
            onChange={setHoursPerWeek}
            min={0}
            max={100}
            step={1}
            helpText="Standard full-time is 40h"
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UnitNumberInput
            id="salary-tax"
            label="Estimated Income Tax Rate"
            value={taxPercentage}
            onChange={setTaxPercentage}
            min={0}
            max={60}
            step={0.5}
            units={[{ id: 'pct', label: '%', symbol: '%' }]}
            helpText="Federal/State or TDS rate"
          />
          <UnitNumberInput
            id="salary-deductions"
            label="Retirement & Benefits"
            value={deductionsPercentage}
            onChange={setDeductionsPercentage}
            min={0}
            max={40}
            step={0.5}
            units={[{ id: 'pct', label: '%', symbol: '%' }]}
            helpText="401k, EPF, Health Insurance"
          />
        </div>
      </div>

      {/* Primary Result Display */}
      {result ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Net Monthly Take-Home Pay (In-Hand)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {result.netTakeHomePercentage}% Retained
                </span>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl border border-slate-700 transition-colors shadow-2xs"
                  title="Share results to social media"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-5">
              {formatMoney(result.monthlyNet)}
            </div>

            {/* Breakdown table across frequencies */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-bold uppercase text-slate-500">
                    <th className="pb-2">Frequency</th>
                    <th className="pb-2 text-right">Gross Pay</th>
                    <th className="pb-2 text-right text-white">Net In-Hand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  <tr>
                    <td className="py-2">Annual (Yearly)</td>
                    <td className="py-2 text-right text-slate-400">{formatMoney(result.annualGross)}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{formatMoney(result.annualNet)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Monthly</td>
                    <td className="py-2 text-right text-slate-400">{formatMoney(result.monthlyGross)}</td>
                    <td className="py-2 text-right font-bold text-emerald-400">{formatMoney(result.monthlyNet)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Bi-Weekly (every 2 wks)</td>
                    <td className="py-2 text-right text-slate-400">{formatMoney(result.biweeklyGross)}</td>
                    <td className="py-2 text-right font-bold text-white">{formatMoney(result.biweeklyNet)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Weekly</td>
                    <td className="py-2 text-right text-slate-400">{formatMoney(result.weeklyGross)}</td>
                    <td className="py-2 text-right font-bold text-white">{formatMoney(result.weeklyNet)}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Hourly Rate</td>
                    <td className="py-2 text-right text-slate-400">{formatMoney(result.hourlyGross, true)}</td>
                    <td className="py-2 text-right font-bold text-white">{formatMoney(result.hourlyNet, true)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual Summary Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Annual Gross Salary Allocation</h3>
            <DonutChart
              size={180}
              centerTitle="Annual Net"
              centerSubtitle={formatMoney(result.annualNet)}
              segments={[
                {
                  label: 'Net Take-Home Pay',
                  value: result.annualNet,
                  color: '#10b981',
                  formattedValue: formatMoney(result.annualNet),
                },
                {
                  label: 'Income Tax',
                  value: result.annualTax,
                  color: '#f43f5e',
                  formattedValue: formatMoney(result.annualTax),
                },
                {
                  label: 'Other Deductions',
                  value: result.annualDeductions,
                  color: '#f59e0b',
                  formattedValue: formatMoney(result.annualDeductions),
                },
              ]}
            />
          </div>

          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="Salary Breakdown Results"
            toolName="Salary & Take-Home Pay Calculator"
            toolSlug="salary-calculator"
            categorySlug="finance"
            description={`My estimated monthly net in-hand salary is ${formatMoney(result.monthlyNet)} (${result.netTakeHomePercentage}% of gross). Calculate your pay breakdown on Zeta Calculator!`}
            calculationData={calculationShareData}
          />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-700">Enter salary or pay amount above</p>
          <p className="text-xs text-slate-500 mt-1">Calculates take-home pay, tax deductions, and converted hourly/weekly/monthly rates.</p>
        </div>
      )}
    </div>
  );
};
