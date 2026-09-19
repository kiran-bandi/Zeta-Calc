import React, { useState, useMemo } from 'react';
import {
  RotateCcw,
  Share2,
  Printer,
  Calendar,
  Users,
  Plane,
  Building,
  Utensils,
  Compass,
  Car,
  ShoppingBag,
  ShieldAlert,
  ArrowRight,
  Download,
  Copy,
  CheckCircle2,
  Info,
  Sparkles,
  Luggage,
  CheckSquare,
  Square,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useHistory } from '../../context/HistoryContext';
import { ToolMetadata } from '../../types/calculator';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { FAQAccordion } from '../common/FAQAccordion';
import { NumberSliderInput } from '../common/NumberSliderInput';
import { DonutChart } from '../common/DonutChart';
import { ShareModal } from '../common/ShareModal';
import { CalculationShareData } from '../../utils/shareUtils';
import { ToolIcon } from '../common/AppIcon';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import {
  calculateTravelBudget,
  TRAVEL_PRESET_PROFILES,
  TravelBudgetInputs,
} from '../../engine/travelBudget';

interface TravelBudgetCalculatorViewProps {
  tool: ToolMetadata;
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onSelectTool: (slug: string) => void;
  onGoBack?: () => void;
}

export const TravelBudgetCalculatorView: React.FC<TravelBudgetCalculatorViewProps> = ({
  tool,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
  onGoBack,
}) => {
  const { formatMoney, preferences } = useSettings();
  const { recordToolUsage } = useHistory();

  React.useEffect(() => {
    recordToolUsage(tool.slug);
  }, [tool.slug]);

  // Travel budget state
  const isINR = preferences.currency === 'INR';
  const currencyMultiplier = isINR ? 80 : 1;

  const [durationDays, setDurationDays] = useState<number | ''>('');
  const [numTravelers, setNumTravelers] = useState<number | ''>('');
  const [flightsPerPerson, setFlightsPerPerson] = useState<number | ''>('');
  const [lodgingPerNight, setLodgingPerNight] = useState<number | ''>('');
  const [foodPerPersonPerDay, setFoodPerPersonPerDay] = useState<number | ''>('');
  const [activitiesPerPersonPerDay, setActivitiesPerPersonPerDay] = useState<number | ''>('');
  const [localTransitPerDay, setLocalTransitPerDay] = useState<number | ''>('');
  const [miscellaneous, setMiscellaneous] = useState<number | ''>('');
  const [contingencyPercent, setContingencyPercent] = useState<number | ''>('');

  // Modals & UI states
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [splitCopied, setSplitCopied] = useState(false);
  const [scheduleViewMode, setScheduleViewMode] = useState<'total' | 'perPerson'>('total');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Interactive Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    insurance: true,
    maps: true,
    cards: false,
    copies: false,
    sim: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Preset Applier
  const applyPreset = (presetId: string) => {
    const preset = TRAVEL_PRESET_PROFILES.find((p) => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setDurationDays(preset.durationDays);
    setNumTravelers(preset.numTravelers);
    setFlightsPerPerson(preset.flightsPerPerson * currencyMultiplier);
    setLodgingPerNight(preset.lodgingPerNight * currencyMultiplier);
    setFoodPerPersonPerDay(preset.foodPerPersonPerDay * currencyMultiplier);
    setActivitiesPerPersonPerDay(preset.activitiesPerPersonPerDay * currencyMultiplier);
    setLocalTransitPerDay(preset.localTransitPerDay * currencyMultiplier);
    setMiscellaneous(preset.miscellaneous * currencyMultiplier);
    setContingencyPercent(preset.contingencyPercent);
  };

  const handleReset = () => {
    setSelectedPresetId('');
    setDurationDays('');
    setNumTravelers('');
    setFlightsPerPerson('');
    setLodgingPerNight('');
    setFoodPerPersonPerDay('');
    setActivitiesPerPersonPerDay('');
    setLocalTransitPerDay('');
    setMiscellaneous('');
    setContingencyPercent('');
  };

  const calculationInputs: TravelBudgetInputs = useMemo(
    () => ({
      durationDays,
      numTravelers,
      flightsPerPerson,
      lodgingPerNight,
      foodPerPersonPerDay,
      activitiesPerPersonPerDay,
      localTransitPerDay,
      miscellaneous,
      contingencyPercent,
    }),
    [
      durationDays,
      numTravelers,
      flightsPerPerson,
      lodgingPerNight,
      foodPerPersonPerDay,
      activitiesPerPersonPerDay,
      localTransitPerDay,
      miscellaneous,
      contingencyPercent,
    ]
  );

  const result = useMemo(() => {
    return calculateTravelBudget(calculationInputs);
  }, [calculationInputs]);

  // Donut chart segments
  const chartSegments = useMemo(() => {
    return result.categories
      .filter((c) => c.amount > 0)
      .map((c) => ({
        label: c.name,
        value: c.amount,
        color: c.color,
      }));
  }, [result]);

  // Copy Group WhatsApp Split Text
  const handleCopyGroupSplit = async () => {
    const text = `✈️ *Travel Budget Summary* (${result.durationDays} Days, ${result.numTravelers} Travelers)
━━━━━━━━━━━━━━━━━━━━━━
💰 *Total Group Budget:* ${formatMoney(result.grandTotal)}
👤 *Per Person:* ${formatMoney(result.perPersonTotal)}
📅 *Daily Group Average:* ${formatMoney(result.perDayTotal)}/day

*Estimated Cost Breakdown:*
• Flights & Travel: ${formatMoney(result.flightsTotal)}
• Hotel & Lodging: ${formatMoney(result.lodgingTotal)} (${result.nights} nights)
• Food & Dining: ${formatMoney(result.foodTotal)}
• Tours & Activities: ${formatMoney(result.activitiesTotal)}
• Local Transit: ${formatMoney(result.localTransitTotal)}
• Shopping & Misc: ${formatMoney(result.miscellaneousTotal)}
• Emergency Buffer (${contingencyPercent}%): ${formatMoney(result.contingencyTotal)}

Calculated on Zeta Calculator Travel Planner.`;

    try {
      await navigator.clipboard.writeText(text);
      setSplitCopied(true);
      setTimeout(() => setSplitCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  // Export Daily Schedule CSV
  const handleExportCSV = () => {
    const headers = ['Day', 'Lodging', 'Food', 'Activities', 'Local Transit', 'Day Total'];
    const rows = result.dailySchedule.map((item) => [
      `Day ${item.day}`,
      item.lodging,
      item.food,
      item.activities,
      item.transit,
      item.total,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travel-budget-${result.durationDays}-days.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentCategory = CATEGORIES.find((c) => c.id === 'travel');

  const calculationShareData = useMemo<CalculationShareData | null>(() => {
    const tripName = selectedPresetId
      ? TRAVEL_PRESET_PROFILES.find((p) => p.id === selectedPresetId)?.name || 'Vacation Trip'
      : 'Vacation Trip';
    return {
      toolSlug: tool.slug,
      toolName: tool.name,
      categorySlug: currentCategory?.slug || 'travel',
      inputs: [
        { label: 'Trip Type', value: tripName },
        { label: 'Trip Duration', value: `${result.durationDays} Days (${result.nights} Nights)` },
        { label: 'Travelers', value: `${result.numTravelers} Person(s)` },
      ],
      outputs: [
        { label: 'Estimated Total Budget', value: formatMoney(result.grandTotal), isHighlight: true },
        { label: 'Cost Per Person', value: formatMoney(result.perPersonTotal) },
        { label: 'Cost Per Day', value: formatMoney(result.perDayTotal) },
        { label: 'Contingency Reserve', value: formatMoney(result.contingencyTotal) },
      ],
    };
  }, [result, selectedPresetId, tool.slug, tool.name, currentCategory, formatMoney]);

  const relatedTools = TOOLS_REGISTRY.filter((t) =>
    ['currency-converter', 'fuel-cost-calculator', 'tip-calculator', 'discount-calculator'].includes(t.slug)
  );

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        onBack={onGoBack}
        items={[
          { label: 'Home', onClick: onNavigateHome },
          {
            label: currentCategory ? currentCategory.name : 'Travel',
            onClick: () => onNavigateCategory('travel'),
          },
          { label: tool.name, active: true },
        ]}
      />

      {/* 2. Header Title & Actions */}
      <div className="mt-4 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 uppercase tracking-wider">
            Travel & Vacation
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
            Real-Time Trip Modeling
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5 border border-sky-100 shadow-2xs">
              <ToolIcon slug={tool.slug} categoryId="travel" size={26} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {tool.name}
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                Calculate total vacation expenses, daily allowances, flights, lodging, per-person splits, and contingency reserves.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="travel-share-btn"
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-sky-600 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              type="button"
              id="travel-print-btn"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Preset Travel Tier Profiles Bar */}
      <div className="mb-8 p-4 bg-gradient-to-r from-sky-50/70 via-white to-blue-50/70 rounded-2xl border border-sky-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick Trip Archetypes (One-Click Setup)
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TRAVEL_PRESET_PROFILES.map((profile) => (
            <button
              key={profile.id}
              type="button"
              id={`preset-btn-${profile.id}`}
              onClick={() => applyPreset(profile.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                selectedPresetId === profile.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-600/20'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-sky-300 hover:bg-sky-50/40'
              }`}
            >
              <div className="text-xs font-bold truncate">{profile.name}</div>
              <div
                className={`text-[10px] mt-0.5 truncate ${
                  selectedPresetId === profile.id ? 'text-sky-100' : 'text-slate-500'
                }`}
              >
                {profile.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Calculator Core (2-Column Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Inputs (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Luggage className="w-4 h-4 text-sky-600" />
              <span>Trip Parameters & Expenses</span>
            </h2>
            <button
              type="button"
              id="travel-reset-btn"
              onClick={handleReset}
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-rose-600 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Group 1: Trip Scope */}
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Duration & Travelers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <NumberSliderInput
                id="travel-duration-days"
                label="Duration (Days)"
                value={durationDays}
                onChange={setDurationDays}
                min={1}
                max={90}
                step={1}
                suffix="Days"
                presets={[
                  { label: '3 Days', value: 3 },
                  { label: '7 Days', value: 7 },
                  { label: '14 Days', value: 14 },
                  { label: '30 Days', value: 30 },
                ]}
              />

              <NumberSliderInput
                id="travel-num-travelers"
                label="Travelers (Persons)"
                value={numTravelers}
                onChange={setNumTravelers}
                min={1}
                max={20}
                step={1}
                suffix="Pax"
                presets={[
                  { label: 'Solo (1)', value: 1 },
                  { label: 'Couple (2)', value: 2 },
                  { label: 'Family (4)', value: 4 },
                ]}
              />
            </div>
          </div>

          {/* Group 2: Transport & Stays */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" />
              <span>Transit & Accommodations</span>
            </div>

            <NumberSliderInput
              id="travel-flights"
              label="Flights / Long-Distance Transit (Per Person)"
              value={flightsPerPerson}
              onChange={setFlightsPerPerson}
              min={0}
              max={5000 * currencyMultiplier}
              step={25 * currencyMultiplier}
              formattedDisplay={formatMoney(flightsPerPerson)}
            />

            <NumberSliderInput
              id="travel-lodging"
              label="Lodging / Hotel Cost (Per Night)"
              value={lodgingPerNight}
              onChange={setLodgingPerNight}
              min={0}
              max={2000 * currencyMultiplier}
              step={10 * currencyMultiplier}
              formattedDisplay={formatMoney(lodgingPerNight)}
            />
          </div>

          {/* Group 3: Daily Allowances */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5" />
              <span>Daily Expenses & Activities</span>
            </div>

            <NumberSliderInput
              id="travel-food"
              label="Food & Dining (Per Person Per Day)"
              value={foodPerPersonPerDay}
              onChange={setFoodPerPersonPerDay}
              min={0}
              max={500 * currencyMultiplier}
              step={5 * currencyMultiplier}
              formattedDisplay={formatMoney(foodPerPersonPerDay)}
            />

            <NumberSliderInput
              id="travel-activities"
              label="Tours, Sights & Activities (Per Person Per Day)"
              value={activitiesPerPersonPerDay}
              onChange={setActivitiesPerPersonPerDay}
              min={0}
              max={500 * currencyMultiplier}
              step={5 * currencyMultiplier}
              formattedDisplay={formatMoney(activitiesPerPersonPerDay)}
            />

            <NumberSliderInput
              id="travel-transit"
              label="Local Transit / Taxis (Total Group Per Day)"
              value={localTransitPerDay}
              onChange={setLocalTransitPerDay}
              min={0}
              max={300 * currencyMultiplier}
              step={5 * currencyMultiplier}
              formattedDisplay={formatMoney(localTransitPerDay)}
            />
          </div>

          {/* Group 4: Buffer & Misc */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Reserves & Extras</span>
            </div>

            <NumberSliderInput
              id="travel-misc"
              label="Shopping, Souvenirs & Visas (Total Group)"
              value={miscellaneous}
              onChange={setMiscellaneous}
              min={0}
              max={5000 * currencyMultiplier}
              step={25 * currencyMultiplier}
              formattedDisplay={formatMoney(miscellaneous)}
            />

            <NumberSliderInput
              id="travel-contingency"
              label="Emergency Contingency Reserve (%)"
              value={contingencyPercent}
              onChange={setContingencyPercent}
              min={0}
              max={30}
              step={1}
              suffix="%"
              presets={[
                { label: '5% (Tight)', value: 5 },
                { label: '10% (Normal)', value: 10 },
                { label: '15% (Safe)', value: 15 },
                { label: '20% (Conservative)', value: 20 },
              ]}
            />
          </div>
        </div>

        {/* Right Column: Key Results & Visual Distribution (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Key Results Card (Dark Premium Atmosphere) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
                <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  Estimated Total Vacation Budget
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {result.durationDays} Days • {result.nights} Nights • {result.numTravelers} Travelers
              </span>
            </div>

            {/* Prominent Headline Budget */}
            <div className="mb-6">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                {formatMoney(result.grandTotal)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Includes all transit, lodging, food, tours, and {contingencyPercent}% contingency reserve.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Cost Per Person</span>
                <span className="text-base font-bold text-sky-300">
                  {formatMoney(result.perPersonTotal)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Cost Per Day</span>
                <span className="text-base font-bold text-emerald-300">
                  {formatMoney(result.perDayTotal)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Contingency Buffer</span>
                <span className="text-base font-bold text-amber-300">
                  {formatMoney(result.contingencyTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Distribution Visual Breakdown */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Expense Category Distribution
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Subtotal: {formatMoney(result.subtotal)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <DonutChart
                  segments={chartSegments}
                  size={170}
                  strokeWidth={26}
                  centerLabel="Total Budget"
                  centerSubLabel={formatMoney(result.grandTotal)}
                />
              </div>

              <div className="flex-1 space-y-2.5 w-full">
                {result.categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-slate-700 truncate font-medium">{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-slate-400 text-[11px]">{cat.percentage}%</span>
                      <strong className="text-slate-900 font-semibold">{formatMoney(cat.amount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Traveler Group Split Summary */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-700" />
                <h4 className="text-sm font-bold text-sky-950">Group Traveler Split</h4>
              </div>
              <p className="text-xs text-sky-800">
                Each traveler owes <strong>{formatMoney(result.perPersonTotal)}</strong> ({formatMoney(result.perPersonPerDay)}/person/day).
              </p>
            </div>
            <button
              type="button"
              id="copy-group-split-btn"
              onClick={handleCopyGroupSplit}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
                splitCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-sky-700 text-white hover:bg-sky-800'
              }`}
            >
              {splitCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{splitCopied ? 'Copied to Clipboard!' : 'Copy WhatsApp Summary'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Day-by-Day Itinerary Cost Allocation Schedule */}
      <section className="mt-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              <span>Day-by-Day Budget Allocation Schedule</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Estimated daily disbursement schedule across your {result.durationDays}-day trip itinerary.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                id="schedule-toggle-total"
                onClick={() => setScheduleViewMode('total')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  scheduleViewMode === 'total'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Total Group
              </button>
              <button
                type="button"
                id="schedule-toggle-perperson"
                onClick={() => setScheduleViewMode('perPerson')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  scheduleViewMode === 'perPerson'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Per Person
              </button>
            </div>

            <button
              type="button"
              id="export-travel-csv-btn"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="Download CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Lodging</th>
                <th className="px-4 py-3">Food & Dining</th>
                <th className="px-4 py-3">Activities</th>
                <th className="px-4 py-3">Local Transit</th>
                <th className="px-4 py-3 text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {result.dailySchedule.map((item) => {
                const multiplier = scheduleViewMode === 'perPerson' ? 1 / result.numTravelers : 1;
                return (
                  <tr key={item.day} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 font-sans">Day {item.day}</td>
                    <td className="px-4 py-3">{formatMoney(Math.round(item.lodging * multiplier))}</td>
                    <td className="px-4 py-3">{formatMoney(Math.round(item.food * multiplier))}</td>
                    <td className="px-4 py-3">{formatMoney(Math.round(item.activities * multiplier))}</td>
                    <td className="px-4 py-3">{formatMoney(Math.round(item.transit * multiplier))}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900">
                      {formatMoney(Math.round(item.total * multiplier))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Travel Packing & Financial Checklist */}
      <section className="mt-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mb-2">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <span>Pre-Departure Financial & Packing Checklist</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Avoid costly fees, card blocks, and unexpected overseas travel charges before embarking.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            {
              id: 'insurance',
              title: 'Comprehensive Travel Insurance',
              desc: 'Covers unexpected medical emergencies, trip delays, and lost luggage.',
            },
            {
              id: 'maps',
              title: 'Offline Maps & City Guides',
              desc: 'Pre-download Google Maps offline areas to avoid expensive roaming data.',
            },
            {
              id: 'cards',
              title: 'Zero Forex Fee Credit/Debit Cards',
              desc: 'Use cards that waive the 2.5%–3.5% foreign transaction surcharge.',
            },
            {
              id: 'copies',
              title: 'Cloud Copies of Passport & Visas',
              desc: 'Store encrypted digital copies of IDs, tickets, and bookings.',
            },
            {
              id: 'sim',
              title: 'Local eSIM / Roaming Package',
              desc: 'Install destination eSIM for instant navigation upon landing.',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                checkedItems[item.id]
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {checkedItems[item.id] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Travel Budgeting Formulas & Methodology */}
      <section className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
          Mathematical Formulation & Allocation Model
        </h2>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          The Travel Budget Planner executes deterministic category partitioning:
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-800 space-y-2 shadow-xs">
          <div><strong>Subtotal</strong> = (Flights × Travelers) + (Lodging × Nights) + (Food × Travelers × Days) + (Activities × Travelers × Days) + (Transit × Days) + Misc</div>
          <div><strong>Contingency Reserve</strong> = Subtotal × (Contingency % ÷ 100)</div>
          <div><strong>Grand Total</strong> = Subtotal + Contingency Reserve</div>
          <div><strong>Per Person Rate</strong> = Grand Total ÷ Travelers</div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="mt-10">
        <FAQAccordion
          faqs={[
            {
              question: 'How much emergency contingency buffer should I maintain for an overseas trip?',
              answer:
                'We recommend maintaining 10% to 15% of your subtotal as an emergency reserve. This provides an essential cushion against sudden exchange rate fluctuations, flight reschedule fees, medical copays, or missed transit connections.',
            },
            {
              question: 'Should I exchange local currency before departure or use local ATMs at my destination?',
              answer:
                'In most cases, withdrawing cash directly from legitimate bank ATMs in your destination country yields significantly superior exchange rates compared to airport exchange kiosks. Ensure your debit card features zero or low foreign transaction fees.',
            },
            {
              question: 'How are lodging nights calculated compared to trip duration?',
              answer:
                'A 7-day vacation typically involves 6 hotel nights (Days − 1), since checkout occurs on the final morning of the itinerary. If you require day-use accommodation or a late checkout, adjust the lodging rate accordingly.',
            },
            {
              question: 'How does group size affect per-person travel costs?',
              answer:
                'Larger travel groups benefit from shared fixed costs like rental cars, multi-room vacation apartments, and private group transfer minivans. However, variable costs like airfares, meal bills, and museum admission tickets scale directly with each traveler.',
            },
          ]}
        />
      </section>

      {/* 9. Related Tools Navigation */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-4">
            Related Travel & Financial Calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map((rel) => (
              <button
                key={rel.id}
                type="button"
                id={`related-tool-${rel.slug}`}
                onClick={() => onSelectTool(rel.slug)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-3 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                    <ToolIcon slug={rel.slug} categoryId={rel.category} size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {rel.shortDescription}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-sky-600">
                  <span>Open tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={tool.name}
        toolName={tool.name}
        toolSlug={tool.slug}
        categorySlug={currentCategory?.slug}
        description={`Estimated vacation budget: ${formatMoney(result.grandTotal)} for ${result.durationDays} days (${formatMoney(result.perPersonTotal)} per traveler).`}
        calculationData={calculationShareData}
      />
    </article>
  );
};
