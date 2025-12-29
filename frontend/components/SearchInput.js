export default function SearchInput({ value, onChange }) {
  return (
    <input
      className="border p-2 rounded text-amber-600"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
