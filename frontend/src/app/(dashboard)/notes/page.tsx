'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { NoteList } from '@/components/notes/NoteList'
import { Sidebar } from '@/components/layout/Sidebar'
import { useNotes } from '@/lib/hooks/useNotes'
import { useCategories } from '@/lib/hooks/useCategories'
import { Spinner } from '@/components/ui/Spinner'
import { PlusIcon } from '@/components/icons'

export default function NotesPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const { data: notesData, isLoading: notesLoading } = useNotes()
  const { data: categories } = useCategories()

  const filteredNotes = useMemo(() => {
    const notes = notesData?.results ?? []
    if (!selectedCategoryId) return notes
    return notes.filter((note) => note.category.id === selectedCategoryId)
  }, [notesData, selectedCategoryId])

  return (
    <div className="flex h-screen bg-honey-100">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:block">
        <Sidebar
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />
      </div>

      {/* Main content — scrollable */}
      <div className="flex flex-1 flex-col overflow-y-auto p-6">
        {/* Header with New Note button */}
        <div className="flex items-center justify-end">
          <Link href="/notes/new">
            <Button color="honey" iconLeft={<PlusIcon className="h-5 w-5" />}>
              New Note
            </Button>
          </Link>
        </div>

        {/* Mobile categories */}
        <div className="mt-4 flex flex-wrap gap-2 md:hidden">
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                setSelectedCategoryId(
                  selectedCategoryId === category.id ? null : category.id,
                )
              }
              className={`rounded-full px-3 py-1 text-xs ${
                selectedCategoryId === category.id
                  ? 'bg-honey-300 font-medium'
                  : 'bg-honey-200/50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Notes content */}
        {notesLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="h-8 w-8 border-honey-300 border-t-sunset-500" />
          </div>
        ) : (
          <div className="mt-6 flex flex-1 items-start">
            <NoteList notes={filteredNotes} categories={categories ?? []} />
          </div>
        )}
      </div>
    </div>
  )
}
