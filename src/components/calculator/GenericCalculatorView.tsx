import React, { useState, useMemo, useEffect } from 'react';
import { useSessionState } from '../../utils/useSessionState';
import { RotateCcw, Share2, Printer, CheckCircle2, ArrowRight, Code2, Scale, Star, Download } from 'lucide-react';
import { ToolMetadata } from '../../types/calculator';
import { useSettings } from '../../context/SettingsContext';
import { useHistory } from '../../context/HistoryContext';
import { Breadcrumbs, BreadcrumbItem } from '../common/Breadcrumbs';
import { FAQAccordion } from '../common/FAQAccordion';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { CurrencyInput } from '../common/CurrencyInput';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';
import { DonutChart } from '../common/DonutChart';
import { EmbedModal } from '../common/EmbedModal';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { ScenarioCompareModal, ComparisonField } from '../common/ScenarioCompareModal';
import { getToolEducationalContent } from '../../data/educationalGenerator';
import { exportCalculationSummaryCSV } from '../../utils/exportUtils';
import { updatePageSEO, buildCalculatorStructuredData } from '../../utils/seo';
import { BMICalculator } from './BMICalculator';
import { EMICalculatorView } from './EMICalculatorView';
import { TravelBudgetCalculatorView } from './TravelBudgetCalculatorView';
import { InterestBetweenDatesCalculatorView } from './InterestBetweenDatesCalculatorView';
import { CalorieCalculator } from './CalorieCalculator';
import { TipCalculator } from './TipCalculator';
import { SalaryCalculator } from './SalaryCalculator';
import { UnitConverterCalculator } from './UnitConverterCalculator';
import { SquareFootageCalculator } from './SquareFootageCalculator';
import { ROICalculator } from './ROICalculator';
import { SimpleInterestCalculator } from './SimpleInterestCalculator';
import { YearlySIPCalculator } from './YearlySIPCalculator';
import { SpecializedLoanCalculator } from './SpecializedLoanCalculator';
import { FDCalculator } from './FDCalculator';
import { RDCalculator } from './RDCalculator';
import { FinancialExpandedViews } from './FinancialExpandedViews';
import { HealthExpandedViews } from './HealthExpandedViews';
import { MathExpandedViews } from './MathExpandedViews';
import { ConstructionExpandedViews } from './ConstructionExpandedViews';
import { EverydayExpandedViews } from './EverydayExpandedViews';
import { PropertyHomeBuyingExpandedViews } from './PropertyHomeBuyingExpandedViews';
import { MutualFundsExpandedViews } from './MutualFundsExpandedViews';
import { InvestmentComparisonExpandedViews } from './InvestmentComparisonExpandedViews';
import { GovernmentSchemesExpandedViews } from './GovernmentSchemesExpandedViews';
import { TaxExpandedViews } from './TaxExpandedViews';
import { PersonalFinanceExpandedViews } from './PersonalFinanceExpandedViews';
import { BusinessFinanceExpandedViews } from './BusinessFinanceExpandedViews';
import { NewCalculatorsWorkspaceView, NEW_CALCULATOR_SLUGS } from './NewCalculatorsWorkspaceView';
import { NewCalculatorsBatch2WorkspaceView, NEW_CALCULATORS_BATCH2_SLUGS } from './NewCalculatorsBatch2WorkspaceView';
import { NewCalculatorsBatch3WorkspaceView, NEW_CALCULATORS_BATCH3_SLUGS } from './NewCalculatorsBatch3WorkspaceView';
import { MasterExpansionWorkspaceViews, MASTER_EXPANSION_SLUGS } from './MasterExpansionWorkspaceViews';
import { GoldCalculatorsWorkspaceView, GOLD_CALCULATOR_SLUGS } from './GoldCalculatorsWorkspaceView';
import { PhysicsCalculatorsWorkspaceView, PHYSICS_TOOL_SLUGS } from './PhysicsCalculatorsWorkspaceView';
import { MissingCalculatorsWorkspaceView, MISSING_CALCULATORS_WORKSPACE_SLUGS } from './MissingCalculatorsWorkspaceView';
import { TaxImpactCalculatorView } from './TaxImpactCalculatorView';
import { MillionaireCalculatorView } from './MillionaireCalculatorView';
import { CalculatorCard } from '../common/CalculatorCard';
import { getCategoryTheme } from '../../data/categoryColors';
import { calculateSIP } from '../../engine/financial';
import { calculateCompoundInterest, calculatePercentage, calculateDiscount } from '../../engine/financial';
import { calculateAge } from '../../engine/everyday';
import { calculateCanonicalFuelCost, DistanceUnit, FuelEconomyUnit, VolumeUnit } from '../../engine/unitEngine';
import { UnitSelectInput } from '../common/UnitSelectInput';
import { CURRENCIES } from '../../data/currencies';
import { CurrencyCode } from '../../types/globalization';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { ToolIcon } from '../common/AppIcon';

interface GenericCalculatorViewProps {
  tool: ToolMetadata;
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onSelectTool: (slug: string) => void;
  onGoBack?: () => void;
}

export const GenericCalculatorView: React.FC<GenericCalculatorViewProps> = ({
  tool,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
  onGoBack,
}) => {
  const currentCategory = useMemo(() => CATEGORIES.find((c) => c.id === tool.category), [tool.category]);
  const categoryTheme = useMemo(() => getCategoryTheme(tool.category), [tool.category]);

  const {
    formatMoney,
    currencySymbol,
    preferences,
    countryProfile,
    setUnitOverride,
    resetUnitsToCountryDefaults,
    hasCustomUnitOverrides,
  } = useSettings();
  const { recordToolUsage, isFavorite, toggleFavorite } = useHistory();

  const isFav = isFavorite(tool.slug);
  const eduContent = useMemo(() => getToolEducationalContent(tool), [tool]);

  useEffect(() => {
    recordToolUsage(tool.slug);
  }, [tool.slug]);

  useEffect(() => {
    const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/#tool/${tool.slug}` : `https://zetacalculator.net/#tool/${tool.slug}`;
    const structuredData = buildCalculatorStructuredData(
      tool.name,
      tool.description,
      canonicalUrl,
      currentCategory?.name || 'General Calculators',
      currentCategory?.slug || 'finance',
      eduContent.faqs
    );

    updatePageSEO({
      title: `${tool.name} – Free Deterministic Calculator | Zeta Calculator`,
      description: tool.description,
      canonicalUrl,
      ogType: 'article',
      jsonLd: structuredData,
    });
  }, [tool.slug, tool.name, tool.description, currentCategory, eduContent]);

  const [shareCopied, setShareCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const financialExpandedSlugs = [
    'mortgage-calculator',
    'loan-calculator',
    'auto-loan-calculator',
    'payment-calculator',
    'amortization-calculator',
    'interest-rate-calculator',
    'retirement-calculator',
    'investment-calculator',
    'inflation-calculator',
    'income-tax-calculator',
    'sales-tax-calculator',
    'property-tax-calculator',
    'rental-yield-calculator',
    'home-affordability-calculator',
    'savings-goal-calculator',
    'annuity-calculator',
  ];

  const healthExpandedSlugs = [
    'body-fat-calculator',
    'bmr-calculator',
    'ideal-weight-calculator',
    'pace-calculator',
    'pregnancy-calculator',
    'pregnancy-conception-calculator',
    'water-intake-calculator',
  ];

  const mathExpandedSlugs = [
    'standard-calculator',
    'scientific-calculator',
    'fraction-calculator',
    'random-number-generator',
    'triangle-calculator',
    'standard-deviation-calculator',
    'average-calculator',
    'ratio-calculator',
  ];

  const constructionExpandedSlugs = [
    'concrete-calculator',
    'paint-calculator',
    'tile-calculator',
    'room-area-calculator',
    'construction-cost-calculator',
    'electricity-bill-calculator',
    'ac-btu-calculator',
  ];

  const everydayExpandedSlugs = [
    'date-difference-calculator',
    'hours-worked-calculator',
    'gpa-calculator',
    'grade-calculator',
    'password-generator',
    'subnet-calculator',
  ];

  const propertyHomeBuyingExpandedSlugs = [
    'rent-vs-buy-home-calculator',
    'interest-free-home-loan-calculator',
    'home-loan-prepayment-vs-sip-calculator',
  ];

  const mutualFundsExpandedSlugs = [
    'mutual-fund-calculator',
    'lumpsum-calculator',
    'step-up-sip-calculator',
    'step-up-sip-vs-regular-sip-calculator',
    'swp-calculator',
    'stp-calculator',
    'goal-based-sip-calculator',
    'sip-cost-of-delay-calculator',
    'sip-expense-ratio-calculator',
    'cagr-calculator',
    'xirr-calculator',
    'absolute-return-calculator',
  ];

  const investmentComparisonExpandedSlugs = [
    'sip-vs-fd-calculator',
    'sip-vs-ppf-calculator',
    'sip-vs-nps-calculator',
    'sip-vs-gold-calculator',
    'swp-vs-fd-calculator',
  ];

  const governmentSchemesExpandedSlugs = [
    'ppf-calculator',
    'nps-calculator',
    'epf-calculator',
    'ssy-calculator',
    'pomis-calculator',
    'scss-calculator',
    'kvp-calculator',
    'nsc-calculator',
    'apy-calculator',
  ];

  const taxExpandedSlugs = [
    'old-vs-new-tax-regime-calculator',
    'tax-regime-breakeven-calculator',
    'hra-calculator',
    'capital-gains-tax-calculator',
    'ltcg-tax-calculator',
    'stcg-tax-calculator',
    'freelancer-tax-calculator',
    'section-44ad-calculator',
  ];

  const personalFinanceExpandedSlugs = [
    'monthly-survival-cost-calculator',
    'emergency-fund-calculator',
    'fire-calculator',
    'financial-independence-calculator',
  ];

  const businessFinanceExpandedSlugs = [
    'gst-calculator',
    'profit-margin-calculator',
    'gross-margin-calculator',
    'net-profit-margin-calculator',
    'operating-margin-calculator',
    'break-even-calculator',
    'startup-burn-rate-calculator',
    'cash-runway-calculator',
    'working-capital-calculator',
    'current-ratio-calculator',
    'quick-ratio-calculator',
    'cash-conversion-cycle-calculator',
    'dscr-calculator',
    'business-loan-calculator',
    'markup-calculator',
    'revenue-growth-calculator',
    'revenue-calculator',
    'contribution-margin-calculator',
    'business-valuation-calculator',
    'inventory-turnover-calculator',
    'receivables-turnover-calculator',
    'payables-turnover-calculator',
    'pricing-calculator',
    'profit-target-calculator',
    'target-profit-calculator',
  ];

  const isSpecializedTool = [
    'emi-calculator',
    'travel-budget-calculator',
    'interest-between-dates-calculator',
    'bmi-calculator',
    'calorie-counter',
    'tip-calculator',
    'salary-calculator',
    'unit-converter',
    'square-footage-calculator',
    'roi-calculator',
    'simple-interest-calculator',
    'yearly-sip-calculator',
    'fd-calculator',
    'rd-calculator',
    'home-loan-calculator',
    'car-loan-calculator',
    'personal-loan-calculator',
    'education-loan-calculator',
    ...financialExpandedSlugs,
    ...healthExpandedSlugs,
    ...mathExpandedSlugs,
    ...constructionExpandedSlugs,
    ...everydayExpandedSlugs,
    ...propertyHomeBuyingExpandedSlugs,
    ...mutualFundsExpandedSlugs,
    ...investmentComparisonExpandedSlugs,
    ...governmentSchemesExpandedSlugs,
    ...taxExpandedSlugs,
    ...personalFinanceExpandedSlugs,
    ...businessFinanceExpandedSlugs,
    ...NEW_CALCULATOR_SLUGS,
    ...NEW_CALCULATORS_BATCH2_SLUGS,
    ...NEW_CALCULATORS_BATCH3_SLUGS,
    ...MASTER_EXPANSION_SLUGS,
    ...GOLD_CALCULATOR_SLUGS,
    ...PHYSICS_TOOL_SLUGS,
    ...MISSING_CALCULATORS_WORKSPACE_SLUGS,
    'tax-impact-calculator',
    'millionaire-calculator',
  ].includes(tool.slug);

  // States for SIP (Empty defaults following strict input rule, persisted across navigation)
  const [sipMonthly, setSipMonthly] = useSessionState<number | ''>('gen_sip_monthly', '');
  const [sipRate, setSipRate] = useSessionState<number | ''>('gen_sip_rate', '');
  const [sipYears, setSipYears] = useSessionState<number | ''>('gen_sip_years', '');

  // States for Compound Interest (Empty defaults)
  const [ciPrincipal, setCiPrincipal] = useSessionState<number | ''>('gen_ci_principal', '');
  const [ciRate, setCiRate] = useSessionState<number | ''>('gen_ci_rate', '');
  const [ciYears, setCiYears] = useSessionState<number | ''>('gen_ci_years', '');
  const [ciMonths, setCiMonths] = useSessionState<number | ''>('gen_ci_months', '');
  const [ciDays, setCiDays] = useSessionState<number | ''>('gen_ci_days', '');
  const [ciFreq, setCiFreq] = useSessionState<number>('gen_ci_freq', 4); // Quarterly

  const ciNormalizedTerm = useMemo(() => {
    return normalizeTerm({ years: ciYears, months: ciMonths, days: ciDays });
  }, [ciYears, ciMonths, ciDays]);

  // States for Percentage (Empty defaults)
  const [pctType, setPctType] = useSessionState<'what_is_x_percent_of_y' | 'x_is_what_percent_of_y' | 'percentage_change'>('gen_pct_type', 'what_is_x_percent_of_y');
  const [pctVal1, setPctVal1] = useSessionState<number | ''>('gen_pct_val1', '');
  const [pctVal2, setPctVal2] = useSessionState<number | ''>('gen_pct_val2', '');

  // States for Discount (Empty defaults)
  const [discPrice, setDiscPrice] = useSessionState<number | ''>('gen_disc_price', '');
  const [discPercent, setDiscPercent] = useSessionState<number | ''>('gen_disc_pct', '');
  const [discTax, setDiscTax] = useSessionState<number | ''>('gen_disc_tax', '');

  // States for Fuel Cost (empty defaults strictly following no numerical defaults rule)
  const [fuelDist, setFuelDist] = useSessionState<number | ''>('gen_fuel_dist', '');
  const [fuelMileage, setFuelMileage] = useSessionState<number | ''>('gen_fuel_mileage', '');
  const [fuelPrice, setFuelPrice] = useSessionState<number | ''>('gen_fuel_price', '');
  const [fuelPassengers, setFuelPassengers] = useSessionState<number | ''>('gen_fuel_passengers', '');

  // Regional preferred units with user override support
  const activeDistUnit = ((preferences.unitOverrides?.fuelDistance as DistanceUnit) || countryProfile.defaults.distance) as DistanceUnit;
  const activeEconomyUnit = ((preferences.unitOverrides?.fuelEfficiency as FuelEconomyUnit) || countryProfile.defaults.fuelEconomy) as FuelEconomyUnit;
  const activePriceVolumeUnit = ((preferences.unitOverrides?.fuelPrice as VolumeUnit) || countryProfile.defaults.fuelVolume) as VolumeUnit;

  // States for Age (Empty defaults)
  const [dob, setDob] = useSessionState<string>('gen_age_dob', '');

  // States for Currency Converter (Empty defaults)
  const [fxAmount, setFxAmount] = useSessionState<number | ''>('gen_fx_amt', '');
  const [fxFrom, setFxFrom] = useSessionState<CurrencyCode>('gen_fx_from', 'USD');
  const [fxTo, setFxTo] = useSessionState<CurrencyCode>('gen_fx_to', 'INR');

  // Generic tool fallback input (strictly empty default, no shared sip monthly state)
  const [genericInput, setGenericInput] = useSessionState<number | ''>(`gen_val_${tool.slug}`, '');

  // Hydrate calculator inputs from URL search/hash params when opening a shared link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    const queryIndex = hash.indexOf('?');
    if (queryIndex === -1) return;
    const queryString = hash.substring(queryIndex + 1);
    const params = new URLSearchParams(queryString);

    if (tool.slug === 'sip-calculator') {
      const m = params.get('monthly') || params.get('m');
      const r = params.get('rate') || params.get('r');
      const y = params.get('years') || params.get('y') || params.get('t');
      if (m && !isNaN(Number(m))) setSipMonthly(Number(m));
      if (r && !isNaN(Number(r))) setSipRate(Number(r));
      if (y && !isNaN(Number(y))) setSipYears(Number(y));
    } else if (tool.slug === 'compound-interest-calculator') {
      const p = params.get('p') || params.get('principal');
      const r = params.get('r') || params.get('rate');
      const t = params.get('t') || params.get('years');
      const f = params.get('f') || params.get('freq');
      if (p && !isNaN(Number(p))) setCiPrincipal(Number(p));
      if (r && !isNaN(Number(r))) setCiRate(Number(r));
      if (t && !isNaN(Number(t))) setCiYears(Number(t));
      if (f && !isNaN(Number(f))) setCiFreq(Number(f));
    } else if (tool.slug === 'discount-calculator') {
      const p = params.get('price') || params.get('p');
      const d = params.get('disc') || params.get('d');
      const t = params.get('tax');
      if (p && !isNaN(Number(p))) setDiscPrice(Number(p));
      if (d && !isNaN(Number(d))) setDiscPercent(Number(d));
      if (t && !isNaN(Number(t))) setDiscTax(Number(t));
    } else if (tool.slug === 'percentage-calculator') {
      const type = params.get('type') as any;
      const v1 = params.get('v1');
      const v2 = params.get('v2');
      if (type && ['what_is_x_percent_of_y', 'x_is_what_percent_of_y', 'percentage_change'].includes(type)) {
        setPctType(type);
      }
      if (v1 && !isNaN(Number(v1))) setPctVal1(Number(v1));
      if (v2 && !isNaN(Number(v2))) setPctVal2(Number(v2));
    } else if (tool.slug === 'fuel-cost-calculator') {
      const d = params.get('dist') || params.get('d');
      const eff = params.get('eff') || params.get('m');
      const pr = params.get('price') || params.get('p');
      const pass = params.get('passengers');
      if (d && !isNaN(Number(d))) setFuelDist(Number(d));
      if (eff && !isNaN(Number(eff))) setFuelMileage(Number(eff));
      if (pr && !isNaN(Number(pr))) setFuelPrice(Number(pr));
      if (pass && !isNaN(Number(pass))) setFuelPassengers(Number(pass));
    } else if (tool.slug === 'age-calculator') {
      const dobParam = params.get('dob');
      if (dobParam) setDob(dobParam);
    } else if (tool.slug === 'currency-converter') {
      const amt = params.get('amt') || params.get('a');
      const from = params.get('from');
      const to = params.get('to');
      if (amt && !isNaN(Number(amt))) setFxAmount(Number(amt));
      if (from && from in CURRENCIES) setFxFrom(from as CurrencyCode);
      if (to && to in CURRENCIES) setFxTo(to as CurrencyCode);
    } else {
      const val = params.get('val') || params.get('v') || params.get('amount');
      if (val && !isNaN(Number(val))) setGenericInput(Number(val));
    }
  }, [tool.slug]);

  const handleResetCurrentTool = () => {
    switch (tool.slug) {
      case 'sip-calculator':
        setSipMonthly('');
        setSipRate('');
        setSipYears('');
        break;
      case 'compound-interest-calculator':
        setCiPrincipal('');
        setCiRate('');
        setCiYears('');
        setCiFreq(4);
        break;
      case 'percentage-calculator':
        setPctVal1('');
        setPctVal2('');
        break;
      case 'discount-calculator':
        setDiscPrice('');
        setDiscPercent('');
        setDiscTax('');
        break;
      case 'fuel-cost-calculator':
        setFuelDist('');
        setFuelMileage('');
        setFuelPrice('');
        setFuelPassengers('');
        break;
      case 'age-calculator':
        setDob('');
        break;
      case 'currency-converter':
        setFxAmount('');
        break;
      default:
        setGenericInput('');
        break;
    }
  };

  // Calculations
  const sipResult = useMemo(() => {
    if (tool.slug !== 'sip-calculator') return null;
    if (typeof sipMonthly !== 'number' || sipMonthly <= 0 || typeof sipRate !== 'number' || sipRate <= 0 || typeof sipYears !== 'number' || sipYears <= 0) {
      return null;
    }
    return calculateSIP({
      monthlyInvestment: sipMonthly,
      expectedReturnRate: sipRate,
      timePeriodYears: sipYears,
    });
  }, [tool.slug, sipMonthly, sipRate, sipYears]);

  const ciResult = useMemo(() => {
    if (tool.slug !== 'compound-interest-calculator') return null;
    if (typeof ciPrincipal !== 'number' || ciPrincipal <= 0 || typeof ciRate !== 'number' || ciRate <= 0) {
      return null;
    }
    if (!ciNormalizedTerm.isValid || ciNormalizedTerm.totalYears <= 0) {
      return null;
    }
    return calculateCompoundInterest({
      principal: ciPrincipal,
      annualRate: ciRate,
      years: ciNormalizedTerm.totalYears,
      compoundFrequency: ciFreq,
    });
  }, [tool.slug, ciPrincipal, ciRate, ciNormalizedTerm, ciFreq]);

  const pctResult = useMemo(() => {
    if (tool.slug !== 'percentage-calculator') return null;
    if (typeof pctVal1 !== 'number' || typeof pctVal2 !== 'number') return null;
    return calculatePercentage({ type: pctType, val1: pctVal1, val2: pctVal2 });
  }, [tool.slug, pctType, pctVal1, pctVal2]);

  const discResult = useMemo(() => {
    if (tool.slug !== 'discount-calculator') return null;
    if (typeof discPrice !== 'number' || discPrice <= 0 || typeof discPercent !== 'number') return null;
    return calculateDiscount({
      originalPrice: discPrice,
      discountPercentage: discPercent,
      taxPercentage: typeof discTax === 'number' ? discTax : 0,
    });
  }, [tool.slug, discPrice, discPercent, discTax]);

  const canonicalFuelResult = useMemo(() => {
    if (tool.slug !== 'fuel-cost-calculator') return null;
    if (
      fuelDist === '' ||
      fuelMileage === '' ||
      fuelPrice === '' ||
      Number(fuelDist) <= 0 ||
      Number(fuelMileage) <= 0 ||
      Number(fuelPrice) <= 0
    ) {
      return null;
    }
    return calculateCanonicalFuelCost({
      distanceValue: Number(fuelDist),
      distanceUnit: activeDistUnit,
      efficiencyValue: Number(fuelMileage),
      efficiencyUnit: activeEconomyUnit,
      priceValue: Number(fuelPrice),
      priceVolumeUnit: activePriceVolumeUnit,
      passengers: fuelPassengers === '' ? 1 : Math.max(1, Number(fuelPassengers)),
    });
  }, [
    tool.slug,
    fuelDist,
    activeDistUnit,
    fuelMileage,
    activeEconomyUnit,
    fuelPrice,
    activePriceVolumeUnit,
    fuelPassengers,
  ]);

  const ageResult = useMemo(() => {
    if (tool.slug !== 'age-calculator' || !dob) return null;
    return calculateAge(dob);
  }, [tool.slug, dob]);

  const fxResult = useMemo(() => {
    if (tool.slug !== 'currency-converter' || typeof fxAmount !== 'number' || fxAmount <= 0) return null;
    const fromConfig = CURRENCIES[fxFrom] || CURRENCIES.USD;
    const toConfig = CURRENCIES[fxTo] || CURRENCIES.INR;
    // Base is USD
    const amountInUSD = fxAmount / fromConfig.rateVsUSD;
    const converted = amountInUSD * toConfig.rateVsUSD;
    return {
      converted: Math.round(converted * 100) / 100,
      rate: Math.round((toConfig.rateVsUSD / fromConfig.rateVsUSD) * 10000) / 10000,
    };
  }, [tool.slug, fxAmount, fxFrom, fxTo]);

  // Determine if valid numeric output is present from calculation engine
  const hasValidResult = useMemo<boolean>(() => {
    switch (tool.slug) {
      case 'sip-calculator':
        return Boolean(
          sipResult &&
          typeof sipResult.totalValue === 'number' &&
          !isNaN(sipResult.totalValue) &&
          sipResult.totalValue > 0
        );
      case 'compound-interest-calculator':
        return Boolean(
          ciResult &&
          typeof ciResult.totalAmount === 'number' &&
          !isNaN(ciResult.totalAmount) &&
          ciResult.totalAmount > 0
        );
      case 'percentage-calculator':
        return Boolean(
          pctResult &&
          typeof pctResult.result === 'number' &&
          !isNaN(pctResult.result)
        );
      case 'discount-calculator':
        return Boolean(
          discResult &&
          typeof discResult.finalPrice === 'number' &&
          !isNaN(discResult.finalPrice) &&
          discResult.finalPrice >= 0
        );
      case 'fuel-cost-calculator':
        return Boolean(
          canonicalFuelResult &&
          typeof canonicalFuelResult.totalCost === 'number' &&
          !isNaN(canonicalFuelResult.totalCost) &&
          canonicalFuelResult.totalCost > 0
        );
      case 'age-calculator':
        return Boolean(
          ageResult &&
          typeof ageResult.years === 'number' &&
          !isNaN(ageResult.years)
        );
      case 'currency-converter':
        return Boolean(
          fxResult &&
          typeof fxResult.converted === 'number' &&
          !isNaN(fxResult.converted) &&
          fxResult.converted > 0
        );
      default:
        return Boolean(
          typeof genericInput === 'number' &&
          !isNaN(genericInput) &&
          genericInput > 0
        );
    }
  }, [
    tool.slug,
    sipResult,
    ciResult,
    pctResult,
    discResult,
    canonicalFuelResult,
    ageResult,
    fxResult,
    genericInput,
  ]);

  const relatedTools = TOOLS_REGISTRY.filter((t) =>
    t.slug !== tool.slug && (tool.relatedToolSlugs?.includes(t.slug) || (!tool.relatedToolSlugs?.length && t.category === tool.category))
  ).slice(0, 4);

  const comparisonFields: ComparisonField[] = useMemo(() => {
    if (tool.slug === 'sip-calculator') {
      if (!sipResult || typeof sipMonthly !== 'number' || typeof sipRate !== 'number' || typeof sipYears !== 'number') return [];
      const altSip = calculateSIP({
        monthlyInvestment: Math.round(sipMonthly * 1.25),
        expectedReturnRate: sipRate,
        timePeriodYears: sipYears,
      });
      return [
        { label: 'Monthly Investment', valA: sipMonthly, valB: Math.round(sipMonthly * 1.25), isCurrency: true },
        { label: 'Total Invested', valA: sipResult.investedAmount, valB: altSip.investedAmount, isCurrency: true },
        { label: 'Estimated Returns', valA: sipResult.estimatedReturns, valB: altSip.estimatedReturns, isCurrency: true },
        { label: 'Final Maturity Wealth', valA: sipResult.totalValue, valB: altSip.totalValue, isCurrency: true },
      ];
    }
    if (tool.slug === 'compound-interest-calculator') {
      if (!ciResult || typeof ciPrincipal !== 'number' || typeof ciRate !== 'number' || typeof ciYears !== 'number') return [];
      const altCi = calculateCompoundInterest({
        principal: ciPrincipal,
        annualRate: ciRate + 2,
        years: ciYears,
        compoundFrequency: ciFreq,
      });
      return [
        { label: 'Annual Interest Rate', valA: ciRate, valB: ciRate + 2, suffix: '%' },
        { label: 'Total Interest Earned', valA: ciResult.totalInterest, valB: altCi.totalInterest, isCurrency: true },
        { label: 'Final Balance', valA: ciResult.totalAmount, valB: altCi.totalAmount, isCurrency: true },
      ];
    }
    if (tool.slug === 'discount-calculator') {
      if (!discResult || typeof discPrice !== 'number' || typeof discPercent !== 'number') return [];
      const altDisc = calculateDiscount({
        originalPrice: discPrice,
        discountPercentage: Math.min(100, discPercent + 10),
        taxPercentage: typeof discTax === 'number' ? discTax : 0,
      });
      return [
        { label: 'Discount Rate', valA: discPercent, valB: Math.min(100, discPercent + 10), suffix: '%' },
        { label: 'Total Savings', valA: discResult.savings, valB: altDisc.savings, isCurrency: true },
        { label: 'Final Checkout Price', valA: discResult.finalPrice, valB: altDisc.finalPrice, isCurrency: true, lowerIsBetter: true },
      ];
    }
    return [];
  }, [tool.slug, sipMonthly, sipRate, sipYears, sipResult, ciPrincipal, ciRate, ciYears, ciFreq, ciResult, discPrice, discPercent, discTax, discResult]);

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    const catSlug = currentCategory ? currentCategory.slug : 'finance';

    if (tool.slug === 'sip-calculator' && sipResult && typeof sipMonthly === 'number' && typeof sipRate === 'number' && typeof sipYears === 'number') {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Monthly Investment', value: `${formatMoney(sipMonthly)} / month` },
          { label: 'Expected Annual Return', value: `${sipRate}% p.a.` },
          { label: 'Investment Duration', value: `${sipYears} Years` },
        ],
        outputs: [
          { label: 'Expected Maturity Wealth', value: formatMoney(sipResult.totalValue), isHighlight: true },
          { label: 'Total Invested', value: formatMoney(sipResult.investedAmount) },
          { label: 'Estimated Returns', value: formatMoney(sipResult.estimatedReturns) },
        ],
        customUrlParams: {
          monthly: sipMonthly,
          rate: sipRate,
          years: sipYears,
        },
      };
    }

    if (tool.slug === 'compound-interest-calculator' && ciResult && typeof ciPrincipal === 'number' && typeof ciRate === 'number' && typeof ciYears === 'number') {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Principal Deposit', value: formatMoney(ciPrincipal) },
          { label: 'Annual Interest Rate', value: `${ciRate}% p.a.` },
          { label: 'Time Horizon', value: `${ciYears} Years` },
          { label: 'Compounding Frequency', value: `${ciFreq} times / year` },
        ],
        outputs: [
          { label: 'Total Future Balance', value: formatMoney(ciResult.totalAmount), isHighlight: true },
          { label: 'Principal Deposited', value: formatMoney(ciResult.principal) },
          { label: 'Compound Interest Earned', value: formatMoney(ciResult.totalInterest) },
        ],
        customUrlParams: {
          p: ciPrincipal,
          r: ciRate,
          t: ciYears,
          f: ciFreq,
        },
      };
    }

    if (tool.slug === 'discount-calculator' && discResult && typeof discPrice === 'number' && typeof discPercent === 'number') {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Original Price', value: formatMoney(discPrice) },
          { label: 'Discount Percentage', value: `${discPercent}%` },
          ...(typeof discTax === 'number' && discTax > 0 ? [{ label: 'Sales Tax', value: `${discTax}%` }] : []),
        ],
        outputs: [
          { label: 'Final Checkout Price', value: formatMoney(discResult.finalPrice, true), isHighlight: true },
          { label: 'Total Savings', value: formatMoney(discResult.savings, true) },
          { label: 'Price After Discount', value: formatMoney(discResult.priceAfterDiscount, true) },
        ],
        customUrlParams: {
          price: discPrice,
          disc: discPercent,
          ...(typeof discTax === 'number' && discTax > 0 ? { tax: discTax } : {}),
        },
      };
    }

    if (tool.slug === 'percentage-calculator' && pctResult && typeof pctVal1 === 'number' && typeof pctVal2 === 'number') {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Value 1', value: String(pctVal1) },
          { label: 'Value 2', value: String(pctVal2) },
          { label: 'Calculation Type', value: pctType.replace(/_/g, ' ') },
        ],
        outputs: [
          { label: 'Calculated Result', value: `${pctResult.result != null ? pctResult.result.toLocaleString() : ''}${pctType !== 'what_is_x_percent_of_y' ? '%' : ''}`, isHighlight: true },
          { label: 'Formula', value: pctResult.formulaText },
        ],
        customUrlParams: {
          type: pctType,
          v1: pctVal1,
          v2: pctVal2,
        },
      };
    }

    if (tool.slug === 'fuel-cost-calculator' && canonicalFuelResult) {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Trip Distance', value: `${fuelDist} ${activeDistUnit}` },
          { label: 'Fuel Economy', value: `${fuelMileage} ${activeEconomyUnit}` },
          { label: 'Fuel Price', value: `${currencySymbol}${fuelPrice} / ${activePriceVolumeUnit}` },
          ...(fuelPassengers ? [{ label: 'Passengers', value: String(fuelPassengers) }] : []),
        ],
        outputs: [
          { label: 'Total Fuel Cost', value: formatMoney(canonicalFuelResult.totalCost, true), isHighlight: true },
          { label: 'Fuel Needed', value: `${canonicalFuelResult.displayFuelNeeded} ${canonicalFuelResult.displayFuelVolumeUnit}` },
          { label: 'Cost Per Passenger', value: formatMoney(canonicalFuelResult.costPerPassenger, true) },
        ],
        customUrlParams: {
          dist: fuelDist,
          eff: fuelMileage,
          price: fuelPrice,
          ...(fuelPassengers ? { passengers: fuelPassengers } : {}),
        },
      };
    }

    if (tool.slug === 'currency-converter' && fxResult && typeof fxAmount === 'number') {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Original Amount', value: `${CURRENCIES[fxFrom].symbol}${fxAmount.toLocaleString()} ${fxFrom}` },
          { label: 'Target Currency', value: fxTo },
        ],
        outputs: [
          { label: 'Converted Amount', value: `${CURRENCIES[fxTo].symbol}${fxResult.convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${fxTo}`, isHighlight: true },
          { label: 'Exchange Rate', value: `1 ${fxFrom} = ${fxResult.rate.toFixed(4)} ${fxTo}` },
        ],
        customUrlParams: {
          amt: fxAmount,
          from: fxFrom,
          to: fxTo,
        },
      };
    }

    if (tool.slug === 'age-calculator' && ageResult && dob) {
      return {
        toolSlug: tool.slug,
        toolName: tool.name,
        categorySlug: catSlug,
        inputs: [
          { label: 'Date of Birth', value: dob },
        ],
        outputs: [
          { label: 'Current Age', value: `${ageResult.years} Years, ${ageResult.months} Months, ${ageResult.days} Days`, isHighlight: true },
          { label: 'Total Days Lived', value: `${ageResult.totalDays.toLocaleString()} Days` },
          { label: 'Next Birthday', value: `In ${ageResult.nextBirthdayDays} Days` },
        ],
        customUrlParams: {
          dob,
        },
      };
    }

    return null;
  }, [
    tool.slug,
    tool.name,
    currentCategory,
    sipResult,
    sipMonthly,
    sipRate,
    sipYears,
    ciResult,
    ciPrincipal,
    ciRate,
    ciYears,
    ciFreq,
    discResult,
    discPrice,
    discPercent,
    discTax,
    pctResult,
    pctVal1,
    pctVal2,
    pctType,
    canonicalFuelResult,
    fuelDist,
    activeDistUnit,
    fuelMileage,
    activeEconomyUnit,
    fuelPrice,
    activePriceVolumeUnit,
    fuelPassengers,
    currencySymbol,
    fxResult,
    fxAmount,
    fxFrom,
    fxTo,
    ageResult,
    dob,
    formatMoney,
  ]);

  const handleShare = () => {
    setIsShareOpen(true);
  };

  const handleExportCSV = () => {
    if (calculationShareData) {
      exportCalculationSummaryCSV(
        tool.name,
        calculationShareData.inputs,
        calculationShareData.outputs
      );
    } else {
      exportCalculationSummaryCSV(
        tool.name,
        [{ label: 'Tool Name', value: tool.name }],
        [{ label: 'Status', value: 'Calculated successfully' }]
      );
    }
  };

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', onClick: onNavigateHome },
      {
        label: currentCategory?.name || 'Category',
        onClick: () => onNavigateCategory(tool.category),
      },
    ];

    const currentSub = currentCategory?.subcategories?.find((s) => s.id === tool.subcategory);
    if (currentSub?.name) {
      items.push({
        label: currentSub.name,
        onClick: () => onNavigateCategory(tool.category),
      });
    }

    items.push({
      label: tool.name,
      active: true,
    });

    return items;
  }, [tool, currentCategory, onNavigateHome, onNavigateCategory]);

  return (
    <article className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 w-full min-w-0">
      <Breadcrumbs items={breadcrumbItems} onBack={onGoBack} />

      <div className="mt-4 mb-6 sm:mb-8">
        {/* Top Badges & Action Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${categoryTheme.badgeBg} ${categoryTheme.badgeText} ${categoryTheme.badgeBorder}`}
            >
              {currentCategory?.name || 'Utility'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Instant Deterministic Math
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="tool-fav-btn"
              onClick={() => toggleFavorite(tool.slug)}
              title={isFav ? 'Remove from favorites' : 'Pin to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Pin to favorites'}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors shadow-2xs ${
                isFav
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-amber-600 border-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
              <span>{isFav ? 'Pinned' : 'Favorite'}</span>
            </button>

            {comparisonFields.length > 0 && (
              <button
                type="button"
                id="tool-compare-btn"
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors shadow-2xs"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            )}

            <button
              type="button"
              id="tool-export-csv-btn"
              onClick={handleExportCSV}
              title="Download results as CSV"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              id="tool-embed-btn"
              onClick={() => setIsEmbedOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Embed</span>
            </button>

            <button
              type="button"
              id="tool-share-btn"
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-600 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              {shareCopied ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
              <span>{shareCopied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              id="tool-print-btn"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="flex items-start gap-3.5 sm:gap-4 mt-2">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 border shadow-2xs ${categoryTheme.iconBg}`}
          >
            <ToolIcon slug={tool.slug} categoryId={tool.category} size={22} className="sm:hidden" />
            <ToolIcon slug={tool.slug} categoryId={tool.category} size={24} className="hidden sm:block" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {tool.name}
            </h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* CALCULATOR INTERFACE & RESULTS */}
      {isSpecializedTool ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {tool.slug === 'emi-calculator' && (
            <EMICalculatorView
              tool={tool}
              onNavigateHome={onNavigateHome}
              onNavigateCategory={onNavigateCategory}
              onSelectTool={onSelectTool}
              onGoBack={onGoBack}
            />
          )}
          {tool.slug === 'travel-budget-calculator' && (
            <TravelBudgetCalculatorView
              tool={tool}
              onNavigateHome={onNavigateHome}
              onNavigateCategory={onNavigateCategory}
              onSelectTool={onSelectTool}
              onGoBack={onGoBack}
            />
          )}
          {tool.slug === 'interest-between-dates-calculator' && (
            <InterestBetweenDatesCalculatorView
              tool={tool}
              onNavigateHome={onNavigateHome}
              onNavigateCategory={onNavigateCategory}
              onSelectTool={onSelectTool}
              onGoBack={onGoBack}
            />
          )}
          {tool.slug === 'bmi-calculator' && <BMICalculator />}
          {tool.slug === 'calorie-counter' && <CalorieCalculator />}
          {tool.slug === 'tip-calculator' && <TipCalculator />}
          {tool.slug === 'salary-calculator' && <SalaryCalculator />}
          {tool.slug === 'unit-converter' && <UnitConverterCalculator />}
          {tool.slug === 'square-footage-calculator' && <SquareFootageCalculator />}
          {tool.slug === 'roi-calculator' && <ROICalculator />}
          {tool.slug === 'simple-interest-calculator' && <SimpleInterestCalculator onSelectTool={onSelectTool} />}
          {tool.slug === 'yearly-sip-calculator' && <YearlySIPCalculator onSelectTool={onSelectTool} />}
          {tool.slug === 'fd-calculator' && <FDCalculator onSelectTool={onSelectTool} />}
          {tool.slug === 'rd-calculator' && <RDCalculator onSelectTool={onSelectTool} />}
          {['home-loan-calculator', 'car-loan-calculator', 'personal-loan-calculator', 'education-loan-calculator'].includes(tool.slug) && (
            <SpecializedLoanCalculator toolSlug={tool.slug as any} onSelectTool={onSelectTool} />
          )}
          {financialExpandedSlugs.includes(tool.slug) && (
            <FinancialExpandedViews toolSlug={tool.slug} />
          )}
          {healthExpandedSlugs.includes(tool.slug) && (
            <HealthExpandedViews toolSlug={tool.slug} />
          )}
          {mathExpandedSlugs.includes(tool.slug) && (
            <MathExpandedViews toolSlug={tool.slug} />
          )}
          {constructionExpandedSlugs.includes(tool.slug) && (
            <ConstructionExpandedViews toolSlug={tool.slug} />
          )}
          {everydayExpandedSlugs.includes(tool.slug) && (
            <EverydayExpandedViews toolSlug={tool.slug} />
          )}
          {propertyHomeBuyingExpandedSlugs.includes(tool.slug) && (
            <PropertyHomeBuyingExpandedViews toolSlug={tool.slug} />
          )}
          {mutualFundsExpandedSlugs.includes(tool.slug) && (
            <MutualFundsExpandedViews toolSlug={tool.slug} />
          )}
          {investmentComparisonExpandedSlugs.includes(tool.slug) && (
            <InvestmentComparisonExpandedViews toolSlug={tool.slug} />
          )}
          {governmentSchemesExpandedSlugs.includes(tool.slug) && (
            <GovernmentSchemesExpandedViews toolSlug={tool.slug} />
          )}
          {taxExpandedSlugs.includes(tool.slug) && (
            <TaxExpandedViews toolSlug={tool.slug} />
          )}
          {personalFinanceExpandedSlugs.includes(tool.slug) && (
            <PersonalFinanceExpandedViews toolSlug={tool.slug} />
          )}
          {businessFinanceExpandedSlugs.includes(tool.slug) && (
            <BusinessFinanceExpandedViews toolSlug={tool.slug} />
          )}
          {NEW_CALCULATOR_SLUGS.includes(tool.slug) && (
            <NewCalculatorsWorkspaceView toolSlug={tool.slug} />
          )}
          {NEW_CALCULATORS_BATCH2_SLUGS.includes(tool.slug) && (
            <NewCalculatorsBatch2WorkspaceView toolSlug={tool.slug} />
          )}
          {NEW_CALCULATORS_BATCH3_SLUGS.includes(tool.slug) && (
            <NewCalculatorsBatch3WorkspaceView toolSlug={tool.slug} />
          )}
          {MASTER_EXPANSION_SLUGS.includes(tool.slug) && (
            <MasterExpansionWorkspaceViews toolSlug={tool.slug} />
          )}
          {GOLD_CALCULATOR_SLUGS.includes(tool.slug) && (
            <GoldCalculatorsWorkspaceView toolSlug={tool.slug} />
          )}
          {PHYSICS_TOOL_SLUGS.includes(tool.slug) && (
            <PhysicsCalculatorsWorkspaceView toolSlug={tool.slug} />
          )}
          {MISSING_CALCULATORS_WORKSPACE_SLUGS.includes(tool.slug) && (
            <MissingCalculatorsWorkspaceView toolSlug={tool.slug} />
          )}
          {tool.slug === 'tax-impact-calculator' && (
            <TaxImpactCalculatorView />
          )}
          {tool.slug === 'millionaire-calculator' && (
            <MillionaireCalculatorView />
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Top Compact Calculator Workspace Header Bar */}
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100/80 text-blue-700 uppercase tracking-wider shrink-0">
                  {tool.category?.replace('-', ' ').toUpperCase() || 'CALCULATOR'}
                </span>
                <h2 className="text-sm font-bold text-slate-900 truncate">{tool.name} Workspace</h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{tool.shortDescription}</p>
            </div>
            <button
              type="button"
              id="generic-tool-reset-top-btn"
              onClick={handleResetCurrentTool}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
              title="Reset all inputs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset</span>
            </button>
          </div>

          {/* Split Workspace Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 items-stretch">
            {/* Left Column: Inputs Workspace Pane */}
            <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between min-h-full">
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Input Parameters
                  </span>
                </div>

          {/* Dynamic Input renderers */}
          {tool.slug === 'sip-calculator' && (
            <div className="space-y-5">
              {/* Switcher Tab between Monthly & Yearly SIP */}
              <div className="flex items-center justify-between p-1 bg-slate-100 rounded-xl border border-slate-200 mb-2">
                <button
                  type="button"
                  id="tab-monthly-sip-active"
                  className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-xs text-center"
                >
                  Monthly SIP
                </button>
                <button
                  type="button"
                  id="tab-switch-to-yearly-sip"
                  onClick={() => onSelectTool('yearly-sip-calculator')}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-all text-center"
                >
                  Yearly SIP
                </button>
              </div>

              <CurrencyInput
                id="sip-monthly"
                label="Monthly Investment"
                value={sipMonthly}
                onChange={(val) => setSipMonthly(val)}
                min={0}
                placeholder="e.g. 5,000"
                helpText="Monthly amount you plan to invest"
              />
              <NumberSliderInput
                id="sip-rate"
                label="Expected Annual Return (% p.a.)"
                value={sipRate}
                onChange={setSipRate}
                min={1}
                max={30}
                step={0.5}
                placeholder="e.g. 12"
                suffix="%"
              />
              <NumberSliderInput
                id="sip-years"
                label="Time Horizon (Years)"
                value={sipYears}
                onChange={setSipYears}
                min={1}
                max={40}
                step={1}
                placeholder="e.g. 15"
                suffix="Years"
              />
            </div>
          )}

          {tool.slug === 'compound-interest-calculator' && (
            <div className="space-y-5">
              <CurrencyInput
                id="ci-principal"
                label="Initial Principal Amount"
                value={ciPrincipal}
                onChange={(val) => setCiPrincipal(val)}
                min={0}
                placeholder="e.g. 25,000"
                helpText="Initial lump sum deposited or invested"
              />
              <NumberSliderInput
                id="ci-rate"
                label="Annual Interest Rate (%)"
                value={ciRate}
                onChange={setCiRate}
                min={0.5}
                max={25}
                step={0.25}
                placeholder="e.g. 7.5"
                suffix="%"
              />
              <TermInput
                id="ci-duration"
                label="Investment Duration"
                years={ciYears}
                months={ciMonths}
                days={ciDays}
                onChangeYears={(v) => setCiYears(v)}
                onChangeMonths={(v) => setCiMonths(v)}
                onChangeDays={(v) => setCiDays(v)}
                helpText="Length of time for compounding in years, months, and days"
              />
              <div>
                <label className="text-sm font-semibold text-slate-800 block mb-1">
                  Compounding Frequency
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'Yearly', val: 1 },
                    { label: 'Half-Yearly', val: 2 },
                    { label: 'Quarterly', val: 4 },
                    { label: 'Monthly', val: 12 },
                  ].map((f) => (
                    <button
                      key={f.val}
                      type="button"
                      id={`ci-freq-${f.val}`}
                      onClick={() => setCiFreq(f.val)}
                      className={`py-2 px-2 rounded-lg border font-semibold ${
                        ciFreq === f.val
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tool.slug === 'percentage-calculator' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5 pb-2">
                {[
                  { id: 'what_is_x_percent_of_y', label: 'What is X% of Y?' },
                  { id: 'x_is_what_percent_of_y', label: 'X is what % of Y?' },
                  { id: 'percentage_change', label: '% Increase / Decrease from X to Y' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    id={`pct-tab-${t.id}`}
                    onClick={() => setPctType(t.id as any)}
                    className={`text-left px-3 py-2 text-xs rounded-lg font-semibold border transition-all ${
                      pctType === t.id
                        ? 'bg-blue-50 border-blue-300 text-blue-800'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <NumberSliderInput
                id="pct-val1"
                label={pctType === 'what_is_x_percent_of_y' ? 'Percentage (X)' : 'First Value (X)'}
                value={pctVal1}
                onChange={setPctVal1}
                min={0}
                max={10000}
                step={1}
                placeholder="e.g. 20"
                suffix={pctType === 'what_is_x_percent_of_y' ? '%' : undefined}
              />
              <NumberSliderInput
                id="pct-val2"
                label="Second Value (Y)"
                value={pctVal2}
                onChange={setPctVal2}
                min={0}
                max={100000}
                step={1}
                placeholder="e.g. 500"
              />
            </div>
          )}

          {tool.slug === 'discount-calculator' && (
            <div className="space-y-5">
              <CurrencyInput
                id="disc-price"
                label="Original Sticker Price"
                value={discPrice}
                onChange={(val) => setDiscPrice(val)}
                min={0}
                placeholder="e.g. 150"
                helpText="Regular price before discount"
              />
              <NumberSliderInput
                id="disc-rate"
                label="Discount Rate"
                value={discPercent}
                onChange={setDiscPercent}
                min={1}
                max={99}
                step={1}
                placeholder="e.g. 20"
                suffix="%"
              />
              <NumberSliderInput
                id="disc-tax"
                label="Sales Tax / VAT"
                value={discTax}
                onChange={setDiscTax}
                min={0}
                max={30}
                step={0.5}
                placeholder="e.g. 5"
                suffix="%"
              />
            </div>
          )}

          {tool.slug === 'fuel-cost-calculator' && (
            <div className="space-y-5">
              <UnitSelectInput
                id="fuel-dist"
                label="Trip Distance"
                value={fuelDist}
                onChange={setFuelDist}
                placeholder="e.g. 400"
                min={1}
                max={50000}
                step={1}
                selectedUnit={activeDistUnit}
                unitOptions={[
                  { value: 'km', label: 'km' },
                  { value: 'mi', label: 'miles' },
                ]}
                onUnitChange={(u) => setUnitOverride('fuelDistance', u)}
                helpText="Trip length for your journey"
              />

              <UnitSelectInput
                id="fuel-mileage"
                label="Vehicle Fuel Efficiency"
                value={fuelMileage}
                onChange={setFuelMileage}
                placeholder="e.g. 15"
                min={0.1}
                max={200}
                step={0.1}
                selectedUnit={activeEconomyUnit}
                unitOptions={[
                  { value: 'km/L', label: 'km / L' },
                  { value: 'mpg-US', label: 'MPG (US)' },
                  { value: 'mpg-imp', label: 'MPG (UK)' },
                  { value: 'L/100km', label: 'L / 100km' },
                ]}
                onUnitChange={(u) => setUnitOverride('fuelEfficiency', u)}
                helpText={`Region standard: ${countryProfile.defaults.fuelEconomy}`}
              />

              <UnitSelectInput
                id="fuel-price"
                label="Fuel Price per Volume"
                value={fuelPrice}
                onChange={setFuelPrice}
                placeholder="e.g. 1.45"
                min={0.01}
                max={5000}
                step={0.01}
                selectedUnit={activePriceVolumeUnit}
                unitOptions={[
                  { value: 'L', label: `${currencySymbol} / Liter` },
                  { value: 'gal-US', label: `${currencySymbol} / Gallon (US)` },
                  { value: 'gal-imp', label: `${currencySymbol} / Gallon (UK)` },
                ]}
                onUnitChange={(u) => setUnitOverride('fuelPrice', u)}
                helpText={`Current local fuel price in ${currencySymbol}`}
              />

              <div className="space-y-1.5">
                <label htmlFor="fuel-passengers" className="block text-xs font-bold text-slate-700">
                  Passengers to Split Cost With (Optional)
                </label>
                <input
                  type="number"
                  id="fuel-passengers"
                  value={fuelPassengers}
                  onChange={(e) =>
                    setFuelPassengers(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value, 10)))
                  }
                  placeholder="1 (leave blank for solo trip)"
                  min={1}
                  max={50}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[11px] text-slate-500">
                  Evenly distributes total fuel costs across traveling passengers.
                </p>
              </div>

              {hasCustomUnitOverrides && (
                <div className="pt-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span>Using custom unit overrides.</span>
                  <button
                    type="button"
                    onClick={resetUnitsToCountryDefaults}
                    className="text-blue-600 hover:text-blue-800 font-bold underline"
                  >
                    Reset to {countryProfile.name} defaults
                  </button>
                </div>
              )}
            </div>
          )}

          {tool.slug === 'age-calculator' && (
            <div className="space-y-5">
              <div>
                <label htmlFor="dob-input" className="text-sm font-semibold text-slate-800 block mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dob-input"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full py-3 px-4 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          {tool.slug === 'currency-converter' && (
            <div className="space-y-5">
              <NumberSliderInput
                id="fx-amount"
                label="Amount to Convert"
                value={fxAmount}
                onChange={setFxAmount}
                min={1}
                max={1000000}
                step={10}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="fx-from" className="text-xs font-semibold text-slate-600 block mb-1">From Currency</label>
                  <select
                    id="fx-from"
                    value={fxFrom}
                    onChange={(e) => setFxFrom(e.target.value as CurrencyCode)}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl font-bold text-sm bg-white"
                  >
                    {Object.keys(CURRENCIES).map((c) => (
                      <option key={c} value={c}>{c} - {CURRENCIES[c as CurrencyCode].name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fx-to" className="text-xs font-semibold text-slate-600 block mb-1">To Currency</label>
                  <select
                    id="fx-to"
                    value={fxTo}
                    onChange={(e) => setFxTo(e.target.value as CurrencyCode)}
                    className="w-full py-2.5 px-3 border border-slate-200 rounded-xl font-bold text-sm bg-white"
                  >
                    {Object.keys(CURRENCIES).map((c) => (
                      <option key={c} value={c}>{c} - {CURRENCIES[c as CurrencyCode].name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Default fallback for other tools */}
          {!['sip-calculator', 'compound-interest-calculator', 'percentage-calculator', 'discount-calculator', 'fuel-cost-calculator', 'age-calculator', 'currency-converter'].includes(tool.slug) && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600">
              <p className="font-semibold text-slate-800 mb-1">{tool.name} Parameters</p>
              <p className="text-xs">
                Enter your parameters below to calculate projections:
              </p>
              <div className="mt-4 space-y-3">
                <CurrencyInput
                  id="generic-amount"
                  label="Primary Value / Amount"
                  value={genericInput}
                  onChange={(val) => setGenericInput(val)}
                  min={0}
                  placeholder="Enter value..."
                  helpText="Base monetary value for calculations"
                />
              </div>
            </div>
          )}

              </div>

              {/* Bottom Reset Button for inline tools */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  id="generic-tool-reset-bottom-btn"
                  onClick={handleResetCurrentTool}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white shadow-2xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset All Fields</span>
                </button>
              </div>
            </div>

            {/* Right Side: Key Results */}
            <div className="lg:col-span-6 p-5 sm:p-6 bg-slate-50/40 flex flex-col min-h-full">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/60">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Calculated Results &amp; Projections
                </span>
                {hasValidResult && (
                  <button
                    type="button"
                    id="result-pane-share-btn"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 bg-white shadow-2xs transition-colors"
                    title="Share calculated result"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Share Result</span>
                  </button>
                )}
              </div>
              <div className="space-y-4 flex-1">
                {!hasValidResult ? (
                  <div
                    id="result-awaiting-inputs"
                    className="h-full min-h-[260px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-white/70 shadow-2xs"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <Scale className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1">
                      Awaiting Required Inputs
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                      Enter your parameters in the fields on the left. The Result Card and detailed projections will appear here once valid values are provided.
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      id="calculator-result-card"
                      className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 animate-in fade-in duration-200"
                    >
                      {tool.slug === 'sip-calculator' && sipResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Expected Maturity Wealth
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                            {formatMoney(sipResult.totalValue)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1">Total Invested</span>
                              <span className="font-bold text-base text-white">{formatMoney(sipResult.investedAmount)}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Estimated Returns</span>
                              <span className="font-bold text-base text-emerald-400">{formatMoney(sipResult.estimatedReturns)}</span>
                            </div>
                          </div>
                        </>
                      )}

                      {tool.slug === 'compound-interest-calculator' && ciResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Total Future Balance
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                            {formatMoney(ciResult.totalAmount)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1">Principal Deposit</span>
                              <span className="font-bold text-base text-white">{formatMoney(ciResult.principal)}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Compound Interest Earned</span>
                              <span className="font-bold text-base text-emerald-400">{formatMoney(ciResult.totalInterest)}</span>
                            </div>
                          </div>
                        </>
                      )}

                      {tool.slug === 'percentage-calculator' && pctResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Calculated Result
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-3">
                            {pctResult.result != null ? pctResult.result.toLocaleString() : ''}
                            {pctType !== 'what_is_x_percent_of_y' ? '%' : ''}
                          </div>
                          <div className="p-3 bg-slate-800/80 rounded-xl text-xs font-mono text-blue-200 mt-3">
                            {pctResult.formulaText}
                          </div>
                        </>
                      )}

                      {tool.slug === 'discount-calculator' && discResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Final Checkout Price
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                            {formatMoney(discResult.finalPrice, true)}
                          </div>
                          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1">You Save</span>
                              <span className="font-bold text-emerald-400">{formatMoney(discResult.savings, true)}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Subtotal</span>
                              <span className="font-bold text-white">{formatMoney(discResult.priceAfterDiscount, true)}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Tax Amount</span>
                              <span className="font-bold text-slate-300">{formatMoney(discResult.taxAmount, true)}</span>
                            </div>
                          </div>
                        </>
                      )}

                      {tool.slug === 'fuel-cost-calculator' && canonicalFuelResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Total Trip Fuel Cost
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-6">
                            {formatMoney(canonicalFuelResult.totalCost, true)}
                          </div>
                          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1">Fuel Needed</span>
                              <span className="font-bold text-white">
                                {canonicalFuelResult.displayFuelNeeded} {canonicalFuelResult.displayFuelVolumeUnit}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Per Passenger</span>
                              <span className="font-bold text-emerald-400">
                                {formatMoney(canonicalFuelResult.costPerPassenger, true)}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">
                                Cost / {canonicalFuelResult.displayDistanceUnit}
                              </span>
                              <span className="font-bold text-slate-300">
                                {formatMoney(canonicalFuelResult.costPerDistanceUnit, true)}
                              </span>
                            </div>
                          </div>
                        </>
                      )}

                      {tool.slug === 'age-calculator' && ageResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Chronological Age
                          </span>
                          <div className="text-2xl sm:text-3xl font-black text-white mb-6">
                            {ageResult.years} Years, {ageResult.months} Months, {ageResult.days} Days
                          </div>
                          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs">
                            <div>
                              <span className="text-slate-400 block mb-1">Total Days</span>
                              <span className="font-bold text-white">{ageResult.totalDays != null ? ageResult.totalDays.toLocaleString() : ''}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Total Weeks</span>
                              <span className="font-bold text-white">{ageResult.totalWeeks != null ? ageResult.totalWeeks.toLocaleString() : ''}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block mb-1">Next Birthday</span>
                              <span className="font-bold text-amber-400">{ageResult.nextBirthdayDays} Days</span>
                            </div>
                          </div>
                        </>
                      )}

                      {tool.slug === 'currency-converter' && fxResult && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Converted Value
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-3">
                            {CURRENCIES[fxTo]?.symbol || ''}{fxResult.converted != null ? fxResult.converted.toLocaleString() : ''} {fxTo}
                          </div>
                          <p className="text-xs text-slate-400 pt-3 border-t border-slate-800">
                            Exchange Rate: 1 {fxFrom} = {fxResult.rate} {fxTo} (Mid-Market Benchmark)
                          </p>
                        </>
                      )}

                      {!['sip-calculator', 'compound-interest-calculator', 'percentage-calculator', 'discount-calculator', 'fuel-cost-calculator', 'age-calculator', 'currency-converter'].includes(tool.slug) && typeof genericInput === 'number' && genericInput > 0 && (
                        <>
                          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block mb-1">
                            Calculated Outcome
                          </span>
                          <div className="text-3xl sm:text-4xl font-black text-white mb-4">
                            {formatMoney(genericInput)}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Visual Donut Chart for SIP or CI only when valid results exist */}
                    {tool.slug === 'sip-calculator' && sipResult && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Wealth Breakdown</h3>
                        <DonutChart
                          size={180}
                          centerTitle="Maturity"
                          centerSubtitle={formatMoney(sipResult.totalValue)}
                          segments={[
                            {
                              label: 'Invested Capital',
                              value: sipResult.investedAmount,
                              color: '#2563eb',
                              formattedValue: formatMoney(sipResult.investedAmount),
                            },
                            {
                              label: 'Estimated Returns',
                              value: sipResult.estimatedReturns,
                              color: '#10b981',
                              formattedValue: formatMoney(sipResult.estimatedReturns),
                            },
                          ]}
                        />
                      </div>
                    )}

                    {tool.slug === 'compound-interest-calculator' && ciResult && (
                      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                        <h3 className="text-sm font-bold text-slate-900 mb-2">Compound Growth Distribution</h3>
                        <DonutChart
                          size={180}
                          centerTitle="Balance"
                          centerSubtitle={formatMoney(ciResult.totalAmount)}
                          segments={[
                            {
                              label: 'Original Principal',
                              value: ciResult.principal,
                              color: '#2563eb',
                              formattedValue: formatMoney(ciResult.principal),
                            },
                            {
                              label: 'Interest Accrued',
                              value: ciResult.totalInterest,
                              color: '#10b981',
                              formattedValue: formatMoney(ciResult.totalInterest),
                            },
                          ]}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Plain Language Explanation (How it is calculated) */}
      {eduContent.explanation?.summary && (
        <section className="mt-12 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
            What does this result mean? (How it is calculated)
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {eduContent.explanation.summary}
          </p>

          {eduContent.explanation.breakdown && eduContent.explanation.breakdown.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-100">
              {eduContent.explanation.breakdown.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 8. Mathematical Formula */}
      {eduContent.formula?.expression && (
        <section className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
            Mathematical Formula &amp; Equations
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-900 text-center shadow-xs overflow-x-auto">
            {eduContent.formula.expression}
          </div>
          {eduContent.formula.notes && (
            <p className="mt-2 text-xs text-slate-500 italic">
              {eduContent.formula.notes}
            </p>
          )}
          {eduContent.formula.variables && eduContent.formula.variables.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs text-slate-600">
              {eduContent.formula.variables.map((v) => (
                <div key={v.symbol} className="bg-white p-3 rounded-lg border border-slate-200">
                  <strong className="font-bold text-slate-900 font-mono mr-1.5">{v.symbol}:</strong>
                  <span>{v.explanation}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 9. Example Calculation */}
      {eduContent.example?.title && (
        <section className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-1">
            {eduContent.example.title}
          </h2>
          {eduContent.example.description && (
            <p className="text-xs text-slate-600 mb-4">{eduContent.example.description}</p>
          )}
          {eduContent.example.walkthrough && eduContent.example.walkthrough.length > 0 && (
            <div className="space-y-1.5 text-xs text-slate-600">
              {eduContent.example.walkthrough.map((step, idx) => (
                <p key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{step}</span>
                </p>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 10. Important Considerations */}
      {eduContent.explanation?.considerations && eduContent.explanation.considerations.length > 0 && (
        <section className="mt-8 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6">
          <h2 className="text-base font-bold text-amber-950 tracking-tight mb-2">
            Important Considerations
          </h2>
          <ul className="space-y-2 text-xs text-amber-900">
            {eduContent.explanation.considerations.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 11. FAQ Accordion */}
      {eduContent.faqs && eduContent.faqs.length > 0 && (
        <FAQAccordion faqs={eduContent.faqs} />
      )}

      {/* 12. Related Calculators */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Related Calculators
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore corresponding decision utilities</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
            {relatedTools.map((rel) => (
              <CalculatorCard
                key={rel.id}
                tool={rel}
                onClick={() => onSelectTool(rel.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Embed Modal */}
      <EmbedModal
        toolSlug={tool.slug}
        toolName={tool.name}
        isOpen={isEmbedOpen}
        onClose={() => setIsEmbedOpen(false)}
      />

      {/* Scenario Compare Modal */}
      <ScenarioCompareModal
        toolName={tool.name}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        fields={comparisonFields}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={tool.name}
        toolName={tool.name}
        toolSlug={tool.slug}
        categorySlug={currentCategory?.slug}
        description={tool.description}
        calculationData={calculationShareData}
      />
    </article>
  );
};
