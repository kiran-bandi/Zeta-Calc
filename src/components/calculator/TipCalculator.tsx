import React, { useState, useMemo } from 'react';
import { RotateCcw, Users, Share2 } from 'lucide-react';
import { calculateTip } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { CurrencyInput } from '../common/CurrencyInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { DonutChart } from '../common/DonutChart';

export const TipCalculator: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  const [billAmount, setBillAmount] = useState<number | ''>('');
  const [tipPercentage, setTipPercentage] = useState<number | ''>('');
  const [splitCount, setSplitCount] = useState<number | ''>('');
  const [roundMode, setRoundMode] = useState<'none' | 'round_total' | 'round_tip'>('none');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const tipPresets = [10, 15, 18, 20, 25];

  const handleReset = () => {
    setBillAmount('');
    setTipPercentage('');
    setSplitCount('');
    setRoundMode('none');
  };

  const parsedBill = typeof billAmount === 'number' && !isNaN(billAmount) && billAmount > 0 ? billAmount : null;
  const parsedTip = typeof tipPercentage === 'number' && !isNaN(tipPercentage) && tipPercentage >= 0 ? tipPercentage : null;
  const parsedPeople = typeof splitCount === 'number' && !isNaN(splitCount) && splitCount > 0 ? Math.floor(splitCount) : null;

  const result = useMemo(() => {
    if (!parsedBill) return null;
    const effectiveTip = parsedTip !== null ? parsedTip : 15;
    const effectivePeople = parsedPeople !== null ? parsedPeople : 1;

    return calculateTip({
      billAmount: parsedBill,
      tipPercentage: effectiveTip,
      splitCount: effectivePeople,
      roundMode,
    });
  }, [parsedBill, parsedTip, parsedPeople, roundMode]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result || !parsedBill) return null;
    return {
      toolSlug: 'tip-calculator',
      toolName: 'Tip & Bill Split Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Subtotal Bill', value: formatMoney(parsedBill, true) },
        { label: 'Tip Percentage', value: `${parsedTip ?? 15}%` },
        { label: 'Split Count', value: `${parsedPeople ?? 1} Person(s)` },
      ],
      outputs: [
        { label: 'Total Bill with Tip', value: formatMoney(result.totalBill, true), isHighlight: true },
        { label: 'Total Tip Amount', value: formatMoney(result.tipAmount, true) },
        { label: 'Per Person Total', value: formatMoney(result.perPersonBill, true) },
        { label: 'Per Person Tip', value: formatMoney(result.perPersonTip, true) },
      ],
      customUrlParams: {
        bill: parsedBill,
        tip: parsedTip ?? 15,
        split: parsedPeople ?? 1,
      },
    };
  }, [result, parsedBill, parsedTip, parsedPeople, formatMoney]);

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Dining & Gratuity Details</h3>
        <button
          type="button"
          id="tip-reset-btn"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-5">
        <CurrencyInput
          id="tip-bill"
          label="Bill Amount (Subtotal)"
          value={billAmount}
          onChange={(val) => setBillAmount(typeof val === 'number' ? val : '')}
          min={1}
          max={1000000}
          step={1}
          placeholder="e.g. 85.00"
        />

        {/* Tip Percentage Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs sm:text-sm font-semibold text-slate-800">
              Tip Percentage
            </label>
            <span className="text-xs font-bold text-blue-600">
              {parsedTip !== null ? `${parsedTip}%` : 'Select or enter tip %'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-2">
            {tipPresets.map((pct) => (
              <button
                key={pct}
                type="button"
                id={`tip-preset-${pct}`}
                onClick={() => setTipPercentage(pct)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  tipPercentage === pct
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={40}
              step={1}
              value={parsedTip !== null ? parsedTip : 15}
              onChange={(e) => setTipPercentage(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="w-20">
              <input
                type="number"
                min={0}
                max={100}
                placeholder="Custom %"
                value={tipPercentage}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : Number(e.target.value);
                  setTipPercentage(v);
                }}
                className="w-full text-center px-2 py-1 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Number of People to Split With */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Split the Bill</span>
              </span>
              <span className="text-[11px] text-slate-500">Divide total check equally</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="split-count-decrement"
                onClick={() => {
                  const current = parsedPeople !== null ? parsedPeople : 1;
                  setSplitCount(Math.max(1, current - 1));
                }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-2xs"
                aria-label="Decrease people"
              >
                -
              </button>

              <input
                type="number"
                min={1}
                max={100}
                id="split-count-input"
                value={splitCount}
                onChange={(e) => {
                  const val = e.target.value === '' ? '' : Math.max(1, Number(e.target.value));
                  setSplitCount(val);
                }}
                placeholder="1"
                className="w-14 text-center font-bold text-slate-900 text-sm py-1 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />

              <button
                type="button"
                id="split-count-increment"
                onClick={() => {
                  const current = parsedPeople !== null ? parsedPeople : 1;
                  setSplitCount(Number(current) + 1);
                }}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-sm shadow-2xs"
                aria-label="Increase people"
              >
                +
              </button>
            </div>
          </div>

          {parsedBill !== null && (splitCount === '' || splitCount === 0) && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 font-medium">
              Enter number of people to calculate per-person split (defaulting to 1 person below).
            </p>
          )}
        </div>

        {/* Round Total Options */}
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-1.5">
            Rounding Option
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="round-mode-none"
              onClick={() => setRoundMode('none')}
              className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                roundMode === 'none'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Exact Cents
            </button>
            <button
              type="button"
              id="round-mode-total"
              onClick={() => setRoundMode('round_total')}
              className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                roundMode === 'round_total'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Round Total Up
            </button>
            <button
              type="button"
              id="round-mode-tip"
              onClick={() => setRoundMode('round_tip')}
              className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-all ${
                roundMode === 'round_tip'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Round Tip Up
            </button>
          </div>
        </div>
      </div>

      {/* Results Box */}
      {result ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Total Per Person ({parsedPeople ? parsedPeople : 1} {parsedPeople === 1 || !parsedPeople ? 'person' : 'people'})
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">
                  Tip: {formatMoney(result.perPersonTip, true)} / person
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
              {formatMoney(result.perPersonBill, true)}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">
                  Total Gratuity ({parsedTip !== null ? parsedTip : 15}%)
                </span>
                <span className="font-bold text-emerald-400 text-base">
                  {formatMoney(result.tipAmount, true)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Total Group Check</span>
                <span className="font-bold text-white text-base">
                  {formatMoney(result.totalBill, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Visual Summary Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Check & Gratuity Split</h3>
            <DonutChart
              size={180}
              centerTitle="Total Check"
              centerSubtitle={formatMoney(result.totalBill, true)}
              segments={[
                {
                  label: 'Subtotal Bill',
                  value: parsedBill || 0,
                  color: '#2563eb',
                  formattedValue: formatMoney(parsedBill || 0, true),
                },
                {
                  label: 'Gratuity Tip',
                  value: result.tipAmount,
                  color: '#10b981',
                  formattedValue: formatMoney(result.tipAmount, true),
                },
              ]}
            />
          </div>

          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="Tip & Bill Split Results"
            toolName="Tip & Bill Split Calculator"
            toolSlug="tip-calculator"
            categorySlug="finance"
            description={`Total bill is ${formatMoney(result.totalBill, true)} (${formatMoney(result.perPersonBill, true)} per person for ${parsedPeople || 1} people). Calculate tip splits on Zeta Calculator!`}
            calculationData={calculationShareData}
          />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-700">Enter bill amount above</p>
          <p className="text-xs text-slate-500 mt-1">
            Calculates gratuity, split totals per person, and rounding adjustments.
          </p>
        </div>
      )}
    </div>
  );
};
