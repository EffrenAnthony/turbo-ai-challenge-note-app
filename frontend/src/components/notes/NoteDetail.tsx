import type { Note } from '@/types/notes'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/lib/utils/dates'

interface NoteDetailProps {
  note: Note
}

export function NoteDetail({ note }: NoteDetailProps) {
  return (
    <article className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{note.title}</h1>
        <Badge>{note.category.name}</Badge>
      </div>
      <p className="text-sm text-gray-500">Updated {formatDateTime(note.updated_at)}</p>
      <div className="prose max-w-none">{note.content}</div>
    </article>
  )
}
