import api from '@/lib/api'

export interface SearchResult {
  id: string
  description: string
  amount: string
  transaction_type: string
  effective_date: string | null
  category_name: string | null
  account_name: string | null
}

export interface SearchSuggestion {
  type: string
  id: string
  label: string
}

export async function searchTransactions(q: string, limit = 20) {
  return api
    .get<{ results: SearchResult[]; total: number }>('/search/transactions', {
      params: { q, limit },
    })
    .then((r) => r.data)
}

export async function searchSuggestions(q: string) {
  return api
    .get<{ suggestions: SearchSuggestion[] }>('/search/suggestions', {
      params: { q },
    })
    .then((r) => r.data)
}
