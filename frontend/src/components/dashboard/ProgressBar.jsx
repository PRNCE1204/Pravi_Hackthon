/**
 * Reusable ProgressBar component for dashboards
 * Supports multiple color variants aligned with the sky-blue/golden-yellow color scheme
 */
function ProgressBar({ value = 0, max = 100, label, sublabel, showPercent = true, colorVariant = 'sky', size = 'md' }) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const barColors = {
    sky: 'bg-sky-500',
    gold: 'bg-amber-400',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
    violet: 'bg-violet-500',
  };

  const trackColors = {
    sky: 'bg-sky-100',
    gold: 'bg-amber-100',
    emerald: 'bg-emerald-100',
    rose: 'bg-rose-100',
    violet: 'bg-violet-100',
  };

  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

  const barColor = barColors[colorVariant] || barColors.sky;
  const trackColor = trackColors[colorVariant] || trackColors.sky;
  const height = heights[size] || heights.md;

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-semibold text-slate-700 truncate">{label}</span>}
          <div className="flex items-center gap-2 shrink-0">
            {sublabel && <span className="text-[11px] text-slate-500">{sublabel}</span>}
            {showPercent && (
              <span className="text-xs font-extrabold text-sky-700 min-w-[2.5rem] text-right">
                {pct}%
              </span>
            )}
          </div>
        </div>
      )}
      <div className={`w-full ${trackColor} rounded-full overflow-hidden ${height}`}>
        <div
          className={`${barColor} ${height} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
