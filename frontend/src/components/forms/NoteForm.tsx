'use client'

import type { Note } from '@/types/notes'

interface NoteFormProps {
  note?: Note
}

// TODO: Implement note form for create/edit with category select
export function NoteForm({ note }: NoteFormProps) {
  return <div>{note ? 'Edit' : 'Create'} note form placeholder</div>
}
