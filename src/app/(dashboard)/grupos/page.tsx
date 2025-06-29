// src/app/(dashboard)/grupos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  PlusIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import SearchInput from '@/components/common/SearchInput';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import GrupoList from '@/components/grupos/GrupoList';
import GrupoForm from '@/components/grupos/GrupoForm';
import { Grupo, GrupoFormData, GrupoFilters } from '@/types/grupo';
import { usePermissions } from '@/hooks/usePermissions';
import { useDebounce } from '@/hooks/useDebounce';
import { gruposService } from '@/services/grupos';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function GruposPage() {
  const router = useRouter();
  const { canManage } = usePermissions();
  
  // Estados principales
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null);
  const [deletingGrupo, setDeletingGrupo] = useState<Grupo | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Estados de filtros
  const [filters, setFilters] = useState<GrupoFilters>({});
  const [totalGrupos, setTotalGrupos] = useState(0);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  
  // Debounced search
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Cargar grupos inicial
  useEffect(() => {
    loadGrupos();
  }, [debouncedSearch, filters, currentPage]);

  const loadGrupos = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        search: debouncedSearch,
        page: currentPage,
        limit: itemsPerPage,
      };

      const response = await gruposService.getAll(params);
      
      if (response.success) {
        setGrupos(response.data);
        // Si hay meta información de paginación
        if (response.meta) {
          setTotalGrupos(response.meta.total || 0);
        }
      }
    } catch (error) {
      console.error('Error loading grupos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrupo = async (data: GrupoFormData) => {
    setFormLoading(true);
    try {
      const response = await gruposService.create(data);
      
      if (response.success) {
        setShowCreateModal(false);
        loadGrupos(); // Recargar lista
        // Aquí podrías mostrar un toast de éxito
      }
    } catch (error) {
      console.error('Error creating grupo:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditGrupo = async (data: GrupoFormData) => {
    if (!editingGrupo) return;
    
    setFormLoading(true);
    try {
      const response = await gruposService.update(editingGrupo.id_grupo, data);
      
      if (response.success) {
        setEditingGrupo(null);
        loadGrupos(); // Recargar lista
      }
    } catch (error) {
      console.error('Error updating grupo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteGrupo = async () => {
    if (!deletingGrupo) return;
    
    try {
      const response = await gruposService.delete(deletingGrupo.id_grupo);
      
      if (response.success) {
        setDeletingGrupo(null);
        loadGrupos(); // Recargar lista
      }
    } catch (error) {
      console.error('Error deleting grupo:', error);
    }
  };

  const handleGrupoClick = (grupo: Grupo) => {
    router.push(ROUTES.GRUPOS_DETAIL(grupo.id_grupo));
  };

  const paginationInfo = {
    currentPage,
    totalPages: Math.ceil(totalGrupos / itemsPerPage),
    totalItems: totalGrupos,
    itemsPerPage,
    hasNext: currentPage < Math.ceil(totalGrupos / itemsPerPage),
    hasPrevious: currentPage > 1,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <UserGroupIcon className="h-8 w-8 text-primary-600" />
            <span>Gestión de Grupos</span>
          </h1>
          <p className="text-gray-600 mt-1">
            Administra los grupos de catequesis por parroquia y nivel
          </p>
        </div>
        
        {canManage('GRUPOS') && (
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<PlusIcon className="h-4 w-4" />}
          >
            Nuevo Grupo
          </Button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-primary-600">{totalGrupos}</div>
            <div className="text-sm text-gray-600">Total Grupos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-green-600">
              {grupos.reduce((sum, g) => sum + (g.total_inscripciones || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Catequizandos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-blue-600">
              {grupos.filter(g => (g.total_inscripciones || 0) > 0).length}
            </div>
            <div className="text-sm text-gray-600">Grupos Activos</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <div className="text-3xl font-bold text-yellow-600">
              {Math.round(grupos.reduce((sum, g) => sum + (g.total_inscripciones || 0), 0) / Math.max(grupos.length, 1))}
            </div>
            <div className="text-sm text-gray-600">Promedio por Grupo</div>
          </CardContent>
        </Card>
      </div>

      {/* Controles y filtros */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Buscar grupos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                icon={<FunnelIcon className="h-4 w-4" />}
              >
                Filtros
              </Button>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant={viewMode === 'table' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  icon={<ViewColumnsIcon className="h-4 w-4" />}
                  className="rounded-r-none border-r-0"
                  isIconOnly
                  aria-label="Vista de tabla"
                />
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  icon={<Squares2X2Icon className="h-4 w-4" />}
                  className="rounded-l-none"
                  isIconOnly
                  aria-label="Vista de cuadrícula"
                />
              </div>
              
              <span className="text-sm text-gray-600">
                {totalGrupos} grupo{totalGrupos !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          
          {/* Filtros expandibles */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-sm text-gray-500">
                  Filtros por implementar: Parroquia, Nivel, Periodo
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de grupos */}
      <GrupoList
        grupos={grupos}
        loading={loading}
        pagination={paginationInfo}
        onPageChange={setCurrentPage}
        onSearch={setSearchQuery}
        onEdit={canManage('GRUPOS') ? setEditingGrupo : undefined}
        onDelete={canManage('GRUPOS') ? setDeletingGrupo : undefined}
        searchQuery={searchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Modal de creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Grupo"
        size="lg"
      >
        <GrupoForm
          onSubmit={handleCreateGrupo}
          onCancel={() => setShowCreateModal(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={!!editingGrupo}
        onClose={() => setEditingGrupo(null)}
        title="Editar Grupo"
        size="lg"
      >
        {editingGrupo && (
          <GrupoForm
            grupo={editingGrupo}
            onSubmit={handleEditGrupo}
            onCancel={() => setEditingGrupo(null)}
            loading={formLoading}
          />
        )}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={!!deletingGrupo}
        onClose={() => setDeletingGrupo(null)}
        onConfirm={handleDeleteGrupo}
        title="Eliminar Grupo"
        message={`¿Estás seguro de que deseas eliminar el grupo "${deletingGrupo?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />
    </div>
  );
}