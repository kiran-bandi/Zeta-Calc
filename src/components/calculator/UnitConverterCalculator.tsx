import React, { useState, useMemo } from 'react';
import {
  UNIT_CATEGORIES,
  UnitCategory,
  convertUnit,
  getAllConversions,
} from '../../engine/conversion';
import { ArrowLeftRight, Copy, CheckCircle2 } from 'lucide-react';

export const UnitConverterCalculator: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [sourceValue, setSourceValue] = useState<number | ''>('');
  const [copiedUnitId, setCopiedUnitId] = useState<string | null>(null);

  const currentCategoryConfig = UNIT_CATEGORIES[category];
  const [fromUnitId, setFromUnitId] = useState<string>(currentCategoryConfig.units[0].id);
  const [toUnitId, setToUnitId] = useState<string>(
    currentCategoryConfig.units[1]?.id || currentCategoryConfig.units[0].id
  );

  // Synchronize when category changes
  const handleCategoryChange = (newCat: UnitCategory) => {
    setCategory(newCat);
    const cfg = UNIT_CATEGORIES[newCat];
    setFromUnitId(cfg.units[0].id);
    setToUnitId(cfg.units[1]?.id || cfg.units[0].id);
  };

  const convertedValue = useMemo(() => {
    if (sourceValue === '' || typeof sourceValue !== 'number' || isNaN(sourceValue)) return null;
    return convertUnit(sourceValue, fromUnitId, toUnitId, category);
  }, [sourceValue, fromUnitId, toUnitId, category]);

  const allMatrixRows = useMemo(() => {
    const val = typeof sourceValue === 'number' && !isNaN(sourceValue) ? sourceValue : 0;
    return getAllConversions(val, fromUnitId, category);
  }, [sourceValue, fromUnitId, category]);

  const handleSwap = () => {
    const temp = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(temp);
  };

  const handleCopyRow = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUnitId(id);
    setTimeout(() => setCopiedUnitId(null), 1800);
  };

  const fromUnitObj = currentCategoryConfig.units.find((u) => u.id === fromUnitId);
  const toUnitObj = currentCategoryConfig.units.find((u) => u.id === toUnitId);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        {(Object.keys(UNIT_CATEGORIES) as UnitCategory[]).map((catKey) => {
          const cat = UNIT_CATEGORIES[catKey];
          const isActive = category === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => handleCategoryChange(catKey)}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Conversion Controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div>
          <label htmlFor="unit-src-val" className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
            Value to Convert
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <input
                type="number"
                id="unit-src-val"
                placeholder="Enter value..."
                value={sourceValue === '' || isNaN(sourceValue) ? '' : sourceValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setSourceValue(val === '' ? '' : parseFloat(val));
                }}
                className="w-full py-2.5 px-3 text-slate-900 font-bold text-base bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                id="unit-from-sel"
                aria-label="Source Unit"
                value={fromUnitId}
                onChange={(e) => setFromUnitId(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
              >
                {currentCategoryConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                title="Swap Units"
                className="p-2 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-3">
              <select
                id="unit-to-sel"
                aria-label="Target Unit"
                value={toUnitId}
                onChange={(e) => setToUnitId(e.target.value)}
                className="w-full py-2.5 px-3 text-xs sm:text-sm font-bold text-slate-800 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
              >
                {currentCategoryConfig.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Highlighted Result Display */}
        <div className="p-4 bg-white rounded-xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
              Direct Conversion Result
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {convertedValue != null && !isNaN(convertedValue) ? convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'}{' '}
              <span className="text-base font-semibold text-slate-500">{toUnitObj?.symbol}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            {sourceValue} {fromUnitObj?.symbol} = {convertedValue != null && !isNaN(convertedValue) ? convertedValue.toLocaleString(undefined, { maximumFractionDigits: 6 }) : '—'} {toUnitObj?.symbol}
          </div>
        </div>
      </div>

      {/* Complete Conversion Matrix Table (Omni Calculator's signature feature) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider">
            All Equivalent Units Matrix
          </h3>
          <span className="text-[11px] text-slate-500">Click any row to copy value</span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Unit Name</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3 text-right">Equivalent Value</th>
                <th className="py-2.5 px-3 w-10 text-center">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allMatrixRows.map((row) => {
                const isSelected = row.unitId === toUnitId;
                return (
                  <tr
                    key={row.unitId}
                    className={`transition-colors cursor-pointer hover:bg-slate-50 ${
                      isSelected ? 'bg-blue-50/50 font-bold' : ''
                    }`}
                    onClick={() => handleCopyRow(`${row.formatted} ${row.symbol}`, row.unitId)}
                  >
                    <td className="py-2 px-3 font-semibold text-slate-800">{row.unitName}</td>
                    <td className="py-2 px-3 text-slate-500 font-mono">{row.symbol}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">
                      {row.formatted}
                    </td>
                    <td className="py-2 px-3 text-center text-slate-400">
                      {copiedUnitId === row.unitId ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 inline hover:text-slate-700" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
