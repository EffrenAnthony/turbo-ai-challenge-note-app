import type { Note } from '@/types/notes'
import type { Category } from '@/types/categories'

export const mockCategories: Category[] = [
  { id: 1, name: 'Personal', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'School', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
  { id: 3, name: 'Drama', created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' },
]

export const mockNotes: Note[] = [
  {
    id: 1,
    title: 'First Note',
    content: 'Some content here',
    category: mockCategories[0],
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-18T10:00:00Z',
  },
  {
    id: 2,
    title: 'Second Note',
    content: '- Bullet one\n- Bullet two\nRegular line',
    category: mockCategories[1],
    created_at: '2026-02-17T10:00:00Z',
    updated_at: '2026-02-17T10:00:00Z',
  },
  {
    id: 3,
    title: 'Third Note',
    content: 'Older note content',
    category: mockCategories[2],
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z',
  },
]
