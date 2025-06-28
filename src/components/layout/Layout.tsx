'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Cerrar sidebar en mobile cuando cambia la ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Cargar preferencia de sidebar colapsado
  useEffect(() => {
    const collapsed = localStorage.getItem('catequesis_sidebar_collapsed');
    if (collapsed === 'true') {
      setSidebarCollapsed(true);
    }
  }, []);

  // Guardar preferencia de sidebar colapsado
  const handleSidebarToggle = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    localStorage.setItem('catequesis_sidebar_collapsed', newCollapsed.toString());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-neutral-600">Iniciando sistema...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapsed={handleSidebarToggle}
      />

      {/* Main content */}
      <div className={cn(
        'transition-all duration-300 ease-in-out',
        'lg:ml-64', // Sidebar width
        sidebarCollapsed && 'lg:ml-16' // Collapsed sidebar width
      )}>
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
          onSidebarToggle={handleSidebarToggle}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

// Layout específico para páginas de autenticación
export const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-neutral-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
      
      {/* Imagen lateral */}
      <div className="hidden lg:block relative flex-1">
        <div 
          className="absolute inset-0 h-full w-full object-cover bg-gradient-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(7, 23, 57, 0.8) 0%, rgba(75, 99, 130, 0.6) 50%, rgba(166, 136, 104, 0.4) 100%), url('/images/login-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Overlay con contenido */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
              <svg
                className="w-16 h-16 text-primary-900"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2M12 4.5L20 8.5V10C20 15 17 18.5 12 20C7 18.5 4 15 4 10V8.5L12 4.5M12 7L6 10V10.5C6 13.5 8 16.5 12 17.5C16 16.5 18 13.5 18 10.5V10L12 7Z" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-4">
              Sistema de Catequesis
            </h1>
            <p className="text-xl text-primary-100 max-w-md mx-auto">
              Gestión integral para la formación espiritual y crecimiento en la fe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;