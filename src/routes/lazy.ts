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
export const ProfilePage = lazy(() => import('@/features/settings/pages/ProfilePage'))
export const SecurityPage = lazy(() => import('@/features/settings/pages/SecurityPage'))
export const PreferencesPage = lazy(() => import('@/features/settings/pages/PreferencesPage'))

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

// Chat
export const ChatPage = lazy(() => import('@/features/chat/pages/ChatPage'))

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

// Credit Purchases
export const CreditPurchaseListPage = lazy(() => import('@/features/creditPurchases/pages/CreditPurchaseListPage'))
export const CreditPurchaseCreatePage = lazy(() => import('@/features/creditPurchases/pages/CreditPurchaseCreatePage'))
export const CreditPurchaseDetailPage = lazy(() => import('@/features/creditPurchases/pages/CreditPurchaseDetailPage'))
export const CreditPurchaseSimulatorPage = lazy(() => import('@/features/creditPurchases/pages/CreditPurchaseSimulatorPage'))

// Loans
export const LoanListPage = lazy(() => import('@/features/loans/pages/LoanListPage'))
export const LoanCreatePage = lazy(() => import('@/features/loans/pages/LoanCreatePage'))
export const LoanEditPage = lazy(() => import('@/features/loans/pages/LoanEditPage'))
export const LoanDetailPage = lazy(() => import('@/features/loans/pages/LoanDetailPage'))
export const LoanAmortizationPage = lazy(() => import('@/features/loans/pages/LoanAmortizationPage'))
export const LoanPaymentPage = lazy(() => import('@/features/loans/pages/LoanPaymentPage'))
export const LoanPaymentHistoryPage = lazy(() => import('@/features/loans/pages/LoanPaymentHistoryPage'))
export const LoanSimulatorPage = lazy(() => import('@/features/loans/pages/LoanSimulatorPage'))

// Taxes
export const TaxDashboardPage = lazy(() => import('@/features/taxes/pages/TaxDashboardPage'))
export const TaxCategoriesPage = lazy(() => import('@/features/taxes/pages/TaxCategoriesPage'))
export const TaxDeductionsPage = lazy(() => import('@/features/taxes/pages/TaxDeductionsPage'))
export const TaxDeductionCreatePage = lazy(() => import('@/features/taxes/pages/TaxDeductionCreatePage'))
export const TaxDeductionEditPage = lazy(() => import('@/features/taxes/pages/TaxDeductionEditPage'))

// Insurance
export const InsuranceListPage = lazy(() => import('@/features/insurance/pages/InsuranceListPage'))
export const InsuranceCreatePage = lazy(() => import('@/features/insurance/pages/InsuranceCreatePage'))
export const InsuranceEditPage = lazy(() => import('@/features/insurance/pages/InsuranceEditPage'))
export const InsuranceDetailPage = lazy(() => import('@/features/insurance/pages/InsuranceDetailPage'))
export const InsurancePremiumCreatePage = lazy(() => import('@/features/insurance/pages/InsurancePremiumCreatePage'))

// Investments
export const InvestmentsPage = lazy(() => import('@/features/investments/pages/InvestmentsPage'))
export const AssetCreatePage = lazy(() => import('@/features/investments/pages/AssetCreatePage'))
export const AssetDetailPage = lazy(() => import('@/features/investments/pages/AssetDetailPage'))
export const PortfolioCreatePage = lazy(() => import('@/features/investments/pages/PortfolioCreatePage'))
export const PortfolioDetailPage = lazy(() => import('@/features/investments/pages/PortfolioDetailPage'))

// OCR (Receipt Scanner)
export const ReceiptScanPage = lazy(() => import('@/features/ocr/pages/ReceiptScanPage'))

// Goals
export const GoalListPage = lazy(() => import('@/features/goals/pages/GoalListPage'))
export const GoalCreatePage = lazy(() => import('@/features/goals/pages/GoalCreatePage'))
export const GoalEditPage = lazy(() => import('@/features/goals/pages/GoalEditPage'))
export const GoalDetailPage = lazy(() => import('@/features/goals/pages/GoalDetailPage'))
export const GoalSummaryPage = lazy(() => import('@/features/goals/pages/GoalSummaryPage'))
export const GoalSimulationPage = lazy(() => import('@/features/goals/pages/GoalSimulationPage'))
export const GoalSimulationListPage = lazy(() => import('@/features/goals/pages/GoalSimulationListPage'))
export const GoalSimulationDetailPage = lazy(() => import('@/features/goals/pages/GoalSimulationDetailPage'))

// AI
export const AIDashboardPage = lazy(() => import('@/features/ai/pages/AIDashboardPage'))
export const AIClassifyPage = lazy(() => import('@/features/ai/pages/AIClassifyPage'))
export const AIPredictPage = lazy(() => import('@/features/ai/pages/AIPredictPage'))
export const AIAnomaliesPage = lazy(() => import('@/features/ai/pages/AIAnomaliesPage'))
export const AIRecommendationsPage = lazy(() => import('@/features/ai/pages/AIRecommendationsPage'))
export const AIHabitsPage = lazy(() => import('@/features/ai/pages/AIHabitsPage'))
export const AIRisksPage = lazy(() => import('@/features/ai/pages/AIRisksPage'))
export const AISavingsPage = lazy(() => import('@/features/ai/pages/AISavingsPage'))
export const AISavingsSimulatorPage = lazy(() => import('@/features/ai/pages/AISavingsSimulatorPage'))
export const AIModelsPage = lazy(() => import('@/features/ai/pages/AIModelsPage'))

// Automations
export const AutomationListPage = lazy(() => import('@/features/automations/pages/AutomationListPage'))
export const AutomationCreatePage = lazy(() => import('@/features/automations/pages/AutomationCreatePage'))
export const AutomationDetailPage = lazy(() => import('@/features/automations/pages/AutomationDetailPage'))

// Notifications
export const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage'))
export const NotificationPreferencesPage = lazy(() => import('@/features/notifications/pages/NotificationPreferencesPage'))

// Search
export const SearchPage = lazy(() => import('@/features/search/pages/SearchPage'))

// Imports & Exports
export const ImportPage = lazy(() => import('@/features/imports/pages/ImportPage'))
export const ExportPage = lazy(() => import('@/features/exports/pages/ExportPage'))

// Admin
export const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'))
export const AdminUsersPage = lazy(() => import('@/features/admin/pages/AdminUsersPage'))
export const AdminUserDetailPage = lazy(() => import('@/features/admin/pages/AdminUserDetailPage'))
export const AdminRolesPage = lazy(() => import('@/features/admin/pages/AdminRolesPage'))
export const AdminPermissionsPage = lazy(() => import('@/features/admin/pages/AdminPermissionsPage'))
export const AdminAuditLogsPage = lazy(() => import('@/features/admin/pages/AdminAuditLogsPage'))
export const AdminStatsPage = lazy(() => import('@/features/admin/pages/AdminStatsPage'))
