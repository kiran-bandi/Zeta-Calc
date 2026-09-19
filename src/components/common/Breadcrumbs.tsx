import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
  colorClass?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onBack?: () => void;
  showBackButton?: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onBack, showBackButton = true }) => {
  const handleBack = () => {
    // 1. If explicit section onBack handler is provided, execute it
    if (onBack) {
      onBack();
      return;
    }
    // 2. Otherwise navigate to the previous section in the breadcrumb trail (e.g. Category/Section)
    if (items.length >= 2) {
      const prevItem = items[items.length - 2];
      if (prevItem?.onClick) {
        prevItem.onClick();
        return;
      }
    }
    // 3. If at the first sub-level, navigate back to Home (items[0])
    if (items.length >= 1 && items[0]?.onClick) {
      items[0].onClick();
      return;
    }
    // 4. Fallback: browser history
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs py-2 px-0.5 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      {showBackButton && items.length > 1 && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            id="breadcrumb-back-btn"
            onClick={handleBack}
            className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 hover:text-indigo-900 dark:hover:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800 shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer active:scale-95"
            title="Go back to previous page"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </button>
          <div className="h-4 w-px bg-slate-200/90 dark:bg-slate-800 shrink-0" aria-hidden="true" />
        </div>
      )}

      {/* Home link */}
      {items.length > 0 && (
        <button
          type="button"
          id="breadcrumb-home"
          onClick={items[0]?.onClick}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
            items[0]?.active
              ? 'text-sky-900 dark:text-sky-200 bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 shadow-2xs font-bold'
              : 'text-sky-700 dark:text-sky-300 bg-sky-50/80 dark:bg-sky-950/40 hover:bg-sky-100/80 dark:hover:bg-sky-900/40 hover:text-sky-900 dark:hover:text-sky-200 border border-sky-200/60 dark:border-sky-800 cursor-pointer'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          <span>Home</span>
        </button>
      )}

      {/* Subsequent items */}
      {items.slice(1).map((item, index) => {
        const isLast = index === items.length - 2;
        const isActive = item.active || isLast;

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-0.5" />
            {item.onClick && !isActive ? (
              <button
                type="button"
                id={`breadcrumb-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={item.onClick}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-950 dark:hover:text-amber-200 border border-amber-200/70 dark:border-amber-800 transition-colors cursor-pointer shrink-0"
              >
                {item.label}
              </button>
            ) : (
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs shrink-0"
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
