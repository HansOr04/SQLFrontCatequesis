// src/components/common/Button.tsx - Corregido
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children?: React.ReactNode; // Hacer children opcional
  isIconOnly?: boolean; // Nueva prop para botones solo con iconos
}

const buttonVariants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'border-2 border-primary-300 text-primary-700 hover:bg-primary-50 hover:border-primary-400',
  ghost: 'text-primary-600 hover:bg-primary-50 hover:text-primary-700',
  danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
  success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

// Tamaños específicos para botones solo con iconos
const iconOnlySizes = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3',
  xl: 'p-4',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  disabled,
  className,
  children,
  isIconOnly,
  ...props
}) => {
  // Determinar si es un botón solo con icono automáticamente
  const actuallyIconOnly = isIconOnly || (icon && !children && !loading);

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = buttonVariants[variant];
  const sizeClasses = actuallyIconOnly ? iconOnlySizes[size] : buttonSizes[size];
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    {
      'w-full': fullWidth,
      'btn-loading': loading,
      'aspect-square': actuallyIconOnly, // Hacer cuadrado los botones solo con iconos
    },
    className
  );

  const iconElement = icon && (
    <span className={cn(
      'flex items-center',
      {
        'mr-2': iconPosition === 'left' && children && !actuallyIconOnly,
        'ml-2': iconPosition === 'right' && children && !actuallyIconOnly,
      }
    )}>
      {icon}
    </span>
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      title={actuallyIconOnly && typeof children === 'string' ? children : undefined} // Tooltip para botones solo con iconos
      {...props}
    >
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin" />
          {!actuallyIconOnly && <span className="ml-2">Cargando...</span>}
        </div>
      ) : actuallyIconOnly ? (
        // Botón solo con icono
        iconElement
      ) : (
        // Botón normal con texto
        <>
          {iconPosition === 'left' && iconElement}
          {children}
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </button>
  );
};

// Componente específico para botones solo con iconos
interface IconButtonProps extends Omit<ButtonProps, 'children' | 'iconPosition' | 'isIconOnly'> {
  icon: React.ReactNode;
  'aria-label': string; // Requerido para accesibilidad
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  tooltip,
  ...props
}) => {
  return (
    <Button
      {...props}
      icon={icon}
      isIconOnly
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
    />
  );
};

// Componente de grupo de botones
interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, className }) => {
  return (
    <div className={cn('inline-flex rounded-md shadow-sm', className)} role="group">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const isFirst = index === 0;
          const isLast = index === React.Children.count(children) - 1;
          
          return React.cloneElement(child as React.ReactElement<any>, {
            className: cn(
              (child.props as any).className,
              {
                'rounded-r-none border-r-0': !isLast,
                'rounded-l-none': !isFirst,
              }
            ),
          });
        }
        return child;
      })}
    </div>
  );
};

export default Button;