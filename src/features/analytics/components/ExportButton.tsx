import { useState, useCallback, useRef, useEffect } from 'react'
import { Check, Image, FileDown, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExportButtonProps {
  getElement: () => HTMLElement | null
  filename?: string
  className?: string
}

type ExportState = 'idle' | 'exporting' | 'done'

function exportAsSVG(el: HTMLElement, filename: string): boolean {
  const svg = el.querySelector('svg')
  if (!svg) return false

  const clone = svg.cloneNode(true) as SVGSVGElement
  const style = document.createElement('style')
  style.textContent = `
    text { font-family: system-ui, -apple-system, sans-serif; }
    .recharts-text { font-size: 12px; fill: #6b7280; }
    .recharts-cartesian-grid line { stroke: #e5e7eb; }
  `
  clone.insertBefore(style, clone.firstChild)

  const serializer = new XMLSerializer()
  const svgString = serializer.serializeToString(clone)
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.download = `${filename}.svg`
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

export default function ExportButton({ getElement, filename = 'chart', className }: ExportButtonProps) {
  const [state, setState] = useState<ExportState>('idle')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = useCallback(() => {
    const el = getElement()
    if (!el) return

    setState('exporting')
    requestAnimationFrame(() => {
      const ok = exportAsSVG(el, filename)
      setState(ok ? 'done' : 'idle')
      if (ok) setTimeout(() => setState('idle'), 2500)
    })
  }, [getElement, filename])

  if (state === 'done') {
    return (
      <button
        type="button"
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all',
          'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
          'animate-fade-in',
          className,
        )}
      >
        <Check className="h-3.5 w-3.5" />
        Exportado
      </button>
    )
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={state === 'exporting'}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200',
          'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700',
          'hover:from-gray-100 hover:to-gray-200 hover:text-gray-900 hover:shadow-sm',
          'dark:from-gray-800 dark:to-gray-750 dark:text-gray-300',
          'dark:hover:from-gray-700 dark:hover:to-gray-650 dark:hover:text-gray-100',
          state === 'exporting' && 'opacity-60 cursor-wait',
          className,
        )}
      >
        {state === 'exporting' ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <FileDown className="h-3.5 w-3.5" />
            Exportar
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-1.5 w-44 animate-fade-in">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <button
              type="button"
              onClick={() => { handleExport(); setIsOpen(false) }}
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Image className="h-3.5 w-3.5" />
              </div>
              <div className="text-left">
                <p className="font-medium">SVG</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Vector escalable</p>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
