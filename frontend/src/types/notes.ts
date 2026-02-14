import type { Category } from '@/types/categories'

export interface Note {
  id: number
  title: string
  content: string
  category: Category
  created_at: string
  updated_at: string
}

export interface CreateNoteRequest {
  title: string
  content: string
  category_id: number
}

export interface UpdateNoteRequest {
  title?: string
  content?: string
  category_id?: number
}
