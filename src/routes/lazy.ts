import { lazy } from 'react'

export const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'))
export const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'))
export const MFAChallengePage = lazy(() => import('@/features/auth/pages/MFAChallengePage'))
export const RequestResetPage = lazy(() => import('@/features/auth/pages/RequestResetPage'))
export const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
export const VerifyEmailPage = lazy(() => import('@/features/auth/pages/VerifyEmailPage'))
export const DashboardPage = lazy(() => import('@/features/analytics/pages/DashboardPage'))
export const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))
