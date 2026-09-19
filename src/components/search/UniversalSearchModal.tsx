import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { CATEGORIES } from '../../data/categories';
import { ToolMetadata } from '../../types/calculator';
import { ToolIcon, CategoryIcon } from '../common/AppIcon';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
  onSelectCategory: (categoryId: string) => void;
}

export interface SearchMatch {
  tool: ToolMetadata;
  categoryName: string;
  matchedOn: 'name' | 'synonym' | 'phrase' | 'category' | 'description';
  matchedSnippet?: string;
  score: number;
}

export function searchTools(query: string): SearchMatch[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const results: SearchMatch[] = [];

  for (const tool of TOOLS_REGISTRY) {
    const category = CATEGORIES.find((c) => c.id === tool.category);
    const categoryName = category ? category.name : tool.category;
    let score = 0;
    let matchedOn: SearchMatch['matchedOn'] = 'description';
    let matchedSnippet: string | undefined;

    const lowerName = tool.name.toLowerCase();
    const lowerCategory = categoryName.toLowerCase();
    const lowerDesc = tool.description.toLowerCase();

    // 1. Exact or prefix or substring match on name
    if (lowerName === clean) {
      score += 100;
      matchedOn = 'name';
    } else if (lowerName.startsWith(clean)) {
      score += 85;
      matchedOn = 'name';
    } else if (lowerName.includes(clean)) {
      score += 70;
      matchedOn = 'name';
    } else if (clean.includes(lowerName)) {
      score += 65;
      matchedOn = 'name';
    }

    // 2. Tokenized word overlap (e.g. "loan emi calculator" matches "emi calculator" and "loan" keyword)
    const queryWords = clean.split(/\s+/).filter((w) => w.length > 2);
    if (queryWords.length > 1) {
      const nameWords = lowerName.split(/\s+/);
      const matchedWordCount = queryWords.filter((w) => nameWords.some((nw) => nw.includes(w) || w.includes(nw))).length;
      if (matchedWordCount === queryWords.length) {
        score = Math.max(score, 90);
        matchedOn = 'name';
      } else if (matchedWordCount >= 2) {
        score = Math.max(score, 60 + matchedWordCount * 10);
      }
    }

    // 3. Search phrases / user intentions (e.g. "house payment", "petrol cost", "convert kg to pounds")
    for (const phrase of tool.phrases || []) {
      const lowerPhrase = phrase.toLowerCase();
      if (lowerPhrase === clean) {
        score = Math.max(score, 90);
        matchedOn = 'phrase';
        matchedSnippet = `Matches phrase: "${phrase}"`;
      } else if (lowerPhrase.includes(clean) || clean.includes(lowerPhrase)) {
        score = Math.max(score, 75);
        matchedOn = 'phrase';
        matchedSnippet = `Related to: "${phrase}"`;
      }
    }

    // 4. Search synonyms
    for (const syn of tool.synonyms || []) {
      const lowerSyn = syn.toLowerCase();
      if (lowerSyn === clean) {
        score = Math.max(score, 85);
        matchedOn = 'synonym';
        matchedSnippet = `Synonym: ${syn}`;
      } else if (lowerSyn.includes(clean) || clean.includes(lowerSyn)) {
        score = Math.max(score, 65);
        matchedOn = 'synonym';
        matchedSnippet = `Synonym: ${syn}`;
      }
    }

    // 5. Search SEO Keywords
    for (const kw of tool.seo?.keywords || []) {
      const lowerKw = kw.toLowerCase();
      if (lowerKw === clean) {
        score = Math.max(score, 85);
        matchedOn = 'phrase';
        matchedSnippet = `Keyword: ${kw}`;
      } else if (lowerKw.includes(clean) || clean.includes(lowerKw)) {
        score = Math.max(score, 65);
        matchedOn = 'phrase';
        matchedSnippet = `Keyword: ${kw}`;
      }
    }

    // 6. Category match
    if (lowerCategory.includes(clean)) {
      score = Math.max(score, 45);
      if (matchedOn === 'description') {
        matchedOn = 'category';
        matchedSnippet = `In Category: ${categoryName}`;
      }
    }

    // 7. Description match
    if (lowerDesc.includes(clean) && score < 40) {
      score = Math.max(score, 30);
      matchedOn = 'description';
    }

    if (score > 0) {
      results.push({
        tool,
        categoryName,
        matchedOn,
        matchedSnippet,
        score,
      });
    }
  }

  // Sort by highest score first
  return results.sort((a, b) => b.score - a.score);
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchTools(query);

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
    if (isOpen) {
      inputRef.current?.focus();
      const raf = requestAnimationFrame(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      });
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      setSelectedIndex(0);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(timer);
      };
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectTool(results[selectedIndex].tool.slug);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectTool, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Universal Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-20 px-3 sm:px-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            autoFocus
            type="text"
            id="universal-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators, tools, and everyday solutions (e.g. 'house payment', 'petrol cost')..."
            className="w-full py-4 text-base text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden font-medium bg-transparent"
          />
          {query && (
            <button
              type="button"
              id="clear-search-query-btn"
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Results / Suggestions */}
        <div className="overflow-y-auto p-3 space-y-1 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {query ? (
            results.length > 0 || matchedCategories.length > 0 ? (
              <div className="space-y-1">
                {matchedCategories.length > 0 && (
                  <div className="mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Matching Categories ({matchedCategories.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-2">
                      {matchedCategories.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          id={`search-match-cat-${cat.id}`}
                          onClick={() => {
                            onSelectCategory(cat.id);
                            onClose();
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 font-semibold transition-colors flex items-center gap-1.5 border border-blue-200/60 dark:border-blue-800"
                        >
                          <CategoryIcon categoryId={cat.id} size={14} className="text-blue-600 dark:text-blue-400" />
                          <span>{cat.name}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Calculators & Tools ({results.length})
                  </div>
                )}
                {results.map((match, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={match.tool.id}
                      type="button"
                      id={`search-result-${match.tool.slug}`}
                      onClick={() => {
                        onSelectTool(match.tool.slug);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left p-3 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800 text-slate-900 dark:text-white'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                          <ToolIcon slug={match.tool.slug} size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 dark:text-white text-sm">
                              {match.tool.name}
                            </span>
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {match.categoryName}
                            </span>
                            {match.matchedSnippet && (
                              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                                {match.matchedSnippet}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {match.tool.shortDescription}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 self-center ml-2">
                        <span className="hidden sm:inline">Open</span>
                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <p className="font-medium text-base text-slate-700 dark:text-slate-300">No matching tools found for "{query}"</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                  Try searching for terms like "EMI", "SIP", "Loan", "Fuel", "Discount", or "Percentage".
                </p>
              </div>
            )
          ) : (
            <div className="space-y-4 p-2">
              {/* Common Intent Prompts */}
              <div>
                <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Popular Everyday Queries</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                  {[
                    { label: 'Calculate monthly loan payment', slug: 'emi-calculator' },
                    { label: 'Estimate mutual fund SIP growth', slug: 'sip-calculator' },
                    { label: 'How much should I save monthly?', slug: 'savings-goal-calculator' },
                    { label: 'Find road trip fuel & petrol cost', slug: 'fuel-cost-calculator' },
                    { label: 'Store sale discount & final price', slug: 'discount-calculator' },
                    { label: 'Home loan & mortgage repayment', slug: 'home-loan-calculator' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      id={`search-popular-${item.slug}`}
                      onClick={() => {
                        onSelectTool(item.slug);
                        onClose();
                      }}
                      className="text-left text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-700 dark:hover:text-blue-300 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-slate-100 dark:border-slate-800 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ToolIcon slug={item.slug} size={14} className="text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Quick Links */}
              <div>
                <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Browse by Category
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {CATEGORIES.slice(0, 10).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      id={`search-cat-${cat.id}`}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      <CategoryIcon categoryId={cat.id} size={13} className="text-slate-400" />
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" />
              <span>to select</span>
            </span>
          </div>
          <span>Free &amp; Deterministic Calculators</span>
        </div>
      </div>
    </div>
  );
};
