import api from "./api";

export const getEnrollments = (params) => {
  return api.get("/api/enrollments", {
    params: {
      page: params.page,
      size: params.size,
      search: params.search,
      sortBy: params.sortBy,
      sortDir: params.sortDir,
    },
  });
};

export const createEnrollment = (data) => {
  return api.post("/api/enrollments", data);
};

export const updateEnrollment = (id, data) => {
  return api.put(`/api/enrollments/${id}`, data);
};

export const deleteEnrollment = (id) => {
  return api.delete(`/api/enrollments/${id}`);
};
