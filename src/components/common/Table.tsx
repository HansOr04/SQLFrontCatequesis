// src/components/common/Table.tsx - Corregido
import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import { TableColumn, SortConfig } from '@/types/common'; // Cambiado de @/types/api
import LoadingSpinner from './LoadingSpinner';

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onSelectionChange?: (selectedRows: (string | number)[]) => void;
  onSort?: (sortConfig: SortConfig) => void;
  emptyMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  sticky?: boolean;
  keyExtractor?: (item: T) => string | number;
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const cellPaddingClasses = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-6 py-4',
};

export function Table<T>({
  data,
  columns,
  loading = false,
  sortable = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onSort,
  emptyMessage = 'No hay datos disponibles',
  className,
  size = 'md',
  striped = false,
  hover = true,
  bordered = true,
  sticky = false,
  keyExtractor,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const handleSort = (column: TableColumn<T>) => {
    if (!sortable || !column.sortable) return;

    const key = column.key as string;
    let direction: 'asc' | 'desc' = 'asc';

    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    onSort?.(newSortConfig);
  };

  // Función para obtener el ID de un elemento
  const getRowId = (item: T, index: number): string | number => {
    if (keyExtractor) {
      return keyExtractor(item);
    }
    // Si el item tiene una propiedad id, usarla
    if (item && typeof item === 'object' && 'id' in item) {
      return (item as any).id;
    }
    // Si tiene id_[tipo], usarlo
    if (item && typeof item === 'object') {
      const itemObj = item as any;
      const idKeys = Object.keys(itemObj).filter(key => key.startsWith('id_'));
      if (idKeys.length > 0) {
        return itemObj[idKeys[0]];
      }
    }
    // Fallback al índice
    return index;
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (checked) {
      const allIds = data.map((item, index) => getRowId(item, index));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selectedRows, id]);
    } else {
      onSelectionChange(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const isAllSelected = selectable && data.length > 0 && 
    data.every((item, index) => selectedRows.includes(getRowId(item, index)));
  
  const isIndeterminate = selectable && selectedRows.length > 0 && !isAllSelected;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Sin datos
        </h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={cn('bg-gray-50', { 'sticky top-0 z-10': sticky })}>
          <tr>
            {selectable && (
              <th className={cn('text-left text-xs font-medium text-gray-500 uppercase tracking-wider', cellPaddingClasses[size])}>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column, index) => (
              <th
                key={String(column.key) || index}
                className={cn(
                  'text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  cellPaddingClasses[size],
                  sizeClasses[size],
                  {
                    'cursor-pointer select-none hover:bg-gray-100': 
                      sortable && column.sortable,
                  }
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.title}</span>
                  {sortable && column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={cn(
                          'h-3 w-3',
                          sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        )}
                      />
                      <ChevronDownIcon
                        className={cn(
                          'h-3 w-3 -mt-1',
                          sortConfig?.key === column.key && sortConfig.direction === 'desc'
                            ? 'text-primary-600'
                            : 'text-gray-400'
                        )}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => {
            const rowId = getRowId(row, rowIndex);
            return (
              <tr
                key={rowId}
                className={cn(
                  {
                    'bg-gray-50': striped && rowIndex % 2 === 1,
                    'hover:bg-gray-50': hover && !striped,
                    'border-b border-gray-200': bordered,
                  }
                )}
              >
                {selectable && (
                  <td className={cn('whitespace-nowrap', cellPaddingClasses[size])}>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedRows.includes(rowId)}
                      onChange={(e) => handleSelectRow(rowId, e.target.checked)}
                    />
                  </td>
                )}
                {columns.map((column, colIndex) => {
                  const content = column.render 
                    ? column.render(row) 
                    : String((row as any)[column.key] || '');

                  return (
                    <td
                      key={String(column.key) || colIndex}
                      className={cn(
                        'whitespace-nowrap',
                        cellPaddingClasses[size],
                        sizeClasses[size],
                        column.className
                      )}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Table simple para casos básicos
interface SimpleTableProps {
  headers: string[];
  rows: (React.ReactNode)[][];
  className?: string;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({
  headers,
  rows,
  className,
}) => {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;