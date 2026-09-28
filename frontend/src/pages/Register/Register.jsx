import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const newUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate(getDashboardPath(newUser.role || 'citizen'));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Top Banner */}
      <div className="w-full max-w-lg mb-6 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900">
          ← Back to Official Login
        </Link>
        <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
          Citizen Public Portal
        </span>
      </div>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-sky-100 p-8 sm:p-10">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 mb-2">
            Public Registration
          </div>
          <h2 className="text-2xl font-extrabold text-sky-950 tracking-tight">
            Register as a Citizen
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Create your citizen account to track public works tenders, submit local grievances, and view civic progress.
          </p>
        </div>

        {/* Informative notice regarding role provisioning */}
        <div className="mb-6 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
          <span className="text-base text-amber-600">ℹ️</span>
          <span className="leading-relaxed">
            <strong>Note:</strong> Public registration assigns the <strong>Citizen</strong> role. Departmental, engineering, and contractor credentials are issued directly by the super administrator.
          </span>
        </div>

        {error && (
          <div className="mb-5 p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
            <span className="text-sm">⚠️</span>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Legal Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
              placeholder="e.g. Riya Shah"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
              placeholder="citizen@domain.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-sky-700"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Creating Citizen Account...</span>
              </>
            ) : (
              <span>Complete Citizen Registration →</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:text-sky-800">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
