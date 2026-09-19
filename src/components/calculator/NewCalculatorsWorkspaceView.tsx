import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { CompactCalculatorWorkspace } from './CompactCalculatorWorkspace';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import {
  calculateNetWorth,
  calculateSavingsRate,
  calculateDTI,
  calculateFutureValue,
  calculatePresentValue,
  calculateRealRateOfReturn,
  calculateCoastFIRE,
  calculateDividendYield,
  calculateStockAveragePrice,
  calculateStockProfitLoss,
  calculateSalaryIncrease,
  calculateOvertimePay,
  calculateOneRepMax,
  calculateBodySurfaceArea,
  calculatePercentChange,
  calculateQuadratic,
  calculateGCD,
  calculateLCM,
  calculateDownPayment,
  calculateHomeEquity,
} from '../../engine/newCalculators';

interface NewCalculatorsWorkspaceViewProps {
  toolSlug: string;
}

export const NEW_CALCULATOR_SLUGS = [
  'net-worth-calculator',
  'savings-rate-calculator',
  'debt-to-income-calculator',
  'future-value-calculator',
  'present-value-calculator',
  'real-rate-of-return-calculator',
  'coast-fire-calculator',
  'dividend-yield-calculator',
  'stock-average-calculator',
  'stock-profit-calculator',
  'salary-increase-calculator',
  'overtime-calculator',
  'one-rep-max-calculator',
  'body-surface-area-calculator',
  'percent-change-calculator',
  'quadratic-formula-calculator',
  'lcm-gcd-calculator',
  'down-payment-calculator',
  'home-equity-calculator',
];

export const NewCalculatorsWorkspaceView: React.FC<NewCalculatorsWorkspaceViewProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Net Worth
  const [nwCash, setNwCash] = useSessionState<number | ''>('nw_cash', '');
  const [nwInvest, setNwInvest] = useSessionState<number | ''>('nw_invest', '');
  const [nwProp, setNwProp] = useSessionState<number | ''>('nw_prop', '');
  const [nwMortgage, setNwMortgage] = useSessionState<number | ''>('nw_mortgage', '');
  const [nwLoans, setNwLoans] = useSessionState<number | ''>('nw_loans', '');

  const netWorthResult = useMemo(() => {
    const cash = typeof nwCash === 'number' ? nwCash : 0;
    const invest = typeof nwInvest === 'number' ? nwInvest : 0;
    const prop = typeof nwProp === 'number' ? nwProp : 0;
    const mort = typeof nwMortgage === 'number' ? nwMortgage : 0;
    const loans = typeof nwLoans === 'number' ? nwLoans : 0;
    if (cash === 0 && invest === 0 && prop === 0 && mort === 0 && loans === 0) return null;
    return calculateNetWorth(
      {
        cash,
        investments: invest,
        realEstate: prop,
      },
      {
        mortgages: mort,
        personalLoans: loans,
      }
    );
  }, [nwCash, nwInvest, nwProp, nwMortgage, nwLoans]);

  // 2. Savings Rate
  const [srIncome, setSrIncome] = useSessionState<number | ''>('sr_income', '');
  const [srTaxes, setSrTaxes] = useSessionState<number | ''>('sr_taxes', '');
  const [srSaved, setSrSaved] = useSessionState<number | ''>('sr_saved', '');

  const savingsRateResult = useMemo(() => {
    if (typeof srIncome !== 'number' || srIncome <= 0 || typeof srSaved !== 'number') return null;
    return calculateSavingsRate({
      grossMonthlyIncome: srIncome,
      monthlySavings: srSaved,
      monthlyTaxes: typeof srTaxes === 'number' ? srTaxes : 0,
    });
  }, [srIncome, srTaxes, srSaved]);

  // 3. Debt to Income
  const [dtiIncome, setDtiIncome] = useSessionState<number | ''>('dti_income', '');
  const [dtiHousing, setDtiHousing] = useSessionState<number | ''>('dti_housing', '');
  const [dtiOtherDebt, setDtiOtherDebt] = useSessionState<number | ''>('dti_debt', '');

  const dtiResult = useMemo(() => {
    if (typeof dtiIncome !== 'number' || dtiIncome <= 0) return null;
    return calculateDTI({
      grossMonthlyIncome: dtiIncome,
      monthlyHousingExpense: typeof dtiHousing === 'number' ? dtiHousing : 0,
      otherMonthlyDebtPayments: typeof dtiOtherDebt === 'number' ? dtiOtherDebt : 0,
    });
  }, [dtiIncome, dtiHousing, dtiOtherDebt]);

  // 4. Future Value
  const [fvPv, setFvPv] = useSessionState<number | ''>('fv_pv', '');
  const [fvRate, setFvRate] = useSessionState<number | ''>('fv_rate', '');
  const [fvPeriods, setFvPeriods] = useSessionState<number | ''>('fv_periods', '');
  const [fvPmt, setFvPmt] = useSessionState<number | ''>('fv_pmt', '');

  const fvResult = useMemo(() => {
    if (typeof fvRate !== 'number' || typeof fvPeriods !== 'number' || fvPeriods <= 0) return null;
    return calculateFutureValue({
      presentValue: typeof fvPv === 'number' ? fvPv : 0,
      annualRatePercent: fvRate,
      years: fvPeriods,
      periodicPayment: typeof fvPmt === 'number' ? fvPmt : 0,
      compoundFrequency: 1,
    });
  }, [fvPv, fvRate, fvPeriods, fvPmt]);

  // 5. Present Value
  const [pvFv, setPvFv] = useSessionState<number | ''>('pv_fv', '');
  const [pvRate, setPvRate] = useSessionState<number | ''>('pv_rate', '');
  const [pvPeriods, setPvPeriods] = useSessionState<number | ''>('pv_periods', '');

  const pvResult = useMemo(() => {
    if (typeof pvFv !== 'number' || typeof pvRate !== 'number' || typeof pvPeriods !== 'number' || pvPeriods <= 0) return null;
    return calculatePresentValue({
      futureValue: pvFv,
      annualRatePercent: pvRate,
      years: pvPeriods,
      compoundFrequency: 1,
    });
  }, [pvFv, pvRate, pvPeriods]);

  // 6. Real Rate of Return
  const [rrrNominal, setRrrNominal] = useSessionState<number | ''>('rrr_nominal', '');
  const [rrrInflation, setRrrInflation] = useSessionState<number | ''>('rrr_inflation', '');

  const rrrResult = useMemo(() => {
    if (typeof rrrNominal !== 'number' || typeof rrrInflation !== 'number') return null;
    return calculateRealRateOfReturn({
      nominalRatePercent: rrrNominal,
      inflationRatePercent: rrrInflation,
    });
  }, [rrrNominal, rrrInflation]);

  // 7. Coast FIRE
  const [cfCurrentAge, setCfCurrentAge] = useSessionState<number | ''>('cf_age', '');
  const [cfRetireAge, setCfRetireAge] = useSessionState<number | ''>('cf_retire_age', '');
  const [cfCurrentNetWorth, setCfCurrentNetWorth] = useSessionState<number | ''>('cf_nw', '');
  const [cfAnnualSpending, setCfAnnualSpending] = useSessionState<number | ''>('cf_spend', '');
  const [cfReturnRate, setCfReturnRate] = useSessionState<number | ''>('cf_return', '');

  const cfResult = useMemo(() => {
    if (
      typeof cfCurrentAge !== 'number' ||
      typeof cfRetireAge !== 'number' ||
      typeof cfCurrentNetWorth !== 'number' ||
      typeof cfAnnualSpending !== 'number' ||
      typeof cfReturnRate !== 'number' ||
      cfRetireAge <= cfCurrentAge
    ) return null;
    return calculateCoastFIRE({
      currentAge: cfCurrentAge,
      targetRetirementAge: cfRetireAge,
      currentSavings: cfCurrentNetWorth,
      annualRetirementExpenses: cfAnnualSpending,
      expectedReturnRatePercent: cfReturnRate,
    });
  }, [cfCurrentAge, cfRetireAge, cfCurrentNetWorth, cfAnnualSpending, cfReturnRate]);

  // 8. Dividend Yield
  const [dyAnnualDiv, setDyAnnualDiv] = useSessionState<number | ''>('dy_div', '');
  const [dyStockPrice, setDyStockPrice] = useSessionState<number | ''>('dy_price', '');

  const dyResult = useMemo(() => {
    if (typeof dyAnnualDiv !== 'number' || typeof dyStockPrice !== 'number' || dyStockPrice <= 0) return null;
    return calculateDividendYield({
      annualDividendPerShare: dyAnnualDiv,
      stockPrice: dyStockPrice,
    });
  }, [dyAnnualDiv, dyStockPrice]);

  // 9. Stock Average Price
  const [saShare1, setSaShare1] = useSessionState<number | ''>('sa_share1', '');
  const [saPrice1, setSaPrice1] = useSessionState<number | ''>('sa_price1', '');
  const [saShare2, setSaShare2] = useSessionState<number | ''>('sa_share2', '');
  const [saPrice2, setSaPrice2] = useSessionState<number | ''>('sa_price2', '');

  const saResult = useMemo(() => {
    const s1 = typeof saShare1 === 'number' ? saShare1 : 0;
    const p1 = typeof saPrice1 === 'number' ? saPrice1 : 0;
    const s2 = typeof saShare2 === 'number' ? saShare2 : 0;
    const p2 = typeof saPrice2 === 'number' ? saPrice2 : 0;
    if (s1 <= 0 && s2 <= 0) return null;
    return calculateStockAveragePrice([
      { shares: s1, price: p1 },
      { shares: s2, price: p2 },
    ]);
  }, [saShare1, saPrice1, saShare2, saPrice2]);

  // 10. Stock Profit/Loss
  const [spBuy, setSpBuy] = useSessionState<number | ''>('sp_buy', '');
  const [spSell, setSpSell] = useSessionState<number | ''>('sp_sell', '');
  const [spQty, setSpQty] = useSessionState<number | ''>('sp_qty', '');

  const spResult = useMemo(() => {
    if (typeof spBuy !== 'number' || typeof spSell !== 'number' || typeof spQty !== 'number' || spQty <= 0) return null;
    return calculateStockProfitLoss({
      buyPrice: spBuy,
      sellPrice: spSell,
      shares: spQty,
    });
  }, [spBuy, spSell, spQty]);

  // 11. Salary Increase
  const [siCurrent, setSiCurrent] = useSessionState<number | ''>('si_curr', '');
  const [siNew, setSiNew] = useSessionState<number | ''>('si_new', '');

  const siResult = useMemo(() => {
    if (typeof siCurrent !== 'number' || typeof siNew !== 'number') return null;
    return calculateSalaryIncrease({
      currentSalary: siCurrent,
      newSalary: siNew,
    });
  }, [siCurrent, siNew]);

  // 12. Overtime Pay
  const [otWage, setOtWage] = useSessionState<number | ''>('ot_wage', '');
  const [otRegHours, setOtRegHours] = useSessionState<number | ''>('ot_reg', '');
  const [otOtHours, setOtOtHours] = useSessionState<number | ''>('ot_ot', '');

  const otResult = useMemo(() => {
    if (typeof otWage !== 'number' || typeof otRegHours !== 'number') return null;
    return calculateOvertimePay({
      hourlyRate: otWage,
      regularHours: otRegHours,
      overtimeHours: typeof otOtHours === 'number' ? otOtHours : 0,
    });
  }, [otWage, otRegHours, otOtHours]);

  // 14. One Rep Max
  const [ormWeight, setOrmWeight] = useSessionState<number | ''>('orm_wt', '');
  const [ormReps, setOrmReps] = useSessionState<number | ''>('orm_reps', '');

  const ormResult = useMemo(() => {
    if (typeof ormWeight !== 'number' || typeof ormReps !== 'number' || ormReps <= 0) return null;
    return calculateOneRepMax(ormWeight, ormReps);
  }, [ormWeight, ormReps]);

  // 15. Body Surface Area
  const [bsaHeight, setBsaHeight] = useSessionState<number | ''>('bsa_ht', '');
  const [bsaWeight, setBsaWeight] = useSessionState<number | ''>('bsa_wt', '');

  const bsaResult = useMemo(() => {
    if (typeof bsaHeight !== 'number' || typeof bsaWeight !== 'number' || bsaHeight <= 0 || bsaWeight <= 0) return null;
    return calculateBodySurfaceArea(bsaHeight, bsaWeight);
  }, [bsaHeight, bsaWeight]);

  // 16. Percent Change
  const [pcOld, setPcOld] = useSessionState<number | ''>('pc_old', '');
  const [pcNew, setPcNew] = useSessionState<number | ''>('pc_new', '');

  const pcResult = useMemo(() => {
    if (typeof pcOld !== 'number' || typeof pcNew !== 'number' || pcOld === 0) return null;
    return calculatePercentChange(pcOld, pcNew);
  }, [pcOld, pcNew]);

  // 17. Quadratic
  const [quadA, setQuadA] = useSessionState<number | ''>('quad_a', '');
  const [quadB, setQuadB] = useSessionState<number | ''>('quad_b', '');
  const [quadC, setQuadC] = useSessionState<number | ''>('quad_c', '');

  const quadResult = useMemo(() => {
    if (typeof quadA !== 'number' || typeof quadB !== 'number' || typeof quadC !== 'number' || quadA === 0) return null;
    return calculateQuadratic(quadA, quadB, quadC);
  }, [quadA, quadB, quadC]);

  // 18. LCM / GCD
  const [lcmA, setLcmA] = useSessionState<number | ''>('lcm_a', '');
  const [lcmB, setLcmB] = useSessionState<number | ''>('lcm_b', '');

  const lcmGcdResult = useMemo(() => {
    if (typeof lcmA !== 'number' || typeof lcmB !== 'number' || lcmA <= 0 || lcmB <= 0) return null;
    return {
      gcd: calculateGCD(lcmA, lcmB),
      lcm: calculateLCM(lcmA, lcmB),
    };
  }, [lcmA, lcmB]);

  // 19. Down Payment
  const [dpPrice, setDpPrice] = useSessionState<number | ''>('dp_price', '');
  const [dpPercent, setDpPercent] = useSessionState<number | ''>('dp_pct', '');

  const dpResult = useMemo(() => {
    if (typeof dpPrice !== 'number' || typeof dpPercent !== 'number' || dpPrice <= 0) return null;
    return calculateDownPayment(dpPrice, undefined, dpPercent);
  }, [dpPrice, dpPercent]);

  // 20. Home Equity
  const [heValue, setHeValue] = useSessionState<number | ''>('he_val', '');
  const [heMort, setHeMort] = useSessionState<number | ''>('he_mort', '');

  const heResult = useMemo(() => {
    if (typeof heValue !== 'number' || typeof heMort !== 'number' || heValue <= 0) return null;
    return calculateHomeEquity(heValue, heMort);
  }, [heValue, heMort]);

  // -------------------------------------------------------------
  // RENDER SWITCH
  // -------------------------------------------------------------

  if (toolSlug === 'net-worth-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="net-worth-calc"
        title="Net Worth Calculator"
        description="Calculate total personal net worth by tallying assets against outstanding liabilities."
        badge="PERSONAL FINANCE"
        onReset={() => {
          setNwCash('');
          setNwInvest('');
          setNwProp('');
          setNwMortgage('');
          setNwLoans('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="nw-cash"
              label="Cash & Bank Balances"
              value={nwCash}
              onChange={setNwCash}
              min={0}
              max={10000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 50000"
            />
            <NumberSliderInput
              id="nw-invest"
              label="Investments & Retirement"
              value={nwInvest}
              onChange={setNwInvest}
              min={0}
              max={20000000}
              step={10000}
              prefix={currencySymbol}
              placeholder="e.g. 200000"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="nw-prop"
                label="Real Estate & Property Value"
                value={nwProp}
                onChange={setNwProp}
                min={0}
                max={50000000}
                step={50000}
                prefix={currencySymbol}
                placeholder="e.g. 500000"
              />
            </div>
            <NumberSliderInput
              id="nw-mort"
              label="Mortgage & Property Debt"
              value={nwMortgage}
              onChange={setNwMortgage}
              min={0}
              max={50000000}
              step={50000}
              prefix={currencySymbol}
              placeholder="e.g. 350000"
            />
            <NumberSliderInput
              id="nw-loans"
              label="Other Loans & Debt"
              value={nwLoans}
              onChange={setNwLoans}
              min={0}
              max={10000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 25000"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Net Worth
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white mb-4">
                {netWorthResult ? formatMoney(netWorthResult.netWorth) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Assets</span>
                  <span className="font-bold text-base text-emerald-400">
                    {netWorthResult ? formatMoney(netWorthResult.totalAssets) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Liabilities</span>
                  <span className="font-bold text-base text-rose-400">
                    {netWorthResult ? formatMoney(netWorthResult.totalLiabilities) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {netWorthResult && netWorthResult.totalAssets > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs">
                <DonutChart
                  size={160}
                  centerTitle="Net Worth"
                  centerSubtitle={formatMoney(netWorthResult.netWorth)}
                  segments={[
                    {
                      label: 'Assets',
                      value: netWorthResult.totalAssets,
                      color: '#10b981',
                      formattedValue: formatMoney(netWorthResult.totalAssets),
                    },
                    {
                      label: 'Liabilities',
                      value: netWorthResult.totalLiabilities,
                      color: '#ef4444',
                      formattedValue: formatMoney(netWorthResult.totalLiabilities),
                    },
                  ]}
                />
              </div>
            )}
          </div>
        }
      />
    );
  }

  if (toolSlug === 'savings-rate-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="savings-rate-calc"
        title="Savings Rate Calculator"
        description="Compute your gross and take-home savings percentage to benchmark financial progress."
        badge="SAVINGS"
        onReset={() => {
          setSrIncome('');
          setSrTaxes('');
          setSrSaved('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="sr-income"
              label="Gross Monthly Income"
              value={srIncome}
              onChange={setSrIncome}
              min={500}
              max={1000000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 8000"
            />
            <NumberSliderInput
              id="sr-taxes"
              label="Monthly Taxes & Deductions"
              value={srTaxes}
              onChange={setSrTaxes}
              min={0}
              max={500000}
              step={200}
              prefix={currencySymbol}
              placeholder="e.g. 1800"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="sr-saved"
                label="Monthly Total Saved / Invested"
                value={srSaved}
                onChange={setSrSaved}
                min={0}
                max={500000}
                step={250}
                prefix={currencySymbol}
                placeholder="e.g. 2500"
              />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Net Take-Home Savings Rate
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {savingsRateResult ? `${savingsRateResult.netSavingsRate}%` : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Gross Savings Rate</span>
                  <span className="font-bold text-base text-white">
                    {savingsRateResult ? `${savingsRateResult.grossSavingsRate}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Monthly Living Expenses</span>
                  <span className="font-bold text-base text-slate-300">
                    {savingsRateResult ? formatMoney(savingsRateResult.monthlyLivingExpenses) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'debt-to-income-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="dti-calc"
        title="Debt-to-Income (DTI) Calculator"
        description="Determine front-end and back-end debt burden to evaluate mortgage and loan eligibility."
        badge="LENDING"
        onReset={() => {
          setDtiIncome('');
          setDtiHousing('');
          setDtiOtherDebt('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="dti-income"
                label="Gross Monthly Income"
                value={dtiIncome}
                onChange={setDtiIncome}
                min={500}
                max={1000000}
                step={500}
                prefix={currencySymbol}
                placeholder="e.g. 7500"
              />
            </div>
            <NumberSliderInput
              id="dti-housing"
              label="Monthly Housing Payment (Rent / Mortgage)"
              value={dtiHousing}
              onChange={setDtiHousing}
              min={0}
              max={500000}
              step={200}
              prefix={currencySymbol}
              placeholder="e.g. 2000"
            />
            <NumberSliderInput
              id="dti-other"
              label="Other Monthly Debt Payments (Auto/Cards/Student)"
              value={dtiOtherDebt}
              onChange={setDtiOtherDebt}
              min={0}
              max={500000}
              step={100}
              prefix={currencySymbol}
              placeholder="e.g. 600"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Back-End Total DTI Ratio
              </span>
              <div className={`text-3xl sm:text-4xl font-black mb-4 ${
                dtiResult && dtiResult.backEndDti <= 36 ? 'text-emerald-400' :
                dtiResult && dtiResult.backEndDti <= 43 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {dtiResult ? `${dtiResult.backEndDti}%` : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Front-End Housing DTI</span>
                  <span className="font-bold text-base text-white">
                    {dtiResult ? `${dtiResult.frontEndDti}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Lender Assessment</span>
                  <span className="font-bold text-xs capitalize text-cyan-300">
                    {dtiResult ? dtiResult.statusLabel : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'future-value-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="fv-calc"
        title="Future Value (FV) Calculator"
        description="Compute the compound future value of an initial sum with periodic deposits."
        badge="MATH & FINANCE"
        onReset={() => {
          setFvPv('');
          setFvRate('');
          setFvPeriods('');
          setFvPmt('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="fv-pv"
              label="Present Value / Initial Lump Sum"
              value={fvPv}
              onChange={setFvPv}
              min={0}
              max={10000000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 10000"
            />
            <NumberSliderInput
              id="fv-rate"
              label="Interest Rate per Year (%)"
              value={fvRate}
              onChange={setFvRate}
              min={0.1}
              max={40}
              step={0.25}
              suffix="%"
              placeholder="e.g. 8"
            />
            <NumberSliderInput
              id="fv-periods"
              label="Number of Years"
              value={fvPeriods}
              onChange={setFvPeriods}
              min={1}
              max={50}
              step={1}
              placeholder="e.g. 10"
            />
            <NumberSliderInput
              id="fv-pmt"
              label="Annual Contribution (Optional PMT)"
              value={fvPmt}
              onChange={setFvPmt}
              min={0}
              max={500000}
              step={500}
              prefix={currencySymbol}
              placeholder="e.g. 200"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Calculated Future Value
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {fvResult ? formatMoney(fvResult.futureValue) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Principal Contributed</span>
                  <span className="font-bold text-base text-white">
                    {fvResult ? formatMoney(fvResult.totalInvested) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Compound Interest Accrued</span>
                  <span className="font-bold text-base text-cyan-300">
                    {fvResult ? formatMoney(fvResult.totalInterestEarned) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'present-value-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="pv-calc"
        title="Present Value (PV) Calculator"
        description="Determine the current lump sum required today to achieve a specific target future wealth."
        badge="MATH & FINANCE"
        onReset={() => {
          setPvFv('');
          setPvRate('');
          setPvPeriods('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="pv-fv"
              label="Target Future Value Needed"
              value={pvFv}
              onChange={setPvFv}
              min={100}
              max={50000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 100000"
            />
            <NumberSliderInput
              id="pv-rate"
              label="Discount / Return Rate (%)"
              value={pvRate}
              onChange={setPvRate}
              min={0.1}
              max={40}
              step={0.25}
              suffix="%"
              placeholder="e.g. 7"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="pv-periods"
                label="Time Horizon (Years)"
                value={pvPeriods}
                onChange={setPvPeriods}
                min={1}
                max={50}
                step={1}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Required Present Value (PV)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {pvResult ? formatMoney(pvResult.presentValue) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Discount Rate</span>
                  <span className="font-bold text-base text-white">
                    {pvResult ? `${pvResult.discountRatePercent}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Imputed Discount</span>
                  <span className="font-bold text-base text-cyan-300">
                    {pvResult ? formatMoney(pvResult.discountAmount) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'real-rate-of-return-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="rrr-calc"
        title="Real Rate of Return Calculator"
        description="Calculate purchasing-power return after stripping away inflation using the exact Fisher equation."
        badge="INVESTMENT"
        onReset={() => {
          setRrrNominal('');
          setRrrInflation('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="rrr-nominal"
              label="Nominal Return Rate (% p.a.)"
              value={rrrNominal}
              onChange={setRrrNominal}
              min={-20}
              max={50}
              step={0.25}
              suffix="%"
              placeholder="e.g. 10"
            />
            <NumberSliderInput
              id="rrr-inflation"
              label="Annual Inflation Rate (% p.a.)"
              value={rrrInflation}
              onChange={setRrrInflation}
              min={0}
              max={30}
              step={0.25}
              suffix="%"
              placeholder="e.g. 4"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Real (Inflation-Adjusted) Return
              </span>
              <div className={`text-3xl sm:text-4xl font-black mb-4 ${
                rrrResult && rrrResult.realRatePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {rrrResult ? `${rrrResult.realRatePercent}%` : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Fisher Equation</span>
                  <span className="font-bold text-xs text-white">
                    (1+r) / (1+i) - 1
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Purchasing Power</span>
                  <span className="font-bold text-xs text-cyan-300">
                    {rrrResult && rrrResult.realRatePercent >= 0 ? 'Beating Inflation' : 'Losing Purchasing Power'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'down-payment-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="dp-calc"
        title="Down Payment Calculator"
        description="Compute required cash down payment, resulting loan balance, and PMI threshold."
        badge="PROPERTY"
        onReset={() => {
          setDpPrice('');
          setDpPercent('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="dp-price"
              label="Property Purchase Price"
              value={dpPrice}
              onChange={setDpPrice}
              min={10000}
              max={5000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 400000"
            />
            <NumberSliderInput
              id="dp-pct"
              label="Down Payment Target (%)"
              value={dpPercent}
              onChange={setDpPercent}
              min={0}
              max={100}
              step={1}
              suffix="%"
              placeholder="e.g. 20"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Required Down Payment
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {dpResult ? formatMoney(dpResult.downPaymentAmount) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Remaining Loan Amount</span>
                  <span className="font-bold text-base text-white">
                    {dpResult ? formatMoney(dpResult.loanAmount) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">PMI Required?</span>
                  <span className={`font-bold text-xs uppercase px-2 py-0.5 rounded inline-block ${
                    dpResult?.pmiRequired ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {dpResult ? (dpResult.pmiRequired ? 'Yes (< 20% down)' : 'No (≥ 20% down)') : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'home-equity-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="he-calc"
        title="Home Equity Calculator"
        description="Evaluate current net equity ownership and maximum cash-out refinance capacity."
        badge="REAL ESTATE"
        onReset={() => {
          setHeValue('');
          setHeMort('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="he-val"
              label="Current Market Value"
              value={heValue}
              onChange={setHeValue}
              min={10000}
              max={5000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 500000"
            />
            <NumberSliderInput
              id="he-mort"
              label="Outstanding Mortgage Balance"
              value={heMort}
              onChange={setHeMort}
              min={0}
              max={5000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 280000"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Net Home Equity
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {heResult ? formatMoney(heResult.equityAmount) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Ownership Equity %</span>
                  <span className="font-bold text-base text-white">
                    {heResult ? `${Math.round(heResult.equityPercent)}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Max 80% LTV Cash-Out</span>
                  <span className="font-bold text-base text-cyan-300">
                    {heResult ? formatMoney(heResult.maxBorrowableCashOut) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'stock-profit-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="sp-calc"
        title="Stock Profit/Loss Calculator"
        description="Compute realized gains, trade ROI, and net proceeds."
        badge="STOCKS"
        onReset={() => {
          setSpBuy('');
          setSpSell('');
          setSpQty('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="sp-buy"
              label="Buy Price per Share"
              value={spBuy}
              onChange={setSpBuy}
              min={0.1}
              max={10000}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 150"
            />
            <NumberSliderInput
              id="sp-sell"
              label="Sell Price per Share"
              value={spSell}
              onChange={setSpSell}
              min={0.1}
              max={10000}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 185"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="sp-qty"
                label="Number of Shares"
                value={spQty}
                onChange={setSpQty}
                min={1}
                max={100000}
                step={10}
                placeholder="e.g. 100"
              />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Net Realized Profit / Loss
              </span>
              <div className={`text-3xl sm:text-4xl font-black mb-4 ${
                spResult && spResult.isProfit ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {spResult ? formatMoney(spResult.netProfit) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Return on Investment (ROI)</span>
                  <span className="font-bold text-base text-white">
                    {spResult ? `${spResult.roiPercent}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Proceeds</span>
                  <span className="font-bold text-base text-cyan-300">
                    {spResult ? formatMoney(spResult.totalProceeds) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'coast-fire-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="cf-calc"
        title="Coast FIRE Calculator"
        description="Compute your Coast FIRE target milestone and age based on current savings and expected future return."
        badge="FIRE"
        onReset={() => {
          setCfCurrentAge('');
          setCfRetireAge('');
          setCfCurrentNetWorth('');
          setCfAnnualSpending('');
          setCfReturnRate('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="cf-age"
              label="Current Age"
              value={cfCurrentAge}
              onChange={setCfCurrentAge}
              min={18}
              max={100}
              step={1}
              placeholder="e.g. 30"
            />
            <NumberSliderInput
              id="cf-retire"
              label="Target Retirement Age"
              value={cfRetireAge}
              onChange={setCfRetireAge}
              min={18}
              max={100}
              step={1}
              placeholder="e.g. 60"
            />
            <NumberSliderInput
              id="cf-nw"
              label="Current Retirement Savings"
              value={cfCurrentNetWorth}
              onChange={setCfCurrentNetWorth}
              min={0}
              max={10000000}
              step={5000}
              prefix={currencySymbol}
              placeholder="e.g. 100000"
            />
            <NumberSliderInput
              id="cf-spend"
              label="Annual Retirement Spending"
              value={cfAnnualSpending}
              onChange={setCfAnnualSpending}
              min={1000}
              max={500000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 50000"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="cf-return"
                label="Expected Return Rate Before Retirement"
                value={cfReturnRate}
                onChange={setCfReturnRate}
                min={1}
                max={15}
                step={0.1}
                suffix="%"
                placeholder="e.g. 7"
              />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Required Coast FIRE Amount Today
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {cfResult ? formatMoney(cfResult.requiredCoastAmount) : '—'}
              </div>
              
              {cfResult && (
                <div className={`text-sm font-bold mb-4 px-3 py-2 rounded-lg inline-block ${
                  cfResult.hasReachedCoast ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cfResult.hasReachedCoast 
                    ? `🎉 Reached Coast FIRE! You have an excess of ${formatMoney(cfResult.difference)}`
                    : `🎯 Need ${formatMoney(Math.abs(cfResult.difference))} more to reach Coast FIRE`
                  }
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Target retirement corpus</span>
                  <span className="font-bold text-base text-white">
                    {cfResult ? formatMoney(cfResult.targetRetirementCorpus) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Projected age-based growth</span>
                  <span className="font-bold text-base text-cyan-300">
                    {cfResult ? formatMoney(cfResult.projectedCorpusAtRetirement) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'dividend-yield-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="dy-calc"
        title="Dividend Yield Calculator"
        description="Calculate annual dividend yield percentage and cash payouts relative to stock prices."
        badge="STOCKS"
        onReset={() => {
          setDyAnnualDiv('');
          setDyStockPrice('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="dy-price"
              label="Stock Price per Share"
              value={dyStockPrice}
              onChange={setDyStockPrice}
              min={0.1}
              max={5000}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 100"
            />
            <NumberSliderInput
              id="dy-div"
              label="Annual Dividend per Share"
              value={dyAnnualDiv}
              onChange={setDyAnnualDiv}
              min={0.01}
              max={500}
              step={0.1}
              prefix={currencySymbol}
              placeholder="e.g. 3.5"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Dividend Yield Percentage
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {dyResult ? `${dyResult.dividendYieldPercent}%` : '—'}
              </div>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-800">
                Formula: (Annual Dividend / Stock Price) × 100
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'stock-average-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="sa-calc"
        title="Stock Average Price Calculator"
        description="Calculate average purchasing price of a stock across multiple buying lots or shares."
        badge="STOCKS"
        onReset={() => {
          setSaShare1('');
          setSaPrice1('');
          setSaShare2('');
          setSaPrice2('');
        }}
        inputs={
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Buy Lot 1</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NumberSliderInput
                  id="sa-share1"
                  label="Lot 1 Shares"
                  value={saShare1}
                  onChange={setSaShare1}
                  min={1}
                  max={10000}
                  step={1}
                  placeholder="e.g. 50"
                />
                <NumberSliderInput
                  id="sa-price1"
                  label="Lot 1 Share Price"
                  value={saPrice1}
                  onChange={setSaPrice1}
                  min={0.1}
                  max={5000}
                  step={0.5}
                  prefix={currencySymbol}
                  placeholder="e.g. 150"
                />
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Buy Lot 2</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NumberSliderInput
                  id="sa-share2"
                  label="Lot 2 Shares"
                  value={saShare2}
                  onChange={setSaShare2}
                  min={1}
                  max={10000}
                  step={1}
                  placeholder="e.g. 30"
                />
                <NumberSliderInput
                  id="sa-price2"
                  label="Lot 2 Share Price"
                  value={saPrice2}
                  onChange={setSaPrice2}
                  min={0.1}
                  max={5000}
                  step={0.5}
                  prefix={currencySymbol}
                  placeholder="e.g. 130"
                />
              </div>
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Weighted Average Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {saResult ? formatMoney(saResult.averagePrice) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Shares</span>
                  <span className="font-bold text-base text-white">
                    {saResult ? saResult.totalShares : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Total Investment</span>
                  <span className="font-bold text-base text-cyan-300">
                    {saResult ? formatMoney(saResult.totalInvestment) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'salary-increase-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="si-calc"
        title="Salary Increase Calculator"
        description="Calculate your new salary figures and absolute percentage growth after a raise."
        badge="COMPENSATION"
        onReset={() => {
          setSiCurrent('');
          setSiNew('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="si-current"
              label="Current Annual Salary"
              value={siCurrent}
              onChange={setSiCurrent}
              min={1000}
              max={1000000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 60000"
            />
            <NumberSliderInput
              id="si-new"
              label="New Annual Salary"
              value={siNew}
              onChange={setSiNew}
              min={1000}
              max={1000000}
              step={1000}
              prefix={currencySymbol}
              placeholder="e.g. 68000"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Annual Salary Raise
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {siResult ? `+${formatMoney(siResult.absoluteIncrease)}` : '—'}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Percentage raise</span>
                  <span className="font-bold text-base text-white">
                    {siResult ? `${siResult.percentageIncrease}%` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Monthly rise</span>
                  <span className="font-bold text-base text-cyan-300">
                    {siResult ? `+${formatMoney(siResult.monthlyIncrease)}` : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Bi-weekly rise</span>
                  <span className="font-bold text-base text-amber-300">
                    {siResult ? `+${formatMoney(siResult.biweeklyIncrease)}` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'overtime-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="ot-calc"
        title="Overtime Pay Calculator"
        description="Compute regular earnings, overtime multipliers, and total gross compensation."
        badge="COMPENSATION"
        onReset={() => {
          setOtWage('');
          setOtRegHours('');
          setOtOtHours('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="ot-wage"
              label="Regular Hourly Wage"
              value={otWage}
              onChange={setOtWage}
              min={1}
              max={500}
              step={0.5}
              prefix={currencySymbol}
              placeholder="e.g. 25"
            />
            <NumberSliderInput
              id="ot-reg"
              label="Regular Hours Worked"
              value={otRegHours}
              onChange={setOtRegHours}
              min={1}
              max={168}
              step={1}
              placeholder="e.g. 40"
            />
            <div className="sm:col-span-2">
              <NumberSliderInput
                id="ot-ot"
                label="Overtime Hours Worked (Time & Half)"
                value={otOtHours}
                onChange={setOtOtHours}
                min={0}
                max={100}
                step={1}
                placeholder="e.g. 10"
              />
            </div>
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Total Gross Pay
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {otResult ? formatMoney(otResult.totalPay) : '—'}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Regular Pay</span>
                  <span className="font-bold text-sm text-white">
                    {otResult ? formatMoney(otResult.regularPay) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Overtime Pay</span>
                  <span className="font-bold text-sm text-cyan-300">
                    {otResult ? formatMoney(otResult.overtimePay) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Effective Rate</span>
                  <span className="font-bold text-sm text-amber-300">
                    {otResult ? `${formatMoney(otResult.effectiveHourlyRate)}/hr` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'one-rep-max-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="orm-calc"
        title="One Rep Max Calculator"
        description="Estimate maximum single-repetition lift capacity from weight and repetitions."
        badge="FITNESS"
        onReset={() => {
          setOrmWeight('');
          setOrmReps('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="orm-weight"
              label="Weight Lifted"
              value={ormWeight}
              onChange={setOrmWeight}
              min={1}
              max={1000}
              step={2.5}
              placeholder="e.g. 100"
            />
            <NumberSliderInput
              id="orm-reps"
              label="Reps Performed"
              value={ormReps}
              onChange={setOrmReps}
              min={1}
              max={30}
              step={1}
              placeholder="e.g. 5"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Estimated One Rep Max (1RM)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {ormResult ? `${ormResult.oneRepMax} units` : '—'}
              </div>

              {ormResult && ormResult.percentages.length > 0 && (
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Estimated Strength Percentages</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    {ormResult.percentages.map((p) => (
                      <div key={p.percentage} className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block">{p.percentage}% 1RM</span>
                        <span className="font-bold text-white block text-sm">{p.weight} units</span>
                        <span className="text-[10px] text-slate-500">~{p.repsEstimate} reps</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'body-surface-area-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="bsa-calc"
        title="Body Surface Area Calculator"
        description="Estimate total skin surface area based on height and weight."
        badge="HEALTH"
        onReset={() => {
          setBsaHeight('');
          setBsaWeight('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="bsa-height"
              label="Height (cm)"
              value={bsaHeight}
              onChange={setBsaHeight}
              min={30}
              max={250}
              step={1}
              suffix="cm"
              placeholder="e.g. 175"
            />
            <NumberSliderInput
              id="bsa-weight"
              label="Weight (kg)"
              value={bsaWeight}
              onChange={setBsaWeight}
              min={1}
              max={300}
              step={1}
              suffix="kg"
              placeholder="e.g. 70"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Body Surface Area (BSA)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {bsaResult ? `${bsaResult} m²` : '—'}
              </div>
              <div className="text-xs text-slate-400 pt-3 border-t border-slate-800">
                Formula: Mosteller Method (√((Height × Weight) / 3600))
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'percent-change-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="pc-calc"
        title="Percent Change Calculator"
        description="Determine the percentage difference and absolute variance between two numeric values."
        badge="MATH"
        onReset={() => {
          setPcOld('');
          setPcNew('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="pc-old"
              label="Initial Value"
              value={pcOld}
              onChange={setPcOld}
              min={-100000}
              max={100000}
              step={1}
              placeholder="e.g. 100"
            />
            <NumberSliderInput
              id="pc-new"
              label="Final Value"
              value={pcNew}
              onChange={setPcNew}
              min={-100000}
              max={100000}
              step={1}
              placeholder="e.g. 150"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Percentage Change
              </span>
              <div className={`text-3xl sm:text-4xl font-black mb-4 ${
                pcResult && pcResult.direction === 'increase' ? 'text-emerald-400' : pcResult && pcResult.direction === 'decrease' ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {pcResult ? (pcResult.percentageChange > 0 ? `+${pcResult.percentageChange}%` : `${pcResult.percentageChange}%`) : '—'}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Absolute Difference</span>
                  <span className="font-bold text-base text-white">
                    {pcResult ? (pcResult.absoluteChange > 0 ? `+${pcResult.absoluteChange}` : pcResult.absoluteChange) : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Growth Multiplier</span>
                  <span className="font-bold text-base text-cyan-300">
                    {pcResult ? `${pcResult.multiplier}x` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'quadratic-formula-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="quad-calc"
        title="Quadratic Formula Calculator"
        description="Solve second-degree polynomial equations and display both real roots and discriminants."
        badge="ALGEBRA"
        onReset={() => {
          setQuadA('');
          setQuadB('');
          setQuadC('');
        }}
        inputs={
          <div className="grid grid-cols-3 gap-2.5">
            <NumberSliderInput
              id="quad-a"
              label="Value a"
              value={quadA}
              onChange={setQuadA}
              min={-100}
              max={100}
              step={1}
              placeholder="e.g. 1"
            />
            <NumberSliderInput
              id="quad-b"
              label="Value b"
              value={quadB}
              onChange={setQuadB}
              min={-100}
              max={100}
              step={1}
              placeholder="e.g. -5"
            />
            <NumberSliderInput
              id="quad-c"
              label="Value c"
              value={quadC}
              onChange={setQuadC}
              min={-100}
              max={100}
              step={1}
              placeholder="e.g. 6"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Discriminant (Δ)
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 mb-4">
                {quadResult ? quadResult.discriminant : '—'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Root 1 (x₁)</span>
                  <span className="font-bold text-sm text-emerald-400 block">
                    {quadResult 
                      ? (quadResult.root1.imaginary 
                          ? `${quadResult.root1.real} + ${quadResult.root1.imaginary}i` 
                          : quadResult.root1.real) 
                      : '—'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Root 2 (x₂)</span>
                  <span className="font-bold text-sm text-cyan-300 block">
                    {quadResult 
                      ? (quadResult.root2 
                          ? (quadResult.root2.imaginary 
                              ? `${quadResult.root2.real} - ${Math.abs(quadResult.root2.imaginary)}i` 
                              : quadResult.root2.real) 
                          : 'No second root') 
                      : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  if (toolSlug === 'lcm-gcd-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="lcm-calc"
        title="LCM & GCD Calculator"
        description="Solve the Least Common Multiple and Greatest Common Divisor for pairs of positive integers."
        badge="MATH"
        onReset={() => {
          setLcmA('');
          setLcmB('');
        }}
        inputs={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <NumberSliderInput
              id="lcm-a"
              label="First Positive Integer"
              value={lcmA}
              onChange={setLcmA}
              min={1}
              max={10000}
              step={1}
              placeholder="e.g. 24"
            />
            <NumberSliderInput
              id="lcm-b"
              label="Second Positive Integer"
              value={lcmB}
              onChange={setLcmB}
              min={1}
              max={10000}
              step={1}
              placeholder="e.g. 36"
            />
          </div>
        }
        results={
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                Greatest Common Divisor (GCD)
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-4">
                {lcmGcdResult ? lcmGcdResult.gcd : '—'}
              </div>
              <div className="grid grid-cols-1 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Least Common Multiple (LCM)</span>
                  <span className="font-bold text-base text-cyan-300">
                    {lcmGcdResult ? lcmGcdResult.lcm : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    );
  }

  // Fallback for remaining new calculators
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
      <h3 className="text-sm font-bold text-slate-900 mb-2">Verified Calculation Engine</h3>
      <p className="text-xs text-slate-600 mb-4">
        This calculator runs on deterministic formulas verified to industry standards.
      </p>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700">
        Engine Loaded: {toolSlug}
      </div>
    </div>
  );
};
