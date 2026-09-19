import React, { useMemo, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useSessionState } from '../../utils/useSessionState';
import { CompactCalculatorWorkspace } from './CompactCalculatorWorkspace';
import { CalculationShareData } from '../../utils/shareUtils';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { CurrencyInput } from '../common/CurrencyInput';
import { DonutChart, DonutSegment } from '../common/DonutChart';
import {
  Coins,
  Scale,
  Sparkles,
  Gem,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  calculateGoldValue,
  calculateGoldLoan,
  calculateGoldPurity,
  calculateGoldJewelleryCost,
  calculateGoldInvestmentReturn,
  GoldWeightUnit,
  GoldRateUnit,
  GoldCarat,
  GoldRateBasis,
  GoldLoanRepaymentMethod,
  MakingChargeType,
  GoldInvestmentMode,
  GOLD_WEIGHT_UNIT_LABELS,
  GOLD_RATE_UNIT_LABELS,
  STANDARD_CARAT_PURITIES,
  normalizeToGrams,
} from '../../engine/goldEngines';

interface GoldCalculatorsWorkspaceViewProps {
  toolSlug: string;
}

export const GOLD_CALCULATOR_SLUGS = [
  'gold-value-calculator',
  'gold-loan-calculator',
  'gold-purity-calculator',
  'gold-jewellery-cost-calculator',
  'gold-investment-return-calculator',
];

export const GoldCalculatorsWorkspaceView: React.FC<GoldCalculatorsWorkspaceViewProps> = ({ toolSlug }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // =========================================================================
  // 1. GOLD VALUE CALCULATOR STATE & LOGIC
  // =========================================================================
  const [gvWeight, setGvWeight] = useSessionState<number | ''>('gv_weight', '');
  const [gvUnit, setGvUnit] = useSessionState<GoldWeightUnit>('gv_unit', 'g');
  const [gvPurity, setGvPurity] = useSessionState<GoldCarat>('gv_purity', 22);
  const [gvCustomPurity, setGvCustomPurity] = useSessionState<number | ''>('gv_custom_purity', '');
  const [gvRateBasis, setGvRateBasis] = useSessionState<GoldRateBasis>('gv_rate_basis', '24k_reference');
  const [gvRate, setGvRate] = useSessionState<number | ''>('gv_rate', '');
  const [gvRateUnit, setGvRateUnit] = useSessionState<GoldRateUnit>('gv_rate_unit', 'per_g');

  const gvResult = useMemo(() => {
    return calculateGoldValue({
      weight: gvWeight,
      weightUnit: gvUnit,
      purity: gvPurity,
      customPurityPercent: gvCustomPurity,
      goldRate: gvRate,
      rateUnit: gvRateUnit,
      rateBasis: gvRateBasis,
    });
  }, [gvWeight, gvUnit, gvPurity, gvCustomPurity, gvRate, gvRateUnit, gvRateBasis]);

  const handleResetGoldValue = () => {
    setGvWeight('');
    setGvUnit('g');
    setGvPurity(22);
    setGvCustomPurity('');
    setGvRateBasis('24k_reference');
    setGvRate('');
    setGvRateUnit('per_g');
  };

  const gvMatrix = useMemo(() => {
    if (!gvResult || !gvRate || typeof gvRate !== 'number' || gvRate <= 0) return [];
    const carats: (24 | 22 | 21 | 18 | 14 | 10)[] = [24, 22, 21, 18, 14, 10];
    return carats.map((c) => {
      const res = calculateGoldValue({
        weight: gvWeight,
        weightUnit: gvUnit,
        purity: c,
        goldRate: gvRate,
        rateUnit: gvRateUnit,
        rateBasis: '24k_reference',
      });
      return {
        carat: c,
        purityPercent: (c / 24) * 100,
        pureWeightGrams: res ? res.pureGoldWeightInGrams : 0,
        value: res ? res.goldValue : 0,
      };
    });
  }, [gvResult, gvWeight, gvUnit, gvRate, gvRateUnit]);

  const gvShareData = useMemo<CalculationShareData | null>(() => {
    if (!gvResult || typeof gvWeight !== 'number' || typeof gvRate !== 'number') return null;
    return {
      toolSlug: 'gold-value-calculator',
      toolName: 'Gold Value Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Gold Weight', value: `${gvWeight} ${GOLD_WEIGHT_UNIT_LABELS[gvUnit]}` },
        { label: 'Gold Purity', value: gvPurity === 'custom' ? `${gvCustomPurity}%` : `${gvPurity}K` },
        { label: 'Gold Rate', value: `${formatMoney(gvRate)} / ${GOLD_RATE_UNIT_LABELS[gvRateUnit]}` },
      ],
      outputs: [
        { label: 'Total Gold Valuation', value: formatMoney(gvResult.goldValue), isHighlight: true },
        { label: 'Pure Gold Weight (24K Equivalent)', value: `${gvResult.pureGoldWeightInGrams.toFixed(3)} g` },
        { label: 'Gross Weight', value: `${gvResult.grossWeightInGrams.toFixed(3)} g` },
        { label: 'Effective Rate For Purity', value: `${formatMoney(gvResult.effectiveRatePerGram)} / g` },
      ],
      customUrlParams: {
        w: gvWeight,
        u: gvUnit,
        p: gvPurity,
        r: gvRate,
        ru: gvRateUnit,
      },
    };
  }, [gvResult, gvWeight, gvUnit, gvPurity, gvCustomPurity, gvRate, gvRateUnit, formatMoney]);

  // =========================================================================
  // 2. GOLD LOAN CALCULATOR STATE & LOGIC
  // =========================================================================
  const [glWeight, setGlWeight] = useSessionState<number | ''>('gl_weight', '');
  const [glUnit, setGlUnit] = useSessionState<GoldWeightUnit>('gl_unit', 'g');
  const [glPurity, setGlPurity] = useSessionState<GoldCarat>('gl_purity', 22);
  const [glCustomPurity, setGlCustomPurity] = useSessionState<number | ''>('gl_custom_purity', '');
  const [glRate, setGlRate] = useSessionState<number | ''>('gl_rate', '');
  const [glRateUnit, setGlRateUnit] = useSessionState<GoldRateUnit>('gl_rate_unit', 'per_g');
  const [glLtv, setGlLtv] = useSessionState<number | ''>('gl_ltv', 75);
  const [glDesiredLoan, setGlDesiredLoan] = useSessionState<number | ''>('gl_desired_loan', '');
  const [glInterestRate, setGlInterestRate] = useSessionState<number | ''>('gl_interest_rate', '');
  const [glTerm, setGlTerm] = useSessionState<number | ''>('gl_term', '');
  const [glTermUnit, setGlTermUnit] = useSessionState<'months' | 'years'>('gl_term_unit', 'months');
  const [glRepayment, setGlRepayment] = useSessionState<GoldLoanRepaymentMethod>('gl_repayment', 'emi');
  const [glShowSchedule, setGlShowSchedule] = useState(false);

  const glResult = useMemo(() => {
    return calculateGoldLoan({
      weight: glWeight,
      weightUnit: glUnit,
      purity: glPurity,
      customPurityPercent: glCustomPurity,
      goldRate: glRate,
      rateUnit: glRateUnit,
      ltvPercent: glLtv,
      desiredLoanAmount: glDesiredLoan,
      interestRate: glInterestRate,
      loanTerm: glTerm,
      termUnit: glTermUnit,
      repaymentMethod: glRepayment,
    });
  }, [
    glWeight,
    glUnit,
    glPurity,
    glCustomPurity,
    glRate,
    glRateUnit,
    glLtv,
    glDesiredLoan,
    glInterestRate,
    glTerm,
    glTermUnit,
    glRepayment,
  ]);

  const handleResetGoldLoan = () => {
    setGlWeight('');
    setGlUnit('g');
    setGlPurity(22);
    setGlCustomPurity('');
    setGlRate('');
    setGlRateUnit('per_g');
    setGlLtv(75);
    setGlDesiredLoan('');
    setGlInterestRate('');
    setGlTerm('');
    setGlTermUnit('months');
    setGlRepayment('emi');
    setGlShowSchedule(false);
  };

  const glDonutSegments: DonutSegment[] = useMemo(() => {
    if (!glResult) return [];
    return [
      {
        label: 'Principal Loan',
        value: glResult.activeLoanPrincipal,
        color: '#3b82f6',
        formattedValue: formatMoney(glResult.activeLoanPrincipal),
      },
      {
        label: 'Total Interest',
        value: glResult.totalInterest,
        color: '#f59e0b',
        formattedValue: formatMoney(glResult.totalInterest),
      },
    ];
  }, [glResult, formatMoney]);

  const glShareData = useMemo<CalculationShareData | null>(() => {
    if (!glResult) return null;
    return {
      toolSlug: 'gold-loan-calculator',
      toolName: 'Gold Loan Calculator',
      categorySlug: 'finance',
      inputs: [
        ...(typeof glWeight === 'number' ? [{ label: 'Pledged Gold Weight', value: `${glWeight} ${GOLD_WEIGHT_UNIT_LABELS[glUnit]}` }] : []),
        { label: 'Purity', value: glPurity === 'custom' ? `${glCustomPurity}%` : `${glPurity}K` },
        ...(typeof glRate === 'number' ? [{ label: 'Valuation Rate', value: `${formatMoney(glRate)} / ${GOLD_RATE_UNIT_LABELS[glRateUnit]}` }] : []),
        { label: 'LTV Ratio', value: `${glResult.actualLtvPercent.toFixed(1)}%` },
        { label: 'Interest Rate', value: `${glResult.interestRateAnnual}% p.a.` },
        { label: 'Loan Tenure', value: `${glResult.termMonths} Months` },
      ],
      outputs: [
        { label: 'Maximum Eligible Loan', value: formatMoney(glResult.maxEligibleLoan), isHighlight: true },
        { label: 'Monthly Payment (EMI)', value: `${formatMoney(glResult.periodicPayment)} / mo` },
        { label: 'Gold Collateral Market Value', value: formatMoney(glResult.estimatedGoldValue) },
        { label: 'Total Interest Payable', value: formatMoney(glResult.totalInterest) },
        { label: 'Total Repayment Amount', value: formatMoney(glResult.totalRepayment) },
      ],
      customUrlParams: {
        w: glWeight,
        p: glPurity,
        r: glRate,
        ltv: glLtv,
        i: glInterestRate,
        t: glTerm,
      },
    };
  }, [glResult, glWeight, glUnit, glPurity, glCustomPurity, glRate, glRateUnit, glLtv, glInterestRate, glTerm, formatMoney]);

  // =========================================================================
  // 3. GOLD PURITY CALCULATOR STATE & LOGIC
  // =========================================================================
  const [gpWeight, setGpWeight] = useSessionState<number | ''>('gp_weight', '');
  const [gpUnit, setGpUnit] = useSessionState<GoldWeightUnit>('gp_unit', 'g');
  const [gpCarat, setGpCarat] = useSessionState<GoldCarat>('gp_carat', 22);
  const [gpCustomPurity, setGpCustomPurity] = useSessionState<number | ''>('gp_custom_purity', '');

  const gpResult = useMemo(() => {
    return calculateGoldPurity({
      weight: gpWeight,
      weightUnit: gpUnit,
      carat: gpCarat,
      customPurityPercent: gpCustomPurity,
    });
  }, [gpWeight, gpUnit, gpCarat, gpCustomPurity]);

  const handleResetGoldPurity = () => {
    setGpWeight('');
    setGpUnit('g');
    setGpCarat(22);
    setGpCustomPurity('');
  };

  const gpDonutSegments: DonutSegment[] = useMemo(() => {
    if (!gpResult) return [];
    return [
      {
        label: 'Pure Gold',
        value: gpResult.pureGoldWeightInGrams,
        color: '#eab308',
        formattedValue: `${gpResult.pureGoldWeight.toFixed(3)} ${gpResult.weightUnit} (${gpResult.purityPercent.toFixed(1)}%)`,
      },
      {
        label: 'Alloy Metals',
        value: gpResult.nonGoldWeightInGrams,
        color: '#94a3b8',
        formattedValue: `${gpResult.nonGoldWeight.toFixed(3)} ${gpResult.weightUnit} (${(100 - gpResult.purityPercent).toFixed(1)}%)`,
      },
    ];
  }, [gpResult]);

  const gpComparisonTable = useMemo(() => {
    if (!gpWeight || typeof gpWeight !== 'number' || gpWeight <= 0) return [];
    const carats: (24 | 23 | 22 | 21 | 20 | 18 | 14 | 10)[] = [24, 23, 22, 21, 20, 18, 14, 10];
    const grossGrams = normalizeToGrams(gpWeight, gpUnit);
    return carats.map((c) => {
      const std = STANDARD_CARAT_PURITIES[c];
      const fraction = c / 24;
      const pureGrams = grossGrams * fraction;
      return {
        carat: c,
        name: std.name,
        hallmark: std.hallmark,
        purityPercent: (fraction * 100).toFixed(2) + '%',
        pureWeight: (gpWeight * fraction).toFixed(3) + ' ' + gpUnit,
        pureGrams: pureGrams.toFixed(3) + ' g',
        isSelected: gpCarat === c,
      };
    });
  }, [gpWeight, gpUnit, gpCarat]);

  const gpShareData = useMemo<CalculationShareData | null>(() => {
    if (!gpResult || typeof gpWeight !== 'number') return null;
    return {
      toolSlug: 'gold-purity-calculator',
      toolName: 'Gold Purity Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Gross Weight', value: `${gpWeight} ${GOLD_WEIGHT_UNIT_LABELS[gpUnit]}` },
        { label: 'Tested Purity', value: gpCarat === 'custom' ? `${gpCustomPurity}%` : `${gpCarat}K (${gpResult.hallmarkCode})` },
      ],
      outputs: [
        { label: 'Pure Gold Content', value: `${gpResult.pureGoldWeight.toFixed(3)} ${gpResult.weightUnit}`, isHighlight: true },
        { label: 'Pure Gold Weight (Grams)', value: `${gpResult.pureGoldWeightInGrams.toFixed(3)} g` },
        { label: 'Alloy / Non-Gold Mass', value: `${gpResult.nonGoldWeight.toFixed(3)} ${gpResult.weightUnit}` },
        { label: 'Purity Fineness Percentage', value: `${gpResult.purityPercent.toFixed(2)}%` },
      ],
      customUrlParams: {
        w: gpWeight,
        u: gpUnit,
        c: gpCarat,
      },
    };
  }, [gpResult, gpWeight, gpUnit, gpCarat, gpCustomPurity]);

  // =========================================================================
  // 4. GOLD JEWELLERY COST CALCULATOR STATE & LOGIC
  // =========================================================================
  const [gjWeight, setGjWeight] = useSessionState<number | ''>('gj_weight', '');
  const [gjUnit, setGjUnit] = useSessionState<GoldWeightUnit>('gj_unit', 'g');
  const [gjPurity, setGjPurity] = useSessionState<GoldCarat>('gj_purity', 22);
  const [gjCustomPurity, setGjCustomPurity] = useSessionState<number | ''>('gj_custom_purity', '');
  const [gjRate, setGjRate] = useSessionState<number | ''>('gj_rate', '');
  const [gjRateBasis, setGjRateBasis] = useSessionState<GoldRateBasis>('gj_rate_basis', '24k_reference');
  const [gjRateUnit, setGjRateUnit] = useSessionState<GoldRateUnit>('gj_rate_unit', 'per_g');
  const [gjMaking, setGjMaking] = useSessionState<number | ''>('gj_making', '');
  const [gjMakingType, setGjMakingType] = useSessionState<MakingChargeType>('gj_making_type', 'percentage');
  const [gjWastage, setGjWastage] = useSessionState<number | ''>('gj_wastage', '');
  const [gjStones, setGjStones] = useSessionState<number | ''>('gj_stones', '');
  const [gjOther, setGjOther] = useSessionState<number | ''>('gj_other', '');
  const [gjTax, setGjTax] = useSessionState<number | ''>('gj_tax', '');

  const gjResult = useMemo(() => {
    return calculateGoldJewelleryCost({
      weight: gjWeight,
      weightUnit: gjUnit,
      purity: gjPurity,
      customPurityPercent: gjCustomPurity,
      goldRate: gjRate,
      rateUnit: gjRateUnit,
      rateBasis: gjRateBasis,
      makingCharge: gjMaking,
      makingChargeType: gjMakingType,
      wastagePercent: gjWastage,
      stoneCharges: gjStones,
      otherCharges: gjOther,
      taxPercent: gjTax,
    });
  }, [
    gjWeight,
    gjUnit,
    gjPurity,
    gjCustomPurity,
    gjRate,
    gjRateUnit,
    gjRateBasis,
    gjMaking,
    gjMakingType,
    gjWastage,
    gjStones,
    gjOther,
    gjTax,
  ]);

  const handleResetGoldJewellery = () => {
    setGjWeight('');
    setGjUnit('g');
    setGjPurity(22);
    setGjCustomPurity('');
    setGjRate('');
    setGjRateBasis('24k_reference');
    setGjRateUnit('per_g');
    setGjMaking('');
    setGjMakingType('percentage');
    setGjWastage('');
    setGjStones('');
    setGjOther('');
    setGjTax('');
  };

  const gjDonutSegments: DonutSegment[] = useMemo(() => {
    if (!gjResult || gjResult.finalPrice <= 0) return [];
    const segments: DonutSegment[] = [
      {
        label: 'Pure Gold Value',
        value: gjResult.goldValue,
        color: '#eab308',
        formattedValue: formatMoney(gjResult.goldValue),
      },
    ];

    if (gjResult.makingChargeAmount > 0) {
      segments.push({
        label: 'Making Charges',
        value: gjResult.makingChargeAmount,
        color: '#3b82f6',
        formattedValue: formatMoney(gjResult.makingChargeAmount),
      });
    }

    if (gjResult.wastageCost > 0) {
      segments.push({
        label: 'Wastage (Vaighat)',
        value: gjResult.wastageCost,
        color: '#f97316',
        formattedValue: formatMoney(gjResult.wastageCost),
      });
    }

    if (gjResult.stoneCharges > 0) {
      segments.push({
        label: 'Gemstones & Beads',
        value: gjResult.stoneCharges,
        color: '#ec4899',
        formattedValue: formatMoney(gjResult.stoneCharges),
      });
    }

    if (gjResult.otherCharges > 0) {
      segments.push({
        label: 'Other / Hallmarking',
        value: gjResult.otherCharges,
        color: '#8b5cf6',
        formattedValue: formatMoney(gjResult.otherCharges),
      });
    }

    if (gjResult.taxAmount > 0) {
      segments.push({
        label: 'Taxes (GST/VAT)',
        value: gjResult.taxAmount,
        color: '#10b981',
        formattedValue: formatMoney(gjResult.taxAmount),
      });
    }

    return segments;
  }, [gjResult, formatMoney]);

  const gjRecoverablePercent = useMemo(() => {
    if (!gjResult || gjResult.finalPrice <= 0) return 0;
    return (gjResult.goldValue / gjResult.finalPrice) * 100;
  }, [gjResult]);

  const gjcShareData = useMemo<CalculationShareData | null>(() => {
    if (!gjResult || typeof gjWeight !== 'number' || typeof gjRate !== 'number') return null;
    return {
      toolSlug: 'gold-jewellery-cost-calculator',
      toolName: 'Gold Jewellery Cost Calculator',
      categorySlug: 'finance',
      inputs: [
        { label: 'Jewellery Weight', value: `${gjWeight} ${GOLD_WEIGHT_UNIT_LABELS[gjUnit]}` },
        { label: 'Purity', value: gjPurity === 'custom' ? `${gjCustomPurity}%` : `${gjPurity}K` },
        { label: 'Gold Rate', value: `${formatMoney(gjRate)} / ${GOLD_RATE_UNIT_LABELS[gjRateUnit]}` },
        ...(typeof gjMaking === 'number' ? [{ label: 'Making Charges', value: gjMakingType === 'percentage' ? `${gjMaking}%` : `${formatMoney(gjMaking)} / g` }] : []),
        ...(typeof gjWastage === 'number' && gjWastage > 0 ? [{ label: 'Wastage', value: `${gjWastage}%` }] : []),
        ...(typeof gjTax === 'number' && gjTax > 0 ? [{ label: 'Applicable Tax (GST)', value: `${gjTax}%` }] : []),
      ],
      outputs: [
        { label: 'Final Total Billing Price', value: formatMoney(gjResult.finalPrice), isHighlight: true },
        { label: 'Net Metal Value', value: formatMoney(gjResult.goldValue) },
        { label: 'Making & Wastage Charges', value: formatMoney(gjResult.makingChargeAmount) },
        { label: 'Taxes (GST/VAT)', value: formatMoney(gjResult.taxAmount) },
      ],
      customUrlParams: {
        w: gjWeight,
        u: gjUnit,
        p: gjPurity,
        r: gjRate,
        m: gjMaking,
      },
    };
  }, [gjResult, gjWeight, gjUnit, gjPurity, gjCustomPurity, gjRate, gjRateUnit, gjMaking, gjMakingType, gjWastage, gjTax, formatMoney]);

  // =========================================================================
  // 5. GOLD INVESTMENT RETURN CALCULATOR STATE & LOGIC
  // =========================================================================
  const [giMode, setGiMode] = useSessionState<GoldInvestmentMode>('gi_mode', 'quantity');
  const [giQty, setGiQty] = useSessionState<number | ''>('gi_qty', '');
  const [giAmt, setGiAmt] = useSessionState<number | ''>('gi_amt', '');
  const [giUnit, setGiUnit] = useSessionState<GoldWeightUnit>('gi_unit', 'g');
  const [giBuyPrice, setGiBuyPrice] = useSessionState<number | ''>('gi_buy_price', '');
  const [giCurrPrice, setGiCurrPrice] = useSessionState<number | ''>('gi_curr_price', '');
  const [giBuyDate, setGiBuyDate] = useSessionState<string>('gi_buy_date', '');
  const [giSellDate, setGiSellDate] = useSessionState<string>('gi_sell_date', '');
  const [giBuyCosts, setGiBuyCosts] = useSessionState<number | ''>('gi_buy_costs', '');
  const [giSellCosts, setGiSellCosts] = useSessionState<number | ''>('gi_sell_costs', '');

  const giResult = useMemo(() => {
    return calculateGoldInvestmentReturn({
      mode: giMode,
      purchaseAmount: giAmt,
      quantity: giQty,
      weightUnit: giUnit,
      purchasePrice: giBuyPrice,
      currentPrice: giCurrPrice,
      purchaseDate: giBuyDate,
      saleDate: giSellDate,
      purchaseCosts: giBuyCosts,
      sellingCosts: giSellCosts,
    });
  }, [
    giMode,
    giAmt,
    giQty,
    giUnit,
    giBuyPrice,
    giCurrPrice,
    giBuyDate,
    giSellDate,
    giBuyCosts,
    giSellCosts,
  ]);

  const handleResetGoldInvestment = () => {
    setGiMode('quantity');
    setGiQty('');
    setGiAmt('');
    setGiUnit('g');
    setGiBuyPrice('');
    setGiCurrPrice('');
    setGiBuyDate('');
    setGiSellDate('');
    setGiBuyCosts('');
    setGiSellCosts('');
  };

  const giDonutSegments: DonutSegment[] = useMemo(() => {
    if (!giResult || giResult.netCurrentValue <= 0) return [];
    if (giResult.absoluteProfitLoss >= 0) {
      return [
        {
          label: 'Total Invested',
          value: giResult.totalInitialInvestment,
          color: '#3b82f6',
          formattedValue: formatMoney(giResult.totalInitialInvestment),
        },
        {
          label: 'Net Gain (Profit)',
          value: giResult.absoluteProfitLoss,
          color: '#10b981',
          formattedValue: formatMoney(giResult.absoluteProfitLoss),
        },
      ];
    } else {
      return [
        {
          label: 'Remaining Value',
          value: Math.max(0, giResult.netCurrentValue),
          color: '#3b82f6',
          formattedValue: formatMoney(giResult.netCurrentValue),
        },
        {
          label: 'Capital Loss',
          value: Math.abs(giResult.absoluteProfitLoss),
          color: '#ef4444',
          formattedValue: formatMoney(Math.abs(giResult.absoluteProfitLoss)),
        },
      ];
    }
  }, [giResult, formatMoney]);

  const girShareData = useMemo<CalculationShareData | null>(() => {
    if (!giResult || !giResult.isValid) return null;
    return {
      toolSlug: 'gold-investment-return-calculator',
      toolName: 'Gold Investment Return Calculator',
      categorySlug: 'finance',
      inputs: [
        ...(typeof giBuyPrice === 'number' ? [{ label: 'Purchase Price', value: `${formatMoney(giBuyPrice)} / ${GOLD_WEIGHT_UNIT_LABELS[giUnit]}` }] : []),
        ...(typeof giCurrPrice === 'number' ? [{ label: 'Current Selling Price', value: `${formatMoney(giCurrPrice)} / ${GOLD_WEIGHT_UNIT_LABELS[giUnit]}` }] : []),
        ...(giMode === 'quantity' && typeof giQty === 'number' ? [{ label: 'Quantity Held', value: `${giQty} ${GOLD_WEIGHT_UNIT_LABELS[giUnit]}` }] : []),
        ...(giMode === 'amount' && typeof giAmt === 'number' ? [{ label: 'Capital Invested', value: formatMoney(giAmt) }] : []),
        ...(giBuyDate ? [{ label: 'Buy Date', value: giBuyDate }] : []),
        ...(giSellDate ? [{ label: 'Sell Date', value: giSellDate }] : []),
      ],
      outputs: [
        { label: 'Net Profit / Loss', value: `${giResult.absoluteProfitLoss >= 0 ? '+' : ''}${formatMoney(giResult.absoluteProfitLoss)}`, isHighlight: true },
        { label: 'Current Net Value', value: formatMoney(giResult.netCurrentValue) },
        { label: 'Total Invested Capital', value: formatMoney(giResult.totalInitialInvestment) },
        { label: 'Total Return', value: `${giResult.returnPercent >= 0 ? '+' : ''}${giResult.returnPercent.toFixed(2)}%` },
        ...(giResult.annualizedReturnCAGR !== undefined ? [{ label: 'Annualized CAGR', value: `${giResult.annualizedReturnCAGR.toFixed(2)}% p.a.` }] : []),
      ],
      customUrlParams: {
        mode: giMode,
        buy: giBuyPrice,
        curr: giCurrPrice,
        ...(giMode === 'quantity' ? { qty: giQty } : { amt: giAmt }),
      },
    };
  }, [giResult, giBuyPrice, giCurrPrice, giMode, giQty, giAmt, giUnit, giBuyDate, giSellDate, formatMoney]);

  // =========================================================================
  // VIEW 1: GOLD VALUE CALCULATOR
  // =========================================================================
  if (toolSlug === 'gold-value-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="gold-value-calculator-workspace"
        title="Gold Value Calculator"
        description="Calculate the true intrinsic value of gold items across weight units and karat purities."
        badge="PRECIOUS METALS"
        onReset={handleResetGoldValue}
        calculationData={gvShareData}
        inputs={
          <div className="space-y-4">
            <UnitNumberInput
              id="gv-weight-input"
              label="Gold Weight"
              value={gvWeight}
              onChange={setGvWeight}
              currentUnit={gvUnit}
              onUnitChange={(u) => setGvUnit(u as GoldWeightUnit)}
              units={Object.entries(GOLD_WEIGHT_UNIT_LABELS).map(([key, label]) => ({
                id: key,
                label: label,
                symbol: key === 'g' ? 'Grams (g)' : key === 'oz' ? 'Oz (troy)' : key === 'tola' ? 'Tola' : key === 'sovereign' ? 'Pavan' : key === 'kg' ? 'kg' : key,
              }))}
              placeholder="e.g. 10"
              helpText="Total physical item mass"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Purity / Karat</label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {gvPurity === 'custom'
                    ? `${typeof gvCustomPurity === 'number' ? gvCustomPurity : 0}% Custom`
                    : STANDARD_CARAT_PURITIES[gvPurity as number]?.name}
                </span>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {[24, 22, 21, 18, 14, 10, 'custom'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    id={`gv-purity-${k}`}
                    onClick={() => setGvPurity(k as GoldCarat)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      gvPurity === k
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {k === 'custom' ? 'Custom' : `${k}K`}
                  </button>
                ))}
              </div>
              {gvPurity === 'custom' && (
                <div className="mt-2.5">
                  <NumberSliderInput
                    id="gv-custom-purity-input"
                    label="Custom Purity Percentage"
                    value={gvCustomPurity}
                    onChange={setGvCustomPurity}
                    min={1}
                    max={100}
                    step={0.1}
                    suffix="%"
                    placeholder="e.g. 91.67 or 75.0"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Rate Reference Method</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="gv-rate-basis-24k"
                  onClick={() => setGvRateBasis('24k_reference')}
                  className={`p-2 text-left rounded-xl border text-xs font-medium transition-all ${
                    gvRateBasis === '24k_reference'
                      ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">24K Benchmark Rate</div>
                  <div className="text-[11px] text-slate-500">Auto-discounts by selected fineness</div>
                </button>
                <button
                  type="button"
                  id="gv-rate-basis-purity"
                  onClick={() => setGvRateBasis('selected_purity')}
                  className={`p-2 text-left rounded-xl border text-xs font-medium transition-all ${
                    gvRateBasis === 'selected_purity'
                      ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">Direct Karat Rate</div>
                  <div className="text-[11px] text-slate-500">Rate is already specific to {gvPurity === 'custom' ? 'purity' : `${gvPurity}K`}</div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div className="sm:col-span-2">
                <CurrencyInput
                  id="gv-rate-input"
                  label={gvRateBasis === '24k_reference' ? '24K Pure Gold Market Rate' : `Direct Rate for ${gvPurity === 'custom' ? 'Custom Purity' : `${gvPurity}K`}`}
                  value={gvRate}
                  onChange={setGvRate}
                  placeholder="Enter market rate (e.g. 75 or 7,000)"
                  helpText="Current market price"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Rate Basis Unit</label>
                <select
                  id="gv-rate-unit-select"
                  value={gvRateUnit}
                  onChange={(e) => setGvRateUnit(e.target.value as GoldRateUnit)}
                  className="w-full h-11 px-3 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                >
                  {Object.entries(GOLD_RATE_UNIT_LABELS).map(([unitKey, label]) => (
                    <option key={unitKey} value={unitKey}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        }
        results={
          gvResult ? (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">Total Gold Value</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {gvResult.purityPercent.toFixed(2)}% Fineness
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {formatMoney(gvResult.goldValue, true)}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Effective rate: <strong className="text-slate-800">{formatMoney(gvResult.effectiveRatePerGram)} / gram</strong>
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Gross Weight</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {gvResult.grossWeight} {gvResult.weightUnit}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ({gvResult.grossWeightInGrams.toFixed(3)} grams)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Pure Gold Content</div>
                  <div className="text-base font-bold text-amber-700 mt-0.5">
                    {gvResult.pureGoldWeightInSelectedUnit.toFixed(3)} {gvResult.weightUnit}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ({gvResult.pureGoldWeightInGrams.toFixed(3)} g pure)
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Alloy Content</div>
                  <div className="text-base font-bold text-slate-700 mt-0.5">
                    {(gvResult.grossWeightInGrams - gvResult.pureGoldWeightInGrams).toFixed(3)} g
                  </div>
                  <div className="text-[11px] text-slate-400">
                    ({(100 - gvResult.purityPercent).toFixed(1)}% base metals)
                  </div>
                </div>
              </div>

              {gvMatrix.length > 0 && gvRateBasis === '24k_reference' && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Valuation across standard purities</span>
                    <span className="text-[11px] text-slate-400 lowercase">for same weight</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    {gvMatrix.map((item) => (
                      <div
                        key={item.carat}
                        className={`flex items-center justify-between px-3 py-2 ${
                          gvPurity === item.carat ? 'bg-amber-50 font-semibold' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            gvPurity === item.carat ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {item.carat}K
                          </span>
                          <span className="text-slate-600">{item.purityPercent.toFixed(1)}%</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{formatMoney(item.value, true)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-[11px] text-blue-800 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                {gvResult.methodology}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <Coins className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Gold Inputs</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Enter physical gold weight and current market price rate to calculate exact intrinsic value and pure gold content.
              </p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 2: GOLD LOAN CALCULATOR
  // =========================================================================
  if (toolSlug === 'gold-loan-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="gold-loan-calculator-workspace"
        title="Gold Loan Calculator"
        description="Estimate maximum sanctionable loan amount, LTV regulatory limits, and EMI or bullet repayment plans."
        badge="SECURED LOANS"
        onReset={handleResetGoldLoan}
        calculationData={glShareData}
        inputs={
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gl-weight-input" className="text-xs font-bold text-slate-700">
                  Collateral Net Gold Weight
                </label>
                <span className="text-[11px] text-slate-400">Excluding stones/lac</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <NumberSliderInput
                    id="gl-weight-input"
                    label=""
                    value={glWeight}
                    onChange={setGlWeight}
                    min={0.1}
                    max={10000}
                    step={0.1}
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <select
                    id="gl-weight-unit-select"
                    value={glUnit}
                    onChange={(e) => setGlUnit(e.target.value as GoldWeightUnit)}
                    className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    {Object.entries(GOLD_WEIGHT_UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Gold Karat</label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {glPurity === 'custom' ? 'Custom' : `${glPurity}K (${STANDARD_CARAT_PURITIES[glPurity as number]?.percent.toFixed(1)}%)`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[24, 22, 20, 18, 'custom'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    id={`gl-purity-${k}`}
                    onClick={() => setGlPurity(k as GoldCarat)}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      glPurity === k
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {k === 'custom' ? 'Custom' : `${k}K`}
                  </button>
                ))}
              </div>
              {glPurity === 'custom' && (
                <div className="mt-2">
                  <NumberSliderInput
                    id="gl-custom-purity-input"
                    label="Custom Fineness %"
                    value={glCustomPurity}
                    onChange={setGlCustomPurity}
                    min={1}
                    max={100}
                    step={0.1}
                    suffix="%"
                    placeholder="e.g. 91.67"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gl-rate-input" className="text-xs font-bold text-slate-700">
                  24K Reference Benchmark Rate
                </label>
                <span className="text-[11px] text-slate-400">Lender valuation rate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <NumberSliderInput
                    id="gl-rate-input"
                    label=""
                    value={glRate}
                    onChange={setGlRate}
                    min={1}
                    max={10000000}
                    step={1}
                    prefix={currencySymbol}
                    placeholder="e.g. 7000 or 75"
                    formattedDisplay={typeof glRate === 'number' && glRate > 0 ? formatMoney(glRate) : undefined}
                  />
                </div>
                <div>
                  <select
                    id="gl-rate-unit-select"
                    value={glRateUnit}
                    onChange={(e) => setGlRateUnit(e.target.value as GoldRateUnit)}
                    className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    {Object.entries(GOLD_RATE_UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberSliderInput
                id="gl-ltv-input"
                label="Permissible LTV %"
                value={glLtv}
                onChange={setGlLtv}
                min={10}
                max={90}
                step={1}
                suffix="%"
                placeholder="75"
                helpText="Standard regulatory cap is 75%"
              />

              <NumberSliderInput
                id="gl-desired-loan-input"
                label="Desired Loan Amount (Optional)"
                value={glDesiredLoan}
                onChange={setGlDesiredLoan}
                min={0}
                max={100000000}
                step={1000}
                prefix={currencySymbol}
                placeholder="Leave blank for max"
                helpText="Leave blank for maximum eligible"
                formattedDisplay={typeof glDesiredLoan === 'number' && glDesiredLoan > 0 ? formatMoney(glDesiredLoan) : undefined}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberSliderInput
                id="gl-interest-input"
                label="Annual Interest Rate %"
                value={glInterestRate}
                onChange={setGlInterestRate}
                min={0}
                max={40}
                step={0.1}
                suffix="% p.a."
                placeholder="e.g. 9.0"
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Loan Tenure</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <NumberSliderInput
                      id="gl-term-input"
                      label=""
                      value={glTerm}
                      onChange={setGlTerm}
                      min={1}
                      max={120}
                      step={1}
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div className="w-24">
                    <select
                      id="gl-term-unit-select"
                      value={glTermUnit}
                      onChange={(e) => setGlTermUnit(e.target.value as 'months' | 'years')}
                      className="w-full h-[42px] px-2.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Repayment Structure</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'emi', title: 'Monthly EMI', desc: 'Amortizes principal + interest' },
                  { id: 'interest_only', title: 'Interest-Only', desc: 'Monthly interest, principal at end' },
                  { id: 'bullet_end', title: 'Lump Sum Bullet', desc: 'Principal + interest at term end' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    id={`gl-repayment-${item.id}`}
                    onClick={() => setGlRepayment(item.id as GoldLoanRepaymentMethod)}
                    className={`p-2.5 text-left rounded-xl border transition-all ${
                      glRepayment === item.id
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        }
        results={
          glResult ? (
            <div className="space-y-5">
              {!glResult.isEligible ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Requested Loan Exceeds Max LTV: </strong>
                    Requested {formatMoney(glResult.requestedLoan)} exceeds the sanction limit of {formatMoney(glResult.maxEligibleLoan)}. Lenders typically cap disbursement at {glResult.ltvPercent}% LTV.
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Loan Sanction Eligible: </strong>
                    Active principal is {formatMoney(glResult.activeLoanPrincipal)} at an actual LTV of {glResult.actualLtvPercent.toFixed(1)}% (within the {glResult.ltvPercent}% limit).
                  </div>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-linear-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                    {glResult.repaymentMethod === 'emi' ? 'Monthly EMI' : glResult.repaymentMethod === 'interest_only' ? 'Monthly Interest Due' : 'Single Final Bullet Payment'}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    {glResult.termMonths} Months @ {glResult.interestRateAnnual}%
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {formatMoney(glResult.periodicPayment, true)}
                  {glResult.repaymentMethod !== 'bullet_end' && (
                    <span className="text-base font-normal text-slate-500"> / month</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    Collateral Valuation: <strong className="text-slate-800">{formatMoney(glResult.estimatedGoldValue)}</strong>
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Max Eligible Loan</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {formatMoney(glResult.maxEligibleLoan)}
                  </div>
                  <div className="text-[11px] text-slate-400">({glResult.ltvPercent}% of gold value)</div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Interest</div>
                  <div className="text-base font-bold text-amber-600 mt-0.5">
                    {formatMoney(glResult.totalInterest)}
                  </div>
                  <div className="text-[11px] text-slate-400">Total finance cost</div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Repayment</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {formatMoney(glResult.totalRepayment)}
                  </div>
                  <div className="text-[11px] text-slate-400">Principal + interest</div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Loan Capital vs Interest Cost
                </div>
                <div className="flex justify-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <DonutChart
                    segments={glDonutSegments}
                    size={160}
                    strokeWidth={22}
                    centerLabel="Total Outflow"
                    centerValue={formatMoney(glResult.totalRepayment)}
                  />
                </div>
              </div>

              {glResult.schedule.length > 0 && (
                <div className="pt-1">
                  <button
                    type="button"
                    id="gl-toggle-schedule-btn"
                    onClick={() => setGlShowSchedule(!glShowSchedule)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100/70 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-colors"
                  >
                    <span>View {glResult.termMonths}-Month Payment Schedule</span>
                    {glShowSchedule ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {glShowSchedule && (
                    <div className="mt-2 border border-slate-200 rounded-xl overflow-x-auto max-h-60 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50 text-slate-600 font-semibold sticky top-0 border-b border-slate-200">
                          <tr>
                            <th className="p-2">Mo</th>
                            <th className="p-2">Opening</th>
                            <th className="p-2">Principal</th>
                            <th className="p-2">Interest</th>
                            <th className="p-2">Payment</th>
                            <th className="p-2">Closing</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {glResult.schedule.map((row) => (
                            <tr key={row.period} className="hover:bg-slate-50">
                              <td className="p-2 font-bold text-slate-800">{row.period}</td>
                              <td className="p-2 text-slate-600">{formatMoney(row.openingBalance)}</td>
                              <td className="p-2 text-blue-700 font-medium">{formatMoney(row.principalPaid)}</td>
                              <td className="p-2 text-amber-600 font-medium">{formatMoney(row.interestPaid)}</td>
                              <td className="p-2 font-bold text-slate-900">{formatMoney(row.totalPayment)}</td>
                              <td className="p-2 text-slate-600">{formatMoney(row.closingBalance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                {glResult.methodSummary}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
                <Scale className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Loan Details</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Enter gold weight, market rate, interest rate, and loan tenure to calculate maximum eligible borrowing and repayment schedules.
              </p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 3: GOLD PURITY CALCULATOR
  // =========================================================================
  if (toolSlug === 'gold-purity-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="gold-purity-calculator-workspace"
        title="Gold Purity Calculator"
        description="Convert gold purities between Karats, percentage fineness, and millesimal hallmarks."
        badge="ASSAY CONVERTER"
        onReset={handleResetGoldPurity}
        calculationData={gpShareData}
        inputs={
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gp-weight-input" className="text-xs font-bold text-slate-700">
                  Item Gross Weight
                </label>
                <span className="text-[11px] text-slate-400">Total physical mass</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <NumberSliderInput
                    id="gp-weight-input"
                    label=""
                    value={gpWeight}
                    onChange={setGpWeight}
                    min={0.01}
                    max={10000}
                    step={0.01}
                    placeholder="e.g. 25"
                  />
                </div>
                <div>
                  <select
                    id="gp-weight-unit-select"
                    value={gpUnit}
                    onChange={(e) => setGpUnit(e.target.value as GoldWeightUnit)}
                    className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    {Object.entries(GOLD_WEIGHT_UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Select Karat Standard</label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {gpCarat === 'custom' ? 'Custom Fineness' : `${gpCarat}K`}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {[24, 23, 22, 21, 20, 18, 14, 10].map((k) => {
                  const std = STANDARD_CARAT_PURITIES[k];
                  return (
                    <button
                      key={k}
                      type="button"
                      id={`gp-carat-${k}`}
                      onClick={() => setGpCarat(k as GoldCarat)}
                      className={`p-2 text-left rounded-xl border transition-all ${
                        gpCarat === k
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{k}K</span>
                        <span className={`text-[10px] font-mono px-1 rounded ${
                          gpCarat === k ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {std?.hallmark}
                        </span>
                      </div>
                      <div className={`text-[11px] mt-0.5 ${gpCarat === k ? 'text-amber-100' : 'text-slate-500'}`}>
                        {((k / 24) * 100).toFixed(1)}%
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-2.5">
                <button
                  type="button"
                  id="gp-carat-custom"
                  onClick={() => setGpCarat('custom')}
                  className={`w-full p-2 text-left rounded-xl border text-xs font-semibold transition-all ${
                    gpCarat === 'custom'
                      ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Custom Laboratory Spectrometer Purity %
                </button>
                {gpCarat === 'custom' && (
                  <div className="mt-2">
                    <NumberSliderInput
                      id="gp-custom-purity-input"
                      label="Assayed Gold Percentage"
                      value={gpCustomPurity}
                      onChange={setGpCustomPurity}
                      min={1}
                      max={100}
                      step={0.01}
                      suffix="%"
                      placeholder="e.g. 91.67 or 85.2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        }
        results={
          gpResult ? (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Millesimal Hallmark Code
                  </span>
                  <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs">
                    {gpResult.hallmarkCode}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {gpResult.purityPercent.toFixed(2)}% Pure Gold
                </div>
                <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Equivalent 24K mass: <strong className="text-slate-800">{gpResult.pureGoldWeight.toFixed(4)} {gpResult.weightUnit}</strong>
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50">
                  <div className="text-[11px] font-semibold text-amber-900 uppercase">Pure Gold Mass</div>
                  <div className="text-lg font-extrabold text-amber-700 mt-0.5">
                    {gpResult.pureGoldWeight.toFixed(3)} {gpResult.weightUnit}
                  </div>
                  <div className="text-[11px] text-amber-800">
                    ({gpResult.pureGoldWeightInGrams.toFixed(3)} grams)
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-600 uppercase">Non-Gold Alloy Mass</div>
                  <div className="text-lg font-extrabold text-slate-700 mt-0.5">
                    {gpResult.nonGoldWeight.toFixed(3)} {gpResult.weightUnit}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    ({gpResult.nonGoldWeightInGrams.toFixed(3)} grams)
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Composition by Mass
                </div>
                <div className="flex justify-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <DonutChart
                    segments={gpDonutSegments}
                    size={150}
                    strokeWidth={20}
                    centerLabel="Total Weight"
                    centerValue={`${gpResult.grossWeight} ${gpResult.weightUnit}`}
                  />
                </div>
              </div>

              {gpComparisonTable.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Universal Fineness Comparison Table
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                    <div className="grid grid-cols-12 px-3 py-2 bg-slate-50 font-bold text-slate-600">
                      <div className="col-span-3">Standard</div>
                      <div className="col-span-3">Hallmark</div>
                      <div className="col-span-3">Fineness</div>
                      <div className="col-span-3 text-right">Pure Content</div>
                    </div>
                    {gpComparisonTable.map((row) => (
                      <div
                        key={row.carat}
                        className={`grid grid-cols-12 px-3 py-2 items-center ${
                          row.isSelected ? 'bg-amber-50 font-semibold text-amber-900' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="col-span-3 flex items-center gap-1.5">
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            row.isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {row.carat}K
                          </span>
                        </div>
                        <div className="col-span-3 font-mono font-bold text-slate-600">{row.hallmark}</div>
                        <div className="col-span-3 text-slate-600">{row.purityPercent}</div>
                        <div className="col-span-3 text-right font-bold text-slate-800">{row.pureWeight}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                {gpResult.alloyDescription}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Gold Mass</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Enter item weight and select a Karat standard to view purity percentages, official hallmark stamps, and pure gold content.
              </p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 4: GOLD JEWELLERY COST CALCULATOR
  // =========================================================================
  if (toolSlug === 'gold-jewellery-cost-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="gold-jewellery-cost-calculator-workspace"
        title="Gold Jewellery Cost Calculator"
        description="Calculate retail jewellery invoice total including raw gold, making charges, wastage, and taxes."
        badge="RETAIL PRICING"
        onReset={handleResetGoldJewellery}
        calculationData={gjcShareData}
        inputs={
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gj-weight-input" className="text-xs font-bold text-slate-700">
                  Ornament Weight
                </label>
                <span className="text-[11px] text-slate-400">Net gold weight</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <NumberSliderInput
                    id="gj-weight-input"
                    label=""
                    value={gjWeight}
                    onChange={setGjWeight}
                    min={0.1}
                    max={1000}
                    step={0.1}
                    placeholder="e.g. 20"
                  />
                </div>
                <div>
                  <select
                    id="gj-weight-unit-select"
                    value={gjUnit}
                    onChange={(e) => setGjUnit(e.target.value as GoldWeightUnit)}
                    className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    {Object.entries(GOLD_WEIGHT_UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Purity / Karat</label>
                <span className="text-[11px] text-slate-500 font-medium">
                  {gjPurity === 'custom' ? 'Custom' : `${gjPurity}K (${STANDARD_CARAT_PURITIES[gjPurity as number]?.name})`}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[24, 22, 20, 18, 14].map((k) => (
                  <button
                    key={k}
                    type="button"
                    id={`gj-purity-${k}`}
                    onClick={() => setGjPurity(k as GoldCarat)}
                    className={`px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      gjPurity === k
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {k}K
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gj-rate-input" className="text-xs font-bold text-slate-700">
                  {gjRateBasis === '24k_reference' ? '24K Benchmark Rate' : `${gjPurity}K Direct Rate`}
                </label>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setGjRateBasis(gjRateBasis === '24k_reference' ? 'selected_purity' : '24k_reference')}
                    className="text-blue-600 font-semibold underline cursor-pointer"
                  >
                    {gjRateBasis === '24k_reference' ? 'Switch to Karat Rate' : 'Switch to 24K Ref'}
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <NumberSliderInput
                    id="gj-rate-input"
                    label=""
                    value={gjRate}
                    onChange={setGjRate}
                    min={1}
                    max={10000000}
                    step={1}
                    prefix={currencySymbol}
                    placeholder="e.g. 7000 or 75"
                    formattedDisplay={typeof gjRate === 'number' && gjRate > 0 ? formatMoney(gjRate) : undefined}
                  />
                </div>
                <div>
                  <select
                    id="gj-rate-unit-select"
                    value={gjRateUnit}
                    onChange={(e) => setGjRateUnit(e.target.value as GoldRateUnit)}
                    className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                  >
                    {Object.entries(GOLD_RATE_UNIT_LABELS).map(([unitKey, label]) => (
                      <option key={unitKey} value={unitKey}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="gj-making-input" className="text-xs font-bold text-slate-700">
                  Making Charges
                </label>
                <div className="flex gap-1">
                  {(['percentage', 'per_gram', 'fixed'] as MakingChargeType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      id={`gj-making-type-${type}`}
                      onClick={() => setGjMakingType(type)}
                      className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
                        gjMakingType === type
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {type === 'percentage' ? '%' : type === 'per_gram' ? '/gram' : 'Flat'}
                    </button>
                  ))}
                </div>
              </div>
              <NumberSliderInput
                id="gj-making-input"
                label=""
                value={gjMaking}
                onChange={setGjMaking}
                min={0}
                max={gjMakingType === 'percentage' ? 50 : 100000}
                step={gjMakingType === 'percentage' ? 0.5 : 10}
                suffix={gjMakingType === 'percentage' ? '%' : undefined}
                prefix={gjMakingType !== 'percentage' ? currencySymbol : undefined}
                placeholder={gjMakingType === 'percentage' ? 'e.g. 10%' : 'e.g. 500'}
              />
            </div>

            <div>
              <NumberSliderInput
                id="gj-wastage-input"
                label="Wastage (Vaighat) % (Optional)"
                value={gjWastage}
                onChange={setGjWastage}
                min={0}
                max={25}
                step={0.5}
                suffix="%"
                placeholder="e.g. 3 or 4"
                helpText="Melting and polishing cutting allowance"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <NumberSliderInput
                id="gj-stones-input"
                label="Stones / Pearls (Optional)"
                value={gjStones}
                onChange={setGjStones}
                min={0}
                max={1000000}
                step={100}
                prefix={currencySymbol}
                placeholder="0"
              />

              <NumberSliderInput
                id="gj-other-input"
                label="Other / Hallmarking"
                value={gjOther}
                onChange={setGjOther}
                min={0}
                max={50000}
                step={10}
                prefix={currencySymbol}
                placeholder="0"
              />

              <NumberSliderInput
                id="gj-tax-input"
                label="Tax / GST %"
                value={gjTax}
                onChange={setGjTax}
                min={0}
                max={30}
                step={0.5}
                suffix="%"
                placeholder="3"
                helpText="e.g. 3% GST"
              />
            </div>
          </div>
        }
        results={
          gjResult ? (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Final Invoice Total
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {gjRecoverablePercent.toFixed(1)}% Recoverable Metal
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {formatMoney(gjResult.finalPrice, true)}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <Gem className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    Effective cost per gram: <strong className="text-slate-800">{formatMoney(gjResult.effectivePricePerGram)} / g</strong>
                  </span>
                </p>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Itemized Price Breakdown
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-white">
                    <span className="font-medium text-slate-700">Raw Gold Value</span>
                    <span className="font-bold text-slate-900">{formatMoney(gjResult.goldValue)}</span>
                  </div>

                  {gjResult.wastageCost > 0 && (
                    <div className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-medium text-slate-700">
                        Wastage ({gjResult.wastagePercent}%)
                      </span>
                      <span className="font-bold text-amber-600">+{formatMoney(gjResult.wastageCost)}</span>
                    </div>
                  )}

                  {gjResult.makingChargeAmount > 0 && (
                    <div className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-medium text-slate-700">
                        Making Charges ({gjResult.makingChargeType === 'percentage' ? `${gjResult.makingChargeEntered}%` : gjResult.makingChargeType === 'per_gram' ? `${formatMoney(gjResult.makingChargeEntered)}/g` : 'Flat'})
                      </span>
                      <span className="font-bold text-blue-600">+{formatMoney(gjResult.makingChargeAmount)}</span>
                    </div>
                  )}

                  {gjResult.stoneCharges > 0 && (
                    <div className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-medium text-slate-700">Gemstones & Beads</span>
                      <span className="font-bold text-pink-600">+{formatMoney(gjResult.stoneCharges)}</span>
                    </div>
                  )}

                  {gjResult.otherCharges > 0 && (
                    <div className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-medium text-slate-700">Hallmarking / Other</span>
                      <span className="font-bold text-purple-600">+{formatMoney(gjResult.otherCharges)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-2.5 bg-slate-50/70 font-semibold">
                    <span className="text-slate-800">Subtotal Before Taxes</span>
                    <span className="text-slate-900">{formatMoney(gjResult.subtotal)}</span>
                  </div>

                  {gjResult.taxAmount > 0 && (
                    <div className="flex justify-between items-center p-2.5 bg-white">
                      <span className="font-medium text-slate-700">Sales Tax / GST ({gjResult.taxPercent}%)</span>
                      <span className="font-bold text-emerald-600">+{formatMoney(gjResult.taxAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-3 bg-amber-500/10 font-extrabold text-sm">
                    <span className="text-slate-900">Total Purchase Cost</span>
                    <span className="text-slate-900">{formatMoney(gjResult.finalPrice, true)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Invoice Cost Composition
                </div>
                <div className="flex justify-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <DonutChart
                    segments={gjDonutSegments}
                    size={160}
                    strokeWidth={22}
                    centerLabel="Total Price"
                    centerValue={formatMoney(gjResult.finalPrice)}
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-[11px] text-blue-800 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                Raw gold makes up <strong>{gjRecoverablePercent.toFixed(1)}%</strong> of this purchase. Craftsmanship and taxes total <strong>{(100 - gjRecoverablePercent).toFixed(1)}%</strong> ({formatMoney(gjResult.finalPrice - gjResult.goldValue)}), which is non-recoverable upon immediate resale.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <Gem className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Jewellery Details</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Enter ornament weight, market rate, and making charges to calculate an itemized invoice breakdown with taxes and wastage.
              </p>
            </div>
          )
        }
      />
    );
  }

  // =========================================================================
  // VIEW 5: GOLD INVESTMENT RETURN CALCULATOR
  // =========================================================================
  if (toolSlug === 'gold-investment-return-calculator') {
    return (
      <CompactCalculatorWorkspace
        id="gold-investment-return-calculator-workspace"
        title="Gold Investment Return Calculator"
        description="Calculate absolute profits, percentage return, and annualized CAGR on gold investments."
        badge="PORTFOLIO RETURNS"
        onReset={handleResetGoldInvestment}
        calculationData={girShareData}
        inputs={
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Investment Specification Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="gi-mode-qty"
                  onClick={() => setGiMode('quantity')}
                  className={`p-2.5 text-left rounded-xl border text-xs font-medium transition-all ${
                    giMode === 'quantity'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">By Physical Quantity / Weight</div>
                  <div className="text-[11px] text-slate-500">e.g. 50 grams, 2 ounces</div>
                </button>
                <button
                  type="button"
                  id="gi-mode-amt"
                  onClick={() => setGiMode('amount')}
                  className={`p-2.5 text-left rounded-xl border text-xs font-medium transition-all ${
                    giMode === 'amount'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-900 shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-slate-900">By Total Currency Amount</div>
                  <div className="text-[11px] text-slate-500">e.g. $5,000 or ₹100,000 capital</div>
                </button>
              </div>
            </div>

            {giMode === 'quantity' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="gi-qty-input" className="text-xs font-bold text-slate-700">
                    Gold Quantity Purchased
                  </label>
                  <span className="text-[11px] text-slate-400">Total units</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <NumberSliderInput
                      id="gi-qty-input"
                      label=""
                      value={giQty}
                      onChange={setGiQty}
                      min={0.1}
                      max={100000}
                      step={0.1}
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div>
                    <select
                      id="gi-unit-select"
                      value={giUnit}
                      onChange={(e) => setGiUnit(e.target.value as GoldWeightUnit)}
                      className="w-full h-[42px] px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
                    >
                      {Object.entries(GOLD_WEIGHT_UNIT_LABELS).map(([unitKey, label]) => (
                        <option key={unitKey} value={unitKey}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <NumberSliderInput
                  id="gi-amt-input"
                  label="Total Capital Invested"
                  value={giAmt}
                  onChange={setGiAmt}
                  min={10}
                  max={100000000}
                  step={500}
                  prefix={currencySymbol}
                  placeholder="e.g. 5000"
                  formattedDisplay={typeof giAmt === 'number' && giAmt > 0 ? formatMoney(giAmt) : undefined}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberSliderInput
                id="gi-buy-price-input"
                label={`Purchase Price / ${giUnit}`}
                value={giBuyPrice}
                onChange={setGiBuyPrice}
                min={0.1}
                max={10000000}
                step={1}
                prefix={currencySymbol}
                placeholder="e.g. 5000 or 55"
                formattedDisplay={typeof giBuyPrice === 'number' && giBuyPrice > 0 ? formatMoney(giBuyPrice) : undefined}
              />

              <NumberSliderInput
                id="gi-curr-price-input"
                label={`Current / Sale Price / ${giUnit}`}
                value={giCurrPrice}
                onChange={setGiCurrPrice}
                min={0.1}
                max={10000000}
                step={1}
                prefix={currencySymbol}
                placeholder="e.g. 7500 or 75"
                formattedDisplay={typeof giCurrPrice === 'number' && giCurrPrice > 0 ? formatMoney(giCurrPrice) : undefined}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Holding Dates (Optional for CAGR)</label>
                <span className="text-[11px] text-slate-400">Leave empty if unknown</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="gi-buy-date" className="block text-[11px] font-medium text-slate-500 mb-1">
                    Purchase Date
                  </label>
                  <input
                    id="gi-buy-date"
                    type="date"
                    value={giBuyDate}
                    onChange={(e) => setGiBuyDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
                <div>
                  <label htmlFor="gi-sell-date" className="block text-[11px] font-medium text-slate-500 mb-1">
                    Valuation / Sale Date
                  </label>
                  <input
                    id="gi-sell-date"
                    type="date"
                    value={giSellDate}
                    onChange={(e) => setGiSellDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <NumberSliderInput
                id="gi-buy-costs-input"
                label="Buying Friction / Storage (Optional)"
                value={giBuyCosts}
                onChange={setGiBuyCosts}
                min={0}
                max={100000}
                step={50}
                prefix={currencySymbol}
                placeholder="0"
                helpText="Brokerage, GST, entry spread"
              />

              <NumberSliderInput
                id="gi-sell-costs-input"
                label="Selling Deductions / Exit Fees (Optional)"
                value={giSellCosts}
                onChange={setGiSellCosts}
                min={0}
                max={100000}
                step={50}
                prefix={currencySymbol}
                placeholder="0"
                helpText="Jeweler melting fee, exit load"
              />
            </div>
          </div>
        }
        results={
          giResult ? (
            <div className="space-y-5">
              <div className={`p-5 rounded-2xl border ${
                giResult.absoluteProfitLoss >= 0
                  ? 'bg-linear-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-200/80'
                  : 'bg-linear-to-br from-red-500/10 via-red-500/5 to-transparent border-red-200/80'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    giResult.absoluteProfitLoss >= 0 ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {giResult.absoluteProfitLoss >= 0 ? 'Net Absolute Profit' : 'Net Absolute Capital Loss'}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                    giResult.absoluteProfitLoss >= 0
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {giResult.returnPercent >= 0 ? '+' : ''}
                    {giResult.returnPercent.toFixed(2)}% Return
                  </span>
                </div>
                <div className={`text-3xl sm:text-4xl font-extrabold mt-2 tracking-tight ${
                  giResult.absoluteProfitLoss >= 0 ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {giResult.absoluteProfitLoss >= 0 ? '+' : '-'}
                  {formatMoney(Math.abs(giResult.absoluteProfitLoss), true)}
                </div>
                <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>
                    Net Realizable Value: <strong className="text-slate-800">{formatMoney(giResult.netCurrentValue)}</strong>
                  </span>
                </p>
              </div>

              {giResult.hasValidDates && typeof giResult.annualizedReturnCAGR === 'number' && (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                      Annualized Return (CAGR)
                    </div>
                    <div className="text-xs text-blue-700 mt-0.5">
                      Holding period: {giResult.durationText}
                    </div>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-900">
                    {giResult.annualizedReturnCAGR.toFixed(2)}%
                    <span className="text-xs font-normal text-blue-700"> / yr</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Total Outlay</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {formatMoney(giResult.totalInitialInvestment)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {giResult.purchaseCosts > 0 ? `(includes ${formatMoney(giResult.purchaseCosts)} fees)` : 'Initial investment'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Current Quantity</div>
                  <div className="text-base font-bold text-amber-700 mt-0.5">
                    {giResult.quantity.toFixed(3)} {giResult.weightUnit}
                  </div>
                  <div className="text-[11px] text-slate-400">Physical holding</div>
                </div>

                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Price Growth</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {(((giResult.currentPricePerUnit - giResult.purchasePricePerUnit) / giResult.purchasePricePerUnit) * 100).toFixed(1)}%
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {formatMoney(giResult.purchasePricePerUnit)} → {formatMoney(giResult.currentPricePerUnit)}
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Capital Distribution
                </div>
                <div className="flex justify-center p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <DonutChart
                    segments={giDonutSegments}
                    size={160}
                    strokeWidth={22}
                    centerLabel="Total Value"
                    centerValue={formatMoney(giResult.netCurrentValue)}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                This analysis accounts for total buy-in costs ({formatMoney(giResult.totalInitialInvestment)}) and net liquidation proceeds ({formatMoney(giResult.netCurrentValue)}) after transaction frictions.
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Awaiting Investment Figures</h3>
              <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                Enter your purchase quantity or investment amount, purchase price, and current market price to calculate net returns and annualized CAGR.
              </p>
            </div>
          )
        }
      />
    );
  }

  return null;
};
