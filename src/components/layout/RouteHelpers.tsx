import { Suspense, ReactNode } from 'react'
import Spinner from '@/components/ui/Spinner'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-96">
      <p className="text-lg text-gray-500">{title} - Proximamente</p>
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
