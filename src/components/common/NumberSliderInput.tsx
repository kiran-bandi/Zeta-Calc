import React, { useState, useEffect, useRef } from 'react';
import { convertUnitValue } from '../../engine/unitEngine';

export interface UnitOption {
  id: string;
  label: string;
  symbol?: string;
}

interface PresetOption {
  label: string;
  value: number;
}

export interface NumberSliderInputProps {
  id?: string;
  label: string;
  value: number | '';
  onChange: (val: any) => void;
  units?: UnitOption[];
  currentUnit?: string;
  onUnitChange?: (unitId: string) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  unitPrefix?: string;
  unitSuffix?: string;
  placeholder?: string;
  helpText?: string;
  error?: string;
  presets?: PresetOption[];
  unitToggle?: {
    current: string;
    options: { label: string; value: string }[];
    onChange: (val: any) => void;
  };
  formattedDisplay?: string;
  compact?: boolean;
  hideSlider?: boolean;
  required?: boolean;
  className?: string;
}

export const NumberSliderInput: React.FC<NumberSliderInputProps> = ({
  id,
  label,
  value,
  onChange,
  units,
  currentUnit,
  onUnitChange,
  min = 0,
  max = 100,
  step = 1,
  prefix,
  suffix,
  unitPrefix,
  unitSuffix,
  placeholder,
  helpText,
  error,
  presets,
  unitToggle,
  formattedDisplay,
  compact = true,
  hideSlider = false,
  required = false,
  className = '',
}) => {
  const activePrefix = prefix || unitPrefix;
  const activeSuffix = suffix || unitSuffix;
  const elementId = id || (label ? `input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}` : 'num-input');
  const [textVal, setTextVal] = useState<string>(() => {
    if (value === undefined || value === null || value === '' || isNaN(value)) return '';
    return value.toString();
  });
  const isFocusedRef = useRef(false);

  useEffect(() => {
    if (!isFocusedRef.current) {
      if (value === undefined || value === null || value === '' || isNaN(value)) {
        setTextVal('');
      } else {
        setTextVal(value.toString());
      }
    }
  }, [value]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    isFocusedRef.current = true;
    e.target.select();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/,/g, '');
    if (raw === '') {
      setTextVal('');
      onChange('');
      return;
    }

    // If user types a digit after 0 (e.g. "05"), strip leading zero
    if (/^0[0-9]+/.test(raw)) {
      raw = raw.replace(/^0+/, '');
    }

    if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
      setTextVal(raw);
      if (raw !== '.' && !raw.endsWith('.')) {
        const num = parseFloat(raw);
        if (!isNaN(num)) {
          onChange(num);
        }
      }
    }
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    if (textVal === '' || textVal === '.') {
      setTextVal('');
      onChange('');
      return;
    }
    const num = parseFloat(textVal);
    if (!isNaN(num)) {
      setTextVal(num.toString());
      onChange(num);
    }
  };

  return (
    <div className={`space-y-1.5 w-full min-w-0 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        <label htmlFor={elementId} className="text-xs font-bold text-slate-700 break-words min-w-0 flex-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {unitToggle && (
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium shrink-0">
            {unitToggle.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                id={`${elementId}-toggle-${opt.value}`}
                onClick={() => unitToggle.onChange(opt.value)}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  unitToggle.current === opt.value
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex items-center w-full min-w-0">
        {activePrefix && (
          <span className="absolute left-3 text-slate-500 font-bold text-sm select-none pointer-events-none">
            {activePrefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          id={elementId}
          value={textVal}
          onFocus={handleFocus}
          onChange={handleInputChange}
          onBlur={handleBlur}
          aria-invalid={!!error}
          aria-describedby={error ? `${elementId}-error` : undefined}
          placeholder={placeholder || (min != null && min > 0 ? `e.g. ${min.toLocaleString()}` : 'Enter value...')}
          className={`w-full h-10 text-sm font-semibold text-slate-900 bg-white border rounded-xl transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:opacity-80 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 ${
            activePrefix ? 'pl-7' : 'pl-3'
          } ${units && units.length > 0 ? 'pr-24' : activeSuffix ? 'pr-16' : 'pr-3'} ${
            error ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 hover:border-slate-300'
          }`}
        />
        {units && units.length > 0 ? (
          <div className="absolute right-1 shrink-0 flex items-center">
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
                    setTextVal(converted.toString());
                  }
                }
                onUnitChange?.(newUnitId);
              }}
              className="py-1 px-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg focus:outline-hidden transition-colors cursor-pointer"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.symbol || u.label}
                </option>
              ))}
            </select>
          </div>
        ) : activeSuffix ? (
          <span className="absolute right-3 text-slate-500 text-xs font-semibold select-none pointer-events-none">
            {activeSuffix}
          </span>
        ) : null}
      </div>

      {formattedDisplay && (
        <div className="text-[11px] font-medium text-slate-500 flex justify-between px-0.5">
          <span className="truncate">Entered: {formattedDisplay}</span>
        </div>
      )}

      {/* Slider */}
      {!hideSlider && (
        <div className="pt-0.5 w-full">
          <input
            type="range"
            id={`${elementId}-slider`}
            aria-label={`${label} slider`}
            min={min ?? 0}
            max={max ?? 100}
            step={step}
            value={typeof value === 'number' && !isNaN(value) ? Math.min(max ?? 100, Math.max(min ?? 0, value)) : (min ?? 0)}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-pan-x"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span className="truncate">{activePrefix}{min != null ? min.toLocaleString() : ''}{activeSuffix ? ` ${activeSuffix}` : ''}</span>
            <span className="truncate">{activePrefix}{max != null ? max.toLocaleString() : ''}{activeSuffix ? ` ${activeSuffix}` : ''}</span>
          </div>
        </div>
      )}

      {/* Quick Presets */}
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              id={`${elementId}-preset-${preset.label.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => onChange(preset.value)}
              className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                value === preset.value
                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}

      {error ? (
        <p id={`${elementId}-error`} className="text-xs font-medium text-rose-600 pt-0.5">
          {error}
        </p>
      ) : helpText ? (
        <p className="text-[11px] text-slate-500 pt-0.5">{helpText}</p>
      ) : null}
    </div>
  );
};
