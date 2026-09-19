import React from 'react';
import {
  // Category & Core Navigation Icons
  WalletCards,
  House,
  CarFront,
  ShoppingBag,
  BriefcaseBusiness,
  Plane,
  GraduationCap,
  CookingPot,
  CalendarClock,
  ArrowLeftRight,
  Calculator,
  Compass,
  Landmark,
  PiggyBank,
  ChartNoAxesCombined,
  HeartPulse,
  Atom,
  Search,
  ListFilter,
  Grid,
  List,

  // Tool Specific Icons
  HandCoins,
  GitCompare,
  TableProperties,
  CircleDollarSign,
  BadgeCheck,
  Percent,
  Target,
  ShieldCheck,
  CalendarPlus,
  TrendingUp,
  CalendarRange,
  WalletMinimal,
  Umbrella,
  ChartNoAxesColumnIncreasing,
  HousePlus,
  BadgeDollarSign,
  Building2,
  Construction,
  Paintbrush,
  PanelsTopLeft,
  Grid2X2,
  Square,
  Fuel,
  Gauge,
  Route,
  BatteryCharging,
  Car,
  TrendingDown,
  MapPin,
  BadgePercent,
  Tag,
  Scale,
  Weight,
  Droplets,
  Package,
  Gift,
  RefreshCw,
  ShoppingCart,
  GitCompareArrows,
  Banknote,
  Wallet,
  Clock3,
  ClockPlus,
  Timer,
  CalendarOff,
  CalendarDays,
  Coins,
  Clock,
  Hotel,
  Users,
  Globe2,
  Award,
  CalendarCheck,
  BookOpen,
  Zap,
  Hammer,
  ChefHat,
  ShoppingBasket,
  Receipt,
  Cake,
  Heart,
  Ruler,
  Container,
  Thermometer,
  HardDrive,
  Sigma,
  Divide,
  SpellCheck,
  Shuffle,
  QrCode,
  KeyRound,
  FileText,
  TextCursorInput,
  FileDigit,
  ReceiptText,
  ListChecks,
  FileSearch,
  Sparkles,
  Baby,
  Activity,
  Flame,
  Network,
  Layers,
  Dices,
  Wind,
  Boxes,
  Triangle,
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';

/**
 * Single source of truth icon registry mapping icon names to Lucide icon components.
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // Category Icons
  WalletCards,
  House,
  CarFront,
  ShoppingBag,
  BriefcaseBusiness,
  Plane,
  GraduationCap,
  CookingPot,
  CalendarClock,
  ArrowLeftRight,
  Calculator,
  Compass,
  Landmark,
  PiggyBank,
  ChartNoAxesCombined,
  HeartPulse,
  Search,
  ListFilter,
  Grid,
  List,

  // Money, Loans, Savings & Investment
  HandCoins,
  GitCompare,
  TableProperties,
  CircleDollarSign,
  BadgeCheck,
  Percent,
  Target,
  ShieldCheck,
  CalendarPlus,
  TrendingUp,
  CalendarRange,
  WalletMinimal,
  Umbrella,
  ChartNoAxesColumnIncreasing,

  // Property & Construction
  HousePlus,
  BadgeDollarSign,
  Building2,
  Construction,
  Paintbrush,
  PanelsTopLeft,
  Grid2X2,
  Square,

  // Vehicles & Transport
  Fuel,
  Gauge,
  Route,
  BatteryCharging,
  Car,
  TrendingDown,
  MapPin,

  // Shopping & Commerce
  BadgePercent,
  Tag,
  Scale,
  Weight,
  Droplets,
  Package,
  Gift,
  RefreshCw,
  ShoppingCart,
  GitCompareArrows,

  // Salary & Work
  Banknote,
  Wallet,
  Clock3,
  ClockPlus,
  Timer,
  CalendarOff,
  CalendarDays,

  // Travel & Geography
  Coins,
  Clock,
  Hotel,
  Users,
  Globe2,

  // Education & Academics
  Award,
  CalendarCheck,
  BookOpen,

  // Home & Food
  Zap,
  Hammer,
  ChefHat,
  ShoppingBasket,
  Receipt,

  // Date, Time & Life Events
  Cake,
  Heart,

  // Converters & Measurements
  Ruler,
  Container,
  Thermometer,
  HardDrive,

  // Everyday Math & Utilities
  Sigma,
  Divide,
  Fraction: Divide, // Fallback for Fraction in lucide-react
  SpellCheck,
  Shuffle,
  QrCode,
  KeyRound,
  FileText,
  TextCursorInput,
  FileDigit,

  // Decision Center
  ReceiptText,
  ListChecks,
  FileSearch,

  // Health & Fitness
  Baby,
  Activity,
  Flame,

  // Construction, Math & Utilities
  Network,
  Layers,
  Dices,
  Wind,
  Boxes,
  Triangle,

  // Fallback
  Sparkles,
  Atom,
};

/**
 * Category-to-icon mapping matching the official specifications
 */
export const CATEGORY_ICONS: Record<string, keyof typeof ICON_REGISTRY> = {
  money: 'WalletCards',
  loans: 'Landmark',
  savings: 'PiggyBank',
  investing: 'ChartNoAxesCombined',
  property: 'House',
  vehicles: 'CarFront',
  shopping: 'ShoppingBag',
  'salary-work': 'BriefcaseBusiness',
  travel: 'Plane',
  education: 'GraduationCap',
  home: 'Hammer',
  food: 'CookingPot',
  'home-food': 'CookingPot',
  health: 'HeartPulse',
  'date-time': 'CalendarClock',
  converters: 'ArrowLeftRight',
  math: 'Sigma',
  everyday: 'Calculator',
  'math-everyday': 'Calculator',
  'decision-center': 'Compass',
  'all-tools': 'Grid',
  physics: 'Atom',
};

/**
 * Subcategory-to-icon mapping matching the official specifications
 */
export const SUBCATEGORY_ICONS: Record<string, keyof typeof ICON_REGISTRY> = {
  loans: 'Landmark',
  savings: 'PiggyBank',
  investments: 'ChartNoAxesCombined',
  'personal-finance': 'WalletCards',
  mortgage: 'House',
  home: 'House',
  vehicle: 'CarFront',
  personal: 'HandCoins',
  education: 'GraduationCap',
  'simple-interest': 'Percent',
  'compound-interest': 'ChartNoAxesCombined',
  goals: 'Target',
  sip: 'TrendingUp',
  returns: 'Percent',
  purchasing: 'House',
  rental: 'Percent',
  'running-costs': 'Fuel',
  financing: 'CarFront',
  discounts: 'BadgePercent',
  pricing: 'Scale',
  'take-home': 'Wallet',
  wages: 'Clock3',
  budget: 'Wallet',
  logistics: 'Coins',
  'college-funding': 'GraduationCap',
  grades: 'Award',
  utilities: 'Zap',
  diy: 'Paintbrush',
  cooking: 'ChefHat',
  nutrition: 'Scale',
  fitness: 'Gauge',
  wellness: 'Droplets',
  calendars: 'CalendarDays',
  time: 'Clock3',
  'metric-imperial': 'Ruler',
  currency: 'Coins',
  percentages: 'Percent',
  'everyday-math': 'Divide',
};

/**
 * Tool slug to specific preferred Lucide icon name mapping
 */
export const TOOL_SLUG_ICONS: Record<string, keyof typeof ICON_REGISTRY> = {
  // Money & Loans
  'emi-calculator': 'CalendarClock',
  'home-loan-calculator': 'House',
  'car-loan-calculator': 'CarFront',
  'personal-loan-calculator': 'HandCoins',
  'education-loan-calculator': 'GraduationCap',
  'loan-comparison': 'GitCompare',
  'loan-comparison-calculator': 'GitCompare',
  'loan-amortization': 'TableProperties',
  'loan-prepayment-calculator': 'CircleDollarSign',
  'early-payoff-calculator': 'BadgeCheck',

  // Savings Tools
  'simple-interest-calculator': 'Percent',
  'compound-interest-calculator': 'ChartNoAxesCombined',
  'savings-goal-calculator': 'Target',
  'emergency-fund-calculator': 'ShieldCheck',
  'fd-calculator': 'Landmark',
  'fixed-deposit-calculator': 'Landmark',
  'rd-calculator': 'CalendarPlus',

  // Investment Tools
  'sip-calculator': 'TrendingUp',
  'yearly-sip-calculator': 'CalendarRange',
  'step-up-sip-calculator': 'TrendingUp',
  'lump-sum-calculator': 'CircleDollarSign',
  'swp-calculator': 'WalletMinimal',
  'roi-calculator': 'Percent',
  'cagr-calculator': 'ChartNoAxesCombined',
  'retirement-calculator': 'Umbrella',
  'inflation-calculator': 'ChartNoAxesColumnIncreasing',

  // Property Tools
  'property-tax-calculator': 'Receipt',
  'home-affordability-calculator': 'HousePlus',
  'down-payment-calculator': 'BadgeDollarSign',
  'rent-vs-buy-calculator': 'GitCompare',
  'property-cost-calculator': 'Building2',
  'rental-yield-calculator': 'Percent',
  'construction-cost-calculator': 'Construction',
  'renovation-cost-calculator': 'Paintbrush',
  'paint-calculator': 'Paintbrush',
  'flooring-calculator': 'PanelsTopLeft',
  'tile-calculator': 'Grid2X2',
  'room-area-calculator': 'Square',
  'square-footage-calculator': 'Square',

  // Vehicle Tools
  'car-affordability-calculator': 'CarFront',
  'fuel-cost-calculator': 'Fuel',
  'mileage-calculator': 'Gauge',
  'cost-per-km-calculator': 'Route',
  'ev-charging-calculator': 'BatteryCharging',
  'ev-vs-petrol-calculator': 'GitCompare',
  'vehicle-ownership-cost-calculator': 'Car',
  'depreciation-calculator': 'TrendingDown',
  'trip-cost-calculator': 'MapPin',

  // Shopping Tools
  'discount-calculator': 'BadgePercent',
  'final-price-calculator': 'Tag',
  'sales-tax-calculator': 'Tag',
  'unit-price-calculator': 'Scale',
  'unit-price-comparator': 'Scale',
  'price-per-kg-calculator': 'Weight',
  'price-per-litre-calculator': 'Droplets',
  'bulk-purchase-calculator': 'Package',
  'bogo-calculator': 'Gift',
  'coupon-comparison-calculator': 'GitCompare',
  'subscription-cost-calculator': 'RefreshCw',
  'shopping-budget-calculator': 'ShoppingCart',
  'product-cost-comparison-calculator': 'GitCompareArrows',

  // Salary & Work Tools
  'gross-salary-calculator': 'Banknote',
  'salary-calculator': 'Wallet',
  'take-home-salary-calculator': 'Wallet',
  'salary-hike-calculator': 'TrendingUp',
  'hourly-to-annual-calculator': 'Clock3',
  'hourly-salary-calculator': 'Clock3',
  'monthly-annual-salary-calculator': 'CalendarRange',
  'overtime-calculator': 'ClockPlus',
  'bonus-calculator': 'BadgeDollarSign',
  'working-hours-calculator': 'Timer',
  'leave-calculator': 'CalendarOff',
  'notice-period-calculator': 'CalendarClock',
  'freelance-rate-calculator': 'BriefcaseBusiness',

  // Travel Tools
  'travel-budget-calculator': 'Wallet',
  'per-day-budget-calculator': 'CalendarDays',
  'flight-distance-calculator': 'Route',
  'travel-distance-calculator': 'Route',
  'travel-time-calculator': 'Clock',
  'hotel-cost-calculator': 'Hotel',
  'group-trip-split-calculator': 'Users',
  'time-zone-converter': 'Globe2',
  'travel-cost-comparison-calculator': 'GitCompare',

  // Education Tools
  'gpa-calculator': 'GraduationCap',
  'cgpa-calculator': 'Award',
  'grade-calculator': 'BadgeCheck',
  'marks-required-calculator': 'Target',
  'attendance-calculator': 'CalendarCheck',
  'exam-countdown-calculator': 'Timer',
  'study-time-calculator': 'BookOpen',
  'student-budget-calculator': 'Wallet',

  // Home & Food Tools
  'electricity-bill-calculator': 'Zap',
  'water-bill-calculator': 'Droplets',
  'recipe-scaler': 'ChefHat',
  'serving-size-calculator': 'Users',
  'food-cost-calculator': 'CircleDollarSign',
  'grocery-quantity-calculator': 'ShoppingBasket',
  'cooking-converter': 'Scale',
  'bill-split-calculator': 'Receipt',

  // Health Tools
  'bmi-calculator': 'Gauge',
  'calorie-counter': 'Scale',
  'water-intake-calculator': 'Droplets',

  // Date & Time Tools
  'age-calculator': 'Cake',
  'date-difference-calculator': 'CalendarDays',
  'working-days-calculator': 'BriefcaseBusiness',
  'countdown-calculator': 'Timer',
  'birthday-calculator': 'Cake',
  'anniversary-calculator': 'Heart',
  'retirement-date-calculator': 'CalendarClock',
  'time-duration-calculator': 'Clock3',

  // Converter Tools
  'currency-converter': 'Coins',
  'unit-converter': 'Ruler',
  'length-converter': 'Ruler',
  'weight-converter': 'Scale',
  'area-converter': 'Square',
  'volume-converter': 'Container',
  'temperature-converter': 'Thermometer',
  'speed-converter': 'Gauge',
  'data-converter': 'HardDrive',
  'energy-converter': 'Zap',
  'time-converter': 'Clock',

  // Everyday Math Tools
  'percentage-calculator': 'Percent',
  'average-calculator': 'Sigma',
  'ratio-calculator': 'Divide',
  'fraction-calculator': 'Divide',
  'tip-calculator': 'HandCoins',
  'number-to-words-calculator': 'SpellCheck',
  'random-number-generator': 'Shuffle',
  'qr-generator': 'QrCode',
  'password-generator': 'KeyRound',
  'word-counter': 'FileText',
  'character-counter': 'TextCursorInput',
  'file-size-converter': 'FileDigit',

  // Decision Center Tools
  'true-cost-calculator': 'ReceiptText',
  'compare-anything': 'GitCompareArrows',
  'buy-vs-rent-calculator': 'ArrowLeftRight',
  'monthly-price-analyzer': 'Calculator',
  'affordability-simulator': 'Gauge',
  'life-cost-comparison': 'Globe2',
  'decision-checklists': 'ListChecks',
  'bill-understanding': 'FileSearch',
};

export interface AppIconProps extends LucideProps {
  name?: string;
  className?: string;
  strokeWidth?: number;
  size?: number | string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

/**
 * Central AppIcon component that resolves an icon name to a Lucide icon.
 * Ensures consistent strokeWidth (2), aria accessibility, and fallback.
 */
export const AppIcon: React.FC<AppIconProps> = ({
  name = 'Sparkles',
  size = 20,
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
  ...rest
}) => {
  const IconComponent = ICON_REGISTRY[name] || Sparkles;
  const isDecorative = ariaHidden ?? !ariaLabel;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden={isDecorative ? 'true' : undefined}
      aria-label={ariaLabel}
      {...rest}
    />
  );
};

/**
 * Returns the icon name for a given tool slug, with fallback to tool.iconName or category
 */
export function getToolIconName(slug: string, fallbackIconName?: string, categoryId?: string): string {
  if (TOOL_SLUG_ICONS[slug]) {
    return TOOL_SLUG_ICONS[slug];
  }
  if (fallbackIconName && ICON_REGISTRY[fallbackIconName]) {
    return fallbackIconName;
  }
  if (categoryId && CATEGORY_ICONS[categoryId]) {
    return CATEGORY_ICONS[categoryId];
  }
  return 'Calculator';
}

/**
 * Returns the icon name for a given category ID
 */
export function getCategoryIconName(categoryId: string, fallback?: string): string {
  if (CATEGORY_ICONS[categoryId]) {
    return CATEGORY_ICONS[categoryId];
  }
  if (fallback && ICON_REGISTRY[fallback]) {
    return fallback;
  }
  return 'Calculator';
}

/**
 * ToolIcon component to easily render a tool's icon
 */
export const ToolIcon: React.FC<{
  slug: string;
  fallbackIconName?: string;
  categoryId?: string;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}> = ({
  slug,
  fallbackIconName,
  categoryId,
  size = 20,
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  const iconName = getToolIconName(slug, fallbackIconName, categoryId);
  return (
    <AppIcon
      name={iconName}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
};

/**
 * CategoryIcon component to render a category's icon
 */
export const CategoryIcon: React.FC<{
  categoryId: string;
  fallbackIconName?: string;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}> = ({
  categoryId,
  fallbackIconName,
  size = 24,
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  const iconName = getCategoryIconName(categoryId, fallbackIconName);
  return (
    <AppIcon
      name={iconName}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
};

/**
 * SubcategoryIcon component to render a subcategory's icon
 */
export const SubcategoryIcon: React.FC<{
  categoryId?: string;
  subcategoryId: string;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}> = ({
  categoryId,
  subcategoryId,
  size = 16,
  strokeWidth = 2,
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden,
}) => {
  const subcategoryIconMap: Record<string, string> = {
    loans: 'HandCoins',
    mortgages: 'HousePlus',
    savings: 'PiggyBank',
    investing: 'TrendingUp',
    investments: 'TrendingUp',
    'salary-work': 'BriefcaseBusiness',
    'personal-finance': 'WalletCards',
    banking: 'Landmark',
    buying: 'House',
    planning: 'PanelsTopLeft',
    construction: 'Construction',
    fuel: 'Fuel',
    ownership: 'CarFront',
    trip: 'Route',
    commute: 'Gauge',
    discounts: 'BadgePercent',
    units: 'Scale',
    pricing: 'Tag',
    tax: 'ReceiptText',
    payroll: 'Banknote',
    freelance: 'Clock3',
    retirement: 'CalendarRange',
    planning_trip: 'CalendarRange',
    booking: 'Hotel',
    group: 'Users',
    forex: 'Globe2',
    academics: 'BookOpen',
    loans_student: 'GraduationCap',
    timeline: 'CalendarClock',
    cooking: 'CookingPot',
    baking: 'Cake',
    nutrition: 'Heart',
    portions: 'ChefHat',
    fitness: 'HeartPulse',
    calendar: 'CalendarDays',
    clock: 'Clock',
    duration: 'Timer',
    events: 'CalendarCheck',
    math: 'Divide',
    converters: 'ArrowLeftRight',
    text: 'FileText',
    utility: 'Calculator',
    mechanics: 'Atom',
    motion: 'Gauge',
    'energy-work': 'Zap',
    fluids: 'Droplets',
    electricity: 'Zap',
    waves: 'Activity',
  };

  const iconName = subcategoryIconMap[subcategoryId] || (categoryId ? getCategoryIconName(categoryId) : 'Calculator');

  return (
    <AppIcon
      name={iconName}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
    />
  );
};
