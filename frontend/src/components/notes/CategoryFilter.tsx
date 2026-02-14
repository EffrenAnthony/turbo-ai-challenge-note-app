'use client'

import type { Category } from '@/types/categories'
import { cn } from '@/lib/utils/cn'

interface CategoryFilterProps {
  categories: Category[]
  selected: number | null
  onSelect: (categoryId: number | null) => void
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'rounded-full px-3 py-1 text-sm',
          selected === null ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700',
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'rounded-full px-3 py-1 text-sm',
            selected === category.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
