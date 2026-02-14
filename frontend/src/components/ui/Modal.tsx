'use client'

import { cn } from '@/lib/utils/cn'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function Modal({ open, onClose, children, className }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn('relative z-10 rounded-lg bg-white p-6 shadow-lg', className)}>
        {children}
      </div>
    </div>
  )
}
