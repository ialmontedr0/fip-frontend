import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories'
import CategoryBadge from '../components/CategoryBadge'
import CategoryTypeBadge from '../components/CategoryTypeBadge'
import CategoryForm, { type CategoryFormData } from '../components/CategoryForm'
import SubcategoryList from '../components/SubcategoryList'
import DeleteCategoryModal from '../components/DeleteCategoryModal'
import { Button, Skeleton, ErrorMessage } from '@/components/ui'
import { cn } from '@/lib/utils'
import { ArrowLeft, Edit2, Trash2, Lock, Calendar, Layers } from 'lucide-react'

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: category, isLoading, isError, error, refetch } = useCategory(id)
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleUpdate = async (formData: CategoryFormData) => {
    if (!id) return
    await updateCategory.mutateAsync({
      id,
      data: {
        name: formData.name,
        icon: formData.icon || null,
        color: formData.color || null,
        description: formData.description || null,
        keywords: formData.keywords || null,
      },
    })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    if (!id) return
    await deleteCategory.mutateAsync(id)
    navigate('/categories')
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pb-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    )
  }

  if (isError || !category) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <ErrorMessage
          message={(error as Error)?.message || 'No se pudo cargar la categoria'}
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="relative max-w-2xl mx-auto pb-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-amber-200/20 to-orange-200/10 blur-3xl dark:from-amber-500/10 dark:to-orange-500/5" />
        <div className="flex items-center gap-3 mb-6 animate-fade-in">
          <button onClick={() => setIsEditing(false)} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Editar: {category.name}</h1>
            <p className="text-sm text-gray-500">Actualiza los datos de la categoria</p>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
          <div className="relative">
            <CategoryForm
              defaultValues={{
                name: category.name,
                category_type: category.category_type as 'expense' | 'income' | 'transfer' | 'adjustment',
                icon: category.icon,
                color: category.color,
                description: category.description || '',
                keywords: category.keywords || '',
              }}
              onSubmit={handleUpdate}
              isSubmitting={updateCategory.isPending}
              mode="edit"
            />
          </div>
        </div>
      </div>
    )
  }

  const configColor = category.color || undefined

  return (
    <div className="relative max-w-2xl mx-auto space-y-6 pb-8">
      <div className="pointer-events-none absolute -left-20 -top-10 h-60 w-60 rounded-full bg-gradient-to-br from-violet-200/20 to-fuchsia-200/10 blur-3xl dark:from-violet-500/10 dark:to-fuchsia-500/5" />
      <div className="pointer-events-none absolute -right-16 top-40 h-48 w-48 rounded-full bg-gradient-to-br from-amber-200/10 to-rose-200/10 blur-3xl dark:from-amber-500/5 dark:to-rose-500/5" />

      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/categories')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {category.name}
              {category.is_system && (
                <span className="rounded bg-gray-200/50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:bg-gray-700/50 dark:text-gray-400">
                  Sistema
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">Detalle de la categoria</p>
          </div>
        </div>
        {!category.is_system && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-1.5 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="mr-1.5 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        )}
      </div>

      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
        <div
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r"
          style={{ backgroundImage: category.category_type === 'expense' ? 'linear-gradient(to right, #f87171, #dc2626)' :
                   category.category_type === 'income' ? 'linear-gradient(to right, #34d399, #059669)' :
                   category.category_type === 'transfer' ? 'linear-gradient(to right, #60a5fa, #2563eb)' :
                   'linear-gradient(to right, #fbbf24, #d97706)' }}
        />
        <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: configColor || '#6366f1' }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CategoryTypeBadge type={category.category_type} />
              {category.is_system && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <Lock className="h-3 w-3" />
                  Sistema
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <CategoryBadge name="" icon={category.icon} color={category.color} showIcon size="sm" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Icono</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.icon || 'Sin icono'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color || '#6b7280' }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Color</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{category.color || 'Por defecto'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Creada</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {category.created_at ? new Date(category.created_at).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' }) : '---'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-gray-700 shadow-sm">
                <Layers className="h-4 w-4 text-gray-400" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Subcategorias</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {category.subcategories?.length || 0} subcategoria{category.subcategories?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {category.description && (
            <div className="mt-4 rounded-xl bg-gray-50/50 p-3 dark:bg-gray-800/50">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Descripcion</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{category.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className={cn(
        'relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 backdrop-blur-xl shadow-sm',
        'dark:border-gray-800/80 dark:bg-gray-900/80',
        'animate-fade-in',
      )} style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-400 via-violet-400 to-primary-400" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Subcategorias
            </h3>
          </div>

          {!category.subcategories || category.subcategories.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-3 dark:bg-gray-800">
                <Layers className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Sin subcategorias
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Usa el boton debajo para agregar subcategorias
              </p>
            </div>
          ) : (
            <SubcategoryList
              categoryId={id!}
              subcategories={category.subcategories}
              onRefresh={refetch}
            />
          )}
        </div>
      </div>

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        categoryName={category.name}
        isDeleting={deleteCategory.isPending}
      />
    </div>
  )
}
