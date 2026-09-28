function DashboardTable({
  title,
  subtitle,
  columns = [],
  data = [],
  actionButton,
  emptyMessage = 'No records found in this category',
}) {
  return (
    <div className="bg-white rounded-xl border border-sky-100 shadow-xs overflow-hidden">
      {(title || subtitle || actionButton) && (
        <div className="px-6 py-4.5 border-b border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-50/70 to-white">
          <div>
            {title && (
              <h3 className="text-base font-extrabold text-sky-950">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          {actionButton && <div>{actionButton}</div>}
        </div>
      )}

      {data.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-500 font-medium">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#f8fafc] uppercase tracking-wider text-[11px] font-extrabold text-sky-950 border-b border-sky-100">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3.5 whitespace-nowrap">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-sky-50/40 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DashboardTable;
