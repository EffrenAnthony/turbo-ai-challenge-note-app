import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/notes'
import type { PaginatedResponse } from '@/types/api'
import { apiClient } from '@/lib/api/client'

export async function getNotes(): Promise<PaginatedResponse<Note>> {
  const response = await apiClient.get<PaginatedResponse<Note>>('/notes/')
  return response.data
}

export async function getNote(id: number): Promise<Note> {
  const response = await apiClient.get<Note>(`/notes/${id}/`)
  return response.data
}

export async function createNote(data: CreateNoteRequest): Promise<Note> {
  const response = await apiClient.post<Note>('/notes/', data)
  return response.data
}

export async function updateNote(id: number, data: UpdateNoteRequest): Promise<Note> {
  const response = await apiClient.patch<Note>(`/notes/${id}/`, data)
  return response.data
}

export async function deleteNote(id: number): Promise<void> {
  await apiClient.delete(`/notes/${id}/`)
}
