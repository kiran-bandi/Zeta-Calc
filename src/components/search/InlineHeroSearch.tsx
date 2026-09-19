import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { ToolIcon, CategoryIcon } from '../common/AppIcon';
import { searchTools } from './UniversalSearchModal';

interface InlineHeroSearchProps {
  onSelectTool: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
  placeholder?: string;
}

export const InlineHeroSearch: React.FC<InlineHeroSearchProps> = ({
  onSelectTool,
  onSelectCategory,
  className = '',
  placeholder = 'Search calculators, tools and everyday solutions...',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = React.useMemo(() => searchTools(query), [query]);

  const matchedCategories = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return CATEGORIES.filter(
      (cat) =>
        cat.name.toLowerCase().includes(q) ||
        cat.description.toLowerCase().includes(q) ||
        cat.subcategories.some((sub) => sub.name.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (results.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % results.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      }
    } else if (e.key === 'Enter') {
      if (isOpen && results[selectedIndex]) {
        e.preventDefault();
        onSelectTool(results[selectedIndex].tool.slug);
        setIsOpen(false);
        setQuery('');
      }
    }
  };

  const handleSelectTool = (slug: string) => {
    onSelectTool(slug);
    setIsOpen(false);
    setQuery('');
  };

  const handleSelectCategory = (catId: string) => {
    onSelectCategory(catId);
    setIsOpen(false);
    setQuery('');
  };

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className={`relative z-50 w-full ${className}`}>
      {/* Light Hero Inline Search Input */}
      <div className="w-full flex items-center justify-between p-2.5 sm:p-3 px-3.5 sm:px-4 bg-white border-2 border-slate-300 hover:border-blue-600 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2 w-full">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="hero-inline-search-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none text-base sm:text-sm md:text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            autoComplete="off"
          />
        </div>

        {query ? (
          <button
            type="button"
            id="hero-inline-search-clear-btn"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 rounded-md shrink-0 pointer-events-none">
            Press ⌘K
          </span>
        )}
      </div>

      {/* Floating Inline Dropdown for Hero Search */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-2 z-[100] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 max-h-[70vh] overflow-y-auto animate-in fade-in duration-100 divide-y divide-slate-100">
          
          {/* Categories Section */}
          {matchedCategories.length > 0 && (
            <div className="p-3 bg-slate-50">
              <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Matching Categories ({matchedCategories.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedCategories.slice(0, 4).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectCategory(cat.id);
                    }}
                    onClick={() => handleSelectCategory(cat.id)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CategoryIcon categoryId={cat.id} size={14} className="text-blue-600" />
                    <span>{cat.name}</span>
                    <ArrowRight className="w-3 h-3 text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tools Section */}
          <div className="p-2 space-y-1">
            {results.length > 0 ? (
              <>
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Calculators & Tools ({results.length})
                </div>
                {results.slice(0, 8).map((match, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={match.tool.id}
                      type="button"
                      id={`hero-search-item-${match.tool.slug}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelectTool(match.tool.slug);
                      }}
                      onClick={() => handleSelectTool(match.tool.slug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/90 border border-blue-200 text-slate-900'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/60">
                          <ToolIcon slug={match.tool.slug} size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {match.tool.name}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {match.categoryName}
                            </span>
                            {match.matchedSnippet && (
                              <span className="text-[10px] font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-200/60">
                                {match.matchedSnippet}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            {match.tool.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-blue-600 shrink-0 self-center">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </>
            ) : (
              <div className="p-4 text-center text-slate-500 text-xs">
                No calculators found for &ldquo;<strong className="text-slate-800">{query}</strong>&rdquo;. Try searching for &lsquo;loan&rsquo;, &lsquo;sip&rsquo;, or &lsquo;discount&rsquo;.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
