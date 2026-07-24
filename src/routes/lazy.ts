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
