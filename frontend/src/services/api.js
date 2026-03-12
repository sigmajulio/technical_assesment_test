import axios from "axios";

const api = axios.create({
  baseURL: "https://technicalassesmenttest-production.up.railway.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

// --- Products ---
export const getProducts = (params = {}) => api.get("/products", { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post("/products", data);
export const updateProduct = (id, data) => api.patch(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// --- Providers ---
export const getProviders = (params = {}) => api.get("/providers", { params });
export const getProvider = (id) => api.get(`/providers/${id}`);
export const createProvider = (data) => api.post("/providers", data);
export const updateProvider = (id, data) => api.patch(`/providers/${id}`, data);
export const deleteProvider = (id) => api.delete(`/providers/${id}`);
