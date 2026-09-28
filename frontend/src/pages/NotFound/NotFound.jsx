import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <p className="text-6xl font-extrabold text-indigo-600 mb-2">404</p>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
      <p className="text-slate-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
