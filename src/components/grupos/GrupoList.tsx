// src/components/grupos/GrupoList.tsx
import React, { useState } from 'react';
import { 
  ViewColumnsIcon, 
  Squares2X2Icon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput'; // Default import
import { Table } from '@/components/common/Table';
import Pagination from '@/components/common/Pagination'; // Default import
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import GrupoCard from './GrupoCard';
import { Grupo } from '@/types/grupo';
import { PaginationInfo } from '@/types/common';

interface GrupoListProps {
  grupos: Grupo[];
  loading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  onEdit?: (grupo: Grupo) => void;
  onDelete?: (grupo: Grupo) => void;
  searchQuery?: string;
  viewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;
}

export const GrupoList: React.FC<GrupoListProps> = ({
  grupos,
  loading = false,
  pagination,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  searchQuery = '',
  viewMode = 'grid',
  onViewModeChange,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const tableColumns = [
    {
      key: 'nombre',
      title: 'Nombre',
      render: (grupo: Grupo) => (
        <div>
          <div className="font-medium text-gray-900">{grupo.nombre}</div>
          <div className="text-sm text-gray-500">{grupo.nombre_parroquia}</div>
        </div>
      ),
    },
    {
      key: 'nivel',
      title: 'Nivel',
      render: (grupo: Grupo) => (
        <Badge variant="primary" size="sm">
          {grupo.nombre_nivel}
        </Badge>
      ),
    },
    {
      key: 'periodo',
      title: 'Periodo',
      render: (grupo: Grupo) => (
        <Badge variant="secondary" size="sm">
          {grupo.periodo}
        </Badge>
      ),
    },
    {
      key: 'inscripciones',
      title: 'Catequizandos',
      render: (grupo: Grupo) => {
        const total = grupo.total_inscripciones || 0;
        const color = total >= 25 ? 'text-red-600' : 
                     total >= 20 ? 'text-yellow-600' : 'text-green-600';
        
        return (
          <span className={`font-medium ${color}`}>
            {total}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (grupo: Grupo) => (
        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(grupo)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(grupo)}
              className="text-red-600 hover:text-red-700"
            >
              Eliminar
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" text="Cargando grupos..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Buscar grupos..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearch?.(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={showFilters ? <XMarkIcon className="h-4 w-4" /> : <FunnelIcon className="h-4 w-4" />}
          >
            {showFilters ? 'Ocultar Filtros' : 'Filtros'}
          </Button>
          
          {onViewModeChange && (
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('table')}
                icon={<ViewColumnsIcon className="h-4 w-4" />}
                className="rounded-r-none border-r-0"
                isIconOnly
                aria-label="Vista de tabla"
              />
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                icon={<Squares2X2Icon className="h-4 w-4" />}
                className="rounded-l-none"
                isIconOnly
                aria-label="Vista de cuadrícula"
              />
            </div>
          )}
        </div>
      </div>

      {/* Filtros colapsables */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Aquí irían los componentes de filtros específicos */}
            <div className="text-sm text-gray-500">
              Filtros por implementar: Parroquia, Nivel, Periodo
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      {grupos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No se encontraron grupos</div>
          <div className="text-sm text-gray-400">
            {searchQuery ? 'Intenta con otros términos de búsqueda' : 'No hay grupos registrados'}
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grupos.map((grupo) => (
                <GrupoCard
                  key={grupo.id_grupo}
                  grupo={grupo}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <Table
              columns={tableColumns}
              data={grupos}
              keyExtractor={(grupo: Grupo) => grupo.id_grupo.toString()}
            />
          )}
          
          {pagination && onPageChange && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GrupoList;