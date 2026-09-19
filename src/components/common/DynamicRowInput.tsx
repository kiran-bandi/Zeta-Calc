import React from 'react';
import { Plus, Trash2, ArrowUpDown } from 'lucide-react';

export interface DynamicColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'select';
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  widthClass?: string;
}

interface DynamicRowInputProps {
  id: string;
  title: string;
  description?: string;
  columns: DynamicColumnConfig[];
  rows: Record<string, any>[];
  onChange: (newRows: Record<string, any>[]) => void;
  minRows?: number;
  maxRows?: number;
  addButtonLabel?: string;
  currencySymbol?: string;
  totalCalculator?: (rows: Record<string, any>[]) => { label: string; value: string | number }[];
}

export const DynamicRowInput: React.FC<DynamicRowInputProps> = ({
  id,
  title,
  description,
  columns,
  rows,
  onChange,
  minRows = 1,
  maxRows = 30,
  addButtonLabel = 'Add Item',
  currencySymbol = '$',
  totalCalculator,
}) => {
  const handleAddRow = () => {
    if (rows.length >= maxRows) return;
    const newRow: Record<string, any> = { id: `row-${Date.now()}-${Math.random()}` };
    columns.forEach((col) => {
      newRow[col.key] = col.type === 'number' || col.type === 'currency' ? '' : '';
    });
    onChange([...rows, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (rows.length <= minRows) return;
    const updated = rows.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleCellChange = (rowIndex: number, colKey: string, val: any) => {
    const updated = [...rows];
    updated[rowIndex] = { ...updated[rowIndex], [colKey]: val };
    onChange(updated);
  };

  const totals = totalCalculator ? totalCalculator(rows) : [];

  return (
    <div id={id} className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900">{title}</h4>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {rows.length} {rows.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
              <th className="py-2.5 px-3 font-semibold w-10 text-center">#</th>
              {columns.map((col) => (
                <th key={col.key} className={`py-2.5 px-3 font-semibold ${col.widthClass || ''}`}>
                  {col.label}
                </th>
              ))}
              <th className="py-2.5 px-3 font-semibold w-12 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={row.id || idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-2 px-3 text-center text-slate-400 font-semibold">{idx + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className="py-2 px-3">
                    {col.type === 'select' ? (
                      <select
                        value={row[col.key] || ''}
                        onChange={(e) => handleCellChange(idx, col.key, e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        {col.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : col.type === 'currency' ? (
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          value={row[col.key] ?? ''}
                          onChange={(e) =>
                            handleCellChange(
                              idx,
                              col.key,
                              e.target.value === '' ? '' : parseFloat(e.target.value)
                            )
                          }
                          placeholder={col.placeholder || '0.00'}
                          min={col.min ?? 0}
                          max={col.max}
                          step={col.step ?? 0.01}
                          className="w-full pl-6 pr-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    ) : col.type === 'number' ? (
                      <input
                        type="number"
                        inputMode="decimal"
                        value={row[col.key] ?? ''}
                        onChange={(e) =>
                          handleCellChange(
                            idx,
                            col.key,
                            e.target.value === '' ? '' : parseFloat(e.target.value)
                          )
                        }
                        placeholder={col.placeholder || '0'}
                        min={col.min ?? 0}
                        max={col.max}
                        step={col.step ?? 1}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <input
                        type="text"
                        value={row[col.key] ?? ''}
                        onChange={(e) => handleCellChange(idx, col.key, e.target.value)}
                        placeholder={col.placeholder || 'Enter description'}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                      />
                    )}
                  </td>
                ))}
                <td className="py-2 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(idx)}
                    disabled={rows.length <= minRows}
                    title="Remove item"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleAddRow}
          disabled={rows.length >= maxRows}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors disabled:opacity-40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{addButtonLabel}</span>
        </button>

        {totals.length > 0 && (
          <div className="flex items-center gap-4 text-xs">
            {totals.map((t) => (
              <div key={t.label} className="text-right">
                <span className="text-slate-500 mr-1.5">{t.label}:</span>
                <span className="font-bold text-slate-900">{t.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
