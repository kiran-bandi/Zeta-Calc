import React, { useMemo } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import {
  calculateGST,
  calculateMargins,
  calculateBreakEven,
  calculateWorkingCapital,
  calculateCashConversionCycle,
  calculateBurnRate,
  calculateDSCR,
  calculateRevenueGrowth,
  calculateRevenue,
  calculateMarkup,
  calculateContributionMargin,
  calculateBusinessValuation,
  calculateInventoryTurnover,
  calculateReceivablesTurnover,
  calculatePayablesTurnover,
  calculatePricing,
  calculateTargetProfit,
} from '../../engine/businessFinance';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { InterestRateInput } from '../common/InterestRateInput';
import { RotateCcw, Building2, CheckCircle2, TrendingUp, DollarSign, Activity, Percent, ArrowRightLeft, Target } from 'lucide-react';

interface BusinessFinanceExpandedViewsProps {
  toolSlug: string;
}

export const BusinessFinanceExpandedViews: React.FC<BusinessFinanceExpandedViewsProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. GST Calculator States
  const [gstAmount, setGstAmount] = useSessionState<number | ''>('gst_amount', '');
  const [gstRate, setGstRate] = useSessionState<number>('gst_rate', 18);
  const [gstType, setGstType] = useSessionState<'add_gst' | 'remove_gst'>('gst_type', 'add_gst');
  const [gstIsInterstate, setGstIsInterstate] = useSessionState<boolean>('gst_is_interstate', false);

  // 2. Margins & Markup States
  const [marginRev, setMarginRev] = useSessionState<number | ''>('margin_rev', '');
  const [marginCogs, setMarginCogs] = useSessionState<number | ''>('margin_cogs', '');
  const [marginOpex, setMarginOpex] = useSessionState<number | ''>('margin_opex', '');
  const [marginTax, setMarginTax] = useSessionState<number | ''>('margin_tax', '');

  // 3. Break-Even States
  const [beFixed, setBeFixed] = useSessionState<number | ''>('be_fixed', '');
  const [bePrice, setBePrice] = useSessionState<number | ''>('be_price', '');
  const [beVarCost, setBeVarCost] = useSessionState<number | ''>('be_var_cost', '');

  // 4. Working Capital & Ratios States
  const [wcAssets, setWcAssets] = useSessionState<number | ''>('wc_assets', '');
  const [wcLiab, setWcLiab] = useSessionState<number | ''>('wc_liab', '');
  const [wcInv, setWcInv] = useSessionState<number | ''>('wc_inv', '');
  const [wcPrepaid, setWcPrepaid] = useSessionState<number | ''>('wc_prepaid', '');

  // 5. Burn Rate & Runway States
  const [burnCash, setBurnCash] = useSessionState<number | ''>('burn_cash', '');
  const [burnRev, setBurnRev] = useSessionState<number | ''>('burn_rev', '');
  const [burnExp, setBurnExp] = useSessionState<number | ''>('burn_exp', '');

  // 6. DSCR States
  const [dscrNoi, setDscrNoi] = useSessionState<number | ''>('dscr_noi', '');
  const [dscrPrincipal, setDscrPrincipal] = useSessionState<number | ''>('dscr_principal', '');
  const [dscrInterest, setDscrInterest] = useSessionState<number | ''>('dscr_interest', '');

  // 7. Revenue States
  const [revQty, setRevQty] = useSessionState<number | ''>('rev_qty', '');
  const [revPrice, setRevPrice] = useSessionState<number | ''>('rev_price', '');

  // 8. Markup Direct States
  const [markupDirectCost, setMarkupDirectCost] = useSessionState<number | ''>('markup_direct_cost', '');
  const [markupDirectPrice, setMarkupDirectPrice] = useSessionState<number | ''>('markup_direct_price', '');

  // 9. Contribution Margin States
  const [cmRevenue, setCmRevenue] = useSessionState<number | ''>('cm_revenue', '');
  const [cmVarCosts, setCmVarCosts] = useSessionState<number | ''>('cm_var_costs', '');
  const [cmQty, setCmQty] = useSessionState<number | ''>('cm_qty', '');

  // 10. Business Valuation States
  const [valMethod, setValMethod] = useSessionState<'revenue_multiple' | 'ebitda_multiple' | 'earnings_multiple'>('val_method', 'revenue_multiple');
  const [valMetricValue, setValMetricValue] = useSessionState<number | ''>('val_metric_val', '');
  const [valMultiple, setValMultiple] = useSessionState<number | ''>('val_multiple', '');

  // 11. Inventory Turnover States
  const [invCogs, setInvCogs] = useSessionState<number | ''>('inv_cogs', '');
  const [invAvgInventory, setInvAvgInventory] = useSessionState<number | ''>('inv_avg_inventory', '');
  const [invDays, setInvDays] = useSessionState<number>('inv_days', 365);

  // 12. Receivables Turnover States
  const [recCreditSales, setRecCreditSales] = useSessionState<number | ''>('rec_credit_sales', '');
  const [recAvgAr, setRecAvgAr] = useSessionState<number | ''>('rec_avg_ar', '');
  const [recDays, setRecDays] = useSessionState<number>('rec_days', 365);

  // 13. Payables Turnover States
  const [payCreditPurchases, setPayCreditPurchases] = useSessionState<number | ''>('pay_credit_purchases', '');
  const [payAvgAp, setPayAvgAp] = useSessionState<number | ''>('pay_avg_ap', '');
  const [payDays, setPayDays] = useSessionState<number>('pay_days', 365);

  // 14. Cash Conversion Cycle (CCC) States
  const [cccDio, setCccDio] = useSessionState<number | ''>('ccc_dio', '');
  const [cccDso, setCccDso] = useSessionState<number | ''>('ccc_dso', '');
  const [cccDpo, setCccDpo] = useSessionState<number | ''>('ccc_dpo', '');

  // 15. Pricing States
  const [priceCost, setPriceCost] = useSessionState<number | ''>('price_cost', '');
  const [priceTargetMargin, setPriceTargetMargin] = useSessionState<number | ''>('price_target_margin', '');

  // 16. Profit Target States
  const [ptFixedCosts, setPtFixedCosts] = useSessionState<number | ''>('pt_fixed_costs', '');
  const [ptVarCost, setPtVarCost] = useSessionState<number | ''>('pt_var_cost', '');
  const [ptSellingPrice, setPtSellingPrice] = useSessionState<number | ''>('pt_selling_price', '');
  const [ptTargetProfit, setPtTargetProfit] = useSessionState<number | ''>('pt_target_profit', '');

  // Results
  const gstResult = useMemo(() => {
    if (typeof gstAmount !== 'number' || gstAmount <= 0) return null;
    return calculateGST({
      amount: gstAmount,
      gstRate: gstRate,
      type: gstType,
      isInterstate: gstIsInterstate,
    });
  }, [gstAmount, gstRate, gstType, gstIsInterstate]);

  const marginsResult = useMemo(() => {
    if (typeof marginRev !== 'number' || marginRev <= 0) return null;
    return calculateMargins({
      revenue: marginRev,
      costOfGoodsSold: typeof marginCogs === 'number' ? marginCogs : 0,
      operatingExpenses: typeof marginOpex === 'number' ? marginOpex : 0,
      taxesAndInterest: typeof marginTax === 'number' ? marginTax : 0,
    });
  }, [marginRev, marginCogs, marginOpex, marginTax]);

  const breakEvenResult = useMemo(() => {
    if (
      typeof beFixed !== 'number' || beFixed <= 0 ||
      typeof bePrice !== 'number' || bePrice <= 0 ||
      typeof beVarCost !== 'number' || beVarCost < 0
    ) {
      return null;
    }
    return calculateBreakEven({
      fixedCosts: beFixed,
      sellingPricePerUnit: bePrice,
      variableCostPerUnit: beVarCost,
    });
  }, [beFixed, bePrice, beVarCost]);

  const workingCapitalResult = useMemo(() => {
    if (typeof wcAssets !== 'number' || typeof wcLiab !== 'number' || wcAssets <= 0 || wcLiab <= 0) return null;
    return calculateWorkingCapital({
      currentAssets: wcAssets,
      currentLiabilities: wcLiab,
      inventory: typeof wcInv === 'number' ? wcInv : 0,
      prepaidExpenses: typeof wcPrepaid === 'number' ? wcPrepaid : 0,
    });
  }, [wcAssets, wcLiab, wcInv, wcPrepaid]);

  const burnRateResult = useMemo(() => {
    if (typeof burnCash !== 'number' || burnCash <= 0 || typeof burnExp !== 'number' || burnExp <= 0) return null;
    return calculateBurnRate({
      cashBalance: burnCash,
      monthlyRevenue: typeof burnRev === 'number' ? burnRev : 0,
      monthlyOperatingExpenses: burnExp,
    });
  }, [burnCash, burnRev, burnExp]);

  const dscrResult = useMemo(() => {
    if (
      typeof dscrNoi !== 'number' || isNaN(dscrNoi) || dscrNoi <= 0 ||
      (typeof dscrPrincipal !== 'number' && typeof dscrInterest !== 'number')
    ) {
      return null;
    }
    const noi = dscrNoi;
    const principal = typeof dscrPrincipal === 'number' && !isNaN(dscrPrincipal) ? dscrPrincipal : 0;
    const interest = typeof dscrInterest === 'number' && !isNaN(dscrInterest) ? dscrInterest : 0;

    if (principal <= 0 && interest <= 0) return null;

    const res = calculateDSCR({
      netOperatingIncome: noi,
      annualPrincipalRepayments: principal,
      annualInterestPayments: interest,
    });
    const surplusCashFlow = noi - res.totalDebtService;

    return {
      debtServiceCoverageRatio: res.dscrRatio,
      totalDebtService: res.totalDebtService,
      netOperatingIncome: noi,
      surplusCashFlow,
      lenderAssessment: res.lenderAssessment,
    };
  }, [dscrNoi, dscrPrincipal, dscrInterest]);

  const revenueResult = useMemo(() => {
    if (typeof revQty !== 'number' || typeof revPrice !== 'number') return null;
    return calculateRevenue({ quantity: revQty, sellingPrice: revPrice });
  }, [revQty, revPrice]);

  const markupDirectResult = useMemo(() => {
    if (typeof markupDirectCost !== 'number' || typeof markupDirectPrice !== 'number') return null;
    return calculateMarkup({ cost: markupDirectCost, sellingPrice: markupDirectPrice });
  }, [markupDirectCost, markupDirectPrice]);

  const contributionMarginResult = useMemo(() => {
    if (typeof cmRevenue !== 'number' || cmRevenue <= 0 || typeof cmVarCosts !== 'number') return null;
    return calculateContributionMargin({
      revenue: cmRevenue,
      variableCosts: cmVarCosts,
      quantity: typeof cmQty === 'number' ? cmQty : undefined,
    });
  }, [cmRevenue, cmVarCosts, cmQty]);

  const valuationResult = useMemo(() => {
    if (typeof valMetricValue !== 'number' || typeof valMultiple !== 'number') return null;
    return calculateBusinessValuation({
      method: valMethod,
      metricValue: valMetricValue,
      multiple: valMultiple,
    });
  }, [valMethod, valMetricValue, valMultiple]);

  const inventoryTurnoverResult = useMemo(() => {
    if (typeof invCogs !== 'number' || typeof invAvgInventory !== 'number' || invAvgInventory <= 0) return null;
    return calculateInventoryTurnover({
      costOfGoodsSold: invCogs,
      averageInventory: invAvgInventory,
      daysInPeriod: invDays,
    });
  }, [invCogs, invAvgInventory, invDays]);

  const receivablesTurnoverResult = useMemo(() => {
    if (typeof recCreditSales !== 'number' || typeof recAvgAr !== 'number' || recAvgAr <= 0) return null;
    return calculateReceivablesTurnover({
      netCreditSales: recCreditSales,
      averageAccountsReceivable: recAvgAr,
      daysInPeriod: recDays,
    });
  }, [recCreditSales, recAvgAr, recDays]);

  const payablesTurnoverResult = useMemo(() => {
    if (typeof payCreditPurchases !== 'number' || typeof payAvgAp !== 'number' || payAvgAp <= 0) return null;
    return calculatePayablesTurnover({
      creditPurchases: payCreditPurchases,
      averageAccountsPayable: payAvgAp,
      daysInPeriod: payDays,
    });
  }, [payCreditPurchases, payAvgAp, payDays]);

  const cccResult = useMemo(() => {
    if (typeof cccDio !== 'number' || typeof cccDso !== 'number' || typeof cccDpo !== 'number') return null;
    return calculateCashConversionCycle({
      daysInventoryOutstanding_DIO: cccDio,
      daysSalesOutstanding_DSO: cccDso,
      daysPayableOutstanding_DPO: cccDpo,
    });
  }, [cccDio, cccDso, cccDpo]);

  const pricingResult = useMemo(() => {
    if (typeof priceCost !== 'number' || typeof priceTargetMargin !== 'number' || priceTargetMargin >= 100) return null;
    return calculatePricing({
      cost: priceCost,
      targetProfitMarginPercentage: priceTargetMargin,
    });
  }, [priceCost, priceTargetMargin]);

  const profitTargetResult = useMemo(() => {
    if (
      typeof ptFixedCosts !== 'number' ||
      typeof ptVarCost !== 'number' ||
      typeof ptSellingPrice !== 'number' || ptSellingPrice <= 0 ||
      typeof ptTargetProfit !== 'number'
    ) return null;
    return calculateTargetProfit({
      fixedCosts: ptFixedCosts,
      variableCostPerUnit: ptVarCost,
      sellingPricePerUnit: ptSellingPrice,
      targetProfit: ptTargetProfit,
    });
  }, [ptFixedCosts, ptVarCost, ptSellingPrice, ptTargetProfit]);

  // ------------------------------------------
  // GST CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'gst-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                GST Calculation Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setGstAmount('');
                  setGstRate(18);
                  setGstType('add_gst');
                  setGstIsInterstate(false);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Calculation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGstType('add_gst')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    gstType === 'add_gst'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Add GST (Exclusive)
                </button>
                <button
                  type="button"
                  onClick={() => setGstType('remove_gst')}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    gstType === 'remove_gst'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Remove GST (Inclusive)
                </button>
              </div>
            </div>

            <NumberSliderInput
              label={gstType === 'add_gst' ? 'Net Amount (Before GST)' : 'Gross Total Amount (Including GST)'}
              value={gstAmount}
              onChange={setGstAmount}
              min={100}
              max={10000000}
              step={100}
              unitPrefix={currencySymbol}
              required
            />

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">GST Rate Slab</label>
              <div className="grid grid-cols-5 gap-2">
                {[0, 5, 12, 18, 28].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setGstRate(r)}
                    className={`py-2 text-xs font-semibold rounded-lg border transition ${
                      gstRate === r
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {r}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGstIsInterstate(false)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                    !gstIsInterstate
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Intra-State (CGST + SGST)
                </button>
                <button
                  type="button"
                  onClick={() => setGstIsInterstate(true)}
                  className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                    gstIsInterstate
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  Inter-State (IGST)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {gstResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Gross Invoice Amount</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(gstResult.totalGrossAmount)}</div>
                <div className="text-xs text-emerald-900 mt-2">
                  Net Amount: {formatMoney(gstResult.netAmount)} + Total GST: {formatMoney(gstResult.gstAmount)} ({gstRate}%)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    {gstIsInterstate ? 'IGST (100%)' : 'CGST (Central 50%)'}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {formatMoney(gstIsInterstate ? gstResult.igstAmount : gstResult.cgstAmount)}
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">
                    {gstIsInterstate ? 'State Tax' : 'SGST (State 50%)'}
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {formatMoney(gstIsInterstate ? 0 : gstResult.sgstAmount)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter amount and GST rate slab</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // MARGINS & MARKUP CALCULATOR
  // ------------------------------------------
  if (
    toolSlug === 'profit-margin-calculator' ||
    toolSlug === 'gross-margin-calculator' ||
    toolSlug === 'net-profit-margin-calculator' ||
    toolSlug === 'operating-margin-calculator'
  ) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Revenue & Cost Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMarginRev('');
                  setMarginCogs('');
                  setMarginOpex('');
                  setMarginTax('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Revenue / Sales"
              value={marginRev}
              onChange={setMarginRev}
              min={1000}
              max={100000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Cost of Goods Sold (COGS)"
              value={marginCogs}
              onChange={setMarginCogs}
              min={0}
              max={100000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Operating Expenses (OPEX / SG&A)"
              value={marginOpex}
              onChange={setMarginOpex}
              min={0}
              max={50000000}
              step={1000}
              unitPrefix={currencySymbol}
            />

            <NumberSliderInput
              label="Taxes & Interest Expenses"
              value={marginTax}
              onChange={setMarginTax}
              min={0}
              max={20000000}
              step={1000}
              unitPrefix={currencySymbol}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {marginsResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Net Profit & Margin</span>
                <div className="text-3xl font-extrabold text-emerald-700 mt-1">
                  {formatMoney(marginsResult.netProfit)} ({marginsResult.netProfitMarginPercentage}%)
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Gross Margin</div>
                  <div className="text-base font-bold text-slate-900 mt-1">{marginsResult.grossMarginPercentage}%</div>
                  <div className="text-xs text-slate-500">{formatMoney(marginsResult.grossProfit)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Operating Margin</div>
                  <div className="text-base font-bold text-slate-900 mt-1">{marginsResult.operatingMarginPercentage}%</div>
                  <div className="text-xs text-slate-500">{formatMoney(marginsResult.operatingProfit)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Markup %</div>
                  <div className="text-base font-bold text-emerald-700 mt-1">{marginsResult.markupPercentage}%</div>
                  <div className="text-xs text-slate-500">Over Cost</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter revenue and cost details</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // BREAK-EVEN CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'break-even-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Break-Even Economics
              </h2>
              <button
                type="button"
                onClick={() => {
                  setBeFixed('');
                  setBePrice('');
                  setBeVarCost('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Fixed Costs (Rent, Salaries, Admin)"
              value={beFixed}
              onChange={setBeFixed}
              min={1000}
              max={50000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Selling Price Per Unit"
              value={bePrice}
              onChange={setBePrice}
              min={1}
              max={1000000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Variable Cost Per Unit (Raw Materials, Delivery)"
              value={beVarCost}
              onChange={setBeVarCost}
              min={0}
              max={1000000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {breakEvenResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Break-Even Volume Required</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{breakEvenResult.breakEvenUnits.toLocaleString()} Units</div>
                <p className="text-xs text-emerald-800 mt-1">
                  Required Sales Revenue: {formatMoney(breakEvenResult.breakEvenRevenue)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Unit Contribution</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(breakEvenResult.contributionMarginPerUnit)}</div>
                  <div className="text-xs text-slate-500 mt-1">Price minus Variable Cost</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Contribution Ratio</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{breakEvenResult.contributionMarginRatio}%</div>
                  <div className="text-xs text-slate-500 mt-1">Margin per sale</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <DollarSign className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter fixed cost, unit selling price, and unit variable cost</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // STARTUP BURN RATE & RUNWAY
  // ------------------------------------------
  if (toolSlug === 'startup-burn-rate-calculator' || toolSlug === 'cash-runway-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Startup Cash & Burn Metrics
              </h2>
              <button
                type="button"
                onClick={() => {
                  setBurnCash('');
                  setBurnRev('');
                  setBurnExp('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Current Cash in Bank"
              value={burnCash}
              onChange={setBurnCash}
              min={100000}
              max={100000000}
              step={50000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Monthly Gross Operating Expenses"
              value={burnExp}
              onChange={setBurnExp}
              min={10000}
              max={20000000}
              step={10000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Monthly Recurring Revenue (MRR)"
              value={burnRev}
              onChange={setBurnRev}
              min={0}
              max={20000000}
              step={10000}
              unitPrefix={currencySymbol}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {burnRateResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div
                className={`p-4 rounded-xl border text-center ${
                  burnRateResult.isCashflowPositive
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : burnRateResult.runwayMonths < 6
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">Remaining Cash Runway</span>
                <div className="text-4xl font-extrabold mt-1">
                  {burnRateResult.isCashflowPositive ? 'Infinite' : `${burnRateResult.runwayMonths} Months`}
                </div>
                <p className="text-xs mt-1">Zero Cash Date: {burnRateResult.zeroCashDateString}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Net Monthly Burn</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(burnRateResult.netBurnRateMonthly)}/mo</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Gross Monthly Burn</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(burnRateResult.grossBurnRateMonthly)}/mo</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter cash balance and monthly expenses</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // REVENUE CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'revenue-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Revenue Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setRevQty('');
                  setRevPrice('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Quantity / Units Sold"
              value={revQty}
              onChange={setRevQty}
              min={0}
              max={1000000}
              step={10}
              required
            />

            <NumberSliderInput
              label="Average Selling Price Per Unit"
              value={revPrice}
              onChange={setRevPrice}
              min={0}
              max={100000}
              step={1}
              unitPrefix={currencySymbol}
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {revenueResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Projected Revenue</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(revenueResult.totalRevenue)}</div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Average Revenue Per Unit</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(revenueResult.averageRevenuePerUnit)}</div>
                  <div className="text-xs text-slate-500 mt-1">Calculated as Total Revenue / Quantity Sold</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <DollarSign className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter quantity sold and average selling price to view revenue projections</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // MARKUP CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'markup-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-600" />
                Markup Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMarkupDirectCost('');
                  setMarkupDirectPrice('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Product Cost (COGS per Unit)"
              value={markupDirectCost}
              onChange={setMarkupDirectCost}
              min={0}
              max={1000000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Selling Price"
              value={markupDirectPrice}
              onChange={setMarkupDirectPrice}
              min={0}
              max={2000000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {markupDirectResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Markup Percentage</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{markupDirectResult.markupPercentage}%</div>
                <p className="text-xs text-emerald-800 mt-1">Calculated as (Profit / Cost) * 100</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Markup Amount</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(markupDirectResult.markupAmount)}</div>
                  <div className="text-xs text-slate-500 mt-1">Gross profit per unit</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Gross Profit Margin</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">
                    {markupDirectResult.sellingPrice > 0
                      ? Math.round((markupDirectResult.markupAmount / markupDirectResult.sellingPrice) * 10000) / 100
                      : 0}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Profit divided by selling price</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Percent className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter product cost and selling price to calculate markup metrics</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // CONTRIBUTION MARGIN CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'contribution-margin-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Contribution Margin Inputs
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCmRevenue('');
                  setCmVarCosts('');
                  setCmQty('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Sales Revenue"
              value={cmRevenue}
              onChange={setCmRevenue}
              min={1}
              max={100000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Total Variable Costs (Materials, Commision, Delivery)"
              value={cmVarCosts}
              onChange={setCmVarCosts}
              min={0}
              max={100000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Units Sold (Optional, for per-unit metric)"
              value={cmQty}
              onChange={setCmQty}
              min={0}
              max={1000000}
              step={10}
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {contributionMarginResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Contribution Margin</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(contributionMarginResult.contributionMargin)}</div>
                <p className="text-xs text-emerald-800 mt-1">Available to cover fixed overhead costs & generate profit</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Contribution Margin %</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{contributionMarginResult.contributionMarginPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-1">CM divided by Total Revenue</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Variable Cost Ratio</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{contributionMarginResult.variableCostPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-1">Variable Costs / Revenue</div>
                </div>
              </div>

              {typeof cmQty === 'number' && cmQty > 0 && (
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center">
                  <div className="text-xs font-semibold text-emerald-800 uppercase">Contribution Per Unit</div>
                  <div className="text-3xl font-bold text-emerald-800 mt-1">{formatMoney(contributionMarginResult.contributionPerUnit)}</div>
                  <div className="text-xs text-emerald-700 mt-1">Per Unit Profit Margin excluding fixed overheads</div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <TrendingUp className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter total sales revenue and total variable costs to get margins</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // BUSINESS VALUATION CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'business-valuation-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                Valuation Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setValMethod('revenue_multiple');
                  setValMetricValue('');
                  setValMultiple('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Valuation Methodology</label>
              <select
                value={valMethod}
                onChange={(e) => setValMethod(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value="revenue_multiple">Revenue Multiple Method</option>
                <option value="ebitda_multiple">EBITDA Multiple Method</option>
                <option value="earnings_multiple">Net Earnings Multiple Method</option>
              </select>
            </div>

            <NumberSliderInput
              label={
                valMethod === 'revenue_multiple'
                  ? 'Annual Revenue'
                  : valMethod === 'ebitda_multiple'
                  ? 'Annual EBITDA'
                  : 'Annual Net Earnings / Profit'
              }
              value={valMetricValue}
              onChange={setValMetricValue}
              min={10000}
              max={100000000}
              step={10000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Valuation Multiple (e.g. 3x, 5x, 10x)"
              value={valMultiple}
              onChange={setValMultiple}
              min={0.1}
              max={50}
              step={0.1}
              unitSuffix="x"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {valuationResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Estimated Business Valuation</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(valuationResult.estimatedValuation)}</div>
                <p className="text-xs text-emerald-800 mt-1">
                  Based on {valMultiple}x multiple of{' '}
                  {valMethod === 'revenue_multiple'
                    ? 'Revenue'
                    : valMethod === 'ebitda_multiple'
                    ? 'EBITDA'
                    : 'Net Earnings'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Method Metric</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(valuationResult.metricValue)}</div>
                  <div className="text-xs text-slate-500 mt-1">Valuation base metric</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Enterprise Multiple</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{valuationResult.multiple}x</div>
                  <div className="text-xs text-slate-500 mt-1">Industry comparative multiplier</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Select methodology, metric value, and multiple to determine valuation</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // DEBT SERVICE COVERAGE RATIO (DSCR)
  // ------------------------------------------
  if (toolSlug === 'dscr-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                DSCR Debt Service Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setDscrNoi('');
                  setDscrPrincipal('');
                  setDscrInterest('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Annual Net Operating Income (NOI)"
              value={dscrNoi}
              onChange={setDscrNoi}
              min={0}
              max={10000000}
              step={1000}
              unitPrefix={currencySymbol}
              placeholder="e.g. 120000"
              required
            />

            <NumberSliderInput
              label="Annual Principal Repayments"
              value={dscrPrincipal}
              onChange={setDscrPrincipal}
              min={0}
              max={5000000}
              step={1000}
              unitPrefix={currencySymbol}
              placeholder="e.g. 50000"
              required
            />

            <NumberSliderInput
              label="Annual Interest Payments"
              value={dscrInterest}
              onChange={setDscrInterest}
              min={0}
              max={5000000}
              step={500}
              unitPrefix={currencySymbol}
              placeholder="e.g. 10000"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {dscrResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div
                className={`p-4 rounded-xl border text-center ${
                  dscrResult.debtServiceCoverageRatio >= 1.25
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : dscrResult.debtServiceCoverageRatio >= 1.0
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wider">Debt Service Coverage Ratio (DSCR)</span>
                <div className="text-4xl font-extrabold mt-1">
                  {typeof dscrResult.debtServiceCoverageRatio === 'number' && !isNaN(dscrResult.debtServiceCoverageRatio)
                    ? dscrResult.debtServiceCoverageRatio.toFixed(2)
                    : '0.00'}x
                </div>
                <p className="text-xs mt-1">
                  Status:{' '}
                  <span className="font-bold">
                    {dscrResult.debtServiceCoverageRatio >= 1.25
                      ? 'Optimal / Highly Fundable (≥ 1.25x)'
                      : dscrResult.debtServiceCoverageRatio >= 1.0
                      ? 'Tight / Standard Risk (1.00x - 1.24x)'
                      : 'Under-funded / High Default Risk (< 1.00x)'}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Total Debt Service</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(dscrResult.totalDebtService)}</div>
                  <div className="text-xs text-slate-500 mt-1">Principal + Interest</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Net Operating Income</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{formatMoney(dscrResult.netOperatingIncome)}</div>
                  <div className="text-xs text-slate-500 mt-1">Available NOI</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase">Operating Cash Buffer</div>
                  <div className="text-xs text-slate-500 mt-0.5">NOI minus Debt Service</div>
                </div>
                <div className={`text-lg font-bold ${dscrResult.surplusCashFlow >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {formatMoney(dscrResult.surplusCashFlow)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Activity className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter NOI and debt service costs to see your DSCR fundability score</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // INVENTORY TURNOVER CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'inventory-turnover-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                Inventory Turn Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setInvCogs('');
                  setInvAvgInventory('');
                  setInvDays(365);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Cost of Goods Sold (COGS)"
              value={invCogs}
              onChange={setInvCogs}
              min={1000}
              max={50000000}
              step={10000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Average Inventory Balance"
              value={invAvgInventory}
              onChange={setInvAvgInventory}
              min={100}
              max={10000000}
              step={5000}
              unitPrefix={currencySymbol}
              required
            />

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Period Days</label>
              <select
                value={invDays}
                onChange={(e) => setInvDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value={365}>Annual Period (365 Days)</option>
                <option value={90}>Quarterly Period (90 Days)</option>
                <option value={30}>Monthly Period (30 Days)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {inventoryTurnoverResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Inventory Turnover Ratio</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{inventoryTurnoverResult.inventoryTurnoverRatio}x / yr</div>
                <p className="text-xs text-emerald-800 mt-1">Number of times inventory was replaced during period</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Days Inventory Outstanding (DIO)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{inventoryTurnoverResult.daysInventoryOutstanding} Days</div>
                  <div className="text-xs text-slate-500 mt-1">Average days item stays in warehouse before sale</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter COGS and Average Inventory to determine Turnover Velocity</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // RECEIVABLES TURNOVER CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'receivables-turnover-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                Receivables Turn Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setRecCreditSales('');
                  setRecAvgAr('');
                  setRecDays(365);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Net Credit Sales Revenue"
              value={recCreditSales}
              onChange={setRecCreditSales}
              min={1000}
              max={50000000}
              step={10000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Average Accounts Receivable Balance"
              value={recAvgAr}
              onChange={setRecAvgAr}
              min={100}
              max={10000000}
              step={5000}
              unitPrefix={currencySymbol}
              required
            />

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Period Days</label>
              <select
                value={recDays}
                onChange={(e) => setRecDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value={365}>Annual Period (365 Days)</option>
                <option value={90}>Quarterly Period (90 Days)</option>
                <option value={30}>Monthly Period (30 Days)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {receivablesTurnoverResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Receivables Turnover Ratio</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{receivablesTurnoverResult.receivablesTurnoverRatio}x / yr</div>
                <p className="text-xs text-emerald-800 mt-1">Number of times credit balance was collected on average</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Days Sales Outstanding (DSO)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{receivablesTurnoverResult.daysSalesOutstanding} Days</div>
                  <div className="text-xs text-slate-500 mt-1">Average days clients take to pay invoices</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter Credit Sales and Receivables to evaluate collections velocity</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // PAYABLES TURNOVER CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'payables-turnover-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-emerald-600" />
                Payables Turn Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPayCreditPurchases('');
                  setPayAvgAp('');
                  setPayDays(365);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Credit Purchases / Supply Cost"
              value={payCreditPurchases}
              onChange={setPayCreditPurchases}
              min={1000}
              max={50000000}
              step={10000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Average Accounts Payable Balance"
              value={payAvgAp}
              onChange={setPayAvgAp}
              min={100}
              max={10000000}
              step={5000}
              unitPrefix={currencySymbol}
              required
            />

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-2">Period Days</label>
              <select
                value={payDays}
                onChange={(e) => setPayDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                <option value={365}>Annual Period (365 Days)</option>
                <option value={90}>Quarterly Period (90 Days)</option>
                <option value={30}>Monthly Period (30 Days)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {payablesTurnoverResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Payables Turnover Ratio</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{payablesTurnoverResult.payablesTurnoverRatio}x / yr</div>
                <p className="text-xs text-emerald-800 mt-1">Number of times you settled supplier debts in period</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Days Payable Outstanding (DPO)</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{payablesTurnoverResult.daysPayableOutstanding} Days</div>
                  <div className="text-xs text-slate-500 mt-1">Average days your business takes to pay supplier bills</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter credit purchases and payables to see payment terms velocity</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // CASH CONVERSION CYCLE CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'cash-conversion-cycle-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Working Cycle Parameters
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCccDio('');
                  setCccDso('');
                  setCccDpo('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Days Inventory Outstanding (DIO)"
              value={cccDio}
              onChange={setCccDio}
              min={0}
              max={365}
              step={1}
              unitSuffix=" Days"
              required
            />

            <NumberSliderInput
              label="Days Sales Outstanding (DSO)"
              value={cccDso}
              onChange={setCccDso}
              min={0}
              max={365}
              step={1}
              unitSuffix=" Days"
              required
            />

            <NumberSliderInput
              label="Days Payable Outstanding (DPO)"
              value={cccDpo}
              onChange={setCccDpo}
              min={0}
              max={365}
              step={1}
              unitSuffix=" Days"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {cccResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Net Cash Conversion Cycle</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{cccResult.cashConversionCycle} Days</div>
                <p className="text-xs text-emerald-800 mt-1">
                  Formula: DIO ({cccDio}) + DSO ({cccDso}) - DPO ({cccDpo})
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <h3 className="font-bold text-slate-800">Understanding your CCC:</h3>
                <p>
                  A shorter or negative cycle is optimal, as it signifies less working capital is locked up in stock and credit
                  purchases. Lower DIO, lower DSO, and higher DPO shorten the cycle and increase liquidity.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Activity className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter DIO, DSO, and DPO metrics to assess cash cycle lock-ups</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // PRICING CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'pricing-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Pricing Metrics
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPriceCost('');
                  setPriceTargetMargin('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Item Base Cost"
              value={priceCost}
              onChange={setPriceCost}
              min={0}
              max={1000000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Target Profit Margin % (must be < 100%)"
              value={priceTargetMargin}
              onChange={setPriceTargetMargin}
              min={0}
              max={99.9}
              step={0.1}
              unitSuffix="%"
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {pricingResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Recommended Selling Price</span>
                <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(pricingResult.sellingPrice)}</div>
                <p className="text-xs text-emerald-800 mt-1">Calculated as Cost / (1 - Target Margin)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Unit Profit Amount</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{formatMoney(pricingResult.profitAmount)}</div>
                  <div className="text-xs text-slate-500 mt-1">Selling Price minus Cost</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase">Required Markup %</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-1">{pricingResult.markupPercentage}%</div>
                  <div className="text-xs text-slate-500 mt-1">Equivalent markup on cost</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Target className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter production cost and target margin percentage</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // PROFIT TARGET CALCULATOR
  // ------------------------------------------
  if (toolSlug === 'profit-target-calculator' || toolSlug === 'target-profit-calculator') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Target Projections
              </h2>
              <button
                type="button"
                onClick={() => {
                  setPtFixedCosts('');
                  setPtVarCost('');
                  setPtSellingPrice('');
                  setPtTargetProfit('');
                }}
                className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <NumberSliderInput
              label="Total Fixed Costs / Overheads"
              value={ptFixedCosts}
              onChange={setPtFixedCosts}
              min={0}
              max={10000000}
              step={1000}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Variable Cost Per Unit"
              value={ptVarCost}
              onChange={setPtVarCost}
              min={0}
              max={100000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Selling Price Per Unit"
              value={ptSellingPrice}
              onChange={setPtSellingPrice}
              min={1}
              max={200000}
              step={10}
              unitPrefix={currencySymbol}
              required
            />

            <NumberSliderInput
              label="Target Profit Goal"
              value={ptTargetProfit}
              onChange={setPtTargetProfit}
              min={0}
              max={50000000}
              step={5000}
              unitPrefix={currencySymbol}
              required
            />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {profitTargetResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {!profitTargetResult.isFeasible ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-rose-800 text-xs">
                  <p className="font-bold mb-1">Target Infeasible</p>
                  Unit Selling Price must be greater than Unit Variable Cost to cover fixed overheads.
                </div>
              ) : (
                <>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Required Sales Volume</span>
                    <div className="text-4xl font-extrabold text-emerald-700 mt-1">
                      {profitTargetResult.requiredUnits.toLocaleString()} Units
                    </div>
                    <p className="text-xs text-emerald-800 mt-1">
                      Required revenue: {formatMoney(profitTargetResult.requiredRevenue)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Unit Contribution</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">
                        {formatMoney(profitTargetResult.contributionPerUnit)}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Price minus Variable Cost</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="text-xs font-semibold text-slate-500 uppercase">Fixed + Profit Pool</div>
                      <div className="text-xl font-bold text-slate-900 mt-1">
                        {formatMoney((ptFixedCosts || 0) + (ptTargetProfit || 0))}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Total pool needed</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
              <Target className="w-10 h-10 mx-auto text-slate-400 mb-3" />
              <p className="font-medium text-slate-700">Enter fixed costs, unit variables, price, and target profit to view feasibility plan</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ------------------------------------------
  // WORKING CAPITAL & RATIOS (Default / Fallback)
  // ------------------------------------------
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Working Capital Parameters
            </h2>
            <button
              type="button"
              onClick={() => {
                setWcAssets('');
                setWcLiab('');
                setWcInv('');
                setWcPrepaid('');
              }}
              className="text-xs font-semibold text-slate-600 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <NumberSliderInput
            label="Total Current Assets"
            value={wcAssets}
            onChange={setWcAssets}
            min={10000}
            max={50000000}
            step={10000}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Total Current Liabilities"
            value={wcLiab}
            onChange={setWcLiab}
            min={10000}
            max={50000000}
            step={10000}
            unitPrefix={currencySymbol}
            required
          />

          <NumberSliderInput
            label="Inventory Value"
            value={wcInv}
            onChange={setWcInv}
            min={0}
            max={20000000}
            step={5000}
            unitPrefix={currencySymbol}
          />
        </div>
      </div>

      <div className="lg:col-span-6 space-y-6">
        {workingCapitalResult ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Net Working Capital</span>
              <div className="text-4xl font-extrabold text-emerald-700 mt-1">{formatMoney(workingCapitalResult.workingCapital)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Current Ratio</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{workingCapitalResult.currentRatio}:1</div>
                <div className="text-xs text-slate-500 mt-1">Benchmark: 2.0:1</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-500 uppercase">Quick Ratio (Acid-Test)</div>
                <div className="text-2xl font-bold text-emerald-700 mt-1">{workingCapitalResult.quickRatio}:1</div>
                <div className="text-xs text-slate-500 mt-1">Benchmark: 1.0:1</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
            <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <p className="font-medium text-slate-700">Enter current assets and current liabilities</p>
          </div>
        )}
      </div>
    </div>
  );
};
