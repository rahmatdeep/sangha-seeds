import axios from "axios";
import { API_BASE_URL } from "../config";

export async function fetchMyOrders(token: string) {
  const res = await axios.get(`${API_BASE_URL}/order/my-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
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
