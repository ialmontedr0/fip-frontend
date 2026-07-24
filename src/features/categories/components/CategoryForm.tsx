import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'
import IconPicker from './IconPicker'
import { CATEGORY_TYPE_CONFIG, PRESET_COLORS } from '../constants'
import type { CategoryType } from '@/types/categories'

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  category_type: z.enum(['expense', 'income', 'transfer', 'adjustment']),
  icon: z.string().max(50).optional().or(z.literal('')).nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un hex valido (#RRGGBB)').optional().or(z.literal('')).nullable(),
  description: z.string().max(500).optional().or(z.literal('')),
  keywords: z.string().max(500).optional().or(z.literal('')),
})

export type CategoryFormData = z.infer<typeof categorySchema>

interface Props {
  defaultValues?: Partial<CategoryFormData>
  onSubmit: (data: CategoryFormData) => Promise<void>
  isSubmitting: boolean
  mode: 'create' | 'edit'
}

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white/70 px-4 py-2.5 text-sm backdrop-blur-sm transition-all dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 focus:bg-white dark:focus:bg-gray-800 placeholder:text-gray-400'

export default function CategoryForm({ defaultValues, onSubmit, isSubmitting, mode }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      category_type: 'expense',
      icon: null,
      color: null,
      description: '',
      keywords: '',
      ...defaultValues,
    },
  })

  const selectedType = watch('category_type') as CategoryType
  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {mode === 'create' && (
        <div>
          <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Tipo de Categoria
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(CATEGORY_TYPE_CONFIG) as [CategoryType, typeof CATEGORY_TYPE_CONFIG[CategoryType]][]).map(([type, config]) => {
              const Icon = config.icon
              const isSelected = selectedType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue('category_type', type)}
                  className={cn(
                    'group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border-2 p-4 transition-all duration-200',
                    isSelected
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/50 shadow-md dark:from-primary-500/20 dark:to-primary-500/5'
                      : 'border-gray-200 bg-white/50 hover:border-gray-300 hover:bg-white/80 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600 dark:hover:bg-gray-800/80',
                  )}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
                  )}
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200',
                    isSelected ? 'scale-110' : 'group-hover:scale-105',
                    isSelected ? config.bgColor : 'bg-gray-100 dark:bg-gray-700',
                  )}>
                    <Icon className={cn('h-4 w-4', isSelected ? config.color : 'text-gray-400')} />
                  </div>
                  <span className={cn(
                    'text-xs font-medium transition-colors',
                    isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-500 dark:text-gray-400',
                  )}>
                    {config.label}
                  </span>
                </button>
              )
            })}
          </div>
          {errors.category_type && (
            <p className="mt-1.5 text-xs text-red-500">{errors.category_type.message}</p>
          )}
        </div>
      )}

      {mode === 'edit' && (
        <div className="rounded-xl bg-gray-50/50 p-4 dark:bg-gray-800/50">
          <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1">
            Tipo de Categoria
          </label>
          <div className="flex items-center gap-2">
            {(() => {
              const config = CATEGORY_TYPE_CONFIG[selectedType]
              if (!config) return null
              const Icon = config.icon
              return (
                <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', config.color)}>
                  <Icon className="h-4 w-4" />
                  {config.label}
                </span>
              )
            })()}
          </div>
          <p className="text-xs text-gray-400 mt-1">El tipo no se puede cambiar despues de crear la categoria.</p>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Nombre de la Categoria
        </label>
        <Input
          {...register('name')}
          placeholder="Ej: Comida, Transporte, Salario..."
          error={errors.name?.message}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Icono
        </label>
        <IconPicker
          value={selectedIcon || null}
          onChange={(iconName) => setValue('icon', iconName)}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setValue('color', selectedColor === color ? null : color)}
              className={cn(
                'relative h-9 w-9 rounded-full transition-all duration-200',
                'hover:scale-110 hover:ring-2 hover:ring-gray-400',
                selectedColor === color && 'ring-2 ring-primary-500 scale-110 shadow-lg',
              )}
              style={{ backgroundColor: color }}
              title={color}
            >
              {selectedColor === color && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-white/80" />
                </span>
              )}
            </button>
          ))}
          <div className="relative">
            <input
              type="color"
              value={selectedColor || '#3b82f6'}
              onChange={(e) => setValue('color', e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-full border-0 p-0"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Descripcion
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className={inputClass + ' resize-none'}
          placeholder="Descripcion opcional de la categoria..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              {mode === 'create' ? 'Creando...' : 'Guardando...'}
            </span>
          ) : mode === 'create' ? 'Crear Categoria' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  )
}
