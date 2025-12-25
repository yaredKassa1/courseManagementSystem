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

        {/* Core Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Academics */}
          <DashboardCard
            title="📚 Academics"
            description="View enrolled courses, course details, and department info."
            link="/student/academics"
          />

          {/* Enrollments */}
          <DashboardCard
            title="📝 Enrollments"
            description="View current enrollments and enrollment history."
            link="/student/enrollments"
          />

          {/* Progress */}
          <DashboardCard
            title="📊 Progress"
            description="Track credits completed, current semester courses, grades, and GPA."
            link="/student/progress"
          />

          {/* Profile */}
          <DashboardCard
            title="👤 Profile"
            description="View and update limited profile fields like email and password."
            link="/student/profile"
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, description, link }) {
  return (
    <Link
      href={link}
      className="bg-white text-blue-700 p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
    >
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}
