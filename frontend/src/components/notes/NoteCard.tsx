import type { Note } from '@/types/notes'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils/dates'
import Link from 'next/link'

interface NoteCardProps {
  note: Note
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{note.title}</h3>
            <Badge>{note.category.name}</Badge>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">{note.content}</p>
          <p className="text-xs text-gray-400">{formatDate(note.created_at)}</p>
        </div>
      </Card>
    </Link>
  )
}
