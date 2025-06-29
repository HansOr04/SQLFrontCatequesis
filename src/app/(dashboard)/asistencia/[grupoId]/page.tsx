// src/app/(dashboard)/asistencia/[grupoId]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  CheckCircleIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Modal, ConfirmModal } from '@/components/common/Modal';
import AsistenciaTable from '@/components/asistencia/AsistenciaTable';
import { Grupo } from '@/types/grupo';
import { Inscripcion } from '@/types/inscripcion';
import { Asistencia } from '@/types/asistencia';
import { usePermissions } from '@/hooks/usePermissions';
import { gruposService } from '@/services/grupos';
import { inscripcionesService } from '@/services/inscripciones';
import { asistenciaService } from '@/services/asistencia';

interface AsistenciaRegistro {
  id_inscripcion: number;
  inscripcion: Inscripcion;
  asistio: boolean;
  observaciones?: string;
}

export default function AsistenciaGrupoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canManage } = usePermissions();
  
  // Estados principales
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [asistenciaExistente, setAsistenciaExistente] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de UI
  const [showConfirmSave, setShowConfirmSave] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Obtener y validar grupoId
  const grupoIdParam = params.grupoId;
  const grupoId = typeof grupoIdParam === 'string' ? parseInt(grupoIdParam) : null;
  
  const fechaParam = searchParams.get('fecha');
  const [fecha, setFecha] = useState<string>(
    fechaParam || new Date().toISOString().split('T')[0]
  );

  // Verificar permisos
  if (!canManage('ASISTENCIA')) {
    router.push('/asistencia');
    return null;
  }

  // Verificar que tenemos un ID válido
  if (!grupoId || isNaN(grupoId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            ID de grupo inválido
          </h2>
          <p className="text-gray-600 mb-4">
            El ID del grupo proporcionado no es válido
          </p>
          <Button
            variant="outline"
            onClick={() => router.push('/asistencia')}
            icon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Volver a Asistencia
          </Button>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (grupoId && fecha) {
      loadData();
    }
  }, [grupoId, fecha]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Cargar datos en paralelo
      const [grupoRes, inscripcionesRes, asistenciaRes] = await Promise.allSettled([
        gruposService.getById(grupoId),
        gruposService.getInscripciones(grupoId),
        asistenciaService.getByGrupoYFecha(grupoId, fecha)
      ]);

      // Procesar grupo
      if (grupoRes.status === 'fulfilled' && grupoRes.value.success) {
        setGrupo(grupoRes.value.data);
      } else {
        setError('No se pudo cargar la información del grupo');
        return;
      }

      // Procesar inscripciones
      if (inscripcionesRes.status === 'fulfilled' && inscripcionesRes.value.success) {
        setInscripciones(inscripcionesRes.value.data);
      } else {
        setError('No se pudieron cargar las inscripciones del grupo');
        return;
      }

      // Procesar asistencia existente
      if (asistenciaRes.status === 'fulfilled' && asistenciaRes.value.success) {
        setAsistenciaExistente(asistenciaRes.value.data);
      }

    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleGuardarAsistencia = async (asistencias: AsistenciaRegistro[]) => {
    setSaving(true);
    try {
      // Preparar datos para envío
      const asistenciaMasiva = {
        fecha,
        asistencias: asistencias.map(a => ({
          id_inscripcion: a.id_inscripcion,
          asistio: a.asistio,
          observaciones: a.observaciones || ''
        }))
      };

      const response = await asistenciaService.registrarMasiva(grupoId, asistenciaMasiva);
      
      if (response.success) {
        setShowSuccess(true);
        // Recargar datos para mostrar la asistencia actualizada
        setTimeout(() => {
          loadData();
          setShowSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving asistencia:', error);
      setError('Error al guardar la asistencia');
    } finally {
      setSaving(false);
    }
  };

  const handleBackToAsistencia = () => {
    router.push('/asistencia');
  };

  const handleChangeFecha = (nuevaFecha: string) => {
    setFecha(nuevaFecha);
    // Actualizar URL para mantener el estado
    const newUrl = `/asistencia/${grupoId}?fecha=${nuevaFecha}`;
    window.history.replaceState(null, '', newUrl);
  };

  const validateFecha = () => {
    const validation = asistenciaService.validateFecha(fecha);
    return validation;
  };

  const fechaValidation = validateFecha();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Cargando registro de asistencia..." />
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <ExclamationTriangleIcon className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error al cargar datos
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'No se pudo cargar la información del grupo'}
          </p>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={handleBackToAsistencia}
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Volver a Asistencia
            </Button>
            <Button
              variant="primary"
              onClick={loadData}
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Asistencia guardada exitosamente!
            </h2>
            <p className="text-gray-600 mb-4">
              La asistencia ha sido registrada correctamente en el sistema.
            </p>
            <p className="text-sm text-gray-500">
              Actualizando datos...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const asistenciaExistenteFormatted = asistenciaExistente.map(a => ({
    id_inscripcion: a.id_inscripcion,
    inscripcion: inscripciones.find(i => i.id_inscripcion === a.id_inscripcion)!,
    asistio: a.asistio,
    observaciones: a.observaciones
  })).filter(a => a.inscripcion);

  const yaRegistrada = asistenciaExistente.length > 0;

  return (
    <div className="space-y-6">
      {/* Navegación y header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToAsistencia}
            icon={<ArrowLeftIcon className="h-4 w-4" />}
          >
            Volver a Asistencia
          </Button>
          
          <div className="text-sm text-gray-500">
            <span>Asistencia</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{grupo.nombre}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {yaRegistrada && (
            <Badge variant="success" size="sm">
              Ya Registrada
            </Badge>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4" />
            <input
              type="date"
              value={fecha}
              onChange={(e) => handleChangeFecha(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Información del grupo */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{grupo.nombre}</h2>
                <div className="text-sm text-gray-600">
                  {grupo.nombre_parroquia} • {grupo.nombre_nivel} • {grupo.periodo}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {inscripciones.length}
              </div>
              <div className="text-sm text-gray-600">Catequizandos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validación de fecha */}
      {!fechaValidation.isValid && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="py-4">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
              <div className="text-yellow-800">
                <div className="font-medium">Advertencia de fecha</div>
                <div className="text-sm">{fechaValidation.message}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabla de asistencia */}
      {inscripciones.length > 0 ? (
        <AsistenciaTable
          fecha={fecha}
          grupoNombre={grupo.nombre}
          inscripciones={inscripciones}
          asistenciaExistente={asistenciaExistenteFormatted}
          onGuardar={handleGuardarAsistencia}
          loading={saving}
          readonly={yaRegistrada}
        />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay catequizandos inscritos
            </h3>
            <p className="text-gray-600 mb-4">
              Este grupo no tiene catequizandos inscritos para registrar asistencia.
            </p>
            <Button
              variant="outline"
              onClick={handleBackToAsistencia}
            >
              Volver a Asistencia
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5 text-primary-600" />
            <span>Información del Registro</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-700">Fecha de Clase</div>
              <div className="text-gray-600">
                {new Date(fecha).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Estado del Registro</div>
              <div className="text-gray-600">
                {yaRegistrada ? 'Ya registrada' : 'Pendiente de registro'}
              </div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Total Catequizandos</div>
              <div className="text-gray-600">
                {inscripciones.length} inscritos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}