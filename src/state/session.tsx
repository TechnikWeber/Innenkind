import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Path } from '../data/types';
import { stepById } from '../data/steps';
import {
  emptySession,
  RESOURCE_CHOICE_KEYS,
  RESOURCE_TEXT_KEYS,
  type SessionData,
} from '../engine/session';
import { firstStepOfPhase, resolveStep, visibleSteps } from '../engine/flow';

/*
 * Speicherung
 *
 * Standard ist `sessionStorage`: Ein Neuladen mitten in der Sitzung verliert
 * nichts, aber mit dem Tab ist alles weg. Wer sein Protokoll behalten will,
 * schaltet `localStorage` ausdrücklich zu. Ein Merker im localStorage sagt,
 * ob das so gewünscht ist – er enthält selbst keine Inhalte.
 */
const DATA_KEY = 'innenkind.session';
const PERSIST_KEY = 'innenkind.persist';

function readStore(store: Storage | undefined): SessionData | null {
  try {
    const raw = store?.getItem(DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionData;
    if (parsed?.v !== 1) return null;
    return { ...emptySession(), ...parsed };
  } catch {
    return null;
  }
}

function storage(kind: 'local' | 'session'): Storage | undefined {
  try {
    return kind === 'local' ? window.localStorage : window.sessionStorage;
  } catch {
    return undefined;
  }
}

function readPersist(): boolean {
  try {
    return window.localStorage.getItem(PERSIST_KEY) === '1';
  } catch {
    return false;
  }
}

function load(): SessionData {
  return readStore(storage('session')) ?? (readPersist() ? readStore(storage('local')) : null) ?? emptySession();
}

interface SessionContextValue {
  data: SessionData;
  persist: boolean;
  setPersist: (on: boolean) => void;
  setChoice: (id: string, values: string[]) => void;
  setValue: (id: string, value: number | undefined) => void;
  setText: (id: string, value: string) => void;
  setPath: (path: Path, chosen?: boolean) => void;
  toggleDone: (id: string) => void;
  /** Sitzung beginnen, falls noch nicht geschehen. */
  begin: () => void;
  goNext: () => void;
  goBack: () => void;
  goTo: (stepId: string) => void;
  /** Auf den sanften Weg wechseln und dort weitermachen. */
  soften: () => void;
  /** Direkt zum Abschluss springen. */
  closeGently: () => void;
  finish: () => void;
  reset: (keepResources?: boolean) => void;
  wipe: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SessionData>(load);
  const [persist, setPersistState] = useState<boolean>(readPersist);

  useEffect(() => {
    const json = JSON.stringify(data);
    try {
      storage('session')?.setItem(DATA_KEY, json);
      if (persist) storage('local')?.setItem(DATA_KEY, json);
    } catch {
      // Voller oder gesperrter Speicher: Die Sitzung läuft trotzdem weiter,
      // nur ein Neuladen würde sie verlieren.
    }
  }, [data, persist]);

  const setPersist = useCallback((on: boolean) => {
    setPersistState(on);
    try {
      if (on) window.localStorage.setItem(PERSIST_KEY, '1');
      else {
        window.localStorage.removeItem(PERSIST_KEY);
        window.localStorage.removeItem(DATA_KEY);
      }
    } catch {
      // Ohne Speicher lässt sich nichts dauerhaft ablegen – nichts zu tun.
    }
  }, []);

  const update = useCallback((fn: (d: SessionData) => SessionData) => setData((d) => fn(d)), []);

  const value = useMemo<SessionContextValue>(() => {
    const move = (offset: number) =>
      update((d) => {
        const list = visibleSteps(d);
        const idx = list.indexOf(resolveStep(d));
        const target = list[Math.max(0, Math.min(list.length - 1, idx + offset))];
        return { ...d, stepId: target.id };
      });

    return {
      data,
      persist,
      setPersist,
      setChoice: (id, values) =>
        update((d) => {
          const choices = { ...d.choices };
          if (values.length === 0) delete choices[id];
          else choices[id] = values;
          return { ...d, choices };
        }),
      setValue: (id, v) =>
        update((d) => {
          const values = { ...d.values };
          if (v === undefined) delete values[id];
          else values[id] = v;
          return { ...d, values };
        }),
      setText: (id, v) => update((d) => ({ ...d, texts: { ...d.texts, [id]: v } })),
      setPath: (path, chosen = true) => update((d) => ({ ...d, path, pathChosen: chosen || d.pathChosen })),
      toggleDone: (id) =>
        update((d) => ({ ...d, done: d.done.includes(id) ? d.done.filter((x) => x !== id) : [...d.done, id] })),
      begin: () => update((d) => (d.startedAt ? d : { ...d, startedAt: new Date().toISOString() })),
      goNext: () => move(1),
      goBack: () => move(-1),
      goTo: (stepId) => update((d) => (stepById.has(stepId) ? { ...d, stepId } : d)),
      soften: () =>
        update((d) => {
          // Aktuellen Schritt festhalten, bevor der Weg wechselt – sonst
          // springt resolveStep womöglich an den Anfang der Liste.
          const current = resolveStep(d).id;
          return { ...d, path: 'gentle', pathChosen: true, softened: true, stepId: current };
        }),
      closeGently: () =>
        update((d) => {
          const target = firstStepOfPhase(d, 'abschluss');
          return target ? { ...d, stepId: target.id } : d;
        }),
      finish: () => update((d) => ({ ...d, finishedAt: d.finishedAt ?? new Date().toISOString() })),
      reset: (keepResources = false) =>
        update((d) => {
          const fresh = emptySession();
          if (!keepResources) return fresh;
          for (const k of RESOURCE_TEXT_KEYS) if (d.texts[k]) fresh.texts[k] = d.texts[k];
          for (const k of RESOURCE_CHOICE_KEYS) if (d.choices[k]) fresh.choices[k] = d.choices[k];
          return fresh;
        }),
      wipe: () => {
        try {
          storage('session')?.removeItem(DATA_KEY);
          window.localStorage.removeItem(DATA_KEY);
          window.localStorage.removeItem(PERSIST_KEY);
        } catch {
          // Nichts gespeichert oder kein Zugriff – der Zustand wird trotzdem geleert.
        }
        setPersistState(false);
        setData(emptySession());
      },
    };
  }, [data, persist, setPersist, update]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession muss innerhalb von <SessionProvider> verwendet werden.');
  return ctx;
}
