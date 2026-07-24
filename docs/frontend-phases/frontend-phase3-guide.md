# Fase 3: Accounts & Wallets - Guia de Implementacion

Version: 1.0
Proyecto: Financial Intelligence Platform (FIP) - Frontend

---

## Indice

1. [Resumen de la Fase](#1-resumen-de-la-fase)
2. [Backend API Reference](#2-backend-api-reference)
3. [Estructura de Archivos](#3-estructura-de-archivos)
4. [Tipos de TypeScript](#4-tipos-de-typescript)
5. [API Client](#5-api-client)
6. [Hooks de TanStack Query](#6-hooks-de-tanstack-query)
7. [Componentes Compartidos](#7-componentes-compartidos)
8. [AccountListPage](#8-accountlistpage)
9. [AccountCreatePage](#9-accountcreatepage)
10. [AccountDetailPage](#10-accountdetailpage)
11. [AccountSummaryWidget](#11-accountsummarywidget)
12. [WalletListPage](#12-walletlistpage)
13. [WalletCreatePage](#13-walletcreatepage)
14. [WalletDetailPage](#14-walletdetailpage)
15. [WalletLiquidityPage](#15-walletliquiditypage)
16. [Drag & Drop para Sort Order](#16-drag--drop-para-sort-order)
17. [Actualizacion de Routing](#17-actualizacion-de-routing)
18. [Verificacion Final](#18-verificacion-final)

---

## 1. Resumen de la Fase

**Estado actual:** Fase 2 completada (Dashboard con KPIs, charts, widgets, layout global).

**Objetivos de Fase 3:**

| Area | Descripcion |
|------|-------------|
| **Accounts CRUD** | Listar, crear, detalle, editar, eliminar (soft-delete) cuentas financieras |
| **AccountSummaryWidget** | Resumen de cuentas agrupado por moneda |
| **Wallets CRUD** | Listar, crear, detalle, editar, eliminar wallets |
| **Wallet-Account Management** | Agregar/remover cuentas de un wallet (multi-select) |
| **Wallet Balance** | Balance de wallet agrupado por moneda |
| **Wallet Liquidity** | Analisis de liquidez (high/medium/low/mixed) por wallet |
| **Drag & Drop** | Reordenar accounts y wallets con @hello-pangea/dnd |
| **Status Badges** | active/inactive/archived/frozen para accounts; active/archived para wallets |

### Convenciones a Seguir

- **API Client**: Todos los llamados van por `lib/api.ts` (Axios instance con interceptors)
- **Server State**: TanStack Query para todos los datos del API. Nada de server data en Zustand.
- **Forms**: React Hook Form + Zod para validacion
- **Toasts**: react-hot-toast para feedback (success/error)
- **Estilo**: TailwindCSS con dark mode via `dark:` prefix
- **Animaciones**: Clases `animate-fade-in` y `animate-slide-up` del tailwind config
- **Componentes UI**: Usar los existentes en `components/ui/` (Card, Button, Input, Badge, Skeleton, Modal, etc.)
- **Iconos**: Lucide React. Para tipos de cuenta: `Landmark` (bank), `Wallet` (cash), `PiggyBank` (savings), `ScrollText` (checking), `WalletCards` (wallet), `Bitcoin` (crypto)
- **Drag & Drop**: `@hello-pangea/dnd` ya esta en package.json

---

## 2. Backend API Reference

### 2.1 Accounts API (`/api/v1/accounts`)

#### POST /accounts — Crear cuenta

**Request:**
```typescript
{
  name: string                    // min 1, max 100 chars
  account_type: 'bank' | 'cash' | 'savings' | 'checking' | 'wallet' | 'crypto'
  currency_code?: string           // default "DOP", ISO 4217
  initial_balance?: number        // default 0.0
  institution?: string | null      // max 200
  account_number_last4?: string | null  // max 4
  icon?: string | null             // max 500 (nombre de icono Lucide)
  color?: string | null            // hex #RRGGBB, max 7
  notes?: string | null            // max 1000
  include_in_net_worth?: boolean   // default true
  include_in_totals?: boolean     // default true
  sort_order?: number             // default 0
}
```

**Response (201):**
```typescript
{
  id: string                       // UUID
  name: string
  account_type: string
  status: string                   // "active"
  currency_code: string
  balance: string                  // "0.0000"
  initial_balance: string | null
  institution: string | null
  account_number_last4: string | null
  icon: string | null
  color: string | null
  notes: string | null
  include_in_net_worth: boolean
  include_in_totals: boolean
  sort_order: number
  created_at: string | null
  updated_at: string | null
}
```

#### GET /accounts — Listar cuentas

**Query params:** `?account_type=bank&include_archived=true`

**Response (200):**
```typescript
{
  accounts: Array<{
    id: string
    name: string
    account_type: string
    status: string
    currency_code: string
    balance: string
    institution: string | null
    icon: string | null
    color: string | null
    include_in_net_worth: boolean
    sort_order: number
    created_at: string | null
  }>,
  total: number
}
```

#### GET /accounts/summary — Resumen por moneda

**Response (200):**
```typescript
{
  total_accounts: number
  by_currency: Record<string, {
    currency: string
    account_count: number
    total_balance: string
  }>
}
```

#### GET /accounts/:id — Detalle de cuenta

**Response (200):** Mismo shape que `AccountResponse`

#### PATCH /accounts/:id — Actualizar cuenta

**Request (todos opcionales):**
```typescript
{
  name?: string
  institution?: string | null
  account_number_last4?: string | null
  icon?: string | null
  color?: string | null
  notes?: string | null
  include_in_net_worth?: boolean
  include_in_totals?: boolean
  sort_order?: number
  status?: 'active' | 'inactive' | 'archived' | 'frozen'
}
```

**Response (200):** `{ message: "Account updated successfully" }`

#### DELETE /accounts/:id — Eliminar cuenta (soft-delete)

**Response (200):** `{ message: string, account_id: string }`

---

### 2.2 Wallets API (`/api/v1/wallets`)

#### POST /wallets — Crear wallet

**Request:**
```typescript
{
  name: string                    // min 1, max 100
  description?: string | null      // max 500
  wallet_type: 'personal' | 'business' | 'savings' | 'investment' | 'daily' | 'emergency'
  icon?: string | null             // max 500
  color?: string | null            // hex #RRGGBB, max 7
  sort_order?: number             // default 0
}
```

**Response (201):**
```typescript
{
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  created_at: string | null
  updated_at: string | null
}
```

#### GET /wallets — Listar wallets

**Query params:** `?wallet_type=personal`

**Response (200):**
```typescript
{
  wallets: Array<{
    id: string
    name: string
    description: string | null
    wallet_type: string
    status: string
    icon: string | null
    color: string | null
    sort_order: number
    account_count: number
    created_at: string | null
  }>,
  total: number
}
```

#### GET /wallets/:id — Detalle de wallet con cuentas vinculadas

**Response (200):**
```typescript
{
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  accounts: Array<{
    id: string
    name: string
    account_type: string
    currency_code: string
    balance: string
    status: string
  }>,
  created_at: string | null
  updated_at: string | null
}
```

#### PATCH /wallets/:id — Actualizar wallet

**Request (todos opcionales):**
```typescript
{
  name?: string
  description?: string | null
  wallet_type?: string
  icon?: string | null
  color?: string | null
  sort_order?: number
  status?: 'active' | 'archived'
}
```

**Response:** `WalletResponse`

#### DELETE /wallets/:id — Eliminar wallet (soft-delete)

**Response:** `{ message: string, wallet_id: string }`

#### POST /wallets/:id/accounts — Agregar cuenta a wallet

**Request:**
```typescript
{
  account_id: string     // UUID de la cuenta
  notes?: string | null  // max 500
}
```

**Response (201):** `{ message: string, wallet_id: string, account_id: string, added_at: string | null }`

#### DELETE /wallets/:id/accounts/:account_id — Remover cuenta de wallet

**Response (200):** `{ message: string, wallet_id: string, account_id: string }`

#### GET /wallets/:id/balance — Balance del wallet por moneda

**Response (200):**
```typescript
{
  wallet_id: string
  wallet_name: string
  total_accounts: number
  by_currency: Record<string, {
    currency: string
    account_count: number
    total_balance: string
  }>
}
```

#### GET /wallets/:id/liquidity — Analisis de liquidez

**Response (200):**
```typescript
{
  wallet_id: string
  wallet_name: string
  overall_level: 'high' | 'medium' | 'low' | 'mixed'
  breakdown: Record<string, {
    account_type: string
    account_count: number
    total_balance: string
    liquidity_level: string
  }>
  total_accounts: number
}
```

**Logica de liquidez (backend):**
- **HIGH**: `cash`, `checking`, `wallet`
- **MEDIUM**: `savings`
- **LOW**: todo lo demas (`bank`, `crypto`)
- **Overall**: si hay LOW → "low", si solo MEDIUM → "medium", si MEDIUM+HIGH → "mixed", si solo HIGH → "high"

---

## 3. Estructura de Archivos

```
src/
  features/
    accounts/
      api/
        accounts.ts            # API functions
      hooks/
        useAccounts.ts         # Queries + Mutations
      components/
        AccountCard.tsx        # Tarjeta individual de cuenta (para lista)
        AccountForm.tsx        # Formulario compartido crear/editar
        AccountTypeBadge.tsx   # Badge con icono + color segun tipo
        AccountStatusBadge.tsx # Badge de estado (active/inactive/archived/frozen)
        AccountSummaryWidget.tsx # Widget resumen por moneda
        DeleteAccountModal.tsx # Modal de confirmacion para eliminar
      pages/
        AccountListPage.tsx
        AccountCreatePage.tsx
        AccountDetailPage.tsx
    wallets/
      api/
        wallets.ts             # API functions
      hooks/
        useWallets.ts          # Queries + Mutations
      components/
        WalletCard.tsx         # Tarjeta individual de wallet
        WalletForm.tsx         # Formulario compartido crear/editar
        WalletTypeBadge.tsx    # Badge con icono + color segun tipo
        WalletStatusBadge.tsx  # Badge de estado (active/archived)
        AddAccountModal.tsx    # Modal multi-select para agregar cuentas
        LiquidityLevelBadge.tsx # Badge de nivel de liquidez
        LiquidityGauge.tsx     # Visualizacion de liquidez
        DeleteWalletModal.tsx  # Modal de confirmacion para eliminar
      pages/
        WalletListPage.tsx
        WalletCreatePage.tsx
        WalletDetailPage.tsx
        WalletLiquidityPage.tsx
  types/
    accounts.ts                # Account types
    wallets.ts                 # Wallet types
  routes/
    index.tsx                  # Actualizar routes con lazy imports
    lazy.ts                    # Agregar lazy imports
```

---

## 4. Tipos de TypeScript

Crear `src/types/accounts.ts`:

```typescript
// ============================================================
// Enums & Constants
// ============================================================

export const ACCOUNT_TYPES = {
  bank: 'Cuenta Bancaria',
  cash: 'Efectivo',
  savings: 'Cuenta de Ahorro',
  checking: 'Cuenta Corriente',
  wallet: 'Billetera Digital',
  crypto: 'Criptomonedas',
} as const

export type AccountType = keyof typeof ACCOUNT_TYPES

export const ACCOUNT_STATUSES = {
  active: 'Activa',
  inactive: 'Inactiva',
  archived: 'Archivada',
  frozen: 'Congelada',
} as const

export type AccountStatus = keyof typeof ACCOUNT_STATUSES

// ============================================================
// API Request types
// ============================================================

export interface CreateAccountRequest {
  name: string
  account_type: AccountType
  currency_code?: string
  initial_balance?: number
  institution?: string | null
  account_number_last4?: string | null
  icon?: string | null
  color?: string | null
  notes?: string | null
  include_in_net_worth?: boolean
  include_in_totals?: boolean
  sort_order?: number
}

export interface UpdateAccountRequest {
  name?: string
  institution?: string | null
  account_number_last4?: string | null
  icon?: string | null
  color?: string | null
  notes?: string | null
  include_in_net_worth?: boolean
  include_in_totals?: boolean
  sort_order?: number
  status?: AccountStatus
}

// ============================================================
// API Response types
// ============================================================

export interface AccountResponse {
  id: string
  name: string
  account_type: string
  status: string
  currency_code: string
  balance: string
  initial_balance: string | null
  institution: string | null
  account_number_last4: string | null
  icon: string | null
  color: string | null
  notes: string | null
  include_in_net_worth: boolean
  include_in_totals: boolean
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface AccountListItem {
  id: string
  name: string
  account_type: string
  status: string
  currency_code: string
  balance: string
  institution: string | null
  icon: string | null
  color: string | null
  include_in_net_worth: boolean
  sort_order: number
  created_at: string | null
}

export interface ListAccountsResponse {
  accounts: AccountListItem[]
  total: number
}

export interface CurrencySummary {
  currency: string
  account_count: number
  total_balance: string
}

export interface AccountSummaryResponse {
  total_accounts: number
  by_currency: Record<string, CurrencySummary>
}

export interface DeleteAccountResponse {
  message: string
  account_id: string
}
```

Crear `src/types/wallets.ts`:

```typescript
// ============================================================
// Enums & Constants
// ============================================================

export const WALLET_TYPES = {
  personal: 'Personal',
  business: 'Negocio',
  savings: 'Ahorro',
  investment: 'Inversion',
  daily: 'Uso Diario',
  emergency: 'Fondo de Emergencia',
} as const

export type WalletType = keyof typeof WALLET_TYPES

export const WALLET_STATUSES = {
  active: 'Activa',
  archived: 'Archivada',
} as const

export type WalletStatus = keyof typeof WALLET_STATUSES

export const LIQUIDITY_LEVELS = {
  high: 'Alta - Acceso inmediato',
  medium: 'Media - Acceso en 1-3 dias',
  low: 'Baja - Acceso variable',
  mixed: 'Mixta - Multiples niveles',
} as const

export type LiquidityLevel = keyof typeof LIQUIDITY_LEVELS

// ============================================================
// API Request types
// ============================================================

export interface CreateWalletRequest {
  name: string
  description?: string | null
  wallet_type: WalletType
  icon?: string | null
  color?: string | null
  sort_order?: number
}

export interface UpdateWalletRequest {
  name?: string
  description?: string | null
  wallet_type?: WalletType
  icon?: string | null
  color?: string | null
  sort_order?: number
  status?: WalletStatus
}

export interface AddAccountRequest {
  account_id: string
  notes?: string | null
}

// ============================================================
// API Response types
// ============================================================

export interface WalletResponse {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  created_at: string | null
  updated_at: string | null
}

export interface WalletListItem {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  account_count: number
  created_at: string | null
}

export interface ListWalletsResponse {
  wallets: WalletListItem[]
  total: number
}

export interface WalletAccountItem {
  id: string
  name: string
  account_type: string
  currency_code: string
  balance: string
  status: string
}

export interface WalletDetailResponse {
  id: string
  name: string
  description: string | null
  wallet_type: string
  status: string
  icon: string | null
  color: string | null
  sort_order: number
  accounts: WalletAccountItem[]
  created_at: string | null
  updated_at: string | null
}

export interface CurrencyBalance {
  currency: string
  account_count: number
  total_balance: string
}

export interface WalletBalanceResponse {
  wallet_id: string
  wallet_name: string
  total_accounts: number
  by_currency: Record<string, CurrencyBalance>
}

export interface LiquidityItem {
  account_type: string
  account_count: number
  total_balance: string
  liquidity_level: string
}

export interface WalletLiquidityResponse {
  wallet_id: string
  wallet_name: string
  overall_level: LiquidityLevel
  breakdown: Record<string, LiquidityItem>
  total_accounts: number
}

export interface AddAccountResponse {
  message: string
  wallet_id: string
  account_id: string
  added_at: string | null
}

export interface DeleteWalletResponse {
  message: string
  wallet_id: string
}
```

---

## 5. API Client

Crear `src/features/accounts/api/accounts.ts`:

```typescript
import api from '@/lib/api'
import type {
  AccountResponse, AccountListItem, ListAccountsResponse,
  AccountSummaryResponse, DeleteAccountResponse,
  CreateAccountRequest, UpdateAccountRequest,
} from '@/types/accounts'

export function createAccount(data: CreateAccountRequest) {
  return api.post<AccountResponse>('/accounts', data)
}

export function listAccounts(params?: { account_type?: string; include_archived?: boolean }) {
  return api.get<ListAccountsResponse>('/accounts', { params })
}

export function getAccountSummary() {
  return api.get<AccountSummaryResponse>('/accounts/summary')
}

export function getAccount(id: string) {
  return api.get<AccountResponse>(`/accounts/${id}`)
}

export function updateAccount(id: string, data: UpdateAccountRequest) {
  return api.patch<{ message: string }>(`/accounts/${id}`, data)
}

export function deleteAccount(id: string) {
  return api.delete<DeleteAccountResponse>(`/accounts/${id}`)
}
```

Crear `src/features/wallets/api/wallets.ts`:

```typescript
import api from '@/lib/api'
import type {
  WalletResponse, WalletListItem, ListWalletsResponse,
  WalletDetailResponse, WalletBalanceResponse, WalletLiquidityResponse,
  AddAccountResponse, DeleteWalletResponse,
  CreateWalletRequest, UpdateWalletRequest, AddAccountRequest,
} from '@/types/wallets'

export function createWallet(data: CreateWalletRequest) {
  return api.post<WalletResponse>('/wallets', data)
}

export function listWallets(params?: { wallet_type?: string }) {
  return api.get<ListWalletsResponse>('/wallets', { params })
}

export function getWallet(id: string) {
  return api.get<WalletDetailResponse>(`/wallets/${id}`)
}

export function updateWallet(id: string, data: UpdateWalletRequest) {
  return api.patch<WalletResponse>(`/wallets/${id}`, data)
}

export function deleteWallet(id: string) {
  return api.delete<DeleteWalletResponse>(`/wallets/${id}`)
}

export function addAccountToWallet(walletId: string, data: AddAccountRequest) {
  return api.post<AddAccountResponse>(`/wallets/${walletId}/accounts`, data)
}

export function removeAccountFromWallet(walletId: string, accountId: string) {
  return api.delete<{ message: string; wallet_id: string; account_id: string }>(
    `/wallets/${walletId}/accounts/${accountId}`,
  )
}

export function getWalletBalance(walletId: string) {
  return api.get<WalletBalanceResponse>(`/wallets/${walletId}/balance`)
}

export function getWalletLiquidity(walletId: string) {
  return api.get<WalletLiquidityResponse>(`/wallets/${walletId}/liquidity`)
}
```

---

## 6. Hooks de TanStack Query

### 6.1 Account Hooks

Crear `src/features/accounts/hooks/useAccounts.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as accountsApi from '../api/accounts'
import type { CreateAccountRequest, UpdateAccountRequest } from '@/types/accounts'

// ---- Queries ----

export function useAccounts(params?: { account_type?: string; include_archived?: boolean }) {
  return useQuery({
    queryKey: ['accounts', params],
    queryFn: () => accountsApi.listAccounts(params).then(r => r.data),
  })
}

export function useAccount(id: string | undefined) {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsApi.getAccount(id!).then(r => r.data),
    enabled: !!id,
  })
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ['accounts', 'summary'],
    queryFn: () => accountsApi.getAccountSummary().then(r => r.data),
  })
}

// ---- Mutations ----

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAccountRequest) => accountsApi.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'summary'] })
      toast.success('Cuenta creada exitosamente')
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message
      toast.error(message || 'Error al crear la cuenta')
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      accountsApi.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      toast.success('Cuenta actualizada exitosamente')
    },
    onError: () => toast.error('Error al actualizar la cuenta'),
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => accountsApi.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['accounts', 'summary'] })
      toast.success('Cuenta eliminada exitosamente')
    },
    onError: () => toast.error('Error al eliminar la cuenta'),
  })
}
```

### 6.2 Wallet Hooks

Crear `src/features/wallets/hooks/useWallets.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import * as walletsApi from '../api/wallets'
import type { CreateWalletRequest, UpdateWalletRequest, AddAccountRequest } from '@/types/wallets'

// ---- Queries ----

export function useWallets(params?: { wallet_type?: string }) {
  return useQuery({
    queryKey: ['wallets', params],
    queryFn: () => walletsApi.listWallets(params).then(r => r.data),
  })
}

export function useWallet(id: string | undefined) {
  return useQuery({
    queryKey: ['wallets', id],
    queryFn: () => walletsApi.getWallet(id!).then(r => r.data),
    enabled: !!id,
  })
}

export function useWalletBalance(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', walletId, 'balance'],
    queryFn: () => walletsApi.getWalletBalance(walletId!).then(r => r.data),
    enabled: !!walletId,
  })
}

export function useWalletLiquidity(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallets', walletId, 'liquidity'],
    queryFn: () => walletsApi.getWalletLiquidity(walletId!).then(r => r.data),
    enabled: !!walletId,
  })
}

// ---- Mutations ----

export function useCreateWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletsApi.createWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet creado exitosamente')
    },
    onError: () => toast.error('Error al crear el wallet'),
  })
}

export function useUpdateWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWalletRequest }) =>
      walletsApi.updateWallet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet actualizado exitosamente')
    },
    onError: () => toast.error('Error al actualizar el wallet'),
  })
}

export function useDeleteWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => walletsApi.deleteWallet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
      toast.success('Wallet eliminado exitosamente')
    },
    onError: () => toast.error('Error al eliminar el wallet'),
  })
}

export function useAddAccountToWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ walletId, data }: { walletId: string; data: AddAccountRequest }) =>
      walletsApi.addAccountToWallet(walletId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'liquidity'] })
      toast.success('Cuenta agregada al wallet')
    },
    onError: () => toast.error('Error al agregar la cuenta'),
  })
}

export function useRemoveAccountFromWallet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ walletId, accountId }: { walletId: string; accountId: string }) =>
      walletsApi.removeAccountFromWallet(walletId, accountId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'balance'] })
      queryClient.invalidateQueries({ queryKey: ['wallets', variables.walletId, 'liquidity'] })
      toast.success('Cuenta removida del wallet')
    },
    onError: () => toast.error('Error al remover la cuenta'),
  })
}
```

---

## 7. Componentes Compartidos

### 7.1 Account Type Icons Map

Crear un mapa de iconos para tipos de cuenta (puede ir en el archivo de constantes o directamente en los componentes):

```typescript
// src/features/accounts/constants.ts
import { Landmark, Wallet, PiggyBank, ScrollText, WalletCards, Bitcoin } from 'lucide-react'
import type { AccountType } from '@/types/accounts'

export const ACCOUNT_TYPE_CONFIG: Record<AccountType, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bgColor: string
}> = {
  bank:     { icon: Landmark,    label: 'Bancaria',     color: 'text-blue-600 dark:text-blue-400',  bgColor: 'bg-blue-100 dark:bg-blue-500/10' },
  cash:     { icon: Wallet,      label: 'Efectivo',     color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-500/10' },
  savings:  { icon: PiggyBank,   label: 'Ahorro',      color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-500/10' },
  checking: { icon: ScrollText,  label: 'Corriente',   color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-500/10' },
  wallet:   { icon: WalletCards, label: 'Digital',     color: 'text-teal-600 dark:text-teal-400',   bgColor: 'bg-teal-100 dark:bg-teal-500/10' },
  crypto:   { icon: Bitcoin,     label: 'Crypto',       color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-500/10' },
}
```

### 7.2 Wallet Type Icons Map

```typescript
// src/features/wallets/constants.ts
import { User, Building2, PiggyBank, TrendingUp, Sunrise, ShieldAlert } from 'lucide-react'
import type { WalletType } from '@/types/wallets'

export const WALLET_TYPE_CONFIG: Record<WalletType, {
  icon: React.ComponentType<{ className?: string }>
  label: string
  color: string
  bgColor: string
}> = {
  personal:   { icon: User,        label: 'Personal',      color: 'text-blue-600',     bgColor: 'bg-blue-100' },
  business:   { icon: Building2,   label: 'Negocio',       color: 'text-indigo-600',   bgColor: 'bg-indigo-100' },
  savings:    { icon: PiggyBank,   label: 'Ahorro',        color: 'text-purple-600',   bgColor: 'bg-purple-100' },
  investment: { icon: TrendingUp,  label: 'Inversion',     color: 'text-green-600',    bgColor: 'bg-green-100' },
  daily:      { icon: Sunrise,     label: 'Uso Diario',    color: 'text-orange-600',   bgColor: 'bg-orange-100' },
  emergency:  { icon: ShieldAlert, label: 'Emergencia',    color: 'text-red-600',      bgColor: 'bg-red-100' },
}
```

### 7.3 AccountStatusBadge

```typescript
// src/features/accounts/components/AccountStatusBadge.tsx
import { Badge } from '@/components/ui'
import type { AccountStatus } from '@/types/accounts'

const STATUS_CONFIG: Record<AccountStatus, { variant: 'success' | 'warning' | 'danger' | 'info' | 'default'; label: string }> = {
  active:   { variant: 'success', label: 'Activa' },
  inactive: { variant: 'warning', label: 'Inactiva' },
  archived: { variant: 'default', label: 'Archivada' },
  frozen:   { variant: 'danger',  label: 'Congelada' },
}

interface Props {
  status: AccountStatus | string
}

export default function AccountStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status as AccountStatus] ?? { variant: 'default' as const, label: status }
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>
}
```

### 7.4 WalletStatusBadge

```typescript
// src/features/wallets/components/WalletStatusBadge.tsx
import { Badge } from '@/components/ui'
import type { WalletStatus } from '@/types/wallets'

const STATUS_CONFIG: Record<WalletStatus, { variant: 'success' | 'default'; label: string }> = {
  active:   { variant: 'success', label: 'Activa' },
  archived: { variant: 'default', label: 'Archivada' },
}

interface Props {
  status: WalletStatus | string
}

export default function WalletStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status as WalletStatus] ?? { variant: 'default' as const, label: status }
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>
}
```

### 7.5 LiquidityLevelBadge

```typescript
// src/features/wallets/components/LiquidityLevelBadge.tsx
import { Badge } from '@/components/ui'
import type { LiquidityLevel } from '@/types/wallets'

const LEVEL_CONFIG: Record<LiquidityLevel, { variant: 'success' | 'warning' | 'danger' | 'info'; label: string }> = {
  high:   { variant: 'success', label: 'Alta' },
  medium: { variant: 'warning', label: 'Media' },
  low:    { variant: 'danger',  label: 'Baja' },
  mixed:  { variant: 'info',    label: 'Mixta' },
}

interface Props {
  level: LiquidityLevel | string
}

export default function LiquidityLevelBadge({ level }: Props) {
  const config = LEVEL_CONFIG[level as LiquidityLevel] ?? { variant: 'default' as const, label: level }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

### 7.6 Currency Formatter Helper

El `formatCurrency` de `lib/utils.ts` ya acepta un segundo parametro `currency`. Asegurate de usarlo:

```typescript
formatCurrency(parseFloat(account.balance), account.currency_code)
```

---

## 8. AccountListPage

**Archivo:** `src/features/accounts/pages/AccountListPage.tsx`

### Layout
- Header con titulo + boton "Nueva Cuenta" que navega a `/accounts/new`
- Tabs de filtro por tipo de cuenta: Todas, Bancaria, Efectivo, Ahorro, Corriente, Digital, Crypto
- Grid de tarjetas (responsive: 1 columna sm:2 lg:3 xl:4)
- Cada tarjeta es un `AccountCard`

### AccountCard Component
```typescript
// Props: account: AccountListItem
// Diseño: Card con hover, gradient accent top border segun tipo, icono + color, balance, status badge, institucion

// Layout:
// - Border-top con gradiente segun ACCOUNT_TYPE_CONFIG[type].color
// - Icono del tipo en circulo con bgColor
// - Nombre de la cuenta
// - Institucion (si existe) en text-sm text-gray-400
// - Balance en text-lg font-bold con formatCurrency
// - Badge de estado (AccountStatusBadge)
// - Currency code en text-xs text-gray-400
// - Click navega a /accounts/:id
```

### Filtros
- URL search params: `?type=bank`
- Usar `useSearchParams` de React Router
- Botones/tabs que cambian el param `type`

### Empty State
- Cuando no hay cuentas, mostrar EmptyState con icono Wallet + "Crea tu primera cuenta" + CTA

### Skeleton
- Mostrar grid de AccountCardSkeletons mientras carga

### Animacion de entrada
- Staggered fade-in para las tarjetas con `animation-delay`

---

## 9. AccountCreatePage

**Archivo:** `src/features/accounts/pages/AccountCreatePage.tsx`

### Formulario (AccountForm)

Usar React Hook Form + Zod:

```typescript
const accountSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  account_type: z.enum(['bank', 'cash', 'savings', 'checking', 'wallet', 'crypto']),
  currency_code: z.string().length(3, 'Debe ser un codigo ISO 4217').default('DOP'),
  initial_balance: z.string().refine(
    (v) => v === '' || !isNaN(Number(v)), 'Debe ser un numero valido'
  ).default('0'),
  institution: z.string().max(200).optional().or(z.literal('')),
  account_number_last4: z.string().max(4).optional().or(z.literal('')),
  icon: z.string().max(500).optional().or(z.literal('')),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un hex valido').optional().or(z.literal('')),
  notes: z.string().max(1000).optional().or(z.literal('')),
  include_in_net_worth: z.boolean().default(true),
  include_in_totals: z.boolean().default(true),
})

type AccountFormData = z.infer<typeof accountSchema>
```

### Campos del Formulario:

| Campo | Tipo | Detalles |
|-------|------|----------|
| name | Input | Texto, required, max 100 |
| account_type | Selector de tipo | 6 opciones con icono + label. Usar ACCOUNT_TYPE_CONFIG |
| currency_code | Selector de moneda | Dropdown con las 19 monedas soportadas |
| initial_balance | Input numerico | Tipo text con validacion, placeholder "0.00" |
| institution | Input | Texto opcional, max 200 |
| account_number_last4 | Input | Texto opcional, max 4 caracteres |
| icon | Icon Picker | Grid de iconos Lucide searchable, opcional |
| color | Color Picker | 12 colores predefinidos + custom hex, opcional |
| notes | Textarea | Opcional, max 1000 |
| include_in_net_worth | Switch/Toggle | Default true |
| include_in_totals | Switch/Toggle | Default true |

### Type Selector

Selector visual con 6 opciones en grid 3x2:
- Cada opcion: icono grande + label + descripcion corta
- Opcion seleccionada: borde primary + bg primary-50
- Ejemplo de opcion:
```
[Landmark]  [Wallet]   [PiggyBank]
Bancaria    Efectivo   Ahorro

[ScrollText] [WalletCards] [Bitcoin]
Corriente    Digital       Crypto
```

### Currency Selector

Dropdown con las 19 monedas. Usar el mapa de `SUPPORTED_CURRENCIES` del backend:
```typescript
export const SUPPORTED_CURRENCIES: Record<string, string> = {
  DOP: 'Peso Dominicano',
  USD: 'Dolar Estadounidense',
  EUR: 'Euro',
  // ... resto de monedas
}
```

### On Submit
1. Convertir `initial_balance` de string a number
2. Limpiar campos opcionales vacios a `null`
3. Llamar `createAccountMutation.mutateAsync(data)`
4. En success: navegar a `/accounts` con toast
5. En error: mostrar errors del API en campos correspondientes

---

## 10. AccountDetailPage

**Archivo:** `src/features/accounts/pages/AccountDetailPage.tsx`

### Layout
- Header con nombre + botones "Editar" y "Eliminar"
- Seccion de informacion en cards:
  - Tipo de cuenta (con icono + color)
  - Balance actual (formateado con moneda)
  - Institucion / ultimos 4 digitos
  - Incluido en patrimonio neto / totales
  - Notas
  - Fechas de creacion/actualizacion
- Boton "Eliminar" abre DeleteAccountModal

### Edit Mode
- Mismo formulario que AccountCreatePage pero precargado con datos existentes
- Usar `useAccount(id)` para obtener datos
- `useUpdateAccount()` mutation
- Los campos editables: name, institution, last4, icon, color, notes, include flags, status

### Status Change
- Selector de estado (active/inactive/archived/frozen)
- Confirmacion al cambiar a "archived" o "frozen"

### DeleteAccountModal
```typescript
// Modal de confirmacion
// Title: "Eliminar Cuenta"
// Description: "Esta accion archivara la cuenta [nombre]. Podras recuperarla desde el archivo."
// Boton confirmar: variant="danger" con texto "Archivar Cuenta"
// Boton cancelar: variant="outline"
```

---

## 11. AccountSummaryWidget

**Archivo:** `src/features/accounts/components/AccountSummaryWidget.tsx`

### Layout
- Card con header "Resumen por Moneda"
- Lista de monedas con:
  - Icono/bandera de moneda
  - Cantidad de cuentas
  - Balance total formateado
- Total general al pie

### Data
```typescript
const { data: summary } = useAccountSummary()
// summary = { total_accounts: number, by_currency: { DOP: { currency, account_count, total_balance }, USD: {...} } }
```

### Visual
- Cada fila de moneda con barra de progreso proporcional al balance total
- Hover con escala sutil
- Si solo hay una moneda, mostrar mas compacto

Este widget se puede reutilizar en:
- AccountListPage (sidebar o seccion superior)
- DashboardPage (si se quiere agregar)
- WalletDetailPage

---

## 12. WalletListPage

**Archivo:** `src/features/wallets/pages/WalletListPage.tsx`

### Layout
- Header con titulo + boton "Nuevo Wallet" que navega a `/wallets/new`
- Grid de tarjetas (responsive)
- Cada tarjeta es un `WalletCard`

### WalletCard Component
```typescript
// Props: wallet: WalletListItem
// Layout:
// - Card con hover shadow
// - Icono del tipo de wallet en circulo con bgColor
// - Nombre del wallet
// - Descripcion (truncada a 2 lineas)
// - Badge de estado (WalletStatusBadge)
// - Contador de cuentas vinculadas
// - Click navega a /wallets/:id
```

### Filtro por tipo
- Tabs: Todos, Personal, Negocio, Ahorro, Inversion, Diario, Emergencia
- Via URL search params

### Drag & Drop Sort
- Usar `@hello-pangea/dnd`
- `DragDropContext` > `Droppable` > `Draggable`
- Al soltar, llamar `updateAccount/updateWallet` con nuevo `sort_order`
- Optimistic update en query cache

---

## 13. WalletCreatePage

**Archivo:** `src/features/wallets/pages/WalletCreatePage.tsx`

### Formulario (WalletForm)

```typescript
const walletSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().max(500).optional().or(z.literal('')),
  wallet_type: z.enum(['personal', 'business', 'savings', 'investment', 'daily', 'emergency']),
  icon: z.string().max(500).optional().or(z.literal('')),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un hex valido').optional().or(z.literal('')),
})

type WalletFormData = z.infer<typeof walletSchema>
```

### Campos:

| Campo | Tipo | Detalles |
|-------|------|----------|
| name | Input | Texto, required, max 100 |
| description | Textarea | Opcional, max 500 |
| wallet_type | Type Selector | 6 opciones con icono + label. Mismo estilo visual que AccountType |
| icon | Icon Picker | Opcional |
| color | Color Picker | Opcional |

### Wallet Type Selector
Igual que AccountType pero con los 6 tipos de wallet, en grid 3x2:
```
[User]        [Building2]   [PiggyBank]
Personal      Negocio       Ahorro

[TrendingUp]  [Sunrise]    [ShieldAlert]
Inversion     Uso Diario   Emergencia
```

---

## 14. WalletDetailPage

**Archivo:** `src/features/wallets/pages/WalletDetailPage.tsx`

### Layout
- Header: nombre + status badge + botones Editar/Eliminar
- Tabs o secciones:
  1. **Informacion General**: tipo, descripcion, color, icono
  2. **Cuentas Vinculadas**: lista de cuentas con balance
  3. **Balance por Moneda**: resumen de balance
  4. **Liquidez**: nivel + breakdown (link a WalletLiquidityPage)

### Cuentas Vinculadas
- Lista de `WalletAccountItem` con:
  - Icono de tipo de cuenta
  - Nombre
  - Tipo
  - Balance (formateado)
  - Status badge
  - Boton "Remover" con confirmacion
- Boton "Agregar Cuenta" abre modal multi-select

### AddAccountModal
```typescript
// Modal con:
// - Search input para filtrar cuentas
// - Lista de cuentas disponibles (no vinculadas actualmente)
// - Cada cuenta: checkbox + icono + nombre + tipo + balance
// - Boton "Agregar Seleccionadas"
// - Usar useAccounts() para listar todas las cuentas, filtrar las que ya estan en el wallet
```

### Confirmacion Remover
```typescript
// Title: "Remover Cuenta"
// Description: "Esta accion removera [nombre de cuenta] del wallet. La cuenta no se eliminara."
```

### Balance por Moneda
- Card con tabla de monedas:
  - Moneda
  - Cantidad de cuentas
  - Balance total
- Usar `useWalletBalance(walletId)`

---

## 15. WalletLiquidityPage

**Archivo:** `src/features/wallets/pages/WalletLiquidityPage.tsx`

### Layout
- Header con nombre del wallet + nivel general de liquidez (LiquidityLevelBadge grande)
- Gauge visual de liquidez:
  - Semi-circular gauge o barra horizontal segmentada
  - Colores: high=green, medium=yellow, low=red, mixed=blue
  - Mostrar el nivel general con animacion

- Breakdown por tipo de cuenta:
  - Tabla o lista con:
    - Tipo de cuenta (con icono)
    - Cantidad de cuentas
    - Balance total
    - Nivel de liquidez de ese tipo (LiquidityLevelBadge)

- Explicacion de niveles:
  - Card informativa: "Alta: Efectivo, Corriente, Digital | Media: Ahorro | Baja: Bancaria, Crypto"

### Liquidity Gauge Component
```typescript
// Visualizacion horizontal con 4 segmentos
// El segmento activo se ilumina, los otros en gris
// Animacion de carga progresiva

// Niveles con colores:
const LIQUIDITY_COLORS = {
  high:   { bg: 'bg-green-500', text: 'text-green-600', label: 'Alta Liquidez' },
  medium: { bg: 'bg-amber-500', text: 'text-amber-600', label: 'Media Liquidez' },
  low:    { bg: 'bg-red-500',   text: 'text-red-600',   label: 'Baja Liquidez' },
  mixed:  { bg: 'bg-blue-500',  text: 'text-blue-600',  label: 'Liquidez Mixta' },
}
```

---

## 16. Drag & Drop para Sort Order

Usar `@hello-pangea/dnd` para reordenar accounts y wallets.

### Patron de Implementacion

```typescript
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

function AccountListPage() {
  const queryClient = useQueryClient()
  const { data } = useAccounts()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !data) return

    const items = Array.from(data.accounts)
    const [reordered] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reordered)

    // Optimistic update
    queryClient.setQueryData(['accounts'], { ...data, accounts: items })

    // Persist new sort orders
    items.forEach((account, index) => {
      if (account.sort_order !== index) {
        updateAccountSortOrder(account.id, index) // llamada PATCH
      }
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="accounts">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((account, index) => (
              <Draggable key={account.id} draggableId={account.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
                  >
                    <AccountCard account={account} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
```

### Consideraciones
- El `sort_order` en el backend es un entero que empieza en 0
- Al hacer drag, recalcular indices: `items.forEach((item, i) => item.sort_order = i)`
- Llamar `updateAccount(item.id, { sort_order: i })` para cada item
- Para evitar multiples llamadas, podrias:
  1. Hacer un batch de PATCH requests con Promise.all
  2. O implementar un endpoint batch (fuera de scope de esta fase)
- Mostrar un indicador visual de "arrastrando" (sombra + rotacion sutil)
- Icono de "grip" (GripVertical de Lucide) en cada tarjeta para indicar que es arrastrable

---

## 17. Actualizacion de Routing

### lazy.ts

Agregar al archivo `src/routes/lazy.ts`:

```typescript
// Accounts
export const AccountListPage = lazy(() => import('@/features/accounts/pages/AccountListPage'))
export const AccountCreatePage = lazy(() => import('@/features/accounts/pages/AccountCreatePage'))
export const AccountDetailPage = lazy(() => import('@/features/accounts/pages/AccountDetailPage'))

// Wallets
export const WalletListPage = lazy(() => import('@/features/wallets/pages/WalletListPage'))
export const WalletCreatePage = lazy(() => import('@/features/wallets/pages/WalletCreatePage'))
export const WalletDetailPage = lazy(() => import('@/features/wallets/pages/WalletDetailPage'))
export const WalletLiquidityPage = lazy(() => import('@/features/wallets/pages/WalletLiquidityPage')) // Ruta nueva: /wallets/:id/liquidity
```

### routes/index.tsx

Reemplazar las rutas Placeholder de accounts y wallets:

```typescript
import {
  // ... existing imports
  AccountListPage, AccountCreatePage, AccountDetailPage,
  WalletListPage, WalletCreatePage, WalletDetailPage, WalletLiquidityPage,
} from './lazy'

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
```

---

## 18. Verificacion Final

```bash
# TypeScript check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

### Checklist Final

**Accounts:**
- [ ] `AccountListPage` muestra todas las cuentas en grid responsive
- [ ] Filtro por tipo de cuenta via tabs funciona
- [ ] `AccountCreatePage` crea cuenta correctamente con todos los campos
- [ ] Type selector visual funciona con 6 tipos
- [ ] Currency selector funciona con 19 monedas
- [ ] Color picker funciona (12 colores + custom hex)
- [ ] `AccountDetailPage` muestra detalle completo
- [ ] Editar cuenta actualiza correctamente
- [ ] Eliminar cuenta (soft-delete) con confirmacion funciona
- [ ] `AccountSummaryWidget` muestra resumen por moneda
- [ ] Status badges (active/inactive/archived/frozen) se muestran correctamente
- [ ] Drag & drop reordena cuentas correctamente

**Wallets:**
- [ ] `WalletListPage` muestra wallets en grid responsive
- [ ] Filtro por tipo de wallet funciona
- [ ] `WalletCreatePage` crea wallet correctamente
- [ ] Wallet type selector visual con 6 tipos funciona
- [ ] `WalletDetailPage` muestra detalle + cuentas vinculadas
- [ ] Agregar cuenta al wallet via modal multi-select funciona
- [ ] Remover cuenta del wallet con confirmacion funciona
- [ ] `WalletLiquidityPage` muestra analisis de liquidez correctamente
- [ ] Balance por moneda se muestra correctamente
- [ ] Status badges (active/archived) se muestran correctamente
- [ ] Drag & drop reordena wallets correctamente

**General:**
- [ ] Sin errores de TypeScript (`pnpm tsc --noEmit`)
- [ ] Sin errores de lint (`pnpm lint`)
- [ ] Build exitoso (`pnpm build`)
- [ ] Dark mode funciona en todas las paginas
- [ ] Responsive funciona en mobile
- [ ] Loading skeletons se muestran mientras carga
- [ ] Empty states se muestran cuando no hay datos
- [ ] Error states con retry button funcionan
- [ ] Toasts de success/error en cada mutation

---

## Estrategias y Recomendaciones

### 1. Optimistic Updates para Drag & Drop
Al reordenar, actualizar el cache de TanStack Query INMEDIATAMENTE antes de que el PATCH al backend responda. Si el PATCH falla, revertir el cache al estado anterior.

```typescript
const handleDragEnd = async (result: DropResult) => {
  // 1. Snapshot current state
  // 2. Update query cache optimistically
  // 3. Send PATCH requests
  // 4. On error: rollback cache
}
```

### 2. Shared AccountPicker Component
Para reutilizar en WalletDetailPage (agregar cuentas) y futuras fases (transactions, budgets), crear un componente `AccountPicker`:

```typescript
// src/features/accounts/components/AccountPicker.tsx
// Props:
// - selected: string[] (IDs seleccionados)
// - onChange: (ids: string[]) => void
// - excludeIds?: string[] (IDs a excluir, ej: cuentas ya en wallet)
// - multiple?: boolean
// - showBalance?: boolean
// - filterByType?: AccountType[]
```

### 3. CurrencyFormatterHelper
El `formatCurrency` actual solo acepta `currency: string`. Para mostrar balances del API (que vienen como string), parsear con `parseFloat()`:

```typescript
formatCurrency(parseFloat(account.balance), account.currency_code)
```

### 4. Manejo de Soft-Delete
El backend NO elimina realmente, sino que pone `deleted_at` y cambia status a "archived". En el frontend:
- Mostrar "Eliminar" como boton destructivo
- Confirmacion: "Esta cuenta sera archivada"
- Opcion de "Ver archivadas" en AccountListPage (pasar `?include_archived=true`)

### 5. Color Picker Reutilizable
Para crear un `ColorPicker` component que pueda usarse en accounts, wallets, categories, etc:

```typescript
// src/components/ui/ColorPicker.tsx
interface ColorPickerProps {
  value: string       // hex color
  onChange: (color: string) => void
}

// 12 colores predefinidos + input custom hex
const PRESET_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#06b6d4', '#84cc16', '#a855f7', '#e11d48',
]
```

### 6. Icon Picker Reutilizable
Para crear un `IconPicker` component:

```typescript
// src/components/ui/IconPicker.tsx
interface IconPickerProps {
  value: string | null       // nombre del icono Lucide
  onChange: (icon: string | null) => void
}

// Grid searchable de iconos Lucide
// Agrupar por categorias: finance, actions, objects, etc.
// Input de busqueda con debounce
```

### 7. Estrategia de Carga
- `AccountListPage` y `WalletListPage`: Cargar datos al montar con `staleTime: 1000 * 60 * 2` (2 min)
- `AccountDetailPage` y `WalletDetailPage`: Cargar con `enabled: !!id`
- Despues de crear/editar/eliminar: Invalidar queries `['accounts']` o `['wallets']`
- Despues de agregar/remover cuenta de wallet: Invalidar queries del wallet especifico

### 8. Estructura de Navegacion
- AccountListPage → click en tarjeta → AccountDetailPage
- AccountDetailPage → click "Editar" → modo edicion en misma pagina
- WalletListPage → click en tarjeta → WalletDetailPage
- WalletDetailPage → click "Ver Liquidez" → WalletLiquidityPage
- Breadcrumbs: Dashboard > Accounts, Dashboard > Wallets, Accounts > [Nombre Cuenta]

### 9. Performance
- AccountListPage con muchas cuentas: usar React.memo en AccountCard
- WalletDetailPage con muchas cuentas vinculadas: virtualizar lista si es necesario
- Drag & drop: evitar re-renders innecesarios con React.memo + useCallback

### 10. Dark Mode
Todos los componentes deben soportar dark mode via `dark:` prefix:
- Cards: `bg-white dark:bg-gray-900`
- Borders: `border-gray-200 dark:border-gray-700`
- Text: `text-gray-900 dark:text-gray-100`
- Backgrounds: `bg-gray-50 dark:bg-gray-950`
- Form inputs: `bg-white dark:bg-gray-800`
```
