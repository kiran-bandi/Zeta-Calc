import React from 'react';
import { CALCULATOR_COLLECTIONS, CalculatorCollection } from '../../data/collections';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CalculatorCard } from '../common/CalculatorCard';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  Layers,
  CreditCard,
  TrendingUp,
  Briefcase,
  PiggyBank,
  Home,
  HardHat,
  Car,
  Plane,
  HeartPulse,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CollectionsPageProps {
  selectedCollectionSlug?: string;
  onNavigateToCollection: (slug: string) => void;
  onNavigateToTool: (slug: string) => void;
  onNavigateHome: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="w-5 h-5 text-blue-600" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-emerald-600" />,
  Briefcase: <Briefcase className="w-5 h-5 text-indigo-600" />,
  PiggyBank: <PiggyBank className="w-5 h-5 text-amber-600" />,
  Home: <Home className="w-5 h-5 text-rose-600" />,
  HardHat: <HardHat className="w-5 h-5 text-amber-700" />,
  Car: <Car className="w-5 h-5 text-purple-600" />,
  Plane: <Plane className="w-5 h-5 text-cyan-600" />,
  HeartPulse: <HeartPulse className="w-5 h-5 text-red-600" />,
};

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  selectedCollectionSlug,
  onNavigateToCollection,
  onNavigateToTool,
  onNavigateHome,
}) => {
  const activeCollection = selectedCollectionSlug
    ? CALCULATOR_COLLECTIONS.find((c) => c.slug === selectedCollectionSlug)
    : null;

  if (activeCollection) {
    const toolsInCollection = TOOLS_REGISTRY.filter((t) =>
      (activeCollection.toolSlugs || []).includes(t.slug)
    );

    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in w-full min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Home', onClick: onNavigateHome },
            {
              label: 'Collections',
              onClick: () => {
                window.location.hash = '/collections';
              },
            },
            { label: activeCollection.name },
          ]}
        />

        {/* Collection Header */}
        <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
              {ICON_MAP[activeCollection.iconName] || <Layers className="w-6 h-6 text-blue-600" />}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Curated Tool Collection
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {activeCollection.name}
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {activeCollection.longDescription}
          </p>
        </div>

        {/* Tools in collection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Calculators in this Collection ({toolsInCollection.length})
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {toolsInCollection.map((tool) => (
              <CalculatorCard
                key={tool.slug}
                tool={tool}
                onClick={() => onNavigateToTool(tool.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // All collections view
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in w-full min-w-0">
      <Breadcrumbs
        items={[{ label: 'Home', onClick: onNavigateHome }, { label: 'Collections' }]}
      />

      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Problem-Solving Suites</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Zeta Calculator Collections
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Structured bundles of interrelated calculators organized by life domain—from debt payoff to wealth growth, construction materials, and everyday household efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {CALCULATOR_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            onClick={() => onNavigateToCollection(col.slug)}
            className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {ICON_MAP[col.iconName] || <Layers className="w-5 h-5 text-slate-700" />}
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {col.name}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {col.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">
                {col.toolSlugs.length} calculators
              </span>
              <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
