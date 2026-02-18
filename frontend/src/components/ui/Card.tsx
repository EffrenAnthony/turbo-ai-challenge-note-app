import { cn } from '@/lib/utils/cn'
import { type HTMLAttributes } from 'react'

export type CardColor = 'sunset' | 'honey' | 'sage' | 'jade'

const colorStyles: Record<CardColor, string> = {
  sunset: 'border-sunset-400 bg-sunset-400/50',
  honey: 'border-honey-400 bg-honey-400/50',
  sage: 'border-sage-300 bg-sage-300/50',
  jade: 'border-jade-400 bg-jade-400/50',
}

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  color?: CardColor
}

export function Card({ color = 'jade', className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'h-61.5 rounded-[11px] border-[3px] p-4 overflow-hidden',
        colorStyles[color],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
