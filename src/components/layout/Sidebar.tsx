// src/components/layout/Sidebar.tsx
'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  Squares2X2Icon,
  UsersIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  BuildingLibraryIcon,
  Bars3BottomLeftIcon,
  UserCircleIcon,
  ChartBarIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { ROUTES, USER_PERMISSIONS } from '@/lib/constants';
import { Badge } from '@/components/common/Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  permissions?: string[];
  children?: Omit<NavItem, 'children'>[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: ROUTES.DASHBOARD,
    icon: Squares2X2Icon,
    permissions: ['VIEW_DASHBOARD'],
  },
  {
    name: 'Catequizandos',
    href: ROUTES.CATEQUIZANDOS,
    icon: UsersIcon,
    badge: '410',
    permissions: ['VIEW_CATEQUIZANDOS'],
  },
  {
    name: 'Catequistas',
    href: ROUTES.CATEQUISTAS,
    icon: AcademicCapIcon,
    badge: '28',
    permissions: ['VIEW_CATEQUISTAS'],
  },
  {
    name: 'Grupos',
    href: ROUTES.GRUPOS,
    icon: UserGroupIcon,
    badge: '15',
    permissions: ['VIEW_GRUPOS'],
  },
  {
    name: 'Asistencia',
    href: ROUTES.ASISTENCIA,
    icon: CheckCircleIcon,
    permissions: ['VIEW_ASISTENCIA'],
  },
  {
    name: 'Certificados',
    href: ROUTES.CERTIFICADOS,
    icon: DocumentTextIcon,
    badge: '10',
    permissions: ['VIEW_CERTIFICADOS'],
  },
];

const adminNavigation: NavItem[] = [
  {
    name: 'Administración',
    href: ROUTES.ADMINISTRACION,
    icon: CogIcon,
    permissions: ['MANAGE_SYSTEM'],
    children: [
      {
        name: 'Parroquias',
        href: ROUTES.PARROQUIAS,
        icon: BuildingLibraryIcon,
        permissions: ['MANAGE_PARROQUIAS'],
      },
      {
        name: 'Niveles',
        href: ROUTES.NIVELES,
        icon: Bars3BottomLeftIcon,
        permissions: ['MANAGE_NIVELES'],
      },
      {
        name: 'Usuarios',
        href: ROUTES.USUARIOS,
        icon: UserCircleIcon,
        permissions: ['MANAGE_USERS'],
      },
      {
        name: 'Reportes',
        href: ROUTES.REPORTES,
        icon: ChartBarIcon,
        permissions: ['VIEW_REPORTS'],
      },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const hasPermission = (permissions?: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;
    
    // Admin tiene todos los permisos
    if (user.tipo_perfil === 'admin') return true;
    
    // Aquí puedes implementar la lógica de permisos más específica
    // Por ahora, simplificamos basándonos en el tipo de perfil
    return permissions.some(permission => {
      switch (permission) {
        case 'VIEW_DASHBOARD':
          return true; // Todos pueden ver dashboard
        case 'VIEW_CATEQUIZANDOS':
        case 'VIEW_GRUPOS':
        case 'VIEW_ASISTENCIA':
        case 'VIEW_CERTIFICADOS':
          return ['admin', 'parroco', 'secretaria', 'catequista'].includes(user.tipo_perfil);
        case 'VIEW_CATEQUISTAS':
          return ['admin', 'parroco', 'secretaria'].includes(user.tipo_perfil);
        case 'MANAGE_PARROQUIAS':
        case 'MANAGE_NIVELES':
        case 'MANAGE_USERS':
        case 'MANAGE_SYSTEM':
          return user.tipo_perfil === 'admin';
        case 'VIEW_REPORTS':
          return ['admin', 'parroco'].includes(user.tipo_perfil);
        default:
          return false;
      }
    });
  };

  const isCurrentPage = (href: string): boolean => {
    if (href === ROUTES.DASHBOARD) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const NavLink: React.FC<{ item: NavItem; isChild?: boolean }> = ({ 
    item, 
    isChild = false 
  }) => {
    if (!hasPermission(item.permissions)) return null;

    const current = isCurrentPage(item.href);
    
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
          isChild ? 'pl-11' : '',
          current
            ? 'bg-primary-100 text-primary-900 border-r-4 border-primary-600'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
        )}
      >
        <item.icon
          className={cn(
            'flex-shrink-0 h-5 w-5 mr-3',
            current
              ? 'text-primary-600'
              : 'text-neutral-400 group-hover:text-neutral-600'
          )}
          aria-hidden="true"
        />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <Badge
            variant={current ? 'primary' : 'neutral'}
            size="sm"
            className="ml-2"
          >
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo para mobile */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200 lg:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L20 8.5V10C20 15 17 18.5 12 20C7 18.5 4 15 4 10V8.5L12 4.5M12 7L6 10V10.5C6 13.5 8 16.5 12 17.5C16 16.5 18 13.5 18 10.5V10L12 7Z" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-neutral-900">
            Catequesis
          </h1>
        </div>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-4 pt-6 pb-4 space-y-1 overflow-y-auto">
        {/* Navegación principal */}
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink key={item.name} item={item} />
          ))}
        </div>

        {/* Separador */}
        {hasPermission(['MANAGE_SYSTEM']) && (
          <div className="border-t border-neutral-200 my-6" />
        )}

        {/* Navegación de administración */}
        {adminNavigation.map((section) => {
          if (!hasPermission(section.permissions)) return null;
          
          return (
            <div key={section.name} className="space-y-1">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {section.name}
                </h3>
              </div>
              {section.children?.map((item) => (
                <NavLink key={item.name} item={item} isChild />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Información del usuario para mobile */}
      <div className="border-t border-neutral-200 p-4 lg:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-600">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.username}
            </p>
            <p className="text-xs text-neutral-500 truncate">
              {user?.nombre_parroquia}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="nav-sidebar">
          <SidebarContent />
        </div>
      </div>

      {/* Sidebar móvil */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 flex z-50">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={onClose}
                    >
                      <span className="sr-only">Cerrar sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Sidebar;