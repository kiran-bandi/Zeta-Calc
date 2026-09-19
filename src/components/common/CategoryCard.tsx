import React from 'react';
import { Category } from '../../types/calculator';
import { CategoryIcon } from './AppIcon';
import { getCategoryTheme } from '../../data/categoryColors';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onClick,
  className = '',
}) => {
  const catTools = TOOLS_REGISTRY.filter(
    (t) => t.category === category.id || (t.additionalCategories && t.additionalCategories.includes(category.id))
  );
  const toolCount = catTools.length;
  const theme = getCategoryTheme(category.id);

  return (
    <div
      role="button"
      tabIndex={0}
      id={`cat-card-${category.id}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`group relative text-left bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 ${theme.borderHover} hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer ${className}`}
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full mb-2 gap-1.5">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border shadow-2xs transition-transform group-hover:scale-105 shrink-0 ${theme.iconBg}`}>
            <CategoryIcon categoryId={category.id} size={16} className="sm:hidden" />
            <CategoryIcon categoryId={category.id} size={20} className="hidden sm:block" />
          </div>
          <span className={`text-[9px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border whitespace-nowrap ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}>
            {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
          </span>
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2">
          {category.name}
        </h3>
      </div>
    </div>
  );
};
