"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api"; // Your axios instance
import Loader from "@/components/Loader";

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        // MATCHING: The URL must match the Controller's RequestMapping
        const res = await api.get("/api/student/my-enrollments");
        setEnrollments(res.data); 
      } catch (err) {
        console.error("Error fetching enrollments", err);
        setError("Failed to load your enrollment data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">📝 My Enrolled Courses</h1>
          
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
              <p className="text-xl">You haven't enrolled in any courses yet.</p>
            </div>
          ) : (
            <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-blue-700 text-white">
                  <tr>
                    <th className="p-4 uppercase text-xs font-bold">Course Name</th>
                    <th className="p-4 uppercase text-xs font-bold">Credits</th>
                    <th className="p-4 uppercase text-xs font-bold">Enrollment Date</th>
                    <th className="p-4 uppercase text-xs font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments.map((enroll) => (
                    <tr key={enroll.enrollmentId} className="hover:bg-blue-50 transition">
                      {/* Note: The keys below match the Java Map.put() keys */}
                      <td className="p-4 font-semibold text-gray-800">{enroll.courseName}</td>
                      <td className="p-4 text-gray-600">{enroll.credits}</td>
                      <td className="p-4 text-gray-600">{enroll.enrollmentDate}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          enroll.status === 'ENROLLED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {enroll.status || 'ACTIVE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}