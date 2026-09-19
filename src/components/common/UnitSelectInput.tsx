import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface UnitOption {
  value: string;
  label: string;
}

interface UnitSelectInputProps {
  id: string;
  label: string;
  value: number | '';
  onChange: (value: number | '') => void;
  selectedUnit: string;
  onUnitChange: (newUnit: string) => void;
  unitOptions: UnitOption[];
  placeholder?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  disabled?: boolean;
}

export const UnitSelectInput: React.FC<UnitSelectInputProps> = ({
  id,
  label,
  value,
  onChange,
  selectedUnit,
  onUnitChange,
  unitOptions,
  placeholder = 'Enter value',
  prefix,
  min = 0,
  max,
  step = 'any',
  helperText,
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onChange('');
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(parsed);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800">
          {label}
        </label>
      </div>

      <div className="flex items-stretch rounded-xl border border-slate-300 bg-white shadow-xs focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all overflow-hidden">
        {prefix && (
          <span className="flex items-center pl-3.5 pr-2 text-slate-500 font-semibold text-sm select-none">
            {prefix}
          </span>
        )}

        <input
          id={id}
          type="number"
          value={value === '' ? '' : value}
          onChange={handleInputChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="w-full min-h-[44px] py-2.5 px-3 text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none bg-transparent"
        />

        {/* Dropdown immediately to the right of input */}
        <div className="relative border-l border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center shrink-0">
          <select
            id={`${id}-unit-select`}
            value={selectedUnit}
            onChange={(e) => onUnitChange(e.target.value)}
            disabled={disabled}
            aria-label={`${label} unit`}
            className="appearance-none min-h-[44px] bg-transparent pl-3 pr-8 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-600 cursor-pointer focus:outline-none h-full select-none"
          >
            {unitOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-slate-900 font-normal">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>

      {helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
};
