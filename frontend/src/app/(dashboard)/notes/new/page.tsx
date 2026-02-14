import { NoteForm } from '@/components/forms/NoteForm'

export default function NewNotePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Note</h1>
      <NoteForm />
    </div>
  )
}
