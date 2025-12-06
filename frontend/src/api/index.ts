import api from "./interceptor";
import type { GlobalSearchQuery, OrderCreate, UserCreate } from "../types";

// auth api calls
export async function login(email: string, password: string) {
  const res = await api.post("/auth/login", { email, password });
  return res.data.token;
}

// order api calls

export async function fetchAllOrders(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/order/?${params}`);
  return res.data.orders;
}

export async function fetchMyOrders(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/order/my-orders/?${params}`);
  return res.data.orders;
}

export async function acknowledgeOrder(orderId: string) {
  const res = await api.post(`/order/acknowledge/${orderId}`);
  return res.data;
}

export async function completeOrder(orderId: string) {
  const res = await api.post(`/order/complete/${orderId}`);
  return res.data;
}

export async function createOrder(orderData: OrderCreate) {
  const res = await api.post("/order/create", orderData);
  return res.data;
}

export async function assignManager(orderId: string, managerId: string) {
  const res = await api.post(`/order/assign-manager/${orderId}`, { managerId });
  return res.data;
}

export async function assignEmployee(orderId: string, employeeId: string) {
  const res = await api.post(`/order/assign-employee/${orderId}`, {
    employeeId,
  });
  return res.data;
}

// lots
export async function fetchLots(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/lot?${params}`);
  return res.data.lots || res.data;
}

export async function createLot(lotData: any) {
  const res = await api.post("/lot", lotData);
  return res.data;
}
// warehouses
export async function fetchWarehouses(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/warehouse/?${params}`);
  return res.data.warehouses || res.data;
}

// users
export async function fetchUsersByRole(role: string) {
  const res = await api.get(`/user?role=${role}`);
  return res.data.users || res.data;
}

export async function getUser() {
  const res = await api.get("/user/me");
  return res.data.user;
}

export async function createUser(userData: UserCreate) {
  const res = await api.post("/user/create", userData);
  return res.data;
}
export async function fetchUsersForTab(
  tab: "Administrator" | "Managers" | "Employee",
  filters: Record<string, any> = {}
) {
  if (tab === "Administrator") {
    return fetchUsersByRoleWithFilters("Administrator", filters);
  }
  if (tab === "Employee") {
    return fetchUsersByRoleWithFilters("Employee", filters);
  }
  // Managers tab = Manager + ReadOnlyManager
  const [managers, readOnlyManagers] = await Promise.all([
    fetchUsersByRoleWithFilters("Manager", filters),
    fetchUsersByRoleWithFilters("ReadOnlyManager", filters),
  ]);
  // Deduplicate by user id
  const merged = [...managers, ...readOnlyManagers];
  const unique = Array.from(new Map(merged.map((u) => [u.id, u])).values());
  return unique;
}

// Helper function to fetch users by role with filters
export async function fetchUsersByRoleWithFilters(
  role: string,
  filters: Record<string, any> = {}
) {
  const params = new URLSearchParams({ ...filters, role }).toString();
  const res = await api.get(`/user?${params}`);
  return res.data.users || res.data;
}
// varieties
export async function fetchVarieties(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await api.get(`/variety/?${params}`);
  return res.data.varieties || res.data;
}

export async function createVariety(varietyData: { name: string }) {
  const res = await api.post("/variety/", varietyData);
  return res.data;
}

// global search
export async function globalSearch(params: GlobalSearchQuery) {
  const searchParams = new URLSearchParams(params).toString();
  const res = await api.get(`/search?${searchParams}`);
  return res.data.results;
}
