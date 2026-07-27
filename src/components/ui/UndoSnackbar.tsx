import toast from 'react-hot-toast'

interface UndoToastOptions {
  message: string
  onUndo: () => void
  duration?: number
}

export function undoToast({ message, onUndo, duration = 6000 }: UndoToastOptions) {
  toast(
    (t) => (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-gray-200">{message}</span>
        <button
          onClick={() => {
            onUndo()
            toast.dismiss(t.id)
          }}
          className="rounded-lg bg-white/20 px-3 py-1 text-xs font-bold text-white hover:bg-white/30 transition-all"
        >
          Deshacer
        </button>
      </div>
    ),
    {
      duration,
      style: {
        background: '#1f2937',
        color: '#fff',
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      },
    },
  )
}

export function successToast(message: string) {
  toast.success(message, { duration: 3000 })
}

export function errorToast(message: string) {
  toast.error(message, { duration: 6000 })
}
