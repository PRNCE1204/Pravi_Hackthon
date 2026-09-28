import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0c2238] text-white">
        <div className="w-11 h-11 border-4 border-sky-400 border-t-amber-400 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-wider text-sky-200">
          Verifying Official RBAC Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
