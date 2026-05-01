import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, AppRole } from '@/stores/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
  fallbackRole?: string; // redirect path if role doesn't match
}

export const ProtectedRoute = ({ children, requiredRole, fallbackRole = '/account' }: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to={fallbackRole} replace />;
  }

  return <>{children}</>;
};
