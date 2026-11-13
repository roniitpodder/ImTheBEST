import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  const localConfigPath = path.resolve(import.meta.dirname, 'firebase-applet-config.json');
  let localConfig: Record<string, string> = {};
  if (fs.existsSync(localConfigPath)) {
    try {
      localConfig = JSON.parse(fs.readFileSync(localConfigPath, 'utf-8'));
    } catch {
      localConfig = {};
    }
  }

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || localConfig.apiKey || '',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || localConfig.authDomain || '',
    projectId: env.VITE_FIREBASE_PROJECT_ID || localConfig.projectId || '',
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || localConfig.storageBucket || '',
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig.messagingSenderId || '',
    appId: env.VITE_FIREBASE_APP_ID || localConfig.appId || '',
    firestoreDatabaseId: env.VITE_FIREBASE_DATABASE_ID || localConfig.firestoreDatabaseId || '',
  };

  return {
    base: process.env.GITHUB_ACTIONS === 'true' ? '/ImTheBEST/' : '/',
    plugins: [react(), tailwindcss()],
    define: {
      __FIREBASE_CONFIG__: JSON.stringify(firebaseConfig),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
