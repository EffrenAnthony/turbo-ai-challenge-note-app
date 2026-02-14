import type { Note, CreateNoteRequest, UpdateNoteRequest } from '@/types/notes'
import type { PaginatedResponse } from '@/types/api'
import { apiClient } from '@/lib/api/client'

export async function getNotes(): Promise<PaginatedResponse<Note>> {
  return apiClient.get<PaginatedResponse<Note>>('/notes/')
}

export async function getNote(id: number): Promise<Note> {
  return apiClient.get<Note>(`/notes/${id}/`)
}

export async function createNote(data: CreateNoteRequest): Promise<Note> {
  return apiClient.post<Note>('/notes/', data)
}

export async function updateNote(id: number, data: UpdateNoteRequest): Promise<Note> {
  return apiClient.patch<Note>(`/notes/${id}/`, data)
}

export async function deleteNote(id: number): Promise<void> {
  return apiClient.delete(`/notes/${id}/`)
}
