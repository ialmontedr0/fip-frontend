import { Languages } from 'lucide-react'

const LANGUAGES: Record<string, string> = {
  es: 'Espa\u00f1ol',
  en: 'English',
  fr: 'Fran\u00e7ais',
  pt: 'Portugu\u00eas',
  de: 'Deutsch',
  it: 'Italiano',
  ja: '\u65e5\u672c\u8a9e',
  zh: '\u4e2d\u6587',
}

interface LanguageSelectProps {
  value: string
  onChange: (value: string) => void
}

export default function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="relative">
      <Languages className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 appearance-none"
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </div>
  )
}
