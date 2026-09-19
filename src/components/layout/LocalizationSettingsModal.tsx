import React from 'react';
import { X, Globe2, Sparkles, Check, RotateCcw, Palette } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { COUNTRY_PROFILES } from '../../data/countries';
import { CURRENCIES } from '../../data/currencies';
import { CountryCode } from '../../types/localization';
import { CurrencyCode } from '../../types/globalization';

interface LocalizationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocalizationSettingsModal: React.FC<LocalizationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    preferences,
    countryProfile,
    setCountry,
    setCurrency,
    resetUnitsToCountryDefaults,
    hasCustomUnitOverrides,
    currencySuggestion,
    acceptCurrencySuggestion,
    dismissCurrencySuggestion,
  } = useSettings();

  if (!isOpen) return null;

  const countryList = Object.values(COUNTRY_PROFILES);
  const currencyList = Object.values(CURRENCIES);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value as CountryCode;
    setCountry(code, true);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value as CurrencyCode;
    setCurrency(code);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="localization-settings-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 max-h-[90vh] max-h-[90dvh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 id="localization-settings-title" className="text-base font-bold text-slate-900 dark:text-white">
                Preferences &amp; Localization
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your display currency, appearance theme, and defaults.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close localization settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Appearance Theme */}
          <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Appearance Theme
              </label>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select Light, Dark, or System mode. Preference is saved locally in your browser.
            </p>
            <ThemeToggle variant="segmented" className="w-full justify-between" />
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <label htmlFor="modal-currency-select" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Display Currency
            </label>
            <div className="relative">
              <select
                id="modal-currency-select"
                value={preferences.currency}
                onChange={handleCurrencyChange}
                className="w-full min-h-[44px] py-2.5 pl-3.5 pr-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencyList.map((cur) => (
                  <option key={cur.code} value={cur.code}>
                    {cur.symbol} {cur.code} — {cur.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Select your primary currency symbol for financial inputs and calculation outputs.
            </p>
          </div>

          {/* Language & Unit System Summary */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Language
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>English (Global)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Measurement Units
              </span>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                Per-Field Dropdowns Active
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Units can be adjusted next to each input field.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
};
