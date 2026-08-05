import type { QueryClient } from '@tanstack/react-query'

/**
 * Mapa de invalidación: dominio/evento -> query keys a invalidar.
 * Centraliza las invalidaciones para mantenerlas consistentes.
 * Las raíces coinciden con las claves reales de la app (transactionKeys, budgetKeys, etc.).
 */
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
