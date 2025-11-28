import { useEffect, useState } from "react";
import {
  fetchMyOrders,
  fetchAllOrders,
  fetchLots,
  fetchWarehouses,
  fetchUsersByRole,
} from "../api";
import OrderCard from "../components/OrderCard";
import type { MyOrdersResponseOrder } from "../types";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { FaClipboardList, FaFilter } from "react-icons/fa";
import FilterModal from "../components/FilterModal";
import { toISODateRange } from "../utils/date";

export default function Orders() {
  const [orders, setOrders] = useState<MyOrdersResponseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({});
  const token = localStorage.getItem("token") || "";
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const [lots, setLots] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  // Load orders with filters
  const loadOrders = async (filterParams) => {
    setLoading(true);
    try {
      let data;
      const { createdFrom, createdTo } = toISODateRange(
        filterParams.createdFrom,
        filterParams.createdTo
      );
      // Remove showMyOrders from apiFilters
      const { showMyOrders, ...restFilters } = filterParams; // only add date filters if they exist
      const apiFilters = { ...restFilters };
      if (createdFrom) apiFilters.createdFrom = createdFrom;
      if (createdTo) apiFilters.createdTo = createdTo;

      if (role === "Administrator" && showMyOrders) {
        data = await fetchMyOrders(token, apiFilters);
      } else if (role === "Administrator") {
        data = await fetchAllOrders(token, apiFilters);
      } else {
        data = await fetchMyOrders(token, apiFilters);
      }
      setOrders(data);
    } catch {
      // handle error
    }
    setLoading(false);
  };


  useEffect(() => {
    loadOrders(filters);
    // eslint-disable-next-line
  }, [token, filters]);

  useEffect(() => {
    async function fetchData() {
      setLots(await fetchLots(token));
      setWarehouses(await fetchWarehouses(token));
      setEmployees(await fetchUsersByRole("Employee", token));
      setManagers(await fetchUsersByRole("Manager", token));
    }
    fetchData();
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <h2
          className="text-2xl font-bold"
          style={{ color: theme.colors.primary }}
        >
          {role === "Administrator" ? "All Orders" : "My Orders"}
        </h2>
        <div className="flex gap-2">
          <button
            className="relative px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5"
            style={{
              backgroundColor: theme.colors.accent,
              color: theme.colors.surface,
              borderRadius: theme.borderRadius.lg,
            }}
            onClick={() => setShowFilter(true)}
          >
            <FaFilter />
            <span className="hidden sm:inline">Filter</span>
            {/* Active Filter Badge */}

            {Object.keys(filters).length > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: theme.colors.warning,
                  color: theme.colors.surface,
                }}
              ></span>
            )}
          </button>
          {role === "Administrator" && (
            <button
              className="px-4 py-2 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
              style={{
                backgroundColor: theme.colors.secondary,
                color: theme.colors.surface,
                borderRadius: theme.borderRadius.lg,
              }}
              onClick={() =>
                navigate("/orders/create", {
                  state: { lots, warehouses, employees, managers },
                })
              }
            >
              <span className="text-lg font-bold" style={{ lineHeight: 1 }}>
                +
              </span>
              <span className="hidden sm:inline">Create Order</span>
              <span className="sm:hidden">Create</span>
            </button>
          )}
        </div>
      </div>

      {showFilter && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowFilter(false)}
          lots={lots}
          warehouses={warehouses}
          role={role}
        />
      )}

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
              onStatusChange={() => loadOrders(filters)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
