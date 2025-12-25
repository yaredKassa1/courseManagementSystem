"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
      <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-pink-600 p-8 text-white">
        <h1 className="text-4xl font-bold mb-8 text-center">
          🛠 Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="📚 Courses" link="/courses" />
          <DashboardCard title="🎓 Students" link="/students" />
          <DashboardCard title="👩‍🏫 Instructors" link="/instructors" />
          <DashboardCard title="🏢 Departments" link="/departments" />
          <DashboardCard title="📝 Enrollments" link="/enrollments" />
          <DashboardCard title="👥 User Management" link="/users" />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, link }) {
  return (
    <Link
      href={link}
      className="bg-white text-indigo-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
    >
      <h2 className="text-2xl font-semibold text-center">{title}</h2>
    </Link>
  );
}
