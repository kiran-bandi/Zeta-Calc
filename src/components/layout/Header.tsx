import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  Compass,
  Grid,
  House,
  Sparkles,
  ArrowLeft,
  Globe,
  Star,
} from 'lucide-react';
import { ZetaLogo } from '../common/ZetaLogo';
import { ThemeToggle } from '../common/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useHistory } from '../../context/HistoryContext';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/AppIcon';
import { LocalizationSettingsModal } from './LocalizationSettingsModal';
import { InlineHeaderSearch } from '../search/InlineHeaderSearch';

interface HeaderProps {
  currentView: string;
  onNavigateHome: () => void;
  onNavigateBack?: () => void;
  onNavigateCategory: (categoryId: string) => void;
  onNavigateAllTools: () => void;
  onNavigateDecisionCenter: () => void;
  onNavigateCollections?: () => void;
  onNavigateDiscover?: () => void;
  onOpenSearch: () => void;
  onSelectTool: (slug: string) => void;
}

const CATEGORY_ACCENT_COLORS: Record<string, { icon: string; hoverBg: string }> = {
  finance: { icon: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/15' },
  money: { icon: 'text-emerald-400', hoverBg: 'hover:bg-emerald-500/15' },
  property: { icon: 'text-amber-400', hoverBg: 'hover:bg-amber-500/15' },
  vehicles: { icon: 'text-blue-400', hoverBg: 'hover:bg-blue-500/15' },
  shopping: { icon: 'text-purple-400', hoverBg: 'hover:bg-purple-500/15' },
  'salary-work': { icon: 'text-indigo-300', hoverBg: 'hover:bg-indigo-500/15' },
  travel: { icon: 'text-sky-300', hoverBg: 'hover:bg-sky-500/15' },
  education: { icon: 'text-violet-300', hoverBg: 'hover:bg-violet-500/15' },
  home: { icon: 'text-amber-300', hoverBg: 'hover:bg-amber-500/15' },
  food: { icon: 'text-orange-400', hoverBg: 'hover:bg-orange-500/15' },
  health: { icon: 'text-rose-400', hoverBg: 'hover:bg-rose-500/15' },
  math: { icon: 'text-blue-300', hoverBg: 'hover:bg-blue-500/15' },
  'date-time': { icon: 'text-cyan-300', hoverBg: 'hover:bg-cyan-500/15' },
  converters: { icon: 'text-teal-300', hoverBg: 'hover:bg-teal-500/15' },
  tools: { icon: 'text-slate-300', hoverBg: 'hover:bg-slate-500/15' },
  everyday: { icon: 'text-slate-300', hoverBg: 'hover:bg-slate-500/15' },
};

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onNavigateBack,
  onNavigateCategory,
  onNavigateAllTools,
  onNavigateDecisionCenter,
  onNavigateCollections,
  onNavigateDiscover,
  onOpenSearch,
  onSelectTool,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localizationModalOpen, setLocalizationModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { preferences } = useSettings();
  const { favorites } = useHistory();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-[#0F172A]/95 backdrop-blur-md border-b border-indigo-950/80 shadow-md w-full max-w-full min-w-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 w-full min-w-0">
        <div className="flex items-center justify-between h-13 sm:h-15 gap-2 sm:gap-4 min-w-0 w-full">
          
          {/* Left: Brand Logo & Back Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
            {currentView !== 'home' && onNavigateBack && (
              <button
                type="button"
                id="header-back-button"
                onClick={onNavigateBack}
                className="inline-flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-400 outline-hidden cursor-pointer shrink-0"
                title="Go back to previous page"
                aria-label="Go back to previous page"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                <span className="hidden md:inline text-xs sm:text-sm">Back</span>
              </button>
            )}
            <button
              type="button"
              id="brand-logo-btn"
              onClick={onNavigateHome}
              className="flex items-center text-left group focus-visible:ring-2 focus-visible:ring-cyan-400 outline-hidden rounded-lg p-0.5 cursor-pointer shrink-0 min-w-0"
              aria-label="Zeta Calculator Home"
            >
              <ZetaLogo
                size="md"
                dark={true}
              />
            </button>
          </div>

          {/* Center: Inline Live Search (Compact, subtle pill) */}
          <div className="flex-1 min-w-0 max-w-[125px] xs:max-w-[160px] sm:max-w-xs md:max-w-md mx-1 sm:mx-3">
            <InlineHeaderSearch
              onSelectTool={onSelectTool}
              onSelectCategory={onNavigateCategory}
            />
          </div>

          {/* Right: Theme Toggle & Consolidated 'Menu' Dropdown Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative" ref={dropdownRef}>
            <ThemeToggle size="sm" className="sm:hidden" />
            <ThemeToggle size="md" className="hidden sm:inline-flex" />

            <button
              type="button"
              id="header-menu-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-400 outline-hidden cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              title="Navigation Menu"
            >
              {menuOpen ? <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
            </button>

            {/* Consolidated Navigation Menu Popover / Drawer */}
            {menuOpen && (
              <div className="absolute right-0 top-13 sm:top-15 mt-1 w-[calc(100vw-1rem)] sm:w-96 max-w-[calc(100vw-1rem)] bg-[#1E293B] rounded-2xl shadow-2xl border border-white/15 p-4 z-50 backdrop-blur-xl text-slate-200 space-y-4 max-h-[calc(100vh-4.5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                
                {/* Search Bar Shortcut inside Menu */}
                <button
                  type="button"
                  id="menu-search-btn"
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-white" />
                    <span>Search All Zeta Calculators</span>
                  </div>
                  <kbd className="px-1.5 py-0.5 text-[10px] bg-white/20 rounded-md font-mono">⌘K</kbd>
                </button>

                {/* Main Navigation Items */}
                <div>
                  <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2 px-1">
                    Quick Navigation
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    <button
                      type="button"
                      id="menu-nav-home"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateHome();
                      }}
                      className={`text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        currentView === 'home' ? 'bg-white/20 text-white' : 'bg-white/5 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      <House className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                      <span>Overview</span>
                    </button>

                    <button
                      type="button"
                      id="menu-nav-all-tools"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateAllTools();
                      }}
                      className={`text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        currentView === 'all-tools' ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      <Grid className="w-4 h-4 text-blue-300" aria-hidden="true" />
                      <span>All Tools (A-Z)</span>
                    </button>

                    <button
                      type="button"
                      id="menu-nav-decision-center"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateDecisionCenter();
                      }}
                      className={`text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                        currentView === 'decision-center' ? 'bg-indigo-600 text-white' : 'bg-white/5 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      <Compass className="w-4 h-4 text-indigo-300" aria-hidden="true" />
                      <span>Decision Center</span>
                    </button>

                    <button
                      type="button"
                      id="menu-nav-favorites"
                      onClick={() => {
                        setMenuOpen(false);
                        onNavigateHome();
                        setTimeout(() => {
                          document.getElementById('favorites-section')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="text-left px-3 py-2 rounded-lg font-semibold flex items-center justify-between gap-1.5 transition-colors cursor-pointer bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" aria-hidden="true" />
                        <span className="truncate">Favorites</span>
                      </div>
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-mono shrink-0">
                        {favorites.length}
                      </span>
                    </button>

                    {onNavigateCollections && (
                      <button
                        type="button"
                        id="menu-nav-collections"
                        onClick={() => {
                          setMenuOpen(false);
                          onNavigateCollections();
                        }}
                        className={`text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          currentView === 'collections' ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/15 text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-cyan-300" aria-hidden="true" />
                        <span>Collections</span>
                      </button>
                    )}

                    {onNavigateDiscover && (
                      <button
                        type="button"
                        id="menu-nav-discover"
                        onClick={() => {
                          setMenuOpen(false);
                          onNavigateDiscover();
                        }}
                        className={`text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                          currentView === 'discover' ? 'bg-emerald-600 text-white' : 'bg-white/5 hover:bg-white/15 text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                        <span>Discover</span>
                      </button>
                    )}

                    <button
                      type="button"
                      id="menu-nav-localization"
                      onClick={() => {
                        setMenuOpen(false);
                        setLocalizationModalOpen(true);
                      }}
                      className="text-left px-3 py-2 rounded-lg font-semibold bg-white/5 hover:bg-white/15 text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Globe className="w-4 h-4 text-amber-300" />
                      <span>Currency ({preferences.currency})</span>
                    </button>
                  </div>
                </div>

                {/* Appearance / Theme Switcher in Menu */}
                <div className="pt-1 border-t border-white/10">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                      Appearance Theme
                    </span>
                  </div>
                  <ThemeToggle variant="segmented" className="w-full justify-between" />
                </div>

                {/* Categories Directory Grid */}
                <div>
                  <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2 px-1">
                    Calculator Categories
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {CATEGORIES.map((cat) => {
                      const colors = CATEGORY_ACCENT_COLORS[cat.id] || {
                        icon: 'text-slate-300',
                        hoverBg: 'hover:bg-white/10',
                      };
                      const isActive = currentView === `category-${cat.id}`;

                      return (
                        <button
                          key={cat.id}
                          type="button"
                          id={`menu-cat-${cat.id}`}
                          onClick={() => {
                            setMenuOpen(false);
                            onNavigateCategory(cat.id);
                          }}
                          className={`text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-white/20 text-white font-bold'
                              : `bg-white/5 text-slate-200 ${colors.hoverBg}`
                          }`}
                        >
                          <CategoryIcon categoryId={cat.id} size={14} className={colors.icon} />
                          <span className="truncate">{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* Regional Localization Settings Modal */}
      <LocalizationSettingsModal
        isOpen={localizationModalOpen}
        onClose={() => setLocalizationModalOpen(false)}
      />
    </header>
  );
};
