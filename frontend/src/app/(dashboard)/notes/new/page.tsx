'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { createNote } from '@/lib/api/notes'
import { Spinner } from '@/components/ui/Spinner'

export default function NewNotePage() {
  const router = useRouter()
  const hasCreated = useRef(false)

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      router.replace(`/notes/${note.id}`)
    },
    onError: () => {
      toast.error('Failed to create note')
    },
  })

  useEffect(() => {
    if (!hasCreated.current) {
      hasCreated.current = true
      mutation.mutate({ title: 'Untitled', content: '.', category_id: 1 })
    }
  }, [mutation])

  return (
    <div className="flex min-h-screen items-center justify-center bg-honey-100">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-8 w-8 border-honey-300 border-t-sunset-500" />
        <p className="text-sm text-honey-600">Creating note...</p>
      </div>
    </div>
  )
}
