// src/app/(dashboard)/catequizandos/nuevo/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';

// Componentes del módulo
import { CatequizandoForm } from '@/components/catequizandos/CatequizandoForm';

// Servicios y tipos
import { catequizandosService } from '@/services/catequizandos';
import { CatequizandoFormData } from '@/types/catequizando';
import { ROUTES } from '@/lib/constants';

export default function NuevoCatequizandoPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Estados
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Verificar permisos
  const canCreate = user?.tipo_perfil && ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);

  // Redirigir si no tiene permisos
  React.useEffect(() => {
    if (user && !canCreate) {
      router.push(ROUTES.CATEQUIZANDOS);
    }
  }, [user, canCreate, router]);

  const handleCreate = async (data: CatequizandoFormData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar documento único (opcional, el backend debería manejarlo)
      if (data.documento_identidad) {
        try {
          const existingResponse = await catequizandosService.getByDocumento(data.documento_identidad);
          if (existingResponse.success) {
            setError(`Ya existe un catequizando con el documento ${data.documento_identidad}`);
            return;
          }
        } catch (err) {
          // Si no encuentra el documento, está bien (error 404 esperado)
          console.log('Documento no encontrado, proceder con la creación');
        }
      }
      
      // Crear catequizando
      const response = await catequizandosService.create(data);
      
      if (response.success) {
        setSuccess(true);
        
        // Redirigir al detalle después de 2 segundos
        setTimeout(() => {
          router.push(`${ROUTES.CATEQUIZANDOS}/${response.data.id}`);
        }, 2000);
      } else {
        setError('Error al crear el catequizando. Por favor, verifica los datos.');
      }
    } catch (err: any) {
      console.error('Error al crear catequizando:', err);
      
      // Manejar errores específicos
      if (err.message.includes('documento')) {
        setError('Ya existe un catequizando con ese documento de identidad.');
      } else if (err.message.includes('validación')) {
        setError('Los datos proporcionados no son válidos. Por favor, revisa la información.');
      } else {
        setError('Error al crear el catequizando. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.CATEQUIZANDOS);
  };

  const handleBack = () => {
    router.push(ROUTES.CATEQUIZANDOS);
  };

  // Mostrar mensaje de éxito
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Catequizando creado exitosamente!
            </h3>
            <p className="text-gray-600 mb-6">
              El catequizando ha sido registrado correctamente en el sistema.
              Serás redirigido a su perfil en unos momentos.
            </p>
            <div className="space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push(ROUTES.CATEQUIZANDOS)}
              >
                Ir a la lista
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar permisos
  if (user && !canCreate) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardContent className="p-6 text-center">
            <ExclamationTriangleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Sin permisos
            </h3>
            <p className="text-gray-600 mb-6">
              No tienes permisos para crear nuevos catequizandos.
            </p>
            <Button onClick={handleBack}>
              Volver
            </Button>
          </CardContent>
        </Card>
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
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <UserPlusIcon className="h-8 w-8 mr-3 text-primary-600" />
              Nuevo Catequizando
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Completa la información para registrar un nuevo catequizando en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Información importante */}
      <Card className="border-l-4 border-l-blue-400">
        <CardContent className="p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Información importante
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>El documento de identidad debe ser único en el sistema</li>
                  <li>La fecha de nacimiento se usará para calcular la edad automáticamente</li>
                  <li>Los casos especiales requieren atención particular y pueden tener requisitos diferentes</li>
                  <li>Una vez creado, podrás agregar más información como representantes, padrinos, etc.</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <CatequizandoForm
        onSubmit={handleCreate}
        onCancel={handleCancel}
        loading={loading}
      />

      {/* Consejos */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700">
            💡 Consejos para el registro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Documentos válidos:</h4>
              <ul className="space-y-1">
                <li>• Cédula de identidad ecuatoriana</li>
                <li>• Pasaporte para extranjeros</li>
                <li>• Documento de identificación válido</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recomendaciones de edad:</h4>
              <ul className="space-y-1">
                <li>• <strong>6-8 años:</strong> Iniciación</li>
                <li>• <strong>9-11 años:</strong> Reconciliación/Comunión</li>
                <li>• <strong>12-15 años:</strong> Confirmación</li>
                <li>• <strong>16+ años:</strong> Jóvenes/Adultos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pasos siguientes */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-blue-700">
            📋 Próximos pasos después del registro
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="text-sm text-blue-600">
            <ol className="list-decimal list-inside space-y-2">
              <li>Completar información de representantes y contactos</li>
              <li>Agregar datos de padrinos si los tiene</li>
              <li>Registrar información de bautismo si aplica</li>
              <li>Inscribir en un grupo de catequesis apropiado para su edad</li>
              <li>Comenzar el seguimiento de asistencia y progreso</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}