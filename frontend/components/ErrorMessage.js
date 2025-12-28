export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-red-100 text-red-700 p-2 rounded mb-3">
      {message}
    </div>
  );
}
