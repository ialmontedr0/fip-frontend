import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

const updateSW = registerSW({
  onNeedRefresh() {
    const reload = window.confirm('Nueva versión disponible. ¿Recargar?')
    if (reload) updateSW(true)
  },
  onOfflineReady() {
    console.log('App lista para uso offline')
  },
})

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
const ENV = import.meta.env.VITE_SENTRY_ENVIRONMENT || 'development'

if (SENTRY_DSN && ENV === 'production') {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENV,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring (muestreo)
    tracesSampleRate: 0.2, // 20% de las transacciones
    replaysSessionSampleRate: 0.1, // 10 % de las sessiones
    replaysOnErrorSampleRate: 1.0, // 100% de sesiones con error

    // Ignorar errores conocidos
    ignoreErrors: [
      'ResizeObserver loop',
      'Network Error',
      'timeout',
    ]
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)