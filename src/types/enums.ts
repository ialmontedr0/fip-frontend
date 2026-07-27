export const AccountType = {
  BANK: 'bank',
  CASH: 'cash',
  SAVINGS: 'savings',
  CHECKING: 'checking',
  WALLET: 'wallet',
  CRYPTO: 'crypto',
} as const

export type AccountType = (typeof AccountType)[keyof typeof AccountType]

export const TransactionType = {
  INCOME: 'income',
  EXPENSE: 'expense',
  TRANSFER: 'transfer',
  ADJUSTMENT: 'adjustment',
} as const

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType]

export const TransactionStatus = {
  DRAFT: 'draft',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
} as const

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus]

export const BudgetPeriod = {
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly',
} as const

export type BudgetPeriod = (typeof BudgetPeriod)[keyof typeof BudgetPeriod]

export const GoalType = {
  SAVINGS: 'savings',
  DEBT_PAYOFF: 'debt_payoff',
  INVESTMENT: 'investment',
  EMERGENCY: 'emergency',
  EDUCATION: 'education',
  RETIREMENT: 'retirement',
  CUSTOM: 'custom',
} as const

export type GoalType = (typeof GoalType)[keyof typeof GoalType]

export const LoanType = {
  PERSONAL: 'personal',
  MORTGAGE: 'mortgage',
  AUTO: 'auto',
  STUDENT: 'student',
  BUSINESS: 'business',
  PERSONAL_LINE: 'personal_line',
  PAYDAY: 'payday',
  MICROLOAN: 'microloan',
  CONSOLIDATION: 'consolidation',
} as const

export type LoanType = (typeof LoanType)[keyof typeof LoanType]

export const AutomationTrigger = {
  INCOME_RECEIVED: 'income_received',
  BALANCE_THRESHOLD: 'balance_threshold',
  BUDGET_ALERT: 'budget_alert',
  DATE_BASED: 'date_based',
  TRANSACTION_MATCHED: 'transaction_matched',
} as const

export type AutomationTrigger = (typeof AutomationTrigger)[keyof typeof AutomationTrigger]

export const AutomationAction = {
  TRANSFER_MONEY: 'transfer_money',
  SEND_NOTIFICATION: 'send_notification',
  CREATE_TRANSACTION: 'create_transaction',
  UPDATE_BUDGET: 'update_budget',
  UPDATE_GOAL: 'update_goal',
} as const

export type AutomationAction = (typeof AutomationAction)[keyof typeof AutomationAction]
