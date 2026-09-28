import { helpRegions } from '../data/help';
import { useI18n } from '../i18n';

/** Krisennummern nach Land. Kompakt: nur Name und Nummer, ohne Erläuterung. */
export function CrisisLines({ compact }: { compact?: boolean }) {
  const { lang } = useI18n();
  return (
    <div className="grid grid--2 crisis">
      {helpRegions.map((region) => (
        <section key={region.id} className="card card--flat">
          <h3 className="eyebrow">{region.name[lang]}</h3>
          <ul className="crisis__list">
            {region.lines.map((line) => (
              <li key={line.name.de}>
                <span className="crisis__name">{line.name[lang]}</span>
                {line.tel ? (
                  <a className="crisis__number" href={`tel:${line.tel}`}>
                    {line.number}
                  </a>
                ) : line.url ? (
                  <a className="crisis__number" href={line.url} target="_blank" rel="noreferrer noopener">
                    {line.number}
                  </a>
                ) : (
                  <span className="crisis__number">{line.number}</span>
                )}
                {!compact && (
                  <span className="crisis__note">
                    {line.note[lang]}
                    {line.url && line.tel && (
                      <>
                        {' '}
                        <a href={line.url} target="_blank" rel="noreferrer noopener">
                          {new URL(line.url).hostname.replace(/^www\./, '')}
                        </a>
                      </>
                    )}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
