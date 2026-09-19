import React, { useState, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, Grid, List } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ToolIcon, CategoryIcon } from '../common/AppIcon';
import { CalculatorCard } from '../common/CalculatorCard';

interface AllToolsPageProps {
  onNavigateHome: () => void;
  onSelectTool: (slug: string) => void;
  onGoBack?: () => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  onNavigateHome,
  onSelectTool,
  onGoBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLetter, setActiveLetter] = useState<string>('ALL');
  const [viewLayout, setViewLayout] = useState<'grid' | 'list'>('grid');

  // Alphabet list A-Z
  const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  // Filtered tools
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (tool.category !== selectedCategory) {
          return false;
        }
      }

      // Alphabet filter
      if (activeLetter !== 'ALL') {
        if (!tool.name.toUpperCase().startsWith(activeLetter)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesDesc = tool.description.toLowerCase().includes(q);
        const matchesSynonym = (tool.synonyms || []).some((s) => s.toLowerCase().includes(q));
        const matchesPhrase = (tool.phrases || []).some((p) => p.toLowerCase().includes(q));
        return matchesName || matchesDesc || matchesSynonym || matchesPhrase;
      }

      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedCategory, activeLetter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 w-full min-w-0">
      {/* Breadcrumbs */}
      <Breadcrumbs
        onBack={onGoBack}
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: 'All Tools Directory', active: true },
        ]}
      />

      {/* Header */}
      <div className="mt-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          All Calculators &amp; Tools Directory
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl">
          Browse our complete collection of free, verified everyday utilities. Filter by category,
          alphabetical index, or search keyword.
        </p>
      </div>

      {/* Search & Layout Control Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              id="directory-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, concept, or phrase (e.g. 'home loan', 'fuel')..."
              className="w-full pl-10 pr-4 py-2 text-base sm:text-sm border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong>{filteredTools.length}</strong> of {TOOLS_REGISTRY.length} tools
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                id="view-layout-grid-btn"
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewLayout === 'grid' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="view-layout-list-btn"
                onClick={() => setViewLayout('list')}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${viewLayout === 'list' ? 'bg-white dark:bg-slate-700 shadow-xs text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-medium no-scrollbar">
          <button
            type="button"
            id="dir-cat-filter-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`dir-cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <CategoryIcon categoryId={cat.id} size={13} className={selectedCategory === cat.id ? 'text-white' : 'text-slate-500 dark:text-slate-400'} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Alphabet A-Z Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="text-slate-400 dark:text-slate-500 text-[11px] uppercase tracking-wider mr-1 shrink-0">A-Z:</span>
          {alphabet.map((letter) => (
            <button
              key={letter}
              type="button"
              id={`dir-alpha-${letter}`}
              onClick={() => setActiveLetter(letter)}
              className={`min-w-[24px] h-6 flex items-center justify-center rounded px-1.5 transition-colors cursor-pointer ${
                activeLetter === letter
                  ? 'bg-slate-900 dark:bg-blue-600 text-white font-black'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Listing */}
      {filteredTools.length > 0 ? (
        viewLayout === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {filteredTools.map((tool) => (
              <CalculatorCard
                key={tool.id}
                tool={tool}
                variant="grid"
                onClick={() => onSelectTool(tool.slug)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden shadow-xs">
            {filteredTools.map((tool) => (
              <CalculatorCard
                key={tool.id}
                tool={tool}
                variant="list"
                onClick={() => onSelectTool(tool.slug)}
              />
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">No matching tools found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Try adjusting your search query or reset the category/alphabet filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setActiveLetter('ALL');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl transition-colors cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
