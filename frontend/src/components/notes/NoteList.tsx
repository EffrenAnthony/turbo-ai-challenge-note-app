import type { Note } from '@/types/notes'
import { NoteCard } from '@/components/notes/NoteCard'

interface NoteListProps {
  notes: Note[]
}

export function NoteList({ notes }: NoteListProps) {
  if (notes.length === 0) {
    return <p className="text-center text-gray-500">No notes found.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
