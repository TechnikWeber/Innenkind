import type { ReactNode } from 'react';
import { useI18n } from '../i18n';
import { useApp } from '../state/app';
import { useSession } from '../state/session';
import { BrandMark, Link } from './common';

function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const { t } = useI18n();
  const next = theme === 'dark' ? 'light' : 'dark';
  const label = next === 'dark' ? t('themeToDark') : t('themeToLight');
  return (
    <button type="button" className="btn btn--quiet btn--icon" onClick={() => setTheme(next)} title={label} aria-label={label}>
      <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="switch-group" role="group" aria-label={t('langSwitch')}>
      <button type="button" aria-pressed={lang === 'de'} onClick={() => setLang('de')} lang="de">
        DE
      </button>
      <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')} lang="en">
        EN
      </button>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const { data } = useSession();
  const hasSession = Boolean(data.startedAt);
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        {t('skipToContent')}
      </a>

      <header className="masthead no-print">
        <div className="container masthead__inner">
          <Link to={{ name: 'home' }} className="brand">
            <BrandMark />
            {t('appName')}
          </Link>
          <nav className="masthead__nav" aria-label={t('appName')}>
            <Link to={{ name: 'session' }} className="navlink">
              {t('navSession')}
            </Link>
            {hasSession && (
              <Link to={{ name: 'result' }} className="navlink">
                {t('navResult')}
              </Link>
            )}
            <Link to={{ name: 'daily' }} className="navlink">
              {t('navDaily')}
            </Link>
            <Link to={{ name: 'exercises' }} className="navlink">
              {t('navExercises')}
            </Link>
            <Link to={{ name: 'background' }} className="navlink">
              {t('navBackground')}
            </Link>
            <Link to={{ name: 'help' }} className="navlink navlink--help">
              {t('navHelp')}
            </Link>
            <Link to={{ name: 'about' }} className="navlink">
              {t('navAbout')}
            </Link>
          </nav>
          <div className="masthead__tools">
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main">{children}</main>

      <footer className="colophon no-print">
        <div className="container colophon__grid">
          <div>
            <h4>{t('appName')}</h4>
            <p style={{ maxWidth: '38ch' }}>{t('footerBlurb')}</p>
          </div>
          <div>
            <h4>{t('footerCrisis')}</h4>
            <p style={{ maxWidth: '34ch' }}>{t('footerCrisisText')}</p>
            <p>
              <Link to={{ name: 'help' }}>{t('navHelp')} →</Link>
            </p>
          </div>
          <div>
            <h4>{t('navHome')}</h4>
            <ul className="stack stack-sm">
              <li><Link to={{ name: 'session' }}>{t('navSession')}</Link></li>
              <li><Link to={{ name: 'daily' }}>{t('navDaily')}</Link></li>
              <li><Link to={{ name: 'exercises' }}>{t('navExercises')}</Link></li>
              <li><Link to={{ name: 'background' }}>{t('navBackground')}</Link></li>
              <li><Link to={{ name: 'about' }}>{t('navAbout')}</Link></li>
              <li>
                <a href="https://github.com/TechnikWeber/Innenkind" rel="noreferrer noopener" target="_blank">
                  {t('footerSource')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
