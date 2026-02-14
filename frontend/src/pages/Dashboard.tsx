// Dashboard.tsx
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { theme } from "../theme";
import DashboardCard from "../components/DashboardCard";
import Dropdown from "../components/ui/Dropdown";
import Calendar from "../components/ui/Calendar";

const rangeOptions = [
  { value: "today", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "2months", label: "Last 2 Months" },
  { value: "custom", label: "Custom Range" },
];
function getRangeDates(range: string, customFrom?: string, customTo?: string) {
  const now = new Date();
  let from: Date, to: Date;

  switch (range) {
    case "today":
      from = new Date(now);
      from.setHours(0, 0, 0, 0);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
      break;
    case "week": {
      from = new Date(now);
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      from.setDate(now.getDate() + diff);
      from.setHours(0, 0, 0, 0);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
      break;
    }
    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
      break;
    case "2months":
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
      break;
    case "custom":
      // If only FROM is selected: from that date to today
      if (customFrom && !customTo) {
        from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        to = new Date(now);
        to.setHours(23, 59, 59, 999);
      }
      // If only TO is selected: from beginning of that month to that date
      else if (!customFrom && customTo) {
        to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
        from = new Date(to.getFullYear(), to.getMonth(), 1);
        from.setHours(0, 0, 0, 0);
      }
      // If both selected: use both
      else if (customFrom && customTo) {
        from = new Date(customFrom);
        from.setHours(0, 0, 0, 0);
        to = new Date(customTo);
        to.setHours(23, 59, 59, 999);
      }
      // If neither selected: default to today
      else {
        from = new Date(now);
        from.setHours(0, 0, 0, 0);
        to = new Date(now);
        to.setHours(23, 59, 59, 999);
      }
      break;
    default:
      from = new Date(now);
      from.setHours(0, 0, 0, 0);
      to = new Date(now);
      to.setHours(23, 59, 59, 999);
  }

  return {
    createdFrom: from.toISOString(),
    createdTo: to.toISOString(),
  };
}

function getDateRangeDisplay(
  range: string,
  customFrom?: string,
  customTo?: string,
) {
  const now = new Date();

  switch (range) {
    case "today":
      return now.toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    case "week": {
      const weekStart = new Date(now);
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      weekStart.setDate(now.getDate() + diff);
      return `${weekStart.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })} - ${now.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}`;
    }
    case "month":
      return now.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    case "2months": {
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      return `${twoMonthsAgo.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })} - ${now.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      })}`;
    }
    case "custom":
      // From date only: show "From [date] to Today"
      if (customFrom && !customTo) {
        const from = new Date(customFrom);
        return `From ${from.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })} to Today`;
      }
      // To date only: show "Month [year] to [date]"
      else if (!customFrom && customTo) {
        const to = new Date(customTo);
        const from = new Date(to.getFullYear(), to.getMonth(), 1);
        return `${from.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })} - ${to.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }
      // Both dates: show range
      else if (customFrom && customTo) {
        const from = new Date(customFrom);
        const to = new Date(customTo);
        return `${from.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })} - ${to.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      }
      return "Select at least one date";
    default:
      return "";
  }
}

export default function Dashboard() {
  const [placed, setPlaced] = useState([]);
  const [acknowledged, setAcknowledged] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("today");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { createdFrom, createdTo } = getRangeDates(
        range,
        customFrom,
        customTo,
      );

      try {
        const [placedRes, ackRes, compRes] = await Promise.all([
          fetchMyOrders({ type: "created", createdFrom, createdTo }),
          fetchMyOrders({
            type: "acknowledged",
            createdFrom,
            createdTo,
          }),
          fetchMyOrders({ type: "completed", createdFrom, createdTo }),
        ]);
        setPlaced(placedRes);
        setAcknowledged(ackRes);
        setCompleted(compRes);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    // For custom range, fetch even with just one date selected
    fetchData();
  }, [range, customFrom, customTo]);

  return (
    <div
      className="min-h-screen px-4 py-6"
      style={{ background: theme.colors.background }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header with Date Filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: theme.colors.primary }}
              >
                My Dashboard
              </h2>
              <p
                className="text-sm opacity-60"
                style={{ color: theme.colors.primary }}
              >
                {getDateRangeDisplay(range, customFrom, customTo)}
              </p>
            </div>
            <div className="w-full sm:w-48 shrink-0">
              <Dropdown
                options={rangeOptions}
                value={range}
                onChange={(val) => {
                  setRange(val);
                  if (val !== "custom") {
                    setCustomFrom("");
                    setCustomTo("");
                  }
                }}
                placeholder="Select range"
              />
            </div>
          </div>

          {/* Custom Range Picker */}
          {range === "custom" && (
            <div
              className="rounded-xl p-4 mb-4"
              style={{
                background: theme.colors.surface,
                border: `1px solid ${theme.colors.accent}`,
              }}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Calendar
                    label="From Date (optional)"
                    value={customFrom}
                    onChange={setCustomFrom}
                    max={customTo || undefined}
                  />
                </div>
                <div className="flex-1">
                  <Calendar
                    label="To Date (optional)"
                    value={customTo}
                    onChange={setCustomTo}
                    min={customFrom || undefined}
                  />
                </div>
              </div>
            </div>
          )}
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
