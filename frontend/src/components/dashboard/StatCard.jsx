function StatCard({
  title,
  value,
  icon,
  trend,
  subtitle,
  accentColor = 'sky',
}) {
  const colorMap = {
    sky: 'text-sky-700 bg-sky-50 border-sky-200',
    royal: 'text-sky-700 bg-sky-50 border-sky-200',
    gold: 'text-amber-800 bg-amber-50 border-amber-300',
    amber: 'text-amber-800 bg-amber-50 border-amber-300',
    blue: 'text-sky-700 bg-sky-50 border-sky-200',
    emerald: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    indigo: 'text-sky-700 bg-sky-50 border-sky-200',
    purple: 'text-purple-800 bg-purple-50 border-purple-200',
  };

  const selectedColor = colorMap[accentColor] || colorMap.sky;

  return (
    <div className="bg-white rounded-xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between hover:border-sky-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-sky-950 mt-1.5 tracking-tight">
            {value}
          </h3>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl border text-xl flex items-center justify-center shadow-2xs ${selectedColor}`}>
            {icon}
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend && (
            <span
              className={`font-bold inline-flex items-center gap-1 ${
                trend.startsWith('+') || trend.startsWith('↑')
                  ? 'text-emerald-700'
                  : 'text-sky-700 font-semibold'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
