import { useCallback, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateNote } from '@/lib/api/notes'
import type { UpdateNoteRequest } from '@/types/notes'

interface UseAutosaveOptions {
  noteId: number
  debounceMs?: number
}

export function useAutosave({ noteId, debounceMs = 1500 }: UseAutosaveOptions) {
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mutation = useMutation({
    mutationFn: (data: UpdateNoteRequest) => updateNote(noteId, data),
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.setQueryData(['note', noteId], updatedNote)
      setIsSaving(false)
    },
    onError: () => setIsSaving(false),
  })

  const debouncedSave = useCallback(
    (values: UpdateNoteRequest) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        setIsSaving(true)
        mutation.mutate({
          title: values.title || 'Untitled',
          content: values.content || '.',
          ...(values.category_id && { category_id: values.category_id }),
        })
      }, debounceMs)
    },
    [mutation, debounceMs],
  )

  const saveImmediately = useCallback(
    (values: UpdateNoteRequest) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setIsSaving(true)
      mutation.mutate({
        title: values.title || 'Untitled',
        content: values.content || '.',
        ...(values.category_id && { category_id: values.category_id }),
      })
    },
    [mutation],
  )

  return { isSaving, debouncedSave, saveImmediately }
}
