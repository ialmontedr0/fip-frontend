import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | null | undefined, currency: string = 'DOP'): string {
  if (amount === null || amount === undefined) return '$0.00'
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(num)) return '$0.00'
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num)
}

export function formatDate(
  date: string | Date,
  format: 'short' | 'long' | 'relative' = 'short',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (format === 'relative') {
    const diff = Date.now() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Ayer'
    if (days < 7) return `Hace ${days} dias.`
  }
  return d.toLocaleDateString('es-DO', {
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric',
  })
}

export function formatRelativeTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return '-'
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  const diff = Date.now() - d.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `hace ${minutes} min`
  if (hours < 24) return `hace ${hours}h`
  if (days < 7) return `hace ${days}d`
  return d.toLocaleDateString('es-DO', {
    day: 'numeric', month: 'short',
  })
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

export function responsiveGrid(count: number): string {
  if (count <= 0) return 'grid grid-cols-1 gap-4'
  if (count === 1) return 'grid grid-cols-1 max-w-2xl gap-4'
  if (count === 2) return 'grid grid-cols-1 sm:grid-cols-2 max-w-4xl gap-4'
  if (count === 3) return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
  return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
}
