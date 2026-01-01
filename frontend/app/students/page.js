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
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/services/studentService";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
  });

  useEffect(() => {
    fetchStudents();
  }, [page, search, sortBy, sortDir]);

  const fetchStudents = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getStudents({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });

      setStudents(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    fetchStudents();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudent) {
      await updateStudent(selectedStudent.studentId, formData);
    } else {
      await createStudent(formData);
    }

    setShowModal(false);
    fetchStudents();
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-7">
        <h1 className="text-2xl font-bold mb-5">Students</h1>

        <button
          onClick={() => {
            setSelectedStudent(null);
            setFormData({
              fullName: "",
              studentNumber: "",
              email: "",
            });
            setShowModal(true);
          }}
          className="bg-green-700 text-white px-4 py-2 rounded mb-4"
        >
          + Add Student
        </button>

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
            <option value="fullName">Full Name</option>
            <option value="studentNumber">Student Number</option>
            <option value="email">Email</option>
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
              columns={["Full Name", "Student Number", "Email"]}
              data={students.map((s) => ({
                "Full Name": s.fullName,
                "Student Number": s.studentNumber,
                Email: s.email,
              }))}
              renderActions={(row, index) => {
                const student = students[index];
                return (
                  <>
                    <button
                      className="text-blue-600 mr-3"
                      onClick={() => {
                        setSelectedStudent(student);
                        setFormData({
                          fullName: student.fullName,
                          studentNumber: student.studentNumber,
                          email: student.email,
                        });
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() =>
                        handleDelete(student.studentId)
                      }
                    >
                      Delete
                    </button>
                  </>
                );
              }}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <FormModal
        isOpen={showModal}
        title={selectedStudent ? "Update Student" : "Create Student"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-3"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Student Number"
          value={formData.studentNumber}
          onChange={(e) =>
            setFormData({ ...formData, studentNumber: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />
      </FormModal>
    </ProtectedRoute>
  );
}
