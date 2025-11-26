import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import OrderCard from "../components/OrderCard";
import type { MyOrdersResponseOrder } from "../types";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaClipboardList } from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState<MyOrdersResponseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

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
      setLoading(true);
      try {
        const data = await fetchMyOrders(token);
        setOrders(data);
      } catch {
        // handle error
      }
      setLoading(false);
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          My Orders
        </h2>

        {role === "Administrator" && (
          <button
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            style={{
              backgroundColor: theme.colors.secondary,
              color: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            }}
            onClick={() => navigate("/orders/create")}
          >
            <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
              +
            </span>
            <span className="hidden sm:inline">Create Order</span>
            <span className="sm:hidden">Create</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg p-6"
              style={{
                backgroundColor: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div
                className="h-4 rounded mb-3"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "40%",
                }}
              />
              <div
                className="h-3 rounded mb-2"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "60%",
                }}
              />
              <div
                className="h-3 rounded"
                style={{
                  backgroundColor: theme.colors.accent,
                  width: "50%",
                }}
              />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div
          className="text-center py-16 px-6 rounded-lg"
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            border: `1px dashed ${theme.colors.accent}`,
          }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: theme.colors.background,
            }}
          >
            <FaClipboardList
              className="w-8 h-8"
              style={{ color: theme.colors.primary }}
            />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: theme.colors.primary }}
          >
            No orders yet
          </h3>
          <p
            className="text-sm"
            style={{ color: theme.colors.primary, opacity: 0.7 }}
          >
            {role === "Administrator"
              ? "Create your first order to get started"
              : "Orders assigned to you will appear here"}
          </p>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              token={token}
              onStatusChange={loadOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
}
