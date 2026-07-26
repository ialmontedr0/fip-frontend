export const CARD_NETWORK_COLORS = {
  visa: '#1A1F71',
  mastercard: '#EB001B',
  amex: '#2E77BC',
} as const

export const CARD_NETWORK_NAMES = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
} as const

export const BILL_STATUS_COLORS = {
  pending: 'yellow',
  partial: 'blue',
  paid: 'green',
  overdue: 'red',
  waived: 'gray',
} as const

export const UTILIZATION_STATUS_COLORS: Record<string, string> = {
  healthy: '#22c55e',
  warning: '#eab308',
  danger: '#ef4444',
}

export const ALERT_TYPE_ICONS: Record<string, string> = {
  high_utilization: 'AlertTriangle',
  limit_approaching: 'AlertTriangle',
  due_date_approaching: 'Clock',
  payment_overdue: 'AlertOctagon',
}

export const ALERT_SEVERITY_COLORS: Record<string, string> = {
  warning: '#eab308',
  critical: '#ef4444',
}

export const SPEND_LIMIT_STATUS_COLORS: Record<string, string> = {
  ok: '#22c55e',
  warning: '#eab308',
  exceeded: '#ef4444',
}

export const SPEND_LIMIT_TYPE_ICONS: Record<string, string> = {
  daily: 'Sun',
  weekly: 'Calendar',
  monthly: 'CalendarDays',
  category: 'Tags',
}
