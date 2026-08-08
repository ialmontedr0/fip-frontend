import { useState, useRef, useEffect, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

function Dropdown({ trigger, children, align = 'left', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg',
            'dark:border-gray-700 dark:bg-gray-800',
            'animate-fade-in',
            align === 'right' ? 'right-0' : 'left-0',
            className,
          )}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  danger?: boolean
  className?: string
}

function DropdownItem({ children, onClick, danger, className }: DropdownItemProps) {
  return (
    <button
      onClick={() => {
        onClick?.()
      }}
      className={cn(
        'flex w-full items-center px-4 py-2 text-sm transition-colors',
        'hover:bg-gray-100 dark:hover:bg-gray-700',
        danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200',
        className,
      )}
      role="menuitem"
    >
      {children}
    </button>
  )
}

Dropdown.Item = DropdownItem
export default Dropdown
