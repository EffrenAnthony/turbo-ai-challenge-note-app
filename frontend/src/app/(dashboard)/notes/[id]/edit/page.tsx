import { redirect } from 'next/navigation'

interface EditNotePageProps {
  params: Promise<{ id: string }>
}

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params
  redirect(`/notes/${id}`)
}
