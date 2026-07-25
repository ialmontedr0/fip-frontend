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
  AccountListPage, AccountCreatePage, AccountDetailPage,
  WalletListPage, WalletCreatePage, WalletDetailPage, WalletLiquidityPage,
  CategoryListPage, CategoryCreatePage, CategoryDetailPage,
  TransactionListPage, TransactionCreatePage, TransactionDetailPage, TransactionEditPage,
  RecurringListPage, RecurringCreatePage, RecurringDetailPage,
  IncomeListPage, IncomeCreatePage, IncomeDetailPage, IncomeEditPage, IncomeSummaryPage,
  SourceListPage, SourceCreatePage, SourceEditPage,
  ScheduleListPage, ScheduleCreatePage,
  RecurringDetectionPage, IrregularDetectionPage,
  ExpenseListPage, ExpenseCreatePage, ExpenseDetailPage, ExpenseEditPage,
  ExpenseDashboardPage, TemplateListPage, ServiceListPage, SubscriptionListPage,
  CreditCardListPage, BillListPage, SplitExpensePage, DuplicateListPage, RecurringCandidatePage,
  BudgetListPage, BudgetCreatePage, BudgetEditPage, BudgetDetailPage,
  BudgetSummaryPage, BudgetAlertsPage,
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
                <AccountListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/accounts/new',
            element: (
              <SuspenseWrapper>
                <AccountCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/accounts/:id',
            element: (
              <SuspenseWrapper>
                <AccountDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Wallets
          {
            path: '/wallets',
            element: (
              <SuspenseWrapper>
                <WalletListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/wallets/new',
            element: (
              <SuspenseWrapper>
                <WalletCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/wallets/:id',
            element: (
              <SuspenseWrapper>
                <WalletDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/wallets/:id/liquidity',
            element: (
              <SuspenseWrapper>
                <WalletLiquidityPage />
              </SuspenseWrapper>
            ),
          },
          // Transactions
          {
            path: '/transactions',
            element: (
              <SuspenseWrapper>
                <TransactionListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/new',
            element: (
              <SuspenseWrapper>
                <TransactionCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/:id',
            element: (
              <SuspenseWrapper>
                <TransactionDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/:id/edit',
            element: (
              <SuspenseWrapper>
                <TransactionEditPage />
              </SuspenseWrapper>
            ),
          },
          // Recurring
          {
            path: '/transactions/recurring',
            element: (
              <SuspenseWrapper>
                <RecurringListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/recurring/new',
            element: (
              <SuspenseWrapper>
                <RecurringCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/transactions/recurring/:id',
            element: (
              <SuspenseWrapper>
                <RecurringDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Categories
          {
            path: '/categories',
            element: (
              <SuspenseWrapper>
                <CategoryListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/categories/new',
            element: (
              <SuspenseWrapper>
                <CategoryCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/categories/:id',
            element: (
              <SuspenseWrapper>
                <CategoryDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Incomes
          {
            path: '/incomes',
            element: (<SuspenseWrapper><IncomeListPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/new',
            element: (<SuspenseWrapper><IncomeCreatePage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/:id',
            element: (<SuspenseWrapper><IncomeDetailPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/:id/edit',
            element: (<SuspenseWrapper><IncomeEditPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/summary',
            element: (<SuspenseWrapper><IncomeSummaryPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/sources',
            element: (<SuspenseWrapper><SourceListPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/sources/new',
            element: (<SuspenseWrapper><SourceCreatePage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/sources/:id/edit',
            element: (<SuspenseWrapper><SourceEditPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/schedule',
            element: (<SuspenseWrapper><ScheduleListPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/schedule/new',
            element: (<SuspenseWrapper><ScheduleCreatePage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/recurring',
            element: (<SuspenseWrapper><RecurringDetectionPage /></SuspenseWrapper>),
          },
          {
            path: '/incomes/irregular',
            element: (<SuspenseWrapper><IrregularDetectionPage /></SuspenseWrapper>),
          },
          // Expenses
          {
            path: '/expenses',
            element: (<SuspenseWrapper><ExpenseListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/new',
            element: (<SuspenseWrapper><ExpenseCreatePage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/:id',
            element: (<SuspenseWrapper><ExpenseDetailPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/:id/edit',
            element: (<SuspenseWrapper><ExpenseEditPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/summary',
            element: (<SuspenseWrapper><ExpenseDashboardPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/templates',
            element: (<SuspenseWrapper><TemplateListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/services',
            element: (<SuspenseWrapper><ServiceListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/subscriptions',
            element: (<SuspenseWrapper><SubscriptionListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/cards',
            element: (<SuspenseWrapper><CreditCardListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/cards/:cardId/bills',
            element: (<SuspenseWrapper><BillListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/split',
            element: (<SuspenseWrapper><SplitExpensePage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/duplicates',
            element: (<SuspenseWrapper><DuplicateListPage /></SuspenseWrapper>),
          },
          {
            path: '/expenses/recurring',
            element: (<SuspenseWrapper><RecurringCandidatePage /></SuspenseWrapper>),
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
            element: (<SuspenseWrapper><BudgetListPage /></SuspenseWrapper>),
          },
          {
            path: '/budgets/new',
            element: (<SuspenseWrapper><BudgetCreatePage /></SuspenseWrapper>),
          },
          {
            path: '/budgets/:id',
            element: (<SuspenseWrapper><BudgetDetailPage /></SuspenseWrapper>),
          },
          {
            path: '/budgets/:id/edit',
            element: (<SuspenseWrapper><BudgetEditPage /></SuspenseWrapper>),
          },
          {
            path: '/budgets/summary',
            element: (<SuspenseWrapper><BudgetSummaryPage /></SuspenseWrapper>),
          },
          {
            path: '/budgets/alerts',
            element: (<SuspenseWrapper><BudgetAlertsPage /></SuspenseWrapper>),
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
