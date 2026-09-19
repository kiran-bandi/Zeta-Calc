import React, { useEffect } from 'react';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { InterestBetweenDatesCalculator } from './InterestBetweenDatesCalculator';
import { ToolMetadata } from '../../types/calculator';
import { CATEGORIES } from '../../data/categories';
import { useHistory } from '../../context/HistoryContext';
import { ToolIcon } from '../common/AppIcon';
import { Star } from 'lucide-react';

interface InterestBetweenDatesCalculatorViewProps {
  tool: ToolMetadata;
  onNavigateHome: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onSelectTool: (slug: string) => void;
  onGoBack?: () => void;
}

export const InterestBetweenDatesCalculatorView: React.FC<InterestBetweenDatesCalculatorViewProps> = ({
  tool,
  onNavigateHome,
  onNavigateCategory,
  onSelectTool,
  onGoBack,
}) => {
  const { recordToolUsage, isFavorite, toggleFavorite } = useHistory();
  const category = CATEGORIES.find((c) => c.id === tool.category);
  const favorited = isFavorite(tool.slug);

  useEffect(() => {
    recordToolUsage(tool.slug);
  }, [tool.slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Breadcrumbs */}
      <Breadcrumbs
        onBack={onGoBack}
        items={[
          { label: 'Home', onClick: onNavigateHome },
          {
            label: category ? category.name : 'Finance',
            onClick: () => onNavigateCategory(tool.category),
          },
          { label: tool.name, active: true },
        ]}
      />

      {/* Tool Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shrink-0">
              <ToolIcon slug={tool.slug} size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {category?.name || 'Finance'}
                </span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs font-medium text-slate-500">
                  Dual-Rate Input Engine
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {tool.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-favorite-interest-dates-tool"
              onClick={() => toggleFavorite(tool.slug)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                favorited
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${favorited ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`}
              />
              <span>{favorited ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          {tool.description}
        </p>
      </div>

      {/* Core Calculator Component */}
      <InterestBetweenDatesCalculator onSelectTool={onSelectTool} />
    </div>
  );
};
