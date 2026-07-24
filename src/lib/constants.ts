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
