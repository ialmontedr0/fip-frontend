import api from '@/lib/api'
import type {
  TransactionResponse, TransactionDetailResponse, ListTransactionsResponse,
  TransactionSummaryResponse, DeleteTransactionResponse,
  CreateTransactionRequest, UpdateTransactionRequest,
  AddTagsRequest, TagResponse, RemoveTagResponse,
  AuditLogResponse,
} from '@/types/transactions'

export function createTransaction(data: CreateTransactionRequest) {
  return api.post<TransactionResponse>('/transactions', data)
}

export function listTransactions(params?: Record<string, unknown>) {
  return api.get<ListTransactionsResponse>('/transactions', { params })
}

export function getTransactionSummary(params: { date_from: string; date_to: string }) {
  return api.get<TransactionSummaryResponse>('/transactions/summary', { params })
}

export function getTransaction(id: string) {
  return api.get<TransactionDetailResponse>(`/transactions/${id}`)
}

export function updateTransaction(id: string, data: UpdateTransactionRequest) {
  return api.patch<TransactionResponse>(`/transactions/${id}`, data)
}

export function deleteTransaction(id: string) {
  return api.delete<DeleteTransactionResponse>(`/transactions/${id}`)
}

export function addTags(transactionId: string, data: AddTagsRequest) {
  return api.post<TagResponse>(`/transactions/${transactionId}/tags`, data)
}

export function removeTag(transactionId: string, tagName: string) {
  return api.delete<RemoveTagResponse>(`/transactions/${transactionId}/tags/${encodeURIComponent(tagName)}`)
}

export function getAuditLog(transactionId: string) {
  return api.get<AuditLogResponse>(`/transactions/${transactionId}/audit`)
}
