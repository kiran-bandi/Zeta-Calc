import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { Activity, Moon, Heart, Calendar } from 'lucide-react';
import {
  calculateProtein,
  calculateSleep,
  calculateOvulation,
  ProteinGoal,
  SleepMode,
} from '../../../engine/healthPhaseEngines';

export const HEALTH_PHASE_SLUGS = [
  'protein-calculator',
  'sleep-calculator',
  'ovulation-calculator',
];

interface Props {
  toolSlug: string;
}

export const HealthPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  // 1. Protein Calculator
  const [protWeight, setProtWeight] = useState<number | ''>('');
  const [protUnit, setProtUnit] = useState<'kg' | 'lb'>('kg');
  const [protGoal, setProtGoal] = useState<ProteinGoal>('moderate');
  const protResult = useMemo(() => calculateProtein(protWeight, protUnit, protGoal), [protWeight, protUnit, protGoal]);

  // 2. Sleep Calculator
  const [sleepMode, setSleepMode] = useState<SleepMode>('wake_at');
  const [sleepTime, setSleepTime] = useState<string>('07:00');
  const [sleepLatency, setSleepLatency] = useState<number | ''>(15);
  const sleepResult = useMemo(() => calculateSleep(sleepMode, sleepTime, sleepLatency), [sleepMode, sleepTime, sleepLatency]);

  // 3. Ovulation Calculator
  const [lmpDate, setLmpDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<number | ''>(28);
  const [lutealPhase, setLutealPhase] = useState<number | ''>(14);
  const ovResult = useMemo(() => calculateOvulation(lmpDate, cycleLength, lutealPhase), [lmpDate, cycleLength, lutealPhase]);

  // =========================================================================
  // VIEW 1: PROTEIN CALCULATOR
  // =========================================================================
  if (toolSlug === 'protein-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="protein-calc"
        inputsTitle="Body Weight & Activity Goal"
        resultsTitle="Daily Protein Targets"
        onReset={() => {
          setProtWeight('');
          setProtGoal('moderate');
        }}
        inputs={
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Body Weight</label>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setProtUnit('kg')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md transition-colors ${protUnit === 'kg' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'}`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtUnit('lb')}
                    className={`px-2 py-0.5 text-xs font-bold rounded-md transition-colors ${protUnit === 'lb' ? 'bg-white shadow-2xs text-emerald-700' : 'text-slate-600'}`}
                  >
                    lb
                  </button>
                </div>
              </div>
              <NumberSliderInput
                label=""
                value={protWeight}
                onChange={setProtWeight}
                min={30}
                max={200}
                step={0.5}
                placeholder={protUnit === 'kg' ? 'e.g. 75' : 'e.g. 165'}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Activity & Training Goal</label>
              <select
                value={protGoal}
                onChange={(e) => setProtGoal(e.target.value as ProteinGoal)}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sedentary">Sedentary (0.8 - 1.2 g/kg DRI baseline)</option>
                <option value="light">Light Activity / Casual Fitness (1.0 - 1.4 g/kg)</option>
                <option value="moderate">Moderate Exercise / Sports (1.2 - 1.7 g/kg)</option>
                <option value="endurance">Endurance Training / Running (1.4 - 1.8 g/kg)</option>
                <option value="strength_hypertrophy">Muscle Hypertrophy & Strength (1.6 - 2.2 g/kg)</option>
                <option value="fat_loss_high">Fat Loss in Caloric Deficit (1.8 - 2.4 g/kg)</option>
              </select>
            </div>
          </div>
        }
        results={
          protResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                  Target Daily Protein
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {protResult.recommendedGrams} g <span className="text-xl font-normal text-emerald-300">/ day</span>
                </div>
                <p className="text-sm text-emerald-200">
                  Optimal intake range: {protResult.lowGrams}g – {protResult.highGrams}g ({protResult.recommendedMultiplier} g/kg bodyweight).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">3 Meals / Day</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{protResult.perMeal3Grams}g</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">4 Meals / Day</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{protResult.perMeal4Grams}g</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">5 Meals / Day</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{protResult.perMeal5Grams}g</div>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-950 space-y-1">
                <div className="font-bold text-emerald-900">Clinical Guidelines:</div>
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-800">
                  {protResult.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter body weight and activity goal to calculate precise daily protein macronutrient targets.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: SLEEP CALCULATOR
  // =========================================================================
  if (toolSlug === 'sleep-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="sleep-calc"
        inputsTitle="Sleep Schedule Preferences"
        resultsTitle="Optimal Sleep & Wake Cycles"
        onReset={() => {
          setSleepTime('07:00');
          setSleepLatency(15);
        }}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Calculation Goal</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSleepMode('wake_at')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${sleepMode === 'wake_at' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  I want to wake up at
                </button>
                <button
                  type="button"
                  onClick={() => setSleepMode('sleep_at')}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${sleepMode === 'sleep_at' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  I plan to sleep at
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                {sleepMode === 'wake_at' ? 'Target Wake-Up Time' : 'Target Bed Time'}
              </label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <NumberSliderInput
              label="Time to Fall Asleep (Sleep Latency)"
              value={sleepLatency}
              onChange={setSleepLatency}
              min={0}
              max={60}
              step={5}
              suffix="mins"
              placeholder="15"
            />
          </div>
        }
        results={
          sleepResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  {sleepMode === 'wake_at' ? `To wake refreshed at ${sleepTime}` : `Going to sleep at ${sleepTime}`}
                </div>
                <div className="text-sm text-indigo-100">
                  Wake at the end of a 90-minute sleep cycle to prevent grogginess and sleep inertia.
                </div>
              </div>

              <div className="space-y-2.5">
                {sleepResult.candidates.map((cand, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${cand.rating === 'optimal' ? 'bg-indigo-50/80 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-slate-900">{cand.timeStr}</span>
                        {cand.rating === 'optimal' && (
                          <span className="px-2 py-0.5 text-3xs font-black uppercase tracking-wider bg-indigo-600 text-white rounded-md">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{cand.description}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-700">{cand.totalSleepHours} hrs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Moon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select wake/sleep time to view circadian 90-minute sleep cycle windows.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: OVULATION CALCULATOR
  // =========================================================================
  if (toolSlug === 'ovulation-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="ovulation-calc"
        inputsTitle="Menstrual Cycle Parameters"
        resultsTitle="Fertility & Ovulation Windows"
        onReset={() => {
          setLmpDate('');
          setCycleLength(28);
          setLutealPhase(14);
        }}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">First Day of Last Period (LMP)</label>
              <input
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="w-full px-3 py-2 text-sm font-medium bg-white border border-slate-300 rounded-xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <NumberSliderInput
              label="Average Menstrual Cycle Length"
              value={cycleLength}
              onChange={setCycleLength}
              min={21}
              max={40}
              step={1}
              suffix="days"
              placeholder="28"
            />

            <NumberSliderInput
              label="Luteal Phase Duration"
              value={lutealPhase}
              onChange={setLutealPhase}
              min={10}
              max={16}
              step={1}
              suffix="days"
              placeholder="14"
            />
          </div>
        }
        results={
          ovResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-rose-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-rose-300 font-semibold mb-1">
                  Estimated Ovulation Day
                </div>
                <div className="text-3xl font-extrabold tracking-tight text-white mb-1">
                  {ovResult.estimatedOvulationDateStr}
                </div>
                <p className="text-sm text-rose-200">Cycle Day {ovResult.cycleDayOfOvulation}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="text-xs text-rose-700 font-bold">Fertile Window</div>
                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {ovResult.probableConceptionDatesStr}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Next Expected Period</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{ovResult.nextPeriodDateStr}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                {ovResult.assumptions.map((a, i) => (
                  <p key={i}>{a}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter the first day of your last menstrual period to calculate your fertile window.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
