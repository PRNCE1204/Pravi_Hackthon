import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';

const fallbackDemoUsers = [
  { name: 'Riya Shah', role: 'citizen', email: 'citizen@test.com', title: 'Citizen', icon: '👤', desc: 'Public User & Civic Grievances' },
  { name: 'Arjun Mehta', role: 'contractor', email: 'contractor@test.com', title: 'Contractor', icon: '🏗️', desc: 'Works Execution & Milestones' },
  { name: 'Neha Verma', role: 'engineer', email: 'engineer@test.com', title: 'Engineer', icon: '📐', desc: 'Site Inspections & QC Audits' },
  { name: 'Vikram Singh', role: 'officer', email: 'officer@test.com', title: 'Department Officer', icon: '🏛️', desc: 'Project Clearances & Sanctions' },
  { name: 'Kavya Desai', role: 'finance', email: 'finance@test.com', title: 'Finance Officer', icon: '💰', desc: 'Budgeting & Treasury Disbursals' },
  { name: 'Aditya Rao', role: 'admin', email: 'admin@test.com', title: 'Super Admin', icon: '🛡️', desc: 'Central IAM & Security Control' },
];

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeDemoCard, setActiveDemoCard] = useState(null);
  const [demoAccounts, setDemoAccounts] = useState(fallbackDemoUsers);

  const { login, getDashboardPath, demoPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await authService.getDemoUsers();
        if (Array.isArray(res) && res.length) {
          const merged = res.map((item) => {
            const fallback = fallbackDemoUsers.find((f) => f.email === item.email);
            return {
              ...item,
              icon: fallback?.icon || '👤',
              desc: fallback?.desc || item.title || item.role,
            };
          });
          setDemoAccounts(merged);
        }
      } catch {
        // Fallback already ready
      }
    };
    fetchDemo();
  }, []);

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedInUser = await login({ email, password });
      navigate(getDashboardPath(loggedInUser.role));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickDemoLogin = async (account) => {
    setError('');
    setActiveDemoCard(account.role);
    setEmail(account.email);
    setPassword(demoPassword);

    try {
      const loggedInUser = await login({
        email: account.email,
        password: demoPassword,
      });
      navigate(getDashboardPath(loggedInUser.role));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'One-click login failed');
      setActiveDemoCard(null);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/50 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Top Banner / National Header */}
      <div className="w-full max-w-6xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-sky-500 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-md text-white">
            🏛️
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-sky-950 tracking-tight">
              National Infrastructure & Project Management System
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Ministry of Public Works & Urban Infrastructure • Government of India
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left Side: Standard Login Form (White & Light Sky Blue) */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-white">
          <div>
            <div className="mb-6">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-md border border-sky-200">
                Official Authorization
              </span>
              <h2 className="text-2xl font-extrabold text-sky-950 mt-3 tracking-tight">
                Sign In to Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your department credentials or registered citizen email
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2">
                <span className="text-sm">⚠️</span>
                <span className="font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                  placeholder="name@gov.in or citizen@test.com"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Security Password
                  </label>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Demo: Test@123
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all font-medium"
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !!activeDemoCard}
                className="w-full mt-2 py-3 px-4 text-xs font-bold uppercase tracking-wider text-white bg-sky-500 hover:bg-sky-600 rounded-xl shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer border-b-2 border-sky-700"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <span>Access Workspace →</span>
                )}
              </button>
            </form>
          </div>

          {/* Bottom Citizen Registration Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">New citizen to this platform?</span>
            <Link
              to="/register"
              className="font-bold text-sky-600 hover:text-sky-800 px-3 py-1.5 rounded-lg hover:bg-sky-50 transition-colors flex items-center gap-1"
            >
              <span>Citizen Registration</span>
              <span className="text-amber-500">→</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Light Blue / Sky Blue Demo Accounts Panel */}
        <div className="lg:col-span-7 bg-gradient-to-br from-sky-600 via-sky-700 to-sky-800 p-6 sm:p-10 flex flex-col justify-between text-white relative">
          {/* Subtle Ambient Sky Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-300/20 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Pre-Seeded Demo Accounts
            </h3>
            <p className="text-xs text-sky-100 mt-1 max-w-xl leading-relaxed font-normal">
              Select any stakeholder role below to immediately log in and explore their customized, RBAC-protected dashboard.
            </p>

            {/* 6 Clickable Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {demoAccounts.map((account) => {
                const isLoadingThis = activeDemoCard === account.role;
                return (
                  <div
                    key={account.role}
                    onClick={() => !loading && !activeDemoCard && handleOneClickDemoLogin(account)}
                    className={`p-3.5 rounded-xl border transition-all text-left relative overflow-hidden group cursor-pointer ${
                      isLoadingThis
                        ? 'bg-white/30 border-amber-300 ring-2 ring-amber-300 shadow-md'
                        : 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-amber-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl p-1.5 bg-sky-900/40 rounded-lg shrink-0 border border-sky-300/30">
                          {account.icon}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                            {account.name}
                          </h4>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 block mt-0.5">
                            {account.title || account.role}
                          </span>
                        </div>
                      </div>

                      {isLoadingThis ? (
                        <span className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></span>
                      ) : (
                        <span className="text-xs text-sky-200 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all font-bold">
                          →
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-sky-100">
                      <span className="truncate font-mono">{account.email}</span>
                      <span className="bg-amber-400 text-sky-950 font-bold px-1.5 py-0.5 rounded font-mono shadow-2xs shrink-0">
                        Test@123
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
