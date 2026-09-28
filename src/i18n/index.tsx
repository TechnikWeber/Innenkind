import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { L10n, Lang } from '../data/types';
import { ui, type UiKey } from './strings';

export { ui };

const STORAGE_KEY = 'innenkind.lang';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Oberflächentext, optional mit {platzhaltern}. */
  t: (key: UiKey, vars?: Record<string, string | number>) => string;
  /** Zweisprachigen Datentext auflösen (ohne Sitzungs-Platzhalter). */
  tl: (value: L10n | undefined) => string;
}

const LangContext = createContext<LangContextValue | null>(null);

function detectLang(): Lang {
  if (typeof window === 'undefined') return 'de';
  const fromUrl = new URLSearchParams(window.location.search).get('lang');
  if (fromUrl === 'en' || fromUrl === 'de') return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'de') return stored;
  } catch {
    // Privater Modus oder blockierter Speicher – dann eben die Browsersprache.
  }
  return navigator.language?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Nicht schlimm: die Sprache gilt dann nur für diese Sitzung.
    }
  }, [lang]);

  const setLang = useCallback((next: Lang) => setLangState(next), []);

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => interpolate(ui[key][lang], vars),
      tl: (v) => (v ? v[lang] : ''),
    }),
    [lang, setLang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useI18n(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useI18n muss innerhalb von <LangProvider> verwendet werden.');
  return ctx;
}
