import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { Plus, Trash2, Binary, Calculator, Percent } from 'lucide-react';
import {
  calculatePercentageChange,
  calculatePercentOfNumber,
  calculateWeightedAverage,
  calculatePermutation,
  calculateLcm,
  calculateFactorial,
  calculateQuadratic,
  WeightedItem,
} from '../../../engine/mathPhaseEngines';

export const MATH_PHASE_SLUGS = [
  'percentage-increase-decrease-calculator',
  'percent-of-number-calculator',
  'weighted-average-calculator',
  'permutation-calculator',
  'lcm-calculator',
  'factorial-calculator',
  'quadratic-equation-calculator',
];

interface Props {
  toolSlug: string;
}

export const MathPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  // 1. Percentage Change
  const [pcOriginal, setPcOriginal] = useState<number | ''>('');
  const [pcNew, setPcNew] = useState<number | ''>('');
  const pcResult = useMemo(() => calculatePercentageChange(pcOriginal, pcNew), [pcOriginal, pcNew]);

  // 2. Percent of Number
  const [ponPct, setPonPct] = useState<number | ''>('');
  const [ponBase, setPonBase] = useState<number | ''>('');
  const ponResult = useMemo(() => calculatePercentOfNumber(ponPct, ponBase), [ponPct, ponBase]);

  // 3. Weighted Average
  const [waItems, setWaItems] = useState<WeightedItem[]>([
    { id: '1', value: '', weight: '', label: 'Item 1' },
    { id: '2', value: '', weight: '', label: 'Item 2' },
    { id: '3', value: '', weight: '', label: 'Item 3' },
  ]);
  const waResult = useMemo(() => calculateWeightedAverage(waItems), [waItems]);

  // 4. Permutation (nPr)
  const [permN, setPermN] = useState<number | ''>('');
  const [permR, setPermR] = useState<number | ''>('');
  const permResult = useMemo(() => calculatePermutation(permN, permR), [permN, permR]);

  // 5. LCM
  const [lcmA, setLcmA] = useState<number | ''>('');
  const [lcmB, setLcmB] = useState<number | ''>('');
  const lcmResult = useMemo(() => calculateLcm(lcmA, lcmB), [lcmA, lcmB]);

  // 6. Factorial
  const [factN, setFactN] = useState<number | ''>('');
  const factResult = useMemo(() => calculateFactorial(factN), [factN]);

  // 7. Quadratic Equation
  const [quadA, setQuadA] = useState<number | ''>('');
  const [quadB, setQuadB] = useState<number | ''>('');
  const [quadC, setQuadC] = useState<number | ''>('');
  const quadResult = useMemo(() => calculateQuadratic(quadA, quadB, quadC), [quadA, quadB, quadC]);

  // =========================================================================
  // VIEW 1: PERCENTAGE INCREASE / DECREASE
  // =========================================================================
  if (toolSlug === 'percentage-increase-decrease-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="pct-inc-dec-calc"
        inputsTitle="Enter Numerical Values"
        resultsTitle="Percentage Change Breakdown"
        onReset={() => {
          setPcOriginal('');
          setPcNew('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Original Value (Starting Number)"
              value={pcOriginal}
              onChange={setPcOriginal}
              min={-1000000}
              max={1000000}
              step={1}
              placeholder="e.g. 100"
            />
            <NumberSliderInput
              label="New Value (Final Number)"
              value={pcNew}
              onChange={setPcNew}
              min={-1000000}
              max={1000000}
              step={1}
              placeholder="e.g. 150"
            />
          </div>
        }
        results={
          pcResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">Percentage Change</div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {pcResult.formattedPercentage}
                </div>
                <p className="text-sm text-indigo-200">{pcResult.summary}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Absolute Difference</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {pcResult.absoluteChange >= 0 ? `+${pcResult.absoluteChange}` : pcResult.absoluteChange}
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Growth Multiplier</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">
                    {pcResult.multiplier}×
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 space-y-1">
                <div className="font-bold text-indigo-900">Standard Formula:</div>
                <div className="font-mono bg-white px-2 py-1 rounded border border-indigo-200 inline-block">
                  Percentage Change = ((New - Original) / |Original|) × 100
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Percent className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter starting and new values to calculate exact percentage change.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: PERCENT OF NUMBER
  // =========================================================================
  if (toolSlug === 'percent-of-number-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="percent-of-number-calc"
        inputsTitle="Percentage & Number"
        resultsTitle="Calculated Portion"
        onReset={() => {
          setPonPct('');
          setPonBase('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Percentage (%)"
              value={ponPct}
              onChange={setPonPct}
              min={0}
              max={1000}
              step={0.1}
              suffix="%"
              placeholder="e.g. 25"
            />
            <NumberSliderInput
              label="Total Number / Base Value"
              value={ponBase}
              onChange={setPonBase}
              min={0}
              max={10000000}
              step={1}
              placeholder="e.g. 400"
            />
          </div>
        }
        results={
          ponResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  {ponResult.percentage}% of {ponResult.baseNumber}
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {ponResult.result.toLocaleString()}
                </div>
                <p className="text-sm text-indigo-200">
                  Equivalent to multiplying {ponResult.baseNumber} by decimal {ponResult.decimalEquivalent}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Decimal Equivalent</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{ponResult.decimalEquivalent}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Remainder from Total</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{ponResult.remainderFromTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Calculator className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter percentage and number to compute exact fraction and decimal value.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: WEIGHTED AVERAGE
  // =========================================================================
  if (toolSlug === 'weighted-average-calculator') {
    const handleAddRow = () => {
      setWaItems((prev) => [...prev, { id: Date.now().toString(), value: '', weight: '', label: `Item ${prev.length + 1}` }]);
    };
    const handleRemoveRow = (id: string) => {
      if (waItems.length > 1) {
        setWaItems((prev) => prev.filter((it) => it.id !== id));
      }
    };
    const handleUpdateRow = (id: string, field: 'value' | 'weight' | 'label', val: any) => {
      setWaItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));
    };

    return (
      <CompactCalculatorWorkspace
        id="weighted-avg-calc"
        inputsTitle="Data Entries & Weights"
        resultsTitle="Weighted Mean Analysis"
        onReset={() => {
          setWaItems([
            { id: '1', value: '', weight: '', label: 'Item 1' },
            { id: '2', value: '', weight: '', label: 'Item 2' },
            { id: '3', value: '', weight: '', label: 'Item 3' },
          ]);
        }}
        inputs={
          <div className="space-y-3">
            <div className="space-y-2.5">
              {waItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleUpdateRow(item.id, 'label', e.target.value)}
                    className="w-24 px-2 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    placeholder="Label"
                  />
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) => handleUpdateRow(item.id, 'value', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      placeholder="Value (x)"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleUpdateRow(item.id, 'weight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      placeholder="Weight (w)"
                    />
                  </div>
                  {waItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Data Row</span>
            </button>
          </div>
        }
        results={
          waResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Weighted Average (x̄_w)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {waResult.weightedAverage.toLocaleString()}
                </div>
                <p className="text-sm text-indigo-200">
                  Sum of products Σ(w·x) = {waResult.sumProduct.toLocaleString()} across total weight Σw = {waResult.totalWeight}.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Value</th>
                      <th className="px-3 py-2">Weight</th>
                      <th className="px-3 py-2">Relative Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {waResult.rows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-medium text-slate-800">{r.label}</td>
                        <td className="px-3 py-2 text-slate-600">{r.value}</td>
                        <td className="px-3 py-2 text-slate-600">{r.weight}</td>
                        <td className="px-3 py-2 font-semibold text-indigo-600">{r.percentWeight}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm">Enter numerical values and weights above to compute the exact weighted mean.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 4: PERMUTATION (nPr)
  // =========================================================================
  if (toolSlug === 'permutation-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="permutation-calc"
        inputsTitle="Set Size & Subset Selection"
        resultsTitle="Permutation Result (nPr)"
        onReset={() => {
          setPermN('');
          setPermR('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Total Items in Set (n)"
              value={permN}
              onChange={setPermN}
              min={0}
              max={100}
              step={1}
              placeholder="e.g. 10"
            />
            <NumberSliderInput
              label="Items Chosen / Ordered (r)"
              value={permR}
              onChange={setPermR}
              min={0}
              max={100}
              step={1}
              placeholder="e.g. 3"
            />
          </div>
        }
        results={
          permResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  P({permResult.n}, {permResult.r})
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 break-all">
                  {permResult.nPr}
                </div>
                <p className="text-sm text-indigo-200">
                  Total ordered arrangements of choosing {permResult.r} items from {permResult.n} distinct objects where order matters.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-slate-800 mb-1">Step-by-Step Derivation:</div>
                {permResult.formulaSteps.map((step, idx) => (
                  <div key={idx} className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm">Enter non-negative integers n and r (where r ≤ n) to compute nPr.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 5: LCM CALCULATOR
  // =========================================================================
  if (toolSlug === 'lcm-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="lcm-calc"
        inputsTitle="Integer Inputs"
        resultsTitle="Least Common Multiple"
        onReset={() => {
          setLcmA('');
          setLcmB('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="First Integer (A)"
              value={lcmA}
              onChange={setLcmA}
              min={1}
              max={1000000}
              step={1}
              placeholder="e.g. 12"
            />
            <NumberSliderInput
              label="Second Integer (B)"
              value={lcmB}
              onChange={setLcmB}
              min={1}
              max={1000000}
              step={1}
              placeholder="e.g. 18"
            />
          </div>
        }
        results={
          lcmResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  LCM({lcmResult.a}, {lcmResult.b})
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {lcmResult.lcm.toLocaleString()}
                </div>
                <p className="text-sm text-indigo-200">
                  Smallest positive integer divisible by both {lcmResult.a} and {lcmResult.b}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">GCD (Greatest Divisor)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{lcmResult.gcd}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Product (A × B)</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{lcmResult.product.toLocaleString()}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-slate-800 mb-1">Derivation:</div>
                {lcmResult.formulaSteps.map((step, idx) => (
                  <div key={idx} className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm">Enter two integers to compute their Least Common Multiple (LCM).</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 6: FACTORIAL (n!)
  // =========================================================================
  if (toolSlug === 'factorial-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="factorial-calc"
        inputsTitle="Integer n"
        resultsTitle="Factorial Value (n!)"
        onReset={() => setFactN('')}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Integer (n)"
              value={factN}
              onChange={setFactN}
              min={0}
              max={150}
              step={1}
              placeholder="e.g. 10"
            />
          </div>
        }
        results={
          factResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  {factResult.n}!
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 break-all">
                  {factResult.exactValue.length > 30 ? factResult.scientificNotation : factResult.exactValue}
                </div>
                {factResult.exactValue.length > 30 && (
                  <p className="text-xs text-indigo-200 font-mono break-all max-h-24 overflow-y-auto mt-2">
                    Exact: {factResult.exactValue}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Trailing Zeros</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{factResult.trailingZeros}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Total Digits</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{factResult.digitCount}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Binary className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter a non-negative integer n to compute exact factorial n!.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 7: QUADRATIC EQUATION
  // =========================================================================
  if (toolSlug === 'quadratic-equation-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="quadratic-calc"
        inputsTitle="Coefficients (ax² + bx + c = 0)"
        resultsTitle="Roots & Parabola Geometry"
        onReset={() => {
          setQuadA('');
          setQuadB('');
          setQuadC('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Coefficient a (x²)"
              value={quadA}
              onChange={setQuadA}
              min={-100}
              max={100}
              step={0.5}
              placeholder="e.g. 1"
            />
            <NumberSliderInput
              label="Coefficient b (x)"
              value={quadB}
              onChange={setQuadB}
              min={-100}
              max={100}
              step={0.5}
              placeholder="e.g. -5"
            />
            <NumberSliderInput
              label="Constant c"
              value={quadC}
              onChange={setQuadC}
              min={-100}
              max={100}
              step={0.5}
              placeholder="e.g. 6"
            />
          </div>
        }
        results={
          quadResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Roots ({quadResult.rootType === 'two_real' ? '2 Real Roots' : quadResult.rootType === 'one_real' ? '1 Repeated Root' : '2 Complex Roots'})
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                  x₁ = {quadResult.root1}
                  {quadResult.rootType !== 'one_real' && `,  x₂ = ${quadResult.root2}`}
                </div>
                <p className="text-sm text-indigo-200">
                  Discriminant D = {quadResult.discriminant} ({quadResult.discriminant > 0 ? 'D > 0' : quadResult.discriminant === 0 ? 'D = 0' : 'D < 0'}).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Parabola Vertex (h, k)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    ({quadResult.vertexX}, {quadResult.vertexY})
                  </div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Axis of Symmetry</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">x = {quadResult.axisOfSymmetry}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="font-semibold text-slate-800 mb-1">Algebraic Solution Steps:</div>
                {quadResult.formulaSteps.map((step, idx) => (
                  <div key={idx} className="font-mono text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-sm">Enter coefficients a, b, and c (with a ≠ 0) to solve the quadratic equation.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
