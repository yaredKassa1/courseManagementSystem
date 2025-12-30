"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";
import Navbar from "@/components/Navbar";

export default function InstructorDashboardPage() {
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    pendingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/instructor/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="min-h-screen bg-gradient-to-r from-teal-600 to-cyan-600 p-8 text-white">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2">👩‍🏫 Instructor Dashboard</h1>
          <p className="text-cyan-100">
            Manage your courses and track student progress in real-time.
          </p>
        </header>

        {/* Navigation Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <DashboardCard title="📚 My Courses" link="/instructor/courses" />
          <DashboardCard title="👥 Enrolled Students" link="/instructor/students" />
          <DashboardCard title="📝 Assignments" link="/instructor/assignments" />
          <DashboardCard title="📥 Submissions" link="/instructor/submissions" />
          <DashboardCard title="📣 Announcements" link="/instructor/announcements" />
          <DashboardCard title="👤 Profile" link="/profile" />
        </section>

        {/* Live Insights Widgets */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <StatCard 
            label="Active Courses" 
            value={loading ? "..." : stats.activeCourses} 
          />
          <StatCard 
            label="Enrolled Students" 
            value={loading ? "..." : stats.totalStudents} 
          />
          <StatCard 
            label="Pending Submissions" 
            value={loading ? "..." : stats.pendingSubmissions} 
          />
        </section>
      </div>
    </ProtectedRoute>
  );
}

function DashboardCard({ title, link }) {
  return (
    <Link
      href={link}
      className="bg-white text-teal-700 p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex items-center justify-center border-b-4 border-teal-500"
    >
      <h2 className="text-xl font-bold text-center">{title}</h2>
    </Link>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md text-white p-6 rounded-xl border border-white/20 shadow-md">
      <p className="text-sm font-medium text-cyan-100 uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-extrabold mt-2">{value}</p>
    </div>
  );
}