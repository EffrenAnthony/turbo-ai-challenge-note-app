import { NoteForm } from '@/components/forms/NoteForm'

interface EditNotePageProps {
  params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  await params

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Note</h1>
      <NoteForm />
    </div>
  )
}
