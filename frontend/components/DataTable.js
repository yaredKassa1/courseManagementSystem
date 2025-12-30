export default function DataTable({ columns, data, renderActions }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-sm font-semibold tracking-wide"
              >
                {col}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-left text-sm font-semibold tracking-wide">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-6 text-gray-500"
              >
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={`hover:bg-blue-50 transition ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                {Object.values(row).map((val, i) => (
                  <td
                    key={i}
                    className="px-4 py-3 text-sm text-gray-700 border-t"
                  >
                    {val ?? "-"}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-4 py-3 text-sm text-gray-700 border-t">
                    {renderActions(row, idx)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
