# FIP — Financial Intelligence Platform (Frontend)

Modern, intelligent personal finance management dashboard built with React 19 + TypeScript.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Language | TypeScript (strict) |
| Build | Vite 8 + Rolldown |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| State | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Auth | JWT with auto-refresh interceptor |
| UI | shadcn/ui + Radix primitives + Framer Motion |
| Charts | Recharts + Tremor |
| Tables | TanStack Table v8 |
| Icons | Lucide React |
| Dates | date-fns |

## Features

### Financial Dashboard
- Overview with KPIs, spending breakdown, cash flow
- Net worth tracking with historical chart
- Quick-access navigation to all modules

### Transaction Management
- Full CRUD with advanced filtering, sorting, pagination
- Split transactions, recurring patterns, tags, attachments
- OCR receipt scanning
- Import/export (CSV, Excel, PDF)

### Account & Wallet Management
- Multi-account support (checking, savings, cash, credit)
- Wallet grouping for portfolio organization
- Balance and liquidity tracking

### Budgeting
- Monthly/period budgets with category allocation
- Real-time progress bars and alert thresholds
- Auto-adjust suggestions

### Cards
- Credit cards with bill tracking and payment scheduling
- Spending limits and utilization monitoring
- Alerts for due dates and overspending

### Loans
- Full amortization schedule viewer
- Early payoff calculator with savings projection
- Payment history tracking

### Goals
- Goal creation with target amount and deadline
- Progress tracking with predicted completion date
- "What-if" simulations

### Analytics & AI
- Spending trends, category breakdowns, heatmaps
- Income vs expense cash flow visualization
- AI-powered transaction classification
- Expense and income predictions
- Anomaly detection alerts
- Personalized savings recommendations
- Financial health score and risk assessment
- Spending habit analysis

### Automation
- Create rules for auto-categorization, alerts, transfers
- Execution logs and summary stats

### Admin Panel
- User management (create, edit, status toggle)
- Role & permission management
- Audit log viewer with filters and stats
- Server health monitoring (DB, Redis, disk, memory)

### Security
- JWT with automatic refresh and token rotation
- MFA (TOTP) setup and verification
- Session management
- Rate-limited API calls
- RBAC for admin features

## Project Structure

```
src/
  components/       # Shared UI components (shadcn/ui style)
  features/         # Feature modules (admin, ai, analytics, auth, budgets, etc.)
  hooks/            # Global hooks
  layouts/          # App layouts (protected, auth, admin)
  lib/              # Utilities, API client, constants
  pages/            # Page components (routing targets)
  providers/        # React context providers
  routes/           # Route definitions
  stores/           # Zustand stores (auth)
  types/            # Shared TypeScript types
```

## Quick Start

```bash
# Prerequisites: Node.js 20+, pnpm 9+

cd fip-frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

The app runs at http://localhost:5173 and proxies API calls to http://localhost:8080.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | `http://localhost:8080/api/v1` | Backend API base URL |
| `VITE_APP_NAME` | No | `FIP` | Application name |
| `VITE_APP_URL` | No | `http://localhost:5173` | Public app URL |
| `VITE_APP_DESCRIPTION` | No | `...` | Meta description |
| `VITE_SENTRY_DSN` | No | — | Sentry error tracking DSN |
| `VITE_SENTRY_ENVIRONMENT` | No | `development` | Sentry environment tag |
| `VITE_ENABLE_MOCK` | No | `false` | Enable mock data |
| `VITE_ENABLE_DEBUG` | No | `false` | Enable debug features |

## Available Scripts

```bash
pnpm dev        # Start dev server with HMR
pnpm build      # Production build
pnpm preview    # Preview production build locally
pnpm lint       # ESLint
pnpm tsc        # TypeScript type check
pnpm format     # Format with Prettier
```

## Routes

| Path | Module | Description |
|------|--------|-------------|
| `/login`, `/register` | Auth | Login and registration |
| `/dashboard` | Dashboard | Main overview |
| `/accounts` | Accounts | Financial accounts |
| `/wallets` | Wallets | Wallet management |
| `/transactions` | Transactions | Transaction list and management |
| `/incomes` | Incomes | Income tracking |
| `/expenses` | Expenses | Expense tracking |
| `/budgets` | Budgets | Budget management |
| `/cards` | Cards | Credit card management |
| `/loans` | Loans | Loan tracking |
| `/goals` | Goals | Financial goals |
| `/analytics` | Analytics | Charts and analytics |
| `/ai` | AI | AI insights and predictions |
| `/automations` | Automations | Automation rules |
| `/notifications` | Notifications | User notifications |
| `/settings` | Settings | User preferences |
| `/admin/*` | Admin | Admin panel (users, roles, permissions, audit, stats) |

## Deployment

### Vercel

Connect your GitHub repository to Vercel, set environment variables, and deploy.

```
pnpm build  # Output in dist/
```

A `vercel.json` configures headers (CSP, cache), rewrites (SPA), and redirects.

### Docker (optional)

```bash
docker build -t fip-frontend .
docker run -p 3000:80 fip-frontend
```
