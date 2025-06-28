import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  dot?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
  className?: string; // Cambiar de string a string | undefined
}

const variantClasses = {
  primary: 'badge-primary',
  secondary: 'bg-secondary-100 text-secondary-800',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-neutral-100 text-neutral-800',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'full',
  dot = false,
  icon,
  removable = false,
  onRemove,
  className,
}) => {
  return (
    <span
      className={cn(
        'badge inline-flex items-center font-medium',
        variantClasses[variant],
        sizeClasses[size],
        roundedClasses[rounded],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            {
              'bg-primary-600': variant === 'primary',
              'bg-secondary-600': variant === 'secondary',
              'bg-success-600': variant === 'success',
              'bg-warning-600': variant === 'warning',
              'bg-error-600': variant === 'error',
              'bg-blue-600': variant === 'info',
              'bg-neutral-600': variant === 'neutral',
            }
          )}
        />
      )}
      {icon && (
        <span className="mr-1">{icon}</span>
      )}
      {children}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-black hover:bg-opacity-10 focus:outline-none focus:bg-black focus:bg-opacity-10"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

// Badge de estado específico
interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'approved' | 'rejected' | 'draft';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Activo',
    variant: 'success' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  inactive: {
    label: 'Inactivo',
    variant: 'neutral' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  pending: {
    label: 'Pendiente',
    variant: 'warning' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
    ),
  },
  completed: {
    label: 'Completado',
    variant: 'success' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  approved: {
    label: 'Aprobado',
    variant: 'success' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  rejected: {
    label: 'Rechazado',
    variant: 'error' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  draft: {
    label: 'Borrador',
    variant: 'neutral' as const,
    icon: (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className,
}) => {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant={config.variant}
      size={size}
      icon={showIcon ? config.icon : undefined}
      className={className || ''} // Asegurar que no sea undefined
    >
      {config.label}
    </Badge>
  );
};

// Badge de número (para notificaciones)
interface NumberBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'error' | 'warning' | 'success';
  className?: string;
  children?: React.ReactNode;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  size = 'md',
  variant = 'primary',
  className,
  children,
}) => {
  if (count === 0 && !showZero) {
    return children ? <>{children}</> : null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();
  
  const numberSizeClasses = {
    sm: 'min-w-[1rem] h-4 text-xs',
    md: 'min-w-[1.25rem] h-5 text-xs',
    lg: 'min-w-[1.5rem] h-6 text-sm',
  };

  const badge = (
    <span
      className={cn(
        'inline-flex items-center justify-center px-1 font-semibold leading-none rounded-full',
        numberSizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {displayCount}
    </span>
  );

  if (children) {
    return (
      <div className="relative inline-flex">
        {children}
        <span className="absolute -top-1 -right-1">
          {badge}
        </span>
      </div>
    );
  }

  return badge;
};

// Badge de porcentaje
interface PercentageBadgeProps {
  percentage: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PercentageBadge: React.FC<PercentageBadgeProps> = ({
  percentage,
  showIcon = true,
  size = 'md',
  className,
}) => {
  const getVariant = (pct: number) => {
    if (pct >= 80) return 'success';
    if (pct >= 60) return 'warning';
    return 'error';
  };

  const getIcon = (pct: number) => {
    if (pct >= 80) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (pct >= 60) {
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    );
  };

  return (
    <Badge
      variant={getVariant(percentage)}
      size={size}
      icon={showIcon ? getIcon(percentage) : undefined}
      className={className || ''} // Asegurar que no sea undefined
    >
      {percentage}%
    </Badge>
  );
};

export default Badge;