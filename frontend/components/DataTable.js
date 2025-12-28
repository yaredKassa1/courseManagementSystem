export default function DataTable({ columns, data, renderActions }) {
  return (
    <table className="w-full border">
      <thead className="bg-gray-200">
        <tr>
          {columns.map((col) => (
            <th key={col} className="border p-2">
              {col}
            </th>
          ))}
          {renderActions && <th className="border p-2">Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="text-center p-4">
              No records found
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx}>
              {Object.values(row).map((val, i) => (
                <td key={i} className="border p-2">
                  {val ?? "-"}
                </td>
              ))}

              {renderActions && (
                <td className="border p-2">
                  {renderActions(row, idx)}
                </td>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
