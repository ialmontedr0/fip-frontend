import api from '@/lib/api'
import type {
  CreateSimulationRequest, SimulationResponse,
  ListSimulationsResponse,
} from '@/types/goals'

export function createSimulation(goalId: string, data: CreateSimulationRequest) {
  return api.post<SimulationResponse>(`/goals/${goalId}/simulations`, data)
}

export function listSimulations(goalId: string) {
  return api.get<ListSimulationsResponse>(`/goals/${goalId}/simulations`)
}

export function getSimulation(goalId: string, simulationId: string) {
  return api.get<SimulationResponse>(`/goals/${goalId}/simulations/${simulationId}`)
}

export function deleteSimulation(goalId: string, simulationId: string) {
  return api.delete<{ message: string }>(`/goals/${goalId}/simulations/${simulationId}`)
}

interface ExistingIncome {
  id: string
  description: string
  amount: string
  frequency: string | null
}

interface ExistingExpense {
  id: string
  description: string
  amount: string
}

export function fetchExistingIncomes() {
  return api.get<{ sources: ExistingIncome[] }>('/incomes/sources')
}

export function fetchExistingExpenses() {
  return api.get<{ templates: ExistingExpense[] }>('/expenses/templates')
}
