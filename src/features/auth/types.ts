import type { IUser, IAuthTokens } from '@/types/models'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface MFAVerifyRequest {
  mfa_token: string
  code: string
}

export interface MFASetupResponse {
  secret: string
  qr_code_base64: string
  message: string
}

export interface RequestPasswordResetRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface VerifyEmailRequest {
  token: string
}

export interface Session {
  id: string
  device_info: string
  ip_address: string
  user_agent: string
  created_at: string | null
  expires_at: string | null
}

export interface AuthResponseData {
  requires_mfa: boolean
  mfa_token?: string | null
  user?: IUser | null
  tokens?: IAuthTokens | null
  message?: string | null
}
