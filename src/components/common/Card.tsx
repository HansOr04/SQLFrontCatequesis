import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
  as?: React.ElementType;
}

const paddingClasses = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowClasses = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-soft',
  lg: 'shadow-soft-lg',
};

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
};

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  border = true,
  hover = false,
  as: Component = 'div',
  ...props
}) => {
  return (
    <Component
      className={cn(
        'bg-white',
        paddingClasses[padding],
        shadowClasses[shadow],
        roundedClasses[rounded],
        {
          'border border-neutral-200': border,
          'transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1': hover,
        },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card Header
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  divider = true,
}) => {
  return (
    <div
      className={cn(
        'pb-4',
        {
          'border-b border-neutral-200 mb-4': divider,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Card Title
interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = 'h3',
}) => {
  return (
    <Component
      className={cn(
        'text-lg font-semibold text-neutral-900',
        className
      )}
    >
      {children}
    </Component>
  );
};

// Card Description
interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className,
}) => {
  return (
    <p
      className={cn(
        'text-sm text-neutral-600 mt-1',
        className
      )}
    >
      {children}
    </p>
  );
};

// Card Content
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
};

// Card Footer
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  divider?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between';
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  divider = true,
  justify = 'end',
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={cn(
        'pt-4 flex items-center space-x-3',
        justifyClasses[justify],
        {
          'border-t border-neutral-200 mt-4': divider,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

// Stats Card (para dashboard)
interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    period: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  className,
}) => {
  const colorClasses = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-secondary-600 text-white',
    success: 'bg-success-600 text-white',
    warning: 'bg-warning-600 text-white',
    error: 'bg-error-600 text-white',
  };

  return (
    <Card className={cn('stats-card', className)} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="stats-label">{title}</h3>
          <p className="stats-number">{value}</p>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <span
                className={cn(
                  'flex items-center font-medium',
                  trend.direction === 'up' ? 'text-success-600' : 'text-error-600'
                )}
              >
                {trend.direction === 'up' ? (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-neutral-500 ml-1">{trend.period}</span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
              colorClasses[color]
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;