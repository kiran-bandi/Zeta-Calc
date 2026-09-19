import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { UnitNumberInput } from '../common/UnitNumberInput';
import {
  Sparkles,
  Coffee,
  Smartphone,
  Utensils,
  Repeat,
  Car,
  Laptop,
  Scale,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface DiscoverPageProps {
  onNavigateHome: () => void;
  onNavigateToTool: (slug: string) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onNavigateHome, onNavigateToTool }) => {
  const { formatMoney, currencySymbol } = useSettings();

  // 1. Phone Cost per Day
  const [phonePrice, setPhonePrice] = useState<number | ''>('');
  const [phoneMonths, setPhoneMonths] = useState<number | ''>('');

  // 2. Coffee Cost per Year
  const [coffeePrice, setCoffeePrice] = useState<number | ''>('');
  const [cupsPerWeek, setCupsPerWeek] = useState<number | ''>('');

  // 3. Eating Out Cost per Year
  const [mealCost, setMealCost] = useState<number | ''>('');
  const [mealsPerWeek, setMealsPerWeek] = useState<number | ''>('');

  // 4. Subscription Waste Calculator
  const [monthlySubsTotal, setMonthlySubsTotal] = useState<number | ''>('');
  const [unutilizedPct, setUnutilizedPct] = useState<number | ''>('');

  // 5. Work From Home Savings
  const [dailyCommuteCost, setDailyCommuteCost] = useState<number | ''>('');
  const [dailyLunchSavings, setDailyLunchSavings] = useState<number | ''>('');
  const [wfhDaysPerWeek, setWfhDaysPerWeek] = useState<number | ''>('');

  // Calculations
  const phoneCostPerDay =
    phonePrice !== '' && phoneMonths !== '' && phoneMonths > 0
      ? Number(phonePrice) / (Number(phoneMonths) * 30.41)
      : null;

  const coffeeAnnualCost =
    coffeePrice !== '' && cupsPerWeek !== ''
      ? Number(coffeePrice) * Number(cupsPerWeek) * 52
      : null;

  const eatingOutAnnualCost =
    mealCost !== '' && mealsPerWeek !== ''
      ? Number(mealCost) * Number(mealsPerWeek) * 52
      : null;

  const subscriptionAnnualWaste =
    monthlySubsTotal !== '' && unutilizedPct !== ''
      ? (Number(monthlySubsTotal) * 12 * Number(unutilizedPct)) / 100
      : null;

  const wfhAnnualSavings =
    dailyCommuteCost !== '' && dailyLunchSavings !== '' && wfhDaysPerWeek !== ''
      ? (Number(dailyCommuteCost) + Number(dailyLunchSavings)) * Number(wfhDaysPerWeek) * 48
      : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in w-full min-w-0">
      <Breadcrumbs items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Discover' }]} />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Everyday Micro-Calculators</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Discover: The Real Cost of Daily Habits
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Uncover the hidden annual compounding of your everyday purchases and lifestyle decisions with interactive micro-calculators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start">
        {/* Card 1: Phone Cost per Day */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Phone Cost per Day</h3>
            </div>
            {(phonePrice !== '' || phoneMonths !== '') && (
              <button
                type="button"
                onClick={() => {
                  setPhonePrice('');
                  setPhoneMonths('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            What is your smartphone actually costing you every single day of ownership?
          </p>

          <div className="space-y-3 pt-1">
            <UnitNumberInput
              id="disc-phone-price"
              label="Device Purchase Price"
              value={phonePrice}
              onChange={setPhonePrice}
              prefix={currencySymbol}
              placeholder="e.g. 999"
              min={0}
            />
            <UnitNumberInput
              id="disc-phone-months"
              label="Intended Lifespan (Months)"
              value={phoneMonths}
              onChange={setPhoneMonths}
              placeholder="e.g. 36 (3 years)"
              min={1}
            />
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block">
              True Daily Ownership Cost
            </span>
            <div className="text-2xl font-black text-blue-900 mt-0.5">
              {phoneCostPerDay !== null ? `${formatMoney(phoneCostPerDay)} / day` : '—'}
            </div>
          </div>
        </div>

        {/* Card 2: Coffee Cost per Year */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Coffee Cost per Year</h3>
            </div>
            {(coffeePrice !== '' || cupsPerWeek !== '') && (
              <button
                type="button"
                onClick={() => {
                  setCoffeePrice('');
                  setCupsPerWeek('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            How much do cafe visits add up to over 12 months?
          </p>

          <div className="space-y-3 pt-1">
            <UnitNumberInput
              id="disc-coffee-price"
              label="Price per Cup"
              value={coffeePrice}
              onChange={setCoffeePrice}
              prefix={currencySymbol}
              placeholder="e.g. 4.50"
              min={0}
            />
            <UnitNumberInput
              id="disc-cups-week"
              label="Cups Bought per Week"
              value={cupsPerWeek}
              onChange={setCupsPerWeek}
              placeholder="e.g. 5"
              min={0}
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
              Annual Coffee Expenditure
            </span>
            <div className="text-2xl font-black text-amber-950 mt-0.5">
              {coffeeAnnualCost !== null ? `${formatMoney(coffeeAnnualCost)} / yr` : '—'}
            </div>
          </div>
        </div>

        {/* Card 3: Eating Out Cost per Year */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Eating Out per Year</h3>
            </div>
            {(mealCost !== '' || mealsPerWeek !== '') && (
              <button
                type="button"
                onClick={() => {
                  setMealCost('');
                  setMealsPerWeek('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Takeout, food delivery apps, and restaurants annualized.
          </p>

          <div className="space-y-3 pt-1">
            <UnitNumberInput
              id="disc-meal-cost"
              label="Average Cost per Order / Meal"
              value={mealCost}
              onChange={setMealCost}
              prefix={currencySymbol}
              placeholder="e.g. 25"
              min={0}
            />
            <UnitNumberInput
              id="disc-meals-week"
              label="Times Dining Out / Takeout per Week"
              value={mealsPerWeek}
              onChange={setMealsPerWeek}
              placeholder="e.g. 3"
              min={0}
            />
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100 text-center">
            <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">
              Annual Dining Out Total
            </span>
            <div className="text-2xl font-black text-rose-950 mt-0.5">
              {eatingOutAnnualCost !== null ? `${formatMoney(eatingOutAnnualCost)} / yr` : '—'}
            </div>
          </div>
        </div>

        {/* Card 4: Subscription Waste Calculator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Subscription Waste</h3>
            </div>
            {(monthlySubsTotal !== '' || unutilizedPct !== '') && (
              <button
                type="button"
                onClick={() => {
                  setMonthlySubsTotal('');
                  setUnutilizedPct('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Streaming services, gym memberships, apps rarely used.
          </p>

          <div className="space-y-3 pt-1">
            <UnitNumberInput
              id="disc-subs-total"
              label="Total Monthly Subscriptions"
              value={monthlySubsTotal}
              onChange={setMonthlySubsTotal}
              prefix={currencySymbol}
              placeholder="e.g. 120"
              min={0}
            />
            <UnitNumberInput
              id="disc-subs-unutilized"
              label="Estimated Unused Portion (%)"
              value={unutilizedPct}
              onChange={setUnutilizedPct}
              placeholder="e.g. 30"
              suffix="%"
              min={0}
              max={100}
            />
          </div>

          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
            <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider block">
              Annual Inactive Subscription Loss
            </span>
            <div className="text-2xl font-black text-purple-950 mt-0.5">
              {subscriptionAnnualWaste !== null
                ? `${formatMoney(subscriptionAnnualWaste)} / yr`
                : '—'}
            </div>
          </div>
        </div>

        {/* Card 5: Work from Home Savings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Work-from-Home Net Annual Savings</h3>
            </div>
            {(dailyCommuteCost !== '' || dailyLunchSavings !== '' || wfhDaysPerWeek !== '') && (
              <button
                type="button"
                onClick={() => {
                  setDailyCommuteCost('');
                  setDailyLunchSavings('');
                  setWfhDaysPerWeek('');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-700"
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Calculate saved transit tickets, fuel, parking, and takeout by working remotely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <UnitNumberInput
              id="disc-commute-cost"
              label="Daily Transit/Fuel Saved"
              value={dailyCommuteCost}
              onChange={setDailyCommuteCost}
              prefix={currencySymbol}
              placeholder="e.g. 15"
              min={0}
            />
            <UnitNumberInput
              id="disc-lunch-savings"
              label="Daily Lunch/Coffee Saved"
              value={dailyLunchSavings}
              onChange={setDailyLunchSavings}
              prefix={currencySymbol}
              placeholder="e.g. 12"
              min={0}
            />
            <UnitNumberInput
              id="disc-wfh-days"
              label="WFH Days per Week"
              value={wfhDaysPerWeek}
              onChange={setWfhDaysPerWeek}
              placeholder="e.g. 3"
              min={1}
              max={5}
            />
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
            <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
              Estimated Annual Net Cash Retained (48 Work Weeks)
            </span>
            <div className="text-3xl font-black text-emerald-950 mt-0.5">
              {wfhAnnualSavings !== null ? `${formatMoney(wfhAnnualSavings)} / yr` : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
