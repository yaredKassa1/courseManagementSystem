"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const res = await api.get("/api/enrollments"); // ✅ backend endpoint
      setEnrollments(res.data.data);
    };
    fetchEnrollments();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">📝 My Enrollments</h1>
        <table className="w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3">Course</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enroll) => (
              <tr key={enroll.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{enroll.courseName}</td>
                <td className="p-3">{enroll.status}</td>
                <td className="p-3">
                  {new Date(enroll.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}