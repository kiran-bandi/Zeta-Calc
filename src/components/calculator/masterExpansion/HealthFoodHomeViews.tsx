import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import {
  calculateMacroSplit,
  calculateProteinIntake,
  calculateLeanBodyMass,
  calculateRunningCalories,
  calculateVO2Max,
  calculateHeartRateZones,
  scaleRecipe,
  calculateFoodCostPerServing,
  calculateRestaurantFoodCostPercentage,
  calculateGravel,
  calculateMulch,
  calculateRoofing,
  calculateFence,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const HEALTH_FOOD_HOME_SLUGS = [
  'macro-calculator',
  'protein-intake-calculator',
  'lean-body-mass-calculator',
  'running-calorie-calculator',
  'vo2-max-calculator',
  'heart-rate-zone-calculator',
  'recipe-scaling-calculator',
  'food-cost-per-serving-calculator',
  'restaurant-food-cost-percentage-calculator',
  'gravel-calculator',
  'mulch-calculator',
  'roofing-calculator',
  'fence-calculator',
];

export const HealthFoodHomeViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Macros
  const [mcCals, setMcCals] = useSessionState<number | ''>('mc_cals', 2200);
  const [mcProtPct, setMcProtPct] = useSessionState<number | ''>('mc_ppct', 30);
  const [mcCarbPct, setMcCarbPct] = useSessionState<number | ''>('mc_cpct', 45);
  const [mcFatPct, setMcFatPct] = useSessionState<number | ''>('mc_fpct', 25);

  const macroResult = useMemo(() => {
    if (typeof mcCals !== 'number' || typeof mcProtPct !== 'number' || typeof mcCarbPct !== 'number' || typeof mcFatPct !== 'number') return null;
    return calculateMacroSplit(mcCals, mcProtPct, mcCarbPct, mcFatPct);
  }, [mcCals, mcProtPct, mcCarbPct, mcFatPct]);

  // 2. Protein Intake
  const [piWtKg, setPiWtKg] = useSessionState<number | ''>('pi_wtkg', 75);
  const [piGoal, setPiGoal] = useSessionState<'sedentary' | 'moderate' | 'muscle_gain' | 'athlete'>('pi_goal', 'muscle_gain');

  const proteinResult = useMemo(() => {
    if (typeof piWtKg !== 'number') return null;
    return calculateProteinIntake(piWtKg, piGoal);
  }, [piWtKg, piGoal]);

  // 3. Lean Body Mass
  const [lbmWtKg, setLbmWtKg] = useSessionState<number | ''>('lbm_wtkg', 80);
  const [lbmHtCm, setLbmHtCm] = useSessionState<number | ''>('lbm_htcm', 178);
  const [lbmGender, setLbmGender] = useSessionState<'male' | 'female'>('lbm_gen', 'male');

  const lbmResult = useMemo(() => {
    if (typeof lbmWtKg !== 'number' || typeof lbmHtCm !== 'number') return null;
    return calculateLeanBodyMass(lbmWtKg, lbmHtCm, lbmGender);
  }, [lbmWtKg, lbmHtCm, lbmGender]);

  // 4. Running Calories
  const [rcWeightKg, setRcWeightKg] = useSessionState<number | ''>('rc_wtkg', 70);
  const [rcDistKm, setRcDistKm] = useSessionState<number | ''>('rc_dstkm', 5);

  const runningCalResult = useMemo(() => {
    if (typeof rcWeightKg !== 'number' || typeof rcDistKm !== 'number') return null;
    return calculateRunningCalories(rcWeightKg, rcDistKm);
  }, [rcWeightKg, rcDistKm]);

  // 5. VO2 Max
  const [voAge, setVoAge] = useSessionState<number | ''>('vo_age', 32);
  const [voRhr, setVoRhr] = useSessionState<number | ''>('vo_rhr', 60);

  const vo2Result = useMemo(() => {
    if (typeof voAge !== 'number' || typeof voRhr !== 'number') return null;
    return calculateVO2Max(voRhr, voAge);
  }, [voAge, voRhr]);

  // 6. Heart Rate Zones
  const [hrAge, setHrAge] = useSessionState<number | ''>('hr_age', 30);
  const [hrRhr, setHrRhr] = useSessionState<number | ''>('hr_rhr', 62);

  const hrZonesResult = useMemo(() => {
    if (typeof hrAge !== 'number') return null;
    return calculateHeartRateZones(hrAge, typeof hrRhr === 'number' ? hrRhr : 60);
  }, [hrAge, hrRhr]);

  // 7. Recipe Scaling
  const [rsOrig, setRsOrig] = useSessionState<number | ''>('rs_orig', 4);
  const [rsTgt, setRsTgt] = useSessionState<number | ''>('rs_tgt', 10);
  const sampleIngredients = useMemo(() => [
    { name: 'Flour', amount: 250, unit: 'g' },
    { name: 'Sugar', amount: 100, unit: 'g' },
    { name: 'Butter', amount: 125, unit: 'g' },
    { name: 'Eggs', amount: 2, unit: 'items' },
    { name: 'Milk', amount: 150, unit: 'ml' },
  ], []);

  const recipeScaleResult = useMemo(() => {
    if (typeof rsOrig !== 'number' || typeof rsTgt !== 'number') return null;
    return scaleRecipe(rsOrig, rsTgt, sampleIngredients);
  }, [rsOrig, rsTgt, sampleIngredients]);

  // 8. Food Cost per Serving
  const [fcsTotal, setFcsTotal] = useSessionState<number | ''>('fcs_tot', 24.50);
  const [fcsYield, setFcsYield] = useSessionState<number | ''>('fcs_yld', 6);
  const [fcsMargin, setFcsMargin] = useSessionState<number | ''>('fcs_mar', 65);

  const foodCostServingResult = useMemo(() => {
    if (typeof fcsTotal !== 'number' || typeof fcsYield !== 'number') return null;
    return calculateFoodCostPerServing(fcsTotal, fcsYield, typeof fcsMargin === 'number' ? fcsMargin : 70);
  }, [fcsTotal, fcsYield, fcsMargin]);

  // 9. Restaurant Food Cost %
  const [rfcCost, setRfcCost] = useSessionState<number | ''>('rfc_cost', 4.80);
  const [rfcPrice, setRfcPrice] = useSessionState<number | ''>('rfc_price', 16.00);

  const restaurantFoodCostResult = useMemo(() => {
    if (typeof rfcCost !== 'number' || typeof rfcPrice !== 'number') return null;
    return calculateRestaurantFoodCostPercentage(rfcCost, rfcPrice);
  }, [rfcCost, rfcPrice]);

  // 10. Gravel
  const [gvLen, setGvLen] = useSessionState<number | ''>('gv_len', 30);
  const [gvWid, setGvWid] = useSessionState<number | ''>('gv_wid', 10);
  const [gvDepth, setGvDepth] = useSessionState<number | ''>('gv_depth', 3);

  const gravelResult = useMemo(() => {
    if (typeof gvLen !== 'number' || typeof gvWid !== 'number' || typeof gvDepth !== 'number') return null;
    return calculateGravel(gvLen, gvWid, gvDepth);
  }, [gvLen, gvWid, gvDepth]);

  // 11. Mulch
  const [mlLen, setMlLen] = useSessionState<number | ''>('ml_len', 30);
  const [mlWid, setMlWid] = useSessionState<number | ''>('ml_wid', 10);
  const [mlDepth, setMlDepth] = useSessionState<number | ''>('ml_depth', 3);

  const mulchResult = useMemo(() => {
    if (typeof mlLen !== 'number' || typeof mlWid !== 'number' || typeof mlDepth !== 'number') return null;
    return calculateMulch(mlLen, mlWid, mlDepth);
  }, [mlLen, mlWid, mlDepth]);

  // 12. Roofing Squares
  const [rfLen, setRfLen] = useSessionState<number | ''>('rf_len', 45);
  const [rfWid, setRfWid] = useSessionState<number | ''>('rf_wid', 30);
  const [rfPitch, setRfPitch] = useSessionState<number | ''>('rf_pitch', 6);

  const roofingResult = useMemo(() => {
    if (typeof rfLen !== 'number' || typeof rfWid !== 'number' || typeof rfPitch !== 'number') return null;
    return calculateRoofing(rfLen, rfWid, rfPitch);
  }, [rfLen, rfWid, rfPitch]);

  // 13. Fence
  const [fnLen, setFnLen] = useSessionState<number | ''>('fn_len', 120);
  const [fnPostSpc, setFnPostSpc] = useSessionState<number | ''>('fn_post_spc', 8);

  const fenceResult = useMemo(() => {
    if (typeof fnLen !== 'number') return null;
    return calculateFence(fnLen, typeof fnPostSpc === 'number' ? fnPostSpc : 8);
  }, [fnLen, fnPostSpc]);

  // RENDERING
  if (toolSlug === 'macro-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Macronutrient Calorie Distribution Calculator"
        onReset={() => { setMcCals(2200); setMcProtPct(30); setMcCarbPct(45); setMcFatPct(25); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Daily Target Calories (kcal)</label>
              <input type="number" value={mcCals} onChange={(e) => setMcCals(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Protein %</label>
                <input type="number" value={mcProtPct} onChange={(e) => setMcProtPct(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Carbs %</label>
                <input type="number" value={mcCarbPct} onChange={(e) => setMcCarbPct(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Fat %</label>
                <input type="number" value={mcFatPct} onChange={(e) => setMcFatPct(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          macroResult ? (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-400 font-bold uppercase">Protein</span>
                <div className="text-2xl font-bold text-blue-900 dark:text-white mt-1">{macroResult.proteinGrams}g</div>
                <div className="text-slate-500 mt-1">{macroResult.proteinCalories} kcal</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-amber-700 dark:text-amber-400 font-bold uppercase">Carbs</span>
                <div className="text-2xl font-bold text-amber-900 dark:text-white mt-1">{macroResult.carbsGrams}g</div>
                <div className="text-slate-500 mt-1">{macroResult.carbsCalories} kcal</div>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-emerald-400 font-bold uppercase">Fats</span>
                <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1">{macroResult.fatGrams}g</div>
                <div className="text-slate-500 mt-1">{macroResult.fatCalories} kcal</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'protein-intake-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Daily Protein Intake Requirement Calculator"
        onReset={() => { setPiWtKg(75); setPiGoal('muscle_gain'); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Body Weight (kg)</label>
              <input type="number" value={piWtKg} onChange={(e) => setPiWtKg(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Activity Level / Target</label>
              <select value={piGoal} onChange={(e) => setPiGoal(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800">
                <option value="sedentary">Sedentary (0.8 - 1.0 g/kg)</option>
                <option value="moderate">Moderate Activity (1.2 - 1.6 g/kg)</option>
                <option value="muscle_gain">Muscle Gain / Hypertrophy (1.6 - 2.2 g/kg)</option>
                <option value="athlete">Athlete / High Endurance (2.0 - 2.5 g/kg)</option>
              </select>
            </div>
          </div>
        }
        results={
          proteinResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Recommended Daily Protein Range</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{proteinResult.minGrams}g - {proteinResult.maxGrams}g</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Based on {piWtKg} kg bodyweight and your chosen activity goal</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'lean-body-mass-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Lean Body Mass & Fat Mass Calculator (Boer Formula)"
        onReset={() => { setLbmWtKg(80); setLbmHtCm(178); setLbmGender('male'); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Body Weight (kg)</label>
                <input type="number" value={lbmWtKg} onChange={(e) => setLbmWtKg(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Height (cm)</label>
                <input type="number" value={lbmHtCm} onChange={(e) => setLbmHtCm(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Gender</label>
              <select value={lbmGender} onChange={(e) => setLbmGender(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        }
        results={
          lbmResult ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Lean Body Mass</span>
                <div className="text-2xl font-bold text-emerald-900 dark:text-white mt-1">{lbmResult.leanBodyMassKg} kg</div>
                <div className="text-xs text-slate-500 mt-0.5">{Math.round((lbmResult.leanBodyMassKg / (typeof lbmWtKg === 'number' ? lbmWtKg : 1)) * 100)}% of body</div>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Estimated Fat Mass</span>
                <div className="text-2xl font-bold text-amber-900 dark:text-white mt-1">{lbmResult.fatMassKg} kg</div>
                <div className="text-xs text-slate-500 mt-0.5">{lbmResult.bodyFatPercent}% body fat</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'running-calorie-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Running & Jogging Calorie Burn Calculator"
        onReset={() => { setRcWeightKg(70); setRcDistKm(5); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Runner Weight (kg)</label>
              <input type="number" value={rcWeightKg} onChange={(e) => setRcWeightKg(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Distance (km)</label>
              <input type="number" step="0.1" value={rcDistKm} onChange={(e) => setRcDistKm(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          runningCalResult ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Estimated Calories Burned</span>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{runningCalResult.estimatedCaloriesBurned} kcal</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Based on ~1.036 kcal per kg of bodyweight per kilometer</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'vo2-max-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="VO2 Max Fitness Potential Estimator (Uth-Sørensen Formula)"
        onReset={() => { setVoAge(32); setVoRhr(60); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Age (Years)</label>
                <input type="number" value={voAge} onChange={(e) => setVoAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Resting Heart Rate (bpm)</label>
                <input type="number" value={voRhr} onChange={(e) => setVoRhr(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          vo2Result ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Estimated VO2 Max</span>
              <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{vo2Result.estimatedVO2Max} mL/kg/min</div>
              <div className="text-xs text-blue-700 dark:text-blue-300 mt-1 font-semibold">Estimated Max HR: {vo2Result.maxHeartRate} bpm</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'heart-rate-zone-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Cardio Heart Rate Training Zones (Karvonen Reserve)"
        onReset={() => { setHrAge(30); setHrRhr(62); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Age</label>
                <input type="number" value={hrAge} onChange={(e) => setHrAge(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Resting HR (bpm)</label>
                <input type="number" value={hrRhr} onChange={(e) => setHrRhr(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          hrZonesResult ? (
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border text-xs flex justify-between">
                <span>Max Heart Rate: <strong>{hrZonesResult.maxHeartRate} bpm</strong></span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                  <span className="font-medium text-slate-800 dark:text-white">Zone 1: Active Recovery (50-60%)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{hrZonesResult.zone1Recovery.min} - {hrZonesResult.zone1Recovery.max} bpm</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                  <span className="font-medium text-slate-800 dark:text-white">Zone 2: Aerobic Base (60-70%)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{hrZonesResult.zone2Aerobic.min} - {hrZonesResult.zone2Aerobic.max} bpm</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                  <span className="font-medium text-slate-800 dark:text-white">Zone 3: Tempo / Aerobic Endurance (70-80%)</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{hrZonesResult.zone3Tempo.min} - {hrZonesResult.zone3Tempo.max} bpm</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                  <span className="font-medium text-slate-800 dark:text-white">Zone 4: Anaerobic Threshold (80-90%)</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">{hrZonesResult.zone4Threshold.min} - {hrZonesResult.zone4Threshold.max} bpm</span>
                </div>
                <div className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                  <span className="font-medium text-slate-800 dark:text-white">Zone 5: Maximum Effort / Neuromuscular (90-100%)</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{hrZonesResult.zone5Neuromuscular.min} - {hrZonesResult.zone5Neuromuscular.max} bpm</span>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'recipe-scaling-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Recipe Scaling & Ingredient Multiplier"
        onReset={() => { setRsOrig(4); setRsTgt(10); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Original Servings</label>
                <input type="number" value={rsOrig} onChange={(e) => setRsOrig(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Servings</label>
                <input type="number" value={rsTgt} onChange={(e) => setRsTgt(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          recipeScaleResult ? (
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Scale Factor: {Math.round((Number(rsTgt) / Number(rsOrig)) * 100) / 100}x</span>
              </div>
              <div className="space-y-1 text-xs">
                {recipeScaleResult.map((ing, idx) => (
                  <div key={idx} className="p-2 bg-white dark:bg-slate-800 rounded border flex justify-between items-center">
                    <span className="font-medium text-slate-800 dark:text-white">{ing.name}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{ing.amount} {ing.unit}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'food-cost-per-serving-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Food Cost per Serving & Menu Pricing Calculator"
        onReset={() => { setFcsTotal(24.50); setFcsYield(6); setFcsMargin(65); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Batch Total Ingredient Cost ({currencySymbol})</label>
              <input type="number" step="0.1" value={fcsTotal} onChange={(e) => setFcsTotal(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Portions / Yield</label>
                <input type="number" value={fcsYield} onChange={(e) => setFcsYield(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Target Margin %</label>
                <input type="number" value={fcsMargin} onChange={(e) => setFcsMargin(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
          </div>
        }
        results={
          foodCostServingResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Cost per Serving</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(foodCostServingResult.costPerServing)}</div>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-blue-800 dark:text-blue-300 font-semibold">Suggested Menu Price ({fcsMargin}% margin)</span>
                <span className="font-bold text-blue-900 dark:text-white text-base">{formatMoney(foodCostServingResult.suggestedMenuPrice)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'restaurant-food-cost-percentage-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Restaurant Food Cost Percentage Calculator"
        onReset={() => { setRfcCost(4.80); setRfcPrice(16.00); }}
        inputs={
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Plate Ingredient Cost ({currencySymbol})</label>
              <input type="number" step="0.1" value={rfcCost} onChange={(e) => setRfcCost(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Menu Selling Price ({currencySymbol})</label>
              <input type="number" step="0.1" value={rfcPrice} onChange={(e) => setRfcPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          restaurantFoodCostResult ? (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Food Cost Percentage</span>
              <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{restaurantFoodCostResult.foodCostPercent}%</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Gross margin: {restaurantFoodCostResult.grossMarginPercent}%</div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'gravel-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Gravel & Crushed Stone Volume Calculator"
        onReset={() => { setGvLen(30); setGvWid(10); setGvDepth(3); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Length (Feet)</label>
                <input type="number" value={gvLen} onChange={(e) => setGvLen(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Width (Feet)</label>
                <input type="number" value={gvWid} onChange={(e) => setGvWid(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Depth (Inches)</label>
              <input type="number" value={gvDepth} onChange={(e) => setGvDepth(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          gravelResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Estimated Weight</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{gravelResult.tonsEstimated} Tons</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{gravelResult.cubicYards} Cubic Yards ({gravelResult.cubicMeters} m³)</div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'mulch-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Mulch Yardage & Bags Calculator"
        onReset={() => { setMlLen(30); setMlWid(10); setMlDepth(3); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Length (Feet)</label>
                <input type="number" value={mlLen} onChange={(e) => setMlLen(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Width (Feet)</label>
                <input type="number" value={mlWid} onChange={(e) => setMlWid(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Depth (Inches)</label>
              <input type="number" value={mlDepth} onChange={(e) => setMlDepth(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          mulchResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Volume Needed</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{mulchResult.cubicYards} Cu Yds</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{mulchResult.cubicFeet} Cubic Feet</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">2 Cu Ft Retail Bags</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{mulchResult.bagsTwoCubicFeet} Bags</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'roofing-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Roofing Squares & Shingle Bundle Calculator"
        onReset={() => { setRfLen(45); setRfWid(30); setRfPitch(6); }}
        inputs={
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Base Length (ft)</label>
                <input type="number" value={rfLen} onChange={(e) => setRfLen(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Base Width (ft)</label>
                <input type="number" value={rfWid} onChange={(e) => setRfWid(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-2.5 py-1.5 border rounded text-xs dark:bg-slate-800" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Pitch Rise (in / 12)</label>
              <input type="number" value={rfPitch} onChange={(e) => setRfPitch(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
            </div>
          </div>
        }
        results={
          roofingResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Roofing Squares Needed</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{roofingResult.roofingSquares} Squares</div>
                <div className="text-xs text-slate-500 mt-1">{roofingResult.totalRoofAreaSqFt} sq ft total roof area</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Shingle Bundles (3 per square)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{roofingResult.bundlesRequired} Bundles</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / Fence
  return (
    <CompactCalculatorWorkspace
      title="Fence Posts & Panels Material Calculator"
      onReset={() => { setFnLen(120); setFnPostSpc(8); }}
      inputs={
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Total Fence Length (Feet)</label>
            <input type="number" value={fnLen} onChange={(e) => setFnLen(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">Post Spacing (ft)</label>
            <input type="number" value={fnPostSpc} onChange={(e) => setFnPostSpc(e.target.value === '' ? '' : Number(e.target.value))} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800" />
          </div>
        </div>
      }
      results={
        fenceResult ? (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
              <span className="text-slate-500">Posts</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{fenceResult.postsCount}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
              <span className="text-slate-500">Panels</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{fenceResult.panelsCount}</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border">
              <span className="text-slate-500">Rails</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{fenceResult.railsCount}</div>
            </div>
          </div>
        ) : null
      }
    />
  );
};
