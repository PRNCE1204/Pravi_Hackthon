import { useAuth } from '../../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">User Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Full Name
          </label>
          <p className="text-lg font-medium text-slate-900 mt-1">{user?.name || 'Not logged in'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Email Address
          </label>
          <p className="text-lg font-medium text-slate-900 mt-1">{user?.email || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Role
          </label>
          <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700 mt-1 capitalize">
            {user?.role || 'Guest'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default Profile;
