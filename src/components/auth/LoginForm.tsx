'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common/Button';
import  Input  from '../common/Input';
import  Select  from '@/components/common/Select';
import { Card } from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';
import { LoginCredentials } from '@/types/auth';
import { APP_CONFIG, ROUTES } from '@/lib/constants';

// Extender el tipo LoginCredentials para incluir id_parroquia
interface ExtendedLoginCredentials extends LoginCredentials {
  id_parroquia?: number;
}

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<ExtendedLoginCredentials>({
    username: '',
    password: '',
    id_parroquia: undefined,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  // Opciones mock de parroquias (en producción vendrían de la API)
  const parroquiaOptions = [
    { value: 1, label: 'San Francisco de Quito' },
    { value: 2, label: 'Sagrado Corazón de Jesús' },
    { value: 3, label: 'Nuestra Señora de Guadalupe' },
    { value: 4, label: 'San José Obrero' },
  ];

  const handleInputChange = (field: keyof ExtendedLoginCredentials, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario comience a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.id_parroquia) {
      newErrors.id_parroquia = 'Debe seleccionar una parroquia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Solo enviar los campos requeridos para login
      const loginData: LoginCredentials = {
        username: formData.username,
        password: formData.password,
      };
      await login(loginData);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Error de autenticación'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L20 8.5V10C20 15 17 18.5 12 20C7 18.5 4 15 4 10V8.5L12 4.5M12 7L6 10V10.5C6 13.5 8 16.5 12 17.5C16 16.5 18 13.5 18 10.5V10L12 7Z" />
          </svg>
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Bienvenido
        </h2>
        <p className="text-gray-600">
          Inicia sesión en {APP_CONFIG.NAME}
        </p>
      </div>

      {/* Formulario */}
      <Card className="w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error general */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800">{errors.general}</span>
            </div>
          )}

          {/* Usuario */}
          <Input
            label="Nombre de usuario"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            error={errors.username}
            placeholder="Ingrese su usuario"
            required
            fullWidth
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />

          {/* Contraseña */}
          <Input
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={errors.password}
            placeholder="Ingrese su contraseña"
            required
            fullWidth
            icon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            }
            iconPosition="right"
          />

          {/* Parroquia */}
          <Select
            label="Seleccione Parroquia"
            placeholder="-- Seleccione --"
            options={parroquiaOptions}
            value={formData.id_parroquia}
            onChange={(value) => handleInputChange('id_parroquia', value)}
            error={errors.id_parroquia}
            fullWidth
          />

          {/* Botón de envío */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Arquidiócesis de Quito © {new Date().getFullYear()}
          </p>
        </div>
      </Card>
    </div>
  );
};