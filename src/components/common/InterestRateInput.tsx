import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export interface InterestRateInputProps {
  id?: string;
  label?: string;
  annualRate: number | '';
  perHundredRate: number | '';
  rateMode: 'percentage_annual' | 'per_hundred_month';
  onChangeRateMode: (mode: 'percentage_annual' | 'per_hundred_month') => void;
  onChangeAnnualRate: (val: number | '') => void;
  onChangePerHundredRate: (val: number | '') => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
}

export const InterestRateInput: React.FC<InterestRateInputProps> = ({
  id = 'interest-rate-input',
  label = 'Interest Rate',
  annualRate,
  perHundredRate,
  rateMode,
  onChangeRateMode,
  onChangeAnnualRate,
  onChangePerHundredRate,
  required = true,
  min = 0,
  max = 100,
  step = 0.1,
  helperText,
}) => {
  const { currencySymbol } = useSettings();
  const currSym = currencySymbol || '₹';

  const handleModeToggle = (newMode: 'percentage_annual' | 'per_hundred_month') => {
    if (newMode === rateMode) return;
    onChangeRateMode(newMode);
    if (newMode === 'percentage_annual') {
      if (typeof perHundredRate === 'number' && perHundredRate > 0) {
        onChangeAnnualRate(Math.round(perHundredRate * 12 * 100) / 100);
      }
    } else {
      if (typeof annualRate === 'number' && annualRate > 0) {
        onChangePerHundredRate(Math.round((annualRate / 12) * 100) / 100);
      }
    }
  };

  return (
    <div id={id} className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-800 flex items-center gap-1">
          {label}
          {required && <span className="text-amber-600 font-semibold">*</span>}
        </label>
      </div>

      {/* Mode selection radio buttons */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/80 rounded-lg border border-slate-200">
        <button
          type="button"
          id={`${id}-mode-pct`}
          onClick={() => handleModeToggle('percentage_annual')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
            rateMode === 'percentage_annual'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full border ${
              rateMode === 'percentage_annual' ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'
            }`}
          />
          Percentage per year (% p.a.)
        </button>

        <button
          type="button"
          id={`${id}-mode-hundred`}
          onClick={() => handleModeToggle('per_hundred_month')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
            rateMode === 'per_hundred_month'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full border ${
              rateMode === 'per_hundred_month' ? 'bg-emerald-600 border-emerald-600' : 'border-slate-400'
            }`}
          />
          Per {currSym}100 per month
        </button>
      </div>

      {/* Input Field based on selected method */}
      {rateMode === 'percentage_annual' ? (
        <div className="relative">
          <input
            id={`${id}-annual-field`}
            type="number"
            min={min}
            max={max}
            step={step}
            value={annualRate}
            onChange={(e) => {
              const v = e.target.value;
              onChangeAnnualRate(v === '' ? '' : parseFloat(v));
              if (v !== '') {
                onChangePerHundredRate(Math.round((parseFloat(v) / 12) * 100) / 100);
              } else {
                onChangePerHundredRate('');
              }
            }}
            placeholder="e.g. 12"
            className="w-full pl-3 pr-20 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 pointer-events-none bg-slate-100 px-2 py-1 rounded border border-slate-200">
            % per year
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative">
            <input
              id={`${id}-hundred-field`}
              type="number"
              min={0}
              max={20}
              step={0.1}
              value={perHundredRate}
              onChange={(e) => {
                const v = e.target.value;
                onChangePerHundredRate(v === '' ? '' : parseFloat(v));
                if (v !== '') {
                  onChangeAnnualRate(Math.round(parseFloat(v) * 12 * 100) / 100);
                } else {
                  onChangeAnnualRate('');
                }
              }}
              placeholder="e.g. 2"
              className="w-full pl-3 pr-32 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium transition"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-emerald-700 pointer-events-none bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
              per {currSym}100 / mo
            </span>
          </div>
          {typeof perHundredRate === 'number' && perHundredRate > 0 && (
            <p className="text-xs text-slate-600 flex items-center justify-between px-1">
              <span>
                Equivalent Annual Rate:{' '}
                <strong className="text-emerald-700 font-semibold">
                  {Math.round(perHundredRate * 12 * 100) / 100}% p.a.
                </strong>
              </span>
              <span className="text-slate-400">
                ({perHundredRate} × 12 = {Math.round(perHundredRate * 12 * 100) / 100}%)
              </span>
            </p>
          )}
        </div>
      )}

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
