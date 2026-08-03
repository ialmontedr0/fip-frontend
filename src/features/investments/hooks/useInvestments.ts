import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { investmentsApi } from '../api/investments'
import type { CreateAssetRequest, CreateInvestmentTransactionRequest, CreatePortfolioRequest } from '@/types/investment'

const keys = {
  all: ['investments'] as const,
  summary: () => [...keys.all, 'summary'] as const,
  assets: () => [...keys.all, 'assets'] as const,
  asset: (id: string) => [...keys.assets(), id] as const,
  portfolios: () => [...keys.all, 'portfolios'] as const,
  portfolio: (id: string) => [...keys.portfolios(), id] as const,
  priceHistory: (id: string) => [...keys.asset(id), 'price-history'] as const,
}

export function useInvestmentSummary() {
  return useQuery({
    queryKey: keys.summary(),
    queryFn: () => investmentsApi.summary(),
  })
}

export function useAssets() {
  return useQuery({
    queryKey: keys.assets(),
    queryFn: () => investmentsApi.listAssets(),
  })
}

export function useAsset(id: string) {
  return useQuery({
    queryKey: keys.asset(id),
    queryFn: () => investmentsApi.getAsset(id),
    enabled: !!id,
  })
}

export function useCreateAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAssetRequest) => investmentsApi.createAsset(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assets() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}

export function useUpdateAssetPrice() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, currentPrice }: { id: string; currentPrice: number }) =>
      investmentsApi.updateAssetPrice(id, currentPrice),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: keys.asset(id) })
      qc.invalidateQueries({ queryKey: keys.assets() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}

export function useDeleteAsset() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => investmentsApi.deleteAsset(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.assets() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}

export function useAssetPriceHistory(id: string, limit = 90) {
  return useQuery({
    queryKey: keys.priceHistory(id),
    queryFn: () => investmentsApi.assetPriceHistory(id, limit),
    enabled: !!id,
  })
}

export function useAddPricePoint(assetId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { close_price: number; date?: string }) =>
      investmentsApi.addPricePoint(assetId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.priceHistory(assetId) })
      qc.invalidateQueries({ queryKey: keys.asset(assetId) })
      qc.invalidateQueries({ queryKey: keys.assets() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}

export function useCreateInvestmentTransaction(assetId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateInvestmentTransactionRequest) =>
      investmentsApi.createTransaction(assetId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.asset(assetId) })
      qc.invalidateQueries({ queryKey: keys.assets() })
      qc.invalidateQueries({ queryKey: keys.summary() })
      qc.invalidateQueries({ queryKey: keys.portfolios() })
    },
  })
}

export function usePortfolios() {
  return useQuery({
    queryKey: keys.portfolios(),
    queryFn: () => investmentsApi.listPortfolios(),
  })
}

export function usePortfolio(id: string) {
  return useQuery({
    queryKey: keys.portfolio(id),
    queryFn: () => investmentsApi.getPortfolio(id),
    enabled: !!id,
  })
}

export function useCreatePortfolio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePortfolioRequest) => investmentsApi.createPortfolio(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.portfolios() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}

export function useDeletePortfolio() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => investmentsApi.deletePortfolio(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: keys.portfolios() })
      qc.invalidateQueries({ queryKey: keys.summary() })
    },
  })
}
