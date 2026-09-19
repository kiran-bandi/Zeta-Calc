import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  compareOldVsNewTaxRegimes,
  calculateHRAExemption,
  calculateCapitalGains,
  calculate44ADATax,
  calculate44ADTax,
} from '../../engine/taxEngines';
import { NumberSliderInput } from '../common/NumberSliderInput';
import {
  RotateCcw,
  Receipt,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
  Wallet,
  Scale,
  Building,
  Info,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface TaxExpandedViewsProps {
  toolSlug: string;
}

export const TaxExpandedViews: React.FC<TaxExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Regime Comparison & Income Tax States
  const [taxIncome, setTaxIncome] = useSessionState<number | ''>('tax_gross_income', '');
  const [tax80C, setTax80C] = useSessionState<number | ''>('tax_80c', '');
  const [tax80D, setTax80D] = useSessionState<number | ''>('tax_80d', '');
  const [taxHra, setTaxHra] = useSessionState<number | ''>('tax_hra_ded', '');
  const [taxHomeLoanInt, setTaxHomeLoanInt] = useSessionState<number | ''>('tax_hl_int', '');
  const [taxNps80CCD, setTaxNps80CCD] = useSessionState<number | ''>('tax_nps_ccd', '');
  const [selectedRegimeView, setSelectedRegimeView] = useSessionState<'new' | 'old'>('tax_selected_regime_view', 'new');

  // 2. HRA Exemption Calculator States
  const [hraBasic, setHraBasic] = useSessionState<number | ''>('hra_basic', '');
  const [hraReceived, setHraReceived] = useSessionState<number | ''>('hra_received', '');
  const [hraRentPaid, setHraRentPaid] = useSessionState<number | ''>('hra_rent_paid', '');
  const [hraIsMetro, setHraIsMetro] = useSessionState<boolean>('hra_is_metro', true);

  // 3. Capital Gains Tax States
  const [cgAssetType, setCgAssetType] = useSessionState<string>('cg_asset_type', 'listed_equity');
  const [cgBuyPrice, setCgBuyPrice] = useSessionState<number | ''>('cg_buy_price', '');
  const [cgSellPrice, setCgSellPrice] = useSessionState<number | ''>('cg_sell_price', '');
  const [cgHoldingMonths, setCgHoldingMonths] = useSessionState<number | ''>('cg_holding_months', '');

  // 4. Presumptive Taxation (44ADA / Freelancer / 44AD) States
  const [presumpGross, setPresumpGross] = useSessionState<number | ''>('presump_gross', '');
  const [presumpActualExp, setPresumpActualExp] = useSessionState<number | ''>('presump_actual_exp', '');
  const [presumpDigitalPct, setPresumpDigitalPct] = useSessionState<number | ''>('presump_digital_pct', 100);
  const [presumpRegime, setPresumpRegime] = useSessionState<'new' | 'old'>('presump_regime', 'new');

  const resetTaxRegimes = () => {
    setTaxIncome('');
    setTax80C('');
    setTax80D('');
    setTaxHra('');
    setTaxHomeLoanInt('');
    setTaxNps80CCD('');
  };

  const resetHRA = () => {
    setHraBasic('');
    setHraReceived('');
    setHraRentPaid('');
    setHraIsMetro(true);
  };

  const resetCapitalGains = () => {
    setCgBuyPrice('');
    setCgSellPrice('');
    setCgHoldingMonths('');
  };

  const resetPresumptive = () => {
    setPresumpGross('');
    setPresumpActualExp('');
    setPresumpDigitalPct(100);
  };

  // Calculations
  const taxComparisonResult = useMemo(() => {
    if (typeof taxIncome !== 'number' || taxIncome <= 0) return null;
    return compareOldVsNewTaxRegimes({
      annualGrossIncome: taxIncome,
      section80C: typeof tax80C === 'number' ? tax80C : 0,
      section80D: typeof tax80D === 'number' ? tax80D : 0,
      hraExemption: typeof taxHra === 'number' ? taxHra : 0,
      homeLoanInterest80EEA_24b: typeof taxHomeLoanInt === 'number' ? taxHomeLoanInt : 0,
      npsEmployerContribution80CCD2: typeof taxNps80CCD === 'number' ? taxNps80CCD : 0,
    });
  }, [taxIncome, tax80C, tax80D, taxHra, taxHomeLoanInt, taxNps80CCD]);

  const hraResult = useMemo(() => {
    if (
      typeof hraBasic !== 'number' || hraBasic <= 0 ||
      typeof hraReceived !== 'number' || hraReceived <= 0 ||
      typeof hraRentPaid !== 'number' || hraRentPaid <= 0
    ) {
      return null;
    }
    return calculateHRAExemption({
      basicSalaryMonthly: hraBasic,
      hraReceivedMonthly: hraReceived,
      rentPaidMonthly: hraRentPaid,
      isMetroCity: hraIsMetro,
    });
  }, [hraBasic, hraReceived, hraRentPaid, hraIsMetro]);

  const capitalGainsResult = useMemo(() => {
    if (
      !cgAssetType ||
      typeof cgBuyPrice !== 'number' || cgBuyPrice <= 0 ||
      typeof cgSellPrice !== 'number' || cgSellPrice <= 0 ||
      typeof cgHoldingMonths !== 'number' || cgHoldingMonths <= 0
    ) {
      return null;
    }
    return calculateCapitalGains({
      assetType: cgAssetType as any,
      purchasePrice: cgBuyPrice,
      salePrice: cgSellPrice,
      holdingPeriodMonths: cgHoldingMonths,
    });
  }, [cgAssetType, cgBuyPrice, cgSellPrice, cgHoldingMonths]);

  const presumptiveAdaResult = useMemo(() => {
    if (typeof presumpGross !== 'number' || presumpGross <= 0) return null;
    return calculate44ADATax({
      grossProfessionalReceipts: presumpGross,
      actualBusinessExpenses: typeof presumpActualExp === 'number' ? presumpActualExp : undefined,
      taxRegime: presumpRegime,
    });
  }, [presumpGross, presumpActualExp, presumpRegime]);

  const presumptiveAdResult = useMemo(() => {
    if (typeof presumpGross !== 'number' || presumpGross <= 0) return null;
    const digitalPct = typeof presumpDigitalPct === 'number' ? Math.min(100, Math.max(0, presumpDigitalPct)) : 100;
    const digitalTurnover = (presumpGross * digitalPct) / 100;
    const nonDigitalTurnover = presumpGross - digitalTurnover;
    return calculate44ADTax({
      digitalTurnover,
      nonDigitalTurnover,
    });
  }, [presumpGross, presumpDigitalPct]);

  // ------------------------------------------
  // 1. RENDER HRA EXEMPTION VIEW
  // ------------------------------------------
  if (toolSlug === 'hra-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">House Rent Allowance (HRA) Exemption Calculator</h3>
          </div>
          <button
            type="button"
            onClick={resetHRA}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <NumberSliderInput
                label="Monthly Basic Salary + DA"
                value={hraBasic}
                onChange={setHraBasic}
                min={10000}
                max={1000000}
                step={5000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 60000"
                required
              />

              <NumberSliderInput
                label="Monthly HRA Received from Employer"
                value={hraReceived}
                onChange={setHraReceived}
                min={2000}
                max={500000}
                step={2000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 25000"
                required
              />

              <NumberSliderInput
                label="Actual Monthly Rent Paid"
                value={hraRentPaid}
                onChange={setHraRentPaid}
                min={2000}
                max={500000}
                step={2000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 22000"
                required
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">City of Accommodation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHraIsMetro(true)}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all text-left ${
                      hraIsMetro
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Metro City (50%)</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">Delhi, Mumbai, Kolkata, Chennai</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHraIsMetro(false)}
                    className={`p-3 text-xs font-bold rounded-xl border transition-all text-left ${
                      !hraIsMetro
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold">Non-Metro City (40%)</div>
                    <div className="text-[11px] font-normal text-slate-500 mt-0.5">All other cities & towns</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {hraResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">HRA Tax Exempt Amount (Annual)</span>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">{formatMoney(hraResult.exemptHRAAnnual)}</div>
                  <div className="text-xs font-medium text-emerald-800 mt-1">
                    Exemption per month: <strong>{formatMoney(hraResult.exemptHRAMonthly)}/mo</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Taxable HRA (Annual)</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(hraResult.taxableHRAAnnual)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{formatMoney(hraResult.taxableHRAMonthly)}/mo</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Total HRA Received</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(hraResult.actualHRAReceivedAnnual)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Annual Total</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-800">Calculation Breakdown — Minimum of 3 Conditions (Sec 10(13A)):</div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">1. Actual Annual HRA Received</span>
                    <span className="font-semibold text-slate-900">{formatMoney(hraResult.calculationBreakdown.actualHraReceived)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">2. Rent Paid minus 10% of Basic Salary</span>
                    <span className="font-semibold text-slate-900">{formatMoney(hraResult.calculationBreakdown.rentPaidMinusTenPercentSalary)}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600">3. {hraIsMetro ? '50%' : '40%'} of Basic Salary Cap</span>
                    <span className="font-semibold text-slate-900">{formatMoney(hraResult.calculationBreakdown.salaryPercentageCap)}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Note: HRA exemption is exclusively available under the <strong>Old Tax Regime</strong>. Under the New Tax Regime (Section 115BAC), HRA is not exempt.
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Enter your monthly basic salary, HRA, and rent paid</p>
                <p className="text-xs text-slate-400 mt-1">Computes statutory Section 10(13A) tax exemption</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // 2. RENDER CAPITAL GAINS TAX VIEW
  // ------------------------------------------
  if (
    toolSlug === 'capital-gains-tax-calculator' ||
    toolSlug === 'ltcg-tax-calculator' ||
    toolSlug === 'stcg-tax-calculator'
  ) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Capital Gains Tax Calculator (Post-Budget 2024 Rates)</h3>
          </div>
          <button
            type="button"
            onClick={resetCapitalGains}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Asset Category</label>
                <select
                  value={cgAssetType}
                  onChange={(e) => setCgAssetType(e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="listed_equity">Listed Equity Shares & Equity Mutual Funds (12.5% LTCG / 20% STCG)</option>
                  <option value="real_estate">Real Estate & Immovable Property (12.5% LTCG / Slab STCG)</option>
                  <option value="unlisted_shares">Unlisted Shares / Private Equity (12.5% LTCG / Slab STCG)</option>
                  <option value="gold_jewellery">Gold & Precious Metals (12.5% LTCG / Slab STCG)</option>
                  <option value="debt_funds">Debt Mutual Funds (Taxed at Marginal Slab Rate)</option>
                </select>
              </div>

              <NumberSliderInput
                label="Purchase / Cost Price"
                value={cgBuyPrice}
                onChange={setCgBuyPrice}
                min={10000}
                max={50000000}
                step={10000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 500000"
                required
              />

              <NumberSliderInput
                label="Sale / Realization Price"
                value={cgSellPrice}
                onChange={setCgSellPrice}
                min={10000}
                max={100000000}
                step={25000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 900000"
                required
              />

              <NumberSliderInput
                label="Holding Period (Months)"
                value={cgHoldingMonths}
                onChange={setCgHoldingMonths}
                min={1}
                max={240}
                step={1}
                unitSuffix=" mos"
                placeholder="e.g. 18"
                required
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {capitalGainsResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Tax Payable (incl. 4% cess)</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      capitalGainsResult.gainType === 'LTCG' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {capitalGainsResult.gainType} ({capitalGainsResult.taxRateApplicable}%)
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">{formatMoney(capitalGainsResult.totalTaxPayable)}</div>
                  <div className="text-xs text-emerald-800 mt-1">
                    Tax Rate: {capitalGainsResult.taxRateApplicable}% + 4% Health & Education Cess
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Gross Capital Gain</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(capitalGainsResult.capitalGainAmount)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Before exemptions</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Post-Tax Realized Gains</div>
                    <div className="text-xl font-bold text-emerald-600 mt-1">{formatMoney(capitalGainsResult.postTaxNetGains)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Net profit in hand</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="font-bold text-slate-800">Tax Breakdown:</div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Exemption Allowed (Sec 112A)</span>
                    <span className="font-semibold text-slate-900">{formatMoney(capitalGainsResult.exemptionAllowed)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Net Taxable Gain</span>
                    <span className="font-semibold text-slate-900">{formatMoney(capitalGainsResult.taxableGain)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-600">Base Tax</span>
                    <span className="font-semibold text-slate-900">{formatMoney(capitalGainsResult.taxPayable)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Health & Education Cess (4%)</span>
                    <span className="font-semibold text-slate-900">{formatMoney(capitalGainsResult.cess)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Percent className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Enter purchase price, sale price, and holding months</p>
                <p className="text-xs text-slate-400 mt-1">Calculates LTCG/STCG taxes under the latest Union Budget rules</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // 3. RENDER SECTION 44ADA (FREELANCERS & PROFESSIONALS)
  // ------------------------------------------
  if (toolSlug === 'freelancer-tax-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Section 44ADA Presumptive Tax Calculator (Freelancers & Professionals)</h3>
          </div>
          <button
            type="button"
            onClick={resetPresumptive}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <NumberSliderInput
                label="Annual Gross Professional Receipts"
                value={presumpGross}
                onChange={setPresumpGross}
                min={100000}
                max={15000000}
                step={25000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 2500000"
                required
              />

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tax Regime to Apply</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPresumpRegime('new')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                      presumpRegime === 'new'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    New Tax Regime (Sec 115BAC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPresumpRegime('old')}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all text-center ${
                      presumpRegime === 'old'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Old Tax Regime
                  </button>
                </div>
              </div>

              <NumberSliderInput
                label="Estimated Actual Business Expenses (Optional - to compare)"
                value={presumpActualExp}
                onChange={setPresumpActualExp}
                min={0}
                max={5000000}
                step={25000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 300000 (Defaults to typical 20%)"
              />

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Who is eligible for Section 44ADA?</div>
                <p>Software consultants, developers, designers, lawyers, doctors, architects, accountants, and other specified professionals with gross receipts up to ₹75 Lakhs.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {presumptiveAdaResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Tax You Have to Pay</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      presumptiveAdaResult.isEligibleUnder44ADA ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {presumptiveAdaResult.isEligibleUnder44ADA ? 'Eligible for 44ADA' : 'Exceeds ₹75L Limit'}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">{formatMoney(presumptiveAdaResult.taxPayable)}</div>
                  <div className="text-xs font-medium text-emerald-800 mt-1">
                    Tax on 50% Presumptive Profit ({formatMoney(presumptiveAdaResult.presumptiveIncome50Percent)})
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Presumptive Profit (50%)</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(presumptiveAdaResult.presumptiveIncome50Percent)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">50% declared profit</div>
                  </div>
                  <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                    <div className="text-xs font-semibold text-emerald-800 uppercase">Net In-Hand Earnings</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">
                      {formatMoney(presumptiveAdaResult.grossReceipts - presumptiveAdaResult.taxPayable)}
                    </div>
                    <div className="text-xs text-emerald-800 mt-0.5">Gross receipts minus tax</div>
                  </div>
                </div>

                {presumptiveAdaResult.taxSavingsVsRegularBookkeeping > 0 && (
                  <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-teal-800 uppercase">Tax Savings vs Regular Accounting</div>
                      <div className="text-xs text-teal-700 mt-0.5">Saved by presuming 50% profit instead of lower declared expenses</div>
                    </div>
                    <div className="text-xl font-extrabold text-teal-700">
                      {formatMoney(presumptiveAdaResult.taxSavingsVsRegularBookkeeping)}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Key Statutory Perks of Section 44ADA:
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No Maintenance of Books:</strong> Exempt from maintaining detailed accounting books under Section 44AA.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>No Tax Audit:</strong> No need for mandatory CA audit under Section 44AB.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Single Advance Tax Installment:</strong> Pay 100% advance tax in one go by March 15th instead of 4 quarterly installments.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Scale className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Enter your annual gross professional receipts</p>
                <p className="text-xs text-slate-400 mt-1">Calculates 50% presumptive profit and income tax liability</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // 4. RENDER SECTION 44AD (SMALL BUSINESSES)
  // ------------------------------------------
  if (toolSlug === 'section-44ad-calculator') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Section 44AD Presumptive Taxation (Small Businesses)</h3>
          </div>
          <button
            type="button"
            onClick={resetPresumptive}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <NumberSliderInput
                label="Total Annual Turnover / Gross Receipts"
                value={presumpGross}
                onChange={setPresumpGross}
                min={500000}
                max={35000000}
                step={50000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 10000000"
                required
              />

              <NumberSliderInput
                label="Digital / Banking Receipts Percentage (%)"
                value={presumpDigitalPct}
                onChange={setPresumpDigitalPct}
                min={0}
                max={100}
                step={1}
                unitSuffix="%"
                placeholder="100"
                required
              />

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800">Statutory Tax Rates:</div>
                <div className="flex justify-between">
                  <span>Digital / Bank / UPI Turnover:</span>
                  <span className="font-bold text-emerald-700">6% deemed profit</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash / Non-Digital Turnover:</span>
                  <span className="font-bold text-amber-700">8% deemed profit</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  Threshold limit: ₹2 Crore (raised to ₹3 Crore if cash receipts are ≤ 5%).
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-5">
            {presumptiveAdResult ? (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Total Tax You Have to Pay</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      presumptiveAdResult.isEligibleUnder44AD ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {presumptiveAdResult.isEligibleUnder44AD ? 'Eligible for 44AD' : 'Turnover Exceeds Limit'}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-700 mt-1">{formatMoney(presumptiveAdResult.taxPayable)}</div>
                  <div className="text-xs font-medium text-emerald-800 mt-1">
                    Calculated on Deemed Profit of {formatMoney(presumptiveAdResult.presumptiveIncome)} (Effective Profit Rate: {presumptiveAdResult.effectiveProfitRate}%)
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Presumptive Business Profit</div>
                    <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(presumptiveAdResult.presumptiveIncome)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{presumptiveAdResult.effectiveProfitRate}% of turnover</div>
                  </div>
                  <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                    <div className="text-xs font-semibold text-emerald-800 uppercase">Net Retained Earnings</div>
                    <div className="text-xl font-bold text-emerald-700 mt-1">
                      {formatMoney(presumptiveAdResult.totalTurnover - presumptiveAdResult.taxPayable)}
                    </div>
                    <div className="text-xs text-emerald-800 mt-0.5">Turnover minus tax</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Key Statutory Perks of Section 44AD:
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Exempt from Books & Audit:</strong> No balance sheets or P&L audits required under Sections 44AA and 44AB.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Digital Incentive:</strong> Pay tax on 2% lower profit (6% vs 8%) on all digital receipts.</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
                <Building className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold">Enter your annual gross business turnover</p>
                <p className="text-xs text-slate-400 mt-1">Computes Section 44AD presumptive profit at 6% (digital) and 8% (cash)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // 5. RENDER OLD VS NEW TAX REGIME & BREAK-EVEN VIEW
  // ------------------------------------------
  const chosenRegime = selectedRegimeView === 'new' ? taxComparisonResult?.newRegime : taxComparisonResult?.oldRegime;
  const alternateRegime = selectedRegimeView === 'new' ? taxComparisonResult?.oldRegime : taxComparisonResult?.newRegime;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            {toolSlug === 'tax-regime-breakeven-calculator'
              ? 'Tax Regime Break-Even Calculator (Old vs New FY 2024-25)'
              : 'Old vs New Tax Regime Calculator (Complete Tax Liability & Savings)'}
          </h3>
        </div>
        <button
          type="button"
          onClick={resetTaxRegimes}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2.5 py-1 rounded-md hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Income Parameters</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                FY 2024-25 (AY 2025-26)
              </span>
            </div>

            <NumberSliderInput
              label="Gross Annual Salary / Income"
              value={taxIncome}
              onChange={setTaxIncome}
              min={300000}
              max={10000000}
              step={25000}
              unitPrefix={currencySymbol}
              placeholder="e.g. 1500000"
              required
            />

            <div className="pt-3 border-t border-slate-100 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deductions (Claimed in Old Regime)
                </span>
                <span className="text-[11px] text-slate-400">Chapter VI-A</span>
              </div>

              <NumberSliderInput
                label="Section 80C (PPF, EPF, ELSS, Life Insurance - Max ₹1.5L)"
                value={tax80C}
                onChange={setTax80C}
                min={0}
                max={150000}
                step={5000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 150000"
              />

              <NumberSliderInput
                label="Section 80D (Health Insurance Premium - Max ₹75k)"
                value={tax80D}
                onChange={setTax80D}
                min={0}
                max={100000}
                step={2500}
                unitPrefix={currencySymbol}
                placeholder="e.g. 25000"
              />

              <NumberSliderInput
                label="HRA Exemption Claimed (Rent Allowance)"
                value={taxHra}
                onChange={setTaxHra}
                min={0}
                max={500000}
                step={5000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 120000"
              />

              <NumberSliderInput
                label="Home Loan Interest Sec 24(b) (Max ₹2L)"
                value={taxHomeLoanInt}
                onChange={setTaxHomeLoanInt}
                min={0}
                max={200000}
                step={5000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 200000"
              />

              <NumberSliderInput
                label="NPS Additional Sec 80CCD(1B) (Max ₹50k)"
                value={taxNps80CCD}
                onChange={setTaxNps80CCD}
                min={0}
                max={50000}
                step={5000}
                unitPrefix={currencySymbol}
                placeholder="e.g. 50000"
              />
            </div>
          </div>
        </div>

        {/* Right Output Column */}
        <div className="lg:col-span-7 space-y-6">
          {taxComparisonResult ? (
            <div className="space-y-6">
              {/* Recommendation & Savings Callout */}
              <div
                className={`p-5 rounded-2xl border ${
                  taxComparisonResult.recommendedRegime === 'new'
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-950'
                    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 text-blue-950'
                } shadow-xs`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>
                      Recommended:{' '}
                      {taxComparisonResult.recommendedRegime === 'new'
                        ? 'New Tax Regime (Section 115BAC)'
                        : 'Old Tax Regime'}
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 border border-current shadow-xs">
                    {taxComparisonResult.recommendedRegime === 'new' ? 'Default Regime' : 'Exemption Filer'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {taxComparisonResult.taxSaved > 0 ? (
                    <>
                      By choosing the{' '}
                      <strong>{taxComparisonResult.recommendedRegime === 'new' ? 'New' : 'Old'} Regime</strong>, you save{' '}
                      <strong className="text-emerald-700 text-base">{formatMoney(taxComparisonResult.taxSaved)}</strong> in annual tax (
                      <strong>{formatMoney(Math.round(taxComparisonResult.taxSaved / 12))}/month</strong> extra in your pocket).
                    </>
                  ) : (
                    <>Both tax regimes result in an identical tax liability for your income and deductions profile.</>
                  )}
                </div>
              </div>

              {/* TWO PROMINENT REGIME COMPARISON CARDS (How much they have to pay) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Regime Card */}
                <div
                  onClick={() => setSelectedRegimeView('new')}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                    selectedRegimeView === 'new'
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">New Tax Regime</span>
                    {taxComparisonResult.recommendedRegime === 'new' && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Saves {formatMoney(taxComparisonResult.taxSaved)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">Total Tax You Have to Pay:</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {formatMoney(taxComparisonResult.newRegime.totalTaxPayable)}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly In-Hand:</span>
                      <span className="font-bold text-emerald-700">
                        {formatMoney(taxComparisonResult.newRegime.takeHomeMonthly)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Take-Home:</span>
                      <span className="font-semibold text-slate-800">
                        {formatMoney(taxComparisonResult.newRegime.takeHomeAnnual)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Effective Tax Rate:</span>
                      <span className="font-semibold text-slate-800">
                        {taxComparisonResult.newRegime.effectiveTaxRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Std. Deduction:</span>
                      <span>₹75,000 (Built-in)</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className={`text-[11px] font-bold ${
                      selectedRegimeView === 'new' ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {selectedRegimeView === 'new' ? '✓ Showing New Regime Details' : 'Click to View New Regime Math'}
                    </span>
                  </div>
                </div>

                {/* Old Regime Card */}
                <div
                  onClick={() => setSelectedRegimeView('old')}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all ${
                    selectedRegimeView === 'old'
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Old Tax Regime</span>
                    {taxComparisonResult.recommendedRegime === 'old' && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Saves {formatMoney(taxComparisonResult.taxSaved)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">Total Tax You Have to Pay:</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                    {formatMoney(taxComparisonResult.oldRegime.totalTaxPayable)}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Monthly In-Hand:</span>
                      <span className="font-bold text-emerald-700">
                        {formatMoney(taxComparisonResult.oldRegime.takeHomeMonthly)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Annual Take-Home:</span>
                      <span className="font-semibold text-slate-800">
                        {formatMoney(taxComparisonResult.oldRegime.takeHomeAnnual)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Effective Tax Rate:</span>
                      <span className="font-semibold text-slate-800">
                        {taxComparisonResult.oldRegime.effectiveTaxRate}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                      <span>Total Deductions:</span>
                      <span>{formatMoney(taxComparisonResult.oldRegime.totalDeductions)}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <span className={`text-[11px] font-bold ${
                      selectedRegimeView === 'old' ? 'text-emerald-700' : 'text-slate-500'
                    }`}>
                      {selectedRegimeView === 'old' ? '✓ Showing Old Regime Details' : 'Click to View Old Regime Math'}
                    </span>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE "IF YOU SELECT" REGIME DETAIL SECTION */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    If You Select {selectedRegimeView === 'new' ? 'New Tax Regime (Sec 115BAC)' : 'Old Tax Regime'}
                  </div>
                  <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSelectedRegimeView('new')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        selectedRegimeView === 'new'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      New Regime
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedRegimeView('old')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        selectedRegimeView === 'old'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Old Regime
                    </button>
                  </div>
                </div>

                {chosenRegime && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="text-xs text-slate-500">Tax Liability Under Selected Regime:</div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {formatMoney(chosenRegime.totalTaxPayable)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Monthly In-Hand Salary:</div>
                        <div className="text-2xl font-extrabold text-emerald-700">
                          {formatMoney(chosenRegime.takeHomeMonthly)}/mo
                        </div>
                      </div>
                    </div>

                    {/* Slab-by-Slab Calculation Table */}
                    <div>
                      <div className="text-xs font-bold text-slate-700 mb-2">
                        Slab-by-Slab Tax Calculation ({selectedRegimeView === 'new' ? 'New Regime Slabs' : 'Old Regime Slabs'}):
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Income Slab</th>
                              <th className="py-2.5 px-3">Tax Rate</th>
                              <th className="py-2.5 px-3">Taxable in Slab</th>
                              <th className="py-2.5 px-3 text-right">Tax in Slab</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {chosenRegime.slabBreakdown.map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 text-slate-800 font-medium">{s.bracket || s.slab}</td>
                                <td className="py-2 px-3 text-slate-600">{s.rate}</td>
                                <td className="py-2 px-3 text-slate-600">{formatMoney(s.taxableInSlab ?? 0)}</td>
                                <td className="py-2 px-3 text-slate-900 font-semibold text-right">{formatMoney(s.taxInSlab ?? s.tax ?? 0)}</td>
                              </tr>
                            ))}
                            {chosenRegime.section87ARebate > 0 && (
                              <tr className="bg-emerald-50/50 text-emerald-800 font-medium">
                                <td colSpan={3} className="py-2 px-3">Less: Section 87A Tax Rebate</td>
                                <td className="py-2 px-3 text-right font-bold text-emerald-700">
                                  -{formatMoney(chosenRegime.section87ARebate)}
                                </td>
                              </tr>
                            )}
                            {(chosenRegime.cess ?? chosenRegime.healthAndEducationCess ?? 0) > 0 && (
                              <tr className="text-slate-600">
                                <td colSpan={3} className="py-2 px-3">Add: Health & Education Cess (4%)</td>
                                <td className="py-2 px-3 text-right font-semibold text-slate-800">
                                  +{formatMoney(chosenRegime.cess ?? chosenRegime.healthAndEducationCess ?? 0)}
                                </td>
                              </tr>
                            )}
                            <tr className="bg-slate-50 font-bold text-slate-900">
                              <td colSpan={3} className="py-2.5 px-3">Total Tax to Pay ({selectedRegimeView === 'new' ? 'New' : 'Old'} Regime)</td>
                              <td className="py-2.5 px-3 text-right text-sm text-emerald-700">
                                {formatMoney(chosenRegime.totalTaxPayable)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* COMPLETE SIDE-BY-SIDE COMPARISON TABLE */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Side-by-Side Regime Comparison
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Particulars</th>
                        <th className="py-2.5 px-3 text-right">New Tax Regime</th>
                        <th className="py-2.5 px-3 text-right">Old Tax Regime</th>
                        <th className="py-2.5 px-3 text-right">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2 px-3 text-slate-700">Gross Annual Income</td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          {formatMoney(taxComparisonResult.newRegime.grossIncome ?? taxComparisonResult.newRegime.grossSalary ?? 0)}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          {formatMoney(taxComparisonResult.oldRegime.grossIncome ?? taxComparisonResult.oldRegime.grossSalary ?? 0)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-400">—</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-700">Standard Deduction</td>
                        <td className="py-2 px-3 text-right text-emerald-700 font-semibold">
                          {formatMoney(taxComparisonResult.newRegime.standardDeduction ?? 75000)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-700 font-semibold">
                          {formatMoney(taxComparisonResult.oldRegime.standardDeduction ?? 50000)}
                        </td>
                        <td className="py-2 px-3 text-right text-emerald-700">
                          +₹{Math.abs((taxComparisonResult.newRegime.standardDeduction ?? 75000) - (taxComparisonResult.oldRegime.standardDeduction ?? 50000)).toLocaleString('en-IN')} (New)
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-700">Other Deductions (80C, 80D, HRA, Home Loan)</td>
                        <td className="py-2 px-3 text-right text-slate-400">
                          {(taxComparisonResult.newRegime.otherDeductions ?? 0) > 0
                            ? formatMoney(taxComparisonResult.newRegime.otherDeductions)
                            : 'Not Allowed'}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          {formatMoney(
                            taxComparisonResult.oldRegime.otherDeductions ??
                            Math.max(0, taxComparisonResult.oldRegime.totalDeductions - (taxComparisonResult.oldRegime.standardDeduction ?? 50000))
                          )}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-700 font-semibold">
                          +{formatMoney(
                            taxComparisonResult.oldRegime.otherDeductions ??
                            Math.max(0, taxComparisonResult.oldRegime.totalDeductions - (taxComparisonResult.oldRegime.standardDeduction ?? 50000))
                          )} (Old)
                        </td>
                      </tr>
                      <tr className="bg-slate-50/50 font-semibold text-slate-800">
                        <td className="py-2 px-3">Total Deductions Claimed</td>
                        <td className="py-2 px-3 text-right text-slate-900">{formatMoney(taxComparisonResult.newRegime.totalDeductions)}</td>
                        <td className="py-2 px-3 text-right text-slate-900">{formatMoney(taxComparisonResult.oldRegime.totalDeductions)}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-700">
                          {formatMoney(Math.abs(taxComparisonResult.oldRegime.totalDeductions - taxComparisonResult.newRegime.totalDeductions))}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-700">Net Taxable Income</td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          {formatMoney(taxComparisonResult.newRegime.netTaxableIncome ?? taxComparisonResult.newRegime.taxableIncome ?? 0)}
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900">
                          {formatMoney(taxComparisonResult.oldRegime.netTaxableIncome ?? taxComparisonResult.oldRegime.taxableIncome ?? 0)}
                        </td>
                        <td className="py-2 px-3 text-right text-slate-500">
                          {formatMoney(Math.abs(
                            (taxComparisonResult.newRegime.netTaxableIncome ?? taxComparisonResult.newRegime.taxableIncome ?? 0) -
                            (taxComparisonResult.oldRegime.netTaxableIncome ?? taxComparisonResult.oldRegime.taxableIncome ?? 0)
                          ))}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-bold text-slate-900">
                        <td className="py-2.5 px-3">👉 TOTAL TAX TO PAY</td>
                        <td className={`py-2.5 px-3 text-right text-sm ${
                          taxComparisonResult.recommendedRegime === 'new' ? 'text-emerald-700 font-extrabold' : 'text-slate-900'
                        }`}>
                          {formatMoney(taxComparisonResult.newRegime.totalTaxPayable)}
                        </td>
                        <td className={`py-2.5 px-3 text-right text-sm ${
                          taxComparisonResult.recommendedRegime === 'old' ? 'text-emerald-700 font-extrabold' : 'text-slate-900'
                        }`}>
                          {formatMoney(taxComparisonResult.oldRegime.totalTaxPayable)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">
                          {taxComparisonResult.taxSaved > 0
                            ? `${formatMoney(taxComparisonResult.taxSaved)} saved`
                            : 'Nil difference'}
                        </td>
                      </tr>
                      <tr className="bg-emerald-50/40 font-semibold text-slate-800">
                        <td className="py-2.5 px-3">👉 MONTHLY IN-HAND SALARY</td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                          {formatMoney(taxComparisonResult.newRegime.takeHomeMonthly)}/mo
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">
                          {formatMoney(taxComparisonResult.oldRegime.takeHomeMonthly)}/mo
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                          {formatMoney(Math.round(taxComparisonResult.taxSaved / 12))}/mo
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 text-slate-600">Effective Tax Rate</td>
                        <td className="py-2 px-3 text-right text-slate-800">{taxComparisonResult.newRegime.effectiveTaxRate}%</td>
                        <td className="py-2 px-3 text-right text-slate-800">{taxComparisonResult.oldRegime.effectiveTaxRate}%</td>
                        <td className="py-2 px-3 text-right text-slate-500">
                          {Math.abs(Number((taxComparisonResult.newRegime.effectiveTaxRate - taxComparisonResult.oldRegime.effectiveTaxRate).toFixed(2)))}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* BREAK-EVEN ANALYSIS CARD */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <span>Break-Even Deductions Analysis:</span>
                </div>
                <p className="leading-relaxed">
                  To match the New Tax Regime&apos;s lower rates, you need total deductions of at least{' '}
                  <strong className="text-slate-900 font-bold">{formatMoney(taxComparisonResult.breakEvenDeductionsRequired)}</strong>{' '}
                  under the Old Regime.
                </p>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 mt-2">
                  <span className="text-slate-600">Your Current Eligible Deductions (Old Regime):</span>
                  <span className="font-bold text-slate-900">{formatMoney(taxComparisonResult.oldRegime.totalDeductions)}</span>
                </div>
                {taxComparisonResult.oldRegime.totalDeductions < taxComparisonResult.breakEvenDeductionsRequired ? (
                  <div className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    You need <strong>{formatMoney(taxComparisonResult.breakEvenDeductionsRequired - taxComparisonResult.oldRegime.totalDeductions)}</strong> more in eligible deductions (via HRA, 80C, 80D, or Home Loan) for the Old Regime to beat the New Regime.
                  </div>
                ) : (
                  <div className="text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    Your deductions exceed the break-even threshold by <strong>{formatMoney(taxComparisonResult.oldRegime.totalDeductions - taxComparisonResult.breakEvenDeductionsRequired)}</strong>, making the Old Regime the more tax-efficient choice for you!
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Enter your gross annual income</p>
              <p className="text-xs text-slate-400 mt-1">
                Computes exact tax to pay under Old vs New regime, monthly take-home, and tax savings
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
