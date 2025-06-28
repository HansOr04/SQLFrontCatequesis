// src/components/common/Pagination.tsx - Corregido
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showInfo?: boolean;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  showInfo = true,
  showPageSize = false,
  pageSize,
  onPageSizeChange,
  className,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    // Si hay pocas páginas, mostrar todas
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        rangeWithDots.push(i);
      }
      return rangeWithDots;
    }

    // Lógica para muchas páginas
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const effectiveItemsPerPage = pageSize || itemsPerPage || 0;
  const startItem = (currentPage - 1) * effectiveItemsPerPage + 1;
  const endItem = Math.min(currentPage * effectiveItemsPerPage, totalItems || 0);

  if (totalPages <= 1) return null;

  const pageSizeOptions = [10, 20, 50, 100];

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Información de resultados */}
      {showInfo && effectiveItemsPerPage && totalItems && (
        <div className="text-sm text-neutral-700 order-2 sm:order-1">
          Mostrando <span className="font-medium">{startItem}</span> a{' '}
          <span className="font-medium">{endItem}</span> de{' '}
          <span className="font-medium">{totalItems}</span> resultados
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        {/* Selector de tamaño de página */}
        {showPageSize && onPageSizeChange && (
          <div className="flex items-center space-x-2 mr-4">
            <span className="text-sm text-neutral-700">Mostrar:</span>
            <select
              value={pageSize || 10}
              onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botón anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<ChevronLeftIcon className="h-4 w-4" />}
        >
          Anterior
        </Button>

        {/* Números de página */}
        <div className="flex items-center space-x-1">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-neutral-500 text-sm">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md transition-colors min-w-[40px]',
                    currentPage === page
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100 border border-transparent hover:border-neutral-300'
                  )}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Botón siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<ChevronRightIcon className="h-4 w-4" />}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default Pagination;