import { useState, useEffect } from 'react'
import { Save, RotateCcw, RefreshCw } from 'lucide-react'
import { Input, Button, Skeleton } from '@/components/ui'
import { useProfile, useUpdateProfile } from '../hooks/useSettings'
import AvatarUpload from './AvatarUpload'
import type { UpdateProfileRequest } from '@/types/settings'

export default function ProfileForm() {
  const { data: profile, isLoading } = useProfile()
  const updateProfile = useUpdateProfile()

  const [form, setForm] = useState<UpdateProfileRequest>({})
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        first_name: profile.profile.first_name,
        last_name: profile.profile.last_name,
        display_name: profile.profile.display_name,
        bio: profile.profile.bio,
        phone_secondary: profile.profile.phone_secondary,
        address_line1: profile.profile.address_line1,
        address_line2: profile.profile.address_line2,
        city: profile.profile.city,
        state_province: profile.profile.state_province,
        country_code: profile.profile.country_code,
        postal_code: profile.profile.postal_code,
        date_of_birth: profile.profile.date_of_birth,
        gender: profile.profile.gender,
      })
    }
  }, [profile])

  const update = (key: keyof UpdateProfileRequest, value: string | null) => {
    setForm((prev) => ({ ...prev, [key]: value || null }))
    setDirty(true)
  }

  const handleSave = async () => {
    await updateProfile.mutateAsync(form)
    setDirty(false)
  }

  const handleReset = () => {
    if (profile) {
      setForm({
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        first_name: profile.profile.first_name,
        last_name: profile.profile.last_name,
        display_name: profile.profile.display_name,
        bio: profile.profile.bio,
        phone_secondary: profile.profile.phone_secondary,
        address_line1: profile.profile.address_line1,
        address_line2: profile.profile.address_line2,
        city: profile.profile.city,
        state_province: profile.profile.state_province,
        country_code: profile.profile.country_code,
        postal_code: profile.profile.postal_code,
        date_of_birth: profile.profile.date_of_birth,
        gender: profile.profile.gender,
      })
      setDirty(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-3 w-56 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-sm">
      {/* Avatar */}
      <div className="flex items-center justify-center mb-6">
        <AvatarUpload
          currentUrl={form.avatar_url || null}
          email={profile?.email || ''}
          onUpload={(url) => update('avatar_url', url)}
        />
      </div>

      {/* Name & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Input
          label="Nombre"
          value={form.first_name || ''}
          onChange={(e) => update('first_name', e.target.value)}
          placeholder="Tu nombre"
        />
        <Input
          label="Apellido"
          value={form.last_name || ''}
          onChange={(e) => update('last_name', e.target.value)}
          placeholder="Tu apellido"
        />
        <Input
          label="Nombre visible"
          value={form.display_name || ''}
          onChange={(e) => update('display_name', e.target.value)}
          placeholder="Cómo quieres que te vean"
        />
        <Input
          label="Teléfono"
          type="tel"
          value={form.phone || ''}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="+1 809-555-0100"
        />
        <Input
          label="Email"
          value={profile?.email || ''}
          disabled
          helperText="El email no se puede cambiar desde aquí"
        />
      </div>

      {/* Bio */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Biografía</label>
        <textarea
          value={form.bio || ''}
          onChange={(e) => update('bio', e.target.value)}
          rows={3}
          placeholder="Cuéntanos sobre ti..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 resize-none"
        />
      </div>

      {/* Address */}
      <div className="mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Dirección</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Dirección línea 1"
            value={form.address_line1 || ''}
            onChange={(e) => update('address_line1', e.target.value)}
            placeholder="Calle Principal #123"
          />
          <Input
            label="Dirección línea 2"
            value={form.address_line2 || ''}
            onChange={(e) => update('address_line2', e.target.value)}
            placeholder="Apto / Edificio"
          />
          <Input
            label="Ciudad"
            value={form.city || ''}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Santo Domingo"
          />
          <Input
            label="Provincia / Estado"
            value={form.state_province || ''}
            onChange={(e) => update('state_province', e.target.value)}
            placeholder="Distrito Nacional"
          />
          <Input
            label="País"
            value={form.country_code || ''}
            onChange={(e) => update('country_code', e.target.value)}
            placeholder="DO"
          />
          <Input
            label="Código Postal"
            value={form.postal_code || ''}
            onChange={(e) => update('postal_code', e.target.value)}
            placeholder="10101"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
        {dirty && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Descartar
          </Button>
        )}
        <Button
          onClick={handleSave}
          disabled={!dirty}
          isLoading={updateProfile.isPending}
          size="sm"
        >
          {updateProfile.isPending ? (
            <><RefreshCw className="h-3.5 w-3.5 animate-spin mr-1.5" /> Guardando...</>
          ) : (
            <><Save className="h-3.5 w-3.5 mr-1.5" /> Guardar Cambios</>
          )}
        </Button>
      </div>
    </div>
  )
}
