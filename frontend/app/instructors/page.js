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
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "@/services/instructorService";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("fullName");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    departmentId: "",
  });

  useEffect(() => {
    fetchInstructors();
  }, [page, search, sortBy, sortDir]);

  const fetchInstructors = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getInstructors({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });

      setInstructors(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load instructors");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this instructor?")) return;
    await deleteInstructor(id);
    fetchInstructors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedInstructor) {
      await updateInstructor(selectedInstructor.instructorId, formData);
    } else {
      await createInstructor(formData);
    }

    setShowModal(false);
    fetchInstructors();
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Instructors</h1>

        <button
          onClick={() => {
            setSelectedInstructor(null);
            setFormData({
              fullName: "",
              email: "",
              phoneNumber: "",
              specialization: "",
              departmentId: "",
            });
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          + Add Instructor
        </button>

        <div className="flex gap-3 mb-4">
          <SearchInput value={search} onChange={setSearch} />

          <select
            className="border p-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="fullName">Full Name</option>
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
              columns={[
                "Full Name",
                "Email",
                "Phone",
                "Specialization",
                "Department ID",
              ]}
              data={instructors.map((i) => ({
                "Full Name": i.fullName,
                Email: i.email,
                Phone: i.phoneNumber || "-",
                Specialization: i.specialization || "-",
                "Department ID": i.departmentId,
              }))}
              renderActions={(row, index) => (
                <>
                  <button
                    className="text-blue-600 mr-3"
                    onClick={() => {
                      setSelectedInstructor(instructors[index]);
                      setFormData({
                        fullName: instructors[index].fullName,
                        email: instructors[index].email,
                        phoneNumber: instructors[index].phoneNumber || "",
                        specialization:
                          instructors[index].specialization || "",
                        departmentId: instructors[index].departmentId,
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-600"
                    onClick={() =>
                      handleDelete(instructors[index].instructorId)
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

      <FormModal
        isOpen={showModal}
        title={
          selectedInstructor ? "Update Instructor" : "Create Instructor"
        }
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
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={(e) =>
            setFormData({ ...formData, specialization: e.target.value })
          }
        />

        <input
          className="border p-2 w-full"
          placeholder="Department ID"
          value={formData.departmentId}
          onChange={(e) =>
            setFormData({ ...formData, departmentId: e.target.value })
          }
          required
        />
      </FormModal>
    </ProtectedRoute>
  );
}
