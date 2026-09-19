import React, { useMemo } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useSessionState } from '../../../utils/useSessionState';
import { CompactCalculatorWorkspace } from '../CompactCalculatorWorkspace';
import { UnitNumberInput } from '../../common/UnitNumberInput';
import { CurrencyInput } from '../../common/CurrencyInput';
import {
  calculateEmployeeCost,
  calculateProjectProfitability,
  calculateHourlyToSalary,
  calculateSalaryToHourly,
  calculateBonusCommission,
  calculateTotalCompensation,
  calculateRequiredSalary,
  calculateGPAToPercentage,
} from '../../../engine/masterExpansionEngines';

interface Props {
  toolSlug: string;
}

export const SALARY_EDUCATION_SLUGS = [
  'employee-cost-calculator',
  'project-profitability-calculator',
  'hourly-to-salary-calculator',
  'salary-to-hourly-calculator',
  'bonus-commission-calculator',
  'total-compensation-calculator',
  'required-salary-calculator',
  'gpa-to-percentage-calculator',
];

export const SalaryAndEducationViews: React.FC<Props> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Employee Cost
  const [ecBase, setEcBase] = useSessionState<number | ''>('ec_base', 75000);
  const [ecTax, setEcTax] = useSessionState<number | ''>('ec_tax', 7.65);
  const [ecHealth, setEcHealth] = useSessionState<number | ''>('ec_health', 7000);
  const [ecMatch, setEcMatch] = useSessionState<number | ''>('ec_match', 3000);
  const [ecBonus, setEcBonus] = useSessionState<number | ''>('ec_bonus', 5000);
  const [ecOver, setEcOver] = useSessionState<number | ''>('ec_over', 4000);

  const employeeCostResult = useMemo(() => {
    if (typeof ecBase !== 'number') return null;
    return calculateEmployeeCost({
      baseSalary: ecBase,
      payrollTaxesPercent: typeof ecTax === 'number' ? ecTax : 0,
      healthInsuranceAnnual: typeof ecHealth === 'number' ? ecHealth : 0,
      retirementMatchAnnual: typeof ecMatch === 'number' ? ecMatch : 0,
      annualBonus: typeof ecBonus === 'number' ? ecBonus : 0,
      equipmentAndOverheadAnnual: typeof ecOver === 'number' ? ecOver : 0,
    });
  }, [ecBase, ecTax, ecHealth, ecMatch, ecBonus, ecOver]);

  // 2. Project Profitability
  const [ppRev, setPpRev] = useSessionState<number | ''>('pp_rev', 50000);
  const [ppLabor, setPpLabor] = useSessionState<number | ''>('pp_labor', 22000);
  const [ppMat, setPpMat] = useSessionState<number | ''>('pp_mat', 8000);
  const [ppOver, setPpOver] = useSessionState<number | ''>('pp_over', 5000);

  const projectProfResult = useMemo(() => {
    if (typeof ppRev !== 'number' || typeof ppLabor !== 'number') return null;
    return calculateProjectProfitability({
      contractRevenue: ppRev,
      laborCost: ppLabor,
      materialsCost: typeof ppMat === 'number' ? ppMat : 0,
      overheadCost: typeof ppOver === 'number' ? ppOver : 0,
    });
  }, [ppRev, ppLabor, ppMat, ppOver]);

  // 3. Hourly to Salary
  const [hsWage, setHsWage] = useSessionState<number | ''>('hs_wage', 35);
  const [hsHrs, setHsHrs] = useSessionState<number | ''>('hs_hrs', 40);
  const [hsWks, setHsWks] = useSessionState<number | ''>('hs_wks', 52);

  const hourlyToSalaryResult = useMemo(() => {
    if (typeof hsWage !== 'number') return null;
    return calculateHourlyToSalary(
      hsWage,
      typeof hsHrs === 'number' ? hsHrs : 40,
      typeof hsWks === 'number' ? hsWks : 52
    );
  }, [hsWage, hsHrs, hsWks]);

  // 4. Salary to Hourly
  const [shSal, setShSal] = useSessionState<number | ''>('sh_sal', 80000);
  const [shHrs, setShHrs] = useSessionState<number | ''>('sh_hrs', 40);
  const [shWks, setShWks] = useSessionState<number | ''>('sh_wks', 52);

  const salaryToHourlyResult = useMemo(() => {
    if (typeof shSal !== 'number') return null;
    return calculateSalaryToHourly(
      shSal,
      typeof shHrs === 'number' ? shHrs : 40,
      typeof shWks === 'number' ? shWks : 52
    );
  }, [shSal, shHrs, shWks]);

  // 5. Bonus & Commission
  const [bcBase, setBcBase] = useSessionState<number | ''>('bc_base', 65000);
  const [bcBonus, setBcBonus] = useSessionState<number | ''>('bc_bonus', 10);
  const [bcComm, setBcComm] = useSessionState<number | ''>('bc_comm', 5);
  const [bcSales, setBcSales] = useSessionState<number | ''>('bc_sales', 200000);

  const bonusCommResult = useMemo(() => {
    if (typeof bcBase !== 'number') return null;
    return calculateBonusCommission(
      bcBase,
      typeof bcBonus === 'number' ? bcBonus : 0,
      true,
      typeof bcComm === 'number' ? bcComm : 0,
      typeof bcSales === 'number' ? bcSales : 0
    );
  }, [bcBase, bcBonus, bcComm, bcSales]);

  // 6. Total Compensation
  const [tcBase, setTcBase] = useSessionState<number | ''>('tc_base', 120000);
  const [tcBonus, setTcBonus] = useSessionState<number | ''>('tc_bonus', 15000);
  const [tcEquity, setTcEquity] = useSessionState<number | ''>('tc_equity', 30000);
  const [tcRetire, setTcRetire] = useSessionState<number | ''>('tc_retire', 6000);
  const [tcHealth, setTcHealth] = useSessionState<number | ''>('tc_health', 8000);

  const totalCompResult = useMemo(() => {
    if (typeof tcBase !== 'number') return null;
    return calculateTotalCompensation(
      tcBase,
      typeof tcBonus === 'number' ? tcBonus : 0,
      0,
      typeof tcRetire === 'number' ? tcRetire : 0,
      typeof tcHealth === 'number' ? tcHealth : 0,
      typeof tcEquity === 'number' ? tcEquity : 0,
      0
    );
  }, [tcBase, tcBonus, tcEquity, tcRetire, tcHealth]);

  // 7. Required Salary
  const [rsTakeHome, setRsTakeHome] = useSessionState<number | ''>('rs_takehome', 5000);
  const [rsTaxPct, setRsTaxPct] = useSessionState<number | ''>('rs_tax_pct', 25);

  const requiredSalaryResult = useMemo(() => {
    if (typeof rsTakeHome !== 'number') return null;
    return calculateRequiredSalary(rsTakeHome, typeof rsTaxPct === 'number' ? rsTaxPct : 25);
  }, [rsTakeHome, rsTaxPct]);

  // 8. GPA to Percentage
  const [gpaVal, setGpaVal] = useSessionState<number | ''>('gpa_val', 3.6);
  const [gpaScale, setGpaScale] = useSessionState<4.0 | 10.0>('gpa_scale', 4.0);

  const gpaResult = useMemo(() => {
    if (typeof gpaVal !== 'number') return null;
    return calculateGPAToPercentage(gpaVal, gpaScale);
  }, [gpaVal, gpaScale]);

  // RENDERING
  if (toolSlug === 'employee-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Total Employee Cost Calculator"
        onReset={() => {
          setEcBase(75000);
          setEcTax(7.65);
          setEcHealth(7000);
          setEcMatch(3000);
          setEcBonus(5000);
          setEcOver(4000);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="ec-base"
              label="Base Annual Salary"
              value={ecBase}
              onChange={setEcBase}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="ec-tax"
                label="Payroll Taxes"
                value={ecTax}
                onChange={setEcTax}
                suffix="%"
                step={0.01}
                min={0}
                max={50}
              />
              <CurrencyInput
                id="ec-health"
                label="Healthcare Benefits"
                value={ecHealth}
                onChange={setEcHealth}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <CurrencyInput
                id="ec-match"
                label="Retirement Match"
                value={ecMatch}
                onChange={setEcMatch}
                min={0}
              />
              <CurrencyInput
                id="ec-bonus"
                label="Annual Bonus"
                value={ecBonus}
                onChange={setEcBonus}
                min={0}
              />
              <CurrencyInput
                id="ec-over"
                label="Equipment / Overhead"
                value={ecOver}
                onChange={setEcOver}
                min={0}
              />
            </div>
          </div>
        }
        results={
          employeeCostResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Total Burdened Cost</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(employeeCostResult.totalAnnualCost)} / yr</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">+{employeeCostResult.overheadMarkupPercent}% above base salary</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Effective Hourly Cost (2,080 hrs)</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{currencySymbol}{employeeCostResult.costPerHour} / hr</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'project-profitability-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Project Profitability & Job Costing Calculator"
        onReset={() => {
          setPpRev(50000);
          setPpLabor(22000);
          setPpMat(8000);
          setPpOver(5000);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="pp-rev"
              label="Contract / Project Revenue"
              value={ppRev}
              onChange={setPpRev}
              min={0}
            />
            <CurrencyInput
              id="pp-labor"
              label="Labor Cost"
              value={ppLabor}
              onChange={setPpLabor}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="pp-mat"
                label="Materials / Direct Cost"
                value={ppMat}
                onChange={setPpMat}
                min={0}
              />
              <CurrencyInput
                id="pp-over"
                label="Overhead Allocated"
                value={ppOver}
                onChange={setPpOver}
                min={0}
              />
            </div>
          </div>
        }
        results={
          projectProfResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Project Net Profit</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(projectProfResult.netProfit)}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{projectProfResult.profitMarginPercent}% Net Profit Margin</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Return on Project Cost (ROI)</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{projectProfResult.roiPercent}%</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'hourly-to-salary-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Hourly Wage to Annual Salary Calculator"
        onReset={() => {
          setHsWage(35);
          setHsHrs(40);
          setHsWks(52);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="hs-wage"
              label="Hourly Wage Rate"
              value={hsWage}
              onChange={setHsWage}
              step={0.25}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="hs-hrs"
                label="Hours per Week"
                value={hsHrs}
                onChange={setHsHrs}
                suffix="hrs/wk"
                min={1}
                max={168}
              />
              <UnitNumberInput
                id="hs-wks"
                label="Weeks per Year"
                value={hsWks}
                onChange={setHsWks}
                suffix="wks/yr"
                min={1}
                max={52}
              />
            </div>
          </div>
        }
        results={
          hourlyToSalaryResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Annual Equivalent Salary</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(hourlyToSalaryResult.annualSalary)} / yr</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Monthly</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatMoney(hourlyToSalaryResult.monthlySalary)}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Bi-Weekly</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatMoney(hourlyToSalaryResult.biweeklySalary)}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Weekly</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatMoney(hourlyToSalaryResult.weeklySalary)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'salary-to-hourly-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Annual Salary to Hourly Wage Calculator"
        onReset={() => {
          setShSal(80000);
          setShHrs(40);
          setShWks(52);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="sh-sal"
              label="Annual Salary"
              value={shSal}
              onChange={setShSal}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UnitNumberInput
                id="sh-hrs"
                label="Hours per Week"
                value={shHrs}
                onChange={setShHrs}
                suffix="hrs/wk"
                min={1}
                max={168}
              />
              <UnitNumberInput
                id="sh-wks"
                label="Weeks per Year"
                value={shWks}
                onChange={setShWks}
                suffix="wks/yr"
                min={1}
                max={52}
              />
            </div>
          </div>
        }
        results={
          salaryToHourlyResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase">Hourly Wage Equivalent</span>
                <div className="text-3xl font-bold text-blue-900 dark:text-white mt-1">{currencySymbol}{salaryToHourlyResult.hourlyRate} / hr</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Daily</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{currencySymbol}{salaryToHourlyResult.dailyRate}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Weekly</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatMoney(salaryToHourlyResult.weeklyRate)}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Monthly</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{formatMoney(salaryToHourlyResult.monthlyRate)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'bonus-commission-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Bonus & Commission Earnings Calculator"
        onReset={() => {
          setBcBase(65000);
          setBcBonus(10);
          setBcComm(5);
          setBcSales(200000);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="bc-base"
              label="Base Salary"
              value={bcBase}
              onChange={setBcBase}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <UnitNumberInput
                id="bc-bonus"
                label="Bonus"
                value={bcBonus}
                onChange={setBcBonus}
                suffix="%"
                min={0}
                max={100}
              />
              <UnitNumberInput
                id="bc-comm"
                label="Commission"
                value={bcComm}
                onChange={setBcComm}
                suffix="%"
                min={0}
                max={100}
              />
              <CurrencyInput
                id="bc-sales"
                label="Sales Closed"
                value={bcSales}
                onChange={setBcSales}
                min={0}
              />
            </div>
          </div>
        }
        results={
          bonusCommResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Total Earned Compensation</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(bonusCommResult.totalCompensation)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Bonus Amount</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(bonusCommResult.bonusAmount)}</div>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border">
                  <div className="text-slate-500">Commission Amount</div>
                  <div className="font-bold text-slate-900 dark:text-white">{formatMoney(bonusCommResult.commissionAmount)}</div>
                </div>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'total-compensation-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Total Compensation Package Calculator"
        onReset={() => {
          setTcBase(120000);
          setTcBonus(15000);
          setTcEquity(30000);
          setTcRetire(6000);
          setTcHealth(8000);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="tc-base"
              label="Base Salary"
              value={tcBase}
              onChange={setTcBase}
              min={0}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="tc-bonus"
                label="Annual Bonus"
                value={tcBonus}
                onChange={setTcBonus}
                min={0}
              />
              <CurrencyInput
                id="tc-equity"
                label="Annual Stock / RSUs"
                value={tcEquity}
                onChange={setTcEquity}
                min={0}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CurrencyInput
                id="tc-retire"
                label="Retirement Match"
                value={tcRetire}
                onChange={setTcRetire}
                min={0}
              />
              <CurrencyInput
                id="tc-health"
                label="Healthcare Benefits"
                value={tcHealth}
                onChange={setTcHealth}
                min={0}
              />
            </div>
          </div>
        }
        results={
          totalCompResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Total Annual Compensation</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(totalCompResult.totalCompensation)}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Base pay represents {totalCompResult.baseSalaryPercent}% of total package</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Benefits & Equity Total</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{formatMoney(totalCompResult.benefitsTotal)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  if (toolSlug === 'required-salary-calculator') {
    return (
      <CompactCalculatorWorkspace
        title="Required Gross Salary Calculator"
        onReset={() => {
          setRsTakeHome(5000);
          setRsTaxPct(25);
        }}
        inputs={
          <div className="space-y-3">
            <CurrencyInput
              id="rs-takehome"
              label="Desired Monthly Net Take-Home Pay"
              value={rsTakeHome}
              onChange={setRsTakeHome}
              min={0}
            />
            <UnitNumberInput
              id="rs-tax-pct"
              label="Estimated Tax & Deduction Rate"
              value={rsTaxPct}
              onChange={setRsTaxPct}
              suffix="%"
              min={0}
              max={90}
            />
          </div>
        }
        results={
          requiredSalaryResult ? (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Required Annual Gross Salary</span>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(requiredSalaryResult.requiredGrossSalary)}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimated Annual Deductions & Taxes</span>
                <span className="font-bold text-slate-900 dark:text-white text-base">{formatMoney(requiredSalaryResult.totalTaxesAndDeductions)}</span>
              </div>
            </div>
          ) : null
        }
      />
    );
  }

  // Fallback / GPA to percentage
  return (
    <CompactCalculatorWorkspace
      title="GPA to Percentage Calculator"
      onReset={() => {
        setGpaVal(3.6);
        setGpaScale(4.0);
      }}
      inputs={
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              Grading Scale
            </label>
            <select
              value={gpaScale}
              onChange={(e) => setGpaScale(Number(e.target.value) as 4.0 | 10.0)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-900 dark:text-white"
            >
              <option value={4.0}>4.0 GPA Scale (US / International)</option>
              <option value={10.0}>10.0 CGPA Scale (CBSE / India / Europe)</option>
            </select>
          </div>
          <UnitNumberInput
            id="gpa-val"
            label="Your GPA / CGPA"
            value={gpaVal}
            onChange={setGpaVal}
            step={0.01}
            min={0}
            max={gpaScale}
          />
        </div>
      }
      results={
        gpaResult ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase">Equivalent Academic Percentage</span>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{gpaResult.equivalentPercentage}%</div>
          </div>
        ) : null
      }
    />
  );
};
