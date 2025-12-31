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
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "@/services/departmentService";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("departmentName");
  const [sortDir, setSortDir] = useState("asc");

  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, [page, search, sortBy, sortDir]);

  const fetchDepartments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getDepartments({
        page,
        size,
        search,
        sortBy,
        sortDir,
      });
      setDepartments(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch {
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this department?")) return;
    await deleteDepartment(id);
    fetchDepartments();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedDepartment) {
      await updateDepartment(selectedDepartment.departmentId, formData);
    } else {
      await createDepartment(formData);
    }

    setShowModal(false);
    fetchDepartments();
  };

  return (
    <ProtectedRoute>
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Departments</h1>

        <button
          onClick={() => {
            setSelectedDepartment(null);
            setFormData({
              departmentName: "",
              departmentCode: "",
              description: "",
            });
            setShowModal(true);
          }}
          className="bg-green-700 text-white px-5 py-2 rounded mb-4"
        >
          + Add Department
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
            <option value="departmentName">Department Name</option>
            <option value="departmentCode">Department Code</option>
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
              columns={["Department Name", "Department Code", "Description"]}
              data={departments.map((d) => ({
                "Department Name": d.departmentName,
                "Department Code": d.departmentCode,
                Description: d.description || "-",
              }))}
              renderActions={(row, index) => (
                <>
                  <button
                    className="text-blue-700 mr-3"
                    onClick={() => {
                      setSelectedDepartment(departments[index]);
                      setFormData({
                        departmentName: departments[index].departmentName,
                        departmentCode: departments[index].departmentCode,
                        description: departments[index].description || "",
                      });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-700"
                    onClick={() =>
                      handleDelete(departments[index].departmentId)
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
        title={selectedDepartment ? "Update Department" : "Create Department"}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
      >
        <input
          className="border p-2 w-full mb-3"
          placeholder="Department Name"
          value={formData.departmentName}
          onChange={(e) =>
            setFormData({ ...formData, departmentName: e.target.value })
          }
          required
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Department Code"
          value={formData.departmentCode}
          onChange={(e) =>
            setFormData({ ...formData, departmentCode: e.target.value })
          }
          required
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </FormModal>
    </ProtectedRoute>
  );
}
