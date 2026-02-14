import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { NoteList } from '@/components/notes/NoteList'

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Notes</h1>
        <Link href="/notes/new">
          <Button>New Note</Button>
        </Link>
      </div>
      <NoteList notes={[]} />
    </div>
  )
}
