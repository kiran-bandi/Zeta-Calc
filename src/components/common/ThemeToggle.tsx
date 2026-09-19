import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, Theme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'pill' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
  size = 'md',
}) => {
  const { theme, resolvedTheme, isDark, setTheme, toggleTheme } = useTheme();

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const buttonPaddings = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-lg sm:rounded-xl',
    lg: 'p-2.5 rounded-xl',
  };

  if (variant === 'segmented') {
    const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
      {
        value: 'light',
        label: 'Light',
        icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      },
      {
        value: 'dark',
        label: 'Dark',
        icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
      },
      {
        value: 'system',
        label: 'System',
        icon: <Monitor className="w-3.5 h-3.5 text-slate-400" />,
      },
    ];

    return (
      <div
        className={`inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}
        role="group"
        aria-label="Theme selector"
      >
        {options.map((opt) => {
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              id={`theme-opt-${opt.value}`}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              aria-pressed={isSelected}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        id="theme-toggle-pill-btn"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  // Default 'icon' button
  return (
    <button
      type="button"
      id="header-theme-toggle-btn"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center ${buttonPaddings[size]} text-slate-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all shadow-2xs focus-visible:ring-2 focus-visible:ring-cyan-400 outline-hidden cursor-pointer shrink-0 ${className}`}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun className={`${iconSizes[size]} text-amber-300 transition-transform duration-300 hover:rotate-45`} />
      ) : (
        <Moon className={`${iconSizes[size]} text-indigo-200 transition-transform duration-300 hover:-rotate-12`} />
      )}
    </button>
  );
};
