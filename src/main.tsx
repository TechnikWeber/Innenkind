import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { LangProvider } from './i18n';
import { AppProvider } from './state/app';
import { SessionProvider } from './state/session';

const container = document.getElementById('root');
if (!container) throw new Error('Wurzelelement #root nicht gefunden.');

createRoot(container).render(
  <StrictMode>
    <LangProvider>
      <AppProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </AppProvider>
    </LangProvider>
  </StrictMode>,
);
