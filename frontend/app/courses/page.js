"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import DataTable from "@/components/DataTable";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/services/courseService";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("courseName");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    credits: "",
    semester: "",
    departmentId: "",
    instructorId: "",
  });

  useEffect(() => {
    fetchCourses();
  }, [page, search, sortBy, sortDir]);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getCourses({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });

      setCourses(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse(id);
    fetchCourses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedCourse) {
      await updateCourse(selectedCourse.courseId, formData);
    } else {
      await createCourse(formData);
    }

    setShowModal(false);
    fetchCourses();
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Courses</h1>

        <button
          onClick={() => {
            setSelectedCourse(null);
            setFormData({
              courseName: "",
              courseCode: "",
              description: "",
              credits: "",
              semester: "",
              departmentId: "",
              instructorId: "",
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Course
        </button>

        {/* Search & Sort */}
        <div className="flex gap-3 mb-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />

          <select
            className="border p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="courseName">Course Name</option>
            <option value="courseCode">Course Code</option>
          </select>

          <select
            className="border p-2"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>

        {loading && <Loader />}
        <ErrorMessage message={error} />

        {!loading && !error && (
          <>
            <DataTable
              columns={[
                "Course Name",
                "Course Code",
                "Credits",
                "Semester",
                "Department Name",
                "Instructor Name",
              ]}
              data={courses.map((c) => ({
                "Course Name": c.courseName,
                "Course Code": c.courseCode,
                Credits: c.credits,
                Semester: c.semester,
                Department: c.departmentName,
                Instructor: c.instructorName,
              }))}
              renderActions={(row, index) => (
                <>
                  <button
                    className="text-blue-600 mr-3"
                    onClick={() => {
                      setSelectedCourse(courses[index]);
                      setFormData({
                        courseName: courses[index].courseName,
                        courseCode: courses[index].courseCode,
                        description: courses[index].description || "",
                        credits: courses[index].credits,
                        semester: courses[index].semester,
                        departmentId: courses[index].departmentId,
                        instructorId: courses[index].instructorId,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(courses[index].courseId)}
                  >
                    Delete
                  </button>
                </>
              )}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Modal */}
      <FormModal
        isOpen={showModal}
        title={selectedCourse ? "Update Course" : "Create Course"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-3"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={(e) =>
            setFormData({ ...formData, courseName: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Course Code"
          value={formData.courseCode}
          onChange={(e) =>
            setFormData({ ...formData, courseCode: e.target.value })
          }
          required
        />

        <input
          type="number"
          className="border p-2 w-full mb-3"
          placeholder="Credits"
          value={formData.credits}
          onChange={(e) =>
            setFormData({ ...formData, credits: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Semester"
          value={formData.semester}
          onChange={(e) =>
            setFormData({ ...formData, semester: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Department ID"
          value={formData.departmentId}
          onChange={(e) =>
            setFormData({ ...formData, departmentId: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Instructor ID"
          value={formData.instructorId}
          onChange={(e) =>
            setFormData({ ...formData, instructorId: e.target.value })
          }
          required
        />
      </FormModal>
    </ProtectedRoute>
  );
}
