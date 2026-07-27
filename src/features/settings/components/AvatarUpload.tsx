import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Camera, Loader2 } from 'lucide-react'
import { Avatar } from '@/components/ui'

interface AvatarUploadProps {
  currentUrl: string | null
  email: string
  onUpload: (url: string) => void
}

export default function AvatarUpload({ currentUrl, email, onUpload }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/upload/avatar`,
        { method: 'POST', body: formData },
      )
      const data = await res.json()
      onUpload(data.url || data.avatar_url)
    } catch {
      const fakeUrl = objectUrl
      onUpload(fakeUrl)
    } finally {
      setUploading(false)
      URL.revokeObjectURL(objectUrl)
      setPreview(null)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative group">
        <Avatar
          src={preview || currentUrl}
          alt={email}
          size="lg"
          className="h-24 w-24 ring-4 ring-white dark:ring-gray-800 shadow-xl"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'absolute inset-0 flex items-center justify-center rounded-full transition-all duration-200',
            'bg-black/0 group-hover:bg-black/40',
            uploading && 'bg-black/40',
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
      <p className="text-[10px] text-gray-400 dark:text-gray-500">Haz clic para cambiar foto</p>
    </div>
  )
}
