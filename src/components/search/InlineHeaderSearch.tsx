import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { ToolIcon, CategoryIcon } from '../common/AppIcon';
import { searchTools } from './UniversalSearchModal';

interface InlineHeaderSearchProps {
  onSelectTool: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
  className?: string;
  placeholder?: string;
}

export const InlineHeaderSearch: React.FC<InlineHeaderSearchProps> = ({
  onSelectTool,
  onSelectCategory,
  className = '',
  placeholder,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w < 500) {
        setScreenSize('mobile');
      } else if (w < 900) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const computedPlaceholder = placeholder || (
    screenSize === 'mobile'
      ? 'Search...'
      : screenSize === 'tablet'
      ? 'Search calculators...'
      : 'Search calculators, tools & everyday solutions...'
  );

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

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Inline Search Input (Slim compact pill on mobile) */}
      <div className="relative flex items-center w-full h-7 sm:h-8.5 bg-white/8 hover:bg-white/12 focus-within:bg-slate-900/90 focus-within:ring-1 focus-within:ring-cyan-400/80 border border-white/12 rounded-full sm:rounded-xl transition-all shadow-2xs">
        <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300 shrink-0 ml-2 sm:ml-2.5 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          id="inline-header-search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={computedPlaceholder}
          className="w-full h-full py-0.5 pl-1.5 sm:pl-2 pr-5 sm:pr-7 text-base sm:text-xs md:text-sm text-white placeholder:text-indigo-200/70 placeholder:font-normal placeholder:truncate bg-transparent border-none outline-none font-medium min-w-0"
          autoComplete="off"
        />

        {query ? (
          <button
            type="button"
            id="inline-search-clear-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              setQuery('');
              inputRef.current?.focus();
            }}
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-0.5 sm:p-1 text-slate-300 hover:text-white rounded-md mr-1 transition-colors cursor-pointer shrink-0"
            title="Clear search"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        ) : (
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] font-semibold text-indigo-200 bg-white/15 border border-white/20 rounded-md shrink-0 mr-1.5 pointer-events-none">
            ⌘K
          </kbd>
        )}
      </div>

      {/* Inline Floating Search Results Dropdown (Responsive & Full Width on Mobile) */}
      {showDropdown && (
        <>
          {/* Backdrop on mobile for easy tap-to-dismiss */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 sm:hidden"
            onMouseDown={() => setIsOpen(false)}
            onTouchStart={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed left-2.5 right-2.5 top-14 sm:absolute sm:inset-x-0 sm:top-full sm:left-0 sm:right-0 sm:w-full mt-1.5 z-50 bg-[#1E293B] rounded-2xl shadow-2xl border border-white/15 overflow-hidden backdrop-blur-xl text-slate-100 max-h-[75vh] sm:max-h-[80vh] overflow-y-auto animate-in fade-in duration-100 divide-y divide-slate-800">
            {/* Categories Section if matching */}
            {matchedCategories.length > 0 && (
              <div className="p-3 bg-slate-900/60">
                <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
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
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 font-semibold border border-indigo-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <CategoryIcon categoryId={cat.id} size={13} className="text-cyan-300" />
                      <span>{cat.name}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Calculator Tools Section */}
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
                        id={`inline-search-item-${match.tool.slug}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectTool(match.tool.slug);
                        }}
                        onClick={() => handleSelectTool(match.tool.slug)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full text-left p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/40 border border-indigo-400/40 text-white'
                            : 'hover:bg-slate-800/80 border border-transparent text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
                            <ToolIcon slug={match.tool.slug} size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white">
                                {match.tool.name}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-800 text-indigo-300 border border-slate-700 shrink-0">
                                {match.categoryName}
                              </span>
                              {match.matchedSnippet && (
                                <span className="text-[10px] font-medium text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded-md border border-cyan-800/50">
                                  {match.matchedSnippet}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                              {match.tool.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-cyan-400 shrink-0 self-center pl-1">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No calculators found for &ldquo;<strong className="text-white">{query}</strong>&rdquo;. Try searching for &lsquo;loan&rsquo;, &lsquo;sip&rsquo;, or &lsquo;discount&rsquo;.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
