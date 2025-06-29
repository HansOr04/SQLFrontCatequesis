// src/app/(dashboard)/grupos/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  UserGroupIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import GrupoDetail from '@/components/grupos/GrupoDetail';
import GrupoForm from '@/components/grupos/GrupoForm';
import { Grupo, GrupoFormData } from '@/types/grupo';
import { Inscripcion } from '@/types/inscripcion';
import { Usuario } from '@/types/usuario';
import { usePermissions } from '@/hooks/usePermissions';
import { gruposService } from '@/services/grupos';
import { ROUTES } from '@/lib/constants';

export default function GrupoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { canManage } = usePermissions();
  
  // Estados principales
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [catequistas, setCatequistas] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Obtener y validar el ID del grupo
  const idParam = params.id;
  const grupoId = typeof idParam === 'string' ? parseInt(idParam) : null;

  // Verificar que tenemos un ID válido
  if (!grupoId || isNaN(grupoId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <UserGroupIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ID de grupo inválido
          </h2>
          <p className="text-gray-600 mb-4">
            El ID del grupo proporcionado no es válido
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(ROUTES.GRUPOS)}
            icon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Volver a Grupos
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (grupoId) {
      loadGrupoData();
    }
  }, [grupoId]);

  const loadGrupoData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar datos del grupo
      const grupoResponse = await gruposService.getById(grupoId);
      
      if (!grupoResponse.success) {
        setError('No se pudo cargar la información del grupo');
        return;
      }
      
      setGrupo(grupoResponse.data);
      
      // Cargar datos relacionados en paralelo
      const [inscripcionesResponse, catequistasResponse] = await Promise.allSettled([
        gruposService.getInscripciones(grupoId),
        gruposService.getCatequistas(grupoId),
      ]);
      
      // Procesar inscripciones
      if (inscripcionesResponse.status === 'fulfilled' && inscripcionesResponse.value.success) {
        setInscripciones(inscripcionesResponse.value.data);
      }
      
      // Procesar catequistas
      if (catequistasResponse.status === 'fulfilled' && catequistasResponse.value.success) {
        setCatequistas(catequistasResponse.value.data);
      }
      
    } catch (error) {
      console.error('Error loading grupo data:', error);
      setError('Error al cargar los datos del grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGrupo = async (data: GrupoFormData) => {
    if (!grupo) return;
    
    setFormLoading(true);
    try {
      const response = await gruposService.update(grupo.id_grupo, data);
      
      if (response.success) {
        setGrupo(response.data);
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating grupo:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInscripcionEdit = (inscripcion: Inscripcion) => {
    // Aquí podrías abrir un modal para editar la inscripción
    // o redirigir a una página de edición
    console.log('Edit inscripcion:', inscripcion);
  };

  const handleBackToList = () => {
    router.push(ROUTES.GRUPOS);
  };

  const handleAsistencia = () => {
    router.push(`/asistencia/${grupoId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando información del grupo..." />
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <UserGroupIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar el grupo
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'No se pudo encontrar la información del grupo solicitado'}
          </p>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={handleBackToList}
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Volver a Grupos
            </Button>
            <Button
              variant="primary"
              onClick={loadGrupoData}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb y navegación */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToList}
            icon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Volver a Grupos
          </Button>
          
          <div className="text-sm text-gray-500">
            <span>Grupos</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{grupo.nombre}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAsistencia}
            icon={<ClipboardDocumentListIcon className="h-4 w-4" />}
          >
            Asistencia
          </Button>
          
          {canManage('GRUPOS') && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowEditModal(true)}
            >
              Editar Grupo
            </Button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <GrupoDetail
        grupo={grupo}
        inscripciones={inscripciones}
        catequistas={catequistas}
        onEdit={canManage('GRUPOS') ? () => setShowEditModal(true) : undefined}
        onInscripcionEdit={canManage('INSCRIPCIONES') ? handleInscripcionEdit : undefined}
      />

      {/* Modal de edición */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Grupo"
        size="lg"
      >
        <GrupoForm
          grupo={grupo}
          onSubmit={handleEditGrupo}
          onCancel={() => setShowEditModal(false)}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
}