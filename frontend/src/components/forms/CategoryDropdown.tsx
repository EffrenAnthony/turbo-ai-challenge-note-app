'use client'

import { useEffect, useRef, useState } from 'react'
import type { Category } from '@/types/categories'
import { getCategoryDotClass } from '@/lib/utils/categoryColors'
import { cn } from '@/lib/utils/cn'
import { ChevronDownIcon } from '@/components/icons'

interface CategoryDropdownProps {
  categories: Category[]
  selectedCategoryId: number
  selectedIndex: number
  onSelect: (category: Category) => void
}

export function CategoryDropdown({
  categories,
  selectedCategoryId,
  selectedIndex,
  onSelect,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = categories.find((c) => c.id === selectedCategoryId)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-3 rounded-md border-2 border-honey-800 bg-transparent px-4 py-2.5 text-base font-medium text-honey-900 transition-colors hover:bg-honey-400/20 focus:outline-none focus:ring-2 focus:ring-honey-300 focus:ring-offset-1"
      >
        <span className={cn('h-3 w-3 rounded-full', getCategoryDotClass(selectedIndex))} />
        {selected?.name ?? 'Select category'}
        <ChevronDownIcon className={cn('h-5 w-5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute left-0 z-10 mt-1 w-56 rounded-md border border-honey-200 bg-honey-50 py-1 shadow-lg">
          {categories
            .filter((c) => c.id !== selectedCategoryId)
            .map((category) => {
              const catIndex = categories.findIndex((c) => c.id === category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    onSelect(category)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-base text-honey-900 transition-colors hover:bg-honey-100"
                >
                  <span
                    className={cn('h-3 w-3 rounded-full', getCategoryDotClass(catIndex))}
                  />
                  {category.name}
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
