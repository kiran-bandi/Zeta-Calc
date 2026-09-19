export interface TravelBudgetInputs {
  durationDays: number;
  numTravelers: number;
  flightsPerPerson: number;
  lodgingPerNight: number;
  foodPerPersonPerDay: number;
  activitiesPerPersonPerDay: number;
  localTransitPerDay: number;
  miscellaneous: number;
  contingencyPercent: number;
}

export interface TravelExpenseCategory {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  color: string;
  perPerson: number;
  perDay: number;
}

export interface DailyBudgetItem {
  day: number;
  lodging: number;
  food: number;
  activities: number;
  transit: number;
  total: number;
}

export interface TravelBudgetResult {
  durationDays: number;
  nights: number;
  numTravelers: number;
  flightsTotal: number;
  lodgingTotal: number;
  foodTotal: number;
  activitiesTotal: number;
  localTransitTotal: number;
  miscellaneousTotal: number;
  subtotal: number;
  contingencyTotal: number;
  grandTotal: number;
  perPersonTotal: number;
  perDayTotal: number;
  perPersonPerDay: number;
  categories: TravelExpenseCategory[];
  dailySchedule: DailyBudgetItem[];
}

export const TRAVEL_PRESET_PROFILES = [
  {
    id: 'budget-backpacking',
    name: 'Budget Backpacking',
    subtitle: 'Hostels, street food, public transport',
    durationDays: 7,
    numTravelers: 1,
    flightsPerPerson: 350,
    lodgingPerNight: 35,
    foodPerPersonPerDay: 25,
    activitiesPerPersonPerDay: 20,
    localTransitPerDay: 10,
    miscellaneous: 100,
    contingencyPercent: 10,
  },
  {
    id: 'moderate-comfortable',
    name: 'Mid-Range Explorer',
    subtitle: '3-4★ hotels, casual dining, top sights',
    durationDays: 7,
    numTravelers: 2,
    flightsPerPerson: 550,
    lodgingPerNight: 140,
    foodPerPersonPerDay: 55,
    activitiesPerPersonPerDay: 40,
    localTransitPerDay: 30,
    miscellaneous: 250,
    contingencyPercent: 12,
  },
  {
    id: 'luxury-resort',
    name: 'Premium & Luxury',
    subtitle: '5★ resorts, fine dining, private tours',
    durationDays: 7,
    numTravelers: 2,
    flightsPerPerson: 1200,
    lodgingPerNight: 380,
    foodPerPersonPerDay: 130,
    activitiesPerPersonPerDay: 100,
    localTransitPerDay: 70,
    miscellaneous: 600,
    contingencyPercent: 15,
  },
  {
    id: 'family-vacation',
    name: 'Family Getaway',
    subtitle: 'Apartment/Suite, family-friendly activities',
    durationDays: 6,
    numTravelers: 4,
    flightsPerPerson: 400,
    lodgingPerNight: 220,
    foodPerPersonPerDay: 45,
    activitiesPerPersonPerDay: 35,
    localTransitPerDay: 50,
    miscellaneous: 350,
    contingencyPercent: 12,
  },
];

export function calculateTravelBudget(inputs: TravelBudgetInputs): TravelBudgetResult {
  const durationDays = Math.max(1, Math.min(180, inputs.durationDays || 1));
  const nights = Math.max(1, durationDays - 1);
  const numTravelers = Math.max(1, Math.min(50, inputs.numTravelers || 1));

  const flightsTotal = Math.max(0, inputs.flightsPerPerson || 0) * numTravelers;
  const lodgingTotal = Math.max(0, inputs.lodgingPerNight || 0) * nights;
  const foodTotal = Math.max(0, inputs.foodPerPersonPerDay || 0) * numTravelers * durationDays;
  const activitiesTotal = Math.max(0, inputs.activitiesPerPersonPerDay || 0) * numTravelers * durationDays;
  const localTransitTotal = Math.max(0, inputs.localTransitPerDay || 0) * durationDays;
  const miscellaneousTotal = Math.max(0, inputs.miscellaneous || 0);

  const subtotal =
    flightsTotal +
    lodgingTotal +
    foodTotal +
    activitiesTotal +
    localTransitTotal +
    miscellaneousTotal;

  const contingencyPercent = Math.max(0, Math.min(50, inputs.contingencyPercent || 0));
  const contingencyTotal = Math.round(subtotal * (contingencyPercent / 100));
  const grandTotal = subtotal + contingencyTotal;

  const perPersonTotal = grandTotal / numTravelers;
  const perDayTotal = grandTotal / durationDays;
  const perPersonPerDay = grandTotal / (numTravelers * durationDays);

  const safeGrandTotal = grandTotal > 0 ? grandTotal : 1;

  const categories: TravelExpenseCategory[] = [
    {
      id: 'flights',
      name: 'Flights & Transit',
      amount: flightsTotal,
      percentage: Math.round((flightsTotal / safeGrandTotal) * 1000) / 10,
      color: '#3B82F6', // Blue
      perPerson: flightsTotal / numTravelers,
      perDay: flightsTotal / durationDays,
    },
    {
      id: 'lodging',
      name: 'Lodging & Hotels',
      amount: lodgingTotal,
      percentage: Math.round((lodgingTotal / safeGrandTotal) * 1000) / 10,
      color: '#8B5CF6', // Purple
      perPerson: lodgingTotal / numTravelers,
      perDay: lodgingTotal / durationDays,
    },
    {
      id: 'food',
      name: 'Food & Dining',
      amount: foodTotal,
      percentage: Math.round((foodTotal / safeGrandTotal) * 1000) / 10,
      color: '#F59E0B', // Amber
      perPerson: foodTotal / numTravelers,
      perDay: foodTotal / durationDays,
    },
    {
      id: 'activities',
      name: 'Activities & Tours',
      amount: activitiesTotal,
      percentage: Math.round((activitiesTotal / safeGrandTotal) * 1000) / 10,
      color: '#10B981', // Emerald
      perPerson: activitiesTotal / numTravelers,
      perDay: activitiesTotal / durationDays,
    },
    {
      id: 'transit',
      name: 'Local Transport',
      amount: localTransitTotal,
      percentage: Math.round((localTransitTotal / safeGrandTotal) * 1000) / 10,
      color: '#06B6D4', // Cyan
      perPerson: localTransitTotal / numTravelers,
      perDay: localTransitTotal / durationDays,
    },
    {
      id: 'misc',
      name: 'Shopping & Misc',
      amount: miscellaneousTotal,
      percentage: Math.round((miscellaneousTotal / safeGrandTotal) * 1000) / 10,
      color: '#EC4899', // Pink
      perPerson: miscellaneousTotal / numTravelers,
      perDay: miscellaneousTotal / durationDays,
    },
    {
      id: 'contingency',
      name: 'Contingency Buffer',
      amount: contingencyTotal,
      percentage: Math.round((contingencyTotal / safeGrandTotal) * 1000) / 10,
      color: '#64748B', // Slate
      perPerson: contingencyTotal / numTravelers,
      perDay: contingencyTotal / durationDays,
    },
  ];

  // Daily schedule generation
  const dailyLodging = nights > 0 ? lodgingTotal / nights : 0;
  const dailyFood = foodTotal / durationDays;
  const dailyActivities = activitiesTotal / durationDays;
  const dailyTransit = localTransitTotal / durationDays;

  const dailySchedule: DailyBudgetItem[] = [];
  for (let d = 1; d <= durationDays; d++) {
    // The last day doesn't have lodging if travelers check out in morning
    const dayLodging = d <= nights ? dailyLodging : 0;
    const dayTotal = dayLodging + dailyFood + dailyActivities + dailyTransit;
    dailySchedule.push({
      day: d,
      lodging: Math.round(dayLodging),
      food: Math.round(dailyFood),
      activities: Math.round(dailyActivities),
      transit: Math.round(dailyTransit),
      total: Math.round(dayTotal),
    });
  }

  return {
    durationDays,
    nights,
    numTravelers,
    flightsTotal: Math.round(flightsTotal),
    lodgingTotal: Math.round(lodgingTotal),
    foodTotal: Math.round(foodTotal),
    activitiesTotal: Math.round(activitiesTotal),
    localTransitTotal: Math.round(localTransitTotal),
    miscellaneousTotal: Math.round(miscellaneousTotal),
    subtotal: Math.round(subtotal),
    contingencyTotal: Math.round(contingencyTotal),
    grandTotal: Math.round(grandTotal),
    perPersonTotal: Math.round(perPersonTotal),
    perDayTotal: Math.round(perDayTotal),
    perPersonPerDay: Math.round(perPersonPerDay),
    categories,
    dailySchedule,
  };
}
