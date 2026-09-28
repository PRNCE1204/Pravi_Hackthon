import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';
import { getProjects, createProject, uploadTender, selectBid } from '../../services/projectService';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA (Preserved as requested)
════════════════════════════════════════════════════════════════ */
const KPI_DATA = {
  activeProjects: 42,
  pendingApprovals: 15,
  newComplaints: 8,
  delayedProjects: 3,
  budgetUtilization: '68%',
  pendingInspections: 12
};

const DUMMY_PROJECTS = [
  { _id: 'dummy1', projectId: 'RD-2026-001', title: 'NH-48 Highway Repair', location: 'Sector 5 to 12', status: 'In Progress', contractor: 'Bharat Infratech', progress: 68 },
  { _id: 'dummy2', projectId: 'WT-2026-042', title: 'Sewage Line Upgrade', location: 'Zone B North', status: 'In Progress', contractor: 'CivTech Solutions', progress: 42 },
  { _id: 'dummy3', projectId: 'PW-2026-015', title: 'Solar Street Lights', location: 'City Center', status: 'Delayed', contractor: 'BrightPath', progress: 15 },
  { _id: 'dummy4', projectId: 'PK-2026-088', title: 'Central Park Reno', location: 'Downtown', status: 'Completed', contractor: 'GreenBuild Corp', progress: 100 },
];

const DUMMY_TENDERS = [
  { _id: 'dummyT1', projectId: 'TND-2026-101', title: 'Road Resurfacing Phase 3', budget: '₹12 Cr', deadline: '2026-10-15', status: 'Open', bids: [{_id: 'b1', companyName: 'L&T', bidAmount: '₹11.5 Cr', status: 'Pending'}] },
  { _id: 'dummyT2', projectId: 'TND-2026-102', title: 'Smart City CCTV Grid', budget: '₹8.5 Cr', deadline: '2026-10-01', status: 'Reviewing Bids', bids: [] },
  { _id: 'dummyT3', projectId: 'TND-2026-095', title: 'Public Hospital Renovation', budget: '₹22 Cr', deadline: '2026-09-20', status: 'Awarded', bids: [] },
];

const COMPLAINTS = [
  { id: 'C-205', citizen: 'Riya Shah', category: 'Road Damage', priority: 'High', status: 'Pending', date: '2026-09-28' },
  { id: 'C-206', citizen: 'Arjun Mehta', category: 'Water Supply', priority: 'Critical', status: 'Under Review', date: '2026-09-27' },
  { id: 'C-207', citizen: 'Neha Verma', category: 'Street Lights', priority: 'Medium', status: 'Resolved', date: '2026-09-26' },
];

const CONTRACTORS = [
  { name: 'Bharat Infratech', projects: 4, rating: '4.8/5', completed: 12, contact: 'contact@bharat.in' },
  { name: 'CivTech Solutions', projects: 2, rating: '4.2/5', completed: 8, contact: 'info@civtech.com' },
  { name: 'L&T Construction', projects: 6, rating: '4.9/5', completed: 45, contact: 'projects@lnt.com' },
];

const ENGINEERS = [
  { id: 'ENG-101', name: 'Neha Verma', assignedProjects: ['NH-48 Highway Repair'], pendingInspections: 2, dept: 'Civil QC' },
  { id: 'ENG-102', name: 'Rajesh Kumar', assignedProjects: ['Sewage Line Upgrade', 'Solar Street Lights'], pendingInspections: 5, dept: 'Public Works' },
];

const INSPECTIONS = [
  { id: 'INS-401', project: 'NH-48 Highway Repair', engineer: 'Neha Verma', status: 'Pending Review', date: '2026-09-28', flags: 1 },
  { id: 'INS-402', project: 'Sewage Line Upgrade', engineer: 'Rajesh Kumar', status: 'Approved', date: '2026-09-25', flags: 0 },
];

const FUND_REQUESTS = [
  { id: 'REQ-101', project: 'NH-48 Highway Repair', requested: '₹25 Lakh', status: 'Finance Review', date: '2026-09-28' },
  { id: 'REQ-102', project: 'Sewage Line Upgrade', requested: '₹12 Lakh', status: 'Draft', date: '2026-09-27' },
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
        <StatCard title="Pending Approvals" value={KPI_DATA.pendingApprovals} icon="✅" accentColor="amber" />
        <StatCard title="New Complaints" value={KPI_DATA.newComplaints} icon="📋" accentColor="rose" />
        <StatCard title="Delayed Projects" value={KPI_DATA.delayedProjects} icon="⚠️" accentColor="rose" />
        <StatCard title="Budget Utilized" value={KPI_DATA.budgetUtilization} icon="💰" accentColor="emerald" />
        <StatCard title="Pending Inspections" value={KPI_DATA.pendingInspections} icon="🔍" accentColor="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-extrabold text-sky-950">Recent Activity Timeline</h3>
            <button className="text-xs font-bold text-sky-600">View All</button>
          </div>
          <div className="space-y-4 border-l-2 border-sky-100 ml-3">
            {[
              { time: '12:45 PM', text: 'Fund request REQ-101 sent to Finance', icon: '💸' },
              { time: '11:00 AM', text: 'New complaint C-205 received (Road Damage)', icon: '📋' },
              { time: '10:30 AM', text: 'Engineer Neha Verma submitted inspection INS-401', icon: '🔍' },
              { time: '09:15 AM', text: 'NH-48 Project Phase 2 approved', icon: '✅' },
            ].map((act, i) => (
              <div key={i} className="relative pl-6 pb-2">
                <span className="absolute -left-[17px] top-0 bg-white p-1 rounded-full border border-sky-200 shadow-sm text-xs">{act.icon}</span>
                <p className="text-sm font-bold text-slate-800">{act.text}</p>
                <p className="text-[10px] text-slate-500 font-bold">{act.time} • Today</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow flex items-center justify-center gap-2">
              <span>🏗️</span> Create New Project
            </button>
            <button className="w-full py-3 bg-amber-400 text-sky-950 font-bold rounded-xl hover:bg-amber-500 transition shadow flex items-center justify-center gap-2">
              <span>✅</span> Review Approvals
            </button>
            <button className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition shadow flex items-center justify-center gap-2">
              <span>💰</span> Request Funds
            </button>
            <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow flex items-center justify-center gap-2">
              <span>📋</span> View Complaints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Project Management (LIVE + DUMMY COMBINED)
function TabProjects({ projects, reload }) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', department: 'Roads', location: '', budget: '', deadline: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createProject(formData);
      setShowCreate(false);
      reload();
    } catch (err) {
      alert('Error creating project');
    }
  };

  // Combine Live and Dummy Data
  const allProjects = [...projects, ...DUMMY_PROJECTS];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-extrabold text-sky-950">Project Management</h2>
          <p className="text-sm text-slate-500">Manage all department projects, timelines, and progress.</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">+ New Project</button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
              <th className="p-4">Project</th>
              <th className="p-4">Location</th>
              <th className="p-4">Contractor</th>
              <th className="p-4">Status</th>
              <th className="p-4 w-48">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allProjects.map(proj => (
              <tr key={proj._id} onClick={() => setSelectedProject(proj)} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{proj.title}</div>
                  <div className="text-[10px] font-mono text-sky-600">{proj.projectId}</div>
                </td>
                <td className="p-4 text-sm text-slate-600">{proj.location}</td>
                <td className="p-4 text-sm font-bold text-slate-700">{proj.contractor || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                    proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                    proj.status === 'Delayed' ? 'bg-rose-100 text-rose-800' : 
                    proj.status === 'Project Created' || proj.status === 'Pending Approval' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-800'
                  }`}>{proj.status}</span>
                </td>
                <td className="p-4"><ProgressBar value={proj.progress || 0} max={100} size="sm" colorVariant={proj.status === 'Delayed' ? 'rose' : 'emerald'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-sky-950/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6">
            <h3 className="text-xl font-extrabold text-sky-950 mb-4">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Title</label><input required className="w-full border p-2 rounded" onChange={e=>setFormData({...formData, title: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Description</label><textarea required className="w-full border p-2 rounded" onChange={e=>setFormData({...formData, description: e.target.value})}></textarea></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Location</label><input required className="w-full border p-2 rounded" onChange={e=>setFormData({...formData, location: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Budget</label><input required className="w-full border p-2 rounded" placeholder="e.g. ₹5 Cr" onChange={e=>setFormData({...formData, budget: e.target.value})} /></div>
              <div><label className="block text-xs font-bold text-slate-600 mb-1">Deadline</label><input type="date" required className="w-full border p-2 rounded" onChange={e=>setFormData({...formData, deadline: e.target.value})} /></div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 bg-slate-100 font-bold rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-bold rounded">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. Tender Management (LIVE + DUMMY COMBINED)
function TabTenders({ projects, reload }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [tenderFile, setTenderFile] = useState(null);

  const handleUploadTender = async (id, e) => {
    e.stopPropagation();
    if (!tenderFile) return alert("Select a PDF file first");
    const fd = new FormData();
    fd.append('tenderDocument', tenderFile);
    await uploadTender(id, fd);
    setTenderFile(null);
    reload();
  };

  const handleSelectBid = async (projectId, bidId) => {
    await selectBid(projectId, bidId);
    reload();
    setSelectedProject(null);
  };

  // Combine live active tenders with dummy tenders
  const liveTenders = projects.filter(p => p.status !== 'Project Created' && p.status !== 'Planning');
  const allTenders = [...liveTenders, ...DUMMY_TENDERS];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Tender Management</h2>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Project ID / Title</th>
              <th className="p-4">Est. Budget</th>
              <th className="p-4">Bids</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {projects.filter(p => p.status === 'Project Created').map(t => (
               <tr key={t._id} className="bg-amber-50 hover:bg-amber-100">
                 <td className="p-4">
                   <div className="font-bold text-slate-800">{t.title}</div>
                   <div className="text-[10px] font-mono text-slate-500">{t.projectId}</div>
                 </td>
                 <td className="p-4 font-black text-amber-600">{t.budget}</td>
                 <td className="p-4 text-sm font-bold text-slate-400">Not Uploaded</td>
                 <td className="p-4"><span className="px-2 py-1 bg-amber-200 text-amber-800 text-[10px] font-bold rounded">{t.status}</span></td>
                 <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input type="file" onChange={e => setTenderFile(e.target.files[0])} className="text-[10px] w-24" />
                      <button onClick={(e) => handleUploadTender(t._id, e)} className="px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded">Upload Tender</button>
                    </div>
                 </td>
               </tr>
            ))}
            {allTenders.map(t => (
              <tr key={t._id} className="hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedProject(t)}>
                <td className="p-4">
                  <div className="font-bold text-slate-800">{t.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">{t.projectId}</div>
                </td>
                <td className="p-4 font-black text-amber-600">{t.budget}</td>
                <td className="p-4 text-sm font-bold text-sky-600">{t.bids?.length || 0} Bids</td>
                <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">{t.status}</span></td>
                <td className="p-4">
                  {(t.status === 'Tender Open' || t.status === 'Contractor Pending Approval') && (
                    <button className="px-2 py-1 bg-sky-500 text-white text-[10px] font-bold rounded">View Bids</button>
                  )}
                  {t.status === 'Open' && (
                    <button className="px-2 py-1 bg-sky-500 text-white text-[10px] font-bold rounded">View Bids</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedProject && selectedProject.bids && selectedProject.bids.length > 0 && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-sky-950/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-sky-900 text-white flex justify-between">
              <h3 className="text-xl font-extrabold">Bids for {selectedProject.projectId}</h3>
              <button onClick={() => setSelectedProject(null)} className="text-sky-200 text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              {selectedProject.bids.map(bid => (
                <div key={bid._id} className="border border-slate-200 p-4 rounded-xl flex justify-between items-center bg-slate-50">
                  <div>
                    <h4 className="font-extrabold text-sky-950">{bid.companyName}</h4>
                    <p className="text-sm font-bold text-amber-600">Bid Amount: {bid.bidAmount}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-1">Status: {bid.status}</p>
                  </div>
                  <div>
                    {(selectedProject.status === 'Tender Open' || selectedProject.status === 'Open') && bid.status === 'Pending' && (
                      <button onClick={() => handleSelectBid(selectedProject._id, bid._id)} className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 shadow">Approve Bid</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 3. Complaints & Citizen Requests
function TabComplaints() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Complaints & Citizen Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMPLAINTS.map(comp => (
          <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-1 rounded font-bold border border-sky-100">{comp.id}</span>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${comp.priority === 'Critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>{comp.priority}</span>
            </div>
            <h4 className="font-extrabold text-sky-950 mb-1">{comp.category}</h4>
            <p className="text-xs text-slate-500 mb-4">Reported by: {comp.citizen}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">{comp.status}</span>
              <button className="text-xs font-bold text-sky-600 hover:text-sky-800">Review →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Contractor Management
function TabContractors() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Contractor Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {CONTRACTORS.map(c => (
          <div key={c.name} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm text-center">
            <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 border-2 border-sky-200 font-black">
              {c.name.charAt(0)}
            </div>
            <h3 className="font-extrabold text-sky-950 mb-1">{c.name}</h3>
            <p className="text-xs text-amber-500 font-bold mb-4">⭐ {c.rating} Rating</p>
            <div className="grid grid-cols-2 gap-2 text-left mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Active</p>
                <p className="text-sm font-black text-slate-700">{c.projects} Projects</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Completed</p>
                <p className="text-sm font-black text-slate-700">{c.completed} Projects</p>
              </div>
            </div>
            <button className="w-full py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200">View Profile</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Engineer Assignments
function TabEngineers() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Engineer Assignments</h2>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Engineer</th>
              <th className="p-4">Department</th>
              <th className="p-4">Assigned Projects</th>
              <th className="p-4">Pending Inspections</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {ENGINEERS.map(eng => (
              <tr key={eng.id}>
                <td className="p-4"><div className="font-bold text-slate-800">{eng.name}</div><div className="text-[10px] font-mono text-slate-500">{eng.id}</div></td>
                <td className="p-4 text-sm text-slate-600">{eng.dept}</td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {eng.assignedProjects.map((p, i) => <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">{p}</span>)}
                  </div>
                </td>
                <td className="p-4 font-black text-rose-500">{eng.pendingInspections}</td>
                <td className="p-4"><button className="text-xs font-bold text-sky-600 hover:underline">Reassign</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 7. Inspections & Quality
function TabInspections() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Inspections & Quality Reviews</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {INSPECTIONS.map(ins => (
          <div key={ins.id} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 px-2 py-1 rounded border border-sky-200">{ins.id}</span>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${ins.flags > 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                {ins.flags > 0 ? `${ins.flags} Flags` : 'Clear'}
              </span>
            </div>
            <h3 className="font-extrabold text-sky-950 mb-1">{ins.project}</h3>
            <p className="text-xs text-slate-500 mb-4">Inspected by: {ins.engineer} on {ins.date}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg hover:bg-emerald-100">Approve</button>
              <button className="px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs rounded-lg hover:bg-slate-100">View Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Budget & Fund Requests
function TabFunds() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Budget & Fund Requests</h2>
        <button className="px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600">+ Create Request</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Request ID</th>
              <th className="p-4">Project</th>
              <th className="p-4">Requested Amt</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {FUND_REQUESTS.map(req => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="p-4 text-[10px] font-mono text-slate-500">{req.id}</td>
                <td className="p-4 text-sm font-bold text-slate-800">{req.project}</td>
                <td className="p-4 font-black text-amber-600">{req.requested}</td>
                <td className="p-4"><span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold rounded">{req.status}</span></td>
                <td className="p-4 text-xs text-slate-500">{req.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 9. Documents
function TabDocuments() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center py-20 bg-white border border-slate-200 rounded-xl border-dashed">
      <div className="text-5xl mb-4">📁</div>
      <h2 className="text-xl font-extrabold text-sky-950">Document Repository</h2>
      <p className="text-sm text-slate-500 mb-4 text-center max-w-md">Upload and manage project proposals, tender documents, contracts, and certificates in one centralized location.</p>
      <button className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700 shadow flex gap-2 items-center"><span>📤</span> Upload Document</button>
    </div>
  );
}

// 10. Reports & Analytics
function TabReports() {
  const reports = ['Project Status Report', 'Complaint Resolution Analytics', 'Contractor Performance Index', 'Budget Utilization Summary'];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Reports & Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center text-xl">📊</div>
              <div><h4 className="font-extrabold text-sky-900">{r}</h4></div>
            </div>
            <button className="text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-100">Generate PDF</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 11. Notifications
function TabNotifications() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Important Notifications</h2>
      <div className="space-y-3">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-rose-900">High Priority Complaint: C-205</h4>
          <p className="text-xs text-rose-700 mt-1">Severe road damage reported in Sector 5. Action required within 24h.</p>
        </div>
      </div>
    </div>
  );
}

// 12. Profile & Settings
function TabSettings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-extrabold text-sky-950">Profile & Settings</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label><input type="text" disabled value="Department Officer" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" /></div>
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Employee ID</label><input type="text" disabled value="OFF-3904" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" /></div>
        <div className="pt-4"><button className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save Changes</button></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN OFFICER COMPONENT
════════════════════════════════════════════════════════════════ */
function Officer() {
  const { user } = useAuth();
  const userName = user?.name || 'Department Officer';
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.data.projects);
    } catch (err) {
      console.error('Failed to fetch live projects');
    }
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 3000); // Live Polling
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      {activeTab === 'overview' && (
        <div className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-sky-800 rounded-2xl p-6 text-white shadow-lg border border-sky-400/30 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-56 h-56 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-sky-950 shadow-sm mb-3">
                🏛️ Department Command Center
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome, {userName}</h2>
              <p className="text-sm text-sky-100 mt-1.5 font-medium">
                Live Tender Workflow is Active!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Routing */}
      {activeTab === 'overview' && <TabOverview />}
      {activeTab === 'projects' && <TabProjects projects={projects} reload={fetchProjects} />}
      {activeTab === 'tenders' && <TabTenders projects={projects} reload={fetchProjects} />}
      {activeTab === 'complaints' && <TabComplaints />}
      {activeTab === 'contractors' && <TabContractors />}
      {activeTab === 'engineers' && <TabEngineers />}
      {activeTab === 'inspections' && <TabInspections />}
      {activeTab === 'funds' && <TabFunds />}
      {activeTab === 'documents' && <TabDocuments />}
      {activeTab === 'reports' && <TabReports />}
      {activeTab === 'notifications' && <TabNotifications />}
      {activeTab === 'settings' && <TabSettings />}
    </div>
  );
}

export default Officer;
