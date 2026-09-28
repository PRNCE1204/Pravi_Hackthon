import { useAuth } from '../../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here is an overview of your platform.
          </p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
          Live System
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Active Projects</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
          <p className="text-xs text-emerald-600 mt-1">↑ 4 new this week</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">API Health</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">99.9%</p>
          <p className="text-xs text-slate-500 mt-1">Response time ~45ms</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Active Role</p>
          <p className="text-3xl font-bold text-indigo-600 capitalize mt-2">
            {user?.role || 'Guest'}
          </p>
          <p className="text-xs text-slate-500 mt-1">JWT Authenticated</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
