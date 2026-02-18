'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import type { Note } from '@/types/notes'
import type { Category } from '@/types/categories'
import type { CardColor } from '@/components/ui/Card'
import { useCategories } from '@/lib/hooks/useCategories'
import { useAutosave } from '@/lib/hooks/useAutosave'
import { getCategoryColor } from '@/lib/utils/categoryColors'
import { cn } from '@/lib/utils/cn'
import { Spinner } from '@/components/ui/Spinner'
import { CloseIcon } from '@/components/icons'
import { CategoryDropdown } from '@/components/forms/CategoryDropdown'
import { DictationButton } from '@/components/forms/DictationButton'

const colorStyles: Record<CardColor, string> = {
  sunset: 'border-sunset-400 bg-sunset-400/50',
  honey: 'border-honey-400 bg-honey-400/50',
  sage: 'border-sage-300 bg-sage-300/50',
  jade: 'border-jade-400 bg-jade-400/50',
}

interface NoteFormProps {
  note: Note
}

export function NoteForm({ note }: NoteFormProps) {
  const router = useRouter()
  const { data: categories } = useCategories()
  const { isSaving, debouncedSave, saveImmediately } = useAutosave({ noteId: note.id })

  const formik = useFormik({
    initialValues: {
      title: note.title === 'Untitled' ? '' : note.title,
      content: note.content === '.' ? '' : note.content,
      category_id: note.category.id,
    },
    enableReinitialize: true,
    onSubmit: () => {},
  })

  useEffect(() => {
    const { title, content } = formik.values
    if (formik.dirty) {
      debouncedSave({ title, content })
    }
  }, [formik.values.title, formik.values.content, debouncedSave, formik.dirty, formik.values])

  function handleCategoryChange(category: Category) {
    formik.setFieldValue('category_id', category.id)
    saveImmediately({ category_id: category.id })
  }

  function handleTranscript(text: string) {
    const current = formik.values.content
    formik.setFieldValue('content', current ? `${current} ${text}` : text)
  }

  const categoryIndex = categories
    ? Math.max(categories.findIndex((c) => c.id === formik.values.category_id), 0)
    : 0
  const cardColor = getCategoryColor(categoryIndex)

  const lastEdited = new Date(note.updated_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="flex min-h-screen flex-col bg-honey-100 p-6">
      {/* Top bar */}
      <div className="mb-4 flex items-start justify-between">
        {categories && (
          <CategoryDropdown
            categories={categories}
            selectedCategoryId={formik.values.category_id}
            selectedIndex={categoryIndex}
            onSelect={handleCategoryChange}
          />
        )}

        {/* Close + saving indicator */}
        <div className="flex items-center gap-3">
          {isSaving && (
            <div className="flex items-center gap-2 text-sm text-honey-500">
              <Spinner className="h-4 w-4 border-honey-300 border-t-sunset-500" />
              Saving...
            </div>
          )}
          <button
            type="button"
            onClick={() => router.push('/notes')}
            className="text-honey-700 transition-colors hover:text-honey-900"
            aria-label="Close"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Editor card */}
      <div
        className={cn(
          'relative flex flex-1 flex-col rounded-[11px] border-[3px] p-8',
          colorStyles[cardColor],
        )}
      >
        <p className="absolute right-8 top-6 text-xs text-gray-700">Last Edited: {lastEdited}</p>

        <input
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          placeholder="Note Title"
          className="bg-transparent font-serif text-3xl font-bold leading-tight text-gray-950 placeholder:text-gray-700 focus:outline-none"
        />

        <textarea
          name="content"
          value={formik.values.content}
          onChange={formik.handleChange}
          placeholder="Pour your heart out..."
          className="mt-4 flex-1 resize-none bg-transparent text-sm leading-relaxed text-gray-900 placeholder:text-gray-700 focus:outline-none"
        />

        <DictationButton onTranscript={handleTranscript} />
      </div>
    </div>
  )
}
