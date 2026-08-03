export const INSURANCE_TYPES = {
  life: 'Seguro de Vida',
  health: 'Seguro de Salud',
  auto: 'Seguro de Auto',
  home: 'Seguro de Hogar',
  travel: 'Seguro de Viaje',
  disability: 'Seguro de Discapacidad',
  other: 'Otro',
} as const

export type InsuranceType = keyof typeof INSURANCE_TYPES

export const INSURANCE_STATUSES = {
  active: 'Activo',
  cancelled: 'Cancelado',
  expired: 'Expirado',
  pending: 'Pendiente',
} as const

export type InsuranceStatus = keyof typeof INSURANCE_STATUSES

export const PREMIUM_FREQUENCIES = {
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  semi_annual: 'Semestral',
  annual: 'Anual',
} as const

export type PremiumFrequency = keyof typeof PREMIUM_FREQUENCIES

export const PREMIUM_STATUSES = {
  pending: 'Pendiente',
  paid: 'Pagado',
  overdue: 'Vencido',
  cancelled: 'Cancelado',
} as const

export type PremiumStatus = keyof typeof PREMIUM_STATUSES

export const PAYMENT_METHODS = {
  bank_transfer: 'Transferencia Bancaria',
  cash: 'Efectivo',
  auto_debit: 'Debito Automatico',
  check: 'Cheque',
  online: 'En Linea',
  mobile: 'Movil',
} as const

export type PaymentMethod = keyof typeof PAYMENT_METHODS

export interface CreateInsuranceRequest {
  name: string
  type: InsuranceType
  start_date: string
  premium_amount: number
  premium_frequency: PremiumFrequency
  provider?: string | null
  policy_number?: string | null
  status?: InsuranceStatus
  end_date?: string | null
  coverage_amount?: number | null
  notes?: string | null
}

export interface UpdateInsuranceRequest {
  name?: string
  type?: InsuranceType
  provider?: string | null
  policy_number?: string | null
  status?: InsuranceStatus
  start_date?: string | null
  end_date?: string | null
  coverage_amount?: number | null
  premium_amount?: number
  premium_frequency?: PremiumFrequency
  notes?: string | null
}

export interface UpdateInsuranceStatusRequest {
  status: InsuranceStatus
}

export interface InsuranceListItem {
  id: string
  name: string
  type: InsuranceType
  provider: string | null
  policy_number: string | null
  status: InsuranceStatus
  start_date: string
  end_date: string | null
  coverage_amount: number | null
  premium_amount: number
  premium_frequency: PremiumFrequency
  policies_count: number
  created_at: string | null
}

export interface InsurancePolicy {
  id: string
  insurance_id: string
  name: string
  description: string | null
  coverage_details: string | null
  deductible: number | null
  created_at: string | null
}

export interface InsurancePremium {
  id: string
  insurance_id: string
  amount: number
  due_date: string
  paid_date: string | null
  status: PremiumStatus
  payment_method: PaymentMethod | null
  created_at: string | null
}

export interface InsuranceDetail {
  id: string
  name: string
  type: InsuranceType
  provider: string | null
  policy_number: string | null
  status: InsuranceStatus
  start_date: string
  end_date: string | null
  coverage_amount: number | null
  premium_amount: number
  premium_frequency: PremiumFrequency
  notes: string | null
  policies: InsurancePolicy[]
  premiums_count: number
  created_at: string | null
}

export interface ListInsurancesResponse {
  insurances: InsuranceListItem[]
  total: number
}

export interface ListPoliciesResponse {
  policies: InsurancePolicy[]
  total: number
}

export interface ListPremiumsResponse {
  premiums: InsurancePremium[]
  total: number
  total_pending_amount: number
}

export interface CreateInsurancePolicyRequest {
  name: string
  description?: string | null
  coverage_details?: string | null
  deductible?: number | null
}

export interface CreateInsurancePremiumRequest {
  amount: number
  due_date: string
  paid_date?: string | null
  payment_method?: PaymentMethod | null
}

export interface MarkPremiumPaidRequest {
  paid_date?: string | null
  payment_method?: PaymentMethod | null
}

export interface UpcomingPremium {
  premium_id: string
  insurance_id: string
  amount: number
  due_date: string
  status: PremiumStatus
}

export interface InsuranceDashboardResponse {
  active_policies: number
  total_monthly_premiums: number
  due_premiums: number
  total_coverage: number
  upcoming_premiums: UpcomingPremium[]
}
