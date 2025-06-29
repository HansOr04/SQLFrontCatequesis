// src/components/catequizandos/CatequizandoList.tsx - Corregido
'use client';

import React, { useState } from 'react';
import { 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  UserPlusIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import { Table } from '@/components/common/Table';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { CatequizandoCard } from './CatequizandoCard';
import { CatequizandoForm } from './CatequizandoForm';
import { Catequizando, CatequizandoFormData } from '@/types/catequizando';
import { useAuth } from '@/context/AuthContext';
import { formatDate, calculateAge } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';
import Link from 'next/link';

interface CatequizandoListProps {
  catequizandos: Catequizando[];
  loading?: boolean;
  onEdit?: (catequizando: Catequizando) => void;
  onDelete?: (catequizando: Catequizando) => void;
  onCreate?: (data: CatequizandoFormData) => void;
  onUpdate?: (id: number, data: CatequizandoFormData) => void;
  showActions?: boolean;
  viewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;
}

export const CatequizandoList: React.FC<CatequizandoListProps> = ({
  catequizandos = [], // Valor por defecto para evitar undefined
  loading = false,
  onEdit,
  onDelete,
  onCreate,
  onUpdate,
  showActions = true,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const { user } = useAuth();
  const [selectedCatequizando, setSelectedCatequizando] = useState<Catequizando | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const canEdit = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
  const canDelete = user?.tipo_perfil === 'admin';
  const canCreate = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);

  // Verificar que catequizandos esté definido y sea un array
  const safeCatequizandos = Array.isArray(catequizandos) ? catequizandos : [];

  // Columnas para la tabla usando los campos del backend
  const columns = [
    {
      key: 'avatar',
      title: '',
      render: (catequizando: Catequizando) => (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">
            {catequizando.nombres.charAt(0)}{catequizando.apellidos.charAt(0)}
          </span>
        </div>
      )
    },
    {
      key: 'nombre_completo',
      title: 'Nombre',
      sortable: true,
      render: (catequizando: Catequizando) => (
        <div>
          <p className="font-medium text-gray-900">
            {catequizando.nombres} {catequizando.apellidos}
          </p>
          <p className="text-sm text-gray-500">
            CI: {catequizando.documento_identidad}
          </p>
        </div>
      )
    },
    {
      key: 'fecha_nacimiento',
      title: 'Fecha de Nacimiento',
      sortable: true,
      render: (catequizando: Catequizando) => (
        <div>
          <p className="text-sm text-gray-900">
            {formatDate(catequizando.fecha_nacimiento)}
          </p>
          <p className="text-xs text-gray-500">
            {calculateAge(catequizando.fecha_nacimiento)} años
          </p>
        </div>
      )
    },
    {
      key: 'edad',
      title: 'Edad',
      sortable: true,
      render: (catequizando: Catequizando) => {
        const edad = catequizando.edad || calculateAge(catequizando.fecha_nacimiento);
        return (
          <div className="text-center">
            <span className="text-lg font-bold text-blue-600">
              {edad}
            </span>
            <p className="text-xs text-gray-500">años</p>
          </div>
        );
      }
    },
    {
      key: 'caso_especial',
      title: 'Estado',
      render: (catequizando: Catequizando) => (
        <div className="flex flex-col space-y-1">
          <Badge variant="success" size="sm">
            Activo
          </Badge>
          {catequizando.caso_especial && (
            <Badge variant="warning" size="sm">
              Caso Especial
            </Badge>
          )}
        </div>
      )
    }
  ];

  // Si hay acciones, agregar columna de acciones
  if (showActions) {
    columns.push({
      key: 'actions',
      title: 'Acciones',
      render: (catequizando: Catequizando) => (
        <div className="flex space-x-2">
          <Link href={`${ROUTES.CATEQUIZANDOS}/${catequizando.id}`}>
            <Button
              variant="outline"
              size="sm"
            >
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
          
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(catequizando)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(catequizando)}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    });
  }

  const handleEdit = (catequizando: Catequizando) => {
    setSelectedCatequizando(catequizando);
    setShowEditModal(true);
    if (onEdit) {
      onEdit(catequizando);
    }
  };

  const handleDelete = (catequizando: Catequizando) => {
    setSelectedCatequizando(catequizando);
    setShowDeleteModal(true);
  };

  const handleCreate = async (data: CatequizandoFormData) => {
    if (onCreate) {
      setActionLoading(true);
      try {
        await onCreate(data);
        setShowCreateModal(false);
      } catch (error) {
        console.error('Error al crear catequizando:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleUpdate = async (data: CatequizandoFormData) => {
    if (onUpdate && selectedCatequizando) {
      setActionLoading(true);
      try {
        await onUpdate(selectedCatequizando.id, data);
        setShowEditModal(false);
        setSelectedCatequizando(null);
      } catch (error) {
        console.error('Error al actualizar catequizando:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const confirmDelete = async () => {
    if (onDelete && selectedCatequizando) {
      setActionLoading(true);
      try {
        await onDelete(selectedCatequizando);
        setShowDeleteModal(false);
        setSelectedCatequizando(null);
      } catch (error) {
        console.error('Error al eliminar catequizando:', error);
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!safeCatequizandos || safeCatequizandos.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay catequizandos
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Comienza agregando un nuevo catequizando al sistema.
        </p>
        {canCreate && (
          <div className="mt-6">
            <Button
              onClick={() => setShowCreateModal(true)}
              icon={<UserPlusIcon className="h-5 w-5" />}
            >
              Añadir Catequizando
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con controles de vista */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Catequizandos ({safeCatequizandos.length})
        </h2>
        
        <div className="flex items-center space-x-3">
          {/* Toggle de vista */}
          {onViewModeChange && (
            <div className="flex rounded-lg border border-gray-300 p-1">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Squares2X2Icon className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('table')}
              >
                <ListBulletIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {/* Botón crear */}
          {canCreate && (
            <Button
              onClick={() => setShowCreateModal(true)}
              icon={<UserPlusIcon className="h-5 w-5" />}
            >
              Añadir Catequizando
            </Button>
          )}
        </div>
      </div>

      {/* Lista/Grid de catequizandos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCatequizandos.map((catequizando) => (
            <CatequizandoCard
              key={catequizando.id}
              catequizando={catequizando}
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={showActions}
            />
          ))}
        </div>
      ) : (
        <Table
          columns={columns}
          data={safeCatequizandos}
          loading={loading}
          keyExtractor={(item) => item.id?.toString() || '0'}
        />
      )}

      {/* Modal crear catequizando */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Catequizando"
        size="lg"
      >
        <CatequizandoForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading}
        />
      </Modal>

      {/* Modal editar catequizando */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCatequizando(null);
        }}
        title="Editar Catequizando"
        size="lg"
      >
        {selectedCatequizando && (
          <CatequizandoForm
            catequizando={selectedCatequizando}
            onSubmit={handleUpdate}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedCatequizando(null);
            }}
            loading={actionLoading}
          />
        )}
      </Modal>

      {/* Modal confirmar eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCatequizando(null);
        }}
        title="Confirmar Eliminación"
        size="sm"
      >
        {selectedCatequizando && (
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              ¿Estás seguro de que deseas eliminar a{' '}
              <strong>
                {selectedCatequizando.nombres} {selectedCatequizando.apellidos}
              </strong>?
            </p>
            <p className="text-sm text-red-600">
              Esta acción no se puede deshacer y se eliminarán todos los datos relacionados.
            </p>
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCatequizando(null);
                }}
                disabled={actionLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={actionLoading}
              >
                Eliminar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};