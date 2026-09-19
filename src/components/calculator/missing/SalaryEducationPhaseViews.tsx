import React, { useState, useMemo } from 'react';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { NumberSliderInput } from '../../common/NumberSliderInput';
import { TrendingUp, GraduationCap, RefreshCw, DollarSign, Plus, Trash2 } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import {
  calculatePayRaise,
  calculateWeightedGrade,
  calculateStudentLoanRefinance,
  calculateStudentLoanRepayment,
  GradeItem,
} from '../../../engine/salaryEducationPhaseEngines';

export const SALARY_EDUCATION_PHASE_SLUGS = [
  'pay-raise-calculator',
  'weighted-grade-calculator',
  'student-loan-refinance-calculator',
  'student-loan-repayment-calculator',
];

interface Props {
  toolSlug: string;
}

export const SalaryEducationPhaseViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Pay Raise
  const [prSalary, setPrSalary] = useState<number | ''>('');
  const [prRaiseType, setPrRaiseType] = useState<'percent' | 'flat'>('percent');
  const [prRaiseVal, setPrRaiseVal] = useState<number | ''>('');
  const prResult = useMemo(
    () => calculatePayRaise(prSalary, 'annual', prRaiseType, prRaiseVal),
    [prSalary, prRaiseType, prRaiseVal]
  );

  // 2. Weighted Grade
  const [grItems, setGrItems] = useState<GradeItem[]>([
    { id: '1', name: 'Assignments / Homework', score: '', maxScore: 100, weight: 20 },
    { id: '2', name: 'Midterm Exam', score: '', maxScore: 100, weight: 30 },
    { id: '3', name: 'Final Exam', score: '', maxScore: 100, weight: 50 },
  ]);
  const grResult = useMemo(() => calculateWeightedGrade(grItems), [grItems]);

  // 3. Student Loan Refinance
  const [slrBal, setSlrBal] = useState<number | ''>('');
  const [slrCurRate, setSlrCurRate] = useState<number | ''>(6.8);
  const [slrCurTerm, setSlrCurTerm] = useState<number | ''>(10);
  const [slrNewRate, setSlrNewRate] = useState<number | ''>(4.5);
  const [slrNewTerm, setSlrNewTerm] = useState<number | ''>(10);
  const slrResult = useMemo(
    () => calculateStudentLoanRefinance(slrBal, slrCurRate, slrCurTerm, slrNewRate, slrNewTerm),
    [slrBal, slrCurRate, slrCurTerm, slrNewRate, slrNewTerm]
  );

  // 4. Student Loan Repayment
  const [slpBal, setSlpBal] = useState<number | ''>('');
  const [slpRate, setSlpRate] = useState<number | ''>(6.5);
  const [slpYears, setSlpYears] = useState<number | ''>(10);
  const [slpExtra, setSlpExtra] = useState<number | ''>(0);
  const slpResult = useMemo(
    () => calculateStudentLoanRepayment(slpBal, slpRate, slpYears, slpExtra),
    [slpBal, slpRate, slpYears, slpExtra]
  );

  // =========================================================================
  // VIEW 1: PAY RAISE CALCULATOR
  // =========================================================================
  if (toolSlug === 'pay-raise-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="pay-raise-calc"
        inputsTitle="Current Salary & Raise Amount"
        resultsTitle="New Compensation & Pay Increase"
        onReset={() => {
          setPrSalary('');
          setPrRaiseVal('');
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Current Annual Gross Base Salary"
              value={prSalary}
              onChange={setPrSalary}
              min={10000}
              max={500000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 75000"
            />
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPrRaiseType('percent')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${prRaiseType === 'percent' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                Percentage Increase (%)
              </button>
              <button
                type="button"
                onClick={() => setPrRaiseType('flat')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-colors ${prRaiseType === 'flat' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
              >
                Flat Amount ({currencySymbol})
              </button>
            </div>
            <NumberSliderInput
              label={prRaiseType === 'percent' ? 'Raise Percentage (%)' : `Flat Raise Amount (${currencySymbol})`}
              value={prRaiseVal}
              onChange={setPrRaiseVal}
              min={prRaiseType === 'percent' ? 0.5 : 500}
              max={prRaiseType === 'percent' ? 50 : 50000}
              step={prRaiseType === 'percent' ? 0.5 : 500}
              suffix={prRaiseType === 'percent' ? '%' : undefined}
              prefix={prRaiseType === 'flat' ? currencySymbol : undefined}
              placeholder={prRaiseType === 'percent' ? 'e.g. 5' : 'e.g. 5000'}
            />
          </div>
        }
        results={
          prResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-1">
                  New Annual Salary (+{prResult.effectivePercentage}%)
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(prResult.newAnnualSalary)}
                </div>
                <p className="text-sm text-emerald-200">
                  Total annual increase: +{formatMoney(prResult.annualRaiseAmount)} / year.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Monthly Boost</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">+{formatMoney(prResult.monthlyRaiseAmount)}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Bi-Weekly Boost</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">+{formatMoney(prResult.biWeeklyRaiseAmount)}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <div className="text-xs text-slate-500">Hourly Increase</div>
                  <div className="text-base font-bold text-emerald-600 mt-0.5">+{formatMoney(prResult.hourlyRaiseAmount)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter current base salary and raise percentage/amount to see updated pay schedule.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: WEIGHTED GRADE
  // =========================================================================
  if (toolSlug === 'weighted-grade-calculator') {
    const handleAddRow = () => {
      setGrItems((prev) => [...prev, { id: Date.now().toString(), name: `Assessment ${prev.length + 1}`, score: '', maxScore: 100, weight: 10 }]);
    };
    const handleRemoveRow = (id: string) => {
      if (grItems.length > 1) {
        setGrItems((prev) => prev.filter((it) => it.id !== id));
      }
    };
    const handleUpdateRow = (id: string, field: keyof GradeItem, val: any) => {
      setGrItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: val } : it)));
    };

    return (
      <CompactCalculatorWorkspace
        id="weighted-grade-calc"
        inputsTitle="Course Assessments & Syllabus Weights"
        resultsTitle="Overall Grade & Performance"
        onReset={() => {
          setGrItems([
            { id: '1', name: 'Assignments / Homework', score: '', maxScore: 100, weight: 20 },
            { id: '2', name: 'Midterm Exam', score: '', maxScore: 100, weight: 30 },
            { id: '3', name: 'Final Exam', score: '', maxScore: 100, weight: 50 },
          ]);
        }}
        inputs={
          <div className="space-y-3">
            <div className="space-y-2">
              {grItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateRow(item.id, 'name', e.target.value)}
                    className="w-32 px-2 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-indigo-500"
                    placeholder="Assessment"
                  />
                  <div className="flex-1">
                    <input
                      type="number"
                      value={item.score}
                      onChange={(e) => handleUpdateRow(item.id, 'score', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Score"
                    />
                  </div>
                  <div className="w-16">
                    <input
                      type="number"
                      value={item.weight}
                      onChange={(e) => handleUpdateRow(item.id, 'weight', e.target.value === '' ? '' : parseFloat(e.target.value))}
                      className="w-full px-2 py-1 text-xs font-medium bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Weight %"
                    />
                  </div>
                  {grItems.length > 1 && (
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
              <span>Add Assessment</span>
            </button>
          </div>
        }
        results={
          grResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Overall Weighted Grade
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {grResult.weightedGradeScore}% <span className="text-2xl font-bold text-amber-400">({grResult.letterGrade})</span>
                </div>
                <p className="text-sm text-indigo-200">
                  Calculated from {grResult.gradedWeightTotal}% of syllabus weight entered.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Earned Weighted Points</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{grResult.earnedWeightedScore} / {grResult.gradedWeightTotal}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">Remaining Weight</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{grResult.remainingWeight}%</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter assignment scores and syllabus weight percentages to calculate your cumulative grade.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: STUDENT LOAN REFINANCE
  // =========================================================================
  if (toolSlug === 'student-loan-refinance-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="student-loan-refinance-calc"
        inputsTitle="Current vs Refinanced Loan Terms"
        resultsTitle="Refinancing Interest Savings"
        onReset={() => {
          setSlrBal('');
          setSlrCurRate(6.8);
          setSlrNewRate(4.5);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Student Loan Balance"
              value={slrBal}
              onChange={setSlrBal}
              min={2000}
              max={300000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 45000"
            />
            <div className="grid grid-cols-2 gap-3">
              <NumberSliderInput
                label="Current APR (%)"
                value={slrCurRate}
                onChange={setSlrCurRate}
                min={2}
                max={18}
                step={0.1}
                suffix="%"
                placeholder="6.8"
              />
              <NumberSliderInput
                label="New Refinance APR (%)"
                value={slrNewRate}
                onChange={setSlrNewRate}
                min={2}
                max={18}
                step={0.1}
                suffix="%"
                placeholder="4.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumberSliderInput
                label="Current Term (Years)"
                value={slrCurTerm}
                onChange={setSlrCurTerm}
                min={3}
                max={25}
                step={1}
                placeholder="10"
              />
              <NumberSliderInput
                label="New Term (Years)"
                value={slrNewTerm}
                onChange={setSlrNewTerm}
                min={3}
                max={25}
                step={1}
                placeholder="10"
              />
            </div>
          </div>
        }
        results={
          slrResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Lifetime Refinancing Savings
                </div>
                <div className={`text-4xl font-extrabold tracking-tight mb-2 ${slrResult.lifetimeSavings >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatMoney(slrResult.lifetimeSavings)}
                </div>
                <p className="text-sm text-indigo-200">
                  Monthly payment changes by {formatMoney(slrResult.monthlyDifference)} / month.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">New Monthly Payment</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(slrResult.newMonthlyPayment)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">was {formatMoney(slrResult.currentMonthlyPayment)}</div>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-xs text-slate-500 font-medium">New Total Interest</div>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(slrResult.newTotalInterest)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">was {formatMoney(slrResult.currentTotalInterest)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <RefreshCw className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter current vs offer refinance rate and loan term to compare monthly and total interest savings.</p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 4: STUDENT LOAN REPAYMENT
  // =========================================================================
  if (toolSlug === 'student-loan-repayment-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="student-loan-repayment-calc"
        inputsTitle="Loan Terms & Prepayments"
        resultsTitle="Repayment Plan & Early Payoff"
        onReset={() => {
          setSlpBal('');
          setSlpRate(6.5);
          setSlpYears(10);
          setSlpExtra(0);
        }}
        inputs={
          <div className="space-y-4">
            <NumberSliderInput
              label="Student Loan Balance"
              value={slpBal}
              onChange={setSlpBal}
              min={1000}
              max={300000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 35000"
            />
            <NumberSliderInput
              label="Annual Interest Rate (APR %)"
              value={slpRate}
              onChange={setSlpRate}
              min={1}
              max={18}
              step={0.125}
              suffix="%"
              placeholder="6.5"
            />
            <NumberSliderInput
              label="Standard Repayment Term (Years)"
              value={slpYears}
              onChange={setSlpYears}
              min={3}
              max={30}
              step={1}
              suffix="Years"
              placeholder="10"
            />
            <NumberSliderInput
              label="Extra Monthly Principal Prepayment"
              value={slpExtra}
              onChange={setSlpExtra}
              min={0}
              max={2000}
              step={25}
              prefix={currencySymbol}
              placeholder="0"
            />
          </div>
        }
        results={
          slpResult ? (
            <div className="space-y-5">
              <div className="p-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-sm">
                <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold mb-1">
                  Monthly Payment
                </div>
                <div className="text-4xl font-extrabold tracking-tight text-white mb-2">
                  {formatMoney(slpResult.monthlyPayment)} <span className="text-xl font-normal text-indigo-300">/ month</span>
                </div>
                <p className="text-sm text-indigo-200">
                  Total lifetime repayment: {formatMoney(slpResult.totalPayments)} ({formatMoney(slpResult.totalInterest)} interest).
                </p>
              </div>

              {slpResult.earlyPayoff && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950">
                  <span className="font-bold">Accelerated Payoff Benefit:</span> Paying {formatMoney(slpResult.earlyPayoff.extraMonthlyPayment)}/mo extra pays off your loan in {slpResult.earlyPayoff.payoffYears} years ({slpResult.earlyPayoff.monthsSaved} months early) and saves {formatMoney(slpResult.earlyPayoff.interestSaved)} in interest!
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <GraduationCap className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Enter student loan balance and interest rate to see standard amortization and prepayment impact.</p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
