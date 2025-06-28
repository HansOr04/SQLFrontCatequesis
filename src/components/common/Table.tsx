// src/components/common/Table.tsx
import React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  className?: string
}

interface TableProps {
  columns: TableColumn[]
  data: any[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  className?: string
  emptyMessage?: string
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  sortKey,
  sortDirection,
  onSort,
  className,
  emptyMessage = 'No hay datos disponibles',
}) => {
  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-neutral-200">
        <thead className="bg-neutral-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider',
                  column.sortable && 'cursor-pointer hover:bg-neutral-100',
                  column.className
                )}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex flex-col">
                      <ChevronUp
                        className={cn(
                          'h-3 w-3 -mb-1',
                          sortKey === column.key && sortDirection === 'asc'
                            ? 'text-primary-600'
                            : 'text-neutral-400'
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-3 w-3',
                          sortKey === column.key && sortDirection === 'desc'
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
        <tbody className="bg-white divide-y divide-neutral-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-neutral-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-neutral-50 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-6 py-4 whitespace-nowrap text-sm text-neutral-900',
                      column.className
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table