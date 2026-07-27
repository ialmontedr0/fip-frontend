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

### Instalacion

```bash
pnpm add vite-plugin-pwa
```

### Configuracion en vite.config.ts

```ts
import { VitePWA } from 'vite-plugin-pwa'

// En plugins:
VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'favicon-32x32.png', 'favicon-16x16.png', 'apple-touch-icon.png'],
  manifest: {
    name: 'FIP - Financial Intelligence Platform',
    short_name: 'FIP',
    description: 'Gestion financiera personal inteligente',
    theme_color: '#7c3aed',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait-primary',
    scope: '/',
    start_url: '/',
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
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.tudominio\.com\/api\/v1\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60, // 1 hora
          },
          networkTimeoutSeconds: 10,
        },
      },
    ],
  },
})
```

---

## 8. CDN para Assets Estaticos

Cuando deployas en Vercel, los assets ya se sirven desde su CDN global (Vercel Edge Network). Pero si quieres usar Cloudflare:

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

Crear `.github/workflows/deploy-frontend.yml`:

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

Tambien un workflow para el backend en Railway:

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

### Estructura DNS final:

```
# A record para API (Railway)
api.tudominio.com  CNAME  fip-backend.up.railway.app  (proxy naranja)

# A record para Frontend (Vercel)
app.tudominio.com  CNAME  cname.vercel-dns.com  (proxy naranja)

# Si tienes R2 bucket con dominio custom
cdn.tudominio.com  CNAME  xxx.r2.cloudflarestorage.com  (proxy naranja)
```

### Configuracion Cloudflare recomendada:

- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: ON
- **HTTP/2**: ON
- **HTTP/3 (QUIC)**: ON
- **Auto Minify**: HTML, CSS, JS
- **Brotli**: ON
- **Rocket Loader**: OFF (puede causar problemas con React)
- **Polish**: ON (optimiza imagenes)
- **Cache Level**: Standard
- **Edge Cache TTL**: 1 day
- **WAF**: ON con reglas comunes
- **Rate Limiting**: ON (proteger API)
- **Bot Fight Mode**: ON (bloquea bots maliciosos)

---

## 11. Health Check Endpoints (Frontend los consume)

El backend expone estos endpoints de health check que puedes usar para monitoreo:

| Endpoint | Proposito |
|----------|-----------|
| `GET /health` | Full health check (app, db, redis, disk, memory) |
| `GET /health/readiness` | Readiness probe (app ready to serve) |
| `GET /health/liveness` | Liveness probe (app process alive) |

Puedes crear un hook simple en el frontend para mostrar estado en el dashboard admin:

```tsx
// features/admin/hooks/useHealthCheck.ts
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
    refetchInterval: 30_000, // cada 30s
  })
}
```

---

## 12. Checklist de Seguridad para Produccion

- [ ] `CORS_ORIGINS` en backend configurado SOLO con la URL del frontend
- [ ] `SECRET_KEY` generada con `openssl rand -hex 32`
- [ ] HTTPS en todos los entornos (Vercel + Railway lo dan gratis)
- [ ] Rate limiting activado en endpoints de auth (ya esta en el middleware)
- [ ] CSP Headers configurados (en vercel.json o nginx)
- [ ] No hay secretos hardcodeados en el codigo
- [ ] Tokens JWT con expiracion corta + refresh tokens rotados
- [ ] Sentry configurado sin datos sensibles (maskAllText: true)
- [ ] `console.log` eliminados en build (con `esbuild.drop`)
- [ ] Source maps no servidos al publico
- [ ] `robots.txt` permite indexar
- [ ] `sitemap.xml` generado

---

## 13. Post-Deploy Verification

Despues del deploy, verifica:

```bash
# 1. Health check
curl https://api.tudominio.com/health

# 2. Frontend carga
curl https://app.tudominio.com

# 3. SEO headers
curl -I https://app.tudominio.com

# 4. API proxy funciona
curl https://app.tudominio.com/api/v1/health/readiness

# 5. Sentry - forzar un error para probar
# En consola del navegador:
throw new Error('Sentry test error')

# 6. Lighthouse audit
# Chrome DevTools > Lighthouse > Generate report
# Target: >90 Performance, >90 Accessibility, >90 SEO, >90 Best Practices

# 7. Verificar cache headers
curl -I https://app.tudominio.com/assets/index-xxxxx.js
# Debe devolver: Cache-Control: public, max-age=31536000, immutable

# 8. Prueba PWA (si implementaste)
# Chrome DevTools > Application > Manifest > verificar
```

---

## 14. Estrategia de Deploy Gradual

### Paso 1: Preparacion (ahora)
1. Crea cuenta en Vercel (gratis)
2. Crea cuenta en Sentry (gratis tier developer)
3. Configura dominio en Cloudflare
4. Genera assets SEO (favicon, og-image, etc.)
5. Instala dependencias: `@sentry/react`, `@sentry/vite-plugin`

### Paso 2: Build local
```bash
cd fip-frontend
pnpm add @sentry/react @sentry/vite-plugin
pnpm add -D @sentry/vite-plugin rollup-plugin-visualizer
pnpm build
# Verifica que no hay errores
# Verifica el tamanio del bundle en dist/
```

### Paso 3: Deploy a Vercel
1. Conecta repo en Vercel
2. Configura env vars
3. Deploy automatico (push a main)
4. Prueba la URL de vercel.app

### Paso 4: Dominio custom
1. Agrega dominio en Vercel
2. Configura CNAME en Cloudflare
3. Espera propagacion DNS (5-10 min)
4. Verifica SSL

### Paso 5: Monitoreo
1. Configura alertas en Sentry
2. Prueba forzando un error
3. Verifica que el error aparece en Sentry dashboard

### Paso 6: CI/CD
1. Crea secrets en GitHub:
   - `VERCEL_TOKEN` - generado en vercel.com/account/tokens
   - `VERCEL_ORG_ID` - de vercel.com/project/settings
   - `VERCEL_PROJECT_ID` - de vercel.com/project/settings
   - `VITE_SENTRY_DSN` - de sentry.io
   - `SENTRY_AUTH_TOKEN` - de sentry.io/settings/auth
   - `RAILWAY_TOKEN` (para backend) - de railway.app/dashboard
2. Pushea el workflow YAML
3. Verifica que el action corre en GitHub

---

## 15. Resumen de Archivos a Crear/Modificar

### Nuevos archivos:
| Archivo | Proposito |
|---------|-----------|
| `fip-frontend/.env.production` | Variables de entorno prod |
| `fip-frontend/vercel.json` | Configuracion Vercel |
| `fip-frontend/Dockerfile` | Docker multi-stage build |
| `fip-frontend/nginx.conf` | Nginx config para SPA |
| `fip-frontend/.dockerignore` | Docker ignore |
| `fip-frontend/.github/workflows/deploy-frontend.yml` | GitHub Actions |
| `fip-frontend/public/robots.txt` | SEO |
| `fip-frontend/public/site.webmanifest` | PWA manifest |
| `fip-frontend/public/og-image.png` | Open Graph image |
| `fip-frontend/public/favicon.svg` | SVG favicon |
| `fip-frontend/public/favicon-32x32.png` | 32px favicon |
| `fip-frontend/public/favicon-16x16.png` | 16px favicon |
| `fip-frontend/public/apple-touch-icon.png` | iOS icon |

### Archivos a modificar:
| Archivo | Cambio |
|---------|--------|
| `vite.config.ts` | Build optimizado, manualChunks, esbuild drop, Sentry plugin, PWA plugin |
| `src/main.tsx` | Inicializar Sentry |
| `src/components/layout/ErrorBoundary.tsx` | Integrar Sentry captureException |
| `src/components/ui/SEOHead.tsx` | Agregar OG y Twitter tags |
| `index.html` | Meta tags SEO completos, preconnect, fonts, Open Graph, Twitter Cards |
| `tsconfig.json` | Ajustes de target y lib |

---

## 16. Pricing (Gratis / Low Cost)

| Servicio | Plan Gratis Incluye | Para que usar |
|----------|---------------------|---------------|
| Vercel | Hosting, SSL, CDN, 100GB ancho de banda | Frontend |
| Railway | $5/mes o $0 con GitHub Student | Backend + Postgres + Redis |
| Supabase | 500MB DB, 2GB bandwidth | Base de datos (alternativa mas barata) |
| Upstash | 10,000 commands/dia gratis | Redis (cache + rate limit) |
| Sentry | 5k events/mes gratis | Error tracking |
| Cloudflare | Ilimitado (DNS, CDN, WAF, SSL) | Dominio, CDN, seguridad |
| GitHub Actions | 2000 min/mes gratis | CI/CD |

**Setup minimal mensual**: $0 (Vercel + Railway free tier + Upstash free + Sentry free)
**Setup recomendado**: $5-10/mes (Railway $5 + el resto gratis)
