import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import UserMenu from './UserMenu';

const ROLE_DEFINITIONS = [
  { role: 'citizen',    icon: '👤',  name: 'Riya Shah',    label: 'Citizen',         path: '/citizen'    },
  { role: 'contractor', icon: '🏗️',  name: 'Arjun Mehta',  label: 'Contractor',      path: '/contractor' },
  { role: 'engineer',   icon: '📐',  name: 'Neha Verma',   label: 'Engineer',        path: '/engineer'   },
  { role: 'officer',    icon: '🏛️',  name: 'Vikram Singh', label: 'Dept. Officer',   path: '/officer'    },
  { role: 'finance',    icon: '💰',  name: 'Kavya Desai',  label: 'Finance Officer', path: '/finance'    },
  { role: 'admin',      icon: '🛡️',  name: 'Aditya Rao',   label: 'Super Admin',     path: '/admin'      },
];

function RoleSwitcherDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(null);
  const { user, login, demoPassword } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSwitch = async (item) => {
    if (switching || user?.role === item.role) {
      setIsOpen(false);
      navigate(item.path);
      return;
    }
    setSwitching(item.role);
    try {
      const loggedIn = await login({ email: `${item.role}@test.com`, password: demoPassword });
      navigate(`/${loggedIn.role}`);
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setSwitching(null);
      setIsOpen(false);
    }
  };

  const current = ROLE_DEFINITIONS.find((r) => r.role === user?.role);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-sky-950 font-black text-xs rounded-lg border-b-2 border-amber-600 transition-all shadow-sm cursor-pointer"
        title="Switch demo role"
      >
        <span className="text-sm">{current?.icon || '⚡'}</span>
        <span className="hidden sm:inline">{current?.label || 'Switch Role'}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-[#0c2238] rounded-xl shadow-2xl border border-sky-700/40 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-2.5 bg-[#081829] border-b border-sky-900/60 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">⚡ Role Switcher</p>
              <p className="text-[10px] text-sky-300 mt-0.5">1-Click Demo Access</p>
            </div>
            <span className="text-[9px] bg-amber-400 text-sky-950 font-black px-1.5 py-0.5 rounded">
              HACKATHON
            </span>
          </div>

          {/* Role List */}
          <div className="p-2 space-y-0.5">
            {ROLE_DEFINITIONS.map((item) => {
              const isCurrent = user?.role === item.role;
              const isLoading = switching === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => handleSwitch(item)}
                  disabled={!!switching}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-sky-600/40 border border-amber-400/50 text-amber-300'
                      : 'text-slate-300 hover:bg-[#112d4a] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{item.icon}</span>
                    <div>
                      <p className="font-bold leading-tight">{item.label}</p>
                      <p className="text-[10px] text-sky-400 font-mono leading-none mt-0.5">{item.role}@test.com</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-transparent rounded-full animate-spin block" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-300/40 block" />
                    ) : (
                      <span className="text-sky-500 text-xs">→</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-2 bg-[#081829] border-t border-sky-900/60">
            <p className="text-[10px] text-sky-400 font-medium">Password: <span className="font-mono font-bold text-amber-300">Test@123</span></p>
          </div>
        </div>
      )}
    </div>
  );
}

function TopNavbar({ onMenuClick }) {
  return (
    <header className="h-16 bg-white border-b border-sky-100 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-sky-50 hover:text-sky-700 focus:outline-none"
          aria-label="Open navigation menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg bg-sky-500 text-white font-black text-sm shadow-sm border border-amber-300">
            🏛️
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-sky-950 tracking-tight leading-none">
              Government Infrastructure &amp; Project Portal
            </h1>
            <p className="text-[11px] text-slate-500 font-medium leading-none mt-1 flex items-center gap-1.5">
              <span>National e-Governance Platform</span>
              <span className="text-amber-500">•</span>
              <span className="text-sky-600 font-bold">RBAC Certified</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <svg
            className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tenders, projects..."
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 font-medium"
          />
        </div>

        {/* 1-Click Role Switcher */}
        <RoleSwitcherDropdown />

        {/* Notifications */}
        <button
          className="relative p-2 text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded-lg transition-colors"
          title="System Notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white" />
        </button>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}

export default TopNavbar;
