import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon paths in React
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: iconUrl, shadowUrl: shadowUrl });
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';
import ActivityFeed from '../../components/dashboard/ActivityFeed';

import img1 from '../../assets/images/1.webp';
import img2 from '../../assets/images/2.webp';
import img3 from '../../assets/images/3.webp';
import img4 from '../../assets/images/4.webp';
import img5 from '../../assets/images/5.webp';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════════════════════ */

const ALL_USERS = [
  { id: 1,  name: 'Riya Shah',       email: 'citizen@test.com',    role: 'citizen',    dept: '—',              status: 'Active',    lastLogin: '2026-09-28 10:42', phone: '+91 98200 11234', joined: '2025-01-15' },
  { id: 2,  name: 'Arjun Mehta',     email: 'contractor@test.com', role: 'contractor', dept: 'Infrastructure', status: 'Active',    lastLogin: '2026-09-28 09:15', phone: '+91 98300 22345', joined: '2025-02-20' },
  { id: 3,  name: 'Neha Verma',      email: 'engineer@test.com',   role: 'engineer',   dept: 'Civil QC',       status: 'Active',    lastLogin: '2026-09-28 11:01', phone: '+91 97400 33456', joined: '2025-03-10' },
  { id: 4,  name: 'Vikram Singh',    email: 'officer@test.com',    role: 'officer',    dept: 'Urban Dev',      status: 'Active',    lastLogin: '2026-09-28 11:30', phone: '+91 96500 44567', joined: '2025-01-05' },
  { id: 5,  name: 'Kavya Desai',     email: 'finance@test.com',    role: 'finance',    dept: 'Treasury',       status: 'Active',    lastLogin: '2026-09-28 11:45', phone: '+91 95600 55678', joined: '2025-04-01' },
  { id: 6,  name: 'Aditya Rao',      email: 'admin@test.com',      role: 'admin',      dept: 'IT Governance',  status: 'Superuser', lastLogin: '2026-09-28 12:00', phone: '+91 94700 66789', joined: '2024-12-01' },
  { id: 7,  name: 'Priya Nair',      email: 'priya@gov.in',        role: 'citizen',    dept: '—',              status: 'Active',    lastLogin: '2026-09-26 14:20', phone: '+91 93800 77890', joined: '2025-06-12' },
  { id: 8,  name: 'Rahul Joshi',     email: 'rahul@gov.in',        role: 'officer',    dept: 'PWD',            status: 'Suspended', lastLogin: '2026-09-20 09:00', phone: '+91 92900 88901', joined: '2025-05-08' },
  { id: 9,  name: 'Sunita Patil',    email: 'sunita@gov.in',       role: 'engineer',   dept: 'Transport',      status: 'Active',    lastLogin: '2026-09-27 16:45', phone: '+91 91000 99012', joined: '2025-07-20' },
  { id: 10, name: 'Mohan Reddy',     email: 'mohan@gov.in',        role: 'contractor', dept: 'Roads',          status: 'Active',    lastLogin: '2026-09-28 08:30', phone: '+91 90100 10123', joined: '2025-03-25' },
];

const DEPARTMENTS = [
  { id: 1, name: 'Urban Development',     head: 'Vikram Singh',  employees: 38, projects: 22, budget: 142, status: 'Active',   created: '2020-04-01' },
  { id: 2, name: 'Public Works (PWD)',     head: 'Rahul Joshi',   employees: 52, projects: 18, budget: 220, status: 'Active',   created: '2019-01-15' },
  { id: 3, name: 'Transport & Roads',     head: 'Anjali Rao',    employees: 45, projects: 16, budget: 180, status: 'Active',   created: '2019-06-01' },
  { id: 4, name: 'Water & Sanitation',    head: 'Sanjay Kumar',  employees: 30, projects: 6,  budget: 75,  status: 'Active',   created: '2020-02-10' },
  { id: 5, name: 'Health Infrastructure', head: 'Dr. Meena Iyer',employees: 28, projects: 12, budget: 95,  status: 'Active',   created: '2021-03-01' },
  { id: 6, name: 'Power & Energy',        head: 'Ravi Shankar',  employees: 22, projects: 10, budget: 110, status: 'Active',   created: '2020-08-15' },
  { id: 7, name: 'Parks & Recreation',    head: 'Nita Kulkarni', employees: 15, projects: 5,  budget: 40,  status: 'Active',   created: '2022-01-01' },
  { id: 8, name: 'Smart City',            head: 'Aditya Rao',    employees: 18, projects: 8,  budget: 150, status: 'Active',   created: '2023-04-01' },
];

const PROJECTS = [
  { id: 'PRJ-2201', name: 'NH-48 6-Lane Highway Expansion',        dept: 'Transport & Roads',   status: 'In Progress', progress: 68, budget: '₹42.5 Cr', officer: 'Vikram Singh', delay: 0,  startDate: '2025-01-15', endDate: '2027-03-31' },
  { id: 'PRJ-2189', name: 'Municipal Sewage Treatment Plant',       dept: 'Water & Sanitation',  status: 'Delayed',     progress: 42, budget: '₹18.2 Cr', officer: 'Anjali Rao',  delay: 45, startDate: '2025-03-01', endDate: '2026-12-31' },
  { id: 'PRJ-2155', name: 'Smart City Water Pipeline Phase 2',      dept: 'Water & Sanitation',  status: 'Completed',   progress: 100,budget: '₹31.0 Cr', officer: 'Sanjay Kumar',delay: 0,  startDate: '2024-08-01', endDate: '2026-10-30' },
  { id: 'PRJ-2143', name: 'Airport Metro Link Elevated Track',      dept: 'Transport & Roads',   status: 'In Progress', progress: 29, budget: '₹88.0 Cr', officer: 'Vikram Singh', delay: 0,  startDate: '2025-06-01', endDate: '2028-06-30' },
  { id: 'PRJ-2121', name: 'Smart LED Street Lighting — City Wide',  dept: 'Power & Energy',      status: 'In Progress', progress: 88, budget: '₹12.8 Cr', officer: 'Ravi Shankar', delay: 0,  startDate: '2026-01-01', endDate: '2026-10-15' },
  { id: 'PRJ-2098', name: 'Primary Health Centre Upgrades ×12',     dept: 'Health Infrastructure',status: 'Planned',    progress: 0,  budget: '₹22.0 Cr', officer: 'Dr. Meena Iyer',delay: 0, startDate: '2026-11-01', endDate: '2027-12-31' },
  { id: 'PRJ-2074', name: 'Urban Park Beautification Phase 1',      dept: 'Parks & Recreation',  status: 'Completed',   progress: 100,budget: '₹8.5 Cr',  officer: 'Nita Kulkarni',delay: 0,  startDate: '2025-09-01', endDate: '2026-06-30' },
  { id: 'PRJ-2055', name: 'Smart City CCTV Surveillance Grid',      dept: 'Smart City',          status: 'In Progress', progress: 55, budget: '₹35.0 Cr', officer: 'Aditya Rao',  delay: 12, startDate: '2026-02-01', endDate: '2026-12-31' },
];

const COMPLAINTS = [
  { id: 'GRV-8901', title: 'Pothole on MG Road Sector 4',         citizen: 'Riya Shah',   dept: 'Transport & Roads',   status: 'In Review',  priority: 'High',     date: '2026-09-24', assignedTo: 'Vikram Singh' },
  { id: 'GRV-8842', title: 'Streetlight Outage — Civil Hospital', citizen: 'Priya Nair',  dept: 'Power & Energy',      status: 'Resolved',   priority: 'Medium',   date: '2026-09-18', assignedTo: 'Ravi Shankar' },
  { id: 'GRV-8799', title: 'Drainage Blockage — Ward 12 Market',  citizen: 'Mohan Reddy', dept: 'Water & Sanitation',  status: 'Work Assigned',priority: 'High',   date: '2026-09-12', assignedTo: 'Sanjay Kumar' },
  { id: 'GRV-8755', title: 'Footpath Encroachment — Lake View',   citizen: 'Riya Shah',   dept: 'Urban Development',   status: 'Pending',    priority: 'Low',      date: '2026-09-05', assignedTo: '—' },
  { id: 'GRV-8710', title: 'Garbage Pile — Sector 8 Park Gate',   citizen: 'Priya Nair',  dept: 'Parks & Recreation',  status: 'Escalated',  priority: 'Critical', date: '2026-08-30', assignedTo: 'Nita Kulkarni' },
  { id: 'GRV-8681', title: 'Water Supply Irregular — Ward 5',     citizen: 'Sunita Patil',dept: 'Water & Sanitation',  status: 'Resolved',   priority: 'High',     date: '2026-08-22', assignedTo: 'Sanjay Kumar' },
  { id: 'GRV-8652', title: 'Broken Road Divider — Ring Road',     citizen: 'Mohan Reddy', dept: 'Transport & Roads',   status: 'In Review',  priority: 'Medium',   date: '2026-08-18', assignedTo: 'Anjali Rao' },
];

const LIVE_FEED = [
  { id: 'F001', type: 'success', icon: '✅', actor: 'Vikram Singh',  action: 'Approved tender APP-902 — Eastern Link Highway Environmental Clearance',              time: '2 min ago',  role: 'officer'    },
  { id: 'F002', type: 'info',    icon: '📝', actor: 'Riya Shah',     action: 'Filed new grievance GRV-8910: Broken footpath — Andheri East Sector 3',              time: '5 min ago',  role: 'citizen'    },
  { id: 'F003', type: 'success', icon: '🏗️', actor: 'Arjun Mehta',  action: 'Submitted milestone report for PRJ-2201 (NH-48) — Foundation Phase 100%',           time: '11 min ago', role: 'contractor' },
  { id: 'F004', type: 'warning', icon: '⚠️', actor: 'Neha Verma',   action: 'QC inspection FAILED for Sewage Plant Unit B (Score: 58/100) — NCR raised',          time: '18 min ago', role: 'engineer'   },
  { id: 'F005', type: 'info',    icon: '💰', actor: 'Kavya Desai',   action: 'Processed payment voucher DIS-6601 — Bharat Infratech ₹4.25 Cr disbursed',           time: '25 min ago', role: 'finance'    },
  { id: 'F006', type: 'success', icon: '✅', actor: 'Vikram Singh',  action: 'Work order signed: Smart Grid Substation — APP-867 dispatched to PWD',               time: '41 min ago', role: 'officer'    },
  { id: 'F007', type: 'info',    icon: '👤', actor: 'System',        action: 'New user registered: sunita.gov@in — Role: Engineer — Dept: Transport',              time: '1 hr ago',   role: 'admin'      },
  { id: 'F008', type: 'error',   icon: '🚨', actor: 'System',        action: 'Unauthorized access attempt blocked — Route /admin/users — IP: 103.44.22.11',        time: '1 hr ago',   role: 'admin'      },
  { id: 'F009', type: 'info',    icon: '📋', actor: 'Anjali Rao',    action: 'Department: Transport & Roads — 2 new employees added to team directory',            time: '2 hrs ago',  role: 'officer'    },
  { id: 'F010', type: 'success', icon: '🏆', actor: 'Neha Verma',   action: 'PRJ-2155 Smart Water Pipeline Phase 2 marked COMPLETED — Final report uploaded',     time: '3 hrs ago',  role: 'engineer'   },
  { id: 'F011', type: 'warning', icon: '⏰', actor: 'System',        action: 'PRJ-2189 Sewage Plant 45 days overdue — Auto-escalated to Finance for audit review', time: '4 hrs ago',  role: 'admin'      },
  { id: 'F012', type: 'info',    icon: '📊', actor: 'Kavya Desai',   action: 'Q2 FY26-27 budget utilization report submitted — 68.2% of ₹637 Cr consumed',        time: '5 hrs ago',  role: 'finance'    },
  { id: 'F013', type: 'success', icon: '✅', actor: 'Priya Nair',    action: 'Complaint GRV-8842 (Streetlight Outage) resolved and closed by citizen',            time: '6 hrs ago',  role: 'citizen'    },
  { id: 'F014', type: 'info',    icon: '🏗️', actor: 'Arjun Mehta',  action: 'New project bid submitted: Metro Link Phase 2 — ₹88 Cr — Under evaluation',         time: '7 hrs ago',  role: 'contractor' },
  { id: 'F015', type: 'success', icon: '💰', actor: 'Kavya Desai',   action: 'MMRDA Metro Link mobilisation advance ₹12 Cr — DIS-6561 cleared by Treasury',       time: '8 hrs ago',  role: 'finance'    },
];

const NOTIFICATIONS_LIST = [
  { id: 1, title: 'System Maintenance Scheduled',       message: 'Platform maintenance on Oct 5, 2026 from 2:00 AM – 4:00 AM IST. Services may be intermittent.', type: 'system',  sent: false, audience: 'All Users',   date: '2026-09-28' },
  { id: 2, title: 'Tender Result: NH-48 Highway',       message: 'The tender for NH-48 Highway Expansion Sec 4-7 has been awarded to Bharat Infratech Pvt Ltd.',   type: 'info',    sent: true,  audience: 'Officers',     date: '2026-09-26' },
  { id: 3, title: 'Q2 Budget Utilization Report Ready', message: 'Q2 FY 2026-27 financial utilization reports are ready for departmental download and review.',     type: 'finance', sent: true,  audience: 'Finance',      date: '2026-09-25' },
  { id: 4, title: 'New QC Guidelines Effective Oct 1',  message: 'Updated site inspection QC guidelines are effective from Oct 1, 2026. All engineers must review.', type: 'system',  sent: false, audience: 'Engineers',    date: '2026-09-24' },
  { id: 5, title: 'Complaint Escalation Alert',         message: '3 complaints have exceeded the 30-day resolution SLA. Departments must respond by Sep 30.',       type: 'warning', sent: true,  audience: 'Officers',     date: '2026-09-23' },
];

const MONTHLY_PROJECTS = [28, 34, 41, 38, 52, 60, 58, 71, 67, 79, 82, 84];
const MONTHLY_COMPLAINTS = [42, 55, 38, 47, 62, 58, 44, 70, 65, 59, 52, 48];
const MONTHLY_BUDGET = [35, 42, 48, 52, 58, 63, 61, 68, 66, 70, 71, 72];
const MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];

/* ════════════════════════════════════════════════════════════════
   REUSABLE MICRO COMPONENTS
════════════════════════════════════════════════════════════════ */

/* Status badge */
function StatusBadge({ status }) {
  const styles = {
    Active:        'bg-emerald-100 text-emerald-800 border-emerald-300',
    Superuser:     'bg-amber-100 text-amber-900 border-amber-400',
    Suspended:     'bg-rose-100 text-rose-800 border-rose-300',
    'In Progress': 'bg-sky-100 text-sky-800 border-sky-300',
    Completed:     'bg-emerald-100 text-emerald-800 border-emerald-300',
    Delayed:       'bg-rose-100 text-rose-800 border-rose-300',
    Planned:       'bg-slate-100 text-slate-700 border-slate-300',
    Resolved:      'bg-emerald-100 text-emerald-800 border-emerald-300',
    'In Review':   'bg-amber-100 text-amber-900 border-amber-300',
    Pending:       'bg-slate-100 text-slate-700 border-slate-300',
    Escalated:     'bg-rose-100 text-rose-800 border-rose-300',
    'Work Assigned':'bg-sky-100 text-sky-800 border-sky-300',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold border ${styles[status] || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
      {status}
    </span>
  );
}

/* Priority badge */
function PriorityBadge({ priority }) {
  const styles = {
    Critical: 'bg-rose-600 text-white',
    High:     'bg-amber-500 text-white',
    Medium:   'bg-sky-500 text-white',
    Low:      'bg-slate-400 text-white',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${styles[priority] || 'bg-slate-400 text-white'}`}>
      {priority}
    </span>
  );
}

/* Role badge */
function RoleBadge({ role }) {
  const styles = {
    admin:      'bg-amber-100 text-amber-900 border-amber-400',
    officer:    'bg-sky-100 text-sky-900 border-sky-300',
    engineer:   'bg-violet-100 text-violet-900 border-violet-300',
    finance:    'bg-emerald-100 text-emerald-900 border-emerald-300',
    contractor: 'bg-orange-100 text-orange-900 border-orange-300',
    citizen:    'bg-slate-100 text-slate-700 border-slate-300',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase border ${styles[role] || 'bg-slate-100 text-slate-700 border-slate-300'}`}>
      {role}
    </span>
  );
}

/* SVG Bar Chart */
function BarChart({ data, labels, color = '#0ea5e9', height = 80, title }) {
  const max = Math.max(...data);
  return (
    <div>
      {title && <p className="text-xs font-bold text-slate-600 mb-2">{title}</p>}
      <div className="flex items-end gap-1" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            <div
              className="w-full rounded-t-sm transition-all duration-500"
              style={{ height: `${(v / max) * height}px`, backgroundColor: color, opacity: 0.85 }}
              title={`${labels[i]}: ${v}`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-1">
        {labels.map((l, i) => (
          <div key={i} className="flex-1 text-center text-[8px] text-slate-400 font-medium">{l}</div>
        ))}
      </div>
    </div>
  );
}

/* Mini KPI Card */
function KpiCard({ icon, label, value, sub, trend, trendUp }) {
  return (
    <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 hover:shadow-md hover:border-sky-300 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="text-2xl font-extrabold text-sky-950 mt-1 tracking-tight">{value}</p>
        </div>
        <span className="text-2xl p-2.5 bg-sky-50 rounded-xl border border-sky-100">{icon}</span>
      </div>
      {(trend || sub) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <span className={`font-bold flex items-center gap-1 ${trendUp ? 'text-emerald-700' : 'text-slate-600'}`}>
              {trendUp ? '↑' : ''} {trend}
            </span>
          )}
          {sub && <span className="text-slate-500 font-medium">{sub}</span>}
        </div>
      )}
    </div>
  );
}

/* User Profile Drawer */
function UserDrawer({ user, onClose }) {
  if (!user) return null;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-sky-950/50 backdrop-blur-xs" onClick={onClose} />
      <div className="w-full max-w-sm bg-white shadow-2xl flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-800 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">User Profile</h3>
            <button onClick={onClose} className="text-sky-200 hover:text-white text-xl leading-none cursor-pointer">✕</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-sky-950 flex items-center justify-center text-2xl font-extrabold border-2 border-amber-300 shadow-md">
              {initials}
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-white">{user.name}</h4>
              <p className="text-sm text-sky-200 mt-0.5">{user.email}</p>
              <RoleBadge role={user.role} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-5 space-y-4 flex-1">
          {[
            { label: 'Phone',       value: user.phone },
            { label: 'Department',  value: user.dept },
            { label: 'Role',        value: user.role },
            { label: 'Status',      value: user.status },
            { label: 'Joined',      value: user.joined },
            { label: 'Last Login',  value: user.lastLogin },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{row.label}</span>
              <span className="text-xs font-semibold text-slate-800">{row.value}</span>
            </div>
          ))}

          <div className="pt-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Activity History</p>
            <div className="space-y-2">
              {[
                { msg: 'Logged in from Chrome / Windows', time: 'Today 10:42' },
                { msg: 'Profile updated — phone number', time: 'Sep 25, 2026' },
                { msg: 'Password reset via email OTP',   time: 'Sep 18, 2026' },
                { msg: 'Account created by Admin',       time: user.joined },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-slate-700 font-medium">{a.msg}</p>
                    <p className="text-slate-400">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-slate-100 space-y-2">
          <button className="w-full py-2 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition cursor-pointer">
            ✏️ Edit Profile
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button className="py-2 bg-amber-50 text-amber-800 text-xs font-bold rounded-lg hover:bg-amber-100 transition cursor-pointer border border-amber-200">
              🔑 Reset Password
            </button>
            <button className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer border ${
              user.status === 'Suspended'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}>
              {user.status === 'Suspended' ? '✅ Reinstate' : '🚫 Suspend'}
            </button>
          </div>
          <button className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition cursor-pointer">
            🗑️ Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   SECTION COMPONENTS
════════════════════════════════════════════════════════════════ */

/* ── 1. DASHBOARD OVERVIEW ─────────────────────────────────── */
function TabOverview() {
  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard icon="👥" label="Total Users"        value="12,548" trend="+124 this month"  sub="All roles"         trendUp />
        <KpiCard icon="🏗️" label="Active Projects"   value="84"     trend="8 delayed"        sub="₹680 Cr portfolio" />
        <KpiCard icon="🏛️" label="Departments"        value="24"     trend="2 new Q4"         sub="All operational"   trendUp />
        <KpiCard icon="📋" label="Pending Complaints" value="156"    trend="38 escalated"     sub="SLA: 30 days" />
        <KpiCard icon="💰" label="Budget Utilization" value="72%"    trend="+4% vs last qtr"  sub="₹637 Cr total"     trendUp />
        <KpiCard icon="⚡" label="System Health"      value="99.9%"  trend="1 degraded svc"   sub="5 services live" />
      </div>

      {/* Primary Charts — 2 large */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h4 className="text-sm font-extrabold text-sky-950">Monthly Project Growth</h4>
              <p className="text-xs text-slate-500 mt-0.5">Active government projects — FY 2025–26 to FY 2026–27</p>
            </div>
            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">+200% YoY</span>
          </div>
          <BarChart data={MONTHLY_PROJECTS} labels={MONTHS} color="#0ea5e9" height={120} />
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[{ label: 'Peak Month', value: 'Sep — 84' },{ label: 'Average', value: '61 / month' },{ label: 'Delayed', value: '8 projects' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-extrabold text-sky-950">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h4 className="text-sm font-extrabold text-sky-950">Budget Utilization Trend</h4>
              <p className="text-xs text-slate-500 mt-0.5">Monthly spend rate against ₹637 Cr allocation — FY 2026–27</p>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">72% Used</span>
          </div>
          <BarChart data={MONTHLY_BUDGET} labels={MONTHS} color="#10b981" height={120} />
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[{ label: 'Total Allocated', value: '₹637 Cr' },{ label: 'Spent to Date', value: '₹459 Cr' },{ label: 'Remaining', value: '₹178 Cr' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-extrabold text-sky-950">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts — 2 side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h4 className="text-sm font-extrabold text-sky-950">Complaint Resolution Trend</h4>
              <p className="text-xs text-slate-500 mt-0.5">Monthly complaints filed across all departments</p>
            </div>
            <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">Avg 53/mo</span>
          </div>
          <BarChart data={MONTHLY_COMPLAINTS} labels={MONTHS} color="#f59e0b" height={100} />
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[{ label: 'Total Filed', value: '636' },{ label: 'Resolved', value: '320' },{ label: 'Escalated', value: '38' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-extrabold text-sky-950">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h4 className="text-sm font-extrabold text-sky-950">User Registration Growth</h4>
              <p className="text-xs text-slate-500 mt-0.5">New platform registrations per month across all 6 roles</p>
            </div>
            <span className="text-xs font-extrabold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-lg">+330% YoY</span>
          </div>
          <BarChart data={[320,480,610,540,720,890,810,950,1020,1180,1240,1380]} labels={MONTHS} color="#8b5cf6" height={100} />
          <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {[{ label: 'Total Users', value: '12,548' },{ label: 'This Month', value: '+1,380' },{ label: 'Active Now', value: '1,842' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-sm font-extrabold text-sky-950">{s.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Budget + Live Feed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Department Budget Bars */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-sky-100 shadow-xs p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-sm font-extrabold text-sky-950">Department Budget Utilization</h3>
              <p className="text-xs text-slate-500 mt-0.5">Allocated vs. consumed budget per department — FY 2026–27</p>
            </div>
            <span className="text-xs font-extrabold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">₹822 Cr Total</span>
          </div>
          <div className="space-y-4">
            {DEPARTMENTS.map((d) => {
              const spent = Math.min(d.budget, Math.round(d.budget * 0.55 + d.id * 7));
              const pct = Math.round(spent / d.budget * 100);
              return (
                <div key={d.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{d.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sky-700">₹{spent}Cr</span>
                      <span className="text-slate-400">/</span>
                      <span className="font-bold text-slate-500">₹{d.budget}Cr</span>
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${pct > 85 ? 'bg-rose-100 text-rose-800' : 'bg-sky-50 text-sky-700'}`}>{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-700 ${pct > 85 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-400' : 'bg-sky-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Feed Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-xs p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-extrabold text-sky-950">Live Activity Feed</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest platform events across all roles</p>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />LIVE
            </span>
          </div>
          <div className="divide-y divide-slate-50 flex-1">
            {LIVE_FEED.slice(0, 6).map(item => {
              const dot = { success: 'bg-emerald-500', info: 'bg-sky-500', warning: 'bg-amber-400', error: 'bg-rose-500' };
              return (
                <div key={item.id} className="py-3 flex items-start gap-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${dot[item.type] || 'bg-sky-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-700 leading-snug line-clamp-2">{item.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.actor} · {item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 border-t border-slate-100 mt-2">
            <p className="text-[11px] text-sky-600 font-bold text-center cursor-pointer hover:text-sky-800 transition">View full live feed →</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 2. LIVE FEED ──────────────────────────────────────────── */

function TabFeed() {
  const [filter, setFilter] = useState('all');
  const typeColors = {
    success: { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800', bar: 'border-l-emerald-500' },
    info:    { dot: 'bg-sky-500',     badge: 'bg-sky-100 text-sky-800',         bar: 'border-l-sky-500'     },
    warning: { dot: 'bg-amber-400',   badge: 'bg-amber-100 text-amber-900',     bar: 'border-l-amber-400'   },
    error:   { dot: 'bg-rose-500',    badge: 'bg-rose-100 text-rose-800',       bar: 'border-l-rose-500'    },
  };
  const roleColors = {
    citizen:    'bg-slate-100 text-slate-700',
    contractor: 'bg-orange-100 text-orange-800',
    engineer:   'bg-violet-100 text-violet-800',
    officer:    'bg-sky-100 text-sky-800',
    finance:    'bg-emerald-100 text-emerald-800',
    admin:      'bg-amber-100 text-amber-900',
  };
  const filtered = filter === 'all' ? LIVE_FEED : LIVE_FEED.filter(f => f.type === filter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">📡 Platform Live Feed</h3>
          <p className="text-xs text-slate-500">Real-time activity stream across all users, roles &amp; departments</p>
        </div>
        <div className="flex gap-1.5">
          {['all','success','info','warning','error'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${filter === f ? 'bg-sky-600 text-white' : 'bg-white border border-sky-100 text-slate-600 hover:bg-sky-50'}`}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-50">
          {filtered.map((item) => {
            const tc = typeColors[item.type] || typeColors.info;
            const rc = roleColors[item.role] || roleColors.citizen;
            return (
              <div key={item.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-sky-50/30 transition-colors border-l-4 ${tc.bar}`}>
                <div className="shrink-0 pt-0.5 text-xl">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">{item.action}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${rc}`}>{item.role}</span>
                    <span className="text-[10px] font-bold text-slate-600">by {item.actor}</span>
                    <span className="text-[10px] text-slate-400">•</span>
                    <span className="text-[10px] text-slate-400">{item.time}</span>
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${tc.badge}`}>
                  {item.type.toUpperCase()}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400">No events in this category</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── 3. USER MANAGEMENT ────────────────────────────────────── */
function TabUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-5">
      {selectedUser && <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">User Management</h3>
          <p className="text-xs text-slate-500">Manage all platform users — create, edit, suspend, reset passwords</p>
        </div>
        <button className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition cursor-pointer shadow">
          + Add New User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-xs bg-white border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 shadow-xs font-medium"
          />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="px-3 py-2 text-xs bg-white border border-sky-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 font-bold shadow-xs cursor-pointer">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="officer">Officer</option>
          <option value="engineer">Engineer</option>
          <option value="finance">Finance</option>
          <option value="contractor">Contractor</option>
          <option value="citizen">Citizen</option>
        </select>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
          <p className="text-xs font-extrabold text-sky-950">All Users ({filtered.length})</p>
          <p className="text-[11px] text-slate-500">Click any row to view profile</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-sky-100">
              <tr className="text-[10px] font-extrabold text-sky-950 uppercase tracking-wider">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last Login</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(user => (
                <tr key={user.id} onClick={() => setSelectedUser(user)}
                  className="hover:bg-sky-50/50 cursor-pointer transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-sky-500 text-white text-[10px] font-black flex items-center justify-center border border-amber-300 shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{user.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="px-5 py-3.5 text-slate-600 font-medium">{user.dept}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={user.status} /></td>
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-[10px]">{user.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                      <button className="text-[10px] px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded font-bold hover:bg-sky-100 cursor-pointer transition">Edit</button>
                      <button className="text-[10px] px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold hover:bg-amber-100 cursor-pointer transition">Reset</button>
                      <button className="text-[10px] px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded font-bold hover:bg-rose-100 cursor-pointer transition">
                        {user.status === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 4. DEPARTMENT MANAGEMENT ──────────────────────────────── */
function TabDepartments() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">Department Management</h3>
          <p className="text-xs text-slate-500">Create, manage, and configure all government departments</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition cursor-pointer shadow">
            + Create Department
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { icon: '🏛️', label: 'Total Departments', value: DEPARTMENTS.length },
          { icon: '👷', label: 'Total Employees',    value: DEPARTMENTS.reduce((s,d) => s + d.employees, 0) },
          { icon: '🏗️', label: 'Total Projects',     value: DEPARTMENTS.reduce((s,d) => s + d.projects, 0) },
          { icon: '💰', label: 'Total Budget',       value: `₹${DEPARTMENTS.reduce((s,d) => s + d.budget, 0)}Cr` },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-sky-100 shadow-xs p-4 text-center hover:shadow-md transition">
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-2xl font-extrabold text-sky-950">{c.value}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DEPARTMENTS.map(dept => (
          <div key={dept.id} className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 hover:shadow-md hover:border-sky-300 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-sm font-extrabold text-sky-950">{dept.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Head: <span className="font-bold text-slate-700">{dept.head}</span></p>
              </div>
              <StatusBadge status={dept.status} />
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4 py-3 bg-sky-50/50 rounded-lg">
              <div>
                <div className="text-base font-extrabold text-sky-700">{dept.employees}</div>
                <div className="text-[10px] text-slate-500">Employees</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-amber-700">{dept.projects}</div>
                <div className="text-[10px] text-slate-500">Projects</div>
              </div>
              <div>
                <div className="text-base font-extrabold text-emerald-700">₹{dept.budget}Cr</div>
                <div className="text-[10px] text-slate-500">Budget</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 cursor-pointer transition">👤 Assign Head</button>
              <button className="flex-1 py-1.5 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 cursor-pointer transition">✏️ Rename</button>
              <button className="flex-1 py-1.5 text-[10px] font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer transition">👥 View Team</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
/* ── 4.1 PROJECT DETAILS MODAL ──────────────────────────────── */
function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  // Rich data specifically for NH-48 (PRJ-2201), fallback for others
  const isNH48 = project.id === 'PRJ-2201';

  const timeline = isNH48 ? [
    { date: 'Sep 25, 2026', title: 'Asphalt Laying & Surface Work', desc: 'Phase 3 paving started on 12km stretch.', status: 'current', img: img4, author: 'Neha Verma (QC)' },
    { date: 'Jun 10, 2026', title: 'Sub-base & Granular Layering', desc: 'Completed base layer compaction and testing.', status: 'completed', img: img3, author: 'Arjun Mehta' },
    { date: 'Mar 15, 2026', title: 'Foundation & Drainage Systems', desc: 'Underground water culverts and storm drains installed.', status: 'completed', img: img2, author: 'Rajesh Kumar (Gov)' },
    { date: 'Jan 05, 2026', title: 'Site Clearing & Excavation', desc: 'Initial land survey and heavy machinery deployment.', status: 'completed', img: img1, author: 'Arjun Mehta' },
  ] : [
    { date: 'Today', title: 'Project Update', desc: 'Regular milestone check.', status: 'current', img: null, author: 'System' }
  ];

  return (
    <div className="fixed inset-0 z-[600] flex justify-center bg-sky-950/80 backdrop-blur-md overflow-y-auto p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col relative my-auto">
        {/* Header */}
        <div className="relative h-48 sm:h-64 rounded-t-2xl overflow-hidden shrink-0">
          <img src={isNH48 ? img5 : img3} alt="Project Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-sky-500 text-white text-xs font-extrabold rounded shadow-sm">{project.id}</span>
                <span className="px-3 py-1 bg-amber-400 text-sky-950 text-xs font-extrabold rounded shadow-sm">{project.status}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">{project.name}</h2>
              <p className="text-sky-200 text-sm mt-1 flex items-center gap-2">📍 Ahmedabad District • {project.dept}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition backdrop-blur cursor-pointer text-xl">✕</button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row p-6 gap-8">
          {/* Left: Timeline */}
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-sky-950 mb-5 flex items-center gap-2">
              📸 Development Tracking
            </h3>
            <div className="relative pl-6 space-y-8 before:absolute before:inset-y-0 before:left-[11px] before:w-1 before:bg-sky-100">
              {timeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-9 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${item.status === 'current' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
                  <div className="bg-white border border-sky-100 shadow-xs rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-extrabold text-slate-800">{item.title}</h4>
                      <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">{item.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-3">{item.desc}</p>
                    {item.img && (
                      <img src={item.img} alt="Milestone" className="w-full h-40 object-cover rounded-lg mb-3 border border-slate-200" />
                    )}
                    <p className="text-[10px] text-slate-400">Updated by: <span className="font-bold text-slate-600">{item.author}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-80 space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">Project Overview</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 mb-1">Overall Progress</p>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-sm font-extrabold text-sky-700">{project.progress}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500">Total Budget</p>
                    <p className="text-sm font-extrabold text-slate-800">{project.budget}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Target Date</p>
                    <p className="text-sm font-extrabold text-slate-800">{project.endDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-4">Key Stakeholders</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{project.officer}</p>
                    <p className="text-[10px] text-slate-500">Nodal Officer (Gov)</p>
                  </div>
                  <span className="text-lg">🏛️</span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Bharat Infratech Pvt Ltd</p>
                    <p className="text-[10px] text-slate-500">Lead Contractor</p>
                  </div>
                  <span className="text-lg">🏗️</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full py-3 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition shadow-md">
                📄 View Complete Tender Docs
              </button>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-sm">
                ⚡ Download Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── 4.5 PROJECT MAP MODAL ──────────────────────────────────── */
// Custom hook to fly to marker when selected
function MapFlyTo({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

function ProjectMapModal({ projects, onClose }) {
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Real lat/lng coordinates near Ahmedabad
  const mapPins = [
    { id: 'PRJ-2201', lat: 23.0335, lng: 72.5814 },
    { id: 'PRJ-2189', lat: 23.0112, lng: 72.5521 },
    { id: 'PRJ-2155', lat: 23.0456, lng: 72.5234 },
    { id: 'PRJ-2143', lat: 23.0678, lng: 72.5999 },
    { id: 'PRJ-2121', lat: 23.0011, lng: 72.6100 },
    { id: 'PRJ-2098', lat: 22.9800, lng: 72.5600 },
    { id: 'PRJ-2074', lat: 23.0250, lng: 72.5000 },
    { id: 'PRJ-2055', lat: 23.0555, lng: 72.6200 },
  ];

  const filteredProjects = selectedDept === 'All' ? projects : projects.filter(p => p.dept === selectedDept);
  
  // Merge pins with project data
  const pinnedProjects = filteredProjects.map(p => {
    const pin = mapPins.find(m => m.id === p.id);
    return { ...p, lat: pin?.lat || 23.0225, lng: pin?.lng || 72.5714 };
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-sky-950/80 backdrop-blur-sm">
      {/* Map Container */}
      <div className="flex-1 relative bg-sky-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 z-[400] flex items-center justify-between pointer-events-none">
          <div className="bg-white p-3 rounded-xl shadow-lg border border-sky-100 flex items-center gap-3 pointer-events-auto">
            <span className="text-xl">🗺️</span>
            <div>
              <h3 className="text-sm font-extrabold text-sky-950">Live Project Tracker</h3>
              <p className="text-[10px] text-slate-500">GIS Integration View (Ahmedabad)</p>
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <select value={selectedDept} onChange={(e) => { setSelectedDept(e.target.value); setSelectedProject(null); }} className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer">
              <option value="All">All Departments</option>
              <option value="Transport & Roads">Transport & Roads</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Power & Energy">Power & Energy</option>
              <option value="Smart City">Smart City</option>
            </select>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-lg border border-slate-200 hover:bg-slate-50 pointer-events-auto transition cursor-pointer">
            ✕
          </button>
        </div>

        {/* Real Leaflet Map */}
        <div className="absolute inset-0 z-0">
          <MapContainer center={[23.0225, 72.5714]} zoom={12} style={{ width: '100%', height: '100%' }} zoomControl={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pinnedProjects.map(p => {
              const emoji = {
                'Transport & Roads': '🛣️',
                'Water & Sanitation': '🚰',
                'Power & Energy': '⚡',
                'Smart City': '🏙️',
              }[p.dept] || '📍';
              const customIcon = L.divIcon({
                className: 'custom-dept-icon',
                html: `<div style="font-size: 24px; text-shadow: 0 2px 5px rgba(0,0,0,0.4); transform: translate(-20%, -20%);">${emoji}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
              });

              return (
                <Marker 
                  key={p.id} 
                  position={[p.lat, p.lng]} 
                  icon={customIcon}
                  eventHandlers={{ click: () => setSelectedProject(p) }}
                >
                  <Popup>
                    <div className="text-center font-sans">
                      <p className="font-extrabold text-sky-950 text-xs m-0">{p.id}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{p.status}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
            {selectedProject && <MapFlyTo center={[selectedProject.lat, selectedProject.lng]} />}
          </MapContainer>
        </div>
      </div>

      {/* Details Drawer */}
      <div className={`w-[400px] bg-white shadow-2xl transition-transform duration-300 transform ${selectedProject ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedProject && (
          <div className="h-full flex flex-col overflow-y-auto">
            {/* Image Header */}
            <div className="h-48 bg-slate-200 relative shrink-0">
              <img src="https://images.unsplash.com/photo-1541888087405-ebdb17d9e486?auto=format&fit=crop&w=800&q=80" alt="Construction site" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-950/90 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-extrabold bg-sky-500 text-white px-2 py-0.5 rounded uppercase">{selectedProject.id}</span>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${selectedProject.status === 'Completed' ? 'bg-emerald-500 text-white' : selectedProject.status === 'Delayed' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-amber-950'}`}>{selectedProject.status}</span>
                </div>
                <h3 className="text-lg font-extrabold text-white leading-tight">{selectedProject.name}</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 cursor-pointer">✕</button>
            </div>

            {/* Details Content */}
            <div className="p-5 flex-1 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-sky-50 rounded-lg p-3">
                  <p className="text-[10px] font-extrabold text-sky-600 uppercase mb-1">Tender Budget</p>
                  <p className="text-lg font-extrabold text-sky-950">{selectedProject.budget}</p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-[10px] font-extrabold text-emerald-600 uppercase mb-1">Completion</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-extrabold text-emerald-950">{selectedProject.progress}%</p>
                    <div className="h-1.5 flex-1 bg-emerald-200 rounded-full"><div className="h-full bg-emerald-600 rounded-full" style={{ width: `${selectedProject.progress}%` }}/></div>
                  </div>
                </div>
              </div>

              {/* Stakeholders */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Project Stakeholders</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-sky-950">Dept: {selectedProject.dept}</p>
                      <p className="text-[10px] text-slate-500">Supervising Authority</p>
                    </div>
                    <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded">Gov</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-sky-950">{selectedProject.officer}</p>
                      <p className="text-[10px] text-slate-500">Nodal Officer</p>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Lead</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-sky-950">Bharat Infratech Pvt Ltd</p>
                      <p className="text-[10px] text-slate-500">Tender Awardee</p>
                    </div>
                    <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded">Contractor</span>
                  </div>
                </div>
              </div>

              {/* Tracking / Timeline */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Recent Tracking Updates</h4>
                <div className="relative pl-3 space-y-4 before:absolute before:inset-y-0 before:left-[3px] before:w-px before:bg-slate-200">
                  <div className="relative">
                    <span className="absolute -left-3 top-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_white]" />
                    <p className="text-xs font-bold text-slate-800">Foundation Phase 100% Complete</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Updated by Arjun Mehta (Contractor) • Today 11:20 AM</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-3 top-1 w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_white]" />
                    <p className="text-xs font-bold text-slate-800">Site Inspection Passed</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Updated by Neha Verma (QC) • Sep 25, 2026</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-3 top-1 w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_0_4px_white]" />
                    <p className="text-xs font-bold text-slate-800">Fund Tranche 2 Released (₹12 Cr)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Updated by Treasury Dept • Sep 22, 2026</p>
                  </div>
                </div>
              </div>

              {/* Photos Preview */}
              <div>
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">Site Photos (Last 7 Days)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80" className="w-full h-16 object-cover rounded shadow-sm border border-slate-200 cursor-pointer hover:opacity-80" />
                  <img src="https://images.unsplash.com/photo-1504307651254-35680f356f58?auto=format&fit=crop&w=300&q=80" className="w-full h-16 object-cover rounded shadow-sm border border-slate-200 cursor-pointer hover:opacity-80" />
                  <div className="w-full h-16 bg-slate-100 rounded border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:text-sky-600">
                    <span className="text-lg">+</span>
                    <span className="text-[8px] font-bold">View All 24</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 grid grid-cols-2 gap-2">
              <button className="py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 transition shadow-sm">📑 View Tender</button>
              <button className="py-2.5 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition shadow-sm">⚡ Audit Log</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── 5. PROJECT OVERSIGHT ──────────────────────────────────── */
function TabProjects() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMap, setShowMap] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const statuses = ['all', 'In Progress', 'Completed', 'Delayed', 'Planned'];
  const filtered = statusFilter === 'all' ? PROJECTS : PROJECTS.filter(p => p.status === statusFilter);
  const counts = { all: PROJECTS.length, 'In Progress': 4, Completed: 2, Delayed: 1, Planned: 1 };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">Project Oversight</h3>
          <p className="text-xs text-slate-500">Monitor all government projects — status, delays, budgets, and responsible departments</p>
        </div>
        <button onClick={() => setShowMap(true)} className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition cursor-pointer shadow flex items-center gap-2">
          🗺️ See on Map
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
              statusFilter === s ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600 border-sky-100 hover:bg-sky-50'
            }`}>
            {s === 'all' ? 'All Projects' : s}
            <span className="ml-1.5 text-[10px] opacity-70">({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-sky-100">
              <tr className="text-[10px] font-extrabold text-sky-950 uppercase tracking-wider">
                <th className="px-5 py-3">Project</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Progress</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Budget</th>
                <th className="px-5 py-3">Delay</th>
                <th className="px-5 py-3">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => (
                <tr key={p.id} onClick={() => setSelectedDetails(p)} className="hover:bg-sky-50 transition-colors cursor-pointer group">
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800 group-hover:text-sky-700 transition-colors">{p.name}</p>
                    <p className="text-[10px] font-mono text-sky-600 mt-0.5">{p.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold">{p.dept}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-28">
                      <ProgressBar value={p.progress} max={100}
                        colorVariant={p.status === 'Delayed' ? 'rose' : p.progress === 100 ? 'emerald' : 'sky'} size="sm" showPercent={false} />
                      <span className="text-[10px] font-bold text-sky-700">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-4 font-bold text-amber-700">{p.budget}</td>
                  <td className="px-5 py-4">
                    {p.delay > 0
                      ? <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">+{p.delay} days</span>
                      : <span className="text-[10px] font-bold text-emerald-700">On Track</span>}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[10px]">{p.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedDetails && <ProjectDetailsModal project={selectedDetails} onClose={() => setSelectedDetails(null)} />}

      {/* Project Map Modal */}
      {showMap && <ProjectMapModal projects={PROJECTS} onClose={() => setShowMap(false)} />}
    </div>
  );
}

/* ── 6. COMPLAINTS MANAGEMENT ──────────────────────────────── */
function TabComplaints() {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'Pending', 'In Review', 'Work Assigned', 'Escalated', 'Resolved'];
  const filtered = filter === 'all' ? COMPLAINTS : COMPLAINTS.filter(c => c.status === filter);

  const counts = {
    all: COMPLAINTS.length,
    Pending: 1, 'In Review': 2, 'Work Assigned': 1, Escalated: 1, Resolved: 2,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">Complaints Management</h3>
          <p className="text-xs text-slate-500">Monitor, assign, escalate and resolve citizen complaints across all departments</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: '156', color: 'sky' },
          { label: 'Open', value: '62', color: 'amber' },
          { label: 'In Progress', value: '56', color: 'sky' },
          { label: 'Escalated', value: '38', color: 'rose' },
          { label: 'Resolved', value: '320', color: 'emerald' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-sky-100 shadow-xs p-3 text-center">
            <div className={`text-xl font-extrabold text-${c.color}-700`}>{c.value}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border ${
              filter === f ? 'bg-sky-600 text-white border-sky-600' : 'bg-white text-slate-600 border-sky-100 hover:bg-sky-50'
            }`}>
            {f === 'all' ? 'All' : f}
            {counts[f] !== undefined && <span className="ml-1 opacity-70">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-sky-100">
              <tr className="text-[10px] font-extrabold text-sky-950 uppercase tracking-wider">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Complaint</th>
                <th className="px-5 py-3">Citizen</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Priority</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Assigned To</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-sky-700 font-bold text-[10px]">{c.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800 max-w-[200px]">{c.title}</td>
                  <td className="px-5 py-4 text-slate-600">{c.citizen}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded font-bold">{c.dept}</span>
                  </td>
                  <td className="px-5 py-4"><PriorityBadge priority={c.priority} /></td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{c.assignedTo}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button className="text-[10px] px-2 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded font-bold hover:bg-sky-100 cursor-pointer">Assign</button>
                      <button className="text-[10px] px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded font-bold hover:bg-rose-100 cursor-pointer">Escalate</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── 7. FINANCE OVERVIEW ───────────────────────────────────── */
function TabFinance() {
  const deptSpend = [
    { name: 'Urban Dev',    budget: 142, spent: 97  },
    { name: 'PWD',          budget: 220, spent: 188 },
    { name: 'Transport',    budget: 180, spent: 143 },
    { name: 'Health',       budget: 95,  spent: 71  },
    { name: 'Power',        budget: 110, spent: 82  },
    { name: 'Water',        budget: 75,  spent: 48  },
    { name: 'Parks',        budget: 40,  spent: 22  },
    { name: 'Smart City',   budget: 150, spent: 83  },
  ];
  const totalBudget = deptSpend.reduce((s,d) => s + d.budget, 0);
  const totalSpent  = deptSpend.reduce((s,d) => s + d.spent, 0);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-extrabold text-sky-950">Finance Overview</h3>
        <p className="text-xs text-slate-500">Monitor total budget, released funds, pending payments &amp; department-wise spending</p>
      </div>

      {/* Finance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <KpiCard icon="💰" label="Total Budget"      value={`₹${totalBudget}Cr`} trend="FY 2026-27"       sub="All schemes" />
        <KpiCard icon="✅" label="Released Funds"    value={`₹${totalSpent}Cr`}  trend={`${Math.round(totalSpent/totalBudget*100)}% disbursed`} sub="As of Sep 28" trendUp />
        <KpiCard icon="⏳" label="Pending Payments"  value="₹18.5 Cr"            trend="5 vouchers"       sub="Avg 1.8 day clearance" />
        <KpiCard icon="🔒" label="Frozen / On Hold"  value="₹2.3 Cr"             trend="2 audit flags"    sub="Under review" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5">
          <h4 className="text-sm font-extrabold text-sky-950 mb-0.5">Monthly Spending Trend</h4>
          <p className="text-xs text-slate-500 mb-4">Expenditure in ₹ Crore per month</p>
          <BarChart data={[28,34,41,45,50,55,52,61,58,65,68,72]} labels={MONTHS} color="#f59e0b" height={88} />
        </div>
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5">
          <h4 className="text-sm font-extrabold text-sky-950 mb-3">Department Budget Comparison</h4>
          <div className="space-y-3">
            {deptSpend.map(d => (
              <ProgressBar key={d.name}
                label={d.name}
                sublabel={`₹${d.spent}Cr / ₹${d.budget}Cr`}
                value={d.spent} max={d.budget}
                colorVariant={d.spent/d.budget > 0.92 ? 'rose' : d.spent/d.budget > 0.75 ? 'gold' : 'sky'}
                size="sm"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-sky-100 bg-sky-50/50">
          <h4 className="text-sm font-extrabold text-sky-950">Recent Disbursements</h4>
          <p className="text-xs text-slate-500 mt-0.5">Admin view only — Finance Officer manages actual approvals</p>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { id: 'DIS-6601', payee: 'Bharat Infratech Pvt Ltd',  amount: '₹4.25 Cr',   status: 'Processed', dept: 'Transport'   },
            { id: 'DIS-6589', payee: 'CivTech Solutions Ltd',      amount: '₹1.82 Cr',   status: 'Pending',   dept: 'Water'       },
            { id: 'DIS-6574', payee: 'BrightPath Technologies',    amount: '₹88.5 Lakh', status: 'On Hold',   dept: 'Power'       },
            { id: 'DIS-6561', payee: 'MMRDA Metro Works',          amount: '₹12.0 Cr',   status: 'Processed', dept: 'Transport'   },
            { id: 'DIS-6548', payee: 'GreenBuild Corp',            amount: '₹42.0 Lakh', status: 'Approved',  dept: 'Parks'       },
          ].map(t => (
            <div key={t.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-sky-50/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-sky-600 font-bold w-16 shrink-0">{t.id}</span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">{t.payee}</p>
                  <span className="text-[10px] text-slate-500">{t.dept}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-extrabold text-amber-700 text-sm">{t.amount}</span>
                <StatusBadge status={t.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 8. REPORTS & ANALYTICS ────────────────────────────────── */
function TabReports() {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-extrabold text-sky-950">Reports &amp; Analytics</h3>
        <p className="text-xs text-slate-500">Generate, schedule and download system-wide reports</p>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { icon: '👥', title: 'User Activity Report',          desc: 'Logins, role changes, account creations and suspensions across all users',      tag: 'Identity',  color: 'sky'    },
          { icon: '🏗️', title: 'Project Progress Report',       desc: 'Status, delays, completion rates and budget utilization per project',           tag: 'Projects',  color: 'amber'  },
          { icon: '📋', title: 'Complaint Resolution Report',   desc: 'Grievances filed, resolved, escalated and average resolution times by dept',    tag: 'Civic',     color: 'violet' },
          { icon: '💰', title: 'Financial Utilization Report',  desc: 'Budget release, expenditure, pending payments and audit flags by scheme',       tag: 'Finance',   color: 'emerald'},
          { icon: '🏛️', title: 'Department Performance Report', desc: 'Employee count, project delivery, budget compliance per department',             tag: 'Depts',     color: 'sky'    },
          { icon: '🔒', title: 'Security Audit Log Export',     desc: 'Login attempts, route access, JWT events and security flags over any date range',tag: 'Security',  color: 'rose'   },
        ].map(r => (
          <div key={r.title} className="bg-white rounded-xl border border-sky-100 shadow-xs p-5 hover:shadow-md hover:border-sky-300 transition-all">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl p-2 bg-sky-50 rounded-xl border border-sky-100">{r.icon}</span>
              <div>
                <h4 className="text-xs font-extrabold text-sky-950 leading-snug">{r.title}</h4>
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-${r.color}-100 text-${r.color}-800 mt-1 inline-block`}>{r.tag}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{r.desc}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-[10px] font-bold bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition">📊 Generate</button>
              <button className="flex-1 py-1.5 text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 rounded-lg hover:bg-sky-100 cursor-pointer transition">📅 Schedule</button>
              <button className="py-1.5 px-3 text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 cursor-pointer transition">⬇️ PDF</button>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5">
          <h4 className="text-sm font-extrabold text-sky-950 mb-3">Platform Usage (This Month)</h4>
          <div className="space-y-3">
            {[
              { label: 'Total API Calls',     value: '2.4 M',  bar: 88 },
              { label: 'Active Sessions',      value: '1,842',  bar: 65 },
              { label: 'Documents Uploaded',  value: '4,120',  bar: 72 },
              { label: 'Reports Generated',   value: '318',    bar: 40 },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="font-medium text-slate-700">{r.label}</span>
                  <span className="font-extrabold text-sky-700">{r.value}</span>
                </div>
                <div className="h-1.5 bg-sky-50 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${r.bar}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-xs p-5">
          <h4 className="text-sm font-extrabold text-sky-950 mb-3">Complaint Analytics</h4>
          <BarChart data={MONTHLY_COMPLAINTS} labels={MONTHS} color="#f59e0b" height={88} />
        </div>

        <div className="bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl p-5 text-white">
          <h4 className="text-sm font-bold text-amber-300 mb-4">📊 Key Metrics</h4>
          <div className="space-y-3 text-xs">
            {[
              { label: 'Avg Response Time',    value: '1.8 days' },
              { label: 'Complaint Resolution', value: '87.4%'    },
              { label: 'Project On-Time Rate', value: '73.8%'    },
              { label: 'Budget Compliance',    value: '92.1%'    },
              { label: 'User Satisfaction',    value: '4.2 / 5'  },
              { label: 'System Uptime',        value: '99.98%'   },
            ].map(m => (
              <div key={m.label} className="flex justify-between border-b border-sky-500/30 pb-2">
                <span className="text-sky-200">{m.label}</span>
                <span className="font-extrabold text-amber-300">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 9. NOTIFICATIONS ──────────────────────────────────────── */
function TabNotifications() {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-sky-950">Notifications</h3>
          <p className="text-xs text-slate-500">Broadcast system-wide messages, alerts and notices to any user group</p>
        </div>
        <button onClick={() => setShowCompose(!showCompose)}
          className="px-4 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 transition cursor-pointer shadow">
          + Broadcast Notification
        </button>
      </div>

      {/* Notification Stats (Moved to Top) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: '📨', label: 'Total Sent',      value: '1,248' },
          { icon: '👁️', label: 'Open Rate',        value: '82%'   },
          { icon: '🔔', label: 'Drafts',           value: '3'     },
          { icon: '👥', label: 'Recipients Today', value: '4,210' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-sky-100 shadow-xs p-4 text-center">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-xl font-extrabold text-sky-950">{s.value}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Compose Panel */}
      {showCompose && (
        <div className="bg-white rounded-xl border border-sky-100 shadow-md p-6 border-l-4 border-l-amber-400">
          <h4 className="text-sm font-extrabold text-sky-950 mb-4">✉️ Compose Broadcast</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">Notification Title</label>
                <input type="text" className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium" placeholder="e.g. System Maintenance Notice" />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">Audience</label>
                <select className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium cursor-pointer">
                  <option>All Users</option>
                  <option>Officers Only</option>
                  <option>Engineers Only</option>
                  <option>Finance Officers</option>
                  <option>Contractors</option>
                  <option>Citizens</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase text-slate-600 mb-1">Message</label>
              <textarea rows={3} className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 font-medium resize-none" placeholder="Write your notification message here..." />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl hover:bg-sky-700 cursor-pointer transition">📨 Send Now</button>
              <button className="px-4 py-2 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-100 cursor-pointer transition">📅 Schedule</button>
              <button onClick={() => setShowCompose(false)} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 cursor-pointer transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Sent Notifications */}
      <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-sky-100 bg-sky-50/50">
          <h4 className="text-sm font-extrabold text-sky-950">Notification History</h4>
        </div>
        <div className="divide-y divide-slate-50">
          {NOTIFICATIONS_LIST.map(n => (
            <div key={n.id} className="px-5 py-4 hover:bg-sky-50/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h5 className="text-xs font-extrabold text-slate-800">{n.title}</h5>
                    {n.sent
                      ? <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">✅ SENT</span>
                      : <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">⏳ DRAFT</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                    <span>👥 {n.audience}</span>
                    <span>•</span>
                    <span>📅 {n.date}</span>
                  </div>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button className="text-[10px] px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg font-bold hover:bg-sky-100 cursor-pointer transition">Resend</button>
                  <button className="text-[10px] px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg font-bold hover:bg-rose-100 cursor-pointer transition">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN ADMIN COMPONENT
════════════════════════════════════════════════════════════════ */
function Admin() {
  const { user } = useAuth();
  const userName = user?.name || 'Aditya Rao';
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  return (
    <div className="space-y-6">
      {/* Welcome Banner — Dashboard only */}
      {activeTab === 'overview' && (
        <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl p-6 text-white shadow-lg border border-sky-400/30 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-48 h-32 bg-amber-300/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-sky-950 shadow-sm mb-3">
                🛡️ Super Administration &amp; Command Center
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Namaste, {userName} 👋</h2>
              <p className="text-sm text-sky-100 mt-1.5 max-w-xl font-medium">
                Role: <span className="text-amber-300 font-bold">Super Admin</span>
                {' '}• Full sovereignty over users, departments, projects, complaints, finances &amp; system telemetry.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 flex-wrap">
              <button className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-sky-950 font-black rounded-xl text-xs shadow-md transition-all border-b-2 border-amber-600 cursor-pointer whitespace-nowrap">
                + Provision User
              </button>
              <button className="px-4 py-2.5 bg-white/15 hover:bg-white/25 text-white font-bold rounded-xl text-xs border border-white/30 transition-all cursor-pointer whitespace-nowrap">
                📊 Export Report
              </button>
            </div>
          </div>
          <div className="relative mt-5 pt-4 border-t border-sky-500/40 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'Users',       value: '12,548' },
              { label: 'Projects',    value: '84'     },
              { label: 'Depts',       value: '24'     },
              { label: 'Complaints',  value: '156'    },
              { label: 'Budget Used', value: '72%'    },
              { label: 'Uptime',      value: '99.9%'  },
            ].map((kpi) => (
              <div key={kpi.label} className="text-center">
                <div className="text-xl font-extrabold text-white">{kpi.value}</div>
                <div className="text-[10px] text-sky-200 font-medium mt-0.5">{kpi.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Route to correct tab */}
      {activeTab === 'overview'       && <TabOverview />}
      {activeTab === 'feed'           && <TabFeed />}
      {activeTab === 'users'          && <TabUsers />}
      {activeTab === 'departments'    && <TabDepartments />}
      {activeTab === 'projects'       && <TabProjects />}
      {activeTab === 'complaints'     && <TabComplaints />}
      {activeTab === 'finance'        && <TabFinance />}
      {activeTab === 'reports'        && <TabReports />}
      {activeTab === 'notifications'  && <TabNotifications />}
    </div>

  );
}

export default Admin;
