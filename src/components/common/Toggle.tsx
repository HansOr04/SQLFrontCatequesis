// src/components/common/Toggle.tsx - Corregido
import React from 'react';
import { Switch } from '@headlessui/react';
import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  label?: string;
  description?: string;
  checkedLabel?: string;
  uncheckedLabel?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-7',
  md: 'h-5 w-9',
  lg: 'h-6 w-11',
};

const thumbSizeClasses = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

const translateClasses = {
  sm: 'translate-x-3',
  md: 'translate-x-4',
  lg: 'translate-x-5',
};

const colorClasses = {
  primary: {
    checked: 'bg-primary-600',
    unchecked: 'bg-gray-200',
  },
  success: {
    checked: 'bg-green-600',
    unchecked: 'bg-gray-200',
  },
  warning: {
    checked: 'bg-yellow-600',
    unchecked: 'bg-gray-200',
  },
  error: {
    checked: 'bg-red-600',
    unchecked: 'bg-gray-200',
  },
};

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  label,
  description,
  checkedLabel,
  uncheckedLabel,
  className,
}) => {
  const toggleContent = (
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        sizeClasses[size],
        checked ? colorClasses[color].checked : colorClasses[color].unchecked,
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
    >
      <span className="sr-only">
        {label || (checked ? 'Activado' : 'Desactivado')}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
          thumbSizeClasses[size],
          checked ? translateClasses[size] : 'translate-x-0'
        )}
      />
    </Switch>
  );

  // Si hay etiquetas específicas para checked/unchecked, mostrarlas
  if (checkedLabel || uncheckedLabel) {
    return (
      <div className="flex items-center space-x-3">
        {uncheckedLabel && (
          <span className={cn(
            'text-sm',
            checked ? 'text-gray-500' : 'text-gray-900 font-medium'
          )}>
            {uncheckedLabel}
          </span>
        )}
        {toggleContent}
        {checkedLabel && (
          <span className={cn(
            'text-sm',
            checked ? 'text-gray-900 font-medium' : 'text-gray-500'
          )}>
            {checkedLabel}
          </span>
        )}
      </div>
    );
  }

  // Si hay label y description, mostrar en formato completo
  if (label || description) {
    return (
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex-grow flex flex-col">
          {label && (
            <Switch.Label as="span" className="text-sm font-medium text-gray-900" passive>
              {label}
            </Switch.Label>
          )}
          {description && (
            <Switch.Description as="span" className="text-sm text-gray-500">
              {description}
            </Switch.Description>
          )}
        </span>
        {toggleContent}
      </Switch.Group>
    );
  }

  // Caso simple, solo el toggle
  return toggleContent;
};

export default Toggle;