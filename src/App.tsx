import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { queryClient } from '@/lib/query-client'
import { router } from '@/routes'
import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

function App() {
  const { setLoading } = useAuthStore()

  useEffect(() => {
    // Auth state is restored from persistence on mount
    setLoading(false)
  }, [setLoading])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          },
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
            duration: 6000,
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App
