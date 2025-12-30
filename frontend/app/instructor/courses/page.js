"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import api from "@/services/api";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/instructor/my-courses");
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_INSTRUCTOR"]}>
      <Navbar />
      <div className="p-8 bg-gray-50 min-h-screen text-gray-800">
        <h1 className="text-3xl font-bold mb-6">📚 My Assigned Courses</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading courses...</p>
          ) : courses.map((course) => (
            <div key={course.courseId} className="bg-white p-6 rounded-xl shadow border-l-4 border-teal-500">
              <h2 className="text-xl font-bold mb-2">{course.courseName}</h2>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-400">
                <span>Credits: {course.credits}</span>
                <span>ID: {course.courseCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}