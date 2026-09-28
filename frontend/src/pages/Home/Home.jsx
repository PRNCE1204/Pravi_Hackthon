import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-full mb-6">
        🚀 Production-Ready MERN Stack Architecture
      </div>
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-3xl">
        Modern Scalable Full-Stack Foundation
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Engineered for hackathons and rapid production growth. Featuring React 19,
        Tailwind CSS v4, Express MVC architecture, JWT auth, and Mongoose schemas.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/projects"
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
        >
          Explore Projects
        </Link>
        <Link
          to="/dashboard"
          className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Home;
