import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const MFAChallengePage = lazy(() => import('@/features/auth/pages/MFAChallengePage'))
export const RequestResetPage = lazy(() => import('@/features/auth/pages/RequestResetPage'))
export const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
export const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
export const DashboardPage = lazy(() => import('@/features/analytics/pages/DashboardPage'))
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
