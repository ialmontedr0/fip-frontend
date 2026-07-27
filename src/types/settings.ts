export interface ProfileData {
  first_name: string | null
  last_name: string | null
  display_name: string | null
  date_of_birth: string | null
  gender: string | null
  bio: string | null
  phone_secondary: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state_province: string | null
  country_code: string | null
  postal_code: string | null
}

export interface UserProfileResponse {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  is_verified: boolean
  mfa_enabled: boolean
  login_count: number
  last_login_at: string | null
  created_at: string
  updated_at: string | null
  profile: ProfileData
}

export interface UpdateProfileRequest {
  phone?: string | null
  avatar_url?: string | null
  first_name?: string | null
  last_name?: string | null
  display_name?: string | null
  date_of_birth?: string | null
  gender?: string | null
  bio?: string | null
  phone_secondary?: string | null
  address_line1?: string | null
  address_line2?: string | null
  city?: string | null
  state_province?: string | null
  country_code?: string | null
  postal_code?: string | null
}

export interface UpdateProfileResponse {
  message: string
  user: UserProfileResponse
}

export interface UserPreferencesResponse {
  currency_code: string
  timezone: string
  language: string
  date_format: string
  time_format: string
  number_format: string
  first_day_of_week: string
  theme: 'light' | 'dark' | 'system'
  email_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  updated_at: string | null
}

export interface UpdatePreferencesRequest {
  currency_code?: string
  timezone?: string
  language?: string
  date_format?: string
  time_format?: string
  number_format?: string
  first_day_of_week?: string
  theme?: 'light' | 'dark' | 'system'
  email_notifications?: boolean
  push_notifications?: boolean
  marketing_emails?: boolean
}

export interface UpdatePreferencesResponse {
  message: string
  preferences: UserPreferencesResponse
}

export interface CurrencyOption {
  code: string
  name: string
}

export interface TimezoneOption {
  timezone: string
  name: string
}

export interface LanguageOption {
  code: string
  name: string
}

export interface SupportedValuesResponse {
  currencies: CurrencyOption[]
  timezones: TimezoneOption[]
  languages: LanguageOption[]
}

export interface SessionInfo {
  id: string
  device_name: string
  device_type: string
  ip_address: string
  user_agent: string
  is_current: boolean
  last_active_at: string
  created_at: string
}

export interface MFASetupResponse {
  secret: string
  qr_code_base64: string
  message: string
}

export interface DisableMFARequest {
  code: string
}

export interface LogoutSessionRequest {
  refresh_token: string
}
