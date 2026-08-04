import { useId, useState, type ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const POSITION_CLASS = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export default function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState<boolean>(false)
  const id = useId()

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      <span aria-describedby={show ? id : undefined}>{children}</span>
      {show && (
        <span
          id={id}
          role="tooltip"
          className={`absolute z-50 whitespace-nowrap px-2.5 py-1.5 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg ${POSITION_CLASS[position]}`}
        >
          {content}
        </span>
      )}
    </span>
  )
}
