import api from '@/lib/api'
import type {
  CreateCreditCardRequest, CreditCardResponse, CardUtilizationResponse,
  UpdateCardRequest, CreateCardBillRequest, CardBillResponse,
  PayBillRequest, CardsSummaryResponse,
} from '@/types/expenses'

export function createCard(data: CreateCreditCardRequest) {
  return api.post<CreditCardResponse>('/cards', data)
}

export function listCards() {
  return api.get<{ cards: CreditCardResponse[]; total: number }>('/cards')
}

export function getCardUtilization(cardId: string) {
  return api.get<CardUtilizationResponse>(`/cards/${cardId}/utilization`)
}

export function getCardsSummary() {
  return api.get<CardsSummaryResponse>('/cards/summary')
}

export function getCard(id: string) {
  return api.get<CreditCardResponse>(`/cards/${id}`)
}

export function updateCard(id: string, data: UpdateCardRequest) {
  return api.patch<CreditCardResponse>(`/cards/${id}`, data)
}

export function deleteCard(id: string) {
  return api.delete<{ message: string }>(`/cards/${id}`)
}

export function getUtilizationHistory(cardId: string, months = 6) {
  return api.get<{ history: Array<{ month: string; utilization: string }> }>(`/cards/${cardId}/utilization/history`, { params: { months } })
}

export function createCardBill(cardId: string, data: CreateCardBillRequest) {
  return api.post<CardBillResponse>(`/cards/${cardId}/bills`, data)
}

export function listCardBills(cardId: string) {
  return api.get<{ bills: CardBillResponse[]; total: number }>(`/cards/${cardId}/bills`)
}

export function updateCardBill(cardId: string, billId: string, data: Partial<CreateCardBillRequest>) {
  return api.patch<CardBillResponse>(`/cards/${cardId}/bills/${billId}`, data)
}

export function deleteCardBill(cardId: string, billId: string) {
  return api.delete<{ message: string }>(`/cards/${cardId}/bills/${billId}`)
}

export function payCardBill(cardId: string, billId: string, data: PayBillRequest) {
  return api.post<CardBillResponse>(`/cards/${cardId}/bills/${billId}/pay`, data)
}
