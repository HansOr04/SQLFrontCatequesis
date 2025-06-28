// src/components/catequizandos/CatequizandoForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/common/Button';
import Input from '@/components/common/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Catequizando, CatequizandoFormData } from '@/types/catequizando';
import { calculateAge } from '@/lib/utils';

// Validación básica
const validateForm = (data: CatequizandoFormData) => {
  const errors: Record<string, string> = {};
  
  if (!data.nombres || data.nombres.trim().length < 2) {
    errors.nombres = 'Los nombres deben tener al menos 2 caracteres';
  }
  
  if (!data.apellidos || data.apellidos.trim().length < 2) {
    errors.apellidos = 'Los apellidos deben tener al menos 2 caracteres';
  }
  
  if (!data.fecha_nacimiento) {
    errors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
  } else {
    const fecha = new Date(data.fecha_nacimiento);
    const hoy = new Date();
    const hace100Anos = new Date();
    hace100Anos.setFullYear(hoy.getFullYear() - 100);
    
    if (fecha >= hoy) {
      errors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';
    }
    
    if (fecha < hace100Anos) {
      errors.fecha_nacimiento = 'La fecha de nacimiento no puede ser hace más de 100 años';
    }
  }
  
  if (!data.documento_identidad || data.documento_identidad.trim().length < 6) {
    errors.documento_identidad = 'El documento debe tener al menos 6 caracteres';
  }
  
  // Validación básica de documento ecuatoriano
  if (data.documento_identidad && !/^[a-zA-Z0-9\-]+$/.test(data.documento_identidad)) {
    errors.documento_identidad = 'El documento solo puede contener letras, números y guiones';
  }
  
  return errors;
};

interface CatequizandoFormProps {
  catequizando?: Catequizando;
  onSubmit: (data: CatequizandoFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const CatequizandoForm: React.FC<CatequizandoFormProps> = ({
  catequizando,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CatequizandoFormData>({
    nombres: catequizando?.nombres || '',
    apellidos: catequizando?.apellidos || '',
    fecha_nacimiento: catequizando?.fecha_nacimiento || '',
    documento_identidad: catequizando?.documento_identidad || '',
    caso_especial: catequizando?.caso_especial || false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!catequizando;

  // Calcular edad cuando cambia la fecha de nacimiento
  const edad = formData.fecha_nacimiento ? calculateAge(formData.fecha_nacimiento) : null;

  const handleInputChange = (field: keyof CatequizandoFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Enviar datos
    onSubmit(formData);
  };

  const handleReset = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      documento_identidad: '',
      caso_especial: false,
    });
    setErrors({});
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar Catequizando' : 'Nuevo Catequizando'}
        </CardTitle>
        <p className="text-sm text-gray-600">
          {isEditing 
            ? 'Modifica la información del catequizando' 
            : 'Completa la información para registrar un nuevo catequizando'
          }
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres */}
              <div>
                <Input
                  label="Nombres"
                  placeholder="Ingresa los nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange('nombres', e.target.value)}
                  error={errors.nombres}
                  required
                />
              </div>

              {/* Apellidos */}
              <div>
                <Input
                  label="Apellidos"
                  placeholder="Ingresa los apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange('apellidos', e.target.value)}
                  error={errors.apellidos}
                  required
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <Input
                  type="date"
                  label="Fecha de Nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={(e) => handleInputChange('fecha_nacimiento', e.target.value)}
                  error={errors.fecha_nacimiento}
                  required
                />
                {edad && (
                  <p className="mt-1 text-sm text-gray-600">
                    Edad: {edad} años
                  </p>
                )}
              </div>

              {/* Documento de Identidad */}
              <div>
                <Input
                  label="Documento de Identidad"
                  placeholder="Ej: 1234567890"
                  value={formData.documento_identidad}
                  onChange={(e) => handleInputChange('documento_identidad', e.target.value)}
                  error={errors.documento_identidad}
                  required
                />
              </div>
            </div>
          </div>

          {/* Configuración Especial */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configuración Especial
            </h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="caso_especial"
                checked={formData.caso_especial}
                onChange={(e) => handleInputChange('caso_especial', e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="caso_especial" className="text-sm font-medium text-gray-700">
                Marcar como caso especial
              </label>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Los casos especiales requieren atención particular y pueden tener requisitos diferentes
            </p>
          </div>

          {/* Vista previa si está editando */}
          {isEditing && catequizando && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Vista Previa</h4>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {formData.nombres.charAt(0)}{formData.apellidos.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {formData.nombres} {formData.apellidos}
                  </p>
                  <p className="text-sm text-gray-500">
                    CI: {formData.documento_identidad}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="success" size="sm">
                      Activo
                    </Badge>
                    {formData.caso_especial && (
                      <Badge variant="warning" size="sm">
                        Caso Especial
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Información de edad si hay fecha */}
          {edad && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-800">
                    <strong>Edad calculada:</strong> {edad} años
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {edad < 6 && 'Edad muy temprana para catequesis regular'}
                    {edad >= 6 && edad <= 8 && 'Edad apropiada para Iniciación'}
                    {edad >= 9 && edad <= 11 && 'Edad apropiada para Reconciliación/Comunión'}
                    {edad >= 12 && edad <= 15 && 'Edad apropiada para Confirmación'}
                    {edad > 15 && 'Edad apropiada para Confirmación/Jóvenes'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            
            {!isEditing && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={loading}
              >
                Limpiar
              </Button>
            )}
            
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Catequizando'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};