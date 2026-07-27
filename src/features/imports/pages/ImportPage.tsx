import { Upload, History } from 'lucide-react'
import ImportWizard from '../components/ImportWizard'
import ImportJobHistory from '../components/ImportJobHistory'

export default function ImportPage() {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <div className="mb-8">
        <div className="absolute -top-4 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-xl shadow-purple-500/30">
            <Upload className="h-7 w-7 text-white drop-shadow-sm" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Importar Transacciones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Sube archivos CSV o Excel para importar tus transacciones
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200/80 dark:border-gray-700/60 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <ImportWizard />
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
            <History className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Historial de Importaciones</h2>
        </div>
        <ImportJobHistory />
      </div>
    </div>
  )
}
