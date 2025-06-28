import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  fullWidth = false,
  required = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const baseInputClasses = 'input-primary';
  const variantClasses = {
    default: 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
    filled: 'bg-neutral-50 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    outlined: 'border-2 border-neutral-300 focus:border-primary-500 focus:ring-0',
  };
  
  const inputClasses = cn(
    baseInputClasses,
    variantClasses[variant],
    {
      'w-full': fullWidth,
      'border-error-300 focus:border-error-500 focus:ring-error-500': error,
      'pl-10': icon && iconPosition === 'left',
      'pr-10': icon && iconPosition === 'right',
    },
    className
  );

  return (
    <div className={cn('flex flex-col space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-neutral-400 text-sm">
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-neutral-400 text-sm">
              {icon}
            </span>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className="text-sm">
          {error ? (
            <span className="text-error-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          ) : (
            <span className="text-neutral-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Componente TextArea
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  required = false,
  resize = 'vertical',
  className,
  id,
  rows = 3,
  ...props
}, ref) => {
  const textAreaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };
  
  const textAreaClasses = cn(
    'input-primary',
    resizeClasses[resize],
    {
      'w-full': fullWidth,
      'border-error-300 focus:border-error-500 focus:ring-error-500': error,
    },
    className
  );

  return (
    <div className={cn('flex flex-col space-y-1', { 'w-full': fullWidth })}>
      {label && (
        <label 
          htmlFor={textAreaId}
          className="block text-sm font-medium text-neutral-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textAreaId}
        rows={rows}
        className={textAreaClasses}
        {...props}
      />
      
      {(error || helperText) && (
        <div className="text-sm">
          {error ? (
            <span className="text-error-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </span>
          ) : (
            <span className="text-neutral-500">{helperText}</span>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default Input;