import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { useApp } from '../state/app';
import { exerciseById } from '../data/exercises';
import { Breath, GuidedPlayer } from './blocks';

interface PauseContextValue {
  open: () => void;
}

const PauseContext = createContext<PauseContextValue>({ open: () => {} });

export function usePause() {
  return useContext(PauseContext);
}

/**
 * Der Notfallkoffer.
 *
 * Er liegt über der Sitzung, statt sie zu verlassen: Wer ihn schließt, steht
 * genau dort, wo er war. Die drei Ausgänge unten entsprechen dem, was eine
 * Therapeutin in so einem Moment anbieten würde – weitermachen, vorsichtiger
 * weitermachen oder die Stunde behutsam zu Ende bringen.
 */
export function PauseProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const value = useMemo(() => ({ open }), [open]);
  return (
    <PauseContext.Provider value={value}>
      {children}
      {isOpen && <PauseDialog onClose={() => setOpen(false)} />}
    </PauseContext.Provider>
  );
}

export function PauseButton() {
  const { t } = useI18n();
  const { open } = usePause();
  return (
    <button type="button" className="pause-fab no-print" onClick={open} title={t('pauseButtonLong')} aria-label={t('pauseButtonLong')}>
      <span aria-hidden="true" className="pause-fab__icon">❚❚</span>
      <span>{t('pauseButton')}</span>
    </button>
  );
}

function PauseDialog({ onClose }: { onClose: () => void }) {
  const { t, lang } = useI18n();
  const { data, soften, closeGently } = useSession();
  const { navigate, route } = useApp();
  // Wegwechsel und Abschluss gibt es nur in der Sitzung selbst.
  const inSession = route.name === 'session';
  const ref = useRef<HTMLDivElement>(null);
  const today = new Date().toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus();
    };
  }, [onClose]);

  const anchors =
    lang === 'de'
      ? [
          'Stell beide Füße fest auf den Boden. Drück sie ein wenig hinein.',
          'Öffne die Augen und nenne fünf Dinge, die du im Raum siehst.',
          `Sag dir: „Heute ist ${today}. Ich bin erwachsen. Ich bin hier, und ich bin sicher.“`,
          'Trink einen Schluck kaltes Wasser oder halte die Hände unter kaltes Wasser.',
          'Nimm etwas in die Hand, das eine deutliche Oberfläche hat – einen Schlüssel, einen Stein, eine Tasse.',
          'Atme länger aus als ein – zum Beispiel mit dem Kreis hier.',
        ]
      : [
          'Place both feet firmly on the floor. Press them down a little.',
          'Open your eyes and name five things you can see in the room.',
          `Tell yourself: “Today is ${today}. I am an adult. I am here, and I am safe.”`,
          'Drink a sip of cold water or hold your hands under cold water.',
          'Pick up something with a distinct surface — a key, a stone, a mug.',
          'Breathe out longer than you breathe in — for example with the circle here.',
        ];

  return (
    <div className="overlay" role="presentation" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="overlay__panel" role="dialog" aria-modal="true" aria-labelledby="pause-title" tabIndex={-1} ref={ref}>
        <div className="overlay__head">
          <h2 id="pause-title">{t('pauseTitle')}</h2>
          <button type="button" className="btn btn--quiet btn--icon" onClick={onClose} aria-label={t('close')}>
            ✕
          </button>
        </div>
        <p className="lead">{t('pauseLead')}</p>

        <div className="pause-grid">
          <div>
            <Breath />
          </div>
          <div>
            <h3 className="eyebrow">{t('pauseAnchors')}</h3>
            <ul className="anchors">
              {anchors.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        <details className="explainer" style={{ marginTop: '1rem' }}>
          <summary>{lang === 'de' ? 'Geführt: Zurück ins Hier und Jetzt' : 'Guided: back to the here and now'}</summary>
          <div>
            <GuidedPlayer lines={exerciseById.get('reorientierung')!.lines} />
          </div>
        </details>
        <details className="explainer" style={{ marginTop: '0.5rem' }}>
          <summary>{lang === 'de' ? 'Geführt: Schmetterlingsumarmung' : 'Guided: butterfly hug'}</summary>
          <div>
            <GuidedPlayer lines={exerciseById.get('schmetterling')!.lines} />
          </div>
        </details>

        <div className="pause-exits">
          <button type="button" className="btn btn--primary" onClick={onClose}>
            {t('pauseContinue')}
          </button>
          {inSession && data.path !== 'gentle' && (
            <button
              type="button"
              className="btn"
              title={t('pauseGentleHint')}
              onClick={() => {
                soften();
                onClose();
              }}
            >
              {t('pauseGentle')}
            </button>
          )}
          {inSession && (
          <button
            type="button"
            className="btn"
            title={t('pauseCloseHint')}
            onClick={() => {
              closeGently();
              onClose();
              navigate({ name: 'session' });
            }}
          >
            {t('pauseClose')}
          </button>
          )}
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => {
              onClose();
              navigate({ name: 'help' });
            }}
          >
            {t('pauseHelp')}
          </button>
        </div>
        {inSession && (
          <p className="overlay__hints">
            {data.path !== 'gentle' && <>{t('pauseGentleHint')} </>}
            {t('pauseCloseHint')}
          </p>
        )}
      </div>
    </div>
  );
}
