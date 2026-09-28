import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleBadgeStyle = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold';
      case 'officer':
        return 'bg-sky-100 text-sky-900 border-sky-300 font-extrabold';
      case 'engineer':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'finance':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
      case 'contractor':
        return 'bg-sky-50 text-sky-800 border-sky-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 font-bold';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-sky-50 transition-colors focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-sky-500 text-white border-2 border-amber-300 flex items-center justify-center font-black text-xs uppercase shadow-xs">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-bold text-sky-950 leading-tight">
            {user?.name || 'Authorized Official'}
          </p>
          <span
            className={`inline-block text-[10px] uppercase px-1.5 py-0.5 rounded border mt-0.5 leading-none ${getRoleBadgeStyle(
              user?.role
            )}`}
          >
            {user?.role || 'Citizen'}
          </span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sky-100 py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-4 py-2.5 border-b border-slate-100 bg-sky-50/50">
            <p className="text-[11px] font-semibold text-slate-400">Signed in as</p>
            <p className="text-xs font-bold text-sky-950 truncate mt-0.5">{user?.email}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/login');
              }}
              className="w-full text-left px-4 py-2 text-xs font-bold text-sky-700 hover:bg-sky-50 flex items-center gap-2 transition-colors"
            >
              <span className="text-amber-500">⚡</span> Switch Demo Role
            </button>
          </div>

          <div className="border-t border-slate-100 pt-1">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
