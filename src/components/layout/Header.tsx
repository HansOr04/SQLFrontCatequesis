// src/components/layout/Header.tsx
'use client';

import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/common/Badge';
import { APP_CONFIG, USER_ROLE_LABELS } from '@/lib/constants';

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { user, logout } = useAuth();

  const notifications = [
    { id: 1, message: 'Nueva inscripción pendiente', time: '5 min' },
    { id: 2, message: 'Certificado listo para emisión', time: '1 h' },
    { id: 3, message: 'Reporte mensual disponible', time: '2 h' },
  ];

  const unreadCount = notifications.length;

  return (
    <header className="nav-header">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo y botón del menú */}
          <div className="flex items-center">
            <button
              type="button"
              className="rounded-md p-2 text-white hover:bg-primary-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800 lg:hidden"
              onClick={onMenuClick}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="flex flex-shrink-0 items-center ml-4 lg:ml-0">
              <div className="flex items-center space-x-3">
                {/* Icono del logo */}
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-900"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L20 8.5V10C20 15 17 18.5 12 20C7 18.5 4 15 4 10V8.5L12 4.5M12 7L6 10V10.5C6 13.5 8 16.5 12 17.5C16 16.5 18 13.5 18 10.5V10L12 7Z" />
                  </svg>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-white">
                    {APP_CONFIG.NAME}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          {/* Información del usuario y navegación */}
          <div className="flex items-center space-x-4">
            {/* Información de la parroquia (solo visible en pantallas grandes) */}
            {user?.nombre_parroquia && (
              <div className="hidden lg:block text-right">
                <p className="text-sm text-primary-200">
                  {user.nombre_parroquia}
                </p>
                <p className="text-xs text-primary-300">
                  {USER_ROLE_LABELS[user.tipo_perfil]}
                </p>
              </div>
            )}

            {/* Notificaciones */}
            <Menu as="div" className="relative">
              <Menu.Button className="rounded-full bg-primary-800 p-1 text-primary-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800">
                <span className="sr-only">Ver notificaciones</span>
                <div className="relative">
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {unreadCount > 0 && (
                    <Badge
                      variant="error"
                      size="sm"
                      className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-4 py-3 border-b border-neutral-200">
                    <p className="text-sm font-medium text-neutral-900">
                      Notificaciones
                    </p>
                    <p className="text-xs text-neutral-500">
                      Tienes {unreadCount} notificaciones nuevas
                    </p>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <Menu.Item key={notification.id}>
                        {({ active }) => (
                          <div
                            className={cn(
                              'block px-4 py-3 border-b border-neutral-100 last:border-b-0',
                              active ? 'bg-neutral-50' : ''
                            )}
                          >
                            <p className="text-sm text-neutral-900">
                              {notification.message}
                            </p>
                            <p className="text-xs text-neutral-500">
                              hace {notification.time}
                            </p>
                          </div>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                  
                  <div className="px-4 py-2 border-t border-neutral-200">
                    <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Ver todas las notificaciones
                    </button>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Menú del usuario */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex max-w-xs items-center rounded-full bg-primary-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-800">
                  <span className="sr-only">Abrir menú de usuario</span>
                  <div className="flex items-center space-x-3 py-2 px-3 rounded-full hover:bg-primary-700 transition-colors">
                    <UserCircleIcon className="h-8 w-8 text-primary-200" />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.username}
                      </p>
                      <p className="text-xs text-primary-200">
                        {user ? USER_ROLE_LABELS[user.tipo_perfil] : ''}
                      </p>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-primary-200" />
                  </div>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex w-full items-center px-4 py-2 text-sm text-neutral-700',
                          active ? 'bg-neutral-100' : ''
                        )}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-neutral-400" />
                        Mi Perfil
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={cn(
                          'flex w-full items-center px-4 py-2 text-sm text-neutral-700',
                          active ? 'bg-neutral-100' : ''
                        )}
                      >
                        <CogIcon className="mr-3 h-5 w-5 text-neutral-400" />
                        Configuración
                      </button>
                    )}
                  </Menu.Item>

                  <div className="border-t border-neutral-200 my-1" />

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={logout}
                        className={cn(
                          'flex w-full items-center px-4 py-2 text-sm text-neutral-700',
                          active ? 'bg-neutral-100' : ''
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-neutral-400" />
                        Cerrar Sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;