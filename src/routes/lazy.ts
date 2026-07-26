import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const MFAChallengePage = lazy(() => import('@/features/auth/pages/MFAChallengePage'))
export const RequestResetPage = lazy(() => import('@/features/auth/pages/RequestResetPage'))
export const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
export const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
export const DashboardPage = lazy(() => import('@/features/analytics/pages/DashboardPage'))
export const AnalyticsPage = lazy(() => import('@/features/analytics/pages/AnalyticsPage'))
export const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))

// Accounts
export const AccountListPage = lazy(() => import('@/features/accounts/pages/AccountListPage'))
export const AccountCreatePage = lazy(() => import('@/features/accounts/pages/AccountCreatePage'))
export const AccountDetailPage = lazy(() => import('@/features/accounts/pages/AccountDetailPage'))

// Wallets
export const WalletListPage = lazy(() => import('@/features/wallets/pages/WalletListPage'))
export const WalletCreatePage = lazy(() => import('@/features/wallets/pages/WalletCreatePage'))
export const WalletDetailPage = lazy(() => import('@/features/wallets/pages/WalletDetailPage'))
export const WalletLiquidityPage = lazy(() => import('@/features/wallets/pages/WalletLiquidityPage'))

// Categories
export const CategoryListPage = lazy(() => import('@/features/categories/pages/CategoryListPage'))
export const CategoryCreatePage = lazy(() => import('@/features/categories/pages/CategoryCreatePage'))
export const CategoryDetailPage = lazy(() => import('@/features/categories/pages/CategoryDetailPage'))

// Transactions
export const TransactionListPage = lazy(() => import('@/features/transactions/pages/TransactionListPage'))
export const TransactionCreatePage = lazy(() => import('@/features/transactions/pages/TransactionCreatePage'))
export const TransactionDetailPage = lazy(() => import('@/features/transactions/pages/TransactionDetailPage'))
export const TransactionEditPage = lazy(() => import('@/features/transactions/pages/TransactionEditPage'))

// Recurring
export const RecurringListPage = lazy(() => import('@/features/transactions/pages/RecurringListPage'))
export const RecurringCreatePage = lazy(() => import('@/features/transactions/pages/RecurringCreatePage'))
export const RecurringDetailPage = lazy(() => import('@/features/transactions/pages/RecurringDetailPage'))

// Incomes
export const IncomeListPage = lazy(() => import('@/features/incomes/pages/IncomeListPage'))
export const IncomeCreatePage = lazy(() => import('@/features/incomes/pages/IncomeCreatePage'))
export const IncomeDetailPage = lazy(() => import('@/features/incomes/pages/IncomeDetailPage'))
export const IncomeEditPage = lazy(() => import('@/features/incomes/pages/IncomeEditPage'))
export const IncomeSummaryPage = lazy(() => import('@/features/incomes/pages/IncomeSummaryPage'))
export const SourceListPage = lazy(() => import('@/features/incomes/pages/SourceListPage'))
export const SourceCreatePage = lazy(() => import('@/features/incomes/pages/SourceCreatePage'))
export const SourceEditPage = lazy(() => import('@/features/incomes/pages/SourceEditPage'))
export const ScheduleListPage = lazy(() => import('@/features/incomes/pages/ScheduleListPage'))
export const ScheduleCreatePage = lazy(() => import('@/features/incomes/pages/ScheduleCreatePage'))
export const RecurringDetectionPage = lazy(() => import('@/features/incomes/pages/RecurringDetectionPage'))
export const IrregularDetectionPage = lazy(() => import('@/features/incomes/pages/IrregularDetectionPage'))

// Expenses
export const ExpenseListPage = lazy(() => import('@/features/expenses/pages/ExpenseListPage'))
export const ExpenseCreatePage = lazy(() => import('@/features/expenses/pages/ExpenseCreatePage'))
export const ExpenseDetailPage = lazy(() => import('@/features/expenses/pages/ExpenseDetailPage'))
export const ExpenseEditPage = lazy(() => import('@/features/expenses/pages/ExpenseEditPage'))
export const ExpenseDashboardPage = lazy(() => import('@/features/expenses/pages/ExpenseDashboardPage'))
export const TemplateListPage = lazy(() => import('@/features/expenses/pages/TemplateListPage'))
export const ServiceListPage = lazy(() => import('@/features/expenses/pages/ServiceListPage'))
export const SubscriptionListPage = lazy(() => import('@/features/expenses/pages/SubscriptionListPage'))
export const CreditCardListPage = lazy(() => import('@/features/expenses/pages/CreditCardListPage'))
export const BillListPage = lazy(() => import('@/features/expenses/pages/BillListPage'))
export const SplitExpensePage = lazy(() => import('@/features/expenses/pages/SplitExpensePage'))
export const DuplicateListPage = lazy(() => import('@/features/expenses/pages/DuplicateListPage'))
export const RecurringCandidatePage = lazy(() => import('@/features/expenses/pages/RecurringCandidatePage'))

// Budgets
export const BudgetListPage = lazy(() => import('@/features/budgets/pages/BudgetListPage'))
export const BudgetCreatePage = lazy(() => import('@/features/budgets/pages/BudgetCreatePage'))
export const BudgetEditPage = lazy(() => import('@/features/budgets/pages/BudgetEditPage'))
export const BudgetDetailPage = lazy(() => import('@/features/budgets/pages/BudgetDetailPage'))
export const BudgetSummaryPage = lazy(() => import('@/features/budgets/pages/BudgetSummaryPage'))
export const BudgetAlertsPage = lazy(() => import('@/features/budgets/pages/BudgetAlertsPage'))

// Cards
export const CardListPage = lazy(() => import('@/features/cards/pages/CardListPage'))
export const CardCreatePage = lazy(() => import('@/features/cards/pages/CardCreatePage'))
export const CardEditPage = lazy(() => import('@/features/cards/pages/CardEditPage'))
export const CardDetailPage = lazy(() => import('@/features/cards/pages/CardDetailPage'))
export const CardBillListPage = lazy(() => import('@/features/cards/pages/CardBillListPage'))
export const CardBillPayPage = lazy(() => import('@/features/cards/pages/CardBillPayPage'))
export const CardSpendingLimitsPage = lazy(() => import('@/features/cards/pages/CardSpendingLimitsPage'))
export const CardAlertsPage = lazy(() => import('@/features/cards/pages/CardAlertsPage'))

// Loans
export const LoanListPage = lazy(() => import('@/features/loans/pages/LoanListPage'))
export const LoanCreatePage = lazy(() => import('@/features/loans/pages/LoanCreatePage'))
export const LoanEditPage = lazy(() => import('@/features/loans/pages/LoanEditPage'))
export const LoanDetailPage = lazy(() => import('@/features/loans/pages/LoanDetailPage'))
export const LoanAmortizationPage = lazy(() => import('@/features/loans/pages/LoanAmortizationPage'))
export const LoanPaymentPage = lazy(() => import('@/features/loans/pages/LoanPaymentPage'))
export const LoanPaymentHistoryPage = lazy(() => import('@/features/loans/pages/LoanPaymentHistoryPage'))
export const LoanSimulatorPage = lazy(() => import('@/features/loans/pages/LoanSimulatorPage'))

// Goals
export const GoalListPage = lazy(() => import('@/features/goals/pages/GoalListPage'))
export const GoalCreatePage = lazy(() => import('@/features/goals/pages/GoalCreatePage'))
export const GoalEditPage = lazy(() => import('@/features/goals/pages/GoalEditPage'))
export const GoalDetailPage = lazy(() => import('@/features/goals/pages/GoalDetailPage'))
export const GoalSummaryPage = lazy(() => import('@/features/goals/pages/GoalSummaryPage'))
export const GoalSimulationPage = lazy(() => import('@/features/goals/pages/GoalSimulationPage'))
export const GoalSimulationListPage = lazy(() => import('@/features/goals/pages/GoalSimulationListPage'))
export const GoalSimulationDetailPage = lazy(() => import('@/features/goals/pages/GoalSimulationDetailPage'))
