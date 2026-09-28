function Loader({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-600">
      <div className="w-9 h-9 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
      <p className="text-xs font-bold uppercase tracking-wider text-sky-950">{message}</p>
    </div>
  );
}

export default Loader;
