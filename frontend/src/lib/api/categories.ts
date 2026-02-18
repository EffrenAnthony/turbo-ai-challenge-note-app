import type { Category } from '@/types/categories'
import { apiClient } from '@/lib/api/client'

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories/')
  return response.data
}
