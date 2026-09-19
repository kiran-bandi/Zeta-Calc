import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { calculateROI } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { DonutChart } from '../common/DonutChart';

export const ROICalculator: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  const [initialInvestment, setInitialInvestment] = useState<number | ''>('');
  const [finalValue, setFinalValue] = useState<number | ''>('');
  const [investmentYears, setInvestmentYears] = useState<number | ''>('');
  const [horizonUnit, setHorizonUnit] = useState<'years' | 'months'>('years');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const result = useMemo(() => {
    if (
      typeof initialInvestment !== 'number' ||
      initialInvestment <= 0 ||
      typeof finalValue !== 'number'
    ) {
      return null;
    }
    const rawYears = typeof investmentYears === 'number' && investmentYears > 0 ? investmentYears : 1;
    const effectiveYears = horizonUnit === 'months' ? rawYears / 12 : rawYears;

    return calculateROI({
      initialInvestment,
      finalValue,
      investmentYears: effectiveYears,
    });
  }, [initialInvestment, finalValue, investmentYears, horizonUnit]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result || typeof initialInvestment !== 'number' || typeof finalValue !== 'number') return null;
    return {
      toolSlug: 'roi-calculator',
      toolName: 'ROI (Return on Investment) Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Initial Investment', value: formatMoney(initialInvestment, true) },
        { label: 'Final Value / Proceeds', value: formatMoney(finalValue, true) },
        ...(typeof investmentYears === 'number' && investmentYears > 0 ? [{ label: 'Investment Horizon', value: `${investmentYears} ${horizonUnit}` }] : []),
      ],
      outputs: [
        { label: 'Return on Investment (ROI)', value: `${result.roiPercentage}%`, isHighlight: true },
        { label: result.isProfit ? 'Net Profit' : 'Net Loss', value: formatMoney(result.netProfit, true) },
        { label: 'Annualized ROI (CAGR)', value: `${result.annualizedRoiPercentage}% p.a.` },
      ],
      customUrlParams: {
        invest: initialInvestment,
        final: finalValue,
        ...(typeof investmentYears === 'number' && investmentYears > 0 ? { t: investmentYears, u: horizonUnit } : {}),
      },
    };
  }, [result, initialInvestment, finalValue, investmentYears, horizonUnit, formatMoney]);

  const handleReset = () => {
    setInitialInvestment('');
    setFinalValue('');
    setInvestmentYears('');
    setHorizonUnit('years');
  };

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        <CurrencyInput
          id="roi-initial"
          label="Amount Invested (Cost Basis)"
          value={initialInvestment}
          onChange={setInitialInvestment}
          min={1}
          max={1000000000}
          step={100}
        />
        <CurrencyInput
          id="roi-final"
          label="Amount Returned (Final Proceeds)"
          value={finalValue}
          onChange={setFinalValue}
          min={0}
          max={1000000000}
          step={100}
        />
        <UnitNumberInput
          id="roi-years"
          label="Investment Horizon"
          value={investmentYears}
          onChange={setInvestmentYears}
          min={0.1}
          max={600}
          step={0.5}
          units={[
            { id: 'years', label: 'Years', symbol: 'Years' },
            { id: 'months', label: 'Months', symbol: 'Months' },
          ]}
          currentUnit={horizonUnit}
          onUnitChange={(u) => setHorizonUnit(u as 'years' | 'months')}
          helpText="Used to compute annualized CAGR"
        />

        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            id="roi-reset-btn"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Total Return on Investment (ROI)
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                    result.isProfit
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {result.isProfit ? 'PROFIT' : 'LOSS'}
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

            <div
              className={`text-4xl sm:text-5xl font-black tracking-tight mb-4 ${
                result.isProfit ? 'text-white' : 'text-rose-400'
              }`}
            >
              {result.roiPercentage > 0 ? '+' : ''}
              {result.roiPercentage}%
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Net Gain / Loss</span>
                <span
                  className={`font-bold text-base ${
                    result.isProfit ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.netProfit > 0 ? '+' : ''}
                  {formatMoney(result.netProfit, true)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Annualized Return (CAGR)</span>
                <span className="font-bold text-white text-base">
                  {result.annualizedRoiPercentage > 0 ? '+' : ''}
                  {result.annualizedRoiPercentage}% / yr
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Profit Margin</span>
                <span className="font-bold text-white text-base">
                  {result.profitMarginPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Visual Summary Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Investment Capital vs Net Returns</h3>
            <DonutChart
              size={180}
              centerTitle="Final Proceeds"
              centerSubtitle={formatMoney(Number(finalValue) || 0, true)}
              segments={[
                {
                  label: 'Initial Cost Basis',
                  value: Number(initialInvestment) || 0,
                  color: '#2563eb',
                  formattedValue: formatMoney(Number(initialInvestment) || 0, true),
                },
                {
                  label: result.isProfit ? 'Net Profit' : 'Net Loss',
                  value: Math.abs(result.netProfit),
                  color: result.isProfit ? '#10b981' : '#f43f5e',
                  formattedValue: formatMoney(result.netProfit, true),
                },
              ]}
            />
          </div>

          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="ROI Calculation Results"
            toolName="ROI (Return on Investment) Calculator"
            toolSlug="roi-calculator"
            categorySlug="finance"
            description={`My total ROI is ${result.roiPercentage}% (${result.isProfit ? 'Net Gain' : 'Loss'} of ${formatMoney(result.netProfit, true)}). Calculate your return on investment on Zeta Calculator!`}
            calculationData={calculationShareData}
          />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-700">Enter invested amount and proceeds above</p>
          <p className="text-xs text-slate-500 mt-1">Calculates total ROI percentage, net profit or loss, and annualized return (CAGR).</p>
        </div>
      )}
    </div>
  );
};
