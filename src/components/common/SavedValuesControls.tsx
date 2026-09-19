import React, { useState, useEffect } from 'react';
import { Save, Trash2, RotateCcw, Check, ShieldCheck } from 'lucide-react';

interface SavedValuesControlsProps {
  toolSlug: string;
  currentValues: Record<string, any>;
  onRestore: (savedValues: Record<string, any>) => void;
  onReset: () => void;
  idPrefix?: string;
}

const STORAGE_PREFIX = 'zeta_calc_saved_';
const REMEMBER_PREF_KEY = 'zeta_calc_remember_enabled_';

export const SavedValuesControls: React.FC<SavedValuesControlsProps> = ({
  toolSlug,
  currentValues,
  onRestore,
  onReset,
  idPrefix = 'saved-ctrl',
}) => {
  const storageKey = `${STORAGE_PREFIX}${toolSlug}`;
  const rememberKey = `${REMEMBER_PREF_KEY}${toolSlug}`;

  const [isRememberEnabled, setIsRememberEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem(rememberKey) === 'true';
    } catch {
      return false;
    }
  });

  const [hasSavedData, setHasSavedData] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem(storageKey);
    } catch {
      return false;
    }
  });

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const serializedValues = JSON.stringify(currentValues);

  // When remember is enabled, auto-save valid values
  useEffect(() => {
    if (isRememberEnabled) {
      try {
        const hasAnyValue = Object.values(currentValues).some(
          (v) => v !== '' && v !== null && v !== undefined
        );
        if (hasAnyValue) {
          localStorage.setItem(storageKey, serializedValues);
          setHasSavedData((prev) => (prev ? prev : true));
        }
      } catch {
        // ignore
      }
    }
  }, [serializedValues, isRememberEnabled, storageKey]);

  // Initial load: if remember enabled and saved data exists, restore it once
  useEffect(() => {
    if (isRememberEnabled) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          onRestore(parsed);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleToggleRemember = (checked: boolean) => {
    setIsRememberEnabled(checked);
    try {
      localStorage.setItem(rememberKey, checked ? 'true' : 'false');
      if (checked) {
        localStorage.setItem(storageKey, JSON.stringify(currentValues));
        setHasSavedData(true);
        showFeedback('Remembering values locally');
      } else {
        localStorage.removeItem(storageKey);
        setHasSavedData(false);
        showFeedback('Local memory turned off');
      }
    } catch {
      // ignore
    }
  };

  const handleManualSave = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(currentValues));
      setHasSavedData(true);
      showFeedback('Values saved to browser');
    } catch {
      // ignore
    }
  };

  const handleClearSaved = () => {
    try {
      localStorage.removeItem(storageKey);
      localStorage.removeItem(rememberKey);
      setIsRememberEnabled(false);
      setHasSavedData(false);
      showFeedback('Saved values cleared');
    } catch {
      // ignore
    }
  };

  const showFeedback = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-xs">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
          <input
            id={`${idPrefix}-remember-toggle`}
            type="checkbox"
            checked={isRememberEnabled}
            onChange={(e) => handleToggleRemember(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span className="flex items-center gap-1">
            <Save className="w-3 h-3 text-slate-500" />
            <span>Remember my values</span>
          </span>
        </label>

        {savedFeedback && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 animate-fade-in">
            <Check className="w-3 h-3" />
            {savedFeedback}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          id={`${idPrefix}-reset-btn`}
          onClick={onReset}
          className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors flex items-center gap-1 font-medium cursor-pointer"
          title="Reset input fields to empty"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        {hasSavedData && (
          <button
            type="button"
            id={`${idPrefix}-clear-btn`}
            onClick={handleClearSaved}
            className="px-2.5 py-1 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 font-medium cursor-pointer"
            title="Clear stored data from browser"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear Saved</span>
          </button>
        )}

        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-400 pl-1">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Privacy Safe</span>
        </span>
      </div>
    </div>
  );
};
