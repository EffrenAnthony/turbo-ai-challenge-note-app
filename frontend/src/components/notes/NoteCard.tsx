import type { Note } from '@/types/notes'
import { Card, type CardColor } from '@/components/ui/Card'
import { formatSmartDate } from '@/lib/utils/dates'
import Link from 'next/link'

interface NoteCardProps {
  note: Note
  color?: CardColor
}

function NoteContent({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="mt-2 overflow-hidden text-sm leading-relaxed">
      {lines.map((line, i) => {
        const bulletMatch = line.match(/^[-*•]\s+(.*)/)
        if (bulletMatch) {
          return (
            <div key={i} className="flex gap-1.5">
              <span className="shrink-0">&bull;</span>
              <span>{bulletMatch[1]}</span>
            </div>
          )
        }
        if (line.trim() === '') return <br key={i} />
        return <p key={i}>{line}</p>
      })}
    </div>
  )
}

export function NoteCard({ note, color = 'jade' }: NoteCardProps) {
  const dateLabel = formatSmartDate(note.created_at)

  return (
    <Link href={`/notes/${note.id}`}>
      <Card color={color} className="flex flex-col transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-bold">{dateLabel}</span>
          <span>{note.category.name}</span>
        </div>
        <h3 className="mt-2 font-serif text-2xl font-bold leading-tight">{note.title}</h3>
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <NoteContent content={note.content} />
        </div>
      </Card>
    </Link>
  )
}
