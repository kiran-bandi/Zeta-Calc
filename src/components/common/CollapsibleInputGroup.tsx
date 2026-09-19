import React, { useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

interface CollapsibleInputGroupProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  defaultOpen?: boolean;
  badge?: string;
  children: React.ReactNode;
}

export const CollapsibleInputGroup: React.FC<CollapsibleInputGroupProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  defaultOpen = false,
  badge,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div id={id} className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-slate-50/70 transition-colors focus:outline-hidden"
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              {badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-600' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-5 border-t border-slate-100 space-y-4 bg-slate-50/30">
          {children}
        </div>
      )}
    </div>
  );
};
