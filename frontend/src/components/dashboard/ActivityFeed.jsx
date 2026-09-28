/**
 * ActivityFeed component - displays a chronological feed of system activities
 * Used across all dashboards to show recent actions and notifications
 */
function ActivityFeed({ title = 'Recent Activity', items = [], maxItems = 6 }) {
  const typeStyles = {
    success: { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-800', icon: '✅' },
    warning: { dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-900', icon: '⚠️' },
    error:   { dot: 'bg-rose-500',   badge: 'bg-rose-100 text-rose-800',    icon: '🚨' },
    info:    { dot: 'bg-sky-500',    badge: 'bg-sky-100 text-sky-800',      icon: 'ℹ️' },
    system:  { dot: 'bg-violet-500', badge: 'bg-violet-100 text-violet-800', icon: '⚙️' },
  };

  const displayItems = items.slice(0, maxItems);

  return (
    <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50/70 to-white">
        <h3 className="text-base font-extrabold text-sky-950">{title}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Real-time audit trail of platform activities
        </p>
      </div>

      <div className="divide-y divide-slate-50">
        {displayItems.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-500">No recent activity</div>
        ) : (
          displayItems.map((item, idx) => {
            const style = typeStyles[item.type] || typeStyles.info;
            return (
              <div key={idx} className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-sky-50/30 transition-colors">
                {/* Dot indicator */}
                <div className="flex flex-col items-center pt-1 shrink-0">
                  <span className={`w-2 h-2 rounded-full ${style.dot} ring-2 ring-offset-1 ring-white`} />
                  {idx < displayItems.length - 1 && (
                    <span className="w-px h-8 bg-slate-100 mt-1" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {item.message}
                    </p>
                    <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${style.badge}`}>
                      {item.type?.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                    {item.user && <span className="font-medium">by {item.user}</span>}
                    {item.user && item.time && <span>•</span>}
                    {item.time && <span>{item.time}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="px-5 py-3 border-t border-slate-50 bg-slate-50/40">
        <button className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors">
          View full audit log →
        </button>
      </div>
    </div>
  );
}

export default ActivityFeed;
