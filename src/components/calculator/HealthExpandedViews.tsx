import React, { useState, useMemo } from 'react';
import {
  calculateBodyFat,
  calculateIdealWeight,
  calculatePace,
  calculatePregnancy,
  calculatePregnancyConception,
  calculateWaterIntake,
  HEALTH_DISCLAIMER,
} from '../../engine/health';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { AlertTriangle, Activity, Scale, Heart, Baby, Droplets, Flame, RotateCcw } from 'lucide-react';

interface HealthExpandedViewsProps {
  toolSlug: string;
}

const EmptyStateCard: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[260px]">
    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    <p className="text-xs text-slate-500 mt-1 max-w-xs">{subtitle}</p>
  </div>
);

export const HealthExpandedViews: React.FC<HealthExpandedViewsProps> = ({ toolSlug }) => {
  // Medical Disclaimer Banner (Mandatory for all Health & Pregnancy tools)
  const DisclaimerBanner = (
    <div className="mb-6 p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <strong className="font-bold block mb-0.5">Medical & Health Disclaimer</strong>
        <span>{HEALTH_DISCLAIMER}</span>
      </div>
    </div>
  );

  // ==========================================
  // BODY FAT CALCULATOR (Defaults to empty)
  // ==========================================
  const [bfGender, setBfGender] = useState<'male' | 'female'>('male');
  const [bfHeight, setBfHeight] = useState<number | ''>('');
  const [bfWeight, setBfWeight] = useState<number | ''>('');
  const [bfWaist, setBfWaist] = useState<number | ''>('');
  const [bfNeck, setBfNeck] = useState<number | ''>('');
  const [bfHip, setBfHip] = useState<number | ''>('');

  const bfResult = useMemo(() => {
    if (
      typeof bfHeight !== 'number' ||
      typeof bfWeight !== 'number' ||
      typeof bfWaist !== 'number' ||
      typeof bfNeck !== 'number' ||
      bfHeight <= 0 ||
      bfWeight <= 0 ||
      bfWaist <= 0 ||
      bfNeck <= 0
    ) {
      return null;
    }

    if (bfGender === 'female' && (typeof bfHip !== 'number' || bfHip <= 0)) {
      return null;
    }

    return calculateBodyFat({
      gender: bfGender,
      age: 30,
      heightCm: bfHeight,
      weightKg: bfWeight,
      waistCm: bfWaist,
      neckCm: bfNeck,
      hipCm: bfGender === 'female' && typeof bfHip === 'number' ? bfHip : undefined,
    });
  }, [bfGender, bfHeight, bfWeight, bfWaist, bfNeck, bfHip]);

  // ==========================================
  // BMR CALCULATOR (Defaults to empty)
  // ==========================================
  const [bmrGender, setBmrGender] = useState<'male' | 'female'>('male');
  const [bmrAge, setBmrAge] = useState<number | ''>('');
  const [bmrHeight, setBmrHeight] = useState<number | ''>('');
  const [bmrWeight, setBmrWeight] = useState<number | ''>('');

  const bmrResult = useMemo(() => {
    if (
      typeof bmrAge !== 'number' ||
      typeof bmrHeight !== 'number' ||
      typeof bmrWeight !== 'number' ||
      bmrAge <= 0 ||
      bmrHeight <= 0 ||
      bmrWeight <= 0
    ) {
      return null;
    }
    // Mifflin-St Jeor Formula
    const base = 10 * bmrWeight + 6.25 * bmrHeight - 5 * bmrAge + (bmrGender === 'male' ? 5 : -161);
    return {
      bmr: Math.round(base),
      sedentary: Math.round(base * 1.2),
      moderate: Math.round(base * 1.55),
      active: Math.round(base * 1.725),
    };
  }, [bmrGender, bmrAge, bmrHeight, bmrWeight]);

  // ==========================================
  // IDEAL WEIGHT CALCULATOR (Defaults to empty)
  // ==========================================
  const [iwGender, setIwGender] = useState<'male' | 'female'>('female');
  const [iwHeight, setIwHeight] = useState<number | ''>('');

  const iwResult = useMemo(() => {
    if (typeof iwHeight !== 'number' || iwHeight <= 0) {
      return null;
    }
    return calculateIdealWeight(iwGender, iwHeight);
  }, [iwGender, iwHeight]);

  // ==========================================
  // PACE CALCULATOR (Defaults to empty)
  // ==========================================
  const [paceDistance, setPaceDistance] = useState<number | ''>('');
  const [paceDistanceUnit, setPaceDistanceUnit] = useState<string>('km');
  const [paceHours, setPaceHours] = useState<number | ''>('');
  const [paceMins, setPaceMins] = useState<number | ''>('');
  const [paceSecs, setPaceSecs] = useState<number | ''>('');

  const paceResult = useMemo(() => {
    const rawDist = typeof paceDistance === 'number' ? paceDistance : 0;
    const h = typeof paceHours === 'number' ? paceHours : 0;
    const m = typeof paceMins === 'number' ? paceMins : 0;
    const s = typeof paceSecs === 'number' ? paceSecs : 0;

    if (rawDist <= 0 || (h === 0 && m === 0 && s === 0)) {
      return null;
    }

    let distKm = rawDist;
    if (paceDistanceUnit === 'mi') distKm = rawDist * 1.609344;
    else if (paceDistanceUnit === 'm') distKm = rawDist / 1000;
    else if (paceDistanceUnit === 'yd') distKm = rawDist * 0.0009144;

    return calculatePace({
      distanceKm: distKm,
      timeHours: h,
      timeMinutes: m,
      timeSeconds: s,
    });
  }, [paceDistance, paceDistanceUnit, paceHours, paceMins, paceSecs]);

  // ==========================================
  // PREGNANCY CALCULATOR (Defaults to empty)
  // ==========================================
  const [lmpDate, setLmpDate] = useState<string>('');
  const [cycleDays, setCycleDays] = useState<number | ''>('');

  const pregResult = useMemo(() => {
    if (!lmpDate) return null;
    const days = typeof cycleDays === 'number' && cycleDays > 0 ? cycleDays : 28;
    return calculatePregnancy({
      lastPeriodDate: lmpDate,
      cycleDays: days,
    });
  }, [lmpDate, cycleDays]);

  // ==========================================
  // PREGNANCY CONCEPTION CALCULATOR (Defaults to empty)
  // ==========================================
  const [conceptionDueDate, setConceptionDueDate] = useState<string>('');

  const conceptionResult = useMemo(() => {
    if (!conceptionDueDate) return null;
    return calculatePregnancyConception(conceptionDueDate);
  }, [conceptionDueDate]);

  // ==========================================
  // WATER INTAKE CALCULATOR (Defaults to empty)
  // ==========================================
  const [waterWeight, setWaterWeight] = useState<number | ''>('');
  const [waterWorkout, setWaterWorkout] = useState<number | ''>('');
  const [waterClimate, setWaterClimate] = useState<'cold' | 'normal' | 'hot'>('normal');

  const waterResult = useMemo(() => {
    if (typeof waterWeight !== 'number' || waterWeight <= 0) {
      return null;
    }
    const workoutMins = typeof waterWorkout === 'number' && waterWorkout >= 0 ? waterWorkout : 0;
    return calculateWaterIntake(waterWeight, workoutMins, waterClimate);
  }, [waterWeight, waterWorkout, waterClimate]);

  const handleResetBodyFat = () => {
    setBfGender('male');
    setBfHeight('');
    setBfWeight('');
    setBfWaist('');
    setBfNeck('');
    setBfHip('');
  };

  const handleResetBMR = () => {
    setBmrGender('male');
    setBmrAge('');
    setBmrHeight('');
    setBmrWeight('');
  };

  const handleResetIdealWeight = () => {
    setIwGender('female');
    setIwHeight('');
  };

  const handleResetPace = () => {
    setPaceDistance('');
    setPaceDistanceUnit('km');
    setPaceHours('');
    setPaceMins('');
    setPaceSecs('');
  };

  const handleResetPregnancy = () => {
    setLmpDate('');
    setCycleDays('');
  };

  const handleResetConception = () => {
    setConceptionDueDate('');
  };

  const handleResetWater = () => {
    setWaterWeight('');
    setWaterWorkout('');
    setWaterClimate('normal');
  };

  // 1. BODY FAT CALCULATOR
  if (toolSlug === 'body-fat-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Body Measurements</span>
              <button
                type="button"
                onClick={handleResetBodyFat}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBfGender('male')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  bfGender === 'male' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setBfGender('female')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  bfGender === 'female' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Female
              </button>
            </div>

            <UnitNumberInput
              id="bf-height"
              label="Height"
              value={bfHeight}
              onChange={setBfHeight}
              min={1}
              max={1000}
              step={1}
              units={[
                { id: 'cm', label: 'cm', symbol: 'cm' },
                { id: 'm', label: 'm', symbol: 'm' },
                { id: 'in', label: 'in', symbol: 'in' },
                { id: 'ft', label: 'ft', symbol: 'ft' },
              ]}
              placeholder="e.g. 175"
            />
            <UnitNumberInput
              id="bf-weight"
              label="Weight"
              value={bfWeight}
              onChange={setBfWeight}
              min={1}
              max={1000}
              step={0.5}
              units={[
                { id: 'kg', label: 'kg', symbol: 'kg' },
                { id: 'g', label: 'g', symbol: 'g' },
                { id: 'lb', label: 'lb', symbol: 'lb' },
                { id: 'stone', label: 'stone', symbol: 'stone' },
              ]}
              placeholder="e.g. 70"
            />
            <UnitNumberInput
              id="bf-waist"
              label="Waist Circumference (at navel)"
              value={bfWaist}
              onChange={setBfWaist}
              min={1}
              max={500}
              step={0.5}
              units={[
                { id: 'cm', label: 'cm', symbol: 'cm' },
                { id: 'in', label: 'in', symbol: 'in' },
              ]}
              placeholder="e.g. 80"
            />
            <UnitNumberInput
              id="bf-neck"
              label="Neck Circumference"
              value={bfNeck}
              onChange={setBfNeck}
              min={1}
              max={200}
              step={0.5}
              units={[
                { id: 'cm', label: 'cm', symbol: 'cm' },
                { id: 'in', label: 'in', symbol: 'in' },
              ]}
              placeholder="e.g. 38"
            />
            {bfGender === 'female' && (
              <UnitNumberInput
                id="bf-hip"
                label="Hip Circumference"
                value={bfHip}
                onChange={setBfHip}
                min={1}
                max={500}
                step={0.5}
                units={[
                  { id: 'cm', label: 'cm', symbol: 'cm' },
                  { id: 'in', label: 'in', symbol: 'in' },
                ]}
                placeholder="e.g. 95"
              />
            )}
          </div>

          {bfResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Body Fat %</span>
              <div className="text-5xl font-extrabold text-rose-600 tracking-tight mt-2">
                {bfResult.bodyFatPercentage}%
              </div>
              <div className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                {bfResult.category}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-200 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Total Fat Mass</span>
                  <span className="text-lg font-bold text-slate-900 mt-1 block">{bfResult.fatMassKg} kg</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Lean Body Mass</span>
                  <span className="text-lg font-bold text-emerald-600 mt-1 block">{bfResult.leanMassKg} kg</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Activity}
              title="Enter Body Measurements"
              subtitle="Enter height, weight, waist, and neck circumference to calculate estimated body fat percentage."
            />
          )}
        </div>
      </div>
    );
  }

  // 2. BMR CALCULATOR
  if (toolSlug === 'bmr-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Personal Metrics</span>
              <button
                type="button"
                onClick={handleResetBMR}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setBmrGender('male')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  bmrGender === 'male' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setBmrGender('female')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  bmrGender === 'female' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Female
              </button>
            </div>

            <UnitNumberInput
              id="bmr-age"
              label="Age"
              value={bmrAge}
              onChange={setBmrAge}
              min={1}
              max={120}
              step={1}
              units={[{ id: 'years', label: 'Years', symbol: 'yrs' }]}
              placeholder="e.g. 28"
            />
            <UnitNumberInput
              id="bmr-height"
              label="Height"
              value={bmrHeight}
              onChange={setBmrHeight}
              min={1}
              max={1000}
              step={1}
              units={[
                { id: 'cm', label: 'cm', symbol: 'cm' },
                { id: 'm', label: 'm', symbol: 'm' },
                { id: 'in', label: 'in', symbol: 'in' },
                { id: 'ft', label: 'ft', symbol: 'ft' },
              ]}
              placeholder="e.g. 175"
            />
            <UnitNumberInput
              id="bmr-weight"
              label="Weight"
              value={bmrWeight}
              onChange={setBmrWeight}
              min={1}
              max={1000}
              step={0.5}
              units={[
                { id: 'kg', label: 'kg', symbol: 'kg' },
                { id: 'g', label: 'g', symbol: 'g' },
                { id: 'lb', label: 'lb', symbol: 'lb' },
                { id: 'stone', label: 'stone', symbol: 'stone' },
              ]}
              placeholder="e.g. 70"
            />
          </div>

          {bmrResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Basal Metabolic Rate (BMR)</span>
              <div className="text-5xl font-extrabold text-amber-600 tracking-tight mt-2">
                {bmrResult.bmr}
              </div>
              <p className="text-xs text-slate-500 mt-2">Calories burned per day at complete resting state</p>

              <div className="space-y-2 mt-8 pt-6 border-t border-slate-200 text-xs text-left">
                <span className="font-bold text-slate-700 block mb-2">Daily Maintenance Calories by Activity Level:</span>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Sedentary (Little or no exercise):</span>
                  <span className="font-bold text-slate-900">{bmrResult.sedentary} kcal</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Moderate (3-5 days exercise/week):</span>
                  <span className="font-bold text-slate-900">{bmrResult.moderate} kcal</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-slate-600">Very Active (Heavy workouts 6-7 days):</span>
                  <span className="font-bold text-slate-900">{bmrResult.active} kcal</span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Flame}
              title="Enter Personal Metrics"
              subtitle="Enter your age, height, and weight to calculate baseline metabolic rate and daily calorie needs."
            />
          )}
        </div>
      </div>
    );
  }

  // 3. IDEAL WEIGHT CALCULATOR
  if (toolSlug === 'ideal-weight-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Body Height</span>
              <button
                type="button"
                onClick={handleResetIdealWeight}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setIwGender('male')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  iwGender === 'male' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setIwGender('female')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  iwGender === 'female' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                }`}
              >
                Female
              </button>
            </div>

            <UnitNumberInput
              id="iw-height"
              label="Height"
              value={iwHeight}
              onChange={setIwHeight}
              min={1}
              max={1000}
              step={1}
              units={[
                { id: 'cm', label: 'cm', symbol: 'cm' },
                { id: 'm', label: 'm', symbol: 'm' },
                { id: 'in', label: 'in', symbol: 'in' },
                { id: 'ft', label: 'ft', symbol: 'ft' },
              ]}
              placeholder="e.g. 168"
            />
          </div>

          {iwResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Clinical Ideal Body Weight (Devine)</span>
              <div className="text-5xl font-extrabold text-emerald-600 tracking-tight mt-2">
                {iwResult.devineKg} kg
              </div>
              <p className="text-xs text-slate-500 mt-2">Based on the widely cited Devine formula</p>

              <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Robinson Formula</span>
                  <span className="font-bold text-slate-900 text-sm mt-1 block">{iwResult.robinsonKg} kg</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Miller Formula</span>
                  <span className="font-bold text-slate-900 text-sm mt-1 block">{iwResult.millerKg} kg</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-center">
                <span className="text-emerald-800 font-bold block">WHO Healthy BMI Target Range (18.5 - 24.9):</span>
                <span className="text-emerald-950 font-bold text-sm mt-0.5 block">{iwResult.healthyBmiRangeKg}</span>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Scale}
              title="Enter Your Height"
              subtitle="Enter your height above to calculate ideal clinical body weights across standard medical formulas."
            />
          )}
        </div>
      </div>
    );
  }

  // 4. PACE CALCULATOR
  if (toolSlug === 'pace-calculator') {
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Distance & Time Parameters</span>
              <button
                type="button"
                onClick={handleResetPace}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <UnitNumberInput
              id="pace-dist"
              label="Distance"
              value={paceDistance}
              onChange={setPaceDistance}
              min={0.01}
              max={10000}
              step={0.1}
              units={[
                { id: 'km', label: 'km', symbol: 'km' },
                { id: 'mi', label: 'mi', symbol: 'mi' },
                { id: 'm', label: 'm', symbol: 'm' },
                { id: 'yd', label: 'yd', symbol: 'yd' },
              ]}
              currentUnit={paceDistanceUnit}
              onUnitChange={(u) => setPaceDistanceUnit(u)}
              placeholder="e.g. 5"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (paceDistanceUnit === 'mi') setPaceDistance(3.11);
                  else if (paceDistanceUnit === 'm') setPaceDistance(5000);
                  else if (paceDistanceUnit === 'yd') setPaceDistance(5468);
                  else setPaceDistance(5);
                }}
                className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                5K
              </button>
              <button
                type="button"
                onClick={() => {
                  if (paceDistanceUnit === 'mi') setPaceDistance(6.21);
                  else if (paceDistanceUnit === 'm') setPaceDistance(10000);
                  else if (paceDistanceUnit === 'yd') setPaceDistance(10936);
                  else setPaceDistance(10);
                }}
                className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                10K
              </button>
              <button
                type="button"
                onClick={() => {
                  if (paceDistanceUnit === 'mi') setPaceDistance(13.11);
                  else if (paceDistanceUnit === 'm') setPaceDistance(21097);
                  else if (paceDistanceUnit === 'yd') setPaceDistance(23072);
                  else setPaceDistance(21.1);
                }}
                className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Half Marathon
              </button>
              <button
                type="button"
                onClick={() => {
                  if (paceDistanceUnit === 'mi') setPaceDistance(26.22);
                  else if (paceDistanceUnit === 'm') setPaceDistance(42195);
                  else if (paceDistanceUnit === 'yd') setPaceDistance(46145);
                  else setPaceDistance(42.2);
                }}
                className="px-3 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Marathon
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hours</label>
                <input
                  type="number"
                  placeholder="0"
                  value={paceHours}
                  onChange={(e) => setPaceHours(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Minutes</label>
                <input
                  type="number"
                  placeholder="0"
                  value={paceMins}
                  onChange={(e) => setPaceMins(e.target.value === '' ? '' : Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Seconds</label>
                <input
                  type="number"
                  placeholder="0"
                  value={paceSecs}
                  onChange={(e) => setPaceSecs(e.target.value === '' ? '' : Math.max(0, Math.min(59, Number(e.target.value))))}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {paceResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Average Running Pace</span>
              <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
                {paceResult.paceMinPerKm}
              </div>
              <p className="text-xs text-slate-500 mt-2">Equivalent to {paceResult.paceMinPerMile}</p>

              <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Speed (Metric)</span>
                  <span className="text-lg font-bold text-slate-900 mt-1 block">{paceResult.speedKmh} km/h</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Speed (Imperial)</span>
                  <span className="text-lg font-bold text-slate-900 mt-1 block">{paceResult.speedMph} mph</span>
                </div>
              </div>

              {paceResult.splits && paceResult.splits.length > 0 && (
                <div className="mt-5 pt-4 border-t border-slate-200 text-left">
                  <span className="text-xs font-bold text-slate-700 block mb-2">Distance Split Times</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    {paceResult.splits.map((s) => (
                      <div key={s.km} className="bg-white p-2 rounded-lg border border-slate-200 text-center">
                        <span className="text-slate-400 block text-[10px]">Km {s.km}</span>
                        <span className="font-bold text-slate-800">{s.splitTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyStateCard
              icon={Heart}
              title="Enter Distance & Time"
              subtitle="Enter running distance and elapsed time to calculate pace per km, pace per mile, and average speed."
            />
          )}
        </div>
      </div>
    );
  }

  // 5. PREGNANCY DUE DATE CALCULATOR
  if (toolSlug === 'pregnancy-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Gestational Cycle</span>
              <button
                type="button"
                onClick={handleResetPregnancy}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                First Day of Last Menstrual Period (LMP)
              </label>
              <input
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-white"
              />
            </div>
            <NumberSliderInput
              id="preg-cycle"
              label="Average Menstrual Cycle Length (Days)"
              value={cycleDays}
              onChange={setCycleDays}
              min={21}
              max={35}
              step={1}
              suffix="Days"
              placeholder="e.g. 28"
            />
          </div>

          {pregResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Estimated Due Date</span>
              <div className="text-4xl font-extrabold text-rose-600 tracking-tight mt-2">
                {pregResult.dueDateFormatted}
              </div>
              <p className="text-xs text-slate-500 mt-1">Based on 280-day gestational calculation</p>

              <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Current Progress</span>
                  <span className="text-base font-bold text-slate-900 mt-1 block">
                    {pregResult.currentWeeks} Weeks {pregResult.currentDays} Days
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Current Trimester</span>
                  <span className="text-base font-bold text-rose-700 mt-1 block">{pregResult.trimester}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 text-left">
                <span className="font-bold text-slate-900 block mb-1">Estimated Conception Date:</span>
                <span>{pregResult.estimatedConceptionDateFormatted} (ovulation window)</span>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Baby}
              title="Select LMP Date"
              subtitle="Pick the first day of your last menstrual period to view estimated delivery date and gestational progress."
            />
          )}
        </div>
      </div>
    );
  }

  // 6. PREGNANCY CONCEPTION CALCULATOR
  if (toolSlug === 'pregnancy-conception-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Estimated Delivery Date</span>
              <button
                type="button"
                onClick={handleResetConception}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Estimated Baby Due Date</label>
              <input
                type="date"
                value={conceptionDueDate}
                onChange={(e) => setConceptionDueDate(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          {conceptionResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Most Probable Conception Date</span>
              <div className="text-4xl font-extrabold text-rose-600 tracking-tight mt-2">
                {conceptionResult.probableConceptionDate}
              </div>
              <p className="text-xs text-slate-500 mt-1">Approximately 266 days prior to expected delivery</p>

              <div className="mt-8 pt-6 border-t border-slate-200 bg-white p-4 rounded-xl border text-xs text-slate-700 text-left">
                <span className="font-bold text-slate-900 block mb-1">Probable Fertile Conception Window:</span>
                <span className="text-emerald-700 font-bold block mb-1">{conceptionResult.fertileWindow}</span>
                <p className="text-slate-500 leading-relaxed">
                  Sperm can survive up to 5 days within the reproductive tract. Conception may occur from intercourse in this window.
                </p>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Baby}
              title="Select Expected Due Date"
              subtitle="Pick your baby's estimated delivery date to back-calculate the probable conception and fertile window."
            />
          )}
        </div>
      </div>
    );
  }

  // 7. WATER INTAKE CALCULATOR
  if (toolSlug === 'water-intake-calculator') {
    return (
      <div>
        {DisclaimerBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-500">Hydration Factors</span>
              <button
                type="button"
                onClick={handleResetWater}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <NumberSliderInput
              id="water-weight"
              label="Body Weight (kg)"
              value={waterWeight}
              onChange={setWaterWeight}
              min={30}
              max={160}
              step={1}
              suffix="kg"
              placeholder="e.g. 70"
            />
            <NumberSliderInput
              id="water-workout"
              label="Daily Exercise Duration (Minutes)"
              value={waterWorkout}
              onChange={setWaterWorkout}
              min={0}
              max={180}
              step={15}
              suffix="Mins"
              placeholder="e.g. 45"
            />
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Climate Environment</label>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setWaterClimate('cold')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    waterClimate === 'cold' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Cold
                </button>
                <button
                  type="button"
                  onClick={() => setWaterClimate('normal')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    waterClimate === 'normal' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Temperate
                </button>
                <button
                  type="button"
                  onClick={() => setWaterClimate('hot')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    waterClimate === 'hot' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  Hot / Humid
                </button>
              </div>
            </div>
          </div>

          {waterResult ? (
            <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Daily Water Requirement</span>
              <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
                {waterResult.liters} L
              </div>
              <p className="text-xs text-slate-500 mt-2">~{waterResult.fluidOunces} Fluid Ounces per day</p>

              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Standard 250ml Glasses</span>
                  <span className="text-2xl font-bold text-blue-700 mt-1 block">~{waterResult.glasses} Glasses</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block">Baseline vs Workout</span>
                  <span className="text-slate-700 font-medium mt-1 block leading-tight">
                    Includes workout and climate replenishment
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <EmptyStateCard
              icon={Droplets}
              title="Enter Body Weight"
              subtitle="Enter your weight to calculate daily recommended hydration, glass count, and exercise adjustments."
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};
