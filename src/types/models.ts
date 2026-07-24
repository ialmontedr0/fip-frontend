export interface IUser {
  id: string
  email: string
  role: 'user' | 'admin' | 'moderator'
  phone?: string
  avatar_url?: string
  is_active: boolean
  is_verified: boolean
  mfa_enabled: boolean
  login_count: number
  last_login_at?: string
  created_at: string
  updated_at?: string
}

export interface IAuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface IAuthResponse {
  requires_mfa: boolean
  mfa_token?: string
  user?: IUser
  tokens?: IAuthTokens
}
