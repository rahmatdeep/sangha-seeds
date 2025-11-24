import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api/orders";
import OrderCard from "../components/OrderCard";
import type { Order } from "../types/order";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      await loadOrders();
    };
    fetchOrders();
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {loading ? (
        <div>Loading...</div>
      ) : orders.length === 0 ? (
        <div>No orders assigned.</div>
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            token={token}
            onStatusChange={loadOrders}
          />
        ))
      )}
    </div>
  );
}
