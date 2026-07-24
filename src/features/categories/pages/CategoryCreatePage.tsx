import { useNavigate } from 'react-router-dom'
import { useCreateCategory } from '../hooks/useCategories'
import CategoryForm, { type CategoryFormData } from '../components/CategoryForm'
import { ArrowLeft } from 'lucide-react'

export default function CategoryCreatePage() {
  const navigate = useNavigate()
  const createCategory = useCreateCategory()

  const handleSubmit = async (formData: CategoryFormData) => {
    await createCategory.mutateAsync({
      name: formData.name,
      category_type: formData.category_type,
      icon: formData.icon || null,
      color: formData.color || null,
      description: formData.description || null,
      keywords: formData.keywords || null,
    })
    navigate('/categories')
  }

  return (
    <div className="relative max-w-2xl mx-auto pb-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-violet-200/20 to-fuchsia-200/10 blur-3xl dark:from-violet-500/10 dark:to-fuchsia-500/5" />

      <div className="flex items-center gap-3 mb-6 animate-fade-in">
        <button onClick={() => navigate('/categories')} className="rounded-xl p-2.5 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]" />
              <div className="absolute -inset-1 animate-ping rounded-full bg-violet-400/30" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Nueva Categoria
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-5">
            Crea una nueva categoria para clasificar transacciones
          </p>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl border border-gray-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80 animate-fade-in"
        style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-400" />
        <div className="relative">
          <CategoryForm
            onSubmit={handleSubmit}
            isSubmitting={createCategory.isPending}
            mode="create"
          />
        </div>
      </div>
    </div>
  )
}
