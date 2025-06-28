
// src/components/common/Toggle.tsx
'use client'
import React from 'react'
import { Switch } from '@headlessui/react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  label,
  description,
  size = 'md',
  disabled = false,
  className,
}) => {
  const sizes = {
    sm: {
      switch: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translate: 'translate-x-3',
    },
    md: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'h-7 w-12',
      thumb: 'h-6 w-6',
      translate: 'translate-x-5',
    },
  }

  const currentSize = sizes[size]

  return (
    <div className={cn('flex items-center', className)}>
      <Switch
        checked={enabled}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          'relative inline-flex shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-opacity-75',
          enabled ? 'bg-success-600' : 'bg-neutral-200',
          disabled && 'cursor-not-allowed opacity-50',
          currentSize.switch
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out',
            enabled ? currentSize.translate : 'translate-x-0',
            currentSize.thumb
          )}
        />
      </Switch>
      
      {(label || description) && (
        <div className="ml-3">
          {label && (
            <label className="text-sm font-medium text-neutral-700">
              {label}
            </label>
          )}
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Toggle
