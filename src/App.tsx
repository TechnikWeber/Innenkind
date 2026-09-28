import { useEffect } from 'react';
import { useI18n } from './i18n';
import { useApp } from './state/app';
import { exerciseById } from './data/exercises';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { SessionPage } from './components/SessionPage';
import { ResultPage } from './components/ResultPage';
import { DailyPage } from './components/DailyPage';
import { ExercisePage, ExercisesPage } from './components/ExercisesPage';
import { BackgroundPage } from './components/BackgroundPage';
import { HelpPage } from './components/HelpPage';
import { AboutPage } from './components/AboutPage';
import { PauseProvider } from './components/Pause';

/** Seitentitel passend zur Ansicht – wichtig für Verlauf und Vorlesen. */
function useDocumentTitle() {
  const { route } = useApp();
  const { t, lang } = useI18n();
  useEffect(() => {
    const suffix =
      route.name === 'home' ? t('tagline')
      : route.name === 'session' ? t('navSession')
      : route.name === 'result' ? t('resultTitle')
      : route.name === 'daily' ? t('navDaily')
      : route.name === 'exercises' ? t('navExercises')
      : route.name === 'exercise' ? exerciseById.get(route.id)?.title[lang] ?? t('navExercises')
      : route.name === 'background' ? t('navBackground')
      : route.name === 'help' ? t('navHelp')
      : t('navAbout');
    document.title = `${t('appName')} – ${suffix}`;
  }, [route, t, lang]);
}

export default function App() {
  const { route } = useApp();
  useDocumentTitle();

  return (
    <PauseProvider>
      <Layout>
        {route.name === 'home' && <HomePage />}
        {route.name === 'session' && <SessionPage />}
        {route.name === 'result' && <ResultPage />}
        {route.name === 'daily' && <DailyPage />}
        {route.name === 'exercises' && <ExercisesPage />}
        {route.name === 'exercise' && <ExercisePage id={route.id} />}
        {route.name === 'background' && <BackgroundPage />}
        {route.name === 'help' && <HelpPage />}
        {route.name === 'about' && <AboutPage />}
      </Layout>
    </PauseProvider>
  );
}
