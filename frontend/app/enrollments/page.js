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
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "@/services/enrollmentService";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("enrollmentDate");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    enrollmentDate: "",
    status: "",
  });

  useEffect(() => {
    fetchEnrollments();
  }, [page, search, sortBy, sortDir]);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getEnrollments({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });

      setEnrollments(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enrollment?")) return;
    await deleteEnrollment(id);
    fetchEnrollments();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedEnrollment) {
      await updateEnrollment(
        selectedEnrollment.enrollmentId,
        formData
      );
    } else {
      await createEnrollment(formData);
    }

    setShowModal(false);
    fetchEnrollments();
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Enrollments</h1>

        <button
          onClick={() => {
            setSelectedEnrollment(null);
            setFormData({
              studentId: "",
              courseId: "",
              enrollmentDate: "",
              status: "",
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Enrollment
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
            <option value="enrollmentDate">Enrollment Date</option>
            <option value="status">Status</option>
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
                "Student ID",
                "Course Name",
                "Enrollment Date",
                "Status",
              ]}
              data={enrollments.map((e) => ({
                "Student Name": e.studentId,
                "Course Name": e.courseName,
                "Enrollment Date": e.enrollmentDate,
                Status: e.status,
              }))}
              renderActions={(row, index) => (
                <>
                  <button
                    className="text-blue-600 mr-3"
                    onClick={() => {
                      const en = enrollments[index];
                      setSelectedEnrollment(en);
                      setFormData({
                        studentId: en.student?.studentId,
                        courseId: en.course?.courseId,
                        enrollmentDate: en.enrollmentDate,
                        status: en.status,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() =>
                      handleDelete(
                        enrollments[index].enrollmentId
                      )
                    }
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

      {/* Create / Update Modal */}
      <FormModal
        isOpen={showModal}
        title={
          selectedEnrollment
            ? "Update Enrollment"
            : "Create Enrollment"
        }
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-3"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={(e) =>
            setFormData({
              ...formData,
              studentId: e.target.value,
            })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Course ID"
          value={formData.courseId}
          onChange={(e) =>
            setFormData({
              ...formData,
              courseId: e.target.value,
            })
          }
          required
        />

        <input
          type="date"
          className="border p-2 w-full mb-3"
          value={formData.enrollmentDate}
          onChange={(e) =>
            setFormData({
              ...formData,
              enrollmentDate: e.target.value,
            })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Status (ACTIVE, DROPPED, COMPLETED)"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value,
            })
          }
        />
      </FormModal>
    </ProtectedRoute>
  );
}
