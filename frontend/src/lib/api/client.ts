import { ApiError } from '@/types/api'
import { getAccessToken } from '@/lib/auth/tokens'
import { API_URL } from '@/lib/utils/constants'

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ApiError = {
      message: response.statusText,
      status: response.status,
    }

    try {
      const body = await response.json()
      error.message = body.message ?? body.detail ?? response.statusText
      error.errors = body.errors
    } catch {
      // Response body is not JSON
    }

    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const token = getAccessToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    })
    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    })
    return handleResponse<T>(response)
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
    return handleResponse<T>(response)
  },
}
