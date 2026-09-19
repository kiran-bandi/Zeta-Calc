import React, { useState, useEffect, useRef } from 'react';
import { normalizeTerm } from '../../engine/termEngine';

export interface TermInputProps {
  id?: string;
  label?: string;
  years: number | '';
  months: number | '';
  days?: number | '';
  onChangeYears: (val: number | '') => void;
  onChangeMonths: (val: number | '') => void;
  onChangeDays?: (val: number | '') => void;
  showDays?: boolean;
  helpText?: string;
  error?: string;
  required?: boolean;
}

export const TermInput: React.FC<TermInputProps> = ({
  id = 'term-input',
  label = 'Term / Duration',
  years,
  months,
  days = '',
  onChangeYears,
  onChangeMonths,
  onChangeDays,
  showDays = true,
  helpText,
  error: customError,
  required = false,
}) => {
  const [yearsText, setYearsText] = useState<string>(() =>
    typeof years === 'number' && !isNaN(years) ? String(years) : ''
  );
  const [monthsText, setMonthsText] = useState<string>(() =>
    typeof months === 'number' && !isNaN(months) ? String(months) : ''
  );
  const [daysText, setDaysText] = useState<string>(() =>
    typeof days === 'number' && !isNaN(days) ? String(days) : ''
  );

  const yearsFocusedRef = useRef(false);
  const monthsFocusedRef = useRef(false);
  const daysFocusedRef = useRef(false);

  useEffect(() => {
    if (!yearsFocusedRef.current) {
      setYearsText(typeof years === 'number' && !isNaN(years) ? String(years) : '');
    }
  }, [years]);

  useEffect(() => {
    if (!monthsFocusedRef.current) {
      setMonthsText(typeof months === 'number' && !isNaN(months) ? String(months) : '');
    }
  }, [months]);

  useEffect(() => {
    if (!daysFocusedRef.current) {
      setDaysText(typeof days === 'number' && !isNaN(days) ? String(days) : '');
    }
  }, [days]);

  // Perform validation check for inline errors
  const normalized = normalizeTerm({ years, months, days: typeof days === 'number' ? days : '' });
  const displayError =
    customError ||
    ((years !== '' || months !== '' || days !== '') && !normalized.isValid ? normalized.error : undefined);

  const handleYearsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');
    if (raw === '') {
      setYearsText('');
      onChangeYears('');
      return;
    }
    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }
    if (/^-?[0-9]+$/.test(raw)) {
      setYearsText(raw);
      const val = parseInt(raw, 10);
      onChangeYears(isNaN(val) ? '' : val);
    }
  };

  const handleMonthsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');
    if (raw === '') {
      setMonthsText('');
      onChangeMonths('');
      return;
    }
    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }
    if (/^-?[0-9]+$/.test(raw)) {
      setMonthsText(raw);
      const val = parseInt(raw, 10);
      onChangeMonths(isNaN(val) ? '' : val);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');
    if (raw === '') {
      setDaysText('');
      onChangeDays?.('');
      return;
    }
    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }
    if (/^-?[0-9]+$/.test(raw)) {
      setDaysText(raw);
      const val = parseInt(raw, 10);
      onChangeDays?.(isNaN(val) ? '' : val);
    }
  };

  return (
    <div className="space-y-1.5 w-full min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 break-words min-w-0 flex-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {helpText && <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">{helpText}</span>}
      </div>

      <div
        className={`p-2 bg-slate-50/60 dark:bg-slate-900/50 border rounded-xl transition-all ${
          displayError
            ? 'border-rose-400 bg-rose-50/20'
            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
        }`}
      >
        <div className={`grid ${showDays ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          {/* Years Field */}
          <div className="relative flex items-center min-w-0">
            <input
              type="text"
              inputMode="numeric"
              id={`${id}-years`}
              aria-label={`${label} Years`}
              placeholder="e.g. 2"
              value={yearsText}
              onFocus={(e) => {
                yearsFocusedRef.current = true;
                e.target.select();
              }}
              onChange={handleYearsChange}
              onBlur={() => {
                yearsFocusedRef.current = false;
                if (yearsText === '') onChangeYears('');
              }}
              className="w-full h-9 pl-2.5 pr-10 sm:pr-12 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-w-0"
            />
            <span className="absolute right-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-wider">
              Yrs
            </span>
          </div>

          {/* Months Field */}
          <div className="relative flex items-center min-w-0">
            <input
              type="text"
              inputMode="numeric"
              id={`${id}-months`}
              aria-label={`${label} Months`}
              placeholder="e.g. 5"
              value={monthsText}
              onFocus={(e) => {
                monthsFocusedRef.current = true;
                e.target.select();
              }}
              onChange={handleMonthsChange}
              onBlur={() => {
                monthsFocusedRef.current = false;
                if (monthsText === '') onChangeMonths('');
              }}
              className="w-full h-9 pl-2.5 pr-10 sm:pr-12 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-w-0"
            />
            <span className="absolute right-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-wider">
              Mos
            </span>
          </div>

          {/* Days Field */}
          {showDays && (
            <div className="relative flex items-center min-w-0">
              <input
                type="text"
                inputMode="numeric"
                id={`${id}-days`}
                aria-label={`${label} Days`}
                placeholder="e.g. 10"
                value={daysText}
                onFocus={(e) => {
                  daysFocusedRef.current = true;
                  e.target.select();
                }}
                onChange={handleDaysChange}
                onBlur={() => {
                  daysFocusedRef.current = false;
                  if (daysText === '') onChangeDays?.('');
                }}
                className="w-full h-9 pl-2.5 pr-10 sm:pr-12 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all placeholder:text-slate-400 placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 min-w-0"
              />
              <span className="absolute right-2 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none uppercase tracking-wider">
                Days
              </span>
            </div>
          )}
        </div>
      </div>

      {displayError && (
        <p id={`${id}-error`} className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <span>{displayError}</span>
        </p>
      )}
    </div>
  );
};

