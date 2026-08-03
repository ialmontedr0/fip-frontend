import api from '@/lib/api'
import type {
  Asset,
  AssetDetail,
  CreateAssetRequest,
  CreateInvestmentTransactionRequest,
  CreatePortfolioRequest,
  InvestmentTransaction,
  ListAssetsResponse,
  ListPortfoliosResponse,
  Portfolio,
  PortfolioDetail,
  PortfolioSummaryResponse,
  PriceHistoryResponse,
  PricePoint,
} from '@/types/investment'

export const investmentsApi = {
  summary: () =>
    api.get<PortfolioSummaryResponse>('/investments/portfolio').then((r) => r.data),

  listAssets: () =>
    api.get<ListAssetsResponse>('/investments/assets').then((r) => r.data),

  getAsset: (id: string) =>
    api.get<AssetDetail>(`/investments/assets/${id}`).then((r) => r.data),

  createAsset: (data: CreateAssetRequest) =>
    api.post<Asset>('/investments/assets', data).then((r) => r.data),

  updateAssetPrice: (id: string, currentPrice: number) =>
    api.patch<Asset>(`/investments/assets/${id}`, { current_price: currentPrice }).then((r) => r.data),

  deleteAsset: (id: string) =>
    api.delete(`/investments/assets/${id}`).then((r) => r.data),

  assetPriceHistory: (id: string, limit = 90) =>
    api.get<PriceHistoryResponse>(`/investments/assets/${id}/price-history`, { params: { limit } }).then((r) => r.data),

  addPricePoint: (id: string, data: { close_price: number; date?: string }) =>
    api.post<PricePoint>(`/investments/assets/${id}/price-history`, data).then((r) => r.data),

  createTransaction: (assetId: string, data: CreateInvestmentTransactionRequest) =>
    api.post<InvestmentTransaction>(`/investments/assets/${assetId}/transactions`, data).then((r) => r.data),

  listTransactions: (assetId: string) =>
    api.get<{ transactions: InvestmentTransaction[]; total: number }>(`/investments/assets/${assetId}/transactions`).then((r) => r.data),

  listPortfolios: () =>
    api.get<ListPortfoliosResponse>('/investments/portfolios').then((r) => r.data),

  getPortfolio: (id: string) =>
    api.get<PortfolioDetail>(`/investments/portfolios/${id}`).then((r) => r.data),

  createPortfolio: (data: CreatePortfolioRequest) =>
    api.post<Portfolio>('/investments/portfolios', data).then((r) => r.data),

  deletePortfolio: (id: string) =>
    api.delete(`/investments/portfolios/${id}`).then((r) => r.data),
}
