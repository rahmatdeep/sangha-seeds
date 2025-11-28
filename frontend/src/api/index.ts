import axios from "axios";
import { API_BASE_URL } from "../config";
import type { OrderCreate } from "../types";

// auth api calls
export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return res.data.token;
}

// order api calls

export async function fetchAllOrders(token: string, filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/order/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.orders;
}

export async function fetchMyOrders(token: string, filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await axios.get(`${API_BASE_URL}/order/my-orders/?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("orders response", res.data);

  return res.data.orders;
}

export async function acknowledgeOrder(orderId: string, token: string) {
  const res = await axios.post(
    `${API_BASE_URL}/order/acknowledge/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function completeOrder(orderId: string, token: string) {
  const res = await axios.post(
    `${API_BASE_URL}/order/complete/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function createOrder(orderData: OrderCreate, token: string) {
  const res = await axios.post(`${API_BASE_URL}/order/create`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function assignManager(
  orderId: string,
  managerId: string,
  token: string
) {
  const res = await axios.post(
    `${API_BASE_URL}/order/assign-manager/${orderId}`,
    { managerId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function assignEmployee(
  orderId: string,
  employeeId: string,
  token: string
) {
  const res = await axios.post(
    `${API_BASE_URL}/order/assign-employee/${orderId}`,
    { employeeId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

// lots
export async function fetchLots(token: string) {
  const res = await axios.get(`${API_BASE_URL}/lot`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.lots || res.data;
}

// warehouses
export async function fetchWarehouses(token: string) {
  const res = await axios.get(`${API_BASE_URL}/warehouse/warehouses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.warehouses || res.data;
}

// users
export async function fetchUsersByRole(role: string, token: string) {
  const res = await axios.get(`${API_BASE_URL}/user?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.users || res.data;
}

export async function getUser(token: string) {
  const res = await axios.get(`${API_BASE_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
}
