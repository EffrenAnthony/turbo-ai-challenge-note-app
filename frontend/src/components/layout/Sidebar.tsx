'use client'

import { useCategories } from '@/lib/hooks/useCategories'
import { useNotes } from '@/lib/hooks/useNotes'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { getCategoryDotClass } from '@/lib/utils/categoryColors'
import { cn } from '@/lib/utils/cn'

interface SidebarProps {
  selectedCategoryId: number | null
  onSelectCategory: (id: number | null) => void
}

export function Sidebar({ selectedCategoryId, onSelectCategory }: SidebarProps) {
  const { data: categories, isLoading } = useCategories()
  const { data: notesData } = useNotes()
  const { logoutUser } = useAuth()
  const router = useRouter()

  const notes = notesData?.results ?? []

  function countByCategory(categoryId: number) {
    return notes.filter((n) => n.category.id === categoryId).length
  }

  function handleLogout() {
    logoutUser()
    router.push('/login')
  }

  return (
    <aside className="flex h-full w-56 shrink-0 flex-col p-6">
      <nav className="flex-1">
        <h2 className="text-sm font-bold text-gray-900">All Categories</h2>
        {isLoading ? (
          <p className="mt-3 text-sm text-honey-500">Loading...</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {categories?.map((category, index) => (
              <li key={category.id}>
                <button
                  onClick={() =>
                    onSelectCategory(selectedCategoryId === category.id ? null : category.id)
                  }
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-sm transition-colors hover:bg-honey-200/50',
                    selectedCategoryId === category.id && 'bg-honey-200/50 font-medium',
                  )}
                >
                  <span
                    className={cn(
                      'h-2.5 w-2.5 shrink-0 rounded-full',
                      getCategoryDotClass(index),
                    )}
                  />
                  <span className="flex-1">{category.name}</span>
                  <span className="text-xs text-gray-900">{countByCategory(category.id)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
      <button
        onClick={handleLogout}
        className="mt-auto text-left text-sm text-honey-600 transition-colors hover:text-honey-800"
      >
        Log out
      </button>
    </aside>
  )
}
