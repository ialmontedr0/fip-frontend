import api from '@/lib/api'
import type { CreateTransferRequest, TransferResponse } from '@/types/transactions'

export function createTransfer(data: CreateTransferRequest) {
  return api.post<TransferResponse>('/transactions/transfer', data)
}
