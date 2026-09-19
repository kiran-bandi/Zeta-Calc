import React, { useState, useMemo } from 'react';
import { calculateSquareFootage } from '../../engine/financial';
import { useSettings } from '../../context/SettingsContext';
import { UnitNumberInput } from '../common/UnitNumberInput';

export const SquareFootageCalculator: React.FC = () => {
  const { formatMoney, currencySymbol } = useSettings();

  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [unit, setUnit] = useState<'ft' | 'm' | 'in' | 'yd'>('ft');
  const [costPerSquareUnit, setCostPerSquareUnit] = useState<number | ''>('');
  const [wastePercentage, setWastePercentage] = useState<number | ''>('');

  const result = useMemo(() => {
    if (typeof length !== 'number' || length <= 0 || typeof width !== 'number' || width <= 0) {
      return null;
    }
    return calculateSquareFootage({
      length,
      width,
      unit,
      costPerSquareUnit: typeof costPerSquareUnit === 'number' ? costPerSquareUnit : 0,
      wastePercentage: typeof wastePercentage === 'number' ? wastePercentage : 0,
    });
  }, [length, width, unit, costPerSquareUnit, wastePercentage]);

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="space-y-4">
        {/* Unit Selector */}
        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
            Measurement Unit
          </label>
          <div className="grid grid-cols-4 gap-2 max-w-sm">
            {[
              { id: 'ft', label: 'Feet (ft)' },
              { id: 'm', label: 'Meters (m)' },
              { id: 'in', label: 'Inches (in)' },
              { id: 'yd', label: 'Yards (yd)' },
            ].map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => setUnit(u.id as any)}
                className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                  unit === u.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UnitNumberInput
            id="sqft-length"
            label="Room Length"
            value={length}
            onChange={setLength}
            min={0.1}
            max={10000}
            step={0.5}
            units={[
              { id: 'ft', label: 'Feet (ft)', symbol: 'ft' },
              { id: 'm', label: 'Meters (m)', symbol: 'm' },
              { id: 'in', label: 'Inches (in)', symbol: 'in' },
              { id: 'yd', label: 'Yards (yd)', symbol: 'yd' },
              { id: 'cm', label: 'Centimeters (cm)', symbol: 'cm' },
            ]}
            currentUnit={unit}
            onUnitChange={(u) => setUnit(u as any)}
          />
          <UnitNumberInput
            id="sqft-width"
            label="Room Width"
            value={width}
            onChange={setWidth}
            min={0.1}
            max={10000}
            step={0.5}
            units={[
              { id: 'ft', label: 'Feet (ft)', symbol: 'ft' },
              { id: 'm', label: 'Meters (m)', symbol: 'm' },
              { id: 'in', label: 'Inches (in)', symbol: 'in' },
              { id: 'yd', label: 'Yards (yd)', symbol: 'yd' },
              { id: 'cm', label: 'Centimeters (cm)', symbol: 'cm' },
            ]}
            currentUnit={unit}
            onUnitChange={(u) => setUnit(u as any)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <UnitNumberInput
            id="sqft-cost"
            label={`Cost per Sq ${unit === 'm' ? 'Meter' : 'Foot'}`}
            value={costPerSquareUnit}
            onChange={setCostPerSquareUnit}
            min={0}
            max={100000}
            step={0.5}
            prefix={currencySymbol}
            helpText="Tile, wood, or carpet cost"
          />
          <UnitNumberInput
            id="sqft-waste"
            label="Cutting Waste Allowance"
            value={wastePercentage}
            onChange={setWastePercentage}
            min={0}
            max={50}
            step={1}
            units={[{ id: '%', label: '%', symbol: '%' }]}
            helpText="Standard is 10% (15% for diagonal)"
          />
        </div>
      </div>

      {/* Result Display */}
      {result ? (
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Total Material to Order (With {typeof wastePercentage === 'number' ? wastePercentage : 0}% Waste)
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Net Area: {result.areaSqFt} sq ft
            </span>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {result?.totalAreaWithWasteSqFt != null ? result.totalAreaWithWasteSqFt.toLocaleString() : '0'}{' '}
            <span className="text-base font-medium text-slate-400">sq ft</span>
            <span className="text-sm font-semibold text-slate-400 block sm:inline sm:ml-3">
              ({result?.totalAreaWithWasteSqM != null ? result.totalAreaWithWasteSqM.toLocaleString() : '0'} m²)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Estimated Materials Cost</span>
              <span className="font-bold text-emerald-400 text-lg">
                {formatMoney(result.materialsCost, true)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Base Room Surface</span>
              <span className="font-bold text-white text-base">
                {result.areaSqFt} sq ft ({result.areaSqM} m²)
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-700">Enter length and width above</p>
          <p className="text-xs text-slate-500 mt-1">Calculates total surface area, cutting waste allowance, and material cost.</p>
        </div>
      )}
    </div>
  );
};
