import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

function DashboardLayout() {
  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Projects', path: '/projects' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-1">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Workspace
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </aside>

        <section className="flex-1">
          <Outlet />
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default DashboardLayout;
