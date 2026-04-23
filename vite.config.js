import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'CAT · DB — Suspect Database',
        short_name: 'CAT·DB',
        description: 'Spy-themed stuffed cat suspect database',
        theme_color: '#e8dfc9',
        background_color: '#e8dfc9',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '.',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
      },
    }),
  ],
});
