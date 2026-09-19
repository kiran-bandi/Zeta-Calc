import React, { useEffect, useState } from 'react';
import {
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  Zap,
  Compass,
  Scale,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Shield,
  Smartphone,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { useHistory } from '../../context/HistoryContext';
import { CategoryIcon, ToolIcon } from '../common/AppIcon';
import { CalculatorCard } from '../common/CalculatorCard';
import { CategoryCard } from '../common/CategoryCard';
import { getCategoryTheme } from '../../data/categoryColors';
import { updatePageSEO } from '../../utils/seo';
import { InlineHeroSearch } from '../search/InlineHeroSearch';

interface HomePageProps {
  onOpenSearch: () => void;
  onSelectTool: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onNavigateAllTools: () => void;
  onNavigateDecisionCenter?: () => void;
  onNavigateCollections?: () => void;
  onNavigateDiscover?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSearch,
  onSelectTool,
  onSelectCategory,
  onNavigateAllTools,
  onNavigateDecisionCenter,
  onNavigateCollections,
  onNavigateDiscover,
}) => {
  const { recentTools, favorites } = useHistory();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    updatePageSEO({
      title: 'Zeta Calculator – Free Calculators & Everyday Tools',
      description:
        'Free calculators, converters, and planning tools for everyday money, home, travel, work, shopping, health and life decisions.',
      canonicalUrl: typeof window !== 'undefined' ? window.location.origin + '/' : undefined,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Zeta Calculator',
        url: typeof window !== 'undefined' ? window.location.origin : 'https://zetacalculator.net',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${typeof window !== 'undefined' ? window.location.origin : 'https://zetacalculator.net'}/#search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    });
  }, []);

  // Favorite tool objects
  const favoriteToolObjects = favorites
    .map((slug) => TOOLS_REGISTRY.find((t) => t.slug === slug))
    .filter(Boolean);

  // Popular tools defined in specification
  const popularToolSlugs = [
    'mortgage-calculator',
    'emi-calculator',
    'sip-calculator',
    'home-loan-calculator',
    'auto-loan-calculator',
    'compound-interest-calculator',
    'salary-calculator',
    'bmi-calculator',
    'concrete-calculator',
    'date-difference-calculator',
  ];

  const popularTools = popularToolSlugs
    .map((slug) => TOOLS_REGISTRY.find((t) => t.slug === slug))
    .filter(Boolean);

  // Recently used tool objects
  const recentlyUsedToolObjects = recentTools
    .map((r) => TOOLS_REGISTRY.find((t) => t.slug === r.slug))
    .filter(Boolean)
    .slice(0, 4);

  const faqs = [
    {
      q: 'Is Zeta Calculator completely free to use?',
      a: 'Yes, 100% free. There are no subscriptions, paywalls, premium tiers, or forced account registrations. Every single tool, formula explanation, and comparison engine is openly accessible to everyone.',
    },
    {
      q: 'Are my financial numbers and personal data private?',
      a: 'Absolutely. Zeta Calculator executes all mathematical computations directly in your web browser using client-side JavaScript. Your income, loan balances, birthdates, and travel expenses are never sent to remote servers or stored in third-party databases.',
    },
    {
      q: 'How do measurement units and currency work on Zeta Calculator?',
      a: 'Zeta Calculator provides per-field unit dropdowns on every calculator, allowing you to select specific measurement units (such as cm, m, ft, in for distance/height; kg, lb for weight; years, months, days for tenure/duration) directly next to each input field. You can also select your preferred global currency symbol in settings.',
    },
    {
      q: 'How do Zeta Calculator formulas differ from online estimates?',
      a: 'Every calculator on Zeta Calculator uses deterministic mathematical formulas verified against standard banking, civil engineering, and scientific metrology baselines. We provide the complete formula and step-by-step breakdown on each tool page so you can verify the arithmetic yourself.',
    },
    {
      q: 'What is the Decision Center and how does it help?',
      a: 'The Decision Center moves beyond single-number outputs to help you model trade-offs. It enables side-by-side scenario comparisons (such as a 15-year vs. 30-year mortgage, or renting vs. buying) and dynamic sensitivity sliders so you understand how changing variables affects your bottom line before making a commitment.',
    },
  ];

  return (
    <div className="space-y-7 sm:space-y-9 lg:space-y-11 pb-10 sm:pb-12">
      {/* 1. TOP HERO & DIRECT CATEGORY DIRECTORY */}
      <section className="relative z-40 pt-4 pb-6 sm:pt-6 sm:pb-8 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          {/* Header Title & Subtitle */}
          <div className="max-w-3xl mx-auto text-center mb-5 sm:mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>Calculate. Compare. Understand. Decide.</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Free Calculators &amp; Everyday Tools
            </h1>

            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              Explore deterministic calculators and planning tools across every domain. Select a category below to get started.
            </p>
          </div>

          {/* Direct Category Directory Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => onSelectCategory(cat.id)}
              />
            ))}

            {/* Interactive Decision Center Card */}
            <div
              role="button"
              tabIndex={0}
              id="cat-card-decision-center"
              onClick={onNavigateDecisionCenter}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigateDecisionCenter?.();
                }
              }}
              className="group relative text-left bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-700/80 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer"
            >
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full mb-2 gap-1.5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 whitespace-nowrap">
                    Interactive
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-200 transition-colors tracking-tight line-clamp-2">
                  Decision Center
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PINNED / FAVORITE TOOLS (if present) */}
      {favoriteToolObjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0" id="favorites-section">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" aria-hidden="true" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                My Pinned &amp; Favorite Tools ({favoriteToolObjects.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5">
            {favoriteToolObjects.map((tool) => tool && (
              <CalculatorCard
                key={`fav-${tool.id}`}
                tool={tool}
                variant="grid"
                onClick={() => onSelectTool(tool.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. RECENTLY USED SECTION (if present) */}
      {recentlyUsedToolObjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Recently Used (Saved locally)
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {recentlyUsedToolObjects.map((tool) => tool && (
              <CalculatorCard
                key={tool.id}
                tool={tool}
                variant="compact"
                onClick={() => onSelectTool(tool.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 3. POPULAR CALCULATORS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5">
              <Zap className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Most Frequently Used</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Popular Calculators
            </h2>
          </div>
          <button
            type="button"
            id="view-all-tools-link-btn"
            onClick={onNavigateAllTools}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 group cursor-pointer"
          >
            <span>Explore All Tools Directory (A-Z)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3.5">
          {popularTools.map((tool) => tool && (
            <CalculatorCard
              key={tool.id}
              tool={tool}
              variant="grid"
              onClick={() => onSelectTool(tool.slug)}
            />
          ))}
        </div>
      </section>

      {/* 5. FEATURED DECISION ENGINES */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>Calculate. Compare. Understand. Decide.</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">
              Featured Decision Engines
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Real-world decisions are rarely single numbers. Compare scenarios side-by-side to understand trade-offs, interest burdens, and return trajectories before committing capital.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 pt-4 sm:mt-5 sm:pt-5 border-t border-slate-800">
            {/* Decision 1: Rent vs Mortgage */}
            <button
              type="button"
              onClick={() => onSelectTool('mortgage-calculator')}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  Property &amp; Housing
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-2">
                  Mortgage vs. Renting
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Evaluate monthly P&amp;I, property taxes, home insurance, and 30-year total amortization costs.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Evaluate Mortgage</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Decision 2: SIP vs Lumpsum */}
            <button
              type="button"
              onClick={() => onSelectTool('sip-calculator')}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
                  Investments &amp; Wealth
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors mt-2">
                  Systematic vs. Lumpsum
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Compare dollar-cost averaging through monthly SIP versus one-time compounding lump sums.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400">
                <span>Model Growth</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Decision 3: Loan Tenure & Prepayment */}
            <button
              type="button"
              onClick={() => onSelectTool('home-loan-calculator')}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  Debt Optimization
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-2">
                  Tenure &amp; Prepayment
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Understand how shortening tenure or prepaying principal saves thousands in cumulative interest.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400">
                <span>Compare Loans</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Decision 4: Energy Deficit vs Maintenance */}
            <button
              type="button"
              onClick={() => onSelectTool('calorie-counter')}
              className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 transition-all text-left flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
                  Health &amp; Metabolism
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-300 transition-colors mt-2">
                  Deficit vs. Maintenance
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calculate baseline BMR and Mifflin-St Jeor TDEE to set safe, achievable dietary weight targets.
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-rose-400">
                <span>Plan Target</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL ESSAY: MAKE BETTER EVERYDAY DECISIONS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 shadow-xs space-y-5">
          <header className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Comprehensive Guide &amp; Architecture
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Make Better Everyday Decisions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              How Zeta Calculator brings mathematical clarity, transparent formulas, and side-by-side scenario modeling to everyday life.
            </p>
          </header>

          <div className="space-y-4 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                What is Zeta Calculator?
              </h3>
              <p>
                Zeta Calculator is an open, private web suite engineered to solve common quantitative challenges
                without paywalls, ad trackers, or algorithmic friction. In our modern lives, we make hundreds
                of decisions governed by numbers: borrowing money to purchase a vehicle, calculating the monthly
                amortization on a 30-year mortgage, forecasting compound interest on a recurring SIP, estimating
                paint coverage for a home renovation, or splitting road trip fuel expenses among friends.
              </p>
              <p>
                Too often, online calculators are buried inside lead-generation funnels that demand phone numbers,
                hide mathematical formulas, or produce biased estimates tailored to sell banking products.
                Zeta Calculator delivers transparent, deterministic arithmetic running entirely inside your client browser.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Why Transparent Mathematical Formulas Matter
              </h3>
              <p>
                Every calculator in our catalog displays its exact mathematical expression and step-by-step
                walkthrough. When calculating home loan EMI using the standard reducing balance formula
                <code>EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]</code>, you can inspect the exact rate conversions
                and periodic schedules. This transparency ensures that you understand the mechanics behind your numbers,
                fostering true financial literacy and confidence.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                How Scenario Comparison Prevents Expensive Mistakes
              </h3>
              <p>
                Rather than treating mathematical calculations in isolation, Zeta Calculator builds scenario comparison
                into every major calculator. Users can compare Scenario A with Scenario B—such as a 12% vs. 14%
                investment return, or a 20-year vs. 25-year debt payoff—to understand the real-world trade-offs
                before signing a contract or committing hard-earned savings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                How the Decision Center Powers Everyday Choices
              </h3>
              <p>
                For high-stakes crossroads, the Zeta Calculator Decision Center synthesizes multiple calculations into
                unified decision frameworks. Instead of visiting five different websites, you can evaluate:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Renting vs. Buying a Home:</strong> Factoring mortgage interest, property taxes, maintenance,
                  home appreciation, and opportunity cost of invested down payments.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">Debt Snowball vs. Debt Avalanche:</strong> Modeling whether paying off high-interest balances
                  first saves more money than eliminating smaller balances for psychological momentum.
                </li>
                <li>
                  <strong className="text-slate-800 dark:text-slate-200">True Ownership Costs:</strong> Uncovering the hidden operational costs (insurance, fuel, depreciation,
                  maintenance) of owning a car or home beyond just the sticker price.
                </li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                With verified equations, global unit conversions, and zero tracking, Zeta Calculator empowers you to make
                confident, mathematically grounded choices every single day.
              </p>
            </div>
          </div>
        </article>
      </section>

      {/* 7. WHY USE ZETA CALCULATOR? */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-0.5">
            Built for Transparency
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Why Use Zeta Calculator?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Engineered with modern web standards, strict privacy, and mathematical rigor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Deterministic Arithmetic</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              No generative hallucinations or approximate guesses. Every calculation runs verified algebraic code with full formula transparency.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Client-Side Privacy</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Your numbers never leave your browser. Calculations run 100% locally with zero server logging, telemetry tracking, or user accounts.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">True Localization</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Supports global metrology standards (US Customary, UK, Metric) and regional number grouping systems (Lakh/Crore vs. Million/Billion).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2 shadow-xs">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Responsive &amp; Touch-Ready</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed with 44px+ minimum touch targets, accessible contrast ratios, and fluid layouts optimized for phones, tablets, and desktops.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-6">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-0.5">
            Got Questions?
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            Clear answers about our calculation accuracy, data privacy, and global unit support.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.q}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full px-4 sm:px-5 py-3 sm:py-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-xs sm:text-sm md:text-base text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-3.5 sm:pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
