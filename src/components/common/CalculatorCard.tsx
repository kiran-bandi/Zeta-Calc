import React, { useState } from 'react';
import { ToolMetadata } from '../../types/calculator';
import { ToolIcon } from './AppIcon';
import { getCategoryTheme } from '../../data/categoryColors';
import { CATEGORIES } from '../../data/categories';
import { ArrowRight, Share2, Star } from 'lucide-react';
import { ShareModal } from './ShareModal';
import { buildShareableToolUrl } from '../../utils/shareUtils';
import { useHistory } from '../../context/HistoryContext';

interface CalculatorCardProps {
  tool: ToolMetadata;
  onClick: () => void;
  showCategoryBadge?: boolean;
  variant?: 'grid' | 'compact' | 'list';
  className?: string;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  tool,
  onClick,
  showCategoryBadge = true,
  variant = 'grid',
  className = '',
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useHistory();
  const theme = getCategoryTheme(tool.category);
  const categoryMeta = CATEGORIES.find((c) => c.id === tool.category);

  const isFav = isFavorite(tool.slug);
  const shareUrl = buildShareableToolUrl(tool.slug, categoryMeta?.slug || tool.category);

  if (variant === 'list') {
    return (
      <>
        <div
          role="button"
          tabIndex={0}
          id={`tool-card-list-${tool.slug}`}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
          className={`w-full text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${theme.cardBorderHover} ${theme.cardHoverBg} hover:shadow-sm transition-all flex items-center justify-between gap-4 group focus-visible:outline-none ${theme.lightRing} focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer ${className}`}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border transition-colors ${theme.iconBg}`}
            >
              <ToolIcon slug={tool.slug} categoryId={tool.category} size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-slate-100 transition-colors truncate">
                  {tool.name}
                </h3>
                {tool.isPopular && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5">
                {tool.shortDescription || tool.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 shrink-0">
            {showCategoryBadge && (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider hidden sm:inline-block flex-shrink-0 ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
              >
                {categoryMeta?.name || tool.category}
              </span>
            )}
            <button
              type="button"
              id={`fav-btn-list-${tool.slug}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.slug);
              }}
              title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-colors flex-shrink-0 shrink-0"
            >
              <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            </button>
            <button
              type="button"
              id={`share-btn-list-${tool.slug}`}
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
              }}
              title="Share this tool"
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0 shrink-0"
            >
              <Share2 className="w-4 h-4 flex-shrink-0" />
            </button>
            <div className="p-1.5 rounded-lg text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all flex-shrink-0 shrink-0">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </div>
          </div>
        </div>
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          title={tool.name}
          description={tool.description}
          url={shareUrl}
        />
      </>
    );
  }

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        id={`tool-card-${tool.slug}`}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        className={`w-full min-w-0 max-w-full text-left p-3 sm:p-4 md:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 ${theme.cardBorderHover} ${theme.cardHoverBg} hover:shadow-md transition-all flex flex-col justify-between group focus-visible:outline-none ${theme.lightRing} focus-visible:ring-2 focus-visible:ring-offset-2 relative overflow-hidden cursor-pointer ${className}`}
      >
        <div className="w-full min-w-0">
          {/* Top bar: Icon + Labels + Favorite Button */}
          <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3 min-w-0">
            <div
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border transition-colors shadow-2xs shrink-0 ${theme.iconBg}`}
            >
              <ToolIcon slug={tool.slug} categoryId={tool.category} size={16} className="sm:hidden" />
              <ToolIcon slug={tool.slug} categoryId={tool.category} size={20} className="hidden sm:block" />
            </div>

            <div className="flex items-center gap-1 flex-wrap justify-end min-w-0 max-w-[70%]">
              <button
                type="button"
                id={`fav-btn-card-${tool.slug}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(tool.slug);
                }}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                className="p-1 rounded-md text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                <Star className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-slate-400 hover:text-amber-400'}`} />
              </button>
              {tool.isPopular && (
                <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                  Popular
                </span>
              )}
              {showCategoryBadge && (
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md border uppercase tracking-wider truncate max-w-full ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                >
                  {categoryMeta?.name || tool.category}
                </span>
              )}
            </div>
          </div>

          {/* Title - Natural multi-line wrapping up to 3 lines without cutting off words */}
          <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-slate-950 dark:group-hover:text-slate-100 transition-colors tracking-tight line-clamp-3 break-words whitespace-normal leading-snug sm:leading-tight">
            {tool.name}
          </h3>

          {/* Short description */}
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-1 sm:mt-1.5 leading-snug sm:leading-relaxed line-clamp-2 break-words">
            {tool.shortDescription || tool.description}
          </p>
        </div>

        {/* Bottom action indicator */}
        <div className="mt-3 pt-2 sm:mt-4 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 min-w-0">
          <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors truncate">Open</span>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 shrink-0">
            <button
              type="button"
              id={`share-btn-${tool.slug}`}
              onClick={(e) => {
                e.stopPropagation();
                setShareOpen(true);
              }}
              title="Share this tool"
              className="p-1 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 shrink-0"
            >
              <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            </button>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-slate-900 dark:group-hover:text-white transition-transform flex-shrink-0 shrink-0" />
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        title={tool.name}
        toolName={tool.name}
        toolSlug={tool.slug}
        categorySlug={categoryMeta?.slug || tool.category}
        description={tool.description}
        url={shareUrl}
      />
    </>
  );
};

