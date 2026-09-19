import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { CategoryIcon, SubcategoryIcon } from '../common/AppIcon';
import { CalculatorCard } from '../common/CalculatorCard';
import { CategoryCard } from '../common/CategoryCard';
import { getCategoryTheme } from '../../data/categoryColors';

interface CategoryViewPageProps {
  categoryId: string;
  onNavigateHome: () => void;
  onSelectTool: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onGoBack?: () => void;
}

export const CategoryViewPage: React.FC<CategoryViewPageProps> = ({
  categoryId,
  onNavigateHome,
  onSelectTool,
  onSelectCategory,
  onGoBack,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);

  // Reset selected subcategory when navigating to a different category
  React.useEffect(() => {
    setSelectedSubcategory(null);
  }, [categoryId]);

  const category = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];
  const theme = getCategoryTheme(category.id);

  // Retrieve tools belonging directly to this canonical category
  const allCategoryTools = React.useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => t.category === category.id);
  }, [category.id]);

  const displayedTools = React.useMemo(() => {
    if (!selectedSubcategory) return allCategoryTools;
    return allCategoryTools.filter((t) => t.subcategory === selectedSubcategory);
  }, [allCategoryTools, selectedSubcategory]);

  const otherCategories = CATEGORIES.filter((c) => c.id !== category.id).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 w-full min-w-0">
      <Breadcrumbs
        onBack={selectedSubcategory ? () => setSelectedSubcategory(null) : onGoBack}
        items={[
          { label: 'Home', onClick: onNavigateHome },
          {
            label: category.name,
            onClick: selectedSubcategory ? () => setSelectedSubcategory(null) : undefined,
            active: !selectedSubcategory,
          },
          ...(selectedSubcategory
            ? [
                {
                  label:
                    category.subcategories.find((s) => s.id === selectedSubcategory)?.name ||
                    selectedSubcategory,
                  active: true,
                },
              ]
            : []),
        ]}
      />

      <div className="mt-4 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-2xs shrink-0 ${theme.iconBg}`}>
            <CategoryIcon categoryId={category.id} size={26} />
          </div>
          <div className="min-w-0">
            <span className={`text-xs font-bold uppercase tracking-wider block ${theme.accentText}`}>
              Category Overview
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {category.name} Calculators &amp; Tools
            </h1>
          </div>
        </div>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {category.description}
        </p>

        {/* Subcategories interactive filter buttons */}
        {category.subcategories.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Filter Topic:</span>
            <button
              type="button"
              id="subfilter-all"
              onClick={() => setSelectedSubcategory(null)}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                selectedSubcategory === null
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All ({allCategoryTools.length})
            </button>
            {category.subcategories.map((sub) => {
              const count = allCategoryTools.filter(
                (t) =>
                  t.subcategory === sub.id ||
                  t.category === sub.id ||
                  (sub.id === 'loans' && t.category === 'loans') ||
                  (sub.id === 'savings' && t.category === 'savings') ||
                  (sub.id === 'investments' && t.category === 'investing') ||
                  (sub.id === 'personal-finance' && t.category === 'salary-work')
              ).length;
              return (
                <button
                  key={sub.id}
                  type="button"
                  id={`subfilter-${sub.id}`}
                  onClick={() => setSelectedSubcategory(selectedSubcategory === sub.id ? null : sub.id)}
                  className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    selectedSubcategory === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <SubcategoryIcon categoryId={category.id} subcategoryId={sub.id} size={13} className={selectedSubcategory === sub.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
                  <span>{sub.name} {count > 0 ? `(${count})` : ''}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tools in this category */}
      <section className="mb-12">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Available Calculators ({displayedTools.length})
        </h2>

        {displayedTools.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {displayedTools.map((tool) => (
              <CalculatorCard
                key={tool.id}
                tool={tool}
                onClick={() => onSelectTool(tool.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-base text-slate-700 dark:text-slate-300">Calculators coming soon in this subcategory.</p>
            <p className="text-xs mt-1">Check back as we expand our library of verified everyday utilities.</p>
          </div>
        )}
      </section>

      {/* Explore Other Categories */}
      <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight mb-4">
          Explore Other Everyday Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
          {otherCategories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onClick={() => onSelectCategory(c.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
