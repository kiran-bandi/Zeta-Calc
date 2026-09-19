import React, { useState, useMemo } from 'react';
import {
  Home,
  Car,
  ArrowLeftRight,
  CheckSquare,
  Sparkles,
  Calculator,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Check,
  ChevronRight,
  RotateCcw,
  Zap,
  DollarSign,
  Scale,
  Receipt,
  FileCheck2,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { UnitNumberInput } from '../common/UnitNumberInput';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { calculateEMI } from '../../engine/emi';
import { TermInput } from '../common/TermInput';
import { normalizeTerm } from '../../engine/termEngine';

interface DecisionCenterPageProps {
  onNavigateHome: () => void;
  onSelectTool: (slug: string) => void;
}

type ActiveTab = 'house-goal' | 'car-goal' | 'loan-compare' | 'true-cost' | 'checklists';

export const DecisionCenterPage: React.FC<DecisionCenterPageProps> = ({
  onNavigateHome,
  onSelectTool,
}) => {
  const { formatMoney, currencySymbol, preferences } = useSettings();
  const isINR = preferences.currency === 'INR';

  const [activeTab, setActiveTab] = useState<ActiveTab>('house-goal');

  // Helper to convert number | '' to valid number
  const num = (val: number | string): number => (typeof val === 'number' ? val : parseFloat(val as string) || 0);

  // ----------------------------------------------------
  // 1. BUYING A HOUSE DECISION WORKFLOW STATE
  // ----------------------------------------------------
  const [housePrice, setHousePrice] = useState<number | ''>('');
  const [houseDownPayment, setHouseDownPayment] = useState<number | ''>('');
  const [houseInterestRate, setHouseInterestRate] = useState<number | ''>('');
  const [houseTenureYears, setHouseTenureYears] = useState<number | ''>('');
  const [houseTenureMonths, setHouseTenureMonths] = useState<number | ''>('');
  const [monthlyRentComparison, setMonthlyRentComparison] = useState<number | ''>('');

  const houseLoanAmount = Math.max(0, num(housePrice) - num(houseDownPayment));
  const houseTermNorm = useMemo(() => {
    return normalizeTerm({ years: houseTenureYears, months: houseTenureMonths });
  }, [houseTenureYears, houseTenureMonths]);

  const houseEMIResult = useMemo(() => {
    if (houseLoanAmount <= 0 || !num(houseInterestRate) || !houseTermNorm.isValid) return null;
    return calculateEMI({
      loanAmount: houseLoanAmount,
      interestRate: num(houseInterestRate),
      tenure: houseTermNorm.totalMonths,
      tenureUnit: 'months',
    });
  }, [houseLoanAmount, houseInterestRate, houseTermNorm]);

  // House scenarios: Conservative (25% down, 15y), Balanced (20% down, 20y), Flexible (10% down, 30y)
  const houseScenarios = useMemo(() => {
    const hp = num(housePrice);
    const hRate = num(houseInterestRate);
    if (hp <= 0 || hRate <= 0) return [];

    const sc1Down = Math.round(hp * 0.25);
    const sc1EMI = calculateEMI({
      loanAmount: Math.max(0, hp - sc1Down),
      interestRate: hRate,
      tenure: 15,
      tenureUnit: 'years',
    });

    const sc2Down = Math.round(hp * 0.20);
    const sc2EMI = calculateEMI({
      loanAmount: Math.max(0, hp - sc2Down),
      interestRate: hRate,
      tenure: 20,
      tenureUnit: 'years',
    });

    const sc3Down = Math.round(hp * 0.10);
    const sc3EMI = calculateEMI({
      loanAmount: Math.max(0, hp - sc3Down),
      interestRate: hRate,
      tenure: 30,
      tenureUnit: 'years',
    });

    return [
      {
        name: 'Conservative Payoff',
        tag: 'Lowest Total Interest',
        downPayment: sc1Down,
        downPct: 25,
        tenure: 15,
        emi: sc1EMI.monthlyEMI,
        totalInterest: sc1EMI.totalInterest,
        totalPayment: sc1EMI.totalPayment,
        tradeoff: 'Higher monthly commitment, but finishes 5-15 years earlier and saves substantial interest.',
      },
      {
        name: 'Balanced Approach',
        tag: 'Most Popular',
        downPayment: sc2Down,
        downPct: 20,
        tenure: 20,
        emi: sc2EMI.monthlyEMI,
        totalInterest: sc2EMI.totalInterest,
        totalPayment: sc2EMI.totalPayment,
        tradeoff: 'Manageable monthly installment with adequate liquidity for family savings.',
      },
      {
        name: 'Flexible Cashflow',
        tag: 'Lowest Monthly Payment',
        downPayment: sc3Down,
        downPct: 10,
        tenure: 30,
        emi: sc3EMI.monthlyEMI,
        totalInterest: sc3EMI.totalInterest,
        totalPayment: sc3EMI.totalPayment,
        tradeoff: 'Maximum immediate budget cushion, but total interest exceeds the original borrowing amount.',
      },
    ];
  }, [housePrice, houseInterestRate]);

  // ----------------------------------------------------
  // 2. BUYING A CAR WORKFLOW STATE
  // ----------------------------------------------------
  const [carPrice, setCarPrice] = useState<number | ''>('');
  const [carDownPayment, setCarDownPayment] = useState<number | ''>('');
  const [carLoanRate, setCarLoanRate] = useState<number | ''>('');
  const [carLoanTenureYears, setCarLoanTenureYears] = useState<number | ''>('');
  const [carLoanTenureMonths, setCarLoanTenureMonths] = useState<number | ''>('');
  const [dailyCommuteKm, setDailyCommuteKm] = useState<number | ''>('');
  const [fuelPricePerLitre, setFuelPricePerLitre] = useState<number | ''>('');
  const [petrolMileageKmPerLitre, setPetrolMileageKmPerLitre] = useState<number | ''>('');
  const [evEfficiencyKmPerKWh, setEvEfficiencyKmPerKWh] = useState<number | ''>('');
  const [electricityCostPerKWh, setElectricityCostPerKWh] = useState<number | ''>('');

  const carLoanAmount = Math.max(0, num(carPrice) - num(carDownPayment));
  const carTermNorm = useMemo(() => {
    return normalizeTerm({ years: carLoanTenureYears, months: carLoanTenureMonths });
  }, [carLoanTenureYears, carLoanTenureMonths]);

  const carEMIResult = useMemo(() => {
    if (carLoanAmount <= 0 || !num(carLoanRate) || !carTermNorm.isValid) return null;
    return calculateEMI({
      loanAmount: carLoanAmount,
      interestRate: num(carLoanRate),
      tenure: carTermNorm.totalMonths,
      tenureUnit: 'months',
    });
  }, [carLoanAmount, carLoanRate, carTermNorm]);

  // 5-year running cost comparison: Petrol vs EV
  const carRunningCosts = useMemo(() => {
    const annualKm = num(dailyCommuteKm) * 365;
    const fiveYearKm = annualKm * 5;

    // Petrol fuel
    const petrolLitres5Y = fiveYearKm / (num(petrolMileageKmPerLitre) || 1);
    const petrolFuelCost5Y = petrolLitres5Y * num(fuelPricePerLitre);
    const petrolMaintenance5Y = isINR ? 75000 : 4500;
    const petrolTotal5Y = petrolFuelCost5Y + petrolMaintenance5Y;

    // EV electricity
    const evKWh5Y = fiveYearKm / (num(evEfficiencyKmPerKWh) || 1);
    const evEnergyCost5Y = evKWh5Y * num(electricityCostPerKWh);
    const evMaintenance5Y = isINR ? 35000 : 2000;
    const evTotal5Y = evEnergyCost5Y + evMaintenance5Y;

    return {
      fiveYearKm,
      petrolFuelCost5Y,
      petrolTotal5Y,
      evEnergyCost5Y,
      evTotal5Y,
      fiveYearSavingsWithEV: petrolTotal5Y - evTotal5Y,
    };
  }, [
    dailyCommuteKm,
    petrolMileageKmPerLitre,
    fuelPricePerLitre,
    evEfficiencyKmPerKWh,
    electricityCostPerKWh,
    isINR,
  ]);

  // ----------------------------------------------------
  // 3. LOAN A vs LOAN B COMPARISON ENGINE STATE
  // ----------------------------------------------------
  const [loanAAmount, setLoanAAmount] = useState<number | ''>('');
  const [loanARate, setLoanARate] = useState<number | ''>('');
  const [loanATenureYears, setLoanATenureYears] = useState<number | ''>('');
  const [loanATenureMonths, setLoanATenureMonths] = useState<number | ''>('');
  const [loanAFee, setLoanAFee] = useState<number | ''>('');

  const [loanBAmount, setLoanBAmount] = useState<number | ''>('');
  const [loanBRate, setLoanBRate] = useState<number | ''>('');
  const [loanBTenureYears, setLoanBTenureYears] = useState<number | ''>('');
  const [loanBTenureMonths, setLoanBTenureMonths] = useState<number | ''>('');
  const [loanBFee, setLoanBFee] = useState<number | ''>('');

  const loanANorm = useMemo(() => {
    return normalizeTerm({ years: loanATenureYears, months: loanATenureMonths });
  }, [loanATenureYears, loanATenureMonths]);

  const loanBNorm = useMemo(() => {
    return normalizeTerm({ years: loanBTenureYears, months: loanBTenureMonths });
  }, [loanBTenureYears, loanBTenureMonths]);

  const loanA_EMI = useMemo(() => {
    if (!num(loanAAmount) || !num(loanARate) || !loanANorm.isValid) return null;
    return calculateEMI({
      loanAmount: num(loanAAmount),
      interestRate: num(loanARate),
      tenure: loanANorm.totalMonths,
      tenureUnit: 'months',
    });
  }, [loanAAmount, loanARate, loanANorm]);

  const loanB_EMI = useMemo(() => {
    if (!num(loanBAmount) || !num(loanBRate) || !loanBNorm.isValid) return null;
    return calculateEMI({
      loanAmount: num(loanBAmount),
      interestRate: num(loanBRate),
      tenure: loanBNorm.totalMonths,
      tenureUnit: 'months',
    });
  }, [loanBAmount, loanBRate, loanBNorm]);

  const loanComparisonDelta = useMemo(() => {
    if (!loanA_EMI || !loanB_EMI) return null;
    const totalA = loanA_EMI.totalPayment + num(loanAFee);
    const totalB = loanB_EMI.totalPayment + num(loanBFee);
    const diffTotal = Math.abs(totalA - totalB);
    const diffEMI = Math.abs(loanA_EMI.monthlyEMI - loanB_EMI.monthlyEMI);
    const cheaper = totalA <= totalB ? 'Loan A' : 'Loan B';
    const lowerEMI = loanA_EMI.monthlyEMI <= loanB_EMI.monthlyEMI ? 'Loan A' : 'Loan B';

    return {
      totalA,
      totalB,
      diffTotal,
      diffEMI,
      cheaper,
      lowerEMI,
    };
  }, [loanA_EMI, loanB_EMI, loanAFee, loanBFee]);

  // ----------------------------------------------------
  // 4. TRUE COST CALCULATOR STATE
  // ----------------------------------------------------
  const [tcStickerPrice, setTcStickerPrice] = useState<number | ''>('');
  const [tcUpfrontTaxDelivery, setTcUpfrontTaxDelivery] = useState<number | ''>('');
  const [tcMonthlyRunningCost, setTcMonthlyRunningCost] = useState<number | ''>('');
  const [tcLifespanYears, setTcLifespanYears] = useState<number | ''>('');
  const [tcAnnualMaintenance, setTcAnnualMaintenance] = useState<number | ''>('');

  const trueCostResult = useMemo(() => {
    const lifespanYears = num(tcLifespanYears);
    const totalLifespanMonths = lifespanYears * 12;
    const initialOutlay = num(tcStickerPrice) + num(tcUpfrontTaxDelivery);
    const totalMonthlyCosts = num(tcMonthlyRunningCost) * totalLifespanMonths;
    const totalAnnualCosts = num(tcAnnualMaintenance) * lifespanYears;
    const totalLifetimeCost = initialOutlay + totalMonthlyCosts + totalAnnualCosts;
    const trueMonthlyCost = totalLifespanMonths > 0 ? totalLifetimeCost / totalLifespanMonths : 0;
    const recurringOverheadPercentage =
      initialOutlay > 0 ? ((totalLifetimeCost - initialOutlay) / initialOutlay) * 100 : 0;

    return {
      initialOutlay,
      totalMonthlyCosts,
      totalAnnualCosts,
      totalLifetimeCost,
      trueMonthlyCost,
      recurringOverheadPercentage,
    };
  }, [
    tcStickerPrice,
    tcUpfrontTaxDelivery,
    tcMonthlyRunningCost,
    tcLifespanYears,
    tcAnnualMaintenance,
  ]);

  // ----------------------------------------------------
  // 5. "WHAT AM I FORGETTING?" CHECKLISTS STATE
  // ----------------------------------------------------
  const [selectedChecklistCategory, setSelectedChecklistCategory] = useState<
    'house' | 'car' | 'city' | 'trip' | 'college'
  >('house');

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheckItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistData = {
    house: {
      title: 'Buying a House Checklist',
      subtitle: 'Hidden expenses, statutory checks, and reserves beyond the property price.',
      items: [
        {
          id: 'h1',
          label: 'Stamp Duty & Legal Registration (5% – 7%)',
          detail: 'Paid directly to the local sub-registrar office before taking legal title.',
        },
        {
          id: 'h2',
          label: 'Property Title Search & Lawyer Verification',
          detail: '30-year encumbrance certificate, mutation search, and local municipal zoning approval.',
        },
        {
          id: 'h3',
          label: 'Bank Processing Fee & Valuation Charges',
          detail: 'Usually 0.25% to 1% of the loan sanction amount plus technical and legal inspection fees.',
        },
        {
          id: 'h4',
          label: 'Society Maintenance Deposit & Advance Corpus',
          detail: 'Condos and gated communities often require 1-2 years of advance maintenance reserve.',
        },
        {
          id: 'h5',
          label: 'Homeowner Property Insurance',
          detail: 'Structure and content coverage protecting against fire, natural disasters, and structural perils.',
        },
        {
          id: 'h6',
          label: 'Moving, Painting & Initial Furnishing Buffer',
          detail: 'Essential initial appliances, interior cabinetry, curtains, and relocation costs.',
        },
        {
          id: 'h7',
          label: '6-Month EMI Emergency Cushion',
          detail: 'Never spend all liquid savings on the down payment. Keep 6 months of mortgage payments in safe liquid funds.',
        },
      ],
    },
    car: {
      title: 'Buying a Car Checklist',
      subtitle: 'On-road charges, initial accessories, and mandatory ownership obligations.',
      items: [
        {
          id: 'c1',
          label: 'Road Tax & RTO Registration',
          detail: 'State transport tax can add 8% to 15% on top of the ex-showroom sticker price.',
        },
        {
          id: 'c2',
          label: 'Comprehensive Zero-Depreciation Insurance',
          detail: 'Standard insurance covers third-party only; zero-dep covers plastic and body panel replacements.',
        },
        {
          id: 'c3',
          label: 'Fastag / Toll Transponder & Security Plates (HSRP)',
          detail: 'Required electronic toll transponder and tamper-proof high-security registration plates.',
        },
        {
          id: 'c4',
          label: 'Extended Manufacturer Warranty (4th & 5th Year)',
          detail: 'Guards against premature electronic, transmission, and sensor failures beyond base warranty.',
        },
        {
          id: 'c5',
          label: 'Reserved Parking Space & Permit',
          detail: 'Verify residential parking allocation, society charges, and local municipal overnight parking rules.',
        },
        {
          id: 'c6',
          label: 'Essential Safety Kit & Dashcam',
          detail: 'High-resolution dual dash camera, tire inflator gauge, jumper cables, and reflective emergency kit.',
        },
      ],
    },
    city: {
      title: 'Moving to Another City Checklist',
      subtitle: 'Transitions, deposits, utility setup, and temporary buffer funds.',
      items: [
        {
          id: 'm1',
          label: 'Rental Security Deposit (2 – 10 Months)',
          detail: 'Liquid capital locked with the landlord until move-out. Check regional lease customs.',
        },
        {
          id: 'm2',
          label: 'Real Estate Brokerage Fee',
          detail: 'Typically 15 to 30 days of rental value paid to the leasing agent.',
        },
        {
          id: 'm3',
          label: 'Packers & Movers with Transit Insurance',
          detail: 'Verify transit damage insurance and elevator/hoisting surcharge terms.',
        },
        {
          id: 'm4',
          label: 'Utility Connection Setup & Meter Deposits',
          detail: 'Electric meter transfer, high-speed fiber broadband deposit, piped gas registration.',
        },
        {
          id: 'm5',
          label: 'Address Updates on Identity & Bank Documents',
          detail: 'Update your official address with banks, tax IDs, credit card bureaus, and voter registry.',
        },
        {
          id: 'm6',
          label: 'First 30-Day Transition Food & Commute Reserve',
          detail: 'Dining out and cab rides during initial apartment setup before normal grocery routines resume.',
        },
      ],
    },
    trip: {
      title: 'Planning a Major Trip Checklist',
      subtitle: 'Travel insurance, foreign currency fees, and transit logistics.',
      items: [
        {
          id: 't1',
          label: 'Passport Validity (6+ Months Rule)',
          detail: 'Most immigration jurisdictions reject entry if the passport expires within 6 months of travel.',
        },
        {
          id: 't2',
          label: 'Visa & Entry Permits (e-Visa / ESTA)',
          detail: 'Verify processing lead times and print physical proof of return flight tickets.',
        },
        {
          id: 't3',
          label: 'International Medical & Baggage Travel Insurance',
          detail: 'Essential protection covering overseas medical hospitalization and trip cancellations.',
        },
        {
          id: 't4',
          label: 'Zero-Forex Markup Credit/Debit Card or Travel Card',
          detail: 'Standard credit cards levy 3.5% + tax on foreign currency transactions; zero-markup cards save hundreds.',
        },
        {
          id: 't5',
          label: 'International Roaming eSIM or Local SIM',
          detail: 'Set up digital data eSIM before departure to avoid catastrophic carrier roaming charges.',
        },
        {
          id: 't6',
          label: 'Emergency Cash in Local Currency',
          detail: 'Always carry a small physical currency reserve for taxis, tips, and street vendors.',
        },
      ],
    },
    college: {
      title: 'Starting College / University Checklist',
      subtitle: 'Living expenses, tech requirements, study loan grace periods, and books.',
      items: [
        {
          id: 'u1',
          label: 'Course Materials, Textbooks & Software Licenses',
          detail: 'Specialized course textbooks, lab kits, and academic software licenses (MATLAB, Adobe, etc.).',
        },
        {
          id: 'u2',
          label: 'Reliable Laptop with Extended Warranty',
          detail: 'Check department hardware specifications (processor, RAM, OS requirements) before buying.',
        },
        {
          id: 'u3',
          label: 'Hostel / Dormitory Move-in Essentials',
          detail: 'Bedding, laundry supplies, power surge protector, and room storage organizers.',
        },
        {
          id: 'u4',
          label: 'Understanding Student Loan Moratorium Interest',
          detail: 'Interest accumulates during study years unless serviced early; check if your lender discounts interest for on-time payments.',
        },
        {
          id: 'u5',
          label: 'Student Health & Accident Coverage',
          detail: 'Campus clinic coverage or independent student insurance policy.',
        },
        {
          id: 'u6',
          label: 'Semester Transit Pass & Student ID Discounts',
          detail: 'Unlock subsidized local bus/subway transit passes and tech hardware discounts.',
        },
      ],
    },
  };

  const activeChecklist = checklistData[selectedChecklistCategory];
  const completedCount = activeChecklist.items.filter((it) => checkedItems[it.id]).length;
  const progressPercent = Math.round((completedCount / activeChecklist.items.length) * 100);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 w-full min-w-0">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'Decision Center', active: true },
        ]}
      />

      {/* 2. Hero Header */}
      <div className="mt-4 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 uppercase tracking-wider">
            Decision Framework
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            Neutral • Deterministic • Empowering
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Decision Center
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          <strong>Calculate. Compare. Understand. Decide.</strong> Connect multiple calculators around your
          everyday life goals to see realistic costs, compare scenarios side-by-side, and make confident, informed choices.
        </p>
      </div>

      {/* 3. Decision Center Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-200 text-sm font-bold">
        {[
          { id: 'house-goal', label: 'I Want to Buy a House', icon: Home },
          { id: 'car-goal', label: 'I Want to Buy a Car', icon: Car },
          { id: 'loan-compare', label: 'Loan A vs Loan B', icon: Scale },
          { id: 'true-cost', label: 'True Cost Calculator', icon: Receipt },
          { id: 'checklists', label: 'What Am I Forgetting?', icon: FileCheck2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              id={`decision-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* TAB 1: I WANT TO BUY A HOUSE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'house-goal' && (
        <div className="space-y-8">
          {/* Top Banner Guide */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Goal Framework: Home Purchase & Mortgage Viability
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Buying a home involves upfront equity, recurring monthly debt, ongoing maintenance, and
                  years of interest payments. Adjust your parameters below to inspect realistic scenario tradeoffs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Inputs */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">1. Calculate Your Mortgage Baseline</h3>
                <span className="text-xs text-slate-500">Instant Math</span>
              </div>

              <UnitNumberInput
                id="house-price"
                label="Target Property Price"
                value={housePrice}
                onChange={setHousePrice}
                min={0}
                max={500000000}
                step={isINR ? 50000 : 5000}
                prefix={currencySymbol}
                placeholder="0"
                helpText="Full agreement / sticker value"
              />

              <UnitNumberInput
                id="house-down"
                label="Down Payment Available"
                value={houseDownPayment}
                onChange={setHouseDownPayment}
                min={0}
                max={housePrice}
                step={isINR ? 25000 : 2500}
                prefix={currencySymbol}
                placeholder="0"
                helpText={`${housePrice > 0 ? Math.round((houseDownPayment / housePrice) * 100) : 0}% of property price`}
              />

              <UnitNumberInput
                id="house-rate"
                label="Interest Rate (% p.a.)"
                value={houseInterestRate}
                onChange={setHouseInterestRate}
                min={0}
                max={25}
                step={0.1}
                units={[{ id: 'pct', label: '%', symbol: '%' }]}
              />
              <TermInput
                id="house-tenure"
                label="Tenure Duration"
                years={houseTenureYears}
                months={houseTenureMonths}
                onChangeYears={setHouseTenureYears}
                onChangeMonths={setHouseTenureMonths}
                helpText="Standard is 15-30 years"
              />

              <UnitNumberInput
                id="house-rent-comp"
                label="Alternative: Current Monthly Rent"
                value={monthlyRentComparison}
                onChange={setMonthlyRentComparison}
                min={0}
                max={500000}
                step={isINR ? 1000 : 100}
                prefix={currencySymbol}
                helpText="For Rent vs Buy comparison"
              />

              <div className="pt-2">
                <button
                  type="button"
                  id="link-to-home-loan-tool"
                  onClick={() => onSelectTool('home-loan-calculator')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Open detailed Home Loan Calculator with full Amortization Table</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right: Calculated Overview */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Estimated Monthly Commitment
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {houseEMIResult ? formatMoney(houseEMIResult.monthlyEMI) : '—'}
                  <span className="text-base text-slate-400 font-normal ml-2">/ month</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Borrowed Principal</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {formatMoney(houseLoanAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Lifetime Interest</span>
                    <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                      {houseEMIResult ? formatMoney(houseEMIResult.totalInterest) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Out-of-Pocket Cost</span>
                    <span className="text-sm font-bold text-slate-200 mt-0.5 block">
                      {houseEMIResult ? formatMoney(num(housePrice) + houseEMIResult.totalInterest) : '—'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mortgage vs Rent Delta</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                      {houseEMIResult && num(monthlyRentComparison) > 0
                        ? houseEMIResult.monthlyEMI > num(monthlyRentComparison)
                          ? `+${formatMoney(houseEMIResult.monthlyEMI - num(monthlyRentComparison))} more than rent`
                          : `${formatMoney(num(monthlyRentComparison) - houseEMIResult.monthlyEMI)} cheaper than rent`
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Understand: Key Knowledge Card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span>Understand: The True Cost of Ownership</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  A mortgage installment is only one part of housing expenses. As a homeowner, account for:{' '}
                  <strong>Property taxes</strong> (~1-2% annually), <strong>society maintenance</strong>,{' '}
                  <strong>home insurance</strong>, and an annual <strong>repair reserve</strong> (~1% of home value/year).
                </p>
              </div>
            </div>
          </div>

          {/* Decide: 3 Scenarios Comparison */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                2. Compare Scenarios: Conservative vs Balanced vs Flexible
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We present realistic outcomes so you can choose what fits your personal risk tolerance. We never tell you what you "should" buy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {houseScenarios.map((sc, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-5 flex flex-col justify-between transition-all ${
                    idx === 1 ? 'border-blue-300 bg-blue-50/20 ring-1 ring-blue-500/20' : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-bold text-slate-900">{sc.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {sc.tag}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Down Payment</span>
                        <span className="font-semibold text-slate-900">
                          {formatMoney(sc.downPayment)} ({sc.downPct}%)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Tenure</span>
                        <span className="font-semibold text-slate-900">{sc.tenure} Years</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Monthly EMI</span>
                        <span className="font-bold text-blue-600">{formatMoney(sc.emi)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500">Total Interest</span>
                        <span className="font-semibold text-amber-700">{formatMoney(sc.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-slate-500">Total Outlay</span>
                        <span className="font-semibold text-slate-900">{formatMoney(sc.totalPayment)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                    {sc.tradeoff}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 2: I WANT TO BUY A CAR */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'car-goal' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Goal Framework: Car Purchase, Loan & 5-Year Running Cost
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Vehicles are depreciating assets. A realistic budget must combine monthly auto financing
                  with fuel, routine maintenance, and insurance costs over 5 years.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Car Inputs */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                1. Vehicle & Financing Parameters
              </h3>

              <UnitNumberInput
                id="car-price"
                label="On-Road Vehicle Price"
                value={carPrice}
                onChange={setCarPrice}
                min={0}
                max={50000000}
                step={isINR ? 25000 : 1000}
                prefix={currencySymbol}
                helpText="Including taxes, registration & initial insurance"
              />

              <UnitNumberInput
                id="car-down"
                label="Down Payment"
                value={carDownPayment}
                onChange={setCarDownPayment}
                min={0}
                max={carPrice}
                step={isINR ? 10000 : 500}
                prefix={currencySymbol}
                helpText={`${carPrice > 0 ? Math.round((carDownPayment / carPrice) * 100) : 0}% of vehicle price`}
              />

              <UnitNumberInput
                id="car-rate"
                label="Loan Interest Rate (% p.a.)"
                value={carLoanRate}
                onChange={setCarLoanRate}
                min={0}
                max={30}
                step={0.1}
                units={[{ id: 'pct', label: '%', symbol: '%' }]}
              />
              <TermInput
                id="car-tenure"
                label="Loan Tenure"
                years={carLoanTenureYears}
                months={carLoanTenureMonths}
                onChangeYears={setCarLoanTenureYears}
                onChangeMonths={setCarLoanTenureMonths}
                helpText="Standard is 3-5 years"
              />

              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Commute & Running Assumptions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <UnitNumberInput
                    id="car-commute"
                    label="Daily Driving (km)"
                    value={dailyCommuteKm}
                    onChange={setDailyCommuteKm}
                    min={0}
                    max={500}
                    step={5}
                    units={[{ id: 'km', label: 'km', symbol: 'km' }]}
                  />
                  <UnitNumberInput
                    id="car-fuel-price"
                    label="Fuel Price per Liter"
                    value={fuelPricePerLitre}
                    onChange={setFuelPricePerLitre}
                    min={0}
                    max={500}
                    step={1}
                    prefix={currencySymbol}
                  />
                </div>
              </div>
            </div>

            {/* Right: Calculated Overview */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Monthly Auto Loan Payment
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {carEMIResult ? formatMoney(carEMIResult.monthlyEMI) : '—'}
                  <span className="text-base text-slate-400 font-normal ml-2">/ month</span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block">Borrowed Principal</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {formatMoney(carLoanAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Total Financing Interest</span>
                    <span className="text-sm font-bold text-amber-400 mt-0.5 block">
                      {carEMIResult ? formatMoney(carEMIResult.totalInterest) : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5-Year EV vs Petrol Comparison */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Compare: 5-Year Energy & Maintenance (Petrol vs EV)</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    {carRunningCosts?.fiveYearKm != null ? carRunningCosts.fiveYearKm.toLocaleString() : '0'} km in 5 yrs
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <span className="font-bold text-slate-800 block">Petrol / Diesel</span>
                    <div className="text-slate-500">Fuel: {formatMoney(carRunningCosts.petrolFuelCost5Y)}</div>
                    <div className="text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                      Total: {formatMoney(carRunningCosts.petrolTotal5Y)}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                    <span className="font-bold text-emerald-800 block">Electric Vehicle (EV)</span>
                    <div className="text-slate-500">Energy: {formatMoney(carRunningCosts.evEnergyCost5Y)}</div>
                    <div className="text-sm font-bold text-emerald-700 pt-1 border-t border-emerald-200">
                      Total: {formatMoney(carRunningCosts.evTotal5Y)}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-900 leading-relaxed">
                  Estimated 5-year running cost savings with EV:{' '}
                  <strong>{formatMoney(carRunningCosts.fiveYearSavingsWithEV)}</strong>. Consider whether the
                  upfront purchase price premium of an EV offsets this running delta.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: LOAN A VS LOAN B COMPARISON ENGINE */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'loan-compare' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Loan Comparison Engine: Side-by-Side Analysis
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Compare offers from two different lenders or evaluate different interest rates and tenures.
                  Small interest rate differences or upfront processing fees compound into thousands over time.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LOAN A */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Option 1: Loan A</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">Lender A</span>
              </div>

              <UnitNumberInput
                id="loan-a-amount"
                label="Loan Principal Amount"
                value={loanAAmount}
                onChange={setLoanAAmount}
                min={0}
                max={100000000}
                step={isINR ? 50000 : 2500}
                prefix={currencySymbol}
              />
              <UnitNumberInput
                id="loan-a-rate"
                label="Interest Rate (% p.a.)"
                value={loanARate}
                onChange={setLoanARate}
                min={0}
                max={30}
                step={0.1}
                units={[{ id: 'pct', label: '%', symbol: '%' }]}
              />
              <TermInput
                id="loan-a-tenure"
                label="Tenure Duration"
                years={loanATenureYears}
                months={loanATenureMonths}
                onChangeYears={setLoanATenureYears}
                onChangeMonths={setLoanATenureMonths}
                helpText="Loan duration in years and months"
              />
              <UnitNumberInput
                id="loan-a-fee"
                label="One-Time Processing Fee / Charges"
                value={loanAFee}
                onChange={setLoanAFee}
                min={0}
                max={500000}
                step={isINR ? 1000 : 50}
                prefix={currencySymbol}
              />

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Installment (EMI):</span>
                  <span className="font-bold text-sm text-slate-900">{loanA_EMI ? formatMoney(loanA_EMI.monthlyEMI) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Lifetime Interest:</span>
                  <span className="font-semibold text-amber-700">{loanA_EMI ? formatMoney(loanA_EMI.totalInterest) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Net Cost (Principal + Int + Fees):</span>
                  <span className="font-black text-sm text-blue-900">
                    {loanComparisonDelta ? formatMoney(loanComparisonDelta.totalA) : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* LOAN B */}
            <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">Option 2: Loan B</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Lender B</span>
              </div>

              <UnitNumberInput
                id="loan-b-amount"
                label="Loan Principal Amount"
                value={loanBAmount}
                onChange={setLoanBAmount}
                min={0}
                max={100000000}
                step={isINR ? 50000 : 2500}
                prefix={currencySymbol}
              />
              <UnitNumberInput
                id="loan-b-rate"
                label="Interest Rate (% p.a.)"
                value={loanBRate}
                onChange={setLoanBRate}
                min={0}
                max={30}
                step={0.1}
                units={[{ id: 'pct', label: '%', symbol: '%' }]}
              />
              <TermInput
                id="loan-b-tenure"
                label="Tenure Duration"
                years={loanBTenureYears}
                months={loanBTenureMonths}
                onChangeYears={setLoanBTenureYears}
                onChangeMonths={setLoanBTenureMonths}
                helpText="Loan duration in years and months"
              />
              <UnitNumberInput
                id="loan-b-fee"
                label="One-Time Processing Fee / Charges"
                value={loanBFee}
                onChange={setLoanBFee}
                min={0}
                max={500000}
                step={isINR ? 1000 : 50}
                prefix={currencySymbol}
              />

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Installment (EMI):</span>
                  <span className="font-bold text-sm text-slate-900">{loanB_EMI ? formatMoney(loanB_EMI.monthlyEMI) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Lifetime Interest:</span>
                  <span className="font-semibold text-amber-700">{loanB_EMI ? formatMoney(loanB_EMI.totalInterest) : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Net Cost (Principal + Int + Fees):</span>
                  <span className="font-black text-sm text-indigo-900">
                    {loanComparisonDelta ? formatMoney(loanComparisonDelta.totalB) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Summary Banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-white mb-2">Neutral Comparison Verdict</h3>
            {loanComparisonDelta ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Total Cost Leader</span>
                  <p className="text-sm font-bold text-emerald-400">
                    {loanComparisonDelta.cheaper} is cheaper by {formatMoney(loanComparisonDelta.diffTotal)} overall.
                  </p>
                  <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                    Factoring in all interest repayments and upfront bank processing charges across the chosen durations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block mb-1">Cashflow Installment Leader</span>
                  <p className="text-sm font-bold text-blue-400">
                    {loanComparisonDelta.lowerEMI} has a lower monthly EMI by {formatMoney(loanComparisonDelta.diffEMI)}/month.
                  </p>
                  <p className="mt-1 text-slate-400 text-[11px] leading-relaxed">
                    Useful if your immediate priority is minimizing monthly household budget pressure.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                Enter details for both Loan A and Loan B above to calculate a side-by-side comparison verdict.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: TRUE COST CALCULATOR */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'true-cost' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  True Cost Framework: "What Will This Really Cost Me?"
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  The sticker price of a major purchase (appliances, cars, electronics, subscriptions, tools) is only
                  the entry fee. Account for taxes, setup, consumable supplies, and recurring running costs.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
                Enter Purchase & Ongoing Costs
              </h3>

              <UnitNumberInput
                id="tc-sticker"
                label="Sticker / Purchase Price"
                value={tcStickerPrice}
                onChange={setTcStickerPrice}
                min={0}
                max={10000000}
                step={isINR ? 1000 : 50}
                prefix={currencySymbol}
              />

              <UnitNumberInput
                id="tc-upfront"
                label="Upfront Delivery, Taxes & Initial Setup"
                value={tcUpfrontTaxDelivery}
                onChange={setTcUpfrontTaxDelivery}
                min={0}
                max={500000}
                step={isINR ? 500 : 25}
                prefix={currencySymbol}
                helpText="Sales tax, shipping, installation accessories"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UnitNumberInput
                  id="tc-monthly-run"
                  label="Monthly Running Cost"
                  value={tcMonthlyRunningCost}
                  onChange={setTcMonthlyRunningCost}
                  min={0}
                  max={50000}
                  step={isINR ? 100 : 10}
                  prefix={currencySymbol}
                  helpText="Electricity, consumables, supplies"
                />
                <UnitNumberInput
                  id="tc-annual-maint"
                  label="Annual Maintenance / Warranty"
                  value={tcAnnualMaintenance}
                  onChange={setTcAnnualMaintenance}
                  min={0}
                  max={100000}
                  step={isINR ? 500 : 20}
                  prefix={currencySymbol}
                  helpText="Service plans, insurance, filters"
                />
              </div>

              <UnitNumberInput
                id="tc-lifespan"
                label="Expected Useful Life (Years)"
                value={tcLifespanYears}
                onChange={setTcLifespanYears}
                min={1}
                max={30}
                step={1}
                helpText="How many years you expect to use it"
              />
            </div>

            {/* Right: True Cost Breakdown */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  True Monthly Equivalent Cost
                </span>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {formatMoney(trueCostResult.trueMonthlyCost)}
                  <span className="text-sm font-normal text-slate-500 ml-2">/ month over {tcLifespanYears} yrs</span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Initial Outlay (Price + Setup)</span>
                  <span className="font-bold text-slate-900">{formatMoney(trueCostResult.initialOutlay)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Lifetime Running Overhead ({tcLifespanYears} Yrs)</span>
                  <span className="font-semibold text-slate-700">
                    {formatMoney(trueCostResult.totalMonthlyCosts + trueCostResult.totalAnnualCosts)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Total Lifetime Cost</span>
                  <span className="font-black text-base text-blue-700">
                    {formatMoney(trueCostResult.totalLifetimeCost)}
                  </span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-600">Ongoing Overhead as % of Sticker Price</span>
                  <span className="font-bold text-amber-600">
                    +{Math.round(trueCostResult.recurringOverheadPercentage)}% extra
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Insight:</strong> For this item, ongoing running and maintenance costs add{' '}
                <strong>{Math.round(trueCostResult.recurringOverheadPercentage)}%</strong> on top of what you paid at the register.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 5: "WHAT AM I FORGETTING?" CHECKLISTS */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'checklists' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-slate-100 to-blue-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  "What Am I Forgetting?" Situation Checklists
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Major life decisions trigger hidden statutory fees, documentation steps, and surprise expenses.
                  Review these verified situational checklists before committing your funds.
                </p>
              </div>
            </div>
          </div>

          {/* Checklist Category Picker */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'house', label: 'Buying a House' },
              { id: 'car', label: 'Buying a Car' },
              { id: 'city', label: 'Moving to a New City' },
              { id: 'trip', label: 'International Trip' },
              { id: 'college', label: 'Starting College' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                id={`chk-cat-${cat.id}`}
                onClick={() => setSelectedChecklistCategory(cat.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                  selectedChecklistCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Checklist Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{activeChecklist.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{activeChecklist.subtitle}</p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    {completedCount} of {activeChecklist.items.length} verified
                  </span>
                  <span className="block text-[10px] text-slate-400 font-semibold">{progressPercent}% complete</span>
                </div>
                <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {activeChecklist.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheckItem(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      isChecked
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors shrink-0 ${
                        isChecked ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span
                        className={`text-sm font-bold block ${
                          isChecked ? 'text-slate-700 line-through' : 'text-slate-900'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs text-slate-500 mt-1 block leading-relaxed">{item.detail}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
