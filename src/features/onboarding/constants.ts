export interface OnboardingStep {
  id: string
  title: string
  description: string
  target: string
  emoji: string
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'accounts',
    title: 'Conecta tus cuentas',
    description: 'Agrega tus cuentas bancarias o conéctalas con tu banco para empezar.',
    target: '/accounts',
    emoji: '🏦',
  },
  {
    id: 'transactions',
    title: 'Registra tus movimientos',
    description: 'Captura tus ingresos y gastos o importa un archivo.',
    target: '/transactions',
    emoji: '💸',
  },
  {
    id: 'budgets',
    title: 'Define presupuestos',
    description: 'Establece límites de gasto por categoría o cuenta.',
    target: '/budgets',
    emoji: '🎯',
  },
  {
    id: 'goals',
    title: 'Crea una meta',
    description: 'Ahorra hacia algo importante con metas automáticas.',
    target: '/goals',
    emoji: '🚀',
  },
]

export const ONBOARDING_STORAGE_KEY = 'fip_onboarding_completed'
