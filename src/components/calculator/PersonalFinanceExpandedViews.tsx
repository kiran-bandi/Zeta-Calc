import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateSurvivalCost,
  calculateEmergencyFund,
  calculateNetWorth,
  calculateSavingsRate,
  calculateFIRE,
} from '../../engine/personalFinance';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { RotateCcw, ShieldCheck, Flame, Wallet, PieChart, CheckCircle2 } from 'lucide-react';

interface PersonalFinanceExpandedViewsProps {
  toolSlug: string;
}

export const PersonalFinanceExpandedViews: React.FC<PersonalFinanceExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Survival Cost States
  const [scRent, setScRent] = useSessionState<number | ''>('sc_rent', '');
  const [scFood, setScFood] = useSessionState<number | ''>('sc_food', '');
  const [scUtils, setScUtils] = useSessionState<number | ''>('sc_utils', '');
  const [scDebt, setScDebt] = useSessionState<number | ''>('sc_debt', '');
  const [scInsur, setScInsur] = useSessionState<number | ''>('sc_insur', '');
  const [scTrans, setScTrans] = useSessionState<number | ''>('sc_trans', '');
  const [scMed, setScMed] = useSessionState<number | ''>('sc_med', '');

  // 2. Emergency Fund States
  const [efExpenses, setEfExpenses] = useSessionState<number | ''>('ef_expenses', '');
  const [efMonths, setEfMonths] = useSessionState<number | ''>('ef_months', 6);
  const [efSavings, setEfSavings] = useSessionState<number | ''>('ef_savings', '');
  const [efAlloc, setEfAlloc] = useSessionState<number | ''>('ef_alloc', '');

  // 3. Net Worth States
  const [nwCash, setNwCash] = useSessionState<number | ''>('nw_cash', '');
  const [nwStocks, setNwStocks] = useSessionState<number | ''>('nw_stocks', '');
  const [nwRetire, setNwRetire] = useSessionState<number | ''>('nw_retire', '');
  const [nwRealEstate, setNwRealEstate] = useSessionState<number | ''>('nw_real_estate', '');
  const [nwVehicles, setNwVehicles] = useSessionState<number | ''>('nw_vehicles', '');
  const [nwHomeLoan, setNwHomeLoan] = useSessionState<number | ''>('nw_home_loan', '');
  const [nwAutoLoan, setNwAutoLoan] = useSessionState<number | ''>('nw_auto_loan', '');
  const [nwCardDebt, setNwCardDebt] = useSessionState<number | ''>('nw_card_debt', '');

  // 4. Savings Rate States
  const [srGross, setSrGross] = useSessionState<number | ''>('sr_gross', '');
  const [srTax, setSrTax] = useSessionState<number | ''>('sr_tax', '');
  const [srNeeds, setSrNeeds] = useSessionState<number | ''>('sr_needs', '');
  const [srWants, setSrWants] = useSessionState<number | ''>('sr_wants', '');
  const [srSavings, setSrSavings] = useSessionState<number | ''>('sr_savings', '');

  // 5. FIRE States
  const [fireAge, setFireAge] = useSessionState<number | ''>('fire_age', '');
  const [fireExpenses, setFireExpenses] = useSessionState<number | ''>('fire_expenses', '');
  const [fireCurrent, setFireCurrent] = useSessionState<number | ''>('fire_current', '');
  const [fireSip, setFireSip] = useSessionState<number | ''>('fire_sip', '');
  const [fireReturn, setFireReturn] = useSessionState<number | ''>('fire_return', 11);
  const [fireInflation, setFireInflation] = useSessionState<number | ''>('fire_inflation', 6);
  const [fireSwr, setFireSwr] = useSessionState<number | ''>('fire_swr', 4);

  // Results
  const survivalResult = useMemo(() => {
    if (
      (typeof scRent !== 'number' || scRent <= 0) &&
      (typeof scFood !== 'number' || scFood <= 0)
    ) {
      return null;
    }
    return calculateSurvivalCost({
      housingRentOrEmi: typeof scRent === 'number' ? scRent : 0,
      groceriesAndFood: typeof scFood === 'number' ? scFood : 0,
      utilitiesBills: typeof scUtils === 'number' ? scUtils : 0,
      minimumDebtPayments: typeof scDebt === 'number' ? scDebt : 0,
      essentialInsurance: typeof scInsur === 'number' ? scInsur : 0,
      basicTransportation: typeof scTrans === 'number' ? scTrans : 0,
      criticalHealthcareMedicines: typeof scMed === 'number' ? scMed : 0,
    });
  }, [scRent, scFood, scUtils, scDebt, scInsur, scTrans, scMed]);

  const emergencyResult = useMemo(() => {
    if (typeof efExpenses !== 'number' || efExpenses <= 0) return null;
    return calculateEmergencyFund({
      monthlyEssentialExpenses: efExpenses,
      targetRunwayMonths: typeof efMonths === 'number' ? efMonths : 6,
      currentEmergencySavings: typeof efSavings === 'number' ? efSavings : 0,
      monthlySavingsAllocated: typeof efAlloc === 'number' ? efAlloc : 0,
    });
  }, [efExpenses, efMonths, efSavings, efAlloc]);

  const netWorthResult = useMemo(() => {
    if (
      (typeof nwCash !== 'number' && typeof nwStocks !== 'number' && typeof nwRealEstate !== 'number') ||
      ((nwCash || 0) + (nwStocks || 0) + (nwRealEstate || 0) <= 0)
    ) {
      return null;
    }
    return calculateNetWorth({
      cashAndBankBalances: typeof nwCash === 'number' ? nwCash : 0,
      liquidInvestmentsStocksMutualFunds: typeof nwStocks === 'number' ? nwStocks : 0,
      retirementFundsEPF_PPF_NPS: typeof nwRetire === 'number' ? nwRetire : 0,
      realEstatePrimaryProperty: typeof nwRealEstate === 'number' ? nwRealEstate : 0,
      realEstateOtherLand: 0,
      vehiclesAndValuables: typeof nwVehicles === 'number' ? nwVehicles : 0,
      homeLoanMortgage: typeof nwHomeLoan === 'number' ? nwHomeLoan : 0,
      carAutoLoans: typeof nwAutoLoan === 'number' ? nwAutoLoan : 0,
      personalLoans: 0,
      creditCardBalances: typeof nwCardDebt === 'number' ? nwCardDebt : 0,
      studentEducationLoans: 0,
    });
  }, [nwCash, nwStocks, nwRetire, nwRealEstate, nwVehicles, nwHomeLoan, nwAutoLoan, nwCardDebt]);

  const savingsRateResult = useMemo(() => {
    if (typeof srGross !== 'number' || srGross <= 0) return null;
    return calculateSavingsRate({
      monthlyGrossIncome: srGross,
      monthlyTaxDeductions: typeof srTax === 'number' ? srTax : 0,
      monthlyNeedsExpenses: typeof srNeeds === 'number' ? srNeeds : 0,
      monthlyWantsExpenses: typeof srWants === 'number' ? srWants : 0,
      monthlySavingsAndInvestments: typeof srSavings === 'number' ? srSavings : 0,
    });
  }, [srGross, srTax, srNeeds, srWants, srSavings]);

  const fireResult = useMemo(() => {
    if (
      typeof fireAge !== 'number' || fireAge <= 0 ||
      typeof fireExpenses !== 'number' || fireExpenses <= 0
    ) {
      return null;
    }
    return calculateFIRE({
      currentAge: fireAge,
      monthlyAnnualExpenses: fireExpenses,
      currentNetWorthInvestments: typeof fireCurrent === 'number' ? fireCurrent : 0,
      monthlyInvestmentAmount: typeof fireSip === 'number' ? fireSip : 0,
      expectedAnnualReturnRate: typeof fireReturn === 'number' ? fireReturn : 11,
      expectedInflationRate: typeof fireInflation === 'number' ? fireInflation : 6,
      safeWithdrawalRate: typeof fireSwr === 'number' ? fireSwr : 4,
    });
  }, [fireAge, fireExpenses, fireCurrent, fireSip, fireReturn, fireInflation, fireSwr]);

  // ------------------------------------------
  // FIRE & FINANCIAL INDEPENDENCE
  // ------------------------------------------
  if (toolSlug === 'fire-calculator' || toolSlug === 'financial-independence-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-emerald-600" />
                FIRE (Financial Independence, Retire Early)
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFireAge('');
                  setFireExpenses('');
                  setFireCurrent('');
                  setFireSip('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Your Current Age"
              value={fireAge}
              onChange={setFireAge}
              min={18}
              max={65}
              unitSuffix="Yrs"
              required
            />

            <NumberSliderInput
              label="Annual Living Expenses (Today's Value)"
              value={fireExpenses}
              onChange={setFireExpenses}
              min={100000}
              max={20000000}
              step={25000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Current Net Worth / Invested Corpus"
              value={fireCurrent}
              onChange={setFireCurrent}
              min={0}
              max={50000000}
              step={50000}
              unitPrefix={currencySymbol}
            />

            <NumberSliderInput
              label="Monthly Investment (SIP) Amount"
              value={fireSip}
              onChange={setFireSip}
              min={0}
              max={1000000}
              step={1000}
              unitPrefix={currencySymbol}
            />

            <div className="grid grid-cols-3 gap-3">
              <NumberSliderInput
                label="Return (%)"
                value={fireReturn}
                onChange={setFireReturn}
                min={5}
                max={18}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="Inflation (%)"
                value={fireInflation}
                onChange={setFireInflation}
                min={3}
                max={12}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="SWR (%)"
                value={fireSwr}
                onChange={setFireSwr}
                min={2.5}
                max={5}
                step={0.1}
                unitSuffix="%"
                helperText="Safe Withdrawal Rate"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {fireResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">FIRE Target Number ({100 / fireResult.safeWithdrawalRate}x Rule)</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(fireResult.standardFireNumber)}</div>
                <p className="text-xs text-emerald-800 mt-1">
                  You can achieve FIRE in <strong>{fireResult.yearsToFIRE} years</strong> (Age {fireResult.fireAge} in {fireResult.fireYear})
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Lean FIRE</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{formatMoney(fireResult.leanFireNumber)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Fat FIRE</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{formatMoney(fireResult.fatFireNumber)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Coast FIRE</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{formatMoney(fireResult.coastFireTargetNow)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Flame className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter age and annual expenses to project your FIRE timeline</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // EMERGENCY FUND
  // ------------------------------------------
  if (toolSlug === 'emergency-fund-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Emergency Fund Runway
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEfExpenses('');
                  setEfMonths(6);
                  setEfSavings('');
                  setEfAlloc('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Essential Monthly Living Expenses"
              value={efExpenses}
              onChange={setEfExpenses}
              min={5000}
              max={1000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Target Runway Duration (Months)"
              value={efMonths}
              onChange={setEfMonths}
              min={3}
              max={24}
              unitSuffix="Months"
              helperText="Standard rule: 6 months for salaried, 9-12 months for business/freelancers"
            />

            <NumberSliderInput
              label="Current Liquid Emergency Savings"
              value={efSavings}
              onChange={setEfSavings}
              min={0}
              max={5000000}
              step={5000}
              unitPrefix={currencySymbol}
            />

            <NumberSliderInput
              label="Monthly Savings Allocated to Fund"
              value={efAlloc}
              onChange={setEfAlloc}
              min={0}
              max={200000}
              step={1000}
              unitPrefix={currencySymbol}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {emergencyResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div
                className={`p-4 rounded-xl border ${
                  emergencyResult.isFullyFunded
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-base mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {emergencyResult.isFullyFunded
                    ? 'Emergency Fund Fully Funded!'
                    : `Shortfall of ${formatMoney(Math.abs(emergencyResult.savingsShortfallOrSurplus))}`}
                </div>
                <p className="text-sm">
                  {emergencyResult.isFullyFunded
                    ? `You have a robust ${efMonths}-month financial safety net ready for contingencies.`
                    : emergencyResult.monthsToReachGoal > 0
                    ? `At your current monthly savings rate, you will reach your target in ${emergencyResult.monthsToReachGoal} months.`
                    : 'Allocate monthly savings to build your emergency safety cushion.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Target Cushion</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(emergencyResult.targetFundAmount)}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Current Cushion</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{formatMoney(emergencyResult.currentSavings)}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="font-semibold text-slate-800">Recommended Liquid Allocation:</div>
                <div className="flex justify-between">
                  <span className="text-slate-600">30% Immediate Cash / Savings A/c:</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(emergencyResult.recommendedLiquidAllocation.savingsAccountCash)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">70% Liquid Funds / Sweep-in FD:</span>
                  <span className="font-semibold text-slate-900">
                    {formatMoney(emergencyResult.recommendedLiquidAllocation.liquidMutualFundsOrFD)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter monthly essential expenses</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Generic personal finance view
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Essential Spending Breakdown
            </h2>
            <button
              type="button"
              onClick={() => {
                setScRent('');
                setScFood('');
                setScUtils('');
                setScDebt('');
                setScInsur('');
                setScTrans('');
                setScMed('');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <NumberSliderInput
            label="Housing (Rent or Home Loan EMI)"
            value={scRent}
            onChange={setScRent}
            min={0}
            max={300000}
            step={500}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Groceries & Basic Food"
            value={scFood}
            onChange={setScFood}
            min={0}
            max={150000}
            step={500}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Utilities & Internet Bills"
            value={scUtils}
            onChange={setScUtils}
            min={0}
            max={50000}
            step={250}
            unitPrefix={currencySymbol}
          />

          <NumberSliderInput
            label="Minimum Debt Payments & Non-Negotiable EMIs"
            value={scDebt}
            onChange={setScDebt}
            min={0}
            max={200000}
            step={500}
            unitPrefix={currencySymbol}
          />

          <NumberSliderInput
            label="Healthcare & Critical Medicines"
            value={scMed}
            onChange={setScMed}
            min={0}
            max={50000}
            step={250}
            unitPrefix={currencySymbol}
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {survivalResult ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Monthly Survival Baseline</span>
              <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(survivalResult.totalMonthlySurvivalCost)}</div>
              <p className="text-xs text-emerald-800 mt-1">Annual Baseline: {formatMoney(survivalResult.totalAnnualSurvivalCost)}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase">Cost Distribution</div>
              {survivalResult.costBreakdown
                .filter((c) => c.amount > 0)
                .map((c) => (
                  <div key={c.category} className="flex justify-between text-xs">
                    <span className="text-slate-600">{c.category}:</span>
                    <span className="font-semibold text-slate-900">
                      {formatMoney(c.amount)} ({c.percentage}%)
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <Wallet className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter housing and grocery expenses to calculate survival baseline</p>
          </div>
        )}
      </div>
    </div>
  );
};
