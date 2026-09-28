import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════════════════════ */
const KPI_DATA = {
  assignedProjects: 8,
  todaysInspections: 3,
  pendingReports: 4,
  approvedInspections: 42,
  issuesRaised: 6,
  completedVisits: 2
};

const SCHEDULE = [
  { time: '09:00 AM', project: 'NH-48 Highway Repair', location: 'Sector 5', priority: 'High', status: 'Completed' },
  { time: '11:30 AM', project: 'Sewage Line Upgrade', location: 'Zone B North', priority: 'Medium', status: 'Completed' },
  { time: '02:00 PM', project: 'Solar Street Lights', location: 'City Center', priority: 'Critical', status: 'Pending' },
];

const PROJECTS = [
  { id: 'RD-2026-001', name: 'NH-48 Highway Repair', location: 'Sector 5 to 12', progress: 68, contractor: 'Bharat Infratech', nextInspection: 'Today', status: 'Active' },
  { id: 'WT-2026-042', name: 'Sewage Line Upgrade', location: 'Zone B North', progress: 42, contractor: 'CivTech Solutions', nextInspection: 'Tomorrow', status: 'Active' },
  { id: 'PW-2026-015', name: 'Solar Street Lights', location: 'City Center', progress: 15, contractor: 'BrightPath', nextInspection: 'Today', status: 'Delayed' },
  { id: 'PK-2026-088', name: 'Central Park Reno', location: 'Downtown', progress: 100, contractor: 'GreenBuild Corp', nextInspection: 'Completed', status: 'Completed' },
];

const INSPECTIONS = [
  { id: 'INS-401', project: 'NH-48 Highway Repair', status: 'Draft', date: '2026-09-28' },
  { id: 'INS-402', project: 'Solar Street Lights', status: 'Scheduled', date: '2026-09-28' },
  { id: 'INS-398', project: 'Sewage Line Upgrade', status: 'Pending Approval', date: '2026-09-27' },
  { id: 'INS-390', project: 'Central Park Reno', status: 'Approved', date: '2026-09-22' },
];

const ISSUES = [
  { id: 'ISS-042', project: 'Solar Street Lights', category: 'Missing Equipment', severity: 'High', status: 'Open', date: '2026-09-28' },
  { id: 'ISS-041', project: 'Sewage Line Upgrade', category: 'Poor Material Quality', severity: 'Medium', status: 'Resolved', date: '2026-09-25' },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════════════════════════════ */

// 1. Dashboard (Overview)
function TabOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Assigned Projects" value={KPI_DATA.assignedProjects} icon="🏗️" accentColor="sky" />
        <StatCard title="Today's Inspections" value={KPI_DATA.todaysInspections} icon="📅" accentColor="amber" />
        <StatCard title="Pending Reports" value={KPI_DATA.pendingReports} icon="⏳" accentColor="rose" />
        <StatCard title="Approved Inspections" value={KPI_DATA.approvedInspections} icon="✅" accentColor="emerald" />
        <StatCard title="Issues Raised" value={KPI_DATA.issuesRaised} icon="⚠️" accentColor="rose" />
        <StatCard title="Completed Visits" value={KPI_DATA.completedVisits} icon="📍" accentColor="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Today's Schedule</h3>
          <div className="space-y-3">
            {SCHEDULE.map((sch, i) => (
              <div key={i} className={`p-4 rounded-xl border flex items-center justify-between ${sch.status === 'Completed' ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-sky-100 shadow-sm'}`}>
                <div className="flex gap-4 items-center">
                  <div className="w-16 text-center shrink-0">
                    <p className="text-sm font-black text-sky-900">{sch.time.split(' ')[0]}</p>
                    <p className="text-[10px] font-bold text-slate-500">{sch.time.split(' ')[1]}</p>
                  </div>
                  <div className="border-l-2 border-slate-200 pl-4">
                    <h4 className="font-extrabold text-sky-950">{sch.project}</h4>
                    <p className="text-xs text-slate-500 font-medium">📍 {sch.location}</p>
                  </div>
                </div>
                <div>
                  {sch.status === 'Completed' 
                    ? <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-200">✅ Completed</span>
                    : <button className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700">Start Visit</button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow flex items-center justify-center gap-2">
              <span>🔍</span> Start Inspection
            </button>
            <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow flex items-center justify-center gap-2">
              <span>📈</span> Upload Progress
            </button>
            <button className="w-full py-3 bg-rose-50 text-rose-700 font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition shadow flex items-center justify-center gap-2">
              <span>⚠️</span> Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Assigned Projects
function TabProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Assigned Projects</h2>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
              <th className="p-4">Project</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4">Progress</th>
              <th className="p-4">Next Inspection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PROJECTS.map(proj => (
              <tr key={proj.id} onClick={() => setSelectedProject(proj)} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{proj.name}</div>
                  <div className="text-[10px] font-mono text-sky-600">{proj.id}</div>
                </td>
                <td className="p-4 text-sm text-slate-600">{proj.location}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                    proj.status === 'Delayed' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                  }`}>{proj.status}</span>
                </td>
                <td className="p-4 w-32"><ProgressBar value={proj.progress} max={100} size="sm" colorVariant={proj.status === 'Delayed' ? 'rose' : 'emerald'} /></td>
                <td className="p-4 text-xs font-bold text-slate-600">{proj.nextInspection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-sky-950/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-sky-900 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-extrabold">{selectedProject.name}</h3>
                <p className="text-sm text-sky-200 mt-1">{selectedProject.id} • {selectedProject.location}</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-sky-200 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Contractor</p>
                  <p className="text-sm font-bold text-sky-900">{selectedProject.contractor}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Current Progress</p>
                  <p className="text-xl font-black text-emerald-600">{selectedProject.progress}%</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700">🔍 Open Inspection</button>
                <button className="flex-1 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 hover:bg-emerald-100">📈 Upload Progress</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Site Inspections
function TabInspections() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Site Inspections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {INSPECTIONS.map(ins => (
          <div key={ins.id} className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-1 rounded font-bold">{ins.id}</span>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${ins.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{ins.status}</span>
            </div>
            <h4 className="font-extrabold text-sky-950 mb-1">{ins.project}</h4>
            <p className="text-xs text-slate-500 mb-4">Date: {ins.date}</p>
            {ins.status !== 'Approved' && (
              <button className="w-full py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 text-xs shadow">Fill Inspection Form →</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Quality Checklist
function TabQuality() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Dynamic Quality Checklist</h2>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">Select Project Template</label>
          <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
            <option>Road Project Checklist</option>
            <option>Building Project Checklist</option>
          </select>
        </div>
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {['Road thickness verified (>150mm)', 'Asphalt quality acceptable', 'Surface level gradient correct', 'Drainage functioning properly', 'Safety signs & diversions installed'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-sky-50 border border-sky-100 rounded-lg">
              <span className="text-sm font-bold text-sky-900">{item}</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition">Pass</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition">Fail</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-500 mb-2">Engineer Remarks (Technical Observations)</label>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" placeholder="Enter specific observations here..."></textarea>
        </div>
        <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow">Save Checklist</button>
      </div>
    </div>
  );
}

// 5. Progress Updates
function TabProgress() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-extrabold text-sky-950">Update Progress</h2>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">Target Project</label>
          <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
            <option>NH-48 Highway Repair</option>
            <option>Sewage Line Upgrade</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">New Progress Percentage (%)</label>
          <input type="range" min="0" max="100" defaultValue="68" className="w-full accent-emerald-500" />
          <div className="text-center text-xl font-black text-emerald-600 mt-2">68%</div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">Work Completed Today</label>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-16" placeholder="Briefly describe what was finished..."></textarea>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2">GPS Validated Evidence (Photos/Videos)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
            <span className="text-3xl mb-2 block">📷</span>
            <p className="text-sm font-bold text-slate-600">Click to capture or upload evidence</p>
            <p className="text-[10px] text-slate-400 mt-1">Photos will be watermarked with GPS & Timestamp</p>
          </div>
        </div>
        <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow">Submit Progress Update</button>
      </div>
    </div>
  );
}

// 6. Issue Reporting
function TabIssues() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Issue Reporting</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {ISSUES.map(iss => (
            <div key={iss.id} className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm border-l-4 border-l-rose-500">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-extrabold text-sky-950">{iss.category}</h4>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded font-bold border border-rose-200">{iss.severity}</span>
              </div>
              <p className="text-xs font-bold text-slate-600 mb-1">{iss.project}</p>
              <p className="text-[10px] text-slate-500 mb-3">{iss.date} • {iss.id}</p>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${iss.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{iss.status}</span>
            </div>
          ))}
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h3 className="font-extrabold text-sky-950 mb-4">Report New Issue</h3>
          <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
            <option>Select Project</option>
            <option>NH-48 Highway Repair</option>
          </select>
          <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
            <option>Poor Material Quality</option>
            <option>Safety Violation</option>
            <option>Contractor Delay</option>
          </select>
          <select className="w-full bg-rose-50 border border-rose-200 p-2 rounded-lg text-sm font-bold text-rose-900">
            <option>Severity: High</option>
            <option>Severity: Critical</option>
          </select>
          <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-20" placeholder="Describe the issue..."></textarea>
          <button className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow">Raise Issue ⚠️</button>
        </div>
      </div>
    </div>
  );
}

// 7. Documents & Photos
function TabDocuments() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
      <div className="text-5xl mb-4">📸</div>
      <h2 className="text-xl font-extrabold text-sky-950">Field Media Repository</h2>
      <p className="text-sm text-slate-500 mb-4 text-center max-w-md">All uploaded site photos are automatically tagged with GPS coordinates, timestamps, and Project IDs for immutable evidence.</p>
      <button className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 shadow flex gap-2 items-center"><span>📤</span> Upload Media</button>
    </div>
  );
}

// 8. Inspection History
function TabHistory() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Inspection History</h2>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Project</th>
              <th className="p-4">Result</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[...INSPECTIONS].reverse().map(ins => (
              <tr key={ins.id} className="hover:bg-slate-50">
                <td className="p-4 text-xs font-bold text-slate-600">{ins.date}</td>
                <td className="p-4 font-bold text-slate-800">{ins.project}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] font-bold ${ins.status.includes('Approve') ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>{ins.status}</span></td>
                <td className="p-4 text-center"><button className="text-xs font-bold text-sky-600 hover:underline">View Report</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 9. Notifications
function TabNotifications() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Notifications</h2>
      <div className="space-y-3">
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-sky-900">New Inspection Assigned</h4>
          <p className="text-xs text-sky-700 mt-1">You have been assigned to inspect 'Slum Redevelopment Ph-1' by tomorrow.</p>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-amber-900">Officer Requested Re-inspection</h4>
          <p className="text-xs text-amber-700 mt-1">INS-398 for Sewage Line Upgrade requires additional photos of the culvert.</p>
        </div>
      </div>
    </div>
  );
}

// 10. Profile & Settings
function TabSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-extrabold text-sky-950">Profile & Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Name</label><input type="text" disabled value="Field Engineer" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" /></div>
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Designation</label><input type="text" disabled value="Civil QC Inspector" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" /></div>
        <div className="pt-4"><button className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save Preferences</button></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN ENGINEER COMPONENT
════════════════════════════════════════════════════════════════ */
function Engineer() {
  const { user } = useAuth();
  const userName = user?.name || 'Field Engineer';
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
                📐 Site Engineering & QC
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome, {userName}</h2>
              <p className="text-sm text-sky-100 mt-1.5 font-medium">
                Role: <span className="text-amber-300 font-bold">Engineer</span>
                {' '}• Perform site visits, enforce quality checklists, update progress, and report structural issues.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 flex-wrap">
              <button className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                + New Inspection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing */}
      {activeTab === 'overview' && <TabOverview />}
      {activeTab === 'projects' && <TabProjects />}
      {activeTab === 'inspections' && <TabInspections />}
      {activeTab === 'quality' && <TabQuality />}
      {activeTab === 'progress' && <TabProgress />}
      {activeTab === 'issues' && <TabIssues />}
      {activeTab === 'documents' && <TabDocuments />}
      {activeTab === 'history' && <TabHistory />}
      {activeTab === 'notifications' && <TabNotifications />}
      {activeTab === 'settings' && <TabSettings />}
    </div>
  );
}

export default Engineer;
