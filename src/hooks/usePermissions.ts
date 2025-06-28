import { useAuth } from '@/context/AuthContext';
import { USER_PERMISSIONS, PermissionKey, UserRole } from '@/types/auth';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: PermissionKey): boolean => {
    if (!user) return false;
    
    const allowedRoles = USER_PERMISSIONS[permission];
    return allowedRoles.includes(user.tipo_perfil);
  };

  const hasAnyPermission = (permissions: PermissionKey[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: PermissionKey[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.tipo_perfil === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.tipo_perfil);
  };

  const canManage = (resource: string): boolean => {
    const managePermission = `MANAGE_${resource.toUpperCase()}` as PermissionKey;
    return hasPermission(managePermission);
  };

  const canView = (resource: string): boolean => {
    const viewPermission = `VIEW_${resource.toUpperCase()}` as PermissionKey;
    return hasPermission(viewPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    canManage,
    canView,
    user,
    isAdmin: hasRole('admin'),
    isParroco: hasRole('parroco'),
    isSecretaria: hasRole('secretaria'),
    isCatequista: hasRole('catequista'),
    isConsulta: hasRole('consulta'),
  };
};