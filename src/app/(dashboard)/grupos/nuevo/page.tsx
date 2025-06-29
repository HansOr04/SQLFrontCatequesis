// src/app/(dashboard)/grupos/nuevo/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  UserGroupIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import GrupoForm from '@/components/grupos/GrupoForm';
import { GrupoFormData } from '@/types/grupo';
import { usePermissions } from '@/hooks/usePermissions';
import { gruposService } from '@/services/grupos';
import { ROUTES } from '@/lib/constants';

export default function NuevoGrupoPage() {
  const router = useRouter();
  const { canManage } = usePermissions();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verificar permisos
  if (!canManage('GRUPOS')) {
    router.push(ROUTES.GRUPOS);
    return null;
  }

  const handleSubmit = async (data: GrupoFormData) => {
    setLoading(true);
    try {
      const response = await gruposService.create(data);
      
      if (response.success) {
        setSuccess(true);
        
        // Mostrar éxito por 2 segundos y luego redirigir
        setTimeout(() => {
          router.push(ROUTES.GRUPOS_DETAIL(response.data.id_grupo));
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating grupo:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.GRUPOS);
  };

  const handleBackToList = () => {
    router.push(ROUTES.GRUPOS);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Grupo creado exitosamente!
            </h2>
            <p className="text-gray-600 mb-4">
              El grupo ha sido registrado correctamente en el sistema.
            </p>
            <p className="text-sm text-gray-500">
              Redirigiendo al detalle del grupo...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y navegación */}
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
            <span className="text-gray-900 font-medium">Nuevo Grupo</span>
          </div>
        </div>
      </div>

      {/* Título principal */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserGroupIcon className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Crear Nuevo Grupo
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Configura un nuevo grupo de catequesis especificando la parroquia, nivel y periodo correspondiente.
        </p>
      </div>

      {/* Información importante */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Información Importante</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-blue-600 font-semibold mb-2">Parroquia</div>
              <div className="text-sm text-blue-700">
                Selecciona la parroquia donde funcionará el grupo
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-green-600 font-semibold mb-2">Nivel</div>
              <div className="text-sm text-green-700">
                Elige el nivel de catequesis apropiado
              </div>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-purple-600 font-semibold mb-2">Periodo</div>
              <div className="text-sm text-purple-700">
                Define el año o periodo académico
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <div className="max-w-4xl mx-auto">
        <GrupoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
        />
      </div>

      {/* Consejos */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Consejos para crear un grupo exitoso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold text-xs">1</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Capacidad recomendada</div>
                <div>Mantén entre 15-25 catequizandos por grupo para una atención personalizada.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-semibold text-xs">2</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Asignación de catequistas</div>
                <div>Asigna al menos 2 catequistas por grupo para mejor cobertura y apoyo.</div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-semibold text-xs">3</span>
              </div>
              <div>
                <div className="font-medium text-gray-900">Planificación del periodo</div>
                <div>Considera fechas festivas y períodos vacacionales al planificar las clases.</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}