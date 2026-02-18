'use client'

import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getNote } from '@/lib/api/notes'
import { NoteForm } from '@/components/forms/NoteForm'
import { Spinner } from '@/components/ui/Spinner'

interface NoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { id } = use(params)
  const noteId = Number(id)

  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
  })

  if (isLoading || !note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-honey-100">
        <Spinner className="h-8 w-8 border-honey-300 border-t-sunset-500" />
      </div>
    )
  }

  return <NoteForm note={note} />
}
