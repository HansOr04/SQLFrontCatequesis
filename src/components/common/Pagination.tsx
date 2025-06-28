
// src/components/common/Pagination.tsx
import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from './Button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
  showInfo?: boolean
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showInfo = true,
  className,
}) => {
  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const startItem = (currentPage - 1) * (itemsPerPage || 0) + 1
  const endItem = Math.min(currentPage * (itemsPerPage || 0), totalItems || 0)

  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showInfo && itemsPerPage && totalItems && (
        <div className="text-sm text-neutral-700">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeft/>}
          iconPosition="left"
        >
          Anterior
        </Button>

        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-1 text-neutral-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={cn(
                  'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-700 hover:bg-neutral-100'
                )}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRight/>}
          iconPosition="right"
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}

export default Pagination