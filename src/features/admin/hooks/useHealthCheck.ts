import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

interface HealthCheckItem {
  status: string
  error?: string
  free_gb?: number
  total_gb?: number
  available_gb?: number
  percent_used?: number
}

interface HealthStatus {
  status: 'healthy' | 'degraded'
  version: string
  uptime_seconds: number
  timestamp: string
  checks: {
    database: HealthCheckItem
    redis: HealthCheckItem
    disk: HealthCheckItem
    memory: HealthCheckItem
  }
}

export function useHealthCheck() {
  return useQuery<HealthStatus>({
    queryKey: ['health'],
    queryFn: () => api.get(`/health`).then((r) => r.data),
    refetchInterval: 30_000,
  })
}
