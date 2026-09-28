import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Route guard enforcing Role-Based Access Control
 * @param {string[]} allowedRoles - Array of authorized role strings
 */
function RoleRoute({ allowedRoles = [] }) {
  const { user, getDashboardPath } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user role is not within the authorized set, route them to their assigned role dashboard
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
