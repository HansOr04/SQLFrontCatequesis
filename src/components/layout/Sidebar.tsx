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
import { useRoleBasedStats, useFallbackStats } from '@/hooks/useSidebarStats';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string | number;
  permissions?: string[];
  children?: Omit<NavItem, 'children'>[];
  statsKey?: string; // Nueva propiedad para vincular con estadísticas
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  collapsed = false,
  onToggleCollapsed 
}) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { stats, loading } = useFallbackStats(); // Usa el hook con fallback

  // Función para obtener el badge dinámico de las estadísticas
  const getBadgeValue = (statsKey?: string): string | number | undefined => {
    if (!statsKey || !stats) return undefined;
    
    const value = stats[statsKey as keyof typeof stats];
    
    // No mostrar badge si el valor es 0 o undefined
    if (!value || value === 0) return undefined;
    
    // Formatear números grandes
    if (typeof value === 'number') {
      if (value >= 1000) {
        return `${Math.floor(value / 1000)}k+`;
      }
      return value.toString();
    }
    
    return value;
  };

  // Configuración de navegación principal con estadísticas dinámicas
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
      permissions: ['VIEW_CATEQUIZANDOS'],
      statsKey: 'catequizandos', // ✅ Endpoint existe
    },
    {
      name: 'Catequistas',
      href: ROUTES.CATEQUISTAS,
      icon: AcademicCapIcon,
      permissions: ['VIEW_CATEQUISTAS'],
      statsKey: 'catequistas', // ✅ Endpoint existe
    },
    {
      name: 'Grupos',
      href: ROUTES.GRUPOS,
      icon: UserGroupIcon,
      permissions: ['VIEW_GRUPOS'],
      statsKey: 'grupos', // ✅ Calculado desde /grupos
    },
    {
      name: 'Asistencia',
      href: ROUTES.ASISTENCIA,
      icon: CheckCircleIcon,
      permissions: ['VIEW_ASISTENCIA'],
      // No mostrar badge para asistencia (no hay endpoint general)
    },
    {
      name: 'Certificados',
      href: ROUTES.CERTIFICADOS,
      icon: DocumentTextIcon,
      permissions: ['VIEW_CERTIFICADOS'],
      // ❌ Sin badge - endpoint no existe
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

  const hasPermission = (permissions?: string[]): boolean => {
    if (!permissions || permissions.length === 0) return true;
    if (!user) return false;
    
    // Admin tiene todos los permisos
    if (user.tipo_perfil === 'admin') return true;
    
    // Usar el sistema de permisos centralizado
    return permissions.some(permission => {
      const allowedRoles = USER_PERMISSIONS[permission as keyof typeof USER_PERMISSIONS];
      return allowedRoles?.includes(user.tipo_perfil as any) || false;
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
    const badgeValue = getBadgeValue(item.statsKey);
    
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          'group flex items-center text-sm font-medium rounded-md transition-colors',
          collapsed && !isChild ? 'justify-center px-2 py-3' : 'px-3 py-2',
          isChild && !collapsed ? 'pl-11' : '',
          current
            ? 'bg-primary-100 text-primary-900 border-r-4 border-primary-600'
            : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
        )}
        title={collapsed ? item.name : undefined}
      >
        <item.icon
          className={cn(
            'flex-shrink-0 h-5 w-5',
            collapsed ? '' : 'mr-3',
            current
              ? 'text-primary-600'
              : 'text-neutral-400 group-hover:text-neutral-600'
          )}
          aria-hidden="true"
        />
        {!collapsed && (
          <>
            <span className="flex-1">{item.name}</span>
            {badgeValue && (
              <Badge
                variant={current ? 'primary' : 'neutral'}
                size="sm"
                className="ml-2"
              >
                {loading ? '...' : badgeValue}
              </Badge>
            )}
          </>
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

      {/* Logo para desktop cuando está colapsado */}
      {collapsed && (
        <div className="hidden lg:flex items-center justify-center h-16 border-b border-neutral-200">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L20 8.5V10C20 15 17 18.5 12 20C7 18.5 4 15 4 10V8.5L12 4.5M12 7L6 10V10.5C6 13.5 8 16.5 12 17.5C16 16.5 18 13.5 18 10.5V10L12 7Z" />
            </svg>
          </div>
        </div>
      )}

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
              {!collapsed && (
                <div className="px-3 py-2">
                  <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    {section.name}
                  </h3>
                </div>
              )}
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

      {/* Información del usuario para desktop cuando está colapsado */}
      {collapsed && (
        <div className="hidden lg:block border-t border-neutral-200 p-2">
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-600">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Sidebar para desktop */}
      <div className={cn(
        'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 transition-all duration-300',
        collapsed ? 'lg:w-16' : 'lg:w-64'
      )}>
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