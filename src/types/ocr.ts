export interface OcrData {
  text: string | null
  amount: number | null
  amount_decimal: string | null
  date: string | null
  merchant: string | null
  currency: string | null
  confidence: 'low' | 'medium' | 'high'
}

export interface OcrSuggestions {
  amount: number | null
  date: string | null
  merchant: string | null
  currency: string | null
  type: 'expense' | 'income'
}

export interface OcrExtractResponse {
  success: boolean
  data: OcrData
  suggestions: OcrSuggestions
  warnings: string[]
}

export interface OcrStatus {
  enabled: boolean
  tesseract_available: boolean
  supported_extensions: string[]
}
