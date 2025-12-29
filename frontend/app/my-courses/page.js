"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/services/api";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/api/courses");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Axios error:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["ROLE_USER"]}>
      <div className="p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">📘 My Courses</h1>
        <div className="grid gap-6">
          {courses.map((course) => (
            <div
              key={course.courseId} // ✅ use courseId
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold text-blue-600">
                {course.courseName} {/* ✅ use courseName */}
              </h2>
              <p className="mt-2">Instructor: {course.instructorName}</p>
              <p>Department: {course.departmentName}</p>
              <p className="text-sm text-gray-500 mt-2">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}