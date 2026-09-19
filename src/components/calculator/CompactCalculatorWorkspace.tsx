import React, { useEffect } from 'react';
import { RotateCcw, Share2, Globe } from 'lucide-react';
import { CalculationShareData, setActiveCalculationData } from '../../utils/shareUtils';
import { useSettings } from '../../context/SettingsContext';
import { CURRENCIES } from '../../data/currencies';
import { CurrencyCode } from '../../types/globalization';

export interface CompactCalculatorWorkspaceProps {
  id?: string;
  title?: string;
  description?: string;
  badge?: string;
  inputsTitle?: string;
  resultsTitle?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  onReset?: () => void;
  resetLabel?: string;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onShare?: () => void;
  calculationData?: CalculationShareData | null;
  showCurrencySelector?: boolean;
}

export const CompactCalculatorWorkspace: React.FC<CompactCalculatorWorkspaceProps> = ({
  id = 'compact-calc-workspace',
  title,
  description,
  badge,
  inputsTitle = 'Inputs',
  resultsTitle = 'Results & Projections',
  inputs,
  results,
  onReset,
  resetLabel = 'Reset',
  actions,
  footer,
  className = '',
  onShare,
  calculationData,
  showCurrencySelector = false,
}) => {
  const { preferences, setCurrency } = useSettings();

  useEffect(() => {
    if (calculationData) {
      setActiveCalculationData(calculationData);
    }
  }, [calculationData]);

  return (
    <div
      id={id}
      data-calculator-workspace="true"
      className={`bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden ${className}`}
    >
      {/* Optional integrated header if provided */}
      {(title || description || badge) && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              {badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100/80 text-blue-700 uppercase tracking-wider">
                  {badge}
                </span>
              )}
              {title && <h2 className="text-base font-bold text-slate-900">{title}</h2>}
            </div>
            {description && <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{description}</p>}
          </div>
          {onReset && (
            <button
              type="button"
              id={`${id}-header-reset-btn`}
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>{resetLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* Main Two-Column Side-by-Side Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 items-start">
        {/* Left: Inputs Panel */}
        <div
          data-inputs-panel="true"
          className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between min-h-full"
        >
          <div>
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {inputsTitle}
              </span>
              <div className="flex items-center gap-2">
                {showCurrencySelector && (
                  <div className="flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">Currency:</span>
                    <select
                      id={`${id}-currency-select`}
                      value={preferences.currency}
                      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                      className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-transparent focus:outline-hidden cursor-pointer"
                      aria-label="Select Calculation Currency"
                    >
                      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium">
                          {c} ({CURRENCIES[c].symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {onReset && !title && (
                  <button
                    type="button"
                    id={`${id}-inputs-reset-btn`}
                    onClick={onReset}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{resetLabel}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inputs Content */}
            <div className="space-y-4">
              {inputs}
            </div>
          </div>

          {/* Action Bar (Reset + optional primary action) */}
          {(onReset || actions) && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100">
              {onReset ? (
                <button
                  type="button"
                  id={`${id}-bottom-reset-btn`}
                  onClick={onReset}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{resetLabel}</span>
                </button>
              ) : <div />}
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}
        </div>

        {/* Right: Results Panel */}
        <div
          data-results-panel="true"
          className="lg:col-span-6 p-5 sm:p-6 bg-slate-50/40 min-h-full flex flex-col"
        >
          <div className="pb-3.5 mb-4 border-b border-slate-200/60 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {resultsTitle}
            </span>
            <button
              type="button"
              id={`${id}-share-result-btn`}
              onClick={() => {
                if (calculationData) {
                  setActiveCalculationData(calculationData);
                }
                if (onShare) {
                  onShare();
                } else {
                  window.dispatchEvent(
                    new CustomEvent('open-calculator-share', { detail: { id, calculationData } })
                  );
                }
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 bg-white shadow-2xs transition-colors cursor-pointer"
              title="Share this calculation result"
            >
              <Share2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Share Result</span>
            </button>
          </div>

          <div className="space-y-4 flex-1">
            {results}
          </div>
        </div>
      </div>

      {/* Optional Footnote / Methodology / Disclosures */}
      {footer && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
