// src/app/(dashboard)/catequizandos/page.tsx - Importación corregida
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlusIcon,
  ChartBarIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import Pagination from '@/components/common/Pagination'; // ✅ Importación corregida
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';
import { useDebounce } from '@/hooks/useDebounce';

// Componentes del módulo
import { CatequizandoFilters } from '@/components/catequizandos/CatequizandoFilters';
import { CatequizandoList } from '@/components/catequizandos/CatequizandoList';
import { CatequizandoStats } from '@/components/catequizandos/CatequizandoStats';

// Servicios y tipos
import { catequizandosService } from '@/services/catequizandos';
import { 
  Catequizando, 
  CatequizandoFilters as FilterType, 
  CatequizandoFormData,
  CatequizandoStats as StatsType
} from '@/types/catequizando';
import { PaginatedResponse } from '@/types/api';
import { ROUTES } from '@/lib/constants';

export default function CatequizandosPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Estados principales
  const [catequizandos, setCatequizandos] = useState<Catequizando[]>([]);
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Estados de UI
  const [showStats, setShowStats] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  
  // Estados de filtros y paginación
  const [filters, setFilters] = useState<FilterType>({
    search: '',
    parroquia: undefined,
    nivel: undefined,
    edad_min: undefined,
    edad_max: undefined,
    caso_especial: undefined,
    page: 1,
    limit: 12
  });
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0
  });

  // Debounce para búsqueda
  const debouncedSearchTerm = useDebounce(filters.search || '', 500);

  // Verificar permisos
  const canCreate = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
  const canEdit = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
  const canDelete = user?.tipo_perfil === 'admin';

  // Cargar catequizandos
  const loadCatequizandos = useCallback(async (currentFilters: FilterType) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: PaginatedResponse<Catequizando> = await catequizandosService.getAll(currentFilters);
      
      setCatequizandos(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error al cargar catequizandos:', err);
      setError('Error al cargar los catequizandos. Por favor, intenta de nuevo.');
      setCatequizandos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar estadísticas
  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const response = await catequizandosService.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Efectos
  useEffect(() => {
    loadCatequizandos(filters);
  }, [loadCatequizandos, filters, debouncedSearchTerm]);

  useEffect(() => {
    if (showStats && !stats) {
      loadStats();
    }
  }, [showStats, stats, loadStats]);

  // Manejadores de eventos
  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters({
      ...newFilters,
      page: 1 // Reset página al cambiar filtros
    });
  };

  const handleSearch = (query: string) => {
    setFilters(prev => ({
      ...prev,
      search: query,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const handleViewModeChange = (mode: 'table' | 'grid') => {
    setViewMode(mode);
    // Ajustar límite según el modo de vista
    const newLimit = mode === 'grid' ? 12 : 20;
    setFilters(prev => ({
      ...prev,
      limit: newLimit,
      page: 1
    }));
  };

  // CRUD Operations
  const handleCreate = async (data: CatequizandoFormData) => {
    try {
      setActionLoading(true);
      const response = await catequizandosService.create(data);
      
      if (response.success) {
        // Recargar lista
        await loadCatequizandos(filters);
        // Recargar estadísticas si están visibles
        if (showStats) {
          await loadStats();
        }
        router.push(`${ROUTES.CATEQUIZANDOS}/${response.data.id}`);
      }
    } catch (err) {
      console.error('Error al crear catequizando:', err);
      setError('Error al crear el catequizando. Por favor, intenta de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (catequizando: Catequizando) => {
    router.push(`${ROUTES.CATEQUIZANDOS}/${catequizando.id}`);
  };

  const handleUpdate = async (id: number, data: CatequizandoFormData) => {
    try {
      setActionLoading(true);
      const response = await catequizandosService.update(id, data);
      
      if (response.success) {
        // Actualizar la lista local
        setCatequizandos(prev => 
          prev.map(cat => 
            cat.id === id ? { ...cat, ...response.data } : cat
          )
        );
        // Recargar estadísticas si están visibles
        if (showStats) {
          await loadStats();
        }
      }
    } catch (err) {
      console.error('Error al actualizar catequizando:', err);
      setError('Error al actualizar el catequizando. Por favor, intenta de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (catequizando: Catequizando) => {
    try {
      setActionLoading(true);
      const response = await catequizandosService.delete(catequizando.id);
      
      if (response.success) {
        // Remover de la lista local
        setCatequizandos(prev => prev.filter(cat => cat.id !== catequizando.id));
        // Recargar estadísticas si están visibles
        if (showStats) {
          await loadStats();
        }
      }
    } catch (err) {
      console.error('Error al eliminar catequizando:', err);
      setError('Error al eliminar el catequizando. Por favor, intenta de nuevo.');
    } finally {
      setActionLoading(false);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.nivel) count++;
    if (filters.parroquia) count++;
    if (filters.edad_min) count++;
    if (filters.edad_max) count++;
    if (filters.caso_especial !== undefined) count++;
    return count;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catequizandos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona la información de todos los catequizandos del sistema
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {/* Botón estadísticas */}
          <Button
            variant="outline"
            onClick={() => setShowStats(!showStats)}
            icon={<ChartBarIcon className="h-5 w-5" />}
          >
            {showStats ? 'Ocultar' : 'Ver'} Estadísticas
          </Button>
          
          {/* Botón crear */}
          {canCreate && (
            <Button
              onClick={() => router.push(ROUTES.CATEQUIZANDOS_NEW)}
              icon={<UserPlusIcon className="h-5 w-5" />}
            >
              Nuevo Catequizando
            </Button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      {showStats && (
        <CatequizandoStats
          data={stats}
          loading={statsLoading}
          error={error}
        />
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-6">
          <CatequizandoFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
          />
        </CardContent>
      </Card>

      {/* Barra de información y controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-700">
            {loading ? (
              'Cargando...'
            ) : (
              <>
                <span className="font-medium">{pagination.total}</span> catequizando{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
                {getActiveFiltersCount() > 0 && (
                  <Badge variant="primary" size="sm" className="ml-2">
                    <FunnelIcon className="h-3 w-3 mr-1" />
                    {getActiveFiltersCount()} filtro{getActiveFiltersCount() > 1 ? 's' : ''}
                  </Badge>
                )}
              </>
            )}
          </p>
        </div>

        {/* Controles de vista */}
        <div className="flex items-center space-x-2">
          <div className="flex rounded-lg border border-gray-300 p-1">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <Squares2X2Icon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('table')}
            >
              <ListBulletIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setError(null);
                    loadCatequizandos(filters);
                  }}
                >
                  Reintentar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de catequizandos */}
      <CatequizandoList
        catequizandos={catequizandos}
        loading={loading}
        onEdit={handleEdit}
        onDelete={canDelete ? handleDelete : undefined}
        onCreate={canCreate ? handleCreate : undefined}
        onUpdate={canEdit ? handleUpdate : undefined}
        showActions={canEdit || canDelete}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

      {/* Paginación */}
      {!loading && pagination.total_pages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onPageChange={handlePageChange}
            showPageSize={true}
            pageSize={pagination.per_page}
            onPageSizeChange={(size) => setFilters(prev => ({ ...prev, limit: size, page: 1 }))}
            totalItems={pagination.total}
            itemsPerPage={pagination.per_page}
          />
        </div>
      )}

      {/* Loading overlay para acciones */}
      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <LoadingSpinner size="md" />
            <span>Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
}