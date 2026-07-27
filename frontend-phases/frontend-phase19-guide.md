# Fase 19: Produccion & Deploy

## Objetivos
- Configurar variables de entorno para prod
- Build optimizado (code splitting, tree shaking)
- Dockerizar frontend (opcional)
- Configurar CDN para assets estaticos
- SEO meta tags
- Analytics/Monitoring (Sentry for frontend)
- PWA support (opcional)
- Documentacion de deploy

## Entregables
- Frontend deployado en Vercel
- Monitoreo de errores con Sentry
- Documentacion de deploy

## Tecnologias y Stack Definitivo

| Componente | Tecnologia | Proveedor |
|------------|-----------|-----------|
| Frontend Hosting | Vercel | vercel.com |
| Backend Hosting | Railway con Docker | railway.app |
| Base de Datos | PostgreSQL | supabase.com |
| Cache y Colas | Redis | upstash.com |
| Almacenamiento Archivos | S3-compatible | Cloudflare R2 |
| Monitoreo Errores | Sentry | sentry.io |
| Dominio y DNS | Cloudflare | cloudflare.com |
| CI/CD | GitHub Actions | github.com |

---

## 1. Variables de Entorno

### Frontend (.env.production)

Crear `fip-frontend/.env.production`:

```env
# Backend API - En Railway usas la URL que te da el deploy
VITE_API_URL=https://api.tudominio.com/api/v1
# O si usas Railway:
# VITE_API_URL=https://fip-backend.up.railway.app/api/v1

# App
VITE_APP_NAME=FIP
VITE_APP_URL=https://app.tudominio.com
VITE_APP_DESCRIPTION="Financial Intelligence Platform - Gestion financiera personal inteligente"

# Sentry (crear proyecto en sentry.io, obtener DSN)
VITE_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/xxxxxx
VITE_SENTRY_ENVIRONMENT=production

# Segment/PostHog si usas analytics de usuarios
# VITE_ANALYTICS_KEY=xxx

# Feature flags
VITE_ENABLE_MOCK=false
VITE_ENABLE_DEBUG=false
```

### Backend (.env.production) - para referencia

```env
# En Railway configuras estas en el dashboard, no en .env
DATABASE_URL=postgresql+asyncpg://user:pass@host:6543/postgres
REDIS_URL=rediss://default:pass@us1-steady-unicorn-12345.upstash.io:6379
SECRET_KEY=genera-una-clave-segura-con-openssl
SENTRY_DSN=https://xxx@sentry.io/xxx
CORS_ORIGINS=https://app.tudominio.com
CLOUDFLARE_R2_ACCESS_KEY=xxx
CLOUDFLARE_R2_SECRET_KEY=xxx
CLOUDFLARE_R2_BUCKET=fip-uploads
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

---

## 2. Build Optimizado

### vite.config.ts optimizado para produccion

Reemplazar `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    // Opcional: analisis de bundle
    // visualizer({ open: true, filename: 'dist/stats.html', gzipSize: true, brotliSize: true }),
  ],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false, // pon true si usas Sentry source maps

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
    minify: 'oxc', // oxc es el default en Vite 8 (Rust-based, muy rapido)
    cssMinify: 'lightningcss',
    assetsInlineLimit: 4096,
    cssCodeSplit: true,
  },
})
```

> **Nota:** En Vite 8, `esbuild.drop` no se expone como config de build. Para eliminar `console.log` en prod, usa el plugin `vite-plugin-remove-console` o simplemente no los incluyas en codigo. El tree-shaking de Rolldown ya elimina codigo muerto automaticamente.

### tsconfig.json ajustes

Ya tienes `tsconfig.app.json` con `verbatimModuleSyntax: true`. Verifica que `tsconfig.json` tenga:

```json
{
  "compilerOptions": {
    "target": "es2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

### Bundle Analyzer (opcional, para debug)

```bash
pnpm add -D rollup-plugin-visualizer
```

En `vite.config.ts` (descomentar en plugins):

```ts
visualizer({
  open: true,
  filename: 'dist/stats.html',
  gzipSize: true,
  brotliSize: true,
})
```

Para analizar:
```bash
pnpm build && start dist/stats.html
```

---

## 3. SEO

### index.html completo

Reemplazar `index.html`:

```html
<!doctype html>
<html lang="es-MX" prefix="og: https://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Primary Meta Tags -->
    <title>FIP - Financial Intelligence Platform</title>
    <meta name="title" content="FIP - Financial Intelligence Platform" />
    <meta
      name="description"
      content="Financial Intelligence Platform - Gestion financiera personal inteligente con IA, presupuestos, metas y analiticas avanzadas"
    />
    <meta name="keywords" content="finanzas personales, presupuesto, ahorro, inversiones, IA financiera" />
    <meta name="author" content="FIP" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#7c3aed" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://app.tudominio.com/" />
    <meta property="og:title" content="FIP - Financial Intelligence Platform" />
    <meta
      property="og:description"
      content="Gestion financiera personal inteligente con IA, presupuestos, metas y analiticas avanzadas"
    />
    <meta property="og:image" content="https://app.tudominio.com/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://app.tudominio.com/" />
    <meta property="twitter:title" content="FIP - Financial Intelligence Platform" />
    <meta
      property="twitter:description"
      content="Gestion financiera personal inteligente con IA, presupuestos, metas y analiticas avanzadas"
    />
    <meta property="twitter:image" content="https://app.tudominio.com/og-image.png" />

    <!-- Icons -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Preconnect to API -->
    <link rel="preconnect" href="https://api.tudominio.com" />
    <link rel="dns-prefetch" href="https://api.tudominio.com" />

    <!-- Fonts (opcional) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

    <!-- Script -->
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root"></div>
    <!-- Noscript fallback -->
    <noscript>
      <div style="text-align:center;padding:2rem;font-family:sans-serif">
        <h1>FIP - Financial Intelligence Platform</h1>
        <p>Habilita JavaScript para usar la aplicacion.</p>
      </div>
    </noscript>
  </body>
</html>
```

### SEOHead mejorado

Ya tienes `SEOHead.tsx` de Phase 18. Asegurate que tenga open graph y twitter tags:

```tsx
import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description?: string
  ogImage?: string
  noIndex?: boolean
}

const SITE_NAME = 'FIP - Financial Intelligence Platform'
const DEFAULT_DESCRIPTION =
  'Financial Intelligence Platform - Gestion financiera personal inteligente'
const DEFAULT_OG_IMAGE = 'https://app.tudominio.com/og-image.png'

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: SEOHeadProps) {
  const fullTitle = `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  )
}
```

### Assets SEO necesarios

Crear en `public/`:

| Archivo | Proposito | Como generarlo |
|---------|-----------|----------------|
| `favicon.svg` | Icono principal SVG | Disena un icono simple o usa https://realfavicongenerator.net |
| `favicon-32x32.png` | 32px favicon | Desde el mismo generador |
| `favicon-16x16.png` | 16px favicon | Desde el mismo generador |
| `apple-touch-icon.png` | 180px iOS icon | Desde el mismo generador |
| `og-image.png` | 1200x630 Open Graph | Disena en Figma o Canva con logo + nombre |
| `site.webmanifest` | PWA manifest | Ver seccion PWA abajo |
| `robots.txt` | SEO crawlers | Ver abajo |

**robots.txt**:
```txt
User-agent: *
Allow: /
Sitemap: https://app.tudominio.com/sitemap.xml
```

Para `sitemap.xml`, puedes generarlo con una herramienta como `vite-plugin-sitemap` o manualmente:

```bash
pnpm add -D vite-plugin-sitemap
```

En `vite.config.ts`:
```ts
import { VitePluginSitemap } from 'vite-plugin-sitemap'

// En plugins:
VitePluginSitemap({
  hostname: 'https://app.tudominio.com',
  dynamicRoutes: [
    '/login', '/register',
    '/dashboard', '/accounts', '/transactions',
    '/categories', '/incomes', '/expenses',
    '/budgets', '/goals', '/cards', '/loans',
    '/analytics', '/ai', '/automations',
    '/notifications', '/settings',
  ],
  exclude: ['/admin/*'],
})
```

---

## 4. Sentry (Monitoreo de Errores)

### Instalacion

```bash
pnpm add @sentry/react @sentry/vite-plugin
pnpm add -D @sentry/vite-plugin
```

### Configuracion en main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import App from './App'
import './index.css'

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
    replaysSessionSampleRate: 0.1, // 10% de sesiones
    replaysOnErrorSampleRate: 1.0, // 100% de sesiones con error

    // Ignorar errores conocidos
    ignoreErrors: [
      'ResizeObserver loop',
      'Network Error',
      'timeout',
    ],
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### ErrorBoundary con Sentry

Crear o modificar `src/components/layout/ErrorBoundary.tsx`:

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react'
import * as Sentry from '@sentry/react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  feature?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.withScope((scope) => {
      scope.setTag('feature', this.props.feature || 'unknown')
      scope.setExtras({ componentStack: errorInfo.componentStack })
      Sentry.captureException(error)
    })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Algo salio mal
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            Ocurrio un error inesperado en {this.props.feature || 'esta seccion'}.
            Nuestro equipo ha sido notificado.
          </p>
          <button
            onClick={this.handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Intentar de nuevo
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Source Maps en Vercel (para errores legibles)

Para que Sentry pueda leer los source maps en produccion, necesitas subirlos. Configura `vite.config.ts`:

```ts
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  build: {
    sourcemap: true, // necesario para Sentry
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'tu-org-en-sentry',
      project: 'fip-frontend',
      authToken: process.env.SENTRY_AUTH_TOKEN, // en Vercel env vars
      telemetry: false,
    }),
    // NOTA: sourcemap:true en build + sentryVitePlugin sube los maps
    // Luego de subirlos, puedes borrar los .map files o no servirlos
  ],
})
```

Luego en `vercel.json` o en la config de Vercel, asegurate de NO servir los `.map` files:
```json
{
  "headers": [
    {
      "source": "/(.*).js.map$",
      "headers": [
        { "key": "Content-Type", "value": "application/json" },
        { "key": "X-Robots-Tag", "value": "noindex" }
      ]
    }
  ]
}
```

---

## 5. Vercel Deployment

### vercel.json

Crear `fip-frontend/vercel.json`:

```json
{
  "name": "fip-frontend",
  "framework": "vite",
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install --frozen-lockfile",
  "regions": ["gru1"],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).(svg|png|jpg|jpeg|gif|webp|ico|woff2)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*).(js|css)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ],
  "redirects": [
    { "source": "/login", "destination": "/login", "permanent": true },
    { "source": "/register", "destination": "/register", "permanent": true }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Pasos para deploy en Vercel:

1. **Conecta tu repo de GitHub**:
   - Ve a https://vercel.com/new
   - Importa tu repositorio de GitHub
   - Selecciona `fip-frontend` como directorio raiz

2. **Configura variables de entorno en Vercel**:
   ```
   VITE_API_URL=https://api.tudominio.com/api/v1 (o railway URL)
   VITE_APP_NAME=FIP
   VITE_APP_URL=https://app.tudominio.com
   VITE_APP_DESCRIPTION="Financial Intelligence Platform"
   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
   VITE_SENTRY_ENVIRONMENT=production
   VITE_ENABLE_MOCK=false
   VITE_ENABLE_DEBUG=false
   SENTRY_AUTH_TOKEN=xxx (para source maps)
   ```

3. **Configura dominio custom** (opcional):
   - En Vercel: Project > Settings > Domains
   - Agrega `app.tudominio.com`
   - Sigue las instrucciones de DNS en Cloudflare

4. **Deploy automatico**:
   - Cada push a `main` o `master` hace deploy automatico
   - Puedes configurar Preview Deployments para PRs

---

## 6. Docker (Opcional - para Railway o cualquier VPS)

### Dockerfile

Crear `fip-frontend/Dockerfile`:

```dockerfile
# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
ARG VITE_API_URL
ARG VITE_SENTRY_DSN
ARG VITE_SENTRY_ENVIRONMENT
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ENV VITE_SENTRY_ENVIRONMENT=$VITE_SENTRY_ENVIRONMENT

RUN pnpm build

# ---- Production Stage ----
FROM nginx:alpine AS production

# Copiar build output
COPY --from=build /app/dist /usr/share/nginx/html

# Configuracion nginx para SPA + gzip + cache
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Crear `fip-frontend/nginx.conf`:

```nginx
events {
  worker_connections 1024;
}

http {
  include mime.types;
  default_type application/octet-stream;

  # Gzip
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
  gzip_comp_level 6;
  gzip_min_length 256;
  gzip_vary on;

  # Cache
  map $sent_http_content_type $expires {
    default                    off;
    ~*text/html                 epoch;
    ~*text/css                  max;
    ~*application/javascript    max;
    ~*image/                    max;
    ~*font/                     max;
    ~*application/font-woff2   max;
  }

  server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    expires $expires;

    # Seguridad
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' https://api.tudominio.com https://o*.ingest.sentry.io; font-src 'self';" always;

    # SPA: todas las rutas al index.html
    location / {
      try_files $uri $uri/ /index.html;
      add_header Cache-Control "no-cache, must-revalidate";
    }

    # Assets estaticos con cache largo
    location /assets/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      access_log off;
    }

    # No mostrar version de nginx
    server_tokens off;
  }
}
```

### .dockerignore

```dockerignore
node_modules
dist
.git
.gitignore
*.md
.env
.env.local
.env.*.local
```

### Construir y probar localmente

```bash
docker build -t fip-frontend \
  --build-arg VITE_API_URL=http://localhost:8080/api/v1 \
  --build-arg VITE_SENTRY_DSN= \
  --build-arg VITE_SENTRY_ENVIRONMENT=development \
  .

docker run -p 3000:80 fip-frontend
# Abre http://localhost:3000
```

---

## 7. PWA (Progressive Web App) - Opcional

PWA permite que los usuarios instalen FIP como una app nativa en su telefono/computadora, con acceso offline parcial y carga instantanea.

### 7.1 Instalar dependencia

```bash
pnpm add vite-plugin-pwa
```

### 7.2 Generar los iconos PWA

Necesitas 2 iconos adicionales en `public/`:

| Archivo | Tamanio | Donde obtenerlo |
|---------|---------|-----------------|
| `public/pwa-192x192.png` | 192x192px | Usa https://realfavicongenerator.net o disena en Figma/Canva |
| `public/pwa-512x512.png` | 512x512px | Misma fuente, con `purpose: any maskable` |

Recomendacion: usa el mismo logo de FIP (un icono de escudo/finanzas en fondo violeta `#7c3aed`).

### 7.3 Modificar vite.config.ts

Agrega el plugin `VitePWA` al array de `plugins`:

```ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',           // Actualiza el SW automaticamente cuando hay cambios
      includeAssets: [                       // Assets que se precachean siempre
        'favicon.svg',
        'favicon-32x32.png',
        'favicon-16x16.png',
        'apple-touch-icon.png',
      ],
      manifest: {
        name: 'FIP - Financial Intelligence Platform',   // Nombre completo
        short_name: 'FIP',                                // Nombre corto (icono)
        description: 'Gestion financiera personal inteligente',
        theme_color: '#7c3aed',                           // Color de la barra de navegacion
        background_color: '#ffffff',                      // Color de splash screen
        display: 'standalone',                            // standalone = se ve como app nativa
        orientation: 'portrait-primary',                  // Forzar orientacion vertical
        scope: '/',                                       // Alcance del service worker
        start_url: '/',                                   // Pagina de inicio al abrir la app
        icons: [
          { src: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
          { src: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
          { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',   // Permite que el SO recorte el icono con mascara
          },
        ],
      },
      workbox: {
        // Que archivos precachear al instalar la PWA
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Estrategia de cache para llamadas API
        runtimeCaching: [
          {
            // Cachea respuestas de la API con estrategia NetworkFirst
            urlPattern: /^https:\/\/api\.tudominio\.com\/api\/v1\/.*/i,
            handler: 'NetworkFirst',     // Intenta red primero, si falla usa cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,         // Max 100 respuestas en cache
                maxAgeSeconds: 60 * 60,  // Expiran en 1 hora
              },
              networkTimeoutSeconds: 10, // Timeout de red de 10s antes de usar cache
            },
          },
        ],
      },
    }),
  ],
})
```

### 7.4 Verificar que funciona

1. Ejecuta `pnpm build`
2. Despues del build, verifica que se generaron:
   - `dist/sw.js` (service worker)
   - `dist/workbox-*.js` (libreria Workbox)
   - `dist/manifest.webmanifest` (manifest de la app)
3. Sirve los archivos con `pnpm preview`
4. Abre Chrome DevTools > Application > Manifest
   - Verifica que aparece el manifest con todos los datos
5. En Application > Service Workers
   - Verifica que el SW esta registrado y activo
6. Haz clic en el icono de instalacion en la barra de direcciones (lado derecho)
   - Debe aparecer "Install FIP"

### 7.5 Que hace cada pieza

| Concepto | Que hace |
|----------|----------|
| `registerType: 'autoUpdate'` | Cuando subes una nueva version, la app se actualiza automaticamente sin molestar al usuario |
| `display: 'standalone'` | La app se abre sin la barra de direcciones del navegador, como una app nativa |
| `start_url: '/'` | Al abrir la app instalada, va al dashboard |
| `globPatterns` | Define que archivos se descargan al instalar la app (todo el build) |
| `runtimeCaching` | Define como cachear llamadas API cuando no hay internet |
| `NetworkFirst` | Prioriza red, pero si no hay conexion usa los datos en cache |
| `theme_color` | Controla el color de la barra de herramientas del navegador en mobile |
| `maskable` | Permite que el icono se adapte a mascaras circulares/cuadradas del SO |

### 7.6 Probar en produccion (despues del deploy)

1. Abre `https://app.tudominio.com` en Chrome mobile
2. Espera unos segundos a que se registre el service worker
3. Deberia aparecer un banner "Install FIP" o un icono en la barra de direcciones
4. Toca "Install" y la app se anade a la pantalla de inicio
5. Abre la app desde la pantalla de inicio — debe abrirse sin la UI del navegador
6. Prueba offline: desconecta internet y recarga — debe mostrar el shell de la app

---

## 8. CDN para Assets Estaticos

Cuando deployas en Vercel, los assets (JS, CSS, imagenes) ya se sirven desde su CDN global automaticamente. No necesitas configurar nada extra. Pero si usas Cloudflare como DNS, puedes optimizar aun mas.

### 8.1 Vercel + Cloudflare Proxy (Recomendado)

Paso a paso en Cloudflare Dashboard:

1. Ve a tu dominio en Cloudflare > DNS > Records
2. Agrega un registro **CNAME**:
   - **Name**: `app`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: Orange cloud (activado)
3. Ve a **SSL/TLS** > Overview:
   - Cambia a **Full (strict)**
4. Ve a **SSL/TLS** > Edge Certificates:
   - **Always Use HTTPS**: ON
   - **Automatic HTTPS Rewrites**: ON
5. Ve a **Speed** > Optimization:
   - **Auto Minify**: HTML, CSS, JS (todo ON)
   - **Brotli**: ON
   - **Rocket Loader**: OFF (rompe React)
   - **Polish**: ON (comprime imagenes)

Resultado: CDN de Cloudflare cachea y sirve tu frontend desde 330+ ubicaciones globales.

### 8.2 Assets desde R2 (mas avanzado, no necesario)

Si prefieres servir assets desde Cloudflare R2 en vez de Vercel:

1. Crea un bucket R2 en Cloudflare
2. Conecta un dominio custom al bucket (R2 > tu bucket > Settings > Public URL > Connect custom domain)
3. Configura R2 como origen en Cloudflare Cache

No implementes esto a menos que tengas razones especificas (alto trafico global). Vercel CDN es suficiente.

### Opcion 1: Vercel + Cloudflare Proxy (Recomendado)

1. En Cloudflare Dashboard > tu dominio > DNS:
   - Crea un registro CNAME de `app` apuntando a `cname.vercel-dns.com`
   - Activa el proxy naranja (CDN de Cloudflare)

2. En Cloudflare > SSL/TLS:
   - Modo: Full (strict)
   - Activa Always Use HTTPS
   - Activa Automatic HTTPS Rewrites

3. En Cloudflare > Speed > Optimization:
   - Activa Auto Minify (HTML, CSS, JS)
   - Activa Brotli
   - Activa Rocket Loader (opcional, puede romper cosas)
   - Activa Polish (optimizacion de imagenes)

### Opcion 2: Assets en R2 (Cloudflare)

Si quieres servir assets desde R2:

```ts
// vite.config.ts
export default defineConfig({
  base: 'https://cdn.tudominio.com/', // Tu dominio R2 custom
  build: {
    assetsDir: 'fip-assets',
  },
})
```

Luego en GitHub Actions, despues del build:
```yaml
- name: Upload to R2
  uses: shallwefootball/s3-upload-action@v1
  with:
    aws_access_key_id: ${{ secrets.R2_ACCESS_KEY }}
    aws_secret_access_key: ${{ secrets.R2_SECRET_KEY }}
    aws_bucket: fip-assets
    aws_endpoint: https://xxx.r2.cloudflarestorage.com
    source_dir: dist
    destination_dir: ./
```

---

## 9. CI/CD con GitHub Actions

### 9.1 Donde crear el archivo

Crea la carpeta y archivo en la raiz del repositorio:

```
fip/
  .github/
    workflows/
      deploy-frontend.yml   <-- aqui
```

Ruta completa: `C:\Users\Tony\Documents\fip\.github\workflows\deploy-frontend.yml`

**IMPORTANTE**: Esta fuera de `fip-frontend/`, esta en la raiz del repositorio `fip/`.

### 9.2 Contenido del archivo

```yaml
name: Deploy Frontend

on:
  push:
    branches: [main, master]
    paths:
      - 'fip-frontend/**'
      - '.github/workflows/deploy-frontend.yml'
  pull_request:
    branches: [main, master]
    paths:
      - 'fip-frontend/**'

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./fip-frontend

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: './fip-frontend/pnpm-lock.yaml'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Lint
        run: pnpm lint

      - name: Build (pre-check)
        run: pnpm build

  deploy:
    needs: lint-and-typecheck
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/master'
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./fip-frontend

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
          cache-dependency-path: './fip-frontend/pnpm-lock.yaml'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          VITE_API_URL: ${{ vars.VITE_API_URL }}
          VITE_APP_NAME: ${{ vars.VITE_APP_NAME }}
          VITE_APP_URL: ${{ vars.VITE_APP_URL }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_SENTRY_ENVIRONMENT: production
          VITE_ENABLE_MOCK: 'false'
          VITE_ENABLE_DEBUG: 'false'
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./fip-frontend
```

### 9.3 Como generar cada GitHub Secret

Antes de pushear el archivo YAML, necesitas crear estos **secrets** en GitHub.

Donde: GitHub.com > tu repo > Settings > Secrets and variables > Actions > Secrets > "New repository secret"

| Secret | De donde se obtiene |
|--------|---------------------|
| `VERCEL_TOKEN` | Ve a vercel.com > Account > Settings > Tokens > Create token (nombre: `github-actions`, scope: full) |
| `VERCEL_ORG_ID` | Ve a vercel.com > Project > Settings > General > Project ID (anota el **Team ID** de la URL: `vercel.com/[team-id]/...`) |
| `VERCEL_PROJECT_ID` | Ve a vercel.com > Project > Settings > General > Project ID |
| `VITE_SENTRY_DSN` | Ve a sentry.io > Project > Settings > Client Keys (DSN) |
| `SENTRY_AUTH_TOKEN` | Ve a sentry.io > Settings > Auth Tokens > Create New Token (scopes: `project:releases`, `project:write`) |
| `RAILWAY_TOKEN` | Ve a railway.app > Account > Tokens > New Token |

**Variables** (no secrets, van en Variables section):

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://fip-backend.up.railway.app/api/v1` (o tu dominio API) |
| `VITE_APP_NAME` | `FIP` |
| `VITE_APP_URL` | `https://app.tudominio.com` (o `https://fip-frontend.vercel.app` si aun no tienes dominio) |

### 9.4 Como probar CI/CD

1. Crea el archivo `.github/workflows/deploy-frontend.yml`
2. Crea los 6 secrets en GitHub
3. Crea las 3 variables en GitHub
4. Haz commit y push a `main`:
   ```bash
   git add .github/workflows/deploy-frontend.yml
   git commit -m "ci: add frontend deploy workflow"
   git push origin main
   ```
5. Ve a GitHub.com > tu repo > Actions
6. Debes ver el workflow corriendo: "Deploy Frontend"
7. Si todo sale bien, la primera vez deploya a Vercel automaticamente

### 9.5 Workflow para Backend (Railway, opcional)

```yaml
name: Deploy Backend

on:
  push:
    branches: [main, master]
    paths:
      - 'fip-backend/**'
      - '.github/workflows/deploy-backend.yml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: fip-backend
          directory: ./fip-backend
```

---

## 10. Dominio y DNS (Cloudflare)

### 10.1 Requisitos previos

1. Tener un dominio (ej: `tudominio.com`) registrado en cualquier proveedor (Namecheap, GoDaddy, etc.)
2. Tener cuenta gratuita en Cloudflare
3. Tener el frontend deployado en Vercel (aunque sea en la URL `*.vercel.app`)

### 10.2 Paso a paso para conectar dominio a Cloudflare

**Paso 1**: Agregar dominio a Cloudflare
1. Ve a cloudflare.com > Add a Site
2. Ingresa `tudominio.com`
3. Selecciona plan **Free**
4. Cloudflare escanea los registros DNS existentes

**Paso 2**: Configurar nameservers
1. Cloudflare te mostrara 2 nameservers (ej: `ns1.cloudflare.com`, `ns2.cloudflare.com`)
2. Ve a tu proveedor de dominio (donde compraste el dominio)
3. Cambia los nameservers a los de Cloudflare
4. Espera 5-30 minutos a que se propaguen

**Paso 3**: Agregar registros DNS en Cloudflare
Ve a Cloudflare > tu dominio > DNS > Records y agrega:
```
# Frontend (Vercel)
Tipo: CNAME
Name: app
Target: cname.vercel-dns.com
Proxy: Orange cloud (activado)

# Backend (Railway)
Tipo: CNAME
Name: api
Target: fip-backend.up.railway.app
Proxy: Orange cloud (activado)
```

**Paso 4**: Conectar dominio a Vercel
1. Ve a vercel.com > Project > Settings > Domains
2. Ingresa `app.tudominio.com`
3. Vercel verifica el CNAME automaticamente (tarda 1-2 min)
4. Si no lo detecta, espera 5 min y refresh

**Paso 5**: Configurar SSL en Cloudflare
1. Cloudflare > tu dominio > SSL/TLS > Overview
2. Selecciona **Full (strict)**
3. SSL/TLS > Edge Certificates:
   - **Always Use HTTPS**: ON
   - **Automatic HTTPS Rewrites**: ON
   - **Minimum TLS Version**: 1.2

**Paso 6**: Optimizaciones recomendadas

| Seccion | Opcion | Valor |
|---------|--------|-------|
| Speed > Optimization | Auto Minify | HTML, CSS, JS (todo ON) |
| Speed > Optimization | Brotli | ON |
| Speed > Optimization | Rocket Loader | OFF |
| Speed > Optimization | Polish | ON |
| Speed > Optimization | HTTP/2 | ON |
| Speed > Optimization | HTTP/3 (QUIC) | ON |
| Security > Settings | Browser Integrity Check | ON |
| Security > Settings | Bot Fight Mode | ON |
| Security > WAF | Core Rules | ON |
| Security > Rate Limiting | Create rule | Proteger /api |

### 10.3 Estructura DNS final

```
tudominio.com
  ├── app.tudominio.com  -> Vercel (frontend)
  └── api.tudominio.com  -> Railway (backend)
```

### 10.4 Probar que el dominio funciona

```bash
# El frontend debe responder
curl -I https://app.tudominio.com
# Debe devolver: HTTP/2 200 y headers de Vercel

# El API debe responder
curl https://api.tudominio.com/health/readiness
# Debe devolver: {"status": "ready"}
```

---

## 11. Health Check Endpoints (Backend)

El backend FastAPI expone 3 endpoints de health check. No requieren autenticacion:

| Endpoint | Que verifica | Uso |
|----------|-------------|-----|
| `GET /health` | App, DB, Redis, disco, memoria | Monitoreo general |
| `GET /health/readiness` | App lista para trafico | Orquestadores (K8s, Railway) |
| `GET /health/liveness` | App viva | Orquestadores |

### Probar localmente

```bash
curl http://localhost:8080/health
# {"status":"healthy","version":"1.0.0","uptime_seconds":1234,...}

curl http://localhost:8080/health/readiness
# {"status":"ready"}

curl http://localhost:8080/health/liveness
# {"status":"alive"}
```

### Hook opcional para admin dashboard

Si quieres mostrar estado del backend en el panel admin, crea:

`fip-frontend/src/features/admin/hooks/useHealthCheck.ts`:

```tsx
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface HealthStatus {
  status: 'healthy' | 'degraded'
  version: string
  uptime_seconds: number
  timestamp: string
  checks: {
    database: { status: string; error?: string }
    redis: { status: string; error?: string }
    disk: { free_gb: number; status: string }
    memory: { total_gb: number; available_gb: number; percent_used: number; status: string }
  }
}

export function useHealthCheck() {
  return useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then((r) => r.data),
    refetchInterval: 30_000,
  })
}
```

---

## 12. Checklist de Seguridad para Produccion

### Como completar cada punto

| # | Item | Como verificarlo/completarlo |
|---|------|------------------------------|
| 1 | `CORS_ORIGINS` configurado | En Railway dashboard > Variables: `CORS_ORIGINS=https://app.tudominio.com` (solo tu frontend, no `*`) |
| 2 | `SECRET_KEY` segura | Genera con: `openssl rand -hex 32` en terminal. Pon el resultado en Railway dashboard |
| 3 | HTTPS activado | Vercel lo da gratis, Railway da URL HTTPS, Cloudflare lo fuerza. Verifica: la URL empieza con `https://` |
| 4 | Rate limiting activado | Ya esta en el middleware del backend. Verifica en `backend/app/middleware/rate_limit.py` linea 24 excluye health endpoints |
| 5 | CSP Headers | En `vercel.json` ya estan definidos (seccion 5). Si usas nginx/Docker, estan en el `nginx.conf` |
| 6 | Sin secretos hardcodeados | Busca en el codigo: `grep -r "password\|secret\|key\|token" src/ --include="*.ts" --include="*.tsx"` - no debe haber valores hardcodeados |
| 7 | JWT con expiracion corta | Verifica en backend `settings.py` que `ACCESS_TOKEN_EXPIRE_MINUTES = 15` (o similar) y refresh token rotado |
| 8 | Sentry sin datos sensibles | En `main.tsx` ya tienes `maskAllText: true` y `blockAllMedia: true` |
| 9 | console.log eliminados | En build, Rolldown/Oxc tree-shaking los elimina. Verifica: el build no debe contener `console.log` |
| 10 | Source maps no publicos | `build.sourcemap: false` en vite.config.ts (true solo si usas Sentry source maps con subida automatica) |
| 11 | robots.txt | Creado en `public/robots.txt` con `Allow: /` |
| 12 | sitemap.xml | Generado con `vite-plugin-sitemap` o manual en `public/sitemap.xml` |

### Comandos de verificacion

```bash
# Verificar HTTPS
curl -I https://app.tudominio.com | findstr "strict-transport-security"

# Verificar CSP headers
curl -I https://app.tudominio.com | findstr "content-security-policy"

# Verificar que no hay secretos en el codigo
cd fip-frontend
pnpx secretlint "src/**/*" 2>$null || Write-Output "No se encontraron secretos"

# Verificar build no contiene console.log
pnpm build
Select-String -Path "dist\assets\*.js" -Pattern "console\.log" | Measure-Object | % { if ($_.Count -gt 0) { Write-Output "ALERTA: console.log en build!" } else { Write-Output "OK: sin console.log" } }
```

---

## 13. Post-Deploy Verification

### Verificar backend

```bash
curl https://api.tudominio.com/health
# Respuesta esperada: status "healthy" o "degraded" (si Redis no esta configurado)

curl https://api.tudominio.com/health/readiness
# {"status":"ready"}
```

### Verificar frontend

```bash
curl -L https://app.tudominio.com
# Debe devolver HTML del index.html (contenido de React)

curl -I https://app.tudominio.com
# Buscar: x-robots-tag, content-security-policy, x-frame-options

curl -I https://app.tudominio.com/assets/index-*.js
# Debe devolver: Cache-Control: public, max-age=31536000, immutable
```

### Verificar desde el navegador

- Abre `https://app.tudominio.com` - debe cargar el login
- Inicia sesion y navega a dashboard, accounts, transactions
- Chrome DevTools > Lighthouse > Generate report
- Targets: Performance >90, Accessibility >90, Best Practices >90, SEO >90

### Probar Sentry

```js
// En consola del navegador en produccion:
throw new Error('Sentry test error - FIP deploy verification')
```

Ve a sentry.io > Issues - debe aparecer el error en 1-2 min con environment=production.

### Probar CI/CD

1. Haz un cambio pequeno (ej: cambiar un color)
2. Commit y push a main
3. Ve a GitHub Actions - debe correr el workflow
4. Ve a Vercel - debe mostrar nuevo deploy
5. Recarga el sitio - debe mostrar el cambio

---

## 14. Estrategia de Deploy Gradual

Orden recomendado para hacer cada cosa, sin saltos:

### Paso 1: Preparacion (30 min)

1. Crea cuenta en **Vercel** (gratis): https://vercel.com/signup (conecta con GitHub, no crees proyecto aun)
2. Crea cuenta en **Sentry** (gratis): https://sentry.io/signup/ (crea organizacion `fip`, proyecto "React", guarda el DSN)
3. Crea cuenta en **Cloudflare** (gratis): https://dash.cloudflare.com/signup (agrega tu dominio, cambia nameservers)
4. Si no tienes dominio, puedes saltar Cloudflare y usar la URL `*.vercel.app` temporalmente

### Paso 2: Preparar el codigo (1 hora)

```bash
cd fip-frontend

# Instalar dependencias
pnpm add @sentry/react @sentry/vite-plugin
pnpm add -D @sentry/vite-plugin vite-plugin-sitemap

# Crear assets SEO:
# - public/favicon.svg (descarga o crea uno)
# - public/og-image.png (1200x630px, disena en Canva)
# - public/robots.txt (copiar de la guia)
```

Modificar archivos en este orden:
1. `index.html` - reemplazar con el de la guia (meta tags, OG, fonts)
2. `vite.config.ts` - build optimizado
3. `src/main.tsx` - agregar Sentry init
4. `src/components/layout/ErrorBoundary.tsx` - agregar Sentry captureException
5. `src/components/ui/SEOHead.tsx` - agregar OG/Twitter tags
6. Crear `vercel.json`
7. Crear `public/robots.txt`

```bash
pnpm build  # verificar que compila sin errores
```

### Paso 3: Deploy a Vercel (15 min)

1. Ve a https://vercel.com/new
2. Importa tu repositorio de GitHub
3. Selecciona `fip-frontend` como directorio raiz
4. Framework: Vite
5. Build command: `pnpm build`
6. Output directory: `dist`
7. Environment Variables (agregar todas):

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://api.tudominio.com/api/v1` |
| `VITE_APP_NAME` | `FIP` |
| `VITE_APP_URL` | `https://app.tudominio.com` |
| `VITE_APP_DESCRIPTION` | `Financial Intelligence Platform` |
| `VITE_SENTRY_DSN` | `https://xxx@sentry.io/xxx` |
| `VITE_SENTRY_ENVIRONMENT` | `production` |
| `VITE_ENABLE_MOCK` | `false` |
| `VITE_ENABLE_DEBUG` | `false` |

8. Haz clic en **Deploy**
9. Espera 2-3 min, abre la URL que Vercel te da (ej: `fip-frontend.vercel.app`)

### Paso 4: Configurar Sentry (10 min)

1. sentry.io > Project > Settings > copia el DSN
2. Agregalo como env var en Vercel si no lo hiciste
3. Forza un error en produccion: abre la URL de Vercel, consola: `throw new Error('Sentry test')`
4. Verifica en Sentry que aparece el error

### Paso 5: Dominio custom con Cloudflare (20 min)

Solo si tienes dominio:

1. Cloudflare > DNS > Add record: `app` CNAME `cname.vercel-dns.com` (orange cloud)
2. Cloudflare > DNS > Add record: `api` CNAME `fip-backend.up.railway.app` (orange cloud)
3. Vercel > Project > Settings > Domains > Add: `app.tudominio.com`
4. Espera 1-2 min, Vercel muestra "Valid configuration"
5. Cloudflare > SSL/TLS > Full (strict)
6. Prueba: `curl -I https://app.tudominio.com`
7. Actualiza env vars en Vercel: `VITE_API_URL=https://api.tudominio.com/api/v1`, `VITE_APP_URL=https://app.tudominio.com`
8. Redeploy en Vercel

### Paso 6: CI/CD con GitHub Actions (15 min)

1. Crea `.github/workflows/deploy-frontend.yml` con el contenido de la seccion 9
2. Crea los 6 secrets en GitHub (ver seccion 9.3)
3. Crea las 3 variables en GitHub (ver seccion 9.3)
4. Commit y push:
   ```bash
   git add .github/
   git commit -m "ci: add frontend deploy workflow"
   git push origin main
   ```
5. Ve a GitHub > Actions y verifica que corre
6. A partir de ahora, cada push a main deploya automaticamente

### Paso 7: Post-deploy audit (15 min)

Ejecuta los comandos de verificacion de la seccion 13. Corre Lighthouse audit y corrige problemas.

---

## 15. Resumen de Archivos a Crear/Modificar

### Nuevos archivos (crear):

| Archivo | Donde crearlo | Proposito |
|---------|--------------|-----------|
| `.env.production` | `fip-frontend/.env.production` | Variables de entorno para produccion |
| `vercel.json` | `fip-frontend/vercel.json` | Configuracion de Vercel (headers, rewrites) |
| `robots.txt` | `fip-frontend/public/robots.txt` | Instrucciones para crawlers de buscadores |
| `favicon.svg` | `fip-frontend/public/favicon.svg` | Icono principal SVG |
| `favicon-32x32.png` | `fip-frontend/public/favicon-32x32.png` | Icono 32px |
| `favicon-16x16.png` | `fip-frontend/public/favicon-16x16.png` | Icono 16px |
| `apple-touch-icon.png` | `fip-frontend/public/apple-touch-icon.png` | Icono iOS (180x180) |
| `og-image.png` | `fip-frontend/public/og-image.png` | Imagen Open Graph (1200x630) |
| `deploy-frontend.yml` | `.github/workflows/deploy-frontend.yml` | GitHub Actions para deploy automatico |

### Archivos a modificar (editar):

| Archivo | Que cambiar |
|---------|-------------|
| `vite.config.ts` | Agregar build optimizado (output, chunkSize, sourcemap) |
| `src/main.tsx` | Agregar inicializacion de Sentry |
| `src/components/layout/ErrorBoundary.tsx` | Agregar Sentry.captureException(error) |
| `src/components/ui/SEOHead.tsx` | Agregar Open Graph y Twitter meta tags |
| `index.html` | Reemplazar con version completa (meta tags SEO, OG, Twitter Cards, preconnect) |

### Archivos opcionales (solo si los necesitas):

| Archivo | Cuando usarlo |
|---------|---------------|
| `Dockerfile` | Si deployas en Railway/VPS en vez de Vercel |
| `nginx.conf` | Si usas Docker con nginx |
| `.dockerignore` | Si usas Docker |
| `site.webmanifest` | Si implementas PWA |
| `deploy-backend.yml` | Si quieres CI/CD para el backend en Railway |

---

## 16. Pricing - Cuanto cuesta cada servicio

Todos los servicios tienen plan gratuito suficiente para empezar:

| Servicio | Plan Gratis | Plan de Pago (cuando crezcas) |
|----------|-------------|-------------------------------|
| **Vercel** | Hosting, SSL, CDN, 100GB ancho de banda/mes, builds ilimitados | $20/mes (Pro) para equipo, mas ancho de banda |
| **Railway** | $5 credito unico, $0.0003/hora | $5/mes (Developer) con $5 de credito extra |
| **Supabase** | 500MB DB, 2GB bandwidth, 50,000 rows | $25/mes (Pro) |
| **Upstash Redis** | 10,000 comandos/dia, 256MB | $0.20/mes por GB adicional |
| **Sentry** | 5,000 eventos/mes | $29/mes (Team) |
| **Cloudflare** | DNS, CDN, SSL, WAF, DDoS - ilimitado | $200/mes (Pro) para reglas avanzadas |
| **GitHub Actions** | 2,000 minutos/mes (Windows: 1,000) | $4/mes por 3,000 min adicionales |
| **Cloudflare R2** | 10GB almacenamiento, 10M lecturas/mes | $0.015/GB/mes adicional |

### Costo mensual estimado

- **Mes 1-3 (desarrollo)**: **$0** (Vercel + Railway credito + Cloudflare + Sentry gratis)
- **Mes 3-12 (produccion temprana)**: **$5-10/mes** (Railway $5 + el resto gratis)
- **Escalando (1000+ usuarios)**: **$50-100/mes** (Supabase Pro + Sentry Team + Vercel Pro)
