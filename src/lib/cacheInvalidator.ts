import type { QueryClient } from '@tanstack/react-query'

/**
 * Invalidaciones de caché tras mutaciones. Migra las roots consistentes
 * para mantener data fresca tras cambios de transacciones (dashboard, KPIs, etc.).
 */
export function invalidateTransactionQueries(queryClient: QueryClient): void {
  queryClient.invalidateQueries({ queryKey: ['transactions'] })
  queryClient.invalidateQueries({ queryKey: ['incomes'] })
  queryClient.invalidateQueries({ queryKey: ['expenses'] })
  queryClient.invalidateQueries({ queryKey: ['accounts'] })
  queryClient.invalidateQueries({ queryKey: ['budgets'] })
  queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  queryClient.invalidateQueries({ queryKey: ['kpis'] })
  queryClient.invalidateQueries({ queryKey: ['cash-flow'] })
  queryClient.invalidateQueries({ queryKey: ['net-worth'] })
  queryClient.invalidateQueries({ queryKey: ['category-breakdown'] })
  queryClient.invalidateQueries({ queryKey: ['spending-trend'] })
  queryClient.invalidateQueries({ queryKey: ['income-trend'] })
}
export const INVALIDATION_MAP = {
  'transaction.created': ['transactions', 'incomes', 'expenses', 'accounts', 'budgets', 'dashboard', 'kpis', 'cash-flow', 'net-worth', 'category-breakdown', 'spending-trend', 'income-trend'],
  'transaction.updated': ['transactions', 'accounts', 'budgets', 'dashboard', 'kpis', 'cash-flow', 'net-worth', 'category-breakdown', 'spending-trend', 'income-trend'],
  'transaction.deleted': ['transactions', 'accounts', 'budgets', 'dashboard', 'kpis', 'cash-flow', 'net-worth', 'category-breakdown', 'spending-trend', 'income-trend'],
  'budget.exceeded': ['budgets', 'notifications'],
  'goal.progress': ['goals'],
  'account.updated': ['accounts', 'dashboard', 'net-worth'],
} as const

export type DomainEvent = keyof typeof INVALIDATION_MAP

export class CacheInvalidator {
  private readonly qc: QueryClient

  constructor(qc: QueryClient) {
    this.qc = qc
  }

  invalidate(event: DomainEvent) {
    const roots = INVALIDATION_MAP[event]
    if (!roots) return
    roots.forEach((root) => {
      this.qc.invalidateQueries({ queryKey: [root] })
    })
  }
}
