import React, { useState, useEffect, useRef } from 'react';
import { convertUnitValue } from '../../engine/unitEngine';

export interface UnitOption {
  id: string;
  label: string;
  symbol?: string;
}

export interface UnitNumberInputProps {
  id: string;
  label: string;
  value: number | '' | undefined;
  onChange: (val: number | '') => void;
  units?: UnitOption[];
  currentUnit?: string;
  onUnitChange?: (unitId: string) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  helpText?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const UnitNumberInput: React.FC<UnitNumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  units,
  currentUnit,
  onUnitChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  helpText,
  className = '',
  disabled = false,
  placeholder = 'Enter value...',
  error,
  required = false,
}) => {
  // Local string buffer to allow fluid typing, backspacing to empty, decimal points, and full selection
  const [textValue, setTextValue] = useState<string>(() => {
    if (value === undefined || value === null || value === '') return '';
    return isNaN(value) ? '' : value.toString();
  });
  const isFocusedRef = useRef(false);

  // Synchronize when external value changes while NOT focused
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
    let raw = e.target.value;

    // Allow user to completely clear the field
    if (raw === '') {
      setTextValue('');
      onChange('');
      return;
    }

    // Strip multiple leading zeros (e.g., "05" -> "5", but keep "0.")
    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }

    // Allow digits and optional single decimal point
    if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setTextValue(raw);

      // Parse and emit valid numbers immediately
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
        {prefix && (
          <span className="pl-3.5 pr-1 text-slate-500 dark:text-slate-400 font-semibold text-sm select-none pointer-events-none shrink-0">
            {prefix}
          </span>
        )}

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
          className="w-full py-2.5 px-3 text-slate-900 dark:text-white font-semibold text-base bg-transparent border-0 placeholder:text-slate-400 placeholder:font-normal placeholder:opacity-80 focus:outline-hidden disabled:bg-slate-50 disabled:text-slate-400 min-w-0"
        />

        {suffix && !units && (
          <span className="pr-3 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium select-none pointer-events-none shrink-0">
            {suffix}
          </span>
        )}

        {units && units.length > 0 && (
          <div className="pr-1.5 shrink-0">
            <select
              aria-label={`${label} unit`}
              value={currentUnit || units[0].id}
              onChange={(e) => {
                const newUnitId = e.target.value;
                const oldUnitId = currentUnit || units[0].id;
                if (
                  typeof value === 'number' &&
                  !isNaN(value) &&
                  oldUnitId &&
                  oldUnitId !== newUnitId
                ) {
                  const converted = convertUnitValue(value, oldUnitId, newUnitId);
                  if (!isNaN(converted)) {
                    onChange(converted);
                    setTextValue(converted.toString());
                  }
                }
                onUnitChange?.(newUnitId);
              }}
              className="py-1.5 px-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden transition-colors cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium">
                  {u.symbol || u.label}
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
