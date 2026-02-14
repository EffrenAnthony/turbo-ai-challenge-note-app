import type { Category } from '@/types/categories'
import { apiClient } from '@/lib/api/client'

export async function getCategories(): Promise<Category[]> {
  return apiClient.get<Category[]>('/categories/')
}
