"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import api from "@/services/api";

export default function InstructorStudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/instructor/my-students");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold mb-6">👥 Enrolled Students</h1>
        
        {loading ? (
          <p>Loading roster...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Enrollment Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item) => (
                  <tr key={item.enrollmentId} className="border-b hover:bg-gray-50 transition">
                    <td className="p-4 font-medium">{item.studentName}</td>
                    <td className="p-4">{item.courseName}</td>
                    <td className="p-4">{item.enrollmentDate}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}