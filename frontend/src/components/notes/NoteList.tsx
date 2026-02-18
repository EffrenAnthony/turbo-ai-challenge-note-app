import Image from 'next/image'
import type { Note } from '@/types/notes'
import type { Category } from '@/types/categories'
import { NoteCard } from '@/components/notes/NoteCard'
import { getCategoryColor } from '@/lib/utils/categoryColors'

interface NoteListProps {
  notes: Note[]
  categories: Category[]
}

export function NoteList({ notes, categories }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Image src="/assets/bubletea.png" alt="Waiting for notes" width={300} height={300} />
        <p className="mt-4 text-xl text-honey-800">
          I&apos;m just here waiting for your charming notes...
        </p>
      </div>
    )
  }

  function getColorForCategory(categoryId: number) {
    const index = categories.findIndex((c) => c.id === categoryId)
    return getCategoryColor(index === -1 ? 0 : index)
  }

  const sorted = [...notes].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sorted.map((note) => (
        <NoteCard key={note.id} note={note} color={getColorForCategory(note.category.id)} />
      ))}
    </div>
  )
}
