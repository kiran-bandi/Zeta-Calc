import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { HistoryProvider } from './context/HistoryContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { UniversalSearchModal } from './components/search/UniversalSearchModal';
import { HomePage } from './components/pages/HomePage';
import { AllToolsPage } from './components/pages/AllToolsPage';
import { DecisionCenterPage } from './components/pages/DecisionCenterPage';
import { CategoryViewPage } from './components/pages/CategoryViewPage';
import { CollectionsPage } from './components/pages/CollectionsPage';
import { DiscoverPage } from './components/pages/DiscoverPage';
import { EMICalculatorView } from './components/calculator/EMICalculatorView';
import { TravelBudgetCalculatorView } from './components/calculator/TravelBudgetCalculatorView';
import { SimpleInterestCalculatorView } from './components/calculator/SimpleInterestCalculatorView';
import { InterestBetweenDatesCalculatorView } from './components/calculator/InterestBetweenDatesCalculatorView';
import { GenericCalculatorView } from './components/calculator/GenericCalculatorView';
import { EmbedCalculatorView } from './components/calculator/EmbedCalculatorView';
import { TOOLS_REGISTRY } from './data/toolsRegistry';
import { CATEGORIES } from './data/categories';
import { initCapacitorMobile } from './mobile/capacitorBridge';

interface NavHistoryItem {
  view: string;
  scrollY: number;
}

export default function App() {
  // Navigation states: 'home' | 'all-tools' | 'decision-center' | 'collections' | 'discover' | 'category-{id}' | 'tool-{slug}' | 'embed-{slug}'
  const parseHash = (hashStr: string) => {
    const raw = hashStr.replace('#', '').trim();
    if (!raw || raw === '/') return 'home';
    const hash = raw.split('?')[0];

    if (hash.startsWith('/embed/')) {
      const slug = hash.replace('/embed/', '');
      return `embed-${slug}`;
    }
    if (hash.startsWith('/tool/')) {
      const slug = hash.replace('/tool/', '');
      return `tool-${slug}`;
    }
    if (hash.startsWith('/category/')) {
      const cat = hash.replace('/category/', '');
      return `category-${cat}`;
    }
    if (hash === '/all-tools') return 'all-tools';
    if (hash === '/decision-center') return 'decision-center';
    if (hash === '/collections') return 'collections';
    if (hash === '/discover') return 'discover';

    // Support canonical route format: /categorySlug/toolSlug or /categorySlug
    const parts = hash.split('/').filter(Boolean);
    if (parts.length === 2) {
      const [catSlug, toolSlug] = parts;
      const matchedTool = TOOLS_REGISTRY.find((t) => t.slug === toolSlug);
      if (matchedTool) return `tool-${toolSlug}`;
    } else if (parts.length === 1) {
      const [catSlug] = parts;
      const matchedCat = CATEGORIES.find((c) => c.slug === catSlug || c.id === catSlug);
      if (matchedCat) return `category-${matchedCat.id}`;
      const matchedTool = TOOLS_REGISTRY.find((t) => t.slug === catSlug);
      if (matchedTool) return `tool-${catSlug}`;
    }

    return 'home';
  };

  const getHashForView = (view: string) => {
    if (view === 'home') return '';
    if (view === 'all-tools') return '/all-tools';
    if (view === 'decision-center') return '/decision-center';
    if (view === 'collections') return '/collections';
    if (view === 'discover') return '/discover';
    if (view.startsWith('category-')) {
      const catId = view.replace('category-', '');
      const catObj = CATEGORIES.find((c) => c.id === catId);
      return catObj ? `/${catObj.slug}` : `/category/${catId}`;
    }
    if (view.startsWith('tool-')) {
      const slug = view.replace('tool-', '');
      const toolObj = TOOLS_REGISTRY.find((t) => t.slug === slug);
      if (toolObj) {
        const catObj = CATEGORIES.find((c) => c.id === toolObj.category);
        const catSlug = catObj ? catObj.slug : 'tools';
        return `/${catSlug}/${slug}`;
      }
      return `/tool/${slug}`;
    }
    if (view.startsWith('embed-')) {
      const slug = view.replace('embed-', '');
      return `/embed/${slug}`;
    }
    return '';
  };

  const [currentView, setCurrentView] = useState<string>(() => parseHash(window.location.hash));
  const [navHistory, setNavHistory] = useState<NavHistoryItem[]>([]);
  const scrollPositionsRef = useRef<Record<string, number>>({});

  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Continuously record scroll position per view
  useEffect(() => {
    const handleScroll = () => {
      scrollPositionsRef.current[currentView] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  // Sync hash and view on forward navigation
  const navigateTo = (view: string, replace = false) => {
    const currentY = window.scrollY;
    scrollPositionsRef.current[currentView] = currentY;

    if (!replace && currentView !== view) {
      setNavHistory((prev) => [...prev, { view: currentView, scrollY: currentY }]);
    }
    setCurrentView(view);

    const hash = getHashForView(view);
    const targetHash = hash ? `#${hash}` : '';
    if (window.location.hash !== targetHash) {
      window.location.hash = hash;
    }

    // New navigation lands at top
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoBack = () => {
    // 1. If internal history exists, navigate back to the most recent different view
    if (navHistory.length > 0) {
      let targetIndex = navHistory.length - 1;
      while (targetIndex >= 0 && navHistory[targetIndex].view === currentView) {
        targetIndex--;
      }

      if (targetIndex >= 0) {
        const targetItem = navHistory[targetIndex];
        setNavHistory((prevList) => prevList.slice(0, targetIndex));

        setCurrentView(targetItem.view);
        const hash = getHashForView(targetItem.view);
        const targetHash = hash ? `#${hash}` : '';
        if (window.location.hash !== targetHash) {
          window.location.hash = hash;
        }

        const targetY = targetItem.scrollY ?? scrollPositionsRef.current[targetItem.view] ?? 0;
        requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
          setTimeout(() => {
            window.scrollTo({ top: targetY, behavior: 'instant' });
          }, 50);
        });
        return;
      }
    }

    // 2. If no prior in-app history exists (e.g. refreshed page, direct bookmark/URL,
    // or opened in an iframe/new tab where window.history.back() fails or leaves the site):
    // Fall back to smart contextual parent navigation so Back ALWAYS works seamlessly!
    if (currentView.startsWith('tool-')) {
      const slug = currentView.replace('tool-', '');
      const toolObj = TOOLS_REGISTRY.find((t) => t.slug === slug);
      if (toolObj && toolObj.category) {
        navigateTo(`category-${toolObj.category}`, true);
        return;
      }
      navigateTo('all-tools', true);
      return;
    }

    if (currentView.startsWith('category-')) {
      navigateTo('home', true);
      return;
    }

    if (['all-tools', 'decision-center', 'collections', 'discover'].includes(currentView)) {
      navigateTo('home', true);
      return;
    }

    // Default fallback: return home
    navigateTo('home', true);
  };

  // Listen to popstate (browser back/forward) and restore scroll
  useEffect(() => {
    const handleHashChange = () => {
      const newView = parseHash(window.location.hash);
      setCurrentView(newView);
      const savedY = scrollPositionsRef.current[newView] ?? 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedY, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' });
        }, 50);
      });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Keyboard Shortcut: Cmd+K / Ctrl+K / '/' to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Native Mobile Layer Integration (Capacitor for Android / iOS App Stores)
  useEffect(() => {
    const cleanup = initCapacitorMobile(() => {
      // 1. If search modal is open, close it on Android hardware back button
      if (searchModalOpen) {
        setSearchModalOpen(false);
        return true;
      }
      // 2. If not on home screen, navigate back
      if (currentView !== 'home') {
        handleGoBack();
        return true;
      }
      // Return false to allow exiting / minimizing the app at the home screen
      return false;
    });

    return cleanup;
  }, [searchModalOpen, currentView]);

  // Determine active tool if in tool view or embed view
  const activeToolSlug = currentView.startsWith('tool-')
    ? currentView.replace('tool-', '')
    : currentView.startsWith('embed-')
    ? currentView.replace('embed-', '')
    : null;
  const activeTool = activeToolSlug
    ? TOOLS_REGISTRY.find((t) => t.slug === activeToolSlug) || TOOLS_REGISTRY[0]
    : null;

  // Check if standalone embed
  if (currentView.startsWith('embed-') && activeTool) {
    return (
      <SettingsProvider>
        <EmbedCalculatorView tool={activeTool} />
      </SettingsProvider>
    );
  }

  // Determine active category if in category view
  const activeCategoryId = currentView.startsWith('category-')
    ? currentView.replace('category-', '')
    : null;

  return (
    <ThemeProvider>
      <SettingsProvider>
        <HistoryProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white transition-colors duration-150">
            {/* Skip to Main Content Link for Accessibility */}
            <a
              href="#main-content"
              id="skip-to-content-link"
              className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-hidden focus:ring-2 focus:ring-white"
            >
              Skip to main content
            </a>

            {/* Header */}
          <Header
            currentView={currentView}
            onNavigateHome={() => navigateTo('home')}
            onNavigateBack={handleGoBack}
            onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
            onNavigateAllTools={() => navigateTo('all-tools')}
            onNavigateDecisionCenter={() => navigateTo('decision-center')}
            onNavigateCollections={() => navigateTo('collections')}
            onNavigateDiscover={() => navigateTo('discover')}
            onOpenSearch={() => setSearchModalOpen(true)}
            onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
          />

          {/* Main Content Area */}
          <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-hidden">
            {currentView === 'home' && (
              <HomePage
                onOpenSearch={() => setSearchModalOpen(true)}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                onSelectCategory={(catId) => navigateTo(`category-${catId}`)}
                onNavigateAllTools={() => navigateTo('all-tools')}
                onNavigateDecisionCenter={() => navigateTo('decision-center')}
                onNavigateCollections={() => navigateTo('collections')}
                onNavigateDiscover={() => navigateTo('discover')}
              />
            )}

            {currentView === 'all-tools' && (
              <AllToolsPage
                onNavigateHome={() => navigateTo('home')}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                onGoBack={() => navigateTo('home')}
              />
            )}

            {currentView === 'decision-center' && (
              <DecisionCenterPage
                onNavigateHome={() => navigateTo('home')}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
              />
            )}

            {currentView === 'collections' && (
              <CollectionsPage
                onNavigateHome={() => navigateTo('home')}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
              />
            )}

            {currentView === 'discover' && (
              <DiscoverPage
                onNavigateHome={() => navigateTo('home')}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
              />
            )}

            {activeCategoryId && (
              <CategoryViewPage
                categoryId={activeCategoryId}
                onNavigateHome={() => navigateTo('home')}
                onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                onSelectCategory={(catId) => navigateTo(`category-${catId}`)}
                onGoBack={() => navigateTo('home')}
              />
            )}

            {activeTool && (
              activeTool.slug === 'emi-calculator' ? (
                <EMICalculatorView
                  key={activeTool.slug}
                  tool={activeTool}
                  onNavigateHome={() => navigateTo('home')}
                  onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
                  onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                  onGoBack={() => navigateTo(`category-${activeTool.category}`)}
                />
              ) : activeTool.slug === 'travel-budget-calculator' ? (
                <TravelBudgetCalculatorView
                  key={activeTool.slug}
                  tool={activeTool}
                  onNavigateHome={() => navigateTo('home')}
                  onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
                  onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                  onGoBack={() => navigateTo(`category-${activeTool.category}`)}
                />
              ) : activeTool.slug === 'simple-interest-calculator' ? (
                <SimpleInterestCalculatorView
                  key={activeTool.slug}
                  tool={activeTool}
                  onNavigateHome={() => navigateTo('home')}
                  onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
                  onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                  onGoBack={() => navigateTo(`category-${activeTool.category}`)}
                />
              ) : activeTool.slug === 'interest-between-dates-calculator' ? (
                <InterestBetweenDatesCalculatorView
                  key={activeTool.slug}
                  tool={activeTool}
                  onNavigateHome={() => navigateTo('home')}
                  onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
                  onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                  onGoBack={() => navigateTo(`category-${activeTool.category}`)}
                />
              ) : (
                <GenericCalculatorView
                  key={activeTool.slug}
                  tool={activeTool}
                  onNavigateHome={() => navigateTo('home')}
                  onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
                  onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
                  onGoBack={() => navigateTo(`category-${activeTool.category}`)}
                />
              )
            )}
          </main>

          {/* Universal Search Modal */}
          <UniversalSearchModal
            isOpen={searchModalOpen}
            onClose={() => setSearchModalOpen(false)}
            onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
            onSelectCategory={(catId) => navigateTo(`category-${catId}`)}
          />

          {/* Global Trust & Disclaimer Footer */}
          <Footer
            onNavigateHome={() => navigateTo('home')}
            onNavigateCategory={(catId) => navigateTo(`category-${catId}`)}
            onNavigateAllTools={() => navigateTo('all-tools')}
            onNavigateDecisionCenter={() => navigateTo('decision-center')}
            onSelectTool={(slug) => navigateTo(`tool-${slug}`)}
          />
        </div>
      </HistoryProvider>
    </SettingsProvider>
  </ThemeProvider>
  );
}
