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
