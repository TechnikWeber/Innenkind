import { useCallback, useMemo, type ReactNode } from 'react';
import type { L10n } from '../data/types';
import { useApp, routeToHash, type Route } from '../state/app';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { fill, textContext } from '../engine/text';

/** Interner Link über den Hash-Router. */
export function Link({
  to,
  children,
  className,
  ...rest
}: {
  to: Route;
  children: ReactNode;
  className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  const { navigate, route } = useApp();
  const isCurrent = route.name === to.name && (to.name !== 'exercise' || (route as { id?: string }).id === to.id);
  return (
    <a
      href={routeToHash(to)}
      className={className}
      aria-current={isCurrent ? 'page' : undefined}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

/**
 * Datentexte mit eingesetzten Sitzungswerten (Name des Kindes, sicherer Ort …).
 * Alles, was aus `data/` kommt und angezeigt wird, läuft hier durch.
 */
export function useFill(): (value: L10n | undefined) => string {
  const { lang } = useI18n();
  const { data } = useSession();
  // Den Kontext nur einmal je Änderung bauen: Er formatiert das Datum, und
  // das hundertfach pro Seite machte jede Eingabe spürbar träge.
  const ctx = useMemo(() => textContext(data, lang), [data, lang]);
  return useCallback((value: L10n | undefined) => (value ? fill(value[lang], ctx) : ''), [ctx, lang]);
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warning' | 'critical' | 'positive';
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className={`callout callout--${tone}`}>
      {title && <p className="callout__title">{title}</p>}
      {children}
    </div>
  );
}

/** Antwort der Sitzung auf eine Wahl – optisch als Stimme abgesetzt. */
export function Voice({ children }: { children: ReactNode }) {
  return (
    <div className="voice" role="status">
      <span className="voice__mark" aria-hidden="true" />
      <div className="voice__text">{children}</div>
    </div>
  );
}

/** Mehrzeilige Texte: Leerzeilen trennen Absätze, einfache Zeilenumbrüche bleiben. */
export function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i} style={{ whiteSpace: 'pre-line' }}>
          {para}
        </p>
      ))}
    </>
  );
}

/** Waagerechter Balken, 0–max. */
export function Meter({ label, value, max = 10, muted, suffix }: { label: string; value: number; max?: number; muted?: boolean; suffix?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="meter">
      <span className="meter__label">{label}</span>
      {suffix !== undefined && <span className="meter__value">{suffix}</span>}
      <div className="meter__track" role="img" aria-label={`${label}: ${suffix ?? value}`}>
        <div className={`meter__fill${muted ? ' meter__fill--muted' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** Wortmarke: eine große Gestalt, die eine kleine umfängt. */
export function BrandMark({ className = 'brand__mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="var(--accent)" />
      <path d="M17 50 C17 30 23 18 32 18 C41 18 47 30 47 50" fill="none" stroke="var(--accent-ink)" strokeWidth="3.2" strokeLinecap="round" opacity="0.55" />
      <circle cx="32" cy="36" r="5.2" fill="var(--accent-ink)" />
      <path d="M24.5 51 C24.5 45 27.8 42.5 32 42.5 C36.2 42.5 39.5 45 39.5 51 Z" fill="var(--accent-ink)" />
    </svg>
  );
}
