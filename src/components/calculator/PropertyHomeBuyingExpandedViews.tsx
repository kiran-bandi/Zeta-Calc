import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateRentVsBuy,
  calculateInterestOffsetLoan,
  calculatePrepaymentVsSip,
} from '../../engine/propertyHomeBuying';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { InterestRateInput } from '../common/InterestRateInput';
import { DonutChart } from '../common/DonutChart';
import { RotateCcw, CheckCircle2, TrendingUp, AlertCircle, Home, Coins, ArrowRight } from 'lucide-react';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';

interface PropertyHomeBuyingExpandedViewsProps {
  toolSlug: string;
}

export const PropertyHomeBuyingExpandedViews: React.FC<PropertyHomeBuyingExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // 1. RENT VS BUY CALCULATOR
  // ==========================================
  const [rvbHomePrice, setRvbHomePrice] = useSessionState<number | ''>('rvb_home_price', '');
  const [rvbDownPaymentMode, setRvbDownPaymentMode] = useSessionState<'amount' | 'percentage'>('rvb_dp_mode', 'amount');
  const [rvbDownPayment, setRvbDownPayment] = useSessionState<number | ''>('rvb_down_pmt', '');
  const [rvbDownPaymentPercent, setRvbDownPaymentPercent] = useSessionState<number | ''>('rvb_dp_pct', 20);
  const [rvbLoanRate, setRvbLoanRate] = useSessionState<number | ''>('rvb_loan_rate', '');
  const [rvbLoanRateHundred, setRvbLoanRateHundred] = useSessionState<number | ''>('rvb_loan_rate_hundred', '');
  const [rvbLoanRateMode, setRvbLoanRateMode] = useSessionState<'percentage_annual' | 'per_hundred_month'>('rvb_rate_mode', 'percentage_annual');
  const [rvbLoanTermYears, setRvbLoanTermYears] = useSessionState<number | ''>('rvb_loan_term_yrs', '');
  const [rvbLoanTermMonths, setRvbLoanTermMonths] = useSessionState<number | ''>('rvb_loan_term_mos', '');
  const [rvbMonthlyRent, setRvbMonthlyRent] = useSessionState<number | ''>('rvb_monthly_rent', '');
  const [rvbRentIncrease, setRvbRentIncrease] = useSessionState<number | ''>('rvb_rent_inc', 5);
  const [rvbPropApprec, setRvbPropApprec] = useSessionState<number | ''>('rvb_prop_apprec', 6);
  const [rvbInvReturn, setRvbInvReturn] = useSessionState<number | ''>('rvb_inv_return', 11);
  const [rvbHorizon, setRvbHorizon] = useSessionState<number | ''>('rvb_horizon', 15);
  const [rvbUpfrontCostMode, setRvbUpfrontCostMode] = useSessionState<'percentage' | 'fixed'>('rvb_upfront_mode', 'percentage');
  const [rvbUpfrontCostValue, setRvbUpfrontCostValue] = useSessionState<number | ''>('rvb_upfront_val', 5);
  const [rvbOwnershipCostMode, setRvbOwnershipCostMode] = useSessionState<'percentage' | 'fixed'>('rvb_ownership_mode', 'percentage');
  const [rvbAnnualOwnershipCost, setRvbAnnualOwnershipCost] = useSessionState<number | ''>('rvb_ownership_val', 1.5);
  const [rvbSellingCostValue, setRvbSellingCostValue] = useSessionState<number | ''>('rvb_selling_val', 6);

  const resetRentVsBuy = () => {
    setRvbHomePrice('');
    setRvbDownPaymentMode('amount');
    setRvbDownPayment('');
    setRvbDownPaymentPercent(20);
    setRvbLoanRate('');
    setRvbLoanRateHundred('');
    setRvbLoanTermYears('');
    setRvbLoanTermMonths('');
    setRvbMonthlyRent('');
    setRvbRentIncrease(5);
    setRvbPropApprec(6);
    setRvbInvReturn(11);
    setRvbHorizon(15);
    setRvbUpfrontCostMode('percentage');
    setRvbUpfrontCostValue(5);
    setRvbOwnershipCostMode('percentage');
    setRvbAnnualOwnershipCost(1.5);
    setRvbSellingCostValue(6);
  };

  const rvbTermNorm = React.useMemo(() => {
    return normalizeTerm({ years: rvbLoanTermYears, months: rvbLoanTermMonths });
  }, [rvbLoanTermYears, rvbLoanTermMonths]);

  const rentVsBuyResult = React.useMemo(() => {
    if (
      typeof rvbHomePrice !== 'number' || rvbHomePrice <= 0 ||
      typeof rvbLoanRate !== 'number' || rvbLoanRate <= 0 ||
      !rvbTermNorm.isValid ||
      typeof rvbMonthlyRent !== 'number' || rvbMonthlyRent <= 0 ||
      typeof rvbHorizon !== 'number' || rvbHorizon <= 0
    ) {
      return null;
    }

    return calculateRentVsBuy({
      homePrice: rvbHomePrice,
      downPayment: typeof rvbDownPayment === 'number' ? rvbDownPayment : 0,
      downPaymentMode: rvbDownPaymentMode,
      downPaymentPercent: typeof rvbDownPaymentPercent === 'number' ? rvbDownPaymentPercent : 20,
      loanInterestRate: rvbLoanRate,
      loanTermYears: rvbTermNorm.totalYears,
      monthlyRent: rvbMonthlyRent,
      annualRentIncrease: typeof rvbRentIncrease === 'number' ? rvbRentIncrease : 5,
      propertyAppreciationRate: typeof rvbPropApprec === 'number' ? rvbPropApprec : 6,
      investmentReturnRate: typeof rvbInvReturn === 'number' ? rvbInvReturn : 11,
      upfrontCostMode: rvbUpfrontCostMode,
      upfrontCostValue: typeof rvbUpfrontCostValue === 'number' ? rvbUpfrontCostValue : 5,
      ownershipCostMode: rvbOwnershipCostMode,
      annualOwnershipCost: typeof rvbAnnualOwnershipCost === 'number' ? rvbAnnualOwnershipCost : 1.5,
      sellingCostMode: 'percentage',
      sellingCostValue: typeof rvbSellingCostValue === 'number' ? rvbSellingCostValue : 6,
      timeHorizonYears: rvbHorizon,
    });
  }, [
    rvbHomePrice,
    rvbDownPaymentMode,
    rvbDownPayment,
    rvbDownPaymentPercent,
    rvbLoanRate,
    rvbTermNorm,
    rvbMonthlyRent,
    rvbRentIncrease,
    rvbPropApprec,
    rvbInvReturn,
    rvbHorizon,
    rvbUpfrontCostMode,
    rvbUpfrontCostValue,
    rvbOwnershipCostMode,
    rvbAnnualOwnershipCost,
    rvbSellingCostValue,
  ]);

  // ==========================================
  // 2. PARALLEL SIP OFFSET HOME LOAN CALCULATOR
  // ==========================================
  const [offHomePrice, setOffHomePrice] = useSessionState<number | ''>('off_home_price', '');
  const [offLoanAmount, setOffLoanAmount] = useSessionState<number | ''>('off_loan_amt', '');
  const [offLoanRate, setOffLoanRate] = useSessionState<number | ''>('off_loan_rate', '');
  const [offLoanRateHundred, setOffLoanRateHundred] = useSessionState<number | ''>('off_loan_rate_hundred', '');
  const [offLoanRateMode, setOffLoanRateMode] = useSessionState<'percentage_annual' | 'per_hundred_month'>('off_rate_mode', 'percentage_annual');
  const [offLoanTermYears, setOffLoanTermYears] = useSessionState<number | ''>('off_loan_term_yrs', '');
  const [offLoanTermMonths, setOffLoanTermMonths] = useSessionState<number | ''>('off_loan_term_mos', '');
  const [offSipAmount, setOffSipAmount] = useSessionState<number | ''>('off_sip_amt', '');
  const [offSipReturn, setOffSipReturn] = useSessionState<number | ''>('off_sip_return', 12);
  const [offStepUp, setOffStepUp] = useSessionState<number | ''>('off_step_up', 5);

  const resetOffsetLoan = () => {
    setOffHomePrice('');
    setOffLoanAmount('');
    setOffLoanRate('');
    setOffLoanRateHundred('');
    setOffLoanTermYears('');
    setOffLoanTermMonths('');
    setOffSipAmount('');
    setOffSipReturn(12);
    setOffStepUp(5);
  };

  const offTermNorm = React.useMemo(() => {
    return normalizeTerm({ years: offLoanTermYears, months: offLoanTermMonths });
  }, [offLoanTermYears, offLoanTermMonths]);

  const offsetResult = React.useMemo(() => {
    const loan = typeof offLoanAmount === 'number' && offLoanAmount > 0 ? offLoanAmount : typeof offHomePrice === 'number' ? offHomePrice * 0.8 : 0;
    if (
      loan <= 0 ||
      typeof offLoanRate !== 'number' || offLoanRate <= 0 ||
      !offTermNorm.isValid ||
      typeof offSipAmount !== 'number' || offSipAmount <= 0
    ) {
      return null;
    }
    return calculateInterestOffsetLoan({
      homePrice: typeof offHomePrice === 'number' ? offHomePrice : loan * 1.25,
      downPayment: typeof offHomePrice === 'number' ? Math.max(0, offHomePrice - loan) : loan * 0.25,
      loanAmount: loan,
      loanInterestRate: offLoanRate,
      loanTermYears: offTermNorm.totalYears,
      monthlySipAmount: offSipAmount,
      expectedSipReturnRate: typeof offSipReturn === 'number' ? offSipReturn : 12,
      sipStepUpPercent: typeof offStepUp === 'number' ? offStepUp : 0,
    });
  }, [offHomePrice, offLoanAmount, offLoanRate, offTermNorm, offSipAmount, offSipReturn, offStepUp]);

  // ==========================================
  // 3. HOME LOAN PREPAYMENT VS SIP CALCULATOR
  // ==========================================
  const [prepLoan, setPrepLoan] = useSessionState<number | ''>('prep_loan_amt', '');
  const [prepRate, setPrepRate] = useSessionState<number | ''>('prep_rate', '');
  const [prepRateHundred, setPrepRateHundred] = useSessionState<number | ''>('prep_rate_hundred', '');
  const [prepRateMode, setPrepRateMode] = useSessionState<'percentage_annual' | 'per_hundred_month'>('prep_rate_mode', 'percentage_annual');
  const [prepTenureYears, setPrepTenureYears] = useSessionState<number | ''>('prep_tenure_yrs', '');
  const [prepTenureMonths, setPrepTenureMonths] = useSessionState<number | ''>('prep_tenure_mos', '');
  const [prepSurplus, setPrepSurplus] = useSessionState<number | ''>('prep_surplus', '');
  const [prepSipReturn, setPrepSipReturn] = useSessionState<number | ''>('prep_sip_return', 12);

  const resetPrepaymentVsSip = () => {
    setPrepLoan('');
    setPrepRate('');
    setPrepRateHundred('');
    setPrepTenureYears('');
    setPrepTenureMonths('');
    setPrepSurplus('');
    setPrepSipReturn(12);
  };

  const prepTermNorm = React.useMemo(() => {
    return normalizeTerm({ years: prepTenureYears, months: prepTenureMonths });
  }, [prepTenureYears, prepTenureMonths]);

  const prepaymentResult = React.useMemo(() => {
    if (
      typeof prepLoan !== 'number' || prepLoan <= 0 ||
      typeof prepRate !== 'number' || prepRate <= 0 ||
      !prepTermNorm.isValid ||
      typeof prepSurplus !== 'number' || prepSurplus <= 0
    ) {
      return null;
    }
    return calculatePrepaymentVsSip({
      outstandingLoan: prepLoan,
      loanInterestRate: prepRate,
      remainingTenureMonths: prepTermNorm.totalMonths,
      monthlySurplus: prepSurplus,
      sipExpectedReturnRate: typeof prepSipReturn === 'number' ? prepSipReturn : 12,
    });
  }, [prepLoan, prepRate, prepTermNorm, prepSurplus, prepSipReturn]);

  // ------------------------------------------
  // RENDER SELECTION
  // ------------------------------------------
  if (toolSlug === 'rent-vs-buy-home-calculator' || toolSlug === 'rent-vs-buy-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-emerald-600" />
                Home Purchase & Rental Parameters
              </h2>
              <button
                type="button"
                onClick={resetRentVsBuy}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Home Purchase Price"
              value={rvbHomePrice}
              onChange={setRvbHomePrice}
              min={500000}
              max={50000000}
              step={50000}
              unitPrefix={currencySymbol}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-700">Down Payment</label>
                <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setRvbDownPaymentMode('amount')}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                      rvbDownPaymentMode === 'amount'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Amount ({currencySymbol})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRvbDownPaymentMode('percentage')}
                    className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                      rvbDownPaymentMode === 'percentage'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Percentage (%)
                  </button>
                </div>
              </div>
              {rvbDownPaymentMode === 'amount' ? (
                <NumberSliderInput
                  label="Down Payment Amount"
                  value={rvbDownPayment}
                  onChange={setRvbDownPayment}
                  min={0}
                  max={typeof rvbHomePrice === 'number' ? rvbHomePrice : 20000000}
                  step={25000}
                  unitPrefix={currencySymbol}
                  helperText="Initial cash out of pocket for property acquisition"
                />
              ) : (
                <NumberSliderInput
                  label="Down Payment Percentage"
                  value={rvbDownPaymentPercent}
                  onChange={setRvbDownPaymentPercent}
                  min={0}
                  max={100}
                  step={1}
                  unitSuffix="%"
                  helperText="Percentage of total home price (typically 20%)"
                />
              )}
            </div>

            <InterestRateInput
              label="Home Loan Interest Rate"
              annualRate={rvbLoanRate}
              perHundredRate={rvbLoanRateHundred}
              rateMode={rvbLoanRateMode}
              onChangeRateMode={setRvbLoanRateMode}
              onChangeAnnualRate={setRvbLoanRate}
              onChangePerHundredRate={setRvbLoanRateHundred}
              required
            />

            <TermInput
              id="rvb-loan-term"
              label="Loan Tenure"
              years={rvbLoanTermYears}
              months={rvbLoanTermMonths}
              onChangeYears={setRvbLoanTermYears}
              onChangeMonths={setRvbLoanTermMonths}
              helpText="Loan duration in years and months"
            />

            <NumberSliderInput
              label="Current Monthly Rent (Alternate Rental)"
              value={rvbMonthlyRent}
              onChange={setRvbMonthlyRent}
              min={5000}
              max={500000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                label="Annual Rent Growth (%)"
                value={rvbRentIncrease}
                onChange={setRvbRentIncrease}
                min={0}
                max={15}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="Property Appreciation (%)"
                value={rvbPropApprec}
                onChange={setRvbPropApprec}
                min={0}
                max={15}
                unitSuffix="%"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                label="Investment Return Rate (%)"
                value={rvbInvReturn}
                onChange={setRvbInvReturn}
                min={0}
                max={20}
                unitSuffix="%"
                helperText="Opportunity cost return"
              />
              <NumberSliderInput
                label="Analysis Horizon (Years)"
                value={rvbHorizon}
                onChange={setRvbHorizon}
                min={1}
                max={30}
                unitSuffix="Years"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Costs & Fees Assumptions</div>
              <div className="grid grid-cols-3 gap-3">
                <NumberSliderInput
                  label="Upfront Closing (%)"
                  value={rvbUpfrontCostValue}
                  onChange={setRvbUpfrontCostValue}
                  min={0}
                  max={12}
                  step={0.5}
                  unitSuffix="%"
                  helperText="Stamp duty, registration, fees"
                />
                <NumberSliderInput
                  label="Annual Ownership (%)"
                  value={rvbAnnualOwnershipCost}
                  onChange={setRvbAnnualOwnershipCost}
                  min={0}
                  max={5}
                  step={0.1}
                  unitSuffix="%"
                  helperText="Maintenance, property tax, insurance"
                />
                <NumberSliderInput
                  label="Future Selling Fee (%)"
                  value={rvbSellingCostValue}
                  onChange={setRvbSellingCostValue}
                  min={0}
                  max={10}
                  step={0.5}
                  unitSuffix="%"
                  helperText="Brokerage, liquidation expenses"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {rentVsBuyResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div
                className={`p-4 rounded-xl border ${
                  rentVsBuyResult.betterOption === 'buy'
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-blue-50/80 border-blue-200 text-blue-950'
                }`}
              >
                <div className="flex items-center justify-between gap-2 font-semibold text-base mb-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Verdict: {rentVsBuyResult.betterOption === 'buy' ? 'Buying Builds More Wealth' : 'Renting & Investing Builds More Wealth'}</span>
                  </div>
                  {rentVsBuyResult.breakEvenYear ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                      Break-even: Year {rentVsBuyResult.breakEvenYear}
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 shrink-0">
                      No Break-Even
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed mt-1">
                  Over {rvbHorizon} years, {rentVsBuyResult.betterOption === 'buy' ? 'buying and building property equity' : 'renting and investing capital in index/mutual funds'}{' '}
                  leads with <strong>{formatMoney(Math.abs(rentVsBuyResult.wealthDifference))}</strong> in projected net wealth advantage.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Buying Net Equity</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(rentVsBuyResult.netWealthBuying)}</div>
                  <div className="text-xs text-slate-500 mt-1">Home value minus loan & selling cost</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Renting Portfolio</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(rentVsBuyResult.netWealthRenting)}</div>
                  <div className="text-xs text-slate-500 mt-1">Down payment + monthly savings invested</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Monthly Home Loan EMI:</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(rentVsBuyResult.monthlyEMI)}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Current Monthly Rent:</span>
                  <div className="text-lg font-bold text-slate-900 mt-0.5">{formatMoney(typeof rvbMonthlyRent === 'number' ? rvbMonthlyRent : 0)}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Key Outflow Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Rent Paid Over {rvbHorizon} Yrs:</span>
                    <span className="font-semibold text-slate-900">{formatMoney(rentVsBuyResult.totalRentPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Buying Outflow (DP + EMI + Maint + Tax):</span>
                    <span className="font-semibold text-slate-900">{formatMoney(rentVsBuyResult.totalBuyingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Final Estimated Property Value:</span>
                    <span className="font-semibold text-emerald-700">{formatMoney(rentVsBuyResult.finalHomeValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Outstanding Mortgage at Year {rvbHorizon}:</span>
                    <span className="font-semibold text-slate-900">{formatMoney(rentVsBuyResult.outstandingLoanAtEnd)}</span>
                  </div>
                </div>
              </div>

              {/* Year-by-Year Milestone Table */}
              {rentVsBuyResult.yearlyComparison && rentVsBuyResult.yearlyComparison.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900">Milestone Timeline</h3>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">Year</th>
                          <th className="py-2.5 px-3">Home Value</th>
                          <th className="py-2.5 px-3">Loan Balance</th>
                          <th className="py-2.5 px-3 text-emerald-700">Buyer Equity</th>
                          <th className="py-2.5 px-3 text-blue-700">Renter Wealth</th>
                          <th className="py-2.5 px-3 text-right">Advantage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rentVsBuyResult.yearlyComparison.map((row) => {
                          const diff = row.buyingNetWealth - row.rentingNetWealth;
                          const buyerAhead = diff >= 0;
                          return (
                            <tr key={row.year} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-medium text-slate-900">Yr {row.year}</td>
                              <td className="py-2 px-3 text-slate-700">{formatMoney(row.homeValue)}</td>
                              <td className="py-2 px-3 text-slate-600">{formatMoney(row.outstandingLoan)}</td>
                              <td className="py-2 px-3 font-semibold text-emerald-700">{formatMoney(row.buyingNetWealth)}</td>
                              <td className="py-2 px-3 font-semibold text-blue-700">{formatMoney(row.rentingNetWealth)}</td>
                              <td className={`py-2 px-3 text-right font-medium ${buyerAhead ? 'text-emerald-700' : 'text-blue-700'}`}>
                                {buyerAhead ? `Buy +${formatMoney(diff)}` : `Rent +${formatMoney(Math.abs(diff))}`}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Home className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter purchase price, rent, and loan details</p>
              <p className="text-xs text-slate-500 mt-1">Strict empty inputs rule: enter required fields to see comparison</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (toolSlug === 'interest-free-home-loan-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-600" />
                Parallel SIP Offset Strategy
              </h2>
              <button
                type="button"
                onClick={resetOffsetLoan}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>Transparent Modeling Strategy:</strong> Bank home loans legally accrue interest. This tool models how running a disciplined parallel SIP alongside your home loan EMI creates investment returns that fully offset the total interest paid to the bank.
            </div>

            <NumberSliderInput
              label="Loan Amount Borrowed"
              value={offLoanAmount}
              onChange={setOffLoanAmount}
              min={500000}
              max={50000000}
              step={50000}
              unitPrefix={currencySymbol}
              required
            />

            <InterestRateInput
              label="Home Loan Interest Rate"
              annualRate={offLoanRate}
              perHundredRate={offLoanRateHundred}
              rateMode={offLoanRateMode}
              onChangeRateMode={setOffLoanRateMode}
              onChangeAnnualRate={setOffLoanRate}
              onChangePerHundredRate={setOffLoanRateHundred}
              required
            />

            <TermInput
              id="off-loan-term"
              label="Loan Tenure"
              years={offLoanTermYears}
              months={offLoanTermMonths}
              onChangeYears={setOffLoanTermYears}
              onChangeMonths={setOffLoanTermMonths}
              helpText="Loan duration in years and months"
            />

            <NumberSliderInput
              label="Monthly Parallel SIP Amount"
              value={offSipAmount}
              onChange={setOffSipAmount}
              min={1000}
              max={500000}
              step={500}
              unitPrefix={currencySymbol}
              helperText="Rule of thumb: 0.15% to 0.20% of loan amount (e.g. ₹7,500/mo on ₹50L loan)"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <NumberSliderInput
                label="Expected SIP Return Rate (%)"
                value={offSipReturn}
                onChange={setOffSipReturn}
                min={5}
                max={20}
                unitSuffix="%"
              />
              <NumberSliderInput
                label="Annual SIP Step-up (%)"
                value={offStepUp}
                onChange={setOffStepUp}
                min={0}
                max={15}
                unitSuffix="%"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {offsetResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div
                className={`p-4 rounded-xl border ${
                  offsetResult.isFullyOffset
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-base mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  {offsetResult.isFullyOffset
                    ? '100% Interest Offset Achieved!'
                    : `${offsetResult.interestOffsetPercentage}% Interest Offset Achieved`}
                </div>
                <p className="text-sm">
                  {offsetResult.isFullyOffset
                    ? `Your SIP gains (${formatMoney(offsetResult.sipGains)}) exceed your total home loan interest (${formatMoney(offsetResult.normalLoanInterest)}) by ${formatMoney(offsetResult.remainingInvestmentSurplus)}.`
                    : `Your SIP recovers ${formatMoney(offsetResult.interestOffsetAmount)} of your ${formatMoney(offsetResult.normalLoanInterest)} total loan interest.`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Monthly Loan EMI</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(offsetResult.monthlyEMI)}</div>
                  <div className="text-xs text-slate-500 mt-1">Tenure: {offTermNorm.totalYears} Years</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="text-xs font-semibold text-slate-500 uppercase">SIP Maturity Corpus</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{formatMoney(offsetResult.estimatedSipFutureValue)}</div>
                  <div className="text-xs text-slate-500 mt-1">Invested: {formatMoney(offsetResult.totalSipInvested)}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Balance Sheet Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Loan Principal:</span>
                    <span className="font-semibold text-slate-900">{typeof offLoanAmount === 'number' ? formatMoney(offLoanAmount) : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Loan Interest Paid to Bank:</span>
                    <span className="font-semibold text-rose-700">{formatMoney(offsetResult.normalLoanInterest)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200/80 pt-1.5 font-bold text-slate-900">
                    <span>Total Amount Paid to Bank (Principal + Interest):</span>
                    <span className="text-blue-900">
                      {typeof offLoanAmount === 'number' ? formatMoney(offLoanAmount + offsetResult.normalLoanInterest) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Profit Earned from SIP:</span>
                    <span className="font-semibold text-emerald-700">{formatMoney(offsetResult.sipGains)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Effective Net Interest Cost:</span>
                    <span className="font-semibold text-slate-900">{formatMoney(offsetResult.effectiveInterestCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Effective Net Cost of Home:</span>
                    <span className="font-semibold text-slate-900">{formatMoney(offsetResult.effectiveNetLoanCost)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Coins className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter loan amount and monthly SIP</p>
              <p className="text-xs text-slate-500 mt-1">Calculate how parallel investing offsets home loan borrowing costs</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Prepayment vs SIP
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Prepayment vs SIP Strategy
            </h2>
            <button
              type="button"
              onClick={resetPrepaymentVsSip}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <NumberSliderInput
            label="Outstanding Loan Balance"
            value={prepLoan}
            onChange={setPrepLoan}
            min={100000}
            max={50000000}
            step={50000}
            unitPrefix={currencySymbol}
            required
          />

          <InterestRateInput
            label="Loan Interest Rate"
            annualRate={prepRate}
            perHundredRate={prepRateHundred}
            rateMode={prepRateMode}
            onChangeRateMode={setPrepRateMode}
            onChangeAnnualRate={setPrepRate}
            onChangePerHundredRate={setPrepRateHundred}
            required
          />

          <TermInput
            id="prep-tenure"
            label="Remaining Loan Tenure"
            years={prepTenureYears}
            months={prepTenureMonths}
            onChangeYears={setPrepTenureYears}
            onChangeMonths={setPrepTenureMonths}
            helpText="Remaining loan tenure in years and months"
          />

          <NumberSliderInput
            label="Monthly Available Surplus Amount"
            value={prepSurplus}
            onChange={setPrepSurplus}
            min={1000}
            max={200000}
            step={500}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Expected SIP Return Rate (%)"
            value={prepSipReturn}
            onChange={setPrepSipReturn}
            min={6}
            max={18}
            unitSuffix="%"
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {prepaymentResult ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div
              className={`p-4 rounded-xl border ${
                prepaymentResult.recommendation === 'sip'
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                  : 'bg-blue-50/80 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-base mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Recommendation: {prepaymentResult.recommendation === 'sip' ? 'Invest in SIP' : 'Prepay Home Loan'}
              </div>
              <p className="text-sm">
                Investing your surplus generates <strong>{formatMoney(Math.abs(prepaymentResult.netDifference))}</strong>{' '}
                {prepaymentResult.recommendation === 'sip' ? 'more net wealth' : 'less net wealth compared to debt-free certainty'}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">Prepayment Path</div>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  Closes in {Math.round(prepaymentResult.prepaymentLoanClosureMonths / 12 * 10) / 10} yrs
                </div>
                <div className="text-xs text-emerald-700 mt-1">
                  Saves {formatMoney(prepaymentResult.prepaymentInterestSaved)} interest
                </div>
                <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/70 font-medium">
                  Total Loan Paid: {typeof prepLoan === 'number' ? formatMoney(prepLoan + prepaymentResult.prepaymentInterestPaid) : '—'}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="text-xs font-semibold text-slate-500 uppercase">SIP Path Corpus</div>
                <div className="text-lg font-bold text-emerald-700 mt-1">{formatMoney(prepaymentResult.sipFutureValue)}</div>
                <div className="text-xs text-slate-500 mt-1">Invested: {formatMoney(prepaymentResult.sipTotalInvested)}</div>
                <div className="text-[11px] text-slate-600 mt-2 pt-2 border-t border-slate-200/70 font-medium">
                  Total Loan Paid: {typeof prepLoan === 'number' ? formatMoney(prepLoan + prepaymentResult.originalInterestPayable) : '—'}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter loan balance and monthly surplus</p>
            <p className="text-xs text-slate-500 mt-1">Compare debt reduction vs equity wealth accumulation</p>
          </div>
        )}
      </div>
    </div>
  );
};
