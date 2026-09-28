import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════════════════════ */
const KPI_DATA = {
  totalBudget: '₹500 Cr',
  remaining: '₹142 Cr',
  releasedThisMonth: '₹38 Cr',
  pendingRequests: '14',
  pendingApprovals: '8',
  emergencyFund: '₹25 Cr'
};

const DEPARTMENTS_BUDGET = [
  { id: 1, name: 'Roads & Transport', total: 150, used: 98, remaining: 52 },
  { id: 2, name: 'Water & Sanitation', total: 120, used: 85, remaining: 35 },
  { id: 3, name: 'Power & Energy', total: 90, used: 40, remaining: 50 },
  { id: 4, name: 'Parks & Recreation', total: 40, used: 38, remaining: 2 },
  { id: 5, name: 'Education & Schools', total: 80, used: 25, remaining: 55 },
  { id: 6, name: 'Health & Hospitals', total: 200, used: 160, remaining: 40 },
  { id: 7, name: 'Urban Development', total: 300, used: 210, remaining: 90 },
  { id: 8, name: 'Public Housing', total: 110, used: 105, remaining: 5 },
];

const FUND_REQUESTS = [
  { id: 'REQ-101', project: 'NH-48 Repair', dept: 'Roads', contractor: 'Bharat Infratech', amount: '₹25 Lakh', status: 'Pending', requestedBy: 'Officer Ramesh', date: '2026-09-28' },
  { id: 'REQ-102', project: 'Sewage Line A', dept: 'Water', contractor: 'CivTech Solutions', amount: '₹12 Lakh', status: 'Pending', requestedBy: 'Officer Suresh', date: '2026-09-27' },
  { id: 'REQ-103', project: 'Solar Lights', dept: 'Power', contractor: 'BrightPath', amount: '₹8 Lakh', status: 'Clarification Needed', requestedBy: 'Officer Dinesh', date: '2026-09-26' },
  { id: 'REQ-104', project: 'City Hospital Wing C', dept: 'Health', contractor: 'L&T Construction', amount: '₹1.5 Cr', status: 'Pending', requestedBy: 'Dr. Mehta', date: '2026-09-26' },
  { id: 'REQ-105', project: 'Primary School Reno', dept: 'Education', contractor: 'GreenBuild Corp', amount: '₹4.5 Lakh', status: 'Pending', requestedBy: 'Officer Anita', date: '2026-09-25' },
  { id: 'REQ-106', project: 'Slum Redevelopment', dept: 'Housing', contractor: 'Awas Yojna Builders', amount: '₹3.2 Cr', status: 'Rejected', requestedBy: 'Officer Prakash', date: '2026-09-24' },
  { id: 'REQ-107', project: 'Metro Pillar 45-90', dept: 'Urban Dev', contractor: 'MMRDA Works', amount: '₹5.0 Cr', status: 'Pending', requestedBy: 'Officer Raj', date: '2026-09-24' },
];

const PAYMENT_HISTORY = [
  { id: 'PAY-501', project: 'Metro Link Phase 2', amount: '₹2.5 Cr', date: '2026-09-25', status: 'Completed', contractor: 'MMRDA Works' },
  { id: 'PAY-502', project: 'City Park Reno', amount: '₹15 Lakh', date: '2026-09-22', status: 'Completed', contractor: 'GreenBuild Corp' },
  { id: 'PAY-503', project: 'Smart Meters', amount: '₹45 Lakh', date: '2026-09-20', status: 'Completed', contractor: 'TechGrid Solutions' },
  { id: 'PAY-504', project: 'Govt School Lab', amount: '₹8.5 Lakh', date: '2026-09-18', status: 'Completed', contractor: 'EduInfra Ltd' },
  { id: 'PAY-505', project: 'Highway Toll Booths', amount: '₹1.2 Cr', date: '2026-09-15', status: 'Completed', contractor: 'Bharat Infratech' },
  { id: 'PAY-506', project: 'Water Pumping Station', amount: '₹85 Lakh', date: '2026-09-10', status: 'Completed', contractor: 'CivTech Solutions' },
  { id: 'PAY-507', project: 'Medical Equipment Supply', amount: '₹3.8 Cr', date: '2026-09-05', status: 'Completed', contractor: 'PharmaTech India' },
  { id: 'PAY-508', project: 'CCTV Surveillance Grid', amount: '₹62 Lakh', date: '2026-09-01', status: 'Completed', contractor: 'SecureVision Systems' },
];

const INVOICES = [
  { id: 'INV-9021', contractor: 'Bharat Infratech', project: 'NH-48 Repair', amount: '₹25 Lakh', date: '2026-09-28', status: 'Pending' },
  { id: 'INV-9022', contractor: 'CivTech Solutions', project: 'Sewage Line A', amount: '₹12 Lakh', date: '2026-09-27', status: 'Verified' },
  { id: 'INV-9023', contractor: 'L&T Construction', project: 'City Hospital Wing C', amount: '₹1.5 Cr', date: '2026-09-26', status: 'Pending' },
  { id: 'INV-9024', contractor: 'GreenBuild Corp', project: 'Primary School Reno', amount: '₹4.5 Lakh', date: '2026-09-25', status: 'Verified' },
  { id: 'INV-9025', contractor: 'MMRDA Works', project: 'Metro Pillar 45-90', amount: '₹5.0 Cr', date: '2026-09-24', status: 'Rejected' },
  { id: 'INV-9026', contractor: 'TechGrid Solutions', project: 'Smart Meters Phase 3', amount: '₹22 Lakh', date: '2026-09-23', status: 'Verified' },
  { id: 'INV-9027', contractor: 'Awas Yojna Builders', project: 'Slum Redevelopment', amount: '₹3.2 Cr', date: '2026-09-22', status: 'Pending' },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════════════════════════════ */

// 1. Dashboard (Overview)
function TabOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Allocated" value={KPI_DATA.totalBudget} icon="💰" accentColor="sky" />
        <StatCard title="Budget Remaining" value={KPI_DATA.remaining} icon="🏦" accentColor="emerald" />
        <StatCard title="Released This Mth" value={KPI_DATA.releasedThisMonth} icon="💸" accentColor="sky" />
        <StatCard title="Pending Requests" value={KPI_DATA.pendingRequests} icon="⏳" accentColor="amber" />
        <StatCard title="Pending Approvals" value={KPI_DATA.pendingApprovals} icon="⚠️" accentColor="rose" />
        <StatCard title="Emergency Fund" value={KPI_DATA.emergencyFund} icon="🛡️" accentColor="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-sm p-5">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Summary & Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
              <span className="text-sm font-bold text-sky-900">Projects Waiting for Payment</span>
              <span className="text-lg font-extrabold text-amber-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
              <span className="text-sm font-bold text-sky-900">Total Value Awaiting Approval</span>
              <span className="text-lg font-extrabold text-amber-600">₹4.8 Cr</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sky-50 rounded-lg">
              <span className="text-sm font-bold text-sky-900">Overall Budget Utilization</span>
              <span className="text-lg font-extrabold text-emerald-600">71.6%</span>
            </div>
          </div>
          
          <h4 className="text-xs font-extrabold text-slate-500 uppercase mt-6 mb-3">Recent Financial Activity</h4>
          <div className="space-y-3 pl-2 border-l-2 border-sky-100">
            {PAYMENT_HISTORY.slice(0,2).map(pay => (
              <div key={pay.id} className="relative pl-4">
                <span className="absolute -left-1.5 top-1.5 w-2 h-2 bg-emerald-400 rounded-full"></span>
                <p className="text-sm font-bold text-slate-800">Funds Released: {pay.amount} for {pay.project}</p>
                <p className="text-xs text-slate-500">{pay.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-5">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow">
              ✓ Review Payment Requests
            </button>
            <button className="w-full py-3 bg-amber-400 text-sky-950 font-bold rounded-xl hover:bg-amber-500 transition shadow">
              💸 Release Emergency Funds
            </button>
            <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow">
              📊 Generate Monthly Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Budget Management
function TabBudget() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-extrabold text-sky-950">Budget Management</h2>
          <p className="text-sm text-slate-500">Track allocations, usage, and remaining balance across departments.</p>
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-sky-950 outline-none">
            <option>FY 2026-27</option>
            <option>FY 2025-26</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DEPARTMENTS_BUDGET.map(dept => {
          const utilPct = Math.round((dept.used / dept.total) * 100);
          return (
            <div key={dept.id} className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm">
              <h3 className="text-lg font-extrabold text-sky-900 mb-4">{dept.name}</h3>
              <div className="grid grid-cols-3 gap-2 text-center mb-4">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Total Budget</p>
                  <p className="text-sm font-extrabold text-sky-700">₹{dept.total}Cr</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Used</p>
                  <p className="text-sm font-extrabold text-amber-600">₹{dept.used}Cr</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Remaining</p>
                  <p className="text-sm font-extrabold text-emerald-600">₹{dept.remaining}Cr</p>
                </div>
              </div>
              <ProgressBar label="Utilization" value={dept.used} max={dept.total} colorVariant={utilPct > 85 ? 'rose' : 'sky'} size="md" />
              <p className="text-right text-xs font-bold mt-1 text-slate-500">{utilPct}% Utilized</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 3. Fund Release Requests & 4. Payment Verification Modal
function TabRequests() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-sky-950">Fund Release Requests</h2>
        <p className="text-sm text-slate-500">Review, approve or reject fund requests sent by Department Officers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sky-50 border-b border-sky-100 text-xs uppercase font-extrabold text-sky-900">
              <th className="p-4">Project</th>
              <th className="p-4">Requested Amt</th>
              <th className="p-4">Department</th>
              <th className="p-4">Requested By</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {FUND_REQUESTS.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition">
                <td className="p-4 font-bold text-slate-800">{req.project}<br/><span className="text-[10px] text-sky-600 font-mono">{req.id}</span></td>
                <td className="p-4 font-extrabold text-amber-600">{req.amount}</td>
                <td className="p-4 text-sm font-medium text-slate-600">{req.dept}</td>
                <td className="p-4 text-sm font-medium text-slate-600">{req.requestedBy}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>{req.status}</span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => setSelectedRequest(req)} className="px-4 py-1.5 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 transition">Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details / Verification Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-sky-950/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 bg-sky-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold">Payment Verification: {selectedRequest.project}</h3>
                <p className="text-xs text-sky-200">{selectedRequest.id}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-sky-200 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">Requested Amount</h4>
                  <p className="text-2xl font-extrabold text-amber-600">{selectedRequest.amount}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-500 mb-1">Contractor</h4>
                  <p className="text-lg font-extrabold text-sky-900">{selectedRequest.contractor}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-extrabold text-sky-950 mb-3">Verification Checklist</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-white border border-sky-100 rounded-lg cursor-pointer hover:bg-sky-50">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">Project Approved & Budget Available</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-sky-100 rounded-lg cursor-pointer hover:bg-sky-50">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">Engineer Inspection Completed (Attached)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-white border border-sky-100 rounded-lg cursor-pointer hover:bg-sky-50">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" />
                    <span className="text-sm font-medium text-slate-700">Invoice Amount Matches Contract</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition">✅ Approve & Release Funds</button>
                <button className="px-6 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl transition border border-rose-200">Reject</button>
                <button className="px-6 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl transition border border-amber-200">Clarify</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 5. Payment History
function TabHistory() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Payment History</h2>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-sky-50 border-b border-sky-100 text-xs uppercase font-extrabold text-sky-900">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Project</th>
              <th className="p-4">Contractor</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PAYMENT_HISTORY.map(pay => (
              <tr key={pay.id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="p-4 font-mono text-xs font-bold text-sky-700">{pay.id}</td>
                <td className="p-4 text-sm font-bold text-slate-800">{pay.project}</td>
                <td className="p-4 text-sm text-slate-600">{pay.contractor}</td>
                <td className="p-4 font-extrabold text-emerald-600">{pay.amount}</td>
                <td className="p-4 text-xs text-slate-500">{pay.date}</td>
                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">✅ {pay.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 6. Department Expenditure
function TabExpenditure() {
  const maxTotal = Math.max(...DEPARTMENTS_BUDGET.map(d => d.total));
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Department Expenditure Comparison</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparative Bar Chart */}
        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-sm font-extrabold text-sky-950 mb-6 uppercase tracking-wide">Budget Allocation vs Utilization</h3>
          <div className="space-y-5">
            {DEPARTMENTS_BUDGET.map(dept => {
              const utilPct = (dept.used / dept.total) * 100;
              const totalPct = (dept.total / maxTotal) * 100;
              return (
                <div key={dept.id} className="relative">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-700">{dept.name}</span>
                    <span className="font-bold text-sky-700">₹{dept.used}Cr / ₹{dept.total}Cr</span>
                  </div>
                  {/* Total Budget Bar (Background) */}
                  <div className="h-4 bg-sky-50 rounded-full w-full overflow-hidden flex">
                    <div className="h-full bg-sky-100 relative" style={{ width: `${totalPct}%` }}>
                      {/* Utilized Bar (Foreground) */}
                      <div 
                        className={`h-full absolute left-0 top-0 rounded-full ${utilPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${utilPct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-center gap-6 text-[10px] font-bold text-slate-500">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded-sm"></span> Utilized (Healthy)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-rose-500 rounded-sm"></span> Utilized (Critical)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-sky-100 rounded-sm"></span> Allocated</div>
          </div>
        </div>

        {/* Detailed Breakdown Cards */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-sky-950 mb-2 uppercase tracking-wide">Department Insights</h3>
          {DEPARTMENTS_BUDGET.map(dept => (
            <div key={dept.id} className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between shadow-sm hover:border-sky-300 transition-colors">
              <div>
                <h4 className="font-extrabold text-sky-900">{dept.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Remaining: ₹{dept.remaining}Cr</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-amber-600">₹{dept.used}Cr</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Spent</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 7. Invoices & Bills
function TabInvoices() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Invoices & Bills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {INVOICES.map(inv => (
          <div key={inv.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded font-bold">{inv.id}</span>
                <h4 className="font-extrabold text-sky-950 mt-2">{inv.project}</h4>
              </div>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${inv.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{inv.status}</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">{inv.contractor}</p>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="font-black text-lg text-slate-800">{inv.amount}</span>
              <button className="text-xs font-bold text-sky-600 hover:text-sky-800">📄 View PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Financial Reports
function TabReports() {
  const reports = ['Monthly Budget Report', 'Department Spending Report', 'Project Payment Report', 'Annual Financial Summary'];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Financial Reports & Exports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white border border-sky-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center text-xl">📊</div>
              <div>
                <h4 className="font-extrabold text-sky-900">{r}</h4>
                <p className="text-[10px] text-slate-500">Auto-generated for compliance</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-100">PDF</button>
              <button className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded hover:bg-emerald-100">Excel</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 9. Notifications
function TabNotifications() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Important Alerts</h2>
      <div className="space-y-3">
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-rose-900">Urgent: Budget Nearing Limit</h4>
          <p className="text-xs text-rose-700 mt-1">Parks & Recreation department has utilized 95% of its allocated budget.</p>
        </div>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-amber-900">Payment Verification Pending</h4>
          <p className="text-xs text-amber-700 mt-1">14 new fund release requests await your review.</p>
        </div>
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-sky-900">New Invoice Uploaded</h4>
          <p className="text-xs text-sky-700 mt-1">INV-9021 from Bharat Infratech is ready for processing.</p>
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
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
          <input type="text" disabled value="Finance Officer" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Employee ID</label>
          <input type="text" disabled value="FIN-8821" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-medium" />
        </div>
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sky-600" />
            <span className="text-sm font-bold text-slate-700">Enable Two-Factor Authentication (2FA)</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 accent-sky-600" />
            <span className="text-sm font-bold text-slate-700">Email Notifications for New Requests</span>
          </label>
        </div>
        <div className="pt-4">
          <button className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN FINANCE COMPONENT
════════════════════════════════════════════════════════════════ */
function Finance() {
  const { user } = useAuth();
  const userName = user?.name || 'Finance Officer';
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
                💰 Finance & Treasury Command
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Welcome, {userName}</h2>
              <p className="text-sm text-sky-100 mt-1.5 font-medium">
                Role: <span className="text-amber-300 font-bold">Finance Officer</span>
                {' '}• Verify payments, manage budgets, and release funds efficiently.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 flex-wrap">
              <button className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-sky-950 font-black rounded-xl text-xs shadow-md transition-all border-b-2 border-amber-600 cursor-pointer">
                + Process Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing */}
      {activeTab === 'overview' && <TabOverview />}
      {activeTab === 'budgets' && <TabBudget />}
      {activeTab === 'requests' && <TabRequests />}
      {activeTab === 'history' && <TabHistory />}
      {activeTab === 'expenditure' && <TabExpenditure />}
      {activeTab === 'invoices' && <TabInvoices />}
      {activeTab === 'reports' && <TabReports />}
      {activeTab === 'notifications' && <TabNotifications />}
      {activeTab === 'settings' && <TabSettings />}
    </div>
  );
}

export default Finance;
