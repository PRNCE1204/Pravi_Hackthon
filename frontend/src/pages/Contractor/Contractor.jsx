import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════════════════════ */
const KPI_DATA = {
  activeProjects: 4,
  tasksDueToday: 12,
  progressSubmitted: 3,
  pendingEngineerApproval: 2,
  pendingPayments: '₹1.5 Cr',
  workforceOnSite: 145
};

const SCHEDULE = [
  { time: '09:00 AM', task: 'Road excavation at Sector 5', status: 'Completed' },
  { time: '11:00 AM', task: 'Asphalt laying Phase 1', status: 'In Progress' },
  { time: '03:00 PM', task: 'Engineer inspection (Neha Verma)', status: 'Pending' },
];

const PROJECTS = [
  { id: 'RD-2026-001', name: 'NH-48 Highway Repair', dept: 'Roads', location: 'Sector 5 to 12', value: '₹4.5 Cr', progress: 68, deadline: '15 Oct 2026', status: 'Active' },
  { id: 'WT-2026-042', name: 'Sewage Line Upgrade', dept: 'Water', location: 'Zone B North', value: '₹1.2 Cr', progress: 42, deadline: '01 Nov 2026', status: 'Active' },
  { id: 'PW-2026-015', name: 'Solar Street Lights', dept: 'Power', location: 'City Center', value: '₹45 Lakh', progress: 15, deadline: '20 Sep 2026', status: 'Delayed' },
  { id: 'PK-2026-088', name: 'Central Park Reno', dept: 'Parks', location: 'Downtown', value: '₹85 Lakh', progress: 100, deadline: '05 Sep 2026', status: 'Completed' },
];

const DAILY_LOGS = [
  { date: '12 Sept 2026', project: 'NH-48 Highway Repair', work: 'Asphalt laying completed on 2km stretch.', progress: '65%' },
  { date: '13 Sept 2026', project: 'NH-48 Highway Repair', work: 'Road marking started and drainage checked.', progress: '68%' },
];

const TASKS = [
  { id: 'TSK-01', task: 'Road Excavation', project: 'NH-48 Highway Repair', priority: 'High', status: 'Completed', due: '10 Sept 2026' },
  { id: 'TSK-02', task: 'Asphalt Layer', project: 'NH-48 Highway Repair', priority: 'Critical', status: 'In Progress', due: '15 Sept 2026' },
  { id: 'TSK-03', task: 'Pipe Procurement', project: 'Sewage Line Upgrade', priority: 'Medium', status: 'Pending', due: '20 Sept 2026' },
];

const MATERIALS = [
  { item: 'Cement (Bags)', total: 500, used: 250, remaining: 250 },
  { item: 'Asphalt (Tons)', total: 100, used: 35, remaining: 65 },
  { item: 'Steel TMT (Tons)', total: 50, used: 45, remaining: 5 },
  { item: 'Sand (Trucks)', total: 20, used: 18, remaining: 2 },
];

const WORKFORCE = [
  { name: 'Raj Patel', role: 'Supervisor', status: 'Present', site: 'NH-48 Highway' },
  { name: 'Mohan Singh', role: 'Laborer', status: 'Absent', site: '-' },
  { name: 'Amit Kumar', role: 'Operator', status: 'Present', site: 'Sewage Line' },
  { name: 'Suresh Das', role: 'Laborer', status: 'Present', site: 'NH-48 Highway' },
];

const EQUIPMENT = [
  { name: 'Excavator EX-200', project: 'Sewage Line Upgrade', operator: 'Amit Kumar', status: 'In Use', maintenance: '15 Oct 2026' },
  { name: 'Road Roller RL-5', project: 'NH-48 Highway Repair', operator: 'Prakash Rao', status: 'In Use', maintenance: '01 Oct 2026' },
  { name: 'Crane CR-10', project: '-', operator: '-', status: 'Available', maintenance: '20 Nov 2026' },
];

const BILLS = [
  { id: 'BILL-102', project: 'NH-48 Highway Repair', amount: '₹25 Lakh', date: '28 Sept 2026', status: 'Pending' },
  { id: 'BILL-101', project: 'Sewage Line Upgrade', amount: '₹12 Lakh', date: '25 Sept 2026', status: 'Approved' },
  { id: 'BILL-095', project: 'Central Park Reno', amount: '₹40 Lakh', date: '10 Sept 2026', status: 'Paid' },
];

const DOCUMENTS = [
  { id: 'DOC-901', name: 'Contract Agreement (NH-48)', type: 'PDF', date: '01 Sept 2026', size: '2.4 MB' },
  { id: 'DOC-902', name: 'Technical Drawing Rev 2 (Sewage)', type: 'PDF', date: '05 Sept 2026', size: '5.1 MB' },
  { id: 'DOC-903', name: 'Work Order (Central Park)', type: 'PDF', date: '15 Aug 2026', size: '1.1 MB' },
  { id: 'DOC-904', name: 'Environmental Clearance', type: 'Image', date: '22 Aug 2026', size: '3.4 MB' },
];

const TENDERS = [
  { id: 'TND-2026-101', title: 'Road Resurfacing Phase 3', dept: 'Roads', budget: '₹12 Cr', deadline: '2026-10-15', status: 'Open' },
  { id: 'TND-2026-110', title: 'Solid Waste Management Fleet', dept: 'Sanitation', budget: '₹15 Cr', deadline: '2026-11-05', status: 'Open' },
  { id: 'TND-2026-112', title: 'Government School Digital Labs', dept: 'Education', budget: '₹4.2 Cr', deadline: '2026-10-25', status: 'Open' },
  { id: 'TND-2026-088', title: 'BRTS Corridor Maintenance', dept: 'Transport', budget: '₹35 Cr', deadline: '2026-08-15', status: 'Closed' },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════════════════════════════ */

// 1. Dashboard (Overview)
function TabOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Active Projects" value={KPI_DATA.activeProjects} icon="🏗️" accentColor="sky" />
        <StatCard title="Tasks Due Today" value={KPI_DATA.tasksDueToday} icon="📅" accentColor="amber" />
        <StatCard title="Updates Sent" value={KPI_DATA.progressSubmitted} icon="📤" accentColor="emerald" />
        <StatCard title="Pending Inspections" value={KPI_DATA.pendingEngineerApproval} icon="🔍" accentColor="sky" />
        <StatCard title="Pending Payments" value={KPI_DATA.pendingPayments} icon="💰" accentColor="amber" />
        <StatCard title="Workforce on Site" value={KPI_DATA.workforceOnSite} icon="👷" accentColor="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {SCHEDULE.map((sch, i) => (
              <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${sch.status === 'Completed' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-sky-100 shadow-sm'}`}>
                <div className="flex gap-4 items-center">
                  <div className="w-20 text-center shrink-0">
                    <p className="text-sm font-black text-sky-900">{sch.time.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-slate-500">{sch.time.split(' ')[1]}</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4">
                    <h4 className="font-extrabold text-sky-950">{sch.task}</h4>
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1 text-[10px] font-bold rounded-lg border ${sch.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : sch.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                    {sch.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow flex items-center justify-center gap-2">
              <span>📈</span> Update Progress
            </button>
            <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow flex items-center justify-center gap-2">
              <span>📸</span> Upload Site Photos
            </button>
            <button className="w-full py-3 bg-amber-400 text-sky-950 font-bold rounded-xl hover:bg-amber-500 transition shadow flex items-center justify-center gap-2">
              <span>💰</span> Submit Bill
            </button>
            <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow flex items-center justify-center gap-2">
              <span>📋</span> View Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. My Projects
function TabProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">My Projects</h2>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
              <th className="p-4">Project</th>
              <th className="p-4">Department</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Status</th>
              <th className="p-4 w-48">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PROJECTS.map(proj => (
              <tr key={proj.id} onClick={() => setSelectedProject(proj)} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{proj.name}</div>
                  <div className="text-[10px] font-mono text-sky-600">{proj.id}</div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">{proj.dept}</td>
                <td className="p-4 text-sm font-bold text-slate-600">{proj.deadline}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                    proj.status === 'Delayed' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                  }`}>{proj.status}</span>
                </td>
                <td className="p-4 w-32"><ProgressBar value={proj.progress} max={100} size="sm" colorVariant={proj.status === 'Delayed' ? 'rose' : 'emerald'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-sky-950/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-sky-900 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-extrabold">{selectedProject.name}</h3>
                <p className="text-sm text-sky-200 mt-1">{selectedProject.id} • {selectedProject.location}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-sky-200 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Contract Value</p>
                  <p className="text-xl font-black text-amber-600">{selectedProject.value}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Deadline</p>
                  <p className="text-lg font-bold text-sky-900">{selectedProject.deadline}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current Progress</p>
                  <p className="text-lg font-bold text-emerald-600">{selectedProject.progress}% Completed</p>
                </div>
              </div>

              <div className="bg-sky-50 p-5 rounded-xl border border-sky-100">
                <h4 className="text-sm font-extrabold text-sky-950 mb-4">Project Timeline</h4>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-sky-200 -z-10 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 h-1 bg-sky-500 -z-10 -translate-y-1/2 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Awarded</div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Started</div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Inspection</div>
                  <div className="flex flex-col items-center gap-2 opacity-50"><div className="w-4 h-4 rounded-full bg-sky-200 border-2 border-white shadow-sm"></div>Completed</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="px-5 py-2.5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Update Progress</button>
                <button className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">View Documents</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Daily Work Updates
function TabUpdates() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Daily Work Updates</h2>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Project</label>
            <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
              <option>NH-48 Highway Repair</option>
              <option>Sewage Line Upgrade</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Date</label>
            <input type="date" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">Work Completed Today</label>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-20" placeholder="E.g. Asphalt laying completed on 2km stretch..."></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Overall Progress %</label>
            <input type="number" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900" defaultValue="68" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2">Weather Conditions</label>
            <input type="text" className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900" defaultValue="Sunny, 32°C" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">GPS Verified Evidence</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
            <span className="text-3xl mb-2 block">📷</span>
            <p className="text-sm font-bold text-slate-600">Upload Before/After Photos</p>
          </div>
        </div>
        <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow">Submit Daily Log</button>
      </div>

      <h3 className="font-extrabold text-sky-950 mt-8 mb-4">Recent Daily Logs</h3>
      <div className="space-y-4">
        {DAILY_LOGS.map((log, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 mb-1">{log.date} • <span className="text-sky-600">{log.project}</span></p>
              <p className="font-bold text-sky-950">{log.work}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-600">{log.progress}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Task Management
function TabTasks() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Task Management</h2>
        <button className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg">+ New Task</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Task</th>
              <th className="p-4">Project</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {TASKS.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{t.task}</td>
                <td className="p-4 text-sm text-slate-600">{t.project}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${t.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : t.priority === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'}`}>{t.priority}</span>
                </td>
                <td className="p-4 text-xs font-bold text-slate-500">{t.due}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : t.status === 'In Progress' ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>{t.status}</span>
                </td>
                <td className="p-4">
                  {t.status !== 'Completed' && <button className="text-xs font-bold text-emerald-600 hover:underline">Mark Done</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 5. Material Management
function TabMaterials() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Material Inventory</h2>
        <button className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg">+ Request Material</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MATERIALS.map((m, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-sky-300 transition cursor-pointer">
            <h3 className="font-extrabold text-sky-950 mb-3">{m.item}</h3>
            <div className="grid grid-cols-3 gap-2 text-center mb-4">
              <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-400">Total</p>
                <p className="font-black text-sky-700">{m.total}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <p className="text-[10px] uppercase font-bold text-slate-400">Used</p>
                <p className="font-black text-amber-600">{m.used}</p>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-slate-400">Stock</p>
                <p className={`font-black ${m.remaining < (m.total * 0.2) ? 'text-rose-600' : 'text-emerald-600'}`}>{m.remaining}</p>
              </div>
            </div>
            <ProgressBar value={m.used} max={m.total} size="sm" colorVariant={m.used / m.total > 0.8 ? 'rose' : 'sky'} showPercent={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Workforce Management
function TabWorkforce() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Workforce Management</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-black text-emerald-600">145</p>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">Workers Present</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-black text-rose-500">12</p>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">Absent Today</p>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center">
          <p className="text-3xl font-black text-sky-600">8</p>
          <p className="text-xs font-bold text-slate-500 uppercase mt-1">Supervisors</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Worker Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Site Assigned</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {WORKFORCE.map((w, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{w.name}</td>
                <td className="p-4 text-sm font-bold text-slate-600">{w.role}</td>
                <td className="p-4 text-sm font-bold text-slate-600">{w.site}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${w.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{w.status}</span>
                </td>
                <td className="p-4 text-center"><button className="text-xs font-bold text-sky-600 hover:underline">Reassign</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. Equipment Management
function TabEquipment() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Equipment Tracking</h2>
        <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200">Request Equipment</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Equipment</th>
              <th className="p-4">Current Project</th>
              <th className="p-4">Operator</th>
              <th className="p-4">Maintenance Due</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {EQUIPMENT.map((eq, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-800">{eq.name}</td>
                <td className="p-4 text-sm font-bold text-slate-600">{eq.project}</td>
                <td className="p-4 text-sm font-bold text-slate-600">{eq.operator}</td>
                <td className="p-4 text-xs font-bold text-rose-500">{eq.maintenance}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${eq.status === 'Available' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{eq.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8. Documents & Contracts
function TabDocuments() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Documents & Contracts</h2>
        <button className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg shadow">+ Upload Document</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Document Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Size</th>
              <th className="p-4">Date Uploaded</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {DOCUMENTS.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{doc.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{doc.id}</div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">{doc.type}</td>
                <td className="p-4 text-sm text-slate-500">{doc.size}</td>
                <td className="p-4 text-xs font-bold text-slate-500">{doc.date}</td>
                <td className="p-4 text-center">
                  <button className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded hover:bg-slate-200 mr-2">View</button>
                  <button className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold rounded hover:bg-sky-100">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 8.5 Tenders
function TabTenders() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Apply for Tenders</h2>
      <p className="text-sm text-slate-600 mb-4">Browse and apply for government tenders published by Department Officers.</p>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Tender Title</th>
              <th className="p-4">Department</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Deadline</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {TENDERS.map(t => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{t.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">{t.id}</div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">{t.dept}</td>
                <td className="p-4 font-black text-amber-600">{t.budget}</td>
                <td className="p-4 text-xs font-bold text-slate-500">{t.deadline}</td>
                <td className="p-4 text-center">
                  {t.status === 'Open' ? (
                    <button className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 shadow-sm">Apply Now</button>
                  ) : (
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg">Closed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 9. Bills & Payment Requests
function TabBills() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Bills & Payment Requests</h2>
        <button className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 shadow">+ Submit Bill</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Bill ID</th>
              <th className="p-4">Project</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date Submitted</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {BILLS.map(bill => (
              <tr key={bill.id} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-4 text-[10px] font-mono text-slate-500 font-bold">{bill.id}</td>
                <td className="p-4 text-sm font-bold text-slate-800">{bill.project}</td>
                <td className="p-4 font-black text-amber-600">{bill.amount}</td>
                <td className="p-4 text-xs font-bold text-slate-600">{bill.date}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 
                    bill.status === 'Approved' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                  }`}>{bill.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 10. Notifications
function TabNotifications() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Notifications</h2>
      <div className="space-y-3">
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-sky-900">New Project Assigned</h4>
          <p className="text-xs text-sky-700 mt-1">You have been awarded the contract for 'Sewage Line Upgrade'.</p>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-emerald-900">Payment Released</h4>
          <p className="text-xs text-emerald-700 mt-1">Finance has cleared BILL-095 for Central Park Reno.</p>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-amber-900">Inspection Scheduled</h4>
          <p className="text-xs text-amber-700 mt-1">Engineer Neha Verma will inspect NH-48 Highway Repair at 3:00 PM today.</p>
        </div>
      </div>
    </div>
  );
}

// 11. Profile & Settings
function TabSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-extrabold text-sky-950">Contractor Profile & Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Company Name</label><input type="text" disabled value="Bharat Infratech Pvt Ltd" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-bold" /></div>
        <div><label className="block text-xs font-bold text-slate-500 mb-1">GST / License No.</label><input type="text" disabled value="GST27ABCDE1234F1Z5" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-bold text-slate-600" /></div>
        <div className="pt-4"><button className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save Preferences</button></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN CONTRACTOR COMPONENT
════════════════════════════════════════════════════════════════ */
function Contractor() {
  const { user } = useAuth();
  const userName = user?.name || 'Contractor';
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  return (
    <div className="space-y-6">
      {/* Banner */}
      {activeTab === 'overview' && (
        <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl p-6 text-white shadow-lg border border-sky-400/30 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-56 h-56 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-sky-950 shadow-sm mb-3">
                👷 Contractor Operations Hub
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome, {userName}</h2>
              <p className="text-sm text-sky-100 mt-1.5 font-medium">
                Role: <span className="text-amber-300 font-bold">Government Contractor</span>
                {' '}• Manage site progress, workforce, materials, and submit payment bills.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 flex-wrap">
              <button className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                + Update Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing */}
      {activeTab === 'overview' && <TabOverview />}
      {activeTab === 'projects' && <TabProjects />}
      {activeTab === 'updates' && <TabUpdates />}
      {activeTab === 'tasks' && <TabTasks />}
      {activeTab === 'materials' && <TabMaterials />}
      {activeTab === 'workforce' && <TabWorkforce />}
      {activeTab === 'equipment' && <TabEquipment />}
      {activeTab === 'documents' && <TabDocuments />}
      {activeTab === 'tenders' && <TabTenders />}
      {activeTab === 'bills' && <TabBills />}
      {activeTab === 'notifications' && <TabNotifications />}
      {activeTab === 'settings' && <TabSettings />}
    </div>
  );
}

export default Contractor;
