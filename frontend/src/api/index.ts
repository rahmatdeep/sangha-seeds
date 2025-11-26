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

export async function getUser(token: string) {
  const res = await axios.get(`${API_BASE_URL}/user/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
}

// order api calls

export async function fetchMyOrders(token: string) {
  const res = await axios.get(
    `${API_BASE_URL}/order/my-orders/?createdFrom=2025-08-01`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
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
