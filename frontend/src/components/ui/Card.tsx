import { cn } from '@/lib/utils/cn'
import { type HTMLAttributes } from 'react'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white p-6 shadow-sm', className)}
      {...props}
    />
  )
}
