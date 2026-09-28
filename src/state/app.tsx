import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ExerciseId } from '../data/types';

/*
 * Anders als im LinuxKompass steht hier nichts vom Zustand in der
 * Adresszeile. Die Antworten sind intim: Sie gehören weder in den
 * Browserverlauf noch in ein Lesezeichen oder einen geteilten Link.
 */
export type Route =
  | { name: 'home' }
  | { name: 'session' }
  | { name: 'result' }
  | { name: 'daily' }
  | { name: 'exercises' }
  | { name: 'exercise'; id: ExerciseId }
  | { name: 'background' }
  | { name: 'help' }
  | { name: 'about' };

export type Theme = 'light' | 'dark';

const SIMPLE: Route['name'][] = ['session', 'result', 'daily', 'exercises', 'background', 'help', 'about'];

export function parseHash(hash: string): Route {
  const segments = hash.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
  const [first, second] = segments;
  if (first === 'exercise' && second) return { name: 'exercise', id: second as ExerciseId };
  if (SIMPLE.includes(first as Route['name'])) return { name: first } as Route;
  return { name: 'home' };
}

export function routeToHash(route: Route): string {
  if (route.name === 'home') return '#/';
  if (route.name === 'exercise') return `#/exercise/${route.id}`;
  return `#/${route.name}`;
}

interface AppContextValue {
  route: Route;
  navigate: (route: Route) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const THEME_KEY = 'innenkind.theme';

/*
 * Hell ist die Vorgabe, nicht die Systemeinstellung – wie im LinuxKompass.
 * Ein Farbwechsel mitten in einer Imagination, weil das Telefon abends
 * umschaltet, wäre hier noch störender als in einem Fragebogen.
 */
function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Speicher nicht verfügbar – dann gilt die Vorgabe.
  }
  return 'light';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ohne Speicher gilt die Wahl nur für diesen Besuch.
    }
  }, [theme]);

  const navigate = useCallback((target: Route) => {
    window.location.hash = routeToHash(target);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({ route, navigate, theme, setTheme: setThemeState }),
    [route, navigate, theme],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp muss innerhalb von <AppProvider> verwendet werden.');
  return ctx;
}
