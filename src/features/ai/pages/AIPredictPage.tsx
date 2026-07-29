import { useState } from 'react'
import { usePredictExpenses, usePredictIncome } from '../hooks/useAI'
import AIPageHeader from '../components/AIPageHeader'
import AINav from '../components/AINav'
import BackButton from '../components/BackButton'
import AISectionHeader from '../components/AISectionHeader'
import PredictCard from '../components/PredictCard'
import TrainPredictorButton from '../components/TrainPredictorButton'
import { TrendingDown, TrendingUp, BarChart3, Zap, BrainCircuit } from 'lucide-react'

function AIPredictPage() {
  const expenseMutation = usePredictExpenses()
  const incomeMutation = usePredictIncome()
  const lgbmExpenseMutation = usePredictExpenses()
  const lgbmIncomeMutation = usePredictIncome()
  const [expenseResult, setExpenseResult] = useState<{
    predicted_amount: number
    confidence: number
    model_version: string
    reason: string
  } | null>(null)
  const [incomeResult, setIncomeResult] = useState<{
    predicted_amount: number
    confidence: number
    model_version: string
    reason: string
  } | null>(null)
  const [lgbmExpenseResult, setLgbmExpenseResult] = useState<{
    predicted_amount: number
    confidence: number
    model_version: string
    reason: string
  } | null>(null)
  const [lgbmIncomeResult, setLgbmIncomeResult] = useState<{
    predicted_amount: number
    confidence: number
    model_version: string
    reason: string
  } | null>(null)
  const [expenseError, setExpenseError] = useState<string | null>(null)
  const [incomeError, setIncomeError] = useState<string | null>(null)
  const [lgbmExpenseError, setLgbmExpenseError] = useState<string | null>(null)
  const [lgbmIncomeError, setLgbmIncomeError] = useState<string | null>(null)

  const handlePredictExpense = () => {
    setExpenseError(null)
    expenseMutation.mutate(undefined, {
      onSuccess: (data) => setExpenseResult(data),
      onError: (err) => setExpenseError(err instanceof Error ? err.message : 'Error al predecir'),
    })
  }

  const handlePredictIncome = () => {
    setIncomeError(null)
    incomeMutation.mutate(undefined, {
      onSuccess: (data) => setIncomeResult(data),
      onError: (err) => setIncomeError(err instanceof Error ? err.message : 'Error al predecir'),
    })
  }

  const handlePredictLgbmExpense = () => {
    setLgbmExpenseError(null)
    lgbmExpenseMutation.mutate('lgbm_expense_v1.0', {
      onSuccess: (data) => setLgbmExpenseResult(data),
      onError: (err) => setLgbmExpenseError(err instanceof Error ? err.message : 'Error al predecir'),
    })
  }

  const handlePredictLgbmIncome = () => {
    setLgbmIncomeError(null)
    lgbmIncomeMutation.mutate('lgbm_income_v1.0', {
      onSuccess: (data) => setLgbmIncomeResult(data),
      onError: (err) => setLgbmIncomeError(err instanceof Error ? err.message : 'Error al predecir'),
    })
  }

  return (
    <div className="relative space-y-8 pb-8 animate-fade-in">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/15 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl dark:bg-cyan-500/12 animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl dark:bg-indigo-500/8 animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-transparent via-transparent to-gray-100/50 dark:to-gray-950/50" />
      </div>

      <div className="flex items-center gap-2">
        <BackButton to="/ai/dashboard" />
        <AIPageHeader title="Predicciones" subtitle="Predice gastos e ingresos con IA" className="flex-1" />
      </div>

      <AINav />

      <AISectionHeader icon={<BrainCircuit className="h-3.5 w-3.5 text-white" />} title="XGBoost" subtitle="Modelo por defecto" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictCard
          title="Predecir Gastos"
          icon={<TrendingDown className="h-4 w-4 text-white" />}
          gradient="from-rose-400 to-pink-500"
          result={expenseResult}
          onPredict={handlePredictExpense}
          isPending={expenseMutation.isPending}
          error={expenseError}
        />
        <PredictCard
          title="Predecir Ingresos"
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          gradient="from-emerald-400 to-green-500"
          result={incomeResult}
          onPredict={handlePredictIncome}
          isPending={incomeMutation.isPending}
          error={incomeError}
        />
      </div>

      <AISectionHeader icon={<Zap className="h-3.5 w-3.5 text-white" />} title="LightGBM" subtitle="Modelo alternativo (entrena primero)" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PredictCard
          title="Predecir Gastos (LightGBM)"
          icon={<TrendingDown className="h-4 w-4 text-white" />}
          gradient="from-violet-400 to-purple-500"
          result={lgbmExpenseResult}
          onPredict={handlePredictLgbmExpense}
          isPending={lgbmExpenseMutation.isPending}
          error={lgbmExpenseError}
        />
        <PredictCard
          title="Predecir Ingresos (LightGBM)"
          icon={<TrendingUp className="h-4 w-4 text-white" />}
          gradient="from-amber-400 to-orange-500"
          result={lgbmIncomeResult}
          onPredict={handlePredictLgbmIncome}
          isPending={lgbmIncomeMutation.isPending}
          error={lgbmIncomeError}
        />
      </div>

      <AISectionHeader icon={<BarChart3 className="h-3.5 w-3.5 text-white" />} title="Entrenamiento" subtitle="Entrena XGBoost o LightGBM" />
      <TrainPredictorButton />
    </div>
  )
}

export default AIPredictPage