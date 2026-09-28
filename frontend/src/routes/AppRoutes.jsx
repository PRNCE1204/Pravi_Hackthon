import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/dashboard/DashboardLayout';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Citizen from '../pages/Citizen';
import Contractor from '../pages/Contractor';
import Engineer from '../pages/Engineer';
import Officer from '../pages/Officer';
import Finance from '../pages/Finance';
import Admin from '../pages/Admin';

/**
 * Root index redirector based on authentication status and user role
 */
function RootRedirect() {
  const { isAuthenticated, user, getDashboardPath, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-9 h-9 border-4 border-sky-500 border-t-amber-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root Redirection */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected RBAC Dashboards sharing unified DashboardLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Citizen Dashboard */}
          <Route element={<RoleRoute allowedRoles={['citizen']} />}>
            <Route path="/citizen" element={<Citizen />} />
          </Route>

          {/* Contractor Dashboard */}
          <Route element={<RoleRoute allowedRoles={['contractor']} />}>
            <Route path="/contractor" element={<Contractor />} />
          </Route>

          {/* Engineer Dashboard */}
          <Route element={<RoleRoute allowedRoles={['engineer']} />}>
            <Route path="/engineer" element={<Engineer />} />
          </Route>

          {/* Department Officer Dashboard */}
          <Route element={<RoleRoute allowedRoles={['officer']} />}>
            <Route path="/officer" element={<Officer />} />
          </Route>

          {/* Finance Officer Dashboard */}
          <Route element={<RoleRoute allowedRoles={['finance']} />}>
            <Route path="/finance" element={<Finance />} />
          </Route>

          {/* Super Admin Dashboard */}
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all Wildcard Route */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default AppRoutes;
