import { Suspense, ReactNode } from 'react'
import { useRouteError } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <p className="text-lg text-gray-500">{title} - Proximamente</p>
    </div>
  )
}

export function RouteError() {
  const error = useRouteError() as { status?: number; statusText?: string; message?: string }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 bg-gray-50 dark:bg-gray-950">
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 max-w-md w-full text-center shadow-sm">
        <p className="text-5xl font-bold text-gray-300 dark:text-gray-600">{error?.status ?? 500}</p>
        <h1 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
          Algo salio mal
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {error?.statusText || error?.message || 'Ocurrio un error inesperado.'}
        </p>
        <a
          href="/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

export function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-96">
          <Spinner size="lg" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
