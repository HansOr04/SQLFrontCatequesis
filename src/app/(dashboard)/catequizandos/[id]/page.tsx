// src/app/(dashboard)/catequizandos/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeftIcon,
  PencilIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';

// Componentes del módulo
import { CatequizandoDetail } from '@/components/catequizandos/CatequizandoDetail';
import { CatequizandoForm } from '@/components/catequizandos/CatequizandoForm';

// Servicios y tipos
import { catequizandosService } from '@/services/catequizandos';
import { 
  Catequizando, 
  CatequizandoFormData,
  CatequizandoInscripcion,
  CatequizandoCertificado,
  CatequizandoSacramento,
  CatequizandoRepresentante,
  CatequizandoPadrino,
  CatequizandoBautismo
} from '@/types/catequizando';
import { ROUTES } from '@/lib/constants';

interface CatequizandoDetailPageProps {
  params: {
    id: string;
  };
}

export default function CatequizandoDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const id = parseInt(params?.id as string);

  // Estados principales
  const [catequizando, setCatequizando] = useState<Catequizando | null>(null);
  const [inscripciones, setInscripciones] = useState<CatequizandoInscripcion[]>([]);
  const [certificados, setCertificados] = useState<CatequizandoCertificado[]>([]);
  const [sacramentos, setSacramentos] = useState<CatequizandoSacramento[]>([]);
  const [representantes, setRepresentantes] = useState<CatequizandoRepresentante[]>([]);
  const [padrinos, setPadrinos] = useState<CatequizandoPadrino[]>([]);
  const [bautismo, setBautismo] = useState<CatequizandoBautismo | null>(null);
  
  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de UI
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar permisos
  const canEdit = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);

  // Validar ID
  useEffect(() => {
    if (isNaN(id) || id <= 0) {
      setError('ID de catequizando inválido');
      setLoading(false);
      return;
    }
  }, [id]);

  // Cargar datos principales del catequizando
  const loadCatequizando = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await catequizandosService.getById(id);
      
      if (response.success) {
        setCatequizando(response.data);
      } else {
        setError('No se pudo cargar la información del catequizando');
      }
    } catch (err) {
      console.error('Error al cargar catequizando:', err);
      setError('Error al cargar el catequizando. Puede que no exista o no tengas permisos.');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos relacionados
  const loadRelatedData = async () => {
    if (!catequizando) return;
    
    try {
      setDataLoading(true);
      
      // Cargar todos los datos relacionados en paralelo
      const [
        inscripcionesRes,
        certificadosRes,
        sacramentosRes,
        representantesRes,
        padrinosRes,
        bautismoRes
      ] = await Promise.allSettled([
        catequizandosService.getInscripciones(id),
        catequizandosService.getCertificados(id),
        catequizandosService.getSacramentos(id),
        catequizandosService.getRepresentantes(id),
        catequizandosService.getPadrinos(id),
        catequizandosService.getBautismo(id)
      ]);

      // Procesar resultados
      if (inscripcionesRes.status === 'fulfilled' && inscripcionesRes.value.success) {
        setInscripciones(inscripcionesRes.value.data);
      }
      
      if (certificadosRes.status === 'fulfilled' && certificadosRes.value.success) {
        setCertificados(certificadosRes.value.data);
      }
      
      if (sacramentosRes.status === 'fulfilled' && sacramentosRes.value.success) {
        setSacramentos(sacramentosRes.value.data);
      }
      
      if (representantesRes.status === 'fulfilled' && representantesRes.value.success) {
        setRepresentantes(representantesRes.value.data);
      }
      
      if (padrinosRes.status === 'fulfilled' && padrinosRes.value.success) {
        setPadrinos(padrinosRes.value.data);
      }
      
      if (bautismoRes.status === 'fulfilled' && bautismoRes.value.success) {
        setBautismo(bautismoRes.value.data);
      }
    } catch (err) {
      console.error('Error al cargar datos relacionados:', err);
    } finally {
      setDataLoading(false);
    }
  };

  // Efectos
  useEffect(() => {
    if (!isNaN(id) && id > 0) {
      loadCatequizando();
    }
  }, [id]);

  useEffect(() => {
    if (catequizando) {
      loadRelatedData();
    }
  }, [catequizando]);

  // Manejadores de eventos
  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleUpdate = async (data: CatequizandoFormData) => {
    try {
      setUpdateLoading(true);
      const response = await catequizandosService.update(id, data);
      
      if (response.success) {
        setCatequizando(response.data);
        setShowEditModal(false);
        setSuccessMessage('Catequizando actualizado correctamente');
        
        // Ocultar mensaje de éxito después de 3 segundos
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      console.error('Error al actualizar catequizando:', err);
      setError('Error al actualizar el catequizando. Por favor, intenta de nuevo.');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleBack = () => {
    router.push(ROUTES.CATEQUIZANDOS);
  };

  // Renderizado de estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Cargando información del catequizando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="space-x-3">
            <Button variant="outline" onClick={handleBack}>
              Volver
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!catequizando) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Catequizando no encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            El catequizando que buscas no existe o no tienes permisos para verlo.
          </p>
          <Button onClick={handleBack}>
            Volver a la lista
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            icon={<ArrowLeftIcon className="h-5 w-5" />}
          >
            Volver
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Detalle del Catequizando
            </h1>
            <p className="text-sm text-gray-600">
              Información completa de {catequizando.nombres} {catequizando.apellidos}
            </p>
          </div>
        </div>

        {canEdit && (
          <Button
            onClick={handleEdit}
            icon={<PencilIcon className="h-5 w-5" />}
          >
            Editar
          </Button>
        )}
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Componente de detalle */}
      <CatequizandoDetail
        catequizando={catequizando}
        inscripciones={inscripciones}
        certificados={certificados}
        sacramentos={sacramentos}
        representantes={representantes}
        padrinos={padrinos}
        bautismo={bautismo}
        loading={dataLoading}
        onEdit={handleEdit}
      />

      {/* Modal de edición */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Catequizando"
        size="lg"
      >
        <CatequizandoForm
          catequizando={catequizando}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          loading={updateLoading}
        />
      </Modal>
    </div>
  );
}