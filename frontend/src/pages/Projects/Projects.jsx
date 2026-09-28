import { useState, useEffect } from 'react';
import api from '../../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        if (res.data?.data?.projects) {
          setProjects(res.data.data.projects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Explore hackathon and community projects</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-600 font-medium">No projects found</p>
          <p className="text-xs text-slate-400 mt-1">
            Projects created through the API will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-slate-900 text-lg">{proj.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">{proj.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md capitalize">
                  {proj.status}
                </span>
                <span className="text-xs text-slate-400">
                  {proj.owner?.name ? `By ${proj.owner.name}` : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;
