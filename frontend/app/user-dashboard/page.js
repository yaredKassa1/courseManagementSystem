"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🎓 Student Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="📘 My Courses" link="/my-courses" />
          <DashboardCard title="📝 My Enrollments" link="/my-enrollments" />
          <DashboardCard title="👤 Profile" link="/profile" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, link }) {
  return (
    <Link
      href={link}
      className="bg-white text-blue-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
    >
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
    </Link>
  );
}