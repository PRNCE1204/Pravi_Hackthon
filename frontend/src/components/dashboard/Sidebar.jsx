import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Role-specific navigation items for the sidebar.
 * Each role's tabs match exactly the tabs defined in its dashboard page.
 * Links use ?tab= search param to drive the active tab.
 */
const ROLE_NAV = {
  admin: [
    { label: 'Dashboard',          tab: 'overview',       icon: '📊' },
    { label: 'Live Feed',          tab: 'feed',           icon: '📡' },
    { label: 'User Management',    tab: 'users',          icon: '👥' },
    { label: 'Departments',        tab: 'departments',    icon: '🏛️' },
    { label: 'Project Oversight',  tab: 'projects',       icon: '🏗️' },
    { label: 'Complaints',         tab: 'complaints',     icon: '📋' },
    { label: 'Finance Overview',   tab: 'finance',        icon: '💰' },
    { label: 'Reports & Analytics',tab: 'reports',        icon: '📈' },
    { label: 'Notifications',      tab: 'notifications',  icon: '🔔' },
  ],
  citizen: [
    { label: 'Overview',              tab: 'overview',       icon: '📊' },
    { label: 'Nearby Projects',       tab: 'nearby',         icon: '📍' },
    { label: 'Project Explorer',      tab: 'explorer',       icon: '🔍' },
    { label: 'My Complaints',         tab: 'complaints',     icon: '📋' },
    { label: 'Map View',              tab: 'map',            icon: '🗺️' },
    { label: 'Announcements',         tab: 'announcements',  icon: '📢' },
    { label: 'Feedback & Ratings',    tab: 'feedback',       icon: '⭐' },
    { label: 'Notifications',         tab: 'notifications',  icon: '🔔' },
    { label: 'Profile & Settings',    tab: 'settings',       icon: '⚙️' },
  ],
  contractor: [
    { label: 'Overview',              tab: 'overview',       icon: '📊' },
    { label: 'Apply for Tenders',     tab: 'tenders',        icon: '📝' },
    { label: 'My Projects',           tab: 'projects',       icon: '🏗️' },
    { label: 'Daily Work Updates',    tab: 'updates',        icon: '📈' },
    { label: 'Task Management',       tab: 'tasks',          icon: '✅' },
    { label: 'Material Management',   tab: 'materials',      icon: '🧱' },
    { label: 'Workforce Management',  tab: 'workforce',      icon: '👷' },
    { label: 'Equipment Management',  tab: 'equipment',      icon: '🚜' },
    { label: 'Documents & Contracts', tab: 'documents',      icon: '📄' },
    { label: 'Bills & Payments',      tab: 'bills',          icon: '💰' },
    { label: 'Notifications',         tab: 'notifications',  icon: '🔔' },
    { label: 'Profile & Settings',    tab: 'settings',       icon: '⚙️' },
  ],
  engineer: [
    { label: 'Overview',              tab: 'overview',       icon: '📊' },
    { label: 'Assigned Projects',     tab: 'projects',       icon: '📋' },
    { label: 'Site Inspections',      tab: 'inspections',    icon: '🔍' },
    { label: 'Quality Checklist',     tab: 'quality',        icon: '✅' },
    { label: 'Progress Updates',      tab: 'progress',       icon: '📈' },
    { label: 'Issue Reporting',       tab: 'issues',         icon: '⚠️' },
    { label: 'Documents & Photos',    tab: 'documents',      icon: '📸' },
    { label: 'Inspection History',    tab: 'history',        icon: '📅' },
    { label: 'Notifications',         tab: 'notifications',  icon: '🔔' },
    { label: 'Profile & Settings',    tab: 'settings',       icon: '⚙️' },
  ],
  officer: [
    { label: 'Overview',              tab: 'overview',       icon: '📊' },
    { label: 'Project Management',    tab: 'projects',       icon: '🏗️' },
    { label: 'Complaints & Requests', tab: 'complaints',     icon: '📋' },
    { label: 'Tender Management',     tab: 'tenders',        icon: '📑' },
    { label: 'Contractor Management', tab: 'contractors',    icon: '👷' },
    { label: 'Engineer Assignments',  tab: 'engineers',      icon: '📐' },
    { label: 'Inspections & Quality', tab: 'inspections',    icon: '🔍' },
    { label: 'Budget & Fund Requests',tab: 'funds',          icon: '💰' },
    { label: 'Documents',             tab: 'documents',      icon: '📁' },
    { label: 'Reports & Analytics',   tab: 'reports',        icon: '📈' },
    { label: 'Notifications',         tab: 'notifications',  icon: '🔔' },
    { label: 'Profile & Settings',    tab: 'settings',       icon: '⚙️' },
  ],
  finance: [
    { label: 'Overview',              tab: 'overview',       icon: '📊' },
    { label: 'Budget Management',     tab: 'budgets',        icon: '📒' },
    { label: 'Fund Release Requests', tab: 'requests',       icon: '📥' },
    { label: 'Payment History',       tab: 'history',        icon: '💳' },
    { label: 'Dept Expenditure',      tab: 'expenditure',    icon: '🏢' },
    { label: 'Invoices & Bills',      tab: 'invoices',       icon: '🧾' },
    { label: 'Financial Reports',     tab: 'reports',        icon: '📈' },
    { label: 'Notifications',         tab: 'notifications',  icon: '🔔' },
    { label: 'Profile & Settings',    tab: 'settings',       icon: '⚙️' },
  ],
};

const ROLE_META = {
  citizen:    { icon: '👤', title: 'Citizen Portal',          color: 'from-sky-600 to-sky-700' },
  contractor: { icon: '🏗️', title: 'Contractor Hub',          color: 'from-sky-600 to-sky-700' },
  engineer:   { icon: '📐', title: 'Site Engineering',        color: 'from-sky-600 to-sky-700' },
  officer:    { icon: '🏛️', title: 'Department Officer',      color: 'from-sky-600 to-sky-700' },
  finance:    { icon: '💰', title: 'Finance & Treasury',      color: 'from-sky-600 to-sky-700' },
  admin:      { icon: '🛡️', title: 'Super Administration',    color: 'from-sky-600 to-sky-700' },
};

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.role || 'citizen';
  const navItems = ROLE_NAV[role] || ROLE_NAV.citizen;
  const meta = ROLE_META[role] || ROLE_META.citizen;

  // Get the current active tab from search params
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'overview';

  const handleTabNav = (tab) => {
    navigate(`/${role}?tab=${tab}`);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-sky-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0c2238] text-slate-200 flex flex-col transition-transform duration-200 ease-in-out border-r border-sky-800/40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-sky-900/60 flex items-center justify-between bg-[#081829] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🇮🇳</span>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide uppercase flex items-center gap-1.5">
                <span>GovPM</span>
                <span className="text-sky-400 text-xs">●</span>
              </span>
              <p className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">
                RBAC Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Active Role Identity Card */}
        <div className="px-3 pt-3 pb-1 shrink-0">
          <div className="p-3.5 bg-[#112d4a] rounded-xl border border-sky-700/40 shadow-xs">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              Active Workspace
            </p>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="text-xl p-1.5 bg-[#081829] rounded-lg border border-sky-700/50">
                {meta.icon}
              </span>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-white truncate">{meta.title}</h4>
                <p className="text-[11px] text-sky-200 truncate">
                  <span className="capitalize text-amber-300 font-bold">{user?.name?.split(' ')[0]}</span>
                  {' '}· {role}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pt-2 space-y-0.5">
          <p className="px-3 pt-2 pb-1.5 text-[10px] font-extrabold uppercase tracking-wider text-sky-300/70">
            Navigation
          </p>

          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleTabNav(item.tab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-sm border-l-4 border-amber-300'
                    : 'text-slate-300 hover:bg-[#112d4a] hover:text-white'
                }`}
              >
                <span className="text-sm w-5 text-center">{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer: Auth info + logout */}
        <div className="p-3 border-t border-sky-900/60 bg-[#081829] space-y-2 shrink-0">
          <div className="px-3 py-1 text-[10px] text-sky-200 flex items-center justify-between">
            <span className="font-medium">Auth Protocol</span>
            <span className="text-amber-400 font-mono font-bold">JWT: 7 Days</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 border border-rose-900/40 transition-colors cursor-pointer"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
