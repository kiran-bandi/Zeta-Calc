import React, { useState } from 'react';
import { X, ArrowRight, Sparkles, Scale } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export interface ComparisonField {
  label: string;
  valA: number;
  valB: number;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
  lowerIsBetter?: boolean;
}

interface ScenarioCompareModalProps {
  toolName: string;
  isOpen: boolean;
  onClose: () => void;
  fields: ComparisonField[];
  scenarioAName?: string;
  scenarioBName?: string;
}

export const ScenarioCompareModal: React.FC<ScenarioCompareModalProps> = ({
  toolName,
  isOpen,
  onClose,
  fields,
  scenarioAName = 'Scenario A (Current)',
  scenarioBName = 'Scenario B (Alternative)',
}) => {
  const { formatMoney } = useSettings();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Side-by-Side Comparison: {toolName}
              </h3>
              <p className="text-xs text-slate-500">Compare variations to discover savings and trade-offs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-3 gap-2 pb-2 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
            <div>Metric</div>
            <div className="text-right text-slate-900">{scenarioAName}</div>
            <div className="text-right text-blue-600">{scenarioBName}</div>
          </div>

          {fields.map((f, idx) => {
            const diff = f.valB - f.valA;
            const pctDiff = f.valA !== 0 ? Math.round((diff / f.valA) * 1000) / 10 : 0;
            const isFavorable = f.lowerIsBetter ? diff < 0 : diff > 0;

            const formatVal = (v: number) => {
              if (v == null || isNaN(v)) return '—';
              if (f.isCurrency) return formatMoney(v);
              return `${f.prefix || ''}${v.toLocaleString()}${f.suffix ? ` ${f.suffix}` : ''}`;
            };

            return (
              <div
                key={idx}
                className="grid grid-cols-3 gap-2 py-2.5 border-b border-slate-100 items-center text-xs sm:text-sm"
              >
                <span className="font-semibold text-slate-700">{f.label}</span>
                <span className="text-right font-medium text-slate-800">{formatVal(f.valA)}</span>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{formatVal(f.valB)}</div>
                  {diff !== 0 && !isNaN(diff) && (
                    <span
                      className={`inline-block text-[11px] font-bold px-1.5 py-0.5 rounded-sm mt-0.5 ${
                        isFavorable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {diff > 0 ? '+' : ''}
                      {f.isCurrency ? formatMoney(diff) : `${diff.toLocaleString()}`} ({pctDiff > 0 ? '+' : ''}{pctDiff}%)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
