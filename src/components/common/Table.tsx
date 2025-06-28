import React, { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { cn } from '@/lib/utils';
import { TableColumn, SortConfig } from '@/types/api';
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

export function Table<T extends { id?: string | number }>({
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

  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectionChange) return;

    if (checked) {
      const allIds = data.map(item => item.id).filter((id): id is string | number => id !== undefined);
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
    data.every(item => item.id && selectedRows.includes(item.id));
  
  const isIndeterminate = selectable && selectedRows.length > 0 && !isAllSelected;

  const visibleColumns = columns.filter(column => !column.hidden);

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
          className="mx-auto h-12 w-12 text-neutral-400"
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
        <h3 className="mt-2 text-sm font-medium text-neutral-900">
          Sin datos
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="table-responsive">
        <thead className={cn({ 'sticky top-0 z-10': sticky })}>
          <tr>
            {selectable && (
              <th className={cn('table-header', cellPaddingClasses[size])}>
                <input
                  type="checkbox"
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
            )}
            {visibleColumns.map((column, index) => (
              <th
                key={String(column.key) || index}
                className={cn(
                  'table-header',
                  cellPaddingClasses[size],
                  sizeClasses[size],
                  {
                    'cursor-pointer select-none hover:bg-neutral-100': 
                      sortable && column.sortable,
                    'text-center': column.align === 'center',
                    'text-right': column.align === 'right',
                  }
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortable && column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUpIcon
                        className={cn(
                          'h-3 w-3',
                          sortConfig?.key === column.key && sortConfig.direction === 'asc'
                            ? 'text-primary-600'
                            : 'text-neutral-400'
                        )}
                      />
                      <ChevronDownIcon
                        className={cn(
                          'h-3 w-3 -mt-1',
                          sortConfig?.key === column.key && sortConfig.direction === 'desc'
                            ? 'text-primary-600'
                            : 'text-neutral-400'
                        )}
                      />
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className={cn(
                'table-row',
                {
                  'bg-neutral-50': striped && rowIndex % 2 === 1,
                  'hover:bg-neutral-50': hover && !striped,
                  'border-b border-neutral-200': bordered,
                }
              )}
            >
              {selectable && (
                <td className={cn('table-cell', cellPaddingClasses[size])}>
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    checked={row.id ? selectedRows.includes(row.id) : false}
                    onChange={(e) => row.id && handleSelectRow(row.id, e.target.checked)}
                  />
                </td>
              )}
              {visibleColumns.map((column, colIndex) => {
                const value = row[column.key as keyof T];
                const content = column.render 
                  ? column.render(value, row) 
                  : String(value || '');

                return (
                  <td
                    key={String(column.key) || colIndex}
                    className={cn(
                      'table-cell',
                      cellPaddingClasses[size],
                      sizeClasses[size],
                      {
                        'text-center': column.align === 'center',
                        'text-right': column.align === 'right',
                      }
                    )}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
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
      <table className="table-responsive">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="table-header">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="table-row">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="table-cell">
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