"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold">Course Management System</h1>

      <div className="flex gap-4 items-center">
        <Link href="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link href="/courses" className="hover:underline">
          Courses
        </Link>
        <Link href="/students" className="hover:underline">
          Students
        </Link>
        <Link href="/instructors" className="hover:underline">
          Instructors
        </Link>
        <Link href="/departments" className="hover:underline">
          Departments
        </Link>
        <Link href="/enrollments" className="hover:underline">
          Enrollments
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
