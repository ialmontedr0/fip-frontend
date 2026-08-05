/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import VitePluginSitemap from 'vite-plugin-sitemap';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(),
  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
    manifest: {
      name: 'FIP - Financial Intelligence Platform',
      short_name: 'FIP',
      description: 'Plataforma personal de inteligencia financiera',
      theme_color: '#8b5cf6',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: '/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      navigateFallback: '/index.html',
      cleanupOutdatedCaches: true,
      maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
    },
  }),
  // Opcional: analisis de bundle
  visualizer({
    open: true,
    filename: 'dist/stats.html',
    gzipSize: true,
    brotliSize: true
  }), VitePluginSitemap({
    hostname: 'https://app.midominio.com',
    dynamicRoutes: ['/login', '/register', '/dashboard', '/accounts', '/transactions', '/categories', '/incomes', '/expenses', '/budgets', '/goals', '/cards', '/loans', '/analytics', '/ai', '/automations', '/notifications', '/settings'],
    exclude: ['/admin']
  }), sentryVitePlugin({
    org: 'mi-org-en-sentry',
    project: 'fip-frontend',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // en Vercel env vars
    telemetry: false
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // pon true si usas Sentry source maps

    // Vite 8 usa Rolldown (Rust) por defecto, config via rolldownOptions
    // Code splitting manual (Rolldown usa funcion, no objeto)
    // Nota: Rolldown ya hace code splitting optimo por defecto
    // Si necesitas chunks manuales, usa la sintaxis de funcion:
    // rolldownOptions: {
    //   output: {
    //     manualChunks(id: string) {
    //       if (id.includes('node_modules/react')) return 'vendor'
    //       if (id.includes('node_modules/framer-motion')) return 'vendor-ui'
    //       if (id.includes('node_modules/@tanstack')) return 'vendor-state'
    //       if (id.includes('node_modules/axios')) return 'vendor-utils'
    //     },
    //   },
    // },

    chunkSizeWarningLimit: 300,
    target: 'es2020',
    minify: 'oxc',
    // oxc es el default en Vite 8 (Rust-based, muy rapido)
    cssMinify: 'lightningcss',
    assetsInlineLimit: 4096,
    cssCodeSplit: true
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});