// Dashboard.tsx
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { theme } from "../theme";
import DashboardCard from "../components/DashboardCard";

function getTodayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return {
    createdFrom: start.toISOString(),
    createdTo: end.toISOString(),
  };
}

export default function Dashboard() {
  const token = localStorage.getItem("token") || "";
  const [placed, setPlaced] = useState([]);
  const [acknowledged, setAcknowledged] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { createdFrom, createdTo } = getTodayRange();
      const [placedRes, ackRes, compRes] = await Promise.all([
        fetchMyOrders(token, { type: "created", createdFrom, createdTo }),
        fetchMyOrders(token, { type: "acknowledged", createdFrom, createdTo }),
        fetchMyOrders(token, { type: "completed", createdFrom, createdTo }),
      ]);
      setPlaced(placedRes);
      setAcknowledged(ackRes);
      setCompleted(compRes);
      setLoading(false);
    }
    fetchData();
  }, [token]);

  return (
    <div 
      className="min-h-screen px-4 py-6"
      style={{ background: theme.colors.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: theme.colors.primary }}
          >
            My Dashboard (Today)
          </h2>
          <p
            className="text-sm opacity-60"
            style={{ color: theme.colors.primary }}
          >
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard
            title="Placed Orders"
            count={placed.length}
            color={theme.colors.info}
            orders={placed}
            loading={loading}
          />
          <DashboardCard
            title="Acknowledged Orders"
            count={acknowledged.length}
            color={theme.colors.warning}
            orders={acknowledged}
            loading={loading}
          />
          <DashboardCard
            title="Completed Orders"
            count={completed.length}
            color={theme.colors.success}
            orders={completed}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
