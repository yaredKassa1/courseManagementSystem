"use client";
import { useEffect, useState } from "react";
import api from "@/services/api"; // Your axios instance with JWT interceptor

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Updated endpoint: calls the "My Courses" logic
        const res = await api.get("/api/student/my-courses");
        setCourses(res.data); 
      } catch (err) {
        console.error("Failed to fetch personal courses", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">📘 My Enrolled Courses</h1>
      <div className="grid gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.courseId} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h2 className="text-xl font-semibold">{course.courseName}</h2>
              <p className="text-gray-600">Instructor: {course.instructor?.fullName}</p>
              <p className="text-sm text-gray-500 mt-2">{course.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
}