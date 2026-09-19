import React, { useState, useEffect, useRef } from 'react';
import { CurrencyCode } from '../../types/globalization';
import { CURRENCIES, convertCurrencyValue } from '../../data/currencies';
import { useSettings } from '../../context/SettingsContext';

export interface CurrencyInputProps {
  id: string;
  label: string;
  value: number | '' | undefined;
  onChange: (val: number | '') => void;
  currency?: CurrencyCode;
  onCurrencyChange?: (code: CurrencyCode) => void;
  convertOnCurrencyChange?: boolean;
  min?: number;
  max?: number;
  step?: number;
  helpText?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
  showCurrencySelector?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  currency: customCurrency,
  onCurrencyChange: customOnCurrencyChange,
  convertOnCurrencyChange = true,
  min,
  max,
  step = 1,
  helpText,
  className = '',
  disabled = false,
  placeholder = 'e.g. 10,000',
  error,
  required = false,
  showCurrencySelector = true,
}) => {
  const { preferences, setCurrency } = useSettings();

  const currentCurrency: CurrencyCode = customCurrency || preferences.currency || 'USD';

  const handleCurrencyChange = (newCode: CurrencyCode) => {
    if (newCode === currentCurrency) return;

    if (convertOnCurrencyChange && typeof value === 'number' && !isNaN(value)) {
      const converted = convertCurrencyValue(value, currentCurrency, newCode);
      if (typeof converted === 'number' && !isNaN(converted)) {
        onChange(converted);
        setTextValue(converted.toString());
      }
    }

    if (customOnCurrencyChange) {
      customOnCurrencyChange(newCode);
    } else {
      setCurrency(newCode);
    }
  };

  const [textValue, setTextValue] = useState<string>(() => {
    if (value === undefined || value === null || value === '') return '';
    return isNaN(value) ? '' : value.toString();
  });

  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      if (value === undefined || value === null || value === '') {
        setTextValue('');
      } else if (!isNaN(value)) {
        setTextValue(value.toString());
      }
    }
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    e.target.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');

    if (raw === '') {
      setTextValue('');
      onChange('');
      return;
    }

    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }

    if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setTextValue(raw);

      if (raw !== '.' && !raw.endsWith('.')) {
        const parsed = parseFloat(raw);
        if (!isNaN(parsed)) {
          onChange(parsed);
        }
      }
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    if (textValue === '' || textValue === '.') {
      setTextValue('');
      onChange('');
      return;
    }

    const parsed = parseFloat(textValue);
    if (!isNaN(parsed)) {
      let clamped = parsed;
      if (min !== undefined && clamped < min) clamped = min;
      if (max !== undefined && clamped > max) clamped = max;
      setTextValue(clamped.toString());
      onChange(clamped);
    }
  };

  const currentConfig = CURRENCIES[currentCurrency] || CURRENCIES.USD;

  return (
    <div className={`space-y-1.5 w-full min-w-0 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 select-none">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
        {helpText && <span className="text-[11px] text-slate-500 dark:text-slate-400">{helpText}</span>}
      </div>

      <div
        className={`relative flex items-center rounded-xl border bg-white dark:bg-slate-900 transition-all shadow-xs ${
          error
            ? 'border-rose-400 focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-500/20'
            : 'border-slate-300 dark:border-slate-700 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20'
        }`}
      >
        <span className="pl-3.5 pr-1 text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-base select-none pointer-events-none shrink-0">
          {currentConfig.symbol}
        </span>

        <input
          type="text"
          inputMode="decimal"
          id={id}
          value={textValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full py-2.5 px-2 text-slate-900 dark:text-white font-semibold text-base bg-transparent border-0 placeholder:text-slate-400 placeholder:font-normal placeholder:opacity-80 focus:outline-hidden disabled:bg-slate-50 disabled:text-slate-400 min-w-0"
        />

        {showCurrencySelector && (
          <div className="pr-1.5 shrink-0">
            <select
              aria-label={`${label} currency`}
              value={currentCurrency}
              onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
              className="py-1.5 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden transition-colors cursor-pointer"
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold">
                  {code} ({CURRENCIES[code].symbol})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-600 font-medium mt-1">{error}</p>
      )}
    </div>
  );
};
