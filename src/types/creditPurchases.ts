export const CREDIT_PURCHASE_STATUSES = {
  active: 'Activa',
  completed: 'Completada',
  cancelled: 'Cancelada',
  defaulted: 'En Incumplimiento',
} as const

export type CreditPurchaseStatus = keyof typeof CREDIT_PURCHASE_STATUSES

export const INSTALLMENT_FREQUENCIES = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  quarterly: 'Trimestral',
  quadrimensual: 'Cuatrimestral',
  semestral: 'Semestral',
  annual: 'Anual',
} as const

export type InstallmentFrequency = keyof typeof INSTALLMENT_FREQUENCIES

export const INSTALLMENT_STATUSES = {
  pending: 'Pendiente',
  paid: 'Pagada',
  late: 'Atrasada',
} as const

export type InstallmentStatus = keyof typeof INSTALLMENT_STATUSES

export interface CreateCreditPurchaseRequest {
  item_name: string
  total_price: number
  store_name?: string | null
  description?: string | null
  down_payment?: number
  annual_interest_rate?: number
  installment_count?: number
  installment_frequency?: InstallmentFrequency
  installment_amount?: number | null
  purchase_date?: string | null
  first_due_date?: string | null
  notes?: string | null
}

export interface UpdateCreditPurchaseRequest {
  item_name?: string
  store_name?: string | null
  description?: string | null
  notes?: string | null
  status?: CreditPurchaseStatus
  annual_interest_rate?: number
}

export interface CreditPurchaseListItem {
  id: string
  item_name: string
  store_name: string | null
  total_price: number
  down_payment: number
  financed_amount: number
  installment_amount: number
  installment_count: number
  installment_frequency: string
  total_paid: number
  status: string
  paid_installments: number
  total_installments: number
  purchase_date: string
  created_at: string | null
}

export interface CreditPurchaseInstallment {
  id: string
  installment_number: number
  due_date: string
  amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
  status: InstallmentStatus
  paid_at: string | null
}

export interface CreditPurchaseDetail {
  id: string
  item_name: string
  store_name: string | null
  description: string | null
  total_price: number
  down_payment: number
  financed_amount: number
  annual_interest_rate: number
  installment_count: number
  installment_frequency: string
  installment_amount: number
  calculation_method: string
  total_interest: number
  total_paid: number
  purchase_date: string
  first_due_date: string
  status: string
  notes: string | null
  paid_installments: number
  progress_pct: number
  installments: CreditPurchaseInstallment[]
  created_at: string | null
  updated_at: string | null
}

export interface ListCreditPurchasesResponse {
  purchases: CreditPurchaseListItem[]
  total: number
}

export interface SimulateCreditPurchaseRequest {
  total_price: number
  down_payment?: number
  annual_interest_rate?: number
  installment_count?: number
  installment_frequency?: InstallmentFrequency
  installment_amount?: number | null
  first_due_date?: string | null
}

export interface SimulateInstallmentEntry {
  installment_number: number
  due_date: string
  amount: number
  principal_portion: number
  interest_portion: number
  balance_after: number
}

export interface SimulateCreditPurchaseResponse {
  total_price: number
  down_payment: number
  financed_amount: number
  installment_amount: number
  installment_count: number
  total_paid: number
  total_interest: number
  schedule: SimulateInstallmentEntry[]
}
