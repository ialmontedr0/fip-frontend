# Fase 0: Foundation & Setup - Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Prerequisitos](#1-prerequisitos)
2. [Inicializacion del Proyecto](#2-inicializacion-del-proyecto)
3. [Configurar Alias de Imports](#3-configurar-alias-de-imports)
4. [Estructura de Carpetas](#4-estructura-de-carpetas)
5. [TailwindCSS v3+ Configuration](#5-tailwindcss-v3-configuration)
6. [ESLint + Prettier](#6-eslint--prettier)
7. [Tipos Base (types/)](#7-tipos-base-types)
8. [API Client (lib/api.ts)](#8-api-client-libapits)
9. [Zustand Auth Store](#9-zustand-auth-store)
10. [TanStack Query Config](#10-tanstack-query-config)
11. [UI Components Base](#11-ui-components-base)
12. [Routing Structure](#12-routing-structure)
13. [Layout Principal](#13-layout-principal)
14. [Theme Toggle (claro/oscuro)](#14-theme-toggle-clarooscuro)
15. [Entry Point (App.tsx + main.tsx)](#15-entry-point-apptsx--maintsx)
16. [Verificacion Final](#16-verificacion-final)

---

## 1. Prerequisitos

```bash
node >= 18
pnpm >= 8
```

Instalar pnpm si no lo tienes:

```bash
# Usando npm
npm install -g pnpm

# O usando winget (Windows)
winget install pnpm

# Verificar version
pnpm --version
```

---

## 2. Inicializacion del Proyecto

```bash
# Ir al directorio del frontend
cd C:\Users\Tony\Documents\fip\fip-frontend

# Crear proyecto Vite con React + TypeScript
pnpm create vite . --template react-ts

# Instalar dependencias de produccion
pnpm add react-router-dom@6 @tanstack/react-query@5 zustand axios react-hook-form @hookform/resolvers zod recharts lucide-react date-fns react-hot-toast @hello-pangea/dnd @tanstack/react-table@8 clsx tailwind-merge class-variance-authority

# Instalar dependencias de desarrollo
pnpm add -D tailwindcss@3 postcss autoprefixer eslint prettier eslint-config-prettier eslint-plugin-react-hooks @typescript-eslint/eslint-plugin @typescript-eslint/parser vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @types/node eslint-plugin-tailwindcss

# Inicializar TailwindCSS
npx tailwindcss init -p

# Configurar git (si no existe)
git init
```

---

## 3. Configurar Alias de Imports

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

### tsconfig.json (ajustar el existente)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

---

## 4. Estructura de Carpetas

Crear toda la estructura de carpetas feature-based:

```bash
# Ir a src
cd src

# Crear estructura de directorios
New-Item -ItemType Directory -Path "components\ui"
New-Item -ItemType Directory -Path "components\layout"
New-Item -ItemType Directory -Path "components\charts"
New-Item -ItemType Directory -Path "features\auth"
New-Item -ItemType Directory -Path "features\accounts"
New-Item -ItemType Directory -Path "features\wallets"
New-Item -ItemType Directory -Path "features\transactions"
New-Item -ItemType Directory -Path "features\categories"
New-Item -ItemType Directory -Path "features\incomes"
New-Item -ItemType Directory -Path "features\expenses"
New-Item -ItemType Directory -Path "features\goals"
New-Item -ItemType Directory -Path "features\budgets"
New-Item -ItemType Directory -Path "features\cards"
New-Item -ItemType Directory -Path "features\loans"
New-Item -ItemType Directory -Path "features\analytics"
New-Item -ItemType Directory -Path "features\ai"
New-Item -ItemType Directory -Path "features\automations"
New-Item -ItemType Directory -Path "features\notifications"
New-Item -ItemType Directory -Path "features\imports"
New-Item -ItemType Directory -Path "features\exports"
New-Item -ItemType Directory -Path "features\admin"
New-Item -ItemType Directory -Path "features\settings"
New-Item -ItemType Directory -Path "hooks"
New-Item -ItemType Directory -Path "lib"
New-Item -ItemType Directory -Path "stores"
New-Item -ItemType Directory -Path "types"
New-Item -ItemType Directory -Path "routes"
```

Estructura final:

```
src/
  components/
    ui/           -> Button, Input, Modal, Card, Badge, Skeleton, Spinner, etc.
    layout/       -> Sidebar, Header, MainLayout, AuthLayout, AdminLayout
    charts/       -> AreaChart, BarChart, PieChart, LineChart (wrappers)
  features/       -> 22 modulos (cada uno con sus subcarpetas)
    auth/
    accounts/
    wallets/
    transactions/
    categories/
    incomes/
    expenses/
    goals/
    budgets/
    cards/
    loans/
    analytics/
    ai/
    automations/
    notifications/
    imports/
    exports/
    admin/
    settings/
  hooks/          -> Custom hooks compartidos
  lib/            -> api.ts, utils.ts, constants.ts
  stores/         -> Zustand stores (auth-store.ts, theme-store.ts, ui-store.ts)
  types/          -> Interfaces globales (api.ts, models.ts, enums.ts)
  routes/         -> Route definitions
  App.tsx         -> Root component
  main.tsx        -> Entry point
  index.css       -> Tailwind imports + variables CSS
```

---

## 5. TailwindCSS v3+ Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        background: {
          light: '#f8fafc',
          dark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

### postcss.config.js

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@layer base {
  :root {
    --color-primary: #3b82f6;
    --color-background: #f8fafc;
    --color-surface: #ffffff;
    --color-text: #0f172a;
    --color-border: #e2e8f0;
    --color-success: #22c55e;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
    --color-info: #3b82f6;
  }

  .dark {
    --color-background: #0f172a;
    --color-surface: #1e293b;
    --color-text: #f1f5f9;
    --color-border: #334155;
  }

  * {
    @apply border-gray-200 dark:border-gray-700;
  }

  body {
    @apply bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 antialiased;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
}

@layer components {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## 6. ESLint + Prettier

### .eslintrc.cjs

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'tailwindcss'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'off',
  },
}
```

### .prettierrc

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### .prettierignore

```
dist
node_modules
*.md
```

---

## 7. Tipos Base (types/)

### types/api.ts

```typescript
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: Array<{ field: string; message: string }>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}
```

### types/models.ts

```typescript
export interface IUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  phone?: string
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  mfa_enabled: boolean
  login_count: number
  last_login_at?: string
  created_at: string
  updated_at?: string
}

export interface IAuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface IAuthResponse {
  requires_mfa: boolean
  mfa_token?: string
  user?: IUser
  tokens?: IAuthTokens
}
```

### types/enums.ts

```typescript
export enum AccountType {
  BANK = 'bank',
  CASH = 'cash',
  SAVINGS = 'savings',
  CHECKING = 'checking',
  WALLET = 'wallet',
  CRYPTO = 'crypto',
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
}

export enum TransactionStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

export enum GoalType {
  SAVINGS = 'savings',
  DEBT_PAYOFF = 'debt_payoff',
  INVESTMENT = 'investment',
  EMERGENCY = 'emergency',
  EDUCATION = 'education',
  RETIREMENT = 'retirement',
  CUSTOM = 'custom',
}

export enum LoanType {
  PERSONAL = 'personal',
  MORTGAGE = 'mortgage',
  AUTO = 'auto',
  STUDENT = 'student',
  BUSINESS = 'business',
  PERSONAL_LINE = 'personal_line',
  PAYDAY = 'payday',
  MICROLOAN = 'microloan',
  CONSOLIDATION = 'consolidation',
}

export enum AutomationTrigger {
  INCOME_RECEIVED = 'income_received',
  BALANCE_THRESHOLD = 'balance_threshold',
  BUDGET_ALERT = 'budget_alert',
  DATE_BASED = 'date_based',
  TRANSACTION_MATCHED = 'transaction_matched',
}

export enum AutomationAction {
  TRANSFER_MONEY = 'transfer_money',
  SEND_NOTIFICATION = 'send_notification',
  CREATE_TRANSACTION = 'create_transaction',
  UPDATE_BUDGET = 'update_budget',
  UPDATE_GOAL = 'update_goal',
}
```

---

## 8. API Client (lib/api.ts)

### lib/api.ts

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - inject auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor - handle 401 auto-refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = useAuthStore.getState().refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token: newRefreshToken } = response.data.tokens

        useAuthStore.getState().setTokens(access_token, newRefreshToken)

        processQueue(null, access_token)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

export default api
```

### lib/utils.ts

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number | string,
  currency: string = 'DOP',
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num)
}

export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (format === 'relative') {
    const diff = Date.now() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} dias`
  }
  return d.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  })
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}
```

### lib/constants.ts

```typescript
export const APP_NAME = 'FIP'
export const APP_VERSION = '0.1.0'

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZES: [10, 25, 50, 100],
} as const

export const DEBOUNCE_DELAY = 300

export const TOAST_DURATION = 4000

export const CURRENCIES = {
  DOP: { symbol: 'RD$', name: 'Peso Dominicano' },
  USD: { symbol: '$', name: 'Dolar Estadounidense' },
  EUR: { symbol: '€', name: 'Euro' },
} as const

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  WALLETS: '/wallets',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  INCOMES: '/incomes',
  EXPENSES: '/expenses',
  GOALS: '/goals',
  BUDGETS: '/budgets',
  CARDS: '/cards',
  LOANS: '/loans',
  ANALYTICS: '/analytics',
  AI: '/ai',
  AUTOMATIONS: '/automations',
  NOTIFICATIONS: '/notifications',
  IMPORTS: '/imports',
  EXPORTS: '/exports',
  ADMIN: '/admin',
  SETTINGS: '/settings',
} as const
```

---

## 9. Zustand Auth Store

### stores/auth-store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IUser, IAuthTokens } from '@/types/models'

interface AuthState {
  user: IUser | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: IUser) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  setLoading: (loading: boolean) => void
  login: (user: IUser, tokens: IAuthTokens) => void
  logout: () => void
  updateUser: (updates: Partial<IUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken, isAuthenticated: true }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, tokens) =>
        set({
          user,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'fip-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
```

### stores/theme-store.ts

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',

      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },

      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light'
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
    }),
    {
      name: 'fip-theme',
    },
  ),
)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// Initialize theme on load
const savedTheme = (localStorage.getItem('fip-theme') as Theme) || 'light'
applyTheme(savedTheme)
```

### stores/ui-store.ts

```typescript
import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  activeDropdown: string | null

  toggleSidebar: () => void
  setMobileSidebarOpen: (open: boolean) => void
  setActiveDropdown: (id: string | null) => void
}

export const useUIStore = create<UIState>()((set, get) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  activeDropdown: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),

  setActiveDropdown: (id) => set({ activeDropdown: id }),
}))
```

---

## 10. TanStack Query Config

### lib/query-client.ts

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 30, // 30 minutos en cache
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
})
```

---

## 11. UI Components Base

Todos los componentes UI deben ser: auto-contenidos, con soporte dark mode via `dark:`, responsive, accesibles con ARIA, export default.

### components/ui/Button.tsx

```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
        destructive: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        link: 'text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
export { buttonVariants }
```

### components/ui/Input.tsx

```typescript
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
            error && 'border-red-500 focus:ring-red-500 dark:border-red-400',
            className,
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export default Input
```

### components/ui/Card.tsx

```typescript
import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-gray-200 bg-white p-6 shadow-sm',
          'dark:border-gray-700 dark:bg-gray-800',
          hover && 'transition-shadow hover:shadow-md',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center justify-between mb-4', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-lg font-semibold text-gray-900 dark:text-gray-100', className)} {...props} />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

export default Card
export { CardHeader, CardTitle, CardContent }
```

### components/ui/Badge.tsx

```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
        primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
        success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
)

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export default Badge
export { badgeVariants }
```

### components/ui/Skeleton.tsx

```typescript
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
}

function Skeleton({ className, variant = 'text', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className,
      )}
      {...props}
    />
  )
}

export default Skeleton
```

### components/ui/Modal.tsx

```typescript
import { useEffect, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-50 w-full rounded-xl bg-white p-6 shadow-xl',
          'dark:bg-gray-800',
          'animate-fade-in',
          sizeClasses[size],
          'mx-4',
        )}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
```

### components/ui/Spinner.tsx

```typescript
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <Loader2
      className={cn('animate-spin text-primary-600 dark:text-primary-400', sizeClasses[size], className)}
    />
  )
}

export default Spinner
```

### components/ui/Avatar.tsx

```typescript
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function Avatar({ src, alt = '', size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn('rounded-full object-cover', sizeClasses[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center',
        sizeClasses[size],
        className,
      )}
      aria-label={alt}
    >
      <User className={cn('text-primary-600 dark:text-primary-300', {
        'h-4 w-4': size === 'sm',
        'h-5 w-5': size === 'md',
        'h-6 w-6': size === 'lg',
      })} />
    </div>
  )
}

export default Avatar
```

### components/ui/ErrorMessage.tsx

```typescript
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Button from './Button'

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
}

function ErrorMessage({
  title = 'Error',
  message = 'Algo salio mal. Intenta de nuevo.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-3 mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Intentar de nuevo
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
```

### components/ui/EmptyState.tsx

```typescript
import { cn } from '@/lib/utils'
import { Inbox } from 'lucide-react'
import Button from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
        {icon || <Inbox className="h-6 w-6 text-gray-400" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}

export default EmptyState
```

### components/ui/Dropdown.tsx

```typescript
import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            'dark:border-gray-700 dark:bg-gray-800',
            'animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  className?: string
}

function DropdownItem({ children, onClick, danger, className }: DropdownItemProps) {
  return (
    <button
      onClick={() => {
        onClick?.()
      }}
      className={cn(
        'flex w-full items-center px-4 py-2 text-sm transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200',
        className,
      )}
      role="menuitem"
    >
      {children}
    </button>
  )
}

Dropdown.Item = DropdownItem
export default Dropdown
```

### components/ui/index.ts

```typescript
export { default as Button, buttonVariants } from './Button'
export { default as Input } from './Input'
export { default as Card, CardHeader, CardTitle, CardContent } from './Card'
export { default as Badge, badgeVariants } from './Badge'
export { default as Skeleton } from './Skeleton'
export { default as Modal } from './Modal'
export { default as Spinner } from './Spinner'
export { default as Avatar } from './Avatar'
export { default as ErrorMessage } from './ErrorMessage'
export { default as EmptyState } from './EmptyState'
export { default as Dropdown } from './Dropdown'
```

---

## 12. Routing Structure

### routes/index.tsx

```typescript
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import RequireAuth from '@/components/layout/RequireAuth'
import RequireAdmin from '@/components/layout/RequireAdmin'
import Spinner from '@/components/ui/Spinner'

// Lazy-loaded pages
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
const MFAChallengePage = lazy(() => import('@/features/auth/pages/MFAChallengePage'))
const RequestResetPage = lazy(() => import('@/features/auth/pages/RequestResetPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
const DashboardPage = lazy(() => import('@/features/analytics/pages/DashboardPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))

// Placeholder pages for routes not yet implemented
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <p className="text-lg text-gray-500">{title} - Proximamente</p>
    </div>
  )
}

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/mfa',
        element: (
          <SuspenseWrapper>
            <MFAChallengePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <SuspenseWrapper>
            <RequestResetPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/reset-password/:token',
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/verify-email/:token',
        element: (
          <SuspenseWrapper>
            <VerifyEmailPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          // Accounts
          { path: '/accounts', element: <SuspenseWrapper><PlaceholderPage title="Cuentas" /></SuspenseWrapper> },
          { path: '/accounts/new', element: <SuspenseWrapper><PlaceholderPage title="Nueva Cuenta" /></SuspenseWrapper> },
          { path: '/accounts/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Cuenta" /></SuspenseWrapper> },
          // Wallets
          { path: '/wallets', element: <SuspenseWrapper><PlaceholderPage title="Wallets" /></SuspenseWrapper> },
          { path: '/wallets/new', element: <SuspenseWrapper><PlaceholderPage title="Nuevo Wallet" /></SuspenseWrapper> },
          { path: '/wallets/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Wallet" /></SuspenseWrapper> },
          // Transactions
          { path: '/transactions', element: <SuspenseWrapper><PlaceholderPage title="Transacciones" /></SuspenseWrapper> },
          { path: '/transactions/new', element: <SuspenseWrapper><PlaceholderPage title="Nueva Transaccion" /></SuspenseWrapper> },
          { path: '/transactions/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Transaccion" /></SuspenseWrapper> },
          // Categories
          { path: '/categories', element: <SuspenseWrapper><PlaceholderPage title="Categorias" /></SuspenseWrapper> },
          // Incomes
          { path: '/incomes', element: <SuspenseWrapper><PlaceholderPage title="Ingresos" /></SuspenseWrapper> },
          { path: '/incomes/new', element: <SuspenseWrapper><PlaceholderPage title="Nuevo Ingreso" /></SuspenseWrapper> },
          // Expenses
          { path: '/expenses', element: <SuspenseWrapper><PlaceholderPage title="Gastos" /></SuspenseWrapper> },
          { path: '/expenses/new', element: <SuspenseWrapper><PlaceholderPage title="Nuevo Gasto" /></SuspenseWrapper> },
          // Goals
          { path: '/goals', element: <SuspenseWrapper><PlaceholderPage title="Metas" /></SuspenseWrapper> },
          { path: '/goals/new', element: <SuspenseWrapper><PlaceholderPage title="Nueva Meta" /></SuspenseWrapper> },
          { path: '/goals/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Meta" /></SuspenseWrapper> },
          // Budgets
          { path: '/budgets', element: <SuspenseWrapper><PlaceholderPage title="Presupuestos" /></SuspenseWrapper> },
          { path: '/budgets/new', element: <SuspenseWrapper><PlaceholderPage title="Nuevo Presupuesto" /></SuspenseWrapper> },
          { path: '/budgets/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Presupuesto" /></SuspenseWrapper> },
          // Cards
          { path: '/cards', element: <SuspenseWrapper><PlaceholderPage title="Tarjetas" /></SuspenseWrapper> },
          { path: '/cards/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Tarjeta" /></SuspenseWrapper> },
          // Loans
          { path: '/loans', element: <SuspenseWrapper><PlaceholderPage title="Prestamos" /></SuspenseWrapper> },
          { path: '/loans/new', element: <SuspenseWrapper><PlaceholderPage title="Nuevo Prestamo" /></SuspenseWrapper> },
          { path: '/loans/:id', element: <SuspenseWrapper><PlaceholderPage title="Detalle Prestamo" /></SuspenseWrapper> },
          // Analytics
          { path: '/analytics', element: <SuspenseWrapper><PlaceholderPage title="Analitica" /></SuspenseWrapper> },
          // AI
          { path: '/ai', element: <SuspenseWrapper><PlaceholderPage title="IA" /></SuspenseWrapper> },
          // Automations
          { path: '/automations', element: <SuspenseWrapper><PlaceholderPage title="Automatizaciones" /></SuspenseWrapper> },
          { path: '/automations/new', element: <SuspenseWrapper><PlaceholderPage title="Nueva Automatizacion" /></SuspenseWrapper> },
          // Notifications
          { path: '/notifications', element: <SuspenseWrapper><PlaceholderPage title="Notificaciones" /></SuspenseWrapper> },
          // Imports
          { path: '/imports', element: <SuspenseWrapper><PlaceholderPage title="Importaciones" /></SuspenseWrapper> },
          // Exports
          { path: '/exports', element: <SuspenseWrapper><PlaceholderPage title="Exportaciones" /></SuspenseWrapper> },
          // Settings
          { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
          { path: '/settings/profile', element: <SuspenseWrapper><PlaceholderPage title="Perfil" /></SuspenseWrapper> },
          { path: '/settings/security', element: <SuspenseWrapper><PlaceholderPage title="Seguridad" /></SuspenseWrapper> },
          { path: '/settings/preferences', element: <SuspenseWrapper><PlaceholderPage title="Preferencias" /></SuspenseWrapper> },
          // Admin (protected by RequireAdmin)
          {
            element: <RequireAdmin />,
            children: [
              { path: '/admin/users', element: <SuspenseWrapper><PlaceholderPage title="Usuarios Admin" /></SuspenseWrapper> },
              { path: '/admin/roles', element: <SuspenseWrapper><PlaceholderPage title="Roles Admin" /></SuspenseWrapper> },
              { path: '/admin/permissions', element: <SuspenseWrapper><PlaceholderPage title="Permisos Admin" /></SuspenseWrapper> },
              { path: '/admin/audit-logs', element: <SuspenseWrapper><PlaceholderPage title="Auditoria" /></SuspenseWrapper> },
              { path: '/admin/stats', element: <SuspenseWrapper><PlaceholderPage title="Estadisticas Admin" /></SuspenseWrapper> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
```

---

## 13. Layout Principal

### components/layout/RequireAuth.tsx

```typescript
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import Spinner from '@/components/ui/Spinner'

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default RequireAuth
```

### components/layout/RequireAdmin.tsx

```typescript
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'

function RequireAdmin() {
  const { user } = useAuthStore()

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default RequireAdmin
```

### components/layout/AuthLayout.tsx

```typescript
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FIP</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Financial Intelligence Platform
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
```

### components/layout/Sidebar.tsx

```typescript
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Tags,
  TrendingUp,
  TrendingDown,
  Target,
  PiggyBank,
  CreditCard,
  Landmark,
  BarChart3,
  Brain,
  Bot,
  Bell,
  Upload,
  Download,
  Shield,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'

const navigation = [
  { section: 'Principal', items: [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ]},
  { section: 'Finanzas', items: [
    { name: 'Cuentas', href: '/accounts', icon: Wallet },
    { name: 'Wallets', href: '/wallets', icon: PiggyBank },
    { name: 'Transacciones', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Categorias', href: '/categories', icon: Tags },
  ]},
  { section: 'Ingresos y Gastos', items: [
    { name: 'Ingresos', href: '/incomes', icon: TrendingUp },
    { name: 'Gastos', href: '/expenses', icon: TrendingDown },
  ]},
  { section: 'Planificacion', items: [
    { name: 'Metas', href: '/goals', icon: Target },
    { name: 'Presupuestos', href: '/budgets', icon: PiggyBank },
    { name: 'Tarjetas', href: '/cards', icon: CreditCard },
    { name: 'Prestamos', href: '/loans', icon: Landmark },
  ]},
  { section: 'Inteligencia', items: [
    { name: 'Analitica', href: '/analytics', icon: BarChart3 },
    { name: 'IA', href: '/ai', icon: Brain },
    { name: 'Automatizaciones', href: '/automations', icon: Bot },
  ]},
  { section: 'Sistema', items: [
    { name: 'Notificaciones', href: '/notifications', icon: Bell },
    { name: 'Importar', href: '/imports', icon: Upload },
    { name: 'Exportar', href: '/exports', icon: Download },
    { name: 'Admin', href: '/admin/users', icon: Shield },
    { name: 'Configuracion', href: '/settings', icon: Settings },
  ]},
]

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

function Sidebar({ mobile, onClose }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore()

  const content = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          {sidebarOpen && <span className="text-lg font-bold text-gray-900 dark:text-white">FIP</span>}
        </div>
        {mobile ? (
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        ) : (
          <button onClick={toggleSidebar} className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700">
            {sidebarOpen ? (
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
        {navigation.map((section) => (
          <div key={section.section}>
            {sidebarOpen && (
              <p className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                {section.section}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={mobile ? onClose : undefined}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                        !sidebarOpen && 'justify-center',
                      )
                    }
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.name}</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )

  if (mobile) {
    return (
      <div className="fixed inset-0 z-40 flex lg:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative flex w-72 max-w-[calc(100vw-3rem)] flex-col bg-white dark:bg-gray-900">
          {content}
        </div>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      {content}
    </aside>
  )
}

export default Sidebar
```

### components/layout/Header.tsx

```typescript
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { useUIStore } from '@/stores/ui-store'
import { Avatar } from '@/components/ui'
import { Bell, Menu, Moon, Sun, LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Dropdown from '@/components/ui/Dropdown'

function Header() {
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { setMobileSidebarOpen } = useUIStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Avatar src={user?.avatar_url} alt={user?.email} size="sm" />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.email?.split('@')[0] || 'Usuario'}
              </span>
            </button>
          }
        >
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
          <Dropdown.Item onClick={() => navigate('/settings/profile')}>
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Configuracion
          </Dropdown.Item>
          <Dropdown.Item onClick={handleLogout} danger>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesion
          </Dropdown.Item>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
```

### components/layout/MainLayout.tsx

```typescript
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useUIStore } from '@/stores/ui-store'

function MainLayout() {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile */}
      {mobileSidebarOpen && (
        <Sidebar mobile onClose={() => setMobileSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
```

---

## 14. Theme Toggle (claro/oscuro)

El theme toggle ya está integrado en el Header via `useThemeStore`. La lógica:

1. `stores/theme-store.ts` - Persiste el theme en localStorage, aplica/remueve la clase `dark` del `<html>`
2. `Header.tsx` - Botón que llama `toggleTheme()`
3. `index.css` - Variables CSS para ambos modos
4. Tailwind config con `darkMode: 'class'`

Para usar en cualquier componente:

```typescript
import { useThemeStore } from '@/stores/theme-store'

function MiComponente() {
  const { theme, toggleTheme } = useThemeStore()
  // ...
}
```

---

## 15. Entry Point (App.tsx + main.tsx)

### App.tsx

```typescript
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/query-client'
import { router } from '@/routes'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

function App() {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    // Auth state is restored from persistence on mount
    setLoading(false)
  }, [setLoading])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            duration: 6000,
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
```

### main.tsx

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### .env (raiz del proyecto)

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=FIP
VITE_ENABLE_MOCK=true
```

### index.html (actualizar el existente)

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Financial Intelligence Platform - Gestion financiera personal inteligente" />
    <title>FIP - Financial Intelligence Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 16. Verificacion Final

Una vez que hayas creado todos los archivos, ejecuta:

```bash
# Verificar que compila
pnpm typecheck

# Verificar lint
pnpm lint

# Iniciar servidor de desarrollo
pnpm dev
```

Abre http://localhost:5173 - deberias ver el layout completo con:
- Sidebar expandible/collapsable
- Header con boton de tema, notificaciones, avatar
- Contenido mostrando el Dashboard (Placeholder)

### Checklist de Verificacion

- [ ] `pnpm dev` funciona sin errores
- [ ] `pnpm typecheck` pasa sin errores
- [ ] `pnpm lint` pasa sin errores
- [ ] Sidebar muestra todas las secciones de navegacion
- [ ] Sidebar se colapsa/expande correctamente
- [ ] Sidebar mobile se abre como drawer
- [ ] Theme toggle cambia de claro a oscuro
- [ ] Header muestra avatar y menu de usuario
- [ ] Todas las rutas placeholder son accesibles
- [ ] Layout es responsivo
- [ ] Archivos UI base existen y son importables desde `@/components/ui`
- [ ] Stores de Zustand funcionan
- [ ] API client con interceptor de auth configurado
- [ ] TanStack Query client configurado con defaults

---

## Notas Importantes

1. **Estructura de features**: cada feature tendra `pages/`, `components/`, `hooks/` dentro de su carpeta. Por ahora solo crea los archivos de pagina placeholder en cada feature.

2. **Para Fase 1 (Auth)**: Necesitaras crear los pages de auth (LoginPage, RegisterPage, etc.) dentro de `features/auth/pages/`.

3. **Iconos**: Usa solo Lucide React icons. Para icons de categorias/entidades, usa emojis (como en el seed del backend) o Lucide icons.

4. **Alias @**: Todos los imports deben usar `@/` en lugar de rutas relativas.

5. **Server State**: Nunca guardes datos del API en Zustand. Usa TanStack Query siempre.

6. **Client State**: Zustand solo para UI state (sidebar, theme, auth tokens).

7. **Form State**: React Hook Form para todos los formularios.

8. **URL State**: React Router search params para filtros y paginacion.
