import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'neutral';
  className?: string;
  text?: string;
  inline?: boolean;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const colorClasses = {
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  white: 'text-white',
  neutral: 'text-neutral-500',
};

const textSizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  text,
  inline = false,
}) => {
  const Wrapper = inline ? 'span' : 'div';
  const wrapperClasses = inline 
    ? 'inline-flex items-center space-x-2'
    : 'flex flex-col items-center justify-center space-y-2';

  return (
    <Wrapper className={cn(wrapperClasses, className)}>
      <svg
        className={cn(
          'animate-spin',
          sizeClasses[size],
          colorClasses[color]
        )}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <span
          className={cn(
            'font-medium',
            colorClasses[color],
            textSizeClasses[size]
          )}
        >
          {text}
        </span>
      )}
    </Wrapper>
  );
};

// Loading skeleton para contenido
interface LoadingSkeletonProps {
  lines?: number;
  height?: string;
  width?: string;
  className?: string;
  animated?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  className,
  animated = true,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-neutral-200 rounded',
            height,
            width,
            {
              'animate-pulse': animated,
            }
          )}
        />
      ))}
    </div>
  );
};

// Loading overlay para cubrir contenido
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  blur?: boolean;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  text = 'Cargando...',
  blur = true,
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div
            className={cn(
              'flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-lg',
              {
                'backdrop-blur-sm': blur,
              }
            )}
          >
            <LoadingSpinner size="lg" text={text} />
          </div>
        </div>
      )}
    </div>
  );
};

// Loading dots para estados más sutiles
interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'neutral';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'primary',
  className,
}) => {
  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const dotColorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    neutral: 'bg-neutral-500',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-bounce',
            dotSizeClasses[size],
            dotColorClasses[color]
          )}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

// Loading progress bar
interface LoadingProgressProps {
  progress: number;
  height?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  progress,
  height = 'md',
  color = 'primary',
  showPercentage = false,
  animated = true,
  className,
}) => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  };

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-neutral-200 rounded-full', heightClasses[height])}>
        <div
          className={cn(
            'rounded-full transition-all duration-300',
            heightClasses[height],
            colorClasses[color],
            {
              'animate-pulse': animated,
            }
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-center mt-1">
          <span className="text-xs text-neutral-600 font-medium">
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
    </div>
  );
};

// Loading pulse para elementos específicos
interface LoadingPulseProps {
  children: React.ReactNode;
  isLoading: boolean;
  className?: string;
}

export const LoadingPulse: React.FC<LoadingPulseProps> = ({
  children,
  isLoading,
  className,
}) => {
  return (
    <div
      className={cn(
        {
          'animate-pulse opacity-50': isLoading,
        },
        className
      )}
    >
      {children}
    </div>
  );
};

export default LoadingSpinner;