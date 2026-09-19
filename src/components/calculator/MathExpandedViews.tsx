import React, { useState, useMemo } from 'react';
import {
  calculateFraction,
  calculateStatistics,
  calculateTriangle,
  calculateRatio,
  generateRandomNumbers,
} from '../../engine/math';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { Dices, Sigma, Triangle, Divide, ArrowRight, RotateCcw } from 'lucide-react';

interface MathExpandedViewsProps {
  toolSlug: string;
}

const EmptyStateCard: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
}> = ({ icon: Icon, title, subtitle }) => (
  <div className="lg:col-span-6 bg-slate-50/60 border border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[280px]">
    <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center text-slate-400 mb-3">
      <Icon className="w-6 h-6" />
    </div>
    <h4 className="text-sm font-bold text-slate-700 mb-1">{title}</h4>
    <p className="text-xs text-slate-400 max-w-xs">{subtitle}</p>
  </div>
);

export const MathExpandedViews: React.FC<MathExpandedViewsProps> = ({ toolSlug }) => {
  // ==========================================
  // STANDARD CALCULATOR INTERFACE STATE
  // ==========================================
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrev, setCalcPrev] = useState<number | null>(null);
  const [calcOp, setCalcOp] = useState<string | null>(null);
  const [calcWaiting, setCalcWaiting] = useState(false);
  const [calcMemory, setCalcMemory] = useState(0);
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const handleDigit = (digit: string) => {
    if (calcWaiting) {
      setCalcDisplay(digit);
      setCalcWaiting(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleDecimal = () => {
    if (calcWaiting) {
      setCalcDisplay('0.');
      setCalcWaiting(false);
    } else if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleOp = (op: string) => {
    const current = parseFloat(calcDisplay);
    if (calcPrev === null) {
      setCalcPrev(current);
    } else if (calcOp) {
      const res = executeOp(calcPrev, current, calcOp);
      setCalcDisplay(String(res));
      setCalcPrev(res);
      setCalcHistory((h) => [`${calcPrev} ${calcOp} ${current} = ${res}`, ...h.slice(0, 9)]);
    }
    setCalcWaiting(true);
    setCalcOp(op);
  };

  const executeOp = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      case '^': return Math.pow(a, b);
      default: return b;
    }
  };

  const handleEquals = () => {
    if (calcPrev !== null && calcOp) {
      const current = parseFloat(calcDisplay);
      const res = executeOp(calcPrev, current, calcOp);
      setCalcDisplay(String(res));
      setCalcHistory((h) => [`${calcPrev} ${calcOp} ${current} = ${res}`, ...h.slice(0, 9)]);
      setCalcPrev(null);
      setCalcOp(null);
      setCalcWaiting(true);
    }
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcPrev(null);
    setCalcOp(null);
    setCalcWaiting(false);
  };

  // Scientific Angle Mode
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg');

  const handleScientificFunc = (func: string) => {
    const val = parseFloat(calcDisplay);
    let res = val;
    const rad = angleMode === 'deg' ? (val * Math.PI) / 180 : val;

    switch (func) {
      case 'sin': res = Math.sin(rad); break;
      case 'cos': res = Math.cos(rad); break;
      case 'tan': res = Math.tan(rad); break;
      case 'asin': res = angleMode === 'deg' ? (Math.asin(val) * 180) / Math.PI : Math.asin(val); break;
      case 'acos': res = angleMode === 'deg' ? (Math.acos(val) * 180) / Math.PI : Math.acos(val); break;
      case 'atan': res = angleMode === 'deg' ? (Math.atan(val) * 180) / Math.PI : Math.atan(val); break;
      case 'log': res = Math.log10(val); break;
      case 'ln': res = Math.log(val); break;
      case 'sqrt': res = Math.sqrt(val); break;
      case 'sqr': res = val * val; break;
      case 'inv': res = val !== 0 ? 1 / val : 0; break;
      case 'pi': res = Math.PI; break;
      case 'e': res = Math.E; break;
      case 'pm': res = -val; break;
      case 'fact':
        let f = 1;
        for (let i = 2; i <= Math.min(val, 20); i++) f *= i;
        res = f;
        break;
    }
    setCalcDisplay(String(Math.round(res * 100000000) / 100000000));
    setCalcWaiting(true);
  };

  // ==========================================
  // FRACTION CALCULATOR
  // ==========================================
  const [f1Num, setF1Num] = useState<number | ''>('');
  const [f1Den, setF1Den] = useState<number | ''>('');
  const [fOp, setFOp] = useState<'+' | '-' | '×' | '÷'>('+');
  const [f2Num, setF2Num] = useState<number | ''>('');
  const [f2Den, setF2Den] = useState<number | ''>('');

  const fracResult = useMemo(() => {
    if (
      typeof f1Num !== 'number' ||
      typeof f1Den !== 'number' ||
      typeof f2Num !== 'number' ||
      typeof f2Den !== 'number' ||
      f1Den === 0 ||
      f2Den === 0
    ) {
      return null;
    }
    const opMap: Record<string, '+' | '-' | '*' | '/'> = {
      '+': '+',
      '-': '-',
      '×': '*',
      '÷': '/',
    };
    return calculateFraction({
      n1: f1Num,
      d1: f1Den,
      op: opMap[fOp] || '+',
      n2: f2Num,
      d2: f2Den,
    });
  }, [f1Num, f1Den, fOp, f2Num, f2Den]);

  const handleResetFraction = () => {
    setF1Num('');
    setF1Den('');
    setFOp('+');
    setF2Num('');
    setF2Den('');
  };

  // ==========================================
  // RANDOM NUMBER GENERATOR
  // ==========================================
  const [rngMin, setRngMin] = useState<number | ''>('');
  const [rngMax, setRngMax] = useState<number | ''>('');
  const [rngCount, setRngCount] = useState<number | ''>('');
  const [rngUnique, setRngUnique] = useState(true);
  const [rngResults, setRngResults] = useState<number[]>([]);

  const handleGenerateRNG = () => {
    const min = typeof rngMin === 'number' ? rngMin : 1;
    const max = typeof rngMax === 'number' ? rngMax : 100;
    const count = typeof rngCount === 'number' && rngCount > 0 ? rngCount : 5;
    const numbers = generateRandomNumbers(min, max, count, rngUnique);
    setRngResults(numbers);
  };

  const handleResetRNG = () => {
    setRngMin('');
    setRngMax('');
    setRngCount('');
    setRngUnique(true);
    setRngResults([]);
  };

  // ==========================================
  // TRIANGLE CALCULATOR
  // ==========================================
  const [triA, setTriA] = useState<number | ''>('');
  const [triB, setTriB] = useState<number | ''>('');
  const [triAngleC, setTriAngleC] = useState<number | ''>('');

  const triResult = useMemo(() => {
    if (
      typeof triA !== 'number' ||
      typeof triB !== 'number' ||
      typeof triAngleC !== 'number' ||
      triA <= 0 ||
      triB <= 0 ||
      triAngleC <= 0 ||
      triAngleC >= 180
    ) {
      return null;
    }
    return calculateTriangle({
      sideA: triA,
      sideB: triB,
      angleC: triAngleC,
    });
  }, [triA, triB, triAngleC]);

  const handleResetTriangle = () => {
    setTriA('');
    setTriB('');
    setTriAngleC('');
  };

  // ==========================================
  // STATISTICS & AVERAGE CALCULATOR
  // ==========================================
  const [statsInput, setStatsInput] = useState('');

  const statsData = useMemo(() => {
    if (!statsInput.trim()) return null;
    const raw = statsInput
      .split(/[\s,]+/)
      .map((s) => parseFloat(s.trim()))
      .filter((n) => !isNaN(n));
    if (raw.length === 0) return null;
    return calculateStatistics(raw);
  }, [statsInput]);

  const handleResetStats = () => {
    setStatsInput('');
  };

  // ==========================================
  // RATIO CALCULATOR
  // ==========================================
  const [ratioA, setRatioA] = useState<number | ''>('');
  const [ratioB, setRatioB] = useState<number | ''>('');
  const [ratioC, setRatioC] = useState<number | ''>('');

  const ratioResult = useMemo(() => {
    if (
      typeof ratioA !== 'number' ||
      typeof ratioB !== 'number' ||
      ratioA <= 0 ||
      ratioB <= 0
    ) {
      return null;
    }
    const cVal = typeof ratioC === 'number' && ratioC > 0 ? ratioC : undefined;
    return calculateRatio(ratioA, ratioB, cVal);
  }, [ratioA, ratioB, ratioC]);

  const handleResetRatio = () => {
    setRatioA('');
    setRatioB('');
    setRatioC('');
  };

  // 1. STANDARD CALCULATOR
  if (toolSlug === 'standard-calculator') {
    return (
      <div className="max-w-md mx-auto bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        {/* Display Screen */}
        <div className="bg-slate-950/90 rounded-2xl p-4 mb-5 border border-slate-800/80 text-right">
          <div className="h-5 text-xs text-slate-400 font-mono">
            {calcPrev !== null ? `${calcPrev} ${calcOp || ''}` : ''}
          </div>
          <div className="text-4xl font-mono font-bold tracking-tight text-white overflow-x-auto">
            {calcDisplay}
          </div>
        </div>

        {/* Memory Keys */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <button
            type="button"
            onClick={() => setCalcMemory(0)}
            className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700"
          >
            MC
          </button>
          <button
            type="button"
            onClick={() => {
              setCalcDisplay(String(calcMemory));
              setCalcWaiting(true);
            }}
            className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700"
          >
            MR
          </button>
          <button
            type="button"
            onClick={() => setCalcMemory(calcMemory + parseFloat(calcDisplay))}
            className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700"
          >
            M+
          </button>
          <button
            type="button"
            onClick={() => setCalcMemory(calcMemory - parseFloat(calcDisplay))}
            className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 text-amber-400 hover:bg-slate-700"
          >
            M-
          </button>
        </div>

        {/* Keypad Grid */}
        <div className="grid grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={handleClear}
            className="col-span-2 py-3.5 rounded-xl font-bold bg-rose-600/90 hover:bg-rose-500 text-white text-base"
          >
            Clear (C)
          </button>
          <button
            type="button"
            onClick={() => {
              const val = parseFloat(calcDisplay) / 100;
              setCalcDisplay(String(val));
            }}
            className="py-3.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 text-base"
          >
            %
          </button>
          <button
            type="button"
            onClick={() => handleOp('÷')}
            className="py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-lg"
          >
            ÷
          </button>

          {['7', '8', '9'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-700 text-white text-xl"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp('×')}
            className="py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-lg"
          >
            ×
          </button>

          {['4', '5', '6'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-700 text-white text-xl"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp('-')}
            className="py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-lg"
          >
            -
          </button>

          {['1', '2', '3'].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleDigit(d)}
              className="py-3.5 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-700 text-white text-xl"
            >
              {d}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleOp('+')}
            className="py-3.5 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white text-lg"
          >
            +
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="col-span-2 py-3.5 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-700 text-white text-xl"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDecimal}
            className="py-3.5 rounded-xl font-bold bg-slate-800/90 hover:bg-slate-700 text-white text-xl"
          >
            .
          </button>
          <button
            type="button"
            onClick={handleEquals}
            className="py-3.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-xl"
          >
            =
          </button>
        </div>

        {/* History Log */}
        {calcHistory.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
            <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Calculation Tape</span>
            <div className="space-y-0.5 max-h-24 overflow-y-auto">
              {calcHistory.map((h, i) => (
                <div key={i}>{h}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. SCIENTIFIC CALCULATOR
  if (toolSlug === 'scientific-calculator') {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="bg-slate-950/90 rounded-2xl p-4 mb-4 border border-slate-800/80 text-right">
          <div className="h-5 text-xs text-slate-400 font-mono">
            {calcPrev !== null ? `${calcPrev} ${calcOp || ''}` : ''}
          </div>
          <div className="text-4xl font-mono font-bold tracking-tight text-white overflow-x-auto">
            {calcDisplay}
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs font-bold">
            <button
              type="button"
              onClick={() => setAngleMode('deg')}
              className={`px-3 py-1 rounded-md transition-all ${
                angleMode === 'deg' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              DEG
            </button>
            <button
              type="button"
              onClick={() => setAngleMode('rad')}
              className={`px-3 py-1 rounded-md transition-all ${
                angleMode === 'rad' ? 'bg-blue-600 text-white' : 'text-slate-400'
              }`}
            >
              RAD
            </button>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
          >
            Clear (C)
          </button>
        </div>

        {/* Scientific & Arithmetic Matrix */}
        <div className="grid grid-cols-5 gap-2 text-sm font-semibold">
          <button type="button" onClick={() => handleScientificFunc('sin')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">sin</button>
          <button type="button" onClick={() => handleScientificFunc('cos')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">cos</button>
          <button type="button" onClick={() => handleScientificFunc('tan')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">tan</button>
          <button type="button" onClick={() => handleScientificFunc('pi')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 font-serif">π</button>
          <button type="button" onClick={() => handleScientificFunc('e')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 font-serif">e</button>

          <button type="button" onClick={() => handleScientificFunc('log')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">log₁₀</button>
          <button type="button" onClick={() => handleScientificFunc('ln')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">ln</button>
          <button type="button" onClick={() => handleScientificFunc('sqrt')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">√x</button>
          <button type="button" onClick={() => handleOp('^')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">x^y</button>
          <button type="button" onClick={() => handleOp('÷')} className="p-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 font-bold">÷</button>

          <button type="button" onClick={() => handleScientificFunc('fact')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">x!</button>
          <button type="button" onClick={() => handleDigit('7')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">7</button>
          <button type="button" onClick={() => handleDigit('8')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">8</button>
          <button type="button" onClick={() => handleDigit('9')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">9</button>
          <button type="button" onClick={() => handleOp('×')} className="p-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 font-bold">×</button>

          <button type="button" onClick={() => handleScientificFunc('sqr')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">x²</button>
          <button type="button" onClick={() => handleDigit('4')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">4</button>
          <button type="button" onClick={() => handleDigit('5')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">5</button>
          <button type="button" onClick={() => handleDigit('6')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">6</button>
          <button type="button" onClick={() => handleOp('-')} className="p-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 font-bold">-</button>

          <button type="button" onClick={() => handleScientificFunc('inv')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">1/x</button>
          <button type="button" onClick={() => handleDigit('1')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">1</button>
          <button type="button" onClick={() => handleDigit('2')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">2</button>
          <button type="button" onClick={() => handleDigit('3')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">3</button>
          <button type="button" onClick={() => handleOp('+')} className="p-2.5 bg-blue-600 rounded-xl hover:bg-blue-500 font-bold">+</button>

          <button type="button" onClick={() => handleScientificFunc('pm')} className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700">±</button>
          <button type="button" onClick={() => handleDigit('0')} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">0</button>
          <button type="button" onClick={handleDecimal} className="p-2.5 bg-slate-800/90 rounded-xl hover:bg-slate-700 font-bold text-base">.</button>
          <button type="button" onClick={handleEquals} className="col-span-2 p-2.5 bg-emerald-600 rounded-xl hover:bg-emerald-500 font-bold text-base">=</button>
        </div>
      </div>
    );
  }

  // 3. FRACTION CALCULATOR
  if (toolSlug === 'fraction-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Enter Fraction Numerators & Denominators</span>
            <button
              type="button"
              onClick={handleResetFraction}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* Fraction 1 */}
            <div className="flex flex-col items-center w-24">
              <input
                type="number"
                value={f1Num}
                onChange={(e) => setF1Num(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Num"
                className="w-full text-center text-xl font-bold p-2 border border-slate-200 rounded-xl"
              />
              <div className="w-full h-0.5 bg-slate-400 my-2" />
              <input
                type="number"
                value={f1Den}
                onChange={(e) => setF1Den(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Den"
                className="w-full text-center text-xl font-bold p-2 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Operation Selector */}
            <div className="flex flex-col gap-1">
              {(['+', '-', '×', '÷'] as const).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setFOp(op)}
                  className={`w-10 h-8 rounded-lg font-bold text-sm transition-all ${
                    fOp === op ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {op}
                </button>
              ))}
            </div>

            {/* Fraction 2 */}
            <div className="flex flex-col items-center w-24">
              <input
                type="number"
                value={f2Num}
                onChange={(e) => setF2Num(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Num"
                className="w-full text-center text-xl font-bold p-2 border border-slate-200 rounded-xl"
              />
              <div className="w-full h-0.5 bg-slate-400 my-2" />
              <input
                type="number"
                value={f2Den}
                onChange={(e) => setF2Den(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Den"
                className="w-full text-center text-xl font-bold p-2 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
        </div>

        {fracResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Simplified Result</span>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-3">
              {fracResult.simplifiedFraction}
            </div>
            {fracResult.mixedNumber && (
              <div className="text-xl font-bold text-slate-700 mt-2">
                Mixed: {fracResult.mixedNumber}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1">Decimal: {fracResult.decimal}</p>

            <div className="mt-8 pt-6 border-t border-slate-200 text-left">
              <span className="text-xs font-bold text-slate-700 block mb-2">Step-by-Step Solution:</span>
              <div className="space-y-1.5 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200">
                {fracResult.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Divide}
            title="Enter Fraction Values"
            subtitle="Provide numerators and non-zero denominators for both fractions to calculate arithmetic operations and view step-by-step simplification."
          />
        )}
      </div>
    );
  }

  // 4. RANDOM NUMBER GENERATOR
  if (toolSlug === 'random-number-generator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">RNG Range & Count</span>
            <button
              type="button"
              onClick={handleResetRNG}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberSliderInput
              id="rng-min"
              label="Minimum Bound"
              value={rngMin}
              onChange={setRngMin}
              min={-10000}
              max={10000}
              step={1}
              placeholder="e.g. 1"
            />
            <NumberSliderInput
              id="rng-max"
              label="Maximum Bound"
              value={rngMax}
              onChange={setRngMax}
              min={-10000}
              max={10000}
              step={1}
              placeholder="e.g. 100"
            />
          </div>
          <NumberSliderInput
            id="rng-count"
            label="Numbers to Generate"
            value={rngCount}
            onChange={setRngCount}
            min={1}
            max={50}
            step={1}
            placeholder="e.g. 5"
          />
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rng-unique"
              checked={rngUnique}
              onChange={(e) => setRngUnique(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="rng-unique" className="text-xs font-semibold text-slate-700">
              Generate Unique Numbers Only (No Duplicates / Lottery Mode)
            </label>
          </div>
          <button
            type="button"
            onClick={handleGenerateRNG}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Dices className="w-5 h-5" />
            <span>Roll & Generate</span>
          </button>
        </div>

        {rngResults.length > 0 ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Generated Random Numbers</span>
            <div className="flex flex-wrap items-center justify-center gap-3 my-6">
              {rngResults.map((num, i) => (
                <span
                  key={i}
                  className="w-14 h-14 rounded-2xl bg-white border-2 border-blue-600 text-blue-600 font-extrabold text-2xl flex items-center justify-center shadow-xs"
                >
                  {num}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Drawn from range [{rngMin === '' ? 1 : rngMin} to {rngMax === '' ? 100 : rngMax}]
            </p>
          </div>
        ) : (
          <EmptyStateCard
            icon={Dices}
            title="No Numbers Generated Yet"
            subtitle="Configure minimum and maximum bounds, set how many numbers you need, and click 'Roll & Generate'."
          />
        )}
      </div>
    );
  }

  // 5. TRIANGLE CALCULATOR
  if (toolSlug === 'triangle-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-500">Triangle Side & Angle Values</span>
            <button
              type="button"
              onClick={handleResetTriangle}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <NumberSliderInput
            id="tri-a"
            label="Side A Length"
            value={triA}
            onChange={setTriA}
            min={1}
            max={100}
            step={0.5}
            placeholder="e.g. 6"
          />
          <NumberSliderInput
            id="tri-b"
            label="Side B Length"
            value={triB}
            onChange={setTriB}
            min={1}
            max={100}
            step={0.5}
            placeholder="e.g. 8"
          />
          <NumberSliderInput
            id="tri-angle-c"
            label="Angle C Between Sides A & B (Degrees)"
            value={triAngleC}
            onChange={setTriAngleC}
            min={1}
            max={179}
            step={1}
            suffix="°"
            placeholder="e.g. 90"
          />
        </div>

        {triResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hypotenuse / Missing Side C</span>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
              {triResult.sideC}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Triangle Area</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">{triResult.area}</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Perimeter</span>
                <span className="text-xl font-bold text-slate-900 mt-1 block">{triResult.perimeter}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 text-left">
              <span className="font-bold text-slate-900 block mb-1">Angles:</span>
              <span>∠A = {triResult.angleA}°, ∠B = {triResult.angleB}°, ∠C = {triResult.angleC}°</span>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Triangle}
            title="Enter Triangle Dimensions"
            subtitle="Provide side lengths A and B along with enclosed angle C to calculate the missing side, area, perimeter, and all angles."
          />
        )}
      </div>
    );
  }

  // 6. AVERAGE & STANDARD DEVIATION CALCULATOR
  if (toolSlug === 'average-calculator' || toolSlug === 'standard-deviation-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700 block">
              Enter Numbers (separated by commas or spaces)
            </label>
            <button
              type="button"
              onClick={handleResetStats}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
          <textarea
            rows={4}
            value={statsInput}
            onChange={(e) => setStatsInput(e.target.value)}
            className="w-full text-sm font-mono p-3 rounded-xl border border-slate-200 bg-white"
            placeholder="e.g. 12, 15, 18, 20, 25"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatsInput('10, 20, 20, 40, 60')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
            >
              Preset 1
            </button>
            <button
              type="button"
              onClick={() => setStatsInput('2, 4, 4, 4, 5, 5, 7, 9')}
              className="text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700"
            >
              Preset 2
            </button>
          </div>
        </div>

        {statsData ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {toolSlug === 'average-calculator' ? 'Arithmetic Mean (Average)' : 'Sample Standard Deviation (s)'}
            </span>
            <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
              {toolSlug === 'average-calculator' ? statsData.mean : statsData.sampleSD}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-200 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Median</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{statsData.median}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Mode</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">
                  {statsData.mode.length > 0 ? statsData.mode.join(', ') : 'None'}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Range</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{statsData.range}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Population SD (σ)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{statsData.populationSD}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Variance</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{statsData.sampleVariance}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Count (N)</span>
                <span className="text-base font-bold text-slate-900 mt-0.5 block">{statsData.count}</span>
              </div>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={Sigma}
            title="Enter Data Set Values"
            subtitle="Type or paste numbers separated by commas or spaces to calculate arithmetic mean, standard deviation, median, range, and variance."
          />
        )}
      </div>
    );
  }

  // 7. RATIO CALCULATOR
  if (toolSlug === 'ratio-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-slate-700 block">Proportion: A : B = C : X</span>
              <button
                type="button"
                onClick={handleResetRatio}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">A (Width)</label>
                <input
                  type="number"
                  value={ratioA}
                  onChange={(e) => setRatioA(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1920"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">B (Height)</label>
                <input
                  type="number"
                  value={ratioB}
                  onChange={(e) => setRatioB(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1080"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">C (Target Width)</label>
                <input
                  type="number"
                  value={ratioC}
                  onChange={(e) => setRatioC(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 1280"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {ratioResult ? (
          <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-7 text-center">
            {ratioResult.solvedValue !== undefined ? (
              <>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Solved Value (X)</span>
                <div className="text-5xl font-extrabold text-blue-600 tracking-tight mt-2">
                  {ratioResult.solvedValue}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Scales {ratioA}:{ratioB} proportionally to width {ratioC}
                </p>
              </>
            ) : (
              <div className="text-lg font-bold text-slate-700 mb-2">Simplified Ratio Calculated</div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200 bg-white p-4 rounded-xl border text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Simplified Ratio</span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
                {ratioResult.simplifiedA} : {ratioResult.simplifiedB}
              </span>
              <span className="text-xs text-slate-500 mt-1 block">Decimal Value: {ratioResult.decimalValue}</span>
            </div>
          </div>
        ) : (
          <EmptyStateCard
            icon={ArrowRight}
            title="Enter Ratio Dimensions"
            subtitle="Specify width A and height B to obtain the reduced simplified ratio, plus target C to solve for missing scale dimension X."
          />
        )}
      </div>
    );
  }

  return null;
};
