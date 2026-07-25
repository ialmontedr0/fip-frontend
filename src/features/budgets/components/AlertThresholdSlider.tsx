import { useCallback } from 'react'

interface AlertThresholdSliderProps {
  value: number
  onChange: (value: number) => void
}

export default function AlertThresholdSlider({ value, onChange }: AlertThresholdSliderProps) {
  const getColor = useCallback((v: number) => {
    if (v <= 60) return 'bg-emerald-500'
    if (v <= 80) return 'bg-amber-500'
    return 'bg-red-500'
  }, [])

  const getLabelColor = useCallback((v: number) => {
    if (v <= 60) return 'text-emerald-600 dark:text-emerald-400'
    if (v <= 80) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Umbral de alerta
        </label>
        <span className={`text-lg font-bold ${getLabelColor(value)}`}>
          {value}%
        </span>
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 w-full flex rounded-full overflow-hidden">
          <div className="bg-emerald-200 dark:bg-emerald-800 h-2 w-[60%] self-center rounded-l-full" />
          <div className="bg-amber-200 dark:bg-amber-800 h-2 w-[20%] self-center" />
          <div className="bg-red-200 dark:bg-red-800 h-2 w-[20%] self-center rounded-r-full" />
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-2 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:bg-violet-500"
          style={{ zIndex: 1 }}
          aria-label="Umbral de alerta"
          aria-valuenow={value}
          aria-valuemin={1}
          aria-valuemax={100}
        />
      </div>
      <div className={`mt-2 h-1 rounded-full transition-all duration-300 ${getColor(value)}`}
        style={{ width: `${value}%` }}
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Se activara una alerta cuando el presupuesto alcance el {value}% de uso
      </p>
    </div>
  )
}
