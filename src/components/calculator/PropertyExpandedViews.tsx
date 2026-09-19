import React, { useState, useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import {
  calculatePropertyTax,
  calculateRentalYield,
  calculateHomeAffordability,
} from '../../engine/property';
import { DonutChart } from '../common/DonutChart';
import {
  Home,
  Building,
  Receipt,
  DollarSign,
  Percent,
  Calendar,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';

interface PropertyExpandedViewsProps {
  toolSlug: string;
}

export const PropertyExpandedViews: React.FC<PropertyExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // ==========================================
  // 1. PROPERTY TAX CALCULATOR
  // All inputs strictly default to empty strings per user requirement
  // ==========================================
  const [propTaxValue, setPropTaxValue] = useState<number | ''>('');
  const [propTaxRate, setPropTaxRate] = useState<number | ''>('');
  const [propTaxAssessmentRatio, setPropTaxAssessmentRatio] = useState<number | ''>('');
  const [countyTaxRate, setCountyTaxRate] = useState<number | ''>('');
  const [cityTaxRate, setCityTaxRate] = useState<number | ''>('');
  const [schoolTaxRate, setSchoolTaxRate] = useState<number | ''>('');

  const propertyTaxResult = useMemo(() => {
    if (typeof propTaxValue !== 'number' || propTaxValue <= 0) return null;
    return calculatePropertyTax({
      propertyValue: propTaxValue,
      assessmentRatioPercent: typeof propTaxAssessmentRatio === 'number' ? propTaxAssessmentRatio : 100,
      taxRatePercent: typeof propTaxRate === 'number' && propTaxRate > 0 ? propTaxRate : undefined,
      countyTaxPercent: typeof countyTaxRate === 'number' ? countyTaxRate : undefined,
      cityTaxPercent: typeof cityTaxRate === 'number' ? cityTaxRate : undefined,
      schoolTaxPercent: typeof schoolTaxRate === 'number' ? schoolTaxRate : undefined,
    });
  }, [propTaxValue, propTaxRate, propTaxAssessmentRatio, countyTaxRate, cityTaxRate, schoolTaxRate]);

  // ==========================================
  // 2. RENTAL YIELD CALCULATOR
  // All inputs strictly default to empty strings
  // ==========================================
  const [rentalPurchasePrice, setRentalPurchasePrice] = useState<number | ''>('');
  const [rentalMonthlyRent, setRentalMonthlyRent] = useState<number | ''>('');
  const [rentalMaintenance, setRentalMaintenance] = useState<number | ''>('');
  const [rentalInsurance, setRentalInsurance] = useState<number | ''>('');
  const [rentalPropTax, setRentalPropTax] = useState<number | ''>('');
  const [rentalMgmtPercent, setRentalMgmtPercent] = useState<number | ''>('');
  const [rentalVacancyPercent, setRentalVacancyPercent] = useState<number | ''>('');

  const rentalYieldResult = useMemo(() => {
    if (typeof rentalPurchasePrice !== 'number' || rentalPurchasePrice <= 0 || typeof rentalMonthlyRent !== 'number' || rentalMonthlyRent <= 0) {
      return null;
    }
    return calculateRentalYield({
      purchasePrice: rentalPurchasePrice,
      monthlyRent: rentalMonthlyRent,
      annualMaintenance: typeof rentalMaintenance === 'number' ? rentalMaintenance : 0,
      annualInsurance: typeof rentalInsurance === 'number' ? rentalInsurance : 0,
      annualPropertyTax: typeof rentalPropTax === 'number' ? rentalPropTax : 0,
      propertyManagementPercent: typeof rentalMgmtPercent === 'number' ? rentalMgmtPercent : 0,
      vacancyRatePercent: typeof rentalVacancyPercent === 'number' ? rentalVacancyPercent : 5,
    });
  }, [
    rentalPurchasePrice,
    rentalMonthlyRent,
    rentalMaintenance,
    rentalInsurance,
    rentalPropTax,
    rentalMgmtPercent,
    rentalVacancyPercent,
  ]);

  // ==========================================
  // 3. HOME AFFORDABILITY CALCULATOR
  // All inputs strictly default to empty strings
  // ==========================================
  const [affordAnnualIncome, setAffordAnnualIncome] = useState<number | ''>('');
  const [affordMonthlyDebts, setAffordMonthlyDebts] = useState<number | ''>('');
  const [affordDownPayment, setAffordDownPayment] = useState<number | ''>('');
  const [affordInterestRate, setAffordInterestRate] = useState<number | ''>('');
  const [affordLoanYears, setAffordLoanYears] = useState<number | ''>('');

  const affordabilityResult = useMemo(() => {
    if (typeof affordAnnualIncome !== 'number' || affordAnnualIncome <= 0) return null;
    return calculateHomeAffordability({
      annualGrossIncome: affordAnnualIncome,
      monthlyDebtPayments: typeof affordMonthlyDebts === 'number' ? affordMonthlyDebts : 0,
      downPaymentAvailable: typeof affordDownPayment === 'number' ? affordDownPayment : 0,
      interestRatePercent: typeof affordInterestRate === 'number' ? affordInterestRate : 6.5,
      loanTermYears: typeof affordLoanYears === 'number' && affordLoanYears > 0 ? affordLoanYears : 30,
    });
  }, [affordAnnualIncome, affordMonthlyDebts, affordDownPayment, affordInterestRate, affordLoanYears]);

  const handleResetPropertyTax = () => {
    setPropTaxValue('');
    setPropTaxRate('');
    setPropTaxAssessmentRatio('');
    setCountyTaxRate('');
    setCityTaxRate('');
    setSchoolTaxRate('');
  };

  const handleResetRentalYield = () => {
    setRentalPurchasePrice('');
    setRentalMonthlyRent('');
    setRentalMaintenance('');
    setRentalInsurance('');
    setRentalPropTax('');
    setRentalMgmtPercent('');
    setRentalVacancyPercent('');
  };

  const handleResetHomeAffordability = () => {
    setAffordAnnualIncome('');
    setAffordMonthlyDebts('');
    setAffordDownPayment('');
    setAffordInterestRate('');
    setAffordLoanYears('');
  };

  // --------------------------------------------------------------------------
  // RENDER: PROPERTY TAX CALCULATOR
  // --------------------------------------------------------------------------
  if (toolSlug === 'property-tax-calculator') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Property Valuation & Tax Parameters</h3>
                  <p className="text-xs text-slate-500">Enter your real estate property value and local tax rates</p>
                </div>
              </div>
              <button
                type="button"
                id="prop-tax-reset-btn"
                onClick={handleResetPropertyTax}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Property Assessed / Market Value ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                <input
                  type="number"
                  min="0"
                  value={propTaxValue}
                  onChange={(e) => setPropTaxValue(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 350000"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-base"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Enter the estimated home market value or certified tax assessment value.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Total Annual Tax Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={propTaxRate}
                    onChange={(e) => setPropTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1.25"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-base"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Average US rate is ~1.1% – 2.2% depending on state.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Assessment Ratio (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    value={propTaxAssessmentRatio}
                    onChange={(e) => setPropTaxAssessmentRatio(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-base"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Percentage of market value subject to municipal taxation.</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-3 uppercase tracking-wider">
                Optional: Custom Jurisdiction Split (%)
              </span>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">School (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={schoolTaxRate}
                    onChange={(e) => setSchoolTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 0.75"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">County (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={countyTaxRate}
                    onChange={(e) => setCountyTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 0.35"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">City / Town (%)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={cityTaxRate}
                    onChange={(e) => setCityTaxRate(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 0.20"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetPropertyTax}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Fields</span>
              </button>
            </div>
          </div>

          {/* Results Summary Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
                Annual Property Tax Bill
              </span>

              {propertyTaxResult ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(propertyTaxResult.annualTax, true)}
                    <span className="text-sm text-slate-400 font-normal ml-2">/ year</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Monthly Escrow</span>
                      <span className="text-base font-bold text-emerald-400">
                        {formatMoney(propertyTaxResult.monthlyTax, true)}
                      </span>
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Quarterly Due</span>
                      <span className="text-base font-bold text-white">
                        {formatMoney(propertyTaxResult.quarterlyTax, true)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80">
                    <span className="text-xs text-slate-400 block mb-3 font-semibold uppercase tracking-wider">
                      Tax Apportionment Distribution
                    </span>
                    <div className="space-y-2">
                      {propertyTaxResult.taxBreakdown.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-0">
                          <span className="text-slate-300 font-medium">{item.label}</span>
                          <span className="font-bold text-amber-300">{formatMoney(item.annualAmount, true)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Receipt className="w-12 h-12 mx-auto text-slate-600 mb-3 opacity-60" />
                  <p className="text-sm font-medium">Enter your property value on the left to calculate your annual property tax bill and escrow payments.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: RENTAL YIELD CALCULATOR
  // --------------------------------------------------------------------------
  if (toolSlug === 'rental-yield-calculator') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Rental Property Investment Financials</h3>
                  <p className="text-xs text-slate-500">Calculate Cap Rate, Gross Yield, and Net Operating Cash Flow</p>
                </div>
              </div>
              <button
                type="button"
                id="rental-yield-reset-btn"
                onClick={handleResetRentalYield}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Purchase Price / Property Value ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={rentalPurchasePrice}
                    onChange={(e) => setRentalPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 250000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Expected Monthly Rent ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={rentalMonthlyRent}
                    onChange={(e) => setRentalMonthlyRent(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1800"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-base"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-600 block mb-3 uppercase tracking-wider">
                Operating Expenses &amp; Vacancy Allowances (Annual)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Maintenance ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={rentalMaintenance}
                    onChange={(e) => setRentalMaintenance(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1500"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Insurance ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={rentalInsurance}
                    onChange={(e) => setRentalInsurance(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 900"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Property Tax ({currencySymbol})</label>
                  <input
                    type="number"
                    min="0"
                    value={rentalPropTax}
                    onChange={(e) => setRentalPropTax(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2400"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                <div>
                  <label className="block text-slate-600 mb-1">Management Fee (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={rentalMgmtPercent}
                    onChange={(e) => setRentalMgmtPercent(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 8"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Vacancy Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={rentalVacancyPercent}
                    onChange={(e) => setRentalVacancyPercent(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="5"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetRentalYield}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Fields</span>
              </button>
            </div>
          </div>

          {/* Results Summary Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                Net Rental Yield (Cap Rate)
              </span>

              {rentalYieldResult ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {rentalYieldResult.netRentalYieldPercent.toFixed(2)}%
                    <span className="text-sm text-slate-400 font-normal ml-2">
                      (Gross: {rentalYieldResult.grossRentalYieldPercent.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Monthly Cash Flow</span>
                      <span className="text-base font-bold text-emerald-400">
                        {formatMoney(rentalYieldResult.monthlyCashFlow, true)}
                      </span>
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Net Operating Income</span>
                      <span className="text-base font-bold text-white">
                        {formatMoney(rentalYieldResult.netOperatingIncome, true)} / yr
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Annual Gross Rent:</span>
                      <span className="font-bold text-white">{formatMoney(rentalYieldResult.annualGrossRent, true)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Annual Operating Expenses:</span>
                      <span className="font-bold text-rose-400">-{formatMoney(rentalYieldResult.annualOperatingExpenses, true)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Operating Expense Ratio:</span>
                      <span className="font-bold text-amber-300">{rentalYieldResult.expenseRatioPercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Building className="w-12 h-12 mx-auto text-slate-600 mb-3 opacity-60" />
                  <p className="text-sm font-medium">Enter purchase price and monthly rent to calculate your rental yield, capitalization rate, and monthly cash flow.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: HOME AFFORDABILITY CALCULATOR
  // --------------------------------------------------------------------------
  if (toolSlug === 'home-affordability-calculator') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Income &amp; Debt Affordability Criteria</h3>
                  <p className="text-xs text-slate-500">Based on standard banking 28/36 debt-to-income (DTI) underwriting rules</p>
                </div>
              </div>
              <button
                type="button"
                id="home-affordability-reset-btn"
                onClick={handleResetHomeAffordability}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Annual Gross Household Income ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={affordAnnualIncome}
                    onChange={(e) => setAffordAnnualIncome(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 95000"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Monthly Existing Debts ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                  <input
                    type="number"
                    min="0"
                    value={affordMonthlyDebts}
                    onChange={(e) => setAffordMonthlyDebts(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 450 (car, loans, cards)"
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Down Payment ({currencySymbol})
                </label>
                <input
                  type="number"
                  min="0"
                  value={affordDownPayment}
                  onChange={(e) => setAffordDownPayment(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={affordInterestRate}
                  onChange={(e) => setAffordInterestRate(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="6.5"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Term (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={affordLoanYears}
                  onChange={(e) => setAffordLoanYears(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="30"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-base"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleResetHomeAffordability}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Fields</span>
              </button>
            </div>
          </div>

          {/* Results Summary Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                Maximum Affordable Home Price
              </span>

              {affordabilityResult ? (
                <>
                  <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                    {formatMoney(affordabilityResult.maxAffordableHomePrice, true)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Max Monthly Payment</span>
                      <span className="text-base font-bold text-emerald-400">
                        {formatMoney(affordabilityResult.maxTotalMonthlyPayment, true)}
                      </span>
                    </div>
                    <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
                      <span className="text-slate-400 block mb-1">Max Loan Financed</span>
                      <span className="text-base font-bold text-white">
                        {formatMoney(affordabilityResult.maxLoanAmount, true)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Monthly Principal &amp; Interest:</span>
                      <span className="font-bold text-white">{formatMoney(affordabilityResult.monthlyPrincipalInterest, true)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Monthly Escrow (Tax &amp; Insurance):</span>
                      <span className="font-bold text-slate-300">{formatMoney(affordabilityResult.monthlyPropertyTax + affordabilityResult.monthlyInsurance, true)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Front-End DTI Ratio:</span>
                      <span className="font-bold text-cyan-300">{affordabilityResult.frontEndDtiAchieved.toFixed(1)}% / 28%</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Back-End DTI Ratio:</span>
                      <span className="font-bold text-indigo-300">{affordabilityResult.backEndDtiAchieved.toFixed(1)}% / 36%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-slate-400">
                  <Home className="w-12 h-12 mx-auto text-slate-600 mb-3 opacity-60" />
                  <p className="text-sm font-medium">Enter your annual household income to discover the maximum property price you can comfortably afford according to banking criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
