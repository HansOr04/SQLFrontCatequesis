import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
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
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
  
  const variantClasses = buttonVariants[variant];
  const sizeClasses = buttonSizes[size];
  
  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    {
      'w-full': fullWidth,
      'btn-loading': loading,
    },
    className
  );

  const iconElement = icon && (
    <span className={cn(
      'flex items-center',
      {
        'mr-2': iconPosition === 'left' && children,
        'ml-2': iconPosition === 'right' && children,
      }
    )}>
      {icon}
    </span>
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {loading ? (
        <div className="flex items-center">
          <div className="w-4 h-4 border-2 border-transparent border-t-current rounded-full animate-spin mr-2" />
          Cargando...
        </div>
      ) : (
        <>
          {children}
          {iconPosition === 'right' && iconElement}
        </>
      )}
    </button>
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