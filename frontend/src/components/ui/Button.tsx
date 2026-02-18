import { cn } from '@/lib/utils/cn'
import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { type CardColor } from '@/components/ui/Card'

const colorStyles: Record<CardColor, string> = {
  sunset:
    'border-sunset-900 text-sunset-900 hover:bg-sunset-400/20 focus:ring-sunset-300',
  honey:
    'border-honey-900 text-honey-900 hover:bg-honey-600/20 focus:ring-honey-300',
  sage: 'border-sage-900 text-sage-900 hover:bg-sage-300/20 focus:ring-sage-200',
  jade: 'border-jade-900 text-jade-900 hover:bg-jade-400/20 focus:ring-jade-300',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: CardColor
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

export function Button({
  className,
  color = 'sunset',
  iconLeft,
  iconRight,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[46px] border-2 bg-transparent px-4 py-3 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
        colorStyles[color],
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
