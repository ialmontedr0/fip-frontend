import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShoppingCart, ChevronDown, ChevronUp,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useCreateCreditPurchase } from '../hooks/useCreditPurchases'
import { INSTALLMENT_FREQUENCIES } from '@/types/creditPurchases'
import { formatCurrency } from '@/lib/utils'

export default function CreditPurchaseCreatePage() {
  const navigate = useNavigate()
  const create = useCreateCreditPurchase()

  const [itemName, setItemName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [description, setDescription] = useState('')
  const [totalPrice, setTotalPrice] = useState('')
  const [downPayment, setDownPayment] = useState('0')
  const [interestRate, setInterestRate] = useState('0')
  const [installmentCount, setInstallmentCount] = useState('1')
  const [frequency, setFrequency] = useState('monthly')
  const [manualAmount, setManualAmount] = useState('')
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0])
  const [firstDueDate, setFirstDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const price = parseFloat(totalPrice) || 0
  const down = parseFloat(downPayment) || 0
  const financed = price - down

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemName.trim()) {
      toast.error('El nombre del articulo es requerido')
      return
    }
    if (price <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }
    if (down >= price) {
      toast.error('El pago inicial no puede ser mayor o igual al precio total')
      return
    }

    try {
      await create.mutateAsync({
        item_name: itemName.trim(),
        total_price: price,
        store_name: storeName.trim() || null,
        description: description.trim() || null,
        down_payment: down,
        annual_interest_rate: parseFloat(interestRate) || 0,
        installment_count: parseInt(installmentCount) || 1,
        installment_frequency: frequency as any,
        installment_amount: manualAmount ? parseFloat(manualAmount) : null,
        purchase_date: purchaseDate || null,
        first_due_date: firstDueDate || null,
        notes: notes.trim() || null,
      })
      toast.success('Compra a credito creada exitosamente')
      navigate('/credit-purchases')
    } catch {
      toast.error('Error al crear la compra a credito')
    }
  }

  return (
    <div className="relative space-y-6 pb-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="absolute -right-40 top-60 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl dark:bg-teal-500/10" />
      </div>

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/credit-purchases')}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
          <ShoppingCart className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Nueva Compra a Credito</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Registra una nueva compra financiada</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative max-w-2xl space-y-5">
        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Informacion del Articulo</h2>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Nombre del Articulo *</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ej. Lavadora, Telefono, Mueble..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Tienda / Establecimiento</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej. Tienda ABC"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Fecha de Compra</label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Descripcion</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Descripcion opcional..."
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Detalles Financieros</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Precio Total (RD$) *</label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                required
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Pago Inicial (RD$)</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                min={0}
                step="0.01"
              />
            </div>
          </div>

          {price > 0 && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/5 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Monto a Financiar</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(financed)}</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Interes Anual (%)</label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Cantidad de Cuotas</label>
              <input
                type="number"
                value={installmentCount}
                onChange={(e) => setInstallmentCount(e.target.value)}
                min={1}
                max={120}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Frecuencia</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              >
                {Object.entries(INSTALLMENT_FREQUENCIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
            >
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showAdvanced ? 'Ocultar opciones avanzadas' : 'Opciones avanzadas'}
            </button>
            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Monto de Cuota Manual</label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    placeholder="Dejar vacio para calculo automatico"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    min={0}
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Primer Vencimiento</label>
                  <input
                    type="date"
                    value={firstDueDate}
                    onChange={(e) => setFirstDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notas</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Notas adicionales..."
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={create.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            {create.isPending ? 'Creando...' : 'Crear Compra a Credito'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/credit-purchases')}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
