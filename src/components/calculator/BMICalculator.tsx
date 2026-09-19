import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { calculateBMI } from '../../engine/health';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { DonutChart } from '../common/DonutChart';

export const BMICalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  // Metric values - empty by default per zero default rule
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');

  // Imperial helper states - empty by default
  const [heightFt, setHeightFt] = useState<number | ''>('');
  const [heightIn, setHeightIn] = useState<number | ''>('');
  const [weightLbs, setWeightLbs] = useState<number | ''>('');

  // Synchronize when unit system changes
  const handleSystemChange = (system: 'metric' | 'imperial') => {
    if (system === 'imperial') {
      if (typeof heightCm === 'number' && heightCm > 0) {
        const totalInches = Math.round(heightCm / 2.54);
        setHeightFt(Math.floor(totalInches / 12));
        setHeightIn(totalInches % 12);
      }
      if (typeof weightKg === 'number' && weightKg > 0) {
        setWeightLbs(Math.round(weightKg * 2.20462));
      }
    } else {
      if (typeof heightFt === 'number' && heightFt > 0) {
        const inches = typeof heightIn === 'number' ? heightIn : 0;
        const totalCm = Math.round((heightFt * 12 + inches) * 2.54);
        setHeightCm(totalCm);
      }
      if (typeof weightLbs === 'number' && weightLbs > 0) {
        setWeightKg(Math.round(weightLbs / 2.20462));
      }
    }
    setUnitSystem(system);
  };

  const effectiveCm = useMemo(() => {
    if (unitSystem === 'imperial') {
      if (typeof heightFt !== 'number' || heightFt <= 0) return 0;
      const inches = typeof heightIn === 'number' ? heightIn : 0;
      return Math.round((heightFt * 12 + inches) * 2.54);
    }
    return typeof heightCm === 'number' ? heightCm : 0;
  }, [unitSystem, heightCm, heightFt, heightIn]);

  const effectiveKg = useMemo(() => {
    if (unitSystem === 'imperial') {
      if (typeof weightLbs !== 'number' || weightLbs <= 0) return 0;
      return Math.round((weightLbs / 2.20462) * 10) / 10;
    }
    return typeof weightKg === 'number' ? weightKg : 0;
  }, [unitSystem, weightKg, weightLbs]);

  const result = useMemo(() => {
    if (effectiveCm <= 0 || effectiveKg <= 0) return null;
    return calculateBMI({
      heightCm: effectiveCm,
      weightKg: effectiveKg,
    });
  }, [effectiveCm, effectiveKg]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result) return null;
    return {
      toolSlug: 'bmi-calculator',
      toolName: 'BMI Calculator',
      categorySlug: 'health',
      inputs: [
        { label: 'Height', value: unitSystem === 'metric' ? `${heightCm} cm` : `${heightFt} ft ${heightIn} in` },
        { label: 'Weight', value: unitSystem === 'metric' ? `${weightKg} kg` : `${weightLbs} lbs` },
      ],
      outputs: [
        { label: 'Body Mass Index (BMI)', value: `${result.bmi} kg/m²`, isHighlight: true },
        { label: 'Weight Classification', value: result.category },
        { label: 'Healthy Weight Range', value: `${result.healthyWeightRangeKg.min} - ${result.healthyWeightRangeKg.max} kg` },
      ],
      customUrlParams: {
        system: unitSystem,
        ...(unitSystem === 'metric' ? { h: heightCm, w: weightKg } : { ft: heightFt, in: heightIn, lbs: weightLbs }),
      },
    };
  }, [result, unitSystem, heightCm, weightKg, heightFt, heightIn, weightLbs]);

  // Gauge pointer percentage (12 to 40 BMI range)
  const gaugePercent = useMemo(() => {
    if (!result) return 0;
    const minBmi = 14;
    const maxBmi = 40;
    const clamped = Math.min(maxBmi, Math.max(minBmi, result.bmi));
    return ((clamped - minBmi) / (maxBmi - minBmi)) * 100;
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Unit System Switcher */}
      <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl max-w-xs">
        <button
          type="button"
          onClick={() => handleSystemChange('metric')}
          className={`w-1/2 py-1.5 text-xs font-bold rounded-lg transition-all ${
            unitSystem === 'metric'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Metric (cm, kg)
        </button>
        <button
          type="button"
          onClick={() => handleSystemChange('imperial')}
          className={`w-1/2 py-1.5 text-xs font-bold rounded-lg transition-all ${
            unitSystem === 'imperial'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Imperial (ft, in, lbs)
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {unitSystem === 'metric' ? (
          <>
            <UnitNumberInput
              id="bmi-height-cm"
              label="Height"
              value={heightCm}
              onChange={setHeightCm}
              min={1}
              max={1000}
              step={1}
              helpText="Stature measurement"
              units={[
                { id: 'cm', label: 'Centimeters (cm)', symbol: 'cm' },
                { id: 'm', label: 'Meters (m)', symbol: 'm' },
                { id: 'in', label: 'Inches (in)', symbol: 'in' },
                { id: 'ft', label: 'Feet (ft)', symbol: 'ft' },
              ]}
              currentUnit="cm"
            />
            <UnitNumberInput
              id="bmi-weight-kg"
              label="Weight"
              value={weightKg}
              onChange={setWeightKg}
              min={1}
              max={1000}
              step={0.5}
              helpText="Body mass measurement"
              units={[
                { id: 'kg', label: 'Kilograms (kg)', symbol: 'kg' },
                { id: 'g', label: 'Grams (g)', symbol: 'g' },
                { id: 'lb', label: 'Pounds (lb)', symbol: 'lb' },
                { id: 'stone', label: 'Stone (st)', symbol: 'stone' },
              ]}
              currentUnit="kg"
            />
          </>
        ) : (
          <>
            <div>
              <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
                Height (Feet & Inches)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <UnitNumberInput
                  id="bmi-height-ft"
                  label=""
                  value={heightFt}
                  onChange={setHeightFt}
                  min={2}
                  max={8}
                  units={[{ id: 'ft', label: 'Feet', symbol: 'ft' }]}
                />
                <UnitNumberInput
                  id="bmi-height-in"
                  label=""
                  value={heightIn}
                  onChange={setHeightIn}
                  min={0}
                  max={11}
                  units={[{ id: 'in', label: 'Inches', symbol: 'in' }]}
                />
              </div>
            </div>
            <UnitNumberInput
              id="bmi-weight-lbs"
              label="Weight"
              value={weightLbs}
              onChange={setWeightLbs}
              min={40}
              max={650}
              step={1}
              helpText="Body mass in pounds"
              units={[{ id: 'lbs', label: 'lbs', symbol: 'lbs' }]}
            />
          </>
        )}
      </div>

      {/* Primary Result Display */}
      {result ? (
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Your Body Mass Index (BMI)
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${result.categoryColor}`}>
                  {result.category}
                </span>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl border border-slate-700 transition-colors shadow-2xs"
                  title="Share results to social media"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
              {result.bmi}{' '}
              <span className="text-base font-medium text-slate-400">kg/m²</span>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div className="w-[17%] bg-sky-400 h-full" title="Underweight (<18.5)" />
                <div className="w-[24%] bg-emerald-500 h-full" title="Normal (18.5-24.9)" />
                <div className="w-[19%] bg-amber-400 h-full" title="Overweight (25-29.9)" />
                <div className="w-[19%] bg-orange-500 h-full" title="Obese I (30-34.9)" />
                <div className="w-[21%] bg-rose-600 h-full" title="Obese II/III (35+)" />
              </div>

              {/* Pointer indicator */}
              <div className="relative w-full h-4">
                <div
                  className="absolute -top-1 w-3 h-3 bg-white border-2 border-slate-900 rounded-full transform -translate-x-1/2 shadow-xs transition-all duration-200"
                  style={{ left: `${gaugePercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>Underweight &lt;18.5</span>
                <span className="text-emerald-400 font-bold">Normal 18.5–24.9</span>
                <span>Overweight 25–29.9</span>
                <span>Obese 30+</span>
              </div>
            </div>

            {/* Breakdown Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-5 mt-5 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Healthy Weight Target</span>
                <span className="font-bold text-white text-sm">
                  {unitSystem === 'metric'
                    ? `${result.healthyWeightRangeKg.min} – ${result.healthyWeightRangeKg.max} kg`
                    : `${Math.round(result.healthyWeightRangeKg.min * 2.20462)} – ${Math.round(result.healthyWeightRangeKg.max * 2.20462)} lbs`}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">BMI Prime</span>
                <span className="font-bold text-white text-sm">{result.bmiPrime}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Ponderal Index</span>
                <span className="font-bold text-white text-sm">{result.ponderalIndex} kg/m³</span>
              </div>
            </div>
          </div>

          {/* Visual Summary Chart */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Weight Distribution vs Normal Range Target</h3>
            <DonutChart
              size={180}
              centerTitle="BMI"
              centerSubtitle={`${result.bmi} kg/m²`}
              segments={[
                {
                  label: 'Min Healthy Target Weight',
                  value: result.healthyWeightRangeKg.min,
                  color: '#10b981',
                  formattedValue: `${result.healthyWeightRangeKg.min} kg`,
                },
                {
                  label: 'Current Body Mass',
                  value: effectiveKg,
                  color: '#2563eb',
                  formattedValue: `${effectiveKg} kg`,
                },
                {
                  label: 'Max Healthy Target Weight',
                  value: result.healthyWeightRangeKg.max,
                  color: '#3b82f6',
                  formattedValue: `${result.healthyWeightRangeKg.max} kg`,
                },
              ]}
            />
          </div>

          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="BMI Calculation Results"
            toolName="BMI Calculator"
            toolSlug="bmi-calculator"
            categorySlug="health"
            description={`My Body Mass Index is ${result.bmi} kg/m² (${result.category}). Calculate your BMI on Zeta Calculator!`}
            calculationData={calculationShareData}
          />
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-sm font-semibold text-slate-700">Enter your height and weight above</p>
          <p className="text-xs text-slate-500 mt-1">Your BMI and health metrics will be calculated instantly.</p>
        </div>
      )}
    </div>
  );
};
