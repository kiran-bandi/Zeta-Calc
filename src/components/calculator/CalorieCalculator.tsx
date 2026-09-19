import React, { useState, useMemo } from 'react';
import { Share2 } from 'lucide-react';
import { calculateTDEE } from '../../engine/health';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { DonutChart } from '../common/DonutChart';

export const CalorieCalculator: React.FC = () => {
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState<number | ''>('');
  const [weightKg, setWeightKg] = useState<number | ''>('');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'very_active' | 'athlete' | ''>('');
  const [goal, setGoal] = useState<'maintain' | 'mild_loss' | 'weight_loss' | 'extreme_loss' | 'mild_gain' | 'weight_gain' | ''>('');
  const [isShareOpen, setIsShareOpen] = useState(false);

  const result = useMemo(() => {
    const numAge = typeof age === 'number' ? age : parseFloat(age as string) || 0;
    const numHeight = typeof heightCm === 'number' ? heightCm : parseFloat(heightCm as string) || 0;
    const numWeight = typeof weightKg === 'number' ? weightKg : parseFloat(weightKg as string) || 0;
    if (numAge <= 0 || numHeight <= 0 || numWeight <= 0 || !activity || !goal) return null;
    return calculateTDEE({
      age: numAge,
      gender,
      heightCm: numHeight,
      weightKg: numWeight,
      activityLevel: activity,
      goal,
    });
  }, [age, gender, heightCm, weightKg, activity, goal]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    if (!result) return null;
    return {
      toolSlug: 'calorie-calculator',
      toolName: 'Calorie & TDEE Calculator',
      categorySlug: 'health',
      inputs: [
        { label: 'Age', value: `${age} Years` },
        { label: 'Gender', value: gender === 'male' ? 'Male' : 'Female' },
        { label: 'Height', value: `${heightCm} cm` },
        { label: 'Weight', value: `${weightKg} kg` },
        { label: 'Activity Level', value: activity ? activity.replace(/_/g, ' ') : '' },
        { label: 'Goal', value: goal ? goal.replace(/_/g, ' ') : '' },
      ],
      outputs: [
        { label: 'Target Daily Calories', value: `${result.targetCalories} kcal / day`, isHighlight: true },
        { label: 'Basal Metabolic Rate (BMR)', value: `${result.bmr} kcal` },
        { label: 'Maintenance Calories (TDEE)', value: `${result.tdee} kcal` },
        { label: 'Proteins', value: `${result.macros.proteinGrams}g` },
        { label: 'Carbs', value: `${result.macros.carbsGrams}g` },
        { label: 'Fats', value: `${result.macros.fatGrams}g` },
      ],
    };
  }, [result, age, gender, heightCm, weightKg, activity, goal]);

  return (
    <div className="space-y-6">
      {/* Input Parameters */}
      <div className="space-y-4">
        {/* Gender Selection */}
        <div>
          <label className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
            Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-2 max-w-xs">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                gender === 'male'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-2 text-xs font-bold rounded-xl border text-center transition-all ${
                gender === 'female'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <UnitNumberInput
            id="tdee-age"
            label="Age"
            value={age}
            onChange={setAge}
            min={1}
            max={120}
            helpText="Age measurement"
            units={[
              { id: 'years', label: 'Years', symbol: 'yrs' },
              { id: 'months', label: 'Months', symbol: 'mos' },
            ]}
          />
          <UnitNumberInput
            id="tdee-height"
            label="Height"
            value={heightCm}
            onChange={setHeightCm}
            min={1}
            max={1000}
            units={[
              { id: 'cm', label: 'cm', symbol: 'cm' },
              { id: 'm', label: 'm', symbol: 'm' },
              { id: 'ft', label: 'ft', symbol: 'ft' },
              { id: 'in', label: 'in', symbol: 'in' },
            ]}
          />
          <UnitNumberInput
            id="tdee-weight"
            label="Weight"
            value={weightKg}
            onChange={setWeightKg}
            min={1}
            max={1000}
            units={[
              { id: 'kg', label: 'kg', symbol: 'kg' },
              { id: 'lb', label: 'lb', symbol: 'lb' },
              { id: 'g', label: 'g', symbol: 'g' },
            ]}
          />
        </div>

        {/* Activity Level Selector */}
        <div>
          <label htmlFor="tdee-activity" className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
            Weekly Activity Level
          </label>
          <select
            id="tdee-activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value as any)}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white"
          >
            <option value="">Select activity level...</option>
            <option value="sedentary">Sedentary (desk job, minimal exercise)</option>
            <option value="light">Lightly Active (exercise 1-3 days/week)</option>
            <option value="moderate">Moderately Active (exercise 3-5 days/week)</option>
            <option value="very_active">Very Active (intense workouts 6-7 days/week)</option>
            <option value="athlete">Extra Active / Athlete (training 2x daily or physical job)</option>
          </select>
        </div>

        {/* Fitness Goal */}
        <div>
          <label htmlFor="tdee-goal" className="text-xs sm:text-sm font-semibold text-slate-800 block mb-1.5">
            Target Fitness Goal
          </label>
          <select
            id="tdee-goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as any)}
            className="w-full py-2.5 px-3 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 bg-white"
          >
            <option value="">Select fitness goal...</option>
            <option value="maintain">Maintain Current Weight</option>
            <option value="mild_loss">Mild Fat Loss (-250 kcal/day, ~0.25 kg/wk)</option>
            <option value="weight_loss">Standard Weight Loss (-500 kcal/day, ~0.5 kg/wk)</option>
            <option value="extreme_loss">Fast Weight Loss (-1000 kcal/day, ~1.0 kg/wk)</option>
            <option value="mild_gain">Lean Muscle Gain (+250 kcal/day)</option>
            <option value="weight_gain">Active Bulking (+500 kcal/day)</option>
          </select>
        </div>
      </div>

      {/* Results Card */}
      <div className="space-y-6">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              Daily Target Caloric Intake
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {(goal || 'MAINTAIN').replace('_', ' ').toUpperCase()}
              </span>
              {result && (
                <button
                  type="button"
                  onClick={() => setIsShareOpen(true)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-xl border border-slate-700 transition-colors shadow-2xs"
                  title="Share results to social media"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
            {result?.targetCalories != null ? result.targetCalories.toLocaleString() : '0'}{' '}
            <span className="text-base font-medium text-slate-400">kcal / day</span>
          </div>

          <p className="text-xs text-slate-400 mb-5">
            Your estimated maintenance expenditure (TDEE) is <strong className="text-slate-200">{result?.tdee != null ? result.tdee.toLocaleString() : '0'} kcal</strong>.
            Basal Metabolic Rate (BMR) at rest is <strong className="text-slate-200">{result?.bmr != null ? result.bmr.toLocaleString() : '0'} kcal</strong>.
          </p>

          {/* Macronutrient Distribution */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              Suggested Daily Macronutrients
            </span>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <span className="text-[11px] text-blue-400 font-semibold block mb-0.5">Protein (30%)</span>
                <div className="text-lg font-black text-white">{result?.macros ? result.macros.proteinGrams : 0}g</div>
                <span className="text-[10px] text-slate-400">{result?.macros ? result.macros.proteinCalories : 0} kcal</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <span className="text-[11px] text-emerald-400 font-semibold block mb-0.5">Carbs (40%)</span>
                <div className="text-lg font-black text-white">{result?.macros ? result.macros.carbsGrams : 0}g</div>
                <span className="text-[10px] text-slate-400">{result?.macros ? result.macros.carbsCalories : 0} kcal</span>
              </div>
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <span className="text-[11px] text-amber-400 font-semibold block mb-0.5">Fats (30%)</span>
                <div className="text-lg font-black text-white">{result?.macros ? result.macros.fatGrams : 0}g</div>
                <span className="text-[10px] text-slate-400">{result?.macros ? result.macros.fatCalories : 0} kcal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Macronutrient Chart */}
        {result?.macros && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Macronutrient Energy Distribution</h3>
            <DonutChart
              size={180}
              centerTitle="Caloric Goal"
              centerSubtitle={`${result.targetCalories} kcal`}
              segments={[
                {
                  label: 'Protein (30%)',
                  value: result.macros.proteinCalories,
                  color: '#2563eb',
                  formattedValue: `${result.macros.proteinGrams}g (${result.macros.proteinCalories} kcal)`,
                },
                {
                  label: 'Carbohydrates (40%)',
                  value: result.macros.carbsCalories,
                  color: '#10b981',
                  formattedValue: `${result.macros.carbsGrams}g (${result.macros.carbsCalories} kcal)`,
                },
                {
                  label: 'Fats (30%)',
                  value: result.macros.fatCalories,
                  color: '#f59e0b',
                  formattedValue: `${result.macros.fatGrams}g (${result.macros.fatCalories} kcal)`,
                },
              ]}
            />
          </div>
        )}

        {result && (
          <ShareModal
            isOpen={isShareOpen}
            onClose={() => setIsShareOpen(false)}
            title="Daily Caloric Target & TDEE Results"
            toolName="Calorie & TDEE Calculator"
            toolSlug="calorie-calculator"
            categorySlug="health"
            description={`My daily target caloric intake is ${result.targetCalories} kcal/day for my fitness goal. Check your caloric requirements on Zeta Calculator!`}
            calculationData={calculationShareData}
          />
        )}
      </div>
    </div>
  );
};
