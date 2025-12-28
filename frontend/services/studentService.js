import api from "./api";

export const getStudents = (params) => {
  return api.get("/api/students", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createStudent = (data) => {
  return api.post("/api/students", data);
};

export const updateStudent = (id, data) => {
  return api.put(`/api/students/${id}`, data);
};

export const deleteStudent = (id) => {
  return api.delete(`/api/students/${id}`);
};
