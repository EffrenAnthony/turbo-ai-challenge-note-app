import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-lg px-4 py-2 font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'border border-gray-300 bg-white hover:bg-gray-50',
        variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700',
        className,
      )}
      {...props}
    />
  )
}
