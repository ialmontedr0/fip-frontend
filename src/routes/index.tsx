import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import RequireAuth from '@/components/layout/RequireAuth'
import RequireAdmin from '@/components/layout/RequireAdmin'
import { PlaceholderPage, SuspenseWrapper } from '@/components/layout/RouteHelpers'
import {
  LoginPage, RegisterPage, MFAChallengePage,
  RequestResetPage, ResetPasswordPage, VerifyEmailPage,
  DashboardPage, SettingsPage,
} from './lazy'

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: (
          <SuspenseWrapper>
            <LoginPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/register',
        element: (
          <SuspenseWrapper>
            <RegisterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/mfa',
        element: (
          <SuspenseWrapper>
            <MFAChallengePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/reset-password',
        element: (
          <SuspenseWrapper>
            <RequestResetPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/reset-password/:token',
        element: (
          <SuspenseWrapper>
            <ResetPasswordPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: '/verify-email/:token',
        element: (
          <SuspenseWrapper>
            <VerifyEmailPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: '/dashboard',
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          // Accounts
          {
            path: '/accounts',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Cuentas" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/accounts/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nueva Cuenta" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/accounts/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Cuenta" />
              </SuspenseWrapper>
            ),
          },
          // Wallets
          {
            path: '/wallets',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Wallets" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/wallets/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nuevo Wallet" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/wallets/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Wallet" />
              </SuspenseWrapper>
            ),
          },
          // Transactions
          {
            path: '/transactions',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Transacciones" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nueva Transaccion" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Transaccion" />
              </SuspenseWrapper>
            ),
          },
          // Categories
          {
            path: '/categories',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Categorias" />
              </SuspenseWrapper>
            ),
          },
          // Incomes
          {
            path: '/incomes',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Ingresos" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nuevo Ingreso" />
              </SuspenseWrapper>
            ),
          },
          // Expenses
          {
            path: '/expenses',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Gastos" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nuevo Gasto" />
              </SuspenseWrapper>
            ),
          },
          // Goals
          {
            path: '/goals',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Metas" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nueva Meta" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Meta" />
              </SuspenseWrapper>
            ),
          },
          // Budgets
          {
            path: '/budgets',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Presupuestos" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nuevo Presupuesto" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Presupuesto" />
              </SuspenseWrapper>
            ),
          },
          // Cards
          {
            path: '/cards',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Tarjetas" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Tarjeta" />
              </SuspenseWrapper>
            ),
          },
          // Loans
          {
            path: '/loans',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Prestamos" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nuevo Prestamo" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Detalle Prestamo" />
              </SuspenseWrapper>
            ),
          },
          // Analytics
          {
            path: '/analytics',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Analitica" />
              </SuspenseWrapper>
            ),
          },
          // AI
          {
            path: '/ai',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="IA" />
              </SuspenseWrapper>
            ),
          },
          // Automations
          {
            path: '/automations',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Automatizaciones" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/automations/new',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Nueva Automatizacion" />
              </SuspenseWrapper>
            ),
          },
          // Notifications
          {
            path: '/notifications',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Notificaciones" />
              </SuspenseWrapper>
            ),
          },
          // Imports
          {
            path: '/imports',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Importaciones" />
              </SuspenseWrapper>
            ),
          },
          // Exports
          {
            path: '/exports',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Exportaciones" />
              </SuspenseWrapper>
            ),
          },
          // Settings
          {
            path: '/settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/profile',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Perfil" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/security',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Seguridad" />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/preferences',
            element: (
              <SuspenseWrapper>
                <PlaceholderPage title="Preferencias" />
              </SuspenseWrapper>
            ),
          },
          // Admin (protected by RequireAdmin)
          {
            element: <RequireAdmin />,
            children: [
              {
                path: '/admin/users',
                element: (
                  <SuspenseWrapper>
                    <PlaceholderPage title="Usuarios Admin" />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/roles',
                element: (
                  <SuspenseWrapper>
                    <PlaceholderPage title="Roles Admin" />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/permissions',
                element: (
                  <SuspenseWrapper>
                    <PlaceholderPage title="Permisos Admin" />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/audit-logs',
                element: (
                  <SuspenseWrapper>
                    <PlaceholderPage title="Auditoria" />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/stats',
                element: (
                  <SuspenseWrapper>
                    <PlaceholderPage title="Estadisticas Admin" />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
