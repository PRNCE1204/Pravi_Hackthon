import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({ iconRetinaUrl: iconRetina, iconUrl: iconUrl, shadowUrl: shadowUrl });

import StatCard from '../../components/dashboard/StatCard';
import ProgressBar from '../../components/dashboard/ProgressBar';

/* ════════════════════════════════════════════════════════════════
   DUMMY DATA
════════════════════════════════════════════════════════════════ */
const KPI_DATA = {
  nearbyProjects: 4,
  myComplaints: 2,
  complaintsResolved: 1,
  activeProjects: 12
};

const NEARBY_PROJECTS = [
  { id: 'RD-2026-001', name: 'NH-48 Highway Repair', dept: 'Roads Department', distance: '1.2 km', progress: 78, status: 'Active', lat: 28.6139, lng: 77.2090 },
  { id: 'PK-2026-088', name: 'Central Park Reno', dept: 'Parks & Rec', distance: '0.8 km', progress: 100, status: 'Completed', lat: 28.6120, lng: 77.2150 },
  { id: 'WT-2026-042', name: 'Sewage Line Upgrade', dept: 'Water Board', distance: '2.5 km', progress: 42, status: 'Active', lat: 28.6200, lng: 77.2000 },
];

const COMPLAINTS = [
  { id: 'C-205', category: 'Pothole on Main St.', location: 'Sector 5', status: 'In Progress', date: '28 Sept 2026', images: 2 },
  { id: 'C-198', category: 'Broken Streetlight', location: 'Downtown', status: 'Resolved', date: '15 Sept 2026', images: 1 },
];

const ANNOUNCEMENTS = [
  { id: 'ANN-1', title: 'Road Repair begins Monday', dept: 'Roads', date: '28 Sept 2026', text: 'Expect temporary diversions on NH-48 between 9 AM and 5 PM.', priority: 'High' },
  { id: 'ANN-2', title: 'Water Supply Notice', dept: 'Water', date: '26 Sept 2026', text: 'Water supply will be halted for 4 hours tomorrow in Zone B.', priority: 'Medium' },
];

const RATINGS = [
  { project: 'Central Park Reno', rating: 4.8, reviews: 312 },
  { project: 'City Hospital Wing C', rating: 4.2, reviews: 156 },
];

/* ════════════════════════════════════════════════════════════════
   COMPONENTS
════════════════════════════════════════════════════════════════ */

// 1. Dashboard (Overview)
function TabOverview() {
  const { user } = useAuth();
  const userName = user?.name || 'Riya Shah';
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Nearby Projects" value={KPI_DATA.nearbyProjects} icon="📍" accentColor="sky" />
        <StatCard title="My Complaints" value={KPI_DATA.myComplaints} icon="📋" accentColor="amber" />
        <StatCard title="Complaints Resolved" value={KPI_DATA.complaintsResolved} icon="✅" accentColor="emerald" />
        <StatCard title="Active City Projects" value={KPI_DATA.activeProjects} icon="🏗️" accentColor="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Recent Activity</h3>
          <div className="space-y-4 border-l-2 border-sky-100 ml-3">
            {[
              { text: 'Road Repair in Sector 5 reached 78% completion.', icon: '🏗️', time: '2 hours ago' },
              { text: 'Your complaint (C-205) has been assigned to an engineer.', icon: '📋', time: 'Yesterday' },
              { text: 'Central Park renovation completed. Rate it now!', icon: '✅', time: '3 days ago' },
            ].map((act, i) => (
              <div key={i} className="relative pl-6 pb-2">
                <span className="absolute -left-[17px] top-0 bg-white p-1 rounded-full border border-sky-200 shadow-sm text-xs">{act.icon}</span>
                <p className="text-sm font-bold text-slate-800">{act.text}</p>
                <p className="text-[10px] text-slate-500 font-bold">{act.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-sky-100 shadow-sm p-6">
          <h3 className="text-lg font-extrabold text-sky-950 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition shadow flex items-center justify-center gap-2">
              <span>⚠️</span> Report an Issue
            </button>
            <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow flex items-center justify-center gap-2">
              <span>📍</span> Explore Nearby Projects
            </button>
            <button className="w-full py-3 bg-slate-50 text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition shadow flex items-center justify-center gap-2">
              <span>📋</span> Track Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Nearby Projects
function TabNearby() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">Nearby Projects</h2>
        <select className="bg-white border border-slate-200 text-sm font-bold text-sky-900 px-4 py-2 rounded-lg shadow-sm">
          <option>Sort by: Nearest</option>
          <option>Sort by: Recent</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {NEARBY_PROJECTS.map(proj => (
          <div key={proj.id} className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>{proj.status}</span>
              <span className="text-xs font-bold text-slate-500">📍 {proj.distance}</span>
            </div>
            <h3 className="font-extrabold text-sky-950 mb-1">{proj.name}</h3>
            <p className="text-xs font-bold text-slate-500 mb-4">{proj.dept}</p>
            <ProgressBar value={proj.progress} max={100} size="sm" colorVariant="emerald" />
            <button className="w-full mt-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Project Explorer
function TabExplorer() {
  const [selectedProject, setSelectedProject] = useState(null);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input type="text" placeholder="Search by Project Name, Department, or Location..." className="flex-1 bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-sm font-bold text-sky-900" />
        <select className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm text-sm font-bold text-sky-900">
          <option>All Departments</option>
          <option>Roads</option>
          <option>Water</option>
        </select>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-sky-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sky-50 text-xs uppercase font-extrabold text-sky-900 border-b border-sky-100">
            <tr>
              <th className="p-4">Project Name</th>
              <th className="p-4">Department</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {NEARBY_PROJECTS.map(proj => (
              <tr key={proj.id} onClick={() => setSelectedProject(proj)} className="hover:bg-slate-50 cursor-pointer">
                <td className="p-4">
                  <div className="font-bold text-slate-800">{proj.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{proj.id}</div>
                </td>
                <td className="p-4 text-sm font-bold text-slate-600">{proj.dept}</td>
                <td className="p-4 text-sm font-bold text-amber-600">₹4.5 Cr</td>
                <td className="p-4"><span className="px-2 py-1 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-lg border border-sky-100">{proj.status}</span></td>
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
                <p className="text-sm text-sky-200 mt-1">{selectedProject.dept} • Budget: ₹4.5 Cr</p>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-sky-200 hover:text-white text-xl">✕</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="text-sm font-extrabold text-sky-950 mb-4">Public Timeline</h4>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 -translate-y-1/2 rounded-full"></div>
                  <div className="absolute top-1/2 left-0 h-1 bg-sky-500 -z-10 -translate-y-1/2 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Proposal</div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Tender</div>
                  <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-sm"></div>Construction</div>
                  <div className="flex flex-col items-center gap-2 opacity-50"><div className="w-4 h-4 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>Completed</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button className="py-3 bg-sky-50 text-sky-700 font-bold border border-sky-200 rounded-xl hover:bg-sky-100">📄 View Project Summary</button>
                <button className="py-3 bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-xl hover:bg-slate-100">📸 View Public Photos</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 4. My Complaints
function TabComplaints() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-xl font-extrabold text-sky-950">My Complaints</h2>
        <button className="px-4 py-2 bg-rose-500 text-white font-bold rounded-lg shadow hover:bg-rose-600">+ Submit New Complaint</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COMPLAINTS.map(comp => (
          <div key={comp.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-mono bg-sky-50 text-sky-700 px-2 py-1 rounded font-bold border border-sky-100">{comp.id}</span>
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${comp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{comp.status}</span>
            </div>
            <h4 className="font-extrabold text-sky-950 mb-1">{comp.category}</h4>
            <p className="text-xs text-slate-500 mb-4">📍 {comp.location} • Submitted: {comp.date}</p>
            <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">📷 {comp.images} Attachments</span>
              <button className="text-xs font-bold text-sky-600 hover:text-sky-800">Track Status →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Map View
function TabMap() {
  const center = [28.6139, 77.2090];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold text-sky-950">Interactive City Map</h2>
      <p className="text-sm text-slate-500 mb-4">Visualize all completed (Green), ongoing (Yellow), and delayed (Red) projects directly on the map.</p>
      <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-sky-200 relative z-0">
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {NEARBY_PROJECTS.map(proj => (
            <Marker key={proj.id} position={[proj.lat, proj.lng]}>
              <Popup>
                <div className="p-1">
                  <h4 className="font-extrabold text-sky-950">{proj.name}</h4>
                  <p className="text-[10px] text-slate-500 mb-1">{proj.dept}</p>
                  <p className="text-xs font-bold text-sky-700">Progress: {proj.progress}%</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                    proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>{proj.status}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// 7. Announcements
function TabAnnouncements() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Public Announcements</h2>
      <div className="space-y-4">
        {ANNOUNCEMENTS.map(ann => (
          <div key={ann.id} className={`p-5 rounded-xl border-l-4 shadow-sm bg-white ${ann.priority === 'High' ? 'border-rose-500 border-y border-r border-rose-100' : 'border-amber-500 border-y border-r border-amber-100'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-extrabold text-sky-950 text-lg">{ann.title}</h4>
              <span className="text-[10px] font-bold text-slate-500">{ann.date}</span>
            </div>
            <p className="text-sm text-slate-700 font-medium mb-3">{ann.text}</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-sky-600">Issued by: {ann.dept} Department</span>
              <button className="text-xs font-bold text-slate-500 hover:text-slate-800">Mark as Read</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Feedback & Ratings
function TabFeedback() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-sky-950">Community Feedback & Ratings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        {RATINGS.map((rate, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-sky-100 shadow-sm text-center">
            <h4 className="font-extrabold text-sky-950 mb-2">{rate.project}</h4>
            <div className="text-3xl font-black text-amber-400 mb-1">⭐ {rate.rating}</div>
            <p className="text-xs font-bold text-slate-500">Based on {rate.reviews} Citizens</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sky-950 mb-2">Submit Your Rating</h3>
        <select className="w-full bg-slate-50 border border-slate-200 p-2 rounded-lg text-sm font-bold text-sky-900">
          <option>Select Completed Project...</option>
          <option>Central Park Reno</option>
        </select>
        <div className="flex gap-2 text-2xl cursor-pointer">
          ⭐ ⭐ ⭐ ⭐ <span className="opacity-30">⭐</span>
        </div>
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm h-24" placeholder="Was the work satisfactory? Did it improve your area?"></textarea>
        <button className="w-full py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 shadow">Submit Feedback</button>
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
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-emerald-900">Complaint Resolved!</h4>
          <p className="text-xs text-emerald-700 mt-1">Your complaint (C-198) regarding 'Broken Streetlight' has been resolved.</p>
        </div>
        <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-r-lg">
          <h4 className="text-sm font-bold text-sky-900">Project Near You Updated</h4>
          <p className="text-xs text-sky-700 mt-1">Contractor uploaded new progress for NH-48 Highway Repair.</p>
        </div>
      </div>
    </div>
  );
}

// 10. Profile & Settings
function TabSettings() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-extrabold text-sky-950">Citizen Profile</h2>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label><input type="text" disabled value={user?.name || 'Riya Shah'} className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-bold" /></div>
        <div><label className="block text-xs font-bold text-slate-500 mb-1">Area / Ward</label><input type="text" disabled value="Sector 5, Downtown" className="w-full bg-slate-50 border border-slate-200 p-2 rounded text-sm font-bold text-slate-600" /></div>
        <div className="pt-4"><button className="px-6 py-2 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700">Save Preferences</button></div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN CITIZEN COMPONENT
════════════════════════════════════════════════════════════════ */
function Citizen() {
  const { user } = useAuth();
  const userName = user?.name || 'Riya Shah';
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
                🏡 Citizen Portal
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">Good Morning, {userName}</h2>
              <p className="text-sm text-sky-100 mt-1.5 font-medium">
                Role: <span className="text-amber-300 font-bold">Resident</span>
                {' '}• Track local projects, report issues, and stay informed about city development.
              </p>
            </div>
            <div className="shrink-0 flex gap-2 flex-wrap">
              <button className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer">
                + New Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Routing */}
      {activeTab === 'overview' && <TabOverview />}
      {activeTab === 'nearby' && <TabNearby />}
      {activeTab === 'explorer' && <TabExplorer />}
      {activeTab === 'complaints' && <TabComplaints />}
      {activeTab === 'map' && <TabMap />}
      {activeTab === 'announcements' && <TabAnnouncements />}
      {activeTab === 'feedback' && <TabFeedback />}
      {activeTab === 'notifications' && <TabNotifications />}
      {activeTab === 'settings' && <TabSettings />}
    </div>
  );
}

export default Citizen;
