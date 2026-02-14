import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'
import { apiClient } from '@/lib/api/client'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login/', data)
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/register/', data)
}

export async function refreshToken(refresh: string): Promise<{ access: string }> {
  return apiClient.post<{ access: string }>('/auth/token/refresh/', { refresh })
}

export async function logout(refresh: string): Promise<void> {
  return apiClient.post('/auth/logout/', { refresh })
}
