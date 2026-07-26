export interface CreateDebitCardRequest {
  name: string
  account_id: string
  last_four_digits?: string | null
  card_network?: string | null
  is_active?: boolean
  color?: string | null
  notes?: string | null
}

export interface UpdateDebitCardRequest {
  name?: string
  last_four_digits?: string | null
  card_network?: string | null
  is_active?: boolean
  color?: string | null
  notes?: string | null
}

export interface DebitCardResponse {
  id: string
  account_id: string
  name: string
  last_four_digits: string | null
  card_network: string | null
  is_active: boolean
  color: string | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ListDebitCardsResponse {
  debit_cards: DebitCardResponse[]
  total: number
}
