import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root,
  resolve: {
    alias: {
      // Point at source, not dist, so the playground hot-reloads against
      // freshly generated components without a package build.
      '@ghicons/react': fileURLToPath(new URL('../packages/react/src', import.meta.url)),
    },
  },
  plugins: [react()],
});
