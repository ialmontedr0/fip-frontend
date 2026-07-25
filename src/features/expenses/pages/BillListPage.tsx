import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCreditCard, useCardBills, usePayCardBill } from '../hooks/useCreditCards'
import CardBillCard from '../components/CardBillCard'
import PayBillModal from '../components/PayBillModal'
import CreditCardCard from '../components/CreditCardCard'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton } from '@/components/ui'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import type { CardBillResponse, PayBillRequest } from '@/types/expenses'

export default function BillListPage() {
  const { cardId } = useParams<{ cardId: string }>()
  const navigate = useNavigate()
  const [payingBill, setPayingBill] = useState<CardBillResponse | null>(null)

  const { data: card, isLoading: cardLoading } = useCreditCard(cardId || '')
  const { data: bills, isLoading: billsLoading, isError, refetch } = useCardBills(cardId || '')
  const payMutation = usePayCardBill()

  const handlePay = (billId: string, data: PayBillRequest) => {
    payMutation.mutate({ cardId: cardId!, billId, data }, { onSuccess: () => setPayingBill(null) })
  }

  if (cardLoading) {
    return <div className="space-y-4 animate-fade-in"><Skeleton className="h-48 rounded-2xl" /><Skeleton className="h-32 rounded-2xl" /></div>
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-gray-900 p-6 text-white">
        <div className="relative flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/expenses/cards')}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{card?.name || 'Estados de Cuenta'}</h1>
            <p className="text-gray-300 text-sm">
              {bills?.bills?.length || 0} estados de cuenta
            </p>
          </div>
        </div>
      </div>

      {card && <CreditCardCard card={card} onEdit={() => {}} onDelete={() => {}} className="cursor-default" />}

      {billsLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium">Error al cargar estados de cuenta</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl mt-2">Reintentar</Button>
        </div>
      )}

      {!billsLoading && !isError && (!bills || bills?.bills?.length === 0) && <EmptyExpenseState variant="bills" />}

      {!billsLoading && !isError && bills && bills.bills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bills.bills.map((bill) => (
            <CardBillCard
              key={bill.id}
              bill={bill}
              onPay={setPayingBill}
            />
          ))}
        </div>
      )}

      <PayBillModal
        bill={payingBill}
        isOpen={!!payingBill}
        onClose={() => setPayingBill(null)}
        onSubmit={handlePay as (billId: string, data: PayBillRequest) => Promise<void>}
        isSubmitting={payMutation.isPending}
      />
    </div>
  )
}
