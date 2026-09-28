import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages liefert das Projekt unter /Innenkind/ aus.
// Für `vite dev` bleibt die Basis "/", damit lokale Links funktionieren.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Innenkind/' : '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Bibliotheken ändern sich seltener als die Seite. Die Inhalte bleiben
        // im Hauptbündel: `data/steps.ts` nutzt die Sitzungslogik, ein eigenes
        // Daten-Bündel ergäbe eine zirkuläre Abhängigkeit zwischen Bündeln.
        manualChunks: (id: string) => (id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
  },
}));
