import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import CategoryBadge from './CategoryBadge'
import { useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from '../hooks/useCategories'
import { PRESET_COLORS } from '../constants'
import { Plus, Edit2, Trash2, Check, X, ChevronRight } from 'lucide-react'
import type { SubcategoryDetail } from '@/types/categories'

interface Props {
  categoryId: string
  subcategories: SubcategoryDetail[]
  onRefresh: () => void
}

interface EditingSub {
  id: string | null
  name: string
  color: string | null
}

export default function SubcategoryList({ categoryId, subcategories, onRefresh }: Props) {
  const [editing, setEditing] = useState<EditingSub>({ id: null, name: '', color: null })
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const createMutation = useCreateSubcategory()
  const updateMutation = useUpdateSubcategory()
  const deleteMutation = useDeleteSubcategory()

  const handleEdit = (sub: SubcategoryDetail) => {
    setEditing({ id: sub.id, name: sub.name, color: sub.color })
  }

  const handleSaveEdit = async () => {
    if (!editing.id || !editing.name.trim()) return
    await updateMutation.mutateAsync({
      subcategoryId: editing.id,
      data: {
        name: editing.name.trim(),
        color: editing.color,
      },
    })
    setEditing({ id: null, name: '', color: null })
    onRefresh()
  }

  const handleCancelEdit = () => {
    setEditing({ id: null, name: '', color: null })
  }

  const handleAdd = async () => {
    if (!newName.trim()) return
    await createMutation.mutateAsync({
      categoryId,
      data: {
        name: newName.trim(),
        color: newColor,
      },
    })
    setNewName('')
    setNewColor(null)
    setAdding(false)
    onRefresh()
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    setConfirmDeleteId(null)
    onRefresh()
  }

  return (
    <div className="space-y-2">
      {subcategories.length > 0 && (
        <div className="space-y-1.5">
          {subcategories.map((sub) => {
            const isEditing = editing.id === sub.id
            return (
              <div
                key={sub.id}
                className={cn(
                  'group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-all',
                  'dark:border-gray-700/50',
                  isEditing && 'border-primary-200 bg-primary-50/30 dark:border-primary-700 dark:bg-primary-500/5',
                )}
              >
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />

                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editing.name}
                      onChange={(e) => setEditing((prev) => ({ ...prev, name: e.target.value }))}
                      className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      {PRESET_COLORS.slice(0, 6).map((c) => (
                        <button
                          key={c}
                          onClick={() => setEditing((prev) => ({ ...prev, color: prev.color === c ? null : c }))}
                          className={cn(
                            'h-6 w-6 rounded-full transition-all',
                            editing.color === c && 'ring-2 ring-primary-500 scale-110',
                          )}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <button
                      onClick={handleSaveEdit}
                      className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex items-center gap-2">
                      <CategoryBadge name={sub.name} icon={sub.icon} color={sub.color} size="md" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(sub)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      {confirmDeleteId === sub.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(sub.id)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(sub.id)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {!adding && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAdding(true)}
          className="w-full mt-2"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Agregar Subcategoria
        </Button>
      )}

      {adding && (
        <div className="flex items-center gap-2 rounded-xl border border-primary-200 bg-primary-50/30 p-3 dark:border-primary-700 dark:bg-primary-500/5">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nombre de la subcategoria..."
            className="flex-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-800 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex gap-1">
            {PRESET_COLORS.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => setNewColor(newColor === c ? null : c)}
                className={cn(
                  'h-6 w-6 rounded-full transition-all',
                  newColor === c && 'ring-2 ring-primary-500 scale-110',
                )}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || createMutation.isPending}
            className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={() => { setAdding(false); setNewName(''); setNewColor(null) }}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
