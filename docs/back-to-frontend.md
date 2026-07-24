# Backend to Frontend Mapping Guide

## Overview

This document describes every backend module, its API endpoints, schemas, and the corresponding frontend responsibilities. All endpoints are prefixed with /api/v1.

Base URL: http://localhost:8000/api/v1

---

## 1. Authentication (/auth)

| Method | Path | Description |
|--------|------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login with email/password |
| POST | /auth/mfa/verify | Verify MFA code during login |
| POST | /auth/mfa/enable | Enable MFA (returns QR code) |
| POST | /auth/mfa/disable | Disable MFA |
| POST | /auth/refresh | Refresh access token |
| POST | /auth/logout | Invalidate session |
| POST | /auth/verify-email | Verify email with token |
| POST | /auth/request-email-verification | Request new verification email |
| POST | /auth/request-password-reset | Request password reset |
| POST | /auth/reset-password | Execute password reset |
| GET | /auth/sessions | List active sessions |
| POST | /auth/sessions/revoke | Revoke a specific session |

**Frontend:** Register/login forms, MFA wizard (QR code + verify), token storage + auto-refresh, password reset flow, email verification flow, session management page, protected routes, avatar upload.

---

## 2. Accounts (/accounts)

| Method | Path | Description |
|--------|------|-------------|
| POST | /accounts | Create account |
| GET | /accounts | List all accounts |
| GET | /accounts/summary | Aggregated account summary |
| GET | /accounts/{id} | Get account detail |
| PATCH | /accounts/{id} | Update account |
| DELETE | /accounts/{id} | Soft-delete account |

**Types:** bank, cash, savings, checking, wallet, crypto.

**Frontend:** Account list with type icons + balance, creation form (type selector, currency selector), detail/edit view, summary widget (total by currency), status badges (active/inactive/archived/frozen).

---

## 3. Wallets (/wallets)

| Method | Path | Description |
|--------|------|-------------|
| POST | /wallets | Create wallet |
| GET | /wallets | List wallets |
| GET | /wallets/{id} | Wallet detail with accounts |
| PATCH | /wallets/{id} | Update wallet |
| DELETE | /wallets/{id} | Delete wallet |
| POST | /wallets/{id}/accounts | Add account to wallet |
| DELETE | /wallets/{id}/accounts/{account_id} | Remove account from wallet |
| GET | /wallets/{id}/balance | Balance per currency |
| GET | /wallets/{id}/liquidity | Liquidity analysis |

**Types:** personal, business, savings, investment, daily, emergency.

**Frontend:** Wallet card grid, creation form with type selector, wallet detail with linked accounts, add/remove accounts, balance view per currency, liquidity visualization (high/medium/low/mixed), sort order drag-and-drop.

---

## 4. Transactions (/transactions)

| Method | Path | Description |
|--------|------|-------------|
| POST | /transactions | Create transaction |
| GET | /transactions | List (filtered, paginated) |
| GET | /transactions/summary | Period summary |
| GET | /transactions/{id} | Get detail |
| PATCH | /transactions/{id} | Update |
| DELETE | /transactions/{id} | Soft-delete |
| POST | /transactions/transfer | Create transfer between accounts |
| POST | /transactions/{id}/tags | Add tags |
| DELETE | /transactions/{id}/tags/{tag} | Remove tag |
| POST | /transactions/{id}/attachments | Upload attachment |
| GET | /transactions/{id}/attachments | List attachments |
| DELETE | /transactions/{id}/attachments/{attachment_id} | Delete attachment |
| GET | /transactions/{id}/audit-log | Transaction audit history |
| POST | /transactions/recurring | Create recurring pattern |
| GET | /transactions/recurring | List recurring |
| PATCH | /transactions/recurring/{id} | Update recurring |
| DELETE | /transactions/recurring/{id} | Delete recurring |
| POST | /transactions/recurring/process | Process due recurring |
| POST | /transactions/ocr | OCR receipt/image |

**Frontend:** Transaction list with infinite scroll + filters (type, date range, category, account, search), creation form with account/category/date/tag selectors, detail drawer/modal with AI metadata, transfer wizard, tag management, attachment upload (drag & drop), recurring CRUD with frequency selector, OCR upload with preview, audit log viewer, summary widget, hierarchical category selector.

---

## 5. Categories (/categories)

| Method | Path | Description |
|--------|------|-------------|
| POST | /categories | Create category |
| GET | /categories | List all |
| GET | /categories/stats | Category statistics |
| GET | /categories/{id} | Get detail with subcategories |
| PATCH | /categories/{id} | Update |
| DELETE | /categories/{id} | Soft-delete |
| POST | /categories/categorize | AI categorize transaction |
| POST | /categories/{id}/subcategories | Create subcategory |
| PATCH | /categories/subcategories/{id} | Update subcategory |
| DELETE | /categories/subcategories/{id} | Delete subcategory |

**Frontend:** Category tree with expandable subcategories, CRUD with type/color/icon selectors, system vs user distinction, AI categorization test tool, stats widget, hierarchical searchable picker, color-coded badges, sort order drag-and-drop.

---

## 6. Incomes (/incomes)

| Method | Path | Description |
|--------|------|-------------|
| POST | /incomes | Create income |
| GET | /incomes | List (filtered) |
| GET | /incomes/summary | Period summary |
| GET | /incomes/trends | Income trends |
| GET | /incomes/forecast | Income forecast |
| GET | /incomes/by-source | By source breakdown |
| GET | /incomes/by-category | By category breakdown |
| GET | /incomes/monthly-breakdown | Monthly breakdown |
| GET | /incomes/recurring-candidates | Detect recurring income |
| GET | /incomes/irregular | Irregular income detection |
| GET | /incomes/projected | Projected income |
| GET | /incomes/{id} | Get detail |
| PATCH | /incomes/{id} | Update |
| DELETE | /incomes/{id} | Delete |
| POST | /incomes/batch-status | Batch update status |
| POST | /incomes/sources | Create income source |
| GET | /incomes/sources | List sources |
| GET | /incomes/sources/{id} | Source detail |
| PATCH | /incomes/sources/{id} | Update source |
| DELETE | /incomes/sources/{id} | Delete source |
| POST | /incomes/schedules | Create schedule |
| GET | /incomes/schedules | List schedules |
| GET | /incomes/schedules/{id} | Schedule detail |
| PATCH | /incomes/schedules/{id} | Update schedule |
| DELETE | /incomes/schedules/{id} | Delete schedule |
| POST | /incomes/schedules/{id}/receive | Mark scheduled income as received |

**Frontend:** Income list with type indicators (salary/freelance/business/investment/rental), creation form with source + stability selectors + tax fields, sources CRUD, scheduling with projection methods, summary dashboard, trends chart, forecast visualization, recurring detection, irregular income identification, batch status updates, stability badges.

---

## 7. Expenses (/expenses)

| Method | Path | Description |
|--------|------|-------------|
| POST | /expenses | Create expense |
| POST | /expenses/split | Create split expense |
| GET | /expenses | List (filtered) |
| GET | /expenses/dashboard | Dashboard summary |
| GET | /expenses/patterns | Spending patterns |
| GET | /expenses/duplicates | Detect duplicates |
| GET | /expenses/recurring-candidates | Detect recurring expenses |
| GET | /expenses/{id} | Get detail |
| PATCH | /expenses/{id} | Update |
| DELETE | /expenses/{id} | Delete |
| POST | /expenses/templates | Create template |
| GET | /expenses/templates | List templates |
| GET | /expenses/templates/{id} | Template detail |
| PATCH | /expenses/templates/{id} | Update template |
| DELETE | /expenses/templates/{id} | Delete template |
| POST | /expenses/from-template | Create expense from template |
| POST | /expenses/services | Create service |
| GET | /expenses/services | List services |
| GET | /expenses/services/{id} | Service detail |
| PATCH | /expenses/services/{id} | Update service |
| DELETE | /expenses/services/{id} | Delete service |
| POST | /expenses/services/{id}/mark-paid | Mark service as paid |
| POST | /expenses/subscriptions | Create subscription |
| GET | /expenses/subscriptions | List subscriptions |
| GET | /expenses/subscriptions/summary | Subscription summary |
| GET | /expenses/subscriptions/{id} | Detail |
| PATCH | /expenses/subscriptions/{id} | Update |
| DELETE | /expenses/subscriptions/{id} | Delete |
| POST | /expenses/credit-cards | Create credit card |
| GET | /expenses/credit-cards | List credit cards |
| GET | /expenses/credit-cards/{id} | Detail |
| GET | /expenses/credit-cards/{id}/utilization | Card utilization |
| PATCH | /expenses/credit-cards/{id} | Update |
| DELETE | /expenses/credit-cards/{id} | Delete |
| POST | /expenses/card-bills | Create bill |
| GET | /expenses/card-bills/{id} | Bill detail |
| PATCH | /expenses/card-bills/{id} | Update bill |
| POST | /expenses/card-bills/{id}/pay | Pay bill |

**Frontend:** Expense list with priority indicators + category colors, creation form with optional service/template/subscription links, split expense creator (multi-line), templates CRUD + apply, services (utilities) management with auto-create toggle, subscriptions list with annual cost + recommendations, credit cards with utilization gauge, bill payment flow, dashboard (daily average, subscriptions, category breakdown, daily trend), spending patterns, duplicate detection, recurring candidates.

---

## 8. Goals (/goals)

| Method | Path | Description |
|--------|------|-------------|
| POST | /goals | Create goal |
| GET | /goals | List goals |
| GET | /goals/summary | Goal summary |
| GET | /goals/{id} | Get detail |
| PATCH | /goals/{id} | Update |
| DELETE | /goals/{id} | Delete |
| POST | /goals/simulate | Run goal simulation |
| GET | /goals/{id}/simulations | List simulations |

**Types:** savings, debt_payoff, investment, emergency, education, retirement, custom.

**Frontend:** Goal list with progress bars + status, creation wizard (type -> details -> target -> tracking), detail with progress % + predicted completion + AI recommendations, simulation with projection chart, summary dashboard (on track vs behind), progress ring component, auto-contribute toggle, priority selector (1-5), type icons.

---

## 9. Budgets (/budgets)

| Method | Path | Description |
|--------|------|-------------|
| POST | /budgets | Create budget |
| GET | /budgets | List budgets |
| GET | /budgets/summary | Budget summary |
| GET | /budgets/{id} | Get detail |
| PATCH | /budgets/{id} | Update |
| DELETE | /budgets/{id} | Delete |
| POST | /budgets/{id}/auto-adjust | Auto-adjust budget |
| GET | /budgets/{id}/alerts | List alerts |
| POST | /budgets/alerts/mark-read | Mark alert read |

**Periods:** weekly, biweekly, monthly, quarterly, yearly.

**Frontend:** Budget list with spending bars + status colors (under=green, near=yellow, over=red), creation form with type/period/category/account selectors, detail with spent vs remaining + daily burn rate + projected overspend, summary dashboard (utilization %, over/near counts), alert management, auto-adjust toggle, rollover toggle, threshold slider, strategy selector.

---

## 10. Credit Cards (/cards)

| Method | Path | Description |
|--------|------|-------------|
| POST | /cards | Create card |
| GET | /cards | List cards |
| GET | /cards/{card_id} | Detail |
| PATCH | /cards/{card_id} | Update |
| DELETE | /cards/{card_id} | Delete |
| POST | /cards/{card_id}/bills | Create bill |
| GET | /cards/{card_id}/bills/{bill_id} | Bill detail |
| PATCH | /cards/{card_id}/bills/{bill_id} | Update bill |
| POST | /cards/{card_id}/bills/{bill_id}/pay | Pay bill |
| POST | /cards/{card_id}/spending-limits | Create limit |
| GET | /cards/{card_id}/spending-limits | List limits |
| DELETE | /cards/{card_id}/spending-limits/{limit_id} | Delete limit |
| GET | /cards/{card_id}/alerts | List alerts |
| POST | /cards/alerts/mark-read | Mark alert read |

**Frontend:** Card list with utilization % + network icon + last 4 digits, detail with credit limit + available + utilization gauge, bill management by card with payment status + due dates, pay bill flow, spending limits (daily/weekly/monthly/category), alerts, statement/payment day config, interest rate display.

---

## 11. Loans (/loans)

| Method | Path | Description |
|--------|------|-------------|
| POST | /loans | Create loan |
| GET | /loans | List loans |
| GET | /loans/{loan_id} | Get detail |
| PATCH | /loans/{loan_id} | Update |
| DELETE | /loans/{loan_id} | Delete |
| GET | /loans/{loan_id}/amortization | Amortization schedule |
| POST | /loans/{loan_id}/simulate-early-payoff | Early payoff simulation |
| POST | /loans/{loan_id}/make-payment | Make payment |
| GET | /loans/{loan_id}/payments | Payment history |
| POST | /loans/simulate | Simulate new loan |

**Types:** personal, mortgage, auto, student, business, personal_line, payday, microloan, consolidation.

**Frontend:** Loan list with balance + interest rate + status badges, creation form with type selector (9 types) + interest type + frequency, detail with amortization table + remaining balance + progress, amortization chart (principal vs interest), early payoff simulator, make payment flow, payment history, new loan simulator, status indicators, grace period display.

---

## 12. Analytics (/analytics)

| Method | Path | Description |
|--------|------|-------------|
| GET | /analytics/kpi | Monthly KPIs |
| GET | /analytics/cash-flow | Cash flow data |
| GET | /analytics/net-worth | Net worth over time |
| GET | /analytics/trends | Spending/income trends |
| GET | /analytics/category-breakdown | Category distribution |
| GET | /analytics/heatmap | Spending heatmap |
| GET | /analytics/dashboard | Full dashboard data |

**Frontend:** KPI cards (income, expenses, net flow, savings rate, top category), cash flow area/bar chart, net worth line chart, trend charts with customizable period/granularity, category breakdown pie/doughnut/bar charts, spending heatmap (day-of-week x week-of-month or x hour), composite dashboard with date range selector, chart export as image, interactive tooltips.

---

## 13. AI (/ai)

| Method | Path | Description |
|--------|------|-------------|
| POST | /ai/classify | Classify single transaction |
| POST | /ai/classify-batch | Classify batch of uncategorized |
| POST | /ai/train-predictor | Train expense/income predictor |
| POST | /ai/detect-anomalies | Detect anomalies |
| POST | /ai/recommend | Get recommendations |
| POST | /ai/habits | Spending habits analysis |
| POST | /ai/risk | Financial risk assessment |
| POST | /ai/savings | Savings optimization |
| POST | /ai/explain | Explain recommendation |

**Frontend:** Classification results (category + confidence + method), batch classification with progress, train predictor with status feedback, anomaly list with severity, recommendations feed with explanation + savings + priority, habits dashboard with score + radar chart, risk assessment with health score gauge + factors, savings optimizer with 50/30/20 visualization, savings simulator with projection chart, explanation cards (headline + why + how + impact + action), confidence indicators (color-coded).

---

## 14. Automations (/automations)

| Method | Path | Description |
|--------|------|-------------|
| POST | /automations | Create rule |
| GET | /automations | List rules |
| GET | /automations/summary | Automation summary |
| GET | /automations/templates | List templates |
| GET | /automations/{id} | Rule detail |
| PATCH | /automations/{id} | Update rule |
| DELETE | /automations/{id} | Delete rule |
| POST | /automations/{id}/execute | Manual execute |
| GET | /automations/{id}/logs | Execution logs |

**Triggers:** income_received, balance_threshold, budget_alert, date_based, transaction_matched.
**Actions:** transfer_money, send_notification, create_transaction, update_budget, update_goal.

**Frontend:** Rules list with trigger/action descriptions + active toggle, rule creation wizard (trigger -> conditions -> action -> params -> review), dynamic condition/param builders, active toggle, execution count + last execution display, manual execute button, execution log viewer, templates (pre-built patterns), summary (total, active, monthly executions), max executions/month input, min balance safeguard.

---

## 15. Notifications (/notifications)

| Method | Path | Description |
|--------|------|-------------|
| GET | /notifications | List notifications |
| GET | /notifications/stats | Notification stats |
| POST | /notifications/mark-read | Bulk mark as read |
| GET | /notifications/preferences | Get preferences |
| PUT | /notifications/preferences | Update preferences |
| POST | /notifications/test | Send test notification |

**Channels:** email, push, telegram, discord, webhook.

**Frontend:** Bell icon with unread count badge, notification drawer/panel, bulk mark as read, preferences page with channel toggles + per-channel type filtering, channel-specific config (Telegram chat ID, Discord webhook, etc.), test notification button, real-time updates (polling/WebSocket), type icons + colors, timestamp formatting.

---

## 16. Exports (/exports)

| Method | Path | Description |
|--------|------|-------------|
| POST | /exports/transactions | Export transactions (CSV/Excel/PDF) |
| POST | /exports/budget | Export budgets (CSV/Excel/PDF) |
| POST | /exports/goals | Export goals (CSV/Excel/PDF) |
| POST | /exports/calendar | Export as .ics calendar |

**Frontend:** Export button with format selector (CSV/Excel/PDF), filter config before export, download progress, calendar export (.ics), file download handling, date range picker.

---

## 17. Imports (/imports)

| Method | Path | Description |
|--------|------|-------------|
| POST | /imports/upload | Upload file for import |
| GET | /imports/preview/{job_id} | Preview import result |
| POST | /imports/confirm/{job_id} | Confirm import |
| GET | /imports/jobs | List import jobs |
| GET | /imports/jobs/{job_id} | Job detail |

**Frontend:** File upload (drag & drop) for CSV/Excel, preview step with parsed rows + column mapping + validation errors, confirm/reject, import job history with status indicators, job detail with row counts + error details, column mapping UI, duplicate detection display, progress bar, error row view with correction.

---

## 18. Financial Data (/financial-data)

| Method | Path | Description |
|--------|------|-------------|
| GET | /financial-data/exchange-rates | Get current rates |
| GET | /financial-data/exchange-rates/historical | Historical rates |
| GET | /financial-data/exchange-rates/range | Date range rates |

**Frontend:** Exchange rate widget, currency conversion calculator, multi-currency balance with conversion, historical rate chart, date range selector, base currency selector.

---

## 19. Admin (/admin)

| Method | Path | Description |
|--------|------|-------------|
| GET | /admin/users | List all users |
| GET | /admin/users/{user_id} | User detail |
| PATCH | /admin/users/{user_id}/role | Update user role |
| PATCH | /admin/users/{user_id}/status | Update user status |
| GET | /admin/roles | List roles |
| POST | /admin/roles | Create role |
| PATCH | /admin/roles/{role_id} | Update role |
| DELETE | /admin/roles/{role_id} | Delete role |
| GET | /admin/permissions | List permissions |
| POST | /admin/roles/{role_id}/permissions | Assign permission |
| DELETE | /admin/roles/{role_id}/permissions/{permission_id} | Remove permission |
| GET | /admin/audit-logs | List audit logs |
| GET | /admin/audit-logs/stats | Audit log statistics |
| GET | /admin/stats | System statistics |

**Frontend:** User management table (search, filter, paginate), user detail with role + status, role change dropdown, status toggle, role CRUD, permission assignment per role, audit log viewer with filters, audit log stats dashboard, system stats dashboard, admin-only route protection.

---

## 20. Data Types & Conventions

**Amounts:** Decimal (precision 19, scale 4), transmitted as strings. Frontend parses as number for display, sends as string.

**IDs:** UUIDs as strings.

**Dates:** YYYY-MM-DD strings. **DateTimes:** ISO 8601 with timezone, UTC.

**Pagination:** page, page_size query params; response includes total, page, page_size, total_pages.

**Error format:**
`json
{"success": false, "error": {"code": "...", "message": "...", "details": []}}
`

**Auth:** Bearer token in Authorization header. Access token expires in 15 min. Refresh token for renewal. Rate limiting via Redis.

**Soft delete:** All entities use deleted_at timestamp. Lists exclude deleted by default.

**Ownership:** All entities scoped to user via JWT. Admin can access any.

**HTTP status:** 200 success, 201 created, 422 validation, 401 unauthorized, 403 forbidden, 404 not found, 409 conflict, 429 rate limited, 500 server error.
