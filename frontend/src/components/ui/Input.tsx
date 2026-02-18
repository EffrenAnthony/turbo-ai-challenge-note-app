'use client'

import { cn } from '@/lib/utils/cn'
import { type InputHTMLAttributes, useState } from 'react'
import { EyeIcon, EyeOffIcon } from '@/components/icons'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ className, label, error, id, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-honey-800">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={cn(
            'w-full rounded-lg border border-honey-900 bg-transparent px-4 py-3 text-honey-900 placeholder:text-gray-900 focus:border-sunset-400 focus:outline-none focus:ring-1 focus:ring-sunset-400',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            isPassword && 'pr-12',
            className,
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-honey-500 hover:text-honey-700"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
