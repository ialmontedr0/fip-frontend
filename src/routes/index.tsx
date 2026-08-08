import { createBrowserRouter, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import RequireAuth from '@/components/layout/RequireAuth'
import RequireAdmin from '@/components/layout/RequireAdmin'
import { SuspenseWrapper, RouteError } from '@/components/layout/RouteHelpers'
import {
  LoginPage,
  RegisterPage,
  MFAChallengePage,
  RequestResetPage,
  ResetPasswordPage,
  VerifyEmailPage,
  DashboardPage,
  AnalyticsPage,
  SettingsPage,
  AccountListPage,
  AccountCreatePage,
  AccountDetailPage,
  WalletListPage,
  WalletCreatePage,
  WalletDetailPage,
  WalletLiquidityPage,
  CategoryListPage,
  CategoryCreatePage,
  CategoryDetailPage,
  TransactionListPage,
  TransactionCreatePage,
  TransactionDetailPage,
  TransactionEditPage,
  RecurringListPage,
  RecurringCreatePage,
  RecurringDetailPage,
  IncomeListPage,
  IncomeCreatePage,
  IncomeDetailPage,
  IncomeEditPage,
  IncomeSummaryPage,
  SourceListPage,
  SourceCreatePage,
  SourceEditPage,
  ScheduleListPage,
  ScheduleCreatePage,
  RecurringDetectionPage,
  IrregularDetectionPage,
  ExpenseListPage,
  ExpenseCreatePage,
  ExpenseDetailPage,
  ExpenseEditPage,
  ExpenseDashboardPage,
  TemplateListPage,
  ServiceListPage,
  SubscriptionListPage,
  CreditCardListPage,
  BillListPage,
  SplitExpensePage,
  DuplicateListPage,
  RecurringCandidatePage,
  BudgetListPage,
  BudgetCreatePage,
  BudgetEditPage,
  BudgetDetailPage,
  BudgetSummaryPage,
  BudgetAlertsPage,
  GoalListPage,
  GoalCreatePage,
  GoalDetailPage,
  GoalEditPage,
  GoalSummaryPage,
  GoalSimulationPage,
  GoalSimulationListPage,
  GoalSimulationDetailPage,
  CardListPage,
  CardCreatePage,
  CardEditPage,
  CardDetailPage,
  CardBillListPage,
  CardBillPayPage,
  CardSpendingLimitsPage,
  CardAlertsPage,
  CreditPurchaseListPage,
  CreditPurchaseCreatePage,
  CreditPurchaseDetailPage,
  CreditPurchaseSimulatorPage,
  LoanListPage,
  LoanCreatePage,
  LoanDetailPage,
  LoanEditPage,
  LoanAmortizationPage,
  LoanPaymentPage,
  LoanPaymentHistoryPage,
  LoanSimulatorPage,
  TaxDashboardPage,
  TaxCategoriesPage,
  TaxDeductionsPage,
  TaxDeductionCreatePage,
  TaxDeductionEditPage,
  InsuranceListPage,
  InsuranceCreatePage,
  InsuranceEditPage,
  InsuranceDetailPage,
  InsurancePremiumCreatePage,
  InvestmentsPage,
  AssetCreatePage,
  AssetDetailPage,
  PortfolioCreatePage,
  PortfolioDetailPage,
  LentLoanListPage,
  LentLoanSimulatorPage,
  LentLoanCreatePage,
  LentLoanDetailPage,
  ReceiptScanPage,
  AIDashboardPage,
  AIClassifyPage,
  AIPredictPage,
  AIAnomaliesPage,
  AIRecommendationsPage,
  AIHabitsPage,
  AIRisksPage,
  AISavingsPage,
  AISavingsSimulatorPage,
  AIModelsPage,
  AutomationListPage,
  AutomationCreatePage,
  AutomationDetailPage,
  NotificationsPage,
  NotificationPreferencesPage,
  ImportPage,
  ExportPage,
  ProfilePage,
  SecurityPage,
  PreferencesPage,
  SearchPage,
  PlaidItemsPage,
  AdminDashboardPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminRolesPage,
  AdminPermissionsPage,
  AdminAuditLogsPage,
  AdminStatsPage,
  ChatPage,
} from './lazy'

export const router = createBrowserRouter([
  {
    errorElement: <RouteError />,
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
    errorElement: <RouteError />,
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
          {
            path: '/transactions/scan',
            element: (
              <SuspenseWrapper>
                <ReceiptScanPage />
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
          {
            path: '/chat',
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            )
          },
          {
            path: '/chat/:id',
            element: (
              <SuspenseWrapper>
                <ChatPage />
              </SuspenseWrapper>
            )
          },
          // Incomes
          {
            path: '/incomes',
            element: (
              <SuspenseWrapper>
                <IncomeListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/new',
            element: (
              <SuspenseWrapper>
                <IncomeCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/:id',
            element: (
              <SuspenseWrapper>
                <IncomeDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/:id/edit',
            element: (
              <SuspenseWrapper>
                <IncomeEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/summary',
            element: (
              <SuspenseWrapper>
                <IncomeSummaryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/sources',
            element: (
              <SuspenseWrapper>
                <SourceListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/sources/new',
            element: (
              <SuspenseWrapper>
                <SourceCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/sources/:id/edit',
            element: (
              <SuspenseWrapper>
                <SourceEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/schedule',
            element: (
              <SuspenseWrapper>
                <ScheduleListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/schedule/new',
            element: (
              <SuspenseWrapper>
                <ScheduleCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/recurring',
            element: (
              <SuspenseWrapper>
                <RecurringDetectionPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/incomes/irregular',
            element: (
              <SuspenseWrapper>
                <IrregularDetectionPage />
              </SuspenseWrapper>
            ),
          },
          // Expenses
          {
            path: '/expenses',
            element: (
              <SuspenseWrapper>
                <ExpenseListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/new',
            element: (
              <SuspenseWrapper>
                <ExpenseCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/:id',
            element: (
              <SuspenseWrapper>
                <ExpenseDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/:id/edit',
            element: (
              <SuspenseWrapper>
                <ExpenseEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/summary',
            element: (
              <SuspenseWrapper>
                <ExpenseDashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/templates',
            element: (
              <SuspenseWrapper>
                <TemplateListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/services',
            element: (
              <SuspenseWrapper>
                <ServiceListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/subscriptions',
            element: (
              <SuspenseWrapper>
                <SubscriptionListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/cards',
            element: (
              <SuspenseWrapper>
                <CreditCardListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/cards/:cardId/bills',
            element: (
              <SuspenseWrapper>
                <BillListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/split',
            element: (
              <SuspenseWrapper>
                <SplitExpensePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/duplicates',
            element: (
              <SuspenseWrapper>
                <DuplicateListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/expenses/recurring',
            element: (
              <SuspenseWrapper>
                <RecurringCandidatePage />
              </SuspenseWrapper>
            ),
          },
          // Goals
          {
            path: '/goals',
            element: (
              <SuspenseWrapper>
                <GoalListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/summary',
            element: (
              <SuspenseWrapper>
                <GoalSummaryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/new',
            element: (
              <SuspenseWrapper>
                <GoalCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id',
            element: (
              <SuspenseWrapper>
                <GoalDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id/edit',
            element: (
              <SuspenseWrapper>
                <GoalEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id/simulate',
            element: (
              <SuspenseWrapper>
                <GoalSimulationPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id/simulations',
            element: (
              <SuspenseWrapper>
                <GoalSimulationListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/goals/:id/simulations/:simId',
            element: (
              <SuspenseWrapper>
                <GoalSimulationDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Budgets
          {
            path: '/budgets',
            element: (
              <SuspenseWrapper>
                <BudgetListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/new',
            element: (
              <SuspenseWrapper>
                <BudgetCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/:id',
            element: (
              <SuspenseWrapper>
                <BudgetDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/:id/edit',
            element: (
              <SuspenseWrapper>
                <BudgetEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/summary',
            element: (
              <SuspenseWrapper>
                <BudgetSummaryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budgets/alerts',
            element: (
              <SuspenseWrapper>
                <BudgetAlertsPage />
              </SuspenseWrapper>
            ),
          },
          // Cards
          {
            path: '/cards',
            element: (
              <SuspenseWrapper>
                <CardListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/new',
            element: (
              <SuspenseWrapper>
                <CardCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id',
            element: (
              <SuspenseWrapper>
                <CardDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id/edit',
            element: (
              <SuspenseWrapper>
                <CardEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id/bills',
            element: (
              <SuspenseWrapper>
                <CardBillListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id/bills/:billId/pay',
            element: (
              <SuspenseWrapper>
                <CardBillPayPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/:id/limits',
            element: (
              <SuspenseWrapper>
                <CardSpendingLimitsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/cards/alerts',
            element: (
              <SuspenseWrapper>
                <CardAlertsPage />
              </SuspenseWrapper>
            ),
          },
          // Credit Purchases
          {
            path: '/credit-purchases',
            element: (
              <SuspenseWrapper>
                <CreditPurchaseListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/credit-purchases/new',
            element: (
              <SuspenseWrapper>
                <CreditPurchaseCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/credit-purchases/simulator',
            element: (
              <SuspenseWrapper>
                <CreditPurchaseSimulatorPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/credit-purchases/:id',
            element: (
              <SuspenseWrapper>
                <CreditPurchaseDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Loans
          {
            path: '/loans',
            element: (
              <SuspenseWrapper>
                <LoanListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/new',
            element: (
              <SuspenseWrapper>
                <LoanCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/simulator',
            element: (
              <SuspenseWrapper>
                <LoanSimulatorPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id',
            element: (
              <SuspenseWrapper>
                <LoanDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id/edit',
            element: (
              <SuspenseWrapper>
                <LoanEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id/amortization',
            element: (
              <SuspenseWrapper>
                <LoanAmortizationPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id/pay',
            element: (
              <SuspenseWrapper>
                <LoanPaymentPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/loans/:id/payments',
            element: (
              <SuspenseWrapper>
                <LoanPaymentHistoryPage />
              </SuspenseWrapper>
            ),
          },
          // Taxes
          {
            path: '/taxes',
            element: (
              <SuspenseWrapper>
                <TaxDashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/taxes/categories',
            element: (
              <SuspenseWrapper>
                <TaxCategoriesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/taxes/deductions',
            element: (
              <SuspenseWrapper>
                <TaxDeductionsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/taxes/deductions/new',
            element: (
              <SuspenseWrapper>
                <TaxDeductionCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/taxes/deductions/:id/edit',
            element: (
              <SuspenseWrapper>
                <TaxDeductionEditPage />
              </SuspenseWrapper>
            ),
          },
          // Insurance
          {
            path: '/insurance',
            element: (
              <SuspenseWrapper>
                <InsuranceListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/insurance/new',
            element: (
              <SuspenseWrapper>
                <InsuranceCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/insurance/:id',
            element: (
              <SuspenseWrapper>
                <InsuranceDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/insurance/:id/edit',
            element: (
              <SuspenseWrapper>
                <InsuranceEditPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/insurance/:id/premiums/new',
            element: (
              <SuspenseWrapper>
                <InsurancePremiumCreatePage />
              </SuspenseWrapper>
            ),
          },
          // Investments
          {
            path: '/investments',
            element: (
              <SuspenseWrapper>
                <InvestmentsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/assets/new',
            element: (
              <SuspenseWrapper>
                <AssetCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/assets/:id',
            element: (
              <SuspenseWrapper>
                <AssetDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/portfolios/new',
            element: (
              <SuspenseWrapper>
                <PortfolioCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/portfolios/:id',
            element: (
              <SuspenseWrapper>
                <PortfolioDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/lent-loans',
            element: (
              <SuspenseWrapper>
                <LentLoanListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/lent-loans/simulator',
            element: (
              <SuspenseWrapper>
                <LentLoanSimulatorPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/lent-loans/new',
            element: (
              <SuspenseWrapper>
                <LentLoanCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/investments/lent-loans/:id',
            element: (
              <SuspenseWrapper>
                <LentLoanDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Analytics
          {
            path: '/analytics',
            element: (
              <SuspenseWrapper>
                <AnalyticsPage />
              </SuspenseWrapper>
            ),
          },
          // AI
          {
            path: '/ai',
            element: <Navigate to="/ai/dashboard" replace />,
          },
          {
            path: '/ai/dashboard',
            element: (
              <SuspenseWrapper>
                <AIDashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/classify',
            element: (
              <SuspenseWrapper>
                <AIClassifyPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/predict',
            element: (
              <SuspenseWrapper>
                <AIPredictPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/anomalies',
            element: (
              <SuspenseWrapper>
                <AIAnomaliesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/recommendations',
            element: (
              <SuspenseWrapper>
                <AIRecommendationsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/habits',
            element: (
              <SuspenseWrapper>
                <AIHabitsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/risks',
            element: (
              <SuspenseWrapper>
                <AIRisksPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/savings',
            element: (
              <SuspenseWrapper>
                <AISavingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/savings/simulate',
            element: (
              <SuspenseWrapper>
                <AISavingsSimulatorPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ai/models',
            element: (
              <SuspenseWrapper>
                <AIModelsPage />
              </SuspenseWrapper>
            ),
          },
          // Automations
          {
            path: '/automations',
            element: (
              <SuspenseWrapper>
                <AutomationListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/automations/new',
            element: (
              <SuspenseWrapper>
                <AutomationCreatePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/automations/:id',
            element: (
              <SuspenseWrapper>
                <AutomationDetailPage />
              </SuspenseWrapper>
            ),
          },
          // Notifications
          {
            path: '/notifications',
            element: (
              <SuspenseWrapper>
                <NotificationsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/notifications',
            element: (
              <SuspenseWrapper>
                <NotificationPreferencesPage />
              </SuspenseWrapper>
            ),
          },
          // Imports
          {
            path: '/imports',
            element: (
              <SuspenseWrapper>
                <ImportPage />
              </SuspenseWrapper>
            ),
          },
          // Exports
          {
            path: '/exports',
            element: (
              <SuspenseWrapper>
                <ExportPage />
              </SuspenseWrapper>
            ),
          },
          // Search
          {
            path: '/search',
            element: (
              <SuspenseWrapper>
                <SearchPage />
              </SuspenseWrapper>
            ),
          },
          // Plaid
          {
            path: '/plaid',
            element: (
              <SuspenseWrapper>
                <PlaidItemsPage />
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
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/security',
            element: (
              <SuspenseWrapper>
                <SecurityPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/settings/preferences',
            element: (
              <SuspenseWrapper>
                <PreferencesPage />
              </SuspenseWrapper>
            ),
          },
          // Admin (protected by RequireAdmin)
          {
            element: <RequireAdmin />,
            children: [
              {
                path: '/admin',
                element: (
                  <SuspenseWrapper>
                    <AdminDashboardPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/users',
                element: (
                  <SuspenseWrapper>
                    <AdminUsersPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/users/:id',
                element: (
                  <SuspenseWrapper>
                    <AdminUserDetailPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/roles',
                element: (
                  <SuspenseWrapper>
                    <AdminRolesPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/permissions',
                element: (
                  <SuspenseWrapper>
                    <AdminPermissionsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/audit-logs',
                element: (
                  <SuspenseWrapper>
                    <AdminAuditLogsPage />
                  </SuspenseWrapper>
                ),
              },
              {
                path: '/admin/stats',
                element: (
                  <SuspenseWrapper>
                    <AdminStatsPage />
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
