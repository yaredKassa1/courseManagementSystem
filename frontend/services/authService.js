import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  localStorage.setItem("token", response.data.token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};
