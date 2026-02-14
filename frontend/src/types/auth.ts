export interface User {
  id: number
  email: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  password_confirm: string
}

export interface TokenPair {
  access: string
  refresh: string
}

export interface AuthResponse {
  user: User
  tokens: TokenPair
}
