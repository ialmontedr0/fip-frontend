import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTemplates, useCreateTemplate, useDeleteTemplate, useCreateExpenseFromTemplate } from '../hooks/useTemplates'
import TemplateCard from '../components/TemplateCard'
import TemplateForm from '../components/TemplateForm'
import ExpenseNav from '../components/ExpenseNav'
import EmptyExpenseState from '../components/EmptyExpenseState'
import { Button, Skeleton, Modal } from '@/components/ui'
import { FileText, AlertCircle, Plus } from 'lucide-react'
import type { CreateTemplateRequest } from '@/types/expenses'
import useConfirm from '@/hooks/useConfirm'

export default function TemplateListPage() {
  const navigate = useNavigate()
  const [formOpen, setFormOpen] = useState(false)
  const { confirm, confirmDialog } = useConfirm()
  const { data: templates, isLoading, isError, refetch } = useTemplates()
  const createMutation = useCreateTemplate()
  const deleteMutation = useDeleteTemplate()
  const useTemplateMutation = useCreateExpenseFromTemplate()

  const handleCreate = (data: CreateTemplateRequest) => {
    createMutation.mutate(data, { onSuccess: () => setFormOpen(false) })
  }

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: 'Eliminar plantilla',
      message: 'Eliminar esta plantilla?',
      confirmLabel: 'Eliminar',
      destructive: true,
    })
    if (ok) deleteMutation.mutate(id)
  }

  const handleUse = (id: string) => {
    const today = new Date().toISOString().split('T')[0]
    useTemplateMutation.mutate({ templateId: id, data: { effective_date: today } }, {
      onSuccess: (res) => navigate(`/expenses/${res.data.id}`),
    })
  }

  const templateList = templates?.templates || []

  return (
    <div className="space-y-5 animate-fade-in">
      <ExpenseNav />

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6 text-white">
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Plantillas</h1>
              <p className="text-blue-100/80 text-sm">Crea gastos rapidos desde plantillas</p>
            </div>
          </div>
          <Button onClick={() => setFormOpen(true)} className="bg-white text-indigo-700 hover:bg-white/90 border-0 rounded-xl shadow-lg shadow-black/10 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Nueva Plantilla
          </Button>
        </div>
        {templates && (
          <div className="relative mt-4 text-sm text-blue-100/70">{templates.templates.length} plantillas</div>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
          <p className="text-red-500 font-medium mb-1">Error al cargar plantillas</p>
          <Button variant="outline" onClick={() => refetch()} className="rounded-xl">Reintentar</Button>
        </div>
      )}

      {!isLoading && !isError && templateList.length === 0 && <EmptyExpenseState variant="templates" />}

      {!isLoading && !isError && templateList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templateList.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onDelete={handleDelete}
              onUse={handleUse}
            />
          ))}
        </div>
      )}

      <Modal isOpen={formOpen} onClose={() => setFormOpen(false)} title="Nueva Plantilla">
        <TemplateForm onSubmit={handleCreate as (data: CreateTemplateRequest) => Promise<void>} isSubmitting={createMutation.isPending} />
      </Modal>
      {confirmDialog}
    </div>
  )
}
